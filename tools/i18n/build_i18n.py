#!/usr/bin/env python3
"""Build the German pages from the English source and one catalog.

Offline generator, run by hand; its output (`de/*.html`) is committed exactly
like the two map fragments, so German gets a real URL, a real `<html lang="de">`
and real `hreflang` pairs without a byte of runtime code. The four standalone
pages load no JavaScript at all and the CV's content is never hidden pending
script, so a generated tree is the only bilingual shape that keeps both
promises. Nothing here runs at page load.

    python3 tools/i18n/build_i18n.py --extract     # new keys into i18n/de.json
    python3 tools/i18n/build_i18n.py --render-markers  # markers only, catalog untouched
    python3 tools/i18n/build_i18n.py --merge       # fold i18n/pending/*.json in
    python3 tools/i18n/build_i18n.py --build       # rewrite de/*.html
    python3 tools/i18n/build_i18n.py --check       # the gate: exit 0 with `problems 0`

The gate is `--check` exiting 0 *and* printing `problems             0`; it always
prints the counts and the problems line, success included, so a log can be
grepped. `--extract`, `--merge` and `--build` print the same summary block.

What it translates
  - text nodes outside `script`, `style`, the SVG sprite (`<symbol>`) and any
    subtree whose nearest `lang` is `de`;
  - `alt`, `aria-label`, `title`, `placeholder`, the `<title>` element and the
    listed `<meta>` descriptions (`description`, `og:*`, `twitter:*`,
    `dc:description`, `dc:title`, `schema_org:description`);
  - the values of `script[data-typed-phrases]` and `script[data-ui-strings]`;
  - the inner HTML of a `data-i18n="key"` element, via the catalog's `rich`.

What it deliberately does not translate
  - `<script type="application/ld+json">` and `meta[name=keywords]` (structured
    data and keyword lists stay canonical; see `SKIP_META`);
  - `lang="de"` subtrees (German publication, event and course titles are copied
    byte for byte);
  - SVG geometry: the map fragments keep their `d` attributes, only their
    `<title>` and `<desc>` are text nodes;
  - asset paths in CSS, and every URL that is not one of the four rewritten
    routing values (`<html lang>`, `og:locale`, canonical/`og:url`, asset
    prefixes).

How it rewrites
  The page is parsed with `html.parser` into an event list with absolute
  character offsets, and changed spans are spliced in reverse order. The
  document is never re-serialised and no byte outside a replaced span is
  touched. Attribute values are located from `get_starttag_text()` per tag, not
  by a regex over the document.

Marker blocks (generator-owned, never translated)
  Two comment-delimited regions are rendered from tables in this file and
  spliced into the pages:

  * `lang-alt:begin` … `lang-alt:end` — the head's `hreflang` alternates. They
    are identical in both languages (absolute URLs), so one table renders both.
  * `lang-switch:begin` … `lang-switch:end` — the EN | DE switch in the header.
    Two cells — one anchor for the other language and one current `<span>` —
    `EN` first and `DE` second in both languages. The region
    is skipped by the translatable-string scan and by the coverage/parity rules,
    and `--check` compares it byte for byte (line indentation aside) against the
    rendering for that language.

  The switch's six natural-language strings are component chrome, not page
  content, so they are not catalog keys. `SWITCH_TEXT` is the whole table:

      language          group label   current cell        target cell
      en                Language      " — current language"  " — Deutsch"
      de                Sprache       " — aktuelle Sprache"  " — English"

  Only `EN`/`DE` are visible; each clarifier is a `visually-hidden` sentence,
  concatenated to the visible label (`EN — current language`).

Determinism
  Same inputs produce byte-identical output: keys are sorted, replacements are
  applied by offset, JSON is dumped with fixed separators and no timestamps.
  Two consecutive `--build` runs must leave `git diff --stat` empty.
"""

from __future__ import annotations

import argparse
import html.parser
import json
import re
import sys
from pathlib import Path

SITE = "https://schiller-stoff.github.io"
CATALOG_PATH = Path("i18n") / "de.json"
PENDING_DIR = Path("i18n") / "pending"
OUTPUT_DIR = Path("de")

# name, English file, URL path used by the hreflang alternates
PAGES = (
    ("index", "index.html", ""),
    ("storymap", "storymap.html", "storymap.html"),
    ("memor", "memor.html", "memor.html"),
    ("globe", "globe.html", "globe.html"),
    ("ai-agents", "ai-agents.html", "ai-agents.html"),
    ("ai-coding", "ai-coding.html", "ai-coding.html"),
    ("writing", "writing.html", "writing.html"),
    ("writing-agents", "writing-agents.html", "writing-agents.html"),
    ("writing-copilot", "writing-copilot.html", "writing-copilot.html"),
    ("writing-architecture", "writing-architecture.html", "writing-architecture.html"),
    ("writing-fair-code", "writing-fair-code.html", "writing-fair-code.html"),
    ("writing-organisation", "writing-organisation.html", "writing-organisation.html"),
)

VOID_TAGS = frozenset(
    """
    area base br col embed hr img input link meta param source track wbr
    """.split()
)

# Never translate inside these elements (the sprite's `<title>` is a drawing
# label, not prose).
TEXT_SKIP_TAGS = frozenset({"script", "style", "symbol"})
ATTR_SKIP_TAGS = frozenset({"symbol"})

TRANSLATABLE_ATTRS = frozenset({"alt", "aria-label", "title", "placeholder"})

# `name="..."` or `property="..."` -> translated `content`.
TRANSLATABLE_META = frozenset(
    {
        "name:description",
        "property:og:title",
        "property:og:description",
        "property:og:image:alt",
        "name:twitter:title",
        "name:twitter:description",
        "name:twitter:image:alt",
        "name:dc:description",
        "name:dc:title",
        "name:schema_org:description",
    }
)

# Explicit skip list, so a later `--check` cannot flag them by accident:
# keyword lists and structured data stay canonical in both languages.
SKIP_META = frozenset({"name:keywords", "name:schema_org:keywords"})
SKIP_SCRIPTS = frozenset({"application/ld+json"})

ASSET_PREFIXES = (
    "css/",
    "js/",
    "data/",
    "images/",
    "fonts/",
    "favicon.png",
    "favicon.svg",
    "favicon-32.png",
    "apple-touch-icon.png",
)

WHITESPACE = re.compile(r"\s+")
LANG_ALT = re.compile(
    r"(?P<indent>[ \t]*)<!-- lang-alt:begin -->.*?<!-- lang-alt:end -->[ \t]*",
    re.DOTALL,
)
LANG_SWITCH = re.compile(
    r"(?P<indent>[ \t]*)<!-- lang-switch:begin -->.*?<!-- lang-switch:end -->[ \t]*",
    re.DOTALL,
)

# The switch's natural-language strings. Component chrome, not page content:
# they never enter the catalog (see the module docstring). The clarifier always
# keeps its leading space, because it is appended to the visible `EN`/`DE`.
SWITCH_TEXT = {
    "en": {
        "label": "Language",
        "en": " — current language",
        "de": " — Deutsch",
    },
    "de": {
        "label": "Sprache",
        "en": " — English",
        "de": " — aktuelle Sprache",
    },
}

# The shell that hosts the switch: a container div on the CV, the masthead's
# inner row on the four standalone pages.
SWITCH_HOSTS = frozenset({"nav__menu", "sm-head__inner"})



class Page:
    __slots__ = ("name", "file", "url_path")

    def __init__(self, name: str, file: str, url_path: str) -> None:
        self.name = name
        self.file = file
        self.url_path = url_path

    @property
    def german_file(self) -> Path:
        return OUTPUT_DIR / self.file


PAGES = tuple(Page(*row) for row in PAGES)


# ------------------------------------------------------------------ catalog


def load_catalog(root: Path) -> dict:
    path = root / CATALOG_PATH
    if not path.exists():
        return {"language": "de", "strings": {}, "rich": {}, "ignore": []}
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise SystemExit(f"{path}: expected a JSON object")
    ignore = data.get("ignore") or []
    if not isinstance(ignore, list) or any(not isinstance(item, str) for item in ignore):
        raise SystemExit(f"{path}: `ignore` must be a list of strings")
    strings = data.get("strings") or {}
    rich = data.get("rich") or {}
    if not isinstance(strings, dict) or not isinstance(rich, dict):
        raise SystemExit(f"{path}: `strings` and `rich` must be objects")
    return {
        "language": data.get("language") or "de",
        "strings": dict(strings),
        "rich": dict(rich),
        "ignore": list(ignore),
    }


def dump_catalog(catalog: dict) -> str:
    # sort_keys makes the file stable; ensure_ascii keeps German readable.
    return json.dumps(catalog, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    return data if isinstance(data, dict) else {}


# ------------------------------------------------------------------- file io


def read_text(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    if "\r" in text:
        text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text


def write_text(path: Path, text: str) -> None:
    """Temp file + rename: an interrupted run leaves the old file intact."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name(path.name + ".tmp")
    temp.write_text(text, encoding="utf-8", newline="\n")
    temp.replace(path)


# ------------------------------------------------------- marker block (owned)


def lang_alt_block(url_path: str) -> str:
    english = f"{SITE}/{url_path}"
    german = f"{SITE}/de/{url_path}"
    return "\n".join(
        [
            "<!-- lang-alt:begin -->",
            f'  <link rel="alternate" hreflang="en" href="{english}">',
            f'  <link rel="alternate" hreflang="de" href="{german}">',
            f'  <link rel="alternate" hreflang="x-default" href="{english}">',
            "<!-- lang-alt:end -->",
        ]
    )


def indent_block(block: str, indent: str) -> str:
    return "\n".join(indent + line for line in block.splitlines())


def find_canonical(text: str) -> tuple[int, str] | None:
    """Return (insert offset, line indent) for the canonical link, if any."""
    scanner = _Scanner(text)
    scanner.feed(text)
    scanner.close()
    for event in scanner.events:
        if event["kind"] != "start" or event["tag"] != "link":
            continue
        attrs = {name: value for name, value in event["attrs"]}
        if (attrs.get("rel") or "").lower().split() == ["canonical"]:
            line_start = text.rfind("\n", 0, event["start"]) + 1
            indent = text[line_start : event["start"]]
            return event["start"] + len(event["raw"]), indent if not indent.strip() else ""
    return None


def ensure_lang_alt(text: str, page: Page) -> tuple[str, bool]:
    """Render the generator-owned lang-alt block; return (text, changed)."""
    expected = lang_alt_block(page.url_path)
    match = LANG_ALT.search(text)
    if match:
        rendered = indent_block(expected, match.group("indent"))
        updated = text[: match.start()] + rendered + text[match.end() :]
        return updated, updated != text

    anchor = find_canonical(text)
    if anchor is None:
        raise SystemExit(f"{page.file}: no <link rel=\"canonical\"> to anchor the lang-alt block")
    offset, indent = anchor
    rendered = "\n" + indent_block(expected, indent)
    updated = text[:offset] + rendered + text[offset:]
    return updated, True


def check_lang_alt(text: str, page: Page) -> tuple[bool, str]:
    matches = list(LANG_ALT.finditer(text))
    if len(matches) != 1:
        return False, f"{len(matches)} lang-alt blocks (expected 1)"
    found = [line.strip() for line in matches[0].group(0).strip().splitlines()]
    expected = [line.strip() for line in lang_alt_block(page.url_path).splitlines()]
    if found != expected:
        return False, "lang-alt block does not match the expected alternates"
    return True, ""


# ------------------------------------------------------ switch block (owned)


def lang_switch_block(page: Page, german: bool) -> str:
    """Render the switch for one language; only hrefs and the current cell move."""
    text = SWITCH_TEXT["de" if german else "en"]
    if german:
        cells = (
            f'  <a class="lang-switch__item" href="../{page.file}" hreflang="en" lang="en">EN'
            f'<span class="visually-hidden">{text["en"]}</span></a>',
            f'  <span class="lang-switch__item" lang="de" aria-current="true">DE'
            f'<span class="visually-hidden">{text["de"]}</span></span>',
        )
    else:
        cells = (
            f'  <span class="lang-switch__item" lang="en" aria-current="true">EN'
            f'<span class="visually-hidden">{text["en"]}</span></span>',
            f'  <a class="lang-switch__item" href="de/{page.file}" hreflang="de" lang="de">DE'
            f'<span class="visually-hidden">{text["de"]}</span></a>',
        )
    return "\n".join(
        [
            "<!-- lang-switch:begin -->",
            f'<div class="lang-switch" role="group" aria-label="{text["label"]}">',
            *cells,
            "</div>",
            "<!-- lang-switch:end -->",
        ]
    )


def find_switch_host(text: str) -> tuple[int, str] | None:
    """Return (line start of the host's closing tag, child indent)."""
    scanner = _Scanner(text)
    scanner.feed(text)
    scanner.close()
    events = scanner.events
    pairs = match_pairs(events)
    for index, event in enumerate(events):
        if event["kind"] != "start" or event["tag"] != "div":
            continue
        values = {name: value for name, value in event["attrs"]}
        if not (set((values.get("class") or "").split()) & SWITCH_HOSTS):
            continue
        close = pairs.get(index)
        if close is None:
            continue
        close_start = events[close]["start"]
        line_start = text.rfind("\n", 0, close_start) + 1
        indent = text[line_start:close_start]
        if indent.strip():
            indent = ""
        return line_start, indent + "  " if indent else ""
    return None


def ensure_lang_switch(text: str, page: Page, german: bool) -> tuple[str, bool]:
    """Render the generator-owned switch; return (text, changed).

    An existing region is replaced in place (indentation preserved); a missing
    one is appended as the host's last child. Nothing outside the region moves.
    """
    expected = lang_switch_block(page, german)
    matches = list(LANG_SWITCH.finditer(text))
    if len(matches) > 1:
        raise SystemExit(f"{page.file}: {len(matches)} lang-switch blocks (expected 1)")
    if matches:
        match = matches[0]
        rendered = indent_block(expected, match.group("indent"))
        updated = text[: match.start()] + rendered + text[match.end() :]
        return updated, updated != text

    anchor = find_switch_host(text)
    if anchor is None:
        raise SystemExit(f"{page.file}: no .nav__menu or .sm-head__inner to host the switch")
    line_start, child_indent = anchor
    rendered = indent_block(expected, child_indent) + "\n"
    updated = text[:line_start] + rendered + text[line_start:]
    return updated, True


def check_lang_switch(text: str, page: Page, german: bool) -> tuple[bool, str]:
    matches = list(LANG_SWITCH.finditer(text))
    if len(matches) != 1:
        return False, f"{len(matches)} lang-switch blocks (expected 1)"
    found = [line.strip() for line in matches[0].group(0).strip().splitlines()]
    expected = [line.strip() for line in lang_switch_block(page, german).splitlines()]
    if found != expected:
        return False, "lang-switch block does not match the rendering for this language"
    return True, ""


def marker_spans(text: str) -> list[tuple[int, int]]:
    """Offsets of the generator-owned regions: never scanned, never compared."""
    spans: list[tuple[int, int]] = []
    for pattern in (LANG_ALT, LANG_SWITCH):
        spans.extend((match.start(), match.end()) for match in pattern.finditer(text))
    return spans



# ------------------------------------------------------------------- parser


class _Scanner(html.parser.HTMLParser):
    """Collect events with absolute offsets; no rewriting happens here."""

    def __init__(self, text: str) -> None:
        super().__init__(convert_charrefs=True)
        self.text = text
        self.events: list[dict] = []
        self._line_starts = [0]
        for match in re.finditer("\n", text):
            self._line_starts.append(match.end())

    def _offset(self) -> int:
        line, column = self.getpos()
        return self._line_starts[line - 1] + column

    def handle_starttag(self, tag, attrs):  # noqa: D102 - parser callback
        raw = self.get_starttag_text() or ""
        self.events.append(
            {
                "kind": "start",
                "tag": tag,
                "attrs": attrs,
                "spans": attribute_spans(raw),
                "raw": raw,
                "start": self._offset(),
            }
        )

    def handle_endtag(self, tag):  # noqa: D102
        self.events.append({"kind": "end", "tag": tag, "start": self._offset()})

    def handle_data(self, data):  # noqa: D102
        self.events.append({"kind": "data", "data": data, "start": self._offset()})

    def handle_comment(self, data):  # noqa: D102
        self.events.append({"kind": "comment", "start": self._offset()})

    def handle_decl(self, decl):  # noqa: D102
        self.events.append({"kind": "decl", "start": self._offset()})

    def handle_pi(self, data):  # noqa: D102
        self.events.append({"kind": "pi", "start": self._offset()})

    def unknown_decl(self, data):  # noqa: D102
        self.events.append({"kind": "unknown", "start": self._offset()})


def attribute_spans(raw: str) -> list[tuple[str, int | None, int | None, str]]:
    """Locate each attribute's value inside one raw start tag.

    Only ever called with `get_starttag_text()` of a single tag; the returned
    offsets are relative to the tag, the caller adds the tag's absolute start.
    """
    spans: list[tuple[str, int | None, int | None, str]] = []
    length = len(raw)
    index = 1
    while index < length and not raw[index].isspace() and raw[index] not in "/>":
        index += 1

    while index < length:
        while index < length and (raw[index].isspace() or raw[index] == "/"):
            index += 1
        if index >= length or raw[index] == ">":
            break

        name_start = index
        while index < length and not raw[index].isspace() and raw[index] not in "=/>":
            index += 1
        name = raw[name_start:index].lower()

        cursor = index
        while cursor < length and raw[cursor].isspace():
            cursor += 1

        if cursor < length and raw[cursor] == "=":
            cursor += 1
            while cursor < length and raw[cursor].isspace():
                cursor += 1
            if cursor < length and raw[cursor] in "\"'":
                quote = raw[cursor]
                value_start = cursor + 1
                value_end = raw.find(quote, value_start)
                if value_end == -1:
                    value_end = length
                    index = length
                else:
                    index = value_end + 1
                spans.append((name, value_start, value_end, quote))
            else:
                value_start = cursor
                while (
                    cursor < length
                    and not raw[cursor].isspace()
                    and raw[cursor] != ">"
                ):
                    cursor += 1
                spans.append((name, value_start, cursor, ""))
                index = cursor
        else:
            spans.append((name, None, None, ""))
            index = cursor

    return spans


def match_pairs(events: list[dict]) -> dict[int, int]:
    """Map each start-tag event to its closing end-tag event."""
    pairs: dict[int, int] = {}
    stack: list[int] = []
    for index, event in enumerate(events):
        if event["kind"] == "start":
            if event["tag"] in VOID_TAGS:
                continue
            stack.append(index)
        elif event["kind"] == "end":
            if not stack:
                continue
            if events[stack[-1]]["tag"] == event["tag"]:
                pairs[stack.pop()] = index
            else:
                for depth in range(len(stack) - 1, -1, -1):
                    if events[stack[depth]]["tag"] == event["tag"]:
                        opened = stack[depth]
                        del stack[depth:]
                        pairs[opened] = index
                        break
    return pairs


# ----------------------------------------------------------------- analysis


class Analysis:
    __slots__ = (
        "page",
        "text_spans",
        "attr_spans",
        "json_spans",
        "rich_spans",
        "forced",
        "keys",
        "rich_keys",
        "structure",
        "external_hrefs",
        "data_hooks",
        "lang_de_places",
        "lang_en_elements",
        "lang_de_text",
        "lang_de_attr",
        "html_lang",
    )

    def __init__(self, page: Page) -> None:
        self.page = page
        self.text_spans: list[dict] = []
        self.attr_spans: list[dict] = []
        self.json_spans: list[dict] = []
        self.rich_spans: list[dict] = []
        self.forced: dict[int, str] = {}
        self.keys: set[str] = set()
        self.rich_keys: set[str] = set()
        self.structure: list[tuple[str, str | None, str | None]] = []
        self.external_hrefs: list[str] = []
        self.data_hooks: list[tuple[str, str, str | None]] = []
        self.lang_de_places: list[tuple[str, str, int]] = []
        self.lang_en_elements: list[tuple[str, int]] = []
        self.lang_de_text = 0
        self.lang_de_attr = 0
        self.html_lang: str | None = None


ROOT_FRAME = {"tag": None, "lang": None, "no_text": False, "no_attr": False, "in_i18n": False}

# Closing punctuation must butt against what precedes it, opening punctuation
# against what follows it, even when the source keeps a boundary space there.
NO_SPACE_BEFORE = ".,;:!?)]}»”’…%"
NO_SPACE_AFTER = "([{«„“‘"
# A translation may move the full stop across a link boundary; the built page
# must never end up with " . " or " ," no matter what the source whitespace was.
STRAY_SPACE = re.compile(r"[ \t][.,;:!?](?=\s|$|<)")


def normalise(text: str) -> str:
    return WHITESPACE.sub(" ", text).strip()


def escape_text(value: str) -> str:
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def escape_attr(value: str, quote: str) -> str:
    value = escape_text(value)
    if quote == '"':
        return value.replace('"', "&quot;")
    if quote == "'":
        return value.replace("'", "&#x27;")
    return value


def german_url(href: str) -> str:
    match = re.match(r"^(https?://[^/]+)(/.*)?$", href)
    if not match:
        return href
    host, path = match.group(1), match.group(2) or "/"
    return f"{host}/de/{path.lstrip('/')}"


def prefix_asset(value: str) -> str:
    if value.startswith(ASSET_PREFIXES):
        return "../" + value
    return value


def prefix_srcset(value: str) -> str:
    parts = []
    for candidate in value.split(","):
        candidate = candidate.strip()
        if not candidate:
            continue
        pieces = candidate.split(None, 1)
        url = prefix_asset(pieces[0])
        parts.append(url + (" " + pieces[1] if len(pieces) > 1 else ""))
    return ", ".join(parts)


def analyse(text: str, page: Page) -> Analysis:
    scanner = _Scanner(text)
    scanner.feed(text)
    scanner.close()
    events = scanner.events

    for index, event in enumerate(events):
        if event["kind"] == "data":
            event["end"] = events[index + 1]["start"] if index + 1 < len(events) else len(text)
        elif event["kind"] == "start":
            event["end"] = event["start"] + len(event["raw"])

    pairs = match_pairs(events)
    analysis = Analysis(page)
    stack: list[dict] = []
    # The root frame is per analysis: it holds child counters for the lang="de"
    # placement identity, so it must never be shared between pages.
    root = dict(ROOT_FRAME, counts={})
    # Generator-owned regions are not page content: scanning them would invent
    # catalog keys and break parity whenever the switch's own labels differ.
    skip = marker_spans(text)

    for index, event in enumerate(events):
        if skip and _in_spans(event["start"], skip):
            continue
        kind = event["kind"]
        if kind == "start":
            _walk_start(text, events, index, event, pairs, stack, analysis, root)
        elif kind == "end":
            if stack and stack[-1]["tag"] == event["tag"]:
                stack.pop()
            else:
                for depth in range(len(stack) - 1, -1, -1):
                    if stack[depth]["tag"] == event["tag"]:
                        del stack[depth:]
                        break
        elif kind == "data":
            frame = stack[-1] if stack else root
            data = event["data"]
            key = normalise(data)
            if not key:
                continue
            if frame["lang"] == "de":
                analysis.lang_de_text += 1
                continue
            if frame["no_text"]:
                continue
            raw = text[event["start"] : event["end"]]
            analysis.text_spans.append(
                {
                    "start": event["start"],
                    "end": event["end"],
                    "key": key,
                    "raw": raw,
                    "quote": None,
                }
            )
            analysis.keys.add(key)

    return analysis


def _in_spans(offset: int, spans: list[tuple[int, int]]) -> bool:
    return any(start <= offset < end for start, end in spans)


def _walk_start(text, events, index, event, pairs, stack, analysis, root) -> None:
    tag = event["tag"]
    parent = stack[-1] if stack else root
    attrs = event["attrs"]
    spans = event["spans"]

    if len(attrs) != len(spans) or any(
        attr[0] != span[0] for attr, span in zip(attrs, spans)
    ):
        raise SystemExit(
            f"{analysis.page.file}: cannot locate attributes of <{tag}> "
            f"at character {event['start']} ({event['raw']!r})"
        )

    values = {name: value for name, value in attrs}
    lang = values.get("lang") or parent["lang"]
    has_rich = "data-i18n" in values
    inside_rich = parent["in_i18n"]
    in_i18n = inside_rich or has_rich

    # Position-independent sibling ordinal: insensitive to a translation's
    # length, sensitive to an added or moved German title.
    counts = parent["counts"]
    ordinal = counts.get(tag, 0)
    counts[tag] = ordinal + 1

    frame = {
        "tag": tag,
        "lang": lang,
        "no_text": parent["no_text"]
        or tag in TEXT_SKIP_TAGS
        or lang == "de"
        or has_rich,
        "no_attr": parent["no_attr"]
        or tag in ATTR_SKIP_TAGS
        or lang == "de"
        or inside_rich,
        "in_i18n": in_i18n,
        "counts": {},
    }

    # Structure, hooks and lang placements are compared between the two
    # languages. A `data-i18n` subtree is owned by the catalog's `rich` value,
    # so its inner elements are legitimately different in German and skipped
    # here; the element carrying `data-i18n` itself is still compared.
    if not inside_rich:
        analysis.structure.append((tag, values.get("id"), values.get("class")))
        for name, value in attrs:
            if name.startswith("data-"):
                analysis.data_hooks.append((tag, name, value))

    if tag == "html":
        analysis.html_lang = values.get("lang")
    if values.get("lang") == "de" and tag not in {"html", "meta"} and not inside_rich:
        analysis.lang_de_places.append(((parent["tag"] or ""), tag, ordinal))
    if values.get("lang") == "en" and not inside_rich:
        analysis.lang_en_elements.append((tag, event["start"]))
    if tag == "a" and not inside_rich:
        href = values.get("href")
        if href and re.match(r"^[a-z][a-z0-9+.-]*:", href):
            analysis.external_hrefs.append(href)

    if tag == "script" and (values.get("type") or "") in SKIP_SCRIPTS:
        pass  # explicit skip list: structured data stays canonical

    if has_rich:
        rich_key = values["data-i18n"] or ""
        close = pairs.get(index)
        if close is None:
            raise SystemExit(
                f"{analysis.page.file}: <{tag} data-i18n=\"{rich_key}\"> is never closed"
            )
        analysis.rich_spans.append(
            {
                "start": event["end"],
                "end": events[close]["start"],
                "key": rich_key,
            }
        )
        analysis.rich_keys.add(rich_key)

    if (
        tag == "script"
        and (values.get("type") or "").lower() == "application/json"
        and ("data-typed-phrases" in values or "data-ui-strings" in values)
    ):
        close = pairs.get(index)
        if close is None:
            raise SystemExit(f"{analysis.page.file}: JSON island is never closed")
        raw_inner = text[event["end"] : events[close]["start"]]
        try:
            payload = json.loads(raw_inner)
        except json.JSONDecodeError as error:
            raise SystemExit(
                f"{analysis.page.file}: invalid JSON island at {event['start']}: {error}"
            )
        kind = "typed" if "data-typed-phrases" in values else "ui"
        if kind == "typed" and isinstance(payload, list):
            for item in payload:
                if isinstance(item, str) and normalise(item):
                    analysis.keys.add(normalise(item))
        elif kind == "ui" and isinstance(payload, dict):
            for item in payload.values():
                if isinstance(item, str) and normalise(item):
                    analysis.keys.add(normalise(item))
        analysis.json_spans.append(
            {
                "start": event["end"],
                "end": events[close]["start"],
                "kind": kind,
                "raw": raw_inner,
            }
        )

    rel = (values.get("rel") or "").lower().split()
    meta_key = None
    if tag == "meta":
        if values.get("name"):
            meta_key = "name:" + values["name"].lower()
        elif values.get("property"):
            meta_key = "property:" + values["property"].lower()

    # An explicit skip list: `meta[name=keywords]` and its schema.org twin stay
    # canonical in both languages, as does the ld+json block below.
    skip_meta = meta_key in SKIP_META

    if not frame["no_attr"]:
        for (name, value), (_, value_start, value_end, quote) in zip(attrs, spans):
            if value is None or value_start is None:
                continue
            if skip_meta and name == "content":
                continue
            absolute = event["start"] + value_start
            absolute_end = event["start"] + value_end

            key = None
            if name in TRANSLATABLE_ATTRS and value.strip():
                key = normalise(value)
            elif (
                tag == "meta"
                and name == "content"
                and meta_key in TRANSLATABLE_META
                and value.strip()
            ):
                key = normalise(value)

            if key:
                analysis.attr_spans.append(
                    {
                        "start": absolute,
                        "end": absolute_end,
                        "key": key,
                        "raw": text[absolute:absolute_end],
                        "quote": quote,
                    }
                )
                analysis.keys.add(key)
                continue

            forced = None
            if tag == "html" and name == "lang":
                forced = "de"
            elif tag == "meta" and name == "lang" and value == "en":
                forced = "de"
            elif (
                tag == "meta"
                and name == "content"
                and meta_key == "property:og:locale"
            ):
                forced = "de_DE"
            elif tag == "meta" and name == "content" and meta_key == "property:og:url":
                forced = german_url(value)
            elif tag == "link" and name == "href" and "canonical" in rel:
                forced = german_url(value)
            elif name == "srcset":
                forced = prefix_srcset(value)
            elif name in {"href", "src"}:
                forced = prefix_asset(value)

            if forced is not None and forced != value:
                analysis.forced[absolute] = (absolute_end, forced)

    if tag not in VOID_TAGS:
        stack.append(frame)


# ---------------------------------------------------------------- rendering


def build_replacements(analysis: Analysis, catalog: dict) -> tuple[list[tuple[int, int, str]], list[str]]:
    strings = catalog["strings"]
    rich = catalog["rich"]
    ignored = set(catalog["ignore"])
    missing: list[str] = []
    replacements: list[tuple[int, int, str]] = []

    def resolve(key: str) -> tuple[str | None, bool]:
        value = strings.get(key, "")
        if value:
            return value, False
        if key in ignored:
            return None, False
        return None, True

    for span in analysis.text_spans:
        value, absent = resolve(span["key"])
        if absent:
            missing.append(span["key"])
            continue
        if value is None:
            continue  # empty value or ignore: the English span stands
        raw = span["raw"]
        # The boundary space belongs to the source, not to the translation: a
        # German value may move the full stop across an inline link, and the
        # source's leading space must not turn it into " . ".
        lead = " " if raw[:1].isspace() and value[:1] not in NO_SPACE_BEFORE else ""
        trail = " " if raw[-1:].isspace() and value[-1:] not in NO_SPACE_AFTER else ""
        replacements.append((span["start"], span["end"], lead + escape_text(value) + trail))

    for span in analysis.attr_spans:
        value, absent = resolve(span["key"])
        if absent:
            missing.append(span["key"])
            continue
        if value is None:
            continue
        replacements.append(
            (span["start"], span["end"], escape_attr(value, span["quote"] or '"'))
        )

    for span in analysis.json_spans:
        raw = span["raw"]
        if not raw.strip():
            continue
        payload = json.loads(raw)
        if span["kind"] == "typed":
            items = payload if isinstance(payload, list) else []
            result = []
            for item in items:
                if not isinstance(item, str):
                    result.append(item)
                    continue
                value, absent = resolve(normalise(item))
                if absent:
                    missing.append(normalise(item))
                    value = None
                result.append(item if value is None else value)
            rendered = json.dumps(result, ensure_ascii=False, separators=(",", ":"))
        else:
            result = {}
            for name, item in (payload.items() if isinstance(payload, dict) else []):
                if not isinstance(item, str):
                    result[name] = item
                    continue
                value, absent = resolve(normalise(item))
                if absent:
                    missing.append(normalise(item))
                    value = None
                result[name] = item if value is None else value
            rendered = json.dumps(result, ensure_ascii=False, separators=(",", ":"))
        # A literal `</script` inside a string would close the island.
        rendered = rendered.replace("<", "\\u003c")
        lead = raw[: len(raw) - len(raw.lstrip())]
        trail = raw[len(raw.rstrip()) :]
        replacements.append((span["start"], span["end"], lead + rendered + trail))

    for span in analysis.rich_spans:
        value = rich.get(span["key"], "")
        if not value:
            missing.append(span["key"])
            continue
        replacements.append((span["start"], span["end"], value))

    for start, (end, value) in analysis.forced.items():
        replacements.append((start, end, value))

    replacements.sort(key=lambda item: item[0])
    for earlier, later in zip(replacements, replacements[1:]):
        if later[0] < earlier[1]:
            raise SystemExit(
                f"{analysis.page.file}: overlapping replacements at {earlier[0]} and {later[0]}"
            )
    return replacements, missing


def render_page(text: str, analysis: Analysis, catalog: dict) -> tuple[str, list[str]]:
    """Splice translated spans in reverse order; offsets stay valid."""
    replacements, missing = build_replacements(analysis, catalog)
    result = text
    for start, end, value in reversed(replacements):
        result = result[:start] + value + result[end:]
    return result, missing


def build_all(root: Path, catalog: dict, selected: tuple[Page, ...] | list[Page]) -> tuple[dict, list[str]]:
    outputs: dict[str, str] = {}
    missing: list[str] = []
    for page in selected:
        source = read_text(root / page.file)
        # Both marker regions are normalised before analysis, so a fresh build
        # never depends on whether --render-markers has been run on this clone.
        source, _ = ensure_lang_alt(source, page)
        source, _ = ensure_lang_switch(source, page, german=False)
        analysis = analyse(source, page)
        rendered, page_missing = render_page(source, analysis, catalog)
        # Re-render the switch for the German tree: same region, other labels.
        rendered, _ = ensure_lang_switch(rendered, page, german=True)
        outputs[page.name] = rendered
        missing.extend(page_missing)
    return outputs, missing


# ------------------------------------------------------------------ commands


def select_pages(page_arg: str | None) -> list[Page]:
    if not page_arg:
        return list(PAGES)
    for page in PAGES:
        if page_arg in (page.name, page.file):
            return [page]
    known = ", ".join(page.name for page in PAGES)
    raise SystemExit(f"unknown page: {page_arg} (known: {known})")


def shorten(text: str, limit: int = 64) -> str:
    collapsed = normalise(text)
    return collapsed if len(collapsed) <= limit else collapsed[: limit - 1] + "…"


def print_counts(page_count: int, catalog: dict, stream=sys.stdout) -> None:
    strings = catalog["strings"]
    translated = sum(1 for value in strings.values() if value)
    print(f"pages                {page_count}", file=stream)
    print(f"strings              {len(strings)}", file=stream)
    print(f"translated           {translated}", file=stream)
    print(f"ignored              {len(catalog['ignore'])}", file=stream)
    print(f"rich                 {len(catalog['rich'])}", file=stream)


def cmd_extract(root: Path) -> int:
    catalog = load_catalog(root)
    rows: list[tuple[Page, Analysis]] = []
    new_strings = 0
    new_rich = 0
    blocks_written: list[str] = []

    for page in PAGES:
        path = root / page.file
        if not path.exists():
            raise SystemExit(f"missing English page: {page.file}")
        text = read_text(path)
        normalised, changed = ensure_lang_alt(text, page)
        normalised, switch_changed = ensure_lang_switch(normalised, page, german=False)
        if changed or switch_changed:
            write_text(path, normalised)
            blocks_written.append(page.file)

        analysis = analyse(normalised, page)
        rows.append((page, analysis))

        for key in sorted(analysis.keys):
            if key not in catalog["strings"]:
                catalog["strings"][key] = ""
                new_strings += 1
        for key in sorted(analysis.rich_keys):
            if key not in catalog["rich"]:
                catalog["rich"][key] = ""
                new_rich += 1

        # Pending files are the translator's working set: values already filled
        # in are carried over, keys that left the page are dropped.
        pending_path = root / PENDING_DIR / f"{page.name}.json"
        previous = load_json(pending_path)
        old_strings = previous.get("strings") if isinstance(previous.get("strings"), dict) else {}
        old_rich = previous.get("rich") if isinstance(previous.get("rich"), dict) else {}
        write_text(
            pending_path,
            dump_catalog(
                {
                    "language": "de",
                    "strings": {
                        key: str(old_strings.get(key) or "")
                        for key in sorted(analysis.keys)
                    },
                    "rich": {
                        key: str(old_rich.get(key) or "")
                        for key in sorted(analysis.rich_keys)
                    },
                    "ignore": [],
                }
            ),
        )

    write_text(root / CATALOG_PATH, dump_catalog(catalog))

    lang_de_header = 'lang="de"'
    print(f"{'page':<20}{'strings':>9}{lang_de_header:>12}")
    for page, analysis in rows:
        print(f"{page.file:<20}{len(analysis.keys):>9}{analysis.lang_de_text:>12}")
    print()
    print(f"new string keys      {new_strings}")
    print(f"new rich keys        {new_rich}")
    print(
        f"marker blocks        {len(blocks_written)} written"
        + (f": {', '.join(blocks_written)}" if blocks_written else " (already current)")
    )
    print(f"wrote                {CATALOG_PATH}")
    print(f"wrote                {PENDING_DIR}/ ({len(rows)} page files)")
    print_counts(len(rows), catalog)
    return 0


def cmd_render_markers(root: Path) -> int:
    """Rewrite the two generator-owned regions in the English pages only.

    Unlike `--extract` this never reads or writes the catalog or the pending
    files, so it is safe to run while translators are working.
    """
    changed: list[str] = []
    for page in PAGES:
        path = root / page.file
        if not path.exists():
            raise SystemExit(f"missing English page: {page.file}")
        text = read_text(path)
        text, alt_changed = ensure_lang_alt(text, page)
        text, switch_changed = ensure_lang_switch(text, page, german=False)
        if alt_changed or switch_changed:
            write_text(path, text)
            changed.append(page.file)
    print(
        f"marker blocks        {len(changed)} written"
        + (f": {', '.join(changed)}" if changed else " (already current)")
    )
    print("catalog              untouched")
    return 0


def cmd_merge(root: Path) -> int:
    catalog = load_catalog(root)
    files = sorted((root / PENDING_DIR).glob("*.json"))
    if not files:
        print(f"no pending files in {PENDING_DIR}; nothing merged")
        print_counts(len(PAGES), catalog)
        return 0

    merged: dict[str, dict[str, str]] = {"strings": {}, "rich": {}}
    unknown: list[str] = []
    conflicts: list[str] = []
    empty = 0

    for path in files:
        data = load_json(path)
        for section in ("strings", "rich"):
            values = data.get(section) if isinstance(data.get(section), dict) else {}
            for key, value in values.items():
                if not isinstance(value, str):
                    continue
                if key not in catalog[section]:
                    unknown.append(f"{path.name}: {shorten(key)} is not in the catalog")
                    continue
                if not value:
                    empty += 1
                    continue
                if key in merged[section] and merged[section][key] != value:
                    conflicts.append(
                        f"{shorten(key)}: {shorten(merged[section][key])!r} vs {shorten(value)!r}"
                    )
                    continue
                merged[section][key] = value

    if unknown or conflicts:
        print("merge failed; nothing written")
        for line in unknown:
            print(f"  {line}")
        for line in conflicts:
            print(f"  conflict {line}")
        print_counts(len(PAGES), catalog)
        return 1

    for section in ("strings", "rich"):
        catalog[section].update(merged[section])
    write_text(root / CATALOG_PATH, dump_catalog(catalog))

    print(f"pending files        {len(files)}")
    print(f"merged values        {sum(len(values) for values in merged.values())}")
    print(f"empty values         {empty}")
    print(f"wrote                {CATALOG_PATH}")
    print_counts(len(PAGES), catalog)
    return 0


def cmd_build(root: Path, page_arg: str | None, allow_missing: bool) -> int:
    catalog = load_catalog(root)
    selected = select_pages(page_arg)
    outputs, missing = build_all(root, catalog, selected)
    unique = sorted({key for key in missing if key})

    if unique and not allow_missing:
        print("missing translations; nothing written")
        for key in unique[:15]:
            print(f'  "{shorten(key, 80)}"')
        if len(unique) > 15:
            print(f"  … and {len(unique) - 15} more")
        print_counts(len(selected), catalog)
        return 1

    for page in selected:
        rendered = outputs[page.name]
        write_text(root / page.german_file, rendered)
        print(f"wrote                {page.german_file}  ({len(rendered.encode('utf-8'))} bytes)")

    if unique:
        print(f"missing values       {len(unique)} (fell back to the English source)")
    else:
        print("missing values       0")
    print_counts(len(selected), catalog)
    return 0


def describe_difference(left: list, right: list) -> str:
    for index, (one, other) in enumerate(zip(left, right)):
        if one != other:
            return f"first difference at #{index}: {one!r} vs {other!r}"
    return f"length differs: {len(left)} vs {len(right)}"


def cmd_check(root: Path) -> int:
    catalog = load_catalog(root)
    strings = catalog["strings"]
    rich = catalog["rich"]
    ignored = set(catalog["ignore"])

    problems: list[tuple[str, str]] = []
    warnings: list[str] = []
    coverage: list[tuple[Page, list[str], list[str]]] = []

    if not (root / CATALOG_PATH).exists():
        problems.append(("catalog", f"{CATALOG_PATH} is missing"))

    analyses: dict[str, Analysis] = {}
    for page in PAGES:
        path = root / page.file
        if not path.exists():
            problems.append(("source", f"{page.file} is missing"))
            continue
        text = read_text(path)
        ok, why = check_lang_alt(text, page)
        if not ok:
            problems.append(("marker", f"{page.file}: {why}"))
        ok, why = check_lang_switch(text, page, german=False)
        if not ok:
            problems.append(("marker", f"{page.file}: {why}"))
        analysis = analyse(text, page)
        analyses[page.name] = analysis

        absent = sorted(
            key for key in analysis.keys if key not in strings and key not in ignored
        )
        untranslated = sorted(
            key
            for key in analysis.keys
            if key in strings and not strings[key] and key not in ignored
        )
        coverage.append((page, absent, untranslated))
        for key in absent[:5]:
            problems.append(("catalog", f'{page.file}: no catalog entry for "{shorten(key)}"'))
        if len(absent) > 5:
            problems.append(
                ("catalog", f"{page.file}: and {len(absent) - 5} more keys without an entry")
            )

    referenced_rich: set[str] = set()
    for analysis in analyses.values():
        referenced_rich |= analysis.rich_keys
    for key in sorted(referenced_rich):
        if not rich.get(key):
            problems.append(("rich", f'data-i18n key "{shorten(key)}" has no rich value'))
    for key in sorted(set(rich) - referenced_rich):
        warnings.append(f'rich key "{shorten(key)}" is defined but no page references it')

    untranslated_keys: set[str] = set()
    for _, _, untranslated in coverage:
        untranslated_keys.update(untranslated)
    untranslated_total = len(untranslated_keys)
    untranslated_occurrences = sum(len(item[2]) for item in coverage)
    absent_total = sum(len(item[1]) for item in coverage)
    if untranslated_total:
        problems.append(
            (
                "translations",
                f"{untranslated_total} catalog keys have no German value yet "
                f"({untranslated_occurrences} occurrences on the pages)",
            )
        )

    # Byte-for-byte comparison with a fresh build. The fallback build is used
    # so a half-translated catalog still yields a comparable page.
    outputs, _ = build_all(root, catalog, list(PAGES))
    for page in PAGES:
        de_path = root / page.german_file
        if not de_path.exists():
            problems.append(("German pages", f"{page.german_file} is missing"))
            continue
        shipped = read_text(de_path)

        # Marker regions are owned by the generator, so a drifted one is always
        # a real defect and is reported even when the rest of the file is stale.
        ok, why = check_lang_alt(shipped, page)
        if not ok:
            problems.append(("marker", f"{page.german_file}: {why}"))

        ok, why = check_lang_switch(shipped, page, german=True)
        if not ok:
            problems.append(("marker", f"{page.german_file}: {why}"))

        if shipped != outputs[page.name]:
            # Reported once, as stale. Running the language and parity rules on
            # a file the generator did not write would blame the content for a
            # stale artefact and read like a generator bug.
            problems.append(
                ("German pages", f"{page.german_file} is stale: differs from a fresh build")
            )
            continue

        analysis = analyse(shipped, page)
        if analysis.html_lang != "de":
            problems.append(
                ("language", f'{page.german_file}: <html lang="{analysis.html_lang}"> is not "de"')
            )
        if analysis.lang_en_elements:
            tags = ", ".join(sorted({tag for tag, _ in analysis.lang_en_elements}))
            problems.append(("language", f'{page.german_file}: contains lang="en" on <{tags}>'))

        stray = STRAY_SPACE.search(shipped)
        if stray:
            line = shipped.count("\n", 0, stray.start()) + 1
            problems.append(
                (
                    "typography",
                    f'{page.german_file}:{line}: space before "{stray.group(0).strip()}"',
                )
            )

        english = analyses.get(page.name)
        if english is None:
            continue
        parity = (
            ("element sequence", english.structure, analysis.structure),
            ("external hrefs", english.external_hrefs, analysis.external_hrefs),
            ("data hooks", english.data_hooks, analysis.data_hooks),
            ('lang="de" placements', english.lang_de_places, analysis.lang_de_places),
        )
        for label, left, right in parity:
            if left != right:
                problems.append(
                    ("parity", f"{page.german_file}: {label} differs — {describe_difference(left, right)}")
                )

    stale_keys = sorted(set(strings) - set().union(*(a.keys for a in analyses.values())))
    if stale_keys:
        warnings.append(
            f"{len(stale_keys)} catalog keys no longer occur on any page "
            f'(first: "{shorten(stale_keys[0])}")'
        )

    # Always report: success prints the counts and `problems 0`, so a log can be
    # grepped and the gate is one line, not a silence.
    print(f"i18n check: {'FAILED' if problems else 'OK'}")
    print()
    print_counts(len(PAGES), catalog)
    print()
    lang_de_header = 'lang="de"'
    print(f"{'page':<20}{'untranslated':>13}{'no entry':>10}{lang_de_header:>11}")
    for page, absent, untranslated in coverage:
        analysis = analyses.get(page.name)
        copied = analysis.lang_de_text if analysis else 0
        print(f"{page.file:<20}{len(untranslated):>13}{len(absent):>10}{copied:>11}")
    print()
    sections: list[tuple[str, list[str]]] = [
        ("catalog", [text for name, text in problems if name == "catalog"]),
        ("translations", [text for name, text in problems if name == "translations"]),
        ("rich", [text for name, text in problems if name == "rich"]),
        ("marker", [text for name, text in problems if name == "marker"]),
        ("German pages", [text for name, text in problems if name == "German pages"]),
        ("parity", [text for name, text in problems if name == "parity"]),
        ("typography", [text for name, text in problems if name == "typography"]),
        ("language", [text for name, text in problems if name == "language"]),
        ("source", [text for name, text in problems if name == "source"]),
    ]
    for title, lines in sections:
        if not lines:
            continue
        print(title)
        for line in lines:
            print(f"  {line}")
        print()
    if warnings:
        print("warnings")
        for line in warnings:
            print(f"  {line}")
        print()
    print(f"problems             {len(problems)}")
    print(f"summary              {absent_total} keys without an entry, "
          f"{untranslated_total} untranslated catalog keys")
    return 1 if problems else 0


# ---------------------------------------------------------------------- main


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Generate the German pages from the English source and i18n/de.json."
    )
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parents[2],
        help="repository root (defaults to the script's repository)",
    )
    command = parser.add_mutually_exclusive_group(required=True)
    command.add_argument("--extract", action="store_true", help="add new keys to the catalog")
    command.add_argument(
        "--render-markers",
        action="store_true",
        help="rewrite the lang-alt and lang-switch regions in the English pages only",
    )
    command.add_argument("--merge", action="store_true", help="fold i18n/pending/*.json into the catalog")
    command.add_argument("--build", action="store_true", help="write de/*.html")
    command.add_argument("--check", action="store_true", help="verify coverage, parity and de/*")
    parser.add_argument("--page", help="limit --build to one page name")
    parser.add_argument(
        "--allow-missing",
        action="store_true",
        help="with --build: fall back to the English source for untranslated values",
    )
    args = parser.parse_args(argv)

    if args.page and not args.build:
        parser.error("--page is only valid with --build")

    root = args.root.resolve()
    if args.extract:
        return cmd_extract(root)
    if args.render_markers:
        return cmd_render_markers(root)
    if args.merge:
        return cmd_merge(root)
    if args.build:
        return cmd_build(root, args.page, args.allow_missing)
    return cmd_check(root)


if __name__ == "__main__":
    sys.exit(main())


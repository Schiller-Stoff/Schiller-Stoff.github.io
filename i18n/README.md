# i18n — bilingual static site (EN / DE)

English lives at the repository root and is the **source of truth** for structure and
content. German lives in `de/` and is **generated** from the English pages plus one
catalog, `i18n/de.json`. Generated files are committed, exactly like the two map
fragments: one offline script, deterministic output, never touched by hand.

```
index.html  storymap.html  memor.html  ai-agents.html  ai-coding.html   ← edited by hand
        │
        │  tools/i18n/build_i18n.py --build
        ▼
i18n/de.json (German only)  ──────────►  de/index.html  de/storymap.html  de/memor.html
i18n/glossary.md                          de/ai-agents.html  de/ai-coding.html
```

Why not a runtime switch: the four standalone pages load **no JavaScript at all**, and
the site's hardest invariant is "content is never hidden pending JavaScript". A static
German tree keeps both promises, keeps print and forced colours working, and gives the
German pages a real URL, a real `<html lang="de">` and real `hreflang` pairs.

## Workflow

```bash
# 1. after editing any English page
python3 tools/i18n/build_i18n.py --extract    # add missing keys to i18n/de.json (values "")
python3 tools/i18n/build_i18n.py --check      # fails: untranslated strings, orphans, stale de/, parity
python3 tools/i18n/build_i18n.py --build      # rewrite de/*.html
python3 tools/i18n/build_i18n.py --check      # must print `problems             0` before commit
```

`--extract` never overwrites an existing value. `--build` never writes English files.
`--render-markers` rewrites only the two generator-owned regions in the English pages and
touches no catalog, so it is safe while translators are working. `--check` is the CI gate
(there is no CI; run it before every commit and after `tools/storymap/build_map.py` or
`tools/memor/build_map.py`). It always prints the counts and a `problems` line; success
is **`i18n check: OK` with `problems             0` and exit 0**, not silence.

## Catalog format (`i18n/de.json`)

```json
{
  "language": "de",
  "strings": { "<normalised English>": "<German>" },
  "rich":    { "<data-i18n key>": "<German HTML>" },
  "ignore":  ["<normalised English that must stay as it is>"]
}
```

* A **key** is the source string after entity decoding, whitespace runs collapsed to a
  single space and trimming. Typographic characters (`—`, `’`, `·`) stay literal; a
  source `&nbsp;` becomes U+00A0, which is normalised to a plain space in keys.
* A **value** is plain text. `&`, `<`, `>` are escaped on output. Write `\u00a0` in the
  JSON where a non-breaking space is required (`CC\u00a0BY`, `CLARIN\u00a0B`). German
  typographic quotes are `„…“` and `‚…‘`; ranges use `–` without spaces; thousands use
  `.` (`4.393`); dates are `13. November 2026`.
* `rich` is the escape hatch for a block whose English sentence is split by inline
  markup (a link or `<em>` mid-sentence) and would translate into fragments. Put
  `data-i18n="<key>"` on that element; its whole inner HTML is replaced. Rich values may
  contain inline HTML but **no asset URLs** (they would need `../`); page links inside
  them are same-directory (`storymap.html`).
* `ignore` is for words that are already correct in both languages (`GAMS`, `Datenbank`
  in a German title, numerals, `2026`). Keep it short; every entry is a decision.
* A value may move punctuation across an inline link. The generator keeps the source's
  boundary space only when the value does not start with closing punctuation
  (`. , ; : ! ? ) ] } » ” ’ … %`) and does not end with opening punctuation; `--check`
  reports a stray space before closing punctuation in a built German page. Do not encode
  the space in the catalog value.
* Record and position titles have their own rules in `i18n/glossary.md` (§Titles and
  citations, §Position titles).

## What the generator translates

| surface | rule |
| --- | --- |
| text nodes | everything outside `script`, `style`, the SVG sprite and any subtree whose nearest `lang` is `de` |
| SVG `<title>` / `<desc>` | translated (the map fragments keep their geometry byte-for-byte) |
| attributes | `alt`, `aria-label`, `title`, `placeholder`, `<meta content>` for `description`, `og:*`, `twitter:*`, `dc:description`, `schema_org:description` |
| `<title>` | translated |
| `<script type="application/json" data-typed-phrases>` | each array item |
| `<script type="application/json" data-ui-strings>` | each value (`{n}`, `{total}` kept) |
| `<html lang>` | forced to `de` |
| `<meta property="og:locale">` | forced to `de_DE` |
| `<meta lang="en">` (Dublin Core) | forced to `lang="de"` |
| `<link rel="canonical">`, `og:url` | host + `/de/` + path |
| `href`/`src`/`srcset` starting with `css/ js/ images/ fonts/ favicon.png` | prefixed `../` |
| `*.html` links, `#fragment`, absolute URLs | unchanged (the German page sits beside its peers) |
| `<script type="application/ld+json">`, `<meta name="keywords">` | **not** translated (structured data and keyword lists stay canonical) |
| `data-i18n` subtrees | the whole inner HTML comes from the catalog's `rich`; parity therefore skips the inner elements, classes, `lang` placements, external hrefs and data hooks and compares only the element that carries `data-i18n` |
| `lang-alt` / `lang-switch` marker regions | **not** scanned and **not** counted: they are rendered from the generator's tables and compared per language |

## Marker blocks (owned by the generator)

Both are rendered by the script and validated in the English source and in every German
page, so the two languages can never drift:

```html
<!-- lang-alt:begin -->   … hreflang alternates (identical in both languages)
<!-- lang-switch:begin --> … the navbar switch (language-specific)
```

`--extract` (and `--render-markers`) render the English regions; `--build` renders the
German ones into `de/*`. Both regions are excluded from the translatable-string scan and
from the coverage/parity rules, and `--check` compares each one against the rendering for
that language (line indentation aside). Nothing inside a region can become a catalog key.

The switch is two cells — one link plus the current label (a `<span>`) — `EN` first and
`DE` second in both languages so a label never moves. It is the last child of `.nav__menu` on the CV and
of `.sm-head__inner` on the four standalone pages.

| page | group label | current cell | the other cell | its `href` |
| --- | --- | --- | --- | --- |
| `index.html` | `Language` | `EN` (span, `aria-current="true"`) | `DE` | `de/index.html` |
| `de/index.html` | `Sprache` | `DE` (span, `aria-current="true"`) | `EN` | `../index.html` |
| `storymap.html` | `Language` | `EN` | `DE` | `de/storymap.html` |
| `de/storymap.html` | `Sprache` | `DE` | `EN` | `../storymap.html` |
| `memor.html`, `ai-agents.html`, `ai-coding.html` and `de/` twins | as above | as above | as above | `de/<file>` / `../<file>` |

The six natural-language strings (`Language`, `Sprache`, `— current language`,
`— aktuelle Sprache`, `— English`, `— Deutsch`) live in `SWITCH_TEXT` in
`tools/i18n/build_i18n.py`, not in the catalog: they are component chrome, and translating
them would make the switch's own labels a page string. `EN`/`DE` are visible; the
clarifier after each is a `visually-hidden` sentence. `hreflang` names the target's
language, `lang` the label's; no `<select>`, no `<button>`, no script, no auto-redirect.

## Working with translators

`--extract` writes one working set per page into `i18n/pending/*.json` (the page's keys,
values empty except where a previous set already filled them). A translator fills only that
file; `--merge` folds every non-empty value into `i18n/de.json`, refuses a key that is not in
the catalog and refuses two different values for one key. Once merged **and reviewed, delete
the working sets**: `--merge` overwrites catalog values, so a stale set would silently revert
the review. `--extract` recreates empty ones for the next round. The repository ships no
pending files; an empty `i18n/pending/` means translation is complete.

## Adding a page

1. Add the English page and its entry in the generator's page table.
2. `--render-markers` (or `--extract`) renders the `lang-alt` and `lang-switch` blocks.
3. `--extract`, translate, `--build`, `--check`.

## Invariants (add to the `Verify` list in AGENTS.md)

```bash
python3 tools/i18n/build_i18n.py --check                     # exit 0 with `problems             0`
grep -c 'lang-switch:begin' index.html storymap.html memor.html ai-agents.html ai-coding.html  # 1 each
grep -c 'lang-switch:begin' de/*.html                        # 1 each
grep -c 'class="lang-switch__item"' index.html               # 2 (EN span + DE link)
grep -c 'aria-current="true"' index.html                     # 1 (scrollspy writes "location")
grep -c '<script' de/storymap.html de/memor.html de/ai-agents.html de/ai-coding.html  # 0
grep -c 'site\.js' de/index.html                             # 1 (the only German page with JS)
diff <(sed -n '/map:begin/,/map:end/p' de/index.html | sed 's/^ *//') \
     <(sed -n '/map:begin/,/map:end/p' de/storymap.html | sed 's/^ *//')  # no output: the DE maps match too
grep -cE '(^|[[:space:]])lang="en"' de/index.html            # 1: the switch's EN cell only
grep -rnoE '[[:space:]][.,;:!?]([[:space:]]|$|<)' de/*.html   # no output: no space before punctuation
test -z "$(ls -A i18n/pending)"                              # true: pending sets are transient
gzip -c de/index.html | wc -c                                # ~30.5 KB
```

# V16 — "The page speaks German"

Status: **implemented on `redesign`, uncommitted** (15 Nov 2026). V15 is
untouched in content and structure. V16 adds no section, no component family
beyond one navigation pill, no script library, no font and no colour token. It
adds one offline generator, one catalog, one JSON string island per CV and five
generated German pages. See §11 for the implementation record.

Review: editorial pass over all five German pages, 15 Nov 2026. The German text
was read as prose, not as a key/value dump: ~40 corrections are in §9. No real
browser was available in this environment, so the switch's width, tab order,
print and forced-colours states remain manual checks (§12).

---

## 1. The thesis

> German is not a toggle. It is a second tree, built offline from the English
> source and one catalog, and committed like the map fragments.

The site's hard promises decide the shape:

1. **No build step.** Assets are plain files; there is no package manager, no CI.
2. **No CDN, no framework, one stylesheet, vanilla JS.**
3. **Content is never hidden pending JavaScript**, and four of the five pages
   load no JavaScript at all.
4. **Print, forced colours and reduced motion are features**, not fallbacks.

A runtime language switch fails 3 and 4 on the four standalone pages. A second
hand-edited tree fails the "one source of truth" rule the moment English
changes. A generated tree keeps both: English stays authoritative, German is a
deterministic artefact with a real URL, a real `<html lang="de">` and real
`hreflang` pairs.

## 2. The shape, and the options rejected

```
index.html  storymap.html  memor.html  ai-agents.html  ai-coding.html
      │            (edited by hand, source of truth)
      │  python3 tools/i18n/build_i18n.py --extract / --build / --check
      ▼
i18n/de.json (862 German strings) ──► de/index.html  de/storymap.html
i18n/glossary.md                      de/memor.html  de/ai-agents.html
                                      de/ai-coding.html
```

| Option | Why it lost |
| --- | --- |
| Runtime JS that swaps text nodes | Four pages have no script; no real German URL, no `hreflang`, no `lang="de"` on the four studies; a failed swap hides content. |
| Two hand-maintained trees | One component duplicated ten times (five pages × two languages) and ~4,000 lines per tree; English edits silently diverge; no gate can tell "translated" from "stale". |
| `?lang=de` query or cookie redirect | Needs script on every page, breaks print/share URLs, and violates "no auto-redirect". |
| A bundler / SSG (Eleventy, Astro) | Adds a toolchain and a dependency tree to a five-page static site; AGENTS.md forbids it. |
| A `<select>` language control | A form control where a link belongs: needs script to navigate, cannot be the current page, worse keyboard and print behaviour. |
| Machine translation at build time | Adds a network dependency and an unpredictable output; the review in §9 would be impossible to reproduce. |

Cost of the chosen shape, measured: **0 script bytes on the four script-free
German pages**, 354 bytes of switch markup + a 727-byte German JSON payload
(808 bytes with its `<script>` tags) on `de/index.html`, 109 added lines of CSS,
no new request, no new font. The whole
German tree is ~65 KB gzipped; `de/index.html` is 31,210 bytes **gzipped**
against the English 30,668 (+1.8 %), while uncompressed the German page is
slightly smaller (142,690 vs 143,724 bytes).

## 3. The switch

A two-cell segmented pill, **72 × 34px**, in the header and in each standalone
masthead: `EN` then `DE`, always in that order, on both languages of the page.
`EN` on the English page is a `<span aria-current="true">`; `DE` is a plain
`<a href="de/index.html" hreflang="de">`. German inverts the two. Each cell
carries a `visually-hidden` clarifier (`— current language`, `— Deutsch`).

It borrows the nav's existing state language — heavier stem plus a 2px
ultramarine rule — instead of inventing a second one. No fill on the current
cell, because `--surface-paper` is already the hover ground and a filled half
would read as hovered. No `<select>`, no `<button>`, no `aria-expanded`, no
`data-` hook, no script, no auto-redirect, no `<html class>` visibility gate.

Both cells are 32px tall inside the 34px pill, which clears the 32px target
inside the 72px desktop and 64px mobile headers. The component is identical on
both shells; only four declarations are shell-specific: `align-self: flex-end`
inside the `≤900px` navigation disclosure, `justify-content: flex-end` on the
standalone `.sm-head__inner`, and `flex-start` plus the pill's own auto margin
at ≤640. It is hidden in print, and in forced colours it keeps border + 600
weight + the 2px rule, so state never depends on colour alone.

The switch is **generator-owned** between `lang-switch:begin` / `lang-switch:end`,
like the head's `lang-alt` block. Five pages × two languages is ten copies of one
component; a table in the generator cannot drift, and `--check` compares each
region byte for byte (line indentation aside). Its six natural-language strings
live in `SWITCH_TEXT` in the generator, not in the catalog: they are component
chrome, and putting them in `de.json` would make the switch's own labels
translatable page content.

`i18n/switch-design.md` is the full specification, including its §9 "as built"
deviations (catalog nav labels, generator ownership, `/de/` canonical).

## 4. The generator

`tools/i18n/build_i18n.py`, **1,456 lines, Python standard library only**
(`argparse`, `html.parser`, `json`, `re`, `sys`, `pathlib`). It is run by hand;
nothing executes at page load.

* **Parse, do not re-serialise.** `html.parser` builds an event list with
  absolute character offsets; changed spans are spliced in reverse order. No
  byte outside a replaced span is touched, so an `--build` that changes one
  string produces a one-string diff. Attribute values come from
  `get_starttag_text()` per tag, never from a document-wide regex.
* **What it translates:** text nodes outside `script`, `style`, `<symbol>` and
  any subtree whose nearest `lang` is `de`; `alt`, `aria-label`, `title`,
  `placeholder`, `<title>`, the listed meta descriptions; the values of
  `script[data-typed-phrases]` and `script[data-ui-strings]`; the inner HTML of
  a `data-i18n` element via `rich`.
* **What it deliberately does not:** JSON-LD and `meta[name=keywords]`
  (structured data stays canonical); `lang="de"` subtrees (German publication,
  event and course titles are copied byte for byte); SVG geometry (`d`, viewBox,
  marker IDs — only `<title>`/`<desc>` are text); asset paths and every URL
  except the four routing values (page `lang`, `og:locale`, canonical/`og:url`,
  `../` asset prefixes) and the Dublin Core `meta lang` attribute.
* **Modes:** `--extract` adds missing keys and recreation of empty working sets;
  `--render-markers` rewrites only the two owned regions; `--merge` folds
  `i18n/pending/*.json`; `--build` writes `de/*`; `--check` is the gate.
* **Determinism:** the same inputs produce the same bytes. The implementation
  check is `--build` twice plus an empty `git diff --stat`.

`--check` fails on: a missing catalog file, a missing source or German page, a
drifted marker region, a missing catalog entry, an untranslated value, a `rich`
key without a value, a stale German page (byte comparison against a fresh
build), a structural parity break, a `lang="en"` outside the switch on a German
page, or a typography defect (§9.5). Success is loud, not silent:
`i18n check: OK` with `problems             0` and exit 0, always printing the
counts so a log can be grepped.

## 5. The catalog

`i18n/de.json` is the only place German is edited:

```json
{ "language": "de", "strings": { "<normalised English>": "<German>" },
  "rich": {}, "ignore": [] }
```

**862 strings, 862 translated, 0 ignored, 0 rich.** Keys are the normalised
English source (entity-decoded, whitespace collapsed, trimmed), so there are no
invented IDs to maintain and the catalog reads as a diffable bilingual document.
`rich` is the documented escape hatch for a sentence split by inline markup or a
string whose translation needs different elements; it is unused. `ignore` is
unused and empty.

The known weakness of a keyless catalog is one English string used in two
contexts that need different German. None exists yet: context variants were
avoided in the English copy, and the report is that a collision surfaces as a
`rich` key, not as a silent wrong translation.

## 6. UI strings: one JSON island, no second script

`js/site.js` owns project count, load-more, form states, copy, typed-line
labels and form invalid/sending/subject strings. They are not content in the
DOM, so the generator cannot reach them by node. The solution is one JSON island
per CV page:

```html
<script type="application/json" data-ui-strings>
  {"showing":"Showing {n} of {total} projects", ... }
</script>
```

`UI_FALLBACK` in the script holds the English literals; the island overrides
only keys it carries, so a missing or broken island leaves the page readable.
`{n}` and `{total}` are the only placeholders — no templating engine. English
ships its canonical island (so both languages have the same shape); the
generator writes the German one. Plurals are explicit keys
(`showingOne`, `loadMoreOne`), not a plural-rule engine: two forms is what the
copy needs, and a German page must not inherit English plural logic by accident.

The alternative — a second script for German — was rejected: it would double the
behaviour surface and break the "one script" rule.

## 7. German editorial decisions

Full detail lives in `i18n/glossary.md`; the decisions that shape the prose:

* **Voice.** Formal `Sie` in calls to action, first person `ich` for the
  practice. No `wir` for solo work. Sentences may be longer than English but
  must keep one claim each.
* **Typography.** `„…“` and `‚…‘`; ` – ` (spaced en dash) for asides, `–`
  (unspaced) for ranges; `.` for thousands, `,` for decimals; dates as
  `13. November 2026`. A translation may move a full stop across a link
  boundary, so the generator drops a boundary space before closing punctuation
  and after opening punctuation, and `--check` fails on ` .`, ` ,` in the shipped
  page.
* **Never translate:** GAMS, DERLA, MEMOR, LIPFA, CANTUS, OAIS, CoreTrustSeal,
  CLARIN, WDS, IIIF, Zenodo, DOI, GISA, GLN, ODbL, CC, Bock CLI Tool, JetBrains.
* **Position titles** stay in their official English form on the German page
  (e.g. `Senior Developer (Full-Stack Engineer)`), because they are employment
  records, not prose.
* **Record titles:** English deposit titles are translated on the German pages
  and both practice-note colophons disclose it. German `lang="de"` titles are
  copied verbatim, including their original quotation marks and any spelling in
  the deposit (`Assiszentzsystemen`).
* **GAMS role, both languages:** "senior developer on the new version of GAMS",
  never "lead" (§8).
* **MEMOR:** "gemeldet an", never "deportiert nach"; "der Registereintrag
  verzeichnet keinen Tod", never "überlebte"; "in Hartheim ermordet" where the
  register records a death there. The dataset line in the German colophon is a
  German rendering plus the DOI, not the verbatim English deposit title; it is
  one catalog value away from being reverted.
* **Numbers and names** are not localised: `4.393`, `668`, `812`, `604` keep
  their meaning across both pages, and proper names keep their diacritics.

## 8. English source corrections the review forced

The German read exposed English inaccuracies. These are English-side fixes, not
translations, and they are in the source of truth:

| Where | Before | After |
| --- | --- | --- |
| Hero lead, profile remit, CV summary, services card, CV bullet, evidence value | "leads development" / "leads the new version" | "senior developer on the new version of GAMS" / "current version" |
| Teaching + ai-coding record | `AI coding assistants advanced` | `AI coding assistants (advanced)` |
| Teaching | `JetBrains IDEs` | `Jetbrains IDEs` (as deposited) |
| Teaching + ai-coding record | `Copilot technologies in the DH` | `Copilot technologies in the digital humanities` |
| German course title | `AI Pair-Programmers` without hyphen | `AI-Pair-Programmers` |
| German titles in the teaching list | straight/English quotation | `„…“` |

The GAMS wording now appears in six places with one claim: a senior developer
role, not leadership of the project.

## 9. The German review

Read page by page against the English, then against the glossary. The
corrections below are representative of ~40 changes; the catalog is the record.

### 9.1 Index

* `Vertrauenswürdig seit 2014` (not a literal "trusted since"), `Nutzende`
  instead of `Benutzer`, `konkrete Probleme aus Forschung und Wirtschaft` for
  the capabilities claim.
* `Bock CLI Tool` kept as a product name; the English record title uses the
  deposited `Jetbrains IDEs`, while the German page translates the title and
  uses the current vendor spelling `JetBrains-IDEs`.
* The MEMOR source line in the contact/training area was rewritten as a German
  sentence rather than a translated deposit title.
* Proof-strip claims, profile remit and services cards were re-read for the
  `Sie`/`ich` boundary: the remit describes, the CTA addresses.

### 9.2 storymap.html (DERLA)

* `erklärt sich daraus` for the causal sentence, `enthalten die Routen` for the
  data inventory, `nur ungefähr` for the projection caveat.
* `Zeichen tragen` for "marks carry", so a memorial marker is not called a
  `Symbol`.
* The three counts and the legend wording were checked against the map's own
  `<title>`/`<desc>`; the German map text is identical in both hosts because it
  is generated from the same fragment.

### 9.3 memor.html

* `Sterbeeinträge` for register entries, `Todesfälle` for the count of deaths:
  the register records an entry, the study counts deaths, and the two must not
  collapse into one word.
* `an einer erzwungenen Adresse gemeldet` / `gemeldet an` for the involuntary
  address; never `deportiert`.
* The Hartheim table and the `zehn häufigsten` ranking were renumbered and
  re-agreed with the counts (247/214/172, 513 of 668).
* The Graz map chapter states why it has no map (`Dieses Kapitel hat keine
  Karte, und das ist Absicht`) instead of translating "deliberately unmapped"
  literally.

### 9.4 Practice notes

* `Schwelle` for "gate" in the agent brief, `wird … ausgeführt` for the passive
  execution sentence, `Es läuft durch` for the pipeline's plain-language line.
* Record rows keep the English event type labels (`Workshop`, `Vortrag`) where
  they name the deposited form, and German prose around them.

### 9.5 Typography defects closed

* A space before a full stop after a link boundary in the contact note.
* `–,` twice: an en dash immediately followed by a comma.
* English quotes inside German titles (`“Urfehdebücher …”`) replaced with `„…“`.
* The generator now drops a boundary space when a translation starts with a
  closing mark or ends with an opening mark, and `--check` gained a
  `typography` section (`STRAY_SPACE`). It was verified by deliberately
  reintroducing the bug; it failed at `de/index.html:1618: space before "."`.
  The grep invariant in `i18n/README.md` and AGENTS.md was corrected at the same
  time: in ERE `[ \t]` matches a literal `t`, so the check uses the POSIX class,
  `grep -rnoE '[[:space:]][.,;:!?]([[:space:]]|$|<)'`.

## 10. Decisions and rejected options

| Decision | Alternative | Why |
| --- | --- | --- |
| Generated `de/` tree, committed | Runtime swap; hand-maintained copies | §2. Deterministic, diffable, works without JS, has real URLs. |
| Keyless catalog (normalised English) | Stable IDs (`hero.lead.1`) | No ID drift, review reads as bilingual prose; the cost is a context collision, mitigated by `rich`. |
| Generator owns `lang-alt` + switch | Hand-paste into ten pages | One table cannot drift; `--check` verifies both regions. |
| Switch strings in `SWITCH_TEXT` | Catalog entries | Chrome, not content; keeps the switch out of translator files. |
| JSON island + `UI_FALLBACK` | Second script; inlining German into `site.js` | One script for both languages, English remains the fallback. |
| Translate English deposit titles | Keep English titles verbatim | The German page should read as German; disclosed in both colophons. Reversible one value at a time. |
| Hartheim "ermordet" | "starb in Hartheim" | The register records a death in a killing facility; the glossary fixes the stronger verb and the site keeps it. |
| Pending translator sets are transient | Keep them as an archive | `--merge` overwrites catalog values; a stale set would silently revert the review. Deleted after merge; `--extract` recreates empty ones. |

## 11. Implementation record

Files added: `tools/i18n/build_i18n.py`, `i18n/de.json`, `i18n/README.md`,
`i18n/glossary.md`, `i18n/switch-design.md`, `de/*.html` (five pages), this
record. Files edited: `index.html` (GAMS wording, `data-ui-strings` island,
`lang-alt` + switch markers, record-title fixes), `storymap.html`,
`memor.html`, `ai-agents.html`, `ai-coding.html` (switch + alternates,
title fixes), `js/site.js` (`UI_FALLBACK`, `ui()`), `css/custom-styles.css`
(§6 switch, §18 ≤900 alignment, §19 masthead alignment, §20 forced colours, §22 print),
`README.md`, `AGENTS.md`.

Not touched: both map generators, any `map:`/`memor:` fragment, images, fonts,
the design tokens, every id and fragment link.

Checks run (condensed outputs; `--check` prints the same counts with `i18n
check: OK` and exit 0):

```
i18n check: OK   pages 5   strings 862   translated 862   ignored 0   rich 0
problems 0       summary 0 keys without an entry, 0 untranslated catalog keys
lang="de" placements: index 16 · storymap 5 · memor 2 · ai-agents 5 · ai-coding 5
de/index.html: project-card 23 · teaching-item 21 · section-head 8 · h1 1
de/index.html: lang-switch__item 2 · lang-switch:begin 1 · aria-label="Sprache" 1
de/*: <script> in storymap/memor/ai-agents/ai-coding 0 each; de/index 4
de/index.html: lang="en" 1 (the switch's EN cell only)
gzip: index 30,668 · storymap 12,037 · memor 11,631 · ai-agents 4,692 · ai-coding 5,055
gzip de: index 31,210 · storymap 12,260 · memor 11,883 · ai-agents 5,052 · ai-coding 5,396
```

Determinism: `--build` twice, then `git diff --stat` empty; `--check` green.
`gjs js/site.js` stops at "document is not defined" (syntax valid). The
`i18n/pending/` directory is empty by design.

**Browser pass (Chrome, local server).** Run after the static work and recorded
here because it changed the masthead's alignment rule:

- Switch at 1440/1120/1000/901 is 71.9 × 34 at `--action`-free rest, both cells
  32px tall inside the 72px header; the current cell measures 600 weight with a
  2px underline at 4px offset, the link 500. Tab order is skip → brand → nav ×3 →
  CTA → DE. Focus ring 2px inset −3px.
- The standalone masthead wraps between 1120 and 1040px (German) and between 1000
  and 901px (English), not at 900. A first rule put `margin-left: auto` on the
  pill inside the ≤900 block; measured at 901 (814px after the scrollbar)
  `de/storymap.html` and `de/ai-coding.html` still dropped it to a second line at
  the left. Replaced with `justify-content: flex-end` on `.sm-head__inner` —
  inert on any line whose note has already taken the free space, so it only
  moves the wrapped line — plus `flex-start` and the pill's own auto margin at
  ≤640, where the brand can sit alone on its line. Verified on all eight pages at
  1440/1280/1120/1040/1000/950/901/900/800/720/641/640/500/375/360/320: brand
  flush left, switch flush right, no overflow.
- Mobile disclosure at 375: toggle opens `flex`, the switch is the last child,
  right-aligned at x = 283.1 (71.9 × 34), no body scroll lock, Esc closes,
  Enter on the focused DE link lands on `/de/index.html`.
- German `data-ui-strings` island: load-more 9 → 18 → 23 (`9 weitere …` →
  `5 weitere …`), filters 9/9/9/4 with `9 von 11 Projekten`, copy
  `Kopieren` → `Kopiert` → `Kopieren`, form `Wird gesendet …` → German success
  / error with `is-sending` and a disabled submit.
- Hero typed line reserves the tallest German phrase (59px at 1440, 59.4px at
  375), pause/resume swaps the label, reduced motion leaves phrase 1 complete
  with no caret and no button; arrival draw appears at 50ms and clears at 952ms
  with no-preference, and never under reduce.
- Forced colours: switch keeps a black border, the current cell 600 + underline,
  the link `LinkText`.
- Both maps render 2 / 1 paths in German, no clipping at 375, and the CV plates
  fit the 350px column at 390. All ten pages load with no console message and
  no non-200/304 request; 29 images, 0 broken. No horizontal overflow at
  1440/1120/1000/901/900/720/640/420/375/360 on EN/DE index and the DE
  standalone pages.

Not verified here: **print**. The available browser tooling cannot emulate
print media, so the two print hide lists and the report layout are covered by
reading the rules only. That, and a visual review of the remaining widths, stay
in the manual pass in AGENTS.md.

## 12. Open for the owner

1. **Bilingual title policy.** English deposit titles are translated on the
   German pages and disclosed in both colophons. Confirm that is preferred over
   keeping the deposited English title verbatim. It is one catalog value per
   title.
2. **MEMOR dataset title.** The German colophon renders the dataset line in
   German plus the DOI rather than the verbatim deposit title. Confirm, or
   restore the deposit title as one value.
3. **English teaching titles that differ from Zenodo deposits.** `10340362`,
   `10340488`, `10340675`, `5379569` and `18847078` still differ from their
   deposited titles (pre-existing English content, not changed here). Decide
   whether the site should quote deposits verbatim.
4. **`Todesfälle` vs `ermordet`.** The German page says `668 Todesfälle` for the
   count and `in Hartheim ermordet` where the register records a death there.
   This is a deliberate editorial distinction; confirm it reads as intended.
5. **Meta description drift.** All five metadata strings say "Senior developer of
   GAMS"; the page says "senior developer on the new version of GAMS". Neither
   claims leadership, but the two are not identical. Align the metadata or keep
   the shorter form.
6. **`redesignv11.md` §9.1** (the personal-capacity `.legal-note` in the contact
   card) is still blocking publication and is untouched by V16.

## 13. Claims and limits

* German is complete for the five pages at this commit. Any English edit makes
  `de/` stale until `--extract` / translation / `--build` / `--check`; the gate
  says so.
* No German text was produced by a machine translation service. The review in
  §9 is the editorial record; `i18n/glossary.md` is the reusable rule set.
* The German pages are not a translation of the design: they are the same
  structure, ids, data hooks and motion contract, with German text. A future
  component must land in the English page first; the generator cannot invent a
  German-only block.
* Four German pages load no script, exactly like their English peers. The
  switch is one link plus the current label, so it is never gated by
  `html.js-ready` and never hidden pending script.

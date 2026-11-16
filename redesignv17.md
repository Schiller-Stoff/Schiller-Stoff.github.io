# V17 — "Selected writing"

Status: **implemented on `redesign`, uncommitted** (15 Nov 2026). V16 is
untouched in structure. V17 adds no section to the CV, no script, no font, no
new image, no colour, size or radius token. It adds six English pages, six
generated German twins, one list component, one CV line and one sentence in
each practice note. See §5 and §7 for the integration and verification record.

Content source: `writing-series-draft.md` (owner-settled selection, figures,
English prose and German vocabulary). This record explains the *decisions*;
that file holds the *copy*.

---

## 1. The thesis

> The CV says what was deposited. A series says what it argued.

The training list already carries 21 records and the practice notes carry the
method. Neither states what a deposit claimed, whether the claim still holds
years later, and what its author would now write differently. Five
readings close that gap — one per line of work, each on a preserved Zenodo
deposit, each with the record's own metadata printed beside the argument.

Three boundaries keep the series from becoming a portfolio:

1. **A reading, not a reprint.** A post describes the deposit, restates its
   argument and then says what has changed. No deposit text is reproduced.
2. **A record, not a metric.** Download figures appear once, date-stamped
   (`Zenodo, 15 November 2026`), as evidence of use. There is no live counter
   and deliberately no refresh script.
3. **A post defers to the note.** Where a post overlaps a practice note, the
   note owns the method and the post links to it. No post points back.

The series also fixes a discovery problem V14 created: two practice notes were
reachable only from the hero index and card 04. The posts give their deposits a
second route and give the notes a longer reading.

---

## 2. Selection: reach, then distinctness

The rule is public on the index page, because a selection without a rule is a
preference.

| # | Post | Zenodo record | Type | Deposited | Downloads | Unique |
|---|---|---|---:|---|---:|---:|
| 1 | Agents are roles, not robots | `10.5281/zenodo.14999965` | Lesson | 10 Mar 2025 | 3,154 | 2,760 |
| 2 | Autocomplete was never the point | `10.5281/zenodo.10288101` | Presentation | 7 Dec 2023 | 862 | 770 |
| 3 | A shared language for systems | `10.5281/zenodo.15421823` | Presentation | 15 May 2025 | 227 | 170 |
| 4 | FAIR is a gate, not a badge | `10.5281/zenodo.17178206` | Conference paper | 22 Sep 2025 | 103 | 95 |
| 5 | Organisation determines technology | `10.5281/zenodo.8386446` | Conference paper | 29 Sep 2023 | 140 | 131 |

Reach is Zenodo's, read on 15 November 2026.

**Omitted on purpose** — each repeats the argument of post 1 or 2:
`14943178` (277/264), `10698240` (281/260), `14234115` (289/251),
`14195629` (242/151), `13751610` (229/147), `11196383` (193/167). They stay in
the teaching list and in the practice notes; the index names the first three as
workshops it does not reprint.

**Rejected alternatives:** strict download ranking (four of five posts would be
AI-coding workshops, so the series would argue one thesis five times);
preservation-weighted selection (it would drop a first-author FORGE paper for a
ten-author iPRES paper). Both are recorded in the draft's §2.

Note that the ranking is not monotonic in the table: post 4 (103) sits before
post 5 (140). That is intentional — the series is ordered by line of work
(agents → coding → architecture → FAIR → preservation), and reach only picks
*which* record represents each line. Sorting the rows by downloads would break
the reading order and is not a bug to fix.

---

## 3. The six-page contract

Flat root, like the two practice notes, so the generator's `../` asset rule and
the `de/` sibling links work unchanged.

| English | German | `<h1>` | Chapters | Argument block |
|---|---|---:|---:|---|
| `writing.html` | `de/writing.html` | 1 | 2 + colophon | — (the list) |
| `writing-agents.html` | `de/writing-agents.html` | 1 | 4 + colophon | `sm-split` |
| `writing-copilot.html` | `de/writing-copilot.html` | 1 | 4 + colophon | `sm-steps` |
| `writing-architecture.html` | `de/writing-architecture.html` | 1 | 4 + colophon | `sm-split` |
| `writing-fair-code.html` | `de/writing-fair-code.html` | 1 | 4 + colophon | `sm-steps` |
| `writing-organisation.html` | `de/writing-organisation.html` | 1 | 4 + colophon | `sm-steps` |

Every page reuses the `sm-*` shell of `ai-agents.html` verbatim — masthead,
hero, sticky chapter rail, alternating white/paper chapters, colophon, small
footer, skip link, inline sprite. Nothing new was invented for the shell, and
no `sm-*` class was renamed.

**The five posts share four chapter titles:** `Why it exists` · `The argument` ·
`What holds in 2026` · `The record`, plus `Colophon`. That is a series signature
and a translation decision — the catalogue stores each shared string once
instead of five times, and a reader moving between posts lands in the same
places.

Each post then carries:

- one hero: kicker `Selected writing · <discipline>`, the deposit's claim as
  `<h1>`, a standfirst, and a meta line naming the deposit (`Source record ·
  10 March 2025 · CC BY 4.0`);
- exactly one argument block — `sm-split` when the argument is a two-way
  contrast (what the workshop requires / what it does not; what the deck gives
  you / what it leaves out), `sm-steps` when the argument is a sequence;
- one record card, `dl.sm-meta`, eight rows, verbatim from Zenodo: Title, Type,
  Deposited (`<time datetime>`), DOI as text, Co-author(s), Licence, Reach,
  Contents;
- one `ul.sm-links` row with a single outbound `text-link` to `doi.org`;
- a five-row colophon: Method, Sources, Authorship, JavaScript, Licence;
- cross-links: brand and the footer's `Imprint` → `index.html`, `writing.html`
  twice (masthead nav and one colophon button), `index.html#services-section`
  twice (masthead nav and the primary colophon button).

**Contract, not preference:** no `<script>`, no image beyond the social meta,
one `<h1>`, no map, figure, chart, legend or dataset citation. All six pages
are complete without JavaScript and there is nothing to gate: no `html.*`
class is used, no reveal, no motion beyond the rail's existing CSS
scroll-driven progress rule, which the shell already provided.

Metadata: `og:type` is `website` on the index and `article` on the five posts.
`meta description`, `og:description` and `twitter:description` are one identical
string per page (the standfirst, trimmed to one sentence), so the three can
never drift. The social card is the square portrait, not `og-cover.jpg` — that
file is a DERLA memorial screenshot and would be the wrong image for an
argument about software.

**German deposit titles** stay `lang="de"` inside the English pages; the German
pages carry no `lang` attribute at all, because the whole page is German.

---

## 4. The index list — the one new component

`writing.html` is hero, rail (`01 The five`, `02 How I chose`, `Colophon`), the
list, the selection note, the colophon.

```html
<ol class="sm-posts" role="list">
  <li class="sm-post">
    <a class="sm-post__link" href="writing-agents.html">
      <span class="label" aria-hidden="true">01</span>
      <div class="sm-post__body">
        <h3 class="sm-post__title">Agents are roles, not robots.</h3>
        <p class="sm-post__standfirst">…</p>
        <p class="sm-post__meta">AI agent engineering · 2025 · 3,154 downloads</p>
      </div>
      <span class="sm-post__arrow" aria-hidden="true">…</span>
    </a>
  </li>
  …
</ol>
```

Decisions:

- **The row is the target, not the title.** One `<a class="sm-post__link">` per
  `<li>`; the hairline sits on `.sm-post__link`, so the whole band is clickable
  and focusable. The register made the opposite choice (one link per card, not
  the card) because a card has a thumbnail; a text row does not.
- **Three columns, no card.** `3.5rem | minmax(0, 1fr) | 1.5rem` at
  `var(--space-lg)` inline / `var(--space-sm)` block gap, baseline-aligned. The
  ordinal is the existing `.label` voice — no new rule; the arrow is the
  register's `--shift-sm` 3px nudge without its circle.
- **One 2px accent rule above, one 1px hairline per row, no outer border.**
  Distinction is shape, as everywhere else on this site.
- **The meta line wraps, never truncates.** Tabular figures so the five reach
  numbers align.
- **Order is the published selection rule.** The index is not re-sortable, has
  no filter and no "see all": five rows are the whole series.
- **Hover/focus** turn the title `--action` and underline it at `--rule-hair`
  with a 3px offset, and colour the arrow `--action`; the arrow's 3px transform
  sits inside `prefers-reduced-motion: no-preference`, so the underline and the
  colour still carry the state under reduce.
- **≤640px:** one column, the arrow is dropped (it would be stranded under the
  meta line), gaps tighten to `--space-xs`. Nothing overflows at 360.
- **Forced colours:** `.sm-posts` and `.sm-post__link` borders and the arrow go
  `CanvasText`; the 2px/1px shape distinction survives without the accent.
- **Print:** a plain list of five — the accent rule prints `#000`, hairlines
  `#999`, the arrow is dropped, the title prints 12 pt serif,
  standfirst and meta `#000`, each row `break-inside: avoid`, and the posts'
  DOI links get an underline so the record reads as a link on paper. The index
  is a screen artefact that happens to print well; making it print-hidden (like
  the register) would have cost the reader the table of contents in the printed
  CV.

Three CSS blocks, no tokens:

1. §19, immediately before `/* Links and colophon */` — `.sm-posts`,
   `.sm-post__link`, `.sm-post__title`, `.sm-post__standfirst`, `.sm-post__meta`,
   `.sm-post__arrow`, the hover/focus pair, the reduced-motion arrow, the ≤640
   rule.
2. §20, immediately after the `.sm-record a` rule — the forced-colours group.
3. §22, immediately before the print block's closing brace — the print group
   above, after the practice notes' print declarations.

`.sm-post` itself carries no rule: it is a semantic hook for the five rows and
for the print/forced-colours descendants. The row's geometry lives on the link,
which is the only visible box, so a rule on the `li` would have been a second
source of truth for the same padding.

---

## 5. Integration

Three edits, no layout risk, no new section:

1. **`index.html`, training section.** One
   `article.publication-highlight.publication-highlight--text` — label
   `Selected writing · 2026`, `h3` "Five records, read again", one paragraph,
   one `text-link` "Read the five readings" — inserted directly after the MEMOR
   dataset line and before `<div class="teaching-list">`. It reuses the
   text-only treatment V10 built for the dataset line, so it adds no CSS and
   inherits print. `article class="publication-highlight` goes 2 → 3; AGENTS.md's
   verify line was updated and no other invariant moved.
2. **`ai-agents.html`** — one sentence appended to the colophon `Sources` row:
   "Its longer reading is *Agents are roles, not robots*."
3. **`ai-coding.html`** — one sentence appended to `Sources`: "The longer
   readings are *Autocomplete was never the point* and *FAIR is a gate, not a
   badge*."

The CV's header nav and the hero index are untouched. The index has six panes
that divide evenly at 2-up and 3-up; a seventh would create a ragged 4+2 row,
whose empty cells print as a lighter patch rather than a gap.

Direction of links is one-way by design: practice note → post, post → the index
and the CV, post → DOI. No post links back to a practice note, and no post
links another post — the index is the hub, and each post's "All writing" button
returns to it. A post that chained to its neighbours would read as a blog
archive; a hub keeps the five readings a series and keeps the sitemap flat.

---

## 6. The German catalogue

`de/writing*.html` is generated, never edited. Work order: six rows added to
`PAGES` in `tools/i18n/build_i18n.py` → `--render-markers` → `--extract` →
translate `i18n/de.json` → `--build` → `--check`. (`--render-markers` and
`--extract` each ran twice while the six pages settled: markers first, then the
string scan over the final markup.)

The catalog grew from 862 to 1,109 strings: **249 added, two superseded
`Sources` keys deleted, +247 net**. The two deleted keys were the
sentence-only `Sources` values that the §5 cross-link sentences replaced; leaving
them would have passed `--check` and put dead German in the file.

`i18n/pending/` was used as a working set and deleted after folding, as the
mechanism requires. No `de/*` file was hand-edited; `--check` compares every
German page byte for byte against a fresh build.

### 6.1 One constraint the catalogue cannot solve

`Co-author` and `Co-authors` are **two shared keys**, and a shared key can hold
only one German value. The three singular record cards (Tosques, Martin, Münzer)
therefore all print `Mitautor:in`, and the two plural cards print
`Mitautor:innen`. `Oberhoffer`, `Mitverfasserin`, `Mitverfasser` and
`Mitautor*in` were each considered and rejected:

- the catalog is the only place German is edited, so a per-page gender form
  would need three duplicate keys (`Co-author (m)`, `Co-author (f)`, …) and a
  translator instruction for each — four more strings to keep aligned than the
  problem is worth, and the parser would have to be told why they exist;
- the record card prints metadata, not prose. `Mitautor:in` is a label, and the
  colon form is the standard German neutral label in bibliographic and
  institutional use;
- the alternative that keeps gendered prose — naming the person — does not fit
  a `dt`/`dd` record row.

This is a **known departure from German prose style inside a metadata label** and
is recorded here rather than hidden in the catalog. If the owner wants gendered
forms, the cost is three keys and a `PAGES`-level variant, not a rewrite of the
posts.

### 6.2 Other German decisions

- Masthead theme is the short word, the hero kicker the full discipline:
  `Texte` / `KI-Agenten` / `KI-Coding` / `Architektur` / `FAIR-Code` /
  `Archivierung`, while the preservation kicker still says
  `Digitale Langzeitarchivierung`. `Archivierung` alone because the full word
  takes a second masthead line at 1120px.
- `reading` → `Lesart`, `record` → `Eintrag`, `reach` → `Abrufe`, matching the
  glossary's existing choices (`Ausgewählte Ergebnisse`, `Titel der Einträge`).
- `human review` in the English prose → `menschliche Nacharbeit`; the paper's
  own term `Human-in-the-loop` is never quoted, so no mixed-language jargon
  ships.
- One obvious draft typo was corrected in the German only:
  `Bildungslicenz` → `Bildungslizenz`.
- **The three English-language record titles are translated on the German
  pages** (`Einführung in das KI-Agenten-Engineering`, `Copilot-Technologien in
  den Digital Humanities`, `Softwarearchitektur für Data Librarians`), while
  the two German-language ones stay verbatim and say so in the lede. The
  generator's gate rejects a `lang="en"` on a German page outside the switch,
  so a verbatim English title is not available to the German tree without
  changing a rule that protects every other page. Library practice (`original
  title` plus optional translation) would be the better answer; until the gate
  supports a translated-title exception, the DOI link one row below is the
  authoritative string.
- Thousands are `.` (`3.154`), dates `D. Month YYYY`, quotes `„…“`, no space
  before punctuation — all enforced by `--check`'s `typography` section.

---

## 7. Verification record

Static counts (`--check` green, `gjs js/site.js` unchanged):

```
<script>          writing*.html 0 each · de/writing*.html 0 each
<h1>              1 per page, EN and DE
sm-chapter        <section class="sm-chapter  4 per post, 2 in the index
argument block    sm-steps|sm-split 1 per post
sm-post rows      5 · sm-post__link 5 (one target per row)
lang-switch:begin 1 on each of the twelve writing pages
publication-highlight index.html 3 (volume + MEMOR dataset + Selected writing)
outcome__figure   index.html 2 (unchanged)
font-family: var(--font-serif)  9 (the .sm-post__title reuses the sm rule)
space before punctuation in de/writing*.html  none
```

`i18n check: OK` — pages 11, strings 1,109, translated 1,109, ignored 0,
rich 0, `problems 0`. Per-page: 0 untranslated, 0 without an entry; `lang="de"`
placeholders unchanged on the five older pages, and 1 each on
`writing-fair-code.html` / `writing-organisation.html` (the German deposit
titles).

Gzip transfer size:

| page | EN | DE |
|---|---:|---:|
| `writing.html` | 3,288 B | 3,497 B |
| `writing-agents.html` | 4,316 B | 4,566 B |
| `writing-copilot.html` | 4,124 B | 4,367 B |
| `writing-architecture.html` | 4,329 B | 4,560 B |
| `writing-fair-code.html` | 4,278 B | 4,557 B |
| `writing-organisation.html` | 4,271 B | 4,502 B |

The index is the budget case (target ≈ 6 KB); the posts are 4.1–4.6 KB, i.e.
smaller than `memor.html` and roughly the size of the practice notes. The
German pages are consistently 200–300 B larger, as V16's pages were.

Links: every local `src`/`href`/`url()` target and every fragment resolves from
both languages, and no target is missing. All five DOIs are distinct; each
appears exactly twice inside its own post — once as record-card text and once as
the `doi.org` link — and never on another page.

Determinism: `--check` re-builds all eleven German pages in memory and compares
them byte for byte against the committed files, so a rebuild cannot change
anything; it exits 0.

### 7.1 The editorial pass on the German

Three pairs (`architecture`, `organisation`, `copilot`) were read against their
English source after the build. Eight defects were found, all prose, none in data:
metadata, DOIs, dates, reach figures, co-authors and contents matched exactly, and
`--check` was green throughout. All eight were corrected **in the catalog** and
regenerated, never in `de/*`:

| page | German before | German after |
| --- | --- | --- |
| architecture | `was es kostet, es weiter zu tun` | `was es kostet, das weiter zu tun` |
| architecture | `schwer über Teams zu teilen` | `schwer auf mehrere Teams aufzuteilen` |
| copilot | `Slash-Befehle auf die geöffnete Datei` | `Slash-Befehle, die auf die geöffnete Datei … wirken` |
| copilot | `Eine Aktion auf der geöffneten Datei` | `Eine Aktion an der geöffneten Datei oder Auswahl` |
| copilot | `mit dem Repository im Blick` | `mit dem Repository als Kontext` |
| copilot | `entlasten von wiederholender Arbeit` | `nehmen repetitive Arbeit ab` |
| copilot | `ein Produkt mit Preis` | `ein kostenpflichtiges Produkt` |
| organisation | `eine Infrastruktur ihre Anforderungen verliert` | `eine Infrastruktur nicht mehr zu ihren Anforderungen passt` |

One punctuation divergence was made on purpose: the English lede keeps
`can that code be FAIR.` (a declarative question, the essay's voice), the German
gets a real question mark, because `Kann dieser Code FAIR sein.` reads as a typo.
Two data claims were tightened in the same pass: the architecture record card no
longer states a file size (the deposit is 2.33 MiB, so `2.4 MB` was a near-miss
that added nothing), and the contents rows were checked against the deposits —
both FORGE PDFs are full papers, not slide decks, so `paper (PDF)` stands.

Verified against the Zenodo API on 15 November 2026: record type, publication
date, title, file list, creators, licence and `stats.unique_downloads` for all
five DOIs. Every number in the record cards matches.

**Not verified here: print and forced colours in a real browser.** The chrome
tooling available exposes no print media, so §4's print declarations, the
index's five-row stack and the CV's third `publication-highlight` are covered by
reading the rules, and the widths (1440/1000/900/640/375) stay in AGENTS.md's
manual pass. What *is* verified is that nothing in the six pages depends on
script, colour or motion to be readable.

---

## 8. Open for the owner

1. **The CV block is the one reversible edit.** Delete one
   `article.publication-highlight` and one catalogue group and the series is
   reachable only from the practice notes — worse for discovery, one translated
   block cheaper.
2. **`Mitautor:in`** (§6.1). Gendered forms cost three keys.
3. **The index prints.** If it should be screen-only, the print group becomes
   one `display: none`.
4. **Figures are date-stamped, not live.** A `tools/zenodo/stats.py` refresh was
   deliberately not built: it adds a network dependency, a second source of
   truth and a new failure mode for a number that is evidence.
5. **The rail takes three rows at 360px** in German. That is existing
   standalone behaviour, identical in both languages and without overflow;
   fixing it would change all ten standalone pages.
6. **`writing-series-draft.md`** stays in the repo as the content, selection,
   translation and verification record for the series. It is not part of the
   published site.
7. **Translated record titles on the German tree** (§6.2). If verbatim English
   titles matter more than the gate's `lang` rule, the change is one exception
   in `tools/i18n/build_i18n.py` plus three catalogue entries — not a rewrite.

---

## 9. The writing route, added after publication

The series shipped reachable from one place: the CV's
`publication-highlight--text` line in `#teaching-section`, plus the two
practice notes that point in. The owner then asked for the posts "in the
navigation". The entry is **one link, not a menu**: `Writing` →
`writing.html` sits third in the primary nav (after Work, before Experience),
and the footer's Explore list repeats it after Work.

The index is the list of posts. It states the selection rule, carries the
standfirsts and the five figures, and is the only thing that has to change when
a sixth post arrives. A header dropdown would copy that list into two
languages, nest a second disclosure inside the ≤900px navigation disclosure,
and need Esc, light-dismiss, `aria-expanded` and a current state for five rows
that are one click away. It is also a format claim the series refuses: no
chronology, no feed, no comments.

**The label.** `Writing`, not `Blog` — every surface of the series says
writing: *Selected writing*, *All writing*, `Ausgewählte Texte`, `Alle Texte`.
German is `Texte`, the shortest accurate noun (35.0px; `Schriften` 58.4,
`Notizen` 49.2) and the one the series already uses. The pair is now recorded
in `i18n/glossary.md` (`writing (nav, series) | Texte`), so the next translator
inherits it instead of re-deciding.

**The width problem and how it is paid.** A fourth item costs ~55px. The
German header — `Leistungen Projekte Werdegang` plus the 163.8px
`Projekt anfragen` pill and the 72px switch — had ~45px of slack at 901px, so
the item alone would have been ~10px short just above the disclosure
breakpoint: the flex row does not scroll, it squeezes `.brand` and the
wordmark wraps inside the 72px header. No German label or CTA was shortened;
the layout pays instead. In the existing `@media (max-width: 1120px)` block the
two header gaps drop to their token floors: `.nav__links` to `--space-sm`
(12px) and `.nav__menu` to `--space-lg` (24px). Above 1120px the published
`clamp()` gaps return.

| Header, four links | 1440 | 1121 | 1120 | 1000 | 901 |
|---|---|---|---|---|---|
| EN slack | 217.0 | 178.7 | 235.1 | 151.3 | 60.3 |
| DE slack | 176.2 | 138.0 | 194.3 | 110.4 | 19.4 |

No sideways scroll at any width, the CTA stays 38px high (it never wraps), and
the nav stays one row down to 901px. The cost of paying in layout is one
visible seam: at 1120→1121 the nav block widens by ~57px. That boundary already
restructures the hero, the section heads and the feature plates, so the seam
joins existing ones rather than creating a new kind. If it reads badly in
review, the fallback is `links 14px / menu 24px`, which still leaves 13.4px in
German at 901px.

The band buys width with text-size headroom: at 901px, a browser default font
of 17px rather than 16px wraps the wordmark inside the fixed header (the
three-link header held to 18px). Nothing scrolls sideways and nothing is
hidden, and the failure predates this change — the flex row has always paid a
deficit by squeezing `.brand` — but the margin is now one step thinner. The
honest fixes, if the owner wants them, are a shorter German CTA or an
intentional two-line header below 1120; neither is in this change.

**Not the hero index.** The series is deliberately absent from the six-pane
`nav.hero__index`: six panes divide evenly into 3-up and 2-up, and a seventh
would leave the ragged row whose empty cell prints as a lighter
`--on-dark-rule` patch. The header carries the route; the fold stays as
shipped.

**No current state, deliberately.** `initScrollspy` selects
`.nav__links a[href^="#"]` only, so the cross-page link never gets
`aria-current` — verified by scrolling to `#cv-section`: Experience carries
`location`, Writing carries nothing. The writing pages name themselves in their
masthead note (`Selected writing 2023–2026`, `Selected writing AI agents`),
and the primary header is not duplicated onto them.

**Verification.** Real browser, this repo: EN/DE at 1440/1121/1120/1000/901
(one row, no overflow, CTA 38px, brand 219.4–280.7); the disclosure open and
closed at 900/640/375/360 (four full-width rows above the CTA and the switch,
menu 312px, no overflow); the same four widths with `html.nav-ready` and
`js-ready` stripped to simulate no JavaScript (header in flow, four links on
one row, header height unchanged — 165px at 375/360, 139px at 900, 121px at
640 — so the extra link costs no height); forced colours at 1120 DE (`Texte`
visible, `CanvasText` border and underline, 2px focus outline, no accent
dependency); focus order brand → Services → Work → Writing → Experience → CTA
→ DE (the current-language cell is a `<span>`, so it is not a tab stop).
`tools/i18n/build_i18n.py --check` prints `problems 0`, and `--build` rewrites
only `de/index.html` — the ten other German pages are byte-identical, because
no nav is rendered there.

Print is untouched: the site header and footer are already in the print hide
list, so the new route prints nowhere.

## 10. The favicon, at last

The V7 open-decisions table ended with one off-palette asset: a 30px green
tree `favicon.png` on white, the only element in the page that did not come
from the V7–V17 palette. This change replaces it with the identity reduced to
its two colours.

**The mark.** A single `S`, built as one 4-unit stroke on a 32-unit grid
(`M21 12 A5 4 … A5 4 …`): at 16px that is a 2px stroke with 3×2px counters,
14×20 units of ink, optically centred. Its edges fall on half-pixels, so
Chrome's 16px raster is antialiased rather than pixel-snapped; the integral
stroke width is what keeps the counters open. It is the
initial of the wordmark, so it needs no reading of the name, and it is the only
candidate that survives the tab: a Source Serif `S` loses its contraforma at
16px (and no font may be referenced anyway), the ledger grid and the
registration cross close into a `#`-like mush, and the DERLA/MEMOR dot field
becomes a blob. The squared stroke is a 16px concession, not a typeface claim.
No gradient, no shadow, no `<text>`, no external reference, 259 bytes.

**Why the tile is white, not ultramarine.** Ultramarine `#1a0de0` has a WCAG
relative luminance of 0.0589, close to the grey of a dark tab bar; a
white-on-ultramarine chip measures 1.67:1 on Chrome's `#202124` and 1.25:1 on
`#35363a`, so its edge disappears in dark mode. White ground inverts the problem:
the ink carries the letterform on light chrome (9.64:1 on white, 8.68:1 on
`--surface-paper`) and the tile carries the silhouette on dark chrome
(16.10:1 on `#202124`, 12.07:1 on `#35363a`, 21:1 on black). Ink on its own
tile is always 9.64:1, shape survives greyscale, and no asset has to know the
scheme. A `prefers-color-scheme` pair was rejected: it doubles the cache
entries, is applied inconsistently across engines, and buys nothing the
contrast table does not already give.

**Assets shipped.** `favicon.svg` (primary, any DPR), `favicon-32.png` (RGB,
no alpha; the fallback for engines without SVG icons and the 2× asset for a
16px slot), `apple-touch-icon.png` (180×180 RGB, opaque, because iOS
composites alpha onto black). Derivatives are rendered once from the SVG with
headless Chrome and stripped to RGB with Pillow — committed, never generated at
page load. No `.ico` (a second encode for IE11 and old Windows pinning), no
16px PNG, no 96/192/512, no manifest and no maskable or pinned-tab variant: the
mark sits inside a 12.8-unit safe circle, so one source would serve a manifest
if one ever appears.

**Integration.** The English head swaps one line for three, in this order:
32px PNG, SVG, apple-touch. The German tree is generated, so `de/*` was not
edited; `ASSET_PREFIXES` in `tools/i18n/build_i18n.py` gained the three names
and `--build` wrote the `../`-prefixed links into all eleven pages, with
`--check` printing `problems 0`. The 30px `favicon.png` stays in the repo for
one release, unreferenced, so HTML still in browser caches does not 404 in the
icon slot; it should be deleted after the next publish.

**Verification.** The SVG was rendered at 16/32/180 and inspected as a
nearest-neighbour zoom plus on white and on `#202124`: the `S` resolves at 16
with no fused counter. Served over HTTP, all three assets return 200 with
`image/svg+xml` / `image/png` on both the English and the German page, the
`<link>` list resolves to the root files from `/de/`, and the browser Network
pane shows no 404 and no console message. Size: 259 B + 579 B + 3,366 B.

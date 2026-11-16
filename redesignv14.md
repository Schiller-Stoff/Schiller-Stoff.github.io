# V14 — "The AI practice"

Status: **implemented on `redesign`, uncommitted** (14 Nov 2026). V13 is
untouched. V14 adds two routes to the hero index and two standalone practice
notes; it does not add a section to the CV and does not change the storymap
plates. See §13 for the implementation record.

Review: webdesigner pass, 14 Nov 2026. Measured at 1440/1280/1121/1120/1000/901/
641/640/375. The review's changes are folded in below; §12 records what changed.

---

## 1. The problem

The page states "Responsible AI workflows" once, as the fourth service card. It
is the only place where the AI work is visible, and it is a capability line, not
evidence. The publication and teaching record is much stronger than that card:
between December 2023 and February 2026 the owner co-authored and taught a
series on coding assistants, generated-code quality, AI-agent engineering and AI
assistance inside GAMS.

The task is to make that role legible **without** turning the CV into an AI
billboard, inventing adoption numbers, or claiming a certification. The answer
is the same shape the site already uses for the remembrance platforms: two
standalone pages, each a practice note with a dated record, reached from the
hero index.

## 2. The position

> The assistant writes code. You sign it.

Two pages, two lenses on one method:

| Page | File | Claim | The record behind it |
|------|------|-------|----------------------|
| AI agent engineering | `ai-agents.html` | An agent is a bounded worker: a written brief, a short list of tools, a check it must pass, and a record of what it did. | DHd 2025 agent-engineering workshop section; the 2026 DHd paper and talk on AI assistance in GAMS; the 2025 FAIR-code abstract. |
| AI coding assistants | `ai-coding.html` | Coding assistants compress the distance between a decision and its implementation, which makes review the bottleneck and the most valuable step. | The 2023–2025 workshop series; the UFBAS GPT-4 overhaul; the 2025 pair-programmer talk and FAIR-code abstract. |

The pages are **practice notes**, not product pages. They describe a method the
owner uses and teaches, with the publication record as evidence. They do not
sell "responsible AI" as a badge, do not name clients, and do not claim a
standard, audit or certification.

## 3. Information architecture

```
Hero index (six routes)
├── 01 Work ............... #portfolio-section
├── 02 Storymaps .......... storymap.html
├── 03 Training ........... #teaching-section
├── 04 Experience ......... #cv-section
├── 05 AI agents .......... ai-agents.html   ← new
└── 06 AI coding .......... ai-coding.html   ← new
                                │
                                ├── cross-link to each other
                                ├── back to index.html#services-section
                                └── colophon with the dated record

#services-section, card 04 ("Responsible AI workflows")
└── two text links to the same two pages
```

The CV keeps its **eight** `.section-head` blocks. The AI pages are peers of the
storymaps, not a fifth sales section. The hero index is the only place the two
new routes appear at the fold.

## 4. Main-page changes

### 4.1 Hero index: four routes become six

- Bar range: `01–04` → `01–06`.
- Two new panes at the bottom, same component, no variant:

| # | Title | Meta | Target | Glyph |
|---|-------|------|--------|-------|
| 05 | AI agents | Brief · tools · checks | `ai-agents.html` | `#i-agent` |
| 06 | AI coding | 2023–2025 series | `ai-coding.html` | `#i-code` |

`AI coding` (not "Coding assistants"): measured, "Coding assistants" is 125.7px
at 16px against a 116px title slot in the 169.5px desktop pane, so it wraps to
two lines while the other five stay on one. That breaks the V12 shared-baseline
rule. `AI coding` is ~70px and parallels `AI agents`. The meta names the record,
not a vendor: `Copilot · FAIR code` was rejected because it puts a product mark
in a navigation control and promotes a conference abstract to a standard.

- Two new 24×24 line symbols in the existing sprite, 1.7 stroke:
  - `i-agent`: a bounded box with a core and four ports (a worker with a scope,
    not a robot or a sparkle).
  - `i-code`: `</>` chevrons with a slash.
- The ordinal and glyph stay `aria-hidden`; each pane remains one `<a>`.
- No new token, font size, radius, shadow or animation. Hover, focus, the
  pointer light and the white focus ring are unchanged.

**Responsive composition — measured, option C:**

| Width | Composition | Pane width | Result |
|-------|-------------|------------|--------|
| 1121+ | 2-up in the copy's right column, three rows | 169.5 | Six titles and metas on one line. |
| 641–1120 | **3-up, two rows** | 337.8 at 1120 · 301 at 1000 · 270.6 at 901 | Every title and meta on one line; no empty cells. |
| ≤640 | 2-up, three rows | ~286 at 640 · 164 at 360 | Existing 118/112px panes; one row taller. |

Option A (6-up at 901–1120) was rejected: at 901 the pane is 134.8px and the
meta needs ~118px of a 103px inner measure, so it wraps and the pane grows
148→164; 135×148 is outside the shipped pane family in the wrong direction.
Option B (4-up with the last two spanning) was rejected: 406–507px panes are
the "empty drawer" V12 refused, and giving two routes double width is an
editorial ranking expressed as geometry. A ragged 4+2 grid is worse than either:
the two empty cells render as `--on-dark-rule` over `--action`, a **lighter
ultramarine patch**, not a gap.

**Exact CSS:** in `@media (max-width: 1120px)` change
`.hero__index-grid { grid-template-columns: repeat(4, …) }` to `repeat(3, …)`.
Base stays 2-up; ≤640 stays 2-up. That is the whole responsive change — no new
breakpoint, and one fewer distinct state than the current 4-up band.

**Cost, accepted:** at 901–1120 the index is two rows (328px); at a 900px
viewport the second row starts at y≈812 and is cut, so the AI pair is the cut
row there. At ≤640 the index gains one row (+118px). Both are scroll, not
clipping.

**≥1121 growth (measured):** 0px at 1440 (copy 479px, index 477px), +16px at
1280, +32px at 1121 (the index is taller than the 445px copy there). The copy
stays centred, but the alignment flips across the band: at 1440/1280 the copy is
taller, at 1121 the index is. The profile band's top rule is still 162px above
the fold at 905 and 25px at 768. The 460×515 ghost sheet now frames the 477px
index with 13px above and 24px below, so it still frames the window, but it no
longer "repeats the index's proportions" (1:1.12 vs 1:1.40). Leave the geometry;
change the V13 CSS comment at the sheet rule from "repeats the index's
proportions" to "frames the index plate", and note it in this record.

### 4.2 Hero copy

- **No fourth `.hero__engagements` item.** Measured: adding `responsible AI
  workflows` wraps the row, and the wrapped item starts the new line with the
  hairline `border-left` still on it — the exact defect the ≤900 rule exists to
  prevent. It also costs +23px of copy height, more than all six panes. The AI
  routes are carried by the index, the service card and the record list.
- The typed-phrase JSON may gain **one** phrase, inserted second, but not an
  AI-named one: the rotation's register is durability, and the only
  technology-named line would make AI the site's thesis. If a fourth line is
  wanted, use:
  `"A generated change is only as good as the review it passes."`
  Phrase 1 stays the static no-JS fallback; the reserved-height logic already
  measures every phrase. This is optional and can ship without it.
- The h1, lead and actions are unchanged. The page is still a heritage offer;
  AI is a named practice, not a second headline.

### 4.3 Services card 04

Under the existing technologies line, add a `.capability__links` row. Reuse
`.btn-row` for geometry:

```html
<div class="btn-row capability__links">
  <a class="text-link" href="ai-agents.html">AI agent engineering …</a>
  <a class="text-link" href="ai-coding.html">AI coding assistants …</a>
</div>
```

One CSS rule: `.capability__links { margin-top: var(--space-md); }`. No second
flex rule, no new card, no fifth card, no change to the four-card grid or the
services h2/intro. Hide `.capability__links` in print (the printed CV stays a
concise CV; the pages are screen artefacts).

### 4.4 Teaching list

Add the 2026 DHd item at the top of `.teaching-list` (21 items total):

- Meta: `Presentation · DHd 2026 · 23–27 Feb 2026`
- `h3 lang="de"`: `Wo ist der KI-Sweetspot? Nutzen und Herausforderungen für die Einbindung von KI-Assistenzsystemen ins Geisteswissenschaftliche Asset Management System (GAMS)`
- Link: `https://doi.org/10.5281/zenodo.18847078` (the slides; authored by
  Schiller-Stoff, Münzer and Citro). The paper is in the DHd 2026 Book of
  Abstracts (`10.5281/zenodo.18591948`); link the slides, not the whole book.
  The practice note links the standalone paper record
  (`10.5281/zenodo.18696498`) instead.

### 4.5 Metadata

Add `responsible AI, AI agents, AI coding assistants` to the existing
`keywords` and `schema_org:keywords`. No JSON-LD, no `makesOffer`.

## 5. The two practice pages

Both use the existing `sm-*` shell (`sm-body`, `sm-head`, `sm-hero`, `sm-rail`,
`sm-chapter`, `sm-colophon`, `sm-foot`), the same two self-hosted fonts, the
same stylesheet, the local three-symbol sprite, and **no JavaScript**. They are
not storymaps; the masthead note reads `Practice note`, the masthead nav's
`aria-label` is `Practice note`, and the pages are printable reports.

Reusing the shell is deliberate: `sm-` is **standalone**, not storymap. The
shell is long-form furniture (masthead, hero, rail, numbered chapters,
alternating grounds, colophon, footer). The data-study furniture is **not**
copied: no `.sm-figure`, `.sm-figcaption`, `.sm-map*`, `map__*`, `.sm-legend`,
`.sm-forms`, `.sm-bars`, `.sm-rank`, no "Data: … extracted …" hero meta, no
dataset licence row. The pages carry no numbers that would need a chart.

Shared page grammar:

- one `h1` in the hero, one `h2` per chapter, `h3` only inside a component;
- a sticky chapter rail (static and wrapping ≤900px) with a scroll-progress
  rule that is decorative and reduced-motion-safe;
- alternating white/paper chapter grounds;
- a colophon with a `<dl class="sm-meta">` and a back button;
- all external links `target="_blank" rel="noopener"`;
- German titles keep `lang="de"`.

### 5.1 `ai-agents.html` — "Agents with a brief."

- `<title>`: `Agents with a brief — AI agent engineering`
- Kicker: `Practice note · AI agent engineering`
- Standfirst: `An agent is not a colleague. It is a bounded worker: a written
  brief, a set of tools, a check it must pass, and a record of what it did. I
  design that boundary into research systems — and teach it.`
- Meta: `Practice note · record 2025–2026` (the masthead note and the kicker
  use the same word; no "no JavaScript", that is a colophon row).
- Rail: 01 The brief · 02 The toolbox · 03 The check · 04 What I teach ·
  Colophon

| Chapter | Copy spine | Component |
|---------|------------|-----------|
| 01 The brief | An agent is a loop: read, choose a tool, act, check, repeat. The model is one component; the brief decides whether the loop is useful. A brief names the task, the systems in scope, the tools, the stop conditions and the signatory. Research software is full of actions that are easy to automate and expensive to undo: a migration, a bulk metadata edit, a publish step, a deletion. The brief is how they stay reversible. | `.sm-steps sm-steps--row`: Brief / Act / Check / Record, four steps, one 2px accent top rule on the `<ol>`, no vertical rules; 4→2→1 columns. Closing note: "The loop is deliberately dull. Dull is the point." |
| 02 The toolbox | The useful tools are unglamorous: an archive API, a search index, a repository checkout, a test suite, a metadata schema. The 2026 DHd paper on AI assistance in GAMS asks where the sweet spot is between reusing existing LLM building blocks and building your own — and how to integrate either without technical debt. The lesson I take is narrower than the demo: give the agent the same interfaces a colleague would get, and no more. | `.sm-split`: **In scope** (read public/licensed sources; query the archive API; draft code and tests; propose metadata edits; summarise a diff) / **Out of scope** (publish or delete records; invent citations or identifiers; change licences; act on personal data; approve its own output). `.sm-note`: a callable tool is both an attack surface and an audit obligation; keep the list short. |
| 03 The check | The 2025 FAIR-code abstract with Münzer asks whether LLM-generated code can be FAIR. Not by default: generated code often arrives without maintainable structure, metadata or a clear licence, which limits findability and lawful reuse. The same is true of an agent's output, only faster. So the check is a gate, not a vibe. | `.sm-steps` (stacked): It runs · It is tested · It is attributable · It is licensed · A person signs it. Each item one sentence. |
| 04 What I teach | The method is public; the record is the evidence. Agent engineering is taught as a bounded practice, not a tool tour. | `.sm-record` (5 rows): the 2025-03-04 advanced prompt/agent workshop and its 2025-03-10 slides/notebooks (one event, two deposits); the 2026 GAMS paper (standalone record `18696498`, full title); the 2026 DHd talk, whose deposit title is the short `Wo ist der KI-Sweetspot?`, dated to the conference window 23–27 Feb 2026 (uploaded 3 Mar); the 2025-09-26 FAIR-code abstract. The two 2026 rows must not print the same title twice. Closing note names the co-authors by surname. |

Colophon rows: Method · Sources · Record titles · Authorship · JavaScript ·
Licence. Include:
`This is a practice note, not a product claim: it describes a method I use and
teach, not a standard or a certification.` Credit Münzer, Scholger, Pollin,
Steyer and Citro by surname. Back links to `index.html#services-section` and
`ai-coding.html`.

### 5.2 `ai-coding.html` — "The assistant writes code. You sign it."

- `<title>`: `The assistant writes code. You sign it. — AI coding assistants`
- Kicker: `Practice note · AI coding assistants`
- Standfirst: `Since 2023 I have taught research teams to use coding assistants
  without handing over judgement: what the tools do, where they fail, and what a
  reviewed AI change has to pass. This page is the workshop record, the case
  behind it, and the limits I teach with it.`
- Meta: `Practice note · record 2023–2025`
- Rail: 01 What changed · 02 The curriculum · 03 The case · 04 The limits ·
  05 The signature · Colophon

| Chapter | Copy spine | Component |
|---------|------------|-----------|
| 01 What changed | In 2023 the question was whether autocomplete could finish a line; by 2024 whether a chat window could refactor a module; by 2025 the tools could read a repository and run a command. The interface moved; the risk stayed the same: code that looks right in the editor and is wrong in the system. Teach the tools by their failure modes, not their feature lists. | `.sm-split`: **What the tool is good at** (boilerplate, test scaffolding, unfamiliar APIs, explaining legacy code) / **What it cannot see** (the research question, the data model, the licence, the consequence of a publish). |
| 02 The curriculum | A workshop series, not a one-off demo. December 2023 to September 2025: autocomplete → chat → refactoring → review. Every step is open on Zenodo. | `.sm-record` (9 rows): Copilot technologies in the DH (2023-12-04); Legacy code and copilot technologies (2024-01-22); UFBAS GPT-4 paper (2024-02-21); IDE integration of GitHub Copilot (2024-05-15); AI coding assistants (2024-09-12); AI coding assistants (advanced) (2024-11-21); KI gestützte Programmierung (2024-11-28); AI-Pair-Programmers at DHd (2025-03-05); FAIR code (2025-09-26). No `.sm-note` above the list — the lede already says every step is on Zenodo. Closing note credits co-teachers by surname. |
| 03 The case | The Urfehdebücher der Stadt Basel edition needed an overhaul: data model, transformation, visualisation and the web application. With the UFBAS team we used GPT-4 across those steps — TEI XML, categories and SKOS, an ontology, RDF, frontend work and data visualisation — and documented where it helped and where it did not. The lesson was not that the model wrote the edition. It compressed the distance between a decision and its implementation, which made review the bottleneck and the most valuable part of the process. | `.sm-split`: **What the model did** (draft transformations, propose mappings, generate frontend scaffolding, explain unfamiliar code) / **What the team decided** (the data model, ontology commitments, licence, what counted as a correct transformation, what shipped). |
| 04 The limits | The 2025 FAIR-code abstract names the failure modes: generated code with poor maintainability, missing metadata and licence uncertainty is hard to find and hard to reuse lawfully; insecure libraries and inconsistent standards compound it. In research that is a data-quality problem, not a style problem. Vibe coding is a starting point, not a method. | `.sm-steps` (stacked): The diff is small enough to read · The tests ran · The dependency and its licence are known · The prompt and sources are recorded · A person signs the commit. |
| 05 The signature | The assistant can write the code. It cannot sign. The brief, the test, the licence and the signature stay with the person who ships. | Two short paragraphs + two links: "Read the agent method" → `ai-agents.html`; "Back to the CV" → `index.html#services-section`. |

Colophon rows: Method · Sources · Record titles · Authorship · JavaScript ·
Licence. Credit
Münzer, Sagadin, Dittmann, Martin, Pollin, Scholger, Steiner, Lang, Galka by
surname.
Back links.

## 6. Components and CSS

All new classes are `sm-*`-scoped and live in §19. No new token, font size,
radius, shadow, gradient, colour or animation. Existing values only:
`--action`, `--rule`, `--rule-strong`, `--surface-paper`, `--ink`, `--ink-soft`,
`--ink-muted`, `--space-*`, `--text-*`, `--leading-*`, `--tracking-*`,
`--rule-accent`, `--rule-hair`.

Three families, not five. `.sm-loop` and `.sm-checklist` would have been the
same anatomy (number + verdict + sentence); merging them keeps the vocabulary
growth at two new families plus one record list.

| Class | Geometry | Notes |
|-------|----------|-------|
| `.sm-steps` | Base: one column, `3.5rem minmax(0,1fr)`, hairline between rows, `padding-block: var(--space-md)`. `--row`: 4 columns above 900, 2 at ≤900, 1 at ≤640; no vertical rules. | `<ol role="list">`; number = `--text-2xs`/600/`--tracking-label`, tabular; name = `--text-base`/600; note = `--text-sm`/`--ink-soft`. One 2px accent top rule on the `<ol>` for the `--row` variant; the stacked variant keeps a hairline per row and no accent. Implement the rule as a **border** (like `.sm-form`), never as the `.delivery-path::before` pseudo-element — that is gated behind `html.motion-ready` and these pages load no JS. |
| `.sm-split` | 2 columns, `gap: clamp(24px,3vw,40px)`, 1 column ≤900. Two **1px `--rule` hairlines**, no accent: in/out is a dichotomy, not a hierarchy. | Two `<section>`s with an `h3` (`--text-sm`/600/`--tracking-title`), each a `<ul role="list">` (`gap: var(--space-xs)`, `--text-base`/`--leading-body`/`--ink-soft`). |
| `.sm-record` | `9.5rem minmax(0,1fr)`; ≤640 one column, date/type on one line above the title. | `<ol role="list">`; cell 1 = `<time datetime>` (tabular) + type `.label`; cell 2 = the one `<a>`. The aria-hidden external icon is absolutely pinned to the cell's trailing edge (`padding-right: 1.9rem` reserves its slot), because an inline arrow is pushed onto a line of its own by a long title and reads as a stray glyph. No third link column. |
| `.capability__links` | `div.btn-row.capability__links`; one rule `margin-top: var(--space-md)` | CV-side print hook; no new flex rule. |

Responsive: the sm breakpoints (900, 640) only. No new breakpoint. No horizontal
scroll at 375px.

Print: the existing sm print block hides the masthead nav, rail, footer and back
button. A4 at 16mm margins is ~673px, so the ≤900 rules apply **in print**;
re-declare the new components:
- `.sm-steps--row` → 2 columns (not 4, not 1);
- `.sm-split` → 2 columns;
- `.sm-record` → 2 columns;
- `.sm-hero__title` and `.sm-chapter__title` → `max-width: none` (the 22ch/24ch
  screen measures otherwise print as ragged narrow columns);
- `.sm-record a` → underline (`a { text-decoration: none }` would strip the
  evidence's affordance);
- rules `#000`/`#999`, text `#000`; `break-inside: avoid` on
  `.sm-steps__item`, `.sm-split__col`, `.sm-record__row`.
Hide `.capability__links` in print.

Forced colours: `.sm-steps`/`.sm-split`/`.sm-record` borders → `CanvasText`;
`.sm-record a` → `color: LinkText; text-decoration: underline`;
`.sm-split .sm-note` border-left → `CanvasText`. The 2px-vs-1px weight remains
the only distinction and is shape, so it survives. No state depends on
ultramarine.

Reduced motion: the pages add no motion. The only animation is the existing
`.sm-rail__progress` scroll timeline, already stopped under reduced motion. The
CV's new index panes use the existing hover/focus transitions and pointer light;
no new motion. `initArrival()` only handles `a[href^="#"]`, so the two `.html`
panes are ignored and `site.js` needs no change.

## 7. Claims ledger

Every sentence that asserts something about the owner's work must map to one of
these records. Do not add a claim that is not in the table.

| Claim on the page | Source |
|-------------------|--------|
| Introduction to AI-Agent-Engineering, 2025 | `10.5281/zenodo.14999965` (Schiller-Stoff, Scholger, Pollin) |
| Advanced prompt + agent engineering workshop, 2025 | `10.5281/zenodo.14943178` (Pollin, Steyer, Scholger, Schiller-Stoff) |
| AI assistance in GAMS, DHd 2026 | paper `10.5281/zenodo.18696498` (Schiller-Stoff, Münzer, Citro); talk `10.5281/zenodo.18847078`; both also in `10.5281/zenodo.18591948` |
| LLM-generated code and FAIR | `10.5281/zenodo.17178206` (Schiller-Stoff, Münzer) |
| UFBAS GPT-4 overhaul | `10.5281/zenodo.10698240` (Pollin, Scholger, Steiner, Lang, Galka, Schiller-Stoff) |
| Coding-assistant workshop series 2023–2025 | `10288101`, `10550479`, `11196383`, `13751610`, `14195629`, `14234115` |
| Pair-programmers in the humanities | `10.5281/zenodo.14943176` (Schiller-Stoff, Münzer, Dittmann, Sagadin) |

No adoption numbers, user counts, time savings, cost savings, model benchmarks
or "first/only" claims. No claim that a named institution adopted a method
beyond what the cited record says. No claim of a certification.

## 8. Accessibility, SEO, contracts

- One `h1` per page; `h2` per chapter; `h3` only inside components; the rail is
  a `<nav aria-label="Chapters">` with an ordered list; the hero has
  `aria-labelledby`.
- Skip link, focus styles, no focus traps, no script. Masthead and rail link
  hit areas are inherited from the `sm-*` shell and are below 44px; this note
  does not fix the shared shell.
- Both pages: canonical URL, description, OG/Twitter tags; the social image is
  the existing square portrait `images/profile/sebastian-stoff.webp` with a
  `summary` card, **not** `images/og-cover.jpg` — that image is a DERLA memorial
  screenshot and must not preview an AI note; `lang="en"` with `lang="de"` on
  German titles.
- Cross-page contract: `index.html#services-section`, `ai-agents.html`,
  `ai-coding.html` all resolve; the two pages link to each other and back.
- No `site.js`, no fonts beyond the two self-hosted woff2, no CDN, no new image.
- §19's heading/comment changes from "Storymap page — storymap.html" to
  "Standalone pages — storymap.html, memor.html and the practice notes";
  document `sm-` as **standalone**, not storymap.

## 9. Implementation order

1. `index.html`: sprite symbols, index panes + range, optional typed phrase,
   services links, 2026 teaching item, metadata.
2. `css/custom-styles.css`: index 3-up at ≤1120; `.capability__links`; §19
   comment; `.sm-steps` (+`--row`), `.sm-split`, `.sm-record`; print and
   forced-colour additions; ghost-sheet comment.
3. `ai-agents.html`: shell, hero, rail, four chapters, colophon.
4. `ai-coding.html`: shell, hero, rail, five chapters, colophon.
5. `AGENTS.md`: source-of-truth entries for both pages, the six-route index,
   the 21-item teaching list, the new invariants and the V14 record link.
6. Verify (no commit, no push).

## 10. Verification

```bash
grep -c 'class="hero__index-link"' index.html                 # 6
grep -c 'class="teaching-item"' index.html                    # 21
grep -c 'class="section-head"' index.html                     # 8 (unchanged)
grep -c '<h1' ai-agents.html ai-coding.html                   # 1 each
grep -c '<script' ai-agents.html ai-coding.html               # 0 each
grep -c 'class="sm-chapter' ai-agents.html                    # 4 (chapters) + colophon
grep -c 'class="sm-chapter' ai-coding.html                    # 5 (chapters) + colophon
grep -nE 'cdn|unpkg|jsdelivr|gsap|aos\.|scrollreveal' ai-agents.html ai-coding.html  # no output
grep -n 'background-image' css/custom-styles.css               # still no output
grep -c 'new window.IntersectionObserver' js/site.js           # still 2
gzip -c ai-agents.html | wc -c                                 # target < 15 KB
gzip -c ai-coding.html | wc -c                                 # target < 15 KB
```

Browser pass: 1440/1280/1121/1120/1000/901/900/641/640/420/375 on the CV (six
panes, no wrapped title, no empty cells, no sideways scroll), both pages (rail
wraps at 900, record rows stack at 640, no clipping), print preview (both pages
as reports; CV hides the index and the capability links), forced colours
(borders and underlined record links, no colour-only states), reduced motion
(rail progress static), JS disabled (CV complete; both pages complete), and
keyboard tab order through every pane and record link.

## 11. Open questions

1. **Typed phrase.** Optional. The recommended line is
   `"A generated change is only as good as the review it passes."`; do not use
   the AI-named line.
2. **2026 talk date — resolved.** The conference ran 23–27 Feb 2026; the slides
   are deposited 3 Mar 2026. Both the CV teaching item and the practice-note
   record use the conference window (`23–27 Feb 2026`), not the upload date.
   The owner can substitute an exact talk day if one is wanted; the record says
   only what the conference window supports.
3. **Capability links in print.** Hidden, so the printed CV stays a CV. Confirm.
4. **Page names.** `ai-agents.html` and `ai-coding.html` are short and stable;
   the page titles carry the full terms. Renaming later would break the hero
   contract, so decide now.

## 12. Review log (webdesigner pass, v14.0 → v14.1)

| Finding | Resolution |
|---------|------------|
| Pane 06 "Coding assistants" wraps to two lines at 169.5px | Title becomes `AI coding`; meta becomes `2023–2025 series` |
| 4-up with six panes leaves a lighter-ultramarine sash patch | 3-up at 641–1120, one declaration; no ragged grid |
| 6-up at 901 makes 135px panes and wraps the meta | Rejected; 3-up measured 271–338px, every line holds |
| Pane B gives two routes double width | Rejected; geometry must not rank routes |
| Hero growth claim was one number | Corrected: 0/+16/+32px at 1440/1280/1121 |
| Ghost sheet no longer repeats index proportions | Geometry kept; comment changed to "frames the index"; framing measured 13px/24px |
| Fourth engagement item wraps with a leading hairline | Dropped; AI signal stays in index, card, record |
| AI-named typed phrase makes AI the site thesis | Replaced with the review's "generated change" line; optional |
| Four new components for two prose pages | Merged loop + checklist into `.sm-steps`; `.capability__links` gets no geometry |
| `.sm-split` accent would rank in/out | Two 1px hairlines, no accent |
| `.sm-record` third column squeezes titles | Two columns; one link per row; the arrow pins to the cell's trailing edge |
| A4 print width is ~673px, so ≤900 applies in print | Explicit print re-declarations for steps/split/record; titles `max-width: none`; record links underlined |
| Forced colours covered only storymap furniture | Added steps/split/record/note borders and LinkText record links |
| `.delivery-path::before` is motion-gated | New rules are static borders; no JS gate |
| `aria-label="Storymap"` on the shared masthead | New pages use `aria-label="Practice note"` |
| §19 calls the shell "Storymap page" | Comment and AGENTS entry broaden to "Standalone pages" |
| "the 2026 paper" / "the 2025 paper" over-claim | "the 2026 GAMS paper" / "FAIR-code abstract"; the paper links its own record |
| "I design that boundary for research software … teams" | "I design that boundary into research systems — and teach it" |
| "It cannot hold the mandate" / "What stays human" | "It cannot sign" / chapter 05 renamed "The signature" |

## 13. Implementation record (14 Nov 2026)

Implemented on branch `redesign`; nothing staged, committed or pushed. Files:
`index.html`, `css/custom-styles.css`, `ai-agents.html`, `ai-coding.html`,
`AGENTS.md`, this record.

What shipped, against the design:

- Six hero-index routes (`01–06`), 3-up from 641–1120, 2-up otherwise; no new
  token, breakpoint, shadow or animation. `site.js` unchanged.
- Services card 04 closes with `.capability__links` (two text links, print-hidden).
- Teaching list gains the DHd 2026 GAMS item (21 items); its meta uses the
  conference window `23–27 Feb 2026`.
- Three new `sm-*` families — `.sm-steps` (+`--row`), `.sm-split`, `.sm-record`
  — with print re-declarations at the ~673px A4 measure and forced-colour
  `CanvasText`/`LinkText` states. No JS gate on any of them.
- Both practice notes are script-free, use the existing two fonts and tokens,
  print as reports, and carry a five-row and a nine-row Zenodo record.

Corrections made during the post-implementation review:

- **Pair-programmer DOI.** The 5 Mar 2025 talk points at the standalone record
  `10.5281/zenodo.14943176` (Schiller-Stoff, Münzer, Dittmann, Sagadin), not
  `14887461`, which is the *DHd 2025 Book of Abstracts*. The CV's teaching item
  was corrected to the same record.
- **Advanced-prompt workshop DOI.** The claims ledger had `14887461`; the
  correct record is `10.5281/zenodo.14943178`.
- **DHd 2026 record date.** The note now says `23–27 Feb 2026` (conference), not
  `3 Mar 2026` (Zenodo upload).
- **Social image.** Both notes preview the square portrait with a `summary`
  card. `og-cover.jpg` is a DERLA memorial screenshot; using it as the preview
  of an AI note was an editorial error, not just a copy bug. (A 1200×630 JPEG
  derivative would be more robust for scrapers than the 400px WebP; it is on
  the open list below.)
- **Claims pass.** The 2025 agent workshop and its slides are one event, not
  two, so the colophon no longer says "the two 2025 agent workshops". The GAMS
  sweet spot is reuse vs technical debt, not "chat window vs collection", and
  the page now says so. The GAMS paper links its own record (`18696498`), not
  the whole Book of Abstracts. The coding curriculum ends in September 2025,
  not November 2025. Dittmann is credited on the two records that list her.

- **Second review pass.** Five defects the first pass left:
  1. *Duplicate record title.* Both 2026 rows printed the full GAMS title, so
     the page read as a duplicate entry. The talk row now carries the deposit's
     own short title, `Wo ist der KI-Sweetspot?`; the paper row keeps the long
     one. Same DOI, same conference window.
  2. *Redundant callout.* `ai-coding` opened chapter 02 with
     `<p class="sm-note">All records open on Zenodo.</p>`, a throwaway line
     rendered as a 2px accent callout directly under a lede that already says
     the same thing. Removed.
  3. *Record titles.* `AI coding assistants advanced` → `(advanced)`,
     `JetBrains` → `Jetbrains`, `AI Pair-Programmers` → `AI-Pair-Programmers`,
     all matching the deposits; the UFBAS title now uses German double
     quotation. Each note gained a **Record titles** colophon row: titles follow
     the deposits, typographic quotation and terminal punctuation are
     normalised, the GAMS paper's deposited `Assiszentzsystemen` is corrected
     above, and type labels name the event form while the deposits' own types
     are broader.
  4. *Genre word.* The hero meta said `Method note` while the masthead, kicker
     and colophon say `Practice note`. Both metas now read `Practice note`.
  5. *Orphaned arrow.* An inline external icon is pushed onto a line of its own
     when a title ends near the cell edge — the long GAMS title did exactly
     that at 1000px. `svg` is a replaced element, so removing the whitespace
     does **not** prevent the break (verified); the arrow is now
     `position: absolute; right: 0` inside a `relative` block link with
     `padding-right: 1.9rem`, so every row carries it at the same trailing
     edge, screen and print. Out-of-flow, it never affects the title's wrap.

Verified locally: 6 index links, 21 teaching items, 8 `.section-head`, one `h1`
per note, zero `<script>` per note, no duplicate DOI, no duplicate id, every
local fragment and file resolves, ~4.3/4.8 KB gzipped per note, and no sideways
scroll at 1440/1120/901/640/375. Print, forced colours and reduced motion were
checked from the stylesheet's own blocks and against headless-Chrome PDFs and
screenshots; the interactive motion pass (typing pause/resume, hover, scroll
timelines) still needs a real browser session.

Open for the owner:

- Approve the square-portrait social card, or commission a dedicated 1200×630
  AI-practice OG image (not generated here). The 400px WebP is a valid
  `summary` card but is below the size/preferred format of some scrapers.
- Approve the `.capability__links` print hide.
- Confirm the exact 2026 talk day if the conference window is too loose.
- Decide whether to fix the shared `sm-*` shell's sub-44px masthead/rail links;
  the two notes inherit the limitation and the design record now says so.
- Print pagination is browser/paper dependent: on headless Letter, `ai-agents`
  leaves one record row on a new page and `ai-coding` leaves the licence row
  alone. Rows never split (`break-inside: avoid`); only the page break moves.

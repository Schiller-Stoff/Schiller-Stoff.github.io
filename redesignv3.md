# Redesign plan v3 — "Finding Aid"

Status: proposal for sign-off. Supersedes `REDESIGN-PLAN.md` and `redesignv2.md`.
Scope: re-skin `index.html` and `css/custom-styles.css`, create `js/site.js`, vendor three font files,
repair broken behaviour, remove dead weight. No framework, no build step, no bundler, no CDN.
Target: `Schiller-Stoff/Schiller-Stoff.github.io`, branch `redesign` (never `master` until cutover).

---

## 0. Why v3 — what is actually on the page today

The v2 refactor landed most of the structure, and that structure is good: semantic sections, an SVG icon
sprite, a token layer, one stylesheet, data hooks. Five things did not land. The page currently ships
**zero working JavaScript**, and three of its four design fonts are missing.

| # | Symptom (what a visitor sees) | Cause | Evidence |
|---|---|---|---|
| 1 | Services, all 4 case studies, all 20 teaching cards and the CV highlight are **invisible** | `.js .reveal{opacity:0}` is armed on every load by the inline `html.js` cheat; `site.js`, which should add `.is-visible`, does not exist | `index.html:34`, `css/custom-styles.css:1916-1925` |
| 2 | **No navigation on phones and tablets** | `data-nav-toggle` is implemented nowhere; the menu stays `visibility:hidden` below 900px | `index.html:215-221`, `css:1959-1981` |
| 3 | Portfolio filter and "Load more" do nothing; 21 cards always visible while the label says "Showing 9 of 21" | `site.js` missing | `index.html:695-702`, `index.html:988` |
| 4 | Headings and body render in Arial/Helvetica | `manrope-var.woff2`, `inter-var.woff2`, `pt-mono-400.woff2` are declared and preloaded but absent on disk | `index.html:30-31`, `css:11-33` |
| 5 | Header never solidifies on scroll, no scrollspy, form status stays empty, footer year is hard-coded | `site.js` missing | `index.html:208`, `index.html:1632` |

Net runtime 404s: **4** (`js/site.js` plus three font files).

### Content defects found alongside

| Defect | Evidence | Notes |
|---|---|---|
| Duplicate DOI on two different entries | `index.html:1055` and `index.html:1066` both point to `10.5281/zenodo.14887461` | 24 DOI links, 23 distinct. One record is wrong. |
| German content declared as English | headings/cards at `519, 659, 951, 1017, 1061, 1072, 1083, 1138, 1193, 1204, 1215` | needs `lang="de"` |
| Filter label vs content | `index.html:701` "Expert opinion" filters `document`, whose only card (`944-953`) is a "Software review" | taxonomy mismatch |
| Award credit inconsistent | `476-477` "the project received" vs `663` "I was honoured with" | accuracy question |
| "Read the announcement" target | `667` points to the ministry index, not the article linked at `658` | label promises more than it delivers |
| Two titles for the same book | feature `519` (German, transcript ISBN) vs card `871` (English, DOI front matter) | ambiguous duplicate |
| Event name used as a title | `1171` "Presentation at FORGE 2023" | reads copy-pasted |
| Stated count ≠ DOM | `702` "Showing 9 of 21" vs 21 `.work-card` elements all visible | category totals: web 9, research 8, tool 9, teaching 4, document 1 |
| Teaching items: 20 in DOM | `1011-1229` | the pre-redesign site had 22 — must be diffed against master before anything is deleted |

**Consequence for sequencing:** repair first, restyle second. A re-skin on top of a page that hides half
its content cannot be judged, and every screenshot would mislead.

---

## 1. Concept — stop imitating a reference

v2 was a faithful copy of a supplied screenshot: grey `#f1f1f4`, navy `#1b2240`, purple `#8b4aa5`,
Manrope/Inter, pill buttons, a hex mosaic hero. That derivation is exactly what makes it read as a
template. v3 takes its language from **the subject matter**, not from a design image:

> **The site as an archival finding aid.** A curator's index of a working life: paper, ink, hairline
> rules, series numbering, call numbers, specimen plates with real captions.

Why this suits the person: he is an art historian and digital humanist who builds archives, editions and
catalogues. The finding aid is his own professional format — ISAD(G) series/item description, archival
signatures, museum object labels. It is authentic rather than borrowed, and it is cheap: rules, numbers
and one typeface pairing instead of artwork.

**Kept from v2:** semantic section structure, icon sprite, single stylesheet, token architecture, content.
**Discarded:** the navy/purple palette, pills, 18px radii, card shadows, the hex mosaic, Manrope/Inter,
and the tonal "calm SaaS" mood.

### 1.1 The signature device — a ruled spine with section call numbers

This is the one thing that makes the design unmistakable, and it is **CSS-only** (one `data-callno`
attribute per section, no script).

- On >= 1000px every `.section` paints a 1px vertical rule at a fixed x inside its own full height. Because
  consecutive sections each paint their own rule edge-to-edge, the result reads as **one continuous spine
  running from "What I do" to Contact**.
- The container is padded past the rail, so content never touches the rule, and long German titles simply
  wrap in the content column.
- Each section's call number — `04/PRT`, `05/TCH`, `06/CV` — sits right-aligned in the rail, on the same
  line as the section eyebrow.
- The hero has **no rail**: it is the cover plate of the book. `.hero` is not a `.section`, so nothing
  extra is needed.

```
┌──────────────┬────────────────────────────────────────────────────────────┐
│              │  COVER — no rail                                           │
│              │  Digital craft from research,                              │
│              │  for everyone working with knowledge.                      │
│              │  ┌───────────────┐   Fig. 01 · DERLA                       │
│              │  │  specimen     │   Format · Period · Stack            │
│              │  │  plate        │                                        │
│              │  └───────────────┘                                        │
├──────────────┼────────────────────────────────────────────────────────────┤
│ S/01  ·  SVC │  WHAT I DO                                                 │
│  ────        │  01 ── Research software engineering                       │
│              │  02 ── Digital archives                                    │
│              │  03 ── Digital editions & Linked Data                      │
├──────────────┼────────────────────────────────────────────────────────────┤
│ S/04  ·  PRT │  PORTFOLIO                     Showing 9 of 21  ▸          │
│  21 ITEMS    │  No.01 ─┐ No.02 ─┐ No.03 ─┐   (flat entries, hairline      │
│              │  frame  │ frame  │ frame  │    frames, no shadows)         │
└──────────────┴────────────────────────────────────────────────────────────┘
```

Implementation (about 20 CSS lines, no markup except the attribute):

```css
:root { --rail: 152px; --rail-gap: clamp(24px, 4vw, 56px); }

@media (min-width: 1000px) {
  .section {
    background-image: linear-gradient(var(--rule), var(--rule));
    background-size: 1px 100%;
    background-position: left calc(var(--gutter) + var(--rail)) top;
    background-repeat: no-repeat;
  }

  .section > .container { padding-left: calc(var(--rail) + var(--rail-gap)); }

  .section-head { position: relative; }

  .section-head::before {
    content: attr(data-callno);
    position: absolute;
    top: 0;
    left: calc(-1 * (var(--rail) + var(--rail-gap)));
    width: var(--rail);
    text-align: right;
    font: 400 0.7rem/1.6 var(--font-mono);
    letter-spacing: 0.08em;
    color: var(--ink-muted);
  }

  .section--dark {
    background-image: linear-gradient(var(--night-rule), var(--night-rule));
  }
  .section--dark .section-head::before { color: var(--night-soft); }
}
```

Below 1000px the rail is simply not painted and the series label stays in the eyebrow text.

**Why not grid + `position: sticky`:** `grid-row: 1 / -1` on a pseudo-element resolves against the explicit
grid, which has no explicit rows here, so the span collapses and the sticky element stops after the first
row. A sticky call number is possible only with an in-flow rail element (a `<span>` inside a full-height
rail column, or a `<div class="section__body">` wrapper). That is a later optional upgrade, not part of the
baseline: it costs 8 wrapper pairs and buys a number that follows the scroll. The rule and the call number
already deliver the effect.

### 1.2 Hero without decoration

- One **specimen plate**: the DERLA map in a 1px ink frame sitting on a `--paper-deep` "mat" (an offset
  mount, not a shadow), wrapped in a real `<figure>` with a museum-label `<figcaption>`:
  `Fig. 01 — DERLA, Digitale Erinnerungslandschaft · 2019–2025 · GAMS / GIS`.
- An **index strip** beneath it: three text links in mono — `01 DERLA · 04 GAMS · 06 NAMPI`. Zero extra
  image requests.
- Remove `aria-hidden` from the hero visual (`index.html:283`); the plate is content now, not ornament.
- **Cut** the hex mosaic (11 images on the LCP path) and the earlier idea of a 6-thumbnail contact sheet.
  This is the single largest weight and complexity saving in the redesign.
- Keep the existing headline ("Digital craft from research, for everyone working with knowledge.") as the
  default; it reads well in serif and avoids copy churn. Alternative copy is an open decision.

---

## 2. The colour code (measured, not eyeballed)

Derived from archival material: **paper, iron-gall ink, a red stamp**, and four **muted printing inks**
from historical map legends. Warm and low-chroma, so it reads as printed matter rather than UI.

### 2.1 Core tokens

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--paper` | `#F5F0E6` | page | — |
| `--paper-deep` | `#EDE6D8` | alternate bands, form wells, image mats | — |
| `--card` | `#FCFAF4` | raised surfaces (warm off-white, not `#fff`) | — |
| `--ink` | `#191A17` | headings, primary button fill | **15.4:1** |
| `--ink-soft` | `#4C4A43` | body copy | **7.8:1** on paper, 7.1:1 on deep |
| `--ink-muted` | `#6F6A5E` | meta only, **paper/card only** | **4.7:1** paper, 5.2:1 card, 4.3:1 deep (forbidden there) |
| `--rule` | `#DCD3C1` | hairlines, frames | decorative |
| `--rule-strong` | `#C0B49B` | input borders, emphasis rules | decorative |
| `--signal` | `#A3392A` | **links, focus, active nav, award stamp — nothing else** | **5.8:1** (hover `#8A2E22`, 7.4:1) |
| `--signal-soft` | `color-mix(in srgb, #A3392A 10%, #F5F0E6)` | chip tints (rgba fallback `rgba(163,57,42,.10)`) | — |
| `--night` | `#1D201C` | one dark band (award), CV highlight | 14.5:1 with paper |
| `--night-soft` | `#A9A697` | text on night | 6.7:1 |
| `--night-rule` | `#3A3B36` | hairlines on night | decorative |
| `--signal-night` | `#E2806B` | links/focus **on night** | 5.9:1. `--signal` is only 2.5:1 there — never use it on night. |

### 2.2 Ink set — small marks only (6px swatches, 3px top rules)

| Token | Value | On paper | Fixed meaning |
|---|---|---|---|
| `--ink-indigo` | `#33476B` | 8.2:1 | web and research |
| `--ink-ochre` | `#7E5C1B` | 5.4:1 | tools and libraries |
| `--ink-moss` | `#4C5C36` | 6.4:1 | teaching |
| `--ink-clay` | `#8A4B2E` | 5.9:1 | document / expert opinion |
| `--ink-graphite` | `#56514A` | 6.9:1 | neutral fallback |

Night variants for the award band: `#93AEDC`, `#D9B166`, `#A8BE8A`, `#D8A98F` (all >= 7.3:1).
Chip text uses the accent on a 10% tint of itself: signal 5.0:1, ochre 4.7:1, moss 5.5:1, indigo 7.0:1,
clay 5.2:1, graphite 5.7:1 — all pass 4.5:1.

### 2.3 Three hard rules

1. Colour is a **mark, never a fill**. Chips are outlined, tinted 10%, accent-coloured text.
2. `--signal` is interactive-only. If it appears on a heading, that is a bug.
3. At most **three visual weights** on the page: paper, card, night. No gradients, no shadows, no
   `mix-blend-mode`.

### 2.4 Token remap from v2 (most of the implementation is search-and-replace)

| v2 | v3 |
|---|---|
| `--bg` | `--paper` |
| `--surface` | `--card` |
| `--accent` | `--signal` |
| `--accent-strong` | `--signal-hover` |
| `--accent-soft` | `--signal-soft` |
| `--navy` | `--night` |
| `--line` | `--rule` |
| `--line-strong` | `--rule-strong` |
| `--lime --blue --orange --green` | `--ink-moss --ink-indigo --ink-ochre --ink-clay` |
| `.section--navy` | `.section--dark` |
| `--radius: 18px` | `--radius: 2px` |
| `--shadow-sm/md/lg` | deleted |

Complexity note: a review pressed for 1 signal plus 2 inks. Four plus graphite is kept because the services
section genuinely has four capability areas and the marks are 6px. If it reads noisy in situ, collapse
ochre and moss into one and remove graphite — a token change, not a rewrite.

---

## 3. Typography

Two self-hosted OFL families. No third family, no CDN, no variable-font payload.

| Role | Face | Size / line-height / tracking |
|---|---|---|
| h1 | Source Serif 4 600 | `clamp(2.6rem, 5.4vw, 4.4rem)` / 1.02 / -0.02em |
| h2 | Source Serif 4 600 | `clamp(1.9rem, 3.2vw, 2.7rem)` / 1.08 |
| h3 | Source Serif 4 600 | 1.25rem / 1.3 |
| h4 | Source Serif 4 600 | 1.02rem / 1.35 |
| Body | Source Serif 4 400 | **1.125rem / 1.65, measure <= 66ch** |
| Labels, dates, counts, chips, call numbers | IBM Plex Mono 400 | 0.72rem, uppercase, 0.1em |
| Nav and buttons | IBM Plex Mono 400 | 0.78rem, 0.01em, **sentence case** |

Decisions forced by review: body size raised from 1.0625rem (spidery at 2x); mono is **not** uppercase in
nav/buttons (that was the "terminal costume"); serif nav stays available as a one-variable switch through
`--font-ui`.

Ship three static woff2 files — serif 400, serif 600, mono 400 — subset to Latin (must include
`ä ö ü ß € – — „ “`), `font-display: swap`, preload serif 400 and 600 only. Static files beat a
300–500KB variable family for a single page.

Numerals: lining, tabular (`font-feature-settings: "lnum","tnum"`) for stats, call numbers and counts; keep
the feature set when subsetting.

---

## 4. Layout and components (bottom-up)

```
L5  PAGES        nav · hero · services · case studies · award · portfolio
                 · teaching · CV · imprint · contact · footer
L4  PATTERNS     ruled spine + call no. · specimen plate + label
                 · alternating feature row · 3-up entry grid · night band
L3  COMPONENTS   buttons · chip+swatch · entry card · field · timeline
                 · nav · contact card · index strip · figure frame
L2  PRIMITIVES   surfaces · rules · type scale · spacing rhythm · links
                 · focus ring · image frame · measure
L1  TOKENS       paper/ink/signal/ink-set · 2 typefaces · radius 2px · rhythm
L0  CONTENT      21 portfolio · 20 teaching · 4 features · 4 services
                 · CV · legal (manifest verified in Phase 0)
```

### 4.1 Metrics

- Container 1180px, gutter `clamp(20px, 5vw, 40px)`, section rhythm `clamp(64px, 8vw, 112px)`.
- Rail 152px at >= 1000px, 0 below; header 76px (68px below 900px).
- **Radius 2px everywhere.** No pills, no 18px cards.
- Buttons: 44px min-height, 1px border, primary = ink fill / paper text, secondary = transparent with
  `--rule-strong`. Hover shifts background and border only — **no `translateY`, no shadow** (cheaper, no
  motion sickness, no layout shift).
- Cards: flat on `--paper` or `--card`, 1px `--rule` frame. Hover darkens the border and underlines the
  title. No lift.
- Portfolio numbering: **stable catalogue numbers** (`No. 05`), not a running rank. CSS counters
  deliberately keep their value when cards are filtered out — that is correct archival identity, and it
  avoids the counter-with-filtering bug (`[hidden]` cards still increment, so a "rank" would read 1, 2, 5,
  7). If a rank is ever wanted, compute it in JS instead.
- Focus: 2px `--signal` ring, 2px offset, 1px paper gap; `--signal-night` on night surfaces.
- Links in prose: `--signal`, underline offset 3px, thickness 1px growing to 2px on hover.

### 4.2 Component inventory

| Component | Notes |
|---|---|
| `.btn` + `--primary` / `--outline` / `--light` / `--sm` | square, no pill, no lift |
| `.chip` + swatch dot | outlined, 10% tint, 6px accent square before label |
| `.entry` (portfolio/teaching card) | flat, hairline frame, `No. 0X`, chip row |
| `.field` | label mono above, `--paper-deep` well, 2px radius, signal focus ring |
| `.timeline` | 2px `--rule` rail, signal ticks, flat cards |
| `.site-header` | transparent on paper, rule + paper on scroll; mono links, serif wordmark |
| `.section-head` | series label (eyebrow) -> h2 -> lead, <= 640px |
| `.plate` | figure with 1px frame, `--paper-deep` mat, mono figcaption |
| `.award` (night) | paper headline, signal stamp, framed image |
| `.index-strip` | mono text links under the hero plate |

No new libraries. The icon sprite in `index.html:140-206` is kept as-is.

---

## 5. Section-by-section

1. **Nav** — paper; 1px rule appears on scroll; serif wordmark plus mono suffix; mono sentence-case links;
   active = 2px signal underline plus `aria-current="page"`; CTA = square ink button. Real mobile drawer
   with Esc, focus return and `aria-expanded`.
2. **Hero** — cover plate: eyebrow, serif h1, lead <= 50ch, two square buttons, availability line, social
   row, specimen plate with caption, index strip. No rail.
3. **What I do** — four numbered dossier entries: CSS counter `01`-`04`, 3px accent top rule, icon, title,
   copy, three chips. No boxed, shadowed cards.
4. **Case studies** — alternating text/image rows; hairline image frame on a paper-deep mat; "My
   contribution" as a ruled list with middot markers; stats with tabular numerals above a rule.
5. **Award** — the one night band; serif headline in paper, vermilion stamp element (`AUSGEZEICHNET 2024`,
   1.5 degree rotation, outlined), framed image.
6. **Portfolio** — flat 3-up entries, 4:3 hairline frames, `No. 0X`, swatch plus chip; filters as
   rule-separated **text buttons** (active = ink, not a filled pill); mono count; text button "Load 9 more".
7. **Teaching** — same entry grammar, 3-up; mono meta row; serif title; top hairline only, no card fill.
8. **CV** — 2px rule timeline with signal ticks; current position as the second night block; competencies
   as tag groups.
9. **Imprint** — flat definition lists, no cards, `--ink-muted` labels.
10. **Contact** — fields on `--paper-deep`, 2px radius, mono labels; ink submit; status line; flat contact
    cards.
11. **Footer** — paper; a real table of contents with mono page numbers; CC BY 3.0 attribution kept.

---

## 6. Repairs — ship before the re-skin

| Fix | Location | Detail | Test |
|---|---|---|---|
| **Fail-safe reveal** | `css:1916-1925`, `index.html:34` | Default = visible. Hide only under `html.reveal-ready`, a class `site.js` sets **after** the observer is attached. Remove the inline `html.js` gate. | Disable JS -> all visible. Delete `site.js` -> still visible. |
| **`js/site.js`** | new file, ~220 lines, vanilla, `defer` | Guarded modules: nav toggle (aria, Esc, focus return, scroll lock, `matchMedia` reset) · header scroll state (sentinel + rAF) · scrollspy (`aria-current`) · filters (`aria-pressed`, `hidden`, count derived from DOM) · load-more (page size 9, hides itself when exhausted, resets on filter) · reveal · Formspree via `fetch` with `Accept: application/json`, `aria-invalid`, native-POST fallback · footer year | Keyboard drawer; every filter; load-more to 21; reduced motion |
| **Fonts** | `fonts/`, `css:11-33`, `index.html:30-31` | Vendor Source Serif 4 400/600 and IBM Plex Mono 400 (woff2, latin subset); rewrite `@font-face` and preloads | Network: **0 x 404**; glyph check for `ä ö ü ß € – —` |
| **Counts** | `index.html:702` | Derive total from `.work-card` (21); page size 9; update the live region | Label matches visible cards in every state |
| **Duplicate DOI** | `index.html:1055` / `1066` | Resolve with the correct Zenodo record for the prompt/agent workshop | 24 links -> 24 distinct DOIs |
| **Language** | German headings/cards at `519, 659, 951, 1017, 1061, 1072, 1083, 1138, 1193, 1204, 1215` | Add `lang="de"` on the element or card | Screen-reader spot-check |
| **Form a11y** | `index.html:1572-1596` | `aria-describedby` to note and status, `aria-invalid` on failure, "(optional)" on subject, honeypot `_gotcha` | Submit empty / invalid / valid |
| **Dead weight** | repo | Delete `css/style.css`, bootstrap/owl/fancybox/aos, `css/_site-blocks.css` (contains `border-right: 1px solid red`), `css/_mixins.css`, `css/mixins/`, all 19 vendor JS files including `js/custom.js`, `scss/` (42 files), icon fonts, `static/img/`, 16 unused images | grep: nothing references them; deployment shrinks |
| **Docs** | `AGENTS.md`, `README.md` | `AGENTS.md` still describes the old site (claims `custom-styles.css` is missing, `js/custom.js` is live) | Read-through |

Order within Phase 1 matters: **reveal CSS and `site.js` land together, or the JS first.** Never ship CSS
that depends on a file that does not exist.

---

## 7. Execution order with gates

ACID in this context:

- **Atomic** — every commit leaves a working page; no half-landed dependency pairs.
- **Consistent** — one token source; content invariants (counts, DOIs, anchors, ids) machine-checked.
- **Isolated** — `redesign/v3` branch or worktree; `master` untouched (a push publishes); `opencode.jsonc`
  never staged.
- **Durable** — assets self-hosted, checks repeatable, no CDN or external design dependency.

| Phase | Work | Gate |
|---|---|---|
| 0 Baseline | Branch; content manifest from `index.html` **and a diff against master `ccf5508`**; 404 list; screenshots 360/768/1024/1440 | Manifest counts = DOM (21/20/4/4); 404 list = the known 4 |
| 1 Repair | Reveal, `site.js`, fonts, counts, DOI, `lang`, form a11y | Working page, 0 x 404, nothing invisible |
| 2 Tokens | Rewrite `:root`; remap names; radius 2px; delete shadows | No raw hex outside `:root`/`color-mix`; contrast script passes |
| 3 Primitives | Buttons, chips, fields, rules, links, focus, image frames | Keyboard tab pass; focus visible on paper **and** night |
| 4 Signature | Rail background rule plus call numbers; hero plate plus caption plus index strip; night band | 1000/1064/1200 widths; longest German title; no horizontal scroll |
| 5 Sections | nav -> hero -> services -> case studies -> award -> portfolio -> teaching -> CV -> imprint -> contact -> footer | Per-section screenshot and one commit each |
| 6 Weight | WebP for the plate plus 41 thumbnails (one-off script, output committed), dimensions, `fetchpriority`, lazy | First view < 900KB; LCP < 2.0s cable; CLS < 0.05 |
| 7 A11y/SEO | `aria-current`, focus trap, reduced motion, print sheet, JSON-LD, `canonical`, `og:image` | Keyboard-only; JS off; 360–1440 matrix; live Formspree test |
| 8 Cutover | Update docs, review diff, merge deliberately | Definition of done |

Optional, if the build wants it: a throwaway `styleguide.html` in Phase 3, deleted before merge.

---

## 8. Verification

No automated suite exists in the repo. Serve the root and check manually, plus these greps:

```bash
python3 -m http.server 8000            # Network panel: 0 x 404, 0 console errors
node --check js/site.js
grep -c 'class="work-card"' index.html                  # 21
grep -c 'class="teach-card reveal"' index.html          # 20
grep -o 'href="[^"]*"' index.html | sort | uniq -d      # no duplicate DOI/URLs
grep -c '<h1' index.html                                # 1
grep -E '#[0-9a-fA-F]{3,6}' css/custom-styles.css | grep -v ':root'   # only color-mix/print
grep -rn 'manrope\|inter-var\|pt-mono' css/ index.html  # only if intended
```

Also required from the environment: `node --check` output, the 404 list after Phase 1, and
`git diff --stat` per phase.

Performance budget: 0 x 404, 0 console errors, LCP < 2.0s on cable, CLS < 0.05, first view < 900KB.

---

## 9. Cost and benefit

| Action | Net effect |
|---|---|
| Re-skin in place | ~12 markup edits, one stylesheet, one new JS file |
| Remove hex mosaic | -11 hero images on the LCP path |
| Remove legacy trees | ~15MB out of the deployment (299KB CSS, 580KB JS, 248KB SCSS, 4.9MB icon fonts, ~9.4MB unused images/static) |
| 3 static subset woff2 | ~120KB, 0 CDN dependencies |
| No shadows/gradients/transforms/blur | less compositing, no hover layout shift |
| New dependencies | **none** — all assets OFL/CC, no library added |

Three cuts made on review advice: no contact-sheet strip (text index instead), no CSS-counter ranking
(stable numbers instead), no scroll-driven effects beyond the CSS rail.

---

## 10. Unresolved issues

1. **Font files must be obtained.** The three woff2 files are absent; someone with network access must
   download Source Serif 4 (OFL) and IBM Plex Mono (OFL) and subset them. This blocks Phase 1.
2. **Content-loss check.** The rewrite has **20** teaching cards; the pre-redesign site had 22. Diff
   `index.html` against master `ccf5508` before deleting anything.
3. **Correct DOI** for the prompt/agent workshop (duplicated at `1055`/`1066`) — client data needed.
4. **Award credit wording** — "the project received" vs "I was honoured". Pick one; it is an accuracy
   question.
5. **"Read the announcement"** targets the ministry index, not the article linked in the headline.
6. **Filter taxonomy** — "Expert opinion" vs the single "Software review" card. Rename the filter or
   recategorise the card.
7. **Headline copy** — keep the v2 line (default) or commission a finding-aid-appropriate one.
8. **Serif body text** is a taste decision for a technical CV read on screen; sign off after the Phase 4
   prototype.
9. **Page size** 9 vs 12 for the portfolio; 9 fills the 3x3 grid exactly.
10. **Delete vs archive the legacy trees** — deletion is reversible via git, but the Untree CC BY
    attribution must stay in the footer.
11. **Unverified stats** (250+ memorials, 15k+ monthly users, 8 languages) — confirm or soften.
12. **Dark mode** is explicitly out of scope. The night band is the only inversion.

---

## 11. Definition of done

- One design system, zero inline styles, no duplicate component definitions.
- Page works with JS disabled, with `site.js` deleted, and with JS enabled but failing.
- Mobile navigation, filters, load-more, scrollspy and form status all functional; `aria-*` states stay in
  sync.
- Self-hosted fonts, 0 x 404, 0 console errors; LCP < 2.0s, CLS < 0.05.
- Content preserved 1:1 against master (or deliberately edited with sign-off); no duplicate DOIs.
- Responsive at 360/768/1024/1440; keyboard and reduced-motion safe; print sheet readable.
- `AGENTS.md` and `README.md` describe the site as it now is.

---

## Appendix A — Decision log (what review changed)

| Proposal | Verdict | Reason |
|---|---|---|
| Hex mosaic hero | cut | 11 images on the LCP path; derivative of the v2 reference |
| 6-thumbnail contact sheet | cut | extra requests for decoration; a text index does the job |
| Distinctiveness via "warm serif and hairlines" alone | rejected | that is every second editorial site; the ruled spine with call numbers is the device |
| 4 + 1 ink accents | kept, with a collapse fallback | services genuinely has 4 areas; marks are 6px; fallback documented |
| Serif body at 1.0625rem | rejected | too small on 2x displays; 1.125rem |
| Uppercase mono nav/buttons | rejected | reads as a terminal costume; sentence-case mono |
| 2 weights per family, variable font | rejected | payload for one page; 3 static subset files |
| CSS-counter rank on filtered cards | rejected | counters do not skip `[hidden]`; stable identity numbers instead |
| Reveal "fails when JS is absent" | corrected | the real failure is JS present and `site.js` missing; the fix must be mechanism-level |
| Grid + sticky pseudo-element rail | rejected | `grid-row: 1 / -1` collapses without explicit rows; paint the rule on `.section` instead |
| Scrollspy used for call numbers | replaced | CSS handles the rail; no script needed |

## Appendix B — Layer dependency

```
                    ┌──────────────────────────────────────────────┐
   CONTENT (fixed)  │ 21 work · 20 teaching · 4 features · 4 svc   │
                    │ CV · imprint · contact · award               │
                    └───────────────────┬──────────────────────────┘
                                        │ verified in Phase 0
                    ┌───────────────────▼──────────────────────────┐
   TOKENS           │ paper/ink/signal/4 inks · serif+mono · 2px   │
                    │ (single :root block — the colour code)       │
                    └───────────────────┬──────────────────────────┘
        ┌───────────────────────────────┼───────────────────────────┐
        ▼                               ▼                           ▼
   PRIMITIVES                      COMPONENTS                  PATTERNS
   rules, surfaces, links,         btn, chip+swatch,           ruled spine +
   focus, frames, type scale       entry, field, timeline      call numbers,
        │                               │                      plate+label,
        └───────────────┬───────────────┴──────────┬───────────night band
                        ▼                          ▼
                     SECTIONS ───────────────► one page (index.html)
                        │
        ┌───────────────┴────────────────┐
        ▼                                ▼
   js/site.js (fail-safe)          css/custom-styles.css
   nav · spy · filter · load       (only stylesheet loaded)
   · reveal · form · year
```

Nothing lower depends on anything above, which is why Phases 1 and 2 can be committed and verified
independently.
Two notes for when you save it: the file ends at Appendix B, and the doc assumes the three font files must be fetched by someone with network access — that is the only item blocking Phase 1.
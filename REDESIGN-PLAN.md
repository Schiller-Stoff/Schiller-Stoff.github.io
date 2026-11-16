# Redesign plan — "digital craft" editorial

Status: draft for review. Design reference supplied as a screenshot (hero only).
Scope: full redesign of `index.html`, `css/`, `js/` presentation layer. No framework,
no build step, no bundler — static files served from the repo root.

---

## 1. Audit — what exists today

**Structure (~1,916 lines, one page):**

| Section | State |
|---|---|
| Nav | Fixed white bar, all styling inline, no mobile menu (burger commented out) |
| Hero | Marketing headline + Typed.js paragraph + circular portrait with hover swap |
| Services | 3 cards, marketing copy ("Award-winning software solutions") |
| Pricing | Stub with no prices |
| Announcements + Case Studies | Tabbed case studies accidentally nested *inside* `#prices` |
| Portfolio | 21 cards, `.filter-btn` + `#load-more`, plain DOM |
| Teaching | 22 items, legacy Isotope markup, `#teaching-section` is an empty anchor |
| CV | Highlight card + 2-column timeline + percentage skill bars |
| Imprint / Contact | Imprint text; Formspree form |
| Footer | Most widgets commented out; only the Untree copyright remains |

**Technical debt that blocks a clean redesign:**

- `css/style.css` (2,990 lines) has the same components defined twice (`.service-card` at line 1779 **and** 2678), plus interleaved template CSS.
- Markup is unbalanced: **409 `<div>` opens vs 415 closes** (6 stray closers around imprint/contact), and `#case-studies` is nested inside `#prices`.
- Default heading color is `#dddde6` (near-white) — sections only look right where custom CSS overrides it.
- 15 JS files loaded; most unused (Owl, Fancybox, Isotope, ScrollMagic, TweenMax, AOS, Waypoints, circle-progress).
- `jarallax.min.js` exists in `js/` but is not included, while `.jarallax()` is called.
- `css/custom-styles.css` is linked but **missing** (404); `images/dots.png` missing; Typed.js included twice.
- Font Awesome 6.7.2 is loaded from CDN, but CSS references `"Font Awesome 5 Free"` glyphs.
- Montserrat is downloaded from Google Fonts but commented out in the stylesheet; body is PT Mono.
- Isotope/jQuery teaching filtering is dead code (`#filters` absent from the live DOM).
- Mobile CSS hides `.item:nth-child(n+5)` — this fights the portfolio filter logic.

---

## 2. Design reference — extracted system

**Design DNA:** warm off-white canvas, oversized heavy grotesque headline with a two-tone
split (ink navy → purple), calm grey-blue body copy at generous line-height, pill buttons
(one filled navy, one outlined), and a single large organic illustration on the right with a
soft shadow. Huge whitespace, no boxes, no decorative gradients. Everything is quiet except
the headline and the artwork.

### 2.1 Color tokens

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1b2240` | headlines, filled button, nav |
| `--ink-soft` | `#5b6478` | body copy |
| `--ink-muted` | `#8a90a3` | meta, captions |
| `--accent` | `#8b4aa5` | headline highlight, links, focus ring |
| `--accent-soft` | `rgba(139, 74, 165, .10)` | chips, eyebrows |
| `--bg` | `#f1f1f4` | page |
| `--surface` | `#ffffff` | cards, form |
| `--line` | `#dcdce3` | borders |
| `--navy` | `#232c4d` | button fill (slightly lighter than ink) |
| accent set | lime `#a8d33f`, blue `#6aa8e0`, orange `#f0a233`, green `#4f9e4a` | category coding |

The four illustration colors map cleanly onto four capability areas in the Services section —
the one place where the palette should get colorful.

### 2.2 Typography

Reference is a heavy geometric grotesque. Closest free match: **Manrope ExtraBold** (OFL,
self-hostable) for display, **Inter** or **DM Sans** for body. `fonts/` currently contains only
icon fonts (icomoon, flaticon), so two self-hosted families must be added — not loaded from the
Google Fonts CDN. Keep **PT Mono** for eyebrows, dates and tags; it reinforces the
"digital handwork" tone and is already in use.

Fluid type scale (`clamp`):

| Role | Size / line-height / tracking / weight |
|---|---|
| Display `h1` | `clamp(2.6rem, 5vw, 4.3rem)` / 1.03 / `-0.02em` / 800 |
| `h2` | `clamp(1.9rem, 3vw, 2.6rem)` / 1.1 / 800 |
| `h3` | `1.25rem` / 700 |
| Lead | `1.125rem` / 1.7 / `--ink-soft` |
| Body | `1rem` / 1.65 |
| Eyebrow / meta | `.8rem` mono, uppercase, `.12em`, purple |

### 2.3 Components

- `.btn` — pill, 48px min-height, `0 28px` padding, 150ms transition; hover `translateY(-1px)` plus soft shadow. Variants: navy filled / white outlined with `--line`.
- `.card` — white, 1px `--line`, radius 18px, no shadow at rest, hover shadow plus purple border tint.
- `.chip` — pill, accent-soft background, accent text, mono, small.
- `.section-head` — left-aligned eyebrow → h2 → lead, max 60ch. (The reference is left-aligned; the current centered headers are the strongest "template" tell and should go.)
- One focus style everywhere: 2px purple ring, 2px offset.

### 2.4 Layout

1200px container, 24px gutters, 12-column grid, section rhythm
`clamp(72px, 9vw, 128px)`, alternating `--bg` and `--surface` bands.

---

## 3. Hero — building it without copying the artwork

The reference illustration is a commissioned watercolor piece. Do **not** copy the file.
Build an original equivalent from existing material:

- **A honeycomb of the 21 portfolio screenshots**, clipped hexagons (`clip-path: polygon(...)`),
  arranged in 3–4 columns, each tile tinted with one accent color via a
  `mix-blend-mode` overlay, framed by a dark navy hex stroke, with the same soft drop shadow.
- One or two tiles can be the portrait, making the hex a "portrait of the work" motif.
- Pure CSS plus existing images; no new asset pipeline; degrades to a simple hex grid without JS.
- Fallback if it reads as busy: a single large hexagon containing one project screenshot, same treatment.

Hero copy, two-tone like the reference (English, since the site is English):

> **Digital craft from research,**
> **for everyone working with knowledge.**

(accent color on the second clause)

Then 2–3 lines of lead (existing bio), two pill CTAs — "Explore my work" →
`#portfolio-section`, "Get in touch" → `#contact-section` — and the social icons as a quiet row.
**Remove the Typed.js paragraph**: static copy is faster, accessible, and matches the
reference's calm.

---

## 4. Section-by-section mapping

1. **Nav** — transparent over the `--bg` hero, sticky plus blurred `--surface` on scroll, navy wordmark, links in `--ink`, purple-underline active state, pill "Get in touch" on the right, real mobile drawer. Replaces the inline-styled white bar and the floating `#TEST` button.
2. **Services → "What I do"** — 4 cards, each with one accent from the illustration set (top rule or icon tint): research software engineering, digital archives, digital editions / Linked Data, AI & LLM workflows. Left-aligned header, first-person copy.
3. **Case studies** — keep the four projects (DERLA, DH-Book, ZIM-Graphviz, ReInHerit) but drop the tab UI in favour of stacked feature rows (text left, screenshot in a hex or rounded frame right, alternating sides). Mirrors the reference's text/visual rhythm and fixes the `#prices` nesting bug.
4. **Portfolio** — warm `--bg` band, white cards, 4:3 media (source images are ~4:3, so no awkward crops), mono category chips, filter bar as pills (active = navy). Keep filter plus load-more, move to `js/site.js`, delete the `nth-child` mobile hack.
5. **Teaching** — same card component, 3 columns; DOI, year and type chip; Isotope/jQuery removed entirely.
6. **CV** — timeline on a purple 2px rail, mono dates in `--ink-muted`, white entry cards; "Current position" as a navy filled card with white text (single moment of high contrast); replace percentage skill bars with tag groups unless bars are explicitly wanted back.
7. **Announcements** — one full-width navy band: award year, title, link. Compact, no separate section header.
8. **Imprint / Contact** — white surface, form fields 12px radius, purple focus ring, labels above inputs, Formspree kept; contact details in a 2×2 mini-grid with purple icons.
9. **Footer** — light, mono small print, nav plus socials plus imprint link. Keep the CC BY / Untree attribution unless the license is confirmed to allow removal.

---

## 5. Target architecture

Keep the static-file constraint. No bundler, no framework, no build step.

```
index.html                 single page, semantic sections
css/style.css              legacy template CSS — leave but stop adding to it
css/custom-styles.css      ← create; ALL new design lives here (already linked)
js/site.js                 ← new; nav, filters, tabs, reveal, form (vanilla)
js/vendor/…                only libraries actually used
fonts/                     self-hosted Manrope + Inter + existing icon fonts
images/                    existing assets, plus generated WebP variants
```

Rationale: `css/custom-styles.css` is already referenced and 404s. Creating it gives a clean
slate layered *after* Bootstrap and the template CSS, so the redesign does not require
surgically rewriting 3,000 lines. Retire `style.css` rules progressively, then optionally
inline the survivors.

---

## 6. Execution phases

### Phase 0 — Baseline (before touching design)

1. Branch `redesign` (never work on `master`; a push publishes the live site).
2. Serve the repo root and capture: full-page screenshots (desktop/mobile), console errors,
   Network 404s, Lighthouse baseline.
3. Inventory content: every portfolio/teaching title, link, image and CV entry into a
   checklist so nothing is lost.

### Phase 1 — Foundation

1. Add self-hosted Manrope plus Inter to `fonts/` (woff2 plus woff), `font-display: swap`.
2. Create `css/custom-styles.css` with `:root` tokens, reset, type scale, layout primitives,
   buttons, chips, cards, forms, utilities.
3. Verify tokens on a bare test block before touching sections.

### Phase 2 — Structure cleanup (no visual change yet)

1. Delete commented-out duplicate blocks (old `#services-section`, old `#posts`, footer widgets).
2. Fix the 6 stray `</div>`s; un-nest `#case-studies-section` from `#prices`.
3. Canonicalize IDs and anchors:
   - `#services-section`, `#portfolio-section`, `#teaching-section`, `#cv-section`, `#imprint-section`, `#contact-section` stay.
   - Point "Teaching" at the live content (`#teaching-section-real` → rename or make it the actual section).
   - Remove empty `#teaching-section`, `#pricing`, `#prices` unless reused.
4. Remove the floating `#TEST` "Get in touch" button (inline-styled) or promote it to a real component.
5. Replace all inline styles with classes.
6. One `<h1>`; headings descend without skips; `<section aria-labelledby="…">`.

### Phase 3 — Rebuild order

Each section: markup → CSS → interaction.

nav → hero plus hex mosaic → services → case studies → portfolio → teaching → CV →
announcements → contact → footer.

Do the hero first and compare side-by-side with the reference. If the hero's weight, spacing and
button language match, the rest follows the tokens.

### Phase 4 — JavaScript consolidation

- Create `js/site.js`: mobile nav, scrollspy, portfolio filter/load-more, tabs, reveal
  animations, form enhancement.
- Remove unused vendor includes (Owl, Fancybox, Isotope, ScrollMagic, TweenMax, AOS, Waypoints,
  animateNumber, circle-progress) **one at a time**, verifying after each.
- Keep jQuery only if Bootstrap 4 components still need it.
- Vendor Typed.js locally if the typed effect survives at all.

### Phase 5 — Assets and performance

- Generate WebP variants for `images/portfolio` (21), `images/teaching` (17),
  `images/profile` (3), `images/announcement` (2); keep originals.
- Add `loading="lazy"` and `width`/`height` on all images to stop layout shift.
- Self-host fonts with `font-display: swap`.
- Remove dead CSS (the `dots.png` background, duplicated blocks).
- Target: no 404s, no console errors, LCP < 2.5s on cable, CLS < 0.1.

### Phase 6 — Accessibility and SEO

- Keyboard: visible focus on all interactive elements; filter buttons as toggle buttons with `aria-pressed` (not `role="tab"`).
- Contrast audit for the new palette (≥ 4.5:1 for body text).
- Real `alt` text on every image (currently generic `alt="Images"` in teaching).
- Keep the existing meta/schema.org block; add `Person` JSON-LD; remove the duplicate `<title>` tags.
- Verify anchors and add `rel="noopener"` to external links.

### Phase 7 — QA and cutover

- Matrix: 360 / 768 / 1024 / 1440 widths; Chrome, Firefox, Safari; keyboard-only;
  reduced motion; JS disabled (content must remain readable).
- Verify every portfolio filter combination and load-more on mobile.
- Verify Formspree submission.
- Commit on `redesign`, review the diff, then merge and publish deliberately.

---

## 7. Acceptance criteria for "matches the reference"

- Hero: off-white canvas, two-tone 800-weight headline, exactly two pill CTAs, one large
  right-hand visual with soft shadow, no cards, no gradients behind text.
- Body text is grey-blue, line-height ≥ 1.65, measure ≤ 70ch.
- Only three visual weights on the page: background, white surface, navy block. Purple is an
  accent, never a large fill.
- Zero inline styles; every color and space comes from a token.
- No section uses a centered "eyebrow + title + wave SVG" header.

---

## 8. Risks

- **Content loss** during markup cleanup (mitigate with the Phase 0 inventory).
- **Template licensing** — the footer attribution is likely required by CC BY 3.0.
- **Filter/load-more regression** when removing the mobile `nth-child` rules.
- **Isotope removal** — the teaching grid must be reimplemented, not just un-loaded.
- **CDN dependencies** (Google Fonts, Font Awesome) degrade on blocked networks; self-host.
- **Publishing** — a push to `master` is live. Keep `opencode.jsonc` and the API key out of commits.

---

## 9. Definition of done

- One design system, zero inline styles, no duplicate component definitions.
- All sections rebuilt, no commented-out dead markup, balanced HTML.
- One JS entry point, only used libraries loaded.
- No 404s or console errors; responsive at all breakpoints; keyboard and reduced-motion safe.
- Content preserved 1:1 (or deliberately edited, with sign-off).

---

## 10. Open decisions

1. **Language** — site is English, reference is German. Assumed: English, keeping the two-tone headline structure.
2. **Hero visual** — approve the hex mosaic built from the existing project screenshots, or prefer a single portrait/hex tile?
3. **Bootstrap/jQuery** — recommendation: keep the Bootstrap grid for speed, drop jQuery-only plugins. Confirm, or move to vanilla CSS grid.
4. **Copy** — may the agency-style copy ("Award-winning software solutions…") be rewritten in first person, and the Pricing stub deleted?
5. **Skill bars** — keep or replace with tag groups?

---

## Appendix — security note

The DHINFRA API key currently stored in plaintext in `opencode.jsonc` was pasted into a chat
message. Rotate it, add `opencode.jsonc` to `.gitignore`, and never stage it. This document
intentionally does not reproduce the key.

# V12 — "The ways in"

Status: **implemented**. V11 (the commissionable practice) remains structurally
intact; V12 changes one object in the hero and retires the motion that belonged
to it.

---

## 1. Why the graph goes

The V5–V11 hero graph was decorative ink: twelve nodes, fifteen edges, 9 %
opacity, `aria-hidden`, hidden below 901px and in print. It occupied the one
unused field beside the offer and did no work. Nothing on the page had to be
found there, and a low-contrast field is a weak place to put the only thing a
visitor can click besides the two action pills.

V12 puts navigation in that slot. The hero already states what the practice
does; the index says what the page holds and where to start. It is the same
ultramarine as the `h1`, so the accent now marks both the claim and the way
into the evidence.

## 2. The window

One solid `--action` plate with four panes, built as a small index card:

- **Bar** — `.hero__index-bar` is a two-part header: `.hero__index-label`,
  `Index`, on the left and an `aria-hidden` `.hero__index-range`, `01–04`, on
  the right. Both share `--text-2xs`, 600 weight, `--tracking-label` and
  `--on-dark-label` (the range is tabular). The flex row balances the header at
  4-up, where the bar is widest and previously empty on the right. A 1px
  `--on-dark-rule` closes the bar.
- **Sash** — the panes are separated by the grid's 1px `gap`, with
  `--on-dark-rule` as the grid background. The hairlines are layout, not
  borders, so they stay continuous at every width and disappear cleanly in
  forced colours.
- **Pane** — `.hero__index-link` is the whole tile: a flex column with the glyph
  and ordinal at the top, the title and arrow pushed to the bottom by
  `margin-top: auto`, and one factual meta line under it. `min-height: 148px`
  keeps the four panes even, and every meta is short enough to hold one line at
  the narrowest 4-up pane, because a wrapped meta would push its title off the
  shared baseline.
- **Glyph and ordinal** — a white 40px line icon (`#i-stack`, `#i-pin`,
  `#i-cap`, `#i-briefcase`) and a tabular `01`–`04` in the label colour. The
  ordinal is `aria-hidden`; it orders the window visually, not in speech. The
  first Storymaps glyph, a folded-map drawing, was retired after the browser
  pass: at 36–40px its folds and panels read as an open book. `i-pin` reads as
  places at every size and states what DERLA and MEMOR are without a map
  drawing.
- **Meta** — one line of holdings, not marketing: `21 projects`,
  `DERLA · MEMOR`, `Workshops · talks`, `Since 2009`. `21 projects` is the
  register's actual count; the other three name sections and date ranges that
  already exist on the page.

No new token, font size, radius, shadow, gradient or entrance animation was
introduced. Every value comes from the `:root` block.

## 3. The four routes

| # | Pane | Target | Why this one |
|---|------|--------|--------------|
| 01 | Work | `#portfolio-section` | The register is the largest body of evidence; it is not in the header nav. |
| 02 | Storymaps | `storymap.html` | The two data studies are the page's peer exhibits and the only off-page routes in the hero. |
| 03 | Training | `#teaching-section` | Teaching is the third commissionable service and sits deep in the page. |
| 04 | Experience | `#cv-section` | Due diligence for a hiring manager, without repeating the header's `Experience` emphasis. |

The set deliberately does not repeat the header nav's Services · Work ·
Experience or the hero's two actions (Start a project, See the evidence). It
adds the two routes the header never carried — Storymaps and Training — and
keeps Work and Experience reachable from the fold. Page order is not required:
the window is an index, not a table of contents.

## 4. Responsive composition

| Width | Composition |
|-------|-------------|
| 1121+ | Two-column hero: `minmax(0, 1fr) minmax(280px, 340px)`, `clamp(24px, 3vw, 48px)` gap. The window is 2-up in the copy's right column. |
| 641–1120 | One column, full-width 4-up strip under the offer (`margin-top: --space-2xl` at ≤1120, `--space-xl` at ≤900). The ≤1120 rule carries through 641–900. |
| ≤640 | The strip becomes a 2-up window: `min-height: 118px`, `--space-sm` padding, 30px glyphs, `--text-sm` titles, 16px arrows. |
| ≤420 | Bar inset to `--space-sm`; panes `min-height: 112px` with a tighter inline padding. Still 2-up — four stacked panes would push the profile band far down. |

The bands are chosen so a pane is never a drawer. A 2-up grid at 641–900
measured 287–406×148; keeping the 4-up strip gives ≈155–228×148. A 400px-wide,
148px-tall pane reads as an empty drawer; a 155–230px pane reads as a window and
keeps the strip idea the 901–1120 range establishes.

At ≤900 the 4-up strip sets `padding-inline: var(--space-sm)` (12px), giving the
title + arrow row and the metas ~8px of headroom at the bottom of the range.
The desktop column (>1120) and the 901–1120 strip keep the base 16px inline
padding.

The band never collides with the headline or the lead because it is a grid
sibling, not an absolutely positioned layer. Nothing is clipped: the plate is
in flow and the container's gutter does the rest.

## 5. Motion

Hover and focus are the only feedback: the pane deepens to `--action-hover`
(160ms), the arrow advances `--shift-sm` (3px), and the title gains a 1px
underline. There is no transition on the pane's box or transform, so focus and
pointer entry cannot move the layout.

The V8 hero drift is retired with the graph. A solid navigation plate must not
parallax, and the `@supports (animation-timeline: scroll())` block, its
`hero-field-drift` keyframes and the explicit reduced-motion override are
deleted. The `graph-draw` and `graph-node` keyframes stay because the footer
graph still uses them.

Reduced motion removes the background and arrow transitions through the global
duration override; the window itself has no animation to stop. Print hides the
whole index; the printed CV stays a document.

## 6. Accessibility

- `<nav class="hero__index" aria-label="Explore the work">` is a landmark, and
  each pane is one `<a>` containing all of its content — no nested links, no
  click on a non-interactive wrapper.
- The `<ul role="list">` keeps the four routes a list for assistive technology.
  Glyphs, arrows and ordinals are `aria-hidden`.
- Contrast on `--action` (#1a0de0): white title and glyph 9.6:1, meta
  (`--on-dark-muted` #d9d6fb) 6.9:1, label and range (`--on-dark-label`
  #b9b5f4) 5.0:1. All pass AA for their sizes.
- The global ultramarine focus ring would disappear on the plate, so a 2px
  white outline is drawn inside the pane (`outline-offset: -12px`). It is
  visible on every pane and adds no layout.
- Forced colours replace the colour field with `Canvas` and give every pane a
  1px `CanvasText` border; the sash and bar hairlines are removed and all text,
  glyphs and arrows are `CanvasText`. Shape and borders carry the structure.
- The index is never gated by `html.*`, never hidden pending script, and is
  present with JavaScript disabled.

## 7. Implementation record

Files changed:

- `index.html` — added `#i-stack` and `#i-pin` to the sprite; removed the
  `.hero__graph` SVG; added the `nav.hero__index` as the second and last child
  of `.hero__grid`.
- `css/custom-styles.css` — replaced the §7 graph block with the index block;
  added the 1121+ hero grid, the 1120/900/640/420 index rules (including the
  ≤900 `padding-inline: var(--space-sm)` rule); updated forced colours, motion
  and print; changed the token comment and the stylesheet index/breakpoint
  notes.
- `js/site.js` — `initArrival()`'s `scopeOf()` now treats `.hero__index` like
  `.nav`, `.footer-nav` and `.hero__actions`, so a fragment pane acknowledges
  arrival. `storymap.html` is a plain page navigation and is ignored.
- `AGENTS.md` — V12 intro, hero-index bullet, retired-depth bullet, V11 hero
  geometry correction, forced-colour/print notes and invariants.
- `redesignv12.md` — this record.

Class list:

```
.hero__index
.hero__index-bar
.hero__index-label
.hero__index-range
.hero__index-grid
.hero__index-link
.hero__index-top
.hero__index-glyph
.hero__index-num
.hero__index-head
.hero__index-title
.hero__index-arrow
.hero__index-meta
```

Tokens reused: `--action`, `--action-hover`, `--on-dark`,
`--on-dark-muted`, `--on-dark-label`, `--on-dark-rule`, `--text-2xs`,
`--text-xs`, `--text-sm`, `--text-base`, `--leading-dense`,
`--leading-title`, `--leading-body`, `--tracking-label`, `--tracking-title`,
`--space-2xs`, `--space-xs`, `--space-sm`, `--space-md`, `--space-xl`,
`--space-2xl`, `--rule-hair`, `--rule-accent`, `--dur-fast`,
`--ease-standard`, `--shift-sm`.

Deleted:

- `.hero__graph`, `.hero__graph-edges`, `.hero__graph-nodes`,
  `.hero__graph-hub` and the hero graph SVG;
- the 901–1120 narrowing (`width: min(50%, 520px); right: -12%`) and the 900px
  `display: none`;
- the hero-graph rules in the `no-preference` motion block (the eyebrow
  `mark-in` rule stays);
- the whole scroll-timeline drift block and `hero-field-drift`;
- `.hero__graph` from the reduced-motion `animation: none` list and from the
  forced-colours `display: none` list;
- `.hero__graph` from the print hidden list, replaced by `.hero__index`.

`graph-draw` and `graph-node` remain for the footer graph. No other section,
page or script changed.

## 8. Review log

Browser pass: **passed** (Chromium, real page; JS enabled unless stated).

- [x] 1440 / 1280 / 1121: two-column hero, index 340px wide, panes 169×148,
  copy keeps 720px, no overflow (`scrollWidth == clientWidth`).
- [x] Final responsive values: 1120 ≈228×148, 1000 ≈228×148, 900 ≈211×148,
  700 ≈164×148, 641 ≈155×148, 640 ≈290×118, 390 ≈155×118, 360 ≈150×112.
  No clipping, no sideways scroll; `Workshops · talks` and `DERLA · MEMOR`
  stay on one line, and the title+arrow row never overlaps the meta.
- [x] Keyboard: panes in DOM order after the hero actions, white 2px inset focus
  ring, pane deepens, arrow advances 3px, title underlines, no layout shift.
- [x] Accessible names: "Work 21 projects", "Storymaps DERLA · MEMOR",
  "Training Workshops · talks", "Experience Since 2009" under navigation
  "Explore the work".
- [x] Click on Experience fires `.is-arrived` on `#cv-section` once
  (`prefers-reduced-motion: no-preference`); with reduce the rule correctly does
  not fire.
- [x] Forced colours: Canvas panes with CanvasText borders, all text and glyphs
  visible. Print: index absent (selector-verified).
- [x] Contrast: pane ink 9.6:1, meta 6.9:1, label/range 5.0:1.

Revision after the pass: the folded-map glyph was replaced by `i-pin` (it read
as a book), panes grew to 148px with a 40px glyph, the bar gained its `01–04`
range to balance 4-up, forced colours pin glyph and arrow to `CanvasText`, and
the 641–900 range keeps the 4-up strip so a pane is never a 400×148 drawer. At
the bottom of that strip the Training meta became `Workshops · talks` and the
pane inline padding dropped to `--space-sm`, so all four titles share one
baseline and all four metas hold one line.

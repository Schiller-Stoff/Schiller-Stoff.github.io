# V13 — "Depth at the fold"

Status: **implemented on `redesign`, uncommitted**. V12's structure, copy and
index window are unchanged. V13 adds one decorative layer behind the hero and
two small interaction details; no reading matter, control or navigation moves.

---

## 1. Why a background at all

The V7–V12 hero was a white sheet: a serif claim on the left, a solid
ultramarine index on the right, and nothing else. That emptiness was the
design. It also meant the top of the page had no depth at all once the V8
graph (and its 48px drift) was retired with V12.

V13 treats the fold as a **printed sheet** rather than a coloured hero. The
field is made of the same things as the rest of the page — hairlines, a 96px
module, the one ultramarine, tabular registration — and sits at 7–30 % ink.
It is decorative from the first line of CSS: `aria-hidden`, `pointer-events:
none`, no content, no control and no script gate. The reading layer is the
same as before.

## 2. The three layers

| Layer | Geometry | Ink | Role |
|-------|----------|-----|------|
| `.hero__scene-grid` | 96×96px SVG pattern, 1px lines, full bleed | 7 % | the ledger field |
| `.hero__scene-sheet` | 460×515px ghost card, 1px border, right of centre | 16 % | depth behind the index |
| `.hero__scene-mark` ×2 | 13px registration crosses | 30 % | the sheet's crop marks |

The grid is an inline SVG pattern, not a background image, so the
`background-image` invariant in AGENTS.md still holds. The sheet repeats the
index's proportions but is deliberately offset: 24px past the content edge on
the right and roughly 96px into the gap on the left, so it frames the plate
instead of duplicating it. The marks sit on the content box (top-left and
bottom-right), not on the sheet's corners.

The field uses only existing tokens: `--action`, `--container`, `--gutter`,
`--header-h`, `--space-lg`, `--rule-hair`. No new type size, radius, shadow,
gradient or colour was added.

## 3. Motion

Two pieces, both decorative:

- **Scroll depth.** Inside `@supports (animation-timeline: scroll())` and
  `prefers-reduced-motion: no-preference`, the grid lags 64px, the sheet 48px
  and the marks 16px across `animation-range: 0 90vh`. The copy, actions and
  index are not in the block and never move. The effect is compositor-only
  `translate3d`; it needs no JavaScript and no scroll listener.
- **Arrival.** `.hero__scene` fades from 0 over `--dur-scene` (800ms) on load.
  It is ink, not content: the hero copy paints immediately.

Under `prefers-reduced-motion: reduce` the scene is complete and still. The
scroll timelines are stopped explicitly in the reduced-motion block, because
the global duration override does not cancel a scroll timeline.

There is still no parallax on reading matter, no page-wide reveal, no
count-up metric and no perpetual animation. The effect is the V8 precedent on
a new layer: ink moves, content does not.

## 4. Index light

Each `.hero__index-link` now has an `::after` wash: a 180px radial white at
16 %, opacity 0 until hover or `:focus-visible`. On a fine pointer,
`initIndexLight()` updates `--spot-x` / `--spot-y` from one delegated,
rAF-throttled `pointermove` listener on `.hero__index`; touch, reduced motion
and a failed module leave the wash centred or invisible. The pane itself stays
solid, focus rings and contrast are unchanged, and the overlay is forced out
in forced-colours mode.

## 5. Filter underline

The register's active filter underline now exists on every `.filter-btn` at
`scaleX(0)` and grows from the left when `aria-pressed="true"`. The old
instant rule is gone. Weight and the 2px line still carry the state in forced
colours, and the underline is a `--rule-accent` line, not a new value.

## 6. Responsive

| Width | Field |
|-------|-------|
| 1121+ | grid, ghost sheet and marks |
| 1120 | the index leaves the right column, so the sheet is hidden; grid and marks stay |
| ≤900 | same; marks move with `--header-h` 64px |
| ≤640 / ≤420 | same; the 96px module is not changed |

No breakpoint was added. The sheet is never clipped: it sits inside the hero
and moves 48px at most within a 96px overflow margin.

## 7. Accessibility, forced colours, print

- The scene is `aria-hidden="true"` and `pointer-events: none`; nothing in it
  is focusable.
- The index remains navigation: the light is additive, the pane still deepens
  to `--action-hover`, the arrow still shifts, and the white focus ring is
  untouched.
- Forced colours hides `.hero__scene` entirely (with the footer graph and the
  progress rules) and removes the index wash. The index keeps CanvasText
  borders and text.
- Print hides `.hero__scene` with the other screen-only blocks; the printed
  CV is unchanged.
- The grid is 7 % ultramarine on white and carries no information, so it
  needs no contrast audit.

## 8. Verification

```bash
grep -c 'class="hero__scene' index.html                      # 5 (container, grid, sheet, 2 marks)
grep -c 'id="hero-scene-grid"' index.html                    # 1
grep -c '@supports (animation-timeline: scroll' css/custom-styles.css  # 3
grep -n 'background-image' css/custom-styles.css             # no output
grep -c 'new window.IntersectionObserver' js/site.js         # 2 (unchanged)
grep -nE 'addEventListener\("scroll"' js/site.js             # 2 (unchanged)
gjs js/site.js                                                # stops at "document is not defined"
```

Browser pass: at 1440 the sheet frames the index with 24px on the right; at
1120 the sheet is gone and the grid stops at the index strip; at 390 the field
is still legible behind the lead. With reduced motion emulated, every scene
transform is `none` and the scene is visible at full opacity. In forced
colours the scene is `display: none`. No console errors.

## 9. What did not change

The hero copy, the two actions, the engagement line, the index's four routes
and metas, the profile band, the section list, the tokens, the fonts and every
breakpoint. The storymap pages load no script and were left untouched.

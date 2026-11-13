# V9 — The page shows its data

Status: **implemented**, 13 November 2026, uncommitted in the working tree. The
storymap is promoted from a late text band to a feature plate directly after the
credibility strip, carrying the real inline map. V8's bridge band is removed. V8
remains the motion and depth record; this file records the placement, the plate
and the data work.

## 1. The problem

V8 shipped `storymap.html` — a four-chapter, zero-JavaScript data study of
DERLA's 4,393 documented places of remembrance — and linked it from a white
`section.bridge` between the project register and knowledge transfer. The band
was correct in grammar but weak in position: it arrived after eleven screens of
portfolio, said "The memory landscape", and asked for a click. The owner's
verdict was that the storymap is the strongest single artefact on the site and
was easy to scroll past.

The diagnosis is not that the band was ugly. It is that the band was **a promise
of an object** where the page could show the object. A CV aimed at research
directors, programme managers and cultural-heritage institutions is read
sceptically; the fastest way to earn the next scroll is to put evidence in the
reading path, not a link to evidence.

## 2. The decision

Four placements were considered:

| Option | Strength | Why not |
|---|---|---|
| Fourth selected outcome in `#case-studies-section` | Uses an existing slot | Outcomes are three editorial narratives with 900px media; a fourth card would bury the map under an outcome's image grammar, change the section's rhythm, and reduce the map to a thumbnail. |
| Feature plate after the credibility strip | Shows the object high on the page, before the reading | **Chosen.** |
| Hero-adjacent tile | Maximum visibility | The hero is the personal claim (name, role, typed line, portrait). A national data map there hijacks the first screen and competes with the portrait. |
| Header or footer nav entry | Persistent | The CV nav is three links and the header is a single-page contract. A fourth link to a second page weakens that, and neither nav is where a reader decides to trust the page. |

**Chosen move:** a paper feature plate immediately after `.proof-strip` and
before `#case-studies-section`, and delete the bridge band entirely.

The editorial logic is the credibility strip itself. Its second cell already says
*Austrian State Prize 2024 · History Sciences · DERLA* and its third says
*21 projects · 20 teaching resources*. The reader has just been told what the
work is; the very next thing they see is DERLA's own data, drawn by the person
who built the platform. The selected outcomes that follow are prose-heavy case
studies; the plate is the visual proof that precedes them.

One small secondary entry point was added: a "Read the storymap" `.text-link` in
the DERLA outcome's action row, for a reader who arrives at the outcome from a
deep link or a search result and never passes the plate.

## 3. The plate

```
section.storymap-feature#storymap-feature          paper ground, 2px accent top rule
  div.container.storymap-feature__grid             0.44 / 0.56, gap clamp(32px, 5vw, 72px)
    div.storymap-feature__copy
      p.label.storymap-feature__kicker             "Storymap · DERLA" in --action
      h2.storymap-feature__title                   serif, --display-2, --action
      p.storymap-feature__standfirst               --text-lg, --ink-soft, 48ch
      ul.storymap-feature__stats                   3 equal columns, hairline separators
        li.storymap-feature__stat × 3              value (--display-4, tabular) + .label
      p.storymap-feature__actions                  one outline pill → storymap.html
    figure.storymap-plate
      div.storymap-plate__frame                    1px --rule on --canvas
        p.storymap-plate__bar                      HTML legend: dot + square + counts
        [inline SVG map]                           map:begin / map:end
      figcaption.storymap-plate__caption            source, licence, dated count
```

- **Ground:** `--surface-paper`, one 2px `--action` top rule. No bottom rule: the
  return to white is the section boundary. No circles, no second colour, no
  shadow. It stays a paper plate, not a blue field — the footer keeps the page's
  only full-bleed colour.
- **Type:** the `h2` is serif; the serif budget stays at eight rules because the
  bridge `h2` was retired in the same change. The three counts are sans and
  tabular; the standfirst is `--text-lg`, not display.
- **Counts:** 4,393 records · 232 sites of terror · 2,765 dated since 2000. They
  are raw counts, not a percentage: "71 %" would have needed an explicit
  denominator ("of dated records") to avoid being read as 71 % of all 4,393. The
  71 % figure stays in the storymap's chapter 03, where the sentence has room.
- **Actions:** one outline pill, "Open the storymap". The plate is the primary
  entry point; the outcome text link is the secondary one.
- **No `.section-head`:** the plate is not one of the eight headered sections, so
  the count stays eight. `initArrival` does not fire for it; it is not in the
  nav, and it needs no arrival draw.
- **Breakpoints:** 0.44/0.56 above 1120px; equal halves at ≤1120px with
  `--space-xl` gap; one column at ≤900px, where the map takes the full content
  width; the stats tighten at ≤420px. Measured heights: 590px at 1440, 509 at
  1000, 993 at 900 (stacked, 811px map), 855 at 640, 811 at 390.

## 4. Why the map is inline SVG

The map is content, so it is the real artefact, not a screenshot:

- **The page can re-ink it by CSS.** The storymap's `map__outline`, `map__dots`
  and `map__terror` rules are shared (deliberately not `sm-`-scoped), so one
  `@media (forced-colors: active)` block turns both instances to `CanvasText` and
  keeps the dot/square distinction; the storymap's own print block re-inks the
  printed map black. A WebP would need a second, pre-darkened asset and would
  still be painted as-is in forced-colours mode.
- **No second asset, no request, no srcset.** One committed SVG fragment is
  spliced into both pages by one generator run; there is no image to keep in sync
  and no layout shift while it loads.
- **The legend is HTML.** The dot/square keys and their counts live in
  `.storymap-plate__bar`, not in the SVG. They survive translation, zoom and
  forced colours, and they are real text for assistive technology.
- **The SVG keeps its own accessibility.** `<title>` and `<desc>` are present on
  both instances; the plate's `<figure>`/`<figcaption>` add the source and
  licence.

The alternative — an offline WebP crop — was rejected because it would need a
second asset for the storymap's printed report and a forced-colours variant, for
a picture that is already vector and already committed.

## 5. No motion on the plate

Nothing on the feature plate animates. No draw, no fade, no count-up, no
scroll-linked crop, no hover on the map. Three reasons:

1. The map is reading matter with a body count. Animating memorial records is the
   one thing `storymap-draft.md` rules out; a draw-in would make them decoration.
2. There is no content-reveal system on this site. A new component that waits for
   an `IntersectionObserver` would be the first exception, and exceptions
   accumulate.
3. The plate is above the fold on a laptop after one scroll; a reveal would
   mostly be missed, and a count-up would delay the only numbers on the page.

The plate therefore has no `html.motion-ready` or `html.*` gate, no observer, and
no animation. It is complete with JavaScript disabled, and under
`prefers-reduced-motion: reduce` it is unchanged — not because it was exempted,
but because there is nothing to stop.

## 6. The data work

**Dedupe.** The generator rounded every projected position to whole viewBox
units and emits each rounded position once. At the storymap's 720×380 viewBox
that is 4,393 records → **1,545 positions** (1,458 memorial dot positions + 87
square positions). The picture is pixel-identical: the same paint lands in the
same place; only redundant zero-length subpaths are dropped. Order is preserved
(markers, then terror). The map shrank from ~47KB to 18,549 bytes. All prose
counts remain record counts; the `<desc>` now says "4,393 records … Records at
the same position overlap at this scale."

**One generator, two pages.** `--splice` is now repeatable and the regex is
marker-indent-aware, so the fragment is indented to its host. One run:

```bash
python3 tools/storymap/build_map.py \
  --map-html /tmp/opencode/map.html \
  --natural-earth /tmp/opencode/ne0.geojson \
  --splice storymap.html --splice index.html
```

prints `4399 extracted / 4393 usable / 232 terror / 4161 markers / 1545 dot
positions / 3877 dated` and splices both files. A second run is idempotent. The
two `map:begin` / `map:end` blocks are byte-identical apart from indentation,
which the Verify diff strips.

**Ink in CSS pixels.** The plate renders the same viewBox at 348–811px, so the
storymap's viewBox-unit weights would be 0.63px dots at 390 and 1.46px at 900.
The plate therefore sets `vector-effect: non-scaling-stroke` on its outline,
dots and terror path, and pins 1px / 1.5px / 2.6px. The storymap's own weights
(1.3 units / 2.4 units, 0.6 / 0.85 opacity) are untouched.

## 7. Fallbacks and invariants

| Context | Behaviour |
|---|---|
| No JavaScript | Complete: HTML legend, inline map, counts, pill. Nothing is hidden pending a script. |
| `prefers-reduced-motion: reduce` | Unchanged; nothing animates. |
| Forced colours | Paper ground becomes `Canvas`, the 2px accent rule and all hairlines become `CanvasText`, swatches become `CanvasText`, the map re-inks to `CanvasText` at full opacity (the plate's 0.7 marker opacity is forced to 1), squares keep `stroke-linecap: square`. |
| Print | The whole `#storymap-feature` is hidden. The printed CV stays a concise CV; the storymap is a screen artefact and prints as a report on its own page. |
| ≤1120px | Copy and plate become equal halves. |
| ≤900px | One column; the map takes the content width; the plate's CSS-pixel ink keeps it from getting heavy. |
| ≤420px | Stat padding tightens; the values step down to `--text-xl`. |
| Counts | 21 project cards, 20 teaching links, one `h1`, eight `.section-head`s, eight serif rules, ids unchanged, no new nav item. |
| `js/site.js` | Untouched: two `IntersectionObserver`s, two scroll listeners, no new scroll math. |

## 8. Cost

| File | Change | Weight |
|---|---|---|
| `index.html` | plate markup + second inline map; DERLA outcome text link; bridge removed | +18.5KB map, −1.5KB band |
| `storymap.html` | deduped map; back links point at `index.html#storymap-feature` | −28KB raw |
| `css/custom-styles.css` | §8 plate block (~190 lines incl. its two media queries); §19 shared-artefact comment; forced-colours and print rules; bridge block deleted (~90 lines) | net ~+100 lines |
| `tools/storymap/build_map.py` | dedupe, repeatable `--splice`, indent-aware splice, `<desc>` wording | ~25 lines |
| `js/site.js` | none | 0 |

Final weights: `index.html` 113KB raw / 23KB gzip; `storymap.html` 39KB raw /
11.8KB gzip. No new token, font, image, dependency or script.

## 9. Verification

- Deleted layers: no `.bridge` selector, markup or forced-colours entry remains.
- Identity: the two map blocks diff clean after stripping indentation; both are
  18,549 bytes; `map__dots` and `map__terror` are one path each per page.
- Layout: 1440 / 1000 / 900 / 640 / 390 with `scrollWidth == clientWidth`; plate
  map 576 / 435 / 811 / 572 / 348px wide; no clipping; the 2px rule sits directly
  under the credibility strip's 1px rule.
- Ink: computed `vector-effect: non-scaling-stroke`, 1.5px dots at every width;
  forced colours report black dots and squares, square caps, opacity 1, and zero
  animations on the plate subtree.
- Structure: ids unique and all fragments resolve on both pages; HTML tags
  balanced; no console messages; counts 21/20/1/8; serif rules 8.
- Not testable over MCP (manual): true print-media emulation and loading with
  JavaScript disabled. Both are documented in `AGENTS.md` as manual checks; the
  plate has no JS and is print-hidden, so the risk is low but unverified.

## 10. What was not done

- **No crop of Austria.** The full national outline is the argument: Vienna and
  the eastern edge are dense, the western Alps are sparse. A crop would remove
  the comparison that makes the distribution legible.
- **No raster fallback.** See §4.
- **No motion.** See §5.
- **No fourth outcome, no hero tile, no extra nav item.** See §2.
- **No hover, tooltip or per-point link on the CV map.** The plate is a plate;
  turning memorial records into a hover toy is ruled out in `storymap-draft.md`.
- **No shrinking of the standfirst.** It is the only place on the CV that says
  what the map counts; the three numbers alone would be a metric wall.

## 11. Left as-is / open

- The plate's third count is 2,765 (dated since 2000) rather than 71 %; the
  percentage lives in the storymap. If the owner prefers the ratio on the CV, the
  label must carry the denominator, and it will wrap to three lines at 390px.
- Print drops the plate. Keeping it would add a full map to the printed CV and
  break the "concise CV" promise; revisit only if the CV is ever printed as a
  portfolio rather than a CV.
- The storymap's "Back to the CV" points at `index.html#storymap-feature`, not
  the outcomes. A reader returning from the study lands on its exhibit, not on a
  case study about it.

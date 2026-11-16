# V18 — "The memory globe"

Status: **implemented on `redesign`, uncommitted** (16 Nov 2026). V17 is
untouched. V18 adds no CV section, no token, no colour, no font and no image.
It adds one standalone page (`globe.html`), one generated German twin
(`de/globe.html`), one script (`js/globe.js`), one eager data file
(`data/globe/derla-globe.js`), one offline generator
(`tools/globe/build_globe.py`) and one entry link each in `index.html`,
`storymap.html` and `memor.html`.

Content and data source: `data/globe/README.md` is the data, licence and count
record. This file is the design and verification record.

---

## 1. The thesis

> The storymap counts the landscape. The globe lets you turn it.

V8–V17 established the DERLA evidence in three registers: a CV plate, a static
storymap and a city-scale MEMOR study. All three are read at one range. The
globe adds the missing register — **range itself** — without changing the
dataset, the palette or the shell. The nine states are the index; the records
are the detail; the sheet is the single record.

It is deliberately not a second dashboard. There is no new metric, no new
photograph and no second dataset. Every number on the page already exists in
the extract, and every count prints.

---

## 2. The one decision: no fake depth

An orthographic globe centred on Austria at working zoom does not read as a
sphere. Austria spans 7.63° of longitude — about 5.14° of great circle at
47.6° N. Fitting it into 74 % of a 752 px frame puts the limb roughly 6,200 px
away, so the limb is never in frame. Over that span a parallel bows by about
six pixels and a meridian tilts by about 2.6°.

Therefore:

- **No fake depth.** No shading gradient, atmospheric rim, starfield or
  extruded states. Nothing is exaggerated to make the object look rounder,
  because exaggerated curvature would falsify the distances the map exists to
  show.
- **Curvature is drawn, not implied.** A true 1° graticule of bowed parallels
  and converging meridians carries it at 7 % ink — the same idea as the V13
  ledger grid, but cartographically true.
- **The sphere is proved on demand.** One `Whole globe` control flies the
  camera out to a 0.42 R hemisphere, where the limb, coastlines and 15°
  graticule make the object unmistakable. It is the page's only large motion
  and it is user-invoked.

The method chapter states this in public. A page that claims a globe and shows
a map must state the projection rather than let the reader assume it.

---

## 3. The page contract

`globe.html` uses the shared `sm-*` shell, fonts, tokens, stylesheet and print
rules. Sections, in order:

| # | id | Head | Object |
|---|---|---|---|
| — | `#top` | Hero | kicker, `h1`, standfirst, meta |
| 01 | `#globe` | Austria, 4,393 records | stage plate: bar · canvas/fallback · record sheet |
| 02 | `#states` | The nine states | nine-row state table |
| 03 | `#records` | The records | filters · search · count · list · append |
| 04 | `#method` | What the globe cannot show | prose, limits, projection, links |
| 05 | `#colophon` | Colophon | ten-row `dl.sm-meta`, back button |

Above them: `.sm-head` (note `Atlas` / `DERLA`, four nav links, EN | DE switch)
and a sticky `.sm-rail` with the five chapters. Below: `.sm-foot`.

**One structural departure, page-wide:** every section uses a full-measure head
— `p.label`, serif `h2`, 62 ch lede, then the object — instead of
`.sm-chapter__grid`'s 88 px numeral column. Every object here is an instrument,
and the numeral column would cost the stage 152 px of a 1,104 px measure.

The page loads **two scripts and no other dependency**:

```html
<script src="data/globe/derla-globe.js" defer></script>
<script src="js/globe.js" defer></script>
```

`js/site.js` is never loaded. The data file assigns `window.DERLA_GLOBE`; there
is no `fetch`, no tile, no third-party request. The canvas is Canvas 2D —
WebGL was considered and rejected because no lighting model is needed.

---

## 4. The instrument

- **Camera.** Orthographic, centred 47.65° N 14.15° E, north-up. Austria fits
  74 % of the frame width and 88 % of its height; a state flies to 72 % of its
  own bounding box. Zoom is clamped to **0.5×–30× Austria's radius**. There is
  no wheel, no pinch, no inertia and no auto-rotation.
- **States.** Nine real buttons. Hover and focus share one treatment, and the
  matching table row takes the same fill without stealing focus. Selecting a
  state flies the camera, dims the rest of the country, opens a state summary
  in the sheet and scopes the record list.
- **Points.** Memorial markers are round; sites of terror are square. Records
  that share a position are drawn once and counted. A point opens the record
  in the sheet; there are no per-dot tooltips and no per-point hover toys.
  Turning the globe does not recover what the scale has merged; selecting a
  state does.
- **The sheet.** One docked panel with five facts — Type, Layer, Address, Date,
  Access — plus the near list (“3 more records at this position”) and one
  outbound DERLA link where the extract carries a pid. A state selection fills
  the same panel with its count, share and sites of terror. **The close button
  is labelled “Close the panel”, not “Close the record”**, because it closes
  both.
- **The records.** Filters (All records · Memorial markers · Sites of terror),
  one search field, a live count and a 120-row page. The first page is 120
  rows; the append control adds **120 more** at a time. The whole list is
  4,393 rows; it is never revealed on scroll.
- **The table.** Nine rows in AT-1…AT-9 order, each with records, share and
  sites of terror. It is the no-JS index and the keyboard mirror of the globe.

No count-up, no perpetual animation, no scroll reveal. The rail's 2 px reading
progress is the shared `@supports` scroll-timeline rule.

---

## 5. Data and generator

`tools/globe/build_globe.py` builds one eager file and three static artefacts:

- `data/globe/derla-globe.js` — **593,038 bytes raw / 150,443 bytes gzip**.
  4,393 points, 4,210 distinct 4-decimal positions, 9 state outlines, 242 world
  countries. Parallel arrays and string tables keep titles and addresses from
  becoming one verbose object per record.
- `data/globe/globe-fallback.svg` — 720 × 380 orthographic fallback at the
  Austria pose, **32,456 bytes raw**.
- `data/globe/globe-locator.svg` — 96 × 96 locator, **5,467 bytes raw**.
- `data/globe/state-rows.html` — nine static `<tr>` rows, **1,080 bytes**.

Derived counts used on the page:

- 4,393 records; 4,161 memorial markers; 232 sites of terror.
- 4,210 distinct positions; 3,877 records carry a year; 377 carry no pid;
  6 carry no address; 4 lie outside Austria.
- State counts: 230 · 188 · 977 · 113 · 549 · 376 · 233 · 203 · 1,520.
- Sites of terror: 1 · 8 · 40 · 112 · 21 · 20 · 6 · 7 · 17.
- Shares: 5.2 · 4.3 · 22.2 · 2.6 · 12.5 · 8.6 · 5.3 · 4.6 · 34.6 %; the nine
  sum to 99.9 % because four records keep no state.

The fallback map, locator and state rows are generated into `data/globe/` and
compared byte for byte by `--check`. The two pages carry committed inline
copies with page-language `<title>` and `<desc>`: the geometry is identical to
the generated artefacts, and the German copy is produced by the i18n build.
When the data changes, replace the inline blocks with the regenerated
artefacts and rerun the German build. The generator is run by hand; its output
is committed. Nothing runs at page load.

Sources and licences are in `data/globe/README.md`: DERLA CC BY-NC 4.0,
Natural Earth public domain. Record titles and addresses are DERLA's, verbatim;
German values keep `lang="de"` and are never translated.

---

## 6. Print, forced colours, reduced motion and no-JS

**Print** is a report, like the storymaps. It keeps the fallback SVG, the
legend (dots and squares print black), the nine-state table, the method chapter
and the colophon. If a sheet is open, it prints once as a bordered block with
`break-inside: avoid`, no focus outline and 8 pt × 10 pt padding. The canvas,
bar controls, hint, tip, pin, filters, search, count, list, append control and
close button are removed. A print-only sentence replaces the screen-only list
in chapter 03, so the chapter is not left empty: *the list is a screen
instrument; the state counts and the selected sheet carry the evidence*. The
standalone footer and masthead chrome are removed by the shared shell rules.

**Forced colours** keep the canvas (it is the interactive object) but repaint
it monochrome. `js/globe.js` probes `getComputedStyle` for `Canvas` and
`CanvasText` and re-runs on the `forced-colors` media change; the result is
strictly grayscale. The fallback keeps dot versus square at full ink; the
selected state uses a 2 px `CanvasText` border against 1 px for the others.
Shape, not colour, carries every distinction.

**Reduced motion** removes the mount fade, camera flights, smooth scroll and
the rail progress. A state change jumps in 0 ms; the whole-globe control snaps.
Every resting state is complete.

**No JavaScript** is a complete page. The inline fallback fills the stage, the
nine-state table is static, the method and colophon are prose, and the record
list, filters, count and append control stay hidden. The caption carries a
`<noscript>` sentence pointing at DERLA's own map. The canvas is never shown
without a first frame.

---

## 7. Accessibility

The canvas is a `role="img"` with a factual `aria-label`; it is not focusable
and has no keyboard handler. Every interaction has an HTML mirror: nine state
buttons, one search field, three filter buttons, row buttons, zoom buttons,
the whole-globe pill and a close button. That is the keyboard path, and it is
the same path a screen reader takes.

`aria-live="polite"` on one visually hidden status node announces state and
record selection. The sheet is `tabindex="-1"`; keyboard activation moves focus
to it and `Esc` returns focus to the owner. Pointer activation never steals
focus. Focus order follows DOM order, is never trapped and never moves on
scroll. List rows carry `aria-describedby` pointing at their meta line.

The sheet close control is “Close the panel” / “Bereich schließen” in both
languages, because the panel carries either a record or a state summary.

---

## 8. The German twin

`de/globe.html` is generated by `tools/i18n/build_i18n.py`; it is never edited
by hand. `PAGES` includes the globe and `ASSET_PREFIXES` includes `data/`, so
the two script paths and the inline data hooks resolve `../`-prefixed.

The page contributes **170 strings** to the catalog, of which 169 were already
in the German vocabulary and one is new: the print-only record-list sentence.
Its German value reads:

> Die Eintragsliste ist ein Bildschirminstrument: alle 4.393 Einträge, jeweils
> 120, mit Suche und Filtern. Auf Papier tragen die Zahlen der neun Bundesländer
> und die Detailanzeige des ausgewählten Eintrags die Belege.

Terminology follows the existing German tree: *Tatorte*, *Gedenkzeichen*,
*Einträge*, *Bundesländer*, *Kategorie*, *Kolophon*, *Detailanzeige*,
*Der Globus der Erinnerung*. One catalogue choice is deliberate: the English
kicker **“DERLA record”** is unique to this page, because the shared key
“Record” belongs to the AI-agent step and means “Protokoll”. The globe sheet
therefore gets “DERLA-Eintrag”.

`--check` reports `problems 0`; the German page loads only
`../js/globe.js`, like its English peer, and the other German standalone pages
remain script-free.

---

## 9. Entry links

One route in from each existing DERLA surface, and no route back into the CV
except the shared masthead and footer:

- `index.html` — the DERLA feature plate's button row gains “Turn the globe”,
  and the plate note names the globe as the third range.
- `storymap.html` — masthead nav and the `#ch-04` closing links.
- `memor.html` — masthead nav.
- Every German twin links `globe.html` (generated).

---

## 10. Performance

The renderer is one rAF loop only while dragging or flying; idle is a single
painted frame. Every dot batch is one `Path2D` fill or stroke.

- Device pixel ratio is `min(dpr, 2)`, `1.5` during a gesture, and capped at a
  **2.8 MP** backing store.
- If three consecutive drag frames exceed 24 ms, the renderer drops to DPR 1
  for the rest of the session.
- No `scroll` listener, no `wheel`, no inertia, no auto-rotation.
- Measured at 1440 × 900 on a software-rendered Chrome, with the world layer
  drawing all 321 rings: **DPR 1 median 3.5 ms, p95 4.4 ms, max 6.4 ms; DPR 2
  median 3.0 ms, p95 5.2 ms, max 12.0 ms**. Target was ≤ 6 ms median and
  ≤ 12 ms p95.

Payload: `globe.html` **20.1 KB gzip**; `js/globe.js` **13.2 KB gzip / 49.1 KB
raw**; `de/globe.html` **20.5 KB gzip**. The data file is the page's one large
asset and is deliberately eager, because the fallback and the record list must
be complete without a fetch waterfall.

---

## 11. Verification record

- **Widths.** 1440 / 1120 / 1000 / 901 / 900 / 640 / 420 / 390 / 360: no
  horizontal scroll, stage heights and control wrapping correct, masthead
  edges held, German nav fits with the globe link. The sheet is docked beside
  the stage at ≥ 1121 px and stacks under it below.
- **Interaction.** All nine state buttons; Vienna state summary
  **1,520 records · 34.6 % of the country · 17 sites of terror**; record facts;
  search; terror filter **232 / 232** (17 in Vienna); append from 120 to 240;
  whole-globe toggles and disables zoom; the near list reports “3 more records
  at this position”.
- **Keyboard.** State activation → sheet focus; `Esc` → the state button;
  record activation → sheet focus; `Esc` → the row button. A record opened from
  the sheet's near list loses that button when the list is rebuilt, so `Esc`
  lands on the search field instead of nowhere. `Esc` inside the search field
  clears the query and leaves the sheet open.
- **Forced colours.** Runtime toggle repaints the canvas; output is strictly
  grayscale (256 gray colours, no accent); fallback hidden; probe resolves to
  CanvasText.
- **Print.** `Page.printToPDF` produces a four-page report with the fallback
  SVG, black legend, state table, selected sheet as a bordered block, method,
  colophon and print-only note; masthead nav, rail, list and footer are gone.
- **No-JS.** Fallback fills the stage, table complete, filters/list/count/append
  hidden, tip and pin at zero opacity, `<noscript>` visible.
- **Data gate.** `build_globe.py --check` passes: fallback 32,456 bytes, locator
  5,467, rows 1,080, counts 230/188/977/113/549/376/233/203/1,520.
- **i18n gate.** `--check` reports `problems 0`, 1,242 strings, 1,237
  translated; the five empty keys are ignored identifiers (`+`, `defer`,
  `js/globe.js`, `×`, `−`).

**Post-audit review pass.** An independent read of the first implementation
found one blocking renderer defect and a set of smaller correctness and
affordance issues; all are fixed and re-tested:

- **World layer.** `D.world.polys` is `[country][polygon][ring]`, one level
  deeper than a state's `[polygon][ring]`; the old call fed polygons to
  `eachRing` and every world coordinate became `NaN`. `worldPath()` now walks
  each country, so all **321 rings** draw in both poses. `--check` cannot catch
  a renderer shape, only the data.
- **Vienna hole.** `inPolys` OR-ed a polygon's rings, so Vienna tested true for
  Lower Austria and resolved to it (1,520 records). It now uses even-odd parity
  per polygon; point-to-state mismatches against the generator fall from 1,537
  to 28 border/nearest-state cases, and all nine state centroids resolve to
  themselves.
- **Controls and list.** The “Show more” row now honours `[hidden]`; the near
  list prints every record at the position (11 at the densest), matching its
  count; both state select and deselect reset the 120-row page; the record
  lede now says “a point opens its sheet” rather than promising a row reveal
  the list does not perform.
- **Focus and keys.** A record opened from the near list destroys its owner, so
  `Esc` falls back to the search field; `Esc` in the search field clears the
  query instead of closing the sheet.
- **Forced colours.** The canvas forces mark opacity to 1 and drops the dimmed
  base layer, so filter state is carried by presence and shape, not opacity.
- **Robustness.** The reduced-motion media listener is guarded like the forced
  colours one; the `NOT_FOUND_ERR` layer sentinel prints as “Layer not
  recorded”; the row meta is tagged German only when no English fallback is in
  it; every row now carries `aria-describedby`; the slow-frame DPR drop also
  measures flights; rings close only when no point crossed the limb; search
  covers state, place and type; the cursor is `pointer` over a mark.
- **Touch targets.** Controls are 36 px visual with an exact 44 px hit box: the
  pseudo-element is inset 5 px from the 1 px-bordered padding box, so it reaches
  4 px past the border on each side, and controls and filter pills sit 8 px
  apart, so neighbouring hit areas meet without overlapping. The sheet close is
  36 px with the same 44 px box; the small-phone rule keeps 36 px visual.
- **The 640 px control row.** The view pill inherited `flex: 1` inside the
  ≤ 640 px block and stretched to 494 px at 640 while it measured 94 px at 641.
  The rule is removed, so the pill keeps its label width above 420 and takes its
  own full-width row only at and below 420, as specified.
- **Mixed positions.** Filter highlighting uses separate memorial and terror
  position masks, so a position holding both kinds cannot highlight the wrong
  square or dot.

---

## 12. Departures and open items

- **`js/globe.js` is 49.1 KB raw**, above the 20 KB raw soft target. It is
  13.2 KB gzip and is the page's only behaviour; it is not minified, because
  the repository has no build step and the file must stay readable.
- **The globe loads a script, so the old “ten standalone pages load no script”
  invariant becomes eleven pages, ten of them script-free.** This is recorded
  in `AGENTS.md`.
- **The standalone footer is removed in print**, following the `sm-foot` shell
  convention rather than the spec's earlier “keeps the footer” line.
- **No per-dot tooltips, no wheel zoom and no pinch zoom.** They are omitted on
  purpose: the page is an atlas, not a slippy map, and the state table plus the
  list are the keyboard and touch path.
- **The state assignment is a point-in-polygon check, not a DERLA claim.** The
  colophon says so; 13 records were assigned by nearest state.
- **The static no-JS and printed Vienna row keeps the generator's raw `1520`**,
  while the enhanced table formats `1,520`; the German twin reads `1.520`.
  This is a cosmetic one-character difference on paper, left because changing
  it would touch the generated row artefact and the catalog key.
- **The 44 px hit box leans on one CSS detail.** It comes from an absolutely
  positioned `::after` whose containing block is the positioned button's
  padding box (a 5 px inset around a 36 px, 1 px-bordered control), with an
  8 px gap so neighbouring boxes meet without overlapping. Verified in
  Chromium at DPR 1 and 2 from 360 to 1440 px; Firefox and WebKit were not
  available here. If a browser mis-parents the pseudo-element, the control
  still works at its 36 px visual size and only the extra 8 px is lost, with
  no layout or keyboard impact; a wrapper span would be the fallback.

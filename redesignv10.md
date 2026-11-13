# V10 — Two remembrance platforms

**Status:** draft, 13 November 2026
**Scope:** a second feature plate on the CV and a second storymap page
**Keep:** V4–V9 structure, tokens, ids, print contract, no build step, no JavaScript on the storymap pages

## 1. What this adds, and why

V9 gave the CV one data exhibit: DERLA's national map of documented places of remembrance. V10 adds its counterpart — MEMOR, the City of Graz's digital memorial book — at city scale, and states the practice the two artefacts share.

The user is one of the five authors of MEMOR and one of the two creators of its research dataset (DOI `10.5281/zenodo.20510043`, CC BY 4.0). The claim to make is therefore not "I built a remembrance platform" but the stronger, checkable one: **two remembrance platforms, one working method**. The CV shows both; the second page shows how the city register behaves when it is drawn.

The new work is:

1. `#memor-feature` — a second feature plate immediately after `#storymap-feature`, using the same component and grid, separated by a hairline rather than a second accent rule.
2. `memor.html` — "The Last Addresses", a standalone, dependency-free data study of MEMOR, with its own inline city map and no JavaScript.
3. One offline generator, `tools/memor/build_map.py`, whose output is spliced into `index.html` and `memor.html` behind `memor:begin` / `memor:end`.
4. A print-visible MEMOR line in `#teaching-section`, because both plates are print-hidden and the printed CV must not lose the co-authorship.
5. Cross-links between the two storymap pages, and a small amount of shared CSS.

Out of scope: a fourth outcome, a fourth nav link, a project-register card, a third plate, a Europe-wide death map, any motion on the new plate, any per-person or per-address detail.

## 2. The pair: placement and composition

`#memor-feature` sits **directly after** `#storymap-feature`, before `#case-studies-section`. The pair is the argument; separating it by three screens would turn it into two unrelated banners. The credibility strip already ends on "History Sciences · DERLA", so a DERLA-only plate reads as an illustration of the prize. Two plates read as a practice.

The two rows share the paper field but not the accent:

- `#storymap-feature` keeps its 2px `--action` top rule and its padding, unchanged.
- `#memor-feature` takes the same component with `storymap-feature--memor`: **1px `--rule` top border**, top padding `clamp(40px, 4.5vw, 64px)`. No second ultramarine rule, no divider graphic, no label.
- The band closes with one full-width note, `storymap-feature__note`, `--text-xs`, `--ink-muted`, max 74ch, hairline above: *"Two remembrance platforms, one method: DERLA at national scale, MEMOR at the scale of a city. Both are drawn from their platforms' public data, and both leave the gaps in the record visible."*

This sentence is the only explicit claim. It is factual, testable from the two pages, and deliberately placed after the artefacts, never before them.

**Grid:** unchanged 0.44 / 0.56, copy left, figure right — in both rows. Mirroring the second row would read as a variation; identical order is the visual statement of a shared method. At ≤1120 the grid becomes 0.5/0.5, at ≤900 one column, copy first — the existing V9 breakpoints, no new ones.

**Measured at 1440:** DERLA plate 590px; MEMOR plate 759px with the figure capped at 520px (869px including the closing note); the band is ≈1,459px. The MEMOR plate is taller because the city is square. The figure cap keeps the copy column from ending 250px above the map; the cost is a 63px inset on the right edge, which reads as a plate edge, not a mistake. At 390: DERLA 811px, MEMOR 1,196px with the note; the full map, legend, caption and counts stay, never hidden.

## 3. The plate: copy and figures

**Kicker:** `Storymap · MEMOR` (the repeated word is the series signal).
**Title:** *The last addresses* — serif, `--display-2`, action colour, one line at 1440.
**Standfirst** (two sentences, ~48 words):

> MEMOR — the City of Graz's digital memorial book — records 812 people persecuted under National Socialism, and a last voluntary address for 808 of them. Here that register is drawn at city scale: 604 distinct addresses, concentrated in Gries, Lend and Jakomini, far fewer beyond them.

**Three counts** (`storymap-feature__stat`, tabular, sans):

| Value | Label | Role |
| --- | --- | --- |
| 812 | in the register | human |
| 604 | last addresses | spatial |
| 247 | died at Hartheim | consequence |

No percentage, no "over 800", no "812 mapped": the map holds 604 addresses for 808 people, and the register lists 812. The stat says what it counts.

**Action:** outline pill, `Open the MEMOR storymap` — not a second "Open the storymap" (ambiguous in a screen-reader link list).

**Figure** (`figure.storymap-plate`, `max-inline-size: 520px`):

- HTML legend bar, one key plus a note: `● 604 last addresses` / `one point per address · positions overlap`.
- The inline city map, `<svg class="map__svg">`, ~600×586, boundary plus one dot path.
- Caption: `Source: MEMOR, City of Graz · dataset CC BY 4.0 · DOI 10.5281/zenodo.20510043 · boundary © OpenStreetMap contributors, ODbL. 604 addresses recorded for 808 people, all against today's geocodes of historical addresses; no names are shown.`  (The caption names the ODbL boundary credit; a licence line that only covers the dataset would understate the base map.)

The map is content, not decorative ink: no `html.*` class gates it, nothing animates, nothing is hidden pending JavaScript.

## 4. The artefact: one dot class, not two

DERLA's map carries an ontology: **dot = memorial marker, square = site of terror**. MEMOR must not reuse the square. The obvious second class here would be "forced residence", but the data forbids it: of 496 forced-residence records, only 16 fall at nine Graz addresses besides the Feldhof institution; 173 are at 109 addresses in Vienna's 2nd district, 57 elsewhere in Vienna, 5 in Salzburg, 2 in the occupied Netherlands, 1 at Steinhof. A second class on a Graz map would draw nine points (sixteen records) and imply that forced residence was a minor local phenomenon.

So the plate map draws **one class: last voluntary addresses**, and the forced addresses are a chapter of the page, not a layer on the city. This also removes any chance that a MEMOR square is read as a site of terror.

- `map__outline`: Graz municipal boundary, `fill: --surface-paper`, 1px `--rule-strong`.
- `map__address`: one path of zero-length subpaths, round caps, `--action`, 1.3 weight at page scale, 1.5px pinned in the plate, opacity 0.6 / 0.7.
- No labels, no tiles, no pan/zoom, no per-point links, no district geometry.

**Projection:** local equirectangular (longitude × cos φ₀) fitted to a 600×586 viewBox with 12 units of padding. The boundary is Douglas–Peucker-simplified at 1 viewBox unit (1,992 → 285 points, ~2.9KB). Addresses are rounded to whole viewBox units and emitted once: 604 addresses collapse to 584 visible positions, which the `<desc>` states.

**Generator contract** (`tools/memor/build_map.py`):

- Inputs: the public EVENTS GeoJSON and the Graz boundary (Nominatim polygon for OSM relation 34719); both can be passed as saved files (`--events`, `--boundary`) so the run works offline.
- Optional `--natural-earth` for the country split in the report.
- `--splice FILE`, repeatable, indent-aware, writes between `memor:begin` / `memor:end`.
- Emits unique SVG ids `memor-map-title` / `memor-map-desc` (the DERLA ids are already taken on `index.html`).
- Deterministic ordering; a second run must be byte-identical.
- Prints a report: persons, voluntary events/addresses, forced events/addresses, deaths/sites, visible positions, boundary points, bytes, distance bins and (with `--natural-earth`) the country split. The page's counts can be checked against one run; the district table is a separate point-in-polygon pass against the City of Graz's district boundaries, and the 812 register total comes from MEMOR's person API.
- Defaults to fetching nothing at page load; nothing here is a build pipeline.

The map fragment is 9,733 bytes raw; `index.html` gzip is ~27.9KB and `memor.html` ~11.4KB (both under the 30KB / 15KB ceilings).

## 5. Data record (extracted 13 November 2026)

Source: `https://ns-opfer-graz.at/static/apps/map/EVENTS.952315e3.json` (mirror of the GAMS datastream). 1,972 event records covering 811 people. The person-register API lists 812; one person has no event in this extract. Counts below are sums over the event records, not the site's editorial claims.

- **Last voluntary addresses:** 808 events, 604 distinct addresses, all inside the present-day city boundary; four people in the register have none (three entries carry no address, one person has no event). 584 visible positions after dedupe at map scale.
- **District distribution of the 604 addresses:** Gries 134, Lend 127, Jakomini 90, St. Leonhard 73, Geidorf 62, Innere Stadt 41, Eggenberg 28; the other ten districts hold 49 between them, none more than 10; Ries holds none.
- **Forced addresses:** 496 events at 161 addresses. Feldhof (Straßgang) 242; Vienna 1020: 173 at 109 addresses; other Vienna: 57; Salzburg-Maxglan: 5; Netherlands: 2; Steinhof: 1; nine other Graz addresses: 16.
- **Deaths:** 668 records at 74 canonical sites. 143 people have no recorded death; 78 death records carry no date.
  - Hartheim 247, Auschwitz 71, Theresienstadt 41, Maly Trostinec 34, Dachau 26, Treblinka 25, Landesgericht Graz 25, Jasenovac 17, Buchenwald 15, Landesgericht Wien 12.
  - 346 of 668 outside today's Austria, in 14 countries: Poland 132, Germany 93, Czechia 41, Belarus 37, Croatia 17, Serbia 7, Ukraine 5, Latvia 5, Lithuania 3, Slovenia 2, Bosnia 1, Belgium 1, Romania 1, Russia 1.
  - Dated deaths by year: 1938:6, 1939:4, 1940:52, 1941:204, 1942:130, 1943:64, 1944:60, 1945:63. 590 records carry a date, but only 583 give a single year (seven give a range such as 1941/42 and 78 carry no date). 1941 holds 204 of those 583; 172 of the 204 are at Hartheim.
  - Hartheim dated: 1940:38, 1941:172, 1942:4 (214 dated, 33 undated). 242 of the 247 Hartheim deaths were last registered at Feldhof; "registered at" is the only relation the register supports, never "sent" or "transferred".
- **Distances (straight line, last voluntary address → recorded death place):** 666 pairs, mean 372 km. 0–250: 339; 251–500: 157; 501–1000: 124; 1001–1500: 45; >1500: 1. 170 exceed 500 km, 46 exceed 1,000 km. The first bin is not "nearby": it contains the 247 Hartheim deaths, about 170 km from Graz (range 161–171).
- **Categories (overlapping, MEMOR's own):** Jewish 410, euthanasia 244, political resistance 80, individual resistance 33, NS opponents 20, Jehovah's Witnesses 12, Roma 11, homosexual 10, deserters 6, religious resistance 4, Spain fighters 1. Twenty people carry more than one category.

**Licence and credit.** The research dataset is CC BY 4.0 with Schiller-Stoff and Lamprecht as creators; the MEMOR website's text and images are CC BY-NC 4.0. The page credits both and uses the stricter where in doubt. The boundary is OpenStreetMap data, ODbL 1.0, "© OpenStreetMap contributors", credited in the caption and the colophon. This study is not a MEMOR publication.

## 6. `memor.html` — The Last Addresses

Same shell as `storymap.html`: masthead, sticky chapter rail with a scroll-driven progress rule (the only motion), alternating white/paper chapters, colophon and small footer. **No `<script>`.** Same fonts, tokens, stylesheet, icon sprite and `.sm-*` grammar.

Title: `The Last Addresses — a MEMOR storymap`. Canonical `https://schiller-stoff.github.io/memor.html`. The h1 is the page's only h1. Masthead note `Storymap · MEMOR`; nav: Back to the CV (`index.html#memor-feature`), The memory landscape (`storymap.html`), Colophon.

**Chapters:**

1. **The last addresses** — the city map, 604 addresses, 808 people with an address, three without; the district table (Gries 134, Lend 127, Jakomini 90, …); what an address is in this register; the map's limits at city scale. The register's categories as one sentence, no chart.
2. **The forced addresses** — 496 people at a forced address; 242 at Feldhof; 173 at 109 addresses in Vienna's 2nd district; 57 elsewhere in Vienna; 5 in Salzburg; 2 in the Netherlands; 1 at Steinhof; 16 at nine other Graz addresses. A ranked list of *cities and institutions*, never a list of present-day residential addresses. No map: the forced addresses are mostly not in Graz, and drawing them on a Graz outline would be a lie of omission.
3. **Where they died** — 668 deaths at 74 sites; the top ten as a ranked list; 346 outside today's Austria, with the country split; the distance distribution as a five-column CSS bar chart, captioned with the Hartheim caveat; mean 372 km, 170 beyond 500 km.
4. **The Hartheim year** — the year chart, 1938–1945, 590 dated deaths; 204 in 1941, 172 of them at Hartheim; the Feldhof relation stated flatly; 33 Hartheim records undated, so the year is a floor.
5. **What the map cannot show** — 143 people with no recorded death (the record ends at the address; no inference of survival); 78 undated deaths; one person in the register with no event; addresses as today's geocodes, buildings gone, streets renumbered; no names, portraits or addresses reproduced; the difference between this study and MEMOR.
6. **Colophon** — five-author citation, DOI, both licences, OSM credit, extract date, event/address counts, projection and dedupe method, "not a MEMOR publication", links back to the CV and across to DERLA.

**Charts and lists.** Reuse `.sm-bars` for the distance and year charts with a `--five` / `--eight` column modifier; add one ranked-list component (`sm-rank`) for death sites and districts, hairline rows, tabular counts, no bars. No new type roles, no colours, no radii. The chart is a table with bars, not an image.

**Copy rules.** No "shocking", "haunting", "erased", "vanished", "journey", "route", "footsteps", "imagine"; no second person; no rhetorical questions; no arrows or lines between points; no "we". Say "the register records no death for them", never "survived" or "unknown fate". Say "registered at Feldhof", never "sent to Hartheim". Say "today's geocodes of historical addresses", never "the house where". The categories are MEMOR's, not the author's.

## 7. CSS and system impact

- **Component reuse, not a copy.** `#memor-feature` uses `.storymap-feature`, `__grid`, `__copy`, `__kicker`, `__title`, `__standfirst`, `__stats`, `__stat`, `__actions`, `.storymap-plate`, its frame/bar/key/swatch/caption. No new title rule, so the serif count stays **8**. The only new rules are the `--memor` modifier (rule, padding, figure cap) and `__note`.
- **`map__address`** joins `map__dots` in the shared artefact block rather than duplicating it: one rule with two selectors for fill/stroke/caps, the plate's pinned weight listed beside `map__dots`, and the class added to the forced-colours and print blocks. The square/`map__terror` semantics stay DERLA's alone.
- **No `html.*` gate**, no observer, no scroll listener, no motion. `js/site.js` is untouched.
- **Print:** `.storymap-feature` already hides both plates, so `#memor-feature` inherits the hide with no new selector. `memor.html` reuses the storymap print block: chrome removed, every chapter and figure kept, boundary `fill: none; stroke: #000`, `map__address` black at opacity 1, bars outlined, rank rows kept, `break-inside: avoid`. The MEMOR plate does not print; the dataset line in `#teaching-section` does.
- **Forced colours:** boundary `CanvasText`, `map__address` `CanvasText` at full ink, legend swatch `CanvasText`. One class means no weight distinction to preserve. The plate's paper ground becomes `Canvas`, the bar/frame borders become `CanvasText`.
- **Reduced motion:** nothing to stop; the plate has no transition and no animation. Verify no inherited `a`/`svg` transition applies.

## 8. Print mitigation: one visible MEMOR line

Because both plates are print-hidden, the printed CV would otherwise contain no MEMOR at all. Add a second, text-only `article.publication-highlight` in `#teaching-section`, after the DERLA volume and before the teaching list:

- `label`: `Dataset · 2026`
- `h3 lang="de"`: `MEMOR — Das Digitale Gedenkbuch der Stadt Graz`
- one sentence on the dataset's scope (812 people, last voluntary addresses, forced addresses, recorded places of death)
- `publication-highlight__contribution`: `Co-author of MEMOR and co-creator of its dataset`
- link: `View the dataset on Zenodo` → DOI

The modifier `publication-highlight--text` collapses the grid to one column (no empty media column) and the existing print rules keep it. This changes the documented count from one publication highlight to two; the edit is deliberate and recorded in `AGENTS.md`.

## 9. Verification

Add to the existing invariant list:

```bash
grep -c 'class="project-card"' index.html                 # 21
grep -c 'class="teaching-item"' index.html                # 20
grep -c '<h1' index.html                                  # 1
grep -c 'class="section-head"' index.html                 # 8
grep -c 'font-family: var(--font-serif)' css/custom-styles.css   # 8
grep -c 'class="publication-highlight"' index.html        # 2
grep -c '<script' memor.html                              # 0
grep -c 'memor:begin\|memor:end' index.html               # 2
grep -c 'memor:begin\|memor:end' memor.html               # 2
diff <(sed -n '/memor:begin/,/memor:end/p' index.html | sed 's/^ *//') \
     <(sed -n '/memor:begin/,/memor:end/p' memor.html | sed 's/^ *//')   # no output
grep -c 'new window.IntersectionObserver' js/site.js      # 2
grep -nE 'addEventListener\("scroll"' js/site.js           # 2
gzip -c index.html | wc -c                                # ≤ 30 KB
gzip -c memor.html | wc -c                                # ≤ 15 KB
```

Generator run (by hand, output committed):

```bash
python3 tools/memor/build_map.py \
  --events /tmp/memor-events.json \
  --boundary /tmp/graz-boundary.json \
  --splice index.html --splice memor.html
# prints 811/808/604/496/161/668/74/584/286/...
```

Browser checks: `index.html` at 1440/1120/1000/900/640/390/360 (no sideways scroll; the city map never clips; the caption and counts never hide; the two plates read as a band, not two billboards); forced colours (map re-inked, legend readable, no colour-only state); print preview (both plates hidden, the MEMOR dataset line present, no half-drawn rule); `memor.html` at 1440/1000/900/640/390 (rail wraps in one row, charts do not overflow, ranked lists reflow), with JS disabled (the page is complete), and in print (map black, bars outlined, all chapters kept). Keyboard: the new nav link order, the two page links, the row links.

Idempotence: run the generator twice, compare `sha256sum` of both pages.

## 10. Risks and mitigations

1. **The CV becomes a gallery.** Two map plates teach the reader that this is a visualisation portfolio; a third would be the point of no return. *Mitigation:* one paper band with a hairline and one accent rule; the figure cap; no motion; a written rule that **the CV carries exactly two exhibits**. Encode it in `AGENTS.md`.
2. **Ethical misreading.** Implying survival for the 143, a documented Feldhof→Hartheim route, exact buildings, or a claim on the historians' research. *Mitigation:* the fixed vocabulary in §6, no connecting graphics, "the register records no death", "registered at", and the five-author/co-creator formula in the colophon and the CV line.
3. **Artefact drift and licence loss.** Two inline maps, two generators, two pages, two licences, and two captions where a credit can fall off. *Mitigation:* new `memor:` markers, one generator run for both hosts, a diff invariant, credit in caption **and** colophon, and no hand edits inside the markers.
4. **The pairing becomes a slogan.** The closing note is the one sentence that could read as marketing. *Mitigation:* it comes after the artefacts, makes only checkable claims, and names the gaps as well as the method.

## 11. Open questions for the owner

- **Role wording.** The record uses "one of the five authors" and "co-creator of the dataset", which the source supports. If the CV should name a specific role on MEMOR (platform, data pipeline, editorial), that needs the owner's confirmation — do not infer it.
- **District naming.** "Gries, Lend and Jakomini" is computed (134 + 127 + 90 of 604), not eyeballed. If MEMOR's own district assignment differs, MEMOR is right; the page says "today's municipal districts".
- **The 812nd person.** The register API lists 812; the map data holds 811. The page states both, in the register and in the extract note, rather than rounding.
- **Boundary licence.** OSM/ODbL is used because the City of Graz's geodata is under service terms, not an open licence. If a CC BY boundary is preferred, the caption and colophon change; the geometry does not.

## 12. What V10 does not change

The hero, navigation, proof strip, DERLA plate and page, outcomes, capabilities, method, register, CV, contact, imprint, footer; all existing ids and fragment links; the two IntersectionObservers and two scroll listeners; the motion vocabulary; the print-as-concise-CV contract; the one-accent palette; the serif scope; the no-build rule.

## 13. Implementation record

Built on 13 November 2026 on branch `redesign`, not committed.

**Files.** `tools/memor/build_map.py` and `tools/memor/graz-map.svg` (new); `memor.html` (new); `index.html` (the plate, the dataset card); `css/custom-styles.css`; `storymap.html` (one cross-link); `AGENTS.md` (contract).

**Generator.** 1,992 boundary points → 285 after Douglas–Peucker at 1 unit; 604 addresses → 584 positions; SVG 9,733 bytes; ids `memor-map-title` / `memor-map-desc`; splices `index.html` and `memor.html`; two runs are byte-identical. Its report reproduces 811 persons, 808 voluntary events / 604 addresses, 496 forced / 161, 668 deaths, 83 place names, 74 canonical sites, 583 single-year deaths, 666 distance pairs (mean 372 km) and 346 deaths outside Austria.

**Additions not in the plan.** Four size caps, all because the page and chapter measure is wide:

- `.storymap-feature--memor .storymap-plate` 520px (planned).
- `.sm-map--city` 640px — at the chapter's full ≈958px the square map would be taller than the viewport and its dots would read as dust.
- `.sm-bars--five` / `--eight` 720px — five bars at 958px would be 150px wide each.
- `.sm-rank` 640px, rows at `--space-xs` — 16 district rows at full measure read as scattered numbers, not a table.

**Print fixes found while checking the PDF.** The shared storymap print block now inks `.sm-legend__dot` / `.sm-legend__square` black (the legend dot printed ultramarine) and forces `.sm-chapter__body > p.sm-note` to a black left rule with black text. Both pages benefit. The CV still prints nine pages, both plates are absent, and the MEMOR dataset card is present on page 6. `memor.html` prints eight pages, map black on white with the markers intact.

**Verified.** All grep invariants (21 cards, 20 teaching items, one `h1`, 8 section heads, 8 serif rules, 2 publication highlights, 0 scripts on `memor.html`, 2 `memor:` markers per host, 2 IntersectionObservers, 2 scroll listeners); no duplicate ids and every local link and fragment resolves; no sideways scroll at 1440/1120/1000/900/640/420/390/360; forced colours on both pages (map re-inked, markers at full ink); print via headless Chrome for both pages; gzip 27.9KB / 11.2KB / 11.9KB. The two maps are byte-identical across hosts.

**Review corrections (same day).** An independent review of the diff found three real errors, all fixed:

- The text-only dataset card was re-split into the 88px thumbnail column by the `≤640px` `.publication-highlight` rule (equal specificity, later in the file), squeezing the paragraph for the whole 421–640px range. The modifier is now `.publication-highlight.publication-highlight--text`.
- `memor.html` said "three people in the register have no address" while its own lede said 808 of 812 — the register figure is four (three entries with no address, one person with no event). The paragraph now says four and names both cases.
- The forced-address chapter said a Graz map would show "seventeen points"; the data gives sixteen records at nine addresses. Corrected to nine, and the district note was recomputed: the six central districts hold 527 of 604, the ten beyond them 77 (Eggenberg 28), the nine smallest 49, and Ries — the tenth district, not the seventeenth — holds none. The Hartheim distance in the chart caption is 170 km (range 161–171), not 200.

Also: `aria-label` on all four ranked lists; `lang="de"` on the German title and citation; the generator now writes each host through a temp file and refuses to splice two hosts whose blocks differ, and prints `outside bbox` so a bbox that starts dropping addresses cannot pass silently.

**Still manual.** A real screen reader, true JS-disabled loading (the page has no script, but the surrounding profile nav does), and a physical print check. `opencode.jsonc` is untouched.

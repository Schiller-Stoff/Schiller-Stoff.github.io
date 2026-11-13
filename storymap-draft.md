# Storymap draft — The Memory Landscape

Status: **v1 implemented**, 13 November 2026, as a static data essay. The
six-stop Graz walk is deferred; see §11 for the implementation record and the
deviations from this draft. Not reviewed by historians. Data extracted from the
public DERLA map on the same day.

## 1. What it is

A standalone, scroll-read data study built on DERLA's open data: five chapters,
four of them analytical and the fifth the colophon. The Graz walk drafted in §4
is **not** in v1. It is a **design study by the person who built DERLA's
interface**, not an official DERLA product, and it says so in the masthead and
colophon.

- Page: `storymap.html`, standalone masthead/footer, same fonts and tokens as
  the CV, one stylesheet (§19 of `css/custom-styles.css`).
- One data request: none. The map is baked into inline SVG at build time.
- One page weight: 39KB uncompressed / 11.8KB gzip, no images, no map library,
  no tiles, **no JavaScript at all**.
- Promoted on the CV as `#storymap-feature`, a paper feature plate directly after
  the credibility strip, carrying the same inline map (V9); a "Read the storymap"
  text link also sits in the DERLA outcome. The V8 bridge band is gone.

## 2. The data

Extracted from `window.derla_mapp.data` on
`https://gams.uni-graz.at/context:derlageo/...?mode=map`:

| Fact | Value | Note |
|---|---|---|
| Features extracted | 4,399 | one GeoJSON FeatureCollection, WGS84 points |
| Usable records | **4,393** | 6 excluded: 5 malformed coordinates, 1 duplicated latitude |
| Dated records | 3,877 | 516 undated; 7 pre-1945 anomalies excluded from the timeline |
| Dated after 2000 | 2,765 | **71%** of dated records |
| Dated in the 2010s | 1,481 | the single largest decade |
| `Orte des Terrors` records | 232 | layers beginning `Orte des Terrors` |
| Not publicly accessible | 174 | `publicAvailable` = "Nicht öffentlich zugänglich" |
| Vienna object identifiers | 1,559 | ~35%; 377 records have no pid |
| Graz (8010) | 84 | 175 with 80xx postal codes |

Fields kept: `title`, `pid`, `type`, `date`, `address`, `layer`, `coordinates`.
No images, no person records, no descriptions copied wholesale.

**Licence:** DERLA project material is **CC BY-NC 4.0**. Attribution is required;
commercial use is not permitted. A personal portfolio may qualify, but the owner
must confirm that a site advertising paid services is still non-commercial, or
request permission. This is a publication blocker, not a detail.

**Editorial:** historical sentences below are adapted from DERLA's own detail
pages and must be reviewed by DERLA / the Centrum für Jüdische Studien before
publication. The draft does not invent dates, numbers or causes.

## 3. The story

### Masthead

> **The Memory Landscape**
> A storymap of DERLA's places of remembrance
> Sebastian David Schiller-Stoff · Graz, November 2026
> Data: DERLA, University of Graz, CC BY-NC 4.0

### 01 — A country of markers

> A map of remembrance is not a neutral backdrop. Every dot is a decision: a
> stone set, a plaque mounted, a square renamed. DERLA documents 4,393 such
> decisions across Austria.
>
> The dots are not evenly spread. Vienna alone accounts for about a third of the
> records; the Alpine west is thinner, and some municipalities have no marker at
> all. The density follows Jewish communities, camps, prisons and the places
> where later generations chose to work through what happened there.
>
> 232 of the records document sites of terror — Gestapo offices, camps, prisons,
> execution sites. They are drawn as small squares, not circles. A memorial and a
> perpetrator site can stand on the same street; the map must not blur them.

Figure: the national map, all 4,393 points, terror sites as squares. Legend.
Optional state: Vienna highlighted.

### 02 — Three forms

> A plaque attaches memory to a wall. A Stolperstein interrupts a pavement. A
> monument occupies a square. The form decides how you meet the past — at eye
> level, underfoot, or at a distance.
>
> DERLA records 1,015 Gedenktafeln, 727 Stolpersteine and 349 Denkmäler. These
> are not a hierarchy. They are three different contracts with the passer-by.
>
> The dataset also records 795 "Steine der Erinnerung", a form this study does
> not interpret. The labels are DERLA's vocabulary, not the author's.

Figure: three typographic specimens (plaque / stone / monument) with counts and
one example each. No photographs.

### 03 — When memory happened

> The map is not a record of the war. It is a record of what later generations
> did with it. Of the 3,877 dated records, 71% were set after 2000; 1,481 date
> from the 2010s alone.
>
> The 1940s markers are mostly immediate postwar commemorations. The 1950s and
> 1960s are thin. The curve rises through the 1980s and 1990s, then jumps. The
> end of the eyewitness generation and the digital turn are part of that jump —
> but so is a changed public argument about who belongs in the story.

Figure: decade bars 1945–2026, with undated records noted. No animation; the
numbers are the point.

### 04 — A walk in Graz

> Six stations, about 2.5 km, from a collective plaque to a stone in the
> pavement. The order follows the city, not the calendar.

The walk is the signature interaction: a sticky map on desktop, a route that
draws once, and the active stop marked as its text enters view. On mobile the
map sits at the top of the chapter and the six stops read as a numbered list.

See §4 for the stops and copy.

### 05 — What the map cannot show

> 4,393 dots are not 4,393 stories. The dataset records markers, not every site;
> 174 records are not publicly accessible; some places have no marker at all.
> A map makes absence visible only if you ask what is missing.
>
> DERLA's own "Leerstellen" routes and its "Orte ohne Zeichen" records are the
> necessary counterweight to this map. The gaps are part of the memory landscape,
> not an error in the data.

Links: DERLA's "Wege der Erinnerung", the "Leerstellen" route for Tyrol, the
"Orte ohne Zeichen" example. No claims about the size of the gap.

### Colophon

> Data: DERLA — Digitale Erinnerungslandschaft Österreichs, University of Graz,
> CC BY-NC 4.0. Extracted 13 November 2026 from the public map; six malformed
> records excluded. Historical descriptions adapted from DERLA; reviewed by
> [pending]. Base map: Natural Earth 1:50m, public domain. No photographs.
> This is an independent design study, not an official DERLA publication.

## 4. The walk — six stations

| # | Station | Date | Address | Coordinates |
|---|---|---|---|---|
| 1 | Gedenktafel für die Widerstandskämpfer gegen den Nationalsozialismus | 1949 | Paulustorgasse, 8010 Graz | 15.440225, 47.075149 |
| 2 | Kirschbaum und Gedenktafel am ehemaligen Gestapo-Sitz | 1995 | Parkring 4, 8010 Graz | 15.442005, 47.076014 |
| 3 | Künstlerische Intervention zu Sigfried Uiberreither | 2008 | Burgtor, 8010 Graz | 15.443050, 47.072153 |
| 4 | Stolperstein für Hildegard Burger | 2017 | Sackstraße 26, 8010 Graz | 15.435804, 47.073406 |
| 5 | Gedenktafel für David Herzog | 2009 | Radetzkystraße 8, 8010 Graz | 15.440134, 47.066712 |
| 6 | Mahnmal für die Opfer des Novemberpogroms | 2023 | David-Herzog-Platz 1, 8020 Graz | 15.433820, 47.064120 |

Walking distances: 166 m, 437 m, 566 m, 813 m, 558 m — total **2.54 km**, 60–75
minutes without stops.

Draft copy, one paragraph per station:

1. **Paulustorgasse, 1949.** "Four years after the war, the city set a plaque for
   the fighters against National Socialism. It names a collective, not
   individuals: the first public language of remembrance in Graz was the
   resistance, not the victims."
2. **Parkring 4, 1995.** "In the courtyard of the police directorate, a cherry
   tree and a plaque mark the site of the Gestapo headquarters between 1938 and
   1945. The institution that occupies the building today keeps the memory
   inside its own courtyard, behind a gate."
3. **Burgtor, 2008.** "A text-based intervention begins with the first person:
   *'Ich, Sigfried Uiberreither, Landeshauptmann …'* The former Nazi governor
   speaks at the gate of the square that represents the city. The intervention
   does not add a victim; it makes the perpetrator visible in the civic space."
4. **Sackstraße 26, 2017.** "Hildegard Burger, born in Zeltweg in 1905, was a
   courier between the Communist district leadership in Voitsberg and the
   provincial leadership in Graz. Arrested in 1941, sentenced to death in Graz
   in 1943, executed that September. The stone is in the pavement, at the scale
   of a walk."
5. **Radetzkystraße 8, 2009.** "A plaque at the former home of Landesrabbiner
   David Herzog (1869–1946). The address is a residential street; the plaque
   returns a name to a doorway."
6. **David-Herzog-Platz, 2023.** "A small bronze firefighter by Peter Roskaric,
   made with students of the Ortweinschule, stands beside the synagogue. It
   remembers the November pogrom of 1938, when the synagogue burned and the fire
   brigade watched."

**Review flags:** "first public language" in stop 1 is an interpretation; remove
it unless a historian confirms. "Behind a gate" in stop 2 depends on access;
verify. Do not publish the walk as a guided tour without checking opening hours
and permissions.

## 5. Map design

### Projection and assets

- Albers equal-area conic, standard parallels 46.5° / 49.5°, central meridian
  14.5°, latitude of origin 47.5°.
- National viewBox 720×380, 14px padding; Austria outline from Natural Earth
  1:50m (public domain), simplified to **2.9KB**.
- All 4,393 points as one path of 1px dots: **43.5KB** at integer precision.
- 232 terror sites as one path of 1.3px squares: **~4KB**, `--ink`, so the
  distinction is shape **and** tone.
- Graz viewBox 360×320: 84 points, six numbered stops, route path; true relative
  positions, no streets. Label it "schematic; not a navigation map".
- No tiles, no Leaflet, no runtime JSON, no pan/zoom. A link opens the full DERLA
  map for exploration.

### States

| Where | State | Trigger |
|---|---|---|
| Ch. 1 | all points; optional Vienna emphasis | static; optional observer |
| Ch. 2 | typographic specimens, no map | static |
| Ch. 3 | decade bars, no map | static |
| Ch. 4 | Austria → Graz, route draws, stops activate | chapter enters; one observer |
| Ch. 5 | no map | static |

This is deliberately **not** a map that morphs on every scroll. The map carries
the chapters that are about geography; the forms and the timeline do not need it.

### Sticky map

- Desktop: `.storymap__map { position: sticky; top: 96px; }`, right column,
  52/48 split; the six stops scroll in the left column.
- ≤900px: static map at the top of chapter 4, one column; no sticky.
- Print: map at 100% width, route complete, black dots, no sticky.

## 6. Interaction and accessibility

- `js/storymap.js`, ~80 lines: one `IntersectionObserver` for the active stop,
  one for the chapter rail; no scroll listener, no per-frame work.
- Route draw: `pathLength="1"`, `stroke-dashoffset: 1 → 0` once, 1.2s, under
  `prefers-reduced-motion: no-preference`; otherwise complete.
- Active stop: ring + label + `aria-current="step"` on the list item; the map
  marker gets a class. The list is the source of truth; the map is supplementary.
- Chapter rail: `<nav aria-label="Chapters">` with five links; `aria-current`
  set by the observer; CSS scroll-driven 2px progress line.
- Maps: `<figure>` + `<figcaption>`; `<svg role="img" aria-labelledby="...">`
  with `<title>`/`<desc>`; the same facts appear in prose and tables.
- No content is revealed by JS. Without JS: all chapters, the national map, the
  Graz map with a complete route, and the six stops are visible; only the active
  highlighting and the rail state are absent.
- Reduced motion: no route draw, no transitions, no progress animation.
- Forced colours: dots become `CanvasText`; the legend keeps shape + text, not
  colour alone.
- Print: A4 report; hide the sticky rail, the progress line and the "open the
  map" affordance; keep every chapter, both maps, the stop list and the colophon.

## 7. Integration

What shipped (V9; see §11):

1. **Feature plate on the CV** directly after the credibility strip:
   `#storymap-feature`, serif `h2`, standfirst, three counts, one outline pill and
   the inline map. It replaced the V8 bridge band, which was too easy to scroll
   past.
2. **DERLA outcome action:** a `.text-link` "Read the storymap" beside the
   existing outline pill. No change to ids, counts or the project register.
3. **Storymap masthead:** wordmark links to `index.html`; "Back to the CV" links
   to `index.html#storymap-feature` (the plate, not the outcomes); the closing
   button links there too; imprint links to `index.html#imprint-section`.
4. **Metadata:** `<title>The Memory Landscape — a DERLA storymap</title>`,
   description, canonical, `og:image` reuses `og-cover.jpg` for v1.

## 8. Ethics

- Memorial-first, not portfolio-first. No "discover", "explore", "journey",
  rewards, badges or gamified progress.
- No photographs of victims, sites or objects. Typography and map only.
- Do not blend perpetrator sites into a generic memory field; the square is a
  legend item and is named.
- Do not imply completeness. Say "documented markers" in the standfirst and the
  colophon; link to DERLA's gaps work.
- Use DERLA's language for violence ("murdered", "deported", "persecuted");
  do not soften it.
- The author built DERLA's interface; disclose that, and keep the "independent
  design study" label visible.
- Editorial review by DERLA / CJS before publication; the draft's interpretations
  are flagged.

## 9. Build plan

| Step | Output | Cost |
|---|---|---|
| 1. Extract | `tools/storymap/extract.py` parses the inline FeatureCollection, filters, writes a compact JSON (not committed) | 1h |
| 2. Map | `tools/storymap/build_svg.py` projects Natural Earth + points, writes the SVG groups | 3h |
| 3. Shell | `storymap.html` with masthead, five chapters, colophon, inline SVG | 4h |
| 4. Style | `.storymap` block in `css/custom-styles.css` (one stylesheet) | 3h |
| 5. Behaviour | `js/storymap.js`: observers, active stop, rail | 2h |
| 6. Verify | 360/900/1120/1440, no-JS, reduced motion, forced colours, print | 2h |
| 7. Review | DERLA/CJS read, licence sign-off | external |

No bundler, package manager or CDN. The generator is offline and its output is
committed, like the existing WebP derivatives.

## 10. Open decisions

1. **Licence:** is a personal portfolio with a services page "non-commercial"
   under CC BY-NC 4.0? If not, request permission or publish only aggregate
   counts with a link, not the point data.
2. **Language:** English narrative with German names (recommended), or a German
   page, or a bilingual toggle?
3. **Scope:** the six-stop Graz walk (recommended) or a national 4,393-point
   story without a walk?
4. **Editorial:** who reviews the six stop texts, and is "first public language"
   supportable?
5. **Title/URL:** `storymap.html` / "The Memory Landscape", or
   `erinnerung.html` / "Orte der Erinnerung"?
6. **Images:** none (recommended), or DERLA images with per-image credit and a
   rights check?
7. **Map:** static SVG (recommended) or a real pan/zoom map with a vendored
   library? The latter adds ~150KB and a tile/privacy question.

## 11. Implementation record

Shipped 13 November 2026. What is on the page, and where it differs from the
draft above:

**Scope.** Chapters 01, 02, 03 and the colophon follow §3. Chapter 04 of the
draft (the Graz walk) is replaced by **"What the map cannot show"**, which was
chapter 05; the colophon becomes chapter 05 in the rail. The walk stays in §4 as
a deferred appendix. Reason: the walk is a second interaction design (sticky
map, active stop, per-stop copy review) and would have gated publication of the
national essay behind six un-reviewed texts. The four national chapters are
complete, and nothing on the page promises the walk.

**No JavaScript.** The draft's §6 assumed `js/storymap.js` for observers and a
sticky map. None of that shipped. The page has no `<script>` element: links,
rail, map, chart and colophon are static, and the only motion is a CSS
scroll-driven 2px progress rule under the rail (`@supports` +
`prefers-reduced-motion: no-preference`, with an explicit `animation: none`
under reduced motion). Chapter numerals are `aria-hidden`, the rail carries no
`aria-current`, and every fact in the map's `<title>`/`<desc>` is repeated in
prose.

**Map.** One inline SVG, 720×380 viewBox, between the `map:begin` / `map:end`
markers, generated by `tools/storymap/build_map.py`: Albers equal-area conic
(46.5°/49.5°, central 47.5°/14.5°), Natural Earth 1:50m outline simplified at
0.5px, all 4,161 markers as one round-capped path, and the 232 sites of terror
as one square-capped path. No pan/zoom, no tiles, no per-point links, no
addresses, no tooltips. Print and forced colours restyle it through
`currentColor`; in forced colours the shapes keep their distinction at full
opacity.

**V9 promotion and dedupe.** The map is now also in `index.html`: one generator
run with `--splice storymap.html --splice index.html` writes the same block to
both, so the two maps cannot drift. Coincident records are emitted once per
whole viewBox unit (4,393 records → 1,545 positions; 1,458 dot positions and 87
square positions), which is pixel-identical on screen and cuts the map from 47KB
to 18.5KB. All prose counts stay record counts. The CV plate re-inks the same
paths at CSS-pixel weights (`vector-effect: non-scaling-stroke`), because it
renders at 348–811px.

**Chart.** The decade bars are static CSS columns driven by a `--v` percentage
per bar, from 1940s to 2020–26. Above 640px they are nine columns; below that
they turn into rows (`label | bar | count`) so the labels stay readable. In
print they become outlined columns, so they survive a browser that drops
background graphics. No count-up, no animation.

**Attribution.** Licence CC BY-NC 4.0 (user states they own DERLA, so the
publication gate in §2 is cleared). The colophon carries the attribution, the
licence link, the extract date, the six excluded records, the projection, the
base-map credit and an explicit "not a DERLA publication" statement.

**Verified.** 4,393 points / 232 terror / 3,877 dated reproduced by the
generator on every run; 1440/900/390 render with no sideways scroll; the rail
wraps into one row at 900px; the chart reads as rows at 375px; no console
messages; all ids unique and all fragments resolve on both pages.

**Still open.** Historical review of the prose (external, §2); the Graz walk as
a possible v2 appendix. The CV-entry question (decision 3 in `redesignv8.md`) is
settled: V9 added both the feature plate and the DERLA outcome link.

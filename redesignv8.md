# V8 — Depth, restrained

Status: **implemented**, 13 November 2026 — hero graph drift, register arrow
fill and `storymap.html`, all uncommitted in the working tree. The bridge band in
§5 was **retired by V9** (`redesignv9.md`); the storymap is now a feature plate
directly after the credibility strip. See §12 for the implementation record and
the measurements. V7 remains the published design until this change set is
pushed.

## 1. What the reference actually does

The request was "more animation, a parallax like ai-at.eu, and some of its design
elements". Inspecting `ai-at.eu` in Chrome at 1440px shows:

- a fixed header, a **carousel** hero with large overlapping circles, and a
  **looping Vimeo video** in the second section;
- **no scroll-linked parallax**: no `background-attachment: fixed`, no
  `animation-timeline`, and no transform change on any visible block at
  scroll 0 → 400px;
- oversized sans type, a pastel full-bleed band, square media, pill buttons,
  arrow links, generous white space.

Its motion is a carousel and a video, not depth. Copying that would add weight,
perpetual motion and a third-party request. The borrowable part is the
**composition**: a full-bleed band, oversized statement type, overlapping circle
geometry, and one strong arrow affordance. V7 already has the type scale, square
media, pills and arrow links.

## 2. What survived review

| Candidate | Verdict | Why |
|---|---|---|
| Hero orbit (460px hairline circle) | **Cut** | Invisible behind the opaque profile card; adds a fifth, unearned circle role; collides with the graph. |
| Hero graph drift | **Keep, 48px** | The one defensible depth cue; compositor-only, desktop-only. |
| Ultramarine interlude | **Change** | A second blue field demotes the accent and cannibalises the footer; moves the page from CV to advertisement. |
| 600-dot constellation in the band | **Cut** | Turns documented memorial records into wallpaper. |
| Register arrow fill | **Keep** | Best value in the proposal; ~10 lines. |
| Graz walk in storymap v1 | **Defer** | Duplicates DERLA's own "Wege der Erinnerung"; adds editorial and access burdens. See `storymap-draft.md`. |

## 3. Effect 1 — hero graph drift

The graph is already the page's depth layer: 15 edges, 12 nodes, 0.12 opacity,
absolute behind the copy. Let it move 48px as the hero leaves.

```css
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 901px) {
    @keyframes hero-field-drift {
      from { transform: translateY(-50%); }
      to   { transform: translateY(calc(-50% - 48px)); }
    }

    .hero__graph {
      animation: hero-field-drift linear both;
      animation-timeline: scroll(root block);
      animation-range: 0 90vh;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__graph {
    animation: none !important;
  }
}
```

Details that matter:

- `scroll(root block)`, not bare `scroll()`, which binds to the nearest
  scrollport.
- The `from` value is the literal `translateY(-50%)`; the graph uses that
  transform for vertical centring. Starting from `0` would jump it by half its
  height.
- The graph is `display: none` at ≤900px, so this is **desktop-only**. Say so to
  the owner: the "more animation" request is invisible on phones.
- No `will-change`. The element is small and already composited during the hero
  draw.
- The explicit `animation: none` is required: the global
  `animation-duration: 0.01ms` override at `custom-styles.css:3135` does **not**
  stop a scroll timeline. The file already documents this at `:3129` for the CV
  spine.

No orbit, no new markup.

## 4. Effect 2 — register arrow fill

On hover/focus the 40px circle fills ultramarine, the arrow turns white, and the
border follows. The title underline and the 3px icon shift stay.

```css
.project-card__arrow {
  transition: color var(--dur-fast) var(--ease-standard),
    border-color var(--dur-fast) var(--ease-standard),
    background-color var(--dur-fast) var(--ease-standard);
}

.project-card__link:hover .project-card__arrow,
.project-card__link:focus-visible .project-card__arrow {
  background-color: var(--action);
  border-color: var(--action);
  color: var(--on-dark);
}
```

Corrections to the earlier draft:

- The arrow transition currently lists only `color` and `border-color`
  (`:1501`); without `background-color` the fill snaps while the border fades.
- The project title underline is **1px**, not 2px (`:1522`). The hover state is
  already paper + title + 1.025 scale + 3px icon shift + fill. That is five cues.
  Keep the scale for now; if the hover reads busy, retire it in Phase 4 rather
  than removing a V7 effect as part of an "add motion" change.
- In forced colours the background is overridden; the border, underline and icon
  shift still carry the state, so nothing depends on the fill.

## 5. Effect 3 — the bridge band *(retired in V9)*

> **Superseded.** V9 (`redesignv9.md`) removed this band and replaced it with a
> paper feature plate directly after the credibility strip, carrying the real
> inline map. The section below is the V8 record, kept for the reasoning; the
> code no longer exists.

A full-bleed band after the project register, before knowledge transfer. It is
the storymap's entry point and the one composition borrowed from AI:AT.

- **Ground: white**, with a full-bleed 2px `--action` rule above and a 1px
  `--rule` rule below. Not ultramarine: the footer keeps the only blue field.
- **Type:** one serif `h2` at `--display-2` in `--action`, a factual standfirst
  in `--ink-soft`, one arrow link.
- **Geometry:** two absolutely positioned, unfilled circles
  (`border: 1px solid var(--action); border-radius: 50%; opacity: .12`), right
  side, partially cropped by the band. Pure CSS, 0KB, visible on mobile.
- **No dots, no map, no data.** Memorial records are not decoration.
- **No `.section-head` class**, so the page keeps exactly eight section heads.
- **No CTA until `storymap.html` exists on `master`.** A CTA that 404s is worse
  than none.
- **Placement:** after `#portfolio-section` and before `#teaching-section`. It
  pauses the portfolio at its end; it does not sit between "what I did" and
  "what I can be hired for".

Copy (draft):

> **Storymap · DERLA**
> ## The memory landscape
> 4,393 documented places of remembrance in Austria. A design study built on
> DERLA's open data.
> [Open the storymap →]

Why not ultramarine (recorded for the owner):

1. `--action` is ink, not paint: the h1, links, rules and arrows. A 100vw field
   turns it into a ground, and grounds are what `--surface-paper` is for.
2. The footer is the page's single full-bleed field and its last impression.
3. A saturated band with a serif claim and a pill is structurally an
   advertisement; the CV is evidence-first.
4. It would put NC-licensed data next to the paid-services section. The white
   band after the register avoids that adjacency.

If the owner insists on blue, the same band can be `--action` with the text
`--on-dark`; it is a two-token change. The recommendation is white.

## 6. What is not added

- **Hero orbit** — invisible and semantically wrong.
- **600-dot constellation** — memorial records as wallpaper.
- **Page-wide reveal, image parallax, custom cursor, magnetic buttons, marquee,
  autoplay video, carousel, count-up** — all hide content, add weight or
  spectacle, or fight the brief.
- **Cross-document View Transition** — reversible, but it belongs after both
  pages exist; Phase 4 option.
- **Sticky section rail on the CV** — the storymap can carry a table of contents;
  the CV does not need one.

## 7. Fallbacks and invariants

| Context | Behaviour |
|---|---|
| No scroll-timeline support | The graph is exactly V7 (static, centred). |
| `prefers-reduced-motion: reduce` | Explicit `animation: none` on `.hero__graph`; no draw. |
| ≤900px | Graph is already hidden; no animation. |
| Print | The bridge band was added to the `@media print` hide list (V8); V9 removed the band and hides the feature plate instead. The graph is already hidden; page count unchanged. |
| Forced colours | The band's circles were hidden with the graphs (V8); V9 removed the circles and re-inks the plate's map instead. Rules use `CanvasText`; the link keeps an underline. |
| No JS | All three effects are CSS; the page is complete. |
| Counts | 21 cards, 20 teaching links, one `h1`, eight `.section-head`s, no new nav item, ids unchanged. |

The bridge band had to be added to the print hide list and (if its circles are
decorative) to the forced-colours hide list; V9 removed the band and carried the
same two decisions over to the feature plate. The graph needs the explicit
reduced-motion entry. These are the three places where a new decorative layer
usually leaks into print or forced colours.

## 8. Cost

| File | Change | Weight |
|---|---|---|
| `index.html` | bridge band markup, one link; one extra outcome action later | ~1.5KB |
| `css/custom-styles.css` | graph timeline, arrow fill, band, three fallback blocks | ~70 lines |
| `js/site.js` | none | 0 |
| requests / assets | none | 0 |

No new token, font, image, dependency or script. The parallax is one keyframe.

## 9. Verification

- Static invariants as in `AGENTS.md`, plus `git diff -- js/` empty.
- Browser at 320/360/420/900/901/1120/1440: `scrollWidth == clientWidth`; graph
  transform at scroll 0/300/600 measured after two rAFs; no new console message;
  no CLS.
- Reduced motion: computed transform is the base `translateY(-50%)` at every
  scroll position.
- Print: the band is absent, the hero is V7, the CV spine is complete, headings
  are black; page count unchanged.
- Forced colours: no circles, no graph; rules and link states use `CanvasText`.
- Keyboard: the band's link has a visible 2px `--action` ring at 3px offset; the
  register arrow focus is unchanged apart from the fill.
- No-JS: the band and hero are complete.

## 10. Phases

0. **Decision (no code):** licence and editorial gate for the storymap; see
   `storymap-draft.md` §2. Nothing downstream is safe before this.
1. **CV motion (2–3h):** graph drift, arrow fill, fallback blocks, invariant
   check.
2. **Storymap national essay (~12h, gated):** static HTML/CSS, no JS.
3. **Bridge band (3h):** only after `storymap.html` exists; add the link to the
   DERLA outcome at the same time.
4. **Optional:** retire the thumbnail scale, cross-document View Transition, or
   the Graz walk after editorial review. Pick one.

## 11. Open decisions

1. White bridge band? **Decided: white.** The band must not compete with the
   footer's blue field, and it sits between the register and the hire-relevant
   sections.
2. Keep the 1.025 thumbnail scale, or retire it once the arrow fills?
3. Add "Open the storymap" to the DERLA outcome as well as the band?
4. Is the graph drift enough, or does the owner want a second depth cue on the
   storymap page (a ≤32px map drift)? **Decided: no.** Desktop motion only, one
   depth cue on the CV; the storymap keeps a single scroll-driven progress rule.

## 12. Implementation record

Shipped 13 November 2026, in one working-tree change set (`index.html`,
`css/custom-styles.css`, new `storymap.html` + `tools/storymap/`, docs). No
commit or push yet.

**CV motion.** `.hero__graph` runs `hero-field-drift` on
`animation-timeline: scroll(root block)` with `animation-range: 0 90vh`,
`translateY(-50%)` → `calc(-50% - 48px)`, inside
`@supports (animation-timeline: scroll())` +
`prefers-reduced-motion: no-preference` + `min-width: 901px`. Measured in Chrome
at 1440×900: −330px at scroll 0, −347.8px at 300, −365.6px at 600 (48px over
90vh), and a constant −330px with `getAnimations().length === 0` under reduced
motion, so the explicit `animation: none` is doing the work the 0.01ms duration
override cannot.

**Register arrow.** `background-color` joined the transition on
`.project-card__arrow`; hover/focus fills the 40px circle with `--action` and
turns the arrow `--on-dark`. Border, fill and the 3px icon shift move together,
so the state is not colour-only. Forced colours drop the fill and keep the
border/underline/shift (unchanged from V7).

**Bridge band (removed in V9).** `.bridge` stood between `#portfolio-section`
and `#teaching-section`: white ground, 2px `--action` top rule, 1px `--rule`
bottom rule, serif `h2`, one factual standfirst, one outline pill to
`storymap.html`, two unfilled `--action` circles at 0.12 opacity cropped by
`overflow: hidden`. No id and no `.section-head`, so the section-head count stayed
eight. Circles hidden at ≤1120px, the whole band hidden in print, circles removed
in forced colours. Rendered height 397px at 1440px, 315px at 900px. V9 deleted the
markup, the §12 CSS block and the circles; `#storymap-feature` after the
credibility strip is its replacement.

**Storymap.** `storymap.html` is new: masthead, sticky chapter rail, four
chapters plus colophon, and an inline SVG of all 4,393 DERLA records (47KB at
first build; V9 deduplicated coincident positions to 18.5KB with a
pixel-identical picture). It loads **no JavaScript**; the only motion is a
scroll-driven 2px progress rule under the rail. The map and its prose come from
the data study in `storymap-draft.md`; the six-stop Graz walk is deferred and the
draft's chapter 05 (what the map cannot show) is now chapter 04. The generator
`tools/storymap/build_map.py` reproduces 4,399 extracted / 4,393 usable / 232
terror / 4,161 markers / 3,877 dated on every run and, since V9, splices the same
SVG into `storymap.html` **and** `index.html` between `map:begin` / `map:end`; a
double-projection bug in the first run (outline projected twice, empty view) is
fixed and documented in the script.

**Actual cost.** `js/site.js` untouched: still two `IntersectionObserver`s and
two `scroll` listeners, and no new scroll math. CSS grows by the CV motion
rules (~45 lines) and §19 storymap (~560 lines, scoped to `sm-*`/`map__*`); the
bridge band's ~90 lines were removed again in V9 and replaced by the plate block
in §8. At V8, `storymap.html` was 67KB raw / 16KB gzip; V9's dedupe brought it to
39KB raw / 11.8KB gzip, and `index.html` to 113KB raw / 23KB gzip with the second
map inline. No images, and no requests beyond the two fonts and the stylesheet.
No new token, font, image, dependency or script on either page.

**What was cut, and why.** The 600-dot constellation, the hero orbit and the
ultramarine interlude were dropped in the reviewer pass: they were page-wide
decoration, not one finite scene, and the interlude would have been a second
blue field. The storymap has no sticky map, no per-point interaction and no
pan/zoom: turning memorial records into a hover toy is the one thing the draft
rules out. The draft's `js/storymap.js` does not exist.

**Left as-is on purpose.** The 1.025 thumbnail scale stays (decision 2); it is
a register-only response and does not stack with the arrow fill. (V8 left the
DERLA outcome card without a second storymap link, decision 3; V9 has since added
a "Read the storymap" text link there, beside the feature plate.)

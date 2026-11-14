# Personal Website / Linked Data CV

The personal website of **Sebastian David Schiller-Stoff** — digital humanities,
research software engineering, digital archives, editions and Linked Data.

## Run locally

There is no build step. Serve the repository root:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

- `index.html` — the CV: hero with a six-route index and a two-paragraph lead,
  profile band, credibility strip, two feature plates (DERLA and MEMOR), three
  selected outcomes (DERLA, MEMOR, GAMS), capabilities, working method with its
  sustain note, project register, training (21 items), CV, contact, imprint and
  footer.
- `storymap.html` — a dependency-free data study of DERLA, “The Memory
  Landscape”: a national inline map of 4,393 records and four chapters. No
  JavaScript.
- `memor.html` — a dependency-free data study of MEMOR, the City of Graz's
  digital memorial book, “The Last Addresses”: a city inline map of 604 last
  addresses and five chapters. No JavaScript.
- `ai-agents.html` — the practice note “Agents with a brief.”: a bounded-worker
  method for AI agent engineering, with a five-row 2025–2026 Zenodo record. No
  JavaScript and no data-study furniture.
- `ai-coding.html` — the practice note “The assistant writes code. You sign
  it.”: the 2023–2025 coding-assistant workshop record, the UFBAS GPT-4 case
  and the FAIR-code limits. No JavaScript.
- `tools/` — two offline map generators (DERLA, MEMOR) whose committed SVG
  fragments are spliced into both hosts. Nothing runs at page load.
- `css/custom-styles.css` — the only stylesheet: the V7 “Blue ink” design system
  on the V4 structure and V6 motion, plus the shared `sm-*` shell for the two
  storymaps and the two practice notes. White canvas, one ultramarine accent,
  serif statements (wordmark, `h1`, `h2`, two editorial `h3` roles), pill
  controls, circle nodes and arrows, a rule-bounded evidence line, a rotating
  typed focus line, a six-route hero index, a finite printed-sheet hero scene,
  one-pass rule draws, a scroll-drawn CV spine, restrained hover/focus feedback,
  and a print stylesheet that produces a concise CV and report-style notes.
- `js/site.js` — progressive-enhancement behaviour: header state, non-modal
  navigation disclosure, scrollspy, project filters/load-more, the contact form,
  the rotating hero focus line with its pause control, arrival acknowledgement,
  copy e-mail and the decorative rule observer.
- `fonts/` — self-hosted IBM Plex Sans and Source Serif 4 (OFL).
- `images/` — WebP project imagery with 224px register derivatives, the hero
  portrait, the 192px award image, plus the social preview. The DERLA, MEMOR and
  GAMS outcomes each keep a 900px source; MEMOR is the whole-city data map,
  never a homepage screenshot. The two practice notes use the square portrait as their
  social card.

The page is designed to work with JavaScript disabled: content stays visible and
the full register of 23 projects and 21 teaching resources remains listed.
Interactive controls are revealed only when `site.js` is running. Motion is
decorative: the first hero phrase is already in the HTML and is only re-typed by
script, and `prefers-reduced-motion: reduce` removes every type, draw, spine fill
and settle. The hero and footer graphs, header progress rule, caret, arrival
rule and all motion classes are absent from print and forced-colours output.

## Motion

V7 is a skin: it changes colour, type and shape, not the motion vocabulary.
Motion is finite and answers an action:

- the hero focus line types, holds, erases and advances through its phrases,
  with a pause/resume control (WCAG 2.2.2), a reserved height so the CTAs never
  move, and rotation that stops when the tab is hidden or the hero is off screen;
- the hero scene — a printed-sheet grid, a ghost index card and two registration
  crosses — drifts 64/48/16px over the first 90vh where CSS scroll-driven
  animation is supported; the copy, index and profile band never move;
- section and delivery-path rules draw once when first scrolled into view;
- following a nav, footer or hero link draws the destination heading rule once;
- the header shows a CSS scroll-driven reading-progress rule where supported;
- the CV spine fills as the chronology is read and its markers resolve to blue,
  using `animation-timeline: view()` with a complete static fallback;
- the footer echoes the retired hero field with a smaller 9-node graph, drawn once;
- linked project and teaching rows respond on hover **and** `:focus-visible`
  (surface tint, 1.025 thumbnail scale, 3px arrow shift, underline);
- copy e-mail and form success answer with a drawn check; an in-flight submit
  shows a single sweeping rule, never a spinner;
- register filters cross-fade through the same-document View Transitions API
  where available and reduced motion is not requested; "load more" settles the
  new cards once.

The storymaps and practice notes add no motion beyond the rail's reading
progress; under reduced motion every item above is static.

## Deploy

The site is published from `master` via GitHub Pages. A push to `master`
publishes immediately; keep working on `redesign` until cutover.

Design rationale and history: `redesignv15.md` (proof-led outcomes, the approach
note and the register at 23), `redesignv14.md` (the AI practice: two index routes
and two practice notes), `redesignv13.md` (hero depth), `redesignv12.md` (the
six-route index), `redesignv11.md` (the commissionable practice and profile
band), `redesignv10.md` (MEMOR plate and page, the data study and its
limitations), `redesignv9.md` (DERLA plate on the CV), `redesignv7.md` (visual
direction and implementation record), `redesignv6.md` (motion record),
`redesignv5.md` (V5 record), `redesignv4.md` (evidence-first structure),
`redesignv3.md` (previous direction).
`design-refactor.md` is the implemented design-system refactor: nominal tokens for
type, spacing, radii and rules; a shared label and tag recipe; restrained blue
semantics; 4:3 outcome media; 224px register derivatives; and the
five-control filter taxonomy.

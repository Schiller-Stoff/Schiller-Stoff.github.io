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

- `index.html` — the single page: hero, credibility strip, selected outcomes,
  capabilities, working method, project register, knowledge transfer, CV, contact,
  imprint and footer.
- `css/custom-styles.css` — the only stylesheet: the V6 “The page answers”
  design system on the V4 structure. Institutional navy/blue palette, self-hosted
  sans typography, a rule-bounded evidence line, a rotating typed focus line, a
  finite hero scene (linked-data graph, panel settle), one-pass rule draws, a
  scroll-drawn CV spine, restrained hover/focus feedback, and a print stylesheet
  that produces a concise CV.
- `js/site.js` — progressive-enhancement behaviour: header state, non-modal
  navigation disclosure, scrollspy, project filters/load-more, the contact form,
  the rotating hero focus line with its pause control, arrival acknowledgement,
  copy e-mail and the decorative rule observer.
- `fonts/` — self-hosted IBM Plex Sans and Source Serif 4 (OFL).
- `images/` — WebP project imagery with 224px register derivatives, the hero
  portrait, the 192px award image, plus the social preview.

The page is designed to work with JavaScript disabled: content stays visible and
the full register of 21 projects and 20 teaching resources remains listed.
Interactive controls are revealed only when `site.js` is running. Motion is
decorative: the first hero phrase is already in the HTML and is only re-typed by
script, and `prefers-reduced-motion: reduce` removes every type, draw, spine fill
and settle. The hero and footer graphs, header progress rule, caret, arrival
rule and all motion classes are absent from print and forced-colours output.

## Motion

V6 keeps one signature scene and makes every other movement answer an action:

- the hero focus line types, holds, erases and advances through three statements,
  with a pause/resume control (WCAG 2.2.2), a reserved height so the CTAs never
  move, and rotation that stops when the tab is hidden or the hero is off screen;
- a 12-node linked-data SVG draws behind the profile, then stays still;
- the profile panel and hero eyebrow settle into place;
- section and delivery-path rules draw once when first scrolled into view;
- following a nav, footer or hero link draws the destination heading rule once;
- the header shows a CSS scroll-driven reading-progress rule where supported;
- the CV spine fills as the chronology is read and its markers resolve to blue,
  using `animation-timeline: view()` with a complete static fallback;
- the footer echoes the hero field with a smaller 9-node graph, drawn once;
- linked project and teaching rows respond on hover **and** `:focus-visible`
  (surface tint, 1.025 thumbnail scale, 3px arrow shift, underline);
- copy e-mail and form success answer with a drawn check; an in-flight submit
  shows a single sweeping rule, never a spinner;
- register filters cross-fade through the same-document View Transitions API
  where available and reduced motion is not requested; "load more" settles the
  new cards once.

## Deploy

The site is published from `master` via GitHub Pages. A push to `master`
publishes immediately; keep working on `redesign` until cutover.

Design rationale and history: `redesignv6.md` (current motion direction),
`redesignv5.md` (V5 record), `redesignv4.md` (evidence-first structure),
`redesignv3.md` (previous direction).
`design-refactor.md` is the implemented design-system refactor: nominal tokens for
type, spacing, radii and rules; a shared label and tag recipe; restrained blue
semantics; 4:3 outcome media; 224px register derivatives; and the
five-control filter taxonomy.

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
- `css/custom-styles.css` — the only stylesheet: the V4 “Evidence, clearly
  presented” design system, with an institutional navy/blue palette, self-hosted
  sans typography, a rule-bounded evidence line and a print stylesheet that
  produces a concise CV.
- `js/site.js` — progressive-enhancement behaviour: header state, non-modal
  navigation disclosure, scrollspy, project filters/load-more and the contact form.
- `fonts/` — self-hosted IBM Plex Sans and Source Serif 4 (OFL).
- `images/` — WebP project imagery with 224px register derivatives, the hero
  portrait, the 192px award image, plus the social preview.

The page is designed to work with JavaScript disabled: content stays visible and
the full register of 21 projects and 20 teaching resources remains listed.
Interactive controls are revealed only when `site.js` is running.

## Deploy

The site is published from `master` via GitHub Pages. A push to `master`
publishes immediately; keep working on `redesign` until cutover.

Design rationale and history: `redesignv4.md` (current), `redesignv3.md`
(previous direction). `design-refactor.md` is the implemented design-system
refactor: nominal tokens for type, spacing, radii and rules; a shared label and
tag recipe; restrained blue semantics; 4:3 outcome media; 224px register
derivatives; and the five-control filter taxonomy.

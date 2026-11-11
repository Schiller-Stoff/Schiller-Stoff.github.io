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

- `index.html` — the single page: hero, services, case studies, award, portfolio,
  teaching, CV, imprint, contact, footer.
- `css/custom-styles.css` — the only stylesheet: archival "Finding Aid" design
  tokens, ruled spine with section call numbers, flat entries and night bands.
- `js/site.js` — progressive-enhancement behaviour: mobile drawer, scrollspy,
  portfolio filters/load-more, reveal, header state and the contact form.
- `fonts/` — self-hosted Source Serif 4 and IBM Plex Mono (OFL).
- `images/` — WebP project and teaching imagery, plus the social preview.

The page is designed to work with JavaScript disabled: content stays visible and
the full portfolio remains listed. Interactive controls are revealed only when
`site.js` is running.

## Deploy

The site is published from `master` via GitHub Pages. A push to `master`
publishes immediately; work on `redesign` until cutover.

Design rationale and history: `redesignv3.md`.

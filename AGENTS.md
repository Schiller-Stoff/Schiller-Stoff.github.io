# AGENTS.md

## What this is

Static single-page personal site (Linked Data CV). There is no package manager, build, test, lint, or CI workflow; assets are served as plain files from the repo root. Origin is `Schiller-Stoff/Schiller-Stoff.github.io`, branch `master` (GitHub Pages settings are external to the repo).

## Source of truth

- `index.html` (~1,900 lines): the whole site. Search by section id, but beware commented-out duplicate blocks (old `#services-section` and old `#posts`).
- `css/style.css`: the loaded stylesheet and de facto source. Custom blocks are interleaved with template output and are not present in `scss/`; edit this file directly.
- `scss/` + `prepros-6.config`: stale. Prepros references a missing `css/scss/` tree; regenerating `css/style.css` from `scss/` would drop current custom CSS.
- `js/custom.js`: most behavior; Typed.js (hero text) and Bootstrap tooltips are initialized inline in `index.html`. Vendor libraries are checked into `js/`; there is no bundler.
- `images/{portfolio,teaching,profile,svg,announcement}/` and `fonts/` are static assets. `static/img/` is unused; placeholder `index.html` files in `css/`, `js/`, `scss/`, and `fonts/` are not pages.

## Editing gotchas

- Nav links use `index.html#<id>`. `#teaching-section` is an empty anchor; live teaching content is `#teaching-section-real`.
- Two different grids:
  - Portfolio: `.portfolio-item` cards driven by `.filter-btn` + `#load-more` (plain DOM logic at the end of `js/custom.js`).
  - Teaching: legacy Isotope `#posts` grid with `.item`/`.isotope-item` (jQuery logic near the top of `js/custom.js`). The legacy `#filters` UI is absent from the live DOM, so teaching filtering is dead code.
- `.portfolio-item` needs filter classes (`web`, `research`, `tool`, `teaching`, `document`) to appear under the filters.
- Known broken/duplicate references: `css/custom-styles.css` is linked but missing; `css/style.css` references missing `images/dots.png`; Typed.js is included twice; `js/custom.js` calls `.jarallax()` but `jarallax.min.js` is not loaded.
- CDN dependencies (Google Fonts, Font Awesome 6.7.2, Typed.js) require network. The hero paragraph is blank without Typed.js.
- Prefer vendored local copies for new third-party assets; do not add a build/bundler step.
- `google9857a7b25fe89ee0.html` is Search Console verification; leave it in place.
- `opencode.jsonc` contains a plaintext API key and is not covered by `.gitignore`. Check `git status` before broad staging; do not commit it.

## Verify

No automated checks exist. Serve the repo root and inspect manually:

```bash
python3 -m http.server 8000
# http://localhost:8000 — check console and Network for 404s
```

Treat a push to `master` as publishing the live site (no CI workflow in repo; confirm Pages settings in GitHub if unsure).

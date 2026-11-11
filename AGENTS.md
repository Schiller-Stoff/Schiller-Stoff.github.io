# AGENTS.md

## What this is

Static single-page personal site (Linked Data CV) for Sebastian David Schiller-Stoff. There is no package manager, build, test, lint, or CI workflow; assets are served as plain files from the repo root. Origin is `Schiller-Stoff/Schiller-Stoff.github.io`; `master` is the published branch (GitHub Pages settings live outside the repo).

## Source of truth

- `index.html` (~1,540 lines): the whole page. Sections are identified by id and carry a `data-callno` attribute that paints the archival call number in the ruled spine on wide screens.
- `css/custom-styles.css`: the only stylesheet and the de facto source. It starts with a single `:root` token block (the five-colour palette — lilac ash, almond silk, alabaster grey, ash grey, thistle — plus ink, signal, night band, two typefaces, 2px radius and rail metrics). Edit this file directly.
- `js/site.js`: all behaviour, vanilla JavaScript, loaded with `defer`. Guarded modules: footer year, header scroll state, mobile drawer, scrollspy, portfolio filters/load-more, fail-safe reveal, Formspree form.
- `fonts/`: two self-hosted OFL woff2 files — `source-serif-4.woff2` (variable 400–600) and `ibm-plex-mono-400.woff2`. No CDN fonts.
- `images/`: WebP assets only, including the hero portrait in `images/profile/`, plus `og-cover.jpg` for social previews. No vendor CSS/JS, SCSS, icon fonts, or unused image trees remain.
- `redesignv3.md` is the design rationale/history. `REDESIGN-PLAN.md` and `redesignv2.md` are superseded.

## Editing gotchas

- **No build step.** Change `index.html`, `css/custom-styles.css`, and `js/site.js` directly. Do not introduce a bundler.
- **Fail-safe reveal:** `.reveal` is visible by default. `site.js` adds `html.reveal-ready` only after the observer is attached, so deleting or breaking `site.js` cannot hide content.
- **Interactive controls:** `.filters` and `.work-more` are hidden until `site.js` adds `html.js-ready`; without JS the full portfolio is visible and the controls stay hidden.
- **Portfolio:** each `.work-card` needs `data-categories` (`web`, `research`, `tool`, `teaching`, `document`) to appear under a filter. The page size is 9; the load-more label is rewritten from the visible counts. Catalogue numbers come from the `data-no` attribute on `.work-card__body`, so they stay stable when cards are filtered.
- **Mobile navigation:** the base CSS keeps navigation in flow (usable without JS). With JS, `html.nav-ready` turns the menu into a drawer. `aria-expanded`, Esc and focus return are handled in `site.js`; scroll locking follows `html.nav-open` in CSS.
- **Ruled spine:** at `min-width: 1000px`, every `.section` paints the vertical rule and `.section-head[data-callno]` prints the call number in the rail. The hero is not a `.section` and has no rail.
- **German content:** German headings/cards carry `lang="de"`; preserve it when editing.
- **Images:** use WebP (keep width/height attributes). `og-cover.jpg` is the only intentional non-WebP content image.
- `google9857a7b25fe89ee0.html` is Search Console verification; leave it in place.
- `opencode.jsonc` contains a plaintext API key and is not covered by `.gitignore`. Check `git status` before broad staging; do not commit it.

## Verify

No automated suite exists. Serve the repo root and inspect manually:

```bash
python3 -m http.server 8000
# http://localhost:8000 — check console and Network for 404s
```

Useful invariants:

```bash
grep -c 'class="work-card"' index.html                 # 21
grep -c 'class="teach-card reveal"' index.html         # 20
grep -c '<h1' index.html                               # 1
grep -oE 'https://doi.org/[^"]+' index.html | sort | uniq -d   # no duplicate DOIs
grep -nE 'manrope|inter-var|pt-mono|site\.js' css/ index.html  # only js/site.js
```

Also check all local `src`/`href`/`url()` targets exist, and test keyboard navigation, every filter, load-more to 21, the drawer at 360px, and the form states. `opencode.jsonc` must never be staged. Treat a push to `master` as publishing the live site.

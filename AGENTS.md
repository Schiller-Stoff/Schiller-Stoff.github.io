# AGENTS.md

## What this is

Static single-page personal site (Linked Data CV) for Sebastian David Schiller-Stoff. There is no package manager, build, test, lint, or CI workflow; assets are served as plain files from the repo root. Origin is `Schiller-Stoff/Schiller-Stoff.github.io`; `master` is the published branch (GitHub Pages settings live outside the repo).

The shipped design is V4, “Evidence, clearly presented”: a neutral institutional palette, sans-led typography, and evidence-first hierarchy aimed at research directors, programme managers, cultural-heritage institutions and hiring managers. `redesignv4.md` is the design rationale; `redesignv3.md` is the previous direction and `redesignv2.md` / `REDESIGN-PLAN.md` are superseded history.

## Source of truth

- `index.html` (~1,500 lines): the whole page. Sections in order: hero (`#top`), credibility strip, selected outcomes (`#case-studies-section`, with the `#announcements` alias), capabilities (`#services-section`), working method (`#approach-section`), project register (`#portfolio-section`), knowledge transfer (`#teaching-section`), CV (`#cv-section`), contact (`#contact-section`), imprint (`#imprint-section`), footer. All ids and the fragment links between them are part of the public contract — do not rename them.
- `css/custom-styles.css`: the only stylesheet and the de facto source. It starts with one `:root` token block (surfaces, ink, navy/action/positive/error, on-dark footer colours, two typefaces, six text sizes plus six display roles, five leading and three tracking roles, an eight-step 4px spacing scale, 4px/6px radii and a circle, 1px/2px rules, one header shadow token, motion). Edit this file directly; do not add a second stylesheet.
- `js/site.js`: all behaviour, vanilla JavaScript, loaded with `defer`. Guarded modules: footer year, header scroll state, non-modal mobile navigation, scrollspy, project filters/load-more, Formspree form.
- `fonts/`: two self-hosted OFL woff2 files — `ibm-plex-sans.woff2` (variable 400–600, the UI face) and `source-serif-4.woff2` (variable, used only for the serif emphasis inside the `h1`). No CDN fonts, no mono face.
- `images/`: WebP content assets plus `og-cover.jpg` for social previews. The hero portrait is `images/profile/sebastian-stoff.webp`.
- `redesignv4.md` is the current rationale and verification plan. `design-refactor.md` is the implemented design-system refactor: tokens, labels/tags, colour semantics, media derivatives, register density, filters and code cleanup. It is the reference for the final token values and component decisions.

## Editing gotchas

- **No build step.** Change `index.html`, `css/custom-styles.css`, and `js/site.js` directly. Do not introduce a bundler, framework, package manager, or CDN dependency.
- **No reveal animation.** Content is never hidden pending JavaScript. The only progressive-enhancement switch is `html.js-ready`, added at the top of `site.js`.
- **Interactive controls:** `.filters` and `.work-more` are hidden until `site.js` adds `html.js-ready`; without JS all 21 project records are visible and the filter/load-more controls stay hidden.
- **Project register:** each record is `article.project-card[data-project-item]` with `data-project-id` and `data-categories` (subset of `platform`, `research`, `tool`, `knowledge`; the former `review` record is now `research`). Exactly one `<a class="project-card__link">` per card. The page size is 9; the count text and load-more label are derived from the visible totals. Order is editorial — do not sort or shuffle cards. Five filters remain: All work, Platforms, Research, Tools, Teaching.
- **Knowledge transfer:** 20 `a.teaching-item` links plus one `article.publication-highlight`. These are static; no filters apply.
- **Mobile navigation:** base CSS keeps navigation in flow (usable without JS). At `max-width: 900px`, `html.nav-ready` turns the menu into a **non-modal disclosure** below the fixed header. There is intentionally no focus trap and no scroll lock; Esc, light-dismiss, `aria-expanded` and focus transfer to the target section are handled in `site.js`.
- **Scrollspy:** a rAF-throttled `getBoundingClientRect()` pass on scroll/resize sets `aria-current="location"` on the three primary nav links. No IntersectionObserver, so short or zoomed sections cannot drop the current marker.
- **Evidence line:** `.evidence-band[role="group"]` holds four `.evidence-item` blocks (Role, Scope, Result, Evidence) inside each selected outcome. Because it sits inside a half-width outcome column, it is a 2×2 grid down to 640px, then a single column with a blue left rule. Keep exactly four items per band.
- **Layout breakpoints:** 1120px (hero density; register media 88px), 900px (navigation disclosure, one-column grids; register media 84px), 640px (stacked strips, single-column evidence, 3-column filter grid), 420px (small phones; register media 72px). The project register stays 2-up above 900px because long titles become unreadable in three columns.
- **German content:** German headings/cards carry `lang="de"`; preserve it when editing.
- **Images:** use WebP (keep width/height attributes). `og-cover.jpg` is the only intentional non-WebP content image. Register thumbnails are `images/portfolio/thumbs/*-224.webp`, served via `srcset`/`sizes`; the 900px sources stay in the repo for the three outcome images only. The award note uses `images/announcement/ann02-192.webp`. Derivatives are generated once with Pillow, not at runtime.
- **Print** is a feature: browser print produces a concise CV. It keeps the profile identifiers, outcomes, capabilities, method, CV and contact; it hides the project register, teaching list, form, footer and imprint, and prints capabilities/tag groups as two-column grids.
- **Forced colours and reduced motion** have explicit blocks at the end of the stylesheet. State must never depend on colour alone (selected filters gain an underline in forced-colours mode).
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
grep -c 'class="project-card"' index.html                 # 21
grep -c 'class="teaching-item"' index.html                # 20
grep -c '<h1' index.html                                  # 1
grep -oE 'https://doi.org/[^"]+' index.html | sort | uniq -d   # no duplicate DOIs
grep -nE 'plex-mono|manrope|inter-var|pt-mono' css/ index.html  # no output
grep -n 'site\.js' index.html                             # only js/site.js
gjs js/site.js                                            # stops at "document is not defined": syntax is valid

# no raw font sizes outside the token block (print pt is allowed)
grep -n 'font-size:' css/custom-styles.css | grep -v 'var(--text' | grep -v 'var(--display' | grep -v 'pt'
# no legacy or hardcoded radii
grep -nE 'border-radius:\s*(3px|4px|6px|10px|50%)' css/custom-styles.css
```

Also check all local `src`/`href`/`url()` targets exist, ids are unique, every fragment link resolves, and test keyboard navigation, every filter, load-more to 21, the navigation disclosure at 360px, the form states, forced-colours mode, and print preview. `opencode.jsonc` must never be staged. Treat a push to `master` as publishing the live site.

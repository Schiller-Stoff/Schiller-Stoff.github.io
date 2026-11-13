# AGENTS.md

## What this is

Static single-page personal site (Linked Data CV) for Sebastian David Schiller-Stoff. There is no package manager, build, test, lint, or CI workflow; assets are served as plain files from the repo root. Origin is `Schiller-Stoff/Schiller-Stoff.github.io`; `master` is the published branch (GitHub Pages settings live outside the repo).

The published design is V4, “Evidence, clearly presented”: a neutral institutional palette, sans-led typography, and evidence-first hierarchy aimed at research directors, programme managers, cultural-heritage institutions and hiring managers. The `redesign` branch adds V5, “Living evidence”: one finite hero scene (typed sentence, linked-data graph, profile settle), one-pass structural rule draws, and restrained interaction feedback layered on the unchanged V4 structure. V6, “The page answers”, promotes the typed line to a rotating, pausable focus line, adds arrival acknowledgement, copy/submit feedback, a scroll-drawn CV spine and a footer graph bookend. `redesignv6.md` is the current motion rationale; `redesignv5.md` is the V5 record; `redesignv4.md` is the structural rationale; `redesignv3.md` is the previous direction and `redesignv2.md` / `REDESIGN-PLAN.md` are superseded history.

## Source of truth

- `index.html` (~1,500 lines): the whole page. Sections in order: hero (`#top`), credibility strip, selected outcomes (`#case-studies-section`, with the `#announcements` alias), capabilities (`#services-section`), working method (`#approach-section`), project register (`#portfolio-section`), knowledge transfer (`#teaching-section`), CV (`#cv-section`), contact (`#contact-section`), imprint (`#imprint-section`), footer. All ids and the fragment links between them are part of the public contract — do not rename them.
- `css/custom-styles.css`: the only stylesheet and the de facto source. It starts with one `:root` token block (surfaces, ink, navy/action/positive/error, on-dark footer colours, two typefaces, six text sizes plus six display roles, five leading and three tracking roles, an eight-step 4px spacing scale, 4px/6px radii and a circle, 1px/2px rules, one header shadow token, motion). Motion tokens are `--dur-fast`/`--dur-base`/`--dur-draw`/`--dur-scene`/`--dur-arrive`/`--dur-sweep`/`--dur-press`, `--ease-standard`/`--ease-enter` and `--shift-sm` (3px)/`--shift-md` (6px); `--dur` and `--ease` remain aliases for V4 component transitions. Edit this file directly; do not add a second stylesheet.
- `js/site.js`: all behaviour, vanilla JavaScript, loaded with `defer`. Guarded modules: footer year, header scroll state, non-modal mobile navigation, scrollspy, project filters/load-more, Formspree form, rotating hero focus line, arrival acknowledgement, copy e-mail, decorative rule observer.
- `fonts/`: two self-hosted OFL woff2 files — `ibm-plex-sans.woff2` (variable 400–600, the UI face) and `source-serif-4.woff2` (variable, used only for the serif emphasis inside the `h1`). No CDN fonts, no mono face.
- `images/`: WebP content assets plus `og-cover.jpg` for social previews. The hero portrait is `images/profile/sebastian-stoff.webp`.
- `redesignv5.md` is the current motion rationale and verification plan (status, decision log and remaining manual matrix at the top and in the appendix). `redesignv4.md` is the V4 structural rationale. `design-refactor.md` is the implemented design-system refactor: tokens, labels/tags, colour semantics, media derivatives, register density, filters and code cleanup. It is the reference for the base token values and component decisions.

## Editing gotchas

- **No build step.** Change `index.html`, `css/custom-styles.css`, and `js/site.js` directly. Do not introduce a bundler, framework, package manager, or CDN dependency.
- **No content reveal.** Content, images, evidence and controls are never hidden pending JavaScript or scroll; the only progressive-enhancement switch for controls is `html.js-ready`. Motion may gate **decorative ink only**: `html.motion-ready` (added by `initDrawnRules`) hides the evidence-band rule, the delivery-path rule, section eyebrow markers and the footer graph until an `IntersectionObserver` adds `.is-drawn`, and the observer unobserves each target after one pass. `html.typed-ready` (added by `initTypedFocus`) reveals the caret and the pause control; without it the first phrase is a complete static line. Never add a page-wide scroll-reveal system, parallax, count-up metrics or perpetual animation. The only `infinite` animations are the caret blink (removed when rotation settles) and the submit sweep, which exists only while `is-sending` and is not applied under reduced motion.
- **Hero typed focus line:** only `.hero__focus-line` rotates; `h1` stays static. The visible span is always `aria-hidden` and one `.visually-hidden` sentence carries the same claim for assistive technology. `initTypedFocus()` reads the other phrases from `<script type="application/json" data-typed-phrases>`, reserves the tallest phrase height on `.hero__focus-line` before clearing the span, types at 26 ms (140 ms after `[.,;:—–·]`), holds 6 s, erases at 12 ms and advances. It never simulates mistakes and never loops without the control. Rotation stops when the tab is hidden, the hero is off screen (one `IntersectionObserver` on `#top`), reduced motion is requested, or the user pauses; the pause control completes the current phrase and swaps its label/icon. Reduced motion, print and a module failure all leave phrase 1 as a complete static line with no caret and no button.
- **Arrival acknowledgement:** `initArrival()` delegates one `click` listener for fragment links inside `.nav`, `.footer-nav` and `.hero__actions`, adds `.is-arrived` to the destination section for 900 ms, and forces a reflow so a repeated click restarts the 700 ms rule draw under the `h2`. If the target is off screen it waits for one `scrollend` (900 ms fallback) so the smooth scroll does not spend the draw; that listener is transient, not scroll math. It never moves focus, never runs on load, the skip link or reduced motion, and removes its own class.
- **Copy e-mail:** `initCopyEmail()` reveals the button, uses `navigator.clipboard.writeText` with a hidden-textarea `execCommand` fallback, swaps Copy → Copied with a drawn check for 2 s, and never replaces the `mailto:` link.
- **Scroll-drawn CV spine:** `.cv-list::before` fills and `.cv-entry::before` markers resolve from rule grey to action blue with `animation-timeline: view()` only, inside `@supports` and `prefers-reduced-motion: no-preference`. Without support, on ≤900px, in print and under reduced motion the spine is a complete static rule.
- **Footer graph:** a 9-node/10-edge inline SVG echo of the hero field, `aria-hidden`, `pointer-events: none`, drawn once by the shared rule observer, hidden at ≤900px, in print and in forced colours. It must never change footer dimensions.
- **Hero graph:** inline SVG in `.hero__graph`, 12 nodes/15 edges, `aria-hidden`, `pathLength="1"` with a `stroke-dashoffset` draw, `pointer-events: none`, hidden at `max-width: 900px`, in forced colours and in print. It must never change the hero's dimensions.
- **Interactive controls:** `.filters` and `.work-more` are hidden until `site.js` adds `html.js-ready`; without JS all 21 project records are visible and the filter/load-more controls stay hidden.
- **Project register:** each record is `article.project-card[data-project-item]` with `data-project-id` and `data-categories` (subset of `platform`, `research`, `tool`, `knowledge`; the former `review` record is now `research`). Exactly one `<a class="project-card__link">` per card. The page size is 9; the count text and load-more label are derived from the visible totals. Order is editorial — do not sort or shuffle cards. Five filters remain: All work, Platforms, Research, Tools, Teaching.
- **Knowledge transfer:** 20 `a.teaching-item` links plus one `article.publication-highlight`. These are static; no filters apply.
- **Mobile navigation:** base CSS keeps navigation in flow (usable without JS). At `max-width: 900px`, `html.nav-ready` turns the menu into a **non-modal disclosure** below the fixed header. There is intentionally no focus trap and no scroll lock; Esc, light-dismiss, `aria-expanded` and focus transfer to the target section are handled in `site.js`.
- **Scrollspy:** a rAF-throttled `getBoundingClientRect()` pass on scroll/resize sets `aria-current="location"` on the three primary nav links. No IntersectionObserver, so short or zoomed sections cannot drop the current marker. There are exactly two `IntersectionObserver`s in `site.js`: `initDrawnRules` (decorative rules and the footer graph, one pass each) and `initTypedFocus` (hero on/off screen, to gate rotation). Neither does per-frame work.
- **Evidence line:** `.evidence-band[role="group"]` holds four `.evidence-item` blocks (Role, Scope, Result, Evidence) inside each selected outcome. Because it sits inside a half-width outcome column, it is a 2×2 grid down to 640px, then a single column with a blue left rule. Keep exactly four items per band.
- **Layout breakpoints:** 1120px (hero density; register media 88px), 900px (navigation disclosure, one-column grids, hero and footer graphs removed, CV spine static; register media 84px), 640px (stacked strips, single-column evidence, 3-column filter grid), 420px (small phones; register media 72px). The project register stays 2-up above 900px because long titles become unreadable in three columns.
- **German content:** German headings/cards carry `lang="de"`; preserve it when editing.
- **Images:** use WebP (keep width/height attributes). `og-cover.jpg` is the only intentional non-WebP content image. Register thumbnails are `images/portfolio/thumbs/*-224.webp`, served via `srcset`/`sizes`; the 900px sources stay in the repo for the three outcome images only. The award note uses `images/announcement/ann02-192.webp`. Derivatives are generated once with Pillow, not at runtime.
- **Print** is a feature: browser print produces a concise CV. It keeps the profile identifiers, outcomes, capabilities, method, CV and contact; it hides the project register, teaching list, hero typed line, typed toggle, hero graph, footer graph, caret, form, footer and imprint, and prints capabilities/tag groups as two-column grids. Every animation and transition is neutralised in print and the pseudo-element rules are forced to `transform: none`, so a rule never prints half-drawn; the CV spine prints as one complete black rule with black markers.
- **Forced colours and reduced motion** have explicit blocks at the end of the stylesheet. State must never depend on colour alone (selected filters gain an underline in forced-colours mode, form success gains a check icon). The hero wash, hero graph, footer graph and header progress line are removed in forced colours; caret, arrival rule, CV spine and markers, copy check and typed toggle use `CanvasText`. Under `prefers-reduced-motion: reduce` there is no typing, caret, arrival draw, graph draw, rule draw, spine fill, settle, thumbnail scale, icon shift or View Transition.
- **Register transitions:** filter changes run the synchronous `apply()` inside `document.startViewTransition` only when available and reduced motion is not requested (`view-transition-name: register` on `.project-grid`, root cross-fade suppressed); otherwise they update instantly. "Load more" is not a reveal: newly shown cards get a one-shot `.is-settling` 4px settle.
- **Reading progress:** a 2px rule is drawn by a CSS scroll-driven animation on `.site-header::after` inside `@supports (animation-timeline: scroll())`. No JavaScript scroll math and no new scroll listener.
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

# motion invariants
grep -n 'transition: all' css/custom-styles.css              # no output
grep -nE 'animation[^;]*infinite' css/custom-styles.css      # 2: caret-blink, sending-sweep (only while is-sending)
grep -nEi 'cdn|unpkg|jsdelivr|typed\.js|gsap|aos\.|scrollreveal' index.html css/*.css js/*.js  # no output
grep -c 'new window.IntersectionObserver' js/site.js         # 2: decorative rules, hero visibility
grep -nE 'addEventListener\("scroll"' js/site.js             # 2: header state and scrollspy only
grep -n 'animation-timeline: view' css/custom-styles.css     # CV spine only, inside @supports
```

Also check all local `src`/`href`/`url()` targets exist, ids are unique, every fragment link resolves, and test keyboard navigation, every filter, load-more to 21, the navigation disclosure at 360px, the form states, forced-colours mode, and print preview.

Motion checks need a real browser (none is available in this environment): load with JS disabled (phrase 1 complete, no caret, no toggle, all rules and the footer graph visible), with reduced motion (no typing, caret, draw, spine fill or settle at all), pause and resume with mouse and keyboard (phrase completes, caret stops, icon becomes play; resume waits one hold then moves on), toggle reduced motion mid-cycle (rotation settles to phrase 1), hide the tab mid-type (timers stop, no burst on return), scroll past the hero and back (rotation stops, then resumes), watch first load for layout shift in the hero (the reserved height must hold across all three phrases at 360/420/900/1120/1440), verify the graph at 901px and its absence at 900px, click nav and footer links (one arrival draw, focus unchanged), use copy e-mail (Copied, check draw, revert), submit the form (sending sweep, success check, error state), read the CV at 200% and 360px (spine complete, markers aligned, no sideways scroll), filter the register (cross-fade or instant), and print a page scrolled only to the top (below-fold evidence, delivery rules and CV spine must still print complete). `opencode.jsonc` must never be staged. Treat a push to `master` as publishing the live site.

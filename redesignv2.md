Redesign plan v2 — "digital craft" editorial
1. What the reference establishes
Design DNA: warm off-white canvas, oversized heavy grotesque headline with a two-tone split (ink navy → purple), calm grey-blue body copy at generous line-height, pill buttons (one filled navy, one outlined), and a single large organic illustration on the right with a soft shadow. Huge whitespace, no boxes, no gradients-as-decoration. Everything is quiet except the headline and the artwork.
Palette sampled from the image:
Token	Value	Use
--ink	#1b2240	headlines, filled button, nav
--ink-soft	#5b6478	body copy
--ink-muted	#8a90a3	meta, captions
--accent	#8b4aa5	headline highlight, links, focus ring
--accent-soft	rgba(139,74,165,.10)	chips, eyebrows
--bg	#f1f1f4	page
--surface	#ffffff	cards, form
--line	#dcdce3	borders
--navy	#232c4d	button fill (slightly lighter than ink)
accent set	lime #a8d33f, blue #6aa8e0, orange #f0a233, green #4f9e4a	category coding
The reference's four illustration colors map cleanly onto four capability areas in the Services section — that's the one place I'd let the palette get colorful.
Typography — reference is a heavy geometric grotesque (closest free match: Manrope ExtraBold, OFL, self-hostable) with a humanist sans for body (Inter or DM Sans). fonts/ only has icon fonts today, so this means adding two self-hosted families (not Google Fonts CDN) under fonts/. Keep PT Mono for eyebrows/dates/tags — it reinforces "digital handwork" and is already loaded.
Type scale (fluid, clamp):
- Display h1: clamp(2.6rem, 5vw, 4.3rem) / 1.03 / -0.02em / 800
- h2: clamp(1.9rem, 3vw, 2.6rem) / 1.1 / 800
- h3: 1.25rem / 700
- Lead: 1.125rem / 1.7 / --ink-soft
- Body: 1rem / 1.65
- Eyebrow/meta: .8rem mono, uppercase, .12em, purple
Components:
- .btn — pill, 48px min-height, 0 28px padding, 150ms, hover translateY(-1px) + soft shadow. Variants: navy filled / white outlined with --line.
- .card — white, 1px --line, radius 18px, no shadow at rest, hover shadow + purple border tint.
- .chip — pill, accent-soft background, accent text, mono, small.
- .section-head — left-aligned eyebrow → h2 → lead, max 60ch. (Reference is left-aligned; the current centered headers are the strongest "template" tell and should go.)
- One focus style everywhere: 2px purple ring, 2px offset.
Layout: 1200px container, 24px gutters, 12-col grid, section rhythm clamp(72px, 9vw, 128px), alternating --bg and --surface bands.
2. Hero: how to build it without copying the artwork
The reference illustration is a commissioned watercolor piece. Do not copy the file — instead build an original equivalent from your own material:
- A honeycomb of your 21 portfolio screenshots, clipped hexagons (clip-path: polygon(...)), arranged 3–4 columns, each tile tinted with one accent color via a mix-blend-mode: multiply/color overlay, with a dark navy hex-stroke frame and the same soft drop shadow.
- 1–2 tiles can be your portrait, so the hex becomes a portrait-of-the-work motif.
- Pure CSS + existing images; no new asset pipeline; degrades to a simple hex grid without JS.
- Fallback if it reads as busy: a single large hexagon containing one project screenshot, same treatment.
Hero copy, two-tone like the reference (English, since the site is English):
Digital craft from research,  
for everyone working with knowledge.
(accent on the second clause)
Then 2–3 lines of lead (your existing bio), two pill CTAs — "Explore my work" → #portfolio-section, "Get in touch" → #contact-section — and the social icons as a quiet row. Remove the Typed.js paragraph; static copy is faster, accessible, and matches the reference's calm.
3. Section-by-section mapping
1. Nav — transparent over the --bg hero, sticky + blurred --surface on scroll, navy wordmark, links --ink, purple-underline active state, pill "Get in touch" on the right, real mobile drawer. Replaces the inline-styled white bar and the floating #TEST button.
2. Services → "What I do" — 4 cards, each with one accent from the illustration set (top rule or icon tint): Research software engineering, Digital archives, Digital editions / Linked Data, AI & LLM workflows. Left-aligned header, first-person copy.
3. Case studies — keep the four projects but drop the tab UI in favour of stacked feature rows (text left, screenshot in a hex/rounded frame right, alternating sides). That mirrors the reference's text/visual rhythm better than tabs and fixes the #prices nesting bug.
4. Portfolio — warm --bg band, white cards, 4:3 media (source images are ~4:3, so no awkward crops), mono category chips, filter bar as pills (active = navy). Keep filter + load-more, move to js/site.js, delete the nth-child mobile hack.
5. Teaching — same card component, 3-col; DOI + year + type chip; Isotope/jQuery removed entirely.
6. CV — timeline on a purple 2px rail, mono dates in --ink-muted, white entry cards; "Current position" as a navy filled card with white text (single moment of high contrast); replace percentage skill bars with tag groups unless you want them back.
7. Announcements — one full-width navy band: award year, title, link. Compact, no separate section header.
8. Imprint / Contact — white surface, form fields 12px radius, purple focus ring, labels above inputs, Formspree kept; contact details in a 2×2 mini-grid with purple icons.
9. Footer — light, mono small print, nav + socials + imprint link. Keep the CC BY / Untree attribution unless you confirm the license allows removal.
4. Revised execution order
Phase 0 — Baseline (same as before: branch redesign, screenshots, 404/console baseline, content inventory).
Phase 1 — Foundation
1. Add self-hosted Manrope + Inter to fonts/ (woff2 + woff), font-display: swap.
2. Create css/custom-styles.css (already linked, currently 404) with :root tokens, reset, type scale, layout primitives, buttons, chips, cards, forms, utilities.
3. Verify tokens on a bare test block before touching sections.
Phase 2 — Structure cleanup (unchanged from v1): delete commented duplicates, fix the 6 stray </div>s, un-nest #case-studies from #prices, canonicalize anchors, remove inline styles, one <h1>, skip link.
Phase 3 — Rebuild order (each = markup → CSS → interaction):
nav → hero + hex mosaic → services → case studies → portfolio → teaching → CV → announcements → contact → footer.
Do the hero first and compare it side-by-side with the reference; if the hero's weight, spacing, and button language match, the rest follows the tokens.
Phase 4 — JS — js/site.js: nav, scrollspy, filters, load-more, form states, reveal via IntersectionObserver. Then remove unused vendor libs one at a time (Owl, Fancybox, Isotope, ScrollMagic, TweenMax, AOS, Waypoints, animateNumber, circle-progress).
Phase 5 — Assets/perf — WebP variants, width/height, loading="lazy", drop the dots.png reference, dedupe Typed.js.
Phase 6 — A11y/SEO — contrast ≥ 4.5:1, keyboard paths, aria-pressed on filters, real alt text, Person JSON-LD, single <title>.
Phase 7 — QA — 360/768/1024/1440, Chrome/Firefox/Safari, reduced motion, JS off, all filter states, Formspree, then merge deliberately.
5. Acceptance criteria for "matches the reference"
- Hero: off-white canvas, two-tone 800-weight headline, exactly two pill CTAs, one large right-hand visual with soft shadow, no cards, no gradients behind text.
- Body text is grey-blue, line-height ≥ 1.65, measure ≤ 70ch.
- Only three visual weights on the page: background, white surface, navy block. Purple is an accent, never a large fill.
- Zero inline styles; every color/space from a token.
- No section uses a centered "eyebrow + title + wave SVG" header.
6. Decisions I still need
1. Language — site is English, reference German. Confirm English (I'll keep the two-tone headline structure).
2. Hero visual — approve the hex-mosaic-from-your-screenshots approach, or prefer a single portrait/hex tile?
3. Bootstrap/jQuery — I recommend keeping the Bootstrap grid for speed but dropping jQuery-only plugins; say if you'd rather go full vanilla CSS grid.
4. Copy — may I rewrite the agency-style copy ("Award-winning software solutions…") into first-person and delete the Pricing stub?
5. Skill bars — keep or replace with tag groups?
Answer 1–2 and I can lock the hero spec; the rest can be decided during Phase 3.
# Redesign plan V5 — “Living evidence”

**Status:** implemented on the `redesign` branch (uncommitted; the user commits by
hand). No headless browser was available (Firefox headless cannot map a
framebuffer), so verification was static plus a local-server request check; the
manual browser matrix in §12 remains to be walked through. The decisions taken
during implementation are recorded in §16.  
**Date:** 12 November 2026  
**Branch:** `redesign`  
**Scope:** motion, interaction feedback and decorative visual depth in `index.html`,
`css/custom-styles.css` and `js/site.js`. No framework, package manager, build step,
CDN, analytics, canvas or WebGL.

> **Successor:** V6 “The page answers” (`redesignv6.md`) builds on this record. It
> replaces the one-pass `hero__note` typewriter with the rotating, pausable
> `.hero__focus` line, extends the rule observer to the footer graph, and adds
> arrival acknowledgement, copy/submit feedback and the CV spine. The V5 numbers,
> gating and fallbacks below still describe the baseline; where they name
> `initTypewriter` or `.hero__note`, read the V6 record.

V4 should remain the visual and structural foundation. V5 is not a replacement for
the evidence-first hierarchy; it adds a controlled sense of life around it.

---

## 1. Executive decision

The next iteration should feel **responsive, crafted and contemporary**, but not
like an animation demo. The site represents durable research infrastructure, so its
motion should look precise rather than playful.

Recommended direction:

1. Add one prominent, finite typewriter moment in the hero.
2. Introduce a small motion token system shared by every effect.
3. Add a decorative “knowledge graph” field behind the hero/profile that draws once
   and then becomes still.
4. Animate structural rules and state changes, not every paragraph or card.
5. Make interactive cards, links, buttons, filters and the mobile menu feel more
   tactile.
6. Use native browser features and small vanilla-JavaScript modules rather than an
   animation library.
7. Preserve complete HTML content, reduced motion, forced colours, print, no-JS and
   the existing static architecture.

The animation vocabulary is:

```text
TYPE       one finite hero typing sequence
DRAW       rules and graph edges reveal left-to-right
SETTLE     2–6px movement into place
RESPOND    immediate hover, focus and pressed feedback
```

No effect should run continuously after the opening sequence settles.

---

## 2. Bigger picture

```text
L0  CONTENT       final text and evidence always present in HTML
        ↓
L1  TOKENS        duration · easing · distance · opacity · depth
        ↓
L2  PRIMITIVES    caret · drawn rule · settle · surface response
        ↓
L3  COMPONENTS    hero type · graph field · button · card · menu · filter
        ↓
L4  PATTERNS      opening scene · section arrival · result transition
        ↓
L5  PAGE          lively at first contact, quiet and readable at rest
```

At rest, the page should still read as V4. Motion helps users understand hierarchy
and interaction; it must not become the hierarchy itself.

### Page motion map

```text
HEADER       scroll progress + nav underline + menu settle
HERO         typewriter + one-shot knowledge-graph draw + profile settle
PROOF        static facts; no count-up
OUTCOMES     section rule draw; restrained media frame response
EXPERTISE    structural grid response only; no card choreography
METHOD       delivery line draws through the four stages
REGISTER     filter/result transition + linked-card hover/focus
TEACHING     linked-row underline and arrow response
CV           static evidence; links respond, dates do not animate
CONTACT      field/focus/status feedback
FOOTER       static
```

---

## 3. Principles and invariants

### Keep from V4

- Static files, one stylesheet and one vanilla script.
- All existing ids, fragment links, content counts and editorial order.
- Full content without JavaScript.
- A concise static print CV.
- Visible focus and non-colour state indicators.
- No CDN assets or runtime network dependency.
- Images remain evidence, not decorative animation surfaces.

### Deliberate V5 revision

V4 prohibited reveal animation. V5 relaxes that rule only for **decorative ink and
small positional settling**. Core text, images, evidence and controls may never be
`display:none`, `visibility:hidden` or `opacity:0` while waiting for JavaScript or
scroll position.

### Restraint rules

- Maximum ordinary travel: `6px`; icon travel: `3px`.
- Maximum ordinary duration: `480ms`; hero graph may take up to `900ms` once.
- No bounce, elastic spring or large stagger.
- No perpetual typewriter loop.
- No autoplay carousel, marquee, particles, cursor follower, card tilt or 3D scene.
- No parallax or JavaScript writes on every scroll frame.
- No count-up metrics: evidence must be accurate immediately.
- No `transition: all`.
- Hover effects that communicate interaction must have a `:focus-visible`
  equivalent.

---

## 4. Bottom-up motion system

Add tokens to the existing `:root` block; do not create a second token layer.

```css
/* Motion — V5 */
--dur-instant: 100ms;
--dur-fast: 160ms;
--dur-base: 240ms;
--dur-draw: 420ms;
--dur-scene: 800ms;
--ease-standard: cubic-bezier(0.2, 0.7, 0.3, 1);
--ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
--shift-sm: 3px;
--shift-md: 6px;
--shadow-interactive: 0 10px 28px rgba(22, 50, 79, 0.10);
```

The existing `--dur` and `--ease` should either be migrated to these names or kept
as aliases during implementation. Do not leave two competing duration systems.

### Four primitives

| Primitive | Properties | Use |
|---|---|---|
| Type | `textContent`, caret opacity | Hero note only |
| Draw | `transform: scaleX()` or SVG `stroke-dashoffset` | Rules and graph edges |
| Settle | `transform: translateY(6px → 0)`; opacity remains at least `.88` | Hero/profile and optional section ornament |
| Respond | colour, border, background, shadow and ≤3px icon movement | Interactive elements |

Only `transform` and `opacity` should be used for scene animation. Width, height,
top, left, blur and background-position animations are excluded.

---

## 5. Hero opening scene

The hero receives the most animation because it is the only part every visitor sees.
The sequence should finish in roughly two seconds and then stop.

```text
0ms      complete h1, lead and actions are already readable
120ms    eyebrow marker draws in
180ms    profile panel settles upward by 6px
260ms    knowledge-graph edges draw behind the profile
420ms    hero note begins typing
~2100ms  final sentence and caret settle; scene becomes still
```

The sequence must not block clicks, scrolling or text selection.

### 5.1 Typewriter: recommended placement and behaviour

Keep the `h1` fully static. It is the primary claim and likely LCP element; typing
it would delay comprehension, cause repeated reflow and make the page feel like a
generic developer portfolio.

Animate only the existing hero note after the static location:

```text
Graz, Austria · Working with research and cultural institutions across Europe
                ^ this part types once
```

Recommended behaviour:

- One forward pass at `24–28ms` per character.
- Small punctuation pauses (`120–180ms`), not simulated random errors.
- No backspacing and no loop in the default design.
- Caret blinks only while typing, remains for about `400ms`, then disappears.
- If the tab becomes hidden or reduced motion is enabled during typing, immediately
  render the final sentence and stop all timers.
- The final sentence stays in the DOM after the effect; it is not periodically
  erased.

This is visibly “Typed.js-like” without making users wait through a rotating slogan.

#### Markup contract

The full final text remains the default HTML. JavaScript temporarily animates a
presentation copy; assistive technology receives one complete stable sentence.

```html
<p class="hero__note" data-typewriter>
  <svg class="icon" aria-hidden="true">…</svg>
  <span class="typewriter__prefix">Graz, Austria · </span>
  <span class="typewriter__text">Working with research and cultural institutions across Europe</span>
  <span class="typewriter__caret" hidden aria-hidden="true"></span>
</p>
```

The implementation must not use `aria-live`: announcing every partial word is noisy
and inaccessible. Before animation starts, JS creates a visually hidden complete
copy and sets only the changing visual span to `aria-hidden="true"`. At completion,
it restores the ordinary accessible text atomically.

Reserve the final line height so character insertion cannot move the CTAs or profile.

#### Typed.js library decision

Do **not** add Typed.js by default. The current Typed.js 3.0 release is GPL-3.0 and
offers separate commercial licensing; it also introduces a third-party runtime for
a single, small behaviour. Loading it from a CDN conflicts with this site's offline,
privacy and no-runtime-dependency architecture.

Recommended implementation: a guarded `initTypewriter()` module of roughly 45–60
lines in `site.js`.

If the exact library is explicitly required later:

1. confirm GPL-3.0 compatibility for the repository;
2. vendor and pin the unminified source locally (never use a CDN);
3. include its licence and attribution;
4. record the added transfer size and update surface;
5. still wrap it with the reduced-motion, visibility and accessibility behaviour
   above.

### 5.2 Decorative linked-data graph

Add a small inline SVG or local SVG asset behind the profile panel: approximately
8–12 nodes connected by thin rules. It should reference linked data and research
networks without becoming an illustration.

- Use `currentColor`/existing navy and rule colours.
- Keep contrast low; it is decorative and `aria-hidden="true"`.
- Draw edges once with `stroke-dashoffset`; nodes settle from `.9` scale to `1`.
- Stop after the opening sequence; no floating nodes.
- Hide it below 900px if it crowds the hero.
- Hide it in print and forced-colours mode.
- With reduced motion, render the final static graph or omit it entirely.
- No canvas, animation package or pointer tracking.

The SVG should sit in a bounded pseudo-layer with `pointer-events:none` and must not
increase the hero's dimensions.

### 5.3 Profile panel

The profile panel may settle upward by 6px on first paint and gain a slightly stronger
rule/shadow on hover only if the pointer is over an actual link inside it. The portrait
itself remains static; do not pulse, rotate or parallax a professional photograph.

---

## 6. Structural and interaction effects

### 6.1 Header and reading progress

Add a 2px page-progress rule at the bottom of the fixed header. Prefer native CSS
scroll-driven animation inside `@supports (animation-timeline: scroll())`; browsers
without support simply omit it.

- Same blue as current navigation state.
- Decorative only; never announced.
- No JavaScript scroll calculation or additional scroll listener.
- Hide in print and forced colours; reduced motion may keep a static rule or omit it.

The mobile navigation should fade/settle over `160–200ms`. Do not animate measured
height. Use the existing disclosure state and a short opacity/transform transition
only after `nav-ready` is set.

### 6.2 Section arrival

Use one shared `IntersectionObserver` only for decorative lines:

- section eyebrow square/rule;
- evidence-band top rule;
- delivery-path line;
- optional contact-section rule.

Text and images remain visible before observation. The observer adds `.is-drawn`,
then unobserves the element so the animation plays once. If `IntersectionObserver`
is unavailable, the rules stay fully visible.

Do not stagger every paragraph, list item, project card or CV entry.

### 6.3 Selected outcomes

Outcome media are evidence and are not full-card links, so they should not lift or
tilt. Give the frames only a restrained one-time treatment:

- border colour settles from `--rule` to `--rule-strong` as the structural rule draws;
- image remains at scale `1`;
- no sheen, parallax or crop animation.

Buttons and evidence links receive the shared interactive response: underline draw,
icon translation of 3px and surface/border transition.

### 6.4 Working method

The continuous navy delivery rule is the best place for a scroll-triggered drawing
effect. Draw the parent rule left-to-right once when roughly 25% is visible. Step
numbers may settle from 3px below with a very small `60ms` stagger, but all four titles
and descriptions remain visible throughout.

On small screens, where the method is one column, draw the vertical/left structural
rule top-to-bottom or leave it static. Do not force the desktop horizontal metaphor
onto mobile.

### 6.5 Project register

Project cards are full links and may be the most tactile repeated element:

- hovered/focused card background moves to `--surface`/`--surface-muted`;
- thumbnail scales to at most `1.025` inside its clipped frame;
- arrow moves right by 3px;
- title underline or colour transition remains the strongest signal;
- optional interactive shadow uses `--shadow-interactive`, never a vertical card lift.

Filtering should update immediately. Wrap the existing synchronous `apply()` call in
the same-document View Transitions API when available and reduced motion is not
requested. There is no polyfill and no delayed exit animation. Unsupported browsers
keep today's instantaneous behaviour.

Newly loaded records may settle by 4px over `180ms` in response to the explicit
“Load more” action; they must not wait for a scroll observer.

### 6.6 Teaching, CV and links

- Teaching rows: animated underline and arrow shift because the entire row is a link.
- CV entries: no entrance animation; credentials should be immediately scannable.
- Inline links: draw underline from left to right on hover/focus while preserving a
  visible default underline where needed for recognition.
- External-link icons: translate by at most `2px` diagonally.
- Dates, project counts and award evidence never count up or flicker.

### 6.7 Contact form

- Focus: existing border/focus ring plus a `160ms` surface transition.
- Submit: immediate disabled state and a small static inline progress mark; no infinite
  spinner is necessary for this short request.
- Success: status panel settles by 3px and remains fully readable.
- Error: no shaking; use existing text, border and `aria-invalid` state.

---

## 7. Static visual polish

Animation alone will not make the page visually richer. Add restrained depth that
still looks correct in a screenshot:

1. **Hero wash:** two static radial gradients using `--action-soft` and a very light
   navy tint, clipped to the hero. No moving gradient.
2. **Graph field:** the linked-data SVG from §5.2 provides a recognisable visual motif.
3. **Interactive depth:** one shared hover/focus shadow for linked cards and panels;
   content cards remain flat at rest.
4. **Rule continuity:** section and delivery rules use the same 2px visual grammar as
   the typewriter caret and nav underline.
5. **Typographic refinement:** retain balanced headings and use `text-wrap: pretty`
   for supported prose; this is progressive enhancement with no JavaScript.

Do not add glassmorphism, heavy gradients, noise textures or a second accent palette.

---

## 8. JavaScript architecture

Keep independent guarded modules in `site.js`:

```text
initYear
initHeader
initNav
initScrollspy
initPortfolio
initForm
initTypewriter        new
initDrawnRules        new; one observer
initMotionPreference new; shared query/helper if needed
```

### Shared motion contract

At startup:

```js
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
```

Each motion module checks the media query before allocating observers, timers or
view transitions. If the preference changes while an effect is running, settle every
element into its final state and stop the work.

Do not add a general animation framework or data-driven timeline engine. Explicit
small modules are easier to audit in this codebase.

### Enhancement classes

- `html.motion-ready`: JS motion modules successfully initialised.
- `.is-drawn`: a decorative rule finished/started its one-time reveal.
- `.is-typing`: hero typewriter currently active.
- Existing `js-ready`, `nav-ready`, `nav-open` and state classes remain unchanged.

Never use `motion-ready` to hide content.

---

## 9. Accessibility, fallback and lifecycle

### Reduced motion

`prefers-reduced-motion: reduce` means:

- no typewriter timer;
- no caret blink;
- no graph edge draw or node scale;
- no section/delivery rule draw;
- no View Transition;
- no thumbnail scale or icon translation;
- final content and decorative rules appear immediately.

Set transitions to `none`, rather than `0.01ms`, for V5-specific effects. Keep the
existing global compatibility block only if testing proves it is still needed.

### Forced colours

- Do not rely on shadows, gradients or opacity for state.
- The hero wash and graph disappear.
- Caret/rules use `CanvasText` if shown.
- Hover, focus and pressed states retain underline/border/weight indicators.

### No JavaScript and failures

- Full hero note is visible; no caret.
- Graph may be static CSS/SVG or absent.
- All structural rules are visible.
- Register remains fully visible and filters remain hidden, as today.
- There is no animation-related layout gap.

### Print

- Full final hero text.
- No caret, graph, progress line, gradients, motion classes or interactive shadows.
- Existing concise-CV section visibility remains unchanged.

---

## 10. Performance budget

V5 should add less than:

- **3 KB gzip JavaScript** for all new modules;
- **4 KB gzip CSS**;
- **8 KB gzip** for the decorative SVG, preferably less;
- **0 external requests**;
- **1 IntersectionObserver**;
- **0 new persistent scroll/resize listeners**;
- **0 animation work after the opening scene settles and the user stops interacting**.

Acceptance performance targets:

- no measurable CLS from typing or scene setup;
- hero animation does not delay LCP or input readiness;
- smooth interaction on a mid-range mobile device;
- no long task above 50ms introduced by V5;
- no observer watches an element after its one-shot animation completes.

---

## 11. Phased implementation plan

Each phase is reversible and should be reviewed before the next. Do not stage or
commit `opencode.jsonc`.

### Phase 0 — browser baseline and content decision

- Finish the outstanding V4 browser matrix first.
- Capture hero and key sections at 360, 420, 900, 1120 and 1440px.
- Record reduced-motion, forced-colours and print states.
- Confirm the exact hero sentence to type; the recommendation is the existing text,
  with no rotating alternatives.

**Gate:** V4 has no unresolved layout regression that motion would conceal.

### Phase 1 — tokens and interaction feedback

- Add motion/depth tokens.
- Normalize button, link, nav, project-card and teaching-row transitions.
- Add keyboard equivalents and remove any `transition: all`.
- Add the static hero wash.

**Gate:** page is visually improved with no JS changes and reduced motion remains
correct.

### Phase 2 — typewriter prototype

- Split hero-note markup without changing final text.
- Add `initTypewriter()` with stable screen-reader copy.
- Add caret styles, line reservation, visibility handling and preference-change stop.
- Test JS disabled and slow font loading.

**Gate:** zero CLS; sentence is immediately complete for reduced motion and assistive
technology; animation stops permanently.

### Phase 3 — hero graph and opening scene

- Draft the linked-data SVG from simple nodes/rules.
- Add one-shot edge/node animation.
- Coordinate profile settle and graph timing with CSS delays/tokens.
- Remove the graph below 900px if it competes with content.

**Gate:** hero still reads as institutional, not a generic technology landing page.

### Phase 4 — structural draws and register transitions

- Add one observer for decorative rules and delivery path.
- Add View Transition enhancement around register filter/load-more updates.
- Add thumbnail/arrow responses for linked cards.
- Add CSS-only header reading progress behind `@supports`.

**Gate:** filtering remains immediate and focus/count announcements remain correct.

### Phase 5 — accessibility and polish

- Re-test keyboard, 200% zoom, 360px reflow, reduced motion before load and toggled
  during typing, forced colours and print.
- Test backgrounding the tab during typing.
- Profile performance and confirm transfer budget.
- Remove any effect that distracts from the first outcome or creates persistent motion.
- Update `AGENTS.md`, `README.md` and the V5 decision log only after implementation.

---

## 12. Verification matrix

### Static checks

```bash
grep -nE 'cdn|unpkg|jsdelivr|typed\.js|gsap|aos|scrollreveal' index.html js/ css/
grep -n 'transition: all' css/custom-styles.css
grep -nE 'animation.*infinite' css/custom-styles.css
grep -n 'IntersectionObserver' js/site.js
grep -nE 'requestAnimationFrame|addEventListener\("scroll"' js/site.js
gjs js/site.js
```

Expected after V5:

- no library/CDN matches;
- no `transition: all`;
- at most one `infinite` match, scoped to the temporary caret;
- one `IntersectionObserver` instance for decorative rules;
- no additional scroll listener beyond the existing header/scrollspy modules;
- `gjs` reaches the expected `document is not defined` error only.

### Manual checks

| Mode | Expected |
|---|---|
| Normal first load | Complete content immediately; finite hero scene; no layout shift |
| Repeat navigation | Opening scene does not restart on in-page anchor navigation |
| JS disabled | Final hero sentence and rules visible; no empty animation shells |
| Reduced motion before load | No typing, caret, draw, settle, scale or View Transition |
| Reduced motion enabled mid-type | Sentence settles immediately; timers stop |
| Tab hidden mid-type | Sentence settles or resumes safely without a burst |
| Keyboard | Hover-equivalent focus; no focus loss while filtering |
| Screen reader | Hero sentence announced once, not character-by-character |
| Forced colours | States remain visible; graph/wash absent |
| Print | Static concise CV; no decorative motion layers |
| 200% zoom / 360px | No clipped typed line, graph collision or horizontal scrolling |
| Slow network / disabled fonts | No delayed content or flash of empty hero text |

---

## 13. Reviewer findings incorporated

The architecture/accessibility review rejected broad scroll reveals, parallax,
count-up metrics, continuous backgrounds and a large animation library. Those effects
increase cost and risk without improving comprehension. The design review recommended
promoting V4's existing 2px line into the main visual language and making the caret
the same line rotated vertically.

This plan therefore uses one conspicuous typewriter moment and one hero illustration,
then relies on structural line draws and direct interaction feedback. It intentionally
does not animate every section.

---

## 14. Unresolved decisions

1. **Typewriter scope:** recommended one pass of the existing hero note. A rotating
   three-phrase version would need new, verified copy and is not recommended by
   default.
2. **Graph asset:** inline SVG is easiest to animate and theme; a local external SVG
   gives cleaner HTML but less direct stroke control. Prototype both before deciding.
3. **Reading progress:** useful and low-cost with CSS scroll timelines, but optional;
   remove it if it makes the fixed header feel busy.
4. **Outcome frame arrival:** border-only settling is recommended. If it is visually
   imperceptible, remove it rather than escalating to image zoom/parallax.
5. **View Transitions support:** progressive enhancement only; browser testing is
   needed to ensure hidden project cards do not produce awkward snapshots.
6. **V4 working tree:** the current redesign is still uncommitted. Establish a clean
   V4 commit/baseline before implementing V5 so the motion work remains reviewable and
   reversible.

---

## 15. Final recommendation

Prototype the hero typewriter and graph first. They provide most of the perceived
change and reveal whether “Living evidence” is the right tone. If that prototype is
successful, add structural line draws and interaction feedback. Do not begin with a
site-wide reveal system: it creates the most risk and the least distinctive result.

The intended experience is:

> The page arrives complete, draws one precise linked-data scene, types one human
> sentence, and then becomes quiet enough to read.

---

## 16. Implementation record

### What shipped

| Area | Implementation |
|---|---|
| Tokens | `--dur-fast`/`--dur-base`/`--dur-draw`/`--dur-scene`, `--ease-standard`/`--ease-enter`, `--shift-sm`/`--shift-md`; `--dur`/`--ease` kept as aliases so V4 component transitions did not need rewriting. |
| Hero scene | CSS-only: eyebrow marker `mark-in` at 120ms, profile `panel-settle` at 180ms, graph edges 260ms, graph nodes 520/620ms. No JS timeline. |
| Typewriter | `initTypewriter()` in `site.js`; one forward pass at 26ms/char, 240ms lead-in, 420ms caret hold. Height reserved with inline `minHeight`, `.visually-hidden` echo, `aria-hidden` on the animated span, settle on reduced motion, `visibilitychange` and preference change. |
| Hero graph | Inline SVG, 12 nodes / 15 edges, `pathLength="1"`, `stroke-dashoffset` draw, hub ring, `aria-hidden`, hidden at ≤900px, in forced colours and in print. Width `min(62%, 660px)`, offset `right: -5%`, opacity `.24`: the opaque profile card masks the centre so the scene reads as a field around the panel. |
| Rule draws | `.evidence-band::before` and `.delivery-path::before` replace the former `border-top`; one `IntersectionObserver` in `initDrawnRules()` adds `.is-drawn` and unobserves. `html.motion-ready` is added **by that module only**, after the observer exists, so a failure cannot hide a rule. |
| Register | `view-transition-name: register` plus root cross-fade suppression; `setFilter()` uses `startViewTransition(apply)` when supported and motion is allowed, otherwise synchronous `apply()`. Initial render calls `apply()` directly so first paint has no transition. Load-more adds `.is-settling` for 240ms. |
| Interaction | Project/teaching rows: surface tint on hover **and** `:focus-visible`, 1.025 image scale, 3px arrow shift, 2px diagonal external-icon shift. Form fields and status. Mobile menu `menu-settle`. |
| Header | `.site-header::after` progress rule with `animation-timeline: scroll(root block)` inside `@supports`, wrapped in `prefers-reduced-motion: no-preference`. |
| Print | `animation: none !important` / `transition: none !important` for everything, plus `transform: none !important` on the drawn pseudo-elements, so a page printed from the top still prints every rule complete. Pseudo rules print at 1pt. |

### Decisions taken during implementation

1. **Two unused planned tokens were dropped.** `--dur-instant` and
   `--shadow-interactive` had no consumer; keeping dead tokens would contradict the
   token discipline of V4, and no component lifts vertically.
2. **Outcome media stay flat.** The planned "border settles as the rule draws" was
   dropped: it was imperceptible next to the rule draw and added a second animation
   to an evidence image. Outcome frames remain static.
3. **The caret is the only infinite animation.** It exists only while
   `.hero__note.is-typing` is set and is removed from the DOM at settle, so no
   animation runs at rest.
4. **`motion-ready` is module-owned.** It is set inside `initDrawnRules()`, not at
   script start, and removed again if reduced motion becomes active. Content never
   depends on it.
5. **Graph edges increased from 13 to 15** so the two secondary nodes are linked
   rather than reading as stray dots.
6. **`text-wrap: pretty` was not added.** It changes line breaking in existing prose
   with no way to visually verify the result here; it can be revisited with a browser.

### Static verification (this tree)

```text
21 project cards · 20 teaching items · 1 h1 · 12 evidence items · 5 filters
41 unique ids, no duplicates · 21 fragment links, all resolve
32 local assets requested over HTTP — all 200
CSS braces balanced (450/450) · git diff --check clean
no transition: all · one infinite animation (caret) · no CDN/library reference
one IntersectionObserver · scroll listeners unchanged (header, scrollspy)
no raw font sizes or hardcoded radii · no legacy font references
gjs js/site.js stops at "document is not defined" (syntax valid)
```

Measured gzip delta against the committed V4 baseline: CSS +2.2 KB, JS +1.6 KB,
HTML +0.4 KB (the inline graph included). No external request was added.

### Remaining manual matrix

The §12 manual table is still outstanding in a browser: first load, repeat
navigation, JS disabled, reduced motion before load and toggled mid-type, tab hidden
mid-type, keyboard/focus during filtering, screen-reader announcement of the hero
sentence, forced colours, print from the top of the page, 200% zoom and 360px
reflow, and slow or failed font loading.

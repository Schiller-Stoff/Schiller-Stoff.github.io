# Redesign plan V6 — “The page answers”

**Status:** superseded as the current visual direction by V7 “Blue ink”
(`redesignv7.md`); this file remains the motion record. Implemented on `redesign`,
uncommitted. The manual browser matrix has not been run (no browser is available in
this environment).
**Date:** 12 November 2026
**Branch:** `redesign`
**Depends on:** V5 “Living evidence” (implemented, uncommitted, not yet verified in a
browser).
**Scope:** motion, interaction feedback and one decorative layer in `index.html`,
`css/custom-styles.css` and `js/site.js`. No framework, package manager, build step,
CDN, analytics, canvas or WebGL.

---

## 1. Where V5 left us

V5 already ships a typed sentence — but in the least visible place on the page, the
muted location note at the bottom of the hero copy. It types once, then stops. The
rest of V5 is structural: rule draws, a graph, hover feedback, a reading-progress
rule.

So “more animation” should not mean “more things moving everywhere”. The honest
next step is to make the one thing the user actually likes — actively typed text —
a real signature element, and to add motion only where it explains something:
arrival, position in a chronology, the result of an action.

```text
V5   one typed sentence, once, in a corner        →  "it is alive"
V6   a typed line that carries the positioning    →  "it speaks"
     scroll-drawn chronology
     arrival acknowledgement
     action feedback (copy, submit, success)
     one bookend to the hero scene
```

---

## 2. Verdict

Add **five** things, in this order of value:

1. **A rotating typed focus line in the hero**, promoted from the muted note, with
   three approved phrasings, a proper pause control and a static accessible copy.
   This is the request; everything else is supporting craft.
2. **Arrival acknowledgement** — when a visitor follows a nav or footer link, the
   destination heading draws its rule once. Orientation, not decoration.
3. **Action feedback** — copy e-mail, submit-in-progress, success check, and a
   consistent underline/arrow response on every link and button.
4. **A scroll-drawn CV spine** — the chronology rule fills as the CV is read, with
   entry markers that resolve from rule grey to action blue. Native CSS scroll
   timelines only.
5. **A small constellation bookend** in the contact section, reusing the hero graph
   language, drawn once when reached.

And **not**: parallax, card tilt, particles, ambient gradients, count-up numbers,
scroll-jacking, letter-by-letter headings, marquees, autoplay carousels.

### Why not simply add more effects

The audience is research directors, programme managers and cultural-heritage
institutions. They are evaluating judgement. Motion that is not tied to meaning
reads as a template. The rule for V6:

> If an effect would still look correct in a screenshot, it is visual design.
> If it only exists in motion, it must explain state, position or action.

---

## 3. The typed focus line (the main event)

### 3.1 Placement and hierarchy

The location line is redundant: the profile card already says “Graz, Austria”.
Use the slot the note occupies for the typed line instead of adding another block.

```text
BEFORE (V5)                                  AFTER (V6)

Digital humanist · …                         Digital humanist · …
I build durable digital platforms for        I build durable digital platforms for
complex cultural knowledge.                  complex cultural knowledge.
                                             I am a digital humanist and research
I am a digital humanist and research         software engineer at the University
software engineer at the University          of Graz. …
of Graz. …
                                             Digital archives, editions and research
[ View selected work ] [ Contact ]           tools — built to last. ▌

Graz, Austria · Working with research        [ View selected work ] [ Contact ]
and cultural institutions across Europe
```

- Position: immediately after the lead and before the CTA row (the slot the note
  occupied, moved one block up so the line reads as positioning, not a footnote),
  so the hero does not gain a new block.
- Promoted from `--ink-muted`/`--text-sm` to `--ink-soft`/`--text-lg` (a
  `--display-3`-free role; the `h1` keeps the display weight).
- Caret is the existing 2px action rule, as in V5.
- The location is not lost: it stays in the profile card, the contact section and
  the JSON-LD.

### 3.2 Copy — requires approval

Three phrasings of the **same claim**. They must not add facts, awards or
availability that the rest of the page does not already state.

| # | Phrase | Notes |
|---|---|---|
| 1 | `Digital archives, editions and research tools — built to last.` | Default, and the accessible sentence. |
| 2 | `Making cultural knowledge findable, explorable and durable.` | Restates the lead. |
| 3 | `Research software made with the people who care for the heritage.` | Restates collaboration; no new claim. |

Rules:

- 55–70 characters each, so the line wraps to at most two lines at 1120px and three
  at 360px.
- No punctuation that needs a long pause except the dash in phrase 1.
- No emoji, no brackets, no “currently learning” framing.
- If a phrase implies availability, it must match the contact section.

### 3.3 Behaviour

```text
type     26 ms/char, 240 ms lead-in after fonts settle
hold     6000 ms
erase    12 ms/char (no pause per character)
gap      400 ms
cycle    ≈ 9 s per phrase, ≈ 27 s for three
```

- Forward typing, fast erase, next phrase. No “human error” simulation.
- Rotation only while all of these hold: document visible, motion allowed, not
  paused by the user, hero within one viewport of the reading position.
- Pausing completes the current phrase immediately (never freezes a half word),
  then stops. Resuming waits one hold, then continues with the next phrase.
- Hover or keyboard focus inside the hero does **not** pause automatically; the
  pause control is explicit and predictable.
- On `prefers-reduced-motion: reduce`, no rotation: phrase 1 is shown statically and
  the pause control is not rendered.
- On print, the line is hidden (as the V5 note is); the `h1` and lead carry the
  message.

### 3.4 Markup contract

The visual line is a presentation copy and is always `aria-hidden`. Assistive
technology receives one stable sentence — the same claim as phrase 1 — so nothing
is announced per character and nothing changes under a screen reader.

```html
<div class="hero__focus" data-typed>
  <p class="hero__focus-line">
    <span class="visually-hidden">Digital archives, editions and research tools — built to last.</span>
    <span class="hero__focus-text" data-typed-text aria-hidden="true">Digital archives, editions and research tools — built to last.</span>
    <span class="typewriter__caret" data-typed-caret aria-hidden="true"></span>
  </p>
  <button class="typed-toggle" type="button" data-typed-toggle aria-pressed="false" hidden>
    <span class="visually-hidden">Pause the rotating sentence</span>
    <svg class="icon" aria-hidden="true"><use href="#i-pause"></use></svg>
  </button>
</div>
```

- Without JavaScript, phrase 1 is visible and the toggle stays `hidden` — a complete,
  coherent line.
- Three symbols must be added to the inline sprite: `i-pause`, `i-play` and
  `i-check` (plus `i-copy` for the contact button). Keep them 16px, stroke-based and
  consistent with the existing icons.
- The other two phrases live in `data-typed-phrases` (JSON in a `<script
  type="application/json">` block, or a `data-phrases` attribute). Keep them out of
  the visible DOM to avoid text-search oddities and duplicate content.
- The toggle is revealed only by `html.typed-ready`, set by the module once rotation
  is actually running — a failed module can never leave a dead button.

### 3.5 Height reservation

Rotation must not move the CTAs.

1. After `document.fonts.ready`, measure **every** phrase at the current width and
   take the maximum wrapped height.
2. Set `min-height` on `.hero__focus-line` (not the flex row) to that value.
3. Measure by setting the text, reading `offsetHeight`, and restoring — three
   synchronous reflows, once, before typing starts.
4. Clear `min-height` only if rotation is permanently stopped (reduced motion,
   print, or a failed module) — never while rotating.
5. Do not re-measure on resize. A stale `min-height` can only be too generous, never
   clipping, and a resize already relayouts the hero.

### 3.6 Pause control and WCAG 2.2.2

Auto-starting text that moves for more than five seconds, in parallel with other
content, needs a user mechanism to pause, stop or hide it. The control is therefore
not optional.

- A 32px visual button with a 44px hit area, muted, placed after the line.
- `aria-pressed` reflects “paused”, and the visually hidden label swaps between
  “Pause the rotating sentence” and “Resume the rotating sentence”.
- Keyboard reachable; it sits after the line in DOM order, before the CTAs.
- On pause, the caret stops blinking and the phrase completes; the icon becomes
  “play”.
- If the user pauses, that choice persists for the session (a store-less variable;
  no cookies, no storage).

### 3.7 Typed.js decision, restated

Still no library. V6 needs erase, hold, pause/resume, visibility gating, a control
and a screen-reader contract — roughly 110–140 lines of guarded vanilla JavaScript,
against a GPL-3.0 dependency that would need vendoring and still would not provide
the pause semantics this site requires.

---

## 4. Arrival acknowledgement

When a visitor uses the primary nav, the footer nav or the hero CTA to jump to a
section, acknowledge the arrival for ~700 ms:

- the section's eyebrow marker draws again (`mark-in`), and
- a 2px rule under the `h2` draws left to right, then fades to the normal state.

Mechanics:

- `initArrival()` binds one delegated `click` listener on the document for
  `a[href^="#"]` inside `.nav`, `.footer-nav` and `.hero__actions`.
- It adds `.is-arrived` to the target section, then removes it after 900 ms.
- It never runs on initial load, never on the skip link, and never under reduced
  motion.
- It does not move focus — the existing focus transfer stays untouched.
- It must not fight the scrollspy: the class is decorative and self-removing.

Why this earns its place: it makes in-page navigation feel answered, and it uses the
same line grammar as everything else. It is also the cheapest possible “wow” —
zero new layout, zero new assets.

---

## 5. Interaction feedback

| Element | Effect | Guard |
|---|---|---|
| Email address in contact | New “Copy” button; label becomes “Copied”, check icon draws, reverts after 2 s. `mailto:` link remains. | `navigator.clipboard` with a `select()` fallback; never replaces the link. |
| Submit button | `:active` 1px press; while sending, a 2px indeterminate line under the button (no spinner). | Reduced motion: static 40% line. |
| Form success | The status panel settles (V5) plus a 16px check mark whose stroke draws once. | Icon is `aria-hidden`; the text is the announcement. |
| Inline text links | 2px underline sweeps left→right on hover **and** `:focus-visible`, using `::after` scaleX. | Only where the link is not already underlined by default. |
| Buttons | Arrow shifts 3px; primary surface darkens on `:active`. | Matches the existing hover state. |
| Project / teaching rows | V5 behaviour stays: surface tint, 1.025 thumbnail, 3px arrow, underline. | Focus-visible parity already in place. |
| Filter chips (optional) | The pressed underline slides between chips via a named View Transition (`view-transition-name` on `::after`). | Prototype only; drop if snapshots look wrong. |

No ripple effects, no cursor followers, no magnetic buttons.

---

## 6. Scroll-drawn CV spine

The CV is the one place where motion can carry meaning: time.

- A 2px vertical rule runs down the left of each `.cv-list` (professional experience
  and education), one hairline marker per `.cv-entry`.
- The rule fills as the list is read, using `animation-timeline: view()` and
  `animation-range: cover 0% cover 100%`, animating `transform: scaleY()` only.
- Each marker resolves from `--rule` to `--action` as its entry crosses the reading
  band — implemented with a per-entry `view()` range, not JavaScript.
- On ≤900px the spine keeps its markers but the rule is static (single column, no
  need to animate a long line on a phone).
- Under `prefers-reduced-motion`, everything is drawn at 100%.
- Without `@supports (animation-timeline: view())`, the spine is a plain static rule
  with static markers: good, just not animated.
- Print: static rule, no transform, markers in black.

This is the only V6 effect that runs continuously as the user scrolls, and it is
compositor-driven (transform only), which is why it is acceptable where parallax is
not.

### Optional: method markers

`.delivery-step` already sits on a rule that draws once (V5). V6 may add a small
square before each step number that resolves as the step arrives, with a 60 ms
stagger. Keep only if the CV spine proves the grammar reads well; two scroll-driven
systems are the maximum.

---

## 7. Contact constellation (bookend)

The hero opens with a linked-data field; the page ends with a smaller echo behind
the contact grid. Same geometry language, one-quarter scale, 6–8 nodes.

- Inline SVG, `aria-hidden`, `pointer-events: none`, `currentColor` at low opacity.
- Added to the existing `initDrawnRules()` target list so the one observer handles
  it; the edges draw once when the section reaches 25% visibility.
- Hidden at ≤900px, in print and in forced colours.
- Must not change the contact grid's dimensions (absolute layer inside a
  `position: relative` wrapper).
- If, in review, it reads as decoration rather than structure, drop it. The plan
  explicitly allows this to be the first thing cut.

---

## 8. Static polish that makes motion read better

Motion is judged against the static frame. Small, verifiable improvements:

1. `text-wrap: balance` on `h1`/`h2`, `text-wrap: pretty` on prose. Progressive
   enhancement, no JavaScript. Deferred from V5 only because no browser was
   available to check line breaks.
2. One shadowless depth rule: interactive surfaces change **surface, rule and
   underline**, never elevation. V5's `--shadow-interactive` was dropped; keep it
   dropped.
3. Consistent 2px grammar: nav underline, caret, evidence rule, delivery rule,
   filter indicator, CV spine. All are the same line rotated or scaled.
4. One accent only. The typed caret, arrival rule and CV markers all use
   `--action`; nothing new enters the palette.

---

## 9. Tokens

Add only what is used. JS timings live in named constants in `site.js`, because CSS
custom properties cannot drive `setTimeout`.

```css
/* Motion — V6 */
--dur-arrive: 700ms;   /* arrival rule + marker */
--dur-sweep: 260ms;    /* link underline */
--dur-press: 120ms;    /* :active feedback */
```

Reuse `--dur-fast`, `--dur-base`, `--dur-draw`, `--ease-standard`, `--ease-enter`,
`--shift-sm`, `--shift-md` from V5. Do not add `--dur-instant` back.

---

## 10. JavaScript architecture

```text
initYear
initHeader
initNav
initScrollspy
initPortfolio
initForm
initDrawnRules        V5 — extend targets with the contact constellation
initTypewriter        V5 — replaced by initTypedFocus
initTypedFocus        new: rotation state machine + pause control + reservation
initArrival           new: delegated anchor-arrival acknowledgement
initCopyEmail         new: clipboard + status
initFormFeedback      new: success check (only if it cannot live in CSS)
```

### Rotation state machine (sketch)

One timer at a time, one state (`idle | typing | holding | erasing | paused`), and a
single entry point:

```js
function tick() {
  if (!canRun()) { schedule(0); return; }   // visibility + motion + hero distance
  // state transition, then schedule(nextDelay)
}
```

- `canRun()` checks `document.visibilityState`, `prefersReducedMotion()` and a
  `getBoundingClientRect()` on the hero (once per phrase, not per frame).
- No new scroll listener. No `requestAnimationFrame` loop.
- `settle()` completes the current phrase and stops all timers.
- Every path that can stop rotation (reduced-motion change, pause, tab hidden,
  hero out of range) goes through the same `settle`/`pause` function so no timer can
  leak.

### Enhancement classes

- `html.typed-ready` — rotation module initialised; reveals the pause control.
- `.is-arrived` — transient arrival state, removed after 900 ms.
- `.is-copied` — transient copy state.
- Existing `js-ready`, `motion-ready`, `nav-ready`, `nav-open`, `is-drawn`,
  `is-typing`, `is-settling` unchanged.

---

## 11. Accessibility

| Concern | Decision |
|---|---|
| Screen reader | The animated line is `aria-hidden`; one static sentence carries the same claim. No `aria-live`. |
| WCAG 2.2.2 | Visible pause/resume control with `aria-pressed`; reduced motion removes rotation entirely. |
| WCAG 2.3.3 | No motion triggered by interaction beyond a 3px shift; no zoom or rotation. |
| WCAG 1.4.3 | The typed line moves from `--ink-muted` to `--ink-soft`; check contrast against `--canvas` and the hero wash. |
| Focus | Every hover effect keeps a `:focus-visible` equivalent; the pause control is in tab order. |
| Forced colours | Caret, arrival rule, CV markers and copy check use `CanvasText`; no state depends on colour. |
| Zoom / reflow | The reserved height is measured at the current width; at 200% and 360px the line wraps but never overlaps the CTAs. |
| Print | Rotation is not printed; the line is hidden as today; the CV spine prints static. |

---

## 12. Performance budget

| Item | Budget |
|---|---|
| JS | +2.5 KB gzip (rotation, arrival, copy) |
| CSS | +2 KB gzip |
| Requests | 0 new |
| Observers | 0 new (reuse the V5 observer; distance checks, not ScrollTriggers) |
| Timers at rest | 0 outside the hero |
| Layout reads | 1 `getBoundingClientRect()` per phrase while the hero is in range |
| Long tasks | none above 50 ms |
| CLS | 0 from rotation (reserved height) |

Scroll-driven animations are progress-based and compositor-friendly; they do not
introduce per-frame JavaScript.

---

## 13. Phases

### Phase 0 — close V5 (blocking)

- Walk the V5 manual matrix in a real browser.
- Commit V5 as a clean baseline so V6 stays reviewable and revertible.
- Approve the three phrases and the removal of the location line from the hero.

**Gate:** V5 has no layout or focus regression that V6 would inherit.

### Phase 1 — typed focus line

- New hero markup, static phrase 1, hidden toggle.
- `initTypedFocus` with reservation, rotation, pause/resume, reduced motion,
  visibility and distance gating.
- Contrast and wrap checks at 360/420/900/1120/1440.

**Gate:** pause control works by keyboard; SR reads one stable sentence; no CLS.

### Phase 2 — arrival and micro-interactions

- `initArrival`, link sweep, button press, copy e-mail, success check.
- No layout change anywhere in this phase.

**Gate:** every effect has a focus-visible equivalent and a reduced-motion path.

### Phase 3 — CV spine

- Static spine first, then the `view()` enhancement behind `@supports`.
- Marker ranges tuned so an entry resolves while its title is in the reading band.

**Gate:** zoom, print and reduced motion all render a complete spine.

### Phase 4 — optional polish

- Contact constellation, method markers, filter-indicator View Transition.
- Prototype each; keep only what reads as structure.

**Gate:** cut at least one of the three; if none can be cut, the page is getting
busy.

### Phase 5 — verification and documentation

- Full browser matrix, performance profile, transfer measurement.
- Update `AGENTS.md`, `README.md`, `redesignv5.md` status and this document’s
  decision log.

---

## 14. Verification

### Static checks

```bash
# no perpetual animation beyond the caret and the typed line
grep -nE 'animation[^;]*infinite' css/custom-styles.css
# scroll-driven effects are capability-gated
grep -n 'animation-timeline' css/custom-styles.css
grep -n '@supports (animation-timeline' css/custom-styles.css
# no new scroll listeners, no rAF loop
grep -nE 'addEventListener\("scroll"' js/site.js
grep -n 'requestAnimationFrame' js/site.js
# no library, no CDN
grep -nEi 'typed\.js|cdn|unpkg|jsdelivr|gsap|aos\.' index.html css/custom-styles.css js/site.js
# one observer
grep -c 'new window.IntersectionObserver' js/site.js
```

### Manual matrix (in addition to V5)

| Mode | Expected |
|---|---|
| First load | Phrase 1 types once, holds, erases, continues; no layout shift; CTAs never move |
| Pause | Click and keyboard: current phrase completes, caret stops, icon becomes play; resume continues with the next phrase |
| Reduced motion | Phrase 1 static, no caret, no toggle |
| Reduced motion toggled mid-cycle | Rotation settles immediately |
| Tab hidden mid-type | Timers stop; no burst of characters on return |
| Scrolled past hero | Rotation stops; returning to the hero resumes from the next phrase |
| Screen reader | One sentence, once; no per-character announcement |
| Nav click | Arrival rule draws once; focus lands where it did in V5 |
| Copy e-mail | “Copied”, check draws, reverts; clipboard content correct |
| Form | Success check draws once; error state unchanged |
| CV at 200% / 360px | Spine complete, markers aligned, no horizontal scroll |
| Forced colours | Caret, arrival rule, markers and check visible in system colours |
| Print | No caret or rotation artefact; CV spine static; concise CV intact |

---

## 15. Risks

1. **The typed line becomes the brand.** Rotation is the most conspicuous motion on
   the page; if it is too large or too fast it turns an institutional CV into a
   landing page. Mitigation: one line, `--text-lg`, no display scale, 6 s holds,
   pause control.
2. **Hero height.** Promoting the note to `--text-lg` plus three phrases can add a
   line at 1120px. Measure at every breakpoint before keeping the larger size; fall
   back to `--text-base` if the hero grows.
3. **WCAG 2.2.2.** Rotation without a control is a conformance failure. The control
   is part of the feature, not a nice-to-have.
4. **Scroll timelines.** Support varies; every scroll-driven effect must look
   complete without support, not “half drawn”.
5. **V5 is unverified.** Its graph placement and first-load scene have never been
   seen in a browser. Do not stack V6 on top of an unseen baseline.
6. **Scope creep of “visual appeal”.** The list of rejected effects exists because
   each one is easy to add and hard to justify. Keep the list.

---

## 16. Open decisions

1. **Phrases** — the three above are proposals; they need approval and must remain
   three phrasings of one claim.
2. **Loop or one pass** — recommend the loop with a pause control. A one-pass version
   is safer but does not deliver the effect the user asked for.
3. **Location line** — recommend removing it from the hero (it is already in the
   profile card) and reusing the slot for the typed line. Alternative: keep both,
   which adds ~40px to the hero.
4. **Line size** — recommend `--text-lg`; fall back to `--text-base` if the hero
   grows beyond one line at 1120px.
5. **CV spine scope** — both columns or professional experience only? Recommend both
   for symmetry; the education list is short.
6. **Optional phase 4 items** — recommend prototyping all three and keeping at most
   one; the constellation is the most likely to be cut.
7. **V5 baseline** — confirm the V5 manual matrix before Phase 1.

---

## 17. Recommendation

Do Phase 1 first and look at it in a browser. The typed focus line with a pause
control is the whole request; the arrival rule and micro-interactions make it feel
finished; the CV spine makes the page feel considered while scrolling. If Phase 1
does not feel right, stop there — the rest of V6 depends on the hero carrying the
motion.

The intended experience:

> The page states who this is, then says it again in a human voice that is still
> being written, then stops moving. Everything else answers what the visitor does.

---

## 18. Implementation record

**Date:** 12 November 2026. Everything below is in the working tree on `redesign`
and uncommitted.

### 18.1 What shipped

| Area | Files | Result |
|---|---|---|
| Typed focus line | `index.html`, `css/custom-styles.css`, `js/site.js` | `.hero__focus` replaces `.hero__note`; phrase 1 is static markup, phrases 2–3 live in `<script type="application/json" data-typed-phrases>`; rotation is 26 ms type / 6 s hold / 12 ms erase / 400 ms gap / 240 ms lead, with a 140 ms pause after `[.,;:—–·]`. |
| Pause control | same | `.typed-toggle` inside the line, hidden until `html.typed-ready`, 24 px visual / 44 px hit area, label and icon swap between pause and resume. |
| Height reservation | `js/site.js` | All phrases are measured once at the current width after `document.fonts.ready`; `min-height` is set on `.hero__focus-line` and cleared only on a permanent stop. |
| Arrival acknowledgement | `index.html` (CSS pseudo-element), `js/site.js` | Delegated click on fragment links in `.nav`, `.footer-nav`, `.hero__actions`; `.is-arrived` for 900 ms drives a 700 ms `arrive-rule` under the destination `h2`. Off-screen targets wait for `scrollend` (900 ms fallback) so a smooth scroll does not spend the draw. |
| Interaction feedback | `index.html`, CSS, `js/site.js` | `.text-link` underline sweeps with `::after scaleX`; `.btn:active` presses 1 px; copy button with clipboard + `execCommand` fallback and a drawn check; form `is-sending` sweep and a drawn success check in the status panel. |
| CV spine | CSS only | `.cv-list` gets a 2 px spine; `.cv-entry` gets a 7 px marker. `animation-timeline: view()` inside `@supports`, static on ≤900 px, under reduced motion and in print. |
| Footer graph | `index.html`, CSS, `js/site.js` | 9 nodes / 10 edges in `.footer__graph`, drawn once by the existing rule observer, hidden ≤900 px, in print and forced colours. |
| Static polish | CSS | `text-wrap: pretty` on prose; new tokens `--dur-arrive`, `--dur-sweep`, `--dur-press`. |

`initTypewriter` is gone; its selectors and the `.hero__note` rules were removed
with it.

### 18.2 Deviations from the approved plan

1. **Constellation placement.** The plan put the bookend behind the contact grid
   (§7); it shipped in the footer instead. The contact grid already carries the
   form and the copy button, and a navy ground can take low-contrast line work
   without competing with the form. Same geometry, one-quarter scale.
2. **No `aria-pressed` on the pause control.** §3.6 proposed `aria-pressed` plus a
   swapped label. That combination can contradict itself: a button labelled
   “Resume” with `aria-pressed="false"` reads as “Resume, not pressed”. The control
   keeps one changing accessible label (“Pause rotating text” / “Resume rotating
   text”) and a `title`; no toggle state is exposed. It is a disclosure-like
   action, not a pressed state.
3. **No arrow shift on buttons.** §5 listed a 3 px arrow shift; an arrow pointing
   down or right moving sideways looked wrong. A universal `:active` 1 px press
   replaced it, and the existing hover shifts stay where they belong (project and
   teaching rows).
4. **Two `IntersectionObserver`s.** §12 budgeted zero new observers and a
   per-phrase `getBoundingClientRect()`. Rotation needs to resume when the hero
   comes back on screen, and polling would either add a scroll listener or a
   timer at rest. A second observer on `#top` is the cheapest correct solution;
   it fires only on visibility edges and does no per-frame work. The distance
   check idea was dropped with the scroll-listener constraint.
5. **Typed line sits above the CTAs.** §3.1's prose said “same position as the
   current note” (below the buttons) while its diagram showed the line above them.
   It shipped above: at `--text-lg` it is a positioning statement, not a footnote,
   and placing it after the buttons buried it. The hero contains the same blocks
   either way; only the order changed.
6. **`text-wrap: balance` was already in place** on `h1`–`h5` from the V4/V5
   stylesheet, so only `text-wrap: pretty` on `p` was added.
7. **A second `infinite` animation.** The sending sweep is `infinite` for the
   duration of a request. It is scoped to `.contact-form.is-sending`, exists only
   inside `prefers-reduced-motion: no-preference`, and is removed as soon as the
   request settles. The caret blink remains the only other one.

### 18.3 Verification performed (static only)

- 21 project cards, 20 teaching items, one `h1`, 32 local assets all present,
  no unresolved fragment links, no duplicate ids, balanced HTML and CSS braces.
- `gjs js/site.js` stops only at `document is not defined`: syntax is valid.
- No `transition: all`; two `infinite` animations (see 18.2.7); two observers;
  still two scroll listeners (header state and scrollspy); no `requestAnimationFrame`
  loop; no CDN, library or `typed.js`; CSS uses only tokens for type and radii.
- The typed-phrase JSON parses and holds exactly three non-empty strings.
- Transfer against V4 (`de1b941`), gzip -9: CSS +4.0 KB, JS +3.5 KB, HTML +1.0 KB
  for V5 + V6 together; V6 alone is roughly +1.8 KB CSS, +1.9 KB JS, +0.6 KB HTML.
  No new requests, no new fonts.

### 18.4 Still to verify in a browser

The V5 and V6 manual matrices remain: pause/resume by mouse and keyboard, one
stable screen-reader sentence, no hero layout shift at every breakpoint, rotation
gating on tab hide and hero exit, the arrival draw and unchanged focus, copy and
form feedback, the CV spine at 200% and 360 px, forced colours, and print at the
top of the page. No browser is available in this environment.

The one measurement that could still change the design is the hero height: three
phrases at `--text-lg` may add up to one line at 1120 px compared with the removed
one-line note. If the hero grows more than that, the plan's fallback applies —
`.hero__focus-line` drops to `--text-base` (the lead keeps `--text-lg`).

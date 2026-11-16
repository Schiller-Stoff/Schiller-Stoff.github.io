# Design refactor: V4 “Evidence, clearly presented”

**Status:** implemented on the `redesign` branch (uncommitted; the user commits by hand). No headless
browser was available, so verification was static plus a local-server request check; the manual matrix in
§Appendix B remains to be walked through in a browser.
**Date:** 12 November 2026
**Branch:** `redesign` (V4 implementation is uncommitted)
**Scope:** `index.html`, `css/custom-styles.css`, `js/site.js`, image assets, and the design notes. No content rewrite beyond the approved decisions in §10, no new dependencies, no build step.
**Method:** source inspection plus measured dimensions from the working tree. No browser rendering or automated visual diff was available for this implementation; Phase 0's visual baseline remains a manual step.

---

## 1. Verdict

V4 is the right design for this site. The neutral institutional palette, the sans-led hierarchy, the evidence-first outcome blocks and the register/teaching/CV structure all serve the stated audience: research directors, programme managers, cultural-heritage institutions and hiring managers. The page reads as a serious professional record rather than a portfolio template.

The remaining problems are not conceptual. They are **system drift**: 36 distinct font sizes, five radii, three accent-bar weights, two tag components that do similar jobs, one action colour doing four different jobs, and a handful of one-off layouts that were tuned in isolation. Individually each choice is defensible; together they make the page harder to extend and slightly harder to read than it needs to be.

The refactor should therefore be **invisible to a visitor**, with five deliberate exceptions that are editorial or visual decisions, not cleanup:

1. Outcome media share one frame instead of three incompatible aspect ratios.
2. The Austrian State Prize appears in two components instead of five.
3. Static labels stop wearing the interactive blue.
4. The mobile filter row stops wrapping into three or four ragged lines.
5. Teaching thumbnails either get a real job or leave.

If a change would be visible and is not on that list, it belongs in a separate design proposal, not this refactor.

### Scorecard

| Area | Assessment | Note |
| --- | --- | --- |
| Hierarchy and narrative | Strong | Hero → credibility → evidence → capability → method → register → transfer → CV → contact is coherent. |
| Typography | Sound, over-fragmented | The voice is right; the scale is not a scale. |
| Colour | Sound, semantically blurred | Blue means link, focus, current, ordinal, brand marker and tag fill. |
| Components | Sound, inconsistent edges | Tags, labels, links and accent bars each have two or three recipes. |
| Responsive | Sound, two pressure points | Mobile filters and the 901–1120px register. |
| Accessibility | Strong | Landmarks, focus, states, forced colours, reduced motion and no-JS behaviour are deliberate. |
| Performance | Needs work | ~2.4 MB of images; 900px sources rendered at 88px. |
| Maintainability | Needs work | 97 `font-size` declarations, 28 unique `clamp()` values, broad selectors, one layout hack. |

---

## 2. Invariants

These are not negotiable in this refactor.

- **Content and counts.** 21 project cards, 20 teaching items, three outcomes, four evidence fields per band. All records, DOIs and external links remain; the only permitted text changes are the award de-duplication and filter relabelling listed in §10, and those need explicit approval.
- **Public contract.** Every existing `id` and fragment link keeps working, including `#announcements`, `#case-studies-section`, `#services-section`, `#portfolio-section`, `#teaching-section`, `#cv-section`, `#contact-section`, `#imprint-section`.
- **Architecture.** Static files, no package manager, no bundler, no framework, no CDN, no runtime dependency. One stylesheet, one script.
- **Progressive enhancement.** Content is never hidden pending JavaScript. The filter and load-more controls remain unavailable without JS; all 21 records remain visible.
- **Accessibility.** One `h1`; visible focus; state never conveyed by colour alone; `aria-pressed`, `aria-current`, `aria-live`, `aria-controls` and the non-modal navigation disclosure stay.
- **Print.** Browser print remains a concise CV: profile identifiers, outcomes, capabilities, method, CV and contact; no register, teaching list, form, footer or imprint.
- **Editorial order.** Project cards are not sorted. Teaching records are not reordered.
- **The portrait.** The circular, alpha-masked portrait remains the single organic shape.
- **German content.** `lang="de"` stays on German headings and cards.
- **No reveal animation.** No content fades, slides or waits for JavaScript.

---

## 3. Audit

Numbers below are measured from the current working tree, not estimated.

### F1. The type scale is an inventory, not a system

**Observed:** 97 `font-size` declarations across 36 unique values. Eighteen of those values sit between `0.72rem` and `1.1rem`, often within half a pixel of each other (`0.82/0.84/0.86`, `0.88/0.9/0.93/0.95`, `1.02/1.05/1.0625/1.1`). There are 34 `clamp()` uses and 28 unique clamp expressions, including separate hero `h1` formulas for the stacked and two-column layouts.

**Why it matters:** Adjacent sizes are indistinguishable at reading distance, so they do not create hierarchy; they create maintenance cost and inconsistent line wraps. A future edit cannot know whether `0.86rem` was a decision or an accident. The two `h1` formulas, by contrast, are legitimate: the headline should be larger when it owns the full width.

**Proposal:** Six text sizes plus a small set of named display roles (§4.1). Round every existing value to the nearest step; the largest change is about 1.2px. Keep the two `h1` behaviours and their existing 640px switch, but name them (`--display-1` and `--display-1-stacked`). Do not force both into one formula: a single `vw` clamp either makes the tablet headline too large or the two-column headline too small. The step-down at 641px is a pre-existing quirk; leave it alone in this refactor.

### F2. Blue has four jobs

**Observed:** `--action` is used for links, focus, pressed filters, current navigation, the eyebrow square, capability ordinals (`01`), delivery-step ordinals (`01`–`04`), the CV badge, contribution bullets, project flags, and hover states.

**Why it matters:** When blue marks both “this is interactive” and “this is the second item in a list”, the interactive signal weakens. Static blue text in flags and ordinals reads as a link that does not respond.

**Proposal:** Blue means **signal**: links, focus, current state, pressed state, and the eyebrow marker. Numbering, category labels and static metadata use `--ink-muted` or `--navy`. The CV badge becomes navy. Project flags become neutral. Contribution bullets become `--rule-strong` (or navy), because they are structure, not signal. This is a small change with a large semantic payoff.

### F3. Two tag components, two contracts

**Observed:** `.meta-tag` uses 4px radius, 4×8 padding, a `--surface-muted` fill and no uppercase. `.flag` uses 3px radius, 2×6 padding, an `--action-soft` fill, blue text and tighter tracking. They never appear side by side, but they play the same metadata-chip role in different components.

**Why it matters:** They occupy the same role in different components — a small metadata chip — but are coded as two unrelated things; the blue flag fill also implies interactivity. The 1px radius and 2px padding differences are below the threshold of intentional design.

**Proposal:** One `.tag` component with one geometry (4px radius, 4×8 padding, 12px/1.3 type; 4px is the scale minimum). Tone is the only modifier: `--meta` (neutral fill), `--status` (navy text and border, no fill). No static tag uses `--action-soft`. Keep the existing class names in HTML if desired, but point both at the shared recipe.

### F4. The award is asserted six times across five components

**Observed:** the Austrian State Prize is asserted six times across five components: in the proof strip, as an outcome `meta-tag` (“Award winner”), in the DERLA description, in the award-note label, in the award-note body, and as a project-register flag (“Award-winning”). The award image is 168 KB and is rendered at 96×64.

**Why it matters:** The page’s argument is evidence, not repetition. Six assertions of the same fact read as persuasion and dilute the one place where the award should land. The image is also the least efficient asset on the page: 168 KB for 6,144 displayed pixels.

**Proposal:** Keep two components: the proof strip (a credential) and the DERLA award note (the evidence), where the label names the prize and the body adds the category. Remove the outcome meta-tag, the description sentence and the register flag — three mentions, not the fact. Replace the 1400×934 image with a 192×128 derivative (roughly 10–15 KB), or drop the image and let the award note be typographic. **Content decision required.**

### F5. Outcome media have three different frames

**Observed:** the three outcome images are 900×774 (1.16:1), 900×510 (1.76:1) and 856×987 (0.87:1). At 1440px the media column is roughly 550px wide, so the third renders over 600px tall; the second is less than half that. There is no `aspect-ratio` on `.outcome__media`.

**Why it matters:** The outcome sequence is the page’s main evidence argument. Three unrelated frames break the rhythm between the three cases and make the section feel assembled rather than designed. The portrait-format screenshot also pushes the third outcome’s evidence band far below the fold on laptops.

**Proposal:** Give `.outcome__media` a shared frame: `aspect-ratio: 4 / 3`, `object-fit: contain`, `background: var(--surface-muted)`, one hairline border. Contain rather than cover, because these are screenshots and logos where cropping destroys meaning. Test the DERLA and ZIM screenshots for legibility at 4:3. **Visual decision required.**

### F6. The register is tight between 901px and 1120px

**Observed:** at 901–1120px the card grid is still two columns. At the low end of that range the text column is about 252px; at 1120px it is about 349px. A 57-character title such as “Aufwandsschätzung des künftigen Weiterbetriebs der MHDBDB” takes three lines at 252px, and the scope line and flags add two more.

**Why it matters:** This is the densest content on the page and the range where tablet-landscape and small-laptop users land. The card stops being scannable at exactly the width where the register is the main task.

**Proposal:** Either reduce the media to 88px and keep the title at 16px in this range, or switch the register to one column below 1024px. Recommendation: try the smaller media first, measure the four longest titles at 1024px, and fall back to one column if any title exceeds three lines. Keep two columns above 1024px and the editorial order unchanged.

### F7. The mobile filter row is a wrap, not a control

**Observed:** six buttons (“All work”, “Platforms”, “Research”, “Tools”, “Knowledge transfer”, “Reviews”) plus the count line. At 360px the row wraps to three or four lines with a ragged right edge; each button is 44px tall, so the control occupies well over 150px of vertical space before the first project.

**Why it matters:** A filter is a compact mode switch. When it becomes a multi-row paragraph of buttons, users stop reading it as a control. Two labels also cause problems: “Knowledge transfer” duplicates the name of the teaching section, and “Reviews” filters to a single record.

**Proposal:** Rename “Knowledge transfer” to “Teaching”. Fold the single review record into “Research” (its scope is a cost/operation assessment, not a review category) and remove the filter. At ≤640px use a 3-column grid with no vertical dividers and the count on its own row; at 360px the labels still fit at 14px. Five controls maximum, two rows. **Taxonomy decision required.**

### F8. Teaching thumbnails do not earn their space

**Observed:** 17 teaching images totalling 620 KB, rendered at 88×66, 76×57 or 66×50. Most are event logos, slide covers or screenshots that are unreadable at those sizes. The source files are up to 900×900.

**Why it matters:** At 66px the image is texture, not information. The row already carries type, date and a link; the thumbnail competes with the title for the same 66px of height and increases the payload by more than half a megabyte.

**Proposal:** Choose one:
- **A (recommended):** remove teaching thumbnails. Let the meta line, title and link carry the row; the section becomes faster and more scannable, and the publication cover remains the section's single image anchor.
- **B:** keep them, but generate 176×132 and 352×264 derivatives and serve them with `srcset`/`sizes`. Do not ship 900px sources for a 66px slot.

If A is chosen, the publication highlight cover stays and the teaching section still has a visual anchor. **Visual decision required.**

### F9. Radii and accent bars drift

**Observed:** radii are 3px, 4px, 6px, 10px and 50%. `--radius` covers eight uses, `4px` six, `--radius-lg` one, plus a hardcoded `6px` on `.award-note`. Accent bars are 2px action (evidence band), 3px navy (award note) and 4px navy (CV summary).

**Why it matters:** A one-off 10px panel and a one-off 3px bar are indistinguishable from mistakes. The eye reads “almost the same” as sloppy rather than hierarchical. Hardcoded values also bypass the token layer.

**Proposal:** Two radii plus the circle: `--radius-sm: 4px` for tags, thumbnails and fields; `--radius: 6px` for buttons, panels and cards; 50% only for the portrait. One accent weight: 2px. Colour carries meaning — action for evidence, navy for record/structure. Collapse the profile panel from 10px to 6px. **Visual decision required (minor).**

### F10. Interaction grammar is inconsistent

**Observed:** inline prose links are underlined by default; `.text-link` uses a transparent bottom border that appears on hover; project and teaching cards underline the heading on hover; profile links shift to blue; the evidence link underlines on hover; buttons shift background. Hover on `.filter-btn` changes colour only.

**Why it matters:** The page is otherwise disciplined, so inconsistent hover behaviour reads as unfinished. It also makes it harder to add a new link without guessing which pattern applies.

**Proposal:** Three rules, documented:
1. **Inline links** are underlined at rest and thicken on hover.
2. **Block links** (cards, teaching rows) keep the text colour and underline the heading on hover; the arrow or link label shifts to action.
3. **Controls** change surface or border, never depend on colour alone for state.

Keep the current visual results where they already match; normalise the exceptions.

### F11. Spacing is tuned per component

**Observed:** section heads use 36–56px bottom margins; card padding is 16px; evidence cells use 12/14px; outcome actions use 22px; award notes use 22px top and 14px padding; filters use 12/16px. Gaps include 6, 7, 9, 10, 14, 18, 22, 28, 30, 36 and 56px.

**Why it matters:** The page’s rhythm is good, but it is reproduced by hand in each component. A spacing scale would preserve the rhythm while making future components automatic.

**Proposal:** A 4px-based scale (§4.2). Round existing values to the nearest step. Accept ±2px shifts; verify that no heading or card changes its line count unexpectedly.

### F12. Code-level fragility

**Observed:**
- `.delivery-step::before { right: -999px; }` with `overflow: hidden` on the parent draws the continuous rule. It works, but it is a hack that depends on an ancestor clip.
- `.cv-summary__body > p:not(...):not(...):not(...):not(...)` and `.cv-entry p:not(...):not(...)` are selector chains that break when a class is added.
- Broad selectors such as `.section p a` style every paragraph link, including future components.
- Media queries at the end override earlier component rules; this is normal, but there is no map of which components have breakpoint-specific behaviour.
- The stylesheet is 2,567 lines across 20 numbered sections; there is no index, and component variants are sometimes separated by hundreds of lines.

**Why it matters:** None of this is visible today. All of it makes the next change riskier than it needs to be, which is the main long-term cost of a hand-written stylesheet.

**Proposal:** Replace the delivery-rule hack with `border-top` on `.delivery-path`. Add explicit copy classes (`.cv-summary__copy`, `.cv-entry__desc`) and delete the `:not()` chains. Narrow `.section p a` to `.prose a` and add that class where needed, or keep the broad selector and document it as the prose contract. Add a table of contents at the top of the CSS and a short “breakpoints” comment listing which components respond at 1120/900/640/420. No preprocessor, no `@layer` requirement.

### F13. Accessibility is strong; keep it that way

The audit found no structural failures: landmarks, one `h1`, visible focus, skip link, `aria-current`, `aria-pressed` with an `aria-live` count, `role="group"` on evidence bands with unique labels, `aria-controls`, a non-modal navigation disclosure with Esc and focus transfer, 44px filter targets, forced-colours rules, reduced-motion rules, and images with `alt`/`width`/`height`.

The refactor must not regress these. Two small additions are worth considering:

- Add `aria-atomic="true"` to the filter count so the whole sentence is announced when it changes.
- Re-check contrast after token rounding; `--ink-muted` at `#5b6a7e` on `--canvas` measures about 5.1:1, and `--action` on the canvas about 5.4:1. Both are comfortable for text, but any lightening would put the 11px labels at risk.

Do not change the navigation model, the evidence semantics or the no-JS fallback in this refactor.

### F14. Performance is the weakest dimension

**Observed:** images total ~2.4 MB: portfolio 1.54 MB, teaching 0.62 MB, announcement 0.17 MB, profile 0.02 MB, root 0.11 MB. The largest single file is 244 KB, rendered at 112×84 in the register. HTML is 85 KB, CSS 45 KB, JS 12 KB, fonts 94 KB.

**Why it matters:** The page is text-first and should feel immediate. Lazy loading helps the first view, but a visitor who scrolls the register and teaching list still downloads roughly 2 MB of imagery, most of it displayed at thumbnail size. On a conference network or a phone, that is the difference between a quick scan and a wait.

**Proposal:**
- Generate a 224px-wide, aspect-preserving derivative for each register thumbnail and serve it with `srcset`/`sizes`; keep the 900px source for the three outcome images.
- If teaching thumbnails stay, cap them at 176×132 and 352×264.
- Replace or remove the 168 KB award image as described in F4.
- Do not add new image formats or a CDN; WebP derivatives are enough.
- Target: under 1.6 MB transferred after a full scroll, with no visible quality loss at the rendered sizes.

---

## 4. Target system

The system is deliberately small. It should be possible to describe it in one place and to add a component without inventing a value.

### 4.1 Type

Six text sizes and six display roles. Every token has at least one component; no component invents a size.

| Token | Value | Role | Replaces |
| --- | --- | --- | --- |
| `--text-2xs` | `0.6875rem` (11px) | Uppercase labels, meta lines, flags | 0.66, 0.68, 0.7, 0.72 |
| `--text-xs` | `0.75rem` (12px) | Tags, dense captions, small links | 0.74, 0.76, 0.78 |
| `--text-sm` | `0.875rem` (14px) | Scope lines, notes, secondary copy, controls | 0.8, 0.82, 0.84, 0.85, 0.86, 0.88, 0.9, 0.93, 0.95 |
| `--text-base` | `1rem` (16px) | Body, card titles, outcome copy | 0.98, 1, 1.02 |
| `--text-lg` | `1.125rem` (18px) | Section intros, lead paragraphs, component headings | 1.05, 1.0625, 1.1, 1.15 |
| `--text-xl` | `1.25rem` (20px) | Capability and CV headings | 1.25 |
| `--display-1` | `clamp(2.7rem, 5vw, 4.6rem)` | `h1` above 900px (two-column hero) | Existing base clamp |
| `--display-1-stacked` | `clamp(2.35rem, 10vw, 3.2rem)` | `h1` at 640px and below (current mobile behaviour) | Existing mobile override |
| `--display-2` | `clamp(2rem, 3.4vw, 3rem)` | Section `h2` | Existing `h2` clamp |
| `--display-3` | `clamp(1.5rem, 2.4vw, 2.1rem)` | Outcome `h3` | Existing outcome clamp |
| `--display-4` | `clamp(1.25rem, 2vw, 1.6rem)` | CV role, contact email | Two existing component clamps |
| `--display-stat` | `clamp(1.8rem, 3.5vw, 2.8rem)` | CV dates | Existing dates clamp |

The two `h1` tokens preserve today's values. The switch stays at 640px; the 641px step-down is noted as a known quirk rather than fixed here, because fixing it would be a visible design change outside the five exceptions.

Line heights: `--leading-display: 1.05`, `--leading-title: 1.2`, `--leading-dense: 1.3`, `--leading-body: 1.55`, `--leading-prose: 1.65`. Five roles, all used; no component picks a sixth.

Tracking: `--tracking-display: -0.03em`, `--tracking-title: -0.01em`, `--tracking-label: 0.09em`. Drop `-0.035em`, `-0.025em` and `-0.02em` as separate display values; they are below the perceptual threshold at these sizes.

**Check:** the 97 declarations remain (each component still sets a size), but the unique **raw** values collapse from 36 to 12: six text sizes and six display roles. Verify with the raw-value grep in Appendix B, not with a declaration count. Print sizes stay in `pt`.

### 4.2 Spacing

A 4px-based scale, eight steps. Values in between are not allowed in component padding or gaps; fluid section spacing keeps its own tokens.

| Token | Value | Use |
| --- | --- | --- |
| `--space-2xs` | `4px` | Tag padding, icon gaps |
| `--space-xs` | `8px` | Inline gaps, label margins |
| `--space-sm` | `12px` | Compact padding, small stacks |
| `--space-md` | `16px` | Default component padding, card padding |
| `--space-lg` | `24px` | Component separation, outcome stacks |
| `--space-xl` | `32px` | Panel padding, block separation |
| `--space-2xl` | `48px` | Section-head separation |
| `--space-3xl` | `64px` | Large internal separation |

Keep `--section-y`, `--gutter` and the hero's fluid padding as they are; they are working.

### 4.3 Radii, rules, motion

| Token | Value | Use |
| --- | --- | --- |
| `--radius-sm` | `4px` | Tags, thumbnails, inputs |
| `--radius` | `6px` | Buttons, panels, cards |
| `--radius-circle` | `50%` | Portrait only |
| `--rule-hair` | `1px` | All dividers and borders |
| `--rule-accent` | `2px` | Evidence band, award note, CV summary |

Remove `--radius-lg` and the hardcoded `6px`. Keep `--dur: 160ms` and `--ease`; both are used consistently.

### 4.4 Colour roles

| Role | Token | Allowed uses |
| --- | --- | --- |
| Canvas | `--canvas` | Page background |
| Surface | `--surface`, `--surface-muted` | Panels, cards, alternating sections, tag fills |
| Structure | `--navy`, `--navy-deep` | Primary buttons, footer, structural accent bars, ordinals if emphasised |
| Signal | `--action`, `--action-hover`, `--action-soft` | Links, focus, pressed filters, current navigation, eyebrow marker, hover state |
| Text | `--ink`, `--ink-soft`, `--ink-muted` | Headings, body, labels |
| Rules | `--rule`, `--rule-strong` | Dividers, control borders |
| State | `--positive`, `--error` | Form success and error only |

Rules:
- Never use `--action` for a number, a category label or a static fill.
- Never use `--action-soft` behind text that is not interactive or a genuine status.
- On the navy footer, use only the `--on-dark-*` tokens.
- State is never colour-only; keep the forced-colours block in sync with any new component.

---

## 5. Component contracts

| Component | Contract | Responsive | Refactor action |
| --- | --- | --- | --- |
| `.eyebrow` | 11px, 600, 0.09em uppercase, `--ink-muted`, one 8px action square. One per section. | Unchanged | Tokenise; keep the square as the only brand mark. |
| `.label` recipe (meta-label, evidence label, subhead, proof label, card meta, teaching meta, CV date) | 11px, 600, 0.09em uppercase, `--ink-muted`, 1.3 line-height. | Unchanged | Add a shared `.label` class in HTML; one CSS rule, no duplicated recipes. |
| `.tag` (meta-tag + flag) | 12px, 600, 4px radius, 4×8 padding (the 4px spacing step is the minimum), 1px rule. Neutral fill by default; status uses navy text and border, no fill. | Wrap; never truncate | Merge geometry; remove blue fills from static tags. |
| `.btn` | 44px min height, 18px inline padding, 6px radius, 14px/600. Primary navy, outline rule-strong, hover shifts surface. | Full-width in hero at ≤420 | Keep; only tokenise. `--sm` stays 38px. |
| `.filters` | One group, 5 buttons maximum, 44px targets, pressed state with underline plus weight. Count on its own row below 640. No vertical dividers below 640. | 3-column grid at ≤640; 2 rows | Rename “Knowledge transfer” to “Teaching”; remove “Reviews”; add `aria-atomic="true"`. |
| `.project-card` | One link; media 4:3; meta, title, scope, optional status; arrow. Media 112px → 88px → 84px → 72px. | Current 2-up above 900; 88px media at 901–1120; 2-up retained | Reduce media at 1120; keep the editorial order. |
| `.outcome` | Media + body; body carries meta, h3, description, evidence band, contributions, actions. Media shares a 4:3 frame with `contain`. | Stacks at 900; both variants put media first when stacked | Add `aspect-ratio`; remove the height jump. |
| `.evidence-band` | Exactly four fields, 2×2, top 2px action rule, hairline dividers; single column with a 2px left action rule below 640. | 640 | Keep; tokenise padding. |
| `.award-note` | One image (optional), label, one sentence, one link. Navy 2px left rule. | 640: 72px image; print: hide image | De-duplicate the award; replace the image; fix radius. |
| `.capability` | Index, title, value sentence, copy, outputs, technologies. 1px grid gaps on a rule background. | 1-column at 900 | Make the index `--ink-muted`. |
| `.delivery-step` | Number, title, one sentence; continuous 2px navy top rule. | 2-up at 900, 1-up at 640 | Replace the `right: -999px` hack with a parent `border-top`. |
| `.teaching-item` | Meta, title, link label. No media; whole row is one link. | 2-up above 900, 1-up below | Thumbnails removed (F8, option A); sizes normalised. |
| `.publication-highlight` | One cover, meta, title, description, contribution, link. | 1-column at 420 | Keep; tokenise. |
| `.cv-summary` | Badge, role, organisation, copy, technologies, dates. Navy 4px left rule → 2px. | Stacks at 640 | Replace the `:not()` chain with `.cv-summary__copy`. |
| `.cv-entry` | Date, role, organisation, description, technologies, optional link. | 2 columns above 900, 1 below | Replace the `:not()` chain with `.cv-entry__desc`. |
| Form | 44px fields, visible labels, error text plus `aria-invalid`, status live region. | 1-column at 640 | Keep; only spacing tokens. |
| Footer | Navy surface, on-dark tokens, three columns → 2 → 1. | 900 / 640 | Keep. |

---

## 6. Media policy

1. **One frame per role.** Outcome media 4:3, register thumbs 4:3, publication cover natural ratio. The portrait stays 1:1 and circular.
2. **Serve the displayed size.** A 112px thumbnail never downloads a 900px file. A single 224px-wide derivative covers the 112px slot at 2×; the 900px source remains for outcomes. The derivative keeps the source aspect ratio so `contain` never crops it. `sizes` follows the grid: 112px, 88px, 84px, 72px.
3. **Contain, do not crop, for screenshots and logos.** Cropping a logo or a UI screenshot removes the reason for the image.
4. **Every image keeps `alt`, `width` and `height`.** Decorative duplicates use empty `alt`; no image is added without both dimensions.
5. **No new formats.** WebP is sufficient and consistent with the existing set. No SVG screenshots.
6. **Budget.** Target under 1.6 MB after a full scroll; thumbnails stay under 40 KB, outcome screenshots may run to about 200 KB where legibility requires it.

---

## 7. Phased plan

Each phase is independently shippable and reversible. Do not combine phases in one commit; the user commits manually.

### Phase 0 — Baseline (half a day)

Capture the current state before touching CSS: full-page screenshots at 360, 420, 640, 900, 1024, 1120, 1440 and 1920; register at 21 items; each filter; navigation open at 360; form error and success; print preview; forced-colours mode; reduced-motion mode. Record transfer size and the four longest titles. This is the only “visual test suite” available, so make it count.

**Output:** a `design-baseline/` folder outside the repo, or a note with paths. Do not commit screenshots.

### Phase 1 — Tokens only (half a day)

Add the type, spacing, radius, rule and colour tokens. Replace values mechanically without changing component structure. Keep computed sizes within about 1.5px of the current values. No HTML changes.

**Risk:** low. Line wraps may shift by one word.
**Verify:** compare screenshots; check the four longest register titles; check `h1` at 360 and 640; check print.

### Phase 2 — Labels and tags (half a day)

Add the shared `.label` class where the uppercase recipe repeats. Merge `.meta-tag` and `.flag` geometry; make static tags neutral. Remove `--action-soft` from non-interactive labels.

**Risk:** low–medium; this is visible on every outcome and card.
**Verify:** contrast of tag text; forced-colours borders; wrapping of two-word labels at 360.

### Phase 3 — Colour semantics and component rules (half a day)

Move ordinals and the CV badge to `--ink-muted`/`--navy`. Normalise accent bars to 2px. Collapse the profile panel radius. Apply the interaction grammar. Fix the award note radius.

**Risk:** low; mostly invisible except the blue removal.
**Verify:** scan every section for remaining decorative blue; confirm links, focus and pressed states still read as interactive.

### Phase 4 — Media and rhythm (one day)

Add the outcome frame. Generate register derivatives and `srcset`. Decide on the award image and teaching thumbnails. Fix the 901–1120 register density. Test the 21-card register at every breakpoint.

**Risk:** medium; image treatment and the teaching decision are visible.
**Verify:** no layout shift; no cropped logos; image quality at 2×; total transfer under budget; print unaffected.

### Phase 5 — Filters and mobile (half a day)

Rename the teaching filter, remove the single-item review filter, reclassify that record, and rebuild the filter row as a 3-column grid below 640. Check 5 controls at 360, 420 and 640.

**Risk:** medium; taxonomy is content.
**Verify:** every filter reveals the expected records; counts match; keyboard order; `aria-pressed`; count announcement; 21 records visible without JS.

### Phase 6 — Code cleanup and documentation (half a day)

Replace the delivery-rule hack, add copy classes and delete the `:not()` chains, add the CSS index and breakpoint map, update `AGENTS.md`, `README.md` and `redesignv4.md` with the new tokens and decisions.

**Risk:** low.
**Verify:** full static checks and a final screenshot pass.

**Total:** roughly four working days, including verification. Phase 1 and Phase 6 are the highest-value, lowest-risk work; Phase 4 carries the only real visual risk.

---

## 8. Acceptance criteria

The refactor is done when all of these are true. Ticked items were verified statically on 12 November 2026
(counts, greps, source inspection and local-server requests); unticked items need a browser pass, because
no headless browser was available.

- [x] 21 project cards, 20 teaching items, 3 evidence bands × 4 fields, all DOIs and all ids/fragments remain. Text changes are limited to the approved award de-duplication and filter relabelling/reclassification.
- [x] Non-print CSS uses at most six text sizes and six named display roles; no raw size outside the token block except print `pt`.
- [x] At most eight spacing values are used for component padding and gaps; fluid section spacing remains fluid.
- [x] Two radii plus the portrait circle; one accent-bar weight.
- [x] `--action` appears only on interactive affordances, current state, the eyebrow marker and hover states. No ordinal or static tag is blue.
- [x] Static tags share one geometry; no `--action-soft` behind non-interactive text.
- [x] All three outcome media share a 4:3 frame and the section no longer changes height wildly between cases.
- [x] The award appears in two components, not five.
- [ ] Filters: five controls maximum, no label collision, no ragged multi-row wrap at 360, count on its own row, all targets ≥44px.
- [ ] Register titles remain readable at every breakpoint; no title is clipped or truncated.
- [ ] Full-scroll transfer is under 1.6 MB; no 900px image is served for a thumbnail.
- [ ] Keyboard: skip link, nav disclosure, filters, load-more, form, all links; focus visible; Esc closes the menu; focus lands in the target section.
- [ ] Forced-colours mode still distinguishes pressed filters and tags; reduced motion still disables smooth scroll.
- [ ] Print produces the same concise CV; no register, teaching list, form, footer or imprint.
- [x] Without JS, all 21 records are visible and the filter/load-more controls are absent.
- [ ] No console errors and no 404s on the local server.
- [x] `AGENTS.md`, `README.md`, `redesignv4.md` and this document agree on the final tokens and decisions.

The five remaining items are the manual matrix: filter wrap and title lengths at 360–420px, a measured
full-scroll transfer, keyboard and screen-reader behaviour, forced-colours/reduced-motion rendering, and
print preview including the console and Network panels.

---

## 9. Risks and non-goals

### Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| Token rounding shifts line wraps and makes a section taller | Medium | Keep Phase 1 within about 1.5px; screenshot the four longest titles and the hero at every breakpoint. |
| `object-fit: contain` letterboxes screenshots and looks unfinished | Medium | Use a consistent `--surface-muted` frame and a hairline border; test all three images at 1440 and 640. |
| Removing teaching thumbnails flattens the section | Medium | Keep the publication cover; increase title weight slightly; review against the baseline. |
| Award de-duplication weakens a genuine credential | Low | Keep the proof strip and the DERLA note; the credential is still stated twice with a link. |
| Filter reclassification loses a category someone expects | Low | “Reviews” contains one record; move it to “Research” and mention the change in the summary. |
| Image derivatives add files without a build step | Low | Generate them once with a documented command; commit only the used sizes; no runtime tooling. |
| A future edit reintroduces raw values | Medium | Document the tokens in `AGENTS.md`; add the grep checks below to the verification section. |

### Non-goals

- No new visual concept, palette, typeface or icon set.
- No dark mode.
- No animation or reveal effects.
- No framework, bundler, package manager, CSS preprocessor, utility framework or CDN.
- No new sections, no reordering, no rewriting of copy beyond the award and taxonomy decisions.
- No CMS, search, analytics or cookie banner.
- No change to the navigation model, evidence semantics, print contract or no-JS behaviour.
- No attempt to make the page “more creative”. Its restraint is the point.

---

## 10. Open decisions

These need a yes/no before the relevant phase starts.

1. **Award (Phase 4).** Keep the proof strip + DERLA award note and remove the outcome meta-tag, the description sentence and the register flag (three mentions)? Recommended: yes. Replace the award image with a 192×128 derivative, or remove it entirely? Recommended: derivative, because the announcement image is evidence of the prize.
2. **Teaching thumbnails (Phase 4).** Remove them (A), or resize and keep them (B)? Recommended: A. The section already has a strong publication anchor.
3. **Outcome media (Phase 4).** 4:3 `contain` for all three, accepting letterboxing? Recommended: yes. Alternative: 3:2 `cover`, which crops the ZIM portrait screenshot and the DERLA UI.
4. **Filters (Phase 5).** Rename “Knowledge transfer” to “Teaching” and fold “Reviews” into “Research”? Recommended: yes.
5. **Profile panel radius (Phase 3).** Collapse 10px to 6px? Recommended: yes; one 10px surface has no semantic value. If the softer panel is intentional, apply 10px to at least one other “personal” surface instead.
6. **Register at 901–1120 (Phase 4).** Keep 2-up with 88px media, or switch to 1-up below 1024? Recommended: test 88px first; choose 1-up only if a title still exceeds three lines.
7. **Tag tone (Phase 2).** Make all static tags neutral, with navy status tags only where a status is genuine (for example “EU project”)? Recommended: yes. No blue fill on non-interactive labels.

---

## Appendix A — Measured inventory

| Measure | Current |
| --- | --- |
| Stylesheet | 2,567 lines, 20 numbered sections |
| `font-size` declarations | 97 |
| Unique `font-size` values | 36 |
| `clamp()` uses / unique | 34 / 28 |
| Uppercase label recipes | 15 |
| Radii | 3, 4, 6, 10px, 50% |
| Accent-bar weights | 2px action, 3px navy, 4px navy |
| Project cards | 21 |
| Teaching items | 20 |
| Outcomes / evidence fields | 3 / 12 |
| Filter categories | `platform` 8, `tool` 12, `research` 9, `knowledge` 5, `review` 1 |
| Images | ~2.4 MB total; portfolio 1.54 MB, teaching 0.62 MB, announcement 0.17 MB, profile 0.02 MB, root 0.11 MB |
| Largest image | 244 KB, rendered at 112×84 |
| HTML / CSS / JS / fonts | 85 KB / 45 KB / 12 KB / 94 KB |
| Outcome ratios | 1.16:1, 1.76:1, 0.87:1 |

### Raw type values, grouped by target token

- `--text-2xs`: 0.66, 0.68, 0.7, 0.72
- `--text-xs`: 0.74, 0.76, 0.78
- `--text-sm`: 0.8, 0.82, 0.84, 0.85, 0.86, 0.88, 0.9, 0.93, 0.95
- `--text-base`: 0.98, 1, 1.02
- `--text-lg`: 1.05, 1.0625, 1.1, 1.15
- `--text-xl`: 1.25
- Display: `2.7–4.6/5vw` (h1, two-column), `2.35–3.2/10vw` (h1, mobile override), `2–3/3.4vw` (h2), `1.5–2.1/2.4vw` (outcome h3), `1.3–1.6/2vw` (CV role), `1.2–1.55/2vw` (contact email), `1.8–2.8/3.5vw` (dates), `1.05–1.18/1.3vw` (hero lead)

The lead folds into `--text-lg`; the CV role and contact email share `--display-4`. The dates and the two `h1` behaviours stay as named display roles because forcing them into a text step would either flatten the hierarchy or break the layout-driven switch.

---

## Appendix B — Verification

Existing checks remain valid:

```bash
grep -c 'class="project-card"' index.html                 # 21
grep -c 'class="teaching-item"' index.html                # 20
grep -c '<h1' index.html                                  # 1
grep -oE 'https://doi.org/[^"]+' index.html | sort | uniq -d   # no output
grep -nE 'plex-mono|manrope|inter-var|pt-mono' css/ index.html  # no output
grep -n 'site\.js' index.html                             # only js/site.js
gjs js/site.js                                            # stops at "document is not defined"
python3 -m http.server 8000                               # check console and Network for 404s
```

New checks for the refactor:

```bash
# No raw font sizes outside the token block (print pt is allowed)
grep -n 'font-size:' css/custom-styles.css | grep -v 'var(--text' | grep -v 'var(--display' | grep -v 'pt'

# No legacy radii or hardcoded radii
grep -nE 'border-radius:\s*(3px|4px|6px|10px|50%)' css/custom-styles.css   # no output expected

# Blue must not decorate ordinals or static tags
grep -nB2 -A2 'capability__index\|delivery-step__num' css/custom-styles.css

# Every local asset resolves
grep -oE '(src|href)="[^"]+"' index.html | sed 's/.*="//;s/"$//' | grep -vE '^(#|https?:|mailto:)' | while read -r f; do [ -e "$f" ] || echo "missing: $f"; done
```

Manual pass: keyboard, every filter, load-more to 21, nav at 360, form states, forced colours, print preview, 200% zoom, and a full-scroll Network check against the 1.6 MB budget.

---

## Appendix C — Decision log

Record decisions here as they are made, so the document remains the reference rather than a proposal that drifts.

| Date | Decision | Rationale |
| --- | --- | --- |
| 12 Nov 2026 | Award: keep the proof strip and DERLA award note; remove the outcome tag, description sentence and register flag; replace the image with `ann02-192.webp`. | The credential stays stated twice with a link; the 192×128 derivative is 6 KB instead of 168 KB. |
| 12 Nov 2026 | Teaching thumbnails: option A, remove them; keep the publication cover. | At 66–88px the images were texture, not information; removes ~620 KB of sources. |
| 12 Nov 2026 | Outcome media: one 4:3 `contain` frame. | Screenshots and logos keep their content; the section no longer changes height between cases. |
| 12 Nov 2026 | Filters: rename “Knowledge transfer” to “Teaching”; fold “Reviews” into “Research”. | Five controls, no label collision, no single-record category. |
| 12 Nov 2026 | Profile panel radius: 6px. | One 10px surface had no semantic value; two radii plus the portrait circle. |
| 12 Nov 2026 | Register at 901–1120px: keep 2-up with 88px media. | The first recommendation; no 1-up fallback was needed without visual evidence of a title exceeding three lines. |
| 12 Nov 2026 | Static tags neutral; navy status tags only where a genuine status exists (“EU project”). | Blue stays reserved for links, focus, current/pressed state and the eyebrow marker. |
| 12 Nov 2026 | Line-height and tracking also tokenised; 1px borders use `--rule-hair`. | Completes the token layer rather than leaving unused leading/tracking/rules tokens. |
| 12 Nov 2026 | Register derivatives are 224px wide, aspect-preserving WebP; `srcset`/`sizes` added to all 21 cards. | Avoids 900px downloads for a 72–112px slot; keeps the source ratio for `contain`. |

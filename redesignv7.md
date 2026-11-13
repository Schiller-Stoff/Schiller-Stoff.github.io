# Redesign plan V7 — “Blue ink”

**Status:** implemented on `redesign` (13 November 2026), uncommitted and not pushed.
Phases 1–3 are in the working tree; Phase 4 is off. Static checks pass. The browser
matrix in §14 has not been walked — no browser is available in this environment — so
serif fitting, the 1120px boundary, contrast in context, forced colours and print
still need a real review.
**Date:** 13 November 2026
**Branch:** `redesign` (clean at `9748890`, “added new approach”, which contains V4 +
V5 + V6)
**Scope:** the visual system only — palette, type roles, shape grammar and component
styling in `css/custom-styles.css`, plus one `<meta name="theme-color">` value and
(optionally) one image derivative. **No JavaScript change, no new asset request, no
new dependency, no build step.** Structure, content, ids, counts, motion and print
behaviour stay exactly as they are.
**Depends on:** V4 structure (`design-refactor.md`), V5/V6 motion
(`redesignv5.md`, `redesignv6.md`). V6’s manual browser matrix has still not been
walked (no browser in this environment); V7 is a skin, so it must not be used to
close V6’s motion checks.

---

## 1. What the reference actually gives us

The reference (Site of Sites) is a directory of adventurous websites. Its look is
easy to describe and easy to copy badly:

| What you see | What it is doing | Transferable to a CV? |
|---|---|---|
| Pure white ground, almost no rules | Lets coloured type and images be the only structure | **Yes** |
| One electric ultramarine for type, links and the primary pill | A single ink, used at full strength | **Yes** |
| Large serif headlines in that blue, sans for everything else | Two voices: statement vs. record | **Yes** |
| Fully rounded pills, hairline circles | Controls are the only rounded objects; surfaces are square | **Yes** |
| Screenshot cards with the caption *below* and a circled arrow at the right | Evidence first, chrome last | **Partly** — see §8 |
| Letter-spaced uppercase micro-labels | Editorial sectioning without boxes | **Yes** (already present) |
| Periwinkle + ultramarine hand-drawn illustrations, coloured tile patterns, ellipse masks | Authored editorial content; the site’s personality | **No** — we cannot author it and should not fake it |

The important distinction:

> The reference’s playfulness lives in its **content** — a curated wall of strange
> websites and commissioned drawings. Its **system** is severe: white, one blue,
> one serif, pills and circles, no shadows. We can take the system and none of the
> content, and the page will still look related.

**V7 therefore borrows the ink, not the doodles.**

---

## 2. Verdict

V7 is a **flat, white, ultramarine** re-skin of the existing evidence-first page:

```text
BEFORE (V4–V6)                              AFTER (V7)

canvas     #f5f7fa blue-grey                canvas     #ffffff paper white
accent     #1769aa muted institutional blue  accent     #1a0de0 ultramarine ink
structure  #16324f navy                      structure  #0b0b14 ink
headlines  IBM Plex Sans 600, near-black     headlines  Source Serif 4 500, ultramarine
h1 accent  serif emphasis in ink             h1 accent  none — one voice, one colour
controls   6px rounded rectangles            controls   pill / circle only
surfaces   6px rounded panels, soft shadow   surfaces   square, no border where a rule suffices
footer     navy field                        footer     ultramarine field
motion     typed line, draws, spine          motion     unchanged (recoloured only)
```

Five structural decisions carry the whole look:

1. **One ink.** `--action` becomes `#1a0de0` and is the only saturated colour on the
   page. Navy is retired; ink takes over every structural use.
2. **Serif statements.** `h1` and `h2` move to Source Serif 4 at weight 500 in
   ultramarine; the two editorial `h3` roles (outcome and publication titles) use the
   same face at weight 400 in ink. Records stay sans.
3. **Square surfaces, round points.** Panels, media and fields lose their radii;
   buttons are pills, marks and arrows are circles, tags are near-square labels.
4. **No elevation, no gradient.** The hero wash and the header shadow are removed.
   The page is paper.
5. **Paper neutrals.** The blue-grey canvas, rules and beds become neutral white /
   grey. Periwinkle survives only as a graphic tone and one callout surface.

The footer is the one place where the ink becomes the ground: a single saturated
ultramarine field closes the page and preserves the V4/V6 rhythm of a dark footer.

What does **not** change: section order, copy, ids, fragment links, the 21/20/3
counts, the evidence bands, the 2×2→1-column evidence behaviour, the mobile
disclosure, the scrollspy, the rotating focus line and its pause control, the CV
spine, the form, the footer graph, print, forced colours.

### Adopt / adapt / reject

| Element | Decision | Reason |
|---|---|---|
| Ultramarine `#1a0de0` | **Adopt** | 9.64:1 on white; carries type, links and the primary pill without a second accent. |
| Pure-white canvas | **Adopt** | The flatness is the design. Removes the washed blue-grey that made V4 read institutional-cold. |
| Serif display in blue | **Adopt, scoped** | `h1`, `h2`, outcome/publication `h3` only. Never body, labels, buttons, tags, project titles, CV entries. Fallback: `h2` ink (§16 Q3). |
| Pill primary/secondary buttons | **Adopt** | The one friendly shape, reserved for controls. 44px high (38px compact header CTA), 999px radius. |
| Hairline circle arrow | **Adopt** | Register links. 40px, 1px `--rule-strong`, blue on hover/focus. Fits inside the existing row height; the title column loses 18–20px. |
| Uppercase micro-labels | **Keep, strengthen** | Already the system; fix the cascade bug (§4.3), widen tracking to 0.12em. |
| Node mark (eyebrow) | **Adapt** | The 8px square becomes an 8px circle — the smallest node of the data field. Same draw keyframe. |
| Flat grey image beds | **Adopt** | Square, borderless, neutral grey; lets screenshots sit on the paper like plates. |
| Asymmetric two-column section heads | **Adopt above 1120px** | Biggest layout change, CSS-only, and it is what makes the reference read editorial. Collapse earlier than 900 to protect the h2 measure. |
| Underlined blue inline links | **Keep, restyle** | 1px → 2px on hover; never colour alone. |
| Image-led cards with captions below | **Reject for the register** | Would add ~1.9k px of height and ~1 MB of images for no gain in scannability (§8). Adopt the caption *grammar* (meta under the title, circle arrow) instead. |
| Periwinkle as a large surface | **Limit** | Use for the award callout, selection and the footer graph only. Periwinkle is 1.91:1 on white: graphics and large shapes, never text. |
| Periwinkle tags | **Reject** | Tags are labels, not controls; near-square (2px radius) hairline tags avoid a page of chips. |
| Hand-drawn illustration | **Reject** | Cannot be authored here; a CSS imitation reads as clip-art. Our data field is the illustration. |
| Ellipse masks, coloured tile patterns | **Reject** | Need authored assets; novelty that would date the CV. |
| Navy | **Retire** | Two dark blues in one palette is one too many. Ink is the structural dark; ultramarine is the field. |
| Shadows / hero gradient | **Remove** | Flat design; also removes paint cost and one token. |

### 2.1 Where this plan differs from the design review

The design review agreed on the palette, the flat surfaces, the pills, the circle
arrow, the asymmetric heads and the rejection of illustration and the image-led
register. Seven proposals were changed or confirmed after checking them against the
assets and the evidence-first brief:

| Topic | Review proposal | Decision | Why |
|---|---|---|---|
| Serif scope | Serif on the wordmark and `h1` only; `h2` stays sans | **Serif `h1` + `h2` + two editorial `h3`** | Eight blue serif section heads *are* the reference’s primary element. Hierarchy is carried by the 72→48px gap, whitespace and the eyebrow. If it reads flat in review, `h2` switches to ink with one token (§16 Q3). |
| Footer | Ultramarine field | **Accepted** | Keeps V4/V6’s dark-field rhythm, uses the accent once as a ground, and avoids adding a third dark. White text 9.64:1; ink is the calm fallback. |
| Portrait | Square headshot | **Keep the circle** | The asset is a **circle-masked cutout with transparent corners**; setting `border-radius: 0` shows the same circle. A square would need a grey plate behind a circular photo — more framing, less clarity. |
| Duotone portrait | Primary signature layer | **Optional Phase 4, default off** | Recolouring a professional portrait is a design-portfolio trope and the one change that can reduce trust. The palette works without it; the graphs carry the second tint. |
| Tag shape | Near-square 2px | **Accepted** | Pills stay reserved for controls. |
| Motion retirement | Retire footer draw, panel settle, thumbnail scale | **Keep by default; optional Phase 4** | V7 is a skin. Retiring the owner’s V6 motion is a separate decision; the doc lists the three candidates and their cost. |
| Register arrow | 40px | **Accepted** | Same row height, better hit area and more reference-like than today’s 22px. Costs the title column 18–20px (22→40 at base, 20→40 at ≤1120, 16→36 at ≤420); re-check wrapping. |

The review also caught three implementation facts that are now in the plan: the
existing `background: var(--surface)` hovers become invisible on a white canvas
(§14), the eyebrow square currently prints blue (§11), and the primary pill needs an
explicit border in forced-colours mode (§11).

---

## 3. Palette

### 3.1 Tokens

```css
:root {
  color-scheme: light;

  /* Paper */
  --canvas: #ffffff;          /* the page */
  --surface: #ffffff;         /* cards, and white text on dark controls */
  --surface-paper: #f3f3f1;   /* alternate section bands, row hover */
  --surface-bed: #e6e6e3;     /* behind screenshots, images */
  --surface-tint: #e9e7fb;    /* one periwinkle callout (award note) */

  /* Ink */
  --ink: #0b0b14;
  --ink-soft: #3d3d45;
  --ink-muted: #5f5f66;
  --rule: #e3e3e0;
  --rule-strong: #767676;

  /* One accent */
  --action: #1a0de0;
  --action-hover: #0e05b8;
  --action-soft: #eeecfe;
  --tint: #b9b5f4;            /* graphics only */
  --positive: #14756f;
  --error: #b42318;
  --focus: var(--action);

  /* Ultramarine footer */
  --on-dark: #ffffff;
  --on-dark-muted: #d9d6fb;
  --on-dark-label: #b9b5f4;
  --on-dark-focus: #ffffff;
  --on-dark-rule: rgba(255, 255, 255, 0.28);

  /* Type additions */
  --tracking-serif: -0.015em;

  /* Shape: surfaces square, tags 2px, controls pill, points circle */
  --radius-sm: 2px;
  --radius: 0;
  --radius-pill: 999px;
  --radius-circle: 50%;
}
```

Also change in the token block: `--leading-display: 1.08`, `--tracking-label: 0.12em`
(from 1.05 and 0.09em).

Retired: `--navy`, `--navy-deep`, `--wash-fade-action`, `--wash-navy`,
`--wash-fade-navy`, `--shadow-header`, and `--surface-muted` (it currently does
triple duty as section band, tag fill, image bed and filter hover). Remap its seven
usages: `.section--muted` → `--surface-paper`; `.outcome__media`,
`.project-card__media`, `.publication-highlight__media`,
`.profile__portrait img` → `--surface-bed` or transparent; `.tag` → transparent;
`.filter-btn:hover` → `--surface-paper`. Net: **−7 tokens, +5** (three surfaces,
`--radius-pill`, `--tracking-serif`), **net −2**; the footer reuses `--action` as its
ground instead of adding a dark token.

### 3.2 Contrast (measured, WCAG 2.x formula)

| Pair | Ratio | Use |
|---|---:|---|
| `--ink` on white | 19.59 | Headings, values |
| `--ink-soft` on white | 10.76 | Body |
| `--ink-muted` on white | 6.33 | Labels, meta (≥12px) |
| `--action` on white | 9.64 | Headlines, links, focus |
| white on `--action` | 9.64 | Primary pill |
| `--action-hover` on white | 12.12 | Link hover |
| `--action` on `--surface-paper` | 8.68 | Blue inside tinted bands |
| `--action` on `--surface-tint` | 7.94 | Links in the award callout |
| `--ink-muted` on `--surface-tint` | 5.21 | Smallest label in the callout — allowed, but prefer `--ink-soft` (8.86) |
| `--ink-muted` on `--surface-bed` | 5.07 | Passes, but the bed stays image-only by role |
| `--tint` on white | **1.91** | **Graphics only.** Never text. |
| `--tint` on `--action` | 5.04 | Footer graph, and the only text-safe periwinkle pairing |
| `--on-dark-muted` on `--action` | 6.87 | Footer secondary text |
| white on `--action` | 9.64 | Footer text, primary pill |

Rules:

- **Blue never means “interactive” by colour alone.** The blue `h2` is not a link, so
  every interactive blue also carries a shape cue: pill, underline, circle or arrow.
  This is the one semantic debt the reference creates; we pay it with geometry.
- **Never ink text on ultramarine** (2.03:1). On blue, text is white.
- **Periwinkle is never text on white.** It is a field, a rule or a drawing.
- On `--surface-tint`, secondary copy uses `--ink-soft`, not `--ink-muted`.

### 3.3 Role map

```text
white ──────────── page, cards, evidence
paper  #f3f3f1 ─── alternate section bands (capabilities, teaching, imprint), hover
bed    #e6e6e3 ─── behind screenshots (square, no border; never text)
tint   #e9e7fb ─── award callout only
blue   #1a0de0 ─── h1, h2, links, focus, active filter, rule accents, caret, footer
periwinkle #b9b5f4 ─ graphs, selection; never text on white
ink    #0b0b14 ─── body text, structural rules
grey rules ─────── separation; never decoration
```

`theme-color` becomes `#FFFFFF`.

---

## 4. Typography

### 4.1 Two voices

| Voice | Face | Where | Why |
|---|---|---|---|
| **Statement** | Source Serif 4, 400–600 | `h1`, `h2`, `.outcome h3`, `.publication-highlight h3`, wordmark | The claim and the case titles. |
| **Record** | IBM Plex Sans, 400–600 | body, lead, labels, tags, buttons, nav, project titles, CV entries, evidence values, footer | Everything that must be scanned or trusted as data. |

No third face, no new file, no italic (the shipped serif file has no italic; do not
synthesise one).

### 4.2 Roles

| Role | Size | Face / weight | Colour | Notes |
|---|---|---|---|---|
| `h1` | `--display-1` (unchanged) | Serif 500 | `--action` | One voice; the `em` no longer switches face or colour. |
| `h2` | `--display-2` (unchanged) | Serif 500 | `--action` | Section statements. Fallback colour `--ink` if the page reads too blue. |
| Outcome `h3` | `--display-3` | Serif 400 | `--ink` | Case titles, not statements. |
| Publication `h3` | `--text-lg` (unchanged) | Serif 400 | `--ink` | One editorial title in the teaching section; no size change in Phase 1. |
| Capability `h3` | `--text-xl` | Sans 600 | `--ink` | A category, not a statement. |
| Project `h3` | `--text-base` | Sans 600 | `--ink` | Dense record; must not serif. |
| Wordmark | `--display-4` | Serif 600 | `--action` (footer: white) | The header becomes recognisable. |
| Body / lead | `--text-base` / `--text-lg` | Sans 400 | `--ink-soft` | Unchanged. |
| Labels | `--text-2xs` | Sans 600, 0.12em | `--ink-muted` | Tracking widens from 0.09em. |
| Display stat (CV dates) | `--display-stat` | Sans 600, tabular | `--ink` | Numbers are data; keep sans for tabular alignment. |

**Sizes stay at V6 values in Phase 1.** Serif at 500 sets narrower than IBM Plex
Sans at 600, so the same `clamp()` should if anything *shorten* the headline. Measure
at 360/420/900/1120/1440. Two documented fallbacks:

- If any `h2` wraps beyond three lines above 1120px, drop `--display-2` to
  `clamp(1.85rem, 3vw, 2.5rem)` (30–40px) rather than shrinking the column.
- If the hero grows by more than one line, keep its V6 size; do not enlarge it to
  compensate for the serif.

Tracking: add `--tracking-serif: -0.015em` for display serif; keep
`--tracking-display: -0.03em` for the remaining sans heading defaults. Set
`--leading-display: 1.08` (serif ascenders at 72px collide at 1.05).

### 4.3 Cascade fix that comes with the type change

`.section-head p` (specificity 0,1,1) currently overrides `.eyebrow` (0,1,0), so
**all eight section eyebrows are rendered as 18px body copy instead of an 11px
letter-spaced label**; only the hero eyebrow is correct. This is visible in the
cascade and should be fixed as part of V7:

```css
.section-head > p:not(.eyebrow) { /* the intro paragraph only */ }
.section-head .eyebrow { /* restate the label role */ }
```

`p:not(.eyebrow)` avoids touching eight HTML blocks; the alternative is an explicit
`.section-head__intro` class on each intro paragraph. Prefer the selector unless the
team wants the hook for future styling.

Verify in a browser before/after; the fix should make every section head noticeably
tighter and more editorial.

---

## 5. Shape and surface grammar

```text
radius 0        surfaces, media, panels, fields
radius 2px      tags (labels, not controls)
radius 999px    buttons, copy control, skip link, load more
radius 50%      portrait, eyebrow node, circle arrows, nav toggle
border 1px      functional separation and circles
border 2px      one accent rule per component, never around a box
shadow          none
gradient        none
```

- `--radius-sm` becomes `2px`, `--radius` becomes `0` (kept as a token so no component
  declares a raw radius), add `--radius-pill: 999px`.
- **Round means point or control; square means surface or record.** The portrait, the
  eyebrow node, the register arrows and the nav toggle are round. Media, panels, rows
  and fields are square. Tags sit between: 2px, a label with a hairline.
- Inputs become **underline fields** (border-bottom only, transparent background) to
  match the reference’s form, except the textarea, which keeps a 1px square box so a
  multi-line empty field is still recognisable.
- The header loses its shadow; `.is-scrolled` changes the bottom rule from `--rule`
  to `--rule-strong` (a flat state, no elevation, and the header keeps an edge over
  content). The transition drops its `box-shadow` term.

---

## 6. Components

### 6.1 Header and navigation

| Before | After |
|---|---|
| Sans 18px wordmark, ink | **Serif `--display-4`/600 wordmark in `--action`** |
| Blue-grey descriptor | Micro-label, `--ink-muted`, 0.12em |
| Nav ink-soft, blue underline on hover/current | Ink, `--action` + 2px underline on hover/current; current also 600 |
| 6px “Contact” button, navy | **Ultramarine pill**, white, 38–40px |

No layout change, no new markup. Header height stays 72px. Current nav keeps the
underline as well as the colour, so the state is never colour-only.

### 6.2 Hero

- Remove `background-image` (the radial wash) and the `--wash-*` tokens. White.
- `h1`: serif 500 ultramarine; `em { font: inherit; color: inherit; letter-spacing:
  inherit; }` (the em rule currently sets its own tracking and weight).
- Lead: unchanged (sans `--text-lg`, `--ink-soft`).
- Typed focus line: unchanged; caret `--action`; pause control unchanged.
- Profile card: **square, 1px `--rule`, white**, no radius. The 6px offset outline on
  the portrait is removed; the portrait keeps its circular crop.
- Hero graph: `color: var(--action); opacity: 0.12` (was navy 0.24). Sat blue reads
  stronger than navy at the same alpha; if it disappears on a matte screen, raise to
  0.16 rather than restoring navy. Hidden ≤900px, print and forced colours as today.
- CTAs: primary ultramarine pill; secondary **blue outline pill** (border `--action`,
  text `--action`, hover `--action-soft`).

Estimated height: neutral to slightly shorter (no wash, serif narrower, same blocks).

### 6.3 Section heads

At **above 1120px**, three grid areas (the rule lives in the base and is removed in
the existing `max-width: 1120px` block, so exactly 1120 is one column):

```text
[ eyebrow ......................... ]
[ h2 (≈57%)        ][ intro (≈43%) ]
        first baselines aligned ↑
```

- `grid-template-areas: "eyebrow eyebrow" "title intro"`
- `column-gap: clamp(32px, 5vw, 80px)`, `align-items: baseline`, `max-width: none`.
- `h2` serif 500, ultramarine, `--display-2`.
- Intro uses `--text-base` (16px, down from `--text-lg`) and `--ink-soft`, max 46ch.
  The reference’s standfirst is body-size; this also keeps the head from growing.
- At 1120px and below: one column, eyebrow → h2 → intro, `--text-lg` restored if it
  reads too small, `max-width: 64ch` (current behaviour). Collapse at **1120**, not
  900: at 901–1120 the h2 column would be ~400px and the longest titles run to four
  lines. Implement the collapse in the existing `max-width: 1120px` block rather than
  with a second `min-width` query, so 1120 has one owner.
- The arrival rule (`h2::after`) is unaffected; keep `position: relative` on the `h2`.
  It now spans only the title column, which is the intended “rule under the claim”.

Gate: if any of the eight section heads looks unbalanced above 1120px (long intro
beside a short title), revert to the stacked head or drop `--display-2` one step
(§4.2). One rule either way.

### 6.4 Buttons, tags, links

```css
.btn          { border-radius: var(--radius-pill); padding-inline: var(--space-lg); }
.btn--primary { background: var(--action); border-color: var(--action); color: var(--surface); }
.btn--primary:hover { background: var(--action-hover); }
.btn--outline { border-color: var(--action); color: var(--action); background: transparent; }
.btn--outline:hover { background: var(--action-soft); }
.tag          { border-radius: var(--radius-sm); background: transparent;
                border-color: var(--rule-strong); color: var(--ink-muted); }
.tag--status  { border-color: var(--ink); color: var(--ink); }
```

- One filled pill per viewport band: header CTA, hero primary, form submit. Everything
  else is an outline pill, so the page never becomes a row of blue lozenges.
- Static tags never use blue (keeps design-refactor §F2 intact) and never become
  pills; they are 2px labels with a **1px `--rule-strong` hairline** (a `--rule`
  hairline is 1.29:1 on white and disappears).
- `.text-link` and prose links: 1px underline at rest, 2px on hover/focus; colour is
  never the only difference.
- `.copy-btn`: pill, hairline, ink-soft.
- `.skip-link`: ink background, white text, pill.

### 6.5 Proof strip

No structural change. White ground, hairline top/bottom, labels `--ink-muted`, values
`--ink`, links blue with a hover underline. Optional: values at `--text-lg` (18px) so
the strip reads as a figure line rather than body copy; verify the “21 projects · 20
teaching resources” cell at 901–1120px first.

### 6.6 Selected outcomes

- Media: **square, no border**, `background: var(--surface-bed)`, 4:3, contain.
- `outcome__meta` tags become 2px hairline labels.
- `h3`: serif 400 ink, `--display-3`.
- Evidence band: 2px ultramarine top rule stays (the strongest structural mark).
- Contribution bullets: `--rule-strong` (structure, not signal).
- Award note: **square, `background: var(--surface-tint)`, left border 2px
  `--action`, no full border**. The one periwinkle surface on the page.
- `outcome__actions`: outline pill.
- The alternating `--flip` layout is unchanged.

### 6.7 Project register

Keep the dense 2-up row. Adopt the reference’s grammar, not its grid:

- Thumbnail 112px (unchanged; 224w is exactly 2×), **square, no border**,
  `--surface-bed`, contain.
- Title: sans 600 ink; hover/focus blue + 2px underline.
- Scope: `--ink-soft`; meta tags 2px hairline labels (neutral).
- **Arrow becomes a 40px hairline circle** with a 16px arrow, `--rule-strong`;
  hover/focus: `--action` border and arrow, arrow keeps its existing 3px shift
  (a 16px icon in a 40px circle has 12px clearance, so nothing clips). The circle is
  `aria-hidden`, the title names the link. Today the arrow column is only 22px
  (20px at ≤1120, 16px at ≤420), so 40px takes 18–20px from the title column — the
  media still sets the row height at every breakpoint (112 ≥ 40), so height does not
  change.
- Grid column becomes `112px minmax(0,1fr) 40px` (1120: `88px … 40px`; 900: `84px …
  40px`; 420: `72px … 36px`). Re-check long titles at 901–1120 after the 18–20px loss.
- Hover/focus background: `--surface-paper`, not `--surface` (which is now identical
  to the canvas). Fix the same no-op on `.teaching-item`.
- Card separator: keep the 1px bottom rule.
- Filters: add a visible `Filters` micro-label as a **sibling immediately before
  `.filters`** (`<p class="filters__label" id="filters-label">Filters</p>`), with
  `role="group" aria-labelledby="filters-label"` replacing the current `aria-label`
  (the group keeps its name; the visible text now supplies it). Keeping it outside
  the group means no child selectors break. The label is `display: none` until
  `html.js-ready`, like the controls, so no orphan caption appears without JS. Style
  it as the micro-label (`--text-2xs`, 600, 0.12em, `--ink-muted`) with
  `margin-bottom: var(--space-xs)`; it sits between the section head and the strip’s
  top hairline, so no extra wrapper is needed.
  Keep the top/bottom hairline, **remove the vertical dividers**. Blue text buttons,
  44px, pressed = `--action` + 2px underline; count right-aligned at 16px/600 `--ink`
  (tabular). At ≤640 the 3-column grid and count row stay unchanged.
- Load more: outline pill.
- View transition unchanged.

### 6.8 Knowledge transfer

Rows unchanged; links blue; thumbnails square on `--surface-bed`; hover fill
`--surface-paper`; the publication highlight gets the serif title and a square,
borderless cover. No filters.

### 6.9 CV

- Summary panel: square, 1px `--rule`, 2px `--action` left rule (navy retired).
- Badge blue; dates ink, tabular. Markers become 7px circles.
- Spine and markers stay `--action`; scroll timeline untouched.
- Entries sans; labels muted; links blue.

### 6.10 Contact

- Section head uses the asymmetric layout.
- Email link: ultramarine, 1px underline, 2px on hover.
- Fields: **underline only** (`border: 0; border-bottom: 1px solid --rule-strong;
  background: transparent; padding: var(--space-sm) 0; border-radius: 0`).
- Labels: keep the current 14px/600 sentence-case label (a 11px uppercase label would
  look editorial but costs clarity in a four-field form), still `<label for>`.
- Textarea: 1px square border, transparent background, `resize: vertical`.
- Focus: 2px `--action` outline offset 1 (no layout shift; the rule does not thicken).
- Error: `--error` bottom rule **and** the existing status text/`aria-invalid`; do not
  rely on colour alone.
- Submit: ultramarine pill; the sending sweep (currentColor) still reads.
- Copy button: pill; Copied state keeps the drawn check and `--positive`.

### 6.11 Footer

- Ground becomes **ultramarine (`--action`)**, not navy. This is the one place where
  the ink becomes the field; it preserves the V4/V6 rhythm of a dark footer and gives
  the palette one large, unmistakable colour block.
- Wordmark serif white (600); descriptor `--on-dark-muted`; links `--on-dark`, hover
  white + underline. Never use ultramarine as a link colour on this ground.
- Graph `color: var(--tint); opacity: 0.45` — the periwinkle bookend.
- Bottom rule `--on-dark-rule`; focus `--on-dark-focus`.
- No structural change; the footer prints as nothing, as today.
- Calm fallback if review finds it too loud: ink ground `#0b0b14`, white wordmark, the
  same periwinkle graph. Two token values; nothing else changes.

---

## 7. One page, one ink: before/after map

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Sebastian Stoff (serif, blue)      Expertise  Work  Experience  (Contact)│ ← pill
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  DIGITAL HUMANIST · RESEARCH SOFTWARE ENGINEER                          │
│                                                                         │
│  I build durable digital platforms   ┌───────────────────────────┐      │
│  for complex cultural knowledge.     │        (portrait)         │      │
│  (serif, ultramarine, 72px)          │  Senior Developer …       │      │
│                                      │  University of Graz       │      │
│  Lead paragraph (sans, ink-soft)     │  ORCID / GitHub / …       │      │
│  Typed line ▌                        └───────────────────────────┘      │
│  (View selected work)  (Contact)          square card, hairline          │
│      blue pill          blue outline pill                               │
├─────────────────────────────────────────────────────────────────────────┤
│ AFFILIATION │ RECOGNITION │ PUBLIC RECORD │ RESEARCHER IDENTITY         │
├─────────────────────────────────────────────────────────────────────────┤
│ Selected outcomes                                                        │
│ Work with public impact.        Three projects that show how research,   │
│ (serif, blue)                   design and engineering meet in practice. │
│                                                                          │
│ ┌───────────────┐  DERLA: Digital Memorial Landscape  (serif, ink)      │
│ │  screenshot   │  [Digital Humanities] [2019—2025]   ← 2px labels       │
│ │  square, bed  │  ───────────────────────────── 2px blue               │
│ └───────────────┘  ROLE │ SCOPE │ RESULT │ EVIDENCE                      │
├─────────────────────────────────────────────────────────────────────────┤
│ Projects and contributions                                               │
│ ┌─────┐ DERLA — Digital Memorial Landscape              ( ↗ )           │
│ │thumb│ Digital Humanities · 2019—2025                40px circle        │
│ └─────┘ ─────────────────────────────────────────────────────────────── │
│ … 9 of 21, FILTERS label, blue pressed filter, load more outline pill    │
├─────────────────────────────────────────────────────────────────────────┤
│ ULTRAMARINE footer: white serif wordmark, periwinkle graph, white links  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 8. The register decision (measured)

The reference’s most seductive element is the image-led 2-up grid with captions
below. It is wrong here, for measurable reasons:

| Option | Height for 9 records | Image payload (initial 9) | Scan cost |
|---|---:|---:|---|
| **A. Image-led 2-up, 4:3 media** | ≈2,600px | ≈450–600KB (needs new 640w derivatives; only 224w exist) | 9 large images compete with 9 titles |
| **B. Dense rows (current) + circle arrow** | ≈725px | ≈56KB (224w, 2× for 112px) | Titles align; scope and tags scan vertically |
| **C. Hybrid: rows, media 160px** | ≈970px | ≈200KB (needs 320w derivatives) | Marginal gain |

Recommendation: **B**. The register is a *record*, not a gallery; the three selected
outcomes already provide the image-led moment. If the owner wants A later, it is a
self-contained Phase 4 experiment with a payload budget and a revert; do not smuggle
it into the skin.

The caption grammar is still adopted: meta/date line under the title, and the circled
arrow at the right, which is the reference’s most recognisable list detail.

---

## 9. Signature layer: the data field, not doodles

The reference’s illustrations cannot be reproduced honestly. V7 uses the existing
linked-data geometry as its authored mark:

1. **Hero graph** in ultramarine at 12% behind the profile card (decorative, hidden
   ≤900px, print, forced colours).
2. **Footer graph** in periwinkle at 45% on ultramarine — the bookend.
3. **Periwinkle award callout** — the one tinted surface, meaning “recognition”, not
   decoration.
4. **Periwinkle selection** (`::selection { background: var(--tint); color: var(--ink) }`)
   — a small, consistent second-tone moment.

Explicitly **not** added: hand-drawn arrows, scribbles, asterisks, sticker tiles,
ellipse image masks, duotone skin. A duotone portrait is available as an optional
Phase 4 experiment (one Pillow run, one derivative, src swap) but is **off by
default**: it would trade a credible professional photograph for a design-portfolio
signal. The face is the one asset the page should not art-direct.

Cut-first list if the page feels busy: footer graph, then hero graph, then the award
callout tint. The type and palette must carry V7 on their own.

---

## 10. Motion reconciliation

V7 is a skin; do not stack new motion on V5/V6. The only changes are colours.

| V5/V6 behaviour | V7 |
|---|---|
| Rotating typed focus line + pause control | **Keep** unchanged; caret `--action`. It stays the page’s one moving sentence. |
| Arrival rule under `h2` | **Keep**; `--action`. |
| Copy/submit/success feedback | **Keep**; colours inherit. |
| CV spine + markers | **Keep**; `--action`. |
| Hero scene (wash, panel settle, graph draw) | Wash **removed**; panel settle and graph draw **kept** (graph recoloured). |
| Reading progress rule | **Keep**; `--action` on white. |
| Footer graph draw | **Keep**; periwinkle on ultramarine. |
| Hover shifts on cards | **Keep**; the arrow’s 3px `--shift-sm` is unchanged, so the token and its two keyframe uses stay untouched. |

No new observer, timer, transition or keyframe. `prefers-reduced-motion` and WCAG
2.2.2 are unaffected. If the owner wants to remove the typed line to let the serif
headline be still, that is a separate decision (§16, Q7), not part of V7.

**Optional Phase 4 retirement** (default: keep). A flat skin makes three V6 effects
less meaningful; each is independently removable and each removal reduces CSS:

| Effect | Why it could go | Cost of keeping |
|---|---|---|
| Footer graph draw | A static periwinkle graph on blue is complete; animating the bookend repeats the hero | one observer target, 2 keyframes |
| `.hero__profile` panel settle | The card no longer floats; “settling” describes nothing | 1 rule |
| Thumbnail `scale(1.025)` | Invisible on a borderless 112px plate; the circle arrow carries the hover | 1 rule, 21 composited layers on hover |

Do not remove the arrival rule, the CV spine, the typed line or the action feedback:
those explain state, position or result. The cut list is only for decoration that
stopped meaning something.

---

## 11. Accessibility and print

| Concern | Decision |
|---|---|
| Contrast | All text pairs ≥4.5:1 except periwinkle-as-graphics (1.91) which is never text. Blue on white 9.64; white on blue 9.64; muted 6.33. |
| Colour-only state | Current nav, pressed filter and hover links all keep an underline/shape; tags keep a border; form errors keep text + `aria-invalid`. |
| Focus | 2px ultramarine ring, 3px offset. On the blue pill the offset leaves a white gap, so the ring is visible. Footer rings are white. |
| Forced colours | Add `.btn { border-color: CanvasText }` and `.btn--primary { background: ButtonFace; color: ButtonText }` (a filled pill otherwise loses its only boundary). Blue h1/h2, tags, circles and underlines resolve to `CanvasText`. Graphs stay hidden; tinted surfaces flatten. |
| Reduced motion | Unchanged; V7 adds no animation. |
| Zoom / reflow | The asymmetric head collapses at 1120px; the register keeps two columns above 900px; pills wrap in `.btn-row`; the filter label sits above the strip without colliding with the section intro. Check 200% at 360px. |
| Print | Force `h1–h4` to black (serif retained), all surfaces to white, **`.tag { border-color: #999; background: #fff }`** (after the V7 remap a tag has no fill and a 1.29:1 hairline), award-note/panel tints off, copy button hidden, graphs hidden, `.filters__label` hidden with the filters, and `.section-head` back to `display: block` in case the sheet is wider than 1120px. Also force `.eyebrow::before` to `#000` — today it prints blue (existing bug). The CV stays concise; blue is never printed as a field. |
| Touch targets | Body pills 44px; the header CTA keeps its existing compact 38–40px; filter buttons 44px; circle arrows 40px (36px at ≤420) inside a row link whose whole card is the target. All exceed the 24px AA minimum. |

---

## 12. Cost and complexity

| Item | Budget |
|---|---|
| JavaScript | **0 lines changed** |
| HTML | 1 meta value (`theme-color`); one `p#filters-label` before `.filters` plus `aria-labelledby`; no other markup change |
| CSS | ≈250–300 lines touched, net **≈+45 lines** (pills, section grid, underline fields) and **−2 tokens** |
| CSS transfer | ±1KB gzip (removed gradients/shadows offset the new rules) |
| New assets / requests | 0 |
| New dependencies | 0 |
| New observers / timers | 0 |
| Concepts removed | navy, wash gradient, header shadow, 6px panel radii, invisible `--surface` hovers, the triple-duty `--surface-muted` |

This is the point of V7: a complete visual re-identification with **no behavioural
surface area**.

---

## 13. Phases and gates

### Phase 0 — baseline (blocking)

- Confirm `9748890` is the V6 state and that the V6 browser matrix is at least
  partially walked. V7 changes colours and type, so any V6 visual check must be
  repeated anyway; the structural/motion checks still stand.
- Approve: ultramarine, retiring navy, serif `h2`, the ultramarine footer, and the
  register staying dense. These are the decisions that are expensive to reverse.

**Gate:** a browser is available for at least one pass at 1440/1120/900/640/360.

### Phase 1 — palette and type (CSS only)

- Tokens (§3.1), `theme-color`, serif `h1/h2/h3`, wordmark, remove wash/shadow,
  ultramarine footer, recolour graphs, selection.
- Remap all seven `--surface-muted` usages before deleting it (§3.1), and every navy
  usage: `.skip-link`, `.tag--status`, `.btn--primary` (and its hover),
  `.btn--outline:hover`, `.hero__graph`, `.award-note`, `.delivery-path::before`,
  `.cv-summary`, `.site-footer`.
- Audit every `background: var(--surface)` hover — on a white canvas they become
  no-ops; point them at `--surface-paper` (§14).
- Do **not** change sizes yet.

**Gate:** contrast pairs re-measured; hero height at five widths is ≤ V6; print is
black; no horizontal scroll; no component still references a retired token.

### Phase 2 — shape and components

- Pills, tags, square media/panels, eyebrow node, circle arrows, filters label,
  underline fields, asymmetric heads, award-note tint, header scrolled state.

**Gate:** every hover has a focus-visible equivalent; forced colours pass; the form is
still understandable with labels above underline fields; the register still scans at
901–1120px; no id or fragment changed.

### Phase 3 — cleanup and documentation

- Delete dead rules (navy, wash, shadow), normalise radii to 0/2px/pill/circle, update
  `AGENTS.md` (palette, serif roles, footer ground, no shadow, three radii), `README.md`,
  and mark `redesignv6.md` as the previous motion record. Add a V7 implementation
  record to this file if implemented.
- Run the static checks and the transfer diff.

**Gate:** `git diff` contains no JS change; the invariant greps in `AGENTS.md` still
pass (with the documented new radii/motion exceptions).

### Phase 4 — optional, each independently revertible

1. **Image-led register** A/B (needs 320w/640w derivatives and a height/payload
   budget). Default: no.
2. **Duotone portrait** (Pillow gradient map, one derivative). Default: no.
3. **Hero graph removal** if the white hero feels busy. Default: keep.
4. **Section rhythm** `--section-y` +8px at the top end. Default: no.

Do not combine these; each needs its own screenshot pass.

---

## 14. Verification

### Static (can run here)

```bash
# invariants unchanged
grep -c 'class="project-card"' index.html          # 21
grep -c 'class="teaching-item"' index.html         # 20
grep -c '<h1' index.html                           # 1
grep -c 'class="section-head"' index.html          # 8
grep -c 'id="filters-label"' index.html            # 1
grep -c 'aria-labelledby="filters-label"' index.html  # 1
gjs js/site.js                                     # stops at "document is not defined"

# palette: no retired tokens, no raw colour outside tokens/print/forced
grep -nE -- '--navy|--wash-|--shadow-header|--surface-muted' css/custom-styles.css index.html   # none
grep -nE '#[0-9a-fA-F]{3,6}' css/custom-styles.css | grep -vE '^[0-9]+:  --'   # print/forced only
grep -n 'theme-color' index.html                   # #FFFFFF
grep -n 'background: var(--surface)' css/custom-styles.css   # review: no hover may use it

# shape: 0, 2px, pill, circle only
grep -nE 'border-radius:\s*(3px|4px|6px|10px)' css/custom-styles.css            # none
grep -nE -- '--radius-sm:\s*2px|--radius-pill:\s*999px|--radius:\s*0' css/custom-styles.css
grep -n 'grid-template-columns: 112px minmax(0, 1fr) 40px' css/custom-styles.css

# type: serif only where intended (wordmark, h1, h2, two h3 roles)
grep -n 'font-family: var(--font-serif)' css/custom-styles.css

# no new runtime surface
git diff --stat -- js/                              # empty
grep -nEi 'cdn|unpkg|jsdelivr|typed\.js|gsap' index.html css/*.css js/*.js      # none
grep -c 'new window.IntersectionObserver' js/site.js                            # 2
grep -nE 'addEventListener\("scroll"' js/site.js                                # 2

# contrast (same script used for §3.2)
python3 - <<'PY'
def lum(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c: c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb)
    return (hi+0.05)/(lo+0.05)
for a,b,label in [('#1a0de0','#ffffff','blue on white'),('#ffffff','#1a0de0','white on blue'),
                  ('#0b0b14','#ffffff','ink on white'),('#5f5f66','#ffffff','muted on white'),
                  ('#1a0de0','#f3f3f1','blue on paper'),('#1a0de0','#e9e7fb','blue on tint'),
                  ('#d9d6fb','#1a0de0','footer secondary'),('#b9b5f4','#1a0de0','footer label'),
                  ('#b9b5f4','#ffffff','tint on white (graphics only)')]:
    print(label, round(cr(a,b),2))
PY
```

Also check: every local `src`/`href`/`url()` resolves; ids unique; every fragment link
resolves; HTML balanced; CSS braces balanced; no duplicated DOIs.

### Browser matrix (cannot run here)

| Mode | V7-specific expectation |
|---|---|
| 1440 / 1121 | Serif headline does not exceed 3–4 lines; hero no taller than V6; section intro shares the h2’s first baseline without collision; at 1121 the head is two columns |
| 1120 | The head has collapsed to one column and the intro measure is capped; the register is still 2-up |
| 900 / 640 / 360 | Asymmetric heads have collapsed; pills wrap; circle arrow column never clips the title; no sideways scroll |
| 200% zoom | Underline fields keep labels visible; focus ring not clipped; register still 2-up above 900px |
| Keyboard | Header pill, filters, load more, copy, submit, pause control all focusable with a visible ring; current nav has blue + underline |
| Forced colours | Primary pills keep a border; pressed filter keeps underline; tags keep borders; graphs hidden; headline/tint flatten |
| Reduced motion | No change from V6; typed line static, no draws |
| Print preview | All headings black (serif), no tinted panels, no copy button, no blue eyebrow mark, concise CV intact, no half-drawn rule |
| First load | No layout shift; theme colour is white; no flash of navy |
| Hover/focus parity | Project title + circle arrow respond identically on hover and focus; outline pill fills on both |

Unverifiable here: the actual optical fit of Source Serif 4 at 500 against Plex at 600,
the serif line count at each breakpoint, the periwinkle graph on an OLED screen, the
`align-items: baseline` head at 1120px across Chrome/Safari/Firefox, and the 1px circle
at 1× DPI.

---

## 15. Risks

1. **Blue fatigue.** Eight ultramarine `h2`s plus a blue `h1`, links, rules and a blue
   footer is a lot of saturated ink. Mitigation: serif 500, ink `h3`s, neutral paper
   bands, no blue fills except the primary pill and one 2px rule per component. If it
   is still too much, `h2` → ink is a one-token fallback (§16 Q3).
2. **Serif competence.** Source Serif 4 is an academic text serif, not a display
   didone. At 500/72px it is confident, but it will read “university press”, not
   “design studio”. That is the correct trade for this audience; do not compensate
   with tighter tracking or larger sizes.
3. **Hierarchy compression.** `h1` and `h2` are now the same face and colour. Keep the
   size gap and never set `h3` in blue; if the page feels flat, make `h2` ink and
   leave `h1` blue (fallback, one rule).
4. **The white page loses section boundaries.** The paper band and hairlines must carry
   grouping. If the scroll feels endless, restore a 1px top rule per section before
   adding tint.
5. **Pill overuse.** Only buttons, copy, load-more and the skip link are pills. Media,
   panels, fields and cards stay square; tags are 2px; the portrait, eyebrow node,
   arrows and nav toggle are circles.
6. **Eyebrow cascade fix changes the look.** It is a correction, but it will visibly
   reduce the section-head height. Check six section heads at 900–1200px.
7. **The ultramarine footer could read as “brand block”.** It is one field, not a
   mode; no dark-mode media query is implied. It is also the easiest V7 decision to
   reverse: ink ground, two token values.
8. **The portrait cannot be squared for free.** The shipped asset is a circle mask with
   transparent corners; removing `border-radius` shows the same circle. A square
   portrait would need a grey plate behind the circular photo (or a new crop from the
   original). This is why V7 keeps the circle.
9. **V6 was unverified when this was written.** Do not claim V7 complete on static
   checks alone; the colour system is judged in a browser. (Done — see the browser
   verification in §18.)
10. **Borderless media can lose its edge.** `--surface-bed` is 1.25:1 against the
    white canvas, so a screenshot with a white background may bleed. If that happens,
    restore a 1px hairline on media only — `--rule` first, `--rule-strong` if it still
    bleeds — rather than darkening the bed; a 3:1 bed would be too heavy behind
    screenshots.

---

## 16. Open decisions (owner)

| # | Decision | Recommendation |
|---|---|---|
| 1 | Exact ultramarine: `#1a0de0` (reference-like) or a slightly deeper `#1508c9`? | `#1a0de0` — 9.64:1 and it is the point of the reference |
| 2 | Footer: ultramarine field (rec.) / ink `#0b0b14` / white with a top rule? | Ultramarine. It keeps the dark-field rhythm, uses the accent once as a ground, and is a two-token revert to ink if it reads as a brand block (§6.11). |
| 3 | Serif scope: `h1+h2+outcome/publication h3` (rec.) or `h1+h2` only? | Both editorial `h3` roles; records stay sans |
| 4 | Give up navy entirely? | Yes. Ink replaces it; no second dark blue. |
| 5 | Asymmetric section heads above 1120px? | Yes; the h2 column is too narrow at 901–1120px. Revert to the stacked head if any of the eight looks unbalanced above 1120px |
| 6 | Portrait: keep the natural photo (rec.) or duotone? | Keep. Credibility over costume. Keep the circular crop too: the shipped asset is a circle mask on transparency, so a square frame shows the same circle (§15.8). |
| 7 | Keep the rotating typed line under a much louder headline? | Keep; it is the page’s only voice in motion. If it competes, pause it by default rather than delete it. |
| 8 | Register: dense rows (rec.) or image-led grid? | Dense rows; §8 has the numbers |
| 9 | Underline form fields or square boxes? | Underline for inputs, box for textarea |
| 10 | Remove the header shadow entirely? | Yes; `.is-scrolled` changes the rule colour only |
| 11 | Replace the green tree favicon? | Out of scope here, but it is the last off-palette asset; a blue monogram would finish the identity (needs an asset decision) |
| 12 | Regenerate `og-cover.jpg` in the new palette? | No; it is a neutral DERLA screenshot and is not part of the page |

---

## 17. Recommendation

Do Phase 1 first and look at the hero and one section head in a browser. The palette
and the serif headline are 80% of the effect; if they do not feel right, stop before
touching the register or the form.

The intended experience:

> The page looks like a printed argument: white paper, one blue ink, serif for what
> matters and sans for what is recorded. It is related to the reference by colour and
> typography, not by borrowed drawings.

---

## 18. Implementation record — 13 November 2026

### What changed

- **Phase 1 (palette and type).** `:root` rewritten: white canvas and surface,
  `--surface-paper`/`--surface-bed`/`--surface-tint`, new ink ramp, one ultramarine
  `--action`/`--action-hover`/`--action-soft`, periwinkle `--tint`, footer on-dark
  ramp. `--navy`, `--navy-deep`, the three `--wash-*`, `--shadow-header` and
  `--surface-muted` are gone; every usage was remapped first. Serif applied to
  `.brand__name`, `.hero h1` (with `h1 em` reset to `font: inherit`), `.section-head
  h2`, `.outcome h3` and `.publication-highlight__body h3`. Hero wash deleted, header
  shadow deleted (`.is-scrolled` now only deepens the bottom rule), graphs recoloured,
  `::selection` uses the periwinkle tint, footer is ultramarine.
- **Phase 2 (shape and components).** Buttons, skip link, copy button are pills;
  tags are 2px labels with a `--rule-strong` hairline; media and panels are square
  and borderless on `--surface-bed`; the portrait outline is gone (circle mask kept);
  eyebrow node, nav toggle, typed toggle and register arrows are circles; register
  arrow column is 40px (36px at ≤420); filters lose their dividers, gain the
  `filters__label` sibling and a blue pressed underline; inputs are underline fields
  with a boxed textarea; section heads become the `"eyebrow eyebrow" / "title intro"`
  grid above 1120px; the award note is the single tinted surface with a 2px action
  left rule.
- **Phase 3 (cleanup and documentation).** Dead navy/wash/shadow rules removed;
  radii normalised to 0/2px/pill/circle; print block updated (block section head,
  hidden filter label, black eyebrow node, `#999` tag hairline); forced colours gain
  the pill border; `AGENTS.md` and `README.md` updated; V6 marked as the previous
  motion record.
- `index.html`: `theme-color` `#FFFFFF`; `p.filters__label#filters-label` added
  immediately before `.filters`; `aria-labelledby="filters-label"` replaces the
  `aria-label`. No other markup change. `js/site.js` is untouched (`git diff -- js/`
  is empty).

### Deviations from the written plan

1. **Nav current/hover weight stays 500, not 600.** The plan's comparison table asks
   for 600, but the scrollspy flips `aria-current` while scrolling; a weight change
   would reflow the three links mid-scroll. Blue plus the existing 2px underline carry
   the state instead.
2. **Teaching rows hover to `--surface` (white), not `--surface-paper`.** Knowledge
   transfer is a `.section--muted` paper band, so a paper hover would be invisible.
   The plan's §6.8 rule was written for a white band. Project rows, on white, do use
   `--surface-paper`.
3. **`.text-link` gets its rest underline from the existing pseudo-element.** The
   line is 1px at rest and 2px on hover/focus by animating `height`; using
   `border-bottom-width` would have shifted baseline boxes by 1px. This also means the
   V5 left-to-right draw is retired for these two links, as §6.4 intends.
4. **Dead hero rules removed.** The forced-colours and print `background-image: none`
   blocks for `.hero` were deleted with the wash they guarded. No other rule was
   removed.
5. **Portrait stays circular**, per open decision 6; the shipped asset is a circle
   mask on transparency.

### Static verification

- `git diff --stat`: `css/custom-styles.css` +220/−147, `index.html` +3/−2; `js/`
  diff empty (`redesignv7.md` was untracked at the time of writing).
- Braces balanced; every `var(--token)` has a definition; no retired token appears.
- 21 project cards, 20 teaching links, one `h1`, eight `.section-head`s; ids unique;
  every fragment link resolves; every local `src`/`href`/`url()` target exists.
- No CDN, no second stylesheet, no legacy font names; only the print block uses raw
  hex outside the token block; no raw radii, font sizes or `transition: all`.
- Exactly two `infinite` animations (caret blink, in-flight submit sweep) and two
  `IntersectionObserver`s; `animation-timeline: view()` only on the CV spine.
- `gjs js/site.js` stops at `document is not defined`, i.e. syntax is valid.

### Browser verification — same day

Walked in Chrome against `python3 -m http.server 8000`, with emulated viewports from
320 to 1440px and `prefers-reduced-motion` / `forced-colors` toggled. V6 was compared
from a detached worktree of `9748890` on port 8001. Nothing broke structurally; the
one gate that is not strictly met and five pre-existing quirks are listed at the end
and were left unchanged.

- **Layout.** No horizontal overflow at 320/360/390/420/480/640/641/768/900/901/1024/
  1120/1121/1280/1440 (`scrollWidth == clientWidth` at every width). The nav toggle
  appears at ≤900 as a 42px circle and is absent above; the header is 72px and
  64px once scrolled. The register is 2-up above 900 and 1-up at 900; media runs
  112/88/84/72px at >1120 / 901–1120 / 641–900 / ≤420, and the arrow is 40px, 36px
  at ≤420. The filter grid is three columns at ≤640. The section head is a 760px/691px two-column
  grid at 1121 and `display: block` at exactly 1120.
- **Type.** Serif resolves to exactly five roles — wordmark 600, `h1` 500, `h2` 500,
  outcome `h3` 400, publication `h3` 400. Capability, teaching, CV and register
  headings, the hero lead and the typed line stay IBM Plex Sans. The `h1` takes five
  lines at 360 (37.6px) and 420 (42px), three at 641, two at 900, five at 1120 and
  five at 1440; the eight `h2`s take two to three lines at 360 and none overflows its
  column at any width. The reserved typed-line height (30px at ≥640, 59px at
  360/420) holds across all three phrases.
- **Hero height against V6 (gate).** 360: 1419 → 1419; 420: 1385 → 1443; 641: 1247 →
  1250; 900: 1235 → 1237; 1120: 878 → 878; 1440: 926 → 934. Equal at 360 and 1120,
  +2–8px above 640, and **+58px at 420**, where the serif `h1` wraps to five lines
  instead of four. This is accepted, not a miss: §7's fallback triggers only when the
  serif costs *more than one line* ("keep its V6 size; do not enlarge"), and at 420
  the extra height is exactly one line of `--display-1-stacked`. No size change was
  made, so the stack at 360 and the two-column density above 640 stay as specified.
- **Interaction.** Nav disclosure opens/closes, sets `aria-expanded`, closes on Esc
  (focus returns to the toggle) and on an outside click, has no scroll lock, and moves
  focus to the target section on link click. Scrollspy marks Expertise/Work/Experience
  with `aria-current="location"` without changing weight. Filters show "Showing 9 of
  21 projects", load-more goes 9 → 18 → 21 with `.is-settling` on the new cards, and
  the control hides when the filter is exhausted. Copy e-mail swaps to "Copied" with a
  check for ~2s and keeps the `mailto:`. The form marks invalid fields, shows the
  sending sweep, the teal success check and the error message.
- **Motion and states.** The typed line types, holds, erases and advances; pause
  completes the phrase and swaps label/icon; a mid-cycle reduced-motion change settles
  to phrase 1 with no caret, toggle or reserved height. The arrival rule draws once
  (~600ms) and removes its class at ~900ms; decorative rules and the footer graph draw
  once; the CV spine fills through `view()` and resolves markers; the 2px header
  progress runs 0 → 0.42 → 1 with no shadow. Hover: paper row, blue underlined title,
  thumbnail scale 1.025 and a 3px icon shift inside a static circle; teaching rows
  stay white; `.text-link` goes 1px → 2px. Focus rings are 2px `--action` at 3px
  offset (typed toggle 2px), white in the footer; the skip link is an ink pill with a
  blue ring.
- **Colour and fallbacks.** h1 9.64:1, body 10.76:1, labels 6.33:1, footer muted
  6.87:1 on ultramarine — all pass. In forced colours the graphs and header progress
  disappear, pressed filters gain a real underline, and rules, circles and the pill
  border use `CanvasText`. Under reduced motion there is no typing, caret, draw, spine
  fill, settle, thumbnail scale or View Transition.

### Follow-up pass — same day

Three findings from the walk were fixed in `css/custom-styles.css`; `index.html` and
`js/site.js` are still untouched.

1. **Footer graph resized.** `width: min(46%, 520px)` → `clamp(150px, 17vw, 300px)`,
   still right-anchored and vertically centred, `--tint` at 0.45. A sweep of widths
   from 160 to 520px against every footer text box at 901/1024/1121/1280/1440/1680px
   put the largest collision-free width at 160px (901), 200 (1024), 220 (1121),
   280 (1280) and 340 (1440–1680); 17vw stays under each of them. Re-measured after
   the change: zero intersections at 901/1024/1121/1280/1440/1920, no horizontal
   overflow, footer height unchanged (349–363px), ratio 1.31, opacity 0.45. The graph
   is now a bookend on the footer's empty right edge rather than a field behind the
   ORCID and GND identifiers.
2. **Print heading sizes now apply.** The bare `h1 { 24pt }` / `h2 { 16pt }` lost to
   the component selectors and were dead; they are now `.hero h1` and
   `.section-head h2`, and `.outcome h3` / `.publication-highlight__body h3` are set
   to 12pt so the serif case titles stay below the 16pt section statement. With the
   print rules injected at 794px: h1 32px on two lines, h2 21.33px, case and
   publication h3 16px, capability h3 20px, CV column h3 18px, h4 16px, all headings
   black, header hidden, body 14px.
3. **Contact e-mail matches §6.10.** Underline at rest at 1px (`--rule-hair`) and 2px
   on `:hover`/`:focus-visible` (`--rule-accent`), 3px offset. Computed values
   verified at rest and on hover; the element's height is unchanged at 33px, so the
   contact column does not reflow.

### Verification caveats

Print was checked by injecting the extracted `@media print` rules at 794px (A4)
because the DevTools emulation has no media-type switch; Letter was not checked.
JavaScript cannot be disabled over MCP, so the no-JS state was verified by removing
`js-ready`/`motion-ready`/`typed-ready` and reading the CSS.

### Left unchanged, deliberately

1. **Filter tabs are centred inside their cells at ≤640px.** §11's responsive table
   keeps the three-column filter grid and the count row as they are at that width;
   the centre alignment is part of that grid, not a leftover to correct. Left-aligned
   labels would also break the shared cell rule the pressed underline relies on.
2. **Scrollspy stays on Experience over Contact and Imprint** (only three primary
   links exist). Pre-existing behaviour in `site.js`, which V7 does not touch.
3. **One console issue** asks for explicit dimensions on
   `images/portfolio/13_derla_book.webp`; the element has `width`/`height` and a
   computed `aspect-ratio` of `533 / 802`, so this is a DevTools false positive.
4. **`.brand__descriptor` hides only at ≤640px**, as in V4; at 900 it is one 289px
   line inside an 885px header, so nothing clips.


---

## Appendix A — implementation map

| File / selector | Change |
|---|---|
| `:root` | Palette per §3.1; `--radius*`; `--tracking-serif`; remove navy/wash/shadow/`--surface-muted` |
| `body`, `.section--muted` | White canvas; paper bands |
| `h1, h2` | `font-family: var(--font-serif)`, weight 500, `color: var(--action)`, `--tracking-serif` (−0.015em) |
| `.hero h1 em` | Delete the rule, or `font: inherit; color: inherit; letter-spacing: inherit` (it currently sets its own serif/400/tracking) |
| `.brand__name` | Serif, `--display-4`, `--action` |
| `.site-header`, `.site-header.is-scrolled` | No shadow, no `box-shadow` term in the transition; scrolled border `--rule-strong` |
| `.nav__link` | Ink; blue + underline on hover/current |
| `.nav-toggle` | Circle (`--radius-circle`), hairline unchanged |
| `.btn` | Pill, wider inline padding |
| `.btn--primary`, `.btn--outline` | `--action` / `--action-hover` replace navy/navy-deep; outline hover loses its navy border |
| `.tag` | 2px radius, transparent, `--rule-strong` hairline |
| `.tag--status`, `.cv-summary__badge` | Navy → ink / `--action` |
| `.text-link` | Already `--action`; only the underline thickness changes |
| `.skip-link` | Pill; `--ink` ground, white text (was navy) |
| `.hero` | Remove wash |
| `.hero__graph` | Blue 12% |
| `.hero__profile` | Square, 1px rule |
| `.profile__portrait img` | Remove the 6px offset outline; `background: transparent` (keep the circular crop) |
| `.section-head` | Grid areas above 1120px (collapse inside the existing `max-width: 1120px` block); fix `.eyebrow` specificity with `> p:not(.eyebrow)`; serif h2 |
| `.eyebrow` | `--tracking-label: 0.12em`; `.eyebrow::before` becomes an 8px circle (`--radius-circle`) |
| `.outcome__media`, `.project-card__media`, `.publication-highlight__media` | Square, borderless, bed |
| `.outcome h3`, `.publication-highlight h3` | Serif 400 ink |
| `.award-note`, `.cv-summary`, `.delivery-path::before` | Square; navy left rule / top rule → `--action` |
| `.filters`, `.filter-btn` | Visible `.filters__label` sibling (JS-only reveal); no vertical dividers; blue pressed + underline |
| `.project-card__arrow` | 40px hairline circle, 16px arrow (36px ≤420) |
| `.project-card__link` | `112px … 40px` arrow column; hover/focus on `--surface-paper` |
| `.work-more` | Outline pill |
| `.copy-btn` | Pill, hairline, ink-soft |
| `.field input, textarea` | Underline / square box |
| `.site-footer` | `--action` ground; periwinkle graph; white serif wordmark |
| `@media (forced-colors)` | `.btn` border `CanvasText`; primary pill `ButtonFace`/`ButtonText`; tags, circles and underlines `CanvasText` |
| `@media print` | Black serif headings; `.section-head { display: block }`; `.filters__label` hidden; `.eyebrow::before` forced `#000`; `.tag` border `#999` on white; flatten tints; hide `.copy-btn` |
| `index.html` | `theme-color` → `#FFFFFF`; `p#filters-label` immediately before `.filters`; `aria-labelledby` replaces `aria-label` |

## Appendix B — what must stay true

- One `h1`; all ids and fragment links; `#announcements` alias.
- 21 project cards, 20 teaching links, three outcomes, four evidence items each.
- Editorial order; German `lang="de"`; no content rewrite.
- No build, no package manager, no CDN, no new fonts, no JS change.
- Content never hidden pending JS; filters/load-more still JS-only.
- Print remains a concise CV; forced colours and reduced motion keep explicit blocks.
- The typed line keeps its pause control and static accessible sentence.
- The CV spine keeps its `@supports` gate and static fallback.
- `opencode.jsonc` is never staged.

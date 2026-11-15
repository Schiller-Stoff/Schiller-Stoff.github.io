# Language switch (EN ↔ DE) — design and CSS specification

Status: **implemented** in V16 (15 Nov 2026). §9 records the deviations made
during implementation. The specification below is the design as it was applied,
kept as the rationale for the CSS and markup that now ship.

Prerequisite: a `de/` directory holding the five German counterparts
(`de/index.html`, `de/storymap.html`, `de/memor.html`, `de/ai-agents.html`,
`de/ai-coding.html`). Those pages now exist and are generated; see
`i18n/README.md`.

---

## 1. The object, and why it is this object

A **two-cell segmented pill** sitting in the navbar: `EN` set as the current language, `DE`
as the link to the counterpart page. It is one anchor plus one current `<span>`, with
`hreflang` on the anchor, so it is complete with JavaScript off, inside the mobile
disclosure, and in `view-source`.

It borrows the site's only state language — a heavier stem plus a 2px ultramarine rule —
instead of inventing a second one, so "you are here" looks the same in the language switch
as it does in the section nav. It stays **72 × 34px**, which leaves **118px of slack** at the
tightest desktop width (901px), so nothing in the header has to be hidden or moved.

One markup shape, two shells: the same `div.lang-switch` is the last child of `.nav__menu`
on the CV and the last child of `.sm-head__inner` on the four standalone pages. The only
shell-specific CSS is one alignment rule inside §18's ≤900 block (§3.3) and one margin in
§19's ≤640 block (§3.4) — the component itself is shell-agnostic, so it cannot drift into
two components.

Sketch (12px caps, 0.12em tracking, 1px `--rule-strong` pill, 1px `--rule` divider):

```
  ┌───────────┬───────────┐
  │  EN       │   DE      │    EN = --ink, 600, 2px --action rule, 4px offset  (current)
  │  ──       │           │    DE = --ink-soft, 500, no rule, pointer         (link)
  └───────────┴───────────┘
    34.7px      34.2px          pill: 72 × 34 (1px border + 32px cells)
```

---

## 2. Markup

### 2.1 The canonical shape (copied verbatim into every page)

English page:

```html
<div class="lang-switch" role="group" aria-label="Language">
  <span class="lang-switch__item" lang="en" aria-current="true">EN<span class="visually-hidden"> — current language</span></span>
  <a class="lang-switch__item" href="de/index.html" hreflang="de" lang="de">DE<span class="visually-hidden"> — Deutsch</span></a>
</div>
```

German page:

```html
<div class="lang-switch" role="group" aria-label="Sprache">
  <a class="lang-switch__item" href="../index.html" hreflang="en" lang="en">EN<span class="visually-hidden"> — English</span></a>
  <span class="lang-switch__item" lang="de" aria-current="true">DE<span class="visually-hidden"> — aktuelle Sprache</span></span>
</div>
```

Only three things change between pages: the `href`, which item is the `<span>` /
`aria-current`, and the `aria-label` on the group (`Language` / `Sprache`). The visible
labels are always `EN` and `DE`, in that order, on both languages of the page — the order is
part of the pattern, not a state, so the control never jumps.

Rules that the markup obeys:

* **No `<select>`, no `<button>`, no `aria-expanded`, no `data-` hook, no script.** Two
  anchors and one span.
* **Never `.nav__link`.** Scrollspy selects `.nav__links a[href^="#"]`; the switch lives
  outside `.nav__links`, its `href` is a page, and `.nav__link` carries an underline/active
  recipe that would fight the current-language rule.
* **No editorially relevant class.** `.lang-switch` is never combined with `html.js-ready`,
  `html.motion-ready`, `html.typed-ready` or `html.nav-ready` for *visibility*. `nav-ready`
  appears once, in the mobile *alignment* rule (§3.3) — it positions, it never hides.
* `<span class="visually-hidden">` is used, never `aria-label`, so the visible `DE` stays
  the text that voice control says, and the full language name is available to a screen
  reader.

### 2.2 CV shell — `index.html` (EN), inside `.nav__menu`, after the CTA

Replace lines 171–181 of `index.html` with exactly this (the three nav links and the CTA are
reproduced unchanged, so the block can be pasted as a whole):

```html
      <div class="nav__menu" id="site-menu" data-nav-menu>
        <nav class="nav__links" aria-label="Primary">
          <a class="nav__link" href="#services-section">Services</a>
          <a class="nav__link" href="#portfolio-section">Work</a>
          <a class="nav__link" href="#cv-section">Experience</a>
        </nav>
        <a class="btn btn--primary nav__cta" href="#contact-section">
          Start a project
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
        </a>
        <div class="lang-switch" role="group" aria-label="Language">
          <span class="lang-switch__item" lang="en" aria-current="true">EN<span class="visually-hidden"> — current language</span></span>
          <a class="lang-switch__item" href="de/index.html" hreflang="de" lang="de">DE<span class="visually-hidden"> — Deutsch</span></a>
        </div>
      </div>
```

### 2.3 CV shell — `de/index.html` (DE), inside `.nav__menu`, after the CTA

```html
      <div class="nav__menu" id="site-menu" data-nav-menu>
        <nav class="nav__links" aria-label="Primäre Navigation">
          <a class="nav__link" href="#services-section">Leistungen</a>
          <a class="nav__link" href="#portfolio-section">Arbeit</a>
          <a class="nav__link" href="#cv-section">Erfahrung</a>
        </nav>
        <a class="btn btn--primary nav__cta" href="#contact-section">
          Projekt starten
          <svg class="icon" aria-hidden="true"><use href="#i-arrow-right"></use></svg>
        </a>
        <div class="lang-switch" role="group" aria-label="Sprache">
          <a class="lang-switch__item" href="../index.html" hreflang="en" lang="en">EN<span class="visually-hidden"> — English</span></a>
          <span class="lang-switch__item" lang="de" aria-current="true">DE<span class="visually-hidden"> — aktuelle Sprache</span></span>
        </div>
      </div>
```

Anchor ids (`#services-section`, `#portfolio-section`, `#cv-section`, `#contact-section`) are
the public contract and stay identical in German — only the link text is translated.

### 2.4 Standalone shell — `storymap.html` (EN)

The switch is the **last child of `.sm-head__inner`**, after `.sm-head__nav`, so it lands on
the masthead's right edge in every width, exactly where it lands on the CV:

```html
  <header class="sm-head">
    <div class="container sm-head__inner">
      <a class="brand" href="index.html">
        <span class="brand__name">Sebastian SchillerStoff</span>
      </a>
      <p class="sm-head__note"><span class="label">Storymap</span> DERLA</p>
      <nav class="sm-head__nav" aria-label="Storymap">
        <a href="index.html#storymap-feature">Back to the CV</a>
        <a href="memor.html">The last addresses</a>
        <a href="#colophon">Colophon</a>
      </nav>
      <div class="lang-switch" role="group" aria-label="Language">
        <span class="lang-switch__item" lang="en" aria-current="true">EN<span class="visually-hidden"> — current language</span></span>
        <a class="lang-switch__item" href="de/storymap.html" hreflang="de" lang="de">DE<span class="visually-hidden"> — Deutsch</span></a>
      </div>
    </div>
  </header>
```

Note: `storymap.html`'s brand currently reads `Sebastian SchillerStoff` (no hyphen) while
the other four pages read `Sebastian Schiller-Stoff`. The snippet above reproduces the file
as it is; the switch does not touch the wordmark, and this specification takes no position
on which spelling is right.

### 2.5 Standalone shell — `de/storymap.html` (DE)

German standalone pages live **inside `de/`**, so sibling pages stay relative (`memor.html`
resolves to `de/memor.html`) and everything in the English root is one level up (`../`).
Local fragments (`#colophon`) are unchanged.

```html
  <header class="sm-head">
    <div class="container sm-head__inner">
      <a class="brand" href="../index.html">
        <span class="brand__name">Sebastian Schiller-Stoff</span>
      </a>
      <p class="sm-head__note"><span class="label">Storymap</span> DERLA</p>
      <nav class="sm-head__nav" aria-label="Storymap">
        <a href="../index.html#storymap-feature">Zurück zum CV</a>
        <a href="memor.html">Die letzten Adressen</a>
        <a href="#colophon">Kolophon</a>
      </nav>
      <div class="lang-switch" role="group" aria-label="Sprache">
        <a class="lang-switch__item" href="../storymap.html" hreflang="en" lang="en">EN<span class="visually-hidden"> — English</span></a>
        <span class="lang-switch__item" lang="de" aria-current="true">DE<span class="visually-hidden"> — aktuelle Sprache</span></span>
      </div>
    </div>
  </header>
```

### 2.6 The other three standalone pages

Same two snippets as §2.4 / §2.5 with the hrefs below; the masthead's `aria-label`
(`Storymap` / `Practice note`) and the note text are the page's own copy and are not part of
this component. In German `Practice note` is `Praxisnotiz`.

| page | language of the page | `href` of the **other** cell | `aria-label` on the group |
| --- | --- | --- | --- |
| `index.html` | EN | `de/index.html` | `Language` |
| `de/index.html` | DE | `../index.html` | `Sprache` |
| `storymap.html` | EN | `de/storymap.html` | `Language` |
| `de/storymap.html` | DE | `../storymap.html` | `Sprache` |
| `memor.html` | EN | `de/memor.html` | `Language` |
| `de/memor.html` | DE | `../memor.html` | `Sprache` |
| `ai-agents.html` | EN | `de/ai-agents.html` | `Language` |
| `de/ai-agents.html` | DE | `../ai-agents.html` | `Sprache` |
| `ai-coding.html` | EN | `de/ai-coding.html` | `Language` |
| `de/ai-coding.html` | DE | `../ai-coding.html` | `Sprache` |

`hreflang` is always the language of the **target** (`de` from English pages, `en` from
German pages). `lang` is always the language of the **label text** — the same value here,
for a different reason.

### 2.7 Not part of this component, but required by it

In each `<head>`, one reciprocal pair so the two versions are discoverable as alternates
(the switch alone does not tell a crawler that they are a translation pair):

```html
<link rel="alternate" hreflang="de" href="https://schiller-stoff.github.io/de/index.html">
<link rel="alternate" hreflang="en" href="https://schiller-stoff.github.io/">
<link rel="alternate" hreflang="x-default" href="https://schiller-stoff.github.io/">
```

Also per page, outside this component: `<html lang="de">`, the translated `<title>`,
`meta description`, `og:locale` (`de_DE`) and `canonical` pointing at the page's own URL.

---

## 3. CSS

Everything below is written against the existing `:root` tokens: no new colour, no new type
size, no new radius. The 4px underline offset and the 32px cell height are the only raw
lengths, and both have precedent in the file (`text-underline-offset: 4px` at line 4196,
`min-height: 38px` on `.nav__cta`).

### 3.1 §6 — the component (insert at the end of `6. Header and navigation`)

Insert after `.nav-open .nav-toggle__close { display: block; }` (ends line 721) and before
the `7. Hero and profile` banner (line 723):

```css
/* Language switch (EN | DE). Navigation, not a control: two cells, one link, one
   current item, no script and no html.* gate. Cells are 32px so the target
   clears 32px inside a 72px (desktop) or 64px (mobile) header; the pill is
   34px tall because of its 1px border. The pill's own baseline is the "EN"
   text baseline, so §19's baseline-aligned masthead needs no override. */
.lang-switch {
  display: inline-flex;
  align-items: stretch;
  flex: none;
  overflow: hidden; /* clips the hover wash to the pill's curve */
  border: var(--rule-hair) solid var(--rule-strong);
  border-radius: var(--radius-pill);
  background: var(--surface);
  font-size: var(--text-xs);
  font-weight: 500;
  line-height: var(--leading-dense);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  white-space: nowrap;
}

.lang-switch__item {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding-inline: var(--space-xs);
  color: var(--ink-soft);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.lang-switch__item + .lang-switch__item {
  border-left: var(--rule-hair) solid var(--rule);
}

/* The inactive half is the only interactive one, so it is the only one that
   takes a pointer state. --surface-paper is the site's hover ground. */
a.lang-switch__item:hover,
a.lang-switch__item:focus-visible {
  background: var(--surface-paper);
  color: var(--ink);
}

/* The ring belongs to the cell, not to the pill: an inset ring cannot be
   clipped by the wrapper and cannot be mistaken for "the switch" as a whole. */
a.lang-switch__item:focus-visible {
  outline-offset: -3px;
}

/* Current language: weight plus a 2px rule, never colour alone. No fill on
   purpose — --surface-paper is already the hover ground, so a filled half
   would read as a hovered half. */
.lang-switch__item[aria-current="true"] {
  color: var(--ink);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: var(--action);
  text-decoration-thickness: var(--rule-accent);
  text-underline-offset: 4px;
}

/* The hidden clarifier is a sentence, not a label: it must not inherit the
   uppercase and the tracking, or some AT reads it as shouted. */
.lang-switch__item .visually-hidden {
  letter-spacing: normal;
  text-transform: none;
}
```

Why each non-obvious declaration is there:

* `align-items: stretch` + `min-height` on the cell: both cells are exactly as tall as the
  pill's inner box, so the divider runs edge to edge and neither half is a slippery 24px.
* `flex: none`: the pill must never be the thing that shrinks when the desktop row is tight.
* `overflow: hidden`: the hover wash is a rectangle inside a `--radius-pill` box; without
  clipping, its square corners would paint outside the pill's curve at both ends.
* `white-space: nowrap`: a two-character label can never be split by a narrow flex line.
* `outline-offset: -3px`: the global `:focus-visible` uses `offset: 3px`, which would draw
  the ring outside the pill's border (and over the divider) and would be clipped by
  `overflow: hidden` on the wrapper. Inset is the site's existing precedent — the hero index
  panes use a ring inside the pane.
* `text-decoration-thickness: var(--rule-accent)` + `text-underline-offset: 4px`: "EN" has
  no descenders, so a 2px rule 4px under 12px caps sits cleanly inside the 32px cell.

### 3.2 §19 — the standalone masthead (no base rule needed)

**Nothing is added to §19 at base width.** `.sm-head__inner` is `align-items: baseline`, and
the pill's baseline is its own text baseline, so `EN`/`DE` sit on the same baseline as the
serif brand, the caps note and the three nav links. That shared baseline is as close to
correct as this masthead gets; a variant rule would only move existing text.
Consequence to accept: the masthead's single line box grows from ~27.6px to 34px once, i.e.
each standalone masthead becomes ~6px taller. No breakpoint changes.

### 3.3 §18 — mobile disclosure (`@media (max-width: 900px)`, after `html.nav-ready .nav__cta`)

Insert immediately after `html.nav-ready .nav__cta { width: 100%; }` (ends line 3045):

```css
  /* The switch is a row, not another full-width nav link: it keeps its own
     width and sits on the CTA's right edge. Without JS the panel is in flow
     and the switch is already a content-sized item after the CTA, so nothing
     is needed there. */
  html.nav-ready .nav__menu > .lang-switch {
    align-self: flex-end;
  }
```

`align-self: flex-end` (not `stretch`) is what stops the segment from becoming a 100%-wide
bar in the column panel.

### 3.4 §19 — `@media (max-width: 640px)`, after `.sm-head__nav { width: 100%; }`

Insert after `.sm-head__nav { width: 100%; }` (ends line 4125):

```css
  /* The nav row is full width here, so the switch lands on its own line; the
     caps note above already holds the right edge, so the pill joins it instead
     of being stranded at the left. */
  .sm-head__inner > .lang-switch {
    margin-left: auto;
  }
```

### 3.5 §20 — forced colours (after `.filter-btn[aria-pressed="true"]::after, .nav__link::after`)

Insert after that rule (ends line 4202):

```css
  /* The switch survives as borders, weight and a 2px rule — the same three
     cues as in colour. The wash is removed with the colour it came from. */
  .lang-switch {
    background: Canvas;
    border-color: CanvasText;
  }

  .lang-switch__item {
    color: CanvasText;
  }

  .lang-switch__item + .lang-switch__item {
    border-left-color: CanvasText;
  }

  .lang-switch__item[aria-current="true"] {
    text-decoration-color: CanvasText;
  }

  a.lang-switch__item:hover,
  a.lang-switch__item:focus-visible {
    background: Canvas;
    color: CanvasText;
  }
```

### 3.6 §22 — print (two additions, one per shell)

In the CV's print hide list add `.lang-switch` after `.site-header` (line 4721). It is
already invisible because `.site-header` is hidden, but the entry documents the intent and
survives any future change to the header's print behaviour:

```css
  .site-header,
  .lang-switch,
  .nav-toggle,
```

In the standalone pages' print block add `.lang-switch` after `.sm-head__nav` (line 5001) —
this one is load-bearing, because `.sm-head__inner` (brand + caps note) does print:

```css
  .sm-head__nav,
  .lang-switch,
  .sm-rail,
  .sm-foot,
  .sm-colophon__back {
```

### 3.7 §21 — motion: no entry

The only declared transition is `background-color`/`color` at `--dur` (160ms) with
`--ease`; there is no `animation`, no transform, no opacity, no entrance. The existing
`prefers-reduced-motion: reduce` block therefore needs nothing: colour fades are not motion
and the site keeps them everywhere else (`.nav__link`, `.sm-head__nav a`).

---

## 4. State table

| State | What is on screen | Rule that produces it |
| --- | --- | --- |
| **default** | 34px pill, 1px `--rule-strong` edge, 1px `--rule` divider, both cells `--surface`; current cell `--ink` 600 with a 2px `--action` underline at 4px; other cell `--ink-soft` 500, no rule | `.lang-switch`, `__item`, `__item + __item`, `[aria-current="true"]` |
| **hover** (inactive half, fine pointer) | that half takes a `--surface-paper` ground and `--ink` text; 160ms colour/background fade; pointer cursor | `a.lang-switch__item:hover` |
| **focus-visible** | 2px `--focus` (= `--action`) ring drawn *inside* the cell, 1px in from its edge, plus the paper ground, so a keyboard user sees the whole target | `a.lang-switch__item:focus-visible` + `outline-offset: -3px` |
| **current** (the language of the page) | `--ink`, weight 600, 2px `--action` underline, text cursor, not focusable, not a link | `.lang-switch__item[aria-current="true"]` |
| **pressed** (pointer down on the inactive half) | no change — no `translateY`, no darkening; a 34px pill that jumps 1px reads as jitter, and the navigation is the feedback | nothing declared |
| **visited** | no change: `a { color: inherit }` is overridden by the explicit `--ink-soft`, so a visited German link never turns purple | `.lang-switch__item` colour |
| **forced colours** | `Canvas` ground, `CanvasText` border, divider, text and underline; no wash; state = 600 weight + 2px underline (shape, not hue) | §3.5 |
| **print** | absent in both shells; the CV's printed header is gone entirely, the standalone reports print brand + caps note only | §3.6 |
| **no JS** | identical everywhere; the only difference is the mobile shell, where the switch is a content-sized item in the in-flow menu, 12px after the CTA (it may share the CTA's line), instead of a right-aligned row in the panel | §3.3 needs `nav-ready` for alignment only |
| **200% page zoom** (1440 → 720 CSS px) | the desktop shell is gone; the switch is the panel's last row, right-aligned, still 72 × 34 CSS px (144 × 68 device px) | §3.3 |
| **200% text-only zoom** | the pill grows with `rem` (labels 24px) but `min-height: 32px` keeps it 34px tall, so it still fits the fixed 72px header; the header's own fixed height is the pre-existing limit, not this component | §3.1 |

---

## 5. Width budget

### 5.1 Measurement assumptions (explicit)

All text widths are **measured**, not guessed: Pillow + the OFL variable builds of IBM Plex
Sans (`wdth` 100) and Source Serif 4 (`opsz` 20), at the exact CSS sizes from the
stylesheet, with `letter-spacing` added after every character (including the last). Expect
**±1px** per string and up to **+5%** if the webfont falls back to `system-ui`; §5.4 shows
the slack absorbs that.

Facts taken from the stylesheet, not from the screenshot:

| Quantity | Value |
| --- | --- |
| Container | `max-width: 1200px`, `padding-inline: clamp(20px, 4vw, 48px)` (border-box) |
| Row gap (`--space-lg`) between `.brand` and `.nav__menu` | 24px |
| `.nav__menu` gap | `clamp(20px, 3vw, 36px)` |
| `.nav__links` gap | `clamp(16px, 2.2vw, 28px)` |
| `.brand__name` | Source Serif 4, 600, `clamp(20px, 2vw, 25.6px)`, `-0.01em` = 204.3 / 228.7 / 261.5px |
| `.brand__descriptor` | IBM Plex Sans 500, 11px, `0.12em`, uppercase = **212.9px** (it, not the name, sets the brand width below 1120px) |
| Nav link (14px, 500) | Services 54.2 · Work 33.6 · Experience 71.5 = **159.3** |
| `.nav__cta` (14px, **600**, `min-height: 38`) | 2px border + 32px padding + 92.6 label + 8px gap + 14px icon = **148.6** |
| `.lang-switch` | 2px border + (8 + 18.7 + 8) + 1px divider + (8 + 18.3 + 8) = **72.0** (EN page; 72.0 on the DE page too) |

### 5.2 The header, before and after (English CV)

| Viewport | Gutter | Content width | Brand | 3 links + gaps | CTA | Switch | 2 menu gaps | Row total | **Slack** | Slack before |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **901** | 36.0 | 828.9 | 212.9 | 198.9 | 148.6 | 72.0 | 54.0 | **710.4** | **118.5** | 217.5 |
| **1000** | 40.0 | 920.0 | 212.9 | 203.3 | 148.6 | 72.0 | 60.0 | **720.8** | **199.2** | 301.2 |
| **1120** | 44.8 | 1030.4 | 228.7 | 208.5 | 148.6 | 72.0 | 67.2 | **749.0** | **281.4** | 387.0 |
| **1440** | 48.0 | 1104.0 | 261.5 | 215.3 | 148.6 | 72.0 | 72.0 | **793.4** | **310.6** | 418.6 |

Row total = brand + 24px row gap + (links + gap + CTA + gap + switch). Slack is what
`justify-content: space-between` puts between the brand and the menu.

### 5.3 What happens at 901px

**Nothing.** The switch costs 72px plus one 27px menu gap = 99px, leaving 118.5px of slack:

* `.brand__descriptor` is **not** hidden and no breakpoint moves. There is no width case for
  hiding it: it is the header's only explanation of what the name does, and at 901px the row
  would still fit with the descriptor *plus* another 118px of anything.
* The first thing that would give way is the brand's own line: `.brand` is `min-width: 0`, so
  the serif name would wrap before anything overflows. Keep that 118px as the reserve; a
  component addition that eats more than ~100px of it is a redesign, not a tweak.
* The German header is the tighter language, and it also fits: Leistungen 70.0 + Arbeit 39.5
  + Erfahrung 63.5 = 173.0 (+39.6 gaps = 212.6), CTA label `Projekt starten` 96.8 → CTA
  152.8, so the row at 901 is 212.9 + 24 + (212.6 + 27 + 152.8 + 27 + 72) = **728.3**, slack
  **100.6**.
* Consequence for the translator: at 901px the brand descriptor may grow from 212.9 to
  **313.5px** before the row exceeds the container, so a longer German descriptor
  ("Digitales Kulturerbe …") is safe up to roughly 28–30 characters at 11px.

### 5.4 The standalone masthead

`.sm-head__inner` is a **wrapping** flex row (`gap: 12px 32px`), so it degrades by wrapping
— never by overflowing. Brand has no descriptor here. Slack = content − (brand + note + nav +
switch + 3 × 32):

| Page (EN) | Note | Nav (3 links + 2 × 24) | 1440 (1104) | 1000 (920) | 901 (828.9) |
| --- | --- | --- | --- | --- | --- |
| `storymap.html` | 117.7 | 322.1 | 869.3 → 234.7 spare | 812.1 → 107.9 spare | 812.1 → **16.8 spare** |
| `memor.html` | 122.6 | 351.6 | 903.7 → 200.3 spare | 846.5 → 73.5 spare | 846.5 → wraps (17.6 over) |
| `ai-agents.html` | 178.2 | 331.3 | 939.0 → 165.0 spare | 881.8 → 38.2 spare | 881.8 → wraps (52.9 over) |
| `ai-coding.html` | 178.5 | 263.6 | 871.6 → 232.4 spare | 814.4 → 105.6 spare | 814.4 → **14.5 spare** |

At 901 two of the four are still one row (storymap 16.8px, ai-coding 14.5px spare) and two
wrap — a wrap is the shell's designed behaviour, not a defect: §19 already wraps the
masthead below 900. On the wrapped pages the switch stays on the nav's line, 32px after
`Colophon`, and moves to its own right-aligned line only at ≤640 (§3.4).

Absorbing the fallback-font case: +5% on every string in the 901 CV row ≈ +25px
(≈ 8 links, 4.6 CTA, 1.9 switch, 10.6 brand) — still 93px of slack.

---

## 6. Keyboard, focus and assistive technology

Tab order, unchanged except for one new stop at the end of the header:

* **CV, desktop (EN):** skip link → brand → *Services → Work → Experience → Start a project
  →* **DE** → main content. `aria-current` on the span is not a tab stop, so the switch costs
  exactly one Tab, and the current language is never a self-link.
* **CV, mobile panel open (EN):** brand → toggle → Services → Work → Experience → Start a
  project → **DE**; Esc and light-dismiss behave as before (`site.js` closes the panel on
  any anchor click, which is harmless because the language link navigates away).
* **Standalone (EN):** skip link → brand → 3 nav links → **DE**.
* **Standalone (DE):** skip link → brand → 3 nav links → **EN**.

Announcement: `Language, group` → `EN — current language` → `DE — Deutsch, link`. Two
deliberate redundancies:

1. **`aria-current="true"` on a `<span>`, not a link.** `aria-current` is a global state
   attribute, but support for it on non-interactive elements is uneven, so the span also
   carries a visually hidden clarifier. `"page"` was rejected because it is the token for a
   link to the current document; here there is nothing to navigate to.
2. **`lang` on both cells**, even where it repeats the page's language. It is a no-op on the
   English page and it makes the pattern mechanical to copy: every cell is tagged with the
   language of its own text (`EN` English, `DE` German), while `hreflang` names the target.

Target size: 34.7 × 34px (EN page), 34.2 × 34px (DE page) — above the 32px the brief asks
for, above WCAG 2.2 AA's 24px, inside both header heights (72 / 64px), with 8px of padding
inside each cell and 27–36px of clearance from the CTA.

The accessible name of the group is the only translatable string in the component besides
the hidden clarifier: `Language` → `Sprache`. Keep it a noun, not a verb ("Sprache wählen"),
so it reads as a label in a landmark list.

---

## 7. Deliberately rejected

| Rejected | Why |
| --- | --- |
| **`<select>` with `onchange`** | Needs script to navigate, is announced as a combobox whose options are destinations, renders as an OS widget in forced colours and print, and cannot be styled into this header without `appearance: none` surgery. It also makes the current language a *value* rather than visible text. |
| **Toggle button (`aria-pressed`, "EN/DE" switch)** | It is a state, not navigation: the URL must change. Without JS it is a dead button, and with JS it announces "pressed" with no destination. |
| **A link to the current page with `aria-current="page"`** | Adds a tab stop that reloads the document it is already on (losing scroll position, re-requesting the page) and claims a destination identical to the current URL. The span states "current item in a set" and costs nothing. |
| **Auto-detect / redirect on `navigator.language` or `Accept-Language`** | JS-only, so it fails the no-JS contract; it breaks deep links and the `canonical` URL, and it overrules a deliberate choice — a German-speaking visitor on an English OS, or an English reader in Graz, gets the wrong page with no visible switch. |
| **A floating corner widget / fixed badge** | Adds a second fixed layer over a header that is already `position: fixed; z-index: 100`, collides with the CTA at 901–1120, and contradicts "the header is the only chrome". |
| **Flag icons (🇬🇧/🇩🇪 or SVGs)** | Flags are states, not languages. The English page is not the United Kingdom; the German page is not Germany — this practice is based in Graz. Emoji flags do not render on Windows, never print, and would be the only image in the header. |
| **`<details>` / CSS-only dropdown** | Two options do not need a disclosure. It hides the target behind a click, needs its own affordance and state, and cannot be a single tab stop. |
| **Reusing `.nav__link`** | Scrollspy targets `.nav__links a[href^="#"]`, and `.nav__link` carries a 2px underline for hover *and* current section — two meanings of the same rule in one row. The switch is not a page section. |
| **Bare `EN` / `DE` text with a slash separator** | No affordance (nothing says "control"), fails target size, and in the mobile panel it reads as prose between two full-width rows. |
| **Hiding `.brand__descriptor` at 901–1120 to make room** | Unnecessary: 118px of slack remains at 901 (§5.3). The descriptor is the positioning line and the only thing that explains the serif name. |
| **Two instances (header + panel), switched by `display`** | Duplicate DOM, duplicate tab stops, and a `display: none` instance is the classic way a language switch ends up unreachable at one breakpoint. One instance, two layouts. |
| **`title="English"/"Deutsch"` for the full names** | Not available on touch, not reliably in the accessibility tree, and never printed. The hidden `<span>` does the job in every mode. |
| **A filled ultramarine half for the current language** | It would be the second blue field in the header (after the CTA) and it would collide with the hover ground: `--surface-paper` is both "hover" and "this half is set". Weight + a 2px rule is the site's established state language (`nav__link`), survives greyscale and forced colours without a special case, and keeps the header quiet next to the one real action. |

---

## 8. Implementation checklist

1. Create `de/` with the five German pages; the switch's `de/…` hrefs must resolve.
2. Paste §3.1 into §6 (before the §7 banner), §3.3 into the ≤900 block, §3.4 into the §19
   ≤640 block, §3.5 into the forced-colours block, §3.6 into both print blocks.
3. Paste the markup into all ten pages (five shells × two languages): §2.2/§2.3 for the CV,
   §2.4/§2.5 pattern for the eight standalone pages, hrefs from the §2.6 table.
4. Add the §2.7 `rel="alternate"` pairs and the per-page `lang`/`title`/`canonical` plumbing.
5. Invariants to check after the edit (add to `AGENTS.md` → Verify):

```bash
grep -c 'class="lang-switch"' index.html              # 1
grep -c 'class="lang-switch__item"' index.html        # 2
grep -c 'nav__link.*lang-switch\|lang-switch.*nav__link' index.html   # 0: never the nav link
grep -c 'aria-current="true"' index.html              # 1 (the scrollspy writes "location", not "true")
grep -c '<script' storymap.html memor.html ai-agents.html ai-coding.html  # still 0 each
grep -n 'lang-switch' css/custom-styles.css           # component (§6), ≤900, ≤640, forced colours, 2 print lists
grep -n 'animation' css/custom-styles.css | grep lang-switch             # no output
grep -c 'hreflang' index.html                         # 4: 1 in the switch + 3 head alternates (0 today)
```

6. Manual pass: JS off at 360px (switch visible in the in-flow menu, after the CTA), JS on
   at 360px and 900px (switch is a right-aligned row inside the panel, panel closes on
   click), 901/1000/1120/1440 (one row, no wrap, 118px+ slack), greyscale, forced colours
   (border + 600 + 2px underline still identify the current language), 200% zoom, and print
   preview on both shells (no switch, and the standalone masthead still shows brand + caps
   note).

---

## 9. As built

Implemented as specified, with these deviations and additions:

| Where | Deviation | Why |
| --- | --- | --- |
| §3 line numbers | The insertion anchors quote **pre-insertion** V15 line numbers (`line 721`, `723`, `3045`, …). They have shifted by the 109 lines this component added; locate the surrounding selectors, not the numbers. | The numbers were a review convenience, not a contract; renumbering them in a historical specification would only go stale again. |
| §2.3 German nav copy | Built from the catalog, which follows `i18n/glossary.md`: `Projekte`, `Werdegang`, CTA `Projekt anfragen`, nav `aria-label="Hauptnavigation"`. The design's `Arbeit`, `Erfahrung`, `Projekt starten`, `Primäre Navigation` are illustrative only. | The glossary wins. The nav labels were already catalog strings in the translators' files and were not touched. |
| §2.2–2.6 markup | The switch is **generator-owned** between `<!-- lang-switch:begin -->` and `<!-- lang-switch:end -->`, exactly like the head's `lang-alt` block. It is not hand-pasted per page. | Five pages × two languages is ten copies of one component; a single table in `tools/i18n/build_i18n.py` cannot drift. |
| Rendering | `--render-markers` (or `--extract`) renders the English region; `--build` renders the German one into `de/*`; `--check` compares each region against the rendering for its language, line indentation aside. | The region has to be verifiable, not just present. |
| §6 strings | `Language`, `Sprache`, `— current language`, `— aktuelle Sprache`, `— English`, `— Deutsch` live in `SWITCH_TEXT` in the generator, **not** in `i18n/de.json`. | Component chrome: putting them in the catalog would make the switch's own labels translatable page content and would recreate the drift the marker block prevents. They are documented in the generator's docstring. |
| Scans and parity | Both marker regions are excluded from the translatable-string scan and from the coverage/parity rules. | Otherwise the switch would invent untranslated keys, and its deliberately language-specific `lang`/label text would fail parity. |
| §2.7 alternates | Already present from phase A as the generator-owned `lang-alt` block. The CV's German alternate is `https://schiller-stoff.github.io/de/` (the real directory URL), not the design's `/de/index.html`; both resolve, and `de/index.html`'s canonical is `/de/`. | One table renders all three links in every page; no second absolute-URL convention. |
| §2.4 wordmark | Fixed `Sebastian SchillerStoff` → `Sebastian Schiller-Stoff` in `storymap.html`; the German page inherits it. | The design reproduced the typo but took no position; the other four pages were already correct. |
| Language check | A German page may contain `lang="en"` **only** inside the switch region (the EN cell). The old “no `lang="en"` on a German page” rule is enforced after excluding the region. | `lang` names the label's language, as specified in §6; the check's intent is “no English content left”, not “no English word at all”. |
| §3.1–3.6 CSS | Applied verbatim, tokens only. No CSS entry in §21, as specified. The CV print list gained `.lang-switch` even though `.site-header` already hides it. | §3.6's own rationale. |

Everything else — the two-cell pill, `EN` before `DE` in both languages, the `<span>` with
`aria-current="true"`, the `visually-hidden` clarifiers, the `hreflang`/`lang` pairs, the
34px target, the mobile alignment rule, forced colours and print — is as designed. The
design's §8.5 invariants still hold (`hreflang` 4 in `index.html`, one `aria-current="true"`,
no `nav__link` on the switch, no script on the four standalone pages); the §6 accessibility
contract and tab order are unchanged.

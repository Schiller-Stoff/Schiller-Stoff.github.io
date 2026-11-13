# Redesign plan v4 — “Evidence, clearly presented”

Status: implemented on this branch. Supersedes the visual direction in `redesignv3.md`; it does not undo the
accessibility, progressive-enhancement, performance, or content-integrity work delivered by v3. The later
V5 iteration (`redesignv5.md`) relaxes one V4 rule — it gates decorative ink for one-pass draws and adds a
finite hero scene — without changing the structure, hierarchy or content documented here.

Scope: fundamentally redesign the single page through `index.html` and `css/custom-styles.css`, with a
small simplification of `js/site.js`. Keep the static, no-build, no-framework architecture.

Primary audience: research directors, programme managers, cultural-heritage institutions, public-sector
partners, university leadership, technical leads, and hiring managers.

Primary goal: let a time-poor decision-maker understand **role, value, evidence, and fit in under 45
seconds**, then provide enough detail for technical and academic due diligence.

---

## 0. Executive decision

The present “Finding Aid” design is coherent and distinctive, but it frames the site as a personal
archive. Call numbers, catalogue labels, pink-grey paper tones, mono metadata, specimen captions, and the
continuous ruled spine ask visitors to decode a concept before they can assess the person. That is a good
editorial metaphor, but it is not the strongest corporate introduction.

V4 changes the framing:

> **A concise capability and evidence brief.** Lead with outcomes, make responsibility explicit, and use
> a restrained institutional design system that feels equally credible in a board presentation, a grant
> consortium, a technical review, or a recruitment process.

This direction is a hypothesis to validate with representative readers in Phase 0, not a claim that one
visual treatment automatically satisfies every corporate, public-sector, academic, and technical reader.

This is not “generic SaaS”. There are no gradients, floating blobs, glass effects, stock illustrations,
logo carousels, oversized claims, or invented testimonials. The visual identity comes from an **evidence
line**: a recurring horizontal structure that connects a claim to role, method, result, and source.

### Keep

- Semantic single-page HTML, Linked Data, self-hosted assets, and GitHub Pages deployment.
- Current content corpus: 21 portfolio records, 20 teaching records, four detailed projects, CV, legal,
  and contact information.
- Vanilla JavaScript modules, mobile drawer, filters, form handling, and fail-safe no-JS behaviour.
- Existing WebP project imagery and SVG icon sprite.
- One stylesheet, one script, no package manager, no runtime library, no CDN.

### Replace

- Archival call numbers and continuous spine.
- The pink/lilac paper palette and “night band” as dominant brand devices.
- Serif body copy, pervasive mono labels, specimen terminology, and catalogue numbering as the main UI.
- Four equal “service” columns before evidence is shown.
- A standalone award feature that interrupts the decision-making flow.
- Decorative reveal animation and the hero’s museum-label treatment.

---

## 1. Current-state findings

The repository is already technically lean: plain HTML/CSS/JS, two local fonts, no missing local asset
targets, and progressive enhancement is deliberately fail-safe. V4 should preserve that reliability.

### 1.1 What works

- Strong semantic structure and a single `h1`.
- Four substantial case studies with screenshots, contributions, and results.
- Real external evidence through project links, DOI records, ORCID, GitHub, and institutional affiliation.
- Accessible foundations: skip link, focus styles, reduced-motion handling, labelled form, keyboard drawer.
- Stable portfolio categories and a no-JS fallback that exposes all work.
- Responsive layouts already cover 360px through large desktop widths.

### 1.2 What limits corporate credibility

| Current signal | Corporate reading | V4 response |
|---|---|---|
| “Finding aid” metaphor | Personal archive rather than current capability | Present an executive profile and evidence brief |
| Warm pink page background | Editorial, personal, visually low-energy | Use neutral canvas, white surfaces, deep navy, one blue action colour |
| Serif body + frequent mono uppercase | Academic/catalogue voice | Sans-first typography with limited serif emphasis |
| Four services shown first | Claims precede proof | Put selected outcomes before the full capability matrix |
| Award has a full dark section | One accolade dominates the story | Integrate it into a compact credibility strip and relevant case study |
| 21 image cards + 20 teaching cards | High effort to scan; key work is diluted | Separate decision content from the complete evidence register |
| “Work with me” repeated four times | Consultant sales language may conflict with university role | Use one clear contact path and factual “How I contribute” copy |
| Catalogue numbers/captions | Adds concept but not decision value | Replace with role, scope, dates, technologies, and evidence links |
| Reveal-on-scroll | Content movement without informational value | Remove it; use immediate stable rendering |

### 1.3 Baseline verified while writing this plan

- `21` `.work-card` records.
- `20` `.teach-card.reveal` records.
- `1` `<h1>`.
- No duplicate DOI URLs found by the documented grep.
- No missing local `src`, `href`, or CSS `url()` targets.
- `node --check js/site.js` could not be run because Node is unavailable in the current environment.

---

## 2. Audience and decision path

V4 must work for three reading depths without creating separate pages.

| Reader | Question | Required answer |
|---|---|---|
| Executive / programme lead | “Can this person deliver complex cultural and research systems?” | Role, institutional context, 3 outcomes, scope, award, contact |
| Technical lead | “What did he actually build, and with what?” | Responsibility, architecture areas, stack, links, maintainability evidence |
| Academic / partner | “Is the work credible and citable?” | Publications, DOI/ORCID, teaching, research context, project provenance |

The proposed page therefore follows this order, subject to the Phase 0 comprehension test:

1. **Positioning** — name, role, value proposition, affiliation, availability.
2. **Credibility** — compact factual strip; no logo theatre.
3. **Selected outcomes** — three decision-grade case studies.
4. **Capabilities** — what can be contributed and where.
5. **How I work** — a simple delivery model connecting research to maintainable software.
6. **Project register** — complete, filterable evidence.
7. **Experience and knowledge transfer** — CV plus selected teaching/publications.
8. **Contact** — one direct next step.
9. **Legal and identifiers** — compact footer area, not primary navigation.

“Teaching” remains available and indexable, but it no longer competes with selected delivery outcomes in
the main decision path. “Imprint” moves out of primary navigation while remaining directly addressable.

---

## 3. Design concept

### 3.1 Signature device: the evidence line

Every important claim should have a visible route to proof. A thin horizontal line connects four fields:

```text
OUTCOME                         ROLE              SCOPE / METHOD          EVIDENCE
Digital memorial platform  ──  Full-stack lead  ──  GIS · archive  ──  Live project ↗
250+ memorial records           2019–2025            React · GAMS          State Prize 2024
```

First prototype the device on one case study and one project-register row. Extend it to other contexts only
if testing shows that it improves scanning without requiring explanation. It is an optional pattern, not a
mandatory site-wide signature. It is implemented with grid, borders, and text—not an image or JavaScript
component. At narrow widths it becomes a vertical stack with a short blue left rule.

This creates a recognisable graphic language while remaining sober, accessible, inexpensive, and useful.

### 3.2 Visual character

- **Institutional, not bureaucratic:** disciplined grid and strong labels, with generous whitespace.
- **Technical, not “tech startup”:** diagrams and screenshots explain systems; decoration does not mimic
  dashboards.
- **Academic, not archival:** sources and citations are visible, but the interface speaks contemporary
  professional language.
- **Personal, not casual:** one confident portrait, a clear first-person voice, and no lifestyle imagery.
- **Measured:** statistics are shown only where sourced or qualified.

### 3.3 Page silhouette

```text
┌──────────────────────────────────────────────────────────────────────────┐
│ Sebastian Stoff                 Expertise  Work  Experience  [Contact]  │
├──────────────────────────────────────────────────────────────────────────┤
│ DIGITAL HUMANITIES + RSE                                               │
│ I build durable research platforms       ┌───────────────────────────┐  │
│ for complex cultural knowledge.          │ portrait + current role   │  │
│ [Selected work] [View / print CV]          │ affiliation + identifiers │  │
│                                           └───────────────────────────┘  │
├──────────────────────────────────────────────────────────────────────────┤
│ UNIVERSITY OF GRAZ  |  STATE PRIZE 2024  |  OPEN SOURCE  |  ORCID      │
├──────────────────────────────────────────────────────────────────────────┤
│ SELECTED OUTCOMES                                                       │
│ 01  DERLA        [large screenshot]     role → method → result → link   │
│ 02  GAMS next gen [large screenshot]     role → method → result → link   │
│ 03  ZIM-Graphviz  [large screenshot]     role → method → result → link   │
├──────────────────────────────────────────────────────────────────────────┤
│ CAPABILITIES (2 × 2)                │ HOW I WORK (4 connected steps)    │
├──────────────────────────────────────────────────────────────────────────┤
│ PROJECT REGISTER — filters + compact evidence rows / cards              │
├──────────────────────────────────────────────────────────────────────────┤
│ EXPERIENCE                     │ KNOWLEDGE TRANSFER                       │
├──────────────────────────────────────────────────────────────────────────┤
│ CONTACT — focused invitation and form                                   │
├──────────────────────────────────────────────────────────────────────────┤
│ Identifiers · legal · licence · selected links                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bottom-up design system

```text
L0  CONTENT      verified claims · roles · dates · sources · 21 projects · 20 teaching records
        ↓
L1  TOKENS       neutral surfaces · navy/blue/teal · sans-led type · spacing · borders · radius
        ↓
L2  PRIMITIVES   container · intrinsic grid · text measure · link · focus · image frame · data label
        ↓
L3  COMPONENTS   button · proof item · metric · capability · evidence row · field · identifier
        ↓
L4  PATTERNS     evidence line · outcome feature · capability matrix · delivery path · register
        ↓
L5  SECTIONS     header · hero · credibility · outcomes · expertise · work · experience · contact
        ↓
L6  PAGE         one fast, credible capability brief with full evidence available in place
```

Build and verify each layer before assembling the next. Components may have documented variants for real
content differences—portrait, screenshot, book cover, register, form, and print—rather than pretending one
exception-free abstraction fits all media.

### 4.1 Colour tokens

Candidate palette; final values must be contrast-tested in implementation.

| Token | Candidate | Purpose |
|---|---:|---|
| `--canvas` | `#F5F7FA` | page background |
| `--surface` | `#FFFFFF` | cards, header, form fields |
| `--surface-muted` | `#EAF0F5` | alternate bands, data wells |
| `--ink` | `#172033` | headings and primary text |
| `--ink-soft` | `#46556A` | body text |
| `--ink-muted` | `#66758A` | secondary metadata only |
| `--navy` | `#16324F` | institutional anchor, primary button, footer |
| `--action` | `#1769AA` | links, active states, focus |
| `--action-hover` | `#0F4F83` | hover/pressed state |
| `--positive` | `#14756F` | availability and verified positive state |
| `--rule` | `#D6DEE8` | dividers and frames |
| `--rule-strong` | `#AAB7C7` | controls and emphasized boundaries |

Rules:

1. Navy establishes trust; blue indicates interaction; teal is reserved for verified/current status.
2. No category rainbow. Categories are words first and may use one neutral tinted background.
3. White and pale grey carry most of the page. Dark navy is limited to the footer and primary controls.
4. No gradients, translucent glass, textured paper, or decorative colour overlays.
5. Text combinations must pass WCAG AA; controls and focus indicators must have at least 3:1 contrast.

### 4.2 Typography

Use two self-hosted, open-source files at most:

- **IBM Plex Sans variable** (400–600): body, headings, navigation, labels, buttons, and data.
- **Source Serif 4 variable** (already shipped): limited to the hero’s emphasized phrase and selected
  project titles or pull statements.

Remove IBM Plex Mono from the UI. Tabular numerals are a font feature, not a reason to make the site look
like a terminal. If adding IBM Plex Sans is not approved, use the system UI stack and retain Source Serif
for emphasis; that is the zero-download fallback.

Final scale (implemented; see `design-refactor.md` §4.1):

| Token | Value | Role |
|---|---|---|
| `--text-2xs` | `0.6875rem` (11px) | Uppercase labels, meta lines, flags |
| `--text-xs` | `0.75rem` (12px) | Tags, dense captions, small links |
| `--text-sm` | `0.875rem` (14px) | Scope lines, notes, secondary copy, controls |
| `--text-base` | `1rem` (16px) | Body, card titles, outcome copy |
| `--text-lg` | `1.125rem` (18px) | Section intros, lead paragraphs, component headings |
| `--text-xl` | `1.25rem` (20px) | Capability and CV headings |
| `--display-1` / `--display-1-stacked` | `clamp(2.7rem, 5vw, 4.6rem)` / `clamp(2.35rem, 10vw, 3.2rem)` | Hero `h1`, two-column / stacked |
| `--display-2` | `clamp(2rem, 3.4vw, 3rem)` | Section `h2` |
| `--display-3` | `clamp(1.5rem, 2.4vw, 2.1rem)` | Outcome `h3` |
| `--display-4` | `clamp(1.25rem, 2vw, 1.6rem)` | CV role, contact email |
| `--display-stat` | `clamp(1.8rem, 3.5vw, 2.8rem)` | CV dates |

Five leading roles (`display`, `title`, `dense`, `body`, `prose`) and three tracking roles
(`display`, `title`, `label`) cover every component; print sizes stay in `pt`.

### 4.3 Grid, spacing, and shape

- Container: `1200px`; gutter: `clamp(20px, 4vw, 48px)`.
- Use intrinsic CSS Grid patterns (`minmax()`, `auto-fit`, and named two-column layouts), not a formal
  12/8/4-column framework. Introduce a column system only if a prototype proves a specific need.
- Main section spacing: `clamp(72px, 9vw, 128px)`; component spacing uses the eight-step 4px scale
  (`--space-2xs` 4px through `--space-3xl` 64px).
- Text measure is controlled independently of grid width.
- Radius: 6px for controls, panels and cards; 4px for tags, thumbnails and fields; 50% only for the portrait.
- Borders: `--rule-hair` 1px by default; `--rule-accent` 2px for the evidence line, award note, CV summary
  and focus indicator.
- Shadows: one subtle elevation token may be used on the fixed header only. Content cards remain flat.
- Register thumbnails are 4:3 frames with `contain`; outcomes use one 4:3 `contain` frame; the publication
  cover keeps its natural ratio and the portrait stays circular. Book covers and screenshots are not cropped.

### 4.4 Interaction and motion

- Hover changes colour, border, or underline; no card lift.
- Remove reveal-on-scroll entirely. Information should not wait for an observer.
- Preserve smooth anchor scrolling only when reduced motion is not requested.
- Keep the header state change and mobile drawer.
- Keep portfolio filters and progressive “show more”; no-JS continues to show every record.
- Avoid a custom cursor, scroll progress, parallax, autoplay, carousels, and animated metrics.

---

## 5. Component plan

| Component | Purpose | Visual treatment |
|---|---|---|
| `.btn` | primary and secondary action | 44px minimum; navy fill or white with strong border |
| `.text-link` | tertiary action | blue, explicit underline, external-link icon where relevant |
| `.proof-strip` | 3–4 credibility facts | border top/bottom; equal cells; wraps to 2×2 then stack |
| `.proof-item` | one sourced fact | short label, factual value, optional source link |
| `.evidence-line` | claim-to-proof relationship | four-column row; 2px blue lead rule; vertical on mobile |
| `.outcome-feature` | selected case study | screenshot + concise narrative + evidence line |
| `.metric` | sourced result | large numeral, short label, source/qualifier nearby |
| `.capability` | expertise area | title, business/research value, concrete deliverables, technologies |
| `.delivery-step` | working method | numbered 01–04; connected by a rule, not an illustration |
| `.project-row` | full register entry | year, project, role, type, technologies, evidence link |
| `.credential` | employment, education, award | date, role, institution, concise scope |
| `.identifier` | ORCID/GitHub/Scholar | recognisable icon, readable label and value |
| `.field` | contact form | white field, persistent label, clear help/error state |

Use the existing SVG sprite. Add an icon only if it communicates an action or identifier; do not add an
icon to every heading.

---

## 6. Section-by-section redesign

### 6.1 Header

- White, 72px desktop / 64px mobile, with a fine bottom rule after scrolling.
- Brand: `Sebastian Stoff` with the descriptor `Digital Humanities · Research Software` as plain text.
- Primary links: `Expertise`, `Work`, `Experience`, `Contact`.
- Remove `Imprint` and `Teaching` from primary navigation; both remain linked in the footer and page.
- CTA label: `Contact` rather than “Get in touch”; shorter and more neutral.
- Preserve the current accessible drawer behaviour, Esc handling, focus loop, and no-JS navigation.

### 6.2 Hero: executive positioning

Left side (7 columns):

- Eyebrow: `Digital humanist · Research software engineer`.
- Proposed headline: **“I build durable digital platforms for complex cultural knowledge.”**
- Lead: role at the University of Graz plus archives, editions, linked data, and research software.
- Primary CTA: `View selected work`; secondary CTA: `Contact`.
- One factual status line only if availability wording is accurate.

Right side (5 columns):

- Acquire a rectangular source portrait suitable for a 4:5 treatment. The shipped 400×400 alpha-masked
  circular image cannot be uncropped by CSS. If no source is available, keep it contained and circular in a
  simpler neutral profile panel rather than faking a crop.
- Attach a compact profile panel: current role, institution, location, ORCID, GitHub.
- Remove `Fig. 01`, the ash-grey mat, and the project index strip.

Optional CTA: `Print CV` may invoke the existing print stylesheet rather than require a maintained PDF.
Use `window.print()` only as progressive enhancement; without JavaScript label the normal anchor `View CV`
and link it to the CV section rather than promising a print action it cannot perform.

### 6.3 Credibility strip

Immediately below the hero, show four factual items:

1. University of Graz / Department of Digital Humanities.
2. Austrian State Prize for History Sciences 2024, tied specifically to DERLA.
3. Open-source research software and public project links.
4. Persistent scholarly identity: ORCID and Google Scholar.

Use text and existing icons, not external organisation logos. Logos add licensing, maintenance, visual
noise, and false endorsement risk.

### 6.4 Selected outcomes

Show three principal case studies before general capabilities:

1. **DERLA** — public platform, GIS/archive scope, personal responsibility, award, sourced metrics.
2. **GAMS next generation** — current institutional platform leadership; this better demonstrates
   enterprise-scale responsibility than the edited volume.
3. **ZIM-Graphviz** or **NAMPI** — select based on which has the strongest verifiable adoption evidence.

Each feature contains:

- Outcome-led title and 2–3 sentence summary.
- `Role`, `Challenge`, `Contribution`, `Result`, and `Evidence` fields.
- One screenshot with a descriptive caption; no ornamental frame or mat.
- At most three metrics, each sourced or qualified.
- One primary evidence link and optional repository/publication link.

The edited volume moves to Knowledge Transfer. The award stays within DERLA and the credibility strip;
delete the standalone dark award section.

### 6.5 Capabilities

Retain four areas, but reframe them around organisational value rather than tools:

| Capability | Value statement | Concrete outputs |
|---|---|---|
| Research platforms | Turn research requirements into dependable services | applications, APIs, data pipelines |
| Digital archives | Publish and preserve collections with durable access | repository workflows, metadata, search |
| Linked data and editions | Make complex sources structured and discoverable | TEI, RDF, knowledge graphs, interfaces |
| Responsible AI workflows | Improve research workflows while retaining provenance | retrieval, assistants, evaluation, source control |

Use a 2×2 matrix with clear internal dividers. Technologies are secondary metadata, not colourful chips.
Remove four repeated “Work with me” links.

### 6.6 How I work

Introduce a compact four-step delivery path:

1. **Frame** — users, research question, constraints, success criteria.
2. **Model** — content/data model, provenance, interfaces, architecture.
3. **Build** — iterative delivery, testing, documentation, stakeholder review.
4. **Sustain** — maintainability, handover, preservation, and long-term access.

This is the page’s main explanatory graphic. Build it with HTML/CSS and short factual copy. It should not
imply a commercial consultancy process if that is not the intended positioning.

### 6.7 Project register

Retain all 21 records, but change from an image-heavy gallery to a compact evidence register.

- Featured projects keep thumbnails; ordinary records are text rows/cards.
- Desktop columns: year, project, contribution/type, technologies, evidence.
- Mobile: stacked cards with visible labels; never a horizontally scrolling data table.
- Keep five filters in audience language: `All work`, `Platforms`, `Research`, `Tools`, `Teaching`. The
  former `Reviews` record is folded into `Research`; “Knowledge transfer” is labelled `Teaching` in the
  filter only (the section heading keeps its name).
- Keep stable identifiers only if they are useful for deep linking; do not print `No. 08` as a brand motif.
- First view shows exactly 9 records, preserving the current tested page size. “Show more” is progressive
  enhancement; no-JS and print show all.
- Do not duplicate full case-study content in register rows.

### 6.8 Experience and credentials

- Replace card-in-timeline styling with two clean columns: `Professional experience` and `Education &
  credentials`.
- Lead with current senior full-stack role and scope, not just dates.
- Use the evidence-line grammar for role → institution → scope → supporting link.
- Keep competencies as grouped plain text, not a field of chips.
- Integrate the award as one credential only if its personal/project attribution is confirmed.

### 6.9 Knowledge transfer

- Keep exactly 20 unique records: 4–6 selected records followed by the remaining records, with no duplicate
  markup. Prefer an expanded list over hiding information. If native `<details>` is prototyped, test its
  keyboard name/state, browser Find behaviour, fragment links, print expansion, and no-JS operation before
  adoption; do not add a second custom show-more module merely for visual neatness.
- With CSS/JS unavailable, all resources must remain reachable and indexable.
- Keep DOI links, dates, languages, and event/institution names prominent.
- Avoid 20 equally weighted screenshot tiles; they obscure rather than strengthen the record. The
  implemented version removes the teaching thumbnails entirely and keeps the publication cover as the
  section’s single image anchor.

### 6.10 Contact

- Headline: `Discuss a research software or digital heritage project.` Adjust if collaborations are not
  currently being accepted.
- Put direct email and institutional context before the form.
- Keep the form concise: name, email, organisation/subject (optional), message.
- Preserve native POST fallback, status live region, honeypot, validation, and direct-email fallback.
- Remove repeated social icon groups; identifiers appear once in the profile and once in the footer.

### 6.11 Footer and imprint

- Navy footer is the only large dark surface.
- Include identity, short descriptor, contact, ORCID/GitHub/Scholar, legal link, licence, and year.
- Keep core legal identity, contact, privacy, and service-provider information expanded in the addressable
  imprint section. Secondary licence prose may use `<details>` only after fragment and print testing. Legal
  information must not depend on JavaScript.
- Remove the numbered table-of-contents treatment.

---

## 7. Content changes required before visual implementation

Visual polish cannot compensate for unclear or unsupported evidence. Create a small evidence manifest
before changing markup:

| Field | Example | Rule |
|---|---|---|
| Project | DERLA | canonical public name |
| Period | 2019–2025 | exact or clearly marked ongoing |
| Role | Full-stack developer / technical lead | use accurate responsibility, not inflated title |
| Scope | GIS, search, archive integration | maximum four items |
| Outcome | 250+ memorials documented | source or owner confirmation required |
| Evidence | live URL, DOI, repository, award page | at least one primary source |
| Status | live, maintained, archived | factual and dated where useful |

The manifest is a hard gate, not documentation to backfill later. Every hero claim, credibility item,
capability, and selected case must point to an approved evidence record. If “Responsible AI workflows” or
another capability has no concrete project, publication, or approved institutional responsibility behind
it, remove or narrow the claim.

Copy rules:

- Start case studies with what changed for users or the organisation.
- Separate team/project achievements from personal contribution.
- Replace vague adjectives (`innovative`, `cutting-edge`, `powerful`) with scope and evidence.
- Expand acronyms on first use.
- Use consistent British English or US English; the current copy mixes institutional and marketing styles.
- Keep German titles in German with `lang="de"`; add an English description rather than rewriting titles.

---

## 8. Technical architecture and simplification

No new framework or build pipeline is justified.

```text
index.html
   ├── semantic content + JSON-LD + inline SVG symbols
   ├── css/custom-styles.css      one token source, responsive and print styles
   ├── js/site.js                 drawer, header, filters/show-more, form, year
   ├── fonts/                     maximum two OFL woff2 files
   └── images/                    existing local WebP/JPEG assets
```

### JavaScript changes

- Delete the reveal module and `.reveal` state classes.
- Keep modules isolated and guarded.
- Keep drawer, header state, portfolio filtering/show-more, contact form, and footer year.
- Reassess scrollspy after navigation is reduced to four links; remove it if it adds no clear benefit.
- Optional print-CV button may call `window.print()`; never make printing JS-dependent.
- Do not add charts, animation libraries, carousels, analytics, or component frameworks.

### Project-register DOM contract

The current portfolio script cannot be assumed to work after the visual migration. Use this explicit
contract so the redesign remains a controlled refactor:

- Behaviour hook: `[data-project-item]` (visual class may be `.project-row`).
- Required attributes: `data-project-id`, `data-categories`, and visible project title; the evidence
  manifest supplies year, contribution/type, technologies, and canonical URL in markup.
- Category keys: `platform`, `research`, `tool`, `knowledge`, `review`.
- Before implementation, publish an old-to-new mapping for `web`, `research`, `tool`, `teaching`, and
  `document`, including every multi-category record and expected count per filter.
- Page size: exactly `9`; the visible count is always derived from the DOM.
- IDs must be unique within the register. The same external evidence URL may legitimately appear in a case
  study and register row; global duplicate-URL checks must not reject that.
- Update `site.js` selectors and filter tests atomically with the markup migration.

### External service and privacy boundary

Formspree is the current site’s only proprietary runtime service. V4 must either (a) explicitly retain it
as an approved exception, document the processor and data flow in the privacy notice, and test its native
fallback, or (b) remove the form in favour of direct email or owner-controlled institutional
infrastructure. “Open source” must not be used to imply that the entire contact path is self-hosted.

### CSS changes

- Rewrite the root token block and base typography first.
- Delete rail/call-number, specimen plate, night award, catalogue-number, reveal, and category-colour rules.
- Rebuild components using grid and borders; avoid section-specific selector chains.
- Keep responsive breakpoints content-driven: approximately 1120, 900, and 640px only if needed.
- Preserve print rules, but define a concise CV product: target 3–4 A4 pages containing profile/contact,
  capabilities, selected outcomes, professional experience, education, and a short selected-project list.
  Omit navigation, form controls, legal prose, decorative images, and the complete project/teaching
  registers. Render useful external URLs, prevent headings from being stranded, and set explicit page-break
  rules. The complete registers remain available on the web, not in the default CV printout.

Expected result: fewer visual concepts and runtime states. This is still a substantial content-model and
information-architecture migration, not a low-effort reskin; success is measured by clearer evidence and
fewer maintained patterns, not by CSS line count alone.

---

## 9. Implementation sequence and gates

Every phase must leave the page usable. Work on a branch/worktree; never treat `master` casually because it
publishes the live site. Never stage `opencode.jsonc`.

| Phase | Bottom-up work | Gate |
|---|---|---|
| 0A Validation | interview 3–5 representative readers using the current page and one low-fidelity V4 prototype | at least 80% identify role, personal contribution, strongest result, its source, and contact path without prompting; median task set under 90 seconds |
| 0B Evidence | content schema, source links, responsibilities, taxonomy mapping, verified metrics, GAMS asset, portrait decision, screenshot/performance baseline | owner signs off every hero/capability/proof claim and selected three cases; unsupported claims are cut |
| 1 Tokens | candidate palette, type files/fallback, spacing, grid, focus, links | contrast checks pass; no section styling yet |
| 2 Primitives | container, type measure, borders, buttons, labels, image and field states | keyboard/focus review at 360 and 1440px |
| 3 Components | proof item, evidence line, outcome, capability, project row, credential | isolated component sheet or temporary in-page sandbox |
| 4 Structure | reorder semantic sections; simplify nav; preserve existing IDs or add explicit legacy alias anchors | all content remains present; old and new fragment manifest resolves |
| 5 First screen | header, hero, profile panel, credibility strip | 360/768/1024/1440 screenshots; LCP asset confirmed |
| 6 Evidence | selected outcomes, capability matrix, working method | role/result/source understandable without hover |
| 7 Registers | project register, experience, knowledge transfer | counts remain 21/20; taxonomy counts, filter/show-more/no-JS pass |
| 8 Contact/legal | decide Formspree boundary; implement contact, imprint, footer, print layout | processor/data flow disclosed or form removed; contact and legal content work without JS |
| 9 Simplify | remove old CSS/markup/JS and unused font/image references | zero dead selectors, missing targets, or console errors |
| 10 Review | accessibility, responsive, performance, content, stakeholder review | definition of done below |

Do not implement old and new design systems in parallel behind a permanent class. The temporary overlap
would double maintenance and make regressions difficult to locate. Use small commits and remove superseded
rules as each section migrates.

For the mobile navigation, choose one pattern explicitly: a non-modal disclosure that leaves the page
available, or a modal drawer with background isolation (`inert` plus an appropriate fallback), semantics,
and focus management. Do not preserve the current hybrid solely because Esc and focus return already work.

---

## 10. Verification

### Automated or scripted checks available without adding dependencies

```bash
python3 -m http.server 8000
# Browser: no console errors and no failed local requests

grep -c 'class="project-card"' index.html              # 21
grep -c 'class="teaching-item"' index.html             # 20
grep -c '<h1' index.html                               # 1
# validate unique record IDs within each register; repeated evidence URLs across sections are allowed
grep -nE 'data-callno|plate__caption|reveal-ready|plex-mono' index.html css/custom-styles.css js/site.js
# no output after migration

gjs js/site.js                                         # stops at "document is not defined": syntax valid
node --check js/site.js                                # when Node is available
```

Add a small one-off Python check (not a dependency) for:

- every local `src`, `href`, and `url()` target exists;
- section IDs are unique and every internal anchor resolves;
- every project has category, title, contribution/type, date, and evidence URL;
- all images have `alt`, `width`, and `height`;
- no duplicate canonical record IDs within a register; repeated DOI evidence links are intentional only;
- `opencode.jsonc` is not staged.

### Manual matrix

- Widths: 320, 360, 768, 1024, 1440px; 200% and 400% zoom; landscape phone; no two-dimensional page
  scrolling at WCAG reflow conditions.
- Input: keyboard only, touch, mouse; visible focus everywhere.
- Modes: JavaScript on, JavaScript off, reduced motion, print preview, forced colours, and WCAG text-spacing
  overrides. In forced colours, links, focus, current state, errors, and status remain identifiable without
  colour alone.
- Navigation: drawer open/close/Esc/focus return; every anchor lands below header.
- Register: every filter, load-more to all 21, the count live region, and the hidden-load-more focus handoff.
- Form: empty, invalid email, valid submission, failed network, native POST fallback.
- Content: role and outcome attribution; German pronunciation/lang; external-link behaviour.

### Budgets

- Zero new runtime dependencies and zero CDN requests.
- Zero missing local assets and zero console errors.
- Record V3 baseline first in a named Chromium version at 1440×900 and 360×800, cold cache, local server,
  Fast 3G throttling, five runs; retain the median transfer/LCP/CLS values with the screenshots.
- V4 median LCP below 2.5s on that reproducible profile and CLS below 0.05.
- Initial transferred bytes before lazy images must not exceed the recorded V3 median; 750KB is a target,
  not a valid gate until the baseline is known.
- Maximum two webfont files; subset to required Latin characters.
- WCAG 2.2 AA contrast and interaction targets; 44px preferred target size for primary controls.

---

## 11. Definition of done

- A visitor can identify role, institutional affiliation, primary value, three outcomes, and contact path
  in the Phase 0/10 task test; “first two screenfuls” means 1440×900 desktop and 360×800 mobile.
- Claims are visibly connected to personal role and primary evidence.
- The site reads as credible in corporate, public-sector, academic, and technical contexts without looking
  like a generic software template.
- One coherent token system; no archival and corporate design systems mixed together.
- All 21 project and 20 teaching records remain accessible, searchable, and available without JavaScript.
- Mobile navigation disclosure, filters/show-more, form, direct links, reduced motion, and print all work.
- One `h1`, valid heading order, unique IDs, correct `lang`, useful alternative text, and visible focus.
- No framework, package manager, build step, CDN, tracking script, or new paid asset.
- No call-number rail, specimen captions, category rainbow, or repeated sales CTA.
- Documentation describes the shipped V4 design; `master` is updated only after review.

---

## 12. Cost and complexity impact

| Decision | Cost / complexity effect |
|---|---|
| Reuse static architecture and current images | no hosting or tooling increase |
| One new OFL sans font, or system-stack fallback | small one-time asset task; no subscription |
| Remove mono font and reveal behaviour | fewer bytes and fewer states |
| CSS evidence line instead of illustration | no design asset pipeline or image maintenance |
| Text-first project register | fewer initial image decodes and faster scanning |
| Reuse filter/form/drawer concepts but migrate their DOM contracts deliberately | lower risk than replacing behaviour, but not zero-cost |
| No logos/testimonials without permission | avoids licensing and governance cost |
| Print current HTML rather than maintain a PDF | one source of truth |

V4 is a content hierarchy and design-system rewrite, not a technology rewrite. The largest cost is factual
content review, which is also the highest-value work for corporate credibility.

---

## 13. Unresolved decisions

1. **Positioning:** is the site intended primarily for collaborations, institutional visibility, or future
   employment? The hero CTA and “How I work” wording depend on this.
2. **Availability:** confirm whether “Available for research software collaborations” is accurate and may
   be shown alongside a current university role.
3. **Selected third case:** ZIM-Graphviz and NAMPI need an evidence comparison; choose the one with stronger
   verifiable outcomes, not the better screenshot.
4. **GAMS case study:** provide approved copy and a suitable screenshot for next-generation GAMS.
5. **Metrics:** confirm sources for 250+ memorials, 15k+ monthly users, downloads, citations, and language
   counts, or remove/qualify them.
6. **Award attribution:** decide whether the project received the award or Sebastian was personally
   honoured; use one accurate formulation everywhere.
7. **Role titles:** reconcile JSON-LD `Senior Developer (Full-Stack Engineer)` with visible “research
   software engineer” wording and official institutional title.
8. **Font choice:** approve IBM Plex Sans self-hosting or choose the zero-download system UI fallback.
9. **Knowledge transfer disclosure:** native `<details>` is low-cost, but stakeholders may prefer all 20
   entries visibly expanded.
10. **Contact/privacy:** confirm whether a personal email and full postal address should remain publicly
    exposed on a corporate-facing site.
11. **Printable CV:** confirm whether browser print is sufficient or a formally designed PDF is required.
12. **Language strategy:** decide whether the full interface remains English-only or needs a German version;
    a bilingual site is a separate information-architecture project and is not included here.
13. **Contact processor:** explicitly approve and disclose Formspree, move to owner-controlled institutional
    infrastructure, or remove the form and use direct contact only.
14. **Mobile navigation:** choose non-modal disclosure or a correctly isolated modal drawer after assistive-
    technology testing.

### Resolved during implementation

- The evidence device sits inside a half-width outcome column, so it ships as a 2×2 rule-bounded block. A
  four-across line left each field about 120px wide at 1440px, which broke “Result” strings into three or
  four lines; the single-column blue-rule variant remains below 640px.
- IBM Plex Sans is self-hosted as the single UI face (latin subset, variable 400–600); the mono face was
  removed rather than kept as dead weight, and Source Serif 4 survives only as the `h1` emphasis.
- ZIM-Graphviz is the third selected outcome because its demo, adoption and citation claims are verifiable.
- Metrics that were already published in V3 were retained as-is; no new numbers were invented. GAMS has no
  invented case study — it keeps its capability description and register entries.
- Award wording attributes the prize to the project, consistently: “DERLA received the award…”.
- All 20 teaching records stay visible; no disclosure widget was introduced.
- The mobile navigation is the non-modal disclosure described in §8, without a focus trap or scroll lock.
- The contact form stays on Formspree with an explicit data-protection note in the form and in the imprint.
- Print output is the browser-printed page, tuned as a concise CV; no separate PDF is maintained.
- The interface remains English-only; German titles keep `lang="de"`.
- No screenshot suite was produced: the environment has no headless browser that can render the page.
  Verification was scripted (counts, ids, anchors, local targets, HTML nesting, CSS balance, JS parse) plus
  a local-server request check.
- The design-system refactor is implemented: six text sizes plus six display roles, five leading and three
  tracking roles, an eight-step 4px spacing scale, 4px/6px radii plus the portrait circle, one shared label
  recipe, one `.tag` geometry, and `--action` limited to signal (links, focus, current/pressed state and the
  eyebrow marker).
- The award is stated twice (proof strip and DERLA award note); the outcome tag, description sentence and
  register flag are removed. The award image is a 192×128 derivative and the register serves 224px-wide
  WebP thumbnails through `srcset`/`sizes`.
- Outcome media share a 4:3 `contain` frame; teaching thumbnails are removed; the register keeps two columns
  above 900px with 88px media at 901–1120px. The filter row has five controls and becomes a 3-column grid
  below 640px.

---

## Appendix A — bigger picture

```text
                                  CORPORATE DECISION
                                          │
                   ┌──────────────────────┼──────────────────────┐
                   ▼                      ▼                      ▼
               Is there fit?          Is it proven?          Is it credible?
                   │                      │                      │
          role + capabilities       outcomes + role        institution + DOI
          working method            + source links         ORCID + award
                   └──────────────────────┼──────────────────────┘
                                          ▼
                                  LOW-FRICTION CONTACT

       visual layer                 content layer               technical layer
  neutral institutional UI  +  evidence before claims  +  static resilient page
  disciplined intrinsic grid   explicit contribution       no build/dependencies
  one evidence-line motif      complete work register       progressive enhancement
```

V3 answered, “How can this body of work feel like a personal archive?” V4 answers the more useful
corporate question: **“What can Sebastian contribute, what has he delivered, and where is the evidence?”**

## Appendix B — explicit non-goals

- No React/Vue/Svelte migration, CMS, headless backend, design-system package, or bundler.
- No separate project-detail routes in this phase.
- No invented client logos, testimonials, employer endorsements, or vanity metrics.
- No animated architecture diagram, 3D treatment, video hero, or generative decoration.
- No dark-mode project until the light corporate system is complete and tested.
- No analytics by default; if later required, privacy and governance need a separate decision.

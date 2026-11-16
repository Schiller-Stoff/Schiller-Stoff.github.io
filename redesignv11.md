# V11 — "The practice, not the diary"

Status: **reviewed, ready for implementation** (v11.1, after architect review).
Supersedes nothing. V10 (two remembrance platforms) remains structurally intact; V11 changes
*what the top of the page is for* and *who it speaks to*, not the visual system.

---

## 1. Reference and what is actually being borrowed

`markmanson.net` is not admired for its typography. The transferable move is architectural:

1. a thin top bar carrying an **owned offer**,
2. a hero that sells an **outcome**, with the conversion control inside it,
3. the **person arrives after the offer** — portrait, one credential line, three routes,
4. the middle of the page is a **shelf structure** (formats, not chronology),
5. a **product block** (one purchasable thing, one CTA),
6. the **conversion repeats** before the footer,
7. the footer is a **business card** (statement, links, social row).

The current CV is the inverse: portrait card above the fold, first person throughout, evidence
delivered as a document. V11 makes the page read as a **practice you can commission**, with the CV
kept as due diligence.

## 2. Positioning

Buyer: research directors, programme managers (EU/national projects), museum and heritage
institutions, university library/IT leads. Secondary: hiring managers.

Job-to-be-done: *"We have a collection, a research question or a mandate, a funding period, and
nobody who can turn it into a cited, durable service."*

The differentiator is already in the work and is under-sold: **sustainability**. GAMS is an
OAIS-conformant, certified repository; DERLA won the Austrian State Prize 2024; MEMOR is a
city-scale register; ReInHerit was an EU platform; ZIM-Graphviz is reused open source. The
headline "it will still run after the funding ends" is the unfair advantage.

Commercial frame: the imprint already documents a registered IT business (GISA 34945216,
"services in automated data processing and IT"). V11 lets the page speak from that entity while
naming the university role as the credential. **No availability, rate, VAT or client claim is
invented.** Capacity is stated honestly, not hidden.

## 3. Information architecture

### Before

```
hero (offer + PORTRAIT CARD)     ← person above the fold
credibility strip (affiliation, prize, counts, ORCID)
DERLA plate
MEMOR plate
selected outcomes (3)
capabilities (4)
method (4)
register (21)
knowledge transfer (20 + 2)
CV
contact
imprint
```

### After

```
hero (offer · CTA · engagement line)   ← no portrait, no trust row
profile band                            ← the card you scroll to
proof strip (affiliation · system · prize · procurement)
DERLA plate                             ┐
MEMOR plate                             ┘ evidence
selected outcomes (3)                   ← show, then tell
services (4 + closing text-link)        ← what you can commission
method (4)                              ← de-risking
register (21)                           ← the library
training (20 + 2)                       ← the "enable" product
CV                                      ← due diligence
contact (+ brief checklist + capacity note)
imprint / footer
```

**No section is moved.** The order is portfolio-first, which is this buyer's proof; the two map
plates must stay where they are. The changes are: the hero stops being a business card, the person
gets a band at the fold line, and the *shapes of engagement* are named above the fold so a
programme manager does not have to reach `#services-section` to learn what is purchasable.

### Funnel

```
hero ──▶ "Start a project" ──▶ contact
  │
  ├──▶ "See the evidence" ──▶ plates ──▶ outcomes ──▶ register ──▶ CV ──▶ contact
  └── engagement shapes named in the hero (project · review · training)
persistent: header CTA, services closing link, footer contact
```

One promise, one proof path, one action.

## 4. Copy deck (authoritative)

### Header
- Brand descriptor: `Digital heritage engineering`
- Nav: **Services** `#services-section` · **Work** `#portfolio-section` · **Experience** `#cv-section`
- CTA: **Start a project** `#contact-section`

### Hero
- eyebrow: `Digital heritage engineering · Graz, Austria`
- h1: `Digital heritage, engineered to last.`
- lead: `I design and build archives, editions and research platforms for universities, museums and heritage institutions — as senior developer of GAMS, the University of Graz's certified digital archive.`
- typed phrases (mechanism unchanged, voice changed; each carries one claim, none repeats the lead):
  1. `The system should outlive the project that paid for it.`
  2. `Every system I build is designed for the team that inherits it.`
  3. `Archives that pass an audit, and teams trained to run them.`
  - the `.visually-hidden` sentence mirrors phrase 1
- actions: primary `Start a project` → `#contact-section`; outline `See the evidence` → `#case-studies-section`
- engagement line (new, one line, `--text-xs`, muted, hairline separators; gaps at ≤640):
  label `Typical engagements` — `project work` · `technical review and modernisation` · `training series`

### Profile band (new, immediately after the hero)
- portrait 120px circle, same file, `fetchpriority="high"` kept, alt kept
- name: `Sebastian David Schiller-Stoff`
- role: `Senior Developer (Full-Stack Engineer) · Department of Digital Humanities, University of Graz`
- remit: `Leads development of GAMS, the university's OAIS-conformant archive — the repository behind DERLA and other humanities projects.`
- links: LinkedIn · ORCID · GitHub · Google Scholar · GAMS (`https://gams.uni-graz.at/`)

### Proof strip (4 items; ORCID and the counts move out)
1. `Affiliation` / `University of Graz` / `Department of Digital Humanities`
2. `System` / `GAMS` / `OAIS-conformant, certified digital archive` (link GAMS)
3. `Recognition` / `Austrian State Prize 2024` / `History Sciences · DERLA` (existing link)
4. `Procurement` / `GLN 9110032223467` / `Registered IT services · GISA 34945216` (link `#imprint-section`)

### Services
- eyebrow `Services`; h2 `What you can commission.`
- intro: `Infrastructure that lets collections and research data be published, searched and preserved.`
- card 02 copy (lead with the system, no "next generation" roadmap):
  `I lead development of GAMS, the university's OAIS-conformant archive — a certified system for publishing and preserving humanities resources.`
- the grid closes with one `text-link`: `Start a project` → `#contact-section`
- **no `.engagement-line` here** — those shapes are named in the hero

### Outcomes / method / register
- outcomes intro: `Three projects that show how research, design and engineering meet in practice — a national memorial archive, a European heritage platform and a reused open-source library.`
- method intro: `A delivery path that keeps scope, provenance and maintenance visible from the first workshop to handover — so the system survives the funding period.`
- register eyebrow `Work`; h2 unchanged

### Training / CV
- teaching eyebrow `Training`; h2 unchanged
- teaching intro: `Training for the teams who run the system after the project ends, plus the written record of the method.`
- CV intro: `A decade of building research software at the University of Graz — from frontend engineering to archive infrastructure.`

### Contact
- h2 `Start a project.`
- intro: `Most engagements begin with a short conversation about the collection, the mandate and the deadline. A one-page brief is enough.`
- new `.contact-brief`: label `A useful first message` + 3 items:
  `what the collection or system is` / `who it serves and what the funder expects` / `the deadline or funding period`
- capacity note (`.contact-brief__note`):
  `I work alongside a full-time post at the University of Graz; commissioned work is contracted through the registered business named in the imprint.`
- second audience: `For roles and positions, write to the same address with the role title.`
- contact facts: `Currently` → `Engagements` = `Project work · technical review · training`
- form, copy-email, response promise: unchanged

### Imprint (blocking, see §9.1)
Add one `.legal-note` to the business card:
`Work commissioned through this site is undertaken in a personal capacity under the registered
business above, and not on behalf of the University of Graz.`

### Footer
- descriptor `Digital heritage engineering · Graz, Austria`
- footer nav: Services · Work · Training · Experience · Contact · Imprint

### Metadata (minimal edit only)
- title `Sebastian David Schiller-Stoff — Digital heritage engineering`
- description `Archives, editions and research platforms for universities, museums and heritage institutions. Senior developer of GAMS at the University of Graz.`
- og/twitter/dc descriptions mirror the new description. **No JSON-LD `makesOffer`** (no consumer, over-claims).

## 5. Component specification

### `.profile-band` (new; replaces `.hero__profile` / `.profile__*`)
- `section.profile-band[aria-label="Profile"]` — labelled by the attribute, **not** by a `<p>`
  (a region labelled by a paragraph has no heading in the outline)
- `--surface-paper` ground, `border-top: var(--rule-hair) solid var(--rule)`,
  `padding-block: clamp(28px, 4vw, 44px)`; **no `.section-head`** (count stays 8)
- grid `auto minmax(0,1fr)`, gap `clamp(20px, 3vw, 40px)`, `align-items: start`
- identity: `p.profile-band__name` (600, `--text-lg`), `p.profile-band__role` (`--text-sm`,
  `--ink-soft`), `p.profile-band__remit` (`--text-sm`, `--ink-soft`, `max-width: 58ch`)
- links: `ul.profile-band__links[role="list"]` **inside the identity column**, under the remit
  (`margin-top: var(--space-sm)`), inline flex with wrap, `--text-sm`, hairline separators
  above 900px, 15px icons, hover `--action`
- **no animation, no `html.*` gate** — it is content at the fold
- `panel-settle` is removed with this component (it was a hero-scene entrance)
- delete `.hero__profile`, `.profile__portrait`, `.profile__role`, `.profile__org`,
  `.profile__location`, `.profile__links`, `.profile__link*` **and every downstream reference**
  in the 1120 / 900 / 640 / 420 blocks, the print hide list, the print ink list and the
  forced-colours list. No half-rename: one commit, all five places.

### `.hero` (layout only)
- `.hero__grid { grid-template-columns: minmax(0, 1fr) }`
- `.hero__copy { max-width: 720px }` (holds the graph's clear space, same as today)
- `.hero__lead { max-width: 54ch }`
- `.hero__graph`: keep the `top/right` geometry, the **900px hide**, the `@supports` drift and its
  `min-width: 901px`; only lower the ink to `opacity: 0.09`. Do **not** move the hide breakpoint.
- `.hero__engagements` (new): `--text-xs`, `--ink-muted`, flex-wrap, hairline separators
  (gaps at ≤640), `margin-top: var(--space-lg)`; label span uses `.label`; hidden in print (the
  services section carries the same information on paper)

### Contact additions
- `.contact-brief`: `--surface-paper`, `padding: var(--space-lg)`, `ul` of 3, `--text-sm`
- `.contact-brief__note`: `--text-xs`, `--ink-muted`, `max-width: 62ch`

### Responsive (no new breakpoints)
- no 1120 band override: the two-column band already leaves the identity the full measure; the
  links wrap inside it when they must
- ≤900: the links lose their hairline separators so a wrapped row can never start with a border;
  the band keeps its two columns
- ≤640: profile band single column; the links keep the gap-only row and may wrap; `.contact-brief`
  full width

### Print
- `.profile-band` prints as a plain bordered block, portrait hidden, name/role/remit/links black
- `.contact-brief` prints; `.hero__engagements`, form, copy button, footer, plates and register stay hidden
- the existing print hide list loses `.profile__portrait` and gains `.profile-band__portrait`

### Forced colours / reduced motion
- existing tokens only; links rely on text + underline, not colour
- nothing new animates; the reduced-motion block is untouched apart from the dead
  `panel-settle`/`profile` selectors

## 6. Files and order of work (bottom-up)

1. `css/custom-styles.css` §7: rewrite hero layout; delete the profile rules; add
   `.hero__engagements`, `.profile-band`, `.contact-brief`; retarget 1120/900/640/420, print,
   forced colours, reduced motion
2. `index.html`: hero (remove aside, new copy, engagement line) → insert `.profile-band` after the
   hero → proof strip → services head/card 02/closing link → outcomes/method/register/training/CV
   intros → contact (h2, intro, brief, capacity note, facts) → imprint note → footer → head metadata
3. `storymap.html` / `memor.html`: only if a back-link label says "Expertise"/"Work". Nothing else.
4. `js/site.js`: no change expected; confirm nothing selected `.hero__profile`
5. `AGENTS.md`: V11 record, hero/profile description, services/contact copy responsibilities,
   verify invariants that named the removed elements
6. **Do not rerun** `tools/storymap/build_map.py` or `tools/memor/build_map.py`. Both map blocks
   must stay byte-identical to the standalone pages.

## 7. Invariants that must still hold

```
grep -c 'class="project-card"' index.html                  # 21
grep -c 'class="teaching-item"' index.html                 # 20
grep -c '<h1' index.html                                   # 1
grep -c 'class="section-head"' index.html                  # 8
grep -c 'article class="publication-highlight' index.html  # 2
grep -c 'map:begin\|map:end' index.html                    # 2, identical to storymap.html
grep -c 'memor:begin\|memor:end' index.html                # 2, identical to memor.html
grep -c '<script' storymap.html / memor.html               # 0 / 0
grep -n 'new window.IntersectionObserver' js/site.js       # 2
grep -nE 'animation[^;]*infinite' css/custom-styles.css    # 2 (caret, sending sweep)
gzip -c index.html | wc -c                                 # ≤ 30 KB (was 27.9)
```

Plus: unique ids, every fragment link resolves, no legacy tokens, no raw font sizes, no
`transition: all`, both plate maps unchanged.

## 8. Manual checks

- 1440 / 1120 / 900 / 640 / 390 / 360: one-column hero, profile band first below the fold at 1440,
  no sideways scroll, graph never sits on the measure at 0.09
- band at 1440 keeps all five links on one row with hairline separators; from 900px down the
  separators are gone and the links still fit one row at 641; at 360 the band stacks and the row
  wraps with no separators at all (gap only)
- keyboard: skip link → brand → nav → header CTA → hero CTAs → five profile links; focus visible
- print from the top: band as a text block, no portrait, no plates, no register, no form, no copy pill
- forced colours: band links and separators readable; no colour-only state
- reduced motion: no band settle (there is none), typing disabled as before
- JS disabled: band, trust/engagement line and all copy still read

## 9. Open questions (do not silently invent answers)

1. **Employment sentence (blocking).** §4's imprint note must be approved by the owner before
   publishing. It is the difference between "registered practice" and "leveraging the employer".
2. **Availability / capacity.** No "available from…" claim. The capacity note in contact is the
   honest, non-committal framing; a dated availability claim needs the owner.
3. **Rates / packages.** "Typical engagements" is descriptive. Numbered packages are V12.
4. **References.** "References from funded projects on request" would earn its line at this
   buyer — but only if the owner confirms he may name them.
5. **Typed focus line.** Kept and re-voiced; it preserves the documented motion contract. A stricter
   business read retires it later (one markup block, `initTypedFocus`, its CSS).
6. **GAMS claims.** Wording must match GAMS's own published claim; no dates or certification years
   are added.

## 10. Review log (architect pass, v11.0 → v11.1)

| Finding | Resolution |
| --- | --- |
| Services arrive 4–6 screens down | Engagement shapes named in the hero; no section moved |
| Don't change the graph's 900px hide (drift is `min-width:901px`) | Hide/geometry/drift untouched; ink lowered to 0.09 |
| `.profile-band` needs all five downstream blocks retargeted | Written into §5 and §6 as one commit, no half-rename |
| `aria-labelledby` a `<p>` makes a headingless region | `aria-label="Profile"` |
| Trust row duplicates the strip and front-loads the prize | Cut; replaced by the engagement line |
| `makesOffer` JSON-LD has no consumer | Cut |
| Hero lead's "independent engineering partner" raises the moonlighting question | Cut from the lead; capacity moved to contact + imprint |
| Typed phrase 2 implies grant-writing | Replaced |
| "audit" reads as financial audit | "technical review and modernisation" |
| "A specification is not required" pleads | "A one-page brief is enough." |
| GISA used as a competence proof | Becomes a procurement item (GLN + GISA) |
| Availability absent while a full-time post is visible | Capacity note in contact, personal-capacity sentence in imprint |

### Implementation audit (v11.1 → v11.2)

| Finding | Resolution |
| --- | --- |
| Band's links column squeezes identity to ~25ch at 901–1120px | Two-row band layout moved from the 900 block into the 1120 block |
| Graph still sits on 35–51% of the measure at 901–1120px | Narrowed to `min(50%, 520px)` at `right: -12%` inside the 1120 block; hide, geometry and drift untouched |
| Hairline separators lead a wrapped line at ≤640px | Band separators dropped at 640; hero engagement separators become gaps |
| Printed band links lost their underline and their ORCID value | Underline restored in print (identifiers read as links); the value stays a screen affordance |
| `.contact-brief` heading reused `.label`, reading as a field label | `.contact-brief__title` (600 weight, `--text-sm`) |
| Fifth contact fact ("Roles") orphaned the 2×2 facts grid | Roles moved to a `.contact-brief__note` under the facts |
| Hero lead and typed phrase 1 said the same thing | Lead now carries audience + credential; phrase 1 carries the promise |
| `og:title` still described V4 | Updated |

### Browser verification (v11.2 → v11.3)

| Finding | Resolution |
| --- | --- |
| Band read as portrait + identity + a detached links column at 1440, and the 900px link grid orphaned GAMS | Links moved into `.profile-band__identity`; grid reduced to `auto minmax(0,1fr)`, `align-items: start`; the 1120px band override and 900px link grid deleted |
| Printed contact kept a JS-revealed “Copy” pill, a dead control on paper | `.copy-btn` added to the print hide list |
| A hairline separator led the second link row once the band narrowed; the ≤640 removal was too late | Band separators dropped at ≤900px (existing breakpoint); icons, underline and gap carry separation, and print drops them too |
| The engagement `·` began wrapped lines at 360px | Dots removed at ≤640; the gap separates items, so no line can begin or end with a separator |
| Dead `.hero h1 em` rule after V11 removed the `<em>`, plus an orphaned `#i-pin` symbol | Both removed; the AGENTS serif list no longer names the em reset |
| §5 said `.hero__engagements` prints | Corrected: it is print-hidden |
| Verified | 1440/1120/900/390/360 layout with no sideways scroll (`sw 360 / iw 360` at 360); typed rotation, caret, pause/resume label+icon; tab order skip → brand → nav → CTAs → band links; arrival class added and removed; skip link reaches `#main` without an arrival draw; forced colours paint band rules, caret and toggle in `CanvasText` and hide both graphs; reduced motion leaves phrase 1 static with no caret or toggle; print is 10 letter pages with band, outcomes, capabilities, method, training, CV and contact, and no plates, register, form or footer |
| Static battery after the restructure | 21 cards, 20 teaching items, 1 `h1`, 8 section-heads, 2 publication highlights, no duplicate DOIs or ids, all fragments resolve, 2 observers, 2 infinite animations, 8 serif declarations, both map blocks byte-identical, 0 scripts on the standalone pages, gzip 28,367 B |

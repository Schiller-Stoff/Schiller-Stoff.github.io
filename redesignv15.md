# V15 — "The proof, not the portfolio"

Status: **implemented on `redesign`, uncommitted** (14 Nov 2026). V14 is
untouched. V15 changes content, not the design system: no new section, no new
component family beyond one hairline note, no new script, no new font. See §10
for the implementation record.

Review: developer pass, 14 Nov 2026. Measured at 1440/1280/1121/1120/1000/901/
900/641/640/420/375 (plus 720px as the 200% zoom equivalent), in print, forced
colours and reduced motion. Two accuracy corrections from the implementation
brief are folded in below (§2 and §4, listed in §8).

---

## 1. The thesis

The page told a durability story with generic agency proof. V15 tells it with
the archive, the two remembrance platforms and the handover work:

> The proof is not a portfolio. It is a national memorial landscape, a city
> memorial book, and the certified archive both run on — with the testing,
> operating-cost and training work that keeps them alive.

Three internal pillars, never printed as labels, a section or navigation:

1. **Build** — DERLA, plus MEMOR as dataset co-author: public remembrance
   platforms, data model to interface. MEMOR is never claimed as built alone.
2. **Operate** — GAMS: the OAIS/CoreTrustSeal archive both run on.
3. **Sustain** — testing, preservation, operating-cost estimates, training.

AI stays a supporting capability, carried by the two practice notes and service
card 04. It gets no new prominence.

## 2. What changed in the outcomes

The three outcome articles become **DERLA → MEMOR → GAMS**, preserving the
alternating media (left / right / left) and closing the section with the archive:

| Order | Outcome | Media | Treatment |
|-------|---------|-------|-----------|
| A | DERLA: Digital Memorial Landscape | `01_portfolio_derla.webp` 900×774 | unchanged `.outcome__media`, no figure, no caption |
| B | MEMOR: the digital memorial book of Graz | `23_portfolio_memor.webp` 900×675 | `.outcome--flip` + `.outcome__figure` + caption |
| C | GAMS: the university's certified archive | `22_portfolio_gams.webp` 900×675 | `.outcome__figure` + caption |

ReInHerit and ZIM-Graphviz leave the outcomes: they are the two claims that read
as agency portfolio rather than durability proof. Both stay in the project
register (`p06`, `p03`), so no work is deleted from the page. The four evidence
items per band are unchanged in count; the claims inside them are the V15 ones.

The DERLA award note is byte-for-byte unchanged. MEMOR links its project site
and `memor.html`, never the Zenodo DOI (which stays as a link once, in the
training highlight). GAMS links its repository and preservation plan; the certification
is attributed to the repository, not the person.

## 3. Why two figures and one captionless outcome

- DERLA already has a product screenshot in a 4:3 bed. A caption would restate
  the image. It keeps the plain `.outcome__media` and no `figcaption`.
- MEMOR's map and GAMS's homepage need a sentence of provenance: the map is the
  open dataset's last voluntary addresses (no names, OSM boundary credit), and
  GAMS's screenshot is the repository's own page with its trust marks. Both are
  `<figure class="outcome__figure">` with `.outcome__caption`.
- The flip outcome now orders the **figure**, not the media, so the caption
  travels with the map. `.outcome--flip .outcome__figure { order: 2 }`; at
  ≤900px the figure resets to `order: 0` and the body follows.
- Print hides `.outcome__figure` with `.outcome__media`, so neither the new
  images nor their captions print. The outcome copy, evidence and contributions
  still print.

## 4. Hero, profile and proof strip

- The hero lead is now two paragraphs: the offer (`I build archives … tests,
  operating costs, training`) and a factual note (`I lead development of the new
  version of GAMS …`). `.hero__lead-note` is `--text-sm`, muted, `54ch`, one
  `--space-sm` below the lead. The eyebrows, `h1`, typed line, actions, index
  and engagements are unchanged.
- Hero index metas: Work `23 projects`, Experience `Since 2016` (university
  employment starts at UNI-IT in 2016; the family business stays in the CV).
- Profile remit: trained in art history, history and digital humanities; leads
  the new GAMS version; names DERLA, MEMOR, LIPFA and CANTUS.
- Proof strip: System note `OAIS · CoreTrustSeal (2019) · CLARIN B`;
  Recognition note `Awarded to the DERLA project`. The 2024–2027 seal dates are
  deliberately not printed (renewal due Feb 2027, no owner named). The note
  reads `(2019)`, not `since 2019`, because the 219px note column at 1440px
  renders `OAIS · CoreTrustSeal since 2019 · CLARIN B` at 238px (three lines)
  while `OAIS · CoreTrustSeal (2019) · CLARIN B` fits at 215px. In the markup
  `(2019)&nbsp;&middot;&nbsp;CLARIN&nbsp;B` is one unbreakable run, so the 199px
  and 144px columns break after `CoreTrustSeal` and never leave a separator
  starting a line. The GAMS outcome Result deliberately keeps the
  older phrasing `CoreTrustSeal since 2019` — it sits in a wider evidence cell
  and reads as prose, not as a strip label.
- The feature-plate note keeps its existing sentence and appends one: `Both are
  built on GAMS, the archive I help develop.`

## 5. The approach note

One new component, `.approach-note`, is a sibling of `.delivery-path` inside
`#approach-section`: a `72ch` muted paragraph with a hairline top rule and two
`.text-link`s — the MA thesis (open access, URN) and the GAMS end-to-end test
tool. No card, no index number, no fifth delivery step, no observer, no
`html.*` gate. The rule is static ink and prints.

The note carries the **Sustain** pillar in the owner's own words: automated
end-to-end tests, an operating-cost estimate, and training for the team that
takes over.

## 6. The register at 23

Two cards are inserted immediately after DERLA (`p01`), without renumbering any
existing id:

- `p23` MEMOR — Digital Memorial Book of Graz (`ns-opfer-graz.at`, flag `2026`)
- `p22` GAMS — Humanities Asset Management System (`gams.uni-graz.at`, flag
  `CoreTrustSeal`)

The static count and the hero meta become `23 projects`. `js/site.js` derives
the live count and load-more labels from the DOM, so the page size is unchanged:
9 visible, then 9, then 5. With JavaScript off all 23 cards are visible and the
filters/load-more stay hidden.

## 7. Training and CV

- Training intro now names the record's span: the 2021 long-term archiving
  presentation, the 2026 DHd presentation on AI assistance in GAMS, and the Data
  Steward (2024) / Data Librarian (2025) programmes. The items are presentations,
  so the intro says presentation, not paper. The 21 items and both publication
  highlights are unchanged.
- CV intro: `Since 2017 I have built research software at the University of
  Graz …` (not "a decade at the university"; 2009 is the family business).
- 2019–2022 description: `Developed infrastructure, digital editions and
  teaching technology for memory preservation.`
- MA Digital Humanities 2020 gains the thesis line with both titles (German
  `lang="de"` and English) and the open-access URN link.
- Core competencies are four groups instead of two: Web development, Digital
  preservation, Software quality, Research & AI. The grid is 2×2 above 640px,
  one column at ≤640, and two columns in print.

## 8. Claims ledger

Every new or changed sentence maps to a row. The two implementation-brief
corrections are marked **(corrected)**.

| Claim | Source |
|-------|--------|
| GAMS is OAIS-compliant; CoreTrustSeal since 2019; CLARIN B; WDS **member** | GAMS About page (OAIS, 2019 seal, CLARIN B, WDS membership); CoreTrustSeal certificate PDF (2024–2027) |
| GAMS first certified 2014 ("Trusted since 2014" tag) | GAMS About page (DSA 2014) |
| GAMS uses Fedora/Cirilo, IIIF and metadata workflows (service card 02) | GAMS About page |
| DERLA and MEMOR are built on GAMS; LIPFA and CANTUS are GAMS collections | DERLA collection; `memor.html` colophon and citation (GAMS); `gams.uni-graz.at/lipfa`, `/cantus` |
| "Trained in art history, history and digital humanities" (profile remit) | CV education; MA Digital Humanities 2020 |
| Operating-cost estimates are part of the practice | Owner's account; no public artefact (service card 01, approach note) |
| DERLA 4,393 records, 232 sites of terror | `tools/storymap/build_map.py`; DERLA plate |
| DERLA State Prize 2024, category "Geschichte innovativ" | erinnern.at announcement |
| DERLA run by ERINNERN:AT, Centrum für Jüdische Studien, ZIM | erinnern.at announcement; DERLA site |
| MEMOR 812 people, 808 with a last address, 604 distinct addresses, CC BY 4.0 | MEMOR dataset; `tools/memor/build_map.py` |
| MEMOR one of five authors, dataset co-created with Gerald Lamprecht | `memor.html` colophon; Zenodo creators |
| MA thesis title and open access | URN `urn:nbn:at:at-ubg:1-150258` |
| 21 teaching records, Data Steward 2024, Data Librarian 2025 | `index.html` items; ORCID |
| GAMS E2E test tool | `github.com/Schiller-Stoff/gams-tests` |
| "Since 2016" (university employment) | CV 2016–2017 UNI-IT; 2017– DH roles |
| "Since 2017" research software | CV 2017–2019 frontend; 2019–2022 research engineer |

Corrections folded in:

- **(corrected)** The hero note says "the new version of GAMS", not that the
  owner runs GAMS. The same wording is used in the profile, service card 02 and
  the GAMS evidence role.
- **(corrected)** The MEMOR and GAMS `h3`s use sentence case after the colon
  (`MEMOR: the digital memorial book of Graz`, `GAMS: the university's certified
  archive`); DERLA keeps its title case as supplied.

## 9. Removed claims

Removed, not replaced:

- metrics: "250+ memorials", "15k+ monthly users", "20k+ monthly visitors",
  "1000+ downloads", "3 citations";
- adjectives/phrases: "comprehensive", "advanced filtering", "complex
  relationships", "digital commons", "Leading research".

No count-up, no scroll reveal, no perpetual animation, no new metric.

## 10. Implementation record

Files touched: `index.html`, `css/custom-styles.css`, `README.md`, `AGENTS.md`,
this record. Not touched: `js/site.js`, `storymap.html`, `memor.html`,
`ai-agents.html`, `ai-coding.html`, both map generators and the
`map:begin/map:end` and `memor:begin/memor:end` blocks.

Images: `images/portfolio/22_portfolio_gams.webp` (900×675) and
`images/portfolio/thumbs/22_portfolio_gams-224.webp` (224×168) are a screenshot
of the public GAMS homepage, keeping the system's green palette. The MEMOR pair
(`23_portfolio_memor.webp` 900×675, `23_portfolio_memor-224.webp` 224×168) is
the whole Graz boundary with all 604 distinct last addresses drawn from the open
dataset — one dot class, no names, no house numbers, never a homepage screenshot.
A 4:3 centre crop was tried and rejected: it cut the boundary and some dots, so
the caption's 604 could not be read off the frame, and the disconnected boundary
fragment looked like a river. The whole-city framing repeats the feature plate's
map on purpose; the plate is the study, the outcome is the dataset exhibit.
Dimensions verified with Pillow; both are already in the working tree.

Checks run (exact outputs):

```
project-card 23 · teaching-item 21 · h1 1 · section-head 8 · evidence-item 12
outcome articles 3 (2 plain + 1 --flip) · outcome__figure 2 · outcome__caption 2
tag-group 4 · hero__index-link 6 · DOI duplicates none
map/memor splice diffs empty; map markers 2 in each host
no --navy/--surface-muted/--wash-/--shadow-header; no transition: all
no CDN/framework reference; gjs stops at "document is not defined" (syntax valid)
gzip index.html 30,221 bytes (~29.5 KB)
```

Browser pass: no sideways scroll at 1440/1280/1121/1120/1000/901/900/641/640/
420/375/720. Outcomes alternate above 900 and stack (figure first) at ≤900.
Captions sit under their figures and do not orphan. Tag groups 2×2 to 640, one
column at 640. Register loads 9 → 18 → 23; filters Platform 11, Research 11,
Tools 9, Teaching 4. Hero focus line reserves 30px on one line (59px at ≤420) and
the copy height stayed constant while typing. Print (Letter) drops both
figures/captions and prints the approach note, thesis line and four competency
groups. Forced colours: approach rule `CanvasText`, links `LinkText` underlined.
Reduced motion: no `motion-ready`/`typed-ready`, scene complete, no spine or
progress animation. JavaScript off: 23 cards, no filters or load-more, phrase 1
complete.

Open for the owner:

1. Confirm "leads development of the new version of GAMS" is the wording wanted
   everywhere (the hero says "senior developer" in the profile role line).
2. Confirm the MEMOR contribution bullets, especially "prepared the register and
   last-address records".
3. Keep ReInHerit's technical-lead claim only as its register card, or restore it
   to the CV summary?
4. Approve the two prepared images (the register moves 21 → 23) and confirm the
   public GAMS homepage capture may be republished. The MEMOR outcome is the
   whole-city map; a 4:3 centre crop was rejected because it cut the boundary and
   could not support the 604 count. If either image is rejected, revert to 21
   cards and change README's "full register" to "selected register".
5. `grep -c '20510043' index.html` is **2**, not 1: one plain citation in the
   MEMOR plate caption and one `doi.org` link in the training highlight. The
   duplicate-DOI check is clean. This was already true before V15.
6. Approve the personal-capacity `.legal-note` in the contact card;
   `redesignv11.md` §9.1 is still blocking.

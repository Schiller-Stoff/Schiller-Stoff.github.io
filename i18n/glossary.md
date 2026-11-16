# German glossary and review rubric

The German pages are a translation of the English source, not a second opinion. Same
claims, same numbers, same evidence order. Where German needs a shorter phrase to fit a
fixed slot (nav, index pane, pill), shorten the German — never the claim.

## Voice

* First person singular, like the English: «ich baue», «ich arbeite», not «wir».
* Address the reader with **Sie**, never «du». Where English has no pronoun, keep it
  pronoun-free (`Projekt anfragen`, not `Fragen Sie Ihr Projekt an`).
* Same register as the English: sober, specific, no marketing superlatives, no
  «maßgeschneidert», no «Leidenschaft», no «Experte für …».
* Sentence case for headings (first word and nouns capitalised). No title case.
* One sentence per claim. Do not merge two English sentences into one long German one.

## Typography and numbers

| rule | example |
| --- | --- |
| thousands separator `.` | `4.393`, `4.161`, `1.015`, `2.765`, `1.662` |
| decimal comma | `0,7` (not `0.7`) |
| ranges with `–`, no spaces | `2019–2025`, `2023–2025` |
| dates `D. Month YYYY` | `13. November 2026` |
| quotes `„…“`, inner `‚…‘` | `„Geschichte innovativ“` |
| en dash for asides, spaced | ` — ` becomes ` – ` (German uses the shorter dash) |
| no space before closing punctuation | `Impressum</a>. Ich antworte`, never `Impressum</a> . Ich antworte` |
| non-breaking space before a unit/name pair | `CC\u00a0BY`, `CLARIN\u00a0B`, `2.765\u00a0Einträge` |

A translation may move a full stop or comma across an inline link (`See the <a>imprint</a>
for …` → `finden Sie im <a>Impressum</a>. Ich antworte …`). The generator drops the
source's boundary space when the German value starts with closing punctuation and adds it
only when the value needs one; `--check` fails on a stray ` .`, ` ,`, ` ;`, ` :`, ` !` or
` ?` in any built German page, so this cannot regress silently.

## Terms

| English | German | note |
| --- | --- | --- |
| digital heritage engineering | Digitale Kulturerbe-Software | brand descriptor; the discipline name stays English in the eyebrow: `Digitales Kulturerbe · Graz, Österreich` |
| digital heritage, engineered to last | Digitales Kulturerbe, das bleibt. | h1 |
| archive | Archiv | |
| memorial platform | Gedenkplattform | |
| heritage institutions | Kultureinrichtungen | never «Kulturerbe-Einrichtungen» |
| memorial landscape | Erinnerungslandschaft | DERLA's own German name: Digitale Erinnerungslandschaft |
| memorial book | Gedenkbuch | `Digitales Gedenkbuch` |
| memorial marker | Gedenkzeichen | umbrella term; the forms are Gedenktafel, Stolperstein, Denkmal |
| site of terror | Tatort | DERLA's German usage; plural `Tatorte` |
| records (map counts) | Einträge | |
| role / scope / result / evidence | Rolle / Umfang / Ergebnis / Beleg | `Beleg`, never `Beweis` |
| what I contributed | Mein Beitrag | |
| selected outcomes | Ausgewählte Ergebnisse | |
| work with public impact | Arbeit mit öffentlicher Wirkung. | |
| services | Leistungen | |
| work (nav, register) | Projekte | the nav item and the index pane use the same word |
| writing (nav, series) | Texte | the nav item; the series says `Ausgewählte Texte` / `Alle Texte`; never «Blog» |
| experience (nav) | Werdegang | |
| training / teaching | Schulungen / Lehre | section eyebrow `Schulungen`, filter `Lehre` |
| project register | Projektregister | heading: `Projekte und Beiträge.` |
| filters / all work / platforms / research / tools | Filter / Alle Projekte / Plattformen / Forschung / Werkzeuge | |
| start a project | Projekt anfragen | pill and hero action; the section heading is `Ein Projekt beginnen.` |
| see the evidence | Belege ansehen | |
| typical engagements | Typische Aufträge | |
| technical review and modernisation | technische Prüfung und Modernisierung | |
| working method | Arbeitsweise | |
| approach | Vorgehen | |
| current position | Aktuelle Position | |
| core competencies | Kernkompetenzen | |
| legal / imprint | Rechtliches / Impressum | heading `Impressum und Datenschutz.` |
| affiliation / system / recognition / procurement | Institution / System / Auszeichnung / Gewerbe | the fourth is the GISA/GLN block: `Gewerbe` |
| full-stack development | Full-Stack-Entwicklung | |
| long-term preservation | Langzeitarchivierung | |
| research software | Forschungssoftware | |
| linked data | Linked Data | keep |
| digital edition | Digitale Edition | |
| collection | Sammlung / Bestand | `Sammlung` for a museum, `Bestand` for an archive |
| dataset | Datensatz | |
| open dataset | Offener Datensatz | |
| register (MEMOR) | Register | |
| last voluntary address | letzte freiwillige Adresse | first mention; then `letzte Adresse` |
| forced address | erzwungene Adresse | |
| recorded at a forced address | an einer erzwungenen Adresse gemeldet | the register's preposition is `an`, never `in`; the page says `gemeldet an`, never `deportiert nach` |
| death records (the rows that carry a date or a place) | Sterbeeinträge | `Todesfälle` is reserved for counted deaths (`668 Todesfälle`, `die 247 …`) |
| died at Hartheim | in Hartheim ermordet | Hartheim was a killing centre; `gestorben` would soften a documented murder. Keep the count identical |
| users | Nutzende | not `Nutzerinnen und Nutzer`; matches `Forschende` |
| trusted since 2014 | vertrauenswürdig seit 2014 | proof-strip note under GAMS |
| concrete problems from research and business | konkrete Probleme aus Forschung und Wirtschaft | not `echte Forschungs- und Wirtschaftsprobleme` |
| copy / copied | Kopieren / Kopiert | |
| send message | Nachricht senden | |
| your name / email address / subject / message | Ihr Name / E-Mail-Adresse / Betreff / Nachricht | |
| (optional) | (optional) | |
| back to top | Nach oben | |
| skip to content | Zum Inhalt springen | |
| toggle navigation | Menü | visually hidden label: `Menü ein- und ausblenden` |
| primary (nav label) | Hauptnavigation | |
| explore the work (nav label) | Die Arbeit erkunden | |
| index | Index | the artefact metaphor survives |
| language | Sprache | switch group label |
| colophon | Kolophon | |
| practice note | Praxisnotiz | masthead `Praxisnotiz`, keep `KI-Agenten` / `KI-Coding` as page names |
| brief | Auftrag | `Brief · tools · checks` → `Auftrag · Werkzeuge · Prüfung` |
| the check | Die Prüfung | |
| what I teach | Was ich vermittle | |
| what the map cannot show | Was die Karte nicht zeigt | |
| what changed | Was sich geändert hat | |
| the curriculum | Das Curriculum | |
| the limits | Die Grenzen | |
| the signature | Die Unterschrift | |
| workshop / talk / lecture / presentation / conference abstract | Workshop / Vortrag / Vorlesung / Präsentation / Konferenzabstract | event forms, not Zenodo resource types |
| artificial intelligence / AI | Künstliche Intelligenz / KI | `KI-Agenten`, `KI-Coding`, `KI-gestützt` |
| AI coding | KI-Coding | deliberately short: the hero pane title slot is ~116px wide |

## Never translate

GAMS, DERLA, MEMOR, LIPFA, CANTUS, ZIM, DDH, ERINNERN:AT, Centrum für Jüdische Studien,
Department of Digital Humanities (institutional proper name; only `University of Graz`
becomes `Universität Graz`, `City of Graz` becomes `Stadt Graz`), OAIS, CoreTrustSeal,
CLARIN, WDS, IIIF, Fedora, Cirilo, Zenodo, DOI, Formspree, ORCID, GitHub, LinkedIn,
Google Scholar, GISA, GLN, ODbL, CC BY 4.0, CC BY-NC 4.0, Digital Humanities,
Linked Data, Storymap, Repository, Launch, Open Access, Bock CLI Tool, JetBrains.

German-language publication, event and course titles already carry `lang="de"` in the
English source and are copied unchanged (the generator never touches a `lang="de"`
subtree). Do not translate them into English anywhere and do not reword them.

## The GAMS role (applies to both languages)

The owner is **senior developer for GAMS**, not its lead. English source first, then the
catalog:

| place | English | German |
| --- | --- | --- |
| hero note | I am senior developer on the new version of GAMS, … | Ich bin Senior-Entwickler für die neue Version von GAMS, … |
| profile remit | Senior developer on the new version of GAMS, the CoreTrustSeal-certified archive behind DERLA, MEMOR, LIPFA and CANTUS. | Senior-Entwickler für die neue Version von GAMS, das CoreTrustSeal-zertifizierte Archiv hinter DERLA, MEMOR, LIPFA und CANTUS. |
| GAMS evidence, Role | Senior developer · current version | Senior-Entwickler · aktuelle Version |
| GAMS contributions | Senior developer on the new GAMS version | Senior-Entwickler für die neue GAMS-Version |
| services card 02 | I am senior developer on the new version of GAMS, … | Ich bin Senior-Entwickler für die neue Version von GAMS, … |
| CV entry | Senior developer on the new version of GAMS, the digital archive at DDH Graz. … | Senior-Entwickler für die neue Version von GAMS, das digitale Archiv am DDH Graz. … |

`I help develop` may stay (`Ich entwickle mit an …`) where it already reads modestly.

## Position titles

The official English form stays on the German page — `Senior Developer (Full-Stack Engineer)`,
`Computational Research Engineer`, `Frontend Engineer`, `IT Administrator`, `Digital Marketing
Manager`, `Freelance Software Engineer`. German prose around them describes the role; never
invent a German job title. `Senior-Entwickler` appears only inside a German sentence, never as
a position heading.

## Titles and citations

* An English deposit title is translated on the German pages; both practice notes say so in
  their colophon (`Die Titel richten sich nach den hinterlegten Fassungen; englischsprachige
  Titel sind ins Deutsche übersetzt.`). The English page keeps the deposit verbatim.
* German-language deposits carry `lang="de"` in the English source and are copied unchanged;
  never reword them, even to fix a hyphen or a quotation mark (`KI gestützte Programmierung`,
  `Project Overhaul und Refactoring …`).
* The teaching list, project register and CV entries are editorial titles, translated like
  prose (`Einführung in das KI-Agenten-Engineering`, `KI-Coding-Assistenten (fortgeschritten)`).
* Proper names are never translated: the project `MEMOR — Das Digitale Gedenkbuch der Stadt
  Graz`, the MEMOR citation, `Bock CLI Tool`, `JetBrains`, `Digital Humanities`.
* The MEMOR dataset line in the German colophon renders the deposited title in German next to
  the DOI. The dataset is a bilingual project artefact, not a workshop deposit; if the owner
  prefers the English title verbatim, only that catalog value changes.

## Review checklist

1. Every claim, number, date and proper noun in the English page has a counterpart in the
   German page — count them (`4.393`, `232`, `2.765`, `812`, `604`, `247`, `23`, `21`).
2. No sentence starts with a lower-case letter, no heading is in title case.
3. No «Sie»/«du» mix; no «wir» where the English says «I».
4. Terminology table applied everywhere, including the meta description, `alt` texts,
   `aria-label`s and the JS strings.
5. Numbers use `.` as the thousands separator and `,` as the decimal separator.
6. Quotes are `„…“`; dashes are ` – ` (spaced) for asides and `–` for ranges.
7. Nothing reads like a translation: no `Es gibt`, no `Dies ermöglicht`, no nominal style
   chains longer than three nouns.
8. The GAMS role is *senior developer* everywhere, never *lead*.
9. `lang="de"` subtrees are untouched; German titles are not quoted in English.
10. Read the page aloud once per section. If a sentence needs a second breath, split it.

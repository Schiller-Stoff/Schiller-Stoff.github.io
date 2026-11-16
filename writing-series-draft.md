# Selected writing — series draft (V17)

Status: **draft for design and implementation**. Owner decisions are marked
`OWNER:`; everything else is settled by this document.

Date: 15 November 2026. Source of truth for content: this file. The English
pages are written from it; the German pages are generated from the English
pages plus `i18n/de.json`, as the site already does for the other five pages.

---

## 1. Why this series exists

The CV already lists 21 training records and 24 Zenodo records. It says what
was deposited, not what it argued. This series takes five deposits, one per
line of work, and gives each a reading: what the work claimed, what still
holds, and what I would say differently now.

It is **not** a reprint and **not** a second practice note. The two practice
notes (`ai-agents.html`, `ai-coding.html`) state the method. The posts state
the record and re-read it. Where a post and a practice note overlap, the post
defers to the practice note and links to it.

---

## 2. Selection (settled with the owner)

Rule: **reach, then distinctness** — one post per line of work, ranked by
Zenodo reach within that line. No two posts may argue the same thesis.

| # | Post | Zenodo record | Type | Deposited | Downloads | Unique | Co-authors |
|---|---|---|---:|---|---:|---:|---|
| 1 | Agents are roles, not robots | 10.5281/zenodo.14999965 | Lesson | 10 Mar 2025 | 3,154 | 2,760 | Scholger, Pollin |
| 2 | Autocomplete was never the point | 10.5281/zenodo.10288101 | Presentation | 7 Dec 2023 | 862 | 770 | Martin |
| 3 | A shared language for systems | 10.5281/zenodo.15421823 | Presentation | 15 May 2025 | 227 | 170 | Tosques |
| 4 | FAIR is a gate, not a badge | 10.5281/zenodo.17178206 | Conference paper | 22 Sep 2025 | 103 | 95 | Münzer |
| 5 | Organisation determines technology | 10.5281/zenodo.8386446 | Conference paper | 29 Sep 2023 | 140 | 131 | Vasold, Steiner |

Reach as reported by the Zenodo API on 15 November 2026. The pages date-stamp
the figures; they are evidence, not a live counter.

**Omitted on purpose** (they repeat posts 1–2): `14943178` (277/264),
`10698240` (281/260), `14234115` (289/251), `14195629` (242/151),
`13751610` (229/147), `11196383` (193/167). They stay in the teaching list and
in the practice notes. The index page states this selection rule in public.

**Owners' alternatives rejected:** strict download ranking (four of five posts
would be AI-coding workshops); preservation-weighted (drops the first-author
FORGE paper for a ten-author iPRES paper).

---

## 3. Page contract

Six new English pages, six generated German twins. Flat root, like the two
practice notes — no new directory, so the generator's `../` asset rule and the
`de/` sibling links keep working unchanged.

| English | German | `lang-alt` / `lang-switch` | Script |
|---|---|---|---|
| `writing.html` | `de/writing.html` | yes | none |
| `writing-agents.html` | `de/writing-agents.html` | yes | none |
| `writing-copilot.html` | `de/writing-copilot.html` | yes | none |
| `writing-architecture.html` | `de/writing-architecture.html` | yes | none |
| `writing-fair-code.html` | `de/writing-fair-code.html` | yes | none |
| `writing-organisation.html` | `de/writing-organisation.html` | yes | none |

Add six rows to `PAGES` in `tools/i18n/build_i18n.py`:

```python
("writing", "writing.html", "writing.html"),
("writing-agents", "writing-agents.html", "writing-agents.html"),
("writing-copilot", "writing-copilot.html", "writing-copilot.html"),
("writing-architecture", "writing-architecture.html", "writing-architecture.html"),
("writing-fair-code", "writing-fair-code.html", "writing-fair-code.html"),
("writing-organisation", "writing-organisation.html", "writing-organisation.html"),
```

Then `--render-markers`, write the German, `--build`, `--check`. Never edit
`de/*`.

### Shared post skeleton (all five)

```html
<header class="sm-head"> … note: <span class="label">Selected writing</span> <theme> …
  nav aria-label="Selected writing": All writing · Back to the CV · Colophon
</header>
<main>
  <section class="sm-hero"> kicker · h1 · standfirst · meta </section>
  <nav class="sm-rail" aria-label="Chapters">
    01 Why it exists · 02 The argument · 03 What holds in 2026 · 04 The record · Colophon
  </nav>
  <section id="ch-01"> … </section>
  <section id="ch-02" class="sm-chapter--paper"> … </section>
  <section id="ch-03"> … </section>
  <section id="ch-04" class="sm-chapter--paper"> … source record (dl.sm-meta) + Zenodo link </section>
  <section id="colophon" class="sm-colophon"> … </section>
</main>
<footer class="sm-foot"> … </footer>
```

The four chapter labels are identical across the five posts. That is a series
signature and a translation-cost decision: the catalog stores each shared
string once.

Each post uses **one** structural component from §19, chosen to fit its
argument: `sm-split` (post 1, 3), `sm-steps` (post 2, 4, 5). Optional `.sm-note`
closes a chapter. No figures, no maps, no charts.

### Series index layout

`writing.html`: hero, rail (`01 The five`, `02 How I chose`, `Colophon`), a
list of five posts, the selection note, colophon. The list is the one new
component (see §6); each row shows `01`, the title, the standfirst, and a meta
line `AI agent engineering · 2025 · 3,154 downloads`.

---

## 4. Integration with the existing site

Lowest-cost, no layout risk:

1. **CV training section** — one new `publication-highlight--text` block after
   the MEMOR dataset line, title "Selected writing", one paragraph, one
   `.text-link` to `writing.html`. No new CSS. Count changes: none of the
   verified `grep -c` invariants cover `publication-highlight` except the
   existing `2`; it becomes `3`, so AGENTS.md's verify line must be updated.
2. **Practice notes** — one sentence in each colophon's `Sources` row linking
   the longer reading: `ai-agents.html` → `writing-agents.html`;
   `ai-coding.html` → `writing-copilot.html` and `writing-fair-code.html`.
3. **Posts** — each links to its source DOI (external), to `writing.html`, to
   the CV, and to the matching practice note where one exists.
4. **Header nav of the CV is untouched.** The hero index is untouched: six
   panes divide evenly and a seventh would create a ragged row.

`OWNER:` whether the CV training-section block is wanted at all. If refused,
`writing.html` is reachable only from the practice notes and from the posts
themselves; that is worse for discovery but costs one translated block less.

---

## 5. Content — the five posts

Numbers, dates and co-authors below are from the Zenodo records. German uses
the glossary: `ich`, `Sie`, `.` thousands, `D. Month YYYY`, `„…“`, ` – ` for
asides, `–` for ranges. Record titles are English on the English page and
translated on the German page (see glossary §Titles and citations); German
deposit titles carry `lang="de"` and are never reworded.

---

### 5.1 `writing-agents.html` — Agents are roles, not robots

**EN**

- kicker: `Selected writing · AI agent engineering`
- h1: `Agents are roles, not robots.`
- standfirst: `The 2025 agent-engineering workshop did not start with a framework. It started with a question: which human role does this agent stand in for? That question still decides whether an agent is useful.`
- meta: `Source record · 10 March 2025 · CC BY 4.0`

**01 Why it exists**

lede: `"Agent" arrived in the Digital Humanities as a vendor word.`

> In early 2025 the word was doing two jobs at once: a product category and a
> design pattern. The workshop — a section of the advanced prompt and
> agent-engineering workshop at DHd 2025 in Bielefeld — tried to separate them.
> Its showcase was not a chatbot. It was a group of cooperating agents
> producing teaching material for DERLA, the digital memorial landscape.
>
> The audience was mixed: people who wrote Python and people who commissioned
> it. So the workshop taught one language for both — Python, a commercial model
> provider, and an object-oriented model of the work.
>
> The aim was deliberately modest: a basic understanding of agent engineering,
> enough to build a semi-automated system and enough to judge one.

**02 The argument**

lede: `Three words, three disciplines: AI, agent, engineering.`

> The AI part is the smallest. Prompting, context and evaluation are the
> everyday skills; training and inference are the machine room. The workshop
> spent its time on the difference between using a model as a knowledge base
> and using it as an interface to a system.
>
> The agent part is software design. The workshop's definition is narrow on
> purpose: an agent is a code abstraction around an LLM, built around a human
> role in a domain — data stewardship, cataloguing, research assistance — and
> it should mirror how that domain divides its labour. A framework is optional.
> Full autonomy is optional. A role is not.
>
> The engineering part is research software engineering: versioning, tests,
> cost, evaluation. The demonstration was a small crew — a planning agent, a
> scanner, price analysts, an ensemble that compares them, and a messaging
> agent. Each one is legible on its own.

`sm-split`:
- **In the workshop's definition:** a named role; a domain division of labour; explicit tools; a written task; an evaluation step.
- **Not required:** an agent framework; full autonomy; one vendor; a chat window.

> That is the whole argument. The model is a component. The role is the design.

**03 What holds in 2026**

lede: `The tools moved faster than the definition.`

> Two years on, the frameworks have consolidated and the interfaces have moved
> from chat to the change set. What did not move is the useful unit of design.
> An agent that cannot name the role it stands in for is a demonstration.
>
> The 2026 GAMS paper asks the same question one level up: where the sweet spot
> lies between reusing model building blocks and building your own, and how to
> integrate either without technical debt. The workshop's answer was to keep the
> boundary small.
>
> What I would change: teach cost and evaluation first, not last. In 2025 the
> pricing slide came after the architecture; in 2026 the bill is part of the
> architecture.
>
> And I would say the quiet part louder: a role is also an accountability.
> Someone signs the output. The workshop said this in its engineering section;
> it belongs at the front.

**04 The record**

intro: `The deposit is a lesson, not a paper: slides and four notebooks, open for reuse.`

record card (dl.sm-meta):
- Title: Introduction to AI-Agent-Engineering
- Type: Lesson
- Deposited: 10 March 2025
- DOI: 10.5281/zenodo.14999965
- Co-authors: Martina Scholger, Christopher Pollin
- Licence: CC BY 4.0
- Reach: 3,154 downloads, 2,760 of them unique (Zenodo, 15 November 2026)
- Contents: slides (PDF) and four Jupyter notebooks

link: `Open the record on Zenodo`

**Colophon**

- Method: `A reading, 15 November 2026. It describes what the workshop argued and what I would teach differently now; it is not a reprint.`
- Sources: `The 2025 workshop deposit, its four notebooks, and the 2026 GAMS paper and talk, which extend the same question to system level.`
- Authorship: `Sebastian David Schiller-Stoff. The workshop was co-authored with Scholger and Pollin. The reading is mine.`
- JavaScript: `None. The page is text, CSS and a small inline sprite.`
- Licence: `Text and layout: CC BY-NC 4.0. The cited record keeps its own CC BY 4.0.`
- back: `Back to the CV` / `All writing`

**DE**

- kicker: `Ausgewählte Texte · KI-Agenten-Engineering`
- h1: `Agenten sind Rollen, keine Roboter.`
- standfirst: `Der Workshop zum KI-Agenten-Engineering von 2025 begann nicht mit einem Framework. Er begann mit einer Frage: Welche menschliche Rolle vertritt dieser Agent? Diese Frage entscheidet bis heute, ob ein Agent nützlich ist.`
- meta: `Quelle · 10. März 2025 · CC BY 4.0`

**01 Warum es den Text gibt**

lede: `„Agent“ kam als Anbieterwort in die Digital Humanities.`

> Anfang 2025 trug der Begriff zwei Bedeutungen gleichzeitig: Produktkategorie
> und Entwurfsmuster. Der Workshop – ein Abschnitt des Workshops zu
> fortgeschrittenem Prompt- und Agenten-Engineering auf der DHd 2025 in
> Bielefeld – versuchte beides zu trennen. Sein Schaustück war kein Chatbot,
> sondern eine Gruppe zusammenarbeitender Agenten, die Lehrmaterial für DERLA
> erzeugte, die Digitale Erinnerungslandschaft.
>
> Das Publikum war gemischt: Menschen, die Python schrieben, und Menschen, die
> es beauftragten. Der Workshop lehrte deshalb eine Sprache für beide – Python,
> einen kommerziellen Modellanbieter und ein objektorientiertes Modell der
> Arbeit.
>
> Das Ziel war bewusst bescheiden: ein Grundverständnis für Agenten-Engineering,
> genug, um ein teilautomatisiertes System zu bauen, und genug, um eines zu
> beurteilen.

**02 Das Argument**

lede: `Drei Wörter, drei Disziplinen: KI, Agent, Engineering.`

> Der KI-Teil ist der kleinste. Prompting, Kontext und Bewertung sind die
> Alltagskompetenzen; Training und Inferenz sind der Maschinenraum. Der Workshop
> verwendete seine Zeit auf den Unterschied, ob ein Modell als Wissensbasis
> dient oder als Schnittstelle zu einem System.
>
> Der Agententeil ist Softwaredesign. Die Definition des Workshops ist bewusst
> eng: Ein Agent ist eine Code-Abstraktion um ein LLM, gebaut um eine
> menschliche Rolle in einer Domäne – Data Stewardship, Katalogisierung,
> wissenschaftliche Assistenz – und er soll widerspiegeln, wie diese Domäne ihre
> Arbeit teilt. Ein Framework ist optional. Volle Autonomie ist optional. Eine
> Rolle nicht.
>
> Der Engineering-Teil ist Research Software Engineering: Versionierung, Tests,
> Kosten, Bewertung. Die Vorführung war eine kleine Crew – ein Planungsagent,
> ein Scanner, Preisanalysten, ein Ensemble, das sie vergleicht, und ein Agent
> für Benachrichtigungen. Jeder ist für sich lesbar.

`sm-split`:
- **Im Sinne des Workshops:** eine benannte Rolle; eine Arbeitsteilung der Domäne; ausdrückliche Werkzeuge; ein schriftlicher Auftrag; ein Bewertungsschritt.
- **Nicht erforderlich:** ein Agenten-Framework; volle Autonomie; ein Anbieter; ein Chatfenster.

> Das ist das ganze Argument. Das Modell ist eine Komponente. Die Rolle ist der
> Entwurf.

**03 Was 2026 trägt**

lede: `Die Werkzeuge bewegten sich schneller als die Definition.`

> Zwei Jahre später haben sich die Frameworks konsolidiert, und die Oberflächen
> sind vom Chat zum Änderungssatz gewandert. Was sich nicht bewegt hat, ist die
> nützliche Entwurfseinheit. Ein Agent, der die Rolle nicht benennen kann, für
> die er steht, ist eine Vorführung.
>
> Der GAMS-Beitrag von 2026 stellt dieselbe Frage eine Ebene höher: wo der
> Sweetspot zwischen der Wiederverwendung von Modellbausteinen und dem Eigenbau
> liegt und wie man beides ohne technische Schulden integriert. Die Antwort des
> Workshops war, die Grenze klein zu halten.
>
> Was ich ändern würde: Kosten und Bewertung zuerst vermitteln, nicht zuletzt.
> 2025 kam die Preisfolie nach der Architektur; 2026 ist die Rechnung Teil der
> Architektur.
>
> Und ich würde das Unbequeme lauter sagen: Eine Rolle ist auch eine
> Rechenschaft. Jemand unterschreibt die Ausgabe. Der Workshop sagte das im
> Engineering-Teil; es gehört nach vorn.

**04 Der Eintrag**

intro: `Der hinterlegte Eintrag ist eine Lektion, kein Aufsatz: Folien und vier Notebooks, offen zur Nachnutzung.`

record card:
- Titel: Einführung in das KI-Agenten-Engineering
- Typ: Lektion
- Hinterlegt: 10. März 2025
- DOI: 10.5281/zenodo.14999965
- Mitautor:innen: Martina Scholger, Christopher Pollin
- Lizenz: CC BY 4.0
- Abrufe: 3.154 Downloads, davon 2.760 eindeutig (Zenodo, 15. November 2026)
- Inhalt: Folien (PDF) und vier Jupyter-Notebooks

link: `Eintrag auf Zenodo öffnen`

**Kolophon**

- Methode: `Eine Lesart, 15. November 2026. Sie beschreibt, was der Workshop argumentierte und was ich heute anders vermitteln würde; sie ist kein Nachdruck.`
- Quellen: `Der Workshop-Eintrag von 2025, seine vier Notebooks sowie der GAMS-Beitrag und der Vortrag von 2026, die dieselbe Frage auf Systemebene weiterführen.`
- Urheberschaft: `Sebastian David Schiller-Stoff. Der Workshop entstand gemeinsam mit Scholger und Pollin. Die Lesart ist meine.`
- JavaScript: `Keines. Die Seite besteht aus Text, CSS und einem kleinen Inline-Sprite.`
- Lizenz: `Text und Gestaltung: CC BY-NC 4.0. Der zitierte Eintrag behält seine eigene Lizenz CC BY 4.0.`
- back: `Zurück zum Lebenslauf` / `Alle Texte`

---

### 5.2 `writing-copilot.html` — Autocomplete was never the point

**EN**

- kicker: `Selected writing · AI coding`
- h1: `Autocomplete was never the point.`
- standfirst: `The 2023 Copilot workshop began with completions and ended with domain modelling. That order still explains why the tools work — and what they cannot decide for you.`
- meta: `Source record · 7 December 2023 · CC BY 4.0`

**01 Why it exists**

lede: `In December 2023, Copilot had just become a product with a price.`

> The workshop at the Centre for Information Modelling in Graz was split in
> two: a theory part by Julia Martin on what Copilot is, what it costs and what
> is behind it; a hands-on part by me in Visual Studio Code. The room held
> people who had never installed an extension and people who wrote code daily.
>
> The question was not whether the tool was impressive. It was whether a
> research group could adopt it without losing the ability to explain its own
> software.
>
> The workshop's answer was structural: these tools do not remove design. They
> move it.

**02 The argument**

lede: `Four surfaces, one shift.`

> Copilot in 2023 was four things in an editor: autocomplete, a completions
> panel, slash commands that operate on the open file or the selection, and a
> chat. The workshop demonstrated all four, then spent the rest of its time on
> what they change.
>
> The first change is speed on introductory problems: boilerplate, a class, an
> explanation of unfamiliar code. The second is risk: the training material is
> opaque, and the tool is confident about code it has not verified.
>
> The third change is the interesting one. If the assistant writes the technical
> layer, the human work moves to the domain layer. The workshop called it a
> comeback of object-oriented modelling: name the real problem, not the
> technology. A class called Student is a claim about the domain; a class called
> ServiceLayer is a claim about the framework.
>
> Two theses followed. First, code that follows the domain produces better
> results with these tools. Second, assistants shift software design toward
> domain modelling and relieve repetitive work — provided the domain is modelled
> adequately. The proviso is the whole sentence.

`sm-steps` (4): `Autocomplete` — a suggestion at the cursor; `Completions` — a panel of alternatives to review; `Commands` — an action on the open file or selection; `Chat` — a conversation with the repository in scope.

**03 What holds in 2026**

lede: `The surfaces survived; the centre moved.`

> Autocomplete is still there, but the interesting unit is now the change set: a
> diff across files that a person reviews. The 2023 deck treated completion as
> the centre because that was the product. By 2026 the product is the edit.
>
> The pricing slide is obsolete — the numbers changed, the education licence
> stayed. The lineage held: search, then completion, then chat, then the command
> line.
>
> The domain-modelling thesis held better than the productivity claim. A tool
> that writes the technical layer makes a bad domain model more expensive, not
> less.
>
> What I would change: start with the diff, not the completion. And spend more
> time on the review gate, which in 2023 was a slide and in 2026 is the job.

**04 The record**

intro: `The deposit is the workshop deck: one PDF, with the tool comparison and the modelling argument.`

record card:
- Title: Copilot technologies in the digital humanities
- Type: Presentation
- Deposited: 7 December 2023
- DOI: 10.5281/zenodo.10288101
- Co-author: Julia Martin
- Licence: CC BY 4.0
- Reach: 862 downloads, 770 of them unique (Zenodo, 15 November 2026)
- Contents: workshop slides (PDF)

link: `Open the record on Zenodo`

**Colophon**

- Method: `A reading, 15 November 2026. It describes what the workshop demonstrated and what I would teach differently now; it is not a reprint.`
- Sources: `The 2023 workshop deposit and its slides, read against the 2025 FAIR-code paper and the 2025 AI-coding workshop.`
- Authorship: `Sebastian David Schiller-Stoff. The workshop was co-authored with Julia Martin. The reading is mine.`
- JavaScript / Licence: as 5.1.
- back: `Back to the CV` / `All writing`

**DE**

- kicker: `Ausgewählte Texte · KI-Coding`
- h1: `Es ging nie um Autovervollständigung.`
- standfirst: `Der Copilot-Workshop von 2023 begann mit Vervollständigungen und endete bei der Domänenmodellierung. Diese Reihenfolge erklärt bis heute, warum die Werkzeuge funktionieren – und was sie Ihnen nicht abnehmen.`
- meta: `Quelle · 7. Dezember 2023 · CC BY 4.0`

**01 Warum es den Text gibt**

lede: `Im Dezember 2023 war Copilot gerade ein Produkt mit Preis geworden.`

> Der Workshop am Zentrum für Informationsmodellierung in Graz war zweigeteilt:
> ein Theorieteil von Julia Martin dazu, was Copilot ist, was es kostet und was
> dahintersteckt; ein Praxisteil von mir in Visual Studio Code. Im Raum saßen
> Menschen, die noch nie eine Erweiterung installiert hatten, und Menschen, die
> täglich Code schrieben.
>
> Die Frage war nicht, ob das Werkzeug beeindruckt. Die Frage war, ob eine
> Forschungsgruppe es übernehmen kann, ohne die Fähigkeit zu verlieren, die
> eigene Software zu erklären.
>
> Die Antwort des Workshops war strukturell: Diese Werkzeuge nehmen das Design
> nicht weg. Sie verschieben es.

**02 Das Argument**

lede: `Vier Oberflächen, eine Verschiebung.`

> Copilot war 2023 vier Dinge in einem Editor: Autovervollständigung, ein
> Panel mit Vervollständigungen, Slash-Befehle auf die geöffnete Datei oder die
> Auswahl und ein Chat. Der Workshop zeigte alle vier und verwendete den Rest
> der Zeit darauf, was sie verändern.
>
> Die erste Veränderung ist Geschwindigkeit bei einführenden Problemen:
> Boilerplate, eine Klasse, die Erklärung von unbekanntem Code. Die zweite ist
> Risiko: Das Trainingsmaterial ist undurchsichtig, und das Werkzeug ist
> selbstsicher bei Code, den es nicht geprüft hat.
>
> Die dritte Veränderung ist die interessante. Wenn die Assistenz die technische
> Schicht schreibt, wandert die menschliche Arbeit in die Domänenschicht. Der
> Workshop nannte das ein Comeback der objektorientierten Modellierung: das
> reale Problem benennen, nicht die Technik. Eine Klasse namens Student ist eine
> Aussage über die Domäne; eine Klasse namens ServiceLayer ist eine Aussage über
> das Framework.
>
> Daraus folgten zwei Thesen. Erstens: Code, der der Domäne folgt, liefert mit
> diesen Werkzeugen bessere Ergebnisse. Zweitens: Assistenzsysteme verschieben
> das Softwaredesign zur Domänenmodellierung und entlasten von wiederholender
> Arbeit – vorausgesetzt, die Domäne ist angemessen modelliert. Der Vorbehalt
> ist der ganze Satz.

`sm-steps` (4): `Autovervollständigung` – ein Vorschlag am Cursor; `Vervollständigungen` – ein Panel mit Alternativen zur Prüfung; `Befehle` – eine Aktion auf der geöffneten Datei oder Auswahl; `Chat` – ein Gespräch mit dem Repository im Blick.

**03 Was 2026 trägt**

lede: `Die Oberflächen überlebten; das Zentrum wanderte.`

> Autovervollständigung gibt es noch, aber die interessante Einheit ist
> inzwischen der Änderungssatz: ein Diff über Dateien, den eine Person prüft.
> Die Folien von 2023 behandelten die Vervollständigung als Zentrum, weil das
> das Produkt war. 2026 ist das Produkt die Änderung.
>
> Die Preisfolie ist überholt – die Zahlen änderten sich, die Bildungslicenz
> blieb. Die Linie hielt: Suche, dann Vervollständigung, dann Chat, dann
> Kommandozeile.
>
> Die These zur Domänenmodellierung hielt besser als die zur Produktivität. Ein
> Werkzeug, das die technische Schicht schreibt, macht ein schlechtes
> Domänenmodell teurer, nicht billiger.
>
> Was ich ändern würde: mit dem Diff beginnen, nicht mit der Vervollständigung.
> Und mehr Zeit auf die Prüfung verwenden, die 2023 eine Folie war und 2026 die
> Arbeit ist.

**04 Der Eintrag**

intro: `Der hinterlegte Eintrag ist der Workshop-Foliensatz: ein PDF mit dem Werkzeugvergleich und dem Argument zur Modellierung.`

record card:
- Titel: Copilot-Technologien in den Digital Humanities
- Typ: Präsentation
- Hinterlegt: 7. Dezember 2023
- DOI: 10.5281/zenodo.10288101
- Mitautorin: Julia Martin
- Lizenz: CC BY 4.0
- Abrufe: 862 Downloads, davon 770 eindeutig (Zenodo, 15. November 2026)
- Inhalt: Workshop-Folien (PDF)

link: `Eintrag auf Zenodo öffnen`

**Kolophon**

- Methode: `Eine Lesart, 15. November 2026. Sie beschreibt, was der Workshop zeigte und was ich heute anders vermitteln würde; sie ist kein Nachdruck.`
- Quellen: `Der Workshop-Eintrag von 2023 mit seinen Folien, gelesen gegen den FAIR-Code-Beitrag von 2025 und den KI-Coding-Workshop von 2025.`
- Urheberschaft: `Sebastian David Schiller-Stoff. Der Workshop entstand gemeinsam mit Julia Martin. Die Lesart ist meine.`
- rest as 5.1 DE.

---

### 5.3 `writing-architecture.html` — A shared language for systems

**EN**

- kicker: `Selected writing · Software architecture`
- h1: `A shared language for systems.`
- standfirst: `Data librarians inherit systems they did not design. The 2025 deck gives them the vocabulary to ask structural questions — and deliberately stops before code.`
- meta: `Source record · 15 May 2025 · CC BY 4.0`

**01 Why it exists**

lede: `A repository is easier to operate than to explain.`

> The Data Librarian programme at Graz trains people to run collections, not to
> draw diagrams. But the questions they meet are architectural: why this import
> is slow, why one change breaks three services, why no one can say what depends
> on what.
>
> The deck starts from documentation rather than theory: Fedora's feature list
> and architecture page, Islandora's diagram, the OAIS reference model.
> Established systems explain themselves in a shared language; the workshop
> borrowed it.
>
> The aim is a model for analysis aside from requirements. Requirements tell you
> what a system should do. Architecture tells you what it will cost to keep
> doing it.

**02 The argument**

lede: `Four questions, one diagram language.`

> The vocabulary comes first: software, software system, information system. A
> program is not a system, and a system is not its hardware. Most confusion in a
> meeting is a category error.
>
> The C4 model supplies the zoom: context, container, component, class. One
> system, four levels, the same boxes at different distances. The workshop used
> draw.io and a generative model to draft a context diagram for DERLA — and
> treated the output as a draft, not an answer.
>
> Coupling and cohesion supply the diagnosis. Weak cohesion and strong coupling
> produce the systems nobody wants to change: high entropy, high technical debt.
> The rule is old and still under-applied: strong cohesion inside a building
> block, weak coupling between them.
>
> Monolith and distributed system are two extremes, never pure in practice. A
> monolith is one deployment unit: simple to test, to monitor, to troubleshoot;
> risky in coupling, hard to split across teams. A distributed system buys
> independent releases and error isolation and pays in complexity, which is
> routinely underestimated.
>
> Conway's Law closes the deck: a system takes the shape of the communication
> structure that builds it. Three teams produce three building blocks, sooner or
> later.

`sm-split`:
- **What the deck gives you:** a vocabulary; C4; coupling and cohesion; monolith versus distributed; Conway's Law.
- **What it leaves out:** programming; code design; vendor selection; a reference architecture for your institution.

**03 What holds in 2026**

lede: `The vocabulary aged; the tools did not.`

> C4 is still the cheapest way to make a system arguable, and coupling and
> cohesion still predict which system will hurt. The diagram tooling changed;
> generated diagrams are uneven, and a wrong diagram is worse than none.
>
> Conway is the load-bearing idea. It connects this deck to the 2023 FORGE
> paper: if organisation determines technology, then architecture is an
> organisational document.
>
> What I would change: less taxonomy, more one system end to end. A single
> repository traced from context to component would teach more than a catalogue
> of styles.
>
> And I would say plainly what the deck only implies: you do not need permission
> to ask an architectural question. You need a diagram and three sentences.

**04 The record**

intro: `The deposit is the course deck: five hours of vocabulary, C4, and the cost of distribution.`

record card:
- Title: Software Architecture for Data Librarians
- Type: Presentation
- Deposited: 15 May 2025
- DOI: 10.5281/zenodo.15421823
- Co-author: Fabio Tosques
- Licence: CC BY 4.0
- Reach: 227 downloads, 170 of them unique (Zenodo, 15 November 2026)
- Contents: course slides (PDF, 2.4 MB) · Data Librarian training programme, University of Graz

link: `Open the record on Zenodo`

**Colophon**

- Method: `A reading, 15 November 2026. It describes what the course argued and what I would teach differently now; it is not a reprint.`
- Sources: `The 2025 course deposit, the KONDE Weissbuch articles on software architecture and software engineering, and the 2023 FORGE paper on organisational influence.`
- Authorship: `Sebastian David Schiller-Stoff. The course was co-authored with Fabio Tosques. The reading is mine.`
- JavaScript / Licence: as 5.1.
- back.

**DE**

- kicker: `Ausgewählte Texte · Softwarearchitektur`
- h1: `Eine gemeinsame Sprache für Systeme.`
- standfirst: `Data Librarians übernehmen Systeme, die sie nicht entworfen haben. Der Foliensatz von 2025 gibt ihnen das Vokabular für strukturelle Fragen – und hält bewusst vor dem Code an.`
- meta: `Quelle · 15. Mai 2025 · CC BY 4.0`

**01 Warum es den Text gibt**

lede: `Ein Repository lässt sich leichter betreiben als erklären.`

> Das Data-Librarian-Programm in Graz bildet Menschen dafür aus, Bestände zu
> führen, nicht Diagramme zu zeichnen. Die Fragen, die ihnen begegnen, sind
> aber architektonisch: warum dieser Import langsam ist, warum eine Änderung
> drei Dienste bricht, warum niemand sagen kann, was von was abhängt.
>
> Der Foliensatz beginnt bei der Dokumentation, nicht bei der Theorie: die
> Funktionsliste und Architekturseite von Fedora, das Diagramm von Islandora,
> das OAIS-Referenzmodell. Etablierte Systeme erklären sich in einer gemeinsamen
> Sprache; der Workshop hat sie übernommen.
>
> Das Ziel ist ein Modell für die Analyse abseits der Anforderungen.
> Anforderungen sagen, was ein System tun soll. Architektur sagt, was es kostet,
> es weiter zu tun.

**02 Das Argument**

lede: `Vier Fragen, eine Diagrammsprache.`

> Zuerst das Vokabular: Software, Softwaresystem, Informationssystem. Ein
> Programm ist kein System, und ein System ist nicht seine Hardware. Die meiste
> Verwirrung in einer Besprechung ist ein Kategorienfehler.
>
> Das C4-Modell liefert den Zoom: Kontext, Container, Komponente, Klasse. Ein
> System, vier Ebenen, dieselben Kästen in unterschiedlicher Entfernung. Der
> Workshop nutzte draw.io und ein generatives Modell für einen Entwurf des
> Kontextdiagramms von DERLA – und behandelte die Ausgabe als Entwurf, nicht als
> Antwort.
>
> Kopplung und Kohäsion liefern die Diagnose. Schwache Kohäsion und starke
> Kopplung erzeugen die Systeme, die niemand ändern will: hohe Entropie, hohe
> technische Schulden. Die Regel ist alt und wird immer noch zu wenig befolgt:
> starke Kohäsion innerhalb eines Bausteins, schwache Kopplung zwischen ihnen.
>
> Monolith und verteiltes System sind zwei Extreme, in der Praxis nie rein. Ein
> Monolith ist eine Deployment-Einheit: einfach zu testen, zu überwachen, zu
> entstören; riskant in der Kopplung, schwer über Teams zu teilen. Ein verteiltes
> System kauft unabhängige Releases und Fehlerisolierung und zahlt mit
> Komplexität, die regelmäßig unterschätzt wird.
>
> Das Gesetz von Conway schließt den Foliensatz: Ein System nimmt die Form der
> Kommunikationsstruktur an, die es baut. Drei Teams ergeben früher oder später
> drei Bausteine.

`sm-split`:
- **Was der Foliensatz gibt:** ein Vokabular; C4; Kopplung und Kohäsion; Monolith und verteiltes System; das Gesetz von Conway.
- **Was er auslässt:** Programmierung; Code-Design; Anbieterauswahl; eine Referenzarchitektur für Ihre Institution.

**03 Was 2026 trägt**

lede: `Das Vokabular alterte; die Werkzeuge nicht.`

> C4 ist noch immer der billigste Weg, ein System verhandelbar zu machen, und
> Kopplung und Kohäsion sagen weiterhin voraus, welches System weh tut. Die
> Diagrammwerkzeuge änderten sich; generierte Diagramme sind ungleichmäßig, und
> ein falsches Diagramm ist schlechter als keines.
>
> Conway ist die tragende Idee. Sie verbindet diesen Foliensatz mit dem
> FORGE-Beitrag von 2023: Wenn Organisation Technik bestimmt, dann ist
> Architektur ein organisatorisches Dokument.
>
> Was ich ändern würde: weniger Taxonomie, mehr ein System von Anfang bis Ende.
> Ein einziges Repository, vom Kontext bis zur Komponente verfolgt, würde mehr
> lehren als ein Katalog von Stilen.
>
> Und ich würde deutlich sagen, was der Foliensatz nur andeutet: Man braucht
> keine Erlaubnis, um eine architektonische Frage zu stellen. Man braucht ein
> Diagramm und drei Sätze.

**04 Der Eintrag**

intro: `Der hinterlegte Eintrag ist der Kurs-Foliensatz: fünf Stunden Vokabular, C4 und die Kosten der Verteilung.`

record card:
- Titel: Softwarearchitektur für Data Librarians
- Typ: Präsentation
- Hinterlegt: 15. Mai 2025
- DOI: 10.5281/zenodo.15421823
- Mitautor: Fabio Tosques
- Lizenz: CC BY 4.0
- Abrufe: 227 Downloads, davon 170 eindeutig (Zenodo, 15. November 2026)
- Inhalt: Kursfolien (PDF, 2,4 MB) · Data-Librarian-Programm, Universität Graz

link: `Eintrag auf Zenodo öffnen`

**Kolophon**

- Methode: `Eine Lesart, 15. November 2026. Sie beschreibt, was der Kurs argumentierte und was ich heute anders vermitteln würde; sie ist kein Nachdruck.`
- Quellen: `Der Kurs-Eintrag von 2025, die KONDE-Weißbuch-Artikel zu Softwarearchitektur und Softwareentwicklung sowie der FORGE-Beitrag von 2023 zum organisatorischen Einfluss.`
- Urheberschaft: `Sebastian David Schiller-Stoff. Der Kurs entstand gemeinsam mit Fabio Tosques. Die Lesart ist meine.`
- rest as 5.1 DE.

---

### 5.4 `writing-fair-code.html` — FAIR is a gate, not a badge

**EN**

- kicker: `Selected writing · Research data management`
- h1: `FAIR is a gate, not a badge.`
- standfirst: `Generated code is research data. The 2025 FORGE paper reads it against all four FAIR principles and finds the same answer at each: the tool does not decide, the review does.`
- meta: `Source record · 22 September 2025 · CC BY 4.0`

**01 Why it exists**

lede: `Vibe coding lowered the barrier and raised the volume.`

> When a model writes the technical layer, people who do not program can produce
> working software. That is a real gain. It also means more code enters research
> projects without a history, a licence or a test.
>
> The paper, written with Leona Elisabeth Münzer for FORGE 2025, asks a narrow
> question: can that code be FAIR. Not whether it is useful, not whether it is
> original — whether it can be found, accessed, reused and interoperated with as
> research data.
>
> The frame matters. Code in a repository is not a by-product of research. It is
> the evidence for a claim.

**02 The argument**

lede: `Four letters, four failure modes.`

`sm-steps` (4):
- `Findable` — more code means more metadata and more persistent identifiers, not fewer.
- `Accessible` — licensing is unresolved; training data is opaque, and generated code can duplicate protected work.
- `Reusable` — quality declines without review: code smells, duplicated blocks, conventions ignored.
- `Interoperable` — hallucinated packages, poisoned dependencies, prompt injection, private API keys.

> Findable is a volume problem. A productivity gain of the kind GitHub reported
> in 2023 produces more source than a team can describe. Undescribed code is not
> findable code.
>
> Accessible is a legal problem. It is unsettled how far generated content falls
> under copyright, the training data of many models is unknown, and generated
> code often contains fragments of third-party work. A licence cannot be granted
> confidently over material whose provenance is unclear.
>
> Reusable is a trust problem. Assistants are poor at removing redundant code
> and inconsistent with conventions. A codebase that grows faster than it is
> cleaned loses the quality that makes reuse rational.
>
> Interoperable is a supply-chain problem. A model can name a package that does
> not exist, or one that does and should not be installed. Private keys and
> local paths make code neither reusable nor interoperable.
>
> The conclusion is not that generated code is bad. It is that FAIR is a
> property of a curated object. The gate is human review, with binding rules for
> quality and licensing.

**03 What holds in 2026**

lede: `The tools improved; the gate did not move.`

> Assistants now refactor and document better than they did in 2025. Benchmarks
> improved. Attribution did not: a diff still arrives without a reliable account
> of where its parts came from.
>
> The supply-chain risk grew, not shrank, as agents began installing their own
> dependencies.
>
> What I would add: provenance as a fifth requirement. Which model, which
> prompt, which date, which sources. Without it, the other four are assertions.
>
> What I would keep: the sentence that a person signs the commit. It is the only
> part of the argument that cannot be automated.

**04 The record**

intro: `The deposit is the conference paper: four principles, one gate. The German title is the deposited one.`

record card:
- Title: Kann LLM generierter Code FAIR sein? Herausforderungen für das Forschungsdatenmanagement. *(lang="de")*
- Type: Conference paper
- Deposited: 22 September 2025
- DOI: 10.5281/zenodo.17178206
- Co-author: Leona Elisabeth Münzer
- Licence: CC BY 4.0
- Reach: 103 downloads, 95 of them unique (Zenodo, 15 November 2026)
- Contents: paper (PDF) · FORGE 2025 proceedings

link: `Open the record on Zenodo`

**Colophon**

- Method: `A reading, 15 November 2026. It describes what the paper argued and what I would add now; it is not a reprint.`
- Sources: `The 2025 FORGE paper, the 2025 AI-coding workshop and the 2026 GAMS paper, which apply the same gate to tools and to systems.`
- Authorship: `Sebastian David Schiller-Stoff. The paper was co-authored with Leona Elisabeth Münzer. The reading is mine.`
- JavaScript / Licence: as 5.1.
- back.

**DE**

- kicker: `Ausgewählte Texte · Forschungsdatenmanagement`
- h1: `FAIR ist eine Prüfung, kein Abzeichen.`
- standfirst: `Generierter Code ist Forschungsdaten. Der FORGE-Beitrag von 2025 liest ihn gegen alle vier FAIR-Prinzipien und findet bei jedem dieselbe Antwort: Das Werkzeug entscheidet nicht, die Prüfung entscheidet.`
- meta: `Quelle · 22. September 2025 · CC BY 4.0`

**01 Warum es den Text gibt**

lede: `Vibe-Coding senkte die Schwelle und erhöhte die Menge.`

> Wenn ein Modell die technische Schicht schreibt, können Menschen ohne
> Programmierpraxis funktionierende Software erzeugen. Das ist ein echter
> Gewinn. Es bedeutet aber auch, dass mehr Code ohne Vorgeschichte, Lizenz oder
> Test in Forschungsprojekte gelangt.
>
> Der Beitrag, gemeinsam mit Leona Elisabeth Münzer für FORGE 2025 verfasst,
> stellt eine enge Frage: Kann dieser Code FAIR sein. Nicht, ob er nützlich ist,
> nicht, ob er originell ist – sondern ob er als Forschungsdaten auffindbar,
> zugänglich, wiederverwendbar und interoperabel sein kann.
>
> Der Rahmen ist wichtig. Code in einem Repository ist kein Nebenprodukt der
> Forschung. Er ist der Beleg für eine Aussage.

**02 Das Argument**

lede: `Vier Buchstaben, vier Fehlerarten.`

`sm-steps` (4):
- `Findable` – mehr Code bedeutet mehr Metadaten und mehr persistente Identifikatoren, nicht weniger.
- `Accessible` – die Lizenzierung ist ungeklärt; Trainingsdaten sind undurchsichtig, und generierter Code kann geschützte Arbeit duplizieren.
- `Reusable` – die Qualität sinkt ohne Prüfung: Code-Smells, doppelte Blöcke, ignorierte Konventionen.
- `Interoperable` – halluzinierte Pakete, vergiftete Abhängigkeiten, Prompt Injection, private API-Schlüssel.

> Findable ist ein Mengenproblem. Ein Produktivitätsgewinn, wie GitHub ihn 2023
> berichtete, erzeugt mehr Quellcode, als ein Team beschreiben kann.
> Unbeschriebener Code ist kein auffindbarer Code.
>
> Accessible ist ein Rechtsproblem. Es ist ungeklärt, wie weit generierte Inhalte
> unter das Urheberrecht fallen, die Trainingsdaten vieler Modelle sind
> unbekannt, und generierter Code enthält oft Fragmente fremder Arbeit. Über
> Material mit unklarer Herkunft lässt sich keine Lizenz mit gutem Gewissen
> erteilen.
>
> Reusable ist ein Vertrauensproblem. Assistenzsysteme sind schlecht darin,
> redundanten Code zu entfernen, und uneinheitlich bei Konventionen. Eine
> Codebasis, die schneller wächst als sie aufgeräumt wird, verliert die Qualität,
> die Wiederverwendung vernünftig macht.
>
> Interoperable ist ein Lieferkettenproblem. Ein Modell kann ein Paket nennen,
> das nicht existiert, oder eines, das existiert und nicht installiert werden
> sollte. Private Schlüssel und lokale Pfade machen Code weder wiederverwendbar
> noch interoperabel.
>
> Die Schlussfolgerung lautet nicht, dass generierter Code schlecht ist. Sie
> lautet, dass FAIR eine Eigenschaft eines kuratierten Objekts ist. Die Prüfung
> ist die menschliche Nacharbeit, mit verbindlichen Regeln für Qualität und
> Lizenzierung.

**03 Was 2026 trägt**

lede: `Die Werkzeuge verbesserten sich; die Prüfung bewegte sich nicht.`

> Assistenzsysteme refaktorieren und dokumentieren heute besser als 2025. Die
> Benchmarks verbesserten sich. Die Zuordnung nicht: Ein Diff kommt weiterhin
> ohne verlässliche Auskunft darüber an, woher seine Teile stammen.
>
> Das Lieferkettenrisiko wuchs, nicht schwand, als Agenten begannen, ihre
> Abhängigkeiten selbst zu installieren.
>
> Was ich ergänzen würde: Provenienz als fünfte Anforderung. Welches Modell,
> welcher Prompt, welches Datum, welche Quellen. Ohne sie sind die anderen vier
> Behauptungen.
>
> Was ich behalten würde: den Satz, dass eine Person den Commit unterschreibt.
> Er ist der einzige Teil des Arguments, der sich nicht automatisieren lässt.

**04 Der Eintrag**

intro: `Der hinterlegte Eintrag ist der Konferenzbeitrag: vier Prinzipien, eine Prüfung. Der deutsche Titel ist der hinterlegte.`

record card:
- Titel: Kann LLM generierter Code FAIR sein? Herausforderungen für das Forschungsdatenmanagement.
- Typ: Konferenzbeitrag
- Hinterlegt: 22. September 2025
- DOI: 10.5281/zenodo.17178206
- Mitautorin: Leona Elisabeth Münzer
- Lizenz: CC BY 4.0
- Abrufe: 103 Downloads, davon 95 eindeutig (Zenodo, 15. November 2026)
- Inhalt: Beitrag (PDF) · FORGE-2025-Proceedings

link: `Eintrag auf Zenodo öffnen`

**Kolophon**

- Methode: `Eine Lesart, 15. November 2026. Sie beschreibt, was der Beitrag argumentierte und was ich heute ergänzen würde; sie ist kein Nachdruck.`
- Quellen: `Der FORGE-Beitrag von 2025, der KI-Coding-Workshop von 2025 und der GAMS-Beitrag von 2026, die dieselbe Prüfung auf Werkzeuge und auf Systeme anwenden.`
- Urheberschaft: `Sebastian David Schiller-Stoff. Der Beitrag entstand gemeinsam mit Leona Elisabeth Münzer. Die Lesart ist meine.`
- rest as 5.1 DE.

---

### 5.5 `writing-organisation.html` — Organisation determines technology

**EN**

- kicker: `Selected writing · Digital preservation`
- h1: `Organisation determines technology.`
- standfirst: `The 2023 FORGE paper makes one claim and repeats it three ways: technical persistence is what you get when personnel and funding persist inside a workable organisation.`
- meta: `Source record · 29 September 2023 · CC BY 4.0`

**01 Why it exists**

lede: `Preservation is usually described as a technical problem.`

> Repositories are judged by their formats, migrations and certifications. All
> of that matters. But the paper, written with Gunter Vasold and Elisabeth
> Steiner, starts from a different observation: the systems that survive are the
> ones whose organisation survives.
>
> The argument is not that technology is unimportant. It is that technical debt
> is often organisational debt wearing a technical costume.

**02 The argument**

lede: `Three theses, one direction.`

`sm-steps` (3):
- `Change` — every used system must change, because assumptions change, not only technology.
- `Degrade` — every used system degrades; uncontrolled change destroys the ability to change.
- `Conway` — every used system takes the shape of the organisation that builds it.

> The first thesis makes software a social construct. A system is not a product
> delivered once; it is a set of decisions that are renegotiated. If
> changeability is not in the architecture from the start, long-term operation
> fails. Preservation infrastructure is the hardest case, because its promise is
> duration.
>
> The second thesis is about entropy. Technical debt cannot be avoided, only
> minimised. A team that does not systematise change loses the ability to make
> it. The end state is not a crash; it is a system nobody dares touch.
>
> The third thesis is Conway's Law applied to infrastructure. Organisational
> change creates technical change pressure, sometimes abrupt, more often
> creeping. Ignored pressure produces workarounds, and workarounds are how an
> infrastructure stops matching its requirements.
>
> The paper's practical section is about people. Technical teams are small, so
> the bus factor is low. Decisions should be made in the group; younger members
> prevent blindness, older colleagues act as a corrective. Flat hierarchies and
> an open argument about architecture work. Improvised fixes produce
> dissatisfaction and conflict. Stakeholders outside the team set the resources,
> so the exchange with them is part of the engineering.
>
> The conclusion is an aphorism worth keeping: personnel and financial
> persistence in an adequate organisational structure produce technical
> persistence.

**03 What holds in 2026**

lede: `More true now, not less.`

> Project funding is shorter, staff turnover is normal, and AI has added a new
> source of change pressure. Every one of those is an organisational variable.
>
> The paper's weakest point is its evidence: it argues from experience, not from
> a sample. That is honest, and it is also why the claim needs to be tested in
> more institutions.
>
> What I would add: handover as a first-class artefact. A repository that cannot
> be handed over has not been preserved, whatever its certification says.
>
> And a fourth thesis, carefully: documentation is an organisational artefact.
> It ages when the organisation changes, not when the software does.

**04 The record**

intro: `The deposit is the conference paper: three theses, one aphorism. The German title is the deposited one.`

record card:
- Title: Organisation bestimmt Technik: Persistenz und Veränderung in Infrastrukturen zur langfristigen Sicherung von Forschungsdaten *(lang="de")*
- Type: Conference paper
- Deposited: 29 September 2023
- DOI: 10.5281/zenodo.8386446
- Co-authors: Gunter Vasold, Elisabeth Steiner
- Licence: CC BY 4.0
- Reach: 140 downloads, 131 of them unique (Zenodo, 15 November 2026)
- Contents: paper (PDF) · FORGE 2023 proceedings

link: `Open the record on Zenodo`

**Colophon**

- Method: `A reading, 15 November 2026. It describes what the paper argued and what I would add now; it is not a reprint.`
- Sources: `The 2023 FORGE paper, the 2025 architecture course, and the 2025 FAIR-code paper, which apply the same organisational reading to systems and to code.`
- Authorship: `Sebastian David Schiller-Stoff. The paper was co-authored with Gunter Vasold and Elisabeth Steiner. The reading is mine.`
- JavaScript / Licence: as 5.1.
- back.

**DE**

- kicker: `Ausgewählte Texte · Digitale Langzeitarchivierung`
- h1: `Organisation bestimmt Technik.`
- standfirst: `Der FORGE-Beitrag von 2023 stellt eine Behauptung auf und wiederholt sie auf drei Wegen: Technische Persistenz entsteht, wenn personelle und finanzielle Persistenz in einer tragfähigen Organisation zusammenkommen.`
- meta: `Quelle · 29. September 2023 · CC BY 4.0`

**01 Warum es den Text gibt**

lede: `Langzeitarchivierung wird meist als technisches Problem beschrieben.`

> Repositorien werden nach ihren Formaten, Migrationen und Zertifizierungen
> beurteilt. All das zählt. Der Beitrag, gemeinsam mit Gunter Vasold und
> Elisabeth Steiner verfasst, beginnt aber bei einer anderen Beobachtung: Die
> Systeme, die überleben, sind die, deren Organisation überlebt.
>
> Das Argument lautet nicht, Technik sei unwichtig. Es lautet, dass technische
> Schulden oft organisatorische Schulden in technischem Gewand sind.

**02 Das Argument**

lede: `Drei Thesen, eine Richtung.`

`sm-steps` (3):
- `Veränderung` – Jedes genutzte System muss sich ändern, weil sich Annahmen ändern, nicht nur die Technik.
- `Verfall` – Jedes genutzte System verfällt; unkontrollierte Änderung zerstört die Fähigkeit zur Änderung.
- `Conway` – Jedes genutzte System nimmt die Form der Organisation an, die es baut.

> Die erste These macht Software zu einem sozialen Konstrukt. Ein System ist
> kein einmal geliefertes Produkt; es ist eine Menge von Entscheidungen, die neu
> verhandelt werden. Wenn die Änderungsfähigkeit nicht von Anfang an in der
> Architektur steckt, scheitert der Dauerbetrieb. Die
> Langzeitarchivierungsinfrastruktur ist der härteste Fall, weil ihr Versprechen
> Dauer ist.
>
> Die zweite These handelt von Entropie. Technische Schulden lassen sich nicht
> vermeiden, nur verringern. Ein Team, das Änderungen nicht systematisiert,
> verliert die Fähigkeit, sie zu machen. Der Endzustand ist kein Absturz; es ist
> ein System, das niemand mehr anzufassen wagt.
>
> Die dritte These ist das Gesetz von Conway, angewendet auf Infrastruktur.
> Organisatorische Veränderung erzeugt technischen Änderungsdruck, manchmal
> abrupt, häufiger schleichend. Ignorierter Druck erzeugt Workarounds, und
> Workarounds sind der Weg, auf dem eine Infrastruktur ihre Anforderungen
> verliert.
>
> Der praktische Teil des Beitrags handelt von Menschen. Technische Teams sind
> klein, der Bus-Faktor ist niedrig. Entscheidungen sollten in der Gruppe
> fallen; jüngere Mitglieder verhindern Betriebsblindheit, ältere Kolleg:innen
> wirken als Korrektiv. Flache Hierarchien und eine offene Debatte über
> Architektur funktionieren. Improvisierte Lösungen erzeugen Unzufriedenheit und
> Konflikt. Stakeholder außerhalb des Teams setzen die Ressourcen; der Austausch
> mit ihnen gehört deshalb zum Engineering.
>
> Die Schlussfolgerung ist ein Aphorismus, der sich lohnt: Personelle und
> finanzielle Persistenz in einer angemessenen Organisationsstruktur führen zu
> technischer Persistenz.

**03 Was 2026 trägt**

lede: `Heute wahrer, nicht weniger.`

> Projektförderung ist kürzer, Personalwechsel ist normal, und KI hat eine neue
> Quelle für Änderungsdruck hinzugefügt. Jede davon ist eine organisatorische
> Variable.
>
> Die schwächste Stelle des Beitrags ist seine Evidenz: Er argumentiert aus
> Erfahrung, nicht aus einer Stichprobe. Das ist ehrlich, und deshalb muss die
> Behauptung in mehr Institutionen geprüft werden.
>
> Was ich ergänzen würde: Übergabe als eigenes Artefakt. Ein Repository, das
> sich nicht übergeben lässt, ist nicht archiviert, was auch immer seine
> Zertifizierung sagt.
>
> Und eine vierte These, vorsichtig formuliert: Dokumentation ist ein
> organisatorisches Artefakt. Sie altert, wenn sich die Organisation ändert,
> nicht wenn die Software sich ändert.

**04 Der Eintrag**

intro: `Der hinterlegte Eintrag ist der Konferenzbeitrag: drei Thesen, ein Aphorismus. Der deutsche Titel ist der hinterlegte.`

record card:
- Titel: Organisation bestimmt Technik: Persistenz und Veränderung in Infrastrukturen zur langfristigen Sicherung von Forschungsdaten
- Typ: Konferenzbeitrag
- Hinterlegt: 29. September 2023
- DOI: 10.5281/zenodo.8386446
- Mitautoren: Gunter Vasold, Elisabeth Steiner
- Lizenz: CC BY 4.0
- Abrufe: 140 Downloads, davon 131 eindeutig (Zenodo, 15. November 2026)
- Inhalt: Beitrag (PDF) · FORGE-2023-Proceedings

link: `Eintrag auf Zenodo öffnen`

**Kolophon**

- Methode: `Eine Lesart, 15. November 2026. Sie beschreibt, was der Beitrag argumentierte und was ich heute ergänzen würde; sie ist kein Nachdruck.`
- Quellen: `Der FORGE-Beitrag von 2023, der Architekturkurs von 2025 und der FAIR-Code-Beitrag von 2025, die dieselbe organisatorische Lesart auf Systeme und auf Code anwenden.`
- Urheberschaft: `Sebastian David Schiller-Stoff. Der Beitrag entstand gemeinsam mit Gunter Vasold und Elisabeth Steiner. Die Lesart ist meine.`
- rest as 5.1 DE.

---

## 6. Content — the series index

### `writing.html` (EN)

- masthead note: `Selected writing` · page name `Writing`
- title: `Selected writing — five records, read again`
- description: `Five Zenodo records read again: AI agents, AI coding, software architecture, FAIR code and digital preservation. One post per line of work, in English and German.`
- h1: `Five records, read again.`
- standfirst: `Each of these began as a workshop or a conference paper. Each is here because the argument outlived the slides — and because the download numbers say other people found it useful too.`
- meta: `2023–2026 · five posts · EN / DE`

`01 The five`

Five rows, in this order (reach within each line, strongest first):

1. `Agents are roles, not robots.` — `AI agent engineering · 2025 · 3,154 downloads` — `writing-agents.html`
   standfirst: `Three words, three disciplines: AI, agent, engineering. The model is a component; the role is the design.`
2. `Autocomplete was never the point.` — `AI coding · 2023 · 862 downloads` — `writing-copilot.html`
   standfirst: `The tools do not remove design. They move it up a level.`
3. `A shared language for systems.` — `Software architecture · 2025 · 227 downloads` — `writing-architecture.html`
   standfirst: `Data librarians inherit systems they did not design. C4, coupling and Conway give them the words.`
4. `FAIR is a gate, not a badge.` — `Research data management · 2025 · 103 downloads` — `writing-fair-code.html`
   standfirst: `Generated code is research data. Findable, accessible, reusable, interoperable — or none of it, without a review.`
5. `Organisation determines technology.` — `Digital preservation · 2023 · 140 downloads` — `writing-organisation.html`
   standfirst: `Technical persistence is what you get when personnel and funding persist inside a workable organisation.`

`02 How I chose`

lede: `Reach, then one argument each.`

> The ranking starts with the record: 3,154 downloads for the agent workshop,
> 862 for the Copilot workshop, then a long tail at 227, 140 and 103. These five
> were chosen from the Zenodo records cited across this site.
>
> Downloads are not a measure of quality. They are a measure of use. A workshop
> that 2,760 people downloaded has been read in rooms I will never enter.
>
> The second rule was distinctness. Three further AI-coding workshops — 264, 260
> and 251 unique downloads — repeat the first two arguments. They remain in the
> record, and this series does not reprint them.
>
> The rule is in public because a selection without a rule is a preference.

Colophon:
- Method: `A series of five readings, 15 November 2026. Each post describes one deposit and says what I would change now; none is a reprint.`
- Selection: `Reach and distinctness, from the Zenodo records cited on this site. Download figures are Zenodo's, read on 15 November 2026.`
- Authorship: `Sebastian David Schiller-Stoff. The deposits were co-authored; the readings are mine.`
- JavaScript: `None. Every page is text, CSS and a small inline sprite.`
- Licence: `Text and layout: CC BY-NC 4.0. The cited records keep their own CC BY 4.0.`
- back: `Back to the CV`

### `de/writing.html` (DE)

- masthead note: `Ausgewählte Texte` · page name `Texte`
- title: `Ausgewählte Texte — fünf Einträge, neu gelesen`
- description: `Fünf Zenodo-Einträge, neu gelesen: KI-Agenten, KI-Coding, Softwarearchitektur, FAIRer Code und digitale Langzeitarchivierung. Ein Text pro Arbeitslinie, auf Englisch und Deutsch.`
- h1: `Fünf Einträge, neu gelesen.`
- standfirst: `Jeder begann als Workshop oder als Konferenzbeitrag. Jeder steht hier, weil das Argument die Folien überdauert hat – und weil die Abrufzahlen zeigen, dass andere ihn ebenfalls nützlich fanden.`
- meta: `2023–2026 · fünf Texte · EN / DE`

`01 Die fünf`

1. `Agenten sind Rollen, keine Roboter.` – `KI-Agenten-Engineering · 2025 · 3.154 Downloads` – standfirst: `Drei Wörter, drei Disziplinen: KI, Agent, Engineering. Das Modell ist eine Komponente; die Rolle ist der Entwurf.`
2. `Es ging nie um Autovervollständigung.` – `KI-Coding · 2023 · 862 Downloads` – standfirst: `Die Werkzeuge nehmen das Design nicht weg. Sie verschieben es eine Ebene höher.`
3. `Eine gemeinsame Sprache für Systeme.` – `Softwarearchitektur · 2025 · 227 Downloads` – standfirst: `Data Librarians übernehmen Systeme, die sie nicht entworfen haben. C4, Kopplung und Conway geben ihnen die Worte.`
4. `FAIR ist eine Prüfung, kein Abzeichen.` – `Forschungsdatenmanagement · 2025 · 103 Downloads` – standfirst: `Generierter Code ist Forschungsdaten. Auffindbar, zugänglich, wiederverwendbar, interoperabel – oder nichts davon, ohne Prüfung.`
5. `Organisation bestimmt Technik.` – `Digitale Langzeitarchivierung · 2023 · 140 Downloads` – standfirst: `Technische Persistenz entsteht, wenn personelle und finanzielle Persistenz in einer tragfähigen Organisation zusammenkommen.`

`02 Wie ich ausgewählt habe`

lede: `Reichweite, dann je ein Argument.`

> Die Rangfolge beginnt beim Eintrag: 3.154 Downloads für den Agenten-Workshop,
> 862 für den Copilot-Workshop, dann ein langer Schwanz bei 227, 140 und 103.
> Diese fünf stammen aus den Zenodo-Einträgen, die auf dieser Website zitiert
> werden.
>
> Downloads messen keine Qualität. Sie messen Nutzung. Ein Workshop, den 2.760
> Menschen heruntergeladen haben, wurde in Räumen gelesen, die ich nie betreten
> werde.
>
> Die zweite Regel war Unterscheidbarkeit. Drei weitere KI-Coding-Workshops –
> 264, 260 und 251 eindeutige Downloads – wiederholen die ersten beiden
> Argumente. Sie bleiben im Verzeichnis; diese Reihe druckt sie nicht nach.
>
> Die Regel steht öffentlich, weil eine Auswahl ohne Regel eine Vorliebe ist.

Kolophon:
- Methode: `Eine Reihe aus fünf Lesarten, 15. November 2026. Jeder Text beschreibt einen Eintrag und sagt, was ich heute ändern würde; keiner ist ein Nachdruck.`
- Auswahl: `Reichweite und Unterscheidbarkeit, aus den auf dieser Website zitierten Zenodo-Einträgen. Die Abrufzahlen stammen von Zenodo, gelesen am 15. November 2026.`
- Urheberschaft: `Sebastian David Schiller-Stoff. Die Einträge entstanden in Co-Autorschaft; die Lesarten sind meine.`
- JavaScript: `Keines. Jede Seite besteht aus Text, CSS und einem kleinen Inline-Sprite.`
- Lizenz: `Text und Gestaltung: CC BY-NC 4.0. Die zitierten Einträge behalten ihre eigene Lizenz CC BY 4.0.`
- back: `Zurück zum Lebenslauf`

---

## 7. New component (the only one)

The index list. Requirements:

- five rows, each: ordinal, title (serif, link), standfirst, meta line;
- no cards, no shadows, no images;
- one hairline between rows, no outer border;
- hover/focus: title underline + arrow shift, as `.project-card__link`;
- stacks to one column at ≤640; the meta line wraps, never truncates;
- prints as a plain list of five with title and standfirst (the series index is
  a screen artefact; `OWNER:` may prefer it print-hidden like the register);
- forced colours: border and underline carry the state.

Suggested class: `.sm-posts`, `.sm-post`, `.sm-post__num`, `.sm-post__title`,
`.sm-post__standfirst`, `.sm-post__meta`. Tokens only.

---

## 8. Translation decisions

| English | German | why |
|---|---|---|
| Selected writing | Ausgewählte Texte | parallels `Ausgewählte Ergebnisse` |
| All writing | Alle Texte | short nav slot |
| reading (noun) | Lesart | a reading, not a reprint |
| record / deposit | Eintrag | matches `Titel der Einträge` |
| reach (downloads) | Abrufe | evidence line, not marketing |
| unique downloads | davon … eindeutig | Zenodo's `unique_downloads` |
| change set | Änderungssatz | |
| domain modelling | Domänenmodellierung | |
| coupling / cohesion | Kopplung / Kohäsion | |
| monolith / distributed system | Monolith / verteiltes System | |
| provenance | Provenienz | |
| human in the loop | menschliche Nacharbeit | the glossary avoids jargon; the paper says `Human-in-the-loop` — `OWNER:` may prefer the English term |
| bus factor | Bus-Faktor | kept, it is the established German term |

Rules applied: `ich`, `Sie`; `.` thousands; `D. Month YYYY`; `„…“`; ` – ` for
asides; `–` for ranges; no space before punctuation; `lang="de"` on the two
German deposit titles in the English pages; no `lang` attribute in the German
pages (the whole page is German).

### 8.1 Chrome, masthead and integration strings (EN → DE)

Masthead theme (the short word after the label; the hero kicker carries the
full discipline):

| EN | DE |
|---|---|
| Writing | Texte |
| AI agents | KI-Agenten |
| AI coding | KI-Coding |
| Architecture | Architektur |
| FAIR code | FAIR-Code |
| Preservation | Archivierung |

`Archivierung`, not `Langzeitarchivierung`, because the German masthead would
otherwise take a second line at 1120px; the hero kicker still says
`Digitale Langzeitarchivierung`. Same rule as the glossary: shorten the slot,
never the claim.

Index masthead note: `<span class="label">Selected writing</span> 2023–2026` /
`<span class="label">Ausgewählte Texte</span> 2023–2026` — not the designer's
`Selected writing Writing`, which reads twice.

CV training-section block (`index.html`):

| EN | DE |
|---|---|
| label: Selected writing · 2026 | Ausgewählte Texte · 2026 |
| h3: Five records, read again | Fünf Einträge, neu gelesen |
| p: Five Zenodo records — a workshop, a course, two conference papers and an agent lesson — read again with what still holds and what I would change. | Fünf Zenodo-Einträge – ein Workshop, ein Kurs, zwei Konferenzbeiträge und eine Lektion zu Agenten – neu gelesen mit dem, was trägt, und dem, was ich ändern würde. |
| link: Read the five readings | Die fünf Lesarten lesen |

Practice-note cross-links:

| file | EN | DE |
|---|---|---|
| `ai-agents.html` | Its longer reading is <a>Agents are roles, not robots</a>. | Die ausführliche Lesart ist <a>Agenten sind Rollen, keine Roboter</a>. |
| `ai-coding.html` | The longer readings are <a>Autocomplete was never the point</a> and <a>FAIR is a gate, not a badge</a>. | Die ausführlichen Lesarten sind <a>Es ging nie um Autovervollständigung</a> und <a>FAIR ist eine Prüfung, kein Abzeichen</a>. |

Page `<title>` and meta description:

| page | EN title | DE title |
|---|---|---|
| writing | Selected writing — five records, read again | Ausgewählte Texte – fünf Einträge, neu gelesen |
| writing-agents | Agents are roles, not robots — Selected writing | Agenten sind Rollen, keine Roboter – Ausgewählte Texte |
| writing-copilot | Autocomplete was never the point — Selected writing | Es ging nie um Autovervollständigung – Ausgewählte Texte |
| writing-architecture | A shared language for systems — Selected writing | Eine gemeinsame Sprache für Systeme – Ausgewählte Texte |
| writing-fair-code | FAIR is a gate, not a badge — Selected writing | FAIR ist eine Prüfung, kein Abzeichen – Ausgewählte Texte |
| writing-organisation | Organisation determines technology — Selected writing | Organisation bestimmt Technik – Ausgewählte Texte |

English meta descriptions are the standfirsts above, trimmed to one sentence.
The German meta description is the German standfirst, same rule.

---

## 9. Verification (add to AGENTS.md)

```bash
grep -c '<script' writing.html writing-agents.html writing-copilot.html \
  writing-architecture.html writing-fair-code.html writing-organisation.html   # 0 each
grep -c '<h1' writing*.html                                   # 1 each
grep -c 'class="sm-chapter' writing-*.html                    # 4 each
grep -c 'class="sm-post"' writing.html                        # 5
grep -c 'class="outcome__figure"' index.html                  # still 2
grep -c 'article class="publication-highlight' index.html     # 3 after integration
python3 tools/i18n/build_i18n.py --check                      # problems 0
grep -c 'lang-switch:begin' writing*.html de/writing*.html    # 1 each
grep -rnoE '[[:space:]][.,;:!?]([[:space:]]|$|<)' de/writing*.html  # no output
gzip -c writing.html | wc -c                                  # budget ≈ 6 KB
```

Manual: EN/DE side by side; every number, date, DOI and co-author identical;
every DOI resolves; the five posts and the index link both ways; print preview
of one post; forced colours of the index list; 360/640/900/1440 px.

---

## 10. Owner items

1. **Approved by default, reversible:** the §4 CV block ("Selected writing") is
   the only edit to `index.html`. If the owner refuses it, delete one
   `article.publication-highlight` and one catalog set; nothing else depends on
   it.
2. ~~`human in the loop`~~ — resolved: the English prose says `human review`,
   the German `menschliche Nacharbeit`. The paper's own term is not quoted, so
   no mixed-language jargon ships.
3. **Date-stamped, not live:** download figures carry `(Zenodo, 15 November
   2026)`. A `tools/zenodo/stats.py` refresh script is deliberately not built:
   it adds a network dependency, a second source of truth and a new failure
   mode for a number that is evidence, not a metric.
4. **The index prints** as a one-page table of contents. It is a screen index
   first; the print rules are five declarations. If the owner prefers it
   screen-only, replace them with `#ch-01 { display: none; }` in print.
5. **The three omitted workshops are named in the index**, not read. A
   "further reading" row would add one translated block; not built.
6. **One designer risk stays open:** the German rail takes three rows at 360px.
   That is the existing standalone behaviour, identical in both languages, with
   no overflow; the alternative changes all ten standalone pages and is not
   worth it for a six-page series.

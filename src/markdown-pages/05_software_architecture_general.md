---
slug: "/blog/gams-general-architecture"
date: "2022-03-17"
title: "GAMS4 - Initiale Architekturüberlegungen und Systemanalyse"
draft: false
short: "Initiale Software-Architekturanalyse im Rahmen des Migrationsprojektes 'GAMS4' am ZIM Graz."
language: "german"
---

# Architekturanalyse

## Von Eigenentwicklung Standardlösung

Zu Beginn jeglicher Architekturentscheidung für ein Informationssystem steht die __Frage nach Eigenentwicklung oder Standardlösung__. Nachdem am ZIM ein bereits eingeführtes System (GAMS3) besteht, wird die Frage gemäß formulierter Anforderungen zugunsten der Eigenentwicklung beantwortet. 

Die Softwarearchitektur unterscheidet in einem nächsten Schritt zwischen zwei fundamentalen Systementwürfen.


## Von Verteilten System(en) und Monolithen

Zum einen beschreibt die Softwarearchitektur sogenannte __Verteilte Systeme__. Diese werden zumeist in einem Umfeld intensiver Arbeitsteilung eingesetzt, wo mehrere Entwicklungsteams oft über Zeitzonen hinweg koordiniert werden müssen. Sie besitzen den Vorteil einer besseren Planbarkeit arbeitsteiliger Abläufe - aber den Nachteil mitunter stark steigender Komplexität. Das entscheidende Charakteristikum ist das unabhängige Deployment der einzelnen Bausteine voneinander. 

Zum anderen ist es in der Softwarearchitektur übliche Praxis kleineren Entwicklungsteams das Gegenmodell eines __Softwaremonolithen__ zu empfehlen, der zwar hinsichtlich Arbeitsteilung komplexer in der Handhabung, aber zugleich auch wesentlich weniger anfällig im Punkte steigender Systemkomplexität ist. Eine Änderung in einem Systembaustein muss zu einem Redeployment des gesamten Systems führen. 


# Initiale Anforderungsanalyse

## Von funktionalen und nicht-funktionalen Anforderungen

Zur Beurteilung der Anforderungserfüllung eines Informationssystems unterscheidet die Softwarearchitektur zwischen __nicht-funktionalen und funktionalen Anforderungen__. Es wird geprüft ob ein Systementwurf in der Lage ist beide Seiten “angemessen” zu bedienen. (Eine 100% Abdeckung gibt es dabei nicht)

Bei __funktionalen Anforderungen__ handelt es sich um “direkte” domänenspezifische Ansprüche an ein System. Zum Beispiel: “ein Kunde kann ein Bankkonto anlegen”, “Herr/Frau XYZ findet die gebuchten Flüge” oder “ein Projektbearbeiter kann ein Digitales Objekt anlegen”. 

__Nicht-funktionale Anforderungen__ beschreiben implizite Ansprüche an ein System, die zumeist gemäß der Domäne unterschiedlich gewichtet werden (bzw. werden müssen). Beispielsweise zählt dazu: “Performanz: Eine Banküberweisung sollte nicht länger als 2 Minuten brauchen”, “Transaktionssicherheit: Wird der IBAN nicht gefunden, wird Geld nicht ins ‘Nichts’ überwiesen, sondern der ganze Prozess rückabgewickelt”, “Sicherheit: SQL Injection Attacken sind nicht möglich” oder “Konsistenz: Forschungsdaten dürfen nach Eingang ins Repositorium nicht mehr verändert werden”. 

Die verschiedene Gewichtung entlang Domänengrenzen erklärt sich wieder am Besten mit Beispielen: “Ist die Injection Attacke erfolgreich, können aus dem System Bankdaten ausgelesen werden” vs. “ist die Injection Attacke erfolgreich, können aus dem System nur weitere Kochanweisungen ausgelesen werden, weil keine sensiblen Daten existieren”.


# Fazit - Initiale Architekturanalyse

Aufgrund des steigenden Entwicklungsaufwandes bei gleichbleibender Entwicklungskapazität am ZIM (eine Vollzeitstelle) wird von der Realisierung von GAMS4 als Verteiltes System abgeraten. Es droht ein Nicht-Einhalten der funktionalen bzw. zumindest der nicht-funktionalen Anforderungen in Form von verfehlter Softwarequalität. 

Explizit nicht gemeint (vom Abraten eines Verteilten Systems) sind damit all jene Bestandteile, die als Standardsoftware in die Eigenentwicklung integriert und konfiguriert werden, wie zum Beispiel die von fedora6 vorkonfigurierten Setups. 
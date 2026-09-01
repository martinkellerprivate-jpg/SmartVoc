# SmartVoc — vollständige CR-Liste

Stand nach der Entwurfsrunde. Alles, was aus den Entscheiden folgt, in der
Reihenfolge, in der es gebaut wird. Grundlage: rund 7000 Zeilen App-Code.

**Status:** ✅ erledigt · ▶ bereit zum Bauen · ⛔ braucht eine Antwort von dir

---

## Stufe 1 — erledigt

| | CR | |
|---|---|---|
| ✅ | **CR-01** Foto-Scan (Tesseract) entfernt | 1063 → 622 kB |
| ✅ | **CR-02** Excel-Import/-Export/-Vorlage entfernt | keine Fremdinhalte mehr |
| ✅ | **CR-03** Beispielsätze mit Übersetzung (`examplesDe`) | beide Kartenseiten |
| ✅ | **CR-04** KI-Prompt neu — Abschreiben vom Foto zuerst | |
| ✅ | **CR-05** Parser: Trennzeichen und Leerspalten | fünf Fälle geprüft |
| ✅ | **CR-06** FSRS-Rampe: näherer Termin, häufiger dran | Ränder wertgleich |
| ✅ | **CR-07** App-Zeichen, Favicons, Startbildschirm hell/dunkel | ohne Alpha |
| ✅ | **CR-08 / 09** Passwort-Reset Web und App | |
| ✅ | **CR-10 / 11** Statusleiste und Tastatur auf iOS | |
| ✅ | **CR-12** Umbenennung auf SmartVoc, Bundle-ID | |

---

## Stufe 2 — Farben und Darstellung

Fundament: alles Folgende erbt davon.

- ▶ **CR-13** `farben.css` einsetzen — drei Schemata (Kladde, Leinen, Altpapier)
  je hell und dunkel, über `[data-scheme]` und `[data-appearance]`.
  Kontraste korrigieren: `--ink-soft` und `--ink-faint` fallen im Entwurf
  zusammen und reissen AA in zwei von drei Schemata.
- ⛔ **CR-14** `--amber` trägt zwei Bedeutungen — Hauptaktion **und** Stufe
  „sitzt fast". Siehe **Frage 1**.
- ▶ **CR-15** Kartentypen Liniert · Blanko · Altpapier · Leinen. Der Entwurf
  beschreibt sie, liefert aber keine Vorlagen — ich zeichne sie in CSS.
- ▶ **CR-16** Einstellungen „Aussehen": vier Regler nach Reichweite sortiert,
  mit lebender Vorschau.
- ▶ **CR-17** Ampelschwellen (95 % / 70 %) als Einstellung, Legende leitet sich
  daraus ab.
- ▶ **CR-18** Dunkle Darstellung durchgängig, Voreinstellung „Automatisch".

## Stufe 3 — Navigation

- ▶ **CR-19** Vier Bereiche: Üben · Übungsplan · Wortlisten · Statistik.
- ▶ **CR-20** Lektionen und Wörter zu **Wortlisten** zusammenlegen. Betrifft
  `LessonsTab`, `WordList`, `ListSelector`, `LessonBuilder`, `LessonWordPicker`.
- ▶ **CR-21** Zieldatum an jeder Liste, nicht nur an Lektionen.
- ▶ **CR-22** Hilfe (`?`) und Einstellungen (Zahnrad) in die Kopfzeile; die
  Einstellungen verlassen die Leiste.
- ▶ **CR-23** **Übungsplan als eigener Bereich**: Kalender mit Monatsnavigation
  und Ampel, Listenansicht, Tagesfilter, Mehrfachauswahl, zwei Verben je Zeile
  (Üben / Statistik). Ersetzt `PlanModal`.
- ▶ **CR-24** Übungsplan sprachübergreifend — heute filtert er auf das aktive
  Sprachpaar und verschweigt damit zwei Drittel der Termine.
- ▶ **CR-25** Beherrschungsstand an jeder Liste: Balken plus Prozentzahl,
  überall aus derselben Kennzahl wie die Ampel.

## Stufe 4 — Die Karte

`Practice.tsx`, 939 Zeilen — der grösste Brocken.

- ▶ **CR-26** Zwei Seiten wie eine echte Karteikarte, Querformat, feste Höhe,
  Überlänge scrollt innen.
- ▶ **CR-27** Sprachkennzeichnung `LA → DE`; die gefüllte Seite zeigt, wo man ist.
- ▶ **CR-28** Handlungszone folgt dem **Kartenzustand**, nicht dem Modus.
- ▶ **CR-29** Antwort-Arten als Aufklapper: Eintippen · Multiple-Choice ·
  Selbstkontrolle · **Durchblättern** (abgesetzt, „zählt nicht").
- ▶ **CR-30** In Durchblättern ersetzt „zählt nicht" den Fortschrittsbalken.
- ▶ **CR-31** Beide Fortschrittsbalken **von** der Karte herunter.
- ▶ **CR-32** Vollbild hoch und quer: Karte schwebt in Schwarz, Ausgang und
  Fortschritt daneben statt darauf.
- ▶ **CR-33** Übung-Wähler: Deine Listen mehrfach, Smart Lists einfach.
- ▶ **CR-34** Richtung im Sprachknopf als Pfeil statt Doppelpfeil.
- ⛔ **CR-35** „Gemischt" als dritte Richtung. Siehe **Frage 2**.
- ⛔ **CR-36** Gemischtsprachig üben. Siehe **Frage 3**.
- ▶ **CR-37** Rundenabschluss: Daumen und Flamme, Wörter als Plättchen,
  „Die 5 nochmal üben" / „Für heute fertig".

## Stufe 5 — Statistik

- ▶ **CR-38** Verteilungsleiste als Kopf; die Legende **ist** die Kennzahlenreihe
  und filtert die Tabelle. Nicht gewählte Stufen werden abgedunkelt, nicht entfernt.
- ▶ **CR-39** Wortzeile vereinheitlicht: Zustand aus der etablierten Skala,
  darunter „7 × richtig · 2 × falsch · in 4 Tagen wieder dran". Keine Sternchen,
  keine Abkürzungen.
- ▶ **CR-40** „Wie deine Wörter sitzen" streichen — das sagt die Leiste bereits.
- ▶ **CR-41** Gliederung: Jetzt üben · Nachschauen · Einstellen.
- ▶ **CR-42** „FSRS" verschwindet aus der Oberfläche → „Wie oft Wörter
  wiederkommen".
- ⛔ **CR-43** „Deine Stärken" hängt an den Themen. Siehe **Frage 4**.

## Stufe 6 — Aufräumen und Inhalte

- ▶ **CR-44** **Themen komplett entfernen.** Berührt 20 Dateien, darunter die
  drei Startwortschatz-Dateien. Hängt an Frage 4.
- ▶ **CR-45** Sprachausgabe entfernen (`speak.ts`, `autoAudio`, `hasTTS`,
  Lautsprecher). Lautschrift bleibt, optional, in beiden Richtungen.
- ▶ **CR-46** Grundwortschatz erscheint automatisch als Liste, sobald eine
  Sprache zugeschaltet wird — und bleibt technisch abtrennbar für die spätere
  Bezahlversion.
- ▶ **CR-47** Hilfe dreiteilig: Anleitung (9 Kapitel) · Lerntipps (10, mit
  Kurztext) · **Die Lerntheorie hinter dieser App** (Text steht).
- ▶ **CR-48** Willkommen-Dialog raus aus dem Start.
- ▶ **CR-49** Lerntipp-Einblendungen in den Einstellungen sichtbar machen.

## Stufe 7 — Oberflächensprache

- ⛔ **CR-50** Alle Texte in eine Übersetzungsschicht. **454 verschiedene
  Zeichenketten** in `components/`, `App.tsx` und `ui/`. Siehe **Frage 5**.

## Stufe 8 — Store

- ⛔ **CR-51** Konto löschen: `delete_account()` löscht auch aus `auth.users`;
  ob die Funktion dort Rechte hat, ist ungetestet. Siehe **Frage 6**.
- ▶ **CR-52** Datenschutztext und Impressum statt Platzhalter.
- ▶ **CR-53** „Confirm email" vor dem Launch wieder ein.
- ▶ **CR-54** Native Schicht: Haptik und System-Share.
- ▶ **CR-55** `localStorage` → nativer Speicher (iOS darf WKWebView-Speicher
  löschen). Alles läuft durch `src/lib/storage.ts`.
- ⏸ **CR-56** Anmeldung über Apple und Google — geparkt bis zur bezahlten
  Mitgliedschaft.

---

# Was ich nicht allein entscheiden kann

### Frage 1 · `--amber` trägt zwei Bedeutungen
Rostrot ist heute die Farbe der **Hauptaktion** (Prüfen-Knopf, aktive Pille)
**und** die Stufe **„sitzt fast"**. Zwei Dinge ohne Zusammenhang in einem Ton.
Mein Vorschlag: `--amber` bleibt Marke und Aktion, die Mittelstufe wandert
überall auf ein echtes Gelb (`--warn`). Im Entwurf ist es so gebaut.
**Ja oder nein?**

### Frage 2 · „Gemischt" als Richtung — in 1.0?
Machbar und begrenzt auf `Practice.tsx`: die Richtung wird ein Wert pro Karte
statt pro Runde. Bedingung: nur zusammen mit der Sprachkennzeichnung auf der
Karte, sonst tippt man in der falschen Sprache und bekommt zu Unrecht Rot.

### Frage 3 · Gemischtsprachig üben — in 1.0?
Ebenfalls machbar, derselbe Umbau. **Eine Stelle darf man dabei nicht
vergessen:** die Ablenker bei Multiple-Choice stammen aus dem Wortschatz des
aktiven Paars. Gemischt muss der Vorrat der Sprache **der aktuellen Karte**
folgen, sonst stehen französische Wörter unter einer lateinischen Frage.

### Frage 4 · „Deine Stärken" ohne Themen
`insights.ts` gruppiert nach `topic` und sagt Sätze wie *„Stark in Tiere"*.
Fallen die Themen weg (CR-44), verliert dieser Abschnitt seine Achse.
Drei Wege:
1. **Nach Liste gruppieren** — „Stark in Lektion 4". Mein Vorschlag: die Listen
   sind ohnehin die Einheit, in der du denkst.
2. Nach Wortart gruppieren — geht nur für Latein.
3. Den Abschnitt streichen.

### Frage 5 · Oberflächensprache
**454 Zeichenketten.** Zu klären:
- Welche Sprachen zum Start — Deutsch und Englisch?
- Wer übersetzt? Ich kann es, aber du müsstest gegenlesen; bei einer App für
  Kinder ist der Ton wichtiger als die Wortwahl.
- Reihenfolge: erst die Schicht einziehen (Deutsch bleibt Deutsch), dann
  übersetzen. Sonst blockiert die Übersetzung alles andere.

### Frage 6 · Konto löschen
Apple verlangt eine funktionierende Konto-Löschung. Ob `delete_account()` aus
`auth.users` löschen darf, kann ich nicht prüfen — dafür braucht es eine
Anmeldung. **Du müsstest ein Testkonto anlegen und löschen**, dann sehe ich am
Fehler, ob die Edge Function nötig wird.

---

# Zwei Funde, die Arbeit sparen

**Der Grundwortschatz ist schon da.** `src/data/starter/` enthält 227 englische,
220 französische und 200 lateinische Einträge. CR-46 ist damit nur noch die
Verdrahtung mit der Sprachwahl, kein Inhaltsprojekt. Was fehlt, sind die
Übersetzungen der Beispielsätze — optional, also kein Hindernis.

**Die Selbstkontrolle gibt es bereits** als `mode === "recall"`, samt Umdrehen
der Karte. Sie braucht nur die neue Bedienoberfläche, nicht die Logik.

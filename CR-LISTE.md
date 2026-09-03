# SmartVoc — CR-Liste

**Status:** ✅ gebaut und geprüft · ⛔ braucht dich · ⏸ bewusst geparkt

---

## Stufe 1 — Aufräumen vor dem Umbau

| | CR | |
|---|---|---|
| ✅ | **CR-01** Foto-Scan (Tesseract) entfernt | 1063 → 622 kB |
| ✅ | **CR-02** Excel-Import/-Export entfernt | keine Fremdinhalte mehr |
| ✅ | **CR-03** Beispielsätze mit Übersetzung (`examplesDe`) | beide Kartenseiten |
| ✅ | **CR-04** KI-Prompt neu — Abschreiben vom Foto zuerst | |
| ✅ | **CR-05** Parser: Trennzeichen und Leerspalten | fünf Fälle geprüft |
| ✅ | **CR-06** FSRS-Rampe: näherer Termin, häufiger dran | Ränder wertgleich |
| ✅ | **CR-07** App-Zeichen, Favicons, Startbildschirm | ohne Alpha |
| ✅ | **CR-08 / 09** Passwort-Reset Web und App | |
| ✅ | **CR-10 / 11** Statusleiste und Tastatur auf iOS | |
| ✅ | **CR-12** Umbenennung auf SmartVoc, Bundle-ID | |

## Stufe 2 — Farben und Darstellung

| | CR | |
|---|---|---|
| ✅ | **CR-13** Drei Farbschemata je hell und dunkel | zwei Achsen statt einer |
| ✅ | **CR-14** `--amber` trägt nur noch eine Bedeutung | Mittelstufe → `--warn` |
| ✅ | **CR-15** Kartentypen Liniert · Blanko · Altpapier · Leinen | in CSS gezeichnet |
| ✅ | **CR-16** Einstellungen „Aussehen" mit lebender Vorschau | im Querformat der Karte |
| ✅ | **CR-17** Ampelschwellen 95 % / 70 % als Einstellung | Legende leitet sich ab |
| ✅ | **CR-18** Dunkle Darstellung durchgängig | Voreinstellung „automatisch" |

Kontraste der Entwurfspalette korrigiert: `--ink-soft` und `--ink-faint` fielen
in allen drei hellen Schemata zusammen und rissen AA.

## Stufe 3 — Navigation

| | CR | |
|---|---|---|
| ✅ | **CR-19** Vier Bereiche: Üben · Übungsplan · Wortlisten · Statistik | |
| ✅ | **CR-20** Lektionen und Listen zu **Wortlisten** verschmolzen | Migration V16 |
| ✅ | **CR-21** Zieldatum an jeder Wortliste | |
| ✅ | **CR-22** Hilfe und Einstellungen in die Kopfzeile | |
| ✅ | **CR-23** Übungsplan als eigener Bereich mit Kalender | ersetzt `PlanModal` |
| ✅ | **CR-24** Übungsplan sprachübergreifend | |
| ✅ | **CR-25** Beherrschungsstand an jeder Liste | eine Quelle: `listReadiness` · war fälschlich abgehakt, erst am 3.9. umgesetzt |

## Stufe 4 — Die Karte

| | CR | |
|---|---|---|
| ✅ | **CR-26** Zwei Seiten, Querformat, kein Scrollbalken | Passung vor Format |
| ✅ | **CR-27** Sprachkennzeichnung `DE → EN`, volle Seite = aktuelle | |
| ✅ | **CR-28** Handlungszone folgt dem **Kartenzustand** | |
| ✅ | **CR-29** Antwortarten als Aufklapper | eine Höhe für alle |
| ✅ | **CR-30** In Durchblättern ersetzt „zählt nicht" den Fortschritt | |
| ✅ | **CR-31** Beide Fortschrittsbalken von der Karte herunter | |
| ✅ | **CR-32** Vollbild hoch und quer | Ausgang neben der Karte |
| ✅ | **CR-33** Übung-Wähler, nach der Wahl auf eine Zeile zugeklappt | 202 → 45 px |
| ✅ | **CR-34** Richtung als Pfeil | |
| ✅ | **CR-35** „Gemischt" als Richtung | FNV-1a, gemessen 25–31 von 57 |
| ✅ | **CR-36** Gemischtsprachig üben | Ablenker folgen der Kartensprache |
| ✅ | **CR-37** Rundenabschluss mit Plättchen, Daumen und Flamme | |

## Stufe 5 — Statistik

| | CR | |
|---|---|---|
| ✅ | **CR-38** Verteilungsleiste als Kopf, Legende filtert | abdunkeln statt entfernen |
| ✅ | **CR-39** Wortzeile vereinheitlicht, keine Abkürzungen | statt sechs Spalten |
| ✅ | **CR-40** „Wie deine Wörter sitzen" gestrichen | die Leiste sagt es |
| ✅ | **CR-41** Gliederung: Jetzt üben · Nachschauen · Einstellen | |
| ✅ | **CR-42** „FSRS" verschwindet aus der Oberfläche | |
| ✅ | **CR-43** „Deine Stärken" gestrichen | dein Entscheid |

## Stufe 6 — Aufräumen und Inhalte

| | CR | |
|---|---|---|
| ✅ | **CR-44** Themen komplett entfernt | 647 Felder in den Daten |
| ✅ | **CR-45** Sprachausgabe entfernt, Lautschrift bleibt | |
| ✅ | **CR-46** Grundwortschatz erscheint automatisch | bleibt abtrennbar |
| ✅ | **CR-47** Hilfe dreiteilig | 9 Kapitel · 10 Tipps · 811 Wörter Theorie |
| ✅ | **CR-48** Willkommen-Dialog entfernt | |
| ✅ | **CR-49** Lerntipp-Einblendungen in den Einstellungen | war schon da |

## Stufe 7 — Oberflächensprache

| | CR | |
|---|---|---|
| ✅ | **CR-50** Deutsch und Englisch | 265 Schlüssel, 262 übersetzt |

Der deutsche Text ist der Schlüssel; fehlt eine Übersetzung, erscheint Deutsch.
Die Hilfetexte stehen als zwei vollständige Fassungen (`help.de.tsx` /
`help.en.tsx`) — Prosa lässt sich nicht satzweise übersetzen.

**Nebenbefund:** der Durchlauf hat rund vierzig englische Beschriftungen in der
*deutschen* Oberfläche sichtbar gemacht. Alle übersetzt.

## Stufe 8 — Store

| | CR | |
|---|---|---|
| ⛔ | **CR-51** Konto löschen — Testkonto anlegen und löschen | **du** |
| ✅ | **CR-52** Datenschutz und Impressum statt Platzhalter | beide Sprachen |
| ⛔ | **CR-53** „Confirm email" in Supabase vor dem Launch | **du** |
| ✅ | **CR-54** Haptik und System-Teilen | |
| ✅ | **CR-55** Nativer Speicher als Sicherung | überlebt ein Räumen durch iOS |
| ⏸ | **CR-56** Anmeldung über Apple und Google | bis zur Bezahlversion |

---

# Was noch offen ist

### ⛔ Konto löschen (CR-51)
Apple verlangt eine funktionierende Konto-Löschung. Ob `delete_account()` aus
`auth.users` löschen darf, lässt sich ohne Anmeldung nicht prüfen. **Leg ein
Testkonto an und lösche es** — am Fehler sehe ich, ob eine Edge Function nötig
wird.

### ⛔ Confirm email (CR-53)
In Supabase unter *Authentication → Sign In / Providers → Email* wieder
einschalten, bevor die App öffentlich wird.

### Letzte CR-Runde
Du liest die englischen Texte gegen. Sie stehen in `src/lib/i18n.en.ts`
(Oberfläche) und `src/components/help.en.tsx` (Anleitung, Tipps, Lerntheorie).
Am 3.9. sind rund 110 Einträge dazugekommen — vor allem die sechzehn
erweiterten Regler samt Erklärungen und die neue Statistik.

### Zwei Entscheide von dir
* **`reviews`-Ablage ausräumen?** `src/lib/reviewlog.ts`, die `reviews`-Ablage
  im Store und der siebte synchronisierte Datensatz sind seit dem 3.9. ohne
  Oberfläche und ohne Schreiber — sie sammeln nichts. Ganz entfernen berührt
  einen synchronisierten Schlüssel, deshalb liegt es bei dir.
* **Rostrot in der Werkzeugleiste der Wortlisten.** „Neue Liste" trägt jetzt
  Tinte, „Einfügen" hat sein Rostrot abgegeben — Rostrot ist für Dringendes
  reserviert. Andersherum ist es ein Einzeiler.

---

## Stufe 9 — Bereiche durchoptimiert (3. September)

| | CR | |
|---|---|---|
| ✅ | **CR-57** Statistik neu: Umfang · Fortschritt · Kennzahlen · Nachschauen | `src/lib/statistik.ts` trennt Rechnung von Darstellung |
| ✅ | **CR-58** „fast" als Antwortklasse abgeschafft | Akzent daneben zählt als richtig; die Stolpersteine erklären, was danebenlag |
| ✅ | **CR-59** Statistik löst keine Handlungen mehr aus | Übungsknopf, Lupe und Zurücksetzen entfernt bzw. verschoben |
| ✅ | **CR-60** „Hartnäckig" ist EINE Menge mit EINER Zahl | zäh ab 7 und mindestens dreimal wieder vergessen |
| ✅ | **CR-61** Zwei doppelte Rechnungen entfernt | `listProfile.tone` (eigene Schwellen) und `WL_STUFE` (Rostrot für eine Stufe) |
| ✅ | **CR-62** Wortlisten: „Alle Wörter" ans Ende, „Neue Liste" neben die Suche, Lernstand an jeder Liste | |
| ✅ | **CR-63** Tabellen-Import und Vorlage zurück — nur Web und angemeldet | iOS: 224 Byte statt 429 kB, per `resolve.alias` |
| ✅ | **CR-64** „Auto-Anpassung" aus den Einstellungen | versprach eine Datensammlung, die weder stattfand noch stattfinden soll |
| ✅ | **CR-65** Anlagedatum am Wort (V17) | Altbestand auf den 1. August |

**Mit fiktiven Daten geprüft** (412 geübte Wörter, 1641 Antworten über 100
Tage): vier Fehler kamen erst dabei zum Vorschein — eine falsche Behauptung
über die hartnäckigen Wörter, zwei Grammatikfehler und eine „beste Lernzeit",
die bei 30 und 90 Tagen Verschiedenes sagte. Zwei weitere fielen erst im Bild
auf: unlesbare Wortzahl im gewählten Reiter, und eine Erklärnotiz hinter 649
Tabellenzeilen.

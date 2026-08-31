# Design-Briefing SmartVoc

Für Claude Design. Kopiere dieses Dokument vollständig hinein.

---

## Was SmartVoc ist

Ein Vokabeltrainer für Schülerinnen und Schüler im deutschsprachigen Raum.
Deutsch ⇄ Englisch, Französisch, Latein. Er läuft als **iOS-App** und als
**Web-Version im Browser**, beide auf derselben Datenbasis: ein Konto, dieselben
Wörter auf dem Handy wie am Rechner. Keiner der beiden Wege ist zweitrangig.

Der Kern ist ein wissenschaftliches Gedächtnismodell (FSRS): die App entscheidet,
welches Wort wann wieder drankommt. Nach aussen soll davon wenig zu sehen sein —
wer übt, tippt Wörter, sieht ob sie stimmen, und macht weiter.

**Zielgruppe.** Jugendliche ab etwa zwölf, die abends vor einer Prüfung zwanzig
Minuten üben. Dazu Eltern, die das einrichten. Kein Fachpublikum, keine
Gamification-Erwartung, aber auch kein Kinderprogramm.

**Ton.** Ruhig, aufgeräumt, ein wenig analog — die App soll näher an einem
sauber geführten Vokabelheft liegen als an einer Lern-Plattform. Sie darf
handgemacht wirken, aber nicht verspielt.

---

## Was heute existiert

Die Oberfläche ist gewachsen und funktioniert, wirkt aber überladen und
uneinheitlich. Die bestehende Richtung ist **warmes Papier mit dunkler Tinte**.
Du darfst sie behalten, schärfen oder ersetzen — aber liefere in jedem Fall ein
vollständiges, benanntes System, nicht nur einzelne Bilder.

### Farben (CSS-Variablen aus `src/index.css`)

| Variable | Wert | Rolle |
|---|---|---|
| `--bg` | `#f1e8d8` | Papiergrund |
| `--bg-2` | `#e9dfcc` | Grund, zweite Ebene |
| `--card` | `#fffdf8` | Kartenfläche |
| `--card-2` | `#faf4e8` | Karte, zweite Ebene |
| `--ink` | `#322d26` | Text, Marke |
| `--ink-soft` | `#756c5d` | Nebentext |
| `--ink-faint` | `#a89c89` | Hinweise, Platzhalter |
| `--line` | `#e5d9c5` | Linien |
| `--amber` | `oklch(0.60 0.11 72)` | Akzent, Hauptaktion |
| `--green` | `oklch(0.58 0.10 150)` | richtig |
| `--red` | `oklch(0.585 0.13 33)` | falsch |
| `--blue` | `oklch(0.58 0.10 245)` | Hinweis, neutral |

### Schriften (selbst gehostet über `@fontsource`)

- **Source Serif 4** — Karten, Vokabeln, Überschriften
- **Hanken Grotesk** — Oberfläche, Knöpfe, Beschriftungen
- **Patrick Hand** — Handschrift-Akzent, heute kaum genutzt

### Marke

Heute nur ein abgerundetes dunkles Quadrat mit einem serifen **„S"**, leicht
nach links gekippt, daneben der Schriftzug. Kein eigentliches Zeichen.

**Der Name ist neu: SmartVoc** (vorher „Smart Vocables"). Das Zeichen soll für
den neuen, kürzeren Namen entworfen werden.

---

## Was gebraucht wird

Sieben Lieferungen. Ich beziehe mich später auf die Kürzel D1–D7.

### D1 — App-Zeichen (Icon)

Ein Zeichen, das auf einem iPhone-Startbildschirm neben Snapchat und WhatsApp
bestehen kann: bei 60 Pixeln lesbar, nicht beliebig, kein Buchstabe in einem
Kreis. Es darf vom Vokabelheft erzählen, von zwei Sprachen, vom Wiederkehren —
aber nicht von allem gleichzeitig.

**Zu liefern:**
- `1024 × 1024` PNG, **ohne Transparenz**, ohne eigene abgerundete Ecken
  (iOS schneidet selbst) → für die App
- `192 × 192` und `512 × 512` PNG → für die Web-Version
- `512 × 512` PNG **maskable**: dasselbe Zeichen mit rund 20 % Sicherheitsrand
  ringsum, damit Android es beschneiden kann, ohne etwas abzuschneiden
- `180 × 180` PNG → Lesezeichen auf iOS
- `32 × 32` PNG **und** eine SVG-Fassung → Browser-Tab
- Das Zeichen zusätzlich als **SVG**, einfarbig und mehrfarbig

### D2 — Wortmarke und Kopfzeile in der App

Der Schriftzug **SmartVoc**, und wie er zusammen mit dem Zeichen in der Kopfzeile
steht. Darunter läuft heute eine Zeile wie „Latein ⇄ Deutsch · 370 Wörter".

Auf einem Telefon ist die Kopfzeile knapp: Zeichen, Name, Kontostand und
Sprachrichtung müssen nebeneinander bestehen, ohne zu drängeln.

**Zu liefern:** Wortmarke als SVG; Kopfzeile als Entwurf für Telefon und
Rechner; die Regel, wie Zeichen und Schriftzug zueinander stehen (Abstand,
Grössenverhältnis, Mindestgrösse).

### D3 — Farb- und Schriftsystem

Ein vollständiges System für **helle und dunkle Darstellung**. Dunkel gibt es
heute gar nicht; auf einem Telefon abends ist das ein echter Mangel.

**Zu liefern:**
- Alle Farbwerte als CSS-Variablen, **unter genau den Namen aus der Tabelle
  oben** — dann lässt sich das direkt einsetzen. Neue Rollen gern zusätzlich,
  klar benannt.
- Beide Sätze, hell und dunkel.
- Kontraste nach WCAG AA für Fliesstext.
- Schriftpaarung mit Grössen-Stufen (Vokabel, Überschrift, Fliesstext,
  Beschriftung, Zahl) und den zugehörigen Schnitten. **Bitte bei Schriften
  bleiben, die es bei Google Fonts gibt** — sie werden mitgeliefert, nicht
  nachgeladen.

### D4 — Die Übungskarte

Das wichtigste Einzelstück. Hier verbringt der Nutzer die ganze Zeit.

Auf der Karte stehen heute: das abgefragte Wort, ein Eingabefeld, ein
Prüfen-Knopf, ein Hinweis-Knopf, die Auflösung nach dem Prüfen, optional bis zu
zwei Beispielsätze und eine Lautschrift, dazu Kartenzähler und Fortschritt.

Das Lautsprecher-Symbol und die Sprachausgabe **entfallen** — nicht mit
entwerfen. Die **Lautschrift bleibt**, als optionales Feld in beiden
Sprachrichtungen.

**Zu liefern:** die Karte in ihren vier Zuständen — Frage, Antwort getippt,
richtig, falsch. Für Telefon und Rechner. Mit Angabe, was gross und was klein
ist; heute konkurriert alles miteinander.

**Dazu ein fünfter Zustand: Vollbild.** Über der Karte sitzt ein Knopf
„Karte vergrössern". Der soll die Karte künftig auf den ganzen Bildschirm
heben — alles ringsum schwarz, keine Kopfzeile, keine Leiste, nur die Karte.
Gedacht für den Moment, in dem jemand nur noch das Wort sehen will, und zum
Abfragen zu zweit.

Der Zustand muss in **beiden Lagen** funktionieren, hoch und quer, denn im
Querformat wird die Karte deutlich grösser — genau darum geht es. Bitte für
beide Lagen entwerfen und angeben, was jeweils sichtbar bleibt (Weiter,
Hinweis, Verlassen) und wo diese Bedienelemente sitzen, damit sie mit einem
Daumen erreichbar sind.

### D5 — Die Karte entrümpeln

Kein eigener Entwurf, sondern eine Aufräum-Empfehlung zu D4: Welche Symbole und
Texte auf der Karte tragen wirklich, welche gehören weg oder auf die zweite
Ebene? Wo darf Farbe etwas sagen, statt nur zu schmücken?

Randbedingungen, die feststehen:
- Der Hinweis-Knopf wird zur **Glühbirne unten rechts in der Karte**, ohne Wort.
- „Überspringen / Weiss ich nicht" entfällt.
- Sprachausgabe und Lautsprecher-Symbol entfallen.
- **Themen entfallen** — Wörter tragen keine Kategorie mehr.
- Vier Antwort-Arten bleiben: tippen, auswählen, selbst prüfen, nur ansehen.
  Sie sollen **auf eine Zeile** passen.

### D7 — Navigation: wohin mit alldem?

Das ist ein echter Entwurfsauftrag, keine Umsetzung einer fertigen Idee.

Heute liegt unten eine feste Leiste mit fünf Einträgen: Üben, Lektionen,
Wörter, Statistik, Mehr. Oben in der Kopfzeile stehen zusätzlich Übungsplan,
Lerntipps, Anleitung und ein Tagesziel-Ring.

Beschlossen ist:
- **Lektionen und Wörter werden zu einem einzigen Bereich „Wortlisten".**
  Jede Liste kann ein optionales **Zieldatum** tragen (Prüfung oder
  selbstgesetztes Ziel).
- **Das Tagesziel verschwindet** aus der Kopfzeile.
- **Anleitung und Lerntipps** sollen aus der Kopfzeile weg.

Damit blieben vier Bereiche plus zwei Hilfe-Einträge. Sechs Einträge in einer
Leiste sind auf einem Telefon zu viel — deshalb die eigentliche Frage an dich:

**Wie ordnet man das? Muss überhaupt alles in die Fusszeile?** Vielleicht
gehören Anleitung und Lerntipps gar nicht auf dieselbe Ebene wie die
Hauptbereiche. Vielleicht braucht es kein „Mehr". Vielleicht ist eine feste
Fusszeile nicht die richtige Antwort. Schlag vor, was trägt — begründet, gern
mit zwei Varianten zum Vergleichen.

Randbedingung: die Web-Version hat am Rechner viel mehr Platz. Es soll
dieselbe Oberfläche bleiben, kein zweiter Entwurf — aber sie darf sich weiten.

### D6 — Startbildschirm der App

Heute die Vorlage von Capacitor. Gebraucht wird ein eigener, ruhiger
Startbildschirm mit dem neuen Zeichen — kein Werbebild, er ist eine
Zehntelsekunde zu sehen.

**Zu liefern:** `2732 × 2732` PNG, Motiv sicher in der Mitte (die Ränder werden
je nach Gerät beschnitten), in heller und dunkler Fassung.

---

## Randbedingungen

- **Hochformat.** Die App ist auf Hochformat festgelegt.
- **Sichere Bereiche.** Die Seite reicht bis an den Bildschirmrand; oben liegt
  die Statusleiste, unten der Home-Balken. Nichts Wichtiges dorthin legen.
- **Einhändig.** Alles, was angetippt wird, gehört in die untere Bildschirmhälfte.
- **Deutsch als Oberflächensprache**, Englisch folgt. Beschriftungen werden also
  länger und kürzer — kein Entwurf, der auf exakte Wortlängen angewiesen ist.
- **Keine Fremdinhalte.** Schriften und Bilder werden mit der App ausgeliefert,
  nichts wird zur Laufzeit nachgeladen.
- **Zwei Zielgrössen.** Telefon zuerst, Rechner darf grosszügiger sein — aber
  es ist dieselbe Oberfläche, kein zweiter Entwurf.

## Wie geliefert werden soll

PNG in den genannten Grössen, SVG für Zeichen und Wortmarke, und die Farb- und
Schriftangaben als **Textblock mit CSS-Variablen**. Entwürfe für Karte und
Kopfzeile als Bilder genügen.

Ablage im Projekt danach:

| Was | Wohin |
|---|---|
| Web- und PWA-Zeichen, Lesezeichen, Favicon | `public/icons/` |
| App-Zeichen (1024er) | `ios/App/App/Assets.xcassets/AppIcon.appiconset/` |
| Startbildschirm | `ios/App/App/Assets.xcassets/Splash.imageset/` |
| Farben und Schriften | `src/index.css`, Block `:root` |

Alles liegt im Git-Repository und ist damit auf GitHub gesichert.

# Übergabe — iOS-App „Smart Vocables"

Dieses Dokument ist der Einstieg für eine **neue Claude-Code-Session**, die die
iOS-App baut. Es beschreibt Stand, Regeln und die nächsten Schritte.

---

## ⚠️ Die wichtigste Regel

**Die laufende Web-App darf nicht verändert werden.**

- Dieses Verzeichnis ist ein **git worktree** auf dem Branch `ios-app`.
- Das Original liegt unter `../Vokablen-Trainer` auf `main` — **dort nichts committen**.
- `main` wird bei jedem Push **automatisch auf GitHub Pages deployt**
  (`.github/workflows/deploy.yml`). Ein versehentlicher Push nach `main` geht
  also sofort live. `ios-app` löst **keinen** Deploy aus.
- Beide Ordner teilen sich dieselbe Git-Historie. Web-Fixes lassen sich später
  gezielt hierher mergen (`git merge main`) und umgekehrt.

Vor jedem Commit prüfen: `git branch --show-current` muss `ios-app` sagen.

---

## Stand

| | |
|---|---|
| Branch | `ios-app`, abgezweigt von `main` @ `f25a886` |
| Letzter Commit hier | siehe `git log` — zuletzt: Umbenennung auf „Smart Vocables" |
| Web-App live | https://martinkellerprivate-jpg.github.io/Vokablen-Trainer/ |
| Xcode | 26.6, iOS-26.5-Plattform + Simulatoren installiert |
| Apple-Account | **kostenlos** — bezahlte Mitgliedschaft (99 $/Jahr) noch nicht gekauft |
| Capacitor | **8.5 eingerichtet**, native Abhängigkeiten über SPM — CocoaPods wird nicht gebraucht |
| Bundle-ID | `ch.drkeller.smartvocables` — nach dem ersten Store-Eintrag nicht mehr änderbar |
| Simulator | läuft; iPhone 17 Pro, iOS 26.5 |

`npm install` wurde in diesem Worktree bereits angestossen (eigene
`node_modules`, wird nicht mit dem Original geteilt).

---

## Was die App ist

React 18 + Vite + TypeScript, PWA, local-first. Kern-Logik in reinem
TypeScript, framework-frei und getestet:

- `src/lib/fsrs.ts` — Gedächtnismodell (ts-fsrs), 5 Stufen, CFG-Parameter
- `src/lib/runqueue.ts` — V-ENGINE: **eine** Queue für alle Einstiege
  (gewichtete Töpfe, Debt-Bonus, Anti-Wiederholung, Endspiel-Kippen)
- `src/lib/scoring.ts` + `src/lib/latin.ts` — Bewertung inkl. Artikel,
  ss-Schreibweise, Längenstriche, Teilpunkte
- `src/lib/engine.ts` — Scope-Auflösung, Prognosen

**Diese Logik bleibt geteilt.** Sie nativ nachzubauen hiesse, dieselben Regeln
in zwei Sprachen dauerhaft synchron zu halten — genau das soll vermieden werden.

---

## Vereinbarter Umfang

**Raus für Version 1.0**
- Foto-Scan mit Tesseract (`tesseract.js`, `ScanModal.tsx`) — grösster Brocken
  im Bundle; später besser über Apple Vision
- Excel-Import/-Export (`xlsx`, `downloadTemplate` / `exportList` / `onImportFile`
  in `WordList.tsx`) — Dateihandling auf iOS umständlich
- Der Weg über „Einfügen" mit KI-Prompt **bleibt** als Ersatz

**Bleibt drin (ausdrücklich bestätigt)**
- Die **FSRS-Parametrisierung** in den erweiterten Einstellungen — nicht entfernen
- Alle drei Sprachen, jetzt pro Konto abwählbar (`activePairs`)

**Nativ dazu — nötig gegen Richtlinie 4.2**
- Sprachausgabe über iOS statt Web-Speech (`src/ui/speak.ts` ist die einzige Stelle)
- Haptisches Feedback bei richtig/falsch
- Teilen über das System-Share-Sheet
- Später: Texterkennung über Apple Vision als Tesseract-Ersatz

**Name.** Die iOS-Variante heisst **Smart Vocables** (neutral, App-Store-tauglich).
Geändert in `index.html` (Titel), `vite.config.ts` (PWA-Manifest), `App.tsx`
(Markenzeile + Kürzel „S"), `accountData.ts` (Export). Die Web-App auf `main`
behält bewusst ihren bisherigen Namen — beim Mergen von `main` also nicht
versehentlich zurückholen.

**Offen**
- Push-Erinnerung („heute sind 12 Wörter dran") — starkes 4.2-Argument,
  braucht aber die bezahlte Mitgliedschaft
- Ein Sprachpaar zum Start oder alle drei sichtbar

---

## Architektur-Entscheidungen (bereits getroffen)

**Daten.** Supabase bleibt unverändert — dieselbe Tabelle `user_documents`,
dieselbe User-ID, dieselbe Row-Level-Security. Eine native App spricht dieselbe
HTTPS-API. GitHub bleibt Code-Speicher; die Auslieferung der App übernimmt Apple.

**Ein Konto für Web und iPhone** ist gewollt und praktisch aufwandsfrei —
Supabase-Auth ist geräteunabhängig, die Sync-Logik in `src/sync/` ist es auch.

**Lokaler Speicher — zu beachten.** Heute `localStorage` über
`src/lib/storage.ts` (`LS`, `load`, `save`). iOS darf WKWebView-Speicher bei
Knappheit löschen. Für die native Version auf einen nativen Speicher umstellen —
**alles läuft durch diese eine Datei**, das Innenleben lässt sich austauschen,
ohne den Rest anzufassen.

**Passwort-Reset — bekannte Stolperstelle.** `src/sync/auth.tsx`,
`resetPassword()` baut den Rücksprung aus
`window.location.origin + import.meta.env.BASE_URL`. In einer Capacitor-App ist
`origin` etwa `capacitor://localhost` → der Mail-Link führt ins Leere.
Zwei Wege: Reset weiterhin über die Website erledigen (kostenlos, aber ein Bruch),
oder Universal Link einrichten — braucht **Associated Domains und damit die
bezahlte Mitgliedschaft**.

**Was der kostenlose Account nicht kann:** TestFlight, Associated Domains
(= Universal Links), Push. Installationen laufen nach **7 Tagen** ab. Für
Simulator und eigenes Gerät reicht er.

---

## Bauen und starten

Ein Quellbaum, zwei Web-Builds. `CAP_PLATFORM=ios` schaltet in `vite.config.ts`
zwischen ihnen um:

| Befehl | Ziel | base | Service Worker |
|---|---|---|---|
| `npm run build` | `dist/` | `/Vokablen-Trainer/` | ja |
| `npm run build:ios` | `dist-ios/` | `/` | nein |

Getrennte Ordner, damit ein Web-Deploy nie versehentlich ein iOS-Bündel
mitnimmt. Nachgeprüft: der Web-Build ist Byte für Byte derselbe wie vorher.

```
npm run ios            # build:ios + npx cap sync ios
npm run ios:open       # Projekt in Xcode öffnen
```

**Ohne Xcode bauen und starten** — das funktioniert, aber nur mit den
folgenden Zusätzen:

```
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug \
  -sdk iphonesimulator -destination "id=<UDID>" \
  -onlyUsePackageVersionsFromResolvedFile \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO build

xcrun simctl install <UDID> <DerivedData>/Build/Products/Debug-iphonesimulator/App.app
xcrun simctl launch  <UDID> ch.drkeller.smartvocables
```

`CODE_SIGNING_ALLOWED=NO` heisst: für den Simulator braucht es keine
Entwickler-Mitgliedschaft.

### Die Stolperstelle beim ersten Bauen

Capacitor holt sich `Capacitor.xcframework` als **Binär-Artefakt** von GitHub.
Bevor SwiftPM den Download startet, fragt es den **Schlüsselbund** nach
Zugangsdaten — und dieser Aufruf löst einen Systemdialog aus. Läuft `xcodebuild`
im Hintergrund, sieht niemand den Dialog: der Build steht dann still in
`waitForRemoteSourcePackagesToFinishLoading`, ohne Ausgabe, ohne Fehler,
beliebig lange.

Der Ausweg ist, die Artefakte einmal vorher ohne Schlüsselbund zu holen:

```
cd ios/App/CapApp-SPM && swift package resolve --disable-keychain --disable-netrc
```

Danach liegen sie im Zwischenspeicher (`~/Library/Caches/org.swift.swiftpm`)
und `xcodebuild` läuft durch. Dauert dann rund 13 Sekunden statt gar nicht.
Ein Diagnose-Hinweis für den Wiederholungsfall: läuft `SecurityAgent`, steht
der Dialog.

---

## Nächste Schritte

1. ~~`npm run build` muss grün sein~~ — erledigt
2. ~~Capacitor einrichten, erster Start im Simulator~~ — erledigt
3. **Native Schicht, zuerst das Sichtbare.** Beim ersten Start sofort
   aufgefallen:
   - Die Statusleiste liegt über der Kopfzeile. `index.html` hat kein
     `viewport-fit=cover`, und nichts polstert um `env(safe-area-inset-top)`.
     Unten wird bereits gepolstert (`src/index.css`, zwei Stellen) — oben fehlt
     das Gegenstück.
   - Das Antwortfeld zieht beim Start die Tastatur hoch
     (`src/components/Practice.tsx:249`), quer über den Willkommen-Dialog.
     Auf dem Web harmlos, auf dem Handy nicht.
4. Vereinfachen: Tesseract- und xlsx-Pfade entfernen, Bundle-Grösse vorher/nachher
   messen (Ausgangswert jetzt gemessen: **860 kB** JS, gzip 276 kB)
5. Native Schicht, der Rest: TTS, Haptik, Share
6. Erst danach: Store-Material, bezahlte Mitgliedschaft, TestFlight

---

## Arbeitsweise, die sich bewährt hat

- Nach jeder Änderung `npm run build` — muss grün sein
- Web-Verhalten im Browser tatsächlich nachprüfen (Dev-Server via
  `.claude/launch.json`, Eintrag `vt-dev`), nicht nur den Code lesen
- Reine Logik mit kleinen Node-Tests absichern (esbuild-Bundle + Assertions);
  so sind V-ENGINE, Review-Log und die Längenstrich-Regel abgesichert
- Deutsche UI-Texte: **keine geraden Anführungszeichen in JSX-Attributen** —
  `"` beendet den String. `„…"` verwenden.
- Testdaten nach dem Prüfen wieder aufräumen

# Smart Vocables — iOS-App

Einstieg für die Session, die diese App baut.

---

## Das Wichtigste: Dieses Projekt steht für sich allein

Es gibt einen **Web-Piloten** („Lilly-Anne's Vokabeltrainer"), von dem dieses
Projekt als Kopie gestartet ist. Damit endet die Beziehung.

- **Eigenes Repository.** Keine gemeinsame Git-Historie mit dem Piloten, kein
  Remote, kein Merge-Pfad. `git merge main` gibt es hier nicht.
- **Eigenes Supabase-Projekt.** Eigene Nutzertabelle, eigene Zugangsdaten. Die
  Konten der Web-App gelten hier **nicht** und umgekehrt.
- **Der Pilot wird nicht angefasst.** Er liegt in einem anderen Ordner, hat sein
  eigenes Repository und läuft unverändert weiter. Kein Grund, ihn zu öffnen,
  zu lesen oder zu verändern.
- Der GitHub-Pages-Workflow des Piloten wurde entfernt — dies ist eine App,
  keine Website.

Wenn etwas in dieser Datei nach „geteilt mit dem Piloten" klingt, ist es ein
Überbleibsel und gehört korrigiert.

---

## Stand

| | |
|---|---|
| Repository | lokal, 1 Commit, Branch `main`, **noch kein Remote** |
| Xcode | 26.6, iOS 26.5 SDK + Simulatoren |
| Capacitor | 8.5, native Abhängigkeiten über SwiftPM (kein CocoaPods) |
| Bundle-ID | `ch.drkeller.smartvocables` — nach dem ersten Store-Eintrag fix |
| Simulator | verifiziert auf iPhone 17 Pro, iOS 26.5 |
| Bundle-Grösse | 860 kB JS (gzip 276 kB) |
| Apple-Account | kostenlos; 99 $/Jahr noch nicht gekauft |
| Supabase | **noch keines** — `.env.local` fehlt, Anmeldung/Sync daher ungetestet |

---

## Noch offen — muss der Nutzer tun

Beides geht nicht von der Kommandozeile aus (`gh` ist nicht installiert,
Supabase-Projekte entstehen nur im Dashboard):

1. **GitHub-Repository anlegen** (z. B. `smart-vocables`, privat), dann:
   ```
   git remote add origin git@github.com:<user>/smart-vocables.git
   git push -u origin main
   ```
2. **Supabase-Projekt anlegen**, `schema.sql` aus diesem Ordner im SQL-Editor
   ausführen, und `.env.local` anlegen:
   ```
   VITE_SUPABASE_URL=…
   VITE_SUPABASE_ANON_KEY=…
   ```
   Erst danach lassen sich Registrierung, Anmeldung und Sync testen.
   `.env.local` gehört **nicht** ins Repository.

---

## Was die App ist

React 18 + Vite + TypeScript in einer Capacitor-Hülle. Die Lernlogik liegt in
reinem, framework-freiem TypeScript und ist mit Node-Tests abgesichert:

- `src/lib/fsrs.ts` — Gedächtnismodell (ts-fsrs), 5 Stufen, CFG-Parameter
- `src/lib/runqueue.ts` — eine Queue für alle Einstiege (gewichtete Töpfe,
  Debt-Bonus, Anti-Wiederholung, Endspiel-Kippen)
- `src/lib/scoring.ts` + `src/lib/latin.ts` — Bewertung: Artikel,
  ss-Schreibweise, Längenstriche, Teilpunkte
- `src/lib/engine.ts` — Scope-Auflösung, Prognosen

Diese Logik bleibt TypeScript. Sie nativ nachzubauen hiesse, dieselben Regeln
in zwei Sprachen dauerhaft synchron zu halten.

---

## Umfang

**Raus für 1.0**
- Foto-Scan mit Tesseract (`tesseract.js`, `ScanModal.tsx`) — grösster Brocken
- Excel-Import/-Export (`xlsx` in `WordList.tsx`) — auf iOS umständlich
- Der Weg „Einfügen" mit KI-Prompt **bleibt** als Ersatz

**Bleibt drin**
- FSRS-Parametrisierung in den erweiterten Einstellungen — ausdrücklich bestätigt
- Alle drei Sprachen, pro Konto abwählbar (`activePairs`)

**Nativ dazu** — nötig gegen App-Store-Richtlinie 4.2 („keine reine Website-Hülle")
- Sprachausgabe über iOS statt Web-Speech (`src/ui/speak.ts`)
- Haptisches Feedback
- Teilen über das System-Share-Sheet
- Später: Texterkennung über Apple Vision als Tesseract-Ersatz

---

## Nächste Schritte

1. **Sichtbare native Mängel** (beim ersten Start aufgefallen):
   - Statusleiste liegt über der Kopfzeile — `index.html` fehlt
     `viewport-fit=cover`, und nichts polstert um `env(safe-area-inset-top)`.
     Unten wird bereits gepolstert (`src/index.css`), oben fehlt das Gegenstück.
   - Tastatur springt beim Start hoch, quer über den Willkommen-Dialog —
     `Practice.tsx` fokussiert das Antwortfeld selbst. Auf dem Web harmlos,
     auf dem Handy nicht.
2. Abspecken: Tesseract- und xlsx-Pfade entfernen, Grösse vorher/nachher messen
3. Native Schicht: TTS, Haptik, Share
4. Supabase anbinden (siehe oben) und Anmeldung/Sync auf dem Gerät testen
5. Store-Material, bezahlte Mitgliedschaft, TestFlight

---

## Bauen und starten

```
npm run ios          # Web-Build nach dist-ios/ + npx cap sync ios
npm run ios:open     # Projekt in Xcode öffnen
```

Ohne Xcode-Oberfläche:

```
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug \
  -sdk iphonesimulator -destination "id=<UDID>" \
  -onlyUsePackageVersionsFromResolvedFile \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO build

xcrun simctl install <UDID> <DerivedData>/Build/Products/Debug-iphonesimulator/App.app
xcrun simctl launch  <UDID> ch.drkeller.smartvocables
```

`CODE_SIGNING_ALLOWED=NO`: für den Simulator braucht es keine Mitgliedschaft.

### Stolperstelle beim ersten Bauen

Capacitor holt `Capacitor.xcframework` als Binär-Artefakt von GitHub und fragt
davor den **Schlüsselbund** — das löst einen Systemdialog aus. Läuft `xcodebuild`
im Hintergrund, sieht den niemand: der Build steht dann ohne Ausgabe still.
Einmal vorher ohne Schlüsselbund auflösen:

```
cd ios/App/CapApp-SPM && swift package resolve --disable-keychain --disable-netrc
```

Danach läuft der Build in rund 13 Sekunden durch. Diagnose im Wiederholungsfall:
läuft `SecurityAgent`, steht ein Dialog.

---

## Aufräumen, das noch offen ist

Reste aus der Kopie, die noch auf den Piloten zeigen:

- `vite.config.ts` kennt zwei Build-Ziele; das Web-Ziel setzt `base` noch auf
  den Pfad des Piloten. Für dieses Projekt wird nur `build:ios` gebraucht — das
  Web-Ziel kann weg oder auf `base: "/"` vereinfacht werden.
- `README`/Kommentare erwähnen teils noch den alten Namen.

---

## Bekannte Punkte

**Passwort-Reset.** `src/sync/auth.tsx`, `resetPassword()` baut den Rücksprung
aus `window.location.origin` — in einer Capacitor-App ist das
`capacitor://localhost`, der Mail-Link führt also ins Leere. Da dieses Projekt
keine eigene Website hat, braucht es dafür **Universal Links**, und die setzen
Associated Domains und damit die **bezahlte Mitgliedschaft** voraus. Bis dahin
ist Passwort-Zurücksetzen nicht nutzbar.

**Lokaler Speicher.** Heute `localStorage` über `src/lib/storage.ts`
(`LS`, `load`, `save`). iOS darf WKWebView-Speicher bei Knappheit löschen — für
die native Version auf nativen Speicher umstellen. Alles läuft durch diese eine
Datei, das Innenleben lässt sich austauschen.

**Kostenloser Apple-Account kann nicht:** TestFlight, Associated Domains, Push.
Installationen laufen nach 7 Tagen ab. Für Simulator und eigenes Gerät reicht er.

**Ordner liegt in OneDrive.** Während der Einrichtung ist der Ordner einmal
mitten in der Arbeit verschwunden, weil OneDrive neu gestartet hat. Xcode-
Projekte und `node_modules` vertragen sich schlecht mit Cloud-Sync. Ein Umzug
nach z. B. `~/Developer/smart-vocables` wäre empfehlenswert; die Sicherung
übernimmt dann GitHub.

---

## Arbeitsweise

- Nach jeder Änderung `npm run build:ios` — muss grün sein
- Verhalten tatsächlich prüfen (Simulator-Screenshot), nicht nur Code lesen
- Reine Logik mit kleinen Node-Tests absichern (esbuild + Assertions)
- Deutsche UI-Texte: **keine geraden Anführungszeichen in JSX-Attributen** —
  `"` beendet den String. `„…"` verwenden.
- Testdaten nach dem Prüfen aufräumen

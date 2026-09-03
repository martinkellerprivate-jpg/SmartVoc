# SmartVoc — App und Web

Einstieg für die Session, die an diesem Produkt arbeitet.

---

## Das Wichtigste: Dieses Projekt steht für sich allein

Es gibt einen **Web-Piloten** („Lilly-Anne's Vokabeltrainer"), von dem dieses
Projekt als Kopie gestartet ist. Damit endet die Beziehung.

- **Eigenes Repository.** Keine gemeinsame Git-Historie mit dem Piloten, kein
  Merge-Pfad. `git merge main` gibt es hier nicht.
- **Eigenes Supabase-Projekt.** Eigene Nutzertabelle, eigene Zugangsdaten. Die
  Konten des Piloten gelten hier **nicht** und umgekehrt.
- **Der Pilot wird nicht angefasst.** Er liegt in einem anderen Ordner, hat sein
  eigenes Repository und läuft unverändert weiter. Kein Grund, ihn zu öffnen,
  zu lesen oder zu verändern.

Wenn etwas in dieser Datei nach „geteilt mit dem Piloten" klingt, ist es ein
Überbleibsel und gehört korrigiert.

---

## Das Produkt: zwei Zugänge, eine Datenbasis

Das hier ist **keine reine App**. Es sind zwei gleichwertige Wege auf dieselben
Daten:

- **iOS-App** für den App Store, gebaut über Capacitor
- **Web-Version mit Login**, ausgeliefert über GitHub Pages

Beide sprechen **dasselbe Supabase-Projekt** an. Ein Konto, dieselben Wörter und
Lernstände auf dem Handy wie im Browser. Keiner der beiden Wege ist zweitrangig
— eine Änderung, die einen davon bricht, ist nicht fertig.

Technisch fällt das in `vite.config.ts` auseinander: `CAP_PLATFORM=ios` schaltet
zwischen den Zielen um. Details unter „Bauen und starten".

---

## Stand

| | |
|---|---|
| Repository | `martinkellerprivate-jpg/SmartVoc`, öffentlich, `main` gepusht |
| Web-Version | https://martinkellerprivate-jpg.github.io/SmartVoc/ — live, mit Anmeldung |
| Supabase | Projekt `wpwrqjyljgrmhamupspz`, `schema.sql` eingespielt, `.env.local` gesetzt |
| Xcode | 26.6, iOS 26.5 SDK + Simulatoren |
| Capacitor | 8.5, native Abhängigkeiten über SwiftPM (kein CocoaPods) |
| Bundle-ID | `ch.drkeller.smartvoc` — nach dem ersten Store-Eintrag fix |
| Produktname | **SmartVoc** (vorher „Smart Vocables") |
| Simulator | verifiziert auf iPhone 17 Pro, iOS 26.5 |
| Bundle-Grösse | **rund 650 kB** JS — war 1063 kB vor dem Abspecken |
| Umbau | alle acht Stufen der CR-Liste gebaut und geprüft |
| Oberflächensprache | Deutsch und Englisch, 265 Schlüssel |
| Native Bausteine | Preferences (Speicher), Haptics, Share |
| Apple-Account | kostenlos; 99 $/Jahr noch nicht gekauft |

**Warum das Repository öffentlich ist.** Pages aus einem privaten Repository
setzt einen bezahlten GitHub-Plan voraus, und ohne Pages gibt es keine
Web-Version. Zu verbergen ist ohnehin nichts: der Anon-Key steckt im
ausgelieferten JS und ist für jeden Web-Besucher lesbar, gleich ob das
Repository privat wäre. Geschützt wird über Row-Level-Security in Supabase —
siehe `schema.sql`, dort ist sie scharf gestellt (eigene Zeilen pro Nutzer,
`shared_lists` ohne SELECT-Policy, Lesen nur über die token-gebundene Funktion).
Das ist die Stelle, die zählt, und die bei jeder Schema-Änderung wieder zu
prüfen ist.

---

## Erledigt und nachgeprüft

Die Web-Version ist live und trägt die Anmeldung: das ausgelieferte Bündel
enthält die Supabase-Werte, und der Hash stimmt mit dem lokalen Build überein.
Die GitHub-Secrets sind gesetzt.

**Merke für später:** Secrets werden nur **beim Bauen** gelesen. Sie nachträglich
zu setzen ändert nichts an einem bereits gebauten Artefakt — es braucht einen
neuen Lauf (*Actions → Deploy web app to GitHub Pages → Run workflow*). Woran man
es erkennt: der Dateiname des Bündels in `index.html` ändert sich nicht.

Prüfbefehl:

```
JS=$(curl -sS https://martinkellerprivate-jpg.github.io/SmartVoc/ \
  | grep -oE '/SmartVoc/assets/index-[A-Za-z0-9_-]*\.js' | head -1)
curl -sS "https://martinkellerprivate-jpg.github.io$JS" | grep -c '<projekt-ref>'
```

## Noch zu bestätigen

- **Supabase → Authentication → URL Configuration**: Site URL und Redirect URL
  auf `https://martinkellerprivate-jpg.github.io/SmartVoc/`. Fehlt das, laufen
  Bestätigungs- und Reset-Mails ins Leere.
- **Confirm email** ist in einem frischen Projekt an. Für die Testphase unter
  *Authentication → Sign In / Providers → Email* abschalten — **vor dem Launch
  wieder ein**.

**Gate-Test bestanden.** Im Web angelegtes Wort erscheint nach der Anmeldung in
der App im Simulator. Ein Konto trägt beide Wege — das Fundament ist belegt.

Ungetestet bleibt der Passwort-Reset: beide Korrekturen sind ausgeliefert, aber
weder im Browser noch aus der App heraus einmal durchgespielt.

**Beim ersten Login wandern die lokalen Daten des Browsers hoch.** In welchem
Browser man sich registriert, entscheidet also, was im Konto landet. Für einen
leeren Start ein privates Fenster nehmen.

**Die Web-Version ist eine PWA.** Nach einem Deploy liefert der Service Worker
womöglich noch das alte Bündel aus — hart neu laden (⇧⌘R) oder privates Fenster,
sonst sieht man trotz grünem Deploy die alte Fassung.

---

## Was die App ist

React 18 + Vite + TypeScript, im Browser direkt und auf iOS in einer
Capacitor-Hülle. Die Lernlogik liegt in reinem, framework-freiem TypeScript und
ist mit Node-Tests abgesichert:

- `src/lib/fsrs.ts` — Gedächtnismodell (ts-fsrs), 5 Stufen, CFG-Parameter
- `src/lib/runqueue.ts` — eine Queue für alle Einstiege (gewichtete Töpfe,
  Debt-Bonus, Anti-Wiederholung, Endspiel-Kippen)
- `src/lib/scoring.ts` + `src/lib/latin.ts` — Bewertung: Artikel,
  ss-Schreibweise, Längenstriche, Teilpunkte
- `src/lib/engine.ts` — Scope-Auflösung, Prognosen

Diese Logik bleibt TypeScript. Sie nativ nachzubauen hiesse, dieselben Regeln
in zwei Sprachen dauerhaft synchron zu halten — und würde ausserdem die
Web-Version abhängen.

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
- Haptisches Feedback
- Teilen über das System-Share-Sheet
- Später: Texterkennung über Apple Vision als Tesseract-Ersatz

**Die Sprachausgabe ist gestrichen** (Entscheid: Lautsprecher und Vorlesen raus,
die Lautschrift als Feld bleibt). Sie war bisher das erste 4.2-Argument; damit
ruht die Begründung auf Haptik, System-Teilen und später Apple Vision. Wird das
zu dünn, ist Apple Vision der stärkste Nachzügler — es ist echte Gerätefunktion,
nicht nur eine Hülle um Web-Technik.

Diese Zusätze müssen **zusätzlich** sein, nicht ersetzend: die Web-Version darf
dabei nicht verlieren, was sie heute kann. Der übliche Weg ist eine dünne
Fallunterscheidung an der einen Stelle, die die Fähigkeit kapselt — so wie
`src/ui/speak.ts` es für die Sprachausgabe schon vorzeichnet.

---

## Nächste Schritte

Der Umbau aus der Entwurfsrunde ist **gebaut** — alle acht Stufen, geprüft im
Browser und im Simulator. Was jetzt noch aussteht, steht in `CR-LISTE.md` und
ist kurz:

1. **Konto löschen prüfen** (CR-51). Testkonto anlegen und löschen. Ob
   `delete_account()` aus `auth.users` löschen darf, lässt sich ohne Anmeldung
   nicht feststellen — und Apple verlangt eine funktionierende Löschung.
2. **„Confirm email" wieder ein** (CR-53), in Supabase unter
   *Authentication → Sign In / Providers → Email*, bevor die App öffentlich wird.
3. **Englische Texte gegenlesen.** `src/lib/i18n.en.ts` für die Oberfläche,
   `src/components/help.en.tsx` für Anleitung, Lerntipps und Lerntheorie.
4. Store-Material, bezahlte Mitgliedschaft, TestFlight.
5. Erst danach: Anmeldung über Apple und Google, beide zusammen und auf beiden
   Wegen (siehe „Bekannte Punkte" — Apple setzt die Mitgliedschaft voraus).

---

## Wie die App gebaut ist

Wer hier neu einsteigt, sollte fünf Entscheide kennen. Sie erklären das meiste.

**Eine Wortliste, kein zweiter Begriff.** Früher gab es „Listen" (Mitgliedschaft
am Wort über `w.lists`) und „Lektionen" (feste Mitgliederliste, Zieldatum,
Prognose) — zwei Datenmodelle für dieselbe Sache. Seit Migration V16
(`migrate.ts`) gibt es nur die Wortliste; Mitgliedschaft steht immer am Wort.
Wer eine „Lektion" im Code findet, hat ein Überbleibsel gefunden.

**Eine Kennzahl für „wie weit ist das?".** `readiness.ts` rechnet den
Bereitschaftswert an genau einer Stelle. Kalenderampel, Listenkopf und Statistik
lesen dieselbe Zahl — sie können nicht auseinanderlaufen. Ebenso die fünf
Stufen: `deriveProfile` ist die einzige Quelle, `MasteryBar` die einzige
Darstellung.

**Richtung und Sprache gehören an die Karte, nicht an die Runde.** Deshalb
funktionieren „Gemischt" und das gemeinsame Üben mehrerer Sprachen. Der Wähler
oben zeigt die Einstellung, die Karte immer ihre eigene Richtung.

**Die Karte passt sich an, statt zu scrollen.** `Practice.tsx` verkleinert den
Inhalt in Stufen (`--fit`), und reicht die kleinste Stufe nicht, wächst die
Karte über ihr 8:5 hinaus. Ein Balken auf der Karte ist der letzte Ausweg, nicht
der erste.

**Der deutsche Text ist der Übersetzungsschlüssel.** `txt("Übungsplan")` — kein
erfundener Schlüssel, weil man im Code sehen soll, was auf dem Bildschirm steht.
Fehlt eine Übersetzung, erscheint Deutsch. Die Funktion heisst `txt` und nicht
`t`, weil `t` an einem Dutzend Stellen eine Laufvariable ist.

Die längeren Hilfetexte sind **nicht** in der Wörterliste, sondern als zwei
vollständige Fassungen in `help.de.tsx` und `help.en.tsx`. Prosa mit
Hervorhebungen lässt sich nicht satzweise übersetzen, ohne Bruchstücke zu
erzeugen — ein erster maschineller Versuch hat genau das getan.

---

## Bauen und starten

Ein Quellbaum, zwei Ziele. `CAP_PLATFORM=ios` schaltet in `vite.config.ts` um:

| Befehl | Ziel | base | Service Worker |
|---|---|---|---|
| `npm run build` | `dist/` | `/SmartVoc/` | ja |
| `npm run build:ios` | `dist-ios/` | `/` | nein |

Getrennte Ordner, damit ein Web-Deploy nie ein iOS-Bündel mitnimmt. `base` muss
**exakt** dem Repo-Namen entsprechen, Grossschreibung eingeschlossen —
Pages-Pfade unterscheiden Gross- und Kleinschreibung, sonst kommt eine leere
Seite. Auf iOS entfällt der Service Worker bewusst: dort *ist* das Bündel die
App, eine zweite Offline-Schicht würde nach einem Update nur veraltete Dateien
ausliefern.

```
npm run ios          # build:ios + npx cap sync ios
npm run ios:open     # Projekt in Xcode öffnen
```

Der Web-Deploy läuft über `.github/workflows/deploy.yml` bei jedem Push auf
`main`. Pages-Quelle steht auf **GitHub Actions** (nicht „Deploy from a branch").

Ohne Xcode-Oberfläche:

```
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug \
  -sdk iphonesimulator -destination "id=<UDID>" \
  -onlyUsePackageVersionsFromResolvedFile \
  CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO build

xcrun simctl install <UDID> <DerivedData>/Build/Products/Debug-iphonesimulator/App.app
xcrun simctl launch  <UDID> ch.drkeller.smartvoc
```

`CODE_SIGNING_ALLOWED=NO`: für den Simulator braucht es keine Mitgliedschaft.

### Stolperstelle beim ersten Bauen

Capacitor holt `Capacitor.xcframework` als Binär-Artefakt von GitHub und fragt
davor den **Schlüsselbund** — das löst einen Systemdialog aus. Läuft `xcodebuild`
im Hintergrund, sieht den niemand: der Build steht dann ohne Ausgabe still, in
`waitForRemoteSourcePackagesToFinishLoading`. Einmal vorher ohne Schlüsselbund
auflösen:

```
cd ios/App/CapApp-SPM && swift package resolve --disable-keychain --disable-netrc
```

Danach läuft der Build in rund 13 Sekunden durch. Diagnose im Wiederholungsfall:
läuft `SecurityAgent`, steht ein Dialog.

---

## Bekannte Punkte

**Anmeldung über Google und Apple — gewollt, aber erst nach der Mitgliedschaft.**
Heute kennt der Code nur E-Mail/Passwort (`signInWithPassword`, `signUp` in
`src/sync/auth.tsx`); OAuth kommt darin gar nicht vor. Beides nachzurüsten hängt
an vier Dingen:

- **Apple** setzt die bezahlte Mitgliedschaft voraus (App ID, Services ID,
  Schlüssel). Solange die 99 $/Jahr nicht gekauft sind, geht es nicht.
- **Google** braucht einen OAuth-Client in der Google Cloud Console und die
  Redirect-URI `https://<projekt>.supabase.co/auth/v1/callback`.
- **In der App ist es die eigentliche Arbeit.** Google verbietet OAuth in
  eingebetteten Webviews, der Standardfluss von Supabase greift dort also nicht.
  Nötig ist ein nativer Weg über `ASWebAuthenticationSession` und ein eigenes
  URL-Schema, das zurück in die App führt. Im Web sind beide dagegen billig.
- **Richtlinie 4.8** verlangt: wer einen Fremd-Login wie Google anbietet, muss
  auch „Sign in with Apple" anbieten. Google allein fällt durch.

**Nicht halb machen.** Ein Anbieter nur im Web freigeschaltet erzeugt Konten,
die sich in der App nicht anmelden können. Beide Wege müssen dieselben Anbieter
kennen — also Apple und Google zusammen, Web und App im selben Zug, sobald die
Mitgliedschaft da ist. Bis dahin trägt E-Mail/Passwort beide Wege.

**Passwort-Reset — erledigt, mit zwei Fallstricken, die man kennen sollte.**

*Im Browser* zeigte die App das Formular für das neue Passwort nicht an, obwohl
sie richtig verdrahtet war. Ursache war ein Wettlauf beim Start: `createClient()`
läuft beim Import des Moduls, liest den Token aus dem Adress-Fragment, **löscht
das Fragment** und meldet `PASSWORD_RECOVERY` an die dann vorhandenen Zuhörer.
React hängt sich erst beim Mounten ein, und späteren Zuhörern wird nur
`INITIAL_SESSION` nachgereicht — das Ereignis wird nie wiederholt. Gelöst über
`cameFromRecoveryLink` in `src/lib/supabase.ts`: der Marker wird gelesen, **bevor**
der Client entsteht. Wer je etwas an dieser Datei umsortiert, muss die Reihenfolge
erhalten.

Abgedeckt ist nur der implizite Fluss (der Standard der Bibliothek). Ein PKCE-
oder `token_hash`-Link bräuchte `verifyOtp()`; ihn bloss zu erkennen würde das
Formular ohne brauchbare Sitzung zeigen.

*In der App* baute `resetPassword()` den Rücksprung aus `window.location.origin`
— dort `capacitor://localhost/`, ein Schema, das kein Mailprogramm öffnen kann.
Die App schickt jetzt auf die Web-Version, konfiguriert über **`VITE_WEB_URL`**
(siehe `.env.example`). Beide Wege teilen dasselbe Supabase-Projekt, also gibt
der Reset im Browser das Konto auch für die App frei. Kein Universal Link, keine
Associated Domains, keine bezahlte Mitgliedschaft.

Ohne `VITE_WEB_URL` verschickt die App **keinen** Link, sondern sagt es —
ein stiller Rückfall auf `origin` hätte eine tote Mail erzeugt, die aussieht,
als hätte es geklappt. Die Adresse muss ausserdem in Supabase unter
*Authentication → URL Configuration* eingetragen sein.

**Konto löschen.** `delete_account()` in `schema.sql` löscht auch aus
`auth.users`. Ob der Funktions-Eigentümer dort Rechte hat, ist ungetestet —
`schema.sql` beschreibt am Ende den Ausweichweg über eine Edge Function. Vor dem
Store-Eintrag prüfen; Apple verlangt eine funktionierende Konto-Löschung.

**Lokaler Speicher.** Heute `localStorage` über `src/lib/storage.ts`
(`LS`, `load`, `save`). iOS darf WKWebView-Speicher bei Knappheit löschen — für
die App auf nativen Speicher umstellen. Alles läuft durch diese eine Datei, das
Innenleben lässt sich austauschen, ohne die Web-Version anzufassen.

**Kostenloser Apple-Account kann nicht:** TestFlight, Associated Domains, Push.
Installationen laufen nach 7 Tagen ab. Für Simulator und eigenes Gerät reicht er.

**Ordner liegt in OneDrive.** Der Ordner ist während der Einrichtung zweimal
mitten in der Arbeit verschwunden, weil OneDrive neu gestartet hat — beim
zweiten Mal war er erst nach einem Neustart der Claude-Code-Sitzung wieder
lesbar. Xcode-Projekte und `node_modules` vertragen sich schlecht mit
Cloud-Sync. Ein Umzug nach z. B. `~/Developer/SmartVoc` wäre empfehlenswert; die
Sicherung übernimmt jetzt GitHub.

---

## Arbeitsweise

- Nach jeder Änderung **beide** Builds — `npm run build` und `npm run build:ios`
- Verhalten tatsächlich prüfen: Simulator-Screenshot für die App, Browser für
  das Web. Nicht nur den Code lesen.
- Reine Logik mit kleinen Node-Tests absichern (esbuild + Assertions)
- Deutsche UI-Texte: **keine geraden Anführungszeichen in JSX-Attributen** —
  `"` beendet den String. `„…"` verwenden.
- Testdaten nach dem Prüfen aufräumen

---

## Noch zu tun in Supabase: das alte Antwort-Protokoll löschen

Bis zum 3. September schrieb die App bei jeder bewerteten Antwort einen
Eintrag mit Wort, Zeitpunkt, Bewertung und Kartenzustand — als Vorbereitung
für eine Anpassung der Modell-Parameter, die es in V1 nicht geben wird.

In der App ist das erledigt: der Schreiber ist entfernt, `reviews` fällt aus
der Synchronisierung, und beim Start räumt `entferneAltesProtokoll()` den
lokalen Speicher auf — auf dem Gerät wie im nativen Speicher.

**Was von hier aus niemand löschen kann, ist die Kopie in der Cloud.** Wer
sich angemeldet hat, hat einen Datensatz mit `doc = 'reviews'` in Supabase
liegen. Der wird jetzt weder gelesen noch überschrieben, aber er ist da.
Vor dem Launch löschen:

```sql
delete from user_documents where doc_key = 'reviews';
```

Danach erhebt und
speichert die App nichts mehr über das Lernverhalten hinaus, was für die
Planung der Wiederholungen nötig ist.

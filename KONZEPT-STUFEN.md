# Stufen, Konto und Käufe — Konzeption

Stand: 4. September 2026. Entschieden und in den Grundzügen verdrahtet.

## 1. Der Grundfehler, den wir vermeiden

„Gratis / Pro / gekauft" und „mit Konto / ohne Konto" sind **zwei Achsen, nicht
eine**. Wer sie vermischt, baut sich einen Zwang ein, den es nicht braucht:

|                    | **ohne Konto**                        | **mit Konto**                              |
|--------------------|---------------------------------------|--------------------------------------------|
| **Gratis**         | läuft auf diesem Gerät                | dazu: Sync, geteilte Listen empfangen       |
| **Pro**            | läuft auf diesem Gerät, ohne Grenzen  | dazu: Sync, teilen, auf allen Geräten       |
| **Gekauftes**      | gehört der Apple-ID, gilt auf diesem Gerät | gehört dem Konto, gilt überall         |

Ein Konto ist also nie Voraussetzung, sondern immer ein **Zugewinn**: es hebt
die Bindung an ein Gerät auf. Das ist auch die einzige ehrliche Begründung, mit
der man Leute zum Anmelden bringt.

## 2. Die drei Stufen

### a) Gratis — „reicht für eine Prüfung"

* **Konto:** fakultativ.
* **Umfang je Sprache:** der mitgelieferte Grundwortschatz **plus eine eigene
  Wortliste mit höchstens 40 Wörtern**.
* **Nicht dabei:** Listen teilen, Listen übernehmen, mehrere eigene Listen.
* **Voll dabei:** Üben in allen Formen, Übungsplan, Statistik, Aussehen, alle
  Einstellungen.

Zwei Entscheide, die dahinterstehen:

**Der Grundwortschatz zählt nicht gegen die Grenze.** Er ist mitgeliefert, nicht
selbst gemacht. Zählte er mit, wäre die App beim ersten Start sofort voll und
damit unbrauchbar — der schlechteste erste Eindruck, den man haben kann.

**Beschränkt wird die Menge, nicht die Einsicht.** Statistik und Übungsplan
bleiben vollständig. Eine App, die einem die Zahlen wegnimmt, wirkt kaputt, nicht
sparsam — und gerade die Statistik ist das Argument fürs Bezahlen.

### b) Pro — „für das ganze Schuljahr"

* **Konto:** fakultativ.
* Hebt alle Mengengrenzen auf: beliebig viele Listen, beliebig viele Wörter.
* Schaltet **Listen teilen und übernehmen** frei.
* **Empfehlung: einmaliger Kauf, kein Abo.** Die Zielgruppe sind Schülerinnen
  und Schüler; wiederkehrende Abbuchungen bei Minderjährigen sind eine Hürde bei
  den Eltern und eine Quelle von Rückerstattungen. Ein Abo lohnt sich erst, wenn
  laufend Inhalte dazukommen — dann verkauft man die Inhalte, nicht die App.

**Wichtig:** „Teilen" braucht technisch einen Server, also ein Konto. Das ist
keine Geschäftsentscheidung, sondern eine Tatsache. Pro ohne Konto hebt die
Mengengrenzen auf, aber nicht die Gerätebindung.

### c) Käufe — Inhalte und Module

* **Wortlisten** (Verlagslisten, Prüfungspakete): einmaliger Kauf je Paket.
* **KI-Modul** zum Einlesen: verbraucht laufend fremde Rechenleistung, also
  entweder Guthaben (verbrauchbar) oder ein eigenes kleines Abo.
* **Konto:** nicht nötig zum Kaufen. Nötig, damit der Kauf auf einem zweiten
  Gerät oder im Web gilt.

## 3. Wie ein Kauf plattformunabhängig wird

**Das Problem in einem Satz:** Ein Kauf im App Store gehört der **Apple-ID**,
nicht unserem Konto. Apple sagt uns nur „dieser Apple-ID gehört Produkt X" und
verrät nie, wer dahintersteht.

**Die Lösung** ist überall dieselbe und heisst *server-side entitlements*:

1. Kauf in der App über **StoreKit 2**.
2. Die App erhält von Apple eine **signierte Transaktion**.
3. Die App schickt sie an **unseren Server** (Supabase Edge Function) — mit der
   Nutzer-ID, **falls** jemand angemeldet ist.
4. Der Server prüft die Signatur bei Apple und schreibt eine Zeile in
   `entitlements`: wem gehört was, woher kam es (`apple` / `stripe` / `google`),
   und die `original_transaction_id`.
5. Ab da ist die Berechtigung **kontogebunden** und gilt auf jedem Gerät und im
   Web. Die App fragt nur noch: „was gehört mir?" — sie entscheidet nichts selbst.

**Kauf ohne Konto** funktioniert trotzdem: die Berechtigung lebt dann nur lokal,
weil StoreKit sie auf dem Gerät kennt. Meldet sich der Mensch später an, liest
die App ihre laufenden Transaktionen aus StoreKit und schickt sie mit der neuen
Nutzer-ID an den Server. Der Kauf wandert ans Konto. Das ist der Normalfall,
nicht der Sonderfall.

**Die Gegenrichtung** — im Web mit Stripe gekauft, in iOS benutzt — ist dieselbe
Tabelle. Aber: Richtlinie **3.1.3(b)** verlangt, dass dieselben Artikel **auch**
als App-Kauf in der App angeboten werden. Man darf im Web verkaufen; man darf
nicht *nur* im Web verkaufen.

**Der Fallstrick:** Derselbe Kauf darf nicht an zwei Konten hängen. Eine
Berechtigung ist immer an genau eine `original_transaction_id` gebunden; hängt
man sie an ein zweites Konto, muss sie vom ersten gelöst werden. Apple erwartet
das ausdrücklich.

**Selbst bauen oder RevenueCat?** Bei rein einmaligen Käufen selbst bauen —
StoreKit 2 plus eine Edge Function, und es gibt keinen Lebenszyklus zu pflegen.
Sobald ein Abo dazukommt (Verlängerung, Kulanzfrist, Rückerstattung,
Familienfreigabe), wird das schnell mehr Arbeit als es wert ist; dann RevenueCat.

## 4. Wo die Trennung iOS / Web verläuft

| | **iOS-App** | **Web** |
|---|---|---|
| Üben, Listen, Statistik | ✅ alles | ✅ alles |
| Registrieren, anmelden | ✅ | ✅ |
| Kaufen | ✅ über App-Kauf (Pflicht) | ✅ über Stripe |
| Passwort ändern, Rechnungen, Abo kündigen | Verweis ins Web | ✅ |
| Konto löschen | ✅ **Pflicht in der App** | ✅ |

Der Verweis ins Web darf ausserhalb der USA **keine Preise nennen und nicht zum
Kauf auffordern** — sonst greift 3.1.3.

## 5. Was daraus folgt, bevor wir bauen

1. **Eine Berechtigungsquelle.** Eine Funktion `hatRecht(was)` — mehr fragt die
   Oberfläche nie. Sie liest aus einer lokalen Kopie, die aus drei Quellen
   gespeist wird: mitgeliefert, StoreKit, Server.
2. **Grenzen an einer Stelle.** `GRENZEN.gratis = { listenJeSprache: 1,
   woerterJeListe: 40 }` — nicht verstreut in der Oberfläche.
3. **Die Grenze erklärt sich, wo sie greift**, nicht in einer Preisliste: „Diese
   Liste fasst in der Gratis-Fassung 40 Wörter." Mit dem Weg zum Kauf daneben.
4. **Kein Rückbau.** Wer Pro hatte und es verliert (Rückerstattung), verliert
   keine Wörter. Die App zeigt sie weiter, verbietet nur Neues.


---

# Was wann kommt

## Entschieden

| | |
|---|---|
| **Plattformen** | Web-App und iOS. Andere Mobilplattformen laufen über die Web-App — **kein Google Play, kein anderer App Store.** |
| **Anmeldung V1** | Sign in with Apple **oder** eigenes Konto (E-Mail + Passwort). |
| **Anmeldung V2** | Google und weitere kommen dazu. |
| **Stufen** | Gratis und Pro. Pro ist ein **einmaliger Kauf**, kein Abo. |
| **Kaufen** | **V2.** Idealerweise über Web-Konto *und* über iOS; die pragmatische Lösung schlägt die vollständige. |
| **Gekaufte Inhalte, KI-Modul** | V3. |

### Weiteres für V2 vorgemerkt

* **Wortlisten exportieren in mehrere Formate**, nicht nur Excel — auch PDF (zum
  Ausdrucken und Abfragen auf Papier).
* **Bilddateien für Symbole** in organischem Stil.
* **Google-Anmeldung** und weitere Anmeldedienste.

## V1 — was jetzt gebaut wird

* Anmeldung fakultativ, wie bisher. Dazu **Sign in with Apple**.
* **Keine Mengengrenzen.** Es gibt keinen Weg, Pro zu kaufen — eine Grenze wäre
  eine Sackgasse und würde nur Leute vertreiben.
* Aber: der **Anspruch wird gestempelt** (siehe unten). Ohne das gibt es in V2
  niemanden, dessen Besitzstand man wahren könnte.

## Die Weichen, die jetzt richtig stehen müssen

Vier Dinge, die später sehr teuer wären. Drei davon waren schon in Ordnung, die
vierte ist neu.

**1. Alles hängt an der Nutzer-Kennung, nichts an der E-Mail.** ✅ war schon so.
Synchronisation, geteilte Listen und Dokumente sind auf `uid` verschlüsselt; die
E-Mail-Adresse wird nur angezeigt. Das ist die Voraussetzung für Sign in with
Apple, denn Apple liefert oft eine Wegwerf-Adresse
(`…@privaterelay.appleid.com`) und der Mensch kann sie jederzeit ändern.

**2. Lokal zuerst, Konto später.** ✅ war schon so. Wer ohne Konto beginnt und
sich später anmeldet, nimmt seine Wörter mit. Genau derselbe Weg trägt später
einen Kauf ans Konto.

**3. Ein Wort gehört in genau eine Liste.** ✅ seit V18. Wäre das offen
geblieben, liesse sich eine gekaufte Liste nicht sauber von einer eigenen
trennen — und „diese Liste gehört dir nicht, du hast sie gekauft" wäre nicht
darstellbar.

**4. Der Anspruch wird aufgeschrieben, nicht ausgerechnet.** ⬅ **neu**, in
`src/lib/plan.ts` und als Migration V19.

```
settings.plan        "gratis" | "pro"     was gilt
settings.planQuelle  woher er kommt       bestandsschutz | v1 | apple | web | geschenk
settings.planSeit    seit wann
```

Beim ersten Start wird gestempelt und danach **nie von selbst geändert**. Wer
schon Wörter auf dem Gerät hat, bekommt `bestandsschutz`; eine frische
Installation bekommt `v1`. Beide stehen heute auf `pro`.

Damit kann V2 die Voreinstellung für **neue** Installationen auf `gratis`
setzen, ohne irgendjemanden anzufassen, der schon einen Stempel trägt. Das ist
der ganze Trick, und er kostet heute nichts.

Die Oberfläche fragt nie `settings.plan`. Sie fragt `darf(...)` oder
`grenze(...)`. Wechselt V2 die Quelle — von den Einstellungen auf eine
Berechtigungstabelle vom Server —, ändert sich genau diese eine Datei.

## Zwei Dinge, die in V2 zu beachten sind

**Der Plan reist heute mit den Einstellungen in die Cloud.** Das ist erwünscht
(auf dem zweiten Gerät gilt derselbe Anspruch), aber die Synchronisation
entscheidet Konflikte nach „zuletzt geschrieben gewinnt". Sobald echtes Geld im
Spiel ist, gehört der Anspruch in eine eigene Tabelle, die nur der Server
schreibt. `plan.ts` ist genau die Stelle, an der das umgehängt wird.

**Ein Kauf gehört der Apple-ID, nicht dem Konto.** Deshalb muss die
Berechtigungstabelle die `original_transaction_id` führen und darf denselben
Kauf nie an zwei Konten hängen. Siehe Abschnitt 3 oben.

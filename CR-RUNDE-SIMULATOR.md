# CR-Runde am Simulator — offen, wird gesammelt

Stand: erste Umsetzungsrunde ist gemacht und im Simulator gesehen.

**Umgesetzt:** S-01 Legende statt Prozentzahl · S-02 Suche in der Liste ·
S-03 Umbenennen-Pille statt zweitem Zahnrad, Löschen unter der Liste mit
Bestätigung · S-04 und S-08 Wort und Mehrere oben · S-05 Teilen ·
S-06 schlanke Zeilen, Farbe als Streifen links · S-07 Auswahl mit Tintenrand,
Bearbeiten und Löschen ausgegraut bis zur Auswahl, Bearbeiten nur bei einem ·
S-09 Tabellenkopf FR/DE · S-10 Kopf fixiert, nur die Liste rollt ·
S-12 eine Liste je Wort (Migration V18) · S-13 Liste üben weg ·
S-14 kleiner Statistik-Link · S-15 eine Kopfzeile app-weit mit rundem
Zurück-Knopf · S-21 Tintenrand statt Rost, dazu 13 weitere Rost-Hover
app-weit korrigiert.

**Noch offen:** S-11 Look and Feel im Ganzen · S-16 und S-22 Einfügen und die
leere Liste · S-17 Beispieltext · S-18 und S-19 Formular und Lernstand-Block ·
S-20 Neue Liste vereinfachen.

**Nachtrag vom Nutzer:** Smart Lists sind nur zum Ansehen, kein Ändern und
kein Löschen. Umgesetzt.

**Eigener Befund unterwegs:** Text in einem button bekommt auf iOS die
Systemfarbe, die Fremdwörter erschienen blau wie Verweise. App-weit behoben,
damit es an der nächsten Stelle nicht wieder passiert.

| Nr | Bereich | CR |
|---|---|---|
| S-01 | Wortlisten · Übersicht | Die Prozentzahl an der Listenzeile („49 %") ist unklar — gemeint ist der Anteil, der sitzt oder fast sitzt, aber das steht nirgends. **Weglassen.** Stattdessen unter der letzten Liste eine kurze Farblegende. |
| S-02 | Wortlisten | Die Suche muss auf beiden Ebenen wirken: in der Übersicht über alle Wörter der Sprache (ist da), **und innerhalb einer geöffneten Liste** (fehlt). |
| S-03 | Wortlisten · Liste | Zwei Zahnräder auf einem Bildschirm (App-Kopf und Listenkopf) sind nicht logisch. Stattdessen: **ein Edit-Knopf**, dazu ein **Löschknopf unter oder neben der Liste**. Löschen mit Bestätigungsdialog. |
| S-04 | Wortlisten · Liste | Das Hinzufügen eines Wortes gehört **nach oben**, über die Liste — nicht an ihr Ende. |
| S-05 | Wortlisten · Liste | Die **Option zum Teilen fehlt**. |
| S-06 | Wortlisten · Liste | Pro Wort stehen hier detaillierte Statistiken — und anders dargestellt als in der Statistik. **Liste schlank und aufgeräumt halten.** Stattdessen: die Kästen der Wörter **in der Farbe des Balkens** oben hinterlegen. |
| S-07 | Wortlisten · Liste | Viel stärker **als Liste** darstellen: links oder über der Liste einzeln **oder mehrfach auswählen**; dann erscheint ein Lösch- und/oder Edit-Knopf. Achtung, Rückfrage für später: widerspricht dem früheren Punkt, Mehrfachauswahl mache keinen Sinn. |
| S-08 | Wortlisten · Liste | Das Einfügen sinnvoll platzieren. |
| S-09 | Wortlisten · Liste | **Tabellenüberschriften** einführen: DE, FR (bzw. die jeweilige Sprache). |
| S-10 | Wortlisten · Liste | **Fortschrittsbalken und alles darüber fixieren** — gescrollt wird nur die Liste. Die Tabellenüberschrift ebenfalls fixieren. |
| S-11 | Wortlisten · Liste | Der Bildschirm wirkt insgesamt **unausgewogen**. Näher an Look and Feel des Entwurfs von gestern halten. |
| S-12 | Wortlisten · Wort bearbeiten | Die **Zuordnung zu Listen wegnehmen** — jedes Wort ist einer Liste zugeordnet. Achtung, Rückfrage für später: das Datenmodell erlaubt heute mehrere Listen je Wort (`w.lists`), und die Hilfe sagt es ausdrücklich. Eine Liste je Wort ist eine Modelländerung mit Folgen (Migration, Text in der Hilfe, Import). |
| S-13 | Wortlisten · Liste | Den Knopf „Liste üben“ **herausnehmen** — er gehört nicht auf diesen Bildschirm. |
| S-14 | Wortlisten · Liste | Der **Statistik-Link gehört nach oben**: rechts oben oder unter den Fortschrittsbalken. Aber **klein**, so dass er nicht stört. |
| S-15 | **Ganze App** | Kopfzeile nach dem Entwurf: der **Zurück-Pfeil als kleiner runder Knopf** mit dem Bildschirmtitel daneben — deutlich schöner als im Simulator. Und **„SmartVoc“ muss nicht auf jedem Bildschirm oben stehen**. Durchgängig in allen Bereichen umzusetzen, ohne weiteres Feedback je Bereich. |
| S-16 | Wortlisten · Einfügen | Diesen Dialog **vereinfachen: nur die Eingabemaske für ein einzelnes Wort** — dieselbe Maske wie unter Bearbeiten. Achtung, Rückfrage für später: damit fällt der Weg für viele Wörter auf einmal weg; der Entwurf führt „Einfügen“ ausdrücklich als Ersatz für den Foto-Scan. |
| S-17 | Wortlisten · Einfügen | *(mein Befund im gleichen Bild)* Das Beispiel im Textfeld zeigt **englische Wörter in einer französischen Liste** („dog \| der Hund“) und eine Spalte **„Topic“**, die es seit V16 nicht mehr gibt. |
| S-18 | Wortlisten · Wort hinzufügen / bearbeiten | Die **Ansicht aus dem Entwurf** übernehmen (Zeilen mit Feldname links, Inhalt rechts, „optional“ darunter) statt des heutigen Stapels leerer Eingabefelder. |
| S-19 | Wort-Detail · Lernstand | Den **Lernstand-Block ausnahmsweise mit übernehmen** — aber er muss **derselbe Block sein wie in der Statistik**, wenn dort ein einzelnes Wort angesehen wird. Beide Seiten sinnvoll aneinander angleichen; die Form wähle ich. |
| S-20 | Wortlisten · Neue Liste | **Vereinfachen:** die zwei Wahlzeilen weg, einfach ein Datumsfeld. Wird keines gewählt, gibt es keines — es ist ja optional. Ein bestehendes Datum lässt sich über einen Knopf (Papierkorb) wieder entfernen. |
| S-21 | Wortlisten · Neue Liste | *(mein Befund im gleichen Bild)* Die gewählte Zeile trägt einen **rostroten Rahmen**. Nach der Farbregel bekommt eine Wahl einen **Tintenrand**, niemals eine Farbe — Rostrot ist den Handlungen vorbehalten. |
| S-22 | Wortlisten · leere Liste | Diese Sicht **überdenken**. Für iOS soll sie die Wege zum Füllen anbieten: **öffentliche Liste importieren** · **KI-Prompt für den Listenscan erstellen** · **Eingabefenster zum Kopieren/Einfügen von Listen** · **einzelne Wörter eingeben** — letzteres mit **derselben Maske**, die es fürs Hinzufügen/Bearbeiten schon gibt. |
| — | *Bezug* | S-22 hält den Weg für viele Wörter ausdrücklich am Leben. Zusammen mit S-16 heisst das vermutlich: die Pille im Listenkopf wird zur Einzeleingabe, und der Sammelweg lebt in der leeren Liste (und/oder an einer eigenen Stelle). Beim Umsetzen zu klären. |
| S-23 | Übungsplan · Listenzeile | Der Üben-Knopf war ein handbreiter schwarzer Klotz mit nur einem Zeichen darin, daneben ein rahmenloses Symbol. Ursache: eine feste Breite von 38 px stritt mit der Handy-Regel, die beide Knöpfe die Zeile füllen lässt. **Beide jetzt beschriftet**, der zweite mit Rahmen. |
| S-24 | Übungsplan · Rüstzeile | Links ein Quader (Kalender/Liste), rechts eine Pille (Alle Sprachen) — zwei Formen für dieselbe Sache. **Beide jetzt Pillenform.** |
| S-25 | Ganze App · Kopfzeile | Hilfe und Einstellungen waren abgerundete Quadrate, der neue Zurück-Knopf rund — drei Knöpfe, zwei Formen. Dazu sass das Fragezeichen in einem eigenen Kreis IM Knopf, also zwei Rahmen ineinander. **Jetzt ein runder Kopfknopf für alle drei**, das Fragezeichen blank wie im Entwurf. |
| S-26 | Üben · Vollbild | Die drei Pillen (Sprache, Richtung, Umfang) **im Vollbild ausblenden** — sie stören beim Lernen. Es sind Entscheidungen vor der Runde, nicht während. |
| S-27 | Üben · Vollbild | **Formularelemente wie im Entwurf:** Eingabefeld und ein runder Pfeilknopf statt des breiten „Prüfen“. Ausserhalb des Vollbilds bleibt die Beschriftung. |
| — | *Nachtrag* | Fortschrittsanzeige und farbiger Verteilungsbalken bleiben — vom Nutzer ausdrücklich als sinnvoll bestätigt. |
| S-28 | Üben · Durchblättern | Beim Durchblättern soll auch der **farbige Verteilungsbalken nicht erscheinen** — gleiche Behandlung wie der Fortschrittsbalken, der dort schon durch den Hinweis ersetzt ist. |
| S-29 | Üben · Durchblättern | Der Modus soll **expliziter „Nur durchblättern“** heissen, und das Zeichen war irreführend — es war das Karten-Zeichen, also dasselbe wie „Üben“. Vorschlag Palmeninsel. **Umgesetzt mit einem Auge**: „nur anschauen“ liest man daran sofort, und eine Palme wäre bei 14 Pixeln ein Fleck. Der Gedanke steckt jetzt im Namen. |
| S-30 | Üben · Durchblättern | Der Modus darf **für gar nichts zählen**, auch nicht in der Statistik. **Geprüft, war schon so:** `pendingGrades` überspringt durchgeblätterte Wörter, `deriveRating` gibt für diesen Modus „no-grade“, und `recordAttempt` ist dort nicht erreichbar. Es entsteht kein Verlaufseintrag, also erscheint es auch in keiner Auswertung. |
| S-31 | Üben · Karte | Die Karte soll eine **echte Karteikarte** sein: eine Seite, eine Sprache. Die Rückseite zeigte die Lösung **und darunter nochmals die Frage**. Ausserdem stand „Tippe auf die Karte“ im selben Inhaltsbereich wie die Sprachelemente — die Anleitung gehört dort nicht hin und **braucht es gar nicht**. Beides entfernt. |
| S-32 | Üben · Selbstkontrolle | Die Knöpfe waren **nicht lesbar**: zwei Regelsätze für dieselben Knöpfe hoben sich auf — der zweite setzte die Schrift auf Dunkelgrün und liess den grünen Grund stehen, also grün auf grün. Dazu brach „Das sitzt noch nicht so gut“ auf zwei Zeilen. **Jetzt „Richtig“ und „Falsch“**, gefüllt mit weisser Schrift. |
| S-33 | Üben · Karte | Das Urteil („NICHT GANZ“) stand **in** der Karte. Es gehört **darüber** und **deutlich**: Farbe und Zeichen. Umgesetzt als farbige Pille über der Karte mit Haken bzw. Kreuz — Farbe allein reicht nicht, wer Grün und Rot nicht unterscheidet, liest sonst nichts. |
| S-34 | Ganze App · Fokus | *(mein Befund)* Ein angetippter Knopf behielt den Fokusring des Systems — beim Zahnrad in der Kopfzeile nicht von einem aktiven Zustand zu unterscheiden. Jetzt `:focus-visible`: Ring nur bei Tastatur und Hilfstechnik, nicht beim Finger. Ihn ganz zu entfernen wäre die bequeme und falsche Antwort — ohne ihn ist die App per Tastatur nicht bedienbar. |
| S-35 | Ganze App · Kopfzeile | **Das Zahnrad war am rechten Rand abgeschnitten.** Die Zeile war breiter als der Bildschirm: Zeichen und Name, Anmelden und zwei runde Knöpfe brauchten 434 px auf 362 px Platz. Statt zu brechen schrumpft jetzt das eine Element, das ohne Schaden kürzer wird — der Anmelde-Knopf. |
| S-36 | Wortlisten · Übersicht | *(mein Befund)* Der Balken einer noch ungeübten Liste war **randvoll grau** und las sich als „fertig“ — seit die Prozentzahl weggefallen ist (S-01) widersprach dem nichts mehr. „Ungeübt“ ist keine Leistung, sondern deren Abwesenheit: es trägt in der Leiste jetzt die Farbe der leeren Bahn. Der Punkt in der Legende bleibt grau. |
| S-37 | Wortlisten · Übersicht | *(mein Befund)* „Alle Wörter“ trug einen **Tintenrand** — der bedeutet in dieser App „ausgewählt“, und ausgewählt ist die Zeile nicht. Ich hatte die Klasse aus dem Entwurf übernommen, wo sie nur „abgesetzt“ meinte. Jetzt Trennlinie und Luft. |
| S-38 | Wortlisten · Übersicht | *(mein Befund)* Der Platzhalter „In allen Wörtern suchen …“ war abgeschnitten. Jetzt „Wörter suchen …“. |
| S-39 | Üben · Multiple-Choice | Braucht zu viel Platz — **2×2 darstellen**, und die **Schrift adaptiv kleiner**, wenn ein Wort zu lang ist. Ursache war wieder eine alte Regel: die Grundregel war schon 2×2, eine Regel für schmale Bildschirme setzte sie auf eine Spalte zurück. Die Schrift misst sich jetzt nach dem Zeichnen und verkleinert sich nur so weit wie nötig, höchstens auf 72 %. |
| S-40 | Ganze App · Kopfzeile | Das Wort im Anmelde-Knopf **stiess rechts an den Rand der Pille**. Ursache war meine eigene Reparatur von S-35: ich hatte den Knopf schrumpfen lassen, und die Polsterung wurde aufgefressen (gemessen 106/106). Jetzt schrumpft er nicht mehr — der Platz kommt von der Marke, die auf schmalen Bildschirmen etwas kleiner wird. Gemessen: 13 px Polsterung erhalten, kein Überlauf. |
| — | *Geklärt, keine Änderung* | Warum ohne Anmeldung Wörter erscheinen: die App funktioniert vollständig ohne Konto, das Konto dient allein der Synchronisierung. Steht so in Hilfe und Datenschutztext. Ein Anmeldezwang wäre ausserdem ein Ablehnungsrisiko im App Store (Richtlinie 5.1.1 (v)). Vom Nutzer bestätigt: so lassen. |
| S-41 | Üben · Multiple-Choice | Den Knopf „Eine falsche wegnehmen“ **entfernt** — er braucht es nicht. Beim Eintippen sitzt der Tipp als Glühbirne in der Karte; beim Auswählen stand er zusätzlich als Knopf darunter, also ein zweiter Weg zu derselben Hilfe. |
| S-42 | Üben · Karte | **Kartenstapel** — in der Historie bestätigt: „eine Schicht je verbleibende Karte, grafisch begrenzt auf vier Schichten hinter der vordersten, also höchstens fünf Karten. Bei zwei verbleibenden also eine Schicht, bei der letzten keine.“ Gebaut, in beiden Ansichten. |
| S-43 | Üben · Karte | **Ecken eckig statt rund.** Eine Karteikarte hat rechte Winkel; der grosse Radius liess sie wie eine Bildschirmkachel aussehen. |
| S-44 | Einstellungen · Aussehen | Nach dem Entwurf gebaut: vier Umschalter über die volle Breite, nach Reichweite sortiert (Erscheinungsbild → Farbschema → Karte → Kartenschrift), mit den Hinweisen aus dem Entwurf, der Vorschaukarte darunter und einer Zeile zum Zurücksetzen. Vorher waren es vier Auswahlfelder, die man einzeln öffnen musste. |
| S-45 | Einstellungen · Sprachen | Nach dem Entwurf: eine Zeile je Sprachpaar mit Kästchen und Wortzahl, der Hinweis auf den Grundwortschatz, und die Oberflächensprache als Auswahlzeilen inklusive „Gerätesprache“. |
| S-46 | Einstellungen · Üben | Nach dem Entwurf als **Zeilenliste**: Name links, Wert rechts, Erklärung im Blatt. Vorher trug jede der zwanzig Einstellungen ihren ganzen Erklärtext auf der Seite — vollständig und unlesbar. |
| S-47 | Einstellungen | *(mein Befund)* **„Reset to recommended“ stand auf Englisch** in der deutschen Oberfläche. Und die Empfehlung stand doppelt: die Marke „✓ Empfohlen“ und darunter „Empfohlen: Eintippen“. Die Zeile erscheint jetzt nur noch, wenn der Wert **nicht** auf der Empfehlung steht. |
| S-48 | Einstellungen · Üben | „Tagesziel“ heisst jetzt **„Höchstens pro Tag“** — es ist kein Ziel: es zählt nichts mit, es gibt keine Erfolgsmeldung. Am Code geprüft: es schneidet „Heute dran“ ab und deckelt „Fällige Wörter“. |
| S-49 | Einstellungen · Üben | „Neue Wörter pro Tag“ war ein Regler von 3 bis 30 — eine Zahl, die niemand ohne Selbstkenntnis setzen kann. Jetzt **drei Tempi in Worten** (Gemächlich 5 · Normal 10 · Zügig 20) mit der Zahl daneben. |
| S-50 | Einstellungen | Antwortprüfung und Latein auf dieselbe Zeilenform gebracht — zwei Layouts auf einem Bildschirm wären schlimmer als das alte allein. |
| S-51 | Einstellungen | *(mein Fehler)* Beim Verschieben von „Lerntipp-Einblendungen“ und den Bereitschafts-Schwellen in die Üben-Zeilen hatte ich die **alten Abschnitte stehen lassen** — beide Einstellungen erschienen doppelt. Entfernt. |
| S-52 | Üben | *(mein Fehler)* Ein `useMemo` hinter einer frühen Rückgabe liess die App im **Produktionsbündel abstürzen** (React-Fehler 310, weisser Bildschirm). Im Entwicklungsserver fiel es nicht auf, weil dort Daten vorhanden waren und der andere Zweig lief. Haken jetzt vor der ersten Rückgabe. |

## Zweite Runde am Simulator

| Nr | Bereich | CR |
|---|---|---|
| T-01 | Einstellungen · Kopf | Der Knopf „Auf die Voreinstellungen zurücksetzen“ **sieht schlecht aus**: dreizeiliger Klotz oben rechts, der über dem Einleitungstext klebt. |
| T-02 | Einstellungen · Zeilen | Die Kästen brauchen **Abstand zum Rand** — sie kleben links am Bildschirmrand. Und insgesamt schöner machen. |
| T-03 | Einstellungen · Zeilen | **Die Punkte sind unklar.** (Es ist die Marke „steht auf der Empfehlung“ — offensichtlich nicht selbsterklärend.) |
| T-04 | Einstellungen · Kopf | Vor dem Zurücksetzen aller Voreinstellungen braucht es einen **Warn- und Bestätigungsdialog**. |
| T-05 | Einstellungen | „Wann eine Liste als bereit gilt · grün ab 95 %, gelb ab 70 %“ — **versteht so niemand**. Und es gehört nicht unter „Üben“, sondern in einen **eigenen Abschnitt** (es betrifft den Übungsplan). |
| T-06 | Einstellungen · Antwortprüfung | **Voreinstellung für Gross- und Kleinschreibung ändern:** nicht mehr „egal“, sondern zählt. (Betrifft `lenientCase` in `defaults.ts`; bestehende Nutzer behalten ihre eigene Einstellung.) |
| T-07 | Einstellungen · Sprachen | Den Erklärtext unter den Sprachpaaren (**„Beim Zuschalten kommt der Grundwortschatz …“**) **weglassen** — braucht es nicht. |
| T-08 | Einstellungen · Latein | Latein gehört **in den oberen Block (Üben) als eine Zeile „Latein“**; ein Klick führt auf die Optionen, zurück über Zurück-Knopf oder Blatt. Dazu eine **Konsistenzprüfung**, welche der beiden Bauarten für diesen Fall gilt — die App kennt heute beide: Blatt (Einstellungen) und eigener Bildschirm mit Zurück (Wortlisten, Statistik). |
| T-09 | Einstellungen · Sprache der App | Den Erklärtext darunter **weglassen**. |
| T-10 | Einstellungen · Aufbau | Einen Abschnitt **„Bedienung“** einführen, der **Aussehen** und **Sprache** enthält. Die Sprache dort als **Wahlzeile** (Kasten mit Pfeil, führt auf die Optionen) — wie die übrigen Zeilen. |
| T-11 | Einstellungen · Grundwortschatz | Den ganzen Abschnitt **entfernen**. Der Grundwortschatz wird schlicht **immer mitgeladen, sobald eine Sprache zugeschaltet wird** — keine eigene Schaltfläche, kein Zustand „aktiviert“. |
| T-12 | Einstellungen · Konto | **Fortschritt zurücksetzen** und **Account löschen** brauchen beide zwingend einen **Warn-/Bestätigungsdialog** vor der Ausführung. (Deckt sich mit T-04 für „Alles zurücksetzen“ — dieselbe Bauart für alle drei.) |
| T-13 | Einstellungen (app-weit) | **Überall die Abstände zum Kastenrand prüfen.** Im Aussehen-Bereich laufen die Segment-Schalter rechts über den Kasten hinaus; generell soll kein Bedienelement den Rand berühren oder überschreiten. Gilt als Durchgang über alle Bereiche, nicht nur hier. |
| T-14 | Einstellungen · Aussehen · Karte | Die Kartenmuster **„Recycled“ und „Linen“ sehen seltsam aus** — Muster überarbeiten, damit sie wie Papier bzw. Gewebe wirken und nicht wie ein Raster. |
| T-15 | Einstellungen · Aussehen · Farbschema | Die Schemata sind **langweilig** — untereinander zu ähnlich (alle drei sind warme Beigetöne). **Kladde behalten**, die beiden anderen (Leinen, Altpapier) durch **deutlich verschiedene** Paletten ersetzen. Vorlage: der Prototyp bzw. `assets/brand/farben-entwurf.css`. Betrifft `src/schemes.css` (je Schema hell + dunkel) und die Beschriftungen in `SettingsTab.tsx:455`. |
| T-16 | app-weit · Auswahl | **Auswahl ist inkonsistent:** Sprachen benutzen Kontrollkästchen, Wortlisten benutzen Hervorhebung. **Die Hervorhebung gilt** — Kontrollkästchen überall entfernen. Und die Hervorhebung muss deutlich sein: ausgewählte Zeilen bekommen eine **dunklere Tönung** plus Rahmen (heute kaum sichtbar). Vorbild: der farbige Streifen links am Zeilenrand aus dem Entwurf. |
| T-17 | Wortlisten · geöffnete Liste | Drei Dinge: (a) der **farbige Streifen links** an der Wortzeile sieht hässlich aus, wo er der Rundung folgt — als **gerade Linie** führen; (b) **alles bis und mit Tabellenkopf gehört fixiert**, nur die Wortzeilen rollen — zwei getrennte Rollbereiche, Rollbalken nur in der Wortliste; (c) im Tabellenkopf die Sprachen **ausschreiben** statt „EN“ / „DE“. |
| T-18 | Wortlisten · geöffnete Liste | Oben braucht es **„Alle auswählen“ / „Auswahl aufheben“ als Text**. „Auswahl aufheben“ ist nur anklickbar, wenn mindestens eine Zeile gewählt ist. |

### Umgesetzt am 3. September 2026

| Nr | Wie gelöst |
|---|---|
| T-01 | Der Knopf ist aus dem Kopf verschwunden und steht als Zeile **„Einstellungen zurücksetzen“** unter *Konto & Daten* — bei den anderen Handlungen, die man nicht zurücknehmen kann. |
| T-02 | Jeder Abschnitt hat einen Rumpf (`.set-body`) mit 14 px Polsterung; die Zeilen kleben nicht mehr am Rand. |
| T-03 | Der Punkt ist weg. Markiert wird jetzt die **Abweichung** („geändert“), nicht die Übereinstimmung — die Liste ist ruhig, und man sieht auf einen Blick, was man selbst verstellt hat. |
| T-04 · T-12 | Ein Bauteil `Bestaetigen` für alle drei: Einstellungen zurücksetzen, Fortschritt zurücksetzen, Account löschen. Beim Konto bleibt die Eingabe von „LÖSCHEN“ als zweite Sperre. |
| T-05 | Eigener Abschnitt **Übungsplan**, Zeile heisst **„Ampel der Wortlisten“**, Wert „grün ab 95 %“. Das Blatt erklärt die Ampel in einem Satz; die Regler heissen „Grün ab“ und „Gelb ab“. |
| T-06 | `lenientCase` steht ab Werk auf `false`. Der Schalter heisst umgedreht **„Gross- und Kleinschreibung zählt“** und ist ab Werk an. Wer die App schon benutzt, behält seine eigene Wahl. |
| T-07 · T-09 | Beide Erklärtexte entfernt. |
| T-08 | Latein ist eine Zeile unter *Üben* — und nur sichtbar, wenn Latein zugeschaltet ist. **Konsistenzregel:** in den Einstellungen öffnet alles als **Blatt**, auch eine Gruppe von Einstellungen; ein **eigener Bildschirm mit Zurück** bleibt den Inhaltsbereichen vorbehalten (Wortlisten, Statistik, Hilfe). |
| T-10 | Neuer Abschnitt **Bedienung** mit der Sprache als Wahlzeile und darunter Erscheinungsbild, Farbschema, Karte, Kartenschrift samt Vorschau. |
| T-11 | Abschnitt entfernt. Der Grundwortschatz kam ohnehin schon von selbst (`App.tsx`), sobald eine Sprache zugeschaltet ist. |
| T-13 | `.seg-voll` rechnet die Polsterung ein (`box-sizing`) und die Knöpfe dürfen schrumpfen — nichts läuft mehr aus dem Kasten. |
| T-14 | Altpapier: sieben blasse Einschlüsse in teilerfremden Kachelgrössen statt drei harter Punkte auf sichtbarem Raster. Leinen: zwei versetzte Faserlagen im 3-px-Takt, kein Innenrahmen mehr. |
| T-15 | Aus drei Beigetönen werden drei Familien: **Kladde** (warm, Rostrot), **Tinte** (kühl, Indigo), **Graphit** (neutral, Petrol). Erzeugt aus `scratchpad/gen_schemes.py`, alle Kontraste nachgerechnet. Alte Werte `leinen`/`altpapier` bilden auf die Nachfolger ab. |
| T-16 | Kontrollkästchen app-weit entfernt. Auswahl heisst überall: **dunklerer Grund (`--bg-2`) plus Rahmen in Schriftfarbe**. |
| T-17 | (a) Der Farbstreifen ist ein eigenes Element und läuft gerade. (b) Die Hülle hat jetzt eine begrenzte Höhe (`100dvh`), der Inhalt rollt in `.app-body` — dadurch kann der Listenkopf über den Zeilen stehen bleiben; der feste Teil rollt bei Bedarf lautlos mit. (c) Der Tabellenkopf schreibt die Sprachen aus. |
| T-18 | „Alle auswählen“ / „Auswahl aufheben“ als Textzeile über dem Tabellenkopf; die zweite ist blass, solange nichts gewählt ist. |

## Dritte Runde am Simulator

| Nr | Bereich | CR |
|---|---|---|
| T-19 | Einstellungen · Erweitert | Dem Einleitungstext fehlt der **Abstand zum Rand** — er beginnt an der Kastenkante. |
| T-20 | Wortlisten · Wortzeile | Der farbige Balken links soll ein **eigener, gerader Balken neben der Karte** sein — nicht in das Rechteck eingebaut. |
| T-21 | Wortlisten · Rollen | Der obere, feste Bereich soll **selbst rollbar** sein, nur **ohne Rollbalken**. Der Tabellenkopf bleibt dabei stehen. |

### Umgesetzt am 3. September 2026 (zweiter Durchgang)

| Nr | Wie gelöst |
|---|---|
| T-19 | Der Einleitungstext der erweiterten Einstellungen hat dieselbe Polsterung wie die Zeilen darunter (18 px). |
| T-20 | Der Balken ist ein eigenes Stück links **neben** der Karte: 4 px breit, gerade, mit 7 px Luft. Der Spaltenkopf ist um dieselbe Strecke eingerückt. |
| T-21 | Der obere Bereich belegt höchstens 38 % der Höhe und rollt darüber hinaus selbst — ohne Rollbalken. Was die Spalten benennt („Alle auswählen“ und der Tabellenkopf), steht in einem eigenen Streifen darunter und rollt nie mit. |
| T-22 | Übungsplan · Kalender | Die Farben sind unsauber — es sollen **grün, gelb, rot** sein. Und die **Färbelogik aus den Entwürfen** übernehmen: der **ganze Tag** wird eingefärbt; liegen mehrere Listen auf einem Tag, bestimmt die **schlechteste** die Farbe, und dass es mehrere sind, muss **angezeigt** werden. Die Legende („bereit ab 95 %“) **versteht niemand**, der die App nicht selbst gebaut hat: verständliche Begriffe (**Bereit · Auf Kurs · Ungenügend** oder ein besseres Tripel) und darunter ein kurzer Erklärsatz. |
| T-23 | Übungsplan · Terminzeilen | **Schon wieder eine eigene Auswahl-Bauart** (Kontrollkästchen). Gleiche oder ähnliche Funktion heisst: **gleiches Bedienelement** — die Hervorhebung aus T-16 gilt auch hier. |

### Umgesetzt am 3. September 2026 (dritter Durchgang)

| Nr | Wie gelöst |
|---|---|
| T-22 | Die Ampel färbt den **ganzen Tag**, wie im Entwurf: Grund aus der Ampelfarbe gemischt (22 %), Rand in der vollen Farbe. Vorher sass sie in einem Punkt von 16 px, in dem drei Farben gleich aussahen. Liegen mehrere Listen auf einem Tag, steht ihre **Zahl in der Ecke** und die Farbe zeigt die schwächste. „Heute“ und „gewählt“ sind jetzt Ringe statt Flächen, damit sie die Ampel nicht überdecken. Die Legende heisst **Bereit · Auf Kurs · Im Rückstand**, ihr Zeichen sieht aus wie ein Kalendertag, und darunter steht die Regel in zwei Sätzen. Die Prozentzahlen stehen dort, wo man sie verstellen kann: in den Einstellungen. |
| T-23 | Die Terminzeile hat kein Kontrollkästchen mehr — die Zeile selbst ist der Knopf, die Auswahl zeigt sich am dunkleren Grund wie überall sonst. Dabei aufgefallen und mitbehoben: das Sprachkürzel und der Fortschrittsbalken verschwanden auf einer hervorgehobenen Zeile; das Kürzel steht dort jetzt auf Papier, der Balken bekommt app-weit einen feinen Rand. |
| T-24 | Übungsplan | Der Erklärtext unter der Legende ist **zu lang und für Neue unverständlich** — sie wissen nicht einmal, dass von Wortlisten die Rede ist. Nötig: (a) eine **Überschrift über dem Kalender** („Übungsplan“ + ein Satz, worum es geht); (b) unter der Legende **kurz**, aber mit Angabe, **worauf sich „Bereit“ bezieht — samt Prozentwerten und was sie bedeuten**; (c) die Zahl in der Ecke muss man **nicht erklären müssen**: unter die Datumszahl gehört ein Kästchen „1 Liste“, „2 Listen“. Sonst **nichts am GUI ändern**. |
| T-24 · umgesetzt | (a) Über dem Kalender steht jetzt **„Übungsplan“** und darunter ein Satz: *„Wortlisten, für die du ein Datum gesetzt hast — wann sie geprüft werden und wie weit du bist.“* Gleiche Bauart wie der Kopf der Einstellungen. (b) Der Satz unter der Legende ist von drei Zeilen auf eine geschrumpft und sagt jetzt, **worauf** sich die Farbe bezieht: *„So viele Wörter der Liste sitzen schon: ab 95 % bereit, ab 70 % auf Kurs, darunter im Rückstand.“* Die Zahlen kommen aus den Einstellungen. (c) Statt einer nackten Zahl in der Ecke steht unter dem Datum ein Kästchen **„1 Liste“ / „2 Listen“** — das muss man nicht erklären. Sonst nichts geändert. |
| T-25 | app-weit · Auswahl | **Es gibt immer noch mehrere Auswahl-Bauarten**, und im Übungsplan sieht es weiterhin seltsam aus: die gewählte Zeile trägt Rahmen **und** Innenring, dazu bei der zuletzt angetippten noch den Fokusring — drei Linien übereinander, die wie zwei verschiedene Zustände aussehen. Ausserdem hat die Listenauswahl (`ListPicker`) noch **Radioknöpfe mit rostrotem Grund**. Eine Bauart, eine Linie. |
| T-26 | Wortlisten · geöffnete Liste | **Zwei Dinge.** (1) **Fehler:** Das Zieldatum lässt sich nicht mehr wählen. (2) Das Rollen war falsch verstanden: **alles bis und mit Tabellenkopf ist EIN rollbarer Block**, die Wörter rollen separat (dort mit Rollbalken). **Bevorzugte Lösung:** die vollständige Wortliste gar nicht in dieser Sicht zeigen, sondern **hinter einem Knopf** — dann erscheint die nackte Liste mit Kopf, Einträgen und Bearbeiten / Löschen / Neu. |
| T-27 | app-weit · Löschen | **Alle Löschen-Funktionen prüfen:** jede braucht eine **Warnung vorher** und eine **Rückmeldung danach**. Verdacht: eine ganze Wortliste liess sich ohne Warnung löschen. |

### Umgesetzt am 3. September 2026 (vierter Durchgang)

| Nr | Wie gelöst |
|---|---|
| T-25 | Eine Auswahl-Bauart, **eine** Linie: 1,5 px in Schriftfarbe plus dunklerer Grund. Der zusätzliche Innenring hatte aus dem Rahmen eine Doppellinie gemacht; kam bei der zuletzt angetippten Zeile der Fokusring dazu, standen drei Linien übereinander. Die Listenauswahl (`ListPicker`) hatte ausserdem noch Radioknöpfe auf rostrotem Grund — sie benutzt jetzt dieselbe Zeile wie alle anderen. |
| T-26 | Die geöffnete Liste hat **zwei Ebenen**: die Liste selbst (Termin, Fortschritt, Wege zum Füllen) und dahinter, hinter dem Knopf **„Wörter ansehen und bearbeiten“**, die nackte Wortliste mit Suche, Auswahl, Spaltenkopf und Einträgen. Damit fällt der zweite Rollbereich weg: Ebene 2 rollt wie jede Seite, auf Ebene 3 rollen die Wörter mit sichtbarem Balken, alles darüber (bis und mit Spaltenkopf) ist ein Block. **Das Zieldatum liess sich nicht mehr wählen**, weil das unsichtbare Datumsfeld in einem beschnittenen Rollbereich lag — auf Ebene 2 steht es wieder im normalen Fluss und funktioniert. |
| T-27 | **Alle Löschwege geprüft.** `confirm()` — der Systemdialog, der in einer WebView auch ausbleiben kann — ist verschwunden; das erklärt die ohne Warnung gelöschte Liste. Jetzt fragen alle mit demselben Bauteil `ui/Bestaetigen` und melden danach zurück: Wortliste löschen (neu: Dialog + Meldung mit Namen), Wörter löschen aus der Auswahl (Dialog + Meldung), einzelnes Wort im Bearbeiten-Fenster (**vorher ganz ohne Warnung und ohne Meldung**), Einstellungen zurücksetzen, Fortschritt zurücksetzen, Konto löschen. Zieldatum entfernen bekommt eine Meldung, aber keine Warnung — ein Datum ist in zwei Tippern wieder gesetzt. Zeilen aus einer noch nicht übernommenen Import-Vorschau zu streichen ist kein Löschen. **Offen:** die Rückfrage beim ersten Anmelden (`SyncBridge`) benutzt noch `window.confirm` — sie ist kein Löschknopf, wirft aber dasselbe Problem auf. |
| T-28 | Wortlisten · ganze Funktionalität | (a) Die Wege zum Füllen (geteilte Liste, Liste einfügen, KI-Prompt, Tabelle) gehören **nicht** in die Angaben einer einzelnen Liste — sie dienen dem **Anlegen und Ergänzen**. Also zu **„Neue Liste“**. (b) In der Wortansicht ein Knopf **„Wörter hinzufügen“**, der dieselben Wege als Blatt öffnet. (c) **Listen zusammenführen** als neue Funktion. (d) „+ Wort“ gehört auf die Ebene von Bearbeiten und Löschen, **gleiche Knopfform**, und anders benannt. (e) Das Einfrieren bis und mit Kopfzeile funktioniert nicht sauber — **oberen Bereich nicht rollbar machen**. |

### Umgesetzt am 3. September 2026 (fünfter Durchgang)

| Nr | Wie gelöst |
|---|---|
| T-28 a/b | Ein Blatt, zwei Aufrufer. **„+ Neue Liste“** fragt zuerst: *Woher kommen die Wörter?* — leere Liste, Liste einfügen, KI-Prompt, geteilte Liste, Tabelle. **„Hinzufügen“** in der Wortansicht öffnet dasselbe Blatt, nur heisst die erste Zeile *Einzelnes Wort eintippen*. Am Ende jedes Import-Wegs fragt die App ohnehin, in welche Liste die Wörter sollen — der Weg funktioniert also von überall. |
| T-28 c | **`store.mergeLists(von, nach)`**: die Wörter wandern hinüber, die leere Hülle verschwindet. Wörter, die es drüben schon gibt (dasselbe Fremdwort, dieselbe Übersetzung), bleiben zurück und werden gelöscht — sonst stünde dasselbe Wort zweimal in einer Liste, mit zwei getrennten Lernständen. Die Rückfrage sagt es vorher, die Meldung sagt hinterher, wie viele es waren. |
| T-28 d | Drei Knöpfe derselben Form, die sich die Breite teilen: **Hinzufügen · Bearbeiten · Löschen**. „Zeile antippen zum Auswählen“ steht als eigene Zeile darunter. |
| T-28 e | `.wl-fest` rollt nicht mehr — `flex: none`, kein `max-height`, kein `overflow`. Seit die Wörter eine eigene Ebene haben, steht dort ohnehin nur Suche, Werkzeugleiste und Spaltenkopf. |
| — | Dabei gefunden: die Seite liess sich **seitwärts rollen**. `.app-body` ist seit T-17 eine Flex-Spalte, und ohne `min-width: 0` darf ein Kind nicht unter seine Inhaltsbreite schrumpfen. Behoben für alle Bereiche. |
| T-29 | Wortlisten · Wege zum Füllen | Einige Wege **laufen ins Leere** — selber durchtesten. Ausserdem: für den Lernstand-Block war ein **anderes Design** abgemacht (Entwürfe von gestern). |

### Umgesetzt am 3. September 2026 (sechster Durchgang) — alle Wege durchgetestet

| Weg | Befund | Behoben |
|---|---|---|
| Leere Liste anlegen | in Ordnung | — |
| Liste einfügen | Kette bis „In welche Liste?“ vollständig | — |
| KI-Prompt zum Abschreiben | dasselbe Fenster, in Ordnung | — |
| Geteilte Liste übernehmen | öffnet „Liste importieren“, in Ordnung | — |
| **Tabelle einlesen** | **tot** — das unsichtbare Dateifeld war beim Umbau der Wortlisten (Commit `243af64`) mit der alten Zeile verschwunden; der Knopf rief ins Leere | Dateifeld steht jetzt bei den anderen Fenstern, die immer gezeichnet werden |
| **Einzelnes Wort eintippen** | **tot** — `neuesWortOffen` wurde gesetzt, aber nirgends mehr gezeichnet | Öffnet jetzt **dieselbe Maske wie „Bearbeiten“**, nur leer; „Speichern“ legt an. Kein Lernstand-Block, statt „Löschen“ steht dort „Abbrechen“ |
| **iOS-Zoomfalle** | nach dem Einfügen blieb die **ganze App vergrössert** — iOS zoomt in jedes Feld unter 16 px und zoomt nicht zurück | Alle Eingabefelder auf dem Handy 16 px. `maximum-scale` wäre die bequeme und falsche Antwort — ohne Zoom ist die App für schwache Augen unbrauchbar |
| „1 Wörter“ | Mehrzahl an zwei Stellen auch bei einem Wort | Einzahl und Mehrzahl getrennt |
| Lernstand-Block | wich vom Entwurf ab: eine sechste Zeile („Hält im Moment“, ein Modellwert) und Namen, die auf zwei Zeilen brachen | Fünf Zeilen wie im Entwurf; der Name nimmt die Breite, die er braucht |

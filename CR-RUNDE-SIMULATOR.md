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

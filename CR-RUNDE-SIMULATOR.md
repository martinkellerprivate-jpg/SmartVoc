# CR-Runde am Simulator — offen, wird gesammelt

Stand: läuft. Nichts davon ist umgesetzt, solange hier „offen" steht.

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

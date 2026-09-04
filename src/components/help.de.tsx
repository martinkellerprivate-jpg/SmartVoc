/* Deutsche Hilfetexte. Getrennt von der Bedienung, weil Prosa nicht
 * satzweise uebersetzt werden kann: Deutsch und Englisch bauen ihre Saetze
 * anders, und Hervorhebungen sitzen an anderen Stellen. Deshalb zwei
 * vollstaendige Fassungen statt einer Woerterliste.
 *
 * Die Anleitung beschrieb frueher, was auf dem Bildschirm zu sehen ist --
 * also Dinge, die jeder ohnehin bemerkt ("unter dem Datum steht, um wie
 * viele Listen es geht"). Sie ist jetzt aus der Sicht dessen geschrieben,
 * der morgen eine Pruefung hat: was will ich, und wie komme ich dahin. Was
 * man sieht, zeigt eine Skizze; was man wissen muss, steht als Satz. */
import type { Kapitel, Tipp } from "./help.types";
import { KritzelKarte, KritzelAntwortarten, KritzelKalender, KritzelLeiste,
         KritzelListe, KritzelVergessen, KritzelFenster, KritzelTesteffekt } from "../ui/Kritzel";

export const TIPPS_DE: Tipp[] = [
  { h: "Lieber täglich kurz als selten lang",
    b: "10 bis 15 Minuten jeden Tag bringen mehr als eine Stunde am Wochenende. In den Pausen dazwischen festigt dein Gehirn die Wörter ganz von selbst." },
  { h: "Erst selbst überlegen, dann umdrehen",
    b: "Tippe deine Antwort wirklich ein, bevor du die Lösung ansiehst. Genau dieses Anstrengen beim Erinnern macht ein Wort fest — nicht das blosse Anschauen." },
  { h: "Ein Wort braucht viele Begegnungen",
    b: "Fast niemand kann ein Wort nach einmal Sehen. Dass dir ein Wort über mehrere Tage immer wieder begegnet, ist normal — und genau so soll es sein." },
  { h: "Mach deine Fehler zu Freunden",
    b: "Wörter, die du falsch hattest, sind die wertvollsten. In der Statistik sammelt „Hartnäckig“ genau diese Wörter zum gezielten Üben." },
  { h: "Wenig Neues, dafür richtig",
    b: "8 bis 12 neue Wörter pro Tag reichen völlig. Lieber wenige Wörter wirklich können als fünfzig nur halb." },
  { h: "Misch die Wörter",
    b: "Übe durcheinander statt eine Wortliste nach der anderen am Stück. Das fühlt sich schwerer an, trainiert dein Gedächtnis aber spürbar besser." },
  { h: "Sprich das Wort leise mit",
    b: "Lies das Wort und sprich es dabei lautlos mit. Je mehr Sinne mitmachen, desto besser bleibt es haften." },
  { h: "Lern das Wort im Zusammenhang",
    b: "Bau ein neues Wort in einen kleinen Satz oder ein Bild im Kopf ein. „The dog barks“ merkt man sich besser als „dog“ allein." },
  { h: "Übe in beide Richtungen",
    b: "Erst Englisch nach Deutsch, dann Deutsch nach Englisch. Ein Wort kannst du erst richtig, wenn es in beide Richtungen klappt." },
  { h: "Schlaf macht das Lernen fertig",
    b: "Was du abends übst, festigt sich im Schlaf. Eine kurze Wiederholung vor dem Schlafengehen wirkt oft besonders gut." },
];

export const ANLEITUNG_DE: Kapitel[] = [
  {
    titel: "Morgen ist Prüfung: was jetzt?",
    text: (
      <>
        <p>Der kürzeste Weg von der Heftseite zur ersten Übung dauert etwa zwei Minuten:</p>
        <ol>
          <li>Unter <b>Wortlisten</b> auf <b>+ Neue Liste</b>, dann <b>Liste einfügen</b>. Wenn du die Wörter nicht abtippen willst, holt dir der <b>KI-Prompt</b> die Liste aus einem Foto deiner Heftseite.</li>
          <li>Der Liste ein <b>Zieldatum</b> geben. Das ist der Tag der Prüfung.</li>
          <li>Auf <b>Üben</b> und los.</li>
        </ol>
        <p>Alles andere kannst du später anschauen. Die App weiss ab jetzt selbst, welches Wort wann wieder drankommt.</p>
        <p className="help-callout">Für jede Sprache, die du eingeschaltet hast, liegt schon ein <b>Grundwortschatz</b> bereit. Du kannst also sofort üben, auch ohne eigene Liste.</p>
      </>
    ),
  },
  {
    titel: "Wo du was findest",
    text: (
      <>
        <ul>
          <li><b>Üben</b> ist der Ort, an dem gelernt wird. Alles andere dient nur dazu.</li>
          <li><b>Übungsplan</b> beantwortet: wann ist was fällig, und bin ich rechtzeitig fertig?</li>
          <li><b>Wortlisten</b> ist dein Materiallager.</li>
          <li><b>Statistik</b> beantwortet: woran hakt es, und werde ich besser?</li>
        </ul>
        <p>Oben rechts das Zahnrad für die Einstellungen, das Fragezeichen für diese Hilfe.</p>
      </>
    ),
  },
  {
    titel: "Wörter in die App bringen",
    text: (
      <>
        <p>Es gibt vier Wege. Sie unterscheiden sich nur darin, wie viel du selbst tippen musst.</p>
        <ol>
          <li><b>Foto und KI</b> — für eine ganze Heftseite, ohne zu tippen</li>
          <li><b>Liste einfügen</b> — wenn du den Text schon irgendwo hast</li>
          <li><b>Einzelnes Wort</b> — für Nachträge</li>
          <li><b>Geteilte Liste</b> — wenn jemand dir seine schickt</li>
        </ol>

        <h4>1. Foto und KI</h4>
        <p>Das ist der Weg, den du wahrscheinlich am häufigsten brauchst. Er funktioniert mit jeder KI, die Bilder lesen kann.</p>
        <ol>
          <li>In der App: <b>+ Neue Liste</b>, dann <b>Liste einfügen</b>.</li>
          <li>Unten auf <b>KI-Prompt kopieren</b> tippen. Damit liegt ein fertiger Auftrag in deiner Zwischenablage.</li>
          <li>Wechsle in deine KI-App, füge den Auftrag ein und häng ein <b>Foto deiner Heftseite</b> dazu.</li>
          <li>Die KI antwortet mit einer Liste. Kopiere sie.</li>
          <li>Zurück in SmartVoc, ins grosse Feld einfügen, dann <b>Weiter zum Prüfen</b>.</li>
        </ol>
        <p>Im Prüfen-Fenster steht jedes Wort einzeln. Schau kurz drüber, korrigiere was schiefgegangen ist, und wähle am Schluss die Liste. Fotos werden gerne mal falsch gelesen, und das ist der Moment, es zu merken. Nicht mitten in der Prüfung.</p>

        <h4>2. Liste einfügen</h4>
        <p>Dasselbe Fenster, nur ohne KI. Eine Zeile pro Wort, die beiden Sprachen getrennt durch einen senkrechten Strich, einen Bindestrich, einen Doppelpunkt oder einen Tabulator:</p>
        <p className="help-code">tree | der Baum<br />house | das Haus</p>
        <p>Aus einer Tabelle kopierte Zeilen funktionieren direkt, weil Tabellen mit Tabulatoren trennen.</p>

        <h4>3. Einzelnes Wort</h4>
        <p>In einer offenen Liste unter <b>Wörter ansehen und bearbeiten</b> auf <b>Hinzufügen</b>. Wort und Übersetzung genügen; Beispielsatz und Aussprache kannst du weglassen oder später ergänzen.</p>

        <h4>4. Geteilte Liste</h4>
        <p>Wer eine Liste teilt, bekommt einen Code. Mit <b>Geteilte Liste übernehmen</b> und diesem Code hast du eine eigene Kopie. Dein Lernstand und der der anderen Person bleiben getrennt.</p>
      </>
    ),
  },
  {
    titel: "Eine Liste ordnen",
    text: (
      <>
        <p>Eine Wortliste ist alles, was du zusammen übst: eine Heftseite, eine Lektion, ein Prüfungsstoff. <b>Jedes Wort gehört zu genau einer Liste.</b></p>
        <KritzelListe titel="Erst die Liste, dann ihre Wörter" />
        <p>Öffnest du eine Liste, siehst du zuerst sie selbst: Zieldatum, wie weit du bist, und die Wege weiter. Die Wörter liegen eine Ebene tiefer.</p>
        <p>Dort tippst du eine Zeile an, um sie auszuwählen, und benutzt dann <b>Bearbeiten</b> oder <b>Löschen</b>. Mehrere auf einmal gehen auch.</p>
        <p>Zwei Listen, die ohnehin zusammengehören, kannst du <b>zusammenführen</b>. Die Wörter wandern hinüber, die leere Liste verschwindet.</p>
      </>
    ),
  },
  {
    titel: "Das Zieldatum",
    text: (
      <>
        <p>Setz einer Liste den Tag der Prüfung als <b>Zieldatum</b>. Es ist die eine Angabe, die am meisten bringt.</p>
        <p>Von da an rechnet die App rückwärts. Je näher der Termin, desto häufiger kommen die Wörter dieser Liste, damit sie am Stichtag sitzen und nicht drei Wochen später. Übst du mehrere Listen zusammen, kommen die mit dem näheren Termin öfter dran.</p>
        <p>Ohne Zieldatum ist eine Liste nicht schlechter dran. Sie läuft einfach nebenher, im normalen Tempo.</p>
      </>
    ),
  },
  {
    titel: "Der Übungsplan",
    text: (
      <>
        <p>Der Übungsplan beantwortet eine einzige Frage: <b>Bin ich rechtzeitig fertig?</b></p>
        <KritzelKalender titel="Die Farbe sagt, wie du stehst" />
        <p>Grün heisst: wenn die Prüfung heute wäre, würdest du bestehen. Rot heisst: da liegt noch Arbeit vor dir. Liegen mehrere Listen auf einem Tag, zeigt die Farbe die schwächste, denn die entscheidet.</p>
        <p>Tipp einen Tag an, dann siehst du, worum es geht, und kannst direkt von dort üben.</p>
      </>
    ),
  },
  {
    titel: "Üben: die Karte",
    text: (
      <>
        <KritzelKarte titel="Jede Seite bleibt in ihrer Sprache" />
        <p>Vorne die Frage, hinten die Lösung. Der Beispielsatz steht auf beiden Seiten, jeweils in der Sprache dieser Seite. Sonst stünde die Übersetzung neben dem Wort, das du erst übersetzen sollst.</p>
        <p>Oben auf der Karte steht immer, in welche Richtung gerade gefragt wird. Bei <b>Gemischt</b> wechselt das von Karte zu Karte, deshalb lohnt sich der kurze Blick.</p>
        <p>Mit dem Knopf oben rechts wird die Karte gross und alles andere verschwindet. Zurück mit demselben Knopf, mit <b>Esc</b> oder einem Tipp daneben.</p>
      </>
    ),
  },
  {
    titel: "Die vier Antwortarten",
    text: (
      <>
        <KritzelAntwortarten titel="Drei zählen, eine nicht" />
        <p><b>Eintippen.</b><br />Du schreibst die Antwort selbst. Das ist anstrengender als alles andere und bringt am meisten. Wenn du dich nicht entscheiden kannst, nimm das.</p>
        <p><b>Multiple-Choice.</b><br />Du wählst aus mehreren Möglichkeiten. Leichter, weil die Lösung schon dasteht. Gut für den Anfang oder wenn du müde bist.</p>
        <p><b>Selbstkontrolle.</b><br />Du überlegst, drehst die Karte um und sagst selbst, ob es sass.</p>
        <p className="help-callout">Am besten schreibst du die Lösung auf ein Blatt Papier und kontrollierst erst dann in der App. Aber nicht schummeln: Du bringst nur dich selbst um die Wiederholung.</p>
        <p><b>Nur durchblättern.</b><br />Das richtige, wenn du eine Liste einfach schnell durchsehen willst. Zum Beispiel bei einer neuen Liste, um zu wissen, was auf dich zukommt, oder kurz vor der Prüfung zum Überfliegen. Wichtig: dieser Modus zählt für nichts. Er verändert deinen Lernstand nicht und taucht in keiner Statistik auf.</p>
      </>
    ),
  },
  {
    titel: "Wie gut ein Wort sitzt",
    text: (
      <>
        <KritzelLeiste titel="Dieselben fünf Stufen überall" />
        <p><b>sitzt</b> heisst: hält lange, kommt selten zurück. <b>sitzt fast</b>: fast da, noch ein paar Wiederholungen. <b>wackelt noch</b>: kommt öfter. <b>neu</b>: frisch gelernt. <b>ungeübt</b>: noch nie abgefragt.</p>
        <p>Diese Leiste findest du auf der Karte, an jeder Liste und in der Statistik. Es ist überall dieselbe Rechnung, also kannst du die Farben vergleichen.</p>
        <p>In der Statistik öffnet ein Tipp auf einen Eintrag der Legende die passenden Wörter.</p>
      </>
    ),
  },
  {
    titel: "Mit oder ohne Konto",
    text: (
      <>
        <p>Die App läuft vollständig <b>ohne Konto</b>. Alles, was du einträgst, liegt dann auf diesem Gerät, und nur dort.</p>
        <p>Meldest du dich an, kommt dreierlei dazu: dein Stand ist auf <b>allen deinen Geräten</b> derselbe, du kannst <b>Listen teilen</b>, und deine Wörter überleben, wenn dem Gerät etwas zustösst.</p>
        <p>Du kannst dich jederzeit später anmelden. Was dann schon auf dem Gerät liegt, fragt die App, ob es mit ins Konto soll.</p>
        <p>Dein Konto löschst du in den <b>Einstellungen</b> unter „Konto &amp; Daten“. Damit verschwinden auch die Daten in der Cloud, und das lässt sich nicht rückgängig machen.</p>
      </>
    ),
  },
  {
    titel: "Wenn etwas schiefgeht",
    text: (
      <>
        <p><b>Ein Wort ist falsch geschrieben.</b> Liste öffnen, <b>Wörter ansehen und bearbeiten</b>, Zeile antippen, <b>Bearbeiten</b>.</p>
        <p><b>Die App fragt Wörter ab, die du nicht mehr brauchst.</b> Liste löschen. Die Wörter selbst bleiben und verlassen nur diese Liste.</p>
        <p><b>Der Lernstand stimmt nicht mehr.</b> In den Einstellungen unter „Konto &amp; Daten“ lässt sich der Fortschritt zurücksetzen: Punkte, Verlauf und Tagesserie, in allen Sprachen. Deine Wörter bleiben. Rückgängig machen lässt es sich nicht.</p>
      </>
    ),
  },
];

/* ---- Teil 3: Die Lerntheorie hinter dieser App ---- */
export const THEORIE_LEAD_DE =
  "SmartVoc rät nicht, wann ein Wort wiederkommt. Es rechnet es aus, mit einem Modell, an dem seit über hundert Jahren geforscht wird. Wer wissen will, warum ein Wort erst in drei Wochen wieder auftaucht, findet die Antwort hier.";

export const THEORIE_DE: Kapitel[] = [
  {
    titel: "Vergessen ist kein Fehler",
    text: (
      <>
        <p>Hermann Ebbinghaus hat sich Ende des 19. Jahrhunderts selbst sinnlose Silben beigebracht und gemessen, wie viel davon nach einer Stunde, einem Tag, einer Woche noch da war. Heraus kam die <b>Vergessenskurve</b>: Frisch Gelerntes fällt zuerst steil ab und dann immer flacher.</p>
        <KritzelVergessen titel="Jede Wiederholung macht die Kurve flacher" />
        <p>Das Entscheidende ist nicht der Verlust, sondern was danach passiert. Nach jeder Wiederholung fällt die Kurve flacher ab als vorher. Das Wort hält länger.</p>
        <p>Vergessen ist also kein Versagen, sondern der Normalfall. Und der Hebel, an dem man ansetzen kann.</p>
      </>
    ),
  },
  {
    titel: "Der beste Zeitpunkt ist kurz vor dem Vergessen",
    text: (
      <>
        <p>Wiederholst du zu früh, ist das Wort noch präsent und die Wiederholung bringt wenig. Wiederholst du zu spät, ist es weg und du lernst es neu.</p>
        <KritzelFenster titel="Dazwischen liegt das Fenster, das die App sucht" />
        <p>Dazwischen liegt ein Fenster, in dem eine Wiederholung am meisten bewirkt: wenn das Erinnern gerade noch gelingt, aber Anstrengung kostet. Man nennt das <b>verteiltes Lernen</b>, und der Effekt gehört zu den am besten belegten der Lernpsychologie.</p>
        <p>Genau dieses Fenster sucht die App für jedes einzelne Wort. Deshalb kommt ein Wort, das du sicher kannst, erst in drei Wochen wieder, und eines, bei dem du gezögert hast, schon morgen.</p>
      </>
    ),
  },
  {
    titel: "Abrufen ist stärker als Nachlesen",
    text: (
      <>
        <p>Sich an etwas zu <b>erinnern</b> festigt stärker, als dasselbe noch einmal zu <b>lesen</b>. Der Fachbegriff ist <b>Testeffekt</b>.</p>
        <KritzelTesteffekt titel="Fünfmal lesen bringt weniger als viermal abfragen" />
        <p>Wer eine Vokabelliste fünfmal durchliest, hat weniger davon als wer sie einmal liest und sich viermal selbst abfragt. Obwohl sich das Durchlesen deutlich sicherer anfühlt.</p>
        <p>Deshalb ist <b>Eintippen</b> die empfohlene Antwortart, und deshalb ist <b>Nur durchblättern</b> ausdrücklich als „zählt nicht“ gekennzeichnet. Und deshalb lohnt es sich, vor dem Umdrehen wirklich zu überlegen, auch wenn es unbequem ist.</p>
      </>
    ),
  },
  {
    titel: "Was die App über jedes Wort weiss",
    text: (
      <>
        <p>Im Hintergrund läuft <b>FSRS</b>, ein modernes Gedächtnismodell. Es hält für jedes Wort drei Zahlen fest:</p>
        <ul>
          <li><b>Wie lange es hält.</b> Nach jeder richtigen Antwort wächst dieser Wert. Das ist die flacher werdende Kurve von oben.</li>
          <li><b>Wie zäh es ist.</b> Manche Wörter sind störrisch, egal wie oft man sie übt. Die kommen häufiger zurück und werden als „hartnäckig“ gekennzeichnet.</li>
          <li><b>Wie sicher du es jetzt noch kannst.</b> Sinkt dieser Wert unter dein Ziel, ist das Wort fällig.</li>
        </ul>
        <p>Dieses Ziel kannst du in den Einstellungen verschieben. Ein höheres Ziel heisst: häufiger üben, dafür sitzt mehr. Ein niedrigeres: weniger Karten pro Tag, dafür vergisst du mehr. Es gibt hier kein Richtig, nur einen Tausch, den du selbst machst.</p>
        <p>Was die App <b>nicht</b> tut: sie passt das Modell nicht an dich persönlich an und zeichnet dafür auch nichts auf. Die Zahlen des Modells sind für alle gleich.</p>
      </>
    ),
  },
  {
    titel: "Warum es vor einer Prüfung anders läuft",
    text: (
      <>
        <p>Setzt du einer Wortliste ein Zieldatum, hebt die App das Ziel für diese Wörter an, je näher der Termin rückt.</p>
        <p>Das ist keine zweite Rechnung, sondern dieselbe mit einem strengeren Ziel. Ein höheres Behaltensziel bedeutet kürzere Abstände, also kommen die Wörter öfter. Nach dem Termin fällt alles auf dein normales Ziel zurück.</p>
        <p>In den letzten Tagen vor dem Termin hebt die App ausserdem die Tagesgrenze für diese Wörter auf. Es hilft niemandem, wenn ausgerechnet die Prüfungswörter an der Obergrenze hängen bleiben.</p>
      </>
    ),
  },
  {
    titel: "Warum sich Lernen anstrengend anfühlen darf",
    text: (
      <>
        <p>Die Lernforschung kennt einen Begriff, der zuerst wie ein Widerspruch klingt: <b>wünschenswerte Erschwernisse</b>. Gemeint sind Hürden, die das Üben im Moment mühsamer machen und gerade deshalb mehr bringen.</p>
        <p>Verteiltes Üben ist eine davon. Selbst abrufen statt nachlesen ist die zweite. Die dritte ist <b>Mischen</b>: Wörter durcheinander üben statt eine Liste nach der anderen am Stück.</p>
        <p>Alle drei haben denselben Haken. Sie fühlen sich schlechter an, als sie sind. Wer eine Liste fünfmal am Stück durchgeht, erlebt sich als sicher und ist es eine Woche später nicht. Wer gemischt und verteilt übt, macht unterwegs mehr Fehler und behält am Ende mehr.</p>
        <p>Deshalb ist das Gefühl beim Üben ein schlechter Ratgeber, und deshalb nimmt die App dir die Reihenfolge ab.</p>
      </>
    ),
  },
  {
    titel: "Was die Zahlen bedeuten, die du siehst",
    text: (
      <>
        <p>Der <b>Übungsfortschritt</b> über der Karte gilt nur für die laufende Runde: wie viel von dem, was du dir für jetzt vorgenommen hast, erledigt ist. Er beginnt bei jeder Runde neu.</p>
        <p>Der <b>Beherrschungsstand</b> ist etwas anderes. Er zeigt, wie sich alle Wörter dieser Übung auf die fünf Stufen verteilen, verändert sich langsam über Wochen, und ist dieselbe Zahl, die im Übungsplan als Ampel und in der Statistik als Leiste auftaucht.</p>
        <p>Es ist überall dieselbe Rechnung: der Anteil der Wörter, die sitzen oder fast sitzen.</p>
      </>
    ),
  },
  {
    titel: "Was du selbst in der Hand hast",
    text: (
      <>
        <ul>
          <li><b>Regelmässigkeit.</b> Zehn Minuten täglich schlagen eine Stunde am Samstag, weil das Modell auf Abstände baut und nicht auf Menge.</li>
          <li><b>Ehrlichkeit.</b> Bei der Selbstkontrolle bringt Schummeln nur dich selbst um die Wiederholung.</li>
          <li><b>Wenig Neues.</b> Acht bis zwölf neue Wörter am Tag reichen. Jedes neue Wort erzeugt künftige Wiederholungen.</li>
        </ul>
      </>
    ),
  },
  {
    titel: "Zum Weiterlesen",
    text: (
      <ul className="help-links">
        <li><a href="https://de.wikipedia.org/wiki/Vergessenskurve" target="_blank" rel="noreferrer">Vergessenskurve (Wikipedia)</a> — Ebbinghaus’ Messung und was daraus folgt</li>
        <li><a href="https://de.wikipedia.org/wiki/Verteiltes_Lernen" target="_blank" rel="noreferrer">Verteiltes Lernen (Wikipedia)</a> — warum Abstände wirken</li>
        <li><a href="https://en.wikipedia.org/wiki/Testing_effect" target="_blank" rel="noreferrer">Testing effect (englisch)</a> — Abrufen schlägt Nachlesen</li>
        <li><a href="https://github.com/open-spaced-repetition/fsrs4anki/wiki" target="_blank" rel="noreferrer">FSRS (englisch)</a> — das Modell, mit dem diese App rechnet</li>
      </ul>
    ),
  },
];

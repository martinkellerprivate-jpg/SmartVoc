/* Deutsche Hilfetexte. Getrennt von der Bedienung, weil Prosa nicht
 * satzweise uebersetzt werden kann: Deutsch und Englisch bauen ihre Saetze
 * anders, und Hervorhebungen sitzen an anderen Stellen. Deshalb zwei
 * vollstaendige Fassungen statt einer Woerterliste. */
import type { Kapitel, Tipp } from "./help.types";

/* ---- Teil 2: Lerntipps. Auch als Einblendung während des Übens benutzt,
 * deshalb hier exportiert und bewusst kurz gehalten. ---- */
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
    titel: "In 30 Sekunden loslegen",
    text: (
      <>
        <p>Oben wählst du die Sprache. Für jede eingeschaltete Sprache legt die App automatisch eine Wortliste <b>Grundwortschatz</b> an — du kannst also sofort üben, ohne vorher etwas einzutippen.</p>
        <p>Geh auf <b>Üben</b> und leg los. Alles andere kannst du später anschauen.</p>
      </>
    ),
  },
  {
    titel: "Die vier Bereiche",
    text: (
      <>
        <p>Unten (auf dem Handy) beziehungsweise oben (am Computer) findest du vier Bereiche:</p>
        <ul>
          <li><b>Üben</b> — hier passiert das Lernen.</li>
          <li><b>Übungsplan</b> — ein Kalender: welche Wortliste wann dran ist und wie weit du bist.</li>
          <li><b>Wortlisten</b> — deine Wörter: anlegen, einfügen, ordnen.</li>
          <li><b>Statistik</b> — wie deine Wörter sitzen und woran sich Üben gerade lohnt.</li>
        </ul>
        <p>Das Zahnrad oben rechts öffnet die Einstellungen, das Fragezeichen daneben diese Hilfe.</p>
      </>
    ),
  },
  {
    titel: "Wortlisten anlegen und füllen",
    text: (
      <>
        <p>Eine <b>Wortliste</b> ist alles, was du zusammen üben willst — meist eine Heftseite, eine Lektion oder ein Prüfungsstoff.</p>
        <p>Drei Wege, sie zu füllen:</p>
        <ul>
          <li><b>Einfügen</b> — kopierte Zeilen oder eine mit KI erstellte Liste einsetzen. Die App erkennt die Spalten selbst.</li>
          <li><b>Von Hand</b> — Wort, Übersetzung, fertig. Beispielsatz und Aussprache sind freiwillig.</li>
          <li><b>Geteilte Liste</b> — jemand schickt dir einen Link, du übernimmst die Liste.</li>
        </ul>
        <p>Ein Wort darf in mehreren Wortlisten liegen. „Lektion 4“ und „Unregelmässige Verben“ sind beide wahr.</p>
      </>
    ),
  },
  {
    titel: "Das Zieldatum",
    text: (
      <>
        <p>Jede Wortliste kann ein <b>Zieldatum</b> haben — meist der Tag der Prüfung. Setz es im Kopf der Wortliste.</p>
        <p>Zwei Dinge passieren dann. Die Liste erscheint im <b>Übungsplan</b> an diesem Tag. Und die App holt ihre Wörter <b>früher zurück</b>, je näher der Termin kommt — je näher, desto häufiger. Werden mehrere Listen zusammen geübt, kommen die Wörter mit dem näheren Termin öfter dran.</p>
      </>
    ),
  },
  {
    titel: "Der Übungsplan",
    text: (
      <>
        <p>Der Kalender zeigt jeden Tag, an dem eine Wortliste dran ist. Die Farbe des Punktes sagt, wie weit die Liste ist: <b>grün</b> heisst bereit, <b>gelb</b> fast, <b>rot</b> noch üben. Sind mehrere Listen an einem Tag dran, steht die Zahl im Punkt, und die Farbe zeigt die schwächste — die braucht zuerst Arbeit.</p>
        <p>Tippe einen Tag an, dann siehst du alle Listen dieses Tages einzeln, jede mit <b>Üben</b> und <b>Statistik</b>. Mehrere Listen kannst du ankreuzen und zusammen üben.</p>
        <p>Der Plan gilt über alle Sprachen. Er zeigt dir also auch, wenn Latein und Französisch in derselben Woche dran sind.</p>
      </>
    ),
  },
  {
    titel: "Die Karte",
    text: (
      <>
        <p>Vorne steht die Frage, hinten die Lösung — wie eine Karteikarte. Oben auf der Karte siehst du immer die Richtung dieser Karte, zum Beispiel <b>EN → DE</b>. Die volle Seite ist die, die du gerade siehst.</p>
        <p>Über der Karte steht dein <b>Übungsfortschritt</b> in dieser Runde, darunter der <b>Beherrschungsstand</b> aller Wörter dieser Übung. Beides steht bewusst neben der Karte und nicht darauf.</p>
        <p>Mit dem Symbol oben rechts machst du die Karte gross. Zurück mit demselben Knopf, mit <b>Esc</b> oder mit einem Tipp daneben.</p>
      </>
    ),
  },
  {
    titel: "Die vier Antwortarten",
    text: (
      <>
        <ul>
          <li><b>Eintippen</b> — du schreibst die Antwort. Das bringt am meisten.</li>
          <li><b>Auswählen</b> — du wählst aus mehreren Möglichkeiten. Leichter, gut für den Anfang.</li>
          <li><b>Selbstkontrolle</b> — du überlegst, drehst die Karte um und sagst selbst, ob es sass. Sei dabei ehrlich; davon hängt ab, wann das Wort wiederkommt.</li>
          <li><b>Durchblättern</b> — nur anschauen. Zählt nicht für deinen Lernstand, und das steht auch so über der Karte.</li>
        </ul>
        <p>Daneben stellst du die <b>Richtung</b> ein. <b>Gemischt</b> heisst: mal so herum, mal anders — die Karte zeigt dir immer, was gerade gefragt ist.</p>
      </>
    ),
  },
  {
    titel: "Die fünf Stufen",
    text: (
      <>
        <p>Jedes Wort hat eine von fünf Stufen. Dieselben fünf überall — auf der Karte, in der Statistik, im Übungsplan:</p>
        <ul>
          <li><b>sitzt</b> — hält lange, kommt selten zurück.</li>
          <li><b>sitzt fast</b> — fast da, noch ein paar Wiederholungen.</li>
          <li><b>wackelt noch</b> — kommt öfter zurück.</li>
          <li><b>neu</b> — frisch gelernt, noch jung.</li>
          <li><b>ungeübt</b> — noch nie abgefragt.</li>
        </ul>
        <p>Die farbige Leiste zeigt, wie sich deine Wörter auf diese fünf verteilen. In der Statistik kannst du eine Stufe antippen und siehst nur noch diese Wörter.</p>
      </>
    ),
  },
  {
    titel: "Wenn etwas nicht stimmt",
    text: (
      <>
        <p>Ein Wort falsch eingetippt? Unter <b>Wortlisten</b> antippen und ändern.</p>
        <p>Eine Wortliste doch nicht gebraucht? Löschen — die Wörter bleiben erhalten und verlassen nur diese Liste.</p>
        <p>Von vorne anfangen? In der <b>Statistik</b> unter „Einstellen“ lässt sich der Lernstand zurücksetzen, entweder für die gewählten Wortlisten oder für alles. Deine Wörter bleiben dabei.</p>
      </>
    ),
  },
];

/* ---- Teil 3: Die Lerntheorie hinter dieser App ---- */
export function LerntheorieDE() {
  return (
    <div className="help-theory">
      <p className="help-lead">
        SmartVoc rät nicht, wann ein Wort wiederkommt. Es rechnet es aus — mit einem
        Modell, an dem seit über hundert Jahren geforscht wird. Etwa fünf Minuten Lesezeit.
      </p>

      <h4>Vergessen ist kein Fehler</h4>
      <p>
        Hermann Ebbinghaus hat sich Ende des 19. Jahrhunderts selbst sinnlose Silben
        beigebracht und gemessen, wie viel davon nach einer Stunde, einem Tag, einer
        Woche noch da war. Heraus kam die <b>Vergessenskurve</b>: Frisch Gelerntes
        fällt zuerst steil ab und dann immer flacher. Nach zwanzig Minuten ist ein
        guter Teil weg, nach einem Tag noch mehr — danach verlangsamt sich der Verlust.
      </p>
      <p>
        Das Entscheidende an seiner Messung ist nicht der Verlust, sondern was danach
        passiert: Nach jeder Wiederholung fällt die Kurve <b>flacher</b> ab als vorher.
        Das Wort hält länger. Vergessen ist also kein Versagen, sondern der Normalfall —
        und der Hebel, an dem man ansetzen kann.
      </p>

      <h4>Der beste Zeitpunkt ist kurz vor dem Vergessen</h4>
      <p>
        Wiederholt man zu früh, ist das Wort noch präsent und die Wiederholung bringt
        wenig. Wiederholt man zu spät, ist es weg und man lernt es neu. Dazwischen liegt
        ein Fenster, in dem eine Wiederholung am meisten bewirkt: wenn das Erinnern
        gerade noch gelingt, aber Anstrengung kostet. Man nennt das <b>verteiltes Lernen</b>
        (spaced repetition), und der Effekt gehört zu den am besten belegten der
        Lernpsychologie.
      </p>
      <p>
        Genau dieses Fenster sucht die App für jedes einzelne Wort. Deshalb kommt ein
        Wort, das du sicher kannst, erst in drei Wochen wieder — und eines, bei dem du
        gezögert hast, schon morgen.
      </p>

      <h4>Abrufen ist stärker als Nachlesen</h4>
      <p>
        Ein zweiter, ebenso gut belegter Befund: Sich an etwas zu <b>erinnern</b> festigt
        stärker, als dasselbe noch einmal zu <b>lesen</b>. Der Fachbegriff ist
        <b> Testeffekt</b>. Wer eine Vokabelliste fünfmal durchliest, hat weniger davon
        als wer sie einmal liest und sich viermal selbst abfragt — obwohl sich das
        Durchlesen sicherer anfühlt.
      </p>
      <p>
        Deshalb ist <b>Eintippen</b> die empfohlene Antwortart und Durchblättern
        ausdrücklich als „zählt nicht“ gekennzeichnet. Und deshalb lohnt es sich, vor
        dem Umdrehen wirklich zu überlegen, auch wenn es unbequem ist.
      </p>

      <h4>Was die App für jedes Wort schätzt</h4>
      <p>
        Im Hintergrund läuft <b>FSRS</b>, ein modernes Gedächtnismodell. Es hält für jedes
        Wort drei Zahlen fest:
      </p>
      <ul>
        <li><b>Wie lange es hält.</b> Nach jeder richtigen Antwort wächst dieser Wert — das ist die flacher werdende Vergessenskurve.</li>
        <li><b>Wie zäh es ist.</b> Manche Wörter sind störrisch, egal wie oft man sie übt. Die kommen häufiger zurück und werden als „hartnäckig“ gekennzeichnet.</li>
        <li><b>Wie sicher du es jetzt noch kannst.</b> Sinkt dieser Wert unter dein Ziel, ist das Wort fällig.</li>
      </ul>
      <p>
        Dieses Ziel kannst du in den Einstellungen verschieben. Ein höheres Ziel heisst:
        häufiger üben, dafür sitzt mehr. Ein niedrigeres: weniger Karten pro Tag, dafür
        vergisst du mehr. Es gibt hier kein Richtig — nur einen Tausch, den du selbst
        machst.
      </p>

      <h4>Warum es vor einer Prüfung anders läuft</h4>
      <p>
        Setzt du einer Wortliste ein Zieldatum, hebt die App das Ziel für diese Wörter
        an, je näher der Termin rückt. Das ist keine zweite Rechnung, sondern dieselbe
        mit einem strengeren Ziel: Ein höheres Behaltensziel bedeutet kürzere Abstände,
        also kommen die Wörter öfter. Nach dem Termin fällt alles auf dein normales Ziel
        zurück.
      </p>

      <h4>Was du selbst in der Hand hast</h4>
      <ul>
        <li><b>Regelmässigkeit.</b> Zehn Minuten täglich schlagen eine Stunde am Samstag — weil das Modell auf Abstände baut, nicht auf Menge.</li>
        <li><b>Ehrlichkeit.</b> Bei der Selbstkontrolle bringt Schummeln nur dich selbst um die Wiederholung.</li>
        <li><b>Wenig Neues.</b> Acht bis zwölf neue Wörter am Tag reichen. Jedes neue Wort erzeugt künftige Wiederholungen.</li>
      </ul>

      <h4>Warum sich Lernen anstrengend anfühlen darf</h4>
      <p>
        Die Lernforschung kennt einen Begriff, der zuerst wie ein Widerspruch klingt:
        <b> wünschenswerte Erschwernisse</b>. Gemeint sind Hürden, die das Üben im
        Moment mühsamer machen und gerade deshalb mehr bringen. Verteiltes Üben ist
        eine davon. Selbst abrufen statt nachlesen ist eine zweite. Die dritte ist
        <b>Mischen</b>: Wörter durcheinander üben statt eine Liste nach der anderen am
        Stück.
      </p>
      <p>
        Alle drei haben denselben Haken. Sie fühlen sich schlechter an, als sie sind.
        Wer eine Liste fünfmal am Stück durchgeht, erlebt sich als sicher — und ist es
        eine Woche später nicht. Wer gemischt und verteilt übt, macht unterwegs mehr
        Fehler und behält am Ende mehr. Deshalb ist das Gefühl beim Üben ein
        schlechter Ratgeber, und deshalb nimmt die App dir die Reihenfolge ab.
      </p>

      <h4>Was die Zahlen bedeuten, die du siehst</h4>
      <p>
        Der <b>Übungsfortschritt</b> über der Karte gilt nur für die laufende Runde: Wie
        viel von dem, was du dir für jetzt vorgenommen hast, ist erledigt. Er beginnt
        bei jeder Runde neu.
      </p>
      <p>
        Der <b>Beherrschungsstand</b> unter der Karte ist etwas anderes: Er zeigt, wie
        sich alle Wörter dieser Übung auf die fünf Stufen verteilen. Er verändert sich
        langsam, über Wochen — und er ist die Zahl, die im Übungsplan als Ampel und in
        der Statistik als Leiste wieder auftaucht. Es ist überall dieselbe Rechnung:
        der Anteil der Wörter, die sitzen oder fast sitzen.
      </p>

      <h4>Zum Weiterlesen</h4>
      <ul className="help-links">
        <li><a href="https://de.wikipedia.org/wiki/Vergessenskurve" target="_blank" rel="noreferrer">Vergessenskurve (Wikipedia)</a> — Ebbinghaus’ Messung und was daraus folgt</li>
        <li><a href="https://de.wikipedia.org/wiki/Verteiltes_Lernen" target="_blank" rel="noreferrer">Verteiltes Lernen (Wikipedia)</a> — warum Abstände wirken</li>
        <li><a href="https://en.wikipedia.org/wiki/Testing_effect" target="_blank" rel="noreferrer">Testing effect (englisch)</a> — Abrufen schlägt Nachlesen</li>
        <li><a href="https://github.com/open-spaced-repetition/fsrs4anki/wiki" target="_blank" rel="noreferrer">FSRS (englisch)</a> — das Modell, mit dem diese App rechnet</li>
      </ul>
    </div>
  );
}


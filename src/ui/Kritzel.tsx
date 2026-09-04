/* Handgezeichnete Bilder für die Hilfe.
 *
 * Warum überhaupt Bilder: Die Hilfe erklärte bisher in Sätzen, was man auf
 * dem Bildschirm sieht — und beschrieb damit Dinge, die jeder ohnehin
 * bemerkt. Was ein Satz NICHT kann, ist eine Kurve zeigen oder vier
 * Antwortarten nebeneinanderstellen. Genau dafür sind diese Bilder da; wo
 * ein Satz reicht, steht keines.
 *
 * Warum gekritzelt: Eine saubere Nachzeichnung der Oberfläche wäre ein
 * zweites, schlechteres Abbild der App — und veraltet beim nächsten Umbau.
 * Eine Skizze behauptet gar nicht erst, die Wahrheit zu sein; sie zeigt die
 * Idee. Ausserdem ist die Zielgruppe vierzehn und nicht vierzig.
 *
 * Technisch: ein Rauschfilter verschiebt die Linien leicht, das ergibt den
 * Zittereffekt. Der Filter liegt NUR auf den Strichen, nie auf der Schrift
 * — verschobene Buchstaben sehen kaputt aus, nicht handgemacht. Alle Farben
 * kommen aus den Schema-Variablen, also folgen die Bilder Hell und Dunkel
 * und allen drei Farbschemata von selbst.
 */
import React from "react";

let lfd = 0;

/** Rahmen für ein Bild: eigener Filter je Figur (Kennungen müssen im
 *  Dokument eindeutig sein), Beschriftung darunter. */
function Figur({ vb, hoehe, titel, children }: {
  vb: string; hoehe?: number; titel?: string; children: (f: string) => React.ReactNode;
}) {
  const id = React.useMemo(() => `kr${++lfd}`, []);
  return (
    <figure className="kritzel">
      <svg viewBox={vb} style={{ height: hoehe }} role="img" aria-label={titel || ""}>
        <defs>
          <filter id={id} x="-6%" y="-6%" width="112%" height="112%">
            <feTurbulence type="turbulence" baseFrequency="0.022" numOctaves="3" seed="7" result="r" />
            <feDisplacementMap in="SourceGraphic" in2="r" scale="1.7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        {children(`url(#${id})`)}
      </svg>
      {titel && <figcaption>{titel}</figcaption>}
    </figure>
  );
}

/* ================================================================== UI */

/** Eine Karteikarte, vorne und hinten. */
export function KritzelKarte({ titel }: { titel?: string }) {
  return (
    <Figur vb="0 0 300 116" titel={titel}>
      {(f) => (
        <g filter={f} fill="none" stroke="var(--ink)" strokeWidth="1.6"
           strokeLinecap="round" strokeLinejoin="round">
          <rect x="10" y="14" width="112" height="80" rx="5" fill="var(--card)" />
          <text x="66" y="52" textAnchor="middle" fill="var(--ink)" stroke="none"
                fontSize="15" fontFamily="var(--serif)">the tree</text>
          <text x="66" y="72" textAnchor="middle" fill="var(--ink-faint)" stroke="none"
                fontSize="9">The tree is tall.</text>
          <path d="M138 54h30M160 48l8 6-8 6" stroke="var(--amber)" strokeWidth="2" />
          <rect x="184" y="14" width="112" height="80" rx="5" fill="var(--card)" />
          <text x="240" y="52" textAnchor="middle" fill="var(--ink)" stroke="none"
                fontSize="15" fontFamily="var(--serif)">der Baum</text>
          <text x="240" y="72" textAnchor="middle" fill="var(--ink-faint)" stroke="none"
                fontSize="9">Der Baum ist hoch.</text>
          <text x="66" y="108" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">Frage</text>
          <text x="240" y="108" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">Lösung</text>
        </g>
      )}
    </Figur>
  );
}

/** Die vier Antwortarten — drei zusammen, eine abgesetzt. */
export function KritzelAntwortarten({ titel }: { titel?: string }) {
  const K = (x: number, b: string, farbe: string) => (
    <g key={x}>
      <rect x={x} y="14" width="62" height="46" rx="5" fill="var(--card)" stroke={farbe} />
      <text x={x + 31} y={b.endsWith("-") ? 40 : 42} textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="9">{b}</text>
    </g>
  );
  return (
    <Figur vb="0 0 300 92" titel={titel}>
      {(f) => (
        <g filter={f} fill="none" stroke="var(--ink)" strokeWidth="1.5"
           strokeLinecap="round" strokeLinejoin="round">
          {K(6, "Eintippen", "var(--ink)")}
          {K(74, "Multiple-", "var(--ink)")}
          <text x="105" y="52" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="9">Choice</text>
          {K(142, "Selbst-", "var(--ink)")}
          <text x="173" y="52" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="9">kontrolle</text>
          <path d="M214 10v54" stroke="var(--line)" strokeDasharray="3 4" />
          <rect x="226" y="14" width="66" height="46" rx="5" fill="var(--bg-2)" stroke="var(--ink-faint)" strokeDasharray="4 3" />
          <text x="259" y="36" textAnchor="middle" fill="var(--ink-soft)" stroke="none" fontSize="9">Nur durch-</text>
          <text x="259" y="48" textAnchor="middle" fill="var(--ink-soft)" stroke="none" fontSize="9">blättern</text>
          <text x="80" y="80" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">zählen für deinen Lernstand</text>
          <text x="259" y="80" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">zählt nicht</text>
        </g>
      )}
    </Figur>
  );
}

/** Drei Kalendertage mit Ampel. */
export function KritzelKalender({ titel }: { titel?: string }) {
  const Tag = (x: number, z: string, farbe: string, unten: string) => (
    <g key={x}>
      <rect x={x} y="14" width="76" height="58" rx="7"
            fill={`color-mix(in srgb, ${farbe} 22%, var(--card))`} stroke={farbe} strokeWidth="1.8" />
      <text x={x + 38} y="40" textAnchor="middle" fill="var(--ink)" stroke="none"
            fontSize="17" fontWeight="700">{z}</text>
      <rect x={x + 14} y="46" width="48" height="15" rx="4" fill="var(--card)" stroke="none" />
      <text x={x + 38} y="57" textAnchor="middle" fill="var(--ink-soft)" stroke="none" fontSize="9">{unten}</text>
    </g>
  );
  return (
    <Figur vb="0 0 300 100" titel={titel}>
      {(f) => (
        <g filter={f} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {Tag(6, "9", "var(--ok)", "1 Liste")}
          {Tag(112, "12", "var(--warn)", "2 Listen")}
          {Tag(218, "19", "var(--bad)", "1 Liste")}
          <text x="44" y="88" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">bereit</text>
          <text x="150" y="88" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">auf Kurs</text>
          <text x="256" y="88" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">im Rückstand</text>
        </g>
      )}
    </Figur>
  );
}

/** Die fünf Stufen als Leiste. */
export function KritzelLeiste({ titel }: { titel?: string }) {
  const teile: [number, number, string, string][] = [
    [8, 96, "var(--ok)", "sitzt"], [104, 52, "var(--warn)", "fast"],
    [156, 40, "var(--bad)", "wackelt"], [196, 48, "var(--blue)", "neu"],
    [244, 48, "var(--ink-faint)", "ungeübt"],
  ];
  return (
    <Figur vb="0 0 300 66" titel={titel}>
      {(f) => (
        <g filter={f} strokeLinecap="round">
          {teile.map(([x, b, c]) => <rect key={x} x={x} y="14" width={b - 3} height="16" rx="4" fill={c} />)}
          {teile.map(([x, b, c, t]) => (
            <text key={t} x={x + (b - 3) / 2} y="48" textAnchor="middle" fill="var(--ink-faint)"
                  stroke="none" fontSize="8.5">{t}</text>
          ))}
        </g>
      )}
    </Figur>
  );
}

/** Zwei Ebenen einer Wortliste. */
export function KritzelListe({ titel }: { titel?: string }) {
  return (
    <Figur vb="0 0 300 120" titel={titel}>
      {(f) => (
        <g filter={f} fill="none" stroke="var(--ink)" strokeWidth="1.5"
           strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="14" width="118" height="88" rx="6" fill="var(--card)" />
          <text x="16" y="30" fill="var(--ink)" stroke="none" fontSize="10" fontWeight="700">Unité 3</text>
          <path d="M16 40h98" stroke="var(--line)" />
          <rect x="16" y="48" width="98" height="18" rx="4" stroke="var(--line)" />
          <text x="24" y="61" fill="var(--ink-soft)" stroke="none" fontSize="8.5">Wörter ansehen</text>
          <rect x="16" y="72" width="98" height="18" rx="4" stroke="var(--line)" />
          <text x="24" y="85" fill="var(--ink-soft)" stroke="none" fontSize="8.5">zusammenführen</text>

          <path d="M136 58h28M156 52l8 6-8 6" stroke="var(--amber)" strokeWidth="2" />

          <rect x="176" y="14" width="118" height="88" rx="6" fill="var(--card)" />
          {[30, 48, 66, 84].map((y, i) => (
            <g key={y}>
              <path d={`M182 ${y - 6}v13`} stroke={["var(--ok)", "var(--warn)", "var(--bad)", "var(--ink-faint)"][i]} strokeWidth="3" />
              <rect x="188" y={y - 8} width="100" height="15" rx="4" stroke="var(--line)" />
              <text x="194" y={y + 3} fill="var(--ink)" stroke="none" fontSize="8">{["arbre", "maison", "chien", "fleur"][i]}</text>
              <text x="248" y={y + 3} fill="var(--ink-soft)" stroke="none" fontSize="8">{["Baum", "Haus", "Hund", "Blume"][i]}</text>
            </g>
          ))}
        </g>
      )}
    </Figur>
  );
}

/* ============================================================= Theorie */

/** Die Vergessenskurve, und was Wiederholen daran ändert. */
export function KritzelVergessen({ titel }: { titel?: string }) {
  return (
    <Figur vb="0 0 300 140" titel={titel}>
      {(f) => (
        <g filter={f} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M28 12v96h258" stroke="var(--ink-faint)" strokeWidth="1.3" />
          <path d="M28 18C60 74 92 96 150 102s90 4 132 4" stroke="var(--bad)" strokeWidth="2"
                strokeDasharray="5 4" />
          <path d="M28 18C48 56 66 70 92 74" stroke="var(--ink)" strokeWidth="2" />
          <path d="M92 74V20" stroke="var(--ok)" strokeWidth="1.3" strokeDasharray="3 3" />
          <path d="M92 20C118 50 140 62 166 66" stroke="var(--ink)" strokeWidth="2" />
          <path d="M166 66V22" stroke="var(--ok)" strokeWidth="1.3" strokeDasharray="3 3" />
          <path d="M166 22C204 44 240 52 286 56" stroke="var(--ink)" strokeWidth="2" />
          <circle cx="92" cy="20" r="3.4" fill="var(--ok)" stroke="none" />
          <circle cx="166" cy="22" r="3.4" fill="var(--ok)" stroke="none" />
          <text x="16" y="16" fill="var(--ink-faint)" stroke="none" fontSize="9">alles</text>
          <text x="8" y="106" fill="var(--ink-faint)" stroke="none" fontSize="9">weg</text>
          <text x="286" y="124" textAnchor="end" fill="var(--ink-faint)" stroke="none" fontSize="9">Zeit →</text>
          <text x="186" y="98" fill="var(--bad)" stroke="none" fontSize="9">ohne Wiederholen</text>
          <text x="176" y="14" fill="var(--ok)" stroke="none" fontSize="9">mit</text>
        </g>
      )}
    </Figur>
  );
}

/** Zu früh, gerade richtig, zu spät. */
export function KritzelFenster({ titel }: { titel?: string }) {
  return (
    <Figur vb="0 0 300 116" titel={titel}>
      {(f) => (
        <g filter={f} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="112" y="14" width="76" height="62" rx="6"
                fill="color-mix(in srgb, var(--ok) 18%, var(--card))" stroke="var(--ok)" strokeWidth="1.8" />
          <path d="M20 46h268" stroke="var(--ink-faint)" strokeWidth="1.3" />
          <path d="M28 18C56 60 84 76 288 82" stroke="var(--ink)" strokeWidth="2" />
          <text x="66" y="96" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">zu früh</text>
          <text x="150" y="96" textAnchor="middle" fill="var(--ok)" stroke="none" fontSize="9" fontWeight="700">jetzt</text>
          <text x="240" y="96" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">zu spät</text>
          <text x="66" y="34" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="8.5">weisst du noch</text>
          <text x="240" y="34" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="8.5">ist weg</text>
        </g>
      )}
    </Figur>
  );
}

/** Lesen gegen Abfragen. */
export function KritzelTesteffekt({ titel }: { titel?: string }) {
  return (
    <Figur vb="0 0 300 116" titel={titel}>
      {(f) => (
        <g filter={f} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="34" y="62" width="72" height="30" rx="5" fill="var(--bg-2)" stroke="var(--ink-faint)" strokeWidth="1.5" />
          <rect x="192" y="20" width="72" height="72" rx="5"
                fill="color-mix(in srgb, var(--ok) 20%, var(--card))" stroke="var(--ok)" strokeWidth="1.8" />
          <path d="M20 92h268" stroke="var(--ink-faint)" strokeWidth="1.3" />
          <text x="70" y="108" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">5× durchlesen</text>
          <text x="228" y="108" textAnchor="middle" fill="var(--ink)" stroke="none" fontSize="9">1× lesen, 4× abfragen</text>
          <text x="70" y="52" textAnchor="middle" fill="var(--ink-faint)" stroke="none" fontSize="9">fühlt sich sicher an</text>
          <text x="228" y="12" textAnchor="middle" fill="var(--ok)" stroke="none" fontSize="9">bleibt hängen</text>
        </g>
      )}
    </Figur>
  );
}

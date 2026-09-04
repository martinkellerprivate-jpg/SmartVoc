/* ===================================================================
 * Die Spalten — EINE Quelle fuer alles, was Woerter als Tabelle sieht.
 *
 * Vier Stellen sprachen bisher ueber dieselben Spalten, und drei davon
 * widersprachen sich: der KI-Prompt nannte sieben Spalten und behauptete
 * im naechsten Satz, es seien acht; die Excel-Vorlage liess die deutschen
 * Beispielsaetze ganz weg und setzte die Aussprache an eine andere Stelle;
 * der Einleser suchte sich die Spalten ueber Ueberschriften zusammen.
 *
 * Jetzt steht die Reihenfolge hier, und Prompt, Vorlage, Ausgabe und
 * Einlesen halten sich daran. Damit gilt: was die App ausgibt, liest sie
 * auch wieder ein — ohne Verlust.
 * =================================================================== */
import { isLatinPair } from "./pairs";

/* Trennzeichen der Textform. Steht es im Inhalt, zerfaellt die Zeile beim
 * Einlesen in zu viele Spalten — deshalb wird es beim Ausgeben ersetzt. */
export const TRENNER = " | ";

export function spalten(pair: string, fremdLabel: string): string[] {
  return isLatinPair(pair)
    ? ["Grundform", "Lernform", "Wortart", "Deutsch",
       "Beispielsatz 1", "Beispielsatz 1 deutsch", "Beispielsatz 2", "Beispielsatz 2 deutsch", "Aussprache"]
    : [fremdLabel, "Deutsch",
       "Beispielsatz 1", "Beispielsatz 1 deutsch", "Beispielsatz 2", "Beispielsatz 2 deutsch", "Aussprache"];
}

const sauber = (v: any) => String(v ?? "").replace(/\|/g, "/").replace(/[\r\n\t]+/g, " ").trim();

/* Ein Wort als Zeile, in der Reihenfolge von `spalten`. Leere Felder
 * bleiben leer und werden trotzdem geschrieben: der Einleser erkennt das
 * vollstaendige Format an der Spaltenzahl. */
export function wortZeile(w: any, pair: string, fremdSchluessel: string): string[] {
  const bsp = w.examples || [];
  const bspDe = w.examplesDe || [];
  const schwanz = [bsp[0], bspDe[0], bsp[1], bspDe[1], w.phonetic].map(sauber);
  return isLatinPair(pair)
    ? [sauber(w.grundform), sauber(w.lernform), sauber(w.wortart), sauber(w.de), ...schwanz]
    : [sauber(w[fremdSchluessel]), sauber(w.de), ...schwanz];
}

/* Die Textform: eine Zeile je Wort, keine Ueberschrift. Eine Ueberschrift
 * traegt hier Trennzeichen und waere beim Einlesen ein Wort. */
export function alsText(words: any[], pair: string, fremdSchluessel: string): string {
  return words.map((w) => wortZeile(w, pair, fremdSchluessel).join(TRENNER)).join("\n");
}

/* Die Form fuer Teilen und Sicherung: dieselben Felder, aber benannt statt
 * nach Position — eine geteilte Liste soll auch dann noch lesbar sein,
 * wenn sich die Spaltenreihenfolge einmal aendert. */
export function wortNutzlast(w: any, pair: string, fremdSchluessel: string) {
  const kopf = isLatinPair(pair)
    ? { grundform: w.grundform || "", lernform: w.lernform || "", wortart: w.wortart || "", de: w.de || "" }
    : { [fremdSchluessel]: w[fremdSchluessel] || "", de: w.de || "" };
  const bsp = (w.examples || []).map((s: any) => String(s || "").trim());
  const bspDe = (w.examplesDe || []).map((s: any) => String(s || "").trim());
  const rest: any = {};
  if (bsp.some(Boolean)) rest.examples = bsp;
  if (bspDe.some(Boolean)) rest.examplesDe = bspDe;
  if (w.phonetic) rest.phonetic = String(w.phonetic).trim();
  return { ...kopf, ...rest };
}

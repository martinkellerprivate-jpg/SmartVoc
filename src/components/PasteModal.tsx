/* Paste / clipboard quick-add (Phase 5). Parses pasted text into rows and
 * hands them to the shared ReviewModal. Includes a pair-aware "AI prompt"
 * the user can paste into their own chat to get a correctly-formatted list. */
import { useState, useEffect } from "react";
import { txt } from "../lib/i18n";
import { Icon } from "../ui/Icon";
import { useToast } from "../ui/Toast";
import { PAIRS, isLatinPair } from "../lib/pairs";
import { spalten, TRENNER, WORTARTEN, GENUS } from "../lib/export";

/* EN/FR line splitter: columns Fremd | Deutsch | Topic. Same delimiters as the
 * scan heuristic (tab / : | – — - / 2+ spaces). */
/* Split one pasted line into columns.
 *
 * Two bugs used to live here, and both fired exactly on the rows the AI prompt
 * asks for:
 *
 * 1. Every separator was accepted at once — tab, "|", colon, hyphen, en dash.
 *    Those last three also occur INSIDE the content: "e-mail", "Nun denn: los!",
 *    and most example sentences carry one. A single dash in a sentence tore the
 *    row into extra columns and everything after it landed in the wrong field.
 *    So: use the strongest separator the line actually contains, and only fall
 *    back to the loose set when there is no "|", no tab and no column gap.
 *
 * 2. Empty columns were dropped. The prompt tells the AI to leave the second
 *    example empty and still write the "|", so "dog|der Hund|Satz||Tiere" is
 *    normal — and dropping the empty shifted "Tiere" into the example slot.
 *    Inner empties are kept now; only trailing ones go, since they carry
 *    nothing. */
function columns(s: string): string[] {
  let p: string[];
  if (s.includes("|")) p = s.split("|");
  else if (s.includes("\t")) p = s.split("\t");
  else if (/\s{2,}/.test(s)) p = s.split(/\s{2,}/);
  else p = s.split(/\s*[–—:-]\s*/);
  p = p.map((x) => x.trim());
  while (p.length && p[p.length - 1] === "") p.pop();
  return p;
}

/* Eine Zeile in ein Wort. EIN Spaltensatz fuer alle Sprachen (lib/export.ts):
 *
 *   Fremdsprache | Lernform | Wortart | Deutsch | Bsp1 | Bsp1 dt | Bsp2 | Bsp2 dt | Aussprache
 *
 * Kuerzere Zeilen sind von Hand getippt und behalten ihre alte Bedeutung --
 * deshalb entscheidet die Spaltenzahl, nicht der Inhalt. Bei vier Spalten
 * gehen die beiden Lesarten auseinander: Latein meint dort seine
 * Stammformen, alle anderen zwei Beispielsaetze. Also entscheidet das Paar.
 */
function zeileZuWort(p: string[], isLat: boolean) {
  const kopf = isLat ? "grundform" : "fgn";
  const w: any = { [kopf]: p[0] || "" };
  if (p.length >= 10) {
    w.lernform = p[1]; w.genus = p[2]; w.wortart = p[3]; w.de = p[4];
    w.examples = [p[5], p[7]]; w.examplesDe = [p[6], p[8]];
    w.phonetic = p[9];
    return w;
  }
  if (isLat) {
    // Grundform | Lernform | Wortart | Deutsch | Bsp1 | Bsp2 | Aussprache
    if (p.length >= 7) { w.lernform = p[1]; w.wortart = p[2]; w.de = p[3]; w.examples = [p[4], p[5]].filter(Boolean); w.phonetic = p[6]; return w; }
    if (p.length >= 5) { w.lernform = p[1]; w.wortart = p[2]; w.de = p[3]; w.examples = [p[4]].filter(Boolean); return w; }
    if (p.length === 4) { w.lernform = p[1]; w.wortart = p[2]; w.de = p[3]; return w; }
    if (p.length === 3) { w.lernform = p[1]; w.de = p[2]; return w; }
    w.de = p[1] || "";
    return w;
  }
  // Fremdsprache | Deutsch | Bsp1 | Bsp2 | Aussprache
  w.de = p[1] || "";
  if (p.length >= 5) { w.examples = [p[2], p[3]].filter(Boolean); w.phonetic = p[4]; return w; }
  if (p.length === 4) { w.examples = [p[2], p[3]].filter(Boolean); return w; }
  if (p.length === 3) { w.examples = [p[2]].filter(Boolean); return w; }
  return w;
}

const KOPFZEILE = /^(unit|lesson|lektion|page|seite|vokabel|words?|english|fran|deutsch|german|grundform|latein|wort)\b/i;

function splitZeilen(text: string, isLat: boolean) {
  const out: any[] = [];
  (text || "").split(/\r?\n/).forEach((line) => {
    const s = line.trim();
    if (!s || s.length < 2) return;
    if (KOPFZEILE.test(s) && !/[-–—:|\t]/.test(s)) return;
    out.push(zeileZuWort(columns(s), isLat));
  });
  return out;
}

function rawLines(text: string, isLat: boolean) {
  return (text || "").split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length >= 2)
    .map((l) => isLat ? { grundform: l } : { fgn: l });
}

/* Das Beispiel im Textfeld muss in der eingestellten Sprache stehen. Es
 * zeigte immer Englisch -- auch bei Franzoesisch oder Latein, und dann
 * schreibt jemand englische Woerter in eine franzoesische Liste. */
const BEISPIELE: Record<string, string> = {
  "en-de": "dog | der Hund\ncat | die Katze",
  "fr-de": "le chien | der Hund\nle chat | die Katze",
  "es-de": "el perro | der Hund\nla casa | das Haus",
  "it-de": "il cane | der Hund\nla casa | das Haus",
  "pt-de": "o cão | der Hund\na casa | das Haus",
  "la-de": "canis | canis, canis, m. | Nomen | der Hund\nliber | liber, librī, m. | Nomen | das Buch",
};

export function PasteModal({ open, pair, onParsed, onClose, initialText }: { open: boolean; pair: string; onParsed: (rows: any[]) => void; onClose: () => void; initialText?: string }) {
  const BEISPIEL = BEISPIELE[pair] || BEISPIELE["en-de"];
  const toast = useToast();
  const isLat = isLatinPair(pair);
  const P = PAIRS[pair] || PAIRS["en-de"];
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (open) { setText(initialText || ""); setCopied(false); } }, [open, initialText]);
  if (!open) return null;

  /* Zwei Aufgaben, ein Prompt: Wörter aus einem Foto ABSCHREIBEN (der übliche
   * Fall — eine Heftseite) oder eine Liste zu einem Thema ERZEUGEN. Die alte
   * Fassung konnte nur das Zweite und hatte einen Platzhalter „…", den man
   * ausfüllen musste; wer sie unverändert einfügte, bekam erfundene Wörter.
   *
   * Die Spaltenzahl ist fix und jede Spalte wird geschrieben, auch die leeren.
   * Der Parser erkennt das neue Format an genau dieser Anzahl. */
  /* Die Spalten stehen in lib/export.ts -- dieselbe Reihenfolge, in der die
   * App auch ausgibt. Die Zahl daneben wurde frueher von Hand gefuehrt und
   * war falsch (sie nannte 8 statt 7 und 10 statt 9), sodass der Prompt eine
   * Spalte zu viel verlangte. Jetzt wird sie gezaehlt. */
  const SPALTEN = spalten(pair, P.foreignLabel);
  const COLS = SPALTEN.join(TRENNER);
  const nCols = SPALTEN.length;
  /* "Lernform" gibt es in jeder Vorlage, gefuellt wird sie nur bei Latein.
   * Deshalb steht die Regel dazu auch nur dort -- und fuer alle anderen
   * Sprachen der ausdrueckliche Hinweis, die Spalte leer zu lassen: sonst
   * denkt sich eine KI etwas aus. */
  const formenRegel = isLat
    ? "Formen = die Stammformen (Nomen: Nominativ, Genitiv, Genus; Verb: 4 Stammformen; Adjektiv: 3 Genus-Endungen).\n"
    : `Formen = die Formen, die man zum Wort mitlernt: beim Nomen Singular und Plural, beim Verb die Gegenwart oder die unregelmässigen Formen. Beispiele: "child, children" · "aller: je vais, tu vas, il va". Weisst du nichts Nennenswertes, lass es leer.\n`;
  const aiPrompt =
    `Ich gebe dir ein Foto einer Vokabelliste (z. B. eine Heftseite). Schreib die Wörter daraus ab.\n` +
    `Steht kein Foto dabei, erstelle stattdessen eine Vokabelliste ${isLat ? "Latein" : P.foreignLabel} ⇄ Deutsch zu dem Thema, das ich nenne.\n\n` +
    `Gib NUR eine Tabelle aus, eine Zeile pro Wort, Spalten getrennt durch " | ", in genau dieser Reihenfolge:\n${COLS}\n\n` +
    formenRegel +
    `Genus = das Geschlecht des Fremdworts, genau eines von: ${GENUS.join(", ")}. Nur bei Nomen; sonst leer. Im Englischen immer leer.\n` +
    `Wortart = genau eines von: ${WORTARTEN.join(", ")}. Nichts anderes, keine Abkürzungen.\n` +
    `Jede Zeile hat genau ${nCols} Spalten. Was du nicht weisst, lässt du leer — das Trennzeichen setzt du trotzdem.\n` +
    `Beispielsätze: kurz und einfach, auf ${isLat ? "Latein" : P.foreignLabel}; direkt daneben die deutsche Übersetzung. Beides ist freiwillig, aber nur zusammen sinnvoll.\n` +
    `Aussprache = Lautschrift des Fremdworts (IPA, ohne Klammern); wenn unsicher, leer lassen.\n` +
    `Deutsche Nomen mit Artikel (der/die/das).\n` +
    `Verwende " | " nirgends im Text selbst. Keine Nummerierung, keine Überschrift, kein weiterer Text.`;

  const copyPrompt = () => navigator.clipboard?.writeText(aiPrompt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); });
  const pasteClipboard = async () => {
    try { const t = await navigator.clipboard.readText(); if (t) setText(t); else toast("Zwischenablage ist leer", "x"); }
    catch { toast("Kein Zugriff auf die Zwischenablage — bitte manuell einfügen", "x"); }
  };

  const proceed = () => {
    if (!text.trim()) return;
    let rows = splitZeilen(text, isLat);
    if (!rows.length) rows = rawLines(text, isLat); // never crash / never empty
    onParsed(rows);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560, width: "94vw" }}>
        <div className="modal-head">
          <div className="modal-title">{txt("Einfügen")} <span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>· {P.foreignLabel} ⇄ Deutsch</span></div>
          <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        {/* Der KI-Weg war eine eigene Zeile im Blatt davor und fuehrte in
            genau dieses Fenster. Jetzt steht er hier, wo er gebraucht wird:
            als Satz und als Knopf unter dem Textfeld. */}
        <div className="tips-intro" style={{ marginBottom: 12 }}>
          Füge eine Wortliste ein — eine Zeile pro Wort, Spalten getrennt durch Tab, „|", „–" oder „:".
          {isLat ? " Kurz genügt: Grundform | Formen | Wortart | Deutsch." : ` Kurz genügt: ${P.foreignLabel} | Deutsch.`}
          {" "}{txt("Nichts zum Kopieren? Der KI-Prompt unten holt dir die Liste aus einem Foto der Heftseite.")}
        </div>

        <textarea className="field" style={{ minHeight: 150, resize: "vertical", fontFamily: "var(--mono)", fontSize: 16 }}
          placeholder={BEISPIEL}
          value={text} onChange={(e) => setText(e.target.value)} />

        <div className="toolbelt" style={{ justifyContent: "flex-start", marginTop: 10 }}>
          <button className="btn btn-ghost btn-sm" onClick={pasteClipboard}><Icon name="download" size={14} /> {txt("Aus Zwischenablage")}</button>
          <button className="btn btn-ghost btn-sm" onClick={copyPrompt}><Icon name={copied ? "check" : "sparkle"} size={14} /> {copied ? "Prompt kopiert" : "KI-Prompt kopieren"}</button>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>{txt("Abbrechen")}</button>
          <button className="btn btn-primary" disabled={!text.trim()} onClick={proceed}><Icon name="arrowRight" size={15} /> {txt("Weiter zum Prüfen")}</button>
        </div>
      </div>
    </div>
  );
}

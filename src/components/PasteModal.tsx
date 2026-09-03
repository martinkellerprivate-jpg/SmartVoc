/* Paste / clipboard quick-add (Phase 5). Parses pasted text into rows and
 * hands them to the shared ReviewModal. Includes a pair-aware "AI prompt"
 * the user can paste into their own chat to get a correctly-formatted list. */
import { useState, useEffect } from "react";
import { txt } from "../lib/i18n";
import { Icon } from "../ui/Icon";
import { useToast } from "../ui/Toast";
import { PAIRS, isLatinPair } from "../lib/pairs";

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

function splitForeign(text: string) {
  const out: any[] = [];
  (text || "").split(/\r?\n/).forEach((line) => {
    const s = line.trim();
    if (!s || s.length < 2) return;
    if (/^(unit|lesson|lektion|page|seite|vokabel|words?|english|fran|deutsch|german)\b/i.test(s) && !/[-–—:|\t]/.test(s)) return;
    const p = columns(s);
    /* Ab sieben Spalten gilt das Format, in dem jeder Beispielsatz sein
     * deutsches Gegenstück mitbringt:
     *   Fremd | Deutsch | Bsp1 | Bsp1 dt | Bsp2 | Bsp2 dt | Aussprache
     * Der KI-Prompt schreibt immer alle sieben, leere eingeschlossen.
     * Kürzere Zeilen sind von Hand getippt und behalten ihre Bedeutung —
     * deshalb die Grenze bei der Spaltenzahl und nicht am Inhalt. */
    if (p.length >= 7) {
      out.push({ fgn: p[0], de: p[1],
        examples: [p[2], p[4]], examplesDe: [p[3], p[5]],
        phonetic: p[6] });
      return;
    }
    // Fremd | Deutsch | Beispiel 1 | Beispiel 2 — die Beispiele sind optional.
    if (p.length >= 5) out.push({ fgn: p[0], de: p[1], examples: [p[2], p[3]].filter(Boolean), phonetic: p[4] });
    else if (p.length === 4) out.push({ fgn: p[0], de: p[1], examples: [p[2], p[3]].filter(Boolean) });
    else if (p.length === 3) out.push({ fgn: p[0], de: p[1], examples: [p[2]].filter(Boolean) });
    else if (p.length === 2) out.push({ fgn: p[0], de: p[1] });
    else out.push({ fgn: p[0], de: "" });
  });
  return out;
}

/* Latin line splitter: columns Grundform | Lernform | Wortart | Deutsch.
 * Splits on tab / pipe / 2+ spaces — NOT comma, so "canis, canis, m." survives. */
function splitLatin(text: string) {
  const out: any[] = [];
  (text || "").split(/\r?\n/).forEach((line) => {
    const s = line.trim();
    if (!s || s.length < 2) return;
    if (/^(unit|lektion|lesson|seite|page|wort|latein|deutsch|grundform)\b/i.test(s) && !/[\t|]/.test(s)) return;
    const p = columns(s);
    /* Ab neun Spalten das Format mit Übersetzung je Beispielsatz:
     * Grundform | Lernform | Wortart | Deutsch | Bsp1 | Bsp1 dt | Bsp2 | Bsp2 dt | Aussprache */
    if (p.length >= 9) {
      out.push({ grundform: p[0], lernform: p[1], wortart: p[2], de: p[3],
        examples: [p[4], p[6]], examplesDe: [p[5], p[7]],
        phonetic: p[8] });
      return;
    }
    // …| Deutsch | Beispiel 1 | Beispiel 2 (die Beispiele sind optional)
    if (p.length >= 7) out.push({ grundform: p[0], lernform: p[1], wortart: p[2], de: p[3], examples: [p[4], p[5]].filter(Boolean), phonetic: p[6] });
    else if (p.length === 6) out.push({ grundform: p[0], lernform: p[1], wortart: p[2], de: p[3], examples: [p[4], p[5]].filter(Boolean) });
    else if (p.length === 5) out.push({ grundform: p[0], lernform: p[1], wortart: p[2], de: p[3], examples: [p[4]].filter(Boolean) });
    else if (p.length === 4) out.push({ grundform: p[0], lernform: p[1], wortart: p[2], de: p[3] });
    else if (p.length === 3) out.push({ grundform: p[0], lernform: p[1], de: p[2] });
    else if (p.length === 2) out.push({ grundform: p[0], de: p[1] });
    else out.push({ grundform: p[0] });
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
  "la-de": "canis | canis, canis, m. | Nomen | der Hund\nliber | liber, librī, m. | Nomen | das Buch",
};

export function PasteModal({ open, pair, onParsed, onClose, initialText, draftHint }: { open: boolean; pair: string; onParsed: (rows: any[]) => void; onClose: () => void; initialText?: string; draftHint?: boolean }) {
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
  const COLS = isLat
    ? "Grundform | Lernform | Wortart | Deutsch | Beispielsatz 1 | Beispielsatz 1 deutsch | Beispielsatz 2 | Beispielsatz 2 deutsch | Aussprache"
    : `${P.foreignLabel} | Deutsch | Beispielsatz 1 | Beispielsatz 1 deutsch | Beispielsatz 2 | Beispielsatz 2 deutsch | Aussprache`;
  const nCols = isLat ? 10 : 8;
  const latinRules = isLat
    ? "Lernform = Stammformen (Nomen: Nominativ, Genitiv, Genus; Verb: 4 Stammformen; Adjektiv: 3 Genus-Endungen). Wortart ∈ {Nomen, Verb, Adjektiv, Zahlwort, Adverb}.\n"
    : "";
  const aiPrompt =
    `Ich gebe dir ein Foto einer Vokabelliste (z. B. eine Heftseite). Schreib die Wörter daraus ab.\n` +
    `Steht kein Foto dabei, erstelle stattdessen eine Vokabelliste ${isLat ? "Latein" : P.foreignLabel} ⇄ Deutsch zu dem Thema, das ich nenne.\n\n` +
    `Gib NUR eine Tabelle aus, eine Zeile pro Wort, Spalten getrennt durch " | ", in genau dieser Reihenfolge:\n${COLS}\n\n` +
    latinRules +
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
    let rows = isLat ? splitLatin(text) : splitForeign(text);
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

        {draftHint && (
          <div className="tips-intro" style={{ marginBottom: 10, background: "var(--amber-bg)", color: "var(--amber-deep)" }}>
            <Icon name="camera" size={14} style={{ verticalAlign: "-2px", marginRight: 6 }} />
            {txt("Foto-Text erkannt — grober Entwurf, bitte korrigieren. Tipp: „KI-Prompt kopieren“, in dein KI-Chat geben, das Ergebnis hier wieder einfügen — dann „Weiter zum Prüfen“.")}
          </div>
        )}
        <div className="tips-intro" style={{ marginBottom: 12 }}>
          Füge eine Wortliste ein — eine Zeile pro Wort, Spalten getrennt durch Tab, „|", „–" oder „:".
          {isLat ? " Latein: Grundform | Lernform | Wortart | Deutsch." : ` ${P.foreignLabel} | Deutsch.`}
        </div>

        <textarea className="field" style={{ minHeight: 150, resize: "vertical", fontFamily: "var(--mono)", fontSize: 13.5 }}
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

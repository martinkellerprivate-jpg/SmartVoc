/* Shared review screen (Phase 5). All three quick-add paths (paste, CSV,
 * scan) feed into this editable list before import. Pair-aware: EN/FR show
 * Fremd·Deutsch·Topic, Latin shows Grundform·Lernform·Wortart·Deutsch·Topic.
 * Rows are normalised on open so a scan's {fgn,de} fills the Latin grundform. */
import { useState, useEffect } from "react";
import { txt } from "../lib/i18n";
import { Icon } from "../ui/Icon";
import { PAIRS, isLatinPair } from "../lib/pairs";

const WORTARTEN = ["Nomen", "Verb", "Adjektiv", "Zahlwort", "Adverb"];

export function ReviewModal({ open, rows, pair, onConfirm, onClose }: { open: boolean; rows: any[] | null; pair: string; onConfirm: (rows: any[]) => void; onClose: () => void }) {
  const isLat = isLatinPair(pair);
  const P = PAIRS[pair] || PAIRS["en-de"];
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    const src = rows && rows.length ? rows : [{}];
    // `ex` is the editable join of the example sentences — normalising to a fixed
    // shape would otherwise silently drop them on the way to the import.
    setList(src.map((r) => ({
      ...(isLat
        ? { grundform: r.grundform ?? r.fgn ?? "", lernform: r.lernform ?? "", wortart: r.wortart || "Nomen", de: r.de ?? "" }
        : { fgn: r.fgn ?? r.grundform ?? "", de: r.de ?? "" }),
      /* Satz und Übersetzung als zwei Spalten, jede mit " / " zwischen den
       * beiden Sätzen. Index-treu: Position 1 gehört zu Position 1. */
      ex: (r.examples || []).join(" / "),
      exde: (r.examplesDe || []).join(" / "),
      phonetic: r.phonetic ?? "",
    })));
  }, [open, rows, isLat]);

  if (!open) return null;

  const setCell = (i: number, k: string, v: string) => setList((l) => l.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const removeRow = (i: number) => setList((l) => l.filter((_, j) => j !== i));
  const addRow = () => setList((l) => [...l, isLat ? { grundform: "", lernform: "", wortart: "Nomen", de: "", ex: "", exde: "", phonetic: "" } : { fgn: "", de: "", ex: "", exde: "", phonetic: "" }]);
  const g = (r: any, k: string) => ((r?.[k] ?? "") + "").trim();
  const valid = list
    .filter((r) => isLat ? (g(r, "grundform") || g(r, "lernform") || g(r, "de")) : (g(r, "fgn") || g(r, "de")))
    .map(({ ex, exde, ...r }) => ({
      ...r,
      // Kein filter(Boolean): sonst verschiebt sich die zweite Übersetzung auf
      // den ersten Satz, sobald einer der beiden leer bleibt.
      examples: String(ex || "").split("/").map((s) => s.trim()),
      examplesDe: String(exde || "").split("/").map((s) => s.trim()),
    }));

  const grid = isLat ? "1fr 1.3fr 0.7fr 1fr 1.2fr 1.2fr 0.7fr 30px" : "1fr 1fr 0.7fr 1.1fr 1.1fr 0.7fr 30px";

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: isLat ? 860 : 700, width: "94vw" }}>
        <div className="modal-head">
          <div className="modal-title">{txt("Wörter prüfen")} <span className="muted" style={{ fontSize: 14, fontWeight: 500 }}>· {P.foreignLabel} ⇄ Deutsch</span></div>
          <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="muted" style={{ fontSize: 13.5, margin: "0 2px 12px" }}>
          {valid.length} Wort{valid.length === 1 ? "" : "er"} erkannt. Korrigiere, was nicht stimmt, dann wähle eine Liste.
        </div>

        <div className="scan-review">
          <div className="scan-row-head" style={{ display: "grid", gridTemplateColumns: grid, gap: 8 }}>
            {isLat
              ? <><span>{txt("Grundform")}</span><span>{txt("Lernform")}</span><span>{txt("Wortart")}</span><span>{txt("Deutsch")}</span><span>{txt("Beispielsätze")}</span><span>{txt("… auf Deutsch")}</span><span /></>
              : <><span>{P.foreignLabel}</span><span>{txt("Deutsch")}</span><span>{txt("Aussprache")}</span><span>{txt("Beispielsätze")}</span><span>{txt("… auf Deutsch")}</span><span /></>}
          </div>
          {list.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: grid, gap: 8, alignItems: "center" }}>
              {isLat ? (
                <>
                  <input className="mini-input" value={r.grundform ?? ""} placeholder="—" onChange={(e) => setCell(i, "grundform", e.target.value)} />
                  <input className="mini-input" value={r.lernform ?? ""} placeholder="—" onChange={(e) => setCell(i, "lernform", e.target.value)} />
                  <select className="mini-input" value={r.wortart ?? "Nomen"} onChange={(e) => setCell(i, "wortart", e.target.value)}>
                    {WORTARTEN.map((wa) => <option key={wa} value={wa}>{wa}</option>)}
                  </select>
                  <input className="mini-input" value={r.de ?? ""} placeholder="—" onChange={(e) => setCell(i, "de", e.target.value)} />
                  <input className="mini-input" value={r.ex ?? ""} placeholder="—" title={txt("Mehrere Sätze mit / trennen")} onChange={(e) => setCell(i, "ex", e.target.value)} />
                  <input className="mini-input" value={r.exde ?? ""} placeholder="—" title={txt("Übersetzungen, gleiche Reihenfolge, mit / trennen")} onChange={(e) => setCell(i, "exde", e.target.value)} />
                  <input className="mini-input" value={r.topic ?? ""} placeholder="—" onChange={(e) => setCell(i, "topic", e.target.value)} />
                </>
              ) : (
                <>
                  <input className="mini-input" value={r.fgn} placeholder="—" onChange={(e) => setCell(i, "fgn", e.target.value)} />
                  <input className="mini-input" value={r.de} placeholder="—" onChange={(e) => setCell(i, "de", e.target.value)} />
                  <input className="mini-input" value={r.phonetic ?? ""} placeholder="—" onChange={(e) => setCell(i, "phonetic", e.target.value)} />
                  <input className="mini-input" value={r.ex ?? ""} placeholder="—" title={txt("Mehrere Sätze mit / trennen")} onChange={(e) => setCell(i, "ex", e.target.value)} />
                  <input className="mini-input" value={r.exde ?? ""} placeholder="—" title={txt("Übersetzungen, gleiche Reihenfolge, mit / trennen")} onChange={(e) => setCell(i, "exde", e.target.value)} />
                  <input className="mini-input" value={r.topic} placeholder="—" onChange={(e) => setCell(i, "topic", e.target.value)} />
                </>
              )}
              <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => removeRow(i)}><Icon name="trash" size={14} /></button>
            </div>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={addRow}><Icon name="plus" size={14} /> {txt("Zeile hinzufügen")}</button>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>{txt("Abbrechen")}</button>
          <button className="btn btn-primary" disabled={!valid.length} onClick={() => onConfirm(valid)}>
            <Icon name="check" size={15} /> {txt(valid.length === 1 ? "{n} Wort verwenden" : "{n} Wörter verwenden", { n: valid.length })}
          </button>
        </div>
      </div>
    </div>
  );
}

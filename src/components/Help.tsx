/* ===================================================================
 * Hilfe (V16) — ein „?“ in der Kopfzeile, drei Teile dahinter.
 *
 * Vorher waren es zwei Knöpfe („Anleitung“, „Lerntipps“) mit zwei eigenen
 * Fenstern, und die Anleitung beschrieb eine Oberfläche, die es so nicht
 * mehr gibt. Jetzt ein Ort mit drei Teilen:
 *
 *   Anleitung   — wie man die App bedient
 *   Lerntipps   — was beim Lernen hilft, unabhängig von der App
 *   Lerntheorie — warum die App so rechnet, wie sie rechnet
 *
 * Die Trennung ist keine Kosmetik: das Erste beantwortet „wo klicke ich?“,
 * das Zweite „wie lerne ich?“, das Dritte „warum kommt das Wort erst in
 * neun Tagen wieder?". Wer das eine sucht, will das andere gerade nicht.
 *
 * Die Texte selbst stehen in help.de.tsx und help.en.tsx — als zwei
 * vollständige Fassungen, nicht als Wörterliste. Prosa lässt sich nicht
 * satzweise übersetzen: die Hervorhebungen sitzen an anderen Stellen, und
 * die Sätze bauen sich anders auf. Eine Übersetzungstabelle hätte hier
 * Bruchstücke erzeugt.
 * =================================================================== */
import { useState } from "react";
import { Icon } from "../ui/Icon";
import { txt, getUiLang } from "../lib/i18n";
import { TIPPS_DE, ANLEITUNG_DE, LerntheorieDE } from "./help.de";
import { TIPPS_EN, ANLEITUNG_EN, LerntheorieEN } from "./help.en";

/* Auch die Einblendung während des Übens greift hierauf zu. */
export const lernTipps = () => (getUiLang() === "en" ? TIPPS_EN : TIPPS_DE);

export function Help() {
  const [open, setOpen] = useState(false);
  const [teil, setTeil] = useState("anleitung");
  const [kapitel, setKapitel] = useState<number | null>(null);
  // Der erste Tipp steht offen da -- eine Liste aus lauter zugeklappten
  // Zeilen sieht aus wie eine Datenbankausgabe, nicht wie ein Ratgeber.
  const [tipp, setTipp] = useState<number | null>(0);

  const en = getUiLang() === "en";
  const ANLEITUNG = en ? ANLEITUNG_EN : ANLEITUNG_DE;
  const TIPPS = en ? TIPPS_EN : TIPPS_DE;
  const Lerntheorie = en ? LerntheorieEN : LerntheorieDE;
  const TEILE = [
    { id: "anleitung", label: txt("Anleitung") },
    { id: "tipps", label: txt("Lerntipps") },
    { id: "theorie", label: txt("Dahinter") },
  ];

  return (
    <>
      <button className="hbtn" onClick={() => setOpen(true)} title={txt("Hilfe")} aria-label={txt("Hilfe")}>?</button>

      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">{txt("Hilfe")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setOpen(false)}><Icon name="x" size={16} /></button>
            </div>

            <div className="seg help-seg" role="tablist">
              {TEILE.map((teilE) => (
                <button key={teilE.id} aria-pressed={teil === teilE.id} onClick={() => { setTeil(teilE.id); setKapitel(null); }}>{teilE.label}</button>
              ))}
            </div>

            <div className="help-body">
              {teil === "anleitung" && (
                kapitel == null ? (
                  <div className="help-chapters">
                    {ANLEITUNG.map((k, i) => (
                      <button className="help-chapter-box" key={i} onClick={() => setKapitel(i)}>
                        <span className="help-num">{i + 1}</span>
                        <span className="grow">{k.titel}</span>
                        <Icon name="arrowRight" size={15} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <button className="btn btn-ghost btn-sm" onClick={() => setKapitel(null)}>
                      <Icon name="chevron-left" size={14} /> {txt("Alle Kapitel")}
                    </button>
                    <h3 className="help-chapter-title">{ANLEITUNG[kapitel].titel}</h3>
                    <div className="help-chapter-body">{ANLEITUNG[kapitel].text}</div>
                    <div className="modal-foot">
                      <button className="btn btn-ghost btn-sm" disabled={kapitel === 0} onClick={() => setKapitel((c) => (c || 0) - 1)}>{txt("Zurück")}</button>
                      <button className="btn btn-ghost btn-sm" disabled={kapitel === ANLEITUNG.length - 1} onClick={() => setKapitel((c) => (c || 0) + 1)}>{txt("Weiter")}</button>
                    </div>
                  </>
                )
              )}

              {teil === "tipps" && (
                <div className="help-tips">
                  {TIPPS.map((tp, i) => (
                    <div key={i} className={"help-tip" + (tipp === i ? " open" : "")}>
                      <button className="help-tip-head" onClick={() => setTipp(tipp === i ? null : i)}>
                        <span className="help-num">{i + 1}</span>
                        <span className="grow">{tp.h}</span>
                        <Icon name={tipp === i ? "chevron-left" : "arrowRight"} size={14} />
                      </button>
                      {tipp === i && <p className="help-tip-body">{tp.b}</p>}
                    </div>
                  ))}
                </div>
              )}

              {teil === "theorie" && (
                <>
                  {/* Der Reiter muss kurz sein, der Titel darf es nicht:
                      "Lerntheorie" allein sagt nichts über DIESE App. */}
                  <h3 className="help-chapter-title">{txt("Die Theorie hinter SmartVoc")}</h3>
                  <Lerntheorie />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

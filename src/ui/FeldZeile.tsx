/* Die Zeile aus dem Entwurf: Feldname links, Inhalt rechts, „optional“
 * klein darunter. Sie trägt beide Rollen — nur lesen und bearbeiten.
 *
 * Vorher waren es zwei verschiedene Bauarten für dasselbe: im Wort-Detail
 * Zeilen mit Namen, im Bearbeiten-Formular ein Stapel leerer Eingabefelder,
 * bei dem man erst am Platzhalter erkennt, was hineingehört — und sobald
 * etwas drinsteht, gar nicht mehr. Eine Bauart, zwei Zustände.
 */
import { txt } from "../lib/i18n";

export function FeldZeile({ feld, hinweis, wert }: { feld: string; hinweis?: string; wert: any }) {
  return (
    <div className="fz">
      <span className="fz-name">{feld}{hinweis && <span className="fz-opt">{hinweis}</span>}</span>
      <span className="fz-wert">{wert || <span className="faint">—</span>}</span>
    </div>
  );
}

export function FeldEingabe({ feld, hinweis, wert, onChange, mehrzeilig, aria }:
  { feld: string; hinweis?: string; wert: string; onChange: (v: string) => void; mehrzeilig?: boolean; aria?: string }) {
  return (
    <label className="fz fz-edit">
      <span className="fz-name">{feld}{hinweis && <span className="fz-opt">{hinweis}</span>}</span>
      {mehrzeilig ? (
        <textarea className="fz-feld" rows={2} value={wert} aria-label={aria || feld}
          onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="fz-feld" value={wert} aria-label={aria || feld}
          onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export function FeldAuswahl({ feld, hinweis, wert, onChange, werte, leerText }:
  { feld: string; hinweis?: string; wert: string; onChange: (v: string) => void; werte: string[]; leerText?: string }) {
  return (
    <label className="fz fz-edit">
      <span className="fz-name">{feld}{hinweis && <span className="fz-opt">{hinweis}</span>}</span>
      <select className="fz-feld" value={wert} onChange={(e) => onChange(e.target.value)} aria-label={feld}>
        {/* Ein leerer Eintrag, weil das Feld freiwillig ist. Ohne ihn stuende
            dort immer der erste Wert und behauptete etwas, das niemand
            angegeben hat. */}
        <option value="">{leerText || txt("keine Angabe")}</option>
        {werte.map((w) => <option key={w} value={w}>{txt(w)}</option>)}
      </select>
    </label>
  );
}

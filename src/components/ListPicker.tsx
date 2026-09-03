import { useState, useEffect } from "react";
import { txt } from "../lib/i18n";
import { useStore } from "../store/StoreProvider";
import { Icon } from "../ui/Icon";

/* Das Fenster, in dem man eine Ziel-Wortliste waehlt oder eine neue anlegt.
 *
 * Hier stand bis eben auch ein zweiter Waehler aus Chips (`ListSelector`).
 * Der wurde nirgends mehr gerendert -- Uebung und Statistik haben laengst
 * ihr eigenes Blatt -- und trug dabei drei Farbregeln mit sich herum, die
 * eine Auswahl mit Rost- und Vollflaechen fuellten statt mit einem
 * Tintenrand. Tote Regeln mit hoeherer Spezifitaet sind die unangenehme
 * Sorte: sie gewinnen gegen die richtige Regel, sobald jemand die Klasse
 * wiederverwendet.
 */

/* Modal to choose / create a target list (within `pair`). onPick(id, name). */
export function ListPicker({ open, title, subtitle, onPick, onClose, pair }) {
  const { lists, addList } = useStore();
  const pairLists = pair ? lists.filter((l) => l.pair === pair) : lists;
  const [choice, setChoice] = useState(pairLists[0] ? pairLists[0].id : "__new");
  const [newName, setNewName] = useState("");
  useEffect(() => { if (open) { setChoice(pairLists[0] ? pairLists[0].id : "__new"); setNewName(""); } }, [open]);
  if (!open) return null;

  const confirm = () => {
    if (choice === "__new") {
      const name = newName.trim() || "New list";
      const id = addList(name, pair);
      onPick(id, name);
    } else {
      const l = pairLists.find((x) => x.id === choice);
      onPick(choice, l ? l.name : "");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-head">
          <div>
            <div className="modal-title">{title || "Choose a list"}</div>
            {subtitle && <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>{subtitle}</div>}
          </div>
          <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="picker-list">
          {pairLists.map((l) => (
            <label key={l.id} className={"picker-row" + (choice === l.id ? " on" : "")}>
              <input type="radio" name="lp" checked={choice === l.id} onChange={() => setChoice(l.id)} />
              <span className="grow">{l.name}</span>
            </label>
          ))}
          <label className={"picker-row" + (choice === "__new" ? " on" : "")}>
            <input type="radio" name="lp" checked={choice === "__new"} onChange={() => setChoice("__new")} />
            <Icon name="plus" size={15} />
            <input className="field" style={{ padding: "8px 11px" }} placeholder={txt("Name der Wortliste …")}
              value={newName} onFocus={() => setChoice("__new")}
              onChange={(e) => { setNewName(e.target.value); setChoice("__new"); }} onKeyDown={(e) => e.key === "Enter" && confirm()} />
          </label>
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>{txt("Abbrechen")}</button>
          <button className="btn btn-primary" onClick={confirm}><Icon name="check" size={15} /> {txt("Hier hinzufügen")}</button>
        </div>
      </div>
    </div>
  );
}

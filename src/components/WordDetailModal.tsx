/* Ein Wort im Detail — alle Felder, auch die leeren.
 *
 * Hier stand vorher ein Blick in die Maschine: „es gibt noch kein
 * FSRS-Objekt (state New)", Rohwerte mit dem Vermerk „berechnet", und eine
 * Zeile „Lektionen" für einen Begriff, den es seit V16 nicht mehr gibt. Das
 * war für mich beim Bauen nützlich und für alle anderen nutzlos.
 *
 * Jetzt zeigt der Bildschirm, was am Wort steht — und im Abschnitt
 * „Lernstand", was die App darüber weiss, in Worten. Die leeren Felder
 * bleiben sichtbar und als „optional" beschriftet: so sieht man, was man
 * noch ergänzen könnte, statt es zu erraten.
 */
import { useStore } from "../store/StoreProvider";
import { txt } from "../lib/i18n";
import { Icon } from "../ui/Icon";
import { PAIRS, fk, isLatinPair, practiceable } from "../lib/pairs";
import { latinHeadword } from "../lib/latin";
import { deriveProfile, effectiveRetentionFor } from "../lib/fsrs";
import { STUFE_FARBE, STUFE_KURZ } from "../lib/stufen";

/* Eine Zeile: links das Feld, rechts sein Inhalt. Leer heisst „—", nicht
 * verschwunden — eine Zeile, die je nach Inhalt da ist oder nicht, macht
 * den Bildschirm bei jedem Wort anders hoch. */
const Zeile = ({ feld, hinweis, wert }: any) => (
  <div className="li">
    <span className="g">{feld}{hinweis && <div className="m">{hinweis}</div>}</span>
    <span className="wd-wert">{wert || <span className="faint">—</span>}</span>
  </div>
);

export function WordDetailModal({ open, word, onClose, onEdit }: { open: boolean; word: any; onClose: () => void; onEdit?: (w: any) => void }) {
  const store = useStore();
  if (!open || !word) return null;
  const { stats, settings, lists, lessons } = store;
  const pair = word.pair || settings.pair;
  const P = PAIRS[pair] || PAIRS["en-de"];
  const isLat = isLatinPair(pair);
  const stat = stats[word.id];
  const prof = deriveProfile(stat?.fsrs, effectiveRetentionFor(word, settings, lessons));
  const stufe = !practiceable(word) ? "noch_nicht_geuebt" : prof.stufe;
  const fgn = isLat ? latinHeadword(word) : (word[fk(pair)] || "");
  const bsp = (i: number) => (word.examples || [])[i] || "";
  const bspDe = (i: number) => (word.examplesDe || [])[i] || "";
  const inListen = (lists || []).filter((l: any) => (word.lists || []).includes(l.id)).map((l: any) => l.name);

  const richtig = (stat?.correctCount || 0) + (stat?.almostCount || 0);
  const wieder = prof.due == null ? null : Math.round((prof.due - Date.now()) / 86400000);
  const naechste = !stat?.seen ? txt("noch nie geübt")
    : wieder == null ? txt("noch offen")
    : wieder < 0 ? txt("jetzt") : wieder === 0 ? txt("heute")
    : wieder === 1 ? txt("morgen") : txt("in {n} Tagen", { n: wieder });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, maxHeight: "86vh", overflowY: "auto" } as any}>
        <div className="modal-head">
          <div>
            <div className="wd-wort">{fgn || word.de}</div>
            <div className="muted" style={{ fontSize: 12.5, marginTop: 1 }}>
              {P.foreignLabel}{isLat && word.wortart ? " · " + word.wortart : ""}
            </div>
          </div>
          <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div className="list">
          <Zeile feld={txt("Deutsch")} wert={word.de} />
          {isLat && <Zeile feld={txt("Stammformen")} wert={word.lernform} />}
          <Zeile feld={txt("Lautschrift")} hinweis={txt("optional")} wert={word.phonetic} />
          <Zeile feld={txt("Beispielsatz 1")} hinweis={P.foreignLabel} wert={bsp(0)} />
          <Zeile feld={txt("Beispielsatz 1")} hinweis={txt("Deutsch")} wert={bspDe(0)} />
          <Zeile feld={txt("Beispielsatz 2")} hinweis={P.foreignLabel} wert={bsp(1)} />
          <Zeile feld={txt("Beispielsatz 2")} hinweis={txt("Deutsch")} wert={bspDe(1)} />
        </div>

        <div className="grp">{txt("Lernstand")}</div>
        <div className="list">
          <Zeile feld={txt("Wie gut es sitzt")} wert={
            <span className="wstufe" style={{ color: STUFE_FARBE[stufe] }}>
              <i style={{ background: STUFE_FARBE[stufe] }} />{txt(STUFE_KURZ[stufe])}
            </span>} />
          <Zeile feld={txt("Richtig beantwortet")} wert={stat?.seen ? txt("{n} ×", { n: richtig }) : null} />
          <Zeile feld={txt("Falsch beantwortet")} wert={stat?.seen ? txt("{n} ×", { n: stat.wrongCount || 0 }) : null} />
          <Zeile feld={txt("Nächste Übung")} wert={naechste} />
          <Zeile feld={txt("Hält im Moment")} hinweis={txt("Tage, bis es wiederkommt")}
            wert={prof.haeltTage ? txt("{n} Tage", { n: Math.round(prof.haeltTage) }) : null} />
          <Zeile feld={txt("In Listen")} wert={inListen.join(" · ")} />
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>{txt("Schliessen")}</button>
          {onEdit && <button className="btn btn-primary" onClick={() => onEdit(word)}><Icon name="edit" size={14} /> {txt("Bearbeiten")}</button>}
        </div>
      </div>
    </div>
  );
}

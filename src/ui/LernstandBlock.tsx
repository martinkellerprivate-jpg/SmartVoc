/* Der Lernstand eines Wortes — ein Block, zwei Orte.
 *
 * Er erscheint im Wort-Detail der Wortlisten und, über dasselbe Fenster,
 * in der Statistik. Genau deshalb steht er hier und nicht dort: zwei
 * Kopien wären zwei Gelegenheiten, denselben Zustand verschieden zu
 * beschreiben.
 *
 * Die Form kommt aus dem Entwurf: eine Überschrift und darunter EINZELNE
 * Zeilen, jede ein eigenes Kärtchen mit Rand — Name links, Wert rechts.
 * Vorher war es ein zusammenhängender Block, der genau aussah wie das
 * Formular darüber; man konnte nicht sehen, wo etwas einzutragen ist und
 * wo nicht. Getrennte Kärtchen sagen das ohne ein Wort.
 *
 * Was hier NICHT steht: Rohwerte, Kartenzustände, Modellbegriffe. Die
 * gehören nach „Erweitert" in der Statistik, wo man sie bewusst aufsucht.
 */
import { useStore } from "../store/StoreProvider";
import { txt } from "../lib/i18n";
import { deriveProfile, effectiveRetentionFor } from "../lib/fsrs";
import { practiceable } from "../lib/pairs";
import { STUFE_FARBE, STUFE_KURZ } from "../lib/stufen";

function Zeile({ name, wert }: { name: string; wert: any }) {
  return (
    <div className="li">
      <span className="g">{name}</span>
      <span className="lern-wert">{wert}</span>
    </div>
  );
}

export function LernstandBlock({ word }: { word: any }) {
  const { stats, settings, lists, lessons } = useStore();
  const stat = stats[word.id];
  const prof = deriveProfile(stat?.fsrs, effectiveRetentionFor(word, settings, lessons));
  const stufe = !practiceable(word) ? "noch_nicht_geuebt" : prof.stufe;
  const richtig = (stat?.correctCount || 0) + (stat?.almostCount || 0);
  const tage = prof.due == null ? null : Math.round((prof.due - Date.now()) / 86400000);
  const naechste = !stat?.seen ? txt("noch nie geübt")
    : tage == null ? txt("noch offen")
    : tage < 0 ? txt("jetzt") : tage === 0 ? txt("heute")
    : tage === 1 ? txt("morgen") : txt("in {n} Tagen", { n: tage });
  const inListen = (lists || []).filter((l: any) => (word.lists || []).includes(l.id)).map((l: any) => l.name);
  const strich = <span className="faint">—</span>;

  return (
    <>
      <div className="grp">{txt("Lernstand")} <span className="hint">— {txt("nur zur Ansicht")}</span></div>
      <Zeile name={txt("Wie gut es sitzt")} wert={
        <span className="wstufe" style={{ color: STUFE_FARBE[stufe] }}>
          <i style={{ background: STUFE_FARBE[stufe] }} />{txt(STUFE_KURZ[stufe])}
        </span>} />
      <Zeile name={txt("Richtig beantwortet")} wert={stat?.seen ? <b>{txt("{n} ×", { n: richtig })}</b> : strich} />
      <Zeile name={txt("Falsch beantwortet")} wert={stat?.seen ? <b>{txt("{n} ×", { n: stat.wrongCount || 0 })}</b> : strich} />
      <Zeile name={txt("Nächste Übung")} wert={naechste} />
      <Zeile name={txt("In der Liste")} wert={inListen.join(" · ") || strich} />
    </>
  );
}

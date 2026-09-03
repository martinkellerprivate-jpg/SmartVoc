/* Der Lernstand eines Wortes — ein Block, zwei Orte.
 *
 * Er erscheint im Wort-Detail der Wortlisten und, über dasselbe Fenster,
 * in der Statistik. Genau deshalb steht er hier und nicht dort: zwei
 * Kopien wären zwei Gelegenheiten, denselben Zustand verschieden zu
 * beschreiben — und in dieser App ist das schon passiert (die Stufen
 * standen viermal im Code, mit zwei verschiedenen Farben für „fast").
 *
 * Was hier NICHT steht: Rohwerte, Kartenzustände, Modellbegriffe. Die
 * gehören nach „Erweitert" in der Statistik, wo man sie bewusst aufsucht.
 */
import { useStore } from "../store/StoreProvider";
import { txt } from "../lib/i18n";
import { deriveProfile, effectiveRetentionFor } from "../lib/fsrs";
import { practiceable } from "../lib/pairs";
import { STUFE_FARBE, STUFE_KURZ } from "../lib/stufen";
import { FeldZeile } from "./FeldZeile";

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

  return (
    <>
      <div className="grp">{txt("Lernstand")}</div>
      <div className="fz-block">
        <FeldZeile feld={txt("Wie gut es sitzt")} wert={
          <span className="wstufe" style={{ color: STUFE_FARBE[stufe] }}>
            <i style={{ background: STUFE_FARBE[stufe] }} />{txt(STUFE_KURZ[stufe])}
          </span>} />
        <FeldZeile feld={txt("Richtig beantwortet")} wert={stat?.seen ? txt("{n} ×", { n: richtig }) : null} />
        <FeldZeile feld={txt("Falsch beantwortet")} wert={stat?.seen ? txt("{n} ×", { n: stat.wrongCount || 0 }) : null} />
        <FeldZeile feld={txt("Nächste Übung")} wert={naechste} />
        <FeldZeile feld={txt("Hält im Moment")} hinweis={txt("Tage, bis es wiederkommt")}
          wert={prof.haeltTage ? txt("{n} Tage", { n: Math.round(prof.haeltTage) }) : null} />
        <FeldZeile feld={txt("In der Liste")} wert={inListen.join(" · ")} />
      </div>
    </>
  );
}

/* ===================================================================
 * Die Sprachpaar-Pille.
 *
 * Vorher stand über jedem Bereich eine Leiste mit allen Sprachpaaren
 * nebeneinander. Sie kostete eine ganze Zeile, wuchs mit jeder Sprache und
 * stand auch dort, wo sie nichts entschied. Jetzt eine Pille in der
 * Rüstzeile — dieselbe Form wie Richtung und Übung, dieselbe Zeile.
 *
 * Zur Wahl stehen nur die Paare, die in den Einstellungen eingeschaltet
 * sind. Ist nur eines übrig, gibt es nichts zu wählen und die Pille
 * verschwindet ganz.
 * =================================================================== */
import { useStore } from "../store/StoreProvider";
import { PAIRS, activePairs } from "../lib/pairs";
import { txt } from "../lib/i18n";

export function PairPill() {
  const { settings, setSettings } = useStore();
  const shown = activePairs(settings);
  if (shown.length < 2) return null;
  const p = PAIRS[settings.pair] || PAIRS["en-de"];
  return (
    <label className="pill pill-sel">
      {/* Kein Symbol, kein Pfeil. Ein Sprachpaar HAT keine Richtung -- die
          steht in der Pille daneben. Ein Doppelpfeil hier hiesse "tauschen"
          und wäre eine zweite Bedeutung für dieselbe Form. Der Punkt
          verbindet nur. Geschlossen die Kürzel, aufgeklappt ausgeschrieben. */}
      <span>{p.short} · {"DE"}</span>
      <span className="caret">▾</span>
      <select value={settings.pair} aria-label={txt("Sprache")}
        onChange={(e) => {
          /* Der Wechsel räumt die Auswahlen mit ab: eine Wortliste der einen
           * Sprache ist in der anderen kein gültiger Umfang. */
          if (e.target.value !== settings.pair) setSettings({ pair: e.target.value, selectedLists: [], statLists: [] });
        }}>
        {shown.map((x: any) => (
          <option key={x.id} value={x.id}>{x.foreignLabel} · {x.nativeLabel}</option>
        ))}
      </select>
    </label>
  );
}

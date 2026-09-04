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
import { PAIRS, activePairs, SPRACHEN, MUTTERSPRACHE_VORGABE } from "../lib/pairs";
import { WahlPille } from "./WahlPille";
import { txt } from "../lib/i18n";

export function PairPill() {
  const { settings, setSettings } = useStore();
  const shown = activePairs(settings);
  if (shown.length < 2) return null;
  const p = PAIRS[settings.pair] || PAIRS["en-de"];
  const mutter = SPRACHEN[settings.muttersprache || MUTTERSPRACHE_VORGABE] || SPRACHEN.de;
  return (
    /* Kein Symbol, kein Pfeil. Ein Sprachpaar HAT keine Richtung -- die
       steht in der Pille daneben. Ein Doppelpfeil hier hiesse "tauschen"
       und waere eine zweite Bedeutung fuer dieselbe Form. Der Punkt
       verbindet nur. Geschlossen die Kuerzel, aufgeklappt ausgeschrieben. */
    <WahlPille
      titel={txt("Sprache")}
      kurz={`${p.short} · ${mutter.short}`}
      wert={settings.pair}
      optionen={shown.map((x: any) => ({ wert: x.id, label: `${x.foreignLabel} · ${x.nativeLabel}` }))}
      /* Der Wechsel raeumt die Auswahlen mit ab: eine Wortliste der einen
         Sprache ist in der anderen kein gueltiger Umfang. */
      onWahl={(v) => setSettings({ pair: v, selectedLists: [], statLists: [] })}
    />
  );
}

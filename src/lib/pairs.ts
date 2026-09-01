/* Language pairs. Native side is always German; the foreign side is
 * stored on the word under its own key (en / fr).
 *
 * dock without a refactor. In Phase 0 they cause NO visible change — only
 * the existing EN-DE / FR-DE pairs ship, both fully capable. */
import type { Pair, PairId, Word } from "./types";

export const SMART_TRICKY = "__tricky";
export const NATIVE = "de";

export const PAIRS: Record<string, Pair> = {
  "en-de": { id: "en-de", foreign: "en", foreignLabel: "English",  nativeLabel: "Deutsch", short: "EN" },
  "fr-de": { id: "fr-de", foreign: "fr", foreignLabel: "Français", nativeLabel: "Deutsch", short: "FR" },
  "la-de": { id: "la-de", foreign: "la", foreignLabel: "Latein",   nativeLabel: "Deutsch", short: "LA" },
};

/* Which pairs the user wants to see. Purely a display filter: words of a
 * hidden pair stay in the database untouched and come back when it is
 * re-enabled. Never returns an empty list — at least one pair must remain. */
export function activePairs(settings: any): Pair[] {
  const want = Array.isArray(settings?.activePairs) ? settings.activePairs : null;
  const list = Object.values(PAIRS).filter((p) => !want || want.includes(p.id));
  return list.length ? list : [PAIRS["en-de"]];
}

export const fk = (pair: PairId | string) => (PAIRS[pair] || PAIRS["en-de"]).foreign; // foreign field key
export const isLatinPair = (pair: PairId | string) => pair === "la-de";

// A word is practiceable when both sides are present. Latin uses learning
// forms (grundform/lernform) instead of a plain foreign string.
export const practiceable = (w: Word) =>
  !!(w && w.de && (isLatinPair(w.pair) ? (w.grundform || w.lernform) : w[fk(w.pair)]));



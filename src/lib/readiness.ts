/* Eine Kennzahl für „wie weit ist diese Liste?" — an genau einer Stelle
 * gerechnet, damit Kalenderampel, Listenzeile und Statistik nie
 * auseinanderlaufen. Zwei Darstellungen derselben Zahl: Balken mit Prozent,
 * wo Platz ist; ein Ampelpunkt, wo keiner ist.
 *
 * „Bereit" heisst: das Wort sitzt oder sitzt fast. Ungeübte und neue Wörter
 * zählen nicht dagegen, sie zählen einfach nicht mit — sie stehen im Nenner,
 * denn eine Liste mit 200 ungeübten Wörtern ist nicht bereit. */
import type { Settings } from "./types";
import { txt } from "./i18n";

export type Tone = "ok" | "warn" | "bad";

/** Anteil bereiter Wörter, 0…100. Leere Liste = 0. */
export function readyPercent(dist: Record<string, number>): number {
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  if (!total) return 0;
  return Math.round((((dist.sitzt || 0) + (dist.sitzt_fast || 0)) / total) * 100);
}

/** Schwellen aus den Einstellungen; die Voreinstellungen stehen in defaults.ts. */
export function readyTone(percent: number, settings: Partial<Settings> = {}): Tone {
  const green = settings.readyGreen ?? 95;
  const amber = settings.readyAmber ?? 70;
  if (percent >= green) return "ok";
  if (percent >= amber) return "warn";
  return "bad";
}

export const TONE_VAR: Record<Tone, string> = {
  ok: "var(--ok)", warn: "var(--warn)", bad: "var(--bad)",
};

/** Beschriftung der Legende — leitet sich aus denselben Schwellen ab, damit
 *  die Legende nie etwas anderes behauptet als die Farbe zeigt. */
export function toneLegend(settings: Partial<Settings> = {}): { tone: Tone; label: string }[] {
  const green = settings.readyGreen ?? 95;
  const amber = settings.readyAmber ?? 70;
  return [
    { tone: "ok", label: txt("bereit (ab {p} %)", { p: green }) },
    { tone: "warn", label: txt("fast bereit (ab {p} %)", { p: amber }) },
    { tone: "bad", label: txt("noch üben (unter {p} %)", { p: amber }) },
  ];
}

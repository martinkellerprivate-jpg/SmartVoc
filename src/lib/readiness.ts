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
import { listProfile } from "./engine";

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

/** Der ganze Handgriff an einer Stelle: Verteilung, Prozent, Ton, Farbe.
 *  Wer den Stand einer Wortliste zeigen will, ruft genau das hier auf. */
export function listReadiness(
  list: any, vocab: any[], stats: Record<string, any>,
  effRetention: number, settings: Partial<Settings> = {}, now: number = Date.now(),
) {
  const prof = listProfile(list, vocab, stats, effRetention, now);
  const pct = readyPercent(prof.dist);
  const tone = readyTone(pct, settings);
  return { prof, pct, tone, farbe: TONE_VAR[tone], total: prof.total };
}

export const TONE_VAR: Record<Tone, string> = {
  ok: "var(--ok)", warn: "var(--warn)", bad: "var(--bad)",
};

/** Der Klassenname je Ton — für Flächen, die sich ganz einfärben (der
 *  Kalendertag). `TONE_VAR` bleibt für Punkte und Striche. */
export const TONE_KLASSE: Record<Tone, string> = { ok: "gr", warn: "am", bad: "rd" };

/* Die Legende hiess „bereit ab 95 %", „auf Kurs ab 70 %", „darunter". Das
 * sind die Schwellen, nicht die Bedeutung: wer die App nicht selbst gebaut
 * hat, liest drei Zahlen ohne Aussage — und „darunter" bezieht sich auf
 * eine Zahl, die zwei Zeilen weiter oben stand. Jetzt steht da, was die
 * Farbe über den Tag sagt; die Zahlen stehen in den Einstellungen, wo man
 * sie verstellen kann. */
export function toneLegend(_settings: Partial<Settings> = {}): { tone: Tone; label: string }[] {
  return [
    { tone: "ok", label: txt("Bereit") },
    { tone: "warn", label: txt("Auf Kurs") },
    { tone: "bad", label: txt("Im Rückstand") },
  ];
}

/** Ein Satz unter der Legende — die Regel, nach der ein Tag seine Farbe
 *  bekommt. Ohne ihn bleibt offen, was passiert, wenn an einem Tag zwei
 *  Listen fällig sind. */
export const AMPEL_SATZ =
  "Die Farbe eines Tages sagt, wie weit die Wörter sitzen, die bis dahin dran sind. Liegen mehrere Listen auf demselben Tag, zählt die schwächste — die Zahl in der Ecke sagt, wie viele es sind.";

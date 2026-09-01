/* ===================================================================
 * Speicher — localStorage als Arbeitsspeicher, nativ als Sicherung.
 *
 * Das Problem: iOS darf den Speicher einer WKWebView jederzeit räumen,
 * wenn der Platz knapp wird. Für eine Webseite ist das verschmerzbar, für
 * eine App nicht: dann wären Vokabeln und Lernstand weg, ohne dass der
 * Benutzer etwas falsch gemacht hätte.
 *
 * Die naheliegende Lösung — alles auf Capacitor Preferences umstellen —
 * scheitert an der Form: Preferences ist asynchron, und `load()` wird in
 * `useState`-Anfangswerten aufgerufen, also mitten im Rendern. Der ganze
 * Laden müsste asynchron werden.
 *
 * Deshalb zwei Schichten statt einer. localStorage bleibt der synchrone
 * Arbeitsspeicher; jedes `save()` schreibt zusätzlich in den nativen
 * Speicher, den iOS nicht räumt. Beim Start — vor dem ersten Rendern —
 * füllt `hydrateFromNative()` fehlende Schlüssel aus der Sicherung nach.
 * Im Browser passiert nichts davon; dort ist localStorage alles, was es
 * gibt, und das ist dort auch richtig so.
 * =================================================================== */
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export const LS = {
  vocab: "vt_v1_vocab",
  stats: "vt_v1_stats",
  meta: "vt_v1_meta",
  settings: "vt_v1_settings",
  lists: "vt_v1_lists",
  lessons: "vt_v1_lessons",   // nur noch zum Lesen: V16 löst sie in Wortlisten auf
  reviews: "vt_v1_reviews",   // fortlaufendes FSRS-Protokoll für eine spätere Anpassung
};

const nativ = () => Capacitor.isNativePlatform();

export const load = (key: string, fallback: any) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const save = (key: string, val: any) => {
  const raw = JSON.stringify(val);
  try { localStorage.setItem(key, raw); } catch (e) {}
  /* Die Sicherung läuft nebenher. Schlägt sie fehl, ist der Arbeitsspeicher
   * trotzdem geschrieben — ein verlorener Schreibvorgang in die Sicherung
   * darf die Anwendung nicht anhalten. */
  if (nativ()) Preferences.set({ key, value: raw }).catch(() => {});
};

/** Vor dem ersten Rendern aufrufen. Im Browser ein sofortiges Nichts. */
export async function hydrateFromNative(): Promise<void> {
  if (!nativ()) return;
  for (const key of Object.values(LS)) {
    try {
      if (localStorage.getItem(key) != null) continue;   // Arbeitsspeicher gewinnt
      const { value } = await Preferences.get({ key });
      if (value != null) localStorage.setItem(key, value);
    } catch (e) { /* ein einzelner Schlüssel darf den Start nicht verhindern */ }
  }
}

/** Beim Löschen der lokalen Daten muss auch die Sicherung weg. */
export async function clearAll(): Promise<void> {
  for (const key of Object.values(LS)) {
    try { localStorage.removeItem(key); } catch (e) {}
    if (nativ()) { try { await Preferences.remove({ key }); } catch (e) {} }
  }
}

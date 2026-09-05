/* ===================================================================
 * Beispielsätze und Lautschrift: anzeigen oder nicht.
 *
 * Zwei Angaben auf der Karte, die manche immer sehen wollen, manche nie
 * und manche je nach Tag. Ein blosser Schalter in den Einstellungen kann
 * das nicht: wer ihn beim Üben umlegen will, muss den Bereich verlassen.
 * Ein blosser Schalter beim Üben kann es auch nicht: wer die Lautschrift
 * grundsätzlich nicht will, will den Schalter auch nicht sehen.
 *
 * Also beides, und die Einstellung entscheidet, welches gilt:
 *   immer    — steht auf der Karte, kein Schalter
 *   nie      — steht nicht auf der Karte, kein Schalter
 *   waehlbar — ein Schalter unter der Karte, seine Stellung wird gemerkt
 *
 * Die Stellung des Schalters ist eine eigene Angabe. Sie in denselben Wert
 * zu schreiben wie den Modus hiesse, dass ein Umlegen beim Üben die
 * Einstellung überschreibt -- und dann wäre "wählbar" nach dem ersten
 * Umlegen weg.
 * =================================================================== */
export type Anzeigemodus = "immer" | "nie" | "waehlbar";

export const ANZEIGE_NAME: Record<Anzeigemodus, string> = {
  immer: "Immer anzeigen",
  nie: "Nie anzeigen",
  waehlbar: "Beim Üben wählbar",
};

export const ANZEIGE_KURZ: Record<Anzeigemodus, string> = {
  immer: "steht immer auf der Karte",
  nie: "steht nie auf der Karte",
  waehlbar: "ein Schalter unter der Karte, du entscheidest je Übung",
};

export interface AnzeigeFeld {
  modus: keyof any;      // Schlüssel der Einstellung für den Modus
  an: keyof any;         // Schlüssel der Einstellung für die Schalterstellung
}

export const BEISPIELE: AnzeigeFeld = { modus: "beispieleModus", an: "beispieleAn" };
export const PHONETIK: AnzeigeFeld = { modus: "phonetikModus", an: "phonetikAn" };

export const modusVon = (settings: any, feld: AnzeigeFeld): Anzeigemodus =>
  (settings?.[feld.modus] as Anzeigemodus) || "waehlbar";

/* Wird es gerade gezeigt? Die eine Frage, die jede Anzeigestelle stellt. */
export function zeigt(settings: any, feld: AnzeigeFeld): boolean {
  const m = modusVon(settings, feld);
  if (m === "immer") return true;
  if (m === "nie") return false;
  return settings?.[feld.an] !== false;
}

/* Gibt es einen Schalter dafür? Nur im wählbaren Modus. */
export const hatSchalter = (settings: any, feld: AnzeigeFeld) => modusVon(settings, feld) === "waehlbar";

/* V25 — aus den beiden alten Ja/Nein-Werten einen Modus machen.
 *
 * `showExamples: true` hiess "immer sichtbar" -- also wird daraus "immer",
 * nicht "wählbar". Wer die Anzeige ausgeschaltet hatte, bekommt "nie".
 * Beides ist die genaue Fortsetzung dessen, was die Person eingestellt
 * hatte; "wählbar" wäre eine Änderung, die niemand verlangt hat. */
export function stempelAnzeige(settings: any): Partial<any> | null {
  const aus: any = {};
  if (!settings?.beispieleModus) aus.beispieleModus = settings?.showExamples === false ? "nie" : "immer";
  if (!settings?.phonetikModus) aus.phonetikModus = settings?.showPhonetic === false ? "nie" : "immer";
  return Object.keys(aus).length ? aus : null;
}

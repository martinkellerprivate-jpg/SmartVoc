/* Eine Kopfzeile für die ganze App.
 *
 * Der Entwurf kennt zwei Zustände, keinen dritten:
 *
 *   oben       Zeichen + „SmartVoc“, rechts Konto, Hilfe, Einstellungen
 *   darunter   ein runder Zurück-Knopf und der Name des Bildschirms — sonst
 *              nichts, kein Zeichen, kein Zahnrad
 *
 * Vorher hatte jeder Unterbildschirm seine eigene Zeile UNTER der globalen
 * gebaut. Dadurch standen zwei Kopfzeilen übereinander und zwei Zahnräder
 * nebeneinander, die verschiedene Dinge taten. Jetzt meldet ein
 * Unterbildschirm seinen Titel an, und die eine Kopfzeile schaltet um.
 *
 * Anmelden lassen, nicht durchreichen: die Bereiche sind tief verschachtelt
 * (Statistik hat drei Unterbildschirme, Wortlisten zwei), und ein Titel, der
 * durch vier Ebenen an Eigenschaften weitergegeben wird, wird irgendwo
 * vergessen.
 */
import React from "react";

export interface Unterkopf { titel: string; zurueck: () => void; }

const Ctx = React.createContext<{
  kopf: Unterkopf | null;
  melde: (k: Unterkopf | null) => void;
}>({ kopf: null, melde: () => {} });

export function ScreenHeadProvider({ children }: { children: React.ReactNode }) {
  const [kopf, setKopf] = React.useState<Unterkopf | null>(null);
  const melde = React.useCallback((k: Unterkopf | null) => setKopf(k), []);
  return <Ctx.Provider value={{ kopf, melde }}>{children}</Ctx.Provider>;
}

/** Von der Kopfzeile gelesen. */
export const useUnterkopf = () => React.useContext(Ctx).kopf;

/** Von einem Unterbildschirm aufgerufen: `titel` setzt die Zeile um,
 *  `null` gibt sie frei. Meldet beim Verlassen selbst wieder ab. */
export function useAlsUnterkopf(titel: string | null, zurueck: () => void) {
  const { melde } = React.useContext(Ctx);
  const ref = React.useRef(zurueck);
  ref.current = zurueck;
  React.useEffect(() => {
    if (!titel) return;
    melde({ titel, zurueck: () => ref.current() });
    return () => melde(null);
  }, [titel, melde]);
}

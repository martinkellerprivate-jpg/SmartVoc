/* Das Startbild, klein und leise, für leere Zustände.
 *
 * Es steht nur dort, wo kein Text darauf liegt: eine Liste ohne Wörter,
 * eine Sprache ohne Liste. Als Hintergrund der ganzen App wäre dieselbe
 * Zeichnung falsch — sie hat starke lokale Kontraste, feste Farben und
 * eine Komposition; unter einer rollenden Liste bliebe von ihr nichts als
 * ein Schleier, und unter „Tinte" oder „Graphit" bissen sich die Farben.
 *
 * Hier hat sie Platz. Nach unten löst sie sich ins Papier auf, damit der
 * Text darunter nicht auf einer Kante sitzt.
 */
import bild from "../assets/intro.jpg";

export function LeeresBild() {
  return <img className="leer-illu" src={bild} alt="" aria-hidden="true" />;
}

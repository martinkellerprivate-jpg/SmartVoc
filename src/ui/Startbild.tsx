/* Das Bild beim Start.
 *
 * Es erscheint einmal je App-Start, bleibt gut zwei Sekunden und blendet
 * sich weg. Ein Tipp bringt es sofort zum Verschwinden -- wer die App zum
 * fuenfzigsten Mal oeffnet, will nicht warten.
 *
 * Es folgt bewusst KEINEM Farbschema. Es ist eine gezeichnete Illustration
 * mit eigenen Farben, kein Bedienelement; ein zweiter Satz fuer Dunkel
 * waere ein zweites Bild, nicht dieselbe Sache in anderer Farbe. Der Grund
 * ist auf das Papier des Bildes gesetzt (#ede3d8), damit die Raender oben
 * und unten nahtlos anschliessen -- das Bild ist schmaler als ein hohes
 * Telefon, und `contain` laesst sonst zwei Streifen stehen.
 *
 * Der Merker steht ausserhalb der Komponente: React darf sie neu einhaengen,
 * ohne dass das Bild ein zweites Mal kommt. Ein echter Neustart laedt die
 * Seite neu, und dann ist auch der Merker wieder falsch.
 */
import React from "react";
import bild from "../assets/intro.jpg";

let schonGezeigt = false;

export function Startbild() {
  const [da, setDa] = React.useState(!schonGezeigt);
  const [geht, setGeht] = React.useState(false);

  React.useEffect(() => {
    if (!da) return;
    schonGezeigt = true;
    const a = setTimeout(() => setGeht(true), 2300);
    const b = setTimeout(() => setDa(false), 2750);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [da]);

  if (!da) return null;
  return (
    <div className={"startbild" + (geht ? " weg" : "")}
      onClick={() => { setGeht(true); setTimeout(() => setDa(false), 260); }}
      role="img" aria-label="SmartVoc">
      <img src={bild} alt="" />
    </div>
  );
}

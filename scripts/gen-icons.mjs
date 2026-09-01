/* Erzeugt alle Icon-Grössen aus assets/brand/. Lauf: npm run icons
 *
 * Zwei Regeln, die den ganzen Aufbau bestimmen:
 *
 * 1. Nirgends ein Alpha-Kanal. App Store Connect weist Icons mit Transparenz
 *    ab — und da die Kachel ohnehin deckend ist, bringt Alpha nichts ausser
 *    Ärger. flatten() rechnet alles auf die Kachelfarbe.
 *
 * 2. Kleine Grössen kommen aus der VEREINFACHTEN Zeichnung. Die volle läuft
 *    unter 48 px zu: die Innenzeichnung des Hirns verschmiert zu einem Fleck.
 *    Gleiche Silhouette, weniger Linien.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

const TILE = "#282621"; // Grundfarbe der Kachel, aus dem Zeichen selbst
const SRC = "assets/brand";
const WEB = "public/icons";
const IOS_ICON = "ios/App/App/Assets.xcassets/AppIcon.appiconset";
const IOS_SPLASH = "ios/App/App/Assets.xcassets/Splash.imageset";

mkdirSync(WEB, { recursive: true });

// flatten() rechnet Transparenz auf die Kachel, lässt den Kanal aber stehen,
// wenn das Bild selbst zusammengesetzt wurde. removeAlpha() wirft ihn weg.
const opaque = (p) =>
  p.flatten({ background: TILE }).removeAlpha().png({ compressionLevel: 9 });

const written = [];
async function out(pipeline, path) {
  await opaque(pipeline).toFile(path);
  written.push(path);
}

/* Grosse Grössen: die freigegebene Zeichnung, nur verkleinert. */
const full = (size) => sharp(`${SRC}/icon-1024.png`).resize(size, size);

/* Kleine Grössen: vereinfachte Zeichnung, mittig auf die Kachel gesetzt.
 * 0.88 der Kantenlänge — genug Luft, dass die Silhouette nicht am Rand klebt. */
async function simple(size) {
  const art = await sharp(`${SRC}/mark-simple.svg`)
    .resize(Math.round(size * 0.88), null, { fit: "inside" })
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: TILE },
  }).composite([{ input: art, gravity: "center" }]);
}

// ---- Web und PWA ----------------------------------------------------
await out(full(512), `${WEB}/icon-512.png`);
await out(full(192), `${WEB}/icon-192.png`);
await out(full(180), `${WEB}/apple-touch-icon.png`);
// Maskable: die gelieferte Fassung hat bereits 20–26 % Sicherheitsrand,
// gemessen. Nur flachrechnen, nicht neu setzen.
await out(sharp(`${SRC}/icon-maskable-512.png`), `${WEB}/icon-maskable-512.png`);
for (const s of [48, 32, 16]) await out(await simple(s), `${WEB}/favicon-${s}.png`);

// ---- iOS-App --------------------------------------------------------
// Der Name muss zu AppIcon.appiconset/Contents.json passen.
await out(full(1024), `${IOS_ICON}/AppIcon-512@2x.png`);

// ---- Startbildschirm ------------------------------------------------
// Drei Massstäbe zeigen dieselbe Datei — so legt Capacitor es an. Dazu je
// eine dunkle Fassung, damit abends nicht kurz ein helles Blatt aufblitzt.
for (const n of ["splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"]) {
  await out(sharp(`${SRC}/splash-light-2732.png`), `${IOS_SPLASH}/${n}`);
}
await out(sharp(`${SRC}/splash-dark-2732.png`), `${IOS_SPLASH}/splash-dark-2732x2732.png`);

const scales = ["1x", "2x", "3x"];
const light = ["splash-2732x2732-2.png", "splash-2732x2732-1.png", "splash-2732x2732.png"];
writeFileSync(
  `${IOS_SPLASH}/Contents.json`,
  JSON.stringify(
    {
      images: [
        ...scales.map((scale, i) => ({ idiom: "universal", filename: light[i], scale })),
        ...scales.map((scale) => ({
          idiom: "universal",
          appearances: [{ appearance: "luminosity", value: "dark" }],
          filename: "splash-dark-2732x2732.png",
          scale,
        })),
      ],
      info: { version: 1, author: "xcode" },
    },
    null,
    2
  ) + "\n"
);
written.push(`${IOS_SPLASH}/Contents.json`);

for (const p of written) console.log("geschrieben:", p);

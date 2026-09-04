/* Aus den Rohtexten der KI werden die mitgelieferten Wortlisten.
 *
 * Erwartet je Sprachpaar eine Datei mit einer Zeile pro Wort, Spalten
 * getrennt durch " | ", in derselben Reihenfolge wie in den Briefings
 * (und wie in src/lib/export.ts). Schreibt src/data/starter/<paar>/stufe1.json.
 *
 *   node starterlisten/bau-starter.mjs
 *
 * Prueft dabei, was eine KI erfahrungsgemaess falsch macht: zu wenige oder
 * zu viele Spalten, leere Pflichtfelder, deutsche Nomen ohne Artikel,
 * unerlaubte Wortarten, Doppeleintraege, Klammern um die Lautschrift.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = join(hier, "..");

const WORTARTEN = ["Nomen", "Verb", "Adjektiv", "Zahlwort", "Adverb"];
const ARTIKEL = /^(der|die|das)\s/i;

const PAARE = [
  { pair: "en-de", datei: "roh-englisch.txt", latein: false },
  { pair: "fr-de", datei: "roh-franzoesisch.txt", latein: false },
  { pair: "la-de", datei: "roh-latein.txt", latein: true },
];

let fehlerGesamt = 0;

for (const { pair, datei, latein } of PAARE) {
  const pfad = join(hier, datei);
  if (!existsSync(pfad)) { console.log(`— ${datei} fehlt, ${pair} uebersprungen`); continue; }

  const soll = latein ? 9 : 7;
  const zeilen = readFileSync(pfad, "utf8").split(/\r?\n/)
    .map((z) => z.trim()).filter((z) => z && z.includes("|"));

  const woerter = [];
  const meckern = [];
  const gesehen = new Set();

  zeilen.forEach((z, i) => {
    const nr = i + 1;
    const sp = z.split("|").map((x) => x.trim());
    if (sp.length !== soll) { meckern.push(`Zeile ${nr}: ${sp.length} Spalten statt ${soll} — ${z.slice(0, 70)}`); return; }

    const w = latein
      ? { grundform: sp[0], lernform: sp[1], wortart: sp[2], german: sp[3],
          examples: [sp[4], sp[6]], examplesDe: [sp[5], sp[7]], phonetic: sp[8] }
      : { foreign: sp[0], german: sp[1],
          examples: [sp[2], sp[4]], examplesDe: [sp[3], sp[5]], phonetic: sp[6] };

    const kopf = latein ? w.grundform : w.foreign;
    if (!kopf) { meckern.push(`Zeile ${nr}: kein Stichwort`); return; }
    if (!w.german) { meckern.push(`Zeile ${nr}: keine Uebersetzung — ${kopf}`); return; }

    const schluessel = (kopf + "|" + w.german).toLowerCase();
    if (gesehen.has(schluessel)) { meckern.push(`Zeile ${nr}: schon da — ${kopf}`); return; }
    gesehen.add(schluessel);

    if (latein && !WORTARTEN.includes(w.wortart)) meckern.push(`Zeile ${nr}: Wortart "${w.wortart}" — ${kopf}`);
    if (latein && !w.lernform) meckern.push(`Zeile ${nr}: keine Lernform — ${kopf}`);
    if (/^[A-ZÄÖÜ]/.test(w.german) && !ARTIKEL.test(w.german)) meckern.push(`Zeile ${nr}: Nomen ohne Artikel — ${w.german}`);
    if (/^[\[\/]/.test(w.phonetic)) meckern.push(`Zeile ${nr}: Lautschrift in Klammern — ${w.phonetic}`);
    for (const [feld, wert] of [["Beispiel 1", w.examples[0]], ["Beispiel 1 dt", w.examplesDe[0]],
                                ["Beispiel 2", w.examples[1]], ["Beispiel 2 dt", w.examplesDe[1]],
                                ["Aussprache", w.phonetic]]) {
      if (!wert) meckern.push(`Zeile ${nr}: ${feld} leer — ${kopf}`);
    }
    woerter.push(w);
  });

  const ziel = join(wurzel, "src/data/starter", pair);
  mkdirSync(ziel, { recursive: true });
  writeFileSync(join(ziel, "stufe1.json"),
    JSON.stringify({ pair, stufe: 1, words: woerter }, null, 1) + "\n", "utf8");

  console.log(`\n${pair}: ${woerter.length} Woerter geschrieben (${zeilen.length} Zeilen gelesen)`);
  if (meckern.length) {
    fehlerGesamt += meckern.length;
    console.log(`  ${meckern.length} Beanstandungen:`);
    for (const m of meckern.slice(0, 40)) console.log("   · " + m);
    if (meckern.length > 40) console.log(`   … und ${meckern.length - 40} weitere`);
  } else {
    console.log("  keine Beanstandungen");
  }
}

console.log(fehlerGesamt ? `\nInsgesamt ${fehlerGesamt} Beanstandungen.` : "\nAlles sauber.");

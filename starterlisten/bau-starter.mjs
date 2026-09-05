/* Aus dem Rohtext der KI werden die mitgelieferten Wortlisten.
 *
 * Erwartet EINE Datei, `roh-alle.txt`, mit allen sechs Sprachen
 * hintereinander. Jede Sprache beginnt mit einer Markierungszeile:
 *
 *     === en-de ===
 *
 * Danach eine Zeile je Wort, neun Spalten, getrennt durch " | ", in der
 * Reihenfolge aus src/lib/export.ts:
 *
 *     Fremdsprache | Formen | Genus | Wortart | Deutsch |
 *     Bsp1 | Bsp1 dt | Bsp2 | Bsp2 dt | Aussprache
 *
 * Schreibt src/data/starter/<paar>/stufe1.json und prueft dabei, was eine
 * KI erfahrungsgemaess falsch macht.
 *
 *   node starterlisten/bau-starter.mjs
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hier = dirname(fileURLToPath(import.meta.url));
const wurzel = join(hier, "..");

const WORTARTEN = ["Nomen", "Verb", "Adjektiv", "Adverb", "Pronomen",
                   "Zahlwort", "Präposition", "Konjunktion", "Wendung"];
const GENUS = ["m", "f", "n", "m pl", "f pl", "n pl", "pl", ""];
const ARTIKEL = /^(der|die|das)\s/i;
const PAARE = ["en-de", "fr-de", "es-de", "it-de", "pt-de", "la-de"];
const SOLL = 100;

const pfad = join(hier, "roh-alle.txt");
if (!existsSync(pfad)) { console.log("roh-alle.txt fehlt."); process.exit(1); }

/* Nach Sprachen zerlegen. Alles vor der ersten Markierung ist Vorrede. */
const bloecke = {};
let aktuell = null;
for (const zeile of readFileSync(pfad, "utf8").split(/\r?\n/)) {
  const m = zeile.trim().match(/^=+\s*([a-z]{2}-[a-z]{2})\s*=+$/);
  if (m) { aktuell = m[1]; bloecke[aktuell] = bloecke[aktuell] || []; continue; }
  if (aktuell && zeile.includes("|")) bloecke[aktuell].push(zeile.trim());
}

let fehlerGesamt = 0;
const deutschJeSprache = {};
const PAAREerledigt = [];

for (const pair of PAARE) {
  const zeilen = bloecke[pair];
  if (!zeilen) { console.log(`— ${pair} fehlt im Rohtext`); continue; }
  const latein = pair === "la-de";
  const woerter = [];
  const meckern = [];
  const gesehen = new Set();

  zeilen.forEach((z, i) => {
    const nr = i + 1;
    const sp = z.split("|").map((x) => x.trim());
    if (sp.length !== 10) { meckern.push(`Zeile ${nr}: ${sp.length} Spalten statt 10 — ${z.slice(0, 60)}`); return; }
    const [kopf, lernform, genus, wortart, german, e1, e1de, e2, e2de, phon] = sp;

    const gemein = { lernform, genus, wortart, german, examples: [e1, e2], examplesDe: [e1de, e2de], phonetic: phon };
    const w = latein ? { grundform: kopf, ...gemein } : { foreign: kopf, ...gemein };

    if (!kopf) { meckern.push(`Zeile ${nr}: kein Stichwort`); return; }
    if (!german) { meckern.push(`Zeile ${nr}: keine Uebersetzung — ${kopf}`); return; }

    const schluessel = (kopf + "|" + german).toLowerCase();
    if (gesehen.has(schluessel)) { meckern.push(`Zeile ${nr}: schon da — ${kopf}`); return; }
    gesehen.add(schluessel);

    if (!WORTARTEN.includes(wortart)) meckern.push(`Zeile ${nr}: Wortart "${wortart}" — ${kopf}`);
    if (!GENUS.includes(genus)) meckern.push(`Zeile ${nr}: Genus "${genus}" — ${kopf}`);
    if (wortart !== "Nomen" && genus) meckern.push(`Zeile ${nr}: Genus bei "${wortart}" — ${kopf}`);
    if (wortart === "Nomen" && !genus && pair !== "en-de") meckern.push(`Zeile ${nr}: Nomen ohne Genus — ${kopf}`);
    if (latein && !lernform) meckern.push(`Zeile ${nr}: keine Stammformen — ${kopf}`);
    if (/^[A-ZÄÖÜ]/.test(german) && !ARTIKEL.test(german)) meckern.push(`Zeile ${nr}: Nomen ohne Artikel — ${german}`);
    if (/ß/.test(german + e1de + e2de)) meckern.push(`Zeile ${nr}: ß statt ss — ${kopf}`);
    if (/^[[/]/.test(phon)) meckern.push(`Zeile ${nr}: Lautschrift in Klammern — ${phon}`);
    for (const [feld, wert] of [["Beispiel 1", e1], ["Beispiel 1 dt", e1de],
                                ["Beispiel 2", e2], ["Beispiel 2 dt", e2de],
                                ["Aussprache", phon]]) {
      if (!wert) meckern.push(`Zeile ${nr}: ${feld} leer — ${kopf}`);
    }
    if (e1 && e1 === e2) meckern.push(`Zeile ${nr}: beide Beispielsaetze gleich — ${kopf}`);
    woerter.push(w);
  });

  /* Waehrend die Bloecke noch eintrudeln ist eine kurze Liste kein Fehler,
   * sondern ein Zwischenstand. Zu VIELE Woerter dagegen sind immer einer. */
  const unvollstaendig = woerter.length < SOLL;
  if (woerter.length > SOLL) meckern.push(`Insgesamt ${woerter.length} Woerter statt ${SOLL}`);
  deutschJeSprache[pair] = woerter.map((w) => w.german);
  PAAREerledigt.push(pair);

  const ziel = join(wurzel, "src/data/starter", pair);
  mkdirSync(ziel, { recursive: true });
  writeFileSync(join(ziel, "stufe1.json"),
    JSON.stringify({ pair, stufe: 1, words: woerter }, null, 1) + "\n", "utf8");

  console.log(`\n${pair}: ${woerter.length} Woerter geschrieben` + (unvollstaendig ? ` — noch ${SOLL - woerter.length} offen` : ""));
  if (meckern.length) {
    fehlerGesamt += meckern.length;
    console.log(`  ${meckern.length} Beanstandungen:`);
    for (const m of meckern.slice(0, 40)) console.log("   · " + m);
    if (meckern.length > 40) console.log(`   … und ${meckern.length - 40} weitere`);
  } else console.log("  keine Beanstandungen");
}

/* Die deutsche Spalte ist im Prompt Wort fuer Wort vorgegeben. Sie dort
 * abzuschreiben ist die einzige Aufgabe, bei der eine KI nichts erfinden
 * darf -- also wird genau das nachgerechnet, Position fuer Position, und
 * nicht nur die Sprachen gegeneinander. */
const promptDatei = join(hier, "GRUNDWORTSCHATZ-PROMPT.txt");
let SOLLBEGRIFFE = [];
if (existsSync(promptDatei)) {
  const t = readFileSync(promptDatei, "utf8");
  const a = t.indexOf("die Familie ·"), b = t.indexOf("Das sind genau 100.");
  if (a > 0 && b > a) SOLLBEGRIFFE = t.slice(a, b).split(/·|\n/).map((x) => x.trim()).filter(Boolean);
}
if (SOLLBEGRIFFE.length === SOLL) {
  for (const pair of PAAREerledigt) {
    if (pair === "la-de") continue;
    const ist = deutschJeSprache[pair] || [];
    const abw = ist.map((x, i) => (SOLLBEGRIFFE[i] === x ? null : `${i + 1}: erwartet "${SOLLBEGRIFFE[i]}", da steht "${x}"`)).filter(Boolean);
    if (abw.length) {
      fehlerGesamt += abw.length;
      console.log(`\n${pair}: ${abw.length} Abweichungen von der Vorgabe im Prompt`);
      for (const x of abw.slice(0, 15)) console.log("   · " + x);
    }
  }
} else {
  console.log("\n(Die Begriffsliste im Prompt liess sich nicht lesen — Abgleich uebersprungen.)");
}

/* Zusaetzlich die Sprachen gegeneinander -- faengt den Fall, in dem der
 * Prompt selbst einmal nicht gelesen werden konnte. */
const modern = PAARE.filter((p) => p !== "la-de" && deutschJeSprache[p]);
if (modern.length > 1) {
  const [erste, ...rest] = modern;
  for (const p of rest) {
    const a = deutschJeSprache[erste], b = deutschJeSprache[p];
    /* Nur so weit vergleichen, wie beide Listen reichen -- solange die
     * Bloecke eintrudeln, ist die kuerzere kein Fehler. */
    const bis = Math.min(a.length, b.length);
    const abw = a.slice(0, bis).map((x, i) => (b[i] === x ? null : `${i + 1}: ${erste}="${x}" ${p}="${b[i]}"`)).filter(Boolean);
    if (abw.length) {
      fehlerGesamt += abw.length;
      console.log(`\n${p}: ${abw.length} Abweichungen in der deutschen Spalte gegenueber ${erste}`);
      for (const x of abw.slice(0, 15)) console.log("   · " + x);
    }
  }
}

console.log(fehlerGesamt ? `\nInsgesamt ${fehlerGesamt} Beanstandungen.` : "\nAlles sauber.");

/* One-time, versioned data migrations (run once per user on load).
 * Each migration is recorded in meta.migrations so it never repeats and
 * never loses words. */
import type { Word, ListT } from "./types";

/* V4 — rewrite the old English seed topic labels to German. Counts merge
 * automatically because words simply share the new topic string. */
export const TOPIC_DE: Record<string, string> = {
  Animals: "Tiere",
  Body: "Körper",
  Colours: "Farben",
  Family: "Menschen & Familie",
  Food: "Essen & Trinken",
  Home: "Haus",
  School: "Schule",
  Time: "Zeit",
  Words: "Kleine Wörter",
  Numbers: "Zahlen",
};

export function migrateTopics(vocab: Word[]): Word[] {
  return vocab.map((w) => (w.topic && TOPIC_DE[w.topic]) ? { ...w, topic: TOPIC_DE[w.topic] } : w);
}

/* V6 — give every existing list a dynamic "whole list" lesson so the Practice
 * screen is never empty after the lessons rebuild. Idempotent: skips lists that
 * already have a list-lesson (source.ref === list.id). */
/* V3 — Swiss orthography: rewrite ß → ss in stored German text so existing
 * users (whose vocab was seeded before this change) also see the Swiss spelling.
 * Touches the native German field and the Latin learning-form fields; the
 * foreign EN/FR side is left untouched. Idempotent (no ß left to convert). */
const ssText = (s?: string) => (s && s.indexOf("ß") >= 0) ? s.replace(/ß/g, "ss") : s;
export function swissifyVocab(vocab: Word[]): Word[] {
  return vocab.map((w) => {
    const de = ssText(w.de);
    const grundform = ssText((w as any).grundform);
    const lernform = ssText((w as any).lernform);
    if (de === w.de && grundform === (w as any).grundform && lernform === (w as any).lernform) return w;
    return { ...w, de, ...(grundform !== undefined ? { grundform } : {}), ...(lernform !== undefined ? { lernform } : {}) };
  });
}

export function lessonsForLists(lists: ListT[], existingLessons: any[], newId: () => string) {
  const covered = new Set(existingLessons.filter((l) => l.kind === "dynamic" && l.source?.type === "list").map((l) => l.source.ref));
  const added: any[] = [];
  for (const l of lists) {
    if (covered.has(l.id)) continue;
    added.push({ id: newId(), name: l.name, pair: l.pair, kind: "dynamic", source: { type: "list", ref: l.id } });
  }
  return added;
}

/* V9 — convert ALL lessons to static snapshots (kind/source removed). Runs exactly
 * once. FIX 3: the "list without a lesson → snapshot" fill happens ONLY in this
 * single pass, never as a standing rule, so a deliberately-deleted list-lesson is
 * not recreated on the next load. Empty FR/LA snapshots are skipped (no empties). */
function snap(vocab: Word[], pair: string, src: { type: string; ref: string }): string[] {
  const pv = vocab.filter((w) => w.pair === pair);
  const ws = src.type === "list" ? pv.filter((w) => (w.lists || []).includes(src.ref)) : pv.filter((w) => w.topic === src.ref);
  return Array.from(new Set(ws.map((w) => w.id)));
}
export function migrateLessonsStatic(lessons: any[], lists: ListT[], vocab: Word[], newId: () => string): any[] {
  const now = Date.now();
  const coveredLists = new Set<string>();
  const out = lessons.map((l) => {
    if (l.members && !l.source) return l;                 // already static
    const src = l.source || {};
    let members: string[] = l.members || [];
    let origin = l.origin;
    if (src.type === "list") { members = snap(vocab, l.pair, src); coveredLists.add(src.ref); origin = "Liste"; }
    else if (src.type === "topic") { members = snap(vocab, l.pair, src); origin = "Thema: " + src.ref; }
    const { kind, source, ...rest } = l;
    return { ...rest, members: Array.from(new Set(members)), createdAt: l.createdAt || now, updatedAt: now, origin };
  });
  const added: any[] = [];
  for (const list of lists) {                             // FIX 3: only in this one pass
    if (coveredLists.has(list.id)) continue;
    const members = snap(vocab, list.pair, { type: "list", ref: list.id });
    if (!members.length) continue;                        // no empty lessons (FR/LA)
    added.push({ id: newId(), name: list.name, pair: list.pair, members, createdAt: now, updatedAt: now, origin: "Liste" });
  }
  return [...out, ...added];
}

/* V16 — EIN Begriff: Wortlisten.
 *
 * Bisher gab es zwei Dinge, die dasselbe taten: "Listen" (Mitgliedschaft ueber
 * w.lists, Ziel des Imports) und "Lektionen" (feste Mitgliederliste, dazu
 * Pruefungstermin und Prognose). Fuer den Benutzer war das ein Unterschied ohne
 * Bedeutung — und die Frage "wo lege ich meine Woerter hin?" hatte zwei
 * richtige Antworten.
 *
 * Ab jetzt zaehlt nur die Liste. Jede Lektion wird zu einer Liste, ihre
 * Mitglieder bekommen die Listen-Id in w.lists, der Pruefungstermin wandert
 * mit. Doppel werden ueber Sprachpaar + Name erkannt: V6 hatte zu jeder Liste
 * eine gleichnamige Lektion angelegt, die hier wieder mit ihr verschmilzt —
 * sonst stuende nach der Migration alles zweimal da.
 *
 * Gibt einen Plan zurueck statt fertiger Daten, damit der Aufruf ihn mit
 * funktionalen Updates einspielen kann und nicht mit den Migrationen davor
 * kollidiert. */
const norm = (s: string) => (s || "").trim().toLowerCase();

export function planWortlisten(lessons: any[], lists: ListT[], vocab: Word[]) {
  const now = Date.now();
  const out: any[] = lists.map((l) => ({ ...l }));
  const byName = new Map<string, any>();
  for (const l of out) byName.set(l.pair + " " + norm(l.name), l);

  const memberships: Record<string, string[]> = {};   // wordId -> hinzuzufuegende Listen-Ids
  const tokenMap: Record<string, string> = {};        // alte lesson:<id> -> neue Listen-Id
  const known = new Set(vocab.map((w) => w.id));

  for (const les of lessons || []) {
    const key = les.pair + " " + norm(les.name);
    let target = byName.get(key);
    if (!target) {
      /* Die Id der Lektion wird zur Id der Liste. Das haelt gespeicherte
       * Auswahlen und geteilte Verweise gueltig, wo es nur um die Id geht. */
      target = { id: les.id, name: les.name, pair: les.pair, createdAt: les.createdAt || now };
      out.push(target);
      byName.set(key, target);
    }
    if (les.dueDate && !target.dueDate) target.dueDate = les.dueDate;
    tokenMap[les.id] = target.id;
    for (const wid of les.members || []) {
      if (!known.has(wid)) continue;                  // tote Verweise still uebergehen
      (memberships[wid] ||= []).push(target.id);
    }
  }
  return { lists: out, memberships, tokenMap };
}

/* Gespeicherte Auswahlen zeigen als "lesson:<id>" auf die alte Welt. */
export function retokenSettings(settings: any, tokenMap: Record<string, string>) {
  /* Zwei Schreibweisen, weil sie zwei Dinge bedeuten: practiceSel traegt genau
   * eine Wahl und praefixt sie ("list:" / "smart:"), selectedLists und statLists
   * tragen mehrere und fuehren Listen als blosse Id. */
  const mapped = (id: string) => tokenMap[id] || id;
  const sel = (t: string) => (typeof t === "string" && t.startsWith("lesson:")) ? "list:" + mapped(t.slice(7)) : t;
  const many = (t: string) => (typeof t === "string" && t.startsWith("lesson:")) ? mapped(t.slice(7)) : t;
  return {
    practiceSel: sel(settings.practiceSel || ""),
    selectedLists: (settings.selectedLists || []).map(many),
    statLists: (settings.statLists || []).map(many),
  };
}

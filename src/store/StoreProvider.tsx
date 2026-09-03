/* React state layer over the pure lib/* logic: holds the five vt_v1_*
 * documents, persists them to localStorage, and exposes the store API
 * (recordAttempt updates stats + meta exactly as the prototype did). */
import React from "react";
import { LS, load, save } from "../lib/storage";
import { newId } from "../lib/ids";
import { RECOMMENDED } from "../lib/defaults";
import { DEFAULT_VOCAB } from "../data/seed";
import { migrateTopics, lessonsForLists, swissifyVocab, migrateLessonsStatic, planWortlisten, retokenSettings } from "../lib/migrate";
import { deriveRating, gradeFromCard, initialCard, retentionFor, RETENTION, configure, deriveProfile, STUFE_ORDER } from "../lib/fsrs";
import type { SessionOutcome, SerializedCard } from "../lib/fsrs";
import { appendReviews, type ReviewEntry } from "../lib/reviewlog";
import type { Word, ListT } from "../lib/types";

function seedVocab(): Word[] {
  return DEFAULT_VOCAB.map((w) => ({ id: newId(), ...w, pair: "en-de", review: false, source: "seed" })) as Word[];
}

const todayStr = () => new Date().toDateString();
const yesterdayStr = () => {
  const d = new Date(); d.setDate(d.getDate() - 1); return d.toDateString();
};

/* One-time load + migration: guarantees a list exists and every word
 * carries a `lists` array. Legacy words are folded into a default list. */
export function initData() {
  let lists = load(LS.lists, null);
  let vocab = load(LS.vocab, null);
  if (!vocab || !vocab.length) vocab = seedVocab();
  if (!lists || !lists.length) {
    const def = { id: newId(), name: "Starter Words", pair: "en-de", createdAt: Date.now() };
    lists = [def];
    vocab = vocab.map((w: Word) => ({ ...w, pair: w.pair || "en-de", lists: (w.lists && w.lists.length) ? w.lists : [def.id] }));
  } else {
    lists = lists.map((l: ListT) => ({ ...l, pair: l.pair || "en-de" }));
    vocab = vocab.map((w: Word) => ({ ...w, pair: w.pair || "en-de", lists: Array.isArray(w.lists) ? w.lists : [] }));
  }
  return { vocab, lists };
}

export const StoreContext = React.createContext<any>(null);
export const useStore = () => React.useContext(StoreContext);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const initRef = React.useRef<any>(null);
  if (!initRef.current) initRef.current = initData();
  const [vocab, setVocabState] = React.useState(initRef.current.vocab);
  const [lists, setListsState] = React.useState(initRef.current.lists);
  const [stats, setStats] = React.useState(() => load(LS.stats, {}));
  const [reviews, setReviews] = React.useState(() => load(LS.reviews, {})); // F-SETTINGS-ADVANCED: review log
  const [meta, setMeta] = React.useState(() => load(LS.meta, {
    lastDate: null, streak: 0, todayCount: 0, dailyGoal: 20, totalReviews: 0,
  }));
  const [settings, setSettings] = React.useState(() => {
    // Addendum §2: default direction is German → foreign (n2f).
    const loaded = load(LS.settings, {});
    const s = { direction: "n2f", pair: "en-de", selectedLists: [], statLists: [], statPair: null, practiceSel: "", ...RECOMMENDED, ...loaded };
    if (s.direction === "en2de") s.direction = "f2n";
    if (s.direction === "de2en") s.direction = "n2f";
    if (s.articleMode == null) s.articleMode = s.requireArticle ? "required-full" : "required-partial";
    // V13: targetRetention is the source. Migrate an existing lernIntensity choice
    // into it once (so a user on "intensiv" keeps 0.95, not the default 0.9).
    if (loaded.targetRetention == null && loaded.lernIntensity) s.targetRetention = RETENTION[loaded.lernIntensity] ?? 0.9;
    configure(s);   // F-SETTINGS-ADVANCED: seed FSRS thresholds from settings at startup
    return s;
  });

  // --- sync glue (Phase 3) ----------------------------------------
  // applyRemote() writes a doc from the cloud WITHOUT marking it dirty.
  // registerSync() lets the sync bridge hear local (user-driven) changes.
  const remoteKeys = React.useRef<Set<string>>(new Set());
  const onLocalChange = React.useRef<((key: string) => void) | null>(null);
  const setterFor: Record<string, (v: any) => void> = {
    vocab: setVocabState, lists: setListsState, stats: setStats, meta: setMeta, settings: setSettings, reviews: setReviews,
  };
  const applyRemote = React.useCallback((key: string, data: any) => {
    remoteKeys.current.add(key);
    setterFor[key]?.(data);
  }, []);
  const registerSync = React.useCallback((cb: ((key: string) => void) | null) => { onLocalChange.current = cb; }, []);
  const persist = (key: string, lsKey: string, value: any) => {
    save(lsKey, value);
    if (remoteKeys.current.has(key)) { remoteKeys.current.delete(key); return; }
    onLocalChange.current?.(key);
  };

  React.useEffect(() => persist("vocab", LS.vocab, vocab), [vocab]);
  React.useEffect(() => persist("lists", LS.lists, lists), [lists]);
  React.useEffect(() => persist("stats", LS.stats, stats), [stats]);
  React.useEffect(() => persist("reviews", LS.reviews, reviews), [reviews]);
  React.useEffect(() => persist("meta", LS.meta, meta), [meta]);
  React.useEffect(() => persist("settings", LS.settings, settings), [settings]);
  React.useEffect(() => { configure(settings); }, [settings]);   // FSRS thresholds follow settings live

  // One-time, versioned data migrations (recorded in meta.migrations).
  const migratedRef = React.useRef(false);
  React.useEffect(() => {
    if (migratedRef.current) return;
    migratedRef.current = true;
    const done = (meta.migrations || {}) as Record<string, boolean>;
    const applied: Record<string, boolean> = {};
    if (!done.topicsDe) { setVocabState((v: any) => migrateTopics(v)); applied.topicsDe = true; } // V4
    if (!done.swissV3) { setVocabState((v: any) => swissifyVocab(v)); applied.swissV3 = true; } // V3 — ß → ss
    /* V16 — Lektionen werden Wortlisten. Der Plan wird aus den geladenen Daten
     * gerechnet und dann funktional eingespielt, damit er die Migrationen
     * darueber (die ebenfalls am Vokabular arbeiten) nicht ueberschreibt. */
    if (!done.wortlistenV16) {
      /* Die Vorstufen V6 und V9 laufen hier als reine Funktionen mit, statt
       * eigenen Zustand zu schreiben: erst fehlende Listen-Lektionen ergaenzen,
       * dann alle auf feste Mitglieder bringen -- und was dabei herauskommt,
       * wird in Wortlisten aufgeloest. */
      const stored = load(LS.lessons, []);
      const withLists = [...stored, ...lessonsForLists(initRef.current.lists, stored, newId)];
      const les = migrateLessonsStatic(withLists, initRef.current.lists, initRef.current.vocab || [], newId);
      const plan = planWortlisten(les, initRef.current.lists, initRef.current.vocab || []);
      setListsState(plan.lists);
      setVocabState((v: any) => v.map((w: any) => {
        const add = plan.memberships[w.id];
        if (!add) return w;
        return { ...w, lists: Array.from(new Set([...(w.lists || []), ...add])) };
      }));
      setSettings((prev: any) => ({ ...prev, ...retokenSettings(prev, plan.tokenMap) }));
      applied.wortlistenV16 = true;
    }
    if (Object.keys(applied).length) {
      setMeta((prev: any) => ({ ...prev, migrations: { ...(prev.migrations || {}), ...applied } }));
    }
  }, []);

  // FR3-2: one daily distribution snapshot per pair (first app contact of the day).
  // PFLICHT 1: merge trends[pair][today] only — NEVER replace the whole trends object
  // (else LWW-sync would wipe the history, not just one day). Cap 180 days per pair.
  const trendRef = React.useRef(false);
  React.useEffect(() => {
    if (trendRef.current) return; trendRef.current = true;
    const today = new Date().toISOString().slice(0, 10);
    const ret = retentionFor(settings);
    const pairs = Array.from(new Set(vocab.map((w: any) => w.pair || "en-de"))) as string[];
    setMeta((prev: any) => {
      const trends = prev.trends || {};
      let changed = false;
      const next: any = { ...trends };
      for (const p of pairs) {
        const existing = next[p] || {};
        if (existing[today]) continue;                       // already snapshotted today
        const c = [0, 0, 0, 0, 0];
        for (const w of vocab) {
          if ((w.pair || "en-de") !== p) continue;
          const idx = STUFE_ORDER.indexOf(deriveProfile(stats[w.id]?.fsrs, ret).stufe);
          if (idx >= 0) c[idx]++;
        }
        const merged: any = { ...existing, [today]: { c } };  // only add today's key
        const keys = Object.keys(merged).sort();
        if (keys.length > 180) for (const d of keys.slice(0, keys.length - 180)) delete merged[d];
        next[p] = merged; changed = true;
      }
      return changed ? { ...prev, trends: next } : prev;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const recordAttempt = React.useCallback((wordId: string, score: number, verdict: string, isNew: boolean, errorType: any = null) => {
    setStats((prev: any) => {
      const s = prev[wordId] || {
        seen: 0, scoreSum: 0, correctCount: 0, almostCount: 0, wrongCount: 0,
        firstTry: false, ema: 0, streak: 0, history: [],
      };
      const seen = s.seen + 1;
      const firstTry = s.seen === 0 ? score >= 1 : s.firstTry;
      const a = 0.4;
      const ema = s.seen === 0 ? score : s.ema * (1 - a) + score * a;
      const streak = verdict === "correct" ? (s.streak || 0) + 1 : 0;
      const history = [...s.history, { score, verdict, ts: Date.now(), errorType }].slice(-30);
      return {
        ...prev,
        [wordId]: {
          seen,
          scoreSum: s.scoreSum + score,
          correctCount: s.correctCount + (verdict === "correct" ? 1 : 0),
          almostCount: s.almostCount + (verdict === "almost" ? 1 : 0),
          wrongCount: s.wrongCount + (verdict === "wrong" ? 1 : 0),
          firstTry, ema, streak, history, lastTs: Date.now(),
        },
      };
    });
    setMeta((prev: any) => {
      const today = todayStr();
      let { streak, todayCount, lastDate, newToday } = prev;
      newToday = newToday || 0;
      if (lastDate === today) {
        todayCount += 1;
      } else {
        streak = lastDate === yesterdayStr() ? streak + 1 : 1;
        todayCount = 1;
        newToday = 0;
        lastDate = today;
      }
      if (isNew) newToday += 1;
      return { ...prev, streak, todayCount, lastDate, newToday, totalReviews: prev.totalReviews + 1 };
    });
  }, []);

  // V8 — fire exactly ONE FSRS grade per word per session (at graduation / first
  // resolution). recordAttempt keeps the legacy per-attempt fields; this only
  // touches stat.fsrs. Memorize → deriveRating returns "no-grade" → no-op.
  // F-SETTINGS-ADVANCED (FIX A): review entries buffer here and flush BATCHED
  // (debounced), never one localStorage/sync write per answer.
  const reviewBuf = React.useRef<ReviewEntry[]>([]);
  const reviewTimer = React.useRef<any>(null);
  const flushReviews = React.useCallback(() => {
    if (reviewTimer.current) { clearTimeout(reviewTimer.current); reviewTimer.current = null; }
    const batch = reviewBuf.current;
    if (!batch.length) return;
    reviewBuf.current = [];
    setReviews((prev: any) => appendReviews(prev, batch));
  }, []);
  const gradeWord = React.useCallback((wordId: string, outcome: SessionOutcome, mode: string, baseCard?: SerializedCard) => {
    const rating = deriveRating(outcome, mode);
    if (rating === "no-grade") return;
    let base: any = baseCard;
    setStats((prev: any) => {
      const s = prev[wordId];
      if (!s) return prev;   // recordAttempt runs first, so a legacy stat exists
      // grade from the run-start baseline so exactly one increment happens per
      // session (FIX 1) — not from the live stat already mutated this session.
      base = baseCard || initialCard(s);
      const fsrsCard = gradeFromCard(base, rating as number, retentionFor(settings));
      return { ...prev, [wordId]: { ...s, fsrs: fsrsCard } };
    });
    // append-only log of the BEFORE-state (for a future fit); batched flush.
    if (base) {
      reviewBuf.current.push({ w: wordId, t: Date.now(), g: rating as number, s: base.stability || 0, st: base.state || 0, d: base.difficulty || 0 });
      if (reviewTimer.current) clearTimeout(reviewTimer.current);
      reviewTimer.current = setTimeout(flushReviews, 1500);
    }
  }, [settings.targetRetention, settings.lernIntensity, flushReviews]);

  const api = {
    vocab, stats, meta, settings, lists, reviews,
    flushReviews,
    setVocab: setVocabState,
    setSettings: (patch: any) => setSettings((p: any) => ({ ...p, ...patch })),
    setMeta: (patch: any) => setMeta((p: any) => ({ ...p, ...patch })),
    recordAttempt,
    gradeWord,
    addWord: (w: any) => setVocabState((v: any) => [{ id: newId(), review: false, source: "manual", pair: "en-de", lists: [], createdAt: Date.now(), ...w }, ...v]),
    addWords: (arr: any[]) => setVocabState((v: any) => { const t = Date.now(); return [...arr.map((w) => ({ id: newId(), review: false, source: "import", pair: "en-de", lists: [], createdAt: t, ...w })), ...v]; }),
    updateWord: (id: string, patch: any) => setVocabState((v: any) => v.map((w: any) => (w.id === id ? { ...w, ...patch } : w))),
    deleteWord: (id: string) => setVocabState((v: any) => v.filter((w: any) => w.id !== id)),
    replaceVocab: (list: any[]) => setVocabState(list.map((w) => ({ id: w.id || newId(), review: false, source: "import", pair: "en-de", lists: [], ...w }))),
    resetStats: () => { setStats({}); setReviews({}); reviewBuf.current = []; setMeta({ lastDate: null, streak: 0, todayCount: 0, newToday: 0, totalReviews: 0 }); },
    resetStatsForWords: (ids: string[]) => { setStats((prev: any) => { const next = { ...prev }; ids.forEach((id) => { delete next[id]; }); return next; }); setReviews((prev: any) => { const next = { ...prev }; ids.forEach((id) => { delete next[id]; }); return next; }); },
    resetSettings: () => setSettings((p: any) => ({ ...p, ...RECOMMENDED })),
    // ---- Wortlisten (V16: der einzige Behaelter fuer Woerter) ----
    addList: (name: string, pair: string) => {
      const l = { id: newId(), name: name || "Neue Wortliste", pair: pair || "en-de", createdAt: Date.now() };
      setListsState((ls: any) => [...ls, l]);
      return l.id;
    },
    // FR3-6: the per-pair "Wörter ohne Liste" collection (system list). Auto-created,
    // never duplicated. PFLICHT 2: not shareable/exportable-as-list, not deletable.
    addLooseWord: (word: any, p: string) => {
      const pr = p || "en-de";
      let listId = lists.find((l: any) => l.system === "nolist" && l.pair === pr)?.id;
      if (!listId) { listId = newId(); setListsState((ls: any) => [...ls, { id: listId, name: "Wörter ohne Liste", pair: pr, system: "nolist", createdAt: Date.now() }]); }
      const wid = newId();
      setVocabState((v: any) => [{ id: wid, review: false, source: "manual", pair: pr, lists: [listId], ...word }, ...v]);
      return wid;
    },
    renameList: (id: string, name: string) => {
      setListsState((ls: any) => ls.map((l: any) => (l.id === id ? { ...l, name } : l)));
    },
    /* Zieldatum an jeder Wortliste (V16). undefined entfernt es wieder --
     * ein natives Datumsfeld laesst sich auf iOS nicht zuverlaessig leeren. */
    updateList: (id: string, patch: any) =>
      setListsState((ls: any) => ls.map((l: any) => (l.id === id ? { ...l, ...patch, updatedAt: Date.now() } : l))),
    deleteList: (id: string) => {
      if (lists.find((l: any) => l.id === id)?.system === "nolist") return;   // PFLICHT 2: nolist not deletable
      setListsState((ls: any) => ls.filter((l: any) => l.id !== id));
      setVocabState((v: any) => v.map((w: any) => ({ ...w, lists: (w.lists || []).filter((x: string) => x !== id) })));
    },
    toggleWordList: (wordId: string, listId: string) => setVocabState((v: any) => v.map((w: any) => w.id === wordId
      ? { ...w, lists: (w.lists || []).includes(listId) ? w.lists.filter((x: string) => x !== listId) : [...(w.lists || []), listId] }
      : w)),
    /* Mitgliedschaft steht am Wort. Ein Wort darf in mehreren Listen liegen --
     * "Lektion 4" und "Unregelmaessige Verben" sind beide wahr. */
    addWordsToList: (listId: string, wordIds: string[]) => {
      const set = new Set(wordIds);
      setVocabState((v: any) => v.map((w: any) => (set.has(w.id) && !(w.lists || []).includes(listId)
        ? { ...w, lists: [...(w.lists || []), listId] } : w)));
    },
    removeWordFromList: (listId: string, wordId: string) =>
      setVocabState((v: any) => v.map((w: any) => (w.id === wordId
        ? { ...w, lists: (w.lists || []).filter((x: string) => x !== listId) } : w))),
    newId,
    // sync glue
    applyRemote,
    registerSync,
  };

  return React.createElement(StoreContext.Provider, { value: api }, children);
}

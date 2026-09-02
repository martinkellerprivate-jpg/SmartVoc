import { useState, useMemo } from "react";
import { txt } from "../lib/i18n";
import { useStore } from "../store/StoreProvider";
import { useToast } from "../ui/Toast";
import { Icon } from "../ui/Icon";
import { Ring, toneColor, pct } from "../ui/Ring";
import { wordsForSelection, resolveSmart, resolveToday } from "../lib/engine";
import { deriveProfile, retentionFor, STUFE_ORDER } from "../lib/fsrs";
import { PAIRS, NATIVE, practiceable, isLatinPair } from "../lib/pairs";
import { latinHeadword } from "../lib/latin";
import { MasteryBar, MasteryTrend } from "../ui/MasteryBar";
import { ListSelector } from "./ListSelector";
import { WordDetailModal } from "./WordDetailModal";
import { PairPill } from "../ui/PairPill";

// V14: the four FSRS levels (one source). Tone/labels match V13 STUFE.
const STUFE_META: Record<string, any> = {
  sitzt:             { label: "sitzt",           tone: "green", blurb: "Sitzt sicher — hält lange." },
  sitzt_fast:        { label: "sitzt fast",      tone: "amber", blurb: "Fast da — noch ein paar Wiederholungen." },
  sitzt_schlecht:    { label: "wackelt noch",    tone: "red",   blurb: "Wackelt noch — kommt öfter zurück." },
  neu:               { label: "neu",             tone: "blue",  blurb: "Frisch gelernt — noch jung." },
  noch_nicht_geuebt: { label: "ungeübt",         tone: "slate", blurb: "Noch nicht geübt." },
};
const STUFE_KEYS = STUFE_ORDER;
/* Die Farben der fuenf Stufen kommen aus derselben Quelle wie die Leiste und
 * die Karte -- eine eigene Tabelle hier waere die naechste Stelle, an der die
 * Farben auseinanderlaufen. */
const STUFE_TONE: Record<string, string> = {
  sitzt: "var(--ok)", sitzt_fast: "var(--warn)", sitzt_schlecht: "var(--bad)",
  neu: "var(--blue)", noch_nicht_geuebt: "var(--ink-faint)",
};
// F-WORTLISTE: "Hält" as a circle — full ring = one month (~30 days).
function haeltCircle(p: any) {
  if (p.haeltTage == null || p.haeltTage <= 0) return <span className="faint">—</span>;
  const d = Math.round(p.haeltTage);
  return (
    <div className="haelt-cell" title={`hält etwa ${d} Tage`}>
      <Ring value={Math.min(1, p.haeltTage / 30)} size={30} stroke={4} />
      <span className="haelt-d">{d} T</span>
    </div>
  );
}

/* ===================================================================
 * stats.jsx — detailed scoring: overall + category + word-by-word.
 * =================================================================== */
export function Stats() {
  const store = useStore();
  const toast = useToast();
  const { vocab, stats, meta, settings, lists } = store;
  const pair = settings.pair;
  const goPractice = (sel: string) => { store.setSettings({ practiceSel: sel }); window.dispatchEvent(new CustomEvent("vt-tab", { detail: "practice" })); };
  const P = PAIRS[pair] || PAIRS["en-de"];
  const foreign = P.foreign;
  const srcKey = foreign;            // word column = foreign; translation = native
  const isLat = isLatinPair(pair);
  const fgnOf = (w) => isLat ? latinHeadword(w) : (w[foreign] || "");

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "priority", dir: 1 });
  const [resetOpen, setResetOpen] = useState(false);
  const [detail, setDetail] = useState<any>(null);   // Wortdetail
  const [pickerOpen, setPickerOpen] = useState(false);
  const [trendOpen, setTrendOpen] = useState(false);

  const ret = retentionFor(settings);
  const rows = useMemo(() => wordsForSelection(vocab.filter((w) => w.pair === pair), stats, settings.statLists, settings.masteryCorrect).map((w) => {
    const s = stats[w.id];
    const seen = s ? s.seen : 0;
    const acc = s && seen ? s.scoreSum / seen : 0;
    const prof = deriveProfile(s?.fsrs, ret);
    const stufe = !practiceable(w) ? "noch_nicht_geuebt" : prof.stufe;   // V14: one source
    const history = s ? s.history : [];
    const priority = stufe === "sitzt_schlecht" ? 0 : stufe === "noch_nicht_geuebt" ? 1 : stufe === "sitzt_fast" ? 2 : 3;
    return { w, seen, acc, stufe, prof, history, priority };
  }), [vocab, stats, settings.statLists, ret, pair]);

  const counts = useMemo(() => {
    const c: any = { sitzt: 0, sitzt_fast: 0, sitzt_schlecht: 0, neu: 0, noch_nicht_geuebt: 0 };
    rows.forEach((r) => c[r.stufe]++);
    return c;
  }, [rows]);

  const totals = useMemo(() => {
    let seenSum = 0, scoreSum = 0;
    rows.forEach((r) => { const s = stats[r.w.id]; if (s) { seenSum += s.seen; scoreSum += s.scoreSum; } });
    const mastered = counts.sitzt;
    return {
      mastered, total: rows.length,
      overallAcc: seenSum ? scoreSum / seenSum : 0,
      reviews: seenSum,
    };
  }, [rows, stats, counts]);

  const view = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = rows.filter((r) =>
      (filter === "all" || r.stufe === filter) &&
      (!q || fgnOf(r.w).toLowerCase().includes(q) || (r.w[NATIVE] || "").toLowerCase().includes(q)));
    const k = sort.key;
    list = [...list].sort((a, b) => {
      let av, bv;
      if (k === "word") { av = fgnOf(a.w).toLowerCase(); bv = fgnOf(b.w).toLowerCase(); return av < bv ? -sort.dir : av > bv ? sort.dir : 0; }
      if (k === "acc") { av = a.acc; bv = b.acc; }
      else if (k === "seen") { av = a.seen; bv = b.seen; }
      else { av = a.priority * 1000 - a.acc * 100; bv = b.priority * 1000 - b.acc * 100; } // priority
      return (av - bv) * sort.dir;
    });
    return list;
  }, [rows, filter, query, sort, srcKey]);

  const setSortKey = (key) => setSort((s) => s.key === key ? { key, dir: -s.dir } : { key, dir: key === "word" ? 1 : -1 });

  /* Naechste Schritte: nur was gerade zutrifft, jeder Schritt mit einer Zahl
   * und einer Handlung. Der Staerken-Abschnitt ist entfallen -- er gruppierte
   * nach Themen, und die gibt es nicht mehr. */
  const fgnOfId = (id: string) => { const w = vocab.find((x: any) => x.id === id); return w ? fgnOf(w) : ""; };
  const insights = useMemo(() => {
    const steps: any[] = [];
    const bald = rows.filter((r) => r.prof.baldFaellig);
    if (bald.length) steps.push({ tone: "amber", text: txt(bald.length === 1 ? "{n} Wort wird bald fällig — heute auffrischen" : "{n} Wörter werden bald fällig — heute auffrischen", { n: bald.length }), action: { label: "Üben", sel: "smart:baldfaellig" } });
    const leech = rows.filter((r) => r.prof.istLeech);
    if (leech.length) steps.push({ tone: "red", text: txt("{n} hartnäckig (z. B. {wort}) — eine Eselsbrücke hilft", { n: leech.length, wort: fgnOfId(leech[0].w.id) }), action: { label: "Üben", sel: "smart:leech" } });
    const c = retentionFor(settings);
    const kvs = rows.filter((r) => { const s = stats[r.w.id]?.fsrs?.stability || 0; return s >= 14 * 0.7 && s < 14; });
    if (kvs.length) steps.push({ tone: "green", text: txt("{n} kurz vor „sitzt“ — ein Durchgang reicht", { n: kvs.length }), action: { label: "Üben", sel: "smart:kurzvorsitzt" } });
    for (const l of (lists || [])) {
      if (l.pair !== pair || !l.dueDate) continue;
      const days = Math.ceil((l.dueDate - Date.now()) / 86400000);
      if (days < 0 || days > 14) continue;
      const risk = rows.filter((r) => (r.w.lists || []).includes(l.id)
        && ["sitzt_schlecht", "neu", "noch_nicht_geuebt"].includes(deriveProfile(stats[r.w.id]?.fsrs, c).stufe)).length;
      if (risk > 0) { steps.push({ tone: "red", text: txt(risk === 1 ? "„{liste}“ ist in {tage} Tagen dran — {n} Wort wackelt noch" : "„{liste}“ ist in {tage} Tagen dran — {n} Wörter wackeln noch", { liste: l.name, tage: days, n: risk }), action: { label: "Gefährdete üben", sel: "list:" + l.id } }); break; }
    }
    return { steps };
  }, [rows, stats, lists, pair, settings, vocab]);

  // F-STATS-STRUKTUR: percentages that sum to exactly 100 (largest remainder).
  const pctMap: Record<string, number> = useMemo(() => {
    const total = rows.length; if (!total) return {};
    const parts = STUFE_KEYS.map((k) => { const exact = counts[k] / total * 100; return { k, f: Math.floor(exact), rem: exact - Math.floor(exact) }; });
    let left = 100 - parts.reduce((a, b) => a + b.f, 0);
    parts.slice().sort((a, b) => b.rem - a.rem).forEach((p) => { if (left > 0) { p.f++; left--; } });
    const m: Record<string, number> = {}; parts.forEach((p) => { m[p.k] = p.f; }); return m;
  }, [counts, rows.length]);

  // FR3-2: daily distribution snapshots for this pair → trend
  const trendDays = useMemo(() => { const t = (meta.trends && meta.trends[pair]) || {}; return Object.keys(t).sort().map((d) => ({ d, c: t[d].c || [] })); }, [meta.trends, pair]);

  const resetAll = () => { store.resetStats(); setResetOpen(false); toast("Lernstand zurückgesetzt", "refresh"); };
  const resetSelected = () => { const ids = rows.map((r) => r.w.id); store.resetStatsForWords(ids); setResetOpen(false); toast(`Lernstand für ${ids.length} ${ids.length === 1 ? "Wort" : "Wörter"} zurückgesetzt`, "refresh"); };

  const StatCard = ({ icon, k, v, sub, color }: any) => (
    <div className="stat-card">
      <div className="k"><Icon name={icon} size={15} style={{ color: color || "var(--ink-soft)" }} /> {k}</div>
      <div className="v" style={{ color }}>{v}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  );

  /* Eine Wortzeile, überall gleich gebaut: links das Wortpaar, rechts der
   * Zustand aus der etablierten Skala, darunter in ganzen Worten, was war
   * und was kommt. Keine Sternchen (das wäre eine vierte Skala neben den
   * fünf Stufen) und keine Abkürzungen wie „4 T." -- wer die App nicht
   * gebaut hat, liest das nicht. */
  const wannWieder = (p: any) => {
    if (p.due == null) return null;
    const tage = Math.round((p.due - Date.now()) / 86400000);
    if (tage < 0) return txt("jetzt wieder dran");
    if (tage === 0) return txt("heute wieder dran");
    if (tage === 1) return txt("morgen wieder dran");
    return txt("in {n} Tagen wieder dran", { n: tage });
  };
  const wortZeile = (r: any) => {
    const s = stats[r.w.id];
    const richtig = s ? (s.correctCount || 0) : 0;
    const fast = s ? (s.almostCount || 0) : 0;
    const falsch = s ? (s.wrongCount || 0) : 0;
    const teile: string[] = [];
    if (r.seen) {
      teile.push(txt("{n} × richtig", { n: richtig }));
      if (fast) teile.push(txt("{n} × fast", { n: fast }));
      if (falsch) teile.push(txt("{n} × falsch", { n: falsch }));
    } else {
      teile.push(txt("noch nie geübt"));
    }
    const wann = wannWieder(r.prof);
    if (wann) teile.push(wann);
    return teile.join(" · ");
  };

  /* Eine Zeile der Liste — Symbol, Text, Untertitel, Pfeil. Dieselbe Form
   * für alle drei Gruppen, damit die Statistik eine Liste ist und nicht drei
   * verschiedene Bauarten untereinander. */
  const Zeile = ({ icon, titel, sub, sel, onClick }: any) => (
    <button className={"li" + (sel ? " sel" : "")} onClick={onClick}>
      {icon && <Icon name={icon} size={14} />}
      <span className="g">{titel}{sub && <div className="m">{sub}</div>}</span>
      <Icon name="arrowRight" size={14} />
    </button>
  );

  const umfangName = !settings.statLists.length ? txt("Alle Wörter")
    : settings.statLists.length > 1 ? txt("{n} Wortlisten", { n: settings.statLists.length })
    : ((lists.find((l: any) => l.id === settings.statLists[0]) || {}).name || txt("Auswahl"));

  const smartZeilen = [
    { k: "heute", icon: "calendar", name: "Heute dran" },
    { k: "wackeln", icon: "flame", name: "Wackeln noch" },
    { k: "baldfaellig", icon: "clock", name: "Bald fällig" },
    { k: "leech", icon: "flame", name: "Hartnäckig" },
    { k: "kurzvorsitzt", icon: "target", name: "Kurz vor „sitzt“" },
  ].map((c) => {
    const n = c.k === "heute"
      ? resolveToday(vocab.filter((w) => w.pair === pair), stats, lists, ret, settings.dailyGoal, settings.newPerDay).length
      : resolveSmart(c.k, vocab.filter((w) => w.pair === pair), stats, settings.masteryCorrect, { retention: ret }).filter(practiceable).length;
    return { ...c, n };
  }).filter((c) => c.n > 0);

  const gefiltert = filter !== "all";

  return (
    <div className="statstab">
      {/* Der Umfang als Pille, wie im Üben-Bereich: dieselbe Form für
          dieselbe Entscheidung. */}
      <div className="ruest">
        <PairPill />
        <button className="pill pill-on" onClick={() => setPickerOpen((o) => !o)}>
          <Icon name="list" size={15} />
          <span>{umfangName}</span>
          <span className="pill-n">{rows.length}</span>
        </button>
      </div>
      {pickerOpen && (
        <div className="ruest-picker">
          <ListSelector selected={settings.statLists} onChange={(s) => store.setSettings({ statLists: s })} pair={pair} mc={settings.masteryCorrect} smart={[]} />
        </div>
      )}

      {/* Der Kopf IST die Verteilungsleiste. Ihre Legende ist zugleich die
          Kennzahlenreihe und der Filter: eine Zahl, eine Farbe, ein Ort.
          Nicht gewählte Stufen werden abgedunkelt, nicht entfernt. */}
      {rows.length ? (
        <>
          <MasteryBar dist={counts} total={rows.length}
            onSegment={(k) => setFilter(filter === k ? "all" : k)}
            activeFilter={gefiltert ? filter : undefined} />
          <div className="quiet">
            {gefiltert
              ? txt("Gefiltert auf „{stufe}“ — nochmal antippen hebt auf", { stufe: txt(STUFE_META[filter].label) })
              : txt("Eintrag der Legende antippen filtert die Tabelle")}
          </div>
        </>
      ) : (
        <div className="empty"><div className="big">{txt("Noch keine Wörter")}</div><div>{txt("In dieser Auswahl ist noch nichts")}</div></div>
      )}

      {gefiltert ? (
        <div className="list">
          {view.map((r) => (
            <button key={r.w.id} className="wort" onClick={() => setDetail(r.w)}>
              <div className="wtop">
                <span className="wf">{fgnOf(r.w)}</span>
                <span className="wstufe" style={{ color: STUFE_TONE[r.stufe] }}>
                  <i style={{ background: STUFE_TONE[r.stufe] }} />{txt(STUFE_META[r.stufe].label)}
                </span>
              </div>
              <div className="wde">{r.w[NATIVE]}</div>
              <div className="wmeta">{wortZeile(r)}</div>
            </button>
          ))}
          {!view.length && (
            <div className="empty"><div className="big">{txt("Nichts gefunden")}</div><div>{txt("Andere Stufe wählen oder die Suche leeren")}</div></div>
          )}
        </div>
      ) : (
        <div className="list">
          <div className="grp">{txt("Jetzt üben")}</div>
          {smartZeilen.length ? smartZeilen.map((c, i) => (
            <Zeile key={c.k} icon={c.icon} sel={i === 0}
              titel={txt(c.name)}
              sub={txt("{n} Wörter · Runde starten", { n: c.n })}
              onClick={() => goPractice("smart:" + c.k)} />
          )) : (
            <div className="quiet">{txt("Gerade ist nichts fällig — komm später wieder")}</div>
          )}

          <div className="grp">{txt("Nachschauen")}</div>
          <Zeile titel={txt("Alle Wörter mit Lernstand")}
            sub={txt("öffnet die Tabelle in den Wortlisten")}
            onClick={() => window.dispatchEvent(new CustomEvent("vt-tab", { detail: "lists" }))} />
          <Zeile titel={txt("Verlauf")} sub={txt("wie sich dein Lernstand aufbaut")}
            onClick={() => setTrendOpen((o: boolean) => !o)} />
          {trendOpen && <MasteryTrend days={trendDays} />}

          <div className="grp">{txt("Einstellen")}</div>
          <Zeile titel={txt("Wie oft Wörter wiederkommen")}
            sub={txt("Feinjustierung des Lernrhythmus")}
            onClick={() => window.dispatchEvent(new CustomEvent("vt-tab", { detail: "settings" }))} />
          <Zeile titel={txt("Fortschritt zurücksetzen")} onClick={() => setResetOpen(true)} />
        </div>
      )}

      <WordDetailModal open={!!detail} word={detail} onClose={() => setDetail(null)} />

      {resetOpen && (
        <div className="modal-backdrop" onClick={() => setResetOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Lernstand zurücksetzen")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setResetOpen(false)}><Icon name="x" size={16} /></button>
            </div>
            <div className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>{txt("Das löscht Punkte und Verlauf. Deine Wörter und Wortlisten bleiben.")}</div>
            <div className="picker-list">
              <button className="picker-row" style={{ textAlign: "left", opacity: settings.statLists.length ? 1 : .5, cursor: settings.statLists.length ? "pointer" : "not-allowed" }}
                disabled={!settings.statLists.length} onClick={resetSelected}>
                <Icon name="filter" size={16} />
                <span className="grow"><b>{txt("Nur die gewählten Wortlisten")}</b><div className="muted" style={{ fontSize: 12.5, fontWeight: 400 }}>{settings.statLists.length ? txt("{n} Wörter in deiner aktuellen Auswahl", { n: rows.length }) : txt("Wähle oben zuerst eine Wortliste")}</div></span>
              </button>
              <button className="picker-row" style={{ textAlign: "left" }} onClick={resetAll}>
                <Icon name="refresh" size={16} />
                <span className="grow"><b>{txt("Alles")}</b><div className="muted" style={{ fontSize: 12.5, fontWeight: 400 }}>{txt("Alle Wortlisten, alle Sprachen und die Tagesserie")}</div></span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

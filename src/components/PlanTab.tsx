/* ===================================================================
 * Übungsplan (V16) — eigener Bereich statt Aufklappfenster im Kopf.
 *
 * Drei Entscheide, die die Form bestimmen:
 *
 * 1. SPRACHÜBERGREIFEND. Das alte Fenster zeigte nur das aktive Sprachpaar
 *    und verschwieg damit zwei Drittel der Termine. Ein Plan, der nicht alle
 *    Termine kennt, ist kein Plan.
 *
 * 2. FARBE HEISST BEHERRSCHUNG, NICHT SPRACHE. Der Kalender hat genau eine
 *    Farbachse — grün/gelb/rot nach Bereitschaft, mit Legende. Die Sprache
 *    steht als Kürzel daneben. Zwei Bedeutungen in einer Farbe wären wieder
 *    der Fehler, den --amber schon einmal gemacht hat.
 *
 * 3. EIN TAG KANN MEHRERE LISTEN TRAGEN. Der Tag zeigt die schlechteste
 *    Ampel (was zuerst Arbeit braucht), der Klick öffnet alle Listen dieses
 *    Tages einzeln.
 * =================================================================== */
import { useState, useMemo } from "react";
import { useStore } from "../store/StoreProvider";
import { Icon } from "../ui/Icon";
import { MasteryBar } from "../ui/MasteryBar";
import { PAIRS, activePairs } from "../lib/pairs";
import { listProfile } from "../lib/engine";
import { retentionFor } from "../lib/fsrs";
import { readyPercent, readyTone, toneLegend, TONE_VAR } from "../lib/readiness";

const DAY = 86400000;
const startOfDay = (t: number) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime(); };
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export function PlanTab() {
  const store = useStore();
  const { vocab, stats, lists, settings } = store;
  const retention = retentionFor(settings);
  const today = startOfDay(Date.now());

  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);

  // Nur sichtbare Sprachen — eine abgeschaltete Sprache ist auch im Plan weg.
  const shownPairs = useMemo(() => new Set(activePairs(settings).map((p: any) => p.id)), [settings.activePairs]);

  /* Jede Liste mit Zieldatum wird ein Termin. Der Stand wird einmal gerechnet
   * und überall weiterverwendet — Tagesfarbe, Zeile und Balken zeigen
   * garantiert dieselbe Zahl. */
  const termine = useMemo(() => (lists || [])
    .filter((l: any) => l.dueDate && shownPairs.has(l.pair))
    .map((l: any) => {
      const prof = listProfile(l, vocab, stats, retention);
      const pct = readyPercent(prof.dist);
      return {
        list: l, day: startOfDay(l.dueDate), prof, pct,
        tone: readyTone(pct, settings),
        daysLeft: Math.round((startOfDay(l.dueDate) - today) / DAY),
      };
    })
    .sort((a, b) => a.day - b.day || a.pct - b.pct),
    [lists, vocab, stats, retention, settings, shownPairs, today]);

  const byDay = useMemo(() => {
    const m = new Map<number, typeof termine>();
    for (const t of termine) { const arr = m.get(t.day) || []; arr.push(t); m.set(t.day, arr); }
    return m;
  }, [termine]);

  /* Die schlechteste Ampel des Tages gewinnt: sie zeigt, was zuerst Arbeit
   * braucht. Ein Mittelwert würde eine rote Liste hinter einer grünen
   * verstecken. */
  const dayTone = (day: number) => {
    const arr = byDay.get(day);
    if (!arr || !arr.length) return null;
    if (arr.some((t) => t.tone === "bad")) return "bad";
    if (arr.some((t) => t.tone === "warn")) return "warn";
    return "ok";
  };

  // Gitter: Wochen ab Montag, immer volle Zeilen.
  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const lead = (first.getDay() + 6) % 7;                 // Mo = 0
    const start = startOfDay(first.getTime()) - lead * DAY;
    const days = Math.ceil((lead + new Date(cursor.y, cursor.m + 1, 0).getDate()) / 7) * 7;
    return Array.from({ length: days }, (_, i) => start + i * DAY);
  }, [cursor]);

  const shiftMonth = (d: number) => setCursor((c) => {
    const m = c.m + d;
    return { y: c.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 };
  });
  const toThisMonth = () => { const d = new Date(); setCursor({ y: d.getFullYear(), m: d.getMonth() }); };

  const openList = openDay != null ? (byDay.get(openDay) || []) : termine.filter((t) => t.daysLeft >= 0);
  const openTitle = openDay != null
    ? new Date(openDay).toLocaleDateString("de-CH", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Alle kommenden Termine";

  /* Mehrfachauswahl bleibt vorerst auf eine Sprache beschränkt: die Karte
   * zeigt heute die Richtung des aktiven Sprachpaars, ein Wort aus einer
   * anderen Sprache käme leer heraus. Sobald die Karte ihre Sprache selbst
   * trägt (Stufe 4), fällt diese Zeile weg und die Auswahl darf mischen. */
  const pairOf = (id: string) => (lists || []).find((l: any) => l.id === id)?.pair;
  const toggle = (id: string) => setPicked((p) => {
    if (p.includes(id)) return p.filter((x) => x !== id);
    const keep = p.filter((x) => pairOf(x) === pairOf(id));
    return [...keep, id];
  });
  const practise = (ids: string[]) => {
    if (!ids.length) return;
    // Beim Üben einer Liste aus einer anderen Sprache mitwechseln, sonst
    // stünde die Auswahl auf einem Vorrat, den die Oberfläche gar nicht zeigt.
    const first = (lists || []).find((l: any) => l.id === ids[0]);
    if (first && first.pair !== settings.pair) store.setSettings({ pair: first.pair });
    window.dispatchEvent(new CustomEvent("vt-practice-scope", { detail: ids.map((id) => "list:" + id) }));
    window.dispatchEvent(new CustomEvent("vt-tab", { detail: "practice" }));
  };
  const showStats = (l: any) => {
    store.setSettings({ pair: l.pair, statLists: [l.id] });
    window.dispatchEvent(new CustomEvent("vt-tab", { detail: "stats" }));
  };

  const countdown = (d: number) => d < 0 ? `vor ${-d} ${-d === 1 ? "Tag" : "Tagen"}` : d === 0 ? "heute" : d === 1 ? "morgen" : `in ${d} Tagen`;

  return (
    <div className="plantab">
      <div className="cal">
        <div className="cal-head">
          <button className="icon-btn" title="Voriger Monat" onClick={() => shiftMonth(-1)}><Icon name="chevron-left" size={16} /></button>
          <button className="cal-title" onClick={toThisMonth} title="Zum heutigen Monat">
            {MONTHS[cursor.m]} {cursor.y}
          </button>
          <button className="icon-btn" title="Nächster Monat" onClick={() => shiftMonth(1)}><Icon name="chevron-right" size={16} /></button>
        </div>

        <div className="cal-grid cal-weekdays">
          {WEEKDAYS.map((w) => <div key={w} className="cal-wd">{w}</div>)}
        </div>
        <div className="cal-grid">
          {grid.map((day) => {
            const d = new Date(day);
            const inMonth = d.getMonth() === cursor.m;
            const tone = dayTone(day);
            const n = (byDay.get(day) || []).length;
            return (
              <button key={day}
                className={"cal-day" + (inMonth ? "" : " out") + (day === today ? " today" : "") + (day === openDay ? " open" : "") + (n ? " has" : "")}
                onClick={() => { setOpenDay(day === openDay ? null : day); setPicked([]); }}
                disabled={!n && day !== today}
                aria-label={`${d.getDate()}. ${MONTHS[d.getMonth()]}${n ? ` · ${n} ${n === 1 ? "Wortliste" : "Wortlisten"}` : ""}`}>
                <span className="cal-num">{d.getDate()}</span>
                {tone && <span className="cal-mark" style={{ background: TONE_VAR[tone] }}>{n > 1 ? n : ""}</span>}
              </button>
            );
          })}
        </div>

        <div className="cal-legend">
          {toneLegend(settings).map((t) => (
            <span key={t.tone} className="cal-leg">
              <span className="cal-leg-dot" style={{ background: TONE_VAR[t.tone] }} />{t.label}
            </span>
          ))}
        </div>
      </div>

      <div className="plan-day">
        <div className="plan-day-head">
          <div className="section-title">{openTitle}</div>
          {openDay != null && <button className="btn btn-ghost btn-sm" onClick={() => { setOpenDay(null); setPicked([]); }}>Alle Termine</button>}
        </div>

        {openList.length === 0 ? (
          <div className="empty">
            <div className="big">Kein Termin</div>
            <div>Gib einer Wortliste unter „Wortlisten“ ein Zieldatum — dann erscheint sie hier.</div>
          </div>
        ) : (
          <div className="col" style={{ gap: 10 }}>
            {openList.map((t) => {
              const P = PAIRS[t.list.pair] || PAIRS["en-de"];
              return (
                <div key={t.list.id} className={"planrow" + (picked.includes(t.list.id) ? " picked" : "")}>
                  <button className="planrow-pick" onClick={() => toggle(t.list.id)}
                    aria-pressed={picked.includes(t.list.id)} aria-label={`${t.list.name} auswählen`}>
                    <span className="planrow-box">{picked.includes(t.list.id) && <Icon name="check" size={12} />}</span>
                  </button>
                  <div className="planrow-main">
                    <div className="planrow-top">
                      <span className="planrow-name">{t.list.name}</span>
                      <span className="planrow-lang">{P.short}</span>
                      <span className="planrow-when" style={{ color: t.daysLeft <= 3 && t.daysLeft >= 0 ? "var(--bad)" : "var(--ink-faint)" }}>
                        {countdown(t.daysLeft)}
                      </span>
                    </div>
                    <div className="planrow-stand">
                      <span className="planrow-dot" style={{ background: TONE_VAR[t.tone] }} />
                      <b>{t.pct} %</b> bereit
                      <span className="faint"> · {t.prof.total} {t.prof.total === 1 ? "Wort" : "Wörter"}</span>
                    </div>
                    {/* Miniansicht: Balken ohne Legende — die Legende steht im Kalender. */}
                    <MasteryBar dist={t.prof.dist} total={t.prof.total} showLegend={false} />
                  </div>
                  <div className="planrow-acts">
                    <button className="btn btn-sm btn-primary" onClick={() => practise([t.list.id])}><Icon name="cards" size={14} /> Üben</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => showStats(t.list)}><Icon name="chart" size={14} /> Statistik</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {picked.length > 1 && (
          <div className="plan-multi">
            <span>{picked.length} Wortlisten ausgewählt</span>
            <button className="btn btn-sm btn-primary" onClick={() => practise(picked)}>
              <Icon name="cards" size={14} /> Gemeinsam üben
            </button>
            <button className="btn btn-sm btn-ghost" onClick={() => setPicked([])}>Auswahl aufheben</button>
          </div>
        )}
      </div>
    </div>
  );
}

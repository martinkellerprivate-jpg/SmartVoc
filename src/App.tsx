/* ===================================================================
 * app.tsx — shell: header (streak / daily goal), tabs, pair switcher.
 * =================================================================== */
import { useState, useEffect } from "react";
import { useStore } from "./store/StoreProvider";
import { useAuth } from "./sync/auth";
import { useSync } from "./sync/SyncBridge";
import { Icon } from "./ui/Icon";
import { Ring } from "./ui/Ring";
import { PAIRS, activePairs } from "./lib/pairs";
import { AccountModal } from "./components/AccountModal";
import { ImportShareModal } from "./components/ImportShareModal";
import { ImportContext } from "./components/importContext";
import { OnboardingModal } from "./components/OnboardingModal";
import { LearnTips } from "./components/LearnTips";
import { HelpGuide } from "./components/HelpGuide";
import { Practice } from "./components/Practice";
import { PlanTab } from "./components/PlanTab";
import { WordList } from "./components/WordList";
import { Stats } from "./components/Stats";
import { SettingsTab } from "./components/SettingsTab";

const SYNC_DOT: Record<string, string> = {
  local: "var(--ink-faint)", syncing: "var(--amber)", synced: "var(--green)", offline: "var(--ink-faint)", error: "var(--red)",
};

function Header({ tab, setTab }: { tab: string; setTab: (t: string) => void }) {
  const { meta, vocab, settings } = useStore();
  const auth = useAuth();
  const { status } = useSync();
  const [accountOpen, setAccountOpen] = useState(false);
  const pair = settings.pair;
  const p = PAIRS[pair] || PAIRS["en-de"];
  const nWords = vocab.filter((w: any) => w.pair === pair).length;
  const goalP = Math.min(1, (meta.todayCount || 0) / (settings.dailyGoal || 20));
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">S</div>
        <div>
          <div className="brand-name">SmartVoc</div>
          <div className="brand-sub">{p.foreignLabel} ⇄ {p.nativeLabel} · {nWords} Wörter</div>
        </div>
      </div>
      <div className="topbar-spacer" />
      {auth.configured && (
        <>
          <button className="tipbtn" title="Account & Sync" onClick={() => setAccountOpen(true)} style={{ gap: 8 }}>
            <span className="dot" style={{ width: 8, height: 8, borderRadius: "50%", background: SYNC_DOT[status] }} />
            {auth.user ? (auth.username || "Konto") : "Anmelden"}
          </button>
          <AccountModal open={accountOpen} onClose={() => setAccountOpen(false)} />
        </>
      )}
      <LearnTips />
      <HelpGuide />
      {/* Einstellungen verlassen die Leiste: sie sind kein Bereich, in dem man
          arbeitet, sondern etwas, das man einmal einstellt. */}
      <button className={"icon-btn" + (tab === "settings" ? " active" : "")} title="Einstellungen"
        aria-pressed={tab === "settings"} onClick={() => setTab(tab === "settings" ? "practice" : "settings")}>
        <Icon name="gear" size={17} />
      </button>
      {/* F-7TAGE/STREAK: Tage-in-Folge wandert in die Statistik; Kopf zeigt nur das Tagesziel. */}
      <div className="metric" title="Heute geübte Karten">
        <span className="ic"><Ring value={goalP} size={26} stroke={4} /></span>
        <div><b>{meta.todayCount || 0}/{settings.dailyGoal || 20}</b><small>Tagesziel</small></div>
      </div>
    </div>
  );
}

function PairSwitcher() {
  const { settings, setSettings } = useStore();
  const pair = settings.pair;
  const shown = activePairs(settings);
  if (shown.length < 2) return null;   // nothing to switch between
  return (
    <div className="pairbar">
      <div className="pairseg">
        {shown.map((p) => (
          <button key={p.id} className={pair === p.id ? "on" : ""}
            onClick={() => { if (pair !== p.id) setSettings({ pair: p.id, selectedLists: [], statLists: [] }); }}>
            {p.foreignLabel} ⇄ {p.nativeLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

/* Vier Bereiche in der Reihenfolge des Tuns: üben, planen, verwalten,
 * nachschauen. Die Einstellungen sind kein Bereich mehr — sie sitzen als
 * Zahnrad in der Kopfzeile, wo man sie einmal aufsucht. */
const TABS = [
  { id: "practice", label: "Üben", icon: "cards" },
  { id: "plan", label: "Übungsplan", icon: "calendar" },
  { id: "lists", label: "Wortlisten", icon: "list" },
  { id: "stats", label: "Statistik", icon: "chart" },
];

export function App() {
  const { vocab, settings, setSettings } = useStore();
  const nWords = vocab.filter((w: any) => w.pair === settings.pair).length;
  /* Alte gespeicherte Bereiche auf die neuen abbilden — sonst startet die App
   * nach dem Umbau auf einem Bereich, den es nicht mehr gibt. */
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem("vt_v1_tab") || "practice";
    return ({ lessons: "lists", words: "lists" } as Record<string, string>)[saved] || saved;
  });
  useEffect(() => { localStorage.setItem("vt_v1_tab", tab); }, [tab]);
  // V14: let other tabs (Stats insight lists) jump to a tab programmatically.
  useEffect(() => {
    const go = (e: any) => e?.detail && setTab(e.detail);
    window.addEventListener("vt-tab", go);
    return () => window.removeEventListener("vt-tab", go);
  }, []);

  // If the active pair was switched off in settings, move to the first one
  // that is still visible — otherwise the app would show a hidden language.
  useEffect(() => {
    const shown = activePairs(settings);
    if (!shown.some((p: any) => p.id === settings.pair)) setSettings({ pair: shown[0].id, selectedLists: [], statLists: [] });
  }, [settings.activePairs, settings.pair]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Aussehen: zwei getrennte Achsen am Wurzelelement. Das Farbschema gilt für
   * die ganze App, das Erscheinungsbild folgt der Tageszeit — deshalb verliert
   * ein Wechsel von hell auf dunkel das gewählte Schema nicht. */
  useEffect(() => {
    const r = document.documentElement.dataset;
    r.scheme = settings.scheme || "kladde";
    r.appearance = settings.appearance || "auto";
    r.cardStyle = settings.cardStyle || "ruled";
    r.cardFont = settings.cardFont || "serif";
  }, [settings.scheme, settings.appearance, settings.cardStyle, settings.cardFont]);

  // V1: hide the fixed mobile bottom-nav while typing so the iOS keyboard
  // doesn't collide with it. Uses both focus events and the visualViewport API.
  useEffect(() => {
    const setTyping = (on: boolean) => document.body.classList.toggle("typing", on);
    const onFocusIn = (e: any) => { if (e.target?.matches?.("input,textarea")) setTyping(true); };
    const onFocusOut = () => setTyping(false);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    const vv = window.visualViewport;
    const onVV = () => { if (vv) document.body.classList.toggle("kbd-open", (window.innerHeight - vv.height) > 140); };
    vv?.addEventListener("resize", onVV);
    return () => { document.removeEventListener("focusin", onFocusIn); document.removeEventListener("focusout", onFocusOut); vv?.removeEventListener("resize", onVV); };
  }, []);

  // shared-list import: top-level modal, opened by the toolbar or a #share= link
  const [importOpen, setImportOpen] = useState(false);
  const [importToken, setImportToken] = useState<string | null>(null);
  const openImport = (token?: string | null) => { setImportToken(token ?? null); setImportOpen(true); };
  useEffect(() => {
    const m = location.hash.match(/#share=([A-Za-z0-9]+)/);
    if (m) {
      openImport(m[1]);
      history.replaceState(null, "", location.pathname + location.search);
    }
  }, []);

  return (
    <ImportContext.Provider value={{ openImport }}>
    <div className="app">
      <Header tab={tab} setTab={setTab} />
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} className="tab" role="tab" aria-selected={tab === t.id && tab !== "settings"} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={17} />
            <span className="tab-full">{t.label}</span>
            {t.id === "lists" && <span className="badge-count">{nWords}</span>}
          </button>
        ))}
      </div>
      {/* Der Übungsplan gilt sprachübergreifend — dort wäre ein Sprachschalter
          eine Einschränkung, die es gar nicht gibt. */}
      {tab !== "settings" && tab !== "plan" && <PairSwitcher />}
      {tab === "practice" && <Practice />}
      {tab === "plan" && <PlanTab />}
      {tab === "lists" && <WordList />}
      {tab === "stats" && <Stats />}
      {tab === "settings" && <SettingsTab />}
      <ImportShareModal open={importOpen} initialToken={importToken} onClose={() => setImportOpen(false)} />
      <OnboardingModal />
    </div>
    </ImportContext.Provider>
  );
}

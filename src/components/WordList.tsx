import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { txt } from "../lib/i18n";
import { useStore } from "../store/StoreProvider";
import { useToast } from "../ui/Toast";
import { Icon } from "../ui/Icon";
import { translateWord } from "../lib/translate";
import { deriveProfile, retentionFor } from "../lib/fsrs";
import { examPrognosis } from "../lib/engine";
import { STUFE_BADGE, STUFE_LANG } from "../lib/stufen";
import { readyPercent, readyTone, listReadiness, TONE_VAR } from "../lib/readiness";
import { MasteryBar } from "../ui/MasteryBar";
import { PAIRS, practiceable, isLatinPair } from "../lib/pairs";
import { latinHeadword } from "../lib/latin";
import { isConfigured } from "../lib/supabase";
import { useAuth } from "../sync/auth";
import { publishList } from "../sync/share";
import { ListPicker } from "./ListPicker";
import { ShareModal } from "./ShareModal";
import { ReviewModal } from "./ReviewModal";
import { PasteModal } from "./PasteModal";
import { WordDetailModal } from "./WordDetailModal";
import { LatinKeys } from "../ui/LatinKeys";
import { useImport } from "./importContext";
import { PairPill } from "../ui/PairPill";

const WORTARTEN = ["Nomen", "Verb", "Adjektiv", "Zahlwort", "Adverb"];

/* ===================================================================
 * Bereich "Wortlisten" (V16) — der eine Ort fuer Woerter und Listen.
 *
 * Frueher zwei Bereiche: "Lektionen" (Zieldatum, Beherrschungsstand,
 * Prognose) und "Woerter" (anlegen, suchen, bearbeiten). Beide meinten
 * dieselbe Sache, nur mit verschiedenen Mitteln. Jetzt traegt die Liste
 * beides: oben die Liste als Einheit mit Stand und Termin, darunter ihre
 * Woerter.
 * =================================================================== */
const findKey = (obj, re) => Object.keys(obj).find((k) => re.test(k));

export function WordList() {
  const store = useStore();
  const toast = useToast();
  const auth = useAuth();
  const { openImport } = useImport();
  const { vocab, stats, lists, settings } = store;
  const pair = settings.pair;
  const P = PAIRS[pair] || PAIRS["en-de"];
  const foreign = P.foreign;
  const isLat = isLatinPair(pair);
  // display string for the foreign column (Latin = grundform headword)
  const fgnOf = (w) => isLat ? latinHeadword(w) : (w[foreign] || "");

  const [activeList, setActiveList] = useState("__all");   // '__all' | listId
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ fgn: "", de: "", lists: [] as any[], lernform: "", wortart: "Nomen", ex1: "", ex2: "", ex1de: "", ex2de: "", phon: "" });
  const [adding, setAdding] = useState({ fgn: "", de: "", listId: "", lernform: "", wortart: "Nomen", ex1: "", ex1de: "", phon: "" });
  const [busy, setBusy] = useState(false);
  const [pendingImport, setPendingImport] = useState(null);
  const [editingListId, setEditingListId] = useState(null);
  const [listName, setListName] = useState("");
  const [shareToken, setShareToken] = useState(null);
  const [shareName, setShareName] = useState("");
  const [reviewRows, setReviewRows] = useState(null);   // P5: shared review screen
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteSeed, setPasteSeed] = useState("");   // V12: scan → paste seeded text
  const [pasteDraft, setPasteDraft] = useState(false);
  const [detailWord, setDetailWord] = useState(null);   // V16: word-detail popup
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [addToListId, setAddToListId] = useState("");
  const toggleSel = (id) => setSelectedIds((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const createListFromSel = () => {
    if (!selectedIds.length) return;
    const name = newListName.trim() || "Auswahl";
    const id = store.addList(name, pair);
    store.addWordsToList(id, [...selectedIds]);
    toast(`Wortliste „${name}“ · ${selectedIds.length} Wörter`, "check");
    setSelectedIds([]); setNewListName(""); setSelectMode(false); return id;
  };
  const addSelToList = () => {
    if (!selectedIds.length || !addToListId) return;
    store.addWordsToList(addToListId, selectedIds);
    toast(`${selectedIds.length} Wörter hinzugefügt`, "check");
    setSelectedIds([]); setAddToListId(""); setSelectMode(false);
  };
  const canShare = isConfigured && !!auth.user;

  const pairLists = useMemo(() => lists.filter((l) => l.pair === pair), [lists, pair]);
  const activeListObj = lists.find((l: any) => l.id === activeList);
  /* Stand der offenen Liste. Nur rechnen, wenn eine offen ist -- ueber alle
   * Woerter zu mitteln waere eine andere Aussage als "diese Liste sitzt". */
  const activeListStand = useMemo(() => {
    if (activeList === "__all" || !activeListObj) return null;
    const st = listReadiness(activeListObj, vocab, stats, retentionFor(settings), settings);
    return { ...st, pg: examPrognosis(activeListObj, vocab, stats) };
  }, [activeList, activeListObj, vocab, stats, settings]);
  const setListDue = (id: string, val: string) =>
    store.updateList(id, { dueDate: val ? new Date(val + "T08:00:00").getTime() : undefined });
  const practiseList = (id: string) => {
    store.setSettings({ practiceSel: "list:" + id });
    window.dispatchEvent(new CustomEvent("vt-tab", { detail: "practice" }));
  };
  const activeIsNoList = lists.find((l) => l.id === activeList)?.system === "nolist";
  const pairVocab = useMemo(() => vocab.filter((w) => w.pair === pair), [vocab, pair]);

  useEffect(() => { setActiveList("__all"); }, [pair]);
  useEffect(() => {
    setAdding((a) => ({ ...a, listId: (activeList !== "__all" ? activeList : (pairLists[0] && pairLists[0].id)) || "" }));
  }, [activeList, pairLists]);
  useEffect(() => { if (activeList !== "__all" && !lists.some((l) => l.id === activeList)) setActiveList("__all"); }, [lists, activeList]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return pairVocab.filter((w) =>
      (activeList === "__all" || (w.lists || []).includes(activeList)) &&
      (!q || fgnOf(w).toLowerCase().includes(q) || (w.lernform || "").toLowerCase().includes(q) || (w.de || "").toLowerCase().includes(q)));
  }, [pairVocab, query, activeList, foreign, isLat]);

  const listNameOf = (id) => { const l = lists.find((x) => x.id === id); return l ? l.name : ""; };

  /* ---- add a word (auto-complete the missing side) ---- */
  const addWord = useCallback(async () => {
    const listId = adding.listId;
    const examples = [(adding.ex1 || "").trim()];
    const examplesDe = [(adding.ex1de || "").trim()];
    const phonetic = (adding.phon || "").trim();
    if (isLat) {
      // Latin: no auto-translation; store the learning forms directly.
      const grundform = adding.fgn.trim();
      const lernform = adding.lernform.trim();
      const de = adding.de.trim();
      if (!grundform && !lernform && !de) return;
      store.addWord({ grundform, lernform, wortart: adding.wortart, de, examples, examplesDe, phonetic, pair, lists: listId ? [listId] : [] });
      setAdding((a) => ({ ...a, fgn: "", de: "", lernform: "", ex1: "", ex1de: "", phon: "" }));
      return;
    }
    let fgn = adding.fgn.trim(), de = adding.de.trim();
    if (!fgn && !de) return;
    let review = false;
    if (fgn && !de) {
      setBusy(true);
      const r = await translateWord(fgn, foreign, "de"); de = r.text; review = true;
      toast(r.source === "none" ? "Couldn't translate — please fill it in" : `Auto-filled “${de}” — please review`, r.source === "none" ? "x" : "sparkle");
      setBusy(false);
    } else if (de && !fgn) {
      setBusy(true);
      const r = await translateWord(de, "de", foreign); fgn = r.text; review = true;
      toast(r.source === "none" ? "Couldn't translate — please fill it in" : `Auto-filled “${fgn}” — please review`, r.source === "none" ? "x" : "sparkle");
      setBusy(false);
    }
    store.addWord({ [foreign]: fgn, de, examples, examplesDe, phonetic, review, pair, lists: listId ? [listId] : [] });
    setAdding((a) => ({ ...a, fgn: "", de: "", ex1: "", ex1de: "", phon: "" }));
  }, [adding, store, toast, foreign, pair, isLat]);

  const startEdit = (w) => { setEditingId(w.id); setDraft({ fgn: isLat ? (w.grundform || "") : (w[foreign] || ""), de: w.de, lists: w.lists || [], lernform: w.lernform || "", wortart: w.wortart || "Nomen", ex1: (w.examples || [])[0] || "", ex2: (w.examples || [])[1] || "", ex1de: (w.examplesDe || [])[0] || "", ex2de: (w.examplesDe || [])[1] || "", phon: w.phonetic || "" }); };
  const saveEdit = (id) => {
    /* Index-treu speichern: examples[i] und examplesDe[i] gehören zusammen.
     * Deshalb hier KEIN filter(Boolean) — sonst rutscht die zweite Übersetzung
     * unter den ersten Satz, sobald einer davon leer bleibt. */
    const examples = [draft.ex1, draft.ex2].map((s) => (s || "").trim());
    const examplesDe = [draft.ex1de, draft.ex2de].map((s) => (s || "").trim());
    const phonetic = (draft.phon || "").trim();
    const patch = isLat
      ? { grundform: draft.fgn.trim(), lernform: draft.lernform.trim(), wortart: draft.wortart, de: draft.de.trim(), examples, examplesDe, phonetic, lists: draft.lists, review: false }
      : { [foreign]: draft.fgn.trim(), de: draft.de.trim(), examples, examplesDe, phonetic, lists: draft.lists, review: false };
    store.updateWord(id, patch); setEditingId(null);
  };
  const toggleDraftList = (lid) => setDraft((d) => ({ ...d, lists: d.lists.includes(lid) ? d.lists.filter((x) => x !== lid) : [...d.lists, lid] }));

  /* ---- list management ---- */
  const newList = () => { const name = "Wortliste " + (pairLists.length + 1); const id = store.addList(name, pair); setActiveList(id); setEditingListId(id); setListName(name); };
  const commitRename = () => { if (editingListId) store.renameList(editingListId, listName.trim() || "Untitled"); setEditingListId(null); };
  const deleteActiveList = () => {
    const l = lists.find((x) => x.id === activeList); if (!l) return;
    if (confirm(`Die Wortliste „${l.name}“ löschen? Die Wörter bleiben erhalten und verlassen nur diese Liste.`)) { store.deleteList(activeList); setActiveList("__all"); toast("Wortliste gelöscht", "trash"); }
  };

  /* ---- share the active list (copy-on-import snapshot) ---- */
  const shareActiveList = async () => {
    const l = lists.find((x) => x.id === activeList); if (!l) return;
    const members = pairVocab.filter((w) => (w.lists || []).includes(activeList));
    if (!members.length) { toast("Diese Liste hat noch keine Wörter", "x"); return; }
    const words = members.map((w) => isLat
      ? { grundform: w.grundform || "", lernform: w.lernform || "", wortart: w.wortart || "", de: w.de || "" }
      : { [foreign]: w[foreign] || "", de: w.de || "" });
    try {
      const token = await publishList({ name: l.name, pair, words });
      setShareName(l.name); setShareToken(token);
    } catch (e) { toast("Teilen fehlgeschlagen — bist du angemeldet?", "x"); }
  };

  /* ---- commit an import / scan into a chosen list ---- */
  const commitImport = useCallback(async (pairs, listId, name) => {
    setBusy(true);
    let filled = 0;
    const result = [];
    if (isLat) {
      // Latin: dedup on grundform|de, no auto-translation.
      for (const r of pairs) {
        const grundform = (r.grundform || r.fgn || "").trim();
        const lernform = (r.lernform || "").trim();
        const wortart = (r.wortart || "").trim();
        const de = (r.de || "").trim();
        const examples = (r.examples || []).map((s) => String(s).trim()).filter(Boolean);
        const phonetic = (r.phonetic || "").trim();
        if (grundform || lernform || de) result.push({ grundform, lernform, wortart, de, examples, phonetic, review: false, pair, lists: [listId] });
      }
      const key = (w) => ((w.grundform || "") + "|" + (w.de || "")).toLowerCase();
      const existing = new Set(pairVocab.map(key));
      const fresh = result.filter((w) => !existing.has(key(w)));
      store.addWords(fresh);
      setActiveList(listId);
      setBusy(false);
      toast(`Added ${fresh.length} word${fresh.length === 1 ? "" : "s"} to “${name}”`, "check");
      return;
    }
    for (const r of pairs) {
      let fgn = (r.fgn || "").trim(), de = (r.de || "").trim();
      let review = false;
      if (fgn && !de) { const tr = await translateWord(fgn, foreign, "de"); de = tr.text; review = true; if (tr.text) filled++; }
      else if (de && !fgn) { const tr = await translateWord(de, "de", foreign); fgn = tr.text; review = true; if (tr.text) filled++; }
      const examples = (r.examples || []).map((s) => String(s).trim()).filter(Boolean);
      const phonetic = (r.phonetic || "").trim();
      if (fgn || de) result.push({ [foreign]: fgn, de, examples, phonetic, review, pair, lists: [listId] });
    }
    const existing = new Set(pairVocab.map((w) => ((w[foreign] || "") + "|" + w.de).toLowerCase()));
    const fresh = result.filter((w) => !existing.has(((w[foreign] || "") + "|" + w.de).toLowerCase()));
    store.addWords(fresh);
    setActiveList(listId);
    setBusy(false);
    toast(`Added ${fresh.length} word${fresh.length === 1 ? "" : "s"}${filled ? ` · ${filled} auto-filled` : ""} to “${name}”`, "check");
  }, [pairVocab, store, toast, foreign, pair, isLat]);

  /* ---- excel ---- */

  // Two explicit example columns instead of one delimited cell: a sentence may
  // contain any punctuation, and "|" / ";" are already column separators here.
  const exampleRows = isLat
    ? [["canis", "canis, canis, m.", "Nomen", "der Hund", "", "Canis in horto currit.", "", "Tiere"], ["video", "video, videre, vidi, visum", "Verb", "sehen", "", "Puellam video.", "Nihil videre possum.", "Verben"], ["ruber", "ruber, rubra, rubrum", "Adjektiv", "rot", "", "Rosa rubra est.", "", "Farben"]]
    : pair === "fr-de"
    ? [["le chien", "der Hund", "ʃjɛ̃", "Le chien court dans le jardin.", "", "Animaux"], ["rouge", "", "ʁuʒ", "La rose est rouge.", "", "Couleurs"], ["", "das Buch", "", "", "", "École"]]
    : [["dog", "der Hund", "dɒɡ", "The dog runs in the garden.", "My dog is very old.", "Animals"], ["red", "", "rɛd", "The rose is red.", "", "Colours"], ["", "das Buch", "", "", "", "School"]];

  const catBadge = (w: any) => {
    if (!practiceable(w)) return <span className="badge red"><span className="dot" />{txt("Übersetzung fehlt")}</span>;
    const stufe = deriveProfile(stats[w.id]?.fsrs, retentionFor(settings)).stufe;
    return <span className={"badge " + STUFE_BADGE[stufe]}><span className="dot" />{txt(STUFE_LANG[stufe])}</span>;
  };

  return (
    <div>
      {/* list bar */}
      <div className="listbar">
        <button className={"ltab" + (activeList === "__all" ? " on" : "")} onClick={() => setActiveList("__all")}>
          {txt("Alle Wörter")} <span className="ltab-n">{pairVocab.length}</span>
        </button>
        {pairLists.map((l) => (
          <button key={l.id} className={"ltab" + (activeList === l.id ? " on" : "")} onClick={() => setActiveList(l.id)}>
            {l.name} <span className="ltab-n">{pairVocab.filter((w) => (w.lists || []).includes(l.id)).length}</span>
          </button>
        ))}
        <button className="ltab ltab-new" onClick={newList}><Icon name="plus" size={14} /> {txt("Neue Liste")}</button>
      </div>

      {/* active list header */}
      {activeList !== "__all" && (
        <div className="listhead">
          {editingListId === activeList ? (
            <input className="mini-input" style={{ maxWidth: 260, fontFamily: "var(--serif)", fontSize: 18 }} autoFocus
              value={listName} onChange={(e) => setListName(e.target.value)} onBlur={commitRename}
              onKeyDown={(e) => e.key === "Enter" && commitRename()} />
          ) : (
            <div className="section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {listNameOf(activeList)}
              {/* PFLICHT 2: "Wörter ohne Liste" is device-local — not renamable/shareable/deletable as a list */}
              {!activeIsNoList && <button className="icon-btn" style={{ width: 30, height: 30 }} title={txt("Umbenennen")}
                onClick={() => { setEditingListId(activeList); setListName(listNameOf(activeList)); }}><Icon name="edit" size={14} /></button>}
            </div>
          )}
          <div className="grow" />
          <button className="btn btn-sm btn-primary" onClick={() => practiseList(activeList)}><Icon name="cards" size={14} /> {txt("Üben")}</button>
          {canShare && !activeIsNoList && <button className="btn btn-ghost btn-sm" onClick={shareActiveList}><Icon name="upload" size={14} /> {txt("Teilen")}</button>}
          {!activeIsNoList && <button className="btn btn-ghost btn-sm" onClick={deleteActiveList}><Icon name="trash" size={14} /> {txt("Liste löschen")}</button>}
        </div>
      )}

      {/* Die Liste als Einheit: wie weit sie ist und wann sie dran ist.
          Dieselbe Kennzahl wie im Uebungsplan -- readyPercent, eine Quelle. */}
      {activeList !== "__all" && activeListStand && (
        <div className="listmeta">
          <div className="listmeta-stand">
            <span className="listmeta-dot" style={{ background: TONE_VAR[readyTone(activeListStand.pct, settings)] }} />
            <b>{activeListStand.pct} %</b> bereit
            <span className="faint"> · {activeListStand.prof.total} {activeListStand.prof.total === 1 ? "Wort" : "Wörter"}</span>
          </div>
          <MasteryBar dist={activeListStand.prof.dist} total={activeListStand.prof.total} showLegend={false} />
          <label className="listmeta-due">
            <Icon name="target" size={13} /> Zieldatum
            <input type="date" className="field" style={{ width: "auto" }}
              value={activeListObj?.dueDate ? new Date(activeListObj.dueDate).toISOString().slice(0, 10) : ""}
              onChange={(e) => setListDue(activeList, e.target.value)} />
            {/* Ein natives Datumsfeld laesst sich auf iOS nicht zuverlaessig leeren. */}
            {activeListObj?.dueDate && (
              <button className="icon-btn" style={{ width: 26, height: 26 }} title={txt("Zieldatum entfernen")}
                onClick={() => setListDue(activeList, "")}><Icon name="x" size={12} /></button>
            )}
          </label>
          {activeListStand.pg && (
            <div className="exam-box">
              <div className="exam-head">
                <Icon name="target" size={13} /> {activeListStand.pg.daysLeft < 0 ? "Termin vorbei"
                  : activeListStand.pg.daysLeft === 0 ? "heute dran"
                  : `noch ${activeListStand.pg.daysLeft} ${activeListStand.pg.daysLeft === 1 ? "Tag" : "Tage"}`} · <b>{activeListStand.pg.buckets.sicher.length} von {activeListStand.pg.total} sitzen sicher</b> <span className="faint">{txt("· Schätzung")}</span>
              </div>
              {activeListStand.pg.need > 0 && activeListStand.pg.daysLeft >= 0 && (
                <div className="row" style={{ justifyContent: "space-between", marginTop: 7, gap: 8, flexWrap: "wrap" }}>
                  <span className="faint" style={{ fontSize: 12 }}>
                    {activeListStand.pg.need} {activeListStand.pg.need === 1 ? "Wort" : "Wörter"} brauchen noch Übung · etwa {activeListStand.pg.perDay} pro Tag
                  </span>
                  <button className="btn btn-sm btn-amber" onClick={() => practiseList(activeList)}>
                    <Icon name="flame" size={13} /> Jetzt üben
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* toolbar */}
      <div className="bar">
        <PairPill />
        <div className="search">
          <Icon name="search" size={17} />
          <input className="field" placeholder={txt("Wörter suchen …")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="btn btn-sm btn-amber" onClick={() => { setPasteSeed(""); setPasteDraft(false); setPasteOpen(true); }}><Icon name="list" size={15} /> {txt("Einfügen")}</button>
        {isConfigured && <button className="btn btn-sm" onClick={() => openImport()} title={txt("Eine Liste, die dir jemand geteilt hat, übernehmen")}><Icon name="download" size={15} /> {txt("Geteilte Liste importieren")}</button>}
        <button className={"btn btn-sm" + (selectMode ? " btn-primary" : "")} onClick={() => { setSelectMode((m) => !m); setSelectedIds([]); }}><Icon name="check" size={15} /> {txt(selectMode ? "Auswahl beenden" : "Auswählen")}</button>
      </div>

      {/* add row */}
      <div className="panel" style={{ padding: 14, marginBottom: 16 }}>
        <div className="row wrap" style={{ gap: 10 }}>
          {isLat ? (
            <>
              <input className="field" style={{ width: 130 }} placeholder={txt("Grundform")} value={adding.fgn}
                onChange={(e) => setAdding({ ...adding, fgn: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addWord()} />
              <input className="field grow" style={{ minWidth: 180 }} placeholder={txt("Lernform (z. B. canis, canis, m.)")} value={adding.lernform}
                onChange={(e) => setAdding({ ...adding, lernform: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addWord()} />
              <select className="field" style={{ width: "auto", minWidth: 110 }} value={adding.wortart} onChange={(e) => setAdding({ ...adding, wortart: e.target.value })}>
                {WORTARTEN.map((wa) => <option key={wa} value={wa}>{wa}</option>)}
              </select>
              <input className="field grow" style={{ minWidth: 130 }} placeholder={txt("Deutsch (der/die/das)")} value={adding.de}
                onChange={(e) => setAdding({ ...adding, de: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addWord()} />
            </>
          ) : (
            <>
              <input className="field grow" style={{ minWidth: 140 }} placeholder={P.foreignLabel} value={adding.fgn}
                onChange={(e) => setAdding({ ...adding, fgn: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addWord()} />
              <Icon name="arrowRight" size={18} style={{ color: "var(--ink-faint)" }} />
              <input className="field grow" style={{ minWidth: 140 }} placeholder={txt("Deutsch (der/die/das)")} value={adding.de}
                onChange={(e) => setAdding({ ...adding, de: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addWord()} />
            </>
          )}
          <select className="field" style={{ width: "auto", minWidth: 120 }} value={adding.listId} onChange={(e) => setAdding({ ...adding, listId: e.target.value })}>
            {pairLists.length === 0 && <option value="">{txt("— beim Hinzufügen neue Liste —")}</option>}
            {pairLists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={addWord} disabled={busy || (!adding.fgn.trim() && !adding.de.trim() && !adding.lernform.trim())}>
            {busy ? <Icon name="refresh" size={15} /> : <Icon name="plus" size={15} />} {txt("Hinzufügen")}
          </button>
        </div>
        {isLat && <LatinKeys hint="Feld antippen, dann Zeichen wählen" />}
        <div className="row" style={{ marginTop: 10 }}>
          <input className="field" style={{ width: 150 }} placeholder={txt("Aussprache (optional)")} value={adding.phon}
            onChange={(e) => setAdding({ ...adding, phon: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addWord()} />
          <input className="field grow" placeholder={`Beispielsatz auf Deutsch (optional)`} value={adding.ex1de}
            onChange={(e) => setAdding({ ...adding, ex1de: e.target.value })} />
          <input className="field grow" placeholder={`Beispielsatz auf ${P.foreignLabel} (optional)`} value={adding.ex1}
            onChange={(e) => setAdding({ ...adding, ex1: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addWord()} />
        </div>
        <div className="faint" style={{ fontSize: 12, marginTop: 9, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="sparkle" size={13} /> {txt(isLat ? "Latein: Grundform, volle Lernform und Wortart eingeben." : "Es genügt eine Sprache — die andere wird übersetzt und zum Nachschauen vorgemerkt.")}
        </div>
      </div>

      <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
        <span className="muted" style={{ fontSize: 13.5 }}>{txt(filtered.length === 1 ? "{n} Wort" : "{n} Wörter", { n: filtered.length })}{activeList !== "__all" ? txt(" in „{liste}“", { liste: listNameOf(activeList) }) : ""}</span>
      </div>

      {/* Mehrfachauswahl -> in eine Wortliste */}
      {selectMode && (
        <div className="panel" style={{ padding: 12, marginBottom: 12 }}>
          <div className="row wrap" style={{ gap: 10, alignItems: "center" }}>
            <span style={{ fontWeight: 600 }}>{selectedIds.length} ausgewählt</span>
            <span className="grow" />
            <input className="field" style={{ width: 160 }} placeholder={txt("Neue Wortliste …")} value={newListName} onChange={(e) => setNewListName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && createListFromSel()} />
            <button className="btn btn-sm btn-primary" disabled={!selectedIds.length} onClick={createListFromSel}><Icon name="plus" size={14} /> {txt("Neue Wortliste")}</button>
            {pairLists.length > 0 && (
              <>
                <select className="field" style={{ width: "auto", minWidth: 130 }} value={addToListId} onChange={(e) => setAddToListId(e.target.value)}>
                  <option value="">{txt("Zu Wortliste …")}</option>
                  {pairLists.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <button className="btn btn-sm" disabled={!selectedIds.length || !addToListId} onClick={addSelToList}>{txt("Hinzufügen")}</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* table */}
      <div className="table-wrap">
        <table className="vt">
          <thead>
            <tr>
              <th style={{ width: "28%" }}>{P.foreignLabel}</th>
              <th style={{ width: "28%" }}>{txt("Deutsch")}</th>
              <th style={{ width: "30%" }}>{txt("Listen")}</th>
              <th style={{ width: "14%" }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => editingId === w.id ? (
              <tr key={w.id}>
                <td>
                  <input className="mini-input" placeholder={isLat ? "Grundform" : undefined} value={draft.fgn} onChange={(e) => setDraft({ ...draft, fgn: e.target.value })} />
                  {isLat && (
                    <>
                      <input className="mini-input" style={{ marginTop: 6 }} placeholder={txt("Lernform")} value={draft.lernform} onChange={(e) => setDraft({ ...draft, lernform: e.target.value })} />
                      <select className="mini-input" style={{ marginTop: 6 }} value={draft.wortart} onChange={(e) => setDraft({ ...draft, wortart: e.target.value })}>
                        {WORTARTEN.map((wa) => <option key={wa} value={wa}>{wa}</option>)}
                      </select>
                    </>
                  )}
                </td>
                <td><input className="mini-input" value={draft.de} onChange={(e) => setDraft({ ...draft, de: e.target.value })} /></td>
                <td colSpan={2}>
                  <div className="chk-wrap">
                    {pairLists.map((l) => (
                      <label key={l.id} className={"chk" + (draft.lists.includes(l.id) ? " on" : "")} onClick={() => toggleDraftList(l.id)}>
                        {draft.lists.includes(l.id) && <Icon name="check" size={12} />}{l.name}
                      </label>
                    ))}
                  </div>
                  {isLat && <LatinKeys />}
                  <input className="mini-input" style={{ marginTop: 6, maxWidth: 160 }} placeholder={txt("Aussprache")} value={draft.phon} onChange={(e) => setDraft({ ...draft, phon: e.target.value })} />
                  <input className="mini-input" style={{ marginTop: 6 }} placeholder={`Beispielsatz (${P.foreignLabel})`} value={draft.ex1} onChange={(e) => setDraft({ ...draft, ex1: e.target.value })} />
                  <input className="mini-input" style={{ marginTop: 6 }} placeholder={txt("Zweiter Beispielsatz (optional)")} value={draft.ex2} onChange={(e) => setDraft({ ...draft, ex2: e.target.value })} />
                </td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => saveEdit(w.id)}><Icon name="check" size={14} /></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>{txt("Abbrechen")}</button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={w.id} className={(selectMode && selectedIds.includes(w.id) ? "row-sel" : "") + " row-click"}
                onClick={() => selectMode ? toggleSel(w.id) : setDetailWord(w)} style={{ cursor: "pointer" }}
                title={!selectMode ? "FSRS-Details ansehen" : undefined}>
                <td className="cell-en">
                  {selectMode && <input type="checkbox" checked={selectedIds.includes(w.id)} readOnly style={{ marginRight: 8, accentColor: "var(--amber-deep)" }} />}
                  {fgnOf(w) || <span className="faint">—</span>}
                  {isLat && w.lernform && <div className="faint" style={{ fontSize: 12, fontStyle: "italic" }}>{w.lernform}</div>}
                  {isLat && w.wortart && <div className="faint" style={{ fontSize: 11.5 }}>{w.wortart}</div>}
                  {w.review && <span className="badge amber" style={{ marginTop: 4 }}><span className="dot" />{txt("Nachschauen")}</span>}
                </td>
                <td className="cell-de">{w.de || <span className="faint">—</span>}</td>
                <td>
                  <div className="list-chips">
                    {(w.lists || []).length ? (w.lists || []).map((lid) => <span key={lid} className="mini-chip">{listNameOf(lid)}</span>) : <span className="faint">—</span>}
                  </div>
                </td>
                <td>
                  {!selectMode && (
                  <div className="row-actions" onClick={(e) => e.stopPropagation()}>
                    <button className="icon-btn" style={{ width: 32, height: 32 }} title={txt("Bearbeiten")} onClick={() => startEdit(w)}><Icon name="edit" size={15} /></button>
                    <button className="icon-btn" style={{ width: 32, height: 32 }} title={txt("Löschen")} onClick={() => store.deleteWord(w.id)}><Icon name="trash" size={15} /></button>
                  </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && <div className="empty"><div className="big">{txt("Noch keine Wörter")}</div><div>{txt("Füge eines oben hinzu oder nutze „Einfügen“.")}</div></div>}
      </div>

      <PasteModal open={pasteOpen} pair={pair} initialText={pasteSeed} draftHint={pasteDraft}
        onClose={() => setPasteOpen(false)}
        onParsed={(rows) => { setPasteOpen(false); setReviewRows(rows); }} />
      <WordDetailModal open={!!detailWord} word={detailWord} onClose={() => setDetailWord(null)} onEdit={(w) => startEdit(w)} />
      <ReviewModal open={!!reviewRows} rows={reviewRows} pair={pair}
        onClose={() => setReviewRows(null)}
        onConfirm={(rows) => { setReviewRows(null); setPendingImport(rows); }} />
      <ListPicker open={!!pendingImport} pair={pair} title={txt("In welche Liste?")}
        subtitle={pendingImport ? `${pendingImport.length} Wort${pendingImport.length === 1 ? "" : "er"} bereit zum Import` : ""}
        onClose={() => setPendingImport(null)}
        onPick={(id, name) => { const p = pendingImport; setPendingImport(null); commitImport(p, id, name); }} />
      <ShareModal open={!!shareToken} token={shareToken} listName={shareName} onClose={() => setShareToken(null)} />
    </div>
  );
}

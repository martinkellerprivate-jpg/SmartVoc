import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { txt } from "../lib/i18n";
import { useStore } from "../store/StoreProvider";
import { useToast } from "../ui/Toast";
import { Icon } from "../ui/Icon";
import { translateWord } from "../lib/translate";
import { deriveProfile, retentionFor } from "../lib/fsrs";
import { examPrognosis } from "../lib/engine";
import { STUFE_BADGE, STUFE_LANG, STUFE_FARBE, STUFE_KURZ, STUFE_ORDER } from "../lib/stufen";
import { readyPercent, readyTone, listReadiness, TONE_VAR } from "../lib/readiness";
import { MasteryBar } from "../ui/MasteryBar";
import { PAIRS, practiceable, isLatinPair } from "../lib/pairs";
import { latinHeadword } from "../lib/latin";
import { isConfigured } from "../lib/supabase";
import { istWeb } from "../lib/native";
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
import { useAlsUnterkopf } from "../ui/ScreenHead";
import { FeldEingabe, FeldAuswahl } from "../ui/FeldZeile";
import { LernstandBlock } from "../ui/LernstandBlock";
import { SMART_ACCESS } from "../lib/smartlists";
import { resolveSmart, resolveToday } from "../lib/engine";

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

  /* Zwei Ebenen, wie im Entwurf: `offen === null` ist die Uebersicht,
   * sonst die geoeffnete Liste. Eine Reiterleiste aller Listen gab es hier
   * einmal -- sie vermischte die Wahl der Liste mit der Arbeit an den
   * Woertern, und genau darin verlor man sich. */
  const [offen, setOffen] = useState<{ art: "liste" | "smart" | "alle"; ref: string } | null>(null);
  const activeList = offen?.art === "liste" ? offen.ref : "__all";
  const [listMenu, setListMenu] = useState(false);
  const [neuesWortOffen, setNeuesWortOffen] = useState(false);
  const [neueListe, setNeueListe] = useState(false);
  const [nlName, setNlName] = useState("");
  const [nlDatum, setNlDatum] = useState("");
  const [smartHilfe, setSmartHilfe] = useState(false);
  /* Auswahl in der geoeffneten Liste. Hervorgehoben wird wie ueberall sonst
   * in der App: Tintenrand, keine Farbflaeche. Loeschen und Bearbeiten
   * stehen ausgegraut bereit und werden scharf, sobald etwas gewaehlt ist --
   * Bearbeiten nur bei genau einem, denn zwei Woerter lassen sich nicht in
   * einem Formular aendern. */
  const [gewaehlt, setGewaehlt] = useState<string[]>([]);
  const [listenSuche, setListenSuche] = useState("");
  const toggleWort = (id: string) => setGewaehlt((g) => g.includes(id) ? g.filter((x) => x !== id) : [...g, id]);
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
  const canShare = isConfigured && !!auth.user;
  /* Tabellen nur im Web und nur angemeldet. `auth.ready` gehoert dazu:
   * sonst blitzt der Bereich beim Start auf oder weg, waehrend die Sitzung
   * noch geprueft wird. */
  const tabellen = istWeb() && auth.ready && isConfigured && !!auth.user;
  const dateiRef = useRef<any>(null);

  const leseTabelle = useCallback(async (file: any) => {
    if (!file) return;
    setBusy(true);
    try {
      const XLSX = await import("xlsx");            // eigenes Buendelstueck
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const rows: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
      const parsed: any[] = [];
      for (const row of rows) {
        const deK = findKey(row, /germ|deut|^de$/i);
        const ex1K = findKey(row, /beispiel.*1|example.*1|satz.*1/i);
        const ex2K = findKey(row, /beispiel.*2|example.*2|satz.*2/i);
        const phK = findKey(row, /ausspr|phonet|lautschr|pronunc|ipa/i);
        const phonetic = (phK ? String(row[phK]) : "").trim();
        const exK = ex1K ? null : findKey(row, /beispiel|example|satz|phrase/i);
        const examples = [
          ...(ex1K ? [String(row[ex1K])] : []),
          ...(ex2K ? [String(row[ex2K])] : []),
          ...(exK ? String(row[exK]).split(/\r?\n/) : []),
        ].map((x) => x.trim()).filter(Boolean);
        if (isLat) {
          const gfK = findKey(row, /grundform|grund|^la$|latein|lat/i);
          const lfK = findKey(row, /lernform|stammform|formen/i);
          const waK = findKey(row, /wortart|wort.?art|^art$|pos/i);
          const grundform = (gfK ? String(row[gfK]) : "").trim();
          const lernform = (lfK ? String(row[lfK]) : "").trim();
          const wortart = (waK ? String(row[waK]) : "").trim();
          const de = (deK ? String(row[deK]) : "").trim();
          if (grundform || lernform || de) parsed.push({ grundform, lernform, wortart, de, examples, phonetic });
          continue;
        }
        const skip = new Set([deK, ex1K, ex2K, exK, phK].filter(Boolean) as string[]);
        const fgnK = findKey(row, /eng|fran|fren|^fr$|^en$/i) || Object.keys(row).find((k) => !skip.has(k));
        const fgn = (fgnK ? String(row[fgnK]) : "").trim();
        const de = (deK ? String(row[deK]) : "").trim();
        if (fgn || de) parsed.push({ fgn, de, examples, phonetic });
      }
      setBusy(false);
      if (!parsed.length) { toast(txt("In dieser Datei stehen keine Wörter"), "x"); return; }
      setReviewRows(parsed);          // derselbe Weg wie beim Einfügen: erst ansehen, dann übernehmen
    } catch (e) { setBusy(false); toast(txt("Diese Datei liess sich nicht lesen"), "x"); }
  }, [toast, isLat]);

  const ladeVorlage = async () => {
    const XLSX = await import("xlsx");
    const head = isLat
      ? ["Grundform", "Lernform", "Wortart", "Deutsch", "Aussprache", "Beispielsatz 1", "Beispielsatz 2"]
      : [P.foreignLabel, "Deutsch", "Aussprache", "Beispielsatz 1", "Beispielsatz 2"];
    const ws = XLSX.utils.aoa_to_sheet([head, ...exampleRows.map((r: any[]) => r.slice(0, head.length))]);
    ws["!cols"] = head.map((_, i) => ({ wch: i === 0 ? 18 : i === 1 ? 24 : 26 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Wortschatz");
    XLSX.writeFile(wb, "smartvoc-vorlage.xlsx");
    toast(txt("Vorlage geladen — ausfüllen und wieder einlesen"), "download");
  };

  const pairLists = useMemo(() => lists.filter((l) => l.pair === pair), [lists, pair]);
  const activeListObj = lists.find((l: any) => l.id === activeList);
  /* Der Stand JEDER Liste -- nicht nur der offenen. Wo kein Platz fuer
   * Balken und Prozent ist, steht der Ampelpunkt; das ist dieselbe Zahl in
   * der knapperen Darstellung. */
  const listenStand = useMemo(() => {
    const ret = retentionFor(settings);
    const m: Record<string, any> = {};
    for (const l of pairLists) m[l.id] = listReadiness(l, vocab, stats, ret, settings);
    return m;
  }, [pairLists, vocab, stats, settings]);

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

  useEffect(() => { setOffen(null); }, [pair]);
  useEffect(() => {
    setAdding((a) => ({ ...a, listId: (activeList !== "__all" ? activeList : (pairLists[0] && pairLists[0].id)) || "" }));
  }, [activeList, pairLists]);
  useEffect(() => { if (offen?.art === "liste" && !lists.some((l) => l.id === offen.ref)) setOffen(null); }, [lists, offen]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return pairVocab.filter((w) =>
      (activeList === "__all" || (w.lists || []).includes(activeList)) &&
      (!q || fgnOf(w).toLowerCase().includes(q) || (w.lernform || "").toLowerCase().includes(q) || (w.de || "").toLowerCase().includes(q)));
  }, [pairVocab, query, activeList, foreign, isLat]);

  /* Mit Termin zuerst und der naechste oben -- was bald dran ist, soll man
   * nicht suchen muessen. Der Rest alphabetisch. */
  const listsSortiert = useMemo(() => [...pairLists].sort((a: any, b: any) => {
    if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate;
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return String(a.name).localeCompare(String(b.name), "de");
  }), [pairLists]);

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
  /* Anlegen laeuft ueber das Blatt "Neue Liste": Name und Zieldatum werden
   * dort gesetzt, bevor die Liste entsteht. Vorher bekam sie einen
   * Platzhalternamen und man benannte sie hinterher um. */
  const legeListeAn = (name: string, dueDate?: number) => {
    const id = store.addList(name.trim() || txt("Neue Wortliste"), pair);
    if (dueDate) store.updateList(id, { dueDate });
    setOffen({ art: "liste", ref: id });
    return id;
  };
  const commitRename = () => { if (editingListId) store.renameList(editingListId, listName.trim() || "Untitled"); setEditingListId(null); };
  const deleteActiveList = () => {
    const l = lists.find((x) => x.id === activeList); if (!l) return;
    if (confirm(txt("Die Wortliste „{name}“ löschen? Die Wörter bleiben erhalten und verlassen nur diese Liste.", { name: l.name }))) { store.deleteList(activeList); setOffen(null); toast(txt("Wortliste gelöscht"), "trash"); }
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
      setOffen({ art: "liste", ref: listId });
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
    setOffen({ art: "liste", ref: listId });
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

  /* Die Fenster gelten auf beiden Ebenen, also stehen sie einmal hier. */
  const modale = (
    <>
      <PasteModal open={pasteOpen} pair={pair} initialText={pasteSeed} draftHint={pasteDraft}
        onClose={() => setPasteOpen(false)}
        onParsed={(rows: any) => { setPasteOpen(false); setReviewRows(rows); }} />
      <WordDetailModal open={!!detailWord} word={detailWord} onClose={() => setDetailWord(null)} onEdit={(w: any) => { setDetailWord(null); startEdit(w); }} />
      <ReviewModal open={!!reviewRows} rows={reviewRows} pair={pair}
        onClose={() => setReviewRows(null)}
        onConfirm={(rows: any) => { setReviewRows(null); setPendingImport(rows); }} />
      <ListPicker open={!!pendingImport} pair={pair} title={txt("In welche Liste?")}
        subtitle={pendingImport ? txt("{n} Wörter bereit zum Import", { n: (pendingImport as any).length }) : ""}
        onClose={() => setPendingImport(null)}
        onPick={(id: string, name: string) => { const p = pendingImport; setPendingImport(null); commitImport(p, id, name); }} />
      <ShareModal open={!!shareToken} token={shareToken} listName={shareName} onClose={() => setShareToken(null)} />

      {/* Bearbeiten: dieselben Felder wie im Wort-Detail, nur beschreibbar. */}
      {editingId && (() => {
        const w = vocab.find((x: any) => x.id === editingId);
        if (!w) return null;
        return (
          <div className="modal-backdrop" onClick={() => setEditingId(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520, maxHeight: "86vh", overflowY: "auto" } as any}>
              <div className="modal-head">
                <div className="modal-title">{txt("Wort bearbeiten")}</div>
                <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setEditingId(null)}><Icon name="x" size={16} /></button>
              </div>
              {/* Dieselben Zeilen wie im Wort-Detail, nur beschreibbar: Feldname
                  links, Inhalt rechts. Vorher war es ein Stapel leerer Felder,
                  bei dem man am Platzhalter erkannte, was hineingehoert -- und
                  sobald etwas drinstand, gar nicht mehr. */}
              <div className="fz-block">
                <FeldEingabe feld={isLat ? txt("Grundform") : P.foreignLabel}
                  wert={draft.fgn} onChange={(v) => setDraft({ ...draft, fgn: v })} />
                {isLat && (
                  <>
                    <FeldEingabe feld={txt("Stammformen")} wert={draft.lernform}
                      onChange={(v) => setDraft({ ...draft, lernform: v })} />
                    <FeldAuswahl feld={txt("Wortart")} wert={draft.wortart} werte={WORTARTEN}
                      onChange={(v) => setDraft({ ...draft, wortart: v })} />
                  </>
                )}
                <FeldEingabe feld={txt("Deutsch")} wert={draft.de}
                  onChange={(v) => setDraft({ ...draft, de: v })} />
                <FeldEingabe feld={txt("Lautschrift")} hinweis={txt("optional")} wert={draft.phon}
                  onChange={(v) => setDraft({ ...draft, phon: v })} />
                <FeldEingabe feld={txt("Beispielsatz 1")} hinweis={P.foreignLabel} wert={draft.ex1}
                  mehrzeilig onChange={(v) => setDraft({ ...draft, ex1: v })} />
                <FeldEingabe feld={txt("Beispielsatz 1")} hinweis={txt("Deutsch")} wert={draft.ex1de}
                  mehrzeilig onChange={(v) => setDraft({ ...draft, ex1de: v })} />
                <FeldEingabe feld={txt("Beispielsatz 2")} hinweis={P.foreignLabel} wert={draft.ex2}
                  mehrzeilig onChange={(v) => setDraft({ ...draft, ex2: v })} />
                <FeldEingabe feld={txt("Beispielsatz 2")} hinweis={txt("Deutsch")} wert={draft.ex2de}
                  mehrzeilig onChange={(v) => setDraft({ ...draft, ex2de: v })} />
              </div>
              {/* Der Lernstand -- derselbe Block wie in der Statistik. */}
              {(() => { const w = vocab.find((x: any) => x.id === editingId); return w ? <LernstandBlock word={w} /> : null; })()}
              {isLat && <LatinKeys hint={txt("Feld antippen, dann Zeichen wählen")} />}
              <div className="modal-foot">
                <button className="btn btn-ghost" onClick={() => { store.deleteWord(editingId); setEditingId(null); }}>
                  <Icon name="trash" size={14} /> {txt("Wort löschen")}
                </button>
                <button className="btn btn-primary" onClick={() => saveEdit(editingId)}>{txt("Speichern")}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Neue Liste: Name, dann das Zieldatum als bewusste Wahl. Vorher
          entstand die Liste sofort mit Platzhalternamen. */}
      {neueListe && (
        <div className="modal-backdrop" onClick={() => setNeueListe(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Neue Liste")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setNeueListe(false)}><Icon name="x" size={16} /></button>
            </div>
            <input className="field" style={{ width: "100%" }} autoFocus placeholder={txt("Name der Liste …")}
              value={nlName} onChange={(e) => setNlName(e.target.value)} />
            {/* Nur ein Datumsfeld. Zwei Wahlzeilen fuer "mit" und "ohne"
                waren eine Frage, die das leere Feld schon beantwortet:
                nichts eingetragen heisst kein Zieldatum. */}
            <div className="grp">{txt("Zieldatum")} <span className="hint">— {txt("optional")}</span></div>
            <div className="row" style={{ gap: 8 }}>
              <input type="date" className="field grow" value={nlDatum}
                onChange={(e) => setNlDatum(e.target.value)} aria-label={txt("Zieldatum")} />
              {nlDatum && (
                <button className="icon-btn" title={txt("Zieldatum entfernen")} onClick={() => setNlDatum("")}>
                  <Icon name="trash" size={14} />
                </button>
              )}
            </div>
            <div className="faint" style={{ fontSize: 11.5, marginTop: 6 }}>
              {txt("Leer lassen heisst: die Liste läuft nebenher.")}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setNeueListe(false)}>{txt("Abbrechen")}</button>
              <button className="btn btn-primary" onClick={() => {
                legeListeAn(nlName, nlDatum ? new Date(nlDatum + "T08:00:00").getTime() : undefined);
                setNeueListe(false); setNlName(""); setNlDatum("");
              }}>{txt("Anlegen")}</button>
            </div>
          </div>
        </div>
      )}

      {smartHilfe && (
        <div className="modal-backdrop" onClick={() => setSmartHilfe(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Smart Lists")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setSmartHilfe(false)}><Icon name="x" size={16} /></button>
            </div>
            <p className="said">{txt("Diese vier Listen stellt die App jeden Tag neu zusammen — quer über deine Wortlisten. Du kannst sie nicht ändern, nur ansehen und üben.")}</p>
            <div className="list">
              {SMART_ACCESS.map((sm) => (
                <div className="li" key={sm.ref}>
                  <Icon name={sm.icon as any} size={15} />
                  <span className="g">{txt(sm.label)}<div className="m">{txt(sm.kurz)}</div></span>
                </div>
              ))}
            </div>
            <div className="modal-foot">
              <button className="btn btn-primary" onClick={() => setSmartHilfe(false)}>{txt("Verstanden")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
  /* ---------------------------------------------------------- Wörter im Blick */
  const woerterImBlick = useMemo(() => {
    if (!offen) return [];
    if (offen.art === "alle") return pairVocab;
    if (offen.art === "liste") return pairVocab.filter((w: any) => (w.lists || []).includes(offen.ref));
    const ret = retentionFor(settings);
    return offen.ref === "heute"
      ? resolveToday(pairVocab, stats, lists, ret, settings.dailyGoal, settings.newPerDay)
      : resolveSmart(offen.ref, pairVocab, stats, settings.masteryCorrect, { retention: ret });
  }, [offen, pairVocab, stats, lists, settings]);

  const standImBlick = useMemo(() => {
    const dist: Record<string, number> = { sitzt: 0, sitzt_fast: 0, sitzt_schlecht: 0, neu: 0, noch_nicht_geuebt: 0 };
    const ret = retentionFor(settings);
    for (const w of woerterImBlick) {
      const stufe = !practiceable(w) ? "noch_nicht_geuebt" : deriveProfile(stats[w.id]?.fsrs, ret).stufe;
      dist[stufe]++;
    }
    return { dist, total: woerterImBlick.length };
  }, [woerterImBlick, stats, settings]);

  const smartZahl = (ref: string) => {
    const ret = retentionFor(settings);
    return ref === "heute"
      ? resolveToday(pairVocab, stats, lists, ret, settings.dailyGoal, settings.newPerDay).length
      : resolveSmart(ref, pairVocab, stats, settings.masteryCorrect, { retention: ret }).filter(practiceable).length;
  };

  const titelImBlick = !offen ? ""
    : offen.art === "alle" ? txt("Alle Wörter")
    : offen.art === "smart" ? txt((SMART_ACCESS.find((s) => s.ref === offen.ref) || {}).label || "Auswahl")
    : listNameOf(offen.ref);

  /* Eine Zeile, nicht eine Karte. Hier werden Wortlisten gebaut, nicht
   * Statistik gelesen: zwei Spalten, die zwei Woerter, und als einziges
   * Zeichen des Lernstands die Farbe der Zeile -- dieselbe Farbe wie in der
   * Leiste darueber. Die Zahlen pro Wort standen hier doppelt und anders als
   * in der Statistik; sie stehen jetzt nur noch im Detail. */
  const wortZeile = (w: any) => {
    const nurLesen = offen?.art === "smart";
    const ret = retentionFor(settings);
    const stufe = !practiceable(w) ? "noch_nicht_geuebt" : deriveProfile(stats[w.id]?.fsrs, ret).stufe;
    const an = gewaehlt.includes(w.id);
    return (
      <button key={w.id} className={"wz" + (an ? " sel" : "") + (nurLesen ? " ro" : "")}
        onClick={() => { if (!nurLesen) toggleWort(w.id); }} disabled={nurLesen}
        style={{ ["--stufe" as any]: STUFE_FARBE[stufe] }}
        aria-pressed={an} title={txt(STUFE_LANG[stufe])}>
        <span className="wz-f">{fgnOf(w) || <span className="faint">—</span>}</span>
        <span className="wz-d">{w.de || <span className="faint">—</span>}</span>
      </button>
    );
  };

  /* Der Titel der geoeffneten Liste steht in der einen Kopfzeile der App. */
  useAlsUnterkopf(offen ? titelImBlick : null, () => setOffen(null));

  /* =============================================== Eine Liste geöffnet */
  if (offen) {
    const l = offen.art === "liste" ? lists.find((x: any) => x.id === offen.ref) : null;
    const istSystemliste = l?.system === "nolist";
    const q = listenSuche.toLowerCase().trim();
    const sichtbar = q
      ? woerterImBlick.filter((w: any) => fgnOf(w).toLowerCase().includes(q)
          || (w.lernform || "").toLowerCase().includes(q) || (w.de || "").toLowerCase().includes(q))
      : woerterImBlick;
    const nurEines = gewaehlt.length === 1;
    /* Eine Smart List ist ein Blick, keine Ablage: die App stellt sie jeden
     * Tag neu zusammen. Wer darin ein Wort loeschte, loeschte es aus seiner
     * echten Liste -- ohne zu sehen, aus welcher. Also nur ansehen.
     * "Alle Woerter" ist dagegen ein echter Bestand und bleibt bearbeitbar. */
    const bearbeitbar = offen.art === "liste" || offen.art === "alle";
    return (
      <div className="wl wl-liste">
        {/* Alles bis zur Tabellenüberschrift steht fest; gescrollt wird nur
            die Liste. Sonst verliert man beim Blättern den Bezug -- welche
            Liste, wie weit, welche Spalte. */}
        <div className="wl-fest">
          {l && (
            <div className="ruest">
              <label className="pill pill-sel">
                <Icon name="calendar" size={14} />
                <span>{l.dueDate ? new Date(l.dueDate).toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric" }) : txt("Kein Zieldatum")}</span>
                <input type="date" value={l.dueDate ? new Date(l.dueDate).toISOString().slice(0, 10) : ""}
                  onChange={(e) => setListDue(l.id, e.target.value)} aria-label={txt("Zieldatum")} />
              </label>
              {l.dueDate && (
                <button className="icon-btn" title={txt("Zieldatum entfernen")} onClick={() => setListDue(l.id, "")}>
                  <Icon name="trash" size={13} />
                </button>
              )}
              {!istSystemliste && (
                <button className="pill" onClick={() => { setEditingListId(l.id); setListName(l.name); }}>
                  <Icon name="edit" size={14} /> {txt("Umbenennen")}
                </button>
              )}
              {canShare && !istSystemliste && (
                <button className="pill" onClick={shareActiveList}><Icon name="upload" size={14} /> {txt("Teilen")}</button>
              )}
            </div>
          )}
          {editingListId === offen.ref && (
            <input className="mini-input" style={{ marginTop: 8, fontFamily: "var(--serif)", fontSize: 17 }} autoFocus
              value={listName} onChange={(e) => setListName(e.target.value)} onBlur={commitRename}
              onKeyDown={(e) => e.key === "Enter" && commitRename()} />
          )}

          {standImBlick.total > 0 && (
            <div className="wl-stand">
              <MasteryBar dist={standImBlick.dist} total={standImBlick.total} />
              {/* Klein und oben, damit er nicht stört: die Statistik ist hier
                  nicht das Thema. */}
              <button className="wl-statlink" onClick={() => {
                store.setSettings({ statPair: pair, statLists: offen.art === "liste" ? [offen.ref] : [] });
                window.dispatchEvent(new CustomEvent("vt-tab", { detail: "stats" }));
              }}><Icon name="chart" size={12} /> {txt("Statistik")}</button>
            </div>
          )}

          {/* Wörter dazu und suchen -- oben, wo man beides erwartet. */}
          <div className="ruest wl-werkzeug">
            {offen.art === "liste" && (
              <>
                <button className="pill pill-on" onClick={() => { setAdding((a: any) => ({ ...a, listId: offen.ref })); setNeuesWortOffen(true); }}>
                  <Icon name="plus" size={14} /> {txt("Wort")}
                </button>
                <button className="pill" onClick={() => { setPasteSeed(""); setPasteDraft(false); setPasteOpen(true); }}>
                  <Icon name="list" size={14} /> {txt("Mehrere")}
                </button>
              </>
            )}
            <div className="search">
              <Icon name="search" size={16} />
              <input className="field" placeholder={txt("In dieser Liste suchen …")}
                value={listenSuche} onChange={(e) => setListenSuche(e.target.value)} />
            </div>
          </div>

          {/* Löschen und Bearbeiten stehen immer da, ausgegraut bis etwas
              gewählt ist -- so lernt man sie kennen, ohne sie zu suchen. */}
          {!bearbeitbar ? (
            <div className="quiet links" style={{ paddingTop: 8 }}>
              {txt("Diese Liste stellt die App täglich neu zusammen — hier lässt sich nichts ändern.")}
            </div>
          ) : (
          <div className="ruest wl-auswahl">
            <span className="wl-nsel">{gewaehlt.length ? txt("{n} gewählt", { n: gewaehlt.length }) : txt("Zeile antippen zum Auswählen")}</span>
            <button className="btn btn-sm" disabled={!nurEines}
              onClick={() => { const w = vocab.find((x: any) => x.id === gewaehlt[0]); if (w) startEdit(w); }}>
              <Icon name="edit" size={14} /> {txt("Bearbeiten")}
            </button>
            <button className="btn btn-sm" disabled={!gewaehlt.length}
              onClick={() => {
                if (!confirm(txt(gewaehlt.length === 1 ? "Dieses Wort endgültig löschen?" : "Diese {n} Wörter endgültig löschen?", { n: gewaehlt.length }))) return;
                gewaehlt.forEach((id) => store.deleteWord(id));
                toast(txt(gewaehlt.length === 1 ? "Wort gelöscht" : "{n} Wörter gelöscht", { n: gewaehlt.length }), "trash");
                setGewaehlt([]);
              }}><Icon name="trash" size={14} /> {txt("Löschen")}</button>
          </div>
          )}

          {sichtbar.length > 0 && (
            <div className="wz-kopf">
              <span className="wz-f">{P.short}</span>
              <span className="wz-d">DE</span>
            </div>
          )}
        </div>

        <div className="wl-roll">
          {sichtbar.length ? sichtbar.map(wortZeile) : q ? (
            <div className="empty">
              <div className="big">{txt("Nichts gefunden")}</div>
              <div>{txt("Anderer Suchbegriff, oder das Feld leeren")}</div>
            </div>
          ) : (
            /* Eine leere Liste ist der Moment, in dem man die Wege braucht --
               nicht ein Satz, der auf Knöpfe weiter oben zeigt. Vier Wege,
               nach Aufwand geordnet: der bequemste zuerst. */
            <div className="list" style={{ marginTop: 4 }}>
              <div className="grp">{txt("Wie füllst du diese Liste?")}</div>
              {isConfigured && (
                <button className="li" onClick={() => openImport()}>
                  <Icon name="download" size={15} />
                  <span className="g">{txt("Geteilte Liste übernehmen")}<div className="m">{txt("jemand hat dir einen Link geschickt")}</div></span>
                  <Icon name="arrowRight" size={14} />
                </button>
              )}
              <button className="li" onClick={() => { setPasteSeed(""); setPasteDraft(false); setPasteOpen(true); }}>
                <Icon name="list" size={15} />
                <span className="g">{txt("Liste einfügen")}<div className="m">{txt("aus dem Heft, einem Buch oder von einer KI")}</div></span>
                <Icon name="arrowRight" size={14} />
              </button>
              <button className="li" onClick={() => { setPasteSeed(""); setPasteDraft(true); setPasteOpen(true); }}>
                <Icon name="sparkle" size={15} />
                <span className="g">{txt("KI-Prompt zum Abschreiben")}<div className="m">{txt("Foto der Heftseite an eine KI, Ergebnis hier einfügen")}</div></span>
                <Icon name="arrowRight" size={14} />
              </button>
              <button className="li" onClick={() => { setAdding((x: any) => ({ ...x, listId: offen.ref })); setNeuesWortOffen(true); }}>
                <Icon name="plus" size={15} />
                <span className="g">{txt("Wörter einzeln eintippen")}<div className="m">{txt("dieselbe Maske wie beim Bearbeiten")}</div></span>
                <Icon name="arrowRight" size={14} />
              </button>
              {tabellen && (
                <button className="li" onClick={() => dateiRef.current?.click()}>
                  <Icon name="upload" size={15} />
                  <span className="g">{txt("Tabelle einlesen")}<div className="m">{txt("Excel oder CSV — nur in der Webversion")}</div></span>
                  <Icon name="arrowRight" size={14} />
                </button>
              )}
            </div>
          )}
          {l && !istSystemliste && (
            <button className="wl-loeschen" onClick={deleteActiveList}>
              <Icon name="trash" size={13} /> {txt("Diese Wortliste löschen")}
            </button>
          )}
        </div>

        {modale}
      </div>
    );
  }

  /* ==================================================== Die Übersicht */
  const treffer = query.trim()
    ? pairVocab.filter((w: any) => {
        const q = query.toLowerCase().trim();
        return fgnOf(w).toLowerCase().includes(q) || (w.lernform || "").toLowerCase().includes(q) || (w.de || "").toLowerCase().includes(q);
      })
    : null;

  return (
    <div className="wl">
      <div className="ruest">
        <PairPill />
        <div className="search">
          <Icon name="search" size={17} />
          <input className="field" placeholder={txt("In allen Wörtern suchen …")} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button className="pill pill-on" onClick={() => setNeueListe(true)}>
          <Icon name="plus" size={14} /> {txt("Neue Liste")}
        </button>
      </div>

      {treffer ? (
        <>
          <div className="grp">{txt("{n} Treffer", { n: treffer.length })}</div>
          {/* In der Uebersicht fuehrt ein Treffer in die Liste, in der das
              Wort liegt -- gesucht wird ja, um es dort zu finden. */}
          <div className="wz-kopf"><span className="wz-f">{P.short}</span><span className="wz-d">DE</span></div>
          <div className="list">{treffer.map((w: any) => {
            const stufe = !practiceable(w) ? "noch_nicht_geuebt" : deriveProfile(stats[w.id]?.fsrs, retentionFor(settings)).stufe;
            const lid = (w.lists || [])[0];
            return (
              <button key={w.id} className="wz" style={{ ["--stufe" as any]: STUFE_FARBE[stufe] }}
                onClick={() => { setQuery(""); if (lid) setOffen({ art: "liste", ref: lid }); else setOffen({ art: "alle", ref: "" }); }}>
                <span className="wz-f">{fgnOf(w) || <span className="faint">—</span>}</span>
                <span className="wz-d">{w.de || <span className="faint">—</span>}</span>
              </button>
            );
          })}</div>
          {!treffer.length && <div className="empty"><div className="big">{txt("Nichts gefunden")}</div><div>{txt("Anderer Suchbegriff, oder das Feld leeren")}</div></div>}
        </>
      ) : (
        <div className="list">
          <div className="grp">{txt("Deine Listen")}</div>
          {pairLists.length ? listsSortiert.map((l: any) => {
            const st = listenStand[l.id];
            const tage = l.dueDate ? Math.ceil((l.dueDate - Date.now()) / 86400000) : null;
            const sub = [txt("{n} Wörter", { n: st?.total ?? 0 })];
            if (l.dueDate) sub.push(txt("Zieldatum {d}", { d: new Date(l.dueDate).toLocaleDateString("de-CH", { day: "numeric", month: "numeric" }) })
              + (tage != null && tage >= 0 && tage <= 14 ? " · " + (tage === 0 ? txt("heute") : tage === 1 ? txt("morgen") : txt("in {n} Tagen", { n: tage })) : ""));
            return (
              <button key={l.id} className="li" onClick={() => setOffen({ art: "liste", ref: l.id })}>
                <span className="g">{l.name}
                  <div className="m">{sub.join(" · ")}</div>
                  {st && st.total > 0 && (
                    <span className="standline">
                      <MasteryBar dist={st.prof.dist} total={st.total} showLegend={false} />
                    </span>
                  )}
                </span>
                <Icon name="arrowRight" size={14} />
              </button>
            );
          }) : (
            <div className="quiet">{txt("Noch keine Wortliste — lege oben eine an.")}</div>
          )}

          {pairLists.length > 0 && (
            <div className="wl-legende">
              {STUFE_ORDER.map((k) => (
                <span key={k}><i style={{ background: STUFE_FARBE[k] }} />{txt(STUFE_KURZ[k])}</span>
              ))}
            </div>
          )}

          <div className="grp">{txt("Smart Lists")}
            <button className="chips-help" title={txt("Was bedeuten diese?")} onClick={() => setSmartHilfe(true)}>?</button>
          </div>
          {SMART_ACCESS.map((sm) => {
            const n = smartZahl(sm.ref);
            return (
              <button key={sm.ref} className="li" disabled={!n} onClick={() => setOffen({ art: "smart", ref: sm.ref })}>
                <Icon name={sm.icon as any} size={15} />
                <span className="g">{txt(sm.label)}<div className="m">{txt(sm.kurz)}</div></span>
                <span className="lchip-n">{n}</span>
              </button>
            );
          })}

          {/* „Alle Wörter“ ist der Rückfall, nicht der Einstieg — deshalb
              zuletzt und abgesetzt. Als Reiter an erster Stelle stand es
              vor den Listen, um die es eigentlich geht. */}
          <button className="li sel" style={{ marginTop: 11 }} onClick={() => setOffen({ art: "alle", ref: "" })}>
            <Icon name="list" size={15} />
            <span className="g">{txt("Alle Wörter")}</span>
            <span className="lchip-n">{pairVocab.length}</span>
            <Icon name="arrowRight" size={14} />
          </button>
        </div>
      )}

      {modale}
    </div>
  );
}

import { useState } from "react";
import { txt } from "../lib/i18n";
import { useStore } from "../store/StoreProvider";
import { useToast } from "../ui/Toast";
import { Icon } from "../ui/Icon";
import { RECOMMENDED } from "../lib/defaults";
import { useAuth } from "../sync/auth";
import { exportAllData, deleteLocalData } from "../lib/accountData";
import { deleteCloudAccount } from "../sync/share";
import { STARTERS, activateStarter, isStarterActivated } from "../data/starter";
import { PAIRS } from "../lib/pairs";
import { DEFAULTS, previewStabilityGood, retentionFor } from "../lib/fsrs";
import { FsrsValuesModal } from "./FsrsValuesModal";
import { toneLegend, TONE_VAR } from "../lib/readiness";

/* ===================================================================
 * settingsTab.jsx — adjustable engine parameters with research-backed
 * ("Recommended") defaults from learning psychology.
 * =================================================================== */

function Toggle({ value, onChange }: any) {
  return (
    <button className={"switch" + (value ? " on" : "")} role="switch" aria-checked={value}
      onClick={() => onChange(!value)}><span className="knob" /></button>
  );
}

function Seg({ value, options, onChange }: any) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)}>{o.label}</button>
      ))}
    </div>
  );
}

function SliderControl({ value, min, max, step, onChange, fmt }: any) {
  return (
    <div className="set-slider">
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="set-val">{fmt ? fmt(value) : value}</div>
    </div>
  );
}

/* Lebende Vorschau. Sie hängt an keinem eigenen Zustand: Schema, Erscheinungs-
 * bild, Kartentyp und Kartenschrift stehen als data-Attribute am <html>, also
 * zeigt dieselbe Auszeichnung wie beim Üben automatisch die aktuelle Wahl. */
function CardPreview() {
  return (
    <div className="set-preview" aria-hidden="true">
      <div className="set-preview-card">
        <div className="card-face">
          <span className="ruled-margin" />
          <div className="set-preview-word">le renard</div>
          <div className="set-preview-ex">Le renard traverse le jardin.</div>
        </div>
      </div>
    </div>
  );
}

/* Eine Einstellung als ZEILE: Name links, Wert rechts, Pfeil. Die Erklaerung
 * steht im Blatt, das sich beim Antippen oeffnet -- nicht darunter.
 *
 * Vorher trug jede Einstellung ihren ganzen Erklaertext auf der Seite. Das
 * war vollstaendig und unlesbar: zwanzig Einstellungen ergaben eine Wand aus
 * Absaetzen, durch die man scrollte, ohne etwas zu finden. Wer eine
 * Einstellung sucht, sucht ihren Namen; wer sie versteht, will den Wert
 * sehen; und nur wer zweifelt, braucht den Absatz.
 */
function ZeileWert({ titel, wert, atRec, onClick }: any) {
  return (
    <button className="setz" onClick={onClick}>
      <span className="setz-t">{titel}{atRec && <span className="rec-punkt" title={txt("Empfohlen")} />}</span>
      <span className="setz-w">{wert}</span>
      <Icon name="arrowRight" size={14} />
    </button>
  );
}

/* Ein Schalter braucht kein Blatt -- an oder aus ist die ganze Auskunft.
 * Die Zeile darunter sagt, was er bewirkt, in fuenf Woertern. */
function ZeileSchalter({ titel, sub, value, onChange }: any) {
  return (
    <label className="setz setz-schalter">
      <span className="setz-t">{titel}{sub && <span className="setz-sub">{sub}</span>}</span>
      <Toggle value={value} onChange={onChange} />
    </label>
  );
}

/* Das Blatt zu einer Einstellung: Name, Erklaerung, Bedienelement, und die
 * Voreinstellung als Zeile darunter -- mit einem Knopf zurueck zu ihr. */
function Blatt({ offen, titel, desc, rec, atRec, onZuruecksetzen, onClose, children }: any) {
  if (!offen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="modal-head">
          <div className="modal-title">{titel}</div>
          <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        {desc && <p className="said" style={{ marginTop: 0 }}>{desc}</p>}
        <div style={{ marginTop: 12 }}>{children}</div>
        {rec != null && (
          <div className="setz-rec">
            <span>{txt("Empfohlen:")} <b>{rec}</b></span>
            {!atRec && onZuruecksetzen && (
              <button className="btn btn-ghost btn-sm" onClick={onZuruecksetzen}>
                <Icon name="refresh" size={13} /> {txt("Zurück zur Empfehlung")}
              </button>
            )}
          </div>
        )}
        <div className="modal-foot">
          <button className="btn btn-primary" onClick={onClose}>{txt("Fertig")}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ title, desc, recLabel, atRec, children }: any) {
  return (
    <div className="set-row">
      <div className="set-info">
        <div className="set-title">{title}{atRec && <span className="rec-pill">{txt("✓ Empfohlen")}</span>}</div>
        {desc && <div className="set-desc">{desc}</div>}
        {recLabel != null && !atRec && <div className="set-rec">{txt("Empfohlen:")} <b>{recLabel}</b></div>}
      </div>
      <div className="set-control">{children}</div>
    </div>
  );

}

/* Drei Tempi statt eines Reglers von 3 bis 30. Die Zahl steht daneben --
 * wer sie kennt, findet sich zurecht; wer nicht, waehlt ein Wort. */
const TEMPI = [
  { n: 5,  name: "Gemächlich", sub: "wenig Neues, viel Wiederholung" },
  { n: 10, name: "Normal",     sub: "acht bis zwölf sind der belegte Normalwert" },
  { n: 20, name: "Zügig",      sub: "für Prüfungsphasen — mehr Rückstau" },
];
const TEMPO_NAME = (n: number) => (TEMPI.find((t) => t.n === n) || { name: String(n) }).name;

const MODUS: Record<string,string> = { type: "Eintippen", choice: "Auswählen", recall: "Selbstkontrolle", memorize: "Nur durchblättern" };

export function SettingsTab() {
  const store = useStore();
  const toast = useToast();
  const auth = useAuth();
  const { settings, setSettings, resetSettings } = store;
  const R = RECOMMENDED;
  const set = (k, v) => setSettings({ [k]: v });

  // Konto & Daten (Phase 7)
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [blatt, setBlatt] = useState<string | null>(null);
  const [imprintOpen, setImprintOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const [delErr, setDelErr] = useState("");
  const cloudActive = auth.configured && !!auth.user;
  const doExport = () => { exportAllData(new Date().toISOString()); toast("Daten exportiert", "download"); };
  const addStarter = (pair: string, stufe: number) => { const r = activateStarter(store, pair, stufe); toast(`„${r.label}" aktiviert · ${r.added} Wört${r.added === 1 ? "" : "er"}`, "check"); };
  const doDelete = async () => {
    if (confirmText.trim().toUpperCase() !== "LÖSCHEN") return;
    setDelBusy(true); setDelErr("");
    try {
      if (cloudActive) await deleteCloudAccount();
      deleteLocalData();
      if (cloudActive) await auth.signOut();
      location.reload();
    } catch (e: any) {
      setDelBusy(false);
      setDelErr("Löschen fehlgeschlagen: " + (e?.message || e));
    }
  };
  // Language visibility. Purely a display filter — switching a language off
  // hides it everywhere but leaves its words untouched in the database.
  const activeIds: string[] = Array.isArray(settings.activePairs) ? settings.activePairs : Object.keys(PAIRS);
  const togglePair = (id: string) => {
    const next = activeIds.includes(id) ? activeIds.filter((x) => x !== id) : [...activeIds, id];
    if (!next.length) { toast("Mindestens eine Sprache muss aktiv bleiben", "x"); return; }
    setSettings({ activePairs: next });
  };

  const atR = (k) => settings[k] === R[k];
  const onOff = (b) => (b ? "On" : "Off");

  // F-SETTINGS-ADVANCED
  const [advOpen, setAdvOpen] = useState(false);
  const [fsrsOpen, setFsrsOpen] = useState(false);
  const cfgVal = (k: string) => (typeof settings[k] === "number" && isFinite(settings[k]) ? settings[k] : (DEFAULTS as any)[k]);
  const resetCfg = (k: string) => set(k, (DEFAULTS as any)[k]);
  const advRet = retentionFor(settings);
  const speed = cfgVal("learningSpeed");
  const haeltAtSpeed = previewStabilityGood(speed, advRet, 3);
  const haeltBase = previewStabilityGood(1, advRet, 3);
  /* Uebersetzt wird hier, nicht an den sechzehn Aufrufstellen: die Texte
   * gehoeren zum Regler, und ein vergessenes txt() an einer von sechzehn
   * Stellen faellt niemandem auf, bis die Oberflaeche auf Englisch steht
   * und zwei Absaetze deutsch bleiben. */
  const advParam = (k: string, title: string, desc: string, min: number, max: number, step: number, fmt?: any) => (
    <Field title={txt(title)} desc={txt(desc)} recLabel={fmt ? fmt((DEFAULTS as any)[k]) : (DEFAULTS as any)[k]} atRec={cfgVal(k) === (DEFAULTS as any)[k]}>
      <div className="col" style={{ gap: 6, width: "100%" }}>
        <SliderControl value={cfgVal(k)} min={min} max={max} step={step} onChange={(v: number) => set(k, v)} fmt={fmt} />
        {cfgVal(k) !== (DEFAULTS as any)[k] && <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-end" }} onClick={() => resetCfg(k)}><Icon name="refresh" size={13} /> {txt("Auf Standard")}</button>}
      </div>
    </Field>
  );

  return (
    <div className="settings">
      <div className="set-head">
        <div>
          <div className="section-title">{txt("Einstellungen")}</div>
          <div className="muted" style={{ fontSize: 13.5, marginTop: 4, maxWidth: 540 }}>
            {txt("Die Voreinstellungen folgen der Lernpsychologie: verteiltes Üben, aktives Abrufen und wenige neue Wörter pro Tag. Du darfst alles ändern — die Marke „✓ Empfohlen“ zeigt, wo ein Wert auf dem belegten Normalwert steht.")}
          </div>
        </div>
        <button className="btn btn-sm" onClick={() => { resetSettings(); toast("Restored recommended settings", "refresh"); }}>
          <Icon name="refresh" size={14} /> {txt("Auf die Voreinstellungen zurücksetzen")}
        </button>
      </div>

      {/* Practice */}
      {/* Üben — als Zeilenliste wie im Entwurf. Name links, Wert rechts;
          die Erklärung öffnet sich als Blatt. Schalter bleiben in der Zeile,
          denn an oder aus ist die ganze Auskunft. */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="cards" size={16} /> {txt("Üben")}</div>

        <ZeileWert titel={txt("Antwortart")} atRec={atR("mode")}
          wert={txt(MODUS[settings.mode] || settings.mode)} onClick={() => setBlatt("mode")} />
        <ZeileWert titel={txt("Höchstens pro Tag")} atRec={atR("dailyGoal")}
          wert={txt("{n} Karten", { n: settings.dailyGoal })} onClick={() => setBlatt("dailyGoal")} />
        <ZeileWert titel={txt("Neue Wörter pro Tag")} atRec={atR("newPerDay")}
          wert={txt(TEMPO_NAME(settings.newPerDay))} onClick={() => setBlatt("newPerDay")} />
        <ZeileWert titel={txt("Vorschläge bei Multiple-Choice")} atRec={atR("choicesCount")}
          wert={String(settings.choicesCount)} onClick={() => setBlatt("choicesCount")} />
        <ZeileWert titel={txt("Lernintensität")} atRec={(settings.targetRetention ?? 0.9) === 0.9}
          wert={txt({ locker: "Locker", normal: "Normal", intensiv: "Intensiv" }[
            (settings.targetRetention ?? 0.9) >= 0.95 ? "intensiv" : (settings.targetRetention ?? 0.9) <= 0.85 ? "locker" : "normal"])}
          onClick={() => setBlatt("intensity")} />
        <ZeileSchalter titel={txt("Beispielsätze anzeigen")} sub={txt("auf der Lösungsseite")}
          value={settings.showExamples !== false} onChange={(v: boolean) => set("showExamples", v)} />
        <ZeileSchalter titel={txt("Lautschrift anzeigen")} sub={txt("unter dem Fremdwort")}
          value={settings.showPhonetic !== false} onChange={(v: boolean) => set("showPhonetic", v)} />
        <ZeileWert titel={txt("Lerntipp-Einblendungen")} atRec={atR("tipsFrequency")}
          wert={txt({ off: "Aus", occasional: "Gelegentlich", frequent: "Häufig" }[settings.tipsFrequency] || "Gelegentlich")}
          onClick={() => setBlatt("tips")} />
        <ZeileWert titel={txt("Wann eine Liste als bereit gilt")} atRec={atR("readyGreen") && atR("readyAmber")}
          wert={txt("grün ab {g} %, gelb ab {a} %", { g: settings.readyGreen ?? 95, a: settings.readyAmber ?? 70 })}
          onClick={() => setBlatt("ready")} />
      </div>

      <Blatt offen={blatt === "mode"} titel={txt("Antwortart")} onClose={() => setBlatt(null)}
        desc={txt("Eintippen prägt am stärksten ein. Selbstkontrolle heisst: umdrehen und selbst beurteilen. Durchblättern zählt nicht für den Lernstand.")}
        rec={txt("Eintippen")} atRec={atR("mode")} onZuruecksetzen={() => set("mode", R.mode)}>
        <div className="list">
          {Object.keys(MODUS).map((v) => (
            <button key={v} className={"li" + (settings.mode === v ? " sel" : "")} onClick={() => set("mode", v)}>
              <span className="ckbox">{settings.mode === v && <Icon name="check" size={12} />}</span>
              <span className="g">{txt(MODUS[v])}</span>
            </button>
          ))}
        </div>
      </Blatt>

      <Blatt offen={blatt === "dailyGoal"} titel={txt("Höchstens pro Tag")} onClose={() => setBlatt(null)}
        desc={txt("So viele Karten schlägt „Heute dran“ höchstens vor. Kein Ziel und keine Serie — die Grenze schützt nur davor, nach einer Pause von zweihundert fälligen Wörtern erschlagen zu werden.")}
        rec={txt("{n} Karten", { n: R.dailyGoal })} atRec={atR("dailyGoal")} onZuruecksetzen={() => set("dailyGoal", R.dailyGoal)}>
        <SliderControl value={settings.dailyGoal} min={10} max={80} step={5} onChange={(v: number) => set("dailyGoal", v)} />
      </Blatt>

      {/* Worte statt einer Zahl: „wie viele neue Woerter pro Tag" kann
          niemand beantworten, der sich nicht selbst gut kennt. Drei Tempi mit
          der Zahl daneben beantworten dieselbe Frage in einer Sprache, die
          man ohne Selbstversuch versteht. */}
      <Blatt offen={blatt === "newPerDay"} titel={txt("Neue Wörter pro Tag")} onClose={() => setBlatt(null)}
        desc={txt("Wie viele ganz neue Wörter höchstens dazukommen. Das ist dein einziger Hebel auf die Menge: der Lernalgorithmus plant jede Karte für sich und kennt kein Tagespensum — eine falsch beantwortete Karte kommt sogar früher wieder, nicht später. Weniger neue Wörter heisst also weniger Rückstau, nicht langsameres Lernen.")}
        rec={txt(TEMPO_NAME(R.newPerDay))} atRec={atR("newPerDay")} onZuruecksetzen={() => set("newPerDay", R.newPerDay)}>
        <div className="list">
          {TEMPI.map((t) => (
            <button key={t.n} className={"li" + (settings.newPerDay === t.n ? " sel" : "")} onClick={() => set("newPerDay", t.n)}>
              <span className="ckbox">{settings.newPerDay === t.n && <Icon name="check" size={12} />}</span>
              <span className="g">{txt(t.name)}<div className="m">{txt(t.sub)}</div></span>
              <span className="lchip-n">{t.n}</span>
            </button>
          ))}
        </div>
      </Blatt>

      <Blatt offen={blatt === "choicesCount"} titel={txt("Vorschläge bei Multiple-Choice")} onClose={() => setBlatt(null)}
        desc={txt("Wie viele Möglichkeiten beim Auswählen zur Wahl stehen.")}
        rec={String(R.choicesCount)} atRec={atR("choicesCount")} onZuruecksetzen={() => set("choicesCount", R.choicesCount)}>
        <SliderControl value={settings.choicesCount} min={2} max={6} step={1} onChange={(v: number) => set("choicesCount", v)} />
      </Blatt>

      <Blatt offen={blatt === "intensity"} titel={txt("Lernintensität")} onClose={() => setBlatt(null)}
        desc={txt("Wie gut die App ein Wort im Gedächtnis halten will, bevor sie es zur Wiederholung bringt. Intensiver = häufigere Wiederholung, sicherer im Behalten. Alles Weitere regelt die App automatisch.")}
        rec={txt("Normal")} atRec={(settings.targetRetention ?? 0.9) === 0.9}
        onZuruecksetzen={() => setSettings({ lernIntensity: "normal", targetRetention: 0.9 })}>
        <Seg value={(settings.targetRetention ?? 0.9) >= 0.95 ? "intensiv" : (settings.targetRetention ?? 0.9) <= 0.85 ? "locker" : "normal"}
          onChange={(v: string) => setSettings({ lernIntensity: v, targetRetention: { locker: 0.85, normal: 0.9, intensiv: 0.95 }[v] })}
          options={[{ v: "locker", label: "Locker" }, { v: "normal", label: "Normal" }, { v: "intensiv", label: "Intensiv" }]} />
      </Blatt>

      <Blatt offen={blatt === "tips"} titel={txt("Lerntipp-Einblendungen")} onClose={() => setBlatt(null)}
        desc={txt("Kurze Lerntipps tauchen an natürlichen Pausen auf (nie mitten in der Antwort) und lassen sich wegklicken.")}
        rec={txt("Gelegentlich")} atRec={atR("tipsFrequency")} onZuruecksetzen={() => set("tipsFrequency", R.tipsFrequency)}>
        <div className="list">
          {[["off", "Aus"], ["occasional", "Gelegentlich"], ["frequent", "Häufig"]].map(([v, l]) => (
            <button key={v} className={"li" + (settings.tipsFrequency === v ? " sel" : "")} onClick={() => set("tipsFrequency", v)}>
              <span className="ckbox">{settings.tipsFrequency === v && <Icon name="check" size={12} />}</span>
              <span className="g">{txt(l)}</span>
            </button>
          ))}
        </div>
      </Blatt>

      <Blatt offen={blatt === "ready"} titel={txt("Wann eine Liste als bereit gilt")} onClose={() => setBlatt(null)}
        desc={txt("Ab diesem Anteil sitzender Wörter gilt eine Liste als bereit — grün im Kalender. Darunter zeigt der Kalender Rot. Die Legende übernimmt beide Zahlen.")}
        rec={txt("grün ab {g} %, gelb ab {a} %", { g: 95, a: 70 })}
        atRec={atR("readyGreen") && atR("readyAmber")}
        onZuruecksetzen={() => setSettings({ readyGreen: 95, readyAmber: 70 })}>
        <div className="col" style={{ gap: 14 }}>
          <div>
            <div className="setz-t" style={{ marginBottom: 6 }}>{txt("Bereit ab")}</div>
            <SliderControl value={settings.readyGreen ?? 95} min={80} max={100} step={1}
              onChange={(v: number) => set("readyGreen", Math.max(v, (settings.readyAmber ?? 70) + 1))} fmt={(v: number) => v + " %"} />
          </div>
          <div>
            <div className="setz-t" style={{ marginBottom: 6 }}>{txt("Fast bereit ab")}</div>
            <SliderControl value={settings.readyAmber ?? 70} min={40} max={94} step={1}
              onChange={(v: number) => set("readyAmber", Math.min(v, (settings.readyGreen ?? 95) - 1))} fmt={(v: number) => v + " %"} />
          </div>
        </div>
      </Blatt>

      {/* Answer checking */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="check" size={16} /> {txt("Antwortprüfung")}</div>
        <Field title={txt("Gross- und Kleinschreibung egal")} recLabel={txt("An")} atRec={atR("lenientCase")}
          desc={txt("„Hund“ und „hund“ gelten als dieselbe Antwort.")}>
          <Toggle value={settings.lenientCase} onChange={(v) => set("lenientCase", v)} />
        </Field>
        <Field title={txt("Umlaute und Akzente streng")} recLabel={txt("Aus")} atRec={atR("strictAccents")}
          desc={txt("When off, “grun” for “grün” is a small mistake (partial credit) instead of fully wrong.")}>
          <Toggle value={settings.strictAccents} onChange={(v) => set("strictAccents", v)} />
        </Field>
        <Field title={txt("Artikel (der/die/das)")} recLabel={txt("Nötig, kleiner Abzug")} atRec={atR("articleMode")}
          desc={txt("Wie ein fehlender oder falscher Artikel bewertet wird. Nötig heisst: er muss stehen. Freiwillig heisst: er wird gar nicht angeschaut.")}>
          <select className="field" style={{ width: "100%" }} value={settings.articleMode} onChange={(e) => set("articleMode", e.target.value)}>
            <option value="required-full">{txt("Nötig · voller Abzug")}</option>
            <option value="required-partial">{txt("Nötig · kleiner Abzug")}</option>
            <option value="optional">{txt("Optional")}</option>
          </select>
        </Field>
        <Field title={txt("Fast richtig zulassen")} recLabel={txt("An")} atRec={atR("acceptPartial")}
          desc={txt("Ein einzelner Tippfehler zählt als fast richtig und wird in der Lösung hervorgehoben. Aus heisst: knapp daneben ist falsch.")}>
          <Toggle value={settings.acceptPartial} onChange={(v) => set("acceptPartial", v)} />
        </Field>
      </div>

      {/* Latein */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="swap" size={16} /> {txt("Sprachen")}</div>
        <div className="grp">{txt("Sprachen")} <span className="hint">— {txt("zu- und abschaltbar")}</span></div>
        <div className="list">
          {Object.values(PAIRS).map((p: any) => {
            const an = activeIds.includes(p.id);
            const n = store.vocab.filter((w: any) => w.pair === p.id).length;
            return (
              <button key={p.id} className={"li" + (an ? " sel" : "")} onClick={() => togglePair(p.id)} aria-pressed={an}>
                <span className="ckbox">{an && <Icon name="check" size={12} />}</span>
                <span className="g">{p.foreignLabel} ⇄ {p.nativeLabel}
                  <div className="m">{n ? txt("{n} Wörter", { n }) : txt("noch keine Wörter")}</div>
                </span>
              </button>
            );
          })}
        </div>
        <div className="quiet links">{txt("Beim Zuschalten kommt der Grundwortschatz automatisch als eigene Liste dazu. Eine abgeschaltete Sprache wird nur ausgeblendet — ihre Wörter, Listen und Lernstände bleiben erhalten.")}</div>
      </div>

      <div className="set-section">
        <div className="set-section-h"><Icon name="list" size={16} /> {txt("Latein")}</div>
        <Field title={txt("Abfrage-Form")} recLabel={txt("L2 (Grundform)")} atRec={atR("latinMode")}
          desc={txt("Gilt nur für das Paar Latein ⇄ Deutsch. L2: die Karte zeigt die volle Lernform, abgefragt wird nur die Grundform. L3: du gibst die vollständigen Stammformen ein (Reihenfolge egal).")}>
          <select className="field" style={{ width: "100%" }} value={settings.latinMode} onChange={(e) => set("latinMode", e.target.value)}>
            <option value="L2">{txt("L2 · Grundform abfragen")}</option>
            <option value="L3">{txt("L3 · volle Lernform abfragen")}</option>
          </select>
        </Field>
        <Field title={txt("Längenstriche nicht nötig")} recLabel={txt("Aus (Längenstriche zählen)")} atRec={!settings.latinMacronsOptional}
          desc={txt("Längenstriche (ā ē ī ō ū) sind auf Handy und Mac mühsam zu tippen. Aus: fehlt ein Strich, gibt es Punktabzug („fast“). Ein: die Antwort zählt als richtig — die Lösung markiert die Striche trotzdem rot, damit du sie siehst. Gilt nur für Latein.")}>
          <Toggle value={!!settings.latinMacronsOptional} onChange={(v) => set("latinMacronsOptional", v)} />
        </Field>
      </div>

      {/* Lernhilfen */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="hint" size={16} /> {txt("Lernhilfen")}</div>
        <Field title={txt("Lerntipp-Einblendungen")} recLabel={txt("Gelegentlich")} atRec={atR("tipsFrequency")}
          desc={txt("Kurze Lerntipps tauchen an natürlichen Pausen auf (nie mitten in der Antwort) und lassen sich wegklicken.")}>
          <select className="field" style={{ width: "100%" }} value={settings.tipsFrequency} onChange={(e) => set("tipsFrequency", e.target.value)}>
            <option value="off">{txt("Aus")}</option>
            <option value="occasional">{txt("Gelegentlich")}</option>
            <option value="frequent">{txt("Häufig")}</option>
          </select>
        </Field>
      </div>

      {/* Oberflächensprache */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="swap" size={16} /> {txt("Sprache der App")}</div>
        <div className="grp">{txt("Oberflächensprache")}</div>
        <div className="list">
          {[["de", "Deutsch", ""], ["en", "English", ""], ["", "Gerätesprache", "folgt der Einstellung des Telefons"]].map(([v, l, sub]) => (
            <button key={v || "auto"} className={"li" + ((settings.uiLang || "") === v ? " sel" : "")}
              onClick={() => set("uiLang", v || undefined)} aria-pressed={(settings.uiLang || "") === v}>
              <span className="ckbox">{(settings.uiLang || "") === v && <Icon name="check" size={12} />}</span>
              <span className="g">{l === "Gerätesprache" ? txt(l) : l}{sub && <div className="m">{txt(sub)}</div>}</span>
            </button>
          ))}
        </div>
        <div className="quiet links">{txt("Die Sprache der Bedienung. Deine Wörter und Wortlisten bleiben davon unberührt — die Übersetzungen sind immer Deutsch.")}</div>
      </div>

      {/* Übungsplan — die Schwellen der Ampel */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="calendar" size={16} /> {txt("Übungsplan")}</div>
        <Field title={txt("Bereit ab")} recLabel={txt("95 %")} atRec={atR("readyGreen")}
          desc={txt("Ab diesem Anteil sitzender Wörter gilt eine Liste als bereit — grün im Kalender.")}>
          <SliderControl value={settings.readyGreen ?? 95} min={80} max={100} step={1}
            onChange={(v) => set("readyGreen", Math.max(v, (settings.readyAmber ?? 70) + 1))}
            fmt={(v) => v + " %"} />
        </Field>
        <Field title={txt("Fast bereit ab")} recLabel={txt("70 %")} atRec={atR("readyAmber")}
          desc={txt("Darunter zeigt der Kalender Rot. Die Legende übernimmt beide Zahlen.")}>
          <SliderControl value={settings.readyAmber ?? 70} min={40} max={94} step={1}
            onChange={(v) => set("readyAmber", Math.min(v, (settings.readyGreen ?? 95) - 1))}
            fmt={(v) => v + " %"} />
        </Field>
        <div className="set-legend-preview">
          {toneLegend(settings).map((t) => (
            <span key={t.tone} className="set-legend-item">
              <span className="set-legend-dot" style={{ background: TONE_VAR[t.tone] }} />{t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Aussehen — vier Umschalter, nach Reichweite sortiert: erst was das
          ganze Gerät betrifft, zuletzt was nur die Karte betrifft. Darunter
          die Karte selbst als Vorschau, damit man sieht statt zu raten.
          Vorher waren es vier Auswahlfelder mit Erklaertexten -- korrekt,
          aber man musste jedes oeffnen, um zu sehen, was drinsteht. */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="swatch" size={16} /> {txt("Aussehen")}</div>

        <div className="grp">{txt("Erscheinungsbild")} <span className="hint">— {txt("folgt dem Gerät")}</span></div>
        <div className="seg seg-voll">
          {[["auto", "Automatisch"], ["light", "Hell"], ["dark", "Dunkel"]].map(([v, l]) => (
            <button key={v} aria-pressed={settings.appearance === v} onClick={() => set("appearance", v)}>{txt(l)}</button>
          ))}
        </div>

        <div className="grp">{txt("Farbschema")} <span className="hint">— {txt("gilt für die ganze App")}</span></div>
        <div className="seg seg-voll">
          {[["kladde", "Kladde"], ["leinen", "Leinen"], ["altpapier", "Altpapier"]].map(([v, l]) => (
            <button key={v} aria-pressed={settings.scheme === v} onClick={() => set("scheme", v)}>{txt(l)}</button>
          ))}
        </div>

        <div className="grp">{txt("Karte")} <span className="hint">— {txt("nur die Übungskarte")}</span></div>
        <div className="seg seg-voll">
          {[["ruled", "Liniert"], ["plain", "Blanko"], ["recycled", "Altpapier"], ["linen", "Leinen"]].map(([v, l]) => (
            <button key={v} aria-pressed={settings.cardStyle === v} onClick={() => set("cardStyle", v)}>{txt(l)}</button>
          ))}
        </div>

        <div className="grp">{txt("Kartenschrift")} <span className="hint">— {txt("nur die Übungskarte")}</span></div>
        <div className="seg seg-voll">
          {[["serif", "Serif"], ["arial", "Grotesk"], ["handwriting", "Handschrift"]].map(([v, l]) => (
            <button key={v} aria-pressed={settings.cardFont === v} onClick={() => set("cardFont", v)}>{txt(l)}</button>
          ))}
        </div>

        <CardPreview />

        {!(atR("appearance") && atR("scheme") && atR("cardStyle") && atR("cardFont")) && (
          <button className="btn btn-ghost btn-sm" style={{ alignSelf: "center", marginTop: 10 }}
            onClick={() => { set("appearance", "auto"); set("scheme", "kladde"); set("cardStyle", "ruled"); set("cardFont", "serif"); }}>
            <Icon name="refresh" size={13} /> {txt("Zurücksetzen auf Automatisch · Kladde · Liniert · Serif")}
          </button>
        )}
      </div>

      {/* Grundwortschatz (Starter-Listen) */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="sparkle" size={16} /> {txt("Grundwortschatz")}</div>
        {STARTERS.map((s) => {
          const done = isStarterActivated(settings, s.pair, s.stufe);
          return (
            <Field key={s.key} title={s.label} desc={txt("{n} häufige Wörter. Wird als eigene Wortliste hinzugefügt; bereits vorhandene Wörter werden übersprungen.", { n: s.count })}>
              {done
                ? <span className="badge green"><span className="dot" />{txt("Aktiviert")}</span>
                : <button className="btn btn-sm" onClick={() => addStarter(s.pair, s.stufe)}><Icon name="plus" size={15} /> {txt("Hinzufügen")}</button>}
            </Field>
          );
        })}
      </div>

      {/* F-SETTINGS-ADVANCED: collapsible expert section */}
      <div className="set-section">
        <button className="set-section-h set-section-toggle" onClick={() => setAdvOpen((o) => !o)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer" }}>
          <Icon name="gear" size={16} /> Erweiterte Einstellungen
          <span className="grow" />
          <span className="faint" style={{ fontSize: 12 }}>{advOpen ? "einklappen ▾" : "ausklappen ▸"}</span>
        </button>
        {advOpen && (
          <>
            <div className="muted" style={{ fontSize: 13, marginBottom: 12, maxWidth: 560 }}>
              {txt("Für Neugierige. Die App funktioniert mit den Standardwerten optimal — alles hier ist optional und jederzeit zurücksetzbar.")}
            </div>

            <Field title={txt("Lerntempo")} atRec={cfgVal("learningSpeed") === DEFAULTS.learningSpeed}
              recLabel={txt("1,0× (normal)")}
              desc={txt("Wie schnell ein Wort an Festigkeit gewinnt, wenn du es richtig hast. Höher = die App nimmt schnellere Fortschritte an und fragt seltener nach (riskanter); niedriger = vorsichtiger, häufiger.")}>
              <div className="col" style={{ gap: 6, width: "100%" }}>
                <SliderControl value={speed} min={0.6} max={1.6} step={0.05} onChange={(v: number) => set("learningSpeed", v)} fmt={(v: number) => v.toFixed(2) + "×"} />
                <div className="set-rec" style={{ fontSize: 12.5 }}>{txt("Beispiel: 3× richtig hintereinander → hält")} <b>~{Math.round(haeltAtSpeed)} statt ~{Math.round(haeltBase)} Tage</b>.</div>
                {speed !== DEFAULTS.learningSpeed && <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-end" }} onClick={() => resetCfg("learningSpeed")}><Icon name="refresh" size={13} /> {txt("Auf Standard")}</button>}
              </div>
            </Field>

            {advParam("S2", "Schwelle „sitzt“ (Tage)", "Ab wie vielen Tagen erwarteter Haltbarkeit ein Wort als „sitzt“ (grün) gilt.", 7, 30, 1, (v: number) => `${v} T`)}
            {advParam("S1", "Schwelle „sitzt fast“ (Tage)", "Ab wie vielen Tagen Haltbarkeit ein Wort von „wackelt noch“ (rot) auf „sitzt fast“ (orange) wechselt.", 1, 10, 1, (v: number) => `${v} T`)}
            {advParam("MIN_REPS", "Wiederholungen bis „nicht mehr neu“", "Wie oft ein neues Wort richtig sein muss, bevor es aus der Stufe „neu / frisch“ herauswächst.", 1, 5, 1)}
            {advParam("PUFFER", "Vorlauf „bald fällig“ (Tage)", "Wie viele Tage vor dem eigentlichen Fälligkeitstag ein Wort schon als „bald fällig“ markiert wird.", 0, 7, 1, (v: number) => `${v} T`)}
            {advParam("D_LEECH", "Schwelle „hartnäckig“ (Zähigkeit)", "Ab welcher Schwierigkeit (0–10) ein oft vergessenes Wort als „hartnäckig“ gilt — zusammen mit der Fehleranzahl.", 4, 10, 1)}
            {advParam("LAPSE_LEECH", "Hartnäckig ab Fehlern", "Wie viele Rückfälle ein Wort braucht, um zusätzlich als „hartnäckig“ zu zählen.", 1, 8, 1)}
            {advParam("examWindowDays", "Prüfungs-Fenster (Tage)", "Wie viele Tage vor einem Prüfungstermin die App dichter wiederholt (Prüfungs-Modus).", 1, 7, 1, (v: number) => `${v} T`)}
            {advParam("examRetention", "Prüfungs-Sicherheit", "Wie sicher Wörter kurz vor der Prüfung sitzen sollen — höher = häufigere Wiederholung im Prüfungs-Fenster.", 0.9, 0.99, 0.01, (v: number) => `${Math.round(v * 100)} %`)}

            <div className="set-subhead">{txt("Übungsrunde — wie oft welche Wörter drankommen")}</div>
            {advParam("W_ROT", "Gewicht: wackelnde Wörter", "Wie oft rote (wackelnde) Wörter in einer Runde drankommen. Höher = häufiger. Sollten zusammen mit fälligen am meisten geübt werden.", 1, 10, 1)}
            {advParam("W_FAELLIG", "Gewicht: fällige Wörter", "Wie oft fällige (zur Auffrischung anstehende) Wörter drankommen.", 1, 10, 1)}
            {advParam("W_GRAU", "Gewicht: noch nie geübt", "Wie oft ganz neue, noch nie geübte Wörter drankommen.", 1, 10, 1)}
            {advParam("W_BLAU", "Gewicht: frisch gelernt", "Wie oft frisch gelernte Wörter drankommen.", 1, 10, 1)}
            {advParam("W_ORANGE", "Gewicht: sitzt fast", "Wie oft fast sitzende Wörter drankommen — die brauchen am wenigsten.", 1, 10, 1)}
            {advParam("ZIEL_WACKELT", "Runden-Ziel: wackelnde Wörter", "Wie oft du ein wackelndes Wort in einer Runde richtig haben musst (mit Abstand), bis es als „für heute erledigt“ gilt.", 1, 5, 1, (v: number) => `${v}×`)}
            {advParam("ZIEL_NEU", "Runden-Ziel: frisch gelernt", "Wie oft ein frisch gelerntes Wort in einer Runde richtig sein muss.", 1, 5, 1, (v: number) => `${v}×`)}
            {advParam("ZIEL_NEU_NIE", "Runden-Ziel: noch nie geübt", "Wie oft ein ganz neues Wort in einer Runde richtig sein muss.", 1, 5, 1, (v: number) => `${v}×`)}
            {advParam("ZIEL_FAST", "Runden-Ziel: sitzt fast", "Wie oft ein fast sitzendes Wort in einer Runde richtig sein muss.", 1, 5, 1, (v: number) => `${v}×`)}
            {advParam("ZIEL_FAELLIG", "Runden-Ziel: fällige Wörter", "Wie oft ein fälliges Wort zur Auffrischung richtig sein muss.", 1, 5, 1, (v: number) => `${v}×`)}
            {advParam("STALE_MIN", "Pause bis Neustart (Minuten)", "Nach so vielen Minuten Pause beginnt die App die Übungsrunde frisch, damit sie zum aktuellen Stand passt.", 10, 120, 5, (v: number) => `${v} min`)}
            {advParam("GENUG_KARTEN", "Hinweis „Genug für heute“ ab", "Ab so vielen Karten in einer Runde schlägt die App eine Pause vor — ganz ohne Zwang.", 10, 100, 5)}

            <Field title={txt("Das Gedächtnis-Modell")}
              desc={txt("Womit die App rechnet: das Behaltensziel, die abgeleiteten Schwellen und die 19 Modell-Gewichte. Nur zum Ansehen — die App passt diese Werte nicht an dich an und zeichnet dafür auch nichts auf.")}>
              <button className="btn btn-ghost btn-sm" onClick={() => setFsrsOpen(true)}><Icon name="chart" size={13} /> {txt("Werte ansehen")}</button>
            </Field>
          </>
        )}
      </div>

      <FsrsValuesModal open={fsrsOpen} onClose={() => setFsrsOpen(false)} settings={settings} />

      {/* Konto & Daten */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="download" size={16} /> {txt("Konto & Daten")}</div>
        <Field title={txt("Daten exportieren")} desc={txt("Lädt alle deine Wörter, Listen, Fortschritte und Einstellungen als JSON-Datei herunter.")}>
          <button className="btn btn-sm" onClick={doExport}><Icon name="download" size={15} /> {txt("Exportieren")}</button>
        </Field>
        <Field title={txt("Datenschutz")} desc={txt("Was gespeichert wird, wo es liegt und was nicht passiert.")}>
          <button className="btn btn-sm btn-ghost" onClick={() => setPrivacyOpen(true)}>{txt("Datenschutz ansehen")}</button>
        </Field>
        <Field title={txt("Impressum")} desc={txt("Wer diese App herausgibt.")}>
          <button className="btn btn-sm btn-ghost" onClick={() => setImprintOpen(true)}>{txt("Impressum ansehen")}</button>
        </Field>
        <Field title={txt("Fortschritt zurücksetzen")} desc={txt("Löscht Punkte und Verlauf. Deine Wörter und Wortlisten bleiben.")}>
          <button className="btn btn-sm btn-ghost" onClick={() => setResetOpen(true)}><Icon name="refresh" size={15} /> {txt("Zurücksetzen")}</button>
        </Field>
        <Field title={txt("Account löschen")} desc={cloudActive ? txt("Löscht deine Daten endgültig — lokal und in der Cloud. Das kann nicht rückgängig gemacht werden.") : txt("Löscht alle Daten auf diesem Gerät. Das kann nicht rückgängig gemacht werden.")}>
          <button className="btn btn-sm" style={{ borderColor: "var(--red)", color: "var(--red)" }} onClick={() => { setConfirmText(""); setDelErr(""); setDelOpen(true); }}>
            <Icon name="trash" size={15} /> Löschen
          </button>
        </Field>
      </div>

      {resetOpen && (
        <div className="modal-backdrop" onClick={() => setResetOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Fortschritt zurücksetzen")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setResetOpen(false)}><Icon name="x" size={16} /></button>
            </div>
            <div className="muted" style={{ fontSize: 13.5, marginBottom: 14 }}>
              {txt("Das löscht Punkte, Verlauf und die Tagesserie — in allen Sprachen. Deine Wörter und Wortlisten bleiben. Rückgängig machen lässt es sich nicht.")}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setResetOpen(false)}>{txt("Abbrechen")}</button>
              <button className="btn btn-primary" onClick={() => { store.resetStats(); setResetOpen(false); toast(txt("Lernstand zurückgesetzt"), "refresh"); }}>
                {txt("Zurücksetzen")}
              </button>
            </div>
          </div>
        </div>
      )}

      {privacyOpen && (
        <div className="modal-backdrop" onClick={() => setPrivacyOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Datenschutz")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setPrivacyOpen(false)}><Icon name="x" size={16} /></button>
            </div>
            <div className="muted legal-body">
              <p>{txt("Kurz: Diese App sammelt nichts über dich. Sie speichert nur, was du selbst einträgst, und braucht dafür nicht mehr als eine E-Mail-Adresse — und die nur, wenn du dich anmeldest.")}</p>

              <h4>{txt("Was gespeichert wird")}</h4>
              <p>{txt("Deine Wörter, Wortlisten, Lernstände und Einstellungen. Meldest du dich an, zusätzlich deine E-Mail-Adresse und ein selbst gewählter Anzeigename.")}</p>

              <h4>{txt("Wo es liegt")}</h4>
              <p>{txt("Ohne Anmeldung bleibt alles ausschliesslich auf diesem Gerät. Mit Anmeldung wird es zusätzlich bei Supabase gespeichert, damit du auf mehreren Geräten denselben Stand hast. Die Übertragung ist verschlüsselt, und die Regeln der Datenbank lassen nur dich an deine eigenen Daten.")}</p>

              <h4>{txt("Was NICHT passiert")}</h4>
              <p>{txt("Keine Werbung, keine Zählpixel, keine Weitergabe an Dritte, kein Verkauf. Die App verfolgt dein Verhalten nicht und legt kein Profil über dich an. Was sie über deinen Lernstand weiss, dient nur dazu, dir die richtigen Wörter zur richtigen Zeit zu zeigen.")}</p>

              <h4>{txt("Geteilte Wortlisten")}</h4>
              <p>{txt("Teilst du eine Wortliste, wird ihr Inhalt unter einem zufälligen Code abgelegt. Wer den Code hat, kann eine Kopie übernehmen — dein Name steht nicht dabei, und dein Lernstand wird nicht mitgeteilt.")}</p>

              <h4>{txt("Deine Rechte")}</h4>
              <p>{txt("Du kannst deine Daten jederzeit als Datei exportieren und dein Konto vollständig löschen — beides oben unter „Konto & Daten“. Beim Löschen verschwinden auch die Daten in der Cloud; das lässt sich nicht rückgängig machen.")}</p>

              <h4>{txt("Kinder")}</h4>
              <p>{txt("Die App ist für Schülerinnen und Schüler gemacht. Sie erhebt keine Daten über das hinaus, was zum Lernen nötig ist, und sie enthält keine Werbung und keine Käufe.")}</p>

              <h4>{txt("Verantwortlich")}</h4>
              <p>{txt("Martin Keller, Schweiz. Fragen zum Datenschutz gehen an die im Impressum genannte Adresse.")}</p>
            </div>
            <div className="modal-foot"><button className="btn btn-primary" onClick={() => setPrivacyOpen(false)}>{txt("Verstanden")}</button></div>
          </div>
        </div>
      )}

      {imprintOpen && (
        <div className="modal-backdrop" onClick={() => setImprintOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Impressum")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setImprintOpen(false)}><Icon name="x" size={16} /></button>
            </div>
            <div className="muted legal-body">
              <h4>{txt("Herausgeber")}</h4>
              <p>Martin Keller<br />Schweiz</p>

              <h4>{txt("Kontakt")}</h4>
              <p>{txt("Fragen, Fehler und Rückmeldungen gehen an die im App Store hinterlegte Adresse.")}</p>

              <h4>{txt("Inhalte")}</h4>
              <p>{txt("Der mitgelieferte Grundwortschatz und alle Texte dieser App stammen vom Herausgeber. Die Wörter, die du selbst einträgst, gehören dir.")}</p>

              <h4>{txt("Verwendete Arbeit anderer")}</h4>
              <p>{txt("Die Wiederholungsabstände berechnet FSRS, ein frei verfügbares Gedächtnismodell. Die Schriften sind Source Serif 4, Hanken Grotesk und Patrick Hand, alle unter der SIL Open Font License.")}</p>
            </div>
            <div className="modal-foot"><button className="btn btn-primary" onClick={() => setImprintOpen(false)}>{txt("Verstanden")}</button></div>
          </div>
        </div>
      )}

      {delOpen && (
        <div className="modal-backdrop" onClick={() => !delBusy && setDelOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Account löschen")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => !delBusy && setDelOpen(false)}><Icon name="x" size={16} /></button>
            </div>
            <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.45, marginBottom: 12 }}>
              {cloudActive
                ? "Das löscht deine Daten endgültig – auf diesem Gerät und in der Cloud. Danach wirst du abgemeldet."
                : "Das löscht alle Vokabeln, Listen und Fortschritte auf diesem Gerät."}
              {" "}Tippe zum Bestätigen <b style={{ color: "var(--ink)" }}>{txt("LÖSCHEN")}</b>.
            </div>
            <input className="field" placeholder={txt("LÖSCHEN")} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} autoFocus />
            {delErr && <div className="badge red" style={{ marginTop: 10 }}><span className="dot" />{delErr}</div>}
            <div className="modal-foot">
              <button className="btn btn-ghost" disabled={delBusy} onClick={() => setDelOpen(false)}>{txt("Abbrechen")}</button>
              <button className="btn" style={{ borderColor: "var(--red)", color: "var(--red)" }} disabled={delBusy || confirmText.trim().toUpperCase() !== "LÖSCHEN"} onClick={doDelete}>
                {delBusy ? <Icon name="refresh" size={15} /> : <Icon name="trash" size={15} />} Endgültig löschen
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="muted" style={{ fontSize: 11.5, textAlign: "center", padding: "4px 0 10px" }}>
        Settings are saved on this device and apply to both language tracks.
      </div>
    </div>
  );
}

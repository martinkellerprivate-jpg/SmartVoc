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
import { fitStatus } from "../lib/reviewlog";
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

function Field({ title, desc, recLabel, atRec, children }: any) {
  return (
    <div className="set-row">
      <div className="set-info">
        <div className="set-title">{title}{atRec && <span className="rec-pill">{txt("✓ Empfohlen")}</span>}</div>
        {desc && <div className="set-desc">{desc}</div>}
        {recLabel != null && <div className="set-rec">{txt("Empfohlen:")} <b>{recLabel}</b></div>}
      </div>
      <div className="set-control">{children}</div>
    </div>
  );
}

export function SettingsTab() {
  const store = useStore();
  const toast = useToast();
  const auth = useAuth();
  const { settings, setSettings, resetSettings } = store;
  const R = RECOMMENDED;
  const set = (k, v) => setSettings({ [k]: v });

  // Konto & Daten (Phase 7)
  const [privacyOpen, setPrivacyOpen] = useState(false);
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
  const reviewStatus = fitStatus(store.reviews || {}, !!settings.autoFit, false);
  const advParam = (k: string, title: string, desc: string, min: number, max: number, step: number, fmt?: any) => (
    <Field title={title} desc={desc} recLabel={fmt ? fmt((DEFAULTS as any)[k]) : (DEFAULTS as any)[k]} atRec={cfgVal(k) === (DEFAULTS as any)[k]}>
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
          <Icon name="refresh" size={14} /> Reset to recommended
        </button>
      </div>

      {/* Practice */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="cards" size={16} /> {txt("Üben")}</div>
        <Field title={txt("Antwortart")} recLabel={txt("Eintippen")} atRec={atR("mode")}
          desc="Eintippen prägt am stärksten ein. Selbstkontrolle heisst: umdrehen und selbst beurteilen. Durchblättern zählt nicht für den Lernstand.">
          <select className="field" style={{ width: "100%" }} value={settings.mode} onChange={(e) => set("mode", e.target.value)}>
            <option value="type">{txt("Eintippen")}</option>
            <option value="choice">{txt("Auswählen")}</option>
            <option value="recall">{txt("Selbstkontrolle")}</option>
            <option value="memorize">{txt("Durchblättern")}</option>
          </select>
        </Field>
        <Field title={txt("Anzahl Auswahlmöglichkeiten")} recLabel={R.choicesCount} atRec={atR("choicesCount")}
          desc="Wie viele Möglichkeiten beim Auswählen zur Wahl stehen.">
          <SliderControl value={settings.choicesCount} min={2} max={6} step={1} onChange={(v) => set("choicesCount", v)} />
        </Field>
        <Field title={txt("Beispielsätze anzeigen")} recLabel={txt("An")} atRec={atR("showExamples")}
          desc="Zeigt die Beispielsätze eines Worts auf der Lösungsseite der Karte — dort, wo du die Antwort siehst. Ein Wort im Satz zu sehen, hilft beim Behalten. Sätze, die du nicht erfasst hast, ändern nichts.">
          <Toggle value={settings.showExamples !== false} onChange={(v) => set("showExamples", v)} />
        </Field>
        <Field title={txt("Aussprache anzeigen")} recLabel={txt("An")} atRec={atR("showPhonetic")}
          desc="Zeigt die Lautschrift eines Worts klein unter dem Fremdwort — überall dort, wo das Fremdwort selbst zu sehen ist. Wörter ohne erfasste Lautschrift bleiben unverändert.">
          <Toggle value={settings.showPhonetic !== false} onChange={(v) => set("showPhonetic", v)} />
        </Field>
        <Field title={txt("Tagesziel (Karten)")} recLabel={`${R.dailyGoal} (etwa 15 Minuten)`} atRec={atR("dailyGoal")}
          desc="Eine kurze Einheit jeden Tag bringt mehr als eine lange alle paar Tage.">
          <SliderControl value={settings.dailyGoal} min={10} max={80} step={5} onChange={(v) => set("dailyGoal", v)} />
        </Field>
      </div>

      {/* Pacing & repetition */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="flame" size={16} /> {txt("Wiederholung")}</div>
        <Field title={txt("Neue Wörter pro Tag")} recLabel={`${R.newPerDay} (8 bis 12 sind ideal)`} atRec={atR("newPerDay")}
          desc="Begrenzt, wie viele ganz neue Wörter pro Tag dazukommen. Ist die Zahl erreicht, geht es nur noch ums Wiederholen.">
          <SliderControl value={settings.newPerDay} min={3} max={30} step={1} onChange={(v) => set("newPerDay", v)} />
        </Field>
        <Field title={txt("Lernintensität")} recLabel="Normal" atRec={(settings.targetRetention ?? 0.9) === 0.9}
          desc="Wie gut die App ein Wort im Gedächtnis halten will, bevor sie es zur Wiederholung bringt. Intensiver = häufigere Wiederholung, sicherer im Behalten. Alles Weitere regelt die App automatisch.">
          <Seg value={(settings.targetRetention ?? 0.9) >= 0.95 ? "intensiv" : (settings.targetRetention ?? 0.9) <= 0.85 ? "locker" : "normal"}
            onChange={(v) => setSettings({ lernIntensity: v, targetRetention: { locker: 0.85, normal: 0.9, intensiv: 0.95 }[v] })}
            options={[{ v: "locker", label: "Locker" }, { v: "normal", label: "Normal" }, { v: "intensiv", label: "Intensiv" }]} />
        </Field>
      </div>

      {/* Answer checking */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="check" size={16} /> {txt("Antwortprüfung")}</div>
        <Field title={txt("Gross- und Kleinschreibung egal")} recLabel={txt("An")} atRec={atR("lenientCase")}
          desc="„Hund“ und „hund“ gelten als dieselbe Antwort.">
          <Toggle value={settings.lenientCase} onChange={(v) => set("lenientCase", v)} />
        </Field>
        <Field title={txt("Umlaute und Akzente streng")} recLabel={txt("Aus")} atRec={atR("strictAccents")}
          desc="When off, “grun” for “grün” is a small mistake (partial credit) instead of fully wrong.">
          <Toggle value={settings.strictAccents} onChange={(v) => set("strictAccents", v)} />
        </Field>
        <Field title={txt("Artikel (der/die/das)")} recLabel={txt("Nötig, kleiner Abzug")} atRec={atR("articleMode")}
          desc="Wie ein fehlender oder falscher Artikel bewertet wird. Nötig heisst: er muss stehen. Freiwillig heisst: er wird gar nicht angeschaut.">
          <select className="field" style={{ width: "100%" }} value={settings.articleMode} onChange={(e) => set("articleMode", e.target.value)}>
            <option value="required-full">{txt("Nötig · voller Abzug")}</option>
            <option value="required-partial">{txt("Nötig · kleiner Abzug")}</option>
            <option value="optional">{txt("Optional")}</option>
          </select>
        </Field>
        <Field title={txt("Fast richtig zulassen")} recLabel={txt("An")} atRec={atR("acceptPartial")}
          desc="Ein einzelner Tippfehler zählt als fast richtig und wird in der Lösung hervorgehoben. Aus heisst: knapp daneben ist falsch.">
          <Toggle value={settings.acceptPartial} onChange={(v) => set("acceptPartial", v)} />
        </Field>
      </div>

      {/* Latein */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="swap" size={16} /> {txt("Sprachen")}</div>
        <Field title={txt("Sichtbare Sprachen")}
          desc="Bestimmt, welche Sprachen oben zur Auswahl stehen. Eine abgeschaltete Sprache wird nur ausgeblendet — ihre Wörter, Listen und Lernstände bleiben erhalten und sind sofort wieder da, wenn du sie erneut einschaltest.">
          <div className="col" style={{ gap: 8, width: "100%" }}>
            {Object.values(PAIRS).map((p: any) => (
              <label key={p.id} className="row" style={{ gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14 }}>{p.foreignLabel} ⇄ {p.nativeLabel}</span>
                <Toggle value={activeIds.includes(p.id)} onChange={() => togglePair(p.id)} />
              </label>
            ))}
          </div>
        </Field>
      </div>

      <div className="set-section">
        <div className="set-section-h"><Icon name="list" size={16} /> {txt("Latein")}</div>
        <Field title={txt("Abfrage-Form")} recLabel="L2 (Grundform)" atRec={atR("latinMode")}
          desc="Gilt nur für das Paar Latein ⇄ Deutsch. L2: die Karte zeigt die volle Lernform, abgefragt wird nur die Grundform. L3: du gibst die vollständigen Stammformen ein (Reihenfolge egal).">
          <select className="field" style={{ width: "100%" }} value={settings.latinMode} onChange={(e) => set("latinMode", e.target.value)}>
            <option value="L2">{txt("L2 · Grundform abfragen")}</option>
            <option value="L3">{txt("L3 · volle Lernform abfragen")}</option>
          </select>
        </Field>
        <Field title={txt("Längenstriche nicht nötig")} recLabel="Aus (Längenstriche zählen)" atRec={!settings.latinMacronsOptional}
          desc="Längenstriche (ā ē ī ō ū) sind auf Handy und Mac mühsam zu tippen. Aus: fehlt ein Strich, gibt es Punktabzug („fast“). Ein: die Antwort zählt als richtig — die Lösung markiert die Striche trotzdem rot, damit du sie siehst. Gilt nur für Latein.">
          <Toggle value={!!settings.latinMacronsOptional} onChange={(v) => set("latinMacronsOptional", v)} />
        </Field>
      </div>

      {/* Lernhilfen */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="hint" size={16} /> {txt("Lernhilfen")}</div>
        <Field title={txt("Lerntipp-Einblendungen")} recLabel="Gelegentlich" atRec={atR("tipsFrequency")}
          desc="Kurze Lerntipps tauchen an natürlichen Pausen auf (nie mitten in der Antwort) und lassen sich wegklicken.">
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
        <Field title={txt("Oberflächensprache")} recLabel={txt("Folgt dem Gerät")} atRec={!settings.uiLang}
          desc={txt("Die Sprache der Bedienung. Deine Wörter und Wortlisten bleiben davon unberührt — die Übersetzungen sind immer Deutsch.")}>
          <select className="field" style={{ width: "100%" }} value={settings.uiLang || ""} onChange={(e) => set("uiLang", e.target.value || undefined)}>
            <option value="">{txt("Folgt dem Gerät")}</option>
            <option value="de">Deutsch</option>
            <option value="en">English</option>
          </select>
        </Field>
      </div>

      {/* Übungsplan — die Schwellen der Ampel */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="calendar" size={16} /> {txt("Übungsplan")}</div>
        <Field title={txt("Bereit ab")} recLabel="95 %" atRec={atR("readyGreen")}
          desc="Ab diesem Anteil sitzender Wörter gilt eine Liste als bereit — grün im Kalender.">
          <SliderControl value={settings.readyGreen ?? 95} min={80} max={100} step={1}
            onChange={(v) => set("readyGreen", Math.max(v, (settings.readyAmber ?? 70) + 1))}
            fmt={(v) => v + " %"} />
        </Field>
        <Field title={txt("Fast bereit ab")} recLabel="70 %" atRec={atR("readyAmber")}
          desc="Darunter zeigt der Kalender Rot. Die Legende übernimmt beide Zahlen.">
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

      {/* Erscheinungsbild */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="swatch" size={16} /> {txt("Erscheinungsbild")}</div>
        <CardPreview />
        <Field title={txt("Erscheinungsbild")} recLabel="Automatisch" atRec={atR("appearance")}
          desc="Hell, dunkel oder dem Gerät folgen. Getrennt vom Farbschema — beim Wechsel bleibt dein Schema erhalten.">
          <select className="field" style={{ width: "100%" }} value={settings.appearance} onChange={(e) => set("appearance", e.target.value)}>
            <option value="auto">{txt("Automatisch (folgt dem Gerät)")}</option>
            <option value="light">{txt("Hell")}</option>
            <option value="dark">{txt("Dunkel")}</option>
          </select>
        </Field>
        <Field title={txt("Farbschema")} recLabel="Kladde" atRec={atR("scheme")}
          desc="Grund, Tinte und Akzent für die ganze App. Jedes Schema gibt es hell und dunkel.">
          <select className="field" style={{ width: "100%" }} value={settings.scheme} onChange={(e) => set("scheme", e.target.value)}>
            <option value="kladde">{txt("Kladde (warmes Kraftpapier)")}</option>
            <option value="leinen">{txt("Leinen (kühler, Tintenblau)")}</option>
            <option value="altpapier">{txt("Altpapier (graubraun, Stempelrot)")}</option>
          </select>
        </Field>
        <Field title={txt("Kartenstil")} recLabel="Liniert" atRec={atR("cardStyle")}
          desc="Nur die Übungskarte. Nimmt die Farben des gewählten Schemas an.">
          <select className="field" style={{ width: "100%" }} value={settings.cardStyle} onChange={(e) => set("cardStyle", e.target.value)}>
            <option value="ruled">{txt("Liniert")}</option>
            <option value="plain">{txt("Blanko")}</option>
            <option value="recycled">{txt("Altpapier")}</option>
            <option value="linen">{txt("Leinen")}</option>
          </select>
        </Field>
        <Field title={txt("Kartenschrift")} recLabel="Serif" atRec={atR("cardFont")}
          desc="Schrift des grossen Karten-Worts und der Antwort. Die übrige Oberfläche bleibt gleich.">
          <select className="field" style={{ width: "100%" }} value={settings.cardFont} onChange={(e) => set("cardFont", e.target.value)}>
            <option value="serif">{txt("Serif (Source Serif)")}</option>
            <option value="arial">{txt("Arial")}</option>
            <option value="handwriting">{txt("Handschrift (Patrick Hand)")}</option>
          </select>
        </Field>
      </div>

      {/* Grundwortschatz (Starter-Listen) */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="sparkle" size={16} /> {txt("Grundwortschatz")}</div>
        {STARTERS.map((s) => {
          const done = isStarterActivated(settings, s.pair, s.stufe);
          return (
            <Field key={s.key} title={s.label} desc={`${s.count} häufige Wörter. Wird als eigene Wortliste hinzugefügt; bereits vorhandene Wörter werden übersprungen.`}>
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
              Für Neugierige. Die App funktioniert mit den Standardwerten optimal — alles hier ist optional und jederzeit zurücksetzbar.
            </div>

            <Field title={txt("Lerntempo")} atRec={cfgVal("learningSpeed") === DEFAULTS.learningSpeed}
              recLabel="1,0× (normal)"
              desc="Wie schnell ein Wort an Festigkeit gewinnt, wenn du es richtig hast. Höher = die App nimmt schnellere Fortschritte an und fragt seltener nach (riskanter); niedriger = vorsichtiger, häufiger.">
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

            <Field title={txt("Auto-Anpassung")} atRec={!settings.autoFit} recLabel="Aus"
              desc="Lässt die App das Gedächtnis-Modell langfristig an deine Antworten anpassen. Sammelt ab sofort einen Lern-Verlauf; die eigentliche Feinjustierung folgt in einem späteren Update. Standard: aus.">
              <div className="col" style={{ gap: 6, width: "100%", alignItems: "flex-end" }}>
                <Toggle value={!!settings.autoFit} onChange={(v: boolean) => set("autoFit", v)} />
                <div className="set-rec" style={{ fontSize: 12.5 }}>{reviewStatus.text}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setFsrsOpen(true)}><Icon name="chart" size={13} /> {txt("FSRS-Werte ansehen")}</button>
              </div>
            </Field>
          </>
        )}
      </div>

      <FsrsValuesModal open={fsrsOpen} onClose={() => setFsrsOpen(false)} settings={settings} reviews={store.reviews} />

      {/* Konto & Daten */}
      <div className="set-section">
        <div className="set-section-h"><Icon name="download" size={16} /> {txt("Konto & Daten")}</div>
        <Field title={txt("Daten exportieren")} desc="Lädt alle deine Wörter, Listen, Fortschritte und Einstellungen als JSON-Datei herunter.">
          <button className="btn btn-sm" onClick={doExport}><Icon name="download" size={15} /> {txt("Exportieren")}</button>
        </Field>
        <Field title={txt("Datenschutz")} desc="Wie deine Daten gespeichert werden.">
          <button className="btn btn-sm btn-ghost" onClick={() => setPrivacyOpen(true)}>{txt("Datenschutz ansehen")}</button>
        </Field>
        <Field title={txt("Account löschen")} desc={cloudActive ? "Löscht deine Daten endgültig – lokal und in der Cloud. Das kann nicht rückgängig gemacht werden." : "Löscht alle Daten auf diesem Gerät. Das kann nicht rückgängig gemacht werden."}>
          <button className="btn btn-sm" style={{ borderColor: "var(--red)", color: "var(--red)" }} onClick={() => { setConfirmText(""); setDelErr(""); setDelOpen(true); }}>
            <Icon name="trash" size={15} /> Löschen
          </button>
        </Field>
      </div>

      {privacyOpen && (
        <div className="modal-backdrop" onClick={() => setPrivacyOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-head">
              <div className="modal-title">{txt("Datenschutz")}</div>
              <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => setPrivacyOpen(false)}><Icon name="x" size={16} /></button>
            </div>
            <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              <p style={{ marginBottom: 10 }}><b style={{ color: "var(--ink)" }}>{txt("Platzhalter — die vollständige Datenschutzerklärung folgt vor dem Launch.")}</b></p>
              <p style={{ marginBottom: 8 }}>Deine Vokabeln, Listen und Fortschritte werden zuerst lokal auf deinem Gerät gespeichert. Wenn du dich anmeldest, werden sie zusätzlich mit der Cloud (Supabase) synchronisiert, damit sie auf deinen Geräten verfügbar sind.</p>
              <p style={{ marginBottom: 8 }}>{txt("Du kannst deine Daten jederzeit als Datei exportieren und deinen Account vollständig löschen (oben unter „Konto & Daten\").")}</p>
              <p>{txt("Ohne Anmeldung bleibt alles ausschliesslich auf diesem Gerät.")}</p>
            </div>
            <div className="modal-foot"><button className="btn btn-primary" onClick={() => setPrivacyOpen(false)}>{txt("Verstanden")}</button></div>
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

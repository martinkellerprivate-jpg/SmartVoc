/* „Über SmartVoc" — ein Bildschirm für alles, was man einmal liest.
 *
 * Datenschutz und Impressum standen in den Einstellungen zwischen
 * Datenexport und Kontolöschung, also zwischen Handlungen. Es sind aber
 * Texte, keine Handlungen, und sie gehören auch nicht in die Nähe der
 * Knöpfe, die etwas löschen.
 *
 * Er beginnt mit dem Startbild. Das ist der zweite Ort, an dem die
 * Illustration atmen kann, ohne dass Text darauf liegt — und der einzige,
 * an dem man sie sich in Ruhe ansehen kann.
 */
import { Icon } from "../ui/Icon";
import { txt } from "../lib/i18n";
import bild from "../assets/intro.jpg";

export function UeberModal({ offen, onClose }: { offen: boolean; onClose: () => void }) {
  if (!offen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal ueber-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head ueber-kopf">
          <div className="modal-title">{txt("Über SmartVoc")}</div>
          <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={onClose}><Icon name="x" size={16} /></button>
        </div>

        <div className="ueber-rumpf">
          <img className="ueber-bild" src={bild} alt="" />

          <p className="ueber-lead">
            {txt("Ein Vokabeltrainer, der ausrechnet, wann ein Wort wiederkommt, statt es zu raten. Gemacht für Schülerinnen und Schüler, die eine Prüfung vor sich haben.")}
          </p>

          <h3 className="ueber-h">{txt("Datenschutz")}</h3>
          <div className="muted legal-body">
            <p>{txt("Kurz: Diese App sammelt nichts über dich. Sie speichert nur, was du selbst einträgst, und braucht dafür nicht mehr als eine E-Mail-Adresse, und die nur, wenn du dich anmeldest.")}</p>

            <h4>{txt("Was gespeichert wird")}</h4>
            <p>{txt("Deine Wörter, Wortlisten, Lernstände und Einstellungen. Meldest du dich an, zusätzlich deine E-Mail-Adresse und ein selbst gewählter Anzeigename.")}</p>

            <h4>{txt("Wo es liegt")}</h4>
            <p>{txt("Ohne Anmeldung bleibt alles ausschliesslich auf diesem Gerät. Mit Anmeldung wird es zusätzlich bei Supabase gespeichert, damit du auf mehreren Geräten denselben Stand hast. Die Übertragung ist verschlüsselt, und die Regeln der Datenbank lassen nur dich an deine eigenen Daten.")}</p>

            <h4>{txt("Was NICHT passiert")}</h4>
            <p>{txt("Keine Werbung, keine Zählpixel, keine Weitergabe an Dritte, kein Verkauf. Die App verfolgt dein Verhalten nicht und legt kein Profil über dich an. Was sie über deinen Lernstand weiss, dient nur dazu, dir die richtigen Wörter zur richtigen Zeit zu zeigen.")}</p>

            <h4>{txt("Geteilte Wortlisten")}</h4>
            <p>{txt("Teilst du eine Wortliste, wird ihr Inhalt unter einem zufälligen Code abgelegt. Wer den Code hat, kann eine Kopie übernehmen. Dein Name steht nicht dabei, und dein Lernstand wird nicht mitgeteilt.")}</p>

            <h4>{txt("Deine Rechte")}</h4>
            <p>{txt("Du kannst deine Daten jederzeit als Datei exportieren und dein Konto vollständig löschen. Beides findest du in den Einstellungen unter „Konto & Daten“. Beim Löschen verschwinden auch die Daten in der Cloud, und das lässt sich nicht rückgängig machen.")}</p>

            <h4>{txt("Kinder")}</h4>
            <p>{txt("Die App ist für Schülerinnen und Schüler gemacht. Sie erhebt keine Daten über das hinaus, was zum Lernen nötig ist, und sie enthält keine Werbung und keine Käufe.")}</p>

            <h4>{txt("Verantwortlich")}</h4>
            <p>{txt("Martin Keller, Schweiz. Fragen zum Datenschutz gehen an die im Impressum genannte Adresse.")}</p>

          </div>

          <h3 className="ueber-h">{txt("Impressum")}</h3>
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
        </div>

        <div className="modal-foot">
          <button className="btn btn-primary" onClick={onClose}>{txt("Schliessen")}</button>
        </div>
      </div>
    </div>
  );
}

/* Datenschutz und Impressum als Daten, nicht als Auszeichnung.
 *
 * Beide Texte erscheinen an zwei Orten: im Fenster „Über SmartVoc" und als
 * öffentliche Seite im Web. Apple verlangt für den App Store eine frei
 * erreichbare Adresse mit der Datenschutzerklärung; in der App allein
 * genügt sie nicht.
 *
 * Zwei Fassungen desselben Textes wären zwei Gelegenheiten, ihn
 * auseinanderlaufen zu lassen — und ausgerechnet bei einem Rechtstext ist
 * das keine Kleinigkeit. Deshalb steht er einmal hier, und beide Seiten
 * lesen daraus: die App in `UeberModal`, die Web-Seite über
 * `scripts/gen-datenschutz.mjs` beim Bauen.
 */
/* Die oeffentliche Adresse der Datenschutzerklaerung. Sie steht in der
 * App, in App Store Connect und spaeter womoeglich auf einer eigenen
 * Domain -- deshalb an genau einer Stelle. */
export const DATENSCHUTZ_URL = "https://martinkellerprivate-jpg.github.io/SmartVoc/datenschutz.html";

export interface Abschnitt { h?: string; p: string[] }

export const DATENSCHUTZ: Abschnitt[] = [
  {
    p: [
      "Kurz: Diese App sammelt nichts über dich. Sie speichert nur, was du selbst einträgst, und braucht dafür nicht mehr als eine E-Mail-Adresse, und die nur, wenn du dich anmeldest.",
    ],
  },
  {
    h: "Was gespeichert wird",
    p: [
      "Deine Wörter, Wortlisten, Lernstände und Einstellungen. Meldest du dich an, zusätzlich deine E-Mail-Adresse und ein selbst gewählter Anzeigename.",
    ],
  },
  {
    h: "Wo es liegt",
    p: [
      "Ohne Anmeldung bleibt alles ausschliesslich auf diesem Gerät. Mit Anmeldung wird es zusätzlich bei Supabase gespeichert, damit du auf mehreren Geräten denselben Stand hast. Die Übertragung ist verschlüsselt, und die Regeln der Datenbank lassen nur dich an deine eigenen Daten.",
      "Wir betreiben diese Datenbank selbst. Das heisst auch: als Herausgeber der App können wir die gespeicherten Daten grundsätzlich einsehen, so wie jeder, der einen eigenen Server betreibt. Wir tun das nur, wenn es zum Betrieb nötig ist, etwa um einen Fehler zu finden.",
    ],
  },
  {
    h: "Was NICHT passiert",
    p: [
      "Keine Werbung, keine Zählpixel, keine Weitergabe an Dritte, kein Verkauf. Die App verfolgt dein Verhalten nicht und legt kein Profil über dich an. Was sie über deinen Lernstand weiss, dient nur dazu, dir die richtigen Wörter zur richtigen Zeit zu zeigen.",
    ],
  },
  {
    h: "Geteilte Wortlisten",
    p: [
      "Teilst du eine Wortliste, wird ihr Inhalt unter einem zufälligen Code abgelegt. Wer den Code hat, kann eine Kopie übernehmen. Dein Name steht nicht dabei, und dein Lernstand wird nicht mitgeteilt.",
    ],
  },
  {
    h: "Deine Rechte",
    p: [
      "Du kannst deine Daten jederzeit als Datei exportieren und dein Konto vollständig löschen. Beides findest du in den Einstellungen unter „Konto & Daten“. Beim Löschen verschwinden auch die Daten in der Cloud, und das lässt sich nicht rückgängig machen.",
    ],
  },
  {
    h: "Kinder",
    p: [
      "Die App ist für Schülerinnen und Schüler gemacht. Sie erhebt keine Daten über das hinaus, was zum Lernen nötig ist, und sie enthält keine Werbung und keine Käufe.",
    ],
  },
  {
    h: "Verantwortlich",
    p: [
      "Martin Keller, Schweiz. Fragen zum Datenschutz gehen an die im Impressum genannte Adresse.",
    ],
  },
];

export const IMPRESSUM: Abschnitt[] = [
  {
    h: "Herausgeber",
    p: [
      "Martin Keller\nSchweiz",
    ],
  },
  {
    h: "Kontakt",
    p: [
      "Fragen, Fehler und Rückmeldungen gehen an die im App Store hinterlegte Adresse.",
    ],
  },
  {
    h: "Inhalte",
    p: [
      "Der mitgelieferte Grundwortschatz und alle Texte dieser App stammen vom Herausgeber. Die Wörter, die du selbst einträgst, gehören dir.",
    ],
  },
  {
    h: "Verwendete Arbeit anderer",
    p: [
      "Die Wiederholungsabstände berechnet FSRS, ein frei verfügbares Gedächtnismodell. Die Schriften sind Source Serif 4, Hanken Grotesk und Patrick Hand, alle unter der SIL Open Font License.",
    ],
  },
];

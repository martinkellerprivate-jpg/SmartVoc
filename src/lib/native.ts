/* ===================================================================
 * Die native Schicht — Haptik und System-Teilen.
 *
 * Beides ist auf dem Web nicht vorhanden und darf dort nichts kaputt
 * machen. Deshalb kapselt diese Datei die Unterscheidung an genau einer
 * Stelle: die aufrufenden Bauteile fragen nie nach der Plattform, sie
 * rufen einfach auf, und auf dem Web passiert eben nichts (Haptik) oder
 * es wird auf die Zwischenablage ausgewichen (Teilen).
 * =================================================================== */
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Share } from "@capacitor/share";

const nativ = () => Capacitor.isNativePlatform();

/* Haptik sparsam: nur dort, wo das Gerät eine Rückmeldung gibt, die der
 * Bildschirm nicht geben kann — beim Bewerten einer Antwort. Nicht bei
 * jedem Knopfdruck; ein dauernd vibrierendes Gerät ist ermüdend. */
export function tapRichtig() {
  if (nativ()) Haptics.notification({ type: NotificationType.Success }).catch(() => {});
}
export function tapFalsch() {
  if (nativ()) Haptics.notification({ type: NotificationType.Warning }).catch(() => {});
}
export function tapLeicht() {
  if (nativ()) Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
}

/* Teilen: auf dem Gerät das Systemblatt, im Browser die Zwischenablage.
 * Gibt zurück, welcher Weg genommen wurde, damit der Aufrufer die richtige
 * Rückmeldung zeigen kann — „geteilt" und „kopiert" sind nicht dasselbe. */
export async function teilen(opts: { titel: string; text: string; url?: string }): Promise<"geteilt" | "kopiert" | "gescheitert"> {
  if (nativ()) {
    try {
      await Share.share({ title: opts.titel, text: opts.text, url: opts.url, dialogTitle: opts.titel });
      return "geteilt";
    } catch (e) {
      return "gescheitert";   // der Benutzer hat abgebrochen, oder es ging nicht
    }
  }
  /* Im Browser gibt es die Web-Share-API nur teilweise und nur über HTTPS.
   * Die Zwischenablage ist der verlässlichere Weg und tut dasselbe. */
  try {
    await navigator.clipboard.writeText([opts.text, opts.url].filter(Boolean).join("\n"));
    return "kopiert";
  } catch (e) {
    return "gescheitert";
  }
}

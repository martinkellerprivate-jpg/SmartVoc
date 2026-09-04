import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  /* Neutral gehalten: kein Personen- und kein Firmenname. Die Kennung ist
   * zwar nicht auf der Store-Seite zu sehen, aber sie steht in App Store
   * Connect, in Absturzberichten und im Paket selbst -- sie ist also nicht
   * geheim. Und sie laesst sich nach der ersten Veroeffentlichung NIE mehr
   * aendern: eine andere Kennung ist fuer Apple eine andere App. */
  appId: "ch.smartvoc.app",
  appName: "SmartVoc",
  // Written by `npm run build:ios`; kept apart from dist/ so a web deploy can
  // never pick up the iOS bundle.
  webDir: "dist-ios",
  ios: {
    // The paper tone of the app itself, so the strip behind the web view does
    // not flash white on launch or when a scroll bounces past the edge.
    backgroundColor: "#f1e8d8",
  },
};

export default config;

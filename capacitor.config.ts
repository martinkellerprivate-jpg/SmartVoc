import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Reverse DNS of a domain Martin owns. Fixed for the lifetime of the App
  // Store listing — changing it later means a new app, so change it now if at all.
  appId: "ch.drkeller.smartvocables",
  appName: "Smart Vocables",
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

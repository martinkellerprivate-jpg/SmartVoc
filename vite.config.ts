import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// Two ways into the same product, out of one source tree:
//   web → GitHub Pages project page, served under /<repo>/, installable as a PWA
//   iOS → Capacitor, served from capacitor://localhost/ inside a WKWebView
// Both talk to the same Supabase project, so one account carries the same data
// on the phone and in the browser. Neither target is secondary.
//
// The iOS build sets CAP_PLATFORM=ios (see the build:ios script). It needs a
// root base — there is no repo path in front of it — and no service worker:
// there the bundle *is* the app, so a second offline layer would only keep
// serving stale files after an update. Without the flag nothing changes for
// the web build.
const forIOS = process.env.CAP_PLATFORM === "ios";

// GitHub Pages project page → served under /<repo>/. base must match the repo
// name exactly, capitals included — Pages paths are case-sensitive, and a
// mismatch serves a blank page. The PWA manifest start_url/scope/id and the SW
// scope all derive from it.
const base = forIOS ? "/" : "/SmartVoc/";

export default defineConfig({
  base,
  // Separate folders so a web deploy can never pick up an iOS bundle by accident.
  build: { outDir: forIOS ? "dist-ios" : "dist" },
  plugins: [
    react(),
    ...(forIOS
      ? []
      : [
          VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",
            includeAssets: ["icons/apple-touch-icon.png"],
            manifest: {
              id: base,
              start_url: base,
              scope: base,
              name: "SmartVoc",
              short_name: "SmartVoc",
              description: "Vokabeln üben: Deutsch ⇄ Englisch / Français / Latein.",
              lang: "de",
              display: "standalone",
              orientation: "portrait",
              background_color: "#f1e8d8",
              theme_color: "#f1e8d8",
              icons: [
                { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
                { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
                { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
              ],
            },
            workbox: {
              globPatterns: ["**/*.{js,css,html,woff2,woff,png,svg,ico}"],
              maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
              navigateFallback: base + "index.html",
              runtimeCaching: [
                // Tesseract worker/core from CDN → cache-first so scan works offline after first use.
                {
                  urlPattern: ({ url }) => /(^|\.)(jsdelivr\.net|unpkg\.com)$/.test(url.hostname) && /tesseract/.test(url.href),
                  handler: "CacheFirst",
                  options: { cacheName: "tesseract-lib", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 90 }, cacheableResponse: { statuses: [0, 200] } },
                },
                // Tesseract language traineddata.
                {
                  urlPattern: ({ url }) => url.hostname === "tessdata.projectnaptha.com",
                  handler: "CacheFirst",
                  options: { cacheName: "tesseract-lang", expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 90 }, cacheableResponse: { statuses: [0, 200] } },
                },
              ],
            },
          }),
        ]),
  ],
});

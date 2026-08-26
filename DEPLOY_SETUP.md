# Web-Version auf GitHub Pages

Die Web-Version ist einer der beiden Zugänge zu diesem Produkt (der andere ist
die iOS-App). Sie ist als PWA gebaut — installierbar, offline nutzbar — und
wird bei jedem Push auf `main` automatisch über GitHub Actions ausgeliefert.

**Live:** https://martinkellerprivate-jpg.github.io/SmartVoc/

---

## Eingerichtet

| | |
|---|---|
| Repository | `martinkellerprivate-jpg/SmartVoc`, öffentlich |
| Pages-Quelle | *Settings → Pages → Source:* **GitHub Actions** |
| Workflow | `.github/workflows/deploy.yml` |
| `base` | `/SmartVoc/` in `vite.config.ts` |

### Der Repo-Name steckt im `base`-Pfad

`vite.config.ts` setzt für das Web-Ziel `base = "/SmartVoc/"`. Der Teil zwischen
den Schrägstrichen **muss exakt dem Repo-Namen entsprechen, Grossschreibung
eingeschlossen** — Pages-Pfade unterscheiden Gross- und Kleinschreibung. Stimmt
er nicht, lädt die Seite leer: das HTML kommt, die Assets nicht.

Wird das Repository je umbenannt, muss `base` mitwandern.

### Secrets

*Settings → Secrets and variables → Actions*, zwei Stück:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Vite backt sie beim Bauen ins Bündel — sie sind im ausgelieferten JS lesbar, und
das ist so gedacht. Geschützt werden die Daten durch Row-Level-Security in
Supabase, nicht durch Verstecken des Keys. In den Secrets liegen sie, damit sie
aus der Git-Historie bleiben und sich an einer Stelle wechseln lassen.

Fehlen sie, läuft die Action grün durch, aber die Seite kommt **ohne Anmeldung**
hoch — der Supabase-Client wird dann gar nicht erst erzeugt
(`src/lib/supabase.ts`) und die App läuft rein lokal.

### Redirect-URL in Supabase

*Authentication → URL Configuration*: Site URL und Redirect URL auf
`https://martinkellerprivate-jpg.github.io/SmartVoc/`. Ohne das laufen
Bestätigungs- und Passwort-Reset-Mails ins Leere.

---

## Gate-Test auf der Live-URL

- Seite öffnen → der Browser bietet „Installieren" an
- **Installierte** App starten → öffnet auf `…/SmartVoc/`, nicht auf der Wurzel
- Offline schalten (Flugmodus oder DevTools → Network → Offline) → App lädt und
  ist nutzbar (Üben, Wortliste, Statistik, Einstellungen); Sync zeigt „offline"
- Registrieren, anmelden, ein Wort anlegen — und dasselbe Wort in der iOS-App
  wiederfinden. Das ist der eigentliche Beleg: ein Konto, beide Wege.

Kein `404.html` nötig — die App nutzt Hash-Routing (`#share=…`) und sonst
In-App-State, keine server-seitigen Pfade.

---

## Vor dem öffentlichen Launch

- Supabase **„Confirm email" einschalten**
- Datenschutz-**Realtext** statt Platzhalter
- **RLS** auf `user_documents` und `shared_lists` nochmals prüfen — der
  Anon-Key ist öffentlich, RLS ist die einzige Grenze
- **Konto-Löschung** testen (`delete_account()`, siehe `schema.sql`); Apple
  verlangt sie, und ob sie aus `auth.users` löschen darf, ist ungetestet
- Starter-Wortlisten prüfen

# Prompt für Claude Design — Figuren und Intro für SmartVoc

Einmal kopieren, in Claude Design geben. Die technischen Auflagen unten sind
der Grund, warum wir die UI-Skizzen und Kurven NICHT auslagern (die stehen im
Code und nehmen ihre Farben aus dem Schema) — die Figuren dagegen sind
Charakterarbeit und gehören hierher.

---

Ich baue **SmartVoc**, eine Vokabeltrainer-App für Schülerinnen und Schüler ab
etwa zwölf Jahren. Deutschsprachiger Raum, Schweiz. Man legt Wortlisten aus dem
Heft an, setzt das Datum der Prüfung, und die App rechnet aus, wann jedes Wort
wiederkommt. Die Gestaltung ist Papier: Kladde, Karteikarte, Kraftpapier, sehr
ruhig, Serifenschrift für die Wörter.

Was fehlt, ist **Wärme**. Die App ist zurzeit korrekt und ein bisschen streng.
Ich möchte handgezeichnete Figuren, die sie lebendiger und altersgerecht machen,
ohne kindisch zu werden — Vierzehnjährige merken sofort, wenn man sie für zehn
hält.

## Was ich brauche

**1. Ein Intro-Bild für den Start der App.** Hochformat, es füllt den halben
Bildschirm. Motiv: **eine Schülerin und ein Schüler, die mit Karteikarten
lernen.** Wie genau, entscheide du: nebeneinander auf einer Treppe, sich
gegenseitig abfragend, Karten in der Luft, einer hat den Stapel fallen lassen.
Es soll nach *jetzt gerade* aussehen, nicht nach Werbefoto.

**2. Ein Zeichen oder Maskottchen**, das in der Hilfe und bei leeren Listen
auftauchen kann. Muss nicht niedlich sein — es darf auch einfach ein Gegenstand
mit Charakter sein.

**3. Drei bis vier kleine Vignetten** für Momente in der App. Zum Beispiel:
– eine Liste ist leer und wartet
– die Prüfung ist geschafft, alles grün
– ein Wort will einfach nicht sitzen
– jemand übt spät abends

## Stil

Handgezeichnet, skizzenhaft, ein bisschen zittrig. Wenige Striche. Näher an
einer Randnotiz im Schulheft als an einer Kinderbuchillustration. Kein
Vektor-Clean-Look, keine Verläufe, keine Schatten.

Ansonsten: **lass dich nicht von mir einengen.** Ich weiss besser, was ich nicht
will, als was ich will.

## Technische Auflagen — die sind hart

Die App hat drei Farbschemata (warmes Kraftpapier, kühles Blau, neutrales Grau)
mal hell und dunkel, also sechs Grundtöne. Damit eine Zeichnung in allen sechs
funktioniert:

- **SVG**, kein PNG.
- **Einfarbig.** Alle Striche in genau einer Farbe, und diese Farbe als
  `currentColor` gesetzt — nicht als Hexwert. Dann färbt die App sie ein.
- **Kein Hintergrund.** Transparent. Keine weissen Flächen, auch keine
  „unsichtbaren".
- Wo eine Fläche nötig ist, entweder `currentColor` mit Deckkraft, oder
  Schraffur.
- **Höchstens eine zweite Farbe**, und wenn, dann als `var(--akzent)` — ein
  Akzent für ein einziges Element pro Bild.
- Sauber beschnittene `viewBox`, keine Ränder aus Leerraum.

## Was ich zurück haben will

**Von jedem Motiv drei bis fünf Fassungen**, und zwar bewusst
**verschiedene Richtungen** — nicht dieselbe Idee dreimal leicht anders. Zeig
mir Gegensätze: eine sehr reduzierte gegen eine erzählerische, eine ruhige gegen
eine bewegte. Ich wähle aus, und dann verfeinern wir eine.

Zeig sie mir auf **hellem und auf dunklem Grund** nebeneinander, damit ich sehe,
ob die Strichstärke in beiden trägt.

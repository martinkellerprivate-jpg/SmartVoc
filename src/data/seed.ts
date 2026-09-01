/* Default beginner vocabulary — roughly a primary class, 2nd year of English.
 * German nouns carry their article (der/die/das); the trainer treats a
 * missing article as a small deviation, not a wrong answer. */
export const DEFAULT_VOCAB = [
  // Animals
  { en: "dog",        de: "der Hund" },
  { en: "cat",        de: "die Katze" },
  { en: "bird",       de: "der Vogel" },
  { en: "horse",      de: "das Pferd" },
  { en: "fish",       de: "der Fisch" },
  { en: "rabbit",     de: "das Kaninchen" },
  { en: "mouse",      de: "die Maus" },
  { en: "cow",        de: "die Kuh" },

  // Colours
  { en: "red",        de: "rot" },
  { en: "blue",       de: "blau" },
  { en: "green",      de: "grün" },
  { en: "yellow",     de: "gelb" },
  { en: "black",      de: "schwarz" },
  { en: "white",      de: "weiss" },

  // Numbers
  { en: "one",        de: "eins" },
  { en: "two",        de: "zwei" },
  { en: "three",      de: "drei" },
  { en: "ten",        de: "zehn" },

  // Family
  { en: "mother",     de: "die Mutter" },
  { en: "father",     de: "der Vater" },
  { en: "sister",     de: "die Schwester" },
  { en: "brother",    de: "der Bruder" },
  { en: "family",     de: "die Familie" },
  { en: "grandmother",de: "die Grossmutter" },

  // School
  { en: "school",     de: "die Schule" },
  { en: "teacher",    de: "der Lehrer" },
  { en: "book",       de: "das Buch" },
  { en: "pen",        de: "der Stift" },
  { en: "pencil",     de: "der Bleistift" },
  { en: "desk",       de: "der Schreibtisch" },
  { en: "chair",      de: "der Stuhl" },

  // Food
  { en: "apple",      de: "der Apfel" },
  { en: "bread",      de: "das Brot" },
  { en: "milk",       de: "die Milch" },
  { en: "water",      de: "das Wasser" },
  { en: "egg",        de: "das Ei" },
  { en: "cheese",     de: "der Käse" },

  // Body
  { en: "hand",       de: "die Hand" },
  { en: "head",       de: "der Kopf" },
  { en: "eye",        de: "das Auge" },
  { en: "foot",       de: "der Fuss" },

  // Home
  { en: "house",      de: "das Haus" },
  { en: "door",       de: "die Tür" },
  { en: "window",     de: "das Fenster" },
  { en: "table",      de: "der Tisch" },

  // Time
  { en: "day",        de: "der Tag" },
  { en: "night",      de: "die Nacht" },
  { en: "today",      de: "heute" },
  { en: "Monday",     de: "Montag" },

  // Words & actions
  { en: "big",        de: "gross" },
  { en: "small",      de: "klein" },
  { en: "good",       de: "gut" },
  { en: "happy",      de: "glücklich" },
  { en: "to go",      de: "gehen" },
  { en: "to eat",     de: "essen" },
  { en: "to play",    de: "spielen" },
  { en: "to read",    de: "lesen" },
];

/* A small bundled dictionary used as an offline fallback for auto-fill
 * when the online translator is unavailable. Built from the list above. */
export const BUNDLED_DICT = (function () {
  const en2de: Record<string, string> = {};
  const de2en: Record<string, string> = {};
  for (const w of DEFAULT_VOCAB) {
    en2de[w.en.toLowerCase()] = w.de;
    de2en[w.de.toLowerCase().replace(/^(der|die|das)\s+/, "")] = w.en;
  }
  return { en2de, de2en };
})();

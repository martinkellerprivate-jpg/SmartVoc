/* English help texts — a full parallel version, not a sentence-by-sentence
 * translation. Prose carries emphasis in different places in the two
 * languages, and German and English build their sentences differently; a
 * word table would have produced broken English. */
import type { Kapitel, Tipp } from "./help.types";

export const TIPPS_EN: Tipp[] = [
  { h: "A little every day beats a lot now and then",
    b: "Ten to fifteen minutes a day does more than an hour at the weekend. In the gaps between sessions your brain does the rest by itself." },
  { h: "Think first, then turn the card over",
    b: "Actually type your answer before you look at the solution. That effort of remembering is what makes a word stick — not looking at it again." },
  { h: "A word needs many encounters",
    b: "Almost nobody knows a word after seeing it once. Meeting the same word again over several days is normal — and exactly how it should be." },
  { h: "Make friends with your mistakes",
    b: "The words you got wrong are the valuable ones. In Statistics, “Stubborn” collects exactly those for focused practice." },
  { h: "Few new words, properly learnt",
    b: "Eight to twelve new words a day is plenty. Better to really know a few than to half-know fifty." },
  { h: "Mix your words up",
    b: "Practise in a jumble rather than one list straight through. It feels harder and trains your memory noticeably better." },
  { h: "Say the word under your breath",
    b: "Read the word and mouth it silently as you go. The more senses join in, the better it sticks." },
  { h: "Learn the word in context",
    b: "Put a new word into a small sentence or a picture in your head. “The dog barks” is easier to remember than “dog” on its own." },
  { h: "Practise both directions",
    b: "First English to German, then German to English. You only really know a word once it works both ways." },
  { h: "Sleep finishes the job",
    b: "What you practise in the evening settles overnight. A short review before bed often works particularly well." },
];

export const ANLEITUNG_EN: Kapitel[] = [
  {
    titel: "Getting started in 30 seconds",
    text: (
      <>
        <p>Pick your language at the top. For every language you switch on, the app creates a <b>Core vocabulary</b> word list automatically — so you can practise straight away without typing anything in first.</p>
        <p>Go to <b>Practise</b> and start. Everything else can wait.</p>
      </>
    ),
  },
  {
    titel: "The four areas",
    text: (
      <>
        <p>At the bottom (on a phone) or at the top (on a computer) you will find four areas:</p>
        <ul>
          <li><b>Practise</b> — where the learning happens.</li>
          <li><b>Practice plan</b> — a calendar: which word list is due when, and how far along you are.</li>
          <li><b>Word lists</b> — your words: create, paste, organise.</li>
          <li><b>Statistics</b> — how well your words are sitting and where practice pays off right now.</li>
        </ul>
        <p>The gear icon at the top right opens the settings, the question mark next to it opens this help.</p>
      </>
    ),
  },
  {
    titel: "Creating and filling word lists",
    text: (
      <>
        <p>A <b>word list</b> is whatever you want to practise together — usually a page from your exercise book, a unit, or the material for a test.</p>
        <p>Three ways to fill one:</p>
        <ul>
          <li><b>Paste</b> — drop in copied lines or a list you had an AI write. The app works out the columns itself.</li>
          <li><b>By hand</b> — word, translation, done. An example sentence and the pronunciation are optional.</li>
          <li><b>A shared list</b> — someone sends you a link and you take the list over.</li>
        </ul>
        <p>A word may sit in several lists at once. “Unit 4” and “Irregular verbs” can both be true.</p>
      </>
    ),
  },
  {
    titel: "The target date",
    text: (
      <>
        <p>Every word list can have a <b>target date</b> — usually the day of the test. Set it in the head of the list.</p>
        <p>Two things follow. The list appears in the <b>practice plan</b> on that day. And the app brings its words back <b>earlier</b> as the date approaches — the closer it gets, the more often. If you practise several lists together, the words from the list with the nearer date come up more.</p>
      </>
    ),
  },
  {
    titel: "The practice plan",
    text: (
      <>
        <p>The calendar shows every day a word list is due. The colour of the dot says how far along that list is: <b>green</b> means ready, <b>yellow</b> almost, <b>red</b> still needs work. If several lists fall on one day, the number sits inside the dot and the colour shows the weakest of them — that one needs the work first.</p>
        <p>Tap a day and you see every list for that day separately, each with <b>Practise</b> and <b>Statistics</b>. You can tick several lists and practise them together.</p>
        <p>The plan covers all your languages. So it also shows you when Latin and French fall in the same week.</p>
      </>
    ),
  },
  {
    titel: "The card",
    text: (
      <>
        <p>The question is on the front, the answer on the back — like a real index card. At the top of the card you always see the direction of this particular card, for example <b>EN → DE</b>. The filled side is the one you are looking at.</p>
        <p>Above the card is your <b>round progress</b>, below it the <b>mastery</b> of all the words in this practice session. Both sit deliberately beside the card and not on it.</p>
        <p>The symbol at the top right makes the card big. Come back with the same button, with <b>Esc</b>, or by tapping beside the card.</p>
      </>
    ),
  },
  {
    titel: "The four answer types",
    text: (
      <>
        <ul>
          <li><b>Typing</b> — you write the answer. This gives you the most.</li>
          <li><b>Choosing</b> — you pick from several options. Easier, good to begin with.</li>
          <li><b>Self-check</b> — you think, turn the card over and judge for yourself whether you knew it. Be honest; when the word comes back depends on it.</li>
          <li><b>Browsing</b> — just looking. It does not count towards your progress, and it says so above the card.</li>
        </ul>
        <p>Next to that you set the <b>direction</b>. <b>Mixed</b> means: sometimes one way, sometimes the other — the card always shows you which way it is asking.</p>
      </>
    ),
  },
  {
    titel: "The five levels",
    text: (
      <>
        <p>Every word sits at one of five levels. The same five everywhere — on the card, in the statistics, in the practice plan:</p>
        <ul>
          <li><b>solid</b> — holds for a long time, comes back rarely.</li>
          <li><b>nearly solid</b> — almost there, a few more repetitions.</li>
          <li><b>wobbly</b> — comes back more often.</li>
          <li><b>new</b> — freshly learnt, still young.</li>
          <li><b>unpractised</b> — never asked yet.</li>
        </ul>
        <p>The coloured bar shows how your words spread across those five. In the statistics you can tap a level and see only those words.</p>
      </>
    ),
  },
  {
    titel: "When something is wrong",
    text: (
      <>
        <p>Typed a word incorrectly? Tap it under <b>Word lists</b> and change it.</p>
        <p>Do not need a list after all? Delete it — the words stay in your collection and only leave that one list.</p>
        <p>Want to start over? Under <b>Statistics</b>, in “Adjust”, you can reset your progress, either for the selected word lists or for everything. Your words stay either way.</p>
      </>
    ),
  },
];

export function LerntheorieEN() {
  return (
    <div className="help-theory">
      <p className="help-lead">
        This app does not guess when a word should come back. It works it out — using a
        model that has been researched for over a hundred years. About five minutes to read.
      </p>

      <h4>Forgetting is not a failure</h4>
      <p>
        In the late nineteenth century Hermann Ebbinghaus taught himself lists of
        nonsense syllables and measured how much was still there after an hour, a day,
        a week. Out of that came the <b>forgetting curve</b>: freshly learnt material
        drops away steeply at first and then more and more gently. After twenty minutes
        a good part is gone, after a day more still — and after that the loss slows down.
      </p>
      <p>
        The important part of his measurement is not the loss but what happens next:
        after every repetition the curve falls <b>more gently</b> than before. The word
        holds for longer. So forgetting is not a failure but the normal case — and the
        lever you can actually pull.
      </p>

      <h4>The best moment is just before you forget</h4>
      <p>
        Repeat too early and the word is still there, so the repetition does little.
        Repeat too late and it is gone, so you learn it again from scratch. In between
        lies a window where a repetition achieves the most: when remembering only just
        works, but takes effort. This is called <b>spaced repetition</b>, and the effect
        is among the best-established in the psychology of learning.
      </p>
      <p>
        That window is exactly what the app looks for, word by word. It is why a word
        you know well only comes back in three weeks — and one you hesitated over comes
        back tomorrow.
      </p>

      <h4>Retrieving beats re-reading</h4>
      <p>
        A second, equally well-established finding: <b>remembering</b> something
        strengthens it more than <b>reading</b> it again. The term for this is the
        <b> testing effect</b>. Reading a vocabulary list five times does less for you
        than reading it once and testing yourself four times — even though the reading
        feels safer.
      </p>
      <p>
        That is why <b>typing</b> is the recommended answer type and why browsing is
        marked “does not count”. And it is why it pays to really think before turning
        the card over, uncomfortable as that is.
      </p>

      <h4>What the app estimates for each word</h4>
      <p>
        Behind the scenes runs <b>FSRS</b>, a modern memory model. It keeps three
        numbers for every word:
      </p>
      <ul>
        <li><b>How long it holds.</b> This grows with every correct answer — that is the forgetting curve getting gentler.</li>
        <li><b>How stubborn it is.</b> Some words are simply awkward, however often you practise them. Those come back more often and get marked “stubborn”.</li>
        <li><b>How reliably you can still retrieve it.</b> When this drops below your target, the word is due.</li>
      </ul>
      <p>
        You can move that target in the settings. A higher target means practising more
        often and forgetting less. A lower one means fewer cards a day and more slipping
        away. There is no right answer here — only a trade you make yourself.
      </p>

      <h4>Why things change before a test</h4>
      <p>
        If you give a word list a target date, the app raises the target for those words
        as the date comes closer. That is not a second calculation but the same one with
        a stricter target: a higher retention target means shorter intervals, so the
        words come up more often. After the date everything falls back to your normal
        target.
      </p>

      <h4>Why learning is allowed to feel hard</h4>
      <p>
        Learning research has a term that sounds like a contradiction at first:
        <b> desirable difficulties</b>. These are obstacles that make practice harder in
        the moment and more valuable because of it. Spacing is one. Retrieving instead
        of re-reading is another. The third is <b>mixing</b>: practising words in a
        jumble rather than one list straight through.
      </p>
      <p>
        All three share a catch. They feel worse than they are. Someone who goes through
        a list five times in a row feels confident — and a week later is not. Someone who
        practises mixed and spaced makes more mistakes along the way and remembers more
        at the end. So how practice feels is a poor guide, which is why the app takes the
        ordering off your hands.
      </p>

      <h4>What the numbers you see mean</h4>
      <p>
        The <b>round progress</b> above the card applies only to the current round: how
        much of what you set out to do just now is done. It starts again with every round.
      </p>
      <p>
        The <b>mastery</b> below the card is something else: it shows how all the words in
        this session spread across the five levels. It changes slowly, over weeks — and it
        is the number that reappears as the traffic light in the practice plan and as the
        bar in the statistics. It is the same calculation everywhere: the share of words
        that are solid or nearly solid.
      </p>

      <h4>What is in your hands</h4>
      <ul>
        <li><b>Regularity.</b> Ten minutes a day beats an hour on Saturday — because the model builds on intervals, not on volume.</li>
        <li><b>Honesty.</b> Cheating at self-check only cheats you out of the repetition.</li>
        <li><b>Few new words.</b> Eight to twelve a day is enough. Every new word creates future repetitions.</li>
      </ul>

      <h4>Further reading</h4>
      <ul className="help-links">
        <li><a href="https://en.wikipedia.org/wiki/Forgetting_curve" target="_blank" rel="noreferrer">Forgetting curve (Wikipedia)</a> — Ebbinghaus’ measurement and what follows from it</li>
        <li><a href="https://en.wikipedia.org/wiki/Spaced_repetition" target="_blank" rel="noreferrer">Spaced repetition (Wikipedia)</a> — why intervals work</li>
        <li><a href="https://en.wikipedia.org/wiki/Testing_effect" target="_blank" rel="noreferrer">Testing effect (Wikipedia)</a> — retrieving beats re-reading</li>
        <li><a href="https://github.com/open-spaced-repetition/fsrs4anki/wiki" target="_blank" rel="noreferrer">FSRS</a> — the model this app calculates with</li>
      </ul>
    </div>
  );
}

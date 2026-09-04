/* English help texts. Kept apart from the machinery because prose cannot be
 * translated sentence by sentence: German and English build their sentences
 * differently, and the emphasis sits in other places. Two complete versions,
 * not one word list. Mirrors help.de.tsx chapter for chapter. */
import type { Kapitel, Tipp } from "./help.types";
import { KritzelKarte, KritzelAntwortarten, KritzelKalender, KritzelLeiste,
         KritzelListe, KritzelVergessen, KritzelFenster, KritzelTesteffekt } from "../ui/Kritzel";

export const TIPPS_EN: Tipp[] = [
  { h: "A little every day beats a lot now and then",
    b: "Ten to fifteen minutes a day does more than an hour at the weekend. In the gaps between sessions your brain does the rest by itself." },
  { h: "Think first, then turn the card over",
    b: "Actually type your answer before you look at the solution. That effort of remembering is what makes a word stick — not looking at it again." },
  { h: "A word needs many encounters",
    b: "Almost nobody knows a word after seeing it once. Meeting the same word again over several days is normal, and exactly how it should be." },
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
    titel: "Test tomorrow: what now?",
    text: (
      <>
        <p>The shortest way from the page in your book to your first round takes about two minutes:</p>
        <ol>
          <li>Under <b>Word lists</b>, tap <b>+ New list</b>, then <b>Paste a list</b>. If you would rather not type the words, the <b>AI prompt</b> fetches them from a photo of your page.</li>
          <li>Give the list a <b>target date</b>. That is the day of the test.</li>
          <li>Tap <b>Practise</b> and go.</li>
        </ol>
        <p>Everything else can wait. From here on the app knows by itself which word comes back when.</p>
        <p className="help-callout">For every language you switch on there is already a <b>core vocabulary</b> waiting. So you can practise right away, even without a list of your own.</p>
      </>
    ),
  },
  {
    titel: "Where things are",
    text: (
      <>
        <ul>
          <li><b>Practise</b> is where the learning happens. Everything else only serves it.</li>
          <li><b>Practice plan</b> answers: what is due when, and will I be ready in time?</li>
          <li><b>Word lists</b> is your store of material.</li>
          <li><b>Statistics</b> answers: where is it stuck, and am I getting better?</li>
        </ul>
        <p>Top right the gear for settings, the question mark for this help.</p>
      </>
    ),
  },
  {
    titel: "Getting words into the app",
    text: (
      <>
        <p>There are four ways. They differ only in how much you have to type yourself.</p>
        <ol>
          <li><b>Photo and AI:</b> for a whole page, without typing</li>
          <li><b>Paste a list:</b> when you already have the text somewhere</li>
          <li><b>A single word:</b> for additions</li>
          <li><b>A shared list:</b> when someone sends you theirs</li>
        </ol>

        <h4>1. Photo and AI</h4>
        <p>This is the way you will probably use most. It works with any AI that can read images.</p>
        <ol>
          <li>In the app: <b>+ New list</b>, then <b>Paste a list</b>.</li>
          <li>Tap <b>Copy the AI prompt</b> at the bottom. A ready-made instruction is now on your clipboard.</li>
          <li>Switch to your AI app, paste the instruction and attach a <b>photo of your page</b>.</li>
          <li>The AI answers with a list. Copy it.</li>
          <li>Back in SmartVoc, paste it into the big field, then <b>On to checking</b>.</li>
        </ol>
        <p>In the checking window every word stands on its own. Glance over it, fix what went wrong, and pick the list at the end. Photos get misread now and then, and this is the moment to notice. Not in the middle of the test.</p>

        <h4>2. Paste a list</h4>
        <p>The same window, just without the AI. One line per word, the two languages separated by a vertical bar, a dash, a colon or a tab:</p>
        <p className="help-code">tree | der Baum<br />house | das Haus</p>
        <p>Lines copied from a spreadsheet work straight away, because spreadsheets separate with tabs.</p>

        <h4>3. A single word</h4>
        <p>In an open list, under <b>View and edit the words</b>, tap <b>Add</b>. Word and translation are enough; an example sentence and the pronunciation can be left out or added later.</p>

        <h4>4. A shared list</h4>
        <p>Whoever shares a list gets a code. With <b>Take over a shared list</b> and that code you have your own copy. Your progress and theirs stay separate.</p>
      </>
    ),
  },
  {
    titel: "Keeping a list in order",
    text: (
      <>
        <p>A word list is whatever you practise together: a page from your book, a unit, the material for a test. <b>Every word belongs to exactly one list.</b></p>
        <KritzelListe titel="First the list, then its words" />
        <p>Open a list and you see the list itself first: target date, how far along you are, and the ways onward. The words sit one level deeper.</p>
        <p>There you tap a row to select it, then use <b>Edit</b> or <b>Delete</b>. Several at once also works.</p>
        <p>Two lists that belong together anyway can be <b>merged</b>. The words move over, the empty list disappears.</p>
      </>
    ),
  },
  {
    titel: "The target date",
    text: (
      <>
        <p>Give a list the day of the test as its <b>target date</b>. It is the single entry that does the most for you.</p>
        <p>From then on the app counts backwards. The closer the date, the more often the words of that list come up, so that they stick on the day and not three weeks later. If you practise several lists together, the ones with the nearer date come up more.</p>
        <p>A list without a target date is not worse off. It simply runs alongside, at the normal pace.</p>
      </>
    ),
  },
  {
    titel: "The practice plan",
    text: (
      <>
        <p>The practice plan answers a single question: <b>will I be ready in time?</b></p>
        <KritzelKalender titel="The colour says where you stand" />
        <p>Green means: if the test were today, you would pass. Red means there is work ahead. If several lists fall on one day, the colour shows the weakest, because that one decides.</p>
        <p>Tap a day and you see what it is about, and you can practise straight from there.</p>
        <p>The plan only shows lists you have given a <b>target date</b>. All the others run alongside and do not appear here.</p>
      </>
    ),
  },
  {
    titel: "Practising: the card",
    text: (
      <>
        <KritzelKarte titel="Each side stays in its own language" />
        <p>Question on the front, answer on the back. The example sentence appears on both sides, each in the language of that side. Otherwise the translation would sit next to the word you are supposed to translate.</p>
        <p>The top of the card always says which way it is asking. With <b>Mixed</b> that changes from card to card, so the quick glance is worth it.</p>
        <p>The button at the top right makes the card large and everything else disappear. Back with the same button, with <b>Esc</b>, or a tap beside it.</p>
      </>
    ),
  },
  {
    titel: "The four answer types",
    text: (
      <>
        <KritzelAntwortarten titel="Three count, one does not" />
        <p><b>Typing.</b><br />You write the answer yourself. Harder than anything else and worth the most. If you cannot decide, take this one.</p>
        <p><b>Multiple choice.</b><br />You pick from several options. Easier, because the answer is already there. Good at the start, or when you are tired.</p>
        <p><b>Self-check.</b><br />You think, turn the card over, and judge for yourself whether you knew it.</p>
        <p className="help-callout">Best write the answer on a piece of paper and only then check in the app. But no cheating: you are only cheating yourself out of the repetition.</p>
        <p><b>Just flipping through.</b><br />The right choice when you simply want to run through a list quickly. For a new list, to see what is coming, or just before a test to skim. Important: this mode counts for nothing. It does not change your progress and shows up in no statistic.</p>
      </>
    ),
  },
  {
    titel: "How well a word has stuck",
    text: (
      <>
        <KritzelLeiste titel="The same five levels everywhere" />
        <p><b>stuck</b> means: holds for a long time, comes back rarely. <b>nearly</b>: almost there, a few more repetitions. <b>shaky</b>: comes back more often. <b>new</b>: freshly learnt. <b>not practised</b>: never asked yet.</p>
        <p>You find this bar on the card, on every list and in the statistics. It is the same calculation everywhere, so the colours are comparable.</p>
        <p>In the statistics, tapping an entry in the key opens the matching words.</p>
      </>
    ),
  },
  {
    titel: "With or without an account",
    text: (
      <>
        <p>The app works fully <b>without an account</b>. Everything you enter then lives on this device, and only there.</p>
        <p>Sign in and three things follow: your progress is the same on <b>all your devices</b>, you can <b>share lists</b>, and your words survive if something happens to the device.</p>
        <p>You can sign in at any later point. Whatever is already on the device, the app asks whether it should come along into the account.</p>
        <p>You delete your account under <b>Settings</b> → “Account &amp; data”. That removes the data in the cloud too, and it cannot be undone.</p>
      </>
    ),
  },
  {
    titel: "When something goes wrong",
    text: (
      <>
        <p><b>A word is spelt wrong.</b> Open the list, go to <b>View and edit the words</b>, tap the row, choose <b>Edit</b>.</p>
        <p><b>The app keeps asking words you no longer need.</b> Delete the list. The words themselves stay and only leave that one list.</p>
        <p><b>Your progress no longer fits.</b> In Settings, under “Account &amp; data”, you can reset it: points, history and your daily run, in every language. Your words stay. It cannot be undone.</p>
      </>
    ),
  },
];

export const THEORIE_LEAD_EN =
  "SmartVoc does not guess when a word comes back. It works it out, with a model researchers have been refining for over a hundred years. If you want to know why a word only reappears in three weeks, the answer is here.";

export const THEORIE_EN: Kapitel[] = [
  {
    titel: "Forgetting is not a failure",
    text: (
      <>
        <p>In the late 19th century Hermann Ebbinghaus taught himself meaningless syllables and measured how much of them was still there after an hour, a day, a week. Out came the <b>forgetting curve</b>: freshly learnt material drops steeply at first and then ever more gently.</p>
        <KritzelVergessen titel="Every repetition makes the curve flatter" />
        <p>What matters is not the loss but what happens afterwards. After every repetition the curve falls more gently than before. The word holds longer.</p>
        <p>So forgetting is not a failure but the normal case. And the lever you can pull.</p>
      </>
    ),
  },
  {
    titel: "The best moment is just before you forget",
    text: (
      <>
        <p>Repeat too early and the word is still present, so the repetition does little. Repeat too late and it is gone, so you learn it again.</p>
        <KritzelFenster titel="In between lies the window the app is looking for" />
        <p>In between lies a window where a repetition does the most: when remembering just about works but costs effort. It is called <b>spaced repetition</b>, and the effect is among the best evidenced in learning research.</p>
        <p>That window is exactly what the app looks for, word by word. Which is why a word you know well only comes back in three weeks, and one you hesitated over comes back tomorrow.</p>
      </>
    ),
  },
  {
    titel: "Retrieving beats re-reading",
    text: (
      <>
        <p><b>Remembering</b> something makes it stick more than <b>reading</b> it again. The technical term is the <b>testing effect</b>.</p>
        <KritzelTesteffekt titel="Reading five times gives less than testing four times" />
        <p>Reading a word list through five times does less for you than reading it once and testing yourself four times. Even though the reading feels considerably safer.</p>
        <p>That is why <b>typing</b> is the recommended answer type, and why <b>just flipping through</b> is explicitly marked as not counting. And why it pays to really think before you turn the card over, uncomfortable as it is.</p>
      </>
    ),
  },
  {
    titel: "What the app knows about each word",
    text: (
      <>
        <p>Behind the scenes runs <b>FSRS</b>, a modern memory model. It keeps three numbers for every word:</p>
        <ul>
          <li><b>How long it holds.</b> This grows after every correct answer. That is the flattening curve from above.</li>
          <li><b>How stubborn it is.</b> Some words are difficult no matter how often you practise them. Those come back more often and get marked as “persistent”.</li>
          <li><b>How well you still know it right now.</b> When this drops below your target, the word is due.</li>
        </ul>
        <p>You can move that target in the settings. A higher target means: practise more often, more sticks. A lower one: fewer cards a day, more forgetting. There is no right answer here, only a trade you make yourself.</p>
        <p>What the app does <b>not</b> do: it does not tune the model to you personally, and records nothing for that purpose. The model's numbers are the same for everyone.</p>
      </>
    ),
  },
  {
    titel: "Why things change before a test",
    text: (
      <>
        <p>Give a word list a target date and the app raises the target for those words as the date approaches.</p>
        <p>That is not a second calculation but the same one with a stricter target. A higher retention target means shorter intervals, so the words come up more often. After the date everything falls back to your normal target.</p>
        <p>In the last days before the date the app also lifts the daily cap for those words. It helps nobody if the test words of all things are the ones stuck at the limit.</p>
      </>
    ),
  },
  {
    titel: "Why learning is allowed to feel hard",
    text: (
      <>
        <p>Learning research has a term that sounds like a contradiction at first: <b>desirable difficulties</b>. It means hurdles that make practice harder in the moment and are worth more precisely because of it.</p>
        <p>Spaced practice is one. Retrieving instead of re-reading is the second. The third is <b>interleaving</b>: practising words mixed up instead of one list after another in a block.</p>
        <p>All three share the same catch. They feel worse than they are. Go through a list five times in a row and you feel secure, and a week later you are not. Practise mixed and spaced and you make more mistakes along the way and remember more at the end.</p>
        <p>So how practice feels is a poor guide, and that is why the app takes the order out of your hands.</p>
      </>
    ),
  },
  {
    titel: "What the numbers you see mean",
    text: (
      <>
        <p>The <b>round progress</b> above the card applies to the current round only: how much of what you set out to do right now is done. It starts fresh with every round.</p>
        <p>The <b>mastery level</b> is something else. It shows how all the words of this practice spread across the five levels, changes slowly over weeks, and is the same figure that appears as the traffic light in the practice plan and as the bar in the statistics.</p>
        <p>It is the same calculation everywhere: the share of words that have stuck or nearly stuck.</p>
      </>
    ),
  },
  {
    titel: "What is in your hands",
    text: (
      <>
        <ul>
          <li><b>Regularity.</b> Ten minutes a day beat an hour on Saturday, because the model builds on intervals and not on volume.</li>
          <li><b>Honesty.</b> With self-check, cheating only cheats you out of the repetition.</li>
          <li><b>Few new words.</b> Eight to twelve a day is plenty. Every new word creates future repetitions.</li>
        </ul>
      </>
    ),
  },
  {
    titel: "Further reading",
    text: (
      <ul className="help-links">
        <li><a href="https://en.wikipedia.org/wiki/Forgetting_curve" target="_blank" rel="noreferrer">Forgetting curve (Wikipedia)</a>: Ebbinghaus’ measurement and what follows from it</li>
        <li><a href="https://en.wikipedia.org/wiki/Spaced_repetition" target="_blank" rel="noreferrer">Spaced repetition (Wikipedia)</a>: why intervals work</li>
        <li><a href="https://en.wikipedia.org/wiki/Testing_effect" target="_blank" rel="noreferrer">Testing effect (Wikipedia)</a>: retrieving beats re-reading</li>
        <li><a href="https://github.com/open-spaced-repetition/fsrs4anki/wiki" target="_blank" rel="noreferrer">FSRS</a>: the model this app calculates with</li>
      </ul>
    ),
  },
];

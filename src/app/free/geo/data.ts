// /free/68 (GEO 101): what the five figures show, and how they judge it. No React here, so `npm test` can read it.
// From the reel: the query, the three details GEO picks out (topic, qualifier, location), the fingerprint idea,
// the two ways (third-party sources, your own content) and the three kinds of content that stand out.
// Made up for this page, and marked so on the figures: the five search results, the four questions, the six snippets
// and the bar patterns. The patterns are drawings, not real embeddings. The checklist is general advice, not statistics.

export type GeoDemoKind = "compare" | "match" | "sources" | "content" | "checklist";
export const GEO_KINDS: GeoDemoKind[] = ["compare", "match", "sources", "content", "checklist"];

/* ───── figure 1 · SEO vs GEO ───── */

export const QUERY = "best Italian restaurants near me";

export type PartId = "topic" | "qualifier" | "location";
export const PARTS: { id: PartId; label: string; text: string }[] = [
  { id: "topic", label: "topic", text: "Italian restaurants" },
  { id: "qualifier", label: "qualifier", text: "best" },
  { id: "location", label: "location", text: "near me" },
];

/** One made-up search result. `covers` names the words in it that answer each detail of the query. */
export type Result = { id: string; text: string; covers: Partial<Record<PartId, string>>; note: string };
export const RESULTS: Result[] = [
  { id: "echo", text: "Best Italian restaurants near me? Best Italian restaurants near me!", covers: {}, note: "Repeats the words. Names no place." },
  { id: "rome", text: "The best Italian restaurants in Rome, Florence and Milan", covers: { qualifier: "best", topic: "Italian restaurants" }, note: "Right topic. Wrong place." },
  { id: "open-now", text: "Restaurants near me that are open right now", covers: { location: "near me" }, note: "Nearby. Any kind of food." },
  { id: "ovens", text: "The best pizza ovens for a home kitchen", covers: {}, note: "Shares one word. A different need." },
  {
    id: "trattoria",
    text: "A family-run trattoria around the corner, top-rated for its handmade pasta",
    covers: { topic: "trattoria", location: "around the corner", qualifier: "top-rated" },
    note: "None of the exact words. All three details.",
  },
];

const WORD = /[A-Za-z0-9]+/g;

/** The words of a text, lower-cased. */
export function words(text: string): string[] {
  return (text.match(WORD) ?? []).map((w) => w.toLowerCase());
}

/** `text` cut into pieces; a piece is `hit` when it is one of the query's exact words (case aside). */
export function splitHits(query: string, text: string): { text: string; hit: boolean }[] {
  const wanted = new Set(words(query));
  const out: { text: string; hit: boolean }[] = [];
  let at = 0;
  const plain = (end: number) => {
    if (end <= at) return;
    const last = out.at(-1);
    if (last && !last.hit) last.text += text.slice(at, end);
    else out.push({ text: text.slice(at, end), hit: false });
  };
  for (const m of text.matchAll(WORD)) {
    if (!wanted.has(m[0].toLowerCase())) continue;
    plain(m.index);
    out.push({ text: m[0], hit: true });
    at = m.index + m[0].length;
  }
  plain(text.length);
  return out;
}

export const hitCount = (query: string, text: string) => splitHits(query, text).filter((s) => s.hit).length;

/** The results as exact keywords rank them: most hits first. */
export function seoOrder(): Result[] {
  return [...RESULTS].sort((a, b) => hitCount(QUERY, b.text) - hitCount(QUERY, a.text));
}

/** The results as meaning ranks them: most of the three details covered first. */
export function geoOrder(): Result[] {
  return [...RESULTS].sort((a, b) => Object.keys(b.covers).length - Object.keys(a.covers).length);
}

/** A result's text cut into pieces; a piece carries `part` when it is the phrase that answers that detail. */
export function splitCovers(result: Result): { text: string; part?: PartId }[] {
  const found = (Object.entries(result.covers) as [PartId, string][])
    .map(([part, phrase]) => ({ part, phrase, at: result.text.indexOf(phrase) }))
    .filter((f) => f.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: { text: string; part?: PartId }[] = [];
  let at = 0;
  for (const f of found) {
    if (f.at < at) continue;
    if (f.at > at) out.push({ text: result.text.slice(at, f.at) });
    out.push({ text: f.phrase, part: f.part });
    at = f.at + f.phrase.length;
  }
  if (at < result.text.length) out.push({ text: result.text.slice(at) });
  return out;
}

/* ───── figure 2 · matching by meaning ───── */

export type Question = { id: string; text: string; topic: string };
export type Snippet = { id: string; text: string; topic: string };

export const QUESTIONS: Question[] = [
  { id: "q-pasta", text: "Where can I get good pasta tonight?", topic: "italian-dinner" },
  { id: "q-laptop", text: "My laptop dies after an hour. What can I do?", topic: "battery" },
  { id: "q-tired", text: "How do I stop waking up tired?", topic: "sleep" },
  { id: "q-rain", text: "What should I wear to run in the rain?", topic: "rain-run" },
];

export const SNIPPETS: Snippet[] = [
  { id: "cook-pasta", text: "How to cook pasta at home: a guide for beginners.", topic: "cooking" },
  { id: "battery", text: "Settings that make a notebook battery last longer.", topic: "battery" },
  { id: "trattoria", text: "A family trattoria that makes fresh tagliatelle and stays open late.", topic: "italian-dinner" },
  { id: "bags", text: "Laptop bags and sleeves: which size to buy.", topic: "bags" },
  { id: "jackets", text: "Waterproof jackets and trail shoes for wet-weather jogging.", topic: "rain-run" },
  { id: "sleep", text: "An evening routine for deeper, longer sleep.", topic: "sleep" },
];

// small words that are in almost every sentence; they do not count as keywords
const STOP = new Set(
  "a an the and or but to of in on at for from with by as is are was be do does did can could should would will i me my you your we our it its this that these those what which who where when why how up out not no so if then than".split(" "),
);

/** The keywords two texts have in common (small words left out), in the order of the first text. */
export function sharedWords(a: string, b: string): string[] {
  const other = new Set(words(b));
  return [...new Set(words(a))].filter((w) => !STOP.has(w) && other.has(w));
}

const BARS = 14;

function seedOf(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function random(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * The bar pattern drawn for one text: 14 heights between 0.1 and 1. Its shape comes from the meaning (`topic`);
 * `salt` (the text's id) moves each bar a little, so two texts about the same thing look alike, not identical.
 * A drawing for the figure, not a real embedding.
 */
export function fingerprint(topic: string, salt: string): number[] {
  const shape = random(seedOf(topic));
  const wobble = random(seedOf(`${topic}/${salt}`));
  return Array.from({ length: BARS }, () => {
    const base = shape() < 0.5 ? 0.2 + shape() * 0.2 : 0.7 + shape() * 0.3;
    const v = base + (wobble() - 0.5) * 0.12;
    return Math.round(Math.min(1, Math.max(0.1, v)) * 1000) / 1000;
  });
}

/** How alike two patterns are: 1 when identical, lower the more the bars differ. */
export function closeness(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  if (!n) return 0;
  let diff = 0;
  for (let i = 0; i < n; i++) diff += Math.abs(a[i] - b[i]);
  return 1 - diff / n;
}

/** The snippet whose pattern is closest to the question's. */
export function bestMatch(question: Question): Snippet {
  const mine = fingerprint(question.topic, question.id);
  let best = SNIPPETS[0];
  let top = -1;
  for (const s of SNIPPETS) {
    const c = closeness(mine, fingerprint(s.topic, s.id));
    if (c > top) {
      top = c;
      best = s;
    }
  }
  return best;
}

/* ───── figure 3 · third-party sources ───── */

export type SourceId = "podcast" | "top10" | "reviews" | "forums";
export const SOURCES: { id: SourceId; label: string; line: string }[] = [
  { id: "podcast", label: "Podcast", line: "A podcast in your field mentions you." },
  { id: "top10", label: "Top 10", line: "A top-10 article lists you." },
  { id: "reviews", label: "Reviews", line: "Customers review you where your category gets reviewed." },
  { id: "forums", label: "Forums", line: "People recommend you in forum threads." },
];

/* ───── figure 4 · your own content ───── */

export type AngleId = "firsthand" | "angle" | "gap";
export const ANGLES: { id: AngleId; label: string; tag: string; what: string }[] = [
  { id: "firsthand", label: "Firsthand stories", tag: "only you have this", what: "Something that happened to you. Nobody else can write it, so nobody else has it." },
  { id: "angle", label: "Unique angles", tag: "same topic, new side", what: "The topic everyone covers, seen from the side they skipped." },
  { id: "gap", label: "Under-covered topics", tag: "open ground", what: "A question people really ask that almost nobody has answered well." },
];

/* ───── figure 5 · the checklist ───── */

export const STEPS: { id: string; title: string; text: string }[] = [
  { id: "ask", title: "Ask an AI assistant about your category", text: "Type the questions a customer would ask, the way they would ask them. Note whether you are mentioned, and who is." },
  { id: "questions", title: "Write down the questions customers really ask", text: "Take them from your inbox, your calls and your comments. Keep their words, not yours." },
  { id: "answer-first", title: "Answer each one on your own site, answer first", text: "One question per page or section. Put the direct answer in the opening lines, then the detail." },
  { id: "only-you", title: "Add something only you have", text: "A firsthand story, a number you measured yourself, a photo of your own work, a mistake you made." },
  { id: "structure", title: "Make each page easy to read in pieces", text: "A clear heading for each question, short paragraphs, and lists or tables where they fit." },
  { id: "mention", title: "Earn one mention outside your site", text: "Pitch one podcast, ask to be considered for one top-10 article, or ask a happy customer for a review." },
  { id: "again", title: "Ask the same questions again later", text: "Repeat step 1 once your changes have had time to be picked up, and compare with your notes." },
];

export const STORAGE_KEY = "free68.geo-checklist";

/** The ticked step ids from what storage holds. Anything unreadable, unknown or repeated is dropped; the list's order is kept. */
export function parseDone(raw: string | null | undefined): string[] {
  if (!raw) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  const ticked = new Set(value.filter((v): v is string => typeof v === "string"));
  return STEPS.map((s) => s.id).filter((id) => ticked.has(id));
}

export const serializeDone = (done: string[]) => JSON.stringify(parseDone(JSON.stringify(done)));

/** Tick a step, or untick it when it is already ticked. An id that is not a step changes nothing. */
export function toggleDone(done: string[], id: string): string[] {
  if (!STEPS.some((s) => s.id === id)) return done;
  return done.includes(id) ? done.filter((d) => d !== id) : [...done, id];
}

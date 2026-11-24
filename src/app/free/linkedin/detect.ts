// /free/77: detect.py from github.com/Jakeschincariol/linkedin-agent-skill (skills/li-human/detect.py, MIT, by Jake
// Schincariol), ported line for line so the page can score a draft in the browser with the same rules and the same
// lexicon (slop.json, passed in as `lex`). Nothing is sent anywhere. data.test.mjs checks this port against the
// numbers the Python script prints for the same texts (draft.txt: 15.0 FLAGGED).
//
// The patterns are kept in Python's own spelling (the same strings as detect.py and slop.json) and translated by
// pyRegex() into JavaScript patterns that mean the same thing: Python's \w, \d, \s and \b are Unicode-aware, its ^ and
// $ in MULTILINE mode only know "\n", and its `.` matches everything but "\n". Python's str.split() whitespace and its
// len() in code points are reproduced too.

import type { Lexicon } from "./source";

/* ───────────── Python semantics ───────────── */

/** The characters Python's str.isspace() accepts: what \s matches and what str.split() splits on. */
const PY_WS = "\\t\\n\\v\\f\\r\\x1c-\\x1f \\x85\\xa0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000";
/** Python's \w for str patterns: letters, numbers and the underscore. */
const PY_W = "\\p{L}\\p{N}_";
const PY_B = `(?:(?<=[${PY_W}])(?![${PY_W}])|(?<![${PY_W}])(?=[${PY_W}]))`;
/** Characters a JavaScript `u` pattern lets you escape outside a class. */
const JS_SYNTAX = "^$\\.*+?()[]{}|/";

type PyFlags = { ignoreCase?: boolean; multiline?: boolean };

/** Python `re` pattern (the subset detect.py and slop.json use) to a JavaScript RegExp with the same matches. Always global. */
export function pyRegex(source: string, flags: PyFlags = {}): RegExp {
  let src = source;
  let ignoreCase = !!flags.ignoreCase;
  let multiline = !!flags.multiline;
  // global inline flags at the start: (?i) (?m) (?im)
  const lead = /^\(\?([aiLmsux]+)\)/.exec(src);
  if (lead) {
    if (lead[1].includes("i")) ignoreCase = true;
    if (lead[1].includes("m")) multiline = true;
    src = src.slice(lead[0].length);
  }

  let out = "";
  let inClass = false;
  let classStart = false;
  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (ch === "\\") {
      const next = src[i + 1];
      i += 1;
      if (next === undefined) throw new SyntaxError("pattern ends with a backslash");
      if (next === "U") {
        out += `\\u{${src.slice(i + 1, i + 9).replace(/^0+/, "") || "0"}}`;
        i += 8;
      } else if (next === "u") {
        out += `\\u{${src.slice(i + 1, i + 5)}}`;
        i += 4;
      } else if (next === "x") {
        out += `\\x${src.slice(i + 1, i + 3)}`;
        i += 2;
      } else if (next === "w") {
        out += inClass ? PY_W : `[${PY_W}]`;
      } else if (next === "W") {
        if (inClass) throw new SyntaxError("\\W inside a class is not supported");
        out += `[^${PY_W}]`;
      } else if (next === "d") {
        out += "\\p{Nd}";
      } else if (next === "D") {
        out += "\\P{Nd}";
      } else if (next === "s") {
        out += inClass ? PY_WS : `[${PY_WS}]`;
      } else if (next === "S") {
        if (inClass) throw new SyntaxError("\\S inside a class is not supported");
        out += `[^${PY_WS}]`;
      } else if (next === "b") {
        out += inClass ? "\\x08" : PY_B;
      } else if (next === "B") {
        out += `(?!${PY_B})`;
      } else if ("ntrfv".includes(next)) {
        out += `\\${next}`;
      } else if (/[A-Za-z0-9]/.test(next)) {
        throw new SyntaxError(`\\${next} is not supported`);
      } else if (JS_SYNTAX.includes(next) || (inClass && next === "-")) {
        out += `\\${next}`;
      } else {
        out += next; // Python's re.escape escapes characters like space, '-', '#', '&' that need no escape here
      }
      classStart = false;
      continue;
    }
    if (inClass) {
      if (ch === "]" && !classStart) inClass = false;
      if (ch === "^" && classStart && src[i - 1] === "[") {
        out += ch;
        continue; // still at the start: a ']' right after '[^' is a literal
      }
      out += ch === "[" ? "\\[" : ch === "]" && classStart ? "\\]" : ch;
      classStart = false;
      continue;
    }
    if (ch === "[") {
      inClass = true;
      classStart = true;
      out += ch;
    } else if (ch === ".") {
      out += "[^\\n]";
    } else if (ch === "^") {
      out += multiline ? "(?<![^\\n])" : "(?<![\\s\\S])";
    } else if (ch === "$") {
      out += multiline ? "(?![^\\n])" : "(?=\\n?(?![\\s\\S]))";
    } else {
      out += ch;
    }
  }
  return new RegExp(out, `gu${ignoreCase ? "i" : ""}`);
}

function count(re: RegExp, text: string): number {
  re.lastIndex = 0;
  let n = 0;
  for (const m of text.matchAll(re)) if (m[0] !== undefined) n += 1;
  return n;
}

function all(re: RegExp, text: string): RegExpMatchArray[] {
  re.lastIndex = 0;
  return [...text.matchAll(re)];
}

const WS_RUN = new RegExp(`[${PY_WS}]+`, "u");

/** Python's str.split() with no argument. */
export function pySplit(s: string): string[] {
  return s.split(WS_RUN).filter((part) => part.length > 0);
}

/** Python's len(): code points, not UTF-16 units. */
const pyLen = (s: string) => Array.from(s).length;

/** Python's str.count() for one character. */
const countChar = (text: string, ch: string) => text.split(ch).length - 1;

const mean = (xs: number[]) => xs.reduce((sum, x) => sum + x, 0) / xs.length;
const pstdev = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((sum, x) => sum + (x - m) ** 2, 0) / xs.length);
};

/** `x` with `d` decimals, the way Python's format() prints it: from the exact value, ties to even. */
export function pyFixed(x: number, d: number): string {
  if (!Number.isFinite(x)) return String(x);
  const exact = Math.abs(x).toFixed(Math.min(100, d + 60)); // the double's exact decimal expansion
  const [whole, frac = ""] = exact.split(".");
  const keep = frac.slice(0, d);
  const rest = frac.slice(d);
  let digits = whole + keep;
  const half = rest[0] === "5" && /^5?0*$/.test(rest);
  const up = rest[0] > "5" || (rest[0] === "5" && !half) || (half && Number(digits[digits.length - 1]) % 2 === 1);
  if (up) {
    const n = (BigInt(digits) + BigInt(1)).toString().padStart(digits.length, "0");
    digits = n;
  }
  const int = digits.slice(0, digits.length - d) || "0";
  const out = d > 0 ? `${int}.${digits.slice(digits.length - d)}` : int;
  return x < 0 && /[1-9]/.test(out) ? `-${out}` : out;
}

/* ───────────── detect.py ───────────── */

const SENT_RE = pyRegex("[^.!?\\n]+[.!?]*");
const WORD_RE = pyRegex("[A-Za-z']+");
const CONTRACTIONS = pyRegex("\\b\\w+'(?:s|t|re|ve|ll|d|m)\\b", { ignoreCase: true });
const PRONOUNS = pyRegex("\\b(i|me|my|mine|we|us|our|you|your)\\b", { ignoreCase: true });
const NUMBERS = pyRegex("\\b\\d[\\d,.]*%?\\b|\\$\\d");
const PROPER = pyRegex("(?<![.!?]\\s)(?<!^)\\b[A-Z][a-z]{2,}\\b", { multiline: true });
const BULLETS = pyRegex("(?m)^\\s*[-*•]\\s+(.+)$");
const CF = new RegExp("\\p{Cf}", "u");

export const CHECK_NAMES = ["BURSTINESS", "SPECIFICITY", "SLOP DENSITY", "FINGERPRINT", "VOICE"] as const;
export type CheckName = (typeof CHECK_NAMES)[number];
export type Check = { name: CheckName; score: number; detail: string };
export type Verdict = "PASS" | "REVIEW" | "FLAGGED";
export type Panel = {
  checks: Check[];
  overall: number;
  verdict: Verdict;
  /** the lowest check when the verdict is not PASS ("Weakest signal: X. Fix that first.") */
  weakest: CheckName | null;
  /** the lexicon entries found in the text, sorted, with their slop.json replacement */
  terms: { find: string; replace: string }[];
  /** the ids of the structural tells found */
  tells: string[];
};

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** Map value onto 0-100 where `human` -> 100 and `machine` -> 0. */
function scale(value: number, human: number, machine: number) {
  if (human === machine) return 50;
  return clamp(((value - machine) / (human - machine)) * 100);
}

function sentences(text: string): string[] {
  return all(SENT_RE, text)
    .map((m) => m[0])
    .filter((s) => pySplit(s).length > 2)
    .map((s) => s.trim());
}

const words = (text: string) => all(WORD_RE, text).map((m) => m[0]);

function checkBurstiness(text: string): [number, string] {
  const lens = sentences(text).map((s) => pySplit(s).length);
  if (lens.length < 4) return [50, "too short to judge"];
  const m = mean(lens);
  const cv = m ? pstdev(lens) / m : 0;
  return [scale(cv, 0.7, 0.22), `variation ${pyFixed(cv, 2)} across ${lens.length} sentences (want 0.55+)`];
}

function checkSpecificity(text: string): [number, string] {
  const w = words(text);
  if (w.length < 25) return [50, "too short to judge"];
  const per100 = 100 / w.length;
  const hits = count(NUMBERS, text) + new Set(all(PROPER, text).map((m) => m[0])).size;
  const density = hits * per100;
  return [scale(density, 6.0, 0.5), `${hits} concrete markers, ${pyFixed(density, 1)} per 100 words (want 4+)`];
}

type Entry = { find: string; replace: string };
const lexCache = new WeakMap<object, { entries: Entry[]; patterns: RegExp[]; structures: { id: string; re: RegExp }[] }>();

/**
 * detect.py's pattern for one lexicon entry is \b + re.escape(find) with spaces as \s+ + \b, case-insensitive. The
 * two \b are checked by hand in countEntry() instead of inside the pattern: a Unicode \b costs about 1.5 ms to compile
 * per pattern, and there are 113 of them.
 */
function entryPattern(find: string): RegExp {
  const escaped = find.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&").replace(/ /g, "\\s+");
  return pyRegex(escaped, { ignoreCase: true });
}

const WORD_CHAR = new RegExp(`[${PY_W}]`, "u");

/** Is there a word character (Python's \w) just before / at UTF-16 index `i`? */
function wordBefore(text: string, i: number): boolean {
  if (i <= 0) return false;
  const cp = text.codePointAt(i - 1)!;
  const start = cp >= 0xdc00 && cp <= 0xdfff && i >= 2 ? i - 2 : i - 1; // the low half of a pair: step back to its start
  return WORD_CHAR.test(String.fromCodePoint(text.codePointAt(start)!));
}
function wordAt(text: string, i: number): boolean {
  if (i >= text.length) return false;
  return WORD_CHAR.test(String.fromCodePoint(text.codePointAt(i)!));
}

/** Python's \b at UTF-16 index `i`: a word character on exactly one side. */
const boundary = (text: string, i: number) => wordBefore(text, i) !== wordAt(text, i);

/**
 * len(re.findall(r"\b" + core + r"\b", text)): scan left to right; a match whose two ends are not word boundaries is
 * dropped and the scan tries again one position later, as the regex engine would. The core of an entry is a literal
 * (with \s+ between words), so the match found at a position is the only one possible there.
 */
function countEntry(core: RegExp, text: string): number {
  let n = 0;
  core.lastIndex = 0;
  for (let m = core.exec(text); m; m = core.exec(text)) {
    const start = m.index;
    const end = start + m[0].length;
    if (m[0].length && boundary(text, start) && boundary(text, end)) {
      n += 1;
      core.lastIndex = end;
    } else {
      core.lastIndex = start + 1;
    }
  }
  return n;
}

function compiled(lex: Lexicon) {
  let c = lexCache.get(lex);
  if (!c) {
    const entries: Entry[] = [...lex.words, ...lex.phrases];
    const structures: { id: string; re: RegExp }[] = [];
    for (const s of lex.structures) {
      try {
        structures.push({ id: s.id, re: pyRegex(s.regex, { multiline: true }) });
      } catch {
        // detect.py skips a pattern it cannot compile
      }
    }
    c = { entries, patterns: entries.map((e) => entryPattern(e.find)), structures };
    lexCache.set(lex, c);
  }
  return c;
}

function checkSlop(text: string, lex: Lexicon): [number, string, Entry[]] {
  const w = words(text);
  if (!w.length) return [50, "empty", []];
  const { entries, patterns } = compiled(lex);
  let hits = 0;
  const found: Entry[] = [];
  entries.forEach((entry, i) => {
    const n = countEntry(patterns[i], text);
    if (n) {
      hits += n;
      found.push(entry);
    }
  });
  const density = (hits * 100) / w.length;
  const sorted = [...found].sort((a, b) => (a.find < b.find ? -1 : a.find > b.find ? 1 : 0));
  let detail = `${hits} stock terms, ${pyFixed(density, 1)} per 100 words`;
  if (found.length) detail += ` (${sorted.slice(0, 4).map((e) => e.find).join(", ")}${found.length > 4 ? ", ..." : ""})`;
  return [scale(density, 0.0, 4.0), detail, sorted];
}

function checkFingerprint(text: string): [number, string] {
  let invisible = 0;
  for (const c of text) if (CF.test(c)) invisible += 1;
  const em = countChar(text, "\u2014");
  const curly = ["\u2018", "\u2019", "\u201c", "\u201d"].reduce((sum, c) => sum + countChar(text, c), 0);
  const ellip = countChar(text, "\u2026");
  const nbsp = ["\u00a0", "\u202f", "\u2009"].reduce((sum, c) => sum + countChar(text, c), 0);
  const total = invisible * 4 + em * 2 + curly + ellip + nbsp;
  const per1k = (total * 1000) / Math.max(pyLen(text), 1);
  return [scale(per1k, 0.0, 12.0), `${invisible} invisible, ${em} em dash, ${curly} curly quote, ${ellip} ellipsis, ${nbsp} hard space`];
}

function checkVoice(text: string, lex: Lexicon): [number, string, string[]] {
  const w = words(text);
  if (w.length < 25) return [50, "too short to judge", []];
  const per100 = 100 / w.length;
  const contractions = count(CONTRACTIONS, text) * per100;
  const person = count(PRONOUNS, text) * per100;
  let tells = 0;
  const names: string[] = [];
  for (const s of compiled(lex).structures) {
    const n = count(s.re, text);
    if (n) {
      tells += n;
      names.push(s.id);
    }
  }
  const bullets = all(BULLETS, text).map((m) => pySplit(m[1]).length);
  const uniform = bullets.length >= 3 && pstdev(bullets) < 1.6;
  let score = scale(contractions, 3.0, 0.0) * 0.35 + scale(person, 8.0, 1.0) * 0.35 + clamp(100 - tells * 22) * 0.3;
  if (uniform) {
    score -= 12;
    names.push("uniform-bullets");
  }
  let detail = `${pyFixed(contractions, 1)} contractions, ${pyFixed(person, 1)} personal pronouns per 100 words, ${tells} structural tell(s)`;
  if (names.length) detail += ` [${names.slice(0, 4).join(", ")}]`;
  return [clamp(score), detail, names];
}

/** detect.py's run(): the five checks, then the verdict. The weakest check carries 40% of the score. */
export function detect(text: string, lex: Lexicon): Panel {
  const burst = checkBurstiness(text);
  const spec = checkSpecificity(text);
  const slop = checkSlop(text, lex);
  const finger = checkFingerprint(text);
  const voice = checkVoice(text, lex);
  const checks: Check[] = [
    { name: "BURSTINESS", score: burst[0], detail: burst[1] },
    { name: "SPECIFICITY", score: spec[0], detail: spec[1] },
    { name: "SLOP DENSITY", score: slop[0], detail: slop[1] },
    { name: "FINGERPRINT", score: finger[0], detail: finger[1] },
    { name: "VOICE", score: voice[0], detail: voice[1] },
  ];
  const scores = checks.map((c) => c.score);
  const low = Math.min(...scores);
  const overall = mean(scores) * 0.6 + low * 0.4;
  const verdict: Verdict = overall >= 70 && low >= 55 ? "PASS" : overall >= 50 ? "REVIEW" : "FLAGGED";
  // Python's min() keeps the first of equal scores
  const weakest = verdict === "PASS" ? null : checks.reduce((best, c) => (c.score < best.score ? c : best), checks[0]).name;
  return {
    checks,
    overall,
    verdict,
    weakest,
    terms: slop[2].map((e) => ({ find: e.find, replace: e.replace })),
    tells: voice[2],
  };
}

/** detect.py's bar(): 24 cells, '#' for the filled part. */
export function bar(score: number, width = 24): string {
  const filled = Number(pyFixed((score / 100) * width, 0));
  return "#".repeat(filled) + ".".repeat(width - filled);
}

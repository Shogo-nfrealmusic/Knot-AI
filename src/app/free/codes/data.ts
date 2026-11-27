// /free/80 (five codes to put in front of a Claude prompt): the page's facts, with no React in them so they can be tested (data.test.mjs).
// `does` is the reel's wording. The example chats are the ones shown in the reel, word for word (lines may be shortened, never reworded).
// ultrathink is the one official keyword (Claude Code docs, copied in sources.ts); the other four are prefixes you type yourself.

export type CodeId = "l99" | "ooda" | "ghost" | "scaffold" | "ultrathink";

export type SecretCode = {
  id: CodeId;
  /** what you type, as the reel writes it */
  code: string;
  /** a few words under the name (this page's) */
  tag: string;
  /** what it does, in the reel's words */
  does: string;
  /** the ready prompt to copy: the reel's example question, starting with the code */
  prompt: string;
  /** the example answer, one entry per line; **bold** is the only markup */
  answer: string[];
  /** /ghost only: the AI phrases it cuts before the email is left */
  cut?: string[];
  /** listed in Claude Code's own docs */
  official: boolean;
  /** the official line, for ultrathink */
  source?: { quote: string; href: string; label: string };
};

export const ULTRATHINK_DOC = "https://code.claude.com/docs/en/model-config";
export const ULTRATHINK_QUOTE = "Include `ultrathink` anywhere in your prompt to request deeper reasoning on that turn";

export const OFFICIAL_NOTE = "ultrathink is an official Claude Code keyword; the other four are prompt prefixes you type yourself.";

export const CODES: SecretCode[] = [
  {
    id: "l99",
    code: "L99",
    tag: "A straight answer",
    does: "Put it before your prompt. Claude stops beating around the bush and gives you a real, committed answer instead of “it depends”.",
    prompt: "L99 how do I start implementing AI in my business?",
    answer: [
      "**Start with speed-to-lead automation. That's it.**",
      "Here's exactly what to do:",
      "**Week 1:** Time how long a new lead waits for your first reply.",
      "**Week 2:** An AI responder answers every lead in 60 seconds.",
      "**Week 3:** Send it the leads you missed last month.",
    ],
    official: false,
  },
  {
    id: "ooda",
    code: "OODA",
    tag: "Observe, Orient, Decide, Act",
    does: "Claude analyzes your situation with the military decision framework, Observe, Orient, Decide, Act: what to observe, what to focus on, what to decide and what actions to take.",
    prompt: "OODA what's the best AI automation for my business right now?",
    answer: [
      "Got it. Here's the OODA:",
      "**Observe** — Leads come in by DM, email and your form. Half wait 4+ hours for a reply.",
      "**Orient** — Your bottleneck is follow-up, not traffic.",
      "**Decide** — The single highest-ROI automation for you: **automated lead follow-up.**",
      "**Act** — Build it in this order: new lead → AI qualifies it → personal follow-up in 60 s.",
    ],
    official: false,
  },
  {
    id: "ghost",
    code: "/ghost",
    tag: "Sounds like a person",
    does: "Strips out the AI-sounding stuff, so the output reads like a human wrote it.",
    prompt: "/ghost write me a short outreach email",
    cut: ["I hope this email finds you well.", "delve", "—", "In today's fast-paced world,", "leverage"],
    answer: [
      "Hey Sam,",
      "Your booking page closes at 6pm. That's probably costing you a few bookings a week.",
      "We built an after-hours assistant for a studio nearby. It booked 23 extra sessions in month one.",
      "Worth a quick call next week?",
    ],
    official: false,
  },
  {
    id: "scaffold",
    code: "Scaffold",
    tag: "The whole plan",
    does: "Use it before any project or task: Claude gives you a full action plan with every step mapped out.",
    prompt: "scaffold an AI automation agency",
    answer: [
      "Got it. Here's the full plan, step by step.",
      "**Step 1: Positioning** — Pick one niche you can reach this week.",
      "**Step 2: Offer** — One automation, one price, one result.",
      "**Step 3: Build** — A demo you can show in 5 minutes.",
      "**Step 4: Sales** — 20 personal messages a day.",
      "**Step 5: Delivery** — Kickoff, build, hand over in 14 days.",
    ],
    official: false,
  },
  {
    id: "ultrathink",
    code: "ultrathink",
    tag: "Maximum reasoning",
    does: "Maximum reasoning mode: Claude thinks much deeper before it answers.",
    prompt: "ultrathink a high-level AI automation plan for a 2-person company",
    answer: [
      "**High-Level AI Automation Plan**",
      "1. Capture every lead in one inbox.",
      "2. AI qualifies and replies in 60 s.",
      "3. Booking, invoice and follow-up run on their own.",
      "4. You two only take the calls that close.",
    ],
    official: true,
    source: { quote: ULTRATHINK_QUOTE, href: ULTRATHINK_DOC, label: "Claude Code docs, Model configuration" },
  },
];

export function codeFor(id: string): SecretCode | undefined {
  return CODES.find((c) => c.id === id);
}

/** The figure kinds the page uses, in order: the chat with every code, then one card per code. */
export const CODES_KINDS = ["chat", "l99", "ooda", "ghost", "scaffold", "ultrathink"] as const;

export type Segment = { text: string; bold: boolean };

/** Splits a line on **bold** markers. */
export function segments(line: string): Segment[] {
  return line
    .split("**")
    .map((text, i) => ({ text, bold: i % 2 === 1 }))
    .filter((s) => s.text.length > 0);
}

/** How many characters the answer shows, markup left out. */
export function answerChars(lines: string[]): number {
  return lines.reduce((sum, line) => sum + segments(line).reduce((n, s) => n + s.text.length, 0), 0);
}

/** The first `n` characters of the answer, as lines of segments (for streaming it in). */
export function sliceLines(lines: string[], n: number): Segment[][] {
  const out: Segment[][] = [];
  let left = n;
  for (const line of lines) {
    if (left <= 0) break;
    const row: Segment[] = [];
    for (const s of segments(line)) {
      if (left <= 0) break;
      const text = s.text.slice(0, left);
      row.push({ text, bold: s.bold });
      left -= text.length;
    }
    out.push(row);
  }
  return out;
}

const TYPE_MS = 28; // per character of the prompt
const THINK_MS = 700;
const DEEP_THINK_MS = 1800; // ultrathink takes visibly longer
const STREAM_MS = 14; // per character of the answer
const CUT_MS = 380; // per phrase /ghost cuts

/** When the prompt is typed, when the thinking ends, and when the answer is in (ms from the start). */
export function timeline(c: SecretCode): { typed: number; thought: number; total: number } {
  const typed = 300 + c.prompt.length * TYPE_MS;
  const thought = typed + (c.official ? DEEP_THINK_MS : THINK_MS) + (c.cut?.length ?? 0) * CUT_MS;
  const total = thought + answerChars(c.answer) * STREAM_MS;
  return { typed, thought, total };
}

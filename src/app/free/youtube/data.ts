// /free/66 (the YouTube agent skill): the page's facts, with no React in them so they can be tested (data.test.mjs).
// Everything here is from the README of https://github.com/Jakeschincariol/youtube-agent-skill (MIT) and the SKILL.md of
// /yt-script and /yt-viral, read 2026-11-14. `want` is this page's own short label for the job; `does` is the README's line.

export const REPO = "https://github.com/Jakeschincariol/youtube-agent-skill";

export type InstallWay = { id: "claude" | "code" | "plugin"; tab: string; label: string; body: string; after: string };

/** The README's three ways to install, word for word. */
export const INSTALL: InstallWay[] = [
  {
    id: "claude",
    tab: "Paste into Claude",
    label: "Paste this into Claude",
    body: `${REPO}\n\nInstall this skill, then confirm /yt-script works.`,
    after: "Claude reads the repo, installs the skills and checks that /yt-script answers.",
  },
  {
    id: "code",
    tab: "Claude Code",
    label: "Or do it yourself, in Claude Code",
    body: `git clone ${REPO}.git\ncp -r youtube-agent-skill/skills/yt-* ~/.claude/skills/`,
    after: "Global install. For one project only, copy the same folders into your repo's .claude/skills/ instead.",
  },
  {
    id: "plugin",
    tab: "Plugin",
    label: "Or as a plugin",
    body: "/plugin marketplace add Jakeschincariol/youtube-agent-skill\n/plugin install youtube-agent",
    after: "Two commands inside Claude Code.",
  },
];

export type Command = {
  id: string;
  command: string;
  /** the job, in the visitor's words (this page's label) */
  want: string;
  /** the README's "what it does", word for word */
  does: string;
  /** the Python tool behind it, when the README lists one */
  tool?: { file: string; run: string; note: string };
  /** "What to hand back" from the skill's own SKILL.md, when we have read it */
  handsBack?: string[];
};

/** The eleven, in the README's order. */
export const COMMANDS: Command[] = [
  {
    id: "script",
    command: "/yt-script",
    want: "Write the script",
    does: "One idea into a script. Five hooks off 21 formulas, scored, then the spoken script with the retention beats marked.",
    tool: { file: "hookscore.py", run: 'python3 skills/yt-script/hookscore.py --hook "one line"', note: "5-property hook panel" },
    handsBack: [
      "the two best hooks with their scored panels",
      "the script, beat by beat, with [ON SCREEN: ...] on every beat",
      "the runtime estimate at 150 words per minute",
      "one line naming which formula the winning hook used and why it fits this idea",
    ],
  },
  {
    id: "package",
    command: "/yt-package",
    want: "Title and thumbnail",
    does: "Title and thumbnail as one pairing, linted for truncation, duplication and vagueness.",
    tool: { file: "title.py", run: 'python3 skills/yt-package/title.py --title "..." --thumb "..."', note: "title + thumbnail linter" },
  },
  {
    id: "edit",
    command: "/yt-edit",
    want: "Cut the edit",
    does: "A transcript into an edit decision list: dead air, filler cues, retakes, with timecodes.",
    tool: { file: "deadair.py", run: "python3 skills/yt-edit/deadair.py transcript.srt", note: "edit decision list" },
  },
  {
    id: "comment",
    command: "/yt-comment",
    want: "Answer the comments",
    does: "The comment section triaged into four piles, then replies in your voice. Says which one to pin.",
  },
  {
    id: "plan",
    command: "/yt-plan",
    want: "Plan the week",
    does: "A week that fits the hours you actually have. One anchor, one cheap one, three Shorts.",
  },
  {
    id: "viral",
    command: "/yt-viral",
    want: "Find what works in my niche",
    does: "What is working in your niche, ranked by multiple over each channel's own median.",
    tool: { file: "swipe.py", run: "python3 skills/yt-viral/swipe.py collected.json --min 2.0", note: "outliers by own-channel multiple" },
    handsBack: [
      "the top five with their multiples",
      "the formula each used",
      "the ONE structural thing they share",
      "which of those you could actually make this week, in your voice, with what you have",
    ],
  },
  {
    id: "retention",
    command: "/yt-retention",
    want: "See where viewers leave",
    does: "Your retention export read properly: hook leak, the cliffs, the slide, and what to change.",
    tool: { file: "retention.py", run: "python3 skills/yt-retention/retention.py retention.csv", note: "where they left, and why" },
  },
  {
    id: "shorts",
    command: "/yt-shorts",
    want: "Pull Shorts from a long video",
    does: "The Shorts already inside a long video, with a new first line written for each.",
  },
  {
    id: "seo",
    command: "/yt-seo",
    want: "Description and tags",
    does: "The description, the tags that are worth having, and the three queries this should win.",
  },
  {
    id: "chapters",
    command: "/yt-chapters",
    want: "Add chapters",
    does: "Chapters from a transcript, validated against YouTube's own rules so they render.",
    tool: { file: "chapters.py", run: "python3 skills/yt-chapters/chapters.py transcript.srt", note: "validated chapters" },
  },
  {
    id: "audit",
    command: "/yt-audit",
    want: "Audit the whole channel",
    does: "The whole channel, ending in ONE fix rather than twenty.",
  },
];

export function commandFor(id: string): Command | undefined {
  return COMMANDS.find((c) => c.id === id);
}

/** voice.md: the README's two ways to make it, and where it lives. */
export const VOICE = {
  path: "~/.claude/youtube/voice.md",
  template: "templates/voice.md",
  ask: "write my voice.md from these",
  /** what the file holds, in /yt-script's words */
  holds: ["how they talk on camera", "the words they never use", "who they are talking to", "what they will not claim"],
};

/** "The fine print" of the README, cut short. `quote` is the README's own bold line. */
export const FINE_PRINT: { id: string; quote: string; plain: string }[] = [
  {
    id: "publish",
    quote: "It does not publish.",
    plain: "Every skill ends in a block you copy and a question: ship it, or change it? These skills write. You upload.",
  },
  {
    id: "score",
    quote: "hookscore.py is a heuristic, not a predictor.",
    plain: "A low score is a reason to look again; a high score is not a promise.",
  },
  {
    id: "formula",
    quote: "The formula classifier is about the words, not the result.",
    plain: "When /yt-viral names a formula, that is a judgement about the title you can see, not a claim about why the video got its views.",
  },
  {
    id: "read",
    quote: "/yt-viral reads, it does not scrape.",
    plain: "Public listings only. It never logs in as you and never touches your credentials.",
  },
  {
    id: "tags",
    quote: "Tags barely matter",
    plain: "and the pack says so instead of selling you a tag generator.",
  },
  {
    id: "numbers",
    quote: "Nothing invents a number.",
    plain: "If a skill wants a figure it does not have, it asks you for it or writes the line without it.",
  },
];

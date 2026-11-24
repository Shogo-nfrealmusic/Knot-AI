// /free/77 (The LinkedIn agent skill): the page's facts, with no React in them so they can be tested (data.test.mjs).
// Everything quoted here is from https://github.com/Jakeschincariol/linkedin-agent-skill (MIT, by Jake Schincariol):
// README.md and templates/voice.md. The repo's three data files (slop.json, hooks.json, rubric.json) are in source.ts,
// and detect.py's five checks are ported in detect.ts.
// `label`, RUBRIC_LABELS and FIGURES are this page's own words; `does`, `text`, `where`, `body`, `measures` and the
// voice.md lines are the repo's.

/** One figure per chapter of the page, in order. */
export const LINKEDIN_KINDS = ["eleven", "install", "humanizer", "profile", "fineprint"] as const;
export type LinkedinDemoKind = (typeof LINKEDIN_KINDS)[number];

export const REPO = "https://github.com/Jakeschincariol/linkedin-agent-skill";
export const AUTHOR = { name: "Jake Schincariol", href: "https://opusjake.ai" };
export const WRITE_UP = "https://opusjake.ai/r/linkedin-agent";

/** README, opening: the line in bold. */
export const TAGLINE = "Nothing gets posted until you say yes. These skills write. You post.";

export type Skill = { command: string; does: string };

/** README, The eleven: the table, in its order (Markdown links and code marks removed). */
export const SKILLS: Skill[] = [
  { command: "/li-post", does: "One idea into a post. Three hook options from 21 formulas, one full draft, humanized before you see it." },
  { command: "/li-comment", does: "Comments on other people's posts. Nine types, picked by what the post actually is. Never \"Great post!\"." },
  { command: "/li-reply", does: "The thread under your own post. Sorts every comment into lead / substance / peer / support / noise, then writes in that order." },
  { command: "/li-profile", does: "Scores your profile against a 12-part rubric out of 100, then rewrites in fix-first order." },
  { command: "/li-plan", does: "The week. What to post, when to post it, and the 10 people to engage with. Writes ~/.claude/linkedin/plan.md." },
  { command: "/li-human", does: "The humanizer. Two scripts that actually run. See below." },
  { command: "/li-carousel", does: "Document posts. Slide-by-slide copy, the cover that earns the swipe, and the PDF to upload." },
  { command: "/li-repurpose", does: "One video, newsletter or transcript into a week of posts that each stand alone." },
  { command: "/li-dm", does: "The 200-character invite note, the first message, and the two follow-ups. Two." },
  { command: "/li-inbox", does: "Triages the inbox into lead / recruiter / peer / ask / spam, and tells you which tell gave the sequence away." },
  { command: "/li-audit", does: "Post-mortem on what you have already published. Ranks by engagement rate and reach multiple, not impressions." },
];

export type InstallRoute = { id: "paste" | "clone" | "plugin"; label: string; where: string; app: string; text: string };

/** README, Install: the three ways, verbatim, in its order. `where` is the README's line above each block. */
export const INSTALL: InstallRoute[] = [
  {
    id: "paste",
    label: "Paste into Claude",
    where: "Paste this into Claude:",
    app: "Claude",
    text: "https://github.com/Jakeschincariol/linkedin-agent-skill\n\nInstall this skill, then confirm /li-post works.",
  },
  {
    id: "clone",
    label: "git clone + cp",
    where: "Or do it yourself, in Claude Code:",
    app: "terminal",
    text: "git clone https://github.com/Jakeschincariol/linkedin-agent-skill.git\ncp -r linkedin-agent-skill/skills/li-* ~/.claude/skills/",
  },
  {
    id: "plugin",
    label: "Plugin",
    where: "Or as a plugin:",
    app: "Claude Code",
    text: "/plugin marketplace add Jakeschincariol/linkedin-agent-skill\n/plugin install linkedin-agent",
  },
];

/** README, Install: the paragraph after the three routes. */
export const INSTALL_NOTE =
  "Project-local instead of global: copy the same folders into your repo's .claude/skills/. No Claude Code at all? Paste any single SKILL.md at the top of a chat and it runs as a mode - you lose the two Python tools, which is most of the point of /li-human, but the rest works.";

/** README, Install: the voice.md step, and the two things in it you can copy. */
export const VOICE = {
  step: "Then spend ten minutes on templates/voice.md. Copy it to ~/.claude/linkedin/voice.md and fill it in, or paste three of your own posts into Claude and say \"write my voice.md from these\". Every skill reads that file. Skip it and everything comes out sounding like everyone else.",
  template: "templates/voice.md",
  path: "~/.claude/linkedin/voice.md",
  prompt: "write my voice.md from these",
};

/** templates/voice.md: its five sections and the fields in each, verbatim (bold and colons removed). */
export const VOICE_SECTIONS: { title: string; fields: string[]; note?: string }[] = [
  { title: "Who I am", fields: ["Name", "What I do, in one sentence", "Who I am writing for", "What I sell"] },
  {
    title: "What I sound like",
    fields: ["Three of my own posts that sound most like me", "Words I actually use", "Words I would never use", "Sentence length", "Do I swear", "Emoji", "Contractions"],
  },
  { title: "My positions", fields: [], note: "Three to five things I believe that some of my audience does not. These are where the good posts come from." },
  { title: "Off limits", fields: ["Topics I do not post about", "Clients or numbers I cannot name publicly", "Claims I am not allowed to make"] },
  {
    title: "Proof I can use",
    fields: [],
    note: "Real numbers, outcomes and stories I am happy to put my name on. The skills will never invent one, so if this section is empty, every draft comes back with {{your number}} in it.",
  },
];

/** README, The humanizer: the five checks table. `label` is this page's short name for each. */
export const CHECKS = [
  { name: "BURSTINESS", label: "sentence length", measures: "sentence-length variation. Models write even." },
  { name: "SPECIFICITY", label: "concrete detail", measures: "numbers, names and concrete markers per 100 words" },
  { name: "SLOP DENSITY", label: "stock words", measures: "lexicon hits per 100 words" },
  { name: "FINGERPRINT", label: "hidden characters", measures: "invisible characters, em dashes, curly quotes per 1,000" },
  { name: "VOICE", label: "how a person writes", measures: "contractions, person, structural tells" },
] as const;

/** README: "The verdict weights the mean at 60% and the weakest single check at 40%, because a detector only needs one signal to fire." */
export const VERDICT_RULE = "The verdict weights the mean at 60% and the weakest single check at 40%, because a detector only needs one signal to fire.";

/**
 * The two texts the humanizer figure opens on. `draft` is the draft from the reel; detect.py scores it 15.0 FLAGGED.
 * `after` is what the repo's humanize.py makes of it (checked byte for byte); detect.py scores that 38.8 FLAGGED.
 */
export const SAMPLES = {
  draft: {
    label: "draft.txt",
    text: "In today’s fast-paced world, we lost our biggest client — and it was a true game-changer.\n\nLet that sink in.\n\nI want to delve into what it taught me about leveraging feedback, building robust systems, and creating seamless experiences for every customer.\n\nIt’s not just about winning deals — it’s about building trust.\n\nHere’s what I learned this week about hiring.\n",
  },
  after: {
    label: "after humanize.py",
    text: "Right now, we lost our biggest client, and it was a true big deal.\n\nI want to look at what it taught me about using feedback, building solid systems, and creating clean experiences for every customer.\n\nIt's not just about winning deals, it's about building trust.\n\nHere's what I learned this week about hiring.\n",
  },
};

/** This page's short names for rubric.json's twelve ids (the first five follow li-profile's SKILL.md example table). */
export const RUBRIC_LABELS: Record<string, string> = {
  headline: "Headline",
  about_open: "About, first 2 lines",
  about_body: "About body",
  featured: "Featured",
  banner: "Banner",
  photo: "Photo",
  current_role: "Current role",
  experience_depth: "Experience depth",
  skills: "Skills",
  recommendations: "Recommendations",
  activity: "Activity",
  contact: "Contact",
};

type RubricItem = { id: string; points: number; full_marks: string };

/** The score: the points of every item at full marks. */
export function profileTotal(items: RubricItem[], full: Record<string, boolean>): number {
  return items.reduce((sum, item) => sum + (full[item.id] ? item.points : 0), 0);
}

/** li-profile SKILL.md: "Fix in descending order of points lost." Ties keep the rubric's order. */
export function fixFirst(items: RubricItem[], full: Record<string, boolean>): RubricItem[] {
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !full[item.id])
    .sort((a, b) => b.item.points - a.item.points || a.index - b.index)
    .map(({ item }) => item);
}

/** README, The fine print, which is the honest part: its four paragraphs, verbatim (Markdown marks removed). */
export const FINE_PRINT: { id: string; title: string; body: string }[] = [
  {
    id: "post",
    title: "These skills do not post to LinkedIn, and they should not.",
    body: "There is no official API for posting to a personal profile without an approved partner app, and automating the site with a browser or a third-party tool violates LinkedIn's User Agreement and gets accounts restricted. So every skill here ends the same way: a copy-ready block, and you paste it. That is not a limitation bolted on afterwards, it is the design. It is also why the approval gate is real rather than a setting.",
  },
  {
    id: "checks",
    title: "The five checks are local heuristics, not detector APIs.",
    body: "They are modelled on the signals public detectors key on, and they run entirely on your machine. They are not GPTZero, Originality, Copyleaks, Winston or Turnitin, they do not call those services, and they cannot promise those verdicts. Fixing what they measure tends to move those numbers, because they are measuring the same underlying things. That is the whole claim. Nobody can honestly sell you \"undetectable\", and anybody who does is selling you something.",
  },
  {
    id: "invisible",
    title: "The invisible-character pass is real and it is narrow.",
    body: "It removes the zero-width and format characters that end up in generated text and survive a copy-paste. That is a genuine, checkable fingerprint. It is not a claim about defeating a cryptographic watermarking scheme, and this repo does not make one.",
  },
  {
    id: "fabricate",
    title: "Nothing here fabricates.",
    body: "No invented metrics, clients or outcomes go under your name. If a draft needs a number you have not given, it comes back with {{your number}} in it and a flag, every time.",
  },
];

export const USER_AGREEMENT = "https://www.linkedin.com/legal/user-agreement";

/** This page's titles, subtitles and captions for the five figures (kept here so the copy can be tested). */
export const FIGURES: Record<LinkedinDemoKind, { title: string; sub: string; caption: string }> = {
  eleven: {
    title: "Eleven skills, one voice file",
    sub: "tap a skill · read its line",
    caption:
      "Every skill reads voice.md, so the lines grow out of it. The eleven lines are the README's, word for word. Under /li-post are the 21 hook formulas it picks from, as hooks.json writes them.",
  },
  install: {
    title: "Install it",
    sub: "pick a route · copy the lines",
    caption: "The lines are the README's, verbatim. The dark panel is a drawing, not a screenshot. The two Python tools need no packages.",
  },
  humanizer: {
    title: "Score a draft, five checks",
    sub: "paste your own text · watch the five bars",
    caption:
      "A TypeScript copy of detect.py, run in your browser on the repo's own slop.json. On draft.txt it prints what the Python script prints: 15.0, FLAGGED. Nothing you type leaves this page.",
  },
  profile: {
    title: "The 100-point profile score",
    sub: "tick what is at full marks · see the total",
    caption:
      "Twelve items from rubric.json, 100 points in all. The order to fix things is li-profile's: the most points lost first. Here you do the ticking; the skill scores each item from the profile you paste.",
  },
  fineprint: {
    title: "It writes. You post.",
    sub: "say yes · copy the block · paste it yourself",
    caption: "There is no line from the skills to LinkedIn. Each one ends with a copy-ready block, and the four paragraphs below are the README's, verbatim.",
  },
};

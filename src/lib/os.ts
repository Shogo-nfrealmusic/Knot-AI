// Copilot OS (/os) and the Operators waitlist (/club).
// Decided 2026-11-21: one paid tier at $49 ($29 for the first 20 buyers), Founding Operator stays $299.
// The copy below is the sales page v3, word for word. Change the source draft first, then this file.

/* ───────────── the three things to fill in on the Kit side ───────────── */

// The Kit Commerce product page for Copilot OS. While this is empty, every buy button on /os turns into the
// "tell me when the $29 opens" email form. Paste the product URL here once the product exists.
export const OS_CHECKOUT_URL = "";

// Kit embed forms, the same kind /free uses for the Starter (STARTER_FORM in free.ts). Each list has its own
// form so Kit can tell the two apart: who wants the $29 launch email, and who is waiting for Operators.
// While a uid is empty the page shows the form's shape, switched off, instead of sending people to the wrong list.
export type KitForm = { uid: string; script: string };
export const OS_NOTIFY_FORM: KitForm = { uid: "", script: "" };
export const CLUB_FORM: KitForm = { uid: "", script: "" };

export type BuyState = { mode: "buy"; href: string } | { mode: "notify" };

/** Buy button or notify form: only an https checkout URL counts as "on sale". */
export function buyState(url: string): BuyState {
  const href = url.trim();
  return href.startsWith("https://") ? { mode: "buy", href } : { mode: "notify" };
}

export function formReady(form: KitForm) {
  return form.uid.trim() !== "" && form.script.trim() !== "";
}

/* ───────────── /os copy ───────────── */

export const STARTER_HREF = "/free/starter";

export const HERO = {
  name: "Copilot OS",
  title: "The exact Claude Code setup behind",
  accent: "a six-figure company run by two people.",
  lines: [
    "I study law. I don't have a CS degree.",
    "Two of us run a company that made $130K+ in the last 12 months. Zero outside funding.",
    "Claude Code does the work a team would do. This is the whole setup, file by file.",
  ],
  primary: "Get the free Starter",
  secondary: "See what's inside",
};

export const STORY = {
  title: "I didn't start a company to change the world.",
  accent: "I wanted money.",
  blocks: [
    ["Two years ago I couldn't code.", "I didn't wait until I understood everything. I started, broke things, and fixed them."],
    [
      "Today Claude Code closes our books every month, drafts our content overnight, runs our research, and logs every decision the company makes.",
      "I approve. It works.",
    ],
    ["People tell me this isn't real engineering.", "Yes, you need the basics. No, you don't need four years."],
  ],
};

/** One row of the "Job / Before / Now" table, with the real screen that shows it. */
export type Job = { job: string; before: string; now: string; screen: Screen };
export type Screen = { src: string; width: number; height: number; alt: string };

export const JOBS_HEAD = { title: "What Claude Code does", accent: "in my company", columns: ["Job", "Before", "Now"] };

export const JOBS: Job[] = [
  {
    job: "Month-end books",
    before: "20 hours a week",
    now: "Claude drafts every entry. I approve and answer one question.",
    screen: { src: "/os/07-monthly-close.webp", width: 1591, height: 1205, alt: "A terminal showing the hook that starts the monthly close and the first lines of the written procedure." },
  },
  {
    job: "Content",
    before: "Edited by hand",
    now: "Drafted overnight. I pick.",
    screen: { src: "/os/11-reel-scoring.webp", width: 1591, height: 776, alt: "A terminal showing the nightly short-video schedule and the scores Claude gave one video's frames." },
  },
  {
    job: "Research and analysis",
    before: "Me, a browser and forty tabs",
    now: "A researcher agent with sources, then a second agent that checks it.",
    screen: { src: "/os/16-verifier-report.webp", width: 1591, height: 659, alt: "A terminal showing a verifier agent's report: five claims from a draft, each marked FAIL with the source that contradicts it." },
  },
  {
    job: "Decisions",
    before: "In my head",
    now: "Written down the moment they are made. Claude reads them before it acts.",
    screen: { src: "/os/10-decision.webp", width: 1591, height: 659, alt: "A terminal showing a dated decision note and the line in CLAUDE.md that links to it." },
  },
];

export const JOBS_NOTE = "Every screen in this product is from the real company. Nothing is a demo.";

export const TEAM_SCREEN: Screen = {
  src: "/os/03-agents.webp",
  width: 1591,
  height: 1712,
  alt: "A terminal listing five agent files (analyst, engineer, marketer, researcher, secretary) and the full text of the researcher.",
};

export const GUARD_SCREEN: Screen = {
  src: "/os/01-guard-tests.webp",
  width: 1591,
  height: 737,
  alt: "A terminal showing the security guard's test suite passing 98 of 98 and two risky commands being denied by a hook.",
};

export const INSIDE = {
  title: "What you get",
  parts: [
    { name: "The files.", text: "The same agents, hooks, templates and CLAUDE.md I run. Drop them into your own setup." },
    { name: "The guide (8 modules).", text: "How each part works and how to make it yours." },
  ],
};

export const MODULES: { name: string; text: string }[] = [
  { name: "Start here.", text: "Never opened a terminal? Thirty minutes from nothing to your first real job done." },
  { name: "Module 0. Where you are.", text: "20 questions. Tells you where to start. (Free)" },
  { name: "Module 1A. A second brain.", text: "Claude remembers your business so you stop explaining it every morning." },
  { name: "Module 1. Memory that compounds.", text: "It makes a mistake once. Never twice." },
  {
    name: "Module 2. Never let AI grade its own work.",
    text: "One agent writes. Another one tries to break it. This is the part I trust least, so it's the part I built hardest.",
  },
  { name: "Module 3. It works while you sleep.", text: "Scheduled runs, parallel work, and what it costs." },
  { name: "Module 4. Locks, not promises.", text: "Payments, deploys and secrets need your yes. Enforced by rules, not by hoping." },
  { name: "Module 5. The company.", text: "Research, analytics, bookkeeping and content at my company. Real screens, real numbers, real failures." },
  { name: "Module 6. Your own OS.", text: "Put it together and keep it running." },
];

export type OsPlan = { id: "starter" | "os" | "founding"; name: string; price: string; includes: string[] };

const ROW = {
  starter: "Module 0 and the starter CLAUDE.md",
  files: "Start here, Modules 1A and 1 to 6, and every file",
  company: "Module 5: how my company runs",
  call: "60-minute call to build yours together, 30 days of questions",
};

export const PRICING_TITLE = "Pricing";

// The pricing table, read down each column: a plan lists the rows the table ticks for it.
export const PLANS: OsPlan[] = [
  { id: "starter", name: "Starter", price: "Free", includes: [ROW.starter] },
  { id: "os", name: "Copilot OS", price: "$49", includes: [ROW.starter, ROW.files, ROW.company] },
  { id: "founding", name: "Founding Operator", price: "$299", includes: [ROW.starter, ROW.files, ROW.company, ROW.call] },
];

export const PRICING_NOTES = {
  early: { before: "First 20 buyers get it for ", price: "$29", after: "." },
  founding: { before: "Founding Operator: ", strong: "5 seats. Closes at the end of 2026." },
  setup: { before: "Want me to build it for you instead? → ", link: "Copilot OS Setup", href: "/setup" },
};

export const FOR = {
  title: "Who this is for",
  items: [
    "You are not an engineer, and you want AI to do real work in your business or the one you are about to start",
    "You would rather copy a setup that already makes money than design one from zero",
    "You are done thinking about it",
  ],
};

export const NOT_FOR = {
  title: "Who this is not for",
  items: ["You want a prompt pack", "You want to argue about whether this counts as real engineering"],
};

export const FAQ_TITLE = "FAQ";

export const FAQ: { q: string; a: string }[] = [
  {
    q: "I can't code. Is this for me?",
    a: "I couldn't either. You need a paid Claude plan and the patience to follow steps. Start with the free Starter. If it makes no sense, you lost nothing.",
  },
  {
    q: "Can't I find this for free?",
    a: "The features, yes. Anthropic's own courses are free and good, and I link them. What you won't find is one complete setup that runs a real company, with the files.",
  },
  { q: "Does it work on Windows?", a: "Yes, with WSL2. The hooks need Python 3." },
  {
    q: "Refunds",
    a: "The Starter is free so you can judge before you pay. Purchases are non-refundable, except for broken files or duplicate purchases.",
  },
];

export const DISCLAIMER = "Copilot OS is a set of configuration files and written guides. It does not provide access to any AI service.";

// Not in the sales draft: the words the buttons and the notify form need. Kept in one place so they are easy to change.
export const OS_UI = {
  buy: "Buy Copilot OS",
  notifyButton: "Tell me when the $29 opens",
  notifyTitle: "Copilot OS is not on sale yet.",
  notifyText: "Leave your email and I'll write once, when the first 20 can buy it for $29.",
  founding: "Ask about a Founding Operator seat",
  foundingHref: "/contact",
};

/* ───────────── /club copy ───────────── */

export const CLUB = {
  name: "Operators",
  title: "Build a business that runs on AI.",
  accent: "With people doing the same thing.",
  intro: [
    "I'm a law student with no CS degree. Two of us run a six-figure company on Claude Code with zero funding.",
    "I'm opening a small room for people who want to do the same: not engineers, not waiting for permission, building something that makes money.",
  ],
  insideTitle: "Inside, when it opens:",
  inside: [
    "Every setup I add to my company, the week I add it. Files included.",
    "One build a week you can copy into your own business.",
    "My numbers. What worked, what cost money, what I killed.",
    "A place to ask, where the answer comes from people running real things.",
  ],
  closed: { strong: "It is not open yet.", rest: " Join the list and you get in first, at the first price." },
  email: "Email",
  button: "Join the list",
  question: { before: "One question when you join (optional): ", strong: "What are you trying to build?" },
  footnote: "No spam. One email when it opens.",
};

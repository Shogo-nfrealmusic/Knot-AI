// Free tools from the @copilot_shogo reels. One "drop" per reel.
// Slugs are numbered ("02-claude-design-tools") so they never collide as reels pile up;
// /free/02 redirects to the full slug, which is what the DMs link to.

export type ToolIcon =
  | "palette"
  | "wand"
  | "browser"
  | "file"
  | "cube"
  | "plug"
  | "cpu"
  | "scissors"
  | "review"
  | "brain"
  | "notebook"
  | "store"
  | "council"
  | "legal";

export type FreeTool = {
  name: string;
  what: string;
  href: string;
  icon: ToolIcon;
  /** commands to paste, one per copy line (e.g. Claude Code /plugin commands) */
  install?: string[];
  /** one short caveat shown under the install lines */
  note?: string;
};

export type FreeDrop = {
  number: number;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  keyword: string; // the comment keyword on the reel
  tools: FreeTool[];
  /** email-gated PDF (Kit form). When set, the page shows the sign-up instead of the tool list. */
  guide?: { kitUid: string; kitScript: string; cover: string; points: string[] };
  /** paid kit sold on Kit Commerce. When set, the page shows the sales section. */
  kit?: { href: string; price: string; offer?: { code: string; until: string; regular: string }; cover: string };
  /** one-line tip under the tool list, with a command to copy */
  tip?: { before: string; command: string; after: string };
  /** longer write-up under the tool list, for single-tool drops */
  about?: DropAbout;
};

/** A run of text; a part with href renders as a link. */
export type RichText = (string | { text: string; href: string })[];

export type DropAbout = {
  steps?: { title: string; text: string }[];
  /** second way to install, run in a terminal instead of Claude Code */
  altInstall?: { label: string; commands: string[] };
  /** a real run, quoted verbatim */
  example?: { question: string; output: string; source: string };
  notes?: string[];
  why?: RichText;
};

export const INSTAGRAM_HANDLE = "copilot_shogo";
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;

const drops: FreeDrop[] = [
  {
    number: 8,
    slug: "08-legal-check",
    title: "/legal-check: find the legal traps in your vibe-coded app",
    description:
      "A free Claude Code skill (MIT) by Shogo. It audits your web app for eight common legal traps, then fixes what code can fix. Not legal advice.",
    date: "2026-09-28",
    keyword: "LEGAL",
    tools: [
      {
        name: "/legal-check",
        what: "Checks for: sign-up with no age screen (COPPA), Google Fonts loaded from Google's servers (GDPR, EU), session replay recording typed text or recording before consent (California wiretap law, CIPA), marketing email with no unsubscribe link or postal address (CAN-SPAM), a subscribe button with no renewal terms, consent or online cancel (California Automatic Renewal Law), user uploads with no DMCA page, no privacy policy or terms page (CalOPPA), and analytics that load before consent (EU/UK consent rules).",
        href: "https://github.com/Shogo-nfrealmusic/ship-legal",
        icon: "legal",
        install: ["/plugin marketplace add Shogo-nfrealmusic/ship-legal", "/plugin install legal-check@ship-legal"],
      },
    ],
    tip: {
      before: "Then run",
      command: "/legal-check",
      after: "in your project (also available as /legal-check:legal-check).",
    },
    about: {
      steps: [
        {
          title: "Scan (read-only)",
          text: "A bundled script searches your code for sign-up forms, font links, replay SDKs, email sends, Stripe subscriptions, file uploads and policy pages. Each check is marked PASS, RISK or N/A in a table, with file:line.",
        },
        {
          title: "Explain",
          text: "One short block per RISK: where it is, the risk in plain words, and the fix.",
        },
        {
          title: "Ask once",
          text: "Then one question: apply the fixes? Nothing in your code changes before you say yes.",
        },
        {
          title: "Fix, then Human TODO",
          text: "It edits your code, runs your own typecheck / lint / build scripts, and lists what code can't do: your real postal address, registering a DMCA agent at dmca.copyright.gov ($6, renew every 3 years), turning on cancellation in Stripe, and a lawyer's review.",
        },
      ],
      altInstall: {
        label: "Or copy the skill folder (in a terminal)",
        commands: [
          "git clone https://github.com/Shogo-nfrealmusic/ship-legal.git",
          "cp -R ship-legal/plugins/legal-check/skills/legal-check ~/.claude/skills/",
        ],
      },
      example: {
        question: "/legal-check",
        output: `legal-check · vibely · 8 RISK · 0 PASS · 0 N/A

 #  Check                          Status  Where
 1  Kids under 13 (COPPA)          RISK    app/signup/page.tsx:28
 2  Google Fonts CDN (GDPR, EU)    RISK    app/layout.tsx:14
 3  Session replay (CIPA)          RISK    app/providers.tsx:15
 4  Marketing email (CAN-SPAM)     RISK    emails/launch-announcement.ts:4
 5  Subscriptions (CA auto-renew)  RISK    app/pricing/page.tsx:19
 6  User uploads (DMCA)            RISK    app/api/avatar/route.ts:11
 7  Privacy policy & terms         RISK    -
 8  Analytics consent              RISK    app/providers.tsx:9`,
        source: "Real output on examples/vibely-sample, a small Next.js app built to contain the traps. Full run in the repo's examples/.",
      },
      notes: [
        "This is not legal advice. It is an automated check of eight common traps, not a full legal review. It can miss things. Have a lawyer review your policies and flows before you rely on them.",
        "The scan and report take about 45 seconds. Applying the fixes takes a few minutes.",
        "Tip: before you say yes, press Shift+Tab until the footer says \"accept edits\", so it doesn't ask before every file edit.",
        "It answers in the language you ask in, for example /legal-check このアプリ大丈夫？ gets a Japanese report.",
      ],
    },
  },
  {
    number: 7,
    slug: "07-llm-council",
    title: "/llm-council: make Claude argue with you, not agree",
    description:
      "A free Claude Code skill (MIT) by Shogo. One command sends your question to a council: five independent advisors, three anonymous reviewers and a chairman who makes the call.",
    date: "2026-09-28",
    keyword: "COUNCIL",
    tools: [
      {
        name: "/llm-council",
        what: "Pressure-tests a decision. Instead of one assistant telling you your idea sounds great, five advisors argue it from different angles, their answers are reviewed anonymously, and a chairman gives a verdict.",
        href: "https://github.com/Shogo-nfrealmusic/llm-council",
        icon: "council",
        install: ["/plugin marketplace add Shogo-nfrealmusic/llm-council", "/plugin install llm-council@llm-council"],
      },
    ],
    tip: {
      before: "Then run",
      command: "/llm-council:llm-council <your question>",
      after: "(or /llm-council if you copied the skill folder into ~/.claude/skills/).",
    },
    about: {
      steps: [
        {
          title: "Neutral brief",
          text: "Your question is rewritten without your own opinion (\"I'm sure\", \"Good idea?\"). You see the brief and what was removed. No advisor sees your original wording.",
        },
        {
          title: "Five advisors, independently",
          text: "Contrarian, First-principles thinker, Expansionist, Outsider and Executor each answer as a separate subagent. None can see the others. Each picks GO, NO-GO or CHANGE and gives a confidence.",
        },
        {
          title: "Anonymous review",
          text: "The five answers are shuffled and labelled A–E. Three reviewers critique them without knowing who wrote what, and are told to reward the strongest dissent, not the majority.",
        },
        {
          title: "Chairman",
          text: "A verdict (go / no-go / change it), the strongest objection still standing, what would change the decision, and 3 next steps.",
        },
      ],
      altInstall: {
        label: "Or copy the skill folder (in a terminal)",
        commands: [
          "git clone https://github.com/Shogo-nfrealmusic/llm-council.git",
          "cp -R llm-council/plugins/llm-council/skills/llm-council ~/.claude/skills/",
        ],
      },
      example: {
        question:
          "/llm-council I'm raising my app's price from $9 to $19 a month next week. I'm sure users will pay. Good idea?",
        output: `VERDICT: CHANGE IT — Charge $19 to new signups next week; existing users stay at $9 for now.
...
NEXT 3 STEPS:
1. Pull subscriber count, monthly churn and cost per user — you'll know whether $9 loses
   money.
2. Put $19 on new signups only and compare 2 weeks against the prior 4 — it works if
   revenue per visitor is at or above baseline.
3. Survey existing users on what price they'd accept (a price-sensitivity survey) — this
   works if at least 60% say $19 or less is acceptable.`,
        source: "Chairman output from a real run, trimmed. Full run in examples/03-demo-price-increase.md.",
      },
      notes: [
        "A run takes about 3 minutes and makes 9 subagent calls. It counts toward your Claude plan's usage.",
        "It's a thinking aid. It doesn't eliminate sycophancy: all advisors run on the same model family and can share a blind spot.",
      ],
      why: [
        "A Stanford study published in ",
        { text: "Science", href: "https://www.science.org/doi/10.1126/science.aec8352" },
        " (Cheng et al., March 26, 2026) tested 11 AI models: on average, they affirmed users' actions 49% more often than humans did. The idea comes from ",
        { text: "Andrej Karpathy's llm-council", href: "https://github.com/karpathy/llm-council" },
        ", where several models answer, rank each other anonymously and a chairman writes the final answer. This version runs inside Claude Code with subagents.",
      ],
    },
  },
  {
    number: 6,
    slug: "06-claude-code-plugins",
    title: "5 Claude Code plugins worth installing",
    description:
      "Less code, parallel PR review, memory across sessions, your Obsidian vault as memory, and Anthropic's official plugin directory. Each with the commands to install it.",
    date: "2026-09-27",
    keyword: "PLUGINS",
    tools: [
      {
        name: "Ponytail",
        what: "Makes Claude Code write less code. The README's benchmark: ~54% less code and ~20% lower cost (Claude Code, Haiku 4.5, 12 tasks). Results vary by model.",
        href: "https://github.com/DietrichGebert/ponytail",
        icon: "scissors",
        install: ["/plugin marketplace add DietrichGebert/ponytail", "/plugin install ponytail@ponytail"],
      },
      {
        name: "Code Review (by Anthropic)",
        what: "Run /code-review on a pull request: 4 agents review it in parallel (2 check your CLAUDE.md rules, 2 look for bugs), and each flagged issue is validated before it's reported.",
        href: "https://github.com/anthropics/claude-code/tree/main/plugins/code-review",
        icon: "review",
        install: ["/plugin marketplace add anthropics/claude-code", "/plugin install code-review@claude-code-plugins"],
      },
      {
        name: "Claude Mem",
        what: "Carries context from your past sessions into new ones.",
        href: "https://github.com/thedotmack/claude-mem",
        icon: "brain",
        install: ["/plugin marketplace add thedotmack/claude-mem", "/plugin install claude-mem"],
        note: "Its hosted memory needs a sign-in and is free for your first 30 days. After that, memory falls back to your Anthropic plan unless you subscribe.",
      },
      {
        name: "Obsidian Second Brain",
        what: "Turns your Obsidian vault into long-term memory for Claude Code. 47 commands.",
        href: "https://github.com/eugeniughelbur/obsidian-second-brain",
        icon: "notebook",
        install: [
          "/plugin marketplace add eugeniughelbur/obsidian-second-brain",
          "/plugin install obsidian-second-brain@obsidian-second-brain",
        ],
        note: "Then follow the README to point it at your vault.",
      },
      {
        name: "Official marketplace",
        what: "Anthropic's managed plugin directory, with 300+ plugins listed. Install any of them with one command.",
        href: "https://github.com/anthropics/claude-plugins-official",
        icon: "store",
        install: ["/plugin install {plugin-name}@claude-plugins-official"],
        note: "Anthropic says it doesn't control what's inside these plugins and can't verify they work as intended, so check each one before you install it.",
      },
    ],
    tip: { before: "Run", command: "/plugin", after: "inside Claude Code to browse and manage your plugins." },
  },
  {
    number: 5,
    slug: "05-3d-website-kit",
    title: "The $5,000 3D website: build it yourself",
    description:
      "The kit behind the reel: how I build scroll-driven 3D product sites with Claude Code and Higgsfield. The guide, a working starter project and the exact prompts, tested on a second product.",
    date: "2026-09-27",
    keyword: "3D",
    tools: [],
    kit: { href: "https://fantastic-mover-4460.kit.com/products/3d-website-kit?promo=3DWEBSITE", price: "$29", offer: { code: "3DWEBSITE", until: "October 31", regular: "$54" }, cover: "/free/05/s0_f_0000.jpg" },
  },
  {
    number: 4,
    slug: "04-tiny-team-ai",
    title: "Run your business with a tiny team + AI",
    description:
      "The free guide from the reel: how two of us run a six-figure business with almost everything automated, and the exact tools we use.",
    date: "2026-09-27",
    keyword: "GUIDE",
    tools: [],
    guide: {
      kitUid: "3ba02ef07c",
      kitScript: "https://fantastic-mover-4460.kit.com/3ba02ef07c/index.js",
      cover: "/free/04-guide-cover.jpg",
      points: [
        "Sales & payments on autopilot",
        "Content that posts itself to Instagram and TikTok",
        "Money & expenses, synced from the bank",
        "Numbers you don't have to pull",
        "Every tool we use, and a 7-day plan to start",
      ],
    },
  },
  {
    number: 3,
    slug: "03-laya",
    title: "A free, open-source Jev that runs on your own computer",
    description:
      "Laya is a local System 1 decision model: typed answers about any text in one pass, about 30 ms. Apache-2.0, pip install, MCP server for Claude Code.",
    date: "2026-09-26",
    keyword: "LOCAL",
    tools: [
      {
        name: "Laya",
        what: "Answers typed questions about any text (intent, urgency, churn risk…) without generating text. Install: pip install laya, then laya \"your text\" --preset triage --predict. The base model is near chance out of the box: fine-tune it on your own data with the notebook in the repo, and Claude Code can do that for you.",
        href: "https://github.com/NandhaKishorM/laya",
        icon: "cpu",
      },
    ],
  },
  {
    number: 2,
    slug: "02-claude-design-tools",
    title: "5 free tools that turn Claude into a designer",
    description:
      "Design rules, design commands, real-browser testing, real-site design systems and photo-to-3D. All open source.",
    date: "2026-09-26",
    keyword: "DESIGN",
    tools: [
      {
        name: "Taste Skill",
        what: "Design rules so Claude stops shipping generic, AI-looking sites.",
        href: "https://github.com/Leonxlnx/taste-skill",
        icon: "palette",
      },
      {
        name: "Impeccable",
        what: "24 design commands like polish, audit and bolder, plus a live mode to try variations in your browser.",
        href: "https://github.com/pbakaus/impeccable",
        icon: "wand",
      },
      {
        name: "Playwright CLI",
        what: "Claude opens real browsers, clicks through your site and takes screenshots to check it works.",
        href: "https://github.com/microsoft/playwright-cli",
        icon: "browser",
      },
      {
        name: "Awesome DESIGN.md",
        what: "DESIGN.md files based on real sites like Apple, Claude and Stripe, so Claude can match a style.",
        href: "https://github.com/VoltAgent/awesome-design-md",
        icon: "file",
      },
      {
        name: "img2threejs",
        what: "Give it one photo and Claude rebuilds it as an interactive 3D model, entirely in code.",
        href: "https://github.com/img2threejs/img2threejs",
        icon: "cube",
      },
    ],
  },
  {
    number: 1,
    slug: "01-freellmapi",
    title: "The free tiers of 34 AI providers in one endpoint",
    description:
      "One OpenAI-compatible endpoint over the free tiers of 34 providers. Claude Code plugs in with one command.",
    date: "2026-09-26",
    keyword: "FREE",
    tools: [
      {
        name: "FreeLLMAPI",
        what: "When one free model hits its limit, it switches to the next and leaves a handoff note so the new model keeps your context.",
        href: "https://github.com/tashfeenahmed/freellmapi",
        icon: "plug",
      },
    ],
  },
];

/** Newest first. */
export function getDrops(): FreeDrop[] {
  return [...drops].sort((a, b) => b.number - a.number);
}

export function getDrop(slug: string): FreeDrop | undefined {
  return drops.find((drop) => drop.slug === slug);
}

export function getDropByNumber(value: string): FreeDrop | undefined {
  if (!/^\d{1,3}$/.test(value)) return undefined;
  return drops.find((drop) => drop.number === Number(value));
}

export const pad = (n: number) => String(n).padStart(2, "0");

export function formatDropDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

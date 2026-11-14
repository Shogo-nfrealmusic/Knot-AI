// /free/67 (five Claude Code plugins): the page's facts, with no React in them so they can be tested (data.test.mjs).
// Everything here is from the five READMEs, read 2026-11-14:
//   github.com/cheaper-inference/OmniRoute (MIT) · github.com/thedotmack/claude-mem (Apache-2.0) ·
//   github.com/headroomlabs-ai/headroom (Apache-2.0) · github.com/rebelytics/one-skill-to-rule-them-all (CC BY 4.0) ·
//   github.com/anthropics/claude-plugins-official, plugins/claude-code-setup (Apache-2.0), plus that repo's own README for the install line.
// `problem` and the `label`s are this page's own short wording. `fixes`, the install lines and the quoted parts of `know` are each README's.

export type PluginId = "omniroute" | "claude-mem" | "headroom" | "claude-code-setup" | "task-observer";

export type InstallBlock = {
  /** where the lines are pasted */
  where: "terminal" | "claude-code";
  lines: string[];
  /** where in the source these lines are written */
  source: string;
};

export type Plugin = {
  id: PluginId;
  name: string;
  /** what kind of thing it is, in a few words */
  kind: string;
  /** the problem from the reel it answers (this page's label) */
  problem: string;
  /** what it fixes, in its README's words */
  fixes: string;
  href: string;
  /** the address as shown on the page */
  shown: string;
  license: string;
  by: string;
  install: InstallBlock[];
  /** what the README says to do right after the install lines */
  then: string;
  /** a short list from the README, shown under the quote */
  list?: { title: string; items: string[] };
  /** things the README says that are worth knowing before you install */
  know: string[];
};

export const PLUGINS: Plugin[] = [
  {
    id: "omniroute",
    name: "OmniRoute",
    kind: "The Free AI Gateway",
    problem: "Cuts you off mid-task",
    fixes:
      "A combo is a chain of models OmniRoute routes across automatically. If quota runs out, a provider fails, or costs spike, the combo can move to the next eligible healthy model.",
    href: "https://github.com/cheaper-inference/OmniRoute",
    shown: "github.com/cheaper-inference/OmniRoute",
    license: "MIT",
    by: "Diego Souza",
    install: [{ where: "terminal", lines: ["npm install -g omniroute", "omniroute"], source: "README, Quick Start, step 1" }],
    then: "The dashboard is at http://localhost:20128. In Dashboard → Providers, connect a provider with your own account. Then point your tool at http://localhost:20128/v1 with the key from Dashboard → Endpoints and the model auto.",
    know: [
      "“Bring your own provider accounts.” The ~1.62B is “an estimated aggregate across separately eligible third-party free tiers, not a token grant from OmniRoute.”",
      "“Free tiers may require signup, approval, or a payment method.” Each provider controls its limits, availability, and terms.",
      "“A fresh installation can have no eligible keyless targets”. The model auto only routes among providers you have connected.",
      "On npm 11 or later, npm may block the install scripts OmniRoute needs. The README's Quick Start has the --allow-scripts line for that.",
      "The figures “are re-audited every two weeks against the live catalog and move both ways”.",
    ],
  },
  {
    id: "claude-mem",
    name: "Claude Mem",
    kind: "Memory across sessions",
    problem: "Forgets your project every session",
    fixes:
      "Your coding agent forgets everything between sessions. Claude-Mem remembers for it. Claude-Mem runs a second agent beside it that takes notes while it works. The next session starts with a short index of what matters, and pulls in the details only when it needs them.",
    href: "https://github.com/thedotmack/claude-mem",
    shown: "github.com/thedotmack/claude-mem",
    license: "Apache-2.0",
    by: "Alex Newman (@thedotmack)",
    install: [
      { where: "terminal", lines: ["npx claude-mem install"], source: "README, Quick Start" },
      {
        where: "claude-code",
        lines: ["/plugin marketplace add thedotmack/claude-mem", "/plugin install claude-mem"],
        source: "README, Quick Start: “Or install from the plugin marketplace inside Claude Code”",
      },
    ],
    then: "Restart Claude Code. Context from previous sessions will automatically appear in new sessions. Memory injection starts on your second session in a project.",
    know: [
      "The installer “asks you to sign in to claude-mem in your browser (email magic link, no card required to sign in)”. Choosing the claude-mem observer starts a 30 Day Free Trial “on a checkout page that asks for a payment method”.",
      "“When the free trial ends, memory automatically falls back to your Anthropic plan unless you subscribe.”",
      "To skip the sign-in: “Pass an explicit --provider flag, set CLAUDE_MEM_ONLINE_OPTIN=false, or run in CI/non-interactive shells”.",
      "“Your memory lives in ~/.claude-mem on your machine. Cloud sync is opt-in. Anonymous usage analytics are on by default”; npx claude-mem telemetry disable turns them off.",
      "Do not use npm install -g claude-mem: it “installs the SDK/library only” and does not register the plugin hooks.",
    ],
  },
  {
    id: "headroom",
    name: "Headroom",
    kind: "The context compression layer for AI agents",
    problem: "Burns through your tokens",
    fixes:
      "Headroom compresses everything your AI agent reads — tool outputs, logs, RAG chunks, files, and conversation history — before it reaches the LLM. Same answers, fewer input tokens.",
    href: "https://github.com/headroomlabs-ai/headroom",
    shown: "github.com/headroomlabs-ai/headroom",
    license: "Apache-2.0",
    by: "headroomlabs-ai",
    install: [
      {
        where: "terminal",
        lines: ['uv tool install --python 3.13 "headroom-ai[all]"', "headroom wrap claude"],
        source: "README, Start here: “I run coding agents”",
      },
    ],
    then: "Zero code changes. Launch a wrapped agent session each time, so the setup runs. Undo it with headroom unwrap claude.",
    know: [
      "“Measured: 21–57% fewer input tokens on four agent scenarios, 90%+ on repeated JSON arrays and log lines, little on prose”.",
      "“Skip it for short conversational prompts and prose: there is little to compress”.",
      "“headroom wrap ... is session-scoped: its proxy exits with the wrapped agent.”",
      "“Compression runs on your machine; no prompt or file content is sent anywhere to be compressed.”",
      "“An anonymous beacon is on by default.” It “never sends prompts, completions, code or file paths”. HEADROOM_TELEMETRY=off turns it off.",
    ],
  },
  {
    id: "claude-code-setup",
    name: "Claude Code Setup",
    kind: "An official Anthropic plugin",
    problem: "Don't know what to set up",
    fixes:
      "Analyze codebases and recommend tailored Claude Code automations - hooks, skills, MCP servers, and more. Claude uses this skill to scan your codebase and recommend the top 1-2 automations in each category.",
    href: "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup",
    shown: "github.com/anthropics/claude-plugins-official · plugins/claude-code-setup",
    license: "Apache-2.0",
    by: "Anthropic",
    install: [
      {
        where: "claude-code",
        lines: ["/plugin install claude-code-setup@claude-plugins-official"],
        source: "claude-plugins-official README, Installation: “/plugin install {plugin-name}@claude-plugins-official”",
      },
    ],
    then: "Or browse for it in /plugin > Discover. Then ask in your project: “recommend automations for this project”, “help me set up Claude Code” or “what hooks should I use?”",
    list: {
      title: "The five categories it recommends in",
      items: [
        "MCP Servers - External integrations (context7 for docs, Playwright for frontend)",
        "Skills - Packaged expertise (Plan agent, frontend-design)",
        "Hooks - Automatic actions (auto-format, auto-lint, block sensitive files)",
        "Subagents - Specialized reviewers (security, performance, accessibility)",
        "Slash Commands - Quick workflows (/test, /pr-review, /explain)",
      ],
    },
    know: [
      "“This skill is read-only - it analyzes but doesn't modify files.” It recommends; you set things up.",
      "The plugin's own README has no install line. The line above is the marketplace README's pattern with this plugin's name.",
      "From the marketplace README: “Make sure you trust a plugin before installing, updating, or using it.”",
    ],
  },
  {
    id: "task-observer",
    name: "Task Observer",
    kind: "A meta-skill",
    problem: "Skills never improve",
    fixes:
      "The skills that do get built stay frozen: they never learn from how you actually use them. Task Observer improves your existing skills — it notices corrections you make, preferences you express, and gaps in your current skills, then suggests specific updates. You decide which changes are installed.",
    href: "https://github.com/rebelytics/one-skill-to-rule-them-all",
    shown: "github.com/rebelytics/one-skill-to-rule-them-all",
    license: "CC BY 4.0",
    by: "Eoghan Henn / rebelytics.com",
    install: [
      {
        where: "terminal",
        lines: ["npx skills add rebelytics/one-skill-to-rule-them-all --skill task-observer"],
        source: "README, Quick install, step 1 (Vercel's skills CLI, needs Node.js)",
      },
    ],
    then: "Add -g to install it for all your projects. Then activate it: add the activation instruction from references/environments.md in the repo to your CLAUDE.md.",
    list: {
      title: "The three things it looks for",
      items: [
        "Corrections and adjustments — if you adjust the AI's output or steer it in a different direction",
        "Gaps no skill covers yet — if you're doing something manually or repeatedly that could be systematised",
        "Its own blind spots — the observer watches itself too",
      ],
    },
    know: [
      "“Installing alone is not enough, because description matching under-triggers.” The activation instruction is what makes it run.",
      "Check it in a new session: “if skill-observations/observation-log/ doesn't exist after a few sessions of real work, activation never happened.”",
      "“The observer doesn't modify your installed skills.” “Nothing goes live until you install the updated bundle”.",
      "“If you run a small setup with a handful of skills, your AI system's built-in memory features may cover much of the same ground with less overhead”.",
    ],
  },
];

export function pluginFor(id: string): Plugin | undefined {
  return PLUGINS.find((p) => p.id === id);
}

/** The picker: the five problems, in the reel's order, each opening one plugin. */
export const PROBLEMS: { label: string; plugin: PluginId }[] = [
  { label: "It cuts me off mid-task", plugin: "omniroute" },
  { label: "It forgets my project", plugin: "claude-mem" },
  { label: "It burns through my tokens", plugin: "headroom" },
  { label: "I don't know what to set up", plugin: "claude-code-setup" },
  { label: "My skills never improve", plugin: "task-observer" },
];

/** OmniRoute's headline numbers, as its README states them today (the reel's voice rounds them differently). */
export const OMNI_NUMBERS: { value: string; label: string }[] = [
  { value: "393", label: "AI providers" },
  { value: "150+", label: "free tiers" },
  { value: "~1.62B", label: "free tokens/mo" },
];

/** OmniRoute's four provider tiers, in the order its README falls back across them. */
export const TIERS = ["Subscription", "API Key", "Cheap", "Free"];

/** claude-mem, "How It Works": the README's three steps. */
export const MEMORY_STEPS: { title: string; text: string }[] = [
  { title: "Your agent works.", text: "Hooks in your agent hand each tool call (what it reads, edits and runs) to a small local worker." },
  { title: "The observer takes notes.", text: "A second agent turns that activity into short observations, and writes a summary when the session ends." },
  {
    title: "The next session starts with them.",
    text: "When a session starts, your agent gets a compact index of the observations that matter for this project, and fetches full details only when it needs them.",
  },
];

export type Scenario = { id: string; name: string; before: number; after: number; saved: number };

/** Headroom, "Proof: measured token savings": the README's table, row for row. */
export const SCENARIOS: Scenario[] = [
  { id: "search", name: "Code search (100 results)", before: 17199, after: 13597, saved: 21 },
  { id: "sre", name: "SRE incident debugging", before: 55957, after: 24340, saved: 57 },
  { id: "explore", name: "Codebase exploration", before: 58801, after: 33895, saved: 42 },
  { id: "triage", name: "GitHub issue triage", before: 46067, after: 32429, saved: 30 },
];

/** The scenario in the picture at the top of Headroom's README: 55,957 → 24,340. */
export const HERO: Scenario = SCENARIOS[1];

/** Whole percent saved going from `before` to `after` tokens. */
export function savedPercent(before: number, after: number): number {
  if (before <= 0) return 0;
  return Math.round((1 - after / before) * 100);
}

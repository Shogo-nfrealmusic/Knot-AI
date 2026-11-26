// /free/79 (four plugins to install in Claude Code before you vibe code): the page's facts, with no React in them so they can be tested (data.test.mjs).
// Read through the GitHub API on 2026-11-26 (sources.ts holds the lines word for word):
//   github.com/supabase-community/supabase-plugin (+ supabase-community/supabase-mcp for the tool names) ·
//   github.com/vercel/vercel-plugin (Apache-2.0) · github.com/Yeachan-Heo/oh-my-claudecode (MIT) ·
//   github.com/ChromeDevTools/chrome-devtools-mcp (Apache-2.0) · github.com/anthropics/claude-plugins-official (marketplace README and marketplace.json).
// `kind`, `job` and the figure labels are this page's own short wording. Every sentence in “curly quotes” and every install line is the source's.

import type { SourceId } from "./sources";

export type PlugId = "supabase" | "vercel" | "omc" | "chrome-devtools";

export type InstallBlock = {
  /** where the lines are pasted */
  where: "terminal" | "claude-code";
  lines: string[];
  /** where in the source these lines are written */
  source: string;
};

export type VibePlugin = {
  id: PlugId;
  name: string;
  /** a two-letter mark on the plug in the power strip */
  mark: string;
  /** what kind of thing it is, in a few words (this page's) */
  kind: string;
  /** what it does for you while you vibe code (this page's, one line) */
  job: string;
  /** what it is, in its README's words */
  does: string;
  /** what it adds, in its README's words */
  gives: string[];
  href: string;
  /** the address as shown on the page */
  shown: string;
  license: string;
  by: string;
  /** listed in Anthropic's claude-plugins-official marketplace.json */
  official: boolean;
  install: InstallBlock[];
  /** what to do right after the install lines */
  then: string;
  /** worth knowing before you install */
  know: string[];
  /** where the quoted sentences on this card come from */
  sources: SourceId[];
};

export const OFFICIAL_INSTALL = (name: string) => `/plugin install ${name}@claude-plugins-official`;

export const PLUGS: VibePlugin[] = [
  {
    id: "supabase",
    name: "Supabase",
    mark: "SB",
    kind: "Official Supabase plugin",
    job: "Your database, tables and migrations, from the chat",
    does: "Official Supabase plugin for Claude Code, Cursor, Codex, Antigravity, and other AI coding agents",
    gives: [
      "the Supabase MCP server (https://mcp.supabase.com/mcp) to manage your projects, databases, and Edge Functions",
      "the supabase skill for general Supabase product guidance",
      "the supabase-postgres-best-practices skill for Postgres performance and schema guidance",
    ],
    href: "https://github.com/supabase-community/supabase-plugin",
    shown: "github.com/supabase-community/supabase-plugin",
    license: "No license file in the repo",
    by: "Supabase",
    official: true,
    install: [
      {
        where: "claude-code",
        lines: [OFFICIAL_INSTALL("supabase")],
        source: "Anthropic's marketplace README: “/plugin install {plugin-name}@claude-plugins-official”, with the name its marketplace.json lists, supabase",
      },
    ],
    then: "“The first time your agent uses the MCP server, it opens your browser so you can sign in to Supabase and authorize access.”",
    know: [
      "“If you already added the Supabase MCP server by hand, remove it after installing the plugin so your agent doesn't load the same tools twice.”",
      "Supabase asks you to read its security best practices first, “to understand the risks of connecting an LLM to your Supabase projects and how to mitigate them.”",
      "execute_sql and apply_migration can change your data. In the server's own words: “Destructive statements may require the user to confirm before they run.”",
      "The plugin's README says to install it from your agent's plugin marketplace and prints no line. The line above is the official marketplace's pattern with the name it lists.",
    ],
    sources: ["supabase", "supabaseMcp", "marketplace"],
  },
  {
    id: "vercel",
    name: "Vercel",
    mark: "VC",
    kind: "Vercel's plugin for coding agents",
    job: "Ship it to a preview or production URL without leaving the terminal",
    does: "This plugin gives AI agents a relational knowledge graph of the Vercel ecosystem plus a bundled skill library covering products, libraries, CLI, APIs, and workflows.",
    gives: ["40 skills", "3 specialist agents", "4 commands"],
    href: "https://github.com/vercel/vercel-plugin",
    shown: "github.com/vercel/vercel-plugin",
    license: "Apache-2.0",
    by: "Vercel",
    official: true,
    install: [{ where: "terminal", lines: ["npx plugins add vercel/vercel-plugin"], source: "README, Installation" }],
    then: "“That's it. The plugin installs Vercel context, skills, and a lightweight default hook profile.” It needs Node.js 18+ and Bun.",
    know: [
      "Its MCP connection is https://mcp.vercel.com, and “MCP supports both reads and writes, including inspecting projects and logs, creating deployments”. Grant it the teams you mean to.",
      "The deploy command does preview or production. The README's example for production is /vercel-plugin:deploy prod, so say which one you want.",
      "“Telemetry is on by default and can be disabled with VERCEL_PLUGIN_TELEMETRY=off.”",
      "It is also in Anthropic's official marketplace, as vercel.",
    ],
    sources: ["vercel", "marketplace"],
  },
  {
    id: "omc",
    name: "Oh My Claude Code",
    mark: "OM",
    kind: "Multi-agent orchestration",
    job: "A team of agents on one task instead of one agent",
    does: "Multi-agent orchestration for Claude Code. Zero learning curve.",
    gives: ["19 specialized agents (with tier variants) for architecture, research, design, testing, data analysis"],
    href: "https://github.com/Yeachan-Heo/oh-my-claudecode",
    shown: "github.com/Yeachan-Heo/oh-my-claudecode",
    license: "MIT",
    by: "Yeachan Heo",
    official: false,
    install: [
      {
        where: "claude-code",
        lines: ["/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode", "/plugin install oh-my-claudecode"],
        source: "README, Quick Start, Step 1: “enter them one at a time (pasting both lines at once will fail)”",
      },
      { where: "claude-code", lines: ["/omc-setup"], source: "README, Quick Start, Step 2" },
    ],
    then: "Then give the team a task. The README's example is the line in the figure below.",
    know: [
      "Paste the two /plugin lines one at a time: “pasting both lines at once will fail”.",
      "It is not in Anthropic's official marketplace. The first line adds the author's own.",
      "/team runs on Claude Code's native teams: the README has you set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS to \"1\" under env in ~/.claude/settings.json. “If teams are disabled, OMC will warn you and fall back to non-team execution where possible.”",
      "Taking the npm route instead? The package is oh-my-claude-sisyphus, not oh-my-claudecode.",
    ],
    sources: ["omc"],
  },
  {
    id: "chrome-devtools",
    name: "Chrome DevTools MCP",
    mark: "DT",
    kind: "Chrome DevTools for agents",
    job: "It opens the page it built and reads the console, the network and the trace",
    does: "Chrome DevTools for agents (chrome-devtools-mcp) lets your coding agent (such as Antigravity, Claude, Cursor or Copilot) control and inspect a live Chrome browser.",
    gives: [
      "Analyze network requests, take screenshots and check browser console messages (with source-mapped stack traces).",
      "Uses Chrome DevTools to record traces and extract actionable performance insights.",
    ],
    href: "https://github.com/ChromeDevTools/chrome-devtools-mcp",
    shown: "github.com/ChromeDevTools/chrome-devtools-mcp",
    license: "Apache-2.0",
    by: "the Chrome DevTools team at Google",
    official: true,
    install: [
      {
        where: "claude-code",
        lines: ["/plugin marketplace add ChromeDevTools/chrome-devtools-mcp", "/plugin install chrome-devtools-mcp@chrome-devtools-plugins"],
        source: "README, Install skills as a plugin, Claude Code",
      },
    ],
    then: "Check it with the README's first prompt, Check the performance of https://developers.chrome.com: “Your MCP client should open the browser and record a performance trace.”",
    know: [
      "It “exposes content of the browser instance to the MCP clients”. Avoid sharing sensitive or personal information that you don't want to share with MCP clients.",
      "Usage statistics: “Data collection is enabled by default.” Start the server with --no-usage-statistics to opt out.",
      "Performance tools may send trace URLs to the Google CrUX API; --no-performance-crux turns that off.",
      "It officially supports Google Chrome and Chrome for Testing only, and needs Node.js and npm.",
    ],
    sources: ["cdt", "marketplace"],
  },
];

export function plugFor(id: string): VibePlugin | undefined {
  return PLUGS.find((p) => p.id === id);
}

/** Power strip: the label over the strip, with how many are plugged in. */
export function stripLabel(on: number): string {
  return `CLAUDE CODE ${on}/${PLUGS.length}`;
}

/** The plugs, in the reel's order, that are switched on. */
export function plugged(ids: Iterable<string>): PlugId[] {
  const set = new Set(ids);
  return PLUGS.map((p) => p.id).filter((id) => set.has(id));
}

/** Supabase: the four MCP tools in the figure, with the title and a line from each tool's own definition. */
export const SB_TOOLS: { name: string; title: string; line: string }[] = [
  { name: "execute_sql", title: "Execute SQL", line: "Executes raw SQL in the Postgres database." },
  { name: "apply_migration", title: "Apply migration", line: "Applies a migration to the database. Use this when executing DDL operations." },
  { name: "generate_typescript_types", title: "Generate TypeScript types", line: "Generates TypeScript types for a project." },
  {
    name: "get_advisors",
    title: "Get project advisors",
    line: "Use this to check for security vulnerabilities, performance improvements, or health issues.",
  },
];

export const SB_MCP_URL = "https://mcp.supabase.com/mcp";

/** Vercel: the four commands, with the README's purpose for each. */
export const VC_COMMANDS: { command: string; purpose: string }[] = [
  { command: "/vercel-plugin:bootstrap", purpose: "Bootstrap project — linking, env provisioning, db setup" },
  { command: "/vercel-plugin:deploy", purpose: "Deploy to Vercel (preview or production)" },
  { command: "/vercel-plugin:env", purpose: "Manage environment variables" },
  { command: "/vercel-plugin:status", purpose: "Project status overview" },
];

/** What the deploy figure runs: the plain command for a preview, the README's `prod` example for production. */
export function deployCommand(target: "preview" | "production"): string {
  return target === "production" ? "/vercel-plugin:deploy prod" : "/vercel-plugin:deploy";
}

/** Oh My Claude Code: the README's team line and its staged pipeline. */
export const OMC_TEAM = '/team 3:executor "fix all TypeScript errors"';
export const OMC_WORKERS = 3;
export const OMC_STAGES = ["team-plan", "team-prd", "team-exec", "team-verify", "team-fix"] as const;

/** Chrome DevTools MCP: the four things the figure shows, each from the README's key features. */
export const CDT_TABS = [
  { id: "console", label: "Console", line: "check browser console messages (with source-mapped stack traces)" },
  { id: "network", label: "Network", line: "Analyze network requests" },
  { id: "screenshot", label: "Screenshot", line: "take screenshots" },
  { id: "performance", label: "Performance", line: "record traces and extract actionable performance insights" },
] as const;
export type CdtTab = (typeof CDT_TABS)[number]["id"];

export const CDT_FIRST_PROMPT = "Check the performance of https://developers.chrome.com";

/** The figure kinds the page uses, in order. */
export const VIBE_KINDS = ["strip", "supabase", "vercel", "omc", "chrome-devtools"] as const;

/** Every sentence a string quotes in “curly quotes”. */
export function quotesIn(text: string): string[] {
  return [...text.matchAll(/“([^”]+)”/g)].map((m) => m[1]);
}

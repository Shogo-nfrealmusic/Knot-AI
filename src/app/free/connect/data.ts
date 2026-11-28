// /free/81 (five connectors to plug into Claude): the page's facts, with no React in them so they can be tested (data.test.mjs).
// `line` is the reel's wording. `quote` and the install lines are copied word for word from each official README (sources.ts).
// `ask` / `back` are an illustration of one call for the figure, not a recorded run.
// (The strings are written out here, not imported, so the Next build and node --test read the same file; the test checks they match sources.ts.)

export type ConnectorId = "perplexity" | "firecrawl" | "posthog" | "playwright" | "composio";

export type Install =
  /** a line to paste, as the README prints it; `where` says where it goes */
  | { kind: "command"; text: string; where: string }
  /** Composio has no install line: an option you pass in your own code */
  | { kind: "option"; text: string; where: string };

export type Connector = {
  id: ConnectorId;
  name: string;
  /** what it gives Claude, in the reel's words */
  line: string;
  /** the README's own description, word for word */
  quote: string;
  install: Install;
  /** what you need before it works */
  key: string;
  needsKey: boolean;
  /** the official repo */
  href: string;
  /** the official docs page, when the README points to one */
  docs?: string;
  /** the figure: what Claude sends, and what comes back */
  ask: string;
  back: string;
};

export const HONEST_NOTE = "These are official MCP servers you add yourself. Some need an API key from the tool.";

export const CONNECTORS: Connector[] = [
  {
    id: "perplexity",
    name: "Perplexity",
    line: "Access to the most powerful research engine",
    quote:
      "The official MCP server implementation for the Perplexity API Platform, providing AI assistants with real-time web search, reasoning, and research capabilities",
    install: {
      kind: "command",
      text: 'claude mcp add --transport http perplexity https://api.perplexity.ai/mcp --header "Authorization: Bearer YOUR_API_KEY"',
      where: "Paste it in your terminal, with your key in place of YOUR_API_KEY. It adds the server to Claude Code.",
    },
    key: "A Perplexity API key, from the Perplexity API Platform.",
    needsKey: true,
    href: "https://github.com/perplexityai/modelcontextprotocol",
    ask: "search: how do teams secure MCP servers?",
    back: "an answer, with the sources it read",
  },
  {
    id: "firecrawl",
    name: "Firecrawl",
    line: "Lets Claude see the internet",
    quote: "Scrape any URL into clean Markdown",
    install: {
      kind: "command",
      text: "env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp",
      where: "This runs the server, with your key in place of fc-YOUR_API_KEY. For Claude Desktop, the README's “Usage with Claude Desktop” section puts it in claude_desktop_config.json.",
    },
    key: "A Firecrawl API key, passed as FIRECRAWL_API_KEY.",
    needsKey: true,
    href: "https://github.com/firecrawl/firecrawl-mcp-server",
    ask: "scrape: example.com/pricing",
    back: "the page as clean Markdown",
  },
  {
    id: "posthog",
    name: "PostHog",
    line: "Your private investigator",
    quote:
      "this server gives MCP clients (Claude, Cursor, VS Code, Zed, and more) that full surface: analytics and SQL, dashboards, experiments, feature flags, surveys, session replay, error tracking, and more.",
    install: { kind: "command", text: "npx @posthog/wizard@latest mcp add", where: "Run it in your terminal. The wizard adds the server to Cursor, Claude, Claude Code, VS Code or Zed." },
    key: "A PostHog account with your product's data in it. The wizard does the setup.",
    needsKey: false,
    href: "https://github.com/PostHog/posthog/tree/master/services/mcp",
    docs: "https://posthog.com/docs/model-context-protocol",
    ask: "SQL: sign-ups per week",
    back: "the numbers, from your own data",
  },
  {
    id: "playwright",
    name: "Playwright",
    line: "Gives Claude hands",
    quote: "A Model Context Protocol (MCP) server that provides browser automation capabilities using Playwright.",
    install: { kind: "command", text: "claude mcp add playwright npx @playwright/mcp@latest", where: "Paste it in your terminal. It adds the server to Claude Code." },
    key: "No API key. It drives a browser on your own machine.",
    needsKey: false,
    href: "https://github.com/microsoft/playwright-mcp",
    ask: "open the page, click “Sign up”",
    back: "what the page shows after the click",
  },
  {
    id: "composio",
    name: "Composio",
    line: "Connect every app at once",
    quote: "Composio gives your AI agents 1000+ pre-authenticated toolkits",
    install: {
      kind: "option",
      text: "mcp: true",
      where: "There is no line to paste. In your code, pass mcp: true to composio.create(), then point Claude at session.mcp.url.",
    },
    key: "A Composio API key, as COMPOSIO_API_KEY.",
    needsKey: true,
    href: "https://github.com/ComposioHQ/composio",
    docs: "https://docs.composio.dev/docs/sessions-via-mcp",
    ask: "post the summary to the team chat",
    back: "done, through a signed-in toolkit",
  },
];

export function connectorFor(id: string): Connector | undefined {
  return CONNECTORS.find((c) => c.id === id);
}

/** The figure kinds the page uses, in order: the picker with all five, then one card per connector. */
export const CONNECT_KINDS = ["picker", "perplexity", "firecrawl", "posthog", "playwright", "composio"] as const;

/* the figure's timing: the call travels out, the tool works, the answer travels back */
const SEND_MS = 900;
const WORK_MS = 1500;
const RETURN_MS = 900;
export const TOTAL_MS = SEND_MS + WORK_MS + RETURN_MS;

export type Step = "send" | "work" | "return" | "done";

/** Where the figure is at `t` ms: the step, and how far through it (0 to 1). */
export function phase(t: number): { step: Step; p: number } {
  const x = Math.max(0, t);
  if (x < SEND_MS) return { step: "send", p: x / SEND_MS };
  if (x < SEND_MS + WORK_MS) return { step: "work", p: (x - SEND_MS) / WORK_MS };
  if (x < TOTAL_MS) return { step: "return", p: (x - SEND_MS - WORK_MS) / RETURN_MS };
  return { step: "done", p: 1 };
}

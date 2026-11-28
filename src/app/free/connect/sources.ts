// /free/81: lines copied word for word from each tool's official README (and Composio's docs), read on 2026-11-28.
// data.test.mjs checks that every sentence the page quotes, and every install line it prints, is in here.

export const SOURCES = {
  /** github.com/perplexityai/modelcontextprotocol, README.md */
  perplexity: [
    "The official MCP server implementation for the Perplexity API Platform, providing AI assistants with real-time web search, reasoning, and research capabilities",
    'claude mcp add --transport http perplexity https://api.perplexity.ai/mcp --header "Authorization: Bearer YOUR_API_KEY"',
  ],
  /** github.com/firecrawl/firecrawl-mcp-server, README.md */
  firecrawl: ["Scrape any URL into clean Markdown", "env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp", "Usage with Claude Desktop"],
  /** github.com/PostHog/posthog/tree/master/services/mcp, README.md (docs: posthog.com/docs/model-context-protocol) */
  posthog: [
    "this server gives MCP clients (Claude, Cursor, VS Code, Zed, and more) that full surface: analytics and SQL, dashboards, experiments, feature flags, surveys, session replay, error tracking, and more.",
    "npx @posthog/wizard@latest mcp add",
  ],
  /** github.com/microsoft/playwright-mcp, README.md */
  playwright: [
    "A Model Context Protocol (MCP) server that provides browser automation capabilities using Playwright.",
    "claude mcp add playwright npx @playwright/mcp@latest",
  ],
  /** github.com/ComposioHQ/composio, README.md (docs: docs.composio.dev/docs/sessions-via-mcp) */
  composio: [
    "Composio gives your AI agents 1000+ pre-authenticated toolkits",
    "Every session also exposes a hosted MCP endpoint. Pass `mcp: true` to `composio.create()` and point Claude, Cursor, or any MCP client at `session.mcp.url`.",
  ],
} as const;

export type SourceId = keyof typeof SOURCES;

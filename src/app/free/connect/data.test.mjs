// Run: npm test  (node --test; Node strips the types from the .ts files, so no test runner is installed)
// These pin the page's facts: the five connectors in the reel's order, the reel's one-liners, the install lines and quotes
// (word for word from each README, copied in sources.ts), the key each one needs, the figure's timing, and the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import { CONNECTORS, CONNECT_KINDS, HONEST_NOTE, connectorFor, phase, TOTAL_MS } from "./data.ts";
import { SOURCES } from "./sources.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

const SLUG = "81-claude-connectors";

test("the five connectors, in the reel's order", () => {
  assert.deepEqual(
    CONNECTORS.map((c) => [c.id, c.name]),
    [
      ["perplexity", "Perplexity"],
      ["firecrawl", "Firecrawl"],
      ["posthog", "PostHog"],
      ["playwright", "Playwright"],
      ["composio", "Composio"],
    ],
  );
  assert.equal(connectorFor("posthog")?.name, "PostHog");
  assert.equal(connectorFor("nope"), undefined);
});

test("each one-liner is the reel's words", () => {
  assert.deepEqual(
    CONNECTORS.map((c) => c.line),
    [
      "Access to the most powerful research engine",
      "Lets Claude see the internet",
      "Your private investigator",
      "Gives Claude hands",
      "Connect every app at once",
    ],
  );
});

test("the honest line says they are official servers you add yourself, and some need a key", () => {
  assert.equal(HONEST_NOTE, "These are official MCP servers you add yourself. Some need an API key from the tool.");
});

test("every install line and every quote is in the README, word for word", () => {
  for (const c of CONNECTORS) {
    const lines = SOURCES[c.id];
    assert.ok(lines, c.id);
    assert.ok(lines.includes(c.quote), `${c.id} quote`);
    if (c.install.kind === "command") assert.ok(lines.includes(c.install.text), `${c.id} install`);
    else assert.ok(lines.some((l) => l.includes("`" + c.install.text + "`")), `${c.id} option`);
  }
});

test("the install lines are the ones the READMEs print", () => {
  assert.equal(
    connectorFor("perplexity").install.text,
    'claude mcp add --transport http perplexity https://api.perplexity.ai/mcp --header "Authorization: Bearer YOUR_API_KEY"',
  );
  assert.equal(connectorFor("firecrawl").install.text, "env FIRECRAWL_API_KEY=fc-YOUR_API_KEY npx -y firecrawl-mcp");
  assert.equal(connectorFor("posthog").install.text, "npx @posthog/wizard@latest mcp add");
  assert.equal(connectorFor("playwright").install.text, "claude mcp add playwright npx @playwright/mcp@latest");
  assert.deepEqual(connectorFor("composio").install, { kind: "option", text: "mcp: true", where: connectorFor("composio").install.where });
});

test("the key each one needs: three need a key, Playwright needs none", () => {
  assert.deepEqual(
    CONNECTORS.filter((c) => c.needsKey).map((c) => c.id),
    ["perplexity", "firecrawl", "composio"],
  );
  assert.match(connectorFor("perplexity").key, /Perplexity API key/);
  assert.match(connectorFor("firecrawl").key, /FIRECRAWL_API_KEY/);
  assert.match(connectorFor("composio").key, /COMPOSIO_API_KEY/);
  assert.match(connectorFor("playwright").key, /No API key/);
});

test("each source link is the official repo or docs", () => {
  assert.deepEqual(
    CONNECTORS.map((c) => c.href),
    [
      "https://github.com/perplexityai/modelcontextprotocol",
      "https://github.com/firecrawl/firecrawl-mcp-server",
      "https://github.com/PostHog/posthog/tree/master/services/mcp",
      "https://github.com/microsoft/playwright-mcp",
      "https://github.com/ComposioHQ/composio",
    ],
  );
  assert.equal(connectorFor("posthog").docs, "https://posthog.com/docs/model-context-protocol");
  assert.equal(connectorFor("composio").docs, "https://docs.composio.dev/docs/sessions-via-mcp");
});

test("the figure sends the call, the tool works, the answer comes back, in that order", () => {
  assert.equal(phase(0).step, "send");
  assert.equal(phase(0).p, 0);
  assert.equal(phase(TOTAL_MS / 4).step, "send");
  assert.equal(phase(TOTAL_MS / 2).step, "work");
  assert.equal(phase(TOTAL_MS * 0.8).step, "return");
  assert.equal(phase(TOTAL_MS).step, "done");
  assert.equal(phase(TOTAL_MS * 10).step, "done");
  for (const t of [0, 300, 900, 1600, 2400, 3000]) {
    const { p } = phase(t);
    assert.ok(p >= 0 && p <= 1, String(t));
  }
  assert.ok(TOTAL_MS <= 5000);
});

test("/free/81 opens this page with the reel's keyword, first in the list", () => {
  const drop = getDropByNumber("81");
  assert.equal(drop?.slug, SLUG);
  assert.equal(drop?.keyword, "CONNECT");
  assert.equal(getDrops()[0].number, 81);
  assert.deepEqual(
    drop?.tools.map((t) => [t.name, t.href]),
    CONNECTORS.map((c) => [c.name, c.href]),
  );
});

test("the figures sit on their chapters, in order", () => {
  const chapters = getDrop(SLUG)?.about?.chapters ?? [];
  assert.deepEqual(chapters.filter((c) => c.connect).map((c) => c.connect), [...CONNECT_KINDS]);
  assert.deepEqual([...CONNECT_KINDS], ["picker", "perplexity", "firecrawl", "posthog", "playwright", "composio"]);
});

test("the page's facts carry no Japanese and no emoji", () => {
  const text = JSON.stringify([CONNECTORS, HONEST_NOTE, getDrop(SLUG)]);
  assert.ok(!/[぀-ヿ㐀-鿿]/.test(text));
  assert.ok(!/\p{Extended_Pictographic}/u.test(text));
});

test("the page makes no time words and names no private path or company", () => {
  const text = JSON.stringify([getDrop(SLUG), CONNECTORS]);
  assert.equal(/just released|brand new|guaranteed|secret feature|hidden mode/i.test(text), false);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty|shorts-studio|Photo-Shoot/i.test(text), false);
});

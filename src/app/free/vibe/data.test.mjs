// Run: npm test  (node --test; Node strips the types from the .ts files, so no test runner is installed)
// These pin the page's facts to the four source repos and Anthropic's marketplace (read 2026-11-26, copied in sources.ts)
// and check the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CDT_FIRST_PROMPT,
  CDT_TABS,
  OMC_STAGES,
  OMC_TEAM,
  OMC_WORKERS,
  PLUGS,
  SB_MCP_URL,
  SB_TOOLS,
  VC_COMMANDS,
  VIBE_KINDS,
  deployCommand,
  plugFor,
  plugged,
  quotesIn,
  stripLabel,
} from "./data.ts";
import { SOURCES, plain } from "./sources.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

const SLUG = "79-vibe-coding-plugins";
const raw = (id) => SOURCES[id].join("\n");

test("the four, in the reel's order, each linking to its own repo", () => {
  assert.deepEqual(
    PLUGS.map((p) => [p.id, p.name, p.href]),
    [
      ["supabase", "Supabase", "https://github.com/supabase-community/supabase-plugin"],
      ["vercel", "Vercel", "https://github.com/vercel/vercel-plugin"],
      ["omc", "Oh My Claude Code", "https://github.com/Yeachan-Heo/oh-my-claudecode"],
      ["chrome-devtools", "Chrome DevTools MCP", "https://github.com/ChromeDevTools/chrome-devtools-mcp"],
    ],
  );
  for (const p of PLUGS) assert.equal(`https://${p.shown}`, p.href, p.id);
});

test("licences are what each repo states; only Oh My Claude Code is outside the official marketplace", () => {
  assert.deepEqual(
    PLUGS.map((p) => [p.id, p.license, p.official]),
    [
      ["supabase", "No license file in the repo", true],
      ["vercel", "Apache-2.0", true],
      ["omc", "MIT", false],
      ["chrome-devtools", "Apache-2.0", true],
    ],
  );
  assert.ok(raw("vercel").includes("[Apache-2.0](LICENSE)"));
  assert.ok(raw("omc").includes("License-MIT"));
  for (const name of ["supabase (", "vercel (", "chrome-devtools-mcp ("]) assert.ok(raw("marketplace").includes(name), name);
});

test("every install line is printed in a source, word for word", () => {
  assert.deepEqual(
    PLUGS.map((p) => [p.id, p.install.map((b) => [b.where, b.lines])]),
    [
      ["supabase", [["claude-code", ["/plugin install supabase@claude-plugins-official"]]]],
      ["vercel", [["terminal", ["npx plugins add vercel/vercel-plugin"]]]],
      [
        "omc",
        [
          ["claude-code", ["/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode", "/plugin install oh-my-claudecode"]],
          ["claude-code", ["/omc-setup"]],
        ],
      ],
      [
        "chrome-devtools",
        [["claude-code", ["/plugin marketplace add ChromeDevTools/chrome-devtools-mcp", "/plugin install chrome-devtools-mcp@chrome-devtools-plugins"]]],
      ],
    ],
  );
  for (const id of ["vercel", "omc", "chrome-devtools"]) {
    const p = plugFor(id);
    const src = p.sources[0];
    for (const block of p.install) for (const line of block.lines) assert.ok(plain(src).includes(line), `${id}: ${line}`);
  }
  // Supabase prints no line of its own: the line is the marketplace README's pattern with the name marketplace.json lists.
  assert.ok(raw("supabase").includes("Install the plugin from your agent's plugin marketplace"));
  assert.ok(raw("marketplace").includes("/plugin install {plugin-name}@claude-plugins-official"));
});

test("every sentence in curly quotes is in that card's sources, word for word", () => {
  let checked = 0;
  for (const p of PLUGS) {
    const strings = [p.then, ...p.know, ...p.install.map((b) => b.source)];
    for (const s of strings) {
      for (const q of quotesIn(s)) {
        assert.ok(p.sources.some((id) => plain(id).includes(q)), `${p.id}: “${q}”`);
        checked++;
      }
    }
  }
  assert.ok(checked >= 10, `checked ${checked}`);
});

test("what each one is and what it gives are the README's own words", () => {
  for (const p of PLUGS) assert.ok(plain(p.sources[0]).includes(p.does), p.id);
  for (const id of ["supabase", "omc", "chrome-devtools"]) {
    const p = plugFor(id);
    for (const line of p.gives) assert.ok(plain(p.sources[0]).includes(line), `${id}: ${line}`);
  }
  // Vercel's three counts are its README's section headings
  assert.deepEqual(plugFor("vercel").gives, ["40 skills", "3 specialist agents", "4 commands"]);
  for (const h of ["### Skills (40 skills)", "### Agents (3 specialists)", "### Commands (4 commands)"]) assert.ok(raw("vercel").includes(h), h);
});

test("every card has an install, a next step and at least three things to know", () => {
  for (const p of PLUGS) {
    assert.ok(p.install.every((b) => b.lines.length && b.source.length), p.id);
    assert.ok(p.then.length > 0, p.id);
    assert.ok(p.know.length >= 3, p.id);
    assert.equal(p.mark.length, 2, p.id);
  }
});

test("the power strip counts what is plugged in, in the reel's order", () => {
  assert.equal(stripLabel(0), "CLAUDE CODE 0/4");
  assert.equal(stripLabel(4), "CLAUDE CODE 4/4");
  assert.deepEqual(plugged(["chrome-devtools", "supabase"]), ["supabase", "chrome-devtools"]);
  assert.deepEqual(plugged(["superpowers", "omc"]), ["omc"]);
  assert.deepEqual(plugged([]), []);
});

test("Supabase: the MCP address and the four tools are the server's own", () => {
  assert.ok(raw("supabase").includes(`(\`${SB_MCP_URL}\`)`));
  assert.deepEqual(
    SB_TOOLS.map((t) => t.name),
    ["execute_sql", "apply_migration", "generate_typescript_types", "get_advisors"],
  );
  for (const t of SB_TOOLS) {
    assert.ok(plain("supabaseMcp").includes(`${t.name}: '`), t.name);
    assert.ok(plain("supabaseMcp").includes(t.line), t.name);
  }
});

test("Vercel: the four commands and their purposes are the README's table", () => {
  assert.deepEqual(
    VC_COMMANDS.map((c) => c.command),
    ["/vercel-plugin:bootstrap", "/vercel-plugin:deploy", "/vercel-plugin:env", "/vercel-plugin:status"],
  );
  for (const c of VC_COMMANDS) assert.ok(plain("vercel").includes(`| ${c.command} | ${c.purpose} |`), c.command);
  assert.equal(deployCommand("preview"), "/vercel-plugin:deploy");
  assert.equal(deployCommand("production"), "/vercel-plugin:deploy prod");
  assert.ok(raw("vercel").includes("/vercel-plugin:deploy prod"));
});

test("Oh My Claude Code: the team line and the five stages are the README's", () => {
  assert.ok(raw("omc").includes(OMC_TEAM));
  assert.ok(OMC_TEAM.includes(`${OMC_WORKERS}:executor`));
  assert.ok(raw("omc").includes(`\`${OMC_STAGES.join(" → ")} (loop)\``));
  assert.ok(raw("omc").includes("**19 specialized agents**"));
});

test("Chrome DevTools: the four tabs and the first prompt are the README's", () => {
  assert.deepEqual(
    CDT_TABS.map((t) => t.id),
    ["console", "network", "screenshot", "performance"],
  );
  for (const t of CDT_TABS) assert.ok(plain("cdt").includes(t.line), t.id);
  assert.ok(raw("cdt").includes(CDT_FIRST_PROMPT));
});

test("the page's facts carry no Japanese and no emoji", () => {
  const text = JSON.stringify([PLUGS, SB_TOOLS, VC_COMMANDS, OMC_STAGES, CDT_TABS, getDrop(SLUG)]);
  assert.ok(!/[぀-ヿ㐀-鿿]/.test(text));
  assert.ok(!/\p{Extended_Pictographic}/u.test(text));
});

test("/free/79 opens this page with the reel's keyword, first in the list", () => {
  const drop = getDropByNumber("79");
  assert.equal(drop?.slug, SLUG);
  assert.equal(drop?.keyword, "CODING");
  assert.equal(getDrops()[0].number, 79);
  assert.deepEqual(
    drop?.tools.map((t) => [t.name, t.href]),
    PLUGS.map((p) => [p.name, p.href]),
  );
});

test("the figures sit on their chapters, in order", () => {
  const chapters = getDrop(SLUG)?.about?.chapters ?? [];
  assert.deepEqual(chapters.filter((c) => c.vibe).map((c) => c.vibe), [...VIBE_KINDS]);
});

test("the page makes no time words and names no private path or company", () => {
  const text = JSON.stringify([getDrop(SLUG), PLUGS]);
  assert.equal(/just released|right now|this week|brand new|guaranteed/i.test(text), false);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty/i.test(text), false);
});

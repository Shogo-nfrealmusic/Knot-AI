// Run: npm test  (node --test; Node strips the types from data.ts, so no test runner is installed)
// These pin the page's facts to the five source repos (READMEs read 2026-11-14) and to the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import { HERO, MEMORY_STEPS, OMNI_NUMBERS, PLUGINS, PROBLEMS, SCENARIOS, TIERS, pluginFor, savedPercent } from "./data.ts";
import { getDrop, getDropByNumber } from "../../../lib/free.ts";

test("the five plugins, in the reel's order", () => {
  assert.deepEqual(
    PLUGINS.map((p) => p.name),
    ["OmniRoute", "Claude Mem", "Headroom", "Claude Code Setup", "Task Observer"],
  );
  assert.deepEqual(
    PLUGINS.map((p) => p.id),
    ["omniroute", "claude-mem", "headroom", "claude-code-setup", "task-observer"],
  );
});

test("every link goes to the original repo, not a fork", () => {
  assert.deepEqual(
    PLUGINS.map((p) => p.href),
    [
      "https://github.com/cheaper-inference/OmniRoute",
      "https://github.com/thedotmack/claude-mem",
      "https://github.com/headroomlabs-ai/headroom",
      "https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup",
      "https://github.com/rebelytics/one-skill-to-rule-them-all",
    ],
  );
});

test("the licenses are the ones each repo states", () => {
  assert.deepEqual(
    PLUGINS.map((p) => p.license),
    ["MIT", "Apache-2.0", "Apache-2.0", "Apache-2.0", "CC BY 4.0"],
  );
  assert.equal(pluginFor("task-observer")?.by, "Eoghan Henn / rebelytics.com");
});

test("the install lines are each README's, word for word", () => {
  assert.deepEqual(
    PLUGINS.map((p) => [p.id, p.install.map((block) => [block.where, block.lines])]),
    [
      ["omniroute", [["terminal", ["npm install -g omniroute", "omniroute"]]]],
      [
        "claude-mem",
        [
          ["terminal", ["npx claude-mem install"]],
          ["claude-code", ["/plugin marketplace add thedotmack/claude-mem", "/plugin install claude-mem"]],
        ],
      ],
      ["headroom", [["terminal", ['uv tool install --python 3.13 "headroom-ai[all]"', "headroom wrap claude"]]]],
      ["claude-code-setup", [["claude-code", ["/plugin install claude-code-setup@claude-plugins-official"]]]],
      ["task-observer", [["terminal", ["npx skills add rebelytics/one-skill-to-rule-them-all --skill task-observer"]]]],
    ],
  );
});

test("every install block says where its line comes from", () => {
  for (const p of PLUGINS) {
    for (const block of p.install) assert.ok(block.source.length > 0, p.name);
  }
});

test("the five problems open the five plugins, one each, in the same order", () => {
  assert.deepEqual(
    PROBLEMS.map((problem) => [problem.label, problem.plugin]),
    [
      ["It cuts me off mid-task", "omniroute"],
      ["It forgets my project", "claude-mem"],
      ["It burns through my tokens", "headroom"],
      ["I don't know what to set up", "claude-code-setup"],
      ["My skills never improve", "task-observer"],
    ],
  );
});

test("picking a plugin returns it; an unknown one returns nothing", () => {
  assert.equal(pluginFor("headroom")?.name, "Headroom");
  assert.equal(pluginFor("claude-code-setup")?.license, "Apache-2.0");
  assert.equal(pluginFor("superpowers"), undefined);
});

test("every card has the README's line, a way in and something to know first", () => {
  for (const p of PLUGINS) {
    assert.ok(p.fixes.length > 0, p.name);
    assert.ok(p.install.length > 0, p.name);
    assert.ok(p.know.length >= 2, p.name);
  }
});

test("OmniRoute's numbers are the README's current ones, not the reel's", () => {
  assert.deepEqual(
    OMNI_NUMBERS.map((n) => [n.value, n.label]),
    [
      ["393", "AI providers"],
      ["150+", "free tiers"],
      ["~1.62B", "free tokens/mo"],
    ],
  );
  const text = JSON.stringify([PLUGINS, OMNI_NUMBERS]);
  assert.ok(!/200\+|two hundred|1\.5 ?B|1\.5 billion/i.test(text));
});

test("the four fallback tiers, in the README's order", () => {
  assert.deepEqual(TIERS, ["Subscription", "API Key", "Cheap", "Free"]);
});

test("claude-mem's three steps are the README's headings", () => {
  assert.deepEqual(
    MEMORY_STEPS.map((s) => s.title),
    ["Your agent works.", "The observer takes notes.", "The next session starts with them."],
  );
});

test("Headroom's four measured scenarios are the README's table", () => {
  assert.deepEqual(
    SCENARIOS.map((s) => [s.name, s.before, s.after, s.saved]),
    [
      ["Code search (100 results)", 17199, 13597, 21],
      ["SRE incident debugging", 55957, 24340, 57],
      ["Codebase exploration", 58801, 33895, 42],
      ["GitHub issue triage", 46067, 32429, 30],
    ],
  );
});

test("the figure opens on the README's own picture: 55,957 to 24,340", () => {
  assert.equal(HERO.before, 55957);
  assert.equal(HERO.after, 24340);
  assert.equal(HERO.id, "sre");
});

test("each scenario's saved percent agrees with its own before and after", () => {
  for (const s of SCENARIOS) assert.equal(savedPercent(s.before, s.after), s.saved, s.name);
  assert.equal(savedPercent(0, 0), 0);
});

test("the page's facts carry no Japanese and no emoji", () => {
  const text = JSON.stringify([PLUGINS, PROBLEMS, SCENARIOS, MEMORY_STEPS, OMNI_NUMBERS, TIERS]);
  assert.ok(!/[぀-ヿ㐀-鿿]/.test(text));
  assert.ok(!/\p{Extended_Pictographic}/u.test(text));
});

test("/free/67 is wired: number, slug, keyword and the five tools in order", () => {
  const drop = getDropByNumber("67");
  assert.equal(drop?.slug, "67-claude-code-plugins");
  assert.equal(drop?.keyword, "CLAUDE");
  assert.equal(getDrop("67-claude-code-plugins")?.number, 67);
  assert.deepEqual(
    drop?.tools.map((tool) => [tool.name, tool.href]),
    PLUGINS.map((p) => [p.name, p.href]),
  );
});

test("the page has the picker first, then one chapter per plugin", () => {
  const chapters = getDropByNumber("67")?.about?.chapters ?? [];
  assert.deepEqual(
    chapters.map((chapter) => chapter.plugins),
    ["picker", "omniroute", "claude-mem", "headroom", "claude-code-setup", "task-observer"],
  );
});

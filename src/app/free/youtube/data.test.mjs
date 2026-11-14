// Run: npm test  (node --test; Node strips the types from data.ts and hooks.ts, so no test runner is installed)
// These pin the page's facts to the source repo (README and skills/yt-script/hooks.json, read 2026-11-14).
import assert from "node:assert/strict";
import { test } from "node:test";
import { COMMANDS, INSTALL, REPO, commandFor } from "./data.ts";
import { HOOKS, HOOK_RULES, hookNumber } from "./hooks.ts";

test("every link goes to the original repo, not a fork", () => {
  assert.equal(REPO, "https://github.com/Jakeschincariol/youtube-agent-skill");
});

test("the three ways to install are the README's lines, word for word", () => {
  assert.deepEqual(
    INSTALL.map((way) => [way.id, way.body]),
    [
      ["claude", "https://github.com/Jakeschincariol/youtube-agent-skill\n\nInstall this skill, then confirm /yt-script works."],
      ["code", "git clone https://github.com/Jakeschincariol/youtube-agent-skill.git\ncp -r youtube-agent-skill/skills/yt-* ~/.claude/skills/"],
      ["plugin", "/plugin marketplace add Jakeschincariol/youtube-agent-skill\n/plugin install youtube-agent"],
    ],
  );
});

test("the eleven commands, in the README's order", () => {
  assert.deepEqual(
    COMMANDS.map((c) => c.command),
    ["/yt-script", "/yt-package", "/yt-edit", "/yt-comment", "/yt-plan", "/yt-viral", "/yt-retention", "/yt-shorts", "/yt-seo", "/yt-chapters", "/yt-audit"],
  );
});

test("six commands run a Python tool, the six the README lists", () => {
  assert.deepEqual(
    COMMANDS.filter((c) => c.tool).map((c) => [c.command, c.tool.file]),
    [
      ["/yt-script", "hookscore.py"],
      ["/yt-package", "title.py"],
      ["/yt-edit", "deadair.py"],
      ["/yt-viral", "swipe.py"],
      ["/yt-retention", "retention.py"],
      ["/yt-chapters", "chapters.py"],
    ],
  );
});

test("every command has a job to pick and the README's line", () => {
  for (const c of COMMANDS) {
    assert.ok(c.want.length > 0, c.command);
    assert.ok(c.does.length > 0, c.command);
  }
  assert.equal(new Set(COMMANDS.map((c) => c.id)).size, COMMANDS.length);
});

test("picking a job returns its command; an unknown job returns nothing", () => {
  assert.equal(commandFor("viral")?.command, "/yt-viral");
  assert.equal(commandFor("audit")?.does, "The whole channel, ending in ONE fix rather than twenty.");
  assert.equal(commandFor("upload"), undefined);
});

test("the 21 hook formulas, in the order of hooks.json", () => {
  assert.deepEqual(
    HOOKS.map((h) => h.name),
    [
      "The Statistic",
      "Someone Else's Result",
      "The Mistake",
      "Contrarian Flip",
      "The Reveal",
      "The Superlative",
      "The Clock",
      "I Tried It",
      "The Question",
      "Before and After",
      "The Teardown",
      "The Stack",
      "The Warning",
      "The List",
      "The Receipt",
      "The Insider",
      "The Impossible Claim",
      "The Comparison",
      "The Origin",
      "The Deadline",
      "The Direct Address",
    ],
  );
});

test("every formula carries its shape, a worked example and its failure mode", () => {
  for (const h of HOOKS) {
    assert.ok(h.shape && h.example && h.failsWhen, h.name);
  }
  assert.equal(new Set(HOOKS.map((h) => h.id)).size, 21);
});

test("the numbers the reel shows match the list (#3, #7, #12, #16, #21)", () => {
  assert.equal(hookNumber("the-mistake"), 3);
  assert.equal(hookNumber("the-clock"), 7);
  assert.equal(hookNumber("the-stack"), 12);
  assert.equal(hookNumber("the-insider"), 16);
  assert.equal(hookNumber("the-direct-address"), 21);
  assert.equal(hookNumber("not-a-formula"), 0);
});

test("the five rules that come with the formulas", () => {
  assert.equal(HOOK_RULES.length, 5);
  assert.equal(HOOK_RULES[1], "One idea. A hook carrying two promises keeps neither.");
});

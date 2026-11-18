// Run: npm test  (node --test; Node strips the types from data.ts, so no test runner is installed)
// These pin what the figures of /free/70 show and the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import { BUILD, CHECKS, DEFAULT_RATE, GTA_KINDS, MR_BOSS, RATES, SEARCHES, TOOLS, VIEW_STEPS, earnings, searchPrompt } from "./data.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

test("the three searches are the reel's", () => {
  assert.deepEqual(SEARCHES.map((s) => s.query), ["every car in GTA 6", "every mission in GTA 6", "every secret in GTA 6"]);
  for (const s of SEARCHES) assert.equal(s.outline.length, 3, s.id);
});

test("the first prompt carries the search and allows only sourced claims", () => {
  const p = searchPrompt("every car in GTA 6");
  assert.match(p, /"every car in GTA 6"/);
  assert.match(p, /Use only what the sources show/);
});

test("the reel's math: $2 per 1,000 views", () => {
  assert.equal(DEFAULT_RATE, 2);
  assert.ok(RATES.includes(DEFAULT_RATE));
  assert.equal(earnings(1000, 2), 2);
  assert.equal(earnings(1000000, 2), 2000);
  assert.ok(VIEW_STEPS.includes(1000000));
});

test("MrBossFTW's views at $2 per 1,000 round to the reel's $3.4M", () => {
  assert.equal(MR_BOSS.views, 1689394000);
  assert.equal(Math.round(earnings(MR_BOSS.views, 2) / 100000) / 10, 3.4);
  assert.equal(MR_BOSS.viewsSource, "vidIQ");
});

test("the setup says plainly what is free and what is not", () => {
  assert.deepEqual(TOOLS.map((t) => t.id), ["claude", "remotion", "kokoro"]);
  assert.match(TOOLS.find((t) => t.id === "claude").note, /not free/);
  assert.match(TOOLS.find((t) => t.id === "remotion").note, /up to 3 employees/);
  assert.match(TOOLS.find((t) => t.id === "kokoro").note, /Apache-2\.0/);
  for (const t of TOOLS) assert.match(t.href, /^https:\/\/github\.com\//);
});

test("five build steps, each with a prompt, and nothing uploads by itself", () => {
  assert.equal(BUILD.length, 5);
  assert.equal(new Set(BUILD.map((s) => s.id)).size, 5);
  for (const s of BUILD) assert.ok(s.prompt.length > 100, s.id);
  assert.match(BUILD.at(-1).prompt, /Do not upload anything/);
  assert.match(BUILD.find((s) => s.id === "video").prompt, /Never play a trailer straight through/);
});

test("the last check covers sources, commentary, clips and a human watching", () => {
  assert.deepEqual(CHECKS.map((c) => c.id), ["facts", "voice", "clips", "title", "ai", "watch"]);
});

test("/free/70 opens the GTA channel page with the reel's keyword", () => {
  const drop = getDropByNumber("70");
  assert.equal(drop?.slug, "70-gta-channel");
  assert.equal(drop?.keyword, "CHANNEL");
  assert.ok(getDrops().some((d) => d.number === 70));
});

test("one figure per chapter, in order", () => {
  const chapters = getDrop("70-gta-channel")?.about?.chapters ?? [];
  assert.deepEqual(chapters.map((c) => c.gta), [...GTA_KINDS]);
});

test("the page names no private path or company", () => {
  const text = JSON.stringify([getDrop("70-gta-channel"), SEARCHES, TOOLS, BUILD, CHECKS]);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty/i.test(text), false);
});

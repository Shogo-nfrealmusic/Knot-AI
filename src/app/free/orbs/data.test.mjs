// Run: npm test  (node --test; Node strips the types from the .ts files, so no test runner is installed)
// These pin the page's facts to the source repo (README.md and LICENSE of github.com/Jakubantalik/thinking-orbs, MIT),
// run the vendored engine itself, and check the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  A11Y,
  COPYRIGHT,
  INSTALL,
  MIT_CONDITION,
  NPM_VERSION,
  ORBS_KINDS,
  QUICK_START,
  REPO,
  REST_SECONDS,
  SIZES,
  SPEED,
  STATES,
  TAGLINE,
  THEMES,
  USES,
  buildPrompt,
  orbTime,
  snippet,
} from "./data.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

// The vendored engine imports its siblings without a file extension (as a bundler allows). Node needs the ".ts",
// so for files inside vendor/ only, try the name with ".ts" added. The engine's code itself stays unchanged.
const VENDOR = new URL("./vendor/thinking-orbs/", import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier) && context.parentURL?.startsWith(VENDOR.href)) {
      return next(`${specifier}.ts`, context);
    }
    return next(specifier, context);
  },
});
const { MODE_FRAMES } = await import("./vendor/thinking-orbs/engine/registry.ts");
const { paintFrame } = await import("./vendor/thinking-orbs/engine/core.ts");
const { resolvePreset, STATE_TO_MODE } = await import("./vendor/thinking-orbs/presets.ts");

const README = readFileSync(new URL("UPSTREAM_README.md", VENDOR), "utf8");
const LICENSE = readFileSync(new URL("LICENSE", VENDOR), "utf8");

test("every link goes to the author's repo", () => {
  assert.equal(REPO, "https://github.com/Jakubantalik/thinking-orbs");
  assert.ok(README.includes("[Repository](https://github.com/Jakubantalik/thinking-orbs)"));
  assert.equal(NPM_VERSION, "0.3.2");
});

test("the tagline, install line and Quick start are the README's, verbatim", () => {
  assert.ok(README.includes(TAGLINE));
  assert.ok(README.includes("```bash\n" + INSTALL + "\n```"));
  assert.ok(README.includes("```tsx\n" + QUICK_START + "\n```"));
});

test("the nine states are the README's, in its order, with its comments", () => {
  assert.equal(STATES.length, 9);
  for (const { state, does } of STATES) {
    assert.ok(README.includes(`<ThinkingOrb state="${state}" />`), state);
    assert.match(README, new RegExp(`state="${state}" />\\s+\\{/\\* ${does.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\*/\\}`), state);
  }
  const order = STATES.map((s) => README.indexOf(`<ThinkingOrb state="${s.state}" />`));
  assert.deepEqual(order, [...order].sort((a, b) => a - b));
  assert.deepEqual(Object.keys(STATE_TO_MODE), STATES.map((s) => s.state));
});

test("sizes, themes and the accessibility lines are the README's", () => {
  assert.deepEqual(SIZES.map((s) => s.size), [64, 20]);
  assert.ok(README.includes("`64` for chat-avatar scale, `20` for inline-text scale"));
  for (const { theme, does } of THEMES) assert.ok(README.includes(`<ThinkingOrb theme="${theme}" />`) && README.includes(does), theme);
  for (const line of A11Y) assert.ok(README.includes(`- ${line}`), line);
});

test("every activity maps to one of the nine, and the nine are all used", () => {
  const names = new Set(STATES.map((s) => s.state));
  for (const use of USES) assert.ok(names.has(use.state), use.id);
  assert.deepEqual(new Set(USES.map((u) => u.state)), names);
  assert.deepEqual(
    USES.map((u) => [u.label, u.state]),
    [
      ["web search", "searching"],
      ["reasoning or code", "solving"],
      ["tool calls", "connecting"],
      ["writing", "composing"],
      ["voice", "listening"],
      ["a multi-step plan", "weaving"],
      ["waiting", "breathing"],
      ["images or design", "shaping"],
      ["anything else", "working"],
    ],
  );
});

test("the prompt lists only the picked activities, in order, and falls back to all of them", () => {
  const two = buildPrompt(["write", "search"]);
  assert.ok(two.startsWith("Add thinking-orbs to my app"));
  assert.ok(two.indexOf('state="searching"') < two.indexOf('state="composing"'));
  assert.equal(/state="(solving|connecting|listening|weaving|breathing|shaping|working)"/.test(two), false);
  assert.equal(buildPrompt([]), buildPrompt(USES.map((u) => u.id)));
  assert.equal(buildPrompt([]).split("\n").filter((l) => l.startsWith("- state=")).length, 9);
});

test("the playground's snippet leaves the defaults out", () => {
  assert.equal(snippet({ state: "searching", size: 64, speed: 1 }), '<ThinkingOrb state="searching" size={64} />');
  assert.equal(snippet({ state: "solving", size: 20, speed: 1.5 }), '<ThinkingOrb state="solving" size={20} speed={1.5} />');
  assert.ok(SPEED.min > 0 && SPEED.min <= SPEED.initial && SPEED.initial <= SPEED.max);
});

test("the vendored engine draws every state at both sizes, the same frame for the same time", () => {
  for (const { state } of STATES) {
    for (const { size } of SIZES) {
      const { mode, speed, opts } = resolvePreset(state, size);
      const t = orbTime(REST_SECONDS, speed, 1);
      const a = MODE_FRAMES[mode](size, t, opts);
      const b = MODE_FRAMES[mode](size, t, opts);
      assert.ok(a.dots.length > 0, `${state} ${size}`);
      assert.deepEqual(a, b, `${state} ${size} is deterministic`);
      for (const d of a.dots) assert.ok(Number.isFinite(d.x) && Number.isFinite(d.y) && d.r > 0, `${state} ${size}`);
      const later = MODE_FRAMES[mode](size, orbTime(REST_SECONDS + 0.5, speed, 1), opts);
      assert.notDeepEqual(later, a, `${state} ${size} moves`);
    }
  }
});

test("the 20 preset is its own design, not the 64 one scaled down", () => {
  const big = resolvePreset("working", 64);
  const small = resolvePreset("working", 20);
  assert.notDeepEqual(small.opts, big.opts);
  assert.notEqual(small.speed, big.speed);
});

test("paintFrame draws one arc per dot, mirroring the ink on dark backgrounds", () => {
  const { mode, speed, opts } = resolvePreset("searching", 64);
  const frame = MODE_FRAMES[mode](64, orbTime(REST_SECONDS, speed, 1), opts);
  const fills = { light: [], dark: [] };
  for (const dark of [false, true]) {
    let arcs = 0;
    const ctx = {
      set fillStyle(v) { fills[dark ? "dark" : "light"].push(v); },
      set strokeStyle(_) {},
      set lineWidth(_) {},
      beginPath() {},
      arc() { arcs += 1; },
      fill() {},
      moveTo() {},
      lineTo() {},
      stroke() {},
    };
    paintFrame(ctx, frame, dark);
    assert.equal(arcs, frame.dots.length);
  }
  const grey = (s) => Number(/rgba\((\d+),/.exec(s)[1]);
  assert.equal(grey(fills.light[0]) + grey(fills.dark[0]), 255);
});

test("the vendored code keeps the MIT licence and a credit line on every file", () => {
  assert.ok(LICENSE.startsWith("MIT License\n\n" + COPYRIGHT));
  assert.ok(LICENSE.replace(/\s+/g, " ").includes(MIT_CONDITION));
  const files = readdirSync(fileURLToPath(VENDOR), { recursive: true }).filter((f) => f.endsWith(".ts"));
  assert.equal(files.length, 12);
  for (const f of files) {
    assert.ok(readFileSync(new URL(f, VENDOR), "utf8").startsWith("// Vendored from github.com/Jakubantalik/thinking-orbs: MIT, (c) 2026 Jakub Antalik."), f);
  }
});

test("/free/78 opens the Thinking Orbs page with the reel's keyword", () => {
  const drop = getDropByNumber("78");
  assert.equal(drop?.slug, "78-thinking-orbs");
  assert.equal(drop?.keyword, "ORBS");
  assert.equal(getDrops()[0].number, 78);
  assert.deepEqual(getDrop("78-thinking-orbs")?.tools.map((t) => t.href), [REPO]);
});

test("the figures sit on their chapters, in order", () => {
  const chapters = getDrop("78-thinking-orbs")?.about?.chapters ?? [];
  assert.deepEqual(chapters.filter((c) => c.orbs).map((c) => c.orbs), [...ORBS_KINDS]);
  const install = chapters.find((c) => c.commands?.includes(INSTALL));
  assert.ok(install?.code?.some((b) => b.body === QUICK_START));
});

test("the licence chapter says what MIT allows and the one thing it asks", () => {
  const text = JSON.stringify(getDrop("78-thinking-orbs")?.about?.chapters?.at(-1));
  assert.match(text, /paid product/);
  assert.match(text, /copyright notice/);
});

test("the page makes no time words and names no private path or company", () => {
  const text = JSON.stringify(getDrop("78-thinking-orbs"));
  assert.equal(/just released|right now|this week|brand new|guaranteed/i.test(text), false);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty/i.test(text), false);
});

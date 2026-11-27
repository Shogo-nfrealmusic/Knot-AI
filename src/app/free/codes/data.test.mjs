// Run: npm test  (node --test; Node strips the types from the .ts files, so no test runner is installed)
// These pin the page's facts: the five codes in the reel's order, the ready prompts, the example chats,
// the official ultrathink line (copied in sources.ts), and the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CODES,
  CODES_KINDS,
  OFFICIAL_NOTE,
  ULTRATHINK_DOC,
  ULTRATHINK_QUOTE,
  answerChars,
  codeFor,
  segments,
  sliceLines,
  timeline,
} from "./data.ts";
import { SOURCES } from "./sources.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

const SLUG = "80-secret-claude-codes";

test("the five codes, in the reel's order", () => {
  assert.deepEqual(
    CODES.map((c) => [c.id, c.code]),
    [
      ["l99", "L99"],
      ["ooda", "OODA"],
      ["ghost", "/ghost"],
      ["scaffold", "Scaffold"],
      ["ultrathink", "ultrathink"],
    ],
  );
  assert.equal(codeFor("ghost")?.code, "/ghost");
  assert.equal(codeFor("nope"), undefined);
});

test("only ultrathink is official; the note says so in one line", () => {
  assert.deepEqual(
    CODES.filter((c) => c.official).map((c) => c.id),
    ["ultrathink"],
  );
  assert.equal(OFFICIAL_NOTE, "ultrathink is an official Claude Code keyword; the other four are prompt prefixes you type yourself.");
});

test("each ready prompt starts with its code, and is the example question", () => {
  for (const c of CODES) {
    assert.ok(c.prompt.toLowerCase().startsWith(c.code.toLowerCase() + " "), c.id);
    assert.ok(c.prompt.length > c.code.length + 10, c.id);
  }
  assert.equal(codeFor("l99").prompt, "L99 how do I start implementing AI in my business?");
  assert.equal(codeFor("ooda").prompt, "OODA what's the best AI automation for my business right now?");
  assert.equal(codeFor("ghost").prompt, "/ghost write me a short outreach email");
  assert.equal(codeFor("scaffold").prompt, "scaffold an AI automation agency");
  assert.equal(codeFor("ultrathink").prompt, "ultrathink a high-level AI automation plan for a 2-person company");
});

test("what each code does keeps the reel's claims", () => {
  assert.match(codeFor("l99").does, /before your prompt/);
  assert.match(codeFor("l99").does, /it depends/);
  for (const step of ["Observe", "Orient", "Decide", "Act"]) assert.ok(codeFor("ooda").does.includes(step), step);
  assert.match(codeFor("ooda").does, /military decision framework/);
  assert.match(codeFor("ghost").does, /human wrote it/);
  assert.match(codeFor("scaffold").does, /every step mapped out/);
  assert.match(codeFor("ultrathink").does, /much deeper/);
});

test("OODA's answer walks the four steps; Scaffold's has five steps", () => {
  const ooda = codeFor("ooda").answer.join("\n");
  for (const step of ["**Observe**", "**Orient**", "**Decide**", "**Act**"]) assert.ok(ooda.includes(step), step);
  assert.equal(codeFor("scaffold").answer.filter((l) => /^\*\*Step \d:/.test(l)).length, 5);
});

test("/ghost lists the AI phrases it cuts, and the email it keeps has none of them", () => {
  const g = codeFor("ghost");
  assert.deepEqual(g.cut, ["I hope this email finds you well.", "delve", "—", "In today's fast-paced world,", "leverage"]);
  const kept = g.answer.join("\n");
  for (const phrase of g.cut) assert.equal(kept.includes(phrase), false, phrase);
  for (const c of CODES) if (c.id !== "ghost") assert.equal(c.cut, undefined, c.id);
});

test("the ultrathink line is the official doc's, word for word", () => {
  assert.equal(ULTRATHINK_DOC, "https://code.claude.com/docs/en/model-config");
  assert.equal(ULTRATHINK_QUOTE, "Include `ultrathink` anywhere in your prompt to request deeper reasoning on that turn");
  assert.ok(SOURCES.modelConfig.some((line) => line.startsWith(ULTRATHINK_QUOTE)));
  assert.equal(codeFor("ultrathink").source?.href, ULTRATHINK_DOC);
});

test("bold markup splits into segments", () => {
  assert.deepEqual(segments("**Observe** — leads"), [
    { text: "Observe", bold: true },
    { text: " — leads", bold: false },
  ]);
  assert.deepEqual(segments("plain"), [{ text: "plain", bold: false }]);
  assert.deepEqual(segments(""), []);
});

test("streaming shows the first n characters across lines, never the markup", () => {
  const lines = ["**Ab** cd", "ef"];
  assert.equal(answerChars(lines), 7);
  assert.deepEqual(sliceLines(lines, 0), []);
  assert.deepEqual(sliceLines(lines, 1), [[{ text: "A", bold: true }]]);
  assert.deepEqual(sliceLines(lines, 5), [[{ text: "Ab", bold: true }, { text: " cd", bold: false }]]);
  assert.deepEqual(sliceLines(lines, 6), [[{ text: "Ab", bold: true }, { text: " cd", bold: false }], [{ text: "e", bold: false }]]);
  assert.deepEqual(sliceLines(lines, 99), sliceLines(lines, 7));
});

test("each chat types the prompt, thinks, then streams, in that order", () => {
  for (const c of CODES) {
    const tl = timeline(c);
    assert.ok(tl.typed > 0 && tl.typed < tl.thought && tl.thought < tl.total, c.id);
    assert.ok(tl.total <= 12000, `${c.id}: ${tl.total}`);
  }
  // ultrathink thinks longer than the others
  assert.ok(timeline(codeFor("ultrathink")).thought - timeline(codeFor("ultrathink")).typed > timeline(codeFor("l99")).thought - timeline(codeFor("l99")).typed);
});

test("/free/80 opens this page with the reel's keyword, first in the list", () => {
  const drop = getDropByNumber("80");
  assert.equal(drop?.slug, SLUG);
  assert.equal(drop?.keyword, "CODES");
  assert.equal(getDrops()[0].number, 80);
});

test("the figures sit on their chapters, in order", () => {
  const chapters = getDrop(SLUG)?.about?.chapters ?? [];
  assert.deepEqual(chapters.filter((c) => c.codes).map((c) => c.codes), [...CODES_KINDS]);
  assert.deepEqual([...CODES_KINDS], ["chat", "l99", "ooda", "ghost", "scaffold", "ultrathink"]);
});

test("the page's facts carry no Japanese and no emoji", () => {
  const text = JSON.stringify([CODES, OFFICIAL_NOTE, getDrop(SLUG)]);
  assert.ok(!/[぀-ヿ㐀-鿿]/.test(text));
  assert.ok(!/\p{Extended_Pictographic}/u.test(text));
});

test("the page makes no time words and names no private path or company", () => {
  const text = JSON.stringify([getDrop(SLUG), CODES]);
  // (the example chats say "right now" and "this week" as part of the user's question and the plan; those are not claims about the codes)
  assert.equal(/just released|brand new|guaranteed|secret feature|hidden mode/i.test(text), false);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty/i.test(text), false);
});

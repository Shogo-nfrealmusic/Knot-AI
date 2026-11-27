// Run: npm test. The pure parts of the module pages: the inline text parser, per-module lab ticks, and the diagnostic.
import assert from "node:assert/strict";
import { test } from "node:test";
import { parseInline } from "./markup.ts";
import { parseAnswers, parseTicks, toggleTick, withAnswer } from "./progress.ts";
import { ANSWER_KEY, PARTS, QUESTIONS, adviceFor, scoreParts, startWith, totalScore } from "./content/diagnostic.ts";

/* ───────────── inline text ───────────── */

test("plain text stays one text token", () => {
  assert.deepEqual(parseInline("Back the vault up."), [{ t: "text", v: "Back the vault up." }]);
});

test("bold, code and links come out as their own tokens, in order", () => {
  assert.deepEqual(parseInline("**Never.** Run `npm test` and read [Memory](https://code.claude.com/docs/en/memory)."), [
    { t: "b", c: [{ t: "text", v: "Never." }] },
    { t: "text", v: " Run " },
    { t: "code", v: "npm test" },
    { t: "text", v: " and read " },
    { t: "a", href: "https://code.claude.com/docs/en/memory", c: [{ t: "text", v: "Memory" }] },
    { t: "text", v: "." },
  ]);
});

test("code inside bold is still code", () => {
  assert.deepEqual(parseInline("**`--allowedTools` does not restrict anything.**"), [
    { t: "b", c: [{ t: "code", v: "--allowedTools" }, { t: "text", v: " does not restrict anything." }] },
  ]);
});

test("asterisks inside code are not emphasis", () => {
  assert.deepEqual(parseInline("`mcp__*__*merge*` for any MCP server"), [
    { t: "code", v: "mcp__*__*merge*" },
    { t: "text", v: " for any MCP server" },
  ]);
});

test("single asterisks make italics; a lone asterisk is just text", () => {
  assert.deepEqual(parseInline("(Sharma et al., *Towards Understanding Sycophancy*, ICLR 2024)"), [
    { t: "text", v: "(Sharma et al., " },
    { t: "i", c: [{ t: "text", v: "Towards Understanding Sycophancy" }] },
    { t: "text", v: ", ICLR 2024)" },
  ]);
  assert.deepEqual(parseInline("3 * 4"), [{ t: "text", v: "3 * 4" }]);
});

test("a link inside brackets keeps the brackets around it", () => {
  assert.deepEqual(parseInline("([Hooks](https://code.claude.com/docs/en/hooks))"), [
    { t: "text", v: "(" },
    { t: "a", href: "https://code.claude.com/docs/en/hooks", c: [{ t: "text", v: "Hooks" }] },
    { t: "text", v: ")" },
  ]);
});

test("only https links become links; anything else stays as written", () => {
  assert.deepEqual(parseInline("[x](javascript:alert(1))"), [{ t: "text", v: "[x](javascript:alert(1))" }]);
});

/* ───────────── lab ticks, one list per module ───────────── */

const IDS = ["own-lab", "interview-lab", "folder-lab"];

test("ticks: unreadable storage counts as nothing ticked", () => {
  assert.deepEqual(parseTicks(null, IDS), []);
  assert.deepEqual(parseTicks("{", IDS), []);
  assert.deepEqual(parseTicks('{"a":1}', IDS), []);
});

test("ticks: unknown and repeated ids are dropped, order follows the module", () => {
  assert.deepEqual(parseTicks('["folder-lab", "nope", 3, "own-lab", "folder-lab"]', IDS), ["own-lab", "folder-lab"]);
});

test("ticks: toggling adds and removes; an unknown id changes nothing", () => {
  const one = toggleTick([], "interview-lab", IDS);
  assert.deepEqual(one, ["interview-lab"]);
  assert.deepEqual(toggleTick(one, "interview-lab", IDS), []);
  assert.deepEqual(toggleTick(one, "nope", IDS), one);
});

/* ───────────── the diagnostic's saved answers ───────────── */

test("saved answers: anything unreadable is a fresh start", () => {
  for (const raw of [null, "", "{", "[]", '"x"', '{"answers":3}']) {
    assert.deepEqual(parseAnswers(raw, 20), { answers: {}, revealed: false }, String(raw));
  }
});

test("saved answers: only questions 1 to 20 answered A to D are kept", () => {
  const raw = JSON.stringify({ answers: { 1: "B", 2: "E", 21: "A", 0: "A", x: "C", 7: "d", 20: "C" }, revealed: true });
  assert.deepEqual(parseAnswers(raw, 20).answers, { 1: "B", 20: "C" });
});

test("saved answers: a full set marked revealed comes back revealed", () => {
  const all = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, "A"]));
  assert.equal(parseAnswers(JSON.stringify({ answers: all, revealed: true }), 20).revealed, true);
  assert.equal(parseAnswers(JSON.stringify({ answers: all }), 20).revealed, false);
});

test("saved answers: the score is only shown once every question is answered", () => {
  const raw = JSON.stringify({ answers: { 1: "B" }, revealed: true });
  assert.deepEqual(parseAnswers(raw, 20), { answers: { 1: "B" }, revealed: false });
});

test("answering builds on what is saved, so quick answers in a row are all kept", () => {
  let raw = null;
  for (const [n, a] of [[1, "A"], [2, "B"], [3, "C"]]) raw = withAnswer(raw, n, a, 20);
  assert.deepEqual(parseAnswers(raw, 20), { answers: { 1: "A", 2: "B", 3: "C" }, revealed: false });
  assert.deepEqual(parseAnswers(withAnswer(raw, 2, "D", 20), 20).answers, { 1: "A", 2: "D", 3: "C" });
});

test("after the score is shown, answers are locked", () => {
  const all = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, "A"]));
  const shown = JSON.stringify({ answers: all, revealed: true });
  assert.equal(withAnswer(shown, 1, "B", 20), shown);
});

/* ───────────── the diagnostic ───────────── */

test("twenty questions, four per part, parts A to E in the guide's order", () => {
  assert.equal(QUESTIONS.length, 20);
  assert.deepEqual(
    PARTS.map((p) => p.id),
    ["A", "B", "C", "D", "E"],
  );
  for (const p of PARTS) assert.equal(QUESTIONS.filter((q) => q.part === p.id).length, 4, p.id);
  assert.deepEqual(
    QUESTIONS.map((q) => q.n),
    Array.from({ length: 20 }, (_, i) => i + 1),
  );
  for (const q of QUESTIONS) assert.equal(q.options.length, 4, `question ${q.n}`);
});

test("the answer key is the module's table, question by question", () => {
  assert.equal(ANSWER_KEY, "BBCBCBBBCBCBBCBBCBCB");
  assert.equal(QUESTIONS.map((q) => q.answer).join(""), ANSWER_KEY);
  for (const q of QUESTIONS) assert.ok(q.why.length > 10, `question ${q.n} has its reason`);
});

test("each part points at its module, 2 to 6", () => {
  assert.deepEqual(
    PARTS.map((p) => p.module),
    ["2", "3", "4", "5", "6"],
  );
});

test("scoring: one point per right answer, per part, out of 4", () => {
  const all = Object.fromEntries(QUESTIONS.map((q) => [q.n, q.answer]));
  assert.deepEqual(scoreParts(all), { A: 4, B: 4, C: 4, D: 4, E: 4 });
  assert.equal(totalScore(scoreParts(all)), 20);
  assert.deepEqual(scoreParts({}), { A: 0, B: 0, C: 0, D: 0, E: 0 });
  const wrongC = { ...all, 9: "A", 10: "D" };
  assert.deepEqual(scoreParts(wrongC), { A: 4, B: 4, C: 2, D: 4, E: 4 });
});

test("advice per part is the module's table: 4 skim the labs, 3 read what you missed, 0 to 2 start here", () => {
  assert.equal(adviceFor(4), "Skim this module's Labs and move on");
  assert.equal(adviceFor(3), "Read the lessons you missed");
  for (const s of [0, 1, 2]) assert.equal(adviceFor(s), "Start here");
});

test("where to start: the first part, in guide order, that scored 0 to 2", () => {
  assert.equal(startWith({ A: 4, B: 2, C: 1, D: 4, E: 4 })?.id, "B");
  assert.equal(startWith({ A: 3, B: 3, C: 3, D: 3, E: 3 }), null);
});

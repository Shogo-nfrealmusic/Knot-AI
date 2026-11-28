// Run: npm test  (node --test; Node strips the types from the .ts files)
// These pin the page's facts: the ten codes in the reel's order, and the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import { LEARN, ALL_PROMPTS, codeFor } from "./data.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

const SLUG = "82-learn-anything-codes";

test("the ten codes, in the reel's order", () => {
  assert.deepEqual(LEARN.map((c) => c.n), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.deepEqual(LEARN.map((c) => c.code), ["ELI5", "80/20", "MAKE-STICKY-NOTES", "FEYNMAN-TECHNIQUE", "MAKE-MINDMAP", "QUIZME", "MAKE-VISUAL-STUDYGUIDE", "FIRSTPRINCIPLES", "SOCRATES", "MAKE-SCHEMATIC"]);
});

test("every ready prompt starts with its code", () => {
  for (const c of LEARN) assert.ok(c.prompt.startsWith(c.code), c.id);
});

test("the four picture codes are marked as pictures", () => {
  assert.deepEqual(LEARN.filter((c) => c.picture).map((c) => c.id), ["sticky", "mindmap", "studyguide", "schematic"]);
});

test("copy all holds all ten prompts", () => {
  assert.equal(ALL_PROMPTS.split("\n").length, 10);
  assert.equal(codeFor("socrates").n, 9);
});

test("/free/82 opens this page with the reel's keyword, first in the list", () => {
  const drop = getDropByNumber("82");
  assert.equal(drop?.slug, SLUG);
  assert.equal(drop?.keyword, "LEARN");
  assert.equal(getDrops()[0].number, 82);
});

test("the figures sit on their chapters, in order", () => {
  const kinds = (getDrop(SLUG)?.about?.chapters ?? []).map((c) => c.learn);
  assert.deepEqual(kinds, ["picker", ...LEARN.map((c) => c.id)]);
});

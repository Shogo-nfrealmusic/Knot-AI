// Run: npm test  (node --test; Node strips the types from data.ts, so no test runner is installed)
// These pin what the five figures of /free/68 show (the query, the made-up examples and how they are judged),
// the checklist's saved state, and the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ANGLES,
  GEO_KINDS,
  PARTS,
  QUERY,
  QUESTIONS,
  RESULTS,
  SNIPPETS,
  SOURCES,
  STEPS,
  bestMatch,
  closeness,
  fingerprint,
  geoOrder,
  hitCount,
  parseDone,
  seoOrder,
  serializeDone,
  sharedWords,
  splitCovers,
  splitHits,
  toggleDone,
} from "./data.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

/* ───── figure 1 · SEO vs GEO ───── */

test("the query is the reel's, word for word", () => {
  assert.equal(QUERY, "best Italian restaurants near me");
});

test("GEO picks out topic, qualifier and location, and each is a piece of the query", () => {
  assert.deepEqual(
    PARTS.map((p) => [p.id, p.text]),
    [
      ["topic", "Italian restaurants"],
      ["qualifier", "best"],
      ["location", "near me"],
    ],
  );
  for (const p of PARTS) assert.ok(QUERY.includes(p.text), p.text);
});

test("SEO lights up the exact keywords only, whatever their case", () => {
  const lit = (text) => splitHits(QUERY, text).filter((s) => s.hit).map((s) => s.text);
  assert.deepEqual(lit("The best Italian restaurants in Rome"), ["best", "Italian", "restaurants"]);
  assert.deepEqual(lit("BEST pizza, nearly Italian-style restaurant"), ["BEST", "Italian"]); // nearly ≠ near, restaurant ≠ restaurants
  assert.deepEqual(lit(""), []);
});

test("splitting a text into lit and unlit pieces loses nothing", () => {
  for (const r of RESULTS) {
    assert.equal(splitHits(QUERY, r.text).map((s) => s.text).join(""), r.text);
    assert.equal(splitCovers(r).map((s) => s.text).join(""), r.text);
  }
});

test("by exact keywords the page that only repeats the query comes first and the trattoria last", () => {
  const order = seoOrder();
  assert.equal(order.length, RESULTS.length);
  assert.equal(order[0].id, "echo");
  assert.equal(order.at(-1).id, "trattoria");
  assert.equal(hitCount(QUERY, order.at(-1).text), 0);
  const counts = order.map((r) => hitCount(QUERY, r.text));
  assert.deepEqual(counts, [...counts].sort((a, b) => b - a));
});

test("by meaning the trattoria comes first: none of the exact words, all three details", () => {
  const order = geoOrder();
  assert.equal(order[0].id, "trattoria");
  assert.deepEqual(Object.keys(order[0].covers).sort(), ["location", "qualifier", "topic"]);
  // it is the only result that covers all three
  assert.equal(RESULTS.filter((r) => Object.keys(r.covers).length === PARTS.length).length, 1);
  // the page that repeats the query names nothing
  assert.deepEqual(RESULTS.find((r) => r.id === "echo").covers, {});
});

test("every phrase a result is credited with is really in its text, and is marked with its part", () => {
  for (const r of RESULTS) {
    for (const [part, phrase] of Object.entries(r.covers)) {
      assert.ok(r.text.includes(phrase), `${r.id}: ${phrase}`);
      assert.ok(splitCovers(r).some((s) => s.part === part && s.text === phrase), `${r.id}: ${part}`);
    }
    assert.ok(r.note.length > 0);
  }
});

/* ───── figure 2 · matching by meaning ───── */

test("four questions, and each has one snippet that answers it", () => {
  assert.equal(QUESTIONS.length, 4);
  assert.ok(SNIPPETS.length > QUESTIONS.length);
  for (const q of QUESTIONS) {
    assert.equal(SNIPPETS.filter((s) => s.topic === q.topic).length, 1, q.id);
  }
});

test("the snippet whose fingerprint is closest is the one that answers the question", () => {
  for (const q of QUESTIONS) {
    const match = bestMatch(q);
    assert.equal(match.topic, q.topic, q.id);
    const mine = closeness(fingerprint(q.topic, q.id), fingerprint(match.topic, match.id));
    for (const s of SNIPPETS) {
      if (s.id === match.id) continue;
      const other = closeness(fingerprint(q.topic, q.id), fingerprint(s.topic, s.id));
      assert.ok(mine - other > 0.1, `${q.id} vs ${s.id}: ${mine} / ${other}`);
    }
  }
});

test("the matching snippet shares no keyword with its question", () => {
  for (const q of QUESTIONS) {
    assert.deepEqual(sharedWords(q.text, bestMatch(q).text), [], q.id);
  }
});

test("a snippet that does share a keyword is not the match", () => {
  const decoys = QUESTIONS.flatMap((q) => SNIPPETS.filter((s) => sharedWords(q.text, s.text).length > 0).map((s) => [q, s]));
  assert.ok(decoys.length >= 2);
  for (const [q, s] of decoys) assert.notEqual(bestMatch(q).id, s.id);
  assert.deepEqual(sharedWords(QUESTIONS[0].text, SNIPPETS.find((s) => s.id === "cook-pasta").text), ["pasta"]);
});

test("small words do not count as shared keywords", () => {
  assert.deepEqual(sharedWords("What can I do for you?", "What to do in the rain for a day"), []);
  assert.deepEqual(sharedWords("", "anything"), []);
});

test("a fingerprint is the same every time, and stays inside the figure", () => {
  const a = fingerprint("sleep", "q-sleep");
  assert.deepEqual(a, fingerprint("sleep", "q-sleep"));
  assert.equal(a.length, 14);
  for (const v of a) assert.ok(v >= 0.1 && v <= 1, String(v));
  assert.equal(closeness(a, a), 1);
});

/* ───── figures 3 and 4 · the two ways ───── */

test("the four kinds of third-party source", () => {
  assert.deepEqual(
    SOURCES.map((s) => s.id),
    ["podcast", "top10", "reviews", "forums"],
  );
});

test("the three kinds of content that stand out, in the reel's words", () => {
  assert.deepEqual(
    ANGLES.map((a) => a.label),
    ["Firsthand stories", "Unique angles", "Under-covered topics"],
  );
});

/* ───── figure 5 · the checklist and its saved state ───── */

test("seven steps, each with its own id", () => {
  assert.equal(STEPS.length, 7);
  assert.equal(new Set(STEPS.map((s) => s.id)).size, 7);
});

test("ticking and unticking a step", () => {
  const [a, b] = STEPS.map((s) => s.id);
  assert.deepEqual(toggleDone([], a), [a]);
  assert.deepEqual(toggleDone([a], b), [a, b]);
  assert.deepEqual(toggleDone([a, b], a), [b]);
  assert.deepEqual(toggleDone([a], "not-a-step"), [a]);
});

test("the saved state survives a round trip", () => {
  const done = [STEPS[2].id, STEPS[0].id];
  assert.deepEqual(parseDone(serializeDone(done)), [STEPS[0].id, STEPS[2].id]); // kept in the list's order
});

test("anything unreadable in storage counts as nothing ticked", () => {
  for (const raw of [null, undefined, "", "{", "null", "7", '"ask"', '{"ask":true}', "[1,2,null]", '["nope"]']) {
    assert.deepEqual(parseDone(raw), [], String(raw));
  }
  const id = STEPS[0].id;
  assert.deepEqual(parseDone(JSON.stringify([id, id, "gone", 3])), [id]); // duplicates and removed steps are dropped
});

/* ───── the page ───── */

test("/free/68 opens the GEO 101 page", () => {
  const drop = getDropByNumber("68");
  assert.equal(drop?.slug, "68-geo-101");
  assert.equal(getDrop("68-geo-101")?.title, "GEO 101: how your brand shows up in AI answers");
  assert.ok(getDrops().some((d) => d.number === 68)); // listed (not necessarily first: newer reels come after it)
});

test("five chapters, one figure each, in the reel's order", () => {
  const chapters = getDrop("68-geo-101")?.about?.chapters ?? [];
  assert.deepEqual(
    chapters.map((c) => c.geo),
    ["compare", "match", "sources", "content", "checklist"],
  );
  assert.deepEqual(GEO_KINDS, ["compare", "match", "sources", "content", "checklist"]);
});

test("the page states no statistics: no percentages or multipliers in its text", () => {
  const drop = getDrop("68-geo-101");
  const text = JSON.stringify([drop, RESULTS, QUESTIONS, SNIPPETS, SOURCES, ANGLES, STEPS]);
  assert.equal(/\d\s?%|\d+x\b|\bpercent\b/i.test(text), false);
});

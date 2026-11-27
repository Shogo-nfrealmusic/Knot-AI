// Run: npm test. The module pages' content, generated from release/guide/*.md by md2guide.py: shape and safety checks.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { MODULES } from "../data.ts";
import { CONTENT as secondBrain } from "./second-brain.ts";
import { CONTENT as memory } from "./memory.ts";
import { CONTENT as verification } from "./verification.ts";
import { CONTENT as autonomy } from "./autonomy.ts";
import { CONTENT as security } from "./security.ts";
import { CONTENT as beyondCode } from "./beyond-code.ts";
import { CONTENT as yourOs } from "./your-os.ts";

const ALL = [secondBrain, memory, verification, autonomy, security, beyondCode, yourOs];
const blocks = (m) => m.lessons.flatMap((l) => l.sections.flatMap((s) => s.blocks));
const texts = (m) =>
  blocks(m).flatMap((b) => [
    b.p ?? "",
    b.quote ?? "",
    b.code ?? "",
    ...(b.list ?? []).flat(2),
    ...(b.table ? [...b.table.head, ...b.table.rows.flat()] : []),
  ]);

test("one content file per lesson module, 2 to 8, matching the index", () => {
  assert.deepEqual(
    ALL.map((m) => m.code),
    ["2", "3", "4", "5", "6", "7", "8"],
  );
  for (const m of ALL) {
    const entry = MODULES.find((x) => x.code === m.code);
    assert.equal(entry.title, m.title, m.slug);
    assert.equal(entry.href, `/os/guide/${m.slug}`);
  }
});

test("lessons are numbered N.1, N.2 … in order, with unique ids", () => {
  for (const m of ALL) {
    const numbered = m.lessons.filter((l) => /^\d\.\d+$/.test(l.code));
    assert.deepEqual(
      numbered.map((l) => l.code),
      numbered.map((_, i) => `${m.code}.${i + 1}`),
      m.slug,
    );
    assert.equal(new Set(m.lessons.map((l) => l.id)).size, m.lessons.length, m.slug);
  }
});

test("no reference to the old numbering survives: no 1A, no Module S, no Lesson S.", () => {
  for (const m of ALL) {
    for (const t of texts(m)) assert.doesNotMatch(t, /\b1A\b|Module S\b|Lesson S\./, m.slug);
  }
});

test("every Module N mentioned is 0 to 8, and every Lesson N.M mentioned exists", () => {
  const codes = new Set(ALL.flatMap((m) => m.lessons.map((l) => l.code)));
  for (const n of ["0.1", "0.2", "0.3", "0.4", "0.5", "0.6"]) codes.add(n);
  for (const m of ALL) {
    for (const t of texts(m)) {
      for (const [, n] of t.matchAll(/Modules? (\d+)/g)) assert.ok(Number(n) <= 8, `${m.slug}: Module ${n}`);
      for (const [, ref] of t.matchAll(/Lessons? (\d\.\d+)/g)) assert.ok(codes.has(ref), `${m.slug}: Lesson ${ref}`);
    }
  }
});

test("every table row has as many cells as its header", () => {
  for (const m of ALL) {
    for (const b of blocks(m).filter((x) => x.table)) {
      for (const row of b.table.rows) assert.equal(row.length, b.table.head.length, `${m.slug}: ${row[0]}`);
    }
  }
});

test("every link is https", () => {
  for (const m of ALL) {
    for (const t of texts(m)) {
      for (const [, href] of t.matchAll(/\]\(([^)]+)\)/g)) assert.match(href, /^https:\/\//, m.slug);
    }
  }
});

test("each module has a hero figure and at least one figure in its lessons, and each figure is drawn in its Figures.tsx", () => {
  for (const m of ALL) {
    const ids = [m.hero, ...blocks(m).filter((b) => b.figure).map((b) => b.figure)];
    assert.ok(ids.length >= 2, m.slug);
    const src = readFileSync(new URL(`../${m.slug}/Figures.tsx`, import.meta.url), "utf8");
    const registry = src.slice(src.indexOf("export const FIGURES"));
    for (const id of ids) assert.match(registry, new RegExp(`\\b${id}\\b`), `${m.slug}: ${id}`);
  }
});

test("labs have a pass condition", () => {
  for (const m of ALL) {
    for (const l of m.lessons) {
      const lab = l.sections.find((s) => s.h === "Lab");
      if (lab) assert.match(lab.blocks[0].p, /Pass condition/, `${m.slug} ${l.code}`);
    }
  }
});

test("the content carries no Japanese", () => {
  for (const m of ALL) assert.doesNotMatch(JSON.stringify(m), /[぀-ヿ一-鿿]/, m.slug);
});

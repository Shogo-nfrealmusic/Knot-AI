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

test("every lab has a setup check, at most one real-world check after it, and no old single pass condition", () => {
  for (const m of ALL) {
    for (const l of m.lessons) {
      const lab = l.sections.find((s) => s.h === "Lab");
      if (!lab) continue;
      const p = lab.blocks[0].p;
      assert.match(p, /Setup check: \S/, `${m.slug} ${l.code}`);
      assert.doesNotMatch(p, /Pass condition/, `${m.slug} ${l.code}`);
      assert.ok((p.match(/Real-world check:/g) ?? []).length <= 1, `${m.slug} ${l.code}`);
      if (p.includes("Real-world check:")) assert.ok(p.indexOf("Setup check:") < p.indexOf("Real-world check:"), `${m.slug} ${l.code}`);
    }
  }
});

test("every module has a lab a reader can pass on day one: a core lesson's setup check", () => {
  for (const m of ALL) {
    assert.ok(
      m.lessons.some((l) => !l.advanced && l.sections.some((s) => s.h === "Lab")),
      m.slug,
    );
  }
});

test("the technical lessons are marked Advanced, and only those", () => {
  const advanced = ALL.flatMap((m) => m.lessons.filter((l) => l.advanced).map((l) => l.code));
  assert.deepEqual(advanced, ["2.5", "4.4", "5.2", "5.3", "5.4", "6.2", "6.4", "6.6"]);
});

// Every file in the kit (release/kit in the product folder, checked 2026-11-28). A "From the kit" note may only name these.
const KIT = [
  "kit/README.md",
  "kit/vault/CLAUDE.md",
  "kit/project/CLAUDE.md",
  "kit/claude/settings.example.json",
  "kit/claude/agents/",
  "kit/claude/agents/verifier.md",
  "kit/claude/agents/engineer.md",
  "kit/claude/agents/analyst.md",
  "kit/claude/agents/researcher.md",
  "kit/claude/agents/secretary.md",
  "kit/claude/agents/marketer.md",
  "kit/claude/hooks/security-guard.py",
  "kit/claude/hooks/test_security_guard.py",
  "kit/claude/hooks/require-tests.py",
  "kit/templates/decision.md",
  "kit/templates/change.md",
  "kit/templates/failure-log.md",
  "kit/templates/skills-ledger.md",
  "kit/templates/SKILL.md",
  "kit/prompts/interview.md",
  "kit/prompts/review.md",
  "kit/prompts/daily-routine.md",
];

test("each 'From the kit' note comes last in its lesson, names at least one kit file, and names only files the kit has", () => {
  let notes = 0;
  for (const m of ALL) {
    for (const l of m.lessons) {
      const i = l.sections.findIndex((s) => s.h === "From the kit");
      if (i < 0) continue;
      notes++;
      assert.equal(i, l.sections.length - 1, `${m.slug} ${l.code}`);
      const text = l.sections[i].blocks.map((b) => b.p ?? "").join(" ");
      const named = [...text.matchAll(/`(kit\/[^`]+)`/g)].map((x) => x[1]);
      assert.ok(named.length > 0, `${m.slug} ${l.code}`);
      for (const f of named) assert.ok(KIT.includes(f), `${m.slug} ${l.code}: ${f}`);
      assert.match(text, /Done when /, `${m.slug} ${l.code}`);
    }
  }
  assert.ok(notes >= 15, `only ${notes} notes`);
});

test("lessons that tell you to use a kit file end with a 'From the kit' note", () => {
  for (const m of ALL) {
    for (const l of m.lessons) {
      if (!/^\d\.\d+$/.test(l.code)) continue;
      const body = l.sections.filter((s) => s.h !== "From the kit").flatMap((s) => s.blocks);
      const usesKit = body.some((b) => /\bthe kit\b|\bin the kit\b|kit's/.test(JSON.stringify(b)));
      if (usesKit) assert.ok(l.sections.some((s) => s.h === "From the kit"), `${m.slug} ${l.code}`);
    }
  }
});

test("nothing goes out unless a human approved it: 7.6 agrees with 7.4's scheduled posts", () => {
  const text = JSON.stringify(beyondCode);
  assert.doesNotMatch(text, /It never communicates as us/);
  const l74 = JSON.stringify(beyondCode.lessons.find((l) => l.code === "7.4"));
  const l76 = JSON.stringify(beyondCode.lessons.find((l) => l.code === "7.6"));
  assert.match(l74, /approve/);
  assert.match(l76, /Nothing goes out unless a human approved it/);
});

test("2.6: the routine's summary lives in Inbox.md, so passing never asks for an empty Inbox", () => {
  const l26 = JSON.stringify(secondBrain.lessons.find((l) => l.code === "2.6"));
  assert.doesNotMatch(l26, /Inbox is empty/);
  assert.match(l26, /other than Inbox\.md/);
});

test("2.2: the interview keeps the folder map from 2.1 instead of writing over it", () => {
  const prompt = secondBrain.lessons.find((l) => l.code === "2.2").sections.flatMap((s) => s.blocks).find((b) => b.code);
  assert.match(prompt.code, /keep the "Where things go" section exactly as it is/);
});

test("4.4: the lab tells a stop on the gate from a stop on the retry limit", () => {
  const lab = verification.lessons.find((l) => l.code === "4.4").sections.find((s) => s.h === "Lab").blocks[0].p;
  assert.match(lab, /gate passed/);
  assert.match(lab, /retry limit/);
});

test("the content carries no Japanese", () => {
  for (const m of ALL) assert.doesNotMatch(JSON.stringify(m), /[぀-ヿ一-鿿]/, m.slug);
});

// Run: npm test  (node --test; Node strips the types from data.ts, so no test runner is installed)
// These pin what the figures of /free/69 show (the system's eight steps and their prompts, the made-up examples
// and how they are judged: matching, Stripe, contractor pay, the balance check) and the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CARD_LINES,
  CLOSE_KINDS,
  CONTRACTORS,
  HOURS_A_WEEK,
  MONTHS,
  NODES,
  RECEIPTS,
  SETUP,
  SOURCE,
  STEPS,
  STRIPE_ACCOUNTS,
  balanceGap,
  breakMonth,
  confirmedPay,
  matchReceipts,
  payShortfall,
  rateTablePay,
  stepsOn,
  stripeGap,
  summariseStripe,
} from "./data.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

/* ───── the problem ───── */

test("20 hours a week, with the source the reel cites", () => {
  assert.equal(HOURS_A_WEEK, 20);
  assert.equal(SOURCE.name, "CPA Practice Advisor");
  assert.equal(SOURCE.date, "2025-09-15");
  assert.match(SOURCE.href, /^https:\/\/www\.cpapracticeadvisor\.com\/2025\/09\/15\//);
});

/* ───── the system ───── */

test("the node map is the reel's, in its order", () => {
  assert.deepEqual(
    NODES.map((n) => n.label),
    ["Claude Code", "Receipts", "Accounting software", "Stripe", "Contractor pay", "Financial model", "Google Drive"],
  );
});

test("eight steps, each on a node of the map, with its own id and number", () => {
  assert.equal(STEPS.length, 8);
  assert.equal(new Set(STEPS.map((s) => s.id)).size, 8);
  assert.deepEqual(STEPS.map((s) => s.n), [1, 2, 3, 4, 5, 6, 7, 8]);
  const nodeIds = NODES.map((n) => n.id);
  for (const s of STEPS) assert.ok(nodeIds.includes(s.node), s.id);
  // every node below Claude Code has at least one step
  for (const n of NODES.slice(1)) assert.ok(stepsOn(n.id).length > 0, n.id);
});

test("the month-end runs OCT 31, then NOV 1 from the Stripe step on", () => {
  assert.deepEqual(
    STEPS.map((s) => s.day),
    ["OCT 31", "OCT 31", "OCT 31", "NOV 1", "NOV 1", "NOV 1", "NOV 1", "NOV 1"],
  );
  assert.equal(STEPS.find((s) => s.day === "NOV 1").node, "stripe");
});

test("the person is asked twice: one approval and one answer", () => {
  assert.deepEqual(
    STEPS.filter((s) => s.you).map((s) => s.you),
    ["approve", "answer"],
  );
});

test("every step has a prompt to paste, with no private details", () => {
  for (const s of STEPS) {
    assert.ok(s.prompt.length > 120, s.id);
    assert.ok(!/freee|\/Users\/|\btps\b|tetty|shogo/i.test(s.prompt), s.id);
  }
});

test("the drafting prompts never book, and the approval prompt books only what is approved", () => {
  for (const id of ["match", "stripe", "pay"]) {
    assert.match(STEPS.find((s) => s.id === id).prompt, /draft only|drafts only/i, id);
  }
  assert.match(STEPS.find((s) => s.id === "match").prompt, /Do not book/);
  assert.match(STEPS.find((s) => s.id === "approve").prompt, /Book only the entries I approve/);
});

test("the contractor prompt says not to multiply jobs by rate", () => {
  assert.match(STEPS.find((s) => s.id === "pay").prompt, /Do not compute pay as/);
});

test("the model prompt checks every month ties out to zero and does not plug the gap", () => {
  const p = STEPS.find((s) => s.id === "model").prompt;
  assert.match(p, /every month/i);
  assert.match(p, /= 0/);
  assert.match(p, /Do not plug/);
});

/* ───── matching receipts to card lines ───── */

test("each card line is matched to the receipt with the same amount within three days", () => {
  const { pairs, noReceipt, noCard } = matchReceipts(RECEIPTS, CARD_LINES);
  for (const [card, receipt] of pairs) {
    assert.equal(card.amount, receipt.amount);
    assert.equal(card.vendor, receipt.vendor);
    assert.ok(Math.abs(card.day - receipt.day) <= 3);
  }
  assert.equal(pairs.length + noReceipt.length, CARD_LINES.length);
  assert.equal(pairs.length + noCard.length, RECEIPTS.length);
  // the example leaves one card line with no receipt, and one receipt not paid by card
  assert.equal(noReceipt.length, 1);
  assert.equal(noCard.length, 1);
});

test("a receipt is used once, and a receipt four days off is not a match", () => {
  const r = [{ id: "r", vendor: "Hosting", amount: 10, day: 1 }];
  const twoLines = [
    { id: "a", vendor: "Hosting", amount: 10, day: 2 },
    { id: "b", vendor: "Hosting", amount: 10, day: 3 },
  ];
  assert.equal(matchReceipts(r, twoLines).pairs.length, 1);
  assert.equal(matchReceipts(r, [{ id: "c", vendor: "Hosting", amount: 10, day: 5 }]).pairs.length, 0);
  assert.equal(matchReceipts(r, [{ id: "d", vendor: "Hosting", amount: 11, day: 1 }]).pairs.length, 0);
});

/* ───── Stripe ───── */

test("two Stripe accounts, each summarised into payments, fees, refunds and payouts that tie out", () => {
  assert.equal(STRIPE_ACCOUNTS.length, 2);
  for (const a of STRIPE_ACCOUNTS) {
    const s = summariseStripe(a.txns);
    assert.deepEqual(Object.keys(s), ["payments", "fees", "refunds", "payouts"]);
    assert.ok(s.payments > 0 && s.fees > 0 && s.payouts > 0, a.id);
    assert.equal(stripeGap(a), 0, a.id);
  }
});

test("a missing payout shows up as a gap", () => {
  const a = STRIPE_ACCOUNTS[0];
  const dropped = { ...a, txns: a.txns.filter((t) => t.type !== "payout") };
  assert.notEqual(stripeGap(dropped), 0);
});

/* ───── contractor pay ───── */

test("jobs × rate comes up 28% short of the confirmed amounts", () => {
  const v1 = rateTablePay(CONTRACTORS);
  const v2 = confirmedPay(CONTRACTORS);
  assert.ok(v1 < v2);
  assert.equal(payShortfall(CONTRACTORS), 0.28);
});

test("the gap is add-ons and a contractor missing from the rate table", () => {
  assert.ok(CONTRACTORS.some((c) => c.rate === null));
  assert.ok(CONTRACTORS.some((c) => c.addOns > 0));
  for (const c of CONTRACTORS) assert.equal(c.confirmed, c.jobs * (c.rate ?? c.missingRate) + c.addOns, c.id);
});

/* ───── the balance check ───── */

test("every month in the model ties out to zero", () => {
  assert.ok(MONTHS.length >= 2);
  for (const m of MONTHS) assert.equal(balanceGap(m), 0, m.label);
});

test("a broken month shows its difference", () => {
  const broken = breakMonth(MONTHS.at(-1));
  assert.notEqual(balanceGap(broken), 0);
  assert.equal(balanceGap(MONTHS.at(-1)), 0); // the original is untouched
});

/* ───── setup ───── */

test("what to set up: five connections, each with the least access it needs", () => {
  assert.deepEqual(
    SETUP.map((s) => s.id),
    ["gmail", "chrome", "books", "stripe", "drive"],
  );
  assert.equal(SETUP.find((s) => s.id === "stripe").access, "read only");
});

/* ───── the page ───── */

test("/free/69 opens the month-close page", () => {
  const drop = getDropByNumber("69");
  assert.equal(drop?.slug, "69-month-close");
  assert.ok(getDrops().some((d) => d.number === 69));
  assert.equal(drop?.keyword, "CLOSE");
});

test("one figure per chapter, in order", () => {
  const chapters = getDrop("69-month-close")?.about?.chapters ?? [];
  assert.deepEqual(chapters.map((c) => c.close), [...CLOSE_KINDS]);
});

test("the page names no accounting product, no person and no private path", () => {
  const drop = getDrop("69-month-close");
  const text = JSON.stringify([drop, STEPS, NODES, SETUP, RECEIPTS, CARD_LINES, CONTRACTORS]);
  assert.equal(/freee|tetty|\belly\b|\/Users\/|Obsidian|\btps\b/i.test(text), false);
});

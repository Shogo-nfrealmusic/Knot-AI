// Run: npm test  (node --test; Node strips the types from data.ts, so no test runner is installed)
// These pin the page's facts to the source repo (README.md, the SKILL.md files and the test fixtures of
// github.com/Jakeschincariol/trader-skill, MIT) and to the wiring in src/lib/free.ts.
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BERKSHIRE,
  FINE_PRINT,
  FLOWS,
  INSTALL,
  PTR,
  REPO,
  RISK_LIMITS,
  RULES,
  SKILLS,
  STOCK_ACT,
  TRADER_KINDS,
  daysBetween,
  renormalised,
  riskCheck,
  sizeBudget,
} from "./data.ts";
import { getDrop, getDropByNumber, getDrops } from "../../../lib/free.ts";

test("every link goes to the author's repo", () => {
  assert.equal(REPO, "https://github.com/Jakeschincariol/trader-skill");
});

test("the eleven skills are the README's table, in its order, with its words", () => {
  assert.equal(SKILLS.length, 11);
  assert.deepEqual(
    SKILLS.map((s) => [s.command, s.job]),
    [
      ["/trader-copycat", "Reverse Engineer"],
      ["/trader-news", "News Monitor"],
      ["/trader-budget", "Budget Manager"],
      ["/trader-pelosi", "Pelosi Tracker"],
      ["/trader-analyst", "Earnings Analyst"],
      ["/trader-screener", "Stock Screener"],
      ["/trader-risk", "Risk Manager"],
      ["/trader-broker", "Order Executor"],
      ["/trader-tax", "Tax Optimizer"],
      ["/trader-alerts", "Price Alerts"],
      ["/trader-rebalance", "Rebalancer"],
    ],
  );
  assert.equal(
    SKILLS[7].does,
    "Turns an approved order into the exact ticket your brokerage connector receives, and records your yes. It never places anything itself.",
  );
});

test("the four flows are the README's 'How to use it' block, and every step is one of the eleven", () => {
  assert.deepEqual(
    FLOWS.map((f) => [f.label, f.line]),
    [
      ["copy an investor", "copycat -> budget -> risk -> broker"],
      ["watch, on a schedule", "news / pelosi / alerts"],
      ["pick your own", "analyst -> screener -> budget -> risk -> broker"],
      ["maintain", "rebalance / tax -> risk -> broker"],
    ],
  );
  for (const flow of FLOWS) assert.deepEqual(flow.steps, flow.line.split(/ -> | \/ /), flow.label);
  const names = new Set(SKILLS.map((s) => s.command.replace("/trader-", "")));
  for (const flow of FLOWS) for (const step of flow.steps) assert.ok(names.has(step), step);
});

test("the install lines are the README's, verbatim", () => {
  assert.equal(INSTALL.paste, "https://github.com/Jakeschincariol/trader-skill\n\ninstall skill");
  assert.deepEqual(INSTALL.plugin, ["/plugin marketplace add Jakeschincariol/trader-skill", "/plugin install trader-skill@trader-skill"]);
  assert.equal(INSTALL.copy, "git clone https://github.com/Jakeschincariol/trader-skill.git\ncp -r trader-skill/trader-* ~/.claude/skills/");
});

test("Berkshire's Q2 2026 top 5 are the fixture's 13F percentages", () => {
  assert.equal(BERKSHIRE.label, "Q2 2026 13F · README example");
  assert.equal(BERKSHIRE.filed, "2026-08-14");
  assert.deepEqual(
    BERKSHIRE.stocks.map((s) => [s.ticker, s.pct]),
    [
      ["AAPL", 22.04],
      ["AXP", 17.14],
      ["GOOGL", 12.62],
      ["KO", 10.86],
      ["BAC", 9.2],
    ],
  );
});

test("renormalised over the five, the weights are the README's 30.67 / 23.85 / 17.56 / 15.11 / 12.80", () => {
  assert.deepEqual(
    renormalised(BERKSHIRE.stocks).map((w) => w.toFixed(2)),
    ["30.67", "23.85", "17.56", "15.11", "12.80"],
  );
});

test("the rules are the README's example: 10% cash buffer, 25% cap", () => {
  assert.equal(RULES.cashBufferPct, 10);
  assert.equal(RULES.maxPositionPct, 25);
});

test("$5,000 sizes exactly as the README: AAPL $1,250 capped, AXP $1,119, GOOGL $823, KO $708, BAC $600, $500 cash, $0 idle", () => {
  const r = sizeBudget(5000);
  assert.deepEqual(
    r.rows.map((x) => [x.ticker, x.dollars, x.capped]),
    [
      ["AAPL", 1250, true],
      ["AXP", 1119, false],
      ["GOOGL", 823, false],
      ["KO", 708, false],
      ["BAC", 600, false],
    ],
  );
  assert.equal(r.cash, 500);
  assert.equal(r.idle, 0);
});

test("at any budget every dollar is either invested, the buffer, or idle, and no stock is over the cap", () => {
  for (const budget of [1000, 2500, 5000, 7300, 12000, 20000]) {
    const r = sizeBudget(budget);
    const invested = r.rows.reduce((sum, x) => sum + x.dollars, 0);
    assert.equal(invested + r.cash + r.idle, budget, String(budget));
    assert.equal(r.cash, (budget * 10) / 100, String(budget));
    assert.equal(r.idle, 0, String(budget));
    for (const x of r.rows) assert.ok(x.dollars <= budget * 0.25, `${budget} ${x.ticker}`);
    assert.ok(r.rows.every((x) => Number.isInteger(x.dollars)), String(budget));
  }
});

test("a bad budget sizes nothing", () => {
  for (const bad of [0, -100, Number.NaN]) {
    const r = sizeBudget(bad);
    assert.equal(r.rows.length, 0);
  }
});

test("the risk check uses the SKILL.md defaults: max order $2,000, min order $5", () => {
  assert.deepEqual(RISK_LIMITS, { maxOrderUsd: 2000, minOrderUsd: 5 });
});

test("the README's five orders all PASS, as in trader-risk's example", () => {
  assert.deepEqual(
    riskCheck(sizeBudget(5000)).map((v) => [v.ticker, v.verdict]),
    [
      ["AAPL", "PASS"],
      ["AXP", "PASS"],
      ["GOOGL", "PASS"],
      ["KO", "PASS"],
      ["BAC", "PASS"],
    ],
  );
});

test("an order over the $2,000 max order size is BLOCKed with the reason", () => {
  const v = riskCheck(sizeBudget(10000));
  assert.equal(v[0].ticker, "AAPL");
  assert.equal(v[0].verdict, "BLOCK");
  assert.match(v[0].reason, /max_order_usd/);
});

test("the PTR excerpt is filing 20035143, Hon. Nancy Pelosi, CA11, signed 08/21/2026", () => {
  assert.equal(PTR.id, "20035143");
  assert.equal(PTR.name, "Hon. Nancy Pelosi");
  assert.equal(PTR.district, "CA11");
  assert.equal(PTR.filed, "2026-08-21");
  assert.equal(PTR.rows.length, 7);
  assert.deepEqual(PTR.rows[1], {
    owner: "SP",
    asset: "Bloom Energy Corporation Class A Common Stock (BE) [OP]",
    type: "P",
    date: "2026-07-24",
    amount: "$1,000,001 - $5,000,000",
    description: "Purchased 100 call options with a strike price of $100 and an expiration date of 6/17/27.",
  });
});

test("days from trade to filing, as trader-pelosi counts them: 28 for 07/24", () => {
  assert.equal(daysBetween("2026-07-24", "2026-08-21"), 28);
  assert.equal(daysBetween("2026-07-28", "2026-08-21"), 24);
  for (const row of PTR.rows) assert.ok(daysBetween(row.date, PTR.filed) <= 45, row.asset);
});

test("the STOCK Act line is the README's, verbatim", () => {
  assert.equal(
    STOCK_ACT,
    "Members must disclose trades over $1,000 within 45 days (the STOCK Act). The Pelosi skill reads those public filings the minute they post, with the amounts as the ranges they are filed in. It has no access to anything that is not public.",
  );
});

test("the fine print is four README paragraphs, verbatim", () => {
  assert.deepEqual(
    FINE_PRINT.map((f) => f.title),
    ["Not financial advice.", "No trade goes through until you say yes.", "Paper first.", "13F data is old and partial."],
  );
  assert.equal(
    FINE_PRINT[3].body,
    "Funds file 45 days after each quarter ends, and a 13F lists long positions in US-listed stocks and a few related securities: no shorts, no cash, no foreign-listed shares. You see what they held, not what they hold today.",
  );
});

test("/free/76 opens the Trader skill page with the reel's keyword", () => {
  const drop = getDropByNumber("76");
  assert.equal(drop?.slug, "76-trader-skill");
  assert.equal(drop?.keyword, "TRADE");
  assert.ok(getDrops().some((d) => d.number === 76));
  assert.deepEqual(getDrop("76-trader-skill")?.tools.map((t) => t.href), [REPO]);
});

test("one figure per chapter, in order", () => {
  const chapters = getDrop("76-trader-skill")?.about?.chapters ?? [];
  assert.deepEqual(chapters.map((c) => c.trader), [...TRADER_KINDS]);
  assert.deepEqual([...TRADER_KINDS], ["eleven", "install", "flow", "pelosi", "fineprint"]);
});

test("the Pelosi chapter carries the README's STOCK Act paragraph, verbatim", () => {
  const chapter = getDrop("76-trader-skill")?.about?.chapters?.find((c) => c.trader === "pelosi");
  assert.ok(chapter?.text?.some((t) => typeof t === "string" && t.includes(STOCK_ACT)));
  assert.ok(chapter?.text?.some((t) => typeof t === "string" && t.includes("Congress's trades are public, not inside information.")));
});

test("the page makes no return claim, no time words, and names no private path or company", () => {
  const text = JSON.stringify(getDrop("76-trader-skill"));
  assert.equal(/just released|right now|this week|brand new|guaranteed|beat the market/i.test(text), false);
  assert.equal(/\/Users\/|Obsidian|\btps\b|tetty/i.test(text), false);
});

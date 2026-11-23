// /free/76 (The Trader skill): the page's facts, with no React in them so they can be tested (data.test.mjs).
// Everything here is from https://github.com/Jakeschincariol/trader-skill (MIT, by Jake Schincariol): README.md,
// the SKILL.md files of trader-budget, trader-risk, trader-broker and trader-pelosi, and the repo's own test fixtures
// (tests/fixtures/trader-budget/berkshire-q2-2026-top5.json, tests/fixtures/trader-pelosi/ptr-20035143.txt).
// `label` fields are this page's short labels; `does`, `body`, `line` and the PTR rows are the repo's words.

/** One figure per chapter of the page, in order. */
export const TRADER_KINDS = ["eleven", "install", "flow", "pelosi", "fineprint"] as const;
export type TraderDemoKind = (typeof TRADER_KINDS)[number];

export const REPO = "https://github.com/Jakeschincariol/trader-skill";
export const AUTHOR = { name: "Jake Schincariol", href: "https://opusjake.ai" };

export type Skill = { command: string; job: string; does: string };

/** README, The eleven: the table, in its order. */
export const SKILLS: Skill[] = [
  {
    command: "/trader-copycat",
    job: "Reverse Engineer",
    does: "Reads an investor's 13F-HR on SEC EDGAR and rebuilds their portfolio as weights you can copy, with what they bought, added, trimmed and sold since last quarter.",
  },
  { command: "/trader-news", job: "News Monitor", does: "Watches headlines and SEC filings (8-Ks) for every stock you hold and flags what touches them." },
  { command: "/trader-budget", job: "Budget Manager", does: "Sizes every position to your budget, keeps a cash buffer and caps any one stock." },
  {
    command: "/trader-pelosi",
    job: "Pelosi Tracker",
    does: "Reads Congress's stock-trade disclosures (House PTRs) as soon as they post, turns each PDF into clean rows and alerts you once per new filing.",
  },
  {
    command: "/trader-analyst",
    job: "Earnings Analyst",
    does: "Pulls each company's reported numbers from SEC XBRL (revenue, net income, diluted EPS, margins, growth) and its latest earnings release.",
  },
  { command: "/trader-screener", job: "Stock Screener", does: "Screens companies against your own rules and ranks what passes." },
  { command: "/trader-risk", job: "Risk Manager", does: "Checks every proposed order against your limits and blocks anything over them." },
  {
    command: "/trader-broker",
    job: "Order Executor",
    does: "Turns an approved order into the exact ticket your brokerage connector receives, and records your yes. It never places anything itself.",
  },
  { command: "/trader-tax", job: "Tax Optimizer", does: "Tracks cost-basis lots, gains and losses, tax-loss harvesting candidates and wash sales." },
  { command: "/trader-alerts", job: "Price Alerts", does: "Rings when a price target, a stop or the opening bell hits, with the real NYSE calendar." },
  { command: "/trader-rebalance", job: "Rebalancer", does: "Brings the portfolio back to its target weights when it drifts past your band." },
];

export type Flow = { id: string; label: string; line: string; steps: string[] };

function flow(id: string, label: string, line: string): Flow {
  return { id, label, line, steps: line.split(/ -> | \/ /) };
}

/** README, How to use it: "each skill reads what the last one wrote". `line` is the README's line; the label is its comment. */
export const FLOWS: Flow[] = [
  flow("copy", "copy an investor", "copycat -> budget -> risk -> broker"),
  flow("watch", "watch, on a schedule", "news / pelosi / alerts"),
  flow("pick", "pick your own", "analyst -> screener -> budget -> risk -> broker"),
  flow("maintain", "maintain", "rebalance / tax -> risk -> broker"),
];

/** README, Install: the three ways, verbatim. */
export const INSTALL = {
  paste: "https://github.com/Jakeschincariol/trader-skill\n\ninstall skill",
  plugin: ["/plugin marketplace add Jakeschincariol/trader-skill", "/plugin install trader-skill@trader-skill"],
  copy: "git clone https://github.com/Jakeschincariol/trader-skill.git\ncp -r trader-skill/trader-* ~/.claude/skills/",
  /** what the copycat command is called after each route (README: "Claude Code namespaces plugin skills") */
  named: { paste: "/trader-copycat", plugin: "/trader-skill:trader-copycat", copy: "/trader-copycat" },
};

export type Holding = { ticker: string; name: string; pct: number };

/** tests/fixtures/trader-budget/berkshire-q2-2026-top5.json: Berkshire Hathaway's 13F-HR, Q2 2026, top 5 issuers (share classes combined). */
export const BERKSHIRE = {
  label: "Q2 2026 13F · README example",
  filer: "Berkshire Hathaway",
  cik: "1067983",
  asOf: "2026-06-30",
  filed: "2026-08-14",
  stocks: [
    { ticker: "AAPL", name: "Apple", pct: 22.04 },
    { ticker: "AXP", name: "American Express", pct: 17.14 },
    { ticker: "GOOGL", name: "Alphabet", pct: 12.62 },
    { ticker: "KO", name: "Coca-Cola", pct: 10.86 },
    { ticker: "BAC", name: "Bank of America", pct: 9.2 },
  ] as Holding[],
};

/** README example and trader-budget's defaults: a 10% cash buffer, a 25% cap, and a $5 minimum order. */
export const RULES = { cashBufferPct: 10, maxPositionPct: 25, minOrderUsd: 5 };

/** trader-budget SKILL.md: "max_order_usd and min_order_usd: the biggest and smallest single order (2000 and 5)". trader-risk blocks outside them. */
export const RISK_LIMITS = { maxOrderUsd: 2000, minOrderUsd: 5 };

/** The weights in %, renormalised to 100 over the given stocks. */
export function renormalised(stocks: Holding[]): number[] {
  const total = stocks.reduce((sum, s) => sum + s.pct, 0);
  return stocks.map((s) => (s.pct / total) * 100);
}

export type SizedRow = { ticker: string; name: string; weight: number; dollars: number; capped: boolean; dropped: boolean };
export type Sized = { budget: number; cash: number; idle: number; cap: number; rows: SizedRow[] };

/**
 * trader-budget's maths, in the order its SKILL.md gives it: the cash buffer comes off the top; the weights are
 * renormalised over the stocks; any stock over the cap is pinned at the cap and its excess shared over the others by
 * weight, until nobody is over; a slice under the minimum order is dropped and its weight shared out; amounts are
 * rounded to whole dollars and the rounding dollar goes to the biggest stock that is not capped. Fractional shares.
 */
export function sizeBudget(budget: number, stocks: Holding[] = BERKSHIRE.stocks, rules = RULES): Sized {
  if (!Number.isFinite(budget) || budget <= 0) return { budget, cash: 0, idle: 0, cap: 0, rows: [] };
  const cash = (budget * rules.cashBufferPct) / 100;
  const investable = budget - cash;
  const cap = Math.floor((budget * rules.maxPositionPct) / 100);
  const weights = renormalised(stocks);
  const capped = new Set<number>();
  const dropped = new Set<number>();
  let amounts: number[] = stocks.map(() => 0);

  for (let guard = 0; guard < stocks.length * 2 + 2; guard += 1) {
    const free = stocks.map((_, i) => i).filter((i) => !capped.has(i) && !dropped.has(i));
    const remaining = investable - cap * capped.size;
    const freeWeight = free.reduce((sum, i) => sum + weights[i], 0);
    amounts = stocks.map((_, i) => (capped.has(i) ? cap : dropped.has(i) || freeWeight === 0 ? 0 : (remaining * weights[i]) / freeWeight));
    const over = free.filter((i) => amounts[i] > cap);
    if (over.length) {
      over.forEach((i) => capped.add(i));
      continue;
    }
    const tiny = free.filter((i) => amounts[i] < rules.minOrderUsd);
    if (tiny.length) {
      tiny.forEach((i) => dropped.add(i));
      continue;
    }
    break;
  }

  // whole dollars; what rounding leaves over goes to the biggest stock that is not capped
  const dollars = amounts.map((a, i) => (capped.has(i) ? cap : Math.round(a)));
  const free = stocks.map((_, i) => i).filter((i) => !capped.has(i) && !dropped.has(i));
  if (free.length) {
    const target = Math.floor(investable - cap * capped.size);
    const diff = target - free.reduce((sum, i) => sum + dollars[i], 0);
    const biggest = free.reduce((best, i) => (amounts[i] > amounts[best] ? i : best), free[0]);
    if (dollars[biggest] + diff <= cap) dollars[biggest] += diff;
  }
  const invested = dollars.reduce((sum, d) => sum + d, 0);
  return {
    budget,
    cash,
    cap,
    idle: Math.round((budget - cash - invested) * 100) / 100,
    rows: stocks.map((s, i) => ({ ticker: s.ticker, name: s.name, weight: weights[i], dollars: dollars[i], capped: capped.has(i), dropped: dropped.has(i) })),
  };
}

export type Verdict = { ticker: string; dollars: number; verdict: "PASS" | "BLOCK"; reason: string };

/**
 * Part of trader-risk's table, for these buy orders on a fresh paper account funded with the budget: size (min and max
 * order), position (over the cap after the fill) and cash (dipping into the buffer). Orders are checked in file order,
 * as if each passed order had filled.
 */
export function riskCheck(sized: Sized, limits = RISK_LIMITS, rules = RULES): Verdict[] {
  let cash = sized.budget;
  const buffer = (sized.budget * rules.cashBufferPct) / 100;
  return sized.rows
    .filter((row) => row.dollars > 0)
    .map((row) => {
      const reasons: string[] = [];
      if (row.dollars > limits.maxOrderUsd) reasons.push(`over max_order_usd ($${limits.maxOrderUsd.toLocaleString("en-US")})`);
      if (row.dollars < limits.minOrderUsd) reasons.push(`under min_order_usd ($${limits.minOrderUsd})`);
      if (row.dollars > (sized.budget * rules.maxPositionPct) / 100) reasons.push(`over max_position_pct (${rules.maxPositionPct}%)`);
      if (cash - row.dollars < buffer) reasons.push("would dip into the cash buffer");
      if (reasons.length) return { ticker: row.ticker, dollars: row.dollars, verdict: "BLOCK" as const, reason: reasons.join(", ") };
      cash -= row.dollars;
      return { ticker: row.ticker, dollars: row.dollars, verdict: "PASS" as const, reason: "" };
    });
}

/** trader-broker SKILL.md: the ticket for an order, and the exact JSON for Alpaca's place_stock_order. */
export function ticketJson(ticker: string, dollars: number): string {
  return JSON.stringify({ symbol: ticker, side: "buy", notional: String(dollars), type: "market", time_in_force: "day" });
}

export type PtrRow = { owner: string; asset: string; type: string; date: string; amount: string; description: string };

/** tests/fixtures/trader-pelosi/ptr-20035143.txt: the House Clerk's PTR, as text. Dates as ISO; the rest as filed. */
export const PTR = {
  id: "20035143",
  name: "Hon. Nancy Pelosi",
  status: "Member",
  district: "CA11",
  filed: "2026-08-21",
  href: "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2026/20035143.pdf",
  rows: [
    { owner: "SP", asset: "Bloom Energy Corporation Class A Common Stock (BE) [ST]", type: "P", date: "2026-07-24", amount: "$1,000,001 - $5,000,000", description: "Purchased 10,000 shares." },
    {
      owner: "SP",
      asset: "Bloom Energy Corporation Class A Common Stock (BE) [OP]",
      type: "P",
      date: "2026-07-24",
      amount: "$1,000,001 - $5,000,000",
      description: "Purchased 100 call options with a strike price of $100 and an expiration date of 6/17/27.",
    },
    { owner: "SP", asset: "Bloom Energy Corporation Class A Common Stock (BE) [ST]", type: "P", date: "2026-07-28", amount: "$500,001 - $1,000,000", description: "Purchased 5,000 shares." },
    {
      owner: "SP",
      asset: "Bloom Energy Corporation Class A Common Stock (BE) [OP]",
      type: "P",
      date: "2026-07-28",
      amount: "$500,001 - $1,000,000",
      description: "Purchased 100 call options with a strike price of $100 and an expiration date of 6/17/27.",
    },
    {
      owner: "SP",
      asset: "Intel Corporation - Common Stock (INTC) [OP]",
      type: "P",
      date: "2026-07-24",
      amount: "$250,001 - $500,000",
      description: "Purchased 50 call options with a strike price of $50 and an expiration date of 6/17/27.",
    },
    { owner: "SP", asset: "Intel Corporation - Common Stock (INTC) [ST]", type: "P", date: "2026-07-24", amount: "$500,001 - $1,000,000", description: "Purchased 10,000 shares." },
    {
      owner: "SP",
      asset: "REOF XXV, LLC [AB]",
      type: "P",
      date: "2026-07-27",
      amount: "$500,001 - $1,000,000",
      description: "Additional investment in LLC which is acquiring and restoring a luxury hotel property in San Francisco, CA.",
    },
  ] as PtrRow[],
};

/** Whole days from one ISO date to another. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** "Members must disclose trades over $1,000 within 45 days" */
export const DISCLOSE_WITHIN_DAYS = 45;

/** README, Fine print: "Congress's trades are public, not inside information." The paragraph after the title, verbatim. */
export const STOCK_ACT =
  "Members must disclose trades over $1,000 within 45 days (the STOCK Act). The Pelosi skill reads those public filings the minute they post, with the amounts as the ranges they are filed in. It has no access to anything that is not public.";

/** README, Fine print: four of its paragraphs, verbatim (Markdown marks removed). */
export const FINE_PRINT: { id: string; title: string; body: string }[] = [
  {
    id: "advice",
    title: "Not financial advice.",
    body: "This is software that reads public data and does arithmetic. It does not know your situation, it cannot see the future, and copying an investor does not copy their results. You can lose money. Decide for yourself, and talk to a licensed professional if you need advice.",
  },
  {
    id: "yes",
    title: "No trade goes through until you say yes.",
    body: "Only /trader-broker can lead to an order, and only after /trader-risk passes that exact order and you type yes for it in the chat. Set your brokerage tool to \"Needs approval\" in Claude (Customize, Connectors, tool permissions), never \"Always allow\", so Claude's own \"Allow once / Deny\" card is a second check. No options, margin, short selling or leverage unless you turn them on.",
  },
  {
    id: "paper",
    title: "Paper first.",
    body: "\"paper\": true is the default in config.example.json, and Alpaca's MCP server defaults to its paper account. Keys live in environment variables, never in the chat.",
  },
  {
    id: "13f",
    title: "13F data is old and partial.",
    body: "Funds file 45 days after each quarter ends, and a 13F lists long positions in US-listed stocks and a few related securities: no shorts, no cash, no foreign-listed shares. You see what they held, not what they hold today.",
  },
];

/** trader-broker SKILL.md: the three gates every order passes, every time. */
export const GATES = [
  { id: "risk", label: "trader-risk passed this exact order today" },
  { id: "yes", label: "You typed an explicit yes for this one order" },
  { id: "allow", label: "You clicked Allow once on Claude's own card" },
] as const;

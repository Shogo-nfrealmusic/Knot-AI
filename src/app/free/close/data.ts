// /free/69 (month-close): the data behind the figures, kept apart from React so data.test.mjs can pin it.
// From the reel: the 20 hours (and its source), the node map, the order of the steps, OCT 31 → NOV 1,
// 7 billing pages, 2 company cards, 2 Stripe accounts, the one question, "28% short", the balance check, Drive.
// Made up for the figures, and said so on each: every vendor, amount, contractor and month figure below.
// The prompts are written for this page: generic, so a reader can paste them into Claude Code and edit the names.

export const CLOSE_KINDS = ["hours", "map", "collect", "match", "stripe", "pay", "balance", "sync", "setup"] as const;
export type CloseDemoKind = (typeof CLOSE_KINDS)[number];

/* ───── the problem ───── */

export const HOURS_A_WEEK = 20;
export const SOURCE = {
  name: "CPA Practice Advisor",
  date: "2025-09-15",
  title: "Why Small Businesses Using AI Are Still Wasting 20 Hours a Week on Manual Accounting",
  href: "https://www.cpapracticeadvisor.com/2025/09/15/why-small-businesses-using-ai-are-still-wasting-20-hours-a-week-on-manual-accounting/168927/",
};

/* ───── the system ───── */

export type NodeId = "claude" | "receipts" | "books" | "stripe" | "pay" | "model" | "drive";
export const NODES: { id: NodeId; label: string; sub: string }[] = [
  { id: "claude", label: "Claude Code", sub: "starts on the last day of the month" },
  { id: "receipts", label: "Receipts", sub: "Gmail + 7 billing pages in Chrome" },
  { id: "books", label: "Accounting software", sub: "matched to 2 company cards" },
  { id: "stripe", label: "Stripe", sub: "2 accounts, read only" },
  { id: "pay", label: "Contractor pay", sub: "confirmed amounts, from our own app" },
  { id: "model", label: "Financial model", sub: "P&L · cash flow · balance sheet" },
  { id: "drive", label: "Google Drive", sub: "synced for the co-founder" },
];

export type Step = {
  id: string;
  n: number;
  node: NodeId;
  day: "OCT 31" | "NOV 1";
  time: string;
  title: string;
  does: string;
  /** where the person comes in: one approval, one answer */
  you?: "approve" | "answer";
  prompt: string;
};

export const STEPS: Step[] = [
  {
    id: "collect",
    n: 1,
    node: "receipts",
    day: "OCT 31",
    time: "9:30 AM",
    title: "Collect every receipt",
    does: "Pulls receipts from the inbox, and the rest from the billing pages in Chrome.",
    prompt: `It's month-end. Collect every receipt and invoice for last month
into ./close/<YYYY-MM>/receipts/.

1. Search my Gmail for receipts, invoices and payment confirmations
   dated last month. Save each attachment, or the email as a PDF
   if there is no attachment.
2. Open each billing page listed in billing-pages.md with Claude in
   Chrome, using my logged-in session, and download last month's
   invoice.
3. Name the files YYYY-MM-DD_vendor_amount.pdf.
4. Finish with one table: date, vendor, amount, currency, source
   (Gmail, or which billing page).

If a page asks for a login or a code, skip it and list it at the end.
Do not change any setting, and do not pay anything.`,
  },
  {
    id: "match",
    n: 2,
    node: "books",
    day: "OCT 31",
    time: "11:00 AM",
    title: "Match and draft",
    does: "Matches each receipt to a line on the two company cards and drafts every entry.",
    prompt: `Match last month's receipts to our company card statements and
draft the entries in our accounting software.

Inputs: the receipts table in ./close/<YYYY-MM>/, and last month's
card transactions for both cards, read from the accounting software.

1. Match each card line to one receipt: same amount, dates within
   3 days, and the same vendor. Use each receipt once.
2. For each match, draft an expense entry: date, vendor, amount,
   account, tax category, receipt attached. Use the account we used
   for that vendor before. If there is none, mark it "ask".
3. Make three lists: matched, card lines with no receipt, receipts
   with no card line.

Drafts only. Do not book, post or approve any entry.
Show me the three lists and wait.`,
  },
  {
    id: "approve",
    n: 3,
    node: "books",
    day: "OCT 31",
    time: "4:00 PM",
    title: "Wait for approval",
    does: "Nothing is booked until you approve it.",
    you: "approve",
    prompt: `Show me last month's drafted entries as one numbered table,
grouped: matched, needs an account, missing a receipt.

I will reply with approvals like "approve 1-12, 14" and changes like
"13: account = software".

Book only the entries I approve, exactly as approved.
Leave everything else as a draft, and tell me what is still open.`,
  },
  {
    id: "stripe",
    n: 4,
    node: "stripe",
    day: "NOV 1",
    time: "9:00 AM",
    title: "Read both Stripe accounts",
    does: "Payments, fees, refunds and payouts, for each account.",
    prompt: `Read last month's balance transactions from each of our Stripe
accounts, with a read-only key. For each account, in its currency:

- payments (gross charges)
- Stripe fees
- refunds and disputes
- payouts to the bank, with their arrival dates

Check that opening balance + payments - fees - refunds - payouts
= closing balance. If it is not zero, show the difference and the
transactions that could explain it.

Then draft the matching entries in the accounting software.
Drafts only.`,
  },
  {
    id: "ask",
    n: 5,
    node: "claude",
    day: "NOV 1",
    time: "9:30 AM",
    title: "Ask exactly one question",
    does: "The bank balance. Everything else it reads for itself.",
    you: "answer",
    prompt: `Before you go on, list what you still need from me to close
last month.

Anything you can read yourself (Gmail, the billing pages, the
accounting software, Stripe, our own app), read it. Do not ask me.

Ask me only what exists nowhere you can reach. For us that is one
thing: the bank balance on the last day of the month.
Ask it as one question, then wait for my answer.`,
  },
  {
    id: "pay",
    n: 6,
    node: "pay",
    day: "NOV 1",
    time: "10:00 AM",
    title: "Contractor pay from confirmed amounts",
    does: "Reads the confirmed amounts in our own app. The first version multiplied jobs by rate and came up 28% short.",
    prompt: `Work out what we owe each contractor for last month.

Use the confirmed amounts in our contractor app (or its export) as
the source. Do not compute pay as number of jobs x rate: add-ons,
adjustments and anyone missing from the rate table get lost that way.

1. List each contractor with the confirmed total and the jobs in it.
2. Next to it, show jobs x rate, and explain every difference.
3. Draft the payable entries and a payment list for me to check.

Drafts only. Do not send any payment.`,
  },
  {
    id: "model",
    n: 7,
    node: "model",
    day: "NOV 1",
    time: "11:00 AM",
    title: "Update the model, check it ties out",
    does: "P&L, cash flow and balance sheet, then every month must balance to zero.",
    prompt: `Update our financial model (model.xlsx) with last month's actuals
from the accounting software, Stripe and the contractor list.

1. Fill last month's P&L, cash flow and balance sheet.
2. For every month in the file, check:
   assets - liabilities - equity = 0
   cash on the cash flow = cash on the balance sheet
3. If any month is not 0, stop. Show the month, the difference and
   the rows that cause it. Do not plug the gap with a balancing number.

Save a copy of the file before you change it.`,
  },
  {
    id: "sync",
    n: 8,
    node: "drive",
    day: "NOV 1",
    time: "12:00 PM",
    title: "Sync to Drive, send one summary",
    does: "The file goes to the shared folder for the co-founder, and one summary comes back to you.",
    prompt: `Upload the updated model to our shared Google Drive folder
"Finance", replacing last month's version (Drive keeps the history).

Then send me one summary, short, with a table:
- revenue, costs and profit for the month
- cash at the end of the month
- what changed most since last month
- anything still waiting for me

Do not share the folder with anyone new.`,
  },
];

export const stepsOn = (node: NodeId) => STEPS.filter((s) => s.node === node);

/** The whole month-end as one file Claude Code can follow. */
export const RUNBOOK = `# month-end.md (run it on the last day of the month)

You close last month's books. Work through the steps in order:

1. Collect every receipt and invoice (Gmail, then the pages in
   billing-pages.md with Claude in Chrome) into ./close/<YYYY-MM>/.
2. Match them to both company cards and draft every entry.
3. Show me the drafts. Book only what I approve.
4. On the 1st: read both Stripe accounts (payments, fees, refunds,
   payouts) and check each one ties out.
5. Ask me one question only: the bank balance on the last day.
6. Contractor pay: from the confirmed amounts in our app,
   never jobs x rate.
7. Update P&L, cash flow and balance sheet. Every month must be 0.
   If not, stop and show me.
8. Upload the model to the shared Drive folder and send me
   one summary.

Rules:
- Drafts only, until I approve. Never book, pay or send money.
- Read what you can reach. Ask me only what you cannot.
- If a number does not tie out, stop. Never plug a gap.`;

/* ───── matching receipts to card lines ───── */

export type Line = { id: string; vendor: string; amount: number; day: number };

// made up for the figure: October, one company card
export const CARD_LINES: Line[] = [
  { id: "c1", vendor: "Cloud hosting", amount: 24, day: 3 },
  { id: "c2", vendor: "Design tool", amount: 15, day: 5 },
  { id: "c3", vendor: "Train fare", amount: 8.4, day: 9 },
  { id: "c4", vendor: "Domain renewal", amount: 12, day: 14 },
  { id: "c5", vendor: "Online ads", amount: 40, day: 20 },
];

export const RECEIPTS: Line[] = [
  { id: "r1", vendor: "Cloud hosting", amount: 24, day: 2 },
  { id: "r2", vendor: "Design tool", amount: 15, day: 5 },
  { id: "r3", vendor: "Train fare", amount: 8.4, day: 11 },
  { id: "r4", vendor: "Domain renewal", amount: 12, day: 14 },
  { id: "r5", vendor: "Coworking day pass", amount: 30, day: 18 },
];

export const MATCH_DAYS = 3;

/** Each card line gets the first unused receipt with the same vendor and amount, within MATCH_DAYS. */
export function matchReceipts(receipts: Line[], cards: Line[]) {
  const used = new Set<string>();
  const pairs: [Line, Line][] = [];
  const noReceipt: Line[] = [];
  for (const card of cards) {
    const r = receipts.find(
      (x) => !used.has(x.id) && x.vendor === card.vendor && Math.round(x.amount * 100) === Math.round(card.amount * 100) && Math.abs(x.day - card.day) <= MATCH_DAYS,
    );
    if (r) {
      used.add(r.id);
      pairs.push([card, r]);
    } else noReceipt.push(card);
  }
  return { pairs, noReceipt, noCard: receipts.filter((r) => !used.has(r.id)) };
}

/* ───── Stripe ───── */

export type StripeTxn = { type: "charge" | "fee" | "refund" | "payout"; amount: number };
export type StripeAccount = { id: string; label: string; opening: number; closing: number; txns: StripeTxn[] };

// made up for the figure
export const STRIPE_ACCOUNTS: StripeAccount[] = [
  {
    id: "a",
    label: "Account 1",
    opening: 300,
    closing: 314,
    txns: [
      { type: "charge", amount: 500 },
      { type: "charge", amount: 400 },
      { type: "charge", amount: 300 },
      { type: "fee", amount: 36 },
      { type: "refund", amount: 50 },
      { type: "payout", amount: 600 },
      { type: "payout", amount: 500 },
    ],
  },
  {
    id: "b",
    label: "Account 2",
    opening: 0,
    closing: 82,
    txns: [
      { type: "charge", amount: 350 },
      { type: "charge", amount: 250 },
      { type: "fee", amount: 18 },
      { type: "payout", amount: 500 },
    ],
  },
];

const cents = (n: number) => Math.round(n * 100) / 100;
const sumOf = (txns: StripeTxn[], type: StripeTxn["type"]) => cents(txns.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0));

export function summariseStripe(txns: StripeTxn[]) {
  return { payments: sumOf(txns, "charge"), fees: sumOf(txns, "fee"), refunds: sumOf(txns, "refund"), payouts: sumOf(txns, "payout") };
}

/** opening + payments - fees - refunds - payouts - closing; 0 when the account ties out */
export function stripeGap(a: StripeAccount) {
  const s = summariseStripe(a.txns);
  return cents(a.opening + s.payments - s.fees - s.refunds - s.payouts - a.closing);
}

/* ───── contractor pay ───── */

export type Contractor = {
  id: string;
  label: string;
  jobs: number;
  /** the rate table's rate; null when the contractor is missing from it */
  rate: number | null;
  /** what the contractor is actually paid per job, for one who is missing from the table */
  missingRate: number;
  addOns: number;
  confirmed: number;
};

// made up for the figure, sized so the gap is the reel's 28%
export const CONTRACTORS: Contractor[] = [
  { id: "k1", label: "Contractor A", jobs: 4, rate: 120, missingRate: 120, addOns: 60, confirmed: 540 },
  { id: "k2", label: "Contractor B", jobs: 2, rate: 120, missingRate: 120, addOns: 40, confirmed: 280 },
  { id: "k3", label: "Contractor C", jobs: 2, rate: null, missingRate: 90, addOns: 0, confirmed: 180 },
];

export const rateTablePay = (list: Contractor[]) => list.reduce((s, c) => s + c.jobs * (c.rate ?? 0), 0);
export const confirmedPay = (list: Contractor[]) => list.reduce((s, c) => s + c.confirmed, 0);
/** how far jobs x rate falls short of the confirmed total, as a fraction (0.28 = 28%) */
export function payShortfall(list: Contractor[]) {
  const confirmed = confirmedPay(list);
  return confirmed === 0 ? 0 : Math.round(((confirmed - rateTablePay(list)) / confirmed) * 100) / 100;
}

/* ───── the balance check ───── */

export type Row = { label: string; amount: number };
export type Month = { label: string; assets: Row[]; liabilities: Row[]; equity: Row[] };

// made up for the figure
export const MONTHS: Month[] = [
  {
    label: "SEP",
    assets: [
      { label: "Cash", amount: 3900 },
      { label: "Due from Stripe", amount: 300 },
    ],
    liabilities: [
      { label: "Card balances", amount: 400 },
      { label: "Contractor pay owed", amount: 1100 },
    ],
    equity: [
      { label: "Capital", amount: 1000 },
      { label: "Retained earnings", amount: 1700 },
    ],
  },
  {
    label: "OCT",
    assets: [
      { label: "Cash", amount: 4404 },
      { label: "Due from Stripe", amount: 396 },
    ],
    liabilities: [
      { label: "Card balances", amount: 450 },
      { label: "Contractor pay owed", amount: 1000 },
    ],
    equity: [
      { label: "Capital", amount: 1000 },
      { label: "Retained earnings", amount: 2350 },
    ],
  },
];

const total = (rows: Row[]) => rows.reduce((s, r) => s + r.amount, 0);
export const monthTotals = (m: Month) => ({ assets: total(m.assets), liabilities: total(m.liabilities), equity: total(m.equity) });
/** assets - liabilities - equity; 0 when the month ties out */
export const balanceGap = (m: Month) => cents(total(m.assets) - total(m.liabilities) - total(m.equity));

export const BREAK_AMOUNT = 120;
/** the same month with one payout counted twice in cash: the figure's "break it" button */
export function breakMonth(m: Month): Month {
  return { ...m, assets: m.assets.map((r, i) => (i === 0 ? { ...r, amount: r.amount + BREAK_AMOUNT } : r)) };
}

/* ───── setup ───── */

export const SETUP: { id: string; label: string; access: string; what: string }[] = [
  { id: "gmail", label: "Gmail", access: "read", what: "A Gmail connector or MCP server, so Claude can search for receipts and save attachments." },
  { id: "chrome", label: "Claude in Chrome", access: "your logged-in session", what: "For the billing pages that only show invoices after you log in. Keep a list of them in billing-pages.md." },
  { id: "books", label: "Accounting software", access: "read + drafts", what: "Its API (or MCP server), with access to read card transactions and create draft entries." },
  { id: "stripe", label: "Stripe", access: "read only", what: "A restricted key that can read balance transactions and payouts, one per account." },
  { id: "drive", label: "Google Drive", access: "one folder", what: "Access to the one shared folder the model lives in." },
];

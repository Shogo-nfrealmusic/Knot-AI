"use client";

// /free/69 (month-close): one live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–68: paper plate on a grid, ink lines, one accent (orange), calm motion.
// From the reel: the node map, OCT 31 → NOV 1, 7 billing pages, 2 cards, 2 Stripe accounts, 1 question, 28% short, zero, Drive.
// Made up for the figures, and said so on each: every vendor, amount, contractor and month. See data.ts.
// Every label inside a figure is HTML at 12px or more, so it stays readable on a phone.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { CodeBlock } from "@/app/free/CodeCopy";
import {
  BREAK_AMOUNT,
  CARD_LINES,
  CONTRACTORS,
  HOURS_A_WEEK,
  MONTHS,
  NODES,
  RECEIPTS,
  RUNBOOK,
  SETUP,
  SOURCE,
  STEPS,
  STRIPE_ACCOUNTS,
  balanceGap,
  breakMonth,
  confirmedPay,
  matchReceipts,
  monthTotals,
  payShortfall,
  rateTablePay,
  stepsOn,
  stripeGap,
  summariseStripe,
  type CloseDemoKind,
  type NodeId,
} from "./data";

export type { CloseDemoKind } from "./data";

const TOTAL = 9;

export function CloseDemo({ kind }: { kind: CloseDemoKind }) {
  return (
    <div className="mc mt-5 max-w-2xl">
      <style>{MC_CSS}</style>
      {kind === "hours" && <Hours />}
      {kind === "map" && <SystemMap />}
      {kind === "collect" && (
        <>
          <Collect />
          <Prompts ids={["collect"]} />
        </>
      )}
      {kind === "match" && (
        <>
          <Match />
          <Prompts ids={["match", "approve"]} />
        </>
      )}
      {kind === "stripe" && (
        <>
          <Stripe />
          <Prompts ids={["stripe", "ask"]} />
        </>
      )}
      {kind === "pay" && (
        <>
          <Pay />
          <Prompts ids={["pay"]} />
        </>
      )}
      {kind === "balance" && (
        <>
          <Balance />
          <Prompts ids={["model"]} />
        </>
      )}
      {kind === "sync" && (
        <>
          <Sync />
          <Prompts ids={["sync"]} />
        </>
      )}
      {kind === "setup" && (
        <>
          <Setup />
          <div className="mt-4">
            <CodeBlock label="month-end.md · the whole system as one file" code={RUNBOOK} wrap />
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">
          {two(n)}/{two(TOTAL)}
        </span>
        <span className="text-[16px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block font-mono text-[12px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

function Prompts({ ids }: { ids: string[] }) {
  return (
    <div className="mt-4 space-y-3">
      {ids.map((id) => {
        const s = STEPS.find((step) => step.id === id);
        return s ? <CodeBlock key={id} label={`Step ${s.n} prompt · ${s.title}`} code={s.prompt} wrap /> : null;
      })}
    </div>
  );
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `mc-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const BTN_INK = `mc-press inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--ink)] px-4 text-[13px] font-medium text-white disabled:opacity-40 ${FOCUS}`;
const LABEL = "block font-mono text-[12px] tracking-[0.04em] text-[var(--accent)]";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/** The visitor's reduced-motion setting. False on the server and during hydration, so the first client render matches the server's HTML. */
function useReducedMotionSafe() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false,
  );
}

/** True once the figure has come on screen. */
function useSeen() {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { amount: 0.3, once: true });
  return { ref, seen };
}

/** Counts 0 → `to` one tick at a time once `run` is true; jumps straight to `to` with reduced motion. Returns the count and a restart. */
function useTicker(to: number, run: boolean, ms: number, firstMs = 600) {
  const reduce = useReducedMotionSafe();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run || reduce || n >= to) return;
    const id = setTimeout(() => setN((v) => v + 1), n === 0 ? firstMs : ms);
    return () => clearTimeout(id);
  }, [run, reduce, n, to, ms, firstMs]);
  return [reduce ? to : n, () => setN(0)] as const;
}

/** two or more choices, one of them on */
function Choice<T extends string>({ label, options, value, set }: { label: string; options: { id: T; label: string }[]; value: T; set: (id: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => set(o.id)}
          className={`mc-press min-h-9 rounded-full px-4 text-[13px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Check({ on, size = 18 }: { on: boolean; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full border"
      style={{ width: size, height: size, borderColor: on ? "var(--ink)" : "var(--rule-strong)", background: on ? "var(--ink)" : "#fff", transition: "background-color .25s, border-color .25s" }}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" style={{ width: size * 0.66, height: size * 0.66 }}>
        <path d="M3.5 8.5 6.6 11.5 12.5 4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={on ? 0 : 1} className="mc-line" />
      </svg>
    </span>
  );
}

const two = (n: number) => String(n).padStart(2, "0");
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;

/* ───────────── figure 1 · twenty hours of a forty-hour week ───────────── */
const WEEK = 40;

function Hours() {
  const { ref, seen } = useSeen();
  const [mode, setMode] = useState<"before" | "now">("before");
  const [filled] = useTicker(HOURS_A_WEEK, seen, 70, 500);
  const now = mode === "now";
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={1} title="Half a working week" sub="each square is one hour of a 40-hour week" />
      <Choice
        label="Month-end, before and now"
        options={[
          { id: "before", label: "Before" },
          { id: "now", label: "Now" },
        ]}
        value={mode}
        set={setMode}
      />
      <div className="mc-card mt-3">
        <div className="grid grid-cols-10 gap-1.5" aria-hidden>
          {Array.from({ length: WEEK }, (_, i) => {
            const on = !now && i < filled;
            return <span key={i} className="mc-cell aspect-square rounded-[4px] border" style={{ background: on ? "var(--accent)" : "#fff", borderColor: on ? "var(--accent)" : "var(--rule)", transitionDelay: now ? `${(WEEK - i) * 8}ms` : "0ms" }} />;
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2" aria-live="polite">
          {now ? (
            <span className="flex flex-wrap gap-1.5">
              {["1 approval", "1 answer"].map((t, i) => (
                <span key={t} className="mc-in inline-flex min-h-8 items-center rounded-full bg-[var(--ink)] px-3 font-mono text-[12px] text-white" style={{ animationDelay: `${i * 160}ms` }}>
                  {t}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-[14px] font-semibold text-[var(--ink)]">{filled} hours a week on accounting</span>
          )}
          <span className="font-mono text-[12px] text-[var(--muted)]">{now ? "what is left for you each month" : "receipts · invoices · spreadsheets"}</span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Before: the {HOURS_A_WEEK} hours a week small business owners spend on accounting ({SOURCE.name}, {SOURCE.date}). Now: what my month-end asks of me once Claude Code runs it. The squares are a drawing of the figure, not a measurement of your week.
      </figcaption>
    </figure>
  );
}

/* ───────────── figure 2 · the node map: step through the month, or press a part to open its prompt ───────────── */
function SystemMap() {
  const { ref, seen } = useSeen();
  const reduce = useReducedMotionSafe();
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(true);
  const last = STEPS.length - 1;
  // until someone presses, play the month once, one step at a time
  useEffect(() => {
    if (!seen || reduce || !playing || at >= last) return;
    const id = setTimeout(() => setAt((n) => n + 1), at === 0 ? 1800 : 2400);
    return () => clearTimeout(id);
  }, [seen, reduce, playing, at, last]);
  const step = STEPS[at];
  const nodeIndex = NODES.findIndex((n) => n.id === step.node);
  const go = (n: number) => {
    setPlaying(false);
    setAt(Math.max(0, Math.min(last, n)));
  };
  const openNode = (id: NodeId) => {
    const on = stepsOn(id);
    const i = on.findIndex((s) => s.id === step.id);
    // a part with two steps: pressing it again moves to its other step
    const next = on[i >= 0 ? (i + 1) % on.length : 0];
    go(STEPS.indexOf(next));
  };
  const reached = (id: NodeId) => STEPS.slice(0, at + 1).some((s) => s.node === id);
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={2} title="One month-end, OCT 31 → NOV 1" sub="press Next, or press a part of the map to open its prompt" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span key={`${step.day}${step.time}`} className="mc-flip inline-flex min-h-10 items-center gap-2 rounded-[10px] bg-[var(--ink)] px-3 font-mono text-[14px] font-semibold tracking-[0.04em] text-white" aria-live="polite">
          <span style={{ color: step.day === "NOV 1" ? "var(--accent)" : "#fff" }}>{step.day}</span>
          <span className="opacity-60">·</span>
          <span>{step.time}</span>
        </span>
        <span className="flex gap-1.5">
          <button type="button" className={BTN} onClick={() => go(at - 1)} disabled={at === 0}>
            Back
          </button>
          <button type="button" className={BTN_INK} onClick={() => (at === last ? go(0) : go(at + 1))}>
            {at === last ? "Start again" : "Next"}
          </button>
        </span>
      </div>

      <ol className="mt-3" aria-label="The parts of the system">
        {NODES.map((node, i) => {
          const active = i === nodeIndex;
          const done = reached(node.id) && !active;
          const isHub = i === 0;
          const people = stepsOn(node.id).filter((s) => s.you);
          return (
            <li key={node.id} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-2">
              {/* the trunk: a segment above each part fills in once the month reaches it */}
              <span className="relative flex justify-center" aria-hidden>
                {i > 0 ? (
                  <span className="absolute top-0 h-1/2 w-[2px] bg-[var(--rule-strong)]">
                    <span className="mc-fill absolute inset-x-0 top-0 bg-[var(--accent)]" style={{ height: reached(node.id) ? "100%" : "0%" }} />
                  </span>
                ) : null}
                {i < NODES.length - 1 ? (
                  <span className="absolute bottom-0 h-1/2 w-[2px] bg-[var(--rule-strong)]">
                    <span className="mc-fill absolute inset-x-0 top-0 bg-[var(--accent)]" style={{ height: STEPS.slice(0, at + 1).some((s) => NODES.findIndex((n) => n.id === s.node) > i) ? "100%" : "0%" }} />
                  </span>
                ) : null}
                <span
                  className={`relative z-[1] mt-auto mb-auto size-3.5 rounded-full border-2 ${active && !reduce ? "mc-pulse" : ""}`}
                  style={{ background: active ? "var(--accent)" : done ? "var(--ink)" : "#fff", borderColor: active ? "var(--accent)" : done ? "var(--ink)" : "var(--rule-strong)", transition: "background-color .3s, border-color .3s" }}
                />
              </span>
              <button
                type="button"
                onClick={() => openNode(node.id)}
                aria-current={active ? "step" : undefined}
                className={`mc-press my-1 flex min-h-12 w-full items-center justify-between gap-3 rounded-[12px] border bg-white px-3 py-2 text-left ${FOCUS}`}
                style={{
                  borderColor: active ? "var(--accent)" : isHub ? "var(--ink)" : "var(--rule)",
                  boxShadow: active ? "0 0 0 1px var(--accent)" : "none",
                  transition: "border-color .3s, box-shadow .3s",
                }}
              >
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold leading-snug text-[var(--ink)]">{node.label}</span>
                  <span className="block text-[13px] leading-snug text-[var(--soft)]">{node.sub}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5">
                  {people.map((s) => (
                    <span key={s.id} className="rounded-full px-2 py-0.5 font-mono text-[12px]" style={{ background: active && s.id === step.id ? "var(--accent)" : "transparent", color: active && s.id === step.id ? "#fff" : "var(--muted)", boxShadow: "inset 0 0 0 1px var(--rule-strong)" }}>
                      you: {s.you}
                    </span>
                  ))}
                  <span className="font-mono text-[12px] text-[var(--muted)]">{stepsOn(node.id).map((s) => s.n).join(" · ")}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mc-card mt-3" aria-live="polite">
        <div key={step.id} className="mc-in">
          <span className={LABEL}>
            STEP {step.n} OF {STEPS.length}
            {step.you ? ` · YOU ${step.you === "approve" ? "APPROVE" : "ANSWER"}` : ""}
          </span>
          <span className="mt-1 block text-[15px] font-semibold leading-snug text-[var(--ink)]">{step.title}</span>
          <span className="mt-1 block text-[14px] leading-relaxed text-[var(--soft)]">{step.does}</span>
          <div className="mt-3">
            <CodeBlock label={`Step ${step.n} prompt`} code={step.prompt} wrap />
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The parts and their order are the reel&apos;s. The times are an example of one month-end. Every prompt is also under its own step below.
      </figcaption>
    </figure>
  );
}

/* ───────────── figure 3 · the inbox and the seven billing pages fill one folder ───────────── */
const PAGES = ["Hosting", "Design tool", "Email", "Domains", "Phone", "Storage", "Ads"];
const INBOX = 12; // made up

function Collect() {
  const { ref, seen } = useSeen();
  const [t, restart] = useTicker(INBOX + PAGES.length, seen, 260, 700);
  const fromInbox = Math.min(t, INBOX);
  const pagesDone = Math.max(0, t - INBOX);
  const done = t >= INBOX + PAGES.length;
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={3} title="Inbox first, then the billing pages" sub="watch the folder fill" />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="mc-card">
          <span className={LABEL}>GMAIL · SEARCH LAST MONTH</span>
          <span className="mt-2 grid grid-cols-6 gap-1" aria-hidden>
            {Array.from({ length: INBOX }, (_, i) => (
              <span key={i} className="mc-cell h-5 rounded-[4px] border" style={{ background: i < fromInbox ? "var(--ink)" : "#fff", borderColor: i < fromInbox ? "var(--ink)" : "var(--rule)" }} />
            ))}
          </span>
          <span className="mt-2 block font-mono text-[12px] text-[var(--muted)]">{fromInbox} receipts saved</span>
        </div>
        <div className="mc-card">
          <span className={LABEL}>CLAUDE IN CHROME · 7 PAGES</span>
          <ul className="mt-2 grid grid-cols-2 gap-1">
            {PAGES.map((p, i) => {
              const on = i < pagesDone;
              const busy = !done && t >= INBOX && i === pagesDone;
              return (
                <li key={p} className="flex items-center gap-1.5 text-[12px] leading-tight" style={{ color: on ? "var(--ink)" : "var(--muted)" }}>
                  <Check on={on} size={14} />
                  <span className={busy ? "text-[var(--accent)]" : ""}>{p}</span>
                </li>
              );
            })}
          </ul>
          <span className="mt-2 block font-mono text-[12px] text-[var(--muted)]">{pagesDone} of 7 invoices downloaded</span>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border bg-white p-3" style={{ borderColor: done ? "var(--accent)" : "var(--ink)", transition: "border-color .3s" }}>
        <span className="min-w-0">
          <span className="block font-mono text-[12px] text-[var(--muted)]">./close/2026-10/receipts/</span>
          <span className="block text-[14px] font-semibold text-[var(--ink)]" aria-live="polite">
            {t} files{done ? " · one table: date, vendor, amount, source" : ""}
          </span>
        </span>
        <button type="button" className={BTN} onClick={restart}>
          Run again
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The number of emails and the page names are made up. Seven billing pages is the reel&apos;s number; yours will differ, and the list lives in billing-pages.md.</figcaption>
    </figure>
  );
}

/* ───────────── figure 4 · match each card line to a receipt, draft it, and book only what is approved ───────────── */
const MATCHED = matchReceipts(RECEIPTS, CARD_LINES);

function Match() {
  const { ref, seen } = useSeen();
  const [shown, restart] = useTicker(CARD_LINES.length, seen, 500, 700);
  const [approved, setApproved] = useState<string[]>([]);
  const matchedIds = MATCHED.pairs.map(([c]) => c.id);
  const allIn = shown >= CARD_LINES.length;
  const toggle = (id: string) => setApproved((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={4} title="Matched, drafted, then approved" sub="tick the drafts you approve · only those get booked" />
      <ol className="space-y-1.5" aria-label="Card lines and their receipts">
        {CARD_LINES.map((card, i) => {
          const pair = MATCHED.pairs.find(([c]) => c.id === card.id);
          const visible = i < shown;
          const ok = approved.includes(card.id);
          return (
            <li key={card.id} className="mc-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3" style={{ opacity: visible ? 1 : 0.35, borderColor: ok ? "var(--accent)" : undefined, transition: "opacity .35s, border-color .3s" }}>
              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[14px] font-semibold text-[var(--ink)]">{card.vendor}</span>
                  <span className="font-mono text-[12px] text-[var(--soft)]">
                    {money(card.amount)} · Oct {card.day}
                  </span>
                </span>
                <span className="mt-0.5 block font-mono text-[12px]" style={{ color: pair ? "var(--muted)" : "var(--accent)" }}>
                  {!visible ? "waiting" : pair ? `receipt Oct ${pair[1].day} · ${ok ? "booked" : "draft"}` : "no receipt · stays a draft, sent to you"}
                </span>
              </span>
              {pair ? (
                <button type="button" role="checkbox" aria-checked={ok} disabled={!visible} onClick={() => toggle(card.id)} className={`${ok ? BTN_INK : BTN} min-h-9 px-3`} aria-label={`Approve ${card.vendor}`}>
                  {ok ? "Approved" : "Approve"}
                </button>
              ) : (
                <span className="font-mono text-[12px] text-[var(--muted)]">ask</span>
              )}
            </li>
          );
        })}
      </ol>
      <div className="mc-card mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 flex-1 basis-[180px]">
          <span className={LABEL}>BOOKED</span>
          <span className="block text-[14px] font-semibold text-[var(--ink)]" aria-live="polite">
            {approved.length} of {matchedIds.length} matched entries
            {approved.length === 0 ? " · nothing until you approve" : ""}
          </span>
          <span className="block text-[13px] leading-snug text-[var(--soft)]">Also back to you: {MATCHED.noCard.map((r) => r.vendor.toLowerCase()).join(", ")} (a receipt with no card line).</span>
        </span>
        <span className="flex gap-1.5">
          <button type="button" className={BTN} disabled={!allIn || approved.length === matchedIds.length} onClick={() => setApproved(matchedIds)}>
            Approve all matched
          </button>
          <button
            type="button"
            className={BTN}
            onClick={() => {
              setApproved([]);
              restart();
            }}
          >
            Reset
          </button>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The vendors, amounts and dates are made up. The rule is the real part: a match is same vendor, same amount, dates within 3 days, and an entry is booked only after you approve it.</figcaption>
    </figure>
  );
}

/* ───────────── figure 5 · two Stripe accounts tie out, then one question ───────────── */
function Stripe() {
  const { ref, seen } = useSeen();
  const [id, setId] = useState(STRIPE_ACCOUNTS[0].id);
  const [answered, setAnswered] = useState(false);
  const account = STRIPE_ACCOUNTS.find((a) => a.id === id) ?? STRIPE_ACCOUNTS[0];
  const s = summariseStripe(account.txns);
  const [shown] = useTicker(4, seen, 380, 600);
  const tiles: [string, number, string][] = [
    ["Payments", s.payments, "+"],
    ["Fees", s.fees, "−"],
    ["Refunds", s.refunds, "−"],
    ["Payouts", s.payouts, "−"],
  ];
  const gap = stripeGap(account);
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={5} title="Both accounts read, one question asked" sub="switch accounts · then answer the question" />
      <Choice label="Stripe account" options={STRIPE_ACCOUNTS.map((a) => ({ id: a.id, label: a.label }))} value={id} set={setId} />
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {tiles.map(([label, value, sign], i) => (
          <div key={`${id}${label}`} className="mc-card mc-in" style={{ animationDelay: `${i * 90}ms`, opacity: i < shown ? 1 : 0.35, transition: "opacity .3s" }}>
            <span className="block font-mono text-[12px] text-[var(--muted)]">{label}</span>
            <span className="block text-[16px] font-semibold text-[var(--ink)]">
              {sign} {money(value)}
            </span>
          </div>
        ))}
      </div>
      <div className="mc-card mt-1.5 font-mono text-[12px] leading-relaxed text-[var(--soft)]">
        {money(account.opening)} opening + {money(s.payments)} − {money(s.fees)} − {money(s.refunds)} − {money(s.payouts)} = {money(account.closing)} closing
        <span className="ml-2 font-semibold" style={{ color: gap === 0 ? "var(--ink)" : "var(--accent)" }}>
          {gap === 0 ? "· ties out ✓" : `· off by ${money(gap)}`}
        </span>
      </div>

      <svg viewBox="0 0 100 24" preserveAspectRatio="none" className="block h-6 w-full" aria-hidden>
        <path d="M50 0 V24" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" className="mc-dash" />
      </svg>

      <div className="rounded-[12px] border bg-white p-3" style={{ borderColor: answered ? "var(--ink)" : "var(--accent)", boxShadow: answered ? "none" : "0 0 0 1px var(--accent)" }}>
        <span className={LABEL}>1 QUESTION · SENT TO YOU</span>
        <span className="mt-1 block text-[15px] font-semibold text-[var(--ink)]">What was the bank balance on the last day of the month?</span>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="min-w-0 flex-1 basis-[180px] text-[13px] leading-snug text-[var(--soft)]" aria-live="polite">
            {answered ? "Answered. Claude Code goes on to contractor pay." : "Everything else it read for itself."}
          </span>
          <button type="button" className={answered ? BTN : BTN_INK} onClick={() => setAnswered((a) => !a)}>
            {answered ? "Undo" : "Answer it"}
          </button>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The amounts are made up. Two accounts and one question are the reel&apos;s. No balance is shown: the answer stays with you and the model.</figcaption>
    </figure>
  );
}

/* ───────────── figure 6 · jobs × rate against the confirmed amounts ───────────── */
function Pay() {
  const { ref, seen } = useSeen();
  const reduce = useReducedMotionSafe();
  const [auto, setAuto] = useState<"v1" | "v2">("v1");
  const [picked, setPicked] = useState<"v1" | "v2" | null>(null);
  useEffect(() => {
    if (!seen || reduce || picked !== null || auto === "v2") return;
    const id = setTimeout(() => setAuto("v2"), 3200);
    return () => clearTimeout(id);
  }, [seen, reduce, picked, auto]);
  const mode = picked ?? auto;
  const v2 = mode === "v2";
  const confirmed = confirmedPay(CONTRACTORS);
  const v1Total = rateTablePay(CONTRACTORS);
  const max = Math.max(...CONTRACTORS.map((c) => c.confirmed));
  const shortPct = Math.round(payShortfall(CONTRACTORS) * 100);
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={6} title={`${shortPct}% short, then matched`} sub="switch between the two versions" />
      <Choice
        label="How pay is worked out"
        options={[
          { id: "v1", label: "v1: jobs × rate" },
          { id: "v2", label: "v2: confirmed amounts" },
        ]}
        value={mode}
        set={setPicked}
      />
      <ol className="mt-3 space-y-1.5">
        {CONTRACTORS.map((c) => {
          const base = c.jobs * (c.rate ?? 0);
          const shown = v2 ? c.confirmed : base;
          const missing = c.confirmed - base;
          return (
            <li key={c.id} className="mc-card">
              <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="text-[14px] font-semibold text-[var(--ink)]">{c.label}</span>
                <span className="font-mono text-[12px] text-[var(--soft)]">
                  {v2 ? `confirmed ${money(c.confirmed)}` : c.rate === null ? `${c.jobs} jobs × no rate = $0` : `${c.jobs} jobs × ${money(c.rate)} = ${money(base)}`}
                </span>
              </span>
              <span className="relative mt-2 block h-3 overflow-hidden rounded-full bg-[var(--page)]" aria-hidden>
                <span className="mc-bar absolute inset-y-0 left-0 rounded-full bg-[var(--ink)]" style={{ width: `${(base / max) * 100}%` }} />
                <span className="mc-bar absolute inset-y-0 rounded-full" style={{ left: `${(base / max) * 100}%`, width: `${(missing / max) * 100}%`, background: v2 ? "var(--ink)" : "transparent", boxShadow: v2 ? "none" : "inset 0 0 0 1.5px var(--accent)" }} />
              </span>
              <span className="mt-1 block font-mono text-[12px]" style={{ color: !v2 && missing > 0 ? "var(--accent)" : "var(--muted)" }}>
                {!v2 && missing > 0 ? (c.rate === null ? `missing: not in the rate table (${money(missing)})` : `missing: add-ons (${money(missing)})`) : v2 ? "from the app, as confirmed" : "matches"}
              </span>
              <span className="sr-only">{money(shown)}</span>
            </li>
          );
        })}
      </ol>
      <div className="mc-card mt-2 flex flex-wrap items-baseline justify-between gap-2" style={{ borderColor: v2 ? "var(--ink)" : "var(--accent)" }}>
        <span className="text-[14px] font-semibold text-[var(--ink)]" aria-live="polite">
          {v2 ? `Total ${money(confirmed)} · matches what was confirmed ✓` : `Total ${money(v1Total)} · ${shortPct}% short of ${money(confirmed)}`}
        </span>
        <span className="font-mono text-[12px]" style={{ color: v2 ? "var(--muted)" : "var(--accent)" }}>
          {v2 ? "v2 · approved" : "v1 · sent back"}
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The contractors and amounts are made up, sized so the gap is the reel&apos;s 28%. The causes are the usual ones: add-ons the formula never sees, and someone missing from the rate table.</figcaption>
    </figure>
  );
}

/* ───────────── figure 7 · every month must tie out to zero ───────────── */
function Balance() {
  const { ref, seen } = useSeen();
  const [broken, setBroken] = useState(false);
  const months = MONTHS.map((m, i) => (broken && i === MONTHS.length - 1 ? breakMonth(m) : m));
  const max = Math.max(...months.map((m) => monthTotals(m).assets));
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={7} title="Assets − liabilities − equity = 0" sub="break a number and watch the check stop" />
      <div className="space-y-2">
        {months.map((m) => {
          const t = monthTotals(m);
          const gap = balanceGap(m);
          const ok = gap === 0;
          return (
            <div key={m.label} className="mc-card" style={{ borderColor: ok ? undefined : "var(--accent)", boxShadow: ok ? "none" : "0 0 0 1px var(--accent)", transition: "border-color .3s, box-shadow .3s" }}>
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[13px] font-semibold text-[var(--ink)]">{m.label}</span>
                <span className="font-mono text-[12px] font-semibold" style={{ color: ok ? "var(--ink)" : "var(--accent)" }} aria-live="polite">
                  {ok ? "0 ✓" : `off by ${money(gap)} · stop`}
                </span>
              </span>
              <span className="mt-2 block space-y-1" aria-hidden>
                <span className="flex items-center gap-2">
                  <span className="w-[86px] shrink-0 font-mono text-[12px] text-[var(--muted)]">assets</span>
                  <span className="relative h-3 flex-1 rounded-full bg-[var(--page)]">
                    <span className="mc-bar absolute inset-y-0 left-0 rounded-full bg-[var(--ink)]" style={{ width: seen ? `${(t.assets / max) * 100}%` : "0%" }} />
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-[86px] shrink-0 font-mono text-[12px] text-[var(--muted)]">liab. + equity</span>
                  <span className="relative flex h-3 flex-1 overflow-hidden rounded-full bg-[var(--page)]">
                    <span className="mc-bar h-full bg-[var(--soft)]" style={{ width: seen ? `${(t.liabilities / max) * 100}%` : "0%" }} />
                    <span className="mc-bar h-full bg-[var(--rule-strong)]" style={{ width: seen ? `${(t.equity / max) * 100}%` : "0%" }} />
                  </span>
                </span>
              </span>
              <span className="mt-1.5 block font-mono text-[12px] text-[var(--soft)]">
                {money(t.assets)} − {money(t.liabilities)} − {money(t.equity)} = {money(gap)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 flex-1 basis-[180px] text-[14px] font-medium leading-snug text-[var(--ink)]">
          {broken ? `A ${money(BREAK_AMOUNT)} payout counted twice in cash. Claude Code stops here and shows you the rows. It does not add a balancing number.` : "Every month in the file ties out, not just the new one."}
        </span>
        <button type="button" className={broken ? BTN_INK : BTN} onClick={() => setBroken((b) => !b)}>
          {broken ? "Fix it" : "Count a payout twice"}
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The balance sheets are made up and tiny on purpose. A real model has many more rows; the check is the same.</figcaption>
    </figure>
  );
}

/* ───────────── figure 8 · the file goes to Drive, one summary comes back ───────────── */
const SYNC_STOPS = ["Model file", "Google Drive", "Co-founder", "One summary"];

function Sync() {
  const { ref, seen } = useSeen();
  const [t, restart] = useTicker(SYNC_STOPS.length, seen, 750, 700);
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={8} title="Synced, then one summary" sub="the file travels once" />
      <div className="relative">
        <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="absolute inset-x-[12%] top-[26px] h-5 w-[76%]" aria-hidden>
          <path d="M0 10 H400" stroke="var(--rule-strong)" strokeWidth="1.5" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
          <path d="M0 10 H400" stroke="var(--accent)" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - Math.min(1, Math.max(0, (t - 1) / (SYNC_STOPS.length - 1)))} vectorEffect="non-scaling-stroke" className="mc-line" />
        </svg>
        <ol className="relative grid grid-cols-4 gap-1">
          {SYNC_STOPS.map((label, i) => {
            const on = i < t;
            return (
              <li key={label} className="flex flex-col items-center gap-1.5 text-center">
                <span className="flex size-[52px] items-center justify-center rounded-[14px] border bg-white" style={{ borderColor: on ? (i === SYNC_STOPS.length - 1 ? "var(--accent)" : "var(--ink)") : "var(--rule)", transition: "border-color .3s" }}>
                  <Check on={on} size={22} />
                </span>
                <span className="text-[12px] font-medium leading-tight text-[var(--ink)]">{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="mc-card mt-3" style={{ opacity: t >= SYNC_STOPS.length ? 1 : 0.4, transition: "opacity .4s" }}>
        <span className={LABEL}>MONTH CLOSED · SUMMARY</span>
        <ul className="mt-2 space-y-1.5">
          {["Revenue, costs, profit", "Cash at month end", "Biggest change since last month", "Waiting for you"].map((row) => (
            <li key={row} className="flex items-center justify-between gap-3 text-[13px] text-[var(--soft)]">
              <span>{row}</span>
              <span className="h-2 w-16 shrink-0 rounded-full bg-[var(--rule)]" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" className={BTN} onClick={restart}>
          Run again
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The summary&apos;s rows are what my prompt asks for; the values are left blank on purpose.</figcaption>
    </figure>
  );
}

/* ───────────── figure 9 · five connections, each with the least access ───────────── */
function Setup() {
  const { ref, seen } = useSeen();
  const [t] = useTicker(SETUP.length, seen, 350, 500);
  return (
    <figure ref={ref} className="mc-plate p-4 sm:p-6">
      <Plate n={9} title="Five connections" sub="each one with the least access it needs" />
      <ol className="space-y-1.5">
        {SETUP.map((s, i) => {
          const on = i < t;
          return (
            <li key={s.id} className="mc-card flex items-start gap-3" style={{ opacity: on ? 1 : 0.4, transition: "opacity .35s" }}>
              <span className="mt-0.5">
                <Check on={on} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="text-[14px] font-semibold text-[var(--ink)]">{s.label}</span>
                  <span className="rounded-full px-2 font-mono text-[12px] text-[var(--accent)] shadow-[inset_0_0_0_1px_var(--accent)]">{s.access}</span>
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-[var(--soft)]">{s.what}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mc-card mt-2">
        <span className={LABEL}>NEVER</span>
        <span className="mt-1 block text-[14px] leading-relaxed text-[var(--ink)]">Book without approval, pay anyone, send money, or plug a gap with a balancing number.</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Which connector or MCP server you use for each depends on your accounting software and plan. Start the file below on the last day of the month.</figcaption>
    </figure>
  );
}

const MC_CSS = `
.mc{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.mc-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.mc-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.mc-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.mc-press:active:not(:disabled){transform:scale(.97)}
.mc-in{animation:mc-in .4s cubic-bezier(.22,1,.36,1) both}
@keyframes mc-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.mc-flip{animation:mc-flip .45s cubic-bezier(.22,1,.36,1) both}
@keyframes mc-flip{from{opacity:0;transform:rotateX(70deg)}to{opacity:1;transform:none}}
.mc-pulse{animation:mc-pulse 1.6s ease-in-out infinite}
@keyframes mc-pulse{0%,100%{box-shadow:0 0 0 0 rgba(215,119,87,.45)}50%{box-shadow:0 0 0 6px rgba(215,119,87,0)}}
.mc-dash{animation:mc-dash 1s linear infinite}
@keyframes mc-dash{to{stroke-dashoffset:-12}}
.mc-cell{transition:background-color .3s,border-color .3s}
.mc-fill{transition:height .5s cubic-bezier(.22,1,.36,1)}
.mc-bar{transition:width .7s cubic-bezier(.22,1,.36,1),left .7s cubic-bezier(.22,1,.36,1),background-color .3s,box-shadow .3s}
.mc-line{transition:stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)}
@media (prefers-reduced-motion:reduce){.mc-in,.mc-flip,.mc-pulse,.mc-dash{animation:none}.mc-cell,.mc-fill,.mc-bar,.mc-line{transition:none}}
`;

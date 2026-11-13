"use client";

// /free/63 (The Founder skill): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–61: paper plate, ink lines, one accent (orange).
// Real (the repo's README and skills/founder-consumer/SKILL.md, read Nov 13, 2026): the eleven skills, their jobs and
// their order; the panel sizes (100, or 20 with --quick) and the waves of 10; the matcha-café example numbers
// ($6.50 a cup, $4.76 left per cup, break-even 186 cups a day, 38% margin at 383 cups a day).
// No buy rate is drawn anywhere: the README gives none, and a made-up one would look like a result.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type FounderDemoKind = "eleven" | "panel" | "cfo";

const REPO = "https://github.com/Jakeschincariol/founder-skill";

export function FounderDemo({ kind }: { kind: FounderDemoKind }) {
  return (
    <div className="fd mt-5 max-w-2xl">
      <style>{FD_CSS}</style>
      {kind === "eleven" && <Eleven />}
      {kind === "panel" && <Panel />}
      {kind === "cfo" && <Cfo />}
    </div>
  );
}

/** a clock that runs only while the figure is on screen; frozen with reduced motion */
function useClock() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setT((v) => v + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduce]);
  return { ref, t, reduce: !!reduce };
}

function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/03</span>
        <span className="truncate text-[15px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block truncate font-mono text-[11.5px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

function Source({ text }: { text: string }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      <a href={REPO} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)]">
        {text}
      </a>
    </p>
  );
}

// ───────── 1 · the eleven, in the order the README says to run them; pick one to read its job ─────────
const SKILLS: { cmd: string; job: string; what: string }[] = [
  { cmd: "board", job: "Board of Directors", what: "Three board members, each applying one published framework (Offers, Monopoly, Product), score the idea, name what would kill it and vote." },
  { cmd: "competitors", job: "Competitor Scout", what: "Maps direct competitors, indirect ones and substitutes from public sources, with prices, positioning and what their customers complain about." },
  { cmd: "consumer", job: "Consumer Panel", what: "Spins up a swarm of buyer agents (100 by default), each with its own income, habits and objection, and tallies who buys, who doesn't and why." },
  { cmd: "pricing", job: "Pricing Strategist", what: "Turns the panel's price answers into an acceptable price range, sets it against competitors and your margin, and picks what to test." },
  { cmd: "offer", job: "Offer Architect", what: "Builds the offer stack that answers the panel's objections, then re-tests it on the panel." },
  { cmd: "cfo", job: "CFO", what: "Unit economics: contribution per sale, the real profit margin, break-even per day, year 1 month by month, cash needed, payback." },
  { cmd: "marketing", job: "Marketing Director", what: "Positioning, the channels your buyers use, a dated 30-day launch campaign, ten hooks and the most you can pay for a customer." },
  { cmd: "brand", job: "Brand Designer", what: "Name candidates with the trademark, domain and handle checks to run, a voice, a promise and a brief for the look." },
  { cmd: "ops", job: "Operations Manager", what: "Suppliers, staffing, day-one routines, tools, the permits to check and a risk register." },
  { cmd: "launch", job: "Launch Lead", what: "A cheap real-world test first, then a dated countdown, the launch-day run sheet and the first 30 days." },
  { cmd: "plan", job: "Business Planner", what: "Compiles everything into one business plan with a verdict computed from the numbers: Profitable, Not yet or Incomplete." },
];

function Eleven() {
  const [i, setI] = useState(2);
  const s = SKILLS[i];
  return (
    <figure className="fd-plate p-4 sm:p-6">
      <Plate n={1} title="Eleven skills, one order" sub="tap a step to read its job" />
      <div role="radiogroup" aria-label="Skill" className="flex flex-wrap items-center gap-x-1 gap-y-2">
        {SKILLS.map((k, n) => (
          <span key={k.cmd} className="flex items-center gap-1">
            <button
              type="button"
              role="radio"
              aria-checked={i === n}
              onClick={() => setI(n)}
              className={`fd-press rounded-full px-2.5 py-1 font-mono text-[11.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${i === n ? "bg-[var(--ink)] text-white" : n < i ? "bg-white text-[var(--ink)] shadow-[0_0_0_1px_var(--rule-strong)]" : "bg-white text-[var(--soft)] shadow-[0_0_0_1px_var(--rule)]"}`}
            >
              {k.cmd}
            </button>
            {n < SKILLS.length - 1 ? <span aria-hidden className="font-mono text-[11px] text-[var(--muted)]">→</span> : null}
          </span>
        ))}
      </div>
      <div className="fd-card mt-4 min-h-[112px]">
        <span className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-[15px] font-semibold text-[var(--ink)]">{s.job}</span>
          <span className="font-mono text-[11.5px] text-[var(--accent)]">/founder-{s.cmd} · step {i + 1} of 11</span>
        </span>
        <span className="mt-1.5 block text-[13.5px] leading-relaxed text-[var(--soft)]">{s.what}</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Each skill reads what the earlier ones wrote, in a <code className="font-mono text-[12px]">founder/</code> folder in your project. You can also run any one on its own.
      </figcaption>
      <Source text="founder-skill README, “The eleven” and “How to use it”" />
    </figure>
  );
}

// ───────── 2 · the consumer panel: buyers are dealt, then run in waves of 10 sub-agents ─────────
type Size = 100 | 20;
const SIZES: { id: Size; label: string }[] = [
  { id: 100, label: "100 buyers" },
  { id: 20, label: "--quick · 20" },
];

function Panel() {
  const { ref, t, reduce } = useClock();
  const [size, setSize] = useState<Size>(100);
  const [t0, setT0] = useState(0);
  const waves = size / 10;
  const s = reduce ? 999 : t - t0;
  const perWave = 0.7;
  const wave = Math.min(waves, Math.floor(s / perWave));
  const done = wave >= waves;
  return (
    <figure ref={ref} className="fd-plate p-4 sm:p-6">
      <Plate n={2} title="One pitch, shown to every buyer" sub="dealt as cards, run in waves of 10 sub-agents" />
      <div className="flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Panel size" className="inline-flex gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
          {SIZES.map((o) => (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={size === o.id}
              onClick={() => { setSize(o.id); setT0(t); }}
              className={`fd-press rounded-full px-3 py-1.5 text-[12.5px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${size === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setT0(t)} className="fd-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          Run again
        </button>
      </div>
      <div className="mt-4 grid grid-cols-10 gap-1.5" aria-hidden>
        {Array.from({ length: size }, (_, n) => {
          const w = Math.floor(n / 10);
          const state = w < wave ? "done" : w === wave && !done ? "run" : "wait";
          return (
            <span
              key={n}
              className="aspect-square rounded-full"
              style={{
                background: state === "done" ? "var(--ink)" : state === "run" ? "var(--accent)" : "transparent",
                boxShadow: state === "wait" ? "inset 0 0 0 1px var(--rule-strong)" : undefined,
                transition: "background-color .25s",
              }}
            />
          );
        })}
      </div>
      <p className="mt-3 min-h-[20px] text-center font-mono text-[11.5px] text-[var(--soft)]">
        {done ? `${size} answers written · next: tally who buys, who passes and why` : `wave ${wave + 1} of ${waves} · 10 buyers answering`}
      </p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Each dot is one buyer card: a name, an age, an income, a buying habit and a doubt. Orange is the wave that is answering, ink is an answer on file. The figure shows the procedure only. It draws no buy rate, because that comes from your own run.
      </figcaption>
      <Source text="skills/founder-consumer/SKILL.md, “Step 3: deal and run”" />
    </figure>
  );
}

// ───────── 3 · the CFO on the README's example: a matcha café, $6.50 a cup ─────────
const PRICE = 6.5;
const LEFT = 4.76; // what each cup leaves after its own costs
const BREAK_EVEN = 186; // cups a day
const FIXED = BREAK_EVEN * LEFT; // the daily costs that break-even implies
const usd = (n: number) => `${n < 0 ? "−" : ""}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

function Cfo() {
  const [cups, setCups] = useState(383);
  const profit = cups * LEFT - FIXED;
  const margin = profit / (cups * PRICE);
  const ok = cups >= BREAK_EVEN;
  return (
    <figure className="fd-plate p-4 sm:p-6">
      <Plate n={3} title="Break-even, on the README's example" sub="a matcha café · $6.50 a cup · move the slider" />
      <label className="block">
        <span className="flex items-baseline justify-between font-mono text-[11.5px] text-[var(--soft)]">
          <span>Cups sold a day</span>
          <span className="tabular-nums text-[var(--ink)]">{cups}</span>
        </span>
        <input type="range" min={50} max={500} step={1} value={cups} onChange={(e) => setCups(Number(e.target.value))} className="mt-1 w-full accent-[var(--accent)]" />
      </label>
      <div className="relative mt-3 h-6 rounded-full bg-white shadow-[inset_0_0_0_1px_var(--rule)]">
        <span className="block h-full rounded-full" style={{ width: `${(cups / 500) * 100}%`, background: ok ? "var(--accent)" : "var(--rule-strong)" }} />
        <span aria-hidden className="absolute top-[-4px] bottom-[-4px] w-px bg-[var(--ink)]" style={{ left: `${(BREAK_EVEN / 500) * 100}%` }} />
      </div>
      <p className="mt-1 font-mono text-[10.5px] text-[var(--muted)]" style={{ paddingLeft: `calc(${(BREAK_EVEN / 500) * 100}% - 3.2rem)` }}>break-even · 186 cups</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="fd-card">
          <span className="block font-mono text-[11px] text-[var(--muted)]">Profit a day</span>
          <span className="mt-1 block text-[20px] font-semibold tabular-nums" style={{ color: ok ? "var(--accent)" : "var(--soft)" }}>{usd(profit)}</span>
        </div>
        <div className="fd-card">
          <span className="block font-mono text-[11px] text-[var(--muted)]">Profit margin</span>
          <span className="mt-1 block text-[20px] font-semibold tabular-nums" style={{ color: ok ? "var(--accent)" : "var(--soft)" }}>{ok ? `${Math.round(margin * 100)}%` : "below break-even"}</span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        From the README: each cup leaves $4.76 after its own costs, break-even is 186 cups a day, and the margin at the planned 383 cups is 38%. The slider recomputes the rest from those three numbers, so it is the example&apos;s arithmetic and not a forecast for your business.
      </figcaption>
      <Source text="founder-skill README, “How to use it”, step 6" />
    </figure>
  );
}

const FD_CSS = `
.fd{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.fd-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.fd-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.fd-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.fd-press:active:not(:disabled){transform:scale(.97)}
`;

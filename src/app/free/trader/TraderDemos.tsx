"use client";

// /free/76 (The Trader skill): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–74: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real: every name, command, number and quoted line is from github.com/Jakeschincariol/trader-skill (MIT): README.md,
// the SKILL.md files and the repo's own test fixtures. The sizer runs trader-budget's rules on Berkshire's Q2 2026
// top 5 (the README example). Nothing here talks to a broker or to SEC. See data.ts.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import {
  BERKSHIRE,
  DISCLOSE_WITHIN_DAYS,
  FINE_PRINT,
  FLOWS,
  GATES,
  INSTALL,
  PTR,
  REPO,
  RISK_LIMITS,
  RULES,
  SKILLS,
  daysBetween,
  riskCheck,
  sizeBudget,
  ticketJson,
  type TraderDemoKind,
} from "./data";

export type { TraderDemoKind } from "./data";

export function TraderDemo({ kind }: { kind: TraderDemoKind }) {
  return (
    <div className="td mt-5 max-w-2xl">
      <style>{TD_CSS}</style>
      {kind === "eleven" && <Eleven />}
      {kind === "install" && <Install />}
      {kind === "flow" && <Sizer />}
      {kind === "pelosi" && <Pelosi />}
      {kind === "fineprint" && <Gates />}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/05</span>
        <span className="text-[15px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block font-mono text-[11.5px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

const LINK = "underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)]";

function Source({ text, path }: { text: string; path?: string }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      <a href={path ? `${REPO}/blob/main/${path}` : REPO} target="_blank" rel="noopener noreferrer" className={LINK}>
        {text}
      </a>
    </p>
  );
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `td-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const PRIMARY = `td-press inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 text-[13.5px] font-medium text-white disabled:opacity-40 ${FOCUS}`;

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

/** Counts 0 → total once the figure is on screen, one step every `ms`. With reduced motion it is `total` from the start. */
function useSteps(total: number, ms: number) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35, once: true });
  const reduce = useReducedMotionSafe();
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setStep(n);
      if (n >= total) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [visible, reduce, run, total, ms]);
  const replay = () => {
    setStep(0);
    setRun((v) => v + 1);
  };
  return { ref, step: reduce ? total : step, replay, reduce };
}

/** Copies `text`; the label turns to "Copied" for a moment, or to "Select and copy" if the browser refuses. */
function useCopy(text: string) {
  const [last, setLast] = useState<{ text: string; ok: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  const copy = async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      ok = false;
    }
    setLast({ text, ok });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLast(null), 1800);
  };
  const state: "idle" | "done" | "failed" = last && last.text === text ? (last.ok ? "done" : "failed") : "idle";
  return { state, copy };
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
          className={`td-press rounded-full px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A block to paste, with its own copy button. */
function CopyBlock({ text, label }: { text: string; label: string }) {
  const { state, copy } = useCopy(text);
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--rule)] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] px-3 py-1.5">
        <span className="font-mono text-[11px] text-[var(--muted)]">{label}</span>
        <button type="button" className={BTN} onClick={copy} aria-label={`Copy: ${label}`}>
          {state === "done" ? "Copied" : state === "failed" ? "Select and copy" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--ink)]">{text}</pre>
    </div>
  );
}

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const short = (command: string) => command.replace("/trader-", "");

/* ───────────── 1 · the eleven: pick a way of working, see which skills it chains; tap a skill for its job ───────────── */
function Eleven() {
  const [flowId, setFlowId] = useState(FLOWS[0].id);
  const flow = FLOWS.find((f) => f.id === flowId)!;
  const [picked, setPicked] = useState("/trader-copycat");
  const skill = SKILLS.find((s) => s.command === picked)!;
  // the line's parts, with the README's own separators: " -> " is "then", " / " is "or, side by side"
  const parts = flow.line.split(/( -> | \/ )/);
  const { ref, step, replay } = useSteps(flow.steps.length, 260);
  const inFlow = new Set(flow.steps);
  return (
    <figure ref={ref} className="td-plate p-4 sm:p-6">
      <Plate n={1} title="Eleven skills, one folder" sub="pick a way of working · tap a skill" />
      <Choice
        label="How you use it"
        options={FLOWS.map((f) => ({ id: f.id, label: f.label }))}
        value={flowId}
        set={(id) => {
          setFlowId(id);
          setPicked(`/trader-${FLOWS.find((f) => f.id === id)!.steps[0]}`);
          replay();
        }}
      />

      <div className="td-card mt-3" aria-live="polite">
        <span className="font-mono text-[11px] text-[var(--muted)]">trader/ · each skill reads what the last one wrote</span>
        <ol key={flow.id} className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label={`The ${flow.label} chain`}>
          {parts.map((part, i) => {
            if (part === " -> " || part === " / ") {
              return (
                <li key={i} aria-hidden className="font-mono text-[13px] text-[var(--muted)]">
                  {part === " -> " ? (
                    <svg viewBox="0 0 22 10" className="h-2.5 w-5">
                      <path d="M1 5h18M15 1.5L19.5 5 15 8.5" fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    "/"
                  )}
                </li>
              );
            }
            const index = flow.steps.indexOf(part);
            const on = index < step;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setPicked(`/trader-${part}`)}
                  className={`td-press rounded-md border px-2 py-1 font-mono text-[12.5px] ${FOCUS}`}
                  style={{
                    borderColor: picked === `/trader-${part}` ? "var(--accent)" : on ? "var(--ink)" : "var(--rule)",
                    background: picked === `/trader-${part}` ? "var(--accent)" : on ? "var(--ink)" : "#fff",
                    color: on || picked === `/trader-${part}` ? "#fff" : "var(--muted)",
                    transition: "background-color .3s, border-color .3s, color .3s",
                  }}
                >
                  {part}
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label="The eleven skills">
        {SKILLS.map((s) => {
          const on = s.command === picked;
          const lit = inFlow.has(short(s.command));
          return (
            <li key={s.command}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setPicked(s.command)}
                className={`td-press flex min-h-11 w-full flex-col items-start rounded-[10px] border px-2.5 py-1.5 text-left ${FOCUS}`}
                style={{ borderColor: on ? "var(--ink)" : lit ? "var(--rule-strong)" : "var(--rule)", background: on ? "var(--ink)" : "#fff", transition: "background-color .25s, border-color .25s" }}
              >
                <span className="font-mono text-[11.5px]" style={{ color: on ? "#fff" : lit ? "var(--ink)" : "var(--muted)" }}>
                  {short(s.command)}
                </span>
                <span className="text-[12px] leading-snug" style={{ color: on ? "rgba(255,255,255,.7)" : "var(--soft)" }}>
                  {s.job}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="td-card mt-2" aria-live="polite">
        <span key={skill.command} className="td-in block">
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-mono text-[14px] font-semibold text-[var(--ink)]">{skill.command}</span>
            <span className="font-mono text-[11px] text-[var(--accent)]">{skill.job.toUpperCase()}</span>
          </span>
          <span className="mt-1.5 block border-l-2 border-[var(--accent)] pl-3 text-[13.5px] leading-relaxed text-[var(--ink)]">&ldquo;{skill.does}&rdquo;</span>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The four chains and every job line are the README&apos;s, word for word. An arrow means the next skill reads the file the last one wrote; a slash means they run side by side.
      </figcaption>
      <Source text="README, The eleven · How to use it" path="README.md" />
    </figure>
  );
}

/* ───────────── 2 · install: three routes, the README's lines, and what the command is called after each ───────────── */
type Route = "paste" | "plugin" | "copy";
const ROUTES: { id: Route; label: string; where: string }[] = [
  { id: "paste", label: "Paste into Claude", where: "Paste this into Claude" },
  { id: "plugin", label: "Claude Code plugin", where: "Or as a plugin, in Claude Code" },
  { id: "copy", label: "Copy the folders", where: "In a terminal, for plain /trader-copycat" },
];

function Install() {
  const [route, setRoute] = useState<Route>("paste");
  const r = ROUTES.find((x) => x.id === route)!;
  const text = route === "paste" ? INSTALL.paste : route === "plugin" ? INSTALL.plugin.join("\n") : INSTALL.copy;
  const lines = text.split("\n");
  // steps 1..n: one line appears per step, then the installed command lights up
  const { ref, step, replay, reduce } = useSteps(lines.length + 1, 380);
  return (
    <figure ref={ref} className="td-plate p-4 sm:p-6">
      <Plate n={2} title="Install it" sub="pick a route · copy the lines" />
      <Choice
        label="How to install"
        options={ROUTES.map((x) => ({ id: x.id, label: x.label }))}
        value={route}
        set={(id) => {
          setRoute(id);
          replay();
        }}
      />

      {/* a drawing of the chat or terminal, not a screenshot */}
      <div className="mt-3 rounded-[14px] bg-[var(--ink)] p-3 sm:p-4" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
          <span className="ml-2 font-mono text-[11px] text-white/50">{route === "paste" ? "Claude" : route === "plugin" ? "Claude Code" : "terminal"}</span>
        </span>
        <pre className="mt-3 min-h-[4.5rem] overflow-x-auto font-mono text-[12.5px] leading-relaxed text-white">
          {lines.map((line, i) => (
            <span key={`${route}-${i}`} className="block" style={{ opacity: i < step ? 1 : 0, transform: i < step ? "none" : "translateY(3px)", transition: "opacity .3s, transform .3s" }}>
              {line ? (route === "paste" ? line : `› ${line}`) : " "}
            </span>
          ))}
        </pre>
      </div>

      <div className="mt-2">
        <CopyBlock key={route} text={text} label={r.where} />
      </div>

      <div className="td-card mt-2" aria-live="polite">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[12.5px] font-medium text-[var(--ink)]">Then the first skill is called</span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
        <span
          className="mt-2 inline-block rounded-md px-2 py-1 font-mono text-[14px] font-semibold"
          style={{ background: step > lines.length ? "var(--accent)" : "var(--rule)", color: step > lines.length ? "#fff" : "var(--muted)", transition: "background-color .3s, color .3s" }}
        >
          {INSTALL.named[route]}
        </span>
        {route === "plugin" ? (
          <span className="mt-2 block text-[12.5px] leading-relaxed text-[var(--soft)]">README: &ldquo;Claude Code namespaces plugin skills&rdquo;, so as a plugin every command carries the trader-skill: prefix.</span>
        ) : null}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The lines are the README&apos;s, verbatim. The dark panel is a drawing. The tools need Python 3.8 or newer and nothing to pip install.
      </figcaption>
      <Source text="README, Install" path="README.md" />
    </figure>
  );
}

/* ───────────── 3 · copycat → budget → risk → broker, with trader-budget's rules on a budget you set ───────────── */
const STAGES = ["copycat", "budget", "risk", "broker"] as const;
const MIN = 1000;
const MAX = 20000;
const START = 5000;

function Sizer() {
  const [budget, setBudget] = useState(START);
  const sized = sizeBudget(budget);
  const verdicts = riskCheck(sized);
  const passed = verdicts.filter((v) => v.verdict === "PASS");
  const first = verdicts[0];
  const { ref, step, replay, reduce } = useSteps(STAGES.length, 450);
  const cap = (budget * RULES.maxPositionPct) / 100;
  return (
    <figure ref={ref} className="td-plate p-4 sm:p-6">
      <Plate n={3} title="Copy Berkshire with your budget" sub="slide the budget · watch every dollar move" />

      <svg viewBox="0 0 320 44" className="w-full" role="img" aria-label="copycat, then budget, then risk, then broker">
        <line x1="30" y1="16" x2="290" y2="16" stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 3" />
        <rect x="30" y="15.25" height="1.5" width={(260 * Math.max(0, Math.min(step, STAGES.length) - 1)) / (STAGES.length - 1)} fill="var(--ink)" style={{ transition: "width .45s ease-out" }} />
        {STAGES.map((s, n) => (
          <g key={s}>
            <circle
              cx={30 + (n * 260) / (STAGES.length - 1)}
              cy="16"
              r={n === step - 1 ? 8 : 6}
              fill={n < step ? (n === STAGES.length - 1 ? "var(--accent)" : "var(--ink)") : "#fff"}
              stroke="var(--ink)"
              strokeWidth="1.3"
              style={{ transition: "r .3s cubic-bezier(.34,1.56,.64,1), fill .3s" }}
            />
            <text x={30 + (n * 260) / (STAGES.length - 1)} y="40" textAnchor="middle" fontSize="10.5" fontFamily="ui-monospace, monospace" fill={n < step ? "var(--ink)" : "var(--muted)"}>
              {s}
            </text>
          </g>
        ))}
      </svg>

      <div className="td-card mt-2">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] text-[var(--accent)]">1 · COPYCAT</span>
          <span className="font-mono text-[11px] text-[var(--muted)]">{BERKSHIRE.label}</span>
        </span>
        <span className="mt-1 block text-[13px] leading-relaxed text-[var(--soft)]">
          {BERKSHIRE.filer}&apos;s 13F-HR (filed {BERKSHIRE.filed}), top five, renormalised to 100%:
        </span>
        <span className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[12px] text-[var(--ink)]">
          {sized.rows.map((r) => (
            <span key={r.ticker}>
              {r.ticker} {r.weight.toFixed(2)}%
            </span>
          ))}
        </span>
      </div>

      <div className="td-card mt-2">
        <span className="font-mono text-[11px] text-[var(--accent)]">2 · BUDGET</span>
        <label className="mt-1.5 block">
          <span className="flex items-baseline justify-between gap-3">
            <span className="text-[12.5px] font-medium text-[var(--ink)]">Your budget</span>
            <span className="font-mono text-[20px] font-semibold tabular-nums text-[var(--ink)]">{usd(budget)}</span>
          </span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={100}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            aria-valuetext={usd(budget)}
            className={`td-range mt-2 w-full ${FOCUS}`}
          />
        </label>
        <span className="mt-1 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--muted)]">
          <span>
            {RULES.cashBufferPct}% cash buffer · {RULES.maxPositionPct}% cap ({usd(cap)}) · fractional shares
          </span>
          <button type="button" className={BTN} disabled={budget === START} onClick={() => setBudget(START)}>
            README&apos;s $5,000
          </button>
        </span>

        {/* the whole budget as one bar: five stocks and the cash buffer */}
        <svg viewBox="0 0 300 14" className="mt-3 w-full" preserveAspectRatio="none" aria-hidden>
          {(() => {
            let x = 0;
            const segs = [...sized.rows.map((r, i) => ({ id: r.ticker, w: r.dollars, fill: i === 0 ? "var(--accent)" : i % 2 ? "var(--ink)" : "var(--soft)" })), { id: "cash", w: sized.cash, fill: "var(--rule)" }];
            return segs.map((s) => {
              const width = (s.w / budget) * 300;
              const el = <rect key={s.id} x={x} y="0" width={Math.max(0, width - 1)} height="14" fill={s.fill} style={{ transition: "x .35s, width .35s" }} />;
              x += width;
              return el;
            });
          })()}
        </svg>

        <ul className="mt-3 space-y-1.5" aria-live="polite" aria-label="What each stock gets">
          {sized.rows.map((r) => (
            <li key={r.ticker} className="grid grid-cols-[3.25rem_1fr_4.5rem] items-center gap-2">
              <span className="font-mono text-[12px] font-semibold text-[var(--ink)]">{r.ticker}</span>
              <span className="relative h-2.5 rounded-full bg-[var(--rule)]">
                <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${(r.dollars / cap) * 100}%`, background: r.capped ? "var(--accent)" : "var(--ink)", transition: "width .35s cubic-bezier(.22,1,.36,1)" }} />
              </span>
              <span className="text-right font-mono text-[12px] tabular-nums text-[var(--ink)]">{usd(r.dollars)}</span>
            </li>
          ))}
          <li className="grid grid-cols-[3.25rem_1fr_4.5rem] items-center gap-2 text-[var(--muted)]">
            <span className="font-mono text-[12px]">cash</span>
            <span className="text-[12px]">the buffer stays put{sized.idle ? ` · ${usd(sized.idle)} left idle` : " · $0 left idle"}</span>
            <span className="text-right font-mono text-[12px] tabular-nums">{usd(sized.cash)}</span>
          </li>
        </ul>
        <span className="mt-2 block text-[12px] leading-snug text-[var(--soft)]">
          The bars are measured against the {RULES.maxPositionPct}% cap. Apple always hits it here, so it is pinned there (orange) and its excess is shared over the other four by weight.
        </span>
      </div>

      <div className="td-card mt-2">
        <span className="font-mono text-[11px] text-[var(--accent)]">3 · RISK</span>
        <ul className="mt-1.5 space-y-1 font-mono text-[12px]" aria-live="polite">
          {verdicts.map((v, i) => (
            <li key={v.ticker} className="flex flex-wrap gap-x-2">
              <span className="w-11 font-semibold" style={{ color: v.verdict === "PASS" ? "var(--ink)" : "var(--accent)" }}>
                {v.verdict}
              </span>
              <span className="text-[var(--ink)]">
                #{i + 1} buy {v.ticker} {usd(v.dollars)}
              </span>
              {v.reason ? <span className="text-[var(--accent)]">{v.reason}</span> : null}
            </li>
          ))}
        </ul>
        <span className="mt-2 block text-[12px] leading-snug text-[var(--soft)]">
          {passed.length} passed, {verdicts.length - passed.length} blocked, with trader-budget&apos;s default limits (max order {usd(RISK_LIMITS.maxOrderUsd)}, min order {usd(RISK_LIMITS.minOrderUsd)}). A block is final: you would lower the amount or change a rule yourself.
        </span>
      </div>

      <div className="td-card mt-2">
        <span className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[11px] text-[var(--accent)]">4 · BROKER</span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
        {first ? (
          <>
            <span className="mt-1.5 block font-mono text-[12.5px] leading-relaxed text-[var(--ink)]">
              ORDER 1 of {verdicts.length}, PAPER account
              <br />
              BUY {usd(first.dollars)} of {first.ticker}, market order, good for today
              <br />
              <span style={{ color: first.verdict === "PASS" ? "var(--ink)" : "var(--accent)" }}>{first.verdict === "PASS" ? "READY: trader-risk PASS, waiting for your yes" : "BLOCKED: goes back to trader-risk, never to you"}</span>
            </span>
            <pre className="mt-2 overflow-x-auto rounded-md bg-[var(--page)] px-2.5 py-2 font-mono text-[11.5px] text-[var(--soft)]">{ticketJson(first.ticker, first.dollars)}</pre>
          </>
        ) : null}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        At {usd(START)} this is the README&apos;s example to the dollar: Apple $1,250 (capped), American Express $1,119, Alphabet $823, Coca-Cola $708, Bank of America $600, $500 cash. Other budgets run the same rules from trader-budget&apos;s SKILL.md in your browser. Not a recommendation.
      </figcaption>
      <Source text="README, How to use it · trader-budget, trader-risk and trader-broker SKILL.md" path="trader-budget/SKILL.md" />
    </figure>
  );
}

/* ───────────── 4 · the Pelosi tracker: one real PTR, row by row, and how long each trade took to show up ───────────── */
const fmt = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${m}/${d}/${y}`;
};

function Pelosi() {
  const [index, setIndex] = useState(1);
  const row = PTR.rows[index];
  const days = daysBetween(row.date, PTR.filed);
  const { ref, step, replay, reduce } = useSteps(1, 120);
  const x = (d: number) => 20 + (d / DISCLOSE_WITHIN_DAYS) * 260;
  const shown = step > 0 ? days : 0;
  return (
    <figure ref={ref} className="td-plate p-4 sm:p-6">
      <Plate n={4} title="One real disclosure" sub="tap a row · see how late it was public" />

      <div className="td-card">
        <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="font-mono text-[11px] text-[var(--muted)]">Periodic Transaction Report · Clerk of the House</span>
          <span className="font-mono text-[11px] text-[var(--muted)]">Filing ID #{PTR.id}</span>
        </span>
        <dl className="mt-2 grid grid-cols-[6.5rem_1fr] gap-y-0.5 text-[13px]">
          <dt className="text-[var(--muted)]">Name</dt>
          <dd className="font-semibold text-[var(--ink)]">{PTR.name}</dd>
          <dt className="text-[var(--muted)]">Status</dt>
          <dd className="text-[var(--ink)]">{PTR.status}</dd>
          <dt className="text-[var(--muted)]">State/District</dt>
          <dd className="text-[var(--ink)]">{PTR.district}</dd>
          <dt className="text-[var(--muted)]">Filed</dt>
          <dd className="text-[var(--ink)]">{fmt(PTR.filed)}</dd>
        </dl>
      </div>

      <ul className="mt-2 space-y-1" role="radiogroup" aria-label="The report's rows">
        {PTR.rows.map((r, i) => {
          const on = i === index;
          return (
            <li key={i}>
              <button
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => {
                  setIndex(i);
                  replay();
                }}
                className={`td-press grid w-full grid-cols-[1fr_auto] items-center gap-x-3 rounded-[10px] border px-3 py-1.5 text-left ${FOCUS}`}
                style={{ borderColor: on ? "var(--ink)" : "var(--rule)", background: on ? "var(--ink)" : "#fff", transition: "background-color .25s, border-color .25s" }}
              >
                <span className="min-w-0 truncate text-[12.5px]" style={{ color: on ? "#fff" : "var(--ink)" }}>
                  <span className="mr-2 font-mono text-[11px]" style={{ color: on ? "rgba(255,255,255,.6)" : "var(--muted)" }}>
                    {r.owner} · {r.type}
                  </span>
                  {r.asset}
                </span>
                <span className="font-mono text-[11px] tabular-nums" style={{ color: on ? "rgba(255,255,255,.7)" : "var(--muted)" }}>
                  {fmt(r.date)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="td-card mt-2" aria-live="polite">
        <span key={index} className="td-in block">
          <span className="block text-[13.5px] font-semibold leading-snug text-[var(--ink)]">{row.asset}</span>
          <span className="mt-1 block font-mono text-[12px] text-[var(--ink)]">{row.amount}</span>
          <span className="mt-1.5 block border-l-2 border-[var(--accent)] pl-3 text-[13px] leading-relaxed text-[var(--soft)]">{row.description}</span>
        </span>
        <span className="mt-3 flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] font-medium text-[var(--ink)]">
            Traded {fmt(row.date)}, public {fmt(PTR.filed)}: <span className="font-mono tabular-nums text-[var(--accent)]">{days} days</span> later
          </span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
        <svg viewBox="0 0 300 44" className="mt-2 w-full" role="img" aria-label={`${days} of the ${DISCLOSE_WITHIN_DAYS} days the law allows`}>
          <line x1="20" y1="16" x2="280" y2="16" stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 3" />
          <rect x="20" y="15" height="2" width={x(shown) - 20} fill="var(--ink)" style={{ transition: reduce ? "none" : "width .9s cubic-bezier(.22,1,.36,1)" }} />
          <circle cx="20" cy="16" r="5" fill="var(--ink)" />
          <circle cx={x(shown)} cy="16" r="6.5" fill="var(--accent)" stroke="#fff" strokeWidth="1.5" style={{ transition: reduce ? "none" : "cx .9s cubic-bezier(.22,1,.36,1)" }} />
          <line x1="280" y1="6" x2="280" y2="26" stroke="var(--ink)" strokeWidth="1.3" />
          <text x="20" y="40" fontSize="10" fontFamily="ui-monospace, monospace" fill="var(--muted)">
            trade
          </text>
          <text x="280" y="40" textAnchor="end" fontSize="10" fontFamily="ui-monospace, monospace" fill="var(--ink)">
            day {DISCLOSE_WITHIN_DAYS}: the deadline
          </text>
        </svg>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The rows are the filing&apos;s own text (the repo keeps it as a test fixture). In trader-pelosi&apos;s words, SP is the spouse, and amounts stay ranges: &ldquo;$1,000,001 - $5,000,000&rdquo;, never &ldquo;$3 million&rdquo;.{" "}
        <a href={PTR.href} target="_blank" rel="noopener noreferrer" className={LINK}>
          The PDF on the Clerk&apos;s site
        </a>
        .
      </figcaption>
      <Source text="README, Fine print · trader-pelosi SKILL.md · tests/fixtures/trader-pelosi" path="trader-pelosi/SKILL.md" />
    </figure>
  );
}

/* ───────────── 5 · the fine print: three gates before any order, then the README's four paragraphs ───────────── */
function Gates() {
  const [on, setOn] = useState<Record<string, boolean>>({ risk: false, yes: false, allow: false });
  const [open, setOpen] = useState<string | null>(FINE_PRINT[0].id);
  const count = GATES.filter((g) => on[g.id]).length;
  const through = count === GATES.length;
  // the order moves only through gates that are open in a row, from the first one
  const firstClosed = GATES.findIndex((g) => !on[g.id]);
  const reach = firstClosed === -1 ? GATES.length : firstClosed;
  return (
    <figure className="td-plate p-4 sm:p-6">
      <Plate n={5} title="No yes, no order" sub="open the three gates · read the fine print" />

      <div className="rounded-[14px] bg-[var(--ink)] p-3 sm:p-4">
        <svg viewBox="0 0 300 40" className="w-full" aria-hidden>
          <line x1="14" y1="20" x2="286" y2="20" stroke="rgba(255,255,255,.25)" strokeWidth="1.2" strokeDasharray="3 3" />
          {GATES.map((g, n) => {
            const gx = 70 + n * 75;
            const isOn = on[g.id];
            return (
              <g key={g.id}>
                <rect x={gx - 3} y={isOn ? 2 : 8} width="6" height={isOn ? 8 : 24} rx="2" fill={isOn ? "rgba(255,255,255,.35)" : "#fff"} style={{ transition: "y .35s cubic-bezier(.34,1.56,.64,1), height .35s cubic-bezier(.34,1.56,.64,1), fill .25s" }} />
              </g>
            );
          })}
          <circle cx={14 + reach * 75 + (through ? 47 : 0)} cy="20" r="7" fill="var(--accent)" style={{ transition: "cx .5s cubic-bezier(.22,1,.36,1)" }} />
          <text x="286" y="38" textAnchor="end" fontSize="9" fontFamily="ui-monospace, monospace" fill="rgba(255,255,255,.6)">
            paper account
          </text>
        </svg>
        <div className="mt-2 space-y-1">
          {GATES.map((g, n) => (
            <button
              key={g.id}
              type="button"
              role="switch"
              aria-checked={on[g.id]}
              onClick={() => setOn((prev) => ({ ...prev, [g.id]: !prev[g.id] }))}
              className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium text-white hover:bg-white/10 ${FOCUS}`}
            >
              <span>
                <span className="mr-2 font-mono text-[11px] text-[var(--accent)]">{n + 1}</span>
                {g.label}
              </span>
              <span aria-hidden className="relative h-5 w-9 shrink-0 rounded-full" style={{ background: on[g.id] ? "var(--accent)" : "rgba(255,255,255,.25)", transition: "background-color .25s" }}>
                <span className="absolute top-0.5 size-4 rounded-full bg-white" style={{ left: on[g.id] ? 18 : 2, transition: "left .3s cubic-bezier(.34,1.56,.64,1)" }} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="td-card mt-2" aria-live="polite">
        <span className="text-[14px] font-semibold leading-snug" style={{ color: through ? "var(--accent)" : "var(--ink)" }}>
          {through ? "All three: the order goes to the paper account." : `${count} of 3 gates open: no order.`}
        </span>
        {count > 0 ? (
          <button type="button" className={`${BTN} ml-3`} onClick={() => setOn({ risk: false, yes: false, allow: false })}>
            Close them
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-[12.5px] font-medium text-[var(--ink)]">The README&apos;s fine print</p>
      <ul className="mt-2 space-y-1.5">
        {FINE_PRINT.map((item) => {
          const isOpen = open === item.id;
          return (
            <li key={item.id} className="td-card p-0!">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`td-fine-${item.id}`}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] font-semibold leading-snug text-[var(--ink)] ${FOCUS}`}
              >
                {item.title}
                <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .25s" }}>
                  <path d="M6 1v10M1 6h10" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div id={`td-fine-${item.id}`} hidden={!isOpen} className="px-3 pb-3">
                <p className="border-l-2 border-[var(--accent)] pl-3 text-[13.5px] leading-relaxed text-[var(--ink)]">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The three gates are trader-broker&apos;s: &ldquo;Two yeses from the user, one PASS from the rules. No yes, no order.&rdquo; The four paragraphs are the README&apos;s, verbatim.
      </figcaption>
      <Source text="README, Fine print · trader-broker SKILL.md" path="README.md" />
    </figure>
  );
}

const TD_CSS = `
.td{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.td-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.td-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.td-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.td-press:active:not(:disabled){transform:scale(.97)}
.td-in{animation:td-in .35s cubic-bezier(.22,1,.36,1)}
.td-range{accent-color:var(--accent);height:24px}
@keyframes td-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.td-in{animation:none}}
`;

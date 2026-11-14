"use client";

// /free/67 (five Claude Code plugins): a picker, one card per plugin, and three live figures, drawn for this site rather than cut from the reel.
// Same language as /free/46–66: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real: every install line, quoted sentence, tier name and token count is from the five READMEs, read 2026-11-14. See data.ts.
// Illustrations: the task and its cut-off point (figure 1) and the three sessions (figure 2). Nothing here runs the plugins.
// Every label inside a figure is HTML at 12px or more, never text inside a scaled SVG, so it stays readable on a phone.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { HERO, MEMORY_STEPS, OMNI_NUMBERS, PLUGINS, PROBLEMS, SCENARIOS, TIERS, pluginFor, type InstallBlock, type Plugin, type PluginId } from "./data";

export type PluginsDemoKind = "picker" | PluginId;

export function PluginsDemo({ kind }: { kind: PluginsDemoKind }) {
  const plugin = kind === "picker" ? undefined : pluginFor(kind);
  return (
    <div className="pl mt-5 max-w-2xl space-y-3">
      <style>{PL_CSS}</style>
      {kind === "picker" && <Picker />}
      {plugin ? <Card plugin={plugin} /> : null}
      {kind === "omniroute" && <Cutoff />}
      {kind === "claude-mem" && <Memory />}
      {kind === "headroom" && <Compress />}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
function Plate({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">{tag}</span>
        <span className="text-[16px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block font-mono text-[12px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

function Source({ text, href }: { text: string; href: string }) {
  return (
    <p className="mt-2 font-mono text-[12px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      <a href={href} target="_blank" rel="noopener noreferrer" className={`rounded-sm underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)] ${FOCUS}`}>
        {text}
      </a>
    </p>
  );
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `pl-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] ${FOCUS}`;
const PRIMARY = `pl-press inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 text-[14px] font-medium text-white ${FOCUS}`;
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

/** Milliseconds since the figure came on screen, up to `total`; `replay` starts it again. With reduced motion it is `total` from the start. */
function useElapsed(total: number) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35, once: true });
  const reduce = useReducedMotionSafe();
  const [run, setRun] = useState(0);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(total, now - start);
      setT(elapsed);
      if (elapsed < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduce, run, total]);
  const replay = () => {
    setT(0);
    setRun((v) => v + 1);
  };
  return { ref, t: reduce ? total : t, replay, visible, reduce };
}

/** A number that eases to `target` over `ms`. With reduced motion it is `target` at once. */
function useTween(target: number, ms: number, reduce: boolean) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (reduce) {
      from.current = target;
      return;
    }
    const a = from.current;
    if (a === target) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      const next = Math.round(a + (target - a) * (1 - Math.pow(1 - k, 3)));
      from.current = next;
      setValue(next);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, reduce]);
  return reduce ? target : value;
}

/** Copies `text`; the label turns to "Copied" for a moment, or to "Select it" if the browser refuses. */
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

/** One line to paste. The whole line is the button, so it is easy to tap; it stays mounted, so focus stays on it after the press. */
function CopyLine({ line }: { line: string }) {
  const { state, copy } = useCopy(line);
  return (
    <button
      type="button"
      onClick={copy}
      className={`pl-press flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2 text-left hover:border-[var(--rule-strong)] ${FOCUS}`}
    >
      <span className="min-w-0 font-mono text-[13px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{line}</span>
      <span className="shrink-0 font-mono text-[12px]" style={{ color: state === "done" ? "var(--accent)" : "var(--muted)" }} aria-live="polite">
        {state === "done" ? "Copied" : state === "failed" ? "Select it" : "Copy"}
      </span>
    </button>
  );
}

function Install({ block }: { block: InstallBlock }) {
  return (
    <div>
      <span className="block font-mono text-[12px] text-[var(--muted)]">{block.where === "terminal" ? "In your terminal" : "In Claude Code"}</span>
      <div className="mt-1.5 space-y-1.5">
        {block.lines.map((line) => (
          <CopyLine key={line} line={line} />
        ))}
      </div>
    </div>
  );
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
          className={`pl-press min-h-9 rounded-full px-3 text-[13px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const two = (n: number) => String(n).padStart(2, "0");
const count = (n: number) => n.toLocaleString("en-US");

/* ───────────── the picker: choose what is going wrong, the one plugin opens ───────────── */
function Picker() {
  const [id, setId] = useState<PluginId>(PROBLEMS[0].plugin);
  const index = PLUGINS.findIndex((p) => p.id === id);
  const p = PLUGINS[index];
  const first = p.install[0];
  return (
    <figure className="pl-plate p-4 sm:p-6">
      <Plate tag="start here" title="What is going wrong?" sub="pick a problem · get the plugin" />
      <div role="radiogroup" aria-label="What is going wrong" className="grid gap-1.5 sm:grid-cols-2">
        {PROBLEMS.map((problem, n) => {
          const on = problem.plugin === id;
          return (
            <button
              key={problem.plugin}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setId(problem.plugin)}
              className={`pl-press flex min-h-11 items-center gap-3 rounded-[12px] border px-3 py-2 text-left text-[14px] font-medium leading-snug ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"}`}
            >
              <span className="font-mono text-[12px]" style={{ color: on ? "var(--accent)" : "var(--muted)" }}>
                {two(n + 1)}
              </span>
              {problem.label}
            </button>
          );
        })}
      </div>

      {/* where the picked one sits among the five */}
      <div className="mt-4 grid grid-cols-5 gap-1.5" aria-hidden>
        {PLUGINS.map((item, n) => (
          <span key={item.id} className="h-1.5 rounded-full" style={{ background: n === index ? "var(--accent)" : "var(--rule-strong)", transition: "background-color .25s" }} />
        ))}
      </div>

      <div className="pl-card mt-2" aria-live="polite">
        <div key={p.id} className="pl-in">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-[12px] text-[var(--accent)]">{two(index + 1)}/05</span>
            <span className="text-[24px] font-semibold leading-tight tracking-[-0.02em] text-[var(--ink)]">{p.name}</span>
          </span>
          <span className="mt-0.5 block font-mono text-[12px] text-[var(--muted)]">{p.kind}</span>
          <p className="mt-3 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--ink)]">{p.fixes}</p>
          <div className="mt-3">
            <Install block={first} />
          </div>
          <span className="mt-3 flex flex-wrap gap-2">
            <a href={`#plugin-${p.id}`} className={PRIMARY}>
              Read its card
            </a>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className={`${BTN} min-h-11 rounded-lg!`}>
              Open on GitHub
            </a>
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The text with the orange line is made of sentences from the plugin&apos;s own README. The card further down has every install line, what to do next and what to know first.
      </figcaption>
    </figure>
  );
}

/* ───────────── one card per plugin: what it fixes, the install lines, what to know first, link and license ───────────── */
function Card({ plugin: p }: { plugin: Plugin }) {
  const n = PLUGINS.findIndex((item) => item.id === p.id) + 1;
  return (
    <article id={`plugin-${p.id}`} className="pl-plate scroll-mt-24 p-4 sm:p-6">
      <Plate tag={`${two(n)}/05`} title={p.name} sub={p.kind} />

      <div className="pl-card">
        <span className={LABEL}>FIXES: {p.problem.toUpperCase()}</span>
        <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--ink)]">{p.fixes}</p>
        <span className="mt-2 block font-mono text-[12px] text-[var(--muted)]">Sentences from its README</span>
      </div>

      {p.id === "omniroute" ? (
        <ul className="mt-2 grid grid-cols-3 gap-2" aria-label="The README's headline numbers">
          {OMNI_NUMBERS.map((item) => (
            <li key={item.label} className="pl-card min-w-0">
              <span className="block font-mono text-[16px] font-semibold leading-tight tracking-[-0.03em] text-[var(--ink)] sm:text-[24px]">{item.value}</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-[var(--soft)]">{item.label}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {p.list ? (
        <div className="pl-card mt-2">
          <span className={LABEL}>{p.list.title.toUpperCase()}</span>
          <ul className="mt-2 space-y-1.5">
            {p.list.items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--soft)]">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--ink)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="pl-card mt-2">
        <span className={LABEL}>INSTALL</span>
        <div className="mt-2 space-y-3">
          {p.install.map((block, i) => (
            <div key={block.where}>
              {i > 0 ? <span className="mb-3 block text-[13px] text-[var(--soft)]">Or, from inside Claude Code:</span> : null}
              <Install block={block} />
              <span className="mt-1.5 block font-mono text-[12px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">From: {block.source}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-[var(--rule)] pt-3 text-[13px] leading-relaxed text-[var(--soft)] [overflow-wrap:anywhere]">
          <span className="font-medium text-[var(--ink)]">Then: </span>
          {p.then}
        </p>
      </div>

      <div className="pl-card mt-2">
        <span className={LABEL}>KNOW THIS FIRST</span>
        <ul className="mt-2 space-y-2">
          {p.know.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[var(--soft)] [overflow-wrap:anywhere]">
              <span className="mt-[8px] size-1 shrink-0 rounded-full bg-[var(--ink)]" />
              <span className="min-w-0">{line}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <a href={p.href} target="_blank" rel="noopener noreferrer" className={PRIMARY}>
          Open on GitHub
        </a>
        <span className="inline-flex min-h-8 items-center rounded-full border border-[var(--rule-strong)] bg-white px-3 font-mono text-[12px] text-[var(--ink)]">{p.license}</span>
        <span className="text-[13px] text-[var(--soft)]">by {p.by}</span>
      </div>
      <p className="mt-2 font-mono text-[12px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">{p.shown}</p>
    </article>
  );
}

/* ───────────── figure 1 · the task runs past the old cut-off and carries on with the next target ───────────── */
const CUT = 60; // where the bar meets the old cut-off, in percent of the track (an illustration, not a number from the README)
const T_CUT = 1500; // ms to reach it
const T_SWITCH = 2200; // ms when the next target takes over
const T_DONE = 3500;

function Cutoff() {
  const [mode, setMode] = useState<"with" | "without">("with");
  const { ref, t, replay } = useElapsed(T_DONE);
  const withIt = mode === "with";
  const reached = t >= T_CUT;
  const switched = withIt && t >= T_SWITCH;
  const done = withIt && t >= T_DONE;
  const progress = t < T_CUT ? (CUT * t) / T_CUT : !withIt || t < T_SWITCH ? CUT : CUT + ((100 - CUT) * (t - T_SWITCH)) / (T_DONE - T_SWITCH);
  const active = switched ? 1 : 0;
  const status = !reached
    ? "Working on Tier 1 · Subscription."
    : !withIt
      ? "Usage limit reached. The task stops here."
      : !switched
        ? "Quota ran out on Tier 1. Moving to the next eligible target."
        : !done
          ? "Still working, now on Tier 2 · API Key."
          : "Done. The task ran past the old cut-off.";
  return (
    <figure ref={ref} className="pl-plate p-4 sm:p-6">
      <Plate tag="figure" title="Past the old cut-off" sub="switch it on and off · watch the bar" />
      <Choice
        label="Fallback"
        options={[
          { id: "with", label: "With OmniRoute" },
          { id: "without", label: "Without it" },
        ]}
        value={mode}
        set={(id) => {
          setMode(id);
          replay();
        }}
      />

      <ol className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label="The four provider tiers, in fallback order">
        {TIERS.map((tier, n) => {
          const on = withIt ? n === active : n === 0;
          const spent = n === 0 && reached;
          const off = !withIt && n > 0;
          return (
            <li
              key={tier}
              className="rounded-[10px] border px-2.5 py-2"
              style={{
                borderColor: on && !spent ? "var(--ink)" : on ? "var(--accent)" : "var(--rule)",
                background: on && !spent ? "#fff" : spent ? "repeating-linear-gradient(135deg,#fff 0 6px,var(--rule) 6px 8px)" : on ? "#fff" : "transparent",
                opacity: off ? 0.45 : 1,
                transition: "border-color .3s, opacity .3s",
              }}
            >
              <span className="block font-mono text-[12px]" style={{ color: on ? "var(--accent)" : "var(--muted)" }}>
                Tier {n + 1}
              </span>
              <span className="block text-[13px] font-medium leading-snug text-[var(--ink)]">{tier}</span>
              <span className="block font-mono text-[12px] text-[var(--muted)]">{spent ? "quota out" : on ? "active" : off ? "not connected" : "standby"}</span>
            </li>
          );
        })}
      </ol>

      <div className="pl-card mt-2">
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[12px] text-[var(--muted)]">your task</span>
          <span className="font-mono text-[12px] tabular-nums" style={{ color: done ? "var(--accent)" : "var(--muted)" }}>
            {done ? "done" : `${Math.round(progress)}%`}
          </span>
        </span>
        <div className="relative mt-7 h-3 rounded-full bg-[var(--rule)]">
          {/* up to the cut-off: ink. Past it: orange, the part you used not to get */}
          <span className="absolute inset-y-0 left-0 rounded-full bg-[var(--ink)]" style={{ width: `${Math.min(progress, CUT)}%` }} />
          <span className="absolute inset-y-0 rounded-r-full bg-[var(--accent)]" style={{ left: `${CUT}%`, width: `${Math.max(0, progress - CUT)}%` }} />
          {!withIt && reached ? (
            <span className="absolute inset-y-0 rounded-r-full" style={{ left: `${CUT}%`, right: 0, background: "repeating-linear-gradient(135deg,var(--rule-strong) 0 5px,transparent 5px 10px)" }} />
          ) : null}
          <span className="absolute -top-2 -bottom-2 border-l border-dashed border-[var(--ink)]" style={{ left: `${CUT}%` }} />
          <span className="absolute -top-7 -translate-x-1/2 whitespace-nowrap font-mono text-[12px] text-[var(--ink)]" style={{ left: `${CUT}%` }}>
            old cut-off
          </span>
        </div>
        <span className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="min-w-0 flex-1 basis-[180px] text-[14px] font-medium leading-snug text-[var(--ink)]" aria-live="polite">
            {status}
          </span>
          <button type="button" className={BTN} onClick={replay}>
            Run it again
          </button>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The task and where it gets cut off are an illustration. The four tiers are the README&apos;s, which says OmniRoute &ldquo;can fall back across 4 provider tiers while an eligible healthy target
        remains&rdquo;. Which one it moves to depends on the providers you have connected. To stay on the plan you already pay for, the README has the model auto/subscription, which &ldquo;fails closed, never a billable fallback&rdquo;.
      </figcaption>
      <Source text="OmniRoute README, Why OmniRoute and Combos" href={PLUGINS[0].href} />
    </figure>
  );
}

/* ───────────── figure 2 · three sessions, one memory: what each session opens with ───────────── */
const SESSIONS = [1, 2, 3];
const OPENS_WITH = [
  "Nothing yet. A first session in a project starts from zero.",
  "A short index of the notes from session 1.",
  "A short index of the notes from sessions 1 and 2.",
];

function Memory() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35, once: true });
  const reduce = useReducedMotionSafe();
  const [auto, setAuto] = useState(1);
  const [picked, setPicked] = useState<number | null>(null);
  // until someone taps, walk through the three sessions once
  useEffect(() => {
    if (!visible || reduce || picked !== null || auto >= SESSIONS.length) return;
    const id = setTimeout(() => setAuto((n) => n + 1), 1100);
    return () => clearTimeout(id);
  }, [visible, reduce, picked, auto]);
  const sel = picked ?? (reduce ? SESSIONS.length : auto);
  return (
    <figure ref={ref} className="pl-plate p-4 sm:p-6">
      <Plate tag="figure" title="Three sessions, one memory" sub="tap a session · see what it opens with" />
      <div role="radiogroup" aria-label="Session" className="grid grid-cols-3 gap-2">
        {SESSIONS.map((n) => {
          const on = n === sel;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setPicked(n)}
              className={`pl-press flex min-h-11 flex-col items-center justify-center rounded-[12px] border px-1 py-2 text-center ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"}`}
            >
              <span className="text-[13px] font-semibold leading-tight">Session {n}</span>
              <span className="font-mono text-[12px]" style={{ color: on ? "var(--accent)" : "var(--muted)" }}>
                {n < sel ? "ended" : on ? "now" : "later"}
              </span>
            </button>
          );
        })}
      </div>

      {/* each session's notes drop into the same memory */}
      <div className="grid grid-cols-3 gap-2" aria-hidden>
        {SESSIONS.map((n) => (
          <span key={n} className="mx-auto h-5 border-l" style={{ borderColor: n <= sel ? "var(--ink)" : "var(--rule-strong)", borderLeftStyle: n < sel ? "solid" : "dashed", transition: "border-color .3s" }} />
        ))}
      </div>
      <div className="rounded-[12px] border border-[var(--ink)] bg-white p-2.5">
        <span className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-[13px] font-semibold text-[var(--ink)]">memory</span>
          <span className="font-mono text-[12px] text-[var(--muted)]">~/.claude-mem</span>
        </span>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SESSIONS.map((n) => {
            const kept = n < sel;
            const writing = n === sel;
            return (
              <span key={n} className="rounded-lg border px-2 py-2" style={{ borderColor: kept ? "var(--accent)" : writing ? "var(--ink)" : "var(--rule)", borderStyle: kept || writing ? "solid" : "dashed", transition: "border-color .3s" }}>
                {[0, 1, 2].map((row) => (
                  <span
                    key={row}
                    className="mb-1 block h-1.5 rounded-full last:mb-0"
                    style={{
                      width: kept ? ["100%", "70%", "85%"][row] : writing ? ["60%", "35%", "0%"][row] : "0%",
                      background: kept ? "var(--accent)" : "var(--ink)",
                      transition: "width .5s cubic-bezier(.22,1,.36,1), background-color .3s",
                    }}
                  />
                ))}
                <span className="mt-1.5 block font-mono text-[12px] leading-tight" style={{ color: kept ? "var(--accent)" : "var(--muted)" }}>
                  {kept ? "kept" : writing ? "writing" : "empty"}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="pl-card mt-2" aria-live="polite">
        <span className={LABEL}>SESSION {sel} OPENS WITH</span>
        <span className="mt-1.5 block text-[14px] font-medium leading-snug text-[var(--ink)]">{OPENS_WITH[sel - 1]}</span>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--soft)]">While it works, the observer adds this session&apos;s notes to the same memory.</span>
      </div>

      <ol className="mt-2 space-y-1.5">
        {MEMORY_STEPS.map((step, n) => (
          <li key={step.title} className="pl-card flex items-start gap-2.5">
            <span className="font-mono text-[12px] leading-[20px] text-[var(--accent)]">{n + 1}</span>
            <span className="min-w-0 text-[13px] leading-relaxed text-[var(--soft)]">
              <span className="font-semibold text-[var(--ink)]">{step.title}</span> {step.text}
            </span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The three sessions are an illustration; the three numbered steps are the README&apos;s &ldquo;How It Works&rdquo;, word for word. In its words: &ldquo;Memory injection starts on your second session in
        a project.&rdquo;
      </figcaption>
      <Source text="claude-mem README, How It Works" href={PLUGINS[1].href} />
    </figure>
  );
}

/* ───────────── figure 3 · the stack is pressed: 55,957 tokens in, 24,340 sent to the model ───────────── */
const STACK_PX = 150; // height of the tallest stack (58,801 tokens)
const STACK_MAX = Math.max(...SCENARIOS.map((s) => s.before));

function Compress() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35, once: true });
  const reduce = useReducedMotionSafe();
  const [id, setId] = useState(HERO.id);
  const [pressed, setPressed] = useState<boolean | null>(null);
  // the first time it comes on screen, press it once
  useEffect(() => {
    if (!visible || reduce || pressed !== null) return;
    const timer = setTimeout(() => setPressed((v) => v ?? true), 700);
    return () => clearTimeout(timer);
  }, [visible, reduce, pressed]);
  const s = SCENARIOS.find((item) => item.id === id) ?? HERO;
  const down = pressed ?? reduce;
  const sent = useTween(down ? s.after : s.before, 900, reduce);
  const px = (tokens: number) => Math.round((STACK_PX * tokens) / STACK_MAX);
  return (
    <figure ref={ref} className="pl-plate p-4 sm:p-6">
      <Plate tag="figure" title="The stack, pressed" sub="pick a scenario · press it" />
      <div role="radiogroup" aria-label="Scenario" className="grid grid-cols-2 gap-1.5">
        {SCENARIOS.map((item) => {
          const on = item.id === id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setId(item.id)}
              className={`pl-press flex min-h-11 items-center rounded-[12px] border px-3 py-2 text-left text-[13px] font-medium leading-snug ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"}`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div className="pl-card mt-2">
        <div className="flex items-end gap-4">
          {/* the stack: its full height is what the agent read, the pressed height is what is sent */}
          <div className="relative w-[42%] max-w-[190px] shrink-0" style={{ height: STACK_PX + 14 }} aria-hidden>
            <span className="absolute inset-x-2 bottom-0 rounded-md border border-dashed border-[var(--rule-strong)]" style={{ height: px(s.before), transition: "height .5s cubic-bezier(.22,1,.36,1)" }} />
            <span
              className="absolute inset-x-2 bottom-0 rounded-md border border-[var(--ink)]"
              style={{
                height: px(down ? s.after : s.before),
                background: "repeating-linear-gradient(to bottom,#fff 0 4px,var(--rule-strong) 4px 5px)",
                transition: reduce ? "none" : "height .9s cubic-bezier(.22,1,.36,1)",
              }}
            />
            <span
              className="absolute inset-x-0 h-2.5 rounded-full"
              style={{
                bottom: px(down ? s.after : s.before) + 2,
                background: down ? "var(--accent)" : "var(--ink)",
                transition: reduce ? "none" : "bottom .9s cubic-bezier(.22,1,.36,1), background-color .3s",
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block font-mono text-[12px] text-[var(--muted)]">sent to the model</span>
            <span className="block font-mono text-[28px] font-semibold leading-tight tracking-[-0.02em] tabular-nums text-[var(--ink)] sm:text-[34px]">{count(sent)}</span>
            <span className="block font-mono text-[12px] text-[var(--muted)]">tokens</span>
            <span className="mt-2 block font-mono text-[12px] leading-relaxed text-[var(--soft)]">
              before {count(s.before)}
              <br />
              after {count(s.after)}
            </span>
            <span
              className="mt-2 inline-flex min-h-7 items-center rounded-full px-2.5 font-mono text-[12px] font-semibold"
              style={{ background: down ? "var(--accent)" : "transparent", color: down ? "#fff" : "var(--muted)", boxShadow: down ? "none" : "0 0 0 1px var(--rule-strong)", transition: "background-color .3s, color .3s" }}
            >
              saved {s.saved}%
            </span>
          </div>
        </div>
        <span className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3">
          <span className="min-w-0 flex-1 basis-[160px] text-[13px] leading-snug text-[var(--soft)]" aria-live="polite">
            {s.name}: {down ? `${count(s.after)} tokens are sent.` : `${count(s.before)} tokens before Headroom.`}
          </span>
          <button type="button" className={PRIMARY} aria-pressed={down} onClick={() => setPressed(!down)}>
            {down ? "Put it back" : "Press it"}
          </button>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The four rows are the README&apos;s table, &ldquo;measured with the provider tokenizer and the shipped compress() at its default configuration&rdquo;. 55,957 to 24,340 is the picture at the top of the
        README. &ldquo;Savings scale with how repetitive the payload is&rdquo;: prose and already-dense output compress very little.
      </figcaption>
      <Source text="Headroom README, Proof: measured token savings" href={PLUGINS[2].href} />
    </figure>
  );
}

const PL_CSS = `
.pl{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.pl-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.pl-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.pl-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.pl-press:active:not(:disabled){transform:scale(.97)}
.pl-in{animation:pl-in .35s cubic-bezier(.22,1,.36,1)}
@keyframes pl-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.pl-in{animation:none}}
`;

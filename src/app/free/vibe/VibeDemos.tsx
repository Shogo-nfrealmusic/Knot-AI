"use client";

// /free/79 (four plugins to install before you vibe code): a power strip, one card per plugin, and four small live figures, drawn for this site rather than cut from the reel.
// Same language as /free/67–78: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real: every install line, command, tool name, stage name and quoted sentence is from the sources (see data.ts and sources.ts).
// Illustrations: the todos table, the deploy, the team run and the page in the browser. Nothing here runs the plugins.
// Every label is HTML at 12px or more, never text inside a scaled SVG, so it stays readable on a phone.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import {
  CDT_FIRST_PROMPT,
  CDT_TABS,
  OMC_STAGES,
  OMC_TEAM,
  OMC_WORKERS,
  PLUGS,
  SB_MCP_URL,
  SB_TOOLS,
  VC_COMMANDS,
  deployCommand,
  plugFor,
  plugged,
  stripLabel,
  type CdtTab,
  type InstallBlock,
  type PlugId,
  type VibePlugin,
} from "./data";

export type VibeDemoKind = "strip" | PlugId;

export function VibeDemo({ kind }: { kind: VibeDemoKind }) {
  const plug = kind === "strip" ? undefined : plugFor(kind);
  return (
    <div className="vb mt-5 max-w-2xl space-y-3">
      <style>{VB_CSS}</style>
      {kind === "strip" && <Strip />}
      {plug ? <Card plug={plug} /> : null}
      {kind === "supabase" && <SupabaseFigure />}
      {kind === "vercel" && <VercelFigure />}
      {kind === "omc" && <TeamFigure />}
      {kind === "chrome-devtools" && <DevToolsFigure />}
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
const BTN = `vb-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] ${FOCUS}`;
const PRIMARY = `vb-press inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 text-[14px] font-medium text-white ${FOCUS}`;
const LABEL = "block font-mono text-[12px] tracking-[0.04em] text-[var(--accent)]";
const RADIO_ON = "border-[var(--ink)] bg-[var(--ink)] text-white";
const RADIO_OFF = "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]";

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

/** Milliseconds since the figure came on screen (or since `replay`), up to `total`. With reduced motion it is `total` from the start. */
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

/** 0 → 1 as `t` goes from `a` to `b`, eased out. */
const ramp = (t: number, a: number, b: number) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return 1 - Math.pow(1 - k, 3);
};

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
      className={`vb-press flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2 text-left hover:border-[var(--rule-strong)] ${FOCUS}`}
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

const two = (n: number) => String(n).padStart(2, "0");
const of4 = (id: PlugId) => `${two(PLUGS.findIndex((p) => p.id === id) + 1)}/${two(PLUGS.length)}`;

/* ───────────── the power strip: push a plug in, its card opens ───────────── */
function Strip() {
  const [on, setOn] = useState<PlugId[]>([]);
  const [focus, setFocus] = useState<PlugId>(PLUGS[0].id);
  const [spark, setSpark] = useState(0);
  const p = plugFor(focus) ?? PLUGS[0];
  const lit = on.length > 0;
  const toggle = (id: PlugId) => {
    const isOn = on.includes(id);
    setOn(plugged(isOn ? on.filter((x) => x !== id) : [...on, id]));
    setFocus(id);
    if (!isOn) setSpark((n) => n + 1);
  };
  return (
    <figure className="vb-plate p-4 sm:p-6">
      <Plate tag="start here" title="Plug them into Claude Code" sub="tap a plug · get its install line" />

      <div className="relative mx-auto max-w-[460px]">
        {/* the four plugs, hanging over their sockets */}
        <div className="grid grid-cols-4 gap-2 px-3 sm:px-5">
          {PLUGS.map((item) => {
            const isOn = on.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isOn}
                aria-label={`${item.name}: ${isOn ? "plugged in, tap to unplug" : "tap to plug in"}`}
                onClick={() => toggle(item.id)}
                className={`vb-plug group relative mx-auto flex w-full max-w-[64px] flex-col items-center rounded-lg pt-1 ${FOCUS}`}
              >
                <span className="vb-plug-body relative block w-full" style={{ transform: `translateY(${isOn ? 21 : 0}%)` }}>
                  <svg viewBox="0 0 48 92" className="block w-full" aria-hidden>
                    <path d="M24 0 C24 12 20 18 24 34" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
                    <rect x="5" y="34" width="38" height="36" rx="8" fill="#fff" stroke="var(--ink)" strokeWidth="2" />
                    <rect x="9" y="38" width="30" height="4" rx="2" fill={isOn ? "var(--accent)" : "var(--rule)"} style={{ transition: "fill .3s" }} />
                    <rect x="15" y="70" width="5" height="16" rx="1.5" fill="var(--ink)" />
                    <rect x="28" y="70" width="5" height="16" rx="1.5" fill="var(--ink)" />
                  </svg>
                  <span className="pointer-events-none absolute inset-x-0 top-[56%] -translate-y-1/2 text-center font-mono text-[12px] font-semibold text-[var(--ink)]">{item.mark}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* the strip itself; it sits over the prongs, so a pushed plug disappears into its socket */}
        <div className="relative z-10 -mt-[6px] rounded-[14px] border-2 border-[var(--ink)] bg-white px-3 pb-2.5 pt-2.5 sm:px-5">
          <div className="grid grid-cols-4 gap-2">
            {PLUGS.map((item) => {
              const isOn = on.includes(item.id);
              return (
                <span key={item.id} className="relative mx-auto flex h-7 w-full max-w-[64px] items-center justify-center gap-[13px] rounded-md border" style={{ borderColor: isOn ? "var(--ink)" : "var(--rule-strong)", background: isOn ? "var(--page)" : "#fff", transition: "border-color .3s, background-color .3s" }}>
                  <span className="h-3 w-[5px] rounded-sm bg-[var(--ink)] opacity-80" />
                  <span className="h-3 w-[5px] rounded-sm bg-[var(--ink)] opacity-80" />
                  {isOn && item.id === focus ? <span key={spark} className="vb-spark absolute inset-0 rounded-md" aria-hidden /> : null}
                </span>
              );
            })}
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {PLUGS.map((item) => (
              <span key={item.id} className="truncate text-center font-mono text-[12px]" style={{ color: on.includes(item.id) ? "var(--ink)" : "var(--muted)" }}>
                {item.mark}
              </span>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-[var(--rule)] pt-2">
            <span className="font-mono text-[12px] font-semibold tracking-[0.06em] text-[var(--ink)]" aria-live="polite">
              {stripLabel(on.length)}
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[12px] text-[var(--muted)]">
              power
              <span className="size-2.5 rounded-full" style={{ background: lit ? "var(--accent)" : "var(--rule-strong)", boxShadow: lit ? "0 0 0 3px rgba(215,119,87,.22)" : "none", transition: "background-color .3s, box-shadow .3s" }} />
            </span>
          </div>
        </div>
        {/* the cord, out to the wall */}
        <svg viewBox="0 0 460 34" className="block w-full" aria-hidden preserveAspectRatio="none">
          <path d="M430 0 C430 22 380 30 300 30 L0 30" fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        <button type="button" className={BTN} onClick={() => { setOn(PLUGS.map((x) => x.id)); setSpark((n) => n + 1); }}>
          Plug in all four
        </button>
        <button type="button" className={BTN} onClick={() => setOn([])} disabled={!lit}>
          Unplug all
        </button>
      </div>

      <div className="vb-card mt-3" aria-live="polite">
        <div key={p.id} className="vb-in">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-[12px] text-[var(--accent)]">{of4(p.id)}</span>
            <span className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[var(--ink)]">{p.name}</span>
            <span className="font-mono text-[12px]" style={{ color: on.includes(p.id) ? "var(--accent)" : "var(--muted)" }}>
              {on.includes(p.id) ? "plugged in" : "not plugged in"}
            </span>
          </span>
          <span className="mt-0.5 block font-mono text-[12px] text-[var(--muted)]">{p.kind}</span>
          <p className="mt-3 text-[14px] font-medium leading-snug text-[var(--ink)]">{p.job}.</p>
          <div className="mt-3 space-y-3">
            <Install block={p.install[0]} />
          </div>
          {p.install.length > 1 || p.install[0].lines.length > 1 ? (
            <span className="mt-1.5 block text-[13px] leading-snug text-[var(--soft)]">One line at a time. The rest of the steps are in its section.</span>
          ) : null}
          <span className="mt-3 flex flex-wrap gap-2">
            <a href={`#plug-${p.id}`} className={PRIMARY}>
              Read its section
            </a>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className={`${BTN} min-h-11 rounded-lg!`}>
              Open on GitHub
            </a>
          </span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The strip is a picture of what the four add to Claude Code. The lines under it are the real ones, each copied from its source.
      </figcaption>
    </figure>
  );
}

/* ───────────── one card per plugin: what it is, the install lines, what to know first, link and licence ───────────── */
function Card({ plug: p }: { plug: VibePlugin }) {
  return (
    <article id={`plug-${p.id}`} className="vb-plate scroll-mt-24 p-4 sm:p-6">
      <Plate tag={of4(p.id)} title={p.name} sub={p.kind} />

      <div className="vb-card">
        <span className={LABEL}>WHAT IT IS</span>
        <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--ink)]">{p.does}</p>
        <ul className="mt-2.5 space-y-1.5">
          {p.gives.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--soft)] [overflow-wrap:anywhere]">
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--ink)]" />
              <span className="min-w-0">{line}</span>
            </li>
          ))}
        </ul>
        <span className="mt-2 block font-mono text-[12px] text-[var(--muted)]">From its README</span>
      </div>

      <div className="vb-card mt-2">
        <span className={LABEL}>INSTALL</span>
        <div className="mt-2 space-y-3">
          {p.install.map((block, i) => (
            <div key={block.source}>
              {i > 0 ? <span className="mb-3 block text-[13px] text-[var(--soft)]">Then:</span> : null}
              <Install block={block} />
              <span className="mt-1.5 block font-mono text-[12px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">From: {block.source}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 border-t border-[var(--rule)] pt-3 text-[13px] leading-relaxed text-[var(--soft)] [overflow-wrap:anywhere]">
          <span className="font-medium text-[var(--ink)]">After: </span>
          {p.then}
        </p>
      </div>

      <div className="vb-card mt-2">
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
        <span className="inline-flex min-h-8 items-center rounded-full border border-[var(--rule-strong)] bg-white px-3 font-mono text-[12px] text-[var(--ink)]">
          {p.official ? "in Anthropic's marketplace" : "author's own marketplace"}
        </span>
        <span className="text-[13px] text-[var(--soft)]">by {p.by}</span>
      </div>
      <p className="mt-2 font-mono text-[12px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">{p.shown}</p>
    </article>
  );
}

/* ───────────── figure · Supabase: a tool call goes out through the MCP server and comes back ───────────── */
const SB_OUT = 700; // ms: Claude Code → MCP
const SB_DB = 1400; // ms: MCP → your project
const SB_BACK = 2100; // ms: the answer is back
const SB_TOTAL = 3300;
const TODOS = [
  ["1", "Set up auth", "true"],
  ["2", "Build the feed", "false"],
  ["3", "Ship it", "false"],
];

function SupabaseFigure() {
  const [tool, setTool] = useState(0);
  const { ref, t, replay } = useElapsed(SB_TOTAL);
  const pick = (n: number) => {
    setTool(n);
    replay();
  };
  const goingOut = t < SB_DB;
  const dot = t < SB_OUT ? ramp(t, 0, SB_OUT) * 50 : t < SB_DB ? 50 + ramp(t, SB_OUT, SB_DB) * 50 : 100 - ramp(t, SB_DB, SB_BACK) * 100;
  const back = t >= SB_BACK;
  const shown = ramp(t, SB_BACK, SB_TOTAL);
  const status = t < SB_OUT ? "Claude Code calls the tool." : t < SB_DB ? "The MCP server runs it on your project." : !back ? "The answer comes back." : "Back in the chat.";
  const s = SB_TOOLS[tool];
  return (
    <figure ref={ref} className="vb-plate p-4 sm:p-6">
      <Plate tag="figure" title="One tool call, there and back" sub="pick a tool · watch the call" />
      <div role="radiogroup" aria-label="MCP tool" className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {SB_TOOLS.map((item, n) => (
          <button
            key={item.name}
            type="button"
            role="radio"
            aria-checked={n === tool}
            onClick={() => pick(n)}
            className={`vb-press flex min-h-11 flex-col items-start justify-center rounded-[12px] border px-3 py-1.5 text-left ${FOCUS} ${n === tool ? RADIO_ON : RADIO_OFF}`}
          >
            <span className="font-mono text-[13px] font-medium leading-snug [overflow-wrap:anywhere]">{item.name}</span>
            <span className="text-[12px] leading-snug opacity-80">{item.title}</span>
          </button>
        ))}
      </div>

      {/* Claude Code ─── MCP server ─── your project, with the call as a dot */}
      <div className="vb-card mt-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
          <span className="justify-self-start rounded-lg border border-[var(--ink)] bg-white px-2 py-1.5 text-center text-[12px] font-semibold leading-tight text-[var(--ink)]">Claude Code</span>
          <span className="rounded-lg border border-[var(--accent)] bg-white px-2 py-1.5 text-center font-mono text-[12px] leading-tight text-[var(--ink)]">MCP server</span>
          <span className="flex items-center gap-1.5 justify-self-end rounded-lg border border-[var(--ink)] bg-white px-2 py-1.5 text-[12px] font-semibold leading-tight text-[var(--ink)]">
            <svg viewBox="0 0 16 18" className="h-3.5 w-3" aria-hidden>
              <ellipse cx="8" cy="3.5" rx="6.5" ry="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M1.5 3.5v11c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5v-11M1.5 9c0 1.4 2.9 2.5 6.5 2.5s6.5-1.1 6.5-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            your project
          </span>
        </div>
        <div className="relative mx-3 mt-2 h-3" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-[var(--rule-strong)]" />
          <span className="absolute left-1/2 top-0 h-3 border-l border-[var(--accent)]" />
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ left: `${dot}%`, background: goingOut ? "var(--ink)" : "var(--accent)", opacity: back ? 0 : 1, transition: "opacity .3s" }}
          />
        </div>
        <span className="mt-1.5 block truncate text-center font-mono text-[12px] text-[var(--muted)]">{SB_MCP_URL}</span>
        <span className="mt-2 block text-[14px] font-medium leading-snug text-[var(--ink)]" aria-live="polite">
          {status}
        </span>
      </div>

      <div className="vb-card mt-2 min-h-[150px]">
        <span className={LABEL}>{s.name}</span>
        <span className="mt-1 block text-[13px] leading-snug text-[var(--soft)]">{s.line}</span>
        <div className="mt-3" style={{ opacity: back ? 1 : 0.25, transition: "opacity .3s" }}>
          {tool === 0 ? <SqlRows k={shown} /> : null}
          {tool === 1 ? <MigrationRows k={shown} /> : null}
          {tool === 2 ? <TypesLines k={shown} /> : null}
          {tool === 3 ? <Advice k={shown} /> : null}
        </div>
      </div>
      <span className="mt-3 flex justify-end">
        <button type="button" className={BTN} onClick={replay}>
          Run it again
        </button>
      </span>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The todos table and what comes back are an illustration. The four tool names and the line under each are from the Supabase MCP server&apos;s own tool definitions; get_advisors is
        &ldquo;planned for future deprecation in favor of get_issues&rdquo; and still available.
      </figcaption>
      <Source text="supabase-community/supabase-plugin README" href={PLUGS[0].href} />
    </figure>
  );
}

const CELL = "border-b border-[var(--rule)] px-2 py-1 font-mono text-[12px] text-[var(--ink)]";

function SqlRows({ k }: { k: number }) {
  return (
    <div>
      <code className="block font-mono text-[12px] text-[var(--soft)] [overflow-wrap:anywhere]">select id, title, done from todos limit 3;</code>
      <table className="mt-2 w-full border-collapse text-left">
        <thead>
          <tr>
            {["id", "title", "done"].map((h) => (
              <th key={h} className={`${CELL} font-normal text-[var(--muted)]`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TODOS.map((row, n) => (
            <tr key={row[0]} style={{ opacity: k > n / 3 ? 1 : 0, transform: `translateY(${k > n / 3 ? 0 : 4}px)`, transition: "opacity .3s, transform .3s" }}>
              {row.map((cell, i) => (
                <td key={i} className={CELL}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MigrationRows({ k }: { k: number }) {
  return (
    <div>
      <code className="block font-mono text-[12px] text-[var(--soft)] [overflow-wrap:anywhere]">alter table todos add column due_at timestamptz;</code>
      <div className="mt-2 flex overflow-hidden rounded-md border border-[var(--rule)]">
        {["id", "title", "done"].map((h) => (
          <span key={h} className="flex-1 border-r border-[var(--rule)] px-2 py-1.5 font-mono text-[12px] text-[var(--ink)]">
            {h}
          </span>
        ))}
        <span className="overflow-hidden whitespace-nowrap bg-[var(--accent)] font-mono text-[12px] text-white" style={{ flex: `0 0 ${k * 28}%`, padding: k > 0.05 ? "6px 8px" : "6px 0" }}>
          due_at
        </span>
      </div>
      <span className="mt-1.5 block font-mono text-[12px] text-[var(--muted)]">{k >= 1 ? "migration applied · 1 column added" : "applying…"}</span>
    </div>
  );
}

const TYPE_LINES = ["export type Database = {", "  public: { Tables: { todos: { Row: {", "    id: number; title: string; done: boolean", "  } } } }", "}"];

function TypesLines({ k }: { k: number }) {
  const n = Math.round(k * TYPE_LINES.length);
  return (
    <pre className="overflow-x-auto rounded-md border border-[var(--rule)] bg-[var(--page)] px-3 py-2 font-mono text-[12px] leading-relaxed text-[var(--ink)]">
      {TYPE_LINES.map((line, i) => (
        <span key={i} className="block" style={{ opacity: i < n ? 1 : 0, transition: "opacity .2s" }}>
          {line}
        </span>
      ))}
    </pre>
  );
}

function Advice({ k }: { k: number }) {
  const items = [
    { kind: "security", text: "Table public.todos has row level security off" },
    { kind: "performance", text: "A foreign key has no covering index" },
  ];
  return (
    <ul className="space-y-1.5">
      {items.map((item, n) => (
        <li key={item.kind} className="flex items-start gap-2 rounded-md border px-2.5 py-1.5" style={{ borderColor: n === 0 ? "var(--accent)" : "var(--rule)", opacity: k > n / 2 ? 1 : 0, transition: "opacity .3s" }}>
          <span className="shrink-0 font-mono text-[12px]" style={{ color: n === 0 ? "var(--accent)" : "var(--muted)" }}>
            {item.kind}
          </span>
          <span className="min-w-0 text-[13px] leading-snug text-[var(--ink)]">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

/* ───────────── figure · Vercel: one command, built, deployed, a URL ───────────── */
const VC_STEPS = ["Build", "Deploy", "Ready"];
const VC_TOTAL = 3000;

function VercelFigure() {
  const [target, setTarget] = useState<"preview" | "production">("preview");
  const { ref, t, replay } = useElapsed(VC_TOTAL);
  const progress = ramp(t, 200, VC_TOTAL - 400);
  const step = Math.min(VC_STEPS.length - 1, Math.floor(progress * VC_STEPS.length));
  const done = t >= VC_TOTAL;
  const command = deployCommand(target);
  return (
    <figure ref={ref} className="vb-plate p-4 sm:p-6">
      <Plate tag="figure" title="One command to a URL" sub="pick a target · run it" />
      <div role="radiogroup" aria-label="Deploy target" className="inline-flex max-w-full flex-wrap gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
        {(["preview", "production"] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={target === id}
            onClick={() => {
              setTarget(id);
              replay();
            }}
            className={`vb-press min-h-9 rounded-full px-3 text-[13px] font-medium ${FOCUS} ${target === id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
          >
            {id === "preview" ? "Preview" : "Production"}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-[12px] border border-[var(--ink)] bg-[var(--ink)] px-3 py-2.5 font-mono text-[13px] text-white">
        <span className="text-[var(--accent)]">&gt;</span> {command}
        <span className="vb-caret ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] bg-white/80" aria-hidden />
      </div>

      <div className="vb-card mt-2">
        <ol className="grid grid-cols-3 gap-2" aria-label="Deploy steps">
          {VC_STEPS.map((name, n) => {
            const reached = done || n < step || (n === step && progress > 0);
            const current = !done && n === step && progress > 0;
            return (
              <li key={name} className="min-w-0">
                <span className="block font-mono text-[12px]" style={{ color: reached ? "var(--ink)" : "var(--muted)" }}>
                  {two(n + 1)} {name}
                </span>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--rule)]">
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: `${done || n < step ? 100 : n === step ? Math.round((progress * VC_STEPS.length - n) * 100) : 0}%`,
                      background: done ? "var(--accent)" : "var(--ink)",
                    }}
                  />
                </span>
                <span className="mt-1 block font-mono text-[12px] text-[var(--muted)]">{done || n < step ? "done" : current ? "running" : "waiting"}</span>
              </li>
            );
          })}
        </ol>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--rule)] pt-3" aria-live="polite">
          <span className="flex size-7 items-center justify-center rounded-full border" style={{ borderColor: done ? "var(--accent)" : "var(--rule-strong)", transition: "border-color .3s" }} aria-hidden>
            <svg viewBox="0 0 16 16" className="size-4">
              <circle cx="8" cy="8" r="6.5" fill="none" stroke={done ? "var(--accent)" : "var(--muted)"} strokeWidth="1.3" />
              <path d="M1.5 8h13M8 1.5c2 2 2 11 0 13M8 1.5c-2 2-2 11 0 13" fill="none" stroke={done ? "var(--accent)" : "var(--muted)"} strokeWidth="1.3" />
            </svg>
          </span>
          <span className="min-w-0 flex-1 basis-[180px]">
            <span className="block text-[14px] font-medium leading-snug text-[var(--ink)]">
              {done ? (target === "preview" ? "A preview URL to open and share." : "Live on your production domain.") : "Deploying…"}
            </span>
            <span className="block font-mono text-[12px] text-[var(--muted)] [overflow-wrap:anywhere]">{target === "preview" ? "https://<project>-<hash>.vercel.app" : "https://<your-domain>"}</span>
          </span>
          <button type="button" className={BTN} onClick={replay}>
            Run it again
          </button>
        </div>
      </div>

      <div className="vb-card mt-2">
        <span className={LABEL}>THE FOUR COMMANDS</span>
        <ul className="mt-2 space-y-2">
          {VC_COMMANDS.map((c) => (
            <li key={c.command}>
              <CopyLine line={c.command} />
              <span className="mt-1 block text-[13px] leading-snug text-[var(--soft)]">{c.purpose}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The three steps and the addresses are an illustration. The commands and what each one is for are the README&apos;s table; /vercel-plugin:deploy prod is its own example.
      </figcaption>
      <Source text="vercel/vercel-plugin README, Commands and Usage" href={PLUGS[1].href} />
    </figure>
  );
}

/* ───────────── figure · Oh My Claude Code: one /team line, five stages, three executors ───────────── */
// ms marks for the run: plan, prd, exec (three lanes), verify (finds one left), fix, verify again
const TM = { plan: 0, prd: 800, exec: 1600, verify: 3700, fix: 4400, verify2: 5100, done: 5800 };
const LANE_SPEED = [1, 0.8, 0.9];
const ERRORS = 12; // the illustration's starting count

function TeamFigure() {
  const { ref, t, replay } = useElapsed(TM.done);
  const stage = t < TM.prd ? 0 : t < TM.exec ? 1 : t < TM.verify ? 2 : t < TM.fix ? 3 : t < TM.verify2 ? 4 : t < TM.done ? 3 : 5;
  const lanes = LANE_SPEED.map((speed) => Math.min(1, ramp(t, TM.exec, TM.exec + (TM.verify - TM.exec) * speed)));
  const fixedInExec = Math.round(lanes.reduce((a, b) => a + b, 0) * ((ERRORS - 1) / OMC_WORKERS));
  const left = t < TM.exec ? ERRORS : t < TM.fix ? ERRORS - fixedInExec : t < TM.verify2 ? 1 - Math.round(ramp(t, TM.fix, TM.verify2)) : 0;
  const done = t >= TM.done;
  const status = [
    "team-plan: the lead splits the task.",
    "team-prd: what done means is written down.",
    `team-exec: ${OMC_WORKERS} executors work at once.`,
    left > 0 ? `team-verify: ${left} left. Back to fix.` : "team-verify: checking again.",
    "team-fix: the last one is fixed.",
    "Verified. No errors left.",
  ][stage];
  return (
    <figure ref={ref} className="vb-plate p-4 sm:p-6">
      <Plate tag="figure" title="A team on one task" sub="the README's line · run it" />
      <CopyLine line={OMC_TEAM} />

      <ol className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-5" aria-label="The staged pipeline">
        {OMC_STAGES.map((name, n) => {
          const active = !done && n === stage;
          const passed = done || n < stage || (n === 3 && stage === 4);
          return (
            <li
              key={name}
              className="flex items-center justify-between gap-2 rounded-[10px] border px-2.5 py-2 sm:flex-col sm:items-start sm:justify-start"
              style={{ borderColor: active ? "var(--ink)" : passed ? "var(--accent)" : "var(--rule)", background: active ? "#fff" : passed ? "#fff" : "transparent", transition: "border-color .3s" }}
            >
              <span className="font-mono text-[12px] font-medium text-[var(--ink)]">{name}</span>
              <span className="font-mono text-[12px]" style={{ color: active ? "var(--accent)" : "var(--muted)" }}>
                {active ? "now" : passed ? "done" : n === 4 ? "loop" : "next"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="vb-card mt-2">
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[12px] text-[var(--muted)]">team-exec · {OMC_WORKERS}:executor</span>
          <span className="font-mono text-[12px] tabular-nums" style={{ color: left === 0 ? "var(--accent)" : "var(--muted)" }}>
            TypeScript errors: {left}
          </span>
        </span>
        <div className="mt-2 space-y-2">
          {lanes.map((k, n) => (
            <div key={n} className="grid grid-cols-[5.5rem_1fr] items-center gap-2">
              <span className="font-mono text-[12px] text-[var(--ink)]">executor {n + 1}</span>
              <span className="relative h-3 overflow-hidden rounded-full bg-[var(--rule)]">
                <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.round(k * 100)}%`, background: k >= 1 ? "var(--accent)" : "var(--ink)" }} />
              </span>
            </div>
          ))}
        </div>
        <span className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-3">
          <span className="min-w-0 flex-1 basis-[180px] text-[14px] font-medium leading-snug text-[var(--ink)]" aria-live="polite">
            {status}
          </span>
          <button type="button" className={BTN} onClick={replay}>
            Run it again
          </button>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The line and the five stage names are the README&apos;s (&ldquo;team-fix (loop)&rdquo;). The error count, the speed of each executor and the one fix round are an illustration. /team needs Claude Code&apos;s
        native teams switched on; without them OMC warns you and falls back where it can.
      </figcaption>
      <Source text="Yeachan-Heo/oh-my-claudecode README, Team Mode" href={PLUGS[2].href} />
    </figure>
  );
}

/* ───────────── figure · Chrome DevTools: the agent opens the page and reads four things ───────────── */
const CDT_TOTAL = 1600; // ms for one tab's animation
const CONSOLE = [
  { level: "log", text: "App mounted" },
  { level: "warn", text: "Image is missing width and height" },
  { level: "error", text: "TypeError: Cannot read properties of undefined (reading 'map')", at: "at TodoList (TodoList.tsx:14:22)" },
];
const NETWORK = [
  { path: "GET /", status: 200, start: 0, len: 22 },
  { path: "GET /app.js", status: 200, start: 18, len: 30 },
  { path: "GET /api/todos", status: 500, start: 40, len: 26 },
  { path: "GET /logo.svg", status: 200, start: 44, len: 12 },
];
const FLAME = [
  { left: 0, width: 62, row: 0 },
  { left: 4, width: 30, row: 1 },
  { left: 38, width: 20, row: 1 },
  { left: 8, width: 14, row: 2 },
  { left: 40, width: 9, row: 2 },
  { left: 66, width: 26, row: 0 },
  { left: 70, width: 12, row: 1 },
];

function DevToolsFigure() {
  const [tab, setTab] = useState<CdtTab>("console");
  const [touched, setTouched] = useState(false);
  const { ref, t, replay, visible, reduce } = useElapsed(CDT_TOTAL);
  // until someone taps, walk through the four tabs once
  useEffect(() => {
    if (!visible || reduce || touched || t < CDT_TOTAL) return;
    const index = CDT_TABS.findIndex((x) => x.id === tab);
    if (index >= CDT_TABS.length - 1) return;
    const id = setTimeout(() => {
      setTab(CDT_TABS[index + 1].id);
      replay();
    }, 1400);
    return () => clearTimeout(id);
  }, [visible, reduce, touched, t, tab, replay]);
  const k = ramp(t, 0, CDT_TOTAL);
  const line = CDT_TABS.find((x) => x.id === tab)?.line ?? "";
  return (
    <figure ref={ref} className="vb-plate p-4 sm:p-6">
      <Plate tag="figure" title="It opens the page it built" sub="tap a tab · see what it reads" />
      <div className="overflow-hidden rounded-[12px] border border-[var(--ink)] bg-white">
        {/* the browser's top bar */}
        <div className="flex items-center gap-2 border-b border-[var(--rule)] px-3 py-2">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((n) => (
              <span key={n} className="size-2.5 rounded-full border border-[var(--rule-strong)]" />
            ))}
          </span>
          <span className="min-w-0 flex-1 truncate rounded-full bg-[var(--page)] px-3 py-1 font-mono text-[12px] text-[var(--soft)]">localhost:3000</span>
          <span className="font-mono text-[12px] text-[var(--accent)]">agent</span>
        </div>
        <div role="tablist" aria-label="What the agent reads" className="flex overflow-x-auto border-b border-[var(--rule)]">
          {CDT_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => {
                setTouched(true);
                setTab(item.id);
                replay();
              }}
              className={`vb-press min-h-10 shrink-0 border-b-2 px-3 text-[13px] font-medium ${FOCUS}`}
              style={{ borderColor: tab === item.id ? "var(--accent)" : "transparent", color: tab === item.id ? "var(--ink)" : "var(--muted)" }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="min-h-[176px] p-3">
          {tab === "console" ? (
            <ul className="space-y-1.5">
              {CONSOLE.map((row, n) => (
                <li
                  key={row.text}
                  className="rounded-md border px-2.5 py-1.5"
                  style={{
                    borderColor: row.level === "error" ? "var(--accent)" : "var(--rule)",
                    opacity: k > n / CONSOLE.length ? 1 : 0,
                    transform: `translateY(${k > n / CONSOLE.length ? 0 : 4}px)`,
                    transition: "opacity .3s, transform .3s",
                  }}
                >
                  <span className="flex gap-2">
                    <span className="w-10 shrink-0 font-mono text-[12px]" style={{ color: row.level === "error" ? "var(--accent)" : "var(--muted)" }}>
                      {row.level}
                    </span>
                    <span className="min-w-0 font-mono text-[12px] leading-snug text-[var(--ink)] [overflow-wrap:anywhere]">{row.text}</span>
                  </span>
                  {row.at ? <span className="ml-12 block font-mono text-[12px] text-[var(--soft)] [overflow-wrap:anywhere]">{row.at}</span> : null}
                </li>
              ))}
            </ul>
          ) : null}
          {tab === "network" ? (
            <ul className="space-y-1.5">
              {NETWORK.map((row) => (
                <li key={row.path} className="grid grid-cols-[7.5rem_2.25rem_1fr] items-center gap-2">
                  <span className="truncate font-mono text-[12px] text-[var(--ink)]">{row.path}</span>
                  <span className="font-mono text-[12px]" style={{ color: row.status >= 400 ? "var(--accent)" : "var(--muted)" }}>
                    {row.status}
                  </span>
                  <span className="relative h-2.5">
                    <span
                      className="absolute inset-y-0 rounded-full"
                      style={{ left: `${row.start}%`, width: `${row.len * Math.min(1, Math.max(0, (k * 100 - row.start) / row.len))}%`, background: row.status >= 400 ? "var(--accent)" : "var(--ink)" }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {tab === "screenshot" ? (
            <div className="relative">
              <div className="mx-auto max-w-[260px] rounded-md border border-[var(--rule-strong)] p-2.5" style={{ transform: `scale(${0.96 + 0.04 * k})`, transition: "transform .2s" }}>
                <span className="block h-2.5 w-1/3 rounded-full bg-[var(--ink)]" />
                <span className="mt-2 block h-14 rounded bg-[var(--page)]" />
                <span className="mt-2 block h-1.5 w-5/6 rounded-full bg-[var(--rule-strong)]" />
                <span className="mt-1 block h-1.5 w-2/3 rounded-full bg-[var(--rule-strong)]" />
                <span className="mt-2 inline-block h-5 w-16 rounded bg-[var(--accent)]" />
              </div>
              <span className="pointer-events-none absolute inset-0 rounded-md bg-white" style={{ opacity: k < 0.35 ? 1 - k / 0.35 : 0 }} aria-hidden />
              <span className="mt-2 block text-center font-mono text-[12px]" style={{ color: k >= 1 ? "var(--accent)" : "var(--muted)" }}>
                {k >= 1 ? "screenshot.png · saved" : "taking a screenshot…"}
              </span>
            </div>
          ) : null}
          {tab === "performance" ? (
            <div>
              <div className="relative h-[92px] rounded-md border border-[var(--rule)] bg-[var(--page)]">
                {FLAME.map((bar, n) => (
                  <span
                    key={n}
                    className="absolute h-[18px] rounded-sm border border-white"
                    style={{ left: `${bar.left}%`, top: 8 + bar.row * 22, width: `${bar.width * Math.min(1, Math.max(0, (k * 100 - bar.left) / bar.width))}%`, background: bar.row === 0 ? "var(--ink)" : bar.row === 1 ? "#4a4f56" : "var(--rule-strong)" }}
                  />
                ))}
                <span className="absolute -top-px bottom-0 border-l-2 border-[var(--accent)]" style={{ left: "58%", opacity: k >= 0.9 ? 1 : 0, transition: "opacity .3s" }} />
                <span className="absolute bottom-1 rounded bg-[var(--accent)] px-1.5 font-mono text-[12px] text-white" style={{ left: "calc(58% + 4px)", opacity: k >= 0.9 ? 1 : 0, transition: "opacity .3s" }}>
                  LCP
                </span>
              </div>
              <span className="mt-2 block font-mono text-[12px] text-[var(--muted)]">{k >= 1 ? "trace recorded · insights ready" : "recording a trace…"}</span>
            </div>
          ) : null}
        </div>
      </div>
      <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[13px] leading-relaxed text-[var(--ink)]">
        <span className="text-[var(--muted)]">From its README: </span>
        {line}
      </p>
      <div className="vb-card mt-2">
        <span className={LABEL}>FIRST PROMPT TO TRY</span>
        <div className="mt-2">
          <CopyLine line={CDT_FIRST_PROMPT} />
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The page, the console lines, the requests and the trace are an illustration. The four things it reads and the first prompt are the README&apos;s.
      </figcaption>
      <Source text="ChromeDevTools/chrome-devtools-mcp README, Key features" href={PLUGS[3].href} />
    </figure>
  );
}

const VB_CSS = `
.vb{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.vb-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.vb-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.vb-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.vb-press:active:not(:disabled){transform:scale(.97)}
.vb-press:disabled{opacity:.45}
.vb-plug-body{transition:transform .5s cubic-bezier(.34,1.56,.64,1)}
.vb-plug:hover .vb-plug-body{filter:drop-shadow(0 6px 8px rgba(21,23,26,.12))}
.vb-spark{animation:vb-spark .7s ease-out forwards;box-shadow:0 0 0 0 rgba(215,119,87,.6)}
@keyframes vb-spark{from{box-shadow:0 0 0 0 rgba(215,119,87,.6)}to{box-shadow:0 0 0 10px rgba(215,119,87,0)}}
.vb-caret{animation:vb-caret 1s steps(1) infinite}
@keyframes vb-caret{50%{opacity:0}}
.vb-in{animation:vb-in .35s cubic-bezier(.22,1,.36,1)}
@keyframes vb-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.vb-in,.vb-spark,.vb-caret{animation:none}.vb-plug-body,.vb-press{transition:none}}
`;

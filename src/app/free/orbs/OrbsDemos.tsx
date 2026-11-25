"use client";

// /free/78 (Thinking Orbs): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–77: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real: every orb here is painted by the repo's own engine (github.com/Jakubantalik/thinking-orbs, MIT, by Jakub Antalik),
// vendored unchanged in ./vendor/thinking-orbs. Only the small canvas wrapper below is this site's. See data.ts.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { MODE_FRAMES } from "./vendor/thinking-orbs/engine/registry";
import { paintFrame } from "./vendor/thinking-orbs/engine/core";
import { resolvePreset } from "./vendor/thinking-orbs/presets";
import {
  REPO,
  REST_SECONDS,
  SIZES,
  SPEED,
  STATES,
  USES,
  buildPrompt,
  orbTime,
  snippet,
  type OrbStateName,
  type OrbsDemoKind,
} from "./data";

export type { OrbsDemoKind } from "./data";

export function OrbsDemo({ kind }: { kind: OrbsDemoKind }) {
  return (
    <div className="ob mt-5 max-w-2xl">
      <style>{OB_CSS}</style>
      {kind === "nine" && <Nine />}
      {kind === "playground" && <Playground />}
      {kind === "pick" && <Pick />}
      {kind === "prompt" && <Prompt />}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/04</span>
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
const BTN = `ob-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;

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
          className={`ob-press rounded-full px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A block to paste, with its own copy button. Long lines wrap. */
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
      <pre className="whitespace-pre-wrap px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{text}</pre>
    </div>
  );
}

/**
 * One orb on a <canvas>, painted by the vendored engine. `tune` picks the tuned design (64 or 20); `px` is the CSS size it is drawn at,
 * so a 20 design can be shown large. The clock only runs while the canvas is on screen; `still` stops it on one frame.
 */
function OrbCanvas({
  state,
  tune,
  px,
  dark = false,
  speed = 1,
  still = false,
  label,
}: {
  state: OrbStateName;
  tune: 64 | 20;
  px: number;
  dark?: boolean;
  speed?: number;
  still?: boolean;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const visible = useInView(ref, { amount: 0 });
  const clock = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1); // the README's cap
    canvas.width = Math.round(px * dpr);
    canvas.height = Math.round(px * dpr);
    const { mode, speed: presetSpeed, opts } = resolvePreset(state, tune);
    const k = (px / tune) * dpr;
    const draw = (seconds: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(k, 0, 0, k, 0, 0);
      paintFrame(ctx, MODE_FRAMES[mode](tune, orbTime(seconds, presetSpeed, speed), opts), dark);
    };
    if (still) {
      draw(REST_SECONDS);
      return;
    }
    draw(clock.current);
    if (!visible) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // the speed slider scales the clock's rate, so moving it never jumps the orb to another phase
      clock.current += Math.min(0.1, (now - last) / 1000);
      last = now;
      draw(clock.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, tune, px, dark, speed, still, visible]);

  return <canvas ref={ref} role="img" aria-label={label} width={px} height={px} style={{ width: px, height: px, display: "block" }} />;
}

const noteOf = (state: OrbStateName) => STATES.find((s) => s.state === state)!.does;

/* ───────────── 1 · the nine: all running, tap one for the README's note ───────────── */
function Nine() {
  const reduce = useReducedMotionSafe();
  const [picked, setPicked] = useState<OrbStateName>("searching");
  return (
    <figure className="ob-plate p-4 sm:p-6">
      <Plate n={1} title="Nine states, one component" sub="all nine running · tap one" />
      <div className="grid grid-cols-3 gap-2">
        {STATES.map(({ state }) => (
          <button
            key={state}
            type="button"
            aria-pressed={picked === state}
            onClick={() => setPicked(state)}
            className={`ob-press flex flex-col items-center gap-1.5 rounded-xl border bg-white px-2 pt-3 pb-2 ${FOCUS} ${picked === state ? "border-[var(--accent)]" : "border-[var(--rule)] hover:border-[var(--rule-strong)]"}`}
          >
            <OrbCanvas state={state} tune={64} px={64} still={reduce} label={`${state}: ${noteOf(state)}`} />
            <span className={`font-mono text-[11.5px] ${picked === state ? "text-[var(--accent)]" : "text-[var(--soft)]"}`}>{state}</span>
          </button>
        ))}
      </div>
      <div className="ob-card mt-3" aria-live="polite">
        <code key={picked} className="ob-in block font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">
          {`<ThinkingOrb state="${picked}" />`} <span className="text-[var(--muted)]">{`{/* ${noteOf(picked)} */}`}</span>
        </code>
      </div>
      <Source text="README.md · States" path="README.md#states" />
    </figure>
  );
}

/* ───────────── 2 · the playground: state, size, speed, page, reduce motion ───────────── */
function Playground() {
  const system = useReducedMotionSafe();
  const [state, setState] = useState<OrbStateName>("solving");
  const [size, setSize] = useState<"64" | "20">("64");
  const [speed, setSpeed] = useState(SPEED.initial);
  const [page, setPage] = useState<"light" | "dark">("light");
  const [reduceSet, setReduceSet] = useState<boolean | null>(null);
  const reduce = reduceSet ?? system;
  const tune = Number(size) as 64 | 20;
  const dark = page === "dark";
  const status = USES.find((u) => u.state === state)!.status;
  return (
    <figure className="ob-plate p-4 sm:p-6">
      <Plate n={2} title="The real engine, in your browser" sub="state · size · speed · page · reduce motion" />
      <Choice label="State" options={STATES.map((s) => ({ id: s.state, label: s.state }))} value={state} set={setState} />

      <div className={`mt-3 overflow-hidden rounded-xl border border-[var(--rule)] ${dark ? "ob-dark" : "bg-white"}`}>
        <div className="flex flex-col items-center gap-3 px-4 pt-5 pb-4 sm:flex-row sm:items-center sm:gap-6">
          <OrbCanvas state={state} tune={tune} px={200} dark={dark} speed={speed} still={reduce} label={`${state} orb, the ${size} design drawn large`} />
          <div className="flex w-full flex-col gap-3 sm:w-auto">
            <span className={`font-mono text-[11px] ${dark ? "text-white/55" : "text-[var(--muted)]"}`}>the {size} design, drawn at 200 px</span>
            <div className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 ${dark ? "border-white/15" : "border-[var(--rule)]"}`}>
              <OrbCanvas state={state} tune={tune} px={tune} dark={dark} speed={speed} still={reduce} label={`${state} orb at its real size, ${size} px`} />
              <span className={`${tune === 20 ? "text-[13px]" : "text-[14px]"} ${dark ? "text-white/80" : "text-[var(--soft)]"}`}>{status}</span>
            </div>
            <span className={`font-mono text-[11px] ${dark ? "text-white/55" : "text-[var(--muted)]"}`}>real size: {size} px · {SIZES.find((s) => String(s.size) === size)!.label}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Choice label="Size" options={SIZES.map((s) => ({ id: String(s.size) as "64" | "20", label: `size ${s.size}` }))} value={size} set={setSize} />
        <Choice
          label="Page"
          options={[
            { id: "light", label: "light page" },
            { id: "dark", label: "dark page" },
          ]}
          value={page}
          set={setPage}
        />
        <button type="button" aria-pressed={reduce} onClick={() => setReduceSet(!reduce)} className={`${BTN} ${reduce ? "border-[var(--accent)] text-[var(--accent)]" : ""}`}>
          Reduce motion: {reduce ? "on" : "off"}
        </button>
      </div>

      <label className="mt-3 flex items-center gap-3 text-[12.5px] text-[var(--soft)]">
        <span className="w-[86px] shrink-0 font-mono text-[11.5px]">speed {speed.toFixed(2)}×</span>
        <input
          type="range"
          className="ob-range w-full"
          min={SPEED.min}
          max={SPEED.max}
          step={SPEED.step}
          value={speed}
          disabled={reduce}
          onChange={(e) => setSpeed(Number(e.target.value))}
          aria-label="Speed"
        />
      </label>

      <div className="mt-3">
        <CopyBlock label="The JSX for this · theme=&quot;auto&quot; picks the ink from your page" text={snippet({ state, size: tune, speed })} />
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted)]">
        {reduce
          ? "Reduce motion is on: the orb stops on one frame. The component does the same by itself when the system asks for reduced motion."
          : "The 20 design is not the 64 one shrunk: switch sizes and the dot count, dot size and speed change."}
      </p>
      <Source text="README.md · Sizes, Theme, Other props" path="README.md#sizes" />
    </figure>
  );
}

/* ───────────── 3 · pick a state by what the agent is doing ───────────── */
function Pick() {
  const reduce = useReducedMotionSafe();
  const [id, setId] = useState(USES[0].id);
  const use = USES.find((u) => u.id === id)!;
  return (
    <figure className="ob-plate p-4 sm:p-6">
      <Plate n={3} title="What is your AI doing?" sub="tap an activity · the orb follows" />
      <Choice label="Activity" options={USES.map((u) => ({ id: u.id, label: u.label }))} value={id} set={setId} />

      <div className="ob-card mt-3 space-y-3" aria-live="polite">
        <div className="flex items-center gap-3">
          <OrbCanvas state={use.state} tune={64} px={48} still={reduce} label={use.status} />
          <div className="min-w-0">
            <span className="block font-mono text-[11px] text-[var(--muted)]">assistant · size 64 next to the avatar</span>
            <span key={use.id} className="ob-shimmer text-[14.5px] font-medium">
              {use.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-t border-[var(--rule)] pt-3 text-[13.5px] text-[var(--soft)]">
          <OrbCanvas state={use.state} tune={20} px={20} still={reduce} label={use.status} />
          <span>{use.status}</span>
          <span className="ml-auto font-mono text-[11px] text-[var(--muted)]">size 20, inline</span>
        </div>
      </div>
      <div className="ob-card mt-2">
        <code className="block font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">
          {`<ThinkingOrb state="${use.state}" size={20} aria-label="${use.status}" />`}
        </code>
      </div>
      <p className="mt-2 font-mono text-[10.5px] text-[var(--muted)]">{`${use.state}: ${noteOf(use.state)} (README)`}</p>
    </figure>
  );
}

/* ───────────── 4 · the prompt for Claude Code ───────────── */
function Prompt() {
  const [ids, setIds] = useState<string[]>(["search", "reason", "tools", "write"]);
  const toggle = (id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  return (
    <figure className="ob-plate p-4 sm:p-6">
      <Plate n={4} title="One prompt for Claude Code" sub="tick what your AI does · copy · paste in your project" />
      <div role="group" aria-label="What your AI does" className="flex flex-wrap gap-1.5">
        {USES.map((u) => {
          const on = ids.includes(u.id);
          return (
            <button
              key={u.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(u.id)}
              className={`ob-press rounded-full border px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule-strong)] bg-white text-[var(--soft)] hover:text-[var(--ink)]"}`}
            >
              {on ? "✓ " : ""}
              {u.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3">
        <CopyBlock label={ids.length ? `prompt · ${ids.length} of ${USES.length} activities` : "prompt · nothing ticked, so all nine"} text={buildPrompt(ids)} />
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-[var(--muted)]">
        The prompt asks for a diff, so you see every change before you keep it. Installing a package is a change to your project: read what it adds.
      </p>
    </figure>
  );
}

const OB_CSS = `
.ob{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.ob-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.ob-dark{background-color:#15171a;background-image:linear-gradient(to right,rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.05) 1px,transparent 1px);background-size:24px 24px}
.ob-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.ob-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.ob-press:active:not(:disabled){transform:scale(.97)}
.ob-in{animation:ob-in .35s cubic-bezier(.22,1,.36,1)}
.ob-range{accent-color:var(--accent);height:24px}
.ob-shimmer{background-image:linear-gradient(90deg,var(--muted) 35%,var(--ink) 50%,var(--muted) 65%);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ob-sh 1.8s linear infinite}
@keyframes ob-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes ob-sh{from{background-position:100% 0}to{background-position:0 0}}
@media (prefers-reduced-motion:reduce){.ob-in{animation:none}.ob-shimmer{animation:none;background:none;color:var(--soft)}}
`;

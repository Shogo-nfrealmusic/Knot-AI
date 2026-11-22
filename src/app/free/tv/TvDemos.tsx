"use client";

// /free/74 (CleanYourTV): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–70: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real: every setting name, command, number and quoted line is from README.md, PROMPT.md and tools/restore.sh of
// github.com/Gathin23/cleanyourtv (MIT), read 2026-11-22 at commit f63a1eb. The two photos are the README's own. See data.ts.
// Nothing here talks to a TV: the figures show what the repo says each step does.

import { useEffect, useRef, useState, useSyncExternalStore, type Ref } from "react";
import { useInView } from "motion/react";
import {
  ASKS,
  CLONE,
  COVERAGE,
  FIND_TV,
  FINE_PRINT,
  HOME_AFTER,
  HOME_BEFORE,
  HOW_IT_WORKS,
  MODEL_SLOT,
  NEEDS,
  PLATFORMS,
  PROMPT_OPENING,
  PROMPT_URL,
  QUICK_START,
  REPO,
  RESTORE_FACTS,
  RESTORE_HOST,
  SWITCH,
  TOP_BRANDS,
  hostOrDefault,
  restoreLine,
  type Platform,
  type TvDemoKind,
} from "./data";

export type { TvDemoKind } from "./data";

export function TvDemo({ kind }: { kind: TvDemoKind }) {
  return (
    <div className="tv mt-5 max-w-2xl">
      <style>{TV_CSS}</style>
      {kind === "check" && <Compat />}
      {kind === "switch" && <Switch />}
      {kind === "steps" && <Steps />}
      {kind === "home" && <Home />}
      {kind === "restore" && <Restore />}
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
const BTN = `tv-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const PRIMARY = `tv-press inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 text-[13.5px] font-medium text-white disabled:opacity-40 ${FOCUS}`;
const FIELD = `h-10 w-full min-w-0 rounded-lg border border-[var(--rule-strong)] bg-white px-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--muted)] ${FOCUS}`;

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

function Check({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="7" fill={on ? "var(--accent)" : "#fff"} stroke={on ? "var(--accent)" : "var(--rule-strong)"} strokeWidth="1.2" style={{ transition: "fill .3s, stroke .3s" }} />
      <polyline points="4.6,8.3 7,10.6 11.4,5.8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** a half of the job that this TV does not get */
function Cross() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="7" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
      <path d="M5.4 5.4l5.2 5.2M10.6 5.4l-5.2 5.2" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
          className={`tv-press rounded-full px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CopyRow({ text, label }: { text: string; label: string }) {
  const { state, copy } = useCopy(text);
  return (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2">
      <span className="min-w-0 flex-1 basis-[220px] font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{text}</span>
      <button type="button" className={BTN} onClick={copy} aria-label={label}>
        {state === "done" ? "Copied" : state === "failed" ? "Select and copy" : "Copy"}
      </button>
    </span>
  );
}

/* ───────────── 1 · will it work: pick what the TV runs, see which half of the job it gets ───────────── */
const MOST = TOP_BRANDS[0].lists;

function Compat() {
  const [id, setId] = useState<Platform["id"]>("android");
  const p = PLATFORMS.find((item) => item.id === id)!;
  // steps 1–6: one brand bar fills per step; the two totals count up with them
  const { ref, step, replay, reduce } = useSteps(TOP_BRANDS.length, 170);
  const share = Math.min(step, TOP_BRANDS.length) / TOP_BRANDS.length;
  return (
    <figure ref={ref} className="tv-plate p-4 sm:p-6">
      <Plate n={1} title="Will it work on my TV?" sub="pick what your TV runs" />
      <div role="radiogroup" aria-label="What your TV runs" className="grid gap-1.5 sm:grid-cols-2">
        {PLATFORMS.map((item) => {
          const on = item.id === id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setId(item.id)}
              className={`tv-press flex min-h-11 items-center rounded-[12px] border px-3 py-2 text-left text-[13px] font-medium leading-snug ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"}`}
            >
              {item.pick}
            </button>
          );
        })}
      </div>

      <div className="tv-card mt-2" aria-live="polite">
        <span key={p.id} className="tv-in block">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-[22px] font-semibold leading-none tracking-[-0.02em] sm:text-[26px]" style={{ color: p.debloat && p.launcher ? "var(--accent)" : "var(--ink)" }}>
              {p.verdict}
            </span>
            <span className="font-mono text-[11.5px] text-[var(--muted)]">{p.pick}</span>
          </span>
          <span className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
            <span className="flex items-center gap-2 text-[13px] leading-snug" style={{ color: p.debloat ? "var(--ink)" : "var(--muted)" }}>
              {p.debloat ? <Check on /> : <Cross />}
              Switching the bloat off
            </span>
            <span className="flex items-center gap-2 text-[13px] leading-snug" style={{ color: p.launcher ? "var(--ink)" : "var(--muted)" }}>
              {p.launcher ? <Check on /> : <Cross />}
              The new home screen
            </span>
          </span>
          <span className="mt-3 block border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--ink)]">&ldquo;{p.says}&rdquo;</span>
          {p.promptSays ? (
            <span className="mt-2 block text-[13px] leading-relaxed text-[var(--soft)]">
              The prompt file is stricter than that table: &ldquo;{p.promptSays}&rdquo; If you have a Fire TV, expect the debloat half at most.
            </span>
          ) : null}
          {p.instead ? (
            <span className="mt-2 block text-[13px] leading-relaxed text-[var(--soft)]">
              The README sends these TVs to{" "}
              <a href={p.instead} target="_blank" rel="noopener noreferrer" className={LINK}>
                cleanyour.tv/not-android
              </a>
              , where you turn off the tracking with your remote instead.
            </span>
          ) : null}
        </span>
      </div>

      <div className="tv-card mt-2">
        <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <span className="text-[13px] font-medium text-[var(--ink)]">
            <span className="font-mono text-[18px] font-semibold tabular-nums">{Math.round(COVERAGE.models * share)}</span> TV models from{" "}
            <span className="font-mono text-[18px] font-semibold tabular-nums">{Math.round(COVERAGE.brands * share)}</span> brands have a tested list
          </span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
        <ul className="mt-3 space-y-1.5" aria-label="The six brands with the most tested lists">
          {TOP_BRANDS.map((b, i) => {
            const on = i < step;
            return (
              <li key={b.name} className="grid grid-cols-[4.75rem_1fr_2rem] items-center gap-2">
                <span className="truncate text-[12.5px] font-medium text-[var(--ink)]">{b.name}</span>
                <span className="h-2 overflow-hidden rounded-full bg-[var(--rule)]">
                  <span className="block h-full rounded-full" style={{ width: on ? `${(b.lists / MOST) * 100}%` : "0%", background: i === 0 ? "var(--accent)" : "var(--ink)", transition: "width .5s cubic-bezier(.22,1,.36,1)" }} />
                </span>
                <span className="text-right font-mono text-[11.5px] tabular-nums" style={{ color: on ? "var(--ink)" : "var(--muted)" }}>
                  {b.lists}
                </span>
              </li>
            );
          })}
        </ul>
        <span className="mt-3 block text-[12.5px] leading-relaxed text-[var(--soft)]">
          The numbers are tested lists per brand. Search for your exact model at{" "}
          <a href={FIND_TV} target="_blank" rel="noopener noreferrer" className={LINK}>
            cleanyour.tv/tvs
          </a>
          . Not there? The README says the prompt discovers the bloat itself.
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Hisense is on both sides on purpose: its Android TV and Google TV sets have 17 lists, and its VIDAA sets are not supported.
      </figcaption>
      <Source text="README, Supported TVs" path="README.md" />
    </figure>
  );
}

/* ───────────── 2 · switch it on: the README's path on the TV. Press OK on Build seven times ───────────── */
function Toggle({ label, on, set, innerRef }: { label: string; on: boolean; set: (on: boolean) => void; innerRef?: Ref<HTMLButtonElement> }) {
  return (
    <button
      ref={innerRef}
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => set(!on)}
      className={`tv-in flex min-h-11 w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left text-[13.5px] font-medium text-white hover:bg-white/10 ${FOCUS}`}
    >
      {label}
      <span aria-hidden className="relative h-5 w-9 shrink-0 rounded-full" style={{ background: on ? "var(--accent)" : "rgba(255,255,255,.25)", transition: "background-color .25s" }}>
        <span className="absolute top-0.5 size-4 rounded-full bg-white" style={{ left: on ? 18 : 2, transition: "left .3s cubic-bezier(.34,1.56,.64,1)" }} />
      </span>
    </button>
  );
}

function Switch() {
  const [presses, setPresses] = useState(0);
  const [usb, setUsb] = useState(false);
  const [net, setNet] = useState(false);
  const unlocked = presses >= SWITCH.presses;
  // the OK button gives way to the toggles after the seventh press; keep keyboard focus on what replaces it
  const first = useRef<HTMLButtonElement>(null);
  const pressed = useRef(false);
  useEffect(() => {
    if (unlocked && pressed.current) first.current?.focus();
  }, [unlocked]);
  const reset = () => {
    pressed.current = false;
    setPresses(0);
    setUsb(false);
    setNet(false);
  };
  const crumbs = unlocked ? [SWITCH.path[0], SWITCH.path[1], SWITCH.menu] : SWITCH.path;
  const line = !unlocked
    ? `Press OK on ${SWITCH.row} seven times. ${SWITCH.presses - presses} to go.`
    : !usb
      ? `${SWITCH.menu} is open. Turn ${SWITCH.toggle} on.`
      : `${SWITCH.toggle} is on. ${SWITCH.keep}`;
  return (
    <figure className="tv-plate p-4 sm:p-6">
      <Plate n={2} title="Switch this on first" sub="press OK seven times · flip the switch" />
      {/* a drawing of the path, not a real TV menu */}
      <div className="rounded-[14px] bg-[var(--ink)] p-3 sm:p-4">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-mono text-[11.5px] text-white/60" aria-label="Where you are in the TV's settings">
          {crumbs.map((c, i) => (
            <li key={c} className="flex items-center gap-1.5">
              {i > 0 ? <span aria-hidden>›</span> : null}
              <span className={i === crumbs.length - 1 ? "text-white" : undefined}>{c}</span>
            </li>
          ))}
        </ol>
        <div className="mt-3 space-y-1">
          {!unlocked ? (
            <div className="flex min-h-11 items-center justify-between gap-3 rounded-[10px] bg-white/10 px-3 py-2">
              <span className="text-[13.5px] font-medium text-white">{SWITCH.row}</span>
              <span className="flex items-center gap-1" role="img" aria-label={`${presses} of ${SWITCH.presses} presses`}>
                {Array.from({ length: SWITCH.presses }, (_, i) => (
                  <span key={i} className="size-2 rounded-full" style={{ background: i < presses ? "var(--accent)" : "rgba(255,255,255,.25)", transform: i === presses - 1 ? "scale(1.35)" : "none", transition: "transform .3s cubic-bezier(.34,1.56,.64,1), background-color .2s" }} />
                ))}
              </span>
            </div>
          ) : (
            <>
              <Toggle innerRef={first} label={SWITCH.toggle} on={usb} set={setUsb} />
              <Toggle label={`${SWITCH.alsoToggle} (if your TV shows it)`} on={net} set={setNet} />
            </>
          )}
        </div>
      </div>

      <div className="tv-card mt-2" aria-live="polite">
        <span className="block text-[14px] font-semibold leading-snug text-[var(--ink)]">{line}</span>
        <span className="mt-2.5 flex flex-wrap gap-2">
          {!unlocked ? (
            <button
              type="button"
              className={PRIMARY}
              onClick={() => {
                pressed.current = true;
                setPresses((n) => Math.min(n + 1, SWITCH.presses));
              }}
            >
              Press OK
            </button>
          ) : null}
          <button type="button" className={`${BTN} h-10 rounded-lg!`} disabled={presses === 0} onClick={reset}>
            Start over
          </button>
        </span>
      </div>

      <div className="tv-card mt-2">
        <span className="block text-[12.5px] font-medium text-[var(--ink)]">And the computer you run it from needs</span>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {NEEDS.map((need) => (
            <li key={need} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--soft)]">
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--ink)]" />
              {need}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The path is the README&apos;s; the dark panel is a drawing, not your TV&apos;s menu. One warning from the prompt file: &ldquo;Some boxes cut power to their USB port while USB debugging is on&rdquo;, so a USB speaker, drive or Ethernet adapter on that port can drop until you switch debugging off again.
      </figcaption>
      <Source text="README, Quick start · PROMPT.md" path="README.md" />
    </figure>
  );
}

/* ───────────── 3 · the three steps: the README's rows, the clone line, and how the prompt starts with your model in it ───────────── */
const STEP_TABS = QUICK_START.map((s, i) => ({ id: String(i), label: `${i + 1} · ${s.where}` }));
const [PROMPT_BEFORE, PROMPT_AFTER] = PROMPT_OPENING.split(MODEL_SLOT);

function Steps() {
  const [tab, setTab] = useState("0");
  const [model, setModel] = useState("");
  const index = Number(tab);
  const row = QUICK_START[index];
  // steps 1–3: back up, disable, install light in turn
  const { ref, step, replay, reduce } = useSteps(HOW_IT_WORKS.length, 520);
  const typed = model.trim();
  return (
    <figure ref={ref} className="tv-plate p-4 sm:p-6">
      <Plate n={3} title="The three steps" sub="TV · computer · follow along" />
      <Choice label="The step" options={STEP_TABS} value={tab} set={setTab} />

      <div className="tv-card mt-3" aria-live="polite">
        <div key={tab} className="tv-in">
          <p className="font-mono text-[11px] text-[var(--accent)]">
            STEP {index + 1} OF 3 · {row.where.toUpperCase()}
          </p>
          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ink)]">{row.what}</p>

          {index === 0 ? <p className="mt-2 text-[13px] leading-relaxed text-[var(--soft)]">That is the figure above. Do it once, and leave the TV on.</p> : null}

          {index === 1 ? (
            <div className="mt-3 space-y-3">
              <CopyRow text={CLONE} label="Copy the clone command" />
              <label className="block">
                <span className="block text-[12.5px] font-medium text-[var(--ink)]">Your TV model</span>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value.slice(0, 60))}
                  placeholder="for example: Xiaomi Mi TV 4A"
                  autoComplete="off"
                  spellCheck={false}
                  className={`mt-1.5 ${FIELD}`}
                />
              </label>
              <span className="block rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2.5">
                <span className="block font-mono text-[11px] text-[var(--muted)]">How the prompt starts</span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">
                  {PROMPT_BEFORE}
                  <mark className="rounded px-1 py-0.5 font-medium" style={{ background: typed ? "var(--accent)" : "var(--rule)", color: typed ? "#fff" : "var(--ink)", transition: "background-color .25s, color .25s" }}>
                    {typed || MODEL_SLOT}
                  </mark>
                  {PROMPT_AFTER}
                </span>
              </span>
              <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <a href={PROMPT_URL} target="_blank" rel="noopener noreferrer" className={PRIMARY}>
                  Open PROMPT.md
                </a>
                <span className="min-w-0 flex-1 basis-[200px] text-[12.5px] leading-snug text-[var(--soft)]">
                  This is only the first paragraph. Copy the whole file from the repo, and put your model where it says {MODEL_SLOT}.
                </span>
              </span>
            </div>
          ) : null}

          {index === 2 ? (
            <ul className="mt-3 space-y-1.5" aria-label="What the checklist asks">
              {ASKS.map((ask) => (
                <li key={ask} className="flex items-center gap-2.5 text-[13px] leading-snug text-[var(--ink)]">
                  <Check on />
                  {ask}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="tv-card mt-2">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] font-medium text-[var(--ink)]">What the assistant then does to the TV</span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
        <svg viewBox="0 0 300 30" className="mt-2 w-full" aria-hidden>
          <line x1="20" y1="15" x2="280" y2="15" stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 3" />
          <rect x="20" y="14.25" height="1.5" width={(260 * Math.max(0, Math.min(step, 3) - 1)) / 2} fill="var(--ink)" style={{ transition: "width .5s ease-out" }} />
          {HOW_IT_WORKS.map((s, n) => (
            <circle key={s.step} cx={20 + n * 130} cy="15" r={n === step - 1 ? 8 : 6} fill={n < step ? (n === HOW_IT_WORKS.length - 1 ? "var(--accent)" : "var(--ink)") : "#fff"} stroke="var(--ink)" strokeWidth="1.3" style={{ transition: "r .3s cubic-bezier(.34,1.56,.64,1), fill .3s" }} />
          ))}
        </svg>
        <ol className="mt-1 grid gap-2 sm:grid-cols-3">
          {HOW_IT_WORKS.map((s, n) => (
            <li key={s.step} style={{ color: n < step ? "var(--ink)" : "var(--muted)", transition: "color .3s" }}>
              <span className="block text-[13px] font-semibold">
                <span className="mr-1.5 font-mono text-[11px] text-[var(--accent)]">{n + 1}</span>
                {s.step}
              </span>
              <span className="mt-0.5 block text-[12.5px] leading-snug" style={{ color: n < step ? "var(--soft)" : "var(--muted)" }}>
                {s.what}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The step text is the README&apos;s, word for word. The assistant checks each step with screenshots pulled from the TV, and in the README&apos;s words, &ldquo;With this repo as context it takes about fifteen minutes.&rdquo;
      </figcaption>
      <Source text="README, How it works and Quick start · PROMPT.md" path="PROMPT.md" />
    </figure>
  );
}

/* ───────────── 4 · the home screen: the README's two photos. Pick a part, see where it is ───────────── */
function Home() {
  const [side, setSide] = useState<"before" | "after">("before");
  const photo = side === "before" ? HOME_BEFORE : HOME_AFTER;
  const [picked, setPicked] = useState<Record<"before" | "after", string>>({ before: HOME_BEFORE.marks[0].id, after: HOME_AFTER.marks[0].id });
  const mark = photo.marks.find((m) => m.id === picked[side]) ?? photo.marks[0];
  const [x, y, w, h] = mark.box;
  return (
    <figure className="tv-plate p-4 sm:p-6">
      <Plate n={4} title="Before and after" sub="switch the photo · tap a part" />
      <Choice
        label="Which photo"
        options={[
          { id: "before", label: "Before" },
          { id: "after", label: "After" },
        ]}
        value={side}
        set={setSide}
      />
      <div className="relative mt-3 overflow-hidden rounded-[12px] border border-[var(--rule)] bg-[var(--ink)]" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}>
        {/* the README's own photo, at its own size; plain <img> like the other drop images */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" className="tv-fade absolute inset-0 size-full" />
        <span
          aria-hidden
          className="absolute rounded-[6px]"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${w}%`,
            height: `${h}%`,
            boxShadow: "0 0 0 2px var(--accent), 0 0 0 4px rgba(255,255,255,.85)",
            transition: "left .45s cubic-bezier(.22,1,.36,1), top .45s cubic-bezier(.22,1,.36,1), width .45s cubic-bezier(.22,1,.36,1), height .45s cubic-bezier(.22,1,.36,1)",
          }}
        />
      </div>

      <div role="radiogroup" aria-label={side === "before" ? "What goes away" : "What you get"} className="mt-2 flex flex-wrap gap-1.5">
        {photo.marks.map((m) => {
          const on = m.id === mark.id;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setPicked((prev) => ({ ...prev, [side]: m.id }))}
              className={`tv-press min-h-9 rounded-full border px-3 py-1.5 text-left text-[12.5px] font-medium leading-snug ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"}`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="tv-card mt-2" aria-live="polite">
        <span key={mark.id} className="tv-in block">
          <span className="font-mono text-[11px] text-[var(--accent)]">{side === "before" ? "THE README SAYS IT GOES" : "THE README SAYS YOU GET"}</span>
          <span className="mt-1 block text-[14px] font-semibold leading-snug text-[var(--ink)]">{mark.label}</span>
          <span className="mt-1 block border-l-2 border-[var(--accent)] pl-3 text-[13.5px] leading-relaxed text-[var(--soft)]">&ldquo;{mark.says}&rdquo;</span>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Both photos are from the repo&apos;s README (docs/stock-home.jpg and docs/new-home.jpg). The orange box is drawn for this page. The launcher is about 572 KB, and the TV needs Android 8.0 or newer to run it.
      </figcaption>
      <Source text="README, What you get and The launcher" path="README.md" />
    </figure>
  );
}

/* ───────────── 5 · put it back: the one line, with your TV's address in it ───────────── */
const FLOW = ["a record, before anything changes", "restore.sh replays it", "your old home screen is back"];

function Restore() {
  const [tv, setTv] = useState<"android" | "google">("android");
  const [host, setHost] = useState("");
  const [open, setOpen] = useState<string | null>(FINE_PRINT[0].id);
  const line = restoreLine(tv, host);
  const typed = host.trim();
  const refused = typed.length > 0 && hostOrDefault(typed) !== typed;
  const { state, copy } = useCopy(line);
  // steps 1–3: the record, the replay, Home back
  const { ref, step, replay, reduce } = useSteps(FLOW.length, 480);
  return (
    <figure ref={ref} className="tv-plate p-4 sm:p-6">
      <Plate n={5} title="Put it back with one line" sub="pick your TV · copy the line" />
      <Choice
        label="What your TV runs"
        options={[
          { id: "android", label: "Android TV" },
          { id: "google", label: "Google TV" },
        ]}
        value={tv}
        set={(id) => {
          setTv(id);
          replay();
        }}
      />
      <label className="mt-3 block max-w-[280px]">
        <span className="block text-[12.5px] font-medium text-[var(--ink)]">Your TV&apos;s IP address</span>
        <input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value.slice(0, 15))}
          placeholder={RESTORE_HOST}
          autoComplete="off"
          spellCheck={false}
          aria-describedby="tv-host-note"
          className={`mt-1.5 font-mono ${FIELD}`}
        />
      </label>
      <p id="tv-host-note" className="mt-1.5 text-[12.5px] leading-snug text-[var(--soft)]" aria-live="polite">
        {refused ? `That is not a full IP address yet, so the line shows the README's example, ${RESTORE_HOST}.` : typed ? "It is in the line below." : `Leave it empty to see the README's example, ${RESTORE_HOST}.`}
      </p>

      <div className="tv-card mt-3 p-0!">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] px-3 py-2">
          <span className="font-mono text-[11.5px] text-[var(--muted)]">Run this from the cloned repo</span>
          <span className="font-mono text-[11px] text-[var(--muted)]" aria-live="polite">
            {state === "done" ? "Copied" : state === "failed" ? "Select the line and copy" : ""}
          </span>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap px-3 py-3 font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{line}</pre>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--rule)] px-3 py-2.5">
          <button type="button" className={PRIMARY} onClick={copy}>
            {state === "done" ? "Copied" : "Copy the line"}
          </button>
          <span className="min-w-0 flex-1 basis-[200px] text-[12.5px] leading-snug text-[var(--soft)]">
            Change <span className="font-mono text-[12px] text-[var(--ink)]">&lt;your tv&gt;</span> to your model&apos;s folder in examples/. The README: &ldquo;Keep the list you applied.&rdquo;
            {tv === "google" ? " On Google TV the line also names the stock launcher." : ""}
          </span>
        </div>
      </div>

      <div className="tv-card mt-2">
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-[12.5px] font-medium text-[var(--ink)]">Why one line is enough</span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
        <svg viewBox="0 0 300 30" className="mt-2 w-full" aria-hidden>
          <line x1="20" y1="15" x2="280" y2="15" stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 3" />
          <rect x="20" y="14.25" height="1.5" width={(260 * Math.max(0, Math.min(step, 3) - 1)) / 2} fill="var(--ink)" style={{ transition: "width .5s ease-out" }} />
          {FLOW.map((label, n) => (
            <circle key={label} cx={20 + n * 130} cy="15" r={n === step - 1 ? 8 : 6} fill={n < step ? (n === FLOW.length - 1 ? "var(--accent)" : "var(--ink)") : "#fff"} stroke="var(--ink)" strokeWidth="1.3" style={{ transition: "r .3s cubic-bezier(.34,1.56,.64,1), fill .3s" }} />
          ))}
        </svg>
        <ol className="grid grid-cols-3 gap-2">
          {FLOW.map((label, n) => (
            <li key={label} className={`text-[12px] leading-snug ${n === 1 ? "text-center" : n === 2 ? "text-right" : ""}`} style={{ color: n < step ? "var(--ink)" : "var(--muted)", transition: "color .3s" }}>
              {label}
            </li>
          ))}
        </ol>
        <dl className="mt-3 space-y-2 border-t border-[var(--rule)] pt-3">
          {RESTORE_FACTS.map((fact) => (
            <div key={fact.what}>
              <dt className="text-[13px] font-semibold leading-snug text-[var(--ink)]">{fact.what}</dt>
              <dd className="text-[13px] leading-relaxed text-[var(--soft)] [overflow-wrap:anywhere]">{fact.how}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="mt-4 text-[12.5px] font-medium text-[var(--ink)]">Read these four before you run anything</p>
      <ul className="mt-2 space-y-1.5">
        {FINE_PRINT.map((item) => {
          const on = open === item.id;
          return (
            <li key={item.id} className="tv-card p-0!">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`tv-fine-${item.id}`}
                onClick={() => setOpen(on ? null : item.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] font-semibold leading-snug text-[var(--ink)] ${FOCUS}`}
              >
                {item.title}
                <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden style={{ transform: on ? "rotate(45deg)" : "none", transition: "transform .25s" }}>
                  <path d="M6 1v10M1 6h10" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div id={`tv-fine-${item.id}`} hidden={!on} className="px-3 pb-3">
                <p className="border-l-2 border-[var(--accent)] pl-3 text-[13.5px] leading-relaxed text-[var(--ink)]">&ldquo;{item.quote}&rdquo;</p>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--soft)]">{item.plain}</p>
              </div>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The line and the four facts under it are the README&apos;s. The quoted sentences are from its sections on safety, firmware updates and legal notes.
      </figcaption>
      <Source text="README, Restoring your TV · tools/restore.sh" path="tools/restore.sh" />
    </figure>
  );
}

const TV_CSS = `
.tv{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.tv-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.tv-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.tv-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.tv-press:active:not(:disabled){transform:scale(.97)}
.tv-in{animation:tv-in .35s cubic-bezier(.22,1,.36,1)}
.tv-fade{animation:tv-fade .45s ease-out}
@keyframes tv-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes tv-fade{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.tv-in,.tv-fade{animation:none}}
`;

"use client";

// Module 5 · Autonomy without drift. Where each scheduler runs and what stops it, why parallel work queues at review,
// the headless command flag by flag, the three things a loop needs before it runs, and how long the prompt cache lasts.
// Every rule is the module's; timings inside animations are illustrations and the captions say so.

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CONTENT } from "../content/autonomy";
import { ModulePage, type Figures } from "../ModulePage";
import { C, Check, Cross, EASE, Panel, Plate, POP, Replay, Seg, SPRING, Tag, useLoop, usePlay } from "../kit";

/* ───────────── the four schedulers ───────────── */

type SchedId = "loop" | "cron" | "desktop" | "cloud";
const SCHEDS: { id: SchedId; name: string; where: string; stops: string; watch: string }[] = [
  {
    id: "loop",
    name: "/loop",
    where: "Inside your current session",
    stops: "You close the session. Recurring tasks also expire after 30 days (7 days before v2.1.330)",
    watch: "A self-paced loop isn't restored when you resume the session",
  },
  {
    id: "cron",
    name: "Session cron",
    where: "Inside your current session",
    stops: "The session closes. It fires only while Claude Code is open and idle",
    watch: "If a run is missed while Claude is busy, it fires once when Claude becomes idle, not once per missed interval. Up to 50 per session",
  },
  {
    id: "desktop",
    name: "Desktop scheduled task",
    where: "On your machine, with access to your files",
    stops: "The app quits or the machine sleeps",
    watch: "Needs desktop app 1.1.5368 or later. Runs missed while asleep are skipped, with one catch-up run for misses in the last 7 days",
  },
  {
    id: "cloud",
    name: "Cloud scheduled task",
    where: "Anthropic's cloud",
    stops: "You delete it",
    watch: "Research preview. The prompt must be self-contained. All your connected connectors are included by default, writes included. Runs start in auto mode",
  },
];

function Pulse({ on, delay = 0 }: { on: boolean; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative flex size-3 shrink-0" aria-hidden="true">
      {on && !reduce ? (
        <motion.span className="absolute inset-0 rounded-full bg-[var(--accent)]" initial={{ scale: 1, opacity: 0.6 }} animate={{ scale: 2.6, opacity: 0 }} transition={{ duration: 1.4, repeat: Infinity, delay, ease: "easeOut" }} />
      ) : null}
      <span className={`relative size-3 rounded-full transition-colors duration-300 ${on ? "bg-[var(--accent)]" : "bg-[var(--rule-strong)]"}`} />
    </span>
  );
}

function Chip({ name, on, dark = false }: { name: string; on: boolean; dark?: boolean }) {
  return (
    <motion.div
      className={`flex min-h-11 items-center gap-2.5 rounded-xl px-3 py-2 ${dark ? "bg-white/[.06] ring-1 ring-white/10" : "bg-white ring-1 ring-[var(--rule)]"}`}
      initial={false}
      animate={{ scale: on ? 1.03 : 1 }}
      transition={SPRING}
    >
      <Pulse on={on} />
      <span className={`font-mono text-[13px] ${dark ? "text-white/85" : "text-[var(--ink)]"}`}>{name}</span>
    </motion.div>
  );
}

function ClockHero() {
  const { ref, t } = useLoop(4, 1600);
  const s = SCHEDS[t];
  return (
    <figure ref={ref} className="gd-plate p-3 sm:p-4" aria-label="Four ways to schedule work: two live inside your session, one on your machine, one in Anthropic's cloud.">
      <div className="grid gap-3">
        <div className="rounded-2xl bg-white/70 p-3 ring-1 ring-[var(--rule)]">
          <p className="px-1 font-mono text-[12.5px] text-[var(--muted)]">your machine</p>
          <div className="mt-2 rounded-xl bg-[var(--panel)] p-3">
            <p className="px-1 font-mono text-[12.5px] text-white/45">your session</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Chip name="/loop" on={t === 0} dark />
              <Chip name="session cron" on={t === 1} dark />
            </div>
          </div>
          <div className="mt-2">
            <Chip name="desktop scheduled task" on={t === 2} />
          </div>
        </div>
        <div className="rounded-2xl bg-white/70 p-3 border border-dashed border-[var(--rule-strong)]">
          <p className="px-1 font-mono text-[12.5px] text-[var(--muted)]">Anthropic&apos;s cloud</p>
          <div className="mt-2">
            <Chip name="cloud scheduled task" on={t === 3} />
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={s.id} className="rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--rule)]" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={SPRING}>
            <p className="text-[13px] text-[var(--muted)]">Stops when</p>
            <p className="mt-0.5 text-[15px] leading-snug text-[var(--ink)]">{s.stops}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <figcaption className="px-2 pb-1 pt-3 text-[14px] leading-relaxed text-[var(--muted)]">Same job, four places to run it. They fail in different ways.</figcaption>
    </figure>
  );
}

/* ───────────── 5.1: pick what happens, see what keeps running ───────────── */

type State = "runs" | "stops" | "skips";
const EVENTS = [
  ["close", "You close the session"],
  ["sleep", "The laptop sleeps or closes"],
] as const;
type EventId = (typeof EVENTS)[number][0];

const OUTCOME: Record<EventId, Record<SchedId, { s: State; why: string }>> = {
  close: {
    loop: { s: "stops", why: "It runs inside the session." },
    cron: { s: "stops", why: "It runs inside the session." },
    desktop: { s: "runs", why: "Closing a session isn't what stops it: the app quitting or the machine sleeping is." },
    cloud: { s: "runs", why: "It runs in Anthropic's cloud until you delete it." },
  },
  sleep: {
    loop: { s: "skips", why: "It lives in your session, on your machine. Nothing there runs while it sleeps." },
    cron: { s: "skips", why: "It fires only while Claude Code is open and idle." },
    desktop: { s: "skips", why: "Skipped. When the app starts again: one catch-up run for misses in the last 7 days." },
    cloud: { s: "runs", why: "It doesn't need your machine." },
  },
};

function SchedulerPicker() {
  const [ev, setEv] = useState<EventId>("sleep");
  const [open, setOpen] = useState<SchedId>("desktop");
  const reduce = useReducedMotion();
  const sel = SCHEDS.find((x) => x.id === open)!;
  return (
    <Plate caption="Pick what happens, then tap a scheduler for its row of the table. A daily job that must run with the laptop closed, and needs no local files, is a cloud scheduled task.">
      <div className="p-5 sm:p-8">
        <Seg id="sched-event" label="What happens" value={ev} onChange={setEv} options={EVENTS} />
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {SCHEDS.map((x) => {
            const o = OUTCOME[ev][x.id];
            const runs = o.s === "runs";
            return (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => setOpen(x.id)}
                  aria-pressed={open === x.id}
                  className="gd-press flex min-h-[86px] w-full items-start gap-3 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-2 aria-pressed:ring-[var(--ink)]"
                >
                  <span className="mt-0.5">{runs ? <Check on /> : o.s === "stops" ? <Cross /> : <span className="flex size-5 items-center justify-center rounded-full bg-[var(--rule-strong)] font-mono text-[11px] text-white">–</span>}</span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-mono text-[14px] text-[var(--ink)]">{x.name}</span>
                      <span className={`text-[13px] ${runs ? "text-[#1f7a50]" : o.s === "stops" ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>{runs ? "keeps running" : o.s === "stops" ? "stops" : "no run"}</span>
                    </span>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={ev} className="mt-1 block text-[14px] leading-snug text-[var(--soft)]" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                        {o.why}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <AnimatePresence mode="wait" initial={false}>
          <motion.dl key={sel.id} className="mt-4 grid gap-3 rounded-2xl bg-[var(--panel)] p-4 text-white sm:grid-cols-3 sm:p-5" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            {[
              ["Runs where", sel.where],
              ["Stops when", sel.stops],
              ["Watch out", sel.watch],
            ].map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className={`text-[13px] ${k === "Watch out" ? "text-[#ffb59c]" : "text-white/50"}`}>{k}</dt>
                <dd className="mt-1 text-[14.5px] leading-snug text-white/90">{v}</dd>
              </div>
            ))}
          </motion.dl>
        </AnimatePresence>
      </div>
    </Plate>
  );
}

/* ───────────── 5.2: parallel work, one review lane ───────────── */

function ReviewQueue() {
  const { ref, p, replay } = usePlay<HTMLDivElement>(9000);
  const finishAt = (i: number) => 0.08 + i * 0.045;
  const reviewStart = 0.3;
  const reviewLen = 0.15;
  const finished = [0, 1, 2, 3, 4].filter((i) => p >= finishAt(i)).length;
  const landed = Math.max(0, Math.min(5, Math.floor((p - reviewStart) / reviewLen)));
  const inReview = p >= reviewStart && landed < Math.min(finished, 5) ? landed : -1;
  const queued = finished - landed - (inReview >= 0 ? 1 : 0);
  return (
    <Plate caption="An illustration of the timing. Simon Willison: “I can only focus on reviewing and landing one significant change at a time.” Parallel work is cheap; parallel review isn't.">
      <div ref={ref} className="p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] text-[var(--muted)]">Five sessions, five worktrees</p>
          <Replay onClick={replay} />
        </div>
        <div className="mt-3 grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="grid gap-2 rounded-2xl bg-[var(--panel)] p-3">
            {[0, 1, 2, 3, 4].map((i) => {
              const fill = Math.min(1, p / finishAt(i));
              const done = p >= finishAt(i);
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-white/[.05] px-3 py-2">
                  <span className="w-[74px] shrink-0 font-mono text-[12px] text-white/50">task-{i + 1}</span>
                  <span className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-white/10">
                    <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${fill * 100}%`, background: done ? C.passSoft : C.accent }} />
                  </span>
                  <span className={`w-[44px] shrink-0 text-right font-mono text-[11.5px] ${done ? "text-[#9fd8b8]" : "text-white/35"}`}>{done ? "ready" : "…"}</span>
                </div>
              );
            })}
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl bg-white p-3 ring-1 ring-[var(--rule)]">
              <p className="text-[13px] text-[var(--muted)]">Waiting for you</p>
              <div className="mt-2 flex min-h-9 flex-wrap gap-1.5">
                {Array.from({ length: Math.max(0, queued) }).map((_, k) => (
                  <motion.span key={k} layout className="rounded-md bg-[rgba(224,85,47,.09)] px-2 py-1 font-mono text-[12px] text-[var(--accent)] ring-1 ring-[var(--accent)]" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={POP}>
                    change
                  </motion.span>
                ))}
                {queued <= 0 ? <span className="text-[14px] text-[var(--muted)]">nothing</span> : null}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-3 ring-2 ring-[var(--ink)]">
              <p className="text-[13px] text-[var(--muted)]">Your review lane · one at a time</p>
              <p className="mt-1 min-h-6 font-mono text-[14px] text-[var(--ink)]">{inReview >= 0 ? `reviewing task-${inReview + 1}` : landed === 5 ? "all landed" : "idle"}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[var(--muted)]">Landed</span>
              {[0, 1, 2, 3, 4].map((k) => (
                <Check key={k} on={k < landed} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── 5.3: the headless command, flag by flag ───────────── */

const FLAGS = [
  { id: "diff", text: "gh pr diff 123 |", what: "Pass the diff in, so Claude doesn't have to go and get it." },
  { id: "p", text: "claude -p", what: "Runs non-interactively." },
  { id: "bare", text: "--bare", what: "Loads no hooks, skills, MCP servers or CLAUDE.md from the folder it runs in. In CI that folder is a repository you may not trust. Bare mode doesn't use your subscription login: it needs ANTHROPIC_API_KEY as a CI secret." },
  { id: "tools", text: '--tools "Read"', what: "Limits the built-in tools to reading files. No shell, no edits." },
  { id: "dis", text: '--disallowedTools "mcp__*"', what: "--tools covers built-in tools only. This keeps MCP tools out too." },
  { id: "mode", text: "--permission-mode dontAsk", what: "Denies every call that would otherwise wait for a human who isn't there." },
  { id: "json", text: "--output-format json", what: "Machine-readable output. stream-json is the other option." },
  { id: "prompt", text: '"Review this diff. Report only bugs and security problems, each with an input that triggers it."', what: "The task, with the severity bar from Module 4." },
] as const;

function HeadlessFlags() {
  const [id, setId] = useState<string>("tools");
  const [trap, setTrap] = useState(false);
  const reduce = useReducedMotion();
  const f = FLAGS.find((x) => x.id === id);
  return (
    <Plate caption="Tap each part of the command. These flags were checked against the CLI reference in November 2026; run the Lab once in your own CI before you rely on it.">
      <div className="p-5 sm:p-8">
        <Panel title="terminal or CI">
          <div className="flex flex-wrap gap-1.5 px-3 py-4 sm:px-4">
            {FLAGS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => {
                  setId(x.id);
                  setTrap(false);
                }}
                aria-pressed={id === x.id && !trap}
                className={`gd-press min-h-11 rounded-lg px-2.5 py-2 text-left font-mono text-[13px] leading-snug [overflow-wrap:anywhere] ${id === x.id && !trap ? "bg-white text-[var(--ink)]" : "bg-white/[.06] text-white/80 ring-1 ring-white/10 hover:text-white"}`}
              >
                {x.text}
              </button>
            ))}
          </div>
        </Panel>
        <button
          type="button"
          onClick={() => setTrap(true)}
          aria-pressed={trap}
          className="gd-press mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 font-mono text-[13px] text-[var(--muted)] line-through decoration-[var(--accent)] border border-dashed border-[var(--rule-strong)] aria-pressed:text-[var(--accent)]"
        >
          --allowedTools
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={trap ? "trap" : id} className={`mt-4 rounded-2xl p-4 ring-1 ${trap ? "bg-[rgba(224,85,47,.07)] ring-[var(--accent)]" : "bg-white ring-[var(--rule)]"}`} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            {trap ? (
              <>
                <p className="font-mono text-[13px] text-[var(--accent)]">--allowedTools does not restrict anything</p>
                <p className="mt-1 text-[15.5px] leading-snug text-[var(--ink)]">
                  It lists tools that run without a prompt. The CLI reference: &ldquo;To restrict which tools are available, use <code className="gd-code">--tools</code> instead.&rdquo; Many tutorials get this wrong.
                </p>
              </>
            ) : f ? (
              <>
                <p className="font-mono text-[13px] text-[var(--muted)] [overflow-wrap:anywhere]">{f.text}</p>
                <p className="mt-1 text-[15.5px] leading-snug text-[var(--ink)]">{f.what}</p>
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </Plate>
  );
}

/* ───────────── 5.4: three things before an overnight loop ───────────── */

const BOUNDS = [
  { id: "stop", name: "The stop condition", what: "Something a script or /goal can check" },
  { id: "blast", name: "The blast radius", what: "Which folder it can touch. Its own worktree" },
  { id: "budget", name: "The budget", what: "Maximum iterations or spend, then it stops regardless" },
] as const;
type BoundId = (typeof BOUNDS)[number]["id"];

const BUDGET = 8;
const DONE_AT = 5;

function LoopBounds() {
  const [set, setSet] = useState<Record<BoundId, boolean>>({ stop: true, blast: true, budget: true });
  const { ref, p, replay } = usePlay<HTMLDivElement>(5200);
  const limit = set.stop ? DONE_AT : set.budget ? BUDGET : 12;
  const iter = Math.min(limit, Math.floor(p * 12) + 1);
  const ended = p >= 1 || iter >= limit;
  const outcome = !set.stop && !set.budget ? "Nothing stops it." : set.stop ? "Stops on its own condition." : "Stops on the budget, not on the work being done.";
  const good = set.stop && set.budget && set.blast;
  return (
    <Plate caption="An illustration with made-up iteration counts. The Lab's pass condition: the loop stops on its own condition, not on the budget.">
      <div ref={ref} className="p-5 sm:p-8">
        <p className="text-[14px] text-[var(--muted)]">Write these down first. Tap to cross one out.</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {BOUNDS.map((b) => (
            <button
              key={b.id}
              type="button"
              aria-pressed={set[b.id]}
              onClick={() => {
                setSet((s) => ({ ...s, [b.id]: !s[b.id] }));
                replay();
              }}
              className="gd-press flex min-h-[78px] items-start gap-3 rounded-xl bg-white px-3.5 py-3 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-[var(--ink)]"
            >
              <span className="mt-0.5">{set[b.id] ? <Check on /> : <Cross />}</span>
              <span>
                <span className={`block text-[15px] font-medium ${set[b.id] ? "text-[var(--ink)]" : "text-[var(--muted)] line-through"}`}>{b.name}</span>
                <span className="mt-0.5 block text-[13.5px] leading-snug text-[var(--soft)]">{b.what}</span>
              </span>
            </button>
          ))}
        </div>
        <Panel className="mt-5" title={set.blast ? "worktree: loop-task" : "folder: your whole project"} right={<Replay onClick={replay} light />}>
          <div className="px-4 py-4">
            <div className="flex flex-wrap gap-1.5" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, k) => {
                const reached = k < iter;
                const last = reached && k === iter - 1 && ended;
                return (
                  <motion.span
                    key={k}
                    className="flex size-8 items-center justify-center rounded-lg font-mono text-[12px]"
                    initial={false}
                    animate={{
                      backgroundColor: last ? (set.stop ? C.pass : C.accent) : reached ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.03)",
                      color: reached ? "#ffffff" : "rgba(255,255,255,.25)",
                    }}
                    style={{ boxShadow: set.budget && k === BUDGET - 1 ? `inset 0 0 0 1.5px ${C.accentSoft}` : undefined }}
                    transition={{ duration: 0.25 }}
                  >
                    {k + 1}
                  </motion.span>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-[12.5px] text-white/45">{set.budget ? `budget: ${BUDGET} iterations (outlined)` : "no budget"}</p>
            <motion.p className={`mt-2 text-[15px] ${good ? "text-[#9fd8b8]" : "text-[#ffb59c]"}`} initial={false} animate={{ opacity: ended ? 1 : 0.35 }}>
              {ended ? outcome : "running…"}
              {ended && !set.blast ? " And it could touch anything in the project." : ""}
            </motion.p>
          </div>
        </Panel>
      </div>
    </Plate>
  );
}

/* ───────────── 5.5: how long the prompt cache lasts ───────────── */

const CACHES = [
  { name: "Main conversation, on a subscription", mins: 60, label: "about an hour" },
  { name: "With an API key, a cloud provider, or usage credits", mins: 5, label: "about five minutes" },
  { name: "Subagents, even on a subscription", mins: 5, label: "the shorter cache" },
] as const;

function CacheWindow() {
  const [gap, setGap] = useState(12);
  const MAX = 75;
  return (
    <Plate caption="Long sessions re-read their whole context on every turn. When the prompt cache has expired, the next turn costs more. Drag to set the pause before your next turn.">
      <div className="p-5 sm:p-8">
        <label htmlFor="cache-gap" className="flex items-baseline justify-between gap-3 text-[15px] text-[var(--ink)]">
          <span>Minutes since your last turn</span>
          <span className="font-mono text-[22px]">{gap}</span>
        </label>
        <input id="cache-gap" type="range" min={0} max={MAX} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="mt-2 h-11 w-full accent-[var(--accent)]" />
        <ul className="mt-4 grid gap-3">
          {CACHES.map((c) => {
            const warm = gap <= c.mins;
            return (
              <li key={c.name} className="rounded-xl bg-white p-3.5 ring-1 ring-[var(--rule)]">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[15px] leading-snug text-[var(--ink)]">{c.name}</span>
                  <Tag tone={warm ? "pass" : "accent"} className="shrink-0">
                    {warm ? "cached" : "costs more"}
                  </Tag>
                </div>
                <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-[#e6e7e3]" aria-hidden="true">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-[rgba(46,158,106,.35)]" style={{ width: `${(c.mins / MAX) * 100}%` }} />
                  <motion.span className="absolute inset-y-[-2px] w-[3px] rounded-full bg-[var(--ink)]" initial={false} animate={{ left: `${(gap / MAX) * 100}%` }} transition={{ duration: 0.25, ease: EASE }} />
                </div>
                <p className="mt-1.5 text-[13px] text-[var(--muted)]">Lasts {c.label}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Plate>
  );
}

export const FIGURES: Figures = {
  ClockHero,
  SchedulerPicker,
  ReviewQueue,
  HeadlessFlags,
  LoopBounds,
  CacheWindow,
};

export function View() {
  return <ModulePage content={CONTENT} figures={FIGURES} />;
}

"use client";

// Module 8 · Your operating system. The eight setup steps as one stack, built in order; the failure log routing a
// root cause to the layer that fixes it; and the six monthly checks around a 30-minute cycle. All text is the module's.

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CONTENT } from "../content/your-os";
import { ModulePage, type Figures } from "../ModulePage";
import { C, Check, EASE, Plate, POP, Replay, SPRING, usePlay, useLoop } from "../kit";

const STEPS = [
  { what: "Vault and folder map", from: "Module 2, Lesson 2.1", done: "Claude files a test note in the right folder" },
  { what: "CLAUDE.md from the interview", from: "Lesson 2.2", done: "A fresh session states your priority correctly" },
  { what: "“How to check your work” section", from: "Module 4, Lesson 4.1", done: "The next “done” comes with check output" },
  { what: "Verifier subagent", from: "Lesson 4.2", done: "It has reviewed one real piece of work" },
  { what: "Sandbox and permission settings", from: "Module 6, Lesson 6.2", done: "You can explain every exclusion and allowed domain" },
  { what: "Guard hook and its tests", from: "Lesson 6.4", done: "All tests pass" },
  { what: "Skill and plugin ledger", from: "Lesson 6.3", done: "Every installed skill is listed with source, commit, and license" },
  { what: "One scheduled task", from: "Module 5, Lesson 5.1", done: "It has run three days in a row" },
] as const;

/* ───────────── hero: eight steps, one system ───────────── */

function StackHero() {
  const { ref, p, replay } = usePlay<HTMLDivElement>(4200);
  const n = Math.min(STEPS.length, Math.floor(p * (STEPS.length + 0.5)));
  return (
    <figure ref={ref} className="gd-plate p-4 sm:p-5" aria-label="The eight setup steps stack into one working system, each built on the one before.">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[13px] text-[var(--muted)]">your setup · {n} of 8</p>
        <Replay onClick={replay} />
      </div>
      <ol className="mt-3 flex flex-col-reverse gap-1.5">
        {STEPS.map((s, k) => {
          const on = k < n;
          return (
            <motion.li
              key={s.what}
              className="flex min-h-[38px] items-center gap-3 rounded-lg px-3 text-[14px]"
              initial={false}
              animate={{ opacity: on ? 1 : 0.18, y: on ? 0 : -14, backgroundColor: on ? (k === n - 1 ? C.accent : C.panel) : "#ffffff" }}
              style={{ marginInline: `${(STEPS.length - 1 - k) * 1.2}%` }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <span className={`w-5 shrink-0 font-mono text-[12px] ${on ? "text-white/60" : "text-[var(--muted)]"}`}>{k + 1}</span>
              <span className={`truncate ${on ? "text-white" : "text-[var(--muted)]"}`}>{s.what}</span>
            </motion.li>
          );
        })}
      </ol>
      <figcaption className="px-1 pb-1 pt-3 text-[14px] leading-relaxed text-[var(--muted)]">Install the kit&apos;s files in this order. Each step builds on the one before.</figcaption>
    </figure>
  );
}

/* ───────────── 8.1: build it in order ───────────── */

function AssemblyStack() {
  const [done, setDone] = useState(0);
  const reduce = useReducedMotion();
  const R = 22;
  const L = 2 * Math.PI * R;
  return (
    <Plate caption="Tick a step when its “Done when” is true. The next one opens only after it: don't install everything at once. A setup you understand beats a bigger one you don't.">
      <div className="p-5 sm:p-8">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 56 56" className="size-14 shrink-0" role="img" aria-label={`${done} of 8 steps done`}>
            <circle cx="28" cy="28" r={R} fill="none" stroke={C.rule} strokeWidth="5" />
            <motion.circle cx="28" cy="28" r={R} fill="none" stroke={done === 8 ? C.pass : C.accent} strokeWidth="5" strokeLinecap="round" transform="rotate(-90 28 28)" strokeDasharray={L} initial={false} animate={{ strokeDashoffset: L * (1 - done / 8) }} transition={SPRING} />
            <text x="28" y="33" textAnchor="middle" fontSize="14" fill={C.ink} className="font-mono">
              {done}/8
            </text>
          </svg>
          <p className="text-[16px] leading-snug text-[var(--ink)]">{done === 8 ? "Assembled. Every step proven, not just installed." : `Next: ${STEPS[done].what}`}</p>
        </div>
        <ol className="mt-6 grid gap-2">
          {STEPS.map((s, k) => {
            const ok = k < done;
            const next = k === done;
            const locked = k > done;
            return (
              <motion.li key={s.what} layout={!reduce} transition={SPRING}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setDone(ok ? k : k + 1)}
                  aria-pressed={ok}
                  className={`gd-press flex min-h-14 w-full items-start gap-3 rounded-xl px-4 py-3 text-left ring-1 disabled:cursor-not-allowed ${ok ? "bg-[rgba(46,158,106,.08)] ring-[var(--pass)]" : next ? "bg-white ring-2 ring-[var(--ink)]" : "bg-white/60 ring-[var(--rule)]"}`}
                >
                  <span className="mt-0.5">
                    <Check on={ok} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`flex flex-wrap items-baseline gap-x-2 text-[15.5px] font-medium ${locked ? "text-[var(--muted)]" : "text-[var(--ink)]"}`}>
                      <span className="font-mono text-[12.5px] text-[var(--muted)]">{k + 1}</span>
                      {s.what}
                      <span className="font-mono text-[12px] font-normal text-[var(--muted)]">{s.from}</span>
                    </span>
                    <AnimatePresence initial={false}>
                      {!locked ? (
                        <motion.span className="block overflow-hidden text-[14px] leading-snug text-[var(--soft)]" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={SPRING}>
                          Done when: {s.done}
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Plate>
  );
}

/* ───────────── 8.2: which layer the fix goes to ───────────── */

const CAUSES = [
  { id: "context", label: "Missing context", layer: 0 },
  { id: "rule", label: "Wrong rule", layer: null },
  { id: "check", label: "No check", layer: 1 },
  { id: "perm", label: "No permission limit", layer: 2 },
] as const;
const LAYERS = [
  { name: "CLAUDE.md or memory", module: "Module 3" },
  { name: "A check or a verifier", module: "Module 4" },
  { name: "Settings or a hook", module: "Module 6" },
] as const;

function RootCauseRouter() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const c = CAUSES[i];
  return (
    <Plate caption="The root cause line is the important one: it tells you which layer to change. Any root cause that appears twice needs a stronger fix, moved from words to a check or a permission.">
      <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 rounded-2xl bg-[var(--panel)] p-4 font-mono text-[13px] leading-[1.8] text-white/75">
          <p className="text-white">## YYYY-MM-DD · short title</p>
          <p>- What happened:</p>
          <p>- What Claude saw or assumed:</p>
          <p className="text-white">- Root cause:</p>
          <div className="my-2 grid grid-cols-2 gap-1.5 font-sans">
            {CAUSES.map((x, k) => (
              <button key={x.id} type="button" onClick={() => setI(k)} aria-pressed={i === k} className="gd-press relative min-h-11 rounded-lg px-2 text-[13.5px] text-white/65 ring-1 ring-white/12 aria-pressed:text-[var(--ink)]">
                {i === k ? <motion.span layoutId="cause-on" className="absolute inset-0 rounded-lg bg-white" transition={SPRING} /> : null}
                <span className="relative">{x.label.toLowerCase()}</span>
              </button>
            ))}
          </div>
          <p>- Fix: the rule, check, or permission that prevents it</p>
          <p>- Where the fix lives:</p>
        </div>
        <div className="min-w-0">
          <p className="text-[14px] text-[var(--muted)]">The layer to change</p>
          <ul className="mt-2 grid gap-2">
            {LAYERS.map((l, k) => {
              const on = c.layer === k;
              return (
                <motion.li key={l.name} className="flex min-h-[60px] items-center gap-3 rounded-xl px-4 py-3 ring-1" initial={false} animate={{ backgroundColor: on ? "rgba(224,85,47,.09)" : "#ffffff", scale: on ? 1.02 : 1, opacity: c.layer === null || on ? 1 : 0.5 }} style={{ ["--tw-ring-color" as string]: on ? C.accent : C.rule }} transition={reduce ? { duration: 0 } : POP}>
                  <motion.span className="size-2.5 shrink-0 rounded-full" initial={false} animate={{ backgroundColor: on ? C.accent : C.ruleStrong }} />
                  <span className="min-w-0 flex-1 text-[15.5px] text-[var(--ink)]">{l.name}</span>
                  <span className="font-mono text-[12.5px] text-[var(--muted)]">{l.module}</span>
                </motion.li>
              );
            })}
          </ul>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={c.id} className="mt-4 text-[15px] leading-relaxed text-[var(--ink)]" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
              {c.layer === null ? "The module's list doesn't route this one to a single layer. Write the fix as the template says: the rule, check, or permission that prevents it." : `${c.label} → ${LAYERS[c.layer].name.replace(/^[A-Z](?=[a-z])/, (ch) => ch.toLowerCase())} (${LAYERS[c.layer].module}).`}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── 8.3: thirty minutes, once a month ───────────── */

const MONTHLY = [
  { name: "Prune CLAUDE.md", text: "Remove rules that no longer apply and merge duplicates. If it's growing every month, something belongs in a skill or a project folder instead." },
  { name: "Review the failure log", text: "Any root cause that appears twice needs a stronger fix: move it from words to a check or a permission." },
  { name: "Re-audit changed skills and plugins", text: "Compare each against the commit in your ledger." },
  { name: "Run the guard's tests", text: "The suite from Lesson 6.4. Done when all tests pass." },
  { name: "Check usage", text: "Which work used the most? Is that where the value is?" },
  { name: "Read the release notes", text: "For Claude Code since last month. Features in research preview change." },
] as const;

function MonthlyCycle() {
  const { ref, t } = useLoop(MONTHLY.length, 2600);
  const [pick, setPick] = useState<number | null>(null);
  const i = pick ?? t;
  const m = MONTHLY[i];
  const R = 40;
  return (
    <Plate caption="Once a month, six checks, about 30 minutes. Tap a step.">
      <div ref={ref} className="grid items-center gap-6 p-5 sm:grid-cols-[minmax(0,280px)_minmax(0,1fr)] sm:p-8">
        <div className="relative mx-auto aspect-square w-full max-w-[280px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r={R} fill="none" stroke={C.rule} strokeWidth="1.2" />
            <motion.circle cx="50" cy="50" r={R} fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round" transform="rotate(-90 50 50)" strokeDasharray={2 * Math.PI * R} initial={false} animate={{ strokeDashoffset: 2 * Math.PI * R * (1 - (i + 1) / MONTHLY.length) }} transition={{ duration: 0.6, ease: EASE }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="gd-serif text-[44px] leading-none !text-[var(--ink)]">30</span>
            <span className="mt-1 text-[13px] text-[var(--muted)]">minutes a month</span>
          </div>
          {MONTHLY.map((s, k) => {
            const a = (k / MONTHLY.length) * Math.PI * 2 - Math.PI / 2;
            const on = k === i;
            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setPick(k)}
                aria-pressed={on}
                aria-label={s.name}
                className="gd-press absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-[14px] ring-1"
                style={{ left: `${50 + Math.cos(a) * R}%`, top: `${50 + Math.sin(a) * R}%` }}
              >
                <motion.span className="absolute inset-0 rounded-full" initial={false} animate={{ backgroundColor: on ? C.accent : k < i ? C.ink : "#ffffff" }} transition={SPRING} />
                <span className={`relative ${on || k < i ? "text-white" : "text-[var(--muted)]"}`}>{k + 1}</span>
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={m.name} className="min-w-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
            <p className="font-mono text-[13px] text-[var(--accent)]">Step {i + 1} of 6</p>
            <p className="mt-1 text-[21px] font-semibold tracking-[-0.015em] text-[var(--ink)]">{m.name}</p>
            <p className="mt-2 text-[16px] leading-relaxed text-[var(--body)]">{m.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Plate>
  );
}

export const FIGURES: Figures = {
  StackHero,
  AssemblyStack,
  RootCauseRouter,
  MonthlyCycle,
};

export function View() {
  return <ModulePage content={CONTENT} figures={FIGURES} />;
}

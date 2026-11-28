"use client";

// Module 7 · Beyond code. The team and its one rule, who checks whom, an average that hides a step, a month-end close
// that stops at every write, and a content pipeline whose feedback link is still missing. Everything shown is the
// module's own text; where a figure needs example data, its caption says so.

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CONTENT } from "../content/beyond-code";
import { ModulePage, type Figures } from "../ModulePage";
import { C, Check, EASE, Panel, Plate, POP, Replay, Seg, SPRING, Tag, useLoop } from "../kit";

/* ───────────── hero: five agents and a checker, each with its hard limit ───────────── */

const TEAM = [
  { name: "engineer", job: "Bugs, features, code review across our repositories", limit: "Works on a branch; never pushes to production, migrates a database, or touches secrets without approval" },
  { name: "analyst", job: "Sales, funnel, experiments, content performance", limit: "Read-only on production data" },
  { name: "researcher", job: "Primary-source research and fact-checking", limit: "Must not verify its own work" },
  { name: "secretary", job: "Drafts emails and messages, summaries, meeting prep", limit: "Drafts only; never sends" },
  { name: "marketer", job: "Video scripts, acquisition, copy", limit: "Drafts only; never posts or spends" },
  { name: "verifier", job: "The independent checker from Module 4", limit: "Checks the others, never its own work" },
] as const;

function TeamHero() {
  const { ref, t } = useLoop(TEAM.length, 2200);
  const [pick, setPick] = useState<number | null>(null);
  const i = pick ?? t;
  const a = TEAM[i];
  return (
    <figure ref={ref} className="gd-plate p-4 sm:p-5" aria-label="Five agents and a verifier around you, each with a narrow job and a hard limit.">
      <div className="relative mx-auto aspect-square w-full max-w-[320px]">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="50" r="36" fill="none" stroke={C.ruleStrong} strokeWidth="0.4" strokeDasharray="1.2 1.6" />
          {TEAM.map((_, k) => {
            const ang = (k / TEAM.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <motion.line
                key={k}
                x1="50"
                y1="50"
                x2={50 + Math.cos(ang) * 36}
                y2={50 + Math.sin(ang) * 36}
                stroke={C.accent}
                strokeWidth="0.6"
                initial={false}
                animate={{ pathLength: k === i ? 1 : 0, opacity: k === i ? 1 : 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            );
          })}
        </svg>
        <div className="absolute left-1/2 top-1/2 flex size-[64px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--ink)] text-[15px] font-semibold text-white shadow-[0_0_0_8px_rgba(224,85,47,.14)]">you</div>
        {TEAM.map((m, k) => {
          const ang = (k / TEAM.length) * Math.PI * 2 - Math.PI / 2;
          const on = k === i;
          return (
            <button
              key={m.name}
              type="button"
              onClick={() => setPick(k)}
              aria-pressed={on}
              className="gd-press absolute flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center rounded-full px-3 font-mono text-[12.5px] ring-1"
              style={{ left: `${50 + Math.cos(ang) * 36}%`, top: `${50 + Math.sin(ang) * 36}%` }}
            >
              <motion.span className="absolute inset-0 rounded-full" initial={false} animate={{ backgroundColor: on ? (m.name === "verifier" ? C.pass : C.accent) : "#ffffff" }} transition={SPRING} />
              <span className={`relative ${on ? "text-white" : "text-[var(--ink)]"}`}>{m.name}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={a.name} className="mt-3 rounded-xl bg-[var(--panel)] px-4 py-3.5 text-white" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={SPRING}>
          <p className="font-mono text-[13px] text-white/50">agents/{a.name}.md</p>
          <p className="mt-1 text-[15px] leading-snug text-white/85">{a.job}</p>
          <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[14.5px] leading-snug text-[#ffb59c]">{a.limit}</p>
        </motion.div>
      </AnimatePresence>
      <figcaption className="px-1 pb-1 pt-3 text-[14px] leading-relaxed text-[var(--muted)]">All six are in the kit under claude/agents/. Tap one to see its limit.</figcaption>
    </figure>
  );
}

/* ───────────── 7.1: the agent that writes never checks ───────────── */

const DRAFTERS = ["engineer", "analyst", "researcher", "secretary", "marketer"] as const;

function DraftCheckGraph() {
  const [d, setD] = useState<(typeof DRAFTERS)[number]>("analyst");
  const reduce = useReducedMotion();
  const checkers = d === "researcher" ? ["verifier"] : ["researcher", "verifier"];
  return (
    <Plate caption="The researcher or the verifier checks the others, and neither checks its own work. Pick who drafted.">
      <div className="p-5 sm:p-8">
        <p className="text-[14px] text-[var(--muted)]">Drafted by</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {DRAFTERS.map((k) => (
            <button key={k} type="button" onClick={() => setD(k)} aria-pressed={d === k} className="gd-press min-h-11 rounded-full bg-white px-4 font-mono text-[13.5px] text-[var(--soft)] ring-1 ring-[var(--rule)] aria-pressed:bg-[var(--ink)] aria-pressed:text-white aria-pressed:ring-[var(--ink)]">
              {k}
            </button>
          ))}
        </div>
        <div className="mt-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <motion.div key={d} className="rounded-2xl bg-[var(--panel)] px-4 py-4 text-white" initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
            <p className="font-mono text-[13px] text-white/50">writes</p>
            <p className="mt-1 text-[18px] font-semibold">{d}</p>
          </motion.div>
          <div className="flex items-center justify-center py-1 sm:px-2" aria-hidden="true">
            <span className="h-6 w-px bg-[var(--accent)] sm:h-px sm:w-10" />
            <span className="text-[var(--accent)]">→</span>
          </div>
          <div className="grid gap-2">
            {["researcher", "verifier"].map((c) => {
              const ok = checkers.includes(c);
              return (
                <motion.div key={c} className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-2.5 ring-1" initial={false} animate={{ backgroundColor: ok ? "rgba(46,158,106,.1)" : "rgba(255,255,255,1)", opacity: ok ? 1 : 0.55 }} style={{ ["--tw-ring-color" as string]: ok ? C.pass : C.rule }} transition={SPRING}>
                  {ok ? <Check on /> : <span className="flex size-5 items-center justify-center rounded-full bg-[#e6e7e3] text-[11px] text-[var(--muted)]">–</span>}
                  <span className="font-mono text-[14px] text-[var(--ink)]">{c}</span>
                  <span className="ml-auto text-[13px] text-[var(--muted)]">{ok ? "checks it" : "can't check its own work"}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
        <p className="mt-5 text-[15.5px] leading-relaxed text-[var(--ink)]">
          {d === "engineer" ? "Code has tests. Business work needs the verifier." : "Most expensive mistakes would not have been code: a wrong number in a decision, a false claim in a video, a contract term misread."}
        </p>
      </div>
    </Plate>
  );
}

/* ───────────── 7.2: the average hides a step ───────────── */

// Relative heights from the lesson's words only: healthy for six days, then about a quarter of that for two.
const DAYS = [1, 1, 1, 1, 1, 1, 0.25, 0.25];
const MEAN = DAYS.reduce((a, b) => a + b, 0) / DAYS.length;

function AverageHides() {
  const [split, setSplit] = useState(true);
  const reduce = useReducedMotion();
  return (
    <Plate caption="The shape comes from the lesson's words (six healthy days, then about a quarter of that for two), not from real figures. The rule it led to: when you see an average, split the period and look for a step.">
      <div className="p-5 sm:p-8">
        <Seg
          id="avg-split"
          label="How you look at the month"
          value={split ? "split" : "avg"}
          onChange={(k) => setSplit(k === "split")}
          options={[
            ["avg", "The monthly average"],
            ["split", "Split by date"],
          ]}
        />
        <div className="relative mt-6 h-[200px] rounded-2xl bg-white px-3 pb-8 pt-4 ring-1 ring-[var(--rule)] sm:px-5">
          <div className="relative flex h-full items-end gap-1.5 sm:gap-2.5">
            {DAYS.map((v, k) => {
              const h = split ? v : MEAN;
              const low = split && v < 1;
              return (
                <div key={k} className="relative flex h-full flex-1 flex-col justify-end">
                  <motion.span className="block w-full rounded-t-md" initial={false} animate={{ height: `${h * 100}%`, backgroundColor: low ? C.accent : split ? C.ink : "#c4c7c2" }} transition={reduce ? { duration: 0 } : { ...SPRING, delay: k * 0.03 }} />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-[var(--muted)]">{k + 1}</span>
                </div>
              );
            })}
          </div>
          <motion.span className="pointer-events-none absolute inset-x-3 h-px border-t border-dashed border-[var(--accent)] sm:inset-x-5" initial={false} animate={{ bottom: `calc(2rem + ${MEAN} * (100% - 3rem))`, opacity: split ? 0.5 : 1 }} transition={SPRING} aria-hidden="true" />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={String(split)} className="mt-5 text-[16px] leading-relaxed text-[var(--ink)]" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            {split ? (
              <>
                <span className="font-semibold text-[var(--accent)]">Two different months.</span> Healthy for the first six days, then down to about a quarter of that.
              </>
            ) : (
              <>
                <span className="font-semibold">Looks steady.</span> One number for the month, and nothing to explain.
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </Plate>
  );
}

/* ───────────── 7.3: the month-end close stops at every write ───────────── */

const CLOSE = [
  { text: "Pull last month's payouts and fees from the payment processor. Show the totals and the query." },
  { text: "Pull last month's bank transactions. Match each one to a payout, an invoice, or a receipt." },
  { text: "List anything unmatched. Don't guess a category: mark it TBD and ask me.", tbd: true },
  { text: "Draft the journal entries for matched items. Show them as a table. Wait for my approval before writing.", gate: true },
  { text: "Check that every expense has a receipt file. List the missing ones." },
  { text: "Update the profit and loss, cash flow, and balance sheet from the approved entries." },
  { text: "Write the questions for the accountant: only what public guidance can't settle, one list." },
  { text: "Record the month as closed." },
];
const GATE = CLOSE.findIndex((s) => s.gate);

function MonthEndGates() {
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  const [approved, setApproved] = useState(false);
  const [run, setRun] = useState(0);
  const stopAt = approved ? CLOSE.length : GATE + 1;
  useEffect(() => {
    if (reduce || at >= stopAt) return;
    const id = window.setTimeout(() => setAt((n) => n + 1), at === 0 ? 400 : 700);
    return () => window.clearTimeout(id);
  }, [at, stopAt, reduce, run]);
  const shown = reduce ? stopAt : at;
  const waiting = !approved && shown >= GATE + 1;
  return (
    <Plate caption="The fictional example's procedure. Every write to the books needs a human yes: slower, on purpose.">
      <div className="p-5 sm:p-8">
        <Panel
          title="month-end close · example shop"
          right={
            <Replay
              light
              onClick={() => {
                setAt(0);
                setApproved(false);
                setRun((r) => r + 1);
              }}
            />
          }
        >
          <ol className="grid gap-1.5 px-3 py-4 sm:px-4">
            {CLOSE.map((s, k) => {
              const on = k < shown;
              return (
                <motion.li key={k} className="grid grid-cols-[26px_minmax(0,1fr)] items-start gap-3 rounded-lg px-2 py-1.5" initial={false} animate={{ opacity: on ? 1 : 0.25, backgroundColor: s.gate && on ? "rgba(224,85,47,.12)" : "rgba(0,0,0,0)" }} transition={SPRING}>
                  <span className="pt-0.5 font-mono text-[13px] text-white/45">{k + 1}</span>
                  <span className="text-[14.5px] leading-snug text-white/85">
                    {s.text}
                    {s.tbd && on ? (
                      <span className="ml-2 inline-block">
                        <Tag tone="dark">TBD · ask me</Tag>
                      </span>
                    ) : null}
                  </span>
                </motion.li>
              );
            })}
          </ol>
        </Panel>
        <div className="mt-4 flex min-h-14 flex-wrap items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {waiting ? (
              <motion.div key="wait" className="flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={POP}>
                <span className="text-[15px] text-[var(--ink)]">Claude stopped at step {GATE + 1}. The entries are a table, not yet in the books.</span>
                <button type="button" onClick={() => setApproved(true)} className="gd-press min-h-11 rounded-full bg-[var(--ink)] px-5 text-[15px] font-medium text-white">
                  Approve the entries
                </button>
              </motion.div>
            ) : approved && shown >= CLOSE.length ? (
              <motion.p key="done" className="flex items-center gap-3 text-[15px] text-[var(--ink)]" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
                <Check on /> Closed, with every write approved by you.
              </motion.p>
            ) : (
              <motion.p key="run" className="text-[15px] text-[var(--muted)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Running the procedure…
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── 7.4: automated before the checker was verified ───────────── */

const PIPE = [
  { k: "library", label: "Photo and video library" },
  { k: "build", label: "Python + FFmpeg, nightly at midnight", sub: "10 candidate videos" },
  { k: "score", label: "Claude scores frames", sub: "0 to 10 on three brand criteria, JSON" },
  { k: "post", label: "Top 3 scheduled", sub: "via a scheduling service" },
  { k: "views", label: "Views", sub: "what actually happened" },
] as const;

function BrokenLoop() {
  const [fix, setFix] = useState(false);
  const { ref, t } = useLoop(PIPE.length, 900);
  return (
    <Plate caption="The ranking formula has never been checked against actual views, and for one platform the performance data doesn't flow back yet. The fix on the list: import each post's results and test whether the score predicts them.">
      <div ref={ref} className="p-5 sm:p-8">
        <Seg
          id="broken-loop"
          label="The pipeline"
          value={fix ? "fix" : "now"}
          onChange={(k) => setFix(k === "fix")}
          options={[
            ["now", "As it runs today"],
            ["fix", "The fix on our list"],
          ]}
        />
        <div className="relative mt-6 rounded-2xl bg-[var(--panel)] p-4 text-white sm:p-5">
          <ol className="grid gap-2 sm:grid-cols-5 sm:gap-2.5">
            {PIPE.map((s, k) => {
              const on = k === t;
              return (
                <li key={s.k} className="relative">
                  <motion.div className="flex h-full min-h-[64px] flex-col justify-center rounded-xl px-3 py-2.5 ring-1" initial={false} animate={{ backgroundColor: on ? "rgba(224,85,47,.18)" : "rgba(255,255,255,.04)" }} style={{ ["--tw-ring-color" as string]: on ? C.accent : "rgba(255,255,255,.1)" }} transition={{ duration: 0.3 }}>
                    <span className="text-[14px] font-medium leading-snug">{s.label}</span>
                    {"sub" in s ? <span className="mt-0.5 text-[12.5px] leading-snug text-white/50">{s.sub}</span> : null}
                  </motion.div>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-white/15 px-3 py-2.5">
            <svg viewBox="0 0 120 20" className="h-5 w-24 shrink-0" aria-hidden="true">
              <path d="M116 10 H4" fill="none" stroke={fix ? C.passSoft : C.accent} strokeWidth="1.6" strokeDasharray={fix ? "0" : "6 6"} style={{ transition: "stroke .3s" }} />
              <path d="M10 4 L4 10 L10 16" fill="none" stroke={fix ? C.passSoft : C.accent} strokeWidth="1.6" />
              {!fix ? <path d="M56 3 L64 17" stroke={C.accent} strokeWidth="2" /> : null}
            </svg>
            <span className="text-[14px] leading-snug text-white/80">{fix ? "Views → back to the score: does it predict them?" : "Views never come back to the score."}</span>
          </div>
        </div>
      </div>
    </Plate>
  );
}

export const FIGURES: Figures = {
  TeamHero,
  DraftCheckGraph,
  AverageHides,
  MonthEndGates,
  BrokenLoop,
};

export function View() {
  return <ModulePage content={CONTENT} figures={FIGURES} />;
}

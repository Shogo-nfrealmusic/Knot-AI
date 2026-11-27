"use client";

// Module 4 · Verification design. One figure per idea: done as evidence, a reviewer that starts fresh, a severity bar,
// picking the gate, the Stop hook's loop, and testing the checker itself. Every rule shown is the module's; where a
// figure needs example data (which findings are style), the caption says it is an illustration.

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CONTENT } from "../content/verification";
import { ModulePage, type Figures } from "../ModulePage";
import { C, Check, Cross, EASE, FileGlyph, Panel, Plate, POP, Replay, Seg, SPRING, Tag, usePlay } from "../kit";

/* ───────────── hero: the writer says done, a fresh checker decides ───────────── */

const CLAIMS = [
  { claim: "Tests pass", verdict: "CONFIRMED", note: "test output, read directly" },
  { claim: "Build succeeds", verdict: "CONFIRMED", note: "exit code 0" },
  { claim: "Matches the spec", verdict: "WRONG", note: "one requirement missing" },
] as const;

function WriterCheckerHero() {
  const { ref, p, replay } = usePlay<HTMLDivElement>(7200);
  const said = p > 0.08;
  const handed = p > 0.22;
  const at = (i: number) => p > 0.36 + i * 0.13;
  const verdict = p > 0.8;
  return (
    <figure ref={ref} className="gd-plate p-3 sm:p-4" aria-label="The writer reports done. A separate checker reads the sources and returns a verdict for every claim; one wrong claim means FAIL.">
      <div className="grid gap-3">
        <Panel title="writer session" right={<Replay onClick={replay} light />}>
          <div className="px-4 py-4 font-mono text-[14px] leading-[1.7]">
            <p className="text-white/45">… works on the task …</p>
            <motion.p className="mt-1 text-white" initial={false} animate={{ opacity: said ? 1 : 0, y: said ? 0 : 6 }} transition={SPRING}>
              <span className="text-white/40">● </span>All done. Everything works.
            </motion.p>
          </div>
        </Panel>
        <div className="relative flex items-center justify-center py-1" aria-hidden="true">
          <span className="h-8 w-px bg-[var(--rule-strong)]" />
          <motion.span className="absolute top-0 size-2 rounded-full bg-[var(--accent)]" initial={false} animate={{ y: handed ? 28 : 0, opacity: handed && !verdict ? 1 : 0 }} transition={{ duration: 0.8, ease: EASE }} />
          <span className="absolute left-[calc(50%+14px)] text-[13px] text-[var(--muted)]">the work, not the reasoning</span>
        </div>
        <div className="rounded-xl bg-white p-4 ring-1 ring-[var(--rule)]">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[13px] text-[var(--muted)]">verifier · fresh context</span>
            <AnimatePresence>
              {verdict ? (
                <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={POP}>
                  <Tag tone="accent">FAIL</Tag>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>
          <ul className="mt-3 grid gap-2">
            {CLAIMS.map((c, i) => {
              const on = at(i);
              const wrong = c.verdict === "WRONG";
              return (
                <motion.li key={c.claim} className="flex items-center gap-3 rounded-lg px-2 py-1.5" initial={false} animate={{ backgroundColor: on && wrong ? "rgba(224,85,47,.08)" : "rgba(224,85,47,0)" }} transition={SPRING}>
                  {on ? wrong ? <Cross /> : <Check on /> : <Check on={false} />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] text-[var(--ink)]">{c.claim}</span>
                    <motion.span className="block text-[13px] text-[var(--muted)]" initial={false} animate={{ opacity: on ? 1 : 0 }}>
                      {c.note}
                    </motion.span>
                  </span>
                  <motion.span className={`font-mono text-[12px] ${wrong ? "text-[var(--accent)]" : "text-[#1f7a50]"}`} initial={false} animate={{ opacity: on ? 1 : 0 }}>
                    {c.verdict}
                  </motion.span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
      <figcaption className="px-2 pb-1 pt-3 text-[14px] leading-relaxed text-[var(--muted)]">An illustration. The rule is the kit&apos;s verifier: a verdict for every claim, and any unresolved mismatch means FAIL.</figcaption>
    </figure>
  );
}

/* ───────────── 4.1: "done" as a claim, or with its evidence ───────────── */

function DoneWithEvidence() {
  const [withCheck, setWithCheck] = useState(true);
  const reduce = useReducedMotion();
  return (
    <Plate caption={<>The last line of the section does the work: never report &ldquo;done&rdquo; without the check&apos;s output.</>}>
      <div className="p-5 sm:p-8">
        <Seg
          id="done-evidence"
          label="Your CLAUDE.md"
          value={withCheck ? "with" : "without"}
          onChange={(k) => setWithCheck(k === "with")}
          options={[
            ["without", "No check section"],
            ["with", "With “How to check your work”"],
          ]}
        />
        <Panel className="mt-6" title="claude · my-project">
          <div className="min-h-[214px] px-4 py-4 font-mono text-[14px] leading-[1.75]">
            <p className="text-white/45">… finishes the task …</p>
            <AnimatePresence mode="wait" initial={false}>
              {withCheck ? (
                <motion.div key="with" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
                  {[
                    ["npm test", "exit 0"],
                    ["npm run build", "exit 0"],
                  ].map(([cmd, out], i) => (
                    <motion.div key={cmd} className="mt-2 rounded-lg bg-white/[.05] px-3 py-2 ring-1 ring-white/10" initial={reduce ? false : { opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.12 + i * 0.12 }}>
                      <span className="text-white/40">$ </span>
                      {cmd}
                      <span className="float-right text-[#9fd8b8]">{out}</span>
                    </motion.div>
                  ))}
                  <motion.p className="mt-3 text-white" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <span className="text-white/40">● </span>Done. Both checks pass; output above.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.div key="without" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
                  <p className="mt-2 text-white">
                    <span className="text-white/40">● </span>Done. It works.
                  </p>
                  <p className="mt-4 font-sans text-[14px] italic text-white/45">Nothing to look at. You read every line, or you trust it.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Panel>
        <p className="mt-5 text-[16px] leading-relaxed text-[var(--ink)]">
          {withCheck ? (
            <>
              <span className="font-semibold text-[#1f7a50]">Evidence.</span> &ldquo;Done&rdquo; arrives with the output you can see.
            </>
          ) : (
            <>
              <span className="font-semibold text-[var(--accent)]">A claim.</span> Nothing in the reply you could check.
            </>
          )}
        </p>
      </div>
    </Plate>
  );
}

/* ───────────── 4.2: the one who writes doesn't grade ───────────── */

function FreshReviewer() {
  const [fresh, setFresh] = useState(true);
  const reduce = useReducedMotion();
  const rows = 9;
  return (
    <Plate caption="/code-review “reviews the diff in a fresh subagent that never saw your conversation. It isn't swayed by the reasoning that produced the code.”">
      <div className="p-5 sm:p-8">
        <Seg
          id="fresh"
          label="Who checks"
          value={fresh ? "fresh" : "same"}
          onChange={(k) => setFresh(k === "fresh")}
          options={[
            ["same", "Ask the same session"],
            ["fresh", "A fresh reviewer"],
          ]}
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-[var(--panel)] p-4 text-white">
            <p className="font-mono text-[13px] text-white/50">writer&apos;s context</p>
            <div className="mt-3 grid gap-1.5" aria-hidden="true">
              {Array.from({ length: rows }).map((_, i) => (
                <span key={i} className="h-[7px] rounded-full bg-white/15" style={{ width: `${55 + ((i * 37) % 40)}%` }} />
              ))}
            </div>
            <p className="mt-3 text-[13px] text-white/45">the task, the reasoning, the code it wrote</p>
          </div>
          <div className="relative rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)]">
            <p className="font-mono text-[13px] text-[var(--muted)]">{fresh ? "reviewer's context" : "same context, asked again"}</p>
            <div className="mt-3 grid gap-1.5" aria-hidden="true">
              {Array.from({ length: rows }).map((_, i) => {
                const keep = fresh ? i < 3 : true;
                return (
                  <motion.span
                    key={i}
                    className="h-[7px] rounded-full"
                    initial={false}
                    animate={{ width: keep ? `${fresh ? 40 + i * 18 : 55 + ((i * 37) % 40)}%` : "0%", backgroundColor: fresh ? (i === 0 ? C.accent : "#c4c7c2") : "#dcded9", opacity: keep ? 1 : 0 }}
                    transition={reduce ? { duration: 0 } : { ...SPRING, delay: i * 0.025 }}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-[13px] text-[var(--muted)]">{fresh ? "the diff and the primary sources, nothing else" : "everything the writer already believed"}</p>
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={String(fresh)} className="mt-5 flex items-start gap-3" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            {fresh ? <Check on /> : <Cross />}
            <p className="text-[16px] leading-relaxed text-[var(--ink)]">
              {fresh ? "It reads the code, the test output and the docs itself, and reports CONFIRMED, WRONG or UNVERIFIABLE." : "“Are you sure?” mostly gets you a confident repeat of the same answer."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Plate>
  );
}

/* ───────────── 4.3: the severity bar ───────────── */

// Thirty findings, as in the lesson. Which ones are style is made up for the picture; the filter is the prompt's.
const KINDS = ["style", "style", "naming", "style", "bug", "style", "format", "style", "naming", "style", "security", "style", "format", "style", "style", "naming", "style", "requirement", "style", "format", "style", "naming", "style", "style", "bug", "format", "style", "naming", "style", "style"] as const;
const COUNTS = new Set(["bug", "security", "requirement"]);

function SeverityBar() {
  const [bar, setBar] = useState(true);
  const reduce = useReducedMotion();
  const kept = KINDS.filter((k) => COUNTS.has(k)).length;
  return (
    <Plate caption="An illustration: thirty findings, mostly style. The filter is the prompt's: a finding counts only if it comes with a concrete input that triggers it.">
      <div className="p-5 sm:p-8">
        <Seg
          id="severity"
          label="Review prompt"
          value={bar ? "bar" : "none"}
          onChange={(k) => setBar(k === "bar")}
          options={[
            ["none", "No instructions"],
            ["bar", "With the severity bar"],
          ]}
        />
        <div className="mt-6 grid grid-cols-6 gap-2 sm:grid-cols-10" role="img" aria-label={bar ? `${kept} findings left, each with an input that triggers it` : "30 findings, mostly style"}>
          {KINDS.map((k, i) => {
            const real = COUNTS.has(k);
            const show = !bar || real;
            return (
              <motion.span
                key={i}
                className="flex aspect-square items-center justify-center rounded-lg font-mono text-[11px]"
                initial={false}
                animate={{ opacity: show ? 1 : 0.14, scale: show ? 1 : 0.8, backgroundColor: real ? (bar ? C.accent : "#ffffff") : "#ffffff", color: real && bar ? "#ffffff" : C.muted }}
                style={{ boxShadow: `0 0 0 1px ${real && bar ? C.accent : C.rule}` }}
                transition={reduce ? { duration: 0 } : { ...SPRING, delay: (i % 10) * 0.015 }}
              >
                {real ? "!" : ""}
              </motion.span>
            );
          })}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--rule)]">
            <p className="text-[13px] text-[var(--muted)]">Reported</p>
            <motion.p key={String(bar)} className="font-mono text-[28px] text-[var(--ink)]" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
              {bar ? kept : KINDS.length}
            </motion.p>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-[var(--rule)]">
            <p className="text-[13px] text-[var(--muted)]">What counts</p>
            <p className="mt-1 text-[15px] leading-snug text-[var(--ink)]">{bar ? "Bugs, security problems, unmet requirements. Each with an input." : "Anything the reviewer can think of."}</p>
          </div>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── 4.4: pick the gate ───────────── */

const GATES = [
  { id: "hook", gate: "Stop hook", cond: "Tests and build pass", how: "Your script runs when Claude tries to stop. Deterministic: the same input always gives the same answer.", watch: "It only knows what your script checks." },
  { id: "goal", gate: "/goal", cond: "The migration is finished and the report is written", how: "A separate evaluator model checks your condition after each turn.", watch: "The evaluator doesn't run commands or read files, so the evidence must appear in the conversation." },
  { id: "verifier", gate: "Verifier subagent", cond: "The numbers in this analysis are correct", how: "A fresh model reviews the work against sources.", watch: "Costs a model run; can be wrong." },
] as const;

function GatePicker() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const g = GATES[i];
  return (
    <Plate caption="Use the most deterministic gate that can express your condition. A script beats a model when a script can decide.">
      <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-stretch">
        <div>
          <p className="text-[14px] text-[var(--muted)]">Your condition</p>
          <ul className="mt-2 grid gap-2">
            {GATES.map((x, k) => (
              <li key={x.id}>
                <button
                  type="button"
                  onClick={() => setI(k)}
                  aria-pressed={i === k}
                  className="gd-press relative flex min-h-[60px] w-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-2 aria-pressed:ring-[var(--ink)]"
                >
                  <span className={`size-2.5 shrink-0 rounded-full transition-colors duration-300 ${i === k ? "bg-[var(--accent)]" : "bg-[var(--rule-strong)]"}`} />
                  <span className="text-[16px] leading-snug text-[var(--ink)]">&ldquo;{x.cond}&rdquo;</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <p className="text-[14px] text-[var(--muted)]">The gate</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-2xl bg-[var(--panel)] p-1.5">
            {GATES.map((x, k) => (
              <div key={x.id} className="relative flex min-h-12 items-center justify-center rounded-xl px-1 text-center">
                {i === k ? <motion.span layoutId="gate-on" className="absolute inset-0 rounded-xl bg-white" transition={SPRING} /> : null}
                <span className={`relative font-mono text-[12.5px] leading-tight sm:text-[13px] ${i === k ? "text-[var(--ink)]" : "text-white/55"}`}>{x.gate}</span>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.dl key={g.id} className="mt-4 grid flex-1 gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)]" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
              <div>
                <dt className="text-[13px] text-[var(--muted)]">How it decides</dt>
                <dd className="mt-0.5 text-[15.5px] leading-snug text-[var(--ink)]">{g.how}</dd>
              </div>
              <div className="border-t border-[var(--rule)] pt-3">
                <dt className="text-[13px] text-[var(--accent)]">Watch out</dt>
                <dd className="mt-0.5 text-[15.5px] leading-snug text-[var(--ink)]">{g.watch}</dd>
              </div>
            </motion.dl>
          </AnimatePresence>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── 4.4: what the Stop hook does, turn by turn ───────────── */

type Turn = { who: "claude" | "hook"; text: string; tone?: "fail" | "pass" | "stop" };

const FAILING: Turn[] = [
  { who: "claude", text: "Tries to finish its turn" },
  { who: "hook", text: "Tests fail → block · attempt 1 of 3", tone: "fail" },
  { who: "claude", text: "Reads the failing output, fixes, tries again" },
  { who: "hook", text: "Tests fail → block · attempt 2 of 3", tone: "fail" },
  { who: "claude", text: "Fixes, tries again" },
  { who: "hook", text: "Tests fail → block · attempt 3 of 3", tone: "fail" },
  { who: "claude", text: "Tries to finish again" },
  { who: "hook", text: "Lets it stop. The last failure is in the conversation.", tone: "stop" },
];
const PASSING: Turn[] = [
  { who: "claude", text: "Tries to finish its turn" },
  { who: "hook", text: "Tests pass → Claude may stop", tone: "pass" },
];

function StopHookLoop() {
  const [failing, setFailing] = useState(true);
  const turns = failing ? FAILING : PASSING;
  const { ref, p, replay } = usePlay<HTMLDivElement>(failing ? 6400 : 2200);
  const shown = Math.min(turns.length, Math.floor(p * (turns.length + 0.6)) + 1);
  return (
    <Plate caption="How require-tests.py behaves, per the hooks documentation: “decision”: “block” keeps Claude working and hands it the reason. The script keeps its own count, because Claude Code's cap of eight continuations resets whenever Claude calls a tool.">
      <div ref={ref} className="p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Seg
            id="stop-hook"
            label="The test suite"
            value={failing ? "fail" : "pass"}
            onChange={(k) => {
              setFailing(k === "fail");
              replay();
            }}
            options={[
              ["pass", "Tests pass"],
              ["fail", "Tests keep failing"],
            ]}
          />
          <Replay onClick={replay} />
        </div>
        <ol className="relative mt-6 grid gap-2">
          <span className="absolute bottom-4 left-[15px] top-4 w-px bg-[var(--rule)]" aria-hidden="true" />
          {turns.map((t, i) => {
            const on = i < shown;
            const hook = t.who === "hook";
            return (
              <motion.li
                key={`${failing}-${i}`}
                className="relative grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3"
                initial={false}
                animate={{ opacity: on ? 1 : 0.18, x: on ? 0 : -4 }}
                transition={SPRING}
              >
                <span className={`relative z-10 flex size-[31px] items-center justify-center rounded-full font-mono text-[11px] ring-1 ${hook ? "bg-[var(--panel)] text-white ring-[var(--panel)]" : "bg-white text-[var(--muted)] ring-[var(--rule-strong)]"}`}>{hook ? "hook" : "C"}</span>
                <span
                  className={`rounded-xl px-3.5 py-2.5 text-[15px] leading-snug ${
                    t.tone === "fail" ? "bg-[rgba(224,85,47,.08)] text-[var(--ink)] ring-1 ring-[var(--accent)]" : t.tone === "pass" ? "bg-[rgba(46,158,106,.1)] text-[var(--ink)] ring-1 ring-[var(--pass)]" : t.tone === "stop" ? "bg-[var(--panel)] text-white" : "bg-white text-[var(--body)] ring-1 ring-[var(--rule)]"
                  }`}
                >
                  {t.text}
                </span>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </Plate>
  );
}

/* ───────────── 4.5: test the checker before you trust it ───────────── */

const PROBES = [
  { id: "good", label: "A known-good result", must: "It must pass.", ok: true },
  { id: "bad", label: "A known-bad result", must: "It must fail.", ok: false },
  { id: "sneaky", label: "A wrong answer that still passes", must: "If you can think of one, the checker isn't done.", ok: null },
] as const;

function CheckerTest() {
  const [i, setI] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const probe = i === null ? null : PROBES[i];
  return (
    <Plate caption="Our security hook is checked this way: a suite of 20 harmless commands that must pass and 33 real attacks that must be blocked. The rebuilt guard passes all of it; the old one, run against the same lists, didn't.">
      <div className="p-5 sm:p-8">
        <p className="text-[14px] text-[var(--muted)]">Feed the checker</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {PROBES.map((x, k) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setI(k)}
              aria-pressed={i === k}
              className="gd-press flex min-h-[64px] items-center gap-3 rounded-xl bg-white px-4 py-3 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-2 aria-pressed:ring-[var(--ink)]"
            >
              <FileGlyph accent={x.ok === false} className="h-8 w-[26px]" />
              <span className="text-[15px] leading-snug text-[var(--ink)]">{x.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-5 grid items-center gap-4 rounded-2xl bg-[var(--panel)] p-4 text-white sm:grid-cols-[1fr_auto_1fr] sm:p-5">
          <p className="font-mono text-[13px] text-white/50">{probe ? probe.label.toLowerCase() : "nothing yet"}</p>
          <div className="mx-auto flex h-12 items-center rounded-xl bg-white/[.07] px-4 font-mono text-[13px] text-white/80 ring-1 ring-white/15">your check</div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={String(i)} className="flex items-center gap-3 sm:justify-end" initial={reduce ? false : { opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
              {probe ? (
                <>
                  {probe.ok === true ? <Check on size="size-6" /> : probe.ok === false ? <Cross size="size-6" /> : <span className="flex size-6 items-center justify-center rounded-full bg-[#f0b49f] font-mono text-[13px] font-bold text-[var(--ink)]">?</span>}
                  <span className="text-[15px] leading-snug text-white">{probe.must}</span>
                </>
              ) : (
                <span className="text-[14px] text-white/45">Pick one above.</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Suite n={20} label="harmless commands" verdict="not refused" tone={C.pass} />
          <Suite n={33} label="real attacks" verdict="refused" tone={C.accent} />
        </div>
      </div>
    </Plate>
  );
}

function Suite({ n, label, verdict, tone }: { n: number; label: string; verdict: string; tone: string }) {
  const { ref, p } = usePlay<HTMLDivElement>(1600);
  return (
    <div ref={ref} className="rounded-xl bg-white p-4 ring-1 ring-[var(--rule)]">
      <p className="text-[15px] text-[var(--ink)]">
        <span className="font-mono text-[20px]">{n}</span> {label} <span className="text-[var(--muted)]">· {verdict}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-1" aria-hidden="true">
        {Array.from({ length: n }).map((_, k) => (
          <motion.span key={k} className="size-[11px] rounded-[3px]" initial={false} animate={{ backgroundColor: p > k / n ? tone : "#e6e7e3" }} transition={{ duration: 0.2 }} />
        ))}
      </div>
    </div>
  );
}

export const FIGURES: Figures = {
  WriterCheckerHero,
  DoneWithEvidence,
  FreshReviewer,
  SeverityBar,
  GatePicker,
  StopHookLoop,
  CheckerTest,
};

export function View() {
  return <ModulePage content={CONTENT} figures={FIGURES} />;
}

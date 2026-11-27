"use client";

// Module 1 · Diagnostic, as the quiz it is. The questions, answers, reasons and the scoring table are the module's
// (content/diagnostic.ts). Answers stay in this browser; the score shows only after all twenty are answered,
// because the module says not to look until you've finished.

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LEDE, NOTES, PARTS, QUESTIONS, SCORE_LINE, adviceFor, scoreParts, startWith, totalScore, type Letter, type PartId, type Question, type Scores } from "../content/diagnostic";
import { MODULES } from "../data";
import { Inline } from "../Inline";
import { PrevNext } from "../ModulePage";
import { C, POP, SPRING } from "../kit";
import { parseAnswers, type Saved } from "../progress";
import { useStored } from "../store";

const KEY = "os-guide.diagnostic";
const LETTERS: Letter[] = ["A", "B", "C", "D"];
const moduleOf = (code: string) => MODULES.find((m) => m.code === code);

export function Diagnostic() {
  const [raw, save] = useStored(KEY);
  const saved = parseAnswers(raw, QUESTIONS.length);
  const { answers, revealed } = saved;
  const count = Object.keys(answers).length;
  const scores = scoreParts(answers);
  const write = (next: Saved) => save(JSON.stringify(next));
  const pick = (n: number, a: Letter) => {
    if (revealed) return;
    write({ answers: { ...answers, [n]: a }, revealed: false });
  };
  const reveal = () => {
    write({ answers, revealed: true });
    requestAnimationFrame(() => document.getElementById("score")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
  };
  const reset = () => {
    write({ answers: {}, revealed: false });
    requestAnimationFrame(() => document.getElementById("part-a")?.scrollIntoView({ block: "start" }));
  };
  const active = useActivePart();

  return (
    <div className="gd relative overflow-x-clip pb-10 pt-14">
      <MobileBar count={count} active={active} />
      <Header answers={answers} revealed={revealed} scores={scores} />

      <div className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
        <Rail answers={answers} revealed={revealed} scores={scores} active={active} count={count} />
        <div className="min-w-0 max-w-[760px]">
          {PARTS.map((p) => (
            <section key={p.id} id={`part-${p.id.toLowerCase()}`} className="scroll-mt-32 border-t border-[var(--rule)] pb-6 pt-16 first:border-t-0 first:pt-4 lg:scroll-mt-24">
              <h2 className="gd-h2 max-w-[22ch]">
                <span className="text-[var(--accent)]">{p.id}.</span> {p.title}
              </h2>
              <p className="mt-3 text-[15px] text-[var(--muted)]">
                Module {p.module} ·{" "}
                <Link className="gd-link" href={moduleOf(p.module)?.href ?? "/os/guide"}>
                  {moduleOf(p.module)?.title}
                </Link>
              </p>
              <ol className="mt-8 grid gap-6">
                {QUESTIONS.filter((q) => q.part === p.id).map((q) => (
                  <QuestionCard key={q.n} q={q} chosen={answers[q.n]} revealed={revealed} onPick={(a) => pick(q.n, a)} />
                ))}
              </ol>
            </section>
          ))}

          <Finish count={count} revealed={revealed} onReveal={reveal} />
          {revealed ? <Results scores={scores} onReset={reset} /> : null}
          <PrevNext code="1" />
        </div>
      </div>
    </div>
  );
}

/* ───────────── header and its live scoreboard ───────────── */

function Header({ answers, revealed, scores }: { answers: Saved["answers"]; revealed: boolean; scores: Scores }) {
  const reduce = useReducedMotion();
  const m = moduleOf("1");
  const enter = (d: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { ...SPRING, delay: d } });
  return (
    <header className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-x-14 px-5 pb-14 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
      <motion.nav {...enter(0)} aria-label="Breadcrumb" className="text-[15px] text-[var(--muted)] lg:col-start-1 lg:row-start-1">
        <Link href="/os/guide" className="inline-flex min-h-11 items-center hover:text-[var(--ink)]">
          Copilot OS guide
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)]">Module 1</span>
      </motion.nav>
      <motion.h1 {...enter(0.06)} className="gd-h1 mt-4 max-w-[16ch] lg:col-start-1 lg:row-start-2">
        <span className="gd-serif !text-[var(--accent)]">1</span> Diagnostic. <span className="gd-serif">{m?.line}</span>
      </motion.h1>
      <motion.div {...enter(0.18)} className="mt-10 min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1">
        <ScoreBoard answers={answers} revealed={revealed} scores={scores} />
      </motion.div>
      <motion.div {...enter(0.14)} className="gd-prose mt-8 lg:col-start-1 lg:row-start-3">
        {LEDE.map((t, i) => (
          <p key={i}>
            <Inline text={t} />
          </p>
        ))}
        <p className="!text-[16px] text-[var(--muted)]">Your answers stay in this browser.</p>
      </motion.div>
    </header>
  );
}

// Five parts, four cells each. Answered cells fill in ink; after the reveal they turn green (right) or orange (wrong).
function ScoreBoard({ answers, revealed, scores }: { answers: Saved["answers"]; revealed: boolean; scores: Scores }) {
  const total = totalScore(scores);
  const first = revealed ? startWith(scores) : null;
  const count = Object.keys(answers).length;
  return (
    <figure className="gd-plate p-3 sm:p-4" aria-label={revealed ? `Your score: ${total} out of 20` : `${count} of 20 answered`}>
      <div className="rounded-xl bg-[var(--panel)] p-4 text-white shadow-[0_24px_50px_-30px_rgba(21,23,26,.7)] sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[13px] text-white/50">{revealed ? "your score" : "answered"}</span>
          <span className="font-mono text-[30px] leading-none tracking-[-0.02em]">
            <motion.span key={revealed ? `t${total}` : `c${count}`} initial={{ opacity: 0.4, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={POP} className="inline-block">
              {revealed ? total : count}
            </motion.span>
            <span className="text-white/35">/20</span>
          </span>
        </div>
        <ul className="mt-5 grid gap-3">
          {PARTS.map((p) => {
            const qs = QUESTIONS.filter((q) => q.part === p.id);
            const lit = first?.id === p.id;
            return (
              <li key={p.id} className="grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-3">
                <span className={`font-mono text-[14px] ${lit ? "text-[#ffb59c]" : "text-white/55"}`}>{p.id}</span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] text-white/80">{p.title}</span>
                  <span className="mt-1.5 grid grid-cols-4 gap-1.5" aria-hidden="true">
                    {qs.map((q, k) => {
                      const a = answers[q.n];
                      const right = a === q.answer;
                      const fill = !a ? "rgba(255,255,255,0)" : !revealed ? "rgba(255,255,255,.85)" : right ? C.pass : C.accent;
                      return (
                        <motion.span
                          key={q.n}
                          className="h-[9px] rounded-full"
                          initial={false}
                          animate={{ backgroundColor: fill, scaleX: a ? 1 : 0.92 }}
                          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.22)" }}
                          transition={{ ...SPRING, delay: revealed ? k * 0.05 : 0 }}
                        />
                      );
                    })}
                  </span>
                </span>
                <span className="w-[38px] text-right font-mono text-[13px] text-white/60">{revealed ? `${scores[p.id]}/4` : `${qs.filter((q) => answers[q.n]).length}/4`}</span>
              </li>
            );
          })}
        </ul>
        <AnimatePresence initial={false}>
          {revealed ? (
            <motion.p key="start" className="mt-5 border-t border-white/10 pt-4 text-[15px] leading-snug text-white" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
              {first ? (
                <>
                  <span className="text-[#ffb59c]">Start with </span>Module {first.module} · {moduleOf(first.module)?.title}
                </>
              ) : (
                "No part scored 0 to 2. Follow each part's advice below."
              )}
            </motion.p>
          ) : (
            <motion.p key="wait" className="mt-5 border-t border-white/10 pt-4 text-[14px] leading-snug text-white/50" initial={false} exit={{ opacity: 0 }}>
              The score appears when all twenty are answered.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </figure>
  );
}

/* ───────────── a question ───────────── */

function QuestionCard({ q, chosen, revealed, onPick }: { q: Question; chosen?: Letter; revealed: boolean; onPick: (a: Letter) => void }) {
  const reduce = useReducedMotion();
  const right = chosen === q.answer;
  return (
    <li className="rounded-[20px] bg-white px-4 py-5 shadow-[0_0_0_1px_var(--rule),0_24px_60px_-48px_rgba(21,23,26,.5)] sm:px-6 sm:py-6">
      <p id={`q${q.n}`} className="text-[19px] font-medium leading-[1.5] tracking-[-0.01em] text-[var(--ink)]">
        <span className="mr-1.5 font-mono text-[16px] text-[var(--accent)]">{q.n}.</span>
        <Inline text={q.q} />
      </p>
      <div role="radiogroup" aria-labelledby={`q${q.n}`} className="mt-4 grid gap-2">
        {q.options.map((o, i) => {
          const L = LETTERS[i];
          const on = chosen === L;
          const isAnswer = revealed && L === q.answer;
          const isWrong = revealed && on && !right;
          const dim = revealed && !isAnswer && !isWrong;
          return (
            <button
              key={L}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={revealed}
              onClick={() => onPick(L)}
              className={`gd-press relative flex min-h-12 w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left ring-1 transition-[box-shadow,background-color,opacity] duration-300 disabled:cursor-default ${
                isAnswer ? "bg-[rgba(46,158,106,.08)] ring-2 ring-[var(--pass)]" : isWrong ? "bg-[rgba(224,85,47,.07)] ring-2 ring-[var(--accent)]" : on ? "bg-[var(--page)] ring-2 ring-[var(--ink)]" : "bg-white ring-[var(--rule)] hover:ring-[var(--ink)]"
              } ${dim ? "opacity-55" : ""}`}
            >
              <span
                className={`mt-[1px] flex size-7 shrink-0 items-center justify-center rounded-full font-mono text-[13px] transition-colors duration-300 ${
                  isAnswer ? "bg-[var(--pass)] text-white" : isWrong ? "bg-[var(--accent)] text-white" : on ? "bg-[var(--ink)] text-white" : "bg-[var(--page)] text-[var(--soft)] ring-1 ring-[var(--rule-strong)]"
                }`}
              >
                {L}
              </span>
              <span className="pt-0.5 text-[16.5px] leading-snug text-[var(--body)]">
                <Inline text={o} />
              </span>
            </button>
          );
        })}
      </div>
      <AnimatePresence initial={false}>
        {revealed ? (
          <motion.div key="why" className="overflow-hidden" initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={SPRING}>
            <p className="mt-4 border-l-2 pl-4 text-[16px] leading-relaxed text-[var(--body)]" style={{ borderColor: right ? C.pass : C.accent }}>
              <span className={`font-semibold ${right ? "text-[#1f7a50]" : "text-[var(--accent)]"}`}>{right ? "Right. " : `The answer is ${q.answer}. `}</span>
              <Inline text={q.why} />
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}

/* ───────────── finish, then the score ───────────── */

function Finish({ count, revealed, onReveal }: { count: number; revealed: boolean; onReveal: () => void }) {
  const ready = count === QUESTIONS.length;
  const R = 26;
  const CIRC = 2 * Math.PI * R;
  if (revealed) return null;
  return (
    <section className="mt-12 flex flex-col gap-5 rounded-[22px] bg-[var(--panel)] px-5 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 64 64" className="size-16 shrink-0" role="img" aria-label={`${count} of 20 answered`}>
          <circle cx="32" cy="32" r={R} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="5" />
          <motion.circle cx="32" cy="32" r={R} fill="none" stroke={ready ? C.pass : C.accent} strokeWidth="5" strokeLinecap="round" transform="rotate(-90 32 32)" strokeDasharray={CIRC} initial={false} animate={{ strokeDashoffset: CIRC * (1 - count / QUESTIONS.length) }} transition={SPRING} />
          <text x="32" y="37" textAnchor="middle" fontSize="15" fill="#fff" className="font-mono">
            {count}
          </text>
        </svg>
        <div>
          <p className="text-[22px] font-semibold tracking-[-0.02em]">{ready ? "All twenty answered." : `${QUESTIONS.length - count} to go.`}</p>
          <p className="mt-1 text-[15px] text-white/60">{ready ? "Now look." : "The answers stay hidden until you finish."}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReveal}
        disabled={!ready}
        className="gd-press min-h-12 rounded-full bg-white px-6 text-[16px] font-semibold text-[var(--ink)] disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/45"
      >
        Show my score
      </button>
    </section>
  );
}

function Results({ scores, onReset }: { scores: Scores; onReset: () => void }) {
  const total = totalScore(scores);
  const first = startWith(scores);
  const under = total < 8;
  return (
    <section id="score" className="mt-12 scroll-mt-32 rounded-[22px] bg-white px-5 py-8 shadow-[0_0_0_1px_var(--rule),0_30px_70px_-50px_rgba(21,23,26,.5)] sm:px-8 lg:scroll-mt-24">
      <h2 className="gd-h2">
        Your starting point. <span className="gd-serif">{total} of 20.</span>
      </h2>
      <p className="mt-3 text-[16px] text-[var(--muted)]">{SCORE_LINE}</p>
      <ul className="mt-6 grid gap-2">
        {PARTS.map((p) => {
          const s = scores[p.id as PartId];
          const mod = moduleOf(p.module);
          const lit = first?.id === p.id;
          return (
            <li key={p.id}>
              <Link
                href={mod?.href ?? "/os/guide"}
                className={`gd-press grid min-h-[64px] grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ${lit ? "bg-[rgba(224,85,47,.07)] ring-2 ring-[var(--accent)]" : "bg-[var(--page)] ring-[var(--rule)] hover:ring-[var(--ink)]"}`}
              >
                <span className="font-mono text-[15px] text-[var(--accent)]">{p.id}</span>
                <span className="min-w-0">
                  <span className="block text-[16px] font-medium leading-snug text-[var(--ink)]">
                    Module {p.module} · {mod?.title}
                  </span>
                  <span className="block text-[14.5px] text-[var(--soft)]">{adviceFor(s)}</span>
                </span>
                <span className="font-mono text-[18px] text-[var(--ink)]">{s}/4</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6 grid gap-3">
        {under ? (
          <p className="rounded-xl bg-[var(--panel)] px-4 py-3.5 text-[16px] leading-relaxed text-white [&_strong]:text-white">
            <Inline text={NOTES[0]} />
          </p>
        ) : null}
        <p className="rounded-xl border-l-2 border-[var(--accent)] bg-[var(--page)] px-4 py-3.5 text-[16px] leading-relaxed text-[var(--body)]">
          <Inline text={NOTES[1]} />
        </p>
      </div>
      <button type="button" onClick={onReset} className="gd-press mt-6 min-h-11 rounded-full px-5 text-[15px] text-[var(--soft)] ring-1 ring-[var(--rule)] hover:text-[var(--ink)]">
        Start over
      </button>
    </section>
  );
}

/* ───────────── progress: a rail on wide screens, a bar on phones ───────────── */

function useActivePart() {
  const [active, setActive] = useState<PartId>("A");
  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const first = PARTS.find((p) => seen.get(`part-${p.id.toLowerCase()}`));
        if (first) setActive(first.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    PARTS.forEach((p) => {
      const el = document.getElementById(`part-${p.id.toLowerCase()}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function Rail({ answers, revealed, scores, active, count }: { answers: Saved["answers"]; revealed: boolean; scores: Scores; active: PartId; count: number }) {
  return (
    <nav aria-label="Parts of the diagnostic" className="hidden lg:block">
      <div className="sticky top-24">
        <p className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Module 1</p>
        <ol className="relative mt-4">
          <span className="absolute bottom-3 left-[5px] top-3 w-px bg-[var(--rule)]" aria-hidden="true" />
          {PARTS.map((p) => {
            const on = p.id === active;
            const n = QUESTIONS.filter((q) => q.part === p.id && answers[q.n]).length;
            return (
              <li key={p.id}>
                <a href={`#part-${p.id.toLowerCase()}`} className="relative flex min-h-11 items-center gap-3 py-1 pl-6 text-[15px] leading-snug" aria-current={on ? "location" : undefined}>
                  <motion.span className="absolute left-0 top-1/2 -mt-[5.5px] size-[11px] rounded-full ring-2 ring-[var(--page)]" initial={false} animate={{ backgroundColor: n === 4 ? "#2e9e6a" : on ? "#e0552f" : "#c4c7c2", scale: on ? 1.25 : 1 }} transition={SPRING} />
                  <span className="w-[16px] shrink-0 font-mono text-[12.5px] text-[var(--muted)]">{p.id}</span>
                  <span className={`min-w-0 flex-1 ${on ? "font-medium text-[var(--ink)]" : "text-[var(--soft)]"}`}>{p.title}</span>
                  <span className="font-mono text-[12px] text-[var(--muted)]">{revealed ? `${scores[p.id]}/4` : `${n}/4`}</span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 text-[14px] text-[var(--muted)]">
          <span className="font-mono text-[var(--ink)]">{count}</span> of 20 answered
        </p>
      </div>
    </nav>
  );
}

function MobileBar({ count, active }: { count: number; active: PartId }) {
  const p = PARTS.find((x) => x.id === active) ?? PARTS[0];
  return (
    <div className="sticky top-14 z-30 border-b border-[var(--rule)] bg-[rgba(243,244,241,.88)] backdrop-blur-md lg:hidden">
      <div className="flex h-11 items-center justify-between gap-3 px-5 text-[14px]">
        <a href={`#part-${p.id.toLowerCase()}`} className="flex h-11 min-w-0 items-center gap-1.5">
          <span className="shrink-0 font-mono text-[var(--accent)]">{p.id}</span>
          <span className="truncate text-[var(--ink)]">{p.title}</span>
        </a>
        <span className="shrink-0 text-[var(--muted)]">
          <span className="font-mono text-[var(--ink)]">{count}</span>/20 answered
        </span>
      </div>
      <motion.span className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-[var(--accent)]" initial={false} animate={{ scaleX: count / QUESTIONS.length }} transition={SPRING} aria-hidden="true" />
    </div>
  );
}

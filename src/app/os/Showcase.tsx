"use client";

// Figures for the Copilot OS sales page, in the language of the Start here guide: paper, ink hairlines, one orange
// accent, springs on transform and opacity. The words inside are typeset from a real run on my Mac on Nov 28, 2026
// (a first time user starting a meal-prep business). Shortened lines are marked with an ellipsis.

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
const POP = { type: "spring", stiffness: 380, damping: 20 } as const;
const span = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

/** Progress 0 to 1 that plays once when the element is in view; replay() runs it again. */
function usePlay<T extends HTMLElement>(ms: number) {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const x = Math.min(1, (now - start) / ms);
          setP(x);
          if (x < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ms, run]);
  const replay = () => {
    setP(0);
    setRun((r) => r + 1);
  };
  return { ref, p, replay };
}

function Dots() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="size-2.5 rounded-full bg-white/20" />
      <span className="size-2.5 rounded-full bg-white/20" />
      <span className="size-2.5 rounded-full bg-white/20" />
    </span>
  );
}

function FileGlyph({ accent = false }: { accent?: boolean }) {
  return (
    <svg viewBox="0 0 30 36" className="h-9 w-[30px] shrink-0" aria-hidden="true">
      <path d="M1 1 h20 l8 8 v26 h-28 z" fill="#ffffff" stroke={accent ? "#e0552f" : "#15171a"} strokeWidth="1.4" />
      <path d="M21 1 v8 h8" fill="none" stroke={accent ? "#e0552f" : "#15171a"} strokeWidth="1.4" />
      <rect x="6" y="15" width="16" height="2.5" rx="1.2" fill="#dcded9" />
      <rect x="6" y="21" width="12" height="2.5" rx="1.2" fill="#dcded9" />
      <rect x="6" y="27" width="14" height="2.5" rx="1.2" fill="#dcded9" />
    </svg>
  );
}

function Tick({ on, delay = 0 }: { on: boolean; delay?: number }) {
  return (
    <motion.span
      className="flex size-5 shrink-0 items-center justify-center rounded-full"
      initial={false}
      animate={{ backgroundColor: on ? "#2e9e6a" : "#e6e7e3", scale: on ? 1 : 0.85 }}
      transition={{ ...POP, delay }}
    >
      <svg viewBox="0 0 20 20" className="size-3" aria-hidden="true">
        <path d="M4.5 10.5 l3.5 3.5 l7.5 -8" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.span>
  );
}

/* ───────────── hero: the first job, start to finish ───────────── */

const PROMPT =
  "I want to build a business: a weekly meal-prep service for busy parents in my neighborhood. Before you write anything, interview me one question at a time …";
const WEEK: [string, string][] = [
  ["Mon", "Check the permit rules first"],
  ["Tue", "Ask friends what they'd order"],
  ["Wed", "Compare three shared kitchens"],
  ["Thu", "Starter menu, cost per portion"],
  ["Fri", "Price for $1,000 a month profit"],
  ["Sat", "Read replies, pick a start date"],
  ["Sun", "Time a double batch"],
];

export function HeroRun() {
  const { ref, p, replay } = usePlay<HTMLDivElement>(9000);
  const reduce = useReducedMotion();
  const typed = PROMPT.slice(0, Math.round(PROMPT.length * span(p, 0.02, 0.26)));
  const caret = p > 0.01 && p < 0.27;
  const q = p > 0.32;
  const later = p > 0.44;
  const wrote = p > 0.52;
  const file = p > 0.58;
  const tickAt = (i: number) => p > 0.64 + i * 0.035;
  const flag = p > 0.92;

  return (
    <div ref={ref} className="relative">
      <div className="overflow-hidden rounded-2xl bg-[var(--panel)] text-white shadow-[0_40px_80px_-40px_rgba(21,23,26,.85)] ring-1 ring-black/30">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2 pl-4 pr-2">
          <span className="flex min-w-0 items-center gap-3">
            <Dots />
            <span className="min-w-0 [overflow-wrap:anywhere] font-mono text-xs text-white/45">~/my-business · claude</span>
          </span>
          <button type="button" onClick={replay} className="rounded-full px-3 py-1.5 text-xs text-white/55 ring-1 ring-white/15 transition-colors duration-300 hover:text-white">
            Replay
          </button>
        </div>
        <div className="min-h-[248px] px-4 py-4 font-mono text-[13px] leading-[1.7] sm:px-5 sm:text-sm">
          <p className="rounded-md bg-white/[.06] px-2 py-1.5 text-white/90">
            <span className="text-white/35">&gt; </span>
            {typed}
            {caret ? <span className="gd-caret ml-px inline-block h-[1.05em] w-[7px] translate-y-[3px] bg-[var(--accent)]" /> : null}
          </p>
          <motion.p className="mt-3 text-white" initial={false} animate={{ opacity: q ? 1 : 0, y: q ? 0 : 6 }} transition={SPRING}>
            <span className="text-white/45">● </span>
            <span className="font-semibold">Question 1 of about 6:</span> What draws you to meal prep?
          </motion.p>
          <motion.div className="my-3 flex items-center gap-3 font-sans text-xs text-white/35" initial={false} animate={{ opacity: later ? 1 : 0 }} transition={{ duration: 0.4 }}>
            <span className="h-px flex-1 bg-white/10" />
            two answers later
            <span className="h-px flex-1 bg-white/10" />
          </motion.div>
          <motion.p className="text-[#9fd8b8]" initial={false} animate={{ opacity: wrote ? 1 : 0, y: wrote ? 0 : 6 }} transition={SPRING}>
            <span className="text-white/45">● </span>I&apos;ve written the plan to first-week-plan.md.
          </motion.p>
        </div>
      </div>

      {/* the file it wrote, popping out of the window */}
      <motion.div
        className="relative z-10 -mt-6 ml-auto w-[92%] rounded-2xl bg-white p-4 shadow-[0_30px_60px_-30px_rgba(21,23,26,.55)] ring-1 ring-[var(--rule)] sm:w-[70%] sm:p-5"
        initial={false}
        animate={{ opacity: file ? 1 : 0, y: file ? 0 : 24, scale: file ? 1 : 0.96 }}
        transition={POP}
      >
        <div className="flex items-center gap-3">
          <FileGlyph accent />
          <div className="min-w-0">
            <p className="font-mono text-sm text-[var(--ink)]">first-week-plan.md</p>
            <p className="text-xs text-[var(--muted)]">7 daily tasks · written by Claude, not you</p>
          </div>
        </div>
        <ul className="mt-4 grid gap-1.5">
          {WEEK.map(([d, t], i) => {
            const first = i === 0;
            return (
              <motion.li
                key={d}
                className="flex items-center gap-3 rounded-lg px-2 py-1"
                initial={false}
                animate={{
                  backgroundColor: first && flag ? "rgba(224,85,47,.09)" : "rgba(224,85,47,0)",
                  boxShadow: first && flag ? "0 0 0 1.5px #e0552f" : "0 0 0 0px rgba(224,85,47,0)",
                }}
                transition={SPRING}
              >
                <Tick on={tickAt(i)} />
                <span className="w-8 shrink-0 font-mono text-xs text-[var(--muted)]">{d}</span>
                <span className={`min-w-0 [overflow-wrap:anywhere] text-sm ${first ? "font-semibold text-[var(--ink)]" : "text-[var(--body)]"}`}>{t}</span>
              </motion.li>
            );
          })}
        </ul>
        <motion.p
          className="mt-3 text-xs font-medium text-[var(--accent)]"
          initial={false}
          animate={{ opacity: flag ? 1 : 0, y: flag || reduce ? 0 : 4 }}
          transition={SPRING}
        >
          Cooked meals likely need a permitted kitchen. Don&apos;t take money yet.
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ───────────── the three steps, drawn ───────────── */

export function StepArt({ i }: { i: 0 | 1 | 2 }) {
  const { ref, p } = usePlay<HTMLDivElement>(2600);
  const on = (a: number) => p > a;
  return (
    <div ref={ref} className="gd-plate relative aspect-[16/10] overflow-hidden">
      {i === 0 ? (
        <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden="true">
          <rect x="40" y="44" width="400" height="212" rx="14" fill="#14161a" />
          <circle cx="64" cy="66" r="5" fill="#fff" opacity=".18" />
          <circle cx="82" cy="66" r="5" fill="#fff" opacity=".18" />
          <circle cx="100" cy="66" r="5" fill="#fff" opacity=".18" />
          <text x="64" y="122" className="font-mono" fontSize="16" fill="#fff" opacity=".4">$</text>
          <text x="84" y="122" className="font-mono" fontSize="16" fill="#fff">curl … | bash</text>
          <rect x="64" y="146" width={230 * span(p, 0.15, 0.6)} height="8" rx="4" fill="#fff" opacity=".14" />
          <rect x="64" y="166" width={180 * span(p, 0.3, 0.75)} height="8" rx="4" fill="#fff" opacity=".14" />
          <motion.g initial={false} animate={{ opacity: on(0.8) ? 1 : 0 }} transition={{ duration: 0.4 }}>
            <text x="64" y="220" className="font-mono" fontSize="16" fill="#9fd8b8">✓ Claude Code installed</text>
          </motion.g>
        </svg>
      ) : null}
      {i === 1 ? (
        <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden="true">
          <rect x="40" y="40" width="400" height="220" rx="14" fill="#14161a" />
          <motion.g initial={false} animate={{ opacity: on(0.1) ? 1 : 0, y: on(0.1) ? 0 : 8 }} transition={SPRING}>
            <text x="66" y="92" className="font-mono" fontSize="15" fill="#e0552f">?</text>
            <text x="86" y="92" fontSize="16" fontWeight="600" fill="#fff">What draws you to meal prep?</text>
          </motion.g>
          <motion.g initial={false} animate={{ opacity: on(0.35) ? 1 : 0, y: on(0.35) ? 0 : 8 }} transition={SPRING}>
            <rect x="290" y="112" width="124" height="34" rx="10" fill="#fff" opacity=".1" />
            <text x="400" y="134" textAnchor="end" fontSize="14" fill="#fff" opacity=".55">your answer</text>
          </motion.g>
          <motion.g initial={false} animate={{ opacity: on(0.6) ? 1 : 0, y: on(0.6) ? 0 : 8 }} transition={SPRING}>
            <text x="66" y="186" className="font-mono" fontSize="15" fill="#e0552f">?</text>
            <text x="86" y="186" fontSize="16" fontWeight="600" fill="#fff">How much time and money can you put in?</text>
          </motion.g>
          <motion.g initial={false} animate={{ opacity: on(0.85) ? 1 : 0, y: on(0.85) ? 0 : 8 }} transition={SPRING}>
            <rect x="240" y="206" width="174" height="34" rx="10" fill="#fff" opacity=".1" />
            <text x="400" y="228" textAnchor="end" fontSize="14" fill="#fff" opacity=".75">8 hours a week, $500</text>
          </motion.g>
        </svg>
      ) : null}
      {i === 2 ? (
        <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden="true">
          <path d="M60 64 h74 l18 18 h272 v156 h-364 z" fill="#ffffff" stroke="#15171a" strokeWidth="1.4" />
          <text x="78" y="104" className="font-mono" fontSize="13" fill="#868b92">my-business/</text>
          <motion.g initial={false} animate={{ opacity: on(0.25) ? 1 : 0, y: on(0.25) ? 0 : 16, scale: on(0.25) ? 1 : 0.9 }} transition={POP} style={{ transformOrigin: "176px 170px" }}>
            <path d="M126 124 h56 l16 16 v74 h-72 z" fill="#ffffff" stroke="#e0552f" strokeWidth="1.6" />
            <path d="M182 124 v16 h16" fill="none" stroke="#e0552f" strokeWidth="1.6" />
            <rect x="138" y="156" width="46" height="5" rx="2.5" fill="#dcded9" />
            <rect x="138" y="170" width="36" height="5" rx="2.5" fill="#dcded9" />
            <rect x="138" y="184" width="42" height="5" rx="2.5" fill="#dcded9" />
            <text x="220" y="164" className="font-mono" fontSize="14" fill="#15171a">first-week-plan.md</text>
            <text x="220" y="186" fontSize="12.5" fill="#e0552f">written by Claude, not you</text>
          </motion.g>
        </svg>
      ) : null}
    </div>
  );
}

/* ───────────── the plan, typeset as the file it wrote ───────────── */

export function PlanDoc() {
  const { ref, p } = usePlay<HTMLDivElement>(2200);
  const show = p > 0.15;
  return (
    <div ref={ref} className="rounded-2xl bg-white p-5 text-[var(--ink)] shadow-[0_30px_60px_-34px_rgba(0,0,0,.7)] sm:p-6">
      <div className="flex items-center gap-3 border-b border-[var(--rule)] pb-3">
        <FileGlyph accent />
        <p className="font-mono text-sm">first-week-plan.md</p>
      </div>
      <motion.div
        className="mt-4 rounded-xl bg-[rgba(224,85,47,.08)] p-4 ring-[1.5px] ring-[var(--accent)]"
        initial={false}
        animate={{ opacity: show ? 1 : 0.3, scale: show ? 1 : 0.98 }}
        transition={SPRING}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">The most important point</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--body)]">Cottage food law likely doesn&apos;t cover cooked meals. Check permits Monday. Free tastings only until then.</p>
      </motion.div>
      <ul className="mt-4 grid gap-2 text-sm">
        {WEEK.slice(1, 6).map(([d, t], i) => (
          <motion.li
            key={d}
            className="flex gap-3"
            initial={false}
            animate={{ opacity: p > 0.3 + i * 0.1 ? 1 : 0, x: p > 0.3 + i * 0.1 ? 0 : -6 }}
            transition={SPRING}
          >
            <span className="w-8 shrink-0 font-mono text-xs leading-5 text-[var(--muted)]">{d}</span>
            <span className="text-[var(--body)]">{t}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

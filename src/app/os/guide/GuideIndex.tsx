"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { MODULES, TOTAL_CHECKS } from "./data";
import { useDone } from "./store";

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

// The contents as a route: one line through nine stops, 0 to 8. Start here shows how far the reader got.
export function GuideIndex() {
  const reduce = useReducedMotion();
  const [done] = useDone();
  return (
    <div className="gd relative overflow-x-clip pb-24 pt-14">
      <header className="mx-auto max-w-[1080px] px-5 pb-6 pt-12 sm:px-8 sm:pt-20">
        <motion.h1 className="gd-h1 max-w-[14ch]" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.05 }}>
          The Copilot OS guide. <span className="gd-serif">Nine modules, one setup.</span>
        </motion.h1>
        <motion.div className="gd-prose mt-8" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.12 }}>
          <p>
            Never opened a terminal? Begin with <strong>Start here</strong>. If Claude Code already runs on your computer, go straight to{" "}
            <Link className="gd-link" href="/os/guide/second-brain">
              Module 2
            </Link>
            . The{" "}
            <Link className="gd-link" href="/os/guide/diagnostic">
              diagnostic
            </Link>{" "}
            is optional: take it now or after Module 3 to see which module to open next. Lessons marked Advanced go into Git and settings files,
            and can wait.
          </p>
        </motion.div>
      </header>

      <ol className="relative mx-auto mt-6 grid max-w-[1080px] gap-3 px-5 sm:px-8">
        <motion.span
          className="absolute bottom-10 left-[41px] top-10 w-px origin-top bg-[var(--rule-strong)] sm:left-[53px]"
          initial={reduce ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          aria-hidden="true"
        />
        {MODULES.map((m, i) => {
          const first = m.code === "0";
          return (
            <motion.li key={m.code} initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: 0.25 + i * 0.05 }}>
              <Link
                href={m.href}
                className="gd-press group -mx-3 flex gap-5 rounded-2xl bg-white px-3 py-5 shadow-[0_0_0_1px_var(--rule),0_24px_50px_-36px_rgba(21,23,26,.45)] hover:shadow-[0_0_0_1px_var(--ink),0_24px_50px_-36px_rgba(21,23,26,.45)] sm:gap-7 sm:px-4"
              >
                <span
                  className={`relative z-10 flex size-[44px] shrink-0 items-center justify-center rounded-full font-mono text-[15px] ring-1 transition-colors duration-300 ${first ? "bg-[var(--accent)] text-white ring-[var(--accent)]" : "bg-[var(--page)] text-[var(--ink)] ring-[var(--rule-strong)] group-hover:bg-[var(--ink)] group-hover:text-white group-hover:ring-[var(--ink)]"}`}
                >
                  {m.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="text-[20px] font-semibold tracking-[-0.02em] text-[var(--ink)] sm:text-[22px]">{m.title}</span>
                    {m.time ? <span className="text-[14px] text-[var(--muted)]">{m.time}</span> : null}
                  </span>
                  <span className="mt-1.5 block max-w-[58ch] text-[17px] leading-relaxed text-[var(--body)]">{m.line}</span>
                  <span className="mt-3 inline-flex items-center gap-2 text-[16px] font-medium text-[var(--accent)]">
                    {first && done.length > 0 ? `Continue · ${done.length} of ${TOTAL_CHECKS} ticked` : "Open the module"}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

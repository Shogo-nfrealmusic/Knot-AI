import type { CSSProperties } from "react";

// What Claude Code actually runs at our company. Each row starts "running" and flips to
// "checked" once, in order: the verifier, not the agent that did the work, signs it off.
const RUNS = [
  { when: "Every night", job: "Writes, renders and checks a short video for our business account" },
  { when: "Every morning", job: "Briefs me on new bookings and anything waiting on a decision" },
  { when: "Every month", job: "Drafts our books through the accounting API. Our accountant only signs off" },
  { when: "Every decision", job: "Writes down what we chose, why, and what we turned down" },
  { when: "Every change", job: "Gets checked by a second agent before it reaches me" },
];

export default function RunLog() {
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04),0_24px_48px_-24px_rgba(0,0,0,0.12)]">
      <style>{`
@keyframes run-dots { 0%,100% { opacity: .25 } 50% { opacity: 1 } }
@keyframes run-hide { to { opacity: 0; transform: translateY(-4px) } }
@keyframes run-show { from { opacity: 0; transform: translateY(4px) scale(.9) } to { opacity: 1; transform: none } }
.run-pending { animation: run-hide .3s cubic-bezier(.16,1,.3,1) both; animation-delay: var(--at) }
.run-pending i { animation: run-dots 1s ease-in-out infinite }
.run-pending i:nth-child(2) { animation-delay: .15s } .run-pending i:nth-child(3) { animation-delay: .3s }
.run-done { animation: run-show .5s cubic-bezier(.34,1.36,.64,1) both; animation-delay: var(--at) }
@media (prefers-reduced-motion: reduce) { .run-pending { display: none } .run-done { animation: none } }
`}</style>
      <figcaption className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5">
        <span className="text-[13px] font-medium text-neutral-900">What Claude Code runs at our company</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">2 people · Tokyo</span>
      </figcaption>
      <ol className="divide-y divide-neutral-100">
        {RUNS.map((run, i) => {
          const at = { "--at": `${900 + i * 450}ms` } as CSSProperties;
          return (
            <li key={run.when} className="grid grid-cols-[112px_1fr_72px] items-center gap-4 px-5 py-4 sm:grid-cols-[132px_1fr_84px]">
              <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--warm)]">{run.when}</span>
              <span className="text-pretty text-[14px] leading-snug text-neutral-700">{run.job}</span>
              <span className="relative flex h-6 items-center justify-end">
                <span aria-hidden className="run-pending absolute right-0 flex gap-1" style={at}>
                  <i className="size-1.5 rounded-full bg-neutral-400" />
                  <i className="size-1.5 rounded-full bg-neutral-400" />
                  <i className="size-1.5 rounded-full bg-neutral-400" />
                </span>
                <span className="run-done inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700" style={at}>
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                    <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Checked
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

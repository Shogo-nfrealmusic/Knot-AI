"use client";

import { useEffect, useRef, useState } from "react";

// "One a month" made visible: as you scroll, the months fill in and each one adds a job to the stack.
// The hours are an illustration for a small business, labelled as such, not a promise.
const MONTHS = [
  { m: "Month 1", job: "Setup + morning brief", hours: 2 },
  { m: "Month 2", job: "Inbox triage", hours: 3 },
  { m: "Month 3", job: "Books drafted", hours: 4 },
  { m: "Month 4", job: "Review replies", hours: 2 },
  { m: "Month 5", job: "Weekly report", hours: 2 },
  { m: "Month 6", job: "Content calendar", hours: 3 },
];

const TOTALS = MONTHS.map((_, i) => MONTHS.slice(0, i + 1).reduce((sum, x) => sum + x.hours, 0));

export default function Compound() {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    let eased = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const box = el.getBoundingClientRect();
      const target = Math.min(1, Math.max(0, (innerHeight * 0.85 - box.top) / (box.height * 0.9)));
      eased += (target - eased) * 0.12;
      setP((prev) => (Math.abs(prev - eased) > 0.001 ? eased : prev));
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const shown = p * MONTHS.length;
  const live = Math.min(MONTHS.length, Math.floor(shown + 0.0001));
  const hours = live > 0 ? TOTALS[live - 1]! : 0;
  const max = TOTALS[TOTALS.length - 1]!;

  return (
    <div ref={ref} className="grid gap-10 px-4 sm:px-10 lg:grid-cols-[1fr_1.3fr] lg:items-end lg:gap-16">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">It compounds</p>
        <h3 className="mt-4 text-balance text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
          One new job a month. <span className="font-serif font-normal italic text-neutral-500">They add up.</span>
        </h3>
        <p className="mt-5 max-w-[42ch] text-pretty text-[16px] leading-[1.75] text-neutral-600">
          Each month you pick the next job that eats your time. I build it, it joins the schedule, and it keeps running after that.
        </p>
        <div className="mt-8 flex gap-10 border-t border-neutral-200 pt-6">
          <div>
            <p className="text-[48px] font-medium leading-none tracking-[-0.04em] text-neutral-900 tabular-nums">{live}</p>
            <p className="mt-2 text-[13px] text-neutral-500">jobs running</p>
          </div>
          <div>
            <p className="text-[48px] font-medium leading-none tracking-[-0.04em] text-neutral-900 tabular-nums">
              {hours}
              <span className="text-[24px] text-neutral-400">h</span>
            </p>
            <p className="mt-2 text-[13px] text-neutral-500">back each week</p>
          </div>
        </div>
        <p className="mt-4 text-[12px] text-neutral-400">Illustration for a small business. Your jobs and hours will differ.</p>
      </div>

      <div className="su-panel p-6">
        <div className="flex h-[300px] items-end gap-3">
          {MONTHS.map((x, i) => {
            const v = Math.min(1, Math.max(0, shown - i));
            return (
              <div key={x.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-col justify-end" style={{ height: 240 }}>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--warm)] to-[#ffb38a]"
                    style={{ height: `${(TOTALS[i]! / max) * 100 * v}%`, opacity: 0.35 + 0.65 * v }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400">{x.m}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {MONTHS.map((x, i) => {
            const v = Math.min(1, Math.max(0, (shown - i) * 2));
            return (
              <div
                key={x.job}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[12px] text-neutral-700"
                style={{ opacity: 0.25 + 0.75 * v, transform: `translateY(${(1 - v) * 6}px)` }}
              >
                <span className="mr-1.5 text-[var(--warm)]">+</span>
                {x.job}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

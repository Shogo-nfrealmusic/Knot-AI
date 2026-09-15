"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT, type PanelProps } from "./marks";

// Real GA4 funnel exploration for book.tettyphotostudio.com, covering all of August 2026.
export const FUNNEL_PERIOD = "Aug 1 – Aug 31, 2026";

// Users at each step, as reported by GA4. Rates are computed from these counts.
const steps = [
  { name: "Visited site", users: 5332 },
  { name: "Viewed plans", users: 4418 },
  { name: "Viewed locations", users: 1305, leak: true },
  { name: "Opened booking", users: 1176 },
  { name: "Picked a date", users: 699 },
  { name: "Reached payment", users: 87, leak: true },
  { name: "Booked", users: 55 },
].map((step, i, all) => ({
  ...step,
  leak: step.leak ?? false,
  // Share of the previous step that made it here; null for the first step.
  rate: i === 0 ? null : (step.users / all[i - 1].users) * 100,
  share: (step.users / all[0].users) * 100,
}));

const overall = ((steps[steps.length - 1].users / steps[0].users) * 100).toFixed(2);
const fmt = (n: number) => n.toLocaleString("en-US");

const W = 700;
const H = 210;
const CY = H / 2;
const BAND = 176; // band height at 5,332 users; every other step is to scale
const COL = W / steps.length;
const heights = steps.map((step) => (step.users / steps[0].users) * BAND);

// One continuous band: flat within a step, an S-curve at the start of each column down to its count.
function bandPath() {
  let top = `M0 ${CY - heights[0] / 2}`;
  let bottom = "";
  heights.forEach((to, i) => {
    const from = i === 0 ? to : heights[i - 1];
    const x0 = i * COL;
    const x1 = x0 + COL;
    const [a, b, c] = [x0 + COL * 0.18, x0 + COL * 0.26, x0 + COL * 0.46];
    top += from === to ? `H${x1}` : `C${a} ${CY - from / 2} ${b} ${CY - to / 2} ${c} ${CY - to / 2}H${x1}`;
    const back = from === to ? `H${x0}` : `H${c}C${b} ${CY + to / 2} ${a} ${CY + from / 2} ${x0} ${CY + from / 2}`;
    bottom = back + bottom;
  });
  return `${top}V${CY + heights[heights.length - 1] / 2}${bottom}Z`;
}

const band = bandPath();
const AUTO_MS = 1800;

function RateChip({
  rate,
  leak,
  className,
  style,
}: {
  rate: number;
  leak: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        "whitespace-nowrap rounded-full border px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none tabular-nums",
        leak ? "border-orange-200 bg-orange-50 text-warm" : "border-neutral-200 bg-white text-neutral-500",
        className,
      )}
    >
      {rate.toFixed(1)}%
    </span>
  );
}

export default function FunnelPanel({ active, animate }: PanelProps) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  // Resting on the steepest leak is the most useful still frame.
  const [current, setCurrent] = useState(5);
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? current;
  const step = steps[shown];

  useEffect(() => {
    if (!animate || hovered !== null) return;
    const timer = setInterval(() => setCurrent((i) => (i + 1) % steps.length), AUTO_MS);
    return () => clearInterval(timer);
  }, [animate, hovered]);

  const reveal = (delay: number) =>
    active
      ? { opacity: 1, transition: reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay } }
      : { opacity: 0, transition: { duration: 0, delay: 0.75 } };

  // The tooltip only ever floats over the thin part of the band (from step 3 on), so it never
  // covers the tall first columns or the rate chips: right of the column early, left of it late.
  const tooltipStyle =
    shown >= 4
      ? { right: `calc(${((steps.length - shown) / steps.length) * 100}% + 6px)` }
      : { left: `calc(${(Math.max(shown + 1, 3) / steps.length) * 100}% + 6px)` };

  return (
    <div className="flex size-full items-center justify-center py-2 sm:py-8">
      <div
        className="w-full max-w-[760px] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        onMouseLeave={() => setHovered(null)}
      >
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-[13px] font-medium text-neutral-900">Booking funnel</p>
            <span className="hidden rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10px] leading-none text-neutral-500 sm:inline">
              7 steps
            </span>
          </div>
          <p className="flex shrink-0 items-baseline gap-1.5 text-[11px] text-neutral-500">
            <span className="font-mono text-[15px] tracking-[-0.03em] text-neutral-900 tabular-nums">{overall}%</span>
            visit → booked
          </p>
        </div>

        {/* Desktop: dub-style funnel band, every height to scale. */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-7 border-b border-neutral-200">
            {steps.map((s, i) => (
              <button
                key={s.name}
                type="button"
                tabIndex={active ? 0 : -1}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
                className={cn(
                  "relative flex min-w-0 flex-col items-start px-2 py-2.5 text-left outline-none transition-colors duration-300 lg:px-2.5",
                  i > 0 && "border-l border-neutral-200",
                  i === shown ? "bg-neutral-50" : "bg-white",
                )}
              >
                <span className="flex items-center gap-1 text-[10px] text-neutral-500">
                  <span className={cn("size-1 rounded-[1px]", s.leak ? "bg-warm" : "bg-blue-500/60")} />
                  Step {i + 1}
                </span>
                <span className="mt-1 min-h-[2lh] text-[11px] font-medium leading-tight text-neutral-900 lg:text-[12px]">
                  {s.name}
                </span>
                <span className="mt-1 font-mono text-[13px] leading-none tracking-[-0.03em] text-neutral-700 tabular-nums lg:text-[15px]">
                  {fmt(s.users)}
                </span>
                {i === shown ? (
                  <motion.span
                    layoutId={`${uid}-rail`}
                    className="absolute inset-x-0 -bottom-px h-px bg-neutral-900"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                ) : null}
              </button>
            ))}
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-y-0 bg-neutral-900/[0.025] transition-[left] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ left: `${(shown / steps.length) * 100}%`, width: `${100 / steps.length}%` }}
            />
            <svg viewBox={`0 0 ${W} ${H}`} fill="none" className="relative h-auto w-full" aria-hidden>
              <defs>
                <linearGradient id={`${uid}-fill`} x1="0" x2={W} y1="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
                <clipPath id={`${uid}-reveal`}>
                  <motion.rect
                    x={0}
                    y={0}
                    height={H}
                    initial={{ width: 0 }}
                    animate={
                      active
                        ? { width: W, transition: reduceMotion ? { duration: 0 } : { duration: 1.2, ease: EASE_OUT } }
                        : { width: 0, transition: { duration: 0, delay: 0.75 } }
                    }
                  />
                </clipPath>
              </defs>
              {steps.map((s, i) =>
                i > 0 ? <path key={s.name} d={`M${i * COL} 0V${H}`} stroke="#171717" strokeOpacity={0.06} /> : null,
              )}
              {steps.map((s, i) =>
                s.leak ? <rect key={s.name} x={i * COL} y={0} width={COL} height={H} fill="#e0552f" fillOpacity={0.05} /> : null,
              )}
              <g clipPath={`url(#${uid}-reveal)`}>
                <path d={band} stroke="#3B82F6" strokeOpacity={0.1} strokeWidth={12} strokeLinejoin="round" />
                <path d={band} stroke="#3B82F6" strokeOpacity={0.28} strokeWidth={5} strokeLinejoin="round" />
                <path d={band} fill={`url(#${uid}-fill)`} />
              </g>
            </svg>

            {/* Step-to-step rates, centred on the settled band past each column's S-curve. */}
            <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={reveal(0.5)}>
              {steps.map((s, i) =>
                s.rate === null ? null : (
                  <RateChip
                    key={s.name}
                    rate={s.rate}
                    leak={s.leak}
                    style={{ left: `${((i + 0.73) / steps.length) * 100}%` }}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                  />
                ),
              )}
            </motion.div>

            {/* Hover targets per column. */}
            <div className="absolute inset-0 grid grid-cols-7">
              {steps.map((s, i) => (
                <div key={s.name} onMouseEnter={() => setHovered(i)} />
              ))}
            </div>

            <motion.div
              className="pointer-events-none absolute top-2 w-[216px] rounded-lg border border-neutral-200 bg-white/95 text-[11px] shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)] backdrop-blur-sm transition-[left,right] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={tooltipStyle}
              initial={{ opacity: 0 }}
              animate={reveal(0.7)}
            >
              <div className="flex items-center justify-between gap-2 border-b border-neutral-100 px-2.5 py-1">
                <span className="truncate font-medium text-neutral-900">{step.name}</span>
                <span className="font-mono text-[10px] text-neutral-400">{shown + 1}/7</span>
              </div>
              <dl className="grid grid-cols-3 gap-2 px-2.5 py-1.5">
                {[
                  { label: "Users", value: fmt(step.users), warm: false },
                  { label: "Of visitors", value: `${step.share.toFixed(1)}%`, warm: false },
                  {
                    label: "From prev.",
                    value: step.rate === null ? "—" : `${step.rate.toFixed(1)}%`,
                    warm: step.leak,
                  },
                ].map((item) => (
                  <div key={item.label} className="min-w-0">
                    <dt className="truncate text-[10px] text-neutral-500">{item.label}</dt>
                    <dd className={cn("font-mono text-[12px] tabular-nums", item.warm ? "text-warm" : "text-neutral-900")}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>

        {/* Phones: the same counts as a bar list, bars to scale. */}
        <ol className="flex flex-col gap-0.5 p-2 sm:hidden">
          {steps.map((s, i) => (
            <li key={s.name} className="relative flex h-7 items-center gap-2 overflow-hidden rounded-md px-2.5">
              <motion.span
                aria-hidden
                className={cn("absolute inset-y-0 left-0 min-w-1 rounded-md", s.leak ? "bg-orange-100" : "bg-blue-100/80")}
                initial={{ width: "0%" }}
                animate={
                  active
                    ? {
                        width: `${s.share}%`,
                        transition: reduceMotion ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT, delay: i * 0.05 },
                      }
                    : { width: "0%", transition: { duration: 0, delay: 0.75 } }
                }
              />
              <span className="relative w-3 font-mono text-[10px] text-neutral-400">{i + 1}</span>
              <span className="relative min-w-0 flex-1 truncate text-[12px] text-neutral-800">{s.name}</span>
              {s.rate !== null ? <RateChip rate={s.rate} leak={s.leak} className="relative" /> : null}
              <span className="relative w-11 text-right font-mono text-[12px] text-neutral-900 tabular-nums">
                {fmt(s.users)}
              </span>
            </li>
          ))}
        </ol>

        <p className="truncate border-t border-neutral-200 px-4 py-2 font-mono text-[10px] text-neutral-400">
          GA4 · book.tettyphotostudio.com · {FUNNEL_PERIOD}
        </p>
      </div>
    </div>
  );
}

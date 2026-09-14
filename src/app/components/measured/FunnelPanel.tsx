"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ApertureMark, EASE_OUT, type PanelProps } from "./marks";

const W = 502;
const H = 269;
const HEAD = 56;
const CY = 166;
const COL = W / 4;

// Band heights are an illustrative shape, not counts. The one measured figure is the
// date → time drop: 118 → 72 is −39%. The dashed ghost is the shape after the fix.
const steps = [
  { name: "Plan", color: "#155DFC", from: 150, to: 118 },
  { name: "Date", color: "#9810FA", from: 118, to: 72 },
  { name: "Time", color: "#0891B2", from: 72, to: 60 },
  { name: "Deposit", color: "#059669", from: 60, to: 60 },
];
const ghost = [
  { from: 118, to: 98 },
  { from: 98, to: 88 },
  { from: 88, to: 88 },
];

type Segment = { x0: number; x1: number; from: number; to: number };

// Flat, then an S-curve between the two heights, then flat — dub's funnel band.
function knots(x0: number, x1: number) {
  const w = x1 - x0;
  return [x0 + w * 0.28, x0 + w * 0.5, x0 + w * 0.55, x0 + w * 0.78];
}

function outline(segments: Segment[]) {
  const top = segments
    .map(({ x0, x1, from, to }) => {
      const [a, b, c, d] = knots(x0, x1);
      return `H${a}C${b} ${CY - from / 2} ${c} ${CY - to / 2} ${d} ${CY - to / 2}H${x1}`;
    })
    .join("");
  const bottom = [...segments]
    .reverse()
    .map(({ x0, x1, from, to }) => {
      const [a, b, c, d] = knots(x0, x1);
      return `H${d}C${c} ${CY + to / 2} ${b} ${CY + from / 2} ${a} ${CY + from / 2}H${x0}`;
    })
    .join("");
  const first = segments[0];
  const last = segments[segments.length - 1];
  return `M${first.x0} ${CY - first.from / 2}${top}V${CY + last.to / 2}${bottom}Z`;
}

function Pill({ x, y, width, text, color }: { x: number; y: number; width: number; text: string; color: string }) {
  return (
    <g>
      <rect x={x - width / 2} y={y - 9} width={width} height={18} rx={9} fill="white" />
      <text
        x={x}
        y={y + 3.6}
        textAnchor="middle"
        fontSize={10}
        fontWeight={500}
        fill={color}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {text}
      </text>
    </g>
  );
}

function BookingWidget() {
  return (
    // Sits fully inside the panel: a deeper negative margin cropped its top edge and read as a bug.
    <div className="mt-5 hidden flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm sm:flex">
      <div className="flex flex-col rounded-lg border border-neutral-200 px-4 pb-3 pt-4">
        <div className="flex h-[84px] w-[184px] flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br from-neutral-700 to-neutral-950 p-3 text-white">
          <ApertureMark className="size-5 text-white/80" />
          <div>
            <p className="text-[11px] text-white/60">Choose a plan</p>
            <p className="text-sm font-medium">Tokyo photo shoot</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1">
          <div className="h-1.5 w-3 rounded-full bg-neutral-500" />
          <div className="size-1.5 rounded-full bg-neutral-300" />
          <div className="size-1.5 rounded-full bg-neutral-300" />
        </div>
      </div>
      <div className="flex h-8 items-center justify-center rounded-lg bg-neutral-900 px-3 text-sm font-medium text-white">
        Book now
      </div>
    </div>
  );
}

export default function FunnelPanel({ active }: PanelProps) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();

  // Reveal on entry; reset only after the panel has faded out, so nothing collapses in view.
  const reveal = (delay: number) =>
    active
      ? { opacity: 1, scaleY: 1, transition: reduceMotion ? { duration: 0 } : { duration: 0.9, ease: EASE_OUT, delay } }
      : { opacity: 0, scaleY: 0, transition: { duration: 0, delay: 0.75 } };
  const fade = (delay: number) =>
    active
      ? { opacity: 1, transition: reduceMotion ? { duration: 0 } : { duration: 0.6, ease: EASE_OUT, delay } }
      : { opacity: 0, transition: { duration: 0, delay: 0.75 } };

  return (
    <div className="relative size-full [mask-image:linear-gradient(black_85%,transparent)]">
      <div className="flex size-full flex-col items-center justify-center sm:justify-start">
        <BookingWidget />
        <div className="hidden h-5 w-px shrink-0 bg-neutral-200 sm:block" />
        <div className="relative w-full max-w-[420px] sm:max-w-[500px]">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            fill="none"
            className="h-auto w-full overflow-hidden rounded-xl border border-neutral-200 bg-white"
            aria-hidden
          >
            <defs>
              {steps.map((step, i) => (
                <clipPath key={step.name} id={`${uid}-col${i}`}>
                  <rect x={i * COL} y={HEAD} width={COL} height={H - HEAD} />
                </clipPath>
              ))}
            </defs>

            <rect x={COL} y={HEAD} width={COL} height={H - HEAD} fill="#9810FA" fillOpacity={0.04} />
            <path d={`M0 ${HEAD - 0.5}H${W}`} stroke="#E5E5E5" />

            {steps.map((step, i) => {
              const x0 = i * COL;
              return (
                <g key={step.name} fontFamily="Inter, system-ui, sans-serif">
                  {i > 0 ? (
                    <>
                      <path d={`M${x0} 0V${HEAD}`} stroke="#E5E5E5" />
                      <path d={`M${x0} ${HEAD}V${H}`} stroke="#171717" strokeOpacity={0.08} />
                    </>
                  ) : null}
                  <rect x={x0 + 17} y={15.3} width={3.7} height={3.7} rx={0.8} fill={step.color} opacity={0.6} />
                  <text x={x0 + 26.5} y={19.8} fontSize={7.4} fill="#525252">
                    Step {i + 1}
                  </text>
                  <text x={x0 + 17} y={40.2} fontSize={15.9} fontWeight={600} fill="#171717">
                    {step.name}
                  </text>
                </g>
              );
            })}
            <rect x={COL} y={HEAD - 1.6} width={COL} height={1.1} fill="#171717" />
            {steps.slice(1).map((step, i) => {
              const x = (i + 1) * COL;
              return (
                <g key={step.name}>
                  <rect x={x - 6.6} y={21.3} width={13.2} height={13.2} rx={6.6} fill="white" stroke="#E5E5E5" strokeWidth={0.53} />
                  <path d={`M${x - 0.7} 26.5l1.47 1.47-1.47 1.47`} stroke="#737373" strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}

            {steps.map((step, i) => {
              const d = outline([{ x0: i * COL - 10, x1: (i + 1) * COL + 10, from: step.from, to: step.to }]);
              return (
                <g key={step.name} clipPath={`url(#${uid}-col${i})`}>
                  <motion.g
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={reveal(i * 0.09)}
                  >
                    <path d={d} stroke={step.color} strokeOpacity={0.1} strokeWidth={12.7} />
                    <path d={d} stroke={step.color} strokeOpacity={0.3} strokeWidth={6.35} />
                    <path d={d} fill={step.color} />
                  </motion.g>
                </g>
              );
            })}

            <motion.path
              d={outline(ghost.map((g, i) => ({ x0: (i + 1) * COL, x1: (i + 2) * COL, ...g })))}
              stroke="#7C3AED"
              strokeOpacity={0.55}
              strokeWidth={1.2}
              strokeDasharray="4 3"
              initial={{ opacity: 0 }}
              animate={fade(0.45)}
            />

            {/* Too small to read once the SVG shrinks on phones; an HTML chip takes over there. */}
            <motion.g className="max-sm:hidden" initial={{ opacity: 0 }} animate={fade(0.55)}>
              <Pill x={COL * 1.5} y={CY} width={106} text="−39% · date → time" color="#59168B" />
              <Pill x={COL * 3.5} y={CY - 44 - 14} width={56} text="after fix" color="#525252" />
            </motion.g>
          </svg>
          <span className="absolute right-2 top-[24%] rounded-full border border-neutral-200 bg-white/90 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
            Shape illustrative
          </span>
          <span className="mx-auto mt-3 flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[11px] font-medium text-violet-900 sm:hidden">
            −39% · date → time
            <span className="h-3 w-px bg-neutral-200" />
            <span className="text-neutral-500">dashed: after fix</span>
          </span>
        </div>
      </div>
    </div>
  );
}

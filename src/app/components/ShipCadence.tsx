"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const tools = ["Plate math", "1RM estimate", "Macros"];
const WEEKS = 6;

// One side of the bar; the other side mirrors it. Weights in kg.
const plates = [
  { kg: 20, height: 80, color: "#e5534b" },
  { kg: 15, height: 66, color: "#eab308" },
  { kg: 5, height: 40, color: "#94a3b8" },
];
const BAR_KG = 20;

export default function ShipCadence() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  // Starts fully loaded and never drops back to an empty state, so any frame
  // a visitor lands on shows shipped tools and a loaded bar.
  const maxTick = tools.length + plates.length;
  const [tick, setTick] = useState(maxTick);
  const shipped = Math.min(tick, tools.length);
  const loaded = Math.min(tick, plates.length);
  const total = BAR_KG + 2 * plates.slice(0, loaded).reduce((sum, p) => sum + p.kg, 0);

  useEffect(() => {
    if (!inView) return;
    const interval = window.setInterval(
      () => setTick((current) => (current >= maxTick ? 1 : current + 1)),
      1100,
    );
    return () => window.clearInterval(interval);
  }, [inView, maxTick]);

  return (
    <div ref={ref} className="rounded-[12px] bg-neutral-50 p-5 sm:p-6">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em]">
        <span className="text-neutral-500">A free tool every Monday</span>
        <span className="rounded-md border border-orange-200 bg-orange-50 px-2 py-1 leading-none text-warm">
          Weekly release
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {Array.from({ length: WEEKS }, (_, index) => {
          const tool = tools[index];
          const isShipped = index < shipped;
          const isNext = index === shipped && index < WEEKS;

          return (
            <div key={index}>
              <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-neutral-400">
                Mon · W{index + 1}
              </p>
              <div
                className={`relative h-20 overflow-hidden rounded-[10px] border ${
                  isShipped
                    ? "border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    : isNext
                      ? "border-dashed border-warm/50 bg-white"
                      : "border-dashed border-neutral-300"
                }`}
              >
                {isShipped && tool ? (
                  <motion.div
                    className="flex h-full flex-col justify-between p-2"
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="w-fit rounded border border-green-200 bg-green-100 px-1 py-0.5 text-[8px] uppercase leading-none tracking-[0.08em] text-green-800">
                      Shipped
                    </span>
                    <span className="text-[11px] font-medium leading-tight text-neutral-900">
                      {tool}
                    </span>
                  </motion.div>
                ) : isNext ? (
                  <motion.div
                    className="flex h-full items-center justify-center text-[9px] uppercase tracking-[0.1em] text-warm"
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  >
                    Next
                  </motion.div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-[10px] border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em]">
          <span className="text-neutral-500">Plate math · live</span>
          <span className="text-neutral-800">
            Total <span className="text-warm">{total} kg</span>
          </span>
        </div>
        <svg viewBox="0 0 400 110" className="mt-3 h-auto w-full" aria-hidden>
          <rect x="20" y="52" width="360" height="6" rx="3" fill="#d4d4d4" />
          <rect x="112" y="44" width="8" height="22" rx="2" fill="#737373" />
          <rect x="280" y="44" width="8" height="22" rx="2" fill="#737373" />
          {plates.map((plate, index) => {
            const visible = index < loaded;
            const leftX = 100 - index * 16;
            const rightX = 292 + index * 16;
            const y = 55 - plate.height / 2;
            return (
              <g key={plate.kg}>
                <motion.rect
                  x={leftX}
                  y={y}
                  width="12"
                  height={plate.height}
                  rx="3"
                  fill={plate.color}
                  animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -14 }}
                  transition={{ duration: 0.35 }}
                />
                <motion.rect
                  x={rightX}
                  y={y}
                  width="12"
                  height={plate.height}
                  rx="3"
                  fill={plate.color}
                  animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 14 }}
                  transition={{ duration: 0.35 }}
                />
              </g>
            );
          })}
        </svg>
        <div className="mt-2 flex justify-center gap-4 font-mono text-[10px] text-neutral-500">
          {plates.map((plate) => (
            <span key={plate.kg} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: plate.color }} />
              {plate.kg} kg
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

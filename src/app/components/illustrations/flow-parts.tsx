"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// Shared pieces of the project-card flows (BookingEventFlow, SetSyncFlow): one wire, one chevron,
// one travelling dot, so every flow on /work moves and reads the same way.

export const EASE_TRAVEL = [0.65, 0, 0.35, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// A dot with a soft halo that glides the full length of its parent wire.
// Only transform and opacity animate. The wire is 0px thick on its cross axis,
// so "left-0"/"top-0" on that axis already sits on the line.
export function TravelDot({
  axis,
  duration,
  color,
  className,
}: {
  axis: "x" | "y";
  duration: number;
  color: string;
  className?: string;
}) {
  const horizontal = axis === "x";
  const seconds = duration / 1000;
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-20", className)}
      initial={horizontal ? { x: "0%", opacity: 0 } : { y: "0%", opacity: 0 }}
      animate={
        horizontal
          ? { x: "100%", opacity: [0, 1, 1, 0] }
          : { y: "100%", opacity: [0, 1, 1, 0] }
      }
      transition={{
        x: { duration: seconds, ease: EASE_TRAVEL },
        y: { duration: seconds, ease: EASE_TRAVEL },
        opacity: { duration: seconds, times: [0, 0.15, 0.82, 1], ease: "linear" },
      }}
    >
      <span className={cn("absolute", horizontal ? "left-0 top-1/2" : "left-1/2 top-0")}>
        <span
          className="absolute left-0 top-0 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-md"
          style={{ background: color }}
        />
        <span
          className="absolute left-0 top-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{ background: color }}
        />
        <span
          className="absolute left-0 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
          style={{ background: color }}
        />
      </span>
    </motion.div>
  );
}

// Vertical on phones, horizontal from md. `dashed` draws a wire that is waiting (no signal yet).
export function Connector({
  travelKey,
  duration,
  color = "#3b82f6",
  dashed = false,
  className,
}: {
  travelKey: number | null;
  duration: number;
  color?: string;
  dashed?: boolean;
  className?: string;
}) {
  return (
    // md+: 40px wires keep the whole flow (~590px) inside the ~614px project column in the rails.
    <div className={cn("relative z-10 flex min-h-16 items-center text-blue-500 md:min-h-0 md:min-w-10", className)}>
      {dashed ? (
        <div className="absolute inset-x-0 h-full w-0 -translate-x-1/2 border-l border-dashed border-current md:top-1/2 md:h-0 md:w-full md:-translate-y-1/2 md:translate-x-0 md:border-l-0 md:border-t" />
      ) : (
        <div className="absolute inset-x-0 h-full w-px -translate-x-1/2 bg-current md:top-1/2 md:h-px md:w-full md:-translate-y-1/2 md:translate-x-0" />
      )}
      <div className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current bg-white md:left-0 md:top-1/2 md:-translate-x-1/2" />
      <div className="absolute bottom-px left-1/2 -translate-x-1/2 translate-y-1/2 md:bottom-auto md:left-auto md:right-px md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2">
        <Chevron className="size-3 rotate-90 md:rotate-0" />
      </div>
      {travelKey !== null ? (
        <>
          <TravelDot key={`y-${travelKey}`} axis="y" duration={duration} color={color} className="md:hidden" />
          <TravelDot key={`x-${travelKey}`} axis="x" duration={duration} color={color} className="hidden md:block" />
        </>
      ) : null}
    </div>
  );
}

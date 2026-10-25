"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  IconGauge,
  IconKey,
  IconShieldLock,
  IconStack2,
  IconTrophy,
  IconWifi,
  IconWifiOff,
  IconWorld,
} from "@tabler/icons-react";
import { SiSupabase } from "react-icons/si";
import { cn } from "@/lib/utils";
import { Chevron, Connector, EASE_OUT, TravelDot } from "./flow-parts";

// How a set gets from the gym floor to the database in Lifters Club (training-plan, origin/mvp):
// the phone makes the set's id and sends it through an outbox kept in IndexedDB (src/lib/sync/outbox.ts).
// With no signal the write waits there, oldest first; once back online the queue is sent to
// POST /api/v1/workouts/:id/sets, which checks the token's signature, refuses cross-site writes and
// rate-limits (src/server/api), then writes to Supabase with the person's own token, so row-level
// security applies. The reply carries the personal records the set beat; the next session's target is
// worked out from set_logs by fixed rules (src/server/progression).
//
// One loop: two sets logged with no signal wait on the phone, the signal comes back, both go through
// the gate into Supabase, and the reply marks a personal best. Each arrival advances the state.

const LEG_MS = 650;
const BRAND_RED = "#d9483b";

// [duration of the step, in ms]. The dot legs run during steps 0 and 2 (phone to outbox),
// 4 (outbox to gate) and 6 (gate to Supabase).
const STEP_MS = [700, 500, 700, 1000, 650, 650, 650, 1700, 1700] as const;
const SETTLED = 7;

const sets = [
  { id: "s1", no: 1, weight: "37.5", reps: 9 },
  { id: "s2", no: 2, weight: "40", reps: 9 },
] as const;

const checks = [
  { key: "token", label: "Signed token", Icon: IconKey },
  { key: "origin", label: "Same site only", Icon: IconWorld },
  { key: "rate", label: "Rate limit", Icon: IconGauge },
] as const;

function LiftersMark({ className }: { className?: string }) {
  // The Lifters Club mark (training-plan src/app/icon.svg), without its tile.
  return (
    <svg viewBox="28 14 66 104" className={className} aria-hidden>
      <rect x="33" y="18" width="11" height="78" rx="3" fill="currentColor" />
      <rect x="33" y="85" width="60" height="11" rx="3" fill="currentColor" />
      <rect x="64" y="68" width="11" height="45" rx="3" fill={BRAND_RED} />
      <rect x="78" y="74" width="9" height="33" rx="3" fill={BRAND_RED} />
    </svg>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[16px] bg-gradient-to-b from-neutral-200 to-neutral-300 p-px shadow-sm", className)}>
      <div className="rounded-[15px] bg-white px-3 py-2.5">{children}</div>
    </div>
  );
}

export default function SetSyncFlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const animating = inView && !reduceMotion;

  // Static frame (server, reduced motion, off-screen): both sets saved, the personal best shown.
  const [{ cycle, step }, setTick] = useState({ cycle: 0, step: SETTLED });
  const cycleRef = useRef(0);

  useEffect(() => {
    if (!animating) return;
    let timers: number[] = [];
    const run = () => {
      const next = cycleRef.current + 1;
      cycleRef.current = next;
      let at = 0;
      timers = STEP_MS.map((ms, index) => {
        const timer = window.setTimeout(() => setTick({ cycle: next, step: index }), at);
        at += ms;
        return timer;
      });
      timers.push(window.setTimeout(run, at));
    };
    timers = [window.setTimeout(run, 400)];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [animating]);

  const shown = sets[step < 2 ? 0 : 1];
  const queue = step === 0 ? [] : step <= 2 ? [sets[0]] : step <= 6 ? [...sets] : [];
  const online = step >= 4;
  const checked = step >= 5;
  const travel = (leg: number) => (animating && step === leg ? cycle : null);
  const result = step === 7 ? "best" : step === 8 ? "next" : null;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex size-full flex-col items-center justify-center overflow-x-clip pb-16 pt-8 sm:px-16 md:flex-row md:py-6",
        className,
      )}
    >
      {/* Source: the set, logged on the phone */}
      <div className="relative">
        <div className="relative rounded-[20px] border border-neutral-200 bg-white p-2 shadow-sm">
          <div className="rounded-[12px] bg-gradient-to-b from-neutral-500 to-neutral-800 p-px">
            <div className="flex w-[108px] flex-col gap-2 rounded-[11px] bg-gradient-to-b from-neutral-600 to-neutral-900 px-3 py-3 text-white">
              <span className="flex items-center gap-1.5">
                <LiftersMark className="h-4 w-auto text-white" />
                <span className="whitespace-nowrap text-[11px] font-medium text-white/70">Squat, set {shown.no}</span>
              </span>
              <span className="relative h-7">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={shown.id}
                    className="absolute inset-0 flex items-center justify-center whitespace-nowrap rounded-full text-[12px] font-semibold tracking-[-0.01em]"
                    style={{ background: BRAND_RED }}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  >
                    {shown.weight} kg × {shown.reps}
                  </motion.span>
                </AnimatePresence>
              </span>
            </div>
          </div>
        </div>
        <p className="absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-neutral-400 md:block">
          lifters.club
        </p>
      </div>

      <Connector travelKey={travel(0) ?? travel(2)} duration={LEG_MS} className="md:min-w-6" />

      {/* Outbox on the phone */}
      <Card className="w-[196px] md:w-[132px]">
        <div className="flex items-center gap-2">
          <span className="rounded-[10px] border border-neutral-200 bg-neutral-50 p-1.5 text-neutral-700">
            <IconStack2 className="size-4" stroke={1.75} />
          </span>
          <span className="leading-tight">
            <span className="block text-[13px] font-medium text-neutral-800">Kept on the phone</span>
            <span className="block font-mono text-[10px] text-neutral-400">IndexedDB outbox</span>
          </span>
        </div>
        <div className="mt-2 flex h-6 items-center gap-1">
          <AnimatePresence initial={false} mode="popLayout">
            {queue.length === 0 ? (
              <motion.span
                key="empty"
                className="font-mono text-[10px] text-neutral-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                nothing waiting
              </motion.span>
            ) : (
              queue.map((set) => (
                <motion.span
                  key={set.id}
                  layout
                  className="rounded-md border border-neutral-200 bg-neutral-50 px-1.5 py-1 font-mono text-[10px] leading-none text-neutral-700"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                >
                  {set.weight}×{set.reps}
                </motion.span>
              ))
            )}
          </AnimatePresence>
        </div>
        <div
          className={cn(
            "mt-2 flex items-center gap-1.5 border-t border-neutral-100 pt-2 font-mono text-[10px] transition-colors duration-500",
            online ? "text-green-700" : "text-neutral-500",
          )}
        >
          {online ? <IconWifi className="size-3.5" stroke={1.75} /> : <IconWifiOff className="size-3.5" stroke={1.75} />}
          {!online ? "no signal, waiting" : queue.length > 0 ? "online, sending in order" : "online, all sent"}
        </div>
      </Card>

      <Connector
        travelKey={travel(4)}
        duration={LEG_MS}
        dashed={!online}
        className={cn("md:min-w-6 transition-colors duration-500", !online && "text-neutral-300")}
      />

      {/* The API gate, with the checks every write passes */}
      {/* Phones: the gate sits a little left of the wire so its checks fit on the right. */}
      <div className="relative min-[360px]:max-md:-translate-x-9">
        <Card>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-[10px] border p-1.5 transition-colors duration-500",
                checked ? "border-blue-200 bg-blue-100 text-blue-700" : "border-neutral-200 bg-neutral-50 text-neutral-500",
              )}
            >
              <IconShieldLock className="size-4" stroke={1.75} />
            </span>
            <span className="leading-tight">
              <span className="block font-mono text-[13px] font-medium text-neutral-800">/api/v1</span>
              <span className="block font-mono text-[10px] text-neutral-400">one gate</span>
            </span>
          </div>
        </Card>

        <div className="absolute left-full top-1/2 hidden -translate-y-1/2 min-[360px]:block md:left-1/2 md:top-full md:-translate-x-1/2 md:translate-y-0">
          <div className="flex items-center text-neutral-400 md:flex-col">
            <div className="flex h-full pl-1.5 md:hidden">
              <div className="w-3 border-t border-dashed border-current" />
            </div>
            <div className="flex flex-col justify-center gap-2.5 md:flex-row">
              {checks.map(({ key, label, Icon }, index) => (
                <div key={key} className="relative flex items-center md:flex-col">
                  {index === 0 ? (
                    <div className="absolute left-0 top-1/2 block h-[calc(100%+0.625rem)] border-r border-dashed border-current md:hidden" />
                  ) : null}
                  {index === checks.length - 1 ? (
                    <div className="absolute bottom-1/2 left-0 block h-[calc(100%+0.625rem)] border-r border-dashed border-current md:hidden" />
                  ) : null}
                  <div
                    className={cn(
                      "relative w-5 transition-colors duration-500 ease-out max-md:pr-1 md:h-10 md:w-fit md:pb-1.5 md:pt-1",
                      checked && "text-blue-400",
                    )}
                    style={{ transitionDelay: checked ? `${index * 120}ms` : "0ms" }}
                  >
                    <div className="border-dashed border-current max-md:border-b md:h-full md:border-r" />
                    <Chevron className="absolute -right-0.5 top-1/2 size-3 -translate-y-1/2 md:-bottom-0.5 md:left-1/2 md:right-auto md:top-auto md:-translate-x-1/2 md:translate-y-0 md:rotate-90" />
                    {animating && step === 5 ? (
                      <>
                        <TravelDot key={`cx-${cycle}`} axis="x" duration={500} color="#3b82f6" className="md:hidden" />
                        <TravelDot key={`cy-${cycle}`} axis="y" duration={500} color="#3b82f6" className="hidden md:block" />
                      </>
                    ) : null}
                  </div>
                  <div
                    title={label}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border bg-white transition-[border-color,box-shadow,color] duration-500 ease-out",
                      checked ? "border-blue-300 text-blue-700 ring-4 ring-blue-100" : "border-neutral-200 text-neutral-500 ring-0 ring-transparent",
                    )}
                    style={{ transitionDelay: checked ? `${index * 120}ms` : "0ms" }}
                  >
                    <Icon className="size-4" stroke={1.75} aria-label={label} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 hidden whitespace-nowrap font-mono text-[10px] text-neutral-400 md:block">
              signed · same site · rate limit
            </p>
          </div>
        </div>
      </div>

      <Connector travelKey={travel(6)} duration={LEG_MS} className="md:min-w-6" />

      {/* Supabase, behind row-level security, and what the reply brings back */}
      <div className="relative">
        <Card className={cn("transition-shadow duration-500", step >= SETTLED && "ring-4 ring-green-100")}>
          <div className="flex items-center gap-2">
            <span className="rounded-[10px] border border-green-200 bg-green-50 p-1.5">
              <SiSupabase className="size-4" color="#3ECF8E" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-medium text-neutral-800">Supabase</span>
              <span className="block whitespace-nowrap font-mono text-[10px] text-neutral-400">RLS enforced</span>
            </span>
          </div>
        </Card>

        <div className="absolute left-1/2 top-full mt-3 -translate-x-1/2 md:bottom-full md:left-auto md:right-0 md:top-auto md:mb-3 md:mt-0 md:translate-x-0">
          <div className="relative h-[26px] w-[220px] md:w-[210px]">
            <AnimatePresence initial={false}>
              {result ? (
                <motion.div
                  key={result}
                  className={cn(
                    "absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-1 font-mono text-[11px] leading-none md:left-auto md:right-0 md:translate-x-0",
                    result === "best" ? "border-red-200 bg-red-50 text-red-800" : "border-neutral-200 bg-white text-neutral-700",
                  )}
                  initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{
                    y: { type: "spring", stiffness: 260, damping: 24 },
                    opacity: { duration: 0.35, ease: EASE_OUT },
                    filter: { duration: 0.35, ease: EASE_OUT },
                  }}
                >
                  {result === "best" ? (
                    <>
                      <IconTrophy className="size-3.5" stroke={1.75} style={{ color: BRAND_RED }} />
                      Personal best: 40 kg × 9
                    </>
                  ) : (
                    "Next time: 40 kg, one more rep"
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

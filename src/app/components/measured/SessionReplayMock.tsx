"use client";

import { motion } from "motion/react";
import { IconArrowForward, IconClick } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ApertureMark, EASE_OUT } from "./marks";

const steps = ["Plan", "Location", "Date", "Time", "Deposit"];
// The rage-click marker sits on the time-slot step.
const STALL_STEP = 3;
const stepPct = (i: number) => (i / (steps.length - 1)) * 100;
const stall = stepPct(STALL_STEP) / 100;

function Switch({ tone = "bg-black" }: { tone?: string }) {
  return (
    <span aria-hidden className={cn("relative inline-flex h-4 w-8 shrink-0 rounded-full border-2 border-transparent", tone)}>
      <span className="h-3 w-3 translate-x-4 rounded-full bg-white shadow-lg" />
    </span>
  );
}

// dub "Share dashboard" modal, rebuilt as a Microsoft Clarity-style session replay.
export default function SessionReplayMock({ animate = true }: { animate?: boolean }) {
  return (
    <div className="h-full cursor-default select-none overflow-clip" aria-hidden>
      <div className="origin-top rounded-xl border border-neutral-200 bg-white shadow-[0_20px_20px_0_#00000017]">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-4 py-4 sm:px-6">
          <p className="text-lg font-medium text-neutral-900">Session replay</p>
          <span className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 font-mono text-[11px] text-neutral-500">
            Microsoft Clarity
          </span>
        </div>

        <div className="min-h-[300px] bg-neutral-50 px-4 pb-6 pt-4 sm:px-6">
          <div className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-white p-3">
            <div className="relative flex shrink-0 items-center justify-center rounded-full border border-neutral-200">
              <div className="absolute inset-0 rounded-full border border-white bg-gradient-to-t from-neutral-100" />
              <div className="relative p-2">
                <ApertureMark className="size-5 text-neutral-800" />
              </div>
            </div>
            <div className="flex min-w-0 flex-col text-sm">
              <span className="truncate font-semibold leading-normal text-neutral-800">Booking session</span>
              <span className="flex items-center gap-1 text-neutral-500">
                <IconArrowForward className="size-3 shrink-0 text-neutral-400" />
                <span className="truncate">book.tettyphotostudio.com/booking</span>
              </span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-2.5 pr-1.5 text-neutral-600">
              Drop-off: date → time · 39%
              <Switch tone="bg-violet-600" />
            </span>
            <span className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-1 pl-2.5 pr-1.5 text-neutral-600">
              Fix shipped
              <Switch />
            </span>
          </div>

          {/* Player timeline */}
          <div className="mt-3 rounded-lg border border-neutral-200 bg-white px-4 pb-4 pt-3">
            <div className="relative h-4 text-[10px] text-neutral-400">
              {steps.map((step, i) => (
                <span
                  key={step}
                  className={cn(
                    "absolute whitespace-nowrap",
                    i === 0 ? "" : i === steps.length - 1 ? "-translate-x-full" : "-translate-x-1/2",
                    i === STALL_STEP && "font-medium text-rose-600",
                  )}
                  style={{ left: `${stepPct(i)}%` }}
                >
                  {step}
                </span>
              ))}
            </div>
            <div className="relative mt-2 h-1.5 rounded-full bg-neutral-200">
              {/* Playhead: scaleX only, so it glides on the compositor. */}
              <motion.div
                className="absolute inset-0 origin-left rounded-full bg-neutral-800"
                initial={{ scaleX: stall }}
                animate={animate ? { scaleX: [0, stall, stall] } : { scaleX: stall }}
                transition={
                  animate
                    ? { duration: 4.5, times: [0, 0.65, 1], repeat: Infinity, ease: EASE_OUT }
                    : { duration: 0.4, ease: EASE_OUT }
                }
              />
              {steps.map((step, i) => (
                <span
                  key={step}
                  className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-1 ring-neutral-300"
                  style={{ left: `${stepPct(i)}%` }}
                />
              ))}
              <span className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${stepPct(STALL_STEP)}%` }}>
                {animate ? <span className="absolute inset-0 -m-1.5 animate-ping rounded-full bg-rose-400/60" /> : null}
                <span className="relative flex size-4 items-center justify-center rounded-full border-2 border-white bg-rose-500 shadow">
                  <IconClick className="size-2.5 text-white" stroke={2.5} />
                </span>
              </span>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="size-1.5 rounded-full bg-rose-500" />
              Rage clicks on time slots
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

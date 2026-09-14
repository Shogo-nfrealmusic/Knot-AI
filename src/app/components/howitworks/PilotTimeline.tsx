"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const steps = [
  {
    day: "STEP 01 / 04",
    shortDay: "STEP 01",
    title: "Assessment",
    metric: "Scoped plan",
    confidence: "One call",
    activity: [24, 38, 52, 41, 66, 58, 74, 62, 81, 70, 88, 76],
    items: [
      "Map the workflow and where time or money leaks",
      "Look at the data: analytics, logs, spreadsheets",
      "Agree on one measurable outcome",
    ],
  },
  {
    day: "STEP 02 / 04",
    shortDay: "STEP 02",
    title: "Build",
    metric: "Working build",
    confidence: "Weekly demo",
    activity: [34, 48, 60, 72, 54, 69, 83, 75, 91, 79, 86, 94],
    items: [
      "Ship the smallest version that proves value",
      "Connect it to the tools you already use",
      "Demo on real data every week",
    ],
  },
  {
    day: "STEP 03 / 04",
    shortDay: "STEP 03",
    title: "Ship",
    metric: "Live system",
    confidence: "Sign-off",
    activity: [42, 61, 56, 79, 88, 64, 91, 84, 96, 72, 89, 100],
    items: [
      "Deploy to production with monitoring",
      "Instrument every step: GA4, Clarity, logs",
      "Hand over docs, access, and ownership",
    ],
  },
  {
    day: "STEP 04 / 04",
    shortDay: "STEP 04",
    title: "Maintain",
    metric: "Measured results",
    confidence: "Monthly check-in",
    activity: [58, 67, 74, 82, 90, 77, 94, 86, 100, 92, 96, 88],
    items: [
      "Watch the numbers after launch",
      "Fix what breaks, improve what matters",
      "Pick the next workflow together",
    ],
  },
];

const progressWidths = ["0%", "31%", "62%", "94%"];
const packetPositions = ["12.5%", "37.5%", "62.5%", "87.5%"];

function MiniMetric({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 transition-colors duration-300 ${
        active
          ? "border-[rgba(224,85,47,0.35)] bg-[rgba(224,85,47,0.08)]"
          : "border-neutral-200 bg-neutral-50"
      }`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.05em] text-neutral-500">
        {label}
      </p>
      <p className="mt-1 font-mono text-[13px] text-neutral-800">{value}</p>
    </div>
  );
}

export default function PilotTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const activeStep = steps[currentStep];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 },
    );

    const container = containerRef.current;
    if (container) observer.observe(container);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = window.setInterval(() => {
      setCurrentStep((step) => (step + 1) % steps.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-12px_rgba(0,0,0,0.08)] p-7"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.35)_1px,transparent_1px)] [background-size:28px_28px]" />
      <motion.div
        className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-[rgba(224,85,47,0.14)] blur-3xl"
        animate={
          isVisible
            ? { x: [0, 180, 320, 120, 0], opacity: [0.18, 0.28, 0.16, 0.24, 0.18] }
            : undefined
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex items-center justify-between gap-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.05em] sm:gap-4 sm:text-[11px]">
        <span className="text-neutral-500">
          How I work<span className="max-[380px]:hidden"> · 4 steps</span>
        </span>
        <span className="text-[rgba(224,85,47,0.95)]">{activeStep.day}</span>
      </div>

      <div className="relative mt-12 px-2">
        <div className="absolute left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] top-2 h-px bg-neutral-200" />
        <div
          className="absolute left-[calc(12.5%+8px)] top-2 h-px bg-[rgba(224,85,47,0.95)] transition-[width] duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: progressWidths[currentStep] }}
        />
        <AnimatePresence mode="wait">
          <motion.span
            key={activeStep.day}
            className="absolute top-[5px] z-10 -translate-x-1/2"
            initial={{ left: "12.5%", opacity: 0 }}
            animate={{
              left: packetPositions[currentStep],
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className="block h-2 w-2 rounded-full bg-[rgba(224,85,47,0.95)] shadow-[0_0_14px_rgba(224,85,47,0.8)]"
              initial={{ scale: 0.7 }}
              animate={{ scale: [0.7, 1.15, 0.9] }}
              exit={{ scale: 0.7 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.span>
        </AnimatePresence>

        <div className="relative grid grid-cols-4 gap-3">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <button
                key={step.day}
                type="button"
                onClick={() => setCurrentStep(index)}
                className="group flex flex-col items-center text-center"
                aria-label={`Show ${step.title}`}
              >
                <span
                  className={`relative z-0 h-4 w-4 rounded-full border transition-all duration-300 ${
                    isActive
                      ? "border-[rgba(224,85,47,0.95)] bg-[rgba(224,85,47,0.95)] shadow-[0_0_0_2px_rgba(224,85,47,0.35)]"
                      : isComplete
                        ? "border-[rgba(224,85,47,0.45)] bg-[rgba(224,85,47,0.25)]"
                      : "border-neutral-200 bg-neutral-200 group-hover:border-neutral-300"
                  }`}
                />
                <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.05em] text-neutral-500">
                  {step.shortDay}
                </span>
                <span
                  className={`mt-1 text-[12px] transition-colors duration-200 ${
                    isActive ? "text-text-primary" : "text-text-secondary"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <MiniMetric label="Active phase" value={activeStep.title} active />
        <MiniMetric label="Output" value={activeStep.metric} active />
        <MiniMetric label="Your time" value={activeStep.confidence} active />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_0.75fr]">
        <div className="min-h-[230px] border-l border-[rgba(224,85,47,0.6)] bg-[rgba(224,85,47,0.08)]/40 p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-text-primary">
              {activeStep.title}
            </h3>
            <ul className="mt-5 space-y-3 text-[14px] leading-relaxed text-text-secondary">
              {activeStep.items.map((item) => (
                <motion.li
                  key={item}
                  className="flex gap-3"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <span className="text-[rgba(224,85,47,0.95)]">→</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="mb-4 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.05em]">
            <span className="text-neutral-500">Effort by step</span>
            <span className="text-emerald-600">typical</span>
          </div>
          <div className="flex h-28 items-end gap-1.5">
            {activeStep.activity.map((height, index) => (
              <motion.span
                key={`${activeStep.title}-${index}`}
                className="min-w-0 flex-1 rounded-t bg-[rgba(224,85,47,0.6)]"
                initial={{ height: "15%", opacity: 0.35 }}
                animate={{
                  height: `${height}%`,
                  opacity: 0.45 + height / 180,
                }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.035,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[9px] text-neutral-500">
            <span>input</span>
            <span className="text-center">review</span>
            <span className="text-right">handoff</span>
          </div>
        </div>
      </div>
    </div>
  );
}

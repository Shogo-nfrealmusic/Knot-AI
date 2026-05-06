"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const steps = [
  {
    day: "DAY 01 / 14",
    shortDay: "DAY 01",
    title: "Discovery",
    metric: "12 signals mapped",
    confidence: "42%",
    activity: [24, 38, 52, 41, 66, 58, 74, 62, 81, 70, 88, 76],
    items: [
      "Map the workflow with your team",
      "Identify decision points and bottlenecks",
      "Define success criteria and metrics",
    ],
  },
  {
    day: "DAY 03 / 14",
    shortDay: "DAY 03",
    title: "Design",
    metric: "7 routes drafted",
    confidence: "61%",
    activity: [34, 48, 60, 72, 54, 69, 83, 75, 91, 79, 86, 94],
    items: [
      "Draft SKILL.md with classification rules",
      "Specify integrations and data flow",
      "Design human-in-the-loop checkpoints",
    ],
  },
  {
    day: "DAY 07 / 14",
    shortDay: "DAY 07",
    title: "Build",
    metric: "31 test runs",
    confidence: "78%",
    activity: [42, 61, 56, 79, 88, 64, 91, 84, 96, 72, 89, 100],
    items: [
      "Implement the Skill in your environment",
      "Connect to your existing tools",
      "Run end-to-end tests on real data",
    ],
  },
  {
    day: "DAY 14 / 14",
    shortDay: "DAY 14",
    title: "Live",
    metric: "99.4% routed",
    confidence: "94%",
    activity: [58, 67, 74, 82, 90, 77, 94, 86, 100, 92, 96, 88],
    items: [
      "Deploy to production with your team",
      "Hand off documentation and ownership",
      "Review results, decide what comes next",
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
          ? "border-[rgba(204,120,92,0.35)] bg-[rgba(204,120,92,0.08)]"
          : "border-white/10 bg-white/2"
      }`}
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.05em] text-white/35">
        {label}
      </p>
      <p className="mt-1 font-mono text-[13px] text-white/85">{value}</p>
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
      className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-7"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:28px_28px]" />
      <motion.div
        className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-[rgba(204,120,92,0.14)] blur-3xl"
        animate={
          isVisible
            ? { x: [0, 180, 320, 120, 0], opacity: [0.18, 0.28, 0.16, 0.24, 0.18] }
            : undefined
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.05em]">
        <span className="text-white/40">Pilot Build · 14 Days</span>
        <span className="text-[rgba(204,120,92,0.95)]">{activeStep.day}</span>
      </div>

      <div className="relative mt-12 px-2">
        <div className="absolute left-[calc(12.5%+8px)] right-[calc(12.5%+8px)] top-2 h-px bg-white/10" />
        <div
          className="absolute left-[calc(12.5%+8px)] top-2 h-px bg-[rgba(204,120,92,0.95)] transition-[width] duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
              className="block h-2 w-2 rounded-full bg-[rgba(255,187,153,0.95)] shadow-[0_0_14px_rgba(204,120,92,0.8)]"
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
                      ? "border-[rgba(204,120,92,0.95)] bg-[rgba(204,120,92,0.95)] shadow-[0_0_0_2px_rgba(204,120,92,0.35)]"
                      : isComplete
                        ? "border-[rgba(204,120,92,0.45)] bg-[rgba(204,120,92,0.25)]"
                      : "border-white/15 bg-white/10 group-hover:border-white/30"
                  }`}
                />
                <span className="mt-5 font-mono text-[10px] uppercase tracking-[0.05em] text-white/35">
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
        <MiniMetric label="Pilot signal" value={activeStep.metric} active />
        <MiniMetric label="Confidence" value={activeStep.confidence} active />
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-[1fr_0.75fr]">
        <div className="min-h-[230px] border-l border-[rgba(204,120,92,0.6)] bg-[rgba(204,120,92,0.08)]/40 p-5">
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
                  <span className="text-[rgba(204,120,92,0.95)]">→</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/2 p-4">
          <div className="mb-4 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.05em]">
            <span className="text-white/35">Workflow telemetry</span>
            <span className="text-[rgba(93,202,165,0.85)]">live sample</span>
          </div>
          <div className="flex h-28 items-end gap-1.5">
            {activeStep.activity.map((height, index) => (
              <motion.span
                key={`${activeStep.title}-${index}`}
                className="min-w-0 flex-1 rounded-t bg-[rgba(204,120,92,0.6)]"
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
          <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[9px] text-white/35">
            <span>input</span>
            <span className="text-center">review</span>
            <span className="text-right">handoff</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";

const steps = [
  {
    title: "Claim a job",
    detail: "Open jobs appear in the app. One tap claims it.",
  },
  {
    title: "Track earnings",
    detail: "Pay is calculated per job, automatically.",
  },
  {
    title: "Invoice at month end",
    detail: "Invoices generate and submit themselves.",
  },
];

const jobs = [
  { id: "#418", when: "Sat · 10:00", place: "Location A" },
  { id: "#419", when: "Sat · 14:30", place: "Location B" },
  { id: "#421", when: "Sun · 09:00", place: "Location C" },
];

const bars = [38, 52, 44, 66, 58, 74, 90];

function JobsScreen() {
  return (
    <div className="space-y-2">
      {jobs.map((job, index) => (
        <div
          key={job.id}
          className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <div>
            <p className="font-mono text-[9px] text-neutral-400">{job.id}</p>
            <p className="text-[11px] font-medium text-neutral-800">{job.when}</p>
            <p className="text-[9px] text-neutral-400">{job.place}</p>
          </div>
          {index === 0 ? (
            <span className="relative h-6 w-16">
              <motion.span
                className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral-900 text-[10px] font-medium text-white"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.2 }}
              >
                Claim
              </motion.span>
              <motion.span
                className="absolute inset-0 flex items-center justify-center rounded-full border border-green-200 bg-green-100 text-[10px] font-medium text-green-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.3 }}
              >
                ✓ Claimed
              </motion.span>
            </span>
          ) : (
            <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[10px] text-neutral-500">
              Open
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function EarningsScreen() {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.08em] text-neutral-400">
        Jobs this month
      </p>
      <motion.p
        className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-neutral-900"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
      >
        13
        <span className="ml-1.5 text-[11px] font-normal text-green-700">+1</span>
      </motion.p>
      <div className="mt-4 flex h-24 items-end gap-1.5">
        {bars.map((height, index) => (
          <motion.span
            key={index}
            className={`flex-1 rounded-t ${
              index === bars.length - 1 ? "bg-warm" : "bg-neutral-200"
            }`}
            initial={{ height: "8%" }}
            animate={{ height: `${height}%` }}
            transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </div>
      <p className="mt-3 text-[9px] text-neutral-400">Calculated per job</p>
    </div>
  );
}

function InvoiceScreen() {
  const rows = ["Jobs completed", "Total calculated", "Submitted"];

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <p className="text-[9px] uppercase tracking-[0.08em] text-neutral-400">
        Monthly invoice
      </p>
      <p className="mt-1 text-[14px] font-medium text-neutral-900">Ready</p>
      <div className="mt-3 space-y-2">
        {rows.map((row, index) => (
          <motion.div
            key={row}
            className="flex items-center justify-between text-[10px]"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + index * 0.35, duration: 0.3 }}
          >
            <span className="text-neutral-600">{row}</span>
            <span className="text-green-600">✓</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const screens = [JobsScreen, EarningsScreen, InvoiceScreen];
const tabs = ["Jobs", "Earnings", "Invoices"];

export default function OpsAppMock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [stage, setStage] = useState(0);
  const Screen = screens[stage];

  useEffect(() => {
    if (!inView) return;
    const interval = window.setInterval(
      () => setStage((current) => (current + 1) % steps.length),
      3200,
    );
    return () => window.clearInterval(interval);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="grid items-center gap-8 rounded-[12px] bg-neutral-50 p-6 sm:grid-cols-[1fr_auto] sm:p-8"
    >
      <ol className="space-y-3">
        {steps.map((step, index) => {
          const active = index === stage;
          return (
            <li
              key={step.title}
              className={`rounded-lg border-l-2 py-2 pl-4 transition-all duration-300 ${
                active
                  ? "border-warm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                  : "border-neutral-200"
              }`}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                Step {String(index + 1).padStart(2, "0")}
              </p>
              <p
                className={`mt-1 text-[15px] font-medium transition-colors duration-300 ${
                  active ? "text-text-primary" : "text-text-secondary"
                }`}
              >
                {step.title}
              </p>
              <p className="mt-1 text-[13px] text-text-muted">{step.detail}</p>
            </li>
          );
        })}
      </ol>

      <div className="mx-auto w-[220px]">
        <div className="rounded-[34px] border-[6px] border-neutral-900 bg-white p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)]">
          <div className="mx-auto mb-3 h-4 w-20 rounded-full bg-neutral-900" />
          <div className="mb-3 flex gap-1 rounded-full bg-neutral-100 p-1">
            {tabs.map((tab, index) => (
              <span
                key={tab}
                className={`flex-1 rounded-full py-1 text-center text-[9px] transition-colors duration-300 ${
                  index === stage
                    ? "bg-white font-medium text-neutral-900 shadow-sm"
                    : "text-neutral-500"
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
          <div className="h-[230px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Screen />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">
          Sample data
        </p>
      </div>
    </div>
  );
}

"use client";

import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const activeSkills = [
  { name: "lead-intake", sparkline: "▁▂▃▅▆▇█▇▅" },
  { name: "payment-sync", sparkline: "▂▃▅▇▆▅▃▂▁" },
  { name: "weekly-report", sparkline: "▁▁▂▃▄▅▆▇▇" },
  { name: "support-triage", sparkline: "▃▅▇█▇▅▃▂▁" },
];

const idleSkills = [
  "invoice-reminders",
  "calendar-sync",
  "content-pipeline",
  "data-export",
];

const workspaces = [
  "Sales",
  "Finance",
  "Operations",
  "Marketing",
];

type CodeLineItem = { line: string; type: "body" | "yaml" | "heading" };

const skillTabs = [
  {
    id: "lead-intake",
    file: "lead-intake/flow.yaml",
    command: "$ run lead-intake --watch",
    codeLines: [
      { line: "---", type: "body" },
      { line: "name: lead-intake", type: "yaml" },
      { line: "triggers: [web_form, email, slack]", type: "yaml" },
      { line: "tools: [llm, crm, slack]", type: "yaml" },
      { line: "---", type: "body" },
      { line: "", type: "body" },
      { line: "# Lead Intake", type: "heading" },
      { line: "", type: "body" },
      { line: "When a new lead arrives:", type: "body" },
      { line: "  1. Enrich the company and contact", type: "body" },
      { line: "  2. Score the fit with an LLM", type: "body" },
      { line: "  3. Create the record in the CRM", type: "body" },
      { line: "  4. Draft a reply for review", type: "body" },
    ] satisfies CodeLineItem[],
    logs: [
      "10:02:11.204  LEAD-2041 received  via web_form",
      "10:02:11.390  → enrich_contact()",
      "10:02:12.018  ✓ company matched",
      "10:02:12.402  → score_fit(model: llm)",
      "10:02:13.105  ✓ fit: high",
      "10:02:13.380  → crm.create_record()",
      "10:02:13.902  ✓ reply drafted · ready for review",
      "10:02:18.117  LEAD-2042 received  via email",
      "10:02:18.301  → enrich_contact()",
      "10:02:18.940  ✓ company matched",
      "10:02:19.322  → score_fit(model: llm)",
      "10:02:19.980  ✓ fit: medium",
    ],
  },
  {
    id: "payment-sync",
    file: "payment-sync/sync.yaml",
    command: "$ run payment-sync --watch",
    codeLines: [
      { line: "---", type: "body" },
      { line: "name: payment-sync", type: "yaml" },
      { line: "triggers: [stripe_webhook]", type: "yaml" },
      { line: "tools: [stripe, sheets, slack]", type: "yaml" },
      { line: "---", type: "body" },
      { line: "", type: "body" },
      { line: "# Payment Sync", type: "heading" },
      { line: "", type: "body" },
      { line: "For every payment event:", type: "body" },
      { line: "  1. Match it to the customer and order", type: "body" },
      { line: "  2. Update the ledger sheet", type: "body" },
      { line: "  3. Schedule the follow-up invoice", type: "body" },
      { line: "  4. Post a summary to Slack", type: "body" },
    ] satisfies CodeLineItem[],
    logs: [
      "14:20:04.118  PAY-8812 received  via stripe",
      "14:20:04.301  → match_order()",
      "14:20:04.920  ✓ order matched",
      "14:20:05.212  → ledger.update()",
      "14:20:05.604  ✓ ledger updated",
      "14:20:05.910  → schedule_invoice()",
      "14:20:06.302  ✓ slack summary posted",
      "14:20:09.842  PAY-8813 received  via stripe",
      "14:20:10.001  → match_order()",
      "14:20:10.644  ✓ order matched",
      "14:20:11.215  → ledger.update()",
      "14:20:11.870  ✓ ledger updated",
    ],
  },
  {
    id: "weekly-report",
    file: "weekly-report/schedule.yaml",
    command: "$ run weekly-report --watch",
    codeLines: [
      { line: "---", type: "body" },
      { line: "name: weekly-report", type: "yaml" },
      { line: "schedule: [monday_09_00]", type: "yaml" },
      { line: "sources: [ga4, clarity, stripe]", type: "yaml" },
      { line: "---", type: "body" },
      { line: "", type: "body" },
      { line: "# Weekly Report", type: "heading" },
      { line: "", type: "body" },
      { line: "Every Monday morning:", type: "body" },
      { line: "  1. Pull traffic, funnel, and revenue data", type: "body" },
      { line: "  2. Flag drop-offs and anomalies", type: "body" },
      { line: "  3. Summarize the findings with an LLM", type: "body" },
      { line: "  4. Send the report to the team", type: "body" },
    ] satisfies CodeLineItem[],
    logs: [
      "09:00:00.004  RUN-0312 started  via schedule",
      "09:00:00.318  → pull_sources()",
      "09:00:04.006  ✓ 3 sources loaded",
      "09:00:04.504  → flag_anomalies()",
      "09:00:05.209  ✓ drop-off flagged: checkout",
      "09:00:05.880  → summarize(model: llm)",
      "09:00:08.117  ✓ report sent to #team",
      "09:00:00.011  RUN-0313 started  via schedule",
      "09:00:00.296  → pull_sources()",
      "09:00:03.774  ✓ 3 sources loaded",
      "09:00:04.180  → flag_anomalies()",
      "09:00:04.902  ✓ no anomalies",
    ],
  },
] as const;

type SkillTab = (typeof skillTabs)[number];

const activityBars = "▁▁▂▃▄▆▇█▇▆▅▄▃▄▅▇█▇▆▅▄▃▂▁".split("");

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getHighlightLine(line: string) {
  const normalized = line.toLowerCase();

  if (
    normalized.includes("enrich") ||
    normalized.includes("company matched") ||
    normalized.includes("match_order") ||
    normalized.includes("order matched") ||
    normalized.includes("pull_sources") ||
    normalized.includes("sources loaded")
  ) {
    return 9;
  }

  if (
    normalized.includes("score_fit") ||
    normalized.includes("fit:") ||
    normalized.includes("ledger") ||
    normalized.includes("anomal") ||
    normalized.includes("drop-off")
  ) {
    return 10;
  }

  if (
    normalized.includes("crm") ||
    normalized.includes("invoice") ||
    normalized.includes("summarize")
  ) {
    return 11;
  }

  if (
    normalized.includes("reply drafted") ||
    normalized.includes("slack summary") ||
    normalized.includes("report sent")
  ) {
    return 12;
  }

  return null;
}

function KnotMark() {
  return (
    <div className="grid h-4 w-4 shrink-0 grid-cols-2 gap-0.5 rounded-[5px] border border-neutral-200 bg-neutral-50 p-0.5">
      <span className="rounded-[2px] bg-warm/80" />
      <span className="rounded-[2px] bg-neutral-300" />
      <span className="rounded-[2px] bg-neutral-300" />
      <span className="rounded-[2px] bg-emerald-500/80" />
    </div>
  );
}

function SkillLibrary({ start }: { start: boolean }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={start ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      className="order-2 border-t border-border bg-bg-card-alt p-3 lg:order-1 lg:border-r lg:border-t-0"
    >
      <div className="mb-5 flex items-center gap-2">
        <KnotMark />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-800">
          AUTOMATION CONSOLE
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-3">
        <span className="text-[13px] font-semibold text-neutral-800">Workflows</span>
        <span className="font-mono text-[11px] text-text-muted">8</span>
      </div>

      <div className="space-y-1">
        <p className="px-1 pb-1 font-mono text-[11px] text-text-muted">
          ▸ Active (4)
        </p>
        {activeSkills.map((skill) => (
          <motion.div
            key={skill.name}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="group relative flex h-7 items-center gap-2 overflow-hidden rounded-md px-1.5"
          >
            <motion.span
              variants={{
                rest: { width: 0, opacity: 0 },
                hover: { width: 2, opacity: 1 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 top-1 bottom-1 rounded-full bg-warm"
            />
            <motion.span
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute inset-0 bg-neutral-100"
            />
            <span className="relative z-10 h-1 w-1 rounded-full bg-emerald-500" />
            <span className="relative z-10 min-w-0 flex-1 truncate font-mono text-[12px] text-neutral-800">
              {skill.name}
            </span>
            <motion.span
              variants={{
                rest: { opacity: 0.6 },
                hover: { opacity: 0.85 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative z-10 font-mono text-[11px] text-warm"
            >
              {skill.sparkline}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 space-y-1">
        <p className="px-1 pb-1 font-mono text-[11px] text-text-muted">
          ▸ Scheduled (4)
        </p>
        {idleSkills.map((skill) => (
          <motion.div
            key={skill}
            initial="rest"
            whileHover="hover"
            animate="rest"
            className="relative flex h-7 items-center gap-2 overflow-hidden rounded-md px-1.5"
          >
            <motion.span
              variants={{
                rest: { width: 0, opacity: 0 },
                hover: { width: 2, opacity: 1 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute left-0 top-1 bottom-1 rounded-full bg-warm"
            />
            <motion.span
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute inset-0 bg-neutral-100"
            />
            <span className="relative z-10 h-1.5 w-1.5 rounded-full border border-neutral-300" />
            <span className="relative z-10 font-mono text-[12px] text-neutral-400">{skill}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 border-t border-neutral-200 pt-4">
        <p className="mb-2 px-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
          Workspaces
        </p>
        <div className="space-y-1">
          {workspaces.map((workspace) => (
            <div
              key={workspace}
              className="flex h-7 items-center rounded-md px-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              {workspace}
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}

function CodeLine({
  line,
  type,
  index,
  active,
}: {
  line: string;
  type: string;
  index: number;
  active: boolean;
}) {
  const keyMatch = line.match(/^([a-z]+:)(.*)$/);
  const textClass =
    type === "heading"
      ? "text-neutral-800"
      : type === "yaml"
        ? "text-neutral-700"
        : "text-neutral-700";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 4 },
        show: { opacity: 1, y: 0 },
      }}
      animate={{
        backgroundColor: active
          ? "rgba(224,85,47,0.07)"
          : "rgba(224,85,47,0)",
      }}
      transition={{ duration: active ? 0.15 : 0.4, ease: "easeOut" }}
      className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-sm"
    >
      <motion.span
        animate={{ opacity: active ? 1 : 0, scaleY: active ? 1 : 0.4 }}
        transition={{ duration: active ? 0.15 : 0.4, ease: "easeOut" }}
        className="absolute left-0 top-0.5 bottom-0.5 w-[2px] rounded-full bg-warm"
      />
      <span className="select-none text-right font-mono text-[11px] leading-5 text-neutral-300">
        {index + 1}
      </span>
      <code className={`min-w-0 whitespace-pre font-mono text-[11.5px] leading-5 ${textClass}`}>
        {keyMatch ? (
          <>
            <span className="text-emerald-700">{keyMatch[1]}</span>
            <span className="text-orange-700">{keyMatch[2]}</span>
          </>
        ) : (
          line
        )}
        {index === 12 ? (
          <span className="ml-1 inline-block h-4 w-px animate-pulse bg-warm align-[-0.2em]" />
        ) : null}
      </code>
    </motion.div>
  );
}

function EditorPanel({
  activeLine,
  activeSkill,
  start,
}: {
  activeLine: number | null;
  activeSkill: SkillTab;
  start: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={start ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
      className="min-h-0 border-b border-border"
    >
      <div className="flex min-h-10 items-center justify-between border-b border-neutral-200 bg-bg-elevated px-3">
        <div className="flex min-w-0 items-end gap-1 overflow-x-auto">
          {skillTabs.map((skill) => {
            const active = skill.id === activeSkill.id;

            return (
              <div
                key={skill.id}
                className={`flex shrink-0 items-center gap-2 rounded-t-md border-x border-t px-3 py-2 ${
                  active
                    ? "border-neutral-200 bg-white"
                    : "border-transparent bg-transparent"
                }`}
              >
                <span className="h-3 w-2.5 rounded-[2px] border border-neutral-300" />
                <span
                  className={`font-mono text-[11.5px] ${
                    active ? "text-neutral-800" : "text-neutral-400"
                  }`}
                >
                  {skill.file}
                </span>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="rounded-md border border-neutral-200 px-2 py-1 font-mono text-[10px] text-text-secondary"
          tabIndex={-1}
        >
          ⌘ Edit
        </button>
      </div>
      <motion.div
        className="overflow-x-auto bg-white px-3 py-4"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSkill.id}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { delayChildren: 0.05, staggerChildren: 0.05 },
              },
              exit: { opacity: 0 },
            }}
            initial="hidden"
            animate={start ? "show" : "hidden"}
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {activeSkill.codeLines.map((item, index) => (
              <CodeLine
                key={`${activeSkill.id}-${item.line}-${index}`}
                line={item.line}
                type={item.type}
                index={index}
                active={activeLine === index}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function LogLine({ line }: { line: string }) {
  const timestamp = line.slice(0, 12);
  const event = line.slice(14);
  const isCheck = event.includes("✓");
  const isArrow = event.includes("→");
  const isThinking = event.includes("thinking");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="grid grid-cols-[5.8rem_minmax(0,1fr)] gap-2 font-mono text-[11.5px] leading-5"
    >
      <span className="text-neutral-400">{timestamp}</span>
      <span className="min-w-0 text-neutral-700">
        {isArrow ? <span className="text-warm/70">→ </span> : null}
        {isCheck ? <span className="text-emerald-600">✓ </span> : null}
        {isThinking ? (
          <span className="animate-pulse text-neutral-500">▸ thinking</span>
        ) : (
          event.replace("→ ", "").replace("✓ ", "")
        )}
      </span>
    </motion.div>
  );
}

function ExecutionLog({
  activeSkill,
  onRequestReceived,
  onLogEvent,
  start,
  startStreaming,
}: {
  activeSkill: SkillTab;
  onRequestReceived: () => void;
  onLogEvent: (line: string) => void;
  start: boolean;
  startStreaming: boolean;
}) {
  const [cursor, setCursor] = useState(6);
  const previousCursorRef = useRef(cursor);
  const logEntries = activeSkill.logs;
  const visibleLogs = Array.from({ length: 6 }, (_, offset) => {
    const index = (cursor + offset) % logEntries.length;
    return logEntries[index];
  });

  useEffect(() => {
    if (!startStreaming) return;

    const interval = window.setInterval(() => {
      setCursor((current) => {
        return (current + 1) % logEntries.length;
      });
    }, 1800);

    return () => window.clearInterval(interval);
  }, [logEntries.length, startStreaming]);

  useEffect(() => {
    if (!startStreaming || previousCursorRef.current === cursor) return;

    previousCursorRef.current = cursor;
    const newestLine = logEntries[(cursor + 5) % logEntries.length];

    onLogEvent(newestLine);

    if (/REQ-\d+ received/.test(newestLine)) {
      onRequestReceived();
    }
  }, [cursor, logEntries, onLogEvent, onRequestReceived, startStreaming]);

  return (
    <div className="min-h-[220px] bg-neutral-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.35, ease: "easeOut" }}
        className="flex min-h-10 items-center justify-between border-b border-neutral-200 px-3"
      >
        <span className="font-mono text-[11.5px] text-text-muted">
          {activeSkill.command}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-emerald-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          live
        </span>
      </motion.div>
      <div className="space-y-1 px-3 py-3">
        <AnimatePresence initial={false}>
          {visibleLogs.map((line) => (
            <LogLine key={`${activeSkill.id}-${line}`} line={line} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CenterConsole({
  activeSkill,
  onRequestReceived,
  onLogEvent,
  activeLine,
  start,
  startStreaming,
}: {
  activeSkill: SkillTab;
  onRequestReceived: () => void;
  onLogEvent: (line: string) => void;
  activeLine: number | null;
  start: boolean;
  startStreaming: boolean;
}) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={start ? { opacity: 1 } : { opacity: 0 }}
      transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
      className="order-1 min-w-0 bg-bg-card lg:order-2"
    >
      <EditorPanel
        activeLine={activeLine}
        activeSkill={activeSkill}
        start={start}
      />
      <ExecutionLog
        key={activeSkill.id}
        activeSkill={activeSkill}
        onLogEvent={onLogEvent}
        onRequestReceived={onRequestReceived}
        start={start}
        startStreaming={startStreaming}
      />
    </motion.main>
  );
}

function CountUp({
  value,
  start,
}: {
  value: number;
  start: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);
  const previousValueRef = useRef(0);

  useEffect(() => {
    if (!inView || !start) return;

    const from = previousValueRef.current;
    previousValueRef.current = value;

    if (shouldReduceMotion) {
      window.requestAnimationFrame(() => setDisplayValue(value));
      return;
    }

    let frame = 0;
    let animationFrame = 0;
    const totalFrames = 90;

    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (value - from) * eased));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [inView, shouldReduceMotion, start, value]);

  return (
    <motion.span
      ref={ref}
      animate={{
        color: value > 847 ? ["#262626", "#059669", "#262626"] : "#262626",
        textShadow:
          value > 847
            ? [
                "0 0 0 rgba(93,202,165,0)",
                "0 0 14px rgba(16,185,129,0.25)",
                "0 0 0 rgba(93,202,165,0)",
              ]
            : "0 0 0 rgba(93,202,165,0)",
      }}
      transition={{ duration: 0.4 }}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}

function AnimatedPercent({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);
  const previousValueRef = useRef(value);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const from = previousValueRef.current;
    previousValueRef.current = value;

    if (shouldReduceMotion) {
      window.requestAnimationFrame(() => setDisplayValue(value));
      return;
    }

    let frame = 0;
    let animationFrame = 0;
    const totalFrames = 36;

    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (value - from) * eased));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    animationFrame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [shouldReduceMotion, value]);

  return <>{displayValue}%</>;
}

function DonutChart({
  percent,
  start,
}: {
  percent: number;
  start: boolean;
}) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - percent / 100);

  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="8"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#e0552f"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: start ? targetOffset : circumference }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: start ? 1 : 0.6, ease: "easeOut" }}
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(23,23,23,0.18)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`10 ${circumference - 10}`}
          animate={{ rotate: [0, 360, 360] }}
          style={{ transformOrigin: "40px 40px" }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity,
            times: [0, 0.1875, 1],
          }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[16px] font-semibold text-neutral-800">
        <AnimatedPercent value={percent} />
      </span>
    </div>
  );
}

function ServiceIcon({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <motion.span
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 bg-white font-mono text-[10px] font-semibold text-neutral-400"
      animate={{
        borderColor: active ? "rgba(224,85,47,0.45)" : "rgba(229,229,229,1)",
        backgroundColor: active ? "rgba(224,85,47,0.08)" : "rgba(255,255,255,1)",
        color: active ? "rgba(194,65,12,1)" : "rgba(115,115,115,1)",
        boxShadow: active
          ? "0 0 0 3px rgba(224,85,47,0.12)"
          : "0 0 0 0px rgba(224,85,47,0)",
      }}
      transition={{ duration: active ? 0.2 : 0.4 }}
    >
      {label.slice(0, 1)}
    </motion.span>
  );
}

function MetricsPanel({
  inquiryCount,
  start,
  startMetrics,
}: {
  inquiryCount: number;
  start: boolean;
  startMetrics: boolean;
}) {
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const services = ["Stripe", "Slack", "Sheets", "LLM", "GA4"];

  useEffect(() => {
    let timeoutId = 0;
    let resetTimeoutId = 0;

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        setActiveServiceIndex(Math.floor(Math.random() * services.length));
        resetTimeoutId = window.setTimeout(() => setActiveServiceIndex(null), 600);
        schedule();
      }, randomBetween(2500, 4000));
    };

    schedule();
    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(resetTimeoutId);
    };
  }, [services.length]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={start ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
      className="order-3 border-t border-border bg-bg-card-alt p-4 lg:border-l lg:border-t-0"
    >
      <p className="mb-4 border-b border-neutral-200 pb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-800">
        Sample week
      </p>

      <div className="space-y-4">
        <div className="border-b border-neutral-200 pb-4">
          <p className="mb-1 text-[12px] text-text-muted">Tasks automated</p>
          <p className="text-2xl font-semibold tracking-tight text-neutral-800">
            <CountUp start={startMetrics} value={inquiryCount} />
          </p>
          <p className="mt-1 text-[12px] text-emerald-600">↑ 18% vs last week</p>
        </div>

        <div className="border-b border-neutral-200 pb-4">
          <p className="mb-1 text-[12px] text-text-muted">Hours saved</p>
          <p className="text-[18px] font-semibold tracking-tight text-neutral-800">
            36h
          </p>
          <p className="mt-1 text-[12px] text-emerald-600">across 4 workflows</p>
        </div>

        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div>
            <p className="mb-1 text-[12px] text-text-muted">Auto-resolved</p>
            <p className="font-mono text-[11px] text-text-muted">human review 22%</p>
          </div>
          <DonutChart percent={78} start={startMetrics} />
        </div>

        <div className="border-b border-neutral-200 pb-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
            Activity
          </p>
          <motion.div
            variants={{
              hidden: {},
              show: {
                transition: { delayChildren: 1.4, staggerChildren: 0.03 },
              },
            }}
            initial="hidden"
            animate={startMetrics ? "show" : "hidden"}
            className="flex h-8 items-end gap-0.5 overflow-hidden font-mono text-[18px] leading-none text-warm/60"
          >
            {activityBars.map((bar, index) => {
              const isLatest = index === activityBars.length - 1;

              return (
              <motion.span
                key={`${bar}-${index}`}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  show: { opacity: 1, y: 0 },
                }}
                animate={
                  isLatest
                    ? {
                        scaleY: [0.85, 1, 0.85],
                        opacity: [0.65, 1, 0.65],
                      }
                    : undefined
                }
                style={{ transformOrigin: "bottom" }}
                transition={
                  isLatest
                    ? {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                    : { delay: index * 0.05, duration: 0.25 }
                }
              >
                {bar}
              </motion.span>
              );
            })}
          </motion.div>
        </div>

        <div>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
            Connected
          </p>
          <div className="flex flex-wrap gap-2">
            {services.map((service, index) => (
              <ServiceIcon
                key={service}
                label={service}
                active={activeServiceIndex === index}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

export default function AppPreview() {
  const previewRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const previewInView = useInView(previewRef, { once: true, amount: 0.25 });
  const inquiryCount = 1284;
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [startMetrics, setStartMetrics] = useState(false);
  const [startStreaming, setStartStreaming] = useState(false);
  const startSequence = previewInView;
  const activeSkill = skillTabs[activeSkillIndex];
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 140, damping: 22 });
  const springRotateY = useSpring(rotateY, { stiffness: 140, damping: 22 });

  // Sample figures: the counter stays fixed so the demo never reads as live data.
  const handleRequestReceived = useCallback(() => {}, []);
  const handleLogEvent = useCallback((line: string) => {
    const nextLine = getHighlightLine(line);

    if (nextLine === null) return;

    setActiveLine(nextLine);
    window.setTimeout(() => setActiveLine(null), 1150);
  }, []);

  useEffect(() => {
    if (!previewInView) return;

    if (shouldReduceMotion) {
      const frame = window.requestAnimationFrame(() => {
        setStartMetrics(true);
        setStartStreaming(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const metricsTimeout = window.setTimeout(() => setStartMetrics(true), 1200);
    const logTimeout = window.setTimeout(() => setStartStreaming(true), 1600);

    return () => {
      window.clearTimeout(metricsTimeout);
      window.clearTimeout(logTimeout);
    };
  }, [previewInView, shouldReduceMotion]);

  useEffect(() => {
    if (!startStreaming) return;

    const interval = window.setInterval(() => {
      setActiveSkillIndex((current) => (current + 1) % skillTabs.length);
      setActiveLine(null);
    }, 9000);

    return () => window.clearInterval(interval);
  }, [startStreaming]);

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion) return;

      const rect = event.currentTarget.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      rotateX.set(y * -3);
      rotateY.set(x * 3);
    },
    [rotateX, rotateY, shouldReduceMotion],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <section className="relative w-full min-w-0 px-4 py-10 sm:px-10 sm:py-14">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <motion.div
        ref={previewRef}
        className="relative mx-auto w-full min-w-0"
        data-app-preview
        initial={{ opacity: 0 }}
        animate={startSequence ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ perspective: 1500 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* App window */}
        <motion.div
          className="bg-bg-card-alt border border-border rounded-xl overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.15)] ring-4 ring-neutral-900/[0.04] max-w-full min-w-0"
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: "preserve-3d",
          }}
        >
          <div className="grid min-w-0 grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_240px]">
            <SkillLibrary start={startSequence} />
            <CenterConsole
              activeSkill={activeSkill}
              activeLine={activeLine}
              onLogEvent={handleLogEvent}
              onRequestReceived={handleRequestReceived}
              start={startSequence}
              startStreaming={startStreaming}
            />
            <MetricsPanel
              inquiryCount={inquiryCount}
              start={startSequence}
              startMetrics={startMetrics}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

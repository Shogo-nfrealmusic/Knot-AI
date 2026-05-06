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
  { name: "inquiry-router", sparkline: "▁▂▃▅▆▇█▇▅" },
  { name: "finance-review", sparkline: "▂▃▅▇▆▅▃▂▁" },
  { name: "support-triage", sparkline: "▁▁▂▃▄▅▆▇▇" },
  { name: "contract-scan", sparkline: "▃▅▇█▇▅▃▂▁" },
];

const idleSkills = [
  "ops-qa-checklist",
  "inventory-sync",
  "meeting-notes",
  "expense-categorizer",
];

const workspaces = [
  "Customer support",
  "Finance ops",
  "Legal review",
  "Internal IT",
];

type CodeLineItem = { line: string; type: "body" | "yaml" | "heading" };

const skillTabs = [
  {
    id: "inquiry-router",
    file: "inquiry-router/SKILL.md",
    command: "$ knot run inquiry-router --watch",
    codeLines: [
      { line: "---", type: "body" },
      { line: "name: inquiry-router", type: "yaml" },
      { line: "triggers: [email, form, slack]", type: "yaml" },
      { line: "owners: [billing-ops, support]", type: "yaml" },
      { line: "---", type: "body" },
      { line: "", type: "body" },
      { line: "# Inquiry Routing", type: "heading" },
      { line: "", type: "body" },
      { line: "When a new inquiry arrives:", type: "body" },
      { line: "  1. Classify intent and category", type: "body" },
      { line: "  2. Score priority (P0-P3)", type: "body" },
      { line: "  3. Route to the right owner", type: "body" },
      { line: "  4. Draft a contextual reply", type: "body" },
    ] satisfies CodeLineItem[],
    logs: [
      "14:32:08.421  REQ-1842 received  via slack",
      "14:32:08.502  → classify_intent()",
      "14:32:09.118  ✓ category: billing",
      "14:32:09.119  ✓ priority: high",
      "14:32:09.203  → route(team: billing-ops)",
      "14:32:09.487  ✓ draft ready · 142 chars",
      "14:32:11.802  REQ-1843 received  via email",
      "14:32:11.901  → classify_intent()",
      "14:32:12.288  ▸ thinking",
      "14:32:13.044  ✓ category: refund",
      "14:32:13.812  ✓ priority: medium",
      "14:32:14.022  → route(team: support)",
      "14:32:14.661  ✓ draft ready · 98 chars",
      "14:32:18.117  REQ-1844 received  via form",
    ],
  },
  {
    id: "finance-review",
    file: "finance-review/SKILL.md",
    command: "$ knot run finance-review --watch",
    codeLines: [
      { line: "---", type: "body" },
      { line: "name: finance-review", type: "yaml" },
      { line: "triggers: [invoice_uploaded, expense_submitted]", type: "yaml" },
      { line: "owners: [finance-ops]", type: "yaml" },
      { line: "---", type: "body" },
      { line: "", type: "body" },
      { line: "# Finance Review", type: "heading" },
      { line: "", type: "body" },
      { line: "For each new financial document:", type: "body" },
      { line: "  1. Extract line items and totals", type: "body" },
      { line: "  2. Validate against policy rules", type: "body" },
      { line: "  3. Flag exceptions for human review", type: "body" },
      { line: "  4. Post approved entries to ledger", type: "body" },
    ] satisfies CodeLineItem[],
    logs: [
      "15:04:02.112  INV-3318 received  via email",
      "15:04:02.304  → extract_line_items()",
      "15:04:03.018  ✓ items: 14 · total: $48,290",
      "15:04:03.612  → validate_policy()",
      "15:04:04.021  ✓ within limits",
      "15:04:04.500  ✓ posted to ledger",
      "15:04:08.117  INV-3319 received  via upload",
      "15:04:08.302  → extract_line_items()",
      "15:04:08.884  ▸ thinking",
      "15:04:09.224  ✓ items: 7 · total: $12,480",
      "15:04:09.701  → validate_policy()",
      "15:04:10.014  ✓ within limits",
    ],
  },
  {
    id: "contract-scan",
    file: "contract-scan/SKILL.md",
    command: "$ knot run contract-scan --watch",
    codeLines: [
      { line: "---", type: "body" },
      { line: "name: contract-scan", type: "yaml" },
      { line: "triggers: [pdf_uploaded, link_received]", type: "yaml" },
      { line: "owners: [legal, procurement]", type: "yaml" },
      { line: "---", type: "body" },
      { line: "", type: "body" },
      { line: "# Contract Scan", type: "heading" },
      { line: "", type: "body" },
      { line: "For each incoming contract:", type: "body" },
      { line: "  1. Extract parties, terms, and dates", type: "body" },
      { line: "  2. Compare against standard clauses", type: "body" },
      { line: "  3. Surface deviations and risks", type: "body" },
      { line: "  4. Draft a redline summary", type: "body" },
    ] satisfies CodeLineItem[],
    logs: [
      "16:18:20.144  DOC-882 received  via pdf",
      "16:18:20.318  → extract_terms()",
      "16:18:21.006  ✓ parties: 2 · pages: 14",
      "16:18:21.504  → check_clauses()",
      "16:18:22.209  ⚠ deviation: termination notice",
      "16:18:22.880  ✓ redline ready · 6 changes",
      "16:18:28.117  DOC-883 received  via link",
      "16:18:28.302  → extract_terms()",
      "16:18:28.882  ▸ thinking",
      "16:18:29.406  ✓ parties: 3 · pages: 22",
      "16:18:30.104  → check_clauses()",
      "16:18:30.774  ✓ redline ready · 4 changes",
    ],
  },
] as const;

type SkillTab = (typeof skillTabs)[number];

const activityBars = "▁▁▂▃▄▆▇█▇▆▅▄▃▄▅▇█▇▆▅▄▃▂▁".split("");

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function formatResolution(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function getHighlightLine(line: string) {
  const normalized = line.toLowerCase();

  if (
    normalized.includes("classify_intent") ||
    normalized.includes("category") ||
    normalized.includes("extract_line_items") ||
    normalized.includes("extract_terms") ||
    normalized.includes("items:") ||
    normalized.includes("parties:")
  ) {
    return 9;
  }

  if (
    normalized.includes("priority") ||
    normalized.includes("validate_policy") ||
    normalized.includes("within limits") ||
    normalized.includes("check_clauses")
  ) {
    return 10;
  }

  if (
    normalized.includes("route") ||
    normalized.includes("exception") ||
    normalized.includes("deviation")
  ) {
    return 11;
  }

  if (
    normalized.includes("draft ready") ||
    normalized.includes("posted to ledger") ||
    normalized.includes("redline ready")
  ) {
    return 12;
  }

  return null;
}

function KnotMark() {
  return (
    <div className="grid h-4 w-4 shrink-0 grid-cols-2 gap-0.5 rounded-[5px] border border-white/10 bg-white/[0.03] p-0.5">
      <span className="rounded-[2px] bg-[#F0997B]/80" />
      <span className="rounded-[2px] bg-white/20" />
      <span className="rounded-[2px] bg-white/20" />
      <span className="rounded-[2px] bg-[#5DCAA5]/80" />
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
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-[#d0d6e0]">
          KNOT CONSOLE
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-[13px] font-semibold text-[#d0d6e0]">Skills</span>
        <span className="font-mono text-[11px] text-text-muted">12</span>
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
              className="absolute left-0 top-1 bottom-1 rounded-full bg-[#cc785c]"
            />
            <motion.span
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute inset-0 bg-white/[0.04]"
            />
            <span className="relative z-10 h-1 w-1 rounded-full bg-[#5DCAA5]" />
            <span className="relative z-10 min-w-0 flex-1 truncate font-mono text-[12px] text-[#d0d6e0]">
              {skill.name}
            </span>
            <motion.span
              variants={{
                rest: { opacity: 0.6 },
                hover: { opacity: 0.85 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="relative z-10 font-mono text-[11px] text-[#cc785c]"
            >
              {skill.sparkline}
            </motion.span>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 space-y-1">
        <p className="px-1 pb-1 font-mono text-[11px] text-text-muted">
          ▸ Idle (8)
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
              className="absolute left-0 top-1 bottom-1 rounded-full bg-[#cc785c]"
            />
            <motion.span
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1 },
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute inset-0 bg-white/[0.04]"
            />
            <span className="relative z-10 h-1.5 w-1.5 rounded-full border border-white/20" />
            <span className="relative z-10 font-mono text-[12px] text-white/40">{skill}</span>
          </motion.div>
        ))}
        <p className="px-1 pt-1 font-mono text-[11px] text-text-muted">
          + 4 more
        </p>
      </div>

      <div className="mt-5 border-t border-white/5 pt-4">
        <p className="mb-2 px-1 font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
          Workspaces
        </p>
        <div className="space-y-1">
          {workspaces.map((workspace) => (
            <div
              key={workspace}
              className="flex h-7 items-center rounded-md px-1.5 text-[12px] font-medium text-text-secondary transition-colors hover:bg-white/[0.03] hover:text-[#d0d6e0]"
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
      ? "text-[#d0d6e0]"
      : type === "yaml"
        ? "text-white/70"
        : "text-white/70";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 4 },
        show: { opacity: 1, y: 0 },
      }}
      animate={{
        backgroundColor: active
          ? "rgba(204,120,92,0.08)"
          : "rgba(204,120,92,0)",
      }}
      transition={{ duration: active ? 0.15 : 0.4, ease: "easeOut" }}
      className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-sm"
    >
      <motion.span
        animate={{ opacity: active ? 1 : 0, scaleY: active ? 1 : 0.4 }}
        transition={{ duration: active ? 0.15 : 0.4, ease: "easeOut" }}
        className="absolute left-0 top-0.5 bottom-0.5 w-[2px] rounded-full bg-[#cc785c]"
      />
      <span className="select-none text-right font-mono text-[11px] leading-5 text-white/25">
        {index + 1}
      </span>
      <code className={`min-w-0 whitespace-pre font-mono text-[11.5px] leading-5 ${textClass}`}>
        {keyMatch ? (
          <>
            <span className="text-[#9FE1CB]">{keyMatch[1]}</span>
            <span className="text-[#F0997B]">{keyMatch[2]}</span>
          </>
        ) : (
          line
        )}
        {index === 12 ? (
          <span className="ml-1 inline-block h-4 w-px animate-pulse bg-[#F0997B] align-[-0.2em]" />
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
      <div className="flex min-h-10 items-center justify-between border-b border-white/5 bg-bg-elevated px-3">
        <div className="flex min-w-0 items-end gap-1 overflow-x-auto">
          {skillTabs.map((skill) => {
            const active = skill.id === activeSkill.id;

            return (
              <div
                key={skill.id}
                className={`flex shrink-0 items-center gap-2 rounded-t-md border-x border-t px-3 py-2 ${
                  active
                    ? "border-white/5 bg-[#0a0a0a]"
                    : "border-transparent bg-transparent"
                }`}
              >
                <span className="h-3 w-2.5 rounded-[2px] border border-white/20" />
                <span
                  className={`font-mono text-[11.5px] ${
                    active ? "text-[#d0d6e0]" : "text-white/40"
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
          className="rounded-md border border-white/10 px-2 py-1 font-mono text-[10px] text-text-secondary"
          tabIndex={-1}
        >
          ⌘ Edit
        </button>
      </div>
      <motion.div
        className="overflow-x-auto bg-[#0a0a0a] px-3 py-4"
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
      <span className="text-white/35">{timestamp}</span>
      <span className="min-w-0 text-white/75">
        {isArrow ? <span className="text-[#cc785c]/70">→ </span> : null}
        {isCheck ? <span className="text-[#5DCAA5]">✓ </span> : null}
        {isThinking ? (
          <span className="animate-pulse text-white/50">▸ thinking</span>
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
    <div className="min-h-[220px] bg-black/60">
      <motion.div
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.9, duration: 0.35, ease: "easeOut" }}
        className="flex min-h-10 items-center justify-between border-b border-white/5 px-3"
      >
        <span className="font-mono text-[11.5px] text-text-muted">
          {activeSkill.command}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[#5DCAA5]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#5DCAA5]" />
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
        color: value > 847 ? ["#d0d6e0", "#ffffff", "#d0d6e0"] : "#d0d6e0",
        textShadow:
          value > 847
            ? [
                "0 0 0 rgba(93,202,165,0)",
                "0 0 14px rgba(93,202,165,0.35)",
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
          stroke="rgba(255,255,255,0.09)"
          strokeWidth="8"
        />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#cc785c"
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
          stroke="rgba(255,255,255,0.28)"
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
      <span className="absolute inset-0 flex items-center justify-center text-[16px] font-semibold text-[#d0d6e0]">
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
      className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] font-mono text-[10px] font-semibold text-white/30"
      animate={{
        borderColor: active ? "rgba(204,120,92,0.55)" : "rgba(255,255,255,0.1)",
        backgroundColor: active ? "rgba(204,120,92,0.14)" : "rgba(255,255,255,0.02)",
        color: active ? "rgba(240,153,123,1)" : "rgba(255,255,255,0.3)",
        boxShadow: active
          ? "0 0 18px rgba(204,120,92,0.28)"
          : "0 0 0 rgba(204,120,92,0)",
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
  const [resolutionSeconds, setResolutionSeconds] = useState(222);
  const [autoResolved, setAutoResolved] = useState(72);
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
  const services = ["Slack", "Gmail", "Sheets", "Notion", "Calendar"];

  useEffect(() => {
    let timeoutId = 0;

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        const next = Math.round(220 + randomBetween(-5, 5));
        setResolutionSeconds(Math.max(210, Math.min(235, next)));
        schedule();
      }, randomBetween(5000, 10000));
    };

    schedule();
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    let timeoutId = 0;

    const schedule = () => {
      timeoutId = window.setTimeout(() => {
        setAutoResolved((current) => {
          const drift = Math.random() > 0.5 ? 1 : -1;
          return Math.max(70, Math.min(74, current + drift));
        });
        schedule();
      }, randomBetween(8000, 12000));
    };

    schedule();
    return () => window.clearTimeout(timeoutId);
  }, []);

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
      <p className="mb-4 border-b border-white/5 pb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d0d6e0]">
        Today
      </p>

      <div className="space-y-4">
        <div className="border-b border-white/5 pb-4">
          <p className="mb-1 text-[12px] text-text-muted">Inquiries handled</p>
          <p className="text-2xl font-semibold tracking-tight text-[#d0d6e0]">
            <CountUp start={startMetrics} value={inquiryCount} />
          </p>
          <p className="mt-1 text-[12px] text-[#5DCAA5]">↑ 12%</p>
        </div>

        <div className="border-b border-white/5 pb-4">
          <p className="mb-1 text-[12px] text-text-muted">Avg resolution</p>
          <motion.p
            key={resolutionSeconds}
            initial={{ opacity: 0.55, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[18px] font-semibold tracking-tight text-[#d0d6e0]"
          >
            {formatResolution(resolutionSeconds)}
          </motion.p>
          <p className="mt-1 text-[12px] text-[#5DCAA5]">↓ 28%</p>
        </div>

        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <p className="mb-1 text-[12px] text-text-muted">Auto-resolved</p>
            <p className="font-mono text-[11px] text-text-muted">human review 28%</p>
          </div>
          <DonutChart percent={autoResolved} start={startMetrics} />
        </div>

        <div className="border-b border-white/5 pb-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
            Activity · 24H
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
            className="flex h-8 items-end gap-0.5 overflow-hidden font-mono text-[18px] leading-none text-[#cc785c]/60"
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
  const [inquiryCount, setInquiryCount] = useState(847);
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

  const handleRequestReceived = useCallback(() => {
    setInquiryCount((current) => current + 1);
  }, []);
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
    <section className="relative w-full min-w-0 px-0 pb-8 sm:pb-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <motion.div
        ref={previewRef}
        className="relative mx-auto w-[min(100%,94vw)] min-w-0 max-w-full sm:w-[90%] md:w-[85%]"
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
          className="bg-bg-card-alt border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-w-full min-w-0"
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

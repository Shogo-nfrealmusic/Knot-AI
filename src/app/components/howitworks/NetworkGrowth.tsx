"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
};

type Month = {
  label: string;
  count: number;
  nodes: Node[];
  edges: string[][];
};

const months: Month[] = [
  {
    label: "MONTH 1",
    count: 1,
    nodes: [{ id: "inquiry", x: 300, y: 140, label: "inquiry-router" }],
    edges: [],
  },
  {
    label: "MONTH 2",
    count: 3,
    nodes: [
      { id: "inquiry", x: 300, y: 140, label: "inquiry-router" },
      { id: "finance", x: 180, y: 90, label: "finance-review" },
      { id: "support", x: 420, y: 90, label: "support-triage" },
    ],
    edges: [
      ["inquiry", "finance"],
      ["inquiry", "support"],
    ],
  },
  {
    label: "MONTH 3",
    count: 5,
    nodes: [
      { id: "inquiry", x: 300, y: 140, label: "inquiry-router" },
      { id: "finance", x: 180, y: 90, label: "finance-review" },
      { id: "support", x: 420, y: 90, label: "support-triage" },
      { id: "contract", x: 130, y: 200, label: "contract-scan" },
      { id: "expense", x: 470, y: 200, label: "expense-cat" },
    ],
    edges: [
      ["inquiry", "finance"],
      ["inquiry", "support"],
      ["finance", "contract"],
      ["support", "expense"],
    ],
  },
  {
    label: "MONTH 4",
    count: 8,
    nodes: [
      { id: "inquiry", x: 300, y: 140, label: "inquiry-router" },
      { id: "finance", x: 180, y: 90, label: "finance-review" },
      { id: "support", x: 420, y: 90, label: "support-triage" },
      { id: "contract", x: 130, y: 200, label: "contract-scan" },
      { id: "expense", x: 470, y: 200, label: "expense-cat" },
      { id: "qa", x: 60, y: 130, label: "ops-qa" },
      { id: "meeting", x: 540, y: 130, label: "meeting-notes" },
      { id: "invent", x: 300, y: 50, label: "inventory-sync" },
    ],
    edges: [
      ["inquiry", "finance"],
      ["inquiry", "support"],
      ["finance", "contract"],
      ["support", "expense"],
      ["contract", "qa"],
      ["expense", "meeting"],
      ["finance", "invent"],
      ["support", "invent"],
    ],
  },
  {
    label: "MONTH 5",
    count: 11,
    nodes: [
      { id: "inquiry", x: 300, y: 140, label: "inquiry-router" },
      { id: "finance", x: 180, y: 90, label: "finance-review" },
      { id: "support", x: 420, y: 90, label: "support-triage" },
      { id: "contract", x: 130, y: 200, label: "contract-scan" },
      { id: "expense", x: 470, y: 200, label: "expense-cat" },
      { id: "qa", x: 60, y: 130, label: "ops-qa" },
      { id: "meeting", x: 540, y: 130, label: "meeting-notes" },
      { id: "invent", x: 300, y: 50, label: "inventory-sync" },
      { id: "kb", x: 300, y: 230, label: "kb-search" },
      { id: "doc", x: 230, y: 230, label: "doc-extract" },
      { id: "reply", x: 370, y: 230, label: "reply-draft" },
    ],
    edges: [
      ["inquiry", "finance"],
      ["inquiry", "support"],
      ["finance", "contract"],
      ["support", "expense"],
      ["contract", "qa"],
      ["expense", "meeting"],
      ["finance", "invent"],
      ["support", "invent"],
      ["inquiry", "kb"],
      ["contract", "doc"],
      ["inquiry", "reply"],
      ["kb", "doc"],
      ["kb", "reply"],
    ],
  },
  {
    label: "MONTH 6",
    count: 14,
    nodes: [
      { id: "inquiry", x: 300, y: 140, label: "inquiry-router" },
      { id: "finance", x: 180, y: 90, label: "finance-review" },
      { id: "support", x: 420, y: 90, label: "support-triage" },
      { id: "contract", x: 130, y: 200, label: "contract-scan" },
      { id: "expense", x: 470, y: 200, label: "expense-cat" },
      { id: "qa", x: 60, y: 130, label: "ops-qa" },
      { id: "meeting", x: 540, y: 130, label: "meeting-notes" },
      { id: "invent", x: 300, y: 50, label: "inventory-sync" },
      { id: "kb", x: 300, y: 230, label: "kb-search" },
      { id: "doc", x: 230, y: 230, label: "doc-extract" },
      { id: "reply", x: 370, y: 230, label: "reply-draft" },
      { id: "analytics", x: 100, y: 50, label: "analytics" },
      { id: "lead", x: 500, y: 50, label: "lead-score" },
      { id: "onboard", x: 50, y: 250, label: "onboard" },
    ],
    edges: [
      ["inquiry", "finance"],
      ["inquiry", "support"],
      ["finance", "contract"],
      ["support", "expense"],
      ["contract", "qa"],
      ["expense", "meeting"],
      ["finance", "invent"],
      ["support", "invent"],
      ["inquiry", "kb"],
      ["contract", "doc"],
      ["inquiry", "reply"],
      ["kb", "doc"],
      ["kb", "reply"],
      ["finance", "analytics"],
      ["support", "lead"],
      ["qa", "onboard"],
      ["analytics", "invent"],
      ["lead", "inquiry"],
    ],
  },
];

function edgeKey(edge: string[]) {
  return [...edge].sort().join("-");
}

export default function NetworkGrowth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [signalCycle, setSignalCycle] = useState(0);
  const month = months[currentMonth];

  const nodeMap = useMemo(
    () => new Map(month.nodes.map((node) => [node.id, node])),
    [month.nodes],
  );

  const newestNodeIds = useMemo(() => {
    if (currentMonth === 0) return new Set(month.nodes.map((node) => node.id));

    const previous = new Set(months[currentMonth - 1].nodes.map((node) => node.id));
    return new Set(
      month.nodes
        .filter((node) => !previous.has(node.id))
        .map((node) => node.id),
    );
  }, [currentMonth, month.nodes]);

  const activeSignals = useMemo(
    () =>
      month.edges
        .map((edge, index) => ({ edge, index }))
        .filter(({ index }) => index % 3 === signalCycle % 3)
        .slice(0, 5),
    [month.edges, signalCycle],
  );

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

    const delay = currentMonth === months.length - 1 ? 3500 : 2000;
    const timeout = window.setTimeout(() => {
      setCurrentMonth((index) => (index + 1) % months.length);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [currentMonth, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = window.setInterval(() => {
      setSignalCycle((cycle) => cycle + 1);
    }, 850);

    return () => window.clearInterval(interval);
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-7"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.75)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.05em]">
        <span className="text-white/40">Network Growth</span>
        <span className="text-[rgba(204,120,92,0.95)]">
          {month.label} · {month.count} {month.count === 1 ? "Skill" : "Skills"}
        </span>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-white/5 bg-white/1">
        <svg
          viewBox="0 0 600 280"
          className="h-[280px] w-full"
          role="img"
          aria-label={`${month.label} network with ${month.count} skills`}
        >
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(204,120,92,0.5)" />
              <stop offset="70%" stopColor="rgba(204,120,92,0.08)" />
              <stop offset="100%" stopColor="rgba(204,120,92,0)" />
            </radialGradient>
          </defs>

          <AnimatePresence>
            {month.edges.map((edge, index) => {
              const [fromId, toId] = edge;
              const from = nodeMap.get(fromId);
              const to = nodeMap.get(toId);
              if (!from || !to) return null;

              return (
                <motion.line
                  key={edgeKey(edge)}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="rgba(204,120,92,0.25)"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: currentMonth === 0 ? 0.4 : 0.75,
                    delay: index * 0.06,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {activeSignals.map(({ edge, index }) => {
              const [fromId, toId] = edge;
              const from = nodeMap.get(fromId);
              const to = nodeMap.get(toId);
              if (!from || !to) return null;

              return (
                <motion.circle
                  key={`${edgeKey(edge)}-${signalCycle}`}
                  r="2.5"
                  fill="rgba(93,202,165,0.95)"
                  initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                  animate={{
                    cx: [from.x, (from.x + to.x) / 2, to.x],
                    cy: [from.y, (from.y + to.y) / 2, to.y],
                    opacity: [0, 1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.15,
                    delay: (index % 4) * 0.08,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </AnimatePresence>

          <AnimatePresence>
            {month.nodes.map((node, index) => (
              <motion.g
                key={node.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="18"
                  fill="url(#nodeGlow)"
                  animate={{
                    opacity: newestNodeIds.has(node.id) ? [0.25, 0.65, 0.25] : [0.12, 0.28, 0.12],
                    scale: newestNodeIds.has(node.id) ? [0.85, 1.2, 0.85] : [0.9, 1.05, 0.9],
                  }}
                  transition={{
                    duration: newestNodeIds.has(node.id) ? 1.6 : 2.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.04,
                  }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
                {node.id === "inquiry" || newestNodeIds.has(node.id) ? (
                  <text
                    x={node.x}
                    y={node.y - 18}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize="9"
                    fill="rgba(255,255,255,0.7)"
                  >
                    {node.label}
                  </text>
                ) : null}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill="rgba(204,120,92,0.12)"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.5"
                  fill="rgba(204,120,92,0.95)"
                />
                {newestNodeIds.has(node.id) ? (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="11"
                    fill="none"
                    stroke="rgba(93,202,165,0.7)"
                    strokeWidth="0.8"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.7, 1.7, 2.2] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                ) : null}
              </motion.g>
            ))}
          </AnimatePresence>
        </svg>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 font-mono text-[9px] uppercase tracking-[0.05em] sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/2 px-3 py-2">
          <p className="text-white/35">Skills</p>
          <p className="mt-1 text-[rgba(204,120,92,0.95)]">{month.count}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/2 px-3 py-2">
          <p className="text-white/35">Links</p>
          <p className="mt-1 text-white/80">{month.edges.length}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/2 px-3 py-2">
          <p className="text-white/35">Signals</p>
          <p className="mt-1 text-[rgba(93,202,165,0.9)]">
            {Math.max(1, activeSignals.length)} live
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-6 gap-0 font-mono text-[10px] uppercase tracking-[0.05em]">
        {months.map((item, index) => {
          const isActive = index === currentMonth;
          const isPast = index < currentMonth;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setCurrentMonth(index)}
              className={`group border-b py-3 text-center transition-colors duration-200 ${
                isActive
                  ? "border-[rgba(204,120,92,0.95)] text-[rgba(204,120,92,0.95)]"
                  : isPast
                    ? "border-white/15 text-white/50"
                    : "border-white/5 text-white/25"
              }`}
            >
              <span>M{index + 1}</span>
              <span
                className={`mx-auto mt-2 block h-1 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 bg-[rgba(204,120,92,0.95)]"
                    : isPast
                      ? "w-5 bg-white/25"
                      : "w-2 bg-white/10 group-hover:w-4"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

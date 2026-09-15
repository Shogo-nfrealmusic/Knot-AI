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

const account = { id: "account", x: 300, y: 140, label: "@imshogo.k" };
const hooks = { id: "hooks", x: 180, y: 90, label: "hooks" };
const captions = { id: "captions", x: 420, y: 90, label: "captions" };
const watch = { id: "watch", x: 130, y: 200, label: "watch time" };
const shares = { id: "shares", x: 470, y: 200, label: "share count" };
const views = { id: "views", x: 60, y: 130, label: "1M+ views" };
const reach = { id: "reach", x: 540, y: 130, label: "reach" };
const saves = { id: "saves", x: 300, y: 50, label: "saves" };
const insights = { id: "insights", x: 300, y: 230, label: "13-mo data" };
const followerSignal = { id: "followerSignal", x: 200, y: 245, label: "follower count" };
const shareReach = { id: "shareReach", x: 400, y: 245, label: "shares → reach" };
const fitness = { id: "fitness", x: 100, y: 50, label: "fitness" };
const motivation = { id: "motivation", x: 500, y: 50, label: "motivation" };
const selfGrowth = { id: "selfGrowth", x: 50, y: 250, label: "self-growth" };

const months: Month[] = [
  {
    label: "START · 0 FOLLOWERS",
    count: 1,
    nodes: [account],
    edges: [],
  },
  {
    label: "FIRST POSTS",
    count: 3,
    nodes: [account, hooks, captions],
    edges: [
      ["account", "hooks"],
      ["account", "captions"],
    ],
  },
  {
    label: "TESTING FORMATS",
    count: 5,
    nodes: [account, hooks, captions, watch, shares],
    edges: [
      ["account", "hooks"],
      ["account", "captions"],
      ["hooks", "watch"],
      ["captions", "shares"],
    ],
  },
  {
    label: "1M+ VIEW VIDEOS",
    count: 8,
    nodes: [account, hooks, captions, watch, shares, views, reach, saves],
    edges: [
      ["account", "hooks"],
      ["account", "captions"],
      ["hooks", "watch"],
      ["captions", "shares"],
      ["watch", "views"],
      ["shares", "reach"],
      ["hooks", "saves"],
      ["captions", "saves"],
    ],
  },
  {
    label: "13-MONTH ANALYSIS",
    count: 11,
    nodes: [
      account, hooks, captions, watch, shares, views, reach, saves,
      insights, followerSignal, shareReach,
    ],
    edges: [
      ["account", "hooks"],
      ["account", "captions"],
      ["hooks", "watch"],
      ["captions", "shares"],
      ["watch", "views"],
      ["shares", "reach"],
      ["hooks", "saves"],
      ["captions", "saves"],
      ["account", "insights"],
      ["insights", "followerSignal"],
      ["insights", "shareReach"],
      ["shares", "shareReach"],
      ["reach", "shareReach"],
    ],
  },
  {
    label: "29,000 FOLLOWERS",
    count: 14,
    nodes: [
      account, hooks, captions, watch, shares, views, reach, saves,
      insights, followerSignal, shareReach, fitness, motivation, selfGrowth,
    ],
    edges: [
      ["account", "hooks"],
      ["account", "captions"],
      ["hooks", "watch"],
      ["captions", "shares"],
      ["watch", "views"],
      ["shares", "reach"],
      ["hooks", "saves"],
      ["captions", "saves"],
      ["account", "insights"],
      ["insights", "followerSignal"],
      ["insights", "shareReach"],
      ["shares", "shareReach"],
      ["reach", "shareReach"],
      ["hooks", "fitness"],
      ["captions", "motivation"],
      ["views", "selfGrowth"],
      ["fitness", "saves"],
      ["motivation", "account"],
    ],
  },
];

function edgeKey(edge: string[]) {
  return [...edge].sort().join("-");
}

export const stageCount = months.length;

type NetworkGrowthProps = {
  /** Controlled stage index; omit to let the component run its own loop. */
  stage?: number;
  onStageChange?: (stage: number) => void;
  /** Drop the card chrome when embedded in another frame (the audience dashboard). */
  bare?: boolean;
};

export default function NetworkGrowth({
  stage,
  onStageChange,
  bare = false,
}: NetworkGrowthProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [internalStage, setInternalStage] = useState(0);
  const currentMonth = stage ?? internalStage;
  const setCurrentMonth = (next: number) => {
    if (stage === undefined) setInternalStage(next);
    onStageChange?.(next);
  };
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
      setCurrentMonth((currentMonth + 1) % months.length);
    }, delay);

    return () => window.clearTimeout(timeout);
    // setCurrentMonth is recreated each render; the loop only needs to restart when the stage changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className={
        bare
          ? "relative w-full overflow-hidden bg-white p-4 sm:p-5"
          : "relative w-full overflow-hidden rounded-[12px] border border-neutral-200 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-7"
      }
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle_at_center,rgba(0,0,0,0.5)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.05em]">
        <span className="whitespace-nowrap text-neutral-500">Audience Growth</span>
        <span className="whitespace-nowrap rounded-md border border-orange-200 bg-orange-50 px-2 py-1 text-[10px] leading-none text-warm sm:text-[11px]">
          {month.label}
        </span>
      </div>

      <div className={`${bare ? "mt-4" : "mt-8"} overflow-hidden rounded-[10px] border border-neutral-200 bg-neutral-50/70`}>
        <svg
          viewBox="0 0 600 280"
          // Phones: height follows the 600×280 aspect instead of letterboxing inside a fixed 280px box.
          className="h-auto w-full sm:h-[280px]"
          role="img"
          aria-label={`${month.label}: ${month.count} signals`}
        >
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(224,85,47,0.35)" />
              <stop offset="70%" stopColor="rgba(224,85,47,0.06)" />
              <stop offset="100%" stopColor="rgba(224,85,47,0)" />
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
                  stroke="#bbbbbb"
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
                  fill="#3EA45A"
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
                {node.id === "account" || newestNodeIds.has(node.id) ? (
                  <text
                    x={node.x}
                    y={node.y - 18}
                    textAnchor="middle"
                    // Phones scale the 600-wide viewBox to ~45%, so 24 SVG units ≈ 11px on screen.
                    className="font-mono max-sm:text-[24px]"
                    fontSize="9"
                    fill="#404040"
                  >
                    {node.label}
                  </text>
                ) : null}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill="rgba(224,85,47,0.12)"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="3.5"
                  fill="#e0552f"
                />
                {newestNodeIds.has(node.id) ? (
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="11"
                    fill="none"
                    stroke="rgba(62,164,90,0.7)"
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

      <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.05em] sm:gap-3 sm:text-[9px]">
        <div className="rounded-[10px] border border-neutral-200 bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-neutral-400">Signals</p>
          <p className="mt-1 text-warm">{month.count}</p>
        </div>
        <div className="rounded-[10px] border border-neutral-200 bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-neutral-400">Links</p>
          <p className="mt-1 text-neutral-800">{month.edges.length}</p>
        </div>
        <div className="rounded-[10px] border border-neutral-200 bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
          <p className="text-neutral-400">Signals</p>
          <p className="mt-1 text-green-700">
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
                  ? "border-warm text-warm"
                  : isPast
                    ? "border-neutral-300 text-neutral-500"
                    : "border-neutral-200 text-neutral-300"
              }`}
            >
              <span>S{index + 1}</span>
              <span
                className={`mx-auto mt-2 block h-1 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 bg-warm"
                    : isPast
                      ? "w-5 bg-neutral-300"
                      : "w-2 bg-neutral-200 group-hover:w-4"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

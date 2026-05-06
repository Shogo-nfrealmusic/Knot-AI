"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const skills = [
  {
    name: "inquiry-router",
    version: "v2.1.4",
    todayCount: 247,
    avgTime: "2.3s",
    initialPattern: [30, 50, 70, 90, 60, 80, 100, 70, 85, 65, 95, 75],
  },
  {
    name: "finance-review",
    version: "v1.8.0",
    todayCount: 84,
    avgTime: "4.1s",
    initialPattern: [50, 30, 70, 60, 90, 50, 80, 70, 100, 65, 80, 75],
  },
  {
    name: "contract-scan",
    version: "v0.9.2",
    todayCount: 31,
    avgTime: "8.7s",
    initialPattern: [70, 50, 60, 90, 80, 100, 70, 60, 85, 90, 65, 95],
  },
];

const events = [
  {
    skill: "inquiry-router",
    type: "classified",
    detail: "billing → priority high",
    color: "coral",
  },
  {
    skill: "finance-review",
    type: "extracted",
    detail: "14 line items · $48,290",
    color: "coral",
  },
  {
    skill: "inquiry-router → finance-review",
    type: "handoff",
    detail: "context shared",
    color: "green",
  },
  {
    skill: "contract-scan",
    type: "flagged",
    detail: "liability cap below standard",
    color: "coral",
  },
  {
    skill: "finance-review",
    type: "validated",
    detail: "within policy",
    color: "green",
  },
  {
    skill: "inquiry-router",
    type: "routed",
    detail: "support team · 2.1s",
    color: "coral",
  },
  {
    skill: "contract-scan → finance-review",
    type: "handoff",
    detail: "terms verified",
    color: "green",
  },
  {
    skill: "inquiry-router",
    type: "drafted",
    detail: "reply · 142 chars",
    color: "green",
  },
];

type FeedEntry = (typeof events)[number] & {
  id: number;
  timestamp: string;
};

type Packet = {
  id: number;
  from: number;
  to: number;
};

function formatTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function skillIndexFromEvent(skill: string) {
  const source = skill.split(" → ")[0];
  return Math.max(
    0,
    skills.findIndex((item) => item.name === source),
  );
}

function packetFromEvent(skill: string, id: number): Packet | null {
  const [source, target] = skill.split(" → ");
  if (!source || !target) return null;

  const from = skills.findIndex((item) => item.name === source);
  const to = skills.findIndex((item) => item.name === target);
  if (from < 0 || to < 0) return null;

  return { id, from, to };
}

function randomPattern() {
  return Array.from({ length: 12 }, () => 30 + Math.random() * 70);
}

function enabledCountFromProgress(progress?: number) {
  if (typeof progress !== "number") return skills.length;
  if (progress < 0.33) return 1;
  if (progress < 0.66) return 2;
  return 3;
}

export default function SkillsSuite({ progress }: { progress?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const eventTimeoutRef = useRef<number | null>(null);
  const packetTimeoutRef = useRef<number | null>(null);
  const feedInsertTimeoutRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSkill, setActiveSkill] = useState(0);
  const [patterns, setPatterns] = useState(
    skills.map((skill) => skill.initialPattern),
  );
  const [sharedContext, setSharedContext] = useState(1284);
  const [crossSkillCalls, setCrossSkillCalls] = useState(42);
  const [eventIndex, setEventIndex] = useState(0);
  const [feed, setFeed] = useState<FeedEntry[]>(() =>
    events.slice(0, 4).map((event, index) => ({
      ...event,
      id: index,
      timestamp: `14:32:${String(8 + index * 2).padStart(2, "0")}`,
    })),
  );
  const [packet, setPacket] = useState<Packet | null>(null);
  const [travelerIndex, setTravelerIndex] = useState(0);
  const progressMode = typeof progress === "number";
  const enabledCount = enabledCountFromProgress(progress);
  const shouldRenderLive = !progressMode || progress > 0.05;
  const shouldAnimate = isVisible && shouldRenderLive;

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
    if (!shouldAnimate) return;

    const tick = () => {
      const event = events[eventIndex % events.length];
      const activeIndex = skillIndexFromEvent(event.skill);
      const nextId = Date.now();

      if (!progressMode) {
        setActiveSkill(activeIndex);
      }

      setPatterns((current) =>
        current.map((pattern, index) =>
          index === activeIndex ? randomPattern() : pattern,
        ),
      );

      setSharedContext((value) => value + Math.floor(Math.random() * 3));

      if (event.type === "handoff") {
        setCrossSkillCalls((value) => value + 1);
        const nextPacket = packetFromEvent(event.skill, nextId);
        if (nextPacket) {
          setPacket(nextPacket);
          if (packetTimeoutRef.current) {
            window.clearTimeout(packetTimeoutRef.current);
          }
          packetTimeoutRef.current = window.setTimeout(() => {
            setPacket(null);
          }, 1400);
        }
      }

      const nextEntry = {
        ...event,
        id: nextId,
        timestamp: formatTime(),
      };

      setFeed((current) => (current.length >= 4 ? current.slice(0, 3) : current));

      if (feedInsertTimeoutRef.current) {
        window.clearTimeout(feedInsertTimeoutRef.current);
      }

      feedInsertTimeoutRef.current = window.setTimeout(() => {
        setFeed((current) => [nextEntry, ...current].slice(0, 4));
      }, 160);

      setEventIndex((index) => index + 1);

      eventTimeoutRef.current = window.setTimeout(
        tick,
        1400 + Math.random() * 600,
      );
    };

    eventTimeoutRef.current = window.setTimeout(tick, 900);

    return () => {
      if (eventTimeoutRef.current) {
        window.clearTimeout(eventTimeoutRef.current);
      }
      if (packetTimeoutRef.current) {
        window.clearTimeout(packetTimeoutRef.current);
      }
      if (feedInsertTimeoutRef.current) {
        window.clearTimeout(feedInsertTimeoutRef.current);
      }
    };
  }, [eventIndex, progressMode, shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate) return;

    const interval = window.setInterval(() => {
      setTravelerIndex((index) => (index + 1) % 4);
    }, 1200);

    return () => window.clearInterval(interval);
  }, [shouldAnimate]);

  const displayActiveSkill = progressMode
    ? Math.max(0, enabledCount - 1)
    : activeSkill;

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl border border-white/10 bg-[#0a0a0a] p-7"
    >
      <style jsx>{`
        @keyframes livePulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }
      `}</style>

      <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.05em]">
        <span className="text-white/40">Skills Suite · Production</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-[10px] text-[rgba(93,202,165,0.95)]">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[rgba(93,202,165,0.95)]"
              style={{ animation: "livePulse 2s ease-in-out infinite" }}
            />
            3 Active
          </span>
          <span className="text-[10px] text-white/35">↑ 99.94%</span>
        </span>
      </div>

      <div className="mt-7 grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <div className="relative space-y-3">
          <AnimatePresence>
            {packet ? (
              <motion.span
                key={packet.id}
                className="absolute left-[-10px] z-10 h-2 w-2 rounded-full bg-[rgba(204,120,92,0.95)] shadow-[0_0_12px_rgba(204,120,92,0.65)]"
                initial={{
                  opacity: 0,
                  top: `${packet.from * 34 + 16}%`,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  top: `${packet.to * 34 + 16}%`,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            ) : null}
          </AnimatePresence>

          {skills.map((skill, index) => {
            const isProgressDimmed = progressMode && index >= enabledCount;
            const isActive = !isProgressDimmed && index === displayActiveSkill;

            return (
              <div
                key={skill.name}
                className={`rounded-lg border px-3.5 py-3 transition-all duration-300 ${
                  isActive
                    ? "border-[rgba(204,120,92,0.35)] bg-[rgba(204,120,92,0.05)]"
                    : "border-white/10 bg-white/2"
                } ${isProgressDimmed ? "opacity-40" : "opacity-100"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="h-[7px] w-[7px] shrink-0 rounded-full bg-[rgba(204,120,92,0.95)]" />
                    <span className="truncate font-mono text-[11.5px] font-medium text-white/95">
                      {skill.name}
                    </span>
                    <span className="shrink-0 font-mono text-[9px] text-white/35">
                      {skill.version}
                    </span>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-white/50">
                    {skill.todayCount} today
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between gap-4">
                  <div className="flex h-5 items-end gap-[3px]">
                    {patterns[index].map((height, barIndex) => (
                      <span
                        key={`${skill.name}-${barIndex}`}
                        className="w-[3px] rounded-full bg-[rgba(204,120,92,0.55)] transition-[height] duration-600 ease-out"
                        style={{
                          height: `${height}%`,
                          opacity: 0.55 + (height / 100) * 0.35,
                          transitionDelay: `${barIndex * 30}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="shrink-0 font-mono text-[10px] text-[rgba(93,202,165,0.85)]">
                    ↓ {skill.avgTime} avg
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className={`grid gap-3 transition-opacity duration-300 ${
            shouldRenderLive ? "opacity-100" : "opacity-0"
          }`}
        >
          <MetricCard
            label="Shared Context"
            value={sharedContext.toLocaleString()}
            subLabel="↑ 12 this hour"
          />
          <MetricCard
            label="Cross-Skill Calls"
            value={String(crossSkillCalls)}
            subLabel="handoffs / hr"
            coral
          />
          <CoordinationCard travelerIndex={travelerIndex} />
        </div>
      </div>

      <div
        className={`mt-3 h-[140px] overflow-hidden rounded-lg border border-white/10 bg-white/2 p-3 transition-opacity duration-300 ${
          shouldRenderLive ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[9px] uppercase tracking-[0.05em]">
          <span className="text-white/40">Live Activity</span>
          <span className="text-[rgba(204,120,92,0.7)]">last 60s</span>
        </div>
        <div id="live-feed" className="h-24 space-y-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {feed.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="grid grid-cols-[50px_14px_minmax(0,1fr)] items-center gap-2 text-[10px]"
              >
                <span className="font-mono text-white/30">{entry.timestamp}</span>
                <span
                  className={
                    entry.color === "green"
                      ? "text-[rgba(93,202,165,0.95)]"
                      : "text-[rgba(204,120,92,0.95)]"
                  }
                >
                  {entry.color === "green" ? "✓" : "→"}
                </span>
                <span className="truncate">
                  <span className="text-white/70">{entry.skill}</span>
                  <span className="text-white/30"> · </span>
                  <span className="text-white/50">
                    {entry.type}: {entry.detail}
                  </span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  subLabel,
  coral = false,
}: {
  label: string;
  value: string;
  subLabel: string;
  coral?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/2 px-3 py-2.5">
      <p className="font-mono text-[9px] uppercase tracking-[0.05em] text-white/40">
        {label}
      </p>
      <p
        className={`mt-2 font-mono text-[18px] font-medium ${
          coral ? "text-[rgba(204,120,92,0.95)]" : "text-white/95"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 font-mono text-[9px] text-[rgba(93,202,165,0.85)]">
        {subLabel}
      </p>
    </div>
  );
}

function CoordinationCard({ travelerIndex }: { travelerIndex: number }) {
  const points = [
    { x: 50, y: 18 },
    { x: 18, y: 76 },
    { x: 82, y: 76 },
    { x: 50, y: 18 },
  ];
  const traveler = points[travelerIndex];

  return (
    <div className="rounded-lg border border-white/10 bg-white/2 px-3 py-2.5">
      <p className="font-mono text-[9px] uppercase tracking-[0.05em] text-white/40">
        Coordination
      </p>
      <svg viewBox="0 0 100 90" className="mt-2 h-[76px] w-full">
        <line
          x1="50"
          y1="18"
          x2="18"
          y2="76"
          stroke="rgba(204,120,92,0.28)"
          strokeDasharray="2 3"
          strokeWidth="1"
        />
        <line
          x1="18"
          y1="76"
          x2="82"
          y2="76"
          stroke="rgba(204,120,92,0.28)"
          strokeDasharray="2 3"
          strokeWidth="1"
        />
        <line
          x1="82"
          y1="76"
          x2="50"
          y2="18"
          stroke="rgba(204,120,92,0.28)"
          strokeDasharray="2 3"
          strokeWidth="1"
        />
        {points.slice(0, 3).map((point) => (
          <circle
            key={`${point.x}-${point.y}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="rgba(204,120,92,0.95)"
          />
        ))}
        <motion.circle
          cx={traveler.x}
          cy={traveler.y}
          animate={{ cx: traveler.x, cy: traveler.y }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          r="2.5"
          fill="rgba(93,202,165,0.95)"
        />
      </svg>
    </div>
  );
}

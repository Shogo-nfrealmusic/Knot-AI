"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  IconChartBar,
  IconCircleCheckFilled,
  IconFileText,
  IconLayout,
  IconMessageCircle,
} from "@tabler/icons-react";
import { SiClaude } from "react-icons/si";
import { SlackIcon } from "@/app/components/icons/illustrations";

type SourceKey = "slack" | "metrics" | "feedback";

type Layout = {
  key: "wide" | "narrow";
  className: string;
  width: number;
  height: number;
  maskStop: string;
  tile: number;
  labelSize: number;
  labelGap: number;
  // Each signal rides one path through the agent and down into the review window.
  // Paths share the pill and the window stem, which the shapes drawn later cover.
  sources: { key: SourceKey; label: string; x: number; y: number; path: string }[];
  agent: {
    x: number;
    y: number;
    w: number;
    h: number;
    iconX: number;
    iconY: number;
    textX: number;
    titleY: number;
    subY: number;
    titleSize: number;
    subSize: number;
  };
  window: { x: number; y: number; w: number; dotR: number; dotY: number; statusY: number; statusSize: number; innerY: number };
  artifact: {
    x: number;
    w: number;
    h: number;
    y0: number;
    step: number;
    iconSize: number;
    iconDx: number;
    labelDx: number;
    labelDy: number;
    labelSize: number;
    metaSize: number;
  };
};

const colors: Record<SourceKey, string> = {
  slack: "#229DF3",
  metrics: "#5E5E5E",
  feedback: "#3EA45A",
};

// The wide layout fills the project card on tablets and desktops. Below `sm` the card is
// only ~280px wide, so the narrow layout stacks tighter with larger type to stay legible.
const layouts: Layout[] = [
  {
    key: "wide",
    className: "hidden sm:block",
    width: 800,
    height: 460,
    maskStop: "88%",
    tile: 88,
    labelSize: 13,
    labelGap: 12,
    sources: [
      { key: "slack", label: "Slack threads", x: 106, y: 70, path: "M150 158V189C150 202.255 160.745 213 174 213H400V330" },
      { key: "metrics", label: "Product metrics", x: 356, y: 40, path: "M400 128V330" },
      { key: "feedback", label: "User feedback", x: 606, y: 70, path: "M650 158V189C650 202.255 639.255 213 626 213H400V330" },
    ],
    agent: { x: 272, y: 180, w: 256, h: 66, iconX: 288, iconY: 196, textX: 336, titleY: 210, subY: 228, titleSize: 15, subSize: 10.5 },
    window: { x: 240, y: 300, w: 320, dotR: 3.5, dotY: 317, statusY: 321, statusSize: 10.5, innerY: 336 },
    artifact: { x: 268, w: 264, h: 42, y0: 352, step: 52, iconSize: 18, iconDx: 14, labelDx: 40, labelDy: 25, labelSize: 13, metaSize: 10 },
  },
  {
    key: "narrow",
    className: "sm:hidden",
    width: 360,
    height: 450,
    maskStop: "90%",
    tile: 72,
    labelSize: 15,
    labelGap: 10,
    sources: [
      { key: "slack", label: "Slack threads", x: 24, y: 36, path: "M60 108V116C60 122.627 65.373 128 72 128H180V300" },
      { key: "metrics", label: "Product metrics", x: 144, y: 36, path: "M180 108V300" },
      { key: "feedback", label: "User feedback", x: 264, y: 36, path: "M300 108V116C300 122.627 294.627 128 288 128H180V300" },
    ],
    agent: { x: 20, y: 150, w: 320, h: 64, iconX: 36, iconY: 165, textX: 84, titleY: 180, subY: 199, titleSize: 17, subSize: 13 },
    window: { x: 24, y: 252, w: 312, dotR: 4, dotY: 271, statusY: 276, statusSize: 14, innerY: 292 },
    artifact: { x: 50, w: 260, h: 52, y0: 308, step: 64, iconSize: 22, iconDx: 16, labelDx: 48, labelDy: 32, labelSize: 16, metaSize: 12.5 },
  },
];

const artifacts = [
  { label: "PRD draft", Icon: IconFileText },
  { label: "UI prototype", Icon: IconLayout },
];

const DUR = 4;

function SourceIcon({ sourceKey, tile }: { sourceKey: SourceKey; tile: number }) {
  if (sourceKey === "slack") {
    const size = Math.round(tile * 0.41);
    const offset = (tile - size) / 2;
    return (
      <foreignObject x={offset} y={offset} width={size} height={size}>
        <div style={{ width: size, height: size }}>
          <SlackIcon />
        </div>
      </foreignObject>
    );
  }
  const size = Math.round(tile * 0.36);
  const offset = (tile - size) / 2;
  const Icon = sourceKey === "metrics" ? IconChartBar : IconMessageCircle;
  return <Icon x={offset} y={offset} width={size} height={size} stroke={1.5} color="#404040" />;
}

function FlowSvg({
  layout,
  id,
  stage,
  status,
  svgRef,
}: {
  layout: Layout;
  id: string;
  stage: number;
  status: string;
  svgRef: (element: SVGSVGElement | null) => void;
}) {
  const { agent, window: win, artifact, tile } = layout;
  const prefix = `${id}-${layout.key}`;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      fill="none"
      className={`mt-2 h-auto w-full ${layout.className}`}
      style={{ maskImage: `linear-gradient(black ${layout.maskStop}, transparent)` }}
      role="img"
      aria-label="Slack threads, product metrics, and user feedback flow into a Claude Code agent with MCP, which writes a PRD draft and a UI prototype for review"
    >
      <defs>
        {layout.sources.map((source) => (
          <g key={source.key}>
            <mask id={`${prefix}-mask-${source.key}`}>
              <path d={source.path} stroke="white" strokeWidth="1.5" />
            </mask>
            <radialGradient id={`${prefix}-glow-${source.key}`}>
              <stop offset="0%" stopColor={colors[source.key]} stopOpacity="1" />
              <stop offset="100%" stopColor={colors[source.key]} stopOpacity="0" />
            </radialGradient>
          </g>
        ))}
      </defs>

      {layout.sources.map((source) => (
        <path key={source.key} d={source.path} stroke="#D4D4D4" strokeWidth="1.5" />
      ))}

      {layout.sources.map((source, index) => {
        const begin = `-${((index * DUR) / layout.sources.length).toFixed(2)}s`;
        const color = colors[source.key];
        return (
          <g key={source.key}>
            <g mask={`url(#${prefix}-mask-${source.key})`}>
              <circle r="70" fill={`url(#${prefix}-glow-${source.key})`}>
                <animateMotion path={source.path} dur={`${DUR}s`} begin={begin} repeatCount="indefinite" />
              </circle>
            </g>
            <g>
              <animateMotion path={source.path} dur={`${DUR}s`} begin={begin} repeatCount="indefinite" />
              <circle r="8" fill={color} opacity="0.2" />
              <circle r="4" fill={color} />
            </g>
          </g>
        );
      })}

      {/* Signal sources */}
      {layout.sources.map((source) => (
        <g key={source.key} transform={`translate(${source.x} ${source.y})`}>
          <text x={tile / 2} y={-layout.labelGap} textAnchor="middle" fontSize={layout.labelSize} fontWeight="500" fill="#525252">
            {source.label}
          </text>
          <g className="drop-shadow-sm">
            <rect x="0.75" y="0.75" width={tile - 1.5} height={tile - 1.5} rx={tile * 0.185} fill="white" stroke="#E5E5E5" strokeWidth="1.5" />
            <SourceIcon sourceKey={source.key} tile={tile} />
          </g>
        </g>
      ))}

      {/* Agent */}
      <g className="drop-shadow-sm">
        <rect x={agent.x + 0.75} y={agent.y + 0.75} width={agent.w - 1.5} height={agent.h - 1.5} rx="16.25" fill="white" stroke="#E5E5E5" strokeWidth="1.5" />
        <rect x={agent.iconX} y={agent.iconY} width="34" height="34" rx="17" fill="#FDF4F0" stroke="#F3D9CE" />
        <SiClaude x={agent.iconX + 7} y={agent.iconY + 7} width={20} height={20} color="#D97757" />
        <text x={agent.textX} y={agent.titleY} fontSize={agent.titleSize} fontWeight="600" fill="#171717">
          Claude Code + MCP
        </text>
        <text x={agent.textX} y={agent.subY} fontSize={agent.subSize} fill="#737373" className="font-mono">
          agent · skills + tools
        </text>
      </g>

      {/* Review window: drawn past the bottom edge so only the rounded top shows. */}
      <rect x={win.x + 0.75} y={win.y + 0.75} width={win.w - 1.5} height={layout.height - win.y + 40} rx="24" fill="#171717" stroke="black" strokeWidth="1.5" />
      {[20, 34, 48].map((dx) => (
        <circle key={dx} cx={win.x + dx} cy={win.dotY} r={win.dotR} fill="#404040" />
      ))}
      <text x={win.x + win.w / 2} y={win.statusY} textAnchor="middle" fontSize={win.statusSize} fill="#A3A3A3" className="font-mono">
        {status}
      </text>
      <rect x={win.x + 12.5} y={win.innerY + 0.5} width={win.w - 25} height={layout.height - win.innerY + 40} rx="12" fill="white" stroke="#D4D4D4" />

      {artifacts.map(({ label, Icon }, index) => {
        const done = stage > index;
        const y = artifact.y0 + index * artifact.step;
        const iconY = y + (artifact.h - artifact.iconSize) / 2;
        return (
          <g key={label}>
            <rect
              x={artifact.x + 0.5}
              y={y + 0.5}
              width={artifact.w - 1}
              height={artifact.h - 1}
              rx="10"
              style={{
                fill: done ? "#FFFFFF" : "#FAFAFA",
                stroke: done ? "#BBF7D0" : "#E5E5E5",
                transition: "fill 300ms, stroke 300ms",
              }}
            />
            <Icon
              x={artifact.x + artifact.iconDx}
              y={iconY}
              width={artifact.iconSize}
              height={artifact.iconSize}
              stroke={1.75}
              color={done ? "#171717" : "#A3A3A3"}
            />
            <text
              x={artifact.x + artifact.labelDx}
              y={y + artifact.labelDy}
              fontSize={artifact.labelSize}
              fontWeight="500"
              style={{ fill: done ? "#171717" : "#A3A3A3", transition: "fill 300ms" }}
            >
              {label}
            </text>
            <g style={{ opacity: done ? 1 : 0, transition: "opacity 300ms" }}>
              <IconCircleCheckFilled
                x={artifact.x + artifact.w - artifact.iconDx - artifact.iconSize}
                y={iconY}
                width={artifact.iconSize}
                height={artifact.iconSize}
                color="#3EA45A"
              />
            </g>
            <text
              x={artifact.x + artifact.w - artifact.iconDx}
              y={y + artifact.labelDy}
              textAnchor="end"
              fontSize={artifact.metaSize}
              fill="#A3A3A3"
              className="font-mono"
              style={{ opacity: done ? 0 : 1, transition: "opacity 300ms" }}
            >
              queued
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function AgentFlow() {
  const rawId = useId();
  const id = `agent${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const inView = useInView(wrapperRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const playing = inView && !reduceMotion;
  // 0: reading, 1: PRD written, 2: prototype written, 3: hold before looping.
  const [stage, setStage] = useState(0);

  useEffect(() => {
    for (const svg of svgRefs.current) {
      if (!svg) continue;
      if (playing) {
        svg.unpauseAnimations();
        continue;
      }
      if (reduceMotion) svg.setCurrentTime(2);
      svg.pauseAnimations();
    }
    if (!playing && reduceMotion) setStage(2);
  }, [playing, reduceMotion]);

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(() => setStage((s) => (s + 1) % 4), 1400);
    return () => window.clearInterval(interval);
  }, [playing]);

  const status = stage === 0 ? "reading signals" : stage === 1 ? "writing prototype" : "ready for review";

  return (
    <div
      ref={wrapperRef}
      className="rounded-[12px] bg-neutral-50 bg-[radial-gradient(circle,rgba(0,0,0,0.07)_1px,transparent_1px)] p-3 [background-size:14px_14px] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
        <span className="text-neutral-500">Problem → PRD → prototype</span>
        <span className="rounded-md border border-neutral-200 bg-white px-2 py-1 leading-none text-neutral-600 shadow-sm">
          Published · Mercari Engineering
        </span>
      </div>

      {layouts.map((layout, index) => (
        <FlowSvg
          key={layout.key}
          layout={layout}
          id={id}
          stage={stage}
          status={status}
          svgRef={(element) => {
            svgRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  IconCalendarRepeat,
  IconMovie,
  IconPlayerPlayFilled,
  IconSparkles,
} from "@tabler/icons-react";
import { SiInstagram } from "react-icons/si";

type SourceKey = "footage" | "captions";

type Chip = { x: number; y: number; w: number; h: number; textSize: number; connector?: string };

type Layout = {
  key: "wide" | "narrow";
  className: string;
  width: number;
  height: number;
  maskStop: string;
  tile: number;
  labelSize: number;
  labelGap: number;
  // Footage and generated captions ride their paths into the pipeline, then down into the render window.
  sources: { key: SourceKey; label: string; x: number; y: number; path: string }[];
  card: { x: number; y: number; w: number; h: number; iconX: number; iconY: number; textX: number; titleY: number; subY: number; titleSize: number; subSize: number };
  chips: [Chip, Chip];
  window: { x: number; y: number; w: number; dotR: number; dotY: number; statusY: number; statusSize: number; innerY: number };
  thumbs: { x0: number; y0: number; w: number; h: number; step: number; rowStep: number };
};

const colors: Record<SourceKey, string> = {
  footage: "#229DF3",
  captions: "#8B5CF6",
};

// The wide layout fills the project card on tablets and desktops. Below `sm` the card is
// only ~280px wide, so the narrow layout stacks the stat chips and uses larger type.
const layouts: Layout[] = [
  {
    key: "wide",
    className: "hidden sm:block",
    width: 800,
    height: 520,
    maskStop: "90%",
    tile: 88,
    labelSize: 13,
    labelGap: 12,
    sources: [
      { key: "footage", label: "Source footage", x: 106, y: 60, path: "M150 148V189C150 202.255 160.745 213 174 213H400V340" },
      { key: "captions", label: "LLM captions", x: 606, y: 60, path: "M650 148V189C650 202.255 639.255 213 626 213H400V340" },
    ],
    card: { x: 268, y: 180, w: 264, h: 66, iconX: 284, iconY: 196, textX: 332, titleY: 210, subY: 228, titleSize: 15, subSize: 10.5 },
    chips: [
      { x: 24, y: 400, w: 172, h: 44, textSize: 12.5, connector: "M196 422H200" },
      { x: 604, y: 400, w: 172, h: 44, textSize: 12.5, connector: "M600 422H604" },
    ],
    window: { x: 200, y: 290, w: 400, dotR: 3.5, dotY: 307, statusY: 311, statusSize: 10.5, innerY: 326 },
    thumbs: { x0: 230, y0: 342, w: 62, h: 78, step: 70, rowStep: 86 },
  },
  {
    key: "narrow",
    className: "sm:hidden",
    width: 360,
    height: 540,
    maskStop: "92%",
    tile: 72,
    labelSize: 15,
    labelGap: 10,
    sources: [
      { key: "footage", label: "Source footage", x: 54, y: 36, path: "M90 108V116C90 122.627 95.373 128 102 128H180V340" },
      { key: "captions", label: "LLM captions", x: 234, y: 36, path: "M270 108V116C270 122.627 264.627 128 258 128H180V340" },
    ],
    card: { x: 20, y: 150, w: 320, h: 64, iconX: 36, iconY: 165, textX: 84, titleY: 180, subY: 199, titleSize: 17, subSize: 13 },
    chips: [
      { x: 20, y: 230, w: 320, h: 42, textSize: 15 },
      { x: 20, y: 280, w: 320, h: 42, textSize: 15 },
    ],
    window: { x: 20, y: 336, w: 320, dotR: 4, dotY: 355, statusY: 360, statusSize: 14, innerY: 376 },
    thumbs: { x0: 44, y0: 390, w: 48, h: 60, step: 56, rowStep: 70 },
  },
];

const DUR = 4;
const VIDEO_COUNT = 10;
// Extra ticks hold the finished grid on screen before the loop restarts.
const HOLD_TICKS = 5;

function StatChip({ chip, children }: { chip: Chip; children: (iconX: number, iconY: number, textX: number, textY: number) => React.ReactNode }) {
  const iconX = chip.x + 14;
  const iconY = chip.y + (chip.h - 18) / 2;
  const textX = chip.x + 40;
  const textY = chip.y + chip.h / 2 + chip.textSize * 0.36;
  return (
    <>
      <g className="drop-shadow-sm">
        <rect x={chip.x + 0.75} y={chip.y + 0.75} width={chip.w - 1.5} height={chip.h - 1.5} rx="12" fill="white" stroke="#E5E5E5" strokeWidth="1.5" />
        {children(iconX, iconY, textX, textY)}
      </g>
      {chip.connector ? <path d={chip.connector} stroke="#BBB" strokeWidth="1.5" strokeDasharray="3 3" /> : null}
    </>
  );
}

function FlowSvg({
  layout,
  id,
  rendered,
  svgRef,
}: {
  layout: Layout;
  id: string;
  rendered: number;
  svgRef: (element: SVGSVGElement | null) => void;
}) {
  const { card, window: win, thumbs, tile } = layout;
  const prefix = `${id}-${layout.key}`;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      fill="none"
      className={`mt-2 h-auto w-full ${layout.className}`}
      style={{ maskImage: `linear-gradient(black ${layout.maskStop}, transparent)` }}
      role="img"
      aria-label="Source footage and LLM-written captions flow into an automated pipeline that renders ten short-form videos every morning"
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
        <linearGradient id={`${prefix}-thumb`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="100%" stopColor="#FB923C" />
        </linearGradient>
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

      {/* Inputs */}
      {layout.sources.map((source) => {
        const Icon = source.key === "footage" ? IconMovie : IconSparkles;
        const size = Math.round(tile * 0.36);
        const offset = (tile - size) / 2;
        return (
          <g key={source.key} transform={`translate(${source.x} ${source.y})`}>
            <text x={tile / 2} y={-layout.labelGap} textAnchor="middle" fontSize={layout.labelSize} fontWeight="500" fill="#525252">
              {source.label}
            </text>
            <g className="drop-shadow-sm">
              <rect x="0.75" y="0.75" width={tile - 1.5} height={tile - 1.5} rx={tile * 0.185} fill="white" stroke="#E5E5E5" strokeWidth="1.5" />
              <Icon x={offset} y={offset} width={size} height={size} stroke={1.5} color={colors[source.key]} />
            </g>
          </g>
        );
      })}

      {/* Pipeline */}
      <g className="drop-shadow-sm">
        <rect x={card.x + 0.75} y={card.y + 0.75} width={card.w - 1.5} height={card.h - 1.5} rx="16.25" fill="white" stroke="#E5E5E5" strokeWidth="1.5" />
        <rect x={card.iconX} y={card.iconY} width="34" height="34" rx="17" fill="#FFF7ED" stroke="#FED7AA" />
        <IconPlayerPlayFilled x={card.iconX + 8} y={card.iconY + 8} width={18} height={18} color="#E0552F" />
        <text x={card.textX} y={card.titleY} fontSize={card.titleSize} fontWeight="600" fill="#171717">
          Content pipeline
        </text>
        <text x={card.textX} y={card.subY} fontSize={card.subSize} fill="#737373" className="font-mono">
          select · caption · render
        </text>
      </g>

      {/* Stats */}
      <StatChip chip={layout.chips[0]}>
        {(iconX, iconY, textX, textY) => (
          <>
            <IconCalendarRepeat x={iconX} y={iconY} width={18} height={18} stroke={1.75} color="#525252" />
            <text x={textX} y={textY} fontSize={layout.chips[0].textSize} fontWeight="600" fill="#262626">
              10 videos / morning
            </text>
          </>
        )}
      </StatChip>
      <StatChip chip={layout.chips[1]}>
        {(iconX, iconY, textX, textY) => (
          <>
            <SiInstagram x={iconX} y={iconY} width={18} height={18} color="#E4405F" />
            <text x={textX} y={textY} fontSize={layout.chips[1].textSize} fontWeight="600" fill="#262626">
              66k+ monthly views
            </text>
          </>
        )}
      </StatChip>

      {/* Render window: drawn past the bottom edge so only the rounded top shows. */}
      <rect x={win.x + 0.75} y={win.y + 0.75} width={win.w - 1.5} height={layout.height - win.y + 40} rx="24" fill="#171717" stroke="black" strokeWidth="1.5" />
      {[20, 34, 48].map((dx) => (
        <circle key={dx} cx={win.x + dx} cy={win.dotY} r={win.dotR} fill="#404040" />
      ))}
      <text x={win.x + win.w / 2} y={win.statusY} textAnchor="middle" fontSize={win.statusSize} fill="#A3A3A3" className="font-mono">
        {rendered} / {VIDEO_COUNT} rendered
      </text>
      <rect x={win.x + 12.5} y={win.innerY + 0.5} width={win.w - 25} height={layout.height - win.innerY + 40} rx="12" fill="white" stroke="#D4D4D4" />

      {Array.from({ length: VIDEO_COUNT }, (_, index) => {
        const done = index < rendered;
        const x = thumbs.x0 + (index % 5) * thumbs.step;
        const y = thumbs.y0 + Math.floor(index / 5) * thumbs.rowStep;
        const cx = x + thumbs.w / 2;
        const cy = y + thumbs.h / 2;
        return (
          <g key={index}>
            <rect
              x={x + 0.5}
              y={y + 0.5}
              width={thumbs.w - 1}
              height={thumbs.h - 1}
              rx="8"
              strokeDasharray={done ? undefined : "4 3"}
              style={{
                fill: done ? `url(#${prefix}-thumb)` : "#FAFAFA",
                stroke: done ? "#FDBA74" : "#D4D4D4",
                transition: "stroke 250ms",
              }}
            />
            <path
              d={`M${cx - 3.5} ${cy - 6.5}L${cx + 7.5} ${cy + 0.5}L${cx - 3.5} ${cy + 7.5}Z`}
              style={{ fill: done ? "#FFFFFF" : "#D4D4D4", transition: "fill 250ms" }}
            />
          </g>
        );
      })}
    </svg>
  );
}

export default function PipelineFlow() {
  const rawId = useId();
  const id = `pipe${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<(SVGSVGElement | null)[]>([]);
  const inView = useInView(wrapperRef, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const playing = inView && !reduceMotion;
  const [tick, setTick] = useState(0);
  const rendered = Math.min(tick, VIDEO_COUNT);

  useEffect(() => {
    for (const svg of svgRefs.current) {
      if (!svg) continue;
      if (playing) {
        svg.unpauseAnimations();
        continue;
      }
      if (reduceMotion) svg.setCurrentTime(1.5);
      svg.pauseAnimations();
    }
    if (!playing && reduceMotion) setTick(VIDEO_COUNT);
  }, [playing, reduceMotion]);

  useEffect(() => {
    if (!playing) return;
    const interval = window.setInterval(
      () => setTick((t) => (t >= VIDEO_COUNT + HOLD_TICKS ? 0 : t + 1)),
      450,
    );
    return () => window.clearInterval(interval);
  }, [playing]);

  return (
    <div
      ref={wrapperRef}
      className="rounded-[12px] bg-neutral-50 bg-[radial-gradient(circle,rgba(0,0,0,0.07)_1px,transparent_1px)] p-3 [background-size:14px_14px] sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
        <span className="text-neutral-500">Short-form video pipeline</span>
        <span className="flex items-center gap-1.5 rounded-md border border-green-200 bg-green-100 px-2 py-1 leading-none text-green-800">
          <span className="size-1.5 animate-pulse rounded-full bg-green-600" />
          No human input
        </span>
      </div>

      {layouts.map((layout, index) => (
        <FlowSvg
          key={layout.key}
          layout={layout}
          id={id}
          rendered={rendered}
          svgRef={(element) => {
            svgRefs.current[index] = element;
          }}
        />
      ))}
    </div>
  );
}

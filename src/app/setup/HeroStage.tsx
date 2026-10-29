import type { CSSProperties } from "react";
import Image from "next/image";
import Scramble from "./Scramble";

// Orbit at the laptop with four promises pinned to it. Labels and leader lines share one 1000×520 box,
// so every line starts under its label and ends on Orbit (a dot marks the end).
const W = 1000;
const H = 520;

const PINS = [
  { text: "Knows your goals", x: 40, y: 120, align: "left", path: "M40 134 H250 L352 200", end: [352, 200] },
  { text: "Works while you sleep", x: 30, y: 380, align: "left", path: "M30 394 H250 L360 318", end: [360, 318] },
  { text: "Checks its own work", x: 970, y: 110, align: "right", path: "M970 124 H760 L583 200", end: [583, 200] },
  { text: "Plugs into your tools", x: 970, y: 400, align: "right", path: "M970 414 H790 L702 336", end: [702, 336] },
] as const;

export default function HeroStage() {
  return (
    <div className="relative mx-auto w-full max-w-[1000px]" style={{ aspectRatio: `${W} / ${H}` }}>
      <div aria-hidden className="absolute left-1/2 top-[46%] h-[70%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6b3d] opacity-[0.16] blur-[90px]" />
      <div className="su-float absolute left-[24%] top-0 w-[52%]">
        <Image src="/setup/orbit-type.png" alt="Orbit, the copilot_shogo mascot, working at a laptop" width={1200} height={1100} priority sizes="(min-width: 1024px) 520px, 60vw" className="h-auto w-full" />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="su-pins pointer-events-none absolute inset-0 hidden size-full md:block" aria-hidden>
        {PINS.map((pin, i) => (
          <g key={pin.text} style={{ "--at": `${900 + i * 200}ms` } as CSSProperties}>
            <path d={pin.path} />
            <circle cx={pin.end[0]} cy={pin.end[1]} r="3.5" />
          </g>
        ))}
      </svg>
      {PINS.map((pin, i) => (
        <p
          key={pin.text}
          className="absolute hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 md:block"
          style={{
            top: `${((pin.y - 4) / H) * 100}%`,
            ...(pin.align === "left" ? { left: `${(pin.x / W) * 100}%` } : { right: `${((W - pin.x) / W) * 100}%` }),
          }}
        >
          <Scramble text={pin.text} delay={700 + i * 200} />
        </p>
      ))}
    </div>
  );
}

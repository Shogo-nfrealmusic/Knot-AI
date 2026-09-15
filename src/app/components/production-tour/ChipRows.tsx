import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Each chip is a real piece of a system on /work. Plain labels, not links.
const chips = [
  { tag: "STRIPE", label: "30% deposit at booking" },
  { tag: "STRIPE", label: "Balance after the shoot" },
  { tag: "GCAL", label: "Two-way calendar sync" },
  { tag: "GA4", label: "Funnel event per step" },
  { tag: "CLARITY", label: "Session replay" },
  { tag: "CLAUDE", label: "Problem → PRD → prototype" },
  { tag: "MCP", label: "Agent tools" },
  { tag: "PYTHON", label: "10 videos every morning" },
  { tag: "EXPO", label: "Claim a shoot" },
  { tag: "EXPO", label: "Monthly invoices" },
  { tag: "NEXT.JS", label: "Multilingual booking flow" },
  { tag: "GO", label: "Booking API" },
  { tag: "AWS", label: "Production infra" },
  { tag: "VERCEL", label: "Iron & Code tool releases" },
];

const tagColors: Record<string, string> = {
  STRIPE: "text-violet-600",
  GCAL: "text-blue-600",
  GA4: "text-orange-600",
  CLARITY: "text-sky-600",
  CLAUDE: "text-[#d97757]",
  MCP: "text-neutral-900",
  PYTHON: "text-yellow-600",
  EXPO: "text-neutral-700",
  "NEXT.JS": "text-neutral-900",
  GO: "text-cyan-600",
  AWS: "text-amber-600",
  VERCEL: "text-neutral-900",
};

const ROWS = 8;

// Rotate the list per row so neighbouring rows never line up on the same chip.
const rowChips = (row: number) => {
  const offset = (row * 5) % chips.length;
  return [...chips.slice(offset), ...chips.slice(0, offset)];
};

function Chip({ tag, label }: (typeof chips)[number]) {
  return (
    <div className="flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <span className={cn("font-mono text-[10px] font-semibold tracking-[0.04em]", tagColors[tag])}>
        {tag}
      </span>
      <span className="text-[13px] text-neutral-600">{label}</span>
    </div>
  );
}

// dub.co's API endpoint rows: eight rows drifting in alternating directions behind edge masks.
export default function ChipRows({ paused }: { paused: boolean }) {
  return (
    <div
      aria-label="Integrations running in production"
      role="list"
      className="flex size-full flex-col justify-center gap-2.5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent),linear-gradient(transparent,black_20%,black_80%,transparent)] [mask-composite:intersect]"
    >
      {Array.from({ length: ROWS }, (_, row) => {
        const items = rowChips(row);
        const reverse = row % 2 === 1;
        return (
          <div
            key={row}
            className="flex w-max gap-2.5 motion-safe:animate-infinite-scroll"
            style={
              {
                "--scroll": "-50%",
                animationDirection: reverse ? "reverse" : "normal",
                animationDuration: `${60 + row * 4}s`,
                animationPlayState: paused ? "paused" : "running",
                marginLeft: reverse ? "-35%" : `-${(row * 7) % 20}%`,
              } as CSSProperties
            }
          >
            {/* Second copy exists only to make the loop seamless; screen readers get the first. */}
            {[0, 1].map((copy) =>
              items.map((chip, index) => (
                <div
                  key={`${copy}-${index}`}
                  role={copy === 0 ? "listitem" : undefined}
                  aria-hidden={copy === 1 || undefined}
                >
                  <Chip {...chip} />
                </div>
              )),
            )}
          </div>
        );
      })}
    </div>
  );
}

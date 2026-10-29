"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// The problem in one picture: the tools a small business runs on, scattered and tangled, then pulled into
// order around Claude once it has the context. Loops between the two states while on screen.
const W = 1000;
const H = 360;
const C = [500, 180] as const;

type Node = { id: string; logo?: string; label?: string; invert?: boolean; from: [number, number]; to: [number, number] };

const NODES: Node[] = [
  { id: "gmail", logo: "/setup/logos/gmail.svg", from: [120, 70], to: [300, 90] },
  { id: "stripe", logo: "/setup/logos/stripe.svg", from: [330, 300], to: [300, 270] },
  { id: "notion", logo: "/setup/logos/notion.svg", from: [610, 60], to: [700, 90] },
  { id: "slack", logo: "/setup/logos/slack.svg", from: [880, 250], to: [700, 270] },
  { id: "github", logo: "/setup/logos/github.svg", from: [470, 180], to: [500, 40] },
  { id: "google", logo: "/setup/logos/google.svg", from: [760, 130], to: [500, 320] },
  { id: "sheet", label: "Sheets", from: [210, 200], to: [210, 180] },
  { id: "bank", label: "Bank", from: [900, 60], to: [790, 180] },
];

// Tangled links in the "before" state: everything copied by hand between everything.
const TANGLE: [string, string][] = [
  ["gmail", "sheet"], ["sheet", "stripe"], ["stripe", "github"], ["github", "notion"], ["notion", "bank"],
  ["bank", "slack"], ["slack", "google"], ["google", "gmail"], ["gmail", "notion"], ["sheet", "google"], ["stripe", "slack"],
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const pct = ([x, y]: readonly [number, number]) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

export default function Sprawl() {
  const host = useRef<HTMLDivElement>(null);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    const node = host.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry?.isIntersecting) timer = window.setInterval(() => setOrdered((v) => !v), 3600);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, []);

  return (
    <div ref={host} className="relative mx-auto w-full max-w-[1000px]" style={{ aspectRatio: `${W} / ${H}` }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden>
        <g className={cn("transition-opacity duration-700", ordered ? "opacity-0" : "opacity-100")}>
          {TANGLE.map(([a, b]) => {
            const [x1, y1] = byId[a]!.from;
            const [x2, y2] = byId[b]!.from;
            const mx = (x1 + x2) / 2 + (y2 - y1) * 0.35;
            const my = (y1 + y2) / 2 - (x2 - x1) * 0.2;
            return <path key={a + b} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} className="su-tangle" />;
          })}
        </g>
        <g className={cn("transition-opacity duration-700", ordered ? "opacity-100" : "opacity-0")}>
          {NODES.map((n) => (
            <path key={n.id} d={`M${C[0]} ${C[1]} L${n.to[0]} ${n.to[1]}`} className="su-spoke" />
          ))}
        </g>
      </svg>

      {NODES.map((n) => (
        <span
          key={n.id}
          className="su-node absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={pct(ordered ? n.to : n.from)}
        >
          {n.logo ? <Image src={n.logo} alt="" width={22} height={22} /> : <span className="px-1 text-[12px] font-medium text-neutral-600">{n.label}</span>}
        </span>
      ))}

      <span
        className={cn(
          "su-hub absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-[opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.34,1.36,0.64,1)]",
          ordered ? "scale-100 opacity-100" : "scale-50 opacity-0",
        )}
        style={pct(C)}
      >
        <Image src="/setup/logos/claude.svg" alt="" width={34} height={34} />
      </span>

      <p className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-[12px] text-neutral-600 shadow-sm">
        <span className={cn("size-1.5 rounded-full transition-colors duration-500", ordered ? "bg-emerald-500" : "bg-neutral-300")} />
        {ordered ? "With your setup: Claude sees all of it" : "Today: you copy between tabs by hand"}
      </p>
    </div>
  );
}

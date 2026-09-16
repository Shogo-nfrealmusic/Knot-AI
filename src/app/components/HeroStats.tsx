"use client";

import Beam from "@/app/components/ui/beam";
import CountUp from "@/app/components/numbers/CountUp";

const stats = [
  {
    index: "01",
    label: "Platform",
    value: <CountUp to={19.9} duration={1.6} format={(n) => `$${n.toFixed(1)}k`} />,
    unit: "best month",
    caption: "Booking and payments platform I built and operate",
  },
  {
    index: "02",
    label: "AI agents",
    value: <span className="italic">Claude Code</span>,
    unit: "+ MCP",
    caption: "Agent that automates core PM workflows, published at Mercari",
  },
  {
    index: "03",
    label: "Audience",
    value: (
      <CountUp
        to={30000}
        duration={1.6}
        format={(n) => Math.round(n).toLocaleString("en-US")}
      />
    ),
    unit: "followers",
    caption: "Grown from zero around fitness and self-growth, then measured",
  },
];

export default function HeroStats() {
  return (
    // Negative margins cancel the hero's side padding so the hairlines meet the rails.
    <div className="relative -mx-4 mt-16 border-t border-neutral-200 bg-white/60 sm:-mx-10 lg:mt-20">
      <Beam showBeam className="top-0 block" />
      <div className="grid sm:grid-cols-3">
        {stats.map((stat, index) => (
          <div
            key={stat.index}
            className={`group px-4 py-8 sm:px-10 ${
              index === 0
                ? ""
                : "border-t border-neutral-200 sm:border-l sm:border-t-0"
            }`}
          >
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
              <span className="text-warm">{stat.index}</span>
              <span className="h-px w-6 bg-neutral-300 transition-all duration-500 group-hover:w-10 group-hover:bg-warm/60" />
              {stat.label}
            </p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-2 font-serif text-[clamp(2.25rem,3.4vw,3rem)] leading-none tracking-[-0.01em] text-text-primary">
              {stat.value}
              <span className="font-sans text-[13px] tracking-normal text-text-muted">
                {stat.unit}
              </span>
            </p>
            <p className="mt-4 max-w-[19rem] text-[14px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              {stat.caption}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

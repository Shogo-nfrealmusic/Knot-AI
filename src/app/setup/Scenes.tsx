"use client";

import { useEffect, useRef, useState } from "react";
import { IconPencil, IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// "What you get", told as three scenes that each play when they scroll into view, Apple-style: big picture on one
// side, three lines of copy on the other, alternating. Each picture is a small working model of the real thing.

function useInView<T extends HTMLElement>(threshold = 0.45) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => e?.isIntersecting && setSeen(true), { threshold });
    o.observe(el);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

/** A clock that only runs while the scene is on screen; returns seconds since it started. */
function useClock(running: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!running || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setT(running ? 99 : 0));
      return () => cancelAnimationFrame(id);
    }
    const start = performance.now();
    let frame = 0;
    const loop = (now: number) => {
      setT((now - start) / 1000);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  return t;
}

function Copy({ kicker, title, accent, text, points }: { kicker: string; title: string; accent: string; text: string; points: string[] }) {
  return (
    <div className="max-w-[440px]">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">{kicker}</p>
      <h3 className="mt-4 text-balance text-[clamp(30px,3.6vw,46px)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
        {title} <span className="font-serif font-normal italic tracking-[-0.01em] text-neutral-500">{accent}</span>
      </h3>
      <p className="mt-5 text-pretty text-[16px] leading-[1.75] text-neutral-600">{text}</p>
      <ul className="mt-6 space-y-2.5 border-t border-neutral-200 pt-5">
        {points.map((p) => (
          <li key={p} className="flex gap-3 text-[14px] text-neutral-700">
            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[var(--warm)]" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── 1. The interview writes CLAUDE.md ─────────────────────────────
const QA = [
  { q: "What's the one number that matters this year?", a: "Bookings. Double them before March.", line: ["goal", "double bookings before March"] },
  { q: "When should I push back on you?", a: "When I start chasing a new tool.", line: ["push_back_when", "I chase a shiny new tool"] },
  { q: "What should I never do without asking?", a: "Email a customer.", line: ["never", "email a customer unasked"] },
  { q: "How do you like reports?", a: "One page, numbers first, Mondays.", line: ["report", "Mondays · one page · numbers first"] },
];
function Interview({ t }: { t: number }) {
  const step = (i: number) => Math.min(1, Math.max(0, (t - i * 1.6) / 0.6));
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
      <div className="su-panel flex flex-col gap-3 p-5">
        <p className="text-[12px] text-neutral-400">Interview · 15 minutes</p>
        {QA.map((x, i) => (
          <div key={x.q} className="space-y-2" style={{ opacity: step(i), transform: `translateY(${(1 - step(i)) * 10}px)` }}>
            <p className="w-fit max-w-[92%] rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2 text-[13px] text-neutral-700">{x.q}</p>
            <p className="ml-auto w-fit max-w-[92%] rounded-2xl rounded-tr-sm bg-neutral-900 px-3.5 py-2 text-[13px] text-white" style={{ opacity: Math.min(1, Math.max(0, (t - i * 1.6 - 0.6) / 0.4)) }}>
              {x.a}
            </p>
          </div>
        ))}
      </div>
      <div className="su-panel overflow-hidden p-0" style={{ background: "#141413" }}>
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/50">
          <span className="text-[#D97757]">✻</span> CLAUDE.md
        </div>
        <div className="space-y-2.5 p-4 font-mono text-[12px] leading-snug">
          <p className="text-white/35"># What matters</p>
          {QA.map((x, i) => {
            const shown = Math.max(0, Math.min(x.line[1].length, Math.floor((t - i * 1.6 - 1.0) * 28)));
            return (
              <p key={x.line[0]} className="text-white/85" style={{ opacity: shown > 0 ? 1 : 0.15 }}>
                <span className="text-[#7CCB8F]">{x.line[0]}:</span> {x.line[1].slice(0, shown)}
                {shown > 0 && shown < x.line[1].length ? <span className="text-[#D97757]">▌</span> : null}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 2. One agent does, another checks ─────────────────────────────
const WORK = [
  { job: "Reply to Emma's booking change", verdict: "ok" },
  { job: "File the Oct 18 lunch", verdict: "back", fix: "Meals, not Software" },
  { job: "Cut tonight's reel", verdict: "ok" },
  { job: "Draft the Monday report", verdict: "ok" },
] as const;
function Checker({ t }: { t: number }) {
  const cycle = 2.4;
  const i = Math.floor(t / cycle) % WORK.length;
  const p = (t % cycle) / cycle;
  const w = WORK[i]!;
  const sentBack = w.verdict === "back" && p > 0.45 && p < 0.75;
  const checked = p > (w.verdict === "back" ? 0.75 : 0.45);
  const x = p < 0.2 ? p / 0.2 : 1;
  return (
    <div className="su-panel relative h-[300px] overflow-hidden p-6">
      <div className="absolute left-6 top-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm"><IconPencil className="size-7 text-neutral-700" stroke={1.5} /></div>
        <p className="mt-2 text-[12px] text-neutral-500">Agent 1 · does</p>
      </div>
      <div className="absolute right-6 top-6 text-center">
        <div className={cn("flex size-16 items-center justify-center rounded-2xl border bg-white shadow-sm transition-colors duration-300", sentBack ? "border-red-300" : checked ? "border-emerald-300" : "border-neutral-200")}><IconSearch className="size-7 text-neutral-700" stroke={1.5} /></div>
        <p className="mt-2 text-[12px] text-neutral-500">Agent 2 · checks</p>
      </div>
      <div
        className="absolute top-[118px] w-[min(250px,60%)] rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-[0_16px_32px_-18px_rgba(0,0,0,0.35)] transition-[border-color] duration-300"
        style={{ left: `calc(${6 + x * 38}% )`, transform: sentBack ? "translateX(-28%) rotate(-3deg)" : "none", transition: "transform .5s cubic-bezier(.34,1.36,.64,1)", borderColor: sentBack ? "#fca5a5" : checked ? "#86efac" : undefined }}
      >
        <p className="text-[13px] font-medium text-neutral-900">{w.job}</p>
        <p className="mt-1 text-[12px]" style={{ color: sentBack ? "#dc2626" : checked ? "#16a34a" : "#a3a3a3" }}>
          {sentBack ? `Sent back: ${"fix" in w ? w.fix : ""}` : checked ? "Checked" : "Checking…"}
        </p>
      </div>
      <div className="absolute inset-x-6 bottom-5 flex items-center justify-between text-[12px] text-neutral-400">
        <span>The one who did the work never grades it.</span>
        <span className="tabular-nums">{Math.floor(t / cycle) + (checked ? 1 : 0)} checked</span>
      </div>
    </div>
  );
}

// ── 3. The 24-hour clock ──────────────────────────────────────────
const JOBS = [
  { h: 2, label: "Videos render" },
  { h: 6.5, label: "Inbox sorted" },
  { h: 7.5, label: "Morning brief" },
  { h: 12, label: "Reviews answered" },
  { h: 18, label: "Books drafted" },
  { h: 22, label: "Decisions logged" },
];
function Clock({ t }: { t: number }) {
  const hour = (t * 2.4 + 0.5) % 24;
  const a = (h: number) => (h / 24) * Math.PI * 2 - Math.PI / 2;
  const R = 130;
  return (
    <div className="su-panel flex items-center justify-center p-6">
      <svg viewBox="-250 -190 500 380" className="w-full max-w-[480px]">
        <circle r={R} fill="none" stroke="#e5e5e5" strokeWidth="1" />
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1={Math.cos(a(i)) * (R - (i % 6 ? 6 : 12))} y1={Math.sin(a(i)) * (R - (i % 6 ? 6 : 12))} x2={Math.cos(a(i)) * R} y2={Math.sin(a(i)) * R} stroke={i % 6 ? "#d4d4d4" : "#a3a3a3"} strokeWidth="1" />
        ))}
        {[0, 6, 12, 18].map((h) => (
          <text key={h} x={Math.cos(a(h)) * (R - 26)} y={Math.sin(a(h)) * (R - 26) + 4} textAnchor="middle" fontSize="11" fill="#a3a3a3" fontFamily="var(--font-geist-mono)">
            {String(h).padStart(2, "0")}
          </text>
        ))}
        <path d={`M ${Math.cos(a(0)) * (R + 0.5)} ${Math.sin(a(0)) * (R + 0.5)} A ${R} ${R} 0 ${hour > 12 ? 1 : 0} 1 ${Math.cos(a(hour)) * R} ${Math.sin(a(hour)) * R}`} fill="none" stroke="var(--warm)" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
        {JOBS.map((j) => {
          const done = hour >= j.h;
          const x = Math.cos(a(j.h)) * R;
          const y = Math.sin(a(j.h)) * R;
          const lx = Math.cos(a(j.h)) * (R + 18);
          const ly = Math.sin(a(j.h)) * (R + 18);
          return (
            <g key={j.label}>
              <circle cx={x} cy={y} r={done ? 6 : 4} fill={done ? "var(--warm)" : "#fff"} stroke={done ? "var(--warm)" : "#a3a3a3"} strokeWidth="1.5" style={{ transition: "r .3s" }} />
              <text x={lx} y={ly + 4} textAnchor={lx > 4 ? "start" : lx < -4 ? "end" : "middle"} fontSize="11.5" fill={done ? "#171717" : "#a3a3a3"}>
                {j.label}
              </text>
            </g>
          );
        })}
        <line x1="0" y1="0" x2={Math.cos(a(hour)) * (R - 18)} y2={Math.sin(a(hour)) * (R - 18)} stroke="#171717" strokeWidth="2" strokeLinecap="round" />
        <circle r="4" fill="#171717" />
        <text y="48" textAnchor="middle" fontSize="22" fill="#171717" fontWeight="600" fontFamily="var(--font-geist-mono)">
          {String(Math.floor(hour)).padStart(2, "0")}:{String(Math.floor((hour % 1) * 60)).padStart(2, "0")}
        </text>
      </svg>
    </div>
  );
}

function Scene({ flip, visual, copy }: { flip?: boolean; visual: (t: number) => React.ReactNode; copy: React.ReactNode }) {
  const [ref, seen] = useInView<HTMLDivElement>();
  const t = useClock(seen);
  return (
    <div ref={ref} className="grid items-center gap-10 px-4 py-16 sm:px-10 md:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div className={cn("transition-[opacity,transform] duration-1000 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]", flip && "lg:order-2", seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>
        {visual(t)}
      </div>
      <div className={cn("transition-[opacity,transform] delay-150 duration-1000 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]", seen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")}>{copy}</div>
    </div>
  );
}

export default function Scenes() {
  return (
    <div className="divide-y divide-neutral-200">
      <Scene
        visual={(t) => <Interview t={t} />}
        copy={
          <Copy
            kicker="Week one"
            title="It interviews you,"
            accent="then writes the rules."
            text="Fifteen minutes of questions becomes a CLAUDE.md: your goal, your priorities, what it must never do, and when to push back."
            points={["Your goals and numbers", "What needs your yes", "How you like to hear back"]}
          />
        }
      />
      <Scene
        flip
        visual={(t) => <Checker t={t} />}
        copy={
          <Copy
            kicker="Every job"
            title="One agent does."
            accent="Another checks."
            text="Nothing reaches you until a second agent has reviewed it against your rules. Mistakes get sent back, not shipped."
            points={["Checked against CLAUDE.md", "Sent back with the reason", "You only see what passed"]}
          />
        }
      />
      <Scene
        visual={(t) => <Clock t={t} />}
        copy={
          <Copy
            kicker="Around the clock"
            title="It keeps"
            accent="its own schedule."
            text="Each job runs at the hour it should, on your machine, while you sleep, train or take the day off."
            points={["Nightly, daily, weekly, monthly", "Runs without you opening anything", "A summary waiting each morning"]}
          />
        }
      />
    </div>
  );
}

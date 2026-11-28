"use client";

// Parts every module's figures share, in the guide's language: paper plates with ink hairlines, dark panels for
// anything that runs, one orange accent, green for pass, springs on transform and opacity. Figures show the idea of a
// lesson instead of describing it; app screens are schematic on purpose, never an imitation of a real product.

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

export const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
export const POP = { type: "spring", stiffness: 380, damping: 20 } as const;
export const EASE = [0.16, 1, 0.3, 1] as const;
export const C = {
  ink: "#15171a",
  body: "#2c3036",
  soft: "#4a4f56",
  muted: "#767b82",
  rule: "#dcded9",
  ruleStrong: "#c4c7c2",
  panel: "#14161a",
  panel2: "#1d2025",
  accent: "#e0552f",
  accentSoft: "#f0b49f",
  pass: "#2e9e6a",
  passSoft: "#9fd8b8",
  page: "#f3f4f1",
} as const;

export const span = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

/** Progress 0 to 1 that plays once when the element is well in view; replay() runs it again. Reduced motion: 1. */
export function usePlay<T extends HTMLElement>(ms: number) {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const x = Math.min(1, (now - start) / ms);
          setP(x);
          if (x < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: Math.min(0.5, (innerHeight * 0.8) / Math.max(1, el.getBoundingClientRect().height)) },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ms, run]);
  const replay = () => {
    setP(0);
    setRun((r) => r + 1);
  };
  return { ref, p, replay };
}

/** A step counter that ticks while the element is on screen. Reduced motion: holds the last step. */
export function useLoop<T extends HTMLElement = HTMLDivElement>(steps: number, ms: number) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!inView || reduce) return;
    const id = window.setInterval(() => setT((n) => (n + 1) % steps), ms);
    return () => window.clearInterval(id);
  }, [inView, reduce, steps, ms]);
  return { ref, t: reduce ? steps - 1 : t };
}

/** The frame every lesson figure sits in, with an optional caption under it. */
export function Plate({ children, caption, className = "", label }: { children: React.ReactNode; caption?: React.ReactNode; className?: string; label?: string }) {
  return (
    <figure className={`gd-plate my-10 min-w-0 ${className}`} aria-label={label}>
      {children}
      {caption ? <figcaption className="px-5 pb-5 pt-1 text-[15px] leading-relaxed text-[var(--muted)] sm:px-7">{caption}</figcaption> : null}
    </figure>
  );
}

/** A dark panel: the look of anything that runs (a session, a hook, a scheduler). */
export function Panel({ children, title, right, className = "" }: { children: React.ReactNode; title?: React.ReactNode; right?: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-[var(--panel)] text-white shadow-[0_24px_50px_-30px_rgba(21,23,26,.7)] ${className}`}>
      {title || right ? (
        <div className="flex min-h-11 items-center justify-between gap-3 border-b border-white/10 py-1.5 pl-4 pr-2">
          <span className="flex min-w-0 items-center gap-3">
            <Dots />
            <span className="min-w-0 [overflow-wrap:anywhere] font-mono text-[13px] text-white/50">{title}</span>
          </span>
          {right}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function Dots() {
  return (
    <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
      <span className="size-2.5 rounded-full bg-white/20" />
      <span className="size-2.5 rounded-full bg-white/20" />
      <span className="size-2.5 rounded-full bg-white/20" />
    </span>
  );
}

export function Replay({ onClick, light = false }: { onClick: () => void; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`gd-press inline-flex h-11 shrink-0 items-center rounded-full px-4 text-[14px] ${light ? "text-white/75 ring-1 ring-white/15 hover:text-white" : "text-[var(--soft)] ring-1 ring-[var(--rule)] hover:text-[var(--ink)]"}`}
    >
      Replay
    </button>
  );
}

/** A row of choices where exactly one is on. The pill slides between them. */
export function Seg<K extends string>({ value, options, onChange, label, dark = false, id }: { value: K; options: readonly (readonly [K, string])[]; onChange: (k: K) => void; label: string; dark?: boolean; id: string }) {
  return (
    <div role="group" aria-label={label} className={`flex flex-wrap gap-1 rounded-full p-1 ${dark ? "bg-white/[.06] ring-1 ring-white/10" : "bg-white ring-1 ring-[var(--rule)]"}`}>
      {options.map(([k, name]) => {
        const on = k === value;
        return (
          <button
            key={k}
            type="button"
            onClick={() => onChange(k)}
            aria-pressed={on}
            className={`gd-press relative min-h-10 flex-1 rounded-full px-3.5 text-[14px] font-medium ${on ? (dark ? "text-[var(--ink)]" : "text-white") : dark ? "text-white/60 hover:text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
          >
            {on ? <motion.span layoutId={`seg-${id}`} className={`absolute inset-0 rounded-full ${dark ? "bg-white" : "bg-[var(--ink)]"}`} transition={SPRING} /> : null}
            <span className="relative whitespace-nowrap">{name}</span>
          </button>
        );
      })}
    </div>
  );
}

export function FileGlyph({ accent = false, className = "h-9 w-[30px]" }: { accent?: boolean; className?: string }) {
  const s = accent ? C.accent : C.ink;
  return (
    <svg viewBox="0 0 30 36" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M1 1 h20 l8 8 v26 h-28 z" fill="#ffffff" stroke={s} strokeWidth="1.4" />
      <path d="M21 1 v8 h8" fill="none" stroke={s} strokeWidth="1.4" />
      <rect x="6" y="15" width="16" height="2.5" rx="1.2" fill={C.rule} />
      <rect x="6" y="21" width="12" height="2.5" rx="1.2" fill={C.rule} />
      <rect x="6" y="27" width="14" height="2.5" rx="1.2" fill={C.rule} />
    </svg>
  );
}

export function FolderGlyph({ on = false, className = "h-[30px] w-[38px]" }: { on?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 56 44" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d="M2 6 h18 l6 6 h28 v30 h-52 z" fill={on ? "rgba(224,85,47,.08)" : "#ffffff"} stroke={on ? C.accent : C.ink} strokeWidth="1.5" style={{ transition: "stroke .3s, fill .3s" }} />
    </svg>
  );
}

/** A round check that fills green when on. */
export function Check({ on, size = "size-5" }: { on: boolean; size?: string }) {
  return (
    <motion.span className={`flex ${size} shrink-0 items-center justify-center rounded-full`} initial={false} animate={{ backgroundColor: on ? C.pass : "#e6e7e3", scale: on ? 1 : 0.88 }} transition={POP}>
      <svg viewBox="0 0 20 20" className="size-[62%]" aria-hidden="true">
        <motion.path d="M4.5 10.5 l3.5 3.5 l7.5 -8" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on ? 1 : 0 }} transition={{ duration: 0.3, ease: EASE }} />
      </svg>
    </motion.span>
  );
}

/** A round cross for a blocked or failed outcome. */
export function Cross({ on = true, size = "size-5" }: { on?: boolean; size?: string }) {
  return (
    <motion.span className={`flex ${size} shrink-0 items-center justify-center rounded-full`} initial={false} animate={{ backgroundColor: on ? C.accent : "#e6e7e3" }} transition={POP}>
      <svg viewBox="0 0 20 20" className="size-[58%]" aria-hidden="true">
        <path d="M6 6 L14 14 M14 6 L6 14" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </motion.span>
  );
}

/** A small mono tag, e.g. a file name or a verdict. */
export function Tag({ children, tone = "ink", className = "" }: { children: React.ReactNode; tone?: "ink" | "accent" | "pass" | "muted" | "dark"; className?: string }) {
  const tones = {
    ink: "bg-white text-[var(--ink)] ring-[var(--rule-strong)]",
    accent: "bg-[rgba(224,85,47,.09)] text-[var(--accent)] ring-[var(--accent)]",
    pass: "bg-[rgba(46,158,106,.1)] text-[#1f7a50] ring-[var(--pass)]",
    muted: "bg-transparent text-[var(--muted)] ring-[var(--rule)]",
    dark: "bg-white/[.07] text-white/80 ring-white/15",
  } as const;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[12.5px] ring-1 ${tones[tone]} ${className}`}>{children}</span>;
}

/** A thin line that draws itself between two points of an SVG when `on`. */
export function Wire({ d, on, color = C.accent, dashed = false, width = 1.6 }: { d: string; on: boolean; color?: string; dashed?: boolean; width?: number }) {
  return (
    <g>
      <path d={d} fill="none" stroke={C.ruleStrong} strokeWidth={1.2} strokeDasharray={dashed ? "4 5" : undefined} />
      <motion.path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.7, ease: EASE }} />
    </g>
  );
}

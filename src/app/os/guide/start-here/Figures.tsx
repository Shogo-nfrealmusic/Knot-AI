"use client";

// One figure per lesson of Start here. Each one shows the idea of its lesson instead of describing it.
// Language of /free/starter and /free/46: paper grid, ink hairlines, one orange accent, springs on transform and
// opacity. App screens are schematic on purpose: no product screenshot is imitated.

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { STATIONS, VERSION_CHECK, commandsFor, stationAt, type Os } from "../data";

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
const span = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

/** Progress 0 to 1 that plays once when the element is well in view; replay() runs it again. */
function usePlay<T extends HTMLElement>(ms: number) {
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
      { threshold: Math.min(0.6, (innerHeight * 0.85) / Math.max(1, el.getBoundingClientRect().height)) },
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

function Plate({ children, caption, className = "" }: { children: React.ReactNode; caption?: React.ReactNode; className?: string }) {
  return (
    <figure className={`gd-plate my-10 ${className}`}>
      {children}
      {caption ? <figcaption className="px-5 pb-5 pt-1 text-[15px] leading-relaxed text-[var(--muted)] sm:px-7">{caption}</figcaption> : null}
    </figure>
  );
}

function Replay({ onClick, light = false }: { onClick: () => void; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`gd-press inline-flex h-11 items-center rounded-full px-4 text-[14px] ${light ? "text-white/75 ring-1 ring-white/15 hover:text-white" : "text-[var(--soft)] ring-1 ring-[var(--rule)] hover:text-[var(--ink)]"}`}
    >
      Replay
    </button>
  );
}

/* ───────────── hero: where you'll be in 30 minutes ───────────── */

// The end state at a glance: Claude Code running in your own folder, the first job's file in it, and the four
// stops ticked in order. The window is schematic; the folder name and file are the module's.
export function EndState({ os }: { os: Os }) {
  const reduce = useReducedMotion();
  const folder = os === "windows" ? "$HOME\\my-business" : "~/my-business";
  const at = (i: number) => (reduce ? 0 : 0.5 + i * 0.32);
  return (
    <figure className="gd-plate p-3 sm:p-4" aria-label="In 30 minutes: Claude Code installed, signed in, running in your folder, and the first job done.">
      <div className="overflow-hidden rounded-xl bg-[var(--panel)] text-white shadow-[0_24px_50px_-30px_rgba(21,23,26,.7)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="ml-2 min-w-0 truncate font-mono text-[13px] text-white/50">{folder} · claude</span>
        </div>
        <div className="px-4 py-4 font-mono text-[14px] leading-[1.7]">
          <p className="text-white/45">Claude Code is running in this folder.</p>
          <p className="mt-2 text-white">
            <span className="text-white/40">&gt; </span>I run … Interview me about the work I repeat every week.
          </p>
          <motion.p className="mt-2 text-[#9fd8b8]" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: at(3), duration: 0.4 }}>
            Wrote repeat-work.md
          </motion.p>
        </div>
      </div>
      <motion.div
        className="mx-1 mt-3 flex items-center gap-3 rounded-xl bg-white px-3 py-3 ring-1 ring-[var(--accent)]"
        initial={reduce ? false : { opacity: 0, y: 10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 20, delay: at(3) + 0.15 }}
      >
        <svg viewBox="0 0 30 36" className="h-9 w-[30px] shrink-0" aria-hidden="true">
          <path d="M1 1 h20 l8 8 v26 h-28 z" fill="#ffffff" stroke="#15171a" strokeWidth="1.3" />
          <rect x="6" y="15" width="16" height="2.5" rx="1.2" fill="#dcded9" />
          <rect x="6" y="21" width="12" height="2.5" rx="1.2" fill="#dcded9" />
        </svg>
        <span className="min-w-0">
          <span className="block font-mono text-[15px] text-[var(--ink)]">repeat-work.md</span>
          <span className="block text-[14px] text-[var(--soft)]">Your first job list. You didn&apos;t write it.</span>
        </span>
      </motion.div>
      <ol className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 px-1 pb-1 sm:grid-cols-4">
        {STATIONS.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 text-[15px] text-[var(--ink)]">
            <motion.span
              className="flex size-6 shrink-0 items-center justify-center rounded-full"
              initial={reduce ? false : { backgroundColor: "#dcded9", scale: 0.8 }}
              animate={{ backgroundColor: "#2e9e6a", scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 18, delay: at(i) }}
            >
              <svg viewBox="0 0 20 20" className="size-3.5" aria-hidden="true">
                <path d="M4.5 10.5 l3.5 3.5 l7.5 -8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
            {s.label}
          </li>
        ))}
      </ol>
    </figure>
  );
}

/* ───────────── the path: install, sign in, open a folder, first job (follows the scroll) ───────────── */

export function PathFigure() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const p = reduce ? scrollYProgress : smooth;
  const [index, setIndex] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setIndex(stationAt(v * 1.04).index));
  const along = useTransform(p, (v) => Math.min(1, v * 1.04));
  return (
    <section ref={ref} aria-label="The path through this module" className="relative h-[300vh]">
      <div className="sticky top-14 flex h-[calc(100svh-56px)] flex-col justify-center overflow-hidden px-5 sm:px-8">
        <div className="mx-auto w-full max-w-[980px]">
          <h2 className="gd-h2">
            Four stops. <span className="gd-serif">Scroll to walk them.</span>
          </h2>
          <div className="mt-6 grid items-center gap-5 sm:mt-8 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
            <div className="gd-plate gd-short-hide relative aspect-[16/10] w-full overflow-hidden max-sm:aspect-[16/9]">
              {STATIONS.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="absolute inset-0 flex items-center justify-center p-5 sm:p-8"
                  initial={false}
                  animate={{ opacity: i === index ? 1 : 0, y: i === index ? 0 : i < index ? -16 : 16, scale: i === index ? 1 : 0.98 }}
                  transition={SPRING}
                  aria-hidden={i !== index}
                >
                  <Vignette i={i} />
                </motion.div>
              ))}
            </div>
            {/* phones: a horizontal stepper and the current stop's sentence */}
            <div className="sm:hidden">
              <div className="relative flex justify-between">
                <span className="absolute left-[22px] right-[22px] top-[21px] h-px bg-[var(--rule-strong)]" aria-hidden="true" />
                <motion.span style={{ scaleX: along }} className="absolute left-[22px] right-[22px] top-[21px] h-px origin-left bg-[var(--accent)]" aria-hidden="true" />
                {STATIONS.map((s, i) => (
                  <motion.span
                    key={s.label}
                    className="relative z-10 flex size-[43px] items-center justify-center rounded-full font-mono text-[14px] ring-1"
                    initial={false}
                    animate={{ backgroundColor: i <= index ? "#e0552f" : "#ffffff", color: i <= index ? "#ffffff" : "#868b92" }}
                    style={{ ["--tw-ring-color" as string]: i <= index ? "#e0552f" : "#c4c7c2" }}
                    transition={SPRING}
                  >
                    {i + 1}
                  </motion.span>
                ))}
              </div>
              <motion.div key={index} className="mt-4" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
                <p className="text-[19px] font-semibold tracking-[-0.015em] text-[var(--ink)]">{STATIONS[index].label}</p>
                <p className="mt-1 text-[17px] leading-relaxed text-[var(--soft)]">{STATIONS[index].text}</p>
              </motion.div>
            </div>
            <ol className="relative hidden gap-1 sm:grid">
              <span className="absolute bottom-6 left-[21px] top-6 w-px bg-[var(--rule-strong)]" aria-hidden="true" />
              <motion.span style={{ scaleY: along }} className="absolute bottom-6 left-[21px] top-6 w-px origin-top bg-[var(--accent)]" aria-hidden="true" />
              {STATIONS.map((s, i) => (
                <li key={s.label} className="relative flex gap-4 py-2.5">
                  <motion.span
                    className="relative z-10 mt-0.5 flex size-[43px] shrink-0 items-center justify-center rounded-full font-mono text-[14px] ring-1"
                    initial={false}
                    animate={{
                      backgroundColor: i <= index ? "#e0552f" : "#ffffff",
                      color: i <= index ? "#ffffff" : "#868b92",
                      scale: i === index ? 1.06 : 1,
                    }}
                    style={{ ["--tw-ring-color" as string]: i <= index ? "#e0552f" : "#c4c7c2" }}
                    transition={SPRING}
                  >
                    {i + 1}
                  </motion.span>
                  <div className="min-w-0">
                    <p className={`text-[18px] font-semibold tracking-[-0.015em] transition-colors duration-300 ${i === index ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>{s.label}</p>
                    <motion.p
                      className="overflow-hidden text-[16px] leading-relaxed text-[var(--soft)]"
                      initial={false}
                      animate={{ height: i === index ? "auto" : 0, opacity: i === index ? 1 : 0 }}
                      transition={SPRING}
                    >
                      {s.text}
                    </motion.p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// Schematic stills for each stop. Shapes only, no imitation of a real app's screen.
function Vignette({ i }: { i: number }) {
  if (i === 0)
    return (
      <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden="true">
        <rect x="40" y="40" width="400" height="220" rx="14" fill="#14161a" />
        <circle cx="64" cy="62" r="5" fill="#ffffff" opacity=".18" />
        <circle cx="82" cy="62" r="5" fill="#ffffff" opacity=".18" />
        <circle cx="100" cy="62" r="5" fill="#ffffff" opacity=".18" />
        <text x="64" y="120" className="font-mono" fontSize="16" fill="#ffffff" opacity=".45">$</text>
        <text x="84" y="120" className="font-mono" fontSize="16" fill="#ffffff">curl … | bash</text>
        <rect x="64" y="146" width="230" height="8" rx="4" fill="#ffffff" opacity=".12" />
        <rect x="64" y="166" width="180" height="8" rx="4" fill="#ffffff" opacity=".12" />
        <text x="64" y="220" className="font-mono" fontSize="16" fill="#ffffff" opacity=".45">$</text>
        <rect x="84" y="208" width="10" height="16" fill="#e0552f" />
      </svg>
    );
  if (i === 1)
    return (
      <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden="true">
        <rect x="20" y="70" width="170" height="130" rx="12" fill="#14161a" />
        <text x="38" y="112" className="font-mono" fontSize="14" fill="#ffffff">$ claude</text>
        <rect x="38" y="130" width="110" height="7" rx="3.5" fill="#ffffff" opacity=".14" />
        <path d="M196 120 C240 90 250 90 270 100" fill="none" stroke="#e0552f" strokeWidth="1.6" strokeDasharray="4 5" />
        <path d="M270 200 C250 214 240 214 196 170" fill="none" stroke="#15171a" strokeWidth="1.2" strokeDasharray="4 5" />
        <rect x="270" y="50" width="190" height="200" rx="12" fill="#ffffff" stroke="#15171a" strokeWidth="1.3" />
        <line x1="270" y1="78" x2="460" y2="78" stroke="#dcded9" />
        <rect x="300" y="108" width="130" height="10" rx="5" fill="#dcded9" />
        <rect x="300" y="132" width="130" height="30" rx="8" fill="none" stroke="#c4c7c2" />
        <rect x="300" y="176" width="130" height="34" rx="17" fill="#15171a" />
        <text x="365" y="198" textAnchor="middle" fontSize="13" fill="#ffffff">Log in</text>
        <text x="300" y="236" fontSize="12" fill="#868b92">your paid Claude account</text>
      </svg>
    );
  if (i === 2)
    return (
      <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden="true">
        {[0, 1, 2].map((k) => (
          <g key={k} transform={`translate(${40 + k * 70} 90)`} opacity=".35">
            <path d="M0 10 h20 l6 6 h30 v40 h-56 z" fill="#ffffff" stroke="#15171a" strokeWidth="1.2" />
          </g>
        ))}
        <rect x="262" y="58" width="180" height="150" rx="16" fill="rgba(224,85,47,.08)" stroke="#e0552f" strokeWidth="1.5" />
        <path d="M312 98 h34 l10 10 h50 v62 h-94 z" fill="#ffffff" stroke="#15171a" strokeWidth="1.4" />
        <text x="352" y="196" textAnchor="middle" className="font-mono" fontSize="14" fill="#15171a">my-business</text>
        <text x="352" y="236" textAnchor="middle" fontSize="12.5" fill="#e0552f">Claude works in here</text>
      </svg>
    );
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full" aria-hidden="true">
      <path d="M120 70 h70 l18 18 h152 v150 h-240 z" fill="#ffffff" stroke="#15171a" strokeWidth="1.4" />
      <text x="136" y="108" className="font-mono" fontSize="13" fill="#868b92">my-business/</text>
      <g transform="translate(176 126)">
        <path d="M0 0 h60 l18 18 v72 h-78 z" fill="#ffffff" stroke="#e0552f" strokeWidth="1.6" />
        <rect x="12" y="34" width="50" height="5" rx="2.5" fill="#dcded9" />
        <rect x="12" y="48" width="40" height="5" rx="2.5" fill="#dcded9" />
        <rect x="12" y="62" width="46" height="5" rx="2.5" fill="#dcded9" />
      </g>
      <text x="290" y="170" className="font-mono" fontSize="14" fill="#15171a">repeat-work.md</text>
      <text x="290" y="192" fontSize="12.5" fill="#e0552f">written by Claude, not you</text>
    </svg>
  );
}

/* ───────────── S.1: the plan is the gate ───────────── */

export function PlanGate({ quote }: { quote: string }) {
  const [paid, setPaid] = useState(true);
  const reduce = useReducedMotion();
  return (
    <Plate caption={<>The docs: &ldquo;{quote}&rdquo; Pro is enough to start. Tap the plan to switch it.</>}>
      <div className="grid items-center gap-6 p-5 sm:grid-cols-[1fr_auto_1fr] sm:p-8">
        <button
          type="button"
          onClick={() => setPaid((v) => !v)}
          aria-pressed={paid}
          className="gd-press min-h-[96px] rounded-2xl bg-white px-5 py-4 text-left ring-1 ring-[var(--rule)] hover:ring-[var(--ink)]"
        >
          <span className="block text-[13px] text-[var(--muted)]">Your claude.ai plan</span>
          <motion.span key={String(paid)} className="mt-1 block text-[22px] font-semibold tracking-[-0.02em]" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
            {paid ? "Pro or higher" : "Free"}
          </motion.span>
          <span className="mt-1 block text-[13px] text-[var(--accent)]">Tap to switch</span>
        </button>
        {/* the wire: across on wide screens, down on phones */}
        <svg viewBox="0 0 120 40" className="mx-auto hidden h-10 w-[120px] sm:block" aria-hidden="true">
          <line x1="4" y1="20" x2="116" y2="20" stroke={paid ? "#e0552f" : "#c4c7c2"} strokeWidth="1.6" strokeDasharray={paid ? "0" : "4 5"} style={{ transition: "stroke .3s" }} />
          {paid && !reduce ? (
            <motion.circle r="4" cy="20" fill="#e0552f" initial={{ cx: 4 }} animate={{ cx: [4, 116] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
          ) : null}
        </svg>
        <svg viewBox="0 0 40 44" className="mx-auto -my-3 h-11 w-10 sm:hidden" aria-hidden="true">
          <line x1="20" y1="2" x2="20" y2="42" stroke={paid ? "#e0552f" : "#c4c7c2"} strokeWidth="1.6" strokeDasharray={paid ? "0" : "4 5"} style={{ transition: "stroke .3s" }} />
          {paid && !reduce ? (
            <motion.circle r="4" cx="20" fill="#e0552f" initial={{ cy: 2 }} animate={{ cy: [2, 42] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} />
          ) : null}
        </svg>
        <div className="flex items-center gap-4 rounded-2xl bg-[var(--panel)] px-5 py-4 text-white">
          <svg viewBox="0 0 60 72" className="h-[56px] w-[46px] shrink-0" aria-hidden="true">
            <motion.path d="M14 34 V20 a16 16 0 0 1 32 0 V34" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" initial={false} animate={{ y: paid ? -9 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 14 }} />
            <rect x="4" y="32" width="52" height="38" rx="6" fill="#ffffff" />
            <motion.circle cx="30" cy="49" r="4" initial={false} animate={{ fill: paid ? "#2e9e6a" : "#e0552f" }} />
          </svg>
          <div>
            <p className="text-[17px] font-semibold">Claude Code</p>
            <p className="text-[14px] text-white/60">{paid ? "Unlocked" : "Not included"}</p>
          </div>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── S.2: two doors, one room ───────────── */

const DOORS = {
  app: { name: "Desktop app", looks: "A normal app with a window", good: "Starting today with zero setup", catch: "Some lessons here use terminal commands" },
  terminal: { name: "Terminal", looks: "A black box you type into", good: "Everything in Modules 1 to 6", catch: "Looks scary for about ten minutes" },
} as const;

const DOOR_WIRE = {
  app: "M74 72 C74 112 160 104 160 142",
  terminal: "M246 72 C246 112 160 104 160 142",
} as const;

export function Doors() {
  const [door, setDoor] = useState<keyof typeof DOORS>("terminal");
  const d = DOORS[door];
  return (
    <Plate caption="Both doors are official. Both open onto the same Claude Code. Tap a door.">
      <div className="p-5 sm:p-8">
        {/* drawn at 320 units wide so its labels stay near their set size on a phone */}
        <svg viewBox="0 0 320 214" className="mx-auto block w-full max-w-[440px]" role="img" aria-label={`The ${d.name} door leads to the same Claude Code as the other door.`}>
          {(["app", "terminal"] as const).map((k, i) => {
            const x = i === 0 ? 14 : 186;
            const on = door === k;
            return (
              <g key={k} transform={`translate(${x} 8)`}>
                <motion.rect width="120" height="64" rx="12" initial={false} animate={{ fill: on ? (k === "terminal" ? "#14161a" : "#ffffff") : "#ffffff", stroke: on ? "#e0552f" : "#c4c7c2" }} strokeWidth="1.6" transition={{ duration: 0.3 }} />
                {k === "terminal" ? (
                  <text x="60" y="40" textAnchor="middle" className="font-mono" fontSize="17" fill={on ? "#ffffff" : "#15171a"} style={{ transition: "fill .3s" }}>{"> _"}</text>
                ) : (
                  <g>
                    <rect x="36" y="18" width="48" height="28" rx="5" fill="none" stroke="#15171a" strokeWidth="1.3" />
                    <line x1="36" y1="26" x2="84" y2="26" stroke="#15171a" strokeWidth="1" />
                  </g>
                )}
              </g>
            );
          })}
          <path d={DOOR_WIRE.app} fill="none" stroke={door === "app" ? "#e0552f" : "#c4c7c2"} strokeWidth="1.6" style={{ transition: "stroke .3s" }} />
          <path d={DOOR_WIRE.terminal} fill="none" stroke={door === "terminal" ? "#e0552f" : "#c4c7c2"} strokeWidth="1.6" style={{ transition: "stroke .3s" }} />
          <motion.circle
            key={door}
            r="5"
            fill="#e0552f"
            initial={{ offsetDistance: "0%" } as never}
            animate={{ offsetDistance: "100%" } as never}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ offsetPath: `path("${DOOR_WIRE[door]}")` } as React.CSSProperties}
          />
          <rect x="70" y="142" width="180" height="62" rx="14" fill="#15171a" />
          <text x="160" y="170" textAnchor="middle" fontSize="17" fontWeight="600" fill="#ffffff">Claude Code</text>
          <text x="160" y="190" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,.65)">the same one</text>
        </svg>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(["app", "terminal"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setDoor(k)}
              aria-pressed={door === k}
              className="gd-press min-h-11 rounded-full px-4 text-[15px] font-medium text-[var(--soft)] ring-1 ring-[var(--rule)] aria-pressed:bg-[var(--ink)] aria-pressed:text-white aria-pressed:ring-[var(--ink)]"
            >
              {DOORS[k].name}
              {k === "terminal" ? <span className="ml-1.5 font-normal opacity-70">· my advice</span> : null}
            </button>
          ))}
        </div>
        <motion.dl key={door} className="mt-6 divide-y divide-[var(--rule)] border-y border-[var(--rule)]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
          {[
            ["What it looks like", d.looks],
            ["Good for", d.good],
            ["The catch", d.catch],
          ].map(([k, v]) => (
            <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[180px_1fr]">
              <dt className="text-[15px] text-[var(--muted)]">{k}</dt>
              <dd className="text-[17px] text-[var(--ink)]">{v}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </Plate>
  );
}

/* ───────────── S.3: the install, typed, and the real success line ───────────── */

// Output of `claude --version` on my machine on 2026-11-27. Readers will see a different number.
const REAL_VERSION = "2.1.332";

export function InstallTerminal({ os }: { os: Os }) {
  const { ref, p, replay } = usePlay<HTMLDivElement>(7600);
  const c = commandsFor(os);
  const win = os === "windows";
  const prompt = win ? "PS C:\\Users\\you>" : "~ %";
  const typed = (text: string, a: number, b: number) => text.slice(0, Math.round(text.length * span(p, a, b)));
  const one = typed(c.install, 0.03, 0.3);
  const two = typed(VERSION_CHECK, 0.52, 0.64);
  const caret = (on: boolean) => (on ? <span className="gd-caret ml-px inline-block h-[1.05em] w-[8px] translate-y-[3px] bg-[var(--accent)]" /> : null);
  return (
    <Plate
      caption={
        <>
          The version line is the real one from my computer on Nov 27, 2026. Your number will be different. The part that
          matters is <code className="gd-code">(Claude Code)</code>.
        </>
      }
    >
      <div ref={ref} className="p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl bg-[var(--panel)] shadow-[0_24px_50px_-30px_rgba(21,23,26,.7)]">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 py-1.5 pl-4 pr-2">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="ml-2 font-mono text-[13px] text-white/50">{c.shell}</span>
            </span>
            <Replay onClick={replay} light />
          </div>
          <div className="min-h-[330px] px-4 py-4 font-mono text-[15px] leading-[1.7] text-white sm:px-5">
            <p className="[overflow-wrap:anywhere]">
              <span className="text-white/40">{prompt} </span>
              {one}
              {caret(p > 0.02 && p < 0.31)}
            </p>
            <motion.p className="mt-2 border-l-2 border-white/15 pl-3 font-sans text-[14px] italic text-white/50" initial={false} animate={{ opacity: p > 0.33 ? 1 : 0, x: p > 0.33 ? 0 : -6 }} transition={SPRING}>
              The installer prints its own progress here. Wait for your prompt to come back.
            </motion.p>
            <motion.div className="my-4 flex items-center gap-3 text-white/40" initial={false} animate={{ opacity: p > 0.43 ? 1 : 0 }} transition={{ duration: 0.4 }}>
              <span className="h-px flex-1 bg-white/15" />
              <span className="font-sans text-[13px]">close the window, open a new one</span>
              <span className="h-px flex-1 bg-white/15" />
            </motion.div>
            <motion.p initial={false} animate={{ opacity: p > 0.48 ? 1 : 0 }}>
              <span className="text-white/40">{prompt} </span>
              {two}
              {caret(p > 0.5 && p < 0.66)}
            </motion.p>
            <motion.p className="mt-1" initial={false} animate={{ opacity: p > 0.68 ? 1 : 0, y: p > 0.68 ? 0 : 4 }} transition={SPRING}>
              {REAL_VERSION}{" "}
              <span className="relative">
                (Claude Code)
                <motion.span className="absolute -bottom-0.5 left-0 h-[2px] w-full origin-left bg-[var(--accent)]" initial={false} animate={{ scaleX: p > 0.8 ? 1 : 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
              </span>
            </motion.p>
            <motion.p className="mt-3 font-sans text-[14px] text-[#ffb59c]" initial={false} animate={{ opacity: p > 0.86 ? 1 : 0 }} transition={{ duration: 0.4 }}>
              That&apos;s it. Installed.
            </motion.p>
          </div>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── S.4: what Claude can touch ───────────── */

export function FolderReach({ os }: { os: Os }) {
  const [wide, setWide] = useState(false);
  const home = os === "windows" ? "$HOME" : "~";
  const sep = os === "windows" ? "\\" : "/";
  const others = ["Desktop", "Documents", "Downloads", "Pictures"];
  return (
    <Plate caption="Claude Code can read and change what's inside the folder you start it in. Give it a room, not the house.">
      <div className="p-5 sm:p-8">
        <div className="grid grid-cols-2 gap-3">
          {[false, true].map((w) => (
            <button
              key={String(w)}
              type="button"
              onClick={() => setWide(w)}
              aria-pressed={wide === w}
              className="gd-press min-h-11 rounded-full px-3 font-mono text-[14px] text-[var(--soft)] ring-1 ring-[var(--rule)] aria-pressed:bg-[var(--ink)] aria-pressed:text-white aria-pressed:ring-[var(--ink)]"
            >
              claude in {w ? home : `${home}${sep}my-business`}
            </button>
          ))}
        </div>
        <div className="relative mt-6 rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)] sm:p-6">
          <p className="font-mono text-[14px] text-[var(--muted)]">{home}  your home folder</p>
          <div className="relative mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {/* the reach: one shape that moves between the single folder and the whole home folder */}
            {wide ? <Reach /> : null}
            {[...others, "my-business"].map((name) => {
              const mine = name === "my-business";
              const inside = wide || mine;
              return (
                <div key={name} className="relative flex flex-col items-center gap-2 rounded-xl px-1 py-3">
                  {mine && !wide ? <Reach /> : null}
                  <motion.svg viewBox="0 0 56 44" className="relative h-[38px] w-[48px]" aria-hidden="true" initial={false} animate={{ opacity: inside ? 1 : 0.35 }} transition={SPRING}>
                    <path d="M2 6 h18 l6 6 h28 v30 h-52 z" fill="#ffffff" stroke={inside ? "#e0552f" : "#15171a"} strokeWidth="1.4" style={{ transition: "stroke .3s" }} />
                  </motion.svg>
                  <motion.span className="relative max-w-full truncate text-center font-mono text-[12.5px] text-[var(--ink)]" initial={false} animate={{ opacity: inside ? 1 : 0.45 }} transition={SPRING}>
                    {name}
                  </motion.span>
                </div>
              );
            })}
          </div>
          <motion.p key={String(wide)} className={`mt-5 text-[16px] leading-relaxed ${wide ? "text-[var(--accent)]" : "text-[var(--ink)]"}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
            {wide ? "Everything in your home folder is now in reach: documents, downloads, photos." : "Only my-business is in reach. The rest of your computer stays out of it."}
          </motion.p>
        </div>
      </div>
    </Plate>
  );
}

function Reach() {
  return (
    <motion.span
      layoutId="gd-reach"
      className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-[rgba(224,85,47,0.07)] ring-[1.5px] ring-[var(--accent)]"
      transition={SPRING}
      aria-hidden="true"
    />
  );
}

/* ───────────── S.5: the interview, then a file you didn't write ───────────── */

export function FirstJob() {
  const { ref, p, replay } = usePlay<HTMLDivElement>(6200);
  const asks = [0.08, 0.26, 0.44];
  const fileAt = 0.72;
  return (
    <Plate caption="A sketch of what happens, not a real transcript: it asks, you answer, and a file appears in the folder.">
      <div ref={ref} className="grid gap-4 p-5 sm:grid-cols-[1.3fr_1fr] sm:p-8">
        <div className="rounded-2xl bg-[var(--panel)] p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[13px] text-white/45">claude · my-business</span>
            <Replay onClick={replay} light />
          </div>
          <div className="mt-3 grid gap-2.5">
            {asks.map((at, k) => (
              <div key={k}>
                <motion.div className="flex items-center gap-2" initial={false} animate={{ opacity: p > at ? 1 : 0, y: p > at ? 0 : 6 }} transition={SPRING}>
                  <span className="font-mono text-[14px] text-[var(--accent)]">?</span>
                  <span className="text-[14px] text-white/80">Question {k + 1}</span>
                  <span className="h-[6px] flex-1 rounded-full bg-white/12" />
                </motion.div>
                <motion.div className="mt-1.5 flex justify-end" initial={false} animate={{ opacity: p > at + 0.08 ? 1 : 0, y: p > at + 0.08 ? 0 : 6 }} transition={SPRING}>
                  <span className="flex h-7 w-[58%] items-center justify-end rounded-lg bg-white/10 px-2.5 text-[13px] text-white/60">your answer</span>
                </motion.div>
              </div>
            ))}
            <motion.p className="mt-1 font-mono text-[13px] text-[#9fd8b8]" initial={false} animate={{ opacity: p > 0.64 ? 1 : 0 }} transition={{ duration: 0.4 }}>
              Write repeat-work.md? yes
            </motion.p>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)]">
          <p className="font-mono text-[13px] text-[var(--muted)]">my-business/</p>
          <div className="relative mt-3 h-[150px]">
            <motion.p className="absolute inset-0 flex items-center justify-center text-[14px] text-[var(--muted)]" initial={false} animate={{ opacity: p > fileAt ? 0 : 1 }}>
              Nothing here yet
            </motion.p>
            <motion.div
              className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-xl px-2 py-2 ring-1 ring-[var(--accent)]"
              initial={false}
              animate={{ opacity: p > fileAt ? 1 : 0, scale: p > fileAt ? 1 : 0.9, y: p > fileAt ? 0 : 10 }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            >
              <svg viewBox="0 0 30 36" className="h-9 w-[30px] shrink-0" aria-hidden="true">
                <path d="M1 1 h20 l8 8 v26 h-28 z" fill="#ffffff" stroke="#15171a" strokeWidth="1.3" />
                <rect x="6" y="15" width="16" height="2.5" rx="1.2" fill="#dcded9" />
                <rect x="6" y="21" width="12" height="2.5" rx="1.2" fill="#dcded9" />
              </svg>
              <span className="min-w-0">
                <span className="block font-mono text-[14px] text-[var(--ink)]">repeat-work.md</span>
                <span className="block text-[13px] text-[var(--accent)]">just now · not written by you</span>
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── S.6: who approves what ───────────── */

const LANES = [
  { k: "runs", label: "Routine action", out: "Approved by the classifier, runs" },
  { k: "blocked", label: "Judged risky", out: "Blocked" },
  { k: "asks", label: "Some actions", out: "Comes to you as a question" },
] as const;

export function ApprovalLanes() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(2);
  return (
    <Plate caption="Auto mode in recent versions: a separate classifier model decides most actions. The ones that reach you are decisions. Tap a lane.">
      <div className="grid gap-5 p-5 sm:grid-cols-[150px_1fr] sm:items-center sm:p-8">
        <div className="flex items-center justify-center rounded-2xl bg-[var(--panel)] px-4 py-5 text-center text-white sm:h-[200px] sm:flex-col">
          <div>
            <p className="text-[16px] font-semibold">Classifier</p>
            <p className="mt-1 text-[13px] text-white/55">a separate model</p>
          </div>
        </div>
        <ul className="grid gap-2.5">
          {LANES.map((l, k) => {
            const on = i === k;
            return (
              <li key={l.k}>
                <button
                  type="button"
                  onClick={() => setI(k)}
                  aria-pressed={on}
                  className="gd-press relative flex min-h-[56px] w-full items-center gap-3 overflow-hidden rounded-xl bg-white px-4 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-[var(--ink)]"
                >
                  {on && !reduce ? (
                    <motion.span
                      key={`dot-${k}`}
                      className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[var(--accent)]"
                      initial={{ x: 0, opacity: 0 }}
                      animate={{ x: [0, 40], opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  ) : null}
                  <span className="flex min-w-0 flex-1 flex-col py-2.5 sm:flex-row sm:items-center sm:gap-3">
                    <span className="text-[15px] text-[var(--muted)] sm:w-[120px] sm:shrink-0">{l.label}</span>
                    <span className={`text-[16px] leading-snug ${on ? "font-semibold text-[var(--ink)]" : "text-[var(--soft)]"}`}>{l.out}</span>
                  </span>
                  {l.k === "asks" ? <span className="shrink-0 font-mono text-[13px] text-[var(--accent)]">you</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Plate>
  );
}

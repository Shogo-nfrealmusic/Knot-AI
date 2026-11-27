"use client";

// One figure per lesson of Start here. Rule for this page (owner, 2026-11-27): real things over drawn stand-ins.
// - Terminal windows copy the real macOS Terminal (Basic profile) and Windows PowerShell looks, and show only real
//   commands and real output (captured on 2026-11-27). Nothing in them is invented.
// - Screens that exist but can't be captured from here (the Claude app, the sign-in page, Finder) are marked slots
//   listed in SHOTS (data.ts) until Shogo takes them. No app screen is faked.
// - The remaining diagrams (plan lock, folder reach, approval rows) explain an idea; they don't imitate a screen.

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { LESSONS, PLAN_FILE, PLAN_OUTLINE, REAL_VERSION_LINE, SHOTS, VERSION_CHECK, commandsFor, type Os } from "../data";

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

function Plate({ children, caption, className = "" }: { children: React.ReactNode; caption: React.ReactNode; className?: string }) {
  return (
    <figure className={`gd-plate my-10 ${className}`}>
      {children}
      <figcaption className="px-5 pb-5 pt-1 text-[15px] leading-relaxed text-[var(--muted)] sm:px-7">{caption}</figcaption>
    </figure>
  );
}

function Replay({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="gd-press inline-flex h-11 items-center rounded-full px-4 text-[14px] text-[var(--soft)] ring-1 ring-[var(--rule)] hover:text-[var(--ink)]">
      Replay
    </button>
  );
}

/* ───────────── real terminal windows ───────────── */

/** The prompt each system really prints: zsh's default on a Mac, PowerShell's on Windows. "you" stands for your name. */
function promptFor(os: Os, inFolder: boolean) {
  return os === "windows" ? `PS C:\\Users\\you${inFolder ? "\\my-business" : ""}>` : `you@Mac ${inFolder ? "my-business" : "~"} %`;
}

export type TermLine = { cmd?: string; out?: string; inFolder?: boolean; caret?: boolean };

/** macOS Terminal (Basic profile) or Windows PowerShell, showing real commands and real output only. */
export function Term({ os, lines, className = "" }: { os: Os; lines: TermLine[]; className?: string }) {
  const win = os === "windows";
  const inFolder = lines.some((l) => l.inFolder);
  return (
    <div className={`overflow-hidden text-left ${win ? "rounded-lg bg-[#0c0c0c] shadow-[0_0_0_1px_#2b2b2b,0_22px_50px_-24px_rgba(0,0,0,.6)]" : "rounded-[10px] bg-white shadow-[0_0_0_0.5px_rgba(0,0,0,.28),0_22px_50px_-24px_rgba(0,0,0,.45)]"} ${className}`}>
      {win ? (
        <div className="flex h-9 items-end gap-2 bg-[#202020] px-2">
          <span className="flex h-7 items-center rounded-t-md bg-[#0c0c0c] px-3 text-[12px] text-white/85">Windows PowerShell</span>
        </div>
      ) : (
        <div className="relative flex h-7 items-center border-b border-[#d6d6d6] bg-[#e8e8e8] px-3">
          <span className="flex gap-2">
            <span className="size-3 rounded-full bg-[#ff5f57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.2)]" />
            <span className="size-3 rounded-full bg-[#febc2e] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.2)]" />
            <span className="size-3 rounded-full bg-[#28c840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.2)]" />
          </span>
          <span className="absolute inset-x-20 truncate text-center text-[12.5px] text-[#4d4d4d]">{inFolder ? "my-business" : "you"} — -zsh — 80×24</span>
        </div>
      )}
      <div
        className={`px-3 py-2.5 text-[13.5px] leading-[1.45] ${win ? "text-[#cccccc]" : "text-black"}`}
        style={{ fontFamily: win ? "'Cascadia Mono', Consolas, ui-monospace, monospace" : "'SF Mono', Menlo, ui-monospace, monospace" }}
      >
        {lines.map((l, i) => (
          <div key={i} className="[overflow-wrap:anywhere]">
            {l.cmd !== undefined ? (
              <p>
                {promptFor(os, Boolean(l.inFolder))} {l.cmd}
                {l.caret ? <span className={`ml-px inline-block h-[1.05em] w-[0.6em] translate-y-[2px] ${win ? "bg-[#cccccc]" : "bg-black/60"}`} /> : null}
              </p>
            ) : null}
            {l.out ? <p>{l.out}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────── a marked slot for a real screenshot still to be taken ───────────── */

export function Shot({ id, os = "mac", className = "", mark = false }: { id: string; os?: Os; className?: string; mark?: boolean }) {
  const s = SHOTS.find((x) => x.id === id);
  if (!s) return null;
  // Windows is text-only for now (owner, 2026-11-27): no Windows slots, one honest note near the top instead.
  if (os === "windows" && !mark) return null;
  const what = s.what[os];
  if (s.src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={s.src} alt={what} className={`block h-auto w-full ${className}`} loading="lazy" />;
  }
  if (mark) {
    return (
      <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-dashed border-[var(--accent)] text-[12px] text-[var(--accent)] ${className}`} title={`Slot: ${what}`}>
        logo
      </span>
    );
  }
  return (
    <div className={`flex flex-col justify-center rounded-xl border-[1.5px] border-dashed border-[var(--accent)] bg-[rgba(224,85,47,0.04)] p-4 ${className}`} role="img" aria-label={`Screenshot to come: ${what}`}>
      <p className="text-[13px] font-medium text-[var(--accent)]">Real {os === "windows" ? "Windows" : "Mac"} screenshot goes here</p>
      <p className="mt-1 text-[15px] leading-snug text-[var(--ink)]">{what}</p>
    </div>
  );
}

/* ───────────── hero: where you'll be in 30 minutes ───────────── */

// Real lines: `claude --version` and `ls` were run on 2026-11-27; their output is copied, not made up.
export function EndState({ os }: { os: Os }) {
  const c = commandsFor(os);
  return (
    <figure className="m-0">
      <Term
        os={os}
        lines={[
          { cmd: VERSION_CHECK, out: REAL_VERSION_LINE },
          { cmd: c.folder[1] },
          { cmd: os === "windows" ? "ls -Name" : "ls", out: PLAN_FILE, inFolder: true },
          { cmd: "", inFolder: true, caret: true },
        ]}
      />
      <figcaption className="pt-3 text-[15px] leading-relaxed text-[var(--muted)]">
        Your {c.shell} at the end: Claude Code installed, your workspace folder, and the plan Claude wrote for you. Real output; your version number
        will differ.
      </figcaption>
    </figure>
  );
}

/** Where you are: the six sections, each ticked when its checks are. Links jump to the section. */
export function Roadmap({ done, idsFor }: { done: string[]; idsFor: (id: string) => string[] }) {
  return (
    <ol className="grid gap-1">
      {LESSONS.map((l) => {
        const ids = idsFor(l.id);
        const ok = ids.length > 0 && ids.every((i) => done.includes(i));
        return (
          <li key={l.id}>
            <a href={`#${l.id}`} className="flex min-h-12 items-center gap-4 rounded-xl px-2 hover:bg-white">
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[14px] font-medium ${ok ? "bg-[var(--pass)] text-white" : "bg-white text-[var(--ink)] ring-1 ring-[var(--rule-strong)]"}`}
              >
                {ok ? (
                  <svg viewBox="0 0 20 20" className="size-4" aria-label="done">
                    <path d="M4.5 10.5 l3.5 3.5 l7.5 -8" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  l.n
                )}
              </span>
              <span className="text-[17px] text-[var(--ink)]">{l.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/* ───────────── S.1: the plan is the gate ───────────── */

export function PlanGate({ quote }: { quote: string }) {
  const [paid, setPaid] = useState(true);
  const reduce = useReducedMotion();
  return (
    <Plate caption={<>What it shows: with a Pro plan Claude Code is unlocked; with the free plan it isn&apos;t. Anthropic&apos;s words: &ldquo;{quote}&rdquo; Tap the plan to switch.</>}>
      <div className="grid items-center gap-6 p-5 sm:grid-cols-[1fr_auto_1fr] sm:p-8">
        <button type="button" onClick={() => setPaid((v) => !v)} aria-pressed={paid} className="gd-press min-h-[96px] rounded-2xl bg-white px-5 py-4 text-left ring-1 ring-[var(--rule)] hover:ring-[var(--ink)]">
          <span className="block text-[14px] text-[var(--muted)]">Your Claude plan</span>
          <motion.span key={String(paid)} className="mt-1 block text-[22px] font-semibold tracking-[-0.02em]" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
            {paid ? "Pro" : "Free"}
          </motion.span>
          <span className="mt-1 block text-[14px] text-[var(--accent)]">Tap to switch</span>
        </button>
        <svg viewBox="0 0 120 40" className="mx-auto hidden h-10 w-[120px] sm:block" aria-hidden="true">
          <line x1="4" y1="20" x2="116" y2="20" stroke={paid ? "#e0552f" : "#c4c7c2"} strokeWidth="1.6" strokeDasharray={paid ? "0" : "4 5"} style={{ transition: "stroke .3s" }} />
          {paid && !reduce ? <motion.circle r="4" cy="20" fill="#e0552f" initial={{ cx: 4 }} animate={{ cx: [4, 116] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} /> : null}
        </svg>
        <svg viewBox="0 0 40 44" className="mx-auto -my-3 h-11 w-10 sm:hidden" aria-hidden="true">
          <line x1="20" y1="2" x2="20" y2="42" stroke={paid ? "#e0552f" : "#c4c7c2"} strokeWidth="1.6" strokeDasharray={paid ? "0" : "4 5"} style={{ transition: "stroke .3s" }} />
          {paid && !reduce ? <motion.circle r="4" cx="20" fill="#e0552f" initial={{ cy: 2 }} animate={{ cy: [2, 42] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }} /> : null}
        </svg>
        <div className="flex items-center gap-4 rounded-2xl bg-white px-5 py-4 ring-1 ring-[var(--rule)]">
          <Shot id="claude-logo" mark />
          <div className="min-w-0">
            <p className="text-[17px] font-semibold text-[var(--ink)]">Claude Code</p>
            <p className={`text-[15px] ${paid ? "text-[var(--pass)]" : "text-[var(--accent)]"}`}>{paid ? "Included" : "Not included"}</p>
          </div>
          <svg viewBox="0 0 60 72" className="ml-auto h-[44px] w-[36px] shrink-0" aria-hidden="true">
            <motion.path d="M14 34 V20 a16 16 0 0 1 32 0 V34" fill="none" stroke="#15171a" strokeWidth="5" strokeLinecap="round" initial={false} animate={{ y: paid ? -9 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 14 }} />
            <rect x="4" y="32" width="52" height="38" rx="6" fill="#15171a" />
          </svg>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── S.2: two doors, one room ───────────── */

const DOORS = {
  app: { name: "Desktop app", looks: "A normal app with a window", good: "Starting today with zero setup", catch: "Some lessons here use terminal commands" },
  terminal: { name: "Terminal", looks: "A plain window you type into", good: "Everything in Modules 1 to 6", catch: "Looks scary for about ten minutes" },
} as const;

export function Doors({ os }: { os: Os }) {
  const [door, setDoor] = useState<keyof typeof DOORS>("terminal");
  const d = DOORS[door];
  return (
    <Plate caption="What it shows: two official ways in, the app and the terminal, leading to the same Claude Code. Tap one to compare.">
      <div className="p-4 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-2">
          {(["app", "terminal"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setDoor(k)}
              aria-pressed={door === k}
              className="gd-press flex flex-col gap-3 rounded-2xl bg-white p-3 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-2 aria-pressed:ring-[var(--accent)]"
            >
              <span className="flex min-h-11 items-center justify-between gap-3 px-1">
                <span className="text-[17px] font-semibold text-[var(--ink)]">{DOORS[k].name}</span>
                {k === "terminal" ? <span className="text-[14px] text-[var(--accent)]">My advice</span> : null}
              </span>
              {k === "app" ? (
                <Shot id="desktop-app" os={os} className="aspect-[16/10] w-full" />
              ) : (
                <Term os={os} className="aspect-[16/10] w-full" lines={[{ cmd: "claude", caret: true }]} />
              )}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-[var(--rule)]">
          <Shot id="claude-logo" mark />
          <p className="text-[16px] text-[var(--ink)]">
            Both open the <strong>same Claude Code</strong>.
          </p>
        </div>
        <motion.dl key={door} className="mt-5 divide-y divide-[var(--rule)] border-y border-[var(--rule)]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
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

export function InstallTerminal({ os }: { os: Os }) {
  const { ref, p, replay } = usePlay<HTMLDivElement>(6400);
  const c = commandsFor(os);
  const typed = (text: string, a: number, b: number) => text.slice(0, Math.round(text.length * span(p, a, b)));
  const second = p > 0.42;
  return (
    <Plate
      caption={
        <>
          What it shows: the install line typed into a new window, then a fresh window checking it worked. The version line is real output
          from my Mac on Nov 27, 2026; your number will be different. What matters is <code className="gd-code">(Claude Code)</code> at the end.
        </>
      }
    >
      <div ref={ref} className="grid gap-4 p-4 sm:p-6">
        <div className="flex justify-end">
          <Replay onClick={replay} />
        </div>
        <Term os={os} lines={[{ cmd: typed(c.install, 0.03, 0.3), caret: p < 0.33 }]} />
        <motion.p className="text-center text-[15px] text-[var(--muted)]" initial={false} animate={{ opacity: p > 0.33 ? 1 : 0 }}>
          The installer prints its progress and finishes. Close the window and open a new one.
        </motion.p>
        <motion.div initial={false} animate={{ opacity: second ? 1 : 0, y: second ? 0 : 10 }} transition={SPRING}>
          <Term
            os={os}
            lines={[
              { cmd: typed(VERSION_CHECK, 0.48, 0.62), out: p > 0.68 ? REAL_VERSION_LINE : undefined },
              ...(p > 0.72 ? [{ cmd: "", caret: true }] : []),
            ]}
          />
        </motion.div>
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
    <Plate caption="What it shows: the folder you start Claude Code in is the only place it can read and change. Start it in one folder, not in your whole home folder.">
      <div className="p-5 sm:p-8">
        <div className="grid grid-cols-2 gap-3">
          {[false, true].map((w) => (
            <button
              key={String(w)}
              type="button"
              onClick={() => setWide(w)}
              aria-pressed={wide === w}
              className="gd-press min-h-11 rounded-full px-3 text-[15px] text-[var(--soft)] ring-1 ring-[var(--rule)] aria-pressed:bg-[var(--ink)] aria-pressed:text-white aria-pressed:ring-[var(--ink)]"
            >
              {w ? "Start in your home folder" : "Start in my-business"}
            </button>
          ))}
        </div>
        <div className="relative mt-6 rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)] sm:p-6">
          <p className="text-[15px] text-[var(--muted)]">
            Your home folder <span className="font-mono">({home})</span>
          </p>
          <div className="relative mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
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
                  <motion.span className="relative max-w-full truncate text-center text-[13px] text-[var(--ink)]" initial={false} animate={{ opacity: inside ? 1 : 0.45 }} transition={SPRING}>
                    {name}
                  </motion.span>
                </div>
              );
            })}
          </div>
          <motion.p key={String(wide)} className={`mt-5 text-[16px] leading-relaxed ${wide ? "text-[var(--accent)]" : "text-[var(--ink)]"}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
            {wide
              ? "Everything in your home folder is now within reach: documents, downloads, photos."
              : `Only ${home}${sep}my-business is within reach. The rest of your computer stays out of it.`}
          </motion.p>
        </div>
      </div>
    </Plate>
  );
}

function Reach() {
  return <motion.span layoutId="gd-reach" className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-[rgba(224,85,47,0.07)] ring-[1.5px] ring-[var(--accent)]" transition={SPRING} aria-hidden="true" />;
}

/* ───────────── Section 5: the payoff, your plan (real output only) ───────────── */

// The outline is what the prompt asks for, not a made-up answer. The slot is for a real, unedited plan from Shogo's
// own run; until he takes it, nothing pretends to be Claude's output.
export function PlanPayoff({ os }: { os: Os }) {
  return (
    <figure className="my-12 overflow-hidden rounded-[22px] bg-[var(--panel)] text-white">
      <div className="grid gap-6 p-5 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start">
        <div>
          <p className="text-[15px] text-white/60">What you&apos;ll have</p>
          <p className="mt-2 font-mono text-[20px] text-white">{PLAN_FILE}</p>
          <ol className="mt-6 grid gap-4">
            {PLAN_OUTLINE.map((part, i) => (
              <li key={part} className="flex gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[15px] text-white">{i + 1}</span>
                <span className="pt-1 text-[18px] leading-snug text-white">{part}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-[16px] leading-relaxed text-white/70">
            Written from your answers, about your idea. Not a template: if you change an answer, you get a different plan.
          </p>
        </div>
        {os === "mac" ? (
          <div className="rounded-xl bg-white p-2">
            <Shot id="plan-output" os={os} className="aspect-[4/5] w-full" />
          </div>
        ) : null}
      </div>
      <figcaption className="px-5 pb-6 text-[15px] leading-relaxed text-white/60 sm:px-8">
        What it shows: the three parts your plan will have, and next to them a real plan from my own run, unedited. Yours will be about your
        business.
      </figcaption>
    </figure>
  );
}

/* ───────────── S.6: who approves what ───────────── */

const LANES = [
  { k: "runs", label: "An everyday step", out: "Goes ahead on its own" },
  { k: "blocked", label: "A step that looks risky", out: "Stopped" },
  { k: "asks", label: "Some steps", out: "Comes to you as a question" },
] as const;

export function ApprovalLanes() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(2);
  return (
    <Plate caption="What it shows: in auto mode a second AI model looks at each step Claude wants to take. Most go ahead, risky ones are stopped, and some come to you. Tap a row.">
      <div className="grid gap-5 p-5 sm:grid-cols-[170px_1fr] sm:items-center sm:p-8">
        <div className="rounded-2xl bg-[var(--panel)] px-4 py-5 text-center text-white">
          <p className="text-[16px] font-semibold">A second AI model</p>
          <p className="mt-1 text-[14px] text-white/65">checks each step</p>
        </div>
        <ul className="grid gap-2.5">
          {LANES.map((l, k) => {
            const on = i === k;
            return (
              <li key={l.k}>
                <button type="button" onClick={() => setI(k)} aria-pressed={on} className="gd-press relative flex min-h-[56px] w-full items-center gap-3 overflow-hidden rounded-xl bg-white px-4 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-[var(--ink)]">
                  {on && !reduce ? (
                    <motion.span key={`dot-${k}`} className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-[var(--accent)]" initial={{ x: 0, opacity: 0 }} animate={{ x: [0, 40], opacity: [0, 1, 0] }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
                  ) : null}
                  <span className="flex min-w-0 flex-1 flex-col py-2.5 sm:flex-row sm:items-center sm:gap-3">
                    <span className="text-[15px] text-[var(--muted)] sm:w-[170px] sm:shrink-0">{l.label}</span>
                    <span className={`text-[16px] leading-snug ${on ? "font-semibold text-[var(--ink)]" : "text-[var(--soft)]"}`}>{l.out}</span>
                  </span>
                  {l.k === "asks" ? <span className="shrink-0 text-[14px] text-[var(--accent)]">you</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Plate>
  );
}

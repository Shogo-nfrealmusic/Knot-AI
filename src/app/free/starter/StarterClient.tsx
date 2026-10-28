"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, useScroll, useSpring } from "motion/react";
import { BLOCKS, CARRIAGE_TOP, DIAL, PER_TURN, SPEC, STEP, BLOCK_W, TIP_R, STOPS, carriageAt, needleAt, plungerAt } from "./figure";

export type StarterFile = { path: string; role: string; body: string };

const ZIP = "/free/starter/copilot-os-starter-v1.zip";
const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

/* ───────────── page ───────────── */

export function StarterClient({ files, figure }: { files: StarterFile[]; figure: string }) {
  return (
    <div className="starter relative overflow-x-clip pt-24 text-[var(--ink)] sm:pt-28">
      <style>{STARTER_CSS}</style>
      <Hero figure={figure} files={files} />
      <Files files={files} />
      <Setup />
      <Rules />
      <Quiz />
      <Next />
    </div>
  );
}

/* ───────────── hero ───────────── */

const HEADLINE = ["Your", "Claude", "Code", "setup", "is", "ready."];

function Hero({ figure, files }: { figure: string; files: StarterFile[] }) {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-10">
      <div>
        <motion.p
          className="inline-flex items-center gap-2 text-[14px] text-[var(--muted)]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--pass)] opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--pass)]" />
          </span>
          Email confirmed
        </motion.p>
        <h1 className="mt-5 text-[44px] font-semibold leading-[0.98] tracking-[-0.045em] sm:text-[64px]">
          {HEADLINE.map((word, index) => (
            <motion.span
              key={word + index}
              className="mr-[0.22em] inline-block"
              initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ ...SPRING, delay: 0.08 + index * 0.07 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.6 }}
        >
          <p className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-[var(--soft)]">
            Five files, fifteen minutes. The same setup my co-founder and I run our business on, cut down to the part that
            makes the biggest difference.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={ZIP} download className="press inline-flex h-12 items-center gap-3 rounded-full bg-[var(--ink)] pl-5 pr-2 text-[15px] font-medium text-white">
              Download the starter
              <span className="rounded-full bg-white/12 px-2.5 py-1 font-mono text-[12px] text-white/75">.zip · {files.length} files</span>
            </a>
            <a href="#files" className="press inline-flex h-12 items-center rounded-full px-5 text-[15px] font-medium text-[var(--ink)] ring-1 ring-[var(--rule)] hover:bg-white">
              Read the files here
            </a>
          </div>
          <p className="mt-5 max-w-[42ch] text-[13.5px] leading-relaxed text-[var(--muted)]">
            On your phone? Read everything on this page now, then open the same link on your computer to install. It&apos;s
            also in your confirmation email.
          </p>
        </motion.div>
      </div>
      <motion.div initial={reduce ? false : { opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...SPRING, delay: 0.3 }}>
        <VerifierFigure figure={figure} />
      </motion.div>
    </section>
  );
}

/* ───────────── fig 1: the verifier rig ───────────── */

function VerifierFigure({ figure }: { figure: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const [reading, setReading] = useState({ index: 0, value: BLOCKS[0], verdict: "pass" as "pass" | "fail" | "moving" });

  useEffect(() => {
    const host = stage.current;
    if (!host) return;
    const svg = host.querySelector("svg");
    const carriage = svg?.querySelector('[data-part="carriage"]');
    const plunger = svg?.querySelector('[data-part="plunger"]');
    const needle = svg?.querySelector('[data-part="needle"]');
    if (!svg || !carriage || !plunger || !needle) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const heightUnder = (cx: number) => {
      let top = CARRIAGE_TOP;
      BLOCKS.forEach((height, index) => {
        const from = cx - 24 + STEP * index;
        if (from + BLOCK_W > DIAL[0] - TIP_R && from < DIAL[0] + TIP_R) top = Math.max(top, CARRIAGE_TOP + height);
      });
      return top;
    };
    const blockUnder = (cx: number) => BLOCKS.findIndex((_, index) => {
      const from = cx - 24 + STEP * index;
      return DIAL[0] >= from && DIAL[0] <= from + BLOCK_W;
    });
    let x = STOPS[0];
    let target = x;
    const tip = { at: CARRIAGE_TOP + BLOCKS[0], rate: 0 };
    let frame = 0;
    let last = 0;
    let clock = 0;
    let visible = false;
    let touring = !still.matches;
    let idle = 0;
    // Dwell on each block, then move to the next: 1 → 2 → 3 → back to 1.
    const tourAt = (t: number) => STOPS[Math.floor(t / 2.6) % STOPS.length];
    let shown = "";
    const draw = () => {
      carriage.setAttribute("transform", carriageAt(x));
      plunger.setAttribute("transform", plungerAt(tip.at));
      needle.setAttribute("d", needleAt((tip.at - CARRIAGE_TOP) / PER_TURN));
      const index = blockUnder(x);
      const settled = Math.abs(tip.rate) < 0.4 && Math.abs(target - x) < 0.5;
      const value = tip.at - CARRIAGE_TOP;
      const verdict = index < 0 || !settled ? "moving" : Math.abs(value - SPEC[index]) < 0.25 ? "pass" : "fail";
      host.dataset.verdict = verdict;
      const key = `${index}|${value.toFixed(1)}|${verdict}`;
      if (key !== shown) {
        shown = key;
        setReading({ index, value, verdict });
      }
    };
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      if (touring) {
        clock += dt;
        target = tourAt(clock);
      }
      x = still.matches ? target : x + (target - x) * (1 - Math.exp(-dt / 0.3));
      if (Math.abs(target - x) < 0.01) x = target;
      const want = heightUnder(x);
      const drag = still.matches ? 2 * Math.sqrt(420) : 26;
      for (let i = 0; i < 4; i++) {
        tip.rate += (((want - tip.at) * 420 - tip.rate * drag) * dt) / 4;
        tip.at += (tip.rate * dt) / 4;
      }
      if (Math.abs(want - tip.at) < 0.005 && Math.abs(tip.rate) < 0.005) {
        tip.at = want;
        tip.rate = 0;
      }
      draw();
      const rest = !touring && x === target && tip.rate === 0;
      frame = visible && !rest ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (!frame && visible) {
        last = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const steer = (next: number) => {
      touring = false;
      target = next;
      clearTimeout(idle);
      idle = window.setTimeout(() => {
        touring = !still.matches;
        clock = 0;
        run();
      }, 4000);
      run();
    };
    const seen = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) run();
    }, { rootMargin: "120px 0px" });
    seen.observe(host);
    const onMove = (event: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const share = Math.min(1, Math.max(0, ((event.clientX - box.left) / box.width - 0.3) / 0.45));
      steer(STOPS[0] + share * (STOPS[STOPS.length - 1] - STOPS[0]));
    };
    const onKey = (event: KeyboardEvent) => {
      const here = STOPS.reduce((best, stop, index) => (Math.abs(stop - target) < Math.abs(STOPS[best] - target) ? index : best), 0);
      let to: number | null = null;
      if (event.key === "ArrowRight") to = Math.min(STOPS.length - 1, here + 1);
      if (event.key === "ArrowLeft") to = Math.max(0, here - 1);
      if (to === null) return;
      event.preventDefault();
      steer(STOPS[to]);
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("keydown", onKey);
    draw();
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(idle);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("keydown", onKey);
    };
  }, []);

  const label =
    reading.index < 0 || reading.verdict === "moving"
      ? "measuring…"
      : `check ${reading.index + 1} · reads ${reading.value.toFixed(1)} · spec ${SPEC[reading.index]} · ${reading.verdict === "pass" ? "pass" : "fail, sent back"}`;

  return (
    <figure className="iso m-0" data-theme="light">
      <div className="iso-plate starter-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">Fig 1</span>
          <span className="iso-plate-corner" data-corner="title">The verifier</span>
          <span className="iso-plate-corner" data-corner="hint">Hover to move the work</span>
          <span className="iso-plate-corner starter-readout" data-corner="readout" data-verdict={reading.verdict}>{label}</span>
        </div>
        <div
          ref={stage}
          className="starter-stage outline-none"
          tabIndex={0}
          role="img"
          aria-label="A verifier rig. Arrow keys move the carriage from block to block."
          dangerouslySetInnerHTML={{ __html: figure }}
        />
      </div>
      <figcaption className="iso-legend">
        <span className="iso-caption">
          Claude&apos;s work slides under a gauge it doesn&apos;t control. The card at the front is your CLAUDE.md: 18, 14 and 12.
          The third piece reads 10, so the lamp turns and it goes back. That is rule two of the starter.
        </span>
      </figcaption>
    </figure>
  );
}

/* ───────────── what's inside ───────────── */

function Files({ files }: { files: StarterFile[] }) {
  const [open, setOpen] = useState(0);
  const file = files[open];
  const lines = useMemo(() => file.body.replace(/\n+$/, "").split("\n"), [file]);
  const [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(file.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the text is still selectable */
    }
  };
  return (
    <section id="files" className="scroll-mt-24 border-y border-[var(--rule)] bg-white/70 py-20 backdrop-blur-[2px]">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead title="What's in the box" text="Every file, exactly as it ships. Pick one to read it." />
        <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-2xl bg-[var(--panel)] text-white shadow-[0_40px_90px_-40px_rgba(15,17,20,0.55)] ring-1 ring-black/5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <nav className="flex gap-1 overflow-x-auto border-b border-white/10 p-3 lg:flex-col lg:border-b-0 lg:border-r lg:p-4" aria-label="Files">
            <p className="hidden px-3 pb-3 pt-1 font-mono text-[12px] text-white/40 lg:block">copilot-os-starter/</p>
            {files.map((item, index) => (
              <button
                key={item.path}
                type="button"
                onClick={() => setOpen(index)}
                className="press relative shrink-0 rounded-lg px-3 py-2.5 text-left lg:pl-6"
                aria-current={open === index}
              >
                {open === index ? (
                  <motion.span layoutId="file-active" className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/10" transition={SPRING} />
                ) : null}
                <span className="relative block font-mono text-[13px] text-white">{item.path}</span>
                <span className="relative mt-1 hidden text-[12.5px] leading-snug text-white/50 lg:block">{item.role}</span>
              </button>
            ))}
          </nav>
          <div className="min-w-0">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
              <p className="font-mono text-[12.5px] text-white/60">
                {file.path} <span className="text-white/30">· {lines.length} lines</span>
              </p>
              <button type="button" onClick={copy} className="press rounded-md px-2.5 py-1 font-mono text-[12px] text-white/70 ring-1 ring-white/15 hover:text-white">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="starter-code h-[520px] overflow-auto py-4 font-mono text-[12.5px] leading-[1.75]">
              <motion.div key={file.path} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
                {lines.map((line, index) => (
                  <div key={index} className="flex">
                    <span className="w-12 shrink-0 select-none pr-4 text-right text-white/20">{index + 1}</span>
                    <span className={`whitespace-pre-wrap break-words pr-5 ${toneOf(line)}`}>{line || " "}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Light markdown tinting: headings, list markers, tables, quotes and fences each get one tone.
function toneOf(line: string) {
  if (/^#{1,6} /.test(line)) return "text-white font-semibold";
  if (/^```/.test(line)) return "text-white/35";
  if (/^\s*[-*] |^\s*\d+\. /.test(line)) return "text-white/85";
  if (/^\|/.test(line)) return "text-[#9cc9ff]";
  if (/^>/.test(line)) return "text-white/45";
  if (/^---$/.test(line)) return "text-white/20";
  return "text-white/75";
}

/* ───────────── 15-minute setup ───────────── */

const STEPS = [
  { at: "0:00", title: "Read every file first", text: "Never install an AI setup you haven't read, this one included. Nothing in it downloads anything or sends data anywhere." },
  { at: "2:00", title: "Make a folder for your notes", text: "An Obsidian vault works well. Copy CLAUDE.md into it." },
  { at: "3:00", title: "Let Claude interview you", text: "Open Claude Code in that folder and paste the prompt from prompts/interview.md. Answer one question at a time. Leave what you don't know as TBD.", code: "Help me write the CLAUDE.md for my second brain…" },
  { at: "12:00", title: "Test it in a fresh session", text: "Ask the question below. If the answer is wrong, fix the file, not the chat.", code: "What's my priority this month, and what should you push back on?" },
  { at: "13:00", title: "Add the verifier", text: "Copy agents/verifier.md to ~/.claude/agents/. Next time Claude says done on something that matters, ask it to have the verifier check.", code: "cp agents/verifier.md ~/.claude/agents/" },
  { at: "15:00", title: "Take the diagnostic", text: "Twenty questions. Your lowest part is where to spend your next hour." },
];

function Setup() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const grow = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-24 sm:px-8">
      <SectionHead title="Set it up in fifteen minutes" text="Six steps. The timestamps are where you should be." />
      <ol ref={ref} className="relative mt-14 max-w-[760px] pl-[92px] sm:pl-[120px]">
        <span className="absolute bottom-3 left-[60px] top-3 w-px bg-[var(--rule)] sm:left-[84px]" aria-hidden="true" />
        <motion.span style={{ scaleY: grow }} className="absolute bottom-3 left-[60px] top-3 w-px origin-top bg-[var(--accent)] sm:left-[84px]" aria-hidden="true" />
        {STEPS.map((step) => (
          <Step key={step.at} step={step} />
        ))}
      </ol>
    </section>
  );
}

function Step({ step }: { step: (typeof STEPS)[number] }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  return (
    <li ref={ref} className="relative pb-12 last:pb-0">
      <span className="absolute -left-[92px] top-0.5 w-[48px] text-right font-mono text-[13px] tabular-nums text-[var(--muted)] sm:-left-[120px] sm:w-[64px]">{step.at}</span>
      <motion.span
        className="absolute -left-[36.5px] top-[7px] size-[9px] rounded-full ring-4 ring-[var(--page)] sm:-left-[40.5px]"
        animate={{ backgroundColor: seen ? "var(--accent)" : "var(--rule)" }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
      />
      <motion.div initial={reduce ? false : { opacity: 0, x: 14 }} animate={seen ? { opacity: 1, x: 0 } : undefined} transition={SPRING}>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{step.title}</h3>
        <p className="mt-2 max-w-[56ch] text-[15.5px] leading-relaxed text-[var(--soft)]">{step.text}</p>
        {step.code ? (
          <p className="mt-3 inline-block max-w-full overflow-x-auto rounded-lg bg-[var(--panel)] px-3.5 py-2 font-mono text-[12.5px] text-white/85">{step.code}</p>
        ) : null}
      </motion.div>
    </li>
  );
}

/* ───────────── three rules ───────────── */

function Rules() {
  return (
    <section className="border-y border-[var(--rule)] bg-white/70 py-24">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <SectionHead title="Three rules that do most of the work" text="Each one is a file or a habit in the starter. None of them is a clever prompt." />
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          <Rule n="1" title="Words ask, settings enforce" text="A line in CLAUDE.md is advice Claude can ignore. Anything that must never happen belongs in permissions and hooks.">
            <LockArt />
          </Rule>
          <Rule n="2" title="The agent that did the work doesn't grade it" text="A fresh session or a verifier catches what the first one talked itself into.">
            <GraderArt />
          </Rule>
          <Rule n="3" title="Same mistake twice, one line in the file" text="Fix CLAUDE.md once instead of correcting the chat forever. Prune it when it gets long.">
            <LedgerArt />
          </Rule>
        </div>
      </div>
    </section>
  );
}

function Rule({ n, title, text, children }: { n: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl bg-[var(--page)] p-6 ring-1 ring-[var(--rule)]">
      <div className="flex h-[150px] items-center justify-center rounded-xl bg-white ring-1 ring-[var(--rule)]">{children}</div>
      <p className="mt-6 font-mono text-[12.5px] text-[var(--accent)]">Rule {n}</p>
      <h3 className="mt-2 text-[19px] font-semibold leading-snug tracking-[-0.02em]">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--soft)]">{text}</p>
    </article>
  );
}

// Rule 1: a note that says "please don't" next to a shackle that actually closes.
function LockArt() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const shut = reduce || seen;
  return (
    <svg ref={ref} viewBox="0 0 220 120" className="h-[120px] w-auto" aria-hidden="true">
      <g transform="translate(18 26)">
        <rect width="78" height="68" rx="4" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
        <rect x="10" y="12" width="40" height="4" rx="2" fill="var(--rule)" />
        <text x="10" y="34" className="font-mono" fontSize="9" fill="var(--soft)">please don&apos;t</text>
        <text x="10" y="46" className="font-mono" fontSize="9" fill="var(--soft)">push to main</text>
        <rect x="10" y="54" width="28" height="4" rx="2" fill="var(--rule)" />
      </g>
      <g transform="translate(132 30)">
        <motion.path
          d="M14 34 V20 a16 16 0 0 1 32 0 V34"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="5"
          strokeLinecap="round"
          initial={false}
          animate={{ y: shut ? 0 : -10 }}
          transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.25 }}
        />
        <rect x="4" y="32" width="52" height="40" rx="6" fill="var(--ink)" />
        <motion.circle cx="30" cy="50" r="4" initial={false} animate={{ fill: shut ? "var(--accent)" : "#fff" }} transition={{ delay: 0.45 }} />
        <rect x="28.5" y="52" width="3" height="9" rx="1.5" fill="#fff" />
      </g>
    </svg>
  );
}

// Rule 2: the worker hands its output to a separate checker, which returns the verdict.
function GraderArt() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { amount: 0.6 });
  const reduce = useReducedMotion();
  return (
    <svg ref={ref} viewBox="0 0 220 120" className="h-[120px] w-auto" aria-hidden="true">
      <line x1="66" y1="60" x2="154" y2="60" stroke="var(--rule)" strokeWidth="1.5" strokeDasharray="3 4" />
      <g>
        <rect x="18" y="34" width="48" height="52" rx="10" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
        <text x="42" y="64" textAnchor="middle" className="font-mono" fontSize="9" fill="var(--ink)">worker</text>
      </g>
      <g>
        <rect x="154" y="34" width="48" height="52" rx="10" fill="var(--ink)" />
        <text x="178" y="64" textAnchor="middle" className="font-mono" fontSize="9" fill="#fff">verifier</text>
      </g>
      {reduce ? (
        <rect x="104" y="53" width="14" height="14" rx="3" fill="var(--accent)" />
      ) : (
        <motion.rect
          width="14"
          height="14"
          rx="3"
          y="53"
          fill="var(--accent)"
          animate={seen ? { x: [70, 136, 136, 70], opacity: [0, 1, 1, 0] } : { x: 70, opacity: 0 }}
          transition={{ duration: 2.6, times: [0, 0.45, 0.8, 1], repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <motion.path
        d="M171 100 l5 5 l10 -11"
        fill="none"
        stroke="var(--pass)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={seen && !reduce ? { pathLength: [0, 0, 1, 1, 0] } : { pathLength: 1 }}
        transition={{ duration: 2.6, times: [0, 0.45, 0.6, 0.9, 1], repeat: reduce ? 0 : Infinity }}
      />
    </svg>
  );
}

// Rule 3: the mistake counter reaches 2 and one dated line is written into CLAUDE.md.
function LedgerArt() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? 2 : 0);
  useEffect(() => {
    if (!seen || reduce) return;
    const a = setTimeout(() => setCount(1), 300);
    const b = setTimeout(() => setCount(2), 1100);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [seen, reduce]);
  return (
    <svg ref={ref} viewBox="0 0 220 120" className="h-[120px] w-auto" aria-hidden="true">
      <g transform="translate(20 34)">
        <rect width="54" height="52" rx="8" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
        <text x="27" y="22" textAnchor="middle" className="font-mono" fontSize="8.5" fill="var(--muted)">same slip</text>
        <motion.text key={count} x="27" y="42" textAnchor="middle" className="font-mono" fontSize="16" fontWeight="600" fill={count >= 2 ? "var(--accent)" : "var(--ink)"} initial={reduce ? false : { y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
          ×{count}
        </motion.text>
      </g>
      <g transform="translate(96 18)">
        <rect width="106" height="86" rx="6" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
        <text x="10" y="16" className="font-mono" fontSize="8.5" fill="var(--ink)">CLAUDE.md</text>
        <rect x="10" y="26" width="76" height="4" rx="2" fill="var(--rule)" />
        <rect x="10" y="36" width="58" height="4" rx="2" fill="var(--rule)" />
        <rect x="10" y="46" width="68" height="4" rx="2" fill="var(--rule)" />
        <motion.rect
          x="10"
          y="60"
          height="5"
          rx="2.5"
          fill="var(--accent)"
          initial={false}
          animate={{ width: count >= 2 ? 84 : 0 }}
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1], delay: 0.15 }}
        />
        <motion.text x="10" y="78" className="font-mono" fontSize="7.5" fill="var(--accent)" initial={false} animate={{ opacity: count >= 2 ? 1 : 0 }} transition={{ delay: 0.7 }}>
          + never edit /prod
        </motion.text>
      </g>
    </svg>
  );
}

/* ───────────── one diagnostic question ───────────── */

const QUESTION = {
  q: 'Your CLAUDE.md says "Never edit files in /prod." Claude edited one anyway. What\'s the correct conclusion?',
  options: [
    "The model is broken. Report a bug",
    "Write the rule in capital letters",
    "CLAUDE.md is advisory context. A rule that must hold needs a hook or a deny rule",
    "Move the rule to the top of the file",
  ],
  answer: 2,
  why: 'Anthropic\'s docs: "Claude treats CLAUDE.md files as context, not enforced configuration." Rule 1, in practice.',
};

function Quiz() {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-24 sm:px-8">
      <SectionHead title="Try one from the diagnostic" text="Question 5 of 20. The other nineteen are in diagnostic.md." />
      <div className="mt-10 max-w-[760px] rounded-2xl bg-white p-6 ring-1 ring-[var(--rule)] sm:p-8">
        <p className="text-[18px] font-medium leading-snug tracking-[-0.01em]">{QUESTION.q}</p>
        <div className="mt-6 grid gap-2.5">
          {QUESTION.options.map((option, index) => {
            const state = picked === null ? "idle" : index === QUESTION.answer ? "right" : index === picked ? "wrong" : "dim";
            return (
              <motion.button
                key={option}
                type="button"
                disabled={picked !== null}
                onClick={() => setPicked(index)}
                className="press flex items-start gap-3 rounded-xl px-4 py-3.5 text-left text-[15px] leading-snug ring-1"
                animate={{
                  backgroundColor: state === "right" ? "rgba(46,158,106,0.10)" : state === "wrong" ? "rgba(224,85,47,0.10)" : "rgba(255,255,255,1)",
                  opacity: state === "dim" ? 0.45 : 1,
                }}
                style={{ ["--tw-ring-color" as string]: state === "right" ? "var(--pass)" : state === "wrong" ? "var(--accent)" : "var(--rule)" }}
                transition={{ duration: 0.25 }}
              >
                <span className="mt-px font-mono text-[13px] text-[var(--muted)]">{"ABCD"[index]}</span>
                <span>{option}</span>
              </motion.button>
            );
          })}
        </div>
        <motion.div initial={false} animate={{ height: picked === null ? 0 : "auto", opacity: picked === null ? 0 : 1 }} className="overflow-hidden" transition={SPRING}>
          <p className="pt-5 text-[15px] leading-relaxed text-[var(--soft)]">
            <span className="font-medium text-[var(--ink)]">{picked === QUESTION.answer ? "Right." : "It's C."}</span> {QUESTION.why}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────── what comes next ───────────── */

const FULL = [
  "Verification design: checks Claude runs itself, and reviewers that don't over-engineer",
  "Unattended runs: scheduled jobs, parallel sessions, costs, and where each one breaks",
  "Security: a tested guard hook, the sandbox's blind spots, auditing third-party skills",
  "Work beyond code: research, numbers, bookkeeping and content, from our real setup",
];

function Next() {
  return (
    <section className="bg-[var(--panel)] py-24 text-white">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <h2 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[42px]">The starter is memory and a first check. The full Copilot OS is the rest.</h2>
          <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-white/65">
            It covers what free courses don&apos;t, with every file we use. You&apos;re on the list, so you&apos;ll hear about it first, by email.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={ZIP} download className="press inline-flex h-11 items-center rounded-full bg-white px-5 text-[14.5px] font-medium text-[var(--ink)]">
              Download the starter
            </a>
            <Link href="/free" className="press inline-flex h-11 items-center rounded-full px-5 text-[14.5px] font-medium text-white ring-1 ring-white/20">
              More from the reels
            </Link>
          </div>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-2xl bg-white/10">
          {FULL.map((item) => (
            <li key={item} className="bg-[var(--panel)] px-6 py-5 text-[15px] leading-relaxed text-white/80">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SectionHead({ title, text }: { title: string; text: string }) {
  return (
    <div className="max-w-[640px]">
      <h2 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[40px]">{title}</h2>
      <p className="mt-3 text-[16px] leading-relaxed text-[var(--soft)]">{text}</p>
    </div>
  );
}

const STARTER_CSS = `
.starter{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--panel:#14161a;--accent:#e0552f;--pass:#2e9e6a;
  background-color:var(--page);
  background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);
  background-size:28px 28px}
.starter .press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),background-color .2s}
.starter .press:active{transform:scale(.96)}
.starter-plate{--anatomy-card:#fbfbfa;border-radius:18px;padding:44px 8px 52px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -40px rgba(21,23,26,.45)}
.starter-stage:focus-visible{outline:2px solid var(--accent);outline-offset:6px;border-radius:8px}
.starter-stage [data-part="lamp"] .iso-top,.starter-stage [data-part="lamp"] .iso-fill{transition:fill .35s ease}
.starter-stage[data-verdict="pass"] [data-part="lamp"] .iso-top{fill:#43c48a}
.starter-stage[data-verdict="pass"] [data-part="lamp"] .iso-fill,.starter-stage[data-verdict="pass"] [data-part="lamp"] .iso-shade{fill:#2e9e6a}
.starter-stage[data-verdict="fail"] [data-part="lamp"] .iso-top{fill:#f07a57}
.starter-stage[data-verdict="fail"] [data-part="lamp"] .iso-fill,.starter-stage[data-verdict="fail"] [data-part="lamp"] .iso-shade{fill:#e0552f}
.starter-readout[data-verdict="pass"]{color:var(--pass)!important}
.starter-readout[data-verdict="fail"]{color:var(--accent)!important}
.starter-code::-webkit-scrollbar{width:10px;height:10px}
.starter-code::-webkit-scrollbar-thumb{background:rgba(255,255,255,.12);border-radius:10px;border:3px solid transparent;background-clip:content-box}
@media (prefers-reduced-motion:reduce){.starter .animate-ping{animation:none}}
`;

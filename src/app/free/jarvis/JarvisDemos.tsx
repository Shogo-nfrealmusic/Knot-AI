"use client";

// /free/46 (Build your own Jarvis): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/starter: paper plate, ink lines, one orange accent, motion springs, nothing plays off screen.
// Material is real: the Jarvis voice line from the ElevenLabs agent, a real Claude Code run, the real Vault link graph
// (positions and top folders only, no note names), the real 6:30 brief of Oct 30, 2026.

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

export type JarvisDemoKind = "core" | "run" | "vault" | "voice" | "team" | "brief";

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

export function JarvisDemo({ kind }: { kind: JarvisDemoKind }) {
  return (
    <div className="jv mt-5 max-w-2xl">
      <style>{JV_CSS}</style>
      {kind === "core" && <Core />}
      {kind === "run" && <Run />}
      {kind === "vault" && <Vault />}
      {kind === "voice" && <Voice />}
      {kind === "team" && <Team />}
      {kind === "brief" && <Brief />}
    </div>
  );
}

/* ───────────── core: the hologram, as a line drawing, speaking with the real voice ───────────── */

// RMS of /free/46/jarvis.mp3, 60 values per second
const ENV = [0, 0, 0, 0, 0.004, 0.721, 1, 0.664, 0.53, 0.216, 0.167, 0.192, 0.387, 0.589, 0.474, 0.371, 0.475, 0.441, 0.468, 0.426, 0.418, 0.429, 0.469, 0.385, 0.444, 0.495, 0.392, 0.411, 0.438, 0.443, 0.326, 0.536, 0.459, 0.373, 0.338, 0.332, 0.186, 0.759, 0.403, 0.438, 0.462, 0.395, 0.479, 0.37, 0.428, 0.442, 0.429, 0.602, 0.576, 0.512, 0.383, 0.29, 0.207, 0.137, 0.341, 0.581, 0.734, 0.351, 0.338, 0.342, 0.334, 0.318, 0.319, 0.29, 0.31, 0.31, 0.396, 0.409, 0.467, 0.686, 0.511, 0.353, 0.347, 0.367, 0.401, 0.366, 0.436, 0.587, 0.567, 0.371, 0.442, 0.391, 0.47, 0.335, 0.226, 0.206, 0.486, 0.653, 0.352, 0.393, 0.25, 0.279, 0.33, 0.258, 0.131, 0.073, 0.036, 0.027, 0.017, 0.012, 0.011, 0.007, 0.006, 0.004, 0.002, 0.001, 0.001, 0];
// when each word is heard (seconds), measured against the envelope above
const WORDS: [string, number][] = [["Good", 0.08], ["morning,", 0.22], ["sir.", 0.6], ["Your", 0.92], ["brief", 1.08], ["is", 1.3], ["ready.", 1.4]];

function Core() {
  const audio = useRef<HTMLAudioElement>(null);
  const [t, setT] = useState(-1); // playback time, -1 = idle
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const play = () => {
    const a = audio.current;
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
    const tick = () => {
      setT(a.ended ? -1 : a.currentTime);
      if (!a.ended) raf.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  };
  const amp = t < 0 ? 0 : ENV[Math.min(ENV.length - 1, Math.floor(t * 60))] ?? 0;
  const C = 170;
  const bars = Array.from({ length: 56 }, (_, i) => {
    const a = (i / 56) * Math.PI * 2 - Math.PI / 2;
    const v = amp * (0.45 + 0.55 * Math.abs(Math.sin(i * 1.7 + (t < 0 ? 0 : t) * 9)));
    const r1 = 74, r2 = r1 + 6 + 34 * v;
    return <line key={i} x1={C + Math.cos(a) * r1} y1={C + Math.sin(a) * r1} x2={C + Math.cos(a) * r2} y2={C + Math.sin(a) * r2} stroke={v > 0.05 ? "var(--accent)" : "var(--rule-strong)"} strokeWidth={3} strokeLinecap="round" />;
  });
  const ticks = Array.from({ length: 96 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2, long = i % 8 === 0;
    return <line key={i} x1={C + Math.cos(a) * 150} y1={C + Math.sin(a) * 150} x2={C + Math.cos(a) * (long ? 140 : 145)} y2={C + Math.sin(a) * (long ? 140 : 145)} stroke="var(--ink)" strokeWidth={long ? 1.4 : 0.7} opacity={long ? 0.7 : 0.35} />;
  });
  return (
    <figure className="jv-plate grid items-center gap-6 p-6 sm:grid-cols-[340px_1fr] sm:p-8">
      <div className="relative mx-auto aspect-square w-full max-w-[340px]">
        <svg viewBox="0 0 340 340" className="absolute inset-0 size-full" aria-hidden="true">
          <circle cx={C} cy={C} r={160} fill="none" stroke="var(--ink)" strokeWidth={0.6} opacity={0.25} />
          {ticks}
          <g className="jv-spin" style={{ transformOrigin: `${C}px ${C}px` }}>
            <circle cx={C} cy={C} r={128} fill="none" stroke="var(--ink)" strokeWidth={6} strokeDasharray="90 22 30 60 140 40 20 402" opacity={0.85} />
          </g>
          <g className="jv-spin-rev" style={{ transformOrigin: `${C}px ${C}px` }}>
            <circle cx={C} cy={C} r={114} fill="none" stroke="var(--ink)" strokeWidth={1} strokeDasharray="2 6" opacity={0.5} />
            <circle cx={C} cy={C} r={104} fill="none" stroke="var(--accent)" strokeWidth={2.5} strokeDasharray="120 534" />
          </g>
          {bars}
          <circle cx={C} cy={C} r={62} fill="#fff" stroke="var(--ink)" strokeWidth={1.2} />
        </svg>
        <button type="button" onClick={play} className="jv-press absolute left-1/2 top-1/2 flex size-[96px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]" aria-label="Play Jarvis saying: Good morning, sir. Your brief is ready.">
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Jarvis</span>
          <span className="mt-0.5 text-[12px] text-[var(--muted)]">{t >= 0 ? "speaking" : "tap to hear"}</span>
        </button>
        <audio ref={audio} src="/free/46/jarvis.mp3" preload="none" />
      </div>
      <figcaption>
        <p className="text-[26px] font-semibold leading-[1.15] tracking-[-0.03em] text-[var(--ink)] sm:text-[30px]">
          {WORDS.map(([w, at], i) => (
            <span key={i} className="transition-colors duration-200" style={{ color: t >= at || t < 0 ? "var(--ink)" : "var(--rule-strong)" }}>
              {w}{" "}
            </span>
          ))}
        </p>
        <p className="mt-4 text-[14.5px] leading-relaxed text-[var(--soft)]">The real voice of my agent. The ring is drawn for this page and moves with how loud it speaks.</p>
      </figcaption>
    </figure>
  );
}

/* ───────────── run: a real Claude Code session, replayed ───────────── */

const PROMPT = "Read brief.md, run a quick python script to find today's biggest mover, and tell me in one line.";
const STEPS = [
  { tool: "Read", arg: "brief.md", out: "Read 14 lines" },
  { tool: "Write", arg: "mover.py", out: "Wrote 4 lines to mover.py" },
  { tool: "Bash", arg: "python3 mover.py brief.md", out: "Nasdaq Composite -1.38%" },
];
const ANSWER = "Biggest mover today: the Nasdaq, down 1.38%.";

function Run() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [typedLive, setTyped] = useState(0);
  const [stepLive, setStep] = useState(0); // 0..3 steps shown, 4 = answer
  // with reduced motion the finished run is shown at once
  const typed = reduce ? PROMPT.length : typedLive;
  const step = reduce ? 4 : stepLive;
  useEffect(() => {
    if (!seen || reduce) return;
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const type = setInterval(() => {
      i += 2;
      setTyped(Math.min(i, PROMPT.length));
      if (i >= PROMPT.length) {
        clearInterval(type);
        [1, 2, 3, 4].forEach((s, k) => timers.push(setTimeout(() => setStep(s), 450 + k * 650)));
      }
    }, 22);
    return () => {
      clearInterval(type);
      timers.forEach(clearTimeout);
    };
  }, [seen, reduce, run]);
  const replay = () => {
    setTyped(0);
    setStep(0);
    setRun((r) => r + 1);
  };
  return (
    <figure ref={ref} className="jv-plate p-3 sm:p-4">
      <div className="overflow-hidden rounded-xl bg-[var(--panel)] shadow-[0_24px_50px_-30px_rgba(21,23,26,.7)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <span className="font-mono text-[12px] text-white/50">claude · ~/jarvis</span>
          <button type="button" onClick={replay} className="jv-press rounded-md px-2.5 py-1 text-[12px] text-white/70 ring-1 ring-white/15 hover:text-white">
            Replay
          </button>
        </div>
        <div className="h-[300px] px-4 py-4 font-mono text-[13px] leading-[1.7] sm:h-[280px]">
          <p className="rounded-md bg-white/[.06] px-3 py-2 text-white">
            <span className="text-white/40">&gt; </span>
            {PROMPT.slice(0, typed)}
            {typed < PROMPT.length && <span className="jv-caret ml-px inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-[var(--accent)]" />}
          </p>
          {STEPS.map((s, i) =>
            step > i ? (
              <motion.div key={`${run}-${i}`} className="mt-2.5" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
                <p className="text-white">
                  <span className="text-[var(--pass)]">●</span> <span className="font-semibold">{s.tool}</span>
                  <span className="text-white/50">({s.arg})</span>
                </p>
                <p className={i === 2 ? "pl-4 text-[#ffb59c]" : "pl-4 text-white/45"}>⎿ {s.out}</p>
              </motion.div>
            ) : null,
          )}
          {step > 3 && (
            <motion.p key={`${run}-a`} className="mt-3 text-white" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
              {ANSWER}
            </motion.p>
          )}
        </div>
      </div>
      <figcaption className="px-1 pt-3 text-[13px] text-[var(--muted)]">A real run on the morning brief: it reads the file, writes a script, runs it, and answers.</figcaption>
    </figure>
  );
}

/* ───────────── vault: the real link graph as a 3D sphere you can turn ───────────── */

type VaultData = { nodes: number[][]; edges: number[][]; groups: number[]; names: string[] };
// one colour per top folder, as in Obsidian's graph groups; the rest stay grey
const FOLDER_COLOR: Record<string, string> = {
  Logs: "#4f7fd9",
  Projects: "#e0552f",
  Decisions: "#d39b1c",
  Knowledge: "#2e9e6a",
  Journal: "#cf6f95",
  Analysis: "#8a6ad1",
  Docs: "#2a9fb0",
};
const GREY = "#a9adb3";

function Vault() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const seen = useInView(wrap, { once: true, margin: "200px" });
  const visible = useInView(wrap, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [data, setData] = useState<VaultData | null>(null);
  const [pick, setPick] = useState<string | null>(null);
  const angle = useRef({ y: 0.6, x: 0.35, drag: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    if (!seen || data) return;
    fetch("/free/46/vault.json").then((r) => r.json()).then(setData).catch(() => {});
  }, [seen, data]);

  useEffect(() => {
    const cv = canvas.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || !data) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = () => {
      const w = cv.clientWidth, h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const deg = data.nodes.map((n) => n[3]);
    let raf = 0;
    const draw = () => {
      const a = angle.current;
      if (!a.drag && !reduce && visible) a.y += 0.0032;
      const W = cv.width, H = cv.height, R = Math.min(W, H) * 0.36, cx = W / 2, cy = H / 2;
      const ca = Math.cos(a.y), sa = Math.sin(a.y), cb = Math.cos(a.x), sb = Math.sin(a.x);
      const P = data.nodes.map(([x, y, z]) => {
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        const p = 2.8 / (2.8 + z2);
        return [cx + x1 * R * p, cy + y1 * R * p, z2];
      });
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = dpr * 0.6;
      for (const [s, e] of data.edges) {
        const on = pick && data.names[data.groups[s]] === pick && data.names[data.groups[e]] === pick;
        ctx.strokeStyle = on ? hexA(FOLDER_COLOR[pick!] ?? GREY, 0.55) : "rgba(21,23,26,0.07)";
        ctx.beginPath();
        ctx.moveTo(P[s][0], P[s][1]);
        ctx.lineTo(P[e][0], P[e][1]);
        ctx.stroke();
      }
      const order = P.map((_, i) => i).sort((i, j) => P[j][2] - P[i][2]);
      for (const i of order) {
        const name = data.names[data.groups[i]];
        const col = FOLDER_COLOR[name] ?? GREY;
        const dim = pick && name !== pick;
        const r = (1.6 + Math.sqrt(deg[i]) * 0.9) * dpr * (2.8 / (2.8 + P[i][2]));
        ctx.fillStyle = dim ? "rgba(21,23,26,0.12)" : col;
        ctx.beginPath();
        ctx.arc(P[i][0], P[i][1], r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    if (visible) raf = requestAnimationFrame(draw);
    else draw();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [data, pick, reduce, visible]);

  const down = (e: React.PointerEvent) => {
    const a = angle.current;
    a.drag = true;
    a.lastX = e.clientX;
    a.lastY = e.clientY;
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const a = angle.current;
    if (!a.drag) return;
    a.y += (e.clientX - a.lastX) * 0.008;
    a.x = Math.max(-1.2, Math.min(1.2, a.x + (e.clientY - a.lastY) * 0.008));
    a.lastX = e.clientX;
    a.lastY = e.clientY;
  };
  const up = () => (angle.current.drag = false);

  const counts = data ? Object.keys(FOLDER_COLOR).map((n) => [n, data.groups.filter((g) => data.names[g] === n).length] as const) : [];
  return (
    <figure ref={wrap} className="jv-plate p-4 sm:p-6">
      <div className="relative">
        <canvas
          ref={canvas}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className="block aspect-[4/3] w-full cursor-grab touch-none active:cursor-grabbing"
          role="img"
          aria-label="My Obsidian vault as a 3D graph: 467 notes and 1,850 links, coloured by folder. Drag to turn it."
        />
        <p className="pointer-events-none absolute left-0 top-0 text-[13px] text-[var(--muted)]">
          <span className="text-[22px] font-semibold tracking-[-0.03em] text-[var(--ink)]">467</span> notes, 1,850 links
        </p>
        <p className="pointer-events-none absolute bottom-0 right-0 text-[12px] text-[var(--muted)]">Drag to turn</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {counts.map(([n, c]) => (
          <button
            key={n}
            type="button"
            onClick={() => setPick(pick === n ? null : n)}
            aria-pressed={pick === n}
            className="jv-press inline-flex h-9 items-center gap-2 rounded-full bg-white px-3 text-[13px] text-[var(--ink)] ring-1 ring-[var(--rule)] aria-pressed:ring-[var(--ink)]"
          >
            <span className="size-2.5 rounded-full" style={{ background: FOLDER_COLOR[n] }} />
            {n}
            <span className="tabular-nums text-[var(--muted)]">{c}</span>
          </button>
        ))}
      </div>
      <figcaption className="pt-3 text-[13px] text-[var(--muted)]">My real vault, one dot per note. Tap a folder to light it up.</figcaption>
    </figure>
  );
}

function hexA(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

/* ───────────── voice: how the phone reaches the agent (and what it can't reach yet) ───────────── */

function Voice() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const live = seen && !reduce;
  return (
    <figure className="jv-plate p-4 sm:p-6">
      <svg ref={ref} viewBox="0 0 600 270" className="block w-full" role="img" aria-label="A call goes from my phone to a Twilio number, then to the ElevenLabs agent that speaks with Claude. Claude Code and my notes are a separate part, not connected to the phone yet.">
        {/* phone */}
        <g transform="translate(20 40)">
          <rect width="78" height="140" rx="16" fill="#fff" stroke="var(--ink)" strokeWidth="1.3" />
          <rect x="28" y="8" width="22" height="5" rx="2.5" fill="var(--ink)" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <motion.rect key={i} x={14 + i * 7.5} width="4" rx="2" fill="var(--accent)" initial={false} animate={live ? { height: [6, 18 + (i % 3) * 8, 6], y: [67, 58 - (i % 3) * 4, 67] } : { height: 6, y: 67 }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }} />
          ))}
          <text x="39" y="122" textAnchor="middle" fontSize="11" fill="var(--soft)">calling</text>
        </g>
        <text x="59" y="205" textAnchor="middle" fontSize="12.5" fill="var(--ink)" fontWeight="600">Me</text>

        {/* number */}
        <g transform="translate(160 76)">
          <rect width="150" height="68" rx="12" fill="#fff" stroke="var(--ink)" strokeWidth="1.3" />
          <text x="75" y="30" textAnchor="middle" fontSize="13.5" fontWeight="600" fill="var(--ink)" className="font-mono">+1 239 ···· 45</text>
          <text x="75" y="50" textAnchor="middle" fontSize="11.5" fill="var(--muted)">Twilio number</text>
        </g>

        {/* agent */}
        <g transform="translate(372 52)">
          <rect width="206" height="116" rx="14" fill="var(--ink)" />
          <text x="18" y="30" fontSize="14" fontWeight="600" fill="#fff">ElevenLabs agent</text>
          <text x="18" y="56" fontSize="12" fill="rgba(255,255,255,.65)">Voice</text>
          <text x="188" y="56" textAnchor="end" fontSize="12" fill="#fff">Chris</text>
          <line x1="18" y1="66" x2="188" y2="66" stroke="rgba(255,255,255,.12)" />
          <text x="18" y="84" fontSize="12" fill="rgba(255,255,255,.65)">Thinks with</text>
          <text x="188" y="84" textAnchor="end" fontSize="12" fill="#fff">Claude</text>
          <line x1="18" y1="94" x2="188" y2="94" stroke="rgba(255,255,255,.12)" />
          <text x="18" y="108" fontSize="12" fill="rgba(255,255,255,.65)">Sign-in</text>
          <text x="188" y="108" textAnchor="end" fontSize="12" fill="var(--accent)">turn on</text>
        </g>

        {/* call path */}
        <path d="M100 110 H160 M310 110 H372" fill="none" stroke="var(--ink)" strokeWidth="1.3" />
        {[0, 1].map((k) => (
          <motion.circle key={k} r="4" cy="110" fill="var(--accent)" initial={false} animate={live ? { cx: k ? [310, 372] : [100, 160], opacity: [0, 1, 0] } : { cx: k ? 341 : 130, opacity: 0 }} transition={{ duration: 1.1, repeat: Infinity, delay: k * 0.5, ease: "linear" }} />
        ))}

        {/* the part it can't reach yet */}
        <g transform="translate(372 206)">
          <rect width="206" height="48" rx="12" fill="none" stroke="var(--ink)" strokeWidth="1.1" strokeDasharray="4 4" />
          <text x="103" y="29" textAnchor="middle" fontSize="12.5" fill="var(--soft)">Claude Code + my notes</text>
        </g>
        <line x1="475" y1="170" x2="475" y2="204" stroke="var(--muted)" strokeWidth="1.1" strokeDasharray="3 4" />
        <text x="483" y="191" fontSize="11" fill="var(--muted)">not connected yet</text>
      </svg>
      <figcaption className="pt-3 text-[13px] text-[var(--muted)]">The phone side is its own part. It talks with Claude, but it can&apos;t read my notes yet.</figcaption>
    </figure>
  );
}

/* ───────────── team: one request, routed to the role whose description fits ───────────── */

const ROLES = [
  { name: "Analyst", file: "analyst.md", can: "reads only" },
  { name: "Marketer", file: "marketer.md", can: "drafts only" },
  { name: "Engineer", file: "engineer.md", can: "edits code" },
];
const ASKS = ["Did the price change work?", "Write three hooks for tomorrow", "Fix the broken booking form"];

function Team() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!seen || !auto || reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % 3), 2600);
    return () => clearInterval(id);
  }, [seen, auto, reduce]);
  const xs = [100, 300, 500];
  return (
    <figure ref={ref} className="jv-plate p-4 sm:p-6">
      <div className="flex flex-wrap gap-2">
        {ASKS.map((a, k) => (
          <button
            key={a}
            type="button"
            aria-pressed={i === k}
            onClick={() => {
              setAuto(false);
              setI(k);
            }}
            className="jv-press h-9 rounded-full bg-white px-3.5 text-[13px] text-[var(--soft)] ring-1 ring-[var(--rule)] aria-pressed:text-[var(--ink)] aria-pressed:ring-[var(--ink)]"
          >
            &ldquo;{a}&rdquo;
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 250" className="mt-4 block w-full" role="img" aria-label={`Claude Code hands "${ASKS[i]}" to the ${ROLES[i].name.toLowerCase()}.`}>
        <g transform="translate(220 14)">
          <rect width="160" height="56" rx="12" fill="var(--ink)" />
          <text x="80" y="27" textAnchor="middle" fontSize="14" fontWeight="600" fill="#fff">Claude Code</text>
          <text x="80" y="44" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,.6)">picks by description</text>
        </g>
        {xs.map((x, k) => (
          <path key={k} d={`M300 70 C300 120 ${x} 110 ${x} 160`} fill="none" stroke={k === i ? "var(--accent)" : "var(--rule-strong)"} strokeWidth={k === i ? 1.8 : 1.1} style={{ transition: "stroke .3s" }} />
        ))}
        <motion.circle
          key={i}
          r="5"
          fill="var(--accent)"
          initial={reduce ? false : { offsetDistance: "0%" } as never}
          animate={{ offsetDistance: "100%" } as never}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ offsetPath: `path("M300 70 C300 120 ${xs[i]} 110 ${xs[i]} 160")` } as React.CSSProperties}
        />
        {ROLES.map((r, k) => (
          <g key={r.name} transform={`translate(${xs[k] - 80} 160)`}>
            <motion.rect width="160" height="72" rx="12" fill="#fff" initial={false} animate={{ stroke: k === i ? "#e0552f" : "#dcded9", strokeWidth: k === i ? 2 : 1.2 }} transition={{ duration: 0.3 }} />
            <text x="16" y="28" fontSize="14" fontWeight="600" fill="var(--ink)">{r.name}</text>
            <text x="16" y="47" fontSize="11" fill="var(--muted)" className="font-mono">{r.file}</text>
            <text x="16" y="63" fontSize="11" fill={k === i ? "var(--accent)" : "var(--soft)"}>{r.can}</text>
          </g>
        ))}
      </svg>
      <figcaption className="pt-1 text-[13px] text-[var(--muted)]">Each role is one file with its own rules and tools. Tap a request to see who gets it.</figcaption>
    </figure>
  );
}

/* ───────────── brief: 6:30, and the real brief it wrote ───────────── */

const BRIEF: [string, string, string][] = [
  ["S&P 500", "7,720.39", "-0.30%"],
  ["Nasdaq Composite", "26,184.72", "-1.38%"],
  ["Nikkei 225", "63,954.19", "+1.08%"],
  ["Dollar-yen", "157.67", "-0.20%"],
  ["US 10-year yield", "4.99%", ""],
];

const HAND: React.CSSProperties = { transformBox: "view-box", transformOrigin: "100px 100px", transition: "transform 1.6s cubic-bezier(0.16,1,0.3,1)" };

function Brief() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const done = seen || reduce;
  // minute hand from 12 (6:00) to 6 (6:30); hour hand from 6 to halfway to 7
  return (
    <figure ref={ref} className="jv-plate grid items-center gap-6 p-5 sm:grid-cols-[200px_1fr] sm:p-7">
      <div className="mx-auto w-[180px] sm:w-[200px]">
        <svg viewBox="0 0 200 200" className="block w-full" aria-hidden="true">
          <circle cx="100" cy="100" r="92" fill="#fff" stroke="var(--ink)" strokeWidth="1.4" />
          {Array.from({ length: 60 }, (_, k) => {
            const a = (k / 60) * Math.PI * 2, h = k % 5 === 0;
            return <line key={k} x1={100 + Math.sin(a) * 84} y1={100 - Math.cos(a) * 84} x2={100 + Math.sin(a) * (h ? 74 : 80)} y2={100 - Math.cos(a) * (h ? 74 : 80)} stroke="var(--ink)" strokeWidth={h ? 2 : 0.8} opacity={h ? 0.9 : 0.4} />;
          })}
          {/* rotate around the dial's centre (view-box), not the hand's own box */}
          <line x1="100" y1="100" x2="100" y2="52" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" style={{ ...HAND, transform: `rotate(${done ? 195 : 180}deg)` }} />
          <line x1="100" y1="106" x2="100" y2="28" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" style={{ ...HAND, transform: `rotate(${done ? 180 : 0}deg)` }} />
          <circle cx="100" cy="100" r="5" fill="var(--ink)" />
        </svg>
        <p className="mt-2 text-center font-mono text-[13px] text-[var(--muted)]">06:30, every day</p>
      </div>
      <div className="rounded-xl bg-white p-4 ring-1 ring-[var(--rule)] sm:p-5">
        <p className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">Morning brief, Oct 30</p>
        <p className="text-[12.5px] text-[var(--muted)]">Market numbers, closing prices</p>
        <ul className="mt-3">
          {BRIEF.map(([n, v, p], k) => (
            <motion.li key={n} className="flex items-baseline justify-between border-t border-[var(--rule)] py-2 text-[14px]" initial={reduce ? false : { opacity: 0, y: 4 }} animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }} transition={{ ...SPRING, delay: 1.5 + k * 0.12 }}>
              <span className="text-[var(--ink)]">{n}</span>
              <span className="font-mono tabular-nums text-[var(--ink)]">
                {v}
                {p && <span className="ml-3 inline-block w-[58px] text-right" style={{ color: p.startsWith("-") ? "var(--accent)" : "var(--pass)" }}>{p}</span>}
                {!p && <span className="ml-3 inline-block w-[58px]" />}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

const JV_CSS = `
.jv{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--panel:#14161a;--accent:#e0552f;--pass:#2e9e6a}
.jv-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.jv-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .2s,color .2s}
.jv-press:active{transform:scale(.96)}
@keyframes jv-spin{to{transform:rotate(360deg)}}
.jv-spin{animation:jv-spin 38s linear infinite}
.jv-spin-rev{animation:jv-spin 24s linear infinite reverse}
@keyframes jv-blink{50%{opacity:0}}
.jv-caret{animation:jv-blink 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.jv-spin,.jv-spin-rev,.jv-caret{animation:none}}
`;

"use client";

// /free/48 (Project Suncatcher, the first answer from a data-center-class Google TPU in orbit): one small live figure per chapter,
// drawn for this site rather than cut from the reel. Same language as /free/46, /free/47 and /free/starter:
// paper plate, ink lines, one orange accent, nothing plays off screen.
// Every number and quote comes from Google's own posts (blog.google, Sep 24 and Oct 30, 2026; Google Research, Nov 4, 2025).
// The prompt and the haiku are verbatim. No Google, SpaceX or Planet footage.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type SuncatcherDemoKind = "hello" | "sun" | "radiation" | "laser" | "cluster" | "next";

export function SuncatcherDemo({ kind }: { kind: SuncatcherDemoKind }) {
  return (
    <div className="sc mt-5 max-w-2xl">
      <style>{SC_CSS}</style>
      {kind === "hello" && <Hello />}
      {kind === "sun" && <Sun />}
      {kind === "radiation" && <Radiation />}
      {kind === "laser" && <Laser />}
      {kind === "cluster" && <Cluster />}
      {kind === "next" && <Next />}
    </div>
  );
}

/** plays a timeline once the figure is on screen; `replay` restarts it; reduced motion jumps to the end */
function useTimeline(total: number) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!seen || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const s = (now - t0) / 1000;
      setT(Math.min(s, total));
      if (s < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduce, run, total]);
  return { ref, t: reduce ? total : t, replay: () => { setT(0); setRun((r) => r + 1); } };
}

/** a clock that runs only while the figure is on screen (for figures that loop); frozen at 0 with reduced motion */
function useClock() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setT((v) => v + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduce]);
  return { ref, t };
}

const on = (t: number, at: number) => t >= at;
const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const ease = (x: number) => 1 - Math.pow(1 - x, 3);

function Button({ onClick, children, primary, disabled }: { onClick: () => void; children: React.ReactNode; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`sc-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
    >
      {children}
    </button>
  );
}

/** two or three options, one picked */
function Toggle<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-1 rounded-full bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`sc-press whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium sm:px-3 sm:text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** "lab test" / "design" tag, so nothing reads as already flying */
function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md border border-[var(--rule-strong)] bg-white px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--soft)]">{children}</span>;
}

/** a satellite as a line drawing: a box with two panels */
function Sat({ x, y, lit = true, scale = 1 }: { x: number; y: number; lit?: boolean; scale?: number }) {
  const c = lit ? "var(--accent)" : "var(--muted)";
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-22} y={-4} width={14} height={8} fill="#fff" stroke={c} strokeWidth={1.4} />
      <rect x={8} y={-4} width={14} height={8} fill="#fff" stroke={c} strokeWidth={1.4} />
      <line x1={-8} y1={0} x2={-6} y2={0} stroke="var(--ink)" strokeWidth={1.2} />
      <line x1={6} y1={0} x2={8} y2={0} stroke="var(--ink)" strokeWidth={1.2} />
      <rect x={-6} y={-6} width={12} height={12} rx={1.5} fill="#fff" stroke="var(--ink)" strokeWidth={1.4} />
    </g>
  );
}

/* ───────────── hello: the prompt goes up, Gemma 4 answers on the TPU, the haiku comes down over Svalbard ───────────── */

// verbatim from Sundar Pichai's screen recording (Oct 30, 2026)
const PROMPT = "Write a haiku from the perspective of a TPU orbiting Earth, with the wonderful world spinning beneath you.";
// verbatim from Google's post of Oct 30, 2026
const HAIKU = ["Blue marble below", "Data streams in silent grace", "Starlight feeds my core. ✨"];
// side view: the Earth's curve, two ground stations, the satellite's pass
const EC = { x: 320, y: 1150, r: 960 };
const OR = EC.r + 135;
const SPEED = 108; // px per second along the pass
const X0 = 30;
const ST1 = 150; // the ground station that sent the prompt (Google doesn't name it)
const ST2 = 500; // Svalbard, Norway
const T_UP = (ST1 - X0) / SPEED;
const T_DOWN = (ST2 - X0) / SPEED;
const T_BOX = T_DOWN + 0.6;
const LINE_AT = [1.2, 2.2, 3.4]; // when each line appears after the reply box opens, as in the recording
const HELLO_TOTAL = T_BOX + LINE_AT[2] + 0.6;
const arcY = (x: number, r: number) => EC.y - Math.sqrt(r * r - (x - EC.x) ** 2);

function Hello() {
  const { ref, t, replay } = useTimeline(HELLO_TOTAL);
  const typed = Math.min(PROMPT.length, Math.floor((t / (T_UP - 0.05)) * PROMPT.length));
  const sx = Math.min(590, X0 + SPEED * t); // flies on, then rests near the edge of the plate
  const sy = arcY(sx, OR);
  const g1 = arcY(ST1, EC.r);
  const g2 = arcY(ST2, EC.r);
  const up = ramp(t, T_UP, T_UP + 0.5);
  const down = ramp(t, T_DOWN, T_DOWN + 0.5);
  const thinking = t > T_UP + 0.5 && t < T_UP + 1.8;
  const lines = HAIKU.filter((_, i) => on(t, T_BOX + LINE_AT[i])).length;
  const status =
    t < T_UP ? "Typing the prompt on the ground"
    : t < T_UP + 0.5 ? "↑ Uplink during a ground-station pass"
    : thinking ? "Gemma 4 runs on the TPU in orbit"
    : t < T_DOWN ? "Flying on"
    : t < T_BOX ? "↓ Downlinked as it passed by Svalbard, Norway"
    : "Received on Earth";
  const sat1y = arcY(ST1, OR);
  const sat2y = arcY(ST2, OR);
  return (
    <figure ref={ref} className="sc-plate p-4 sm:p-6">
      <svg viewBox="0 0 640 250" className="w-full overflow-hidden rounded-xl" aria-label="The satellite gets the prompt during a ground-station pass and sends the haiku down as it passes by Svalbard, Norway">
        {/* orbit path */}
        <path d={`M 0 ${arcY(0, OR)} A ${OR} ${OR} 0 0 1 640 ${arcY(640, OR)}`} fill="none" stroke="var(--rule-strong)" strokeWidth={1} strokeDasharray="3 5" />
        {/* the Earth's curve */}
        <path d={`M 0 ${arcY(0, EC.r)} A ${EC.r} ${EC.r} 0 0 1 640 ${arcY(640, EC.r)} L 640 250 L 0 250 Z`} fill="#fff" stroke="var(--ink)" strokeWidth={1.3} />
        {[0.82, 0.64].map((k) => (
          <path key={k} d={`M 0 ${arcY(0, EC.r) + 40 / k - 40} A ${EC.r} ${EC.r} 0 0 1 640 ${arcY(640, EC.r) + 40 / k - 40}`} fill="none" stroke="var(--rule)" strokeWidth={1} />
        ))}
        {/* beams */}
        {up > 0 && t < T_UP + 1.0 && (
          <line x1={ST1} y1={g1 - 10} x2={ST1} y2={g1 - 10 - (g1 - 10 - (sat1y + 8)) * ease(up)} stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" className="sc-dash" />
        )}
        {down > 0 && t < T_BOX + 0.8 && (
          <line x1={ST2} y1={sat2y + 8} x2={ST2} y2={sat2y + 8 + (g2 - 10 - (sat2y + 8)) * ease(down)} stroke="var(--accent)" strokeWidth={2.5} strokeLinecap="round" className="sc-dash" />
        )}
        {/* ground stations */}
        {[{ x: ST1, y: g1 }, { x: ST2, y: g2 }].map((s, i) => (
          <g key={i}>
            <path d={`M ${s.x - 9} ${s.y - 12} Q ${s.x} ${s.y - 2} ${s.x + 9} ${s.y - 12}`} fill="none" stroke="var(--ink)" strokeWidth={1.4} />
            <line x1={s.x} y1={s.y - 7} x2={s.x} y2={s.y} stroke="var(--ink)" strokeWidth={1.4} />
            <text x={s.x} y={s.y + 18} textAnchor="middle" fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace">ground station</text>
          </g>
        ))}
        {t >= T_DOWN && <text x={625} y={sat2y - 20} textAnchor="end" fontSize={15} fill="var(--accent)" fontFamily="ui-monospace, monospace">passing by Svalbard, Norway</text>}
        {/* satellite */}
        {thinking && <circle cx={sx} cy={sy} r={14 + 6 * Math.sin(t * 9)} fill="none" stroke="var(--accent)" strokeWidth={1.2} opacity={0.6} />}
        <Sat x={sx} y={sy} lit={t >= T_UP + 0.5} />
        {up > 0 && t < T_UP + 1.0 && <text x={ST1 + 14} y={(g1 + sat1y) / 2} fontSize={15} fill="var(--accent)" fontFamily="ui-monospace, monospace">↑ prompt</text>}
        {down > 0 && t < T_BOX + 0.8 && <text x={ST2 + 14} y={(g2 + sat2y) / 2} fontSize={15} fill="var(--accent)" fontFamily="ui-monospace, monospace">↓ haiku</text>}
      </svg>
      <p className="mt-3 font-mono text-[12px] text-[var(--soft)]" aria-live="polite">
        <span className="mr-2 inline-block size-1.5 rounded-full align-middle" style={{ background: t >= HELLO_TOTAL - 0.6 ? "var(--accent)" : "var(--ink)" }} />
        {status}
      </p>
      <div className="mt-3 grid gap-2.5 font-mono text-[13px] leading-relaxed">
        <div className="rounded-xl bg-white px-4 py-3 text-[var(--ink)] shadow-[0_0_0_1px_var(--rule)] transition-opacity duration-500" style={{ opacity: t >= T_UP + 0.5 ? 0.55 : 1 }}>
          <span className="text-[var(--muted)]">Ground: </span>
          {PROMPT.slice(0, typed)}
          {typed < PROMPT.length && <span className="sc-caret text-[var(--accent)]">|</span>}
        </div>
        <div className="min-h-[104px] rounded-xl bg-white px-4 py-3 shadow-[0_0_0_1px_var(--rule)] transition-[box-shadow] duration-500" style={{ boxShadow: on(t, T_BOX) ? "0 0 0 1.5px var(--accent)" : undefined }}>
          <span className="text-[var(--muted)]">Gemma: </span>
          {on(t, T_BOX) ? (
            <span className="block">
              {HAIKU.map((l, i) => (
                <span key={l} className="block text-[15px] text-[var(--ink)] transition-[opacity,transform] duration-500" style={{ opacity: i < lines ? 1 : 0, transform: i < lines ? "none" : "translateY(4px)" }}>{l}</span>
              ))}
              {lines < 3 && <span className="sc-caret text-[var(--accent)]">▍</span>}
            </span>
          ) : (
            <span className="text-[var(--rule-strong)]">waiting…</span>
          )}
        </div>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="max-w-md text-[13.5px] leading-relaxed text-[var(--soft)]">The real prompt and the real haiku. The pass is shortened. Google doesn&apos;t say which stations sent the prompt and received the poem; the two here are a drawing.</span>
        <Button onClick={replay}>Send it again</Button>
      </figcaption>
    </figure>
  );
}

/* ───────────── sun: up to 8x the solar power, and an orbit that stays in the light ───────────── */

type OrbitKind = "ordinary" | "dawn";

function Sun() {
  const { ref, t } = useClock();
  const [orbit, setOrbit] = useState<OrbitKind>("ordinary");
  const { ref: barsRef, t: barsT } = useTimeline(1.6);
  const E = { x: 300, y: 135, r: 58 };
  const R = 100;
  const w = 0.55; // radians per second
  let sx: number, sy: number;
  if (orbit === "ordinary") {
    sx = E.x + R * Math.cos(t * w + Math.PI);
    sy = E.y + R * Math.sin(t * w + Math.PI);
  } else {
    // a dawn–dusk orbit seen from above the North Pole: edge-on, right along the line between day and night
    sx = E.x;
    sy = E.y + R * Math.sin(t * w);
  }
  const inShadow = orbit === "ordinary" && sx > E.x && Math.abs(sy - E.y) < E.r;
  // a battery that drains in the shadow and refills in the sun (ordinary orbit only).
  // The shadow is the arc around angle 0 (right of the Earth), half-width h.
  const h = Math.asin(E.r / R);
  const TAU = Math.PI * 2;
  const phi = (((t * w + Math.PI + h) % TAU) + TAU) % TAU; // 0 = entering the shadow
  const charge = orbit === "dawn" ? 1 : phi < 2 * h ? 1 - 0.7 * (phi / (2 * h)) : Math.min(1, 0.3 + 0.7 * ((phi - 2 * h) / (0.8 * Math.PI)));
  const k = ease(ramp(barsT, 0.1, 1.5));
  return (
    <figure ref={ref} className="sc-plate p-4 sm:p-6">
      <div ref={barsRef} className="grid gap-2.5">
        {[
          { l: "Solar panel on Earth", v: 1, txt: "1×" },
          { l: "In the right orbit", v: 8, txt: "up to 8×" },
        ].map((b) => (
          <div key={b.l} className="grid grid-cols-[96px_1fr] items-center gap-3 sm:grid-cols-[160px_1fr]">
            <span className="text-[13px] leading-tight text-[var(--soft)]">{b.l}</span>
            <div className="flex items-center gap-2.5">
              <div className="h-3.5 rounded-full" style={{ width: `${(b.v / 8) * 62 * k}%`, minWidth: 6, background: b.v > 1 ? "var(--accent)" : "var(--ink)" }} />
              <span className="whitespace-nowrap font-mono text-[13px] tabular-nums text-[var(--ink)]">{b.v > 1 ? (k < 1 ? `${Math.max(1, Math.round(8 * k))}×` : b.txt) : b.txt}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Toggle
          label="Orbit"
          value={orbit}
          onChange={setOrbit}
          options={[{ id: "ordinary", label: "Through shadow" }, { id: "dawn", label: "Dawn–dusk" }]}
        />
        {orbit === "dawn" && <Tag>likely future design</Tag>}
      </div>
      <div className="mt-3 grid items-center gap-4 sm:grid-cols-[1fr_150px]">
        <svg viewBox="0 0 560 270" className="w-full" aria-label="The Earth seen from above the North Pole, the Sun on the left, and the satellite's orbit">
          {/* sunlight */}
          {[50, 85, 120, 155, 190, 225].map((y) => (
            <line key={y} x1={18} y1={y} x2={150} y2={y} stroke="var(--accent)" strokeWidth={1.2} strokeDasharray="6 6" opacity={0.6} className="sc-dash" />
          ))}
          <text x={18} y={30} fontSize={15} fill="var(--accent)" fontFamily="ui-monospace, monospace">sunlight →</text>
          {/* Earth's shadow */}
          <rect x={E.x} y={E.y - E.r} width={560 - E.x} height={E.r * 2} fill="rgba(21,23,26,.07)" />
          <text x={548} y={E.y + 4} textAnchor="end" fontSize={15} fill="var(--muted)" fontFamily="ui-monospace, monospace">Earth&apos;s shadow</text>
          {/* Earth: day half and night half */}
          <circle cx={E.x} cy={E.y} r={E.r} fill="#fff" stroke="var(--ink)" strokeWidth={1.3} />
          <path d={`M ${E.x} ${E.y - E.r} A ${E.r} ${E.r} 0 0 1 ${E.x} ${E.y + E.r} Z`} fill="rgba(21,23,26,.16)" />
          <circle cx={E.x} cy={E.y} r={2.5} fill="var(--ink)" />
          {/* the orbit */}
          {orbit === "ordinary" ? (
            <circle cx={E.x} cy={E.y} r={R} fill="none" stroke="var(--rule-strong)" strokeWidth={1.2} strokeDasharray="3 5" />
          ) : (
            <line x1={E.x} y1={E.y - R} x2={E.x} y2={E.y + R} stroke="var(--accent)" strokeWidth={1.2} strokeDasharray="3 5" />
          )}
          <Sat x={sx} y={sy} lit={!inShadow} scale={0.9} />
          <text x={orbit === "ordinary" ? E.x : E.x + 14} y={orbit === "ordinary" ? E.y + R + 22 : E.y + R + 4} textAnchor={orbit === "ordinary" ? "middle" : "start"} fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace">
            {orbit === "ordinary" ? "part of every lap is in the dark" : "on the day–night line"}
          </text>
        </svg>
        <div className="flex items-center gap-4 sm:flex-col sm:items-start">
          <div className="flex items-center gap-2">
            <div className="relative h-9 rounded-md border-[1.5px] border-[var(--ink)] p-[3px]" style={{ width: 76 }}>
              <div className="h-full rounded-[3px] transition-[width] duration-150" style={{ width: `${charge * 100}%`, background: inShadow ? "var(--muted)" : "var(--accent)" }} />
              <span className="absolute -right-[5px] top-1/2 h-3 w-[4px] -translate-y-1/2 rounded-r-sm bg-[var(--ink)]" />
            </div>
          </div>
          <p className="text-[13px] leading-snug text-[var(--soft)]">
            {orbit === "ordinary" ? (inShadow ? "In the shadow: running on the battery" : "In the sun: charging") : "Near-constant sunlight, so less need for heavy batteries"}
          </p>
        </div>
      </div>
      <figcaption className="mt-4 text-[13.5px] leading-relaxed text-[var(--soft)]">
        Seen from above the North Pole, not to scale. The orbit through the shadow and its battery are our own illustration, not from Google, and say nothing about the prototype. The dawn–dusk orbit is the likely choice in Google&apos;s 2025 design.
      </figcaption>
    </figure>
  );
}

/* ───────────── radiation: the proton-beam test on Trillium (lab test) ───────────── */

const DOSE_MAX = 2400; // rad(Si), the end of the scale
const DOSE_MISSION = 750; // expected (shielded) five-year mission dose
const DOSE_HBM = 2000; // where the most sensitive part (HBM) first showed irregularities

function Radiation() {
  const { ref, t, replay } = useTimeline(3.6);
  const dose = DOSE_HBM * ease(ramp(t, 0.3, 3.2));
  const x = (d: number) => 30 + (d / DOSE_MAX) * 560;
  const beam = t > 0.2 && t < 3.3;
  return (
    <figure ref={ref} className="sc-plate p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Tag>lab test</Tag>
        <span className="font-mono text-[12px] text-[var(--muted)]">67 MeV proton beam · Trillium (v6e Cloud TPU)</span>
      </div>
      <svg viewBox="0 0 620 248" className="mt-3 w-full" aria-label="A proton beam hits the Trillium chip while the dose counter climbs past the five-year mission dose to 2 krad">
        {/* beam */}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={40} y1={42 + i * 9} x2={238} y2={42 + i * 9} stroke={beam ? "var(--accent)" : "var(--rule-strong)"} strokeWidth={1.2} strokeDasharray="10 8" className={beam ? "sc-dash-fast" : undefined} />
        ))}
        <text x={40} y={28} fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace">protons →</text>
        {/* the chip */}
        <rect x={250} y={24} width={88} height={88} rx={6} fill="#fff" stroke="var(--ink)" strokeWidth={1.4} />
        <rect x={270} y={44} width={48} height={48} rx={3} fill="none" stroke="var(--ink)" strokeWidth={1} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <line x1={262 + i * 13} y1={24} x2={262 + i * 13} y2={16} stroke="var(--ink)" strokeWidth={1.2} />
            <line x1={262 + i * 13} y1={112} x2={262 + i * 13} y2={120} stroke="var(--ink)" strokeWidth={1.2} />
          </g>
        ))}
        <text x={294} y={72} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--ink)">TPU</text>
        <rect x={350} y={36} width={26} height={64} rx={3} fill="#fff" stroke={dose >= DOSE_HBM - 1 ? "var(--accent)" : "var(--ink)"} strokeWidth={1.4} />
        <text x={363} y={72} textAnchor="middle" fontSize={11} fill="var(--ink)" fontFamily="ui-monospace, monospace">HBM</text>
        <text x={390} y={56} fontSize={15} fill="var(--soft)">memory, the most</text>
        <text x={390} y={82} fontSize={15} fill="var(--soft)">sensitive part</text>
        {/* dose scale */}
        <line x1={x(0)} y1={170} x2={x(DOSE_MAX)} y2={170} stroke="var(--rule-strong)" strokeWidth={10} strokeLinecap="round" />
        <line x1={x(0)} y1={170} x2={x(dose)} y2={170} stroke="var(--accent)" strokeWidth={10} strokeLinecap="round" />
        <line x1={x(DOSE_MISSION)} y1={152} x2={x(DOSE_MISSION)} y2={188} stroke="var(--ink)" strokeWidth={1.4} />
        <text x={x(DOSE_MISSION)} y={146} textAnchor="middle" fontSize={14} fill="var(--ink)" fontFamily="ui-monospace, monospace">750 rad</text>
        <text x={x(DOSE_MISSION)} y={204} textAnchor="middle" fontSize={14} fill="var(--soft)">5-year mission dose</text>
        <text x={x(DOSE_MISSION)} y={230} textAnchor="middle" fontSize={14} fill="var(--soft)">(expected, shielded)</text>
        <line x1={x(DOSE_HBM)} y1={152} x2={x(DOSE_HBM)} y2={188} stroke={dose >= DOSE_HBM - 1 ? "var(--accent)" : "var(--rule-strong)"} strokeWidth={1.4} />
        <text x={x(DOSE_HBM)} y={146} textAnchor="middle" fontSize={14} fill="var(--ink)" fontFamily="ui-monospace, monospace">2 krad</text>
        <text x={x(DOSE_HBM)} y={204} textAnchor="middle" fontSize={14} fill="var(--soft)">first irregularities</text>
      </svg>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="text-[34px] font-semibold leading-none tracking-[-0.04em] tabular-nums text-[var(--ink)]">{Math.round(dose).toLocaleString("en-US")}<span className="ml-1 text-[15px] font-medium text-[var(--muted)]">rad(Si)</span></span>
        <span className="font-serif text-[22px] italic text-[var(--accent)] transition-opacity duration-500" style={{ opacity: dose >= DOSE_HBM - 1 ? 1 : 0 }}>nearly 3× the mission dose</span>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="max-w-md text-[13.5px] leading-relaxed text-[var(--soft)]">On the ground, in the test reported in Google&apos;s 2025 paper. Radiation and heat tests in orbit are still to come.</span>
        <Button onClick={replay}>Fire the beam again</Button>
      </figcaption>
    </figure>
  );
}

/* ───────────── laser: 800 Gbps each way, 1.6 Tbps total, on a bench (lab test) ───────────── */

type Way = "one" | "both";

function Laser() {
  const { ref, t } = useClock();
  const [way, setWay] = useState<Way>("both");
  const total = way === "both" ? 1.6 : 0.8;
  const A = 110, B = 510, Y = 62;
  const pulses = Array.from({ length: 6 }, (_, i) => ((t * 0.55 + i / 6) % 1));
  return (
    <figure ref={ref} className="sc-plate p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Toggle label="Direction" value={way} onChange={setWay} options={[{ id: "one", label: "One way" }, { id: "both", label: "Both ways" }]} />
        <Tag>lab test · bench-scale</Tag>
      </div>
      <svg viewBox="0 0 620 150" className="mt-3 w-full" aria-label="Two transceivers on a bench linked by laser, with data pulses flowing between them">
        <line x1={A + 30} y1={Y - 8} x2={B - 30} y2={Y - 8} stroke="var(--accent)" strokeWidth={1.4} opacity={0.5} />
        <line x1={A + 30} y1={Y + 8} x2={B - 30} y2={Y + 8} stroke={way === "both" ? "var(--accent)" : "var(--rule-strong)"} strokeWidth={1.4} opacity={way === "both" ? 0.5 : 1} />
        {pulses.map((p, i) => (
          <circle key={`a${i}`} cx={A + 30 + (B - A - 60) * p} cy={Y - 8} r={3.2} fill="var(--accent)" />
        ))}
        {way === "both" && pulses.map((p, i) => (
          <circle key={`b${i}`} cx={B - 30 - (B - A - 60) * p} cy={Y + 8} r={3.2} fill="var(--accent)" />
        ))}
        {/* two transceivers on a bench (boxes with a lens), not satellites */}
        <line x1={20} y1={Y + 76} x2={600} y2={Y + 76} stroke="var(--ink)" strokeWidth={1.2} />
        {[{ x: A, d: 1 }, { x: B, d: -1 }].map((b) => (
          <g key={b.x}>
            <rect x={b.x - 30} y={Y - 20} width={60} height={40} rx={4} fill="#fff" stroke="var(--ink)" strokeWidth={1.4} />
            <circle cx={b.x + 30 * b.d} cy={Y} r={7} fill="#fff" stroke="var(--accent)" strokeWidth={1.6} />
            <line x1={b.x - 14} y1={Y + 20} x2={b.x - 14} y2={Y + 76} stroke="var(--ink)" strokeWidth={1.2} />
            <line x1={b.x + 14} y1={Y + 20} x2={b.x + 14} y2={Y + 76} stroke="var(--ink)" strokeWidth={1.2} />
          </g>
        ))}
        <text x={(A + B) / 2} y={Y - 24} textAnchor="middle" fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace">800 Gbps →</text>
        {way === "both" && <text x={(A + B) / 2} y={Y + 48} textAnchor="middle" fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace">← 800 Gbps</text>}
        <text x={A} y={Y + 46} textAnchor="middle" fontSize={14} fill="var(--muted)">transceiver</text>
        <text x={B} y={Y + 46} textAnchor="middle" fontSize={14} fill="var(--muted)">transceiver</text>
      </svg>
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-[40px] font-semibold leading-none tracking-[-0.05em] tabular-nums text-[var(--ink)]">{total.toFixed(1)}</span>
        <span className="font-serif text-[24px] italic text-[var(--accent)]">Tbps{way === "both" ? " total" : " one way"}</span>
      </div>
      <figcaption className="mt-4 text-[13.5px] leading-relaxed text-[var(--soft)]">
        One pair of transceivers on a bench, not two satellites. The satellites would talk by laser; Google plans to test that between two satellites in 2027.
      </figcaption>
    </figure>
  );
}

/* ───────────── cluster: 81 satellites in one tight formation (design) ───────────── */

const N = 81;
const GOLD = Math.PI * (3 - Math.sqrt(5));
// evenly spread inside a 1 km radius (drawn for this page; the paper's exact positions differ)
const HOME = Array.from({ length: N }, (_, i) => {
  const r = Math.sqrt((i + 0.5) / N);
  const a = i * GOLD;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
});
// where they start when scattered (fixed, so the server and the browser agree)
const AWAY = Array.from({ length: N }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const d = 1.2 + 0.7 * (((i * 37) % 23) / 23);
  return { x: Math.cos(a) * d * 1.4, y: Math.sin(a) * d * 0.66 };
});

function Cluster() {
  const { ref, t } = useClock();
  const [gathered, setGathered] = useState(true);
  const [flip, setFlip] = useState(0);
  const [since, setSince] = useState(0);
  const k = ease(ramp(t - since, 0, 1.6));
  const g = gathered ? k : 1 - k;
  const C = { x: 310, y: 140 }, S = 112; // 1 km = 112 px
  const toggle = () => { setGathered((v) => !v); setSince(t); setFlip((f) => f + 1); };
  return (
    <figure ref={ref} className="sc-plate p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-[40px] font-semibold leading-none tracking-[-0.05em] text-[var(--ink)]">81</span>
          <span className="font-serif text-[24px] italic text-[var(--accent)]">satellites</span>
        </div>
        <Tag>design · illustrative</Tag>
      </div>
      <svg viewBox="0 0 620 305" className="mt-2 w-full" aria-label="81 satellites gather into a cluster about two kilometres across">
        <circle cx={C.x} cy={C.y} r={S} fill="none" stroke="var(--ink)" strokeWidth={1} strokeDasharray="3 5" opacity={0.3 + 0.7 * g} />
        <line x1={C.x - S} y1={C.y + S + 22} x2={C.x + S} y2={C.y + S + 22} stroke="var(--ink)" strokeWidth={1} opacity={g} />
        <line x1={C.x - S} y1={C.y + S + 16} x2={C.x - S} y2={C.y + S + 28} stroke="var(--ink)" strokeWidth={1} opacity={g} />
        <line x1={C.x + S} y1={C.y + S + 16} x2={C.x + S} y2={C.y + S + 28} stroke="var(--ink)" strokeWidth={1} opacity={g} />
        <text x={C.x} y={C.y + S + 42} textAnchor="middle" fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace" opacity={g}>about 2 km across (radius 1 km)</text>
        {HOME.map((h, i) => {
          // neighbours drift closer and farther as they orbit together (~100–200 m apart in the paper)
          const wob = 0.06 * Math.sin(t * 0.9 + i * 0.7);
          const hx = h.x * (1 + wob), hy = h.y * (1 + wob);
          const a = AWAY[i];
          const x = C.x + S * (a.x + (hx - a.x) * g);
          const y = C.y + S * (a.y + (hy - a.y) * g);
          return <circle key={i} cx={x} cy={y} r={4} fill={g > 0.98 ? "var(--accent)" : "#fff"} stroke={g > 0.98 ? "var(--accent)" : "var(--ink)"} strokeWidth={1.2} />;
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <span className="max-w-md text-[13.5px] leading-relaxed text-[var(--soft)]">
          One illustrative layout from Google&apos;s 2025 paper: next-nearest neighbours swing between about 100 and 200 m apart. Dots placed for this drawing. Nothing like this is in orbit yet.
        </span>
        <Button onClick={toggle}>{gathered ? "Scatter" : "Gather"}</Button>
      </figcaption>
      <span className="sr-only" aria-live="polite">{flip > 0 ? (gathered ? "Gathered" : "Scattered") : ""}</span>
    </figure>
  );
}

/* ───────────── next: what's done, what's next ───────────── */

const STEPS: { when: string; what: string; done: boolean; detail: string }[] = [
  { when: "Oct 1, 2026", what: "Prototype launched", done: true, detail: "One prototype satellite, developed with Planet, on SpaceX's Transporter-18 rideshare." },
  { when: "After launch", what: "Commissioning", done: true, detail: "\"Powering up the host and TPU trays\" and \"successfully running early machine learning tests\"." },
  { when: "Week of Oct 26", what: "Hello World", done: true, detail: "Reported Oct 30, 2026: \"the first-ever AI response from a data center class TPU in orbit\": the haiku." },
  { when: "Next", what: "Heat and radiation tests in orbit", done: false, detail: "\"Tests to evaluate how TPUs perform under thermal stress and radiation exposure in orbit.\"" },
  { when: "2027", what: "Two linked satellites", done: false, detail: "\"Twin interconnected satellites\": Google plans to test the laser links there." },
];

function Next() {
  const { ref, t } = useTimeline(1.8);
  const [pick, setPick] = useState(2);
  const doneCount = STEPS.filter((s) => s.done).length;
  const drawn = ease(ramp(t, 0.1, 1.4));
  return (
    <figure ref={ref} className="sc-plate p-4 sm:p-6">
      <ol className="relative">
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--rule-strong)]" aria-hidden="true" />
        <span className="absolute left-[7px] top-2 w-[2px] -translate-x-[0.5px] bg-[var(--accent)]" style={{ height: `${drawn * ((doneCount - 0.5) / STEPS.length) * 100}%` }} aria-hidden="true" />
        {STEPS.map((s, i) => (
          <li key={s.what} className="relative pl-7">
            <button
              type="button"
              onClick={() => setPick(i)}
              aria-expanded={pick === i}
              className="sc-press flex w-full flex-wrap items-baseline gap-x-3 gap-y-0.5 rounded-lg py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              <span
                className="absolute left-0 top-[13px] size-[15px] rounded-full border-2 transition-colors"
                style={{ borderColor: s.done ? "var(--accent)" : "var(--rule-strong)", background: s.done && drawn > (i + 0.5) / STEPS.length ? "var(--accent)" : "#fff", borderStyle: s.done ? "solid" : "dashed" }}
              />
              <span className="w-[104px] shrink-0 font-mono text-[12px] text-[var(--muted)]">{s.when}</span>
              <span className={`text-[15px] font-medium ${s.done ? "text-[var(--ink)]" : "text-[var(--soft)]"}`}>{s.what}</span>
              {s.done && <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">done</span>}
            </button>
            {pick === i && <p className="-mt-0.5 mb-2 max-w-md pl-[116px] text-[13.5px] leading-relaxed text-[var(--soft)] max-sm:pl-0">{s.detail}</p>}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 text-[13.5px] leading-relaxed text-[var(--soft)]">Orange is done, dashed is still ahead. Tap a step for Google&apos;s own words.</figcaption>
    </figure>
  );
}

const SC_CSS = `
.sc{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#e0552f}
.sc-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.sc-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.sc-press:active{transform:scale(.96)}
@keyframes sc-blink{50%{opacity:0}}
.sc-caret{animation:sc-blink 1s steps(1) infinite}
@keyframes sc-flow{to{stroke-dashoffset:-24}}
.sc-dash{stroke-dasharray:6 6;animation:sc-flow .8s linear infinite}
@keyframes sc-flow-fast{to{stroke-dashoffset:-36}}
.sc-dash-fast{animation:sc-flow-fast .35s linear infinite}
@media (max-width:640px){.sc svg text{font-size:21px}}
@media (prefers-reduced-motion:reduce){.sc-caret,.sc-dash,.sc-dash-fast{animation:none}}
`;

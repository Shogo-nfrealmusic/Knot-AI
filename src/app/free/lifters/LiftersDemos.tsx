"use client";

// /free/54 (Lifters Club, the free gym app I built): one small live figure per chapter, drawn for this site rather than
// cut from the reel. Same language as /free/46–53 and /free/starter: paper plate, ink lines, one orange accent, nothing
// plays off screen. Every number is from the app's demo account (fictional client Alex Morgan, coach Sam Lee): the 582
// exercises, last time's squat sets and today's personal best, the 12 estimated 1-rep maxes read off the app's own chart,
// the coach's review and note, and the real propose_plan / save_plan output of the Lifters Club MCP server.
// The lifter is a stick figure posed in 3D here; the app's own 3D clips are not shown.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type LiftersDemoKind = "library" | "log" | "progress" | "coach" | "claude";

export function LiftersDemo({ kind }: { kind: LiftersDemoKind }) {
  return (
    <div className="lc mt-5 max-w-2xl">
      <style>{LC_CSS}</style>
      {kind === "library" && <Library />}
      {kind === "log" && <Log />}
      {kind === "progress" && <Progress />}
      {kind === "coach" && <Coach />}
      {kind === "claude" && <ClaudePlan />}
    </div>
  );
}

/** a clock that runs only while the figure is on screen; frozen with reduced motion */
function useClock(paused = false) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!visible || reduce || paused) return;
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
  }, [visible, reduce, paused]);
  return { ref, t, reduce: !!reduce };
}

const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const ease = (x: number) => 1 - (1 - x) ** 3;
const e1rm = (w: number, r: number) => w * (1 + r / 30);

function Button({ onClick, children, primary, disabled }: { onClick: () => void; children: React.ReactNode; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`lc-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
    >
      {children}
    </button>
  );
}

function Toggle<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`lc-press whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium sm:px-3 sm:text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ───────────── library: 582 exercises; pick a lift, it plays, drag to turn it around ───────────── */
type LiftId = "squat" | "deadlift" | "press";
const LIFTS: { id: LiftId; label: string; works: string }[] = [
  { id: "squat", label: "Barbell Squat", works: "quads and glutes" },
  { id: "deadlift", label: "Barbell Deadlift", works: "glutes, hamstrings and back" },
  { id: "press", label: "Barbell Overhead Press", works: "shoulders and triceps" },
];
type V3 = [number, number, number]; // x forward, y up, z to the side (metres)
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const along = (a: V3, len: number, ang: number, back = false): V3 => [a[0] + (back ? -1 : 1) * len * Math.sin(ang), a[1] + len * Math.cos(ang), a[2]];

/** the lifter's joints at depth d (0 = standing, 1 = bottom of the rep), one side at z = side */
function pose(lift: LiftId, d: number, side: number) {
  const k = lift === "squat" ? { shin: 0.62, thigh: 1.5, lean: 0.62 } : lift === "deadlift" ? { shin: 0.32, thigh: 1.25, lean: 1.25 } : { shin: 0, thigh: 0, lean: 0 };
  const ankle: V3 = [0, 0.06, side * 0.14];
  const knee = along(ankle, 0.46, k.shin * d);
  const hip = along(knee, 0.46, k.thigh * d, true);
  const shoulder = along(hip, 0.56, k.lean * d);
  const neck = along(hip, 0.62, k.lean * d);
  const head = along(hip, 0.74, k.lean * d);
  let elbow: V3, hand: V3;
  if (lift === "squat") {
    hand = add(shoulder, [-0.06, 0.03, side * 0.24]);
    elbow = add(shoulder, [-0.2, -0.12, side * 0.18]);
  } else if (lift === "deadlift") {
    elbow = add(shoulder, [0, -0.3, side * 0.06]);
    hand = add(shoulder, [0, -0.6, side * 0.08]);
  } else {
    const up = 1 - d; // the press goes up as d falls
    hand = add(shoulder, [0.06 - 0.08 * up, 0.02 + 0.6 * up, side * 0.24]);
    elbow = add(shoulder, [0.13 - 0.12 * up, -0.2 + 0.5 * up, side * 0.3]);
  }
  return { ankle, knee, hip, shoulder, neck, head, elbow, hand, toe: add(ankle, [0.2, -0.05, 0]) as V3 };
}
function Library() {
  const [lift, setLift] = useState<LiftId>("squat");
  const [playing, setPlaying] = useState(true);
  const { ref: introRef, t: introT } = useClock(); // the 582 count runs on its own clock, so Pause never freezes it half way
  const { ref, t, reduce } = useClock(!playing);
  const [yaw, setYaw] = useState(-0.9);
  const drag = useRef<{ x: number; yaw: number } | null>(null);
  const grid = reduce ? 1 : ease(ramp(introT, 0, 1.4));
  const count = Math.round(582 * grid);
  const phase = reduce ? 0.5 : (t % 2.6) / 2.6;
  const d = lift === "press" ? (1 + Math.cos(2 * Math.PI * phase)) / 2 : (1 - Math.cos(2 * Math.PI * phase)) / 2;
  // project: turn around the vertical axis, then orthographic; depth decides drawing order
  const cx = 230, cy = 262, S = 150;
  const P = (v: V3) => ({ x: cx + S * (v[0] * Math.cos(yaw) + v[2] * Math.sin(yaw)), y: cy - S * v[1], z: -v[0] * Math.sin(yaw) + v[2] * Math.cos(yaw) });
  const L = pose(lift, d, -1), R = pose(lift, d, 1);
  const work: Record<LiftId, string[]> = { squat: ["thigh"], deadlift: ["thigh", "torso"], press: ["upper", "fore"] };
  type Seg = { a: V3; b: V3; w: number; part: string };
  const segs: Seg[] = [];
  for (const s of [L, R]) {
    segs.push({ a: s.toe, b: s.ankle, w: 5, part: "foot" }, { a: s.ankle, b: s.knee, w: 7, part: "shin" }, { a: s.knee, b: s.hip, w: 9, part: "thigh" });
    segs.push({ a: s.shoulder, b: s.elbow, w: 6, part: "upper" }, { a: s.elbow, b: s.hand, w: 5, part: "fore" });
  }
  const midHip: V3 = [L.hip[0], L.hip[1], 0], midSh: V3 = [L.shoulder[0], L.shoulder[1], 0];
  segs.push({ a: L.hip, b: R.hip, w: 8, part: "pelvis" }, { a: midHip, b: midSh, w: 13, part: "torso" }, { a: L.shoulder, b: R.shoulder, w: 8, part: "torso" }, { a: midSh, b: [L.neck[0], L.neck[1], 0], w: 5, part: "neck" });
  const barL: V3 = [L.hand[0], L.hand[1], -0.62], barR: V3 = [R.hand[0], R.hand[1], 0.62];
  const items = [
    ...segs.map((s) => ({ z: (P(s.a).z + P(s.b).z) / 2, el: s })),
    { z: P(barL).z - 0.01, el: { plate: barL } },
    { z: P(barR).z - 0.01, el: { plate: barR } },
    { z: 0.0, el: { bar: true } },
  ].sort((a, b) => a.z - b.z);
  const head = P([L.head[0], L.head[1], 0]);
  const floor = [-0.6, -0.3, 0, 0.3, 0.6];
  const onDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, yaw }; (e.target as Element).setPointerCapture?.(e.pointerId); };
  const onMove = (e: React.PointerEvent) => { if (drag.current) setYaw(drag.current.yaw + (e.clientX - drag.current.x) / 90); };
  const sel = LIFTS.find((l) => l.id === lift)!;
  return (
    <figure ref={ref} className="lc-plate p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_1.35fr]">
        <div ref={introRef}>
          <div className="flex items-baseline gap-2 font-mono text-[13px] text-[var(--soft)]">
            <span className="text-[28px] font-semibold tabular-nums text-[var(--ink)]">{count}</span>exercises
          </div>
          <svg viewBox="0 0 210 72" className="mt-2 w-full" aria-label="582 dots, one for each exercise in the library">
            {Array.from({ length: 582 }, (_, i) => {
              const on = i / 582 < grid;
              return <circle key={i} cx={3 + (i % 42) * 4.95} cy={3 + Math.floor(i / 42) * 4.95} r={1.55} fill={on ? "var(--ink)" : "var(--rule)"} opacity={on ? 0.75 : 1} />;
            })}
          </svg>
          <p className="mt-2 font-mono text-[11.5px] text-[var(--muted)]">1 dot = 1 exercise, each with its own 3D clip</p>
          <div className="mt-4 grid gap-1.5">
            {LIFTS.map((l) => (
              <button key={l.id} type="button" onClick={() => setLift(l.id)} aria-pressed={lift === l.id} className={`lc-card lc-press text-left ${lift === l.id ? "border-[var(--accent)] text-[var(--ink)]" : "text-[var(--soft)] hover:border-[var(--ink)]"}`}>
                <span className={lift === l.id ? "mr-1.5 text-[var(--accent)]" : "mr-1.5 text-[var(--muted)]"}>▶</span>{l.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <svg viewBox="0 0 460 300" className="w-full touch-none select-none rounded-xl bg-white shadow-[0_0_0_1px_var(--rule)]" style={{ cursor: "grab" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)} role="img" aria-label={`${sel.label}, drawn as a figure; drag to turn it around`}>
            {floor.map((f) => { const a = P([f, 0, -0.7]), b = P([f, 0, 0.7]); return <line key={`x${f}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--rule)" strokeWidth={1} />; })}
            {floor.map((f) => { const a = P([-0.6, 0, f]), b = P([0.6, 0, f]); return <line key={`z${f}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--rule)" strokeWidth={1} />; })}
            {items.map((it, i) => {
              const el = it.el as { a?: V3; b?: V3; w?: number; part?: string; plate?: V3; bar?: boolean };
              if (el.plate) {
                const c = P(el.plate);
                return <ellipse key={i} cx={c.x} cy={c.y} rx={Math.max(2, 33 * Math.abs(Math.cos(yaw)))} ry={33} fill="#fff" stroke="var(--ink)" strokeWidth={2.2} />;
              }
              if (el.bar) {
                const a = P(barL), b = P(barR);
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--ink)" strokeWidth={3.5} strokeLinecap="round" />;
              }
              const a = P(el.a!), b = P(el.b!);
              const hot = work[lift].includes(el.part!);
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={hot ? "var(--accent)" : "var(--ink)"} strokeWidth={el.w} strokeLinecap="round" />;
            })}
            <circle cx={head.x} cy={head.y} r={15} fill="var(--ink)" />
          </svg>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Button primary onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play"}</Button>
            <label className="flex items-center gap-2 font-mono text-[12px] text-[var(--soft)]">
              turn
              <input type="range" min={-314} max={314} value={Math.round(yaw * 100)} onChange={(e) => setYaw(Number(e.target.value) / 100)} className="accent-[var(--accent)]" aria-label="Turn the lifter around" />
            </label>
          </div>
          <p className="mt-2 text-[12.5px] text-[var(--soft)]"><span className="text-[var(--accent)]">Orange</span>: the {sel.works} doing the work.</p>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Pick a lift and drag the figure to see it from any side. In the app, each of the 582 exercises has a licensed 3D clip of the whole movement with the working muscles in red; this is a stick figure drawn for this page.</figcaption>
    </figure>
  );
}

/* ───────────── log: last time is already there; beat it ───────────── */
const LAST = [{ w: 100, r: 9 }, { w: 100, r: 8 }, { w: 100, r: 8 }];
const BEST_E1RM = e1rm(100, 9); // 130 kg, the top of the chart on Wed 4 Nov
function Log() {
  const { ref, t } = useClock();
  const [w, setW] = useState(100);
  const [r, setR] = useState(9);
  const [logged, setLogged] = useState<{ w: number; r: number; t0: number } | null>(null);
  const rest = logged ? Math.max(0, 150 - (t - logged.t0)) : 150;
  const pb = logged ? [logged.w > 100 && "Heaviest weight yet", e1rm(logged.w, logged.r) > BEST_E1RM + 1e-9 && "highest estimated 1-rep max", logged.r >= 8 && logged.w > 100 && "heaviest for 8+ reps"].filter(Boolean) as string[] : [];
  const pop = logged ? ease(ramp(t - logged.t0, 0, 0.35)) : 0;
  const step = (fn: () => void) => () => { fn(); setLogged(null); };
  return (
    <figure ref={ref} className="lc-plate p-4 sm:p-6">
      <div className="relative">
        {logged && pb.length > 0 && (
          <div className="mb-3 rounded-2xl bg-[var(--accent)] px-4 py-3 text-white" style={{ opacity: pop, transform: `translateY(${(1 - pop) * -8}px)` }}>
            <div className="text-[15px] font-semibold">New personal best: {logged.w} kg × {logged.r}</div>
            <div className="mt-0.5 text-[12.5px] text-white/90">{pb.join(", ").replace(/^./, (c) => c.toUpperCase())}</div>
          </div>
        )}
        <div className="text-[19px] font-semibold text-[var(--ink)]">Barbell Squat</div>
        <div className="mt-1 text-[13px] text-[var(--soft)]">Last time <span className="font-mono text-[var(--ink)]">{LAST.map((s) => `${s.w}×${s.r}`).join(", ")}</span> · 6–10 reps · 2:30 rest</div>
        <div className="mt-3 grid gap-2">
          {[
            { label: "Weight (kg)", v: w, dec: () => setW((x) => Math.max(20, x - 2.5)), inc: () => setW((x) => x + 2.5), show: w % 1 ? w.toFixed(1) : String(w) },
            { label: "Reps", v: r, dec: () => setR((x) => Math.max(1, x - 1)), inc: () => setR((x) => Math.min(20, x + 1)), show: String(r) },
          ].map((row) => (
            <div key={row.label} className="flex items-center rounded-2xl bg-white px-3 py-2 shadow-[0_0_0_1px_var(--rule)]">
              <span className="w-24 text-[13px] text-[var(--soft)]">{row.label}</span>
              <button type="button" onClick={step(row.dec)} aria-label={`less ${row.label}`} className="lc-press h-9 w-9 rounded-full bg-[var(--page)] text-[18px] text-[var(--ink)]">−</button>
              <span className="flex-1 text-center text-[28px] font-semibold tabular-nums text-[var(--ink)]">{row.show}</span>
              <button type="button" onClick={step(row.inc)} aria-label={`more ${row.label}`} className="lc-press h-9 w-9 rounded-full bg-[var(--page)] text-[18px] text-[var(--ink)]">+</button>
            </div>
          ))}
        </div>
        <div className="mt-2 font-mono text-[12px] text-[var(--soft)]">
          estimated 1-rep max <span className={`tabular-nums ${e1rm(w, r) > BEST_E1RM + 1e-9 ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>{e1rm(w, r).toFixed(1)} kg</span> · best so far {BEST_E1RM.toFixed(1)} kg
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Button primary onClick={() => setLogged({ w, r, t0: t })}>Log set</Button>
          {!logged && w === 100 && r === 9 && <span className="font-mono text-[12px] text-[var(--soft)]">Try 105 kg × 9, the set Alex logged.</span>}
          {logged && pb.length === 0 && <span className="lc-in font-mono text-[12px] text-[var(--soft)]">Logged {logged.w} kg × {logged.r}. Not a record this time.</span>}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-full bg-[var(--ink)] px-4 py-2 text-white" style={{ opacity: logged ? 1 : 0.35 }}>
          <span className="text-[13px]">Rest</span>
          <span className="font-mono text-[20px] font-semibold tabular-nums">{Math.floor(rest / 60)}:{String(Math.floor(rest % 60)).padStart(2, "0")}</span>
          <button type="button" onClick={() => setLogged(null)} className="text-[12.5px] text-white/70 hover:text-white">{logged ? "Skip rest" : "waiting"}</button>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The real numbers from the demo account: last time 100×9, 100×8, 100×8, then 105 kg × 9 for a new personal best and a 2:30 rest. The 1-rep max is worked out like the app explains it (60 kg × 8 is about 76 kg, so 100 × 9 is 130 kg). The +/− steps here are 2.5 kg.</figcaption>
    </figure>
  );
}

/* ───────────── progress: 12 squat sessions, 26 Sept → 4 Nov (read off the app's "Strength over time" chart) ───────────── */
const SQUAT = [93.3, 97.5, 100.0, 104.1, 106.6, 110.5, 113.4, 117.0, 120.0, 123.5, 126.6, 130.0];
function Progress() {
  const { ref, t } = useClock();
  const [hover, setHover] = useState<number | null>(null);
  const [today, setToday] = useState(false);
  const draw = ease(ramp(t, 0.1, 1.8));
  const pts = today ? [...SQUAT, e1rm(105, 9)] : SQUAT;
  const n = 13; // keep the x scale fixed so the line doesn't jump
  const X = (i: number) => 50 + (i * 560) / (n - 1), Y = (v: number) => 230 - ((v - 90) / (140 - 90)) * 200;
  const shown = Math.max(1, Math.round(SQUAT.length * draw));
  const path = SQUAT.slice(0, shown).map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
  const h = hover ?? (draw >= 1 ? SQUAT.length - 1 : shown - 1);
  const pick = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * 640;
    setHover(Math.max(0, Math.min(pts.length - 1, Math.round(((x - 50) / 560) * (n - 1)))));
  };
  return (
    <figure ref={ref} className="lc-plate p-4 sm:p-6">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[16px] font-semibold text-[var(--ink)]">Barbell Squat · estimated 1-rep max</span>
        <span className="font-mono text-[13px] text-[var(--soft)]">{h === 12 ? "today" : `session ${h + 1} of 12`}: <span className="text-[18px] font-semibold tabular-nums text-[var(--ink)]">{pts[h].toFixed(1)} kg</span></span>
      </div>
      <svg viewBox="0 0 640 262" className="w-full touch-none" onPointerMove={pick} onPointerDown={pick} onPointerLeave={() => setHover(null)} aria-label="Barbell Squat estimated 1-rep max over 12 sessions, from 93.3 kg on 26 Sept to 130 kg on 4 Nov">
        {[100, 115, 130].map((v) => (
          <g key={v}>
            <line x1={50} x2={610} y1={Y(v)} y2={Y(v)} stroke="var(--rule)" />
            <text x={42} y={Y(v) + 4} textAnchor="end" fontSize={12} fill="var(--muted)" fontFamily="ui-monospace, monospace">{v}</text>
          </g>
        ))}
        <path d={path} fill="none" stroke="var(--ink)" strokeWidth={2.4} strokeLinejoin="round" />
        {SQUAT.slice(0, shown).map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r={i === h ? 6 : 3} fill={i === h ? "var(--accent)" : "var(--ink)"} />)}
        {today && (
          <g className="lc-in">
            <line x1={X(11)} y1={Y(130)} x2={X(12)} y2={Y(pts[12])} stroke="var(--accent)" strokeWidth={2.4} strokeDasharray="5 5" />
            <circle cx={X(12)} cy={Y(pts[12])} r={h === 12 ? 7 : 5} fill="var(--accent)" />
            <text x={X(12) - 8} y={Y(pts[12]) - 12} textAnchor="end" fontSize={12} fill="var(--accent)" fontFamily="ui-monospace, monospace">105 × 9</text>
          </g>
        )}
        <line x1={X(h)} x2={X(h)} y1={20} y2={232} stroke="var(--accent)" strokeWidth={1} opacity={0.5} />
        <text x={50} y={254} fontSize={12} fill="var(--soft)" fontFamily="ui-monospace, monospace">26 Sept</text>
        <text x={X(11)} y={254} textAnchor="middle" fontSize={12} fill="var(--soft)" fontFamily="ui-monospace, monospace">4 Nov</text>
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <Button primary={!today} onClick={() => setToday((v) => !v)}>{today ? "Remove today's set" : "Add today's set: 105 × 9"}</Button>
        <span className="font-mono text-[12px] text-[var(--soft)]">+{(130 - 93.3).toFixed(1)} kg in 12 sessions</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Drag across the chart. The 12 points are the demo account&apos;s squat, read off the app&apos;s own &ldquo;Strength over time&rdquo; chart (26 Sept to Wed 4 Nov). The dashed point is worked out the same way from the 105 × 9 in the chapter above.</figcaption>
    </figure>
  );
}

/* ───────────── coach: every set in one place; a target or a plan change lands on the client's phone ───────────── */
type CoachAct = "target" | "plan";
function Coach() {
  const { ref, t } = useClock();
  const [act, setAct] = useState<CoachAct>("target");
  const [sent, setSent] = useState<{ act: CoachAct; t0: number } | null>(null);
  const s = sent ? t - sent.t0 : 0;
  const fly = ease(ramp(s, 0, 0.7));
  const landed = sent !== null && s > 0.7;
  return (
    <figure ref={ref} className="lc-plate p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-white p-3 shadow-[0_0_0_1px_var(--rule)]">
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--soft)]">Coach · Sam Lee</div>
          <div className="mt-2 text-[12.5px] text-[var(--muted)]">Alex Morgan: review · Wed 4 Nov</div>
          <div className="flex items-baseline justify-between"><span className="text-[17px] font-semibold text-[var(--ink)]">Full body C</span><span className="font-mono text-[12px] text-[var(--soft)]">18 sets</span></div>
          <div className="mt-2 text-[13px] font-medium text-[var(--ink)]">Barbell Squat</div>
          <div className="mt-1 flex flex-wrap gap-1.5">{LAST.map((x, i) => <span key={i} className="rounded-full bg-[var(--page)] px-2.5 py-1 font-mono text-[12px] text-[var(--ink)]">{x.w} kg × {x.r}</span>)}</div>
          <div className="mt-3"><Toggle label="What to send" value={act} onChange={(v) => { setAct(v); setSent(null); }} options={[{ id: "target", label: "Set a target" }, { id: "plan", label: "Change the plan" }]} /></div>
          <div className="mt-2 min-h-[64px] rounded-xl border border-dashed border-[var(--rule-strong)] p-2.5 text-[13px] text-[var(--ink)]" style={{ opacity: 1 - 0.6 * fly }}>
            {act === "target" ? (
              <div className="font-mono text-[12.5px]">105 kg · 6–10 reps<br /><span className="text-[var(--soft)]">&ldquo;Pause 1 s at the bottom&rdquo;</span></div>
            ) : (
              <div>+1 set of Barbell Squat<br /><span className="text-[var(--soft)]">&ldquo;One more set of Barbell Squat: you&apos;ve been near the top of the range every week.&rdquo;</span></div>
            )}
          </div>
          <div className="mt-3"><Button primary onClick={() => setSent({ act, t0: t })}>{act === "target" ? "Save targets" : "Save the plan"}</Button></div>
        </div>
        <div className="relative flex justify-center">
          <div className="relative w-[200px] rounded-[30px] border-[1.5px] border-[var(--ink)] bg-[var(--page)] px-3 pb-6 pt-7">
            <div className="absolute left-1/2 top-2.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[var(--ink)]" />
            <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--soft)]">Alex&apos;s phone</div>
            {landed && sent!.act === "plan" && (
              <div className="lc-in mt-2 rounded-xl bg-white p-2.5 shadow-[0_0_0_1px_var(--rule)]">
                <div className="text-[11.5px] font-semibold text-[var(--soft)]">Why your plan changed</div>
                <div className="mt-1 text-[12.5px] leading-snug text-[var(--ink)]">One more set of Barbell Squat: you&apos;ve been near the top of the range every week.</div>
                <div className="mt-1 text-[11px] text-[var(--muted)]">Sam Lee, 5 Nov</div>
              </div>
            )}
            {landed && sent!.act === "target" && (
              <div className="lc-in mt-2 rounded-xl bg-white p-2.5 shadow-[0_0_0_1px_var(--rule)]">
                <div className="text-[11.5px] font-semibold text-[var(--soft)]">Barbell Squat · from your coach</div>
                <div className="mt-1 font-mono text-[13px] text-[var(--ink)]">105 kg · 6–10 reps</div>
                <div className="mt-0.5 text-[12px] text-[var(--soft)]">Pause 1 s at the bottom</div>
              </div>
            )}
            <div className="mt-2 rounded-xl border-[1.5px] border-[var(--ink)] bg-white p-2.5">
              <div className="text-[11px] font-semibold text-[var(--accent)]">Up next</div>
              <div className="text-[13px] font-semibold text-[var(--ink)]">Full body A</div>
              <div className="text-[11px] leading-snug text-[var(--soft)]">Barbell Squat, Barbell Bench Press, Pull Ups…</div>
            </div>
            {!landed && <div className="mt-2 text-[11.5px] text-[var(--muted)]">{sent ? "sending…" : "Nothing new yet."}</div>}
          </div>
          {sent && !landed && <span className="absolute left-0 top-1/2 h-3 w-3 rounded-full bg-[var(--accent)]" style={{ transform: `translate(${-60 + fly * 150}px, ${-40 * Math.sin(Math.PI * fly)}px)` }} />}
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Pick what to send and save it. The session, the sets, the target and the note are the demo account&apos;s real ones (coach Sam Lee, client Alex Morgan, both fictional); the client sees the note as &ldquo;Why your plan changed&rdquo;. The phone is drawn for this page.</figcaption>
    </figure>
  );
}

/* ───────────── claude: propose → diff → OK → saved (the real MCP output) ───────────── */
const DIFF: { day: string; add: string[]; drop: string[] }[] = [
  { day: "Day 1 · Full body A", add: ["Leg Press", "Lat Pulldown", "Chest Press"], drop: ["Barbell Squat", "Barbell Bench Press", "Pull Ups", "Barbell Deadlift", "Seated Leg Curl", "Machine Lateral Raise", "Station 3 low row"] },
  { day: "Day 2 · Full body B", add: ["Dumbbell Romanian Deadlift", "Seated Cable Row", "Shoulder Press"], drop: ["Barbell Romanian Deadlift", "Barbell Bent Over Row", "Barbell Incline Bench Press", "Front Squat", "Leg Extension", "Rear Delt Machine"] },
  { day: "Day 3 · Full body C", add: ["Goblet Squat", "Lat Pulldown", "Treadmill Run"], drop: ["Barbell Squat", "Pull Ups", "Barbell Bench Press", "Dumbbell Rear Lunge", "Lying Leg Curl", "Cable Lateral Raise"] },
];
const STEPS = [
  { tool: "propose_plan", who: "Claude", line: "saved: false · diff.changed: true (3 days)" },
  { tool: "you", who: "You", line: "OK" },
  { tool: "save_plan", who: "Claude", line: "saved: true · versionId a0996dd7…" },
];
function ClaudePlan() {
  const { ref, t } = useClock();
  const [step, setStep] = useState(0); // 0 = nothing yet, 1..3 = STEPS shown
  const [t0, setT0] = useState(0);
  const [day, setDay] = useState(0);
  const s = t - t0;
  const go = () => { setStep((v) => (v >= 3 ? 0 : v + 1)); setT0(t); };
  const rows = [...DIFF[day].add.map((x) => ({ x, add: true })), ...DIFF[day].drop.map((x) => ({ x, add: false }))];
  return (
    <figure ref={ref} className="lc-plate p-4 sm:p-6">
      <div className="rounded-xl bg-[#15171a] p-4 font-mono text-[12.5px] leading-relaxed text-[#e7e7ea]">
        <div className="text-[#868b92]">lifters-club · MCP · Alex Morgan&apos;s plan</div>
        {STEPS.slice(0, step).map((st, i) => (
          <div key={i} className="lc-in mt-1">
            {st.who === "You" ? <span className="text-[#ffb59e]">&gt; {st.line}</span> : <span><span className="text-[#a6e3a1]">● {st.tool}</span> <span className="text-[#c9ccd1]">{st.line}</span></span>}
          </div>
        ))}
        {step === 0 && <div className="mt-1 text-[#868b92]">press &ldquo;Next step&rdquo;</div>}
      </div>
      <div className="mt-3 rounded-xl bg-white p-3 shadow-[0_0_0_1px_var(--rule)]" style={{ opacity: step >= 1 ? 1 : 0.35 }}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <Toggle label="Day" value={String(day)} onChange={(v) => { setDay(Number(v)); setT0(t - 5); }} options={DIFF.map((d, i) => ({ id: String(i), label: `Day ${i + 1}` }))} />
          <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${step >= 3 ? "bg-[var(--accent)] text-white" : "border border-[var(--rule-strong)] text-[var(--soft)]"}`}>{step >= 3 ? "saved" : step === 2 ? "approved" : "not saved"}</span>
        </div>
        <div className="text-[13px] font-semibold text-[var(--ink)]">{DIFF[day].day}</div>
        <ul className="mt-1.5 gap-x-6 space-y-0.5 sm:columns-2">
          {rows.map((r, i) => {
            const k = step >= 1 ? ease(ramp(step === 1 ? s : 5, 0.1 + i * 0.07, 0.4 + i * 0.07)) : 0;
            return (
              <li key={r.x + i} className="font-mono text-[12.5px]" style={{ opacity: Math.max(0.15, k), transform: `translateX(${(1 - k) * 8}px)` }}>
                <span className={r.add ? "text-[var(--accent)]" : "text-[var(--muted)]"}>{r.add ? "+ " : "− "}</span>
                <span className={r.add ? "text-[var(--ink)]" : "text-[var(--muted)] line-through"}>{r.x}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button primary onClick={go}>{step >= 3 ? "Start over" : step === 1 ? "Say OK" : "Next step"}</Button>
        <span className="font-mono text-[12px] text-[var(--soft)]">{step === 1 ? "Nothing is saved until you say OK." : step === 3 ? "On Alex's phone: the new plan." : "propose_plan → your OK → save_plan"}</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The real diff from the demo account, as the Lifters Club MCP server returned it to Claude Code: propose_plan checks the new plan and saves nothing; save_plan stores it as a new version only after the OK. Every day: three exercises in, the rest out.</figcaption>
    </figure>
  );
}

const LC_CSS = `
.lc{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#e0552f}
.lc-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.lc-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:8px 12px;font-size:13.5px;line-height:1.35}
.lc-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.lc-press:active{transform:scale(.96)}
@keyframes lc-in{from{opacity:0;transform:translateY(-4px)}}
.lc-in{animation:lc-in .3s ease-out}
@media (prefers-reduced-motion:reduce){.lc-in{animation:none}}
`;

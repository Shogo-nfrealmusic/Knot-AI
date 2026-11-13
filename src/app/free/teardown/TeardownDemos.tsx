"use client";

// /free/64 (teardown, the Claude Code skill): two small live figures, drawn for this site rather than cut from the reel.
// Same language as /free/46–61: paper plate, ink lines, one accent (orange).
// Both figures show the idea the skill is built on: ONE input drives every part and every number.
// Real: the rack-and-pinion numbers (32 teeth, module 4 mm, 201 mm of travel, 180°) are the worked example in the
// skill author's write-up. The slider-crank uses example dimensions (90 mm stroke, 145 mm rod) and the textbook formula.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type TeardownDemoKind = "crank" | "rack";

const SRC = {
  repo: "https://github.com/elvarofficial/teardown",
  article: "https://x.com/elvar_official/status/2116174609355571402",
};

export function TeardownDemo({ kind }: { kind: TeardownDemoKind }) {
  return (
    <div className="td mt-5 max-w-2xl">
      <style>{TD_CSS}</style>
      {kind === "crank" && <Crank />}
      {kind === "rack" && <Rack />}
    </div>
  );
}

/** a clock that runs only while the figure is on screen; frozen with reduced motion */
function useClock() {
  const ref = useRef<HTMLElement>(null);
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
  return { ref, t, reduce: !!reduce };
}

function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/02</span>
        <span className="truncate text-[15px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block truncate font-mono text-[11.5px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

function Sources({ links }: { links: { text: string; href: string }[] }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      {links.map((l, i) => (
        <span key={l.href}>
          {i ? " · " : ""}
          <a href={l.href} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)]">
            {l.text}
          </a>
        </span>
      ))}
    </p>
  );
}

function Readout({ label, value, hot }: { label: string; value: string; hot?: boolean }) {
  return (
    <div className="td-card min-w-0">
      <span className="block truncate font-mono text-[10.5px] text-[var(--muted)]">{label}</span>
      <span className={`mt-0.5 block text-[18px] font-semibold tabular-nums ${hot ? "text-[var(--accent)]" : "text-[var(--ink)]"}`}>{value}</span>
    </div>
  );
}

/** auto-runs until the reader touches the slider; "Run" hands it back */
function useDriven(auto: (t: number) => number, initial: number) {
  const { ref, t, reduce } = useClock();
  const [manual, setManual] = useState<number | null>(reduce ? initial : null);
  const value = manual ?? auto(t);
  return { ref, value, manual: manual !== null, set: (v: number) => setManual(v), run: () => setManual(null), reduce };
}

// ───────── 1 · slider-crank: one angle poses the crank, the rod, the piston and all three numbers ─────────
const R = 45; // crank radius, mm (90 mm stroke)
const L = 145; // connecting rod, mm
const pistonFromTdc = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return R * (1 - Math.cos(a)) + L - Math.sqrt(L * L - R * R * Math.sin(a) ** 2);
};

function Crank() {
  const { ref, value: deg, manual, set, run, reduce } = useDriven((t) => (t * 90) % 360, 60);
  const a = (deg * Math.PI) / 180;
  const s = pistonFromTdc(deg);
  // drawing: crank centre at (110, 150); the cylinder runs to the right; 1 mm = 1.1 px
  const k = 1.1;
  const cx = 110;
  const cy = 150;
  const px = cx + R * k * Math.cos(a);
  const py = cy - R * k * Math.sin(a);
  const pistonX = cx + (R + L - s) * k; // wrist pin
  const stroke = deg % 360 < 180 ? "Going down" : "Coming up";
  return (
    <figure ref={ref} className="td-plate p-4 sm:p-6">
      <Plate n={1} title="One input drives everything" sub="drag the crank angle · every part and number follows" />
      <svg viewBox="0 0 420 240" className="w-full" role="img" aria-label={`Slider-crank at ${Math.round(deg)} degrees, piston ${s.toFixed(1)} millimetres below top dead centre`}>
        {/* cylinder */}
        <rect x={cx + (L - R) * k - 6} y={cy - 34} width={2 * R * k + 62} height={68} rx={6} fill="#fff" stroke="var(--rule-strong)" strokeWidth={1.5} />
        <line x1={cx + (L + R) * k + 26} y1={cy - 44} x2={cx + (L + R) * k + 26} y2={cy + 44} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 3" />
        <text x={cx + (L + R) * k + 26} y={cy - 50} textAnchor="middle" className="td-label">TDC</text>
        {/* crank circle + crank arm */}
        <circle cx={cx} cy={cy} r={R * k} fill="none" stroke="var(--rule-strong)" strokeWidth={1.5} strokeDasharray="4 4" />
        <line x1={cx} y1={cy} x2={px} y2={py} stroke="var(--ink)" strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={7} fill="var(--ink)" />
        {/* connecting rod */}
        <line x1={px} y1={py} x2={pistonX} y2={cy} stroke="var(--soft)" strokeWidth={5} strokeLinecap="round" />
        <circle cx={px} cy={py} r={6} fill="var(--accent)" />
        {/* piston: the part doing the work takes the accent */}
        <rect x={pistonX - 4} y={cy - 30} width={50} height={60} rx={5} fill="var(--accent)" />
        <circle cx={pistonX} cy={cy} r={5} fill="#fff" />
        {/* the travel ruler */}
        <line x1={cx + (L - R) * k + 21} y1={cy + 56} x2={cx + (L + R) * k + 21} y2={cy + 56} stroke="var(--muted)" strokeWidth={1} />
        <line x1={pistonX + 21} y1={cy + 50} x2={pistonX + 21} y2={cy + 62} stroke="var(--accent)" strokeWidth={2} />
        <text x={cx + L * k + 21} y={cy + 76} textAnchor="middle" className="td-label">stroke 90 mm</text>
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Readout label="crank angle" value={`${Math.round(deg)}°`} hot />
        <Readout label="piston below TDC" value={`${s.toFixed(1)} mm`} />
        <Readout label="stroke" value={stroke} />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <input type="range" min={0} max={359} step={1} value={Math.round(deg)} onChange={(e) => set(Number(e.target.value))} aria-label="Crank angle in degrees" className="w-full accent-[var(--accent)]" />
        <button type="button" onClick={run} disabled={!manual || reduce} className="td-press shrink-0 rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          Run
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The crank, the rod, the piston and the three numbers all read one value: the crank angle. Nothing here is animated by hand. That is the rule the skill gives Claude, and it is why the gauges in a teardown never disagree with the machine. Example dimensions: 90 mm stroke, 145 mm rod.
      </figcaption>
      <Sources links={[{ text: "elvarofficial/teardown (SKILL.md)", href: SRC.repo }]} />
    </figure>
  );
}

// ───────── 2 · rack and pinion: the numbers check by hand (32 teeth × 4 mm = 128 mm; half its circumference = 201 mm) ─────────
const TEETH = 32;
const MODULE = 4; // mm
const PITCH_D = TEETH * MODULE; // 128 mm
const TRAVEL = (Math.PI * PITCH_D) / 2; // 201.06 mm

function Rack() {
  const { ref, value: x, manual, set, run, reduce } = useDriven((t) => {
    const u = (t % 6) / 6; // out, hold, back, hold
    const tri = u < 0.4 ? u / 0.4 : u < 0.5 ? 1 : u < 0.9 ? 1 - (u - 0.5) / 0.4 : 0;
    return TRAVEL * (0.5 - 0.5 * Math.cos(Math.PI * tri));
  }, 120);
  const deg = (x / (PITCH_D / 2)) * (180 / Math.PI);
  const locked = deg > 179.5;
  // drawing: pinion centre at (210, 120), 1 mm = 0.7 px
  const k = 0.7;
  const cx = 210;
  const cy = 118;
  const r = (PITCH_D / 2) * k;
  const legA = ((180 - deg) * Math.PI) / 180; // a schematic: the leg starts pointing left and swings half a turn to the right
  const legLen = 86;
  const lx = cx + legLen * Math.cos(legA);
  const rackX = cx - (TRAVEL * k) / 2 - 20 + x * k;
  return (
    <figure ref={ref} className="td-plate p-4 sm:p-6">
      <Plate n={2} title="Real numbers you can check by hand" sub="one cylinder pushes a rack · the rack turns a 32-tooth gear" />
      <svg viewBox="0 0 420 220" className="w-full" role="img" aria-label={`Rack moved ${x.toFixed(0)} millimetres, gear turned ${deg.toFixed(0)} degrees`}>
        {/* pinion with a spoke that shows the turn */}
        <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="var(--ink)" strokeWidth={2} />
        {Array.from({ length: TEETH }).map((_, i) => {
          const a = ((i / TEETH) * 360 - deg) * (Math.PI / 180);
          return <line key={i} x1={cx + r * Math.cos(a)} y1={cy + r * Math.sin(a)} x2={cx + (r + 6) * Math.cos(a)} y2={cy + (r + 6) * Math.sin(a)} stroke="var(--ink)" strokeWidth={2.4} strokeLinecap="round" />;
        })}
        {/* the leg bolted to the gear: the part doing the work takes the accent */}
        <line x1={cx} y1={cy} x2={lx} y2={cy - legLen * Math.sin(legA)} stroke="var(--accent)" strokeWidth={9} strokeLinecap="round" />
        <circle cx={lx} cy={cy - legLen * Math.sin(legA)} r={13} fill="var(--ink)" />
        <circle cx={lx} cy={cy - legLen * Math.sin(legA)} r={5} fill="#fff" />
        <circle cx={cx} cy={cy} r={6} fill="var(--ink)" />
        {/* rack under the gear */}
        <rect x={rackX} y={cy + r + 7} width={TRAVEL * k + 40} height={14} rx={3} fill="var(--soft)" />
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={i} x1={rackX + 6 + i * ((TRAVEL * k + 28) / 21)} y1={cy + r + 1} x2={rackX + 6 + i * ((TRAVEL * k + 28) / 21)} y2={cy + r + 8} stroke="var(--soft)" strokeWidth={2.4} strokeLinecap="round" />
        ))}
        {/* travel ruler */}
        <line x1={cx - (TRAVEL * k) / 2} y1={cy + r + 38} x2={cx + (TRAVEL * k) / 2} y2={cy + r + 38} stroke="var(--muted)" strokeWidth={1} />
        <line x1={cx - (TRAVEL * k) / 2 + x * k} y1={cy + r + 31} x2={cx - (TRAVEL * k) / 2 + x * k} y2={cy + r + 45} stroke="var(--accent)" strokeWidth={2} />
        <text x={cx - (TRAVEL * k) / 2} y={cy + r + 54} textAnchor="start" className="td-label">0</text>
        <text x={cx + (TRAVEL * k) / 2} y={cy + r + 54} textAnchor="end" className="td-label">201 mm</text>
        <text x={22} y={26} className="td-label">{locked ? "leg folded away" : deg < 0.5 ? "leg down" : "swinging"}</text>
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Readout label="rack travel" value={`${x.toFixed(0)} mm`} hot />
        <Readout label="gear turned" value={`${deg.toFixed(0)}°`} />
        <Readout label="teeth × module" value="32 × 4 mm" />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <input type="range" min={0} max={201} step={1} value={Math.round(x)} onChange={(e) => set(Math.min(TRAVEL, Number(e.target.value)))} aria-label="Rack travel in millimetres" className="w-full accent-[var(--accent)]" />
        <button type="button" onClick={run} disabled={!manual || reduce} className="td-press shrink-0 rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          Run
        </button>
      </div>
      <p className="mt-3 text-center font-mono text-[11.5px] text-[var(--soft)]">32 teeth × 4 mm = a 128 mm gear · half its circumference = 201 mm · so 201 mm of rack = exactly 180°</p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        This is the worked example from the skill author&apos;s write-up (a Cessna 337 main landing gear): the prompt asks Claude for the real numbers and a check by hand before it draws anything. When the numbers close like this, the legs stop where the real ones stop.
      </figcaption>
      <Sources links={[{ text: "Elvar, How I Turn Any Machine Into a 3D Simulator You Can Take Apart", href: SRC.article }]} />
    </figure>
  );
}

const TD_CSS = `
.td{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.td-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.td-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.td-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;fill:var(--muted)}
.td-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.td-press:active:not(:disabled){transform:scale(.97)}
`;

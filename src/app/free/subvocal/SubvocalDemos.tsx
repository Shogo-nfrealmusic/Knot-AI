"use client";

// /free/49 (Subvocal, glasses that turn silent mouthing into text): one small live figure per chapter, drawn for this site
// rather than cut from the reel. Same language as /free/46–48 and /free/starter: paper plate, ink lines, one orange accent,
// nothing plays off screen. Every number and quote is from Subvocal's own post (X, Oct 30, 2026), its launch film (subtitles)
// and its preorder page. "200+ words a minute" is the company's claim. The film's sentences are verbatim. No footage.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type SubvocalDemoKind = "silent" | "radar" | "decode" | "room" | "preorder";

export function SubvocalDemo({ kind }: { kind: SubvocalDemoKind }) {
  return (
    <div className="sv mt-5 max-w-2xl">
      <style>{SV_CSS}</style>
      {kind === "silent" && <Silent />}
      {kind === "radar" && <Radar />}
      {kind === "decode" && <Decode />}
      {kind === "room" && <Room />}
      {kind === "preorder" && <Preorder />}
    </div>
  );
}

/** a clock that runs only while the figure is on screen; frozen with reduced motion */
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
  return { ref, t, reduce: !!reduce };
}

const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));

function Button({ onClick, children, primary }: { onClick: () => void; children: React.ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sv-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
    >
      {children}
    </button>
  );
}

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
          className={`sv-press whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium sm:px-3 sm:text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** the glasses from the side: a thick rim seen edge-on and the arm back to the ear */
function SideGlasses({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-6} y={-26} width={14} height={52} rx={6} fill="#fff" stroke="var(--ink)" strokeWidth={3} />
      <line x1={-6} y1={-14} x2={-150} y2={-6} stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

/** a head in profile, facing right; `open` drops the lower lip and jaw (0..1) */
const headPath = (open: number) => {
  const j = 10 * open;
  return `M 70 300 C 70 250, 40 210, 40 160 C 40 80, 110 30, 200 30 C 270 30, 310 70, 318 120 C 322 140, 318 150, 326 162 L 352 200 C 356 208, 350 212, 340 212 L 334 214 C 340 222, 340 232, 332 236 L 330 ${240 + j * 0.4} C 340 ${246 + j}, 338 ${258 + j}, 328 ${262 + j} C 322 ${268 + j}, 324 ${278 + j}, 318 ${288 + j} C 306 ${300 + j}, 280 ${300 + j}, 262 ${292 + j} L 250 330`;
};

/* ───────────── silent: the words keep coming, the sound meter never moves ───────────── */
const LINE = "Summarise the unread messages in Slack.";
function Silent() {
  const { ref, t } = useClock();
  const [mode, setMode] = useState<"mouth" | "speak">("mouth");
  const n = Math.floor(((t * 14) % (LINE.length + 18)));
  const typed = LINE.slice(0, Math.min(LINE.length, n));
  const level = mode === "speak" && n < LINE.length ? 0.45 + 0.4 * Math.abs(Math.sin(t * 11)) * Math.abs(Math.sin(t * 3.1)) : 0;
  return (
    <figure ref={ref} className="sv-plate p-4 sm:p-6">
      <svg viewBox="0 0 640 220" className="w-full" aria-label="A sentence types itself while the sound meter stays at zero when you only mouth the words">
        <rect x={30} y={30} width={580} height={70} rx={14} fill="#fff" stroke="var(--ink)" strokeWidth={1.4} />
        <text x={52} y={74} fontSize={22} fill="var(--ink)" fontFamily="Georgia, serif">{typed}<tspan className="sv-caret">|</tspan></text>
        {/* the sound meter: 24 bars */}
        {Array.from({ length: 24 }, (_, i) => {
          const h = 6 + 70 * Math.max(0, level - Math.abs(i - 11.5) / 20) * (0.6 + 0.4 * Math.sin(t * 13 + i));
          return <rect key={i} x={140 + i * 15} y={190 - h} width={9} height={h} rx={2} fill={level > 0 ? "var(--accent)" : "var(--rule-strong)"} />;
        })}
        <text x={30} y={186} fontSize={16} fill="var(--soft)" fontFamily="ui-monospace, monospace">sound</text>
        <text x={610} y={186} textAnchor="end" fontSize={16} fill={level > 0 ? "var(--accent)" : "var(--soft)"} fontFamily="ui-monospace, monospace">{level > 0 ? "audible" : "0 dB"}</text>
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Toggle label="How you say it" value={mode} onChange={setMode} options={[{ id: "mouth", label: "Mouth it (Subvocal)" }, { id: "speak", label: "Say it out loud" }]} />
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Voice typing needs sound. Subvocal reads the mouthing instead, so the words arrive and the meter stays flat. The sentence is one from Subvocal&apos;s film.</figcaption>
    </figure>
  );
}

/* ───────────── radar: arcs from the rim over the mouth; three points; the echo only changes when they move ───────────── */
const PTS = [{ x: 334, y: 230, label: "Upper lip" }, { x: 330, y: 252, label: "Lower lip" }, { x: 300, y: 292, label: "Jaw" }];
function Radar() {
  const { ref, t } = useClock();
  const [mouthing, setMouthing] = useState(true);
  const open = mouthing ? Math.max(0, Math.sin(t * 7)) : 0;
  const E = { x: 318, y: 170 };
  const arcs = [0, 1, 2, 3].map((i) => {
    const r = ((t * 120 + i * 45) % 180);
    const a0 = 0.55, a1 = 1.75;
    return <path key={i} d={`M ${E.x + r * Math.cos(a0)} ${E.y + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${E.x + r * Math.cos(a1)} ${E.y + r * Math.sin(a1)}`} fill="none" stroke="var(--accent)" strokeWidth={2} opacity={1 - r / 180} />;
  });
  const wave = (k: number) => {
    const amp = [0.5, 1, 0.8][k] * open;
    return Array.from({ length: 61 }, (_, i) => `${430 + i * 3},${80 + k * 70 + Math.sin(i * 0.6 + t * 10 + k) * (2 + 22 * amp)}`).join(" ");
  };
  return (
    <figure ref={ref} className="sv-plate p-4 sm:p-6">
      <svg viewBox="0 0 640 330" className="w-full" aria-label="Radar arcs leave the glasses and cross the lips and jaw; when they move, the returning signal for each one changes">
        <path d={headPath(open)} fill="#fff" stroke="var(--ink)" strokeWidth={1.6} />
        <SideGlasses x={318} y={150} />
        <circle cx={E.x} cy={E.y} r={4} fill="var(--accent)" />
        {arcs}
        {PTS.map((p, k) => {
          const py = p.y + (k ? 10 * open * (k === 2 ? 1.2 : 0.7) : 0);
          return (
            <g key={k}>
              <circle cx={p.x} cy={py} r={5} fill="var(--ink)" />
              <line x1={p.x + 8} y1={py} x2={420} y2={80 + k * 70} stroke="var(--rule-strong)" strokeWidth={1} />
              <text x={430} y={58 + k * 70} fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace">{p.label}</text>
              <polyline points={wave(k)} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
            </g>
          );
        })}
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Toggle label="Mouth" value={mouthing ? "on" : "off"} onChange={(v) => setMouthing(v === "on")} options={[{ id: "on", label: "Mouthing words" }, { id: "off", label: "Mouth still" }]} />
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The glasses send radar signals toward your face. When your lips and jaw move, the way the signals bounce back changes. That change is the input. No camera is involved.</figcaption>
    </figure>
  );
}

/* ───────────── decode: three signal rows go into the AI, words come out ───────────── */
const OUT = "Explain the new system to me.".split(" ");
function Decode() {
  const { ref, t } = useClock();
  const [run, setRun] = useState(0);
  const [t0, setT0] = useState(0);
  const s = t - t0;
  const fed = ramp(s, 0, 1.2);
  const words = OUT.filter((_, i) => s > 1.4 + i * 0.3).length; // 0.3 s a word = 200 words a minute
  return (
    <figure ref={ref} className="sv-plate p-4 sm:p-6" key={run}>
      <svg viewBox="0 0 640 230" className="w-full" aria-label="Three signals flow into the AI, and a sentence comes out word by word at 200 words a minute">
        {[0, 1, 2].map((k) => (
          <g key={k}>
            <text x={20} y={60 + k * 50} fontSize={15} fill="var(--soft)" fontFamily="ui-monospace, monospace">{["Upper lip", "Lower lip", "Jaw"][k]}</text>
            <polyline points={Array.from({ length: 50 }, (_, i) => `${120 + i * 3.4},${56 + k * 50 + Math.sin(i * 0.7 + t * 9 + k) * (s < 1.6 ? 9 : 3)}`).join(" ")} fill="none" stroke="var(--ink)" strokeWidth={1.5} />
            <path d={`M 290 ${56 + k * 50} C 330 ${56 + k * 50}, 330 105, 362 105`} fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeDasharray="1 0" pathLength={1} style={{ strokeDasharray: `${fed} 1` }} />
          </g>
        ))}
        <circle cx={400} cy={105} r={36} fill="#fff" stroke="var(--accent)" strokeWidth={2} />
        <circle cx={400} cy={105} r={42 + 4 * Math.sin(t * 5)} fill="none" stroke="var(--accent)" strokeWidth={1} opacity={0.35} />
        <text x={400} y={112} textAnchor="middle" fontSize={20} fontWeight={600} fill="var(--ink)">AI</text>
        <text x={320} y={205} textAnchor="middle" fontSize={24} fill="var(--ink)" fontFamily="Georgia, serif">{OUT.slice(0, words).join(" ")}</text>
        <text x={620} y={30} textAnchor="end" fontSize={14} fill="var(--soft)" fontFamily="ui-monospace, monospace">{words === OUT.length ? "200+ words a minute (Subvocal's claim)" : ""}</text>
      </svg>
      <div className="mt-3 flex items-center gap-3">
        <Button primary onClick={() => { setT0(t); setRun((r) => r + 1); }}>Replay</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Subvocal&apos;s AI learns those signals and turns them into text. The sentence is the one in the film, shown at 200 words a minute.</figcaption>
    </figure>
  );
}

/* ───────────── room: two wearers across a crowded room, one silent line between them ───────────── */
const TALK = [{ from: 0, text: "When do usage limits reset?" }, { from: 1, text: "At 4PM." }];
function Room() {
  const { ref, t } = useClock();
  const [i, setI] = useState(0);
  const [t0, setT0] = useState(0);
  const p = ramp(t - t0, 0, 1.4);
  const A = { x: 110, y: 240 }, B = { x: 540, y: 90 };
  const m = TALK[i];
  const [s, e] = m.from === 0 ? [A, B] : [B, A];
  const at = { x: s.x + (e.x - s.x) * p, y: s.y + (e.y - s.y) * p - Math.sin(p * Math.PI) * 60 };
  const crowd: { x: number; y: number }[] = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 11; c++) crowd.push({ x: 40 + c * 56 + (r % 2) * 28, y: 70 + r * 48 });
  return (
    <figure ref={ref} className="sv-plate p-4 sm:p-6">
      <svg viewBox="0 0 640 300" className="w-full" aria-label="Two people wearing the glasses talk silently across a crowded room">
        {crowd.filter((c) => Math.hypot(c.x - A.x, c.y - A.y) > 30 && Math.hypot(c.x - B.x, c.y - B.y) > 30).map((c, k) => (
          <g key={k} opacity={0.5}><circle cx={c.x} cy={c.y - 10} r={6} fill="var(--rule-strong)" /><path d={`M ${c.x - 10} ${c.y + 6} Q ${c.x} ${c.y - 6} ${c.x + 10} ${c.y + 6}`} fill="var(--rule-strong)" /></g>
        ))}
        {[A, B].map((w, k) => (
          <g key={k}><circle cx={w.x} cy={w.y - 14} r={9} fill="var(--ink)" /><path d={`M ${w.x - 15} ${w.y + 8} Q ${w.x} ${w.y - 9} ${w.x + 15} ${w.y + 8}`} fill="var(--ink)" /><rect x={w.x - 8} y={w.y - 18} width={16} height={5} rx={2} fill="#fff" stroke="var(--accent)" strokeWidth={1.4} /></g>
        ))}
        <path d={`M ${A.x} ${A.y - 30} Q ${(A.x + B.x) / 2} ${(A.y + B.y) / 2 - 110} ${B.x} ${B.y - 30}`} fill="none" stroke="var(--accent)" strokeWidth={1.4} className="sv-dash" />
        {p < 1 && <circle cx={at.x} cy={at.y - 30} r={5} fill="var(--accent)" />}
        {p >= 1 && (
          <g>
            <rect x={Math.min(390, Math.max(10, (m.from === 0 ? B.x : A.x) - 120))} y={(m.from === 0 ? B.y : A.y) - 82} width={240} height={36} rx={10} fill="#fff" stroke="var(--ink)" strokeWidth={1.2} />
            <text x={Math.min(510, Math.max(130, m.from === 0 ? B.x : A.x))} y={(m.from === 0 ? B.y : A.y) - 58} textAnchor="middle" fontSize={16} fill="var(--ink)" fontFamily="Georgia, serif">{m.text}</text>
          </g>
        )}
      </svg>
      <div className="mt-3 flex items-center gap-3">
        <Button primary onClick={() => { setI((v) => (v + 1) % TALK.length); setT0(t); }}>{i === 0 ? "Send the reply" : "Ask again"}</Button>
        <span className="font-mono text-[12px] text-[var(--soft)]">Nobody in between hears a word.</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Two people wearing Subvocal can have a private conversation, even across a crowded room. Both lines are from Subvocal&apos;s film.</figcaption>
    </figure>
  );
}

/* ───────────── preorder: what the $499 buys you today, and what still has to happen ───────────── */
const STEPS = [
  { label: "Preorder", note: "$199 deposit, refundable before the final payment" },
  { label: "FCC approval", note: "delivery depends on it" },
  { label: "Q1 2027", note: "when shipping is expected to start" },
];
function Preorder() {
  const { ref, t } = useClock();
  const k = Math.min(STEPS.length - 1, Math.floor((t / 1.6) % (STEPS.length + 1)));
  return (
    <figure ref={ref} className="sv-plate p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-serif text-[44px] leading-none text-[var(--ink)]">$499</span>
        <span className="text-[15px] text-[var(--muted)] line-through">$699</span>
        <span className="rounded-md border border-[var(--rule-strong)] bg-white px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--soft)]">Early bird · US only</span>
      </div>
      <svg viewBox="0 0 640 120" className="mt-4 w-full" aria-label="Preorder, then FCC approval, then shipping expected to start in Q1 2027">
        <line x1={60} y1={40} x2={580} y2={40} stroke="var(--rule-strong)" strokeWidth={2} />
        <line x1={60} y1={40} x2={60 + 260 * k} y2={40} stroke="var(--accent)" strokeWidth={2.5} />
        {STEPS.map((s, i) => (
          <g key={i}>
            <circle cx={60 + 260 * i} cy={40} r={9} fill={i <= k ? "var(--accent)" : "#fff"} stroke={i <= k ? "var(--accent)" : "var(--rule-strong)"} strokeWidth={2} />
            <text x={60 + 260 * i} y={78} textAnchor="middle" fontSize={17} fontWeight={600} fill="var(--ink)">{s.label}</text>
            <text x={60 + 260 * i} y={102} textAnchor="middle" fontSize={13} fill="var(--soft)">{s.note}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">From Subvocal&apos;s preorder page. Taxes, shipping and prescription lenses cost extra, and no delivery date is confirmed yet.</figcaption>
    </figure>
  );
}

const SV_CSS = `
.sv{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#e0552f}
.sv-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.sv-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.sv-press:active{transform:scale(.96)}
@keyframes sv-blink{50%{opacity:0}}
.sv-caret{animation:sv-blink 1s steps(1) infinite}
@keyframes sv-flow{to{stroke-dashoffset:-24}}
.sv-dash{stroke-dasharray:6 6;animation:sv-flow .8s linear infinite}
@media (max-width:640px){.sv svg text{font-size:20px}}
@media (prefers-reduced-motion:reduce){.sv-caret,.sv-dash{animation:none}}
`;

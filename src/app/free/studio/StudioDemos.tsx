"use client";

// /free/52 (the setup behind @copilot_shogo's reels: one folder per reel, four tools, one rule page, a check that refuses
// to render): one small live figure per chapter, drawn for this site rather than cut from the reel. Same language as
// /free/46–50: paper plate, ink lines, one accent, nothing plays off screen. Every number is real: file sizes from the
// studio's own episode folders, reel #52's frame count and word timings, the loudness of reels #42–#49, and the real
// brand_check output. Clawd is Claude Code's own mascot, drawn from the block characters Claude Code prints on start.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type StudioDemoKind = "folder" | "tools" | "rules" | "check";

export function StudioDemo({ kind }: { kind: StudioDemoKind }) {
  return (
    <div className="st mt-5 max-w-2xl">
      <style>{ST_CSS}</style>
      {kind === "folder" && <Folder />}
      {kind === "tools" && <Tools />}
      {kind === "rules" && <Rules />}
      {kind === "check" && <Check />}
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
const ease = (x: number) => 1 - (1 - x) ** 3;
const hopAt = (s: number, a: number, d = 0.35) => Math.sin(Math.PI * ramp(s, a, a + d));

function Button({ onClick, children, primary }: { onClick: () => void; children: React.ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`st-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
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
          className={`st-press whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium sm:px-3 sm:text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Clawd: Claude Code's mascot. The block characters it prints (▐▛███▜▌ / ▝▜█████▛▘ / ▘▘ ▝▝) are 2×2 quadrants per
   character; a terminal cell is about twice as tall as wide, so each pixel here is 1 wide and 2 tall. ── */
const CLAWD_BODY = ["000111111111111000", "000111111111111000", "011111111111111110", "000111111111111000"];
function Clawd({ px = 4, hop = 0, walk = false, t = 0, blink = 0, look = 0, title }: { px?: number; hop?: number; walk?: boolean; t?: number; blink?: number; look?: number; title?: string }) {
  const ph = 2 * px, step = walk ? Math.floor(t * 8) % 2 : 0;
  const eyeH = ph * (1 - 0.85 * Math.max(0, Math.min(1, blink)));
  return (
    <svg width={18 * px} height={6 * ph} viewBox={`0 0 ${18 * px} ${6 * ph}`} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} style={{ overflow: "visible", transform: `translateY(${-hop * 3 * ph}px)` }}>
      {CLAWD_BODY.map((row, y) => [...row].map((c, x) => c === "1" && <rect key={`${x}-${y}`} x={x * px} y={y * ph} width={px + 0.5} height={ph + 0.5} fill="#D77757" />))}
      {[5, 12].map((ex) => <rect key={ex} x={(ex + look) * px} y={ph + (ph - eyeH) / 2} width={px} height={eyeH} fill="#2A1A14" />)}
      {[4, 6, 11, 13].map((lx, i) => <rect key={lx} x={lx * px} y={4 * ph - (walk && i % 2 === step ? 0.4 * ph : 0)} width={px + 0.5} height={ph + 0.5} fill="#D77757" />)}
    </svg>
  );
}

/* ───────────── folder: one folder per reel; open one and its four real files appear ───────────── */
const REELS = [
  { n: "#46", name: "Jarvis", files: ["10.4 KB", "892.8 KB", "40.6 KB", "28.3 MB"] },
  { n: "#47", name: "Krea Ad Studio", files: ["21.1 KB", "842.6 KB", "51.5 KB", "26.2 MB"] },
  { n: "#48", name: "Suncatcher", files: ["22.8 KB", "1.5 MB", "52.5 KB", "84.1 MB"] },
  { n: "#49", name: "Subvocal", files: ["27.2 KB", "894.7 KB", "33.7 KB", "20.0 MB"] },
  { n: "#50", name: "HackerTube", files: ["13.4 KB", "837.0 KB", "43.4 KB", "16.3 MB"] },
  { n: "#52", name: "this reel", files: ["13.8 KB", "1.0 MB", "55.5 KB", "15.9 MB"] },
];
const FILE_NAMES = [
  { name: "script.md", what: "the script" },
  { name: "narration.mp3", what: "the voice" },
  { name: "Video.tsx", what: "the code" },
  { name: "final.mp4", what: "the final video" },
];
function FolderIcon({ open, size = 40 }: { open?: boolean; size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 50 40" aria-hidden>
      <path d="M2 6 Q2 2 6 2 L18 2 L23 7 L44 7 Q48 7 48 11 L48 35 Q48 38 45 38 L5 38 Q2 38 2 35 Z" fill="#7FB7EC" />
      <path d={open ? "M4 15 L48 15 L45 36 Q45 38 42 38 L6 38 Q3 38 3 36 Z" : "M2 13 L48 13 L48 35 Q48 38 45 38 L5 38 Q2 38 2 35 Z"} fill="#A9D0F5" />
    </svg>
  );
}
function Folder() {
  const { ref, t } = useClock();
  const [sel, setSel] = useState(5);
  const [t0, setT0] = useState(0);
  const s = t - t0;
  return (
    <figure ref={ref} className="st-plate p-4 sm:p-6">
      <div className="mb-3 font-mono text-[12px] text-[var(--soft)]">episodes/ · one folder per reel</div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {REELS.map((r, i) => (
          <button key={r.n} type="button" onClick={() => { setSel(i); setT0(t); }} className={`st-press relative flex flex-col items-center gap-1 rounded-xl px-1 pb-2 pt-3 ${sel === i ? "bg-white shadow-[0_0_0_1.5px_var(--accent)]" : "hover:bg-white/70"}`} aria-pressed={sel === i}>
            {sel === i && <span className="absolute -top-4"><Clawd px={1.6} hop={hopAt(s, 0)} t={t} blink={hopAt(t % 4, 3.6, 0.2)} /></span>}
            <FolderIcon open={sel === i} />
            <span className="font-mono text-[12px] text-[var(--ink)]">{r.n}</span>
            <span className="text-center text-[11px] leading-tight text-[var(--muted)]">{r.name}</span>
          </button>
        ))}
      </div>
      <ul className="mt-4 space-y-1.5">
        {FILE_NAMES.map((fl, i) => {
          const k = ease(ramp(s, 0.15 + i * 0.12, 0.45 + i * 0.12));
          return (
            <li key={fl.name} className="st-card flex items-center gap-3" style={{ opacity: k, transform: `translateX(${(1 - k) * 12}px)` }}>
              <span className="font-mono text-[13px] text-[var(--ink)]">{fl.name}</span>
              <span className="text-[12.5px] text-[var(--muted)]">{fl.what}</span>
              <span className="ml-auto font-mono text-[12px] tabular-nums text-[var(--soft)]">{REELS[sel].files[i]}</span>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Six real reel folders and their real file sizes. Tap one. Every reel keeps the same four files, so Claude Code can open any past reel and reuse what worked.</figcaption>
    </figure>
  );
}

/* ───────────── tools: what each of the four tools did for reel #52 ───────────── */
type ToolId = "remotion" | "elevenlabs" | "rubberband" | "ffmpeg";
const TOOL_OPTS: { id: ToolId; label: string }[] = [
  { id: "remotion", label: "Remotion" },
  { id: "elevenlabs", label: "ElevenLabs" },
  { id: "rubberband", label: "Rubber Band" },
  { id: "ffmpeg", label: "FFmpeg" },
];
// ElevenLabs' word times for "so the captions land on the exact frame." in reel #52 (after Rubber Band)
const WORD_TIMES = [
  { w: "so", s: 23.258 }, { w: "the", s: 23.348 }, { w: "captions", s: 23.434 }, { w: "land", s: 23.806 },
  { w: "on", s: 24.02 }, { w: "the", s: 24.076 }, { w: "exact", s: 24.182 }, { w: "frame.", s: 24.536 },
];
// integrated loudness of reels #42–#49 (ffmpeg ebur128 on each final.mp4, measured 2026-11-04)
const LUFS = [
  { n: "#42", v: -14.9 }, { n: "#43", v: -14.1 }, { n: "#44", v: -14.1 }, { n: "#45", v: -14.1 },
  { n: "#46", v: -14.1 }, { n: "#47", v: -14.1 }, { n: "#48", v: -14.2 }, { n: "#49", v: -14.1 },
];
function Tools() {
  const { ref, t } = useClock();
  const [tool, setTool] = useState<ToolId>("remotion");
  const [t0, setT0] = useState(0);
  const s = t - t0;
  const pick = (v: ToolId) => { setTool(v); setT0(t); };
  return (
    <figure ref={ref} className="st-plate p-4 sm:p-6">
      <Toggle value={tool} options={TOOL_OPTS} onChange={pick} label="Tool" />
      <div className="mt-4 min-h-[170px]">
        {tool === "remotion" && (() => {
          const k = (s % 4.2) / 3.6, total = 2629;
          return (
            <div>
              <p className="text-[14px] font-medium text-[var(--ink)]">Claude writes React. Remotion renders every frame of it.</p>
              <div className="st-card mt-3 font-mono text-[12.5px] leading-relaxed">
                <div>&lt;TitleHit name=&quot;REMOTION&quot; /&gt;</div>
                <div>&lt;Orbit clip=&quot;st_cheer&quot; /&gt;</div>
              </div>
              <div className="mt-3 flex items-baseline gap-2 font-mono text-[13px] text-[var(--soft)]">
                frame <span className="text-[22px] font-semibold tabular-nums text-[var(--ink)]">{Math.round(total * Math.min(1, k)).toLocaleString("en-US")}</span> / 2,629
              </div>
              <div className="mt-2 h-2 rounded-full bg-[var(--rule)]"><div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${100 * Math.min(1, k)}%` }} /></div>
              <p className="mt-2 font-mono text-[12px] text-[var(--muted)]">reel #52: 43.8 s at 60 fps</p>
            </div>
          );
        })()}
        {tool === "elevenlabs" && (() => {
          const now = 23.15 + (s % 2.2) * 0.75;
          return (
            <div>
              <p className="text-[14px] font-medium text-[var(--ink)]">My cloned voice, and the time of every word it says.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {WORD_TIMES.map((w, i) => (
                  <span key={i} className={`st-card font-mono text-[12.5px] transition-colors ${now >= w.s ? "border-[var(--accent)] text-[var(--ink)]" : "text-[var(--muted)]"}`}>
                    {w.w} <span className={now >= w.s ? "text-[var(--accent)]" : ""}>{w.s.toFixed(2)}s</span>
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Each caption appears on the frame its word starts, so the words never run ahead of the voice.</p>
            </div>
          );
        })()}
        {tool === "rubberband" && (() => {
          const k = ease(ramp(s % 3.4, 0.3, 1.6)), len = 62.3 - k * (62.3 - 43.2);
          return (
            <div>
              <p className="text-[14px] font-medium text-[var(--ink)]">The same take, 1.32× faster, at the same pitch.</p>
              <div className="mt-3 font-mono text-[12px] text-[var(--soft)]">raw take · 62.3 s</div>
              <div className="mt-1 h-3 rounded-full bg-[var(--rule)]" />
              <div className="mt-3 font-mono text-[12px] text-[var(--accent)]">after · {len.toFixed(1)} s</div>
              <div className="mt-1 h-3 rounded-full bg-[var(--accent)]" style={{ width: `${(100 * len) / 62.3}%` }} />
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Long pauses are cut to 0.22 s first, then Rubber Band stretches time without moving the pitch, so it doesn&apos;t sound like a chipmunk.</p>
            </div>
          );
        })()}
        {tool === "ffmpeg" && (
          <div>
            <p className="text-[14px] font-medium text-[var(--ink)]">Voice and music mixed, every reel set to −14 LUFS.</p>
            <div className="relative mt-3 h-[120px]">
              <div className="absolute inset-x-0 border-t-2 border-dashed border-[var(--ink)]" style={{ top: 120 - (24 - 14) * 6 }} />
              <span className="absolute right-0 rounded-md bg-[var(--ink)] px-1.5 py-0.5 font-mono text-[11px] text-white" style={{ top: 120 - (24 - 14) * 6 - 24 }}>−14 LUFS</span>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between">
                {LUFS.map((r, i) => {
                  const k = ease(ramp(s, 0.1 + i * 0.06, 0.6 + i * 0.06));
                  return (
                    <div key={r.n} className="flex flex-col items-center gap-1" style={{ width: "10%" }}>
                      <div className="w-full rounded-t-md bg-[var(--accent)]" style={{ height: (24 + r.v) * 6 * k }} title={`${r.n}: ${r.v} LUFS`} />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-1 flex justify-between font-mono text-[11px] text-[var(--muted)]">{LUFS.map((r) => <span key={r.n} style={{ width: "10%", textAlign: "center" }}>{r.n}</span>)}</div>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Pick a tool. Each shows what it really did for reel #52: the frame count, the word times, the before/after length, and the loudness of the last eight reels.</figcaption>
    </figure>
  );
}

/* ───────────── rules: a reel looked cheap → the fix becomes one line; Claude reads the page first ───────────── */
// real lines of docs/craft.md (written in Japanese; translated), with their real line numbers
const RULE_LINES = [
  { n: 42, t: "Frame 1 is the content, not a logo." },
  { n: 89, t: "No face in the hook." },
  { n: 98, t: "Solid backgrounds. No glow." },
  { n: 101, t: "One sound per event, within 2 frames." },
  { n: 131, t: "Other people's footage only as short proof." },
  { n: 135, t: "Shake twice at most. One flash.", isNew: true },
  { n: 140, t: "Never upscale an image past 1.5×." },
];
function Rules() {
  const { ref, t } = useClock();
  const [t0, setT0] = useState<number | null>(null);
  const s = t0 === null ? 0 : t - t0;
  const added = t0 !== null;
  const ins = ease(ramp(s, 0.2, 0.6));
  const mark = ease(ramp(s, 0.6, 1.1));
  const read = ramp(s, 1.4, 3.6);
  return (
    <figure ref={ref} className="st-plate p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between font-mono text-[12px] text-[var(--soft)]"><span>craft.md · 230 lines</span>{added && read > 0 && read < 1 && <span className="text-[var(--accent)]">Claude Code is reading</span>}</div>
      <div className="relative overflow-hidden rounded-xl border border-[var(--rule)] bg-white">
        {RULE_LINES.map((r, i) => {
          if (r.isNew && !added) return null;
          const h = r.isNew ? 36 * ins : 36;
          const done = added && read * RULE_LINES.length > i + 0.5;
          return (
            <div key={r.n} className="relative flex items-center gap-3 overflow-hidden px-3" style={{ height: h }}>
              {r.isNew && <span className="absolute inset-y-1.5 left-10 rounded bg-[#FFE27A]" style={{ width: `calc((100% - 52px) * ${mark})` }} />}
              <span className="relative w-7 text-right font-mono text-[11px] text-[var(--muted)]">{r.n}</span>
              <span className={`relative text-[13.5px] ${r.isNew ? "font-semibold text-[var(--ink)]" : "text-[var(--soft)]"}`}>{r.t}</span>
              {done && <span className="relative ml-auto text-[13px] text-[#1FA45A]">✓</span>}
            </div>
          );
        })}
        {added && read > 0 && read < 1 && <span className="absolute right-2" style={{ top: 6 + read * (RULE_LINES.length * 36 - 30) }}><Clawd px={1.4} walk t={t} /></span>}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button primary onClick={() => setT0(t)}>{added ? "Read it again" : "Reel #44 looked cheap"}</Button>
        {!added && <span className="font-mono text-[12px] text-[var(--soft)]">What I said: &quot;the screen keeps shaking and flashing&quot;</span>}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Seven real lines of my rule page (it&apos;s in Japanese; these are translations, with the real line numbers). Press the button: the fix for #44 becomes line 135, and Claude Code reads the whole page before the next reel.</figcaption>
    </figure>
  );
}

/* ───────────── check: break a rule and the render refuses (real brand_check output) ───────────── */
const BROKEN = [
  "BRAND ✗ unboxed text (fontSize ≥ 30) on lines 36",
  "BRAND ✗ Start gate: 0 real material files listed",
  "BRAND ✗ rules: Orbit (the account's mascot) is missing",
  "fix the brand rules first",
];
function Check() {
  const { ref, t } = useClock();
  const [run, setRun] = useState<{ ok: boolean; t0: number } | null>(null);
  const s = run ? t - run.t0 : 0;
  const lines = run ? (run.ok ? ["BRAND ✓ (250 wpm)", "I: -14.1 LUFS", "pops: none"] : BROKEN) : [];
  const shown = lines.filter((_, i) => s > 0.35 + i * 0.35).length;
  const done = run !== null && shown === lines.length;
  const k = run ? (run.ok ? ease(ramp(s, 0.3, 1.6)) : 0.62 * ease(ramp(s, 0.3, 1.3))) : 0;
  return (
    <figure ref={ref} className="st-plate p-4 sm:p-6">
      <div className="rounded-xl bg-[#15171a] p-4 font-mono text-[12.5px] leading-relaxed">
        <div className="text-[#a6e3a1]">~ % <span className="text-[#e7e7ea]">render reel #52</span></div>
        {lines.slice(0, shown).map((l, i) => (
          <div key={`${run?.t0}-${i}`} className={`st-in ${l.startsWith("BRAND ✗") || l.startsWith("fix") ? "text-[#ff8a80]" : "text-[#a6e3a1]"}`}>{l}</div>
        ))}
        {!run && <div className="text-[#868b92]">press a button below</div>}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-[var(--rule)]"><div className={`h-2 rounded-full ${run && !run.ok && done ? "bg-[#e5413b]" : "bg-[var(--accent)]"}`} style={{ width: `${100 * k}%` }} /></div>
        <span className="relative w-20 font-mono text-[12px] tabular-nums text-[var(--soft)]">{run ? (done ? (run.ok ? "rendered" : "refused") : `${Math.round(100 * k)}%`) : "—"}</span>
      </div>
      <div className="mt-2 h-6">{run && <span style={{ marginLeft: `calc(${100 * k}% - 40px)`, display: "inline-block" }}><Clawd px={1.4} walk={!done} t={t} hop={run.ok && done ? hopAt(s % 1.2, 0.2) : 0} blink={!run.ok && done ? 1 : 0} /></span>}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button primary onClick={() => setRun({ ok: false, t0: t })}>Render with a rule broken</Button>
        <Button onClick={() => setRun({ ok: true, t0: t })}>Render with the rules kept</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The real output of my check script: on an empty draft of reel #52 it listed what was broken and stopped the render; on the finished reel it passed and the render went through at −14.1 LUFS.</figcaption>
    </figure>
  );
}

const ST_CSS = `
.st{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.st-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.st-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:7px 11px;font-size:13.5px;line-height:1.35}
.st-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.st-press:active{transform:scale(.96)}
@keyframes st-in{from{opacity:0;transform:translateY(-4px)}}
.st-in{animation:st-in .3s ease-out}
@media (prefers-reduced-motion:reduce){.st-in{animation:none}}
`;

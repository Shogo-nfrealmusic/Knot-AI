"use client";

// /free/47 (Krea Ad Studio, tried on my real studio): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46 and /free/starter: paper plate, ink lines, one orange accent, nothing plays off screen.
// Material is real: the brand kit Ad Studio built from tettyphotostudio.com on Nov 1, 2026 (values copied from the screen),
// the four ads it made, the agent request verbatim and the ad before/after it. No Krea footage.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type KreaDemoKind = "kit" | "ads" | "edit" | "mcp" | "price";

export function KreaDemo({ kind }: { kind: KreaDemoKind }) {
  return (
    <div className="kr mt-5 max-w-2xl">
      <style>{KR_CSS}</style>
      {kind === "kit" && <Kit />}
      {kind === "ads" && <Ads />}
      {kind === "edit" && <Edit />}
      {kind === "mcp" && <Mcp />}
      {kind === "price" && <Price />}
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

const on = (t: number, at: number) => t >= at;
const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));

function Replay({ onClick, label = "Replay" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="kr-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[13px] font-medium text-[var(--ink)] hover:border-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
      {label}
    </button>
  );
}

/* ───────────── kit: one link → the brand kit it built for my studio (real values) ───────────── */

const URL_TEXT = "tettyphotostudio.com";
const KIT_ROWS: { label: string; at: number; body: React.ReactNode; miss?: boolean }[] = [
  {
    label: "Colors", at: 2.6,
    body: (
      <span className="flex items-center gap-2">
        <span className="size-6 rounded-full" style={{ background: "#0F2424" }} />
        <span className="-ml-3.5 size-6 rounded-full ring-2 ring-white" style={{ background: "#031512" }} />
        <span className="font-mono text-[12.5px] text-[var(--soft)]">#0F2424 · #031512</span>
      </span>
    ),
  },
  { label: "Products", at: 3.0, body: <span>Signature Tokyo Session <b>$250</b> · Tokyo Love Story <b>$290</b> · Tokyo Family Session <b>$500</b> <span className="text-[var(--muted)]">+3 more</span></span> },
  { label: "Locations", at: 3.4, body: <span>Shibuya · Shinjuku · Asakusa</span> },
  { label: "Audience", at: 3.8, body: <span>Solo travelers, couples, families and friend or travel groups visiting Tokyo</span> },
  { label: "Logo", at: 4.3, miss: true, body: <span className="text-[var(--accent)]">not found, the slot stayed empty</span> },
];

function Kit() {
  const { ref, t, replay } = useTimeline(5);
  const typed = Math.min(URL_TEXT.length, Math.floor(t / 0.045));
  const read = ramp(t, 1.0, 2.4);
  const secs = Math.round(90 * read);
  return (
    <figure ref={ref} className="kr-plate p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex h-11 min-w-[230px] flex-1 items-center overflow-hidden rounded-full bg-white px-4 text-[15px] text-[var(--ink)] shadow-[0_0_0_1px_var(--rule)]">
          <span className="mr-2 text-[var(--muted)]">⌕</span>
          {URL_TEXT.slice(0, typed)}
          {typed < URL_TEXT.length && <span className="kr-caret text-[var(--accent)]">|</span>}
          <span className="absolute bottom-0 left-0 h-[3px] bg-[var(--accent)]" style={{ width: `${read * 100}%` }} />
        </div>
        <span className="font-mono text-[13px] tabular-nums text-[var(--soft)]">
          {read > 0 ? `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}` : "0:00"} <span className="text-[var(--muted)]">/ 1:30</span>
        </span>
      </div>
      <div className="mt-5 rounded-2xl bg-white p-4 shadow-[0_0_0_1px_var(--rule)]">
        <div className="flex items-baseline justify-between">
          <p className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
            {on(t, 2.3) ? "Tetty's Photo Studio" : on(t, 1.6) ? <span className="text-[var(--muted)]">Tettyphotostudio</span> : <span className="text-[var(--rule-strong)]">reading the site…</span>}
          </p>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">brand kit</span>
        </div>
        <ul className="mt-3 divide-y divide-[var(--rule)]">
          {KIT_ROWS.map((r) => (
            <li key={r.label} className="grid grid-cols-[92px_1fr] items-center gap-3 py-2.5 text-[14px] leading-snug text-[var(--ink)] transition-[opacity,transform] duration-500" style={{ opacity: on(t, r.at) ? 1 : 0.15, transform: on(t, r.at) ? "none" : "translateY(4px)" }}>
              <span className={`font-mono text-[11.5px] uppercase tracking-[0.12em] ${r.miss ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}>{r.label}</span>
              {r.miss ? (
                <span className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-lg border-2 border-dashed font-mono text-[15px]" style={{ borderColor: on(t, r.at + 0.2) ? "var(--accent)" : "var(--rule-strong)", color: "var(--muted)" }}>?</span>
                  {r.body}
                </span>
              ) : r.body}
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13.5px] leading-relaxed text-[var(--soft)]">The kit it built from my studio&apos;s site, played back in 5 seconds instead of 90. It first guessed the name from the domain, then fixed it.</span>
        <Replay onClick={replay} />
      </figcaption>
    </figure>
  );
}

/* ───────────── ads: the four it made, tap one to open it ───────────── */

const ADS = [
  { src: "/free/47/ad-lovestory-1.jpg", name: "Tokyo Love Story", price: "$290" },
  { src: "/free/47/ad-lovestory-2.jpg", name: "Tokyo Love Story", price: "$290" },
  { src: "/free/47/ad-family-before.jpg", name: "Tokyo Family Session", price: "$500" },
  { src: "/free/47/ad-family-night.jpg", name: "Tokyo Family Session", price: "$500" },
];

function Ads() {
  const { ref, t, replay } = useTimeline(2.4);
  const [open, setOpen] = useState<number | null>(null);
  const n = ADS.filter((_, i) => on(t, 0.3 + i * 0.45)).length;
  return (
    <figure ref={ref} className="kr-plate p-5 sm:p-7">
      <div className="flex items-baseline gap-2">
        <span className="text-[44px] font-semibold leading-none tracking-[-0.05em] text-[var(--ink)] tabular-nums">{n}</span>
        <span className="font-serif text-[26px] italic text-[var(--accent)]">ads</span>
        <span className="ml-auto font-mono text-[12px] text-[var(--muted)]">9:16 · about 90 s</span>
      </div>
      {open === null ? (
        <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-3.5">
          {ADS.map((a, i) => (
            <button key={a.src} type="button" onClick={() => setOpen(i)} aria-label={`Open the ${a.name} ad`} className="kr-press overflow-hidden rounded-xl bg-white p-1 shadow-[0_0_0_1px_var(--rule),0_14px_30px_-20px_rgba(21,23,26,.5)] transition-[opacity,transform] duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]" style={{ opacity: i < n ? 1 : 0, transform: i < n ? "none" : "translateY(10px) scale(.96)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.src} alt={`Ad Studio ad for ${a.name}`} className="aspect-[9/16] w-full rounded-lg object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid items-center gap-5 sm:grid-cols-[220px_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ADS[open].src} alt={`Ad Studio ad for ${ADS[open].name}`} className="mx-auto aspect-[9/16] w-[200px] rounded-xl object-cover shadow-[0_0_0_1px_var(--rule),0_24px_50px_-28px_rgba(21,23,26,.6)] sm:w-[220px]" />
          <div>
            <p className="text-[20px] font-semibold tracking-[-0.02em] text-[var(--ink)]">{ADS[open].name} <span className="text-[var(--accent)]">{ADS[open].price}</span></p>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--soft)]">One product per ad, with its own layout and copy. The photo is the real one from my site, kept as it was.</p>
            <div className="mt-4"><Replay onClick={() => setOpen(null)} label="Back to all four" /></div>
          </div>
        </div>
      )}
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13.5px] text-[var(--soft)]">The four ads it made for my studio. Tap one to open it.</span>
        {open === null && <Replay onClick={replay} />}
      </figcaption>
    </figure>
  );
}

/* ───────────── edit: the agent request, and a before/after slider (the headline didn't change) ───────────── */

const REQUEST = "Make the Tokyo Family Session ad a night scene with a shorter, more playful headline";
const HB = { y0: 0.05, y1: 0.235 }; // where the headline sits on the ad, both versions

function Edit() {
  const { ref, t, replay } = useTimeline(REQUEST.length * 0.03 + 0.6);
  const [cut, setCut] = useState(50);
  const typed = Math.min(REQUEST.length, Math.floor(t / 0.03));
  return (
    <figure ref={ref} className="kr-plate p-5 sm:p-7">
      <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 text-[14.5px] leading-snug text-[var(--ink)] shadow-[0_0_0_1px_var(--rule)]">
        <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">to the agent</span>
        {REQUEST.slice(0, typed)}
        {typed < REQUEST.length && <span className="kr-caret text-[var(--accent)]">|</span>}
      </div>
      <div className="mt-5 grid items-center gap-5 sm:grid-cols-[240px_1fr]">
        <div className="relative mx-auto aspect-[1536/2736] w-[220px] select-none overflow-hidden rounded-xl shadow-[0_0_0_1px_var(--rule),0_24px_50px_-28px_rgba(21,23,26,.6)] sm:w-[240px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/free/47/ad-family-after.jpg" alt="The ad after the request" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - cut}% 0 0)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/free/47/ad-family-before.jpg" alt="The ad before the request" className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="absolute inset-y-0 w-[2px] bg-white shadow-[0_0_0_1px_rgba(21,23,26,.2)]" style={{ left: `${cut}%` }} />
          <div className="absolute inset-x-1.5 rounded-md border-2 border-[var(--accent)]" style={{ top: `${HB.y0 * 100}%`, height: `${(HB.y1 - HB.y0) * 100}%` }} />
          <span className="absolute left-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10.5px] text-white">before</span>
          <span className="absolute right-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10.5px] text-white">after</span>
        </div>
        <div>
          <label className="block font-mono text-[11.5px] uppercase tracking-[0.12em] text-[var(--muted)]" htmlFor="kr-cut">Drag: before ↔ after</label>
          <input id="kr-cut" type="range" min={0} max={100} value={cut} onChange={(e) => setCut(Number(e.target.value))} className="kr-range mt-2 w-full" />
          <p className="mt-4 text-[20px] font-semibold leading-tight tracking-[-0.02em] text-[var(--ink)]">Same headline: <span className="text-[var(--accent)]">Tokyo Family Session</span></p>
          <p className="mt-2 text-[14px] leading-relaxed text-[var(--soft)]">It came back in about 90 seconds with the words only re-set on three lines, and barely a night scene. Ask for one change at a time and check each one.</p>
        </div>
      </div>
      <figcaption className="mt-4 flex justify-end"><Replay onClick={replay} /></figcaption>
    </figure>
  );
}

/* ───────────── mcp: Claude → Krea MCP → Ad Studio, the three things the blog says it can do ───────────── */

const MCP_STEPS = ["research a brand", "pick products", "generate ads"];

function Mcp() {
  const { ref, t, replay } = useTimeline(4.2);
  const lit = MCP_STEPS.filter((_, i) => on(t, 0.9 + i * 1.0)).length;
  const pulse = (t * 0.9) % 1;
  return (
    <figure ref={ref} className="kr-plate p-5 sm:p-7">
      <div className="relative mx-auto max-w-[520px]">
        <svg viewBox="0 0 520 110" className="w-full" aria-hidden="true">
          <line x1={90} y1={55} x2={430} y2={55} stroke="var(--rule-strong)" strokeWidth={2} />
          <line x1={90} y1={55} x2={90 + 340 * ramp(t, 0.1, 0.8)} y2={55} stroke="var(--accent)" strokeWidth={2.5} />
          {t > 0.8 && <circle cx={90 + 340 * pulse} cy={55} r={5} fill="var(--accent)" />}
          {[{ x: 90, l: "Claude" }, { x: 260, l: "Krea MCP" }, { x: 430, l: "Ad Studio" }].map((n) => (
            <g key={n.l}>
              <rect x={n.x - 62} y={30} width={124} height={50} rx={14} fill="#fff" stroke="var(--ink)" strokeWidth={1.2} />
              <text x={n.x} y={60} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--ink)">{n.l}</text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-3">
        {MCP_STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-3 text-[14px] text-[var(--ink)] shadow-[0_0_0_1px_var(--rule)] transition-[opacity,box-shadow] duration-500" style={{ opacity: i < lit ? 1 : 0.35, boxShadow: i < lit ? "0 0 0 1.5px var(--accent)" : undefined }}>
            <span className="font-mono text-[12px] text-[var(--accent)]">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13.5px] text-[var(--soft)]">Same brand kits you see in Krea, driven from a chat with Claude.</span>
        <Replay onClick={replay} />
      </figcaption>
    </figure>
  );
}

/* ───────────── price: the first five ads, then the plan ───────────── */

function Price() {
  const [made, setMade] = useState(0);
  const FREE = 5;
  const full = made >= FREE;
  return (
    <figure className="kr-plate p-5 sm:p-7">
      <div className="flex items-baseline gap-2">
        <span className="text-[44px] font-semibold leading-none tracking-[-0.05em] text-[var(--ink)] tabular-nums">{Math.max(0, FREE - made)}</span>
        <span className="font-serif text-[26px] italic text-[var(--accent)]">free ads left</span>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2.5">
        {Array.from({ length: FREE }, (_, i) => (
          <div key={i} className="aspect-[9/16] rounded-lg border-2 transition-colors duration-300" style={{ borderStyle: i < made ? "solid" : "dashed", borderColor: i < made ? "var(--accent)" : "var(--rule-strong)", background: i < made ? "rgba(224,85,47,.08)" : "#fff" }} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" disabled={full} onClick={() => setMade((m) => m + 1)} className="kr-press rounded-full bg-[var(--ink)] px-4 py-2 text-[14px] font-medium text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          Generate an ad
        </button>
        {full && <span className="text-[14px] font-medium text-[var(--ink)]">Then a paid plan, <span className="text-[var(--accent)]">Basic from $9</span></span>}
        {made > 0 && <Replay onClick={() => setMade(0)} label="Reset" />}
      </div>
      <figcaption className="mt-4 text-[13.5px] leading-relaxed text-[var(--soft)]">My free account showed a banner: your first 5 ads are free. It was a time-limited offer, so check what your account shows.</figcaption>
    </figure>
  );
}

const KR_CSS = `
.kr{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#e0552f}
.kr-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.kr-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s}
.kr-press:active{transform:scale(.96)}
@keyframes kr-blink{50%{opacity:0}}
.kr-caret{animation:kr-blink 1s steps(1) infinite}
.kr-range{accent-color:var(--accent)}
@media (prefers-reduced-motion:reduce){.kr-caret{animation:none}}
`;

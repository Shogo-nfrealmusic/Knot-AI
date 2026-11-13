"use client";

// /free/61 (Claude Fable 5.2): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–60: paper plate, ink lines, one accent (orange).
// Real (Anthropic's announcement and pricing docs, read Nov 13, 2026): every score, the "up to 30% faster" line, the fast
// mode numbers and all prices. The token amounts in the price figure are whatever the reader sets.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type FableDemoKind = "bench" | "speed" | "price";

const SRC = {
  post: "https://www.anthropic.com/claude-fable-and-mythos-5-2",
  pricing: "https://platform.claude.com/docs/en/about-claude/pricing",
};

export function FableDemo({ kind }: { kind: FableDemoKind }) {
  return (
    <div className="fb mt-5 max-w-2xl">
      <style>{FB_CSS}</style>
      {kind === "bench" && <Bench />}
      {kind === "speed" && <Speed />}
      {kind === "price" && <Price />}
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

const ramp = (t: number, a: number, b: number) => Math.max(0, Math.min(1, (t - a) / (b - a)));
const ease = (x: number) => 1 - (1 - x) ** 3;

function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/03</span>
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

function Tabs<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`fb-press rounded-full px-3 py-1.5 text-[12.5px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ───────── 1 · benchmarks: three tests, the bars count up when you switch ─────────
type BenchId = "code" | "swe" | "robot";
const BENCH: Record<BenchId, { name: string; what: string; rows: { model: string; maker: string; v: number | null; note?: string }[] }> = {
  code: {
    name: "FrontierCode 2.0",
    what: "Agentic coding",
    rows: [
      { model: "Fable 5.2", maker: "Anthropic", v: 49.1, note: "Xhigh effort" },
      { model: "Opus 5.5", maker: "Anthropic", v: 45.5 },
      { model: "GPT-6 Astra", maker: "OpenAI", v: 42.8 },
      { model: "Gemini 4 Carbon", maker: "Google", v: 41.1 },
      { model: "Fable 5.1", maker: "Anthropic", v: 32.4, note: "Xhigh effort" },
    ],
  },
  swe: {
    name: "FrontierSWE v2",
    what: "Agentic coding",
    rows: [
      { model: "Fable 5.2", maker: "Anthropic", v: 69.9 },
      { model: "GPT-6 Astra", maker: "OpenAI", v: 65.5 },
      { model: "Opus 5.5", maker: "Anthropic", v: 62.3 },
      { model: "Gemini 4 Carbon", maker: "Google", v: 61.2 },
      { model: "Fable 5.1", maker: "Anthropic", v: 56.3 },
    ],
  },
  robot: {
    name: "RoboDojo Sim",
    what: "Robotics",
    rows: [
      { model: "Fable 5.2", maker: "Anthropic", v: 64.9, note: "Max effort" },
      { model: "Opus 5.5", maker: "Anthropic", v: 39.4 },
      { model: "GPT-6 Astra", maker: "OpenAI", v: 29.8 },
      { model: "Fable 5.1", maker: "Anthropic", v: 27.6 },
      { model: "Gemini 4 Carbon", maker: "Google", v: null },
    ],
  },
};
const BENCH_TABS: { id: BenchId; label: string }[] = [
  { id: "code", label: "FrontierCode 2.0" },
  { id: "swe", label: "FrontierSWE v2" },
  { id: "robot", label: "RoboDojo Sim" },
];

function Bench() {
  const { ref, t, reduce } = useClock();
  const [id, setId] = useState<BenchId>("code");
  const [t0, setT0] = useState(0);
  const b = BENCH[id];
  const s = reduce ? 9 : t - t0;
  const top = b.rows[0].v ?? 1;
  const second = b.rows[1].v ?? 1;
  return (
    <figure ref={ref} className="fb-plate p-4 sm:p-6">
      <Plate n={1} title="Fable 5.2 against the others" sub="Anthropic's own evaluations · higher is better" />
      <Tabs value={id} options={BENCH_TABS} onChange={(v) => { setId(v); setT0(t); }} label="Benchmark" />
      <ul className="mt-4 space-y-2">
        {b.rows.map((r, i) => {
          const k = ease(ramp(s, i * 0.07, 0.55 + i * 0.07));
          const hot = i === 0;
          return (
            <li key={r.model} className="grid grid-cols-[minmax(0,9.5rem)_1fr_3.2rem] items-center gap-3">
              <span className="min-w-0">
                <span className={`block truncate text-[13.5px] ${hot ? "font-semibold text-[var(--ink)]" : "text-[var(--soft)]"}`}>{r.model}</span>
                <span className="block truncate font-mono text-[10.5px] text-[var(--muted)]">{r.maker}{r.note ? ` · ${r.note}` : ""}</span>
              </span>
              <span className="h-5 rounded-full bg-white shadow-[inset_0_0_0_1px_var(--rule)]">
                {r.v !== null ? <span className="block h-full rounded-full" style={{ width: `${(r.v / top) * 100 * k}%`, background: hot ? "var(--accent)" : "var(--rule-strong)" }} /> : null}
              </span>
              <span className={`text-right font-mono text-[13px] tabular-nums ${hot ? "font-semibold text-[var(--ink)]" : "text-[var(--soft)]"}`}>{r.v !== null ? `${(r.v * k).toFixed(1)}%` : "—"}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-center font-mono text-[11.5px] text-[var(--soft)]">
        {b.what} · Fable 5.2 leads by {(top - second).toFixed(1)} points{id === "robot" ? " (more than double GPT-6 Astra)" : ""}
      </p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        These are the numbers from Anthropic&apos;s launch table, at the effort level shown. A dash means the table has no score for that model.
      </figcaption>
      <Sources links={[{ text: "Anthropic, Introducing Claude Fable 5.2", href: SRC.post }]} />
    </figure>
  );
}

// ───────── 2 · speed: the same output, written by both models; replay it ─────────
const SAMPLE = "def merge(a, b):\n    out = []\n    i = j = 0\n    while i < len(a) and j < len(b):\n        if a[i] <= b[j]:\n            out.append(a[i]); i += 1\n        else:\n            out.append(b[j]); j += 1\n    return out + a[i:] + b[j:]";
type Mode = "standard" | "fast";
const MODES: { id: Mode; label: string }[] = [
  { id: "standard", label: "Standard" },
  { id: "fast", label: "Fast mode" },
];

function Speed() {
  const { ref, t, reduce } = useClock();
  const [mode, setMode] = useState<Mode>("standard");
  const [t0, setT0] = useState(0);
  const s = reduce ? 99 : t - t0;
  const base = 6; // seconds Fable 5.1 takes for the sample in this figure
  const speed52 = mode === "fast" ? 1.3 * 2.5 : 1.3; // "up to 30% faster", fast mode "up to 2.5 times" on top
  const lanes = [
    { name: "Fable 5.1", k: Math.min(1, s / base), done: s >= base, hot: false },
    { name: mode === "fast" ? "Fable 5.2 · fast" : "Fable 5.2", k: Math.min(1, (s * speed52) / base), done: s * speed52 >= base, hot: true },
  ];
  return (
    <figure ref={ref} className="fb-plate p-4 sm:p-6">
      <Plate n={2} title="Up to 30% faster output" sub="the same answer, written by both models" />
      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={mode} options={MODES} onChange={(v) => { setMode(v); setT0(t); }} label="Mode" />
        <button type="button" onClick={() => setT0(t)} className="fb-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
          Replay
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {lanes.map((l) => (
          <div key={l.name} className="fb-card min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className={`text-[13.5px] ${l.hot ? "font-semibold text-[var(--ink)]" : "text-[var(--soft)]"}`}>{l.name}</span>
              <span className="font-mono text-[11px]" style={{ color: l.done ? "var(--accent)" : "var(--muted)" }}>{l.done ? "done" : `${Math.round(l.k * 100)}%`}</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-[var(--page)]">
              <div className="h-full rounded-full" style={{ width: `${l.k * 100}%`, background: l.hot ? "var(--accent)" : "var(--rule-strong)" }} />
            </div>
            <pre className="mt-2 h-[150px] overflow-hidden whitespace-pre-wrap font-mono text-[10.5px] leading-[1.45] text-[var(--soft)]">{SAMPLE.slice(0, Math.round(SAMPLE.length * l.k))}</pre>
          </div>
        ))}
      </div>
      <p className="mt-3 min-h-[20px] text-center font-mono text-[11.5px] text-[var(--soft)]">
        {mode === "fast" ? "Fast mode: token generation up to 2.5 times faster, at $16 / $80 per million tokens." : "Standard: Anthropic says outputs are up to 30% faster than Fable 5.1."}
      </p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The figure draws Anthropic&apos;s two &ldquo;up to&rdquo; numbers as a race. Real speed depends on the request, the effort level and the load.
      </figcaption>
      <Sources links={[{ text: "Anthropic, Introducing Claude Fable 5.2", href: SRC.post }]} />
    </figure>
  );
}

// ───────── 3 · price: set your own token amounts, compare 5.1 and 5.2 ─────────
const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between font-mono text-[11.5px] text-[var(--soft)]">
        <span>{label}</span>
        <span className="tabular-nums text-[var(--ink)]">{value}M tokens</span>
      </span>
      <input type="range" min={1} max={200} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 w-full accent-[var(--accent)]" />
    </label>
  );
}

function Price() {
  const [inp, setInp] = useState(50);
  const [out, setOut] = useState(10);
  const old = inp * 10 + out * 50;
  const now = inp * 8 + out * 40;
  return (
    <figure className="fb-plate p-4 sm:p-6">
      <Plate n={3} title="20% cheaper than Fable 5.1" sub="API price per million tokens · move the sliders" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Input per month" value={inp} onChange={setInp} />
        <Slider label="Output per month" value={out} onChange={setOut} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="fb-card">
          <span className="block font-mono text-[11px] text-[var(--muted)]">Fable 5.1 · $10 in / $50 out</span>
          <span className="mt-1 block text-[20px] font-semibold tabular-nums text-[var(--soft)] line-through decoration-[var(--accent)]">{usd(old)}</span>
        </div>
        <div className="fb-card">
          <span className="block font-mono text-[11px] text-[var(--muted)]">Fable 5.2 · $8 in / $40 out</span>
          <span className="mt-1 block text-[20px] font-semibold tabular-nums text-[var(--accent)]">{usd(now)}</span>
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-[11.5px] text-[var(--soft)]">
        You save {usd(old - now)} a month ({Math.round((1 - now / old) * 100)}%) for the same tokens.
      </p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Base prices only. Prompt caching changes the bill: on Fable 5.2 a cache hit is $0.20 per million tokens, a 5-minute cache write $10.
      </figcaption>
      <Sources links={[{ text: "Claude Platform pricing", href: SRC.pricing }]} />
    </figure>
  );
}

const FB_CSS = `
.fb{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.fb-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.fb-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.fb-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.fb-press:active:not(:disabled){transform:scale(.97)}
`;

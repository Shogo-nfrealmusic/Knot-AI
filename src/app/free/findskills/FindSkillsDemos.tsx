"use client";

// /free/53 (find-skills, Vercel's skill that finds other skills): one small live figure per chapter, drawn for this site
// rather than cut from the reel. Same language as /free/46–52: paper plate, ink lines, one accent, nothing plays off
// screen. Every number is real: 4.2M installs and #1 from skills.sh, the registry numbers from Vercel's "State of agent
// skills" post, the two terminal runs are the real output of `npx skills find` (skills@1.7.4, 2026-11-04), and the
// checks are the ones written in find-skills' own SKILL.md. Clawd is Claude Code's own mascot, drawn from the block
// characters Claude Code prints on start.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type FindSkillsDemoKind = "rank" | "pile" | "search" | "pick";

export function FindSkillsDemo({ kind }: { kind: FindSkillsDemoKind }) {
  return (
    <div className="fs mt-5 max-w-2xl">
      <style>{FS_CSS}</style>
      {kind === "rank" && <Rank />}
      {kind === "pile" && <Pile />}
      {kind === "search" && <Search />}
      {kind === "pick" && <Pick />}
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

/** 4_200_000 → "4.2M", 868_400 → "868.4K" (the way skills.sh and the CLI print installs) */
function installs(n: number) {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
  return `${Math.round(n)}`;
}

function Button({ onClick, children, primary, disabled }: { onClick: () => void; children: React.ReactNode; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`fs-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
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
          className={`fs-press whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium sm:px-3 sm:text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
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
function Clawd({ px = 4, hop = 0, walk = false, t = 0, blink = 0, look = 0 }: { px?: number; hop?: number; walk?: boolean; t?: number; blink?: number; look?: number }) {
  const ph = 2 * px, step = walk ? Math.floor(t * 8) % 2 : 0;
  const eyeH = ph * (1 - 0.85 * Math.max(0, Math.min(1, blink)));
  return (
    <svg width={18 * px} height={6 * ph} viewBox={`0 0 ${18 * px} ${6 * ph}`} aria-hidden style={{ overflow: "visible", transform: `translateY(${-hop * 3 * ph}px)` }}>
      {CLAWD_BODY.map((row, y) => [...row].map((c, x) => c === "1" && <rect key={`${x}-${y}`} x={x * px} y={y * ph} width={px + 0.5} height={ph + 0.5} fill="#D77757" />))}
      {[5, 12].map((ex) => <rect key={ex} x={(ex + look) * px} y={ph + (ph - eyeH) / 2} width={px} height={eyeH} fill="#2A1A14" />)}
      {[4, 6, 11, 13].map((lx, i) => <rect key={lx} x={lx * px} y={4 * ph - (walk && i % 2 === step ? 0.4 * ph : 0)} width={px + 0.5} height={ph + 0.5} fill="#D77757" />)}
    </svg>
  );
}

/* ───────────── rank: #1 on skills.sh, 4.2M installs counted up ───────────── */
const AGENTS = ["Claude Code", "Cursor", "Codex"];
function Rank() {
  const { ref, t, reduce } = useClock();
  const [t0, setT0] = useState(0);
  const s = reduce ? 99 : t - t0;
  const k = ease(ramp(s, 0.3, 1.9));
  const landed = k >= 1;
  return (
    <figure ref={ref} className="fs-plate p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between font-mono text-[12px] text-[var(--soft)]">
        <span>skills.sh leaderboard</span>
        <span>Nov 4, 2026</span>
      </div>
      <div className="relative">
        <span className="absolute -top-5 right-24 sm:right-32">
          <Clawd px={1.8} t={t} hop={landed ? hopAt(s, 1.95) + hopAt(s, 2.45) : 0} blink={hopAt(t % 4, 3.6, 0.2)} look={landed ? 0 : -1} />
        </span>
        <div className="fs-card flex items-center gap-3 sm:gap-4" style={{ boxShadow: `0 0 0 ${landed ? 1.5 : 0}px var(--accent)` }}>
          <span className="w-6 text-center font-mono text-[20px] font-semibold text-[var(--accent)]">1</span>
          <span className="min-w-0">
            <span className="block text-[16px] font-semibold text-[var(--ink)]">find-skills</span>
            <span className="block truncate font-mono text-[12px] text-[var(--muted)]">vercel-labs/skills</span>
          </span>
          <span className="ml-auto text-right">
            <span className="block font-mono text-[22px] font-semibold tabular-nums text-[var(--ink)]">{installs(4.2e6 * k)}</span>
            <span className="block font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--muted)]">installs</span>
          </span>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="fs-chip">by Vercel</span>
        <span className="fs-chip">open source · MIT</span>
        {AGENTS.map((a, i) => (
          <span key={a} className="fs-chip" style={{ opacity: ease(ramp(s, 2 + i * 0.15, 2.3 + i * 0.15)) }}>{a}</span>
        ))}
        <span className="fs-chip text-[var(--muted)]" style={{ opacity: ease(ramp(s, 2.45, 2.75)) }}>OpenCode + 75 more</span>
      </div>
      <div className="mt-4">
        <Button onClick={() => setT0(t)}>Count again</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">find-skills is the most installed skill on skills.sh: 4.2M installs on Nov 4, 2026. The agents are the ones the vercel-labs/skills README lists by name.</figcaption>
    </figure>
  );
}

/* ───────────── pile: one dot = 1,000 skills. Nearly half installed once; 375 skills take 62% of installs ───────────── */
type PileMode = "all" | "once" | "top";
const PILE_OPTS: { id: PileMode; label: string }[] = [
  { id: "all", label: "All skills" },
  { id: "once", label: "Installed once" },
  { id: "top", label: "The top 375" },
];
const COLS = 40, ROWS = 25, GAP = 10; // 1,000 dots
const ONCE_FROM_ROW = 13; // the bottom 12 rows (480 dots) = "nearly half"
const TOP_DOT = { c: 19, r: 12 };
/** the slice of one dot that 375 skills fill (375 / 1,000 = 37.5%) */
function slice(cx: number, cy: number, r: number, f: number) {
  const a = 2 * Math.PI * f - Math.PI / 2;
  return `M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${cx + r * Math.cos(a)} ${cy + r * Math.sin(a)} Z`;
}
function Pile() {
  // no clock here: 1,000 dots animate with CSS transitions, so nothing re-renders per frame
  const ref = useRef<HTMLDivElement>(null);
  const shown = useInView(ref, { amount: 0.2, once: true });
  const [mode, setMode] = useState<PileMode>("all");
  const readout =
    mode === "all"
      ? { big: "1,000,000", small: "agent skills in the registry" }
      : mode === "once"
        ? { big: "Nearly half", small: "were installed exactly once" }
        : { big: "375 skills", small: "0.04% of the registry, 62% of all installs" };
  return (
    <figure ref={ref} className="fs-plate p-4 sm:p-6">
      <Toggle value={mode} options={PILE_OPTS} onChange={setMode} label="Which skills" />
      <div className="mt-4 flex items-baseline gap-2">
        <span key={mode} className="fs-in text-[22px] font-semibold tracking-[-0.01em] text-[var(--ink)]">{readout.big}</span>
        <span className="text-[13px] text-[var(--soft)]">{readout.small}</span>
      </div>
      <svg viewBox={`0 0 ${COLS * GAP} ${ROWS * GAP}`} className="mt-3 block w-full" role="img" aria-label="A grid of 1,000 dots, each standing for 1,000 skills">
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const c = i % COLS, r = Math.floor(i / COLS);
          const once = r >= ONCE_FROM_ROW;
          const isTop = c === TOP_DOT.c && r === TOP_DOT.r;
          const fill = mode === "once" && once ? "#e5413b" : "#15171a";
          const opacity = !shown ? 0 : mode === "top" ? (isTop ? 0 : 0.08) : mode === "once" && !once ? 0.14 : 0.42;
          const delay = mode === "once" ? (r - ONCE_FROM_ROW) * 35 + c * 3 : r * 28 + c * 4;
          return <circle key={i} cx={c * GAP + GAP / 2} cy={r * GAP + GAP / 2} r={3} fill={fill} opacity={opacity} style={{ transition: `opacity .35s ease ${delay}ms, fill .35s ease ${delay}ms` }} />;
        })}
        <g style={{ opacity: mode === "top" ? 1 : 0, transition: "opacity .4s ease .5s" }}>
          <circle cx={TOP_DOT.c * GAP + GAP / 2} cy={TOP_DOT.r * GAP + GAP / 2} r={3.4} fill="#fff" stroke="#15171a" strokeWidth={0.6} />
          <path d={slice(TOP_DOT.c * GAP + GAP / 2, TOP_DOT.r * GAP + GAP / 2, 3.4, 0.375)} fill="var(--accent)" />
          <circle cx={TOP_DOT.c * GAP + GAP / 2} cy={TOP_DOT.r * GAP + GAP / 2} r={9} fill="none" stroke="var(--accent)" strokeWidth={0.8} />
          <text x={TOP_DOT.c * GAP + GAP / 2 + 13} y={TOP_DOT.r * GAP + GAP / 2 + 3} fontSize={8} fill="#15171a" fontFamily="ui-monospace, monospace">375 skills = 37.5% of one dot</text>
        </g>
      </svg>
      <div className="mt-3" style={{ opacity: mode === "top" ? 1 : 0.35, transition: "opacity .3s" }}>
        <div className="flex justify-between font-mono text-[11px] text-[var(--muted)]"><span>share of all installs</span><span>{mode === "top" ? "62%" : "—"}</span></div>
        <div className="mt-1 h-2.5 rounded-full bg-[var(--rule)]">
          <div className="h-2.5 rounded-full bg-[var(--accent)]" style={{ width: mode === "top" ? "62%" : "0%", transition: "width .9s cubic-bezier(.22,1,.36,1) .6s" }} />
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Each dot is 1,000 skills. Switch between the three views: the whole registry, the skills installed exactly once, and the 375 that get most of the installs, from Vercel&apos;s &quot;State of agent skills&quot;.</figcaption>
    </figure>
  );
}

/* ───────────── search: the same need, searched two ways (real CLI output, skills@1.7.4, 2026-11-04) ───────────── */
type SearchMode = "raw" | "fs";
const SEARCH_OPTS: { id: SearchMode; label: string }[] = [
  { id: "raw", label: "You search" },
  { id: "fs", label: "find-skills searches" },
];
type Hit = { pkg: string; n: number; label: string };
const RAW_HITS: Hit[] = [{ pkg: "bestdeejay-design/agent-skills@frontend-performance", n: 3, label: "3" }];
const WEB_PERF: Hit[] = [
  { pkg: "vercel-labs/agent-browser@agent-browser", n: 1.3e6, label: "1.3M" },
  { pkg: "vercel-labs/agent-skills@vercel-react-best-practices", n: 868.4e3, label: "868.4K" },
  { pkg: "vercel-labs/agent-skills@web-design-guidelines", n: 821.8e3, label: "821.8K" },
  { pkg: "vercel-labs/agent-skills@vercel-optimize", n: 120.7e3, label: "120.7K" },
  { pkg: "cloudflare/skills@web-perf", n: 118.3e3, label: "118.3K" },
  { pkg: "currents-dev/playwright-best-practices-skill@playwright-best-practices", n: 102e3, label: "102K" },
  { pkg: "addyosmani/agent-skills@performance-optimization", n: 71.8e3, label: "71.8K" },
];
const WEB_PERF_TOTAL = 20;
const RUNS: Record<SearchMode, { query: string; hits: Hit[]; more: number }> = {
  raw: { query: "make my site faster", hits: RAW_HITS, more: 0 },
  fs: { query: "web performance", hits: WEB_PERF, more: WEB_PERF_TOTAL - WEB_PERF.length },
};
function Search() {
  const { ref, t, reduce } = useClock();
  const [mode, setMode] = useState<SearchMode>("raw");
  const [t0, setT0] = useState(0);
  const s = reduce ? 99 : t - t0;
  const pick = (v: SearchMode) => { setMode(v); setT0(t); };
  const run = RUNS[mode];
  const cmd = `npx skills find "${run.query}"`;
  const lead = mode === "fs" ? 1.1 : 0; // find-skills first turns the words into keywords
  const typed = Math.max(0, Math.min(cmd.length, Math.floor((s - lead - 0.2) * 30)));
  const outAt = lead + 0.4 + cmd.length / 30;
  const shownHits = run.hits.filter((_, i) => s > outAt + 0.35 + i * 0.18).length;
  const done = shownHits === run.hits.length && s > outAt + 0.35 + run.hits.length * 0.18 + 0.2;
  const best = run.hits[0];
  return (
    <figure ref={ref} className="fs-plate p-4 sm:p-6">
      <Toggle value={mode} options={SEARCH_OPTS} onChange={pick} label="Who searches" />
      <div className="mt-4 flex min-h-[34px] flex-wrap items-center gap-2 text-[13px]">
        <span className="fs-card font-mono text-[12.5px]">make my site faster</span>
        {mode === "fs" && (
          <>
            <span className="text-[var(--muted)]" style={{ opacity: ease(ramp(s, 0.3, 0.6)) }}>→</span>
            <span className="fs-card border-[var(--accent)] font-mono text-[12.5px] text-[var(--ink)]" style={{ opacity: ease(ramp(s, 0.5, 0.9)), transform: `translateX(${(1 - ease(ramp(s, 0.5, 0.9))) * -10}px)` }}>web performance</span>
          </>
        )}
      </div>
      <div className="mt-3 min-h-[220px] overflow-hidden rounded-xl bg-[#15171a] p-4 font-mono text-[12px] leading-relaxed sm:text-[12.5px]">
        <div className="text-[#a6e3a1]">~ % <span className="text-[#e7e7ea]">{cmd.slice(0, typed)}</span>{typed < cmd.length && <span className="fs-caret">▍</span>}</div>
        {s > outAt && <div className="fs-in mt-1 text-[#868b92]">Install with npx skills add &lt;owner/repo@skill&gt;</div>}
        {run.hits.slice(0, shownHits).map((h) => (
          <div key={`${mode}-${t0}-${h.pkg}`} className="fs-in mt-1.5 flex gap-2">
            <span className="min-w-0 truncate text-[#c9ccd1]">{h.pkg}</span>
            <span className={`shrink-0 ${mode === "raw" ? "font-semibold text-[#ff8a80]" : "text-[#7dd3e0]"}`}>{h.label} installs</span>
          </div>
        ))}
        {done && run.more > 0 && <div className="fs-in mt-1.5 text-[#868b92]">… and {run.more} more ({WEB_PERF_TOTAL} results)</div>}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--soft)]">best result</span>
        <span className={`font-mono text-[22px] font-semibold tabular-nums ${mode === "raw" ? "text-[#e5413b]" : "text-[var(--ink)]"}`}>{done ? installs(best.n) : "—"}</span>
        <span className="font-mono text-[12px] text-[var(--soft)]">installs</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Two real runs of the Skills CLI on Nov 4, 2026. Your own words find one skill with 3 installs. The keywords find-skills searches with return 20, led by Vercel and Cloudflare (the first seven shown).</figcaption>
    </figure>
  );
}

/* ───────────── pick: the checks written in find-skills' SKILL.md, applied one by one ───────────── */
type Cand = { maker: string; name: string; n: number; label: string; official?: boolean };
// from the two real runs above; "official" = a company's own GitHub org, as SKILL.md's examples (vercel-labs, anthropics, microsoft)
const CANDS: Cand[] = [
  { maker: "vercel-labs", name: "agent-browser", n: 1.3e6, label: "1.3M", official: true },
  { maker: "vercel-labs", name: "vercel-react-best-practices", n: 868.4e3, label: "868.4K", official: true },
  { maker: "cloudflare", name: "web-perf", n: 118.3e3, label: "118.3K", official: true },
  { maker: "currents-dev", name: "playwright-best-practices", n: 102e3, label: "102K" },
  { maker: "addyosmani", name: "performance-optimization", n: 71.8e3, label: "71.8K" },
  { maker: "github", name: "chrome-devtools", n: 15.3e3, label: "15.3K", official: true },
  { maker: "bestdeejay-design", name: "frontend-performance", n: 3, label: "3" },
];
const REPO: Record<string, string> = {
  "agent-browser": "vercel-labs/agent-browser",
  "vercel-react-best-practices": "vercel-labs/agent-skills",
  "web-perf": "cloudflare/skills",
};
const STEPS = [
  { label: "Check the installs", says: "Prefer skills with 1K+ installs. Be cautious with anything under 100." },
  { label: "Check the maker", says: "Official sources are more trustworthy than unknown authors." },
  { label: "Show the best few", says: "Present the options: name, install count, source, the install command." },
];
function Pick() {
  const { ref, t } = useClock();
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [t0, setT0] = useState(0);
  const s = t - t0;
  const order = step >= 2 ? [...CANDS].sort((a, b) => Number(!!b.official) - Number(!!a.official) || b.n - a.n) : CANDS;
  const few = new Set(order.filter((c) => c.n >= 1000 && c.official).slice(0, 3).map((c) => c.name));
  const next = () => { setStep((v) => Math.min(3, v + 1)); setT0(t); };
  const reset = () => { setStep(0); setChosen(null); setT0(t); };
  const choose = (c: Cand) => { if (step === 3 && few.has(c.name)) { setChosen(c.name); setT0(t); } };
  const pickedRepo = chosen ? REPO[chosen] : null;
  return (
    <figure ref={ref} className="fs-plate p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[12px] text-[var(--soft)]">
        {STEPS.map((st, i) => (
          <span key={st.label} className={`rounded-full px-2 py-0.5 ${step > i ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)]"}`}>{i + 1}. {st.label}</span>
        ))}
      </div>
      <p className="min-h-[40px] text-[13.5px] leading-snug text-[var(--ink)]">
        {step === 0 ? "Seven candidates from the two searches above." : step < 3 ? <>SKILL.md: &quot;{STEPS[step - 1].says}&quot;</> : chosen ? "Installed for you, after you say yes." : <>SKILL.md: &quot;{STEPS[2].says}&quot; Tap one to install it.</>}
      </p>
      <ul className="mt-2 space-y-1.5">
        {order.map((c) => {
          const low = step >= 1 && c.n < 1000;
          const out = step >= 3 && !few.has(c.name);
          const isChosen = chosen === c.name;
          const canPick = step === 3 && few.has(c.name);
          return (
            <li key={c.name} className="fs-row" style={{ maxHeight: out ? 0 : 52, opacity: out ? 0 : low ? 0.4 : 1, marginTop: out ? 0 : undefined, overflow: out ? "hidden" : "visible" }}>
              <button
                type="button"
                onClick={() => choose(c)}
                disabled={!canPick}
                className={`fs-card fs-press relative flex w-full items-center gap-2 text-left sm:gap-3 ${canPick ? "cursor-pointer hover:border-[var(--ink)]" : "cursor-default"}`}
                style={{ boxShadow: isChosen ? "0 0 0 1.5px var(--accent)" : undefined }}
                aria-pressed={canPick ? isChosen : undefined}
              >
                <span className="min-w-0">
                  <span className={`block truncate text-[13.5px] ${low ? "line-through" : ""} text-[var(--ink)]`}>{c.name}</span>
                  <span className="flex items-center gap-1.5 font-mono text-[11.5px] text-[var(--muted)]">
                    {c.maker}
                    {step >= 2 && c.official && <span className="fs-in rounded bg-[var(--accent)] px-1 text-[10.5px] text-white">official</span>}
                  </span>
                </span>
                <span className={`ml-auto shrink-0 font-mono text-[13px] tabular-nums ${low ? "text-[#e5413b]" : "text-[var(--ink)]"}`}>{c.label}</span>
                {low && <span className="shrink-0 font-mono text-[11px] text-[#e5413b]">under 100</span>}
                {isChosen && <span className="absolute -top-5 right-16"><Clawd px={1.3} t={t} hop={hopAt(s, 0) + hopAt(s, 0.45)} /></span>}
              </button>
            </li>
          );
        })}
      </ul>
      {pickedRepo && (
        <div key={chosen} className="fs-in mt-3 rounded-xl bg-[#15171a] p-3 font-mono text-[12px] text-[#e7e7ea] sm:text-[12.5px]">
          <span className="text-[#a6e3a1]">~ % </span>npx skills add {pickedRepo}@{chosen} -g -y
        </div>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button primary onClick={next} disabled={step >= 3}>{step === 0 ? "Run the first check" : step < 3 ? "Next check" : "Pick one above"}</Button>
        <Button onClick={reset}>Start over</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The checks are quoted from find-skills&apos; own SKILL.md, applied to real results from the searches above. &quot;Official&quot; here marks a company&apos;s own GitHub account. The best few are the top three by installs after both checks; the install line is the one SKILL.md tells the agent to run (-g installs for every project, -y skips the prompt).</figcaption>
    </figure>
  );
}

const FS_CSS = `
.fs{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.fs-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.fs-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:7px 11px;font-size:13.5px;line-height:1.35}
.fs-chip{border-radius:999px;border:1px solid var(--rule);background:#fff;padding:3px 10px;font-size:12.5px;color:var(--ink)}
.fs-row{overflow:visible;transition:max-height .45s cubic-bezier(.22,1,.36,1),opacity .35s ease}
.fs-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s,box-shadow .2s}
.fs-press:active:not(:disabled){transform:scale(.97)}
@keyframes fs-in{from{opacity:0;transform:translateY(-4px)}}
.fs-in{animation:fs-in .3s ease-out}
@keyframes fs-blink{50%{opacity:0}}
.fs-caret{animation:fs-blink 1s steps(1) infinite;color:#e7e7ea}
@media (prefers-reduced-motion:reduce){.fs-in,.fs-caret{animation:none}}
`;

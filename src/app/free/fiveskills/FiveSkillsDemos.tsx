"use client";

// /free/55 (the only 5 Claude Code skills you need): one small live figure per skill, drawn for this site rather than
// cut from the reel. Same language as /free/46–54: paper plate, ink lines, one accent (Claude Code's orange).
// Real: the avatars (each repo owner's GitHub avatar), star counts (GitHub API, Nov 6, 2026 20:57 JST), the skills.sh
// count (All Time 1,270,748), the find-skills search output (skills@1.7.4, Nov 4, 2026), Superpowers' workflow and my
// own ~/.claude/skills, claude-mem's hook names and storage, Impeccable's commands and the tells its README names,
// and task-observer's review rules. The sessions, files and suggestions inside the figures are examples, and say so.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type FiveSkillsDemoKind = "find" | "plan" | "memory" | "design" | "observer";

export function FiveSkillsDemo({ kind }: { kind: FiveSkillsDemoKind }) {
  return (
    <div className="fv mt-5 max-w-2xl">
      <style>{FV_CSS}</style>
      {kind === "find" && <Find />}
      {kind === "plan" && <Plan />}
      {kind === "memory" && <Memory />}
      {kind === "design" && <Design />}
      {kind === "observer" && <Observer />}
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
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function Button({ onClick, children, primary, disabled }: { onClick: () => void; children: React.ReactNode; primary?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`fv-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
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
          className={`fv-press whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:px-3 sm:text-[13px] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** the skill's name plate: the owner's real GitHub avatar, the repo, and its stars on Nov 6, 2026 */
function Plate({ n, av, name, repo, stars, note }: { n: number; av: string; name: string; repo: string; stars: number; note?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/free/55/${av}.png`} alt={`${repo.split("/")[0]} on GitHub`} width={36} height={36} className="size-9 shrink-0 rounded-[10px] border border-[var(--rule)] bg-white" />
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/05</span>
          <span className="truncate text-[15px] font-semibold text-[var(--ink)]">{name}</span>
        </span>
        <span className="block truncate font-mono text-[11.5px] text-[var(--muted)]">{repo}</span>
      </span>
      <span className="ml-auto shrink-0 text-right">
        <span className="block font-mono text-[14px] font-semibold tabular-nums text-[var(--ink)]">★ {fmt(stars)}</span>
        <span className="block font-mono text-[10.5px] text-[var(--muted)]">{note ?? "stars · Nov 6, 2026"}</span>
      </span>
    </div>
  );
}

/* ───────────── 01 find: a request becomes keywords, skills.sh is searched, the real results come back ───────────── */
const REGISTRY = 1_270_748; // skills.sh, "All Time (1,270,748)", Nov 6, 2026
const ASK = "my landing page, make it fast";
const QUERY = "web performance";
// the first five lines of the real run of `npx skills find "web performance"` (skills@1.7.4, Nov 4, 2026); 20 results in all
const HITS = [
  { pkg: "vercel-labs/agent-browser@agent-browser", label: "1.3M" },
  { pkg: "vercel-labs/agent-skills@vercel-react-best-practices", label: "868.4K" },
  { pkg: "vercel-labs/agent-skills@web-design-guidelines", label: "821.8K" },
  { pkg: "vercel-labs/agent-skills@vercel-optimize", label: "120.7K" },
  { pkg: "cloudflare/skills@web-perf", label: "118.3K" },
];
function Find() {
  const { ref, t, reduce } = useClock();
  const [t0, setT0] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const s = reduce ? 99 : t - t0;
  const typedAsk = Math.floor(ramp(s, 0.2, 1.2) * ASK.length);
  const kw = ease(ramp(s, 1.35, 1.75));
  const cmd = `npx skills find "${QUERY}"`;
  const typedCmd = Math.floor(ramp(s, 1.8, 2.6) * cmd.length);
  const scan = ease(ramp(s, 2.6, 3.5));
  const shown = HITS.filter((_, i) => s > 3.55 + i * 0.15).length;
  const done = s > 3.55 + HITS.length * 0.15 + 0.1;
  const again = () => { setPicked(null); setT0(t); };
  return (
    <figure ref={ref} className="fv-plate p-4 sm:p-6">
      <Plate n={1} av="av_fs" name="find-skills" repo="vercel-labs/skills" stars={38_326} note="stars (the whole Skills CLI)" />
      <div className="flex min-h-[34px] flex-wrap items-center gap-2">
        <span className="fv-card font-mono text-[12.5px]">
          <span className="text-[var(--muted)]">you: </span>{ASK.slice(0, typedAsk)}
          {typedAsk < ASK.length && <span className="fv-caret">▍</span>}
        </span>
        <span className="text-[var(--muted)]" style={{ opacity: kw }}>→</span>
        <span className="fv-card font-mono text-[12.5px]" style={{ opacity: kw, borderColor: "var(--accent)", transform: `translateX(${(1 - kw) * -10}px)` }}>{QUERY}</span>
      </div>
      <div className="mt-3 flex items-center gap-3 font-mono text-[11.5px] text-[var(--soft)]">
        <span className="shrink-0">skills.sh</span>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--rule)]">
          <div className="h-1.5 rounded-full bg-[var(--accent)]" style={{ width: `${scan * 100}%` }} />
        </div>
        <span className="w-[86px] shrink-0 text-right tabular-nums text-[var(--ink)]">{fmt(REGISTRY * scan)}</span>
      </div>
      <div className="mt-3 min-h-[214px] overflow-hidden rounded-xl bg-[#15171a] p-4 font-mono text-[12px] leading-relaxed sm:text-[12.5px]">
        <div className="text-[#a6e3a1]">~ % <span className="text-[#e7e7ea]">{cmd.slice(0, typedCmd)}</span>{typedCmd > 0 && typedCmd < cmd.length && <span className="fv-caret">▍</span>}</div>
        {HITS.slice(0, shown).map((h) => {
          const on = picked === h.pkg;
          return (
            <button
              key={`${t0}-${h.pkg}`}
              type="button"
              disabled={!done}
              onClick={() => setPicked(h.pkg)}
              className={`fv-in mt-1 flex w-full items-center gap-2 rounded-md px-1.5 py-0.5 text-left transition-colors ${done ? "cursor-pointer hover:bg-white/10" : "cursor-default"} ${on ? "bg-white/10" : ""}`}
              aria-pressed={on}
            >
              <span className="min-w-0 truncate text-[#c9ccd1]">{h.pkg}</span>
              <span className="ml-auto shrink-0 text-[#7dd3e0]">{h.label}</span>
              <span className={`w-4 shrink-0 text-center ${on ? "text-[#a6e3a1]" : "text-[#5b6068]"}`}>{on ? "✓" : "+"}</span>
            </button>
          );
        })}
        {done && <div className="fv-in mt-1 px-1.5 text-[#868b92]">… 15 more (20 results)</div>}
        {picked && (
          <div key={picked} className="fv-in mt-2 border-t border-white/10 pt-2">
            <span className="text-[#a6e3a1]">~ % </span>
            <span className="text-[#e7e7ea]">npx skills add {picked} -g -y</span>
            <div className="text-[#a6e3a1]">✓ installed</div>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={again}>Search again</Button>
        <span className="text-[12.5px] text-[var(--soft)]">{done ? (picked ? "Installed, because you said yes." : "Tap a result to install it.") : "Searching…"}</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The request is an example. The search is a real run of the Skills CLI (skills@1.7.4, Nov 4, 2026): the first five of its 20 results, with installs. The install line is the one find-skills&apos; SKILL.md tells the agent to run once you say yes. skills.sh counted 1,270,748 skills on Nov 6, 2026.
      </figcaption>
    </figure>
  );
}

/* ───────────── 02 plan: Superpowers' basic workflow, step by step, and the seven in my own setup ───────────── */
type PlanView = "flow" | "mine";
const PLAN_OPTS: { id: PlanView; label: string }[] = [
  { id: "flow", label: "The workflow" },
  { id: "mine", label: "In my setup" },
];
// README, "The Basic Workflow" (shortened)
const FLOW = [
  { skill: "brainstorming", says: "Before building anything: asks what you actually want, and why." },
  { skill: "using-git-worktrees", says: "After you approve the design: a clean workspace on a new branch." },
  { skill: "writing-plans", says: "Bite-sized tasks of 2–5 minutes, each with file paths and checks." },
  { skill: "executing-plans", says: "Works through the plan (or one fresh subagent per task)." },
  { skill: "test-driven-development", says: "Failing test first, watch it fail, then the code." },
  { skill: "requesting-code-review", says: "Reviews against the plan. Critical issues block progress." },
  { skill: "finishing-a-development-branch", says: "Verifies the tests, then merge, PR, keep or discard." },
];
const CODE_FROM = 3; // code is written from executing-plans on
// ~/.claude/skills/SOURCES.md: the seven from obra/superpowers (commit 8ca22db, MIT)
const MINE = ["systematic-debugging", "test-driven-development", "writing-plans", "executing-plans", "verification-before-completion", "using-git-worktrees", "requesting-code-review"];
function Plan() {
  const [view, setView] = useState<PlanView>("flow");
  const [step, setStep] = useState(0);
  const coding = step >= CODE_FROM;
  return (
    <figure className="fv-plate p-4 sm:p-6">
      <Plate n={2} av="av_sp" name="Superpowers" repo="obra/superpowers" stars={313_307} />
      <Toggle value={view} options={PLAN_OPTS} onChange={setView} label="What to show" />
      {view === "flow" ? (
        <>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="fv-card font-mono text-[12.5px]"><span className="text-[var(--muted)]">you: </span>build me a booking page</div>
            <div className="fv-card flex items-center gap-2 font-mono text-[12.5px]" style={{ borderColor: coding ? "var(--rule)" : "#e5413b" }}>
              <span className={coding ? "text-[var(--ink)]" : "text-[#e5413b] line-through"}>edit src/app.tsx</span>
              <span key={String(coding)} className={`fv-in ml-auto shrink-0 text-[11px] ${coding ? "text-[#2f8f4e]" : "text-[#e5413b]"}`}>{coding ? "✓ plan approved" : "waits for the plan"}</span>
            </div>
          </div>
          <ol className="mt-3 space-y-1.5">
            {FLOW.map((f, i) => {
              const done = i < step, now = i === step;
              return (
                <li key={f.skill} className="fv-card flex items-start gap-3 py-2 transition-[box-shadow,opacity] duration-300" style={{ boxShadow: now ? "0 0 0 1.5px var(--accent)" : undefined, opacity: i > step ? 0.5 : 1 }}>
                  <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${done ? "bg-[var(--ink)] text-white" : now ? "bg-[var(--accent)] text-white" : "border border-[var(--rule-strong)] text-[var(--muted)]"}`}>{done ? "✓" : i + 1}</span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[12.5px] text-[var(--ink)]">{f.skill}</span>
                    {(now || done) && <span className="fv-in block text-[12.5px] leading-snug text-[var(--soft)]">{f.says}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button primary onClick={() => setStep((v) => Math.min(FLOW.length, v + 1))} disabled={step >= FLOW.length}>{step >= FLOW.length ? "Done" : step === 0 ? "Answer the questions" : "Next step"}</Button>
            <Button onClick={() => setStep(0)}>Start over</Button>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-xl bg-[#15171a] p-4 font-mono text-[12px] leading-relaxed sm:text-[12.5px]">
          <div className="text-[#a6e3a1]">~ % <span className="text-[#e7e7ea]">ls ~/.claude/skills</span></div>
          {MINE.map((m, i) => (
            <div key={m} className="fv-in mt-0.5 flex items-center gap-2" style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}>
              <span className="text-[#7dd3e0]">{m}/</span>
              <span className="ml-auto shrink-0 text-[11px] text-[#d77757]">obra/superpowers</span>
            </div>
          ))}
          <div className="fv-in mt-2 border-t border-white/10 pt-2 text-[#868b92]" style={{ animationDelay: "750ms", animationFillMode: "both" }}>7 of my skills come from Superpowers (commit 8ca22db, MIT)</div>
        </div>
      )}
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        {view === "flow"
          ? "Step through the basic workflow from the Superpowers README. The skills trigger on their own; no code is written until the design and plan are approved. The request is an example."
          : "The skill folders in my own Claude Code setup that come from obra/superpowers, as listed in my skills' SOURCES.md."}
      </figcaption>
    </figure>
  );
}

/* ───────────── 03 memory: claude-mem's hooks save observations, the next session starts with them ───────────── */
type MemMode = "with" | "without";
const MEM_OPTS: { id: MemMode; label: string }[] = [
  { id: "with", label: "With claude-mem" },
  { id: "without", label: "Without" },
];
// an example session; the hook names are claude-mem's own (README, "Lifecycle Hooks")
const S1 = [
  { hook: "PostToolUse", line: "Read package.json", obs: "Next.js 16 + Supabase" },
  { hook: "PostToolUse", line: "Edit src/lib/db.ts", obs: "bookings live in Postgres" },
  { hook: "PostToolUse", line: "Bash npm test → 12 passed", obs: "tests run with npm test" },
  { hook: "SessionEnd", line: "Summary: auth stays in middleware", obs: "auth stays in middleware" },
];
function Memory() {
  const { ref, t, reduce } = useClock();
  const [mode, setMode] = useState<MemMode>("with");
  const [t0, setT0] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const s = reduce ? 99 : t - t0;
  const s1 = S1.filter((_, i) => s > 0.4 + i * 0.6).length;
  const ended = s > 0.4 + S1.length * 0.6 + 0.3;
  const sn = next === null ? -1 : reduce ? 99 : t - next;
  const saved = mode === "with" ? s1 : 0;
  const recalled = mode === "with" ? S1.filter((_, i) => sn > 0.45 + i * 0.15).length : 0;
  const restart = (m: MemMode) => { setMode(m); setNext(null); setT0(t); };
  return (
    <figure ref={ref} className="fv-plate p-4 sm:p-6">
      <Plate n={3} av="av_cm" name="claude-mem" repo="thedotmack/claude-mem" stars={113_770} />
      <Toggle value={mode} options={MEM_OPTS} onChange={restart} label="Memory" />
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        <div className="fv-card min-h-[188px] p-3">
          <div className="flex justify-between font-mono text-[11px] text-[var(--muted)]"><span>session 1</span><span>{ended ? "SessionEnd" : "working…"}</span></div>
          {S1.slice(0, s1).map((e) => (
            <div key={`${t0}-${e.line}`} className="fv-in mt-1.5 font-mono text-[12px] leading-snug">
              <span className="text-[var(--ink)]">{e.line}</span>
              <span className="block text-[10.5px] text-[var(--muted)]">{e.hook}{mode === "with" ? " → saved" : ""}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-row items-center justify-center gap-2 sm:flex-col">
          <div className="rounded-xl border border-dashed px-3 py-2 text-center font-mono text-[11px] leading-tight" style={{ borderColor: mode === "with" ? "var(--accent)" : "var(--rule-strong)", color: mode === "with" ? "var(--ink)" : "var(--muted)" }}>
            <span className="block">SQLite</span>
            <span className="block">+ Chroma</span>
            <span className="mt-1 block text-[18px] font-semibold tabular-nums" style={{ color: mode === "with" ? "var(--accent)" : "var(--muted)" }}>{saved}</span>
            <span className="block text-[10px] text-[var(--muted)]">{mode === "with" ? "observations" : "nothing kept"}</span>
          </div>
        </div>
        <div className="fv-card min-h-[188px] p-3" style={{ opacity: next === null ? 0.45 : 1 }}>
          <div className="flex justify-between font-mono text-[11px] text-[var(--muted)]"><span>session 2</span><span>{next === null ? "not started" : "SessionStart"}</span></div>
          {next !== null && mode === "with" && (
            <>
              <div className="fv-in mt-1.5 font-mono text-[11px] text-[var(--accent)]">Context from previous sessions</div>
              {S1.slice(0, recalled).map((e) => (
                <div key={`${next}-${e.obs}`} className="fv-in mt-1 font-mono text-[12px] leading-snug text-[var(--ink)]">· {e.obs}</div>
              ))}
            </>
          )}
          {next !== null && mode === "without" && (
            <div className="fv-in mt-1.5 font-mono text-[12px] leading-snug text-[#e5413b]">&gt; let me explain the project again…</div>
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button primary onClick={() => setNext(t)} disabled={!ended}>Start session 2</Button>
        <Button onClick={() => restart(mode)}>Replay</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The session is an example. The parts are claude-mem&apos;s own: lifecycle hooks capture what Claude does, the observations and summaries go into a local SQLite database with Chroma for search, and the next session starts with that context. Switch it off to see session 2 start from nothing.
      </figcaption>
    </figure>
  );
}

/* ───────────── 04 design: the default "AI slop" page, Impeccable's detector, then bolder ───────────── */
type DesignMode = "default" | "detect" | "bolder";
// the tells named in Impeccable's README ("Why")
const TELLS = ["Inter for everything", "Purple-to-blue gradient", "Cards nested in cards", "Gray text on a colored background", "An icon tile above every heading"];
function Design() {
  const [mode, setMode] = useState<DesignMode>("default");
  const slop = mode !== "bolder";
  const flag = (i: number) =>
    mode === "detect" ? (
      <span className="fv-in absolute -right-1.5 -top-1.5 z-10 flex size-5 items-center justify-center rounded-full bg-[#e5413b] font-mono text-[10.5px] font-semibold text-white" style={{ animationDelay: `${i * 90}ms`, animationFillMode: "both" }}>{i + 1}</span>
    ) : null;
  return (
    <figure className="fv-plate p-4 sm:p-6">
      <Plate n={4} av="av_im" name="Impeccable" repo="pbakaus/impeccable" stars={104_361} />
      <div className="overflow-hidden rounded-xl border border-[var(--rule)] bg-white">
        <div className="flex items-center gap-1.5 border-b border-[var(--rule)] px-3 py-2">
          {[0, 1, 2].map((i) => <span key={i} className="size-2 rounded-full bg-[var(--rule-strong)]" />)}
          <span className="ml-2 font-mono text-[11px] text-[var(--muted)]">localhost:3000</span>
        </div>
        {slop ? (
          <div className="relative p-4 sm:p-5" style={{ background: "linear-gradient(135deg,#7c5cff,#3a8bfd)", fontFamily: "Inter, ui-sans-serif, system-ui" }}>
            <div className="relative">
              {flag(1)}
              <div className="relative inline-flex">
                {flag(4)}
                <span className="flex size-9 items-center justify-center rounded-xl bg-white/25 text-[16px] text-white">✦</span>
              </div>
              <div className="relative mt-2 inline-block">
                {flag(0)}
                <p className="text-[19px] font-semibold text-white">Build faster with AI</p>
              </div>
              <div className="relative mt-1 max-w-[30ch]">
                {flag(3)}
                <p className="text-[12.5px] text-[#c9c6dd]">The all-in-one platform that helps your team ship better products, faster.</p>
              </div>
            </div>
            <div className="relative mt-3 rounded-2xl bg-white/15 p-2">
              {flag(2)}
              <div className="grid grid-cols-3 gap-2">
                {["Fast", "Secure", "Scalable"].map((c) => (
                  <div key={c} className="rounded-xl bg-white/20 p-2">
                    <div className="rounded-lg bg-white/25 px-2 py-1.5 text-[11px] text-white">{c}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div key="bolder" className="fv-in grid grid-cols-[1fr_auto] items-end gap-3 bg-[#f6f1e7] p-4 sm:p-5">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#c2410c]">Ship it this week</p>
              <p className="mt-1 text-[30px] font-black leading-[0.95] tracking-[-0.04em] text-[#1a1714] sm:text-[36px]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Build<br />faster.</p>
              <p className="mt-2 max-w-[30ch] text-[12.5px] leading-snug text-[#4a443c]">Your team ships the product. We keep it fast, safe and ready for the next million users.</p>
              <span className="mt-3 inline-block rounded-md bg-[#1a1714] px-3 py-1.5 text-[12px] font-semibold text-[#f6f1e7]">Start building</span>
            </div>
            <svg viewBox="0 0 90 110" className="h-[118px] w-auto" aria-hidden>
              <rect x="6" y="6" width="78" height="98" fill="none" stroke="#1a1714" strokeWidth="1.5" />
              <path d="M6 78 L34 50 L52 66 L66 54 L84 72 L84 104 L6 104 Z" fill="#1a1714" />
              <circle cx="64" cy="28" r="10" fill="#c2410c" />
            </svg>
          </div>
        )}
      </div>
      <div className="mt-3 min-h-[44px]">
        {mode === "detect" && (
          <ol className="grid gap-x-4 gap-y-0.5 sm:grid-cols-2">
            {TELLS.map((tell, i) => (
              <li key={tell} className="fv-in flex items-center gap-2 text-[12.5px] text-[var(--ink)]" style={{ animationDelay: `${i * 90}ms`, animationFillMode: "both" }}>
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#e5413b] font-mono text-[9.5px] text-white">{i + 1}</span>{tell}
              </li>
            ))}
          </ol>
        )}
        {mode === "default" && <p className="text-[12.5px] text-[var(--soft)]">What an agent builds with no other guidance. Run the detector.</p>}
        {mode === "bolder" && <p className="fv-in text-[12.5px] text-[var(--soft)]">One idea, one accent, no nested cards. Run <span className="font-mono">critique</span> or <span className="font-mono">polish</span> next.</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button primary={mode === "default"} onClick={() => setMode("detect")}><span className="font-mono">npx impeccable detect</span></Button>
        <Button primary={mode === "detect"} onClick={() => setMode("bolder")}><span className="font-mono">/impeccable bolder the hero</span></Button>
        <Button onClick={() => setMode("default")}>Reset</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The page is drawn for this figure. The five tells are the ones the Impeccable README names; its detector checks 62 deterministic rules, with no LLM and no API key. <span className="font-mono">bolder</span> is one of its 24 commands, next to <span className="font-mono">polish</span>, <span className="font-mono">critique</span> and <span className="font-mono">audit</span>.
      </figcaption>
    </figure>
  );
}

/* ───────────── 05 observer: it watches a session, logs suggestions, and you approve what gets installed ───────────── */
type Kind = "correction" | "gap" | "itself";
// an example session; the three kinds are the ones the task-observer README lists
const OBS: { said: string; kind: Kind; skill: string; fix: string }[] = [
  { said: "You only installed results from official makers", kind: "correction", skill: "find-skills", fix: "Show official makers first" },
  { said: "You asked for the test command in every task", kind: "correction", skill: "writing-plans", fix: "Put the test command in each task" },
  { said: "You changed the accent back to the brand orange", kind: "correction", skill: "impeccable", fix: "Read the brand color from DESIGN.md first" },
  { said: "You wrote release notes by hand, third time", kind: "gap", skill: "release-notes", fix: "New skill candidate" },
  { said: "A correction in a code comment went unnoticed", kind: "itself", skill: "task-observer", fix: "Watch code comments too" },
];
const KIND_LABEL: Record<Kind, string> = { correction: "correction", gap: "gap", itself: "its own blind spot" };
function Observer() {
  const { ref, t, reduce } = useClock();
  const [t0, setT0] = useState(0);
  const [stage, setStage] = useState<"watch" | "review" | "installed">("watch");
  const [ok, setOk] = useState<boolean[]>(() => OBS.map(() => true));
  const s = reduce ? 99 : t - t0;
  const logged = OBS.filter((_, i) => s > 0.4 + i * 0.7).length;
  const ready = logged === OBS.length;
  const reset = () => { setStage("watch"); setOk(OBS.map(() => true)); setT0(t); };
  const toggle = (i: number) => setOk((v) => v.map((x, j) => (j === i ? !x : x)));
  const approved = ok.filter(Boolean).length;
  return (
    <figure ref={ref} className="fv-plate p-4 sm:p-6">
      <Plate n={5} av="av_to" name="task-observer" repo="rebelytics/one-skill-to-rule-them-all" stars={3_753} />
      <div className="flex items-baseline justify-between font-mono text-[11.5px] text-[var(--muted)]">
        <span>{stage === "watch" ? "observation log" : stage === "review" ? "review · you decide" : "updated bundle installed"}</span>
        <span className="tabular-nums">{stage === "watch" ? `${logged} logged` : `${approved} approved`}</span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {OBS.slice(0, logged).map((o, i) => {
          const on = ok[i];
          const inReview = stage !== "watch";
          const live = stage === "installed" && on;
          return (
            <li key={`${t0}-${o.skill}`} className="fv-in">
              <button
                type="button"
                disabled={stage !== "review"}
                onClick={() => toggle(i)}
                aria-pressed={stage === "review" ? on : undefined}
                className={`fv-card fv-press flex w-full items-start gap-3 text-left ${stage === "review" ? "cursor-pointer hover:border-[var(--ink)]" : "cursor-default"}`}
                style={{ opacity: inReview && !on ? 0.45 : 1, boxShadow: live ? "0 0 0 1.5px var(--accent)" : undefined }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] leading-snug text-[var(--soft)]">{o.said}</span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-[12px]">
                    <span className="text-[var(--ink)]">{o.skill}</span>
                    <span className="text-[var(--muted)]">· {KIND_LABEL[o.kind]}</span>
                  </span>
                  <span className="block text-[12.5px] leading-snug text-[var(--ink)]">→ {o.fix}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px]">
                  {stage === "watch" && <span className="text-[var(--muted)]">logged</span>}
                  {stage === "review" && <span className={on ? "text-[#2f8f4e]" : "text-[var(--muted)]"}>{on ? "✓ approve" : "skip"}</span>}
                  {stage === "installed" && (on ? <span className="text-[var(--accent)]">↑ updated</span> : <span className="text-[var(--muted)]">unchanged</span>)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 min-h-[20px] text-[12.5px] text-[var(--soft)]">
        {stage === "watch" ? (ready ? "Nothing has changed yet. Review the suggestions." : "Watching the session…") : stage === "review" ? "Tap a suggestion to skip it. Nothing goes live until you install." : `${approved} of ${OBS.length} suggestions are live. The rest stay in the log.`}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {stage === "watch" && <Button primary onClick={() => setStage("review")} disabled={!ready}>Review</Button>}
        {stage === "review" && <Button primary onClick={() => setStage("installed")}>Install the updated bundle</Button>}
        <Button onClick={reset}>Replay</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The session and suggestions are examples. The rules are task-observer&apos;s own: it logs corrections, gaps no skill covers yet, and its own blind spots; it never edits your installed skills by itself; you approve each change, and nothing goes live until you install the updated bundle.
      </figcaption>
    </figure>
  );
}

const FV_CSS = `
.fv{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.fv-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.fv-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:7px 11px;font-size:13.5px;line-height:1.35}
.fv-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s,box-shadow .2s}
.fv-press:active:not(:disabled){transform:scale(.97)}
@keyframes fv-in{from{opacity:0;transform:translateY(-4px)}}
.fv-in{animation:fv-in .3s ease-out}
@keyframes fv-blink{50%{opacity:0}}
.fv-caret{animation:fv-blink 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.fv-in,.fv-caret{animation:none}}
`;

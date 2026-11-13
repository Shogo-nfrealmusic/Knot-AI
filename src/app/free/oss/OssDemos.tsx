"use client";

// /free/65 (Claude for Open Source): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–64: paper plate, ink lines, one accent (orange).
// Real: every threshold, quote and condition is from claude.com/contact-sales/claude-for-oss and the program terms
// (anthropic.com/claude-for-oss-terms), read on 2026-11-14. The checker only compares what the visitor enters with the
// published thresholds (qualify.ts). It never says "approved", and nothing typed here leaves the page.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { EMPTY, FALLBACK, ROUTES, THRESHOLDS, countWords, routesMet, toCount, type Inputs, type RouteId } from "./qualify";

export type OssDemoKind = "value" | "checker" | "ready" | "draft" | "after";

const APPLY = "https://claude.com/contact-sales/claude-for-oss";
const TERMS = "https://www.anthropic.com/claude-for-oss-terms";
const PRICING = "https://claude.com/pricing";

export function OssDemo({ kind }: { kind: OssDemoKind }) {
  return (
    <div className="os mt-5 max-w-2xl">
      <style>{OS_CSS}</style>
      {kind === "value" && <Value />}
      {kind === "checker" && <Checker />}
      {kind === "ready" && <Ready />}
      {kind === "draft" && <Draft />}
      {kind === "after" && <After />}
    </div>
  );
}

function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/05</span>
        <span className="text-[15px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block font-mono text-[11.5px] text-[var(--muted)]">{sub}</span>
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

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `os-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const APPLY_BTN = `os-press inline-flex h-10 items-center justify-center rounded-lg bg-[var(--ink)] px-4 text-[13.5px] font-medium text-white ${FOCUS}`;
const TEXT_LINK = "text-[13px] font-medium text-[var(--soft)] underline decoration-[var(--rule-strong)] underline-offset-4 hover:text-[var(--ink)]";

/** two or more choices, one of them on */
function Choice<T extends string>({ label, options, value, set }: { label: string; options: { id: T; label: string }[]; value: T | null; set: (id: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => set(o.id)}
          className={`os-press rounded-full px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ───────── 1 · what you get: six months of the $200 plan, one tile per month ─────────
const MONTHS = 6;

function Value() {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const [run, setRun] = useState(0);
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setLit(n);
      if (n >= MONTHS) clearInterval(id);
    }, 260);
    return () => clearInterval(id);
  }, [visible, reduce, run]);
  const shown = reduce ? MONTHS : lit;
  return (
    <figure ref={ref} className="os-plate p-4 sm:p-6">
      <Plate n={1} title="Six months of Claude Ultra" sub="one tile per month · press Replay" />
      <ol className="grid grid-cols-6 gap-1 sm:gap-2" aria-label="Six months, each one month of the 200 dollar plan">
        {Array.from({ length: MONTHS }, (_, i) => {
          const on = i < shown;
          return (
            <li
              key={i}
              className="min-w-0 rounded-[10px] border py-2.5 text-center sm:py-3.5"
              style={{
                borderColor: on ? "var(--accent)" : "var(--rule)",
                background: on ? "var(--accent)" : "#fff",
                transition: "background-color .35s, border-color .35s",
              }}
            >
              <span className="block font-mono text-[10.5px]" style={{ color: on ? "rgba(255,255,255,.85)" : "var(--muted)" }}>
                M{i + 1}
              </span>
              <span className="mt-0.5 block text-[11.5px] font-semibold tabular-nums sm:text-[15px]" style={{ color: on ? "#fff" : "var(--rule-strong)" }}>
                $200
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[15px] font-semibold tabular-nums text-[var(--ink)]" style={{ opacity: shown >= MONTHS ? 1 : 0.35, transition: "opacity .35s" }}>
          6 × $200 = <span className="text-[var(--accent)]">$1,200</span> of plan value
        </p>
        <button
          type="button"
          className={BTN}
          disabled={!!reduce}
          onClick={() => {
            setLit(0);
            setRun((v) => v + 1);
          }}
        >
          Replay
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Anthropic&apos;s own headline: &ldquo;Thank you for everything you ship. 6 months of Claude Ultra on us.&rdquo; Ultra is listed at $200 per month on the pricing page, so six months is $1,200 of plan value.
      </figcaption>
      <Sources
        links={[
          { text: "claude.com, Claude for Open Source", href: APPLY },
          { text: "claude.com/pricing", href: PRICING },
        ]}
      />
    </figure>
  );
}

// ───────── 2 · the route checker: enter your numbers, a route lights when its published threshold is met ─────────
function CountField({ label, value, set, threshold }: { label: string; value: string; set: (v: string) => void; threshold: number }) {
  const n = toCount(value);
  const ok = n >= threshold;
  return (
    <label className="os-card block">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-[12.5px] font-medium text-[var(--ink)]">{label}</span>
        <span className="shrink-0 font-mono text-[11px]" style={{ color: ok ? "var(--accent)" : "var(--muted)" }}>
          {ok ? "met" : "needs"} {threshold.toLocaleString("en-US")}+
        </span>
      </span>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0"
        value={value}
        maxLength={15}
        onChange={(e) => set(e.target.value)}
        className={`mt-1.5 w-full rounded-lg border border-[var(--rule-strong)] bg-white px-3 py-2 text-[16px] font-semibold tabular-nums text-[var(--ink)] placeholder:text-[var(--rule-strong)] ${FOCUS}`}
      />
      <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--rule)]" aria-hidden>
        <span className="block h-full rounded-full" style={{ width: `${Math.min(1, n / threshold) * 100}%`, background: ok ? "var(--accent)" : "var(--ink)", transition: "width .25s, background-color .25s" }} />
      </span>
    </label>
  );
}

/** the big number of a slider route, what it counts, and whether it meets the threshold */
function Counter({ value, label, on, needs }: { value: string; label: string; on: boolean; needs: string }) {
  return (
    <>
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-[30px] font-semibold leading-none tabular-nums" style={{ color: on ? "var(--accent)" : "var(--ink)", transition: "color .25s" }}>
          {value}
        </span>
        <span className="shrink-0 font-mono text-[11px]" style={{ color: on ? "var(--accent)" : "var(--muted)" }}>
          {on ? "met" : "needs"} {needs}
        </span>
      </span>
      <span className="mt-1.5 block text-[12.5px] leading-snug text-[var(--soft)]">{label}</span>
    </>
  );
}

function Slider({ label, value, set, min, max, step }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number }) {
  return (
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => set(Number(e.target.value))}
      className="mt-3 block h-8 w-full accent-[var(--accent)]"
    />
  );
}

function Checker() {
  const [tab, setTab] = useState<RouteId>("active");
  const [repos, setRepos] = useState("");
  const [packages, setPackages] = useState("");
  const [downloads, setDownloads] = useState("");
  const [core, setCore] = useState<"yes" | "no" | null>(null);
  const [prs, setPrs] = useState(EMPTY.mergedPrs);
  const [people, setPeople] = useState(EMPTY.externalContributors);
  const [score, setScore] = useState(EMPTY.openssfScore);
  const inputs: Inputs = {
    dependentRepos: toCount(repos),
    dependentPackages: toCount(packages),
    monthlyDownloads: toCount(downloads),
    listedCommitter: core === "yes",
    mergedPrs: prs,
    externalContributors: people,
    openssfScore: score,
  };
  const met = routesMet(inputs);
  const route = ROUTES.find((r) => r.id === tab)!;
  const on = met.includes(tab);
  const touched = repos !== "" || packages !== "" || downloads !== "" || core !== null || prs > 0 || people > 0 || score > 0;
  const reset = () => {
    setRepos("");
    setPackages("");
    setDownloads("");
    setCore(null);
    setPrs(0);
    setPeople(0);
    setScore(0);
  };
  return (
    <figure className="os-plate p-4 sm:p-6">
      <Plate n={2} title="The route checker" sub="pick a route · enter your numbers" />
      <div role="tablist" aria-label="The five routes" className="flex flex-wrap gap-1.5">
        {ROUTES.map((r) => {
          const lit = met.includes(r.id);
          const current = tab === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="tab"
              id={`os-tab-${r.id}`}
              aria-selected={current}
              aria-controls="os-route-panel"
              aria-label={`${r.name}${lit ? ", threshold met" : ""}`}
              onClick={() => setTab(r.id)}
              className={`os-press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${current ? "bg-[var(--ink)] text-white" : "bg-white text-[var(--soft)] shadow-[0_0_0_1px_var(--rule)] hover:text-[var(--ink)]"}`}
            >
              <span aria-hidden className="size-2 rounded-full" style={{ background: lit ? "var(--accent)" : current ? "rgba(255,255,255,.35)" : "var(--rule-strong)", transition: "background-color .25s" }} />
              {r.short}
            </button>
          );
        })}
      </div>

      <div id="os-route-panel" role="tabpanel" aria-labelledby={`os-tab-${tab}`} className="mt-3">
        <div className="os-card">
          <span className="flex items-baseline justify-between gap-2">
            <span className="text-[14px] font-semibold text-[var(--ink)]">{route.name}</span>
            <span className="shrink-0 font-mono text-[10.5px] text-[var(--muted)]">official wording</span>
          </span>
          <span className="mt-1 block text-[13px] leading-relaxed text-[var(--soft)]">&ldquo;{route.quote}&rdquo;</span>
        </div>

        {tab === "maintainers" && (
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <CountField label="Dependent repos" value={repos} set={setRepos} threshold={THRESHOLDS.dependentRepos} />
            <CountField label="Dependent packages" value={packages} set={setPackages} threshold={THRESHOLDS.dependentPackages} />
            <CountField label="Monthly downloads" value={downloads} set={setDownloads} threshold={THRESHOLDS.monthlyDownloads} />
          </div>
        )}

        {tab === "core" && (
          <div className="os-card mt-2">
            <span className="block text-[12.5px] font-medium text-[var(--ink)]">Are you a listed committer or maintainer on a project like these?</span>
            <span className="mt-2 block">
              <Choice
                label="Listed committer or maintainer"
                options={[
                  { id: "yes", label: "Yes" },
                  { id: "no", label: "No" },
                ]}
                value={core}
                set={setCore}
              />
            </span>
          </div>
        )}

        {tab === "active" && (
          <div className="os-card mt-2">
            <Counter value={String(prs)} label="pull requests merged into repos you don't own, last 12 months" on={on} needs={`${THRESHOLDS.mergedPrs}+`} />
            <div className="mx-auto mt-3 grid max-w-[260px] grid-cols-10 gap-[3px] sm:gap-1" role="img" aria-label={`${Math.min(prs, 100)} of 100 squares filled`}>
              {Array.from({ length: 100 }, (_, i) => (
                <span key={i} className="aspect-square rounded-[3px]" style={{ background: i < prs ? (on ? "var(--accent)" : "var(--ink)") : "var(--rule)", transition: "background-color .2s" }} />
              ))}
            </div>
            <Slider label="Merged pull requests in the last 12 months" value={prs} set={setPrs} min={0} max={150} step={1} />
          </div>
        )}

        {tab === "community" && (
          <div className="os-card mt-2">
            <Counter value={String(people)} label="unique external contributors with merged pull requests on one repo, last 12 months" on={on} needs={`${THRESHOLDS.externalContributors}+`} />
            <div className="mx-auto mt-3 grid max-w-[260px] grid-cols-10 gap-1.5" role="img" aria-label={`${Math.min(people, 20)} of 20 contributors`}>
              {Array.from({ length: 20 }, (_, i) => (
                <span key={i} className="aspect-square rounded-full" style={{ background: i < people ? (on ? "var(--accent)" : "var(--ink)") : "var(--rule)", transition: "background-color .2s" }} />
              ))}
            </div>
            <Slider label="Unique external contributors in the last 12 months" value={people} set={setPeople} min={0} max={40} step={1} />
          </div>
        )}

        {tab === "critical" && (
          <div className="os-card mt-2">
            <Counter value={score.toFixed(2)} label="OpenSSF criticality score of a repo you maintain" on={on} needs="0.4+" />
            <svg viewBox="0 0 400 34" className="mt-3 w-full" aria-hidden>
              <rect x="0" y="6" width="400" height="8" rx="4" fill="var(--rule)" />
              <rect x="0" y="6" width={400 * score} height="8" rx="4" fill={on ? "var(--accent)" : "var(--ink)"} />
              <line x1={400 * THRESHOLDS.openssfScore} y1="0" x2={400 * THRESHOLDS.openssfScore} y2="20" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="0" y="31" className="os-label">0</text>
              <text x={400 * THRESHOLDS.openssfScore} y="31" textAnchor="middle" className="os-label">0.4</text>
              <text x="400" y="31" textAnchor="end" className="os-label">1</text>
            </svg>
            <Slider label="OpenSSF criticality score" value={score} set={setScore} min={0} max={1} step={0.01} />
          </div>
        )}
      </div>

      <div className="os-card mt-3" aria-live="polite" style={{ borderColor: met.length ? "var(--accent)" : undefined, boxShadow: met.length ? "0 0 0 1px var(--accent)" : undefined, transition: "border-color .25s, box-shadow .25s" }}>
        <span className="block font-mono text-[11px] text-[var(--accent)]">RESULT</span>
        {met.length ? (
          <>
            <span className="mt-1 block text-[14.5px] font-semibold leading-snug text-[var(--ink)]">
              You meet the published threshold for {met.map((id) => ROUTES.find((r) => r.id === id)!.name).join(", ")}.
            </span>
            <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--soft)]">
              That is all this check can tell you. Anthropic reviews every application, and the terms say &ldquo;meeting or exceeding any threshold does not guarantee acceptance&rdquo;.
            </span>
          </>
        ) : (
          <>
            <span className="mt-1 block text-[14.5px] font-semibold leading-snug text-[var(--ink)]">{touched ? "No published threshold met with these numbers." : "No route lit yet. Enter your numbers above."}</span>
            <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--soft)]">The official page also says: &ldquo;{FALLBACK}&rdquo;</span>
          </>
        )}
        <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href={APPLY} target="_blank" rel="noopener noreferrer" className={APPLY_BTN}>
            Apply on claude.com ↗
          </a>
          <a href={TERMS} target="_blank" rel="noopener noreferrer" className={TEXT_LINK}>
            Read the terms
          </a>
          <button type="button" className={`${BTN} ml-auto`} disabled={!touched} onClick={reset}>
            Reset
          </button>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Nothing you enter leaves this page. The check compares your numbers with the thresholds on the official page, and that is all it does. One route is enough to apply.
      </figcaption>
      <Sources links={[{ text: "claude.com, Claude for Open Source", href: APPLY }]} />
    </figure>
  );
}

// ───────── 3 · before you apply: the five conditions from the terms, as a list you tick ─────────
const CONDITIONS = [
  "I am 18 or older (or the age of majority where I live)",
  "My GitHub account is in good standing and at least two years old",
  "I have public open-source activity within the last 90 days",
  "At least one of my projects is under an OSI-approved license",
  "I am applying for myself, as an individual (one active subscription per person)",
];

function Ready() {
  const [ticked, setTicked] = useState<boolean[]>(() => CONDITIONS.map(() => false));
  const done = ticked.filter(Boolean).length;
  const all = done === CONDITIONS.length;
  return (
    <figure className="os-plate p-4 sm:p-6">
      <Plate n={3} title="Before you apply" sub="tick what is true for you" />
      <ul className="space-y-1.5">
        {CONDITIONS.map((text, i) => (
          <li key={text}>
            <label className="os-card os-press flex cursor-pointer items-start gap-3" style={{ borderColor: ticked[i] ? "var(--rule-strong)" : undefined }}>
              <input type="checkbox" checked={ticked[i]} onChange={() => setTicked((t) => t.map((v, j) => (j === i ? !v : v)))} className="mt-0.5 size-[18px] shrink-0 accent-[var(--accent)]" />
              <span className="text-[13.5px] leading-snug" style={{ color: ticked[i] ? "var(--ink)" : "var(--soft)" }}>
                {text}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <span className="block h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--rule)]" aria-hidden>
          <span className="block h-full rounded-full" style={{ width: `${(done / CONDITIONS.length) * 100}%`, background: all ? "var(--accent)" : "var(--ink)", transition: "width .3s, background-color .3s" }} />
        </span>
        <span className="shrink-0 font-mono text-[12px] tabular-nums" style={{ color: all ? "var(--accent)" : "var(--soft)" }} aria-live="polite">
          {done}/{CONDITIONS.length}
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        {all ? "All five ticked. These are the eligibility conditions in the program terms; the route in the checker above comes on top of them." : "These five come from the program terms. They apply on top of the route in the checker above."}
      </figcaption>
      <Sources links={[{ text: "Claude for Open Source, program terms", href: TERMS }]} />
    </figure>
  );
}

// ───────── 4 · what the application asks: four things, and a scratchpad that counts the 500 words ─────────
const WORD_LIMIT = 500;

function Draft() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const words = countWords(text);
  const over = words > WORD_LIMIT;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  const rows = ["GitHub sign-in", "An email address", "A brief description of how you plan to use the subscription"];
  return (
    <figure className="os-plate p-4 sm:p-6">
      <Plate n={4} title="What the application asks" sub="four things · draft the fourth here" />
      <ol className="space-y-1.5">
        {rows.map((row, i) => (
          <li key={row} className="os-card flex items-baseline gap-3">
            <span className="font-mono text-[11.5px] text-[var(--accent)]">{i + 1}</span>
            <span className="text-[13.5px] leading-snug text-[var(--ink)]">{row}</span>
          </li>
        ))}
        <li className="os-card">
          <label htmlFor="os-draft" className="flex items-baseline gap-3">
            <span className="font-mono text-[11.5px] text-[var(--accent)]">4</span>
            <span className="text-[13.5px] leading-snug text-[var(--ink)]">A brief explanation of why you qualify (no more than 500 words)</span>
          </label>
          <textarea
            id="os-draft"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="Draft it here: the route you fit, the project, the numbers."
            className={`mt-2.5 block w-full resize-y rounded-lg border border-[var(--rule-strong)] bg-white px-3 py-2 text-[16px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--muted)] sm:text-[14px] ${FOCUS}`}
          />
          <div className="mt-2 flex items-center gap-3">
            <span className="block h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--rule)]" aria-hidden>
              <span className="block h-full rounded-full" style={{ width: `${Math.min(1, words / WORD_LIMIT) * 100}%`, background: over ? "var(--accent)" : "var(--ink)", transition: "width .2s, background-color .2s" }} />
            </span>
            <span className="shrink-0 font-mono text-[12px] tabular-nums" style={{ color: over ? "var(--accent)" : "var(--soft)" }} aria-live="polite">
              {words} / {WORD_LIMIT} words
            </span>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button type="button" className={BTN} disabled={!text} onClick={copy}>
              {copied ? "Copied" : "Copy draft"}
            </button>
            <button type="button" className={BTN} disabled={!text} onClick={() => setText("")}>
              Clear
            </button>
            {over ? <span className="text-[12.5px] font-medium text-[var(--accent)]">{words - WORD_LIMIT} over the limit</span> : null}
          </div>
        </li>
      </ol>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The box is a scratchpad, not the application: nothing you type is sent or saved. Copy your draft and paste it into the real form on claude.com.
      </figcaption>
      <Sources links={[{ text: "claude.com, Claude for Open Source", href: APPLY }]} />
    </figure>
  );
}

// ───────── 5 · after the six months: the free subscription ends; what the account goes back to depends on what you had ─────────
function After() {
  const [before, setBefore] = useState<"paid" | "none">("paid");
  const paid = before === "paid";
  // drawing: six months from x=14 to x=242 (38 per month); from the end, one line drops to the outcome card below it
  const x = (m: number) => 14 + m * 38;
  const END = x(6);
  const outcomes = [
    { id: "paid" as const, label: "Prior paid plan", sub: "resumes at its prior rate" },
    { id: "none" as const, label: "Free plan", sub: "the account returns to it" },
  ];
  return (
    <figure className="os-plate p-4 sm:p-6">
      <Plate n={5} title="After the six months" sub="choose what you had before" />
      <Choice
        label="What you had before the program"
        options={[
          { id: "paid", label: "Had a paid plan" },
          { id: "none", label: "No paid plan" },
        ]}
        value={before}
        set={setBefore}
      />
      <svg viewBox="0 0 280 96" className="mt-3 w-full" role="img" aria-label={paid ? "After month six the prior paid plan resumes" : "After month six the account returns to the free plan"}>
        <text x={x(0)} y="12" className="os-label">Claude Ultra, complimentary</text>
        {/* the email before it ends */}
        <g transform={`translate(${x(5) + 8} 4)`}>
          <rect x="0" y="0" width="22" height="15" rx="3" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
          <polyline points="1,2 11,9 21,2" fill="none" stroke="var(--ink)" strokeWidth="1.2" />
        </g>
        <line x1={x(5) + 19} y1="21" x2={x(5) + 19} y2="31" stroke="var(--ink)" strokeWidth="1" strokeDasharray="2 2" />
        {/* the six complimentary months */}
        <line x1={x(0)} y1="38" x2={END} y2="38" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
        {Array.from({ length: 7 }, (_, m) => (
          <line key={m} x1={x(m)} y1="30" x2={x(m)} y2="46" stroke="var(--ink)" strokeWidth="1.2" />
        ))}
        {Array.from({ length: 6 }, (_, m) => (
          <text key={m} x={x(m) + 19} y="60" textAnchor="middle" className="os-label">
            M{m + 1}
          </text>
        ))}
        {/* from the end, down to the outcome: left card or right card */}
        <path d={`M${END} 38 C ${END + 26} 38, ${END + 26} 74, 210 74 L 210 96`} fill="none" stroke={paid ? "var(--rule-strong)" : "var(--ink)"} strokeWidth={paid ? 1.2 : 2} style={{ transition: "stroke .3s" }} />
        <path d={`M${END} 38 C ${END + 30} 38, ${END + 30} 82, 200 82 L 90 82 Q 70 82 70 96`} fill="none" stroke={paid ? "var(--ink)" : "var(--rule-strong)"} strokeWidth={paid ? 2 : 1.2} style={{ transition: "stroke .3s" }} />
        <circle cx={END} cy="38" r="5" fill="var(--ink)" />
      </svg>
      <div className="grid grid-cols-2 gap-2">
        {outcomes.map((o) => {
          const on = before === o.id;
          return (
            <div key={o.id} className="os-card" style={{ borderColor: on ? "var(--ink)" : undefined, opacity: on ? 1 : 0.5, transition: "opacity .3s, border-color .3s" }}>
              <span className="block text-[13.5px] font-semibold leading-snug text-[var(--ink)]">{o.label}</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-[var(--soft)]">{o.sub}</span>
            </div>
          );
        })}
      </div>
      <div className="os-card mt-2" aria-live="polite">
        <span className="block font-mono text-[11px] text-[var(--accent)]">AT THE END OF MONTH 6</span>
        <span className="mt-1 block text-[14.5px] font-semibold leading-snug text-[var(--ink)]">
          {paid ? "Your prior paid plan resumes at its prior rate, unless you cancel." : "Your account returns to the free plan."}
        </span>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--soft)]">
          Either way, the complimentary subscription ends and does not renew automatically, and Anthropic emails you before it ends.
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        One more line from the terms: overages beyond the base subscription may be charged at standard overage pricing.
      </figcaption>
      <Sources links={[{ text: "Claude for Open Source, program terms", href: TERMS }]} />
    </figure>
  );
}

const OS_CSS = `
.os{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.os-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.os-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.os-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10.5px;fill:var(--muted)}
.os-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.os-press:active:not(:disabled){transform:scale(.97)}
`;

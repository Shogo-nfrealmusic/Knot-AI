"use client";

// /free/70 (gta-channel): one live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–69: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Every label inside a figure is HTML at 12px or more, so it stays readable on a phone.

import { useState } from "react";
import { CodeBlock } from "@/app/free/CodeCopy";
import {
  BUILD,
  CHECKS,
  DEFAULT_RATE,
  MR_BOSS,
  RATES,
  SEARCHES,
  TOOLS,
  VIEW_STEPS,
  earnings,
  searchPrompt,
  type GtaDemoKind,
} from "./data";

export type { GtaDemoKind } from "./data";

const TOTAL = 5;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `gc-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const BTN_INK = `gc-press inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--ink)] px-4 text-[13px] font-medium text-white disabled:opacity-40 ${FOCUS}`;
const LABEL = "block font-mono text-[12px] tracking-[0.04em] text-[var(--accent)]";

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const count = (n: number) => n.toLocaleString("en-US");

export function GtaDemo({ kind }: { kind: GtaDemoKind }) {
  return (
    <div className="gc mt-5 max-w-2xl">
      <style>{GC_CSS}</style>
      {kind === "search" && <Search />}
      {kind === "math" && <PayMath />}
      {kind === "setup" && <Setup />}
      {kind === "build" && <Build />}
      {kind === "launch" && <Launch />}
    </div>
  );
}

function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">
          0{n}/0{TOTAL}
        </span>
        <span className="text-[16px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block font-mono text-[12px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

function Choice<T extends string>({ label, options, value, set }: { label: string; options: { id: T; label: string }[]; value: T; set: (id: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full flex-wrap gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => set(o.id)}
          className={`gc-press min-h-9 rounded-full px-4 text-[13px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ───────────── figure 1 · one search becomes one video ───────────── */
function Search() {
  const [id, setId] = useState(SEARCHES[0].id);
  const idea = SEARCHES.find((s) => s.id === id) ?? SEARCHES[0];
  return (
    <figure className="gc-plate p-4 sm:p-6">
      <Plate n={1} title="One search, one video" sub="pick a search and see the video it becomes" />
      <Choice label="Search" options={SEARCHES.map((s) => ({ id: s.id, label: s.label }))} value={id} set={setId} />
      <div key={idea.id} className="gc-card gc-in mt-3">
        <span className={LABEL}>THE SEARCH</span>
        <span className="mt-1 flex min-h-10 items-center rounded-full border border-[var(--rule-strong)] px-4 font-mono text-[14px] text-[var(--ink)]">{idea.query}</span>
        <span className={`${LABEL} mt-4`}>THE VIDEO</span>
        <span className="mt-1 block text-[17px] font-semibold leading-snug text-[var(--ink)]">{idea.title}</span>
        <ol className="mt-3 space-y-1.5">
          {idea.outline.map((line, i) => (
            <li key={line} className="gc-in flex gap-2 text-[14px] leading-snug text-[var(--soft)]" style={{ animationDelay: `${(i + 1) * 110}ms` }}>
              <span className="font-mono text-[12px] leading-5 text-[var(--accent)]">{i + 1}</span>
              {line}
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-3">
        <CodeBlock label="First prompt · paste into Claude Code" code={searchPrompt(idea.query)} wrap />
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The titles and outlines are examples. Build yours from what the official sources show.</figcaption>
    </figure>
  );
}

/* ───────────── figure 2 · views × rate ───────────── */
function PayMath() {
  const [step, setStep] = useState(3);
  const [rate, setRate] = useState(DEFAULT_RATE);
  const views = VIEW_STEPS[step];
  return (
    <figure className="gc-plate p-4 sm:p-6">
      <Plate n={2} title="Views × rate" sub="drag the views, then change the rate" />
      <div className="gc-card">
        <label htmlFor="gc-views" className={LABEL}>
          VIEWS
        </label>
        <span className="mt-1 block font-mono text-[24px] font-semibold text-[var(--ink)]">{count(views)}</span>
        <input id="gc-views" type="range" min={0} max={VIEW_STEPS.length - 1} step={1} value={step} onChange={(e) => setStep(Number(e.target.value))} aria-valuetext={`${count(views)} views`} className={`mt-2 h-10 w-full accent-[var(--accent)] ${FOCUS}`} />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[12px] text-[var(--muted)]">rate per 1,000 views</span>
          <Choice label="Rate per 1,000 views" options={RATES.map((r) => ({ id: String(r), label: `$${r}` }))} value={String(rate)} set={(v) => setRate(Number(v))} />
        </div>
      </div>
      <div className="gc-card mt-2" style={{ borderColor: "var(--accent)" }}>
        <span className={LABEL}>ESTIMATED AD MONEY</span>
        <span className="mt-1 block text-[34px] font-semibold leading-none text-[var(--ink)]" aria-live="polite">
          {money(earnings(views, rate))}
        </span>
      </div>
      <div className="gc-card mt-2">
        <span className={LABEL}>THE REAL CHANNEL IN THE REEL</span>
        <span className="mt-1 block text-[15px] font-semibold text-[var(--ink)]">
          {MR_BOSS.name} · {MR_BOSS.subscribers} subscribers
        </span>
        <span className="mt-1 block font-mono text-[13px] leading-relaxed text-[var(--soft)]">
          {count(MR_BOSS.views)} views × $2 / 1,000 = about {money(earnings(MR_BOSS.views, DEFAULT_RATE))}
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        These are estimates, not promises. Rates change by topic, country and season. Views are {MR_BOSS.viewsSource}&apos;s figure as of {MR_BOSS.viewsAsOf}.
      </figcaption>
    </figure>
  );
}

/* ───────────── figure 3 · three tools ───────────── */
function Setup() {
  const [id, setId] = useState(TOOLS[0].id);
  const tool = TOOLS.find((t) => t.id === id) ?? TOOLS[0];
  return (
    <figure className="gc-plate p-4 sm:p-6">
      <Plate n={3} title="Three tools" sub="press a tool to get its install command" />
      <ol className="grid gap-1.5 sm:grid-cols-3">
        {TOOLS.map((t, i) => {
          const on = t.id === id;
          return (
            <li key={t.id}>
              <button type="button" aria-pressed={on} onClick={() => setId(t.id)} className={`gc-press h-full min-h-20 w-full rounded-[12px] border bg-white p-3 text-left ${FOCUS}`} style={{ borderColor: on ? "var(--accent)" : "var(--rule)", boxShadow: on ? "0 0 0 1px var(--accent)" : "none" }}>
                <span className="font-mono text-[12px] text-[var(--accent)]">{i + 1}</span>
                <span className="block text-[15px] font-semibold text-[var(--ink)]">{t.name}</span>
                <span className="block text-[13px] leading-snug text-[var(--soft)]">{t.job}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div key={tool.id} className="gc-in mt-3">
        <CodeBlock label={`Install ${tool.name}`} code={tool.command} wrap />
        <div className="gc-card mt-2">
          <span className={LABEL}>{tool.cost.toUpperCase()}</span>
          <span className="mt-1 block text-[14px] leading-relaxed text-[var(--soft)]">{tool.note}</span>
          <a href={tool.href} target="_blank" rel="noreferrer" className={`mt-2 inline-flex min-h-9 items-center text-[13px] font-medium text-[var(--ink)] underline underline-offset-4 ${FOCUS}`}>
            Open on GitHub
          </a>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Commands come from each project&apos;s own repository. Read them before you run them.</figcaption>
    </figure>
  );
}

/* ───────────── figure 4 · five prompts, in order ───────────── */
function Build() {
  const [at, setAt] = useState(0);
  const step = BUILD[at];
  const last = BUILD.length - 1;
  return (
    <figure className="gc-plate p-4 sm:p-6">
      <Plate n={4} title="Five prompts, in order" sub="press Next and copy each prompt" />
      <ol className="grid grid-cols-5 gap-1" aria-label="Build steps">
        {BUILD.map((s, i) => (
          <li key={s.id}>
            <button type="button" aria-label={`Step ${i + 1}: ${s.title}`} aria-current={i === at ? "step" : undefined} onClick={() => setAt(i)} className={`gc-press flex min-h-11 w-full items-center justify-center rounded-[10px] border font-mono text-[13px] font-semibold ${FOCUS}`} style={{ background: i <= at ? "var(--ink)" : "#fff", color: i <= at ? "#fff" : "var(--muted)", borderColor: i <= at ? "var(--ink)" : "var(--rule)" }}>
              {i + 1}
            </button>
          </li>
        ))}
      </ol>
      <div key={step.id} className="gc-card gc-in mt-3" aria-live="polite">
        <span className={LABEL}>
          STEP {at + 1} OF {BUILD.length}
        </span>
        <span className="mt-1 block text-[16px] font-semibold text-[var(--ink)]">{step.title}</span>
        <span className="mt-1 block text-[14px] leading-relaxed text-[var(--soft)]">{step.does}</span>
        <div className="mt-3">
          <CodeBlock label={`Step ${at + 1} prompt`} code={step.prompt} wrap />
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-1.5">
        <button type="button" className={BTN} disabled={at === 0} onClick={() => setAt(at - 1)}>
          Back
        </button>
        <button type="button" className={BTN_INK} onClick={() => setAt(at === last ? 0 : at + 1)}>
          {at === last ? "Start again" : "Next"}
        </button>
      </div>
    </figure>
  );
}

/* ───────────── figure 5 · the last check before posting ───────────── */
function Launch() {
  const [done, setDone] = useState<string[]>([]);
  const ready = done.length === CHECKS.length;
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  return (
    <figure className="gc-plate p-4 sm:p-6">
      <Plate n={5} title="Before you press publish" sub="tick each one" />
      <ul className="space-y-1.5">
        {CHECKS.map((c) => {
          const on = done.includes(c.id);
          return (
            <li key={c.id}>
              <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(c.id)} className={`gc-press flex min-h-14 w-full items-center gap-3 rounded-[12px] border bg-white px-3 py-2 text-left ${FOCUS}`} style={{ borderColor: on ? "var(--ink)" : "var(--rule)" }}>
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border" style={{ background: on ? "var(--ink)" : "#fff", borderColor: on ? "var(--ink)" : "var(--rule-strong)" }} aria-hidden>
                  {on ? (
                    <svg viewBox="0 0 16 16" className="size-3">
                      <path d="M3.5 8.5 6.6 11.5 12.5 4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold leading-snug text-[var(--ink)]">{c.text}</span>
                  <span className="block text-[13px] leading-snug text-[var(--soft)]">{c.why}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="gc-card mt-2 flex min-h-14 items-center justify-between gap-3" style={{ borderColor: ready ? "var(--accent)" : "var(--rule)" }} aria-live="polite">
        <span className="text-[15px] font-semibold text-[var(--ink)]">{ready ? "Ready. Friday is day one." : `${done.length} of ${CHECKS.length} checked`}</span>
        <button type="button" className={BTN} disabled={done.length === 0} onClick={() => setDone([])}>
          Reset
        </button>
      </div>
    </figure>
  );
}

const GC_CSS = `
.gc{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.gc-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.gc-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.gc-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.gc-press:active:not(:disabled){transform:scale(.97)}
.gc-in{animation:gc-in .4s cubic-bezier(.22,1,.36,1) both}
@keyframes gc-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.gc-in{animation:none}.gc-press{transition:none}}
`;

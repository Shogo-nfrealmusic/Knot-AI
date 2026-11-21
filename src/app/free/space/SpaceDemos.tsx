"use client";

// /free/73 (chatgpt-space): one live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–70: paper plate on a grid, ink lines, one accent (ChatGPT green), calm motion.
// Every label inside a figure is HTML at 12px or more, so it stays readable on a phone.

import { useState } from "react";
import { CodeBlock } from "@/app/free/CodeCopy";
import { BEFORE, LOOKS, PLANS, REFRESH_PROMPT, SLACK, TODO, type SpaceDemoKind } from "./data";

export type { SpaceDemoKind } from "./data";

const TOTAL = 3;
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `sp-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const BTN_INK = `sp-press inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--ink)] px-4 text-[13px] font-medium text-white disabled:opacity-40 ${FOCUS}`;
const LABEL = "block font-mono text-[12px] tracking-[0.04em] text-[var(--accent)]";

export function SpaceDemo({ kind }: { kind: SpaceDemoKind }) {
  return (
    <div className="sp mt-5 max-w-2xl">
      <style>{SP_CSS}</style>
      {kind === "refresh" && <Refresh />}
      {kind === "comment" && <Comment />}
      {kind === "access" && <Access />}
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

function Tick({ on }: { on: boolean }) {
  return (
    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[6px] border" style={{ background: on ? "var(--accent)" : "#fff", borderColor: on ? "var(--accent)" : "var(--rule-strong)" }} aria-hidden>
      {on ? (
        <svg viewBox="0 0 16 16" className="size-3">
          <path d="M3.5 8.5 6.6 11.5 12.5 4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </span>
  );
}

/* ───────────── figure 1 · the hourly refresh from Slack ───────────── */
function Refresh() {
  const [runs, setRuns] = useState(0);
  const read = SLACK.slice(0, runs);
  const done = new Set<string>(read.map((m) => m.done));
  const last = runs === SLACK.length;
  return (
    <figure className="sp-plate p-4 sm:p-6">
      <Plate n={1} title="A list that fixes itself" sub="press Run to play one hourly refresh" />
      <div className="grid gap-2 sm:grid-cols-[1.1fr_1fr]">
        <div className="sp-card">
          <span className={LABEL}>SPACE · TO-DO LIST</span>
          <ul className="mt-2 space-y-2">
            {TODO.map((t) => {
              const on = done.has(t.id);
              return (
                <li key={t.id} className="flex gap-2">
                  <Tick on={on} />
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold leading-snug text-[var(--ink)]" style={{ textDecoration: on ? "line-through" : "none", opacity: on ? 0.55 : 1 }}>
                      {t.task}
                    </span>
                    <span className="block text-[13px] leading-snug text-[var(--soft)]">{t.detail}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sp-card">
          <span className={LABEL}>SLACK · #LAUNCH</span>
          <ul className="mt-2 space-y-2" aria-live="polite">
            {SLACK.map((m, i) => (
              <li key={m.at} className={i < runs ? "sp-in" : ""} style={{ opacity: i < runs ? 1 : 0.25 }}>
                <span className="block font-mono text-[12px] text-[var(--muted)]">
                  {m.at} · {m.who}
                </span>
                <span className="block text-[14px] leading-snug text-[var(--ink)]">{m.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="sp-card mt-2 flex min-h-14 flex-wrap items-center justify-between gap-2" style={{ borderColor: last ? "var(--accent)" : "var(--rule)" }}>
        <span className="text-[14px] font-semibold text-[var(--ink)]">
          Refresh checklist from Slack · <span className="font-mono text-[13px] font-normal text-[var(--muted)]">{runs === 0 ? "hourly, not run yet" : `ran ${runs} of ${SLACK.length} hours`}</span>
        </span>
        <span className="flex gap-1.5">
          <button type="button" className={BTN} disabled={runs === 0} onClick={() => setRuns(0)}>
            Reset
          </button>
          <button type="button" className={BTN_INK} disabled={last} onClick={() => setRuns(runs + 1)}>
            Run the next hour
          </button>
        </span>
      </div>
      <div className="mt-3">
        <CodeBlock label="Prompt · paste into a new Space page" code={REFRESH_PROMPT} wrap />
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The messages are an example. The task name and the hourly schedule are the ones in OpenAI&apos;s own demo.</figcaption>
    </figure>
  );
}

/* ───────────── figure 2 · one comment restyles the slide ───────────── */
function Comment() {
  const [pick, setPick] = useState(LOOKS[0].id);
  const [sent, setSent] = useState(false);
  const look = LOOKS.find((l) => l.id === pick) ?? LOOKS[0];
  const shown = sent ? look : BEFORE;
  return (
    <figure className="sp-plate p-4 sm:p-6">
      <Plate n={2} title="Edit by comment" sub="pick a comment, then send it" />
      <div key={shown.id + String(sent)} className="sp-in flex aspect-[16/9] w-full flex-col justify-between rounded-[12px] border border-[var(--rule)] p-5" style={{ background: shown.bg, color: shown.ink, fontFamily: shown.font }}>
        <span className="font-mono text-[12px] opacity-70" style={{ fontFamily: "var(--font-mono, monospace)" }}>
          SLIDE 1 OF 6
        </span>
        <span className="text-[30px] font-bold leading-tight sm:text-[40px]">{shown.title}</span>
        <span className="text-[13px] opacity-75">{sent ? look.note : BEFORE.note}</span>
      </div>
      <div role="radiogroup" aria-label="Comment" className="mt-3 space-y-1.5">
        {LOOKS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={pick === l.id}
            onClick={() => {
              setPick(l.id);
              setSent(false);
            }}
            className={`sp-press flex min-h-12 w-full items-start gap-2 rounded-[12px] border bg-white px-3 py-2 text-left ${FOCUS}`}
            style={{ borderColor: pick === l.id ? "var(--accent)" : "var(--rule)" }}
          >
            <span className="text-[14px] leading-snug text-[var(--ink)]">
              <span className="font-semibold text-[var(--accent)]">@ChatGPT</span>
              {l.comment.replace("@ChatGPT", "")}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-1.5">
        <button type="button" className={BTN} disabled={!sent} onClick={() => setSent(false)}>
          Undo
        </button>
        <button type="button" className={BTN_INK} disabled={sent} onClick={() => setSent(true)}>
          Send comment
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The first comment is the one in OpenAI&apos;s demo. The looks here are drawn for this page; ChatGPT decides the real result.</figcaption>
    </figure>
  );
}

/* ───────────── figure 3 · who can open what you share ───────────── */
function Access() {
  const [id, setId] = useState("free");
  const plan = PLANS.find((p) => p.id === id) ?? PLANS[0];
  const tone = plan.open === "yes" ? "var(--accent)" : plan.open === "no" ? "#c2412d" : "var(--muted)";
  return (
    <figure className="sp-plate p-4 sm:p-6">
      <Plate n={3} title="Who can open your page" sub="pick the plan of the person you share with" />
      <div role="radiogroup" aria-label="Their plan" className="inline-flex max-w-full flex-wrap gap-1 rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
        {PLANS.map((p) => (
          <button key={p.id} type="button" role="radio" aria-checked={id === p.id} onClick={() => setId(p.id)} className={`sp-press min-h-9 rounded-full px-4 text-[13px] font-medium ${FOCUS} ${id === p.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}>
            {p.label}
          </button>
        ))}
      </div>
      <div key={plan.id} className="sp-card sp-in mt-3" style={{ borderColor: tone }} aria-live="polite">
        <span className="block font-mono text-[12px] tracking-[0.04em]" style={{ color: tone }}>
          {plan.open === "yes" ? "CAN OPEN AND EDIT IF INVITED" : plan.open === "no" ? "CAN'T OPEN IT" : "NOT LISTED"}
        </span>
        <span className="mt-1 block text-[15px] leading-relaxed text-[var(--ink)]">{plan.why}</span>
      </div>
      <div className="sp-card mt-2">
        <span className={LABEL}>PUBLIC LINK</span>
        <span className="mt-1 block text-[15px] leading-relaxed text-[var(--ink)]">Not available. Everyone you share with is invited by name.</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">From OpenAI&apos;s ChatGPT release notes, November 20, 2026.</figcaption>
    </figure>
  );
}

const SP_CSS = `
.sp{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#10a37f}
.sp-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.sp-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.sp-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.sp-press:active:not(:disabled){transform:scale(.97)}
.sp-in{animation:sp-in .4s cubic-bezier(.22,1,.36,1) both}
@keyframes sp-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.sp-in{animation:none}.sp-press{transition:none}}
`;

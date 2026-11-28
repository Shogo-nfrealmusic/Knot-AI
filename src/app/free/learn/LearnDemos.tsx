"use client";

// /free/82 (ten ChatGPT codes to learn anything): a picker you can drive — choose a code, the prompt is typed into a chat and the
// example answer streams in — and one card per code with its ready prompt. Same language as /free/67–80: paper plate on a grid,
// ink lines, one accent (orange), calm motion. Every label is HTML at 12px or more, so it stays readable on a phone.

import { useEffect, useRef, useState } from "react";
import { LEARN, ALL_PROMPTS, codeFor, type LearnCode, type LearnId } from "./data";

export type LearnDemoKind = "picker" | LearnId;

export function LearnDemo({ kind }: { kind: LearnDemoKind }) {
  return <div className="mt-5 max-w-2xl space-y-3">{kind === "picker" ? <Picker /> : <Card code={codeFor(kind)} />}</div>;
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";

function useCopy(text: string) {
  const [state, setState] = useState<"idle" | "done" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  const copy = async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      ok = false;
    }
    setState(ok ? "done" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  };
  return { state, copy };
}

function CopyLine({ text, label = "Copy prompt" }: { text: string; label?: string }) {
  const { state, copy } = useCopy(text);
  return (
    <button type="button" onClick={copy} aria-label={`${label}: ${text}`} className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2 text-left hover:border-[var(--rule-strong)] ${FOCUS}`}>
      <span className="min-w-0 whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{text}</span>
      <span className="shrink-0 font-mono text-[12px]" style={{ color: state === "done" ? "var(--accent)" : "var(--muted)" }} aria-live="polite">
        {state === "done" ? "Copied" : state === "failed" ? "Select it" : label}
      </span>
    </button>
  );
}

/** Characters of `s` shown `ms` after start, at `cps` characters per second. */
const shown = (s: string, ms: number, cps: number) => s.slice(0, Math.max(0, Math.floor((ms / 1000) * cps)));

function useClock(key: string, total: number) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setT(total);
      return;
    }
    setT(0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const e = Math.min(total, now - start);
      setT(e);
      if (e < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [key, total]);
  return t;
}

function Picker() {
  const [id, setId] = useState<LearnId>("eli5");
  const code = codeFor(id);
  const typeMs = (code.prompt.length / 40) * 1000;
  const answer = code.answer.join("\n");
  const t = useClock(id, typeMs + 400 + (answer.length / 90) * 1000);
  const sent = t >= typeMs + 200;
  return (
    <div className="rounded-xl border border-[var(--rule-strong)] bg-white p-4">
      <span className="block font-mono text-[12px] text-[var(--accent)]">10 codes · pick one</span>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Code">
        {LEARN.map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={c.id === id} onClick={() => setId(c.id)} className={`min-h-10 rounded-full border px-3 font-mono text-[12px] ${FOCUS} ${c.id === id ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)]"}`}>
            {c.n}. {c.code}
          </button>
        ))}
      </div>
      <div className="mt-4 min-h-[220px] rounded-lg border border-[var(--rule)] bg-[var(--page)] p-3">
        {sent ? (
          <div className="ml-auto w-fit max-w-[90%] rounded-2xl bg-[var(--rule)] px-3 py-2 font-mono text-[13px] text-[var(--ink)]">{code.prompt}</div>
        ) : null}
        {sent ? (
          <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-[var(--ink)]" aria-live="polite">
            {shown(answer, t - typeMs - 400, 90)}
          </p>
        ) : null}
        <div className="mt-3 rounded-full border border-[var(--rule)] bg-white px-4 py-2 font-mono text-[13px] text-[var(--muted)]">
          {sent ? "Ask anything" : shown(code.prompt, t, 40) || "Ask anything"}
        </div>
      </div>
      <p className="mt-3 text-[13px] text-[var(--soft)]">{code.does}{code.picture ? " (ChatGPT draws it as an image.)" : ""}</p>
      <div className="mt-3"><CopyLine text={ALL_PROMPTS} label="Copy all 10" /></div>
    </div>
  );
}

function Card({ code }: { code: LearnCode }) {
  return (
    <div className="rounded-xl border border-[var(--rule-strong)] bg-white p-4">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">#{code.n}</span>
        <span className="font-mono text-[15px] font-semibold text-[var(--ink)]">{code.code}</span>
      </span>
      <p className="mt-2 text-[14px] text-[var(--soft)]">{code.does}</p>
      <div className="mt-3"><CopyLine text={code.prompt} /></div>
      <ul className="mt-3 space-y-1 border-l-2 border-[var(--accent)] pl-3 text-[13px] leading-relaxed text-[var(--ink)]">
        {code.answer.map((a) => <li key={a}>{a}</li>)}
      </ul>
    </div>
  );
}

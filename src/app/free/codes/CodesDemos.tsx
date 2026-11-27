"use client";

// /free/80 (five codes for Claude): a chat you can drive with every code, and one card per code with its ready prompt and its example chat.
// Same language as /free/67–79: paper plate on a grid, ink lines, one accent (orange), calm motion.
// The chats are replays of the reel's examples, not live calls. Every label is HTML at 12px or more, so it stays readable on a phone.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { CODES, OFFICIAL_NOTE, codeFor, sliceLines, answerChars, timeline, type CodeId, type SecretCode } from "./data";

export type CodesDemoKind = "chat" | CodeId;

export function CodesDemo({ kind }: { kind: CodesDemoKind }) {
  const code = kind === "chat" ? undefined : codeFor(kind);
  return (
    <div className="sc mt-5 max-w-2xl space-y-3">
      <style>{SC_CSS}</style>
      {kind === "chat" ? <Picker /> : null}
      {code ? <Card code={code} /> : null}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `sc-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] ${FOCUS}`;
const LABEL = "block font-mono text-[12px] tracking-[0.04em] text-[var(--accent)]";
const RADIO_ON = "border-[var(--ink)] bg-[var(--ink)] text-white";
const RADIO_OFF = "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]";

function Plate({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">{tag}</span>
        <span className="text-[16px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block font-mono text-[12px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

/** The visitor's reduced-motion setting. False on the server and during hydration, so the first client render matches the server's HTML. */
function useReducedMotionSafe() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCE_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false,
  );
}

/** Milliseconds since the figure came on screen (or since `replay`), up to `total`. With reduced motion it is `total` from the start. */
function useElapsed(total: number) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.35, once: true });
  const reduce = useReducedMotionSafe();
  const [run, setRun] = useState(0);
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(total, Math.max(0, now - start));
      setT(elapsed);
      if (elapsed < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduce, run, total]);
  const replay = () => {
    setT(0);
    setRun((v) => v + 1);
  };
  return { ref, t: reduce ? total : t, replay };
}

/** Copies `text`; the label turns to "Copied" for a moment, or to "Select it" if the browser refuses. */
function useCopy(text: string) {
  const [last, setLast] = useState<{ text: string; ok: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);
  const copy = async () => {
    let ok = true;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      ok = false;
    }
    setLast({ text, ok });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLast(null), 1800);
  };
  const state: "idle" | "done" | "failed" = last && last.text === text ? (last.ok ? "done" : "failed") : "idle";
  return { state, copy };
}

/** The ready prompt, with the code in the accent colour. The whole line is the button, so it is easy to tap. */
function CopyPrompt({ code }: { code: SecretCode }) {
  const { state, copy } = useCopy(code.prompt);
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy prompt: ${code.prompt}`}
      className={`sc-press flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2 text-left hover:border-[var(--rule-strong)] ${FOCUS}`}
    >
      <span className="min-w-0 font-mono text-[13px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">
        <PromptText code={code} />
      </span>
      <span className="shrink-0 font-mono text-[12px]" style={{ color: state === "done" ? "var(--accent)" : "var(--muted)" }} aria-live="polite">
        {state === "done" ? "Copied" : state === "failed" ? "Select it" : "Copy prompt"}
      </span>
    </button>
  );
}

/** The prompt with its code picked out; `upTo` cuts it for the typing effect. */
function PromptText({ code, upTo }: { code: SecretCode; upTo?: number }) {
  const n = upTo ?? code.prompt.length;
  const head = code.code.length;
  return (
    <>
      <span className="font-semibold text-[var(--accent)]">{code.prompt.slice(0, Math.min(n, head))}</span>
      {n > head ? code.prompt.slice(head, n) : null}
    </>
  );
}

/* ───────────── the chat: the prompt is typed, Claude thinks, the answer streams in ───────────── */
function Chat({ code, t }: { code: SecretCode; t: number }) {
  const tl = timeline(code);
  const typed = Math.min(code.prompt.length, Math.floor(((t - 300) / (tl.typed - 300)) * code.prompt.length));
  const sent = t >= tl.typed;
  const thinking = sent && t < tl.thought;
  const streamed = t >= tl.thought ? Math.ceil(((t - tl.thought) / (tl.total - tl.thought)) * answerChars(code.answer)) : 0;
  const lines = sliceLines(code.answer, streamed);
  const cutStart = tl.typed + (code.official ? 1800 : 700);
  const cutShown = code.cut ? code.cut.filter((_, i) => t >= cutStart + i * 380).length : 0;
  const done = t >= tl.total;

  return (
    <div className="sc-card" aria-live="polite">
      {/* your message */}
      <div className="flex justify-end">
        <div className="max-w-[88%] rounded-[14px] rounded-br-[4px] bg-[var(--ink)] px-3 py-2 font-mono text-[13px] leading-relaxed text-white [overflow-wrap:anywhere]">
          {sent ? (
            <PromptText code={code} />
          ) : (
            <>
              <PromptText code={code} upTo={Math.max(0, typed)} />
              <span className="sc-caret ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-white" />
            </>
          )}
        </div>
      </div>

      {/* Claude */}
      <div className="mt-3 flex items-start gap-2.5">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] font-mono text-[12px] font-semibold text-white" aria-hidden>
          C
        </span>
        <div className="min-h-[9.5rem] min-w-0 flex-1 text-[14px] leading-relaxed text-[var(--ink)]">
          {!sent ? <span className="font-mono text-[12px] text-[var(--muted)]">Waiting for your prompt</span> : null}
          {thinking && !code.cut ? (
            <span className="flex items-center gap-2 font-mono text-[12px] text-[var(--muted)]">
              <span className="sc-dots" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              {code.official ? "Reasoning deeper on this turn" : "Thinking"}
            </span>
          ) : null}
          {code.cut && sent ? (
            <div className="mb-2">
              <span className="block font-mono text-[12px] text-[var(--muted)]">Cut from the draft</span>
              <span className="mt-1 flex flex-wrap gap-1.5">
                {code.cut.map((phrase, i) => (
                  <span
                    key={phrase}
                    className="rounded-md border border-[var(--rule)] bg-[var(--page)] px-2 py-0.5 font-mono text-[12px] text-[var(--soft)]"
                    style={{
                      opacity: i < cutShown ? 1 : 0,
                      textDecoration: i < cutShown ? "line-through" : "none",
                      textDecorationColor: "var(--accent)",
                      textDecorationThickness: "2px",
                      transition: "opacity .25s",
                    }}
                  >
                    {phrase === "—" ? "— (em dash)" : phrase}
                  </span>
                ))}
              </span>
            </div>
          ) : null}
          {lines.map((row, i) => (
            <p key={i} className={i ? "mt-1.5" : ""}>
              {row.map((s, j) =>
                s.bold ? (
                  <strong key={j} className="font-semibold">
                    {s.text}
                  </strong>
                ) : (
                  <span key={j}>{s.text}</span>
                ),
              )}
              {!done && i === lines.length - 1 ? <span className="sc-caret ml-px inline-block h-[1em] w-[2px] translate-y-[2px] bg-[var(--ink)]" /> : null}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────── figure · pick a code, watch the chat ───────────── */
function Picker() {
  const [id, setId] = useState<CodeId>(CODES[0].id);
  const code = codeFor(id) ?? CODES[0];
  const { ref, t, replay } = useElapsed(timeline(code).total);
  const pick = (next: CodeId) => {
    setId(next);
    replay();
  };
  return (
    <figure ref={ref} className="sc-plate p-4 sm:p-6">
      <Plate tag="start here" title="Put a code in front of your prompt" sub="pick a code · watch the answer change" />
      <div role="radiogroup" aria-label="Code" className="flex flex-wrap gap-1.5">
        {CODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === id}
            onClick={() => pick(item.id)}
            className={`sc-press min-h-10 rounded-full border px-3.5 font-mono text-[13px] font-medium ${FOCUS} ${item.id === id ? RADIO_ON : RADIO_OFF}`}
          >
            {item.code}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        <span className="font-medium text-[var(--ink)]">{code.code}: </span>
        {code.does}
      </p>
      <div className="mt-3">
        <Chat code={code} t={t} />
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <CopyPrompt code={code} />
        </div>
        <button type="button" className={BTN} onClick={replay}>
          Play again
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">{OFFICIAL_NOTE} The chats are the reel&apos;s examples, replayed here.</figcaption>
    </figure>
  );
}

/* ───────────── one card per code: what it does, the ready prompt, the example chat ───────────── */
function Card({ code }: { code: SecretCode }) {
  const { ref, t, replay } = useElapsed(timeline(code).total);
  const index = CODES.findIndex((c) => c.id === code.id) + 1;
  return (
    <article ref={ref} id={`code-${code.id}`} className="sc-plate scroll-mt-24 p-4 sm:p-6">
      <Plate tag={`${String(index).padStart(2, "0")}/${String(CODES.length).padStart(2, "0")}`} title={code.code} sub={code.tag} />

      <div className="sc-card">
        <span className={LABEL}>WHAT IT DOES</span>
        <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--ink)]">{code.does}</p>
        {code.source ? (
          <div className="mt-3 border-t border-[var(--rule)] pt-3">
            <p className="text-[14px] leading-relaxed text-[var(--ink)]">
              &ldquo;
              {code.source.quote.split("`").map((part, i) =>
                i % 2 ? (
                  <code key={i} className="rounded bg-[var(--page)] px-1 font-mono text-[13px]">
                    {part}
                  </code>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
              &rdquo;
            </p>
            <a
              href={code.source.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-1.5 inline-block rounded-sm font-mono text-[12px] text-[var(--muted)] underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)] [overflow-wrap:anywhere] ${FOCUS}`}
            >
              {code.source.label} · code.claude.com/docs/en/model-config
            </a>
          </div>
        ) : null}
        <span className="mt-3 inline-flex min-h-7 items-center rounded-full border border-[var(--rule-strong)] bg-white px-3 font-mono text-[12px] text-[var(--ink)]">
          {code.official ? "official Claude Code keyword" : "prompt prefix you type yourself"}
        </span>
      </div>

      <div className="sc-card mt-2">
        <span className={LABEL}>READY PROMPT</span>
        <div className="mt-2">
          <CopyPrompt code={code} />
        </div>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--soft)]">
          Keep <span className="font-mono text-[var(--ink)]">{code.code}</span> at the start and swap in your own question after it.
        </span>
      </div>

      <div className="mt-2">
        <span className="mb-1.5 block font-mono text-[12px] text-[var(--muted)]">Example · from the reel</span>
        <Chat code={code} t={t} />
      </div>
      <span className="mt-3 flex justify-end">
        <button type="button" className={BTN} onClick={replay}>
          Play again
        </button>
      </span>
    </article>
  );
}

const SC_CSS = `
.sc{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.sc-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.sc-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.sc-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.sc-press:active:not(:disabled){transform:scale(.97)}
.sc-caret{animation:sc-caret 1s steps(1) infinite}
@keyframes sc-caret{50%{opacity:0}}
.sc-dots{display:inline-flex;gap:3px}
.sc-dots i{display:block;width:5px;height:5px;border-radius:50%;background:var(--accent);animation:sc-dot 1s ease-in-out infinite}
.sc-dots i:nth-child(2){animation-delay:.15s}
.sc-dots i:nth-child(3){animation-delay:.3s}
@keyframes sc-dot{0%,100%{opacity:.25;transform:none}50%{opacity:1;transform:translateY(-2px)}}
@media (prefers-reduced-motion:reduce){.sc-caret,.sc-dots i{animation:none}.sc-press{transition:none}}
`;

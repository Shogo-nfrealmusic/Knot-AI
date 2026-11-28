"use client";

// /free/81 (five connectors for Claude): pick a connector and watch one call go out and come back, then one card per connector
// with the reel's line, the README's own words, the install line to copy, the key it needs and the source.
// Same language as /free/67–80: paper plate on a grid, ink lines, one accent (orange), calm motion.
// The call in the figure is an illustration, not a live request. Every label is HTML at 12px or more, so it stays readable on a phone.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { CONNECTORS, HONEST_NOTE, TOTAL_MS, connectorFor, phase, type Connector, type ConnectorId } from "./data";

export type ConnectDemoKind = "picker" | ConnectorId;

export function ConnectDemo({ kind }: { kind: ConnectDemoKind }) {
  const connector = kind === "picker" ? undefined : connectorFor(kind);
  return (
    <div className="cn mt-5 max-w-2xl space-y-3">
      <style>{CN_CSS}</style>
      {kind === "picker" ? <Picker /> : null}
      {connector ? <Card c={connector} /> : null}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `cn-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] ${FOCUS}`;
const LABEL = "block font-mono text-[12px] tracking-[0.04em] text-[var(--accent)]";
const LINK = `inline-block rounded-sm font-mono text-[12px] text-[var(--muted)] underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)] [overflow-wrap:anywhere] ${FOCUS}`;
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

/** The install line (or Composio's option). The whole line is the button, so it is easy to tap. */
function CopyLine({ c }: { c: Connector }) {
  const { state, copy } = useCopy(c.install.text);
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy: ${c.install.text}`}
      className={`cn-press flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2 text-left hover:border-[var(--rule-strong)] ${FOCUS}`}
    >
      <span className="min-w-0 font-mono text-[13px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{c.install.text}</span>
      <span className="shrink-0 font-mono text-[12px]" style={{ color: state === "done" ? "var(--accent)" : "var(--muted)" }} aria-live="polite">
        {state === "done" ? "Copied" : state === "failed" ? "Select it" : "Copy"}
      </span>
    </button>
  );
}

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

/** How far the tool's own drawing is (0 before the call lands, 1 once it has answered). */
function workProgress(t: number) {
  const { step, p } = phase(t);
  return step === "send" ? 0 : step === "work" ? p : 1;
}

/* ───────────── each tool, redrawn small: what it does while Claude waits ───────────── */
function Scene({ id, w }: { id: ConnectorId; w: number }) {
  const ink = "var(--ink)";
  const rule = "var(--rule-strong)";
  const acc = "var(--accent)";
  const common = { viewBox: "0 0 120 72", className: "h-auto w-full", "aria-hidden": true } as const;
  if (id === "perplexity") {
    // a search box, then three results come in, each with its source
    return (
      <svg {...common}>
        <rect x="6" y="5" width="108" height="12" rx="6" fill="#fff" stroke={ink} strokeWidth="1" />
        <circle cx="14" cy="11" r="2.6" fill="none" stroke={acc} strokeWidth="1.2" />
        {[0, 1, 2].map((i) => {
          const s = ease(w * 3 - i);
          return (
            <g key={i} opacity={s} transform={`translate(${(1 - s) * 6} 0)`}>
              <rect x="8" y={25 + i * 15} width={i === 0 ? 70 : 58} height="3" rx="1.5" fill={ink} />
              <rect x="8" y={31 + i * 15} width="44" height="2" rx="1" fill={rule} />
              <circle cx="104" cy={28 + i * 15} r="3.4" fill={i === 0 ? acc : "#fff"} stroke={i === 0 ? acc : rule} strokeWidth="1" />
            </g>
          );
        })}
      </svg>
    );
  }
  if (id === "firecrawl") {
    // a messy web page on the left turns into Markdown lines on the right
    const lines = [
      { x: 70, wd: 34, mark: "#" },
      { x: 70, wd: 40, mark: "" },
      { x: 70, wd: 30, mark: "-" },
      { x: 70, wd: 36, mark: "-" },
    ];
    return (
      <svg {...common}>
        <rect x="4" y="6" width="48" height="60" rx="4" fill="#fff" stroke={ink} strokeWidth="1" />
        <rect x="9" y="12" width="38" height="10" rx="1.5" fill={rule} />
        <rect x="9" y="26" width="16" height="16" rx="1.5" fill={rule} />
        <rect x="28" y="27" width="19" height="3" rx="1.5" fill={rule} />
        <rect x="28" y="33" width="15" height="3" rx="1.5" fill={rule} />
        <rect x="9" y="47" width="38" height="3" rx="1.5" fill={rule} />
        <rect x="9" y="54" width="28" height="3" rx="1.5" fill={rule} />
        <path d="M55 36h8" stroke={acc} strokeWidth="1.4" strokeLinecap="round" />
        <path d="M60 32.5l3.5 3.5-3.5 3.5" fill="none" stroke={acc} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        {lines.map((l, i) => {
          const s = ease(w * 4 - i);
          return (
            <g key={i} opacity={s}>
              {l.mark ? <rect x={l.x - 1} y={13 + i * 13} width="4" height="4" rx={l.mark === "#" ? 0.5 : 2} fill={acc} /> : null}
              <rect x={l.x + 6} y={14 + i * 13} width={l.wd * s} height="2.6" rx="1.3" fill={ink} />
            </g>
          );
        })}
      </svg>
    );
  }
  if (id === "posthog") {
    // a small chart of your own data grows, the last bar picked out
    const bars = [18, 26, 22, 34, 46];
    return (
      <svg {...common}>
        <path d="M10 62H112" stroke={ink} strokeWidth="1" />
        <path d="M10 10V62" stroke={rule} strokeWidth="1" />
        {bars.map((h, i) => {
          const s = ease(w * 2.2 - i * 0.3);
          return <rect key={i} x={18 + i * 19} y={62 - h * s} width="11" height={h * s} rx="1.5" fill={i === bars.length - 1 ? acc : "#fff"} stroke={i === bars.length - 1 ? acc : ink} strokeWidth="1" />;
        })}
      </svg>
    );
  }
  if (id === "playwright") {
    // a browser window: the cursor moves to the button and clicks it
    const move = ease(w / 0.6);
    const click = w > 0.62 ? ease((w - 0.62) / 0.38) : 0;
    const cx = 96 - move * 46;
    const cy = 64 - move * 20;
    return (
      <svg {...common}>
        <rect x="4" y="4" width="112" height="64" rx="5" fill="#fff" stroke={ink} strokeWidth="1" />
        <path d="M4 15H116" stroke={rule} strokeWidth="1" />
        <circle cx="11" cy="9.5" r="1.8" fill={rule} />
        <circle cx="17" cy="9.5" r="1.8" fill={rule} />
        <rect x="14" y="22" width="52" height="3" rx="1.5" fill={ink} />
        <rect x="14" y="29" width="38" height="2.4" rx="1.2" fill={rule} />
        <rect x="30" y="38" width="40" height="13" rx="6.5" fill={click > 0 ? acc : "#fff"} stroke={click > 0 ? acc : ink} strokeWidth="1" />
        {click > 0 ? <circle cx="50" cy="44.5" r={4 + click * 14} fill="none" stroke={acc} strokeWidth="1" opacity={1 - click} /> : null}
        <path d={`M${cx} ${cy}l0 9 2.6-2.4 2 4.4 1.8-.8-2-4.3 3.6-.2z`} fill={ink} stroke="#fff" strokeWidth=".6" strokeLinejoin="round" />
      </svg>
    );
  }
  // composio: one connection fans out to many apps, which light up one after another
  const tiles = Array.from({ length: 12 }, (_, i) => ({ x: 46 + (i % 4) * 18, y: 8 + Math.floor(i / 4) * 21 }));
  return (
    <svg {...common}>
      <circle cx="14" cy="36" r="7" fill="#fff" stroke={ink} strokeWidth="1" />
      <circle cx="14" cy="36" r="2.4" fill={acc} />
      {tiles.map((tile, i) => {
        const on = w * tiles.length > i;
        return (
          <g key={i}>
            <path d={`M21 36C32 36 34 ${tile.y + 7} ${tile.x} ${tile.y + 7}`} fill="none" stroke={on ? acc : rule} strokeWidth=".8" opacity={on ? 0.9 : 0.6} />
            <rect x={tile.x} y={tile.y} width="13" height="13" rx="3" fill={on ? "#fff" : "var(--page)"} stroke={on ? ink : rule} strokeWidth="1" />
            {on ? <circle cx={tile.x + 6.5} cy={tile.y + 6.5} r="1.8" fill={i === 0 ? acc : ink} /> : null}
          </g>
        );
      })}
    </svg>
  );
}

/* ───────────── the call: Claude ⇄ the tool ───────────── */
function Wire({ c, t }: { c: Connector; t: number }) {
  const { step, p } = phase(t);
  const out = step === "send";
  const back = step === "return";
  // where the packet is along the wire, 0 = Claude, 1 = the tool
  const at = out ? ease(p) : back ? 1 - ease(p) : step === "work" ? 1 : 0;
  const lit = out ? ease(p) : back ? 1 : step === "work" ? 1 : 0;
  const status =
    step === "send" ? `Claude calls ${c.name}` : step === "work" ? `${c.name} is working` : `Back to Claude: ${c.back}`;
  return (
    <div className="cn-card">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Claude */}
        <div className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 sm:w-20">
          <span
            className="flex size-11 items-center justify-center rounded-full font-mono text-[14px] font-semibold text-white transition-colors"
            style={{ background: step === "done" || back ? "var(--accent)" : "var(--ink)" }}
            aria-hidden
          >
            C
          </span>
          <span className="font-mono text-[12px] text-[var(--ink)]">Claude</span>
        </div>

        {/* the wire, with the call travelling along it */}
        <div className="relative h-11 min-w-8 flex-1" aria-hidden>
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--rule-strong)]" />
          <span className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-[var(--accent)]" style={{ width: `${lit * 100}%`, opacity: step === "done" ? 0.35 : 1 }} />
          {step !== "done" ? (
            <span
              className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]"
              style={{ left: `${at * 100}%` }}
            />
          ) : null}
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 font-mono text-[12px] text-[var(--muted)]">MCP</span>
        </div>

        {/* the tool */}
        <div className="w-[44%] max-w-[13rem] shrink-0">
          <div className="rounded-lg border bg-[var(--page)] p-1.5 transition-colors" style={{ borderColor: step === "work" ? "var(--accent)" : "var(--rule)" }}>
            <Scene id={c.id} w={workProgress(t)} />
          </div>
          <span className="mt-1 block text-center font-mono text-[12px] text-[var(--ink)]">{c.name}</span>
        </div>
      </div>

      <div className="mt-3 grid gap-1.5 border-t border-[var(--rule)] pt-3 sm:grid-cols-2">
        <p className="font-mono text-[12px] leading-relaxed text-[var(--soft)]">
          <span className="text-[var(--accent)]">→ </span>
          {c.ask}
        </p>
        <p className="font-mono text-[12px] leading-relaxed transition-opacity" style={{ color: "var(--soft)", opacity: back || step === "done" ? 1 : 0.35 }}>
          <span className="text-[var(--accent)]">← </span>
          {c.back}
        </p>
      </div>
      <p className="mt-2 text-[13px] font-medium text-[var(--ink)]" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

/** The facts under the figure: the README's words, the line to copy, the key, the source. */
function Facts({ c }: { c: Connector }) {
  const host = c.href.replace(/^https:\/\//, "");
  return (
    <>
      <div className="cn-card mt-2">
        <span className={LABEL}>IN ITS README</span>
        <p className="mt-2 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--ink)]">&ldquo;{c.quote}&rdquo;</p>
      </div>
      <div className="cn-card mt-2">
        <span className={LABEL}>{c.install.kind === "command" ? "ADD IT" : "TURN IT ON"}</span>
        <div className="mt-2">
          <CopyLine c={c} />
        </div>
        <span className="mt-1.5 block text-[13px] leading-relaxed text-[var(--soft)]">{c.install.where}</span>
      </div>
      <div className="cn-card mt-2">
        <span className={LABEL}>WHAT YOU NEED</span>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--ink)]">{c.key}</p>
        <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          <a href={c.href} target="_blank" rel="noopener noreferrer" className={LINK}>
            Source · {host}
          </a>
          {c.docs ? (
            <a href={c.docs} target="_blank" rel="noopener noreferrer" className={LINK}>
              Docs · {c.docs.replace(/^https:\/\//, "")}
            </a>
          ) : null}
        </span>
      </div>
    </>
  );
}

/* ───────────── figure · pick a connector, watch the call ───────────── */
function Picker() {
  const [id, setId] = useState<ConnectorId>(CONNECTORS[0].id);
  const c = connectorFor(id) ?? CONNECTORS[0];
  const { ref, t, replay } = useElapsed(TOTAL_MS);
  const pick = (next: ConnectorId) => {
    setId(next);
    replay();
  };
  return (
    <figure ref={ref} className="cn-plate p-4 sm:p-6">
      <Plate tag="start here" title="Plug a tool into Claude" sub="pick a connector · watch one call go out and come back" />
      <div role="radiogroup" aria-label="Connector" className="flex flex-wrap gap-1.5">
        {CONNECTORS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === id}
            onClick={() => pick(item.id)}
            className={`cn-press min-h-10 rounded-full border px-3.5 text-[13px] font-medium ${FOCUS} ${item.id === id ? RADIO_ON : RADIO_OFF}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      <p className="mt-3 text-[15px] font-semibold leading-snug text-[var(--ink)]">{c.line}</p>
      <div className="mt-3">
        <Wire c={c} t={t} />
      </div>
      <Facts c={c} />
      <span className="mt-3 flex justify-end">
        <button type="button" className={BTN} onClick={replay}>
          Play again
        </button>
      </span>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">{HONEST_NOTE} The call in the figure is an illustration, not a live request.</figcaption>
    </figure>
  );
}

/* ───────────── one card per connector ───────────── */
function Card({ c }: { c: Connector }) {
  const { ref, t, replay } = useElapsed(TOTAL_MS);
  const index = CONNECTORS.findIndex((x) => x.id === c.id) + 1;
  return (
    <article ref={ref} id={`connector-${c.id}`} className="cn-plate scroll-mt-24 p-4 sm:p-6">
      <Plate tag={`${String(index).padStart(2, "0")}/${String(CONNECTORS.length).padStart(2, "0")}`} title={c.name} sub={c.line} />
      <Wire c={c} t={t} />
      <Facts c={c} />
      <span className="mt-3 flex justify-end">
        <button type="button" className={BTN} onClick={replay}>
          Play again
        </button>
      </span>
    </article>
  );
}

const CN_CSS = `
.cn{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.cn-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.cn-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.cn-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.cn-press:active:not(:disabled){transform:scale(.97)}
@media (prefers-reduced-motion:reduce){.cn-press{transition:none}}
`;

"use client";

// /free/58 (FreeLLMAPI): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–55: paper plate, ink lines, one accent (Claude Code's orange).
// Real (README, docs and source of tashfeenahmed/freellmapi, read Nov 8, 2026): ~7.4B tokens a month, 34 providers and the
// twelve the README names, 635 free endpoints (584 chat, 41 embeddings, 7 transcription, 3 video), 474 model families,
// the setup-claude command and what it does, the 429/5xx fallover with cooldowns, the handoff note's text and its .env
// switch, the limits in the README. The requests, the chain order and the times of day inside the figures are examples.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type FreeLlmApiDemoKind = "stack" | "setup" | "failover" | "limits";

export function FreeLlmApiDemo({ kind }: { kind: FreeLlmApiDemoKind }) {
  return (
    <div className="fl mt-5 max-w-2xl">
      <style>{FL_CSS}</style>
      {kind === "stack" && <Stack />}
      {kind === "setup" && <Setup />}
      {kind === "failover" && <Failover />}
      {kind === "limits" && <Limits />}
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
      className={`fl-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:opacity-40 ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
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
          className={`fl-press whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] sm:px-3 ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** the repo's name plate: the owner's GitHub avatar, the repo, and its stars when this page was made */
function Plate({ n }: { n: number }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/free/58/av.jpg" alt="tashfeenahmed on GitHub" width={36} height={36} className="size-9 shrink-0 rounded-[10px] border border-[var(--rule)] bg-white" />
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/04</span>
          <span className="truncate text-[15px] font-semibold text-[var(--ink)]">FreeLLMAPI</span>
        </span>
        <span className="block truncate font-mono text-[11.5px] text-[var(--muted)]">tashfeenahmed/freellmapi · MIT</span>
      </span>
      <span className="ml-auto shrink-0 text-right">
        <span className="block font-mono text-[14px] font-semibold tabular-nums text-[var(--ink)]">★ {fmt(STARS)}</span>
        <span className="block font-mono text-[10.5px] text-[var(--muted)]">stars · Nov 8, 2026</span>
      </span>
    </div>
  );
}
const STARS = 48_792; // GitHub API, Nov 8, 2026 05:28 JST

/* ───────────── 01 stack: 34 free tiers, one endpoint; the 635 endpoints by type ───────────── */
// README, "Supported providers": the twelve it names, "… and 22 more free providers"
const NAMED = ["Google", "Groq", "Cerebras", "OpenCode Zen", "Mistral", "OpenRouter", "Cloudflare", "Cohere", "Z.ai", "NVIDIA", "HuggingFace", "ModelScope"];
const MORE = 22;
const LINES = NAMED.length + MORE; // 34
// README, "Premium (live catalog)": 635 free provider/model endpoints (584 chat, 41 embeddings, 7 transcription, 3 video)
const KINDS = [
  { id: "chat", label: "chat", n: 584, color: "var(--accent)" },
  { id: "emb", label: "embeddings", n: 41, color: "#15171a" },
  { id: "stt", label: "transcription", n: 7, color: "#868b92" },
  { id: "video", label: "video", n: 3, color: "#c4c7c2" },
] as const;
const ENDPOINTS = 635;
function Stack() {
  const { ref, t, reduce } = useClock();
  const [hot, setHot] = useState<number | null>(null);
  const [kind, setKind] = useState<string>("chat");
  const grow = reduce ? 1 : ease(ramp(t, 0.1, 1.6));
  const W = 340, H = 92;
  const sel = KINDS.find((k) => k.id === kind) ?? KINDS[0];
  return (
    <figure ref={ref} className="fl-plate p-4 sm:p-6">
      <Plate n={1} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { v: `~${(7.4 * grow).toFixed(1)}B`, l: "free tokens / month" },
          { v: fmt(34 * grow), l: "providers" },
          { v: fmt(ENDPOINTS * grow), l: "free endpoints" },
          { v: fmt(474 * grow), l: "model families" },
        ].map((s) => (
          <div key={s.l} className="fl-card">
            <span className="block font-mono text-[18px] font-semibold tabular-nums text-[var(--ink)]">{s.v}</span>
            <span className="block text-[11.5px] text-[var(--muted)]">{s.l}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5" onMouseLeave={() => setHot(null)}>
        {NAMED.map((p, i) => (
          <button
            key={p}
            type="button"
            onMouseEnter={() => setHot(i)}
            onFocus={() => setHot(i)}
            onClick={() => setHot((v) => (v === i ? null : i))}
            aria-pressed={hot === i}
            className="fl-press rounded-md border bg-white px-2 py-1 font-mono text-[11.5px] text-[var(--ink)]"
            style={{ borderColor: hot === i ? "var(--accent)" : "var(--rule)" }}
          >
            {p}
          </button>
        ))}
        <span className="flex items-center gap-[3px] rounded-md border border-dashed border-[var(--rule-strong)] bg-white px-2 py-1">
          {Array.from({ length: MORE }, (_, i) => (
            <span key={i} className="size-[5px] rounded-[1.5px] bg-[var(--rule-strong)]" />
          ))}
          <span className="ml-1 font-mono text-[11px] text-[var(--muted)]">+22 more</span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="mt-1 block h-[84px] w-full" aria-hidden>
        {Array.from({ length: LINES }, (_, i) => {
          const x = ((i + 0.5) / LINES) * W;
          const on = hot === null || hot === i;
          return (
            <line key={i} x1={x} y1={0} x2={W / 2} y2={H} stroke={hot === i ? "var(--accent)" : "var(--ink)"} strokeOpacity={on ? (hot === i ? 1 : 0.22) : 0.07} strokeWidth={hot === i ? 1.6 : 1} vectorEffect="non-scaling-stroke" />
          );
        })}
        {!reduce &&
          Array.from({ length: LINES }, (_, i) => {
            if (hot !== null && hot !== i) return null;
            const p = (t * 0.55 + i * 0.137) % 1;
            const x0 = ((i + 0.5) / LINES) * W;
            return <circle key={i} cx={x0 + (W / 2 - x0) * p} cy={H * p} r={1.6} fill="var(--accent)" opacity={hot === i ? 1 : 0.7} />;
          })}
      </svg>
      <div className="flex flex-col items-center">
        <div className="fl-card text-center font-mono text-[12.5px]" style={{ borderColor: "var(--accent)" }}>
          <span className="block text-[var(--ink)]">localhost:3001</span>
          <span className="block text-[11px] text-[var(--muted)]">/v1 (OpenAI) · /v1/messages (Anthropic)</span>
        </div>
        <span className="h-5 w-px bg-[var(--ink)] opacity-40" />
        <div className="fl-card font-mono text-[12.5px] text-[var(--ink)]">Claude Code, one key: freellmapi-…</div>
      </div>
      <p className="mt-3 min-h-[20px] text-center font-mono text-[11.5px] text-[var(--soft)]">
        {hot === null ? "Tap a provider to follow its free tier into the one endpoint." : `${NAMED[hot]}'s free tier → the same endpoint as the other 33.`}
      </p>
      <div className="mt-5">
        <div className="flex items-baseline justify-between font-mono text-[11.5px] text-[var(--muted)]">
          <span>the 635 free endpoints, by type</span>
          <span className="tabular-nums text-[var(--ink)]">{sel.n} {sel.label} · {((sel.n / ENDPOINTS) * 100).toFixed(1)}%</span>
        </div>
        <div className="mt-2 flex h-7 overflow-hidden rounded-md bg-white shadow-[0_0_0_1px_var(--rule)]">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-label={`${k.n} ${k.label}`}
              onMouseEnter={() => setKind(k.id)}
              onClick={() => setKind(k.id)}
              className="h-full transition-[opacity,width] duration-700"
              style={{ width: `${(k.n / ENDPOINTS) * 100 * grow}%`, background: k.color, opacity: kind === k.id ? 1 : 0.35 }}
            />
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              aria-pressed={kind === k.id}
              onClick={() => setKind(k.id)}
              onMouseEnter={() => setKind(k.id)}
              className="fl-press flex items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 font-mono text-[11.5px]"
              style={{ borderColor: kind === k.id ? "var(--ink)" : "var(--rule)" }}
            >
              <span className="size-2 rounded-full" style={{ background: k.color }} />
              <span className="text-[var(--ink)]">{k.label}</span>
              <span className="tabular-nums text-[var(--muted)]">{k.n}</span>
            </button>
          ))}
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        All numbers are the README&apos;s (Nov 8, 2026): about 7.4 billion tokens a month of listed free-tier capacity, 34 providers, 474 model families and 635 free endpoints, split 584 chat, 41 embeddings, 7 transcription and 3 video. The twelve providers shown are the ones the README names; the other 22 are on freellmapi.co/models. You only get the tiers you add your own keys for.
      </figcaption>
    </figure>
  );
}

/* ───────────── 02 setup: start the router, add keys, point Claude Code at it ───────────── */
const SETUP_CMD = "npx freellmapi setup-claude --url http://localhost:3001 --api-key <unified-key>";
// README "Quick start", "Desktop app"; docs/en/clients/01-agent-clients.md "Coding agents"
const STEPS = [
  { title: "Start the router", says: "The desktop app (macOS .dmg, Windows .exe) or Docker. It serves on localhost:3001." },
  { title: "Add your provider keys", says: "On the Keys page. They're stored AES-256-GCM encrypted; copy the one unified key from the page header." },
  { title: "Point Claude Code at it", says: "setup-claude merges into your Claude Code config and makes a timestamped backup first. Add --dry-run to see the diff." },
  { title: "Use Claude Code as usual", says: "It talks to /v1/messages; the router picks a free model. Each response's X-Routed-Via header names who served it." },
];
function Setup() {
  const { ref, t, reduce } = useClock();
  const [step, setStep] = useState(0);
  const [t0, setT0] = useState(0);
  const s = reduce ? 99 : t - t0;
  const typed = step >= 2 ? Math.floor(ramp(step === 2 ? s : 99, 0.1, 1.4) * SETUP_CMD.length) : 0;
  const go = (n: number) => { setStep(n); setT0(t); };
  const lit = (i: number) => step > i;
  // the path Claude Code → router → a provider, drawn once all four steps are done
  const flow = step >= 4 && !reduce ? (t * 0.5) % 1 : step >= 4 ? 0.5 : -1;
  return (
    <figure ref={ref} className="fl-plate p-4 sm:p-6">
      <Plate n={2} />
      <svg viewBox="0 0 600 120" className="block w-full" role="img" aria-label="Claude Code sends requests to the router on localhost:3001, which forwards them to your providers">
        {[
          { x: 20, label: "Claude Code", sub: "your config", on: lit(2) },
          { x: 225, label: "localhost:3001", sub: "the router", on: lit(0) },
          { x: 430, label: "your providers", sub: "your own keys", on: lit(1) },
        ].map((b) => (
          <g key={b.label}>
            <rect x={b.x} y={34} width={150} height={52} rx={10} fill="#fff" stroke={b.on ? "var(--accent)" : "var(--rule-strong)"} strokeWidth={b.on ? 1.6 : 1} />
            <text x={b.x + 75} y={57} textAnchor="middle" className="fl-svg-t" fill={b.on ? "var(--ink)" : "var(--muted)"}>{b.label}</text>
            <text x={b.x + 75} y={74} textAnchor="middle" className="fl-svg-s">{b.sub}</text>
          </g>
        ))}
        <line x1={170} y1={60} x2={225} y2={60} stroke={lit(2) ? "var(--ink)" : "var(--rule-strong)"} strokeDasharray={lit(2) ? undefined : "3 4"} />
        <line x1={375} y1={60} x2={430} y2={60} stroke={lit(1) ? "var(--ink)" : "var(--rule-strong)"} strokeDasharray={lit(1) ? undefined : "3 4"} />
        <text x={197} y={28} textAnchor="middle" className="fl-svg-s">/v1/messages</text>
        <text x={402} y={28} textAnchor="middle" className="fl-svg-s">free tiers</text>
        {flow >= 0 && <circle cx={170 + (430 - 170) * flow} cy={60} r={4} fill="var(--accent)" />}
      </svg>
      <ol className="mt-3 space-y-1.5">
        {STEPS.map((st, i) => {
          const done = i < step, now = i === step;
          return (
            <li key={st.title} className="fl-card flex items-start gap-3 py-2 transition-[box-shadow,opacity] duration-300" style={{ boxShadow: now ? "0 0 0 1.5px var(--accent)" : undefined, opacity: i > step ? 0.5 : 1 }}>
              <span className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${done ? "bg-[var(--ink)] text-white" : now ? "bg-[var(--accent)] text-white" : "border border-[var(--rule-strong)] text-[var(--muted)]"}`}>{done ? "✓" : i + 1}</span>
              <span className="min-w-0">
                <span className="block text-[13px] font-medium text-[var(--ink)]">{st.title}</span>
                {(now || done) && <span className="fl-in block text-[12.5px] leading-snug text-[var(--soft)]">{st.says}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 min-h-[64px] overflow-hidden rounded-xl bg-[#15171a] p-3.5 font-mono text-[11.5px] leading-relaxed sm:text-[12px]">
        {step < 2 ? (
          <span className="text-[#868b92]">{step === 0 ? "# 1. open the app, or run the router in Docker" : "# 2. Keys page → add keys → copy the unified key"}</span>
        ) : (
          <>
            <div className="break-all text-[#a6e3a1]">~ % <span className="text-[#e7e7ea]">{SETUP_CMD.slice(0, typed)}</span>{typed < SETUP_CMD.length && <span className="fl-caret">▍</span>}</div>
            {typed >= SETUP_CMD.length && <div className="fl-in mt-1 text-[#868b92]"># merged into your Claude Code config, with a timestamped backup first</div>}
          </>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button primary onClick={() => go(Math.min(STEPS.length, step + 1))} disabled={step >= STEPS.length}>{step >= STEPS.length ? "Done" : "Next step"}</Button>
        <Button onClick={() => go(0)}>Start over</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The steps and the command are from the README and the project&apos;s Clients &amp; coding agents guide. Claude Code gets the server root (no /v1), because it adds the Anthropic Messages path itself. The command is copyable under this figure.
      </figcaption>
    </figure>
  );
}

/* ───────────── 03 failover: a 429 sends the request to the next model; the handoff note goes with it ───────────── */
type Handoff = "off" | "on_model_switch";
const HANDOFF_OPTS: { id: Handoff; label: string }[] = [
  { id: "off", label: "off (default)" },
  { id: "on_model_switch", label: "on_model_switch" },
];
// the example models are the ones in the project's own handoff example
const CHAIN = ["groq:llama-3", "google:gemini-flash", "next in your chain"];
// docs/en/clients/01-agent-clients.md, "Context Handoff" (server/src/services/context-handoff.ts builds the same lines)
const NOTE = [
  "FreeLLMAPI context handoff:",
  "You are taking over an ongoing conversation from another model (groq:llama-3 → google:gemini-flash).",
  "Continue the user's task using the conversation context already provided in this request.",
  "Do not restart the task, re-ask already answered setup questions, or discard prior tool results.",
  "Respect the user's latest message as the highest-priority instruction.",
];
function Failover() {
  const { ref, t, reduce } = useClock();
  const [mode, setMode] = useState<Handoff>("on_model_switch");
  const [hit, setHit] = useState<number | null>(null);
  const s = hit === null ? -1 : reduce ? 99 : t - hit;
  // before the limit: requests go to model 0 and come back 200, on a loop
  const idle = hit === null;
  const loop = reduce ? 0.5 : (t * 0.6) % 1;
  const failed = s > 0.7;
  const moved = ramp(s, 0.95, 1.6);
  const served = s > 1.65;
  const lines = mode === "on_model_switch" ? NOTE.filter((_, i) => s > 1.9 + i * 0.35).length : 0;
  const cool = failed ? Math.max(0, 1 - ramp(s, 0.7, 12)) : 0;
  const reset = () => setHit(null);
  // the request dot runs along a line from the router (x .5, top) to a model (bottom); p = 0 at the router, 1 at the model
  const along = (to: number, p: number) => ({ x: 0.5 + (to - 0.5) * p, y: p });
  let dot: { x: number; y: number } | null = null;
  if (idle) dot = along(0.17, loop < 0.5 ? loop * 2 : (1 - loop) * 2);
  else if (s < 0.7) dot = along(0.17, ease(ramp(s, 0, 0.6)));
  else if (!served) dot = along(0.5, ease(moved));
  return (
    <figure ref={ref} className="fl-plate p-4 sm:p-6">
      <Plate n={3} />
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11.5px] text-[var(--muted)]">.env  FREELLMAPI_CONTEXT_HANDOFF=</span>
        <Toggle value={mode} options={HANDOFF_OPTS} onChange={(m) => { setMode(m); setHit(null); }} label="Context handoff" />
      </div>
      <div className="relative mt-4">
        <div className="mx-auto w-fit fl-card font-mono text-[12.5px] text-[var(--ink)]">Claude Code → router</div>
        <div className="relative h-14">
          {dot && (
            <span className="absolute size-2.5 -translate-x-1/2 rounded-full bg-[var(--accent)]" style={{ left: `${dot.x * 100}%`, top: `${dot.y * 100}%` }} />
          )}
          <svg viewBox="0 0 100 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            {[17, 50, 83].map((x, i) => (
              <line key={x} x1={50} y1={0} x2={x} y2={56} stroke={i === 0 && failed ? "#e5413b" : i === 1 && served ? "var(--accent)" : "var(--ink)"} strokeOpacity={i === 2 ? 0.15 : 0.35} strokeDasharray={i === 2 ? "2 3" : undefined} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {CHAIN.map((m, i) => {
            const down = i === 0 && failed;
            const on = (i === 0 && !failed) || (i === 1 && served);
            return (
              <div key={m} className="fl-card min-h-[74px] px-2 py-2 text-center" style={{ borderColor: down ? "#e5413b" : on ? "var(--accent)" : "var(--rule)", opacity: i === 2 ? 0.5 : 1 }}>
                <span className="block break-words font-mono text-[11.5px] leading-tight text-[var(--ink)]">{m}</span>
                <span className="mt-1 block font-mono text-[11px]">
                  {i === 0 && !failed && <span className="text-[#2f8f4e]">200 OK</span>}
                  {down && <span className="text-[#e5413b]">429 · cooling down</span>}
                  {i === 1 && served && <span key="ok" className="fl-in text-[#2f8f4e]">200 OK</span>}
                  {i === 1 && !served && <span className="text-[var(--muted)]">next</span>}
                  {i === 2 && <span className="text-[var(--muted)]">…</span>}
                </span>
                {down && (
                  <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-[var(--rule)]">
                    <span className="block h-1 rounded-full bg-[#e5413b]" style={{ width: `${cool * 100}%` }} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-3 min-h-[150px] overflow-hidden rounded-xl bg-[#15171a] p-3.5 font-mono text-[11.5px] leading-relaxed sm:text-[12px]">
        {idle && <span className="text-[#868b92]"># mid-session, every request is served by groq:llama-3</span>}
        {!idle && !served && <span className="text-[#868b92]">{failed ? "# 429 from groq: cool that key down, retry the next model" : "# sending…"}</span>}
        {served && mode === "off" && (
          <div className="fl-in">
            <div className="text-[#7dd3e0]">X-Routed-Via: google/gemini-flash</div>
            <div className="mt-1 text-[#868b92]"># the request still carries the conversation, but nothing tells gemini-flash it is taking over. Switch the handoff on.</div>
          </div>
        )}
        {served && mode === "on_model_switch" && (
          <div>
            <div className="text-[#7dd3e0]">system message added before the request goes out:</div>
            {NOTE.slice(0, lines).map((l, i) => (
              <div key={l} className={`fl-in mt-0.5 ${i === 0 ? "text-[#f5c26b]" : "text-[#e7e7ea]"}`}>{l}</div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button primary onClick={() => setHit(t)} disabled={!idle}>Hit the limit</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The chain and the moment are examples; the models are the ones in the project&apos;s own handoff example. The behaviour is the router&apos;s: on a 429 or 5xx it cools that key down and retries the next model in your chain. The note is the real text from the docs (it ends with a short summary of the recent session). It is off by default; turn it on with the .env line above. It is added only when the model changes, never on the first request.
      </figcaption>
    </figure>
  );
}

/* ───────────── 04 limits: a day of free caps (illustration), and what the README warns about ───────────── */
// illustrative hours (UTC) at which five of the best free models hit their daily caps; not measured
const CAPS = [9, 13, 16, 19, 22];
function Limits() {
  const { ref, t, reduce } = useClock();
  const [scrub, setScrub] = useState<number | null>(null);
  const hour = scrub ?? (reduce ? 20 : (t * 1.6) % 24);
  const left = CAPS.filter((c) => hour < c).length;
  return (
    <figure ref={ref} className="fl-plate p-4 sm:p-6">
      <Plate n={4} />
      <div className="flex items-baseline justify-between font-mono text-[11.5px] text-[var(--muted)]">
        <span>a day on the free tiers (UTC)</span>
        <span className="tabular-nums text-[var(--ink)]">{String(Math.floor(hour)).padStart(2, "0")}:{String(Math.floor((hour % 1) * 60)).padStart(2, "0")} UTC</span>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {CAPS.map((c, i) => {
          const capped = hour >= c;
          return (
            <div key={c} className="fl-card px-1.5 py-2 text-center transition-[opacity,border-color] duration-300" style={{ opacity: capped ? 0.45 : 1, borderColor: capped ? "var(--rule)" : "var(--accent)" }}>
              <span className="block font-mono text-[11px] text-[var(--ink)]">top {i + 1}</span>
              <span className={`block font-mono text-[10.5px] ${capped ? "text-[#e5413b]" : "text-[#2f8f4e]"}`}>{capped ? "daily cap" : "free"}</span>
            </div>
          );
        })}
      </div>
      <div className="relative mt-4 h-8">
        <div className="absolute inset-x-0 top-3.5 h-px bg-[var(--rule-strong)]" />
        {CAPS.map((c) => (
          <span key={c} className="absolute top-2 h-3 w-px bg-[#e5413b]" style={{ left: `${(c / 24) * 100}%` }} />
        ))}
        <span className="absolute top-0.5 size-6 -translate-x-1/2 rounded-full border-2 border-[var(--accent)] bg-white" style={{ left: `${(hour / 24) * 100}%` }} />
        <span className="absolute -bottom-2 left-0 font-mono text-[10px] text-[var(--muted)]">00:00</span>
        <span className="absolute -bottom-2 right-0 font-mono text-[10px] text-[var(--muted)]">24:00 reset</span>
      </div>
      <label className="mt-4 block">
        <span className="sr-only">Time of day (UTC)</span>
        <input type="range" min={0} max={23.9} step={0.1} value={hour} onChange={(e) => setScrub(Number(e.target.value))} className="fl-range w-full" />
      </label>
      <p className="mt-2 min-h-[40px] text-[12.5px] leading-snug text-[var(--soft)]">
        {left === CAPS.length
          ? "Early in the day: the best free models still have room."
          : left === 0
            ? "Late in the day: the top free models are capped, so requests go to smaller ones until UTC midnight."
            : `${CAPS.length - left} of ${CAPS.length} top models capped: the router moves down your chain.`}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <Button onClick={() => setScrub(null)} disabled={scrub === null}>Play the day</Button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        An illustration, not measured: the five models and the hours are made up. What it shows is the README&apos;s own warning, that the endpoint&apos;s effective intelligence dips late in the day as top models hit their daily caps, then resets at UTC midnight. Drag the slider to scrub the day.
      </figcaption>
    </figure>
  );
}

const FL_CSS = `
.fl{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.fl-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.fl-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:7px 11px;font-size:13.5px;line-height:1.35}
.fl-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s,box-shadow .2s}
.fl-press:active:not(:disabled){transform:scale(.97)}
.fl-svg-t{font:500 13px ui-monospace,SFMono-Regular,Menlo,monospace}
.fl-svg-s{font:11px ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--muted)}
.fl-range{accent-color:var(--accent)}
@keyframes fl-in{from{opacity:0;transform:translateY(-4px)}}
.fl-in{animation:fl-in .3s ease-out}
@keyframes fl-blink{50%{opacity:0}}
.fl-caret{animation:fl-blink 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){.fl-in,.fl-caret{animation:none}}
`;

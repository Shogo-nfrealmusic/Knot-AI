"use client";

// /free/77 (The LinkedIn agent skill): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–76: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real: every command, quoted line, hook, lexicon entry and rubric item is from github.com/Jakeschincariol/linkedin-agent-skill
// (MIT): README.md, templates/voice.md and the three data files in source.ts. The humanizer runs detect.py's five checks,
// ported in detect.ts, in the browser. Nothing here talks to LinkedIn. See data.ts.

import { useDeferredValue, useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { useInView } from "motion/react";
import {
  CHECKS,
  FIGURES,
  FINE_PRINT,
  INSTALL,
  INSTALL_NOTE,
  REPO,
  RUBRIC_LABELS,
  SAMPLES,
  SKILLS,
  TAGLINE,
  USER_AGREEMENT,
  VERDICT_RULE,
  VOICE,
  VOICE_SECTIONS,
  fixFirst,
  profileTotal,
  type InstallRoute,
  type LinkedinDemoKind,
} from "./data";
import { detect, pyFixed, type Verdict } from "./detect";
import { HOOKS_FILE, RUBRIC_FILE, SLOP } from "./source";

export type { LinkedinDemoKind } from "./data";

const ORDER: Record<LinkedinDemoKind, number> = { eleven: 1, install: 2, humanizer: 3, profile: 4, fineprint: 5 };

export function LinkedinDemo({ kind }: { kind: LinkedinDemoKind }) {
  return (
    <div className="ld mt-5 max-w-2xl">
      <style>{LD_CSS}</style>
      {kind === "eleven" && <Eleven />}
      {kind === "install" && <Install />}
      {kind === "humanizer" && <Humanizer />}
      {kind === "profile" && <Profile />}
      {kind === "fineprint" && <FinePrint />}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
function Plate({ kind }: { kind: LinkedinDemoKind }) {
  const f = FIGURES[kind];
  return (
    <div className="mb-4">
      <span className="flex items-baseline gap-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{ORDER[kind]}/05</span>
        <span className="text-[15px] font-semibold text-[var(--ink)]">{f.title}</span>
      </span>
      <span className="block font-mono text-[11.5px] text-[var(--muted)]">{f.sub}</span>
    </div>
  );
}

function Caption({ kind }: { kind: LinkedinDemoKind }) {
  return <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">{FIGURES[kind].caption}</figcaption>;
}

const LINK = "underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)]";

function Source({ text, path }: { text: string; path?: string }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      <a href={path ? `${REPO}/blob/main/${path}` : REPO} target="_blank" rel="noopener noreferrer" className={LINK}>
        {text}
      </a>
    </p>
  );
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `ld-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const PRIMARY = `ld-press inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 text-[13.5px] font-medium text-white disabled:opacity-40 ${FOCUS}`;

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

/** Counts 0 → total once the figure is on screen, one step every `ms`. With reduced motion it is `total` from the start. */
function useSteps(total: number, ms: number) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { amount: 0.3, once: true });
  const reduce = useReducedMotionSafe();
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!visible || reduce) return;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setStep(n);
      if (n >= total) clearInterval(id);
    }, ms);
    return () => clearInterval(id);
  }, [visible, reduce, run, total, ms]);
  const replay = () => {
    setStep(0);
    setRun((v) => v + 1);
  };
  return { ref, step: reduce ? total : step, replay, reduce, visible };
}

/** Copies `text`; the label turns to "Copied" for a moment, or to "Select and copy" if the browser refuses. */
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
    return ok;
  };
  const state: "idle" | "done" | "failed" = last && last.text === text ? (last.ok ? "done" : "failed") : "idle";
  return { state, copy };
}

/** two or more choices, one of them on */
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
          className={`ld-press rounded-full px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A block to paste, with its own copy button. */
function CopyBlock({ text, label, onCopied }: { text: string; label: string; onCopied?: () => void }) {
  const { state, copy } = useCopy(text);
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--rule)] bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] px-3 py-1.5">
        <span className="font-mono text-[11px] text-[var(--muted)]">{label}</span>
        <button
          type="button"
          className={BTN}
          onClick={async () => {
            await copy();
            onCopied?.();
          }}
          aria-label={`Copy: ${label}`}
        >
          {state === "done" ? "Copied" : state === "failed" ? "Select and copy" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{text}</pre>
    </div>
  );
}

/** Enter and Space press an SVG node the way they press a button. */
const pressKeys = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

const short = (command: string) => command.slice(1);
/** hooks.json writes line breaks in two templates as a literal backslash-n; show them as line breaks. */
const lines = (s: string) => s.split("\\n");

/* ───────────── 1 · the eleven around voice.md: tap a skill for its README line; /li-post opens the 21 hooks ───────────── */
const RING = { cx: 200, cy: 140, rx: 150, ry: 112 };
const NODES = SKILLS.map((s, i) => {
  const a = ((i * 360) / SKILLS.length - 90) * (Math.PI / 180);
  const label = short(s.command);
  return { ...s, label, x: RING.cx + RING.rx * Math.cos(a), y: RING.cy + RING.ry * Math.sin(a), w: label.length * 6.6 + 16 };
});
const SEE_ALSO: Record<string, string> = {
  "/li-human": "Its five checks run in chapter 3.",
  "/li-profile": "Its 12-part rubric is chapter 4.",
};

function Eleven() {
  const [picked, setPicked] = useState(0);
  const [hook, setHook] = useState(0);
  const { ref, step, reduce } = useSteps(SKILLS.length, 90);
  const skill = NODES[picked];
  const h = HOOKS_FILE.hooks[hook];
  const go = (d: number) => setPicked((p) => (p + d + SKILLS.length) % SKILLS.length);
  return (
    <figure ref={ref} className="ld-plate p-4 sm:p-6">
      <Plate kind="eleven" />
      <svg viewBox="0 0 400 290" className="w-full" role="group" aria-label="The eleven skills around voice.md">
        {NODES.map((n, i) => {
          const len = Math.hypot(n.x - RING.cx, n.y - RING.cy);
          const on = i === picked;
          return (
            <line
              key={`l-${n.command}`}
              x1={RING.cx}
              y1={RING.cy}
              x2={n.x}
              y2={n.y}
              stroke={on ? "var(--accent)" : "var(--rule-strong)"}
              strokeWidth={on ? 1.6 : 1}
              strokeDasharray={len}
              strokeDashoffset={i < step ? 0 : len}
              style={{ transition: "stroke-dashoffset .6s cubic-bezier(.22,1,.36,1), stroke .25s" }}
            />
          );
        })}
        {!reduce && step >= SKILLS.length ? (
          <circle key={picked} r="3.2" fill="var(--accent)">
            <animateMotion dur="1.4s" repeatCount="indefinite" path={`M${RING.cx} ${RING.cy} L${skill.x} ${skill.y}`} />
          </circle>
        ) : null}
        <g>
          <rect x={RING.cx - 44} y={RING.cy - 15} width="88" height="30" rx="8" fill="var(--ink)" />
          <text x={RING.cx} y={RING.cy + 4} textAnchor="middle" fontSize="12" fontFamily="ui-monospace, monospace" fill="#fff">
            voice.md
          </text>
        </g>
        {NODES.map((n, i) => {
          const on = i === picked;
          const lit = i < step;
          return (
            <g
              key={n.command}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={n.command}
              className="ld-node cursor-pointer"
              onClick={() => setPicked(i)}
              onKeyDown={pressKeys(() => setPicked(i))}
              style={{ opacity: lit ? 1 : 0.35, transition: "opacity .4s" }}
            >
              <rect
                x={n.x - n.w / 2}
                y={n.y - 12}
                width={n.w}
                height="24"
                rx="12"
                fill={on ? "var(--accent)" : "#fff"}
                stroke={on ? "var(--accent)" : "var(--ink)"}
                strokeWidth="1.1"
                style={{ transition: "fill .25s, stroke .25s" }}
              />
              <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="11" fontFamily="ui-monospace, monospace" fill={on ? "#fff" : "var(--ink)"}>
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="ld-card mt-2" aria-live="polite">
        <span className="flex items-center justify-between gap-3">
          <span className="font-mono text-[14px] font-semibold text-[var(--ink)]">{skill.command}</span>
          <span className="flex gap-1.5">
            <button type="button" className={BTN} onClick={() => go(-1)} aria-label="Previous skill">
              ‹
            </button>
            <button type="button" className={BTN} onClick={() => go(1)} aria-label="Next skill">
              ›
            </button>
          </span>
        </span>
        <span key={skill.command} className="ld-in mt-1.5 block border-l-2 border-[var(--accent)] pl-3 text-[13.5px] leading-relaxed text-[var(--ink)]">
          &ldquo;{skill.does}&rdquo;
        </span>
        {SEE_ALSO[skill.command] ? <span className="mt-1.5 block text-[12px] text-[var(--soft)]">{SEE_ALSO[skill.command]}</span> : null}
      </div>

      {skill.command === "/li-post" ? (
        <div className="ld-card mt-2">
          <span className="font-mono text-[11px] text-[var(--muted)]">hooks.json · 21 formulas · tap a number</span>
          <div className="mt-2 grid grid-cols-7 gap-1" role="radiogroup" aria-label="The 21 hook formulas">
            {HOOKS_FILE.hooks.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={i === hook}
                aria-label={`${x.id}. ${x.name}`}
                onClick={() => setHook(i)}
                className={`ld-press h-8 rounded-md border font-mono text-[12px] tabular-nums ${FOCUS}`}
                style={{
                  borderColor: i === hook ? "var(--ink)" : "var(--rule)",
                  background: i === hook ? "var(--ink)" : "#fff",
                  color: i === hook ? "#fff" : "var(--soft)",
                }}
              >
                {x.id}
              </button>
            ))}
          </div>
          <div key={h.id} className="ld-in mt-3">
            <span className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-mono text-[11px] text-[var(--accent)]">#{h.id}</span>
              <span className="text-[14px] font-semibold text-[var(--ink)]">{h.name}</span>
            </span>
            <dl className="mt-1.5 grid grid-cols-[4.5rem_1fr] gap-x-2 gap-y-1.5 text-[12.5px] leading-snug">
              <dt className="font-mono text-[11px] text-[var(--muted)]">template</dt>
              <dd className="font-mono text-[12px] text-[var(--ink)] [overflow-wrap:anywhere]">
                {lines(h.template).map((l, i) => (
                  <span key={i} className="block min-h-[1em]">
                    {l}
                  </span>
                ))}
              </dd>
              <dt className="font-mono text-[11px] text-[var(--muted)]">example</dt>
              <dd className="border-l-2 border-[var(--accent)] pl-2 text-[var(--ink)]">
                {lines(h.example).map((l, i) => (
                  <span key={i} className="block min-h-[1em]">
                    {l}
                  </span>
                ))}
              </dd>
              <dt className="font-mono text-[11px] text-[var(--muted)]">best for</dt>
              <dd className="text-[var(--soft)]">{h.best_for}</dd>
              <dt className="font-mono text-[11px] text-[var(--muted)]">trap</dt>
              <dd className="text-[var(--soft)]">{h.trap}</dd>
            </dl>
          </div>
        </div>
      ) : null}
      <Caption kind="eleven" />
      <Source text="README, The eleven · skills/li-post/hooks.json" path="README.md" />
    </figure>
  );
}

/* ───────────── 2 · install: three routes, line by line, then voice.md ───────────── */
function Install() {
  const [route, setRoute] = useState<InstallRoute["id"]>("paste");
  const [section, setSection] = useState(VOICE_SECTIONS[0].title);
  const r = INSTALL.find((x) => x.id === route)!;
  const rows = r.text.split("\n");
  // steps 1..n: one line appears per step, then voice.md slides across
  const { ref, step, replay, reduce } = useSteps(rows.length + 1, 380);
  const sec = VOICE_SECTIONS.find((s) => s.title === section)!;
  const moved = step > rows.length;
  return (
    <figure ref={ref} className="ld-plate p-4 sm:p-6">
      <Plate kind="install" />
      <Choice
        label="How to install"
        options={INSTALL.map((x) => ({ id: x.id, label: x.label }))}
        value={route}
        set={(id) => {
          setRoute(id);
          replay();
        }}
      />

      {/* a drawing of the chat or terminal, not a screenshot */}
      <div className="mt-3 rounded-[14px] bg-[var(--ink)] p-3 sm:p-4" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
          <span className="ml-2 font-mono text-[11px] text-white/50">{r.app}</span>
        </span>
        <pre className="mt-3 min-h-[4.5rem] overflow-x-auto font-mono text-[12.5px] leading-relaxed text-white">
          {rows.map((line, i) => (
            <span key={`${route}-${i}`} className="block" style={{ opacity: i < step ? 1 : 0, transform: i < step ? "none" : "translateY(3px)", transition: "opacity .3s, transform .3s" }}>
              {line ? (route === "paste" ? line : `› ${line}`) : " "}
            </span>
          ))}
        </pre>
      </div>

      <div className="mt-2">
        <CopyBlock key={route} text={r.text} label={r.where} />
      </div>
      <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--soft)]">{INSTALL_NOTE}</p>

      <div className="ld-card mt-3">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-[var(--accent)]">THEN · VOICE.MD</span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
        {/* the template, copied into place */}
        <svg viewBox="0 0 320 70" className="mt-2 w-full" role="img" aria-label={`${VOICE.template}, copied to ${VOICE.path}`}>
          <line x1="96" y1="30" x2="214" y2="30" stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 3" />
          <path d="M208 25.5L214 30 208 34.5" fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <FileIcon x={52} label={VOICE.template} dim={false} />
          <FileIcon x={258} label={VOICE.path} dim={!moved} />
          <g style={{ transform: `translateX(${moved ? 206 : 0}px)`, transition: reduce ? "none" : "transform .9s cubic-bezier(.22,1,.36,1)" }}>
            <rect x="44" y="14" width="16" height="20" rx="2" fill="var(--accent)" opacity={moved ? 0 : 0.9} style={{ transition: "opacity .3s .7s" }} />
          </g>
        </svg>
        <p className="mt-1 border-l-2 border-[var(--accent)] pl-3 text-[13px] leading-relaxed text-[var(--ink)]">&ldquo;{VOICE.step}&rdquo;</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <CopyBlock text={VOICE.path} label="where it goes" />
          <CopyBlock text={VOICE.prompt} label="or say, with three posts" />
        </div>

        <span className="mt-3 block text-[12.5px] font-medium text-[var(--ink)]">What voice.md asks for</span>
        <div className="mt-1.5">
          <Choice label="voice.md sections" options={VOICE_SECTIONS.map((s) => ({ id: s.title, label: s.title }))} value={section} set={setSection} />
        </div>
        <div key={sec.title} className="ld-in mt-2 rounded-lg border border-dashed border-[var(--rule-strong)] bg-[var(--page)] px-3 py-2.5">
          <span className="font-mono text-[11px] text-[var(--muted)]">## {sec.title}</span>
          {sec.fields.length ? (
            <ul className="mt-1.5 space-y-1.5">
              {sec.fields.map((f) => (
                <li key={f} className="flex items-end gap-2 text-[12.5px] text-[var(--ink)]">
                  <span className="shrink-0 font-medium">{f}:</span>
                  <span aria-hidden className="mb-1 h-px flex-1 bg-[var(--rule-strong)]" />
                </li>
              ))}
            </ul>
          ) : null}
          {sec.note ? <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--soft)]">{sec.note}</p> : null}
        </div>
      </div>
      <Caption kind="install" />
      <Source text="README, Install · templates/voice.md" path="README.md" />
    </figure>
  );
}

function FileIcon({ x, label, dim }: { x: number; label: string; dim: boolean }) {
  return (
    <g style={{ opacity: dim ? 0.35 : 1, transition: "opacity .4s .6s" }}>
      <path d={`M${x - 10} 12h14l6 6v24h-20z`} fill="#fff" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
      <path d={`M${x + 4} 12v6h6`} fill="none" stroke="var(--ink)" strokeWidth="1.2" strokeLinejoin="round" />
      <text x={x} y="62" textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, monospace" fill="var(--soft)">
        {label}
      </text>
    </g>
  );
}

/* ───────────── 3 · the humanizer: detect.py's five checks on whatever is in the box ───────────── */
type SampleId = keyof typeof SAMPLES;
/** the HUMAN SCORE cells on the dark panel: white for PASS, grey for REVIEW, the accent for FLAGGED */
const VERDICT_CELLS: Record<Verdict, string> = { PASS: "#fff", REVIEW: "rgba(255,255,255,.55)", FLAGGED: "var(--accent)" };
const STRUCTURE_NAME: Record<string, string> = Object.fromEntries([...SLOP.structures.map((s) => [s.id, s.name]), ["uniform-bullets", "Uniform bullet lengths"]]);

function Cells({ score, delay = 0 }: { score: number; delay?: number }) {
  const filled = Math.round((score / 100) * 24);
  return (
    <span aria-hidden className="grid flex-1 grid-cols-[repeat(24,minmax(0,1fr))] gap-[2px]">
      {Array.from({ length: 24 }, (_, i) => (
        <span
          key={i}
          className="h-2.5 rounded-[2px]"
          style={{ background: i < filled ? "currentColor" : "rgba(255,255,255,.12)", transition: `background-color .25s ${delay + i * 12}ms` }}
        />
      ))}
    </span>
  );
}

function Humanizer() {
  const [text, setText] = useState(SAMPLES.draft.text);
  const deferred = useDeferredValue(text);
  const panel = useMemo(() => detect(deferred, SLOP), [deferred]);
  const preset = (Object.keys(SAMPLES) as SampleId[]).find((id) => SAMPLES[id].text === text);
  const scores = panel.checks.map((c) => c.score);
  const avg = scores.reduce((s, x) => s + x, 0) / scores.length;
  const low = Math.min(...scores);
  return (
    <figure className="ld-plate p-4 sm:p-6">
      <Plate kind="humanizer" />
      <div className="flex flex-wrap items-center gap-2">
        <Choice
          label="Start from"
          options={(Object.keys(SAMPLES) as SampleId[]).map((id) => ({ id, label: SAMPLES[id].label }))}
          value={preset ?? ("" as SampleId)}
          set={(id) => setText(SAMPLES[id].text)}
        />
        <button type="button" className={BTN} disabled={!text} onClick={() => setText("")}>
          Clear
        </button>
      </div>
      <label className="mt-2 block">
        <span className="sr-only">Text to score</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={6000}
          rows={7}
          spellCheck={false}
          placeholder="Paste a post, a comment or a DM"
          className={`w-full resize-y rounded-lg border border-[var(--rule)] bg-white px-3 py-2.5 text-[13.5px] leading-relaxed text-[var(--ink)] ${FOCUS}`}
        />
      </label>
      <span className="mt-0.5 block text-right font-mono text-[10.5px] text-[var(--muted)]">{Array.from(text).length.toLocaleString("en-US")} characters · scored in this tab</span>

      {/* detect.py's report, redrawn */}
      <div className="mt-2 rounded-[14px] bg-[var(--ink)] p-3 font-mono text-white sm:p-4" aria-live="polite">
        <span className="block text-[11px] tracking-[0.08em] text-white/55">AI DETECTION PANEL</span>
        <ul className="mt-2 space-y-2">
          {panel.checks.map((c, i) => (
            <li key={c.name}>
              <span className="flex items-center gap-2 text-[11.5px]">
                <span className="w-[6.6rem] shrink-0">{c.name}</span>
                <span className="flex flex-1 text-white">
                  <Cells score={c.score} delay={i * 40} />
                </span>
                <span className="w-10 shrink-0 text-right tabular-nums">{pyFixed(c.score, 1)}</span>
              </span>
              <span className="mt-0.5 block pl-0 text-[10.5px] leading-snug text-white/50 [overflow-wrap:anywhere] sm:pl-[7.1rem]">{c.detail}</span>
            </li>
          ))}
        </ul>
        <span className="my-2.5 block h-px bg-white/20" />
        <span className="flex items-center gap-2 text-[12px] font-semibold">
          <span className="w-[6.6rem] shrink-0">HUMAN SCORE</span>
          <span className="flex flex-1" style={{ color: VERDICT_CELLS[panel.verdict] }}>
            <Cells score={panel.overall} delay={220} />
          </span>
          <span className="w-10 shrink-0 text-right tabular-nums">{pyFixed(panel.overall, 1)}</span>
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/60">
          <span
            className="rounded px-1.5 py-0.5 text-[11px] font-semibold"
            style={{ background: panel.verdict === "FLAGGED" ? "var(--accent)" : panel.verdict === "PASS" ? "#fff" : "rgba(255,255,255,.2)", color: panel.verdict === "PASS" ? "var(--ink)" : "#fff" }}
          >
            {panel.verdict}
          </span>
          <span className="tabular-nums">
            mean {pyFixed(avg, 1)} × 0.6 + weakest {pyFixed(low, 1)} × 0.4
          </span>
        </span>
        {panel.weakest ? <span className="mt-1.5 block text-[11px] text-white/80">Weakest signal: {panel.weakest}. Fix that first.</span> : null}
      </div>

      {panel.terms.length || panel.tells.length ? (
        <div className="ld-card mt-2">
          {panel.terms.length ? (
            <>
              <span className="font-mono text-[11px] text-[var(--muted)]">slop.json found · what humanize.py swaps in</span>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {panel.terms.map((t) => (
                  <li key={t.find} className="ld-in rounded-md border border-[var(--rule)] px-2 py-0.5 font-mono text-[11.5px]">
                    <span className="text-[var(--accent)] line-through decoration-[var(--accent)]">{t.find}</span>
                    <span className="text-[var(--muted)]"> → </span>
                    <span className="text-[var(--ink)]">{t.replace || "(deleted)"}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {panel.tells.length ? (
            <>
              <span className={`block font-mono text-[11px] text-[var(--muted)] ${panel.terms.length ? "mt-2.5" : ""}`}>structural tells · flagged, not fixed</span>
              <ul className="mt-1.5 space-y-0.5 text-[12.5px] text-[var(--ink)]">
                {panel.tells.map((id) => (
                  <li key={id}>{STRUCTURE_NAME[id] ?? id}</li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}

      <details className="ld-card mt-2">
        <summary className={`cursor-pointer text-[12.5px] font-medium text-[var(--ink)] ${FOCUS}`}>What the five checks measure (README)</summary>
        <dl className="mt-2 grid grid-cols-[6.8rem_1fr] gap-x-2 gap-y-1 text-[12.5px]">
          {CHECKS.map((c) => (
            <div key={c.name} className="contents">
              <dt className="font-mono text-[11px] leading-5 text-[var(--ink)]">{c.name}</dt>
              <dd className="leading-5 text-[var(--soft)]">{c.measures}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--soft)]">{VERDICT_RULE}</p>
      </details>
      <Caption kind="humanizer" />
      <Source text="README, The humanizer · skills/li-human/detect.py · slop.json" path="skills/li-human/detect.py" />
    </figure>
  );
}

/* ───────────── 4 · the profile score: tick what is at full marks ───────────── */
const ITEMS = RUBRIC_FILE.items;
const RING_R = 46;
const RING_C = 2 * Math.PI * RING_R;

function Profile() {
  const [full, setFull] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string | null>(null);
  const total = profileTotal(ITEMS, full);
  const next = fixFirst(ITEMS, full).slice(0, 3);
  const { ref, step } = useSteps(1, 200);
  const shown = step > 0 ? total : 0;
  return (
    <figure ref={ref} className="ld-plate p-4 sm:p-6">
      <Plate kind="profile" />
      <div className="grid items-center gap-3 sm:grid-cols-[auto_1fr]">
        <svg viewBox="0 0 120 120" className="mx-auto size-32" role="img" aria-label={`Profile score ${total} out of ${RUBRIC_FILE.total}`}>
          <circle cx="60" cy="60" r={RING_R} fill="#fff" stroke="var(--rule)" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r={RING_R}
            fill="none"
            stroke={total === RUBRIC_FILE.total ? "var(--accent)" : "var(--ink)"}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={RING_C}
            strokeDashoffset={RING_C * (1 - shown / RUBRIC_FILE.total)}
            transform="rotate(-90 60 60)"
            style={{ transition: "stroke-dashoffset .7s cubic-bezier(.22,1,.36,1), stroke .3s" }}
          />
          <text x="60" y="62" textAnchor="middle" fontSize="28" fontWeight="600" fill="var(--ink)" className="tabular-nums">
            {total}
          </text>
          <text x="60" y="80" textAnchor="middle" fontSize="10" fontFamily="ui-monospace, monospace" fill="var(--muted)">
            / {RUBRIC_FILE.total}
          </text>
        </svg>
        <div className="ld-card" aria-live="polite">
          <span className="font-mono text-[11px] text-[var(--accent)]">FIX FIRST · MOST POINTS LOST</span>
          {next.length ? (
            <ol className="mt-1.5 space-y-1">
              {next.map((item, i) => (
                <li key={item.id} className="flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="text-[var(--ink)]">
                    <span className="mr-2 font-mono text-[11px] text-[var(--muted)]">{i + 1}</span>
                    {RUBRIC_LABELS[item.id]}
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-[var(--accent)]">−{item.points}</span>
                </li>
              ))}
            </ol>
          ) : (
            <span className="mt-1.5 block text-[13px] text-[var(--ink)]">Nothing left to fix: 100 of 100.</span>
          )}
          <span className="mt-2 block text-[12px] leading-snug text-[var(--soft)]">{RUBRIC_FILE.note}</span>
        </div>
      </div>

      {/* the 100 points as one strip, one block per item */}
      <div className="mt-3 flex h-3 w-full gap-[2px]" aria-hidden>
        {ITEMS.map((item) => (
          <span
            key={item.id}
            className="h-full rounded-[2px]"
            style={{ flex: item.points, background: full[item.id] ? "var(--ink)" : "var(--rule)", transition: "background-color .3s" }}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" className={BTN} onClick={() => setFull(Object.fromEntries(ITEMS.map((i) => [i.id, true])))} disabled={total === RUBRIC_FILE.total}>
          Tick all
        </button>
        <button type="button" className={BTN} onClick={() => setFull({})} disabled={total === 0}>
          Clear
        </button>
      </div>

      <ul className="mt-2 space-y-1" aria-label="The twelve rubric items">
        {ITEMS.map((item) => {
          const on = !!full[item.id];
          const isOpen = open === item.id;
          return (
            <li key={item.id} className="ld-card p-0!">
              <span className="flex items-center gap-2 px-2.5 py-1.5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={`${RUBRIC_LABELS[item.id]}: full marks`}
                  onClick={() => setFull((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className={`ld-press flex size-6 shrink-0 items-center justify-center rounded-md border ${FOCUS}`}
                  style={{ borderColor: on ? "var(--ink)" : "var(--rule-strong)", background: on ? "var(--ink)" : "#fff", transition: "background-color .2s, border-color .2s" }}
                >
                  <svg viewBox="0 0 12 12" className="size-3" aria-hidden>
                    <path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="12" strokeDashoffset={on ? 0 : 12} style={{ transition: "stroke-dashoffset .3s" }} />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`ld-rubric-${item.id}`}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className={`flex min-h-8 flex-1 items-center justify-between gap-3 text-left text-[13px] ${FOCUS}`}
                >
                  <span className="font-medium text-[var(--ink)]">{RUBRIC_LABELS[item.id]}</span>
                  <span className="font-mono text-[12px] tabular-nums" style={{ color: on ? "var(--ink)" : "var(--muted)" }}>
                    {on ? item.points : 0}/{item.points}
                  </span>
                </button>
              </span>
              <div id={`ld-rubric-${item.id}`} hidden={!isOpen} className="px-2.5 pb-2.5 pl-10">
                <p className="text-[12.5px] leading-relaxed text-[var(--soft)]">
                  <span className="font-mono text-[10.5px] text-[var(--muted)]">full marks · </span>
                  {item.full_marks}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <Caption kind="profile" />
      <Source text="skills/li-profile/rubric.json · SKILL.md" path="skills/li-profile/rubric.json" />
    </figure>
  );
}

/* ───────────── 5 · the fine print: the work stops at a copy-ready block ───────────── */
const PIPE = ["idea", "/li-post", "/li-human", "copy-ready block", "you", "LinkedIn"] as const;
const PX = (i: number) => 26 + i * 57.6;
/** hooks.json #2's template: the block keeps its braces until you put your own numbers in. */
const EXAMPLE_BLOCK = lines(HOOKS_FILE.hooks[1].template).join("\n");

function FinePrint() {
  const [yes, setYes] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [open, setOpen] = useState<string | null>(FINE_PRINT[0].id);
  const { ref, step, reduce } = useSteps(4, 420);
  // how far the work has come: the skills draft (up to the block) on their own; past it only with you
  const reach = pasted ? 5 : yes ? 4 : Math.min(step, 3);
  return (
    <figure ref={ref} className="ld-plate p-4 sm:p-6">
      <Plate kind="fineprint" />
      <svg viewBox="0 0 340 92" className="w-full" role="img" aria-label="idea, li-post, li-human, a copy-ready block, then you, then LinkedIn. No line goes from the skills to LinkedIn.">
        {/* the line that does not exist: skills straight to LinkedIn */}
        <path d={`M${PX(2)} 30 C ${PX(2)} 4, ${PX(5)} 4, ${PX(5)} 26`} fill="none" stroke="var(--rule-strong)" strokeWidth="1.1" strokeDasharray="3 3" />
        <g transform={`translate(${(PX(2) + PX(5)) / 2} 11)`}>
          <circle r="7" fill="#fff" stroke="var(--accent)" strokeWidth="1.2" />
          <path d="M-3 -3L3 3M3 -3L-3 3" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" />
        </g>
        <line x1={PX(0)} y1="44" x2={PX(5)} y2="44" stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 3" />
        <rect x={PX(0)} y="43.25" height="1.5" width={PX(Math.max(0, reach)) - PX(0)} fill="var(--ink)" style={{ transition: reduce ? "none" : "width .5s ease-out" }} />
        {PIPE.map((p, i) => {
          const done = i <= reach;
          const human = i >= 4;
          return (
            <g key={p}>
              <circle
                cx={PX(i)}
                cy="44"
                r={i === reach ? 8 : 6}
                fill={done ? (human ? "var(--accent)" : "var(--ink)") : "#fff"}
                stroke={human ? "var(--accent)" : "var(--ink)"}
                strokeWidth="1.3"
                style={{ transition: "r .3s cubic-bezier(.34,1.56,.64,1), fill .3s" }}
              />
              <text x={PX(i)} y={i % 2 ? 80 : 68} textAnchor="middle" fontSize="9.5" fontFamily="ui-monospace, monospace" fill={done ? "var(--ink)" : "var(--muted)"}>
                {p}
              </text>
            </g>
          );
        })}
        <text x={(PX(2) + PX(5)) / 2} y="28" textAnchor="middle" fontSize="8.5" fontFamily="ui-monospace, monospace" fill="var(--accent)">
          no posting API · no automation
        </text>
      </svg>

      <div className="ld-card mt-2" aria-live="polite">
        <span className="font-mono text-[11px] text-[var(--muted)]">an example block · hooks.json #2, braces left for your own numbers</span>
        <pre
          className="mt-1.5 whitespace-pre-wrap rounded-md bg-[var(--page)] px-2.5 py-2 font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]"
          style={{ filter: yes ? "none" : "blur(3px)", opacity: yes ? 1 : 0.6, transition: "filter .35s, opacity .35s" }}
          aria-hidden={!yes}
        >
          {EXAMPLE_BLOCK}
        </pre>
        <span className="mt-2 flex flex-wrap items-center gap-2">
          {!yes ? (
            <button type="button" className={PRIMARY} onClick={() => setYes(true)}>
              Say yes
            </button>
          ) : (
            <>
              <CopyAndPaste text={EXAMPLE_BLOCK} onCopied={() => setPasted(true)} />
              <button
                type="button"
                className={BTN}
                onClick={() => {
                  setYes(false);
                  setPasted(false);
                }}
              >
                Start again
              </button>
            </>
          )}
        </span>
        <span className="mt-2 block text-[13px] leading-snug" style={{ color: pasted ? "var(--accent)" : "var(--ink)" }}>
          {pasted ? "Copied. Pasting it into LinkedIn is yours to do." : yes ? "Yes given: the block is yours to copy. The skill stops here." : "No yes yet: the draft stays a draft."}
        </span>
      </div>

      <p className="mt-4 text-[13.5px] font-semibold text-[var(--ink)]">{TAGLINE}</p>
      <ul className="mt-2 space-y-1.5">
        {FINE_PRINT.map((item) => {
          const isOpen = open === item.id;
          return (
            <li key={item.id} className="ld-card p-0!">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`ld-fine-${item.id}`}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] font-semibold leading-snug text-[var(--ink)] ${FOCUS}`}
              >
                {item.title}
                <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden style={{ transform: isOpen ? "rotate(45deg)" : "none", transition: "transform .25s" }}>
                  <path d="M6 1v10M1 6h10" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <div id={`ld-fine-${item.id}`} hidden={!isOpen} className="px-3 pb-3">
                <p className="border-l-2 border-[var(--accent)] pl-3 text-[13.5px] leading-relaxed text-[var(--ink)]">{item.body}</p>
                {item.id === "post" ? (
                  <a href={USER_AGREEMENT} target="_blank" rel="noopener noreferrer" className={`mt-1.5 inline-block pl-3 text-[12px] text-[var(--soft)] ${LINK}`}>
                    LinkedIn&apos;s User Agreement
                  </a>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
      <Caption kind="fineprint" />
      <Source text="README, The fine print, which is the honest part" path="README.md" />
    </figure>
  );
}

function CopyAndPaste({ text, onCopied }: { text: string; onCopied: () => void }) {
  const { state, copy } = useCopy(text);
  return (
    <button
      type="button"
      className={PRIMARY}
      onClick={async () => {
        await copy();
        onCopied();
      }}
    >
      {state === "done" ? "Copied" : state === "failed" ? "Select and copy" : "Copy the block"}
    </button>
  );
}

const LD_CSS = `
.ld{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.ld-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.ld-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.ld-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.ld-press:active:not(:disabled){transform:scale(.97)}
.ld-node:focus-visible{outline:none}
.ld-node:focus-visible rect{stroke:var(--accent);stroke-width:2.2}
.ld-in{animation:ld-in .35s cubic-bezier(.22,1,.36,1)}
@keyframes ld-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.ld-in{animation:none}}
`;

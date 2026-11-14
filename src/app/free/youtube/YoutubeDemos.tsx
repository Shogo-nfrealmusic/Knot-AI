"use client";

// /free/66 (the YouTube agent skill): one small live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–65: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real: every command, install line, formula and caveat is from the README, skills/yt-script/hooks.json and the SKILL.md of
// /yt-script and /yt-viral in github.com/Jakeschincariol/youtube-agent-skill (MIT), read 2026-11-14. See data.ts and hooks.ts.
// Nothing here runs the skills or scores a hook: the figures show what the repo says each part does.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { COMMANDS, FINE_PRINT, INSTALL, REPO, VOICE, type InstallWay } from "./data";
import { HOOKS } from "./hooks";

export type YoutubeDemoKind = "install" | "picker" | "hooks" | "voice" | "gate";

export function YoutubeDemo({ kind }: { kind: YoutubeDemoKind }) {
  return (
    <div className="yt mt-5 max-w-2xl">
      <style>{YT_CSS}</style>
      {kind === "install" && <Install />}
      {kind === "picker" && <Picker />}
      {kind === "hooks" && <Hooks />}
      {kind === "voice" && <Voice />}
      {kind === "gate" && <Gate />}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
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

function Source({ text, path }: { text: string; path?: string }) {
  return (
    <p className="mt-2 font-mono text-[10.5px] leading-relaxed text-[var(--muted)] [overflow-wrap:anywhere]">
      Source:{" "}
      <a href={path ? `${REPO}/blob/main/${path}` : REPO} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--rule-strong)] underline-offset-2 hover:text-[var(--ink)]">
        {text}
      </a>
    </p>
  );
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `yt-press rounded-full border border-[var(--rule-strong)] bg-white px-3.5 py-1.5 text-[12.5px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const PRIMARY = `yt-press inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[var(--ink)] px-4 text-[13.5px] font-medium text-white ${FOCUS}`;

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
  const visible = useInView(ref, { amount: 0.35, once: true });
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
  return { ref, step: reduce ? total : step, replay, reduce };
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
  };
  const state: "idle" | "done" | "failed" = last && last.text === text ? (last.ok ? "done" : "failed") : "idle";
  return { state, copy };
}

function Check({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="size-4 shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="7" fill={on ? "var(--accent)" : "#fff"} stroke={on ? "var(--accent)" : "var(--rule-strong)"} strokeWidth="1.2" style={{ transition: "fill .3s, stroke .3s" }} />
      <polyline points="4.6,8.3 7,10.6 11.4,5.8" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
          className={`yt-press rounded-full px-3 py-1.5 text-[12.5px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ───────────── 1 · install: pick a way, copy its lines, watch the eleven skills land ───────────── */
const GOT = COMMANDS.map((c) => c.command);

function Install() {
  const [wayId, setWayId] = useState<InstallWay["id"]>("claude");
  const way = INSTALL.find((w) => w.id === wayId)!;
  const { state, copy } = useCopy(way.body);
  // steps 1–11: one command lights per step; step 12: the check
  const { ref, step, replay, reduce } = useSteps(GOT.length + 1, 150);
  const done = step > GOT.length;
  return (
    <figure ref={ref} className="yt-plate p-4 sm:p-6">
      <Plate n={1} title="Install it" sub="pick a way · copy · paste" />
      <Choice
        label="Way to install"
        options={INSTALL.map((w) => ({ id: w.id, label: w.tab }))}
        value={wayId}
        set={(id) => {
          setWayId(id);
          replay();
        }}
      />
      <div className="yt-card mt-3 p-0!">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--rule)] px-3 py-2">
          <span className="font-mono text-[11.5px] text-[var(--muted)]">{way.label}</span>
          <span className="font-mono text-[11px] text-[var(--muted)]" aria-live="polite">
            {state === "done" ? "Copied" : state === "failed" ? "Select the lines and copy" : ""}
          </span>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap px-3 py-3 font-mono text-[12.5px] leading-relaxed text-[var(--ink)] [overflow-wrap:anywhere]">{way.body}</pre>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[var(--rule)] px-3 py-2.5">
          <button type="button" className={PRIMARY} onClick={copy}>
            {state === "done" ? "Copied" : wayId === "claude" ? "Copy the two lines" : "Copy the two commands"}
          </button>
          <span className="min-w-0 flex-1 basis-[200px] text-[12.5px] leading-snug text-[var(--soft)]">{way.after}</span>
        </div>
      </div>

      <div className="yt-card mt-2">
        <span className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[11.5px] text-[var(--muted)]">{wayId === "code" ? "copied into ~/.claude/skills/" : "what you get"}</span>
          <span className="font-mono text-[11.5px] tabular-nums" style={{ color: done ? "var(--accent)" : "var(--muted)" }}>
            {Math.min(step, GOT.length)}/{GOT.length}
          </span>
        </span>
        <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4" aria-label="The eleven commands">
          {GOT.map((name, i) => {
            const on = i < step;
            return (
              <li
                key={name}
                className="truncate rounded-md border px-2 py-1.5 font-mono text-[11.5px]"
                style={{
                  borderColor: on ? "var(--ink)" : "var(--rule)",
                  color: on ? "var(--ink)" : "var(--muted)",
                  background: on ? "#fff" : "transparent",
                  transform: on ? "none" : "translateY(-4px)",
                  transition: "transform .35s cubic-bezier(.34,1.56,.64,1), color .25s, border-color .25s",
                }}
              >
                {name}
              </li>
            );
          })}
        </ul>
        <span className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-[13px] font-medium" style={{ color: done ? "var(--ink)" : "var(--muted)", transition: "color .3s" }}>
            <Check on={done} />
            Then type <span className="font-mono text-[12.5px]">/yt-script</span> to confirm it works
          </span>
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The three boxes are the README&apos;s own lines. No signup, no API key, nothing to connect.
      </figcaption>
      <Source text="README, Install" path="README.md" />
    </figure>
  );
}

/* ───────────── 2 · the eleven: pick the job, get the command and what comes back ───────────── */
function Picker() {
  const [id, setId] = useState(COMMANDS[0].id);
  const index = COMMANDS.findIndex((c) => c.id === id);
  const c = COMMANDS[index];
  const { state, copy } = useCopy(c.command);
  return (
    <figure className="yt-plate p-4 sm:p-6">
      <Plate n={2} title="What do you want to do?" sub="pick a job · get the command" />
      <div role="radiogroup" aria-label="The job" className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {COMMANDS.map((item) => {
          const on = item.id === id;
          return (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setId(item.id)}
              className={`yt-press flex min-h-11 items-center justify-between gap-2 rounded-[12px] border px-3 py-2 text-left text-[12.5px] font-medium leading-snug ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"}`}
            >
              {item.want}
              {item.tool ? <span aria-hidden className="size-1.5 shrink-0 rounded-full" style={{ background: "var(--accent)" }} /> : null}
            </button>
          );
        })}
      </div>

      {/* the row of eleven: where the picked command sits, and which six carry a Python tool */}
      <svg viewBox="0 0 264 22" className="mt-4 w-full" role="img" aria-label={`Command ${index + 1} of 11`}>
        <line x1="12" y1="8" x2="252" y2="8" stroke="var(--rule-strong)" strokeWidth="1" />
        {COMMANDS.map((item, i) => (
          <g key={item.id}>
            <circle cx={12 + i * 24} cy="8" r={i === index ? 6 : 3.2} fill={i === index ? "var(--accent)" : "var(--ink)"} style={{ transition: "r .3s cubic-bezier(.34,1.56,.64,1), fill .2s" }} />
            {item.tool ? <line x1={12 + i * 24 - 4} y1="19" x2={12 + i * 24 + 4} y2="19" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" /> : null}
          </g>
        ))}
      </svg>

      <div className="yt-card mt-2" aria-live="polite">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span key={c.id} className="yt-in font-mono text-[24px] font-semibold leading-none tracking-[-0.02em] text-[var(--ink)] sm:text-[28px]">{c.command}</span>
          <button type="button" className={BTN} onClick={copy} aria-label={`Copy ${c.command}`}>
            {state === "done" ? "Copied" : state === "failed" ? "Type it instead" : "Copy"}
          </button>
        </span>
        <span className="mt-2.5 block text-[14px] leading-relaxed text-[var(--ink)]">{c.does}</span>
        {c.handsBack ? (
          <>
            <span className="mt-3 block font-mono text-[11px] text-[var(--accent)]">WHAT IT HANDS BACK</span>
            <ul className="mt-1.5 space-y-1">
              {c.handsBack.map((line) => (
                <li key={line} className="flex items-start gap-2.5 text-[13px] leading-snug text-[var(--soft)]">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--ink)]" />
                  {line}
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {c.tool ? (
          <span className="mt-3 block rounded-lg border border-[var(--rule)] bg-[var(--page)] px-3 py-2">
            <span className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--ink)]">
              <span aria-hidden className="size-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              Runs {c.tool.file}: {c.tool.note}
            </span>
            <span className="mt-1 block font-mono text-[11.5px] leading-relaxed text-[var(--soft)] [overflow-wrap:anywhere]">{c.tool.run}</span>
          </span>
        ) : null}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The orange mark means the command runs one of the six Python tools. In the README&apos;s words, they &ldquo;are the reason the skills are not just prompts&rdquo;, and each runs on a clean Python 3 with no dependencies.
      </figcaption>
      <Source text="README, The eleven and The six tools" path="README.md" />
    </figure>
  );
}

/* ───────────── 3 · the 21 formulas: every name in the file's order; a row opens in place ───────────── */
const JOBS = ["confirm the click the title promised", "raise a question the viewer cannot close", "prove the payoff exists"];

function Hooks() {
  const [open, setOpen] = useState<string | null>("the-mistake"); // #3, the first card the reel shows
  // steps 1–3: the three jobs of the first 15 seconds light in turn
  const { ref, step } = useSteps(JOBS.length, 420);
  return (
    <figure ref={ref} className="yt-plate p-4 sm:p-6">
      <Plate n={3} title="The 21 hook formulas" sub="tap a name · read the formula" />

      {/* the first 15 seconds and its three jobs */}
      <div className="yt-card">
        <span className="block text-[12.5px] font-medium text-[var(--ink)]">Whichever formula you pick, the first 15 seconds has three jobs</span>
        <svg viewBox="0 0 264 18" className="mt-2 w-full" aria-hidden>
          <rect x="2" y="6" width="254" height="6" rx="3" fill="var(--rule)" />
          <rect x="2" y="6" width={(254 * step) / JOBS.length} height="6" rx="3" fill="var(--accent)" style={{ transition: "width .4s ease-out" }} />
          {JOBS.map((_, n) => (
            <circle key={n} cx={2 + (254 * (n + 1)) / JOBS.length} cy="9" r="6" fill={n < step ? "var(--ink)" : "#fff"} stroke="var(--ink)" strokeWidth="1.2" style={{ transition: "fill .3s" }} />
          ))}
        </svg>
        <span className="flex justify-between font-mono text-[10.5px] text-[var(--muted)]" aria-hidden>
          <span>0:00</span>
          <span>0:15</span>
        </span>
        <ol className="mt-1.5 grid gap-1 sm:grid-cols-3 sm:gap-2">
          {JOBS.map((job, n) => (
            <li key={job} className="flex items-start gap-2 text-[12.5px] leading-snug" style={{ color: n < step ? "var(--ink)" : "var(--muted)", transition: "color .3s" }}>
              <span className="font-mono text-[11px] text-[var(--accent)]">{n + 1}</span>
              {job}
            </li>
          ))}
        </ol>
      </div>

      <ol className="mt-2 space-y-1" aria-label="The 21 hook formulas">
        {HOOKS.map((h, n) => {
          const on = open === h.id;
          return (
            <li key={h.id} className="yt-card p-0!" style={{ borderColor: on ? "var(--ink)" : undefined, transition: "border-color .2s" }}>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`yt-hook-${h.id}`}
                onClick={() => setOpen(on ? null : h.id)}
                className={`flex min-h-11 w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left ${FOCUS}`}
              >
                <span className="w-6 shrink-0 font-mono text-[12px] tabular-nums" style={{ color: on ? "var(--accent)" : "var(--muted)" }}>
                  {n + 1}
                </span>
                <span className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-[var(--ink)]">{h.name}</span>
                <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden style={{ transform: on ? "rotate(45deg)" : "none", transition: "transform .25s" }}>
                  <path d="M6 1v10M1 6h10" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <dl id={`yt-hook-${h.id}`} hidden={!on} className="yt-in space-y-2.5 px-3 pb-3 pl-12">
                <div>
                  <dt className="font-mono text-[11px] text-[var(--muted)]">The shape</dt>
                  <dd className="mt-0.5 text-[14px] leading-relaxed text-[var(--ink)]">{h.shape}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] text-[var(--muted)]">Its example</dt>
                  <dd className="mt-0.5 border-l-2 border-[var(--accent)] pl-3 text-[14px] leading-relaxed text-[var(--ink)]">&ldquo;{h.example}&rdquo;</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] text-[var(--muted)]">Where it fails</dt>
                  <dd className="mt-0.5 text-[13.5px] leading-relaxed text-[var(--soft)]">{h.failsWhen}</dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        From the file&apos;s own note: a hook that only does the third job &ldquo;is a summary and it leaks&rdquo;. The numbers are the order in hooks.json. /yt-script writes five hooks against these, scores them, and shows you the top two.
      </figcaption>
      <Source text="skills/yt-script/hooks.json" path="skills/yt-script/hooks.json" />
    </figure>
  );
}

/* ───────────── 4 · voice.md: three of your videos in, one file out, every skill reads it ───────────── */
function Voice() {
  const [mode, setMode] = useState<"videos" | "template">("videos");
  const { state, copy } = useCopy(VOICE.ask);
  // steps 1–4: the four things the file holds; step 5: the eleven skills light
  const { ref, step, replay, reduce } = useSteps(VOICE.holds.length + 1, 380);
  const fed = step > 0;
  const read = step > VOICE.holds.length;
  const fileX = 122;
  return (
    <figure ref={ref} className="yt-plate p-4 sm:p-6">
      <Plate n={4} title="voice.md, before anything else" sub="choose how to make it" />
      <Choice
        label="How to make voice.md"
        options={[
          { id: "videos", label: "From three of my videos" },
          { id: "template", label: "Fill in the template" },
        ]}
        value={mode}
        set={(id) => {
          setMode(id);
          replay();
        }}
      />
      <svg viewBox="0 0 320 132" className="mx-auto mt-3 block w-full max-w-[440px]" role="img" aria-label={mode === "videos" ? "Three of your videos go into one file, voice.md, and all eleven skills read it" : "The template is copied to voice.md, you fill it in, and all eleven skills read it"}>
        {/* left: what goes in */}
        {mode === "videos" ? (
          [14, 52, 90].map((y, n) => (
            <g key={y}>
              <rect x="8" y={y} width="50" height="30" rx="5" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" />
              <polygon points={`${28},${y + 9} ${28},${y + 21} ${39},${y + 15}`} fill="var(--ink)" />
              <path d={`M58 ${y + 15} C 92 ${y + 15}, 92 66, ${fileX} 66`} fill="none" stroke={fed ? "var(--ink)" : "var(--rule-strong)"} strokeWidth="1.2" strokeDasharray="3 3" style={{ transition: `stroke .3s ${n * 0.08}s` }} />
            </g>
          ))
        ) : (
          <g>
            <rect x="3" y="46" width="80" height="40" rx="5" fill="#fff" stroke="var(--ink)" strokeWidth="1.2" strokeDasharray="4 3" />
            <text x="43" y="64" textAnchor="middle" className="yt-label">templates/</text>
            <text x="43" y="78" textAnchor="middle" className="yt-label">voice.md</text>
            <path d={`M83 66 L ${fileX} 66`} fill="none" stroke={fed ? "var(--ink)" : "var(--rule-strong)"} strokeWidth="1.2" strokeDasharray="3 3" style={{ transition: "stroke .3s" }} />
          </g>
        )}
        {/* middle: the file, filling in */}
        <rect x={fileX} y="20" width="76" height="92" rx="7" fill="#fff" stroke="var(--ink)" strokeWidth="1.5" />
        <text x={fileX + 38} y="36" textAnchor="middle" className="yt-label" style={{ fill: "var(--ink)" }}>voice.md</text>
        <line x1={fileX} y1="43" x2={fileX + 76} y2="43" stroke="var(--rule)" strokeWidth="1" />
        {VOICE.holds.map((_, n) => (
          <rect key={n} x={fileX + 10} y={52 + n * 14} height="5" rx="2.5" width={n < step ? [54, 40, 50, 34][n] : 0} fill={read ? "var(--accent)" : "var(--ink)"} style={{ transition: "width .35s ease-out, fill .3s" }} />
        ))}
        {/* right: the eleven skills that read it */}
        {COMMANDS.map((c, n) => {
          const y = 11 + n * 11;
          return (
            <g key={c.id}>
              <path d={`M${fileX + 76} 66 C 232 66, 232 ${y}, 258 ${y}`} fill="none" stroke={read ? "var(--accent)" : "var(--rule)"} strokeWidth="1" style={{ transition: `stroke .3s ${n * 0.03}s` }} />
              <circle cx="262" cy={y} r="3.2" fill={read ? "var(--accent)" : "var(--rule-strong)"} style={{ transition: `fill .3s ${n * 0.03}s` }} />
            </g>
          );
        })}
        <text x="273" y="62" className="yt-label">11</text>
        <text x="273" y="74" className="yt-label">skills</text>
      </svg>

      <ol className="mt-1 grid gap-1.5 sm:grid-cols-2">
        {VOICE.holds.map((line, n) => (
          <li key={line} className="yt-card flex items-center gap-2.5 text-[13px] leading-snug" style={{ color: n < step ? "var(--ink)" : "var(--muted)", transition: "color .3s" }}>
            <Check on={n < step} />
            {line}
          </li>
        ))}
      </ol>

      <div className="yt-card mt-2">
        {mode === "videos" ? (
          <>
            <span className="block text-[13px] leading-relaxed text-[var(--soft)]">Send Claude three of your own videos and say:</span>
            <span className="mt-2 flex flex-wrap items-center gap-3">
              <span className="min-w-0 font-mono text-[13.5px] font-semibold text-[var(--ink)] [overflow-wrap:anywhere]">{VOICE.ask}</span>
              <button type="button" className={BTN} onClick={copy}>
                {state === "done" ? "Copied" : state === "failed" ? "Type it instead" : "Copy the line"}
              </button>
            </span>
          </>
        ) : (
          <span className="block text-[13px] leading-relaxed text-[var(--soft)]">
            Copy <span className="font-mono text-[12.5px] text-[var(--ink)]">{VOICE.template}</span> from the repo to{" "}
            <span className="font-mono text-[12.5px] text-[var(--ink)] [overflow-wrap:anywhere]">{VOICE.path}</span> and fill it in. The README puts it at ten minutes.
          </span>
        )}
        <span className="mt-2.5 flex justify-end">
          <button type="button" className={BTN} disabled={reduce} onClick={replay}>
            Replay
          </button>
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The four lines are what /yt-script says the file holds. &ldquo;Every skill reads that file. It matters more here than anywhere else, because you have to say the words out loud.&rdquo;
      </figcaption>
      <Source text="README, Install · skills/yt-script/SKILL.md" path="README.md" />
    </figure>
  );
}

/* ───────────── 5 · the gate: the skill writes, stops, and asks. You carry it across ───────────── */
type Stage = "asked" | "shipped" | "changed";
const DOT_X: Record<Stage, number> = { asked: 150, shipped: 284, changed: 36 };

function Gate() {
  const [stage, setStage] = useState<Stage>("asked");
  const [open, setOpen] = useState<string | null>("publish");
  const reduce = useReducedMotionSafe();
  // the buttons swap when the stage changes; keep keyboard focus on the one that replaces them
  const next = useRef<HTMLButtonElement>(null);
  const answered = useRef(false);
  useEffect(() => {
    if (answered.current) next.current?.focus();
  }, [stage]);
  const answer = (to: Stage) => {
    answered.current = true;
    setStage(to);
  };
  const line: Record<Stage, string> = {
    asked: "The skill has written a block you can copy. It stops here and asks.",
    shipped: "You copied the block and uploaded it yourself. The skill published nothing.",
    changed: "Back to the skill with your notes. It writes again, and asks again.",
  };
  return (
    <figure className="yt-plate p-4 sm:p-6">
      <Plate n={5} title="Ship it, or change it?" sub="answer the skill's last question" />
      <svg viewBox="0 0 320 84" className="mx-auto block w-full max-w-[440px]" role="img" aria-label={line[stage]}>
        <text x="36" y="12" textAnchor="middle" className="yt-label">the skill</text>
        <text x="150" y="12" textAnchor="middle" className="yt-label">a block you copy</text>
        <text x="284" y="12" textAnchor="middle" className="yt-label">YouTube</text>
        {/* Claude's side: solid. Your side: dashed, because only you cross it */}
        <line x1="36" y1="44" x2="150" y2="44" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="150" y1="44" x2="284" y2="44" stroke={stage === "shipped" ? "var(--accent)" : "var(--rule-strong)"} strokeWidth="1.5" strokeDasharray="4 4" style={{ transition: "stroke .3s" }} />
        <rect x="14" y="26" width="44" height="36" rx="8" fill="#fff" stroke="var(--ink)" strokeWidth="1.3" />
        <text x="36" y="48" textAnchor="middle" className="yt-label" style={{ fill: "var(--ink)" }}>/yt-*</text>
        <rect x="126" y="24" width="48" height="40" rx="6" fill="#fff" stroke="var(--ink)" strokeWidth="1.3" />
        {[34, 42, 50].map((y, n) => (
          <line key={y} x1="134" y1={y} x2={[166, 158, 162][n]} y2={y} stroke="var(--rule-strong)" strokeWidth="2" strokeLinecap="round" />
        ))}
        <rect x="262" y="28" width="44" height="32" rx="9" fill="#fff" stroke="var(--ink)" strokeWidth="1.3" />
        <polygon points="279,37 279,51 291,44" fill="var(--ink)" />
        {/* the gate */}
        <line x1="208" y1="20" x2="208" y2="68" stroke="var(--ink)" strokeWidth="1.5" />
        <text x="208" y="80" textAnchor="middle" className="yt-label">you</text>
        {/* the work itself */}
        <g style={{ transform: `translateX(${DOT_X[stage]}px)`, transition: reduce ? "none" : "transform .7s cubic-bezier(.22,1,.36,1)" }}>
          <circle cx="0" cy="44" r="7" fill="var(--accent)" stroke="#fff" strokeWidth="2" />
        </g>
      </svg>
      <div className="yt-card mt-2" aria-live="polite">
        <span className="block text-[14px] font-semibold leading-snug text-[var(--ink)]">{line[stage]}</span>
        <span className="mt-2.5 flex flex-wrap gap-2">
          {stage === "asked" ? (
            <>
              <button ref={next} type="button" className={PRIMARY} onClick={() => answer("shipped")}>
                Ship it
              </button>
              <button type="button" className={`${BTN} h-10 rounded-lg!`} onClick={() => answer("changed")}>
                Change it
              </button>
            </>
          ) : (
            <button ref={next} type="button" className={`${BTN} h-10 rounded-lg!`} onClick={() => answer("asked")}>
              {stage === "shipped" ? "Start over" : "See the next draft"}
            </button>
          )}
        </span>
      </div>

      <ul className="mt-2 space-y-1.5">
        {FINE_PRINT.map((item) => {
          const on = open === item.id;
          return (
            <li key={item.id} className="yt-card p-0!">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`yt-fine-${item.id}`}
                onClick={() => setOpen(on ? null : item.id)}
                className={`flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left text-[13.5px] font-semibold leading-snug text-[var(--ink)] ${FOCUS}`}
              >
                {item.quote}
                <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden style={{ transform: on ? "rotate(45deg)" : "none", transition: "transform .25s" }}>
                  <path d="M6 1v10M1 6h10" stroke="var(--ink)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <p id={`yt-fine-${item.id}`} hidden={!on} className="px-3 pb-3 text-[13px] leading-relaxed text-[var(--soft)]">
                {item.plain}
              </p>
            </li>
          );
        })}
      </ul>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The six bold lines are the README&apos;s own, from its section &ldquo;The fine print&rdquo;, which it calls &ldquo;The part most packs leave out.&rdquo;
      </figcaption>
      <Source text="README, The fine print" path="README.md" />
    </figure>
  );
}

const YT_CSS = `
.yt{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.yt-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.yt-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px}
.yt-label{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;fill:var(--muted)}
.yt-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.yt-press:active:not(:disabled){transform:scale(.97)}
.yt-in{animation:yt-in .35s cubic-bezier(.22,1,.36,1)}
@keyframes yt-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.yt-in{animation:none}}
`;

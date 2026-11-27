"use client";

// Module 3 · Memory that compounds. Figures: a repeated mistake becoming a short dated rule, sorting rules into
// context and enforcement, keeping CLAUDE.md under 200 lines by moving sections out, and one session's context as a
// budget. Rules and commands are the module's; sizes and line counts in the pictures are illustrations, as captioned.

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { CONTENT } from "../content/memory";
import { ModulePage, type Figures } from "../ModulePage";
import { C, Check, FileGlyph, Panel, Plate, POP, Replay, Seg, SPRING, Tag, usePlay } from "../kit";

/* ───────────── hero: a mistake, twice, becomes a rule ───────────── */

function CompoundHero() {
  const { ref, p, replay } = usePlay<HTMLDivElement>(8000);
  const once = p > 0.06;
  const twice = p > 0.26;
  const rule = p > 0.48;
  const landed = p > 0.68;
  return (
    <figure ref={ref} className="gd-plate p-3 sm:p-4" aria-label="The same mistake happens twice, so a three-line dated rule with its reason goes into CLAUDE.md, which stays under its 200-line target.">
      <Panel title="claude · ~/vault" right={<Replay onClick={replay} light />}>
        <div className="grid gap-2 px-4 py-4">
          {[
            { on: once, tag: "once", text: "A late-night journal entry, filed under the wrong date", note: "a one-off is a one-off" },
            { on: twice, tag: "twice", text: "The same mistake again", note: "now it gets a rule" },
          ].map((m) => (
            <motion.div key={m.tag} className="flex items-start gap-3 rounded-lg bg-white/[.05] px-3 py-2.5 ring-1 ring-white/10" initial={false} animate={{ opacity: m.on ? 1 : 0, y: m.on ? 0 : 8 }} transition={SPRING}>
              <span className="mt-0.5 font-mono text-[12px] text-[#ffb59c]">{m.tag}</span>
              <span className="min-w-0">
                <span className="block text-[14.5px] leading-snug text-white">{m.text}</span>
                <span className="block text-[12.5px] text-white/45">{m.note}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </Panel>
      <div className="relative mt-3 rounded-xl bg-white p-4 ring-1 ring-[var(--rule)]">
        <div className="flex items-center gap-3">
          <FileGlyph accent={landed} className="h-8 w-[26px]" />
          <span className="font-mono text-[14px] text-[var(--ink)]">CLAUDE.md</span>
          <motion.span className="ml-auto" initial={false} animate={{ opacity: landed ? 1 : 0, scale: landed ? 1 : 0.9 }} transition={POP}>
            <Tag tone="pass">+3 lines</Tag>
          </motion.span>
        </div>
        <motion.div
          className="mt-3 overflow-hidden rounded-lg border-l-2 border-[var(--accent)] bg-[rgba(224,85,47,.06)] px-3 font-mono text-[12.5px] leading-[1.7] text-[var(--ink)]"
          initial={false}
          animate={{ height: rule ? "auto" : 0, opacity: rule ? 1 : 0, paddingTop: rule ? 8 : 0, paddingBottom: rule ? 8 : 0 }}
          transition={SPRING}
        >
          <p>Entries written after midnight belong to the previous day.</p>
          <p className="text-[var(--soft)]">Why: [the reason, in the owner&apos;s own words]</p>
          <p className="text-[var(--muted)]">Happened twice · YYYY-MM-DD</p>
        </motion.div>
        <div className="mt-4">
          <div className="flex items-baseline justify-between text-[12.5px] text-[var(--muted)]">
            <span>length</span>
            <span className="font-mono">target: under 200 lines</span>
          </div>
          <div className="relative mt-1.5 h-2 rounded-full bg-[#e6e7e3]">
            <motion.span className="absolute inset-y-0 left-0 rounded-full bg-[var(--ink)]" initial={false} animate={{ width: landed ? "63%" : "61%" }} transition={SPRING} />
            <span className="absolute -top-1 bottom-[-4px] left-[80%] w-px bg-[var(--accent)]" aria-hidden="true" />
          </div>
        </div>
      </div>
      <figcaption className="px-2 pb-1 pt-3 text-[14px] leading-relaxed text-[var(--muted)]">
        Our journal rule from Lesson 3.2: three lines, the reason in the owner&apos;s words, and a note that it happened twice. The bar&apos;s length is an illustration.
      </figcaption>
    </figure>
  );
}

/* ───────────── 3.1: context or enforcement ───────────── */

const RULES = [
  { id: "env", text: "Never read .env files", kind: "enforce" },
  { id: "goals", text: "Goals, priorities, how to talk to you", kind: "context" },
  { id: "push", text: "Never push to main", kind: "enforce" },
  { id: "decide", text: "How you make decisions", kind: "context" },
  { id: "pipe", text: "Never pipe a download into a shell", kind: "enforce" },
  { id: "notes", text: "Where notes go", kind: "context" },
  { id: "delete", text: "Never delete notes", kind: "enforce" },
  { id: "done", text: "What \"done\" means", kind: "context" },
] as const;

function AdviceVsEnforcement() {
  const [sorted, setSorted] = useState<string[]>([]);
  const reduce = useReducedMotion();
  const sortOne = (id: string) => setSorted((s) => (s.includes(id) ? s : [...s, id]));
  const all = sorted.length === RULES.length;
  const chip = (r: (typeof RULES)[number], placed: boolean) => (
    <motion.button
      key={r.id}
      layoutId={`rule-${r.id}`}
      type="button"
      onClick={() => sortOne(r.id)}
      disabled={placed}
      transition={reduce ? { duration: 0 } : SPRING}
      className={`flex min-h-11 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[15px] leading-snug ${placed ? (r.kind === "enforce" ? "bg-[var(--panel)] text-white" : "bg-white text-[var(--ink)] ring-1 ring-[var(--rule)]") : "gd-press bg-white text-[var(--ink)] ring-1 ring-[var(--rule-strong)] hover:ring-[var(--ink)]"}`}
    >
      {placed && r.kind === "enforce" ? <Lock /> : <span className={`size-2 shrink-0 rounded-full ${placed ? "bg-[var(--rule-strong)]" : "bg-[var(--accent)]"}`} />}
      <span className="min-w-0">{r.text}</span>
    </motion.button>
  );
  return (
    <Plate caption="Tap each rule to sort it, as in the table above. For every enforced rule, keep a one-line pointer in CLAUDE.md, such as “pushes to main are blocked; ask me”, so Claude knows why it got stopped.">
      <LayoutGroup id="advice-enforce">
        <div className="p-5 sm:p-8">
          <div className="rounded-2xl bg-[rgba(21,23,26,.03)] border border-dashed border-[var(--rule-strong)] p-3">
            <div className="flex items-center justify-between gap-3 px-1 pb-2">
              <span className="font-mono text-[13px] text-[var(--muted)]">Your CLAUDE.md, unsorted</span>
              <button type="button" onClick={() => setSorted(all ? [] : RULES.map((r) => r.id))} className="gd-press min-h-11 rounded-full px-3 text-[13px] text-[var(--soft)] ring-1 ring-[var(--rule)] hover:text-[var(--ink)]">
                {all ? "Start again" : "Sort all"}
              </button>
            </div>
            <div className="grid min-h-11 gap-2 sm:grid-cols-2">
              {RULES.filter((r) => !sorted.includes(r.id)).map((r) => chip(r, false))}
              {all ? <p className="px-1 py-2 text-[14px] text-[var(--muted)]">Nothing left to sort.</p> : null}
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Bucket title="Context" sub="Keep in CLAUDE.md. Non-deterministic: “there's no guarantee.”">
              {RULES.filter((r) => r.kind === "context" && sorted.includes(r.id)).map((r) => chip(r, true))}
            </Bucket>
            <Bucket title="Enforcement" sub="Move to settings or a hook. Deterministic: “Claude Code applies this every time.”" dark>
              {RULES.filter((r) => r.kind === "enforce" && sorted.includes(r.id)).map((r) => chip(r, true))}
            </Bucket>
          </div>
        </div>
      </LayoutGroup>
    </Plate>
  );
}

function Bucket({ title, sub, dark = false, children }: { title: string; sub: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl p-3 ${dark ? "bg-[#e9eae6]" : "bg-white/70 ring-1 ring-[var(--rule)]"}`}>
      <p className="px-1 text-[16px] font-semibold text-[var(--ink)]">{title}</p>
      <p className="px-1 text-[13px] leading-snug text-[var(--muted)]">{sub}</p>
      <div className="mt-3 grid min-h-[120px] content-start gap-2">{children}</div>
    </div>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 20 22" className="h-[16px] w-[15px] shrink-0" aria-hidden="true">
      <path d="M5 10 V7 a5 5 0 0 1 10 0 V10" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <rect x="2" y="10" width="16" height="11" rx="3" fill={C.accent} />
    </svg>
  );
}

/* ───────────── 3.2: move, don't grow ───────────── */

// Line counts are made up for the picture; the 200-line target and where each part moves are the module's.
const PARTS = [
  { id: "core", label: "Goals, how to talk to you, how to disagree", lines: 110, to: null, tone: C.ink },
  { id: "project", label: "A section that only matters for one project", lines: 70, to: "That project's CLAUDE.md", tone: "#4a4f56" },
  { id: "task", label: "Steps that only matter for one task", lines: 50, to: "A skill", tone: "#767b82" },
  { id: "paths", label: "Rules for one kind of file", lines: 60, to: ".claude/rules/ with a paths setting: loads only when Claude touches matching files", tone: C.accent },
] as const;
const SCALE = 300;

function LineBudget() {
  const [moved, setMoved] = useState(false);
  const reduce = useReducedMotion();
  const total = PARTS.reduce((n, x) => n + (moved && x.to ? 0 : x.lines), 0);
  const over = total > 200;
  return (
    <Plate caption="An illustration with made-up line counts. The target is Anthropic's: “under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence.”">
      <div className="p-5 sm:p-8">
        <Seg
          id="line-budget"
          label="As it grows"
          value={moved ? "move" : "grow"}
          onChange={(k) => setMoved(k === "move")}
          options={[
            ["grow", "Keep adding"],
            ["move", "Move, don't grow"],
          ]}
        />
        <div className="mt-6 flex items-baseline justify-between gap-3">
          <span className="font-mono text-[14px] text-[var(--ink)]">CLAUDE.md</span>
          <motion.span key={total} className={`font-mono text-[22px] ${over ? "text-[var(--accent)]" : "text-[#1f7a50]"}`} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
            {total} lines
          </motion.span>
        </div>
        <div className="relative mt-2 h-10 overflow-hidden rounded-xl bg-[#e6e7e3]" role="img" aria-label={`${total} lines, against a 200-line target`}>
          <div className="flex h-full">
            {PARTS.map((x) => {
              const gone = moved && x.to;
              return <motion.span key={x.id} className="h-full border-r border-white/40" initial={false} animate={{ width: gone ? "0%" : `${(x.lines / SCALE) * 100}%`, backgroundColor: x.tone }} transition={reduce ? { duration: 0 } : SPRING} />;
            })}
          </div>
          <span className="absolute inset-y-0 w-[2px] bg-[var(--accent)]" style={{ left: `${(200 / SCALE) * 100}%` }} aria-hidden="true" />
        </div>
        <div className="relative mt-1 h-5 text-[12px] text-[var(--muted)]">
          <span className="absolute -translate-x-1/2 font-mono" style={{ left: `${(200 / SCALE) * 100}%` }}>
            200
          </span>
        </div>
        <ul className="mt-3 grid gap-2">
          {PARTS.map((x) => {
            const gone = moved && x.to;
            return (
              <li key={x.id} className="grid grid-cols-[12px_minmax(0,1fr)] items-start gap-3 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-[var(--rule)]">
                <span className="mt-1.5 size-3 rounded-[3px]" style={{ backgroundColor: x.tone }} />
                <span className="min-w-0">
                  <span className={`block text-[15px] leading-snug ${gone ? "text-[var(--muted)] line-through decoration-[var(--rule-strong)]" : "text-[var(--ink)]"}`}>{x.label}</span>
                  <AnimatePresence initial={false}>
                    {gone ? (
                      <motion.span className="mt-1 flex items-start gap-2 text-[14px] leading-snug text-[#1f7a50]" initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={SPRING}>
                        <span aria-hidden="true">→</span>
                        <span>{x.to}</span>
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Plate>
  );
}

/* ───────────── 3.3: context is a budget ───────────── */

type Item = { id: number; kind: "task" | "kept" | "conclusion"; label: string; size: number };
const CAP = 12;

function ContextBudget() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Item[]>([{ id: 1, kind: "task", label: "Task 1", size: 3 }]);
  const [next, setNext] = useState(2);
  const [tasks, setTasks] = useState(1);
  const [btw, setBtw] = useState(0);
  const [ghost, setGhost] = useState(0);
  const used = items.reduce((n, x) => n + x.size, 0);
  const unrelated = items.filter((x) => x.kind === "task").length;
  const add = (it: Omit<Item, "id">) => {
    setItems((xs) => [...xs, { ...it, id: next }]);
    setNext((n) => n + 1);
  };
  const actions: [string, string, () => void][] = [
    [
      "New unrelated task",
      "adds a task to this session",
      () => {
        add({ kind: "task", label: `Task ${tasks + 1}`, size: 3 });
        setTasks((n) => n + 1);
      },
    ],
    [
      "/clear",
      "a clean context for the next task",
      () => {
        setItems([]);
        setGhost(0);
      },
    ],
    [
      "/compact keep the API changes and the test commands",
      "a long task continues, with only what you named",
      () => {
        if (!items.length) return;
        setItems([{ id: next, kind: "kept", label: "kept: the API changes and the test commands", size: 1 }]);
        setNext((n) => n + 1);
      },
    ],
    [
      "Research in a subagent",
      "only its short conclusion comes back",
      () => {
        add({ kind: "conclusion", label: "subagent: conclusion and sources", size: 1 });
        setGhost((n) => n + 1);
      },
    ],
    ["/btw", "a side question that doesn't enter the history", () => setBtw((n) => n + 1)],
  ];
  return (
    <Plate caption="Sizes are an illustration. The behaviour is the docs': “a session that's collected three unrelated tasks re-reads all three on every turn of the fourth.” Anything that must survive every session belongs in CLAUDE.md, not only in the chat.">
      <div className="p-5 sm:p-8">
        <Panel title="one session's context">
          <div className="px-4 py-4">
            <div className="flex min-h-[64px] flex-wrap content-start gap-1.5" role="img" aria-label={`${used} of ${CAP} units used, ${unrelated} unrelated tasks re-read every turn`}>
              <AnimatePresence initial={false}>
                {items.map((x) => (
                  <motion.span
                    key={x.id}
                    layout={!reduce}
                    className={`flex h-12 items-center justify-center truncate rounded-lg px-2 font-mono text-[11.5px] ${x.kind === "task" ? "bg-white/15 text-white/85" : x.kind === "kept" ? "bg-[var(--pass)] text-white" : "bg-[#f0b49f] text-[var(--ink)]"}`}
                    style={{ width: `calc(${(x.size / CAP) * 100}% - 6px)`, minWidth: 56 }}
                    initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={SPRING}
                    title={x.label}
                  >
                    {x.label}
                  </motion.span>
                ))}
              </AnimatePresence>
              {!items.length ? <span className="self-center text-[13px] text-white/40">empty: a fresh start</span> : null}
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.span className="block h-full rounded-full" initial={false} animate={{ width: `${Math.min(100, (used / CAP) * 100)}%`, backgroundColor: used > CAP * 0.66 ? C.accent : C.passSoft }} transition={SPRING} />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[13px]">
              <span className="text-white/55">
                Re-read on every turn: <span className="font-mono text-white">{unrelated}</span> unrelated {unrelated === 1 ? "task" : "tasks"}
              </span>
              {ghost ? <span className="text-white/40">{ghost} research run{ghost > 1 ? "s" : ""} stayed in the subagent</span> : null}
            </div>
            <AnimatePresence>
              {btw ? (
                <motion.p key={btw} className="mt-3 rounded-lg bg-white/[.06] px-3 py-2 text-[13px] text-white/70" initial={{ opacity: 0, y: 6 }} animate={{ opacity: [0, 1, 1, 0], y: 0 }} transition={{ duration: 2.4, times: [0, 0.1, 0.75, 1] }}>
                  /btw: answered on the side. Nothing added to the history.
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>
        </Panel>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {actions.map(([cmd, what, run]) => (
            <button key={cmd} type="button" onClick={run} className="gd-press flex min-h-[60px] flex-col items-start justify-center rounded-xl bg-white px-4 py-2.5 text-left ring-1 ring-[var(--rule)] hover:ring-[var(--ink)]">
              <span className="font-mono text-[13.5px] leading-snug text-[var(--ink)] [overflow-wrap:anywhere]">{cmd}</span>
              <span className="text-[13px] text-[var(--muted)]">{what}</span>
            </button>
          ))}
        </div>
        {unrelated >= 3 ? (
          <p className="mt-4 flex items-start gap-2 text-[15px] leading-snug text-[var(--ink)]">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-[var(--accent)]" /> One task, one context: clear between tasks.
          </p>
        ) : items.length === 0 ? (
          <p className="mt-4 flex items-center gap-2 text-[15px] text-[var(--ink)]">
            <Check on size="size-4" /> Clearing loses what you didn&apos;t write down. Anything worth keeping goes into a note first.
          </p>
        ) : null}
      </div>
    </Plate>
  );
}

export const FIGURES: Figures = {
  CompoundHero,
  AdviceVsEnforcement,
  LineBudget,
  ContextBudget,
};

export function View() {
  return <ModulePage content={CONTENT} figures={FIGURES} />;
}

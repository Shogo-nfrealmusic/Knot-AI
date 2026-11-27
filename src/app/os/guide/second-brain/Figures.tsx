"use client";

// Module 2 · Your second brain. Figures: the vault filing and answering, the folder map, which CLAUDE.md files load,
// what an Obsidian key can reach in each setup, and the morning routine with its missed-run rule. Every rule shown is
// the module's; example data (which days the machine slept) is marked as an illustration in the caption.

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CONTENT } from "../content/second-brain";
import { ModulePage, type Figures } from "../ModulePage";
import { C, Check, Cross, EASE, FileGlyph, FolderGlyph, Panel, Plate, POP, Replay, Seg, SPRING, Tag, usePlay } from "../kit";

/* ───────────── the folder map (2.1), shared by the hero and FolderMap ───────────── */

const FOLDERS = [
  { name: "Inbox/", holds: "Quick captures you haven't sorted yet, one line each", never: "Long text" },
  { name: "Projects/", holds: "The current state of each project, overwritten in place", never: "History, logs, analysis" },
  { name: "Decisions/", holds: "Why something was decided: decision, reasons, rejected options. One file per decision", never: "What was done" },
  { name: "Analysis/", holds: "Why something is the way it is, with data. One file per analysis", never: "Fixes" },
  { name: "Logs/Business/", holds: "What happened when: one line per event, one file per month", never: "Long text" },
  { name: "Logs/Changes/", holds: "One file per change or fix: when, what was wrong, how it was fixed, what was checked, the result", never: "Decisions without action" },
  { name: "Knowledge/", holds: "Reusable knowledge that outlives any one project", never: "Project status" },
  { name: "Journal/", holds: "Your own writing. Claude writes here only when you ask", never: "Work logs, AI reports" },
] as const;

const LAB_Q = "Where would you file a note about why we chose our payment provider?";

/* ───────────── hero: a vault you own, read and filed by Claude ───────────── */

function VaultHero() {
  const { ref, p, replay } = usePlay<HTMLDivElement>(7600);
  const asked = p > 0.08;
  const reading = p > 0.3;
  const filed = p > 0.55;
  const answered = p > 0.72;
  const dec = 2;
  return (
    <figure ref={ref} className="gd-plate p-3 sm:p-4" aria-label="Claude Code started in the vault folder reads the folder map and answers where a note belongs: Decisions/.">
      <Panel title="~/vault · claude" right={<Replay onClick={replay} light />}>
        <div className="min-h-[92px] px-4 py-4 font-mono text-[13.5px] leading-[1.7]">
          <p className="text-white/90">
            <span className="text-white/40">&gt; </span>
            {LAB_Q.slice(0, Math.round(LAB_Q.length * Math.min(1, p / 0.08)))}
          </p>
          <motion.p className="mt-2 text-[#9fd8b8]" initial={false} animate={{ opacity: answered ? 1 : 0, y: answered ? 0 : 6 }} transition={SPRING}>
            <span className="text-white/45">● </span>Decisions/, one file for that decision.
          </motion.p>
        </div>
      </Panel>
      <div className="relative mt-3 rounded-xl bg-white p-3 ring-1 ring-[var(--rule)]">
        <div className="flex items-center justify-between gap-2 px-1">
          <span className="font-mono text-[13px] text-[var(--muted)]">~/vault/</span>
          <motion.span initial={false} animate={{ opacity: reading ? 1 : 0 }} transition={{ duration: 0.3 }}>
            <Tag tone="accent">reads CLAUDE.md first</Tag>
          </motion.span>
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-1.5">
          {FOLDERS.map((f, i) => {
            const target = i === dec;
            const lit = target && filed;
            const scan = reading && !filed && Math.floor(((p - 0.3) / 0.25) * FOLDERS.length) === i;
            return (
              <motion.li
                key={f.name}
                className="flex min-h-9 items-center gap-2 rounded-lg px-2 py-1"
                initial={false}
                animate={{
                  backgroundColor: lit ? "rgba(224,85,47,.09)" : scan ? "rgba(21,23,26,.06)" : "rgba(224,85,47,0)",
                  boxShadow: lit ? `0 0 0 1.5px ${C.accent}` : "0 0 0 0px rgba(0,0,0,0)",
                  opacity: asked && filed && !target ? 0.45 : 1,
                }}
                transition={SPRING}
              >
                <FolderGlyph on={lit} className="h-[18px] w-[23px]" />
                <span className="min-w-0 truncate font-mono text-[12.5px] text-[var(--ink)]">{f.name}</span>
              </motion.li>
            );
          })}
        </ul>
        <AnimatePresence>
          {filed ? (
            <motion.div
              className="absolute right-3 top-2 flex items-center gap-2 rounded-lg bg-white px-2 py-1 shadow-[0_10px_30px_-14px_rgba(21,23,26,.5)] ring-1 ring-[var(--accent)]"
              initial={{ opacity: 0, y: -16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={POP}
            >
              <FileGlyph accent className="h-5 w-[17px]" />
              <span className="font-mono text-[12px] text-[var(--ink)]">payment-provider.md</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <figcaption className="px-2 pb-1 pt-3 text-[14px] leading-relaxed text-[var(--muted)]">
        The vault is a plain folder you own. Claude reads its folder map before writing anything. The question is Lesson 2.1&apos;s lab; the file name is an illustration.
      </figcaption>
    </figure>
  );
}

/* ───────────── 2.1: the folder map ───────────── */

function FolderMap() {
  const [i, setI] = useState(0);
  const [filing, setFiling] = useState(0);
  const reduce = useReducedMotion();
  const f = FOLDERS[i];
  const file = () => {
    setI(2);
    setFiling((n) => n + 1);
  };
  return (
    <Plate caption="The table from your vault's CLAUDE.md, as a map. Tap a folder. If a note doesn't clearly fit, it goes as one line in Inbox/Inbox.md, and no new folders without asking.">
      <div className="p-5 sm:p-8">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FOLDERS.map((x, k) => {
            const on = k === i;
            return (
              <button
                key={x.name}
                type="button"
                onClick={() => setI(k)}
                aria-pressed={on}
                className="gd-press relative flex min-h-[76px] flex-col items-start justify-between gap-2 rounded-xl bg-white px-3 py-3 text-left ring-1 ring-[var(--rule)] aria-pressed:ring-2 aria-pressed:ring-[var(--ink)]"
              >
                <FolderGlyph on={on} className="h-[22px] w-[28px]" />
                <span className="max-w-full truncate font-mono text-[12.5px] text-[var(--ink)]">{x.name}</span>
                {k === 2 && filing > 0 ? (
                  <motion.span
                    key={filing}
                    className="absolute right-2 top-2"
                    initial={reduce ? false : { y: -40, opacity: 0, rotate: -8 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={POP}
                  >
                    <FileGlyph accent className="h-6 w-5" />
                  </motion.span>
                ) : null}
              </button>
            );
          })}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.dl key={f.name} className="mt-5 grid gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)] sm:grid-cols-2 sm:p-5" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
            <div>
              <dt className="flex items-center gap-2 text-[13px] text-[#1f7a50]">
                <Check on size="size-4" /> {f.name} holds
              </dt>
              <dd className="mt-1 text-[16px] leading-snug text-[var(--ink)]">{f.holds}</dd>
            </div>
            <div className="border-t border-[var(--rule)] pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
              <dt className="flex items-center gap-2 text-[13px] text-[var(--accent)]">
                <Cross size="size-4" /> Never holds
              </dt>
              <dd className="mt-1 text-[16px] leading-snug text-[var(--ink)]">{f.never}</dd>
            </div>
          </motion.dl>
        </AnimatePresence>
        <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-[var(--panel)] p-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[13.5px] leading-relaxed text-white/85">
            <span className="text-white/40">&gt; </span>
            {LAB_Q}
          </p>
          <button type="button" onClick={file} className="gd-press min-h-11 shrink-0 rounded-full bg-white px-4 text-[14px] font-medium text-[var(--ink)]">
            File it
          </button>
        </div>
      </div>
    </Plate>
  );
}

/* ───────────── 2.3: which CLAUDE.md files load ───────────── */

type Where = "inside" | "outside" | "exclude";

function LoadCascade() {
  const [where, setWhere] = useState<Where>("inside");
  const reduce = useReducedMotion();
  const project = where === "outside" ? "~/projects/my-project/" : "~/vault/my-project/";
  const rows = [
    { file: "~/.claude/CLAUDE.md", note: "your personal file: always loads", on: true },
    { file: "~/vault/CLAUDE.md", note: where === "inside" ? "a folder above: loads, with the whole vault's context" : where === "exclude" ? "skipped by claudeMdExcludes" : "not above this folder", on: where === "inside" },
    { file: `${project}CLAUDE.md`, note: "the folder you start from", on: true },
  ];
  return (
    <Plate caption="Claude Code loads the CLAUDE.md in the folder you start from, every CLAUDE.md in the folders above it, and your personal ~/.claude/CLAUDE.md. Pick where the project lives.">
      <div className="p-5 sm:p-8">
        <Seg
          id="cascade"
          label="Where the project folder lives"
          value={where}
          onChange={setWhere}
          options={[
            ["inside", "Inside the vault"],
            ["outside", "Outside the vault"],
            ["exclude", "Inside, excluded"],
          ]}
        />
        <Panel className="mt-6" title={`cd ${project} && claude`}>
          <ol className="relative grid gap-2 px-4 py-5">
            {rows.map((r, k) => (
              <motion.li
                key={k}
                className="relative grid grid-cols-[24px_minmax(0,1fr)] items-start gap-3"
                style={{ paddingLeft: k * 14 }}
                initial={false}
                animate={{ opacity: r.on ? 1 : 0.4 }}
                transition={SPRING}
              >
                <span className="mt-1">{r.on ? <Check on /> : <Cross on={false} />}</span>
                <span className="min-w-0">
                  <motion.span
                    key={`${r.file}-${where}`}
                    className={`block font-mono text-[13.5px] [overflow-wrap:anywhere] ${r.on ? "text-white" : "text-white/50 line-through decoration-white/40"}`}
                    initial={reduce ? false : { opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={SPRING}
                  >
                    {r.file}
                  </motion.span>
                  <span className={`block text-[13px] ${r.on ? "text-white/55" : "text-[#ffb59c]"}`}>{r.note}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </Panel>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={where} className="mt-5 text-[16px] leading-relaxed text-[var(--ink)]" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={SPRING}>
            {where === "inside" ? (
              <>
                <span className="font-semibold text-[var(--accent)]">Not focused.</span> A project folder inside your vault still pulls in the vault&apos;s whole CLAUDE.md.
              </>
            ) : where === "outside" ? (
              <>
                <span className="font-semibold text-[#1f7a50]">Focused.</span> Production projects live outside the vault; only planning notes stay in it.
              </>
            ) : (
              <>
                <span className="font-semibold text-[#1f7a50]">Focused.</span> The folder stays in the vault, and the <code className="gd-code">claudeMdExcludes</code> setting skips the vault-level file.
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </Plate>
  );
}

/* ───────────── 2.5: what a key can reach, setup by setup ───────────── */

type Setup = "none" | "rest" | "uvx";

const SETUPS: Record<Setup, { key: string; keyTone: "pass" | "ink" | "accent"; version: string; versionOk: boolean | null; grants: boolean; extra: string; rank: string }> = {
  none: {
    key: "No key at all. Claude Code started in the vault reads and writes the files directly.",
    keyTone: "pass",
    version: "Nothing to install or pin.",
    versionOk: true,
    grants: false,
    extra: "Under your normal permission rules and the sandbox.",
    rank: "Safest",
  },
  rest: {
    key: "${OBSIDIAN_API_KEY}, an environment variable referenced from a project .mcp.json, so the key isn't written into the file.",
    keyTone: "ink",
    version: "The MCP server comes with current versions of the Local REST API plugin; no mcp-obsidian.",
    versionOk: null,
    grants: true,
    extra: "Not tested against the plugin's self-signed certificate. If Claude Code refuses to connect, use no plugin at all.",
    rank: "If you need the plugin",
  },
  uvx: {
    key: "Saved in plain text in ~/.claude.json (the default \"local\" scope).",
    keyTone: "accent",
    version: "Not pinned: uvx installs the latest release the first time and reuses it. Pin it: uvx mcp-obsidian@0.2.3.",
    versionOk: false,
    grants: true,
    extra: "The mcp-obsidian server includes a delete_file tool.",
    rank: "The common way",
  },
};

const GRANTS = ["Read", "Write", "Delete", "Run any Obsidian command"];

function KeyReach() {
  const [s, setS] = useState<Setup>("uvx");
  const reduce = useReducedMotion();
  const x = SETUPS[s];
  return (
    <Plate caption="Three ways to give Claude your notes, from Lesson 2.5. A key to the Local REST API grants read, write, delete and running Obsidian commands; control it with scope, not with words.">
      <div className="p-5 sm:p-8">
        <Seg
          id="key-reach"
          label="Setup"
          value={s}
          onChange={setS}
          options={[
            ["none", "No plugin"],
            ["rest", "Plugin's own MCP"],
            ["uvx", "mcp-obsidian"],
          ]}
        />
        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl bg-[var(--panel)] p-4 text-white sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] text-white/55">What the key opens</p>
              <Tag tone="dark">{x.rank}</Tag>
            </div>
            <div className="relative mt-4 flex items-center justify-center">
              <svg viewBox="0 0 120 80" className="h-[74px] w-[110px]" aria-hidden="true">
                <motion.g initial={false} animate={{ opacity: x.grants ? 1 : 0.2 }} transition={SPRING}>
                  <circle cx="30" cy="40" r="20" fill="none" stroke={x.grants ? C.accent : "#ffffff"} strokeWidth="5" />
                  <path d="M50 40 h58 M92 40 v14 M104 40 v10" fill="none" stroke={x.grants ? C.accent : "#ffffff"} strokeWidth="5" strokeLinecap="round" />
                </motion.g>
                {!x.grants ? <path d="M18 70 L102 10" stroke={C.passSoft} strokeWidth="3" strokeLinecap="round" /> : null}
              </svg>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {GRANTS.map((g, k) => (
                <motion.li
                  key={g}
                  className="flex min-h-11 items-center rounded-lg px-3 py-2 text-[14px] leading-tight"
                  initial={false}
                  animate={{ backgroundColor: x.grants ? (k === 2 ? "rgba(224,85,47,.28)" : "rgba(224,85,47,.14)") : "rgba(255,255,255,.04)", color: x.grants ? "#ffffff" : "rgba(255,255,255,.35)" }}
                  transition={reduce ? { duration: 0 } : { ...SPRING, delay: k * 0.05 }}
                >
                  {g}
                </motion.li>
              ))}
            </ul>
            {!x.grants ? <p className="mt-3 text-[13px] text-[#9fd8b8]">No key, so nothing for a key to grant.</p> : null}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.dl key={s} className="grid content-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-[var(--rule)] sm:p-5" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>
              <Row label="Where the key lives" tone={x.keyTone} text={x.key} />
              <Row label="Version" tone={x.versionOk === false ? "accent" : x.versionOk ? "pass" : "ink"} text={x.version} />
              <Row label="Note" tone="ink" text={x.extra} />
            </motion.dl>
          </AnimatePresence>
        </div>
      </div>
    </Plate>
  );
}

function Row({ label, tone, text }: { label: string; tone: "pass" | "ink" | "accent"; text: string }) {
  const dot = tone === "pass" ? "bg-[var(--pass)]" : tone === "accent" ? "bg-[var(--accent)]" : "bg-[var(--rule-strong)]";
  return (
    <div className="border-t border-[var(--rule)] pt-3 first:border-t-0 first:pt-0">
      <dt className="flex items-center gap-2 text-[13px] text-[var(--muted)]">
        <span className={`size-2 rounded-full ${dot}`} />
        {label}
      </dt>
      <dd className="mt-1 text-[15px] leading-snug text-[var(--ink)] [overflow-wrap:anywhere]">{text}</dd>
    </div>
  );
}

/* ───────────── 2.6: the 7:00 routine, and the run you slept through ───────────── */

const STEPS = ["File each Inbox/ note by the table. If unsure, leave it.", "Link new notes to old ones only where it helps.", "List project notes not updated in 30 days.", "Write a 3-line summary at the top of Inbox/Inbox.md."];

function RoutineClock() {
  const [asleep, setAsleep] = useState(false);
  const { ref, p, replay } = usePlay<HTMLDivElement>(asleep ? 5200 : 4200);
  const days = 5;
  return (
    <Plate caption="Local scheduled tasks run only while the app is running and the computer is awake. Missed runs are skipped; when the app starts again it makes exactly one catch-up run, for the most recent missed time within the last 7 days. The three sleeping days are an illustration.">
      <div ref={ref} className="p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Seg
            id="routine"
            label="The machine at 7:00"
            value={asleep ? "asleep" : "awake"}
            onChange={(k) => {
              setAsleep(k === "asleep");
              replay();
            }}
            options={[
              ["awake", "Awake at 7:00"],
              ["asleep", "Asleep three days"],
            ]}
          />
          <Replay onClick={replay} />
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {!asleep ? (
            <motion.div key="awake" className="mt-6 grid items-center gap-5 sm:grid-cols-[140px_minmax(0,1fr)]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Dial p={p} />
              <ol className="grid gap-2">
                {STEPS.map((t, k) => {
                  const on = p > 0.25 + k * 0.17;
                  return (
                    <motion.li key={t} className="flex items-start gap-3 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-[var(--rule)]" initial={false} animate={{ opacity: on ? 1 : 0.4 }} transition={SPRING}>
                      <span className="mt-0.5">
                        <Check on={on} />
                      </span>
                      <span className="text-[15px] leading-snug text-[var(--ink)]">{t}</span>
                    </motion.li>
                  );
                })}
                <li className="pl-1 pt-1 font-mono text-[13px] text-[var(--accent)]">Never delete or rename a note.</li>
              </ol>
            </motion.div>
          ) : (
            <motion.div key="asleep" className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: days }).map((_, d) => {
                  const slept = d >= 1 && d <= 3;
                  const reached = p > (d + 0.5) / (days + 1);
                  const catchUp = d === 4;
                  const at = (d: number) => `Day ${d + 1}`;
                  return (
                    <motion.div key={d} className="flex min-h-[112px] flex-col items-center justify-between rounded-xl px-1 py-3 text-center" initial={false} animate={{ backgroundColor: slept ? C.panel : "#ffffff", opacity: reached ? 1 : 0.35 }} style={{ boxShadow: `0 0 0 1px ${slept ? C.panel : C.rule}` }} transition={SPRING}>
                      <span className={`font-mono text-[12px] ${slept ? "text-white/55" : "text-[var(--muted)]"}`}>{at(d)}</span>
                      {slept ? <Cross on={reached} /> : <Check on={reached} />}
                      <span className={`text-[12px] leading-tight ${slept ? "text-white/60" : "text-[var(--ink)]"}`}>{slept ? (d === 3 ? "missed: caught up" : "missed: skipped") : catchUp ? "app starts" : "ran at 7:00"}</span>
                    </motion.div>
                  );
                })}
              </div>
              <svg viewBox="0 0 500 60" className="mt-2 h-auto w-full" preserveAspectRatio="none" aria-hidden="true">
                <motion.path d="M450 4 C 440 52, 360 52, 350 6" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" initial={false} animate={{ pathLength: p > 0.88 ? 1 : 0, opacity: p > 0.88 ? 1 : 0 }} transition={{ duration: 0.7, ease: EASE }} />
              </svg>
              <motion.p className="text-[15.5px] leading-relaxed text-[var(--ink)]" initial={false} animate={{ opacity: p > 0.9 ? 1 : 0 }}>
                One catch-up run, for the most recent missed time. Not one per missed day.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Plate>
  );
}

function Dial({ p }: { p: number }) {
  const a = -Math.PI / 2 + Math.min(1, p / 0.22) * (7 / 12) * Math.PI * 2;
  return (
    <div className="mx-auto flex flex-col items-center">
      <svg viewBox="0 0 120 120" className="size-[120px]" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="#ffffff" stroke={C.ink} strokeWidth="1.4" />
        {Array.from({ length: 12 }).map((_, k) => {
          const t = (k / 12) * Math.PI * 2;
          return <line key={k} x1={60 + Math.cos(t) * 44} y1={60 + Math.sin(t) * 44} x2={60 + Math.cos(t) * 48} y2={60 + Math.sin(t) * 48} stroke={C.ruleStrong} strokeWidth="2" />;
        })}
        <line x1="60" y1="60" x2={60 + Math.cos(a) * 30} y2={60 + Math.sin(a) * 30} stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
        <line x1="60" y1="60" x2="60" y2="18" stroke={C.accent} strokeWidth="2" strokeLinecap="round" />
        <circle cx="60" cy="60" r="4" fill={C.ink} />
      </svg>
      <span className="mt-1 font-mono text-[14px] text-[var(--ink)]">7:00</span>
    </div>
  );
}

export const FIGURES: Figures = {
  VaultHero,
  FolderMap,
  LoadCascade,
  KeyReach,
  RoutineClock,
};

export function View() {
  return <ModulePage content={CONTENT} figures={FIGURES} />;
}

"use client";

// The page every lesson module (2 to 8) is built on, in Start here's layout: a header with the module's own figure,
// a rail of lessons on wide screens (a bar on phones), each lesson as a section, labs you can tick, and the next module.
// The words come from the module file (content/*.ts); the figures are the module's own (Figures.tsx).

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { CodeBlock } from "@/app/free/CodeCopy";
import { MODULES, neighbours } from "./data";
import { Inline } from "./Inline";
import type { Block, Item, Lesson, ModuleContent, Section } from "./content/types";
import { useTicks } from "./store";

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const;

export type Figures = Record<string, () => React.ReactNode>;

const labId = (l: Lesson) => `${l.id}-lab`;
const hasLab = (l: Lesson) => l.sections.some((s) => s.h === "Lab");
const ordinal = (code: string) => (/^\d\.\d+$/.test(code) ? code.split(".")[1] : null);

export function ModulePage({ content, figures }: { content: ModuleContent; figures: Figures }) {
  const labs = content.lessons.filter(hasLab).map(labId);
  const [done, toggle] = useTicks(`os-guide.${content.slug}`, labs);
  const active = useActiveLesson(content.lessons);
  const article = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: article, offset: ["start 120px", "end end"] });
  const read = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const Hero = figures[content.hero];

  return (
    <div className="gd relative overflow-x-clip pb-10 pt-14">
      <MobileBar lessons={content.lessons} active={active} read={read} count={done.length} total={labs.length} />
      <Header content={content} figure={Hero ? <Hero /> : null} labs={labs.length} />

      <div ref={article} className="mx-auto grid max-w-[1180px] gap-12 px-5 sm:px-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-16">
        <Rail title={`Module ${content.code}`} lessons={content.lessons} active={active} read={read} done={done} total={labs.length} />
        <div className="min-w-0 max-w-[760px]">
          {content.lessons.map((l) => (
            <LessonView key={l.id} lesson={l} figures={figures} ticked={done.includes(labId(l))} onTick={() => toggle(labId(l))} />
          ))}
          <PrevNext code={content.code} />
          <p className="mt-16 max-w-[62ch] text-[14px] leading-relaxed text-[var(--muted)]">
            Commands and settings were checked against the official Claude Code documentation in November 2026. Claude Code changes often; if a
            command in the guide fails, the official page at{" "}
            <a className="gd-link" href="https://code.claude.com/docs" target="_blank" rel="noreferrer">
              code.claude.com/docs
            </a>{" "}
            wins.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────────── header ───────────── */

function Header({ content, figure, labs }: { content: ModuleContent; figure: React.ReactNode; labs: number }) {
  const reduce = useReducedMotion();
  const m = MODULES.find((x) => x.code === content.code);
  const enter = (d: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { ...SPRING, delay: d } });
  const numbered = content.lessons.filter((l) => ordinal(l.code)).length;
  return (
    <header className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-x-14 px-5 pb-14 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)]">
      <motion.nav {...enter(0)} aria-label="Breadcrumb" className="text-[15px] text-[var(--muted)] lg:col-start-1 lg:row-start-1">
        <Link href="/os/guide" className="inline-flex min-h-11 items-center hover:text-[var(--ink)]">
          Copilot OS guide
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)]">Module {content.code}</span>
      </motion.nav>
      <motion.h1 {...enter(0.06)} className="gd-h1 mt-4 max-w-[16ch] lg:col-start-1 lg:row-start-2">
        <span className="gd-serif !text-[var(--accent)]">{content.code}</span> {content.title}.{" "}
        {/* the one-line summary only when it is short; longer ones are said again by the intro just below */}
        {m && m.line.length <= 56 ? <span className="gd-serif">{m.line}</span> : null}
      </motion.h1>
      <motion.div {...enter(0.18)} className="mt-10 min-w-0 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-10">
        {figure}
      </motion.div>
      <motion.div {...enter(0.14)} className="gd-prose mt-8 lg:col-start-1 lg:row-start-3">
        {content.lede.filter((t) => !(m?.time && /^Time:/.test(t))).map((t, i) => (
          <p key={i}>
            <Inline text={t} />
          </p>
        ))}
      </motion.div>
      <motion.dl {...enter(0.22)} className="mt-8 flex flex-wrap gap-x-8 gap-y-3 lg:col-start-1 lg:row-start-4">
        <Stat k="Lessons" v={String(numbered)} />
        <Stat k="Labs" v={String(labs)} />
        {m?.time ? <Stat k="Time" v={m.time} /> : null}
      </motion.dl>
    </header>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[14px] text-[var(--muted)]">{k}</dt>
      <dd className="mt-0.5 text-[18px] font-medium tracking-[-0.01em] text-[var(--ink)]">{v}</dd>
    </div>
  );
}

/* ───────────── progress: a rail on wide screens, a bar on phones ───────────── */

function useActiveLesson(lessons: Lesson[]) {
  const [active, setActive] = useState(lessons[0]?.id ?? "");
  useEffect(() => {
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const first = lessons.find((l) => seen.get(l.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    lessons.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [lessons]);
  return active;
}

type Read = ReturnType<typeof useSpring>;

function Rail({ title, lessons, active, read, done, total }: { title: string; lessons: Lesson[]; active: string; read: Read; done: string[]; total: number }) {
  return (
    <nav aria-label="Lessons in this module" className="hidden lg:block">
      <div className="sticky top-24">
        <p className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--ink)]">{title}</p>
        <ol className="relative mt-4">
          <span className="absolute bottom-3 left-[5px] top-3 w-px bg-[var(--rule)]" aria-hidden="true" />
          <motion.span style={{ scaleY: read }} className="absolute bottom-3 left-[5px] top-3 w-px origin-top bg-[var(--accent)]" aria-hidden="true" />
          {lessons.map((l) => {
            const on = l.id === active;
            const ok = done.includes(labId(l));
            return (
              <li key={l.id}>
                <a href={`#${l.id}`} className="relative flex min-h-11 items-center gap-3 py-1 pl-6 text-[15px] leading-snug" aria-current={on ? "location" : undefined}>
                  <motion.span
                    className="absolute left-0 top-1/2 -mt-[5.5px] size-[11px] rounded-full ring-2 ring-[var(--page)]"
                    initial={false}
                    animate={{ backgroundColor: ok ? "#2e9e6a" : on ? "#e0552f" : "#c4c7c2", scale: on ? 1.25 : 1 }}
                    transition={SPRING}
                  />
                  <span className="w-[26px] shrink-0 font-mono text-[12.5px] text-[var(--muted)]">{ordinal(l.code) ? l.code : ""}</span>
                  <span className={on ? "font-medium text-[var(--ink)]" : "text-[var(--soft)]"}>{l.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
        {total > 0 ? (
          <p className="mt-6 text-[14px] text-[var(--muted)]">
            <span className="font-mono text-[var(--ink)]">{done.length}</span> of {total} labs passed
          </p>
        ) : null}
      </div>
    </nav>
  );
}

function MobileBar({ lessons, active, read, count, total }: { lessons: Lesson[]; active: string; read: Read; count: number; total: number }) {
  const l = lessons.find((x) => x.id === active) ?? lessons[0];
  if (!l) return null;
  return (
    <div className="sticky top-14 z-30 border-b border-[var(--rule)] bg-[rgba(243,244,241,.88)] backdrop-blur-md lg:hidden">
      <div className="flex h-11 items-center justify-between gap-3 px-5 text-[14px]">
        <a href={`#${l.id}`} className="flex h-11 min-w-0 items-center gap-1.5">
          {ordinal(l.code) ? <span className="shrink-0 font-mono text-[var(--accent)]">{l.code}</span> : null}
          <span className="truncate text-[var(--ink)]">{l.title}</span>
        </a>
        {total > 0 ? (
          <span className="shrink-0 text-[var(--muted)]">
            <span className="font-mono text-[var(--ink)]">{count}</span>/{total} labs
          </span>
        ) : null}
      </div>
      <motion.span style={{ scaleX: read }} className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-[var(--accent)]" aria-hidden="true" />
    </div>
  );
}

/* ───────────── a lesson ───────────── */

function LessonView({ lesson, figures, ticked, onTick }: { lesson: Lesson; figures: Figures; ticked: boolean; onTick: () => void }) {
  const n = ordinal(lesson.code);
  return (
    <section id={lesson.id} className="scroll-mt-32 border-t border-[var(--rule)] pb-8 pt-16 first:border-t-0 first:pt-4 lg:scroll-mt-24">
      <h2 className="gd-h2 max-w-[22ch]">
        {n ? <span className="tabular-nums text-[var(--accent)]">{n}. </span> : null}
        {lesson.title}
      </h2>
      {n ? <p className="mt-3 font-mono text-[13px] text-[var(--muted)]">Lesson {lesson.code}</p> : null}
      <div className="mt-8">
        {lesson.sections.map((s, i) => (
          <SectionView key={i} section={s} figures={figures} ticked={ticked} onTick={onTick} first={i === 0} />
        ))}
      </div>
    </section>
  );
}

function SectionView({ section, figures, ticked, onTick, first }: { section: Section; figures: Figures; ticked: boolean; onTick: () => void; first: boolean }) {
  const { h, blocks } = section;
  if (h === "Lab") return <LabCard text={(blocks[0] as { p: string }).p} ticked={ticked} onTick={onTick} />;
  if (h === "Principle") {
    const [lead, ...rest] = blocks;
    const text = "p" in lead ? lead.p.replace(/^\*\*(.+?)\*\*/, "$1") : "";
    return (
      <div className="mt-10">
        <blockquote className="max-w-[62ch] border-l-2 border-[var(--accent)] pl-5">
          <p className="text-[23px] leading-snug tracking-[-0.015em] text-[var(--ink)] sm:text-[26px]">
            <Inline text={text} />
          </p>
        </blockquote>
        <Blocks blocks={rest} figures={figures} />
      </div>
    );
  }
  if (h === "In production") {
    return (
      <div className="mt-10 rounded-[20px] bg-white px-5 py-6 shadow-[0_0_0_1px_var(--rule),0_30px_70px_-50px_rgba(21,23,26,.5)] sm:px-7">
        <h3 className="gd-h3 flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
          In production
        </h3>
        <div className="mt-3">
          <Blocks blocks={blocks} figures={figures} tight />
        </div>
      </div>
    );
  }
  if (h === "Problem" && first) {
    return (
      <div className="max-w-[62ch]">
        {blocks.map((b, i) =>
          "p" in b ? (
            <p key={i} className="text-[20px] leading-[1.6] tracking-[-0.01em] text-[var(--ink)] sm:text-[21px]">
              <Inline text={b.p} />
            </p>
          ) : (
            <Blocks key={i} blocks={[b]} figures={figures} />
          ),
        )}
      </div>
    );
  }
  const muted = h === "Limits";
  return (
    <div className={first ? "" : "mt-10"}>
      {h ? <h3 className={`gd-h3 mb-3 ${muted ? "text-[var(--soft)]" : ""}`}>{h}</h3> : null}
      <Blocks blocks={blocks} figures={figures} muted={muted} />
    </div>
  );
}

function Blocks({ blocks, figures, muted = false, tight = false }: { blocks: Block[]; figures: Figures; muted?: boolean; tight?: boolean }) {
  return (
    <>
      {blocks.map((b, i) => {
        if ("figure" in b) {
          const F = figures[b.figure];
          return F ? <F key={i} /> : null;
        }
        if ("p" in b)
          return (
            <p key={i} className={`gd-prose ${tight ? "text-[17px]" : ""} ${muted ? "!text-[var(--soft)]" : ""} [&+p]:mt-4 [&:not(:first-child)]:mt-4`}>
              <Inline text={b.p} />
            </p>
          );
        if ("list" in b) return <List key={i} items={b.list} ordered={b.ordered} start={b.start} muted={muted} tight={tight} />;
        if ("code" in b) return <Code key={i} code={b.code} label={b.label} />;
        if ("table" in b) return <Table key={i} head={b.table.head} rows={b.table.rows} />;
        if ("quote" in b)
          return (
            <blockquote key={i} className="my-6 max-w-[62ch] rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-[var(--rule)]">
              <p className="gd-serif text-[21px] leading-snug !text-[var(--ink)]">
                <Inline text={b.quote} />
              </p>
            </blockquote>
          );
        return null;
      })}
    </>
  );
}

function List({ items, ordered, start, muted, tight }: { items: Item[]; ordered?: boolean; start?: number; muted: boolean; tight: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  const size = tight ? "text-[17px]" : "text-[18px]";
  return (
    <Tag start={start} className={`mt-4 grid max-w-[62ch] gap-3 ${size} leading-[1.7] ${muted ? "text-[var(--soft)]" : "text-[var(--body)]"}`}>
      {items.map((it, i) => {
        const [text, sub] = typeof it === "string" ? [it, []] : it;
        return (
          <li key={i} className="relative grid grid-cols-[28px_minmax(0,1fr)]">
            <span className={`pt-[1px] font-mono text-[14px] ${ordered ? "text-[var(--accent)]" : "text-[var(--rule-strong)]"}`} aria-hidden="true">
              {ordered ? `${(start ?? 1) + i}` : "—"}
            </span>
            <div className="min-w-0 [&_strong]:font-semibold [&_strong]:text-[var(--ink)]">
              <Inline text={text} />
              {sub.length ? (
                <ul className="mt-2 grid gap-2 border-l border-[var(--rule)] pl-4">
                  {sub.map((s, k) => (
                    <li key={k}>
                      <Inline text={s} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </Tag>
  );
}

const PROSE_LABELS = /^(Prompt|Markdown|Text|CLAUDE\.md|vault\/CLAUDE\.md|One project folder|Failure log entry|Experiment ledger|Month-end close)/;

function Code({ code, label }: { code: string; label: string }) {
  const lines = code.split("\n").length;
  const long = lines > 22;
  const [open, setOpen] = useState(!long);
  const wrap = PROSE_LABELS.test(label);
  return (
    <div className="relative my-6 min-w-0">
      <div className={long && !open ? "relative max-h-[360px] overflow-hidden" : ""}>
        <CodeBlock size="lg" wrap={wrap} label={label} code={code} />
        {long && !open ? <div className="pointer-events-none absolute inset-x-px bottom-px h-28 rounded-b-xl bg-gradient-to-t from-white to-transparent" aria-hidden="true" /> : null}
      </div>
      {long ? (
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="gd-press mt-3 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[14px] text-[var(--soft)] ring-1 ring-[var(--rule)] hover:text-[var(--ink)]">
          {open ? "Show less" : `Show all ${lines} lines`}
        </button>
      ) : null}
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="my-6 min-w-0">
      {/* wide screens: a real table */}
      <div className="hidden overflow-hidden rounded-2xl bg-white ring-1 ring-[var(--rule)] sm:block">
        <table className="w-full border-collapse text-left text-[15.5px] leading-relaxed">
          <thead>
            <tr className="border-b border-[var(--rule)] bg-[rgba(21,23,26,.025)]">
              {head.map((h, i) => (
                <th key={i} scope="col" className="px-4 py-3 align-bottom text-[14px] font-medium text-[var(--muted)]">
                  <Inline text={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[var(--rule)] last:border-b-0">
                {r.map((c, k) => (
                  <td key={k} className={`px-4 py-3 align-top [overflow-wrap:anywhere] ${k === 0 ? "font-medium text-[var(--ink)]" : "text-[var(--body)]"}`}>
                    <Inline text={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* phones: one card per row, each cell under its header */}
      <div className="grid gap-3 sm:hidden">
        {rows.map((r, i) => (
          <dl key={i} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-[var(--rule)]">
            {r.map((c, k) => (
              <div key={k} className={k === 0 ? "pb-2 text-[17px] font-semibold text-[var(--ink)]" : "grid gap-0.5 border-t border-[var(--rule)] py-2"}>
                {k === 0 ? (
                  <dd className="[overflow-wrap:anywhere]">
                    <Inline text={c || "—"} />
                  </dd>
                ) : (
                  <>
                    <dt className="text-[13px] text-[var(--muted)]">
                      <Inline text={head[k] || " "} />
                    </dt>
                    <dd className="text-[16px] text-[var(--body)] [overflow-wrap:anywhere]">
                      <Inline text={c} />
                    </dd>
                  </>
                )}
              </div>
            ))}
          </dl>
        ))}
      </div>
    </div>
  );
}

/* ───────────── lab ───────────── */

function LabCard({ text, ticked, onTick }: { text: string; ticked: boolean; onTick: () => void }) {
  const [task, pass] = text.split(/\s*Pass condition:\s*/);
  return (
    <div className="mt-12 rounded-[22px] bg-[var(--panel)] px-5 py-7 text-white sm:px-8">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[22px] font-semibold tracking-[-0.02em]">
          Lab <span className="gd-serif !text-white/55">do it, then tick it.</span>
        </h3>
      </div>
      <p className="mt-3 max-w-[62ch] text-[17.5px] leading-[1.7] text-white/80 [&_.gd-code]:bg-white/10 [&_.gd-code]:text-white [&_.gd-code]:shadow-none [&_.gd-link]:text-white">
        <Inline text={task} />
      </p>
      {pass ? (
        <p className="mt-4 max-w-[62ch] border-l-2 border-[var(--accent)] pl-4 text-[17px] leading-[1.65] text-white [&_.gd-code]:bg-white/10 [&_.gd-code]:text-white [&_.gd-code]:shadow-none">
          <span className="text-[#ffb59c]">Pass condition: </span>
          <Inline text={pass} />
        </p>
      ) : null}
      <button
        type="button"
        onClick={onTick}
        aria-pressed={ticked}
        className="gd-press mt-6 flex min-h-14 w-full items-center gap-4 rounded-2xl bg-white px-4 py-3 text-left text-[var(--ink)] ring-1 ring-[var(--rule)] aria-pressed:ring-2 aria-pressed:ring-[var(--pass)] sm:w-auto sm:min-w-[320px]"
      >
        <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg ring-1 transition-colors duration-200 ${ticked ? "bg-[var(--pass)] ring-[var(--pass)]" : "bg-white ring-[var(--rule-strong)]"}`}>
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
            <motion.path d="M4.5 10.5 l3.5 3.5 l7.5 -8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: ticked ? 1 : 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} />
          </svg>
        </span>
        <span className="text-[17px] font-medium">{ticked ? "Passed" : "I passed this lab"}</span>
      </button>
    </div>
  );
}

/* ───────────── next module ───────────── */

export function PrevNext({ code }: { code: string }) {
  const { prev, next } = neighbours(code);
  return (
    <nav aria-label="Module navigation" className="mt-16 grid gap-3 sm:grid-cols-2">
      <Link href={prev ? prev.href : "/os/guide"} className="gd-press flex min-h-[96px] flex-col justify-center rounded-2xl bg-white px-5 py-4 ring-1 ring-[var(--rule)] hover:ring-[var(--ink)]">
        <span className="text-[14px] text-[var(--muted)]">← {prev ? `Module ${prev.code}` : "Back"}</span>
        <span className="mt-1 text-[18px] font-medium">{prev ? prev.title : "Guide contents"}</span>
      </Link>
      {next ? (
        <Link href={next.href} className="gd-press flex min-h-[96px] flex-col justify-center rounded-2xl bg-[var(--ink)] px-5 py-4 text-right text-white ring-1 ring-[var(--ink)] hover:bg-black">
          <span className="text-[14px] text-white/60">Next · Module {next.code} →</span>
          <span className="mt-1 text-[18px] font-medium">{next.title}</span>
        </Link>
      ) : (
        <Link href="/os/guide" className="gd-press flex min-h-[96px] flex-col justify-center rounded-2xl bg-[var(--ink)] px-5 py-4 text-right text-white hover:bg-black">
          <span className="text-[14px] text-white/60">The end of the guide</span>
          <span className="mt-1 text-[18px] font-medium">Back to the contents</span>
        </Link>
      )}
    </nav>
  );
}

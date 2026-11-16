"use client";

// /free/68 (GEO 101): one live figure per chapter, drawn for this site rather than cut from the reel.
// Same language as /free/46–67: paper plate on a grid, ink lines, one accent (orange), calm motion.
// From the reel: the query, topic / qualifier / location, the fingerprint idea, the two ways, the three kinds of content.
// Made up for the figures, and said so on each: the search results, the questions, the snippets, the bar patterns. See data.ts.
// Every label inside a figure is HTML at 12px or more, never text inside a scaled SVG, so it stays readable on a phone.

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MotionConfig, motion, useInView } from "motion/react";
import {
  ANGLES,
  PARTS,
  QUERY,
  QUESTIONS,
  SNIPPETS,
  SOURCES,
  STEPS,
  STORAGE_KEY,
  bestMatch,
  fingerprint,
  geoOrder,
  hitCount,
  parseDone,
  seoOrder,
  serializeDone,
  sharedWords,
  splitCovers,
  splitHits,
  toggleDone,
  words,
  type AngleId,
  type GeoDemoKind,
  type PartId,
  type SourceId,
} from "./data";

export type { GeoDemoKind } from "./data";

export function GeoDemo({ kind }: { kind: GeoDemoKind }) {
  return (
    <div className="ge mt-5 max-w-2xl">
      <style>{GE_CSS}</style>
      {kind === "compare" && <Compare />}
      {kind === "match" && <Match />}
      {kind === "sources" && <Sources />}
      {kind === "content" && <Content />}
      {kind === "checklist" && <Checklist />}
    </div>
  );
}

/* ───────────── shared parts ───────────── */
function Plate({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-4">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/05</span>
        <span className="text-[16px] font-semibold text-[var(--ink)]">{title}</span>
      </span>
      <span className="block font-mono text-[12px] text-[var(--muted)]">{sub}</span>
    </div>
  );
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]";
const BTN = `ge-press inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--rule-strong)] bg-white px-4 text-[13px] font-medium text-[var(--ink)] disabled:opacity-40 ${FOCUS}`;
const LABEL = "block font-mono text-[12px] tracking-[0.04em] text-[var(--accent)]";
const OPTION = (on: boolean) =>
  `ge-press rounded-[12px] border ${FOCUS} ${on ? "border-[var(--ink)] bg-[var(--ink)] text-white" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]"}`;
const SPRING = { type: "spring", stiffness: 260, damping: 30 } as const;

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

/** True once the figure has come on screen. */
function useSeen() {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { amount: 0.35, once: true });
  return { ref, seen };
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
          className={`ge-press min-h-9 rounded-full px-4 text-[13px] font-medium ${FOCUS} ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

const two = (n: number) => String(n).padStart(2, "0");

/* ───────────── figure 1 · the same query, read two ways: exact words, or the three details ───────────── */
type Mode = "seo" | "geo";
const QUERY_WORDS = words(QUERY).length;
// the query cut into its three details, in the order they are written: best · Italian restaurants · near me
const QUERY_PARTS = [...PARTS].sort((a, b) => QUERY.indexOf(a.text) - QUERY.indexOf(b.text));

function Compare() {
  const { ref, seen } = useSeen();
  const reduce = useReducedMotionSafe();
  const [auto, setAuto] = useState<Mode>("seo");
  const [picked, setPicked] = useState<Mode | null>(null);
  // until someone presses, show SEO first and then switch to GEO once
  useEffect(() => {
    if (!seen || reduce || picked !== null || auto === "geo") return;
    const id = setTimeout(() => setAuto("geo"), 2800);
    return () => clearTimeout(id);
  }, [seen, reduce, picked, auto]);
  const mode = picked ?? auto;
  const geo = mode === "geo";
  const order = geo ? geoOrder() : seoOrder();
  return (
    <figure ref={ref} className="ge-plate p-4 sm:p-6">
      <Plate n={1} title="One query, read two ways" sub="switch between SEO and GEO" />
      <Choice
        label="How the query is read"
        options={[
          { id: "seo", label: "SEO" },
          { id: "geo", label: "GEO" },
        ]}
        value={mode}
        set={setPicked}
      />

      <div className="ge-card mt-3">
        <span className="block font-mono text-[12px] text-[var(--muted)]">the query</span>
        <div key={mode} className="mt-1 text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[var(--ink)]">
          {geo ? (
            <span className="flex flex-wrap gap-x-3 gap-y-2">
              {QUERY_PARTS.map((p, i) => (
                <span key={p.id} className="ge-in inline-flex flex-col" style={{ animationDelay: `${i * 140}ms` }}>
                  <span className="ge-cover">{p.text}</span>
                  <span className="font-mono text-[12px] font-normal tracking-normal text-[var(--accent)]">{p.label}</span>
                </span>
              ))}
            </span>
          ) : (
            splitHits(QUERY, QUERY).map((s, i) =>
              s.hit ? (
                <mark key={i} className="ge-mark" style={{ animationDelay: `${i * 50}ms` }}>
                  {s.text}
                </mark>
              ) : (
                s.text
              ),
            )
          )}
        </div>
        <span className="mt-1.5 block text-[13px] leading-snug text-[var(--soft)]" aria-live="polite">
          {geo ? "GEO picks out three details to predict what the person is actually looking for." : `SEO looks for pages with these ${QUERY_WORDS} exact keywords.`}
        </span>
      </div>

      <MotionConfig reducedMotion="user">
        <ol className="mt-2 space-y-1.5" aria-label={geo ? "Five example results, ordered by meaning" : "Five example results, ordered by exact keywords"}>
          {order.map((r, n) => {
            const top = n === 0;
            const hits = hitCount(QUERY, r.text);
            return (
              <motion.li
                key={r.id}
                layout
                transition={SPRING}
                className="ge-card"
                style={{ borderColor: top ? "var(--accent)" : undefined, boxShadow: top ? "0 0 0 1px var(--accent)" : undefined, opacity: geo && !top ? 0.72 : 1 }}
              >
                <span className="flex items-start gap-2.5">
                  <span className="font-mono text-[12px] leading-[22px]" style={{ color: top ? "var(--accent)" : "var(--muted)" }}>
                    {two(n + 1)}
                  </span>
                  <span key={mode} className="min-w-0 text-[14px] leading-[22px] text-[var(--ink)]">
                    {geo
                      ? splitCovers(r).map((s, i) =>
                          s.part ? (
                            <span key={i} className="ge-cover">
                              {s.text}
                            </span>
                          ) : (
                            s.text
                          ),
                        )
                      : splitHits(QUERY, r.text).map((s, i) =>
                          s.hit ? (
                            <mark key={i} className="ge-mark" style={{ animationDelay: `${n * 90 + i * 25}ms` }}>
                              {s.text}
                            </mark>
                          ) : (
                            s.text
                          ),
                        )}
                  </span>
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 pl-[26px]">
                  {geo ? (
                    <>
                      {PARTS.map((p) => (
                        <Pill key={p.id} part={p.id} on={Boolean(r.covers[p.id])} />
                      ))}
                      <span className="text-[13px] leading-snug text-[var(--soft)]">{r.note}</span>
                    </>
                  ) : (
                    <span className="font-mono text-[12px] text-[var(--muted)]">
                      {hits} exact {hits === 1 ? "keyword" : "keywords"}
                    </span>
                  )}
                  {top ? <span className="ml-auto font-mono text-[12px] text-[var(--accent)]">{geo ? "the answer" : "most keywords"}</span> : null}
                </span>
              </motion.li>
            );
          })}
        </ol>
      </MotionConfig>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The five results are made up for this figure. Counting exact words puts the page that only repeats the query on top. Reading for meaning puts the trattoria on top, and it uses none of the five words.
      </figcaption>
    </figure>
  );
}

function Pill({ part, on }: { part: PartId; on: boolean }) {
  return (
    <span
      className="inline-flex min-h-6 items-center rounded-full px-2 font-mono text-[12px]"
      style={{ background: on ? "var(--ink)" : "transparent", color: on ? "#fff" : "var(--muted)", boxShadow: on ? "none" : "inset 0 0 0 1px var(--rule-strong)", textDecoration: on ? "none" : "line-through" }}
    >
      {part}
    </span>
  );
}

/* ───────────── figure 2 · a question becomes a pattern; the content with the matching pattern is the answer ───────────── */
const Q_PRINT = new Map(QUESTIONS.map((q) => [q.id, fingerprint(q.topic, q.id)]));
const S_PRINT = new Map(SNIPPETS.map((s) => [s.id, fingerprint(s.topic, s.id)]));
const FLAT = Array.from({ length: 14 }, () => 0.1);

function Bars({ values, color, height }: { values: number[]; color: string; height: number }) {
  return (
    <span className="flex items-end gap-[3px]" style={{ height }} aria-hidden>
      {values.map((v, i) => (
        <span key={i} className="ge-bar min-w-0 flex-1 rounded-[2px]" style={{ height: `${Math.round(v * 100)}%`, background: color }} />
      ))}
    </span>
  );
}

function Match() {
  const { ref, seen } = useSeen();
  const reduce = useReducedMotionSafe();
  const [qid, setQid] = useState(QUESTIONS[0].id);
  const [scanned, setScanned] = useState(0); // how many snippets the scan has reached
  const q = QUESTIONS.find((item) => item.id === qid) ?? QUESTIONS[0];
  const match = bestMatch(q);
  const total = SNIPPETS.length;
  useEffect(() => {
    if (!seen || reduce || scanned >= total) return;
    const id = setTimeout(() => setScanned((n) => n + 1), scanned === 0 ? 900 : 480);
    return () => clearTimeout(id);
  }, [seen, reduce, scanned, total]);
  const reached = reduce ? total : scanned;
  const drawn = reduce || seen;
  const done = reached >= total;
  const pick = (id: string) => {
    setQid(id);
    setScanned(0);
  };
  return (
    <figure ref={ref} className="ge-plate p-4 sm:p-6">
      <Plate n={2} title="Matched by meaning" sub="pick a question · watch the scan" />
      <div role="radiogroup" aria-label="Question" className="grid gap-1.5 sm:grid-cols-2">
        {QUESTIONS.map((item) => {
          const on = item.id === qid;
          return (
            <button key={item.id} type="button" role="radio" aria-checked={on} onClick={() => pick(item.id)} className={`${OPTION(on)} flex min-h-11 items-center px-3 py-2 text-left text-[14px] font-medium leading-snug`}>
              {item.text}
            </button>
          );
        })}
      </div>

      <div className="ge-card mt-2">
        <span className={LABEL}>THE QUESTION&apos;S FINGERPRINT</span>
        <div className="mt-2">
          <Bars values={drawn ? (Q_PRINT.get(q.id) ?? FLAT) : FLAT} color="var(--ink)" height={52} />
        </div>
        <span className="mt-2 block text-[13px] leading-snug text-[var(--soft)]">The meaning of the question, turned into a pattern. The words themselves are not what gets compared.</span>
      </div>

      <ol className="mt-2 space-y-1.5" aria-label="Six example pieces of content">
        {SNIPPETS.map((s, n) => {
          const checked = n < reached;
          const current = !done && n === reached;
          const isMatch = checked && s.id === match.id;
          const shared = sharedWords(q.text, s.text);
          return (
            <li
              key={s.id}
              className="ge-card grid grid-cols-[minmax(0,1fr)_84px] items-center gap-3"
              style={{
                borderColor: isMatch ? "var(--accent)" : current ? "var(--ink)" : undefined,
                boxShadow: isMatch ? "0 0 0 1px var(--accent)" : undefined,
                borderStyle: checked && !isMatch ? "dashed" : "solid",
                opacity: checked && !isMatch ? 0.62 : 1,
                transition: "border-color .3s, opacity .3s, box-shadow .3s",
              }}
            >
              <span className="min-w-0">
                <span className="block text-[14px] leading-snug text-[var(--ink)]">{s.text}</span>
                <span className="mt-1 block font-mono text-[12px] leading-snug text-[var(--muted)]">
                  {shared.length ? `shares the word “${shared.join(", ")}”` : "no keyword in common"}
                </span>
              </span>
              <span className="min-w-0">
                <Bars values={S_PRINT.get(s.id) ?? FLAT} color={isMatch ? "var(--accent)" : checked ? "var(--rule-strong)" : "var(--soft)"} height={30} />
                <span className="mt-1 block text-right font-mono text-[12px]" style={{ color: isMatch ? "var(--accent)" : "var(--muted)" }}>
                  {isMatch ? "match" : checked ? "no match" : current ? "comparing" : "waiting"}
                </span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 flex-1 basis-[180px] text-[14px] font-medium leading-snug text-[var(--ink)]" aria-live="polite">
          {done ? "Found by meaning: the match has no keyword in common with the question." : "Comparing each pattern with the question’s."}
        </span>
        <button type="button" className={BTN} onClick={() => setScanned(0)}>
          Scan again
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        The questions and the six pieces of content are made up for this figure, and the bar patterns are drawings, not real embeddings. The idea is the real part: content is matched on what it means, so a page can be the answer without repeating the question&apos;s words.
      </figcaption>
    </figure>
  );
}

/* ───────────── figure 3 · third-party sources: switch each one on, and it becomes something an AI answer can draw on ───────────── */
const AUTO_SOURCES = 2; // the two the reel names: a podcast and a top-10 article
const SOURCE_X = [50, 150, 250, 350];

function Sources() {
  const { ref, seen } = useSeen();
  const reduce = useReducedMotionSafe();
  const [auto, setAuto] = useState(0);
  const [picked, setPicked] = useState<SourceId[] | null>(null);
  // until someone presses, switch on the reel's two, one after the other
  useEffect(() => {
    if (!seen || reduce || picked !== null || auto >= AUTO_SOURCES) return;
    const id = setTimeout(() => setAuto((n) => n + 1), 900);
    return () => clearTimeout(id);
  }, [seen, reduce, picked, auto]);
  const on = picked ?? SOURCES.slice(0, reduce ? AUTO_SOURCES : auto).map((s) => s.id);
  const toggle = (id: SourceId) => setPicked(on.includes(id) ? on.filter((item) => item !== id) : [...on, id]);
  return (
    <figure ref={ref} className="ge-plate p-4 sm:p-6">
      <Plate n={3} title="PR, but for AI" sub="switch the sources on and off" />
      <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="Third-party sources">
        {SOURCES.map((s) => {
          const active = on.includes(s.id);
          return (
            <button key={s.id} type="button" aria-pressed={active} onClick={() => toggle(s.id)} className={`${OPTION(active)} flex min-h-[52px] flex-col items-center justify-center px-1 py-1.5 text-center`}>
              <span className="text-[13px] font-semibold leading-tight">{s.label}</span>
              <span className="font-mono text-[12px]" style={{ color: active ? "var(--accent)" : "var(--muted)" }}>
                {active ? "on" : "off"}
              </span>
            </button>
          );
        })}
      </div>

      {/* one line from each source down to the answer; it is drawn when the source is on */}
      <svg viewBox="0 0 400 56" preserveAspectRatio="none" className="block h-14 w-full" aria-hidden>
        {SOURCES.map((s, i) => {
          const d = `M${SOURCE_X[i]} 0 C ${SOURCE_X[i]} 34, 200 22, 200 56`;
          const active = on.includes(s.id);
          return (
            <g key={s.id}>
              <path d={d} fill="none" stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 5" />
              <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" pathLength={1} strokeDasharray="1" strokeDashoffset={active ? 0 : 1} className="ge-line" />
            </g>
          );
        })}
      </svg>

      <div className="rounded-[12px] border border-[var(--ink)] bg-white p-3">
        <span className={LABEL}>WHAT AN AI ANSWER CAN DRAW ON</span>
        <ul className="mt-2 space-y-1.5">
          {SOURCES.map((s) => {
            const active = on.includes(s.id);
            return (
              <li key={s.id} className="flex items-start gap-2.5 text-[14px] leading-snug" style={{ color: active ? "var(--ink)" : "var(--muted)", transition: "color .3s" }}>
                <span className="mt-[6px] size-2 shrink-0 rounded-full" style={{ background: active ? "var(--accent)" : "transparent", boxShadow: active ? "none" : "inset 0 0 0 1px var(--rule-strong)", transition: "background-color .3s" }} />
                <span style={{ textDecoration: active ? "none" : "line-through", textDecorationColor: "var(--rule-strong)" }}>{s.line}</span>
              </li>
            );
          })}
        </ul>
        <span className="mt-3 block border-t border-[var(--rule)] pt-2.5 text-[14px] font-medium leading-snug text-[var(--ink)]" aria-live="polite">
          {on.length === 0 ? "So far, only your own site talks about you." : `${on.length} of ${SOURCES.length} kinds of outside source talk about you.`}
        </span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        A picture of the idea, not a measurement. Which sources an assistant reads, and how much each one counts, differs from product to product. What you control is whether other people have a reason to mention you.
      </figcaption>
    </figure>
  );
}

/* ───────────── figure 4 · your own content: one tile among many, and three ways it stops looking like the rest ───────────── */
const COLS = 4;
const ROWS = 3;
const MINE = 6; // which tile is yours: second row, third column
const TILE_W = 12; // percent of the stage
const COL_STEP = 15;
const TILE_H = 44;
const ROW_STEP = 54;
const tileLeft = (c: number) => 4 + c * COL_STEP;
const tileTop = (r: number) => 14 + r * ROW_STEP;

function Content() {
  const { ref, seen } = useSeen();
  const reduce = useReducedMotionSafe();
  const [auto, setAuto] = useState(-1); // -1 = still one of the crowd
  const [picked, setPicked] = useState<AngleId | null>(null);
  // until someone presses, walk through the three once
  useEffect(() => {
    if (!seen || reduce || picked !== null || auto >= ANGLES.length - 1) return;
    const id = setTimeout(() => setAuto((n) => n + 1), auto < 0 ? 900 : 1700);
    return () => clearTimeout(id);
  }, [seen, reduce, picked, auto]);
  const id: AngleId | null = picked ?? (reduce ? ANGLES[0].id : auto < 0 ? null : ANGLES[auto].id);
  const angle = ANGLES.find((a) => a.id === id);
  const mineStyle =
    id === "firsthand"
      ? { transform: "translateY(-4px) scale(1.22)" }
      : id === "angle"
        ? { transform: "rotate(-12deg) scale(1.12)" }
        : id === "gap"
          ? { left: "77%" }
          : {};
  return (
    <figure ref={ref} className="ge-plate p-4 sm:p-6">
      <Plate n={4} title="Stand out from the crowd" sub="pick one of the three" />
      <div role="radiogroup" aria-label="Kind of content" className="grid grid-cols-3 gap-1.5">
        {ANGLES.map((a) => {
          const on = a.id === id;
          return (
            <button key={a.id} type="button" role="radio" aria-checked={on} onClick={() => setPicked(a.id)} className={`${OPTION(on)} flex min-h-[52px] items-center justify-center px-1.5 py-1.5 text-center text-[13px] font-semibold leading-tight`}>
              {a.label}
            </button>
          );
        })}
      </div>

      {/* twelve pages on the same topic. Eleven look the same; the twelfth is yours */}
      <div className="relative mt-2 overflow-hidden rounded-[12px] border border-[var(--rule)] bg-white" style={{ height: tileTop(ROWS - 1) + TILE_H + 14 }} aria-hidden>
        <span
          className="absolute rounded-[10px] border border-dashed"
          style={{ left: "70%", right: "4%", top: 14, bottom: 14, borderColor: id === "gap" ? "var(--accent)" : "var(--rule-strong)", opacity: id === "gap" ? 1 : 0.5, transition: "border-color .3s, opacity .3s" }}
        />
        {Array.from({ length: COLS * ROWS }, (_, i) => {
          const mine = i === MINE;
          const lit = mine && id !== null;
          return (
            <span
              key={i}
              className="ge-tile absolute flex flex-col justify-center gap-[5px] rounded-[8px] border bg-white px-[5px]"
              style={{
                left: `${tileLeft(i % COLS)}%`,
                top: tileTop(Math.floor(i / COLS)),
                width: `${TILE_W}%`,
                height: TILE_H,
                borderColor: lit ? "var(--accent)" : mine ? "var(--ink)" : "var(--rule-strong)",
                boxShadow: lit ? "0 0 0 1px var(--accent), 0 8px 18px -10px rgba(21,23,26,.45)" : "none",
                opacity: !mine && id !== null ? 0.55 : 1,
                zIndex: mine ? 2 : 1,
                ...(mine ? mineStyle : {}),
              }}
            >
              {[100, 70, 85].map((w, row) => (
                <span key={row} className="block h-[3px] rounded-full" style={{ width: `${w}%`, background: lit && row === 0 ? "var(--accent)" : mine ? "var(--ink)" : "var(--rule-strong)", transition: "background-color .3s" }} />
              ))}
            </span>
          );
        })}
      </div>
      <div className="mt-1.5 flex flex-wrap justify-between gap-x-3 font-mono text-[12px] text-[var(--muted)]">
        <span>eleven pages that look the same</span>
        <span style={{ color: id === null ? "var(--ink)" : "var(--accent)" }}>{angle ? `yours: ${angle.tag}` : "yours: the dark one"}</span>
      </div>

      <div className="ge-card mt-2 min-h-[92px]" aria-live="polite">
        <div key={id ?? "crowd"} className="ge-in">
          <span className={LABEL}>{angle ? angle.label.toUpperCase() : "THE CROWD"}</span>
          <span className="mt-1.5 block text-[14px] leading-relaxed text-[var(--ink)]">{angle ? angle.what : "Same topic, same points, same order. Nothing here gives anyone a reason to pick your page over the next one."}</span>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The twelve tiles are an illustration. The three kinds of content are the reel&apos;s: firsthand stories, unique angles and under-covered topics.</figcaption>
    </figure>
  );
}

/* ───────────── figure 5 · the checklist: seven steps, ticked in this browser ───────────── */
// The ticks live in localStorage. When the browser refuses it (private window, storage off or full), they are kept in `memory` for this visit.
const listeners = new Set<() => void>();
let memory: string | null = null;

function readSaved(): string {
  if (memory !== null) return memory;
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function writeSaved(value: string) {
  memory = value;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // kept in memory for this visit
  }
  listeners.forEach((listener) => listener());
}

function subscribeSaved(listener: () => void) {
  listeners.add(listener);
  // another tab ticked something: read it again
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEY) return;
    memory = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function Checklist() {
  // "" on the server and during hydration, so the first client render matches the server's HTML
  const saved = useSyncExternalStore(subscribeSaved, readSaved, () => "");
  const done = parseDone(saved);
  const all = done.length === STEPS.length;
  return (
    <figure className="ge-plate p-4 sm:p-6">
      <Plate n={5} title="The 7 steps" sub="tap a step to tick it · saved in this browser" />
      <div className="ge-card">
        <span className="flex items-baseline justify-between gap-2">
          <span className="text-[14px] font-semibold text-[var(--ink)]" aria-live="polite">
            {done.length} of {STEPS.length} done
          </span>
          <span className="font-mono text-[12px]" style={{ color: all ? "var(--accent)" : "var(--muted)" }}>
            {all ? "all seven" : "keep going"}
          </span>
        </span>
        <span className="mt-2 grid grid-cols-7 gap-1.5" aria-hidden>
          {STEPS.map((s) => (
            <span key={s.id} className="h-1.5 rounded-full" style={{ background: done.includes(s.id) ? "var(--accent)" : "var(--rule-strong)", transition: "background-color .25s" }} />
          ))}
        </span>
      </div>

      <ol className="mt-2 space-y-1.5">
        {STEPS.map((s, n) => {
          const ticked = done.includes(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={ticked}
                onClick={() => writeSaved(serializeDone(toggleDone(done, s.id)))}
                className={`ge-press ge-card flex min-h-11 w-full items-start gap-3 text-left hover:border-[var(--rule-strong)] ${FOCUS}`}
                style={{ borderColor: ticked ? "var(--accent)" : undefined }}
              >
                <span
                  className="mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-[7px] border"
                  style={{ borderColor: ticked ? "var(--accent)" : "var(--ink)", background: ticked ? "var(--accent)" : "#fff", transition: "background-color .2s, border-color .2s" }}
                  aria-hidden
                >
                  <svg viewBox="0 0 16 16" className="size-3.5">
                    <path d="M3.5 8.5 6.6 11.5 12.5 4.8" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={ticked ? 0 : 1} className="ge-line" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[12px] text-[var(--accent)]">{n + 1}</span>
                    <span className="text-[14px] font-semibold leading-snug" style={{ color: ticked ? "var(--soft)" : "var(--ink)" }}>
                      {s.title}
                    </span>
                  </span>
                  <span className="mt-1 block text-[13px] leading-relaxed text-[var(--soft)]">{s.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <span className="min-w-0 flex-1 basis-[180px] text-[13px] leading-snug text-[var(--soft)]">
          {all ? "All seven done. Step 7 is the one to repeat: ask again, compare, and adjust." : "Steps 2 to 5 are your own content. Step 6 is third-party sources. Steps 1 and 7 are how you check."}
        </span>
        <button type="button" className={BTN} disabled={done.length === 0} onClick={() => writeSaved(serializeDone([]))}>
          Clear the ticks
        </button>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">General advice that follows the two ways above, not a guarantee. Your ticks stay in this browser; nothing is sent.</figcaption>
    </figure>
  );
}

const GE_CSS = `
.ge{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#6f747b;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757;--mark:rgba(215,119,87,.3)}
.ge-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:24px 24px;box-shadow:0 0 0 1px var(--rule)}
.ge-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:10px 12px}
.ge-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.ge-press:active:not(:disabled){transform:scale(.97)}
.ge-in{animation:ge-in .4s cubic-bezier(.22,1,.36,1) both}
@keyframes ge-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.ge-mark{color:inherit;border-radius:3px;padding:0 1px;background:linear-gradient(var(--mark),var(--mark)) no-repeat 0 0/100% 100%;animation:ge-sweep .45s cubic-bezier(.22,1,.36,1) both}
@keyframes ge-sweep{from{background-size:0% 100%}to{background-size:100% 100%}}
.ge-cover{font-weight:600;color:var(--ink);box-shadow:inset 0 -2px 0 var(--accent)}
.ge-bar{transition:height .6s cubic-bezier(.22,1,.36,1),background-color .3s}
.ge-line{transition:stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)}
.ge-tile{transition:left .7s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.34,1.56,.64,1),border-color .3s,box-shadow .3s,opacity .3s}
@media (prefers-reduced-motion:reduce){.ge-in,.ge-mark{animation:none}.ge-bar,.ge-line,.ge-tile{transition:none}}
`;

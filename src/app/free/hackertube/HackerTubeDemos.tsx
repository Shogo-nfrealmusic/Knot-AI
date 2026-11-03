"use client";

// /free/50 (HackerTube, the YouTube Karpathy had Claude build from Hacker News recommendations): one small live figure per
// chapter, drawn for this site rather than cut from the reel. Same language as /free/46–49 and /free/starter: paper plate,
// ink lines, one orange accent, nothing plays off screen. The comments, titles and points are real (hackertube-data.zip and
// the HN front pages of Oct 31–Nov 2, 2026); every other claim is Karpathy's own words (X, his blog, hackertube.org/data).
// No video frames or thumbnails: other people's footage stays off the page.

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type HackerTubeDemoKind = "filter" | "browser" | "thumb" | "hand" | "copies" | "zip";

export function HackerTubeDemo({ kind }: { kind: HackerTubeDemoKind }) {
  return (
    <div className="ht mt-5 max-w-2xl">
      <style>{HT_CSS}</style>
      {kind === "filter" && <Filter />}
      {kind === "browser" && <Browser />}
      {kind === "thumb" && <Thumb />}
      {kind === "hand" && <Hand />}
      {kind === "copies" && <Copies />}
      {kind === "zip" && <Zip />}
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

function Button({ onClick, children, primary }: { onClick: () => void; children: React.ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ht-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
    >
      {children}
    </button>
  );
}

function Toggle<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-1 rounded-full bg-white p-1 shadow-[0_0_0_1px_var(--rule)]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`ht-press whitespace-nowrap rounded-full px-2.5 py-1.5 text-[12.5px] font-medium sm:px-3 sm:text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${value === o.id ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* real rows from hackertube-data.zip (mentions.jsonl / videos.jsonl): the comment, who wrote it, and the video it points to */
const KEPT = [
  { quote: "A brilliant video by Tom Scott for Computerphile", author: "tehmaco", year: 2015, title: "The Problem with Time & Timezones", channel: "Computerphile", hn: "https://news.ycombinator.com/item?id=8843876" },
  { quote: "What sold me on the idea was Rich Hickey's talk", author: "lukifer", year: 2020, title: "The Value of Values with Rich Hickey", channel: "InfoQ", hn: "https://news.ycombinator.com/item?id=22773508" },
  { quote: "Highly recommend the SICP lectures", author: "k00b", year: 2020, title: "Lecture 1A: Overview and Introduction to Lisp", channel: "MIT OpenCourseWare", hn: "https://news.ycombinator.com/item?id=25355278" },
  { quote: "I cannot recommend this video enough.", author: "rsync", year: 2022, title: "Children Of The Magenta Line", channel: "Mossie Fly", hn: "https://news.ycombinator.com/item?id=29763056" },
  { quote: "I highly recommend this video on the Amen break", author: "jmarin", year: 2014, title: "Video explains the world's most important 6-sec drum loop", channel: "Landon Proctor", hn: "https://news.ycombinator.com/item?id=7942428" },
  { quote: "how async operations are scheduled on a single thread", author: "lollipop25", year: 2016, title: "What the heck is the event loop anyway?", channel: "JSConf", hn: "https://news.ycombinator.com/item?id=11286775" },
];
const NOISE = ["Simple answer: The math says so", "I thought this video had a good example.", "this bears watching again...", "His Ted talk is a good starting point.", "Here's a good video that gives a run down", "I found these videos quite entertaining"];

/* ───────────── filter: 43M comments, the ones that recommend a video stay, each turns into that video ───────────── */
function Filter() {
  const { ref, t } = useClock();
  const [t0, setT0] = useState<number | null>(null);
  const s = t0 === null ? 0 : t - t0;
  const drop = ease(ramp(s, 0.2, 1.1));
  const flip = ease(ramp(s, 1.2, 1.8));
  const count = t0 === null ? 43e6 : 43e6 + (6454 - 43e6) * ease(ramp(s, 0.2, 2.2));
  const [open, setOpen] = useState<number | null>(null);
  return (
    <figure ref={ref} className="ht-plate p-4 sm:p-6">
      <div className="mb-3 flex items-baseline gap-2 font-mono text-[13px] text-[var(--soft)]">
        <span className="text-[26px] font-semibold tabular-nums text-[var(--ink)]">{fmt(count)}</span>
        {flip > 0.5 ? "videos" : "Hacker News comments, 20 years"}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {KEPT.map((k, i) => (
          <div key={i} className="relative" style={{ minHeight: 64 }}>
            {/* a noise comment that falls away */}
            {drop < 1 && (
              <div className="ht-card absolute inset-x-0 top-0" style={{ transform: `translateY(${drop * 60}px) rotate(${drop * (i % 2 ? 8 : -8)}deg)`, opacity: 1 - drop, zIndex: 1 }}>
                <span className="text-[var(--muted)]">&ldquo;{NOISE[i]}&rdquo;</span>
              </div>
            )}
            {/* the comment that stays, then the video it recommends */}
            <button type="button" onClick={() => setOpen(open === i ? null : i)} className="ht-card ht-press relative w-full text-left" style={{ opacity: drop, transform: `translateY(${(1 - drop) * 8}px)` }}>
              {flip < 0.5 || open === i ? (
                <span><span className="text-[var(--ink)]">&ldquo;{k.quote}&rdquo;</span><span className="ml-1 font-mono text-[11px] text-[var(--muted)]">{k.author} · {k.year}</span></span>
              ) : (
                <span><span className="mr-1.5 text-[var(--accent)]">▶</span><span className="font-medium text-[var(--ink)]">{k.title}</span><span className="ml-1 text-[12px] text-[var(--muted)]">{k.channel}</span></span>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button primary onClick={() => { setT0(t); setOpen(null); }}>{t0 === null ? "Run the filter" : "Run it again"}</Button>
        {flip > 0.5 && <span className="font-mono text-[12px] text-[var(--soft)]">Tap a video to see the comment that recommended it.</span>}
        {flip > 0.5 && open !== null && <a href={KEPT[open].hn} className="font-mono text-[12px] text-[var(--accent)] underline underline-offset-2">open the comment on HN</a>}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Six real rows from HackerTube&apos;s data: a Hacker News comment that recommends a video, and the video. Karpathy had Claude filter 43M comments over 20 years down to the 6,454 videos people keep recommending.</figcaption>
    </figure>
  );
}

/* ───────────── browser: no account; what you watch is written into your browser and nowhere else ───────────── */
function Browser() {
  const [history, setHistory] = useState<number[]>([]);
  const watch = (i: number) => setHistory((h) => [i, ...h.filter((x) => x !== i)].slice(0, 4));
  return (
    <figure className="ht-plate p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1.25fr_1fr]">
        <div>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--soft)]">hackertube.org · no sign-in</div>
          <div className="grid gap-1.5">
            {KEPT.slice(0, 4).map((k, i) => (
              <button key={i} type="button" onClick={() => watch(i)} className="ht-card ht-press text-left hover:border-[var(--ink)]">
                <span className="mr-1.5 text-[var(--accent)]">▶</span><span className="text-[var(--ink)]">{k.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-[var(--rule-strong)] bg-white/70 p-3">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--soft)]">
            <span>History · in this browser</span>
            {history.length > 0 && <button type="button" onClick={() => setHistory([])} className="ht-press normal-case tracking-normal text-[var(--accent)] underline underline-offset-2">clear</button>}
          </div>
          {history.length === 0 ? (
            <p className="text-[13px] text-[var(--muted)]">Empty. Tap a video on the left.</p>
          ) : (
            <ol className="grid gap-1 text-[13px] text-[var(--ink)]">
              {history.map((i, n) => <li key={`${i}-${n}`} className="ht-in truncate">{KEPT[i].title}</li>)}
            </ol>
          )}
          <div className="mt-3 border-t border-[var(--rule)] pt-2 font-mono text-[11px] text-[var(--soft)]">Accounts on the server: <span className="text-[var(--ink)]">none</span></div>
        </div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">In Karpathy&apos;s words: &ldquo;Excellent recs without any logins (state is kept in local browser session).&rdquo; Clear your browser and the history is gone.</figcaption>
    </figure>
  );
}

/* ───────────── thumb: the uploader's picture vs a frame from the middle of the video ───────────── */
function Thumb() {
  const [pos, setPos] = useState(50);
  const [which, setWhich] = useState<"middle" | "upload">("middle");
  // a drawn talk: the speaker walks across the stage as the video plays; slides change at 30% and 70%
  const slide = pos < 30 ? 0 : pos < 70 ? 1 : 2;
  const mid = which === "middle";
  return (
    <figure className="ht-plate p-4 sm:p-6">
      <svg viewBox="0 0 640 300" className="w-full" aria-label="A video's timeline; HackerTube uses the frame at the middle as the thumbnail instead of the uploader's picture">
        <rect x={120} y={10} width={400} height={225} rx={12} fill="#fff" stroke="var(--ink)" strokeWidth={1.4} />
        {mid ? (
          <g>
            <rect x={300} y={34} width={190} height={110} rx={4} fill="var(--page)" stroke="var(--rule-strong)" />
            {[0, 1, 2].map((r) => <line key={r} x1={318} y1={62 + r * 24} x2={318 + [140, 110, 150][(r + slide) % 3]} y2={62 + r * 24} stroke="var(--rule-strong)" strokeWidth={6} strokeLinecap="round" />)}
            <line x1={140} y1={210} x2={500} y2={210} stroke="var(--rule-strong)" strokeWidth={2} />
            <g transform={`translate(${150 + pos * 1.3} 0)`}>
              <circle cx={0} cy={140} r={13} fill="var(--ink)" />
              <path d="M -20 205 Q 0 150 20 205 Z" fill="var(--ink)" />
            </g>
          </g>
        ) : (
          <g>
            <rect x={120} y={10} width={400} height={225} rx={12} fill="var(--accent)" />
            <circle cx={230} cy={130} r={62} fill="#fff" />
            <text x={230} y={152} textAnchor="middle" fontSize={64} fontWeight={800} fill="var(--accent)">!?</text>
            <text x={420} y={110} textAnchor="middle" fontSize={40} fontWeight={900} fill="#fff">YOU</text>
            <text x={420} y={152} textAnchor="middle" fontSize={40} fontWeight={900} fill="#fff">WON&apos;T</text>
            <text x={420} y={194} textAnchor="middle" fontSize={40} fontWeight={900} fill="#fff">BELIEVE</text>
          </g>
        )}
        {/* the timeline */}
        <line x1={120} y1={262} x2={520} y2={262} stroke="var(--rule-strong)" strokeWidth={6} strokeLinecap="round" />
        <line x1={120} y1={262} x2={120 + 4 * pos} y2={262} stroke="var(--accent)" strokeWidth={6} strokeLinecap="round" />
        <line x1={320} y1={252} x2={320} y2={272} stroke="var(--ink)" strokeWidth={1.5} />
        <text x={320} y={292} textAnchor="middle" fontSize={13} fill="var(--soft)" fontFamily="ui-monospace, monospace">middle</text>
        <circle cx={120 + 4 * pos} cy={262} r={9} fill="var(--accent)" />
      </svg>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Toggle label="Thumbnail" value={which} onChange={setWhich} options={[{ id: "middle", label: "HackerTube: a frame from the middle" }, { id: "upload", label: "The uploader's pick" }]} />
        {mid && (
          <label className="flex items-center gap-2 font-mono text-[12px] text-[var(--soft)]">
            scrub
            <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="accent-[var(--accent)]" aria-label="Position in the video" />
            <button type="button" onClick={() => setPos(50)} className="ht-press text-[var(--accent)] underline underline-offset-2">snap to middle</button>
          </label>
        )}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Karpathy: the thumbnail is &ldquo;a representative frame from middle of the video instead of the super duper A/B test hyper-optimized user uploads.&rdquo; Drawn here; no real video is shown.</figcaption>
    </figure>
  );
}

/* ───────────── hand: about 2 hours with Opus 5.5; three things by hand, the rest Claude ───────────── */
const STEPS: { who: "claude" | "hand"; text: string }[] = [
  { who: "claude", text: "Build the site and the comment pipeline" },
  { who: "hand", text: "Create an API key in the Google Cloud UI (YouTube metadata)" },
  { who: "hand", text: "Boot a VPS box for serving" },
  { who: "hand", text: "Buy the domain name" },
  { who: "claude", text: "Update, secure, harden, deploy and optimize" },
];
function Hand() {
  const { ref, t } = useClock();
  const [t0, setT0] = useState(0);
  const s = t - t0;
  const done = Math.min(STEPS.length, Math.floor(s / 0.9));
  const clock = 120 * ease(ramp(s, 0, STEPS.length * 0.9));
  return (
    <figure ref={ref} className="ht-plate p-4 sm:p-6">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="font-mono text-[28px] font-semibold tabular-nums text-[var(--ink)]">~{Math.floor(clock / 60)}:{String(Math.floor(clock % 60)).padStart(2, "0")}</span>
        <span className="font-mono text-[12px] text-[var(--soft)]">hours, with Opus 5.5</span>
      </div>
      <ol className="grid gap-1.5">
        {STEPS.map((st, i) => (
          <li key={i} className="ht-card flex items-center gap-3" style={{ opacity: i < done ? 1 : 0.35, transition: "opacity .3s" }}>
            <span className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] ${st.who === "hand" ? "bg-[var(--ink)] text-white" : "border border-[var(--accent)] text-[var(--accent)]"}`}>{st.who === "hand" ? "by hand" : "Claude"}</span>
            <span className="text-[var(--ink)]">{st.text}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-center gap-3">
        <Button primary onClick={() => setT0(t)}>Replay</Button>
        <span className="font-mono text-[12px] text-[var(--soft)]">by hand: 3 · Claude: everything else</span>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">From Karpathy&apos;s post. The three manual steps were browser work he did in tandem; then he gave Claude the server&apos;s IP and told it to &ldquo;update, secure, harden, deploy and optimize the code, and it did the whole thing.&rdquo; The order of the rows is approximate.</figcaption>
    </figure>
  );
}

/* ───────────── copies: within two days, three more of the same idea reached the HN front page ───────────── */
const COPIES = [
  { day: "Oct 31", name: "HackerTube", title: "HackerTube: YouTube built from videos recommended by HN", by: "karpathy", points: 2789, href: "https://hackertube.org/" },
  { day: "Nov 1", name: "HackerBooks", title: "Show HN: HackerBooks – HackerTube, but for books mentioned on HN", by: "roansh", points: 1785, href: "https://hackerbooks.org/" },
  { day: "Nov 2", name: "Wikihack", title: "Show HN: Wikihack – HackerTube, but for Wikipedia articles mentioned on HN", by: "aizk", points: 324, href: "https://wikihack.netlify.app/" },
  { day: "Nov 2", name: "HackerHack", title: "Show HN: HackerHack – HackerBooks but for Posts Posted on HN", by: "mw888", points: 179 },
];
function Copies() {
  const { ref, t } = useClock();
  const [sel, setSel] = useState(1);
  const grow = ease(ramp(t, 0.1, 1.1));
  const c = COPIES[sel];
  return (
    <figure ref={ref} className="ht-plate p-4 sm:p-6">
      <svg viewBox="0 0 640 230" className="w-full" aria-label="HN points for HackerTube and the three copies that followed within two days">
        {COPIES.map((k, i) => {
          const h = 170 * (k.points / 2789) * grow;
          const x = 50 + i * 150;
          return (
            <g key={i} onClick={() => setSel(i)} style={{ cursor: "pointer" }}>
              <rect x={x} y={190 - h} width={100} height={Math.max(2, h)} rx={6} fill={i === sel ? "var(--accent)" : i === 0 ? "var(--ink)" : "var(--rule-strong)"} />
              <text x={x + 50} y={182 - h} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--ink)" fontFamily="ui-monospace, monospace">{fmt(k.points * grow)}</text>
              <text x={x + 50} y={210} textAnchor="middle" fontSize={15} fontWeight={600} fill="var(--ink)">{k.name}</text>
              <text x={x + 50} y={226} textAnchor="middle" fontSize={12} fill="var(--soft)" fontFamily="ui-monospace, monospace">{k.day}</text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-2">
        {COPIES.map((k, i) => <Button key={i} primary={i === sel} onClick={() => setSel(i)}>{k.name}</Button>)}
      </div>
      <div className="ht-card mt-3" style={{ fontFamily: "Verdana, Geneva, sans-serif" }}>
        <div className="text-[14px] text-black">{c.href ? <a href={c.href} className="hover:underline">{c.title}</a> : c.title}</div>
        <div className="mt-1 text-[12px] text-[#828282]">{c.points} points by {c.by}</div>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">Points as shown on the HN front pages of Oct 31, Nov 1 and Nov 2, 2026 (captured Nov 3). HackerHack copies HackerBooks, the copy of HackerTube.</figcaption>
    </figure>
  );
}

/* ───────────── zip: the data in one file; hand it to your Claude ───────────── */
const FILES: { name: string; note: string }[] = [
  { name: "DATA.md", note: "Starts with \"For AI agents: start here\". Explains the files. License: ODC-By v1.0." },
  { name: "videos.jsonl", note: "The 6,454 videos." },
  { name: "mentions.jsonl", note: "39,834 labeled Hacker News comments. Each was read by Claude Sonnet 5.5." },
  { name: "taxonomy.json", note: "Described in DATA.md." },
  { name: "related.jsonl", note: "Described in DATA.md." },
  { name: "embeddings.npy", note: "Described in DATA.md." },
  { name: "embedding_ids.json", note: "Described in DATA.md." },
];
function Zip() {
  const { ref, t } = useClock();
  const [sel, setSel] = useState(0);
  const [t0, setT0] = useState<number | null>(null);
  const s = t0 === null ? 0 : t - t0;
  const fly = ease(ramp(s, 0, 0.9));
  const built = ramp(s, 1.0, 1.6);
  return (
    <figure ref={ref} className="ht-plate p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1.1fr_1fr]">
        <div className="rounded-xl bg-white p-3 shadow-[0_0_0_1px_var(--rule)]" style={{ transform: `translateX(${fly * 24}px) scale(${1 - 0.06 * fly})`, opacity: 1 - 0.5 * fly }}>
          <div className="mb-2 font-mono text-[12px] text-[var(--ink)]"><span className="text-[var(--accent)]">▼</span> hackertube-data.zip <span className="text-[var(--muted)]">17.8 MB</span></div>
          <ul className="grid gap-0.5">
            {FILES.map((f, i) => (
              <li key={f.name}>
                <button type="button" onClick={() => setSel(i)} className={`ht-press w-full rounded-md px-2 py-1 text-left font-mono text-[12.5px] ${i === sel ? "bg-[var(--ink)] text-white" : "text-[var(--soft)] hover:text-[var(--ink)]"}`}>{f.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between gap-3">
          <p className="text-[13.5px] leading-relaxed text-[var(--ink)]"><span className="font-mono text-[12px] text-[var(--soft)]">{FILES[sel].name}</span><br />{FILES[sel].note}</p>
          <div className="rounded-xl border border-dashed border-[var(--accent)] bg-white/70 p-3 text-[13px]" style={{ opacity: 0.4 + 0.6 * built }}>
            <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">your Claude</div>
            <div className="mt-1 text-[var(--ink)]">{built >= 1 ? "Reads DATA.md first, then builds your own version." : t0 === null ? "Waiting for the zip." : "Reading…"}</div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Button primary onClick={() => setT0(t)}>Hand it to Claude</Button>
        <a href="https://hackertube.org/data" className="font-mono text-[12px] text-[var(--accent)] underline underline-offset-2">hackertube.org/data</a>
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">The seven files in the zip on hackertube.org/data: &ldquo;Everything behind HackerTube, free to reuse. Give it to your AI agent and build your own.&rdquo; Only DATA.md, the videos and the comments are described here; the rest is explained in DATA.md.</figcaption>
    </figure>
  );
}

const HT_CSS = `
.ht{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#e0552f}
.ht-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.ht-card{border-radius:12px;border:1px solid var(--rule);background:#fff;padding:9px 12px;font-size:13.5px;line-height:1.35}
.ht-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,opacity .2s,color .2s,background-color .2s}
.ht-press:active{transform:scale(.96)}
@keyframes ht-in{from{opacity:0;transform:translateY(-4px)}}
.ht-in{animation:ht-in .3s ease-out}
@media (max-width:640px){.ht svg text{font-size:18px}}
@media (prefers-reduced-motion:reduce){.ht-in{animation:none}}
`;

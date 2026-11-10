"use client";

// /free/60 (Stop paying for these 9 apps): two live figures drawn for this site rather than cut from the reel.
// Same language as /free/46–59: paper plate on a grid, ink lines, one accent (orange), calm motion.
// Real (GitHub API and each README, read Nov 10, 2026): the nine repos, their licences and star counts, what each does,
// and the caveats (Muapi key, DataForSEO pay-as-you-go, Ollama for AppFlowy's local AI, Cal.diy's own warning).

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export type ReposDemoKind = "swap" | "picker";

export function ReposDemo({ kind }: { kind: ReposDemoKind }) {
  return (
    <div className="rp mt-5 max-w-2xl">
      <style>{RP_CSS}</style>
      {kind === "swap" && <Swap />}
      {kind === "picker" && <Picker />}
    </div>
  );
}

/* ───────────── the nine pairs (stars: GitHub API, Nov 10, 2026) ───────────── */
type Pair = {
  id: string;
  paid: string;
  /** what the paid app is for, in two or three words */
  category: string;
  name: string;
  repo: string;
  licence: string;
  /** thousands of stars, one decimal */
  stars: number;
  does: string;
  note?: string;
};
const PAIRS: Pair[] = [
  {
    id: "higgsfield",
    paid: "Higgsfield",
    category: "AI image & video",
    name: "Open Generative AI",
    repo: "Anil-matcha/Open-Generative-AI",
    licence: "MIT",
    stars: 33.8,
    does: "Image, video and lip-sync studio with 600+ models, self-hosted.",
    note: "Cloud models run through Muapi and need a Muapi API key; the desktop app can also run local models without one.",
  },
  {
    id: "elevenlabs",
    paid: "ElevenLabs",
    category: "AI voice",
    name: "VoiceStudio",
    repo: "debpalash/VoiceStudio",
    licence: "AGPL-3.0",
    stars: 106.8,
    does: "Voice cloning, voice design, dubbing, dictation and audiobooks, on your own hardware.",
  },
  {
    id: "semrush",
    paid: "Semrush",
    category: "SEO research",
    name: "OpenSEO",
    repo: "every-app/open-seo",
    licence: "MIT",
    stars: 27.1,
    does: "Keyword research, backlinks and site audits.",
    note: "SEO data comes from DataForSEO with your own API key, paid as you go.",
  },
  {
    id: "notion",
    paid: "Notion",
    category: "docs & wikis",
    name: "AppFlowy",
    repo: "AppFlowy-IO/AppFlowy",
    licence: "AGPL-3.0",
    stars: 78.6,
    does: "Docs, wikis and databases with AI, in a workspace where you keep your data.",
    note: "Local AI runs through Ollama.",
  },
  {
    id: "wispr",
    paid: "Wispr Flow",
    category: "voice dictation",
    name: "OpenWhispr",
    repo: "OpenWhispr/openwhispr",
    licence: "MIT",
    stars: 11.2,
    does: "Press a hotkey, speak, and the text lands at your cursor. Local models, or cloud with your own key.",
  },
  {
    id: "asana",
    paid: "Asana",
    category: "project management",
    name: "OpenProject",
    repo: "opf/openproject",
    licence: "GPL-3.0",
    stars: 17.2,
    does: "Boards, roadmaps, Gantt charts and time tracking, on your server or in their cloud.",
  },
  {
    id: "calendly",
    paid: "Calendly",
    category: "scheduling",
    name: "Cal.diy",
    repo: "calcom/cal.diy",
    licence: "MIT",
    stars: 49.9,
    does: "Self-hosted booking pages: the community edition of Cal.com.",
    note: "Its README recommends it for personal, non-production use; team and enterprise features are removed.",
  },
  {
    id: "intercom",
    paid: "Intercom",
    category: "support chat",
    name: "Chatwoot",
    repo: "chatwoot/chatwoot",
    licence: "MIT (except enterprise/)",
    stars: 39.6,
    does: "Website chat, email, WhatsApp, Instagram and more in one inbox, with an AI agent.",
  },
  {
    id: "loom",
    paid: "Loom",
    category: "screen recording",
    name: "Cap",
    repo: "CapSoftware/Cap",
    licence: "AGPLv3 (mostly)",
    stars: 24.8,
    does: "Screen recordings with an instant share link, or record locally and edit. macOS, Windows, Linux.",
  },
];

const STARS_AS_OF = "Nov 10, 2026";
const gh = (repo: string) => `https://github.com/${repo}`;
const fmtK = (k: number) => `${k.toFixed(1)}K`;

/** a clock that runs only while the figure is on screen; frozen with reduced motion */
function useClock() {
  const ref = useRef<HTMLElement>(null);
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

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 1 - (1 - x) ** 3;

function Plate({ n, title, sub, right }: { n: number; title: string; sub: string; right?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="min-w-0">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[12px] text-[var(--accent)]">0{n}/02</span>
          <span className="truncate text-[15px] font-semibold text-[var(--ink)]">{title}</span>
        </span>
        <span className="block truncate font-mono text-[11.5px] text-[var(--muted)]">{sub}</span>
      </span>
      {right ? <span className="ml-auto shrink-0 text-right">{right}</span> : null}
    </div>
  );
}

function Button({ onClick, children, primary }: { onClick: () => void; children: React.ReactNode; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rp-press rounded-full px-3.5 py-1.5 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${primary ? "bg-[var(--ink)] text-white" : "border border-[var(--rule-strong)] bg-white text-[var(--ink)] hover:border-[var(--ink)]"}`}
    >
      {children}
    </button>
  );
}

function Tag({ free }: { free: boolean }) {
  return (
    <span
      className="inline-block rounded-full px-1.5 py-px font-mono text-[9.5px] font-semibold tracking-[0.08em] transition-colors duration-300"
      style={{ background: free ? "var(--accent)" : "var(--ink)", color: "#fff" }}
    >
      {free ? "FREE" : "PAID"}
    </span>
  );
}

/* ───────────── 01 swap: each paid app is traced to its repo, one by one ───────────── */
const STEP = 1.05; // seconds per pair
const HOLD = 2.6; // pause on the finished board before it starts again
function Swap() {
  const { ref, t, reduce } = useClock();
  const cycle = PAIRS.length * STEP + HOLD;
  const c = reduce ? cycle : t % cycle;
  const progress = (i: number) => clamp01((c - i * STEP) / (STEP * 0.8));
  const done = PAIRS.filter((_, i) => progress(i) >= 1).length;
  return (
    <figure ref={ref} className="rp-plate p-4 sm:p-6">
      <Plate
        n={1}
        title="Nine bills, nine repos"
        sub="paid app → the open-source version on GitHub"
        right={
          <span className="block font-mono text-[11px] leading-tight text-[var(--muted)]">
            <span className="block"><span className="text-[14px] font-semibold tabular-nums text-[var(--ink)]">{PAIRS.length - done}</span> paid</span>
            <span className="block"><span className="text-[14px] font-semibold tabular-nums text-[var(--accent)]">{done}</span> free</span>
          </span>
        }
      />
      <ol className="space-y-1.5" aria-label="Nine paid apps and the free repo for each">
        {PAIRS.map((p, i) => {
          const k = ease(progress(i));
          const on = k > 0 && k < 1;
          const free = k >= 1;
          return (
            <li key={p.id} className="grid grid-cols-[minmax(0,34%)_minmax(0,1fr)_minmax(0,46%)] items-center gap-1.5 sm:grid-cols-[minmax(0,30%)_minmax(0,1fr)_minmax(0,48%)]">
              <span className="rp-card flex items-center justify-between gap-1.5 px-2 py-1.5 transition-opacity duration-300" style={{ opacity: free ? 0.5 : 1 }}>
                <span className={`truncate text-[12.5px] text-[var(--ink)] sm:text-[13px] ${free ? "line-through decoration-[var(--muted)]" : ""}`}>{p.paid}</span>
                <span className="hidden sm:inline"><Tag free={false} /></span>
              </span>
              <span className="relative block h-2.5" aria-hidden>
                <span className="absolute inset-x-0 top-1/2 border-t border-dashed border-[var(--rule-strong)]" />
                <span
                  className="absolute left-0 top-1/2 h-[1.5px] -translate-y-1/2"
                  style={{ width: `${100 * k}%`, background: free ? "var(--ink)" : "var(--accent)", opacity: free ? 0.55 : 1 }}
                />
                {on && <span className="rp-dot absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" style={{ left: `${100 * k}%` }} />}
              </span>
              <span
                className="rp-card flex min-w-0 items-center justify-between gap-1.5 px-2 py-1.5 transition-[border-color,opacity] duration-300"
                style={{ borderColor: on || free ? (on ? "var(--accent)" : "var(--rule-strong)") : "var(--rule)", opacity: k > 0 ? 1 : 0.45 }}
              >
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium text-[var(--ink)] sm:text-[13px]">{p.name}</span>
                  <span className="hidden truncate font-mono text-[10px] text-[var(--muted)] sm:block">{p.repo}</span>
                </span>
                <span className="shrink-0 text-right">
                  {free ? <Tag free /> : <span className="font-mono text-[10px] text-[var(--muted)]">{on ? "…" : ""}</span>}
                  <span className="block font-mono text-[10px] tabular-nums text-[var(--muted)]">★ {fmtK(p.stars)}</span>
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 min-h-[20px] text-center font-mono text-[11.5px] text-[var(--soft)]">
        {done === PAIRS.length ? "Nine apps. Nine repos you can run yourself." : `${PAIRS[Math.min(done, PAIRS.length - 1)].category}: ${PAIRS[Math.min(done, PAIRS.length - 1)].paid} → ${PAIRS[Math.min(done, PAIRS.length - 1)].name}`}
      </p>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Each line traces a paid app to an open-source project on GitHub that does the same job. ★ = GitHub stars on {STARS_AS_OF}.
      </figcaption>
    </figure>
  );
}

/* ───────────── 02 picker: tick what you pay for, its card flips from PAID to FREE ───────────── */
function Picker() {
  const reduce = useReducedMotion();
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) =>
    setPicked((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const all = picked.size === PAIRS.length;
  const starsK = PAIRS.filter((p) => picked.has(p.id)).reduce((a, p) => a + p.stars, 0);
  return (
    <figure className="rp-plate p-4 sm:p-6">
      <Plate n={2} title="What do you pay for?" sub="tap an app, or a card, to flip it" />
      <div role="group" aria-label="Apps you pay for" className="flex flex-wrap gap-1.5">
        {PAIRS.map((p) => {
          const on = picked.has(p.id);
          return (
            <button
              key={p.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(p.id)}
              className={`rp-press rounded-full border px-2.5 py-1 text-[12.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${on ? "border-[var(--accent)] bg-[#fff7f3] text-[var(--ink)]" : "border-[var(--rule)] bg-white text-[var(--soft)] hover:text-[var(--ink)]"}`}
            >
              {on ? "✓ " : ""}
              {p.paid}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button primary onClick={() => setPicked(all ? new Set() : new Set(PAIRS.map((p) => p.id)))}>{all ? "Flip all back" : "Flip all 9"}</Button>
        <span className="font-mono text-[11.5px] text-[var(--soft)]" aria-live="polite">
          {picked.size === 0 ? "Nothing picked yet." : `${picked.size} of 9 swapped · ${fmtK(starsK)} stars of free code`}
        </span>
      </div>
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {PAIRS.map((p) => (
          <FlipCard key={p.id} p={p} free={picked.has(p.id)} onFlip={() => toggle(p.id)} reduce={!!reduce} />
        ))}
      </ul>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-[var(--soft)]">
        Every card links to its repository. ★ = GitHub stars and licence as GitHub shows them; stars as of {STARS_AS_OF}. Notes under a card are from that project&apos;s own README.
      </figcaption>
    </figure>
  );
}

function FlipCard({ p, free, onFlip, reduce }: { p: Pair; free: boolean; onFlip: () => void; reduce: boolean }) {
  return (
    <li data-repo-card={p.id} className="rp-flip" style={{ perspective: 900 }}>
      <div className="rp-flip-inner" style={{ transform: free ? "rotateY(180deg)" : "none", transition: reduce ? "none" : undefined }}>
        {/* PAID face */}
        <button
          type="button"
          onClick={onFlip}
          aria-hidden={free}
          tabIndex={free ? -1 : 0}
          style={{ pointerEvents: free ? "none" : undefined }}
          aria-label={`${p.paid}: show the free version`}
          className="rp-face rp-card flex flex-col items-start justify-between p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <span className="flex w-full items-center justify-between">
            <Tag free={false} />
            <span className="font-mono text-[10px] text-[var(--muted)]">{p.category}</span>
          </span>
          <span className="mt-3 block text-[17px] font-semibold text-[var(--ink)]">{p.paid}</span>
          <span className="mt-auto pt-3 font-mono text-[10.5px] text-[var(--muted)]">tap to see the free repo ↻</span>
        </button>
        {/* FREE face */}
        <div className="rp-face rp-back rp-card flex flex-col p-3" style={{ borderColor: "var(--accent)", pointerEvents: free ? undefined : "none" }} aria-hidden={!free} inert={!free}>
          <span className="flex w-full items-center justify-between gap-2">
            <Tag free />
            <button type="button" onClick={onFlip} className="min-w-0 truncate whitespace-nowrap font-mono text-[10px] text-[var(--muted)] hover:text-[var(--ink)]" aria-label={`Flip ${p.name} back to ${p.paid}`}>
              ↺ {p.paid}
            </button>
          </span>
          <a href={gh(p.repo)} target="_blank" rel="noopener noreferrer" className="group mt-2 block">
            <span className="block text-[15px] font-semibold text-[var(--ink)] group-hover:underline">{p.name} ↗</span>
            <span className="block break-all font-mono text-[10.5px] text-[var(--muted)]">github.com/{p.repo}</span>
          </a>
          <span className="mt-1.5 flex flex-wrap gap-1 font-mono text-[10.5px]">
            <span className="rounded-md border border-[var(--rule)] px-1.5 py-px tabular-nums text-[var(--ink)]">★ {fmtK(p.stars)}</span>
            <span className="rounded-md border border-[var(--rule)] px-1.5 py-px text-[var(--soft)]">{p.licence}</span>
          </span>
          <span className="mt-2 block text-[12.5px] leading-snug text-[var(--soft)]">{p.does}</span>
          {p.note ? <span className="mt-1.5 block border-t border-dashed border-[var(--rule)] pt-1.5 text-[11.5px] leading-snug text-[var(--muted)]">Note: {p.note}</span> : null}
        </div>
      </div>
    </li>
  );
}

const RP_CSS = `
.rp{--page:#f3f4f1;--ink:#15171a;--soft:#4a4f56;--muted:#868b92;--rule:#dcded9;--rule-strong:#c4c7c2;--accent:#d77757}
.rp-plate{border-radius:18px;background-color:var(--page);background-image:linear-gradient(to right,rgba(21,23,26,.045) 1px,transparent 1px),linear-gradient(to bottom,rgba(21,23,26,.045) 1px,transparent 1px);background-size:28px 28px;box-shadow:0 0 0 1px var(--rule),0 30px 70px -48px rgba(21,23,26,.45)}
.rp-card{border-radius:12px;border:1px solid var(--rule);background:#fff}
.rp-press{transition:transform .45s cubic-bezier(.34,1.56,.64,1),border-color .2s,color .2s,background-color .2s}
.rp-press:active{transform:scale(.97)}
.rp-flip{display:flex}
.rp-flip-inner{flex:1;display:grid;grid-template:1fr/1fr;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.34,1.3,.64,1)}
.rp-face{grid-area:1/1;min-height:150px;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.rp-back{transform:rotateY(180deg)}
@keyframes rp-dot{50%{opacity:.45}}
.rp-dot{animation:rp-dot .5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.rp-dot{animation:none}.rp-flip-inner{transition:none}}
`;

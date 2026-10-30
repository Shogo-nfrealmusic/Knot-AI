"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { follow, throughCentre } from "./scroll";

// "What you get", told on real devices (Artboard Studio mockups, exported once as small WebP stills). Each scene
// pins while you scroll through it, and the scroll drives what happens on the screen, so nothing has played out
// before you arrive. Screen content is live HTML laid into the screen rectangle measured from the export, sized in
// container units so it stays sharp at any width.

/** Scroll progress (0–1) through a tall track whose child is sticky. Eased, and idle while off screen. */
function useTrack<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const device = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(id);
    }
    const wide = matchMedia("(min-width: 1024px)");
    let frame = 0;
    let eased = 0;
    let last = performance.now();
    let sent = -1;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = now - last;
      last = now;
      const box = el.getBoundingClientRect();
      if (box.bottom < -innerHeight || box.top > innerHeight * 2) return;
      // Large screens pin the scene: it plays over the first 80% of the pinned scroll and holds for the rest.
      // Phones scroll straight past, so the device itself is measured: it starts as the device comes up from the
      // bottom of the screen and is finished as it passes the centre.
      const d = device.current?.getBoundingClientRect();
      const target =
        wide.matches || !d ? Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - innerHeight)) / 0.8) : throughCentre(d, innerHeight);
      eased = follow(eased, target, dt);
      // Re-render only when the picture would actually change.
      if (Math.abs(eased - sent) > 0.002 || (eased !== sent && (eased === 0 || eased === 1))) {
        sent = eased;
        setP(eased);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  return [ref, p, device] as const;
}

const span = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)));

type Screen = { left: number; top: number; width: number; height: number; radius: string };
const DEVICES = {
  mac: { src: "/setup/mac.webp", aspect: "3186 / 1896", screen: { left: 14.94, top: 8.175, width: 70.151, height: 75.844, radius: "0.6cqw" } },
  phone: { src: "/setup/phone.webp", aspect: "1180 / 2300", screen: { left: 8.814, top: 4.217, width: 82.288, height: 91.522, radius: "13cqw" } },
  watch: { src: "/setup/watch.webp", aspect: "1460 / 2322", screen: { left: 11.233, top: 22.524, width: 73.219, height: 54.823, radius: "22cqw" } },
} satisfies Record<string, { src: string; aspect: string; screen: Screen }>;

function Device({ kind, className, children }: { kind: keyof typeof DEVICES; className?: string; children: React.ReactNode }) {
  const d = DEVICES[kind];
  return (
    <div className={cn("relative", className)} style={{ aspectRatio: d.aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={d.src} alt="" className="absolute inset-0 size-full mix-blend-multiply" />
      <div
        className="absolute overflow-hidden"
        style={{ left: `${d.screen.left}%`, top: `${d.screen.top}%`, width: `${d.screen.width}%`, height: `${d.screen.height}%`, borderRadius: d.screen.radius, containerType: "inline-size" }}
      >
        {children}
      </div>
    </div>
  );
}

function Copy({ kicker, title, accent, text, points }: { kicker: string; title: string; accent: string; text: string; points: string[] }) {
  return (
    <div className="max-w-[420px] max-lg:mx-auto max-lg:text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">{kicker}</p>
      <h3 className="mt-4 text-balance text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
        {title} <span className="font-serif font-normal italic tracking-[-0.01em] text-neutral-500">{accent}</span>
      </h3>
      <p className="mt-4 text-pretty text-[15px] leading-[1.7] text-neutral-600 sm:text-[16px]">{text}</p>
      <ul className="mt-5 hidden space-y-2.5 border-t border-neutral-200 pt-5 sm:block">
        {points.map((x) => (
          <li key={x} className="flex gap-3 text-[14px] text-neutral-700">
            <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[var(--warm)]" />
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── 1. MacBook: the interview writes CLAUDE.md ────────────────────
const QA = [
  { q: "What's the one number that matters this year?", a: "Revenue. $30k a month by June.", line: ["goal", "$30k a month by June"] },
  { q: "When should I push back on you?", a: "When I start chasing a new tool.", line: ["push_back_when", "I chase a shiny new tool"] },
  { q: "What should I never do without asking?", a: "Email a customer.", line: ["never", "email a customer unasked"] },
  { q: "How do you like reports?", a: "One page, numbers first, Mondays.", line: ["report", "Mondays, one page, numbers first"] },
];
function Interview({ p }: { p: number }) {
  const at = (i: number) => 0.06 + i * 0.2;
  return (
    <div className="flex size-full flex-col bg-[#141413] text-left font-mono text-[1.75cqw] leading-[1.5] @max-[520px]:text-[2.3cqw] text-[#ECEAE4]">
      <div className="relative flex h-[5.2cqw] shrink-0 items-center gap-[0.8cqw] border-b border-white/10 bg-[#1F1E1D] px-[1.6cqw] text-[1.25cqw] text-white/45">
        <span className="size-[0.95cqw] rounded-full bg-[#ff5f57]" />
        <span className="size-[0.95cqw] rounded-full bg-[#febc2e]" />
        <span className="size-[0.95cqw] rounded-full bg-[#28c840]" />
        <span className="ml-[1.2cqw]">~/business — claude</span>
        {/* The camera notch sits over the menu bar, as on the real screen. */}
        <span className="absolute left-1/2 top-0 h-[2.7cqw] w-[10.6cqw] -translate-x-1/2 rounded-b-[0.8cqw] bg-black" />
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1.25fr_1fr]">
        <div className="space-y-[1.3cqw] overflow-hidden p-[2.2cqw]">
          <p className="text-white/45">
            <span className="text-[#D97757]">✻</span> Let&apos;s set you up. Four questions.
          </p>
          {QA.map((x, i) => {
            const q = span(p, at(i), at(i) + 0.05);
            const a = span(p, at(i) + 0.06, at(i) + 0.12);
            return (
              <div key={x.q} style={{ opacity: q, transform: `translateY(${(1 - q) * 0.8}cqw)` }}>
                <p className="text-[#ECEAE4]">
                  <span className="text-[#D97757]">?</span> {x.q}
                </p>
                <p className="text-[#7CCB8F]" style={{ opacity: a }}>
                  › {x.a}
                </p>
              </div>
            );
          })}
        </div>
        <div className="border-l border-white/10 bg-[#191918] p-[2.2cqw]">
          <p className="text-[1.2cqw] text-white/35">CLAUDE.md</p>
          <p className="mt-[1.4cqw] text-white/35"># What matters</p>
          <div className="mt-[0.8cqw] space-y-[0.9cqw]">
            {QA.map((x, i) => {
              const k = span(p, at(i) + 0.1, at(i) + 0.19);
              const n = Math.round(x.line[1].length * k);
              return (
                <p key={x.line[0]} style={{ opacity: k > 0 ? 1 : 0.18 }}>
                  <span className="text-[#7CCB8F]">{x.line[0]}:</span> {x.line[1].slice(0, n)}
                  {k > 0 && k < 1 ? <span className="text-[#D97757]">▌</span> : null}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. iPhone: the checker's notifications ────────────────────────
const NOTES = [
  { title: "Invoices chased", body: "Two reminders sent, worded the way you asked.", back: "" },
  { title: "Expense filed", body: "Oct 18 client lunch → Software", back: "Meals" },
  { title: "Reply drafted", body: "Thursday's call moved to 4pm. Waiting for you to send.", back: "" },
  { title: "Monday report", body: "One page, numbers first. Ready at 8:00.", back: "" },
];
function Notifications({ p }: { p: number }) {
  return (
    <div className="relative size-full bg-[#0c0c0d] text-white">
      <span className="absolute left-1/2 top-0 h-[7.5cqw] w-[44cqw] -translate-x-1/2 rounded-b-[5cqw] bg-black" />
      <div className="pt-[17cqw] text-center">
        <p className="text-[4.4cqw] font-medium text-white/70">Friday, October 30</p>
        <p className="text-[22cqw] font-semibold leading-none tracking-[-0.03em]">7:30</p>
      </div>
      <div className="mt-[7cqw] space-y-[2.6cqw] px-[4cqw]">
        {NOTES.map((n, i) => {
          const s = 0.08 + i * 0.17;
          const v = span(p, s, s + 0.07);
          const flagged = n.back && p > s + 0.09 && p < s + 0.22;
          const fixed = n.back && p >= s + 0.22;
          return (
            <div
              key={n.title}
              className="rounded-[5.5cqw] px-[4.2cqw] py-[3.2cqw]"
              style={{
                opacity: v,
                transform: `translateY(${(1 - v) * -6}cqw) scale(${0.94 + 0.06 * v})`,
                background: flagged ? "rgba(220,38,38,.22)" : "rgba(255,255,255,.13)",
                boxShadow: flagged ? "inset 0 0 0 1px rgba(248,113,113,.55)" : "inset 0 0 0 1px rgba(255,255,255,.06)",
                transition: "background .4s, box-shadow .4s",
              }}
            >
              <div className="flex items-center gap-[2cqw] text-[3.3cqw] text-white/60">
                <span className="flex size-[5.4cqw] items-center justify-center rounded-[1.4cqw] bg-[#D97757] text-[3.6cqw] text-white">✻</span>
                Claude Code
                <span className="ml-auto">now</span>
              </div>
              <p className="mt-[1.4cqw] text-[4.1cqw] font-semibold">{n.title}</p>
              <p className="text-[3.7cqw] leading-snug text-white/75">
                {fixed ? n.body.replace("Software", n.back) : n.body}
              </p>
              <p className="mt-[1cqw] text-[3.2cqw] font-medium" style={{ color: flagged ? "#fca5a5" : "#86efac" }}>
                {flagged ? "Sent back by the checker: wrong account" : fixed ? "Fixed and checked" : "Checked"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. Apple Watch: the schedule goes round ───────────────────────
const JOBS = [
  { h: 2, label: "Leads researched" },
  { h: 6.5, label: "Inbox sorted" },
  { h: 7.5, label: "Morning brief" },
  { h: 12, label: "Invoices chased" },
  { h: 18, label: "Books drafted" },
  { h: 22, label: "Decisions logged" },
];
function WatchFace({ p }: { p: number }) {
  const hour = Math.min(23.99, span(p, 0.05, 0.9) * 24);
  const done = JOBS.filter((j) => hour >= j.h);
  const last = done[done.length - 1];
  const R = 40;
  const C = 2 * Math.PI * R;
  const a = (h: number) => (h / 24) * Math.PI * 2 - Math.PI / 2;
  return (
    <div className="flex size-full flex-col items-center justify-center bg-black text-white">
      <svg viewBox="-50 -50 100 100" className="w-[86cqw]">
        <circle r={R} fill="none" stroke="#2a1a14" strokeWidth="7" />
        <circle r={R} fill="none" stroke="#FA5A2B" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${(hour / 24) * C} ${C}`} transform="rotate(-90)" />
        {JOBS.map((j) => (
          <circle key={j.label} cx={Math.cos(a(j.h)) * R} cy={Math.sin(a(j.h)) * R} r={hour >= j.h ? 1.7 : 1.3} fill={hour >= j.h ? "#fff" : "#6b4a3e"} />
        ))}
        <text y="-6" textAnchor="middle" fontSize="15" fontWeight="600" fill="#fff" style={{ fontVariantNumeric: "tabular-nums" }}>
          {String(Math.floor(hour)).padStart(2, "0")}:{String(Math.floor((hour % 1) * 60)).padStart(2, "0")}
        </text>
        <text y="8" textAnchor="middle" fontSize="5.4" fill="#FA5A2B">
          {last ? `${last.label} ✓` : "Waiting for 02:00"}
        </text>
        <text y="17" textAnchor="middle" fontSize="4.6" fill="#8E8B82">
          {done.length} of {JOBS.length} jobs done
        </text>
      </svg>
    </div>
  );
}

function Scene({ flip, stack, device, copy, track = "lg:h-[190vh]" }: { flip?: boolean; stack?: boolean; device: (p: number) => React.ReactNode; copy: React.ReactNode; track?: string }) {
  const [ref, p, deviceRef] = useTrack<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("relative", track)}>
      <div className="flex items-center overflow-hidden py-14 lg:sticky lg:top-0 lg:h-screen lg:py-0">
        <div className={cn("grid w-full grid-cols-[minmax(0,1fr)] items-center gap-6 px-4 sm:px-10", stack ? "justify-items-center gap-8 text-center lg:pt-14 [&_ul]:hidden" : "lg:grid-cols-[1fr_1.2fr] lg:gap-14")}>
          <div className={cn(flip && "lg:order-2")}>
            {copy}
          </div>
          <div ref={deviceRef} className="flex w-full justify-center will-change-transform" style={{ transform: `translateY(${(1 - span(p, 0, 0.1)) * 40}px) scale(${0.96 + span(p, 0, 0.1) * 0.04})` }}>
            {device(p)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Scenes() {
  return (
    <div>
      <Scene
        stack
        device={(p) => (
          <Device kind="mac" className="w-full max-w-[min(980px,100%,calc((100vh_-_320px)*1.68))] max-sm:w-[100vw] max-sm:max-w-none max-sm:shrink-0">
            <Interview p={p} />
          </Device>
        )}
        copy={
          <Copy
            kicker="Week one"
            title="It interviews you,"
            accent="then writes the rules."
            text="Fifteen minutes of questions becomes a CLAUDE.md: your goal, your priorities, what it must never do, and when to push back."
            points={["Your goals and numbers", "What needs your yes", "How you like to hear back"]}
          />
        }
      />
      <Scene
        flip
        device={(p) => (
          <Device kind="phone" className="h-[min(78vh,640px)] max-sm:h-[52vh]">
            <Notifications p={p} />
          </Device>
        )}
        copy={
          <Copy
            kicker="Every job"
            title="One agent does."
            accent="Another checks."
            text="Nothing reaches you until a second agent has reviewed it against your rules. Mistakes get sent back, not shipped."
            points={["Checked against CLAUDE.md", "Sent back with the reason", "You only see what passed"]}
          />
        }
      />
      <Scene
        device={(p) => (
          <Device kind="watch" className="h-[min(74vh,600px)] max-sm:h-[46vh]">
            <WatchFace p={p} />
          </Device>
        )}
        copy={
          <Copy
            kicker="Around the clock"
            title="It keeps"
            accent="its own schedule."
            text="Each job runs at the hour it should, on your machine, while you sleep, train or take the day off."
            points={["Nightly, daily, weekly, monthly", "Runs without you opening anything", "A summary waiting each morning"]}
          />
        }
      />
    </div>
  );
}

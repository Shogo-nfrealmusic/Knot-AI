"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { follow } from "./scroll";

// The hero story: the page pins an iPhone Duo (Artboard Studio mockup, commercial licence) while you scroll
// through eight chapters — folded lock screen, the back, unfolding, then six things Copilot OS does.
// Desktop scrubs one 19 s render with the scroll (encoded all-keyframe, so seeking is instant).
// Phones and tablets play it instead: iOS Safari will not paint a paused video it is seeking, so each chapter
// plays forward on its own when you scroll into it and stops at its end, the way Apple's product pages do it on
// phones. Scrolling back shows the end of the earlier chapter. The phone file is cropped closer to the Duo,
// 900 px wide and under 1 MB.
const DURATION = 19;
const CHAPTERS = [
  { t: [0, 0.9], kicker: "7:30 a.m.", title: "Three jobs already done.", text: "While you slept, the schedule ran and every result was checked." },
  { t: [0.9, 2.3], kicker: "Under the hood", title: "Claude Code, on your machine.", text: "No new app. Your files, your tools, your rules." },
  { t: [2.3, 6], kicker: "The schedule", title: "It reads your goals, then gets to work.", text: "CLAUDE.md tells it what matters. A second agent checks each job." },
  { t: [6, 8.5], kicker: "The brief", title: "You wake up to one page.", text: "What got done, what was checked, and the one decision left for you." },
  { t: [8.5, 11], kicker: "The books", title: "Drafted, then corrected.", text: "Three entries filed under the wrong account. Sent back and fixed before you saw them." },
  { t: [11, 13.5], kicker: "The pipeline", title: "Ten leads by morning.", text: "Researched overnight and scored for fit. The best three ready for you." },
  { t: [13.5, 16], kicker: "The inbox", title: "Sorted before coffee.", text: "Replies drafted, receipts logged, newsletters gone. Only one email needs you." },
  { t: [16, 19], kicker: "The record", title: "Every decision, written down.", text: "What you chose, why, and what you turned down. Searchable forever." },
] as const;

const N = CHAPTERS.length;

/** Scroll progress (0–1) → video time, with each chapter taking an equal share of the scroll. */
function timeAt(progress: number) {
  const x = Math.min(N - 1e-6, Math.max(0, progress * N));
  const i = Math.floor(x);
  const [a, b] = CHAPTERS[i]!.t;
  return a + (b - a) * (x - i);
}

export default function DuoScroll() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [chapter, setChapter] = useState(0);
  const [mode, setMode] = useState<"scrub" | "play" | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMode(matchMedia("(max-width: 1023px), (pointer: coarse)").matches ? "play" : "scrub"));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = section.current;
    const v = video.current;
    if (!el || !v || !mode) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let shown = -1;
    let current = 0;
    let stopAt = 0;

    // Phones: play one chapter forward, or show the end of the chapter you scrolled back to.
    const enter = (c: number, from: number) => {
      const [a, b] = CHAPTERS[c]!.t;
      if (reduced || c < from) {
        v.pause();
        v.currentTime = b - 0.05;
        return;
      }
      if (Math.abs(v.currentTime - a) > 0.12) v.currentTime = a;
      stopAt = b;
      v.play().catch(() => {
        v.currentTime = b - 0.05;
      });
    };

    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      frame = requestAnimationFrame(tick);
      if (mode === "play" && !v.paused && v.currentTime >= stopAt - 0.02) v.pause();
      const box = el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const progress = Math.min(1, Math.max(0, -box.top / (box.height - innerHeight)));
      if (mode === "scrub") {
        current = follow(current, timeAt(progress), dt, 80);
        if (Math.abs(v.currentTime - current) > 1 / 60 && v.readyState >= 1) v.currentTime = Math.min(DURATION - 0.05, current);
      }
      const c = Math.min(N - 1, Math.floor(progress * N));
      // The first chapter waits until the Duo is pinned in view, not while the page is still at the top.
      if (c !== shown && (c > 0 || box.top <= 1 || shown > 0)) {
        if (mode === "play") enter(c, shown);
        shown = c;
        setChapter(c);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [mode]);

  return (
    <section
      ref={section}
      className="relative h-[var(--duo-h)] lg:h-[var(--duo-h-lg)]"
      style={{ "--duo-h": `${N * 50 + 60}vh`, "--duo-h-lg": `${N * 90 + 60}vh` } as React.CSSProperties}
      aria-label="What Copilot OS does in a day"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative w-full max-w-[1180px]">
          <video
            ref={video}
            src={mode === "play" ? "/setup/duo-story-m.mp4" : mode === "scrub" ? "/setup/duo-story.mp4" : undefined}
            poster={mode === "scrub" ? "/setup/duo-story-start.jpg" : "/setup/duo-story-m.jpg"}
            muted
            playsInline
            preload="auto"
            aria-hidden
            className="mx-auto h-auto max-h-[60svh] w-full max-w-[640px] object-contain lg:max-h-[62vh] lg:w-auto lg:max-w-full"
          />
        </div>

        <div className="pointer-events-none relative mt-4 h-[150px] w-full max-w-[640px] text-center">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.title}
              className="absolute inset-x-0 top-0 transition-[opacity,transform] duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
              style={{ opacity: i === chapter ? 1 : 0, transform: `translateY(${i === chapter ? 0 : i < chapter ? -12 : 12}px)` }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">{c.kicker}</p>
              <p className="mt-2 text-balance text-[clamp(22px,3vw,36px)] font-medium leading-tight tracking-[-0.03em] text-neutral-900">{c.title}</p>
              <p className="mx-auto mt-2 max-w-[48ch] text-pretty text-[15px] leading-relaxed text-neutral-500">{c.text}</p>
            </div>
          ))}
        </div>

        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2 md:flex" aria-hidden>
          {CHAPTERS.map((c, i) => (
            <span key={c.kicker} className={cn("h-6 w-[3px] rounded-full transition-colors duration-500", i <= chapter ? "bg-[var(--warm)]" : "bg-neutral-200")} />
          ))}
        </div>
      </div>
    </section>
  );
}

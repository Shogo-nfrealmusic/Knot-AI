"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// The hero story, driven by scroll: the page pins an iPhone Duo (Artboard Studio mockup, commercial licence) and
// scrubs one 19 s render as you scroll — folded lock screen, the back, unfolding, then six things Copilot OS does,
// each with its own caption. Every chapter gets the same scroll length, so the quick fold-and-turn at the start
// is as easy to read as the long scenes. The video is encoded all-keyframe so seeking is instant.
const DURATION = 19;
const CHAPTERS = [
  { t: [0, 0.9], kicker: "7:30 a.m.", title: "Three jobs already done.", text: "While you slept, the schedule ran and every result was checked." },
  { t: [0.9, 2.3], kicker: "Under the hood", title: "Claude Code, on your machine.", text: "No new app. Your files, your tools, your rules." },
  { t: [2.3, 6], kicker: "The schedule", title: "It reads your goals, then gets to work.", text: "CLAUDE.md tells it what matters. A second agent checks each job." },
  { t: [6, 8.5], kicker: "The brief", title: "You wake up to one page.", text: "What got done, what was checked, and the one decision left for you." },
  { t: [8.5, 11], kicker: "The books", title: "Drafted, then corrected.", text: "Three entries filed under the wrong account. Sent back and fixed before you saw them." },
  { t: [11, 13.5], kicker: "The content", title: "Ten videos by morning.", text: "Rendered overnight. The best three picked for posting." },
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
  const [still, setStill] = useState(false);

  useEffect(() => {
    const el = section.current;
    const v = video.current;
    if (!el || !v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setStill(true));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    let shown = 0;
    let current = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const box = el.getBoundingClientRect();
      const span = box.height - innerHeight;
      if (box.bottom < 0 || box.top > innerHeight) return;
      const progress = Math.min(1, Math.max(0, -box.top / span));
      const target = timeAt(progress);
      current += (target - current) * 0.18;
      if (Math.abs(v.currentTime - current) > 1 / 60 && v.readyState >= 1) v.currentTime = Math.min(DURATION - 0.05, current);
      const c = Math.min(N - 1, Math.floor(progress * N));
      if (c !== shown) {
        shown = c;
        setChapter(c);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section ref={section} className="relative" style={{ height: `${N * 90 + 60}vh` }} aria-label="What Copilot OS does in a day">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative w-full max-w-[1180px]">
          <video
            ref={video}
            src="/setup/duo-story.mp4"
            poster="/setup/duo-story-start.jpg"
            muted
            playsInline
            preload="auto"
            aria-hidden
            className={cn("h-auto w-full mix-blend-multiply", still && "hidden")}
          />
          {still ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/setup/duo-story-open.jpg" alt="" className="h-auto w-full mix-blend-multiply" />
          ) : null}
        </div>

        <div className="pointer-events-none relative mt-[-2vh] h-[132px] w-full max-w-[640px] text-center">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.title}
              className="absolute inset-x-0 top-0 transition-[opacity,transform,filter] duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: i === chapter ? 1 : 0,
                transform: `translateY(${i === chapter ? 0 : i < chapter ? -14 : 14}px)`,
                filter: i === chapter ? "none" : "blur(6px)",
              }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">{c.kicker}</p>
              <p className="mt-2 text-balance text-[clamp(24px,3vw,36px)] font-medium leading-tight tracking-[-0.03em] text-neutral-900">{c.title}</p>
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

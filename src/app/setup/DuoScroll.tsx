"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// The hero story, driven by scroll: the page pins an iPhone Duo (Artboard Studio mockup, commercial licence) and
// scrubs one 19 s render as you scroll — folded lock screen, the back, unfolding, then six things Copilot OS does,
// each with its own caption. Every chapter gets the same scroll length, so the quick fold-and-turn at the start
// is as easy to read as the long scenes. The video is encoded all-keyframe so seeking is instant.
// Phones and tablets get 16 stills cut from the same render (public/setup/duo/NN.webp, ~150 KB in all) and
// crossfade between them: iOS Safari will not paint a paused video it is seeking, and the 7 MB file is too much
// on a phone anyway.
const DURATION = 19;
const FRAMES = 16;
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
  const stills = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(0);
  const [mode, setMode] = useState<"video" | "stills">("stills");

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = matchMedia("(max-width: 1023px), (pointer: coarse)").matches;
    const useStills = reduced || phone;
    const id = requestAnimationFrame(() => setMode(useStills ? "stills" : "video"));
    let frame = 0;
    let shown = 0;
    let current = 0;
    let eased = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const box = el.getBoundingClientRect();
      if (box.bottom < 0 || box.top > innerHeight) return;
      const progress = Math.min(1, Math.max(0, -box.top / (box.height - innerHeight)));
      if (useStills) {
        // Crossfade the two stills either side of where the scroll is.
        eased += (progress - eased) * 0.2;
        const imgs = stills.current?.children;
        if (imgs) {
          const x = Math.min(FRAMES - 1, Math.max(0, eased * FRAMES - 0.5));
          const i = Math.floor(x);
          const f = x - i;
          for (let k = 0; k < imgs.length; k++) (imgs[k] as HTMLElement).style.opacity = String(k === i ? 1 : k === i + 1 ? f : 0);
        }
      } else {
        const v = video.current;
        current += (timeAt(progress) - current) * 0.18;
        if (v && Math.abs(v.currentTime - current) > 1 / 60 && v.readyState >= 1) v.currentTime = Math.min(DURATION - 0.05, current);
      }
      const c = Math.min(N - 1, Math.floor(progress * N));
      if (c !== shown) {
        shown = c;
        setChapter(c);
      }
    };
    if (!reduced) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={section}
      className="relative h-[var(--duo-h)] lg:h-[var(--duo-h-lg)]"
      style={{ "--duo-h": `${N * 55 + 60}vh`, "--duo-h-lg": `${N * 90 + 60}vh` } as React.CSSProperties}
      aria-label="What Copilot OS does in a day"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden px-4">
        <div className="relative w-full max-w-[1180px]">
          {mode === "video" ? (
            <video
              ref={video}
              src="/setup/duo-story.mp4"
              poster="/setup/duo-story-start.jpg"
              muted
              playsInline
              preload="auto"
              aria-hidden
              className="mx-auto h-auto max-h-[62vh] w-auto max-w-full"
            />
          ) : (
            <div ref={stills} className="relative mx-auto aspect-[16/9] w-full max-w-[min(100%,110vh)]" aria-hidden>
              {Array.from({ length: FRAMES }, (_, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={k}
                  src={`/setup/duo/${String(k).padStart(2, "0")}.webp`}
                  alt=""
                  decoding="async"
                  className="absolute inset-0 size-full object-contain"
                  style={{ opacity: k === 0 ? 1 : 0 }}
                />
              ))}
            </div>
          )}
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

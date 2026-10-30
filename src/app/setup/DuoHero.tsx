"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// The hero story on an iPhone Duo (Artboard Studio mockup, commercial licence). Nothing here is tied to scroll
// speed: when the Duo comes into view it plays the opening once (folded lock screen, the back, unfolding, the
// schedule running), then steps through five things Copilot OS does (brief, calendar, pipeline, inbox, decisions), one tab at a time, the way Apple's feature
// galleries do. Each tab plays its part of the same 19 s render and holds on the result before moving on; tapping
// a tab jumps there. It pauses while off screen. Phones get a file cropped closer to the Duo (900 px, ~0.9 MB);
// larger screens get a 1440 px one (~1.5 MB).
const INTRO = { t: [0, 6], kicker: "Overnight", title: "Claude Code ran the schedule.", text: "It read your goals, did three jobs, and had a second agent check each one." } as const;
const TABS = [
  { t: [6, 8.5], label: "Brief", kicker: "The brief", title: "You wake up to one page.", text: "What got done, what was checked, and the one decision left for you." },
  { t: [8.5, 11], label: "Calendar", kicker: "The calendar", title: "Booked without the back-and-forth.", text: "Requests answered and slotted in. A clash with your dentist caught, moved, and a new invite sent." },
  { t: [11, 13.5], label: "Pipeline", kicker: "The pipeline", title: "Every lead, followed through.", text: "Visitors to leads to calls to clients, counted every week. The three worth a reply today already have one drafted." },
  { t: [13.5, 16], label: "Inbox", kicker: "The inbox", title: "Sorted before coffee.", text: "Replies drafted in your voice, receipts filed, newsletters archived. You read, tap send, and only one email needs you." },
  { t: [16, 19], label: "Decisions", kicker: "The record", title: "Every decision, written down.", text: "What you chose, why, and what you turned down. Searchable forever." },
] as const;
const HOLD_MS = 1800; // how long each tab rests on its finished picture

export default function DuoHero() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const jump = useRef<(i: number) => void>(() => {});
  const [src, setSrc] = useState<{ video: string; poster: string } | null>(null);
  const [active, setActive] = useState(-1); // -1 = the opening

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setSrc(
        matchMedia("(max-width: 1023px)").matches
          ? { video: "/setup/duo-story-m.mp4", poster: "/setup/duo-story-m.jpg" }
          : { video: "/setup/duo-story.mp4", poster: "/setup/duo-story-start.jpg" },
      ),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const el = root.current;
    const v = video.current;
    if (!el || !v || !src) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = -1;
    let started = false;
    let visible = false;
    let holdUntil = 0;
    let frame = 0;

    const range = (i: number) => (i < 0 ? INTRO.t : TABS[i]!.t);
    const show = (i: number) => {
      index = i;
      setActive(i);
    };
    const play = (i: number) => {
      show(i);
      holdUntil = 0;
      bars.current.forEach((bar, k) => {
        if (bar && k !== i) bar.style.transform = "scaleX(0)";
      });
      const [a, b] = range(i);
      if (reduced) {
        v.currentTime = b - 0.05;
        return;
      }
      if (Math.abs(v.currentTime - a) > 0.1) v.currentTime = a;
      v.play().catch(() => {
        v.currentTime = b - 0.05;
      });
    };
    jump.current = (i: number) => {
      started = true;
      play(i);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (!started || !visible) return;
      const [a, b] = range(index);
      const t = v.currentTime;
      if (index >= 0) {
        const bar = bars.current[index];
        if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - a) / (b - a)))})`;
      }
      if (!v.paused && t >= b - 0.03) {
        v.pause();
        holdUntil = now + (index < 0 ? 300 : HOLD_MS);
      }
      if (v.paused && holdUntil && now >= holdUntil && !reduced) play((index + 1) % TABS.length);
    };
    frame = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([e]) => {
        visible = Boolean(e?.isIntersecting);
        if (visible && !started) {
          started = true;
          play(reduced ? 0 : -1);
        } else if (!visible) {
          v.pause();
        } else if (v.paused && !holdUntil && !reduced && v.currentTime < range(index)[1] - 0.05) {
          // Back on screen part-way through a tab: carry on from where it stopped.
          v.play().catch(() => {});
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [src]);

  const caption = active < 0 ? INTRO : TABS[active]!;

  return (
    <section ref={root} aria-label="What Copilot OS does in a day" className="flex flex-col items-center px-4 pb-16 pt-4 sm:pb-24">
      <video
        ref={video}
        src={src?.video}
        poster={src?.poster ?? "/setup/duo-story-m.jpg"}
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="h-auto w-full max-w-[640px] lg:max-h-[64vh] lg:w-auto lg:max-w-full"
      />

      <div role="tablist" aria-label="Jobs it does" className="mt-6 flex max-w-full gap-1 overflow-x-auto rounded-full border border-neutral-200 bg-white p-1 shadow-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => jump.current(i)}
            className={cn(
              "relative shrink-0 overflow-hidden rounded-full px-3 py-2 text-[12.5px] font-medium transition-colors duration-300 sm:px-5 sm:text-[13px]",
              active === i ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            {tab.label}
            <span className="absolute inset-x-3 bottom-1 h-[2px] overflow-hidden rounded-full" aria-hidden>
              <span
                ref={(n) => {
                  bars.current[i] = n;
                }}
                className={cn("block h-full origin-left rounded-full", active === i ? "bg-white/70" : "bg-transparent")}
                style={{ transform: "scaleX(0)" }}
              />
            </span>
          </button>
        ))}
      </div>

      <div className="relative mt-6 min-h-[132px] w-full max-w-[600px] text-center" aria-live="polite">
        <div key={caption.title} className="animate-[su-caption_.6s_cubic-bezier(0.16,1,0.3,1)_both]">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">{caption.kicker}</p>
          <p className="mt-2 text-balance text-[clamp(22px,3vw,34px)] font-medium leading-tight tracking-[-0.03em] text-neutral-900">{caption.title}</p>
          <p className="mx-auto mt-2 max-w-[48ch] text-pretty text-[15px] leading-relaxed text-neutral-500">{caption.text}</p>
        </div>
      </div>
    </section>
  );
}

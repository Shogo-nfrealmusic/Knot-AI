"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// Every animated picture on /setup plays the same way: once it is properly on screen it plays through on its own
// time, then stays finished. Nothing follows the scroll, so fast and slow scrollers see the same thing, and
// scrolling back finds the finished picture rather than a half-drawn one.

/** Ease out: quick to start, gentle to land. */
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);

/**
 * Progress 0–1 for a picture that plays once. It starts when `share` of the element is visible and runs for
 * `ms` milliseconds. Reduced motion jumps straight to the finished picture.
 */
export function usePlayOnce<T extends HTMLElement>(ms: number, share = 0.55): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setP(1));
      return () => cancelAnimationFrame(id);
    }
    let frame = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const x = Math.min(1, (now - start) / ms);
          setP(x);
          if (x < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      // Tall pictures on short screens can never be 55% visible, so cap the share at what fits.
      { threshold: Math.min(share, (innerHeight * 0.9) / Math.max(1, el.getBoundingClientRect().height)) },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ms, share]);
  return [ref, p];
}

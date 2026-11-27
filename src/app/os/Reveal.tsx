"use client";

import { useEffect, useRef, useState } from "react";

// Words go from muted to full ink one at a time as they cross a line 60% down the screen.
// Reduced motion: full ink at once (CSS motion-reduce).
export function TaglineReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const spans = el.querySelectorAll<HTMLSpanElement>("[data-w]");
      const line = window.innerHeight * 0.6;
      let n = 0;
      spans.forEach((s) => {
        if (s.getBoundingClientRect().top < line) n += 1;
      });
      setLit((prev) => Math.max(prev, n));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [words.length]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span
          key={i}
          data-w
          className={`transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:!text-[var(--ink)] ${i < lit ? "text-[var(--ink)]" : "text-[rgba(21,23,26,.25)]"}`}
        >
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

// A section rises 32px and fades in once, the first time it enters the screen.
export function Rise({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}

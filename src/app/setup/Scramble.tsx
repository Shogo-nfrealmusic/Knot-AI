"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_.-";

// A label that resolves out of random glyphs, once, when it scrolls into view. Writes the text node directly
// (no re-render per frame). Reduced motion shows the label as is.
export default function Scramble({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const host = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    node.textContent = text.replace(/\S/g, " ");
    let frame = 0;
    let timer = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const fixed = Math.floor(((now - start) / 900) * text.length);
        node.textContent = text
          .split("")
          .map((ch, i) => (ch === " " || i < fixed ? ch : i < fixed + 6 ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]! : " "))
          .join("");
        if (fixed < text.length) frame = requestAnimationFrame(tick);
        else node.textContent = text;
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      timer = window.setTimeout(run, delay);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      node.textContent = text;
    };
  }, [text, delay]);

  return (
    <span aria-label={text} className={className}>
      <span ref={host} aria-hidden>
        {text}
      </span>
    </span>
  );
}

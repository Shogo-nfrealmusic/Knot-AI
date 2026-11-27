"use client";

import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0.22,1,0.36,1)";

function useInView<T extends HTMLElement>(margin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

// Marks a block once it enters the screen. CSS in MOTION_CSS does the rest
// (bars grow, children rise one after another). Reduced motion: shown at once.
export function InView({ children, className = "", as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "ol" | "ul" }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const Tag = as as "div";
  return (
    <Tag ref={ref} data-inview={inView ? "true" : "false"} className={className}>
      {children}
    </Tag>
  );
}

// Counts up to a value once on screen.
export function CountUp({ to, prefix = "", suffix = "", decimals = 0, ms = 1400 }: { to: number; prefix?: string; suffix?: string; decimals?: number; ms?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>("0px");
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setV(to));
      return () => cancelAnimationFrame(id);
    }
    let id = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, to, ms]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export type Scene = { src: string; alt: string; label: string; x: number; y: number; zoom: number };

// The real run, played like a film: each real screen fades in, then the camera pushes in on the line that matters.
// x / y are the focus point in percent of the screenshot. Nothing is drawn; these are the captured screens.
export function RunFilm({ scenes, hold = 4200 }: { scenes: Scene[]; hold?: number }) {
  const [i, setI] = useState(0);
  const [ref, inView] = useInView<HTMLDivElement>("0px");
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % scenes.length), hold);
    return () => window.clearInterval(id);
  }, [inView, hold, scenes.length]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl bg-[#1e1e1e] shadow-[0_40px_80px_-40px_rgba(21,23,26,.8)] ring-1 ring-black/20">
      <div className="relative aspect-[1520/914] w-full">
        {scenes.map((s, n) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1520}
            height={914}
            className="absolute inset-0 h-full w-full"
            style={{
              opacity: n === i ? 1 : 0,
              transformOrigin: `${s.x}% ${s.y}%`,
              transform: n === i && inView ? `scale(${s.zoom})` : "scale(1)",
              transition: `opacity 600ms ${EASE}, transform ${n === i ? hold - 600 : 600}ms ${EASE}`,
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent px-5 pb-4 pt-12">
        <p key={i} className="gd-fade text-sm font-semibold text-white sm:text-base">
          <span className="mr-2 text-[#f0b49f]">{i + 1}/{scenes.length}</span>
          {scenes[i].label}
        </p>
        <div className="mt-3 flex gap-1.5">
          {scenes.map((s, n) => (
            <span key={s.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
              <span
                key={`${n}-${i}`}
                className="block h-full rounded-full bg-white"
                style={{
                  width: n < i ? "100%" : "0%",
                  animation: n === i && inView ? `gd-progress ${hold}ms linear forwards` : undefined,
                }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// A still crop of a real screen, zoomed to the line that matters.
export function Focus({ src, alt, x, y, zoom, aspect = "16/9" }: { src: string; alt: string; x: number; y: number; zoom: number; aspect?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-[#1e1e1e] ring-1 ring-black/10 ${aspect === "auto" ? "h-full" : ""}`} style={aspect === "auto" ? undefined : { aspectRatio: aspect }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1520}
        height={914}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: `${x}% ${y}%`, transformOrigin: `${x}% ${y}%`, transform: `scale(${zoom})` }}
      />
    </div>
  );
}

export const MOTION_CSS = `
@keyframes gd-progress{from{width:0%}to{width:100%}}
@keyframes gd-fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.gd-fade{animation:gd-fadein 500ms ${EASE} both}
.gd-bar{transform:scaleY(.04);transform-origin:bottom;transition:transform 1100ms ${EASE};transition-delay:calc(var(--i,0) * 70ms)}
[data-inview=true] .gd-bar{transform:scaleY(1)}
.gd-stagger>*{opacity:0;transform:translateY(24px);transition:opacity 700ms ${EASE},transform 700ms ${EASE};transition-delay:calc(var(--i,0) * 90ms)}
[data-inview=true].gd-stagger>*{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  .gd-bar{transform:none;transition:none}
  .gd-stagger>*{opacity:1;transform:none;transition:none}
  .gd-fade{animation:none}
}
`;

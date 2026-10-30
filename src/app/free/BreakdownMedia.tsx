"use client";

import { useEffect, useRef } from "react";
import type { BreakdownMedia } from "@/lib/free";
import { cn } from "@/lib/utils";

// Muted loop that only plays while on screen; with reduced motion it stays on the poster.
function LoopVideo({ media }: { media: BreakdownMedia }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={media.video}
      poster={media.src}
      muted
      loop
      playsInline
      preload="none"
      aria-label={media.alt}
      className="absolute inset-0 size-full object-cover"
    />
  );
}

export function MediaFigure({ media, className }: { media: BreakdownMedia; className?: string }) {
  return (
    <figure className={className}>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-neutral-200 bg-neutral-950",
          media.wide ? "aspect-video" : "aspect-[4/3]",
        )}
      >
        {media.video ? (
          <LoopVideo media={media} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.src} alt={media.alt} loading="lazy" className="absolute inset-0 size-full object-cover" />
        )}
      </div>
      <figcaption className="mt-2 text-[13px] text-neutral-500">{media.caption}</figcaption>
    </figure>
  );
}

// OLED vs mini-LED, simplified: a bright moon drifts across a black sky made of pixels.
// mini-LED lights the screen from behind in zones, so the zone around the moon glows grey;
// on OLED each pixel makes its own light, and a black pixel is off.
const COLS = 32;
const ROWS = 18;
const ZONE = 4; // pixels per backlight zone, each way

function drawPanel(ctx: CanvasRenderingContext2D, t: number, oled: boolean) {
  const { width, height } = ctx.canvas;
  const cell = width / COLS;
  const mx = COLS / 2 + Math.sin(t * 0.5) * 10;
  const my = ROWS / 2 + Math.sin(t * 0.8) * 4;
  const lit = (x: number, y: number) => {
    const d = Math.hypot(x + 0.5 - mx, y + 0.5 - my);
    return Math.max(0, Math.min(1, 2.6 - d));
  };
  const zones: number[][] = [];
  if (!oled) {
    for (let zy = 0; zy < ROWS / ZONE + 1; zy++) {
      zones.push([]);
      for (let zx = 0; zx < COLS / ZONE; zx++) {
        let m = 0;
        for (let y = zy * ZONE; y < Math.min(ROWS, zy * ZONE + ZONE); y++)
          for (let x = zx * ZONE; x < zx * ZONE + ZONE; x++) m = Math.max(m, lit(x, y));
        zones[zy].push(m);
      }
    }
  }
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const own = lit(x, y);
      const glow = oled ? 0 : 0.04 + zones[Math.floor(y / ZONE)][Math.floor(x / ZONE)] * 0.3;
      const v = Math.round(255 * Math.max(own, glow));
      if (v === 0) continue;
      ctx.fillStyle = `rgb(${v},${v},${Math.min(255, v + 8)})`;
      ctx.fillRect(x * cell + 0.5, y * cell + 0.5, cell - 1, cell - 1);
    }
  }
}

function Panel({ oled, label, sub }: { oled: boolean; label: string; sub: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let on = false;
    const loop = (now: number) => {
      drawPanel(ctx, now / 1000, oled);
      if (on && !still) raf = requestAnimationFrame(loop);
    };
    drawPanel(ctx, 1.2, oled);
    const io = new IntersectionObserver(([entry]) => {
      on = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (on && !still) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [oled]);
  return (
    <figure>
      <canvas
        ref={ref}
        width={COLS * 12}
        height={ROWS * 12}
        role="img"
        aria-label={`${label}: ${sub}`}
        className="block aspect-video w-full rounded-md bg-black"
      />
      <figcaption className="mt-2">
        <span className="block text-[13px] font-medium text-white">{label}</span>
        <span className="block text-[13px] text-neutral-400">{sub}</span>
      </figcaption>
    </figure>
  );
}

export function OledDemo() {
  return (
    <div className="mt-5 max-w-2xl rounded-lg bg-neutral-950 p-4 sm:p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">What OLED changes · simplified</p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
        <Panel oled={false} label="mini-LED (14-inch with M6)" sub="Lit from behind in zones: black around the moon turns grey" />
        <Panel oled label="OLED (PROLED XDR)" sub="Each pixel makes its own light: black pixels are off" />
      </div>
    </div>
  );
}

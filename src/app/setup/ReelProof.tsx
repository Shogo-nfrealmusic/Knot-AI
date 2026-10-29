"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// Proof that it runs: the reel about our nightly reel machine. A "Play video" cursor follows the pointer
// over the poster; clicking opens the reel. Numbers are the ones in the reel's own caption (posted 2026-10-21).
const STATS = [
  { value: "10", unit: "reels", text: "edited every night while we sleep" },
  { value: "3", unit: "best", text: "picked by Claude and posted to TikTok" },
  { value: "100K", unit: "views", text: "on one of them" },
];

export default function ReelProof() {
  const area = useRef<HTMLButtonElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const move = (event: React.PointerEvent) => {
    const box = area.current?.getBoundingClientRect();
    if (!box || !cursor.current) return;
    cursor.current.style.transform = `translate(${event.clientX - box.left}px, ${event.clientY - box.top}px)`;
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <button
        ref={area}
        type="button"
        onClick={() => setOpen(true)}
        onPointerMove={move}
        className="group relative mx-auto block w-full max-w-[340px] cursor-none overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
        aria-label="Play the reel: my Mac edits our photo studio's reels while we sleep"
      >
        <Image src="/setup/reel-machine.jpg" alt="" width={720} height={1280} className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
        <span
          ref={cursor}
          className="pointer-events-none absolute left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-black shadow-lg transition-opacity duration-200 [@media(hover:hover)]:flex [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
          style={{ marginLeft: 0 }}
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-black">
            <svg viewBox="0 0 12 12" className="ml-0.5 size-3 fill-white" aria-hidden>
              <path d="M3 1.5v9l7.5-4.5z" />
            </svg>
          </span>
          Play video
        </span>
        <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/95 py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-black shadow-lg [@media(hover:hover)]:hidden">
          <span className="flex size-7 items-center justify-center rounded-full bg-black">
            <svg viewBox="0 0 12 12" className="ml-0.5 size-3 fill-white" aria-hidden>
              <path d="M3 1.5v9l7.5-4.5z" />
            </svg>
          </span>
          Play video
        </span>
      </button>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">Running at our company</p>
        <h3 className="mt-4 max-w-[18ch] text-balance text-[clamp(30px,3.6vw,44px)] font-medium leading-[1.05] tracking-[-0.035em] text-neutral-900">
          My Mac edits our studio&apos;s reels{" "}
          <span className="font-serif font-normal italic text-neutral-500">while we sleep.</span>
        </h3>
        <dl className="mt-10 grid grid-cols-3 divide-x divide-neutral-200 border-y border-neutral-200">
          {STATS.map((stat) => (
            <div key={stat.unit} className="px-4 py-6 first:pl-0">
              <dt className="flex items-baseline gap-1.5">
                <span className="text-[clamp(32px,3.4vw,44px)] font-medium leading-none tracking-[-0.04em] text-neutral-900 tabular-nums">{stat.value}</span>
                <span className="text-[13px] text-neutral-500">{stat.unit}</span>
              </dt>
              <dd className="mt-2 text-[13px] leading-snug text-neutral-500">{stat.text}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-neutral-600">
          It finds the flash in every clip, Claude scores each one (Tokyo? smiling? camera?), and it cuts on the timing of
          reels I edited by hand. This is the kind of job your setup adds, one a month.
        </p>
      </div>

      {open ? (
        <div role="dialog" aria-modal="true" aria-label="Reel" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <video src="/setup/reel-machine.mp4" poster="/setup/reel-machine.jpg" controls autoPlay playsInline className="max-h-[88vh] w-auto rounded-2xl" onClick={(event) => event.stopPropagation()} />
          <button type="button" onClick={() => setOpen(false)} className="absolute right-5 top-5 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white hover:bg-white/20">
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// The hero moment: the tools a small business runs on start scattered and tangled across the stage, then spring
// into two rings around Claude and keep turning. Problem and answer in the first second. One rAF loop writes
// transforms and line ends directly; reduced motion renders the settled rings.
const W = 1000;
const H = 500;
const C = { x: 500, y: 262 };
const RINGS = [
  { rx: 190, ry: 104, speed: 0.07 },
  { rx: 410, ry: 210, speed: -0.045 },
];

const LOGOS = [
  "gmail", "stripe", "slack", "notion", "google", "shopify",
  "github", "wise", "square", "instagram", "zapier", "figma", "gusto", "linear", "microsoftteams", "youtube",
];

// Inner ring holds the first six; the rest sit on the outer ring.
const NODES = LOGOS.map((name, i) => {
  const ring = i < 6 ? 0 : 1;
  const index = ring === 0 ? i : i - 6;
  const count = ring === 0 ? 6 : LOGOS.length - 6;
  const base = (index / count) * Math.PI * 2 + (ring === 0 ? 0.3 : 0);
  // Deterministic scatter: spread over the whole stage, some past the edges.
  const sx = ((i * 379) % 1100) - 50;
  const sy = ((i * 211) % 540) - 20;
  return { name, ring, base, scatter: { x: sx, y: sy }, delay: (i % 8) * 70 };
});

const TANGLE: [number, number][] = [
  [0, 7], [7, 3], [3, 12], [12, 1], [1, 9], [9, 5], [5, 14], [14, 2], [2, 10], [10, 6], [6, 13], [13, 4], [4, 8], [8, 11], [11, 15], [15, 0],
];

const orbitAt = (node: (typeof NODES)[number], t: number) => {
  const ring = RINGS[node.ring]!;
  const a = node.base + t * ring.speed;
  return { x: C.x + Math.cos(a) * ring.rx, y: C.y + Math.sin(a) * ring.ry };
};

// Ease out with a little overshoot, like a spring settling.
const spring = (p: number) => 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);

export default function Constellation() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const nodes = Array.from(host.querySelectorAll<HTMLElement>("[data-node]"));
    const spokes = Array.from(host.querySelectorAll<SVGLineElement>("[data-spoke]"));
    const tangle = host.querySelector<SVGGElement>("[data-tangle]");
    const core = host.querySelector<HTMLElement>("[data-core]");
    const status = host.querySelector<HTMLElement>("[data-status]");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let frame = 0;
    let visible = true;

    let eased = 0;
    const place = (now: number) => {
      // Starts sorting as soon as the stage comes into view, keeps going while it is pinned, and is settled with
      // the last third of the track still to scroll.
      const box = (track.current ?? host).getBoundingClientRect();
      const run = Math.max(1, box.height - innerHeight);
      const enter = innerHeight * 0.75;
      const scrolled = Math.min(1, Math.max(0, (enter - box.top) / (enter + run * 0.65)));
      eased += (scrolled - eased) * 0.12;
      const elapsed = still ? 99999 : 650 + eased * 2100;
      const t = (now - start) / 1000;
      let settle = 0;
      NODES.forEach((node, i) => {
        const p = Math.min(1, Math.max(0, (elapsed - 650 - node.delay) / 1300));
        const k = still ? 1 : spring(p);
        const to = orbitAt(node, t);
        // Unsettled tools jitter: the noise of copy-pasting between tabs.
        const shake = (1 - Math.min(1, p * 1.6)) * 6;
        const jx = Math.sin(t * 7 + i * 1.7) * shake;
        const jy = Math.cos(t * 6 + i * 2.3) * shake;
        const x = node.scatter.x + (to.x - node.scatter.x) * k + jx;
        const y = node.scatter.y + (to.y - node.scatter.y) * k + jy;
        nodes[i]!.style.left = `${(x / W) * 100}%`;
        nodes[i]!.style.top = `${(y / H) * 100}%`;
        spokes[i]!.setAttribute("x2", String(x));
        spokes[i]!.setAttribute("y2", String(y));
        spokes[i]!.style.opacity = String(Math.min(1, Math.max(0, p * 1.4 - 0.3)));
        settle += p;
      });
      const progress = settle / NODES.length;
      if (tangle) tangle.style.opacity = String(1 - Math.min(1, progress * 2.2));
      if (status) {
        const done = progress > 0.6;
        if (status.dataset.done !== String(done)) {
          status.dataset.done = String(done);
          status.textContent = done ? "With your setup: Claude works across all of them" : "Today: you copy between 16 tabs by hand";
        }
      }
      if (core) {
        const c = Math.min(1, Math.max(0, (elapsed - 1400) / 900));
        core.style.opacity = String(c);
        core.style.transform = `translate(-50%, -50%) scale(${0.6 + 0.4 * (still ? 1 : spring(c))})`;
      }
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (visible) place(now);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    observer.observe(host);
    place(performance.now());
    if (!still) frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={track} className="relative h-[230vh]">
    <div className="sticky top-0 flex h-screen items-center px-2">
    <div ref={root} className="relative mx-auto w-full max-w-[min(1080px,150vh)]" style={{ aspectRatio: `${W} / ${H}` }}>
      <div aria-hidden className="absolute left-1/2 top-[54%] h-[46%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6b3d] opacity-[0.18] blur-[70px]" />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
        {RINGS.map((ring) => (
          <ellipse key={ring.rx} cx={C.x} cy={C.y} rx={ring.rx} ry={ring.ry} className="su-ring" />
        ))}
        <g data-tangle>
          {TANGLE.map(([a, b]) => {
            const p = NODES[a]!.scatter;
            const q = NODES[b]!.scatter;
            return <path key={`${a}-${b}`} d={`M${p.x} ${p.y} Q${(p.x + q.x) / 2 + (q.y - p.y) * 0.3} ${(p.y + q.y) / 2 - (q.x - p.x) * 0.2} ${q.x} ${q.y}`} className="su-tangle" />;
          })}
        </g>
        {NODES.map((node) => (
          <line key={node.name} data-spoke x1={C.x} y1={C.y} x2={node.scatter.x} y2={node.scatter.y} className="su-spoke" style={{ opacity: 0 }} />
        ))}
      </svg>

      {NODES.map((node) => (
        <span
          key={node.name}
          data-node
          className="su-node absolute flex size-[clamp(34px,5.4vw,58px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: `${(node.scatter.x / W) * 100}%`, top: `${(node.scatter.y / H) * 100}%` }}
        >
          <Image src={`/setup/logos/${node.name}.svg`} alt={node.name} width={26} height={26} className="size-[46%]" />
        </span>
      ))}

      <span
        data-core
        className="su-hub absolute flex size-[clamp(64px,10vw,116px)] items-center justify-center"
        style={{ left: `${(C.x / W) * 100}%`, top: `${(C.y / H) * 100}%`, opacity: 0, transform: "translate(-50%, -50%) scale(0.6)" }}
      >
        <Image src="/setup/logos/claude.svg" alt="Claude" width={48} height={48} className="size-[46%]" priority />
      </span>
      <p
        data-status
        className="absolute bottom-[-6%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[13px] text-neutral-600 shadow-sm"
      >
        Today: you copy between 16 tabs by hand
      </p>
    </div>
    </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// The problem, then the answer: the tools a small business runs on start scattered and tangled, then spring into
// two rings around Claude and keep turning. Scroll drives it while the stage is pinned. One rAF loop moves the
// logos with transforms only (no layout work per frame), so it stays smooth on phones. Phones get a portrait stage
// with tall rings instead of squeezing the wide one. Reduced motion renders the settled rings.

type Geometry = { W: number; H: number; C: { x: number; y: number }; rings: { rx: number; ry: number; speed: number }[]; scatter: (i: number) => { x: number; y: number } };

const WIDE: Geometry = {
  W: 1000,
  H: 500,
  C: { x: 500, y: 262 },
  rings: [
    { rx: 190, ry: 104, speed: 0.07 },
    { rx: 410, ry: 210, speed: -0.045 },
  ],
  // Deterministic scatter: spread over the whole stage, some past the edges.
  scatter: (i) => ({ x: ((i * 379) % 1100) - 50, y: ((i * 211) % 540) - 20 }),
};

const TALL: Geometry = {
  W: 600,
  H: 900,
  C: { x: 300, y: 450 },
  rings: [
    { rx: 150, ry: 190, speed: 0.07 },
    { rx: 270, ry: 390, speed: -0.045 },
  ],
  scatter: (i) => ({ x: ((i * 379) % 660) - 30, y: ((i * 211) % 960) - 30 }),
};

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
  return { name, ring, base, delay: (i % 8) * 70 };
});

const TANGLE: [number, number][] = [
  [0, 7], [7, 3], [3, 12], [12, 1], [1, 9], [9, 5], [5, 14], [14, 2], [2, 10], [10, 6], [6, 13], [13, 4], [4, 8], [8, 11], [11, 15], [15, 0],
];

// Ease out with a little overshoot, like a spring settling.
const spring = (p: number) => 1 + 2.2 * Math.pow(p - 1, 3) + 1.2 * Math.pow(p - 1, 2);

export default function Constellation() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [tall, setTall] = useState(false);
  const g = tall ? TALL : WIDE;

  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const update = () => setTall(mq.matches);
    const id = requestAnimationFrame(update);
    mq.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", update);
    };
  }, []);

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
    let scale = host.clientWidth / g.W;
    const resize = new ResizeObserver(() => {
      scale = host.clientWidth / g.W;
    });
    resize.observe(host);

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
        const ring = g.rings[node.ring]!;
        const a = node.base + t * ring.speed;
        const to = { x: g.C.x + Math.cos(a) * ring.rx, y: g.C.y + Math.sin(a) * ring.ry };
        const from = g.scatter(i);
        // Unsettled tools jitter: the noise of copy-pasting between tabs.
        const shake = (1 - Math.min(1, p * 1.6)) * 6;
        const x = from.x + (to.x - from.x) * k + Math.sin(t * 7 + i * 1.7) * shake;
        const y = from.y + (to.y - from.y) * k + Math.cos(t * 6 + i * 2.3) * shake;
        nodes[i]!.style.transform = `translate3d(${x * scale}px, ${y * scale}px, 0) translate(-50%, -50%)`;
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
      resize.disconnect();
    };
  }, [g]);

  return (
    <div ref={track} className="relative h-[200svh] sm:h-[230vh]">
      <div className="sticky top-0 flex h-[100svh] items-center px-2">
        <div
          ref={root}
          className="relative mx-auto w-full max-w-[min(1080px,150vh)] max-sm:max-w-[min(100%,52svh)]"
          style={{ aspectRatio: `${g.W} / ${g.H}` }}
        >
          <div aria-hidden className="absolute inset-[10%] rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,107,61,0.16), rgba(255,107,61,0) 100%)" }} />
          <svg viewBox={`0 0 ${g.W} ${g.H}`} className="absolute inset-0 size-full overflow-visible" aria-hidden>
            {g.rings.map((ring) => (
              <ellipse key={ring.rx} cx={g.C.x} cy={g.C.y} rx={ring.rx} ry={ring.ry} className="su-ring" />
            ))}
            <g data-tangle>
              {TANGLE.map(([a, b]) => {
                const p = g.scatter(a);
                const q = g.scatter(b);
                return <path key={`${a}-${b}`} d={`M${p.x} ${p.y} Q${(p.x + q.x) / 2 + (q.y - p.y) * 0.3} ${(p.y + q.y) / 2 - (q.x - p.x) * 0.2} ${q.x} ${q.y}`} className="su-tangle" />;
              })}
            </g>
            {NODES.map((node, i) => (
              <line key={node.name} data-spoke x1={g.C.x} y1={g.C.y} x2={g.scatter(i).x} y2={g.scatter(i).y} className="su-spoke" style={{ opacity: 0 }} />
            ))}
          </svg>

          {NODES.map((node) => (
            <span
              key={node.name}
              data-node
              className="su-node absolute left-0 top-0 flex size-[clamp(36px,5.4vw,58px)] items-center justify-center will-change-transform"
            >
              <Image src={`/setup/logos/${node.name}.svg`} alt={node.name} width={26} height={26} className="size-[46%]" />
            </span>
          ))}

          <span
            data-core
            className="su-hub absolute flex size-[clamp(60px,10vw,116px)] items-center justify-center"
            style={{ left: `${(g.C.x / g.W) * 100}%`, top: `${(g.C.y / g.H) * 100}%`, opacity: 0, transform: "translate(-50%, -50%) scale(0.6)" }}
          >
            <Image src="/setup/logos/claude.svg" alt="Claude" width={48} height={48} className="size-[46%]" priority />
          </span>
          <p
            data-status
            className="absolute bottom-[-6%] left-1/2 w-max max-w-[92vw] -translate-x-1/2 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-center text-[13px] text-neutral-600 shadow-sm"
          >
            Today: you copy between 16 tabs by hand
          </p>
        </div>
      </div>
    </div>
  );
}

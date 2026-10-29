"use client";

import { useEffect, useRef, useState } from "react";
import { MOVING, poseAt, type MovingPart } from "./movement";

// Runs the movement: rebuilds only the moving groups, about 30 times a second, while the figure is on screen.
// Reduced motion keeps the first frame. The readout counts the verifier's ticks.
export default function Movement({ svg }: { svg: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const root = host.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const groups = Object.keys(MOVING).map((part) => [part as MovingPart, root.querySelector<SVGGElement>(`[data-part="${part}"]`)] as const);
    let frame = 0;
    let visible = false;
    let last = 0;
    let shownTicks = -1;
    const start = performance.now() - 350;
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || now - last < 33) return;
      last = now;
      const pose = poseAt((now - start) / 1000);
      for (const [part, group] of groups) if (group) group.innerHTML = MOVING[part](pose);
      if (pose.ticks !== shownTicks) {
        shownTicks = pose.ticks;
        setTicks(pose.ticks);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    observer.observe(root);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <figure className="setup-movement iso" data-theme="light">
      <div ref={host} dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption className="mt-4 flex items-baseline justify-between gap-6 border-t border-[var(--rule)] pt-3 text-[12px] tracking-[0.02em] text-[var(--ink-soft)]">
        <span>Cal. 01, the movement behind our company</span>
        <span className="tabular-nums">
          <span className="text-[var(--ink)]">{ticks.toLocaleString("en-US")}</span> checked since you arrived
        </span>
      </figcaption>
    </figure>
  );
}

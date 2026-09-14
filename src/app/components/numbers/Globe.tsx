"use client";

import { useEffect, useRef } from "react";
import createGlobe, { type Arc, type Marker } from "cobe";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const TOKYO: [number, number] = [35.68, 139.69];
const WARM: [number, number, number] = [0.96, 0.33, 0.12];

// Where customers book from before they fly in. Unlabeled on purpose: the globe
// shows spread, not a country list.
const ORIGINS: [number, number][] = [
  [40.71, -74.0],
  [51.51, -0.13],
  [-33.87, 151.21],
  [1.35, 103.82],
  [37.57, 126.98],
  [48.86, 2.35],
  [34.05, -118.24],
  [25.2, 55.27],
  [-23.55, -46.63],
  [43.65, -79.38],
  [13.76, 100.5],
  [52.52, 13.4],
];

const ARCS_AT_ONCE = 3;
const ARC_STEP_MS = 2400;

// Rotation that puts a longitude/latitude in front of the camera.
function focusOn([lat, long]: [number, number]) {
  return {
    phi: Math.PI - ((long * Math.PI) / 180 - Math.PI / 2),
    theta: (lat * Math.PI) / 180 * 0.6,
  };
}

function frame(step: number): { arcs: Arc[]; markers: Marker[] } {
  const active = Array.from(
    { length: ARCS_AT_ONCE },
    (_, i) => ORIGINS[(step + i * 4) % ORIGINS.length],
  );
  return {
    arcs: active.map((from, i) => ({ id: `arc-${i}`, from, to: TOKYO })),
    markers: [
      { id: "tokyo", location: TOKYO, size: 0.07 },
      ...ORIGINS.map((location, i) => ({
        id: `origin-${i}`,
        location,
        size: active.includes(location) ? 0.035 : 0.018,
      })),
    ],
  };
}

export default function Globe({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(wrapRef, { amount: 0.1 });
  const reduceMotion = useReducedMotion();
  const runningRef = useRef(false);

  runningRef.current = inView && !reduceMotion;

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let size = wrap.offsetWidth;
    const start = focusOn(TOKYO);
    // Sway around Tokyo instead of spinning, so the destination never leaves view.
    let t = 0;
    let phi = start.phi;
    let step = 0;

    let globe: ReturnType<typeof createGlobe>;
    try {
      globe = createGlobe(canvas, {
        width: size * dpr,
        height: size * dpr,
        devicePixelRatio: dpr,
        phi,
        theta: start.theta,
        dark: 0,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        mapBaseBrightness: 0,
        baseColor: [1, 1, 1],
        markerColor: WARM,
        glowColor: [0.98, 0.98, 0.98],
        arcColor: WARM,
        arcWidth: 0.6,
        arcHeight: 0.25,
        markerElevation: 0.01,
        opacity: 0.9,
        ...frame(step),
      });
    } catch {
      // No WebGL: leave the space empty rather than break the section.
      return;
    }

    canvas.style.opacity = "1";

    const observer = new ResizeObserver(() => {
      size = wrap.offsetWidth;
      globe.update({ width: size * dpr, height: size * dpr });
    });
    observer.observe(wrap);

    let raf = 0;
    let lastStep = performance.now();
    const tick = (now: number) => {
      if (runningRef.current) {
        t += 0.004;
        phi = start.phi + Math.sin(t) * 0.55;
        const update: Parameters<typeof globe.update>[0] = { phi };
        if (now - lastStep > ARC_STEP_MS) {
          lastStep = now;
          step += 1;
          Object.assign(update, frame(step));
        }
        globe.update(update);
      } else {
        lastStep = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      globe.destroy();
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn("relative aspect-square w-full", className)}>
      <canvas
        ref={canvasRef}
        className="size-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]"
      />
    </div>
  );
}

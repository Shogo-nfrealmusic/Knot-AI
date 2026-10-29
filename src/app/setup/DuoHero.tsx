"use client";

import { useEffect, useRef, useState } from "react";

// Hero: an iPhone Duo (Artboard Studio mockup, commercial licence) wakes on the lock screen — "3 jobs done
// overnight" — unfolds, and the Copilot OS session plays on the inner display. Plays once and rests on the
// open phone. The white of the render melts into the page with multiply. Reduced motion shows the last frame.
export default function DuoHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setStill(true));
      return () => cancelAnimationFrame(id);
    }
    video.current?.play().catch(() => {});
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[1180px]">
      {still ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/setup/duo-hero-end.jpg" alt="An open iPhone Duo running Copilot OS: a Claude Code session on the left, the morning brief on the right." className="h-auto w-full mix-blend-multiply" />
      ) : (
        <video
          ref={video}
          src="/setup/duo-hero.mp4"
          poster="/setup/duo-hero-start.jpg"
          muted
          playsInline
          autoPlay
          preload="auto"
          aria-label="An iPhone Duo shows '3 jobs done overnight' on its lock screen, unfolds, and runs Copilot OS: Claude Code works through the schedule while the morning brief fills with checked jobs."
          className="h-auto w-full mix-blend-multiply"
        />
      )}
    </div>
  );
}

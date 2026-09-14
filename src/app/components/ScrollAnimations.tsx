"use client";

import { useEffect } from "react";

// Only the scrubbed AppPreview parallax lives here. The old global `h1` / `section`
// entrance tweens started 320ms after paint, hid already-visible content and then
// replayed it, and doubled up with each component's own motion — they were removed.
export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const appPreview = document.querySelector("[data-app-preview]");
    if (!appPreview) return;

    let cancelled = false;
    let revert: (() => void) | null = null;

    async function loadAnimations() {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.to(appPreview, {
          scrollTrigger: {
            trigger: appPreview,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
          y: -40,
          ease: "none",
        });
      });

      revert = () => ctx.revert();
      if (cancelled) revert();
    }

    void loadAnimations();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return null;
}

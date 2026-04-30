"use client";

import { useEffect } from "react";

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    let cancelled = false;
    let revert: (() => void) | null = null;

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        gsap.from("h1", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.utils.toArray("section").forEach((section) => {
          const el = section as HTMLElement;
          gsap.from(el.children, {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
            y: 60,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power2.out",
          });
        });

        const appPreview = document.querySelector("[data-app-preview]");
        if (appPreview) {
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
        }

        const logoBar = document.querySelector("[data-logo-bar]");
        if (logoBar) {
          gsap.from(logoBar.children, {
            scrollTrigger: {
              trigger: logoBar,
              start: "top 90%",
            },
            opacity: 0,
            y: 20,
            stagger: 0.05,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      });

      revert = () => ctx.revert();
      if (cancelled) revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return null;
}

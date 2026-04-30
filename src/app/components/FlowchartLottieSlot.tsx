"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const FlowchartLottie = dynamic(
  () => import("@/app/components/FlowchartLottie"),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full min-h-[200px] aspect-square rounded-xl border border-border-solid bg-bg-card"
        aria-hidden
      />
    ),
  },
);

const placeholder = (
  <div
    className="w-full min-h-[200px] aspect-square rounded-xl border border-border-solid bg-bg-card"
    aria-hidden
  />
);

export default function FlowchartLottieSlot() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [nearView, setNearView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px 0px", threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      {nearView ? <FlowchartLottie /> : placeholder}
    </div>
  );
}

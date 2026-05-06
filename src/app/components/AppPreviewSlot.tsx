"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const AppPreview = dynamic(() => import("@/app/components/AppPreview"), {
  ssr: false,
  loading: () => <AppPreviewSkeleton />,
});

function AppPreviewSkeleton() {
  return (
    <section className="px-4 pb-8 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto w-full max-w-[1220px] overflow-hidden rounded-lg border border-white/10 bg-[#0d0e10] shadow-2xl shadow-black/40">
        <div className="flex h-11 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/35">
            <span className="h-2 w-2 rounded-full bg-[#5dcaa5]" />
            Knot console
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ff8a66]">
            loading
          </span>
        </div>
        <div className="grid min-h-[520px] gap-px bg-white/10 md:grid-cols-[220px_minmax(0,1fr)_240px]">
          <div className="bg-[#0a0a0a] p-4">
            <div className="mb-5 h-3 w-28 rounded bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-7 rounded bg-white/[0.04]"
                  style={{ opacity: 0.35 + index * 0.05 }}
                />
              ))}
            </div>
          </div>
          <div className="bg-[#0a0a0a] p-5">
            <div className="mb-5 flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-8 flex-1 rounded bg-white/[0.04]" />
              ))}
            </div>
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 rounded bg-white/[0.035]"
                  style={{ width: `${92 - index * 5}%` }}
                />
              ))}
            </div>
          </div>
          <div className="hidden bg-[#0a0a0a] p-4 md:block">
            <div className="mb-5 h-3 w-24 rounded bg-white/10" />
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 rounded bg-white/[0.04]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AppPreviewSlot() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "520px 0px", threshold: 0 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return <div ref={rootRef}>{shouldLoad ? <AppPreview /> : <AppPreviewSkeleton />}</div>;
}

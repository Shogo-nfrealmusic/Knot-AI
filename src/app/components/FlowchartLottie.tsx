"use client";

import Lottie from "@lottielab/lottie-player/react";

const FLOWCHART_LOTTIE = `/lottie-lab-json/${encodeURIComponent(
  "Data Reporting (1).json",
)}`;

export default function FlowchartLottie({
  src = FLOWCHART_LOTTIE,
}: {
  src?: string;
}) {
  return (
    <div className="w-full rounded-xl border border-neutral-800 bg-neutral-900 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="aspect-square w-full min-h-[200px]">
        <Lottie
          src={src}
          autoplay
          loop
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:max-h-full"
        />
      </div>
    </div>
  );
}

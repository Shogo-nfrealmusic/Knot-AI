"use client";

import Lottie from "@lottielab/lottie-player/react";

const BENTO_DNA_LOTTIE = `/lottie-lab-json/${encodeURIComponent(
  "Integrations.json",
)}`;

export default function BentoDnaLottie() {
  return (
    <div className="w-full rounded-xl border border-border-solid bg-bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] overflow-hidden">
      <div className="aspect-square w-full min-h-[200px]">
        <Lottie
          src={BENTO_DNA_LOTTIE}
          autoplay
          loop
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full [&_svg]:block [&_svg]:h-full [&_svg]:w-full [&_svg]:max-h-full"
        />
      </div>
    </div>
  );
}

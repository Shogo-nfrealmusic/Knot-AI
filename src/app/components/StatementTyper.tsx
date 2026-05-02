"use client";

import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";

const QUOTES = `"We have AI tools."
"We need operating leverage."
"We need systems people will actually use."`;

const TAGLINE_EN = "Knot turns AI capability into operational practice.";

const BODY = `We help mid-sized companies move beyond AI experimentation and embed working AI systems directly into day-to-day operations.`;

/** Reserve the final text height so sections below do not jump while typing. */
function LayoutSpacer() {
  return (
    <div
      className="invisible pointer-events-none select-none"
      aria-hidden
    >
      <p className="whitespace-pre-line text-text-primary">{QUOTES}</p>
      <p className="mt-4 whitespace-pre-line text-text-secondary" lang="en">
        {TAGLINE_EN}
      </p>
      <p className="mt-4 text-text-secondary">{BODY}</p>
    </div>
  );
}

export default function StatementTyper() {
  return (
    <div
      className="relative text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.022em]"
    >
      <LayoutSpacer />
      <div className="absolute left-0 top-0 right-0" aria-live="polite">
        <TextGenerateEffect
          words={QUOTES}
          className="whitespace-pre-line text-text-primary"
        />

        <TextGenerateEffect
          words={TAGLINE_EN}
          className="mt-4 whitespace-pre-line text-text-secondary"
          initialDelay={0.8}
        />

        <TextGenerateEffect
          words={BODY}
          className="mt-4 text-text-secondary"
          initialDelay={1.4}
        />
      </div>
    </div>
  );
}

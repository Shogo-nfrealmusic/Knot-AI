"use client";

import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";

const QUOTES = `"I built it."
"I run it."
"I measure what it does."`;

const TAGLINE_EN = "Software that works in production, not just in a demo.";

const BODY = `AI agents, automations, and full-stack products — all in production, all measured.`;

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
      className="relative text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.22] tracking-[-0.02em]"
    >
      <LayoutSpacer />
      <div className="absolute left-0 top-0 right-0" aria-live="polite">
        <TextGenerateEffect
          words={QUOTES}
          className="whitespace-pre-line font-medium text-text-primary"
        />

        <TextGenerateEffect
          words={TAGLINE_EN}
          className="mt-4 whitespace-pre-line font-serif text-[1.1em] font-normal italic text-text-secondary"
          initialDelay={0.8}
        />

        <TextGenerateEffect
          words={BODY}
          className="mt-4 font-medium text-text-secondary"
          initialDelay={1.4}
        />
      </div>
    </div>
  );
}

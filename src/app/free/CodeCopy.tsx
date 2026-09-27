"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

export function CodeCopy({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        });
      }}
      className="inline-flex items-center gap-2 rounded-md border border-dashed border-neutral-400 bg-white px-3 py-1.5 font-mono text-[13px] font-semibold tracking-[0.08em] text-neutral-900 transition-colors hover:border-neutral-900"
      aria-label={`Copy discount code ${code}`}
    >
      {code}
      {done ? <IconCheck className="size-3.5 text-emerald-600" /> : <IconCopy className="size-3.5 text-neutral-400" />}
    </button>
  );
}

// One command to paste into Claude Code. The whole line is the button, so it's easy to tap on a phone.
export function CommandCopy({ command, className = "w-full" }: { command: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(command).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        });
      }}
      className={`flex items-start justify-between gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-left font-mono text-[13px] leading-relaxed text-neutral-900 transition-colors hover:border-neutral-400 ${className}`}
      aria-label={`Copy command: ${command}`}
    >
      <span className="min-w-0 [overflow-wrap:anywhere]">{command}</span>
      <span className="mt-[3px] shrink-0">
        {done ? <IconCheck className="size-3.5 text-emerald-600" /> : <IconCopy className="size-3.5 text-neutral-400" />}
      </span>
    </button>
  );
}

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

// A multi-line snippet with a label and a copy button (guides that teach with code).
// `wrap` wraps long lines instead of scrolling sideways (prompts written as prose, read on a phone).
// `size="lg"` is for guides read by beginners: larger code and a copy button big enough to tap (44px).
export function CodeBlock({ label, code, wrap = false, size = "sm" }: { label: string; code: string; wrap?: boolean; size?: "sm" | "lg" }) {
  const [done, setDone] = useState(false);
  const lg = size === "lg";
  return (
    <div className={`overflow-hidden border border-neutral-200 bg-neutral-50 ${lg ? "rounded-xl bg-white" : "rounded-md"}`}>
      <div className={`flex items-center justify-between gap-3 border-b border-neutral-200 ${lg ? "py-0 pl-4 pr-1" : "px-3 py-1.5"}`}>
        <span className={`font-mono text-neutral-500 ${lg ? "text-[13px]" : "text-[11px]"}`}>{label}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code).then(() => {
              setDone(true);
              setTimeout(() => setDone(false), 1600);
            });
          }}
          className={`inline-flex items-center gap-1.5 font-mono text-neutral-500 transition-colors hover:text-neutral-900 ${lg ? "min-h-11 px-3 text-[13px] active:scale-[0.96]" : "text-[11px]"}`}
          aria-label={`Copy ${label}`}
        >
          {done ? <IconCheck className="size-3.5 text-emerald-600" /> : <IconCopy className="size-3.5" />}
          {done ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className={`font-mono text-neutral-800 ${lg ? "px-4 py-3.5 text-[15px] leading-[1.7]" : "px-4 py-3 text-[12px] leading-relaxed"} ${wrap ? "whitespace-pre-wrap [overflow-wrap:anywhere]" : "overflow-x-auto"}`}>{code}</pre>
    </div>
  );
}

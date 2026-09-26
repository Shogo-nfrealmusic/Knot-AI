"use client";

import { useState } from "react";
import { IconArrowRight, IconCheck, IconLoader2 } from "@tabler/icons-react";

// Sends the email straight to the Kit form (double opt-in). Kit emails the confirmation; confirming downloads the PDF.
// If the JSON request is blocked, it falls back to a normal form post to Kit in a new tab.
export function GuideSignup({ formId }: { formId: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const action = `https://app.kit.com/forms/${formId}/subscriptions`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch(action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || (json.status && json.status !== "success")) throw new Error("kit");
      setState("done");
    } catch {
      setState("error");
      form.target = "_blank";
      form.submit();
    }
  }

  if (state === "done") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
        <IconCheck className="mt-0.5 size-4 shrink-0" />
        <p>Check your inbox. Confirm your email and the guide downloads right away.</p>
      </div>
    );
  }

  return (
    <form action={action} method="post" onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <label htmlFor="guide-email" className="sr-only">Email address</label>
      <input
        id="guide-email"
        name="email_address"
        type="email"
        required
        autoComplete="email"
        placeholder="you@company.com"
        className="h-11 flex-1 rounded-lg border border-neutral-300 bg-white px-4 text-[15px] text-neutral-900 outline-none transition-shadow placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-4 focus:ring-black/5"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white transition-all hover:ring-4 hover:ring-black/10 disabled:opacity-60"
      >
        {state === "sending" ? <IconLoader2 className="size-4 animate-spin" /> : null}
        Send me the guide
        {state === "sending" ? null : <IconArrowRight className="size-4" />}
      </button>
      {state === "error" ? <p className="text-xs text-neutral-500 sm:hidden">Opened Kit in a new tab to finish.</p> : null}
    </form>
  );
}

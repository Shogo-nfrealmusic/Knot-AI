"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { BILLING, FOUNDING, PLANS, billedTotal, perMonth, type Billing, type Plan } from "@/lib/setup";
import { cn } from "@/lib/utils";

// The application on its own page: the plan you picked on /setup on the left (switchable here), a short form on
// the right. Posts to /api/setup, which emails Shogo and sends the applicant a fixed receipt. No payment here:
// each application is checked for fit first, and a payment link follows only if it is one.

type Values = { name: string; email: string; business: string; website: string; job: string };
const empty: Values = { name: "", email: "", business: "", website: "", job: "" };
const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const field =
  "w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-3 text-[15px] text-neutral-900 outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-neutral-400 focus:border-neutral-900 focus:shadow-[0_0_0_4px_rgba(0,0,0,0.06)]";

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] size-4 shrink-0 text-[var(--warm)]" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ApplyPanel({ initialPlan, initialBilling }: { initialPlan: Plan["id"]; initialBilling: Billing }) {
  const [planId, setPlanId] = useState<Plan["id"]>(initialPlan);
  const [billing, setBilling] = useState<Billing>(initialBilling);
  const [values, setValues] = useState<Values>(empty);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const plan = PLANS.find((p) => p.id === planId)!;
  const term = BILLING.find((b) => b.id === billing)!;
  const left = FOUNDING.seats - FOUNDING.taken;

  const ready = values.name.trim() && validEmail(values.email) && values.business.trim() && values.job.trim();
  const set = (k: keyof Values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready || state === "sending") return;
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, plan: planId, billing }),
      });
      const out = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(out.error ?? "Failed to send.");
      setState("sent");
      scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    }
  };

  if (state === "sent") {
    return (
      <div className="mx-auto max-w-[560px] px-4 py-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">Application sent</p>
        <h1 className="mt-4 text-balance text-[clamp(32px,5vw,48px)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
          Thanks, {values.name.trim().split(" ")[0]}. <span className="font-serif font-normal italic text-neutral-500">I read every one.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[44ch] text-[16px] leading-[1.7] text-neutral-600">
          A confirmation is on its way to {values.email.trim()}. Within two business days I&apos;ll reply with whether it&apos;s a fit, and if it is, a payment
          link and the first step.
        </p>
        <Link href="/setup" className="mt-8 inline-flex h-11 items-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 hover:bg-neutral-50">
          Back to Copilot OS Setup
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 px-4 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      <aside className="lg:pt-2">
        <Link href="/setup#pricing" className="text-[13px] text-neutral-500 hover:text-neutral-900">
          ← Plans
        </Link>
        <h1 className="mt-5 text-balance text-[clamp(32px,4.4vw,52px)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
          Apply for <span className="font-serif font-normal italic text-neutral-500">a seat.</span>
        </h1>
        <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-neutral-600">
          Two minutes. I reply within two business days. No payment now; I send a link only if it&apos;s a fit.
        </p>

        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-18px_rgba(0,0,0,0.18)]">
          <div role="radiogroup" aria-label="Plan" className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-100 p-1">
            {PLANS.map((p) => (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={planId === p.id}
                onClick={() => setPlanId(p.id)}
                className={cn("rounded-lg py-2 text-[13px] font-medium transition-colors", planId === p.id ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-900")}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-[40px] font-medium leading-none tracking-[-0.04em] text-neutral-900 tabular-nums">${perMonth(plan, billing)}</span>
            <span className="text-[14px] text-neutral-500">/ month</span>
          </div>
          <p className="mt-1.5 text-[13px] text-neutral-500 tabular-nums">
            {term.months === 1 ? "Billed monthly. Cancel anytime." : `$${billedTotal(plan, billing).toLocaleString("en-US")} every ${term.months} months (−${Math.round(term.discount * 100)}%).`}
          </p>

          <div role="radiogroup" aria-label="Billing" className="mt-4 flex flex-wrap gap-1.5">
            {BILLING.map((b) => (
              <button
                key={b.id}
                type="button"
                role="radio"
                aria-checked={billing === b.id}
                onClick={() => setBilling(b.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-[12px] transition-colors",
                  billing === b.id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-neutral-500",
                )}
              >
                {b.label}
                {b.discount ? ` −${Math.round(b.discount * 100)}%` : ""}
              </button>
            ))}
          </div>

          <ul className="mt-5 space-y-2.5 border-t border-neutral-100 pt-5">
            {plan.includes.map((item) => (
              <li key={item} className="flex gap-2.5 text-[14px] leading-relaxed text-neutral-700">
                <Check />
                {item}
              </li>
            ))}
          </ul>

          {plan.id === "build" && left > 0 ? (
            <p className="mt-5 rounded-xl bg-[#fff3ee] px-4 py-3 text-[13px] leading-relaxed text-neutral-700">
              <span className="font-medium text-[var(--warm)]">Founding seat, {left} of {FOUNDING.seats} left.</span> ${FOUNDING.price}/mo for your first {FOUNDING.months} months, if
              you share a before-and-after (your data hidden) and two lines about it.
            </p>
          ) : null}
        </div>
      </aside>

      <form onSubmit={submit} noValidate className="grid content-start gap-3 lg:pt-14">
        <div className="grid gap-3 sm:grid-cols-2">
          <input aria-label="Name" placeholder="Name" autoComplete="name" value={values.name} onChange={set("name")} className={field} />
          <input aria-label="Email" placeholder="Email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set("email")} className={field} />
        </div>
        <input aria-label="Business" placeholder="Business (what you do)" value={values.business} onChange={set("business")} className={field} />
        <input aria-label="Website (optional)" placeholder="Website (optional)" inputMode="url" value={values.website} onChange={set("website")} className={field} />
        <textarea
          aria-label="The first job you'd hand off"
          placeholder="The first job you'd hand off, and how long it takes you each week"
          rows={5}
          value={values.job}
          onChange={set("job")}
          className={cn(field, "resize-none")}
        />
        {error ? <p className="text-[13px] text-red-600">{error}</p> : null}
        <div className="relative">
          {/* Orbit sits on the button, typing, as if it is about to start on the first job. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/setup/orbit-type.webp" alt="" className="pointer-events-none absolute -top-[46px] right-3 w-[68px]" />
          <button
            type="submit"
            disabled={!ready || state === "sending"}
            className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-900 text-[15px] font-medium text-white transition-all hover:bg-black active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {state === "sending" ? "Sending…" : `Apply for ${plan.name}`}
          </button>
        </div>
        <p className="text-center text-[12px] text-neutral-400">No payment now. I never log in to your computer or your accounts.</p>
      </form>
    </div>
  );
}

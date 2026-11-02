"use client";

import { useState } from "react";
import Link from "next/link";
import { BILLING, FOUNDING, PLANS, billedTotal, perMonth, type Billing, type Plan } from "@/lib/setup";
import { cn } from "@/lib/utils";

// Booking a call on its own page: the plan you picked on /setup on the left (switchable here), the Cal.com
// booking page for the 20-minute intro call on the right. Cal.com asks the questions and sends the invite.
// The plan and billing you arrived with go to Cal.com as booking metadata; switching here only changes the price
// shown, so picking a slot is never reset.

const CAL_URL = "https://cal.com/shogokikuchi/intro-call";

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] size-4 shrink-0 text-[var(--warm)]" aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BookPanel({ initialPlan, initialBilling }: { initialPlan: Plan["id"]; initialBilling: Billing }) {
  const [planId, setPlanId] = useState<Plan["id"]>(initialPlan);
  const [billing, setBilling] = useState<Billing>(initialBilling);
  const plan = PLANS.find((p) => p.id === planId)!;
  const term = BILLING.find((b) => b.id === billing)!;
  const left = FOUNDING.seats - FOUNDING.taken;

  const src = `${CAL_URL}?${new URLSearchParams({ layout: "month_view", theme: "light", "metadata[plan]": initialPlan, "metadata[billing]": initialBilling })}`;

  return (
    <div className="grid gap-10 px-4 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
      <aside className="lg:pt-2">
        <Link href="/setup#pricing" className="text-[13px] text-neutral-500 hover:text-neutral-900">
          ← Plans
        </Link>
        <h1 className="mt-5 text-balance text-[clamp(32px,4.4vw,52px)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
          Book a <span className="font-serif font-normal italic text-neutral-500">20-minute call.</span>
        </h1>
        <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-neutral-600">
          We look at your business and the work that eats your week. You leave knowing which jobs Claude Code can take off your plate, and whether
          the setup is a fit. No payment now.
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

      <div className="relative">
        {/* Orbit sits on the calendar's top edge, as if waiting for the call. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/setup/orbit-type.webp" alt="" className="pointer-events-none absolute -top-[46px] right-5 z-10 w-[68px]" />
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-18px_rgba(0,0,0,0.18)]">
          <iframe src={src} title="Book a 20-minute call with Shogo" className="block h-[1180px] w-full sm:h-[760px]" />
        </div>
        <p className="mt-3 text-center text-[12px] text-neutral-400">
          Times show in your time zone. Trouble with the calendar?{" "}
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-neutral-700">
            Open it on Cal.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

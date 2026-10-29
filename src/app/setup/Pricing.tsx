"use client";

import { useState } from "react";
import { BILLING, FOUNDING, PLANS, billedTotal, perMonth, type Billing } from "@/lib/setup";
import { cn } from "@/lib/utils";

function Check() {
  return (
    <svg viewBox="0 0 12 12" className="mt-[5px] size-3 shrink-0 text-neutral-400" aria-hidden>
      <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FoundingSeats() {
  const left = FOUNDING.seats - FOUNDING.taken;
  return (
    <div className="mt-6 rounded-xl border border-[var(--warm)]/30 bg-[var(--warm)]/[0.06] p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-neutral-900">Founding seats</span>
        <span className="flex gap-1" aria-label={`${left} of ${FOUNDING.seats} left`}>
          {Array.from({ length: FOUNDING.seats }, (_, i) => (
            <span key={i} className={cn("h-2 w-5 rounded-full", i < FOUNDING.taken ? "bg-neutral-300" : "bg-[var(--warm)]")} />
          ))}
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
        <span className="font-medium text-neutral-900">${FOUNDING.price}/mo</span> for your first {FOUNDING.months} months. In return, I
        share your before and after (your data hidden) and you write two lines about it. {left} of {FOUNDING.seats} left.
      </p>
    </div>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const active = BILLING.findIndex((b) => b.id === billing);

  return (
    <div>
      <div className="flex justify-center px-4">
        <div role="radiogroup" aria-label="Billing" className="relative grid grid-cols-3 rounded-full border border-neutral-200 bg-white p-1">
          <span
            aria-hidden
            className="absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-neutral-900 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.36,0.64,1)]"
            style={{ transform: `translateX(${active * 100}%)` }}
          />
          {BILLING.map((b) => (
            <button
              key={b.id}
              role="radio"
              aria-checked={billing === b.id}
              onClick={() => setBilling(b.id)}
              className={cn(
                "relative z-10 flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[13px] font-medium transition-colors active:scale-[0.96] sm:px-6",
                billing === b.id ? "text-white" : "text-neutral-600 hover:text-neutral-900",
              )}
            >
              {b.label}
              {b.discount > 0 ? (
                <span className={cn("text-[11px]", billing === b.id ? "text-[#ffb59f]" : "text-[var(--warm)]")}>
                  −{Math.round(b.discount * 100)}%
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid border-t border-neutral-200 lg:grid-cols-3">
        {PLANS.map((plan, i) => {
          const featured = plan.id === "build";
          const price = perMonth(plan, billing);
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col p-8 sm:p-10",
                i > 0 && "border-t border-neutral-200 lg:border-l lg:border-t-0",
                featured && "bg-neutral-50/80",
              )}
            >
              {featured ? <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[var(--warm)]" /> : null}
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-medium text-neutral-900">{plan.name}</h3>
                {featured ? <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--warm)]">Start here</span> : null}
              </div>
              <p className="mt-2 text-[14px] text-neutral-500 lg:min-h-[2.75rem]">{plan.pitch}</p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-5xl font-medium tracking-[-0.04em] text-neutral-900 tabular-nums">${price}</span>
                <span className="text-[14px] text-neutral-500">/ month</span>
                {billing !== "monthly" ? (
                  <span className="text-[14px] text-neutral-400 line-through tabular-nums">${plan.monthly}</span>
                ) : null}
              </div>
              <p className="mt-2 h-5 text-[13px] text-neutral-500 tabular-nums">
                {billing === "monthly" ? "Billed monthly. Cancel anytime." : `$${billedTotal(plan, billing).toLocaleString("en-US")} billed every ${BILLING[active].months} months.`}
              </p>

              {featured ? <FoundingSeats /> : null}

              <ul className="mt-8 flex-1 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-neutral-700">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href={`#apply?plan=${plan.id}`}
                data-plan={plan.id}
                className={cn(
                  "mt-10 inline-flex h-11 items-center justify-center rounded-lg text-sm font-medium transition-all active:scale-[0.96]",
                  featured
                    ? "border border-black bg-black text-white hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200"
                    : "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 hover:ring-4 hover:ring-black/5",
                )}
              >
                Apply for {plan.name}
              </a>
              <p className="mt-3 text-center text-[12px] text-neutral-400">{plan.hours}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

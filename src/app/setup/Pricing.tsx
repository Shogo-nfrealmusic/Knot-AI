"use client";

import { useState } from "react";
import { BILLING, FOUNDING, PLANS, billedTotal, perMonth, type Billing } from "@/lib/setup";
import { cn } from "@/lib/utils";

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-[3px] size-4 shrink-0 text-[var(--warm)]" aria-hidden>
      <path d="M3.5 8.5 6.25 11.25 12.5 4.75" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const active = BILLING.findIndex((b) => b.id === billing);
  const left = FOUNDING.seats - FOUNDING.taken;

  return (
    <div>
      <div className="flex justify-center">
        <div role="radiogroup" aria-label="Billing" className="relative grid grid-cols-3 rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
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
                <span className={cn("text-[11px]", billing === b.id ? "text-[#ffb59f]" : "text-[var(--warm)]")}>−{Math.round(b.discount * 100)}%</span>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-3 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const featured = plan.id === "build";
          const price = perMonth(plan, billing);
          return (
            <article
              key={plan.id}
              className={cn(
                "su-card flex flex-col p-8",
                featured && "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,107,61,0.45),0_30px_80px_-30px_rgba(255,107,61,0.45)]",
              )}
            >
              {featured ? <div className="su-glow-orange -right-16 -top-20" aria-hidden /> : null}
              <div className="relative flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-neutral-900">{plan.name}</h3>
                {featured ? (
                  <span className="flex items-center gap-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/setup/orbit-cheer.webp" alt="" className="-my-3 h-11 w-auto" />
                  <span className="rounded-full bg-[#ff6b3d]/15 px-2.5 py-1 text-[11px] font-medium text-[var(--warm)] shadow-[inset_0_0_0_1px_rgba(255,107,61,0.35)]">
                    Start here
                  </span>
                  </span>
                ) : null}
              </div>
              <p className="relative mt-2 text-[14px] text-neutral-500 lg:min-h-[2.75rem]">{plan.pitch}</p>

              <div className="relative mt-8 flex items-baseline gap-2">
                <span className="text-[56px] font-semibold text-neutral-900 leading-none tracking-[-0.04em] tabular-nums">${price}</span>
                <span className="text-[14px] text-neutral-500">/ month</span>
                {billing !== "monthly" ? <span className="text-[14px] text-neutral-400 line-through tabular-nums">${plan.monthly}</span> : null}
              </div>
              <p className="relative mt-2 h-5 text-[13px] text-neutral-500 tabular-nums">
                {billing === "monthly" ? "Billed monthly. Cancel anytime." : `$${billedTotal(plan, billing).toLocaleString("en-US")} billed every ${BILLING[active]!.months} months.`}
              </p>

              {featured ? (
                <div className="su-panel relative mt-6 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-medium text-neutral-900">Founding seats</span>
                    <span className="flex gap-1" aria-label={`${left} of ${FOUNDING.seats} left`}>
                      {Array.from({ length: FOUNDING.seats }, (_, i) => (
                        <span key={i} className={cn("h-1.5 w-5 rounded-full", i < FOUNDING.taken ? "bg-neutral-200" : "bg-[#ff6b3d] shadow-[0_0_8px_#ff6b3d]")} />
                      ))}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                    <span className="text-neutral-900">${FOUNDING.price}/mo</span> for your first {FOUNDING.months} months. I share your before and
                    after (your data hidden) and you write two lines about it.
                  </p>
                </div>
              ) : null}

              <ul className="relative mt-7 flex-1 space-y-3">
                {plan.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-neutral-700">
                    <Check />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#apply"
                data-plan={plan.id}
                className={cn(
                  "relative mt-9 inline-flex h-12 items-center justify-center rounded-xl text-[15px] font-semibold transition-transform duration-300 active:scale-[0.97]",
                  featured ? "bg-neutral-900 text-white hover:bg-black" : "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
                )}
              >
                Apply for {plan.name}
              </a>
              <p className="relative mt-3 text-center text-[12px] text-neutral-400">{plan.hours}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

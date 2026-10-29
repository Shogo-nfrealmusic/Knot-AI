"use client";

import { useState } from "react";
import { BILLING, FOUNDING, PLANS, billedTotal, perMonth, type Billing } from "@/lib/setup";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const active = BILLING.findIndex((b) => b.id === billing);
  const left = FOUNDING.seats - FOUNDING.taken;

  return (
    <div>
      <div role="radiogroup" aria-label="Billing" className="relative inline-grid grid-cols-3 border-b border-[var(--rule)]">
        <span
          aria-hidden
          className="absolute -bottom-px left-0 h-px w-1/3 bg-[var(--ink)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(${active * 100}%)` }}
        />
        {BILLING.map((b) => (
          <button
            key={b.id}
            role="radio"
            aria-checked={billing === b.id}
            onClick={() => setBilling(b.id)}
            className={cn(
              "flex h-12 items-baseline justify-center gap-2 whitespace-nowrap px-4 pt-3 text-[14px] transition-colors duration-300 sm:px-7",
              billing === b.id ? "text-[var(--ink)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]",
            )}
          >
            {b.label}
            {b.discount > 0 ? <span className="text-[12px] text-[var(--gold)]">−{Math.round(b.discount * 100)}%</span> : null}
          </button>
        ))}
      </div>

      <div className="mt-14 grid border-t border-[var(--ink)] lg:grid-cols-3">
        {PLANS.map((plan, i) => {
          const featured = plan.id === "build";
          const price = perMonth(plan, billing);
          return (
            <article
              key={plan.id}
              className={cn(
                "relative flex flex-col py-10 lg:px-10 lg:py-12",
                i === 0 && "lg:pl-0",
                i === PLANS.length - 1 && "lg:pr-0",
                i > 0 && "border-t border-[var(--rule)] lg:border-l lg:border-t-0",
              )}
            >
              <header className="flex items-baseline justify-between gap-4">
                <h3 className="setup-serif text-[34px] leading-none">{plan.name}</h3>
                {featured ? <span className="text-[12px] tracking-[0.04em] text-[var(--gold)]">Start here</span> : null}
              </header>
              <p className="mt-3 text-[14px] leading-[1.6] text-[var(--ink-soft)] lg:min-h-[2.8rem]">{plan.pitch}</p>

              <div className="mt-10 flex items-start gap-1.5">
                <span className="setup-serif mt-2 text-[28px] leading-none">$</span>
                <span className="setup-serif text-[84px] leading-[0.85] tabular-nums">{price}</span>
                <span className="mt-auto pb-1 text-[13px] text-[var(--ink-soft)]">a month</span>
              </div>
              <p className="mt-4 h-5 text-[13px] text-[var(--ink-soft)] tabular-nums">
                {billing === "monthly" ? (
                  "Billed monthly."
                ) : (
                  <>
                    <span className="line-through decoration-[var(--rule)]">${plan.monthly}</span>
                    {"  "}${billedTotal(plan, billing).toLocaleString("en-US")} every {BILLING[active]!.months} months.
                  </>
                )}
              </p>

              {featured ? (
                <div className="mt-8 border-y border-[var(--gold)]/50 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="setup-serif text-[20px] leading-none">Founding seats</span>
                    <span className="flex gap-1.5" aria-label={`${left} of ${FOUNDING.seats} left`}>
                      {Array.from({ length: FOUNDING.seats }, (_, s) => (
                        <span
                          key={s}
                          className={cn("size-2 rotate-45", s < FOUNDING.taken ? "border border-[var(--rule)]" : "bg-[var(--gold)]")}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-3 text-pretty text-[13px] leading-[1.7] text-[var(--ink-soft)]">
                    <span className="text-[var(--ink)]">${FOUNDING.price} a month</span> for your first {FOUNDING.months} months. In
                    return I share your before and after, with your data hidden, and you write two lines about it.
                  </p>
                </div>
              ) : null}

              <ul className="mt-8 flex-1 divide-y divide-[var(--rule)] border-t border-[var(--rule)]">
                {plan.includes.map((item) => (
                  <li key={item} className="py-3 text-[14px] leading-[1.6] text-[var(--ink)]">
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#apply"
                data-plan={plan.id}
                className={cn(
                  "mt-10 inline-flex h-12 items-center justify-center text-[14px] font-medium tracking-[0.01em] transition-[transform,background-color,color] duration-300 active:scale-[0.97]",
                  featured
                    ? "bg-[var(--ink)] text-[var(--paper)] hover:bg-black"
                    : "border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]",
                )}
              >
                Apply for {plan.name}
              </a>
              <p className="mt-3 text-center text-[12px] text-[var(--ink-soft)]">{plan.hours}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

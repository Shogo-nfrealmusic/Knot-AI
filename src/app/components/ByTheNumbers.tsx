"use client";

import CountUp from "@/app/components/numbers/CountUp";
import Globe from "@/app/components/numbers/Globe";

const integer = (n: number) => Math.round(n).toLocaleString("en-US");

const stats = [
  {
    label: "Best month in revenue",
    note: "Booking platform I built and operate · Stripe",
    to: 19.9,
    format: (n: number) => `$${n.toFixed(1)}k`,
  },
  {
    label: "Bookings processed",
    note: "Jan – Sep 2026",
    to: 754,
    format: integer,
  },
  {
    label: "Videos generated every morning",
    note: "No human input",
    to: 10,
    format: integer,
  },
  {
    label: "Followers",
    note: "Grown from zero, then measured",
    to: 30000,
    format: integer,
  },
];

// dub.co "Built to scale" layout: framed grid section, stats left, globe right.
export default function ByTheNumbers() {
  return (
    <section className="relative overflow-clip border-y border-neutral-200 bg-neutral-50 px-4">
      <div className="relative mx-auto max-w-[1080px] border-x border-neutral-200 py-20 sm:py-24">
        <div className="relative mx-auto flex w-full flex-col px-4 md:flex-row md:gap-10 md:pl-8 lg:gap-20 lg:pl-12">
          <div className="relative z-10 flex flex-col justify-between gap-10 text-center md:max-w-[340px] md:shrink-0 md:gap-8 md:py-12 md:text-left">
            <div>
              <h2 className="text-3xl font-medium tracking-[-0.03em] text-neutral-900 sm:text-4xl">
                Running in production
              </h2>
              <p className="mt-3 text-pretty text-lg leading-relaxed text-neutral-500">
                Not prototypes. Systems with real customers, real payments, and
                real traffic — built and operated by one person.
              </p>
            </div>

            <dl className="flex flex-col gap-7">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-1.5 md:items-start"
                >
                  <dt className="text-sm uppercase tracking-[0.04em] text-neutral-500">
                    {stat.label}
                  </dt>
                  <dd className="flex flex-col items-center gap-1 md:items-start">
                    <CountUp
                      to={stat.to}
                      format={stat.format}
                      className="font-mono text-2xl font-medium tabular-nums text-orange-600"
                    />
                    <span className="text-xs text-neutral-400">{stat.note}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Oversized globe, cropped by the column and faded out at the bottom like dub's. */}
          <div className="relative order-first -mb-28 -mt-6 hidden h-[420px] grow overflow-hidden sm:block md:order-none md:-mb-24 md:-mr-4 md:-mt-10 md:h-auto [mask-image:linear-gradient(black_62%,transparent_92%)]">
            <div className="mx-auto w-full max-w-[520px] md:absolute md:left-[4%] md:top-[6%] md:w-[112%] md:max-w-none">
              <Globe />
            </div>
            <p className="pointer-events-none absolute left-1/2 top-4 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-neutral-200 bg-white/90 px-2.5 py-1 font-mono text-[11px] text-neutral-600 shadow-sm backdrop-blur md:top-12 md:block">
              <span className="mr-1.5 inline-block size-1.5 rounded-full bg-orange-600 align-middle" />
              Booked from 20+ countries · shot in Tokyo
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

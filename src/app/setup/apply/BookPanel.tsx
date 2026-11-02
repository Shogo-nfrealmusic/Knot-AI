import Link from "next/link";
import { BILLING, FOUNDING, perMonth, type Billing, type Plan } from "@/lib/setup";

// Booking a call is the whole page: one heading line, one line for the plan you came from, then the Cal.com
// calendar in the first screen. Cal.com asks the questions and sends the invite. The plan and billing go to
// Cal.com as booking metadata, so the booking shows which plan the person was looking at.

const CAL_URL = "https://cal.com/shogokikuchi/intro-call";

export default function BookPanel({ plan, billing }: { plan: Plan; billing: Billing }) {
  const term = BILLING.find((b) => b.id === billing)!;
  const left = FOUNDING.seats - FOUNDING.taken;
  const src = `${CAL_URL}?${new URLSearchParams({
    layout: "month_view",
    theme: "light",
    hideEventTypeDetails: "true",
    "metadata[plan]": plan.id,
    "metadata[billing]": billing,
  })}`;

  return (
    <div className="px-4 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
        <div>
          <h1 className="text-balance text-[clamp(30px,4vw,44px)] font-medium leading-[1.05] tracking-[-0.04em] text-neutral-900">
            Book a <span className="font-serif font-normal italic text-neutral-500">20-minute call.</span>
          </h1>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-neutral-600">
            Pick a time. We look at your business and the work that eats your week, and you leave knowing what Claude Code can take off your plate.
          </p>
        </div>
        <p className="text-[13.5px] text-neutral-500 tabular-nums">
          Looking at <span className="font-medium text-neutral-900">{plan.name}</span>, ${perMonth(plan, billing)}/mo
          {term.months > 1 ? ` (${term.label.toLowerCase()})` : ""}
          {plan.id === "build" && left > 0 ? `, founding seat $${FOUNDING.price}/mo` : ""}.{" "}
          <Link href="/setup#pricing" className="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900">
            Change
          </Link>
        </p>
      </div>

      <div className="relative mt-6">
        {/* Orbit sits on the calendar's top edge, as if waiting for the call. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/setup/orbit-type.webp" alt="" className="pointer-events-none absolute -top-[42px] left-6 z-10 w-[60px] max-sm:hidden" />
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-18px_rgba(0,0,0,0.18)]">
          <iframe src={src} title="Book a 20-minute call with Shogo" className="block h-[1000px] w-full lg:h-[560px]" />
        </div>
        <p className="mt-3 text-center text-[12px] text-neutral-400">
          Times show in your time zone. No payment now; I send a link only after the call, if it&apos;s a fit.{" "}
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-neutral-700">
            Calendar not loading?
          </a>
        </p>
      </div>
    </div>
  );
}

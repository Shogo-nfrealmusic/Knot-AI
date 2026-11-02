import { CtaLink } from "@/app/components/CtaLink";
import { FOUNDING, PLANS } from "@/lib/setup";

// The way from a free tool page to the paid setup, right under the tool list where people stop reading.
// The tools stay free; this is only for the business owner who would rather have it done for them.
export function SetupStrip({ number }: { number: string }) {
  const from = Math.min(...PLANS.map((p) => p.monthly));
  const left = FOUNDING.seats - FOUNDING.taken;
  const place = `free-${number}`;
  return (
    <div className="grid grid-cols-1 items-center gap-6 border-t border-neutral-200 bg-neutral-50 px-5 py-8 sm:px-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/setup/duo-closed.jpg" alt="" width={900} height={1200} loading="lazy" className="hidden w-[64px] shrink-0 rounded-lg sm:block" />
        <div>
          <p className="text-[17px] font-medium tracking-[-0.01em] text-neutral-900">Run a business and want this working for you, not on your to-do list?</p>
          <p className="mt-1.5 max-w-[60ch] text-[14.5px] leading-relaxed text-neutral-600">
            I set Claude Code up inside one- to three-person businesses: your schedule, inbox and leads, done overnight and checked. From ${from} a
            month{left > 0 ? `, ${left} founding seats at half price` : ""}.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <CtaLink
          place={place}
          href="/setup/apply"
          className="inline-flex h-11 items-center rounded-lg bg-neutral-900 px-5 text-sm font-medium text-white transition-all hover:bg-black active:scale-[0.97]"
        >
          Book a 20-minute call
        </CtaLink>
        <CtaLink place={place} href="/setup" className="text-sm font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900">
          How it works
        </CtaLink>
      </div>
    </div>
  );
}

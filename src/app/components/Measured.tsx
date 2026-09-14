import {
  IconCalendarCheck,
  IconChartBar,
  IconCreditCard,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { GridSection } from "@/app/components/ui/grid-section";
import MeasuredTour from "@/app/components/measured/Tour";

// One-line descriptions from the TPS booking platform entry in src/lib/projects.ts.
const features = [
  {
    Icon: IconChartBar,
    title: "GA4 funnel events",
    body: "Instrumentation on every step of the booking funnel, from plan to deposit.",
  },
  {
    Icon: IconPlayerPlay,
    title: "Session replay",
    body: "Microsoft Clarity recordings show where customers stall, step by step.",
  },
  {
    Icon: IconCreditCard,
    title: "Stripe payment events",
    body: "30% deposit at booking, remaining balance collected automatically after the shoot.",
  },
  {
    Icon: IconCalendarCheck,
    title: "Calendar sync",
    body: "Photographer assignment kept in sync with Google Calendar.",
  },
];

// dub.co "Measure what matters": left-aligned intro, a three-panel tour, then the feature strip.
export default function Measured() {
  return (
    <GridSection innerClassName="pt-10 sm:pt-20 pb-10">
      <div className="flex flex-col px-4 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex size-4 items-center justify-center rounded border border-black/5 bg-green-400 text-green-900">
            <svg viewBox="0 0 10 10" fill="none" className="size-2.5" aria-hidden>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="3.333"
                d="M2.333 6.333v2M7.667 1.667v6.666"
              />
            </svg>
          </span>
          <span className="text-xs font-medium text-neutral-600">Booking analytics</span>
        </div>
        <h2 className="mt-3 max-w-lg text-pretty text-3xl font-medium tracking-[-0.03em] text-neutral-900 sm:text-4xl md:text-5xl">
          Measured, not guessed
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-base text-neutral-500 sm:text-lg">
          Every step of the booking funnel is instrumented — which is how a 39%
          drop-off between picking a date and picking a time showed up, and got
          fixed.
        </p>
        <div className="mt-8">
          <a
            href="https://book.tettyphotostudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-fit whitespace-nowrap rounded-lg border border-neutral-200 bg-white px-5 py-2 text-sm font-medium text-neutral-900 shadow-sm transition-all hover:border-neutral-400 hover:ring-4 hover:ring-neutral-200"
          >
            See the platform
          </a>
        </div>
      </div>

      <MeasuredTour className="mt-10 sm:mt-20" />

      <div className="grid grid-cols-1 gap-px bg-neutral-200 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ Icon, title, body }) => (
          <div key={title} className="flex flex-col items-start gap-2 bg-white p-8 text-left lg:px-9 lg:py-10">
            <Icon className="size-4 shrink-0 text-green-600" stroke={1.75} />
            <h3 className="font-medium text-neutral-900">{title}</h3>
            <p className="max-w-xs text-pretty text-neutral-500 sm:max-w-none">{body}</p>
          </div>
        ))}
      </div>
    </GridSection>
  );
}

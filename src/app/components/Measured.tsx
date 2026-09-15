import {
  IconCalendarCheck,
  IconChartBar,
  IconCreditCard,
  IconPlayerPlay,
  IconSearch,
} from "@tabler/icons-react";
import { GridSection } from "@/app/components/ui/grid-section";
import MeasuredTour from "@/app/components/measured/Tour";
import { cn } from "@/lib/utils";

// Google Search Console for book.tettyphotostudio.com: web search, last 3 months (user export, Sep 2026).
const search = { clicks: 138, impressions: 910 };
const queries = [
  { query: "tetty photo studio", clicks: 41, position: 4.21 },
  { query: "tettyphotostudio", clicks: 24, position: 1.21 },
  { query: "tokyo photo studio", clicks: 1, position: 14.21, impressions: 42 },
];

function SearchConsoleStrip() {
  return (
    <div
      data-search-console
      className="grid grid-cols-1 border-t border-neutral-200 bg-white text-sm lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
    >
      <div className="flex flex-col items-start gap-2 p-8 text-left lg:border-r lg:border-neutral-200 lg:px-9 lg:py-10">
        <IconSearch className="size-4 shrink-0 text-green-600" stroke={1.75} />
        <h3 className="font-medium text-neutral-900">Search Console</h3>
        <p className="max-w-sm text-pretty text-neutral-500">
          Branded searches bring nearly every click. Non-branded terms like
          “tokyo photo studio” sit around position 14 — the next thing to grow.
        </p>
        <p className="mt-1 font-mono text-[10px] text-neutral-400">
          book.tettyphotostudio.com · web · last 3 months
        </p>
      </div>

      <div className="px-4 pb-8 sm:px-8 lg:px-9 lg:py-10">
        <dl className="grid grid-cols-3 divide-x divide-neutral-200 overflow-hidden rounded-lg border border-neutral-200">
          {[
            { label: "Clicks", value: search.clicks.toLocaleString("en-US") },
            { label: "Impressions", value: search.impressions.toLocaleString("en-US") },
            { label: "CTR", value: `${((search.clicks / search.impressions) * 100).toFixed(1)}%` },
          ].map((stat) => (
            <div key={stat.label} className="min-w-0 px-3 py-2.5 sm:px-4">
              <dt className="truncate text-[11px] text-neutral-500">{stat.label}</dt>
              <dd className="mt-1 font-mono text-[18px] leading-none tracking-[-0.03em] text-neutral-900 tabular-nums sm:text-[20px]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <table className="mt-3 w-full table-fixed overflow-hidden rounded-lg border border-neutral-200 text-[12px]">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-500">
              <th className="px-3 py-2 text-left font-normal sm:px-4">Top queries</th>
              <th className="w-14 px-2 py-2 text-right font-normal sm:w-20">Clicks</th>
              <th className="w-[4.5rem] px-3 py-2 text-right font-normal sm:w-24 sm:px-4">Position</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((row) => {
              const next = row.impressions !== undefined;
              return (
                <tr key={row.query} className={cn("border-b border-neutral-100 last:border-0", next && "bg-orange-50/50")}>
                  <td className="px-3 py-2 sm:px-4">
                    <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="truncate text-neutral-800">{row.query}</span>
                      {next ? (
                        <span className="whitespace-nowrap rounded-full border border-orange-200 bg-white px-1.5 py-0.5 font-mono text-[10px] leading-none text-warm">
                          {row.impressions} impressions · next to grow
                        </span>
                      ) : null}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right font-mono text-neutral-900 tabular-nums">{row.clicks}</td>
                  <td className={cn("px-3 py-2 text-right font-mono tabular-nums sm:px-4", next ? "text-warm" : "text-neutral-900")}>
                    {row.position.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

      <SearchConsoleStrip />
    </GridSection>
  );
}

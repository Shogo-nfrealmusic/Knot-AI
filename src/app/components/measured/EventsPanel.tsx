"use client";

import { useEffect, useId, useState, type ComponentType } from "react";
import {
  IconCalendarCheck,
  IconCalendarPlus,
  IconCamera,
  IconCreditCard,
  IconDeviceMobile,
  IconReceipt,
} from "@tabler/icons-react";
import { SiGooglecalendar, SiStripe } from "react-icons/si";
import { cn } from "@/lib/utils";
import { ApertureMark, type PanelProps } from "./marks";

const ROW_STEP = 39; // h-10 rows overlapping by 1px
const STEP_MS = 1400;
const ROWS = 36;

// Headline totals are real; the sparklines are decorative.
const stats = [
  { label: "Revenue / mo", value: "~$33k", d: "M4 34C10 32 14 26 20 25S30 28 36 24 46 14 52 16 62 12 68 8 74 4 76 3" },
  { label: "Transactions", value: "754", d: "M4 30C12 29 16 22 22 23S32 30 38 26 48 18 54 20 62 10 68 11 74 6 76 5" },
  { label: "Countries", value: "20+", d: "M4 36C10 33 16 30 22 28S32 24 38 25 48 17 54 18 64 12 70 9 74 7 76 5" },
];

type Mark = ComponentType<{ className?: string }>;
const sources: Record<string, { name: string; Icon: Mark; tone: string }> = {
  site: { name: "book.tettyphotostudio.com", Icon: ApertureMark, tone: "text-neutral-700" },
  stripe: { name: "Stripe", Icon: SiStripe, tone: "text-[#635BFF]" },
  calendar: { name: "Google Calendar", Icon: SiGooglecalendar, tone: "text-[#4285F4]" },
  staff: { name: "Staff app", Icon: IconDeviceMobile, tone: "text-neutral-700" },
};

// The order a booking's events actually arrive in. No customer data.
const events: { name: string; Icon: Mark; source: (typeof sources)[string]; channel: string }[] = [
  { name: "Booking created", Icon: IconCalendarPlus, source: sources.site, channel: "GA4 event" },
  { name: "Deposit paid · 30%", Icon: IconCreditCard, source: sources.stripe, channel: "Webhook" },
  { name: "Calendar synced", Icon: IconCalendarCheck, source: sources.calendar, channel: "API" },
  { name: "Photographer assigned", Icon: IconCamera, source: sources.staff, channel: "Push" },
  { name: "Balance collected", Icon: IconReceipt, source: sources.stripe, channel: "Webhook" },
];

function Sparkline({ d }: { d: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 80 43" preserveAspectRatio="none" className="size-full" aria-hidden>
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" x2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7D3AEC" />
          <stop offset="1" stopColor="#DA2778" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#7D3AEC" stopOpacity="0.18" />
          <stop offset="1" stopColor="#DA2778" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d}V41H4Z`} fill={`url(#${id}-fill)`} />
      <path d={d} fill="none" stroke={`url(#${id}-stroke)`} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function EventsPanel({ active, animate }: PanelProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (animate) {
      const timer = setInterval(() => setStep((current) => Math.min(current + 1, ROWS - 8)), STEP_MS);
      return () => clearInterval(timer);
    }
    if (!active) {
      // Rewind once the panel has faded out, so the next visit starts at the top.
      const timer = setTimeout(() => setStep(0), 800);
      return () => clearTimeout(timer);
    }
  }, [active, animate]);

  return (
    <div className="relative size-full pt-5 sm:pt-8">
      <div className="size-full select-none overflow-hidden [mask-image:linear-gradient(black_75%,transparent)]" aria-hidden>
        <div className="relative z-0 mx-auto flex size-full max-w-xl flex-col items-center">
          <div className="w-full shrink-0 rounded-[0.625rem] border border-neutral-200 bg-white p-1.5 shadow-sm">
            <div className="grid w-full grid-cols-3 gap-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex h-full items-center justify-between gap-2.5 rounded-md border border-neutral-200 p-2.5"
                >
                  <div className="flex h-full min-w-0 flex-col gap-1">
                    <span className="truncate text-[0.625rem] text-neutral-500">{stat.label}</span>
                    <span className="text-base font-medium tabular-nums text-neutral-800">{stat.value}</span>
                  </div>
                  <div className="hidden h-[43px] min-w-0 max-w-20 grow sm:block">
                    <Sparkline d={stat.d} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-5 w-px shrink-0 bg-neutral-200" />

          <div className="pointer-events-none relative w-full">
            <div
              className="relative flex w-full flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{ transform: `translateY(${-step * ROW_STEP}px)` }}
            >
              {Array.from({ length: ROWS }, (_, index) => {
                const event = events[index % events.length];
                const { Icon, source } = event;
                const SourceIcon = source.Icon;
                return (
                  <div
                    key={index}
                    className={cn(
                      "-mt-px grid h-10 shrink-0 grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center gap-4 rounded-md border border-neutral-200 bg-white pl-2 pr-4 text-[0.6875rem] font-medium text-neutral-800 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(0,0.7fr)]",
                      index < step && "translate-x-1/4 scale-x-50 opacity-0",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <Icon className="size-3 shrink-0 text-neutral-600" />
                      <span className="truncate">{event.name}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2">
                      <SourceIcon className={cn("size-3 shrink-0", source.tone)} />
                      <span className="truncate">{source.name}</span>
                    </div>
                    <div className="hidden items-center justify-end gap-1.5 text-neutral-500 sm:flex">
                      <span className="size-1.5 rounded-full bg-green-500" />
                      {event.channel}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

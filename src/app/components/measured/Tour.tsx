"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "motion/react";
import {
  IconArrowRight,
  IconChevronRight,
  IconFilter,
  IconListDetails,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { PanelProps } from "./marks";
import FunnelPanel from "./FunnelPanel";
import EventsPanel from "./EventsPanel";
import SessionReplayMock from "./SessionReplayMock";

const DWELL_MS = 6000;

function ReplayPanel({ animate }: PanelProps) {
  return (
    <div className="relative size-full pt-5 sm:pt-10">
      <div className="mx-auto h-full w-full max-w-xl [mask-image:linear-gradient(black_75%,transparent)]">
        <SessionReplayMock animate={animate} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[conic-gradient(from_-80deg,#f00,#EAB308_99deg,#5CFF80_162deg,#00FFF9_216deg,#3A8BFD_288deg,#855AFC)] opacity-40 mix-blend-overlay blur-[50px] [mask-image:radial-gradient(at_50%_30%,transparent_30%,black)] sm:block"
      />
    </div>
  );
}

type Tab = {
  title: string;
  body: string;
  link: { label: string; href: string; external?: boolean };
  Icon: ComponentType<{ className?: string; stroke?: number }>;
  Panel: ComponentType<PanelProps>;
};

const tabs: Tab[] = [
  {
    title: "Booking funnel",
    body: "Every step from plan to deposit is tracked in GA4 — which is where the stall between date and time showed up.",
    link: { label: "Try the flow", href: "https://book.tettyphotostudio.com/", external: true },
    Icon: IconFilter,
    Panel: FunnelPanel,
  },
  {
    title: "Event pipeline",
    body: "Bookings, Stripe deposits, calendar sync, and photographer assignment arrive as one ordered stream.",
    link: { label: "See the stack", href: "/about" },
    Icon: IconListDetails,
    Panel: EventsPanel,
  },
  {
    title: "Session replay",
    body: "Microsoft Clarity replays showed where people stalled. The fix went to the time-slot step, not a redesign.",
    link: { label: "Ask about it", href: "/contact" },
    Icon: IconPlayerPlay,
    Panel: ReplayPanel,
  },
];

const linkClass = (current: boolean) =>
  cn(
    "group/link mt-3.5 inline-flex w-fit items-center gap-0.5 text-sm font-medium transition-colors duration-500",
    current ? "text-green-600" : "pointer-events-none text-neutral-500",
  );

function LinkArrow() {
  return (
    <span className="relative flex size-4 items-center">
      <IconChevronRight className="absolute size-4 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:opacity-0" />
      <IconArrowRight className="absolute size-4 opacity-0 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:opacity-100" />
    </span>
  );
}

// dub.co's feature tour: panels slide by direction, and each tab's left rail fills over its dwell time.
export default function MeasuredTour({ className }: { className?: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduceMotion = useReducedMotion() === true;
  const [active, setActive] = useState(0);
  const elapsed = useRef(0);
  const fills = useRef<(HTMLDivElement | null)[]>([]);

  // Progress is written straight to the DOM each frame, so the rail fills without re-rendering.
  const setFill = (index: number, progress: number) => {
    const fill = fills.current[index];
    if (fill) fill.style.transform = `translateY(${(progress - 1) * 100}%)`;
  };

  useEffect(() => {
    if (reduceMotion) {
      setFill(active, 1);
      return;
    }
    setFill(active, elapsed.current / DWELL_MS);
    if (!inView) return;

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;
      const progress = Math.min(elapsed.current / DWELL_MS, 1);
      setFill(active, progress);
      if (progress >= 1) {
        elapsed.current = 0;
        setActive((current) => (current + 1) % tabs.length);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, inView, reduceMotion]);

  const select = (index: number) => {
    elapsed.current = 0;
    setFill(index, reduceMotion ? 1 : 0);
    setActive(index);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.target !== event.currentTarget) return;
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Enter" || event.key === " ") next = index;
    else return;
    event.preventDefault();
    select(next);
    document.getElementById(`${id}-tab-${next}`)?.focus();
  };

  return (
    <div ref={ref} className={cn("border-y border-neutral-200 bg-neutral-50", className)}>
      <div className="flex flex-col">
        <div className="flex h-[340px] grow items-center justify-center overflow-hidden px-4 sm:h-[440px] sm:px-8">
          <div className="relative size-full">
            {tabs.map(({ title, Panel }, index) => {
              const current = index === active;
              return (
                <div
                  key={title}
                  id={`${id}-panel-${index}`}
                  role="tabpanel"
                  aria-labelledby={`${id}-tab-${index}`}
                  aria-hidden={!current}
                  inert={!current}
                  data-current={current}
                  style={{ "--direction": index < active ? -1 : 1 } as CSSProperties}
                  className="absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-[current=false]:pointer-events-none data-[current=false]:translate-x-[calc(var(--direction)*50%)] data-[current=false]:opacity-0 data-[current=false]:blur-[2px] motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:data-[current=false]:translate-x-0"
                >
                  <Panel active={current && inView} animate={current && inView && !reduceMotion} />
                </div>
              );
            })}
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Booking analytics views"
          className="mx-auto grid w-full max-w-[800px] grid-cols-1 gap-x-10 gap-y-8 px-4 py-8 sm:grid-cols-3"
        >
          {tabs.map(({ title, body, link, Icon }, index) => {
            const current = index === active;
            return (
              <div
                key={title}
                id={`${id}-tab-${index}`}
                role="tab"
                tabIndex={current ? 0 : -1}
                aria-selected={current}
                aria-controls={`${id}-panel-${index}`}
                onClick={() => select(index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-sm pl-6 pr-2 text-left text-sm text-neutral-900 outline-none transition-opacity duration-500 focus-visible:ring-2 focus-visible:ring-neutral-900/15",
                  current ? "opacity-100" : "opacity-50 hover:opacity-70",
                )}
              >
                <div className="absolute -left-px top-0 h-full w-px overflow-hidden bg-neutral-200">
                  <div
                    ref={(element) => {
                      fills.current[index] = element;
                    }}
                    className={cn(
                      "size-full bg-current text-green-600 transition-opacity duration-500",
                      current ? "opacity-100" : "opacity-0",
                    )}
                    style={{ transform: "translateY(-100%)" }}
                  />
                </div>
                <Icon className="size-4" stroke={1.75} />
                <span className="mt-2 font-medium">{title}</span>
                <p className="mt-3.5 text-neutral-500">{body}</p>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={current ? 0 : -1}
                    onClick={(event) => event.stopPropagation()}
                    className={linkClass(current)}
                  >
                    {link.label}
                    <LinkArrow />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    tabIndex={current ? 0 : -1}
                    onClick={(event) => event.stopPropagation()}
                    className={linkClass(current)}
                  >
                    {link.label}
                    <LinkArrow />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

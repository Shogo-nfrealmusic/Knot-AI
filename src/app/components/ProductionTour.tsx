"use client";

import { useEffect, useId, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import Link from "next/link";
import { useInView, useReducedMotion } from "motion/react";
import {
  IconArrowRight,
  IconChevronRight,
  IconCode,
  IconPlugConnected,
  IconTimeline,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { GridSection } from "@/app/components/ui/grid-section";
import StackTabs from "@/app/components/illustrations/StackTabs";
import BookingEventFlow from "@/app/components/illustrations/BookingEventFlow";
import ChipRows from "@/app/components/production-tour/ChipRows";

const DWELL_MS = 6000;

type PanelProps = { running: boolean };

function IntegrationsPanel({ running }: PanelProps) {
  return <ChipRows paused={!running} />;
}

function StackPanel() {
  return (
    <div className="flex size-full justify-center overflow-hidden px-4 pt-6 [mask-image:linear-gradient(black_70%,transparent)]">
      <div className="w-full max-w-xl origin-top max-md:scale-[0.8] md:scale-90">
        <StackTabs />
      </div>
    </div>
  );
}

function EventsPanel() {
  return (
    // The flow stacks vertically below md, which is why the panel area stays taller until then.
    <div className="relative size-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="size-full origin-center max-md:scale-[0.85]">
        <BookingEventFlow />
      </div>
    </div>
  );
}

type Tab = {
  title: string;
  body: string;
  link: { label: string; href: string };
  Icon: ComponentType<{ className?: string; stroke?: number }>;
  Panel: ComponentType<PanelProps>;
};

const tabs: Tab[] = [
  {
    title: "Production integrations",
    body: "Stripe, Google Calendar, GA4, Clarity, Claude and MCP — each one wired into a system on /work.",
    link: { label: "See the systems", href: "/work" },
    Icon: IconPlugConnected,
    Panel: IntegrationsPanel,
  },
  {
    title: "Multi-language stack",
    body: "Go and TypeScript for the booking platform, Python for the video pipeline, React Native for the staff app.",
    link: { label: "About the stack", href: "/about" },
    Icon: IconCode,
    Panel: StackPanel,
  },
  {
    title: "Real-time events",
    body: "A booking fans out to Stripe, Google Calendar and GA4 the moment it is created, in the customer's currency.",
    link: { label: "Follow a booking", href: "/work" },
    Icon: IconTimeline,
    Panel: EventsPanel,
  },
];

const linkClass = (current: boolean) =>
  cn(
    "group/link mt-3.5 inline-flex w-fit items-center gap-0.5 text-sm font-medium transition-colors duration-500",
    current ? "text-orange-600" : "pointer-events-none text-neutral-500",
  );

// dub.co "Enterprise-grade infrastructure": stacked panels crossfade up while each tab's rail fills.
export default function ProductionTour() {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduceMotion = useReducedMotion() === true;
  const [active, setActive] = useState(0);
  const elapsed = useRef(0);
  const fills = useRef<(HTMLDivElement | null)[]>([]);

  // Written straight to the DOM each frame, so the rail fills without re-rendering.
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
    <GridSection innerClassName="pt-16 sm:pt-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 text-center">
        <div className="flex items-center gap-2">
          <span className="grid size-4 grid-cols-2 gap-px rounded border border-black/5 bg-orange-500 p-[3px]" aria-hidden>
            <span className="rounded-[1px] bg-white/90" />
            <span className="rounded-[1px] bg-white/50" />
            <span className="rounded-[1px] bg-white/50" />
            <span className="rounded-[1px] bg-white/90" />
          </span>
          <span className="text-xs font-medium text-neutral-600">Built for production</span>
        </div>
        <h2 className="mt-3 text-balance text-3xl font-medium tracking-[-0.03em] text-neutral-900 sm:text-4xl md:text-5xl">
          Systems that run every day, not demos
        </h2>
        <p className="mt-3 max-w-xl text-pretty text-base text-neutral-500 sm:text-lg">
          Payments, calendars, analytics, AI agents and content pipelines — wired
          together and running in a real business.
        </p>
      </div>

      <div ref={ref} className="mt-10 border-y border-neutral-200 bg-neutral-50 sm:mt-16">
        <div className="relative mx-auto h-[420px] max-w-screen-md overflow-hidden md:h-[300px]">
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
                className="absolute inset-0 flex items-center justify-center transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-[current=false]:pointer-events-none data-[current=false]:translate-y-4 data-[current=false]:opacity-0 motion-reduce:transition-opacity motion-reduce:duration-200 motion-reduce:data-[current=false]:translate-y-0"
              >
                <Panel running={current && inView && !reduceMotion} />
              </div>
            );
          })}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Production highlights"
        className="mx-auto grid w-full max-w-[800px] grid-cols-1 gap-x-10 gap-y-8 px-4 py-10 sm:grid-cols-3"
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
                    "size-full bg-orange-500 transition-opacity duration-500",
                    current ? "opacity-100" : "opacity-0",
                  )}
                  style={{ transform: "translateY(-100%)" }}
                />
              </div>
              <Icon className="size-4" stroke={1.75} />
              <span className="mt-2 font-medium">{title}</span>
              <p className="mt-3.5 text-pretty text-neutral-500">{body}</p>
              <Link
                href={link.href}
                tabIndex={current ? 0 : -1}
                onClick={(event) => event.stopPropagation()}
                className={linkClass(current)}
              >
                {link.label}
                <span className="relative flex size-4 items-center">
                  <IconChevronRight className="absolute size-4 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:opacity-0" />
                  <IconArrowRight className="absolute size-4 opacity-0 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:opacity-100" />
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </GridSection>
  );
}

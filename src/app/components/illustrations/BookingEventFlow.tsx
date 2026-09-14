"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useInView,
  useReducedMotion,
} from "motion/react";
import { IconCalendarCheck } from "@tabler/icons-react";
import { SiGoogleanalytics, SiGooglecalendar, SiStripe } from "react-icons/si";
import { cn } from "@/lib/utils";

// One loop: a dot leaves the booking site, reaches "Booking created", runs down the
// branch to the integration that handles the event, then out to the deposit currency.
// Each arrival advances the state, so the motion and the UI stay in step.
const LEG_IN_MS = 650;
const LEG_BRANCH_MS = 550;
const LEG_OUT_MS = 650;
const CYCLE_MS = 3200;

const EASE_TRAVEL = [0.65, 0, 0.35, 1] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Each event on the booking lights up the integration that handles it.
const events = [
  {
    label: "Deposit paid · 30%",
    // Phones: the badge must end before the vertical wire.
    short: "Deposit · 30%",
    integration: "stripe",
    dot: "#3b82f6",
    badge: "border-blue-200 bg-blue-100 text-blue-800",
    icon: "border-blue-200 bg-blue-100 text-blue-700",
    branch: "text-blue-400",
    tile: "border-blue-300 ring-4 ring-blue-100",
  },
  {
    label: "Calendar synced",
    integration: "gcal",
    dot: "#22c55e",
    badge: "border-green-200 bg-green-100 text-green-800",
    icon: "border-green-200 bg-green-100 text-green-700",
    branch: "text-green-500",
    tile: "border-green-300 ring-4 ring-green-100",
  },
  {
    label: "Funnel event",
    integration: "ga4",
    dot: "#8b5cf6",
    badge: "border-violet-200 bg-violet-100 text-violet-800",
    icon: "border-violet-200 bg-violet-100 text-violet-700",
    branch: "text-violet-400",
    tile: "border-violet-300 ring-4 ring-violet-100",
  },
] as const;

type IntegrationId = (typeof events)[number]["integration"];

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "AUD", symbol: "A$" },
  { code: "SGD", symbol: "S$" },
  { code: "KRW", symbol: "₩" },
];

const wrap = (n: number, length: number) => ((n % length) + length) % length;

function ApertureMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m14.31 8 5.74 9.94" />
      <path d="M9.69 8h11.48" />
      <path d="m7.38 12 5.74-9.94" />
      <path d="M9.69 16 3.95 6.06" />
      <path d="M14.31 16H2.83" />
      <path d="m16.62 12-5.74 9.94" />
    </svg>
  );
}

function StripeLogo() {
  return <SiStripe className="size-5" color="#635BFF" aria-hidden />;
}

function GoogleCalendarLogo() {
  return <SiGooglecalendar className="size-5" color="#4285F4" aria-hidden />;
}

function GA4Logo() {
  return <SiGoogleanalytics className="size-5" color="#E37400" aria-hidden />;
}

const integrations: { id: IntegrationId; name: string; Logo: () => React.ReactElement }[] = [
  { id: "stripe", name: "Stripe", Logo: StripeLogo },
  { id: "gcal", name: "Google Calendar", Logo: GoogleCalendarLogo },
  { id: "ga4", name: "Google Analytics 4", Logo: GA4Logo },
];

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// A dot with a soft halo that glides the full length of its parent wire.
// Only transform and opacity animate. The wire is 0px thick on its cross axis,
// so "left-0"/"top-0" on that axis already sits on the line.
function TravelDot({
  axis,
  duration,
  color,
  className,
}: {
  axis: "x" | "y";
  duration: number;
  color: string;
  className?: string;
}) {
  const horizontal = axis === "x";
  const seconds = duration / 1000;
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-20", className)}
      initial={horizontal ? { x: "0%", opacity: 0 } : { y: "0%", opacity: 0 }}
      animate={
        horizontal
          ? { x: "100%", opacity: [0, 1, 1, 0] }
          : { y: "100%", opacity: [0, 1, 1, 0] }
      }
      transition={{
        x: { duration: seconds, ease: EASE_TRAVEL },
        y: { duration: seconds, ease: EASE_TRAVEL },
        opacity: { duration: seconds, times: [0, 0.15, 0.82, 1], ease: "linear" },
      }}
    >
      <span className={cn("absolute", horizontal ? "left-0 top-1/2" : "left-1/2 top-0")}>
        <span
          className="absolute left-0 top-0 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-md"
          style={{ background: color }}
        />
        <span
          className="absolute left-0 top-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          style={{ background: color }}
        />
        <span
          className="absolute left-0 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
          style={{ background: color }}
        />
      </span>
    </motion.div>
  );
}

function Connector({ travelKey, duration }: { travelKey: number | null; duration: number }) {
  return (
    // md+: 40px wires keep the whole flow (~590px) inside the ~614px project column in the rails.
    <div className="relative z-10 flex min-h-16 items-center text-blue-500 md:min-h-0 md:min-w-10">
      <div className="absolute inset-x-0 h-full w-px -translate-x-1/2 bg-current md:top-1/2 md:h-px md:w-full md:-translate-y-1/2 md:translate-x-0" />
      <div className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current bg-white md:left-0 md:top-1/2 md:-translate-x-1/2" />
      <div className="absolute bottom-px left-1/2 -translate-x-1/2 translate-y-1/2 md:bottom-auto md:left-auto md:right-px md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2">
        <Chevron className="size-3 rotate-90 md:rotate-0" />
      </div>
      {travelKey !== null ? (
        <>
          {/* Vertical on phones, horizontal from md. */}
          <TravelDot key={`y-${travelKey}`} axis="y" duration={duration} color="#3b82f6" className="md:hidden" />
          <TravelDot key={`x-${travelKey}`} axis="x" duration={duration} color="#3b82f6" className="hidden md:block" />
        </>
      ) : null}
    </div>
  );
}

export default function BookingEventFlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const animating = inView && !reduceMotion;

  // phase 0: dot to "Booking created" · 1: dot down the branch · 2: dot out to the currency · 3: rest.
  // Static frame (server, reduced motion, off-screen) is cycle 0 fully settled.
  const [{ cycle, phase }, setTick] = useState({ cycle: 0, phase: 3 });
  const cycleRef = useRef(0);

  const [glowScope, animateGlow] = useAnimate<HTMLDivElement>();
  const [cardScope, animateCard] = useAnimate<HTMLDivElement>();

  useEffect(() => {
    if (!animating) return;
    let timers: number[] = [];

    const run = () => {
      const next = cycleRef.current + 1;
      cycleRef.current = next;
      setTick({ cycle: next, phase: 0 });
      timers = [
        window.setTimeout(() => setTick({ cycle: next, phase: 1 }), LEG_IN_MS),
        window.setTimeout(() => setTick({ cycle: next, phase: 2 }), LEG_IN_MS + LEG_BRANCH_MS),
        window.setTimeout(
          () => setTick({ cycle: next, phase: 3 }),
          LEG_IN_MS + LEG_BRANCH_MS + LEG_OUT_MS,
        ),
        window.setTimeout(run, CYCLE_MS),
      ];
    };

    timers = [window.setTimeout(run, 500)];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [animating]);

  // Glow on departure, a small settle on the event card on arrival. Same nodes, never remounted.
  useEffect(() => {
    if (!animating) return;
    if (phase === 0 && glowScope.current) {
      animateGlow(
        glowScope.current,
        { opacity: [0, 0.45, 0], scale: [0.96, 1.04, 1] },
        { duration: 0.9, ease: EASE_OUT },
      );
    }
    if (phase === 1 && cardScope.current) {
      animateCard(
        cardScope.current,
        { scale: [1, 1.025, 1] },
        { duration: 0.45, ease: EASE_OUT },
      );
    }
  }, [animating, cycle, phase, animateGlow, animateCard, glowScope, cardScope]);

  const eventIndex = wrap(phase >= 1 ? cycle : cycle - 1, events.length);
  const integrationIndex = wrap(phase >= 2 ? cycle : cycle - 1, events.length);
  const currencyIndex = wrap(phase >= 3 ? cycle : cycle - 1, currencies.length);

  const activeEvent = events[eventIndex];
  const activeIntegration = events[integrationIndex].integration;
  const travellingEvent = events[wrap(cycle, events.length)];

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex size-full flex-col items-center justify-center overflow-x-clip py-6 sm:px-16 md:flex-row",
        className,
      )}
    >
      {/* Source: the booking site */}
      <div className="relative">
        <div
          ref={glowScope}
          aria-hidden
          className="absolute inset-0 rounded-[20px] bg-blue-500 opacity-0 blur-[10px]"
        />
        <div className="relative rounded-[20px] border border-neutral-200 bg-white p-2 shadow-sm">
          <div className="rounded-[12px] bg-gradient-to-b from-neutral-500 to-neutral-800 p-px">
            <div className="flex items-center justify-center gap-2.5 rounded-[11px] bg-gradient-to-b from-neutral-600 to-neutral-900 px-6 py-5 text-white">
              <ApertureMark className="size-7" />
              <span className="text-[22px] font-semibold leading-none tracking-[-0.04em]">
                TPS
              </span>
            </div>
          </div>
        </div>
        <p className="absolute left-1/2 top-full mt-2 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-neutral-400 md:block">
          book.tettyphotostudio.com
        </p>
      </div>

      <Connector travelKey={animating && phase === 0 ? cycle : null} duration={LEG_IN_MS} />

      {/* Event */}
      <div className="relative">
        {/* Phones: badge anchors to the card's left edge so it clears the vertical wire on the right. */}
        <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 -translate-y-full max-md:left-0 max-md:translate-x-0 min-[360px]:max-md:-left-16 max-[359px]:hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={activeEvent.label}
              className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border px-2 py-1 font-mono text-[11px] leading-none max-md:left-0 max-md:translate-x-0 md:text-[13px]",
                activeEvent.badge,
              )}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{
                y: { type: "spring", stiffness: 260, damping: 24 },
                opacity: { duration: 0.35, ease: EASE_OUT },
                filter: { duration: 0.35, ease: EASE_OUT },
              }}
            >
              {"short" in activeEvent ? (
                <>
                  <span className="md:hidden">{activeEvent.short}</span>
                  <span className="hidden md:inline">{activeEvent.label}</span>
                </>
              ) : (
                activeEvent.label
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div
          ref={cardScope}
          className="rounded-[16px] bg-gradient-to-b from-neutral-200 to-neutral-300 p-px shadow-sm min-[360px]:-ml-16 md:ml-0"
        >
          <div className="flex min-w-56 items-center gap-2 rounded-[15px] bg-white px-3 py-2 max-sm:min-w-44">
            <div
              className={cn(
                "rounded-[10px] border p-1.5 transition-colors duration-500 ease-out",
                activeEvent.icon,
              )}
            >
              <IconCalendarCheck className="size-4" stroke={1.75} />
            </div>
            <span className="text-sm font-medium text-neutral-800">
              Booking created
            </span>
          </div>
        </div>

        {/* Integrations that receive the event */}
        <div className="absolute left-full top-1/2 hidden -translate-y-1/2 min-[360px]:block md:left-1/2 md:top-full md:w-full md:-translate-x-1/2 md:translate-y-0">
          <div className="flex w-full items-center text-neutral-400 md:flex-col">
            <div className="flex h-full pl-1.5 md:hidden">
              <div className="w-3 border-t border-dashed border-current" />
            </div>
            <div className="flex flex-col justify-center gap-3.5 md:flex-row">
              {integrations.map(({ id, name, Logo }, index) => {
                const active = activeIntegration === id;
                const receiving = animating && phase === 1 && travellingEvent.integration === id;
                const tint = events.find((event) => event.integration === id)!;
                return (
                  <div key={id} className="relative flex items-center md:flex-col">
                    {index === 0 ? (
                      <div className="absolute left-0 top-1/2 block h-[calc(100%+1rem)] border-r border-dashed border-current md:hidden" />
                    ) : null}
                    {index === integrations.length - 1 ? (
                      <div className="absolute bottom-1/2 left-0 block h-[calc(100%+1rem)] border-r border-dashed border-current md:hidden" />
                    ) : null}
                    <div
                      className={cn(
                        "relative w-6 transition-colors duration-500 ease-out max-md:pr-1 md:h-12 md:w-fit md:pb-1.5 md:pt-1",
                        (active || receiving) && tint.branch,
                      )}
                    >
                      <div className="border-dashed border-current max-md:border-b md:h-full md:border-r" />
                      <Chevron className="absolute -right-0.5 top-1/2 size-3 -translate-y-1/2 md:-bottom-0.5 md:left-1/2 md:right-auto md:top-auto md:-translate-x-1/2 md:translate-y-0 md:rotate-90" />
                      {receiving ? (
                        <>
                          <TravelDot key={`bx-${cycle}`} axis="x" duration={LEG_BRANCH_MS} color={tint.dot} className="md:hidden" />
                          <TravelDot key={`by-${cycle}`} axis="y" duration={LEG_BRANCH_MS} color={tint.dot} className="hidden md:block" />
                        </>
                      ) : null}
                    </div>
                    <div
                      title={name}
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg border bg-white transition-[border-color,box-shadow] duration-500 ease-out",
                        active ? tint.tile : "border-neutral-200 ring-0 ring-transparent",
                      )}
                    >
                      <Logo />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Connector travelKey={animating && phase === 2 ? cycle : null} duration={LEG_OUT_MS} />

      {/* Deposit currencies: a spring carousel, faded at both ends by a mask. */}
      <div className="relative">
        <div className="relative h-24 w-36 rounded-[20px] border border-neutral-200 bg-white" />
        {/* Phones: neighbours slide in and out through a clipped, faded window around the card
            instead of peeking in half-cut at the page edge. */}
        <div className="pointer-events-none absolute -inset-x-8 inset-y-0 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_18%,black_82%,transparent)] md:-inset-y-28 md:inset-x-0 md:overflow-visible md:[mask-image:linear-gradient(transparent,black_36%,black_64%,transparent)]">
          {currencies.map((currency, index) => {
            let offset = index - currencyIndex;
            if (offset > currencies.length / 2) offset -= currencies.length;
            if (offset < -currencies.length / 2) offset += currencies.length;
            const visible = Math.abs(offset) <= 1;
            return (
              <motion.div
                key={currency.code}
                aria-hidden={offset !== 0}
                // --o drives translate per breakpoint (x on phones, y from md) so one spring serves both.
                className="absolute left-1/2 top-1/2 translate-x-[calc(-50%_+_var(--o)*150px)] translate-y-[-50%] md:translate-x-[-50%] md:translate-y-[calc(-50%_+_var(--o)*100px)]"
                style={{ "--o": offset } as React.CSSProperties}
                initial={false}
                animate={{
                  "--o": offset,
                  scale: offset === 0 ? 1 : 0.88,
                  opacity: visible ? (offset === 0 ? 1 : 0.5) : 0,
                }}
                transition={{
                  "--o": { type: "spring", stiffness: 170, damping: 24, mass: 0.9 },
                  scale: { type: "spring", stiffness: 170, damping: 24, mass: 0.9 },
                  opacity: { duration: 0.45, ease: EASE_OUT },
                }}
              >
                <div className="h-20 w-32 rounded-[12px] bg-gradient-to-b from-neutral-100 to-neutral-200 p-px shadow-sm">
                  <div className="flex size-full flex-col justify-center gap-1.5 rounded-[11px] bg-white px-3.5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-400">
                      Deposit in
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="flex h-7 min-w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-1.5 text-[13px] font-semibold text-neutral-700">
                        {currency.symbol}
                      </span>
                      <span className="text-[17px] font-semibold tracking-[-0.02em] text-neutral-900">
                        {currency.code}
                      </span>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

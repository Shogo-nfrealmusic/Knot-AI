"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import {
  IconArrowUpRight,
  IconBrandInstagram,
  IconCalendarEvent,
  IconChartLine,
  IconCheck,
  IconClock,
  IconCreditCard,
  IconCurrencyDollar,
  IconFileText,
  IconPlayerPlayFilled,
  IconPlugConnected,
  IconReceipt,
  IconRobot,
  IconShare,
  IconSparkles,
  IconTerminal2,
  IconVideo,
  IconWorld,
} from "@tabler/icons-react";
import { SiClaude, SiStripe } from "react-icons/si";
import { GridSection } from "@/app/components/ui/grid-section";
import { cn } from "@/lib/utils";

const chips = [
  {
    label: "Booking and payments",
    icon: IconCreditCard,
    chip: "bg-orange-400 text-orange-900",
    glow: "bg-orange-300",
    tilt: "rotate-[10deg]",
  },
  {
    label: "AI agents",
    icon: IconSparkles,
    chip: "bg-green-400 text-green-900",
    glow: "bg-green-300",
    tilt: "rotate-[-10deg]",
  },
  {
    label: "Content pipelines",
    icon: IconPlayerPlayFilled,
    chip: "bg-purple-400 text-purple-900",
    glow: "bg-purple-300",
    tilt: "rotate-[10deg]",
  },
];

function Chip({
  index,
  active,
  onActivate,
}: {
  index: number;
  active: boolean;
  onActivate: (index: number) => void;
}) {
  const { label, icon: Icon, chip, glow, tilt } = chips[index];

  return (
    <button
      type="button"
      aria-label={label}
      data-active={active}
      onMouseEnter={() => onActivate(index)}
      onFocus={() => onActivate(index)}
      className="group relative inline-block align-baseline outline-none"
    >
      <span
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 block h-10 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 mix-blend-multiply blur-xl transition-opacity duration-500 group-data-[active=true]:opacity-60",
          glow,
        )}
      />
      <span
        className={cn(
          "relative mx-0.5 inline-flex size-6 -translate-y-0.5 sm:size-7 items-center justify-center rounded-lg border border-black/5 transition-[transform,filter] duration-300 group-focus-visible:ring-2 group-focus-visible:ring-neutral-900/20 group-data-[active=true]:-translate-y-1.5 group-data-[active=true]:drop-shadow-md",
          chip,
          active && tilt,
        )}
      >
        <Icon className="size-[1.125rem]" stroke={2.5} />
      </span>
    </button>
  );
}

// --- Floating cards ---------------------------------------------------------

const card = "rounded-lg border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]";

function Tile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "absolute flex size-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 shadow-[0_1px_3px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[0.625rem] font-medium leading-none",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Stat({ icon, value, color }: { icon: ReactNode; value: string; color: string }) {
  return (
    <span className="flex items-center gap-0.5">
      <span className={cn("[&>svg]:size-2.5", color)}>{icon}</span>
      <span className="whitespace-nowrap font-medium leading-none text-neutral-600">{value}</span>
    </span>
  );
}

function Layer({ show, left, right }: { show: boolean; left: ReactNode; right: ReactNode }) {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-[transform,opacity] duration-500",
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
      )}
    >
      <div className="absolute inset-0 flex">
        <div className="relative h-full grow">{left}</div>
        <div className="w-full max-w-[530px] shrink-0" />
        <div className="relative h-full grow">{right}</div>
      </div>
    </div>
  );
}

const paymentsLeft = (
  <>
    <Tile className="right-40 top-[27%] rotate-[-15deg]">
      <IconWorld className="size-5" stroke={1.5} />
    </Tile>
    <Tile className="right-20 top-[23%] rotate-[10deg]">
      <IconCreditCard className="size-5" stroke={1.5} />
    </Tile>
    <div className="absolute right-6 top-[53%] w-60 rotate-[3deg]">
      <div className={cn(card, "p-3")}>
        <p className="text-[0.625rem] font-medium uppercase tracking-[0.08em] text-neutral-400">
          Booking flow
        </p>
        <div className="mt-2 flex items-center gap-0.5 whitespace-nowrap text-[0.5625rem] text-neutral-500">
          {["Plan", "Location", "Time slot", "Deposit"].map((step, i) => (
            <span key={step} className="flex items-center gap-0.5">
              {i > 0 ? <span className="text-neutral-300">→</span> : null}
              <span className="rounded border border-neutral-200 bg-neutral-50 px-1 py-0.5 text-neutral-700">
                {step}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
    <div className="absolute right-3 top-[40%] w-[262px] rotate-[-6deg]">
      <div className={cn(card, "flex items-center justify-between gap-2 p-3 text-[0.625rem]")}>
        <div className="flex min-w-0 items-center gap-1.5">
          <div className="flex-none rounded-full border border-neutral-200 bg-gradient-to-t from-neutral-100 p-1 text-neutral-900">
            <IconWorld className="size-3" stroke={2} />
          </div>
          <span className="truncate font-medium text-neutral-900">book.tettyphotostudio.com</span>
        </div>
        <span className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white p-1 text-[0.5rem]">
          <Stat icon={<IconCurrencyDollar stroke={2} />} value="33k/mo" color="text-blue-500" />
          <Stat icon={<IconReceipt stroke={2} />} value="754" color="text-purple-500" />
        </span>
      </div>
    </div>
  </>
);

const paymentsRight = (
  <>
    <Tile className="left-20 top-[21%] rotate-[-10deg]">
      <IconCalendarEvent className="size-5" stroke={1.5} />
    </Tile>
    <Tile className="left-40 top-[26%] rotate-[15deg]">
      <IconChartLine className="size-5" stroke={1.5} />
    </Tile>
    <div className="absolute left-8 top-[39%] w-52 rotate-[-5deg]">
      <div className={card}>
        <div className="flex items-center justify-between gap-2 p-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-800">
            <SiStripe className="size-3.5 text-[#635BFF]" />
            Deposit
          </span>
          <Pill className="border-green-200 bg-green-50 text-green-700">
            <IconCheck className="size-2.5" stroke={3} />
            Paid
          </Pill>
        </div>
        <div className="flex flex-col gap-2 border-t border-neutral-200 p-3 text-xs leading-none">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-neutral-400">At booking</span>
            <span className="text-neutral-900">30%</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-neutral-400">After the shoot</span>
            <span className="text-neutral-900">70% · auto</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-neutral-400">Currency</span>
            <span className="text-neutral-900">Customer&apos;s own</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 border-t border-neutral-200 px-3 py-2.5 text-[0.6875rem] text-neutral-500">
          <IconCalendarEvent className="size-3.5 text-blue-500" stroke={1.75} />
          Photographer assigned · calendar synced
        </div>
      </div>
    </div>
  </>
);

const agentsLeft = (
  <>
    <Tile className="right-40 top-[25%] rotate-[15deg]">
      <IconRobot className="size-5" stroke={1.5} />
    </Tile>
    <Tile className="right-20 top-[29%] rotate-[-10deg]">
      <IconTerminal2 className="size-5" stroke={1.5} />
    </Tile>
    <div className="absolute right-10 top-[40%] w-56 rotate-[-7deg]">
      <div className={card}>
        <div className="flex items-center justify-between gap-2 p-3">
          <span className="text-xs font-medium text-neutral-800">Mercari PM agent</span>
          <Pill className="border-green-200 bg-green-50 text-green-700">In use</Pill>
        </div>
        <ol className="flex flex-col gap-2.5 border-t border-neutral-200 p-3 text-xs leading-none">
          {["Problem signals", "PRD draft", "UI prototype"].map((step, i) => (
            <li key={step} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="flex size-4 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 font-mono text-[0.5625rem] text-neutral-500">
                  {i + 1}
                </span>
                <span className="font-medium text-neutral-600">{step}</span>
              </span>
              <IconCheck className="size-3.5 text-green-500" stroke={2.5} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  </>
);

const agentsRight = (
  <>
    <Tile className="left-20 top-[24%] rotate-[10deg]">
      <IconPlugConnected className="size-5" stroke={1.5} />
    </Tile>
    <Tile className="left-40 top-[21%] rotate-[-15deg]">
      <IconFileText className="size-5" stroke={1.5} />
    </Tile>
    <div className="absolute left-4 top-[49%] w-[210px] rotate-[-4deg]">
      <div className={cn(card, "flex items-center justify-between gap-3 p-3")}>
        <div className="flex flex-col gap-1.5">
          <span className="text-[0.625rem] font-medium leading-none text-neutral-400">Published</span>
          <span className="text-xs font-medium leading-none text-neutral-800">Mercari Engineering</span>
        </div>
        <IconArrowUpRight className="size-4 text-neutral-400" stroke={1.75} />
      </div>
    </div>
    <div className="absolute left-8 top-[37%] h-[72px] w-[210px] rotate-[6deg]">
      <div className={cn(card, "flex size-full items-center gap-3 p-1.5")}>
        <div className="flex aspect-square h-full items-center justify-center rounded-md border border-orange-200 bg-orange-50">
          <SiClaude className="size-6 text-[#D97757]" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[0.6875rem] font-medium leading-none text-neutral-800">Claude Code</span>
          <div className="flex divide-x divide-neutral-200 text-[0.625rem] leading-none">
            <span className="pr-2 font-medium text-neutral-500">MCP</span>
            <span className="pl-2 font-medium text-neutral-500">Anthropic API</span>
          </div>
        </div>
      </div>
    </div>
  </>
);

const contentLeft = (
  <>
    <Tile className="right-40 top-[30%] rotate-[-15deg]">
      <IconVideo className="size-5" stroke={1.5} />
    </Tile>
    <Tile className="right-20 top-[25%] rotate-[10deg]">
      <IconClock className="size-5" stroke={1.5} />
    </Tile>
    <div className="absolute right-8 top-[41%] w-60 rotate-[-5deg]">
      <div className={card}>
        <div className="flex items-center justify-between gap-2 p-3">
          <span className="text-xs font-medium text-neutral-800">Every morning</span>
          <Pill className="border-green-200 bg-green-50 text-green-700">No human input</Pill>
        </div>
        <div className="border-t border-neutral-200 p-3">
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className="flex aspect-[9/16] items-center justify-center rounded-[3px] border border-purple-200 bg-gradient-to-b from-purple-100 to-purple-200"
              >
                <IconPlayerPlayFilled className="size-2 text-purple-500" />
              </span>
            ))}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs leading-none">
            <span className="font-medium text-neutral-400">Rendered</span>
            <span className="text-neutral-900">10 videos</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-neutral-200 px-3 py-2.5 text-[0.6875rem] leading-none">
          <span className="text-neutral-500">Monthly views</span>
          <span className="font-medium text-neutral-900">66k+</span>
        </div>
      </div>
    </div>
  </>
);

const contentRight = (
  <>
    <Tile className="left-20 top-[28%] rotate-[10deg]">
      <IconBrandInstagram className="size-5" stroke={1.5} />
    </Tile>
    <Tile className="left-40 top-[24%] rotate-[-15deg]">
      <IconShare className="size-5" stroke={1.5} />
    </Tile>
    <div className="absolute left-8 top-[39%] w-52 rotate-[-7deg]">
      <div className={card}>
        <div className="flex items-center gap-2.5 p-3">
          <Image
            src="/images/profile/shogo-instagram.jpg"
            alt=""
            width={88}
            height={88}
            className="size-10 rounded-full border border-neutral-200 object-cover"
          />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="truncate text-[0.8125rem] font-medium leading-none text-neutral-900">@imshogo.k</span>
            <span className="text-[0.6875rem] leading-none text-neutral-500">Fitness · self-growth</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 border-t border-neutral-200 px-3 pb-2.5 pt-3 text-xs leading-none">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-neutral-400">Followers</span>
            <span className="text-neutral-600">29,000</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-neutral-400">Videos past 1M</span>
            <span className="text-neutral-600">Multiple</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-neutral-400">Leading signal</span>
            <span className="text-neutral-600">Shares</span>
          </div>
        </div>
      </div>
    </div>
  </>
);

const layers = [
  { left: paymentsLeft, right: paymentsRight },
  { left: agentsLeft, right: agentsRight },
  { left: contentLeft, right: contentRight },
];

// --- Section ------------------------------------------------------------------

const IDLE_MS = 3500;

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const lastInput = useRef(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    // Tracks the text block: 0 as it rises past 80% of the viewport, 1 as its end passes 40%.
    offset: ["start 0.8", "end 0.4"],
  });

  // Reveal the text as the section scrolls through, like a reading cursor.
  const revealed = useTransform(scrollYProgress, (v) => v * 100);
  const faded = useTransform(scrollYProgress, (v) => v * 100 + 75);
  const mask = useMotionTemplate`linear-gradient(black ${revealed}%, #0003 ${faded}%)`;
  const lift = useTransform(scrollYProgress, (v) => v * -75);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (reduceMotion) return;
    lastInput.current = Date.now();
    setActive(v < 0.3 ? 0 : v < 0.6 ? 1 : 2);
  });

  // When the reader stops scrolling with the section on screen, keep cycling.
  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = setInterval(() => {
      if (Date.now() - lastInput.current >= IDLE_MS) {
        setActive((a) => (a + 1) % chips.length);
      }
    }, IDLE_MS);
    return () => clearInterval(id);
  }, [inView, reduceMotion]);

  const activate = (index: number) => {
    lastInput.current = Date.now();
    setActive(index);
  };

  return (
    <GridSection innerClassName="px-4 pb-16 pt-32 sm:pb-32 sm:pt-40">
      <motion.div
        ref={ref}
        className="relative isolate mx-auto max-w-[530px] bg-white"
        style={reduceMotion ? undefined : { maskImage: mask, WebkitMaskImage: mask, y: lift }}
      >
        <div className="space-y-8 text-[22px] leading-snug tracking-[-0.02em] text-neutral-800 sm:text-3xl">
          <p>
            Software isn&apos;t the finish line.
            <br />
            Running it is.
          </p>
          <p>
            I build booking and payments{" "}
            <Chip index={0} active={active === 0} onActivate={activate} /> AI agents{" "}
            <Chip index={1} active={active === 1} onActivate={activate} /> and content
            pipelines <Chip index={2} active={active === 2} onActivate={activate} /> – then
            run a real business on them every day.
          </p>
          <p>Shipped solo. Measured in revenue, not demos.</p>
          <p>Because you deserve a system that still works next month.</p>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-4 inset-y-16 -z-10 mix-blend-darken" aria-hidden>
        <svg className="absolute inset-0 text-neutral-200/80" width="100%" height="100%">
          <defs>
            <pattern id="manifesto-dots" x="-1" y="-1" width="12" height="12" patternUnits="userSpaceOnUse">
              <rect x="1" y="1" width="2" height="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect fill="url(#manifesto-dots)" width="100%" height="100%" />
        </svg>
      </div>

      {/* The side columns are only wide enough for the cards once the rails reach 1080px. */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block" aria-hidden>
        {layers.map((layer, index) => (
          <Layer key={chips[index].label} show={active === index} left={layer.left} right={layer.right} />
        ))}
      </div>
    </GridSection>
  );
}

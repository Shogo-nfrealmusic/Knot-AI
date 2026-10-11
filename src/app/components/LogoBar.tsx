"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useInView, useReducedMotion } from "motion/react";
import {
  IconArrowUpRight,
  IconBrandAws,
  IconBrandOpenai,
} from "@tabler/icons-react";
import {
  SiClaude,
  SiCloudflare,
  SiExpo,
  SiGo,
  SiGoogleanalytics,
  SiGooglecalendar,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiStripe,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import { GridSection } from "@/app/components/ui/grid-section";
import { cn } from "@/lib/utils";

type Logo = { name: string; Icon: ComponentType<{ className?: string }> };

const FLIP_MS = 3000;

// Five slots, each flipping through three tools from the production stack.
const slots: Logo[][] = [
  [
    { name: "Next.js", Icon: SiNextdotjs },
    { name: "Stripe", Icon: SiStripe },
    { name: "Claude", Icon: SiClaude },
  ],
  [
    { name: "TypeScript", Icon: SiTypescript },
    { name: "AWS", Icon: IconBrandAws },
    { name: "OpenAI", Icon: IconBrandOpenai },
  ],
  [
    { name: "Go", Icon: SiGo },
    { name: "Cloudflare", Icon: SiCloudflare },
    { name: "React Native", Icon: SiReact },
  ],
  [
    { name: "PostgreSQL", Icon: SiPostgresql },
    { name: "Vercel", Icon: SiVercel },
    { name: "Google Analytics", Icon: SiGoogleanalytics },
  ],
  [
    { name: "Python", Icon: SiPython },
    { name: "Expo", Icon: SiExpo },
    { name: "Google Calendar", Icon: SiGooglecalendar },
  ],
];

// Keep rows full: 2 columns show 4 slots, 3 columns show 3, 5 columns show all.
const slotVisibility = ["", "", "", "sm:max-md:hidden", "max-md:hidden"];

const companies = [
  {
    name: "Mercari",
    role: "Product Management",
    href: "https://about.mercari.com/en/",
  },
  {
    name: "ByteDance Japan",
    role: "TikTok Shop Operations",
    href: "https://www.bytedance.com/ja/",
  },
  {
    name: "TPS Collective",
    role: "Co-founder & CTO",
    href: "https://www.tps-collective.com/",
  },
];

function LogoFlipper() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = setInterval(() => setStep((s) => s + 1), FLIP_MS);
    return () => clearInterval(id);
  }, [inView, reduceMotion]);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 items-center gap-4 px-4 py-10 sm:grid-cols-3 sm:px-10 md:grid-cols-5"
    >
      {slots.map((logos, slotIndex) => {
        const active = step % logos.length;
        const delay = `${slotIndex * 50}ms`;
        return (
          <div
            key={logos[0].name}
            className={cn("relative h-12 [perspective:600px]", slotVisibility[slotIndex])}
          >
            {logos.map(({ name, Icon }, index) => {
              const isActive = index === active;
              return (
                <div
                  key={name}
                  aria-hidden={!isActive}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    !isActive && "opacity-0",
                  )}
                  style={{ transitionDelay: delay }}
                >
                  <div
                    className={cn(
                      "absolute inset-x-0 inset-y-3 flex items-center justify-center gap-2 text-neutral-800 opacity-90 transition-transform duration-500",
                      !isActive && "[transform:rotateX(100deg)]",
                    )}
                    style={{ transitionDelay: delay }}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="whitespace-nowrap text-[15px] font-semibold tracking-[-0.02em]">
                      {name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function LogoBar() {
  return (
    <GridSection>
      <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 sm:px-10">
        <span className="size-1.5 rounded-full bg-neutral-300" />
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500">
          Shipped with
        </p>
      </div>

      <LogoFlipper />

      <ul className="grid border-t border-neutral-200 sm:grid-cols-3" data-logo-bar>
        {companies.map((company, index) => (
          <li
            key={company.name}
            className={
              index > 0 ? "border-t border-neutral-200 sm:border-l sm:border-t-0" : ""
            }
          >
            <a
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 px-4 py-5 transition-colors duration-150 hover:bg-neutral-50 sm:px-10"
            >
              <span>
                <span className="block text-[17px] font-semibold tracking-[-0.02em] text-neutral-600 transition-colors duration-150 group-hover:text-neutral-900">
                  {company.name}
                </span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                  {company.role}
                </span>
              </span>
              <IconArrowUpRight className="size-4 text-neutral-300 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700" />
            </a>
          </li>
        ))}
      </ul>
    </GridSection>
  );
}

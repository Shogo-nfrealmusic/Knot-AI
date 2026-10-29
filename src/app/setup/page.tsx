import type { CSSProperties } from "react";
import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import { GridSection } from "@/app/components/ui/grid-section";
import { FOUNDING } from "@/lib/setup";
import { cn } from "@/lib/utils";
import Pricing from "./Pricing";
import RunLog from "./RunLog";

export const metadata: Metadata = {
  title: "Copilot OS Setup | Shogo Kikuchi",
  description:
    "I set up Claude Code to run parts of your business, then add one more job it does for you every month. The same setup two of us run our company on.",
  alternates: { canonical: "/setup" },
};

const entrance = "animate-[hero-slide-up-fade_1s_both] motion-reduce:animate-[hero-fade_1s_both]";

function stagger(delayMs: number, offsetPx: number): CSSProperties {
  return { animationDelay: `${delayMs}ms`, "--offset": `${offsetPx}px` } as CSSProperties;
}

export default function SetupPage() {
  const left = FOUNDING.seats - FOUNDING.taken;
  return (
    <SitePageLayout>
      <GridSection className="border-t-0" innerClassName="pt-32 sm:pt-40">
        <style>{`
@keyframes hero-slide-up-fade { from { opacity: 0; transform: translateY(var(--offset, 10px)); } to { opacity: 1; transform: none; } }
@keyframes hero-fade { from { opacity: 0; } to { opacity: 1; } }
`}</style>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-composite:intersect] [mask-image:linear-gradient(transparent,black),radial-gradient(130%_50%_at_50%_100%,transparent,black)]"
        >
          <GridPattern
            cellSize={60}
            strokeWidth={2}
            patternOffset={[0, 1]}
            className="inset-[unset] bottom-0 left-1/2 h-[600px] w-[1080px] -translate-x-1/2 text-neutral-200"
          />
        </div>

        <div className="relative grid gap-14 px-4 pb-20 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-12 lg:pb-24">
          <div>
            <div
              className={cn(entrance, "flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-white py-1.5 pl-3 pr-3.5 text-xs font-medium text-neutral-800 drop-shadow-sm")}
              style={stagger(0, 10)}
            >
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--warm)] opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[var(--warm)]" />
              </span>
              {left} of {FOUNDING.seats} founding seats left
            </div>

            <h1 className={cn(entrance, "mt-6 text-balance type-display text-text-primary")} style={stagger(100, 20)}>
              Claude Code that runs{" "}
              <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.01em] text-neutral-500">your business,</span>{" "}
              not just your code.
            </h1>

            <p
              className={cn(entrance, "mt-8 max-w-lg text-pretty text-[16px] leading-[1.75] tracking-[-0.011em] text-neutral-600")}
              style={stagger(200, 10)}
            >
              I&apos;m the CTO of a two-person company in Tokyo, and Claude Code does the jobs on the right for us. I set the same
              system up for your business, then build one more job it takes off your plate every month.
            </p>

            <div className={cn(entrance, "mt-10 flex flex-wrap items-center gap-3")} style={stagger(300, 5)}>
              <a
                href="#apply"
                className="group inline-flex h-11 items-center gap-2 rounded-lg border border-black bg-black px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200 active:scale-[0.96]"
              >
                Apply for a seat
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </a>
              <a
                href="#pricing"
                className="inline-flex h-11 items-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 hover:ring-4 hover:ring-black/5 active:scale-[0.96]"
              >
                See pricing
              </a>
            </div>
            <p className={cn(entrance, "mt-4 text-[13px] text-neutral-500")} style={stagger(350, 5)}>
              Monthly. Pause or cancel anytime. I never log in to your computer.
            </p>
          </div>

          <div className={entrance} style={stagger(250, 24)}>
            <RunLog />
          </div>
        </div>
      </GridSection>

      <GridSection innerClassName="py-20 sm:py-28" >
        <div id="pricing" className="scroll-mt-24 px-4 text-center sm:px-10">
          <h2 className="type-heading text-balance text-text-primary">One flat monthly price. No hourly billing.</h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[16px] leading-[1.75] text-neutral-600">
            Pay longer up front and it costs less. Every plan starts with your Copilot OS set up in the first month.
          </p>
        </div>
        <div className="mt-12">
          <Pricing />
        </div>
      </GridSection>
    </SitePageLayout>
  );
}

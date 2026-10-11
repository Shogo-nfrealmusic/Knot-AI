import type { CSSProperties } from "react";
import Link from "next/link";
import HeroStats from "@/app/components/HeroStats";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import { GridSection } from "@/app/components/ui/grid-section";
import { cn } from "@/lib/utils";

// dub.co-style entrance: slide up and fade in, staggered. Reduced motion only fades.
const entrance =
  "animate-[hero-slide-up-fade_1s_both] motion-reduce:animate-[hero-fade_1s_both]";

function stagger(delayMs: number, offsetPx: number): CSSProperties {
  return {
    animationDelay: `${delayMs}ms`,
    "--offset": `${offsetPx}px`,
  } as CSSProperties;
}

const tags = ["AI Automation", "Full-Stack", "EN · JP"];

function Tags({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-500",
        className,
      )}
    >
      {tags.map((tag, index) => (
        <span key={tag} className="flex items-center gap-1.5">
          {index > 0 ? <span className="text-neutral-300">/</span> : null}
          {tag}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  return (
    <GridSection className="border-t-0" innerClassName="pt-32 sm:pt-40">
      <style>{`
@keyframes hero-slide-up-fade { from { opacity: 0; transform: translateY(var(--offset, 10px)); } to { opacity: 1; transform: none; } }
@keyframes hero-fade { from { opacity: 0; } to { opacity: 1; } }
`}</style>

      {/* Grid backdrop: beside the rails on both sides, fading up and outward. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-image:linear-gradient(transparent,black)]"
      >
        <div className="absolute inset-x-[360px] inset-y-0">
          <GridPattern
            cellSize={60}
            strokeWidth={2}
            patternOffset={[1, 1]}
            className="inset-[unset] bottom-0 right-full h-[600px] w-[360px] text-neutral-200 [mask-image:linear-gradient(90deg,transparent,black)]"
          />
          <GridPattern
            cellSize={60}
            strokeWidth={2}
            patternOffset={[0, 1]}
            className="inset-[unset] bottom-0 left-full h-[600px] w-[360px] text-neutral-200 [mask-image:linear-gradient(270deg,transparent,black)]"
          />
        </div>
      </div>
      {/* Inside the rails: grid at the bottom corners, clear behind the content. */}
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

      <div className="relative px-4 sm:px-10">
        <div
          className={cn(
            entrance,
            "flex w-fit items-center divide-neutral-300 rounded-full border border-neutral-300 bg-white text-xs font-medium drop-shadow-sm sm:divide-x",
          )}
          style={stagger(0, 10)}
        >
          <span className="flex items-center gap-2 py-1.5 pl-3 pr-3 text-neutral-800 sm:pr-2.5">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            Taking new projects
          </span>
          <Tags className="hidden py-1.5 pl-2.5 pr-4 sm:flex" />
        </div>
        <Tags className="mt-3 flex sm:hidden" />

        <h1
          className={cn(entrance, "mt-6 max-w-4xl text-balance type-display text-text-primary")}
          style={stagger(100, 20)}
        >
          I build software,{" "}
          <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.01em] text-neutral-500">
            run it in a real business,
          </span>{" "}
          and grow the audience around it.
        </h1>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <p
            className={cn(
              entrance,
              "max-w-xl text-pretty text-[16px] leading-[1.75] tracking-[-0.011em] text-neutral-600",
            )}
            style={stagger(200, 10)}
          >
            I&apos;m the co-founder and CTO of a Tokyo company serving inbound
            travelers. I built the booking platform, the internal tools, and
            the AI automation behind it, and I run the business that depends
            on them every day.
          </p>
          <div
            className={cn(entrance, "flex flex-wrap items-center gap-3")}
            style={stagger(300, 5)}
          >
            <Link
              href="/work"
              className="group inline-flex h-10 items-center gap-2 rounded-lg border border-black bg-black px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200"
            >
              See my work
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 hover:ring-4 hover:ring-black/5"
            >
              Get in touch
            </Link>
          </div>
        </div>

        <div className={entrance} style={stagger(400, 10)}>
          <HeroStats />
        </div>
      </div>
    </GridSection>
  );
}

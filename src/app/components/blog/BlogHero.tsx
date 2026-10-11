import CategoryNav, { type CategoryNavItem } from "@/app/components/blog/CategoryNav";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import { GridSection } from "@/app/components/ui/grid-section";

// dub /blog hero: grid backdrop beside and under the rails, left-aligned title, category pills.
export default function BlogHero({ items }: { items: CategoryNavItem[] }) {
  return (
    <GridSection
      className="border-t-0"
      innerClassName="border-x-0 px-4 pb-6 pt-28 sm:px-12 sm:pb-20 sm:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 border-x border-neutral-200 [mask-image:linear-gradient(transparent,black)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 w-[1800px] -translate-x-1/2 [mask-image:linear-gradient(transparent,black)]"
      >
        <div className="absolute inset-x-[360px] inset-y-0">
          <GridPattern
            cellSize={60}
            strokeWidth={2}
            patternOffset={[1, 1]}
            className="inset-[unset] bottom-0 right-full h-[600px] w-[360px] text-neutral-200/60 [mask-image:linear-gradient(90deg,transparent,black)]"
          />
          <GridPattern
            cellSize={60}
            strokeWidth={2}
            patternOffset={[0, 1]}
            className="inset-[unset] bottom-0 left-full h-[600px] w-[360px] text-neutral-200/60 [mask-image:linear-gradient(270deg,transparent,black)]"
          />
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-image:linear-gradient(transparent,black)]"
      >
        <GridPattern
          cellSize={60}
          strokeWidth={2}
          patternOffset={[0, 1]}
          className="inset-[unset] bottom-0 left-1/2 h-[600px] w-[1080px] -translate-x-1/2 text-neutral-200/60"
        />
      </div>

      <div className="relative">
        <h1 className="mt-5 animate-slide-up-fade text-left text-4xl font-medium tracking-[-0.03em] text-neutral-900 [--offset:20px] sm:text-5xl sm:leading-[1.15]">
          Blog
        </h1>
        <p className="mt-6 animate-slide-up-fade text-lg text-neutral-500 [--offset:10px] [animation-delay:100ms] sm:text-xl">
          Notes on building, shipping, and measuring the systems I run.
        </p>
        <CategoryNav items={items} />
      </div>
    </GridSection>
  );
}

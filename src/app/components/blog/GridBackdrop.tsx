import { GridPattern } from "@/app/components/ui/grid-pattern-dub";

// dub's page-hero backdrop: 60px grid beside and under the 1080px rails, fading upward.
export default function GridBackdrop() {
  return (
    <>
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
    </>
  );
}

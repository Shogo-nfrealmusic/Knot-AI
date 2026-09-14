import { cn } from "@/lib/utils";

// dub.co page frame: full-bleed hairlines top/bottom, 1080px rails left/right.
// Consecutive sections share one border (the later one drops its top border).
export function GridSection({
  className,
  innerClassName,
  children,
}: {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid-section relative overflow-clip border-y border-neutral-200 px-4 [.grid-section_~_&]:border-t-0",
        className,
      )}
    >
      <div
        className={cn(
          "relative z-0 mx-auto max-w-[1080px] border-x border-neutral-200",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

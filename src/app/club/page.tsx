import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import { GridSection } from "@/app/components/ui/grid-section";
import { CARD, Check, KitList, entrance, stagger } from "@/app/os/parts";
import { CLUB, CLUB_FORM } from "@/lib/os";
import { cn } from "@/lib/utils";

// The waitlist for Operators, the monthly community. Not open, not priced, not linked from anywhere and not
// indexed yet (decided 2026-11-21): it only collects who wants in.
export const metadata: Metadata = {
  title: "Operators | Shogo Kikuchi",
  description: "A small room for people building a business that runs on AI. Join the list to get in first.",
  robots: { index: false, follow: false },
};

export default function ClubPage() {
  return (
    <SitePageLayout>
      <GridSection className="border-t-0" innerClassName="pb-16 pt-24 sm:pb-20 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-image:linear-gradient(transparent,black)]">
          <GridPattern cellSize={60} strokeWidth={2} patternOffset={[0, 1]} className="inset-[unset] bottom-0 left-1/2 h-[700px] w-[1080px] -translate-x-1/2 text-neutral-200" />
        </div>
        <div className="relative px-4 text-center sm:px-10">
          <p className={cn(entrance, "text-[15px] font-medium text-[var(--warm)]")} style={stagger(0, 10)}>
            {CLUB.name}
          </p>
          <h1 className={cn(entrance, "mx-auto mt-5 max-w-[16ch] text-balance type-display text-text-primary")} style={stagger(100, 20)}>
            {CLUB.title}{" "}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.01em] text-neutral-500">{CLUB.accent}</span>
          </h1>
          <div className={cn(entrance, "mx-auto mt-6 max-w-[56ch] space-y-4 text-pretty text-[16px] leading-[1.75] text-neutral-600")} style={stagger(200, 10)}>
            {CLUB.intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      </GridSection>

      <GridSection>
        <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-neutral-200">
          <div className="px-5 py-14 sm:px-10 sm:py-20">
            <p className="text-[17px] font-semibold text-neutral-900">{CLUB.insideTitle}</p>
            <ul className="mt-6 border-y border-neutral-200">
              {CLUB.inside.map((item) => (
                <li key={item} className="flex gap-3 border-t border-neutral-200 py-4 text-[16px] leading-relaxed text-neutral-700 first:border-t-0">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 py-14 max-lg:border-t max-lg:border-neutral-200 sm:px-10 sm:py-20">
            <div className={cn(CARD, "p-6 sm:p-8")}>
              <p className="mb-6 text-[17px] leading-[1.6] text-neutral-700">
                <strong className="font-semibold text-neutral-900">{CLUB.closed.strong}</strong>
                {CLUB.closed.rest}
              </p>
              <KitList
                form={CLUB_FORM}
                email={CLUB.email}
                button={CLUB.button}
                question={
                  <>
                    {CLUB.question.before}
                    <strong className="font-semibold text-neutral-900">{CLUB.question.strong}</strong>
                  </>
                }
              />
            </div>
            <p className="mt-5 text-[13px] italic text-neutral-500">{CLUB.footnote}</p>
          </div>
        </div>
      </GridSection>
    </SitePageLayout>
  );
}

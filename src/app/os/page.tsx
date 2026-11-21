import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { CtaLink } from "@/app/components/CtaLink";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import { GridSection } from "@/app/components/ui/grid-section";
import {
  DISCLAIMER,
  FAQ,
  FAQ_TITLE,
  FOR,
  GUARD_SCREEN,
  HERO,
  INSIDE,
  JOBS,
  JOBS_HEAD,
  JOBS_NOTE,
  MODULES,
  NOT_FOR,
  OS_CHECKOUT_URL,
  OS_NOTIFY_FORM,
  OS_UI,
  PLANS,
  PRICING_NOTES,
  PRICING_TITLE,
  STARTER_HREF,
  STORY,
  TEAM_SCREEN,
  buyState,
  type OsPlan,
} from "@/lib/os";
import { cn } from "@/lib/utils";
import { CARD, Check, Cross, Heading, KitList, PRIMARY, SECONDARY, ScreenShot, entrance, stagger } from "./parts";

// Not linked from the nav, the footer, /free/starter or the sitemap yet, and not indexed (decided 2026-11-21).
export const metadata: Metadata = {
  title: "Copilot OS | Shogo Kikuchi",
  description: "The exact Claude Code setup behind a six-figure company run by two people.",
  robots: { index: false, follow: false },
};

const buy = buyState(OS_CHECKOUT_URL);

function PlanButton({ plan }: { plan: OsPlan }) {
  const dark = "inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 px-4 text-center text-[15px] font-semibold text-white transition-transform duration-300 hover:bg-black active:scale-[0.97]";
  const light = "inline-flex h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 text-center text-[15px] font-semibold text-neutral-900 transition-transform duration-300 hover:bg-neutral-50 active:scale-[0.97]";
  if (plan.id === "starter") {
    return (
      <CtaLink place="os-pricing-starter" href={STARTER_HREF} className={light}>
        {HERO.primary}
      </CtaLink>
    );
  }
  if (plan.id === "founding") {
    return (
      <CtaLink place="os-pricing-founding" href={OS_UI.foundingHref} className={light}>
        {OS_UI.founding}
      </CtaLink>
    );
  }
  if (buy.mode === "buy") {
    return (
      <CtaLink place="os-pricing-os" href={buy.href} target="_blank" rel="noopener noreferrer" className={dark}>
        {OS_UI.buy}
      </CtaLink>
    );
  }
  return (
    <a href="#notify" className={dark}>
      {OS_UI.notifyButton}
    </a>
  );
}

export default function OsPage() {
  return (
    <SitePageLayout>
      {/* promise */}
      <GridSection className="border-t-0" innerClassName="pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-image:linear-gradient(transparent,black)]">
          <GridPattern cellSize={60} strokeWidth={2} patternOffset={[0, 1]} className="inset-[unset] bottom-0 left-1/2 h-[700px] w-[1080px] -translate-x-1/2 text-neutral-200" />
        </div>
        <div className="relative px-4 text-center sm:px-10">
          <h1 className={cn(entrance, "text-[15px] font-medium text-[var(--warm)]")} style={stagger(0, 10)}>
            {HERO.name}
          </h1>
          <h2 className={cn(entrance, "mx-auto mt-5 max-w-[17ch] text-balance type-display text-text-primary")} style={stagger(100, 20)}>
            {HERO.title}{" "}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.01em] text-neutral-500">{HERO.accent}</span>
          </h2>
          <div className={cn(entrance, "mx-auto mt-6 max-w-[60ch] text-pretty text-[16px] leading-[1.75] text-neutral-600")} style={stagger(200, 10)}>
            {HERO.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className={cn(entrance, "mt-9 flex flex-wrap items-center justify-center gap-3")} style={stagger(300, 5)}>
            <CtaLink place="os-hero" href={STARTER_HREF} className={PRIMARY}>
              {HERO.primary}
            </CtaLink>
            <a href="#inside" className={SECONDARY}>
              {HERO.secondary}
            </a>
          </div>
        </div>
        <div className={cn(entrance, "relative mx-auto mt-14 max-w-[680px] px-4 pb-16 sm:mt-16 sm:pb-20")} style={stagger(400, 20)}>
          <ScreenShot screen={TEAM_SCREEN} eager />
        </div>
      </GridSection>

      {/* why */}
      <GridSection innerClassName="py-20 sm:py-28">
        <Heading title={STORY.title} accent={STORY.accent} />
        <div className="mx-auto mt-10 max-w-[58ch] space-y-6 px-5 text-[17px] leading-[1.7] text-neutral-700">
          {STORY.blocks.map((block) => (
            <p key={block[0]}>
              {block.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          ))}
        </div>
      </GridSection>

      {/* proof */}
      <GridSection innerClassName="py-20 sm:py-28">
        <Heading title={JOBS_HEAD.title} accent={JOBS_HEAD.accent} />
        <div role="table" className="mx-4 mt-12 border-y border-neutral-200 sm:mx-10">
          <div role="row" className="hidden grid-cols-[1.1fr_1fr_2fr] gap-6 py-3 text-[13px] text-neutral-500 sm:grid">
            {JOBS_HEAD.columns.map((column) => (
              <span key={column} role="columnheader">
                {column}
              </span>
            ))}
          </div>
          {JOBS.map((row) => (
            <div key={row.job} role="row" className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-neutral-200 py-5 max-sm:[&:nth-child(2)]:border-t-0 sm:grid-cols-[1.1fr_1fr_2fr]">
              <span role="cell" className="text-[16px] font-medium text-neutral-900">
                {row.job}
              </span>
              <span role="cell" className="text-[15px] leading-relaxed text-neutral-500">
                <span className="mr-2 inline-block w-14 text-[13px] text-neutral-400 sm:hidden">{JOBS_HEAD.columns[1]}</span>
                {row.before}
              </span>
              <span role="cell" className="flex text-[15px] leading-relaxed text-neutral-800 sm:block">
                <span className="mr-2 inline-block w-14 shrink-0 pt-px text-[13px] text-neutral-400 sm:hidden">{JOBS_HEAD.columns[2]}</span>
                <span>{row.now}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-[44ch] px-4 text-center text-[17px] leading-[1.6] text-neutral-900">{JOBS_NOTE}</p>
        <div className="mt-10 gap-5 px-4 sm:columns-2 sm:px-10">
          {JOBS.map((row) => (
            <ScreenShot key={row.job} screen={row.screen} caption={row.job} className="mb-8 break-inside-avoid" />
          ))}
        </div>
      </GridSection>

      {/* what's inside */}
      <GridSection innerClassName="py-20 sm:py-28">
        <Heading id="inside" title={INSIDE.title} />
        <div className="mt-12 grid gap-12 px-4 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="space-y-6">
            {INSIDE.parts.map((part) => (
              <p key={part.name} className="text-[17px] leading-[1.7] text-neutral-700">
                <strong className="font-semibold text-neutral-900">{part.name}</strong> {part.text}
              </p>
            ))}
            <ScreenShot screen={GUARD_SCREEN} className="pt-4" />
          </div>
          <ul className="border-y border-neutral-200">
            {MODULES.map((module) => (
              <li key={module.name} className="border-t border-neutral-200 py-4 text-[15.5px] leading-relaxed text-neutral-600 first:border-t-0">
                <strong className="font-semibold text-neutral-900">{module.name}</strong> {module.text}
              </li>
            ))}
          </ul>
        </div>
      </GridSection>

      {/* price */}
      <GridSection innerClassName="py-20 sm:py-28">
        <Heading id="pricing" title={PRICING_TITLE} />
        <div className="mt-12 grid gap-4 px-4 sm:px-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const featured = plan.id === "os";
            return (
              <article
                key={plan.id}
                className={cn(CARD, "flex flex-col p-7 sm:p-8", featured && "shadow-[0_0_0_1px_rgba(255,107,61,0.45),0_30px_80px_-30px_rgba(255,107,61,0.45)]")}
              >
                <h3 className="text-[18px] font-semibold text-neutral-900">{plan.name}</h3>
                <p className="mt-6 text-[56px] font-semibold leading-none tracking-[-0.04em] text-neutral-900 tabular-nums">{plan.price}</p>
                <ul className="mt-8 flex-1 space-y-3">
                  {plan.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-[14px] leading-relaxed text-neutral-700">
                      <Check className="mt-[3px]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-col">
                  <PlanButton plan={plan} />
                </div>
              </article>
            );
          })}
        </div>
        <div className="mx-auto mt-10 max-w-[60ch] space-y-1 px-4 text-center text-[16px] leading-[1.7] text-neutral-700">
          <p>
            {PRICING_NOTES.early.before}
            <strong className="font-semibold text-neutral-900">{PRICING_NOTES.early.price}</strong>
            {PRICING_NOTES.early.after}
          </p>
          <p>
            {PRICING_NOTES.founding.before}
            <strong className="font-semibold text-neutral-900">{PRICING_NOTES.founding.strong}</strong>
          </p>
        </div>
        {buy.mode === "notify" ? (
          <div id="notify" className={cn(CARD, "mx-4 mt-10 scroll-mt-28 p-6 sm:mx-auto sm:max-w-[560px] sm:p-8")}>
            <p className="text-[17px] font-semibold text-neutral-900">{OS_UI.notifyTitle}</p>
            <p className="mb-5 mt-1 text-[15px] leading-relaxed text-neutral-600">{OS_UI.notifyText}</p>
            <KitList form={OS_NOTIFY_FORM} email="Email" button={OS_UI.notifyButton} row />
          </div>
        ) : null}
        <p className="mt-10 px-4 text-center text-[15px] text-neutral-600">
          {PRICING_NOTES.setup.before}
          <CtaLink place="os-setup" href={PRICING_NOTES.setup.href} className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900">
            {PRICING_NOTES.setup.link}
          </CtaLink>
        </p>
      </GridSection>

      {/* fit */}
      <GridSection>
        <div className="grid md:grid-cols-2 md:divide-x md:divide-neutral-200">
          {[
            { list: FOR, mark: <Check /> },
            { list: NOT_FOR, mark: <Cross /> },
          ].map(({ list, mark }, index) => (
            <div key={list.title} className={cn("px-5 py-16 sm:px-10 sm:py-20", index > 0 && "max-md:border-t max-md:border-neutral-200")}>
              <h2 className="type-heading text-neutral-900">{list.title}</h2>
              <ul className="mt-8 space-y-4">
                {list.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[16px] leading-relaxed text-neutral-700">
                    {mark}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </GridSection>

      {/* doubts */}
      <GridSection innerClassName="py-20 sm:py-28">
        <Heading title={FAQ_TITLE} />
        <dl className="mx-auto mt-12 max-w-[720px] border-y border-neutral-200 px-5">
          {FAQ.map((item) => (
            <div key={item.q} className="border-t border-neutral-200 py-6 first:border-t-0">
              <dt className="text-[17px] font-semibold text-neutral-900">{item.q}</dt>
              <dd className="mt-2 text-[15.5px] leading-[1.7] text-neutral-600">{item.a}</dd>
            </div>
          ))}
        </dl>
      </GridSection>

      <GridSection innerClassName="px-5 py-8">
        <p className="mx-auto max-w-[70ch] text-center text-[13px] italic leading-relaxed text-neutral-500">{DISCLAIMER}</p>
      </GridSection>
    </SitePageLayout>
  );
}

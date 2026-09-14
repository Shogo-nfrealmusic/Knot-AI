import Link from "next/link";
import { IconBrandInstagram, IconCreditCard, IconNews } from "@tabler/icons-react";

// Short, verifiable proof points in place of dub's review-star row.
const proof = [
  { icon: IconCreditCard, label: "~$33k/mo platform" },
  { icon: IconNews, label: "Published at Mercari" },
  { icon: IconBrandInstagram, label: "29K followers" },
];

// One side of the notch the white page cuts into the dark block (mirrored for the other side).
function NotchCurve({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 85 64"
      fill="none"
      aria-hidden
      className={`h-full w-auto shrink-0 translate-y-px overflow-visible ${className ?? ""}`}
    >
      <rect x="0" y="0" width="85" height="1" fill="currentColor" transform="translate(0, -1)" />
      <path
        d="M50 45C57.3095 56.6952 71.2084 63.9997 85 64V0H0C13.7915 0 26.6905 7.30481 34 19L50 45Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function CTA() {
  return (
    <>
      {/* White breathing room so the notch always cuts from the page ground, whatever section precedes it. */}
      <div aria-hidden className="h-16 bg-white" />
      <section className="relative overflow-hidden bg-neutral-900 px-4">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 mix-blend-overlay">
          <div className="absolute -inset-[40px] bg-[conic-gradient(from_-81deg,#3A8BFD_-72deg,#855AFC_33deg,#F00_70deg,#EAB308_136deg,#5CFF80_214deg,#00FFF9_259deg,#3A8BFD_288deg,#855AFC_393deg)] blur-[30px]" />
        </div>

        <div className="relative mx-auto max-w-[1080px]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 border-x border-white/5 [mask-image:linear-gradient(black,transparent)]" />
            <div className="absolute inset-y-0 left-1/2 w-[1200px] -translate-x-1/2">
              <svg
                aria-hidden
                className="absolute inset-0 text-white/15 [mask-composite:intersect] [mask-image:linear-gradient(black,transparent),radial-gradient(black,transparent)]"
                width="100%"
                height="100%"
              >
                <defs>
                  <pattern id="cta-grid" x="-1" y="-1" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="transparent" stroke="currentColor" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect fill="url(#cta-grid)" width="100%" height="100%" />
              </svg>
            </div>
          </div>

          <div className="relative mx-auto flex h-16 max-w-[min(700px,calc(100vw-2rem))] -translate-y-px items-start justify-center text-white">
            <NotchCurve className="translate-x-px" />
            <div className="relative z-10 h-[calc(100%+1px)] min-w-0 grow bg-current" />
            <NotchCurve className="-translate-x-px -scale-x-100" />
          </div>

          <div className="relative flex flex-col items-center px-4 pb-32 pt-20 text-center">
            <h2 className="max-w-xl text-balance text-4xl font-medium tracking-[-0.03em] text-neutral-50 sm:text-5xl">
              Have something that needs to be built?
            </h2>
            <p className="mt-6 max-w-[560px] text-pretty text-lg font-medium text-neutral-400 sm:text-xl">
              Tell me the workflow and what a good outcome looks like.
              I&apos;ll reply with a clear next step.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="flex h-10 items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 ring-white/20 transition-all hover:ring"
              >
                Get in touch
              </Link>
              <Link
                href="/work"
                className="flex h-10 items-center justify-center rounded-lg border border-transparent bg-white/20 px-5 text-sm font-medium text-white ring-white/10 backdrop-blur-sm transition-all hover:ring"
              >
                See my work
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {proof.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Icon className="size-3.5 text-white" stroke={2} />
                  </span>
                  <span className="text-sm font-medium text-white/85">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

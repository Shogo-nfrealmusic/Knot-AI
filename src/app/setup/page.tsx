import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { ISO_CSS } from "@/lib/iso/iso-kit";
import { FOUNDING } from "@/lib/setup";
import Movement from "./Movement";
import { movementSvg } from "./movement";
import Pricing from "./Pricing";

export const metadata: Metadata = {
  title: "Copilot OS Setup | Shogo Kikuchi",
  description:
    "I set up Claude Code to run parts of your business, then add one more job it does for you every month. The same setup two of us run our company on.",
  alternates: { canonical: "/setup" },
};

// Warm paper, ink and one line of gold: the language of a watchmaker's catalogue, kept to this page.
const SETUP_CSS = `
.setup{--paper:#f3efe7;--paper-deep:#ebe5d9;--ink:#1a1814;--ink-soft:#6b655b;--rule:#d9d1c3;--gold:#a88446;background:var(--paper);color:var(--ink)}
.setup ::selection{background:#e6d6b5}
.setup-movement.iso[data-theme="light"]{
  --anatomy-paper:var(--paper);--anatomy-face:#fbf8f2;--anatomy-top:#fbf8f2;
  --anatomy-shade-0:#d9d1c2;--anatomy-shade-1:#e3dccf;--anatomy-shade-2:#ece6db;--anatomy-shade-3:#f4f0e8;
  --anatomy-lit-top:#fffdf8;--anatomy-lit-shade:#efe9de;
  --anatomy-hi:#2a2620;--anatomy-mid:#8c8477;--anatomy-lo:#b9b0a1;--anatomy-faint:#dcd4c6;--anatomy-lit:#1a1814;
  --anatomy-halo:#7d6f58;--anatomy-halo-opacity:.28;--anatomy-dot:#2a2620;--anatomy-weight:.55px;
  --anatomy-mono:var(--font-sans),system-ui,sans-serif;
}
.setup-movement .jewel>.iso-top,.setup-movement .jewel>.iso-fill{fill:#8e2433}
.setup-movement .jewel>.iso-shade{fill:#6d1a26}
.setup-movement .screw>.iso-top{fill:#e9dcc0}
.setup-serif{font-family:var(--font-serif);font-weight:400;letter-spacing:-0.015em}
.setup-link{background:linear-gradient(currentColor,currentColor) 0 100%/100% 1px no-repeat;transition:background-size .5s cubic-bezier(.16,1,.3,1)}
.setup-link:hover{background-size:0 1px;background-position:100% 100%}
@keyframes setup-rise{from{opacity:0;transform:translateY(var(--rise,14px))}to{opacity:1;transform:none}}
.setup-rise{animation:setup-rise 1.1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--at,0ms)}
@media (prefers-reduced-motion:reduce){.setup-rise{animation:none}}
`;

const PARTS = [
  {
    name: "The barrel",
    role: "CLAUDE.md",
    text: "Your goals, priorities and rules, wound once. Every job draws its power from here.",
  },
  {
    name: "The train",
    role: "The jobs",
    text: "A video written and rendered every night. A brief every morning. The books drafted every month.",
  },
  {
    name: "The escapement",
    role: "The verifier",
    text: "Nothing leaves the train until a second agent has checked it. One tick, one check.",
  },
];

export default function SetupPage() {
  const left = FOUNDING.seats - FOUNDING.taken;
  return (
    <SitePageLayout>
      <style>{ISO_CSS + SETUP_CSS}</style>
      <div className="setup relative">
        <section className="mx-auto max-w-[1180px] px-5 pb-24 pt-36 sm:px-10 sm:pt-44">
          <p className="setup-rise text-[13px] tracking-[0.02em] text-[var(--ink-soft)]" style={{ "--at": "0ms" } as React.CSSProperties}>
            Copilot OS Setup, by Shogo Kikuchi
          </p>
          <h1
            className="setup-serif setup-rise mt-6 max-w-[15ch] text-balance text-[clamp(48px,8.4vw,112px)] leading-[0.95]"
            style={{ "--at": "80ms", "--rise": "22px" } as React.CSSProperties}
          >
            The quiet machinery that runs a business.
          </h1>

          <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[1.5fr_1fr] lg:items-center lg:gap-16">
            <div className="setup-rise" style={{ "--at": "200ms", "--rise": "24px" } as React.CSSProperties}>
              <Movement svg={movementSvg()} />
            </div>

            <div className="setup-rise" style={{ "--at": "320ms" } as React.CSSProperties}>
              <dl className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {PARTS.map((part) => (
                  <div key={part.name} className="grid grid-cols-[1fr] gap-1 py-5">
                    <dt className="flex items-baseline justify-between gap-4">
                      <span className="setup-serif text-[26px] leading-none">{part.name}</span>
                      <span className="text-[12px] tracking-[0.04em] text-[var(--gold)]">{part.role}</span>
                    </dt>
                    <dd className="text-pretty text-[14px] leading-[1.7] text-[var(--ink-soft)]">{part.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-20 grid gap-10 border-t border-[var(--rule)] pt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            <p className="setup-serif max-w-[30ch] text-pretty text-[clamp(26px,3vw,36px)] leading-[1.2]">
              Two of us run a company in Tokyo on this. I build the same movement for your business, then add one more
              wheel to it every month.
            </p>
            <div className="flex flex-col justify-end gap-5">
              <div className="flex flex-wrap items-center gap-6">
                <a
                  href="#apply"
                  className="inline-flex h-12 items-center bg-[var(--ink)] px-7 text-[14px] font-medium tracking-[0.01em] text-[var(--paper)] transition-[transform,background-color] duration-300 hover:bg-black active:scale-[0.97]"
                >
                  Apply for a seat
                </a>
                <a href="#pricing" className="setup-link pb-0.5 text-[14px] font-medium">
                  See pricing
                </a>
              </div>
              <p className="text-[13px] leading-relaxed text-[var(--ink-soft)]">
                Monthly. Pause or cancel anytime. I never log in to your computer.
                <br />
                {left} of {FOUNDING.seats} founding seats left, at half price.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="scroll-mt-20 border-t border-[var(--rule)] bg-[var(--paper-deep)]/40">
          <div className="mx-auto max-w-[1180px] px-5 py-24 sm:px-10 sm:py-32">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="setup-serif max-w-[16ch] text-balance text-[clamp(40px,5.6vw,72px)] leading-[0.98]">
                One flat price. Never by the hour.
              </h2>
              <p className="max-w-sm text-pretty text-[14px] leading-[1.7] text-[var(--ink-soft)]">
                Every plan begins with your movement assembled in the first month. Pay further ahead and it costs less.
              </p>
            </div>
            <div className="mt-16">
              <Pricing />
            </div>
          </div>
        </section>
      </div>
    </SitePageLayout>
  );
}

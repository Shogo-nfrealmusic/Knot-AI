import type { CSSProperties } from "react";
import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GridPattern } from "@/app/components/ui/grid-pattern-dub";
import { GridSection } from "@/app/components/ui/grid-section";
import { FOUNDING } from "@/lib/setup";
import { cn } from "@/lib/utils";
import Apply from "./Apply";
import Compound from "./Compound";
import Constellation from "./Constellation";
import DuoScroll from "./DuoScroll";
import JobWall from "./JobWall";
import Pricing from "./Pricing";
import Scenes from "./Scenes";

export const metadata: Metadata = {
  title: "Copilot OS Setup | Shogo Kikuchi",
  description:
    "I set up Claude Code to run parts of your business, then add one more job it does for you every month. The same setup two of us run our company on.",
  alternates: { canonical: "/setup" },
};

// The site's own language (white, hairline rails, Inter with a serif italic, one warm accent) carrying the
// structure Shogo pointed to on ClickUp: a character hero with pinned labels, a problem picture, real UI in
// cards, a wall of jobs. Order follows the buying decision: promise, pain, how, proof, breadth, price, risk.
const SETUP_CSS = `
@keyframes hero-slide-up-fade{from{opacity:0;transform:translateY(var(--offset,10px))}to{opacity:1;transform:none}}
@keyframes hero-fade{from{opacity:0}to{opacity:1}}
.su-card{position:relative;overflow:hidden;border-radius:20px;background:#fff;box-shadow:0 0 0 1px #e5e5e5,0 1px 2px rgba(0,0,0,.04),0 12px 32px -18px rgba(0,0,0,.18)}
.su-panel{position:relative;overflow:hidden;border-radius:14px;background:#fff;box-shadow:0 0 0 1px #e5e5e5,0 1px 1px rgba(0,0,0,.03),0 16px 32px -16px rgba(0,0,0,.18)}
.su-beam{position:absolute;top:0;left:0;height:1px;width:40%;background:linear-gradient(90deg,transparent,var(--warm),transparent);animation:su-beam 3.6s cubic-bezier(.5,0,.5,1) infinite}
@keyframes su-beam{from{transform:translateX(-100%)}to{transform:translateX(260%)}}
.su-row{animation:su-row 6s ease-in-out infinite;animation-delay:calc(var(--i) * .9s)}
@keyframes su-row{0%,100%{opacity:.55}8%,22%{opacity:1}}
.su-select{position:absolute;left:0;right:0;top:0;height:44px;border-radius:10px;background:#fafafa;box-shadow:0 0 0 1px #e5e5e5,0 4px 12px -6px rgba(0,0,0,.15);animation:su-select 8s cubic-bezier(.65,0,.35,1) infinite}
@keyframes su-select{0%,20%{transform:translateY(0)}25%,45%{transform:translateY(44px)}50%,70%{transform:translateY(88px)}75%,95%{transform:translateY(132px)}100%{transform:translateY(0)}}
.su-glow-orange{position:absolute;width:360px;height:260px;border-radius:9999px;background:radial-gradient(closest-side,rgba(255,107,61,.16),rgba(255,107,61,0));pointer-events:none}
.su-swap{animation:su-swap-a 5s ease-in-out infinite}
.su-swap-b{animation-name:su-swap-b}
@keyframes su-swap-a{0%,40%{opacity:1;filter:blur(0);transform:none}50%,90%{opacity:0;filter:blur(6px);transform:translateY(-6px)}100%{opacity:1;filter:blur(0);transform:none}}
@keyframes su-swap-b{0%,40%{opacity:0;filter:blur(6px);transform:translateY(6px)}50%,90%{opacity:1;filter:blur(0);transform:none}100%{opacity:0;filter:blur(6px);transform:translateY(6px)}}
.su-grid{position:absolute;inset:0;background-image:linear-gradient(#ececec 1px,transparent 1px),linear-gradient(90deg,#ececec 1px,transparent 1px);background-size:24px 24px;mask-image:radial-gradient(closest-side,black,transparent)}
.su-wire{fill:none;stroke:#d4d4d4;stroke-width:1;stroke-dasharray:3 5;animation:su-wire 1.6s linear infinite;animation-delay:calc(var(--i) * -.4s)}
@keyframes su-wire{to{stroke-dashoffset:-16}}
.su-chip{display:flex;align-items:center;justify-content:center;min-width:46px;height:46px;border-radius:14px;background:#fff;box-shadow:0 0 0 1px #e5e5e5,0 6px 16px -8px rgba(0,0,0,.2)}
.su-node{border-radius:28%;background:#fff;box-shadow:0 0 0 1px #e5e5e5,0 10px 24px -12px rgba(0,0,0,.28);will-change:left,top}
.su-ring{fill:none;stroke:#e5e5e5;stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:2 6}
.su-core,.su-hub{display:flex;align-items:center;justify-content:center;width:76px;height:76px;border-radius:22px;background:#fff;box-shadow:0 0 0 1px rgba(224,85,47,.35),0 0 0 6px rgba(224,85,47,.06),0 18px 40px -14px rgba(224,85,47,.45)}
.su-tangle{fill:none;stroke:#e8a08a;stroke-width:1.2;stroke-dasharray:3 4;vector-effect:non-scaling-stroke}
.su-spoke{fill:none;stroke:var(--warm);stroke-opacity:.45;stroke-width:1.2;stroke-dasharray:4 6;animation:su-wire 1.2s linear infinite}
.su-pill{background:#fff;box-shadow:0 0 0 1px #e5e5e5,0 24px 48px -24px rgba(224,85,47,.45)}
.su-progress{animation:su-progress 6s cubic-bezier(.4,0,.2,1) infinite}
@keyframes su-progress{0%{width:6%}80%,100%{width:92%}}
.su-dots::after{content:"";animation:su-dots 1.4s steps(4,end) infinite}
@keyframes su-dots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}}
.su-pins path{fill:none;stroke:#a3a3a3;stroke-width:1;vector-effect:non-scaling-stroke;stroke-dasharray:400;stroke-dashoffset:400;animation:su-draw 1.2s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--at,0ms)}
.su-pins circle{fill:#fff;stroke:var(--warm);stroke-width:1.5;vector-effect:non-scaling-stroke;opacity:0;animation:hero-fade .4s ease forwards;animation-delay:calc(var(--at,0ms) + 700ms)}
@keyframes su-draw{to{stroke-dashoffset:0}}
.su-float{animation:su-float 6s ease-in-out infinite}
@keyframes su-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
.su-tile{display:flex;height:96px;flex-direction:column;align-items:flex-start;justify-content:space-between;border-radius:16px;background:#fff;padding:14px;font-size:13px;color:#404040;box-shadow:0 0 0 1px #e5e5e5,0 1px 2px rgba(0,0,0,.04);transition:transform .4s cubic-bezier(.34,1.36,.64,1),box-shadow .3s}
.su-tile:hover{transform:translateY(-3px);box-shadow:0 0 0 1px #d4d4d4,0 12px 24px -12px rgba(0,0,0,.2)}
.su-tile-big{position:relative;overflow:hidden;border-radius:16px;min-height:202px;box-shadow:0 0 0 1px #e5e5e5}
@media (prefers-reduced-motion:reduce){.su-beam,.su-row,.su-select,.su-swap,.su-wire,.su-spoke,.su-progress,.su-dots::after,.su-float{animation:none}.su-swap-b{display:none}.su-pins path,.su-pins circle{animation:none;stroke-dashoffset:0;opacity:1}}
`;

const entrance = "animate-[hero-slide-up-fade_1s_both] motion-reduce:animate-[hero-fade_1s_both]";
const stagger = (ms: number, px: number) => ({ animationDelay: `${ms}ms`, "--offset": `${px}px` }) as CSSProperties;

function Heading({ eyebrow, title, accent, after, text }: { eyebrow: string; title: string; accent: string; after?: string; text: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--warm)]">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-[clamp(32px,4.6vw,56px)] font-medium leading-[1.04] tracking-[-0.04em] text-neutral-900">
        {title} <span className="font-serif font-normal italic tracking-[-0.01em] text-neutral-500">{accent}</span>
        {after ? ` ${after}` : null}
      </h2>
      <p className="mx-auto mt-5 max-w-[52ch] text-pretty text-[16px] leading-[1.75] text-neutral-600">{text}</p>
    </div>
  );
}

export default function SetupPage() {
  const left = FOUNDING.seats - FOUNDING.taken;
  return (
    <SitePageLayout>
      <style>{SETUP_CSS}</style>

      <GridSection className="border-t-0" innerClassName="pt-24 sm:pt-28">
        <div aria-hidden className="pointer-events-none absolute inset-x-px inset-y-0 overflow-hidden [mask-image:linear-gradient(transparent,black)]">
          <GridPattern cellSize={60} strokeWidth={2} patternOffset={[0, 1]} className="inset-[unset] bottom-0 left-1/2 h-[700px] w-[1080px] -translate-x-1/2 text-neutral-200" />
        </div>
        <div className="relative px-4 text-center sm:px-10">
          <div className={cn(entrance, "mx-auto flex w-fit items-center gap-2 rounded-full border border-neutral-300 bg-white py-1.5 pl-3 pr-3.5 text-xs font-medium text-neutral-800 drop-shadow-sm")} style={stagger(0, 10)}>
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--warm)] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--warm)]" />
            </span>
            Copilot OS Setup · {left} of {FOUNDING.seats} founding seats left
          </div>
          <h1 className={cn(entrance, "mx-auto mt-6 max-w-[14ch] text-balance type-display text-text-primary")} style={stagger(100, 20)}>
            Claude Code that runs{" "}
            <span className="font-serif text-[1.08em] font-normal italic tracking-[-0.01em] text-neutral-500">your business.</span>
          </h1>
          <p className={cn(entrance, "mx-auto mt-6 max-w-[52ch] text-pretty text-[16px] leading-[1.75] text-neutral-600")} style={stagger(200, 10)}>
            I set up Claude Code to do the repeat work in your business, then add one more job it takes off your plate
            every month. The same setup two of us run our company on.
          </p>
          <div className={cn(entrance, "mt-9 flex flex-wrap items-center justify-center gap-3")} style={stagger(300, 5)}>
            <a href="#apply" className="group inline-flex h-11 items-center gap-2 rounded-lg border border-black bg-black px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200 active:scale-[0.96]">
              Apply for a seat
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>
            <a href="#pricing" className="inline-flex h-11 items-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 hover:ring-4 hover:ring-black/5 active:scale-[0.96]">
              See pricing
            </a>
          </div>
        </div>
        <div className="h-10 sm:h-14" />
      </GridSection>

      <DuoScroll />

      <GridSection>
        <div className="flex flex-col items-center justify-center gap-x-8 gap-y-3 px-4 py-6 text-center text-[13px] text-neutral-500 sm:flex-row sm:px-10">
          <span className="text-neutral-800">Built on the system behind a six-figure business I co-founded.</span>
          <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <span>Content drafted overnight</span>
            <span className="text-neutral-300">/</span>
            <span>Books drafted monthly</span>
            <span className="text-neutral-300">/</span>
            <span>Every decision logged</span>
          </span>
        </div>
      </GridSection>

      <GridSection innerClassName="py-20 sm:py-28">
        <Heading
          eyebrow="The problem"
          title="Your business lives in a dozen tools."
          accent="Claude sees all of them."
          text="Today every request starts from zero and you copy between tabs by hand. A setup gives Claude your context once and wires it into the tools you already use."
        />
        <div className="mt-6 px-2 sm:px-6">
          <Constellation />
        </div>
      </GridSection>

      <GridSection innerClassName="pt-20 sm:pt-28">
        <Heading
          eyebrow="What you get"
          title="A setup that thinks like you,"
          accent="checks itself, and never sleeps."
          text="Built in the first month, then kept sharp. Everything lives on your machine as real files and jobs, not a dashboard you log in to."
        />
        <div className="mt-6">
          <Scenes />
        </div>
      </GridSection>

      <GridSection innerClassName="py-20 sm:py-28">
        <Compound />
      </GridSection>

      <GridSection innerClassName="py-20 sm:py-28">
        <Heading
          eyebrow="What it can take over"
          title="Any repeat job,"
          accent="one a month."
          text="These are the kinds of jobs a setup adds. You pick the next one each month; I build it and it joins the schedule."
        />
        <div className="mt-12 px-3 sm:px-6">
          <JobWall />
        </div>
      </GridSection>

      <GridSection innerClassName="py-20 sm:py-28">
        <div id="pricing" className="scroll-mt-24">
          <Heading
            eyebrow="Pricing"
            title="One flat price."
            accent="Never by the hour."
            text="Every plan starts with your setup built in the first month. Pay further ahead and it costs less. Pause or cancel anytime."
          />
        </div>
        <div className="mt-12 px-3 sm:px-6">
          <Pricing />
        </div>
        <p className="mx-auto mt-10 max-w-[60ch] px-4 text-center text-[13px] leading-relaxed text-neutral-500">
          I never log in to your computer or your accounts. I send the files and the steps; you run them. Your data stays
          with you.
        </p>
      </GridSection>

      <GridSection innerClassName="py-20 sm:py-28">
        <div id="apply" className="scroll-mt-20">
          <Apply />
        </div>
      </GridSection>
    </SitePageLayout>
  );
}

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import SitePageLayout from "@/app/components/SitePageLayout";
import { FOUNDING } from "@/lib/setup";
import Cards from "./Cards";
import Pricing from "./Pricing";
import Scramble from "./Scramble";

export const metadata: Metadata = {
  title: "Copilot OS Setup | Shogo Kikuchi",
  description:
    "I set up Claude Code to run parts of your business, then add one more job it does for you every month. The same setup two of us run our company on.",
  alternates: { canonical: "/setup" },
};

// Dark panels on the site's white page, an orange glow from Orbit's colour, real UI in the cards.
// Reference chosen by Shogo: ClickUp's Super Agents and Brain² bands (2026-10-29).
const SETUP_CSS = `
.su-dark{background:#050506;color:#fff;border-radius:28px;position:relative;overflow:hidden;isolation:isolate}
.su-noise{position:absolute;inset:0;opacity:.06;mix-blend-mode:overlay;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.su-glow{position:absolute;pointer-events:none;border-radius:9999px;filter:blur(80px)}
.su-card{position:relative;overflow:hidden;border-radius:22px;background:#0b0b0c;box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 0 0 1px rgba(255,255,255,.06)}
.su-panel{border-radius:14px;background:linear-gradient(180deg,#151517,#0e0e10);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 0 1px rgba(255,255,255,.07),0 20px 40px -12px rgba(0,0,0,.6);position:relative;overflow:hidden}
.su-beam{position:absolute;top:0;left:0;height:1px;width:40%;background:linear-gradient(90deg,transparent,#ffb38a,transparent);animation:su-beam 3.6s cubic-bezier(.5,0,.5,1) infinite}
@keyframes su-beam{from{transform:translateX(-100%)}to{transform:translateX(260%)}}
.su-row{animation:su-row 6s ease-in-out infinite;animation-delay:calc(var(--i) * .9s)}
@keyframes su-row{0%,100%{opacity:.55}8%,22%{opacity:1}}
.su-select{position:absolute;left:0;right:0;top:0;height:44px;border-radius:10px;background:rgba(255,255,255,.06);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);animation:su-select 8s cubic-bezier(.65,0,.35,1) infinite}
@keyframes su-select{0%,20%{transform:translateY(0)}25%,45%{transform:translateY(44px)}50%,70%{transform:translateY(88px)}75%,95%{transform:translateY(132px)}100%{transform:translateY(0)}}
.su-glow-orange{position:absolute;width:260px;height:160px;border-radius:9999px;background:#ff6b3d;opacity:.18;filter:blur(60px)}
.su-swap{transition:none;animation:su-swap-a 5s ease-in-out infinite}
.su-swap-b{animation-name:su-swap-b}
@keyframes su-swap-a{0%,40%{opacity:1;filter:blur(0);transform:none}50%,90%{opacity:0;filter:blur(6px);transform:translateY(-6px)}100%{opacity:1;filter:blur(0);transform:none}}
@keyframes su-swap-b{0%,40%{opacity:0;filter:blur(6px);transform:translateY(6px)}50%,90%{opacity:1;filter:blur(0);transform:none}100%{opacity:0;filter:blur(6px);transform:translateY(6px)}}
.su-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:24px 24px;mask-image:radial-gradient(closest-side,black,transparent)}
.su-wire{fill:none;stroke:rgba(255,255,255,.18);stroke-width:1;stroke-dasharray:3 5;animation:su-wire 1.6s linear infinite;animation-delay:calc(var(--i) * -.4s)}
@keyframes su-wire{to{stroke-dashoffset:-16}}
.su-chip{display:flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:14px;background:#141416;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 0 1px rgba(255,255,255,.08)}
.su-core{display:flex;align-items:center;justify-content:center;width:76px;height:76px;border-radius:22px;background:linear-gradient(180deg,#1b1b1e,#0f0f11);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 0 0 1px rgba(255,107,61,.35),0 0 40px rgba(255,107,61,.25)}
.su-pill{background:linear-gradient(180deg,#141416,#0c0c0e);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 0 0 1px rgba(255,255,255,.07),0 30px 60px -20px rgba(255,107,61,.25)}
.su-progress{animation:su-progress 6s cubic-bezier(.4,0,.2,1) infinite}
@keyframes su-progress{0%{width:6%}80%,100%{width:92%}}
.su-dots::after{content:"";animation:su-dots 1.4s steps(4,end) infinite}
@keyframes su-dots{0%{content:""}25%{content:"."}50%{content:".."}75%{content:"..."}}
.su-pointer path{stroke:rgba(255,255,255,.28);stroke-width:1;fill:none;stroke-dasharray:300;stroke-dashoffset:300;animation:su-draw 1.2s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--at,0ms)}
@keyframes su-draw{to{stroke-dashoffset:0}}
.su-float{animation:su-float 6s ease-in-out infinite}
@keyframes su-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes su-rise{from{opacity:0;transform:translateY(var(--rise,16px))}to{opacity:1;transform:none}}
.su-rise{animation:su-rise 1s cubic-bezier(.16,1,.3,1) both;animation-delay:var(--at,0ms)}
@media (prefers-reduced-motion:reduce){.su-beam,.su-row,.su-select,.su-swap,.su-wire,.su-progress,.su-dots::after,.su-float,.su-rise{animation:none}.su-swap-b{display:none}.su-pointer path{animation:none;stroke-dashoffset:0}}
div:has(>main .su-page)>.pointer-events-none{display:none}
`;

const at = (ms: number, rise?: number) => ({ "--at": `${ms}ms`, ...(rise ? { "--rise": `${rise}px` } : {}) }) as CSSProperties;

const LABELS = [
  { text: "Knows your goals", className: "left-[3%] top-[18%]", line: "M0 1 H150 L210 60", lineClass: "left-[3%] top-[calc(18%+22px)] w-[210px] h-[62px]" },
  { text: "Works while you sleep", className: "left-[0%] top-[62%]", line: "M0 61 H150 L210 1", lineClass: "left-[0%] top-[calc(62%-40px)] w-[210px] h-[62px]" },
  { text: "Checks its own work", className: "right-[3%] top-[22%] text-right", line: "M210 1 H60 L0 60", lineClass: "right-[3%] top-[calc(22%+22px)] w-[210px] h-[62px]" },
  { text: "Plugs into your tools", className: "right-[0%] top-[66%] text-right", line: "M210 61 H60 L0 1", lineClass: "right-[0%] top-[calc(66%-40px)] w-[210px] h-[62px]" },
];

export default function SetupPage() {
  const left = FOUNDING.seats - FOUNDING.taken;
  return (
    <SitePageLayout>
      <style>{SETUP_CSS}</style>
      <div className="su-page px-3 pb-3 pt-24 sm:px-4 sm:pt-28">
        <section className="su-dark mx-auto max-w-[1400px] px-5 pb-10 pt-20 sm:px-10 sm:pt-24">
          <div className="su-noise" aria-hidden />
          <div className="su-glow left-1/2 top-[52%] h-[420px] w-[620px] -translate-x-1/2 bg-[#ff6b3d] opacity-[0.22]" aria-hidden />
          <div className="su-glow left-[30%] top-[70%] h-[260px] w-[360px] bg-[#ff3d8b] opacity-[0.12]" aria-hidden />

          <div className="relative text-center">
            <p className="su-rise inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] text-white/70" style={at(0)}>
              <span className="size-1.5 rounded-full bg-[#ff6b3d] shadow-[0_0_10px_#ff6b3d]" />
              Copilot OS Setup · {left} of {FOUNDING.seats} founding seats left
            </p>
            <h1 className="su-rise mx-auto mt-7 max-w-[13ch] text-balance text-[clamp(44px,7.4vw,96px)] font-semibold leading-[0.98] tracking-[-0.045em]" style={at(80, 24)}>
              Claude Code that runs{" "}
              <span className="font-serif font-normal italic tracking-[-0.02em] text-[#ffb38a]">your</span> business
            </h1>
            <p className="su-rise mx-auto mt-6 max-w-[52ch] text-pretty text-[17px] leading-relaxed text-white/55" style={at(160)}>
              I set up Claude Code to run the repeat work in your business, then add one more job it takes off your plate
              every month. The same setup two of us run our company on.
            </p>
            <div className="su-rise mt-9 flex flex-wrap items-center justify-center gap-3" style={at(240)}>
              <a href="#apply" className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-[15px] font-semibold text-black transition-transform duration-300 hover:scale-[1.02] active:scale-[0.97]">
                Apply for a seat
              </a>
              <a href="#pricing" className="inline-flex h-12 items-center rounded-xl border border-white/15 bg-white/[0.04] px-6 text-[15px] font-medium text-white/85 transition-colors hover:bg-white/[0.08] active:scale-[0.97]">
                See pricing
              </a>
            </div>
          </div>

          <div className="relative mx-auto mt-10 h-[min(62vw,560px)] max-w-[1100px]">
            <div className="su-rise su-float absolute left-1/2 top-0 w-[min(66vw,560px)] -translate-x-1/2" style={at(300, 30)}>
              <Image src="/setup/orbit-type.png" alt="Orbit, the copilot_shogo mascot, typing on a laptop" width={1200} height={1100} priority className="h-auto w-full" />
            </div>
            <div className="hidden md:block">
              {LABELS.map((label, i) => (
                <div key={label.text}>
                  <p className={`absolute font-mono text-[12px] uppercase tracking-[0.14em] text-white/70 ${label.className}`}>
                    <Scramble text={label.text} delay={700 + i * 220} />
                  </p>
                  <svg className={`su-pointer absolute ${label.lineClass}`} viewBox="0 0 210 62" style={at(800 + i * 220)} aria-hidden>
                    <path d={label.line} />
                  </svg>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-4">
            <Cards />
          </div>
        </section>

        <section id="pricing" className="su-dark mx-auto mt-3 max-w-[1400px] scroll-mt-24 px-5 py-20 sm:px-10 sm:py-24">
          <div className="su-noise" aria-hidden />
          <div className="su-glow right-[10%] top-[-10%] h-[300px] w-[480px] bg-[#ff6b3d] opacity-[0.14]" aria-hidden />
          <div className="relative text-center">
            <h2 className="mx-auto max-w-[18ch] text-balance text-[clamp(36px,5vw,64px)] font-semibold leading-[1] tracking-[-0.04em]">
              One flat price. <span className="font-serif font-normal italic text-white/60">Never</span> by the hour.
            </h2>
            <p className="mx-auto mt-5 max-w-[46ch] text-[16px] leading-relaxed text-white/55">
              Every plan starts with your setup built in the first month. Pay further ahead and it costs less.
            </p>
          </div>
          <div className="relative mt-12">
            <Pricing />
          </div>
        </section>
      </div>
    </SitePageLayout>
  );
}

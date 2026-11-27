import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "./guide/style";
import { CountUp, InView, MOTION_CSS } from "./Motion";
import { HeroRun, PlanDoc, StepArt } from "./Showcase";
import { KitBrowser, ModuleIndex, WhatItDoes } from "./Sections";
import { TaglineReveal } from "./Reveal";

// The Copilot OS sales page. Same look as the guide it sells: paper grid, ink, one orange accent.
// Every screen on this page was captured on my Mac on Nov 28, 2026, and every file listed ships in the kit.
// No screenshots: the figures are drawn in the guide's language, and the words in them are typeset from a real run.
// The revenue chart is a chart of the company's estimate and says so.

export const metadata: Metadata = {
  title: "Copilot OS | Shogo Kikuchi",
  description:
    "The guide and the exact Claude Code files behind a two-person company on track for $1.2M this year. Your first real job is done in 30 minutes.",
};

export const dynamic = "force-static";

// Replaced with the Kit checkout links once the products exist in Kit.
const BUY_URL = "#price";
const OPERATOR_URL = "#price";

// ---------- small parts ----------

function Buy({ label = "Get Copilot OS", className = "" }: { label?: string; className?: string }) {
  return (
    <a
      href={BUY_URL}
      className={`gd-press group inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--ink)] px-7 text-lg font-semibold text-white shadow-[0_12px_30px_-14px_rgba(21,23,26,.8)] hover:-translate-y-0.5 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${className}`}
    >
      {label}
      <span className="text-white/50 line-through">$49</span>
      <span>$29</span>
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </a>
  );
}

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--pass)]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--muted)]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{children}</p>;
}

function Head({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <InView className="gd-stagger">
      <div style={{ "--i": 0 } as React.CSSProperties}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="gd-h2 mt-4 max-w-[20ch] text-balance" style={{ "--i": 1 } as React.CSSProperties}>
        {children}
      </h2>
    </InView>
  );
}

// ---------- revenue (styled after a payments dashboard bar chart) ----------

const MONTHS = ["Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027", "Jul 2027", "Aug 2027"];
const ESTIMATE_K = [15, 32, 45, 60, 75, 90, 110, 125, 140, 155, 170, 183];
const SCALE_K = 200;
const DASH = { navy: "#0A2540", bar: "#9966FF", grid: "#E7ECF1", axis: "#ABB5C5", link: "#635BFF" };

function Bars({ height }: { height: string }) {
  return (
    <div className={`relative ${height}`}>
      {[0, 50, 100].map((top) => (
        <div key={top} className="absolute inset-x-0 h-px" style={{ top: `${top}%`, background: DASH.grid }} />
      ))}
      <div className="absolute inset-0 flex items-end gap-1 px-1 sm:gap-2 sm:px-2">
        {ESTIMATE_K.map((k, i) => (
          <div
            key={MONTHS[i]}
            className="gd-bar min-w-0 flex-1"
            style={{ height: `${(k / SCALE_K) * 100}%`, background: DASH.bar, "--i": i } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

function RevenueCard() {
  return (
    <InView>
      <figure
        className="rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(10,37,64,.06),0_30px_60px_-34px_rgba(10,37,64,.45)] ring-1 ring-[#E5EDF5] sm:p-7"
        style={{ color: DASH.navy }}
      >
        <div className="flex flex-wrap gap-2 text-xs font-medium" aria-hidden="true">
          <span className="inline-flex h-7 items-center gap-2 rounded-full px-3 ring-1 ring-[#E5EDF5]">
            Date range
            <span className="h-3 w-px bg-[#C4CCD8]" />
            <span style={{ color: DASH.link }}>Sep 2026 – Aug 2027</span>
          </span>
          <span className="inline-flex h-7 items-center rounded-full px-3 ring-1 ring-[#E5EDF5]" style={{ color: DASH.link }}>
            Monthly
          </span>
        </div>
        <p className="mt-5 text-sm font-semibold">This year, estimated revenue</p>
        <p className="mt-1 text-3xl font-bold">
          <CountUp to={1.2} prefix="$" suffix="M" decimals={1} />
        </p>
        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3" aria-hidden="true">
          <Bars height="h-[190px]" />
          <div className="relative w-11 text-xs tabular-nums" style={{ color: DASH.axis }}>
            {(
              [
                ["$200K", 0],
                ["$100K", 50],
                ["$0", 100],
              ] as const
            ).map(([label, top]) => (
              <span key={label} className="absolute left-0 -translate-y-1/2" style={{ top: `${top}%` }}>
                {label}
              </span>
            ))}
          </div>
          <div className="flex gap-1 px-1 sm:gap-2 sm:px-2">
            {MONTHS.map((m, i) => (
              <div key={m} className="flex min-w-0 flex-1 flex-col items-center">
                <span className="h-[3px] w-px" style={{ background: DASH.grid }} />
                {i % 3 === 0 ? <span className="mt-2 whitespace-nowrap text-xs">{m}</span> : null}
              </div>
            ))}
          </div>
        </div>
        <figcaption className="mt-4 text-xs" style={{ color: "#727F96" }}>
          Our company&apos;s estimate for Sep 2026 to Aug 2027. Two people, no outside funding.
        </figcaption>
      </figure>
    </InView>
  );
}

// Small version for the hero: number and bars only.
function RevenueChip() {
  return (
    <InView>
      <div className="w-[230px] rounded-2xl bg-white p-4 shadow-[0_24px_50px_-24px_rgba(10,37,64,.55)] ring-1 ring-[#E5EDF5] sm:w-[220px]" style={{ color: DASH.navy }}>
        <p className="text-xs font-semibold">This year, estimated revenue</p>
        <p className="mt-1 text-2xl font-bold">
          <CountUp to={1.2} prefix="$" suffix="M" decimals={1} />
        </p>
        <div className="mt-3" aria-hidden="true">
          <Bars height="h-[56px]" />
        </div>
      </div>
    </InView>
  );
}

// ---------- content ----------

const STEPS = [
  { n: "1", title: "Install and sign in", body: "One line. Pick your Claude account." },
  { n: "2", title: "It interviews you", body: "One question at a time, about your business." },
  { n: "3", title: "Your first file lands", body: "A plan with a task for each day, in your folder." },
] as const;

const FOR: [boolean, string][] = [
  [true, "You run a business and you're not an engineer"],
  [true, "You pay for Claude and use it as a chat window"],
  [true, "You'd rather copy a setup that already runs a company"],
  [false, "You want a pack of prompts"],
  [false, "You want AI to run things without you approving"],
];

const FAQ: [string, string][] = [
  ["I can't code. Is this for me?", "Yes. Start here was written for people who have never opened a terminal."],
  ["Which Claude plan do I need?", "A paid one. Pro is enough to start. Claude itself isn't included."],
  ["Mac or Windows?", "Both. Every command in the guide switches between them."],
  ["How fast will something work?", "About 30 minutes to your first real job, the run shown above."],
  ["Is it a course or a set of files?", "Both. Nine modules, plus every file I run, ready to copy."],
  ["Can't I find this for free?", "The features, yes, and the guide links Anthropic's docs. Not a complete setup that runs a company."],
  ["What if it doesn't work for me?", "Write to me and tell me why. If you want your money back, I'll refund you."],
  ["Can you set it up for me?", "Yes. That's Copilot OS Setup, a separate service."],
];

const v = (i: number) => ({ "--i": i }) as React.CSSProperties;

// ---------- page ----------

export default function CopilotOsPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS + MOTION_CSS}</style>
      <div className="gd overflow-x-clip pb-20 pt-10 sm:pt-14">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
          {/* hero: the promise on the left, the real run playing on the right */}
          <header className="grid items-center gap-x-12 gap-y-12 pb-20 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,600px)]">
            <InView className="gd-stagger">
              <div style={v(0)}>
                <Eyebrow>Copilot OS</Eyebrow>
              </div>
              <h1 className="gd-h1 mt-5 max-w-[19ch] text-balance !text-[clamp(36px,3.9vw,54px)] !leading-[1.02]" style={v(1)}>
                Your business, <span className="whitespace-nowrap">run by Claude Code.</span> <span className="gd-serif">You just approve.</span>
              </h1>
              <p className="mt-7 max-w-[32rem] text-pretty text-lg text-[var(--body)] sm:text-xl" style={v(2)}>
                The exact setup behind a two person company on track for <strong className="font-semibold text-[var(--ink)]">$1.2M this year</strong>. First real job done in 30
                minutes. No coding.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3" style={v(3)}>
                <Buy />
                <span className="text-sm text-[var(--soft)]">Founding price, first 20 buyers</span>
              </div>
              <ul className="mt-8 flex flex-wrap gap-2 text-sm font-medium text-[var(--body)]" style={v(4)}>
                {["9 modules", "6 agents", "Mac + Windows", "Pay once"].map((t) => (
                  <li key={t} className="rounded-full bg-white px-3 py-1 ring-1 ring-[var(--rule)]">
                    {t}
                  </li>
                ))}
              </ul>
            </InView>

            <div className="relative min-w-0">
              <HeroRun />
              <div className="mt-4 flex justify-start sm:absolute sm:-left-10 sm:bottom-6 sm:z-20 sm:mt-0 sm:block">
                <RevenueChip />
              </div>
            </div>
          </header>
        </div>

        {/* tagline */}
        <section className="border-y border-[var(--rule)] bg-white/50 py-24 sm:py-32">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
            <TaglineReveal
              className="max-w-[22ch] text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-6xl sm:leading-[1.02]"
              text="Stop explaining your business to AI every morning. Set it up once, and let it work."
            />
          </div>
        </section>

        <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
          {/* what it does: a dark band with a working diagram per idea */}
          <section className="relative left-1/2 my-6 w-screen -translate-x-1/2 bg-[var(--panel)] py-20 sm:py-28">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
              <InView className="gd-stagger">
                <div style={v(0)}>
                  <Eyebrow>What it does</Eyebrow>
                </div>
                <h2 className="gd-h2 mt-4 max-w-[20ch] text-balance text-white" style={v(1)}>
                  Four things a chat window <span className="gd-serif !text-white/60">can&apos;t do for you.</span>
                </h2>
              </InView>
              <div className="mt-12">
                <WhatItDoes />
              </div>
            </div>
          </section>

          {/* how it works */}
          <section className="py-20 sm:py-28">
            <Head eyebrow="The first 30 minutes">Three steps, exactly as you&apos;ll see them.</Head>
            <InView as="ol" className="gd-stagger mt-12 grid gap-10 lg:grid-cols-3 lg:gap-6">
              {STEPS.map((s, i) => (
                <li key={s.n} style={v(i)} className="flex flex-col">
                  <StepArt i={i as 0 | 1 | 2} />
                  <div className="mt-5 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-sm font-semibold text-white">{s.n}</span>
                    <h3 className="text-xl font-semibold tracking-[-0.01em]">{s.title}</h3>
                  </div>
                  <p className="mt-2 text-base text-[var(--soft)]">{s.body}</p>
                </li>
              ))}
            </InView>

            <InView className="gd-stagger">
              <figure style={v(0)} className="mt-14 grid overflow-hidden rounded-2xl bg-[var(--panel)] text-white lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
                <div className="p-7 sm:p-10">
                  <p className="text-sm font-semibold text-[#f0b49f]">From step 3, word for word</p>
                  <blockquote className="mt-4 text-pretty text-xl font-medium leading-relaxed tracking-[-0.01em] sm:text-2xl sm:leading-snug">
                    &ldquo;The most important point: the Texas cottage food law &hellip; generally doesn&apos;t cover perishable cooked meals like these. &hellip;
                    Until that&apos;s settled, give friends free tastings but don&apos;t take money.&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-base text-white/65">It caught the rule that could stop the business, before day one.</figcaption>
                </div>
                <div className="border-t border-white/10 p-5 sm:p-8 lg:border-l lg:border-t-0">
                  <PlanDoc />
                </div>
              </figure>
            </InView>
            <div className="mt-14">
              <Buy />
            </div>
          </section>

          {/* what you get */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <Head eyebrow="What you get">The files I run, and the guide to run them.</Head>
            <div className="mt-12">
              <KitBrowser />
            </div>
            <div className="mt-16 flex items-end justify-between gap-6">
              <h3 className="text-3xl font-semibold tracking-[-0.02em]">
                The guide. <span className="gd-serif">Nine modules.</span>
              </h3>
            </div>
            <div className="mt-8">
              <ModuleIndex />
            </div>
          </section>

          {/* who made it */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
              <InView className="gd-stagger">
                <div style={v(0)}>
                  <Eyebrow>Why I built it</Eyebrow>
                </div>
                <h2 className="gd-h2 mt-4 max-w-[18ch] text-balance" style={v(1)}>
                  I&apos;m a law student. <span className="gd-serif">This runs my company.</span>
                </h2>
                <p className="mt-8 max-w-[32rem] text-lg text-[var(--body)]" style={v(2)}>
                  Two years ago I couldn&apos;t code. Now Claude Code closes our books, drafts our content overnight and runs our research. I approve. Copilot OS is
                  that setup, file by file.
                </p>
                <dl className="mt-8 grid max-w-[32rem] grid-cols-3 gap-4" style={v(3)}>
                  {(
                    [
                      [2, "", "people"],
                      [6, "", "agents at work"],
                      [0, "$", "outside funding"],
                    ] as const
                  ).map(([n, p, l]) => (
                    <div key={l} className="flex flex-col-reverse">
                      <dt className="mt-1 text-sm text-[var(--soft)]">{l}</dt>
                      <dd className="text-4xl font-semibold tracking-[-0.04em]">
                        <CountUp to={n} prefix={p} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </InView>
              <RevenueCard />
            </div>
          </section>

          {/* price */}
          <section id="price" className="scroll-mt-24 border-t border-[var(--rule)] py-20 sm:py-28">
            <Head eyebrow="Price">Pay once. Keep every file.</Head>
            <InView className="gd-stagger mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <div style={v(0)} className="relative rounded-2xl bg-white p-7 ring-2 ring-[var(--ink)] sm:p-9">
                <span className="absolute -top-3 left-7 rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-white">First 20 buyers</span>
                <h3 className="text-2xl font-semibold">Copilot OS</h3>
                <p className="mt-4 flex items-baseline gap-3">
                  <span className="text-6xl font-semibold tracking-[-0.04em]">$29</span>
                  <span className="text-xl text-[var(--muted)] line-through">$49</span>
                </p>
                <p className="mt-1 text-sm text-[var(--soft)]">Then $49. One payment, no subscription.</p>
                <ul className="mt-7 grid gap-3 text-base">
                  {["All 9 modules", "Every file in the kit", "Mac and Windows"].map((x) => (
                    <li key={x} className="flex gap-3">
                      <Check ok />
                      {x}
                    </li>
                  ))}
                </ul>
                <Buy label="Get it now" className="mt-8 w-full justify-center" />
              </div>
              <div style={v(1)} className="rounded-2xl bg-white/60 p-7 ring-1 ring-[var(--rule)] sm:p-9">
                <h3 className="text-2xl font-semibold">Founding Operator</h3>
                <p className="mt-4 text-6xl font-semibold tracking-[-0.04em]">$299</p>
                <p className="mt-1 text-sm text-[var(--soft)]">5 seats. Closes at the end of 2026.</p>
                <ul className="mt-7 grid gap-3 text-base">
                  {["Everything in Copilot OS", "A 60 minute call to build yours together", "30 days of questions"].map((x) => (
                    <li key={x} className="flex gap-3">
                      <Check ok />
                      {x}
                    </li>
                  ))}
                </ul>
                <a
                  href={OPERATOR_URL}
                  className="gd-press mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-full text-lg font-semibold text-[var(--ink)] ring-1 ring-[var(--ink)] hover:bg-[var(--ink)] hover:text-white"
                >
                  Take a seat
                </a>
              </div>
            </InView>
            <div className="mt-6 flex gap-3 rounded-2xl bg-white/60 p-5 ring-1 ring-[var(--rule)] sm:items-center">
              <Check ok />
              <p className="text-base text-[var(--body)]">
                <strong className="font-semibold text-[var(--ink)]">Not working for you?</strong>{" "}
                <Link href="/contact" className="underline decoration-[var(--rule-strong)] underline-offset-4 hover:text-[var(--ink)]">
                  Tell me why
                </Link>{" "}
                and I&apos;ll refund you.
              </p>
            </div>
            <p className="mt-6 text-sm text-[var(--soft)]">
              Rather have it built for you?{" "}
              <Link href="/setup" className="underline decoration-[var(--rule-strong)] underline-offset-4 hover:text-[var(--ink)]">
                Copilot OS Setup
              </Link>
            </p>
          </section>

          {/* who it's for */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <Head eyebrow="Who it's for">Built for owners, not engineers.</Head>
            <InView className="gd-stagger mt-12 grid gap-4 sm:grid-cols-2">
              <div style={v(0)} className="rounded-2xl bg-white p-7 ring-1 ring-[var(--rule)]">
                <p className="text-sm font-semibold text-[var(--pass)]">For you if</p>
                <ul className="mt-5 grid gap-4">
                  {FOR.filter(([ok]) => ok).map(([, t]) => (
                    <li key={t} className="flex gap-3 text-lg">
                      <Check ok />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={v(1)} className="rounded-2xl bg-white/50 p-7 ring-1 ring-[var(--rule)]">
                <p className="text-sm font-semibold text-[var(--muted)]">Not for you if</p>
                <ul className="mt-5 grid gap-4">
                  {FOR.filter(([ok]) => !ok).map(([, t]) => (
                    <li key={t} className="flex gap-3 text-lg text-[var(--soft)]">
                      <Check ok={false} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </InView>
          </section>

          {/* FAQ */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr]">
              <Head eyebrow="Questions">Before you buy.</Head>
              <div className="divide-y divide-[var(--rule)] rounded-2xl bg-white ring-1 ring-[var(--rule)]">
                {FAQ.map(([q, a]) => (
                  <details key={q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                      {q}
                      <span className="text-2xl font-normal text-[var(--muted)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 max-w-[60ch] text-base text-[var(--soft)]">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* final CTA */}
          <section className="grid items-center gap-10 overflow-hidden rounded-3xl bg-[var(--panel)] px-6 py-14 text-white sm:px-12 sm:py-16 lg:grid-cols-1">
            <div>
              <h2 className="max-w-[16ch] text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">Your first real job, thirty minutes from now.</h2>
              <p className="mt-6 max-w-[30rem] text-lg text-white/70">$29 for the first 20 buyers. Not working for you? Tell me why and I&apos;ll refund you.</p>
              <a
                href={BUY_URL}
                className="gd-press group mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-7 text-lg font-semibold text-[var(--ink)] hover:-translate-y-0.5 hover:bg-[#f3f4f1]"
              >
                Get Copilot OS
                <span className="text-[var(--muted)] line-through">$49</span>
                <span>$29</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </section>

          <p className="mt-10 text-xs text-[var(--muted)]">
            Copilot OS is a set of configuration files and written guides. It doesn&apos;t provide access to any AI service. Revenue figures are our company&apos;s estimate.
          </p>
        </div>
      </div>
    </SitePageLayout>
  );
}

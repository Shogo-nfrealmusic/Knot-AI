import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "./guide/style";
import { Rise, TaglineReveal } from "./Reveal";

// The Copilot OS sales page. Same look as the guide it sells: paper grid, ink, one orange accent.
// Every screen on this page was captured on my Mac on Nov 28, 2026, and every file listed ships in the kit.
// Nothing is drawn to look like an app; the revenue chart is a chart of the estimate and says so.

export const metadata: Metadata = {
  title: "Copilot OS | Shogo Kikuchi",
  description:
    "The guide and the exact Claude Code files behind a two-person company on track for $1.2M this year. Your first real job is done in 30 minutes.",
};

export const dynamic = "force-static";

// Replaced with the Kit checkout links once the products exist in Kit.
const BUY_URL = "#price";
const OPERATOR_URL = "#price";

const SHOT = {
  login: { src: "/os/guide/login-method.png", h: 914, alt: "Claude Code asking you to select a login method" },
  interview: { src: "/os/guide/interview.png", h: 914, alt: "Claude Code asking the first interview question about a meal-prep business" },
  plan: { src: "/os/guide/plan-written.png", h: 914, alt: "Claude Code reporting the plan file it wrote, with a task for each day" },
};

// ---------- small parts ----------

function Buy({ label = "Get Copilot OS", className = "" }: { label?: string; className?: string }) {
  return (
    <a
      href={BUY_URL}
      className={`gd-press inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--ink)] px-7 text-lg font-semibold text-white hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${className}`}
    >
      {label}
      <span className="text-white/50 line-through">$49</span>
      <span>$29</span>
    </a>
  );
}

function Shot({ src, h, alt, className = "" }: { src: string; h: number; alt: string; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl bg-[#1e1e1e] shadow-[0_30px_60px_-30px_rgba(21,23,26,.75)] ring-1 ring-black/10 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={1520} height={h} alt={alt} className="block h-auto w-full" />
    </div>
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

// ---------- revenue card (styled after a payments dashboard bar chart) ----------

const MONTHS = ["Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027", "Jul 2027", "Aug 2027"];
const ESTIMATE_K = [15, 32, 45, 60, 75, 90, 110, 125, 140, 155, 170, 183];
const SCALE_K = 200;
const DASH = { navy: "#0A2540", bar: "#9966FF", grid: "#E7ECF1", axis: "#ABB5C5", link: "#635BFF" };

function RevenueCard({ compact = false }: { compact?: boolean }) {
  return (
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
      <p className="mt-1 text-3xl font-bold tabular-nums">$1.2M</p>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-x-3" aria-hidden="true">
        <div className={`relative ${compact ? "h-[150px]" : "h-[190px]"}`}>
          {[0, 50, 100].map((top) => (
            <div key={top} className="absolute inset-x-0 h-px" style={{ top: `${top}%`, background: DASH.grid }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-1 px-1 sm:gap-2 sm:px-2">
            {ESTIMATE_K.map((k, i) => (
              <div key={MONTHS[i]} className="min-w-0 flex-1" style={{ height: `${(k / SCALE_K) * 100}%`, background: DASH.bar }} />
            ))}
          </div>
        </div>
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
  );
}

// ---------- content ----------

const JOBS = [
  {
    title: "It remembers your business",
    body: "Your goals, prices, customers and rules live in one file it reads every morning. You stop explaining yourself.",
    file: "CLAUDE.md",
  },
  {
    title: "A second agent checks the first",
    body: "One agent writes. Another one, with no stake in the answer, tries to prove it wrong before you see it.",
    file: "agents/verifier.md",
  },
  {
    title: "Six specialists, not one chat",
    body: "Researcher, analyst, marketer, secretary, engineer, verifier. Each knows its job and what it may not touch.",
    file: "agents/",
  },
  {
    title: "Money and deploys wait for your yes",
    body: "A guard blocks payments, pushes and secrets until you approve them. Enforced by code, not by asking nicely.",
    file: "hooks/security-guard.py",
  },
];

const STEPS = [
  { n: "1", title: "Install and sign in", body: "Copy one line, pick your Claude account. The guide shows every screen on Mac and Windows.", shot: SHOT.login },
  { n: "2", title: "It interviews you", body: "Before it writes a thing, it asks about your business, one question at a time.", shot: SHOT.interview },
  { n: "3", title: "Your first file lands", body: "A plan with a task for each day, written into your folder. Your first real job, done.", shot: SHOT.plan },
];

const FILES: [string, string][] = [
  ["project/CLAUDE.md", "the brief it reads every session"],
  ["vault/CLAUDE.md", "your second brain's rules"],
  ["agents/ × 6", "researcher, analyst, marketer, secretary, engineer, verifier"],
  ["hooks/security-guard.py", "blocks payments, pushes and secrets"],
  ["hooks/require-tests.py", "it can't call a job done while tests fail"],
  ["prompts/ × 3", "interview, daily routine, weekly review"],
  ["templates/ × 5", "decisions, changes, failures, skills"],
  ["settings.example.json", "the permissions I actually run"],
];

const MODULES: [string, string][] = [
  ["Start here", "From never opening a terminal to your first job done"],
  ["0 · Where you are", "Twenty questions that tell you where to start"],
  ["1A · A second brain", "It knows your business without being told"],
  ["1 · Memory that compounds", "It makes a mistake once, not twice"],
  ["2 · Never let AI grade its own work", "The writer and the checker are different agents"],
  ["3 · It works while you sleep", "Scheduled runs, parallel work, and what they cost"],
  ["4 · Locks, not promises", "Payments, deploys and secrets need your yes"],
  ["5 · The company", "Research, numbers, books and content, with real failures"],
  ["6 · Your own OS", "Put it together and keep it running"],
];

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
  ["Refunds?", "Files arrive the moment you buy, so sales are final. Broken files or a double charge are refunded."],
  ["Can you set it up for me?", "Yes. That's Copilot OS Setup, a separate service."],
];

// ---------- page ----------

export default function CopilotOsPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <div className="gd overflow-x-clip pb-20 pt-10 sm:pt-14">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-8">
          {/* hero: the promise on the left, the result and the real run on the right */}
          <header className="grid items-center gap-x-14 gap-y-12 pb-20 pt-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
            <div>
              <Eyebrow>Copilot OS</Eyebrow>
              <h1 className="gd-h1 mt-5 max-w-[19ch] text-balance !text-[clamp(40px,4.6vw,60px)] !leading-[1.02]">
                Your business, run by Claude Code. <span className="gd-serif">You just approve.</span>
              </h1>
              <p className="mt-7 max-w-[34rem] text-pretty text-lg text-[var(--body)] sm:text-xl">
                The exact setup behind a two person company on track for <strong className="font-semibold text-[var(--ink)]">$1.2M this year</strong>. Copy it, answer its questions,
                and have your first real job done in 30 minutes. No coding.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Buy />
                <span className="text-sm text-[var(--soft)]">Founding price for the first 20 buyers</span>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--soft)]">
                <li>9 modules</li>
                <li>6 agents</li>
                <li>Mac and Windows</li>
                <li>Pay once</li>
              </ul>
            </div>

            <div className="relative min-w-0 sm:pb-56">
              <RevenueCard compact />
              <div className="ml-auto mt-4 w-[92%] sm:absolute sm:rotate-[1.5deg] sm:bottom-0 sm:right-[-8%] sm:mt-0 sm:w-[64%] lg:right-[-12%]">
                <Shot {...SHOT.interview} />
                <p className="mt-2 text-right text-xs text-[var(--muted)]">A real run: it interviews a first time user</p>
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
          {/* what it does */}
          <section className="py-20 sm:py-28">
            <Rise>
              <Eyebrow>What it does</Eyebrow>
              <h2 className="gd-h2 mt-4 max-w-[20ch] text-balance">Four things a chat window can&apos;t do for you.</h2>
            </Rise>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {JOBS.map((j) => (
                <Rise key={j.title}>
                  <article className="flex h-full flex-col rounded-2xl bg-white p-7 ring-1 ring-[var(--rule)] transition-shadow duration-300 hover:shadow-[0_24px_50px_-36px_rgba(21,23,26,.5)]">
                    <h3 className="text-xl font-semibold tracking-[-0.01em]">{j.title}</h3>
                    <p className="mt-3 flex-1 text-base text-[var(--soft)]">{j.body}</p>
                    <p className="mt-6 font-mono text-xs text-[var(--muted)]">{j.file}</p>
                  </article>
                </Rise>
              ))}
            </div>
          </section>

          {/* how it works */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <Rise>
              <Eyebrow>The first 30 minutes</Eyebrow>
              <h2 className="gd-h2 mt-4 max-w-[20ch] text-balance">Three steps, exactly as you&apos;ll see them.</h2>
            </Rise>
            <ol className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-6">
              {STEPS.map((s) => (
                <Rise key={s.n}>
                  <li className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ink)] text-sm font-semibold text-white">{s.n}</span>
                      <h3 className="text-xl font-semibold tracking-[-0.01em]">{s.title}</h3>
                    </div>
                    <p className="mt-3 text-base text-[var(--soft)] lg:min-h-[4.5rem]">{s.body}</p>
                    <Shot {...s.shot} className="mt-6" />
                  </li>
                </Rise>
              ))}
            </ol>
            <Rise>
              <figure className="mt-14 rounded-2xl bg-white p-7 ring-1 ring-[var(--rule)] sm:p-10">
                <p className="text-sm font-semibold text-[var(--accent)]">From step 3, word for word</p>
                <blockquote className="mt-4 max-w-[44rem] text-pretty text-xl font-medium leading-relaxed tracking-[-0.01em] sm:text-2xl sm:leading-snug">
                  &ldquo;The most important point: the Texas cottage food law, which covers selling food made at home, generally doesn&apos;t cover
                  perishable cooked meals like these. You&apos;ll probably need to rent time in a permitted commercial kitchen and get a food permit.
                  &hellip; Until that&apos;s settled, give friends free tastings but don&apos;t take money.&rdquo;
                </blockquote>
                <figcaption className="mt-5 max-w-[40rem] text-base text-[var(--soft)]">
                  It spotted the rule that could stop the business before it started, made checking it Monday&apos;s task, and said the first $500
                  should go on permits and the kitchen, not equipment. That&apos;s the kind of judgment the setup is built for.
                </figcaption>
              </figure>
            </Rise>
            <div className="mt-14">
              <Buy />
            </div>
          </section>

          {/* what you get */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <Rise>
              <Eyebrow>What you get</Eyebrow>
              <h2 className="gd-h2 mt-4 max-w-[22ch] text-balance">The files I run, and the guide to run them.</h2>
            </Rise>
            <div className="mt-12 grid items-start gap-6 lg:grid-cols-2">
              <Rise>
                <div className="rounded-2xl bg-[var(--panel)] p-6 text-white sm:p-8">
                  <p className="text-sm font-semibold text-white/60">The kit</p>
                  <ul className="mt-5 divide-y divide-white/10">
                    {FILES.map(([f, d]) => (
                      <li key={f} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-4">
                        <span className="font-mono text-sm text-[#f0b49f]">{f}</span>
                        <span className="text-sm text-white/70">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
              <Rise>
                <div className="h-full rounded-2xl bg-white p-6 ring-1 ring-[var(--rule)] sm:p-8">
                  <p className="text-sm font-semibold text-[var(--muted)]">The guide · 9 modules</p>
                  <ul className="mt-5 divide-y divide-[var(--rule)]">
                    {MODULES.map(([m, d]) => (
                      <li key={m} className="py-3">
                        <p className="text-base font-semibold">{m}</p>
                        <p className="text-sm text-[var(--soft)]">{d}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Rise>
            </div>
          </section>

          {/* who made it */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]">
              <Rise>
                <Eyebrow>Why trust this</Eyebrow>
                <h2 className="gd-h2 mt-4 max-w-[18ch] text-balance">
                  I&apos;m a law student. <span className="gd-serif">This runs my company.</span>
                </h2>
                <div className="mt-8 max-w-[34rem] space-y-4 text-lg text-[var(--body)]">
                  <p>Two years ago I couldn&apos;t code. Today two of us run a company on track for $1.2M this year, with no engineers and no outside money.</p>
                  <p>Claude Code closes our books, drafts our content overnight, runs our research and records every decision. I approve. Copilot OS is that setup, file by file.</p>
                </div>
              </Rise>
              <Rise>
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--rule)] ring-1 ring-[var(--rule)]">
                  {(
                    [
                      ["$1.2M", "revenue this year, estimated"],
                      ["2", "people run the company"],
                      ["0", "engineers on payroll"],
                      ["$0", "outside funding"],
                    ] as const
                  ).map(([v, l]) => (
                    <div key={l} className="bg-white p-6 sm:p-8">
                      <dt className="sr-only">{l}</dt>
                      <dd className="text-5xl font-semibold tracking-[-0.04em] tabular-nums">{v}</dd>
                      <dd className="mt-2 text-sm text-[var(--soft)]">{l}</dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            </div>
          </section>

          {/* price */}
          <section id="price" className="scroll-mt-24 border-t border-[var(--rule)] py-20 sm:py-28">
            <Rise>
              <Eyebrow>Price</Eyebrow>
              <h2 className="gd-h2 mt-4 max-w-[20ch] text-balance">Pay once. Keep every file.</h2>
            </Rise>
            <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
              <div className="relative rounded-2xl bg-white p-7 ring-2 ring-[var(--ink)] sm:p-9">
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
              <div className="rounded-2xl bg-white/60 p-7 ring-1 ring-[var(--rule)] sm:p-9">
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
            <Rise>
              <Eyebrow>Who it&apos;s for</Eyebrow>
              <h2 className="gd-h2 mt-4 max-w-[20ch] text-balance">Built for owners, not engineers.</h2>
            </Rise>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-7 ring-1 ring-[var(--rule)]">
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
              <div className="rounded-2xl bg-white/50 p-7 ring-1 ring-[var(--rule)]">
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
            </div>
          </section>

          {/* FAQ */}
          <section className="border-t border-[var(--rule)] py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr]">
              <Rise>
                <Eyebrow>Questions</Eyebrow>
                <h2 className="gd-h2 mt-4 text-balance">Before you buy.</h2>
              </Rise>
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
          <section className="rounded-3xl bg-[var(--panel)] px-6 py-16 text-white sm:px-14 sm:py-20">
            <h2 className="max-w-[18ch] text-balance text-4xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">
              Your first real job, thirty minutes from now.
            </h2>
            <p className="mt-6 max-w-[36rem] text-lg text-white/70">
              9 modules, 6 agents, the guard that stops payments without your yes, and every file I run. $29 for the first 20 buyers.
            </p>
            <a
              href={BUY_URL}
              className="gd-press mt-10 inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-7 text-lg font-semibold text-[var(--ink)] hover:bg-[#f3f4f1]"
            >
              Get Copilot OS
              <span className="text-[var(--muted)] line-through">$49</span>
              <span>$29</span>
            </a>
          </section>

          <p className="mt-10 text-xs text-[var(--muted)]">
            Copilot OS is a set of configuration files and written guides. It doesn&apos;t provide access to any AI service. Revenue figures are our company&apos;s estimate.
          </p>
        </div>
      </div>
    </SitePageLayout>
  );
}

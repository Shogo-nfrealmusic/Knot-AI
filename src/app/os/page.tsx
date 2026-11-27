import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "./guide/style";

// The Copilot OS sales page. Same look as the guide it sells: paper grid, ink, one orange accent.
// Every screen on this page was captured on my Mac on Nov 28, 2026. Nothing is drawn to look like an app.

export const metadata: Metadata = {
  title: "Copilot OS | Shogo Kikuchi",
  description: "The guide and the exact Claude Code files behind a two-person company doing $375K+ a year. Your first real job is done in 30 minutes.",
};

export const dynamic = "force-static";

// Replaced with the Kit checkout links once the products exist in Kit.
const BUY_URL = "#price";
const OPERATOR_URL = "#price";

const SHOTS = [
  { src: "/os/guide/login-method.png", h: 914, alt: "Claude Code asking you to select a login method", cap: "First launch: pick your Claude account." },
  { src: "/os/guide/trust.png", h: 600, alt: "Claude Code asking whether you trust the my-business folder", cap: "Give it one folder, not your whole computer." },
  { src: "/os/guide/interview.png", h: 914, alt: "Claude Code asking the first interview question about a meal-prep business", cap: "It interviews you before it writes anything." },
  { src: "/os/guide/plan-written.png", h: 914, alt: "Claude Code reporting the plan file it wrote, with a task for each day", cap: "Two answers later, the file is in your folder." },
];

const MODULES = [
  ["Start here", "Never opened a terminal? Thirty minutes from nothing to your first real job done."],
  ["Module 0. Where you are", "Twenty questions that tell you where to start."],
  ["Module 1A. A second brain", "Claude remembers your business, so you stop explaining it every morning."],
  ["Module 1. Memory that compounds", "It makes a mistake once. Not twice."],
  ["Module 2. Never let AI grade its own work", "One agent writes, another tries to break it. The part I trust least, so the part I built hardest."],
  ["Module 3. It works while you sleep", "Scheduled runs, parallel work, and what it costs."],
  ["Module 4. Locks, not promises", "Payments, deploys and secrets need your yes, enforced by rules instead of hope."],
  ["Module 5. The company", "Research, analytics, bookkeeping and content at my company. Real numbers, real failures."],
  ["Module 6. Your own OS", "Put it together and keep it running."],
];

const FAQ = [
  ["I can't code. Is this for me?", "I couldn't either when I started. You need a paid Claude plan and the patience to follow steps one at a time. Start here was written for people who have never opened a terminal."],
  ["Which Claude plan do I need?", "A paid plan. Pro is enough to start. Copilot OS doesn't include access to Claude; it's the setup and the guide."],
  ["Mac or Windows?", "Both. Every command in the guide switches between Mac and Windows."],
  ["Is it a course or a set of files?", "Both. The guide teaches each part step by step, and the files are the ones I actually run: agents, hooks, templates and CLAUDE.md. You copy them into your own setup."],
  ["How fast will something work?", "Your first real job is done in about 30 minutes, the same run you see in the screens above."],
  ["Can't I find this for free?", "The features, yes. Anthropic's own docs are free and good, and the guide links them. What you won't find is one complete setup that runs a real company, with the files."],
  ["Refunds?", "You get every file the moment you buy, so purchases are final. Broken files or a duplicate purchase are refunded."],
  ["Can you just set it up for me?", "Yes. That's a separate service."],
];

function Buy({ label = "Get Copilot OS", className = "" }: { label?: string; className?: string }) {
  return (
    <a href={BUY_URL} className={`gd-press inline-flex min-h-14 items-center gap-3 rounded-full bg-[var(--ink)] px-7 text-[18px] font-medium text-white hover:bg-black ${className}`}>
      {label}
      <span className="text-white/55 line-through">$49</span>
      <span>$29</span>
    </a>
  );
}

function Shot({ src, h, alt }: { src: string; h: number; alt: string }) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#1e1e1e] shadow-[0_24px_50px_-30px_rgba(21,23,26,.7)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={1520} height={h} alt={alt} className="block h-auto w-full" />
    </div>
  );
}

// The shape of the year, not monthly figures: only the estimated total is stated.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const SHAPE = [0.34, 0.38, 0.5, 0.42, 0.44, 0.4, 0.3, 0.42, 0.48, 0.82, 0.9, 1];

function RevenueCard() {
  return (
    <figure className="gd-plate mt-10 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[15px] text-[var(--muted)]">This year, estimated revenue</p>
          <p className="mt-1 text-[clamp(44px,7vw,72px)] font-medium leading-none tracking-[-0.04em] tabular-nums text-[var(--ink)]">$375K+</p>
        </div>
        <p className="text-[15px] text-[var(--soft)]">2 people · no outside funding</p>
      </div>
      <div className="mt-8 flex h-[180px] items-end gap-[6px] border-b border-[var(--rule-strong)] sm:gap-2" aria-hidden="true">
        {SHAPE.map((h, i) => (
          <div key={MONTHS[i]} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <div
              className={`w-full rounded-t-[6px] ${i >= 9 ? "bg-[var(--accent)]" : "bg-[var(--ink)]/80"}`}
              style={{ height: `${Math.round(h * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-[6px] sm:gap-2" aria-hidden="true">
        {MONTHS.map((m) => (
          <span key={m} className="min-w-0 flex-1 text-center text-[12px] text-[var(--muted)]">
            {m}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 text-[14px] text-[var(--muted)]">Estimate for 2026. Bars show the shape of the year, not exact monthly figures.</figcaption>
    </figure>
  );
}

function Section({ id, title, accent, children }: { id?: string; title: string; accent?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-[var(--rule)] py-16 sm:py-20">
      <h2 className="gd-h2 max-w-[22ch]">
        {title} {accent ? <span className="gd-serif">{accent}</span> : null}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function CopilotOsPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <div className="gd pb-16 pt-14">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          {/* hero */}
          <header className="grid items-center gap-x-14 gap-y-10 pb-16 pt-6 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)]">
            <div>
              <p className="text-[16px] text-[var(--muted)]">Copilot OS</p>
              <h1 className="gd-h1 mt-4 max-w-[19ch] !text-[clamp(36px,4.6vw,58px)] !leading-[1.04]">
                Put Claude Code to work in your business. <span className="gd-serif">Even if you&apos;ve never opened a terminal.</span>
              </h1>
              <div className="gd-prose mt-8">
                <p>
                  The guide and the exact files behind a two-person company doing <strong>$375K+ a year</strong> with no engineers. Start from
                  zero. Your first real job is done in 30 minutes.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Buy />
                <span className="text-[15px] text-[var(--soft)]">Founding price for the first 20 buyers</span>
              </div>
            </div>
            <figure className="min-w-0">
              <Shot src={SHOTS[2].src} h={SHOTS[2].h} alt={SHOTS[2].alt} />
              <figcaption className="mt-3 text-[15px] text-[var(--muted)]">A real run on my Mac: Claude Code interviewing a first-time user about their business idea.</figcaption>
            </figure>
          </header>

          <div className="max-w-[880px]">
            <Section title="The first 30 minutes," accent="exactly as you'll see them.">
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2">
                {SHOTS.map((s, i) => (
                  <figure key={s.src} className="min-w-0">
                    <Shot src={s.src} h={s.h} alt={s.alt} />
                    <figcaption className="mt-3 flex gap-3 text-[17px] text-[var(--body)]">
                      <span className="font-mono text-[var(--accent)]">{i + 1}</span>
                      {s.cap}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-12">
                <Buy />
              </div>
            </Section>

            <Section title="Why I built it." accent="I wanted money, not a hobby.">
              <div className="gd-prose">
                <p>I study law. I don&apos;t have a CS degree. Two years ago I couldn&apos;t code.</p>
                <p>
                  Today two of us run a company doing <strong>$375K+ a year</strong>, with zero outside funding. Claude Code
                  closes our books every month, drafts our content overnight, runs our research, and writes down every decision we make. I approve.
                  It works.
                </p>
                <p>Copilot OS is that setup, file by file, with the guide I wish I&apos;d had on day one.</p>
              </div>
              <RevenueCard />
            </Section>

            <Section title="What you get." accent="A guide and the files.">
              <div className="gd-prose">
                <p>
                  <strong>The files.</strong> The same agents, hooks, templates and CLAUDE.md I run, with my company&apos;s details taken out. Drop
                  them into your own setup.
                </p>
                <p>
                  <strong>The guide.</strong> Nine modules, from installing Claude Code to running your work on it.
                </p>
              </div>
              <ol className="mt-8 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {MODULES.map(([name, line]) => (
                  <li key={name} className="grid gap-1 py-4 sm:grid-cols-[280px_1fr] sm:gap-6">
                    <span className="text-[18px] font-medium text-[var(--ink)]">{name}</span>
                    <span className="text-[17px] leading-relaxed text-[var(--soft)]">{line}</span>
                  </li>
                ))}
              </ol>
            </Section>

            <Section id="price" title="Price." accent="Pay once.">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="gd-plate p-7">
                  <h3 className="gd-h3">Copilot OS</h3>
                  <p className="mt-3 flex items-baseline gap-3">
                    <span className="text-[44px] font-medium tracking-[-0.03em]">$29</span>
                    <span className="text-[20px] text-[var(--muted)] line-through">$49</span>
                  </p>
                  <p className="text-[15px] text-[var(--soft)]">First 20 buyers. Then $49.</p>
                  <ul className="mt-6 grid gap-2 text-[17px] text-[var(--body)]">
                    <li>All nine modules</li>
                    <li>Every file I run</li>
                    <li>Mac and Windows</li>
                  </ul>
                  <Buy label="Get it" className="mt-7 w-full justify-center" />
                </div>
                <div className="gd-plate p-7">
                  <h3 className="gd-h3">Founding Operator</h3>
                  <p className="mt-3 text-[44px] font-medium tracking-[-0.03em]">$299</p>
                  <p className="text-[15px] text-[var(--soft)]">5 seats. Closes at the end of 2026.</p>
                  <ul className="mt-6 grid gap-2 text-[17px] text-[var(--body)]">
                    <li>Everything in Copilot OS</li>
                    <li>A 60-minute call to build yours together</li>
                    <li>30 days of questions</li>
                  </ul>
                  <a href={OPERATOR_URL} className="gd-press mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full px-7 text-[18px] font-medium text-[var(--ink)] ring-1 ring-[var(--ink)]">
                    Take a seat
                  </a>
                </div>
              </div>
              <p className="mt-6 text-[16px] text-[var(--soft)]">
                Rather have it built for you?{" "}
                <Link href="/setup" className="underline decoration-[var(--rule-strong)] underline-offset-4 hover:text-[var(--ink)]">
                  Copilot OS Setup
                </Link>
              </p>
            </Section>

            <Section title="Who it's for.">
              <div className="grid gap-10 sm:grid-cols-2">
                <ul className="gd-prose grid gap-3">
                  <li>You&apos;re not an engineer, and you want AI doing real work in your business.</li>
                  <li>You&apos;d rather copy a setup that already makes money than design one from zero.</li>
                  <li>You&apos;re done thinking about it.</li>
                </ul>
                <div>
                  <h3 className="gd-h3">Not for you if</h3>
                  <ul className="gd-prose mt-3 grid gap-3">
                    <li>You want a prompt pack.</li>
                    <li>You want to argue about whether this counts as real engineering.</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section title="Questions.">
              <dl className="divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {FAQ.map(([q, a]) => (
                  <div key={q} className="py-6">
                    <dt className="gd-h3">{q}</dt>
                    <dd className="gd-prose mt-2">{a}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <section className="border-t border-[var(--rule)] pt-16 sm:pt-20">
              <h2 className="gd-h2 max-w-[20ch]">
                Your first real job, <span className="gd-serif">thirty minutes from now.</span>
              </h2>
              <div className="mt-8">
                <Buy />
              </div>
              <p className="mt-10 text-[14px] text-[var(--muted)]">
                Copilot OS is a set of configuration files and written guides. It doesn&apos;t provide access to any AI service.
              </p>
            </section>
          </div>
        </div>
      </div>
    </SitePageLayout>
  );
}

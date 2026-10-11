import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import Statement from "@/app/components/Statement";
import ContentSection from "@/app/components/ContentSection";
import AboutTimeline from "@/app/components/AboutTimeline";
import PilotTimeline from "@/app/components/howitworks/PilotTimeline";
import StackTabs from "@/app/components/illustrations/StackTabs";
import CTA from "@/app/components/CTA";
import { GridSection } from "@/app/components/ui/grid-section";

const title = "About — Engineer, PM, and co-founder | Shogo Kikuchi";
const description =
  "Shogo Kikuchi is a product manager, software engineer, and entrepreneur, and the co-founder and CTO of TPS Collective in Tokyo.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about", type: "website" },
};

const story = [
  "He taught himself to code during university and landed his first startup internship within three months, going on to work as a full-stack and frontend engineer. He later moved to Seattle to study computer science for a year, where living abroad shaped how he thinks about building technology and business together.",
  "Back in Japan, he worked on TikTok Shop operations at ByteDance Japan, and joined Mercari as a product manager, where he built and published an AI agent that automated core PM workflows using Claude Code and MCP. Alongside this, he has built an audience around fitness and self-growth, developing a working knowledge of content production and brand building.",
  "In 2026, he co-founded the creative tech company TPS Collective with Tetsuta Endo. He leads product, technology, growth, and operations, and personally builds the systems the business runs on — the booking platform, the corporate site, and the AI automation behind studio operations.",
  "Today he drives the growth of the company's inbound creative business from the technology side, with a focus on AI agents and LLM-based automation. From April 2027, he joins Mercari as a Product Manager while continuing to lead technology at TPS Collective.",
];

const capabilities = [
  {
    label: "AI Automation",
    description:
      "Agents and pipelines built on Claude Code, MCP, and LLM APIs that take repeatable work off people's plates and run unattended.",
  },
  {
    label: "Full-Stack Development",
    description:
      "Web products with Next.js, Go, and PostgreSQL on AWS, from the first screen to payments, deployment, and monitoring.",
  },
  {
    label: "Integrations & Internal Tools",
    description:
      "The tools a team already uses, connected into one flow, plus internal apps that replace DMs and spreadsheets.",
  },
  {
    label: "Data & Growth",
    description:
      "Analytics, session data, and content performance turned into clear decisions about what to build or fix next.",
  },
];

// Canonical stack naming for the whole site (PORTFOLIO.md §6).
const stack = [
  { label: "Languages", items: "Go, TypeScript, Python, JavaScript, SQL" },
  { label: "Frontend", items: "Next.js, React, Tailwind CSS" },
  { label: "Mobile", items: "React Native, Expo" },
  { label: "Backend", items: "Go, Python, Django, REST APIs" },
  { label: "Infra", items: "AWS, Cloudflare, Vercel" },
  { label: "Database", items: "PostgreSQL" },
  { label: "Payments", items: "Stripe, Stripe Connect" },
  {
    label: "AI",
    items: "Claude Code, MCP (Model Context Protocol), Anthropic API, OpenAI API",
  },
  { label: "Analytics", items: "GA4, Microsoft Clarity" },
  { label: "Other", items: "Git, GitHub, Adobe Premiere Pro" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-warm">
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <SitePageLayout>
      <GridSection
        className="border-t-0"
        innerClassName="px-4 pb-16 pt-28 sm:px-10 sm:pt-36 lg:pb-24"
      >
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-16">
          <div>
            <Eyebrow>About</Eyebrow>
            <h1 className="mt-6 type-display text-text-primary">
              Shogo Kikuchi
            </h1>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-text-secondary">
              <span>Co-Founder &amp; CTO, TPS Collective</span>
              <span className="h-3 w-px bg-neutral-300" />
              <a
                href="https://www.instagram.com/imshogo.k/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[13px] text-warm transition-colors hover:text-text-primary"
              >
                @imshogo.k
              </a>
            </p>
            <p className="mt-10 max-w-xl font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.3] text-neutral-500">
              Born in Chiba, Japan, in 2004.{" "}
              <span className="italic text-text-primary">
                Product manager, software engineer, and entrepreneur.
              </span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex h-10 items-center rounded-lg border border-black bg-black px-5 text-sm font-medium text-white shadow-sm transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200"
              >
                Get in touch
              </Link>
              <Link
                href="/work"
                className="inline-flex h-10 items-center rounded-lg border border-neutral-300 bg-white px-5 text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50 hover:ring-4 hover:ring-black/5"
              >
                See my work
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-4 rounded-[28px] bg-[radial-gradient(closest-side,rgba(255,138,102,0.12),transparent)] blur-2xl" />
            <div className="relative rounded-[20px] border border-neutral-200 bg-white p-2 shadow-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12px]">
                <Image
                  src="/images/profile/shogo-portrait.jpg"
                  alt="Shogo Kikuchi"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 460px"
                  className="object-cover object-[50%_45%]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-5 left-5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
                  Tokyo · Global
                </p>
              </div>
            </div>
          </div>
        </div>
      </GridSection>

      <Statement />

      <GridSection innerClassName="px-4 py-20 sm:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Story</Eyebrow>
            <h2 className="mt-5 max-w-md type-heading text-text-primary">
              Building the systems{" "}
              <span className="font-serif text-[1.08em] font-normal italic text-neutral-500">
                creative work
              </span>{" "}
              runs on.
            </h2>
          </div>
          <div>
            <div className="space-y-6 text-[17px] leading-[1.8] tracking-[-0.011em] text-text-secondary">
              {story.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <blockquote className="mt-12 border-l border-warm/60 pl-6 font-serif text-[clamp(1.5rem,2.4vw,2rem)] italic leading-[1.35] text-text-primary">
              Guided by the belief that creative work should not depend on any
              single person, he is building the systems that make creative
              production scalable and repeatable — from Tokyo, for the global
              market.
            </blockquote>
          </div>
        </div>
      </GridSection>

      <ContentSection className="py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow>Path</Eyebrow>
            <h2 className="mt-5 max-w-md type-heading text-text-primary">
              From self-taught engineer to CTO.
            </h2>
          </div>
          <AboutTimeline />
        </div>
      </ContentSection>

      <ContentSection className="py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div>
            <Eyebrow>What I Do</Eyebrow>
            <h2 className="mt-5 max-w-md type-heading text-text-primary">
              From AI automation to production software.
            </h2>
          </div>

          {/* dub-style cell grid: hairline gaps instead of separate cards. */}
          <div className="grid gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <article
                key={capability.label}
                className="min-h-[190px] bg-white p-6 transition-colors duration-150 hover:bg-neutral-50"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-warm">
                  {capability.label}
                </p>
                <p className="mt-8 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                  {capability.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection className="py-20 lg:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-start lg:gap-16">
          <div>
            <Eyebrow>How I Work</Eyebrow>
            <h2 className="mt-5 type-heading text-text-primary">
              Assessment, build, ship, maintain.
            </h2>
            <p className="mt-6 max-w-xl text-[16px] leading-relaxed tracking-[-0.012em] text-text-secondary">
              Every project starts with the numbers and ends with a system you
              can keep running. You always know what is being built this week
              and what it should change.
            </p>
          </div>
          <PilotTimeline />
        </div>
      </ContentSection>

      <ContentSection className="py-20 lg:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-start lg:gap-16">
          <div className="min-w-0">
            <Eyebrow>Stack</Eyebrow>
            <h2 className="mt-5 type-heading text-text-primary">
              What I ship with.
            </h2>
            <dl className="mt-10 divide-y divide-neutral-200 border-y border-neutral-200">
              {stack.map((group) => (
                <div
                  key={group.label}
                  className="grid gap-1 py-3 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted sm:pt-0.5">
                    {group.label}
                  </dt>
                  <dd className="text-[14px] leading-relaxed tracking-[-0.01em] text-neutral-500">
                    {group.items}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <StackTabs />
          </div>
        </div>
      </ContentSection>

      <CTA />
    </SitePageLayout>
  );
}

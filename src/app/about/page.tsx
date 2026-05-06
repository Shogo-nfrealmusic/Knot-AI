import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";

export const metadata: Metadata = {
  title: "About | Knot",
  description:
    "Knot builds AI tools, internal systems, automations, and AI-native workflows that connect companies with the technology they already use.",
};

const capabilities = [
  {
    label: "AI Tool Development",
    description:
      "Custom AI products, workflow agents, copilots, and internal tools designed around real business operations.",
  },
  {
    label: "AI Consulting",
    description:
      "Practical guidance on where AI should be used, what should stay human, and how to turn experiments into shipped systems.",
  },
  {
    label: "Full-Stack Development",
    description:
      "Web applications, dashboards, APIs, e-commerce systems, and production software built from idea to launch.",
  },
  {
    label: "Automation",
    description:
      "Integrations that connect everyday tools, remove repetitive work, and keep information moving across teams.",
  },
];

const principles = [
  "Build inside the tools teams already use.",
  "Connect AI to the workflow, not just the prompt box.",
  "Ship small, prove value, then compound the system.",
  "Make technology feel operational, not experimental.",
];

const members = [
  {
    name: "Byakko Kondo",
    jpName: "Kondo Byakko",
    role: "Full-Stack Engineer",
    image: "/images/team/byakko-kondo.png",
    summary:
      "Byakko is a full-stack engineer who has worked as a freelance and contract engineer across multiple companies, shipping production software for a range of business needs.",
    highlights: [
      "Built and released multiple independent web services.",
      "Developed e-commerce sites with multi-million-yen sales impact.",
      "Experienced across client work, product development, and end-to-end web delivery.",
    ],
  },
  {
    name: "Shogo Kikuchi",
    jpName: "Kikuchi Shogo",
    role: "Engineer / AI Builder",
    image: "/images/team/shogo-kikuchi.png",
    summary:
      "Shogo is a 22-year-old fourth-year university student who studied Computer Science in the United States and works across engineering, product, and AI implementation.",
    highlights: [
      "CTO at tetty's photo studio, building the technical foundation for the business.",
      "Internship experience at ByteDance and Mercari.",
      "Experience across multiple companies, with a focus on software, AI tools, and operational systems.",
    ],
    link: {
      label: "tetty's photo studio",
      href: "https://www.instagram.com/tettyphotostudio/",
    },
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-[#ff8a66]">
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <SitePageLayout>
      <section className="border-b border-white/10 px-4 pb-20 pt-36 sm:px-6 lg:px-8 lg:pb-28">
        <div className="mx-auto grid max-w-[1344px] gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <div className="mb-7 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary">
                AI Tools
              </span>
              <span className="rounded-full border border-[#5dcaa5]/25 bg-[#5dcaa5]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8ce0c4]">
                Automation
              </span>
              <span className="rounded-full border border-[#ff8a66]/25 bg-[#ff8a66]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ffad91]">
                Full-stack
              </span>
            </div>
            <h1 className="max-w-5xl text-[clamp(3rem,7vw,6.75rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-text-primary">
              We connect AI to the work that already runs your company.
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
              Knot builds AI tools, internal systems, automations, and custom
              software for teams that want AI to become part of daily operations,
              not another disconnected experiment.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0e10] p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/35">
                Company signal
              </p>
              <span className="h-2 w-2 rounded-full bg-[#5dcaa5]" />
            </div>
            <p className="mt-6 text-[32px] font-semibold leading-none tracking-[-0.04em] text-text-primary">
              Knot
            </p>
            <p className="mt-4 text-[14px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              A knot is a point of connection. Our name reflects the work we do:
              tying AI, internal tools, data, and people together so new
              innovation can move through the business.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1344px]">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Eyebrow>What We Do</Eyebrow>
              <h2 className="mt-5 max-w-xl text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-text-primary">
                From AI strategy to production software.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <article
                  key={capability.label}
                  className="min-h-[210px] rounded-xl border border-white/10 bg-[#0d0e10] p-5"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ff8a66]">
                    {capability.label}
                  </p>
                  <p className="mt-10 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                    {capability.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1344px] gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Why Knot</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-text-primary">
              The value is in the connection.
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed tracking-[-0.012em] text-text-secondary">
              Most companies already have tools, data, processes, and people who
              know the work deeply. The missing layer is often the connection:
              the system that lets AI understand context, act safely, and move
              work forward across existing tools.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d0e10] p-6">
            <div className="grid gap-4">
              {principles.map((principle, index) => (
                <div
                  key={principle}
                  className="flex gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="font-mono text-[12px] text-[#ff8a66]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed tracking-[-0.01em] text-[#d0d6e0]">
                    {principle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1344px]">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>Members</Eyebrow>
              <h2 className="mt-5 text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-text-primary">
                A small team that builds.
              </h2>
            </div>
            <p className="max-w-md text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              We combine product judgment, software engineering, and AI
              implementation experience to ship systems that can be used in real
              operations.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {members.map((member) => (
              <article
                key={member.name}
                className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0e10]"
              >
                <div className="grid md:grid-cols-[250px_minmax(0,1fr)]">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-white md:aspect-auto md:min-h-full md:border-b-0 md:border-r">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#ff8a66]">
                      {member.role}
                    </p>
                    <h3 className="mt-4 text-[28px] font-semibold leading-none tracking-[-0.035em] text-text-primary">
                      {member.name}
                    </h3>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/35">
                      {member.jpName}
                    </p>
                    <p className="mt-6 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                      {member.summary}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {member.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3 text-[14px] leading-relaxed text-text-secondary">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5dcaa5]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    {member.link ? (
                      <a
                        href={member.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex text-[14px] font-medium text-[#ffad91] transition-colors hover:text-text-primary"
                      >
                        {member.link.label}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-[1344px]">
          <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-text-primary">
            Have a workflow that should be smarter?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-relaxed tracking-[-0.012em] text-text-secondary">
            We can help design the AI layer, build the tool, connect it to your
            existing systems, and make it reliable enough for daily use.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-white/90"
            >
              Start with a Pilot
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-full border border-border-solid px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>
    </SitePageLayout>
  );
}

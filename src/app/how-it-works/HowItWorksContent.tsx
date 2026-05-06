"use client";

import Link from "next/link";
import { motion } from "motion/react";
import PilotTimeline from "@/app/components/howitworks/PilotTimeline";
import SkillsSuite from "@/app/components/howitworks/SkillsSuite";
import NetworkGrowth from "@/app/components/howitworks/NetworkGrowth";

const pathCards = [
  {
    number: "01",
    title: "Pilot Build",
    duration: "2-4 weeks",
    brief: "Prove it works.",
  },
  {
    number: "02",
    title: "AI Implementation",
    duration: "1-3 months",
    brief: "Make it production-ready.",
  },
  {
    number: "03",
    title: "AI-Native Operations",
    duration: "Ongoing",
    brief: "Compound the wins.",
  },
];

const phases = [
  {
    number: "01",
    heading: "Pilot Build",
    subheading: "Prove it works.",
    description:
      "Two to four weeks. One workflow. One working AI system. We pick a meaningful target, build it inside the tools your team already uses, and let the results decide what comes next.",
    outcomes: [
      "One production-ready AI system",
      "Integrated into your existing tools",
      "Operating documentation and handoff",
      "Clear evaluation of what to build next",
    ],
    visual: <PilotTimeline />,
  },
  {
    number: "02",
    heading: "AI Implementation",
    subheading: "Make it production-ready.",
    description:
      "One to three months. Multiple workflows. We design and build a coordinated suite of AI capabilities that operate inside your team's existing tools, with proper handoff and documentation.",
    outcomes: [
      "A library of integrated AI systems",
      "Cross-workflow coordination",
      "Operational handoff and training",
      "Defined ownership and review processes",
    ],
    visual: <SkillsSuite />,
  },
  {
    number: "03",
    heading: "AI-Native Operations",
    subheading: "Compound the wins.",
    description:
      "Every month, your AI gets sharper. New capabilities build on the last. Manual work shrinks. Decisions get faster. Your operations become something competitors can't buy.",
    outcomes: [
      "Continuous refinement and tuning",
      "New capabilities every month",
      "Embedded AI operations partner",
      "Compounding operational leverage",
    ],
    visual: <NetworkGrowth />,
  },
];

const useCases = [
  {
    title: "Inquiry Routing",
    description:
      "Classify inbound requests, enrich them with context, and send them to the right owner automatically.",
  },
  {
    title: "Document Review",
    description:
      "Review recurring documents for missing details, policy mismatches, and follow-up actions.",
  },
  {
    title: "Operations Reporting",
    description:
      "Turn fragmented activity across tools into usable operational summaries and decision signals.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.5, ease: "easeOut" },
} as const;

export default function HowItWorksContent() {
  return (
    <div className="bg-bg-primary">
      <div className="border-b border-border px-4 pb-20 pt-36 sm:px-6 lg:px-8 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-[1344px]"
        >
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-text-primary">
            How it works
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
            From your first conversation to AI that runs your operations.
          </p>
        </motion.div>
      </div>

      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1344px]">
          <motion.div {...fadeUp}>
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              The Path
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-primary">
              Three phases. One operating system.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="mt-12 grid gap-4 md:grid-cols-3"
          >
            {pathCards.map((card) => (
              <motion.article
                key={card.number}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="rounded-2xl border border-border bg-bg-card-alt/45 p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[13px] text-[rgb(204,120,92)]">
                    {card.number}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                    {card.duration}
                  </span>
                </div>
                <span className="mt-10 block font-mono text-[clamp(3.5rem,8vw,6rem)] leading-none tracking-[-0.08em] text-[rgb(204,120,92)]/80">
                  {card.number}
                </span>
                <h3 className="mt-8 text-[22px] font-semibold tracking-[-0.02em] text-text-primary">
                  {card.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                  {card.brief}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <div>
        {phases.map((phase) => (
          <section
            key={phase.number}
            className="phase-section relative flex min-h-screen items-center border-b border-border bg-bg-primary px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
          >
            <div className="mx-auto grid w-full max-w-[1344px] items-center gap-12 md:grid-cols-2 lg:gap-20">
              <div>
                <p className="font-mono text-[13px] text-[rgb(204,120,92)]">
                  PHASE {phase.number}
                </p>
                <h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-primary">
                  {phase.heading}
                </h2>
                <p className="mt-5 text-[22px] font-medium tracking-[-0.02em] text-[#d0d6e0]">
                  {phase.subheading}
                </p>
                <p className="mt-6 max-w-xl text-[16px] leading-relaxed tracking-[-0.012em] text-text-secondary">
                  {phase.description}
                </p>
                <div className="mt-10">
                  <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                    What you get
                  </p>
                  <ul className="mt-5 space-y-3 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                    {phase.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(204,120,92)]/80" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {phase.visual}
            </div>
          </section>
        ))}
      </div>

      <section className="border-b border-border px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1344px]">
          <motion.div {...fadeUp}>
            <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Representative Examples
            </p>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-primary">
              What we build
            </h2>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
              Three categories where AI changes the math.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="mt-12 grid gap-4 md:grid-cols-3"
          >
            {useCases.map((useCase) => (
              <motion.article
                key={useCase.title}
                variants={{
                  hidden: { opacity: 0, y: 22 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="flex min-h-[240px] flex-col justify-end rounded-2xl border border-dashed border-white/15 bg-bg-card-alt/35 p-6"
              >
                <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-text-primary">
                  {useCase.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
                  {useCase.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
        <motion.div {...fadeUp} className="mx-auto max-w-[1344px]">
          <h2 className="mx-auto max-w-3xl text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-primary">
            Ready to see this work in your operations?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
            One workflow. One working system. See what AI can actually do for
            your team.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[rgb(204,120,92)] px-5 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-[rgb(224,139,110)]"
            >
              Start with a Pilot
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 rounded-full border border-border-solid px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary"
            >
              View FAQ
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

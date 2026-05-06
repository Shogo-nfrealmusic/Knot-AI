"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const faqSections = [
  {
    id: "engagement",
    label: "Engagement",
    items: [
      {
        question: "We're early in our AI journey. Is it too soon for Knot?",
        answer:
          "No — early is the right time. The Pilot Build is designed for teams that haven't shipped production AI yet. We pick one workflow, build a working system in a few weeks, and let the results decide what comes next. You don't need a strategy first.",
      },
      {
        question: "How do we know if a workflow is a good Pilot candidate?",
        answer:
          "The best Pilots are workflows that are repetitive, knowledge-heavy, and run multiple times per day. Inquiry routing, document review, expense categorization, and triage processes typically work well. Workflows that require deep human judgment on every instance are less fit.",
      },
      {
        question: "How long is a typical engagement?",
        answer:
          "A Pilot Build runs 2–4 weeks. Full AI Implementation engagements typically run 1–3 months per workflow. Monthly AI-Native Operations partnerships are ongoing — most clients stay 12+ months as new workflows get added each quarter.",
      },
    ],
  },
  {
    id: "implementation",
    label: "Implementation",
    items: [
      {
        question: "Do you only advise, or do you also build?",
        answer:
          "We build. Knot is engineering-led — our team writes production code and ships working systems. We don't write recommendations decks. Every engagement results in a deployed system your team uses every day.",
      },
      {
        question: "What does Knot actually deliver?",
        answer:
          "A production AI system integrated into your existing tools (Slack, Gmail, Sheets, Notion, etc.), operating documentation explaining ownership and failure modes, and a handoff so your team can run and refine the system after launch.",
      },
      {
        question: "How does Knot integrate with our existing tools?",
        answer:
          "The AI lives inside the tools your team already uses. We don't introduce new dashboards or interfaces. If your team works in Slack and Gmail, that's where the AI runs. Common integrations include Google Workspace, Microsoft 365, Slack, Notion, Salesforce, and HubSpot.",
      },
    ],
  },
  {
    id: "pricing-roi",
    label: "Pricing & ROI",
    items: [
      {
        question: "How do you price your work?",
        answer:
          "Pilot Builds are fixed-price engagements. Full Implementation is scoped per project. Monthly partnerships are flat retainers. We share concrete pricing once we understand the workflow scope on the intro call.",
      },
      {
        question: "How do you measure success?",
        answer:
          "Three layers: (1) the system works — measured by accuracy and reliability of automated decisions, (2) it's used — measured by adoption among your team, and (3) it compounds — measured by hours saved, errors reduced, and capacity created over time.",
      },
      {
        question: "What's the ROI timeline?",
        answer:
          "Most Pilots show measurable time savings within 30 days of launch. Full implementations typically pay back within 3–6 months. The compounding value comes from the monthly partnership — each new workflow builds on the last.",
      },
    ],
  },
  {
    id: "tech-security",
    label: "Tech & Security",
    items: [
      {
        question: "What AI models do you use?",
        answer:
          "We primarily build on Anthropic's Claude. For specific use cases, we evaluate other models. The choice is always driven by what produces the most reliable results for your workflow.",
      },
      {
        question: "What about data privacy and security?",
        answer:
          "Your data stays in your environment. We architect systems to use your existing data agreements with Anthropic, OpenAI, or Google. We don't store, train on, or share your operational data. We sign DPAs and NDAs as part of any engagement.",
      },
      {
        question: "What if our team isn't technical?",
        answer:
          "That's typical, and it's fine. We build systems that operate inside the tools your team already uses — no new interfaces to learn. Operating documentation is written for non-engineers. Most users interact with the AI the same way they interact with a colleague.",
      },
      {
        question: "What if Anthropic changes Claude or the underlying model format?",
        answer:
          "The systems we build are designed to be portable. We use abstractions that let us swap underlying models without rebuilding the workflow. If Claude changes, we update — that's part of the monthly partnership.",
      },
      {
        question: "Do you sign NDAs?",
        answer:
          "Yes. We sign mutual NDAs before any detailed workflow conversation. We sign DPAs as part of any production engagement.",
      },
    ],
  },
];

function FaqHero() {
  return (
    <section className="border-b border-white/10 px-4 pb-16 pt-36 sm:px-6 lg:px-8 lg:pb-20">
      <div className="mx-auto grid max-w-[1344px] gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div>
          <div className="mb-7 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary">
              AI Ops FAQ
            </span>
            <span className="rounded-full border border-[#ff6b4a]/25 bg-[#ff6b4a]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ff9a7c]">
              Updated for pilots
            </span>
          </div>
          <h1 className="max-w-4xl text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-text-primary">
            Answers before we get in the room.
          </h1>
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed tracking-[-0.014em] text-text-secondary">
            Clear guidance on engagement shape, implementation, ROI, and security,
            organized for teams deciding whether a Pilot Build is worth starting.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#0d0e10] p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/35">
              FAQ index
            </p>
            <span className="h-2 w-2 rounded-full bg-[#5dcaa5]" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="font-mono text-[28px] leading-none tracking-[-0.05em] text-text-primary">
                {faqSections.reduce((count, section) => count + section.items.length, 0)}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">
                answers
              </p>
            </div>
            <div>
              <p className="font-mono text-[28px] leading-none tracking-[-0.05em] text-text-primary">
                {faqSections.length}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">
                categories
              </p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.025] p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/35">
              Typical path
            </p>
            <p className="mt-3 text-[14px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              30-minute call, one workflow, then a scoped Pilot Build.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryNav({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}) {
  return (
    <div className="-mx-4 border-y border-white/10 bg-[#0a0a0a] px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <nav
        className="mx-auto grid max-w-[1344px] gap-2 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="FAQ categories"
      >
        {faqSections.map((section) => {
          const isActive = activeCategory === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveCategory(section.id)}
              className={`group relative min-h-12 overflow-hidden rounded-lg border px-4 py-3 text-left font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                isActive
                  ? "border-[#ff6b4a]/45 bg-[#ff6b4a]/10 text-text-primary"
                  : "border-white/10 bg-white/[0.02] text-text-muted hover:border-white/20 hover:text-text-secondary"
              }`}
              aria-pressed={isActive}
            >
              <span
                className={`absolute inset-y-2 left-0 w-px bg-[#ff6b4a] transition-opacity duration-150 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                }`}
              />
              <span className="relative z-10 block">{section.label}</span>
              <span className="relative z-10 mt-1 block text-[10px] font-normal tracking-[0.05em] text-white/35">
                {section.items.length} answers
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        className="group flex w-full items-start justify-between gap-6 px-5 py-6 text-left transition-colors duration-150 hover:bg-white/[0.035] sm:px-6"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="text-[17px] font-medium leading-snug tracking-[-0.014em] text-[#d0d6e0] transition-colors duration-150 group-hover:text-text-primary">
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lg leading-none text-[#ff6b4a]"
          aria-hidden="true"
        >
          {isOpen ? "×" : "+"}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-7 text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary sm:px-4">
              {answer}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FaqSection({
  section,
}: {
  section: (typeof faqSections)[number];
}) {
  return (
    <motion.section
      id={section.id}
      key={section.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-[#ff6b4a]">
            {section.label}
          </p>
          <h2 className="mt-3 max-w-3xl text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-text-primary">
            Direct answers before the first call.
          </h2>
        </div>
        <p className="max-w-sm text-[14px] leading-relaxed tracking-[-0.01em] text-text-secondary">
          Built for teams comparing implementation partners, scope, ROI, and risk.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0e10] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        {section.items.map((item) => (
          <FaqItem
            key={item.question}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </motion.section>
  );
}

function FaqOverview({ activeCategory }: { activeCategory: string }) {
  const activeSection = faqSections.find((section) => section.id === activeCategory);

  return (
    <div className="mx-auto grid max-w-[1344px] gap-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)]">
      <div className="rounded-xl border border-white/10 bg-[#0d0e10] p-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
          Current filter
        </p>
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-none tracking-[-0.05em] text-text-primary">
              {activeSection?.label}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
              Switch categories without jumping around the page. The selected answers stay in one stable panel.
            </p>
          </div>
          <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-[#ff6b4a]">
            {String(activeSection?.items.length ?? 0).padStart(2, "0")} answers
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
            Response time
          </p>
          <p className="mt-5 font-mono text-[28px] tracking-[-0.04em] text-text-primary">
            24h
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
            First step
          </p>
          <p className="mt-5 font-mono text-[28px] tracking-[-0.04em] text-text-primary">
            Pilot
          </p>
        </div>
      </div>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="border-t border-border px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px]">
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.022em] text-text-primary">
          Still have questions?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed tracking-[-0.01em] text-text-secondary">
          The best way to get specific answers is a Pilot conversation. 30
          minutes, no slides.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-text-primary px-5 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-white/90"
          >
            Start with a Pilot
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-border-solid px-5 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:border-white/20 hover:text-text-primary"
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function FaqContent() {
  const [activeCategory, setActiveCategory] = useState(faqSections[0].id);
  const activeSection =
    faqSections.find((section) => section.id === activeCategory) ?? faqSections[0];

  return (
    <>
      <FaqHero />

      <section className="px-4 sm:px-6 lg:px-8">
        <CategoryNav
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />

        <FaqOverview activeCategory={activeCategory} />

        <div className="mx-auto max-w-[1344px] pb-20 pt-2">
          <AnimatePresence mode="wait">
            <FaqSection section={activeSection} />
          </AnimatePresence>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

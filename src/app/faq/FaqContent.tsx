"use client";

import { useEffect, useRef, useState } from "react";
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

function CategoryNav({
  activeCategory,
}: {
  activeCategory: string;
}) {
  return (
    <div className="sticky top-20 z-30 -mx-4 border-y border-border bg-bg-primary/90 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <nav
        className="mx-auto flex max-w-[1344px] gap-2 overflow-x-auto"
        aria-label="FAQ categories"
      >
        {faqSections.map((section) => {
          const isActive = activeCategory === section.id;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`relative shrink-0 rounded-full border px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
                isActive
                  ? "border-[#ff6b4a]/35 bg-[#ff6b4a]/10 text-text-primary"
                  : "border-border text-text-muted hover:border-white/15 hover:text-text-secondary"
              }`}
            >
              {section.label}
              <span
                className={`absolute inset-x-3 -bottom-px h-px bg-[#ff6b4a] transition-opacity duration-150 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </a>
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
    <div className="border-b border-border">
      <button
        type="button"
        className="group flex w-full items-start justify-between gap-6 px-0 py-6 text-left transition-colors duration-150 hover:bg-white/2 sm:px-4"
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
  setSectionRef,
}: {
  section: (typeof faqSections)[number];
  setSectionRef: (id: string, node: HTMLElement | null) => void;
}) {
  return (
    <motion.section
      id={section.id}
      ref={(node) => setSectionRef(section.id, node)}
      className="scroll-mt-36"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <h2 className="mb-5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-text-muted">
        {section.label}
      </h2>
      <div className="rounded-2xl border border-border bg-bg-card-alt/35">
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
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const setSectionRef = (id: string, node: HTMLElement | null) => {
    sectionRefs.current[id] = node;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveCategory(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -50% 0px",
        threshold: 0,
      },
    );

    Object.values(sectionRefs.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8">
        <CategoryNav activeCategory={activeCategory} />

        <div className="mx-auto grid max-w-[1344px] gap-16 py-16 md:py-20">
          {faqSections.map((section) => (
            <FaqSection
              key={section.id}
              section={section}
              setSectionRef={setSectionRef}
            />
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}

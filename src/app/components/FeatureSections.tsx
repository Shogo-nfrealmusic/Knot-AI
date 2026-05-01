interface FeatureSectionProps {
  title: string;
  description: string;
  highlights: { title: string; description: string }[];
  reverse?: boolean;
}

function FeatureSection({
  title,
  description,
  highlights,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 ${
            reverse ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* Text content */}
          <div
            className={`min-w-0 space-y-6 sm:space-y-8 ${reverse ? "lg:col-start-2" : ""}`}
          >
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary whitespace-pre-line break-words">
              {title}
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em] max-w-lg break-words">
              {description}
            </p>
          </div>

          {/* Visual / Highlights */}
          <div
            className={`min-w-0 space-y-4 sm:space-y-6 ${reverse ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="border border-border rounded-lg p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
              >
                <h3 className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-2">
                  {highlight.title}
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const sections: FeatureSectionProps[] = [
  {
    title: "For mid-sized companies ready to operationalize AI",
    description:
      "Knot is an AI operations consultancy. We help teams embed working AI systems directly into day-to-day operations, where the work actually happens.",
    highlights: [
      {
        title: "AI Operations Assessment",
        description:
          "We map repetitive and knowledge-heavy workflows, identify leverage, and deliver a prioritized roadmap.",
      },
      {
        title: "Skills Implementation",
        description:
          "We design and build custom Claude Code Skills and AI agents your team can use every day.",
      },
      {
        title: "Monthly AI Advisory",
        description:
          "We continuously improve your systems as your business, tools, and operating model evolve.",
      },
    ],
  },
  {
    title: "We ship working systems",
    description:
      "Our team is led by engineers who write production code, not consultants who write recommendations.",
    highlights: [
      {
        title: "Production-first implementation",
        description:
          "Each engagement is scoped around real workflows, real users, and systems that can run after launch.",
      },
      {
        title: "Claude Code Skills and agents",
        description:
          "We build specialized capabilities that live inside the tools and routines your team already uses.",
      },
      {
        title: "Operational handoff",
        description:
          "We document ownership, review points, and failure modes so systems can be trusted in practice.",
      },
    ],
    reverse: true,
  },
  {
    title: "We redesign before we automate",
    description:
      "Process design comes first. AI is the implementation layer, not the goal.",
    highlights: [
      {
        title: "Workflow clarity",
        description:
          "We separate high-value judgment from repeatable execution before deciding what to automate.",
      },
      {
        title: "Team adoption",
        description:
          "The system must fit the way people already coordinate, approve, and measure the work.",
      },
      {
        title: "Measured rollout",
        description:
          "We start with a narrow operating loop, prove value, and expand from there.",
      },
    ],
  },
  {
    title: "We stay with you",
    description:
      "Our monthly model means your AI systems improve every month, not just at kickoff.",
    highlights: [
      {
        title: "Continuous refinement",
        description:
          "We tune prompts, workflows, integrations, and evaluation criteria as usage data comes in.",
      },
      {
        title: "New Skills as needs change",
        description:
          "As your business evolves, we build new capabilities that extend the operating system.",
      },
      {
        title: "Embedded AI operations resource",
        description:
          "Your team gets a partner who understands the systems, the process, and the business context.",
      },
    ],
    reverse: true,
  },
];

export default function FeatureSections() {
  return (
    <>
      {sections.map((section) => (
        <FeatureSection key={section.title} {...section} />
      ))}
    </>
  );
}

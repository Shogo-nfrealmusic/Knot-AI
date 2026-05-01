import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "Services | Knot",
  description:
    "AI Operations Assessment, Skills Implementation, and Monthly AI Advisory for mid-sized companies ready to embed AI into daily operations.",
};

/* ─── Hero ─────────────────────────────────────────────── */
function ServicesHero() {
  return (
    <section className="pt-[200px] pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase tracking-widest mb-6 block">
          Services
        </span>
        <div className="mb-8">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.022em] text-text-primary">
            AI systems for
            <br />
            real business workflows.
          </h1>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <p className="min-w-0 flex-1 text-[15px] text-text-secondary tracking-[-0.01em] leading-relaxed max-w-2xl">
            We assess, design, build, and improve AI Skills and agents that
            become part of how your team works every day.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:max-w-[min(100%,22rem)] lg:justify-end lg:shrink-0">
            <div className="w-4 h-4 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-[3px] bg-accent" />
            </div>
            <span className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
              Built with engineering depth
            </span>
            <Link
              href="/contact"
              className="text-[15px] text-text-secondary tracking-[-0.01em] whitespace-nowrap hover:text-text-primary transition-colors"
            >
              Book a free assessment <span className="text-text-muted">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Service overview cards ────────────────────────────── */
const serviceCards = [
  {
    index: "01",
    title: "AI Operations Assessment",
    description:
      "A focused two-to-four week engagement. We map repetitive and knowledge-heavy workflows, identify automation opportunities, and deliver a prioritized roadmap.",
    tags: ["Workflow mapping", "Opportunity scoring", "Roadmap", "Risk review", "Operating model"],
    visual: (
      <div className="w-full space-y-2 font-mono text-[11px]">
        {[
          { label: "Intake received", status: "done", indent: 0 },
          { label: "Workflow mapped", status: "done", indent: 1 },
          { label: "Owner notified", status: "done", indent: 1 },
          { label: "Skill draft generated", status: "running", indent: 1 },
          { label: "Human review", status: "pending", indent: 0 },
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-2"
            style={{ paddingLeft: step.indent * 16 }}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                step.status === "done"
                  ? "bg-accent/60"
                  : step.status === "running"
                  ? "bg-accent animate-pulse"
                  : "bg-white/10"
              }`}
            />
            <span
              className={
                step.status === "pending"
                  ? "text-text-muted"
                  : "text-text-secondary"
              }
            >
              {step.label}
            </span>
            {step.status === "running" && (
              <span className="text-accent/60 text-[10px]">Running</span>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    index: "02",
    title: "Skills Implementation",
    description:
      "We design and build custom Claude Code Skills and AI agents tailored to your workflows. Typical engagements run one to three months.",
    tags: ["Claude Code Skills", "AI agents", "Integrations", "Production rollout", "Enablement"],
    visual: (
      <div className="w-full space-y-1.5">
        <div className="h-6 rounded-md bg-white/[0.04] border border-border flex items-center px-2 gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="h-1.5 w-16 rounded-full bg-white/10" />
          <div className="h-1.5 flex-1 rounded-full bg-white/5 ml-auto max-w-[60px]" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="col-span-2 h-16 rounded-md bg-white/[0.03] border border-border flex flex-col justify-end p-2 gap-1">
            <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
            <div className="h-1 w-1/2 rounded-full bg-white/8" />
          </div>
          <div className="col-span-1 h-16 rounded-md bg-white/[0.02] border border-border" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-md bg-white/[0.02] border border-border flex flex-col justify-end p-1.5 gap-1">
              <div className="h-1 w-2/3 rounded-full bg-white/10" />
              <div className="h-1 w-1/2 rounded-full bg-white/6" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    index: "03",
    title: "Monthly AI Advisory",
    description:
      "An ongoing partnership. We refine AI systems, build new Skills as your business evolves, and serve as your embedded AI operations resource.",
    tags: ["Monthly support", "System tuning", "New Skills", "Governance", "Adoption"],
    visual: (
      <div className="w-full space-y-1.5">
        <div className="grid grid-cols-4 gap-1 mb-2">
          {["Map", "Build", "Review", "Ship"].map((label, i) => (
            <div
              key={label}
              className={`h-5 rounded text-[9px] flex items-center justify-center font-mono ${
                i === 0
                  ? "bg-accent/20 border border-accent/30 text-accent"
                  : "bg-white/[0.03] border border-border text-text-muted"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="rounded-md border border-border bg-white/[0.02] p-2 space-y-1.5">
          <div className="h-3 w-1/2 rounded bg-white/10" />
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
            <div className="h-1.5 w-5/6 rounded-full bg-white/[0.06]" />
            <div className="h-1.5 w-4/6 rounded-full bg-white/[0.04]" />
          </div>
          <div className="grid grid-cols-2 gap-1 pt-1">
            <div className="h-6 rounded bg-accent/15 border border-accent/20 flex items-center justify-center">
              <div className="h-1.5 w-8 rounded-full bg-accent/40" />
            </div>
            <div className="h-6 rounded bg-white/[0.03] border border-border flex items-center justify-center">
              <div className="h-1.5 w-8 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

function ServiceOverview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border">
          {serviceCards.map((card, i) => (
            <div
              key={card.index}
              className={`pt-10 pb-8 flex flex-col gap-6 ${
                i < serviceCards.length - 1
                  ? "md:pr-8 md:border-r md:border-border"
                  : ""
              } ${i > 0 ? "md:pl-8" : ""}`}
            >
              {/* Visual mockup */}
              <div className="rounded-xl border border-border bg-bg-card p-4 min-h-[160px] flex items-center">
                {card.visual}
              </div>

              {/* Text */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase">
                    {card.index}
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
                  {card.title}
                </h2>
                <p className="text-[14px] text-text-secondary leading-relaxed tracking-[-0.01em]">
                  {card.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-border-solid text-text-muted font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* AI Operations Assessment details */
function AiSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text */}
          <div className="space-y-8">
            <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block">
              Service 01
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
              AI Operations Assessment
              <br />
              <span className="text-text-secondary">
                Map where AI can create leverage.
              </span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em]">
              We start with the work itself. In two to four weeks, we map your
              team&apos;s repetitive and knowledge-heavy workflows, identify the
              best automation opportunities, and sequence the implementation.
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "Workflow mapping",
                  detail:
                    "Document how work moves across teams, tools, approvals, and exceptions.",
                },
                {
                  title: "Opportunity scoring",
                  detail:
                    "Prioritize use cases by volume, risk, business value, and implementation effort.",
                },
                {
                  title: "Implementation roadmap",
                  detail:
                    "Define the first systems to build, the owners involved, and the metrics to track.",
                },
                {
                  title: "Operating guardrails",
                  detail:
                    "Clarify what AI can do independently and where human review remains required.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                >
                  <p className="text-[14px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-1">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: mini workflow */}
          <div className="lg:sticky lg:top-24 space-y-3">
            <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-[12px] font-semibold text-[#d0d6e0]">
                  Assessment flow
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  inquiry_router.yaml
                </span>
              </div>
              <div className="p-4 space-y-1 font-mono text-[12px]">
                {[
                  { depth: 0, text: "on: form_submit", color: "text-accent/70" },
                  { depth: 1, text: "classify:", color: "text-text-secondary" },
                  { depth: 2, text: 'model: "gpt-4o-mini"', color: "text-text-muted" },
                  { depth: 2, text: "labels: [new, estimate, support]", color: "text-text-muted" },
                  { depth: 1, text: "notify:", color: "text-text-secondary" },
                  { depth: 2, text: "channel: slack #inquiries", color: "text-text-muted" },
                  { depth: 1, text: "draft_reply:", color: "text-text-secondary" },
                  { depth: 2, text: "template: reply.md", color: "text-text-muted" },
                  { depth: 2, text: "review_required: true", color: "text-accent/50" },
                ].map((line, i) => (
                  <div
                    key={i}
                    className={`${line.color}`}
                    style={{ paddingLeft: line.depth * 16 }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Intake", count: "145", sub: "This month" },
                { label: "Automated", count: "92%", sub: "Resolved" },
                { label: "Review", count: "8%", sub: "Needs review" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-bg-card p-3 text-center"
                >
                  <p className="text-[18px] font-semibold text-[#d0d6e0] tracking-tight">
                    {stat.count}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">{stat.sub}</p>
                  <p className="text-[11px] font-mono text-text-secondary/40 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-bg-elevated p-4 space-y-3">
              <p className="text-[12px] font-semibold text-text-secondary uppercase font-mono tracking-wider">
                Common integrations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Gmail", "Notion", "Slack", "Google Sheets",
                  "LINE Official", "Chatwork", "Make", "Zapier",
                ].map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-border-solid text-text-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Skills Implementation details */
function WebSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start lg:grid-flow-dense">
          {/* Text (right on desktop) */}
          <div className="space-y-8 lg:col-start-2">
            <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block">
              Service 02
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
              Skills Implementation
              <br />
              <span className="text-text-secondary">
                Build systems your team uses.
              </span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em]">
              We design and build custom Claude Code Skills and AI agents
              tailored to your workflows. Engagements typically run one to
              three months and end with production-ready systems.
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "Custom Claude Code Skills",
                  detail:
                    "Reusable Skills that encode your process, standards, and decision patterns.",
                },
                {
                  title: "AI agents for operating loops",
                  detail:
                    "Agents that route work, draft outputs, reconcile information, and trigger follow-up.",
                },
                {
                  title: "Workflow integrations",
                  detail:
                    "Connections to the tools where work already lives: Slack, Notion, Sheets, CRMs, and internal systems.",
                },
                {
                  title: "Launch and enablement",
                  detail:
                    "Rollout support, documentation, and review rituals so the system becomes part of daily work.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                >
                  <p className="text-[14px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-1">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual (left on desktop) */}
          <div className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-24 space-y-2">
            {/* LP mockup */}
            <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="flex-1 mx-2 h-4 rounded bg-white/[0.04] border border-border text-[9px] flex items-center px-2 text-text-muted font-mono">
                  knot.ai/skills
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Hero area */}
                <div className="rounded-lg bg-white/[0.02] border border-border p-3 space-y-2">
                  <div className="h-4 w-2/3 rounded-md bg-white/15" />
                  <div className="h-2.5 w-5/6 rounded-full bg-white/8" />
                  <div className="h-2 w-4/6 rounded-full bg-white/6" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-6 w-16 rounded-full bg-accent/30 border border-accent/20" />
                    <div className="h-6 w-20 rounded-full bg-white/[0.04] border border-border" />
                  </div>
                </div>
                {/* Feature cards */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-md bg-white/[0.02] border border-border p-2 space-y-1">
                      <div className="w-4 h-4 rounded bg-white/8" />
                      <div className="h-1.5 w-full rounded-full bg-white/10" />
                      <div className="h-1 w-3/4 rounded-full bg-white/6" />
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div className="rounded-md bg-accent/10 border border-accent/15 p-2 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-2 w-24 rounded-full bg-white/15" />
                    <div className="h-1.5 w-20 rounded-full bg-white/8" />
                  </div>
                  <div className="h-6 w-14 rounded-full bg-accent/40 border border-accent/20" />
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="rounded-xl border border-border bg-bg-elevated p-4 space-y-3">
              <p className="text-[12px] font-semibold text-text-secondary uppercase font-mono tracking-wider">
                Typical stack
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[12px]">
                {[
                  ["Claude Code", "Skills"],
                  ["OpenAI / Anthropic", "Models"],
                  ["Slack / Notion", "Workflow"],
                  ["Next.js / React", "Interfaces"],
                  ["Vercel / Cloud", "Hosting"],
                  ["Postgres", "Data"],
                ].map(([name, cat]) => (
                  <div key={name} className="flex items-center gap-2 rounded-md border border-border p-2 bg-white/[0.01]">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
                    <div>
                      <p className="text-[12px] text-[#d0d6e0] font-medium leading-none">{name}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{cat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Monthly AI Advisory details */
function UiSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text */}
          <div className="space-y-8">
            <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block">
              Service 03
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
              Monthly AI Advisory
              <br />
              <span className="text-text-secondary">
                Keep improving after launch.
              </span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em]">
              AI systems need operating attention. We stay with your team to
              tune existing systems, build new Skills, and keep the AI layer
              aligned with how the business changes.
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "System refinement",
                  detail:
                    "Improve prompts, workflows, integrations, and evaluation criteria as usage grows.",
                },
                {
                  title: "New Skills each month",
                  detail:
                    "Add capabilities as teams discover new bottlenecks and higher-value operating loops.",
                },
                {
                  title: "Governance and adoption",
                  detail:
                    "Set review points, permissions, documentation, and adoption practices that keep AI useful.",
                },
                {
                  title: "Embedded AI operations partner",
                  detail:
                    "Give your team a dedicated resource who understands both the code and the process.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                >
                  <p className="text-[14px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-1">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: Figma-style wireframe mock */}
          <div className="lg:sticky lg:top-24 space-y-2">
            <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
              {/* Figma-style header */}
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm border border-accent/60" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#d0d6e0]">
                    Figma
                  </span>
                  <span className="text-[11px] text-text-muted">
                    / advisory workspace
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {["Plan", "Review", "Ship"].map((label, i) => (
                    <button
                      key={label}
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        i === 0
                          ? "bg-accent/20 text-accent"
                          : "text-text-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas area */}
              <div className="p-4 bg-white/[0.005]">
                <div className="rounded-lg border border-border bg-bg-card p-3 space-y-2">
                  {/* Nav */}
                  <div className="flex items-center justify-between h-7 border-b border-border pb-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-white/15" />
                      <div className="h-1.5 w-10 rounded-full bg-white/20" />
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1.5 w-8 rounded-full bg-white/10" />
                      ))}
                    </div>
                  </div>
                  {/* Hero */}
                  <div className="py-4 space-y-2 text-center flex flex-col items-center">
                    <div className="h-3 w-1/2 rounded bg-white/20" />
                    <div className="h-2 w-2/3 rounded-full bg-white/10" />
                    <div className="h-2 w-1/2 rounded-full bg-white/8" />
                    <div className="mt-1 flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-accent/30" />
                      <div className="h-6 w-16 rounded-full bg-white/8 border border-border" />
                    </div>
                  </div>
                  {/* Cards row */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded border border-border p-2 space-y-1 bg-white/[0.01]">
                        <div className="h-6 rounded bg-white/[0.04]" />
                        <div className="h-1.5 w-full rounded-full bg-white/10" />
                        <div className="h-1 w-3/4 rounded-full bg-white/6" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment overlay */}
              <div className="border-t border-border px-3 py-2 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[8px] text-accent font-bold">
                  K
                </div>
                <p className="text-[11px] text-text-secondary">
                  Can we shorten the review step and keep risk controls?
                </p>
                <span className="text-[10px] text-text-muted ml-auto whitespace-nowrap">
                  2 min ago
                </span>
              </div>
            </div>

            {/* Deliverables list */}
            <div className="rounded-xl border border-border bg-bg-elevated p-4 space-y-3">
              <p className="text-[12px] font-semibold text-text-secondary uppercase font-mono tracking-wider">
                Example outputs
              </p>
              <div className="space-y-1.5">
                {[
                  ["Monthly roadmap", "Prioritized Skills and workflow improvements"],
                  ["Usage review", "Metrics, blockers, and adoption notes"],
                  ["System updates", "Prompt, integration, and agent refinements"],
                  ["Team enablement", "Documentation and review practices"],
                ].map(([name, desc]) => (
                  <div key={name} className="flex gap-2 items-start text-[12px]">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                    <div>
                      <span className="text-[#d0d6e0] font-medium">{name}</span>
                      <span className="text-text-muted"> - {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* How it works */
const steps = [
  {
    num: "01",
    title: "Assess the work",
    description:
      "We map current workflows, bottlenecks, tools, decision points, and risks.",
  },
  {
    num: "02",
    title: "Prioritize leverage",
    description:
      "We identify the AI systems most likely to reduce manual effort and improve throughput.",
  },
  {
    num: "03",
    title: "Build the system",
    description:
      "We implement Skills, agents, integrations, and operating documentation with your team.",
  },
  {
    num: "04",
    title: "Improve monthly",
    description:
      "We tune the systems, add new capabilities, and keep the AI layer aligned with the business.",
  },
];

function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="mb-12">
          <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block mb-4">
            How it works
          </span>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
            See how it works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`py-8 flex flex-col gap-4 ${
                i < steps.length - 1
                  ? "lg:pr-8 lg:border-r lg:border-border"
                  : ""
              } ${i > 0 ? "lg:pl-8" : ""} ${
                i > 0 && i < 2 ? "sm:pl-8 sm:border-l sm:border-border" : ""
              }`}
            >
              <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase">
                {step.num}
              </span>
              <div className="w-8 h-px bg-border-solid" />
              <h3 className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed tracking-[-0.01em]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <SitePageLayout>
      <ServicesHero />
      <ServiceOverview />
      <AiSection />
      <WebSection />
      <UiSection />
      <HowItWorks />
      <CTA />
    </SitePageLayout>
  );
}

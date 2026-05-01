import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "Who We Serve | Knot",
  description:
    "Knot serves mid-sized companies in finance, legal, operations, customer support, and back-office functions.",
};

const rows = [
  {
    meta: "Finance / Operations",
    version: "v2026.04",
    title: "Finance and operations teams",
    text:
      "Teams with documented review, reporting, reconciliation, or approval workflows that still depend on manual coordination.",
  },
  {
    meta: "Legal / Compliance",
    version: "v2026.03",
    title: "Legal and compliance functions",
    text:
      "Groups that need consistent intake, drafting, review, and knowledge retrieval without losing human oversight.",
  },
  {
    meta: "Support / Back office",
    version: "v2026.02",
    title: "Customer support and back-office teams",
    text:
      "Teams where repeated requests, handoffs, and internal knowledge searches slow down service quality.",
  },
];

export default function AreasPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="Who we serve"
        description="Mid-sized companies, typically 200 to 2,000 employees, where documented workflows are bottlenecked by manual effort."
      />
      <ContentSection>
        <div className="space-y-6">
          {rows.map((row) => (
            <article
              key={row.title}
              className="flex flex-col gap-3 border border-border rounded-xl p-6 sm:p-8 bg-white/2 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
            >
              <div className="shrink-0">
                <p className="font-mono text-[11px] text-text-muted tabular-nums mb-1">
                  {row.version}
                </p>
                <p className="text-[12px] text-text-secondary">{row.meta}</p>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[16px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-2">
                  {row.title}
                </h2>
                <p className="text-[15px] text-text-secondary leading-relaxed">
                  {row.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}

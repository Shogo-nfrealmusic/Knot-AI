import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "Engagements | Knot",
  description:
    "Engagement models for AI Operations Assessment, Skills Implementation, and Monthly AI Advisory.",
};

export default function PricingPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="Engagements"
        description="Start with a focused assessment, then build and improve the systems that create the most operating leverage."
      />
      <ContentSection>
        <ul className="space-y-4 text-[15px] text-text-secondary leading-relaxed max-w-2xl">
          <li className="flex gap-3">
            <span className="text-accent shrink-0">-</span>
            <span>
              <strong className="text-text-primary font-medium">Assessment</strong>
              : a two-to-four week engagement to map workflows and prioritize implementation.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent shrink-0">-</span>
            <span>
              <strong className="text-text-primary font-medium">Implementation</strong>
              : one to three months to build production-ready Skills and agents.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent shrink-0">-</span>
            <span>
              <strong className="text-text-primary font-medium">Advisory</strong>
              : a monthly partnership to refine systems and build new capabilities.
            </span>
          </li>
        </ul>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}

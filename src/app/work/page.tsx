import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "How it Works | Knot",
  description:
    "How Knot moves from AI operations assessment to production systems and monthly improvement.",
};

export default function WorkPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="How it works"
        description="We map the work, prioritize leverage, build the first systems, and keep improving them month by month."
      />
      <ContentSection>
        <div className="rounded-xl border border-dashed border-border border-white/15 bg-bg-card/50 p-10 text-center">
          <p className="text-[15px] text-text-secondary leading-relaxed max-w-lg mx-auto">
            Case studies are being prepared. For now, book a free assessment
            and we can discuss examples closest to your industry and workflow.
          </p>
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}

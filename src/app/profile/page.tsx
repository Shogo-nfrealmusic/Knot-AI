import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import ContentSection from "@/app/components/ContentSection";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "About | Knot",
  description:
    "Knot is an AI operations consultancy helping mid-sized companies embed working AI systems into day-to-day operations.",
};

export default function ProfilePage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="About Knot"
        description="Knot helps mid-sized companies move beyond AI experimentation and embed working AI systems directly into day-to-day operations."
      />
      <ContentSection>
        <div className="max-w-2xl space-y-6 text-[15px] text-text-secondary leading-relaxed">
          <p>
            We combine engineering depth with business process design, so the
            AI we ship actually changes how work gets done.
          </p>
          <p>
            Our work is built for companies with documented workflows where
            execution is still bottlenecked by manual effort.
          </p>
        </div>
      </ContentSection>
      <CTA />
    </SitePageLayout>
  );
}

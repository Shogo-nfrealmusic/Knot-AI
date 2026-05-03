import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import FaqContent from "./FaqContent";

export const metadata: Metadata = {
  title: "FAQ | Knot",
  description:
    "Real questions from real conversations about Knot's AI operations engagements, implementation, pricing, ROI, and security.",
};

export default function FaqPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="FAQ"
        description="Real questions from real conversations."
      />
      <FaqContent />
    </SitePageLayout>
  );
}

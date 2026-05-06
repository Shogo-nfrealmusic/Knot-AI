import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import HowItWorksContent from "./HowItWorksContent";

export const metadata: Metadata = {
  title: "How it works | Knot",
  description:
    "From your first conversation to AI that runs your operations.",
};

export default function HowItWorksPage() {
  return (
    <SitePageLayout>
      <HowItWorksContent />
    </SitePageLayout>
  );
}

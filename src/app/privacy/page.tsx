import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import PrivacyArticle from "./PrivacyArticle";

export const metadata: Metadata = {
  title: "Privacy Policy | Knot",
  description: "How Knot handles your information.",
};

export default function PrivacyPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="Privacy Policy"
        description="How we handle your information."
      />
      <PrivacyArticle />
    </SitePageLayout>
  );
}

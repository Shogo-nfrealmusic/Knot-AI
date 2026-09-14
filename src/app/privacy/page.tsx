import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import PrivacyArticle from "./PrivacyArticle";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Shogo Kikuchi handles personal information submitted through this site.",
};

export default function PrivacyPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="Privacy Policy"
        description="How I handle your information."
      />
      <PrivacyArticle />
    </SitePageLayout>
  );
}

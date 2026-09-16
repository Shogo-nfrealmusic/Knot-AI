import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import PrivacyArticle from "./PrivacyArticle";

const title = "Privacy Policy | Shogo Kikuchi";
const description =
  "How Shogo Kikuchi handles personal information submitted through this site.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  openGraph: { title, description, url: "/privacy", type: "website" },
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

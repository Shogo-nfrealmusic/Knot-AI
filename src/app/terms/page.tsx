import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import TermsArticle from "./TermsArticle";

export const metadata: Metadata = {
  title: "Terms of Service | Knot",
  description: "The rules for using the Knot site.",
};

export default function TermsPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="Terms of Service"
        description="The rules for using our site."
      />
      <TermsArticle />
    </SitePageLayout>
  );
}

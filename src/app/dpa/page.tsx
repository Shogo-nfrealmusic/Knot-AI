import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import InnerHero from "@/app/components/InnerHero";
import DpaArticle from "./DpaArticle";

export const metadata: Metadata = {
  title: "Data Processing Agreement | Knot",
  description: "How Knot handles data on behalf of clients.",
};

export default function DpaPage() {
  return (
    <SitePageLayout>
      <InnerHero
        title="Data Processing Agreement"
        description="How we handle data on behalf of clients."
      />
      <DpaArticle />
    </SitePageLayout>
  );
}

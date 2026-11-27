import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GuideIndex } from "./GuideIndex";
import { GUIDE_CSS } from "./style";

// For buyers of Copilot OS only: not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Copilot OS guide | Shogo Kikuchi",
  description: "Nine modules, from installing Claude Code to running your work on it.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function GuidePage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <GuideIndex />
    </SitePageLayout>
  );
}

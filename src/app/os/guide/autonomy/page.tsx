import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { View } from "./Figures";

// For buyers of Copilot OS only: gated, not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Module 5 · Autonomy without drift | Copilot OS guide",
  description: "Letting Claude work while you're not watching: schedulers, parallel sessions, headless runs, loops and what they cost.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function AutonomyPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <View />
    </SitePageLayout>
  );
}

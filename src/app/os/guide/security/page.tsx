import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { View } from "./Figures";

// For buyers of Copilot OS only: gated, not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Module 6 · Security and supply chain | Copilot OS guide",
  description: "What Claude Code can reach, and what the sandbox does and doesn't stop: the lethal trifecta, audits, a guard hook and auto mode.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function SecurityPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <View />
    </SitePageLayout>
  );
}

import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { View } from "./Figures";

// For buyers of Copilot OS only: gated, not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Module 7 · Beyond code: running a business with Claude Code | Copilot OS guide",
  description: "Research, numbers, bookkeeping, content and decisions, from a real two-person company.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function BeyondCodePage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <View />
    </SitePageLayout>
  );
}

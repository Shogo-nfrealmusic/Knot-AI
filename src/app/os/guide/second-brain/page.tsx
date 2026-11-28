import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { View } from "./Figures";

// For buyers of Copilot OS only: gated, not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Module 2 · Your second brain | Copilot OS guide",
  description: "Obsidian holds what you know. Claude reads it, files new things, and answers from all of it.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function SecondBrainPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <View />
    </SitePageLayout>
  );
}

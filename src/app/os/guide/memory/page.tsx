import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { View } from "./Figures";

// For buyers of Copilot OS only: gated, not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Module 3 · Memory that compounds | Copilot OS guide",
  description: "What goes into memory, and how it stays useful after six months.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function MemoryPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <View />
    </SitePageLayout>
  );
}

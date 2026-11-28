import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { View } from "./Figures";

// For buyers of Copilot OS only: gated, not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Module 4 · Verification design | Copilot OS guide",
  description: "When Claude says it's done, how do you know? Checks it can run, a reviewer that starts fresh, and the right gate.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function VerificationPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <View />
    </SitePageLayout>
  );
}

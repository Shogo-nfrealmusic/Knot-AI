import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { Diagnostic } from "./Diagnostic";

// For buyers of Copilot OS only: gated, not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Module 1 · Diagnostic | Copilot OS guide",
  description: "Twenty questions that tell you which module to open next. About ten minutes; nothing is sent anywhere.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function DiagnosticPage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <Diagnostic />
    </SitePageLayout>
  );
}

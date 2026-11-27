import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GUIDE_CSS } from "../style";
import { StartHere } from "./StartHere";

// For buyers of Copilot OS only: not in the sitemap, the header or the footer, and not indexed.
export const metadata: Metadata = {
  title: "Start here | Copilot OS guide",
  description: "Install Claude Code, sign in, and get one real job done in a folder you own. Thirty minutes.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function StartHerePage() {
  return (
    <SitePageLayout>
      <style>{GUIDE_CSS}</style>
      <StartHere />
    </SitePageLayout>
  );
}

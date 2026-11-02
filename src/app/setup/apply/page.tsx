import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GridSection } from "@/app/components/ui/grid-section";
import { BILLING, PLANS, type Billing, type Plan } from "@/lib/setup";
import BookPanel from "./BookPanel";

export const metadata: Metadata = {
  title: "Book a call | Copilot OS Setup",
  description: "Book a 20-minute call about Copilot OS Setup. See which jobs Claude Code can take off your plate, and whether the setup is a fit.",
  alternates: { canonical: "/setup/apply" },
};

// The plan buttons on /setup link here with ?plan=…&billing=…, so the page opens on what was picked.
export default async function BookPage({ searchParams }: { searchParams: Promise<{ plan?: string; billing?: string }> }) {
  const { plan, billing } = await searchParams;
  const initialPlan = (PLANS.some((p) => p.id === plan) ? plan : "build") as Plan["id"];
  const initialBilling = (BILLING.some((b) => b.id === billing) ? billing : "monthly") as Billing;
  return (
    <SitePageLayout>
      <GridSection className="border-t-0" innerClassName="pb-20 pt-24 sm:pb-28 sm:pt-32">
        <BookPanel initialPlan={initialPlan} initialBilling={initialBilling} />
      </GridSection>
    </SitePageLayout>
  );
}

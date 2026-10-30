import type { Metadata } from "next";
import SitePageLayout from "@/app/components/SitePageLayout";
import { GridSection } from "@/app/components/ui/grid-section";
import { BILLING, PLANS, type Billing, type Plan } from "@/lib/setup";
import ApplyPanel from "./ApplyPanel";

export const metadata: Metadata = {
  title: "Apply | Copilot OS Setup",
  description: "Apply for a Copilot OS Setup seat. Two minutes, a reply within two business days, no payment until it's a fit.",
  alternates: { canonical: "/setup/apply" },
};

// The plan buttons on /setup link here with ?plan=…&billing=…, so the page opens on what was picked.
export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ plan?: string; billing?: string }> }) {
  const { plan, billing } = await searchParams;
  const initialPlan = (PLANS.some((p) => p.id === plan) ? plan : "build") as Plan["id"];
  const initialBilling = (BILLING.some((b) => b.id === billing) ? billing : "monthly") as Billing;
  return (
    <SitePageLayout>
      <GridSection className="border-t-0" innerClassName="pb-20 pt-24 sm:pb-28 sm:pt-32">
        <ApplyPanel initialPlan={initialPlan} initialBilling={initialBilling} />
      </GridSection>
    </SitePageLayout>
  );
}

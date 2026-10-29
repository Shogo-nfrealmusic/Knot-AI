// Copilot OS Setup: the monthly setup service sold from /setup.
// Prices and terms decided 2026-10-29 (Vault: Decisions/2026-10-29 copilot_shogo で導入サービスを3段の月額で売る).

export type Billing = "monthly" | "quarterly" | "half";

export const BILLING: { id: Billing; label: string; months: number; discount: number }[] = [
  { id: "monthly", label: "Monthly", months: 1, discount: 0 },
  { id: "quarterly", label: "3 months", months: 3, discount: 0.15 },
  { id: "half", label: "6 months", months: 6, discount: 0.25 },
];

export type Plan = {
  id: "starter" | "build" | "operator";
  name: string;
  monthly: number;
  pitch: string;
  includes: string[];
  hours: string;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 149,
    pitch: "Your setup, built once and kept sharp.",
    includes: [
      "Copilot OS set up for your business in month one",
      "A CLAUDE.md written from an interview with you",
      "A verifier agent that checks Claude's work",
      "A review of your setup every month",
      "Chat support, replies within 2 business days",
    ],
    hours: "Best if you mostly want it set up right.",
  },
  {
    id: "build",
    name: "Build",
    monthly: 490,
    pitch: "One new job taken off your plate every month.",
    includes: [
      "Everything in Starter",
      "One new automation built for your business each month",
      "Replies within 24 hours",
    ],
    hours: "Most people should start here.",
  },
  {
    id: "operator",
    name: "Operator",
    monthly: 990,
    pitch: "For a business that wants Claude in every corner.",
    includes: [
      "Everything in Build",
      "Up to three automations a month",
      "An optional monthly call",
      "Priority replies",
    ],
    hours: "For teams with a long list of repeat work.",
  },
];

// First three Build clients: half price for their first three months, in return for
// before/after screens (client data hidden) and a short testimonial in month three.
export const FOUNDING = { seats: 3, taken: 0, price: 245, months: 3 };

export function perMonth(plan: Plan, billing: Billing) {
  const { discount } = BILLING.find((b) => b.id === billing)!;
  return Math.round(plan.monthly * (1 - discount));
}

export function billedTotal(plan: Plan, billing: Billing) {
  const { months } = BILLING.find((b) => b.id === billing)!;
  return perMonth(plan, billing) * months;
}

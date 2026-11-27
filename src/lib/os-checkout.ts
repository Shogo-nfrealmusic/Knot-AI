// Copilot OS checkout on Stripe Payment Links. No SDK: three read-only calls to the Stripe REST API.
//
// Environment (Vercel, production):
//   OS_STRIPE_KEY          restricted key, read-only on Checkout Sessions and Payment Links
//   OS_LINK_EARLY          Payment Link id for Copilot OS at $29 (Stripe stops it after 20 sales)
//   OS_LINK_FULL           Payment Link id for Copilot OS at $49
//   OS_LINK_OPERATOR       Payment Link id for Founding Operator at $299 (stops after 5)
//   OS_KIT_URL             where the zip lives; fetched server-side only, never sent to the browser
//
// With anything missing, the buy buttons fall back to the price section and nothing breaks.

const API = "https://api.stripe.com/v1";

export type Plan = "os" | "operator";

function key() {
  return process.env.OS_STRIPE_KEY ?? "";
}

export function checkoutReady() {
  return Boolean(key() && process.env.OS_LINK_EARLY && process.env.OS_LINK_FULL && process.env.OS_LINK_OPERATOR);
}

async function stripeGet<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${key()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`Stripe GET ${path.split("?")[0]} failed: ${res.status}`);
    return null;
  }
  return (await res.json()) as T;
}

type PaymentLink = { id: string; url: string; active: boolean };

/** The checkout URL for a plan: the $29 link while it is still active, then the $49 one. */
export async function checkoutUrl(plan: Plan): Promise<string | null> {
  if (!checkoutReady()) return null;
  const ids = plan === "operator" ? [process.env.OS_LINK_OPERATOR!] : [process.env.OS_LINK_EARLY!, process.env.OS_LINK_FULL!];
  for (const id of ids) {
    const link = await stripeGet<PaymentLink>(`/payment_links/${encodeURIComponent(id)}`);
    if (link?.active) return link.url;
  }
  return null;
}

type Session = { id: string; payment_status: string; status: string; payment_link: string | null; customer_details: { email: string | null } | null };

/** A paid Checkout Session from one of our three links, or null. */
export async function paidSession(sessionId: string): Promise<{ plan: Plan; email: string | null } | null> {
  if (!checkoutReady() || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  const s = await stripeGet<Session>(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  if (!s || s.status !== "complete" || s.payment_status !== "paid" || !s.payment_link) return null;
  if (s.payment_link === process.env.OS_LINK_OPERATOR) return { plan: "operator", email: s.customer_details?.email ?? null };
  if (s.payment_link === process.env.OS_LINK_EARLY || s.payment_link === process.env.OS_LINK_FULL) return { plan: "os", email: s.customer_details?.email ?? null };
  return null;
}

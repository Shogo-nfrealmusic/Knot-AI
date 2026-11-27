import { NextResponse } from "next/server";
import { checkoutUrl } from "@/lib/os-checkout";

// /os/buy?plan=os|operator → the live Stripe Payment Link. The $29 link closes itself after 20 sales,
// and buyers are sent to the $49 one from then on. Without Stripe configured, back to the price section.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") === "operator" ? "operator" : "os";
  const target = await checkoutUrl(plan);
  return NextResponse.redirect(target ?? new URL("/os#price", url), 303);
}

import { NextResponse } from "next/server";
import { paidSession } from "@/lib/os-checkout";
import { ACCESS_COOKIE, ACCESS_MAX_AGE, signAccess } from "@/lib/os-access";

// /os/access?session_id=cs_... → checks the purchase with Stripe, then remembers it in this browser
// (signed cookie) and opens the guide. Buyers can use the link from their thanks page on any device.

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id") ?? "";
  const paid = await paidSession(sessionId);
  const value = paid ? await signAccess(sessionId) : null;
  if (!value) return NextResponse.redirect(new URL(`/os/thanks?session_id=${encodeURIComponent(sessionId)}`, url), 303);

  const res = NextResponse.redirect(new URL("/os/guide", url), 303);
  res.cookies.set(ACCESS_COOKIE, value, { httpOnly: true, secure: true, sameSite: "lax", path: "/os", maxAge: ACCESS_MAX_AGE });
  return res;
}

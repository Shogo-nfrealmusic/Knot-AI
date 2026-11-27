import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, isFreeGuidePath, verifyAccess } from "@/lib/os-access";

// Keeps the paid modules of the Copilot OS guide for buyers. Start here and the contents page stay open.

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isFreeGuidePath(pathname)) return NextResponse.next();

  // Previews without the secret stay open so the pages can be reviewed; production without it stays closed.
  if (!process.env.OS_ACCESS_SECRET && process.env.VERCEL_ENV !== "production") return NextResponse.next();

  if (await verifyAccess(request.cookies.get(ACCESS_COOKIE)?.value)) return NextResponse.next();

  const to = new URL("/os", request.url);
  to.searchParams.set("locked", "1");
  to.hash = "price";
  return NextResponse.redirect(to);
}

export const config = {
  matcher: "/os/guide/:path*",
};

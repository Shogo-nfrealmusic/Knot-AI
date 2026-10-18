import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// One password (LINKS_ADMIN_PASSWORD, set in Vercel). The cookie holds an HMAC of it, never the
// password itself, so changing the password signs everyone out.

export const COOKIE = "links_admin";

const token = (password: string) => createHmac("sha256", password).update("links-admin-v1").digest("hex");

export const adminConfigured = () => Boolean(process.env.LINKS_ADMIN_PASSWORD);

export function passwordMatches(input: string): boolean {
  const password = process.env.LINKS_ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(token(input));
  const b = Buffer.from(token(password));
  return a.length === b.length && timingSafeEqual(a, b);
}

export const sessionValue = () => token(process.env.LINKS_ADMIN_PASSWORD ?? "");

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value ?? "";
  const a = Buffer.from(value);
  const b = Buffer.from(sessionValue());
  return a.length === b.length && timingSafeEqual(a, b);
}

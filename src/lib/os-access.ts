// Access to the paid part of the Copilot OS guide (/os/guide/* except Start here).
// After a paid Stripe Checkout Session, /os/access sets a signed cookie; src/proxy.ts checks the signature.
// Web Crypto only, so it runs in Proxy and in route handlers alike.
//
// Environment: OS_ACCESS_SECRET (a long random string). Without it, production keeps the paid pages closed
// and previews leave them open so they can be reviewed.

export const ACCESS_COOKIE = "os_access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 365 * 2;

// Pages anyone can read: the contents page and Start here (the free sample).
export function isFreeGuidePath(pathname: string) {
  const p = pathname.replace(/\/+$/, "");
  return p === "/os/guide" || /^\/os\/guide\/(0-)?start-here$/.test(p);
}

async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function signAccess(sessionId: string) {
  const secret = process.env.OS_ACCESS_SECRET;
  if (!secret) return null;
  return `${sessionId}.${await hmac(sessionId, secret)}`;
}

export async function verifyAccess(cookie: string | undefined) {
  const secret = process.env.OS_ACCESS_SECRET;
  if (!secret || !cookie) return false;
  const dot = cookie.lastIndexOf(".");
  if (dot < 1) return false;
  const expected = await hmac(cookie.slice(0, dot), secret);
  const got = cookie.slice(dot + 1);
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

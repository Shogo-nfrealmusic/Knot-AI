import { createHmac } from "node:crypto";
import { insertEvent, type LinkEvent } from "@/lib/linksStore";
import { parseSource } from "@/lib/links";

// Receives /links tracking beacons (navigator.sendBeacon) and stores one row per event.
// Always answers 204: tracking must never show an error to a visitor or slow the page down.

type Payload = { kind?: unknown; mode?: unknown; src?: unknown; target?: unknown; place?: unknown };

const KINDS = new Set(["view", "click", "mode", "page"]);
const BOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|discord|headless|lighthouse/i;
const short = (v: unknown, max: number) =>
  typeof v === "string" && v ? v.replace(/[^A-Za-z0-9_-]/g, "").slice(0, max) || null : null;
/** a "page" event's target is a site path like /free/26-prompt-motion */
const path = (v: unknown) =>
  typeof v === "string" && v.startsWith("/") ? v.replace(/[^A-Za-z0-9/_-]/g, "").slice(0, 64) || null : null;

/** A salted hash of IP + user agent + the Tokyo date. It counts daily unique visitors without storing
 *  the IP, and changes every day, so nobody can be followed from one day to the next. */
function dailyVisitor(ip: string, ua: string): string | null {
  const salt = process.env.LINKS_ADMIN_PASSWORD;
  if (!salt || !ip) return null;
  const day = new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
  return createHmac("sha256", `links-visitor:${salt}`).update(`${day}|${ip}|${ua}`).digest("hex").slice(0, 16);
}

export async function POST(request: Request) {
  const done = new Response(null, { status: 204 });
  const ua = request.headers.get("user-agent") ?? "";
  if (BOTS.test(ua)) return done;

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return done;
  }
  if (typeof body.kind !== "string" || !KINDS.has(body.kind)) return done;
  if (body.mode !== "ai" && body.mode !== "fit") return done;

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  try {
    await insertEvent({
      kind: body.kind as LinkEvent["kind"],
      mode: body.mode,
      src: parseSource(typeof body.src === "string" ? body.src : undefined),
      target: body.kind === "page" ? path(body.target) : short(body.target, 64),
      place: short(body.place, 24),
      visitor: dailyVisitor(ip, ua),
      device: /Mobi|Android|iPhone|iPad/i.test(ua) ? "mobile" : "desktop",
    });
  } catch {
    // swallow: a lost event is better than a visible failure
  }
  return done;
}

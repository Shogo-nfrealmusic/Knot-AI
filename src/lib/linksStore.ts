// Server-only access to the link_events table (supabase/migrations/20261019000000_link_events.sql),
// through Supabase's REST API with the service role key. Never import this from a client component.

export type LinkEvent = {
  at: string;
  /** page = another page of the site, opened after /links in the same tab (target is its path) */
  kind: "view" | "click" | "mode" | "page";
  mode: "ai" | "fit";
  src: string;
  target: string | null;
  place: string | null;
  visitor: string | null;
  device: "mobile" | "desktop" | null;
};

const url = process.env.LINKS_SUPABASE_URL;
const key = process.env.LINKS_SUPABASE_SERVICE_KEY;

export const storeReady = () => Boolean(url && key);

const headers = () => ({
  apikey: key ?? "",
  Authorization: `Bearer ${key ?? ""}`,
  "Content-Type": "application/json",
});

export async function insertEvent(row: Omit<LinkEvent, "at">): Promise<boolean> {
  if (!storeReady()) return false;
  const res = await fetch(`${url}/rest/v1/link_events`, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  return res.ok;
}

/** Every event since `sinceIso`, oldest first, paged 1,000 rows at a time (PostgREST's default cap). */
export async function fetchEvents(sinceIso: string, maxRows = 200_000): Promise<LinkEvent[]> {
  if (!storeReady()) return [];
  const out: LinkEvent[] = [];
  const page = 1000;
  for (let from = 0; from < maxRows; from += page) {
    const res = await fetch(
      `${url}/rest/v1/link_events?select=at,kind,mode,src,target,place,visitor,device&at=gte.${encodeURIComponent(sinceIso)}&order=at.asc`,
      { headers: { ...headers(), Range: `${from}-${from + page - 1}` }, cache: "no-store" },
    );
    if (!res.ok) throw new Error(`link_events read failed: ${res.status}`);
    const rows = (await res.json()) as LinkEvent[];
    out.push(...rows);
    if (rows.length < page) break;
  }
  return out;
}

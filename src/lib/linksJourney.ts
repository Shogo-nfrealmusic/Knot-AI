import type { LinksMode } from "@/lib/links";

// The "came from /links" mark (Issue #62): set by the link page, read by LinksJourney on every
// other page. sessionStorage, so it never outlives the tab; wrapped because it can throw (private mode).

const KEY = "links-from";

export type Journey = { mode: LinksMode; src: string };

export function markJourney(journey: Journey) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(journey));
  } catch {
    // no storage: those visits just aren't followed
  }
}

export function readJourney(): Journey | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<Journey>;
    if ((value.mode !== "ai" && value.mode !== "fit") || typeof value.src !== "string") return null;
    return { mode: value.mode, src: value.src };
  } catch {
    return null;
  }
}

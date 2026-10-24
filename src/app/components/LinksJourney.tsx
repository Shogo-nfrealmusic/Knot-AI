"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { readJourney } from "@/lib/linksJourney";

// After a visit to /links, records each other page of the site the visitor opens in that tab, so
// /admin/links can show where the link page sends people (Issue #62). Visitors who never opened
// /links send nothing. The mark lives in sessionStorage, so it ends with the tab.
export default function LinksJourney() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/links") || pathname.startsWith("/admin")) return;
    const from = readJourney();
    if (!from) return;
    const body = JSON.stringify({ kind: "page", mode: from.mode, src: from.src, target: pathname });
    if (!navigator.sendBeacon?.("/api/links/event", new Blob([body], { type: "application/json" }))) {
      fetch("/api/links/event", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } }).catch(
        () => {},
      );
    }
  }, [pathname]);

  return null;
}

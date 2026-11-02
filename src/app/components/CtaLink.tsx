"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@vercel/analytics";

// A link to /setup or the booking page that counts its click in Vercel Analytics as "setup_cta", with where it sits
// (place) so the funnel can be read per entry point: free page, starter page, /links, header, /setup itself.
export function CtaLink({ place, onClick, ...rest }: ComponentProps<typeof Link> & { place: string }) {
  return (
    <Link
      {...rest}
      onClick={(event) => {
        track("setup_cta", { place, to: String(rest.href) });
        onClick?.(event);
      }}
    />
  );
}

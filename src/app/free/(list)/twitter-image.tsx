import { getDrops } from "@/lib/free";
import { listImage } from "@/lib/og";

// Link preview for this list page (src/lib/og.tsx). Same picture as opengraph-image.tsx, for X.
export const alt = "From the reels: tools, guides and kits, by Shogo Kikuchi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return listImage({
    kicker: "FREE",
    title: "From the reels:",
    rest: "tools, guides and kits.",
    chips: [`${getDrops().length} drops`, "All free", "@copilot_shogo"],
    footer: "SHOGO.BUILD/FREE",
  });
}

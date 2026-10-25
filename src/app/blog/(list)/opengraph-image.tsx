import { getPublishedPosts } from "@/lib/blog";
import { listImage } from "@/lib/og";

// Link preview for this list page (src/lib/og.tsx). Drawn at build time.
export const alt = "Blog — notes on building and measuring, by Shogo Kikuchi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return listImage({
    kicker: "BLOG",
    title: "Notes on building",
    rest: "and measuring.",
    chips: [`${getPublishedPosts().length} posts`, "AI & automation", "Engineering"],
    footer: "SHOGO.BUILD/BLOG",
  });
}

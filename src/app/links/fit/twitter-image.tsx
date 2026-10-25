import { listImage } from "@/lib/og";

// Link preview for this list page (src/lib/og.tsx). Same picture as opengraph-image.tsx, for X.
export const alt = "Shogo Kikuchi — Links: fitness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return listImage({
    kicker: "LINKS / FITNESS",
    title: "Fitness:",
    rest: "my accounts, free tools and projects in one place.",
    chips: ["Fitness", "AI"],
    footer: "SHOGO.BUILD/LINKS/FIT",
  });
}

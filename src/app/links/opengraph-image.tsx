import { listImage } from "@/lib/og";

// Link preview for this list page (src/lib/og.tsx). Drawn at build time.
export const alt = "Shogo Kikuchi — Links: AI and fitness";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return listImage({
    kicker: "LINKS",
    title: "AI and fitness:",
    rest: "my accounts, free tools and projects in one place.",
    chips: ["AI", "Fitness"],
    footer: "SHOGO.BUILD/LINKS",
  });
}

import { projects } from "@/lib/projects";
import { listImage } from "@/lib/og";

// Link preview for this list page (src/lib/og.tsx). Same picture as opengraph-image.tsx, for X.
export const alt = "Work — systems I built and run, by Shogo Kikuchi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return listImage({
    kicker: "WORK",
    title: "Systems I built",
    rest: "and run in production.",
    chips: [`${projects.length} projects`, "Problem, build, numbers"],
    footer: "SHOGO.BUILD/WORK",
  });
}

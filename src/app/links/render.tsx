import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { getDrops, pad } from "@/lib/free";
import { HERO_SIZES, heroSrcSet, linksContent, type LinksMode, type ModeContent } from "@/lib/links";
import { twitterCard } from "@/lib/site";
import LinksPage from "./LinksPage";

// Shared by /links (AI) and /links/fit (Fitness). Each route is static, served from the CDN, and puts
// a preload for its own hero photo in <head>, so the photo downloads alongside the CSS instead of
// waiting for it. Switching sides in the page is a CSS change; the URL follows with replaceState.

const title = "Shogo Kikuchi — Links";
const description = "AI and fitness: my accounts, free tools, and projects in one place.";

export const linksMetadata = (mode: LinksMode): Metadata => {
  const url = mode === "fit" ? "/links/fit" : "/links";
  // The image is opengraph-image.tsx / twitter-image.tsx in /links and /links/fit.
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: twitterCard(title, description),
  };
};

export const linksViewport = (mode: LinksMode): Viewport => ({
  themeColor: mode === "fit" ? "#0b0b0b" : "#fbfbfa",
});

// Picks the side before first paint: /links/fit, or the older /links?m=fit bio links.
const init = (mode: LinksMode) =>
  `(function(){var d=document.documentElement,f=${mode === "fit" ? "true" : 'new URLSearchParams(location.search).get("m")==="fit"'};d.setAttribute("data-links",f?"fit":"ai");d.setAttribute("data-links-js","")})()`;

/** Fills the AI "Free tools" terminal from the real drop list, so it never goes stale. */
function withFreeStats(ai: ModeContent): ModeContent {
  const drops = getDrops();
  const lines = [
    "% ls -t ~/free | head -3",
    ...drops.slice(0, 3).map((drop) => `${pad(drop.number)}-${drop.slug.replace(/^\d+-/, "")}`),
    "% ls ~/free | wc -l",
    `${drops.length} drops, all free`,
  ];
  return {
    ...ai,
    highlights: ai.highlights.map((card) => (card.kind === "terminal" ? { ...card, lines } : card)),
  };
}

export function LinksRoute({ mode }: { mode: LinksMode }) {
  const photo = linksContent[mode].photo;
  preload(`${photo.base}-640.jpg`, {
    as: "image",
    imageSrcSet: heroSrcSet(photo.base),
    imageSizes: HERO_SIZES,
    fetchPriority: "high",
  });
  const content = { ai: withFreeStats(linksContent.ai), fit: linksContent.fit };
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: init(mode) }} />
      <LinksPage content={content} defaultMode={mode} />
    </>
  );
}

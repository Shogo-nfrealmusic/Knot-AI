import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import { linksContent, type LinksMode } from "@/lib/links";
import { twitterCard } from "@/lib/site";
import LinksPage from "./LinksPage";

// Shared by /links (AI) and /links/fit (Fitness). Each route is static, served from the CDN, and puts
// a preload for its own avatar in <head>, so the photo downloads alongside the CSS instead of
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

export function LinksRoute({ mode }: { mode: LinksMode }) {
  preload(linksContent[mode].avatar.src, { as: "image", fetchPriority: "high" });
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: init(mode) }} />
      <LinksPage content={linksContent} defaultMode={mode} />
    </>
  );
}

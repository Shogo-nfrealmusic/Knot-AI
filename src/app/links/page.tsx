import type { Metadata, Viewport } from "next";
import { getDrops, pad } from "@/lib/free";
import { linksContent, type ModeContent } from "@/lib/links";
import LinksPage from "./LinksPage";

const title = "Shogo Kikuchi — Links";
const description = "AI and fitness: my accounts, free tools, and projects in one place.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/links" },
  openGraph: { title, description, url: "/links", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#fbfbfa",
};

// Static on purpose: served from the CDN with no server work per visit. The side to open (?m=fit)
// is read in the browser by the inline script below, before the first paint, so there is no flash.
export const dynamic = "force-static";

const INIT = `(function(){var d=document.documentElement,f=new URLSearchParams(location.search).get("m")==="fit";d.setAttribute("data-links",f?"fit":"ai");d.setAttribute("data-links-js","");if(f){var t=document.querySelector('meta[name="theme-color"]');if(t)t.setAttribute("content","#0b0b0b")}})()`;

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

export default function Page() {
  const content = { ai: withFreeStats(linksContent.ai), fit: linksContent.fit };
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INIT }} />
      <LinksPage content={content} />
    </>
  );
}

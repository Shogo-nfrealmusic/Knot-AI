import type { Metadata, Viewport } from "next";
import { getDrops, pad } from "@/lib/free";
import { linksContent, parseMode, parseSource, type ModeContent } from "@/lib/links";
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
  themeColor: "#fafaf9",
};

/** Fills the AI "Free tools" card from the real drop list, so it never goes stale. */
function withFreeStats(ai: ModeContent): ModeContent {
  const drops = getDrops();
  const latest = drops[0];
  return {
    ...ai,
    highlights: ai.highlights.map((card) =>
      card.id === "free"
        ? {
            ...card,
            rows: [
              ["drops", String(drops.length)],
              ...(latest ? ([["latest", `#${pad(latest.number)} ${latest.keyword}`]] as [string, string][]) : []),
              ...(card.rows ?? []),
            ],
          }
        : card,
    ),
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const content = { ai: withFreeStats(linksContent.ai), fit: linksContent.fit };

  return <LinksPage content={content} initialMode={parseMode(query.m)} source={parseSource(query.src)} />;
}

import type { Metadata } from "next";
import PostGrid from "@/app/components/blog/PostGrid";
import { GridSection } from "@/app/components/ui/grid-section";
import { getPublishedPosts, toCard } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Shogo Kikuchi",
  description:
    "Notes on building, shipping, and measuring the systems Shogo Kikuchi runs: AI automation, payments, analytics, and growth.",
};

export default function BlogPage() {
  return (
    <GridSection>
      <PostGrid posts={getPublishedPosts().map(toCard)} />
    </GridSection>
  );
}

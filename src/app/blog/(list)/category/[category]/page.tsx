import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PostGrid from "@/app/components/blog/PostGrid";
import { GridSection } from "@/app/components/ui/grid-section";
import {
  categoryLabels,
  getCategoriesWithPosts,
  getPostsByCategory,
  isBlogCategory,
  toCard,
} from "@/lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategoriesWithPosts().map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  if (!isBlogCategory(category)) return {};
  return {
    title: `${categoryLabels[category]} | Blog | Shogo Kikuchi`,
    description: `Posts about ${categoryLabels[category].toLowerCase()} from Shogo Kikuchi.`,
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isBlogCategory(category)) notFound();

  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();

  return (
    <GridSection>
      <PostGrid posts={posts.map(toCard)} />
    </GridSection>
  );
}

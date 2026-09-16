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

  const title = `${categoryLabels[category]} | Blog | Shogo Kikuchi`;
  const description = `Posts about ${categoryLabels[category].toLowerCase()} from Shogo Kikuchi.`;
  const path = `/blog/category/${category}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
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

import { categoryLabels, getCategoriesWithPosts, getPublishedPosts, isBlogCategory } from "@/lib/blog";
import { listImage } from "@/lib/og";

// Link preview for one category list (src/lib/og.tsx). Drawn at build time for each category.
export const alt = "A blog category, by Shogo Kikuchi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// One image per category page, drawn at build time like the pages themselves.
export function generateStaticParams() {
  return getCategoriesWithPosts().map((category) => ({ category }));
}

export default async function Image({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const label = isBlogCategory(category) ? categoryLabels[category] : "Blog";
  const count = getPublishedPosts().filter((post) => post.category === category).length;
  return listImage({
    kicker: "BLOG / CATEGORY",
    title: label,
    rest: "posts.",
    chips: [count === 1 ? "1 post" : `${count} posts`],
    footer: `SHOGO.BUILD/BLOG/CATEGORY/${category.toUpperCase()}`,
  });
}

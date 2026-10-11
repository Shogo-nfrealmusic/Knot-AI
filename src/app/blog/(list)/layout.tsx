import BlogHero from "@/app/components/blog/BlogHero";
import { categoryLabels, getCategoriesWithPosts } from "@/lib/blog";

// Shared by /blog and /blog/category/*: the hero stays mounted between them,
// so the category pill slides instead of re-rendering.
export default function BlogListLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { label: "Overview", href: "/blog" },
    ...getCategoriesWithPosts().map((category) => ({
      label: categoryLabels[category],
      href: `/blog/category/${category}`,
    })),
  ];

  return (
    <>
      <BlogHero items={items} />
      {children}
    </>
  );
}

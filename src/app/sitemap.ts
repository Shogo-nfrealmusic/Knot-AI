import type { MetadataRoute } from "next";
import { getCategoriesWithPosts, getRoutablePosts } from "@/lib/blog";
import { getDrops } from "@/lib/free";

const BASE = "https://shogo.build";

// Drafts are filtered out of getRoutablePosts in production, so they never reach the sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getRoutablePosts();
  const newestPost = posts[0]?.date;

  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/work`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${BASE}/blog`,
      lastModified: newestPost ? new Date(newestPost) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = getCategoriesWithPosts().map((category) => ({
    url: `${BASE}/blog/category/${category}`,
    lastModified: newestPost ? new Date(newestPost) : new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const freePages: MetadataRoute.Sitemap = [
    { url: `${BASE}/free`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...getDrops().map((drop) => ({
      url: `${BASE}/free/${drop.slug}`,
      lastModified: new Date(drop.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  return [...pages, ...postPages, ...categoryPages, ...freePages];
}

import type { Metadata } from "next";
import JsonLd, { SITE_URL } from "@/app/components/JsonLd";
import PostGrid from "@/app/components/blog/PostGrid";
import { GridSection } from "@/app/components/ui/grid-section";
import { getPublishedPosts, postHref, toCard } from "@/lib/blog";
import { site } from "@/lib/site";

const title = "Blog — Notes on building and measuring | Shogo Kikuchi";
const description =
  "Notes on building, shipping, and measuring the systems Shogo Kikuchi runs: AI automation, payments, analytics, and growth.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title, description, url: "/blog", type: "website" },
};

export default function BlogPage() {
  const posts = getPublishedPosts();

  // getPublishedPosts also returns drafts in development, so structured data filters them out.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Shogo Kikuchi — Blog",
    url: `${SITE_URL}/blog`,
    description,
    author: { "@type": "Person", name: site.name, url: SITE_URL },
    blogPost: posts
      .filter((post) => post.status === "published")
      .map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        url: post.externalUrl ?? `${SITE_URL}${postHref(post)}`,
        author: { "@type": "Person", name: post.author.name },
      })),
  };

  return (
    <GridSection>
      <JsonLd data={jsonLd} />
      <PostGrid posts={posts.map(toCard)} />
    </GridSection>
  );
}

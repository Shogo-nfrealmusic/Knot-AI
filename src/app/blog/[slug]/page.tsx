import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd, { OG_IMAGE_URL, SITE_URL } from "@/app/components/JsonLd";
import BlogCover from "@/app/components/blog/BlogCover";
import GridBackdrop from "@/app/components/blog/GridBackdrop";
import PostBody from "@/app/components/blog/PostBody";
import PostSidebar from "@/app/components/blog/PostSidebar";
import ReadMore from "@/app/components/blog/ReadMore";
import { GridSection } from "@/app/components/ui/grid-section";
import {
  categoryLabels,
  formatPostDate,
  getHeadings,
  getPost,
  getPublishedPosts,
  getRoutablePosts,
  readingMinutes,
  toCard,
} from "@/lib/blog";

// External posts (e.g. Mercari Engineering) link out from their cards and have no page here.
export const dynamicParams = false;

export function generateStaticParams() {
  return getRoutablePosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  // Drafts stay out of the index and get no canonical or OG url, which would imply publication.
  if (post.status === "draft") {
    return {
      title: `${post.title} | Shogo Kikuchi`,
      description: post.description,
      robots: { index: false, follow: false },
    };
  }

  const path = `/blog/${post.slug}`;

  return {
    title: `${post.title} | Shogo Kikuchi`,
    description: post.description,
    alternates: { canonical: path },
    openGraph: {
      title: post.title,
      description: post.description,
      url: path,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const readMore = getPublishedPosts()
    .filter((other) => other.slug !== post.slug)
    .slice(0, 4)
    .map(toCard);

  const jsonLd =
    post.status === "published"
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          image: OG_IMAGE_URL,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${post.slug}`,
          },
          author: {
            "@type": "Person",
            name: post.author.name,
            url: `${SITE_URL}/about`,
          },
        }
      : null;

  return (
    <>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}

      <GridSection className="border-t-0" innerClassName="border-x-0 px-4 pb-10 pt-28 sm:pb-16 sm:pt-36">
        <GridBackdrop />
        <div className="relative mx-auto max-w-screen-sm">
          <div className="flex animate-slide-up-fade flex-wrap items-center gap-x-4 gap-y-2 [--offset:10px]">
            <Link
              href={`/blog/category/${post.category}`}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-300 hover:text-neutral-900"
            >
              {categoryLabels[post.category]}
            </Link>
            <p className="text-sm text-neutral-500">
              Last updated •{" "}
              <time
                dateTime={post.date}
                className="underline decoration-neutral-300 decoration-dotted underline-offset-4"
              >
                {formatPostDate(post.date)}
              </time>
            </p>
            {post.status === "draft" ? (
              <span className="rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-amber-700">
                Draft
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 animate-slide-up-fade text-left text-4xl font-medium tracking-[-0.03em] text-neutral-900 [--offset:20px] [animation-delay:80ms] sm:leading-[1.25]">
            {post.title}
          </h1>
          <p className="mt-4 animate-slide-up-fade text-pretty text-neutral-500 [--offset:10px] [animation-delay:140ms] sm:text-lg">
            {post.description}
            {" "}
            <span className="whitespace-nowrap text-neutral-400">· {readingMinutes(post)} min read</span>
          </p>
        </div>
      </GridSection>

      <GridSection>
        <div className="grid grid-cols-3">
          <div className="col-span-3 flex min-w-0 flex-col bg-white md:col-span-2">
            <BlogCover
              category={post.category}
              icon={post.cover.icon}
              label={post.cover.label}
              size="hero"
              className="animate-slide-up-fade [--offset:12px] [animation-delay:200ms]"
            />
            <article className="px-5 py-10 sm:px-12">
              <PostBody blocks={post.body} category={post.category} />
            </article>
            <ReadMore posts={readMore} />
          </div>
          <PostSidebar author={post.author} headings={getHeadings(post)} />
        </div>
      </GridSection>

      {/* The CTA adds its own white band above the notch, so keep this spacer short on phones. */}
      <GridSection innerClassName="h-4 sm:h-20">{null}</GridSection>
    </>
  );
}

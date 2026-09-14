import Link from "next/link";
import BlogCover from "@/app/components/blog/BlogCover";
import type { BlogCard } from "@/lib/blog";

function Row({ post }: { post: BlogCard }) {
  return (
    <>
      <div className="w-[200px] shrink-0 overflow-hidden rounded-lg border border-neutral-200 max-sm:w-28">
        <BlogCover
          category={post.category}
          icon={post.cover.icon}
          label={post.cover.label}
          size="thumb"
          className="aspect-video"
        />
      </div>
      <div className="min-w-0">
        <p className="line-clamp-1 font-medium text-neutral-900 decoration-neutral-400 underline-offset-4 group-hover:underline">
          {post.title}
          {post.external ? " ↗" : ""}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500 decoration-neutral-300 underline-offset-4 group-hover:underline">
          {post.description}
        </p>
        <p className="mt-2 text-xs text-neutral-400">{post.date}</p>
      </div>
    </>
  );
}

export default function ReadMore({ posts }: { posts: BlogCard[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-neutral-200 p-5 sm:p-10">
      <h2 className="text-xl font-medium text-neutral-900">Read more</h2>
      <ul className="mt-6 flex flex-col gap-6">
        {posts.map((post) => {
          const className = "group flex items-center gap-5";
          return (
            <li key={post.slug}>
              {post.external ? (
                <a href={post.href} target="_blank" rel="noopener noreferrer" className={className}>
                  <Row post={post} />
                </a>
              ) : (
                <Link href={post.href} className={className}>
                  <Row post={post} />
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

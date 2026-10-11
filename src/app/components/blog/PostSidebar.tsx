import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import BlogCover from "@/app/components/blog/BlogCover";
import TableOfContents from "@/app/components/blog/TableOfContents";
import type { BlogAuthor } from "@/lib/blog";

export default function PostSidebar({
  author,
  headings,
}: {
  author: BlogAuthor;
  headings: { id: string; text: string }[];
}) {
  return (
    <aside className="hidden flex-col gap-10 border-l border-neutral-200 bg-neutral-50 p-10 md:flex">
      <div>
        <p className="text-sm font-medium text-neutral-900">Written by</p>
        <Link href="/about" className="group mt-4 flex items-center gap-3">
          <Image
            src={author.avatar}
            alt={author.name}
            width={36}
            height={36}
            className="size-9 rounded-full border border-neutral-200 object-cover object-[50%_30%] transition-[filter] group-hover:brightness-95"
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-neutral-900">{author.name}</span>
            <span className="block truncate text-xs text-neutral-500">
              Co-founder &amp; CTO, TPS Collective
            </span>
          </span>
        </Link>
      </div>

      <div className="sticky top-16 flex flex-col gap-10">
        <TableOfContents headings={headings} />

        <Link
          href="/contact"
          className="group relative block rounded-xl border border-neutral-200 bg-white p-4 transition-shadow duration-300 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.15)]"
        >
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            <BlogCover category="ai" icon="monogram" label="Work with me" size="thumb" className="aspect-[2/1]" />
          </div>
          <p className="mt-4 text-sm font-semibold text-neutral-900">Work with me</p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            AI automation and full-stack builds, from someone who runs them in production.
          </p>
          <span className="absolute right-6 top-6 flex size-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 opacity-0 transition-[opacity,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100">
            <IconArrowUpRight className="size-4" />
          </span>
        </Link>
      </div>
    </aside>
  );
}

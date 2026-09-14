"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import BlogCover from "@/app/components/blog/BlogCover";
import type { BlogCard } from "@/lib/blog";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function CardBody({ post }: { post: BlogCard }) {
  return (
    <>
      <BlogCover category={post.category} icon={post.cover.icon} label={post.cover.label} />
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-neutral-400">
            {post.categoryLabel}
          </p>
          <h2 className="mt-2 line-clamp-2 text-lg font-semibold tracking-[-0.015em] text-neutral-900">
            {post.title}
            {post.external ? (
              <IconArrowUpRight className="ml-1 inline size-4 -translate-y-px text-neutral-400 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            ) : null}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-neutral-500">{post.description}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Image
            src={post.author.avatar}
            alt={post.author.name}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover object-[50%_30%] transition-[filter] group-hover:brightness-90"
          />
          <time className="text-sm text-neutral-500">{post.date}</time>
          {post.status === "draft" ? (
            <span className="ml-auto rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-amber-700">
              Draft
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function PostGrid({ posts }: { posts: BlogCard[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:[&>*:not(:nth-child(3n))]:border-r md:[&>*:nth-child(n+4)]:border-t [&>*]:border-neutral-200 max-md:[&>*:not(:first-child)]:border-t">
      {posts.map((post, index) => {
        const className = "group flex h-full flex-col transition-colors duration-200 hover:bg-neutral-50";
        return (
          <motion.div
            key={post.slug}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.06 }}
          >
            {post.external ? (
              <a href={post.href} target="_blank" rel="noopener noreferrer" className={className}>
                <CardBody post={post} />
              </a>
            ) : (
              <Link href={post.href} className={className}>
                <CardBody post={post} />
              </Link>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

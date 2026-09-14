"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { IconCheck, IconChevronDown, IconList } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type CategoryNavItem = { label: string; href: string };

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// dub's blog nav: one black pill slides (shared layoutId) to the active category.
// It lives in the persistent blog list layout, so the pill animates across routes.
export default function CategoryNav({ items }: { items: CategoryNavItem[] }) {
  const pathname = usePathname();
  const active = items.find((item) => item.href === pathname) ?? items[0];
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Blog categories"
        className="mt-10 hidden w-fit animate-slide-up-fade flex-wrap items-center gap-x-2 gap-y-4 [--offset:5px] [animation-delay:200ms] sm:flex"
      >
        {items.map((item) => {
          const isActive = item.href === active.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className="relative z-10"
            >
              <span
                className={cn(
                  "block px-4 py-1.5 text-sm font-medium transition-colors duration-300",
                  isActive ? "text-white" : "text-neutral-800 hover:text-neutral-500",
                )}
              >
                {item.label}
              </span>
              {isActive ? (
                <motion.span
                  layoutId="blog-category-pill"
                  className="absolute inset-0 -z-10 rounded-lg bg-neutral-900"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="relative mt-10 sm:hidden">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-900"
        >
          <IconList className="size-4" />
          <span className="grow text-left">Categories</span>
          <span className="text-neutral-500">{active.label}</span>
          <IconChevronDown
            className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
          />
        </button>
        <AnimatePresence>
          {open ? (
            <motion.ul
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute inset-x-0 top-12 z-20 overflow-hidden rounded-lg border border-neutral-200 bg-white p-1 shadow-lg"
            >
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-neutral-800 hover:bg-neutral-50"
                  >
                    {item.label}
                    {item.href === active.href ? <IconCheck className="size-4" /> : null}
                  </Link>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </>
  );
}

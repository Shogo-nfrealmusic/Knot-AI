"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// "On this page": the active heading is the last one whose top has passed under the header.
export default function TableOfContents({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (elements.length === 0) return;

    const update = () => {
      // A heading becomes active once it rises into the top ~30% of the viewport.
      const line = Math.min(window.innerHeight * 0.3, 240);
      let current = elements[0].id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) current = element.id;
      }
      setActive(current);
    };

    // The observer catches headings crossing the top band during normal scrolling.
    const observer = new IntersectionObserver(update, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: [0, 1],
    });
    elements.forEach((element) => observer.observe(element));

    // Large jumps (anchor links, Home/End) can skip the band entirely, so also
    // re-check on scroll, throttled to one read per frame.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="text-sm font-medium text-neutral-900">On this page</p>
      <ul className="mt-4 border-l-2 border-neutral-200">
        {headings.map((heading) => {
          const isActive = heading.id === active;
          return (
            <li key={heading.id} className="relative">
              {isActive ? (
                <motion.span
                  layoutId="toc-active-bar"
                  className="absolute -left-[2px] inset-y-0 w-0.5 bg-neutral-900"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <a
                href={`#${heading.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  document
                    .getElementById(heading.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `#${heading.id}`);
                  setActive(heading.id);
                }}
                className={cn(
                  "block py-1.5 pl-4 text-sm transition-colors duration-200",
                  isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-700",
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

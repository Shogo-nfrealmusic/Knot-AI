"use client";

import { useEffect, useRef, useState } from "react";
import { IconX, IconZoomIn } from "@tabler/icons-react";
import BlogCover from "@/app/components/blog/BlogCover";
import type { BlogCategory, CoverIcon } from "@/lib/blog";
import { cn } from "@/lib/utils";

const CLOSE_MS = 220;

// Click-to-zoom figure on a native <dialog>; open/close ease scale + opacity.
export default function FigureZoom({
  category,
  icon,
  label,
  caption,
}: {
  category: BlogCategory;
  icon: CoverIcon;
  label: string;
  caption: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [visible, setVisible] = useState(false);

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    requestAnimationFrame(() => setVisible(true));
  };

  const close = () => {
    setVisible(false);
    window.setTimeout(() => dialogRef.current?.close(), CLOSE_MS);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, []);

  return (
    <figure className="my-10">
      <button
        type="button"
        onClick={open}
        aria-label={`Enlarge figure: ${caption}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-neutral-200"
      >
        <BlogCover category={category} icon={icon} label={label} className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.015]" />
        <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white/90 text-neutral-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <IconZoomIn className="size-4" />
        </span>
      </button>
      <figcaption className="mt-3 text-center text-sm text-neutral-500">{caption}</figcaption>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className={cn(
          "m-auto w-[min(1100px,calc(100vw-2rem))] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/0 backdrop:transition-[background-color] backdrop:duration-200",
          visible && "backdrop:bg-black/50",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-2xl transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          )}
        >
          <BlogCover category={category} icon={icon} label={label} size="hero" className="rounded-xl" />
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <IconX className="size-4" />
          </button>
          <p className="px-3 py-2.5 text-center text-sm text-neutral-500">{caption}</p>
        </div>
      </dialog>
    </figure>
  );
}

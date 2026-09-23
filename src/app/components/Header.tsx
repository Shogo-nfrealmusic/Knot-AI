"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function Monogram() {
  return (
    <svg viewBox="0 0 1024 1024" aria-hidden className="h-8 w-8">
      <rect width="1024" height="1024" rx="140" ry="140" className="fill-neutral-900" />
      <polygon points="591,232 757,232 610,487 444,487" className="fill-white" />
      <polygon points="415,537 581,537 434,792 268,792" className="fill-white" />
    </svg>
  );
}

// dub.co nav: one pill that slides under whichever item is hovered, fading out on leave.
function DesktopNav({ pathname }: { pathname: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  const moveTo = (element: HTMLElement) => {
    setPill({ left: element.offsetLeft, width: element.offsetWidth, visible: true });
  };

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul
        ref={listRef}
        className="relative flex"
        onMouseLeave={() => setPill((current) => ({ ...current, visible: false }))}
      >
        <li
          aria-hidden
          className="pointer-events-none absolute top-0 h-8 rounded-lg bg-neutral-900/5 transition-[left,width,opacity] duration-200"
          style={{ left: pill.left, width: pill.width, opacity: pill.visible ? 1 : 0 }}
        />
        {navLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href} onMouseEnter={(event) => moveTo(event.currentTarget)}>
              <Link
                href={link.href}
                aria-current={active ? "page" : undefined}
                onFocus={(event) => moveTo(event.currentTarget.parentElement as HTMLElement)}
                className={cn(
                  "relative flex h-8 items-center rounded-lg px-3 text-sm font-medium text-neutral-700 transition-colors hover:text-neutral-900",
                  // The active route keeps its pill only while the hover pill is elsewhere.
                  active && !pill.visible && "bg-neutral-900/5 text-neutral-900",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const solid = scrolled || mobileOpen;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all",
        solid
          ? "border-neutral-200 bg-white/75 backdrop-blur-lg"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto w-full max-w-screen-lg px-3 lg:px-4 xl:px-0">
        <div className="flex h-14 items-center justify-between">
          <div className="grow basis-0">
            <Link href="/" className="flex w-fit items-center gap-2.5 py-2 pr-2">
              <Monogram />
              <span className="text-base font-semibold tracking-tight text-neutral-900">
                Shogo Kikuchi
              </span>
            </Link>
          </div>

          <DesktopNav pathname={pathname} />

          <div className="hidden grow basis-0 justify-end gap-2 lg:flex">
            <Link
              href="/contact"
              className="flex h-8 items-center rounded-lg border border-black bg-black px-4 text-sm text-white transition-all hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200"
            >
              Get in touch
            </Link>
          </div>

          <button
            type="button"
            className="rounded-full p-2 text-neutral-600 transition-colors hover:bg-neutral-200 active:bg-neutral-300 lg:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              {mobileOpen ? (
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>

      {/* Outside <header>: its backdrop-filter would make it the containing block and clip this fixed panel. */}
      {mobileOpen ? (
        <nav className="fixed inset-x-0 bottom-0 top-14 z-50 overflow-y-auto bg-white px-5 py-6 lg:hidden">
          <ul className="grid divide-y divide-neutral-200">
            {navLinks.map((link) => (
              <li key={link.href} className="py-3">
                <Link href={link.href} className="flex w-full font-semibold text-neutral-900">
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-5">
              <Link
                href="/contact"
                className="flex h-10 w-full items-center justify-center rounded-lg border border-black bg-black text-sm font-medium text-white"
              >
                Get in touch
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </>
  );
}

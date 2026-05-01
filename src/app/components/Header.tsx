"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/work" },
  { label: "Engagements", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/profile" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-[1436px] px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 shrink-0">
            <Image
              src="/images/evimeria-logo.png"
              alt="Knot"
              width={24}
              height={24}
              className="h-6 w-6 invert"
            />
            <span className="text-base font-semibold text-text-primary tracking-tight">
              Knot
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-2.5 py-2 text-[13px] text-text-secondary hover:text-text-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-bg-primary bg-text-primary px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
            >
              Book a free assessment
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-text-secondary shrink-0"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {mobileOpen ? (
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              ) : (
                <path
                  d="M3 6H17M3 10H17M3 14H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block px-2 py-2 text-sm text-text-secondary hover:text-text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4 px-2">
              <Link
                href="/contact"
                className="text-sm text-text-secondary"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium text-bg-primary bg-text-primary px-4 py-1.5 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                Book a free assessment
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

import Link from "next/link";
import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { SiGithub, SiInstagram, SiUpwork } from "react-icons/si";
import { socialLinks } from "@/lib/site";

const socialIcons: Record<string, IconType> = {
  GitHub: SiGithub,
  LinkedIn: FaLinkedin,
  Upwork: SiUpwork,
  Instagram: SiInstagram,
  Email: HiOutlineMail,
};

const columns = [
  {
    title: "Site",
    links: [
      { label: "Work", href: "/work" },
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Connect",
    links: socialLinks,
  },
  {
    title: "Legal",
    links: [{ label: "Privacy", href: "/privacy" }],
  },
];

const linkClass =
  "text-sm text-neutral-500 transition-colors duration-75 hover:text-neutral-700";

export default function Footer() {
  return (
    <footer className="bg-white px-4">
      <div className="mx-auto w-full max-w-screen-lg py-12 sm:py-16 lg:px-4 xl:px-0">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="flex flex-col gap-6">
            <Link href="/" className="block max-w-fit" aria-label="Home">
              <svg viewBox="0 0 1024 1024" aria-hidden className="h-8 w-8">
                <rect width="1024" height="1024" rx="140" ry="140" className="fill-neutral-900" />
                <polygon points="591,232 757,232 610,487 444,487" className="fill-white" />
                <polygon points="415,537 581,537 434,792 268,792" className="fill-white" />
              </svg>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-neutral-500">
              Shogo Kikuchi builds software and runs it in a real business.
            </p>
            <ul className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = socialIcons[link.label];
                if (!Icon) return null;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className="group block rounded-full p-1"
                    >
                      <span className="sr-only">{link.label}</span>
                      <Icon className="size-4 text-neutral-900 transition-colors duration-75 group-hover:text-neutral-600" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-8 sm:mt-16 sm:grid-cols-3 xl:col-span-2 xl:mt-0">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-medium text-neutral-900">
                  {col.title}
                </h3>
                <ul role="list" className="mt-2.5 flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("/") ? (
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className={linkClass}
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-8 sm:grid-cols-3">
          <Link
            href="/contact"
            className="group flex max-w-fit items-center gap-2 rounded-lg border border-neutral-200 bg-white py-2 pl-2 pr-2.5 transition-colors hover:bg-neutral-50 active:bg-neutral-100"
          >
            <span className="relative size-2">
              <span className="absolute inset-0 m-auto size-2 animate-ping rounded-full bg-green-500 group-hover:animate-none" />
              <span className="absolute inset-0 z-10 m-auto size-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-medium leading-none text-neutral-600">
              Taking new projects
            </span>
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-400 sm:text-center">
            Tokyo · Remote
          </p>
          <p className="text-xs text-neutral-500 sm:text-right">
            © 2026 Shogo Kikuchi
          </p>
        </div>
      </div>
    </footer>
  );
}

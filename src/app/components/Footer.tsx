import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Email", href: "/contact" },
      {
        label: "X / Twitter",
        href: "https://x.com/imshogok",
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "DPA", href: "/dpa" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-solid bg-bg-primary">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-14 py-14">
        <div className="grid grid-cols-1 gap-y-10 text-center md:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))] md:gap-x-8 md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/logo.png"
              alt="Knot"
              width={120}
              height={120}
              className="h-8 w-8 rounded-md object-cover"
            />
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed tracking-[-0.008em] text-text-secondary">
              Knot turns AI capability into operational practice.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-text-secondary transition-colors duration-150 hover:text-text-primary tracking-[-0.008em]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[13px] text-text-secondary transition-colors duration-150 hover:text-text-primary tracking-[-0.008em]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-border-solid pt-6 text-center md:text-left">
          <p className="text-[12px] text-text-muted tracking-[-0.008em]">
            © 2026 Knot, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
}

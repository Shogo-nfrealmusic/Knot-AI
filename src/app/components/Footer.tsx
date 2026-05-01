import Image from "next/image";

const columns = [
  {
    title: "Services",
    links: [
      "AI Operations Assessment",
      "Skills Implementation",
      "Monthly AI Advisory",
      "Workflow Mapping",
      "Agent Design",
      "Implementation Roadmaps",
      "Operating Model",
    ],
  },
  {
    title: "Company",
    links: [
      "How it works",
      "Engagements",
      "FAQ",
      "Resources",
      "Terms",
      "Privacy",
    ],
  },
  {
    title: "Knot",
    links: [
      "About",
      "What we do",
      "Who we serve",
      "Availability",
    ],
  },
  {
    title: "Resources",
    links: [
      "Contact form",
      "Free assessment",
      "Request information",
      "Templates (coming soon)",
    ],
  },
  {
    title: "Contact",
    links: [
      "Email",
      "X (formerly Twitter)",
      "note",
      "GitHub",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-solid bg-bg-primary">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-14 py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-8 lg:grid-cols-6">
          {/* Logo */}
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/images/evimeria-logo.png"
              alt="Knot"
              width={20}
              height={20}
              className="h-5 w-5 invert opacity-80"
            />
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold text-text-primary tracking-[-0.008em] mb-6">
                {col.title}
              </h3>
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="block py-1 text-[13px] text-text-secondary hover:text-text-primary transition-colors tracking-[-0.008em]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-20 flex flex-wrap gap-x-5 gap-y-2">
          {["Privacy", "Terms", "DPA"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] text-text-muted hover:text-text-secondary transition-colors tracking-[-0.008em]"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

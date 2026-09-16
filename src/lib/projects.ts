export type ProjectLink = { label: string; href: string };
export type ProjectMetric = { value: string; label: string };
export type ProjectSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};
export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  name: string;
  title: string;
  summary: string;
  role: string;
  context?: { label: string; value: string };
  stack: string[];
  /** The first link is the primary one and is shown on the project card. */
  links: ProjectLink[];
  /** The first metric is the headline number on the project card. */
  metrics: ProjectMetric[];
  sections: ProjectSection[];
  images: ProjectImage[];
};

// Ordered by strength of evidence (PORTFOLIO.md §4). Screenshots go in `images`
// (PORTFOLIO.md §12-10, step 8).
export const projects: Project[] = [
  {
    slug: "tps-booking-platform",
    name: "TPS Booking Platform",
    title: "Multilingual Booking Platform with Deposit-Based Payments",
    summary:
      "Booking and payments for a Tokyo photo studio whose customers book from 20+ countries.",
    role: "Sole developer. Design, build, deploy, and operate.",
    stack: [
      "Next.js",
      "TypeScript",
      "Go",
      "PostgreSQL",
      "AWS",
      "Stripe",
      "Cloudflare",
    ],
    links: [
      { label: "Live site", href: "https://book.tettyphotostudio.com/" },
      { label: "Company site", href: "https://www.tps-collective.com/" },
    ],
    metrics: [
      { value: "$19.9k", label: "best month in revenue" },
      { value: "754", label: "transactions in 8.5 months" },
      { value: "39%", label: "funnel drop-off identified" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Customers book from 20+ countries before they arrive in Japan. They need to choose a plan, a location, and a time slot in their own language, and pay a deposit in their own currency — before they trust us.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "Multilingual booking flow with location and time-slot selection",
          "Stripe integration with 30% deposit at booking and automated remaining balance collection after the shoot",
          "Photographer assignment and Google Calendar sync",
          "GA4 and Microsoft Clarity instrumentation on every funnel step",
          "Also built the company website, tps-collective.com",
        ],
      },
      {
        heading: "Results",
        items: [
          "Monthly revenue between ~$4,000 and ~$19,900 in Stripe (converted from JPY at ¥154 = $1)",
          "TPS has handled 1,200+ clients to date, and is working toward ~$1.3M (¥200M) in first-year revenue",
          "754 transactions processed in 8.5 months (Jan 1 – Sep 13, 2026)",
          "Identified a 39% drop-off between date selection and time selection using session-level replay data, and shipped fixes",
        ],
      },
    ],
    images: [
      {
        src: "/images/work/tps-booking-desktop.png",
        alt: "Tetty's Photo Studio booking site, desktop home page",
        width: 1440,
        height: 900,
      },
      {
        src: "/images/work/tps-booking-mobile.png",
        alt: "Tetty's Photo Studio booking site on a phone",
        width: 780,
        height: 1688,
      },
    ],
  },
  {
    slug: "tps-staff-app",
    name: "TPS Staff Operations App",
    title: "Staff Operations App for a Multinational Contractor Team",
    summary:
      "An iOS app that moved job assignment, earnings, and month-end invoicing for eight contract photographers out of DMs and spreadsheets.",
    role: "Sole developer.",
    context: {
      label: "Platform",
      value: "iOS (App Store). Not publicly downloadable — internal tool.",
    },
    stack: ["React Native", "Expo", "Stripe", "Google Calendar API", "AWS"],
    links: [],
    metrics: [
      { value: "8", label: "contract photographers on one app" },
      { value: "Weekly", label: "production use by the team" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Eight contract photographers across multiple nationalities needed to claim jobs, track their earnings, and invoice at month end. All of it was happening in DMs and spreadsheets.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "Self-assignment: photographers claim open shoots from the app",
          "Automatic earnings calculation per job",
          "Monthly invoice generation and submission",
          "Remaining balance collection from customers after each shoot",
          "Google Calendar two-way sync",
        ],
      },
      {
        heading: "Results",
        items: [
          "Replaced manual DM-based assignment entirely",
          "Month-end invoicing went from manual aggregation to automated",
          "Currently in production, used by the team every week",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "mercari-pm-ai-agent",
    name: "Mercari PM AI Agent",
    title: "AI Agent for Product Management Workflows",
    summary:
      "An agent built on Claude Code and MCP that runs the chain from problem discovery to PRD to UI prototype.",
    role: "Product Management Intern",
    context: {
      label: "Company",
      value: "Mercari, Inc. (Japan's largest marketplace, ~$1.5B revenue)",
    },
    stack: ["Claude Code", "MCP (Model Context Protocol)", "Anthropic API"],
    links: [
      {
        label: "Read the article",
        href: "https://engineering.mercari.com/en/blog/entry/20260427-mercari-pm-agent-design-automating-the-pm-workflow-with-claude-code-skills-and-mcp/",
      },
    ],
    metrics: [
      { value: "Published", label: "on the Mercari Engineering blog" },
      { value: "In use", label: "internally at Mercari" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Product managers spend a large share of their time on repeatable work: turning scattered problem signals into a structured PRD, then into a UI prototype for review.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "An agent using Claude Code and the Model Context Protocol that runs the chain from problem discovery through PRD drafting to UI prototyping.",
        ],
      },
      {
        heading: "Results",
        items: [
          "Published as a technical article on Mercari Engineering's blog",
          "Used internally",
          "Joining Mercari full-time as a Product Manager in April 2027",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "automated-content-pipeline",
    name: "Automated Content Pipeline",
    title: "Fully Automated Short-Form Video Pipeline",
    summary:
      "A pipeline that selects footage, writes captions, and renders 10 short-form videos every morning with no human input.",
    role: "Sole developer.",
    stack: ["Python", "AWS", "LLM APIs", "Video processing"],
    links: [
      {
        label: "Output on Instagram",
        href: "https://www.instagram.com/tettyphotostudio/",
      },
    ],
    metrics: [
      { value: "10", label: "videos generated every morning" },
      { value: "66k+", label: "monthly views on the account" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Producing short-form content consistently requires selecting clips, writing captions, and publishing across platforms — every single day. That work does not scale with a two-person company.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: ["A pipeline that runs every morning with no human input:"],
        items: [
          "Selects source footage",
          "Generates captions",
          "Renders 10 short-form videos",
          "Prepares them for distribution",
        ],
      },
      {
        heading: "Results",
        items: [
          "10 videos generated every morning, unattended",
          "66,000+ monthly views on the resulting account",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "iron-and-code",
    name: "Iron & Code",
    title: "Iron & Code — A Free Tool Every Monday",
    summary:
      "Free calculators for lifters, from plate math to 1RM and macros, shipped on a weekly cadence with a short video for each.",
    role: "Sole developer and creator.",
    stack: ["Next.js", "TypeScript", "Vercel"],
    links: [{ label: "Live site", href: "https://ironandcode.dev" }],
    metrics: [
      { value: "Weekly", label: "a new free tool every Monday" },
      { value: "Solo", label: "designed, built, and shipped alone" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Lifters do plate math, 1RM estimates, and macro calculations in their heads between sets. Every one of those is a 10-line function that nobody bothered to build well.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "Small, free tools released on a weekly cadence, one every Monday. Each tool is paired with a short-form video explaining the problem it solves.",
        ],
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "This project is proof of shipping cadence, not scale: a fixed weekly release rhythm, run solo.",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "instagram-personal-brand",
    name: "Instagram @imshogo.k",
    title: "Personal Brand — 0 to 29,000 Followers",
    summary:
      "A personal brand built from zero, and a 13-month analysis of what actually drives reach.",
    role: "Founder, creator, analyst.",
    stack: [],
    links: [
      { label: "Instagram", href: "https://www.instagram.com/imshogo.k/" },
    ],
    metrics: [
      { value: "29k", label: "followers, built from zero" },
      { value: "1M+", label: "views on multiple videos" },
      { value: "13 mo", label: "of account data analyzed" },
    ],
    sections: [
      {
        heading: "What I did",
        paragraphs: [
          "Built a personal brand in the motivation, fitness, and self-growth space from zero. Multiple videos passed 1M views.",
        ],
      },
      {
        heading: "What I actually learned",
        paragraphs: [
          "I ran a 13-month analysis of my own account data and found that share count — not follower count — is the only reliable leading indicator of reach. Follower count turned out to be nearly useless as a signal.",
        ],
      },
      {
        heading: "Why this is on a developer's portfolio",
        paragraphs: [
          "Most developers can build a product but can't get anyone to see it.",
          "Most creators can get attention but can't build anything.",
          "I do both, and I measure both.",
        ],
      },
    ],
    images: [],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

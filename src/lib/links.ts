// Content for /links, the link-in-bio page that replaced Linktree (Issue #26).
// Everything Shogo might swap (links, photos, highlight cards) lives here, so the page itself never needs editing.

export type LinksMode = "ai" | "fit";

export type LinkRow = {
  /** stable id, sent with the click event; never rename once live or the counts split */
  id: string;
  label: string;
  /** small line under the label */
  note?: string;
  href: string;
};

export type Highlight = {
  id: string;
  /** first caption line (bold) */
  title: string;
  /** second caption line */
  sub: string;
  href: string;
  /** a screenshot; without one the card is drawn as a mono key/value panel */
  image?: string;
  /** rows for the key/value panel */
  rows?: [string, string][];
};

export type ModeContent = {
  tab: string;
  name: string;
  line: string;
  photo: { src: string; alt: string; width: number; height: number };
  highlights: Highlight[];
  links: LinkRow[];
  closing: string;
};

const contact: LinkRow = {
  id: "contact",
  label: "Contact",
  note: "Work, collabs, questions",
  href: "/contact",
};

export const linksContent: Record<LinksMode, ModeContent> = {
  ai: {
    tab: "AI",
    name: "Shogo Kikuchi",
    line: "I build with AI, run it in a real business, and share what works.",
    photo: { src: "/links/ai.jpg", alt: "Shogo at his laptop with a camera", width: 1200, height: 1800 },
    highlights: [
      {
        id: "free",
        title: "Free tools",
        sub: "Every tool from the reels, with the setup.",
        href: "/free",
        // rows are filled from src/lib/free.ts in app/links/page.tsx (count and latest drop)
        rows: [["price", "free"]],
      },
      {
        id: "toni",
        title: "TONI",
        sub: "A 3D scroll site for a concept drink.",
        href: "https://toni.shogo.build/",
        image: "/images/work/toni-desktop.png",
      },
      {
        id: "signal",
        title: "SIGNAL",
        sub: "A daily AI brief ranked by consequence.",
        href: "https://www.sgnl.news/",
        image: "/images/work/signal-desktop.png",
      },
      {
        id: "tps",
        title: "TPS Booking",
        sub: "Booking and payments for a Tokyo photo studio.",
        href: "/work",
        image: "/images/work/tps-booking-desktop.png",
      },
    ],
    links: [
      { id: "ig_copilot", label: "Instagram", note: "@copilot_shogo", href: "https://www.instagram.com/copilot_shogo/" },
      // TODO(Shogo): confirm the X handle
      { id: "x", label: "X", note: "@copilot_shogo", href: "https://x.com/copilot_shogo" },
      { id: "work", label: "Projects", note: "What I've built and run", href: "/work" },
      { id: "free", label: "Free tools", note: "From the reels", href: "/free" },
      { id: "tps", label: "TPS Collective", note: "My company", href: "https://www.tps-collective.com/" },
      { id: "github", label: "GitHub", note: "Shogo-nfrealmusic", href: "https://github.com/Shogo-nfrealmusic" },
      { id: "linkedin", label: "LinkedIn", note: "Shogo Kikuchi", href: "https://www.linkedin.com/in/shogo-kikuchi-19b792321/" },
      contact,
    ],
    closing: "Building something with AI? Tell me about it.",
  },
  fit: {
    tab: "Fitness",
    name: "Shogo",
    line: "Training every day. Free tools for lifters.",
    photo: { src: "/links/fitness.jpg", alt: "Shogo in a black jacket on a mountain lookout", width: 1200, height: 1800 },
    highlights: [
      {
        id: "iron_code",
        title: "Iron & Code",
        sub: "Free training tools, built by a lifter.",
        href: "https://ironandcode.dev",
        rows: [
          ["tools", "5"],
          ["price", "free"],
          ["account", "none needed"],
        ],
      },
      {
        id: "depth",
        title: "Depth",
        sub: "Check your squat depth from a video.",
        href: "https://ironandcode.dev",
        rows: [
          ["input", "your squat video"],
          ["upload", "never, runs in the browser"],
        ],
      },
      {
        id: "percentile",
        title: "Strength Percentile",
        sub: "Where your lifts rank for your bodyweight.",
        href: "https://ironandcode.dev",
        rows: [
          ["lifts", "bench / squat / deadlift"],
          ["adjusts for", "age"],
        ],
      },
    ],
    links: [
      { id: "ig_imshogo", label: "Instagram", note: "@imshogo.k", href: "https://www.instagram.com/imshogo.k/" },
      { id: "iron_code", label: "Iron & Code", note: "Free tools for lifters", href: "https://ironandcode.dev" },
      // TODO(Shogo): YouTube SHO_VLOG channel URL, and where coaching sign-ups should go
      contact,
    ],
    closing: "Want help with your training? Send me a message.",
  },
};

export function parseMode(value: string | string[] | undefined): LinksMode {
  return value === "fit" ? "fit" : "ai";
}

/** `?src=ig_ai` style source tags: short, lowercase, so a typo in a bio link can't flood the event list. */
export function parseSource(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "direct";
  const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  return clean || "direct";
}

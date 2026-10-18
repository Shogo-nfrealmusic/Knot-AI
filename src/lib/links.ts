// Content for /links, the link-in-bio page that replaced Linktree (Issue #26).
// Everything Shogo might swap (links, photos, highlight cards) lives here, so the page itself never needs editing.

export type LinksMode = "ai" | "fit";

export type SocialIcon = "instagram" | "x" | "github" | "linkedin" | "youtube" | "email";

export type Social = {
  /** stable id, sent with the click event; never rename once live or the counts split */
  id: string;
  label: string;
  icon: SocialIcon;
  href: string;
};

type CardBase = {
  id: string;
  /** small line above the title, e.g. "Co-founder & CTO" */
  kicker: string;
  title: string;
  href: string;
};

/** Highlight cards, Apple-style: caption on top, one large visual below. */
export type Highlight =
  | (CardBase & { kind: "phone"; image: string; stats: [string, string][] })
  | (CardBase & { kind: "screenshot"; image: string })
  | (CardBase & { kind: "article"; source: string; excerpt: string })
  | (CardBase & { kind: "terminal"; lines: string[] })
  | (CardBase & { kind: "video"; video: string; poster: string });

export type PageTile = { id: string; label: string; note: string; href: string };

/** A long-form YouTube video (not a Short: those repeat what is on Instagram). */
export type YouTubeVideo = { id: string; title: string; duration: string };

export type ModeContent = {
  tab: string;
  name: string;
  /** one line under the name; the part in `em` is set in the serif italic */
  line: { before: string; em: string; after: string };
  /** `${base}-640.jpg` and `${base}-960.jpg` must both exist (page.tsx preloads them by name) */
  /** `${base}-640.jpg` and `${base}-960.jpg` must both exist: page.tsx preloads them by name */
  photo: { base: string; alt: string; width: number; height: number };
  socials: Social[];
  highlightsLabel: string;
  highlights: Highlight[];
  pages: PageTile[];
  videos?: { label: string; channel: string; items: YouTubeVideo[] };
  closing: { text: string; cta: string; href: string };
};

export const linksContent: Record<LinksMode, ModeContent> = {
  ai: {
    tab: "AI",
    name: "Shogo Kikuchi",
    line: { before: "I build software with ", em: "AI", after: " and run it in a real business in Tokyo." },
    photo: { base: "/links/ai", alt: "Shogo at his laptop with a camera", width: 1200, height: 1800 },
    socials: [
      { id: "ig_copilot", label: "Instagram @copilot_shogo", icon: "instagram", href: "https://www.instagram.com/copilot_shogo/" },
      { id: "x", label: "X @copilot_shogo", icon: "x", href: "https://x.com/copilot_shogo" },
      { id: "github", label: "GitHub", icon: "github", href: "https://github.com/Shogo-nfrealmusic" },
      { id: "linkedin", label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/shogo-kikuchi-19b792321/" },
      { id: "email", label: "Email", icon: "email", href: "mailto:hello@shogo.build" },
    ],
    highlightsLabel: "Selected work",
    // Order = strength of evidence: the company and its revenue first, then the published work, then concepts.
    highlights: [
      {
        id: "tps",
        kind: "phone",
        kicker: "Co-founder & CTO",
        title: "TPS Collective",
        href: "https://www.tps-collective.com/",
        image: "/images/work/tps-booking-mobile.png",
        stats: [
          ["$19.9k", "best month"],
          ["20+", "countries book"],
        ],
      },
      {
        id: "mercari",
        kind: "article",
        kicker: "Mercari Engineering",
        title: "An AI agent for PM work",
        href: "https://engineering.mercari.com/en/blog/entry/20260427-mercari-pm-agent-design-automating-the-pm-workflow-with-claude-code-skills-and-mcp/",
        source: "engineering.mercari.com",
        excerpt: "From a business problem to a PRD and UI mockups in one session, with evidence pulled from Notion, Slack, Looker and Figma.",
      },
      {
        id: "signal",
        kind: "screenshot",
        kicker: "Runs 6 times a day",
        title: "SIGNAL",
        href: "https://www.sgnl.news/",
        image: "/images/work/signal-desktop.png",
      },
      {
        id: "toni",
        kind: "screenshot",
        kicker: "3D scroll site",
        title: "TONI",
        href: "https://toni.shogo.build/",
        image: "/images/work/toni-desktop.png",
      },
      {
        id: "free",
        kind: "terminal",
        kicker: "From the reels",
        title: "Free tools",
        href: "/free",
        // lines are filled from src/lib/free.ts in app/links/page.tsx
        lines: [],
      },
    ],
    pages: [
      { id: "work", label: "Work", note: "Systems I built and run", href: "/work" },
      { id: "free", label: "Free tools", note: "Every tool from the reels", href: "/free" },
      { id: "blog", label: "Blog", note: "How they were built", href: "/blog" },
    ],
    closing: { text: "Building something with AI?", cta: "Get in touch", href: "/contact" },
  },
  fit: {
    tab: "Fitness",
    name: "Shogo",
    line: { before: "Training every day. ", em: "No days off", after: " from the work either." },
    photo: { base: "/links/fitness", alt: "Shogo in a black jacket on a mountain lookout", width: 1200, height: 1800 },
    socials: [
      { id: "ig_imshogo", label: "Instagram @imshogo.k", icon: "instagram", href: "https://www.instagram.com/imshogo.k/" },
      { id: "youtube", label: "YouTube sho_vlog", icon: "youtube", href: "https://www.youtube.com/@imshogo.k/videos" },
      { id: "email", label: "Email", icon: "email", href: "mailto:hello@shogo.build" },
    ],
    highlightsLabel: "Latest edits",
    highlights: [
      {
        id: "while_they_sleep",
        kind: "video",
        kicker: "Edit",
        title: "6:00 am, while they sleep",
        href: "https://www.instagram.com/imshogo.k/",
        video: "/links/fit/while-they-sleep.mp4",
        poster: "/links/fit/while-they-sleep.jpg",
      },
      {
        id: "honest_reaction",
        kind: "video",
        kicker: "Edit",
        title: "My honest reaction",
        href: "https://www.instagram.com/imshogo.k/",
        video: "/links/fit/honest-reaction.mp4",
        poster: "/links/fit/honest-reaction.jpg",
      },
      {
        id: "monolith",
        kind: "video",
        kicker: "Edit",
        title: "Monolith",
        href: "https://www.instagram.com/imshogo.k/",
        video: "/links/fit/monolith.mp4",
        poster: "/links/fit/monolith.jpg",
      },
    ],
    // Newest long-form uploads on sho_vlog, checked 2026-10-19. Thumbnails load from YouTube itself.
    videos: {
      label: "On YouTube",
      channel: "https://www.youtube.com/@imshogo.k/videos",
      items: [
        { id: "M8Ow1fcOY8g", title: "Tokyo student co-founders locked in for a whole weekend", duration: "10:28" },
        { id: "GE1th4wqAE8", title: "Training at a 90s gym in Japan, since 1997", duration: "6:07" },
        { id: "JPtPrvjP8KY", title: "A perfect day in Japan: beach, café, gym", duration: "10:48" },
        { id: "GBv_XR5i8z4", title: "Back in America after study abroad", duration: "17:48" },
      ],
    },
    pages: [
      // Coaching is arranged in Instagram DMs (Shogo, 2026-10-19)
      { id: "coaching", label: "Coaching", note: "1:1 training. DM me on Instagram", href: "https://ig.me/m/imshogo.k" },
      { id: "edit_guide", label: "How I edit these", note: "Cinematic reels, cut by Claude", href: "/free/27-claude-video-edit" },
    ],
    closing: { text: "Want me to coach you?", cta: "DM me on Instagram", href: "https://ig.me/m/imshogo.k" },
  },
};

/** Shared by the hero <img> and the preload in page.tsx; they must match exactly or the photo downloads twice. */
export const HERO_SIZES = "(max-width: 440px) 100vw, 440px";
export const heroSrcSet = (base: string) => `${base}-640.jpg 640w, ${base}-960.jpg 960w`;

/** `?src=ig_ai` style source tags: short, lowercase, so a typo in a bio link can't flood the event list. */
export function parseSource(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "direct";
  const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  return clean || "direct";
}

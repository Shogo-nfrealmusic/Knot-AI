// Content for /links, the link-in-bio page that replaced Linktree (Issue #26).
// Everything Shogo might swap (links, photos, buttons) lives here, so the page itself never needs editing.

export type LinksMode = "ai" | "fit";

export type SocialIcon = "instagram" | "x" | "github" | "linkedin" | "youtube" | "email";

export type Social = {
  /** stable id, sent with the click event; never rename once live or the counts split */
  id: string;
  label: string;
  icon: SocialIcon;
  href: string;
};

export type ButtonIcon = "tools" | "portfolio" | "company";

/** A Linktree-style row: one full-width button with a small line icon (Shogo, 2026-10-25). */
export type LinkButton = {
  /** stable id, sent with the click event; never rename once live or the counts split */
  id: string;
  label: string;
  icon: ButtonIcon;
  href: string;
};

export type ModeContent = {
  tab: string;
  name: string;
  /** one line under the name; the part in `em` is set in the serif italic */
  line: { before: string; em: string; after: string };
  /** a square face crop, shown as the round avatar; render.tsx preloads it for the URL's side */
  avatar: { src: string; alt: string };
  socials: Social[];
  /** empty on a side that goes straight from the icons to its form */
  buttons: LinkButton[];
  /** the last section: a heading, one line on what to send, and the form for this side */
  closing: { id: string; text: string; note: string; form: "work" | "coaching" };
};

export const linksContent: Record<LinksMode, ModeContent> = {
  ai: {
    tab: "AI",
    name: "Shogo Kikuchi",
    line: { before: "I build software with ", em: "AI", after: " and run it in a real business in Tokyo." },
    avatar: { src: "/links/ai-avatar.jpg", alt: "Shogo Kikuchi" },
    socials: [
      { id: "ig_copilot", label: "Instagram @copilot_shogo", icon: "instagram", href: "https://www.instagram.com/copilot_shogo/" },
      { id: "youtube_copilot", label: "YouTube @copilot_shogo", icon: "youtube", href: "https://www.youtube.com/@copilot_shogo" },
      { id: "x", label: "X @copilot_shogo", icon: "x", href: "https://x.com/copilot_shogo" },
      { id: "github", label: "GitHub", icon: "github", href: "https://github.com/Shogo-nfrealmusic" },
      { id: "linkedin", label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/shogo-kikuchi-19b792321/" },
      { id: "email", label: "Email", icon: "email", href: "mailto:hello@shogo.build" },
    ],
    // ids reuse the old card ids ("free", "tps") so their click counts carry on
    buttons: [
      { id: "free", label: "Free AI tools & guides", icon: "tools", href: "/free" },
      { id: "portfolio", label: "Portfolio", icon: "portfolio", href: "/" },
      { id: "tps", label: "Our company", icon: "company", href: "https://www.tps-collective.com/" },
    ],
    // For hire: client builds, not a newsletter or a chat (Shogo, 2026-10-25)
    closing: {
      id: "work-with-me",
      text: "Work with me",
      note: "Need an AI agent, an automation or a full web app built? Tell me what it should do.",
      form: "work",
    },
  },
  fit: {
    tab: "Fitness",
    name: "Shogo",
    line: { before: "Training every day. ", em: "No days off", after: " from the work either." },
    avatar: { src: "/links/fitness-avatar.jpg", alt: "Shogo" },
    socials: [
      { id: "ig_imshogo", label: "Instagram @imshogo.k", icon: "instagram", href: "https://www.instagram.com/imshogo.k/" },
      { id: "youtube", label: "YouTube sho_vlog", icon: "youtube", href: "https://www.youtube.com/@imshogo.k/videos" },
      { id: "email", label: "Email", icon: "email", href: "mailto:hello@shogo.build" },
    ],
    // Straight from the icons to the coaching form (Shogo, 2026-10-25)
    buttons: [],
    closing: {
      id: "coach",
      text: "Want me to coach you?",
      note: "1:1 online coaching. Tell me where you are now and where you want to be.",
      form: "coaching",
    },
  },
};

/** `?src=ig_ai` style source tags: short, lowercase, so a typo in a bio link can't flood the event list. */
export function parseSource(value: string | string[] | undefined): string {
  if (typeof value !== "string") return "direct";
  const clean = value.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 24);
  return clean || "direct";
}

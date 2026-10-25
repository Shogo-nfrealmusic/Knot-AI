export const site = {
  name: "Shogo Kikuchi",
  email: "hello@shogo.build",
};

// The site's link-preview image (src/app/opengraph-image.png). Metadata merges shallowly, so a page
// that sets its own openGraph or twitter loses the root image and has to name it again; list pages
// have their own image instead (src/lib/og.tsx).
export const siteOgImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Shogo Kikuchi — I build software, run it in a real business, and grow the audience around it.",
  type: "image/png",
};

/** The X card for a page: its own title and description, and the given image (or the list page's file). */
export function twitterCard(title: string, description: string, images?: (typeof siteOgImage | string)[]) {
  return { card: "summary_large_image" as const, title, description, ...(images ? { images } : {}) };
}

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/Shogo-nfrealmusic" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shogo-kikuchi-19b792321/",
  },
  {
    label: "Upwork",
    href: "https://www.upwork.com/freelancers/~0136ae6e5036feafd2",
  },
  { label: "Instagram", href: "https://www.instagram.com/imshogo.k/" },
  { label: "Email", href: `mailto:${site.email}` },
];

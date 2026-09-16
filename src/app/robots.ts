import type { MetadataRoute } from "next";

const BASE = "https://shogo.build";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The contact form endpoint has nothing to index.
      disallow: "/api/",
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

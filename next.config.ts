import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Keep /ja routes serving the same pages while the URL structure stays unchanged.
      { source: "/ja", destination: "/" },
      { source: "/ja/:path*", destination: "/:path*" },
    ];
  },
  // The link-preview images read these fonts from disk (src/lib/og.tsx); ship them with any route
  // that draws one on request instead of at build time.
  outputFileTracingIncludes: {
    "/**/opengraph-image*": ["./src/lib/og-fonts/*.ttf"],
    "/**/twitter-image*": ["./src/lib/og-fonts/*.ttf"],
  },
  images: {
    // Some .png files in public are SVG payloads, so allow Image optimization to accept them.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

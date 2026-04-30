import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // /ja プレフィックスで既存ルートと同じ内容を返す（i18n ルーティングの足場）
      { source: "/ja", destination: "/" },
      { source: "/ja/:path*", destination: "/:path*" },
    ];
  },
  images: {
    // public 内の .png が実体は SVG のため Image 最適化で拒否されないようにする
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

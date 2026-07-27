import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wood Journal articles are read from disk at runtime (lib/woodArticles.ts);
  // make sure the JSON files ship inside the serverless bundle.
  outputFileTracingIncludes: {
    "/wood-library": ["./content/wood-articles/**/*"],
    "/wood-library/[slug]": ["./content/wood-articles/**/*"],
    "/sitemap.xml": ["./content/wood-articles/**/*"],
  },
  // Client build portals are now dynamic, Firebase-backed routes
  // (app/live/[slug]/page.tsx) — no static-file rewrite needed.
  async rewrites() {
    // NAWAH client preview — standalone static page in public/showcase/
    return [{ source: "/showcase", destination: "/showcase/index.html" }];
  },
};

export default nextConfig;

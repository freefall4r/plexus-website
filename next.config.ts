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
    // Standalone static pages under public/showcase/.
    // /showcase itself is the app-router gallery (app/showcase/page.tsx).
    return [
      // NAWAH standalone presentation
      { source: "/showcase/nawah", destination: "/showcase/nawah/index.html" },
      // Guest Tree (Ines wedding guestbook) preview
      { source: "/showcase/tree", destination: "/showcase/tree/index.html" },
    ];
  },
};

export default nextConfig;

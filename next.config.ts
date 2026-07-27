import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client build portals are now dynamic, Firebase-backed routes
  // (app/live/[slug]/page.tsx) — no static-file rewrite needed.
  async rewrites() {
    // NAWAH client preview — standalone static page in public/showcase/
    return [{ source: "/showcase", destination: "/showcase/index.html" }];
  },
};

export default nextConfig;

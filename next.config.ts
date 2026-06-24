import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Client build portals are now dynamic, Firebase-backed routes
  // (app/live/[slug]/page.tsx) — no static-file rewrite needed.
};

export default nextConfig;

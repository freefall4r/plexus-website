import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve the static client build portals at a clean URL:
  //   /live/<slug>  ->  /live/<slug>/index.html
  // The /live route itself (the showcase page) has no extra segment, so it's
  // untouched; asset requests (/live/<slug>/img/...) have 3+ segments, also untouched.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/live/:slug", destination: "/live/:slug/index.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;

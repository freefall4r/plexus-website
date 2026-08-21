import type { MetadataRoute } from "next";
import { site } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio", // Sanity CMS dashboard
        "/api/", // backend routes
        "/plexusadmin", // owner area
        "/chub", // workshop hub (Layth's job board)
        "/checkout", // cart step, nothing to index
        "/partner/", // private partnership documents, link-shared only
        "/live/", // passcode-gated client build portals (/live itself stays public)
        "/fabrication/track/", // per-order tracking tokens
      ],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

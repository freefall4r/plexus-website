import type { MetadataRoute } from "next";
import { site } from "@/lib/config";
import { getCatalogue } from "@/lib/catalogue";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "", priority: 1 },
    { path: "/shop", priority: 0.9 },
    { path: "/custom", priority: 0.8 },
    { path: "/partnerships", priority: 0.8 },
    { path: "/live", priority: 0.7 },
    { path: "/about", priority: 0.7 },
  ].map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));

  let products: MetadataRoute.Sitemap = [];
  try {
    const items = await getCatalogue();
    products = items.map((p) => ({
      url: `${site.url}/shop/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {
    // Catalogue unavailable at build time — still emit the static routes.
  }

  return [...staticRoutes, ...products];
}

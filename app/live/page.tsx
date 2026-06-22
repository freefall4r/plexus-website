import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { LiveBuilds, type LiveBuild } from "@/components/live/LiveBuilds";

export const metadata: Metadata = {
  title: "Live Builds — watch your piece being made",
  description:
    "A private, real-time window into your commission. Plexus Workshop clients follow their custom piece being made in Amman — stage by stage, from 3D design to delivery.",
  alternates: { canonical: "/live" },
};

// Read the public-safe build manifests that the Plexus Live generator copies
// into public/live/<slug>/meta.json. Client names live only inside the gated
// portals, never here.
function getBuilds(): LiveBuild[] {
  const dir = path.join(process.cwd(), "public", "live");
  let slugs: string[] = [];
  try {
    slugs = fs
      .readdirSync(dir)
      .filter((s) => fs.existsSync(path.join(dir, s, "meta.json")));
  } catch {
    return [];
  }
  const builds = slugs.map((slug) => {
    const m = JSON.parse(
      fs.readFileSync(path.join(dir, slug, "meta.json"), "utf8")
    );
    return {
      slug: m.slug || slug,
      title: m.title || slug,
      location: m.location || "",
      pct: typeof m.pct === "number" ? m.pct : 0,
      now: m.now || "",
      nowProgress: m.nowProgress || "",
      hero: m.hero ? `/live/${slug}/${m.hero}` : null,
      accent: m.accent || "#9c5b2c",
      updated: m.updated || "",
    } as LiveBuild;
  });
  builds.sort((a, b) => b.pct - a.pct);
  return builds;
}

export default function Page() {
  return <LiveBuilds builds={getBuilds()} />;
}

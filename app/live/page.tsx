import type { Metadata } from "next";
import { LiveBuilds } from "@/components/live/LiveBuilds";
import { getPublicBuilds } from "@/lib/live/store";

export const metadata: Metadata = {
  title: "Live Builds — watch your piece being made",
  description:
    "A private, real-time window into your commission. Plexus Workshop clients follow their custom piece being made in Amman — stage by stage, from 3D design to delivery.",
  alternates: { canonical: "/live" },
};

// Pull builds from Firebase when configured; otherwise the store falls back to
// the legacy public/live/<slug>/meta.json files so the page never goes blank.
// Re-fetch often so phone edits in /plexusadmin appear here without a redeploy.
export const revalidate = 30;

export default async function Page() {
  const builds = await getPublicBuilds();
  return <LiveBuilds builds={builds} />;
}

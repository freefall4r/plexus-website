import type { Metadata } from "next";
import { PortalGate } from "@/components/live/PortalGate";

export const metadata: Metadata = {
  title: "Your build — Plexus Workshop",
  robots: { index: false, follow: false }, // private client portals are never indexed
};

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PortalGate slug={slug} />;
}

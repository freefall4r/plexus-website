import type { Metadata } from "next";
import { TrackStatus, TrackNotFound } from "@/components/fabrication/TrackStatus";
import { getOrderByToken } from "@/lib/fabrication/store";

// Private status link — never index, and always read fresh.
export const metadata: Metadata = {
  title: "Order status — Plexus Workshop",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const order = await getOrderByToken(token);
  if (!order) return <TrackNotFound />;
  return <TrackStatus order={order} />;
}

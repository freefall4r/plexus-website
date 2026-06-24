// ── On-Demand Fabrication — new-order WhatsApp ping ──
// Best-effort notification to anahata when an order lands. Uses the Meta
// WhatsApp Cloud API (same Meta path as Content Studio's IG auto-posting).
// If the WhatsApp env vars are absent it simply no-ops — the order still saves
// to Firestore and shows up in /plexusadmin. Never throws (never blocks an order).

import "server-only";
import { site } from "@/lib/config";
import type { FabricationOrder } from "./types";

const GRAPH_VERSION = "v21.0";

export function whatsappConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_PHONE_NUMBER_ID &&
      process.env.WHATSAPP_ACCESS_TOKEN &&
      process.env.WHATSAPP_NOTIFY_TO
  );
}

export async function notifyNewOrder(
  order: FabricationOrder,
  token: string
): Promise<boolean> {
  if (!whatsappConfigured()) return false;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
  const to = process.env.WHATSAPP_NOTIFY_TO!;

  const body = [
    "🆕 New fabrication order",
    `Service: ${order.service.toUpperCase()}`,
    `From: ${order.source === "template" ? `template (${order.templateId})` : "custom upload"}`,
    `Material: ${order.specs.material} · ${order.specs.thickness}`,
    `Qty: ${order.specs.quantity}`,
    `Files: ${order.files.length}`,
    `Contact: ${order.contact.name} · ${order.contact.whatsapp || order.contact.email}`,
    `Open: ${site.url}/plexusadmin`,
    `Track: ${site.url}/fabrication/track/${token}`,
  ].join("\n");

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body },
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

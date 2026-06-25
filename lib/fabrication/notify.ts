// ── On-Demand Fabrication — new-order WhatsApp ping ──
// Best-effort notification to anahata when an order lands, via CallMeBot (a free
// service that WhatsApps your OWN number). If the env vars are absent it no-ops —
// the order still saves to Firestore and shows in /plexusadmin. Never throws.
//
// Setup: message CallMeBot once from your WhatsApp to get an API key, then set
//   CALLMEBOT_APIKEY  +  WHATSAPP_NOTIFY_TO  (your number, digits incl. country code)
//
// Privacy: the ping deliberately carries NO customer name/contact — just the
// service/material/qty and the admin + tracking links — so customer data isn't
// routed through the third-party notifier.

import "server-only";
import { site } from "@/lib/config";
import type { FabricationOrder } from "./types";

export function whatsappConfigured(): boolean {
  return Boolean(process.env.CALLMEBOT_APIKEY && process.env.WHATSAPP_NOTIFY_TO);
}

export async function notifyNewOrder(
  order: FabricationOrder,
  token: string
): Promise<boolean> {
  if (!whatsappConfigured()) return false;
  const raw = process.env.WHATSAPP_NOTIFY_TO!;
  const phone = raw.startsWith("+") ? raw : `+${raw}`;
  const apikey = process.env.CALLMEBOT_APIKEY!;

  const text = [
    "🆕 New fabrication order",
    `${order.service.toUpperCase()} · ${order.specs.material || "?"}${order.specs.thickness ? ` ${order.specs.thickness}` : ""} · x${order.specs.quantity}`,
    `Admin: ${site.url}/plexusadmin`,
    `Track: ${site.url}/fabrication/track/${token}`,
  ].join("\n");

  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;

  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

// Which products are READY-TO-SHIP (in stock) vs made-to-order.
// In-stock items ship fast; made-to-order items take ~2–4 weeks (a deposit is
// arranged on WhatsApp). For now we hard-set the copper cups; later this can be
// driven by an "in-stock" tag in Sanity (like the "sold" tag).
export const IN_STOCK_SLUGS = new Set<string>([
  "smooth-copper-cup",
  "hammered-copper-cup",
]);

export function isInStock(slug?: string): boolean {
  return !!slug && IN_STOCK_SLUGS.has(slug);
}

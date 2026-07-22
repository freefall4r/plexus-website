// ── /plexusadmin/desk — The Desk (PLEXUS WIRED Phase 1, 2026-07-22) ──
// Server-assembled, admin-gated, read-only. New route: deliberately additive —
// it imports the existing stores and touches none of the parallel session's
// admin files. Margin guard: any non-paid document linked to a C Hub order is
// checked against Layth's priceJOD (his price is Plexus's COST) — a client
// price below cost gets a red warning (the Hekayat lesson).

import { redirect } from "next/navigation";
import { isLoggedIn } from "@/lib/admin/auth";
import { getAllDocs } from "@/lib/docs/store";
import { grandTotal, type BizDoc } from "@/lib/docs/types";
import { listChubOrders } from "@/lib/chub/store";
import { getAllProjects } from "@/lib/live/store";
import {
  DeskView,
  type DeskData,
  type DeskDoc,
  type DeskDeadline,
} from "@/components/desk/DeskView";

export const dynamic = "force-dynamic";
export const metadata = { title: "The Desk · Plexus", robots: { index: false, follow: false } };

// register-doc.mjs may attach these beyond the BizDoc shape
type LedgerDoc = BizDoc & { chubOrderId?: string; deadline?: string; sourcePdf?: string };

export default async function DeskPage() {
  if (!(await isLoggedIn())) redirect("/plexusadmin");

  const [docs, orders, projects] = await Promise.all([
    getAllDocs() as Promise<LedgerDoc[]>,
    listChubOrders().catch(() => []),
    getAllProjects().catch(() => []),
  ]);

  // register-doc entries may reference an order by its 8-char short id
  const orderById = new Map<string, (typeof orders)[number]>();
  for (const o of orders) {
    orderById.set(o.id, o);
    orderById.set(o.id.slice(0, 8), o);
  }

  const toDesk = (d: LedgerDoc): DeskDoc => {
    const total = grandTotal(d);
    let warning: string | undefined;
    if (d.chubOrderId && d.status !== "paid") {
      const o = orderById.get(d.chubOrderId);
      if (o?.priceJOD != null && total < o.priceJOD) {
        warning = `below C Hub cost (JD ${o.priceJOD})`;
      }
    }
    return {
      number: d.number,
      type: d.type,
      status: d.status,
      clientName: d.clientName,
      date: d.date || "",
      what: d.items?.[0]?.desc?.slice(0, 80) || "",
      total,
      linkedBuild: d.linkedBuild || undefined,
      warning,
    };
  };

  const byDate = (a: DeskDoc, b: DeskDoc) => (b.date || "").localeCompare(a.date || "");
  const paidDocs = docs.filter((d) => d.status === "paid").map(toDesk).sort(byDate);
  const sentDocs = docs.filter((d) => d.status === "sent").map(toDesk).sort(byDate);
  const draftDocs = docs.filter((d) => d.status === "draft").map(toDesk).sort(byDate);

  const today = new Date();
  const days = (iso: string) =>
    Math.ceil((new Date(iso + "T23:59:59").getTime() - today.getTime()) / 86400000);

  const deadlines: DeskDeadline[] = [];
  for (const d of docs) {
    if (d.deadline && d.status !== "paid") {
      deadlines.push({
        label: `${d.clientName} — ${d.items?.[0]?.desc?.slice(0, 60) || d.number}`,
        date: d.deadline,
        daysLeft: days(d.deadline),
        source: d.number,
      });
    }
  }
  for (const o of orders) {
    if (o.deadline) {
      deadlines.push({
        label: `${o.clientName || "C Hub job"}${o.urgent ? " (urgent)" : ""}`,
        date: o.deadline,
        daysLeft: days(o.deadline),
        source: `C Hub · ${o.jobCode}`,
      });
    }
  }
  deadlines.sort((a, b) => a.daysLeft - b.daysLeft);

  const data: DeskData = {
    collected: docs.filter((d) => d.status === "paid").reduce((s, d) => s + grandTotal(d), 0),
    openOffers: docs.filter((d) => d.status === "sent").reduce((s, d) => s + grandTotal(d), 0),
    drafts: docs.filter((d) => d.status === "draft").reduce((s, d) => s + grandTotal(d), 0),
    deadlines,
    paidDocs,
    sentDocs,
    draftDocs,
    jobs: orders.map((o) => ({
      id: o.id,
      clientName: o.clientName || "",
      jobCode: o.jobCode,
      complexity: o.complexity,
      urgent: !!o.urgent,
      deadline: o.deadline,
      suggestedPriceJOD: o.suggestedPriceJOD,
      priceJOD: o.priceJOD,
      offerNumber: o.offer?.number,
      offerPrice: o.offer?.priceJOD,
      marginPct: o.offer?.marginPct,
      invoiceNumber: o.invoice?.number,
      laythNotes: o.laythNotes || undefined,
    })),
    portals: projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      clientName: p.clientName || "",
      pct: p.pct ?? 0,
      now: p.now || "",
    })),
    generatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
  };

  return <DeskView data={data} />;
}

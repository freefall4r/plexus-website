import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderWizard } from "@/components/fabrication/OrderWizard";
import { getFabricationTemplates } from "@/lib/fabrication/sanity";

export const metadata: Metadata = {
  title: "Start a fabrication order — Plexus Workshop",
  description:
    "Choose CNC or laser, upload your files or pick a ready design, set material and quantity, and get a quote from a workshop engineer.",
  alternates: { canonical: "/fabrication/order" },
};

export const revalidate = 60;

export default async function Page() {
  const templates = await getFabricationTemplates();
  return (
    <Suspense
      fallback={
        <main className="grain min-h-screen bg-bone">
          <div className="mx-auto max-w-2xl px-5 pt-40" />
        </main>
      }
    >
      <OrderWizard templates={templates} />
    </Suspense>
  );
}

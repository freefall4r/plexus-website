import type { Metadata } from "next";
import { FabricationLanding } from "@/components/fabrication/FabricationLanding";
import {
  getFabricationExamples,
  getFabricationTemplates,
} from "@/lib/fabrication/sanity";

export const metadata: Metadata = {
  title: "On-Demand CNC & Laser Cutting — Plexus Workshop",
  description:
    "Send your design or pick a ready one — get it CNC-routed or laser-cut in Amman. Upload files, an engineer quotes you, we make it. No minimums to start.",
  alternates: { canonical: "/fabrication" },
};

// Content comes from Sanity; the page renders fine (empty gallery) before any
// examples are added.
export const revalidate = 60;

export default async function Page() {
  const [examples, templates] = await Promise.all([
    getFabricationExamples(),
    getFabricationTemplates(),
  ]);
  return <FabricationLanding examples={examples} templates={templates} />;
}

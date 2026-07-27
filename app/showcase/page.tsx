import type { Metadata } from "next";
import { ShowcaseGallery } from "@/components/showcase/ShowcaseGallery";

export const metadata: Metadata = {
  title: "The Showcase — Selected Works | Plexus Workshop",
  description:
    "One-off pieces and commissions from Plexus Workshop in Amman — a reading pod of nested birch rings, a backlit Alhambra mashrabiya light, a carved lion-head cane, a wedding guest tree in solid beech, and a solid oak dining table.",
  alternates: { canonical: "/showcase" },
};

export default function ShowcasePage() {
  return <ShowcaseGallery />;
}

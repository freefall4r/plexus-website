import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "The Workshop",
  description:
    "Inside Plexus Workshop — a full fabrication workshop in Amman, Jordan: hand joinery, laser cutting & engraving, CNC, 3D printing, leather, sewing, milling, metal forming and granite/stone. Custom furniture, shelving, prototyping, white-label production and restoration.",
};

export default function Page() {
  return <AboutPage />;
}

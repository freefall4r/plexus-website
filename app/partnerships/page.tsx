import type { Metadata } from "next";
import { BrandPartnerships } from "@/components/partnerships/BrandPartnerships";

export const metadata: Metadata = {
  title: "Brand Partnerships",
  description:
    "White-label and custom wood production from Plexus Workshop in Amman — we design, prototype and craft branded wood products for cafés, hotels, retailers and corporate gifts, made under your own brand.",
  alternates: { canonical: "/partnerships" },
};

export default function Page() {
  return <BrandPartnerships />;
}

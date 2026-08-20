import type { Metadata } from "next";
import { WoodSchoolPage } from "@/components/woodschool/WoodSchoolPage";

export const metadata: Metadata = {
  title: "Wood School — two days in the workshop",
  description:
    "A two-day woodworking course in Amman for makers, artists and complete beginners. Learn the species, what wood costs and how to buy it, choose joints and finishes, and build a solid hardwood wall unit you take home. Taught by a timber engineer inside a working production workshop. Seven seats.",
};

export default function Page() {
  return <WoodSchoolPage />;
}

import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "The Workshop",
  description:
    "Inside PLEXUS AMMAN — a woodworking workshop in Amman, Jordan crafting custom furniture and objects in solid wood.",
};

export default function Page() {
  return <AboutPage />;
}

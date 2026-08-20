import type { Metadata } from "next";
import { CohortPage } from "@/components/woodschool/CohortPage";

export const metadata: Metadata = {
  title: "Wood School — Cohort 01",
  // Private-ish page for enrolled students: keep it out of search results.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CohortPage />;
}

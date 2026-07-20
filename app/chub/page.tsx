import type { Metadata } from "next";
import { ChubApp } from "@/components/chub/ChubApp";

export const metadata: Metadata = {
  title: "C Hub — job sheet",
  robots: { index: false, follow: false }, // internal tool, never indexed
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <ChubApp />;
}

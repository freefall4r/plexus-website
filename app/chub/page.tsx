import type { Metadata } from "next";
import { ChubApp } from "@/components/chub/ChubApp";

export const metadata: Metadata = {
  title: "C Hub — job sheet",
  robots: { index: false, follow: false }, // internal tool, never indexed
  manifest: "/chub.webmanifest",
  icons: { apple: "/chub-icon-192.png" },
  // iOS treats these as the install hints for Add to Home Screen — without
  // them the installed app keeps Safari chrome and push stays unavailable.
  appleWebApp: { capable: true, title: "C Hub", statusBarStyle: "default" },
};

export const dynamic = "force-dynamic";

export default function Page() {
  return <ChubApp />;
}

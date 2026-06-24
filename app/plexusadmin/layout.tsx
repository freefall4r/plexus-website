import type { Metadata, Viewport } from "next";
import { SWRegister } from "@/components/admin/SWRegister";

export const metadata: Metadata = {
  title: "Plexus Admin",
  manifest: "/plexus-admin.webmanifest",
  robots: { index: false, follow: false },
  appleWebApp: {
    capable: true,
    title: "Plexus Admin",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/admin-icon-192.png",
    apple: "/admin-icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SWRegister />
    </>
  );
}

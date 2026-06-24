import type { Metadata } from "next";
import { isLoggedIn } from "@/lib/admin/auth";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { getAllProjects } from "@/lib/live/store";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Plexus Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const authed = await isLoggedIn();
  if (!authed) return <AdminLogin />;
  const configured = isFirebaseConfigured();
  const projects = configured ? await getAllProjects() : [];
  return <AdminApp initialProjects={projects} firebaseReady={configured} />;
}

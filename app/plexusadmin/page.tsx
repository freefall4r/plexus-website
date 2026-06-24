import type { Metadata } from "next";
import { isLoggedIn } from "@/lib/admin/auth";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { getAllProjects } from "@/lib/live/store";
import { getAllDocs } from "@/lib/docs/store";
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
  const [projects, documents] = configured
    ? await Promise.all([getAllProjects(), getAllDocs()])
    : [[], []];
  return (
    <AdminApp initialProjects={projects} initialDocs={documents} firebaseReady={configured} />
  );
}

import type { Metadata, Viewport } from "next";
import { isLoggedIn } from "@/lib/admin/auth";
import { getDoc } from "@/lib/docs/store";
import { DocumentSheet, DOC_CSS } from "@/components/docs/DocumentSheet";
import { PrintBar } from "@/components/docs/PrintBar";
import { DOC_LABEL } from "@/lib/docs/types";

export const metadata: Metadata = { robots: { index: false, follow: false } };
// Render the A4 page fit-to-width on phones; print stays true A4.
export const viewport: Viewport = { width: 794 };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!(await isLoggedIn())) {
    return <Center>Please log in to /plexusadmin first.</Center>;
  }
  const doc = await getDoc(id);
  if (!doc) return <Center>Document not found.</Center>;

  return (
    <>
      <style>{DOC_CSS}</style>
      <PrintBar clientPhone={doc.clientPhone} number={doc.number} label={DOC_LABEL[doc.type]} />
      <DocumentSheet doc={doc} />
    </>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#bbb",
        fontFamily: "system-ui",
        padding: 24,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

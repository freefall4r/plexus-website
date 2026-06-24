import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isLoggedIn } from "@/lib/admin/auth";
import { bucket, isFirebaseConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Accepts a multipart form-data photo from the phone, stores it in Firebase
// Storage under live/<slug>/, and returns a public URL to save on the project.
export async function POST(req: Request) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const file = form.get("file");
  const slug = (form.get("slug") || "misc").toString();
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > 12_000_000) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const objectPath = `live/${slug}/${randomUUID()}.${ext}`;
  const token = randomUUID();
  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const obj = bucket().file(objectPath);
    await obj.save(buf, {
      contentType: file.type || "image/jpeg",
      metadata: { metadata: { firebaseStorageDownloadTokens: token } },
    });
    const bucketName = bucket().name;
    const url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
      objectPath
    )}?alt=media&token=${token}`;
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    return NextResponse.json({ error: "upload_failed", detail: String(e) }, { status: 500 });
  }
}

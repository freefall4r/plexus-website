import { NextResponse } from "next/server";
import { isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidChubPasscode, CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";
import { createChubUploadSlot, finalizeChubUpload } from "@/lib/chub/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Never streams file bytes — only ever exchanges small JSON. The actual file
// bytes go straight from the browser to Google Cloud Storage via the signed
// URLs this route hands out, bypassing the Vercel serverless function body
// cap (~4.5 MB) that broke uploads of real phone photos / 3D files.
const MAX_FILE_BYTES = 500_000_000; // 500 MB per file — GCS's own ceiling, not Vercel's
const MAX_FILES = 20;

// Order ids are client-generated UUIDs (crypto.randomUUID()) so the browser
// can request upload slots before the order doc exists. Loosely validated —
// this is a trusted 2-person tool, not a public surface — just enough to keep
// the storage path sane.
const ID_RE = /^[a-zA-Z0-9-]{8,64}$/;

function checkAuth(req: Request): boolean {
  return isValidChubPasscode(req.headers.get(CHUB_PASSCODE_HEADER));
}

type SignBody = {
  orderId?: string;
  files?: { name?: string; type?: string; size?: number }[];
};

// POST /api/chub/uploads — request signed PUT URLs for one or more files.
export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let body: SignBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const orderId = (body.orderId || "").toString();
  if (!ID_RE.test(orderId)) {
    return NextResponse.json({ error: "bad_order_id" }, { status: 400 });
  }
  const files = Array.isArray(body.files) ? body.files : [];
  if (files.length === 0 || files.length > MAX_FILES) {
    return NextResponse.json({ error: "bad_file_count" }, { status: 400 });
  }
  for (const f of files) {
    if (typeof f.size === "number" && f.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "file_too_large", detail: f.name }, { status: 413 });
    }
  }

  try {
    const uploads = await Promise.all(
      files.map((f) =>
        createChubUploadSlot(orderId, (f.name || "file").toString(), (f.type || "").toString())
      )
    );
    return NextResponse.json({ uploads });
  } catch (e) {
    return NextResponse.json({ error: "sign_failed", detail: String(e) }, { status: 500 });
  }
}

type FinalizeBody = {
  files?: { objectPath?: string; token?: string; name?: string; sizeKB?: number; type?: string }[];
};

// PATCH /api/chub/uploads — after the browser's direct PUTs succeed, stamp
// each object with its download token (tiny metadata write, no bytes) and
// return the finished download URLs to attach to the order.
export async function PATCH(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!isFirebaseConfigured()) {
    return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  }

  let body: FinalizeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  const items = Array.isArray(body.files) ? body.files : [];
  if (items.length === 0) {
    return NextResponse.json({ error: "no_files" }, { status: 400 });
  }

  const files = [];
  const failed: string[] = [];
  for (const item of items) {
    const objectPath = (item.objectPath || "").toString();
    const token = (item.token || "").toString();
    const name = (item.name || "file").toString();
    // Every object we finalize must live under chub/ — this route only ever
    // stamps metadata on paths our own sign step handed out.
    if (!objectPath.startsWith("chub/") || !token) {
      failed.push(name);
      continue;
    }
    try {
      files.push(
        await finalizeChubUpload(
          objectPath,
          token,
          name,
          Number(item.sizeKB) || 0,
          (item.type || "").toString()
        )
      );
    } catch {
      failed.push(name);
    }
  }

  return NextResponse.json({ files, failed });
}

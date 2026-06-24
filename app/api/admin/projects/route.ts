import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin/auth";
import { getAllProjects, saveProject } from "@/lib/live/store";
import type { Project } from "@/lib/live/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function guard() {
  return (await isLoggedIn()) ? null : NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

export async function GET() {
  const blocked = await guard();
  if (blocked) return blocked;
  try {
    return NextResponse.json({ projects: await getAllProjects() });
  } catch (e) {
    return NextResponse.json({ error: "read_failed", detail: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const blocked = await guard();
  if (blocked) return blocked;
  let body: Partial<Project>;
  try {
    body = (await req.json()) as Partial<Project>;
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  if (!body.slug || !body.title) {
    return NextResponse.json({ error: "slug_and_title_required" }, { status: 400 });
  }
  const now = new Date().toISOString();
  const project: Project = {
    slug: body.slug,
    title: body.title,
    clientName: body.clientName || "",
    location: body.location || "",
    pct: clampPct(body.pct),
    now: body.now || "",
    nowProgress: body.nowProgress || "",
    accent: body.accent || "#9c5b2c",
    heroUrl: body.heroUrl ?? null,
    visible: body.visible ?? false,
    passcode: body.passcode || "",
    stages: body.stages || [],
    messages: body.messages || [],
    createdAt: body.createdAt || now,
    updatedAt: now,
  };
  try {
    await saveProject(project);
    return NextResponse.json({ ok: true, project });
  } catch (e) {
    return NextResponse.json({ error: "save_failed", detail: String(e) }, { status: 500 });
  }
}

function clampPct(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin/auth";
import { deleteProject, getProject } from "@/lib/live/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  const project = await getProject(slug);
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  try {
    await deleteProject(slug);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "delete_failed", detail: String(e) }, { status: 500 });
  }
}

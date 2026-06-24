import { NextResponse } from "next/server";
import { isLoggedIn } from "@/lib/admin/auth";
import { getDoc, deleteDoc } from "@/lib/docs/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const document = await getDoc(id);
  if (!document) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ document });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isLoggedIn())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  try {
    await deleteDoc(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "delete_failed", detail: String(e) }, { status: 500 });
  }
}

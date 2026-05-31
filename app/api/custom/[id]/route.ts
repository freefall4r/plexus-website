import { NextResponse } from "next/server";
import { getTask } from "@/lib/meshy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  try {
    const task = await getTask(id);
    const glb = task.model_urls?.glb;
    const usdz = task.model_urls?.usdz;
    return NextResponse.json({
      id: task.id,
      status: task.status,
      progress: task.progress ?? 0,
      // GLB through our same-origin proxy (CORS + expiry safety) for the WebGL viewer
      glb: glb ? `/api/custom/proxy?url=${encodeURIComponent(glb)}` : null,
      // USDZ direct — iOS AR Quick Look hands off natively (no CORS), needs the real URL
      usdz: usdz ?? null,
      thumbnail: task.thumbnail_url ?? null,
      error: task.task_error?.message ?? null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: "meshy_error", message }, { status: 502 });
  }
}

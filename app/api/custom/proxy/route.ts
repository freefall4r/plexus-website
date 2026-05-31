import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stream a Meshy-hosted asset through our own origin so the WebGL loader
// never hits CORS and the (expiring) signed URL stays server-side.
const ALLOWED_HOSTS = [
  "assets.meshy.ai",
  "meshy.ai",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) return NextResponse.json({ error: "missing_url" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "bad_url" }, { status: 400 });
  }
  const host = parsed.hostname;
  const allowed =
    ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`)) ||
    host.includes("meshy");
  if (parsed.protocol !== "https:" || !allowed) {
    return NextResponse.json({ error: "forbidden_host" }, { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), { cache: "no-store" });
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "model/gltf-binary",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

import { NextResponse } from "next/server";
import { createImageTo3D } from "@/lib/meshy";
import { checkRate, clientKey } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const now = Date.now();
    const key = clientKey(req);
    const rate = checkRate(key, now);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "rate_limited", resetAt: rate.resetAt },
        { status: 429 }
      );
    }

    const body = (await req.json()) as { image?: string };
    const image = body.image;
    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "invalid_image" }, { status: 400 });
    }
    // ~8MB base64 ceiling
    if (image.length > 8_000_000) {
      return NextResponse.json({ error: "image_too_large" }, { status: 413 });
    }

    const id = await createImageTo3D(image);
    return NextResponse.json({ id, remaining: rate.remaining });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    return NextResponse.json({ error: "meshy_error", message }, { status: 502 });
  }
}

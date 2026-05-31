// Server-only Meshy.ai image-to-3D helpers. Never import from a client component.

const BASE = "https://api.meshy.ai/openapi/v1/image-to-3d";

export type MeshyStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELED"
  | "EXPIRED";

export type MeshyTask = {
  id: string;
  status: MeshyStatus;
  progress: number;
  model_urls?: {
    glb?: string;
    fbx?: string;
    obj?: string;
    usdz?: string;
  };
  thumbnail_url?: string;
  texture_urls?: { base_color?: string }[];
  task_error?: { message?: string };
};

function apiKey(): string {
  const key = process.env.MESHY_API_KEY;
  if (!key) throw new Error("MESHY_API_KEY is not configured");
  return key;
}

/** Kick off an image-to-3D task. `image` is a data URI (data:image/...;base64,...) or public URL. */
export async function createImageTo3D(image: string): Promise<string> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_url: image,
      enable_pbr: process.env.MESHY_ENABLE_PBR !== "false",
      should_remesh: true,
      should_texture: true,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Meshy create failed (${res.status}): ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as { result?: string };
  if (!data.result) throw new Error("Meshy create returned no task id");
  return data.result;
}

export async function getTask(id: string): Promise<MeshyTask> {
  const res = await fetch(`${BASE}/${id}`, {
    headers: { Authorization: `Bearer ${apiKey()}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Meshy status failed (${res.status}): ${text.slice(0, 200)}`);
  }
  return (await res.json()) as MeshyTask;
}

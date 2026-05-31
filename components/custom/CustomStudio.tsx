"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n/context";
import { brand, waLink, mailLink } from "@/lib/config";

const Model3D = dynamic(() => import("./Model3D").then((m) => m.Model3D), {
  ssr: false,
  loading: () => null,
});

type Phase = "idle" | "working" | "done" | "error" | "limit";

// Map Meshy progress to a friendly stage label key.
function stageKey(progress: number, status: string) {
  if (status === "PENDING") return "studio.stage.queued" as const;
  if (progress >= 99) return "studio.stage.done" as const;
  if (progress >= 50) return "studio.stage.texture" as const;
  return "studio.stage.shape" as const;
}

// Downscale an uploaded image to keep payloads small + fast.
function downscale(file: File, max = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function CustomStudio() {
  const { t, lang } = useLang();
  const [phase, setPhase] = useState<Phase>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("PENDING");
  const [glb, setGlb] = useState<string | null>(null);
  const [usdz, setUsdz] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  const poll = useCallback((id: string) => {
    const tick = async () => {
      try {
        const res = await fetch(`/api/custom/${id}`);
        const data = await res.json();
        setStatus(data.status);
        setProgress(Math.max(progressFloor(data.status), data.progress ?? 0));
        if (data.status === "SUCCEEDED" && data.glb) {
          setGlb(data.glb);
          setUsdz(data.usdz ?? null);
          setProgress(100);
          setPhase("done");
          return;
        }
        if (data.status === "FAILED" || data.status === "EXPIRED" || data.status === "CANCELED") {
          setPhase("error");
          return;
        }
        pollRef.current = setTimeout(tick, 3000);
      } catch {
        setPhase("error");
      }
    };
    tick();
  }, []);

  const start = useCallback(
    async (file: File) => {
      try {
        setPhase("working");
        setProgress(2);
        setStatus("PENDING");
        const dataUri = await downscale(file);
        setPreview(dataUri);
        const res = await fetch("/api/custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUri }),
        });
        if (res.status === 429) {
          setPhase("limit");
          return;
        }
        if (!res.ok) {
          setPhase("error");
          return;
        }
        const data = await res.json();
        poll(data.id);
      } catch {
        setPhase("error");
      }
    },
    [poll]
  );

  const onFile = (files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith("image/")) start(file);
  };

  const reset = () => {
    if (pollRef.current) clearTimeout(pollRef.current);
    setPhase("idle");
    setPreview(null);
    setGlb(null);
    setUsdz(null);
    setProgress(0);
  };

  const stage = t(stageKey(progress, status));
  const orderMsg =
    lang === "ar"
      ? `مرحبًا ${brand.name}، أنشأت تصميمًا ثلاثي الأبعاد في الاستوديو وأودّ صنعه.`
      : `Hi ${brand.name}, I generated a 3D piece in your studio and I'd like to have it made.`;

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {/* ---------- IDLE: dropzone ---------- */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
          >
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                onFile(e.dataTransfer.files);
              }}
              className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed text-center text-bone transition-colors ${
                dragOver ? "border-amber bg-amber/10" : "border-bone/20 bg-white/[0.03] hover:border-bone/40"
              }`}
              data-cursor="hover"
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onFile(e.target.files)}
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="mb-5 h-12 w-12 text-amber">
                <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" strokeLinecap="round" />
              </svg>
              <p className="px-6 font-display text-xl">{t("studio.drop")}</p>
              <p className="mt-2 px-6 text-sm text-bone/50">{t("studio.hint")}</p>
            </label>
          </motion.div>
        )}

        {/* ---------- WORKING: progress ---------- */}
        {phase === "working" && (
          <motion.div
            key="working"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-3xl bg-walnut-deep p-8 text-bone"
          >
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="mb-6 h-28 w-28 rounded-xl object-cover opacity-80 shadow-lg ring-1 ring-bone/20"
              />
            )}
            <p className="font-display text-2xl">{t("studio.generating")}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-amber">{stage}</p>

            <div className="mt-6 h-2 w-full max-w-sm overflow-hidden rounded-full bg-bone/15">
              <motion.div
                className="h-full rounded-full bg-amber"
                animate={{ width: `${Math.max(4, progress)}%` }}
                transition={{ ease: "easeOut", duration: 0.6 }}
              />
            </div>
            <p className="mt-3 font-mono text-sm text-bone/70">{Math.round(progress)}%</p>

            <div className="mt-6 flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-amber"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* ---------- DONE: viewer + order ---------- */}
        {phase === "done" && glb && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-5"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#2a1c10]">
              <Model3D glb={glb} usdz={usdz} alt="Your generated piece" />
              <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-walnut-deep/70 px-3 py-1 font-mono text-[11px] text-bone/80 backdrop-blur">
                {t("studio.drag")}
              </span>
            </div>

            <p className="flex items-center gap-2 px-1 text-sm text-bone/60">
              <span className="text-amber">◆</span>
              {t("studio.arHint")}
            </p>

            <div className="rounded-3xl border border-bone/10 bg-white/[0.04] p-6">
              <h3 className="font-display text-2xl text-bone">{t("studio.orderTitle")}</h3>
              <p className="mt-2 text-sm text-bone/60">{t("studio.orderBody")}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href={waLink(orderMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amber px-6 py-3 text-sm font-medium text-[#160e07] transition-transform hover:-translate-y-0.5"
                >
                  {t("cta.whatsapp")}
                </a>
                <a
                  href={mailLink(`${brand.name} — custom 3D piece`, orderMsg)}
                  className="rounded-full border border-bone/25 px-6 py-3 text-sm text-bone transition-colors hover:border-bone"
                >
                  {t("pd.email")}
                </a>
                <a
                  href={glb}
                  download="plexus-model.glb"
                  className="rounded-full border border-bone/25 px-6 py-3 text-sm text-bone transition-colors hover:border-bone"
                >
                  {t("studio.download")}
                </a>
                <button
                  onClick={reset}
                  data-cursor="hover"
                  className="rounded-full px-6 py-3 text-sm text-bone/60 transition-colors hover:text-bone"
                >
                  {t("studio.again")}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ---------- ERROR / LIMIT ---------- */}
        {(phase === "error" || phase === "limit") && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex aspect-[4/3] flex-col items-center justify-center rounded-3xl border border-bone/15 bg-white/[0.04] p-8 text-center"
          >
            <p className="max-w-sm text-bone/70">
              {phase === "limit" ? t("studio.limit") : t("studio.error")}
            </p>
            <div className="mt-6 flex gap-3">
              {phase === "limit" ? (
                <a
                  href={waLink(orderMsg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-amber px-6 py-3 text-sm font-medium text-[#160e07] transition-transform hover:-translate-y-0.5"
                >
                  {t("cta.whatsapp")}
                </a>
              ) : (
                <button
                  onClick={reset}
                  data-cursor="hover"
                  className="rounded-full bg-amber px-6 py-3 text-sm font-medium text-[#160e07] transition-transform hover:-translate-y-0.5"
                >
                  {t("studio.again")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function progressFloor(status: string) {
  switch (status) {
    case "PENDING":
      return 4;
    case "IN_PROGRESS":
      return 12;
    default:
      return 0;
  }
}

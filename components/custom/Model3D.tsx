"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n/context";

// Typed handle for the <model-viewer> custom element (no JSX intrinsic needed).
type MVProps = {
  src?: string;
  "ios-src"?: string;
  alt?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "ar-scale"?: string;
  "camera-controls"?: boolean;
  "auto-rotate"?: boolean;
  "auto-rotate-delay"?: number;
  "rotation-per-second"?: string;
  "shadow-intensity"?: string;
  "shadow-softness"?: string;
  exposure?: string;
  "environment-image"?: string;
  "interaction-prompt"?: string;
  "touch-action"?: string;
  style?: React.CSSProperties;
};
const ModelViewer = "model-viewer" as unknown as React.ForwardRefExoticComponent<
  MVProps & React.RefAttributes<HTMLElement>
>;

// model-viewer powers both the orbit preview AND native AR:
//  • Android → Scene Viewer   • iOS → AR Quick Look (uses the .usdz)
// It's loaded lazily, client-only, because it registers a custom element.
export function Model3D({
  glb,
  usdz,
  alt,
}: {
  glb: string;
  usdz?: string | null;
  alt: string;
}) {
  const { t, dir } = useLang();
  const [ready, setReady] = useState(false);
  const [canAR, setCanAR] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let mounted = true;
    import("@google/model-viewer").then(() => {
      if (mounted) setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // detect AR support once the element is upgraded
  useEffect(() => {
    if (!ready) return;
    const el = ref.current as (HTMLElement & { canActivateAR?: boolean }) | null;
    if (!el) return;
    const check = () => setCanAR(Boolean(el.canActivateAR));
    const id = window.setTimeout(check, 400);
    el.addEventListener("ar-status", check as EventListener);
    return () => {
      window.clearTimeout(id);
      el.removeEventListener("ar-status", check as EventListener);
    };
  }, [ready]);

  const enterAR = () => {
    const el = ref.current as (HTMLElement & { activateAR?: () => void }) | null;
    el?.activateAR?.();
  };

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#2a1c10]">
        <span className="font-mono text-xs text-bone/60">loading viewer…</span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <ModelViewer
        ref={ref}
        src={glb}
        ios-src={usdz ?? undefined}
        alt={alt}
        camera-controls
        auto-rotate
        auto-rotate-delay={600}
        rotation-per-second="22deg"
        shadow-intensity="1.1"
        shadow-softness="0.9"
        exposure="1.05"
        environment-image="neutral"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        touch-action="pan-y"
        interaction-prompt="none"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#2a1c10",
        }}
      />

      {/* our own AR button (mobile / AR-capable devices) */}
      <button
        onClick={enterAR}
        data-cursor="hover"
        dir={dir}
        className={`absolute bottom-3 ${
          dir === "rtl" ? "left-3" : "right-3"
        } inline-flex items-center gap-2 rounded-full bg-amber px-4 py-2 text-sm font-medium text-[#160e07] shadow-lg transition-transform hover:-translate-y-0.5 ${
          canAR ? "" : "hidden"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" strokeLinejoin="round" />
        </svg>
        {t("studio.ar")}
      </button>
    </div>
  );
}

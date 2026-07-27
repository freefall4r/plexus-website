"use client";

// ── Enable-notifications bell ──
// One small row under the Job Sheet header. Tapping it registers the
// service worker, asks the browser's permission, subscribes to Web Push
// with our VAPID key, and stores the subscription server-side
// (POST /api/chub/push). Tapping again while on unsubscribes.
//
// iPhone rule (Apple's, not ours): web push only works once the site is
// installed via Share → Add to Home Screen (iOS 16.4+). In a normal iOS
// Safari tab we show that hint instead of a broken button.

import { useCallback, useEffect, useState } from "react";
import { CHUB_PASSCODE_HEADER } from "@/lib/chub/auth";

const SW_URL = "/chub-sw.js";

// On www the app lives at /chub, but on chub.plexusworkshop.com the proxy
// serves the same page at "/" — and a service worker scoped to /chub can
// never control a page at /, so navigator.serviceWorker.ready would wait
// forever and the bell would hang on tap (the bug that ate Layth's first
// subscription attempt). Scope must match where the page actually is; on
// the chub subdomain "/" still only covers that origin, never the main site.
function swScope(): string {
  return window.location.pathname.startsWith("/chub") ? "/chub" : "/";
}

type BellState = "checking" | "unsupported" | "install-first" | "blocked" | "off" | "on" | "busy";

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

function isIosSafariTab(): boolean {
  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(ua) || (ua.includes("Mac") && "ontouchend" in document);
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;
  return isIos && !standalone;
}

export function PushBell({ pass }: { pass: string }) {
  const [state, setState] = useState<BellState>("checking");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState(isIosSafariTab() ? "install-first" : "unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("blocked");
      return;
    }
    navigator.serviceWorker
      .getRegistration(swScope())
      .then((reg) => reg?.pushManager.getSubscription() ?? null)
      .then((sub) => {
        if (sub) {
          // Re-save on every open. The bell's "on" only proves the PHONE
          // holds a subscription — the server record can be missing (save
          // failed once, or pruned after a dead-endpoint response) and the
          // device silently gets nothing. Doc id is a hash of the endpoint,
          // so re-posting the same device is an overwrite, never a duplicate.
          fetch("/api/chub/push", {
            method: "POST",
            headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
            body: JSON.stringify({ subscription: sub.toJSON() }),
          }).catch(() => null);
          setState("on");
        } else {
          setState("off");
        }
      })
      .catch(() => setState("off"));
  }, [pass]);

  const enable = useCallback(async () => {
    setState("busy");
    setNote("");
    try {
      const vapid = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapid) throw new Error("missing key");
      const reg = await navigator.serviceWorker.register(SW_URL, { scope: swScope() });
      await navigator.serviceWorker.ready;
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "blocked" : "off");
        return;
      }
      const sub =
        (await reg.pushManager.getSubscription()) ||
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapid) as BufferSource,
        }));
      const res = await fetch("/api/chub/push", {
        method: "POST",
        headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error(`save failed (${res.status})`);
      setState("on");
    } catch {
      setNote("Couldn't turn notifications on — try again.");
      setState("off");
    }
  }, [pass]);

  const disable = useCallback(async () => {
    setState("busy");
    setNote("");
    try {
      const reg = await navigator.serviceWorker.getRegistration(swScope());
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/chub/push", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", [CHUB_PASSCODE_HEADER]: pass },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => null);
        await sub.unsubscribe();
      }
      setState("off");
    } catch {
      setState("on");
    }
  }, [pass]);

  if (state === "checking" || state === "unsupported") return null;

  if (state === "install-first") {
    return (
      <p className="mt-3 text-xs text-ink-soft">
        🔔 For new-job alerts on iPhone: Share&nbsp;→&nbsp;<span className="font-medium text-ink">Add to Home Screen</span>, then open C&nbsp;Hub from that icon and turn notifications on.
      </p>
    );
  }

  if (state === "blocked") {
    return (
      <p className="mt-3 text-xs text-ink-soft">
        🔕 Notifications are blocked for this site — allow them in the browser settings, then reload.
      </p>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        disabled={state === "busy"}
        onClick={state === "on" ? disable : enable}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition active:scale-[0.98] disabled:opacity-50 ${
          state === "on"
            ? "border-amber/40 bg-amber/10 text-amber"
            : "border-ink/15 bg-white/50 text-ink-soft hover:border-amber/40"
        }`}
      >
        {state === "busy" ? "…" : state === "on" ? "🔔 New-job alerts on" : "🔔 Enable notifications"}
      </button>
      {note && <span className="text-xs text-red-500">{note}</span>}
    </div>
  );
}

"use client";

import { useEffect } from "react";

// Registers the admin service worker so /plexusadmin is installable as a PWA
// (Add to Home Screen) and shells load offline. Scoped to /plexusadmin only.
export function SWRegister() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/admin-sw.js", { scope: "/plexusadmin" })
      .catch(() => {
        /* SW is a progressive enhancement; ignore failures */
      });
  }, []);
  return null;
}

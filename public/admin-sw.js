// Plexus Admin service worker — makes /plexusadmin installable (PWA) and keeps
// a minimal offline shell. Admin data is always fetched network-first so the
// dashboard never shows stale projects when online.

const CACHE = "plexus-admin-v1";
const SHELL = ["/plexusadmin", "/admin-icon-192.png", "/admin-icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // never cache writes/uploads
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/plexusadmin") && !url.pathname.startsWith("/admin-icon")) {
    return; // only manage the admin's own scope
  }
  // network-first, fall back to cache (offline shell)
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(request).then((m) => m || caches.match("/plexusadmin")))
  );
});

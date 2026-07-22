// ── C Hub service worker ──
// Exists for two reasons: (1) receive Web Push messages in the background
// and show them as system notifications, (2) make C Hub installable as a
// home-screen app (iOS requires a registered service worker for that).
// No caching layer on purpose — C Hub is a live tool and must never serve
// a stale job list.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "C Hub", body: "Something happened on the job sheet.", url: "/chub" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    /* keep defaults */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/chub-icon-192.png",
      badge: "/chub-icon-192.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/chub";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const win of wins) {
        if (win.url.includes("/chub") && "focus" in win) return win.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});

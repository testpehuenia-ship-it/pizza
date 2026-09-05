// Service Worker para PWA 0600Boston con soporte completo para Notificaciones Push
const CACHE_NAME = "0600boston-v2";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Passthrough para Next.js con soporte offline básico en navegación
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});

// Evento Push recibido desde el servidor
self.addEventListener("push", (event) => {
  let data = {
    title: "0600Boston 🍕🍀",
    body: "¡Tenés una nueva oferta disponible en 0600Boston!",
    icon: "/images/brunoagradece.webp",
    url: "/menu",
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/images/brunoagradece.webp",
    badge: "/images/brunoagradece.webp",
    data: { url: data.url || "/menu" },
    vibrate: [200, 100, 200],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Clic en la Notificación: abre o enfoca la ventana de la App
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/menu";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(urlToOpen) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

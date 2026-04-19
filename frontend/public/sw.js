const CACHE = "warmcup-v1";
const SHELL = ["/", "/chat", "/wall", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Only handle GET requests for same-origin navigation or shell assets
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  // Pass through WebSocket upgrades and worker API calls
  if (url.hostname !== self.location.hostname) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache successful shell responses
        if (res.ok && SHELL.includes(url.pathname)) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() =>
        // Offline fallback — return cached shell or a minimal offline page
        caches.match(e.request).then((cached) =>
          cached ?? caches.match("/").then((root) =>
            root ?? new Response("You're offline. WarmCup will be here when you're back.", {
              headers: { "Content-Type": "text/html" },
            })
          )
        )
      )
  );
});

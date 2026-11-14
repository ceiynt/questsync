const CACHE_NAME = "questsync-v9";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./quests_db.js",
  "./quest_prereqs.js",
  "./equipment_db.js",
  "./recipes_db.js",
  "./material_sources.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/v1/")) return;

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

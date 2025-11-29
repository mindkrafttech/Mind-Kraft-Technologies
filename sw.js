const CACHE_NAME = "snake-offline-v1";
const FILES_TO_CACHE = [
  "/",            // your home page (optional)
  "/snake.html",  // snake game page
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return from cache if available, else go to network
      return response || fetch(event.request);
    })
  );
});

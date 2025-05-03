// ...existing code...
workbox.precaching.precacheAndRoute([
  { url: '/', revision: null },
  { url: '/index.html', revision: null },
  { url: '/icons/icon-192x192.png', revision: null },
  { url: '/icons/icon-512x512.png', revision: null },
]);
// ...existing code...
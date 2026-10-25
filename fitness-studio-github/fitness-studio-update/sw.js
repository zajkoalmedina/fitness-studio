/* Service worker: offline školjka aplikacije.
   Pri svakoj izmjeni fajlova povećaj broj verzije (CACHE) da se korisnicima osvježi keš. */
const CACHE = 'fitness-studio-v12';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'css/style.css',
  'js/config.js', 'js/config.cloud.js', 'js/cloud.js', 'js/util.js', 'js/data.js', 'js/data2.js', 'js/data3.js', 'js/data4.js', 'js/periodization.js', 'js/muscles.js', 'js/figure.js', 'js/store.js', 'js/views-public.js', 'js/views-client.js', 'js/views-trainer.js', 'js/views-nutrition.js', 'js/views-kond.js', 'js/chat.js', 'js/extras.js', 'js/app.js',
  'images/trener.jpg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // vanjski video (YouTube/Vimeo) ne keširamo
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; }).catch(() => hit);
      return hit || net;
    })
  );
});

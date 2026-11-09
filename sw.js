/* Service worker: offline školjka aplikacije.
   Pri svakoj izmjeni fajlova povećaj broj verzije (CACHE) da se korisnicima osvježi keš. */
const CACHE = 'fitness-studio-v197';
const ASSETS = [
  './', 'index.html', 'manifest.json', 'css/style.css', 'css/lux.css',
  'js/config.js', 'js/config.cloud.js', 'js/cloud.js', 'js/util.js', 'js/data.js', 'js/data2.js', 'js/data3.js', 'js/data4.js', 'js/data5.js', 'js/data6.js', 'js/data7.js', 'js/data8.js', 'js/data9.js', 'js/data10.js', 'js/data11.js', 'js/data12.js', 'js/data13.js', 'js/data14.js', 'js/data15.js', 'js/data16.js', 'js/data17.js','js/data18.js', 'js/data19.js', 'js/data20.js', 'js/data21.js', 'js/data23.js', 'js/data22.js', 'js/data24.js', 'js/data25.js', 'js/ocisti.js', 'js/jelovnik-auto.js', 'js/alergije.js', 'js/dnevnik.js', 'js/trcanje.js', 'js/trcanje2.js', 'js/kupci.js', 'js/pregled.js', 'js/perklijent.js', 'js/podsjetnik.js', 'js/obavijesti.js', 'js/zagrijavanje.js', 'js/hipertrofija.js', 'js/poruke.js', 'js/tehnika.js', 'js/receptfoto.js', 'js/periodization.js', 'js/muscles.js', 'js/figure.js', 'js/store.js', 'js/views-public.js', 'js/views-client.js', 'js/views-trainer.js', 'js/views-nutrition.js', 'js/savjeti.js', 'js/views-kond.js', 'js/kondsablon.js', 'js/termini.js', 'js/online.js', 'js/dodjela.js', 'js/chat.js', 'js/extras.js', 'js/app.js',
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
  if (url.origin !== location.origin) return;
  if (/\.(mp4|mov|webm)$/i.test(url.pathname)) return; // videi: bez keširanja, pregledač sam traži dijelove // vanjski video (YouTube/Vimeo) ne keširamo
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req, { cache: 'no-cache' }).then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put('index.html', cp)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(
    fetch(req, { cache: 'no-cache' }).then((r) => { if (r && r.ok) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return r; }).catch(() => caches.match(req))
  );
});

// sw.js - Service Worker para PWA
const CACHE_NAME = 'pyahu-v1';
const urlsToCache = [
  '/paraguay/index.html',
  '/paraguay/manifest.json',
  'printer-page-imagem/logo-imagen-01.png',
  'printer-page-imagem/body-fondo-imagen-01.png',
  'printer-page-imagem/titulo-pagina-imagen-01.png',
  'printer-page-imagem/footer-imagen-01.png',
  'printer-page-imagem/footer-imagen-02.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
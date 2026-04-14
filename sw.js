const CACHE_NAME = 'pyahu-pwa-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/paraguay/',
        '/paraguay/index.html',
        '/paraguay/manifest.json',
        '/paraguay/printer-page-imagem/logo-imagen-01.png',
        '/paraguay/printer-page-imagem/body-fondo-imagen-01.png',
        '/paraguay/printer-page-imagem/titulo-pagina-imagen-01.png',
        '/paraguay/printer-page-imagem/footer-imagen-01.png',
        '/paraguay/printer-page-imagem/footer-imagen-02.png'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

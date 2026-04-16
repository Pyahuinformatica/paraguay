const CACHE_NAME = 'pyahu-pwa-v2';

// Archivos a cachear
const urlsToCache = [
  '/paraguay/',
  '/paraguay/index.html',
  '/paraguay/manifest.json',
  '/paraguay/printer-page-imagem/logo-imagen-01.png',
  '/paraguay/printer-page-imagem/body-fondo-imagen-01.png',
  '/paraguay/printer-page-imagem/titulo-pagina-imagen-01.png',
  '/paraguay/printer-page-imagem/footer-imagen-01.png',
  '/paraguay/printer-page-imagem/footer-imagen-02.png'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación - limpiar caches viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Limpiando cache vieja:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - estrategia cache first
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(response => {
          // No cachear respuestas no exitosas
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});
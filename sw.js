// sw.js - Pyahu App con soporte OFFLINE
const CACHE_NAME = 'pyahu-offline-v1';

const ARCHIVOS_OFFLINE = [
  '/paraguay/index.html',
  '/paraguay/manifest.json',
  'printer-page-imagem/logo-imagen-01.png',
  'printer-page-imagem/body-fondo-imagen-01.png',
  'printer-page-imagem/titulo-pagina-imagen-01.png',
  'printer-page-imagem/footer-imagen-01.png',
  'printer-page-imagem/footer-imagen-02.png',
  'printer-page-imagem/imagen-extra-01.png',
  'printer-page-imagem/audio-01.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Instalación - Guarda todos los archivos en caché
self.addEventListener('install', evento => {
  console.log('📦 Instalando Pyahu App...');
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Archivos guardados en caché');
        return cache.addAll(ARCHIVOS_OFFLINE);
      })
      .catch(error => {
        console.log('❌ Error al guardar caché:', error);
      })
  );
  self.skipWaiting();
});

// Activación - Limpia cachés antiguas
self.addEventListener('activate', evento => {
  console.log('🚀 Pyahu App activada');
  evento.waitUntil(
    caches.keys().then(nombresCache => {
      return Promise.all(
        nombresCache.map(nombre => {
          if (nombre !== CACHE_NAME) {
            console.log('🗑️ Eliminando caché antigua:', nombre);
            return caches.delete(nombre);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia: Cache First (primero busca en caché, después en internet)
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request)
      .then(respuestaCache => {
        // Si está en caché, devuelve inmediatamente
        if (respuestaCache) {
          return respuestaCache;
        }
        
        // Si no está en caché, busca en internet
        return fetch(evento.request)
          .then(respuestaInternet => {
            // Si la respuesta es válida, la guarda en caché para próxima vez
            if (respuestaInternet && respuestaInternet.status === 200) {
              const copia = respuestaInternet.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(evento.request, copia);
              });
            }
            return respuestaInternet;
          })
          .catch(() => {
            // Si no hay internet y no está en caché
            if (evento.request.mode === 'navigate') {
              return caches.match('/paraguay/index.html');
            }
            return new Response('🔴 Sin conexión - Contenido no disponible offline', {
              status: 404,
              statusText: 'Offline'
            });
          });
      })
  );
});
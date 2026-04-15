const CACHE_NAME = 'pyahu-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/printer-page-imagem/body-fondo-imagen-01.png',
  '/printer-page-imagem/footer-imagen-01.png',
  '/printer-page-imagem/footer-imagen-02.png',
  '/printer-page-imagem/logo-imagen-01.png',
  '/printer-page-imagem/titulo-pagina-imagen-01.png',
  '/printer-page-imagem/audio-01.mp3'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aberto');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('[SW] Erro ao adicionar ao cache:', err))
  );
  self.skipWaiting();
});

// Ativação - limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições e serve do cache quando possível
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrado
        if (response) {
          return response;
        }
        
        // Clone da requisição para fazer fetch e cachear
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Verifica se é uma resposta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone da resposta para cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => {
        // Fallback para quando estiver offline
        return caches.match('/index.html');
      })
  );
});
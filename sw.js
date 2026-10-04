/**
 * Service Worker Oficial - Rangel Luxo Crochê PWA
 * Versão do Cache: v1.0.0
 * 
 * Estratégias:
 * 1. Network First (com fallback para cache e offline.html) para navegações HTML
 * 2. Stale-While-Revalidate / Cache First para assets estáticos (CSS, JS, imagens, fontes)
 * 3. Network Only para chamadas de API (Supabase), métodos não-GET e dados dinâmicos
 */

const CACHE_VERSION = 'rangel-luxo-v2';
const CACHE_STATIC_NAME = `static-${CACHE_VERSION}`;
const CACHE_DYNAMIC_NAME = `dynamic-${CACHE_VERSION}`;

// Recursos vitais pré-cacheados durante a instalação (App Shell)
const CORE_PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/produtos.json',
  '/css/style.css',
  '/js/main.js',
  '/js/supabase.js',
  '/manifest.json',
  '/assets/images/rangel-emblem.jpg',
  '/assets/images/sousplat-verde-celadon.jpg',
  '/assets/images/trilho-rosa-antigo.jpg',
  '/assets/images/sousplat-azul-marinho.jpg',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/maskable-icon-192.png',
  '/assets/icons/maskable-icon-512.png',
  '/assets/icons/apple-touch-icon.png',
  '/assets/icons/favicon-32x32.png',
  '/assets/icons/favicon-16x16.png'
];

// Instalação do Service Worker & Pre-caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then((cache) => {
        // Cache seguro dos assets core
        return cache.addAll(CORE_PRECACHE_ASSETS);
      })
      .then(() => {
        // Permite que o Service Worker assuma o controle imediatamente
        return self.skipWaiting();
      })
      .catch((err) => {
        console.warn('[PWA Service Worker] Falha no precache inicial:', err);
      })
  );
});

// Ativação e limpeza criteriosa de versões antigas do cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_STATIC_NAME && cacheName !== CACHE_DYNAMIC_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Assume controle de todas as abas abertas sem precisar de reload
        return self.clients.claim();
      })
  );
});

// Interceptação inteligente de requisições
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Ignorar métodos que não sejam GET (POST, PUT, DELETE, PATCH, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // 2. Ignorar esquemas que não sejam HTTP/HTTPS (como chrome-extension://, edge://)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 3. SEGURANÇA: Não interceptar chamadas ao backend Supabase ou endpoints com credenciais
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // 4. Estratégia NETWORK FIRST para Navegação / Páginas HTML
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Se obteve resposta válida da rede, atualiza o cache e retorna
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_DYNAMIC_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Se falhou (sem conexão), tenta responder do cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // Se a página não estiver no cache, entrega a página offline elegante
          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) {
            return offlinePage;
          }

          // Fallback mínimo se nem offline.html estiver disponível
          return new Response(
            '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>Offline - Rangel Luxo</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h1>Você está offline</h1><p>Por favor, verifique sua conexão com a internet para acessar o Atelier Rangel Luxo.</p></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 5. Estratégia CACHE FIRST COM STALE-WHILE-REVALIDATE para Assets Estáticos
  // (CSS, JS, Imagens, Fontes do Google, etc.)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.json')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Busca da rede em segundo plano para manter o cache atualizado
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_STATIC_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Em caso de falha de rede silenciosa para asset secundário, ignora
          });

        // Retorna o asset cacheado imediatamente (resposta instantânea) ou aguarda rede
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 6. Padrão para demais requisições GET: Network First
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Tratamento de mensagens externas (ex: atualização manual forçada)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

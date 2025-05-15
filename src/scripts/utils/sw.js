import { precacheAndRoute } from 'workbox-precaching'

import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST)

// Handle the 'install' event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
});

// Handle the 'activate' event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Claim clients to ensure the service worker takes control immediately
  event.waitUntil(self.clients.claim());
});


self.addEventListener('push', (event) => {
  let data = {
    title: 'Default Title',
    options: {
      body: 'You received a push but no data.',
    },
  };

  console.log(event.data)

  if (event.data) {
    try {
      const payload = event.data.json();
      data.title = payload.title || data.title;
      data.options = payload.options || data.options;
    } catch (e) {
      console.error('Push data parse error', e);
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, data.options)
  );
});



const fallbackOn500 = (strategy) => async (context) => {
  try {
    const cache = await caches.open(strategy.cacheName);

    const response = await fetch(context.request);


    if (response && (response.ok || response.type === 'opaque')) {
      cache.put(context.request, response.clone());
      return response
    };


    const cached = await cache.match(context.request);
    return cached || response;
  } catch (err) {
    console.log("Error : ", err)

    const cache = await caches.open(strategy.cacheName);
    const cached = await cache.match(context.request);
    
    return cached || new Response(JSON.stringify({
      status: "error",
      message: "Offline",
    }), { status: 503 });
  }
};

registerRoute(
  ({ url, request }) => {
    return url.origin === 'https://story-api.dicoding.dev' || url.origin == "https://b.tile.openstreetmap.org"  || request.destination === "image";
  },
  fallbackOn500(
    new StaleWhileRevalidate({
      cacheName: 'api-cache',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        })
      ]
    })
  )
);

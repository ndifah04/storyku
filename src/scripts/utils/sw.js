import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

const CACHE_NAME = 'custom-pwa-cache-v1'

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
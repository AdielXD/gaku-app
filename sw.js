const CACHE_NAME = 'jp-flashcards-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',
  '/index.tsx',
  '/icon.svg',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Roboto:wght@400;700&display=swap'
];

let notificationTimeoutId = null;

// Install service worker and activate immediately
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate service worker, claim clients, and clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      }
    )
  );
});

// Listen for messages from the client to schedule notifications
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { delay, title, options } = event.data.payload;

    if (notificationTimeoutId) {
      clearTimeout(notificationTimeoutId);
    }

    notificationTimeoutId = setTimeout(() => {
      self.registration.showNotification(title, options)
        .catch(err => console.error("Error showing notification:", err));
    }, delay);
  }
});

// Handle push notifications from a server (best practice for PWAs)
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');
  
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'Gaku APP',
      body: event.data.text() || 'Você tem uma nova mensagem!',
    };
  }

  const title = data.title || 'Gaku APP';
  const options = {
    body: data.body,
    icon: 'icon.svg',
    badge: 'icon.svg',
    vibrate: [200, 100, 200],
    tag: 'gaku-push-notification'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


// Handle notification click event (including actions)
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const urlToOpen = new URL('/', self.location.origin).href;

  // This function handles opening or focusing the app window.
  const openOrFocusClient = () => clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  }).then(windowClients => {
    let matchingClient = null;
    for (let i = 0; i < windowClients.length; i++) {
      const client = windowClients[i];
      if (client.url === urlToOpen) {
        matchingClient = client;
        break;
      }
    }

    if (matchingClient) {
      return matchingClient.focus();
    } else {
      return clients.openWindow(urlToOpen);
    }
  });

  // Check if an action button was clicked
  if (event.action === 'open_app') {
    console.log('Open App action clicked');
  } else {
    console.log('Notification body clicked');
  }
  
  event.waitUntil(openOrFocusClient());
});
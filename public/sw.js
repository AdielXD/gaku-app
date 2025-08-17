const CACHE_NAME = 'gaku-app-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.css',
  '/manifest.json',
  '/icon.svg',
];

let notificationTimeoutId = null;

// Install service worker and cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
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
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Serve cached content when offline, and cache new assets on the fly
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Don't cache API calls from Netlify Functions
  if (event.request.url.includes('/.netlify/functions/')) {
    return; // Fallback to network, do not cache
  }

  // Use a "Cache, falling back to network" strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If the resource is in the cache, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // If the resource is not in the cache, fetch it from the network
        return fetch(event.request).then(
          networkResponse => {
            // If we got a valid response, clone it and cache it for future use
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(error => {
            console.error('Fetch failed; returning offline might be an option here.', error);
            // Optionally, return an offline fallback page if you have one cached
        });
      })
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

// Self-destruct service worker.
// Old SW was cache-first and locked stale bundles on mobile devices.
// On next visit, browser fetches this file, sees it differs from registered SW,
// installs + activates it. Activate deletes caches, unregisters, reloads clients.
self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(c => { try { c.navigate(c.url); } catch (_) {} });
    } catch (err) {
      console.warn('sw self-destruct error', err);
    }
  })());
});

// No fetch handler — all requests go straight to network (bypass SW entirely).

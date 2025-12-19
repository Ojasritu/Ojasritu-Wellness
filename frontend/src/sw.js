/* Service worker (basic) - registers precache with Workbox in production builds.
   For demo, this file provides simple offline caching for static resources. */

const CACHE = 'ojasritu-v1'

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/', '/index.html', '/src/main.jsx']))
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match('/index.html')))
  )
})

console.log('Hello from service-worker.js');


importScripts("js/workbox/workbox-core/build/workbox-core.prod.js");
importScripts("js/workbox/workbox-cacheable-response/build/workbox-cacheable-response.prod.js");
importScripts("js/workbox/workbox-expiration/build/workbox-expiration.prod.js");
importScripts("js/workbox/workbox-routing/build/workbox-routing.prod.js");
importScripts("js/workbox/workbox-strategies/build/workbox-strategies.prod.js");
// import {
//     registerRoute
// } from 'workbox-routing';
// import {
//     NetworkFirst,
//     StaleWhileRevalidate,
//     CacheFirst,
// } from 'workbox-strategies';

// Used for filtering matches based on status code, header, or both
// import {
//     CacheableResponsePlugin
// } from 'workbox-cacheable-response';
// Used to limit entries in cache, remove entries after a certain period of time
// import {
//     ExpirationPlugin
// } from 'workbox-expiration';

// Cache page navigations (html) with a Network First strategy
this.workbox.routing.registerRoute(
    // Check to see if the request is a navigation to a new page
    ({
        request
    }) => request.mode === 'navigate',
    // Use a Network First caching strategy
    new this.workbox.strategies.NetworkFirst({
        // Put all cached files in a cache named 'pages'
        cacheName: 'pages',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new this.workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
);

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
this.workbox.routing.registerRoute(
    // Check to see if the request's destination is style for stylesheets, script for JavaScript, or worker for web worker
    ({
        request
    }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
    // Use a Stale While Revalidate caching strategy
    new this.workbox.strategies.StaleWhileRevalidate({
        // Put all cached files in a cache named 'assets'
        cacheName: 'assets',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new this.workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
);

// Cache images with a Cache First strategy
this.workbox.routing.registerRoute(
    // Check to see if the request's destination is style for an image
    ({
        request
    }) => request.destination === 'image',
    // Use a Cache First caching strategy
    new this.workbox.strategies.CacheFirst({
        // Put all cached files in a cache named 'images'
        cacheName: 'images',
        plugins: [
            // Ensure that only requests that result in a 200 status are cached
            new this.workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [200],
            }),
            // Don't cache more than 50 items, and expire them after 30 days
            new this.workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            }),
        ],
    }),
);
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');
importScripts('js/config-firebase.js');

console.log('Hello from firebase-messaging-sw.js');

this.workbox.core.setCacheNameDetails({
    prefix: 'my-pwa',
    suffix: 'v1'
});


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




// Cache Google Fonts with a stale-while-revalidate strategy, with
// a maximum number of entries.
this.workbox.routing.registerRoute(
    ({
        url
    }) => url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
    new this.workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts',
        plugins: [
            new this.workbox.expiration.ExpirationPlugin({
                maxEntries: 20
            }),
        ],
    }),
);




//google analytics
this.workbox.googleAnalytics.initialize();





// Ensure your build step is configured to include /offline.html as part of your precache manifest.
// this.workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

this.workbox.precaching.precacheAndRoute([{
        url: 'offline.html',
        revision: null
    },
    {
        url: 'images2/no-image.png',
        revision: null
    },
    // ... other entries ...
]);



// Catch routing errors, like if the user is offline
this.workbox.routing.setCatchHandler(async ({
    event
}) => {
    console.log('event', event);
    console.log('event.request.destination', event.request.destination);
    // Return the precached offline page if a document is being requested
    if (event.request.destination === 'document') {
        return this.workbox.precaching.matchPrecache('offline.html');
    } else if (event.request.destination === 'image') {
        return this.workbox.precaching.matchPrecache('images2/no-image.png');
    }
    return Response.error();
});












// onBackgroundMessage setBackgroundMessageHandler
// https://firebase.google.com/docs/cloud-messaging/http-server-ref?hl=es
messaging.onBackgroundMessage((payload) => {
    console.log(payload);
    const notification = JSON.parse(payload);
    const notificationOption = {
        title: notification.title,
        body: notification.body,
        icon: notification.icon,
        click_action: "https://www.youtube.com/"

    };
    const url = 'https://www.jolugama.com/blog/2021/05/27/PWA-aplicaciones-web-progresivas/';
    window.open(url, '_blank');
    return self.registration.showNotification(payload.notification.title, notificationOption);
});




// acción tras hacer click en un notification push
self.addEventListener('notificationclick', e => {
    const notificacion = e.notification;
    const accion = e.action;
    const url = 'https://www.jolugama.com/blog/2021/05/27/PWA-aplicaciones-web-progresivas/';
    console.log('notificacion', notificacion);
    console.log('accion', accion);

    e.preventDefault(); //prevent the browser from focusing the Notification's tab
    window.open(url, '_blank');


    const respuesta = clients.matchAll()
        .then(clientes => {
            let cliente = clientes.find(c => {
                return c.visibilityState === 'visible';
            });

            if (cliente !== undefined) {
                cliente.navigate(url);
                cliente.focus();
            } else {
                clients.openWindow(url);
            }
            return notificacion.close();
        });
    e.waitUntil(respuesta);


});
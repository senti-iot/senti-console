/* eslint-disable */
importScripts('/workbox-sw.js');
// workbox.setConfig({ debug: true });
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
// self.addEventListener('install', event => {
// 	// console.log(event)
// 	workbox.skipWaiting(true)
// 	return event.waitUntil(workbox.skipWaiting(true))

// });
workbox.skipWaiting();
workbox.clientsClaim();
workbox.precaching.suppressWarnings();
// self.addEventListener('activate', event => event.waitUntil(workbox.clientsClaim(true)));

//This will precache everything, not optimal
workbox.precaching.precacheAndRoute([])

//cache JS/CSS

workbox.routing.registerRoute(
	/\.(?:js|css)$/,
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'static-resources',
	})
);

// cache images
workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg)$/,
	workbox.strategies.cacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.Plugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60 * 12, // 12 months Days
			}),
		],
	})
);

// webfont-cache
const webFontHandler = workbox.strategies.cacheFirst({
	cacheName: 'webfont-cache',
	networkTimeoutSeconds: 5,
	plugins: [
		new workbox.expiration.Plugin({ maxEntries: 50 }),
		new workbox.cacheableResponse.Plugin({ statuses: [0, 200] }),
	],
});
workbox.routing.registerRoute(/https:\/\/fonts.googleapis.com\/.*/, webFontHandler);

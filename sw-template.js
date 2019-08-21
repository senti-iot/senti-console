/* eslint-disable */
importScripts('/workbox-sw.js');
// workbox.setConfig({ debug: true });
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
workbox.core.skipWaiting();
workbox.core.clientsClaim();
// workbox.precaching.suppressWarnings();

//This will precache everything
workbox.precaching.precacheAndRoute([])

//cache JS/CSS
workbox.routing.registerRoute(
	/\.(?:css)$/,
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'css-cache'
	})
);
workbox.routing.registerRoute(
	/\.(?:js)$/,
	workbox.strategies.staleWhileRevalidate({
		cacheName: 'js-cache'
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
				maxAgeSeconds: 30 * 24 * 60 * 60 * 12, // 12 months
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

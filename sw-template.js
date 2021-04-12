/* eslint-disable */
importScripts('/workbox-sw.js')
// workbox.setConfig({ debug: true });
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
// self.skipWaiting().then(args => console.log('installed', args));

workbox.core.skipWaiting()
workbox.core.clientsClaim()
// workbox.precaching.suppressWarnings();

//This will precache everything
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

//cache JS/CSS
workbox.routing.registerRoute(
	/\.(?:css)$/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'css-cache'
	})
)
workbox.routing.registerRoute(
	/\.(?:js)$/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: 'js-cache'
	})
)

// cache images
workbox.routing.registerRoute(
	/\.(?:png|gif|jpg|jpeg|svg)$/,
	new workbox.strategies.CacheFirst({
		cacheName: 'images',
		plugins: [
			new workbox.expiration.ExpirationPlugin({
				maxEntries: 60,
				maxAgeSeconds: 30 * 24 * 60 * 60 * 12, // 12 months
			}),
		],
	})
)

// webfont-cache
const webFontHandler = new workbox.strategies.CacheFirst({
	cacheName: 'webfont-cache',
	networkTimeoutSeconds: 5,
	plugins: [
		new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
		new workbox.cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] }),
	],
})
workbox.routing.registerRoute(/https:\/\/fonts.googleapis.com\/.*/, webFontHandler)

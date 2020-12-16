// v2

let files = ['./', './index.html', './styles/style.css', './main.js'];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('static').then(cache => {
			return cache
				.addAll(files)
				.then(() => self.skipWaiting())
				.catch(err => console.error('Cache error.', err));
		})
	);
});

self.addEventListener('fetch', event => {
	let file = event.request.url.split('/');
	file = file[file.length - 1];
	event.respondWith(
		caches.match(event.request).then(res => {
			return res ? res : fetch(event.request).catch(err => console.error(`Fetch error for ${file}`, err));
		})
	);
});

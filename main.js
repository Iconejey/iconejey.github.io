window.isUpdateAvailable = new Promise(function (resolve, reject) {
	if ('serviceWorker' in navigator)
		navigator.serviceWorker
			.register('/sw.js', {
				scope: '/'
			})
			.then(reg => {
				reg.onupdatefound = () => {
					const installingWorker = reg.installing;
					installingWorker.onstatechange = () => {
						if (installingWorker.state == 'installed') {
							if (navigator.serviceWorker.controller) resolve(true);
							else resolve(false);
						}
					};
				};
			});
}).then(isAvailable => {
	if (isAvailable && confirm("Mise à jour disponible ! Recharger l'application?")) location.reload();
});

const setPage = (page_id, val) => {
	page = document.getElementById(page_id);
	let main = document.getElementById('main');
	if (val) {
		setTimeout(() => {
			main.classList.add('no-display');
		}, 500);
		main.classList.add('hide');
		page.classList.add('slidein');
		location.hash = page_id + '-page';
	} else {
		main.classList.remove('no-display');
		main.classList.remove('hide');
		page.classList.remove('slidein');
		location.hash = '#home';
	}
};

const movePage = (from, to) => {
	setPage(from, false);
	setTimeout(() => {
		setPage(to, true);
	}, 600);
};

onload = () => {
	if (location.hash && location.hash != '#home') setPage(location.hash.replace('-page', '').replace('#', ''), true);

	let cursor = false;
	setInterval(() => {
		cursor = !cursor;
		document.getElementById('job').innerHTML = cursor ? 'Étudiant L2 Info_' : 'Étudiant L2 Info';
	}, 500);
};

const exp_array = [
	{
		title: 'Développeur Web Frontend React',
		period: '2025 - 2027',
		description: 'Alternance chez Kimple en formation avec Openclassrom',
		points: ["Travail d'équipe et méthodologie Agile (SCRUM)", "Développement front de l'UI d'une plateforme SaaS avec React.js"]
	},
	{
		title: 'Nono-CLI',
		period: '2026',
		description: 'Un agent IA pour le développement dans le terminal',
		points: ['Interface dans le terminal (TUI)', "Intégration d'un agent IA avec une boucle ReAct"]
	},
	{
		title: 'Nored',
		period: '2025',
		description: 'Application web mobile de suivi du cycle menstruel',
		points: ["Affichage d'un calendrier interactif", "Analyse avec l'IA pour prédire le prochain cycle et détecter les irrégularités"],
		link: { url: 'https://nored.ngwy.fr?demo', label: 'Essayer' }
	},
	{
		title: 'Nosuite',
		period: '2024 - 2025',
		description: "Service d'authentification et de stockage centralisé pour mes projets personnels inspiré de Google (un seul compte pour toutes mes applications)",
		points: [
			"Authentification inspirée d'OAuth2 avec une popup de connexion vers un service commun à tous mes projets (SSO)",
			"API de stockage de données chiffrées sur le compte Nosuite de l'utilisateur",
			'Synchronisation temps réel pour toutes les apps (systèmes répartis, sockets)'
		]
	},
	{
		title: 'Notask',
		period: '2021 - 2025',
		description: "Application de notes et tâches dans laquelle j'ai appliqué ce que j'apprenais en cours",
		points: [
			"Intégration de l'IA pour générer des notes, des tâches et les icônes.",
			"Partage d'un site web vers Notask pour utiliser ses données (share target, scrapping)",
			'Compilation markdown vers HTML',
			"Design sur figma avec des notions d'IHM et de responsive",
			'Utilisation des Custom Elements en HTML5 pour un front-end basé sur des composants (comme en React.js)'
		],
		link: { url: 'https://notask.ngwy.fr?demo', label: 'Essayer' }
	},
	{
		title: 'Nopalette',
		period: '2024',
		description: "Application web de gestion de palettes de couleurs pour les designers et les développeurs. Juste un petit projet pour créer un outil que j'utilise souvent",
		points: ["Génération de palettes de couleurs avec l'IA"]
	},
	{
		title: 'Vélorution',
		period: "2023 - AUJOURD'HUI",
		description: "Je fais partie du comité de Vélorution-Lille, un collectif de cyclistes qui se rassemblent tous les mois lors d'une masse critique pour promouvoir les mobilités actives",
		points: [
			'Organiser les masses critiques lors de réunions',
			'Coller des affiches Vélorution chez des enseignes en lien avec le vélo',
			"Préparer et placer des vélos blancs en hommage aux cyclistes victimes d'un accident de la route",
			'Veiller à la sécurité des cyclistes lors des masses critiques'
		]
	},
	{
		title: 'Webmaster',
		period: '2022',
		description: "J'ai conçu, développé et mis en place l'hébergement du site internet d'une entreprise de BTP",
		points: ['Three.js (3D et photographie 360°)', "Envoi d'emails depuis un formulaire de contact (nodemailer)", 'Hébergement VPS IONOS'],
		link: { url: 'https://demo-btp.ngwy.fr', label: 'Voir la démo' }
	},
	{
		title: 'Wi-Bash',
		period: '2019 - 2022',
		description: 'Association étudiante informatique dans laquelle nous',
		points: ["Échangions avec nos professeurs sur des sujets d'algorithmique", 'Réalisions des projets en électronique et autres', "Avons organisé deux concours en partenariat avec CodinGame, dont j'ai fini 3ème à chacune"]
	},
	{
		title: "Développeur d'application web",
		period: '2021',
		description: "J'ai développé une PWA de suivi des chantiers pour une entreprise d'assainissement des eaux",
		points: ['Service-Workers (PWA et synchronisation en arrière-plan)', 'Notifications web', "Compression et streams pour l'envoi d'images au serveur", 'API Google Maps']
	},
	{
		title: 'The-mute-bow',
		period: '2019 - 2021',
		description: 'Jeu mobile web qui fut ma première expérience avec le développement web',
		points: ['Pixel art et animations de sprites', 'Utilisation de la carte graphique dans une page web (webGPU)', 'Game design et gameplay avec un écran tactile'],
		link: { url: 'https://the-mute-bow.github.io', label: 'Essayer' }
	},
	{
		title: 'Relais handicap',
		period: '2019 - 2021',
		description: "Avec la DOSIP de l'université des Antilles, j'ai été étudiant assistant",
		points: ["Durant les jours de cours pour un camarade de classe atteint d'ostéogenèse imparfaite", 'Durant les examens pour un étudiant qui ne pouvait pas écrire']
	}
];

window.onload = () => {
	const $exp_list = $('#exp ul');
	$exp_list.innerHTML = '';

	for (const exp of exp_array) {
		const $exp = document.createElement('li');
		$exp.id = 'exp-2';
		$exp.classList.add('fade-in-hidden');
		$exp_list.appendChild($exp);

		$exp.innerHTML = html`
			<div class="left-line">
				<div class="large bullet"></div>
				<div class="line fade-in-hidden"></div>
			</div>

			<div class="exp">
				<h3>${exp.title.toUpperCase()} | ${exp.period}</h3>

				<div>
					<p>${exp.description}&nbsp;:</p>
					<ul></ul>
					<a href="${exp.link?.url}" target="_blank" class="btn">${exp.link?.label}</a>
				</div>
			</div>
		`;

		const $points = $exp.querySelector('ul');
		for (const point of exp.points) {
			const $point = document.createElement('li');
			$points.appendChild($point);
			$point.innerHTML = html`
				<div class="small bullet"></div>
				<span>${point}</span>
			`;
		}
	}

	const delay = 300;
	const hidden = [...document.querySelectorAll('.fade-in-hidden')];
	let last_delay = Date.now();

	// Sort the elements in the order they appear on the page
	hidden.sort((a, b) => {
		let top_a = a.getBoundingClientRect().top;
		let top_b = b.getBoundingClientRect().top;

		// If profile, consider it a bit lower
		if (a.id === 'profil') top_a += 100;
		if (b.id === 'profil') top_b += 100;

		return top_a - top_b;
	});

	function map(value, in_min, in_max, out_min, out_max) {
		const val = ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
		return Math.min(Math.max(val, out_min), out_max);
	}

	const observer = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) reveal(entry.target);
			});
		},
		{ threshold: map(innerHeight / innerWidth, 0.5, 2, 0.2, 0.7) }
	);

	function setNextObserver() {
		if (!hidden.length) return;

		const next = hidden.shift();

		// If scrolled past the element, reveal it immediately
		const top = next.getBoundingClientRect().top;
		if (top < 0) {
			reveal(next, true);
		} else {
			observer.observe(next);
		}
	}

	function reveal(elem, skip_delay = false) {
		// Different between now and the next element delay, to check if we need to wait
		const to_wait = Math.max(0, last_delay + delay - Date.now());

		setTimeout(
			() => {
				elem.classList.remove('fade-in-hidden');
				last_delay = Date.now();
				setNextObserver();
				observer.unobserve(elem);
			},
			skip_delay ? 0 : to_wait
		);
	}

	// Start the first observer after one second
	setTimeout(() => setNextObserver(), 1000);
};

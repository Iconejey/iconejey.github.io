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

let i = 4;
const delay = 300;
const hidden = [...document.querySelectorAll('.fade-in-hidden')];

// Sort the elements in the order they appear on the page
hidden.sort((a, b) => {
	let top_a = a.getBoundingClientRect().top;
	let top_b = b.getBoundingClientRect().top;

	// If profile, consider it a bit lower
	if (a.id === 'profil') top_a += 100;
	if (b.id === 'profil') top_b += 100;

	return top_a - top_b;
});

for (let elem of hidden) {
	setTimeout(() => {
		elem.classList.remove('fade-in-hidden');
	}, i++ * delay);
}

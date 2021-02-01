/*
JS | Activité 2
*/

document.querySelector('#jeu').style.visibility = 'hidden';

let j1 = { ins: false };
let j2 = { ins: false };

let current_player = 1;

//Rempli le plateau de pions
function init_plateau() {
	let plateau = document.querySelector('#plateau');
	for (let i = 0; i < 49; i++) document.querySelector('#plateau').innerHTML += '<div id="' + i + '" class="pion" onclick="touch(event)"></div>';
	document.querySelector('#jeu').style.visibility = 'visible';
}

//Fontion d'inscription
function ins(player) {
	// Completer pour vérifier l'inscription
	let input = document.getElementsByName('j' + player)[0];
	input.disabled = true;
	document.querySelector('#j' + player + '-name').innerHTML = input.value;
	document.querySelectorAll('button')[player - 1].disabled = true;

	input.disabled = true;

	if (player == 1) j1.ins = true;
	else j2.ins = true;

	if (j1.ins && j2.ins) {
		// Retirer le panneau d'inscription
		let ins = document.getElementById('ins');
		document.body.removeChild(ins);

		//Initialise le plateau
		init_plateau();

		//lien avec les logo
		j1.logo = document.querySelector('.fas.fa-user.j1');
		j2.logo = document.querySelector('.fas.fa-user.j2');

		//Instruction de jeu
		document.querySelector('#player-name').innerHTML = document.querySelector('#j1-name').innerHTML;

		//ne joue pas pour le moment
		j2.logo.classList.toggle('fas');
		j2.logo.classList.toggle('far');
	}
}

function touch(event) {
	let pion = event.target;

	// si emplacement vide
	if (!pion.classList.contains('playing')) {
		// gravité
		let done = false;
		while (!done) {
			next_id = parseInt(pion.id) + 7;
			next_pion = document.getElementById(next_id);
			if (next_pion && !next_pion.classList.contains('playing')) pion = next_pion;
			else done = true;
		}

		// placement
		pion.classList.add('playing');
		pion.classList.add('j' + current_player);

		// si joueur actuel gagne
		if (win()) {
			stop();
			setTimeout(() => {
				if (confirm(document.querySelector('#j' + current_player + '-name').innerHTML + ' a gagné ! Rejouer?')) location.reload();
			}, 500);
		}

		// si jeu plein
		else if (document.querySelectorAll('.pion.playing').length == 49) {
			setTimeout(() => {
				if (confirm('Match nul ! Rejouer?')) location.reload();
			}, 500);
		}

		// changement de joueur
		else {
			current_player = current_player == 1 ? 2 : 1;
			document.querySelector('#player-name').innerHTML = document.querySelector('#j' + current_player + '-name').innerHTML;

			j1.logo.classList.toggle('fas');
			j1.logo.classList.toggle('far');
			j2.logo.classList.toggle('fas');
			j2.logo.classList.toggle('far');
		}
	}
}

// return le pion en (x, y) s'il existe et a été joué par le joueur donné sinon null
function good(p, x, y) {
	if (0 <= x && x < 7 && 0 <= y && y < 7) {
		let pion = document.getElementById(y * 7 + x);
		return pion.classList.contains('j' + p) ? pion : null;
	}
}

// vérifie les trois pions d'une direction donnée
function suite(p, x, y, dx, dy) {
	let pions = [];
	for (let i = 1; i < 4; i++) {
		let pion = good(p, x + dx * i, y + dy * i);

		// si le pion n'existe pas ou n'est pas bon
		if (pion == null) return false;

		// on ajoute le bon pion
		pions.push(pion);
	}

	// on retourne les bons pions
	return pions;
}

// Vérifie si le joueur actuel gagne
function win() {
	for (let pion of document.querySelectorAll('.j' + current_player + '.pion')) {
		let x = pion.id % 7;
		let y = Math.floor(pion.id / 7);

		// pour chaque direction
		for (let dx of [-1, 0, 1]) {
			for (let dy of [-1, 0, 1]) {
				// si dx et dy ne sont pas tous les deux 0
				if (dx != 0 || dy != 0) {
					let s = suite(current_player, x, y, dx, dy);

					// si la suite de 4 pions est bonne
					if (s) {
						// on ajoute la classe win
						pion.classList.add('win');
						for (let p of s) p.classList.add('win');

						return true;
					}
				}
			}
		}
	}

	// on return false par défaut
	return false;
}

// Empêche le joueur de jouer
function stop() {
	for (let pion of document.querySelectorAll('.pion')) pion.classList.add('playing');
}

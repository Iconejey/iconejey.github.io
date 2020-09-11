window.isUpdateAvailable = new Promise(function (resolve, reject) {
	if ('serviceWorker' in navigator)
		navigator.serviceWorker
			.register('./sw.js', {
				scope: './'
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

document.querySelector('h1').style.transform = `translateY(${(innerHeight - innerWidth - 96) / 3}px)`;

let game;
let grids = document.getElementsByClassName('grid');
let player = Math.random() < 0.5 ? true : false;

const getGrid = coords => grids[coords[1] * 3 + coords[0] + 1];

function click(x, y) {
	if ((player || !game.IA) && !win(game.big)) {
		for (let coords of getFree()) {
			if (coords[0] == x && coords[1] == y) play(x, y);
		}
	}
}

const cut = coords => {
	let arr = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	for (let x = 0; x < 3; x++) {
		for (let y = 0; y < 3; y++) {
			arr[y][x] = game[coords[1] * 3 + y][coords[0] * 3 + x];
		}
	}

	return arr;
};

const win = (grid, log = false) => {
	let s0 = { c: '', x: [], o: [] };

	for (let x = 0; x < 3; x++) {
		let s1 = { c: '', arr: [] };
		let s2 = { c: '', arr: [] };
		let s3 = { c: '', arr: [] };
		let s4 = { c: '', arr: [] };

		for (let y = 0; y < 3; y++) {
			s0.c += grid[y][x];
			s1.c += grid[y][x];
			s2.c += grid[x][y];
			s3.c += grid[y][y];
			s4.c += grid[2 - y][y];

			if ('xX'.includes(grid[y][x])) s0.x.push([x, y]);
			if ('oO'.includes(grid[y][x])) s0.o.push([x, y]);

			s1.arr.push([x, y]);
			s2.arr.push([y, x]);
			s3.arr.push([y, y]);
			s4.arr.push([2 - y, y]);
		}

		for (let s of [s1, s2, s3, s4]) {
			if (['xxx', 'XXX'].includes(s.c)) return { player: 'X', cases: s.arr };
			if (['ooo', 'OOO'].includes(s.c)) return { player: 'O', cases: s.arr };
		}
	}

	if (!s0.c.includes('0')) return (s0.c.match(/xX/g) || []).length > (s0.c.match(/oO/g) || []).length ? { player: 'X', cases: s0.x } : { player: 'O', cases: s0.o };

	return false;
};

const randPlay = () => {
	let free = getFree();
	for (let c of free) {
		let grid = cut([Math.floor(c[0] / 3), Math.floor(c[1] / 3)]);

		grid[c[1] % 3][c[0] % 3] = player ? 'x' : 'o';
		if (win(grid)) {
			play(c[0], c[1]);
			return;
		}
	}

	for (let c of free) {
		let grid = cut([Math.floor(c[0] / 3), Math.floor(c[1] / 3)]);

		grid[c[1] % 3][c[0] % 3] = player ? 'o' : 'x';
		if (win(grid)) {
			play(c[0], c[1]);
			return;
		}
	}

	let c = free[Math.floor(Math.random() * free.length)];
	play(c[0], c[1]);
};

const getFree = () => {
	let arr = [];

	for (let x = 0; x < 9; x++) {
		for (let y = 0; y < 9; y++) {
			if (!game[y][x] && !game.big[Math.floor(y / 3)][Math.floor(x / 3)]) {
				for (let coords of game.on) {
					if (coords[0] == Math.floor(x / 3) && coords[1] == Math.floor(y / 3)) arr.push([x, y]);
				}
			}
		}
	}

	return arr;
};

const initGrid = IA => {
	game = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	game.IA = IA;
	game.on = [
		[0, 0],
		[1, 0],
		[2, 0],
		[0, 1],
		[1, 1],
		[2, 1],
		[0, 2],
		[1, 2],
		[2, 2]
	];

	game.big = [
		[0, 0, 0],
		[0, 0, 0],
		[0, 0, 0]
	];

	for (let link of document.querySelectorAll('a')) link.classList.add('hid');

	for (let grid of grids) {
		grid.classList.remove('hid');

		grid.innerHTML = `
        <svg class="gridsvg">
            <line x1="2%" y1="33%" x2="98%" y2="33%" />
            <line x1="2%" y1="66%" x2="98%" y2="66%" />
            <line x1="33%" y1="2%" x2="33%" y2="98%" />
            <line x1="66%" y1="2%" x2="66%" y2="98%" />
        </svg>`;

		grid.style.transform = `translateY(${(innerHeight - innerWidth) * 0.6}px)`;
	}

	for (let big of game.on) {
		for (let small of game.on) {
			let x = big[0] * 3 + small[0];
			let y = big[1] * 3 + small[1];

			getGrid(big).innerHTML += `
            <svg class="ox mark" id="x${x}${y}">
                <line x1="20%" y1="20%" x2="80%" y2="80%" />
                <line x1="80%" y1="20%" x2="20%" y2="80%" />
            </svg>
            <svg class="ox mark" id="o${x}${y}">
                <circle cx="50%" cy="50%" r="35%" />
            </svg>`;

			document.querySelector(`#x${x}${y}`).style.transform = `translate(${(x % 3) * 109}%, ${(y % 3) * 109}%)`;
			document.querySelector(`#o${x}${y}`).style.transform = `translate(${(x % 3) * 109}%, ${(y % 3) * 109}%)`;
		}

		getGrid(big).innerHTML += `
        <svg class="OX X mark" id="X${big[0]}${big[1]}">
            <line x1="20%" y1="20%" x2="80%" y2="80%" />
            <line x1="80%" y1="20%" x2="20%" y2="80%" />
        </svg>
        <svg class="OX O mark" id="O${big[0]}${big[1]}">
            <circle cx="50%" cy="50%" r="35%" />
        </svg>`;

		for (let small of game.on) {
			let x = big[0] * 3 + small[0];
			let y = big[1] * 3 + small[1];

			getGrid(big).innerHTML += `
            <a class="touch mark" id="d${x}${y}" onclick="window.click(${x}, ${y})"></a>`;

			document.querySelector(`#d${x}${y}`).style.transform = `translate(${(x % 3) * 109}%, ${(y % 3) * 109}%)`;
		}
	}

	setTimeout(() => {
		update();
	}, 1000);

	if (!player && game.IA) {
		setTimeout(() => {
			randPlay();
		}, 2000);
	}
};

const update = () => {
	if (player) {
		document.querySelector('#cross').classList.add('on');
		document.querySelector('#circle').classList.remove('on');
	} else {
		document.querySelector('#cross').classList.remove('on');
		document.querySelector('#circle').classList.add('on');
	}

	for (let grid of grids) grid.classList.remove('on');
	for (let grid of game.on) getGrid(grid).classList.add('on');
};

const play = (x, y) => {
	game[y][x] = player ? 'x' : 'o';
	document.querySelector(`#${player ? 'x' : 'o'}${x}${y}`).classList.add('on');

	let grid = [Math.floor(x / 3), Math.floor(y / 3)];
	let w = win(cut(grid));
	if (w) {
		game.big[grid[1]][grid[0]] = w.player;
		getGrid(grid).classList.add('done');
		document.querySelector(`#${w.player}${Math.floor(x / 3)}${Math.floor(y / 3)}`).classList.add('on');
	}

	let Bw = win(game.big);
	if (Bw) game.on = Bw.cases;
	else if (game.big[y % 3][x % 3]) {
		game.on = [];

		for (let X = 0; X < 3; X++) {
			for (let Y = 0; Y < 3; Y++) {
				if (!game.big[Y % 3][X % 3]) game.on.push([X, Y]);
			}
		}
	} else game.on = [[x % 3, y % 3]];

	player = !player;
	update();

	if (!player && game.IA && !win(game.big)) {
		setTimeout(() => {
			randPlay();
		}, 1000);
	}
};

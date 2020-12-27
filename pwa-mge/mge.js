// game time
var time = 0;
var delay = 0;

// Joystick object
let joystick_obj = side => {
	let j = {
		id: -1,
		side: side,
		fixed: false,
		blink: null,
		min_op: 0,

		ttrig: 200,
		rtrig: 0.2,
		rout: 2,

		base: { x: 0, y: 0, r: 60, active: 0, opacity: 0 },
		tip: { x: 0, y: 0, r: 25, active: 0, opacity: 0 },
		prev: { x: 0, y: 0 },
		pos: { x: 0, y: 0, d: 0 },

		time: 0,

		onTap: j => {},
		onStart: j => {},
		onMove: j => {},
		onEnd: j => {},
		draw: ctx => {},
		update: ctx => {},
		updatePos: ctx => {},

		color: 'white'
	};

	j.draw = ctx => {
		ctx.fillStyle = j.color;
		ctx.strokeStyle = j.color;
		ctx.lineWidth = j.base.r / 16;
		ctx.globalAlpha = j.base.opacity;

		ctx.beginPath();
		ctx.arc(j.base.x, j.base.y, j.base.r, 0, 2 * Math.PI);
		ctx.stroke();

		ctx.globalAlpha = j.tip.opacity;

		ctx.beginPath();
		ctx.arc(j.tip.x, j.tip.y, j.tip.r, 0, 2 * Math.PI);
		ctx.fill();

		ctx.globalAlpha = 1;
	};

	j.updatePos = _ => {
		let dx = j.tip.x - j.base.x;
		let dy = j.tip.y - j.base.y;
		let dxy = Math.sqrt(dx * dx + dy * dy);

		j.pos = {
			x: dx / dxy,
			y: dy / dxy,
			d: dxy / j.base.r
		};

		if (j.pos.d > j.rout) {
			j.tip.active = 0;
			j.base.active = 0;
		}
	};

	j.update = _ => {
		if (!j.tip.active) {
			j.tip.x = mge.converge(j.tip.x, j.base.x, 0.1);
			j.tip.y = mge.converge(j.tip.y, j.base.y, 0.1);
		}

		j.tip.opacity = mge.converge(j.tip.opacity, Math.max(j.min_op, j.tip.active), 0.1);
		j.base.opacity = mge.converge(j.base.opacity, Math.max(j.min_op, j.base.active), 0.1);

		if (j.blink && time - j.blink > 600) {
			j.blink = time;
			j.tip.opacity = 1;
			j.base.opacity = 1;
		}

		if (j.tip.active) {
			if (time - j.time > j.ttrig) j.base.active = 1;
			if (j.pos.d > j.rtrig) j.base.active = 1;
		}
	};

	return j;
};

// Game engine object
var mge = {
	canvas: document.querySelector('.mge-main canvas'),
	overlay: document.querySelector('.mge-main .mge-overlay'),

	ctx: null,
	touch_margin: 32,

	clear: _ => mge.ctx.clearRect(0, 0, mge.canvas.width, mge.canvas.height),

	forceFullscreen: true,
	fullscreenOn: false,
	setFullscreen: mode => {
		let fse = document.fullscreenElement;
		setTimeout(_ => mge.resize(), 10);

		if (!mode || mode == 'on') {
			document.documentElement.requestFullscreen().catch(err => {});
			return 'on';
		}

		if (!mode || mode == 'off') {
			document.exitFullscreen();
			return 'off';
		}
	},

	landscapeMode: false,

	overlayID: 'undefined',
	overlayContent: 'undefined',
	setOverlay: id => {
		if (id != mge.overlayID) {
			mge.canvas.classList.remove('mge-canvas-on-' + mge.overlayID + '-section');
			mge.canvas.classList.add('mge-canvas-on-' + id + '-section');

			mge.overlayID = id;
			if (!['landscape', 'fullscreen'].includes(id)) mge.overlayContent = id;

			if (id) {
				mge.overlay.classList.remove('mge-hidden');

				let done = false;
				for (let section of document.querySelectorAll('.mge-overlay section')) {
					if (section.id == id) {
						done = true;
						section.classList.remove('mge-hidden');
					} else section.classList.add('mge-hidden');
				}

				if (!done) console.error(id + ': This section does not exist.');
			} else {
				mge.overlay.classList.add('mge-hidden');
			}
		}
	},

	resize: _ => {
		let rect = mge.canvas.getBoundingClientRect();

		mge.canvas.width = outerWidth * devicePixelRatio;
		mge.canvas.height = outerHeight * devicePixelRatio;

		mge.canvas.style.width = outerWidth + 'px';
		mge.canvas.style.height = outerHeight + 'px';

		mge.landscapeMode = mge.canvas.width > mge.canvas.height;
		mge.fullscreenOn = Boolean(document.fullscreenElement);

		let section = mge.overlayContent;
		if (!mge.landscapeMode) section = 'landscape';
		if (!mge.fullscreenOn && mge.forceFullscreen) section = 'fullscreen';
		mge.setOverlay(section);

		mge.joysticks.forEach(j => {
			j.tip.r = Math.floor(mge.canvas.height / 16);
			j.base.r = Math.floor(mge.canvas.height / 7);
			j.tip.x = j.base.x;
			j.tip.y = j.base.y;
			j.updatePos();
		});
	},

	loadImg: (srcs, out, onLoad = p => {}, onError = src => {}, onFinish = _ => {}) => {
		let load_num = 0;
		let load_err = false;

		for (let src of srcs) {
			let img = new Image();

			img.addEventListener('error', event => {
				load_err = true;
				onError(src);
			});

			img.addEventListener('load', event => {
				if (!load_err) {
					load_num++;
					let key = src.split('/')[src.split('/').length - 1].split('.')[0];
					out[key] = img;

					if (load_num == srcs.length) onFinish();
					else onLoad(load_num / srcs.length);
				}
			});

			img.src = src;
		}
	},

	joysticks: {
		L: joystick_obj('L'),
		R: joystick_obj('R'),
		forEach: callback => {
			callback(mge.joysticks.L);
			callback(mge.joysticks.R);
		}
	},

	converge: (a, b, n) => {
		n = Math.min(Math.max(0, (n * delay) / 10), 1);
		return a * (1 - n) + b * n;
	},

	logic: _ => {},
	graphics: _ => {},

	tick: new_time => {
		delay = new_time - time;
		time = new_time;

		mge.joysticks.forEach(j => j.update());

		mge.logic();
		mge.graphics();

		requestAnimationFrame(mge.tick);
	}
};

// Joystick events
mge.canvas.addEventListener('touchstart', event => {
	event.preventDefault();

	for (let t of event.changedTouches) {
		let x = t.clientX * devicePixelRatio;
		let y = t.clientY * devicePixelRatio;

		let j = mge.joysticks[x < mge.canvas.width / 2 ? 'L' : 'R'];

		j.id = t.identifier;
		j.tip.x = x;
		j.tip.y = y;

		j.prev.x = x;
		j.prev.y = y;

		if (!j.fixed) {
			j.base.x = j.tip.x;
			j.base.y = j.tip.y;
			j.base.opacity = 0;
		}

		j.updatePos();

		if (j.pos.d * j.base.r > j.base.r) {
			j.pos = { x: 0, y: 0, d: 0 };
			j.tip.x = j.base.x;
			j.tip.y = j.base.y;
		} else {
			j.time = time;
			j.tip.active = 1;
		}

		if (j.tip.active) j.onStart(j);
	}
});

mge.canvas.addEventListener('touchmove', event => {
	event.preventDefault();

	for (let t of event.changedTouches) {
		let x = t.clientX * devicePixelRatio;
		let y = t.clientY * devicePixelRatio;

		mge.joysticks.forEach(j => {
			if (j.id == t.identifier && j.tip.active) {
				j.prev = { ...j.tip };

				j.tip.x = x;
				j.tip.y = y;

				j.updatePos();

				if (j.pos.d > 1) {
					if (j.fixed) {
						j.tip.x = j.base.x + j.pos.x * j.base.r;
						j.tip.y = j.base.y + j.pos.y * j.base.r;
					} else {
						j.base.x = j.tip.x - (j.pos.x * j.base.r) / j.pos.d;
						j.base.y = j.tip.y - (j.pos.y * j.base.r) / j.pos.d;
					}

					j.updatePos();
				}

				if (j.tip.active) j.onMove(j);
			}
		});
	}
});

mge.canvas.addEventListener('touchend', event => {
	event.preventDefault();

	for (let t of event.changedTouches) {
		let x = t.clientX * devicePixelRatio;
		let y = t.clientY * devicePixelRatio;

		mge.joysticks.forEach(j => {
			if (j.id == t.identifier) {
				if (j.tip.active) {
					if (!j.base.active) j.onTap(j);
					else j.onEnd(j);
				}

				j.tip.active = 0;
				j.base.active = 0;

				j.id = -1;
			}
		});
	}
});

// Context
mge.ctx = mge.canvas.getContext('2d');

// Hide overlay
mge.setOverlay(null);

// Resize event
addEventListener('resize', event => mge.resize());
mge.resize();

// Fullscreen section event
document.querySelector('.mge-overlay #fullscreen').addEventListener('click', event => mge.setFullscreen('on'));
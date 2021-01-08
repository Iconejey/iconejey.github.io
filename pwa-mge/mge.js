// game time
var time = 0;
var delay = 0;

// Joystick object
let joystick_obj = side => {
	let j = {
		id: -1,
		side: side,
		active: false,

		ttrig: 200,
		rtrig: 0.2,
		rout: 2,

		tip: { x: 0, y: 0, r: { min: 7, max: 15, val: 10 }, active: 0, held: false, opacity: { min: 0, max: 1 }, elem: document.querySelector('span.joystick.' + (side == 'L' ? 'left' : 'right') + '.tip') },
		base: { x: 0, y: 0, r: { min: 7, max: 15, val: 10 }, active: 0, fixed: false, opacity: { min: 0, max: 1 }, elem: document.querySelector('span.joystick.' + (side == 'L' ? 'left' : 'right') + '.base') },

		prev: { x: 0, y: 0 },
		pos: { x: 0, y: 0, d: 0 },

		time: 0,

		// Tap event
		onTap: j => {},

		// Push events
		onPushStart: j => {},
		onPush: j => {},
		onPushEnd: j => {},

		// Hold events
		onHoldStart: j => {},
		onHold: j => {},
		onHoldEnd: j => {},

		position: _ => {},
		setActive: mode => {},
		draw: ctx => {},
		update: _ => {},
		updatePos: _ => {},

		color: 'white'
	};

	j.setActive = mode => {
		if (mode != j.active) {
			j.active = mode;

			if (mode) {
				j.tip.elem.style.opacity = 1;
				j.base.elem.style.opacity = 1;

				j.position();

				j.tip.x = j.base.x;
				j.tip.y = j.base.y;
			}
		}
	};

	j.position = _ => {
		j.base.elem.classList.remove('transition');
		j.tip.elem.classList.remove('transition');

		let x = (mge.elem.clientWidth / 6) * (j.side == 'R' ? 5 : 1);
		let y = (mge.elem.clientHeight * 3) / 4;

		j.base.x = x;
		j.base.y = y;

		j.base.elem.style.left = j.base.x + 'px';
		j.base.elem.style.top = j.base.y + 'px';

		j.tip.elem.style.left = j.tip.x + 'px';
		j.tip.elem.style.top = j.tip.y + 'px';
	};

	j.updatePos = _ => {
		let r = j.base.elem.clientWidth / 2;
		let dx = j.tip.x - j.base.x;
		let dy = j.tip.y - j.base.y;
		let dxy = Math.sqrt(dx * dx + dy * dy);

		j.pos = { x: dx / r, y: dy / r, d: dxy / r };

		if (j.pos.d > j.rout) {
			j.tip.active = 0;
			j.base.active = 0;
		}
	};

	j.update = _ => {
		// To fix position
		let fix = _ => {
			if (j.base.fixed || !j.tip.active) {
				j.tip.x = j.base.x;
				j.tip.y = j.base.y;
			} else {
				j.base.x = j.tip.x;
				j.base.y = j.tip.y;
			}
		};

		if (j.tip.active) {
			if (j.base.active) {
				if (j.tip.held) {
					j.onHold(j);
					fix();
				} else j.onPush(j);
			} else {
				if (j.pos.d > j.rtrig) {
					j.base.active = true;
					j.onPushStart(j);
				} else if (time - j.time > j.ttrig) {
					j.base.active = true;
					j.tip.held = true;
					fix();
					j.onHoldStart(j);
				}
			}
		} else fix();

		// Set coords and size of tip and base elements
		for (let part of ['tip', 'base']) {
			j[part].elem.style.left = j[part].x + 'px';
			j[part].elem.style.top = j[part].y + 'px';
			j[part].elem.style.width = j[part].r.val * 2 + 'vh';
			j[part].elem.style.height = j[part].r.val * 2 + 'vh';

			let timed = time - j.time > j.ttrig * 2.8;

			if (j.tip.held) {
				j[part].elem.classList[timed ? 'remove' : 'add']('transition');
				j[part].elem.style.opacity = j[part].opacity.max;
			} else if (j[part].active) {
				j[part].elem.classList.remove('transition');
				j[part].elem.style.opacity = j[part].opacity.max;
			} else if (j.tip.active && !j.base.active) {
				j.base.elem.classList.remove('transition');
			} else {
				j[part].elem.classList.add('transition');
				j[part].elem.style.opacity = j.active ? j[part].opacity.min : 0;
			}
		}

		j.base.r.val = j.tip.held ? j.base.r.min - 1 : j.base.r.max;
		j.tip.r.val = j.tip.r.min;
	};

	return j;
};

// Game engine object
var mge = {
	elem: document.querySelector('div.mge-main'),
	canvas: document.querySelector('.mge-main canvas'),
	overlay: document.querySelector('.mge-main .mge-overlay'),

	camera: {
		x: 128,
		y: 128,
		z: 128,
		update: _ => {
			let scale = mge.elem.clientHeight / mge.camera.z;
			let size = scale * mge.canvas.width;

			// Resize canvas
			mge.canvas.clientWidth = size + 'px';
			mge.canvas.clientHeight = size + 'px';

			// Move canvas
			mge.canvas.style.left = -mge.camera.x * scale + 'px';
			mge.canvas.style.top = -mge.camera.y * scale + 'px';
		},
		setOn: (obj, ratio = 1) => {
			mge.camera.x = mge.camera.x * (1 - ratio) + obj.x * ratio;
			mge.camera.y = mge.camera.y * (1 - ratio) + obj.y * ratio;
		}
	},

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
		mge.landscapeMode = innerWidth > innerHeight;
		mge.fullscreenOn = Boolean(document.fullscreenElement);

		let section = mge.overlayContent;
		if (!mge.landscapeMode) section = 'landscape';
		if (!mge.fullscreenOn && mge.forceFullscreen) section = 'fullscreen';
		mge.setOverlay(section);

		mge.joysticks.forEach(j => j.position());
	},

	toGameCoords: coords => {
		let scale = mge.elem.clientHeight / mge.camera.z;
		return {
			x: (coords.x - parseInt(mge.canvas.style.left) - mge.elem.clientWidth / 2) / scale,
			y: (coords.y - parseInt(mge.canvas.style.top) - mge.elem.clientHeight / 2) / scale
		};
	},

	toScreenCoords: coords => {
		let scale = mge.elem.clientHeight / mge.camera.z;
		return {
			x: (coords.x - parseInt(mge.canvas.style.left) - mge.elem.clientWidth / 2) / scale,
			y: (coords.y - parseInt(mge.canvas.style.top) - mge.elem.clientHeight / 2) / scale
		};
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
document.querySelector('.tactile').addEventListener('touchstart', event => {
	event.preventDefault();

	for (let t of event.changedTouches) {
		let x = t.clientX;
		let y = t.clientY;

		let j = mge.joysticks[x < mge.elem.clientWidth / 2 ? 'L' : 'R'];

		if (!j.active) return;

		j.id = t.identifier;
		j.tip.x = x;
		j.tip.y = y;

		j.prev.x = x;
		j.prev.y = y;

		if (!j.base.fixed) {
			j.base.x = j.tip.x;
			j.base.y = j.tip.y;
		}

		j.updatePos();

		let r = j.base.elem.clientWidth / 2;

		if (j.pos.d * r > r) {
			j.pos = { x: 0, y: 0, d: 0 };
			j.tip.x = j.base.x;
			j.tip.y = j.base.y;
		} else {
			j.time = time;
			j.tip.active = true;
		}
	}
});

document.querySelector('.tactile').addEventListener('touchmove', event => {
	event.preventDefault();

	for (let t of event.changedTouches) {
		let x = t.clientX;
		let y = t.clientY;

		mge.joysticks.forEach(j => {
			if (j.id == t.identifier && j.tip.active) {
				j.prev = { ...j.tip };

				j.tip.x = x;
				j.tip.y = y;

				j.updatePos();

				if (j.pos.d > 1) {
					let r = j.base.elem.clientWidth / 2;

					if (j.base.fixed) {
						j.tip.x = j.base.x + (j.pos.x * r) / j.pos.d;
						j.tip.y = j.base.y + (j.pos.y * r) / j.pos.d;
					} else {
						j.base.x = j.tip.x - (j.pos.x * r) / j.pos.d;
						j.base.y = j.tip.y - (j.pos.y * r) / j.pos.d;
					}

					j.updatePos();
				}
			}
		});
	}
});

document.querySelector('.tactile').addEventListener('touchend', event => {
	event.preventDefault();

	for (let t of event.changedTouches) {
		let x = t.clientX;
		let y = t.clientY;

		mge.joysticks.forEach(j => {
			if (j.id == t.identifier) {
				if (j.tip.active) {
					if (j.base.active) {
						if (j.tip.held) j.onHoldEnd(j);
						else j.onPushEnd(j);
					} else j.onTap(j);
				}

				j.tip.active = false;
				j.base.active = false;
				j.tip.held = false;

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

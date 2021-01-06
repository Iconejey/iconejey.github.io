// Setting left joystick as fixed with 0.2 min opacity
mge.joysticks.L.base.fixed = true;
mge.joysticks.L.base.opacity.min = 0.2;
mge.joysticks.L.tip.opacity.min = 0.2;

// Activating joysticks after 1s
setTimeout(_ => mge.joysticks.forEach(j => j.setActive(true)), 1000);

// Showing example section on left joystick tap
mge.joysticks.L.onTap = j => mge.setOverlay('example');

// Logic loop
mge.logic = _ => {
	// mge.canvas.style.left = '100px';
};

// Graphics loop
mge.graphics = _ => {
	// Clear canvas
	mge.clear();

	// Drawing background
	mge.ctx.drawImage(imgs['default_background'], 0, 0);
};

// mge.forceFullscreen = false;
// mge.resize();

// Game images
let imgs = [];

// Loading images
mge.loadImg(
	// In
	['./img/default_background.png'],
	// Out
	imgs,
	// When an image loaded
	p => console.log('loading ' + Math.floor(100 * p) + '%'),
	// If an error occurs
	src => console.error('Could not load ' + src),
	// When all images loaded
	_ => {
		// Set canvas size
		let bg = imgs['default_background'];
		mge.canvas.width = bg.width;
		mge.canvas.height = bg.height;

		// Main loop
		mge.tick(0);
	}
);

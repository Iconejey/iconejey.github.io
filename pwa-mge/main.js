// Setting left joystick as fixed with 0.2 min opacity
mge.joysticks.L.base.fixed = true;
mge.joysticks.L.base.opacity.min = 0.2;
mge.joysticks.L.tip.opacity.min = 0.2;

// Example player object
let player = { x: 0, y: 0 };

// Activating joysticks after 1s
setTimeout(_ => mge.joysticks.forEach(j => j.setActive(true)), 1000);

// Showing example section on left-joystick tap
mge.joysticks.L.onTap = j => mge.setOverlay('example');

// Make player jump to the zone tapped with right-joystick
mge.joysticks.R.onTap = j => (player = mge.toGameCoords(j.tip));

// Move player with left-joystick push
mge.joysticks.L.onPush = j => {
	player.x += (j.pos.x * delay) / 20;
	player.y += (j.pos.y * delay) / 20;
};

// Move player with right-joystick hold
mge.joysticks.R.onHold = j => {
	let pos = mge.toGameCoords(j.tip);
	let prev = mge.toGameCoords(j.prev);
	player.x += prev.x - pos.x;
	player.y += prev.y - pos.y;
};

// Logic loop
mge.logic = _ => {};

// Graphics loop
mge.graphics = _ => {
	// Clear canvas
	mge.clear();

	// Set camera on player
	mge.camera.setOn(player, 0.05);

	// Update camera
	mge.camera.update();

	// Draw background
	mge.ctx.drawImage(imgs['default_background'], 0, 0);

	// Draw player
	mge.ctx.fillStyle = 'white';
	let x = Math.floor(player.x);
	let y = Math.floor(player.y);
	mge.ctx.fillRect(x, y, 1, 1);
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

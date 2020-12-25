// Setting left joystick as fixed with 0.2 min opacity
mge.joysticks.L.fixed = true;
mge.joysticks.L.min_op = 0.2;

// Showing example section on left joystick tap
mge.joysticks.L.onTap = (x, y) => mge.setOverlay('example');

// Logic loop
mge.logic = () => {
	// Setting left joystick position
	mge.joysticks.L.base.x = mge.canvas.width / 6;
	mge.joysticks.L.base.y = (mge.canvas.height * 3) / 4;
};

// Graphics loop
mge.graphics = () => {
	mge.clear();

	mge.joysticks.L.draw(mge.ctx);
	mge.joysticks.R.draw(mge.ctx);
};

// Main loop
mge.tick(0);

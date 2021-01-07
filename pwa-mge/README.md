---
permalink: pwa-mge/documentation.html
---

# Progressive Web App - Mobile Game Engine

See working example [here](https://iconejey.github.io/pwa-mge/).

## Project structure example:

```
project
├───index.html
├───style.css
├───main.js
├───img
│    ├───icon192.png
│    └───icon512.png
└───manifest.html
```

## Required for head:

```html
<!-- [Optional] App compatibility and display -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />

<!-- [Optional] Theme color / icon -->
<meta name="theme-color" content="#181818" />
<link rel="shortcut icon" href="/img/icon512.png" type="image/x-icon" />
<link rel="apple-touch-icon" href="./img/icon192.png" />

<!-- [Required] Manifest and stylesheet -->
<link rel="manifest" href="./manifest.json" />
<link rel="stylesheet" href="https://iconejey.github.io/pwa-mge/mge.css" />
<link rel="stylesheet" href="./style.css" />
```

## Required for body:

```html
<!-- [Required] Mobile Game Engine Element -->
<div class="mge-main">
	<!-- [Required] Game canvas -->
	<canvas></canvas>

	<!-- [Required] Sections shown over canvas using mge.setOverlay(id) -->
	<div class="mge-overlay">
		<!-- [Required] Lanscape section -->
		<section id="landscape">
			<p>Over the canvas when screen not held in landscape mode.</p>
		</section>

		<!-- [Required] Fullscreen section -->
		<section id="fullscreen">
			<p>Over the canvas when game not in fullscreen and mge.forceFulscreen is true.<br />Tap on screen to go fullscreen.</p>
		</section>

		<!-- [Optional] Custom section -->
		<section id="example">
			<p>Example of custom overlay.</p>
			<a onclick="mge.setOverlay(null)">[exit]</a>
			<img src="./img/icon192.png" alt="icon" />
		</section>
	</div>
</div>

<!-- [Optional] Cookie tools -->
<script src="https://iconejey.github.io/pwa-mge/cookie.js"></script>

<!-- [Required] Mobile Game Engine -->
<script src="https://iconejey.github.io/pwa-mge/mge.js"></script>

<!-- [Required] Main script -->
<script src="./main.js"></script>
```

## style.css example use:

```css
/* Html */
html {
	background-color: #181818;
	font-family: monospace;
}

/* Style applied to canvas */
.mge-main canvas {
	height: 200vh;
}

/* Style applied to canvas when the example section is shown */
.mge-canvas-on-example-section {
	filter: blur(5px);
}

/* Style applied to example section image */
.mge-overlay section#example img {
	position: absolute;
	width: 64px;
	left: 50%;
	top: 50%;
	border-radius: 20%;
	transform: translate(-50%, -50%);
}

/* Opaque sections's background */
.mge-overlay section.opaque {
	background-color: #181818;
}
```

## main.js example use:

```js
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

// Move player with left-joystick
mge.joysticks.L.onPush = j => {
	player.x += (j.pos.x * delay) / 20;
	player.y += (j.pos.y * delay) / 20;
};

// Logic loop
mge.logic = _ => {};

// Graphics loop
mge.graphics = _ => {
	// Clear canvas
	mge.clear();

	// Set camera on player
	mge.camera.setOn(player);

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

mge.forceFullscreen = false;
mge.resize();

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
```

## manifest.json example:

```json
{
	"name": "Mobile Game",
	"short_name": "Mobile Game",

	"start_url": "https://mygame.com/",
	"display": "fullscreen",
	"orientation": "landscape",

	"background_color": "white",
	"theme_color": "white",

	"icons": [
		{
			"src": "img/icon192.png",
			"sizes": "192x192",
			"type": "image/png",
			"purpose": "maskable"
		},
		{
			"src": "img/icon512.png",
			"sizes": "512x512",
			"type": "image/png",
			"purpose": "maskable"
		}
	]
}
```

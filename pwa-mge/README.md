---
permalink: instructions.html
---

# Progressive Web App - Mobile Game Engine

See working example [here](./pwa-mge/).

## Project structure:

```
project
├───index.html
├───main.js
├───img
│   ├───icon192.png
│   └───icon512.png
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
<link rel="shortcut icon" href="./img/icon512.png" type="image/x-icon" />
<link rel="apple-touch-icon" href="./img/icon192.png" />

<!-- [Required] Manifest and stylesheet -->
<link rel="manifest" href="./manifest.json" />
<link rel="stylesheet" href="mge.css" />
```

## Required for body:

```html
<!-- [Required] Mobile Game Engine Element (fullscreen) -->
<div class="mge-main">
	<canvas></canvas>

	<section>
		<p>Over the canvas when left joystick tap.</p>
		<a onclick="mge.covering('off')">[exit]</a>
	</section>
</div>

<!-- [Optional] Cookie tools -->
<script src="./cookie.js"></script>

<!-- [Required] Mobile Game Engine -->
<script src="./mge.js"></script>

<!-- [Required] Main script -->
<script src="./main.js"></script>
```

## main.js example use:

```js
// Setting left joystick as fixed with 0.2 min opacity
mge.joysticks.L.fixed = true;
mge.joysticks.L.min_op = 0.2;

// Fullscreen on right joystick tap
mge.joysticks.R.onTap = (x, y) => mge.fullscreen('on');

// Covering on left joystick tap
mge.joysticks.L.onTap = (x, y) => mge.covering();

// Blur when canvas at cover on
mge.atCoverOn = () => {
	mge.blur.targ = 1;
};

// Remove bluring at cover off
mge.atCoverOff = () => {
	mge.blur.targ = 0;
};

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
```

## Manifest.json example:

```json
{
	"name": "Mobile Game",
	"short_name": "Mobile Game",

	"start_url": "https://mygame.com/",
	"display": "fullscreen",
	"orientation": "any",

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

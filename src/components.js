// Dumb html template string function
const html = (strings, ...values) => {
	let str = '';
	strings.forEach((string, i) => {
		str += string + (values[i] || '');
	});
	return str;
};

// Animated wrting text component
customElements.define(
	'writing-text',
	class extends HTMLElement {
		constructor() {
			super();

			this.attachShadow({ mode: 'open' });
			this.shadowRoot.innerHTML = html`
				<style>
					:host {
						display: block;
					}

					slot {
						display: none;
					}

					.blink-cursor-char {
						display: inline-block;
						transform: translateX(-0.5em);
					}

					.blink-cursor-char.blink {
						animation: blink 1s linear infinite;
					}

					@keyframes blink {
						0%,
						50% {
							opacity: 0;
						}
						51%,
						100% {
							opacity: 1;
						}
					}
				</style>
				<slot></slot>
				<span id="text"></span>
				<span class="blink-cursor-char blink">_</span>
			`;
		}

		get cursor() {
			return this.shadowRoot.querySelector('.blink-cursor-char');
		}

		get text() {
			return this.shadowRoot.querySelector('#text').textContent;
		}

		set text(val) {
			this.shadowRoot.querySelector('#text').textContent = val;
		}

		connectedCallback() {
			setTimeout(() => {
				this.cursor.classList.remove('blink');
				this.typeText(0);
			}, 2300);
		}

		typeText(index) {
			let min_delay = 50;

			// If last character was a space, increase delay
			if (this.textContent[index] === ' ') min_delay = 200;

			if (index < this.textContent.length) {
				this.text += this.textContent[index];
				setTimeout(() => this.typeText(index + 1), Math.random() * 150 + min_delay);
			} else {
				this.cursor.classList.add('blink');
			}
		}
	}
);

const code = '######## ##################### ############ ########### ###### #\n	######################################## ##### ## #\n		#######################\n		### #### # # ## # # ############################ #### #\n			### # # ########################\n\n			### # # ######### # ######\n				# # ######### # ######\n			######################### # ### ######### ## # # ############### # # # ### # #### #######\n		#\n	###\n\n	####################################### ##### ## #\n		#######################\n		### #### # # ## # # ############################ #### #\n			### # # ########################\n			### # # ##########################\n\n			## ### #\n				################## # ###### ######### # #######\n			#\n		#\n	###\n\n	###################################### ##### ## #\n		#######################\n		### #### # # ## # # ############################ #### #\n			### # # ########################\n			### # # ##########################\n\n			## ### #\n				################# ##### ########### # ## # ##### # ########### ####### # ###\n				################################ ###\n			#\n		#\n		################## # #####################\n	###\n#\n\n##### ###### #\n	############## ## ##### ###### #\n		########## # # ## ## ## # ##\n		######## # # ## ## ## # ##\n		######### # #####\n		######### # # ### ## # ###### #### ## # ##### ##\n	#\n\n	######## #\n		###### # ## ########## # ############# ## ########## # ############ ##\n	#\n\n	######### #\n		### # # ##############\n		###### ############# # ### # ### # #####\n	#\n\n	######### ## #\n		########## # ##\n		########## # ##\n\n		### # # ##############\n		### # # ###############\n\n		## ## # ############## #\n			############ # ########## # #### # ## # ##############\n			############ # ########## # #### # ## # ##############\n		#\n	#\n\n	######### ###### #\n		############# # ######\n		############### # ######\n		############# # ##\n\n		################\n		##################### ############# ############## ## # # #########\n		#############\n\n		################\n		################### ########### ############# ## # # #########\n		###########\n	#\n#\n\n##### ###### #\n	############## ## ########### ############## #\n		######### # ###########\n		######### # ##############\n		######## # ##########\n\n		###### # ##\n		###### # ##\n	#\n\n	########## ## ###### ##### #\n		# ## ######\n		# ## ######\n		## ####### # # ## # # ###### # ############## ## ###### # # ## # # ###### # ################ #\n			######## # ##########\n			#######\n		#\n	#\n\n	############ #\n		####################### ####### ########\n	#\n#'.split(
	'\n'
);

let codeElem = document.getElementById('svg');
let pjob = document.getElementById('job');
let line = document.getElementById('line');

const setSvg = (start, end, offset) => {
	let svgCode = '';
	let sc = 6;
	let r = 3;
	let color = '#35363A';

	let offy = -offset;
	for (let i = start; i < end; i++) {
		let line = code[i % code.length];
		let offx = 2;
		let trait = null;
		for (let c of line) {
			if (!' \t\n'.includes(c)) {
				if (!trait) {
					trait = offx;
					svgCode += `<circle cx='${Math.floor(offx * sc)}' cy='${Math.floor(
						offy * sc
					)}' r='${r}' fill='${color}' />`;
				}
			} else {
				if (trait) {
					svgCode += `<circle cx='${Math.floor((offx - 1) * sc)}' cy='${Math.floor(
						offy * sc
					)}' r='${r}' fill='${color}' />`;

					if (trait - offx - 1)
						svgCode += `<line x1='${trait * sc}' y1='${Math.floor(offy * sc)}' x2='${Math.floor(
							(offx - 1) * sc
						)}' y2='${Math.floor(offy * sc)}' style='stroke: ${color}; stroke-width: ${r * 2};' />`;

					trait = null;
				}
			}

			offx += c == '\t' ? 4 : 1;
		}
		offy += 2;
	}

	codeElem.innerHTML = svgCode;
};

let frame = 0;
const tick = () => {
	frame++;
	setSvg(Math.floor(frame / 20), Math.floor(frame / 20 + 24), (frame % 20) / 10);
	pjob.innerHTML = 'Étudiant L2 Info';
	if ((frame / 30) % 2 > 1) pjob.innerHTML += '_';
	line.innerHTML = `<line x1='${window.innerWidth / 10}' y1='0' x2='${
		(window.innerWidth / 10) * 9
	}' y2='0' style='stroke: #eee; stroke-width: 2;' />`;
	requestAnimationFrame(tick);
};

window.onload = () => {
	tick();
	new Glider(document.querySelector('.glider'), {
		slidesToShow: 1,
		dots: '#dots',
		draggable: true,
		arrows: {
			prev: '.glider-prev',
			next: '.glider-next'
		},
		responsive: [
			{
				breakpoint: 1100,
				settings: {
					slidesToShow: 2.5
				}
			},
			{
				breakpoint: 900,
				settings: {
					slidesToShow: 2
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1.5
				}
			}
		]
	});
};

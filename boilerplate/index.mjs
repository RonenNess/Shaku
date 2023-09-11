import Shaku from "https://esm.sh/shaku";

async function runGame() {
	// init shaku
	await Shaku.init();

	// add shaku's canvas to document and set resolution to 800x600
	document.body.appendChild(Shaku.gfx.canvas);
	Shaku.gfx.setResolution(800, 600, true);

	// TODO: LOAD ASSETS AND INIT GAME LOGIC HERE

	// do a single main loop step and request next step inside
	function step() {
		// start a new frame and clear screen
		Shaku.startFrame();
		Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);

		// TODO: PUT YOUR GAME UPDATES AND RENDERING HERE

		// end frame and invoke the next step in 60 FPS rate (or more, depend on machine and browser)
		Shaku.endFrame();
		Shaku.requestAnimationFrame(step);
	}

	// start the main loop
	step();
};

await runGame();

import { assets } from "./assets";
import { collision } from "./collision";
import { gfx as _gfx } from "./gfx";
import { input as _input } from "./input";
import { sfx as _sfx } from "./sfx";
import { GameTime, IManager, Logger, LoggerFactory, utils } from "./utils";

const isBrowser: boolean = typeof window !== "undefined";

const sfx = isBrowser ? _sfx : null;
const gfx = isBrowser ? _gfx : null;
const input = isBrowser ? _input : null;

const _logger = LoggerFactory.getLogger("shaku");

/**
 * Shaku's main object.
 * This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.
*/
export class Shaku {
	/**
	 * Different utilities and framework objects, like vectors, rectangles, colors, etc.
	 */
	public utils: typeof utils;

	/**
	 * Sound effects and music manager.
	 */
	public sfx: typeof sfx;

	/**
	 * Graphics manager.
	 */
	public gfx: typeof gfx;

	/**
	 * Input manager.
	 */
	public input: typeof input;

	/**
	 * Assets manager.
	 */
	public assets: typeof assets;

	/**
	 * Collision detection manager.
	 */
	public collision: typeof collision;

	/**
	 * If true, will pause the updates and drawing calls when window is not focused.
	 * Will also not update elapsed time.
	 */
	public pauseWhenNotFocused: boolean;

	/**
	 * Set to true to completely pause Shaku (will skip updates, drawing, and time counting).
	 */
	public pause: boolean;

	/**
	 * Set to true to pause just the game time.
	 * This will not pause real-life time. If you need real-life time stop please use the Python package.
	 */
	public pauseGameTime: boolean;


	// is shaku in silent mode
	private isSilent = false;

	// manager state and gametime
	private usedManagers: IManager[] | null = null;
	private prevUpdateTime: GameTime | null = null;

	// current game time
	private gameTime: GameTime | null = null;

	// to measure fps
	private currFpsCounter = 0;
	private countSecond = 0;
	private currFps = 0;

	// to measure time it takes for frames to finish
	private startFrameTime = 0;
	private frameTimeMeasuresCount = 0;
	private totalFrameTimes = 0;

	// are managers currently in "started" mode?
	private managersStarted = false;

	// were we previously paused?
	private wasPaused = false;

	// current version
	private static readonly VERSION = "2.2.5";

	/**
	 * Create the Shaku main object.
	 */
	public constructor() {
		this.utils = utils;
		this.sfx = sfx;
		this.gfx = gfx;
		this.input = input;
		this.assets = assets;
		this.collision = collision;
		this.pauseWhenNotFocused = false;
		this.pause = false;
		this.pauseGameTime = false;
	}

	/**
	 * Method to select managers to use + initialize them.
	 * @param managers Array with list of managers to use or null to use all.
	 * @returns promise to resolve when finish initialization.
	 */
	public async init(managers?: IManager[] | null): Promise<void> {
		return new Promise(async (resolve, _reject) => {
			// welcome message
			if(!this.isSilent) console.log(`%c\u{1F9D9} Shaku ${this.version}\n%c Game dev lib by Ronen Ness`, "color:orange; font-size: 18pt", "color:grey; font-size: 8pt");

			// sanity & log
			if(this.usedManagers) throw new Error("Already initialized!");
			_logger.info(`Initialize Shaku v${this.version}.`);

			// reset game start time
			GameTime.reset();

			// setup used managers
			this.usedManagers = managers || (isBrowser ? [assets, sfx!, gfx!, input!, collision] : [assets, collision]);

			// init all managers
			for(let i = 0; i < this.usedManagers.length; ++i) await this.usedManagers[i].setup();

			// set starting time
			this.prevUpdateTime = new GameTime();

			// done!
			_logger.info(`Shaku ${this.version} was initialized successfully!`);
			_logger.info(`------------------------------------------------`);
			resolve();
		});
	}

	/**
	 * Destroy all managers
	 */
	public destroy(): void {
		// sanity
		if(!this.usedManagers) throw new Error("Not initialized!");

		// destroy all managers
		for(let i = 0; i < this.usedManagers.length; ++i) this.usedManagers[i].destroy();
	}

	/**
	 * Get if the Shaku is currently paused, either because the "paused" property is set, or because the document is not focused.
	 * @returns True if currently paused for any reason.
	 */
	public isCurrentlyPaused(): boolean {
		return this.pause
			|| (this.pauseWhenNotFocused && !document.hasFocus());
	}

	/**
	 * Start frame (update all managers).
	 */
	public startFrame(): void {
		// sanity
		if(!this.usedManagers) throw new Error("Not initialized!");

		// if paused, skip
		if(this.isCurrentlyPaused()) {
			if(this.input) this.input.startFrame();
			GameTime.updateRawData();
			this.gameTime = new GameTime();
			this.wasPaused = true;
			return;
		}

		// returning from pause
		if(this.wasPaused) {
			this.wasPaused = false;
			GameTime.resetDelta();
		}

		// reset delta if paused
		if(this.pauseGameTime) GameTime.resetDelta();
		// update game time
		else GameTime.update();

		// get frame start time
		this.startFrameTime = GameTime.rawTimestamp();

		// create new gameTime object to freeze values
		this.gameTime = new GameTime();

		// update animators
		utils.Animator.updatePlayingAnimations(this.gameTime.delta);

		// update managers
		for(let i = 0; i < this.usedManagers.length; ++i) this.usedManagers[i].startFrame();
		this.managersStarted = true;
	}

	/**
	 * End frame (update all managers).
	 */
	public endFrame(): void {
		// sanity
		if(!this.usedManagers) throw new Error("Not initialized!");

		// update managers
		if(this.managersStarted) {
			for(let i = 0; i < this.usedManagers.length; ++i) this.usedManagers[i].endFrame();
			this.managersStarted = false;
		}

		// if paused, skip
		if(this.isCurrentlyPaused()) {
			if(this.input) this.input.endFrame();
			return;
		}

		// store previous gameTime object
		this.prevUpdateTime = this.gameTime;

		// count fps and time stats
		if(this.gameTime) this.updateFpsAndTimeStats();
	}

	/**
	 * Measure FPS and average update times.
	 */
	private updateFpsAndTimeStats(): void {
		// update fps count and second counter
		this.currFpsCounter++;
		this.countSecond += this.gameTime!.delta; // only called from inside a "if (_gameTime) {}" block, so we can use ! safely.

		// a second passed:
		if(this.countSecond >= 1) {

			// reset second count and set current fps value
			this.countSecond = 0;
			this.currFps = this.currFpsCounter;
			this.currFpsCounter = 0;

			// trim the frames avg time, so we won't drag peaks for too long
			this.totalFrameTimes = this.getAverageFrameTime();
			this.frameTimeMeasuresCount = 1;
		}

		// get frame end time and update average frames time
		GameTime.updateRawData();
		const endFrameTime = GameTime.rawTimestamp();
		this.frameTimeMeasuresCount++;
		this.totalFrameTimes += (endFrameTime - this.startFrameTime);
	}

	/**
	 * Make Shaku run in silent mode, without logs.
	 * You can call this before init.
	 */
	public silent(): void {
		this.isSilent = true;
		LoggerFactory.silent();
	}

	/**
	 * Set logger to throw an error every time a log message with severity higher than warning is written.
	 * You can call this before init.
	 * @param enable Set to true to throw error on warnings.
	 */
	public throwErrorOnWarnings(enable: boolean): void {
		_logger.throwErrorOnWarnings(enable);
	}

	/**
	 * Get current frame game time.
	 * Only valid between startFrame() and endFrame().
	 * @returns Current frame's gametime.
	 */
	public getGameTime(): GameTime {
		if(this.gameTime === null) throw new Error("gameTime() is only valid between startFrame() and endFrame()");
		return this.gameTime;
	}

	/**
	 * Get Shaku's version.
	 * @returns Shaku's version.
	 */
	public getVersion(): string {
		return Shaku.VERSION;
	}

	/**
	 * Return current FPS count.
	 * Note: will return 0 until at least one second have passed.
	 * @returns FPS count.
	 */
	public getFpsCount(): number {
		return this.currFps;
	}

	/**
	 * Get how long on average it takes to complete a game frame.
	 * @returns Average time, in milliseconds, it takes to complete a game frame.
	 */
	public getAverageFrameTime(): number {
		if(this.frameTimeMeasuresCount === 0) return 0;
		return this.totalFrameTimes / this.frameTimeMeasuresCount;
	}

	/**
	 * Request animation frame with fallbacks.
	 * @param callback Method to invoke in next animation frame.
	 * @returns Handle for cancellation.
	 */
	public requestAnimationFrame(callback: () => void): number {
		if(window.requestAnimationFrame) return window.requestAnimationFrame(callback);
		else return setTimeout(callback, 1000 / 60);
	}

	/**
	 * Cancel animation frame with fallbacks.
	 * @param id Request handle.
	 */
	public cancelAnimationFrame(id: number): void {
		if(window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
		else clearTimeout(id);
	}

	/**
	 * Set the logger writer class (will replace the default console output).
	 * @param {*} loggerHandler New logger handler (must implement trace, debug, info, warn, error methods).
	 */
	public setLogger(loggerHandler) {
		LoggerFactory.setDrivers(loggerHandler);
	}

	/**
	 * Get / create a custom logger.
	 * @returns Logger instance.
	 */
	public getLogger(name: string): Logger {
		return LoggerFactory.getLogger(name);
	}
}

// return the main Shaku object.
export const shaku = new Shaku();

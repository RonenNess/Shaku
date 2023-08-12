import { assets } from "./assets";
import { collision } from "./collision";
import { gfx as _gfx } from "./gfx";
import { input as _input } from "./input";
import { sfx as _sfx } from "./sfx";
import { GameTime, IManager, LoggerFactory, utils } from "./utils";

const isBrowser: boolean = typeof window !== "undefined";

const sfx = isBrowser ? _sfx : null;
const gfx = isBrowser ? _gfx : null;
const input = isBrowser ? _input : null;

const _logger = LoggerFactory.getLogger("shaku");

// is shaku in silent mode
var _isSilent: boolean = false;

// manager state and gametime
let _usedManagers: IManager[] | null = null;
let _prevUpdateTime = null;

// current game time
let _gameTime: GameTime | null = null;

// to measure fps
let _currFpsCounter: number = 0;
let _countSecond: number = 0;
let _currFps: number = 0;

// to measure time it takes for frames to finish
let _startFrameTime: number = 0;
let _frameTimeMeasuresCount: number = 0;
let _totalFrameTimes: number = 0;

// are managers currently in "started" mode?
let _managersStarted: boolean = false;

// were we previously paused?
let _wasPaused: boolean = false;

// current version
const version = "2.2.5";

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
	 * @name Shaku#assets
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
		return new Promise(async (resolve, reject) => {
			// welcome message
			if(!_isSilent) {
				console.log(`%c\u{1F9D9} Shaku ${version}\n%c Game dev lib by Ronen Ness`, "color:orange; font-size: 18pt", "color:grey; font-size: 8pt");
			}

			// sanity & log
			if(_usedManagers) { throw new Error("Already initialized!"); }
			_logger.info(`Initialize Shaku v${version}.`);

			// reset game start time
			GameTime.reset();

			// setup used managers
			_usedManagers = managers || (isBrowser ? [assets, sfx!, gfx!, input!, collision] : [assets, collision]);

			// init all managers
			for(let i = 0; i < _usedManagers.length; ++i) {
				await _usedManagers[i].setup();
			}

			// set starting time
			_prevUpdateTime = new GameTime();

			// done!
			_logger.info(`Shaku ${version} was initialized successfully!`);
			_logger.info(`------------------------------------------------`);
			resolve();
		});
	}

	/**
	 * Destroy all managers
	 */
	public destroy(): void {
		// sanity
		if(!_usedManagers) {
			throw new Error("Not initialized!");
		}

		// destroy all managers
		for(let i = 0; i < _usedManagers.length; ++i) {
			_usedManagers[i].destroy();
		}
	}

	/**
	 * Get if the Shaku is currently paused, either because the "paused" property is set, or because the document is not focused.
	 * @returns True if currently paused for any reason.
	 */
	public isCurrentlyPaused(): boolean {
		return this.pause || (this.pauseWhenNotFocused && !document.hasFocus());
	}

	/**
	 * Start frame (update all managers).
	 */
	public startFrame(): void {
		// sanity
		if(!_usedManagers) throw new Error("Not initialized!");

		// if paused, skip
		if(this.isCurrentlyPaused()) {
			if(this.input) {
				this.input.startFrame();
			}
			GameTime.updateRawData();
			_gameTime = new GameTime();
			_wasPaused = true;
			return;
		}

		// returning from pause
		if(_wasPaused) {
			_wasPaused = false;
			GameTime.resetDelta();
		}

		// reset delta if paused
		if(this.pauseGameTime) {
			GameTime.resetDelta();
		}
		// update game time
		else {
			GameTime.update();
		}

		// get frame start time
		_startFrameTime = GameTime.rawTimestamp();

		// create new gameTime object to freeze values
		_gameTime = new GameTime();

		// update animators
		utils.Animator.updatePlayingAnimations(_gameTime.delta);

		// update managers
		for(let i = 0; i < _usedManagers.length; ++i) {
			_usedManagers[i].startFrame();
		}
		_managersStarted = true;
	}

	/**
	 * End frame (update all managers).
	 */
	public endFrame(): void {
		// sanity
		if(!_usedManagers) throw new Error("Not initialized!");

		// update managers
		if(_managersStarted) {
			for(let i = 0; i < _usedManagers.length; ++i) {
				_usedManagers[i].endFrame();
			}
			_managersStarted = false;
		}

		// if paused, skip
		if(this.isCurrentlyPaused()) {
			if(this.input) {
				this.input.endFrame();
			}
			return;
		}

		// store previous gameTime object
		_prevUpdateTime = _gameTime;

		// count fps and time stats
		if(_gameTime) {
			this.#_updateFpsAndTimeStats();
		}
	}

	/**
	 * Measure FPS and averege update times.
	 * @private
	 */
	#_updateFpsAndTimeStats(): void {
		// update fps count and second counter
		_currFpsCounter++;
		_countSecond += _gameTime.delta;

		// a second passed:
		if(_countSecond >= 1) {

			// reset second count and set current fps value
			_countSecond = 0;
			_currFps = _currFpsCounter;
			_currFpsCounter = 0;

			// trim the frames avg time, so we won't drag peaks for too long
			_totalFrameTimes = this.getAverageFrameTime();
			_frameTimeMeasuresCount = 1;
		}

		// get frame end time and update average frames time
		GameTime.updateRawData();
		let _endFrameTime = GameTime.rawTimestamp();
		_frameTimeMeasuresCount++;
		_totalFrameTimes += (_endFrameTime - _startFrameTime);
	}

	/**
	 * Make Shaku run in silent mode, without logs.
	 * You can call this before init.
	 */
	public silent(): void {
		_isSilent = true;
		logger.silent();
	}

	/**
	 * Set logger to throw an error every time a log message with severity higher than warning is written.
	 * You can call this before init.
	 * @param enable Set to true to throw error on warnings.
	 */
	public throwErrorOnWarnings(enable: boolean): void {
		if(enable === undefined) { throw new Error("Must provide a value!"); }
		logger.throwErrorOnWarnings(enable);
	}

	/**
	 * Get current frame game time.
	 * Only valid between startFrame() and endFrame().
	 * @returns Current frame's gametime.
	 */
	public get gameTime(): GameTime {
		return _gameTime;
	}

	/**
	 * Get Shaku's version.
	 * @returns Shaku's version.
	 */
	public get version(): string {
		return version;
	}

	/**
	 * Return current FPS count.
	 * Note: will return 0 until at least one second have passed.
	 * @returns FPS count.
	 */
	public getFpsCount(): number {
		return _currFps;
	}

	/**
	 * Get how long on average it takes to complete a game frame.
	 * @returns Average time, in milliseconds, it takes to complete a game frame.
	 */
	public getAverageFrameTime(): number {
		if(_frameTimeMeasuresCount === 0) { return 0; }
		return _totalFrameTimes / _frameTimeMeasuresCount;
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
		logger.setDrivers(loggerHandler);
	}

	/**
	 * Get / create a custom logger.
	 * @returns {Logger} Logger instance.
	 */
	public getLogger(name: string): Logger {
		return LoggerFactory.getLogger(name);
	}
};

// return the main Shaku object.
export const shaku = new Shaku();

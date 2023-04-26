declare const _exports: Shaku;
export = _exports;
/**
 * Shaku's main object.
 * This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.
*/
declare class Shaku {
    /**
     * Different utilities and framework objects, like vectors, rectangles, colors, etc.
     * @name Shaku#utils
     * @type {Utils}
     */
    utils: Utils;
    /**
     * Sound effects and music manager.
     * @name Shaku#sfx
     * @type {Sfx}
     */
    sfx: Sfx;
    /**
     * Graphics manager.
     * @name Shaku#gfx
     * @type {Gfx}
     */
    gfx: Gfx;
    /**
     * Input manager.
     * @name Shaku#input
     * @type {Input}
     */
    input: Input;
    /**
     * Assets manager.
     * @name Shaku#assets
     * @type {Assets}
     */
    assets: Assets;
    /**
     * Collision detection manager.
     * @name Shaku#collision
     * @type {Collision}
     */
    collision: Collision;
    /**
     * If true, will pause the updates and drawing calls when window is not focused.
     * Will also not update elapsed time.
     * @name Shaku#pauseWhenNotFocused
     * @type {Boolean}
     */
    pauseWhenNotFocused: boolean;
    /**
     * Set to true to completely pause Shaku (will skip updates, drawing, and time counting).
     * @name Shaku#pause
     * @type {Boolean}
     */
    pause: boolean;
    /**
     * Set to true to pause just the game time.
     * This will not pause real-life time. If you need real-life time stop please use the Python package.
     * @name Shaku#pauseGameTime
     * @type {Boolean}
     */
    pauseGameTime: boolean;
    /**
     * Method to select managers to use + initialize them.
     * @param {Array<IManager>=} managers Array with list of managers to use or null to use all.
     * @returns {Promise} promise to resolve when finish initialization.
     */
    init(managers?: Array<IManager> | undefined): Promise<any>;
    /**
     * Destroy all managers
     */
    destroy(): void;
    /**
     * Get if the Shaku is currently paused, either because the 'paused' property is set, or because the document is not focused.
     * @returns {Boolean} True if currently paused for any reason.
     */
    isCurrentlyPaused(): boolean;
    /**
     * Start frame (update all managers).
     */
    startFrame(): void;
    /**
     * End frame (update all managers).
     */
    endFrame(): void;
    /**
     * Make Shaku run in silent mode, without logs.
     * You can call this before init.
     */
    silent(): void;
    /**
     * Set logger to throw an error every time a log message with severity higher than warning is written.
     * You can call this before init.
     * @param {Boolean} enable Set to true to throw error on warnings.
     */
    throwErrorOnWarnings(enable: boolean): void;
    /**
     * Get current frame game time.
     * Only valid between startFrame() and endFrame().
     * @returns {GameTime} Current frame's gametime.
     */
    get gameTime(): GameTime;
    /**
     * Get Shaku's version.
     * @returns {String} Shaku's version.
     */
    get version(): string;
    /**
     * Return current FPS count.
     * Note: will return 0 until at least one second have passed.
     * @returns {Number} FPS count.
     */
    getFpsCount(): number;
    /**
     * Get how long on average it takes to complete a game frame.
     * @returns {Number} Average time, in milliseconds, it takes to complete a game frame.
     */
    getAverageFrameTime(): number;
    /**
     * Request animation frame with fallbacks.
     * @param {Function} callback Method to invoke in next animation frame.
     * @returns {Number} Handle for cancellation.
     */
    requestAnimationFrame(callback: Function): number;
    /**
     * Cancel animation frame with fallbacks.
     * @param {Number} id Request handle.
     */
    cancelAnimationFrame(id: number): any;
    /**
     * Set the logger writer class (will replace the default console output).
     * @param {*} loggerHandler New logger handler (must implement trace, debug, info, warn, error methods).
     */
    setLogger(loggerHandler: any): void;
    /**
     * Get / create a custom logger.
     * @returns {Logger} Logger instance.
     */
    getLogger(name: any): Logger;
    #private;
}
import IManager = require("./manager");
import GameTime = require("./utils/game_time");
//# sourceMappingURL=shaku.d.ts.map
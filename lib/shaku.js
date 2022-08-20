/**
 * Shaku Main.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\shaku.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const isBrowser = typeof window !== 'undefined';
const IManager = require("./manager");
const logger = require('./logger');
const sfx = isBrowser ? require('./sfx') : null;
const gfx = isBrowser ? require('./gfx') : null;
const input = isBrowser ? require('./input') : null;
const assets = require('./assets');
const collision = require('./collision');
const utils = require('./utils');
const GameTime = require("./utils/game_time");
const _logger = logger.getLogger('shaku');

// manager state and gametime
let _usedManagers = null;
let _prevUpdateTime = null;

// to measure fps
let _currFpsCounter = 0;
let _countSecond = 0;
let _currFps = 0;

// to measure time it takes for frames to finish
let _startFrameTime = 0;
let _frameTimeMeasuresCount = 0;
let _totalFrameTimes = 0;


// current version
const version = "1.5.8";


/**
 * Shaku's main object.
 * This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.
*/
class Shaku 
{
    /**
     * Create the Shaku main object.
     */
    constructor()
    {
        /**
         * Different utilities and framework objects, like vectors, rectangles, colors, etc.
         */
        this.utils = utils;

        /**
         * Sound effects and music manager.
         */
        this.sfx = sfx;

        /**
         * Graphics manager.
         */
        this.gfx = gfx;

        /**
         * Input manager.
         */
        this.input = input;

        /**
         * Assets manager.
         */
        this.assets = assets;

        /**
         * Collision detection manager.
         */
        this.collision = collision;

        /**
         * If true, will pause the updates and drawing calls when window is not focused.
         * Will also not update elapsed time.
         */
        this.pauseWhenNotFocused = false;

        /**
         * Set to true to completely pause Shaku (will skip updates, drawing, and time counting).
         */
        this.paused = false;

        /**
         * Set to true to pause just the game time.
         * This will not pause real-life time. If you need real-life time stop please use the Python package.
         */
        this.pauseTime = false;

        // are managers currently in 'started' mode?
        this._managersStarted = false;

        // were we previously paused?
        this._wasPaused = false;
    }

    /**
     * Method to select managers to use + initialize them.
     * @param {Array<IManager>} managers Array with list of managers to use or null to use all.
     * @returns {Promise} promise to resolve when finish initialization.
     */
    async init(managers)
    {
        return new Promise(async (resolve, reject) => {

            // sanity & log
            if (_usedManagers) { throw new Error("Already initialized!"); }
            _logger.info(`Initialize Shaku v${version}.`);
            
            // reset game start time
            GameTime.reset();

            // setup used managers
            _usedManagers = managers || (isBrowser ? [assets, sfx, gfx, input, collision] : [assets, collision]);

            // init all managers
            for (let i = 0; i < _usedManagers.length; ++i) {
                await _usedManagers[i].setup();
            }

            // set starting time
            _prevUpdateTime = new GameTime();

            // done!
            resolve();
        });
    }

    /**
     * Destroy all managers
     */
    destroy()
    {
        // sanity
        if (!_usedManagers) { throw new Error("Not initialized!"); }
        
        // destroy all managers
        for (let i = 0; i < _usedManagers.length; ++i) {
            _usedManagers[i].destroy();
        }
    }

    /**
     * Get if the Shaku is currently paused.
     */
    get isPaused()
    {
        return this.paused || (this.pauseWhenNotFocused && !document.hasFocus());
    }

    /**
     * Start frame (update all managers).
     */
    startFrame()
    {
        // if paused, skip
        if (this.isPaused) { 
            this._wasPaused = true;
            return; 
        }

        // returning from pause
        if (this._wasPaused) {
            this._wasPaused = false;
            GameTime.resetDelta();
        }

        // update times
        if (this.pauseTime) {
            GameTime.resetDelta();
        }
        else {
            GameTime.update();
        }

        // get frame start time
        _startFrameTime = GameTime.rawTimestamp();

        // create new gameTime object
        this._gameTime = new GameTime();

        // update animators
        utils.Animator.updateAutos(this._gameTime.delta);

        // update managers
        for (let i = 0; i < _usedManagers.length; ++i) {
            _usedManagers[i].startFrame();
        }
        this._managersStarted = true;
    }

    /**
     * End frame (update all managers).
     */
    endFrame()
    {
        // update managers
        if (this._managersStarted) {
            for (let i = 0; i < _usedManagers.length; ++i) {
                _usedManagers[i].endFrame();
            }
            this._managersStarted = false;
        }

        // if paused, skip
        if (this.isPaused) { return; }

        // store previous gameTime object
        _prevUpdateTime = this._gameTime;

        // count fps and time stats
        if (this._gameTime) {
            this._updateFpsAndTimeStats();
        }
    }

    /**
     * Measure FPS and averege update times.
     * @private
     */
    _updateFpsAndTimeStats()
    {
        // update fps count and second counter
        _currFpsCounter++;
        _countSecond += this._gameTime.delta;

        // a second passed:
        if (_countSecond >= 1) {

            // reset second count and set current fps value
            _countSecond = 0;
            _currFps = _currFpsCounter;
            _currFpsCounter = 0;

            // trim the frames avg time, so we won't drag peaks for too long
            _totalFrameTimes = this.getAverageFrameTime();
            _frameTimeMeasuresCount = 1;
        }

        // get frame end time and update average frames time
        let _endFrameTime = GameTime.rawTimestamp();
        _frameTimeMeasuresCount++;
        _totalFrameTimes += (_endFrameTime - _startFrameTime);
    }

    /**
     * Make Shaku run in silent mode, without logs.
     * You can call this before init.
     */
    silent()
    {
        logger.silent();
    }

    /**
     * Set logger to throw an error every time a log message with severity higher than warning is written.
     * You can call this before init.
     * @param {Boolean} enable Set to true to throw error on warnings.
     */
    throwErrorOnWarnings(enable)
    {
        if (enable === undefined) { throw Error("Must provide a value!"); }
        logger.throwErrorOnWarnings(enable);
    }

    /**
     * Get current frame game time.
     * Only valid between startFrame() and endFrame().
     * @returns {GameTime} Current frame's gametime.
     */
    get gameTime()
    {
        return this._gameTime;
    }

    /**
     * Get Shaku's version.
     * @returns {String} Shaku's version.
     */
    get version() { return version; }

    /**
     * Return current FPS count.
     * Note: will return 0 until at least one second have passed.
     * @returns {Number} FPS count.
     */
    getFpsCount()
    {
        return _currFps;
    }

    /**
     * Get how long on average it takes to complete a game frame.
     * @returns {Number} Average time, in milliseconds, it takes to complete a game frame.
     */
    getAverageFrameTime()
    {
        if (_frameTimeMeasuresCount === 0) { return 0; }
        return _totalFrameTimes / _frameTimeMeasuresCount;
    }

    /**
     * Request animation frame with fallbacks.
     * @param {Function} callback Method to invoke in next animation frame.
     * @returns {Number} Handle for cancellation.
     */
    requestAnimationFrame(callback) 
    { 
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.msRequestAnimationFrame) return window.msRequestAnimationFrame(callback);
        else return setTimeout(callback, 1000/60);
    }
 
    /**
     * Cancel animation frame with fallbacks.
     * @param {Number} id Request handle.
     */
    cancelAnimationFrame(id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else clearTimeout(id);
    }

    /**
     * Set the logger writer class (will replace the default console output).
     * @param {*} loggerHandler New logger handler (must implement trace, debug, info, warn, error methods).
     */
    setLogger(loggerHandler)
    {
        logger.setDrivers(loggerHandler);
    }

    /**
     * Get / create a custom logger.
     */
    getLogger(name)
    {
        return logger.getLogger(name);
    }
};


// return the main Shaku object.
module.exports = new Shaku();
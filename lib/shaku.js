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
const IManager = require("./manager");
const logger = require('./logger');
const sfx = require('./sfx');
const gfx = require('./gfx');
const input = require('./input');
const assets = require('./assets');
const utils = require('./utils');
const GameTime = require("./utils/game_time");

let _usedManagers = null;
let _prevUpdateTime = null;
let _currFpsCounter = 0;
let _countSecond = 0;
let _currFps = 0;

// current version
const version = "1.0.2";

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
        // export utils
        this.utils = utils;

        // provide access to all managers
        this.sfx = sfx;
        this.gfx = gfx;
        this.input = input;
        this.assets = assets;
    }

    /**
     * Method to select managers to use + initialize them.
     * @param {Array<IManager>} managers Array with list of managers to use or null to use all.
     * @returns {Promise} promise to resolve when finish initialization.
     */
     async init(managers)
    {
        return new Promise(async (resolve, reject) => {

            // sanity
            if (_usedManagers) { throw new Error("Already initialized!"); }
            
            // reset game start time
            GameTime.resetGameStartTime();

            // setup used managers
            _usedManagers = managers || [assets, sfx, gfx, input];

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
     * Start frame (update all managers).
     */
    startFrame()
    {
        // create new gameTime object
        this._gameTime = new GameTime(_prevUpdateTime);

        // update animators
        utils.Animator.updateAutos(this._gameTime.delta);

        // update managers
        for (let i = 0; i < _usedManagers.length; ++i) {
            _usedManagers[i].startFrame();
        }
    }

    /**
     * End frame (update all managers).
     */
    endFrame()
    {
        // update managers
        for (let i = 0; i < _usedManagers.length; ++i) {
            _usedManagers[i].endFrame();
        }

        // store previous gameTime object
        _prevUpdateTime = this._gameTime;

        // count fps 
        _currFpsCounter++;
        _countSecond += this._gameTime.delta;
        if (_countSecond >= 1) {
            _countSecond = 0;
            _currFps = _currFpsCounter;
            _currFpsCounter = 0;
        }
    }

    /**
     * Make Shaku run in silent mode, without logs.
     */
    silent()
    {
        logger.silent();
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
};

// create and return the main object.
module.exports = new Shaku();
/**
 * A utility to hold gametime.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\game_time.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

 
/**
 * Class to hold current game time (elapse and deltatime).
 */
class GameTime
{
    /**
     * create the gametime object with current time.
     */
    constructor()
    {
        /**
         * Current timestamp
         */
        this.timestamp = _currElapsed;

        /**
         * Delta time struct.
         * Contains: milliseconds, seconds.
         */
        this.deltaTime = {
            milliseconds: _currDelta,
            seconds: _currDelta / 1000.0,
        };

        /**
         * Elapsed time struct.
         * Contains: milliseconds, seconds.
         */
        this.elapsedTime = {
            milliseconds: _currElapsed,
            seconds: _currElapsed / 1000.0
        };

        /**
         * Delta time, in seconds, since last frame.
         */
        this.delta = this.deltaTime ? this.deltaTime.seconds : null;

        /**
         * Total time, in seconds, since Shaku was initialized.
         */
        this.elapsed = this.elapsedTime.seconds;

        // freeze object
        Object.freeze(this);
    }

    /**
     * Update game time.
     */
    static update()
    {
        // get current time
        let curr = getAccurateTimestampMs();

        // calculate delta time
        let delta = 0;
        if (_prevTime) {
            delta = curr - _prevTime;
        }

        // update previous time
        _prevTime = curr;

        // update delta and elapsed
        _currDelta = delta;
        _currElapsed += delta;
    }

    /**
     * Get raw timestamp in milliseconds.
     * @returns {Number} raw timestamp in milliseconds.
     */
    static rawTimestamp()
    {
        return getAccurateTimestampMs();
    }

    /**
     * Reset elapsed and delta time.
     */
    static reset()
    {
        _prevTime = null;
        _currDelta = 0;
        _currElapsed = 0;
    }

    /**
     * Reset current frame's delta time.
     */ 
    static resetDelta()
    {
        _prevTime = null;
        _currDelta = 0;
    }
}

// do we have the performance.now method?
const gotPerformance = (typeof performance !== 'undefined') && performance.now;

// get most accurate timestamp in milliseconds.
function getAccurateTimestampMs() {
    if (gotPerformance) {
        return performance.now();
    }
    return Date.now();
}

// previous time (to calculate delta).
var _prevTime = null;

// current delta and elapsed
var _currDelta = 0;
var _currElapsed = 0;

// export the GameTime class.
module.exports = GameTime;
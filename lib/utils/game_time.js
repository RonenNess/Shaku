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
     * @param {GameTime} prevTime The gameTime from previous call, required to calculate delta time from last frame.
     */
    constructor(prevTime)
    {
        // get current timestamp
        this.timestamp = getAccurateTimestampMs() - _startTime;
        
        /**
         * Elapsed time details in milliseconds and seconds.
         */
        this.elapsedTime = {
            milliseconds: this.timestamp - _startGameTime,
            seconds: (this.timestamp - _startGameTime) / 1000.0
        };

        // calculate delta times
        if (prevTime) {

            /**
             * Delta time details in milliseconds and seconds.
             */
            this.deltaTime = {
                milliseconds: this.timestamp - prevTime.timestamp,
                seconds: (this.timestamp - prevTime.timestamp) / 1000.0,
            };
        }
        else {
            this.deltaTime = null;
        }

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

// start time (from the moment this file was first included).
const _startTime = getAccurateTimestampMs();

// actually start game time (from the moment the game main loop started).
var _startGameTime = getAccurateTimestampMs();

// reset the time that represent the start of the game main loop.
GameTime.resetGameStartTime = () => {
    _startGameTime = getAccurateTimestampMs();
}

// export the method to get raw timestamp in milliseconds.
GameTime.rawTimestamp = getAccurateTimestampMs;

// export the GameTime class.
module.exports = GameTime;
/**
 * Implement a seeded random generator.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\seeded_random.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/**
 * Class to generate random numbers with seed.
 */
class SeededRandom
{
    /**
     * Create the seeded random object.
     * @param {Number} seed Seed to start from. If not provided, will use 0.
     */
    constructor(seed)
    {
        if (seed === undefined) { seed = 0; }
        this.seed = seed;
    }

    /**
     * Get next random value.
     * @param {Number} min Optional min value. If max is not provided, this will be used as max.
     * @param {Number} max Optional max value.
     * @returns {Number} A randomly generated value.
     */
    random(min, max)
    {
        // generate next value
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let rnd = this.seed / 233280;

        // got min and max?
        if (min && max) {
            return min + rnd * (max - min);
        }
        // got only min (used as max)?
        else if (min) {
            return rnd * min;
        }
        // no min nor max provided
        return rnd;
    }
    
    /**
     * Pick a random value from array.
     * @param {Array} options Options to pick random value from.
     * @returns {*} Random value from options array.
     */
    pick(options)
    {
        return options[Math.floor(this.random(options.length))];
    }
}

// export the seeded random class.
module.exports = SeededRandom;
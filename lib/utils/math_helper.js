/**
 * Implement a math utilities class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\math_helper.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

// for radians / degrees conversion
const _toRadsFactor = (Math.PI / 180);
const _toDegreesFactor = (180 / Math.PI);


/**
 * Implement some math utilities functions.
 */
class MathHelper
{
    /**
     * Perform linear interpolation between start and end values.
     * @param {Number} start Starting value.
     * @param {Number} end Ending value.
     * @param {Number} amount How much to interpolate from start to end.
     * @returns {Number} interpolated value between start and end.
     */
    static lerp(start, end, amount)
    {
        return ((1-amount) * start) + (amount * end);
    }

    /**
     * Convert degrees to radians.
     * @param {Number} degrees Degrees value to convert to radians.
     * @returns {Number} Value as radians.
     */
    static toRadians(degrees) 
    {
        return degrees * _toRadsFactor;
    }

    /**
     * Convert radians to degrees.
     * @param {Number} radians Radians value to convert to degrees.
     * @returns {Number} Value as degrees.
     */
    static toDegrees(radians) 
    {
        return radians * _toDegreesFactor;
    }


    /**
    * Find shortest distance between two radians.
    * @param {Number} a1 First radian.
    * @param {Number} a2 Second radian.
    * @returns {Number} Shortest distance between radians.
    */
    static radiansDistance(a1, a2)
    {
        var max = Math.PI * 2;
        var da = (a2 - a1) % max;
        return 2 * da % max - da;
    }

    /**
     * Perform linear interpolation between radian values.
     * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
     * @param {Number} a1 Starting value.
     * @param {Number} a2 Ending value.
     * @param {Number} alpha How much to interpolate from start to end.
     * @returns {Number} interpolated radians between start and end.
     */
    static lerpRadians(a1, a2, alpha)
    {
        return a1 + this.radiansDistance(a1, a2) * alpha;
    }

    /**
     * Perform linear interpolation between degrees.
     * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
     * @param {Number} a1 Starting value.
     * @param {Number} a2 Ending value.
     * @param {Number} alpha How much to interpolate from start to end.
     * @returns {Number} interpolated degrees between start and end.
     */
    static lerpDegrees(a1, a2, alpha)
    {
        // convert to radians
        a1 = this.toRadians(a1);
        a2 = this.toRadians(a2);

        // lerp
        var ret = this.lerpRadians(a1, a2, alpha);

        // convert back to degrees and return
        return this.toDegrees(ret);
    }

    /**
    * Round numbers from 10'th digit.
    * This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.
    * @param {Number} num Number to round.
    * @returns {Number} Rounded number.
    */
    static round10(num)
    {
        return Math.round(num * 100000000.0) / 100000000.0;
    }
}

/**
 * PI * 2 value.
 */
MathHelper.PI2 = Math.PI * 2;


// export the math helper
module.exports = MathHelper;
export = MathHelper;
/**
 * Implement some math utilities functions.
 */
declare class MathHelper {
    /**
     * Perform linear interpolation between start and end values.
     * @param {Number} start Starting value.
     * @param {Number} end Ending value.
     * @param {Number} amount How much to interpolate from start to end.
     * @returns {Number} interpolated value between start and end.
     */
    static lerp(start: number, end: number, amount: number): number;
    /**
     * Calculate 2d dot product.
     * @param {Number} x1 First vector x.
     * @param {Number} y1 First vector y.
     * @param {Number} x2 Second vector x.
     * @param {Number} y2 Second vector y.
     * @returns {Number} dot product result.
     */
    static dot(x1: number, y1: number, x2: number, y2: number): number;
    /**
     * Convert degrees to radians.
     * @param {Number} degrees Degrees value to convert to radians.
     * @returns {Number} Value as radians.
     */
    static toRadians(degrees: number): number;
    /**
     * Convert radians to degrees.
     * @param {Number} radians Radians value to convert to degrees.
     * @returns {Number} Value as degrees.
     */
    static toDegrees(radians: number): number;
    /**
    * Find shortest distance between two radians, with sign (ie distance can be negative).
    * @param {Number} a1 First radian.
    * @param {Number} a2 Second radian.
    * @returns {Number} Shortest distance between radians.
    */
    static radiansDistanceSigned(a1: number, a2: number): number;
    /**
    * Find shortest distance between two radians.
    * @param {Number} a1 First radian.
    * @param {Number} a2 Second radian.
    * @returns {Number} Shortest distance between radians.
    */
    static radiansDistance(a1: number, a2: number): number;
    /**
    * Find shortest distance between two angles in degrees, with sign (ie distance can be negative).
    * @param {Number} a1 First angle.
    * @param {Number} a2 Second angle.
    * @returns {Number} Shortest distance between angles.
    */
    static degreesDistanceSigned(a1: number, a2: number): number;
    /**
    * Find shortest distance between two angles in degrees.
    * @param {Number} a1 First angle.
    * @param {Number} a2 Second angle.
    * @returns {Number} Shortest distance between angles.
    */
    static degreesDistance(a1: number, a2: number): number;
    /**
     * Perform linear interpolation between radian values.
     * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
     * @param {Number} a1 Starting value.
     * @param {Number} a2 Ending value.
     * @param {Number} alpha How much to interpolate from start to end.
     * @returns {Number} interpolated radians between start and end.
     */
    static lerpRadians(a1: number, a2: number, alpha: number): number;
    /**
     * Perform linear interpolation between degrees.
     * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
     * @param {Number} a1 Starting value.
     * @param {Number} a2 Ending value.
     * @param {Number} alpha How much to interpolate from start to end.
     * @returns {Number} interpolated degrees between start and end.
     */
    static lerpDegrees(a1: number, a2: number, alpha: number): number;
    /**
    * Round numbers from 10'th digit.
    * This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.
    * @param {Number} num Number to round.
    * @returns {Number} Rounded number.
    */
    static round10(num: number): number;
    /**
     * Wrap degrees value to be between 0 to 360.
     * @param {Number} degrees Degrees to wrap.
     * @returns {Number} degrees wrapped to be 0-360 values.
     */
    static wrapDegrees(degrees: number): number;
}
declare namespace MathHelper {
    const PI2: number;
}
//# sourceMappingURL=math_helper.d.ts.map
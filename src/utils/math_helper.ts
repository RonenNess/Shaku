import { Vector3 } from "./shapes";


/**
 * Implement some math utilities functions.
*/
export abstract class MathHelper {
	/**
	 * PI * 2 value.
	 */
	public static PI2 = Math.PI * 2;

	// for radians / degrees conversion
	public static readonly TO_RADS_FACTOR = MathHelper.PI2 / 360;
	public static readonly TO_DEGREES_FACTOR = 360 / MathHelper.PI2;

	/**
	 * Perform linear interpolation between start and end values.
	 * @param start Starting value.
	 * @param end Ending value.
	 * @param amount How much to interpolate from start to end.
	 * @returns interpolated value between start and end.
	 */
	public static lerp(start: number, end: number, amount: number): number {
		// to prevent shaking on same values
		if(start === end) return end;

		// do lerping
		return ((1 - amount) * start) + (amount * end);
	}

	/**
	 * Calculate 2d dot product.
	 * @param x1 First vector x.
	 * @param y1 First vector y.
	 * @param x2 Second vector x.
	 * @param y2 Second vector y.
	 * @returns dot product result.
	 */
	public static dot(x1: number, y1: number, x2: number, y2: number): number {
		return x1 * x2 + y1 * y2;
	}

	/**
	 * Make a number a multiply of another number by rounding it up.
	 * @param numToRound Number to round up.
	 * @param multiple Number to make "numToRound" a multiply of.
	 * @returns Result number.
	 */
	public static roundToMultiple(numToRound: number, multiple: number): number {
		const isPositive = (numToRound >= 0);
		return ((numToRound + Number(isPositive) * (multiple - 1)) / multiple) * multiple;
	}

	/**
	 * Convert degrees to radians.
	 * @param degrees Degrees value to convert to radians.
	 * @returns Value as radians.
	 */
	public static toRadians(degrees: number): number {
		return degrees * MathHelper.TO_RADS_FACTOR;
	}

	/**
	 * Convert radians to degrees.
	 * @param radians Radians value to convert to degrees.
	 * @returns Value as degrees.
	 */
	public static toDegrees(radians: number): number {
		return radians * MathHelper.TO_DEGREES_FACTOR;
	}

	/**
	* Find shortest distance between two radians, with sign (ie distance can be negative).
	* @param a1 First radian.
	* @param a2 Second radian.
	* @returns Shortest distance between radians.
	*/
	public static radiansDistanceSigned(a1: number, a2: number): number {
		const max = MathHelper.PI2;
		const da = (a2 - a1) % max;
		return 2 * da % max - da;
	}

	/**
	* Find shortest distance between two radians.
	* @param a1 First radian.
	* @param a2 Second radian.
	* @returns Shortest distance between radians.
	*/
	public static radiansDistance(a1: number, a2: number): number {
		return Math.abs(MathHelper.radiansDistanceSigned(a1, a2));
	}

	/**
	* Find shortest distance between two angles in degrees, with sign (ie distance can be negative).
	* @param a1 First angle.
	* @param a2 Second angle.
	* @returns Shortest distance between angles.
	*/
	public static degreesDistanceSigned(a1: number, a2: number): number {
		const a1r = a1 * MathHelper.TO_RADS_FACTOR;
		const a2r = a2 * MathHelper.TO_RADS_FACTOR;
		const ret = MathHelper.radiansDistanceSigned(a1r, a2r);
		return ret * MathHelper.TO_DEGREES_FACTOR;
	}

	/**
	* Find shortest distance between two angles in degrees.
	* @param a1 First angle.
	* @param a2 Second angle.
	* @returns Shortest distance between angles.
	*/
	public static degreesDistance(a1: number, a2: number): number {
		const a1r = a1 * MathHelper.TO_RADS_FACTOR;
		const a2r = a2 * MathHelper.TO_RADS_FACTOR;
		const ret = MathHelper.radiansDistance(a1r, a2r);
		return ret * MathHelper.TO_DEGREES_FACTOR;
	}

	/**
	 * Perform linear interpolation between radian values.
	 * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
	 * @param a1 Starting value.
	 * @param a2 Ending value.
	 * @param alpha How much to interpolate from start to end.
	 * @returns interpolated radians between start and end.
	 */
	public static lerpRadians(a1: number, a2: number, alpha: number): number {
		// to prevent shaking on same values
		if(a1 === a2) return a2;

		// do lerping
		return a1 + MathHelper.radiansDistanceSigned(a1, a2) * alpha;
	}

	/**
	 * Perform linear interpolation between degrees.
	 * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
	 * @param a1 Starting value.
	 * @param a2 Ending value.
	 * @param alpha How much to interpolate from start to end.
	 * @returns interpolated degrees between start and end.
	 */
	public static lerpDegrees(a1: number, a2: number, alpha: number): number {
		// to prevent shaking on same values
		if(a1 === a2) return a2;

		// convert to radians
		a1 = MathHelper.toRadians(a1);
		a2 = MathHelper.toRadians(a2);

		// lerp
		const ret = MathHelper.lerpRadians(a1, a2, alpha);

		// convert back to degrees and return
		return MathHelper.wrapDegrees(MathHelper.toDegrees(ret));
	}

	/**
	* Round numbers from 10'th digit.
	* This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.
	* @param num Number to round.
	* @returns Rounded number.
	*/
	public static round10(num: number): number {
		const rounding = 10 ** 8;
		return Math.round(num * rounding) / rounding;
	}

	/**
	 * Wrap degrees value to be between 0 to 360.
	 * @param degrees Degrees to wrap.
	 * @returns degrees wrapped to be 0-360 values.
	 */
	public static wrapDegrees(degrees: number): number {
		degrees = degrees % 360;
		if(degrees < 0) degrees += 360;
		return degrees;
	}

	/**
	 * Calculate the normal vector of a polygon using 3 points on it.
	 * @param v1 Vector on the polygon.
	 * @param v2 Vector on the polygon.
	 * @param v3 Vector on the polygon.
	 * @returns Normal vector, normalized.
	 */
	public static calculateNormal(v1: Vector3, v2: Vector3, v3: Vector3): Vector3 {
		// create vectors between the points
		const _a = v2.sub(v1);
		const _b = v3.sub(v1);

		// calculate normal
		const surfaceNormal = new Vector3(0, 0, 0);
		surfaceNormal.x = (_a.y * _b.z) - (_a.z - _b.y);
		surfaceNormal.y = - ((_b.z * _a.x) - (_b.x * _a.z));
		surfaceNormal.z = (_a.x * _b.y) - (_a.y * _b.x);
		surfaceNormal.normalizeSelf();

		// return result
		return surfaceNormal;
	}

	private constructor() { }
}

import Vector3 from "./vector3";

// for radians / degrees conversion
const _toRadsFactor = (Math.PI / 180);
const _toDegreesFactor = (180 / Math.PI);

/**
 * Implement some math utilities functions.
 */
export default class MathHelper {

	/**
	 * PI * 2 value.
	 */
	public static PI2 = Math.PI * 2;

	/**
	 * Perform linear interpolation between start and end values.
	 * @param start Starting value.
	 * @param end Ending value.
	 * @param amount How much to interpolate from start to end.
	 * @returns interpolated value between start and end.
	 */
	public static lerp(start: number, end: number, amount: number): number {
		// to prevent shaking on same values
		if(start === end) { return end; }

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
	 * @param multiple Number to make 'numToRound' a multiply of.
	 * @returns Result number.
	 */
	public static roundToMultiple(numToRound: number, multiple: number): number {
		let isPositive = (numToRound >= 0);
		return ((numToRound + isPositive * (multiple - 1)) / multiple) * multiple;
	}

	/**
	 * Convert degrees to radians.
	 * @param degrees Degrees value to convert to radians.
	 * @returns Value as radians.
	 */
	public static toRadians(degrees: number): number {
		return degrees * _toRadsFactor;
	}

	/**
	 * Convert radians to degrees.
	 * @param radians Radians value to convert to degrees.
	 * @returns Value as degrees.
	 */
	public static toDegrees(radians: number): number {
		return radians * _toDegreesFactor;
	}

	/**
	* Find shortest distance between two radians, with sign (ie distance can be negative).
	* @param a1 First radian.
	* @param a2 Second radian.
	* @returns Shortest distance between radians.
	*/
	public static radiansDistanceSigned(a1: number, a2: number): number {
		var max = Math.PI * 2;
		var da = (a2 - a1) % max;
		return 2 * da % max - da;
	}

	/**
	* Find shortest distance between two radians.
	* @param a1 First radian.
	* @param a2 Second radian.
	* @returns Shortest distance between radians.
	*/
	public static radiansDistance(a1: number, a2: number): number {
		return Math.abs(this.radiansDistanceSigned(a1, a2));
	}

	/**
	* Find shortest distance between two angles in degrees, with sign (ie distance can be negative).
	* @param a1 First angle.
	* @param a2 Second angle.
	* @returns Shortest distance between angles.
	*/
	public static degreesDistanceSigned(a1: number, a2: number): number {
		let a1r = a1 * _toRadsFactor;
		let a2r = a2 * _toRadsFactor;
		let ret = this.radiansDistanceSigned(a1r, a2r);
		return ret * _toDegreesFactor;
	}

	/**
	* Find shortest distance between two angles in degrees.
	* @param a1 First angle.
	* @param a2 Second angle.
	* @returns Shortest distance between angles.
	*/
	public static degreesDistance(a1: number, a2: number): number {
		let a1r = a1 * _toRadsFactor;
		let a2r = a2 * _toRadsFactor;
		let ret = this.radiansDistance(a1r, a2r);
		return ret * _toDegreesFactor;
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
		if(a1 === a2) { return a2; }

		// do lerping
		return a1 + this.radiansDistanceSigned(a1, a2) * alpha;
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
		if(a1 === a2) { return a2; }

		// convert to radians
		a1 = this.toRadians(a1);
		a2 = this.toRadians(a2);

		// lerp
		var ret = this.lerpRadians(a1, a2, alpha);

		// convert back to degrees and return
		return this.wrapDegrees(this.toDegrees(ret));
	}

	/**
	* Round numbers from 10'th digit.
	* This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.
	* @param num Number to round.
	* @returns ounded number.
	*/
	public static round10(num: number): number {
		return Math.round(num * 100000000.0) / 100000000.0;
	}

	/**
	 * Wrap degrees value to be between 0 to 360.
	 * @param degrees Degrees to wrap.
	 * @returns degrees wrapped to be 0-360 values.
	 */
	public static wrapDegrees(degrees: number): number {
		degrees = degrees % 360;
		if(degrees < 0) { degrees += 360; }
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
		var _a = v2.sub(v1);
		var _b = v3.sub(v1);

		// calculate normal
		var surfaceNormal = new Vector3(0, 0, 0);
		surfaceNormal.x = (_a.y * _b.z) - (_a.z - _b.y);
		surfaceNormal.y = - ((_b.z * _a.x) - (_b.x * _a.z));
		surfaceNormal.z = (_a.x * _b.y) - (_a.y * _b.x);
		surfaceNormal.normalizeSelf();

		// return result
		return surfaceNormal;
	}
}

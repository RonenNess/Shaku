import { MathHelper } from "../math_helper";

/**
 * A simple Vector object for 2d positions.
 */
export class Vector2 {
	/**
	 * Vector with 0,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly zeroReadonly = new Vector2(0, 0);

	/**
	 * Vector with 1,1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly oneReadonly = new Vector2(1, 1);

	/**
	 * Vector with 0.5,0.5 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly halfReadonly = new Vector2(0.5, 0.5);

	/**
	 * Vector with -1,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly leftReadonly = new Vector2(-1, 0);

	/**
	 * Vector with 1,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly rightReadonly = new Vector2(1, 0);

	/**
	 * Vector with 0,1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly upReadonly = new Vector2(0, -1);

	/**
	 * Vector with 0,-1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly downReadonly = new Vector2(0, 1);

	public x: number;
	public y: number;

	/**
	 * Create the Vector object.
	 * @param x Vector X.
	 * @param y Vector Y.
	 */
	public constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Clone the vector.
	 * @returns cloned vector.
	 */
	public clone(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	/**
	 * Set vector value.
	 * @param x X component.
	 * @param y Y component.
	 * @returns this.
	 */
	public set(x: number, y: number): Vector2 {
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * Copy values from other vector into self.
	 * @returns this.
	 */
	public copy(other: Vector2): Vector2 {
		this.x = other.x;
		this.y = other.y;
		return this;
	}

	/**
	 * Return a new vector of this + other.
	 * @param other Vector2 or number to add to all components.
	 * @returns result vector.
	 */
	public add(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			return new Vector2(this.x + other, this.y + (arguments[1] === undefined ? other : arguments[1]));
		}
		return new Vector2(this.x + other.x, this.y + other.y);
	}

	/**
	 * Return a new vector of this - other.
	 * @param other Vector2 or number to sub from all components.
	 * @returns result vector.
	 */
	public sub(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			return new Vector2(this.x - other, this.y - (arguments[1] === undefined ? other : arguments[1]));
		}
		return new Vector2(this.x - other.x, this.y - other.y);
	}

	/**
	 * Return a new vector of this / other.
	 * @param other Vector2 or number to divide by all components.
	 * @returns result vector.
	 */
	public div(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			return new Vector2(this.x / other, this.y / (arguments[1] === undefined ? other : arguments[1]));
		}
		return new Vector2(this.x / other.x, this.y / other.y);
	}

	/**
	 * Return a new vector of this * other.
	 * @param other Vector2 or number to multiply with all components.
	 * @returns result vector.
	 */
	public mul(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			return new Vector2(this.x * other, this.y * (arguments[1] === undefined ? other : arguments[1]));
		}
		return new Vector2(this.x * other.x, this.y * other.y);
	}

	/**
	 * Return a round copy of this vector.
	 * @returns result vector.
	 */
	public round(): Vector2 {
		return new Vector2(Math.round(this.x), Math.round(this.y));
	}

	/**
	 * Return a floored copy of this vector.
	 * @returns result vector.
	 */
	public floor(): Vector2 {
		return new Vector2(Math.floor(this.x), Math.floor(this.y));
	}

	/**
	 * Return a ceiled copy of this vector.
	 * @returns result vector.
	 */
	public ceil(): Vector2 {
		return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
	}

	/**
	 * Set self values to be min values between self and a given vector.
	 * @param v Vector to min with.
	 * @returns Self.
	 */
	public minSelf(v: Vector2): Vector2 {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		return this;
	}

	/**
	 * Set self values to be max values between self and a given vector.
	 * @param v Vector to max with.
	 * @returns Self.
	 */
	public maxSelf(v: Vector2): Vector2 {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		return this;
	}

	/**
	 * Create a clone vector that is the min result between self and a given vector.
	 * @param v Vector to min with.
	 * @returns Result vector.
	 */
	public min(v: Vector2): Vector2 {
		return this.clone().minSelf(v);
	}

	/**
	 * Create a clone vector that is the max result between self and a given vector.
	 * @param v Vector to max with.
	 * @returns Result vector.
	 */
	public max(v: Vector2): Vector2 {
		return this.clone().maxSelf(v);
	}

	/**
	 * Return a normalized copy of this vector.
	 * @returns result vector.
	 */
	public normalized(): Vector2 {
		if(this.x == 0 && this.y == 0) { return Vector2.zero(); }
		let mag = this.length();
		return new Vector2(this.x / mag, this.y / mag);
	}

	/**
	 * Get a copy of this vector rotated by radians.
	 * @param radians Radians to rotate by.
	 * @returns New vector with the length of this vector and direction rotated by given radians.
	 */
	public rotatedByRadians(radians: number): Vector2 {
		return Vector2.fromRadians(this.getRadians() + radians).mulSelf(this.length());
	}

	/**
	 * Get a copy of this vector rotated by degrees.
	 * @param degrees Degrees to rotate by.
	 * @returns New vector with the length of this vector and direction rotated by given degrees.
	 */
	public rotatedByDegrees(degrees: number): Vector2 {
		return Vector2.fromDegrees(this.getDegrees() + degrees).mulSelf(this.length());
	}

	/**
	 * Add other vector values to self.
	 * @param other Vector or number to add.
	 * @returns this.
	 */
	public addSelf(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			this.x += other;
			this.y += (arguments[1] === undefined ? other : arguments[1]);
		}
		else {
			this.x += other.x;
			this.y += other.y;
		}
		return this;
	}

	/**
	 * Sub other vector values from self.
	 * @param other Vector or number to substract.
	 * @returns this.
	 */
	public subSelf(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			this.x -= other;
			this.y -= (arguments[1] === undefined ? other : arguments[1]);
		}
		else {
			this.x -= other.x;
			this.y -= other.y;
		}
		return this;
	}

	/**
	 * Divide this vector by other vector values.
	 * @param other Vector or number to divide by.
	 * @returns this.
	 */
	public divSelf(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			this.x /= other;
			this.y /= (arguments[1] === undefined ? other : arguments[1]);
		}
		else {
			this.x /= other.x;
			this.y /= other.y;
		}
		return this;
	}

	/**
	 * Multiply this vector by other vector values.
	 * @param other Vector or number to multiply by.
	 * @returns this.
	 */
	public mulSelf(other: number | Vector2): Vector2 {
		if(typeof other === "number") {
			this.x *= other;
			this.y *= (arguments[1] === undefined ? other : arguments[1]);
		}
		else {
			this.x *= other.x;
			this.y *= other.y;
		}
		return this;
	}

	/**
	 * Round self.
	 * @returns this.
	 */
	public roundSelf(): Vector2 {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	}

	/**
	 * Floor self.
	 * @returns this.
	 */
	public floorSelf(): Vector2 {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	}

	/**
	 * Ceil self.
	 * @returns this.
	 */
	public ceilSelf(): Vector2 {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	}

	/**
	 * Return a normalized copy of this vector.
	 * @returns this.
	 */
	public normalizeSelf(): Vector2 {
		if(this.x == 0 && this.y == 0) { return this; }
		let mag = this.length();
		this.x /= mag;
		this.y /= mag;
		return this;
	}

	/**
	 * Return if vector equals another vector.
	 * @param other Other vector to compare to.
	 * @returns if vectors are equal.
	 */
	public equals(other: Vector2): boolean {
		return ((this === other) || ((other.constructor === this.constructor) && this.x === other.x && this.y === other.y));
	}

	/**
	 * Return if vector approximately equals another vector.
	 * @param other Other vector to compare to.
	 * @param threshold Distance threshold to consider as equal. Defaults to 1.
	 * @returns if vectors are equal.
	 */
	public approximate(other: Vector2, threshold: number): boolean {
		threshold = threshold || 1;
		return ((this === other) ||
			(
				(Math.abs(this.x - other.x) <= threshold) &&
				(Math.abs(this.y - other.y) <= threshold))
		);
	}

	/**
	 * Return vector length (aka magnitude).
	 * @returns Vector length.
	 */
	public length(): number {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

	/**
	 * Return a copy of this vector multiplied by a factor.
	 * @returns result vector.
	 */
	public scaled(fac: number): Vector2 {
		return new Vector2(this.x * fac, this.y * fac);
	}

	/**
	 * Get vector (0,0).
	 * @returns result vector.
	 */
	public static zero(): Vector2 {
		return new Vector2(0, 0);
	}

	/**
	 * Get vector with 1,1 values.
	 * @returns result vector.
	 */
	public static one(): Vector2 {
		return new Vector2(1, 1);
	}

	/**
	 * Get vector with 0.5,0.5 values.
	 * @returns result vector.
	 */
	public static half(): Vector2 {
		return new Vector2(0.5, 0.5);
	}

	/**
	 * Get vector with -1,0 values.
	 * @returns result vector.
	 */
	public static left(): Vector2 {
		return new Vector2(-1, 0);
	}

	/**
	 * Get vector with 1,0 values.
	 * @returns result vector.
	 */
	public static right(): Vector2 {
		return new Vector2(1, 0);
	}

	/**
	 * Get vector with 0,-1 values.
	 * @returns result vector.
	 */
	public static up(): Vector2 {
		return new Vector2(0, -1);
	}

	/**
	 * Get vector with 0,1 values.
	 * @returns result vector.
	 */
	public static down(): Vector2 {
		return new Vector2(0, 1);
	}

	/**
	 * Get a random vector with length of 1.
	 * @returns result vector.
	 */
	public static random(): Vector2 {
		return Vector2.fromDegrees(Math.random() * 360);
	}

	/**
	 * Get degrees between this vector and another vector.
	 * @param other Other vector.
	 * @returns Angle between vectors in degrees.
	 */
	public degreesTo(other: Vector2): number {
		return Vector2.degreesBetween(this, other);
	}

	/**
	 * Get radians between this vector and another vector.
	 * @param other Other vector.
	 * @returns Angle between vectors in radians.
	 */
	public radiansTo(other: Vector2): number {
		return Vector2.radiansBetween(this, other);
	}

	/**
	 * Get degrees between this vector and another vector.
	 * Return values between 0 to 360.
	 * @param other Other vector.
	 * @returns Angle between vectors in degrees.
	 */
	public wrappedDegreesTo(other: Vector2): number {
		return Vector2.wrappedDegreesBetween(this, other);
	}

	/**
	 * Get radians between this vector and another vector.
	 * Return values between 0 to PI2.
	 * @param other Other vector.
	 * @returns Angle between vectors in radians.
	 */
	public wrappedRadiansTo(other: Vector2): number {
		return Vector2.wrappedRadiansBetween(this, other);
	}

	/**
	 * Calculate distance between this vector and another vectors.
	 * @param other Other vector.
	 * @returns Distance between vectors.
	 */
	public distanceTo(other: Vector2): number {
		return Vector2.distance(this, other);
	}

	/**
	 * Calculate squared distance between this vector and another vector.
	 * @param other Other vector.
	 * @returns Distance between vectors.
	 */
	public distanceToSquared(other: Vector2): number {
		const dx = this.x - other.x, dy = this.y - other.y;
		return dx * dx + dy * dy;
	}

	/**
	 * Return a clone and clamp its values to be between min and max.
	 * @param min Min vector.
	 * @param max Max vector.
	 * @returns Clamped vector.
	 */
	public clamp(min: Vector2, max: Vector2): Vector2 {
		return this.clone().clampSelf(min, max);
	}

	/**
	 * Clamp this vector values to be between min and max.
	 * @param min Min vector.
	 * @param max Max vector.
	 * @returns Self.
	 */
	public clampSelf(min: Vector2, max: Vector2): Vector2 {
		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		return this;
	}

	/**
	 * Calculate the dot product with another vector.
	 * @param other Vector to calculate dot with.
	 * @returns Dot product value.
	 */
	public dot(other: Vector2): number {
		return this.x * other.x + this.y * other.y;
	}

	/**
	 * Get vector from degrees.
	 * @param degrees Angle to create vector from (0 = vector pointing right).
	 * @returns result vector.
	 */
	public static fromDegrees(degrees: number): Vector2 {
		let rads = degrees * (Math.PI / 180);
		return new Vector2(Math.cos(rads), Math.sin(rads));
	}

	/**
	 * Get vector from radians.
	 * @param radians Angle to create vector from (0 = vector pointing right).
	 * @returns result vector.
	 */
	public static fromRadians(radians: number): Vector2 {
		return new Vector2(Math.cos(radians), Math.sin(radians));
	}

	/**
	 * Lerp between two vectors.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @param a Lerp factor (0.0 - 1.0).
	 * @returns result vector.
	 */
	public static lerp(p1: Vector2, p2: Vector2, a: number): Vector2 {
		let lerpScalar = MathHelper.lerp;
		return new Vector2(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a));
	}

	/**
	 * Get degrees between two vectors.
	 * Return values between -180 to 180.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Angle between vectors in degrees.
	 */
	public static degreesBetween(p1: Vector2, p2: Vector2): number {
		let deltaY = p2.y - p1.y,
			deltaX = p2.x - p1.x;
		return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
	}

	/**
	 * Get radians between two vectors.
	 * Return values between -PI to PI.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Angle between vectors in radians.
	 */
	public static radiansBetween(p1: Vector2, p2: Vector2): number {
		return MathHelper.toRadians(Vector2.degreesBetween(p1, p2));
	}

	/**
	 * Get degrees between two vectors.
	 * Return values between 0 to 360.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Angle between vectors in degrees.
	 */
	public static wrappedDegreesBetween(p1: Vector2, p2: Vector2): number {
		let temp = p2.sub(p1);
		return temp.getDegrees();
	}

	/**
	 * Get vector's angle in degrees.
	 * @returns Vector angle in degrees.
	 */
	public getDegrees(): number {
		var angle = Math.atan2(this.y, this.x);
		var degrees = 180 * angle / Math.PI;
		return (360 + Math.round(degrees)) % 360;
	}

	/**
	 * Get vector's angle in radians.
	 * @returns Vector angle in degrees.
	 */
	public getRadians(): number {
		var angle = Math.atan2(this.y, this.x);
		return angle;
	}

	/**
	 * Get radians between two vectors.
	 * Return values between 0 to PI2.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Angle between vectors in radians.
	 */
	public static wrappedRadiansBetween(p1: Vector2, p2: Vector2): number {
		return MathHelper.toRadians(Vector2.wrappedDegreesBetween(p1, p2));
	};

	/**
	 * Calculate distance between two vectors.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Distance between vectors.
	 */
	public static distance(p1: Vector2, p2: Vector2): number {
		let a = p1.x - p2.x;
		let b = p1.y - p2.y;
		return Math.sqrt(a * a + b * b);
	}

	/**
	 * Return cross product between two vectors.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Cross between vectors.
	 */
	public static cross(p1: Vector2, p2: Vector2): number {
		return p1.x * p2.y - p1.y * p2.x;
	}

	/**
	 * Return dot product between two vectors.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Dot between vectors.
	 */
	public static dot(p1: Vector2, p2: Vector2): number {
		return p1.x * p2.x + p1.y * p2.y;
	}

	/**
	 * Convert to string.
	 */
	public string(): string {
		return this.x + "," + this.y;
	}

	/**
	 * Parse and return a vector object from string in the form of "x,y".
	 * @param str String to parse.
	 * @returns Parsed vector.
	 */
	public static parse(str: `${number},${number}`): Vector2 {
		let parts = str.split(",");
		return new Vector2(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()));
	}

	/**
	 * Convert to array of numbers.
	 * @returns Vector components as array.
	 */
	public toArray(): [number, number] {
		return [this.x, this.y];
	}

	/**
	 * Create vector from array of numbers.
	 * @param arr Array of numbers to create vector from.
	 * @returns Vector instance.
	 */
	public static fromArray(arr: [number, number]): Vector2 {
		return new Vector2(arr[0], arr[1]);
	}

	/**
	 * Create vector from a dictionary.
	 * @param data Dictionary with {x,y}.
	 * @returns Newly created vector.
	 */
	public static fromDict(data: { x: number, y: number; }): Vector2 {
		return new Vector2(data.x || 0, data.y || 0);
	}

	/**
	 * Convert to dictionary.
	 * @param If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns Dictionary with {x,y}
	 */
	public toDict(minimized: true): Partial<{ x: number, y: number; }>;
	public toDict(minimized?: false): { x: number, y: number; };
	public toDict(minimized?: boolean): Partial<{ x: number, y: number; }> {
		if(minimized) {
			const ret = {};
			if(this.x) { ret.x = this.x; }
			if(this.y) { ret.y = this.y; }
			return ret;
		}
		return { x: this.x, y: this.y };
	}
}

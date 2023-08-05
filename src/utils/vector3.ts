import MathHelper from "./math_helper";

/**
 * A Vector object for 3d positions.
 */
export default class Vector3 {

	/**
	 * Vector with 0,0,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly zeroReadonly = new Vector3(0, 0, 0);

	/**
	 * Vector with 1,1,1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly oneReadonly = new Vector3(1, 1, 1);

	/**
	 * Vector with 0.5,0.5,0.5 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly halfReadonly = new Vector3(0.5, 0.5, 0.5);

	/**
	 * Vector with -1,0,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly leftReadonly = new Vector3(-1, 0, 0);

	/**
	 * Vector with 1,0,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly rightReadonly = new Vector3(1, 0, 0);

	/**
	 * Vector with 0,-1,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly upReadonly = new Vector3(0, 1, 0);

	/**
	 * Vector with 0,1,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly downReadonly = new Vector3(0, -1, 0);

	/**
	 * Vector with 0,0,1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly frontReadonly = new Vector3(0, 0, 1);

	/**
	 * Vector with 0,0,-1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	public static readonly backReadonly = new Vector3(0, 0, -1);


	public x: number;
	public y: number;
	public z: number;

	/**
	 * Create the Vector object.
	 * @param x Vector X.
	 * @param y Vector Y.
	 * @param z Vector Z.
	 */
	public constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Clone the vector.
	 * @returns cloned vector.
	 */
	public clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	/**
	 * Set vector value.
	 * @param x X component.
	 * @param y Y component.
	 * @param z Z component.
	 * @returns this.
	 */
	public set(x: number, y: number, z: number): Vector3 {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	/**
	 * Copy values from other vector into self.
	 * @returns this.
	 */
	public copy(other: Vector3): Vector3 {
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;
		return this;
	}

	/**
	 * Return a new vector of this + other.
	 * @param Vector3 or number to add to all components.
	 * @returns result vector.
	 */
	public add(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			return new Vector3(
				this.x + other,
				this.y + (arguments[1] === undefined ? other : arguments[1]),
				this.z + (arguments[2] === undefined ? other : arguments[2])
			);
		}
		return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	/**
	 * Return a new vector of this - other.
	 * @param other Vector3 or number to sub from all components.
	 * @returns result vector.
	 */
	public sub(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			return new Vector3(
				this.x - other,
				this.y - (arguments[1] === undefined ? other : arguments[1]),
				this.z - (arguments[2] === undefined ? other : arguments[2])
			);
		}
		return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	/**
	 * Return a new vector of this / other.
	 * @param other Vector3 or number to divide by all components.
	 * @returns result vector.
	 */
	public div(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			return new Vector3(
				this.x / other,
				this.y / (arguments[1] === undefined ? other : arguments[1]),
				this.z / (arguments[2] === undefined ? other : arguments[2])
			);
		}
		return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
	}

	/**
	 * Return a new vector of this * other.
	 * @param other Vector3 or number to multiply with all components.
	 * @returns result vector.
	 */
	public mul(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			return new Vector3(
				this.x * other,
				this.y * (arguments[1] === undefined ? other : arguments[1]),
				this.z * (arguments[2] === undefined ? other : arguments[2])
			);
		}
		return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
	}

	/**
	 * Return a round copy of this vector.
	 * @returns result vector.
	 */
	public round(): Vector3 {
		return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
	}

	/**
	 * Return a floored copy of this vector.
	 * @returns result vector.
	 */
	public floor(): Vector3 {
		return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
	}

	/**
	 * Return a ceiled copy of this vector.
	 * @returns result vector.
	 */
	public ceil(): Vector3 {
		return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
	}

	/**
	 * Return a normalized copy of this vector.
	 * @returns result vector.
	 */
	public normalized(): Vector3 {
		if((this.x == 0) && (this.y == 0) && (this.z == 0)) { return Vector3.zero; }
		let mag = this.length();
		return new Vector3(this.x / mag, this.y / mag, this.z / mag);
	}

	/**
	 * Add other vector values to self.
	 * @param other Vector or number to add.
	 * @returns this.
	 */
	public addSelf(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			this.x += other;
			this.y += (arguments[1] === undefined ? other : arguments[1]);
			this.z += (arguments[2] === undefined ? other : arguments[2]);
		}
		else {
			this.x += other.x;
			this.y += other.y;
			this.z += other.z;
		}
		return this;
	}

	/**
	 * Sub other vector values from self.
	 * @param other Vector or number to substract.
	 * @returns this.
	 */
	public subSelf(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			this.x -= other;
			this.y -= (arguments[1] === undefined ? other : arguments[1]);
			this.z -= (arguments[2] === undefined ? other : arguments[2]);
		}
		else {
			this.x -= other.x;
			this.y -= other.y;
			this.z -= other.z;
		}
		return this;
	}

	/**
	 * Divide this vector by other vector values.
	 * @param other Vector or number to divide by.
	 * @returns this.
	 */
	public divSelf(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			this.x /= other;
			this.y /= (arguments[1] === undefined ? other : arguments[1]);
			this.z /= (arguments[2] === undefined ? other : arguments[2]);
		}
		else {
			this.x /= other.x;
			this.y /= other.y;
			this.z /= other.z;
		}
		return this;
	}

	/**
	 * Multiply this vector by other vector values.
	 * @param other Vector or number to multiply by.
	 * @returns this.
	 */
	public mulSelf(other: number | Vector3): Vector3 {
		if(typeof other === "number") {
			this.x *= other;
			this.y *= (arguments[1] === undefined ? other : arguments[1]);
			this.z *= (arguments[2] === undefined ? other : arguments[2]);
		}
		else {
			this.x *= other.x;
			this.y *= other.y;
			this.z *= other.z;
		}
		return this;
	}

	/**
	 * Round self.
	 * @returns this.
	 */
	public roundSelf(): Vector3 {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
		return this;
	}

	/**
	 * Floor self.
	 * @returns this.
	 */
	public floorSelf(): Vector3 {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	/**
	 * Ceil self.
	 * @returns this.
	 */
	public ceilSelf(): Vector3 {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);
		return this;
	}

	/**
	 * Return a normalized copy of this vector.
	 * @returns this.
	 */
	public normalizeSelf(): Vector3 {
		if(this.x == 0 && this.y == 0 && this.z == 0) { return this; }
		let mag = this.length();
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
		return this;
	}

	/**
	 * Return if vector equals another vector.
	 * @param other Other vector to compare to.
	 * @returns if vectors are equal.
	 */
	public equals(other: Vector3): boolean {
		return ((this === other) ||
			((other.constructor === this.constructor) &&
				this.x === other.x && this.y === other.y && this.z === other.z)
		);
	}

	/**
	 * Return if vector approximately equals another vector.
	 * @param other Other vector to compare to.
	 * @param threshold Distance threshold to consider as equal. Defaults to 1.
	 * @returns if vectors are equal.
	 */
	public approximate(other: Vector3, threshold: number): boolean {
		threshold = threshold || 1;
		return (
			(this === other) ||
			((Math.abs(this.x - other.x) <= threshold) &&
				(Math.abs(this.y - other.y) <= threshold) &&
				(Math.abs(this.z - other.z) <= threshold))
		);
	}

	/**
	 * Return vector length (aka magnitude).
	 * @returns Vector length.
	 */
	public length(): number {
		return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
	}

	/**
	 * Return a copy of this vector multiplied by a factor.
	 * @returns result vector.
	 */
	public scaled(fac: number): Vector3 {
		return new Vector3(this.x * fac, this.y * fac, this.z * fac);
	}

	/**
	 * Get vector with 0,0,0 values.
	 * @returns result vector.
	 */
	public static zero(): Vector3 {
		return new Vector3(0, 0, 0);
	}

	/**
	 * Get vector with 1,1,1 values.
	 * @returns result vector.
	 */
	public static one(): Vector3 {
		return new Vector3(1, 1, 1);
	}

	/**
	 * Get vector with 0.5,0.5 values.
	 * @returns result vector.
	 */
	public static half(): Vector3 {
		return new Vector3(0.5, 0.5, 0.5);
	}

	/**
	 * Get vector with -1,0,0 values.
	 * @returns result vector.
	 */
	public static left(): Vector3 {
		return new Vector3(-1, 0, 0);
	}

	/**
	 * Get vector with 1,0,0 values.
	 * @returns result vector.
	 */
	public static right(): Vector3 {
		return new Vector3(1, 0, 0);
	}

	/**
	 * Get vector with 0,-1,0 values.
	 * @returns result vector.
	 */
	public static up(): Vector3 {
		return new Vector3(0, 1, 0);
	}

	/**
	 * Get vector with 0,1,0 values.
	 * @returns result vector.
	 */
	public static down(): Vector3 {
		return new Vector3(0, -1, 0);
	}

	/**
	 * Get vector with 0,0,1 values.
	 * @returns result vector.
	 */
	public static front(): Vector3 {
		return new Vector3(0, 0, 1);
	}

	/**
	 * Get vector with 0,0,-1 values.
	 * @returns result vector.
	 */
	public static back(): Vector3 {
		return new Vector3(0, 0, -1);
	}

	/**
	 * Calculate distance between this vector and another vector.
	 * @param other Other vector.
	 * @returns Distance between vectors.
	 */
	public distanceTo(other: Vector3): number {
		return Vector3.distance(this, other);
	}

	/**
	 * Calculate squared distance between this vector and another vector.
	 * @param other Other vector.
	 * @returns Distance between vectors.
	 */
	public distanceToSquared(other: Vector3): number {
		const dx = this.x - other.x, dy = this.y - other.y, dz = this.z - other.z;
		return dx * dx + dy * dy + dz * dz;
	}

	/**
	 * Return a clone and clamp its values to be between min and max.
	 * @param min Min vector.
	 * @param max Max vector.
	 * @returns Clamped vector.
	 */
	public clamp(min: Vector3, max: Vector3): Vector3 {
		return this.clone().clampSelf(min, max);
	}

	/**
	 * Clamp this vector values to be between min and max.
	 * @param min Min vector.
	 * @param max Max vector.
	 * @returns Self.
	 */
	public clampSelf(min: Vector3, max: Vector3): Vector3 {
		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		this.z = Math.max(min.z, Math.min(max.z, this.z));
		return this;
	}

	/**
	 * Calculate the dot product with another vector.
	 * @param other Vector to calculate dot with.
	 * @returns Dot product value.
	 */
	public dot(other: Vector3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	/**
	 * Lerp between two vectors.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @param a Lerp factor (0.0 - 1.0).
	 * @returns result vector.
	 */
	public static lerp(p1: Vector3, p2: Vector3, a: number): Vector3 {
		let lerpScalar = MathHelper.lerp;
		return new Vector3(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a), lerpScalar(p1.z, p2.z, a));
	}

	/**
	 * Calculate distance between two vectors.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Distance between vectors.
	 */
	public static distance(p1: Vector3, p2: Vector3): number {
		let a = p1.x - p2.x;
		let b = p1.y - p2.y;
		let c = p1.z - p2.z;
		return Math.sqrt(a * a + b * b + c * c);
	}

	/**
	 * Return cross product between two vectors.
	 * @param p1 First vector.
	 * @param p2 Second vector.
	 * @returns Crossed vector.
	 */
	public static crossVector(p1: Vector3, p2: Vector3): Vector3 {
		const ax = p1.x, ay = p1.y, az = p1.z;
		const bx = p2.x, by = p2.y, bz = p2.z;

		let x = ay * bz - az * by;
		let y = az * bx - ax * bz;
		let z = ax * by - ay * bx;

		return new Vector3(x, y, z);
	}

	/**
	 * Set self values to be min values between self and a given vector.
	 * @param v Vector to min with.
	 * @returns Self.
	 */
	public minSelf(v: Vector3): Vector3 {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		this.z = Math.min(this.z, v.z);
		return this;
	}

	/**
	 * Set self values to be max values between self and a given vector.
	 * @param v Vector to max with.
	 * @returns Self.
	 */
	public maxSelf(v: Vector3): Vector3 {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		this.z = Math.max(this.z, v.z);
		return this;
	}

	/**
	 * Create a clone vector that is the min result between self and a given vector.
	 * @param v Vector to min with.
	 * @returns Result vector.
	 */
	public min(v: Vector3): Vector3 {
		return this.clone().minSelf(v);
	}

	/**
	 * Create a clone vector that is the max result between self and a given vector.
	 * @param v Vector to max with.
	 * @returns Result vector.
	 */
	public max(v: Vector3): Vector3 {
		return this.clone().maxSelf(v);
	}

	/**
	 * Convert to string.
	 */
	public string(): string {
		return this.x + "," + this.y + "," + this.z;
	}

	/**
	 * Parse and return a vector object from string in the form of "x,y".
	 * @param str String to parse.
	 * @returns Parsed vector.
	 */
	public static parse(str: string): Vector3 {
		let parts = str.split(",");
		return new Vector3(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()), parseFloat(parts[2].trim()));
	}

	/**
	 * Convert to array of numbers.
	 * @returns Vector components as array.
	 */
	public toArray(): [number, number, number] {
		return [this.x, this.y, this.z];
	}

	/**
	 * Create vector from array of numbers.
	 * @param arr Array of numbers to create vector from.
	 * @returns Vector instance.
	 */
	public static fromArray(arr: [number, number, number]): Vector3 {
		return new Vector3(arr[0], arr[1], arr[2]);
	}

	/**
	 * Create vector from a dictionary.
	 * @param data Dictionary with {x,y,z}.
	 * @returns Newly created vector.
	 */
	public static fromDict(data: { x: number, y: number, z: number; }): Vector3 {
		return new Vector3(data.x || 0, data.y || 0, data.z || 0);
	}

	/**
	 * Convert to dictionary.
	 * @param minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns Dictionary with {x,y,z}
	 */
	public toDict(minimized: true): Partial<{ x: number, y: number, z: number; }>;
	public toDict(minimized?: false): { x: number, y: number, z: number; };
	public toDict(minimized?: boolean): Partial<{ x: number, y: number, z: number; }> {
		if(minimized) {
			const ret = {};
			if(this.x) { ret.x = this.x; }
			if(this.y) { ret.y = this.y; }
			if(this.z) { ret.z = this.z; }
			return ret;
		}
		return { x: this.x, y: this.y, z: this.z };
	}
}

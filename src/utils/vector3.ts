import MathHelper from "./math_helper";

/**
 * A Vector object for 3d positions.
 */
class Vector3 {
	/**
	 * Create the Vector object.
	 * @param {number} x Vector X.
	 * @param {number} y Vector Y.
	 * @param {number} z Vector Z.
	 */
	constructor(
		public x: number = 0,
		public y: number = 0,
		public z: number = 0,
	) { }

	/**
	 * Clone the vector.
	 * @returns {Vector3} cloned vector.
	 */
	clone(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	/**
	 * Set vector value.
	 * @param {Number} x X component.
	 * @param {Number} y Y component.
	 * @param {Number} z Z component.
	 * @returns {Vector3} this.
	 */
	set(x: number, y: number, z: number): Vector3 {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	/**
	 * Copy values from other vector into self.
	 * @returns {Vector3} this.
	 */
	copy(other: Vector3): Vector3 {
		this.x = other.x;
		this.y = other.y;
		this.z = other.z;
		return this;
	}

	/**
	 * Return a new vector of this + other.
	 * @param {Number|Vector3} Other Vector3 or number to add to all components.
	 * @returns {Vector3} result vector.
	 */
	add(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @param {Number|Vector3} Other Vector3 or number to sub from all components.
	 * @returns {Vector3} result vector.
	 */
	sub(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @param {Number|Vector3} Other Vector3 or number to divide by all components.
	 * @returns {Vector3} result vector.
	 */
	div(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @param {Number|Vector3} Other Vector3 or number to multiply with all components.
	 * @returns {Vector3} result vector.
	 */
	mul(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @returns {Vector3} result vector.
	 */
	round(): Vector3 {
		return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
	}

	/**
	 * Return a floored copy of this vector.
	 * @returns {Vector3} result vector.
	 */
	floor(): Vector3 {
		return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
	}

	/**
	 * Return a ceiled copy of this vector.
	 * @returns {Vector3} result vector.
	 */
	ceil(): Vector3 {
		return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
	}

	/**
	 * Return a normalized copy of this vector.
	 * @returns {Vector3} result vector.
	 */
	normalized(): Vector3 {
		if ((this.x == 0) && (this.y == 0) && (this.z == 0)) { return Vector3.zero(); }
		let mag = this.length();
		return new Vector3(this.x / mag, this.y / mag, this.z / mag);
	}

	/**
	 * Add other vector values to self.
	 * @param {Number|Vector3} Other Vector or number to add.
	 * @returns {Vector3} this.
	 */
	addSelf(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @param {Number|Vector3} Other Vector or number to substract.
	 * @returns {Vector3} this.
	 */
	subSelf(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @param {Number|Vector3} Other Vector or number to divide by.
	 * @returns {Vector3} this.
	 */
	divSelf(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @param {Number|Vector3} Other Vector or number to multiply by.
	 * @returns {Vector3} this.
	 */
	mulSelf(other: number | Vector3): Vector3 {
		if (typeof other === 'number') {
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
	 * @returns {Vector3} this.
	 */
	roundSelf(): Vector3 {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
		return this;
	}

	/**
	 * Floor self.
	 * @returns {Vector3} this.
	 */
	floorSelf(): Vector3 {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	/**
	 * Ceil self.
	 * @returns {Vector3} this.
	 */
	ceilSelf(): Vector3 {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);
		return this;
	}

	/**
	 * Return a normalized copy of this vector.
	 * @returns {Vector3} this.
	 */
	normalizeSelf(): Vector3 {
		if (this.x == 0 && this.y == 0 && this.z == 0) { return this; }
		let mag = this.length();
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
		return this;
	}

	/**
	 * Return if vector equals another vector.
	 * @param {Vector3} other Other vector to compare to.
	 * @returns {Boolean} if vectors are equal.
	 */
	equals(other: Vector3): boolean {
		return ((this === other) ||
			((other.constructor === this.constructor) &&
				this.x === other.x && this.y === other.y && this.z === other.z)
		);
	}

	/**
	 * Return if vector approximately equals another vector.
	 * @param {Vector3} other Other vector to compare to.
	 * @param {Number} threshold Distance threshold to consider as equal. Defaults to 1.
	 * @returns {Boolean} if vectors are equal.
	 */
	approximate(other: this, threshold: number): boolean {
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
	 * @returns {Number} Vector length.
	 */
	length(): number {
		return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
	}

	/**
	 * Return a copy of this vector multiplied by a factor.
	 * @returns {Vector3} result vector.
	 */
	scaled(fac: number): Vector3 {
		return new Vector3(this.x * fac, this.y * fac, this.z * fac);
	}

	/**
	 * Get vector with 0,0,0 values.
	 * @returns {Vector3} result vector.
	 */
	static zero(): Vector3 {
		return new Vector3(0, 0, 0);
	}

	/**
	 * Get vector with 1,1,1 values.
	 * @returns {Vector3} result vector.
	 */
	static one(): Vector3 {
		return new Vector3(1, 1, 1);
	}

	/**
	 * Get vector with 0.5,0.5 values.
	 * @returns {Vector3} result vector.
	 */
	static half(): Vector3 {
		return new Vector3(0.5, 0.5, 0.5);
	}

	/**
	 * Get vector with -1,0,0 values.
	 * @returns {Vector3} result vector.
	 */
	static left(): Vector3 {
		return new Vector3(-1, 0, 0);
	}

	/**
	 * Get vector with 1,0,0 values.
	 * @returns {Vector3} result vector.
	 */
	static right(): Vector3 {
		return new Vector3(1, 0, 0);
	}

	/**
	 * Get vector with 0,-1,0 values.
	 * @returns {Vector3} result vector.
	 */
	static up(): Vector3 {
		return new Vector3(0, 1, 0);
	}

	/**
	 * Get vector with 0,1,0 values.
	 * @returns {Vector3} result vector.
	 */
	static down(): Vector3 {
		return new Vector3(0, -1, 0);
	}

	/**
	 * Get vector with 0,0,1 values.
	 * @returns {Vector3} result vector.
	 */
	static front(): Vector3 {
		return new Vector3(0, 0, 1);
	}

	/**
	 * Get vector with 0,0,-1 values.
	 * @returns {Vector3} result vector.
	 */
	static back(): Vector3 {
		return new Vector3(0, 0, -1);
	}

	/**
	 * Calculate distance between this vector and another vector.
	 * @param {Vector3} other Other vector.
	 * @returns {Number} Distance between vectors.
	 */
	distanceTo(other: Vector3): number {
		return Vector3.distance(this, other);
	}

	/**
	 * Calculate squared distance between this vector and another vector.
	 * @param {Vector3} other Other vector.
	 * @returns {Number} Distance between vectors.
	 */
	distanceToSquared(other: Vector3): number {
		const dx = this.x - other.x, dy = this.y - other.y, dz = this.z - other.z;
		return dx * dx + dy * dy + dz * dz;
	}

	/**
	 * Return a clone and clamp its values to be between min and max.
	 * @param {Vector3} min Min vector.
	 * @param {Vector3} max Max vector.
	 * @returns {Vector3} Clamped vector.
	 */
	clamp(min: Vector3, max: Vector3): Vector3 {
		return this.clone().clampSelf(min, max);
	}

	/**
	 * Clamp this vector values to be between min and max.
	 * @param {Vector3} min Min vector.
	 * @param {Vector3} max Max vector.
	 * @returns {Vector3} Self.
	 */
	clampSelf(min: Vector3, max: Vector3): Vector3 {
		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		this.z = Math.max(min.z, Math.min(max.z, this.z));
		return this;
	}

	/**
	 * Calculate the dot product with another vector.
	 * @param {Vector3} other Vector to calculate dot with.
	 * @returns {Number} Dot product value.
	 */
	dot(other: Vector3): number {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	/**
	 * Lerp between two vectors.
	 * @param {Vector3} p1 First vector.
	 * @param {Vector3} p2 Second vector.
	 * @param {Number} a Lerp factor (0.0 - 1.0).
	 * @returns {Vector3} result vector.
	 */
	static lerp(p1: Vector3, p2: Vector3, a: number): Vector3 {
		let lerpScalar = MathHelper.lerp;
		return new Vector3(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a), lerpScalar(p1.z, p2.z, a));
	}

	/**
	 * Calculate distance between two vectors.
	 * @param {Vector3} p1 First vector.
	 * @param {Vector3} p2 Second vector.
	 * @returns {Number} Distance between vectors.
	 */
	static distance(p1: Vector3, p2: Vector3): number {
		let a = p1.x - p2.x;
		let b = p1.y - p2.y;
		let c = p1.z - p2.z;
		return Math.sqrt(a * a + b * b + c * c);
	}

	/**
	 * Return cross product between two vectors.
	 * @param {Vector3} p1 First vector.
	 * @param {Vector3} p2 Second vector.
	 * @returns {Vector3} Crossed vector.
	 */
	static crossVector(p1: Vector3, p2: Vector3): Vector3 {
		const ax = p1.x, ay = p1.y, az = p1.z;
		const bx = p2.x, by = p2.y, bz = p2.z;

		let x = ay * bz - az * by;
		let y = az * bx - ax * bz;
		let z = ax * by - ay * bx;

		return new Vector3(x, y, z);
	}

	/**
	 * Set self values to be min values between self and a given vector.
	 * @param {Vector3} v Vector to min with.
	 * @returns {Vector3} Self.
	 */
	minSelf(v: Vector3): Vector3 {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		this.z = Math.min(this.z, v.z);
		return this;
	}

	/**
	 * Set self values to be max values between self and a given vector.
	 * @param {Vector3} v Vector to max with.
	 * @returns {Vector3} Self.
	 */
	maxSelf(v: Vector3): Vector3 {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		this.z = Math.max(this.z, v.z);
		return this;
	}

	/**
	 * Create a clone vector that is the min result between self and a given vector.
	 * @param {Vector3} v Vector to min with.
	 * @returns {Vector3} Result vector.
	 */
	min(v: Vector3): Vector3 {
		return this.clone().minSelf(v);
	}

	/**
	 * Create a clone vector that is the max result between self and a given vector.
	 * @param {Vector3} v Vector to max with.
	 * @returns {Vector3} Result vector.
	 */
	max(v: Vector3): Vector3 {
		return this.clone().maxSelf(v);
	}

	/**
	 * Convert to string.
	 */
	string() {
		return this.x + ',' + this.y + ',' + this.z;
	}

	/**
	 * Parse and return a vector object from string in the form of "x,y".
	 * @param {String} str String to parse.
	 * @returns {Vector3} Parsed vector.
	 */
	static parse(str: string): Vector3 {
		let parts = str.split(',');
		return new Vector3(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()), parseFloat(parts[2].trim()));
	}

	/**
	 * Convert to array of numbers.
	 * @returns {Array<Number>} Vector components as array.
	 */
	toArray(): Array<number> {
		return [this.x, this.y, this.z];
	}

	/**
	 * Create vector from array of numbers.
	 * @param {Array<Number>} arr Array of numbers to create vector from.
	 * @returns {Vector3} Vector instance.
	 */
	static fromArray(arr: (number | undefined)[]): Vector3 {
		return new Vector3(arr[0], arr[1], arr[2]);
	}

	/**
	 * Create vector from a dictionary.
	 * @param {*} data Dictionary with {x,y,z}.
	 * @returns {Vector3} Newly created vector.
	 */
	static fromDict(data: Vector3): Vector3 {
		return new Vector3(data.x || 0, data.y || 0, data.z || 0);
	}

	/**
	 * Convert to dictionary.
	 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns {*} Dictionary with {x,y,z}
	 */
	toDict(minimized: boolean = false): { x?: number, y?: number, z?: number } {
		if (minimized) {
			const ret: Record<string, number> = {};
			if (this.x) { ret.x = this.x; }
			if (this.y) { ret.y = this.y; }
			if (this.z) { ret.z = this.z; }
			return ret;
		}
		return { x: this.x, y: this.y, z: this.z };
	}

	/**
	* Vector with 0,0,0 values as a frozen shared object.
	* Be careful not to try and change it.
	*/
	static zeroReadonly = new Vector3(0, 0, 0);

	/**
	 * Vector with 1,1,1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static oneReadonly = new Vector3(1, 1, 1);

	/**
	 * Vector with 0.5,0.5,0.5 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static halfReadonly = new Vector3(0.5, 0.5, 0.5);

	/**
	 * Vector with -1,0,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static leftReadonly = new Vector3(-1, 0, 0);

	/**
	 * Vector with 1,0,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static rightReadonly = new Vector3(1, 0, 0);

	/**
	 * Vector with 0,-1,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static upReadonly = new Vector3(0, 1, 0);

	/**
	 * Vector with 0,1,0 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static downReadonly = new Vector3(0, -1, 0);

	/**
	 * Vector with 0,0,1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static frontReadonly = new Vector3(0, 0, 1);

	/**
	 * Vector with 0,0,-1 values as a frozen shared object.
	 * Be careful not to try and change it.
	 */
	static backReadonly = new Vector3(0, 0, -1);
}

Object.freeze(Vector3.zeroReadonly);
Object.freeze(Vector3.oneReadonly);
Object.freeze(Vector3.halfReadonly);
Object.freeze(Vector3.leftReadonly);
Object.freeze(Vector3.rightReadonly);
Object.freeze(Vector3.frontReadonly);
Object.freeze(Vector3.upReadonly);
Object.freeze(Vector3.downReadonly);
Object.freeze(Vector3.backReadonly);

// export vector object
export default Vector3;

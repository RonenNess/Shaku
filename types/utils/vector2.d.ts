export = Vector2;
/**
 * A simple Vector object for 2d positions.
 */
declare class Vector2 {
    /**
     * Get vector (0,0).
     * @returns {Vector2} result vector.
     */
    static zero(): Vector2;
    /**
     * Get vector with 1,1 values.
     * @returns {Vector2} result vector.
     */
    static one(): Vector2;
    /**
     * Get vector with 0.5,0.5 values.
     * @returns {Vector2} result vector.
     */
    static half(): Vector2;
    /**
     * Get vector with -1,0 values.
     * @returns {Vector2} result vector.
     */
    static left(): Vector2;
    /**
     * Get vector with 1,0 values.
     * @returns {Vector2} result vector.
     */
    static right(): Vector2;
    /**
     * Get vector with 0,-1 values.
     * @returns {Vector2} result vector.
     */
    static up(): Vector2;
    /**
     * Get vector with 0,1 values.
     * @returns {Vector2} result vector.
     */
    static down(): Vector2;
    /**
     * Get a random vector with length of 1.
     * @returns {Vector2} result vector.
     */
    static random(): Vector2;
    /**
     * Get vector from degrees.
     * @param {Number} degrees Angle to create vector from (0 = vector pointing right).
     * @returns {Vector2} result vector.
     */
    static fromDegrees(degrees: number): Vector2;
    /**
     * Get vector from radians.
     * @param {Number} radians Angle to create vector from (0 = vector pointing right).
     * @returns {Vector2} result vector.
     */
    static fromRadians(radians: number): Vector2;
    /**
     * Lerp between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Vector2} result vector.
     */
    static lerp(p1: Vector2, p2: Vector2, a: number): Vector2;
    /**
     * Get degrees between two vectors.
     * Return values between -180 to 180.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    static degreesBetween(P1: any, P2: any): number;
    /**
     * Get radians between two vectors.
     * Return values between -PI to PI.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in radians.
     */
    static radiansBetween(P1: any, P2: any): number;
    /**
     * Get degrees between two vectors.
     * Return values between 0 to 360.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    static wrappedDegreesBetween(P1: any, P2: any): number;
    /**
     * Get radians between two vectors.
     * Return values between 0 to PI2.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in radians.
     */
    static wrappedRadiansBetween(P1: any, P2: any): number;
    /**
     * Calculate distance between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Distance between vectors.
     */
    static distance(p1: Vector2, p2: Vector2): number;
    /**
     * Return cross product between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Cross between vectors.
     */
    static cross(p1: Vector2, p2: Vector2): number;
    /**
     * Return dot product between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Dot between vectors.
     */
    static dot(p1: Vector2, p2: Vector2): number;
    /**
     * Parse and return a vector object from string in the form of "x,y".
     * @param {String} str String to parse.
     * @returns {Vector2} Parsed vector.
     */
    static parse(str: string): Vector2;
    /**
     * Create vector from array of numbers.
     * @param {Array<Number>} arr Array of numbers to create vector from.
     * @returns {Vector2} Vector instance.
     */
    static fromArray(arr: Array<number>): Vector2;
    /**
     * Create vector from a dictionary.
     * @param {*} data Dictionary with {x,y}.
     * @returns {Vector2} Newly created vector.
     */
    static fromDict(data: any): Vector2;
    /**
     * Create the Vector object.
     * @param {number} x Vector X.
     * @param {number} y Vector Y.
     */
    constructor(x?: number, y?: number);
    x: number;
    y: number;
    /**
     * Clone the vector.
     * @returns {Vector2} cloned vector.
     */
    clone(): Vector2;
    /**
     * Set vector value.
     * @param {Number} x X component.
     * @param {Number} y Y component.
     * @returns {Vector2} this.
     */
    set(x: number, y: number): Vector2;
    /**
     * Copy values from other vector into self.
     * @returns {Vector2} this.
     */
    copy(other: any): Vector2;
    /**
     * Return a new vector of this + other.
     * @param {Number|Vector2} Other Vector3 or number to add to all components.
     * @returns {Vector2} result vector.
     */
    add(other: any, ...args: any[]): Vector2;
    /**
     * Return a new vector of this - other.
     * @param {Number|Vector2} Other Vector3 or number to sub from all components.
     * @returns {Vector2} result vector.
     */
    sub(other: any, ...args: any[]): Vector2;
    /**
     * Return a new vector of this / other.
     * @param {Number|Vector2} Other Vector3 or number to divide by all components.
     * @returns {Vector2} result vector.
     */
    div(other: any, ...args: any[]): Vector2;
    /**
     * Return a new vector of this * other.
     * @param {Number|Vector2} Other Vector2 or number to multiply with all components.
     * @returns {Vector2} result vector.
     */
    mul(other: any, ...args: any[]): Vector2;
    /**
     * Return a round copy of this vector.
     * @returns {Vector2} result vector.
     */
    round(): Vector2;
    /**
     * Return a floored copy of this vector.
     * @returns {Vector2} result vector.
     */
    floor(): Vector2;
    /**
     * Return a ceiled copy of this vector.
     * @returns {Vector2} result vector.
     */
    ceil(): Vector2;
    /**
     * Set self values to be min values between self and a given vector.
     * @param {Vector2} v Vector to min with.
     * @returns {Vector2} Self.
     */
    minSelf(v: Vector2): Vector2;
    /**
     * Set self values to be max values between self and a given vector.
     * @param {Vector2} v Vector to max with.
     * @returns {Vector2} Self.
     */
    maxSelf(v: Vector2): Vector2;
    /**
     * Create a clone vector that is the min result between self and a given vector.
     * @param {Vector2} v Vector to min with.
     * @returns {Vector2} Result vector.
     */
    min(v: Vector2): Vector2;
    /**
     * Create a clone vector that is the max result between self and a given vector.
     * @param {Vector2} v Vector to max with.
     * @returns {Vector2} Result vector.
     */
    max(v: Vector2): Vector2;
    /**
     * Return a normalized copy of this vector.
     * @returns {Vector2} result vector.
     */
    normalized(): Vector2;
    /**
     * Get a copy of this vector rotated by radians.
     * @param {Number} radians Radians to rotate by.
     * @returns {Vector2} New vector with the length of this vector and direction rotated by given radians.
     */
    rotatedByRadians(radians: number): Vector2;
    /**
     * Get a copy of this vector rotated by degrees.
     * @param {Number} degrees Degrees to rotate by.
     * @returns {Vector2} New vector with the length of this vector and direction rotated by given degrees.
     */
    rotatedByDegrees(degrees: number): Vector2;
    /**
     * Add other vector values to self.
     * @param {Number|Vector2} Other Vector or number to add.
     * @returns {Vector2} this.
     */
    addSelf(other: any, ...args: any[]): Vector2;
    /**
     * Sub other vector values from self.
     * @param {Number|Vector2} Other Vector or number to substract.
     * @returns {Vector2} this.
     */
    subSelf(other: any, ...args: any[]): Vector2;
    /**
     * Divide this vector by other vector values.
     * @param {Number|Vector2} Other Vector or number to divide by.
     * @returns {Vector2} this.
     */
    divSelf(other: any, ...args: any[]): Vector2;
    /**
     * Multiply this vector by other vector values.
     * @param {Number|Vector2} Other Vector or number to multiply by.
     * @returns {Vector2} this.
     */
    mulSelf(other: any, ...args: any[]): Vector2;
    /**
     * Round self.
     * @returns {Vector2} this.
     */
    roundSelf(): Vector2;
    /**
     * Floor self.
     * @returns {Vector2} this.
     */
    floorSelf(): Vector2;
    /**
     * Ceil self.
     * @returns {Vector2} this.
     */
    ceilSelf(): Vector2;
    /**
     * Return a normalized copy of this vector.
     * @returns {Vector2} this.
     */
    normalizeSelf(): Vector2;
    /**
     * Return if vector equals another vector.
     * @param {Vector2} other Other vector to compare to.
     * @returns {Boolean} if vectors are equal.
     */
    equals(other: Vector2): boolean;
    /**
     * Return if vector approximately equals another vector.
     * @param {Vector2} other Other vector to compare to.
     * @param {Number} threshold Distance threshold to consider as equal. Defaults to 1.
     * @returns {Boolean} if vectors are equal.
     */
    approximate(other: Vector2, threshold: number): boolean;
    /**
     * Return vector length (aka magnitude).
     * @returns {Number} Vector length.
     */
    length(): number;
    /**
     * Return a copy of this vector multiplied by a factor.
     * @returns {Vector2} result vector.
     */
    scaled(fac: any): Vector2;
    /**
     * Get degrees between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    degreesTo(other: Vector2): number;
    /**
     * Get radians between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in radians.
     */
    radiansTo(other: Vector2): number;
    /**
     * Get degrees between this vector and another vector.
     * Return values between 0 to 360.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    wrappedDegreesTo(other: Vector2): number;
    /**
     * Get radians between this vector and another vector.
     * Return values between 0 to PI2.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in radians.
     */
    wrappedRadiansTo(other: Vector2): number;
    /**
     * Calculate distance between this vector and another vectors.
     * @param {Vector2} other Other vector.
     * @returns {Number} Distance between vectors.
     */
    distanceTo(other: Vector2): number;
    /**
     * Calculate squared distance between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Distance between vectors.
     */
    distanceToSquared(other: Vector2): number;
    /**
     * Return a clone and clamp its values to be between min and max.
     * @param {Vector2} min Min vector.
     * @param {Vector2} max Max vector.
     * @returns {Vector2} Clamped vector.
     */
    clamp(min: Vector2, max: Vector2): Vector2;
    /**
     * Clamp this vector values to be between min and max.
     * @param {Vector2} min Min vector.
     * @param {Vector2} max Max vector.
     * @returns {Vector2} Self.
     */
    clampSelf(min: Vector2, max: Vector2): Vector2;
    /**
     * Calculate the dot product with another vector.
     * @param {Vector2} other Vector to calculate dot with.
     * @returns {Number} Dot product value.
     */
    dot(other: Vector2): number;
    /**
     * Get vector's angle in degrees.
     * @returns {Number} Vector angle in degrees.
     */
    getDegrees(): number;
    /**
     * Get vector's angle in radians.
     * @returns {Number} Vector angle in degrees.
     */
    getRadians(): number;
    /**
     * Convert to string.
     */
    string(): string;
    /**
     * Convert to array of numbers.
     * @returns {Array<Number>} Vector components as array.
     */
    toArray(): Array<number>;
    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {x,y}
     */
    toDict(minimized: boolean): any;
}
declare namespace Vector2 {
    const zeroReadonly: Vector2;
    const oneReadonly: Vector2;
    const halfReadonly: Vector2;
    const leftReadonly: Vector2;
    const rightReadonly: Vector2;
    const upReadonly: Vector2;
    const downReadonly: Vector2;
}
//# sourceMappingURL=vector2.d.ts.map
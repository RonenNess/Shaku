export = Vector3;
/**
 * A Vector object for 3d positions.
 */
declare class Vector3 {
    /**
     * Get vector with 0,0,0 values.
     * @returns {Vector3} result vector.
     */
    static zero(): Vector3;
    /**
     * Get vector with 1,1,1 values.
     * @returns {Vector3} result vector.
     */
    static one(): Vector3;
    /**
     * Get vector with 0.5,0.5 values.
     * @returns {Vector3} result vector.
     */
    static half(): Vector3;
    /**
     * Get vector with -1,0,0 values.
     * @returns {Vector3} result vector.
     */
    static left(): Vector3;
    /**
     * Get vector with 1,0,0 values.
     * @returns {Vector3} result vector.
     */
    static right(): Vector3;
    /**
     * Get vector with 0,-1,0 values.
     * @returns {Vector3} result vector.
     */
    static up(): Vector3;
    /**
     * Get vector with 0,1,0 values.
     * @returns {Vector3} result vector.
     */
    static down(): Vector3;
    /**
     * Get vector with 0,0,1 values.
     * @returns {Vector3} result vector.
     */
    static front(): Vector3;
    /**
     * Get vector with 0,0,-1 values.
     * @returns {Vector3} result vector.
     */
    static back(): Vector3;
    /**
     * Lerp between two vectors.
     * @param {Vector3} p1 First vector.
     * @param {Vector3} p2 Second vector.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Vector3} result vector.
     */
    static lerp(p1: Vector3, p2: Vector3, a: number): Vector3;
    /**
     * Calculate distance between two vectors.
     * @param {Vector3} p1 First vector.
     * @param {Vector3} p2 Second vector.
     * @returns {Number} Distance between vectors.
     */
    static distance(p1: Vector3, p2: Vector3): number;
    /**
     * Return cross product between two vectors.
     * @param {Vector3} p1 First vector.
     * @param {Vector3} p2 Second vector.
     * @returns {Vector3} Crossed vector.
     */
    static crossVector(p1: Vector3, p2: Vector3): Vector3;
    /**
     * Parse and return a vector object from string in the form of "x,y".
     * @param {String} str String to parse.
     * @returns {Vector3} Parsed vector.
     */
    static parse(str: string): Vector3;
    /**
     * Create vector from array of numbers.
     * @param {Array<Number>} arr Array of numbers to create vector from.
     * @returns {Vector3} Vector instance.
     */
    static fromArray(arr: Array<number>): Vector3;
    /**
     * Create vector from a dictionary.
     * @param {*} data Dictionary with {x,y,z}.
     * @returns {Vector3} Newly created vector.
     */
    static fromDict(data: any): Vector3;
    /**
     * Create the Vector object.
     * @param {number} x Vector X.
     * @param {number} y Vector Y.
     * @param {number} z Vector Z.
     */
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    /**
     * Clone the vector.
     * @returns {Vector3} cloned vector.
     */
    clone(): Vector3;
    /**
     * Set vector value.
     * @param {Number} x X component.
     * @param {Number} y Y component.
     * @param {Number} z Z component.
     * @returns {Vector3} this.
     */
    set(x: number, y: number, z: number): Vector3;
    /**
     * Copy values from other vector into self.
     * @returns {Vector3} this.
     */
    copy(other: any): Vector3;
    /**
     * Return a new vector of this + other.
     * @param {Number|Vector3} Other Vector3 or number to add to all components.
     * @returns {Vector3} result vector.
     */
    add(other: any, ...args: any[]): Vector3;
    /**
     * Return a new vector of this - other.
     * @param {Number|Vector3} Other Vector3 or number to sub from all components.
     * @returns {Vector3} result vector.
     */
    sub(other: any, ...args: any[]): Vector3;
    /**
     * Return a new vector of this / other.
     * @param {Number|Vector3} Other Vector3 or number to divide by all components.
     * @returns {Vector3} result vector.
     */
    div(other: any, ...args: any[]): Vector3;
    /**
     * Return a new vector of this * other.
     * @param {Number|Vector3} Other Vector3 or number to multiply with all components.
     * @returns {Vector3} result vector.
     */
    mul(other: any, ...args: any[]): Vector3;
    /**
     * Return a round copy of this vector.
     * @returns {Vector3} result vector.
     */
    round(): Vector3;
    /**
     * Return a floored copy of this vector.
     * @returns {Vector3} result vector.
     */
    floor(): Vector3;
    /**
     * Return a ceiled copy of this vector.
     * @returns {Vector3} result vector.
     */
    ceil(): Vector3;
    /**
     * Return a normalized copy of this vector.
     * @returns {Vector3} result vector.
     */
    normalized(): Vector3;
    /**
     * Add other vector values to self.
     * @param {Number|Vector3} Other Vector or number to add.
     * @returns {Vector3} this.
     */
    addSelf(other: any, ...args: any[]): Vector3;
    /**
     * Sub other vector values from self.
     * @param {Number|Vector3} Other Vector or number to substract.
     * @returns {Vector3} this.
     */
    subSelf(other: any, ...args: any[]): Vector3;
    /**
     * Divide this vector by other vector values.
     * @param {Number|Vector3} Other Vector or number to divide by.
     * @returns {Vector3} this.
     */
    divSelf(other: any, ...args: any[]): Vector3;
    /**
     * Multiply this vector by other vector values.
     * @param {Number|Vector3} Other Vector or number to multiply by.
     * @returns {Vector3} this.
     */
    mulSelf(other: any, ...args: any[]): Vector3;
    /**
     * Round self.
     * @returns {Vector3} this.
     */
    roundSelf(): Vector3;
    /**
     * Floor self.
     * @returns {Vector3} this.
     */
    floorSelf(): Vector3;
    /**
     * Ceil self.
     * @returns {Vector3} this.
     */
    ceilSelf(): Vector3;
    /**
     * Return a normalized copy of this vector.
     * @returns {Vector3} this.
     */
    normalizeSelf(): Vector3;
    /**
     * Return if vector equals another vector.
     * @param {Vector3} other Other vector to compare to.
     * @returns {Boolean} if vectors are equal.
     */
    equals(other: Vector3): boolean;
    /**
     * Return if vector approximately equals another vector.
     * @param {Vector3} other Other vector to compare to.
     * @param {Number} threshold Distance threshold to consider as equal. Defaults to 1.
     * @returns {Boolean} if vectors are equal.
     */
    approximate(other: Vector3, threshold: number): boolean;
    /**
     * Return vector length (aka magnitude).
     * @returns {Number} Vector length.
     */
    length(): number;
    /**
     * Return a copy of this vector multiplied by a factor.
     * @returns {Vector3} result vector.
     */
    scaled(fac: any): Vector3;
    /**
     * Calculate distance between this vector and another vectors.
     * @param {Vector3} other Other vector.
     * @returns {Number} Distance between vectors.
     */
    distanceTo(other: Vector3): number;
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
     * @returns {*} Dictionary with {x,y,z}
     */
    toDict(minimized: boolean): any;
}
declare namespace Vector3 {
    const zeroReadonly: Vector3;
    const oneReadonly: Vector3;
    const halfReadonly: Vector3;
    const leftReadonly: Vector3;
    const rightReadonly: Vector3;
    const upReadonly: Vector3;
    const downReadonly: Vector3;
    const frontReadonly: Vector3;
    const backReadonly: Vector3;
}
//# sourceMappingURL=vector3.d.ts.map
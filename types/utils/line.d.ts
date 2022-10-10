export = Line;
/**
 * Implement a simple 2d Line.
 */
declare class Line {
    /**
     * Create Line from a dictionary.
     * @param {*} data Dictionary with {from, to}.
     * @returns {Line} Newly created line.
     */
    static fromDict(data: any): Line;
    /**
     * Lerp between two lines.
     * @param {Line} l1 First lines.
     * @param {Line} l2 Second lines.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Line} result lines.
     */
    static lerp(l1: Line, l2: Line, a: number): Line;
    /**
     * Create the Line.
     * @param {Vector2} from Line start position.
     * @param {Vector2} to Line end position.
     */
    constructor(from: Vector2, to: Vector2);
    from: Vector2;
    to: Vector2;
    /**
     * Return a clone of this line.
     * @returns {Line} Cloned line.
     */
    clone(): Line;
    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {from, to}.
     */
    toDict(minimized: boolean): any;
    /**
     * Check if this circle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @param {Number} threshold Distance between point and line to consider as intersecting. Default is 0.5, meaning it will treat point and line as round integers (sort-of).
     * @returns {Boolean} if point is contained within the circle.
     */
    containsVector(p: Vector2, threshold: number): boolean;
    /**
     * Check if this line collides with another line.
     * @param {Line} other Other line to test collision with.
     * @returns {Boolean} True if lines collide, false otherwise.
     */
    collideLine(other: Line): boolean;
    /**
     * Get the shortest distance between this line segment and a vector.
     * @param {Vector2} v Vector to get distance to.
     * @returns {Number} Shortest distance between line and vector.
     */
    distanceToVector(v: Vector2): number;
    /**
     * Check if equal to another circle.
     * @param {Circle} other Other circle to compare to.
     * @returns {Boolean} True if circles are equal, false otherwise.
     */
    equals(other: Circle): boolean;
}
import Vector2 = require("./vector2");
//# sourceMappingURL=line.d.ts.map
export = Circle;
/**
 * Implement a simple 2d Circle.
 */
declare class Circle {
    /**
     * Create circle from a dictionary.
     * @param {*} data Dictionary with {center, radius}.
     * @returns {Circle} Newly created circle.
     */
    static fromDict(data: any): Circle;
    /**
     * Lerp between two circle.
     * @param {Circle} p1 First circle.
     * @param {Circle} p2 Second circle.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Circle} result circle.
     */
    static lerp(p1: Circle, p2: Circle, a: number): Circle;
    /**
     * Create the Circle.
     * @param {Vector2} center Circle center position.
     * @param {Number} radius Circle radius.
     */
    constructor(center: Vector2, radius: number);
    center: Vector2;
    radius: number;
    /**
     * Return a clone of this circle.
     * @returns {Circle} Cloned circle.
     */
    clone(): Circle;
    /**
     * Check if this circle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @returns {Boolean} if point is contained within the circle.
     */
    containsVector(p: Vector2): boolean;
    /**
     * Check if equal to another circle.
     * @param {Circle} other Other circle to compare to.
     * @returns {Boolean} True if circles are equal, false otherwise.
     */
    equals(other: Circle): boolean;
    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {center, radius}.
     */
    toDict(minimized: boolean): any;
}
import Vector2 = require("./vector2");
//# sourceMappingURL=circle.d.ts.map
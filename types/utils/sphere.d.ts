export = Sphere;
/**
 * Implement a 3d sphere.
 */
declare class Sphere {
    /**
     * Create sphere from a dictionary.
     * @param {*} data Dictionary with {center, radius}.
     * @returns {Sphere} Newly created sphere.
     */
    static fromDict(data: any): Sphere;
    /**
     * Lerp between two sphere.
     * @param {Sphere} p1 First sphere.
     * @param {Sphere} p2 Second sphere.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Sphere} result sphere.
     */
    static lerp(p1: Sphere, p2: Sphere, a: number): Sphere;
    /**
     * Create the Sphere.
     * @param {Vector3} center Sphere center position.
     * @param {Number} radius Sphere radius.
     */
    constructor(center: Vector3, radius: number);
    center: Vector3;
    radius: number;
    /**
     * Return a clone of this sphere.
     * @returns {Sphere} Cloned sphere.
     */
    clone(): Sphere;
    /**
     * Check if this sphere contains a Vector3.
     * @param {Vector3} p Point to check.
     * @returns {Boolean} if point is contained within the sphere.
     */
    containsVector(p: Vector3): boolean;
    /**
     * Check if equal to another sphere.
     * @param {Sphere} other Other sphere to compare to.
     * @returns {Boolean} True if spheres are equal, false otherwise.
     */
    equals(other: Sphere): boolean;
    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {center, radius}.
     */
    toDict(minimized: boolean): any;
    /**
     * Check if collide with a box.
     * @param {Box} box Box to check.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collideBox(box: Box): boolean;
    /**
     * Check if collide with a plane.
     * @param {Plane} plane Plane to test.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collidePlane(plane: Plane): boolean;
}
import Vector3 = require("./vector3");
//# sourceMappingURL=sphere.d.ts.map
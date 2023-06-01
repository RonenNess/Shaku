export = Plane;
/**
 * A plane in 3D space shape.
 */
declare class Plane {
    /**
     * Create the plane.
     * @param {Vector3} normal Plane normal vector.
     * @param {Number} constant Plane constant.
     */
    constructor(normal?: Vector3, constant?: number);
    normal: Vector3;
    constant: number;
    /**
     * Set the plane components.
     * @param {Vector3} normal Plane normal.
     * @param {Number} constant Plane constant.
     * @returns {Plane} Self.
     */
    set(normal: Vector3, constant: number): Plane;
    /**
     * Set the plane components.
     * @param {Number} x Plane normal X.
     * @param {Number} y Plane normal Y.
     * @param {Number} z Plane normal Z.
     * @param {Number} w Plane constant.
     * @returns {Plane} Self.
     */
    setComponents(x: number, y: number, z: number, w: number): Plane;
    /**
     * Set plane from normal and coplanar point vectors.
     * @param {Vector3} normal Plane normal.
     * @param {Vector3} point Coplanar point.
     * @returns {Plane} Self.
     */
    setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
    /**
     * Copy values from another plane.
     * @param {Plane} plane Plane to copy.
     * @returns {Plane} Self.
     */
    copy(plane: Plane): Plane;
    /**
     * Normalize the plane.
     * @returns {Plane} self.
     */
    normalizeSelf(): Plane;
    /**
     * Normalize a clone of this plane.
     * @returns {Plane} Normalized clone.
     */
    normalized(): Plane;
    /**
     * Negate this plane.
     * @returns {Plane} Self.
     */
    negateSelf(): Plane;
    /**
     * Calculate distance to point.
     * @param {Vector3} point Point to calculate distance to.
     * @returns {Number} Distance to point.
     */
    distanceToPoint(point: Vector3): number;
    /**
     * Calculate distance to sphere.
     * @param {Sphere} sphere Sphere to calculate distance to.
     * @returns {Number} Distance to sphere.
     */
    distanceToSphere(sphere: Sphere): number;
    /**
     * Check if this plane collide with a line.
     * @param {Line} line Line to check.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collideLine(line: Line): boolean;
    /**
     * Check if this plane collide with a sphere.
     * @param {Sphere} sphere Sphere to check.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collideSphere(sphere: Sphere): boolean;
    /**
     * Coplanar a point.
     * @returns {Vector3} Coplanar point as a new vector.
     */
    coplanarPoint(): Vector3;
    /**
     * Translate this plane.
     * @param {Vector3} offset Offset to translate to.
     * @returns {Plane} Self.
     */
    translateSelf(offset: Vector3): Plane;
    /**
     * Check if this plane equals another plane.
     * @param {Plane} plane Other plane to compare to.
     * @returns {Boolean} True if equal, false otherwise.
     */
    equals(plane: Plane): boolean;
    /**
     * Clone this plane.
     * @returns {Plane} Cloned plane.
     */
    clone(): Plane;
}
import Vector3 = require("./vector3");
import Sphere = require("./sphere");
import Line = require("./line");
//# sourceMappingURL=plane.d.ts.map
export = Frustum;
/**
 * Implement a 3D Frustum shape.
 */
declare class Frustum {
    /**
     * Create the frustum.
     * @param {Plane} p0 Frustum plane.
     * @param {Plane} p1 Frustum plane.
     * @param {Plane} p2 Frustum plane.
     * @param {Plane} p3 Frustum plane.
     * @param {Plane} p4 Frustum plane.
     * @param {Plane} p5 Frustum plane.
     */
    constructor(p0?: Plane, p1?: Plane, p2?: Plane, p3?: Plane, p4?: Plane, p5?: Plane);
    planes: Plane[];
    /**
     * Set the Frustum values.
     * @param {Plane} p0 Frustum plane.
     * @param {Plane} p1 Frustum plane.
     * @param {Plane} p2 Frustum plane.
     * @param {Plane} p3 Frustum plane.
     * @param {Plane} p4 Frustum plane.
     * @param {Plane} p5 Frustum plane.
     * @returns {Frustum} Self.
     */
    set(p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane): Frustum;
    /**
     * Copy values from another frustum.
     * @param {Frustum} frustum Frustum to copy.
     * @returns {Frustum} Self.
     */
    copy(frustum: Frustum): Frustum;
    /**
     * Set frustum from projection matrix.
     * @param {Matrix} m Matrix to build frustum from.
     * @returns {Frustum} Self.
     */
    setFromProjectionMatrix(m: Matrix): Frustum;
    /**
     * Check if the frustum collides with a sphere.
     * @param {Sphere} sphere Sphere to check.
     * @returns {Boolean} True if point is in frustum, false otherwise.
     */
    collideSphere(sphere: Sphere): boolean;
    /**
     * Check if collide with a box.
     * @param {Box} box Box to check.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collideBox(box: Box): boolean;
    /**
     * Check if the frustum contains a point.
     * @param {Vector3} point Vector to check.
     * @returns {Boolean} True if point is in frustum, false otherwise.
     */
    containsPoint(point: Vector3): boolean;
    /**
     * Clone this frustum.
     * @returns {Frustum} Cloned frustum.
     */
    clone(): Frustum;
}
import Plane = require("./plane");
import Matrix = require("./matrix");
import Box = require("./box");
import Vector3 = require("./vector3");
//# sourceMappingURL=frustum.d.ts.map
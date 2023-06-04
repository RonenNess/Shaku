export = Ray;
/**
 * A 3D ray.
 */
declare class Ray {
    /**
     * Create the Ray.
     * @param {Vector3} origin Ray origin point.
     * @param {Vector3} direction Ray 3d direction.
     */
    constructor(origin: Vector3, direction: Vector3);
    origin: Vector3;
    direction: Vector3;
    /**
     * Set the ray components.
     * @param {Vector3} origin Ray origin point.
     * @param {Vector3} direction Ray 3d direction.
     * @returns {Plane} Self.
     */
    set(origin: Vector3, direction: Vector3): Plane;
    /**
     * Copy values from another ray.
     * @param {Ray} ray Ray to copy.
     * @returns {Ray} Self.
     */
    copy(ray: Ray): Ray;
    /**
     * Check if this ray equals another ray.
     * @param {Ray} ray Other ray to compare to.
     * @returns {Boolean} True if equal, false otherwise.
     */
    equals(ray: Ray): boolean;
    /**
     * Get the 3d point on the ray by distance from origin.
     * @param {Number} distance Distance from origin to travel.
     * @returns {Vector3} Point on ray from origin.
     */
    at(distance: number): Vector3;
    /**
     * Calculate distance to a 3d point.
     * @param {Vector3} point Point to calculate distance to.
     * @returns {Number} Distance to point.
     */
    distanceToPoint(point: Vector3): number;
    /**
     * Calculate squared distance to a 3d point.
     * @param {Vector3} point Point to calculate distance to.
     * @returns {Number} Squared distance to point.
     */
    distanceToPointSquared(point: Vector3): number;
    /**
     * Check if this ray collides with a sphere.
     * @param {Sphere} sphere Sphere to test collision with.
     * @returns {Boolean} True if collide with sphere, false otherwise.
     */
    collideSphere(sphere: Sphere): boolean;
    /**
     * Check if this ray collides with a box.
     * @param {Box} box Box to test collision with.
     * @returns {Boolean} True if collide with box, false otherwise.
     */
    collideBox(box: Box): boolean;
    /**
     * Return the collision point between the ray and a box, or null if they don't collide.
     * @param {Box} box Box to get collision with.
     * @returns {Vector3|null} Collision point or null.
     */
    findColliionPointWithBox(box: Box): Vector3 | null;
    /**
     * Clone this ray.
     * @returns {Ray} Cloned ray.
     */
    clone(): Ray;
}
import Vector3 = require("./vector3");
//# sourceMappingURL=ray.d.ts.map
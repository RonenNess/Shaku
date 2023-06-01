export = Box;
/**
 * A 3D box shape.
 */
declare class Box {
    /**
     * Create the 3d box.
     * @param {Vector3} min Box min vector.
     * @param {Vector3} max Box max vector.
     */
    constructor(min?: Vector3, max?: Vector3);
    min: Vector3;
    max: Vector3;
    /**
     * Set the box min and max corners.
     * @param {Vector3} min Box min vector.
     * @param {Vector3} max Box max vector.
     * @returns {Box} Self.
     */
    set(min: Vector3, max: Vector3): Box;
    /**
     * Set box values from array.
     * @param {Array<Number>} array Array of values to load from.
     * @returns {Box} Self.
     */
    setFromArray(array: Array<number>): Box;
    /**
     * Set box from array of points.
     * @param {Array<Vector3>} points Points to set box from.
     * @returns {Box} Self.
     */
    setFromPoints(points: Array<Vector3>): Box;
    /**
     * Set box from center and size.
     * @param {Vector3} center Center position.
     * @param {Vector3} size Box size.
     * @returns {Box} Self.
     */
    setFromCenterAndSize(center: Vector3, size: Vector3): Box;
    /**
     * Clone this box.
     * @returns {Box} Cloned box.
     */
    clone(): Box;
    /**
     * Copy values from another box.
     * @param {Box} box Box to copy.
     * @returns {Box} Self.
     */
    copy(box: Box): Box;
    /**
     * Turn this box into empty state.
     * @returns {Box} Self.
     */
    makeEmpty(): Box;
    /**
     * Check if this box is empty.
     * @returns {Boolean} True if empty.
     */
    isEmpty(): boolean;
    /**
     * Get center position.
     * @returns {Vector3} Center position.
     */
    getCenter(): Vector3;
    /**
     * Get box size.
     * @returns {Vector3} Box size.
     */
    getSize(target: any): Vector3;
    /**
     * Expand this box by a point.
     * This will adjust the box boundaries to contain the point.
     * @param {Vector3} point Point to extend box by.
     * @returns {Box} Self.
     */
    expandByPoint(point: Vector3): Box;
    /**
     * Expand this box by pushing its boundaries by a vector.
     * This will adjust the box boundaries by pushing them away from the center by the value of the given vector.
     * @param {Vector3} vector Vector to expand by.
     * @returns {Box} Self.
     */
    expandByVector(vector: Vector3): Box;
    /**
     * Expand this box by pushing its boundaries by a given scalar.
     * This will adjust the box boundaries by pushing them away from the center by the value of the given scalar.
     * @param {Number} scalar Value to expand by.
     * @returns {Box} Self.
     */
    expandByScalar(scalar: number): Box;
    /**
     * Check if this box contains a point.
     * @param {Vector3} point Point to check.
     * @returns {Boolean} True if box containing the point.
     */
    containsPoint(point: Vector3): boolean;
    /**
     * Check if this box contains another box.
     * @param {Box} box Box to check.
     * @returns {Boolean} True if box containing the box.
     */
    containsBox(box: Box): boolean;
    /**
     * Check if this box collides with another box.
     * @param {Box} box Box to test collidion with.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collideBox(box: Box): boolean;
    /**
     * Check if this box collides with a sphere.
     * @param {Sphere} sphere Sphere to test collidion with.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collideSphere(sphere: Sphere): boolean;
    /**
     * Check if this box collides with a plane.
     * @param {Plane} plane Plane to test collidion with.
     * @returns {Boolean} True if collide, false otherwise.
     */
    collidePlane(plane: Plane): boolean;
    /**
     * Clamp a given vector inside this box.
     * @param {Vector3} point Vector to clamp.
     * @returns {Vector3} Vector clammped.
     */
    clampPoint(point: Vector3): Vector3;
    /**
     * Get distance between this box and a given point.
     * @param {Vector3} point Point to get distance to.
     * @returns {Number} Distance to point.
     */
    distanceToPoint(point: Vector3): number;
    /**
     * Computes the intersection of this box with another box.
     * This will set the upper bound of this box to the lesser of the two boxes' upper bounds and the lower bound of this box to the greater of the two boxes' lower bounds.
     * If there's no overlap, makes this box empty.
     * @param {Box} box Box to intersect with.
     * @returns {Box} Self.
     */
    intersectWith(box: Box): Box;
    /**
     * Computes the union of this box and box.
     * This will set the upper bound of this box to the greater of the two boxes' upper bounds and the lower bound of this box to the lesser of the two boxes' lower bounds.
     * @param {Box} box Box to union with.
     * @returns {Box} Self.
     */
    unionWith(box: Box): Box;
    /**
     * Move this box.
     * @param {Vector3} offset Offset to move box by.
     * @returns {Box} Self.
     */
    translate(offset: Vector3): Box;
    /**
     * Check if equal to another box.
     * @param {Box} other Other box to compare to.
     * @returns {Boolean} True if boxes are equal, false otherwise.
     */
    equals(box: any): boolean;
}
import Vector3 = require("./vector3");
//# sourceMappingURL=box.d.ts.map
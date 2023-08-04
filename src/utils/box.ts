import Plane from "./plane";
import Sphere from "./sphere";
import Vector3 from "./vector3";

/**
 * A 3D box shape.
 */
export default class Box {
	public min: Vector3;
	public max: Vector3;

	/**
	 * Create the 3d box.
	 * @param min Box min vector.
	 * @param max Box max vector.
	 */
	public constructor(min = new Vector3(+ Infinity, + Infinity, + Infinity), max = new Vector3(- Infinity, - Infinity, - Infinity)) {
		this.min = min;
		this.max = max;
	}

	/**
	 * Set the box min and max corners.
	 * @param min Box min vector.
	 * @param max Box max vector.
	 * @returns Self.
	 */
	public set(min: Vector3, max: Vector3): Box {
		this.min.copy(min);
		this.max.copy(max);
		return this;
	}

	/**
	 * Set box values from array.
	 * @param array Array of values to load from.
	 * @returns Self.
	 */
	public setFromArray(array: number[]): Box {
		this.makeEmpty();
		for(let i = 0, il = array.length; i < il; i += 3) {
			this.expandByPoint(_vector.fromArray(array, i));
		}
		return this;
	}

	/**
	 * Set box from array of points.
	 * @param points Points to set box from.
	 * @returns Self.
	 */
	public setFromPoints(points: Vector3[]): Box {
		this.makeEmpty();
		for(let i = 0, il = points.length; i < il; i++) {
			this.expandByPoint(points[i]);
		}
		return this;
	}

	/**
	 * Set box from center and size.
	 * @param center Center position.
	 * @param size Box size.
	 * @returns Self.
	 */
	public setFromCenterAndSize(center: Vector3, size: Vector3): Box {
		const halfSize = size.mul(0.5);
		this.min.copy(center.sub(halfSize));
		this.max.copy(center.add(halfSize));
		return this;
	}

	/**
	 * Clone this box.
	 * @returns Cloned box.
	 */
	public clone(): Box {
		return new Box().copy(this);
	}

	/**
	 * Copy values from another box.
	 * @param box Box to copy.
	 * @returns Self.
	 */
	public copy(box: Box): Box {
		this.min.copy(box.min);
		this.max.copy(box.max);
		return this;
	}

	/**
	 * Turn this box into empty state.
	 * @returns Self.
	 */
	public makeEmpty(): Box {
		this.min.x = this.min.y = this.min.z = + Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;
		return this;
	}

	/**
	 * Check if this box is empty.
	 * @returns True if empty.
	 */
	public isEmpty(): boolean {
		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
		return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
	}

	/**
	 * Get center position.
	 * @returns Center position.
	 */
	public getCenter(): Vector3 {
		return this.isEmpty() ? Vector3.zero() : this.min.add(this.max).mulSelf(0.5);
	}

	/**
	 * Get box size.
	 * @returns Box size.
	 */
	public getSize(target: unknown): Vector3 {
		return this.isEmpty() ? Vector3.zero() : this.max.sub(this.min);
	}

	/**
	 * Expand this box by a point.
	 * This will adjust the box boundaries to contain the point.
	 * @param point Point to extend box by.
	 * @returns Self.
	 */
	public expandByPoint(point: Vector3): Box {
		this.min.minSelf(point);
		this.max.maxSelf(point);
		return this;
	}

	/**
	 * Expand this box by pushing its boundaries by a vector.
	 * This will adjust the box boundaries by pushing them away from the center by the value of the given vector.
	 * @param vector Vector to expand by.
	 * @returns Self.
	 */
	public expandByVector(vector: Vector3): Box {
		this.min.subSelf(vector);
		this.max.addSelf(vector);
		return this;
	}

	/**
	 * Expand this box by pushing its boundaries by a given scalar.
	 * This will adjust the box boundaries by pushing them away from the center by the value of the given scalar.
	 * @param scalar Value to expand by.
	 * @returns Self.
	 */
	public expandByScalar(scalar: number): Box {
		this.min.subSelf(scalar);
		this.max.addSelf(scalar);
		return this;
	}

	/**
	 * Check if this box contains a point.
	 * @param point Point to check.
	 * @returns True if box containing the point.
	 */
	public containsPoint(point: Vector3): boolean {
		return point.x < this.min.x || point.x > this.max.x ||
			point.y < this.min.y || point.y > this.max.y ||
			point.z < this.min.z || point.z > this.max.z ? false : true;
	}

	/**
	 * Check if this box contains another box.
	 * @param box Box to check.
	 * @returns True if box containing the box.
	 */
	public containsBox(box: Box): boolean {
		return this.min.x <= box.min.x && box.max.x <= this.max.x &&
			this.min.y <= box.min.y && box.max.y <= this.max.y &&
			this.min.z <= box.min.z && box.max.z <= this.max.z;
	}

	/**
	 * Check if this box collides with another box.
	 * @param box Box to test collidion with.
	 * @returns True if collide, false otherwise.
	 */
	public collideBox(box: Box): boolean {
		// using 6 splitting planes to rule out intersections.
		return box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ||
			box.max.z < this.min.z || box.min.z > this.max.z ? false : true;
	}

	/**
	 * Check if this box collides with a sphere.
	 * @param sphere Sphere to test collidion with.
	 * @returns True if collide, false otherwise.
	 */
	public collideSphere(sphere: Sphere): boolean {
		// find the point on the AABB closest to the sphere center.
		const clamped = this.clampPoint(sphere.center);

		// if that point is inside the sphere, the AABB and sphere intersect.
		return clamped.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);

	}

	/**
	 * Check if this box collides with a plane.
	 * @param plane Plane to test collidion with.
	 * @returns True if collide, false otherwise.
	 */
	public collidePlane(plane: Plane): boolean {
		// We compute the minimum and maximum dot product values. If those values
		// are on the same side (back or front) of the plane, then there is no intersection.

		let min, max;

		if(plane.normal.x > 0) {

			min = plane.normal.x * this.min.x;
			max = plane.normal.x * this.max.x;

		} else {

			min = plane.normal.x * this.max.x;
			max = plane.normal.x * this.min.x;

		}

		if(plane.normal.y > 0) {

			min += plane.normal.y * this.min.y;
			max += plane.normal.y * this.max.y;

		} else {

			min += plane.normal.y * this.max.y;
			max += plane.normal.y * this.min.y;

		}

		if(plane.normal.z > 0) {

			min += plane.normal.z * this.min.z;
			max += plane.normal.z * this.max.z;

		} else {

			min += plane.normal.z * this.max.z;
			max += plane.normal.z * this.min.z;

		}

		return (min <= - plane.constant && max >= - plane.constant);
	}

	/**
	 * Clamp a given vector inside this box.
	 * @param point Vector to clamp.
	 * @returns Vector clammped.
	 */
	public clampPoint(point: Vector3): Vector3 {
		return point.clampSelf(this.min, this.max);
	}

	/**
	 * Get distance between this box and a given point.
	 * @param point Point to get distance to.
	 * @returns Distance to point.
	 */
	public distanceToPoint(point: Vector3): number {
		return point.clamp(this.min, this.max).distanceTo(point);
	}

	/**
	 * Computes the intersection of this box with another box.
	 * This will set the upper bound of this box to the lesser of the two boxes' upper bounds and the lower bound of this box to the greater of the two boxes' lower bounds.
	 * If there's no overlap, makes this box empty.
	 * @param box Box to intersect with.
	 * @returns Self.
	 */
	public intersectWith(box: Box): Box {
		this.min.max(box.min);
		this.max.min(box.max);

		// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
		if(this.isEmpty()) this.makeEmpty();

		return this;
	}

	/**
	 * Computes the union of this box and box.
	 * This will set the upper bound of this box to the greater of the two boxes' upper bounds and the lower bound of this box to the lesser of the two boxes' lower bounds.
	 * @param box Box to union with.
	 * @returns Self.
	 */
	public unionWith(box: Box): Box {
		this.min.min(box.min);
		this.max.max(box.max);
		return this;
	}

	/**
	 * Move this box.
	 * @param offset Offset to move box by.
	 * @returns Self.
	 */
	public translate(offset: Box): Box {
		this.min.add(offset);
		this.max.add(offset);
		return this;
	}

	/**
	 * Check if equal to another box.
	 * @param other Other box to compare to.
	 * @returns True if boxes are equal, false otherwise.
	 */
	public equals(box: Box): boolean {
		return box.min.equals(this.min) && box.max.equals(this.max);
	}
}

const _vector = /*@__PURE__*/ new Vector3();

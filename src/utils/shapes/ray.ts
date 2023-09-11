import { Box } from "./box";
import { Sphere } from "./sphere";
import { Vector3 } from "./vector3";

/**
 * A 3D ray.
 */
export class Ray {
	public origin: Vector3;
	public direction: Vector3;

	/**
	 * Create the Ray.
	 * @param origin Ray origin point.
	 * @param direction Ray 3d direction.
	 */
	public constructor(origin: Vector3, direction: Vector3) {
		this.origin = origin.clone();
		this.direction = direction.clone();
	}

	/**
	 * Set the ray components.
	 * @param origin Ray origin point.
	 * @param direction Ray 3d direction.
	 * @returns Self.
	 */
	public set(origin: Vector3, direction: Vector3): Ray {
		this.origin.copy(origin);
		this.direction.copy(direction);
		return this;
	}

	/**
	 * Copy values from another ray.
	 * @param ray Ray to copy.
	 * @returns Self.
	 */
	public copy(ray: Ray): Ray {
		this.set(ray.origin, ray.direction);
		return this;
	}

	/**
	 * Check if this ray equals another ray.
	 * @param ray Other ray to compare to.
	 * @returns True if equal, false otherwise.
	 */
	public equals(ray: Ray): boolean {
		return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
	}

	/**
	 * Get the 3d point on the ray by distance from origin.
	 * @param distance Distance from origin to travel.
	 * @returns Point on ray from origin.
	 */
	public at(distance: number): Vector3 {
		return this.origin.add(this.direction.mul(distance));
	}

	/**
	 * Calculate distance to a 3d point.
	 * @param point Point to calculate distance to.
	 * @returns Distance to point.
	 */
	public distanceToPoint(point: Vector3): number {
		return Math.sqrt(this.distanceToPointSquared(point));
	}

	/**
	 * Calculate squared distance to a 3d point.
	 * @param point Point to calculate distance to.
	 * @returns Squared distance to point.
	 */
	public distanceToPointSquared(point: Vector3): number {
		const directionDistance = point.sub(this.origin).dot(this.direction);

		// point behind the ray
		if(directionDistance < 0) return this.origin.distanceToSquared(point);

		const v = this.origin.add(this.direction.mul(directionDistance));
		return v.distanceToSquared(point);
	}

	/**
	 * Check if this ray collides with a sphere.
	 * @param sphere Sphere to test collision with.
	 * @returns True if collide with sphere, false otherwise.
	 */
	public collideSphere(sphere: Sphere): boolean {
		return this.distanceToPointSquared(sphere.center) <= (sphere.radius * sphere.radius);
	}

	/**
	 * Check if this ray collides with a box.
	 * @param box Box to test collision with.
	 * @returns True if collide with box, false otherwise.
	 */
	public collideBox(box: Box): boolean {
		return Boolean(this.findCollisionPointWithBox(box));
	}

	/**
	 * Return the collision point between the ray and a box, or null if they don't collide.
	 * @param box Box to get collision with.
	 * @returns Collision point or null.
	 */
	public findCollisionPointWithBox(box: Box): Vector3 | null {

		let txmin, txmax, tymin, tymax, tzmin, tzmax;

		const invdirx = 1 / this.direction.x;
		const invdiry = 1 / this.direction.y;
		const invdirz = 1 / this.direction.z;

		const origin = this.origin;

		if(invdirx >= 0) {
			txmin = (box.min.x - origin.x) * invdirx;
			txmax = (box.max.x - origin.x) * invdirx;
		} else {
			txmin = (box.max.x - origin.x) * invdirx;
			txmax = (box.min.x - origin.x) * invdirx;
		}

		if(invdiry >= 0) {
			tymin = (box.min.y - origin.y) * invdiry;
			tymax = (box.max.y - origin.y) * invdiry;
		} else {
			tymin = (box.max.y - origin.y) * invdiry;
			tymax = (box.min.y - origin.y) * invdiry;
		}

		if((txmin > tymax) || (tymin > txmax)) return null;

		if(tymin > txmin || isNaN(txmin)) txmin = tymin;

		if(tymax < txmax || isNaN(txmax)) txmax = tymax;

		if(invdirz >= 0) {
			tzmin = (box.min.z - origin.z) * invdirz;
			tzmax = (box.max.z - origin.z) * invdirz;
		} else {
			tzmin = (box.max.z - origin.z) * invdirz;
			tzmax = (box.min.z - origin.z) * invdirz;
		}

		if((txmin > tzmax) || (tzmin > txmax)) return null;

		if(tzmin > txmin || txmin !== txmin) txmin = tzmin;

		if(tzmax < txmax || txmax !== txmax) txmax = tzmax;

		// return point closest to the ray (positive side)

		if(txmax < 0) return null;

		// return position
		return this.at(txmin >= 0 ? txmin : txmax);
	}

	/**
	 * Clone this ray.
	 * @returns Cloned ray.
	 */
	public clone(): Ray {
		return new Ray(this.origin, this.direction);
	}
}

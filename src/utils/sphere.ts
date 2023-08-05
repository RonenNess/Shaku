import Box from "./box";
import MathHelper from "./math_helper";
import Plane from "./plane";
import Vector3 from "./vector3";

/**
 * A 3D sphere.
 */
export default class Sphere {
	public center: Vector3;
	public radius: number;

	/**
	 * Create the Sphere.
	 * @param center Sphere center position.
	 * @param radius Sphere radius.
	 */
	public constructor(center: Vector3, radius: number) {
		this.center = center.clone();
		this.radius = radius;
	}

	/**
	 * Return a clone of this sphere.
	 * @returns Cloned sphere.
	 */
	public clone(): Sphere {
		return new Sphere(this.center, this.radius);
	}

	/**
	 * Check if this sphere contains a Vector3.
	 * @param p Point to check.
	 * @returns if point is contained within the sphere.
	 */
	public containsVector(p: Vector3): boolean {
		return this.center.distanceTo(p) <= this.radius;
	}

	/**
	 * Check if equal to another sphere.
	 * @param other Other sphere to compare to.
	 * @returns True if spheres are equal, false otherwise.
	 */
	public equals(other: Sphere): boolean {
		return (other === this) ||
			(other && (other.constructor === this.constructor) &&
				this.center.equals(other.center) && (this.radius == other.radius));
	}

	/**
	 * Create sphere from a dictionary.
	 * @param data Dictionary with {center, radius}.
	 * @returns Newly created sphere.
	 */
	public static fromDict(data: { center: Vector3, radius: number; }): Sphere {
		return new Sphere(Vector3.fromDict(data.center || {}), data.radius || 0);
	}

	/**
	 * Convert to dictionary.
	 * @param minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns Dictionary with {center, radius}.
	 */
	public toDict(minimized: true): Partial<{ center: ReturnType<Vector3["toDict"]>, radius: number; }>;
	public toDict(minimized?: false): { center: ReturnType<Vector3["toDict"]>, radius: number; };
	public toDict(minimized?: boolean): Partial<{ center: ReturnType<Vector3["toDict"]>, radius: number; }> {
		if(minimized) {
			const ret = {};
			if(this.radius) { ret.radius = this.radius; }
			if(this.center.x || this.center.y) { ret.center = this.center.toDict(true); }
			return ret;
		}
		return { center: this.center.toDict(), radius: this.radius };
	}

	/**
	 * Check if collide with a box.
	 * @param box Box to check.
	 * @returns True if collide, false otherwise.
	 */
	public collideBox(box: Box): boolean {
		return box.collideSphere(this);
	}

	/**
	 * Check if collide with a plane.
	 * @param plane Plane to test.
	 * @returns True if collide, false otherwise.
	 */
	public collidePlane(plane: Plane): boolean {
		return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
	}

	/**
	 * Lerp between two sphere.
	 * @param p1 First sphere.
	 * @param p2 Second sphere.
	 * @param a Lerp factor (0.0 - 1.0).
	 * @returns result sphere.
	 */
	public static lerp(p1: Sphere, p2: Sphere, a: number): Sphere {
		let lerpScalar = MathHelper.lerp;
		return new Sphere(Vector3.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
	}
}

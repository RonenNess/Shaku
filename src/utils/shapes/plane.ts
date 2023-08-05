import { Line } from "./line";
import { Sphere } from "./sphere";
import { Vector3 } from "./vector3";

/**
 * A plane in 3D space.
 */
export class Plane {
	public normal: Vector3;
	public constant: number;

	/**
	 * Create the plane.
	 * @param normal Plane normal vector.
	 * @param constant Plane constant.
	 */
	public constructor(normal = new Vector3(1, 0, 0), constant = 0) {
		this.normal = normal;
		this.constant = constant;
	}

	/**
	 * Set the plane components.
	 * @param normal Plane normal.
	 * @param constant Plane constant.
	 * @returns Self.
	 */
	public set(normal: Vector3, constant: number): Plane {
		this.normal.copy(normal);
		this.constant = constant;
		return this;
	}

	/**
	 * Set the plane components.
	 * @param x Plane normal X.
	 * @param y Plane normal Y.
	 * @param z Plane normal Z.
	 * @param w Plane constant.
	 * @returns Self.
	 */
	public setComponents(x: number, y: number, z: number, w: number): Plane {
		this.normal.set(x, y, z);
		this.constant = w;
		return this;
	}

	/**
	 * Set plane from normal and coplanar point vectors.
	 * @param normal Plane normal.
	 * @param point Coplanar point.
	 * @returns Self.
	 */
	public setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane {
		this.normal.copy(normal);
		this.constant = -(point.dot(this.normal));
		return this;
	}

	/**
	 * Copy values from another plane.
	 * @param plane Plane to copy.
	 * @returns Self.
	 */
	public copy(plane: Plane): Plane {
		this.normal.copy(plane.normal);
		this.constant = plane.constant;
		return this;
	}

	/**
	 * Normalize the plane.
	 * @returns self.
	 */
	public normalizeSelf(): Plane {
		// Note: will lead to a divide by zero if the plane is invalid.
		const inverseNormalLength = 1.0 / this.normal.length();
		this.normal.mulSelf(inverseNormalLength);
		this.constant *= inverseNormalLength;
		return this;
	}

	/**
	 * Normalize a clone of this plane.
	 * @returns Normalized clone.
	 */
	public normalized(): Plane {
		return this.clone().normalizeSelf();
	}

	/**
	 * Negate this plane.
	 * @returns Self.
	 */
	public negateSelf(): Plane {
		this.constant *= -1;
		this.normal.mulSelf(-1);
		return this;
	}

	/**
	 * Calculate distance to point.
	 * @param point Point to calculate distance to.
	 * @returns Distance to point.
	 */
	public distanceToPoint(point: Vector3): number {
		return this.normal.dot(point) + this.constant;
	}

	/**
	 * Calculate distance to sphere.
	 * @param sphere Sphere to calculate distance to.
	 * @returns Distance to sphere.
	 */
	public distanceToSphere(sphere: Sphere): number {
		return this.distanceToPoint(sphere.center) - sphere.radius;
	}

	/**
	 * Check if this plane collide with a line.
	 * @param line Line to check.
	 * @returns True if collide, false otherwise.
	 */
	public collideLine(line: Line): boolean {
		// Note: this tests if a line collide the plane, not whether it (or its end-points) are coplanar with it.
		const startSign = this.distanceToPoint(line.start);
		const endSign = this.distanceToPoint(line.end);
		return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
	}

	/**
	 * Check if this plane collide with a sphere.
	 * @param sphere Sphere to check.
	 * @returns True if collide, false otherwise.
	 */
	public collideSphere(sphere: Sphere): boolean {
		return sphere.collidePlane(this);
	}

	/**
	 * Coplanar a point.
	 * @returns Coplanar point as a new vector.
	 */
	public coplanarPoint(): Vector3 {
		return this.normal.mul(-this.constant);
	}

	/**
	 * Translate this plane.
	 * @param offset Offset to translate to.
	 * @returns Self.
	 */
	public translateSelf(offset: Vector3): Plane {
		this.constant -= offset.dot(this.normal);
		return this;
	}

	/**
	 * Check if this plane equals another plane.
	 * @param plane Other plane to compare to.
	 * @returns True if equal, false otherwise.
	 */
	public equals(plane: Plane): boolean {
		return plane.normal.equals(this.normal) && (plane.constant === this.constant);
	}

	/**
	 * Clone this plane.
	 * @returns Cloned plane.
	 */
	public clone(): Plane {
		return new Plane().copy(this);
	}
}

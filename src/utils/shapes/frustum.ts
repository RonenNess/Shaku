import { Matrix } from "../matrix";
import { Box } from "./box";
import { Plane } from "./plane";
import { Sphere } from "./sphere";
import { Vector3 } from "./vector3";

/**
 * Implement a 3D Frustum shape.
 */
export class Frustum {
	public planes: Plane[];

	/**
	 * Create the frustum.
	 * @param p0 Frustum plane.
	 * @param p1 Frustum plane.
	 * @param p2 Frustum plane.
	 * @param p3 Frustum plane.
	 * @param p4 Frustum plane.
	 * @param p5 Frustum plane.
	 */
	public constructor(p0 = new Plane(), p1 = new Plane(), p2 = new Plane(), p3 = new Plane(), p4 = new Plane(), p5 = new Plane()) {
		this.planes = [p0, p1, p2, p3, p4, p5];
	}

	/**
	 * Set the Frustum values.
	 * @param p0 Frustum plane.
	 * @param p1 Frustum plane.
	 * @param p2 Frustum plane.
	 * @param p3 Frustum plane.
	 * @param p4 Frustum plane.
	 * @param p5 Frustum plane.
	 * @returns Self.
	 */
	public set(p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane): Frustum {
		const planes = this.planes;
		planes[0].copy(p0);
		planes[1].copy(p1);
		planes[2].copy(p2);
		planes[3].copy(p3);
		planes[4].copy(p4);
		planes[5].copy(p5);
		return this;
	}

	/**
	 * Copy values from another frustum.
	 * @param frustum Frustum to copy.
	 * @returns Self.
	 */
	public copy(frustum: Frustum): Frustum {
		const planes = this.planes;
		for(let i = 0; i < 6; i++) {
			planes[i].copy(frustum.planes[i]);
		}
		return this;
	}

	/**
	 * Set frustum from projection matrix.
	 * @param m Matrix to build frustum from.
	 * @returns Self.
	 */
	public setFromProjectionMatrix(m: Matrix): Frustum {
		const planes = this.planes;
		const me = m.values;
		const me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
		const me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
		const me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
		const me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

		planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalizeSelf();
		planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalizeSelf();
		planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalizeSelf();
		planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalizeSelf();
		planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalizeSelf();
		planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalizeSelf();

		return this;
	}

	/**
	 * Check if the frustum collides with a sphere.
	 * @param sphere Sphere to check.
	 * @returns True if point is in frustum, false otherwise.
	 */
	public collideSphere(sphere: Sphere): boolean {
		const planes = this.planes;
		const center = sphere.center;
		const negRadius = - sphere.radius;
		for(let i = 0; i < 6; i++) {
			const distance = planes[i].distanceToPoint(center);
			if(distance < negRadius) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Check if collide with a box.
	 * @param box Box to check.
	 * @returns True if collide, false otherwise.
	 */
	public collideBox(box: Box): boolean {
		const planes = this.planes;
		for(let i = 0; i < 6; i++) {
			const plane = planes[i];

			// corner at max distance
			_vector.x = plane.normal.x > 0 ? box.max.x : box.min.x;
			_vector.y = plane.normal.y > 0 ? box.max.y : box.min.y;
			_vector.z = plane.normal.z > 0 ? box.max.z : box.min.z;

			if(plane.distanceToPoint(_vector) < 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Check if the frustum contains a point.
	 * @param point Vector to check.
	 * @returns True if point is in frustum, false otherwise.
	 */
	public containsPoint(point: Vector3): boolean {
		const planes = this.planes;
		for(let i = 0; i < 6; i++) {
			if(planes[i].distanceToPoint(point) < 0) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Clone this frustum.
	 * @returns Cloned frustum.
	 */
	public clone(): Frustum {
		return new Frustum().copy(this);
	}
}

const _vector = /*@__PURE__*/ new Vector3();

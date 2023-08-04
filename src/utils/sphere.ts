import MathHelper from "./math_helper";
import Vector3 from "./vector3";

/**
 * A 3D sphere.
 */
class Sphere {
	/**
	 * Create the Sphere.
	 * @param {Vector3} center Sphere center position.
	 * @param {Number} radius Sphere radius.
	 */
	constructor(center, radius) {
		this.center = center.clone();
		this.radius = radius;
	}

	/**
	 * Return a clone of this sphere.
	 * @returns {Sphere} Cloned sphere.
	 */
	clone() {
		return new Sphere(this.center, this.radius);
	}

	/**
	 * Check if this sphere contains a Vector3.
	 * @param {Vector3} p Point to check.
	 * @returns {Boolean} if point is contained within the sphere.
	 */
	containsVector(p) {
		return this.center.distanceTo(p) <= this.radius;
	}

	/**
	 * Check if equal to another sphere.
	 * @param {Sphere} other Other sphere to compare to.
	 * @returns {Boolean} True if spheres are equal, false otherwise.
	 */
	equals(other) {
		return (other === this) ||
			(other && (other.constructor === this.constructor) &&
				this.center.equals(other.center) && (this.radius == other.radius));
	}

	/**
	 * Create sphere from a dictionary.
	 * @param {*} data Dictionary with {center, radius}.
	 * @returns {Sphere} Newly created sphere.
	 */
	static fromDict(data) {
		return new Sphere(Vector3.fromDict(data.center || {}), data.radius || 0);
	}

	/**
	 * Convert to dictionary.
	 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns {*} Dictionary with {center, radius}.
	 */
	toDict(minimized) {
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
	 * @param {Box} box Box to check.
	 * @returns {Boolean} True if collide, false otherwise.
	 */
	collideBox(box) {
		return box.collideSphere(this);
	}

	/**
	 * Check if collide with a plane.
	 * @param {Plane} plane Plane to test.
	 * @returns {Boolean} True if collide, false otherwise.
	 */
	collidePlane(plane) {
		return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
	}

	/**
	 * Lerp between two sphere.
	 * @param {Sphere} p1 First sphere.
	 * @param {Sphere} p2 Second sphere.
	 * @param {Number} a Lerp factor (0.0 - 1.0).
	 * @returns {Sphere} result sphere.
	 */
	static lerp(p1, p2, a) {
		let lerpScalar = MathHelper.lerp;
		return new Sphere(Vector3.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
	}
}

// export the sphere class
export default Sphere;

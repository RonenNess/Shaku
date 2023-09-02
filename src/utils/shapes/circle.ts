import { MathHelper } from "../math_helper";
import { Vector2 } from "./vector2";

/**
 * Implement a simple 2d Circle.
 */
export class Circle {
	public center: Vector2;
	public radius: number;

	/**
	 * Create the Circle.
	 * @param center Circle center position.
	 * @param radius Circle radius.
	 */
	public constructor(center: Vector2, radius: number) {
		this.center = center.clone();
		this.radius = radius;
	}

	/**
	 * Return a clone of this circle.
	 * @returns Cloned circle.
	 */
	public clone(): Circle {
		return new Circle(this.center, this.radius);
	}

	/**
	 * Check if this circle contains a Vector2.
	 * @param p Point to check.
	 * @returns if point is contained within the circle.
	 */
	public containsVector(p: Vector2): boolean {
		return this.center.distanceTo(p) <= this.radius;
	}

	/**
	 * Check if equal to another circle.
	 * @param other Other circle to compare to.
	 * @returns True if circles are equal, false otherwise.
	 */
	public equals(other: Circle): boolean {
		return (other === this) ||
			(other && (other.constructor === this.constructor) &&
				this.center.equals(other.center) && (this.radius === other.radius));
	}

	/**
	 * Create circle from a dictionary.
	 * @param data Dictionary with {center, radius}.
	 * @returns Newly created circle.
	 */
	public static fromDict(data: Partial<SerializedCircle>): Circle {
		return new Circle(Vector2.fromDict(data.center ?? {}), data.radius ?? 0);
	}

	/**
	 * Convert to dictionary.
	 * @param minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns Dictionary with {center, radius}.
	 */
	public toDict(minimized: true): Partial<SerializedCircle>;
	public toDict(minimized?: false): SerializedCircle;
	public toDict(minimized?: boolean): Partial<SerializedCircle> {
		if(minimized) {
			const ret: Partial<SerializedCircle> = {};
			if(this.radius) ret.radius = this.radius;
			if(this.center.x || this.center.y) ret.center = this.center.toDict(true);
			return ret;
		}
		return { center: this.center.toDict(), radius: this.radius };
	}

	/**
	 * Lerp between two circle.
	 * @param p1 First circle.
	 * @param p2 Second circle.
	 * @param a Lerp factor (0.0 - 1.0).
	 * @returns result circle.
	 */
	public static lerp(p1: Circle, p2: Circle, a: number): Circle {
		const lerpScalar = MathHelper.lerp.bind(Circle);
		return new Circle(Vector2.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
	}
}

export interface SerializedCircle {
	center: ReturnType<Vector2["toDict"]>;
	radius: number;
}

import { Vector2 } from "../utils";
import { CollisionShape } from "./shapes";

/**
 * Collision detection result.
 */
export class CollisionTestResult {

	/**
	 * Collision position, only relevant when there's a single touching point.
	 * For shapes with multiple touching points, this will be null.
	 */
	public position: Vector2 | null;

	/**
	 * First collided shape.
	 */
	public first: CollisionShape;

	/**
	 * Second collided shape.
	 */
	public second: CollisionShape;

	/**
	 * Create the collision result.
	 * @param position Optional collision position.
	 * @param first First shape in the collision check.
	 * @param second Second shape in the collision check.
	 */
	public constructor(position: Vector2 | null = null, first: CollisionShape, second: CollisionShape) {
		this.position = position;
		this.first = first;
		this.second = second;
	}
}

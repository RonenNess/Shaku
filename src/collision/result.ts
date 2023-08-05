import { Vector2 } from "../utils";
import { CollisionShape } from "./shapes";

/**
 * Collision detection result.
 */
export class CollisionTestResult {
	/**
	 * Create the collision result.
	 * @param {Vector2} position Optional collision position.
	 * @param {CollisionShape} first First shape in the collision check.
	 * @param {CollisionShape} second Second shape in the collision check.
	 */
	public constructor(position, first, second) {
		/**
		 * Collision position, only relevant when there's a single touching point.
		 * For shapes with multiple touching points, this will be null.
		 * @name CollisionTestResult#position
		 * @type {Vector2}
		 */
		this.position = position;

		/**
		 * First collided shape.
		 * @name CollisionTestResult#first
		 * @type {CollisionShape}
		 */
		this.first = first;

		/**
		 * Second collided shape.
		 * @name CollisionTestResult#second
		 * @type {CollisionShape}
		 */
		this.second = second;
	}
}

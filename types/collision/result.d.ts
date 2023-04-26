export = CollisionTestResult;
/**
 * Collision detection result.
 */
declare class CollisionTestResult {
    /**
     * Create the collision result.
     * @param {Vector2} position Optional collision position.
     * @param {CollisionShape} first First shape in the collision check.
     * @param {CollisionShape} second Second shape in the collision check.
     */
    constructor(position: Vector2, first: CollisionShape, second: CollisionShape);
    /**
     * Collision position, only relevant when there's a single touching point.
     * For shapes with multiple touching points, this will be null.
     * @name CollisionTestResult#position
     * @type {Vector2}
     */
    position: Vector2;
    /**
     * First collided shape.
     * @name CollisionTestResult#first
     * @type {CollisionShape}
     */
    first: CollisionShape;
    /**
     * Second collided shape.
     * @name CollisionTestResult#second
     * @type {CollisionShape}
     */
    second: CollisionShape;
}
import Vector2 = require("../utils/vector2");
import CollisionShape = require("./shapes/shape");
//# sourceMappingURL=result.d.ts.map
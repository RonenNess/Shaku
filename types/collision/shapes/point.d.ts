export = PointShape;
/**
 * Collision point class.
 */
declare class PointShape extends CollisionShape {
    /**
     * Create the collision shape.
     * @param {Vector2} position Point position.
     */
    constructor(position: Vector2);
    /**
     * Set this collision shape from vector2.
     * @param {Vector2} position Point position.
     */
    setPosition(position: Vector2): void;
    _position: Vector2;
    _boundingBox: Rectangle;
    /**
     * Get point position.
     * @returns {Vector2} Point position.
     */
    getPosition(): Vector2;
}
import CollisionShape = require("./shape");
import Vector2 = require("../../utils/vector2");
import Rectangle = require("../../utils/rectangle");
//# sourceMappingURL=point.d.ts.map
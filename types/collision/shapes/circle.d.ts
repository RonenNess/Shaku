export = CircleShape;
/**
 * Collision circle class.
 */
declare class CircleShape extends CollisionShape {
    /**
     * Create the collision shape.
     * @param {Circle} circle the circle shape.
     */
    constructor(circle: Circle);
    /**
     * Set this collision shape from circle.
     * @param {Circle} circle Circle shape.
     */
    setShape(circle: Circle): void;
    _circle: Circle;
    _position: import("../../utils/vector2");
    _boundingBox: Rectangle;
}
import CollisionShape = require("./shape");
import Circle = require("../../utils/circle");
import Rectangle = require("../../utils/rectangle");
//# sourceMappingURL=circle.d.ts.map
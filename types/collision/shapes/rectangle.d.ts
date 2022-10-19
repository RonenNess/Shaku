export = RectangleShape;
/**
 * Collision rectangle class.
 */
declare class RectangleShape extends CollisionShape {
    /**
     * Create the collision shape.
     * @param {Rectangle} rectangle the rectangle shape.
     */
    constructor(rectangle: Rectangle);
    /**
     * Set this collision shape from rectangle.
     * @param {Rectangle} rectangle Rectangle shape.
     */
    setShape(rectangle: Rectangle): void;
    _rect: Rectangle;
    _center: import("../../utils/vector2");
    _radius: number;
}
import CollisionShape = require("./shape");
import Rectangle = require("../../utils/rectangle");
//# sourceMappingURL=rectangle.d.ts.map
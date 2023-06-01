export = CollisionShape;
/**
 * Collision shape base class.
 */
declare class CollisionShape {
    _world: any;
    _worldRange: any;
    _debugColor: any;
    _forceDebugColor: Color;
    _collisionFlags: any;
    /**
     * Get the collision shape's unique identifier.
     * @returns {String} Shape's unique identifier
     */
    get shapeId(): string;
    /**
     * Set collision flags (matched against collision mask when checking collision).
     */
    set collisionFlags(arg: any);
    /**
     * Get collision flags (matched against collision mask when checking collision).
     */
    get collisionFlags(): any;
    /**
     * Get Shapes beatch to draw this shape with, either given or default from world.
     * If not provided and have no world, will throw exception.
     * @private
     */
    private _getDebugDrawBatch;
    /**
     * Set the debug color to use to draw this shape.
     * @param {Color} color Color to set or null to use default.
     */
    setDebugColor(color: Color): void;
    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     * @param {ShapesBatch} shapesBatch Optional shapes batch to use to debug draw the shape. By default will use the collision world.
     */
    debugDraw(opacity: number, shapesBatch: ShapesBatch): void;
    /**
     * Get shape center position.
     * @returns {Vector2} Center position.
     */
    getCenter(): Vector2;
    /**
     * Remove self from parent world object.
     */
    remove(): void;
    /**
     * Get debug drawing color.
     * @private
     */
    private _getDebugColor;
    /**
     * Get default debug colors for given collision flags.
     * @private
     */
    private _getDefaultDebugColorFor;
    /**
     * Get collision shape's estimated radius box.
     * @private
     * @returns {Number} Shape's radius
     */
    private _getRadius;
    /**
     * Get collision shape's bounding box.
     * @private
     * @returns {Rectangle} Shape's bounding box.
     */
    private _getBoundingBox;
    /**
     * Set the parent collision world this shape is currently in.
     * @private
     * @param {CollisionWorld} world New parent collision world or null to remove.
     */
    private _setParent;
    /**
     * Called when the collision shape changes and we need to update the parent world.
     * @private
     */
    private _shapeChanged;
}
import Color = require("../../utils/color");
import ShapesBatch = require("../../gfx/draw_batches/shapes_batch");
import Vector2 = require("../../utils/vector2");
//# sourceMappingURL=shape.d.ts.map
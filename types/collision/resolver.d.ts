export = CollisionResolver;
/**
 * The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.
 */
declare class CollisionResolver {
    _handlers: {};
    /**
     * Initialize the resolver.
     * @private
     */
    private _init;
    /**
     * Set the method used to test collision between two shapes.
     * Note: you don't need to register the same handler twice for reverse order, its done automatically inside.
     * @param {String} firstShapeId The shape identifier the handler recieves as first argument.
     * @param {String} secondShapeId The shape identifier the handler recieves as second argument.
     * @param {Function} handler Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision.
     */
    setHandler(firstShapeId: string, secondShapeId: string, handler: Function): void;
    /**
     * Check a collision between two shapes.
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @returns {CollisionTestResult} collision detection result or null if they don't collide.
     */
    test(first: CollisionShape, second: CollisionShape): CollisionTestResult;
    /**
     * Check a collision between two shapes.
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @param {Function} handler Method to test collision between the shapes.
     * @returns {CollisionTestResult} collision detection result or null if they don't collide.
     */
    testWithHandler(first: CollisionShape, second: CollisionShape, handler: Function): CollisionTestResult;
    /**
     * Get handlers dictionary for a given shape.
     */
    getHandlers(shape: any): any;
    /**
     * Get the collision detection method for two given shapes.
     * @private
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @returns {Function} collision detection method or null if not found.
     */
    private _getCollisionMethod;
}
import CollisionShape = require("./shapes/shape.js");
import CollisionTestResult = require("./result.js");
//# sourceMappingURL=resolver.d.ts.map
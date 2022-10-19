export = CollisionWorld;
/**
 * A collision world is a set of collision shapes that interact with each other.
 * You can use different collision worlds to represent different levels or different parts of your game world.
 */
declare class CollisionWorld {
    /**
     * Create the collision world.
     * @param {CollisionResolver} resolver Collision resolver to use for this world.
     * @param {Number|Vector2} gridCellSize For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size.
     */
    constructor(resolver: CollisionResolver, gridCellSize: number | Vector2);
    /**
     * Collision resolver used in this collision world.
     * By default, will inherit the collision manager default resolver.
     */
    resolver: CollisionResolver;
    _gridCellSize: Vector2;
    _grid: {};
    _shapesToUpdate: any;
    _cellsToDelete: any;
    /**
     * Do collision world updates, if we have any.
     * @private
     */
    private _performUpdates;
    /**
     * Update a shape in collision world after it moved or changed.
     * @private
     */
    private _updateShape;
    /**
     * Request update for this shape on next updates call.
     * @private
     */
    private _queueUpdate;
    /**
     * Iterate all shapes in world.
     * @param {Function} callback Callback to invoke on all shapes. Return false to break iteration.
     */
    iterateShapes(callback: Function): void;
    /**
     * Add a collision shape to this world.
     * @param {CollisionShape} shape Shape to add.
     */
    addShape(shape: CollisionShape): void;
    /**
     * Remove a collision shape from this world.
     * @param {CollisionShape} shape Shape to remove.
     */
    removeShape(shape: CollisionShape): void;
    /**
     * Iterate shapes that match broad phase test.
     * @private
     * @param {CollisionShape} shape Shape to test.
     * @param {Function} handler Method to run on all shapes in phase. Return true to continue iteration, false to break.
     * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with.
     */
    private _iterateBroadPhase;
    /**
     * Test collision with shapes in world, and return just the first result found.
     * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
     * @param {Boolean} sortByDistance If true will return the nearest collision found (based on center of shapes).
     * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
     * @returns {CollisionTestResult} A collision test result, or null if not found.
     */
    testCollision(sourceShape: CollisionShape, sortByDistance: boolean, mask: number, predicate: Function): CollisionTestResult;
    /**
     * Test collision with shapes in world, and return all results found.
     * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
     * @param {Boolean} sortByDistance If true will sort results by distance.
     * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
     * @param {Function} intermediateProcessor Optional method to run after each positive result with the collision result as param. Return false to stop and return results.
     * @returns {Array<CollisionTestResult>} An array of collision test results, or empty array if none found.
     */
    testCollisionMany(sourceShape: CollisionShape, sortByDistance: boolean, mask: number, predicate: Function, intermediateProcessor: Function): Array<CollisionTestResult>;
    /**
     * Return array of shapes that touch a given position, with optional radius.
     * @example
     * let shapes = world.pick(Shaku.input.mousePosition);
     * @param {*} position Position to pick.
     * @param {*} radius Optional picking radius to use a circle instead of a point.
     * @param {*} sortByDistance If true, will sort results by distance from point.
     * @param {*} mask Collision mask to filter by.
     * @param {*} predicate Optional predicate method to filter by.
     * @returns {Array<CollisionShape>} Array with collision shapes we picked.
     */
    pick(position: any, radius: any, sortByDistance: any, mask: any, predicate: any): Array<CollisionShape>;
    /**
     * Debug-draw the current collision world.
     * @param {Color} gridColor Optional grid color (default to black).
     * @param {Color} gridHighlitColor Optional grid color for cells with shapes in them (default to red).
     * @param {Number} opacity Optional opacity factor (default to 0.5).
     * @param {Camera} camera Optional camera for offset and viewport.
     */
    debugDraw(gridColor: Color, gridHighlitColor: Color, opacity: number, camera: Camera): void;
}
import CollisionResolver = require("./resolver");
import Vector2 = require("../utils/vector2");
import CollisionShape = require("./shapes/shape");
import CollisionTestResult = require("./result");
import Color = require("../utils/color");
//# sourceMappingURL=collision_world.d.ts.map
declare const _exports: Collision;
export = _exports;
/**
 * Collision is the collision manager.
 * It provides basic 2d collision detection functionality.
 * Note: this is *not* a physics engine, its only for detection and objects picking.
 *
 * To access the Collision manager you use `Shaku.collision`.
 */
declare class Collision extends IManager {
    /**
     * The collision resolver we use to detect collision between different shapes.
     * You can use this object directly without creating a collision world, if you just need to test collision between shapes.
     */
    resolver: CollisionResolver;
    /**
     * @inheritdoc
     * @private
     **/
    private setup;
    /**
     * Create a new collision world object.
     * @param {Number|Vector2} gridCellSize Collision world grid cell size.
     * @returns {CollisionWorld} Newly created collision world.
     */
    createWorld(gridCellSize: number | Vector2): CollisionWorld;
    /**
     * Get the collision reactanle shape class.
     */
    get RectangleShape(): typeof RectangleShape;
    /**
     * Get the collision point shape class.
     */
    get PointShape(): typeof PointShape;
    /**
     * Get the collision circle shape class.
     */
    get CircleShape(): typeof CircleShape;
    /**
     * Get the collision lines shape class.
     */
    get LinesShape(): typeof LinesShape;
    /**
     * Get the tilemap collision shape class.
     */
    get TilemapShape(): typeof TilemapShape;
}
import IManager = require("../manager.js");
import CollisionResolver = require("./resolver");
import Vector2 = require("../utils/vector2.js");
import CollisionWorld = require("./collision_world.js");
import RectangleShape = require("./shapes/rectangle.js");
import PointShape = require("./shapes/point.js");
import CircleShape = require("./shapes/circle.js");
import LinesShape = require("./shapes/lines.js");
import TilemapShape = require("./shapes/tilemap.js");
//# sourceMappingURL=collision.d.ts.map
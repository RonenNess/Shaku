export = TilemapShape;
/**
 * Collision tilemap class.
 * A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
 * Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.
 */
declare class TilemapShape extends CollisionShape {
    /**
     * Create the collision tilemap.
     * @param {Vector2} offset Tilemap top-left corner.
     * @param {Vector2} gridSize Number of tiles on X and Y axis.
     * @param {Vector2} tileSize The size of a single tile.
     * @param {Number} borderThickness Set a border collider with this thickness.
     */
    constructor(offset: Vector2, gridSize: Vector2, tileSize: Vector2, borderThickness: number);
    _offset: Vector2;
    _intBoundingRect: Rectangle;
    _boundingRect: Rectangle;
    _center: Vector2;
    _radius: number;
    _borderThickness: number;
    _gridSize: Vector2;
    _tileSize: Vector2;
    _tiles: {};
    /**
     * Get tile key from vector index.
     * Also validate range.
     * @private
     * @param {Vector2} index Index to get key for.
     * @returns {String} tile key.
     */
    private _indexToKey;
    /**
     * Set the state of a tile.
     * @param {Vector2} index Tile index.
     * @param {Boolean} haveCollision Does this tile have collision?
     * @param {Number} collisionFlags Optional collision flag to set for this tile.
     */
    setTile(index: Vector2, haveCollision: boolean, collisionFlags: number): void;
    /**
     * Get the collision shape of a tile at a given position.
     * @param {Vector2} position Position to get tile at.
     * @returns {RectangleShape} Collision shape at this position, or null if not set.
     */
    getTileAt(position: Vector2): RectangleShape;
    /**
     * Iterate all tiles in given region, represented by a rectangle.
     * @param {Rectangle} region Rectangle to get tiles for.
     * @param {Function} callback Method to invoke for every tile. Return false to break iteration.
     */
    iterateTilesAtRegion(region: Rectangle, callback: Function): void;
    /**
     * Get all tiles in given region, represented by a rectangle.
     * @param {Rectangle} region Rectangle to get tiles for.
     * @returns {Array<RectangleShape>} Array with rectangle shapes or empty if none found.
     */
    getTilesAtRegion(region: Rectangle): Array<RectangleShape>;
    /**
     * @inheritdoc
     */
    debugDraw(opacity: any, shapesBatch: any): void;
}
import CollisionShape = require("./shape");
import Vector2 = require("../../utils/vector2");
import Rectangle = require("../../utils/rectangle");
import RectangleShape = require("./rectangle");
//# sourceMappingURL=tilemap.d.ts.map
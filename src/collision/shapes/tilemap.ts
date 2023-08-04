import Rectangle from "../../utils/rectangle";
import Vector2 from "../../utils/vector2";
import RectangleShape from "./rectangle";
import CollisionShape from "./shape";

/**
 * Collision tilemap class.
 * A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
 * Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.
 */
class TilemapShape extends CollisionShape {
	/**
	 * Create the collision tilemap.
	 * @param {Vector2} offset Tilemap top-left corner.
	 * @param {Vector2} gridSize Number of tiles on X and Y axis.
	 * @param {Vector2} tileSize The size of a single tile.
	 * @param {Number} borderThickness Set a border collider with this thickness.
	 */
	constructor(offset, gridSize, tileSize, borderThickness) {
		super();
		borderThickness = borderThickness || 0;
		this._offset = offset.clone();
		this._intBoundingRect = new Rectangle(offset.x, offset.y, gridSize.x * tileSize.x, gridSize.y * tileSize.y);
		this._boundingRect = this._intBoundingRect.resize(borderThickness * 2);
		this._center = this._boundingRect.getCenter();
		this._radius = this._boundingRect.getBoundingCircle().radius;
		this._borderThickness = borderThickness;
		this._gridSize = gridSize.clone();
		this._tileSize = tileSize.clone();
		this._tiles = {};
	}

	/**
	 * @inheritdoc
	 */
	get shapeId() {
		return "tilemap";
	}

	/**
	 * Get tile key from vector index.
	 * Also validate range.
	 * @private
	 * @param {Vector2} index Index to get key for.
	 * @returns {String} tile key.
	 */
	_indexToKey(index) {
		if(index.x < 0 || index.y < 0 || index.x >= this._gridSize.x || index.y >= this._gridSize.y) {
			throw new Error(`Collision tile with index ${index.x},${index.y} is out of bounds!`);
		}
		return index.x + ',' + index.y;
	}

	/**
	 * Set the state of a tile.
	 * @param {Vector2} index Tile index.
	 * @param {Boolean} haveCollision Does this tile have collision?
	 * @param {Number} collisionFlags Optional collision flag to set for this tile.
	 */
	setTile(index, haveCollision, collisionFlags) {
		let key = this._indexToKey(index);
		if(haveCollision) {
			let rect = this._tiles[key] || new RectangleShape(
				new Rectangle(
					this._offset.x + index.x * this._tileSize.x,
					this._offset.y + index.y * this._tileSize.y,
					this._tileSize.x,
					this._tileSize.y)
			);
			if(collisionFlags !== undefined) {
				rect.collisionFlags = collisionFlags;
			}
			this._tiles[key] = rect;
		}
		else {
			delete this._tiles[key];
		}
	}

	/**
	 * Get the collision shape of a tile at a given position.
	 * @param {Vector2} position Position to get tile at.
	 * @returns {RectangleShape} Collision shape at this position, or null if not set.
	 */
	getTileAt(position) {
		let index = new Vector2(Math.floor(position.x / this._tileSize.x), Math.floor(position.y / this._tileSize.y));
		let key = index.x + ',' + index.y;
		return this._tiles[key] || null;
	}

	/**
	 * Iterate all tiles in given region, represented by a rectangle.
	 * @param {Rectangle} region Rectangle to get tiles for.
	 * @param {Function} callback Method to invoke for every tile. Return false to break iteration.
	 */
	iterateTilesAtRegion(region, callback) {
		let topLeft = region.getTopLeft();
		let bottomRight = region.getBottomRight();
		let startIndex = new Vector2(Math.floor(topLeft.x / this._tileSize.x), Math.floor(topLeft.y / this._tileSize.y));
		let endIndex = new Vector2(Math.floor(bottomRight.x / this._tileSize.x), Math.floor(bottomRight.y / this._tileSize.y));
		for(let i = startIndex.x; i <= endIndex.x; ++i) {
			for(let j = startIndex.y; j <= endIndex.y; ++j) {
				let key = i + ',' + j;
				let tile = this._tiles[key];
				if(tile && (callback(tile) === false)) {
					return;
				}
			}
		}
	}

	/**
	 * Get all tiles in given region, represented by a rectangle.
	 * @param {Rectangle} region Rectangle to get tiles for.
	 * @returns {Array<RectangleShape>} Array with rectangle shapes or empty if none found.
	 */
	getTilesAtRegion(region) {
		let ret = [];
		this.iterateTilesAtRegion(region, (tile) => { ret.push(tile); });
		return ret;
	}

	/**
	 * @inheritdoc
	 */
	_getRadius() {
		return this._radius;
	}

	/**
	 * @inheritdoc
	 */
	_getBoundingBox() {
		return this._boundingRect;
	}

	/**
	 * @inheritdoc
	 */
	getCenter() {
		return this._center.clone();
	}

	/**
	 * @inheritdoc
	 */
	debugDraw(opacity, shapesBatch) {
		if(opacity === undefined) { opacity = 1; }
		for(let key in this._tiles) {
			let tile = this._tiles[key];
			tile.setDebugColor(this._forceDebugColor);
			tile.debugDraw(opacity, shapesBatch);
		}
	}
}

// export collision shape class
export default TilemapShape;

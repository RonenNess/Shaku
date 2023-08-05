import ShapesBatch from "../../gfx/draw_batches/shapes_batch";
import Rectangle from "../../utils/rectangle";
import Vector2 from "../../utils/vector2";
import RectangleShape from "./rectangle";
import CollisionShape from "./shape";

/**
 * Collision tilemap class.
 * A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
 * Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.
 */
export default class TilemapShape extends CollisionShape {
	private _offset: Vector2;
	private _intBoundingRect: Rectangle;
	private _boundingRect: Rectangle;
	private _center: Vector2;
	private _radius: number;
	private _borderThickness: number;
	private _gridSize: Vector2;
	private _tileSize: Vector2;
	private _tiles: Record<string, RectangleShape>;

	/**
	 * Create the collision tilemap.
	 * @param offset Tilemap top-left corner.
	 * @param gridSize Number of tiles on X and Y axis.
	 * @param tileSize The size of a single tile.
	 * @param borderThickness Set a border collider with this thickness.
	 */
	public constructor(offset: Vector2, gridSize: Vector2, tileSize: Vector2, borderThickness?: number) {
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
	public get shapeId(): "tilemap" {
		return "tilemap";
	}

	/**
	 * Get tile key from vector index.
	 * Also validate range.
	 * @private
	 * @param index Index to get key for.
	 * @returns tile key.
	 */
	private _indexToKey(index: Vector2): string {
		if(index.x < 0 || index.y < 0 || index.x >= this._gridSize.x || index.y >= this._gridSize.y) {
			throw new Error(`Collision tile with index ${index.x},${index.y} is out of bounds!`);
		}
		return index.x + "," + index.y;
	}

	/**
	 * Set the state of a tile.
	 * @param index Tile index.
	 * @param haveCollision Does this tile have collision?
	 * @param collisionFlags Optional collision flag to set for this tile.
	 */
	public setTile(index: Vector2, haveCollision: boolean, collisionFlags?: number): void {
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
	 * @param position Position to get tile at.
	 * @returns Collision shape at this position, or null if not set.
	 */
	public getTileAt(position: Vector2): RectangleShape | null {
		let index = new Vector2(Math.floor(position.x / this._tileSize.x), Math.floor(position.y / this._tileSize.y));
		let key = index.x + "," + index.y;
		return this._tiles[key] || null;
	}

	/**
	 * Iterate all tiles in given region, represented by a rectangle.
	 * @param {Rectangle} region Rectangle to get tiles for.
	 * @param {Function} callback Method to invoke for every tile. Return false to break iteration.
	 */
	public iterateTilesAtRegion(region: Rectangle, callback: (tile: RectangleShape) => boolean): void {
		let topLeft = region.getTopLeft();
		let bottomRight = region.getBottomRight();
		let startIndex = new Vector2(Math.floor(topLeft.x / this._tileSize.x), Math.floor(topLeft.y / this._tileSize.y));
		let endIndex = new Vector2(Math.floor(bottomRight.x / this._tileSize.x), Math.floor(bottomRight.y / this._tileSize.y));
		for(let i = startIndex.x; i <= endIndex.x; ++i) {
			for(let j = startIndex.y; j <= endIndex.y; ++j) {
				let key = i + "," + j;
				let tile = this._tiles[key];
				if(tile && (callback(tile) === false)) {
					return;
				}
			}
		}
	}

	/**
	 * Get all tiles in given region, represented by a rectangle.
	 * @param region Rectangle to get tiles for.
	 * @returns Array with rectangle shapes or empty if none found.
	 */
	public getTilesAtRegion(region: Rectangle): RectangleShape[] {
		let ret: RectangleShape[] = [];
		this.iterateTilesAtRegion(region, (tile) => { ret.push(tile); });
		return ret;
	}

	/**
	 * @inheritdoc
	 */
	protected _getRadius(): number {
		return this._radius;
	}

	/**
	 * @inheritdoc
	 */
	protected _getBoundingBox(): Rectangle {
		return this._boundingRect;
	}

	/**
	 * @inheritdoc
	 */
	public getCenter(): Vector2 {
		return this._center.clone();
	}

	/**
	 * @inheritdoc
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch) {
		if(opacity === undefined) { opacity = 1; }
		for(let key in this._tiles) {
			let tile = this._tiles[key];
			tile.setDebugColor(this._forceDebugColor);
			tile.debugDraw(opacity, shapesBatch);
		}
	}
}

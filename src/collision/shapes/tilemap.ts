import { ShapesBatch } from "../../gfx";
import { Rectangle, Vector2 } from "../../utils";
import { RectangleShape } from "./rectangle";
import { CollisionShape } from "./shape";

/**
 * Collision tilemap class.
 * A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
 * Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.
 */
export class TilemapShape extends CollisionShape {
	private offset: Vector2;
	private intBoundingRect: Rectangle;
	private boundingRect: Rectangle;
	private center: Vector2;
	private radius: number;
	private borderThickness: number;
	private gridSize: Vector2;
	private tileSize: Vector2;
	private tiles: Record<string, RectangleShape>;

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
		this.offset = offset.clone();
		this.intBoundingRect = new Rectangle(offset.x, offset.y, gridSize.x * tileSize.x, gridSize.y * tileSize.y);
		this.boundingRect = this.intBoundingRect.resize(borderThickness * 2);
		this.center = this.boundingRect.getCenter();
		this.radius = this.boundingRect.getBoundingCircle().radius;
		this.borderThickness = borderThickness;
		this.gridSize = gridSize.clone();
		this.tileSize = tileSize.clone();
		this.tiles = {};
	}

	/**
	 * @inheritdoc
	 */
	public getShapeId(): "tilemap" {
		return "tilemap";
	}

	/**
	 * Get tile key from vector index.
	 * Also validate range.
	 * @param index Index to get key for.
	 * @returns tile key.
	 */
	private indexToKey(index: Vector2): string {
		if(index.x < 0 || index.y < 0 || index.x >= this.gridSize.x || index.y >= this.gridSize.y) {
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
		const key = this.indexToKey(index);
		if(haveCollision) {
			const rect = this.tiles[key] || new RectangleShape(
				new Rectangle(
					this.offset.x + index.x * this.tileSize.x,
					this.offset.y + index.y * this.tileSize.y,
					this.tileSize.x,
					this.tileSize.y)
			);
			if(collisionFlags !== undefined) rect.collisionFlags = collisionFlags;
			this.tiles[key] = rect;
		}
		else delete this.tiles[key];
	}

	/**
	 * Get the collision shape of a tile at a given position.
	 * @param position Position to get tile at.
	 * @returns Collision shape at this position, or null if not set.
	 */
	public getTileAt(position: Vector2): RectangleShape | null {
		const index = new Vector2(Math.floor(position.x / this.tileSize.x), Math.floor(position.y / this.tileSize.y));
		const key = index.x + "," + index.y;
		return this.tiles[key] || null;
	}

	/**
	 * Iterate all tiles in given region, represented by a rectangle.
	 * @param {Rectangle} region Rectangle to get tiles for.
	 * @param {Function} callback Method to invoke for every tile. Return false to break iteration.
	 */
	public iterateTilesAtRegion(region: Rectangle, callback: (tile: RectangleShape) => boolean): void {
		const topLeft = region.getTopLeft();
		const bottomRight = region.getBottomRight();
		const startIndex = new Vector2(Math.floor(topLeft.x / this.tileSize.x), Math.floor(topLeft.y / this.tileSize.y));
		const endIndex = new Vector2(Math.floor(bottomRight.x / this.tileSize.x), Math.floor(bottomRight.y / this.tileSize.y));
		for(let i = startIndex.x; i <= endIndex.x; ++i) {
			for(let j = startIndex.y; j <= endIndex.y; ++j) {
				const key = i + "," + j;
				const tile = this.tiles[key];
				if(tile && (callback(tile) === false)) return;
			}
		}
	}

	/**
	 * Get all tiles in given region, represented by a rectangle.
	 * @param region Rectangle to get tiles for.
	 * @returns Array with rectangle shapes or empty if none found.
	 */
	public getTilesAtRegion(region: Rectangle): RectangleShape[] {
		const ret: RectangleShape[] = [];
		this.iterateTilesAtRegion(region, (tile) => { ret.push(tile); });
		return ret;
	}

	/**
	 * @inheritdoc
	 */
	protected getRadius(): number {
		return this.radius;
	}

	/**
	 * @inheritdoc
	 */
	protected getBoundingBox(): Rectangle {
		return this.boundingRect;
	}

	/**
	 * @inheritdoc
	 */
	public getCenter(): Vector2 {
		return this.center.clone();
	}

	/**
	 * @inheritdoc
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch) {
		for(const key in this.tiles) {
			const tile = this.tiles[key];
			tile.setDebugColor(this._forceDebugColor);
			tile.debugDraw(opacity, shapesBatch);
		}
	}
}

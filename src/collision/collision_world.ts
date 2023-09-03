import { Camera, ShapesBatch, gfx } from "../gfx";
import { Circle, Color, LoggerFactory, Rectangle, Vector2 } from "../utils";
import { CollisionResolver } from "./resolver";
import { CollisionTestResult } from "./result";
import { CircleShape, CollisionShape, PointShape } from "./shapes";

const _logger = LoggerFactory.getLogger("collision"); // TODO

/**
 * A collision world is a set of collision shapes that interact with each other.
 * You can use different collision worlds to represent different levels or different parts of your game world.
 */
export class CollisionWorld {
	private resolver: CollisionResolver;
	private gridCellSize: Vector2;
	private grid: Record<`${number},${number}`, Set<CollisionShape>>;
	private shapesToUpdate: Set<CollisionShape>;
	private cellsToDelete: Set<string>;
	private _stats!: WorldStats;

	private debugDrawBatch: ShapesBatch;

	/**
	 * Create the collision world.
	 * @param resolver Collision resolver to use for this world.
	 * @param gridCellSize For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size.
	 */
	public constructor(resolver: CollisionResolver, gridCellSize: number | Vector2 = new Vector2(512, 512)) {
		/**
		 * Collision resolver used in this collision world.
		 * By default, will inherit the collision manager default resolver.
		 */
		this.resolver = resolver;

		// set grid cell size
		if(typeof gridCellSize === "number") gridCellSize = new Vector2(gridCellSize, gridCellSize);
		else gridCellSize = gridCellSize.clone();
		this.gridCellSize = gridCellSize;

		// create collision grid
		this.grid = {};

		// shapes that need updates and grid chunks to delete
		this.shapesToUpdate = new Set();
		this.cellsToDelete = new Set();

		// reset stats data
		this.resetStats();
	}

	/**
	 * Reset stats.
	 */
	public resetStats(): void {
		this._stats = {
			updatedShapes: 0,
			addedShapes: 0,
			deletedGridCells: 0,
			createdGridCell: 0,
			broadPhaseShapesChecksPrePredicate: 0,
			broadPhaseShapesChecksPostPredicate: 0,
			broadPhaseCalls: 0,
			collisionChecks: 0,
			collisionMatches: 0,
		};
	}

	/**
	 * Get current stats.
	 * @returns Dictionary with the world stats.
	 */
	public get stats(): WorldStats {
		return this._stats;
	}

	/**
	 * Do collision world updates, if we have any.
	 */
	#_performUpdates(): void {
		// delete empty grid cells
		if(this.cellsToDelete.size > 0) {
			this._stats.deletedGridCells += this.cellsToDelete.size;
			for(const key of this.cellsToDelete) {
				if(this.grid[key] && this.grid[key].size === 0) {
					delete this.grid[key];
				}
			}
			this.cellsToDelete.clear();
		}

		// update all shapes
		if(this.shapesToUpdate.size > 0) {
			for(const shape of this.shapesToUpdate) {
				this.#_updateShape(shape);
			}
			this.shapesToUpdate.clear();
		}
	}

	/**
	 * Get or create cell.

	 */
	#_getCell(i: number, j: number): Set<CollisionShape> {
		const key = `${i},${j}` as const;
		let ret = this.grid[key];
		if(!ret) {
			this._stats.createdGridCell++;
			this.grid[key] = ret = new Set();
		}
		return ret;
	}

	/**
	 * Update a shape in collision world after it moved or changed.

	 */
	#_updateShape(shape: CollisionShape): void {
		// sanity - if no longer in this collision world, skip
		if(shape._world !== this) {
			return;
		}

		// update shapes
		this._stats.updatedShapes++;

		// get new range
		const bb = shape._getBoundingBox();
		const minx = Math.floor(bb.left / this.gridCellSize.x);
		const miny = Math.floor(bb.top / this.gridCellSize.y);
		const maxx = Math.ceil(bb.right / this.gridCellSize.x);
		const maxy = Math.ceil(bb.bottom / this.gridCellSize.y);

		// change existing grid cells
		if(shape._worldRange) {
			// range is the same? skip
			if(shape._worldRange[0] === minx &&
				shape._worldRange[1] === miny &&
				shape._worldRange[2] === maxx &&
				shape._worldRange[3] === maxy) {
				return;
			}

			// get old range
			const ominx = shape._worldRange[0];
			const ominy = shape._worldRange[1];
			const omaxx = shape._worldRange[2];
			const omaxy = shape._worldRange[3];

			// first remove from old chunks we don't need
			for(let i = ominx; i < omaxx; ++i) {
				for(let j = ominy; j < omaxy; ++j) {

					// if also in new range, don't remove
					if(i >= minx && i < maxx && j >= miny && j < maxy) {
						continue;
					}

					// remove from cell
					const key = i + "," + j;
					const currSet = this.grid[key];
					if(currSet) {
						currSet.delete(shape);
						if(currSet.size === 0) {
							this.cellsToDelete.add(key);
						}
					}
				}
			}

			// now add to new cells
			for(let i = minx; i < maxx; ++i) {
				for(let j = miny; j < maxy; ++j) {

					// if was in old range, don't add
					if(i >= ominx && i < omaxx && j >= ominy && j < omaxy) {
						continue;
					}

					// add to new cell
					const currSet = this.#_getCell(i, j);
					currSet.add(shape);
				}
			}
		}
		// first-time adding to grid
		else {
			this._stats.addedShapes++;
			for(let i = minx; i < maxx; ++i) {
				for(let j = miny; j < maxy; ++j) {
					const currSet = this.#_getCell(i, j);
					currSet.add(shape);
				}
			}
		}

		// update new range
		shape._worldRange = [minx, miny, maxx, maxy];
	}

	/**
	 * Request update for this shape on next updates call.
	 */
	private _queueUpdate(shape: CollisionShape): void {
		this.shapesToUpdate.add(shape);
	}

	/**
	 * Iterate all shapes in world.
	 * @param callback Callback to invoke on all shapes. Return false to break iteration.
	 */
	public iterateShapes(callback: (shape: CollisionShape) => boolean): void {
		for(const key in this.grid) {
			const cell = this.grid[key as keyof typeof this.grid];
			if(cell) {
				for(const shape of cell) {
					if(callback(shape) === false) {
						return;
					}
				}
			}
		}
	}

	/**
	 * Add a collision shape to this world.
	 * @param shape Shape to add.
	 */
	public addShape(shape: CollisionShape): void {
		// add shape
		shape._setParent(this);

		// add shape to grid
		this.#_updateShape(shape);

		// do general updates
		this.#_performUpdates();
	}

	/**
	 * Remove a collision shape from this world.
	 * @param shape Shape to remove.
	 */
	public removeShape(shape: CollisionShape): void {
		// sanity
		if(shape._world !== this) {
			_logger.warn("Shape to remove is not in this collision world!");
			return;
		}

		// remove from grid
		if(shape._worldRange) {
			const minx = shape._worldRange[0];
			const miny = shape._worldRange[1];
			const maxx = shape._worldRange[2];
			const maxy = shape._worldRange[3];
			for(let i = minx; i < maxx; ++i) {
				for(let j = miny; j < maxy; ++j) {
					const key = i + "," + j;
					const currSet = this.grid[key];
					if(currSet) {
						currSet.delete(shape);
						if(currSet.size === 0) {
							this.cellsToDelete.add(key);
						}
					}
				}
			}
		}

		// remove shape
		this.shapesToUpdate.delete(shape);
		shape._setParent(null);

		// do general updates
		this.#_performUpdates();
	}

	/**
	 * Iterate shapes that match broad phase test.

	 * @param shape Shape to test.
	 * @param handler Method to run on all shapes in phase. Return true to continue iteration, false to break.
	 * @param mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
	 * @param predicate Optional filter to run on any shape we're about to test collision with.
	 */
	#_iterateBroadPhase(shape: CollisionShape, handler: (shape: CollisionShape) => boolean, mask: number, predicate: (shape: CollisionShape) => boolean): void {
		// get grid range
		const bb = shape._getBoundingBox();
		const minx = Math.floor(bb.left / this.gridCellSize.x);
		const miny = Math.floor(bb.top / this.gridCellSize.y);
		const maxx = Math.ceil(bb.right / this.gridCellSize.x);
		const maxy = Math.ceil(bb.bottom / this.gridCellSize.y);

		// update stats
		this._stats.broadPhaseCalls++;

		// shapes we checked
		const checked = new Set();

		// iterate options
		for(let i = minx; i < maxx; ++i) {
			for(let j = miny; j < maxy; ++j) {

				// get current grid chunk
				const key = i + "," + j;
				const currSet = this.grid[key];

				// iterate shapes in grid chunk
				if(currSet) {
					for(const other of currSet) {

						// check collision flags
						if(mask && ((other.collisionFlags & mask) === 0)) {
							continue;
						}

						// skip if checked
						if(checked.has(other)) {
							continue;
						}
						checked.add(other);

						// skip self
						if(other === shape) {
							continue;
						}

						// update stats
						this._stats.broadPhaseShapesChecksPrePredicate++;

						// use predicate
						if(predicate && !predicate(other)) {
							continue;
						}

						// update stats
						this._stats.broadPhaseShapesChecksPostPredicate++;

						// invoke handler on shape
						const proceedLoop = Boolean(handler(other));

						// break loop
						if(!proceedLoop) {
							return;
						}
					}
				}
			}
		}
	}

	/**
	 * Test collision with shapes in world, and return just the first result found.
	 * @param sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
	 * @param sortByDistance If true will return the nearest collision found (based on center of shapes).
	 * @param mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
	 * @param predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
	 * @returns A collision test result, or null if not found.
	 */
	public testCollision(sourceShape: CollisionShape, sortByDistance: boolean, mask: number, predicate: (shape: CollisionShape) => boolean): CollisionTestResult | null {
		// do updates before check
		this.#_performUpdates();

		// result to return
		let result: CollisionTestResult | null = null;

		// hard case - single result, sorted by distance
		if(sortByDistance) {
			// build options array
			const options: CollisionShape[] = [];
			this.#_iterateBroadPhase(sourceShape, other => {
				options.push(other);
				return true;
			}, mask, predicate);

			// sort options
			sortByDistanceShapes(sourceShape, options);

			// check collision sorted
			const handlers = this.resolver.getHandlers(sourceShape);
			for(const other of options) {
				this._stats.collisionChecks++;
				result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
				if(result) {
					this._stats.collisionMatches++;
					break;
				}
			}
		}
		// easy case - single result, not sorted
		else {
			// iterate possible shapes and test collision
			const handlers = this.resolver.getHandlers(sourceShape);
			this.#_iterateBroadPhase(sourceShape, (other) => {

				// test collision and continue iterating if we don't have a result
				this._stats.collisionChecks++;
				result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
				if(result) this._stats.collisionMatches++;
				return !result;

			}, mask, predicate);
		}

		// return result
		return result;
	}

	/**
	 * Test collision with shapes in world, and return all results found.
	 * @param sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
	 * @param sortByDistance If true will sort results by distance.
	 * @param mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
	 * @param predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
	 * @param intermediateProcessor Optional method to run after each positive result with the collision result as param. Return false to stop and return results.
	 * @returns An array of collision test results, or empty array if none found.
	 */
	public testCollisionMany(sourceShape: CollisionShape, sortByDistance: boolean, mask: number, predicate: (shape: CollisionShape) => boolean, intermediateProcessor?: (result: CollisionTestResult) => boolean): CollisionTestResult[] {
		// do updates before check
		this.#_performUpdates();

		// get collisions
		const ret: CollisionTestResult[] = [];
		const handlers = this.resolver.getHandlers(sourceShape);
		this.#_iterateBroadPhase(sourceShape, (other) => {
			this._stats.collisionChecks++;
			const result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
			if(!result) return true;

			this._stats.collisionMatches++;
			ret.push(result);
			if(intermediateProcessor && intermediateProcessor(result) === false) return false;
			return true;
		}, mask, predicate);

		// sort by distance
		if(sortByDistance) sortByDistanceResults(sourceShape, ret);

		// return results
		return ret;
	}

	/**
	 * Return array of shapes that touch a given position, with optional radius.
	 * @example
	 * let shapes = world.pick(Shaku.input.mousePosition);
	 * @param position Position to pick.
	 * @param radius Optional picking radius to use a circle instead of a point.
	 * @param sortByDistance If true, will sort results by distance from point.
	 * @param mask Collision mask to filter by.
	 * @param predicate Optional predicate method to filter by.
	 * @returns {Array<CollisionShape>} Array with collision shapes we picked.
	 */
	public pick(position: Vector2, radius = 0, sortByDistance: boolean, mask: number, predicate: (a: CollisionTestResult) => boolean): CollisionShape[] {
		const shape = radius <= 1 ? new PointShape(position) : new CircleShape(new Circle(position, radius));
		const ret = this.testCollisionMany(shape, sortByDistance, mask, predicate);
		return ret.map(x => x.second);
	}

	/**
	 * Set the shapes batch to use for debug-drawing this collision world.
	 * @param batch Batch to use for debug draw.
	 */
	public setDebugDrawBatch(batch: ShapesBatch): void {
		this.debugDrawBatch = batch;
	}

	/**
	 * Return the currently set debug draw batch, or create a new one if needed.
	 * @returns Shapes batch instance used to debug-draw collision world.
	 */
	public getOrCreateDebugDrawBatch(): ShapesBatch {
		if(!this.debugDrawBatch) this.setDebugDrawBatch(new gfx.ShapesBatch());
		return this.debugDrawBatch;
	}

	/**
	 * Debug-draw the current collision world.
	 * @param gridColor Optional grid color (default to black).
	 * @param gridHighlitColor Optional grid color for cells with shapes in them (default to red).
	 * @param opacity Optional opacity factor (default to 0.5).
	 * @param camera Optional camera for offset and viewport.
	 */
	public debugDraw(gridColor?: Color, gridHighlitColor?: Color, opacity = 0.5, camera?: Camera): void {
		// if we don't have a debug-draw batch, create it
		const shapesBatch = this.getOrCreateDebugDrawBatch();

		// begin drawing
		shapesBatch.begin();

		// do updates before check
		this.#_performUpdates();

		// default grid colors
		if(!gridColor) {
			gridColor = Color.black;
			gridColor!.a *= 0.75;
		}
		if(!gridHighlitColor) {
			gridHighlitColor = Color.red;
			gridHighlitColor!.a *= 0.75;
		}

		// set grid color opacity
		gridColor!.a *= opacity * 0.75;
		gridHighlitColor!.a *= opacity * 0.75;

		// all shapes we rendered
		const renderedShapes = new Set();

		// get visible grid cells
		const bb = camera ? camera.getRegion() : gfx._internal.getRenderingRegionInternal(false);
		const minx = Math.floor(bb.left / this.gridCellSize.x);
		const miny = Math.floor(bb.top / this.gridCellSize.y);
		const maxx = minx + Math.ceil(bb.width / this.gridCellSize.x);
		const maxy = miny + Math.ceil(bb.height / this.gridCellSize.y);
		for(let i = minx; i <= maxx; ++i) {
			for(let j = miny; j <= maxy; ++j) {

				// get current cell
				const cell = this.grid[i + "," + j];

				// draw grid cell
				const color = (cell && cell.size) ? gridHighlitColor : gridColor;
				const cellRect1 = new Rectangle(i * this.gridCellSize.x, j * this.gridCellSize.y, this.gridCellSize.x, 2);
				const cellRect2 = new Rectangle(i * this.gridCellSize.x, j * this.gridCellSize.y, 2, this.gridCellSize.y);
				shapesBatch.drawRectangle(cellRect1, color);
				shapesBatch.drawRectangle(cellRect2, color);

				// draw shapes in grid
				if(cell) {
					for(const shape of cell) {
						if(renderedShapes.has(shape)) {
							continue;
						}
						renderedShapes.add(shape);
						shape.debugDraw(opacity, shapesBatch);
					}
				}
			}
		}

		// finish drawing
		shapesBatch.end();
	}
}

export interface WorldStats {
	/**
	 * Number of times we updated or added new shapes.
	 */
	updatedShapes: number;
	/**
	 * Number of new shapes added.
	 */
	addedShapes: number;
	/**
	 * Grid cells that got deleted after they were empty.
	 */
	deletedGridCells: number;
	/**
	 * New grid cells created.
	 */
	createdGridCell: number;
	/**
	 * How many shapes were tested in a broadphase check, before the predicate method was called.
	 */
	broadPhaseShapesChecksPrePredicate: number;
	/**
	 * How many shapes were tested in a broadphase check, after the predicate method was called.
	 */
	broadPhaseShapesChecksPostPredicate: number;
	/**
	 * How many broadphase calls were made
	 */
	broadPhaseCalls: number;
	/**
	 * How many shape-vs-shape collision checks were actually made.
	 */
	collisionChecks: number;
	/**
	 * How many collision checks were positive.
	 */
	collisionMatches: number;
}

/**
 * Sort array by distance from source shape.
 * @private
 */
function sortByDistanceShapes(sourceShape: CollisionShape, options: CollisionShape[]): void {
	const sourceCenter = sourceShape.getCenter();
	options.sort((a, b) =>
		(a.getCenter().distanceTo(sourceCenter) - a._getRadius()) -
		(b.getCenter().distanceTo(sourceCenter) - b._getRadius()));
}

/**
 * Sort array by distance from source shape.
 * @private
 */
function sortByDistanceResults(sourceShape: CollisionShape, options: CollisionTestResult[]) {
	const sourceCenter = sourceShape.getCenter();
	options.sort((a, b) =>
		(a.second.getCenter().distanceTo(sourceCenter) - a.second._getRadius()) -
		(b.second.getCenter().distanceTo(sourceCenter) - b.second._getRadius()));
}

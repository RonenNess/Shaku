import { ShapesBatch, gfx } from "../gfx";
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
	/**
	 * Create the collision world.
	 * @param {CollisionResolver} resolver Collision resolver to use for this world.
	 * @param {Number|Vector2} gridCellSize For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size.
	 */
	public constructor(resolver, gridCellSize) {
		/**
		 * Collision resolver used in this collision world.
		 * By default, will inherit the collision manager default resolver.
		 */
		this.resolver = resolver;

		// set grid cell size
		if(typeof gridCellSize === "undefined") { gridCellSize = new Vector2(512, 512); }
		else if(typeof gridCellSize === "number") { gridCellSize = new Vector2(gridCellSize, gridCellSize); }
		else { gridCellSize = gridCellSize.clone(); }
		this._gridCellSize = gridCellSize;

		// create collision grid
		this._grid = {};

		// shapes that need updates and grid chunks to delete
		this._shapesToUpdate = new Set();
		this._cellsToDelete = new Set();

		// reset stats data
		this.resetStats();
	}

	/**
	 * Reset stats.
	 */
	resetStats() {
		this._stats = {
			updatedShapes: 0,
			addedShapes: 0,
			deletedGridCells: 0,
			createdGridCell: 0,
			broadPhaseShapesChecksPrePredicate: 0,
			broadPhaseShapesChecksPostPredicate: 0,
			broadPhaseCalls: 0,
			collisionChecks: 0,
			collisionMatches: 0
		};
	}

	/**
	 * Get current stats.
	 * @returns {*} Dictionary with the following stats:
	 *  updatedShapes: number of times we updated or added new shapes.
	 *  addedShapes: number of new shapes added.
	 *  deletedGridCells: grid cells that got deleted after they were empty.
	 *  createdGridCell: new grid cells created.
	 *  broadPhaseShapesChecksPrePredicate: how many shapes were tested in a broadphase check, before the predicate method was called.
	 *  broadPhaseShapesChecksPostPredicate: how many shapes were tested in a broadphase check, after the predicate method was called.
	 *  broadPhaseCalls: how many broadphase calls were made
	 *  collisionChecks: how many shape-vs-shape collision checks were actually made.
	 *  collisionMatches: how many collision checks were positive.
	 */
	get stats() {
		return this._stats;
	}

	/**
	 * Do collision world updates, if we have any.
	 * @private
	 */
	#_performUpdates() {
		// delete empty grid cells
		if(this._cellsToDelete.size > 0) {
			this._stats.deletedGridCells += this._cellsToDelete.size;
			for(let key of this._cellsToDelete) {
				if(this._grid[key] && this._grid[key].size === 0) {
					delete this._grid[key];
				}
			}
			this._cellsToDelete.clear();
		}

		// update all shapes
		if(this._shapesToUpdate.size > 0) {
			for(let shape of this._shapesToUpdate) {
				this.#_updateShape(shape);
			}
			this._shapesToUpdate.clear();
		}
	}

	/**
	 * Get or create cell.
	 * @private
	 */
	#_getCell(i, j) {
		let key = i + "," + j;
		let ret = this._grid[key];
		if(!ret) {
			this._stats.createdGridCells++;
			this._grid[key] = ret = new Set();
		}
		return ret;
	}

	/**
	 * Update a shape in collision world after it moved or changed.
	 * @private
	 */
	#_updateShape(shape) {
		// sanity - if no longer in this collision world, skip
		if(shape._world !== this) {
			return;
		}

		// update shapes
		this._stats.updatedShapes++;

		// get new range
		let bb = shape._getBoundingBox();
		let minx = Math.floor(bb.left / this._gridCellSize.x);
		let miny = Math.floor(bb.top / this._gridCellSize.y);
		let maxx = Math.ceil(bb.right / this._gridCellSize.x);
		let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);

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
			let ominx = shape._worldRange[0];
			let ominy = shape._worldRange[1];
			let omaxx = shape._worldRange[2];
			let omaxy = shape._worldRange[3];

			// first remove from old chunks we don't need
			for(let i = ominx; i < omaxx; ++i) {
				for(let j = ominy; j < omaxy; ++j) {

					// if also in new range, don't remove
					if(i >= minx && i < maxx && j >= miny && j < maxy) {
						continue;
					}

					// remove from cell
					let key = i + "," + j;
					let currSet = this._grid[key];
					if(currSet) {
						currSet.delete(shape);
						if(currSet.size === 0) {
							this._cellsToDelete.add(key);
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
					let currSet = this.#_getCell(i, j);
					currSet.add(shape);
				}
			}
		}
		// first-time adding to grid
		else {
			this._stats.addedShapes++;
			for(let i = minx; i < maxx; ++i) {
				for(let j = miny; j < maxy; ++j) {
					let currSet = this.#_getCell(i, j);
					currSet.add(shape);
				}
			}
		}

		// update new range
		shape._worldRange = [minx, miny, maxx, maxy];
	}

	/**
	 * Request update for this shape on next updates call.
	 * @private
	 */
	_queueUpdate(shape) {
		this._shapesToUpdate.add(shape);
	}

	/**
	 * Iterate all shapes in world.
	 * @param {Function} callback Callback to invoke on all shapes. Return false to break iteration.
	 */
	iterateShapes(callback) {
		for(let key in this._grid) {
			let cell = this._grid[key];
			if(cell) {
				for(let shape of cell) {
					if(callback(shape) === false) {
						return;
					}
				}
			}
		}
	}

	/**
	 * Add a collision shape to this world.
	 * @param {CollisionShape} shape Shape to add.
	 */
	addShape(shape) {
		// add shape
		shape._setParent(this);

		// add shape to grid
		this.#_updateShape(shape);

		// do general updates
		this.#_performUpdates();
	}

	/**
	 * Remove a collision shape from this world.
	 * @param {CollisionShape} shape Shape to remove.
	 */
	removeShape(shape) {
		// sanity
		if(shape._world !== this) {
			_logger.warn("Shape to remove is not in this collision world!");
			return;
		}

		// remove from grid
		if(shape._worldRange) {
			let minx = shape._worldRange[0];
			let miny = shape._worldRange[1];
			let maxx = shape._worldRange[2];
			let maxy = shape._worldRange[3];
			for(let i = minx; i < maxx; ++i) {
				for(let j = miny; j < maxy; ++j) {
					let key = i + "," + j;
					let currSet = this._grid[key];
					if(currSet) {
						currSet.delete(shape);
						if(currSet.size === 0) {
							this._cellsToDelete.add(key);
						}
					}
				}
			}
		}

		// remove shape
		this._shapesToUpdate.delete(shape);
		shape._setParent(null);

		// do general updates
		this.#_performUpdates();
	}

	/**
	 * Iterate shapes that match broad phase test.
	 * @private
	 * @param {CollisionShape} shape Shape to test.
	 * @param {Function} handler Method to run on all shapes in phase. Return true to continue iteration, false to break.
	 * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
	 * @param {Function} predicate Optional filter to run on any shape we're about to test collision with.
	 */
	#_iterateBroadPhase(shape, handler, mask, predicate) {
		// get grid range
		let bb = shape._getBoundingBox();
		let minx = Math.floor(bb.left / this._gridCellSize.x);
		let miny = Math.floor(bb.top / this._gridCellSize.y);
		let maxx = Math.ceil(bb.right / this._gridCellSize.x);
		let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);

		// update stats
		this._stats.broadPhaseCalls++;

		// shapes we checked
		let checked = new Set();

		// iterate options
		for(let i = minx; i < maxx; ++i) {
			for(let j = miny; j < maxy; ++j) {

				// get current grid chunk
				let key = i + "," + j;
				let currSet = this._grid[key];

				// iterate shapes in grid chunk
				if(currSet) {
					for(let other of currSet) {

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
						let proceedLoop = Boolean(handler(other));

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
	 * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
	 * @param {Boolean} sortByDistance If true will return the nearest collision found (based on center of shapes).
	 * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
	 * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
	 * @returns {CollisionTestResult} A collision test result, or null if not found.
	 */
	testCollision(sourceShape, sortByDistance, mask, predicate) {
		// do updates before check
		this.#_performUpdates();

		// result to return
		var result = null;

		// hard case - single result, sorted by distance
		if(sortByDistance) {
			// build options array
			var options = [];
			this.#_iterateBroadPhase(sourceShape, (other) => {
				options.push(other);
				return true;
			}, mask, predicate);

			// sort options
			sortByDistanceShapes(sourceShape, options);

			// check collision sorted
			var handlers = this.resolver.getHandlers(sourceShape);
			for(let other of options) {
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
			var handlers = this.resolver.getHandlers(sourceShape);
			this.#_iterateBroadPhase(sourceShape, (other) => {

				// test collision and continue iterating if we don't have a result
				this._stats.collisionChecks++;
				result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
				if(result) { this._stats.collisionMatches++; }
				return !result;

			}, mask, predicate);
		}

		// return result
		return result;
	}

	/**
	 * Test collision with shapes in world, and return all results found.
	 * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
	 * @param {Boolean} sortByDistance If true will sort results by distance.
	 * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
	 * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
	 * @param {Function} intermediateProcessor Optional method to run after each positive result with the collision result as param. Return false to stop and return results.
	 * @returns {Array<CollisionTestResult>} An array of collision test results, or empty array if none found.
	 */
	testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor) {
		// do updates before check
		this.#_performUpdates();

		// get collisions
		var ret = [];
		var handlers = this.resolver.getHandlers(sourceShape);
		this.#_iterateBroadPhase(sourceShape, (other) => {
			this._stats.collisionChecks++;
			let result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
			if(result) {
				this._stats.collisionMatches++;
				ret.push(result);
				if(intermediateProcessor && intermediateProcessor(result) === false) {
					return false;
				}
			}
			return true;
		}, mask, predicate);

		// sort by distance
		if(sortByDistance) {
			sortByDistanceResults(sourceShape, ret);
		}

		// return results
		return ret;
	}

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
	pick(position, radius, sortByDistance, mask, predicate) {
		let shape = ((radius || 0) <= 1) ? new PointShape(position) : new CircleShape(new Circle(position, radius));
		let ret = this.testCollisionMany(shape, sortByDistance, mask, predicate);
		return ret.map(x => x.second);
	}

	/**
	 * Set the shapes batch to use for debug-drawing this collision world.
	 * @param {ShapesBatch} batch Batch to use for debug draw.
	 */
	setDebugDrawBatch(batch) {
		this.__debugDrawBatch = batch;
	}

	/**
	 * Return the currently set debug draw batch, or create a new one if needed.
	 * @returns {ShapesBatch} Shapes batch instance used to debug-draw collision world.
	 */
	getOrCreateDebugDrawBatch() {
		if(!this.__debugDrawBatch) {
			this.setDebugDrawBatch(new gfx.ShapesBatch());
		}
		return this.__debugDrawBatch;
	}

	/**
	 * Debug-draw the current collision world.
	 * @param {Color} gridColor Optional grid color (default to black).
	 * @param {Color} gridHighlitColor Optional grid color for cells with shapes in them (default to red).
	 * @param {Number} opacity Optional opacity factor (default to 0.5).
	 * @param {Camera} camera Optional camera for offset and viewport.
	 */
	debugDraw(gridColor, gridHighlitColor, opacity, camera) {
		// if we don't have a debug-draw batch, create it
		let shapesBatch = this.getOrCreateDebugDrawBatch();

		// begin drawing
		shapesBatch.begin();

		// do updates before check
		this.#_performUpdates();

		// default grid colors
		if(!gridColor) {
			gridColor = Color.black;
			gridColor.a *= 0.75;
		}
		if(!gridHighlitColor) {
			gridHighlitColor = Color.red;
			gridHighlitColor.a *= 0.75;
		}

		// default opacity
		if(opacity === undefined) {
			opacity = 0.5;
		}

		// set grid color opacity
		gridColor.a *= opacity * 0.75;
		gridHighlitColor.a *= opacity * 0.75;

		// all shapes we rendered
		let renderedShapes = new Set();

		// get visible grid cells
		let bb = camera ? camera.getRegion() : gfx._internal.getRenderingRegionInternal(false);
		let minx = Math.floor(bb.left / this._gridCellSize.x);
		let miny = Math.floor(bb.top / this._gridCellSize.y);
		let maxx = minx + Math.ceil(bb.width / this._gridCellSize.x);
		let maxy = miny + Math.ceil(bb.height / this._gridCellSize.y);
		for(let i = minx; i <= maxx; ++i) {
			for(let j = miny; j <= maxy; ++j) {

				// get current cell
				let cell = this._grid[i + "," + j];

				// draw grid cell
				let color = (cell && cell.size) ? gridHighlitColor : gridColor;
				let cellRect1 = new Rectangle(i * this._gridCellSize.x, j * this._gridCellSize.y, this._gridCellSize.x, 2);
				let cellRect2 = new Rectangle(i * this._gridCellSize.x, j * this._gridCellSize.y, 2, this._gridCellSize.y);
				shapesBatch.drawRectangle(cellRect1, color);
				shapesBatch.drawRectangle(cellRect2, color);

				// draw shapes in grid
				if(cell) {
					for(let shape of cell) {
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

/**
 * Sort array by distance from source shape.
 * @private
 */
function sortByDistanceShapes(sourceShape, options) {
	let sourceCenter = sourceShape.getCenter();
	options.sort((a, b) =>
		(a.getCenter().distanceTo(sourceCenter) - a._getRadius()) -
		(b.getCenter().distanceTo(sourceCenter) - b._getRadius()));
}

/**
 * Sort array by distance from source shape.
 * @private
 */
function sortByDistanceResults(sourceShape, options) {
	let sourceCenter = sourceShape.getCenter();
	options.sort((a, b) =>
		(a.second.getCenter().distanceTo(sourceCenter) - a.second._getRadius()) -
		(b.second.getCenter().distanceTo(sourceCenter) - b.second._getRadius()));
}

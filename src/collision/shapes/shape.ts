import ShapesBatch from "../../gfx/draw_batches/shapes_batch";
import Color from "../../utils/color";
import Rectangle from "../../utils/rectangle";
import Vector2 from "../../utils/vector2";
import CollisionWorld from "../collision_world";

/**
 * Collision shape base class.
 */
class CollisionShape {
	/**
	 * Create the collision shape.
	 */
	constructor() {
		this._world = null;
		this._worldRange = null;
		this._debugColor = null;
		this._forceDebugColor = null;
		this._collisionFlags = Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Get the collision shape's unique identifier.
	 * @returns {String} Shape's unique identifier
	 */
	get shapeId() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Get collision flags (matched against collision mask when checking collision).
	 */
	get collisionFlags() {
		return this._collisionFlags;
	}

	/**
	 * Set collision flags (matched against collision mask when checking collision).
	 */
	set collisionFlags(value) {
		this._debugColor = null;
		this._collisionFlags = value;
		return this._collisionFlags;
	}

	/**
	 * Get Shapes beatch to draw this shape with, either given or default from world.
	 * If not provided and have no world, will throw exception.
	 * @private
	 */
	_getDebugDrawBatch(shapesBatch) {
		if(!shapesBatch && !this._world) {
			throw new Error("Can't debug-draw a collision shape that is not under any collision world without providing a shapes batch to use!");
		}
		return (shapesBatch || this._world.getOrCreateDebugDrawBatch());
	}

	/**
	 * Set the debug color to use to draw this shape.
	 * @param {Color} color Color to set or null to use default.
	 */
	setDebugColor(color) {
		this._forceDebugColor = color;
	}

	/**
	 * Debug draw this shape.
	 * @param {Number} opacity Shape opacity factor.
	 * @param {ShapesBatch} shapesBatch Optional shapes batch to use to debug draw the shape. By default will use the collision world.
	 */
	debugDraw(opacity, shapesBatch) {
		throw new Error("Not Implemented!");
	}

	/**
	 * Get shape center position.
	 * @returns {Vector2} Center position.
	 */
	getCenter() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Remove self from parent world object.
	 */
	remove() {
		if(this._world) {
			this._world.removeShape(this);
		}
	}

	/**
	 * Get debug drawing color.
	 * @private
	 */
	_getDebugColor() {
		// use forced debug color
		if(this._forceDebugColor) {
			return this._forceDebugColor.clone();
		}

		// calculate debug color
		if(!this._debugColor) {
			this._debugColor = this._getDefaultDebugColorFor(this.collisionFlags);
		}

		// return color
		return this._debugColor.clone();
	}

	/**
	 * Get default debug colors for given collision flags.
	 * @private
	 */
	_getDefaultDebugColorFor(flags) {
		return defaultDebugColors[flags % defaultDebugColors.length];
	}

	/**
	 * Get collision shape's estimated radius box.
	 * @private
	 * @returns {Number} Shape's radius
	 */
	_getRadius() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Get collision shape's bounding box.
	 * @private
	 * @returns {Rectangle} Shape's bounding box.
	 */
	_getBoundingBox() {
		throw new Error("Not Implemented!");
	}

	/**
	 * Set the parent collision world this shape is currently in.
	 * @private
	 * @param {CollisionWorld} world New parent collision world or null to remove.
	 */
	_setParent(world) {
		// same world? skip
		if(world === this._world) {
			return;
		}

		// we already have a world but try to set a new one? error
		if(this._world && world) {
			throw new Error("Cannot add collision shape to world while its already in another world!");
		}

		// set new world
		this._world = world;
		this._worldRange = null;
	}

	/**
	 * Called when the collision shape changes and we need to update the parent world.
	 * @private
	 */
	_shapeChanged() {
		if(this._world) {
			this._world._queueUpdate(this);
		}
	}
}

// default debug colors to use
const defaultDebugColors = [Color.red, Color.blue, Color.green, Color.yellow, Color.purple, Color.teal, Color.brown, Color.orange, Color.khaki, Color.darkcyan, Color.cornflowerblue, Color.darkgray, Color.chocolate, Color.aquamarine, Color.cadetblue, Color.magenta, Color.seagreen, Color.pink, Color.olive, Color.violet];

// export collision shape class
export default CollisionShape;

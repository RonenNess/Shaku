import { ShapesBatch } from "../../gfx";
import { Color, Rectangle, Vector2 } from "../../utils";
import { CollisionWorld } from "../collision_world";

/**
 * Collision shape base class.
 */
export abstract class CollisionShape {
	private world: CollisionWorld | null;
	private worldRange: Rectangle | null;
	private debugColor: Color | null;
	private forceDebugColor: Color | null;
	private _collisionFlags: number;

	/**
	 * Create the collision shape.
	 */
	public constructor() {
		this.world = null;
		this.worldRange = null;
		this.debugColor = null;
		this.forceDebugColor = null;
		this._collisionFlags = Number.MAX_SAFE_INTEGER;
	}

	/**
	 * Get the collision shape's unique identifier.
	 * @returns Shape's unique identifier
	 */
	public abstract get shapeId(): string;

	/**
	 * Get collision flags (matched against collision mask when checking collision).
	 */
	public get collisionFlags() {
		return this._collisionFlags;
	}

	/**
	 * Set collision flags (matched against collision mask when checking collision).
	 */
	public set collisionFlags(value) {
		this.debugColor = null;
		this._collisionFlags = value;
		return this._collisionFlags;
	}

	/**
	 * Get Shapes batch to draw this shape with, either given or default from world.
	 * If not provided and have no world, will throw exception.

	 */
	protected _getDebugDrawBatch(shapesBatch: ShapesBatch): ShapesBatch {
		if(!shapesBatch && !this.world) throw new Error("Can't debug-draw a collision shape that is not under any collision world without providing a shapes batch to use!");
		return (shapesBatch || this.world.getOrCreateDebugDrawBatch());
	}

	/**
	 * Set the debug color to use to draw this shape.
	 * @param color Color to set or null to use default.
	 */
	public setDebugColor(color: Color): void {
		this.forceDebugColor = color;
	}

	/**
	 * Debug draw this shape.
	 * @param opacity Shape opacity factor.
	 * @param shapesBatch Optional shapes batch to use to debug draw the shape. By default will use the collision world.
	 */
	public abstract debugDraw(opacity: number, shapesBatch: ShapesBatch): void;

	/**
	 * Get shape center position.
	 * @returns Center position.
	 */
	public abstract getCenter(): Vector2;

	/**
	 * Remove self from parent world object.
	 */
	public remove(): void {
		if(this.world) this.world.removeShape(this);
	}

	/**
	 * Get debug drawing color.

	 */
	protected _getDebugColor(): Color {
		// use forced debug color
		if(this.forceDebugColor) return this.forceDebugColor.clone();

		// calculate debug color
		if(!this.debugColor) this.debugColor = this._getDefaultDebugColorFor(this.collisionFlags);

		// return color
		return this.debugColor.clone();
	}

	/**
	 * Get default debug colors for given collision flags.

	 */
	protected _getDefaultDebugColorFor(flags: number): Color {
		return defaultDebugColors[flags % defaultDebugColors.length];
	}

	/**
	 * Get collision shape's estimated radius box.

	 * @returns Shape's radius
	 */
	protected abstract _getRadius(): number;

	/**
	 * Get collision shape's bounding box.

	 * @returns {Rectangle} Shape's bounding box.
	 */
	protected abstract _getBoundingBox(): Rectangle;

	/**
	 * Set the parent collision world this shape is currently in.

	 * @param world New parent collision world or null to remove.
	 */
	protected _setParent(world: CollisionWorld | null): void {
		// same world? skip
		if(world === this.world) return;

		// we already have a world but try to set a new one? error
		if(this.world && world) throw new Error("Cannot add collision shape to world while its already in another world!");

		// set new world
		this.world = world;
		this.worldRange = null;
	}

	/**
	 * Called when the collision shape changes and we need to update the parent world.

	 */
	protected _shapeChanged(): void {
		if(this.world) this.world._queueUpdate(this);
	}
}

// default debug colors to use
const defaultDebugColors = [
	Color.red,
	Color.blue,
	Color.green,
	Color.yellow,
	Color.purple,
	Color.teal,
	Color.brown,
	Color.orange,
	Color.khaki,
	Color.darkcyan,
	Color.cornflowerblue,
	Color.darkgray,
	Color.chocolate,
	Color.aquamarine,
	Color.cadetblue,
	Color.magenta,
	Color.seagreen,
	Color.pink,
	Color.olive,
	Color.violet,
];

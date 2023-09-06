import { LoggerFactory, Vector2 } from "../utils";
import { CollisionTestResult } from "./result";
import { CollisionShape } from "./shapes";

const _logger = LoggerFactory.getLogger("collision"); // TODO

/**
 * The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.
 */
export class CollisionResolver {
	private handlers: Record<unknown, unknown>;

	/**
	 * Create the resolver.
	 */
	public constructor() {
		this.handlers = {};
	}

	/**
	 * Initialize the resolver.
	 */
	private init() {

	}

	/**
	 * Set the method used to test collision between two shapes.
	 * Note: you don't need to register the same handler twice for reverse order, its done automatically inside.
	 * @param {String} firstShapeId The shape identifier the handler receives as first argument.
	 * @param {String} secondShapeId The shape identifier the handler receives as second argument.
	 * @param {Function} handler Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision.
	 */
	public setHandler(firstShapeId, secondShapeId, handler) {
		// register handler
		if(!this.handlers[firstShapeId]) this.handlers[firstShapeId] = {};
		this.handlers[firstShapeId][secondShapeId] = handler;

		// register reverse order handler
		if(firstShapeId !== secondShapeId) {
			if(!this.handlers[secondShapeId]) this.handlers[secondShapeId] = {};
			this.handlers[secondShapeId][firstShapeId] = (f, s) => { return handler(s, f); };
		}
	}

	/**
	 * Check a collision between two shapes.
	 * @param {CollisionShape} first First collision shape to test.
	 * @param {CollisionShape} second Second collision shape to test.
	 * @returns {CollisionTestResult} collision detection result or null if they don't collide.
	 */
	public test(first, second) {
		const handler = this.getCollisionMethod(first, second);
		return this.testWithHandler(first, second, handler);
	}

	/**
	 * Check a collision between two shapes.
	 * @param {CollisionShape} first First collision shape to test.
	 * @param {CollisionShape} second Second collision shape to test.
	 * @param {Function} handler Method to test collision between the shapes.
	 * @returns {CollisionTestResult} collision detection result or null if they don't collide.
	 */
	public testWithHandler(first, second, handler) {
		// missing handler?
		if(!handler) {
			_logger.warn(`Missing collision handler for shapes "${first.shapeId}" and "${second.shapeId}".`);
			return null;
		}

		// test collision
		const result = handler(first, second);

		// collision
		if(result) {
			const position = (result instanceof Vector2) ? result : null;
			return new CollisionTestResult(position, first, second);
		}

		// no collision
		return null;
	}

	/**
	 * Get handlers dictionary for a given shape.
	 */
	public getHandlers(shape) {
		return this.handlers[shape.shapeId];
	}

	/**
	 * Get the collision detection method for two given shapes.

	 * @param {CollisionShape} first First collision shape to test.
	 * @param {CollisionShape} second Second collision shape to test.
	 * @returns {Function} collision detection method or null if not found.
	 */
	private getCollisionMethod(first, second) {
		const handlersFrom = this.handlers[first.shapeId];
		if(handlersFrom) {
			return handlersFrom[second.shapeId] || null;
		}
		return null;
	}
}

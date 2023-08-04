import Circle from "../../utils/circle";
import Rectangle from "../../utils/rectangle";
import Vector2 from "../../utils/vector2";
import CollisionShape from "./shape";

/**
 * Collision point class.
 */
export default class PointShape extends CollisionShape {
	/**
	 * Create the collision shape.
	 * @param {Vector2} position Point position.
	 */
	constructor(position) {
		super();
		this.setPosition(position);
	}

	/**
	 * @inheritdoc
	 */
	get shapeId() {
		return "point";
	}

	/**
	 * Set this collision shape from vector2.
	 * @param {Vector2} position Point position.
	 */
	setPosition(position) {
		this._position = position.clone();
		this._boundingBox = new Rectangle(position.x, position.y, 1, 1);
		this._shapeChanged();
	}

	/**
	 * Get point position.
	 * @returns {Vector2} Point position.
	 */
	getPosition() {
		return this._position.clone();
	}

	/**
	 * @inheritdoc
	 */
	getCenter() {
		return this._position.clone();
	}

	/**
	 * @inheritdoc
	 */
	_getRadius() {
		return 1;
	}

	/**
	 * @inheritdoc
	 */
	_getBoundingBox() {
		return this._boundingBox;
	}

	/**
	 * Debug draw this shape.
	 * @param {Number} opacity Shape opacity factor.
	 */
	debugDraw(opacity, shapesBatch) {
		if(opacity === undefined) { opacity = 1; }
		let color = this._getDebugColor();
		color.a *= opacity;
		shapesBatch = this._getDebugDrawBatch(shapesBatch);
		let needToBegin = !shapesBatch.isDrawing;
		if(needToBegin) { shapesBatch.begin(); }
		shapesBatch.drawCircle(new Circle(this.getPosition(), 3), color, 4);
		if(needToBegin) { shapesBatch.end(); }
	}
}

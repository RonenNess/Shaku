import Rectangle from "../../utils/rectangle";
import CollisionShape from "./shape";

/**
 * Collision rectangle class.
 */
export default class RectangleShape extends CollisionShape {
	/**
	 * Create the collision shape.
	 * @param {Rectangle} rectangle the rectangle shape.
	 */
	constructor(rectangle) {
		super();
		this.setShape(rectangle);
	}

	/**
	 * @inheritdoc
	 */
	get shapeId() {
		return "rect";
	}

	/**
	 * Set this collision shape from rectangle.
	 * @param {Rectangle} rectangle Rectangle shape.
	 */
	setShape(rectangle) {
		this._rect = rectangle;
		this._center = rectangle.getCenter();
		this._radius = this._rect.getBoundingCircle().radius;
		this._shapeChanged();
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
		return this._rect;
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
		let color = this._getDebugColor();
		color.a *= opacity;
		shapesBatch = this._getDebugDrawBatch(shapesBatch);
		let needToBegin = !shapesBatch.isDrawing;
		if(needToBegin) { shapesBatch.begin(); }
		shapesBatch.drawRectangle(this._rect, color);
		if(needToBegin) { shapesBatch.end(); }
	}
}

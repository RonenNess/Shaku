import Circle from "../../utils/circle";
import Rectangle from "../../utils/rectangle";
import CollisionShape from "./shape";

/**
 * Collision circle class.
 */
class CircleShape extends CollisionShape {
	/**
	 * Create the collision shape.
	 * @param {Circle} circle the circle shape.
	 */
	constructor(circle) {
		super();
		this.setShape(circle);
	}

	/**
	 * @inheritdoc
	 */
	get shapeId() {
		return "circle";
	}

	/**
	 * Set this collision shape from circle.
	 * @param {Circle} circle Circle shape.
	 */
	setShape(circle) {
		this._circle = circle;
		this._position = circle.center;
		this._boundingBox = new Rectangle(circle.center.x - circle.radius, circle.center.y - circle.radius, circle.radius * 2, circle.radius * 2);
		this._shapeChanged();
	}

	/**
	 * @inheritdoc
	 */
	_getRadius() {
		return this._circle.radius;
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
	_getBoundingBox() {
		return this._boundingBox;
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
		shapesBatch.drawCircle(this._circle, color, 14);
		if(needToBegin) { shapesBatch.end(); }
	}
}

// export collision shape class
export default CircleShape;

import Circle from "../../utils/circle";
import Line from "../../utils/line";
import Rectangle from "../../utils/rectangle";
import CollisionShape from "./shape";

/**
 * Collision lines class.
 * This shape is made of one line or more.
 */
export default class LinesShape extends CollisionShape {
	/**
	 * Create the collision shape.
	 * @param {Array<Line>|Line} lines Starting line / lines.
	 */
	constructor(lines) {
		super();
		this._lines = [];
		this.addLines(lines);
	}

	/**
	 * @inheritdoc
	 */
	get shapeId() {
		return "lines";
	}

	/**
	 * Add line or lines to this collision shape.
	 * @param {Array<Line>|Line} lines Line / lines to add.
	 */
	addLines(lines) {
		// convert to array
		if(!Array.isArray(lines)) {
			lines = [lines];
		}

		// add lines
		for(let i = 0; i < lines.length; ++i) {
			this._lines.push(lines[i]);
		}

		// get all points
		let points = [];
		for(let i = 0; i < this._lines.length; ++i) {
			points.push(this._lines[i].from);
			points.push(this._lines[i].to);
		}

		// reset bounding box and circle
		this._boundingBox = Rectangle.fromPoints(points);
		this._circle = new Circle(this._boundingBox.getCenter(), Math.max(this._boundingBox.width, this._boundingBox.height));
		this._shapeChanged();
	}

	/**
	 * Set this shape from line or lines array.
	 * @param {Array<Line>|Line} lines Line / lines to set.
	 */
	setLines(lines) {
		this._lines = [];
		this.addLines(lines);
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
		return this._circle.center.clone();
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
		for(let i = 0; i < this._lines.length; ++i) {
			shapesBatch.drawLine(this._lines[i].from, this._lines[i].to, color);
		}
		if(needToBegin) { shapesBatch.end(); }
	}
}

import ShapesBatch from "../../gfx/draw_batches/shapes_batch";
import { Vector2 } from "../../utils";
import Circle from "../../utils/circle";
import Line from "../../utils/line";
import Rectangle from "../../utils/rectangle";
import CollisionShape from "./shape";

/**
 * Collision lines class.
 * This shape is made of one line or more.
 */
export default class LinesShape extends CollisionShape {
	private _lines: Line[];
	private _circle: Circle;
	private _boundingBox: Rectangle;

	/**
	 * Create the collision shape.
	 * @param lines Starting line / lines.
	 */
	public constructor(lines: Line | Line[]) {
		super();
		this._lines = [];
		this.addLines(lines);
	}

	/**
	 * @inheritdoc
	 */
	public get shapeId(): "lines" {
		return "lines";
	}

	/**
	 * Add line or lines to this collision shape.
	 * @param lines Line / lines to add.
	 */
	public addLines(lines: Line | Line[]): void {
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
	 * @param lines Line / lines to set.
	 */
	public setLines(lines: Line | Line[]): void {
		this._lines = [];
		this.addLines(lines);
	}

	/**
	 * @inheritdoc
	 */
	protected _getRadius(): number {
		return this._circle.radius;
	}

	/**
	 * @inheritdoc
	 */
	public getCenter(): Vector2 {
		return this._circle.center.clone();
	}

	/**
	 * @inheritdoc
	 */
	protected _getBoundingBox(): Rectangle {
		return this._boundingBox;
	}

	/**
	 * @inheritdoc
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch): void {
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

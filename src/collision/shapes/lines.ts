import { ShapesBatch } from "../../gfx";
import { Circle, Line, Rectangle, Vector2 } from "../../utils";
import { CollisionShape } from "./shape";

/**
 * Collision lines class.
 * This shape is made of one line or more.
 */
export class LinesShape extends CollisionShape {
	private lines: Line[];
	private circle: Circle;
	private boundingBox: Rectangle;

	/**
	 * Create the collision shape.
	 * @param lines Starting line / lines.
	 */
	public constructor(lines: Line | Line[]) {
		super();
		this.lines = [];
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
		if(!Array.isArray(lines)) lines = [lines];

		// add lines
		for(let i = 0; i < lines.length; ++i) this.lines.push(lines[i]);

		// get all points
		const points = [];
		for(let i = 0; i < this.lines.length; ++i) {
			points.push(this.lines[i].from);
			points.push(this.lines[i].to);
		}

		// reset bounding box and circle
		this.boundingBox = Rectangle.fromPoints(points);
		this.circle = new Circle(this.boundingBox.getCenter(), Math.max(this.boundingBox.width, this.boundingBox.height));
		this._shapeChanged();
	}

	/**
	 * Set this shape from line or lines array.
	 * @param lines Line / lines to set.
	 */
	public setLines(lines: Line | Line[]): void {
		this.lines = [];
		this.addLines(lines);
	}

	/**
	 * @inheritdoc
	 */
	protected _getRadius(): number {
		return this.circle.radius;
	}

	/**
	 * @inheritdoc
	 */
	public getCenter(): Vector2 {
		return this.circle.center.clone();
	}

	/**
	 * @inheritdoc
	 */
	protected _getBoundingBox(): Rectangle {
		return this.boundingBox;
	}

	/**
	 * @inheritdoc
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch): void {
		const color = this._getDebugColor();
		color.a *= opacity;

		shapesBatch = this._getDebugDrawBatch(shapesBatch);
		const needToBegin = !shapesBatch.isDrawing;
		if(needToBegin) shapesBatch.begin();
		for(let i = 0; i < this.lines.length; ++i) shapesBatch.drawLine(this.lines[i].from, this.lines[i].to, color);
		if(needToBegin) shapesBatch.end();
	}
}

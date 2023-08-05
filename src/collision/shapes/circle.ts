import { ShapesBatch } from "../../gfx";
import { Circle, Rectangle, Vector2 } from "../../utils";
import { CollisionShape } from "./shape";

/**
 * Collision circle class.
 */
export class CircleShape extends CollisionShape {
	private _circle: Circle;
	private _position: Vector2;
	private _boundingBox: Rectangle;

	/**
	 * Create the collision shape.
	 * @param circle the circle shape.
	 */
	public constructor(circle: Circle) {
		super();
		this.setShape(circle);
	}

	/**
	 * @inheritdoc
	 */
	public get shapeId(): "circle" {
		return "circle";
	}

	/**
	 * Set this collision shape from circle.
	 * @param circle Circle shape.
	 */
	public setShape(circle: Circle): void {
		this._circle = circle;
		this._position = circle.center;
		this._boundingBox = new Rectangle(circle.center.x - circle.radius, circle.center.y - circle.radius, circle.radius * 2, circle.radius * 2);
		this._shapeChanged();
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
		return this._position.clone();
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
		shapesBatch.drawCircle(this._circle, color, 14);
		if(needToBegin) { shapesBatch.end(); }
	}
}

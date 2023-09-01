import { ShapesBatch } from "../../gfx";
import { Rectangle, Vector2 } from "../../utils";
import { CollisionShape } from "./shape";

/**
 * Collision rectangle class.
 */
export class RectangleShape extends CollisionShape {
	private _rect: Rectangle;
	private _center: Vector2;
	private _radius: number;

	/**
	 * Create the collision shape.
	 * @param rectangle the rectangle shape.
	 */
	public constructor(rectangle: Rectangle) {
		super();
		this.setShape(rectangle);
	}

	/**
	 * @inheritdoc
	 */
	public get shapeId(): "rect" {
		return "rect";
	}

	/**
	 * Set this collision shape from rectangle.
	 * @param rectangle Rectangle shape.
	 */
	public setShape(rectangle: Rectangle): void {
		this._rect = rectangle;
		this._center = rectangle.getCenter();
		this._radius = this._rect.getBoundingCircle().radius;
		this._shapeChanged();
	}

	/**
	 * @inheritdoc
	 */
	protected _getRadius(): number {
		return this._radius;
	}

	/**
	 * @inheritdoc
	 */
	protected _getBoundingBox(): Rectangle {
		return this._rect;
	}

	/**
	 * @inheritdoc
	 */
	public getCenter(): Vector2 {
		return this._center.clone();
	}

	/**
	 * @inheritdoc
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch) {
		if(opacity === undefined) { opacity = 1; }
		const color = this._getDebugColor();
		color.a *= opacity;
		shapesBatch = this._getDebugDrawBatch(shapesBatch);
		const needToBegin = !shapesBatch.isDrawing;
		if(needToBegin) { shapesBatch.begin(); }
		shapesBatch.drawRectangle(this._rect, color);
		if(needToBegin) { shapesBatch.end(); }
	}
}

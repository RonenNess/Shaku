import { ShapesBatch } from "../../gfx";
import { Rectangle, Vector2 } from "../../utils";
import { CollisionShape } from "./shape";

/**
 * Collision rectangle class.
 */
export class RectangleShape extends CollisionShape {
	private rect: Rectangle;
	private center: Vector2;
	private radius: number;

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
		this.rect = rectangle;
		this.center = rectangle.getCenter();
		this.radius = this.rect.getBoundingCircle().radius;
		this._shapeChanged();
	}

	/**
	 * @inheritdoc
	 */
	protected _getRadius(): number {
		return this.radius;
	}

	/**
	 * @inheritdoc
	 */
	protected _getBoundingBox(): Rectangle {
		return this.rect;
	}

	/**
	 * @inheritdoc
	 */
	public getCenter(): Vector2 {
		return this.center.clone();
	}

	/**
	 * @inheritdoc
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch) {
		const color = this._getDebugColor();
		color.a *= opacity;
		shapesBatch = this._getDebugDrawBatch(shapesBatch);
		const needToBegin = !shapesBatch.isDrawing;
		if(needToBegin) shapesBatch.begin();
		shapesBatch.drawRectangle(this.rect, color);
		if(needToBegin) shapesBatch.end();
	}
}

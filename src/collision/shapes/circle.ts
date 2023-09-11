import { ShapesBatch } from "../../gfx";
import { Circle, Rectangle, Vector2 } from "../../utils";
import { CollisionShape } from "./shape";

/**
 * Collision circle class.
 */
export class CircleShape extends CollisionShape {
	private circle: Circle;
	private position: Vector2;
	private boundingBox: Rectangle;

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
	public getShapeId(): "circle" {
		return "circle";
	}

	/**
	 * Set this collision shape from circle.
	 * @param circle Circle shape.
	 */
	public setShape(circle: Circle): void {
		this.circle = circle;
		this.position = circle.center;
		this.boundingBox = new Rectangle(circle.center.x - circle.radius, circle.center.y - circle.radius, circle.radius * 2, circle.radius * 2);
		this.shapeChanged();
	}

	/**
	 * @inheritdoc
	 */
	public getCenter(): Vector2 {
		return this.position.clone();
	}

	/**
	 * @inheritdoc
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch): void {
		const color = this.getDebugColor();
		color.a *= opacity;
		shapesBatch = this.getDebugDrawBatch(shapesBatch);
		const needToBegin = !shapesBatch.isDrawing();
		if(needToBegin) shapesBatch.begin();
		shapesBatch.drawCircle(this.circle, color, 14);
		if(needToBegin) shapesBatch.end();
	}

	/**
	 * @inheritdoc
	 */
	protected getRadius(): number {
		return this.circle.radius;
	}

	/**
	 * @inheritdoc
	 */
	protected getBoundingBox(): Rectangle {
		return this.boundingBox;
	}
}

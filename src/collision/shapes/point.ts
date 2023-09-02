import { ShapesBatch } from "../../gfx";
import { Circle, Rectangle, Vector2 } from "../../utils";
import { CollisionShape } from "./shape";

/**
 * Collision point class.
 */
export class PointShape extends CollisionShape {
	private _position: Vector2;
	private _boundingBox: Rectangle;

	/**
	 * Create the collision shape.
	 * @param position Point position.
	 */
	public constructor(position: Vector2) {
		super();
		this.setPosition(position);
	}

	/**
	 * @inheritdoc
	 */
	public get shapeId(): "point" {
		return "point";
	}

	/**
	 * Set this collision shape from vector2.
	 * @param position Point position.
	 */
	public setPosition(position: Vector2): void {
		this._position = position.clone();
		this._boundingBox = new Rectangle(position.x, position.y, 1, 1);
		this._shapeChanged();
	}

	/**
	 * Get point position.
	 * @returns Point position.
	 */
	public getPosition(): Vector2 {
		return this._position.clone();
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
	protected _getRadius(): 1 {
		return 1;
	}

	/**
	 * @inheritdoc
	 */
	protected _getBoundingBox(): Rectangle {
		return this._boundingBox;
	}

	/**
	 * Debug draw this shape.
	 * @param opacity Shape opacity factor.
	 */
	public debugDraw(opacity = 1, shapesBatch: ShapesBatch) {
		if(opacity === undefined) opacity = 1;
		const color = this._getDebugColor();
		color.a *= opacity;
		shapesBatch = this._getDebugDrawBatch(shapesBatch);
		const needToBegin = !shapesBatch.isDrawing;
		if(needToBegin) shapesBatch.begin();
		shapesBatch.drawCircle(new Circle(this.getPosition(), 3), color, 4);
		if(needToBegin) shapesBatch.end();
	}
}

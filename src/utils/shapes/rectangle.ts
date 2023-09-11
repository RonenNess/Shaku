import { MathHelper } from "../math_helper";
import { Circle } from "./circle";
import { Line } from "./line";
import { Vector2 } from "./vector2";

/**
 * Implement a simple 2d Rectangle.
 */
export class Rectangle {
	public x: number;
	public y: number;
	public width: number;
	public height: number;

	/**
	 * Create the Rect.
	 * @param x Rect position X (top left corner).
	 * @param y Rect position Y (top left corner).
	 * @param width Rect width.
	 * @param height Rect height.
	 */
	public constructor(x: number, y: number, width: number, height: number) {
		this.x = x ?? 0;
		this.y = y ?? 0;
		this.width = width;
		this.height = height;
	}

	/**
	 * Set rectangle values.
	 * @param x Rectangle x position.
	 * @param y Rectangle y position.
	 * @param width Rectangle width.
	 * @param height Rectangle height.
	 * @returns this.
	 */
	public set(x: number, y: number, width: number, height: number): Rectangle {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		return this;
	}

	/**
	 * Copy another rectangle.
	 * @param other Rectangle to copy.
	 * @returns this.
	 */
	public copy(other: Rectangle): Rectangle {
		this.x = other.x;
		this.y = other.y;
		this.width = other.width;
		this.height = other.height;
		return this;
	}

	/**
	 * Get position as Vector2.
	 * @returns Position vector.
	 */
	public getPosition(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	/**
	 * Get size as Vector2.
	 * @returns Size vector.
	 */
	public getSize(): Vector2 {
		return new Vector2(this.width, this.height);
	}

	/**
	 * Get center position.
	 * @returns Position vector.
	 */
	public getCenter(): Vector2 {
		return new Vector2(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
	}

	/**
	 * Get left value.
	 * @returns rectangle left.
	 */
	public getLeft(): number {
		return this.x;
	}

	/**
	 * Get right value.
	 * @returns rectangle right.
	 */
	public getRight(): number {
		return this.x + this.width;
	}

	/**
	 * Get top value.
	 * @returns rectangle top.
	 */
	public getTop(): number {
		return this.y;
	}

	/**
	 * Get bottom value.
	 * @returns rectangle bottom.
	 */
	public getBottom(): number {
		return this.y + this.height;
	}

	/**
	 * Return a clone of this rectangle.
	 * @returns Cloned rectangle.
	 */
	public clone(): Rectangle {
		return new Rectangle(this.x, this.y, this.width, this.height);
	}

	/**
	 * Get top-left corner.
	 * @returns Corner position vector.
	 */
	public getTopLeft(): Vector2 {
		return new Vector2(this.x, this.y);
	}

	/**
	 * Get top-right corner.
	 * @returns Corner position vector.
	 */
	public getTopRight(): Vector2 {
		return new Vector2(this.x + this.width, this.y);
	}

	/**
	 * Get bottom-left corner.
	 * @returns Corner position vector.
	 */
	public getBottomLeft(): Vector2 {
		return new Vector2(this.x, this.y + this.height);
	}

	/**
	 * Get bottom-right corner.
	 * @returns Corner position vector.
	 */
	public getBottomRight(): Vector2 {
		return new Vector2(this.x + this.width, this.y + this.height);
	}

	/**
	 * Convert to string.
	 */
	public string(): string {
		return this.x + "," + this.y + "," + this.width + "," + this.height;
	}

	/**
	 * Check if this rectangle contains a Vector2.
	 * @param p Point to check.
	 * @returns if point is contained within the rectangle.
	 */
	public containsVector(p: Vector2): boolean {
		return (p.x >= this.x)
			&& (p.x <= this.x + this.width)
			&& (p.y >= this.y)
			&& (p.y <= this.y + this.height);
	}

	/**
	 * Check if this rectangle collides with another rectangle.
	 * @param other Rectangle to check collision with.
	 * @return if rectangles collide.
	 */
	public collideRect(other: Rectangle): boolean {
		const r1 = this;
		const r2 = other;
		return !(r2.left >= r1.right
			|| r2.right <= r1.left
			|| r2.top >= r1.bottom
			|| r2.bottom <= r1.top);
	}

	/**
	 * Check if this rectangle collides with a line.
	 * @param line Line to check collision with.
	 * @return if rectangle collides with line.
	 */
	public collideLine(line: Line): boolean {
		// first check if rectangle contains any of the line points
		if(this.containsVector(line.from) || this.containsVector(line.to)) return true;

		// now check intersection with the rectangle lines
		const topLeft = this.getTopLeft();
		const topRight = this.getTopRight();
		const bottomLeft = this.getBottomLeft();
		const bottomRight = this.getBottomRight();
		if(line.collideLine(new Line(topLeft, topRight))) return true;
		if(line.collideLine(new Line(topLeft, bottomLeft))) return true;
		if(line.collideLine(new Line(topRight, bottomRight))) return true;
		if(line.collideLine(new Line(bottomLeft, bottomRight))) return true;

		// no collision
		return false;
	}

	/**
	 * Checks if this rectangle collides with a circle.
	 * @param circle Circle to check collision with.
	 * @return if rectangle collides with circle.
	 */
	public collideCircle(circle: Circle): boolean {
		// get center and radius
		const center = circle.center;
		const radius = circle.radius;

		// first check if circle center is inside the rectangle - easy case
		const rect = this;
		if(rect.containsVector(center)) return true;

		// get rectangle center
		const rectCenter = rect.getCenter();

		// get corners
		const topLeft = rect.getTopLeft();
		const topRight = rect.getTopRight();
		const bottomRight = rect.getBottomRight();
		const bottomLeft = rect.getBottomLeft();

		// create a list of lines to check (in the rectangle) based on circle position to rect center
		const lines = [];
		if(rectCenter.x > center.x) lines.push([topLeft, bottomLeft]);
		else lines.push([topRight, bottomRight]);

		if(rectCenter.y > center.y) lines.push([topLeft, topRight]);
		else lines.push([bottomLeft, bottomRight]);

		// now check intersection between circle and each of the rectangle lines
		for(let i = 0; i < lines.length; ++i) {
			const disToLine = pointLineDistance(center, lines[i][0], lines[i][1]);
			if(disToLine <= radius) return true;
		}

		// no collision..
		return false;
	}

	/**
	 * Get the smallest circle containing this rectangle.
	 * @returns Bounding circle.
	 */
	public getBoundingCircle(): Circle {
		const center = this.getCenter();
		const radius = center.distanceTo(this.getTopLeft());
		return new Circle(center, radius);
	}

	/**
	 * Build and return a rectangle from points.
	 * @param points Points to build rectangle from.
	 * @returns new rectangle from points.
	 */
	public static fromPoints(points: Vector2[]): Rectangle {
		let min_x = points[0].x;
		let min_y = points[0].y;
		let max_x = min_x;
		let max_y = min_y;

		for(let i = 1; i < points.length; ++i) {
			min_x = Math.min(min_x, points[i].x);
			min_y = Math.min(min_y, points[i].y);
			max_x = Math.max(max_x, points[i].x);
			max_y = Math.max(max_y, points[i].y);
		}

		return new Rectangle(min_x, min_y, max_x - min_x, max_y - min_y);
	}

	/**
	 * Return a resized rectangle with the same center point.
	 * @param amount Amount to resize.
	 * @returns resized rectangle.
	 */
	public resize(amount: number | Vector2): Rectangle {
		if(typeof amount === "number") amount = new Vector2(amount, amount);
		return new Rectangle(this.x - amount.x / 2, this.y - amount.y / 2, this.width + amount.x, this.height + amount.y);
	}

	/**
	 * Check if equal to another rectangle.
	 * @param other Other rectangle to compare to.
	 */
	public equals(other: Rectangle): boolean {
		return (this === other)
			|| (other
				&& (other.constructor === this.constructor)
				&& (this.x === other.x)
				&& (this.y === other.y)
				&& (this.width === other.width)
				&& (this.height === other.height));
	}

	/**
	 * Lerp between two rectangles.
	 * @param p1 First rectangles.
	 * @param p2 Second rectangles.
	 * @param a Lerp factor (0.0 - 1.0).
	 * @returns result rectangle.
	 */
	public static lerp(p1: Rectangle, p2: Rectangle, a: number): Rectangle {
		const lerpScalar = MathHelper.lerp.bind(Rectangle);
		return new Rectangle(lerpScalar(p1.x, p2.x, a),
			lerpScalar(p1.y, p2.y, a),
			lerpScalar(p1.width, p2.width, a),
			lerpScalar(p1.height, p2.height, a)
		);
	}

	/**
	 * Create rectangle from a dictionary.
	 * @param data Dictionary with {x,y,width,height}.
	 * @returns Newly created rectangle.
	 */
	public static fromDict(data: Partial<SerializedRectangle>): Rectangle {
		return new Rectangle(data.x ?? 0, data.y ?? 0, data.width ?? 0, data.height ?? 0);
	}

	/**
	 * Convert to dictionary.
	 * @param minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns Dictionary with {x,y,width,height}
	 */
	public toDict(minimized: true): Partial<SerializedRectangle>;
	public toDict(minimized: false): SerializedRectangle;
	public toDict(minimized: boolean): Partial<SerializedRectangle> {
		if(!minimized) return { x: this.x, y: this.y, width: this.width, height: this.height };

		const ret: Partial<SerializedRectangle> = {};
		if(this.x) ret.x = this.x;
		if(this.y) ret.y = this.y;
		if(this.width) ret.width = this.width;
		if(this.height) ret.height = this.height;
		return ret;
	}
}

export interface SerializedRectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

/**
 * Get distance between a point and a line.
 * @private
 */
function pointLineDistance(p1: Vector2, l1: Line, l2: Line) {

	const x = p1.x;
	const y = p1.y;
	const x1 = l1.x;
	const y1 = l1.y;
	const x2 = l2.x;
	const y2 = l2.y;

	const A = x - x1;
	const B = y - y1;
	const C = x2 - x1;
	const D = y2 - y1;

	const dot = A * C + B * D;
	const len_sq = C * C + D * D;
	let param = -1;
	if(len_sq !== 0) param = dot / len_sq; // in case of 0 length line

	let xx, yy;
	if(param < 0) {
		xx = x1;
		yy = y1;
	} else if(param > 1) {
		xx = x2;
		yy = y2;
	} else {
		xx = x1 + param * C;
		yy = y1 + param * D;
	}

	const dx = x - xx;
	const dy = y - yy;
	return Math.sqrt(dx * dx + dy * dy);
}

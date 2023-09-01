import { Vector2 } from "./vector2";

/**
 * Implement a simple 2d Line.
 */
export class Line {
	public from: Vector2;
	public to: Vector2;

	/**
	 * Create the Line.
	 * @param from Line start position.
	 * @param to Line end position.
	 */
	public constructor(from: Vector2, to: Vector2) {
		this.from = from.clone();
		this.to = to.clone();
	}

	/**
	 * Return a clone of this line.
	 * @returns Cloned line.
	 */
	public clone(): Line {
		return new Line(this.from, this.to);
	}

	/**
	 * Create Line from a dictionary.
	 * @param data Dictionary with {from, to}.
	 * @returns Newly created line.
	 */
	public static fromDict(data: Partial<SerializedLine>): Line {
		return new Line(Vector2.fromDict(data.from ?? {}), Vector2.fromDict(data.to ?? {}));
	}

	/**
	 * Convert to dictionary.
	 * @param minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
	 * @returns Dictionary with {from, to}.
	 */
	public toDict(minimized: true): Partial<SerializedLine>;
	public toDict(minimized?: false): SerializedLine;
	public toDict(minimized?: boolean): Partial<SerializedLine> {
		if(minimized) {
			const ret: Partial<SerializedLine> = {};
			if(this.from.x || this.from.y) ret.from = this.from.toDict(true);
			if(this.to.x || this.to.y) ret.to = this.to.toDict(true);
			return ret;
		}
		return { from: this.from.toDict(), to: this.to.toDict() };
	}

	/**
	 * Check if this circle contains a Vector2.
	 * @param p Point to check.
	 * @param threshold Distance between point and line to consider as intersecting. Default is 0.5, meaning it will treat point and line as round integers (sort-of).
	 * @returns if point is contained within the circle.
	 */
	public containsVector(p: Vector2, threshold: number): boolean {
		let A = this.from;
		let B = this.to;
		let distance = Vector2.distance;
		if(threshold === undefined) { threshold = 0.5; }
		return Math.abs((distance(A, p) + distance(B, p)) - distance(A, B)) <= threshold;
	}

	/**
	 * Check if this line collides with another line.
	 * @param other Other line to test collision with.
	 * @returns True if lines collide, false otherwise.
	 */
	public collideLine(other: Line): boolean {
		let p0 = this.from;
		let p1 = this.to;
		let p2 = other.from;
		let p3 = other.to;

		if(p0.equals(p2) || p0.equals(p3) || p1.equals(p2) || p1.equals(p3)) {
			return true;
		}

		let s1_x, s1_y, s2_x, s2_y;
		s1_x = p1.x - p0.x;
		s1_y = p1.y - p0.y;
		s2_x = p3.x - p2.x;
		s2_y = p3.y - p2.y;

		let s, t;
		s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
		t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

		return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
	}

	/**
	 * Get the shortest distance between this line segment and a vector.
	 * @param v Vector to get distance to.
	 * @returns Shortest distance between line and vector.
	 */
	public distanceToVector(v: Vector2): number {
		let x1 = this.from.x;
		let x2 = this.to.x;
		let y1 = this.from.y;
		let y2 = this.to.y;

		var A = v.x - x1;
		var B = v.y - y1;
		var C = x2 - x1;
		var D = y2 - y1;

		var dot = A * C + B * D;
		var len_sq = C * C + D * D;
		var param = -1;
		if(len_sq != 0) //in case of 0 length line
			param = dot / len_sq;

		var xx, yy;

		if(param < 0) {
			xx = x1;
			yy = y1;
		}
		else if(param > 1) {
			xx = x2;
			yy = y2;
		}
		else {
			xx = x1 + param * C;
			yy = y1 + param * D;
		}

		var dx = v.x - xx;
		var dy = v.y - yy;
		return Math.sqrt(dx * dx + dy * dy);
	}

	/**
	 * Check if equal to another line.
	 * @param other Other line to compare to.
	 * @returns True if lines are equal, false otherwise.
	 */
	public equals(other: Line): boolean {
		return (this === other) ||
			(other && (other.constructor === this.constructor) && this.from.equals(other.from) && this.to.equals(other.to));
	}

	/**
	 * Lerp between two lines.
	 * @param l1 First lines.
	 * @param l2 Second lines.
	 * @param a Lerp factor (0.0 - 1.0).
	 * @returns result lines.
	 */
	public static lerp(l1: Line, l2: Line, a: number): Line {
		return new Line(Vector2.lerp(l1.from, l2.from, a), Vector2.lerp(l1.to, l2.to, a));
	}
}

export interface SerializedLine {
	from: ReturnType<Vector2["toDict"]>;
	to: ReturnType<Vector2["toDict"]>;
}

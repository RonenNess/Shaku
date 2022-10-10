export = Rectangle;
/**
 * Implement a simple 2d Rectangle.
 */
declare class Rectangle {
    /**
     * Build and return a rectangle from points.
     * @param {Array<Vector2>} points Points to build rectangle from.
     * @returns {Rectangle} new rectangle from points.
     */
    static fromPoints(points: Array<Vector2>): Rectangle;
    /**
     * Lerp between two rectangles.
     * @param {Rectangle} p1 First rectangles.
     * @param {Rectangle} p2 Second rectangles.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Rectangle} result rectangle.
     */
    static lerp(p1: Rectangle, p2: Rectangle, a: number): Rectangle;
    /**
     * Create rectangle from a dictionary.
     * @param {*} data Dictionary with {x,y,width,height}.
     * @returns {Rectangle} Newly created rectangle.
     */
    static fromDict(data: any): Rectangle;
    /**
     * Create the Rect.
     * @param {Number} x Rect position X (top left corner).
     * @param {Number} y Rect position Y (top left corner).
     * @param {Number} width Rect width.
     * @param {Number} height Rect height.
     */
    constructor(x: number, y: number, width: number, height: number);
    x: number;
    y: number;
    width: number;
    height: number;
    /**
     * Set rectangle values.
     * @param {Number} x Rectangle x position.
     * @param {Number} y Rectangle y position.
     * @param {Number} width Rectangle width.
     * @param {Number} height Rectangle height.
     * @returns {Rectangle} this.
     */
    set(x: number, y: number, width: number, height: number): Rectangle;
    /**
     * Copy another rectangle.
     * @param {other} other Rectangle to copy.
     * @returns {Rectangle} this.
     */
    copy(other: any): Rectangle;
    /**
     * Get position as Vector2.
     * @returns {Vector2} Position vector.
     */
    getPosition(): Vector2;
    /**
     * Get size as Vector2.
     * @returns {Vector2} Size vector.
     */
    getSize(): Vector2;
    /**
     * Get center position.
     * @returns {Vector2} Position vector.
     */
    getCenter(): Vector2;
    /**
     * Get left value.
     * @returns {Number} rectangle left.
     */
    get left(): number;
    /**
     * Get right value.
     * @returns {Number} rectangle right.
     */
    get right(): number;
    /**
     * Get top value.
     * @returns {Number} rectangle top.
     */
    get top(): number;
    /**
     * Get bottom value.
     * @returns {Number} rectangle bottom.
     */
    get bottom(): number;
    /**
     * Return a clone of this rectangle.
     * @returns {Rectangle} Cloned rectangle.
     */
    clone(): Rectangle;
    /**
     * Get top-left corner.
     * @returns {Vector2} Corner position vector.
     */
    getTopLeft(): Vector2;
    /**
     * Get top-right corner.
     * @returns {Vector2} Corner position vector.
     */
    getTopRight(): Vector2;
    /**
     * Get bottom-left corner.
     * @returns {Vector2} Corner position vector.
     */
    getBottomLeft(): Vector2;
    /**
     * Get bottom-right corner.
     * @returns {Vector2} Corner position vector.
     */
    getBottomRight(): Vector2;
    /**
     * Convert to string.
     */
    string(): string;
    /**
     * Check if this rectangle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @returns {Boolean} if point is contained within the rectangle.
     */
    containsVector(p: Vector2): boolean;
    /**
     * Check if this rectangle collides with another rectangle.
     * @param {Rectangle} other Rectangle to check collision with.
     * @return {Boolean} if rectangles collide.
     */
    collideRect(other: Rectangle): boolean;
    /**
     * Check if this rectangle collides with a line.
     * @param {Line} line Line to check collision with.
     * @return {Boolean} if rectangle collides with line.
     */
    collideLine(line: Line): boolean;
    /**
     * Checks if this rectangle collides with a circle.
     * @param {Circle} circle Circle to check collision with.
     * @return {Boolean} if rectangle collides with circle.
     */
    collideCircle(circle: Circle): boolean;
    /**
     * Get the smallest circle containing this rectangle.
     * @returns {Circle} Bounding circle.
     */
    getBoundingCircle(): Circle;
    /**
     * Return a resized rectangle with the same center point.
     * @param {Number|Vector2} amount Amount to resize.
     * @returns {Rectangle} resized rectangle.
     */
    resize(amount: number | Vector2): Rectangle;
    /**
     * Check if equal to another rectangle.
     * @param {Rectangle} other Other rectangle to compare to.
     */
    equals(other: Rectangle): boolean;
    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {x,y,width,height}
     */
    toDict(minimized: boolean): any;
}
import Vector2 = require("./vector2");
import Line = require("./line");
import Circle = require("./circle");
//# sourceMappingURL=rectangle.d.ts.map
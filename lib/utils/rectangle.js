/**
 * Implement a simple 2d rectangle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\rectangle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

const Circle = require('./circle');
const Vector2 = require('./vector2');


/**
 * Implement a simple 2d Rectangle.
 */
class Rectangle
{
    /**
     * Create the Rect.
     * @param {Number} x Rect position X (top left corner).
     * @param {Number} y Rect position Y (top left corner).
     * @param {Number} width Rect width.
     * @param {Number} height Rect height.
     */
    constructor(x, y, width, height)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width;
        this.height = height;
    }

    /**
     * Set rectangle values.
     * @param {Number} x Rectangle x position.
     * @param {Number} y Rectangle y position.
     * @param {Number} width Rectangle width.
     * @param {Number} height Rectangle height.
     * @returns {Rectangle} this.
     */
    set(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    /**
     * Get position as Vector2.
     * @returns {Vector2} Position vector.
     */
    getPosition()
    {
        return new Vector2(this.x, this.y);
    }
    
    /**
     * Get size as Vector2.
     * @returns {Vector2} Size vector.
     */
    getSize()
    {
        return new Vector2(this.width, this.height);
    }
	
	/**
     * Get center position.
     * @returns {Vector2} Position vector.
     */
    getCenter()
    {
        return new Vector2(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
    }

    /**
     * Get left value.
     * @returns {Number} rectangle left.
     */
    get left()
    {
        return this.x;
    }

    /**
     * Get right value.
     * @returns {Number} rectangle right.
     */
    get right()
    {
        return this.x + this.width;
    }

    /**
     * Get top value.
     * @returns {Number} rectangle top.
     */
    get top()
    {
        return this.y;
    }

    /**
     * Get bottom value.
     * @returns {Number} rectangle bottom.
     */
    get bottom()
    {
        return this.y + this.height;
    }

    /**
     * Return a clone of this rectangle.
     * @returns {Rectangle} Cloned rectangle.
     */
    clone()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * Get top-left corner.
     * @returns {Vector2} Corner position vector.
     */
    getTopLeft()
    {
        return new Vector2(this.x, this.y);
    }

    /**
     * Get top-right corner.
     * @returns {Vector2} Corner position vector.
     */
    getTopRight()
    {
        return new Vector2(this.x + this.width, this.y);
    }
        
    /**
     * Get bottom-left corner.
     * @returns {Vector2} Corner position vector.
     */
    getBottomLeft()
    {
        return new Vector2(this.x, this.y + this.height);
    }

    /**
     * Get bottom-right corner.
     * @returns {Vector2} Corner position vector.
     */
    getBottomRight()
    {
        return new Vector2(this.x + this.width, this.y + this.height);
    }

    /**
     * Convert to string.
     */
    string() 
    {
        return this.x + ',' + this.y + ',' + this.width + ',' + this.height;
    }

    /**
     * Check if this rectangle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @returns {Boolean} if point is contained within the rectangle.
     */
    containsVector(p) 
    {
        return p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height;
    }

    /**
     * Check if this rectangle collides with another rectangle.
     * @param {Rectangle} other Rectangle to check collision with.
     * @return {Boolean} if rectangles collide.
     */
    collideRect(other)
    {
        let r1 = this;
        let r2 = other;
        return !(r2.left > r1.right ||
                r2.right < r1.left ||
                r2.top > r1.bottom ||
                r2.bottom < r1.top);
    }

    /**
     * Checks if this rectangle collides with a circle.
     * @param {Circle} circle Circle to check collision with.
     * @return {Boolean} if rectangle collides with circle.
     */
    collideCircle(circle) 
    {
        // get center and radius
        let center = circle.center;
        let radius = circle.radius;

        // first check if circle center is inside the rectangle - easy case
        let rect = this;
        if (rect.containsPoint(center)) {
            return true;
        }

        // get rectangle center
        let rectCenter = rect.getCenter();

        // get corners
        let topLeft = rect.getTopLeft();
        let topRight = rect.getTopRight();
        let bottomRight = rect.getBottomRight();
        let bottomLeft = rect.getBottomLeft();

        // create a list of lines to check (in the rectangle) based on circle position to rect center
        let lines = [];
        if (rectCenter.x > center.x) {
            lines.push([topLeft, bottomLeft]);
        } else {
            lines.push([topRight, bottomRight]);
        }
        if (rectCenter.y > center.y) {
            lines.push([topLeft, topRight]);
        } else {
            lines.push([bottomLeft, bottomRight]);
        }

        // now check intersection between circle and each of the rectangle lines
        for (let i = 0; i < lines.length; ++i) {
            let disToLine = Math._extended.pointLineDistance(center, lines[i][0], lines[i][1]);
            if (disToLine <= radius) {
                return true;
            }
        }

        // no collision..
        return false;
    }
    
    /**
     * Build and return a rectangle from points.
     * @param {Array<Vector2>} points Points to build rectangle from.
     * @returns {Rectangle} new rectangle from points.
     */
    static fromPoints(points)
    {
        let min_x = points[0].x;
        let min_y = points[0].y;
        let max_x = min_x;
        let max_y = min_y;

        for (let i = 1; i < points.length; ++i) {
            min_x = Math.min(min_x, points[i].x);
            min_y = Math.min(min_y, points[i].y);
            max_x = Math.max(max_x, points[i].x);
            max_y = Math.max(max_y, points[i].y);
        }

        return new Rectangle(min_x, min_y, max_x - min_x, max_y - min_y);
    }

    /**
     * Check if equal to another rectangle.
     * @param {Rectangle} other Other rectangle to compare to.
     */
    equals(other)
    {
        return other && this.x == other.x && this.y == other.y && this.width == other.width && this.height == other.height;
    }
    
    /**
     * Lerp between two rectangles.
     * @param {Vector2} p1 First rectangles.
     * @param {Vector2} p2 Second rectangles.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Rectangle} result rectangle.
     */
     static lerp(p1, p2, a)
     {
         function lerpScalar(start, end, a)
         {
             return ((1-a) * start) + (a * end);
         }
         return new Rectangle(  lerpScalar(p1.x, p2.x, a), 
                                lerpScalar(p1.y, p2.y, a), 
                                lerpScalar(p1.width, p2.width, a), 
                                lerpScalar(p1.height, p2.height, a)
                            );
     }
}


// export the rectangle class
module.exports = Rectangle;
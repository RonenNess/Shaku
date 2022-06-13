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
const Line = require('./line');
const MathHelper = require('./math_helper');
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
     * Copy another rectangle.
     * @param {other} other Rectangle to copy.
     * @returns {Rectangle} this.
     */
    copy(other)
    {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
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
        return !(r2.left >= r1.right ||
                r2.right <= r1.left ||
                r2.top >= r1.bottom ||
                r2.bottom <= r1.top);
    }
  
    /**
     * Check if this rectangle collides with a line.
     * @param {Line} line Line to check collision with.
     * @return {Boolean} if rectangle collides with line.
     */
    collideLine(line)
    {
        // first check if rectangle contains any of the line points
        if (this.containsVector(line.from) || this.containsVector(line.to)) {
            return true;
        }

        // now check intersection with the rectangle lines
        let topLeft = this.getTopLeft();
        let topRight = this.getTopRight();
        let bottomLeft = this.getBottomLeft();
        let bottomRight = this.getBottomRight();
        if (line.collideLine(new Line(topLeft, topRight))) {
            return true;
        }
        if (line.collideLine(new Line(topLeft, bottomLeft))) {
            return true;
        }
        if (line.collideLine(new Line(topRight, bottomRight))) {
            return true;
        }
        if (line.collideLine(new Line(bottomLeft, bottomRight))) {
            return true;
        }

        // no collision
        return false;
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
        if (rect.containsVector(center)) {
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
            let disToLine = pointLineDistance(center, lines[i][0], lines[i][1]);
            if (disToLine <= radius) {
                return true;
            }
        }

        // no collision..
        return false;
    }

    /**
     * Get the smallest circle containing this rectangle.
     * @returns {Circle} Bounding circle.
     */
    getBoundingCircle()
    {
        let center = this.getCenter();
        let radius = center.distanceTo(this.getTopLeft());
        return new Circle(center, radius);
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
     * Return a resized rectangle with the same center point.
     * @param {Number|Vector2} amount Amount to resize.
     * @returns {Rectangle} resized rectangle.
     */
    resize(amount)
    {
        if (typeof amount === 'number') {
            amount = new Vector2(amount, amount);
        }
        return new Rectangle(this.x - amount.x / 2, this.y - amount.y / 2, this.width + amount.x, this.height + amount.y);
    }

    /**
     * Check if equal to another rectangle.
     * @param {Rectangle} other Other rectangle to compare to.
     */
    equals(other)
    {
        return (this === other) || 
                (other && (other.constructor === this.constructor) && this.x == other.x && this.y == other.y && this.width == other.width && this.height == other.height);
    }

    /**
     * Lerp between two rectangles.
     * @param {Rectangle} p1 First rectangles.
     * @param {Rectangle} p2 Second rectangles.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Rectangle} result rectangle.
     */
    static lerp(p1, p2, a)
    {
        let lerpScalar = MathHelper.lerp;
        return new Rectangle(  lerpScalar(p1.x, p2.x, a), 
                            lerpScalar(p1.y, p2.y, a), 
                            lerpScalar(p1.width, p2.width, a), 
                            lerpScalar(p1.height, p2.height, a)
                        );
    }

    /**
     * Create rectangle from a dictionary.
     * @param {*} data Dictionary with {x,y,width,height}.
     * @returns {Rectangle} Newly created rectangle.
     */
    static fromDict(data)
    {
        return new Rectangle(data.x, data.y, data.width, data.height);
    }

    /**
     * Convert to dictionary.
     * @returns {*} Dictionary with {x,y,width,height}
     */
    toDict()
    {
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }
}

/**
 * Get distance between a point and a line.
 * @private
 */
function pointLineDistance(p1, l1, l2) {

    let x = p1.x;
    let y = p1.y;
    let x1 = l1.x;
    let y1 = l1.y;
    let x2 = l2.x;
    let y2 = l2.y;

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    var xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }


// export the rectangle class
module.exports = Rectangle;
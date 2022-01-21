/**
 * Implement a simple 2d line.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\line.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const Vector2 = require('./vector2');


/**
 * Implement a simple 2d Line.
 */
class Line
{
    /**
     * Create the Line.
     * @param {Vector2} from Line start position.
     * @param {Vector2} to Line end position.
     */
    constructor(from, to)
    {
        this.from = from.clone();
        this.to = to.clone();
    }

    /**
     * Return a clone of this line.
     * @returns {Line} Cloned line.
     */
    clone()
    {
        return new Line(this.from, this.to);
    }

    /**
     * Check if this circle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @param {Number} threshold Distance between point and line to consider as intersecting. Default is 0.5, meaning it will treat point and line as round integers (sort-of).
     * @returns {Boolean} if point is contained within the circle.
     */
    containsVector(p, threshold)
    {
        let A = this.from;
        let B = this.to;
        let distance = Vector2.distance;
        if (threshold === undefined) { threshold = 0.5; }
        return Math.abs((distance(A, p) + distance(B, p)) - distance(A, B)) <= threshold;
    }

    /**
     * Get the shortest distance between this line segment and a vector.
     * @param {Vector2} v Vector to get distance to.
     * @returns {Number} Shortest distance between line and vector.
     */
    distanceToVector(v)
    {
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
      
        var dx = v.x - xx;
        var dy = v.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if equal to another circle.
     * @param {Circle} other Other circle to compare to.
     * @returns {Boolean} True if circles are equal, false otherwise.
     */
    equals(other)
    {
        return (this === other) || 
                (other && (other.constructor === this.constructor) && this.from.equals(other.from) && this.to.equals(other.to));
    }

    /**
     * Lerp between two lines.
     * @param {Line} l1 First lines.
     * @param {Line} l2 Second lines.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Line} result lines.
     */
    static lerp(l1, l2, a)
    {
        return new Line(Vector2.lerp(l1.from, l2.from, a), Vector2.lerp(l1.to, l2.to, a));
    }
}


// export the line class
module.exports = Line;
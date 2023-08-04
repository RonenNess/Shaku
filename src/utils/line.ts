/**
 * Implement a simple 2d line.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\utils\line.js
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
     * Create Line from a dictionary.
     * @param {*} data Dictionary with {from, to}.
     * @returns {Line} Newly created line.
     */
    static fromDict(data)
    {
        return new Line(Vector2.fromDict(data.from || {}), Vector2.fromDict(data.to || {}));
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {from, to}.
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.from.x || this.from.y) { ret.from = this.from.toDict(true); }
            if (this.to.x || this.to.y) { ret.to = this.to.toDict(true); }
            return ret;
        }
        return {from: this.from.toDict(), to: this.to.toDict()};
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
     * Check if this line collides with another line.
     * @param {Line} other Other line to test collision with.
     * @returns {Boolean} True if lines collide, false otherwise.
     */
    collideLine(other)
    {
        let p0 = this.from;
        let p1 = this.to;
        let p2 = other.from;
        let p3 = other.to;

        if (p0.equals(p2) || p0.equals(p3) || p1.equals(p2) || p1.equals(p3)) {
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
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
     * @returns {Boolean} if point is contained within the circle.
     */
    containsVector(p) 
    {
        let A = this.from;
        let B = this.to;
        return distance(A, p) + distance(B, p) == distance(A, B);
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
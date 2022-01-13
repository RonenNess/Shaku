/**
 * Implement a simple 2d circle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\circle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const Vector2 = require('./vector2');


/**
 * Implement a simple 2d Circle.
 */
class Circle
{
    /**
     * Create the Circle.
     * @param {Vector2} center Circle center position.
     * @param {Number} radius Circle radius.
     */
    constructor(center, radius)
    {
        this.center = center.clone();
        this.radius = radius;
    }

    /**
     * Return a clone of this circle.
     * @returns {Circle} Cloned circle.
     */
    clone()
    {
        return new Circle(this.center, this.radius);
    }

    /**
     * Check if this circle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @returns {Boolean} if point is contained within the circle.
     */
    containsVector(p) 
    {
        return this.center.distanceTo(p) <= this.radius;
    }

    /**
     * Check if equal to another circle.
     * @param {Circle} other Other circle to compare to.
     * @returns {Boolean} True if circles are equal, false otherwise.
     */
    equals(other)
    {
        return other && this.center.equals(other.center) && this.radius == other.radius;
    }

    /**
     * Lerp between two circle.
     * @param {Vector2} p1 First circle.
     * @param {Vector2} p2 Second circle.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Circle} result circle.
     */
     static lerp(p1, p2, a)
     {
         function lerpScalar(start, end, a)
         {
             return ((1-a) * start) + (a * end);
         }
         return new Circle(Vector2.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
     }
}


// export the circle class
module.exports = Circle;
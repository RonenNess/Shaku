/**
 * Implement collision circle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\circle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const Rectangle = require("../../utils/rectangle");
const CollisionShape = require("./shape");
const gfx = require('./../../gfx');
const Circle = require("../../utils/circle");


/**
 * Collision circle class.
 */
class CircleShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Circle} circle the circle shape.
     */
    constructor(circle)
    {
        super();
        this.setShape(circle);
    }

    /**
     * Set this collision shape from circle.
     * @param {Rectangle} circle Circle shape.
     */
    setShape(circle)
    {
        this._circle = circle;
        this._boundingBox = new Rectangle(circle.center.x - circle.radius, circle.center.y - circle.radius, circle.radius * 2, circle.radius * 2);
        this._shapeChanged();
    }

    /**
     * Get collision shape's bounding box.
     * @returns {Rectangle} Shape's bounding box.
     */
    getBoundingBox()
    {
        return this._boundingBox;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        let color = this._getDebugColor();

        color.a *= opacity;
        gfx.outlineCircle(this._circle, color, gfx.BlendModes.AlphaBlend, 11);

        color.a *= 0.25;
        gfx.fillCircle(this._circle, color, gfx.BlendModes.AlphaBlend, 11);
    }
}

// export collision shape class
module.exports = CircleShape;
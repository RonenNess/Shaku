/**
 * Implement collision rectangle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\rectangle.js
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


/**
 * Collision rectangle class.
 */
class RectangleShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Rectangle} rectangle the rectangle shape.
     */
    constructor(rectangle)
    {
        super();
        this.setShape(rectangle);
    }

    /**
     * Set this collision shape from rectangle.
     * @param {Rectangle} rectangle Rectangle shape.
     */
    setShape(rectangle)
    {
        this._rest = rectangle;
        this._shapeChanged();
    }

    /**
     * Get collision shape's bounding box.
     * @returns {Rectangle} Shape's bounding box.
     */
    getBoundingBox()
    {
        return this._rest;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        let color = this._getDebugColor();
        color.a *= opacity;
        gfx.outlineRect(this._rest, color, gfx.BlendModes.AlphaBlend);
    }
}

// export collision shape class
module.exports = RectangleShape;
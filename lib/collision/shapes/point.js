/**
 * Implement collision point.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\point.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const CollisionShape = require("./shape");
const gfx = require('./../../gfx');
const Vector2 = require("../../utils/vector2");
const Rectangle = require("../../utils/rectangle");


/**
 * Collision point class.
 */
class PointShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Vector2} position Point position.
     */
    constructor(position)
    {
        super();
        this.setPosition(position);
    }

    /**
     * Set this collision shape from vector2.
     * @param {Vector2} position Point position.
     */
    setPosition(position)
    {
        this._boundingBox = new Rectangle(position.x, position.y, 1, 1);
        this._shapeChanged();
    }

    /**
     * Get point position.
     * @returns {Vector2} Point position.
     */
    getPosition()
    {
        return this._boundingBox.getPosition();
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
        gfx.outlineRect(this._boundingBox, color, gfx.BlendModes.AlphaBlend);
    }
}

// export collision shape class
module.exports = PointShape;
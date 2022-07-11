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
     * @inheritdoc
     */
    get shapeId()
    {
        return "rect";
    }

    /**
     * Set this collision shape from rectangle.
     * @param {Rectangle} rectangle Rectangle shape.
     */
    setShape(rectangle)
    {
        this._rect = rectangle;
        this._center = rectangle.getCenter();
        this._radius = this._rect.getBoundingCircle().radius;
        this._shapeChanged();
    }
       
    /**
     * @inheritdoc
     */ 
    _getRadius()
    {
        return this._radius;
    }

    /**
     * @inheritdoc
     */
    _getBoundingBox()
    {
        return this._rect;
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._center.clone();
    }
    
    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        if (opacity === undefined) opacity = 1;
        let color = this._getDebugColor();

        color.a *= opacity;
        gfx.outlineRect(this._rect, color, gfx.BlendModes.AlphaBlend);
                
        color.a *= 0.25;
        gfx.fillRect(this._rect, color, gfx.BlendModes.AlphaBlend);
    }
}

// export collision shape class
module.exports = RectangleShape;
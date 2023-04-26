/**
 * Implement collision rectangle.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\collision\shapes\rectangle.js
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
     * @inheritdoc
     */
    debugDraw(opacity, shapesBatch)
    {
        if (opacity === undefined) { opacity = 1; }
        let color = this._getDebugColor();
        color.a *= opacity;
        shapesBatch = this._getDebugDrawBatch(shapesBatch);
        let needToBegin = !shapesBatch.isDrawing;
        if (needToBegin) { shapesBatch.begin(); }
        shapesBatch.drawRectangle(this._rect, color);
        if (needToBegin) { shapesBatch.end(); }
    }
}

// export collision shape class
module.exports = RectangleShape;
/**
 * Implement collision point.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\collision\shapes\point.js
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
const Circle = require("../../utils/circle");


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
     * @inheritdoc
     */
    get shapeId()
    {
        return "point";
    }
    
    /**
     * Set this collision shape from vector2.
     * @param {Vector2} position Point position.
     */
    setPosition(position)
    {
        this._position = position.clone();
        this._boundingBox = new Rectangle(position.x, position.y, 1, 1);
        this._shapeChanged();
    }

    /**
     * Get point position.
     * @returns {Vector2} Point position.
     */
    getPosition()
    {
        return this._position.clone();
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._position.clone();
    }

    /**
     * @inheritdoc
     */
    _getRadius()
    {
        return 1;
    }

    /**
     * @inheritdoc
     */
    _getBoundingBox()
    {
        return this._boundingBox;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity, shapesBatch)
    {
        if (opacity === undefined) { opacity = 1; }
        let color = this._getDebugColor();
        color.a *= opacity;
        shapesBatch = this._getDebugDrawBatch(shapesBatch);
        let needToBegin = !shapesBatch.isDrawing;
        if (needToBegin) { shapesBatch.begin(); }
        shapesBatch.drawCircle(new Circle(this.getPosition(), 3), color, 4);
        if (needToBegin) { shapesBatch.end(); }
    }
}

// export collision shape class
module.exports = PointShape;
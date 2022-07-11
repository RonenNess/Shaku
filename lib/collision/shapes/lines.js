/**
 * Implement collision lines.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\lines.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const CollisionShape = require("./shape");
const gfx = require('./../../gfx');
const Line = require("../../utils/line");
const Rectangle = require("../../utils/rectangle");
const Circle = require("../../utils/circle");


/**
 * Collision lines class.
 * This shape is made of one line or more.
 */
class LinesShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Array<Line>|Line} lines Starting line / lines.
     */
    constructor(lines)
    {
        super();
        this._lines = [];
        this.addLines(lines);
    }

    /**
     * @inheritdoc
     */
    get shapeId()
    {
        return "lines";
    }
    
    /**
     * Add line or lines to this collision shape.
     * @param {Array<Line>|Line} lines Line / lines to add.
     */
    addLines(lines)
    {
        // convert to array
        if (!Array.isArray(lines)) {
            lines = [lines];
        }

        // add lines
        for (let i = 0; i < lines.length; ++i)
        {
            this._lines.push(lines[i]);
        }

        // get all points
        let points = [];
        for (let i = 0; i < this._lines.length; ++i) {
            points.push(this._lines[i].from);
            points.push(this._lines[i].to);
        }

        // reset bounding box and circle
        this._boundingBox = Rectangle.fromPoints(points);
        this._circle = new Circle(this._boundingBox.getCenter(), Math.max(this._boundingBox.width, this._boundingBox.height));
        this._shapeChanged();
    }

    /**
     * Set this shape from line or lines array.
     * @param {Array<Line>|Line} lines Line / lines to set.
     */
    setLines(lines)
    {
        this._lines = [];
        this.addLines(lines);
    }
 
    /**
     * @inheritdoc
     */
    _getRadius()
    {
        return this._circle.radius;
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._circle.center.clone();
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
    debugDraw(opacity)
    {
        if (opacity === undefined) opacity = 1;
        let color = this._getDebugColor();

        color.a *= opacity;
        for (let i = 0; i < this._lines.length; ++i) {
            gfx.drawLine(this._lines[i].from, this._lines[i].to, color, gfx.BlendModes.AlphaBlend);
        }
    }
}

// export collision lines class
module.exports = LinesShape;
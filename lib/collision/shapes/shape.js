/**
 * Implement collision shape base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\shape.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Color = require("../../utils/color");
const Rectangle = require("../../utils/rectangle");
const Vector2 = require("../../utils/vector2");
const CollisionWorld = require("../collision_world");

 
/**
 * Collision shape base class.
 */
class CollisionShape
{
    /**
     * Create the collision shape.
     */
    constructor()
    {
        this._world = null;
        this._worldRange = null;
        this._debugColor = null;
        this._forceDebugColor = null;
        this._collisionFlags = Number.MAX_SAFE_INTEGER;
    }

    /**
     * Get collision flags (matched against collision mask when checking collision).
     */
    get collisionFlags()
    {
        return this._collisionFlags;
    }

    /**
     * Set collision flags (matched against collision mask when checking collision).
     */
    set collisionFlags(value)
    {
        this._debugColor = null;
        this._collisionFlags = value;
        return this._collisionFlags;
    }

    /**
     * Set the debug color to use to draw this shape.
     * @param {Color} color Color to set or null to use default.
     */
    setDebugColor(color)
    {
        this._forceDebugColor = color;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        throw new Error("Not Implemented!");
    }
    
    /**
     * Get shape center position.
     * @returns {Vector2} Center position.
     */
    getCenter()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get debug drawing color.
     * @private
     */
    _getDebugColor()
    {
        // use forced debug color
        if (this._forceDebugColor) {
            return this._forceDebugColor.clone();
        }

        // calculate debug color
        if (!this._debugColor) {
            this._debugColor = defaultDebugColors[this.collisionFlags % defaultDebugColors.length];
        }

        // return color
        return this._debugColor.clone();
    }

    /**
     * Get collision shape's estimated radius box.
     * @private
     * @returns {Number} Shape's radius
     */
    _getRadius()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get collision shape's bounding box.
     * @private
     * @returns {Rectangle} Shape's bounding box.
     */
    _getBoundingBox()
    {
        throw new Error("Not Implemented!");
    }
    
    /**
     * Set the parent collision world this shape is currently in.
     * @private
     * @param {CollisionWorld} world New parent collision world or null to remove.
     */
    _setParent(world)
    {
        // same world? skip
        if (world === this._world) {
            return;
        }

        // we already have a world but try to set a new one? error
        if (this._world && world) {
            throw new Error("Cannot add collision shape to world while its already in another world!");
        }

        // set new world
        this._world = world;
        this._worldRange = null;
    }

    /**
     * Called when the collision shape changes and we need to update the parent world.
     * @private
     */
    _shapeChanged()
    {
        if (this._world) {
            this._world._queueUpdate(this);
        }
    }
}

// default debug colors to use
const defaultDebugColors = [Color.red, Color.blue, Color.green, Color.yellow, Color.purple, Color.teal, Color.brown, Color.orange, Color.khaki, Color.darkcyan, Color.cornflowerblue, Color.darkgray, Color.chocolate, Color.aquamarine, Color.cadetblue, Color.magenta, Color.seagreen, Color.pink, Color.olive, Color.violet];

// export collision shape class
module.exports = CollisionShape;
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
     * Get debug drawing color.
     * @private
     */
    _getDebugColor()
    {
        // use forced debug color
        if (this._forceDebugColor) {
            return this._forceDebugColor;
        }

        // calculate debug color
        if (!this._debugColor) {
            this._debugColor = Color.red;
        }

        // return color
        return this._debugColor.clone();
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

// export collision shape class
module.exports = CollisionShape;
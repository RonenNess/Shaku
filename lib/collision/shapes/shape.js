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
        this._world = world;
        this._worldRange = null;
    }

    /**
     * Get collision shape's bounding box.
     * @returns {Rectangle} Shape's bounding box.
     */
    getBoundingBox()
    {
        throw new Error("Not Implemented!");
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
        shape._worldRange = null;
    }
}

// export collision shape class
module.exports = CollisionShape;
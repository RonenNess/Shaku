/**
 * An object to store collision detection result.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\result.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require("../utils/vector2");
const CollisionShape = require("./shapes/shape");

 
/**
 * Collision detection result.
 */
class CollisionTestResult
{
    /**
     * Create the collision result.
     * @param {Vector2} position Optional collision position.
     * @param {CollisionShape} first First shape in the collision check.
     * @param {CollisionShape} second Second shape in the collision check.
     */
    constructor(position, first, second)
    {
        /**
         * Collision position, only relevant when there's a single touching point.
         * For shapes with multiple touching points, this will be null.
         */
        this.position = position;

        /**
         * First collided shape.
         */
        this.first = first;

        /**
         * Second collided shape.
         */
        this.second = second;
    }
}

// export collision shape class
module.exports = CollisionTestResult;
/**
 * Implement the collision resolver class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\resolver.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require('../utils/vector2.js');
const CollisionTestResult = require('./result.js');
const CollisionShape = require('./shapes/shape.js');
const _logger = require('../logger.js').getLogger('collision');

 
/**
 * The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.
 */
class CollisionResolver
{
    /**
     * Create the resolver.
     */
    constructor()
    {
        this._handlers = {};
    }

    /**
     * Initialize the resolver.
     * @private
     */
    _init()
    {

    }

    /**
     * Set the method used to test collision between two shapes.
     * Note: you don't need to register the same handler twice for reverse order, its done automatically inside.
     * @param {Class} firstShapeClass The shape type the handler recieves as first argument.
     * @param {Class} secondShapeClass The shape type the handler recieves as second argument.
     * @param {Function} handler Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision.
     */
    setHandler(firstShapeClass, secondShapeClass, handler)
    {
        _logger.debug(`Register handler for shapes '${firstShapeClass.name}' and '${secondShapeClass.name}'.`);

        // register handler
        if (!this._handlers[firstShapeClass]) { this._handlers[firstShapeClass] = {}; }
        this._handlers[firstShapeClass][secondShapeClass] = handler;

        // register reverse order handler
        if (!this._handlers[secondShapeClass]) { this._handlers[secondShapeClass] = {}; }
        this._handlers[secondShapeClass][firstShapeClass] = (f, s) => { return handler(s, f); };
    }

    /**
     * Check a collision between two shapes.
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @returns {CollisionTestResult} collision detection result or null if they don't collide.
     */
    test(first, second)
    {
        // get method and make sure we got a handler
        let method = _getCollisionMethod(first, second);
        if (!method) {
            _logger.warn(`Missing collision handler for shapes '${first.constructor.name}' and '${second.constructor.name}'.`);
            return null;
        }

        // test collision
        let result = handler(first, second);

        // collision
        if (result) {
            let position = (result instanceof Vector2) ? result : null;
            return new CollisionTestResult(position, first, second);
        }

        // no collision
        return null;
    }

    /**
     * Get the collision detection method for two given shapes.
     * @private
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @returns {Function} collision detection method or null if not found.
     */
    _getCollisionMethod(first, second)
    {
        if (this._handlers[first.constructor]) {
            return this._handlers[first.constructor][second.constructor] || null;
        }
        return null;
    }
}

// export the collision resolver
module.exports = CollisionResolver;
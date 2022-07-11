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
     * @param {String} firstShapeId The shape identifier the handler recieves as first argument.
     * @param {String} secondShapeId The shape identifier the handler recieves as second argument.
     * @param {Function} handler Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision.
     */
    setHandler(firstShapeId, secondShapeId, handler)
    {
        _logger.debug(`Register handler for shapes '${firstShapeId}' and '${secondShapeId}'.`);

        // register handler
        if (!this._handlers[firstShapeId]) { this._handlers[firstShapeId] = {}; }
        this._handlers[firstShapeId][secondShapeId] = handler;

        // register reverse order handler
        if (firstShapeId !== secondShapeId) {
            if (!this._handlers[secondShapeId]) { this._handlers[secondShapeId] = {}; }
            this._handlers[secondShapeId][firstShapeId] = (f, s) => { return handler(s, f); };
        }
    }

    /**
     * Check a collision between two shapes.
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @returns {CollisionTestResult} collision detection result or null if they don't collide.
     */
    test(first, second)
    {
        let handler = this._getCollisionMethod(first, second);
        return this.testWithHandler(first, second, handler);
    }

    /**
     * Check a collision between two shapes.
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @param {Function} handler Method to test collision between the shapes.
     * @returns {CollisionTestResult} collision detection result or null if they don't collide.
     */
    testWithHandler(first, second, handler)
    {
        // missing handler?
        if (!handler) {
            _logger.warn(`Missing collision handler for shapes '${first.shapeId}' and '${second.shapeId}'.`);
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
     * Get handlers dictionary for a given shape.
     */
    getHandlers(shape)
    {
        return this._handlers[shape.shapeId];
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
        let handlersFrom = this._handlers[first.shapeId];
        if (handlersFrom) {
            return handlersFrom[second.shapeId] || null;
        }
        return null;
    }
}

// export the collision resolver
module.exports = CollisionResolver;
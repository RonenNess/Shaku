/**
 * Implement the collision manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\collision.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const IManager = require('../manager.js');
const Vector2 = require('../utils/vector2.js');
const CollisionWorld = require('./collision_world.js');
const _resolver = require('./resolver');
const _logger = require('../logger.js').getLogger('collision');


/**
 * Collision is the collision manager. 
 * It provides basic 2d collision detection functionality.
 * Note: this is *not* a physics engine, its only for detection and objects picking.
 * 
 * To access the Collision manager you use `Shaku.collision`. 
 */
class Collision extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    setup()
    {        
        return new Promise((resolve, reject) => {    
            _logger.info("Setup collision manager..");
            _resolver._init();
            resolve();
        });
    }

    /**
     * Get the collision resolver. 
     * You can use this object directly without creating a collision world, if you just need to test collision between two shapes.
     */
    get resolver()
    {
        return _resolver;
    }

    /**
     * Create a new collision world object.
     * @param {Number|Vector2} gridCellSize Collision world grid cell size.
     * @returns {CollisionWorld} Newly created collision world.
     */
    createWorld(gridCellSize)
    {
        return new CollisionWorld(gridCellSize);
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    startFrame()
    {

    }

    /** 
     * @inheritdoc 
     * @private
     **/
    endFrame()
    {
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    destroy()
    {
    }    
}

// export main object
module.exports = new Collision();
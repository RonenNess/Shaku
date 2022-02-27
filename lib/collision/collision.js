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
const CollisionResolver = require('./resolver');
const CircleShape = require('./shapes/circle.js');
const PointShape = require('./shapes/point.js');
const RectangleShape = require('./shapes/rectangle.js');
const ResolverImp = require('./resolvers_imp');
const LinesShape = require('./shapes/lines.js');
const TilemapShape = require('./shapes/tilemap.js');
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

        /**
         * The collision resolver we use to detect collision between different shapes. 
         * You can use this object directly without creating a collision world, if you just need to test collision between shapes.
         */
        this.resolver = new CollisionResolver();
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    setup()
    {        
        return new Promise((resolve, reject) => {    
            _logger.info("Setup collision manager..");

            this.resolver._init();
            this.resolver.setHandler(PointShape, PointShape, ResolverImp.pointPoint);
            this.resolver.setHandler(PointShape, CircleShape, ResolverImp.pointCircle);
            this.resolver.setHandler(PointShape, RectangleShape, ResolverImp.pointRectangle);
            this.resolver.setHandler(PointShape, LinesShape, ResolverImp.pointLine);
            this.resolver.setHandler(PointShape, TilemapShape, ResolverImp.pointTilemap);

            this.resolver.setHandler(CircleShape, CircleShape, ResolverImp.circleCircle);
            this.resolver.setHandler(CircleShape, RectangleShape, ResolverImp.circleRectangle);
            this.resolver.setHandler(CircleShape, LinesShape, ResolverImp.circleLine);
            this.resolver.setHandler(CircleShape, TilemapShape, ResolverImp.circleTilemap);

            this.resolver.setHandler(RectangleShape, RectangleShape, ResolverImp.rectangleRectangle);
            this.resolver.setHandler(RectangleShape, LinesShape, ResolverImp.rectangleLine);
            this.resolver.setHandler(RectangleShape, TilemapShape, ResolverImp.rectangleTilemap);

            this.resolver.setHandler(LinesShape, LinesShape, ResolverImp.lineLine);
            this.resolver.setHandler(LinesShape, TilemapShape, ResolverImp.lineTilemap);

            resolve();
        });
    }

    /**
     * Create a new collision world object.
     * @param {Number|Vector2} gridCellSize Collision world grid cell size.
     * @returns {CollisionWorld} Newly created collision world.
     */
    createWorld(gridCellSize)
    {
        return new CollisionWorld(this.resolver, gridCellSize);
    }

    /**
     * Get the collision reactanle shape class.
     */
    get RectangleShape()
    {
        return RectangleShape
    }

    /**
     * Get the collision point shape class.
     */
    get PointShape()
    {
        return PointShape;
    }

    /**
     * Get the collision circle shape class.
     */
    get CircleShape()
    {
        return CircleShape;
    }

    /**
     * Get the collision lines shape class.
     */
    get LinesShape()
    {
        return LinesShape;
    }

    /**
     * Get the tilemap collision shape class.
     */
    get TilemapShape()
    {
        return TilemapShape;
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
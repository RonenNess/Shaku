import _logger from "../logger.js";
import IManager from "../manager";
import Vector2 from "../utils/vector2";
import CollisionWorld from "./collision_world";
import CollisionResolver from "./resolver";
import ResolverImp from "./resolvers_imp";
import CircleShape from "./shapes/circle";
import LinesShape from "./shapes/lines";
import PointShape from "./shapes/point";
import RectangleShape from "./shapes/rectangle";
import TilemapShape from "./shapes/tilemap";

const _loggggger = _logger.getLogger(collision); // TODO











/**
 * Collision is the collision manager.
 * It provides basic 2d collision detection functionality.
 * Note: this is *not* a physics engine, its only for detection and objects picking.
 *
 * To access the Collision manager you use `Shaku.collision`.
 */
class Collision extends IManager {
	/**
	 * Create the manager.
	 */
	constructor() {
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
	setup() {
		return new Promise((resolve, reject) => {
			_logger.info("Setup collision manager..");

			this.resolver._init();
			this.resolver.setHandler("point", "point", ResolverImp.pointPoint);
			this.resolver.setHandler("point", "circle", ResolverImp.pointCircle);
			this.resolver.setHandler("point", "rect", ResolverImp.pointRectangle);
			this.resolver.setHandler("point", "lines", ResolverImp.pointLine);
			this.resolver.setHandler("point", "tilemap", ResolverImp.pointTilemap);

			this.resolver.setHandler("circle", "circle", ResolverImp.circleCircle);
			this.resolver.setHandler("circle", "rect", ResolverImp.circleRectangle);
			this.resolver.setHandler("circle", "lines", ResolverImp.circleLine);
			this.resolver.setHandler("circle", "tilemap", ResolverImp.circleTilemap);

			this.resolver.setHandler("rect", "rect", ResolverImp.rectangleRectangle);
			this.resolver.setHandler("rect", "lines", ResolverImp.rectangleLine);
			this.resolver.setHandler("rect", "tilemap", ResolverImp.rectangleTilemap);

			this.resolver.setHandler("lines", "lines", ResolverImp.lineLine);
			this.resolver.setHandler("lines", "tilemap", ResolverImp.lineTilemap);

			resolve();
		});
	}

	/**
	 * Create a new collision world object.
	 * @param {Number|Vector2} gridCellSize Collision world grid cell size.
	 * @returns {CollisionWorld} Newly created collision world.
	 */
	createWorld(gridCellSize) {
		return new CollisionWorld(this.resolver, gridCellSize);
	}

	/**
	 * Get the collision reactanle shape class.
	 */
	get RectangleShape() {
		return RectangleShape;
	}

	/**
	 * Get the collision point shape class.
	 */
	get PointShape() {
		return PointShape;
	}

	/**
	 * Get the collision circle shape class.
	 */
	get CircleShape() {
		return CircleShape;
	}

	/**
	 * Get the collision lines shape class.
	 */
	get LinesShape() {
		return LinesShape;
	}

	/**
	 * Get the tilemap collision shape class.
	 */
	get TilemapShape() {
		return TilemapShape;
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	startFrame() {
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	endFrame() {
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	destroy() {
	}
}

// export main object
export default new Collision();

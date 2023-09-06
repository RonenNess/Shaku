import { IManager, LoggerFactory, Vector2 } from "../utils";
import { CollisionWorld } from "./collision_world";
import { CollisionResolver } from "./resolver";
import { CollisionsImp as ResolverImp } from "./resolvers_imp";
import { CircleShape, LinesShape, PointShape, RectangleShape, TilemapShape } from "./shapes";

const _logger = LoggerFactory.getLogger("collision"); // TODO

/**
 * Collision is the collision manager.
 * It provides basic 2d collision detection functionality.
 * Note: this is *not* a physics engine, its only for detection and objects picking.
 *
 * To access the Collision manager you use `Shaku.collision`.
 */
export class Collision implements IManager {
	/**
	 * Create the manager.
	 */
	public constructor() {
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
	public setup(): Promise<void> {
		return new Promise((resolve, _reject) => {
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
	public createWorld(gridCellSize) {
		return new CollisionWorld(this.resolver, gridCellSize);
	}

	/**
	 * Get the collision rectangle shape class.
	 */
	public getRectangleShape() {
		return RectangleShape;
	}

	/**
	 * Get the collision point shape class.
	 */
	public getPointShape() {
		return PointShape;
	}

	/**
	 * Get the collision circle shape class.
	 */
	public getCircleShape() {
		return CircleShape;
	}

	/**
	 * Get the collision lines shape class.
	 */
	public getLinesShape() {
		return LinesShape;
	}

	/**
	 * Get the tilemap collision shape class.
	 */
	public getTilemapShape() {
		return TilemapShape;
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	public startFrame() {
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	public endFrame() {
	}

	/**
	 * @inheritdoc
	 * @private
	 **/
	public destroy() {
	}
}

export const collision = new Collision();

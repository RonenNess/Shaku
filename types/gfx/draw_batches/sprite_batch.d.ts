export = SpriteBatch;
/**
 * Sprite batch renderer.
 * Responsible to drawing a batch of sprites with as little draw calls as possible.
 */
declare class SpriteBatch extends SpriteBatchBase {
    /**
     * Push vertices to drawing batch.
     * @param {TextureAssetBase} texture Texture to draw.
     * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 4 to keep the batch consistent of quads.
     */
    drawVertices(texture: TextureAssetBase, vertices: Array<Vertex>): void;
    /**
     * Add a quad to draw.
     * @param {TextureAssetBase} texture Texture to draw.
     * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
     * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
     * @param {Rectangle} sourceRectangle Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Number=} rotation Rotate sprite.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
     */
    drawQuad(texture: TextureAssetBase, position: Vector2 | Vector3, size: Vector2 | Vector3 | number, sourceRectangle: typeof import("../../utils/rectangle"), color: Color | Array<Color> | undefined, rotation?: number | undefined, origin?: Vector2 | undefined, skew?: Vector2 | undefined): void;
    /**
     * Add sprites group to this batch.
     * @param {SpritesGroup} group Sprite group to draw.
     * @param {Boolean=} cullOutOfScreen If true, will cull sprites that are not visible in currently set rendering region.
     */
    drawSpriteGroup(group: SpritesGroup, cullOutOfScreen?: boolean | undefined): void;
    /**
     * Add a quad that covers a given destination rectangle.
     * @param {TextureAssetBase} texture Texture to draw.
     * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
     * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     */
    drawRectangle(texture: TextureAssetBase, destRect: typeof import("../../utils/rectangle") | Vector2, sourceRect?: typeof import("../../utils/rectangle") | undefined, color: Color | Array<Color> | undefined, origin?: Vector2 | undefined): void;
    #private;
}
import SpriteBatchBase = require("./sprite_batch_base");
import TextureAssetBase = require("../../assets/texture_asset_base");
import Vector2 = require("../../utils/vector2");
import Vector3 = require("../../utils/vector3");
//# sourceMappingURL=sprite_batch.d.ts.map
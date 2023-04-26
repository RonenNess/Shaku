export = Sprite;
/**
 * Sprite class.
 */
declare class Sprite {
    /**
     * Build a sprite from params.
     * @param {TextureAssetBase} texture Sprite texture.
     * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
     * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
     * @param {Rectangle} sourceRectangle Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {Number=} rotation Rotate sprite.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
     * @returns {Sprite} New sprite instance.
     */
    static build(texture: TextureAssetBase, position: Vector2 | Vector3, size: Vector2 | Vector3 | number, sourceRectangle: Rectangle, color: Color | Array<Color> | undefined, rotation?: number | undefined, origin?: Vector2 | undefined, skew?: Vector2 | undefined): Sprite;
    /**
     * Create the sprite object.
     * @param {TextureAssetBase} texture Sprite texture.
     * @param {Rectangle=} sourceRectangle Optional source rectangle.
     */
    constructor(texture: TextureAssetBase, sourceRectangle?: Rectangle | undefined);
    /**
     * Sprite's texture.
     * @name Sprite#texture
     * @type {TextureAssetBase}
     */
    texture: TextureAssetBase;
    /**
     * Sprite position.
     * If Vector3 is provided, the z value will be passed to vertices position in shader code.
     * @name Sprite#position
     * @type {Vector2|Vector3}
     */
    position: Vector2 | Vector3;
    /**
     * Sprite size.
     * If Vector3 is provided, the z value will be passed to the bottom vertices position in shader code, as position.z + size.z.
     * @name Sprite#size
     * @type {Vector2|Vector3}
     */
    size: Vector2 | Vector3;
    /**
     * Sprite source rectangle in texture.
     * Null will take entire texture.
     * @name Sprite#sourceRectangle
     * @type {Rectangle}
     */
    sourceRectangle: Rectangle;
    /**
     * Sprite rotation in radians.
     * @name Sprite#rotation
     * @type {Number}
     */
    rotation: number;
    /**
     * Sprite origin point.
     * @name Sprite#origin
     * @type {Vector2}
     */
    origin: Vector2;
    /**
     * Skew the sprite corners on X and Y axis, around the origin point.
     * @name Sprite#skew
     * @type {Vector2}
     */
    skew: Vector2;
    /**
     * Sprite color.
     * If array is set, will assign each color to different vertex, starting from top-left.
     * @name Sprite#color
     * @type {Color|Array<Color>}
     */
    color: Color | Array<Color>;
    /**
     * Set size to source rectangle size.
     * @returns {Sprite} this.
     */
    setToSourceRectangleSize(): Sprite;
    /**
     * Set size to texture size.
     * @returns {Sprite} this.
     */
    setToTextureSize(): Sprite;
    /**
     * Set the source Rectangle automatically from spritesheet.
     * This method get sprite index in sheet and how many sprites there are in total, and calculate the desired
     * offset and size in source Rectangle based on it + source image size.
     * @param {TextureAssetBase} texture Texture to set source rectangle from.
     * @param {Vector2} index Sprite index in spritesheet.
     * @param {Vector2} spritesCount How many sprites there are in spritesheet in total.
     * @param {Number=} margin How many pixels to trim from the tile (default is 0).
     * @param {Boolean=} setSize If true will also set width and height based on source rectangle (default is true).
     */
    setSourceFromSpritesheet(texture: TextureAssetBase, index: Vector2, spritesCount: Vector2, margin?: number | undefined, setSize?: boolean | undefined): void;
    /**
     * Clone this sprite.
     * @returns {Sprite} cloned sprite.
     */
    clone(): Sprite;
    /**
     * Flip sprite around X axis.
     * This is just a sugarcoat that set size.x to negative or positive value, without changing its scale.
     * @param {Boolean} flip Should we flip the sprite around X axis. If undefined, will take the negative of flipX current value, ie will toggle flipping.
     */
    set flipX(arg: boolean);
    /**
     * Check if this sprite is flipped around X axis.
     * This is just a sugarcoat that returns if size.x < 0.
     * @returns {Boolean} If sprite is flipped on X axis.
     */
    get flipX(): boolean;
    /**
     * Flip sprite around Y axis.
     * This is just a sugarcoat that set size.y to negative or positive value, without changing its scale.
     * @param {Boolean} flip Should we flip the sprite around Y axis. If undefined, will take the negative of flipY current value, ie will toggle flipping.
     */
    set flipY(arg: boolean);
    /**
     * Check if this sprite is flipped around y axis.
     * This is just a sugarcoat that returns if size.y < 0.
     * @returns {Boolean} If sprite is flipped on Y axis.
     */
    get flipY(): boolean;
}
import TextureAssetBase = require("../assets/texture_asset_base");
import Vector2 = require("../utils/vector2");
import Vector3 = require("../utils/vector3");
import Rectangle = require("../utils/rectangle");
import Color = require("../utils/color");
//# sourceMappingURL=sprite.d.ts.map
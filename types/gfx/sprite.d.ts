export = Sprite;
/**
 * Sprite class.
 * This object is a helper class to hold all the properties of a texture to render.
 */
declare class Sprite {
    /**
     * Create the texture object.
     * @param {TextureAsset} texture Texture asset.
     * @param {Rectangle=} sourceRect Optional source rect.
     */
    constructor(texture: TextureAsset, sourceRect?: Rectangle | undefined);
    /**
     * Texture to use for this sprite.
     * @name Sprite#texture
     * @type {TextureAsset}
     */
    texture: TextureAsset;
    /**
     * Sprite position.
     * If Vector3 is provided, the z value will be passed to vertices position in shader code.
     * This property is locked when static=true.
     * @name Sprite#position
     * @type {Vector2|Vector3}
     */
    position: Vector2 | Vector3;
    size: Vector2;
    /**
     * Sprite source rectangle in texture.
     * Null will take entire texture.
     * This property is locked when static=true.
     * @name Sprite#sourceRect
     * @type {Rectangle}
     */
    sourceRect: Rectangle;
    /**
     * Sprite blend mode.
     * @name Sprite#blendMode
     * @type {BlendMode}
     */
    blendMode: BlendMode;
    /**
     * Sprite rotation in radians.
     * This property is locked when static=true.
     * @name Sprite#rotation
     * @type {Number}
     */
    rotation: number;
    /**
     * Sprite origin point.
     * This property is locked when static=true.
     * @name Sprite#origin
     * @type {Vector2}
     */
    origin: Vector2;
    /**
     * Skew the sprite corners on X and Y axis, around the origin point.
     * This property is locked when static=true.
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
     * Is this a static sprite.
     * Static sprites will only calculate vertices properties once, and reuse them in following render calls.
     * This will improve performance, but also means that once the sprite is rendered once, changing things like position, size, rotation, etc.
     * won't affect the output. To refresh the properties of a static sprite, you need to call updateStaticProperties() manually.
     * @name Sprite#static
     * @type {Boolean}
     */
    static: boolean;
    /**
     * Set the source Rectangle automatically from spritesheet.
     * This method get sprite index in sheet and how many sprites there are in total, and calculate the desired
     * offset and size in source Rectangle based on it + source image size.
     * @param {Vector2} index Sprite index in spritesheet.
     * @param {Vector2} spritesCount How many sprites there are in spritesheet in total.
     * @param {Number=} margin How many pixels to trim from the tile (default is 0).
     * @param {Boolean=} setSize If true will also set width and height based on source rectangle (default is true).
     */
    setSourceFromSpritesheet(index: Vector2, spritesCount: Vector2, margin?: number | undefined, setSize?: boolean | undefined): void;
    /**
     * Clone this sprite.
     * @returns {Sprite} cloned sprite.
     */
    clone(): Sprite;
    /**
     * Manually update the static properties (position, size, rotation, origin, source rectangle, etc.) of a static sprite.
     */
    updateStaticProperties(): void;
    _cachedVertices: any;
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
import TextureAsset = require("../assets/texture_asset");
import Vector2 = require("../utils/vector2");
import Vector3 = require("../utils/vector3");
import Rectangle = require("../utils/rectangle");
import { BlendMode } from "./blend_modes";
import Color = require("../utils/color");
//# sourceMappingURL=sprite.d.ts.map
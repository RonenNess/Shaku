/**
 * Define a sprite object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprite.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const TextureAsset = require("../assets/texture_asset");
const Color = require("../utils/color");
const Rectangle = require("../utils/rectangle");
const Vector2 = require("../utils/vector2");
const Vector3 = require("../utils/vector3");
const BlendModes = require("./blend_modes");

/**
 * Sprite class.
 * This object is a helper class to hold all the properties of a texture to render.
 */
class Sprite
{
    /**
     * Create the texture object.
     * @param {TextureAsset} texture Texture asset.
     * @param {Rectangle} sourceRect Optional source rect.
     */
    constructor(texture, sourceRect)
    {
        /**
         * Texture to use for this sprite.
         * @name Sprite#texture
         * @type {TextureAsset}
         */
        this.texture = texture;
        
        /**
         * Sprite position.
         * If Vector3 is provided, the z value will be passed to vertices position in shader code.
         * This property is locked when static=true.
         * @name Sprite#position
         * @type {Vector2|Vector3}
         */
        this.position = new Vector2(0, 0);

        /**
         * Sprite size.
         * If Vector3 is provided, the z value will be passed to the bottom vertices position in shader code, as position.z + size.z.
         * This property is locked when static=true.
         * @name Sprite#size
         * @type {Vector2|Vector3}
         */
        this.size = texture.size.clone();

        /**
         * Sprite source rectangle in texture.
         * Null will take entire texture.
         * This property is locked when static=true.
         * @name Sprite#sourceRect
         * @type {Rectangle}
         */
        this.sourceRect = sourceRect || null;
        
        /**
         * Sprite blend mode.
         * @name Sprite#blendMode
         * @type {BlendModes}
         */
        this.blendMode = BlendModes.AlphaBlend;
        
        /**
         * Sprite rotation in radians.
         * This property is locked when static=true.
         * @name Sprite#rotation
         * @type {Number}
         */
        this.rotation = 0;
        
        /**
         * Sprite origin point.
         * This property is locked when static=true.
         * @name Sprite#origin
         * @type {Vector2}
         */
        this.origin = new Vector2(0.5, 0.5);
        
        /**
         * Skew the sprite corners on X and Y axis, around the origin point.
         * This property is locked when static=true.
         * @name Sprite#skew
         * @type {Vector2}
         */
        this.skew = new Vector2(0, 0);
        
        /**
         * Sprite color.
         * If array is set, will assign each color to different vertex, starting from top-left.
         * @name Sprite#color
         * @type {Color|Array<Color>}
         */
        this.color = Color.white;

        /**
         * Is this a static sprite.
         * Static sprites will only calculate vertices properties once, and reuse them in following render calls.
         * This will improve performance, but also means that once the sprite is rendered once, changing things like position, size, rotation, etc.
         * won't affect the output. To refresh the properties of a static sprite, you need to call updateStaticProperties() manually.
         * @name Sprite#static
         * @type {Boolean}
         */
        this.static = false;
    }

    /**
     * Clone this sprite.
     * @returns {Sprite} cloned sprite.
     */
    clone()
    {
        let ret = new Sprite(this.texture, this.sourceRect);
        ret.position = this.position.clone();
        ret.size = this.size.clone();
        ret.blendMode = this.blendMode;
        ret.rotation = this.rotation;
        ret.origin = this.origin.clone();
        ret.color = this.color.clone();
        ret.static = this.static;
        return ret;
    }

    /**
     * Manually update the static properties (position, size, rotation, origin, source rectangle, etc.) of a static sprite.
     */
    updateStaticProperties()
    {
        this._cachedVertices = null;
    }

    /**
     * Check if this sprite is flipped around X axis.
     * This is just a sugarcoat that returns if size.x < 0.
     * @returns {Boolean} If sprite is flipped on X axis.
     */
    get flipX()
    {
        return this.size.x < 0;
    }

    /**
     * Flip sprite around X axis.
     * This is just a sugarcoat that set size.x to negative or positive value, without changing its scale.
     * @param {Boolean} flip Should we flip the sprite around X axis. If undefined, will take the negative of flipX current value, ie will toggle flipping.
     */
    set flipX(flip)
    {
        if (flip === undefined) flip = !this.flipX;
        this.size.x = Math.abs(this.size.x) * (flip ? -1 : 1);
        return flip;
    }

    /**
     * Check if this sprite is flipped around y axis.
     * This is just a sugarcoat that returns if size.y < 0.
     * @returns {Boolean} If sprite is flipped on Y axis.
     */
     get flipY()
     {
         return this.size.y < 0;
     }
 
     /**
      * Flip sprite around Y axis.
      * This is just a sugarcoat that set size.y to negative or positive value, without changing its scale.
      * @param {Boolean} flip Should we flip the sprite around Y axis. If undefined, will take the negative of flipY current value, ie will toggle flipping.
      */
     set flipY(flip)
     {
         if (flip === undefined) flip = !this.flipY;
         this.size.y = Math.abs(this.size.y) * (flip ? -1 : 1);
         return flip;
     }
}

// export the sprite class.
module.exports = Sprite;
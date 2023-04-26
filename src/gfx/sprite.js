/**
 * Define a sprite object we can draw using sprite batches.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\gfx\sprite.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const TextureAsset = require("../assets/texture_asset");
const TextureAssetBase = require("../assets/texture_asset_base");
const Color = require("../utils/color");
const Rectangle = require("../utils/rectangle");
const Vector2 = require("../utils/vector2");
const Vector3 = require("../utils/vector3");


/**
 * Sprite class.
 */
class Sprite
{
    /**
     * Create the sprite object.
     * @param {TextureAssetBase} texture Sprite texture.
     * @param {Rectangle=} sourceRectangle Optional source rectangle.
     */
    constructor(texture, sourceRectangle)
    {
        /**
         * Sprite's texture.
         * @name Sprite#texture
         * @type {TextureAssetBase}
         */
        this.texture = texture;

        /**
         * Sprite position.
         * If Vector3 is provided, the z value will be passed to vertices position in shader code.
         * @name Sprite#position
         * @type {Vector2|Vector3}
         */
        this.position = Vector2.zero();

        /**
         * Sprite size.
         * If Vector3 is provided, the z value will be passed to the bottom vertices position in shader code, as position.z + size.z.
         * @name Sprite#size
         * @type {Vector2|Vector3}
         */
        this.size = new Vector2(100, 100);

        /**
         * Sprite source rectangle in texture.
         * Null will take entire texture.
         * @name Sprite#sourceRectangle
         * @type {Rectangle}
         */
        this.sourceRectangle = sourceRectangle || null;
        
        /**
         * Sprite rotation in radians.
         * @name Sprite#rotation
         * @type {Number}
         */
        this.rotation = 0;
        
        /**
         * Sprite origin point.
         * @name Sprite#origin
         * @type {Vector2}
         */
        this.origin = new Vector2(0.5, 0.5);
        
        /**
         * Skew the sprite corners on X and Y axis, around the origin point.
         * @name Sprite#skew
         * @type {Vector2}
         */
        this.skew = null;
        
        /**
         * Sprite color.
         * If array is set, will assign each color to different vertex, starting from top-left.
         * @name Sprite#color
         * @type {Color|Array<Color>}
         */
        this.color = Color.white;
    }

    /**
     * Set size to source rectangle size.
     * @returns {Sprite} this.
     */
    setToSourceRectangleSize()
    {
        this.size.copy(this.sourceRectangle.getSize());
        return this;
    }

    /**
     * Set size to texture size.
     * @returns {Sprite} this.
     */
    setToTextureSize()
    {
        this.size.copy(this.texture.getSize());
        return this;
    }

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
    static build(texture, position, size, sourceRectangle, color, rotation, origin, skew)
    {
        let sprite = new Sprite(texture, sourceRectangle);
        sprite.position = position;
        sprite.size = (typeof size === 'number') ? new Vector2(size, size) : size;
        if (color) { sprite.color = color; }
        if (rotation) { sprite.rotation = rotation; }
        if (origin) { sprite.origin = origin; }
        if (skew) { sprite.skew = skew; }
        return sprite;
    }

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
    setSourceFromSpritesheet(texture, index, spritesCount, margin, setSize) 
    {
        if (texture.width === 0 || texture.height === 0) {
            throw new Error("Texture has illegal size or is not fully loaded yet!");
        }

        margin = margin || 0;
        let w = texture.width / spritesCount.x;
        let h = texture.height / spritesCount.y;
        let x = w * index.x + margin;
        let y = h * index.y + margin;
        w -= 2*margin;
        h -= 2*margin;
        if (setSize || setSize === undefined) {
            this.size.set(w, h)
        }
        if (this.sourceRectangle) {
            this.sourceRectangle.set(x, y, w, h);
        } else {
            this.sourceRectangle = new Rectangle(x, y, w, h);
        }
    }

    /**
     * Clone this sprite.
     * @returns {Sprite} cloned sprite.
     */
    clone()
    {
        let sourceRect = this.sourceRectangle ? this.sourceRectangle.clone() : undefined;
        let ret = new Sprite(this.texture, sourceRect);
        ret.position = this.position.clone();
        ret.size = this.size.clone();
        ret.rotation = this.rotation || 0;
        ret.origin = this.origin ? this.origin.clone() : null;
        ret.color = this.color ? this.color.clone() : null;
        ret.skew = this.skew ? this.skew.clone() : null;
        return ret;
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
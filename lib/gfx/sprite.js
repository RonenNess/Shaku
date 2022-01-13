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
         * @name Sprite#position
         * @type {Vector2}
         */
        this.position = new Vector2(0, 0);

        /**
         * Sprite size.
         * @name Sprite#size
         * @type {Vector2}
         */
        this.size = new Vector2(100, 100);

        /**
         * Sprite source rectangle in texture.
         * Null will take entire texture.
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
         * Sprite color.
         * @name Sprite#color
         * @type {Color}
         */
        this.color = Color.white;
    }
}

// export the sprite class.
module.exports = Sprite;
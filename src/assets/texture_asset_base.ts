/**
 * Implement texture asset base type.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\assets\texture_asset_base.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");
const {TextureFilterMode} = require('../gfx/texture_filter_modes');
const {TextureWrapMode} = require('../gfx/texture_wrap_modes');
const Vector2 = require("../utils/vector2");


/**
 * Base type for all texture asset types.
 */
class TextureAssetBase extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._filter = null;
        this._wrapMode = null;
    }

    /**
     * Get texture magnifying filter, or null to use default.
     * @see Shaku.gfx.TextureFilterModes
     */
    get filter()
    {
        return this._filter;
    }

    /**
     * Set texture magnifying filter.
     * @see Shaku.gfx.TextureFilterModes 
     * @param {TextureFilterMode} value Filter mode to use or null to use default.
     */
    set filter(value)
    {
        this._filter = value;
    }

    /**
     * Get texture wrapping mode, or null to use default.
     * @see Shaku.gfx.TextureWrapModes
     */
    get wrapMode()
    {
        return this._wrapMode;
    }

    /**
     * Set texture wrapping mode.
     * @see Shaku.gfx.TextureWrapModes
     * @param {TextureWrapMode} value Wrapping mode to use or null to use default.
     */
    set wrapMode(value)
    {
        this._wrapMode = value;
    }
    
    /**
     * Get raw image.
     * @returns {Image} Image instance.
     */
    get image()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get texture width.
     * @returns {Number} Texture width.
     */
    get width()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get texture height.
     * @returns {Number} Texture height.
     */
    get height()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get texture size as a vector.
     * @returns {Vector2} Texture size.
     */
    getSize()
    {
        return new Vector2(this.width, this.height);
    }

    /**
     * Get texture instance for WebGL.
     */
    get _glTexture()
    {
        throw new Error("Not Implemented!");
    }
}


// export the asset type.
module.exports = TextureAssetBase;
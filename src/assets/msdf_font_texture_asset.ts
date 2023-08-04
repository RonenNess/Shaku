/**
 * Implement a MSDF font texture asset type.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\assets\msdf_font_texture_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require("../utils/vector2");
const Rectangle = require("../utils/rectangle");
const TextureAsset = require("./texture_asset");
const FontTextureAsset = require('./font_texture_asset')
const JsonAsset = require('./json_asset')
const TextureFilterModes = require('../gfx/texture_filter_modes')


/**
 * A MSDF font texture asset, from a pregenerated msdf texture atlas (from msdf-bmfont-xml, for example).
 * This asset uses a signed distance field atlas to render characters as sprites at high res.
 */
class MsdfFontTextureAsset extends FontTextureAsset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url)
        this._positionOffsets = null
        this._xAdvances = null
    }

    /**
     * Generate the font metadata and texture from the given URL.
     * @param {*} params Additional params. Possible values are:
     *                      - jsonUrl: mandatory url for the font's json metadata (generated via msdf-bmfont-xml, for example)
     *                      - textureUrl: mandatory url for the font's texture atlas (generated via msdf-bmfont-xml, for example)
     *                      - missingCharPlaceholder (default='?'): character to use for missing characters.
     *                      
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(params)
    {
        return new Promise(async (resolve, reject) => {
            
            if (!params || !params.jsonUrl || !params.textureUrl) {
                return reject("When loading an msdf font you must provide params with a 'jsonUrl' and a 'textureUrl'!");
            }

            // TODO: allow atlas with multiple textures
            // TODO: infer textureUrl from json contents
            // TODO: infer jsonUrl from url

            let atlas_json = new JsonAsset(params.jsonUrl);
            let atlas_texture = new TextureAsset(params.textureUrl);
            await Promise.all([atlas_json.load(), atlas_texture.load()]);

            let atlas_metadata = atlas_json.data;
            atlas_texture.filter = TextureFilterModes.Linear;

            if (atlas_metadata.common.pages > 1) {
                throw new Error("Can't use MSDF font with several pages");
            }

            // set default missing char placeholder + store it
            this._placeholderChar = (params.missingCharPlaceholder || '?')[0];

            if (!atlas_metadata.info.charset.includes(this._placeholderChar)) {
                throw new Error("The atlas' charset doesn't include the given placeholder character");
            }

            this._fontName = atlas_metadata.info.face;
            this._fontSize = atlas_metadata.info.size;

            // set line height
            this._lineHeight = atlas_metadata.common.lineHeight;

            // dictionaries to store per-character data
            this._sourceRects = {};
            this._positionOffsets = {};
            this._xAdvances = {};
            this._kernings = {};

            for (const charData of atlas_metadata.chars) {
                let currChar = charData.char;
        
                let sourceRect = new Rectangle(charData.x, charData.y, charData.width, charData.height)
                this._sourceRects[currChar] = sourceRect;
                this._positionOffsets[currChar] = new Vector2(
                  charData.xoffset,
                  charData.yoffset
                )
                this._xAdvances[currChar] = charData.xadvance
            }

            this._texture = atlas_texture;
            this._notifyReady();
            resolve();
        });
    }

    /**
     * Get texture width.
     * @returns {Number} Texture width.
     */
    get width()
    {
        return this._texture._width;
    }

    /**
     * Get texture height.
     * @returns {Number} Texture height.
     */
    get height()
    {
        return this._texture._height;
    }

    /**
     * Get texture size as a vector.
     * @returns {Vector2} Texture size.
     */
    getSize()
    {
        return this._texture.getSize();
    }
    
    /** @inheritdoc */
    getPositionOffset (character) {
        return this._positionOffsets[character] || this._positionOffsets[this.placeholderCharacter];
    }

    /** @inheritdoc */
    getXAdvance (character) {
        return this._xAdvances[character] || this._xAdvances[this.placeholderCharacter];
    }

    /** @inheritdoc */
    destroy()
    {
        super.destroy();
        this._positionOffsets = null
        this._xAdvances = null
        this._kernings = null
    }
}

// export the asset type.
module.exports = MsdfFontTextureAsset;
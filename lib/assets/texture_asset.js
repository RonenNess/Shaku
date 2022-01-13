/**
 * Implement texture asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\texture_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");
const TextureFilterModes = require('../gfx/texture_filter_modes');
const TextureWrapModes = require('../gfx/texture_wrap_modes');
const Color = require('../utils/color');
const Vector2 = require("../utils/vector2");
const _logger = require('../logger.js').getLogger('assets');

// the webgl context to use
var gl = null;


/**
 * A loadable texture asset.
 * This asset type loads an image from URL or source, and turn it into a texture.
 */
class TextureAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._image = null;
        this._width = 0;
        this._height = 0;
        this._texture = null;
        this._filter = null;
        this._wrapMode = null;
        this._ctxForPixelData = null;
    }

    /**
     * Set the WebGL context.
     * @private
     */
    static _setWebGl(_gl)
    {
        gl = _gl;
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
     * @param {TextureFilterModes} value Filter mode to use or null to use default.
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
     * @param {TextureWrapModes} value Wrapping mode to use or null to use default.
     */
    set wrapMode(value)
    {
        this._wrapMode = value;
    }
    
    /**
     * Load the texture from it's image URL.
     * @param {*} params Optional additional params. Possible values are:
     *                      - generateMipMaps (default=false): should we generate mipmaps for this texture?
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(params)
    {
        // default params
        params = params || {};

        return new Promise((resolve, reject) => {

            if (!gl) {
                return reject("Can't load textures before initializing gfx manager!");
            }

            // create image to load
            const image = new Image();    
            image.onload = async () =>
            {
                try {
                    await this.create(image, params);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            };
            image.onerror = () => {
                reject("Failed to load texture image!");
            }

            // initiate image load
            image.src = this.url;
        });
    }

    /**
     * Create this texture as an empty render target.
     * @param {Number} width Texture width.
     * @param {Number} height Texture height.
     */
    createRenderTarget(width, height)
    {
        // create to render to
        const targetTextureWidth = width;
        const targetTextureHeight = height;
        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        
        {
            // create texture
            const level = 0;
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                            targetTextureWidth, targetTextureHeight, border,
                            format, type, data);
            
            // set default wrap and filter modes
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        // store texture
        this._width = width;
        this._height = height;
        this._texture = targetTexture;
    }

    /**
     * Create texture from loaded image instance.
     * @see TextureAsset.load for params.
     * @param {Image} image Image to create texture from. Image must be loaded!
     * @param {*} params Optional additional params. See load() for details.
     */
    fromImage(image, params)
    {
        if (image.width === 0) { 
            throw new Error("Image to build texture from must be loaded and have valid size!");
        }

        if (this.valid) {
            throw new Error("Texture asset is already initialized!");
        }
        
        // default params
        params = params || {};

        // store image
        this._image = image;
        this._width = image.width;
        this._height = image.height;

        // create texture
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // set texture
        const level = 0;
        const internalFormat = gl.RGBA;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (params.generateMipMaps) {
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                _logger.warn("Tried to generate MipMaps for a texture with size that is *not* a power of two. This might not work as expected.");
            } 
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        // default wrap and filters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        // success!
        this._texture = texture;
    }

    /**
     * Create the texture from an image.
     * @see TextureAsset.load for params.
     * @param {Image|String} source Image or Image source URL to create texture from.
     * @param {*} params Optional additional params. See load() for details.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source, params)
    {
        return new Promise(async (resolve, reject) => {

            if (typeof source === "string") {
                let img = new Image();
                img.onload = () => {
                    this.fromImage(source, params);
                    resolve();
                }
                img.src = source;
            }
            else {
                this.fromImage(source, params);
                resolve();
            }
        });
    }

    /**
     * Get raw image.
     * @returns {Image} Image instance.
     */
    get image()
    {
        return this._image;
    }

    /**
     * Get texture width.
     * @returns {Number} Texture width.
     */
    get width()
    {
        return this._width;
    }

    /**
     * Get texture height.
     * @returns {Number} Texture height.
     */
    get height()
    {
        return this._height;
    }

    /**
     * Get texture size as a vector.
     * @returns {Vector2} Texture size.
     */
    get size()
    {
        return new Vector2(this.width, this.height);
    }

    /**
     * Get texture instance for WebGL.
     */
    get texture()
    {
        return this._texture;
    }

    /**
     * Get pixel color from image.
     * @param {Number} x Pixel X value.
     * @param {Number} y Pixel Y value.
     * @returns {Color} Pixel color.
     */
    getPixel(x, y) 
    {
        if (!this._image) { 
            throw new Error("'getPixel()' only works on textures loaded from image!");
        }

        // build internal canvas and context to get pixel data
        if (!this._ctxForPixelData) {
            let canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            this._ctxForPixelData = canvas.getContext('2d');
        }

        // get pixel data
        let ctx = this._ctxForPixelData;
        ctx.drawImage(this._image, x, y, 1, 1, 0, 0, 1, 1);
        let pixelData = ctx.getImageData(0, 0, 1, 1).data;   
        return Color.fromBytesArray(pixelData);
    }

    /** @inheritdoc */
    get valid()
    {
        return Boolean(this._texture);
    }

    /** @inheritdoc */
    destroy()
    {
        gl.deleteTexture(this._texture);
        this._image = null;
        this._width = this._height = 0;
        this._ctxForPixelData = null;
        this._texture = null;
    }
}

// check if value is a power of 2
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}


// export the asset type.
module.exports = TextureAsset;
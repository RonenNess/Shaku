/**
 * Implement texture atlas asset type.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\assets\texture_atlas_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Utils = require("../utils");
const { Rectangle } = require("../utils");
const Vector2 = require("../utils/vector2");
const Asset = require("./asset");
const TextureAsset = require("./texture_asset");
const TextureInAtlasAsset = require("./texture_in_atlas_asset");
const _logger = require('../logger.js').getLogger('assets');

// the webgl context to use
var gl = null;


/**
 * A texture atlas we can build at runtime to combine together multiple textures.
 */
class TextureAtlasAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this.__textures = [];
        this.__sources = {};
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
     * Build the texture atlas.
     * @private
     * @param {Array<string>|Array<Image>} sources Source URLs or images to load into texture.
     * @param {Number=} maxWidth Optional texture atlas width limit.
     * @param {Number=} maxHeight Optional texture atlas height limit.
     * @param {Vector2=} extraMargins Extra pixels to add between textures.
     * @returns {Promise} Promise to resolve when done.
     */
    async _build(sources, maxWidth, maxHeight, extraMargins)
    {
        // sanity
        if (this.__textures.length) {
            throw new Error("Texture Atlas already built!");
        }

        // default margins
        extraMargins = extraMargins;

        // build atlas
        return new Promise(async (resolve, reject) => {

            // make sure all sources are valid loaded images
            sources = await loadAllSources(sources);            

            // make sure maxWidth and maxHeight are valid
            if (maxWidth > gl.MAX_TEXTURE_SIZE) { maxWidth = gl.MAX_TEXTURE_SIZE; }
            if (maxHeight > gl.MAX_TEXTURE_SIZE) { maxHeight = gl.MAX_TEXTURE_SIZE; }

            // build atlas textures while there are still sources
            while (sources && sources.length) {

                // arrange textures
                let arranged = arrangeTextures(sources, maxWidth, maxHeight, extraMargins);

                // build the texture atlas!
                let atlasTexture = new TextureAsset(`_atlas_${this.url}_${this.__textures.length}`);

                // first create a canvas and get its 2d context
                let canvas = document.createElement("canvas");
                canvas.width = arranged.width;
                canvas.height = arranged.height;
                let ctx = canvas.getContext("2d");
                
                // now draw the sources and fill the sources dictionary
                let textureInAtlasIndex = 0;
                for (let imageData of arranged.rectangles) {
                    ctx.drawImage(imageData.source, imageData.x, imageData.y);
                    let url = imageData.source.src;
                    let relativeUrl = url.substr(location.origin.length);
                    let internalUrl = atlasTexture.url + '_' + (textureInAtlasIndex++).toString() + '_' + url.replaceAll('/', '_').replaceAll(':', '');
                    let sourceRectangle = new Rectangle(imageData.x, imageData.y, imageData.width, imageData.height);
                    let textureInAtlas = new TextureInAtlasAsset(internalUrl, atlasTexture, sourceRectangle, this);
                    this.__sources[url] = this.__sources[relativeUrl] = this.__sources[relativeUrl.substr(1)] = textureInAtlas;
                }

                // convert to texture
                let atlasSrcUrl = canvas.toDataURL();
                let atlasImage = await loadImage(atlasSrcUrl);
                atlasTexture.fromImage(atlasImage);

                // push to textures list
                atlasTexture.utilized = arranged.utilized;
                this.__textures.push(atlasTexture);

                // get leftovers as next batch
                sources = arranged.leftovers;
            }

            // done!
            resolve();
        });
    }

    /**
     * Get a list with all textures in atlas.
     * @returns {Array<TextureAsset>} Textures in atlas.
     */
    get textures()
    {
        return this.__textures.slice(0);
    }

    /**
     * Get texture asset and source rectangle for a desired image URL.
     * @param {String} url URL to fetch texture and source from. Can be full URL, relative URL, or absolute URL starting from /.
     * @returns {TextureInAtlasAsset} Texture in atlas asset, or null if not found.
     */
    getTexture(url)
    {
        return this.__sources[url] || null;
    }

    /** @inheritdoc */
    get valid()
    {
        return Boolean(this.__textures.length);
    }

    /** @inheritdoc */
    destroy()
    {
        for (let texture of this.__textures) {
            texture.destroy();
        }
        this.__textures = [];
        this.__sources = {};
    }
}


/**
 * Efficiently arrange textures into minimal size area with maximum efficiency.
 * @private
 * @param {Array<Image>} sourceImages Array of images to pack.
 * @param {Number=} maxAtlasWidth Max width for result area.
 * @param {Number=} maxAtlasHeight Max height for result area.
 * @param {Vector2=} extraMargins Extra pixels to add between textures.
 */
function arrangeTextures(sourceImages, maxAtlasWidth, maxAtlasHeight, extraMargins) 
{
    // default max width and height
    maxAtlasWidth = maxAtlasWidth || gl.MAX_TEXTURE_SIZE;
    maxAtlasHeight = maxAtlasHeight || gl.MAX_TEXTURE_SIZE;

    // use the sorter algorithm
    let result = Utils.ItemsSorter.arrangeRectangles(sourceImages, (width) => {

        // make width a power of 2
        let power = 1;
        while(power < width) {
            power *= 2;
        }
        width = power;

        // return new width and make sure don't exceed max size
        return Math.min(width, maxAtlasWidth);

    }, extraMargins);

    // exceed max limit?
    if (result.height > maxAtlasHeight) {
        
        // adjust result height
        result.height = maxAtlasHeight;

        // remove all textures that are outside limits
        result.leftovers = [];
        for (let i = result.rectangles.length - 1; i >= 0; --i) {
            let currRect = result.rectangles[i];
            if (currRect.y + currRect.height > maxAtlasHeight) {
                result.rectangles.splice(i, 1);
                result.leftovers.push(currRect.source);
            }
        }
    }

    // return result
    return result;
}


/**
 * Load an image and return a promise.
 * @private
 */
function loadImage(path)
{
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'Anonymous' // to avoid CORS if used with Canvas
      img.src = path
      img.onload = () => {
        resolve(img)
      }
      img.onerror = e => {
        reject(e)
      }
    });
}


/**
 * Convert list of sources that are either Image instances or URL strings to fully loaded Image instances.
 * Wait for image loading if needed.
 */
async function loadAllSources(sources)
{
    return new Promise(async (resolve, reject) => {

        // make sure all sources are image instances
        let waitFor = [];
        let images = [];
        for (let i = 0; i < sources.length; ++i) {

            // get current image / source
            let curr = sources[i];

            // if its source url:
            if (typeof curr === 'string') {
                waitFor.push(loadImage(curr));
            }
            // if its an image instance:
            else if (curr instanceof Image) {

                // if ready, push as-is
                if (curr.width) {
                    images.push(curr);
                }
                // if not ready, push to wait list
                else {
                    waitFor.push(new Promise((resolve, reject) => {
                        curr.onload = resolve(curr);
                        curr.onerror = reject;
                    }));
                }
            }
            // unknown type
            else {
                reject(`Invalid source type: ${curr}. All sources must be either Image instances or URLs (string).`);
            }
        }

        // wait for all images that are loading
        for (let loadPromise of waitFor) {
            images.push(await loadPromise);
        }

        // return result
        resolve(images);
    });
}

// export the asset type.
module.exports = TextureAtlasAsset;
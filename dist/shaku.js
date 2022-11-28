(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Shaku = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * Assets base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';


/**
 * A loadable asset base class.
 * All asset types inherit from this.
 */
class Asset
{
    /**
     * Create the new asset.
     * @param {String} url Asset URL / identifier.
     */
    constructor(url)
    {
        this._url = url;
        this._waitingCallbacks = [];
    }

    /**
     * Register a method to be called when asset is ready.
     * If asset is already in ready state, will invoke immediately.
     * @param {Function} callback Callback to invoke when asset is ready.
     */
    onReady(callback)
    {
        if (this.valid || this._waitingCallbacks === null) {
            callback(this);
            return;
        }
        this._waitingCallbacks.push(callback);
    }

    /**
     * Return a promise to resolve when ready.
     * @returns {Promise} Promise to resolve when ready.
     */
    waitForReady()
    {
        return new Promise((resolve, reject) => {
            this.onReady(resolve);
        });
    }

    /**
     * Notify all waiting callbacks that this asset is ready.
     * @private
     */
    _notifyReady()
    {
        if (this._waitingCallbacks) {
            for (let i = 0; i < this._waitingCallbacks.length; ++i) {
                this._waitingCallbacks[i](this);
            }
            this._waitingCallbacks = null;
        }
    }

    /**
     * Get asset's URL.
     * @returns {String} Asset URL.
     */
    get url()
    {
        return this._url;
    }

    /**
     * Get if this asset is loaded and valid.
     * @returns {Boolean} True if asset is loaded and valid, false otherwise.
     */
    get valid()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Load the asset from it's URL.
     * @param {*} params Optional additional params.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(params)
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Create the asset from data source.
     * @param {*} source Data to create asset from.
     * @param {*} params Optional additional params.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source, params)
    {
        throw new Error("Not Supported for this asset type.");
    }

    /**
     * Destroy the asset, freeing any allocated resources in the process.
     */
    destroy()
    {
        throw new Error("Not Implemented!");
    }
}


// export the asset base class.
module.exports = Asset;
},{}],2:[function(require,module,exports){
/**
 * Implement the assets manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\assets.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const SoundAsset = require('../assets/sound_asset.js');
const IManager = require('../manager.js');
const BinaryAsset = require('./binary_asset.js');
const JsonAsset = require('./json_asset.js');
const TextureAsset = require('./texture_asset.js');
const FontTextureAsset = require('./font_texture_asset');
const MsdfFontTextureAsset = require('./msdf_font_texture_asset.js');
const Asset = require('./asset.js');
const _logger = require('../logger.js').getLogger('assets');


/**
 * Assets manager class.
 * Used to create, load and cache game assets, which includes textures, audio files, JSON objects, etc.
 * As a rule of thumb, all methods to load or create assets are async and return a promise.
 * 
 * To access the Assets manager you use `Shaku.assets`. 
 */
class Assets extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();
        this._loaded = null;
        this._waitingAssets = new Set();
		this._failedAssets = new Set();
        this._successfulLoadedAssetsCount = 0;

        /**
         * Optional URL root to prepend to all loaded assets URLs.
         * For example, if all your assets are under '/static/assets/', you can set this url as root and omit it when loading assets later.
         */
        this.root = '';

        /**
         * Optional suffix to add to all loaded assets URLs.
         * You can use this for anti-cache mechanism if you want to reload all assets. For example, you can set this value to "'?dt=' + Date.now()".
         */
        this.suffix = '';
    }

    /**
     * Wrap a URL with 'root' and 'suffix'.
     * @param {String} url Url to wrap.
     * @returns {String} Wrapped URL.
     */
    _wrapUrl(url)
    {
        if (!url) { return url; }
        return this.root + url + this.suffix;
    }

    /**
     * Get list of assets waiting to be loaded.
     * This list will be reset if you call clearCache().
     * @returns {Array<string>} URLs of assets waiting to be loaded.
     */
    get pendingAssets()
    {
        return Array.from(this._waitingAssets);
    }
	
    /**
     * Get list of assets that failed to load.
     * This list will be reset if you call clearCache().
     * @returns {Array<string>} URLs of assets that had error loading.
     */	
	get failedAssets()
	{
		return Array.from(this._failedAssets);
	}
	
	/**
	 * Return a promise that will be resolved only when all pending assets are loaded.
	 * If an asset fails, will reject.
     * @example
     * await Shaku.assets.waitForAll();
     * console.log("All assets are loaded!");
     * @returns {Promise} Promise to resolve when all assets are loaded, or reject if there are failed assets.
	 */
	waitForAll()
	{
		return new Promise((resolve, reject) => {
            
            _logger.debug("Waiting for all assets..");

            // check if all assets are loaded or if there are errors
			let checkAssets = () => {

                // got errors?
                if (this._failedAssets.size !== 0) {
                    _logger.warn("Done waiting for assets: had errors.");
                    return reject(this.failedAssets);
                }

                // all done?
				if (this._waitingAssets.size === 0) {
                    _logger.debug("Done waiting for assets: everything loaded successfully.");
					return resolve();
				}

                // try again in 1 ms
				setTimeout(checkAssets, 1);
			};

			checkAssets();
		});
	}

    /** 
     * @inheritdoc
     * @private
     */
    setup()
    {        
        return new Promise((resolve, reject) => {
            _logger.info("Setup assets manager..");
            this._loaded = {};
            resolve();
        });
    }

    /** 
     * @inheritdoc
     * @private
     */
    startFrame()
    {
    }

    /** 
     * @inheritdoc
     * @private
     */
    endFrame()
    {
    }

    /**
     * Get already-loaded asset from cache.
     * @private
     * @param {String} url Asset URL.
     * @param {type} type If provided will make sure asset is of this type. If asset found but have wrong type, will throw exception.
     * @returns Loaded asset or null if not found.
     */
    _getFromCache(url, type)
    {
        let cached = this._loaded[url] || null;
        if (cached && type) {
            if (!(cached instanceof type)) { 
                throw new Error(`Asset with URL '${url}' is already loaded, but has unexpected type (expecting ${type})!`); 
            }
        }
        return cached;
    }

    /**
     * Load an asset of a given type and add to cache when done.
     * @private
     * @param {Asset} newAsset Asset instance to load.
     * @param {*} params Optional loading params.
     */
    async _loadAndCacheAsset(newAsset, params)
    {
        // extract url and typename, and add to cache
        let url = newAsset.url;
        let typeName = newAsset.constructor.name;
        this._loaded[url] = newAsset;
        this._waitingAssets.add(url);

        // initiate loading
        return new Promise(async (resolve, reject) => {

            // load asset
            _logger.debug(`Load asset [${typeName}] from URL '${url}'.`);
            try {
                await newAsset.load(params);
            }
            catch (e) {
                _logger.warn(`Failed to load asset [${typeName}] from URL '${url}'.`);
                this._failedAssets.add(url);
                return reject(e);
            }

            // update waiting assets count
            this._waitingAssets.delete(url);

            // make sure valid
            if (!newAsset.valid) {
                _logger.warn(`Failed to load asset [${typeName}] from URL '${url}'.`);
                this._failedAssets.add(url);
                return reject("Loaded asset is not valid!");
            }

            _logger.debug(`Successfully loaded asset [${typeName}] from URL '${url}'.`);

            // resolve
            this._successfulLoadedAssetsCount++;
            resolve(newAsset);
        });
    }

    /**
     * Get asset directly from cache, synchronous and without a Promise.
     * @param {String} url Asset URL or name. 
     * @returns {Asset} Asset or null if not loaded.
     */
    getCached(url)
    {
        url = this._wrapUrl(url);
        return this._loaded[url] || null;
    }

    /**
     * Get / load asset of given type, and return a promise to be resolved when ready.
     * @private
     */
    _loadAssetType(url, typeClass, params)
    {
        // normalize URL
        url = this._wrapUrl(url);

        // try to get from cache
        let _asset = this._getFromCache(url, typeClass);
        
        // check if need to create new and load
        var needLoad = false;
        if (!_asset) {
            _asset = new typeClass(url);
            needLoad = true;
        }
        
        // create promise to load asset
        let promise = new Promise(async (resolve, reject) => {
            if (needLoad) {
                await this._loadAndCacheAsset(_asset, params);
            }
            _asset.onReady(() => {
                resolve(_asset);
            });
        });

        // return promise with asset attached to it
        promise.asset = _asset;
        return promise;
    }

    /**
     * Create and init asset of given class type.
     * @private
     */
    _createAsset(name, classType, initMethod)
    {
        // create asset
        name = this._wrapUrl(name);
        var _asset = new classType(name || generateRandomAssetName());

        // generate render target in async
        let promise = new Promise(async (resolve, reject) => {

            // make sure not in cache
            if (name && this._loaded[name]) { return reject(`Asset of type '${classType.name}' to create with URL '${name}' already exist in cache!`); }

            // create and return
            initMethod(_asset);
            if (name) { this._loaded[name] = _asset; }
            resolve(_asset);
        });

        // attach asset to promise
        promise.asset = _asset;
        return promise;
    }

    /**
     * Load a sound asset. If already loaded, will use cache.
     * @example
     * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
     * @param {String} url Asset URL.
     * @returns {Promise<SoundAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadSound(url)
    {
        return this._loadAssetType(url, SoundAsset, undefined);
    }

    /**
     * Load a texture asset. If already loaded, will use cache.
     * @example
     * let texture = await Shaku.assets.loadTexture("assets/my_texture.png", {generateMipMaps: false});
     * @param {String} url Asset URL.
     * @param {*=} params Optional params dictionary. See TextureAsset.load() for more details.
     * @returns {Promise<TextureAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadTexture(url, params)
    {
        return this._loadAssetType(url, TextureAsset, params);
    }

    /**
     * Create a render target texture asset. If already loaded, will use cache.
     * @example
     * let width = 512;
     * let height = 512;
     * let renderTarget = await Shaku.assets.createRenderTarget("optional_render_target_asset_id", width, height);
     * @param {String | null} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Number} width Texture width.
     * @param {Number} height Texture height.
     * @param {Number=} channels Texture channels count. Defaults to 4 (RGBA).
     * @returns {Promise<TextureAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    createRenderTarget(name, width, height, channels)
    {
        // make sure we have valid size
        if (!width || !height) {
            throw new Error("Missing or invalid size!");
        }

        // create asset and return promise
        return this._createAsset(name, TextureAsset, (asset) => {
            asset.createRenderTarget(width, height, channels);
        });
    }
    
    /**
     * Load a font texture asset. If already loaded, will use cache.
     * @example
     * let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});
     * @param {String} url Asset URL.
     * @param {*} params Optional params dictionary. See FontTextureAsset.load() for more details.
     * @returns {Promise<FontTextureAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadFontTexture(url, params)
    {
        return this._loadAssetType(url, FontTextureAsset, params);
    }
    
    /**
     * Load a MSDF font texture asset. If already loaded, will use cache.
     * @example
     * let fontTexture = await Shaku.assets.loadMsdfFontTexture('DejaVuSansMono.font', {jsonUrl: 'assets/DejaVuSansMono.json', textureUrl: 'assets/DejaVuSansMono.png'});
     * @param {String} url Asset URL.
     * @param {*=} params Optional params dictionary. See MsdfFontTextureAsset.load() for more details.
     * @returns {Promise<MsdfFontTextureAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadMsdfFontTexture(url, params)
    {
        return this._loadAssetType(url, MsdfFontTextureAsset, params);
    }
    
    /**
     * Load a json asset. If already loaded, will use cache.
     * @example
     * let jsonData = await Shaku.assets.loadJson('assets/my_json_data.json');
     * console.log(jsonData.data);
     * @param {String} url Asset URL.
     * @returns {Promise<JsonAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadJson(url)
    {
        return this._loadAssetType(url, JsonAsset);
    }
 
    /**
     * Create a new json asset. If already exist, will reject promise.
     * @example
     * let jsonData = await Shaku.assets.createJson('optional_json_data_id', {"foo": "bar"});
     * // you can now load this asset from anywhere in your code using 'optional_json_data_id' as url
     * @param {String} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Object|String} data Optional starting data.
     * @returns {Promise<JsonAsset>} promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
     */
    createJson(name, data)
    {
        // make sure we have valid data
        if (!data) {
            return reject("Missing or invalid data!");
        }

        // create asset and return promise
        return this._createAsset(name, JsonAsset, (asset) => {
            asset.create(data);
        });
    }

    /**
     * Load a binary data asset. If already loaded, will use cache.
     * @example
     * let binData = await Shaku.assets.loadBinary('assets/my_bin_data.dat');
     * console.log(binData.data);
     * @param {String} url Asset URL.
     * @returns {Promise<BinaryAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadBinary(url)
    {
        return this._loadAssetType(url, BinaryAsset);
    }

    /**
     * Create a new binary asset. If already exist, will reject promise.
     * @example
     * let binData = await Shaku.assets.createBinary('optional_bin_data_id', [1,2,3,4]);
     * // you can now load this asset from anywhere in your code using 'optional_bin_data_id' as url
     * @param {String} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Array<Number>|Uint8Array} data Binary data to set.
     * @returns {Promise<BinaryAsset>} promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
     */
    createBinary(name, data)
    {
        // make sure we have valid data
        if (!data) {
            return reject("Missing or invalid data!");
        }

        // create asset and return promise
        return this._createAsset(name, BinaryAsset, (asset) => {
            asset.create(data);
        });
    }

    /**
     * Destroy and free asset from cache.
     * @example
     * Shaku.assets.free("my_asset_url");
     * @param {String} url Asset URL to free.
     */
    free(url)
    {
        url = this._wrapUrl(url);
        let asset = this._loaded[url];
        if (asset) {
            asset.destroy();
            delete this._loaded[url];
        }
    }
	
	/**
	 * Free all loaded assets from cache.
     * @example
     * Shaku.assets.clearCache();
	 */
	clearCache()
	{
		for (let key in this._loaded) {
            this._loaded[key].destroy();
        }
        this._loaded = {};
        this._waitingAssets = new Set();
		this._failedAssets = new Set();
	}

    /** 
     * @inheritdoc
     * @private
     */
    destroy()
    {
		this.clearCache();
    }
}

// generate a random asset URL, for when creating assets that are outside of cache.
var _nextRandomAssetId = 0;
function generateRandomAssetName()
{
    return "_runtime_asset_" + (_nextRandomAssetId++) + "_";
}
 
// export assets manager
module.exports = new Assets();
},{"../assets/sound_asset.js":8,"../logger.js":45,"../manager.js":46,"./asset.js":1,"./binary_asset.js":3,"./font_texture_asset":4,"./json_asset.js":6,"./msdf_font_texture_asset.js":7,"./texture_asset.js":9}],3:[function(require,module,exports){
/**
 * Implement binary data asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\binary_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");


/**
 * A loadable binary data asset.
 * This asset type loads array of bytes from a remote file.
 */
class BinaryAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._data = null;
    }

    /**
     * Load the binary data from the asset URL.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load()
    {
        return new Promise((resolve, reject) => {

            var request = new XMLHttpRequest();
            request.open('GET', this.url, true);
            request.responseType = 'arraybuffer';     

            // on load, validate audio content
            request.onload = () => 
            {
                if (request.readyState == 4) {
                    if (request.response) {
                        this._data = new Uint8Array(request.response);
                        this._notifyReady();
                        resolve();
                    }
                    else {
                        reject(request.statusText);
                    }
                }
            }

            // on load error, reject
            request.onerror = (e) => {
                reject(e);
            }

            // initiate request
            request.send();
        });
    }

    /**
     * Create the binary data asset from array or Uint8Array.
     * @param {Array<Number>|Uint8Array} source Data to create asset from.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source)
    {
        return new Promise((resolve, reject) => {
            if (source instanceof Array) { source = new Uint8Array(source); }
            if (!(source instanceof Uint8Array)) { return reject("Binary asset source must be of type 'Uint8Array'!"); }
            this._data = source;
            this._notifyReady();
            resolve();
        });
    }

    /** @inheritdoc */
    get valid()
    {
        return Boolean(this._data);
    }

    /** @inheritdoc */
    destroy()
    {
        this._data = null;
    }

    /**
     * Get binary data.
     * @returns {Uint8Array} Data as bytes array.
     */
    get data()
    {
        return this._data;
    }

    /**
     * Convert and return data as string.
     * @returns {String} Data converted to string.
     */
    string()
    {
        return (new TextDecoder()).decode(this._data);
    }
}


// export the asset type.
module.exports = BinaryAsset;
},{"./asset":1}],4:[function(require,module,exports){
/**
 * Implement a font texture asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\font_texture_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");
const Vector2 = require("../utils/vector2");
const Rectangle = require("../utils/rectangle");
const TextureAsset = require("./texture_asset");


/**
 * A font texture asset, dynamically generated from loaded font and canvas.
 * This asset type creates an atlas of all the font's characters as textures, so we can later render them as sprites.
 */
class FontTextureAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._fontName = null;
        this._fontSize = null;
        this._placeholderChar = null;
        this._sourceRects = null;
        this._texture = null;
        this._lineHeight = 0;
    }

    /**
     * Get line height.
     */
    get lineHeight()
    {
        return this._lineHeight;
    }

    /**
     * Get font name.
     */
    get fontName()
    {
        return this._fontName;
    }

    /**
     * Get font size.
     */
    get fontSize()
    {
        return this._fontSize;
    }

    /**
     * Get placeholder character.
     */
    get placeholderCharacter()
    {
        return this._placeholderChar;
    }

    /**
     * Get the texture.
     */
    get texture()
    {
        return this._texture;
    }

    /**
     * Generate the font texture from a font found in given URL.
     * @param {*} params Additional params. Possible values are:
     *                      - fontName: mandatory font name. on some browsers if the font name does not match the font you actually load via the URL, it will not be loaded properly.
     *                      - missingCharPlaceholder (default='?'): character to use for missing characters.
     *                      - smoothFont (default=true): if true, will set font to smooth mode.
     *                      - fontSize (default=52): font size in texture. larget font size will take more memory, but allow for sharper text rendering in larger scales.
     *                      - enforceTexturePowerOfTwo (default=true): if true, will force texture size to be power of two.
     *                      - maxTextureWidth (default=1024): max texture width.
     *                      - charactersSet (default=FontTextureAsset.defaultCharactersSet): which characters to set in the texture.
     *                      - extraPadding (default=0,0): Optional extra padding to add around characters in texture.
     *                      - sourceRectOffsetAdjustment (default=0,0): Optional extra offset in characters source rectangles. Use this for fonts that are too low / height and bleed into other characters source rectangles.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load(params)
    {
        return new Promise(async (resolve, reject) => {
            
            if (!params || !params.fontName) {
                return reject("When loading font texture you must provide params with a 'fontName' value!");
            }
        
            // set default missing char placeholder + store it
            this._placeholderChar = (params.missingCharPlaceholder || '?')[0];
    
            // set smoothing mode
            let smooth = params.smoothFont === undefined ? true : params.smoothFont;

            // set extra margins
            let extraPadding = params.extraPadding || {x: 0, y: 0};
    
            // set max texture size
            let maxTextureWidth = params.maxTextureWidth || 1024;
    
            // default chars set
            let charsSet = params.charactersSet || FontTextureAsset.defaultCharactersSet;
    
            // make sure charSet got the placeholder char
            if (charsSet.indexOf(this._placeholderChar) === -1) {
                charsSet += this._placeholderChar;
            }
    
            // load font
            let fontFace = new FontFace(params.fontName, `url(${this.url})`);
            await fontFace.load();
            document.fonts.add(fontFace);
            
            // store font name and size
            this._fontName = params.fontName;
            this._fontSize = params.fontSize || 52;
            let margin = {x: 10, y: 5};

            // measure font height
            let fontFullName = this.fontSize.toString() + 'px ' + this.fontName;
            let fontHeight = measureTextHeight(this.fontName, this.fontSize, undefined, extraPadding.y);
            let fontWidth = measureTextWidth(this.fontName, this.fontSize, undefined, extraPadding.x);

            // set line height
            this._lineHeight = fontHeight;

            // calc estimated size of a single character in texture
            let estimatedCharSizeInTexture = new Vector2(fontWidth + margin.x * 2, fontHeight + margin.y * 2);

            // calc texture size
            let charsPerRow = Math.floor(maxTextureWidth / estimatedCharSizeInTexture.x);
            let textureWidth = Math.min(charsSet.length * estimatedCharSizeInTexture.x, maxTextureWidth);
            let textureHeight = Math.ceil(charsSet.length / charsPerRow) * (estimatedCharSizeInTexture.y);

            // make width and height powers of two
            if (params.enforceTexturePowerOfTwo || params.enforceTexturePowerOfTwo === undefined) {
                textureWidth = makePowerTwo(textureWidth);
                textureHeight = makePowerTwo(textureHeight);
            }

            // a dictionary to store the source rect of every character
            this._sourceRects = {};

            // create a canvas to generate the texture on
            let canvas = document.createElement('canvas');
            canvas.width = textureWidth;
            canvas.height = textureHeight;
            if (!smooth) {
                canvas.style.webkitFontSmoothing = "none";
                canvas.style.fontSmooth = "never";
                canvas.style.textRendering = "geometricPrecision";
            }
            let ctx = canvas.getContext('2d');
            ctx.textBaseline =  "bottom"

            // set font and white color
            ctx.font = fontFullName;
            ctx.fillStyle = '#ffffffff';
            ctx.imageSmoothingEnabled = smooth;

            // draw the font texture
            let x = 0; let y = 0;
            for (let i = 0; i < charsSet.length; ++i) {
                
                // get actual width of current character
                let currChar = charsSet[i];
                let currCharWidth = Math.ceil(ctx.measureText(currChar).width + extraPadding.x);

                // check if need to break line down in texture
                if (x + currCharWidth > textureWidth) {
                    y += Math.round(fontHeight + margin.y);
                    x = 0;
                }

                // calc source rect
                const offsetAdjustment = params.sourceRectOffsetAdjustment || {x: 0, y: 0};
                let sourceRect = new Rectangle(x + offsetAdjustment.x, y + offsetAdjustment.y, currCharWidth, fontHeight);
                this._sourceRects[currChar] = sourceRect;

                // draw character
                ctx.fillText(currChar, x, y + fontHeight);

                // move to next spot in texture
                x += Math.round(currCharWidth + margin.x);
            }
                    
            // do threshold effect
            if (!smooth) {
                let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                let data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i+3] > 0 && (data[i+3] < 255 || data[i] < 255 || data[i+1] < 255 || data[i+2] < 255)) {
                        data[i + 3] = 0;
                    }
                }
                ctx.putImageData(imageData, 0, 0);
            }

            // convert canvas to image
            let img = new Image();
            img.src = canvas.toDataURL("image/png");
            img.onload = () => {

                // convert image to texture
                let texture = new TextureAsset(this.url + '__font-texture');
                texture.fromImage(img);

                // success!
                this._texture = texture;
                this._notifyReady();
                resolve();

            };
        });
    }

    /** @inheritdoc */
    get valid()
    {
        return Boolean(this._texture);
    }
    
    /**
     * Get the source rectangle for a given character in texture.
     * @param {Character} character Character to get source rect for.
     * @returns {Rectangle} Source rectangle for character.
     */
    getSourceRect(character)
    {
        return this._sourceRects[character] || this._sourceRects[this.placeholderCharacter];
    }

    /**
     * When drawing the character, get the offset to add to the cursor.
     * @param {Character} character Character to get the offset for.
     * @returns {Vector2} Offset to add to the cursor before drawing the character.
     */
    getPositionOffset (character) {
        return Vector2.zero;
    }

    /**
     * Get how much to advance the cursor when drawing this character.
     * @param {Character} character Character to get the advance for.
     * @returns {Number} Distance to move the cursor after drawing the character.
     */
    getXAdvance (character) {
        return this.getSourceRect(character).width;
    }

    /** @inheritdoc */
    destroy()
    {
        if (this._texture) this._texture.destroy();
        this._fontName = null;
        this._fontSize = null;
        this._placeholderChar = null;
        this._sourceRects = null;
        this._texture = null;
        this._lineHeight = 0;
    }
}

// default ascii characters to generate font textures for
FontTextureAsset.defaultCharactersSet = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾";

// return the closest power-of-two value to a given number
function makePowerTwo(val)
{
    let ret = 2;
    while (ret < val) {
        if (ret >= val) { return ret; }
        ret = ret * 2;
    }
    return ret;
}


/**
 * Measure font's actual height.
 */
function measureTextHeight(fontFamily, fontSize, char, extraHeight) 
{
    let text = document.createElement('pre');
    text.style.fontFamily = fontFamily;
    text.style.fontSize = fontSize + "px";
    text.style.paddingBottom = text.style.paddingLeft = text.style.paddingTop = text.style.paddingRight = '0px';
    text.style.marginBottom = text.style.marginLeft = text.style.marginTop = text.style.marginRight = '0px';
    text.textContent = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
    document.body.appendChild(text);
    let result = text.getBoundingClientRect().height + (extraHeight || 0);
    document.body.removeChild(text);
    return Math.ceil(result);
};

/**
 * Measure font's actual width.
 */
function measureTextWidth(fontFamily, fontSize, char, extraWidth) 
{
    // special case to ignore \r and \n when measuring text width
    if (char === '\n' || char === '\r') { return 0; }

    // measure character width
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    context.font = fontSize.toString() + 'px ' + fontFamily;
    let result = 0;
    let text = char || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
    for (let i = 0; i < text.length; ++i) {
        result = Math.max(result, context.measureText(text[i]).width + (extraWidth || 0));
    }
    return Math.ceil(result);
};

// export the asset type.
module.exports = FontTextureAsset;
},{"../utils/rectangle":61,"../utils/vector2":67,"./asset":1,"./texture_asset":9}],5:[function(require,module,exports){
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
 module.exports = require('./assets');
},{"./assets":2}],6:[function(require,module,exports){
/**
 * Implement json asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\json_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");


/**
 * A loadable json asset.
 * This asset type loads JSON from a remote file.
 */
class JsonAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._data = null;
    }

    /**
     * Load the JSON data from the asset URL.
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load()
    {
        return new Promise((resolve, reject) => {

            var request = new XMLHttpRequest();
            request.open('GET', this.url, true);
            request.responseType = 'json';     

            // on load, validate audio content
            request.onload = () => 
            {
                if (request.readyState == 4) {
                    if (request.response) {
                        this._data = request.response;
                        this._notifyReady();
                        resolve();
                    }
                    else {
                        if (request.status === 200) {
                            reject("Response is not a valid JSON!");
                        }
                        else {
                            reject(request.statusText);
                        }
                    }
                }
            }

            // on load error, reject
            request.onerror = (e) => {
                reject(e);
            }

            // initiate request
            request.send();
        });
    }

    /**
     * Create the JSON data asset from object or string.
     * @param {Object|String} source Data to create asset from.
     * @returns {Promise} Promise to resolve when asset is ready.
     */
    create(source)
    {
        return new Promise((resolve, reject) => {

            // make sure data is a valid json + clone it
            try
            {
                if (source) {
                    if (typeof source === 'string') {
                        source = JSON.parse(source);
                    }
                    else {
                        source = JSON.parse(JSON.stringify(source));
                    }
                }
                else {
                    source = {};
                }
            }
            catch (e)
            {
                return reject("Data is not a valid JSON serializable object!");
            }

            // store data and resolve
            this._data = source;
            this._notifyReady();
            resolve();
        });
    }

    /**
     * Get json data.
     * @returns {*} Data as dictionary.
     */
    get data()
    {
        return this._data;
    }

    /** @inheritdoc */
    get valid()
    {
        return Boolean(this._data);
    }
    
    /** @inheritdoc */
    destroy()
    {
        this._data = null;
    }
}


// export the asset type.
module.exports = JsonAsset;
},{"./asset":1}],7:[function(require,module,exports){
/**
 * Implement a MSDF font texture asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\msdf_font_texture_asset.js
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
},{"../gfx/texture_filter_modes":37,"../utils/rectangle":61,"../utils/vector2":67,"./font_texture_asset":4,"./json_asset":6,"./texture_asset":9}],8:[function(require,module,exports){
/**
 * Implement sound asset type.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\assets\sound_asset.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Asset = require("./asset");

 
/**
 * A loadable sound asset.
 * This is the asset type you use to play sounds.
 */
class SoundAsset extends Asset
{
    /** @inheritdoc */
    constructor(url)
    {
        super(url);
        this._valid = false;
    }


    /**
     * Load the sound asset from its URL.
     * Note that loading sounds isn't actually necessary to play sounds, this method merely pre-load the asset (so first time we play
     * the sound would be immediate and not delayed) and validate the data is valid. 
     * @returns {Promise} Promise to resolve when fully loaded.
     */
    load()
    {
        // for audio files we force preload and validation of the audio file.
        // note: we can't use the Audio object as it won't work without page interaction.
        return new Promise((resolve, reject) => {

            // create request to load audio file
            let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var request = new XMLHttpRequest();
            request.open('GET', this.url, true);
            request.responseType = 'arraybuffer';     

            // on load, validate audio content
            request.onload = () => 
            {
                var audioData = request.response;
                this._valid = true; // <-- good enough for now, as decodeAudio won't work before user's input
                this._notifyReady();
                audioCtx.decodeAudioData(audioData, function(buffer) {
                    resolve();
                },
                (e) => { 
                    reject(e.err); 
                });
            }

            // on load error, reject
            request.onerror = (e) => {
                reject(e);
            }

            // initiate request
            request.send();
        });
    }

    /** @inheritdoc */
    get valid()
    {
        return this._valid;
    }
    
    /** @inheritdoc */
    destroy()
    {
        this._valid = false;
    }
}

 
// export the asset type.
module.exports = SoundAsset;
},{"./asset":1}],9:[function(require,module,exports){
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
const {TextureFilterMode, TextureFilterModes} = require('../gfx/texture_filter_modes');
const {TextureWrapMode, TextureWrapModes} = require('../gfx/texture_wrap_modes');
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
     * Load the texture from it's image URL.
     * @param {*} params Optional additional params. Possible values are:
     *                      - generateMipMaps (default=false): should we generate mipmaps for this texture?
     *                      - crossOrigin (default=undefined): if set, will set the crossOrigin property with this value.
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
            if (params.crossOrigin !== undefined) {
                image.crossOrigin = params.crossOrigin;
            }
            image.onload = async () =>
            {
                try {
                    await this.create(image, params);
                    this._notifyReady();
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
     * @param {Number} channels Texture channels count. Defaults to 4 (RGBA).
     */
    createRenderTarget(width, height, channels)
    {
        // create to render to
        const targetTextureWidth = width;
        const targetTextureHeight = height;
        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        
        // calculate format
        var _format = gl.RGBA;
        if (channels !== undefined) {
            switch (channels) {
                case 1:
                    _format = gl.LUMINANCE;
                    break;
                case 3:
                    _format = gl.RGB;
                    break;
                case 4:
                    _format = gl.RGBA;
                    break;
                default:
                    throw new Error("Unknown render target format!");
            }
        }

        {
            // create texture
            const level = 0;
            const internalFormat = _format;
            const border = 0;
            const format = _format;
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
        this._notifyReady();
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
        this._notifyReady();
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
                    this._notifyReady();
                    resolve();
                }
                if (params.crossOrigin !== undefined) {
                    img.crossOrigin = params.crossOrigin;
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
},{"../gfx/texture_filter_modes":37,"../gfx/texture_wrap_modes":38,"../logger.js":45,"../utils/color":54,"../utils/vector2":67,"./asset":1}],10:[function(require,module,exports){
/**
 * Implement the collision manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\collision.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const IManager = require('../manager.js');
const Vector2 = require('../utils/vector2.js');
const CollisionWorld = require('./collision_world.js');
const CollisionResolver = require('./resolver');
const CircleShape = require('./shapes/circle.js');
const PointShape = require('./shapes/point.js');
const RectangleShape = require('./shapes/rectangle.js');
const ResolverImp = require('./resolvers_imp');
const LinesShape = require('./shapes/lines.js');
const TilemapShape = require('./shapes/tilemap.js');
const _logger = require('../logger.js').getLogger('collision');


/**
 * Collision is the collision manager. 
 * It provides basic 2d collision detection functionality.
 * Note: this is *not* a physics engine, its only for detection and objects picking.
 * 
 * To access the Collision manager you use `Shaku.collision`. 
 */
class Collision extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();

        /**
         * The collision resolver we use to detect collision between different shapes. 
         * You can use this object directly without creating a collision world, if you just need to test collision between shapes.
         */
        this.resolver = new CollisionResolver();
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    setup()
    {        
        return new Promise((resolve, reject) => {    
            _logger.info("Setup collision manager..");

            this.resolver._init();
            this.resolver.setHandler("point", "point", ResolverImp.pointPoint);
            this.resolver.setHandler("point", "circle", ResolverImp.pointCircle);
            this.resolver.setHandler("point", "rect", ResolverImp.pointRectangle);
            this.resolver.setHandler("point", "lines", ResolverImp.pointLine);
            this.resolver.setHandler("point", "tilemap", ResolverImp.pointTilemap);

            this.resolver.setHandler("circle", "circle", ResolverImp.circleCircle);
            this.resolver.setHandler("circle", "rect", ResolverImp.circleRectangle);
            this.resolver.setHandler("circle", "lines", ResolverImp.circleLine);
            this.resolver.setHandler("circle", "tilemap", ResolverImp.circleTilemap);

            this.resolver.setHandler("rect", "rect", ResolverImp.rectangleRectangle);
            this.resolver.setHandler("rect", "lines", ResolverImp.rectangleLine);
            this.resolver.setHandler("rect", "tilemap", ResolverImp.rectangleTilemap);

            this.resolver.setHandler("lines", "lines", ResolverImp.lineLine);
            this.resolver.setHandler("lines", "tilemap", ResolverImp.lineTilemap);

            resolve();
        });
    }

    /**
     * Create a new collision world object.
     * @param {Number|Vector2} gridCellSize Collision world grid cell size.
     * @returns {CollisionWorld} Newly created collision world.
     */
    createWorld(gridCellSize)
    {
        return new CollisionWorld(this.resolver, gridCellSize);
    }

    /**
     * Get the collision reactanle shape class.
     */
    get RectangleShape()
    {
        return RectangleShape
    }

    /**
     * Get the collision point shape class.
     */
    get PointShape()
    {
        return PointShape;
    }

    /**
     * Get the collision circle shape class.
     */
    get CircleShape()
    {
        return CircleShape;
    }

    /**
     * Get the collision lines shape class.
     */
    get LinesShape()
    {
        return LinesShape;
    }

    /**
     * Get the tilemap collision shape class.
     */
    get TilemapShape()
    {
        return TilemapShape;
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    startFrame()
    {
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    endFrame()
    {
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    destroy()
    {
    }    
}

// export main object
module.exports = new Collision();
},{"../logger.js":45,"../manager.js":46,"../utils/vector2.js":67,"./collision_world.js":11,"./resolver":13,"./resolvers_imp":14,"./shapes/circle.js":16,"./shapes/lines.js":17,"./shapes/point.js":18,"./shapes/rectangle.js":19,"./shapes/tilemap.js":21}],11:[function(require,module,exports){
/**
 * Implement the collision manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\collision_world.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Color = require("../utils/color");
const Vector2 = require("../utils/vector2");
const Circle = require("../utils/circle");
const CollisionTestResult = require("./result");
const CollisionShape = require("./shapes/shape");
const gfx = require('./../gfx');
const Rectangle = require("../utils/rectangle");
const CollisionResolver = require("./resolver");
const PointShape = require("./shapes/point");
const CircleShape = require("./shapes/circle");
const _logger = require('../logger.js').getLogger('collision');


/**
 * A collision world is a set of collision shapes that interact with each other.
 * You can use different collision worlds to represent different levels or different parts of your game world.
 */
class CollisionWorld
{
    /**
     * Create the collision world.
     * @param {CollisionResolver} resolver Collision resolver to use for this world.
     * @param {Number|Vector2} gridCellSize For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size.
     */
    constructor(resolver, gridCellSize)
    {
        /**
         * Collision resolver used in this collision world.
         * By default, will inherit the collision manager default resolver.
         */
        this.resolver = resolver;

        // set grid cell size
        if (typeof gridCellSize === 'undefined') { gridCellSize = new Vector2(512, 512); }
        else if (typeof gridCellSize === 'number') { gridCellSize = new Vector2(gridCellSize, gridCellSize); }
        else { gridCellSize = gridCellSize.clone(); }
        this._gridCellSize = gridCellSize;

        // create collision grid
        this._grid = {};

        // shapes that need updates and grid chunks to delete
        this._shapesToUpdate = new Set();
        this._cellsToDelete = new Set();

        // reset stats data
        this.resetStats();
    }

    /**
     * Reset stats.
     */
    resetStats()
    {
        this._stats = {
            updatedShapes: 0,
            addedShapes: 0,
            deletedGridCells: 0,
            createdGridCell: 0,
            broadPhaseShapesChecksPrePredicate: 0,
            broadPhaseShapesChecksPostPredicate: 0,
            broadPhaseCalls: 0,
            collisionChecks: 0,
            collisionMatches: 0
        }
    }

    /**
     * Get current stats.
     * @returns {*} Dictionary with the following stats:
     *  updatedShapes: number of times we updated or added new shapes.
     *  addedShapes: number of new shapes added.
     *  deletedGridCells: grid cells that got deleted after they were empty.
     *  createdGridCell: new grid cells created.
     *  broadPhaseShapesChecksPrePredicate: how many shapes were tested in a broadphase check, before the predicate method was called.
     *  broadPhaseShapesChecksPostPredicate: how many shapes were tested in a broadphase check, after the predicate method was called.
     *  broadPhaseCalls: how many broadphase calls were made
     *  collisionChecks: how many shape-vs-shape collision checks were actually made.
     *  collisionMatches: how many collision checks were positive.
     */
    get stats()
    {
        return this._stats;
    }

    /**
     * Do collision world updates, if we have any.
     * @private
     */
    _performUpdates()
    {
        // delete empty grid cells
        if (this._cellsToDelete.size > 0) {
            this._stats.deletedGridCells += this._cellsToDelete.size;
            for (let key of this._cellsToDelete) {
                if (this._grid[key] && this._grid[key].size === 0) { 
                    delete this._grid[key];
                }
            }
            this._cellsToDelete.clear();
        }

        // update all shapes
        if (this._shapesToUpdate.size > 0) {
            for (let shape of this._shapesToUpdate) {
                this._updateShape(shape);
            }
            this._shapesToUpdate.clear();
        }
    }

    /**
     * Get or create cell.
     * @private
     */
    _getCell(i, j)
    {
        let key = i + ',' + j;
        let ret = this._grid[key];
        if (!ret) { 
            this._stats.createdGridCells++;
            this._grid[key] = ret = new Set(); 
        }
        return ret;
    }

    /**
     * Update a shape in collision world after it moved or changed.
     * @private
     */
    _updateShape(shape)
    {
        // sanity - if no longer in this collision world, skip
        if (shape._world !== this) {
            return;
        }

        // update shapes
        this._stats.updatedShapes++;

        // get new range
        let bb = shape._getBoundingBox();
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = Math.ceil(bb.right / this._gridCellSize.x);
        let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);

        // change existing grid cells
        if (shape._worldRange)
        {
            // range is the same? skip
            if (shape._worldRange[0] === minx && 
                shape._worldRange[1] === miny &&
                shape._worldRange[2] === maxx && 
                shape._worldRange[3] === maxy) {
                return;
            }

            // get old range
            let ominx = shape._worldRange[0];
            let ominy = shape._worldRange[1];
            let omaxx = shape._worldRange[2];
            let omaxy = shape._worldRange[3];

            // first remove from old chunks we don't need
            for (let i = ominx; i < omaxx; ++i) {
                for (let j = ominy; j < omaxy; ++j) {

                    // if also in new range, don't remove
                    if (i >= minx && i < maxx && j >= miny && j < maxy) {
                        continue;
                    }

                    // remove from cell
                    let key = i + ',' + j;
                    let currSet = this._grid[key];
                    if (currSet) {
                        currSet.delete(shape);
                        if (currSet.size === 0) {
                            this._cellsToDelete.add(key);
                        }
                    }
                }
            }
            
            // now add to new cells
            for (let i = minx; i < maxx; ++i) {
                for (let j = miny; j < maxy; ++j) {

                    // if was in old range, don't add
                    if (i >= ominx && i < omaxx && j >= ominy && j < omaxy) {
                        continue;
                    }

                    // add to new cell
                    let currSet = this._getCell(i, j);
                    currSet.add(shape);
                }
            }
        }
        // first-time adding to grid
        else {
            this._stats.addedShapes++;
            for (let i = minx; i < maxx; ++i) {
                for (let j = miny; j < maxy; ++j) {
                    let currSet = this._getCell(i, j);
                    currSet.add(shape);
                }
            }
        }

        // update new range
        shape._worldRange = [minx, miny, maxx, maxy];
    }

    /**
     * Request update for this shape on next updates call.
     * @private
     */
    _queueUpdate(shape)
    {
        this._shapesToUpdate.add(shape);
    }

    /**
     * Iterate all shapes in world.
     * @param {Function} callback Callback to invoke on all shapes. Return false to break iteration.
     */
    iterateShapes(callback)
    {
        for (let key in this._grid) {
            let cell = this._grid[key];
            if (cell) {
                for (let shape of cell)
                {
                    if (callback(shape) === false) {
                        return;
                    }
                }
            }
        }
    }

    /**
     * Add a collision shape to this world.
     * @param {CollisionShape} shape Shape to add.
     */
    addShape(shape)
    {
        // add shape
        shape._setParent(this);

        // add shape to grid
        this._updateShape(shape);

        // do general updates
        this._performUpdates();
    }

    /**
     * Remove a collision shape from this world.
     * @param {CollisionShape} shape Shape to remove.
     */
    removeShape(shape)
    {
        // sanity
        if (shape._world !== this) {
            _logger.warn("Shape to remove is not in this collision world!");
            return;
        }

        // remove from grid
        if (shape._worldRange) {
            let minx = shape._worldRange[0];
            let miny = shape._worldRange[1];
            let maxx = shape._worldRange[2];
            let maxy = shape._worldRange[3];
            for (let i = minx; i < maxx; ++i) {
                for (let j = miny; j < maxy; ++j) {
                    let key = i + ',' + j;
                    let currSet = this._grid[key];
                    if (currSet) {
                        currSet.delete(shape);
                        if (currSet.size === 0) {
                            this._cellsToDelete.add(key);
                        }
                    }
                }
            }
        }

        // remove shape
        this._shapesToUpdate.delete(shape);
        shape._setParent(null);

        // do general updates
        this._performUpdates();
    }

    /**
     * Iterate shapes that match broad phase test.
     * @private
     * @param {CollisionShape} shape Shape to test.
     * @param {Function} handler Method to run on all shapes in phase. Return true to continue iteration, false to break.
     * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with.
     */
    _iterateBroadPhase(shape, handler, mask, predicate)
    {
        // get grid range
        let bb = shape._getBoundingBox();
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = Math.ceil(bb.right / this._gridCellSize.x);
        let maxy = Math.ceil(bb.bottom / this._gridCellSize.y);

        // update stats
        this._stats.broadPhaseCalls++;

        // shapes we checked
        let checked = new Set();

        // iterate options
        for (let i = minx; i < maxx; ++i) {
            for (let j = miny; j < maxy; ++j) {

                // get current grid chunk
                let key = i + ',' + j;
                let currSet = this._grid[key];

                // iterate shapes in grid chunk
                if (currSet) { 
                    for (let other of currSet) {

                        // check collision flags
                        if (mask && ((other.collisionFlags & mask) === 0)) {
                            continue;
                        }

                        // skip if checked
                        if (checked.has(other)) {
                            continue;
                        }
                        checked.add(other);

                        // skip self
                        if (other === shape) {
                            continue;
                        }

                        // update stats
                        this._stats.broadPhaseShapesChecksPrePredicate++;

                        // use predicate
                        if (predicate && !predicate(other)) {
                            continue;
                        }

                        // update stats
                        this._stats.broadPhaseShapesChecksPostPredicate++;

                        // invoke handler on shape
                        let proceedLoop = Boolean(handler(other));

                        // break loop
                        if (!proceedLoop) {
                            return;
                        }
                    }
                }
            }
        }
    }

    /**
     * Test collision with shapes in world, and return just the first result found.
     * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
     * @param {Boolean} sortByDistance If true will return the nearest collision found (based on center of shapes).
     * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
     * @returns {CollisionTestResult} A collision test result, or null if not found.
     */
    testCollision(sourceShape, sortByDistance, mask, predicate)
    {
        // do updates before check
        this._performUpdates();

        // result to return
        var result = null;

        // hard case - single result, sorted by distance
        if (sortByDistance)
        {
            // build options array
            var options = [];
            this._iterateBroadPhase(sourceShape, (other) => {
                options.push(other);
                return true;
            }, mask, predicate);

            // sort options
            sortByDistanceShapes(sourceShape, options);

            // check collision sorted
            var handlers = this.resolver.getHandlers(sourceShape);
            for (let other of options) {
                this._stats.collisionChecks++;
                result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
                if (result) {
                    this._stats.collisionMatches++;
                    break;
                }
            }
        }
        // easy case - single result, not sorted
        else
        {
            // iterate possible shapes and test collision
            var handlers = this.resolver.getHandlers(sourceShape);
            this._iterateBroadPhase(sourceShape, (other) => {

                // test collision and continue iterating if we don't have a result
                this._stats.collisionChecks++;
                result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
                if (result) { this._stats.collisionMatches++; }
                return !result;

            }, mask, predicate);
        }

        // return result
        return result;
    }

    /**
     * Test collision with shapes in world, and return all results found.
     * @param {CollisionShape} sourceShape Source shape to check collision for. If shape is in world, it will not collide with itself.
     * @param {Boolean} sortByDistance If true will sort results by distance.
     * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
     * @param {Function} predicate Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape.
     * @param {Function} intermediateProcessor Optional method to run after each positive result with the collision result as param. Return false to stop and return results.
     * @returns {Array<CollisionTestResult>} An array of collision test results, or empty array if none found.
     */
    testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor)
    {
        // do updates before check
        this._performUpdates();

        // get collisions
        var ret = [];
        var handlers = this.resolver.getHandlers(sourceShape);
        this._iterateBroadPhase(sourceShape, (other) => {
            this._stats.collisionChecks++;
            let result = this.resolver.testWithHandler(sourceShape, other, handlers[other.shapeId]);
            if (result) {
                this._stats.collisionMatches++;
                ret.push(result);
                if (intermediateProcessor && intermediateProcessor(result) === false) {
                    return false;
                }
            }
            return true;
        }, mask, predicate);

        // sort by distance
        if (sortByDistance) {
            sortByDistanceResults(sourceShape, ret);
        }

        // return results
        return ret;
    }

    /**
     * Return array of shapes that touch a given position, with optional radius.
     * @example
     * let shapes = world.pick(Shaku.input.mousePosition);
     * @param {*} position Position to pick.
     * @param {*} radius Optional picking radius to use a circle instead of a point.
     * @param {*} sortByDistance If true, will sort results by distance from point.
     * @param {*} mask Collision mask to filter by.
     * @param {*} predicate Optional predicate method to filter by.
     * @returns {Array<CollisionShape>} Array with collision shapes we picked.
     */
    pick(position, radius, sortByDistance, mask, predicate)
    {
        let shape = ((radius || 0) <= 1) ? new PointShape(position) : new CircleShape(new Circle(position, radius));
        let ret = this.testCollisionMany(shape, sortByDistance, mask, predicate);
        return ret.map(x => x.second);
    }

    /**
     * Debug-draw the current collision world.
     * @param {Color} gridColor Optional grid color (default to black).
     * @param {Color} gridHighlitColor Optional grid color for cells with shapes in them (default to red).
     * @param {Number} opacity Optional opacity factor (default to 0.5).
     * @param {Camera} camera Optional camera for offset and viewport.
     */
    debugDraw(gridColor, gridHighlitColor, opacity, camera)
    {
        // do updates before check
        this._performUpdates();
        
        // default grid colors
        if (!gridColor) {
            gridColor = Color.black;
            gridColor.a *= 0.75;
        }
        if (!gridHighlitColor) {
            gridHighlitColor = Color.red;
            gridHighlitColor.a *= 0.75;
        }

        // default opacity
        if (opacity === undefined) { 
            opacity = 0.5;
        }

        // set grid color opacity
        gridColor.a *= opacity;
        gridHighlitColor.a *= opacity;

        // all shapes we rendered
        let renderedShapes = new Set();

        // get visible grid cells
        let bb = camera ? camera.getRegion() : gfx.__getRenderingRegionInternal(false);
        let minx = Math.floor(bb.left / this._gridCellSize.x);
        let miny = Math.floor(bb.top / this._gridCellSize.y);
        let maxx = minx + Math.ceil(bb.width / this._gridCellSize.x);
        let maxy = miny + Math.ceil(bb.height / this._gridCellSize.y);
        for (let i = minx; i <= maxx; ++i) {
            for (let j = miny; j <= maxy; ++j) {

                // get current cell
                let cell = this._grid[i + ',' + j];

                // draw grid cell
                let color = (cell && cell.size) ? gridHighlitColor : gridColor;
                let cellRect = new Rectangle(i * this._gridCellSize.x, j * this._gridCellSize.y, this._gridCellSize.x-1, this._gridCellSize.y-1);
                gfx.outlineRect(cellRect, color, gfx.BlendModes.AlphaBlend, 0);

                // draw shapes in grid
                if (cell) {
                    for (let shape of cell)
                    {
                        if (renderedShapes.has(shape)) {
                            continue;
                        }
                        renderedShapes.add(shape);
                        shape.debugDraw(opacity);
                    }
                }
            }
        }
    }
}

/**
 * Sort array by distance from source shape.
 * @private
 */
function sortByDistanceShapes(sourceShape, options)
{
    let sourceCenter = sourceShape.getCenter();
    options.sort((a, b) => 
        (a.getCenter().distanceTo(sourceCenter) - a._getRadius()) - 
        (b.getCenter().distanceTo(sourceCenter) - b._getRadius()));
}

/**
 * Sort array by distance from source shape.
 * @private
 */
 function sortByDistanceResults(sourceShape, options)
 {
     let sourceCenter = sourceShape.getCenter();
     options.sort((a, b) => 
        (a.second.getCenter().distanceTo(sourceCenter) - a.second._getRadius()) - 
        (b.second.getCenter().distanceTo(sourceCenter) - b.second._getRadius()));
 }

// export collision world
module.exports = CollisionWorld;
},{"../logger.js":45,"../utils/circle":53,"../utils/color":54,"../utils/rectangle":61,"../utils/vector2":67,"./../gfx":29,"./resolver":13,"./result":15,"./shapes/circle":16,"./shapes/point":18,"./shapes/shape":20}],12:[function(require,module,exports){
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
 module.exports = require('./collision');
},{"./collision":10}],13:[function(require,module,exports){
/**
 * Implement the collision resolver class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\resolver.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require('../utils/vector2.js');
const CollisionTestResult = require('./result.js');
const CollisionShape = require('./shapes/shape.js');
const _logger = require('../logger.js').getLogger('collision');

 
/**
 * The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.
 */
class CollisionResolver
{
    /**
     * Create the resolver.
     */
    constructor()
    {
        this._handlers = {};
    }

    /**
     * Initialize the resolver.
     * @private
     */
    _init()
    {

    }

    /**
     * Set the method used to test collision between two shapes.
     * Note: you don't need to register the same handler twice for reverse order, its done automatically inside.
     * @param {String} firstShapeId The shape identifier the handler recieves as first argument.
     * @param {String} secondShapeId The shape identifier the handler recieves as second argument.
     * @param {Function} handler Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision.
     */
    setHandler(firstShapeId, secondShapeId, handler)
    {
        _logger.debug(`Register handler for shapes '${firstShapeId}' and '${secondShapeId}'.`);

        // register handler
        if (!this._handlers[firstShapeId]) { this._handlers[firstShapeId] = {}; }
        this._handlers[firstShapeId][secondShapeId] = handler;

        // register reverse order handler
        if (firstShapeId !== secondShapeId) {
            if (!this._handlers[secondShapeId]) { this._handlers[secondShapeId] = {}; }
            this._handlers[secondShapeId][firstShapeId] = (f, s) => { return handler(s, f); };
        }
    }

    /**
     * Check a collision between two shapes.
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @returns {CollisionTestResult} collision detection result or null if they don't collide.
     */
    test(first, second)
    {
        let handler = this._getCollisionMethod(first, second);
        return this.testWithHandler(first, second, handler);
    }

    /**
     * Check a collision between two shapes.
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @param {Function} handler Method to test collision between the shapes.
     * @returns {CollisionTestResult} collision detection result or null if they don't collide.
     */
    testWithHandler(first, second, handler)
    {
        // missing handler?
        if (!handler) {
            _logger.warn(`Missing collision handler for shapes '${first.shapeId}' and '${second.shapeId}'.`);
            return null;
        }

        // test collision
        let result = handler(first, second);

        // collision
        if (result) {
            let position = (result instanceof Vector2) ? result : null;
            return new CollisionTestResult(position, first, second);
        }

        // no collision
        return null;
    }

    /**
     * Get handlers dictionary for a given shape.
     */
    getHandlers(shape)
    {
        return this._handlers[shape.shapeId];
    }
    
    /**
     * Get the collision detection method for two given shapes.
     * @private
     * @param {CollisionShape} first First collision shape to test.
     * @param {CollisionShape} second Second collision shape to test.
     * @returns {Function} collision detection method or null if not found.
     */
    _getCollisionMethod(first, second)
    {
        let handlersFrom = this._handlers[first.shapeId];
        if (handlersFrom) {
            return handlersFrom[second.shapeId] || null;
        }
        return null;
    }
}

// export the collision resolver
module.exports = CollisionResolver;
},{"../logger.js":45,"../utils/vector2.js":67,"./result.js":15,"./shapes/shape.js":20}],14:[function(require,module,exports){
/**
 * All default collision detection implementations.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\resolvers_imp.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

 
// export the main methods
const CollisionsImp = {
    
    /**
     * Test collision between two points.
     */
    pointPoint: function(v1, v2) {
        return v1._position.approximate(v2._position) ? v1._position : false;
    },

    /**
     * Test collision between point and circle.
     */
    pointCircle: function(v1, c1) {
        return (v1._position.distanceTo(c1._circle.center) <= c1._circle.radius) ? v1._position : false;
    },

    /**
     * Test collision between point and rectangle.
     */
    pointRectangle: function(v1, r1) {
        return r1._rect.containsVector(v1._position) ? v1._position : false;
    },

    /**
     * Test collision between point and line.
     */
    pointLine: function(v1, l1) {
        for (let i = 0; i < l1._lines.length; ++i) {
            if (l1._lines[i].containsVector(v1._position)) {
                return v1._position;
            }
        }
        return false;
    },

    /**
     * Test collision between a point and a tilemap.
     */
    pointTilemap: function(v1, tm) {
        if (tm._intBoundingRect.containsVector(v1._position)) {
            let tile = tm.getTileAt(v1._position);
            return tile ? CollisionsImp.pointRectangle(v1, tile) : false;
        }
        if (tm._borderThickness && tm._boundingRect.containsVector(v1._position)) {
            return v1._position;
        }
        return false;
    },

    /**
     * Test collision between circle and circle.
     */
    circleCircle: function(c1, c2) {
        return c1._circle.center.distanceTo(c2._circle.center) <= (c1._circle.radius + c2._circle.radius);
    },

    /**
     * Test collision between circle and rectangle.
     */
    circleRectangle: function(c1, r1) {
        return r1._rect.collideCircle(c1._circle);
    },

    /**
     * Test collision between circle and lines.
     */
    circleLine: function(c1, l1) {     
        for (let i = 0; i < l1._lines.length; ++i) {
            if (l1._lines[i].distanceToVector(c1._circle.center) <= c1._circle.radius) {
                return true;
            }
        }
        return false;
    },
        
    /**
     * Test collision between circle and tilemap.
     */
    circleTilemap: function(c1, tm) {     
        let collide = false;
        tm.iterateTilesAtRegion(c1._getBoundingBox(), (tile) => {
            if (CollisionsImp.circleRectangle(c1, tile)) {
                collide = true;
                return false;
            }
        });
        return collide;
    },

    /**
     * Test collision between rectangle and rectangle.
     */
    rectangleRectangle: function(r1, r2) {
        return r1._rect.collideRect(r2._rect);
    },
    
    /**
     * Test collision between rectangle and line.
     */
    rectangleLine: function(r1, l1) {
        for (let i = 0; i < l1._lines.length; ++i) {
            if (r1._rect.collideLine(l1._lines[i])) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * Test collision between rectangle and tilemap.
     */
    rectangleTilemap: function(r1, tm) {     
        let collide = false;
        tm.iterateTilesAtRegion(r1._getBoundingBox(), (tile) => {
            collide = true;
            return false;
        });
        return collide;
    },

    /**
     * Test collision between line and line.
     */
    lineLine: function(l1, l2) {
        for (let i = 0; i < l1._lines.length; ++i) {
            for (let j = 0; j < l2._lines.length; ++j) {
                if (l1._lines[i].collideLine(l2._lines[j])) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * Test collision between line and tilemap.
     */
    lineTilemap: function(l1, tm) {     
        let collide = false;
        tm.iterateTilesAtRegion(l1._getBoundingBox(), (tile) => {
            if (CollisionsImp.rectangleLine(tile, l1)) {
                collide = true;
                return false;
            }
        });
        return collide;
    },
}


// export the collisions implementation
module.exports = CollisionsImp;
},{}],15:[function(require,module,exports){
/**
 * An object to store collision detection result.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\result.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require("../utils/vector2");
const CollisionShape = require("./shapes/shape");

 
/**
 * Collision detection result.
 */
class CollisionTestResult
{
    /**
     * Create the collision result.
     * @param {Vector2} position Optional collision position.
     * @param {CollisionShape} first First shape in the collision check.
     * @param {CollisionShape} second Second shape in the collision check.
     */
    constructor(position, first, second)
    {
        /**
         * Collision position, only relevant when there's a single touching point.
         * For shapes with multiple touching points, this will be null.
         */
        this.position = position;

        /**
         * First collided shape.
         */
        this.first = first;

        /**
         * Second collided shape.
         */
        this.second = second;
    }
}

// export collision shape class
module.exports = CollisionTestResult;
},{"../utils/vector2":67,"./shapes/shape":20}],16:[function(require,module,exports){
/**
 * Implement collision circle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\circle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const CollisionShape = require("./shape");
const gfx = require('./../../gfx');
const Circle = require("../../utils/circle");
const Rectangle = require("../../utils/rectangle");


/**
 * Collision circle class.
 */
class CircleShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Circle} circle the circle shape.
     */
    constructor(circle)
    {
        super();
        this.setShape(circle);
    }

    /**
     * @inheritdoc
     */
    get shapeId()
    {
        return "circle";
    }

    /**
     * Set this collision shape from circle.
     * @param {Circle} circle Circle shape.
     */
    setShape(circle)
    {
        this._circle = circle;
        this._position = circle.center;
        this._boundingBox = new Rectangle(circle.center.x - circle.radius, circle.center.y - circle.radius, circle.radius * 2, circle.radius * 2);
        this._shapeChanged();
    }
 
    /**
     * @inheritdoc
     */
    _getRadius()
    {
        return this._circle.radius;
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._position.clone();
    }

    /**
     * @inheritdoc
     */
    _getBoundingBox()
    {
        return this._boundingBox;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        if (opacity === undefined) opacity = 1;
        let color = this._getDebugColor();

        color.a *= opacity;
        gfx.outlineCircle(this._circle, color, gfx.BlendModes.AlphaBlend, 14);

        color.a *= 0.25;
        gfx.fillCircle(this._circle, color, gfx.BlendModes.AlphaBlend, 14);
    }
}

// export collision shape class
module.exports = CircleShape;
},{"../../utils/circle":53,"../../utils/rectangle":61,"./../../gfx":29,"./shape":20}],17:[function(require,module,exports){
/**
 * Implement collision lines.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\lines.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const CollisionShape = require("./shape");
const gfx = require('./../../gfx');
const Line = require("../../utils/line");
const Rectangle = require("../../utils/rectangle");
const Circle = require("../../utils/circle");


/**
 * Collision lines class.
 * This shape is made of one line or more.
 */
class LinesShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Array<Line>|Line} lines Starting line / lines.
     */
    constructor(lines)
    {
        super();
        this._lines = [];
        this.addLines(lines);
    }

    /**
     * @inheritdoc
     */
    get shapeId()
    {
        return "lines";
    }
    
    /**
     * Add line or lines to this collision shape.
     * @param {Array<Line>|Line} lines Line / lines to add.
     */
    addLines(lines)
    {
        // convert to array
        if (!Array.isArray(lines)) {
            lines = [lines];
        }

        // add lines
        for (let i = 0; i < lines.length; ++i)
        {
            this._lines.push(lines[i]);
        }

        // get all points
        let points = [];
        for (let i = 0; i < this._lines.length; ++i) {
            points.push(this._lines[i].from);
            points.push(this._lines[i].to);
        }

        // reset bounding box and circle
        this._boundingBox = Rectangle.fromPoints(points);
        this._circle = new Circle(this._boundingBox.getCenter(), Math.max(this._boundingBox.width, this._boundingBox.height));
        this._shapeChanged();
    }

    /**
     * Set this shape from line or lines array.
     * @param {Array<Line>|Line} lines Line / lines to set.
     */
    setLines(lines)
    {
        this._lines = [];
        this.addLines(lines);
    }
 
    /**
     * @inheritdoc
     */
    _getRadius()
    {
        return this._circle.radius;
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._circle.center.clone();
    }

    /**
     * @inheritdoc
     */
    _getBoundingBox()
    {
        return this._boundingBox;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        if (opacity === undefined) opacity = 1;
        let color = this._getDebugColor();

        color.a *= opacity;
        for (let i = 0; i < this._lines.length; ++i) {
            gfx.drawLine(this._lines[i].from, this._lines[i].to, color, gfx.BlendModes.AlphaBlend);
        }
    }
}

// export collision lines class
module.exports = LinesShape;
},{"../../utils/circle":53,"../../utils/line":57,"../../utils/rectangle":61,"./../../gfx":29,"./shape":20}],18:[function(require,module,exports){
/**
 * Implement collision point.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\point.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const CollisionShape = require("./shape");
const gfx = require('./../../gfx');
const Vector2 = require("../../utils/vector2");
const Rectangle = require("../../utils/rectangle");
const Circle = require("../../utils/circle");


/**
 * Collision point class.
 */
class PointShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Vector2} position Point position.
     */
    constructor(position)
    {
        super();
        this.setPosition(position);
    }

    /**
     * @inheritdoc
     */
    get shapeId()
    {
        return "point";
    }
    
    /**
     * Set this collision shape from vector2.
     * @param {Vector2} position Point position.
     */
    setPosition(position)
    {
        this._position = position.clone();
        this._boundingBox = new Rectangle(position.x, position.y, 1, 1);
        this._shapeChanged();
    }

    /**
     * Get point position.
     * @returns {Vector2} Point position.
     */
    getPosition()
    {
        return this._position.clone();
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._position.clone();
    }

    /**
     * @inheritdoc
     */
    _getRadius()
    {
        return 1;
    }

    /**
     * @inheritdoc
     */
    _getBoundingBox()
    {
        return this._boundingBox;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        if (opacity === undefined) opacity = 1;
        let color = this._getDebugColor();
        color.a *= opacity;
        gfx.outlineCircle(new Circle(this.getPosition(), 3), color, gfx.BlendModes.AlphaBlend, 4);
    }
}

// export collision shape class
module.exports = PointShape;
},{"../../utils/circle":53,"../../utils/rectangle":61,"../../utils/vector2":67,"./../../gfx":29,"./shape":20}],19:[function(require,module,exports){
/**
 * Implement collision rectangle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\rectangle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const Rectangle = require("../../utils/rectangle");
const CollisionShape = require("./shape");
const gfx = require('./../../gfx');


/**
 * Collision rectangle class.
 */
class RectangleShape extends CollisionShape
{
    /**
     * Create the collision shape.
     * @param {Rectangle} rectangle the rectangle shape.
     */
    constructor(rectangle)
    {
        super();
        this.setShape(rectangle);
    }

    /**
     * @inheritdoc
     */
    get shapeId()
    {
        return "rect";
    }

    /**
     * Set this collision shape from rectangle.
     * @param {Rectangle} rectangle Rectangle shape.
     */
    setShape(rectangle)
    {
        this._rect = rectangle;
        this._center = rectangle.getCenter();
        this._radius = this._rect.getBoundingCircle().radius;
        this._shapeChanged();
    }
       
    /**
     * @inheritdoc
     */ 
    _getRadius()
    {
        return this._radius;
    }

    /**
     * @inheritdoc
     */
    _getBoundingBox()
    {
        return this._rect;
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._center.clone();
    }
    
    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        if (opacity === undefined) opacity = 1;
        let color = this._getDebugColor();

        color.a *= opacity;
        gfx.outlineRect(this._rect, color, gfx.BlendModes.AlphaBlend);
                
        color.a *= 0.25;
        gfx.fillRect(this._rect, color, gfx.BlendModes.AlphaBlend);
    }
}

// export collision shape class
module.exports = RectangleShape;
},{"../../utils/rectangle":61,"./../../gfx":29,"./shape":20}],20:[function(require,module,exports){
/**
 * Implement collision shape base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\shape.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Color = require("../../utils/color");
const Rectangle = require("../../utils/rectangle");
const Vector2 = require("../../utils/vector2");
const CollisionWorld = require("../collision_world");

 
/**
 * Collision shape base class.
 */
class CollisionShape
{
    /**
     * Create the collision shape.
     */
    constructor()
    {
        this._world = null;
        this._worldRange = null;
        this._debugColor = null;
        this._forceDebugColor = null;
        this._collisionFlags = Number.MAX_SAFE_INTEGER;
    }

    /**
     * Get the collision shape's unique identifier.
     * @returns {String} Shape's unique identifier
     */
    get shapeId()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get collision flags (matched against collision mask when checking collision).
     */
    get collisionFlags()
    {
        return this._collisionFlags;
    }

    /**
     * Set collision flags (matched against collision mask when checking collision).
     */
    set collisionFlags(value)
    {
        this._debugColor = null;
        this._collisionFlags = value;
        return this._collisionFlags;
    }

    /**
     * Set the debug color to use to draw this shape.
     * @param {Color} color Color to set or null to use default.
     */
    setDebugColor(color)
    {
        this._forceDebugColor = color;
    }

    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        throw new Error("Not Implemented!");
    }
    
    /**
     * Get shape center position.
     * @returns {Vector2} Center position.
     */
    getCenter()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Remove self from parent world object.
     */
    remove()
    {
        if (this._world) {
            this._world.removeShape(this);
        }
    }

    /**
     * Get debug drawing color.
     * @private
     */
    _getDebugColor()
    {
        // use forced debug color
        if (this._forceDebugColor) {
            return this._forceDebugColor.clone();
        }

        // calculate debug color
        if (!this._debugColor) {
            this._debugColor = this._getDefaultDebugColorFor(this.collisionFlags);
        }

        // return color
        return this._debugColor.clone();
    }

    /**
     * Get default debug colors for given collision flags.
     * @private
     */
    _getDefaultDebugColorFor(flags)
    {
        return defaultDebugColors[flags % defaultDebugColors.length];
    }

    /**
     * Get collision shape's estimated radius box.
     * @private
     * @returns {Number} Shape's radius
     */
    _getRadius()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get collision shape's bounding box.
     * @private
     * @returns {Rectangle} Shape's bounding box.
     */
    _getBoundingBox()
    {
        throw new Error("Not Implemented!");
    }
    
    /**
     * Set the parent collision world this shape is currently in.
     * @private
     * @param {CollisionWorld} world New parent collision world or null to remove.
     */
    _setParent(world)
    {
        // same world? skip
        if (world === this._world) {
            return;
        }

        // we already have a world but try to set a new one? error
        if (this._world && world) {
            throw new Error("Cannot add collision shape to world while its already in another world!");
        }

        // set new world
        this._world = world;
        this._worldRange = null;
    }

    /**
     * Called when the collision shape changes and we need to update the parent world.
     * @private
     */
    _shapeChanged()
    {
        if (this._world) {
            this._world._queueUpdate(this);
        }
    }
}

// default debug colors to use
const defaultDebugColors = [Color.red, Color.blue, Color.green, Color.yellow, Color.purple, Color.teal, Color.brown, Color.orange, Color.khaki, Color.darkcyan, Color.cornflowerblue, Color.darkgray, Color.chocolate, Color.aquamarine, Color.cadetblue, Color.magenta, Color.seagreen, Color.pink, Color.olive, Color.violet];

// export collision shape class
module.exports = CollisionShape;
},{"../../utils/color":54,"../../utils/rectangle":61,"../../utils/vector2":67,"../collision_world":11}],21:[function(require,module,exports){
/**
 * Implement collision tilemap.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\collision\shapes\tilemap.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const CollisionShape = require("./shape");
const Rectangle = require("../../utils/rectangle");
const Vector2 = require("../../utils/vector2");
const gfx = require('./../../gfx');
const RectangleShape = require("./rectangle");


/**
 * Collision tilemap class.
 * A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
 * Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.
 */
class TilemapShape extends CollisionShape
{
    /**
     * Create the collision tilemap.
     * @param {Vector2} offset Tilemap top-left corner.
     * @param {Vector2} gridSize Number of tiles on X and Y axis.
     * @param {Vector2} tileSize The size of a single tile.
     * @param {Number} borderThickness Set a border collider with this thickness.
     */
    constructor(offset, gridSize, tileSize, borderThickness)
    {
        super();
        borderThickness = borderThickness || 0;
        this._offset = offset.clone();
        this._intBoundingRect = new Rectangle(offset.x, offset.y, gridSize.x * tileSize.x, gridSize.y * tileSize.y);
        this._boundingRect = this._intBoundingRect.resize(borderThickness * 2);
        this._center = this._boundingRect.getCenter();
        this._radius = this._boundingRect.getBoundingCircle().radius;
        this._borderThickness = borderThickness;
        this._gridSize =  gridSize.clone();
        this._tileSize = tileSize.clone();
        this._tiles = {};
    }

    /**
     * @inheritdoc
     */
    get shapeId()
    {
        return "tilemap";
    }

    /**
     * Get tile key from vector index.
     * Also validate range.
     * @private
     * @param {Vector2} index Index to get key for.
     * @returns {String} tile key.
     */
    _indexToKey(index)
    {
        if (index.x < 0 || index.y < 0 || index.x >= this._gridSize.x || index.y >= this._gridSize.y) {
            throw new Error(`Collision tile with index ${index.x},${index.y} is out of bounds!`);
        }
        return index.x +',' + index.y;
    }

    /**
     * Set the state of a tile.
     * @param {Vector2} index Tile index.
     * @param {Boolean} haveCollision Does this tile have collision?
     * @param {Number} collisionFlags Optional collision flag to set for this tile.
     */
    setTile(index, haveCollision, collisionFlags)
    {
        let key = this._indexToKey(index);
        if (haveCollision) {
            let rect = this._tiles[key] || new RectangleShape(
                new Rectangle(
                    this._offset.x + index.x * this._tileSize.x, 
                    this._offset.y + index.y * this._tileSize.y, 
                    this._tileSize.x, 
                    this._tileSize.y)
                );
            if (collisionFlags !== undefined) {
                rect.collisionFlags = collisionFlags;
            }
            this._tiles[key] = rect;
        }
        else {
            delete this._tiles[key];
        }
    }

    /**
     * Get the collision shape of a tile at a given position.
     * @param {Vector2} position Position to get tile at.
     * @returns {RectangleShape} Collision shape at this position, or null if not set.
     */
    getTileAt(position)
    {
        let index = new Vector2(Math.floor(position.x / this._tileSize.x), Math.floor(position.y / this._tileSize.y));
        let key = index.x + ',' + index.y;
        return this._tiles[key] || null;
    }
    
    /**
     * Iterate all tiles in given region, represented by a rectangle.
     * @param {Rectangle} region Rectangle to get tiles for.
     * @param {Function} callback Method to invoke for every tile. Return false to break iteration.
     */
    iterateTilesAtRegion(region, callback)
    {
        let topLeft = region.getTopLeft();
        let bottomRight = region.getBottomRight();
        let startIndex = new Vector2(Math.floor(topLeft.x / this._tileSize.x), Math.floor(topLeft.y / this._tileSize.y));
        let endIndex = new Vector2(Math.floor(bottomRight.x / this._tileSize.x), Math.floor(bottomRight.y / this._tileSize.y));
        for (let i = startIndex.x; i <= endIndex.x; ++i) {
            for (let j = startIndex.y; j <= endIndex.y; ++j) {
                let key = i + ',' + j;
                let tile = this._tiles[key];
                if (tile && (callback(tile) === false)) { 
                    return; 
                }
            }
        }
    }
    
    /**
     * Get all tiles in given region, represented by a rectangle.
     * @param {Rectangle} region Rectangle to get tiles for.
     * @returns {Array<RectangleShape>} Array with rectangle shapes or empty if none found.
     */
    getTilesAtRegion(region)
    {
        let ret = [];
        this.iterateTilesAtRegion(region, (tile) => { ret.push(tile); });
        return ret;
    }
    
    /**
     * @inheritdoc
     */ 
    _getRadius()
    {
        return this._radius;
    }

    /**
     * @inheritdoc
     */
    _getBoundingBox()
    {
        return this._boundingRect;
    }
    
    /**
     * @inheritdoc
     */
    getCenter()
    {
        return this._center.clone();
    }
    
    /**
     * Debug draw this shape.
     * @param {Number} opacity Shape opacity factor.
     */
    debugDraw(opacity)
    {
        if (opacity === undefined) opacity = 1;
        let color = this._getDebugColor();
        color.a *= opacity;

        // draw borders
        if (this._haveBorders) {
            gfx.outlineRect(this._intBoundingRect, color, gfx.BlendModes.AlphaBlend);
            gfx.outlineRect(this._boundingRect, color, gfx.BlendModes.AlphaBlend);
        }

        // draw tiles
        for (let key in this._tiles) {
            let tile = this._tiles[key];
            tile.setDebugColor(this._forceDebugColor);
            tile.debugDraw(opacity);
        }
    }
}

// export collision shape class
module.exports = TilemapShape;
},{"../../utils/rectangle":61,"../../utils/vector2":67,"./../../gfx":29,"./rectangle":19,"./shape":20}],22:[function(require,module,exports){
/**
 * Define supported blend modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\blend_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {String} BlendMode */

/**
 * Blend modes we can draw with, determine how we blend new draws with existing buffer.
 * @readonly
 * @enum {BlendMode}
 */
const BlendModes = {
    AlphaBlend: "alpha",
    Opaque: "opaque",
    Additive: "additive",
    Multiply: "multiply",
    Subtract: "subtract",
    Screen: "screen",
    Overlay: "overlay",
    Invert: "invert",
    Darken: "darken",
    DestIn: "dest-in",
    DestOut: "dest-out"
};

Object.defineProperty(BlendModes, '_values', {
    value: new Set(Object.values(BlendModes)),
    writable: false,
});
Object.freeze(BlendModes);

module.exports = {BlendModes: BlendModes};
},{}],23:[function(require,module,exports){
/**
 * Camera class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\camera.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

const Rectangle = require("../utils/rectangle");
const Vector2 = require("../utils/vector2");
const Matrix = require("./matrix");

 /**
  * Implements a Camera object.
  */
class Camera
{
    /**
     * Create the camera.
     * @param {Gfx} gfx The gfx manager instance.
     */
    constructor(gfx)
    {
        /**
         * Camera projection matrix.
         * You can set it manually, or use 'orthographicOffset' / 'orthographic' / 'perspective' helper functions.
         */
        this.projection = null;

        this._region = null;
        this._gfx = gfx;
        this.orthographic();
        this._viewport = null;
    }

    /**
     * Get camera's viewport (drawing region to set when using this camera).
     * @returns {Rectangle} Camera's viewport as rectangle.
     */
    get viewport()
    {
        return this._viewport;
    }

    /**
     * Set camera's viewport.
     * @param {Rectangle} viewport New viewport to set or null to not use any viewport when using this camera.
     */
    set viewport(viewport)
    {
        this._viewport = viewport;
        return viewport;
    }

    /**
     * Get the region this camera covers.
     * @returns {Rectangle} region this camera covers.
     */
    getRegion()
    {
        return this._region.clone();
    }

    /**
     * Make this camera an orthographic camera with offset.
     * @param {Vector2} offset Camera offset (top-left corner).
     * @param {Boolean} ignoreViewportSize If true, will take the entire canvas size for calculation and ignore the viewport size, if set.
     * @param {Number} near Near clipping plane.
     * @param {Number} far Far clipping plane.
     */
    orthographicOffset(offset, ignoreViewportSize, near, far)
    {
        let renderingSize = (ignoreViewportSize || !this.viewport) ? this._gfx.getCanvasSize() : this.viewport.getSize();
        let region = new Rectangle(offset.x, offset.y, renderingSize.x, renderingSize.y);
        this.orthographic(region, near, far);
    }

    /**
     * Make this camera an orthographic camera.
     * @param {Rectangle} region Camera left, top, bottom and right. If not set, will take entire canvas.
     * @param {Number} near Near clipping plane.
     * @param {Number} far Far clipping plane.
     */
    orthographic(region, near, far) 
    {
        if (region === undefined) {
            region = this._gfx.__getRenderingRegionInternal();
        }
        this._region = region;
        this.projection = Matrix.orthographic(region.left, region.right, region.bottom, region.top, near || -1, far || 400);
    }

    /**
     * Make this camera a perspective camera.
     * @private
     * @param {*} fieldOfView Field of view angle in radians.
     * @param {*} aspectRatio Aspect ratio.
     * @param {*} near Near clipping plane.
     * @param {*} far Far clipping plane.
     */
    _perspective(fieldOfView, aspectRatio, near, far) 
    {
        this.projection = Matrix.perspective(fieldOfView || (Math.PI / 2), aspectRatio || 1, near || 0.1, far || 1000)
    }
}

// export the camera object
module.exports = Camera;
},{"../utils/rectangle":61,"../utils/vector2":67,"./matrix":30}],24:[function(require,module,exports){
/**
 * Implement a basic effect to draw sprites.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\basic.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Effect = require("./effect");

// vertex shader code
const vertexShader = `
attribute vec3 position;
attribute vec2 coord;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = coord;
    v_color = color;
}
    `;

// fragment shader code
const fragmentShader = `  
#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D texture;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_FragColor = texture2D(texture, v_texCoord) * v_color;
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

/**
 * Default basic effect to draw 2d sprites.
 */
class BasicEffect extends Effect
{
    /** @inheritdoc */
    get vertexCode() 
    { 
        return vertexShader; 
    }

    /** @inheritdoc */
    get fragmentCode()
    { 
        return fragmentShader;
    }

    /** @inheritdoc */
    get uniformTypes()
    {
        return {
            "texture": { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
            "projection": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
            "world": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
        };
    }

    /** @inheritdoc */
    get attributeTypes()
    {
        return {
            "position": { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
            "coord": { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
            "color": { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
        };
    }
}


// export the basic shader
module.exports = BasicEffect;
},{"./effect":25}],25:[function(require,module,exports){
/**
 * Effect base class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\effect.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const TextureAsset = require('../../assets/texture_asset.js');
const Color = require('../../utils/color.js');
const Rectangle = require('../../utils/rectangle.js');
const { TextureFilterMode, TextureFilterModes } = require('../texture_filter_modes');
const { TextureWrapMode, TextureWrapModes } = require('../texture_wrap_modes');
const Matrix = require('../matrix.js');
const _logger = require('../../logger.js').getLogger('gfx-effect');


/**
 * Effect base class.
 * An effect = vertex shader + fragment shader + uniforms & attributes + setup code.
 */
class Effect
{
    /**
     * Build the effect.
     * Called from gfx manager.
     * @private
     * @param {WebGl} gl WebGL context.
     */
    _build(gl)
    {
        // create program
        let program = gl.createProgram();

        // build vertex shader
        {
            let shader = compileShader(gl, this.vertexCode, gl.VERTEX_SHADER);
            gl.attachShader(program, shader);
        }

        // build fragment shader
        {
            let shader = compileShader(gl, this.fragmentCode, gl.FRAGMENT_SHADER);
            gl.attachShader(program, shader);
        }

        // link program
        gl.linkProgram(program)

        // check for errors
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            _logger.error("Error linking shader program:");
            _logger.error(gl.getProgramInfoLog(program));
            throw new Error("Failed to link shader program.");
        }

        // store program and gl
        this._gl = gl;
        this._program = program;

        // a set of dynamically-created setters to set uniform values
        this.uniforms = {};

        // dictionary to bind uniform to built-in roles, like main texture or color
        this._uniformBinds = {};

        // initialize uniform setters
        for (let uniform in this.uniformTypes) {

            // get uniform location
            let uniformLocation = this._gl.getUniformLocation(this._program, uniform);
            if (uniformLocation === -1) { 
                _logger.error("Could not find uniform: " + uniform);
                throw new Error(`Uniform named '${uniform}' was not found in shader code!`); 
            }

            // get gl setter method
            let uniformData = this.uniformTypes[uniform];
            if (!UniformTypes._values.has(uniformData.type)) { 
                _logger.error("Uniform has invalid type: " + uniformData.type);
                throw new Error(`Uniform '${uniform}' have illegal value type '${uniformData.type}'!`); 
            }

            // build setter method for matrices
            if (uniformData.type === UniformTypes.Matrix) {
                (function(_this, name, location, method) {
                    _this.uniforms[name] = (mat) => {
                        _this._gl[method](location, false, mat);
                    }
                })(this, uniform, uniformLocation, uniformData.type);
            }
            // build setter method for textures
            else if (uniformData.type === UniformTypes.Texture) {
                (function(_this, name, location, method) {
                    _this.uniforms[name] = (texture, index) => {
                        index = index || 0;
                        const glTexture = texture.texture || texture;
                        const textureCode = _this._gl['TEXTURE' + (index || 0)];
                        _this._gl.activeTexture(textureCode);
                        _this._gl.bindTexture(_this._gl.TEXTURE_2D, glTexture);
                        _this._gl.uniform1i(location, (index || 0));
                        if (texture.filter) { _setTextureFilter(_this._gl, texture.filter); }
                        if (texture.wrapMode) { _setTextureWrapMode(_this._gl, texture.wrapMode); }
                    }
                })(this, uniform, uniformLocation, uniformData.type);
            }
            // build setter method for other types
            else {
                (function(_this, name, location, method) {
                    _this.uniforms[name] = (v1, v2, v3, v4) => {
                        _this._gl[method](location, v1, v2, v3, v4);
                    }
                })(this, uniform, uniformLocation, uniformData.type);       
            }

            // set binding
            let bindTo = uniformData.bind;
            if (bindTo) {
                this._uniformBinds[bindTo] = uniform;
            }
        }

        // a set of dynamically-created setters to set attribute values
        this.attributes = {};

        // dictionary to bind attribute to built-in roles, like vertices positions or uvs
        this._attributeBinds = {};

        // get attribute locations
        for (let attr in this.attributeTypes) {

            // get attribute location
            let attributeLocation = this._gl.getAttribLocation(this._program, attr);
            if (attributeLocation === -1) { 
                _logger.error("Could not find attribute: " + attr);
                throw new Error(`Attribute named '${attr}' was not found in shader code!`); 
            }

            // get attribute data
            let attributeData = this.attributeTypes[attr];

            // build setter method
            (function(_this, name, location, data) {
                _this.attributes[name] = (buffer) => {
                    if (buffer) {
                        _this._gl.bindBuffer(_this._gl.ARRAY_BUFFER, buffer);
                        _this._gl.vertexAttribPointer(location, data.size, _this._gl[data.type] || _this._gl.FLOAT, data.normalize || false, data.stride || 0, data.offset || 0);
                        _this._gl.enableVertexAttribArray(location);
                    }
                    else {
                        _this._gl.disableVertexAttribArray(location);
                    }
                }
            })(this, attr, attributeLocation, attributeData);
      
            // set binding
            let bindTo = attributeData.bind;
            if (bindTo) {
                this._attributeBinds[bindTo] = attr;
            }
        }

        // values we already set for this effect, so we won't set them again
        this._cachedValues = {};
    }

    /**
     * Get a dictionary with all shaders uniforms.
     * Key = uniform name, as appears in shader code.
     * Value = {
     *              type: UniformTypes to represent uniform type,
     *              bind: Optional bind to one of the built-in uniforms. See Effect.UniformBinds for details.
     *         }
     * @returns {*} Dictionary with uniforms descriptions.
     */
    get uniformTypes()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get a dictionary with all shader attributes.
     * Key = attribute name, as appears in shader code.
     * Value = {
     *             size: size of every value in this attribute.
     *             type: attribute type. See Effect.AttributeTypes for details.
     *             normalize: if true, will normalize values.
     *             stride: optional stride. 
     *             offset: optional offset.
     *             bind: Optional bind to one of the built-in attributes. See Effect.AttributeBinds for details.
     *         }
     * @returns {*} Dictionary with attributes descriptions.
     */
    get attributeTypes()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Make this effect active.
     */
    setAsActive()
    {
        // use effect program
        this._gl.useProgram(this._program);

        // enable / disable some features
        if (this.enableDepthTest) { this._gl.enable(this._gl.DEPTH_TEST); } else { this._gl.disable(this._gl.DEPTH_TEST); }
        if (this.enableFaceCulling) { this._gl.enable(this._gl.CULL_FACE); } else { this._gl.disable(this._gl.CULL_FACE); }
        if (this.enableStencilTest) { this._gl.enable(this._gl.STENCIL_TEST); } else { this._gl.disable(this._gl.STENCIL_TEST); }
        if (this.enableDithering) { this._gl.enable(this._gl.DITHER); } else { this._gl.disable(this._gl.DITHER); }

        // reset cached values
        this._cachedValues = {};
    }

    /**
     * Prepare effect before drawing it with batching.
     * @param {Mesh} mesh Mesh we're about to draw.
     * @param {Matrix} world World matrix.
     */
    prepareToDrawBatch(mesh, world)
    {
        this._cachedValues = {};
        this.setPositionsAttribute(mesh.positions);
        this.setTextureCoordsAttribute(mesh.textureCoords);
        this.setColorsAttribute(mesh.colors);
        this.setWorldMatrix(world);
    }

    /**
     * Get this effect's vertex shader code, as string.
     * @returns {String} Vertex shader code. 
     */
    get vertexCode()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Get this effect's fragment shader code, as string.
     * @returns {String} Fragment shader code. 
     */
    get fragmentCode()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Should this effect enable depth test?
     */
    get enableDepthTest()
    {
        return false;
    }

    /**
     * Should this effect enable face culling?
     */
    get enableFaceCulling()
    {
        return false;
    }

    /**
     * Should this effect enable stencil test?
     */
    get enableStencilTest()
    {
        return false;
    }

    /**
     * Should this effect enable dithering?
     */
    get enableDithering()
    {
        return false;
    }

    /**
     * Set the main texture.
     * Only works if there's a uniform type bound to 'MainTexture'.
     * @param {TextureAsset} texture Texture to set.
     * @returns {Boolean} True if texture was changed, false if there was no need to change the texture.
     */
    setTexture(texture)
    {
        // already using this texture? skip
        if (texture === this._cachedValues.texture) { 
            return false; 
        }

        // get texture uniform
        let uniform = this._uniformBinds[Effect.UniformBinds.MainTexture];

        // set texture
        if (uniform) {
            this._cachedValues.texture = texture;
            let glTexture = texture.texture || texture;
            this._gl.activeTexture(this._gl.TEXTURE0);
            this._gl.bindTexture(this._gl.TEXTURE_2D, glTexture);
            this.uniforms[uniform](texture, 0);
            return true;
        }
        return false;
    }

    /**
     * Set the main tint color.
     * Only works if there's a uniform type bound to 'Color'.
     * @param {Color} color Color to set.
     */
    setColor(color)
    {
        let uniform = this._uniformBinds[Effect.UniformBinds.Color];
        if (uniform) {
            if (color.equals(this._cachedValues.color)) { return; }
            this._cachedValues.color = color.clone();
            this.uniforms[uniform](color.floatArray);
        }
    }

    /**
     * Set uvOffset and uvScale params from source rectangle and texture.
     * @param {Rectangle} sourceRect Source rectangle to set, or null to take entire texture.
     * @param {TextureAsset} texture Texture asset to set source rect for.
     */
    setUvOffsetAndScale(sourceRect, texture)
    {
        // skip if the same
        if (sourceRect) {
            if (sourceRect.equals(this._cachedValues.sourceRect)) { return; }
        }
        else {
            if (this._cachedValues.sourceRect === null) { return; }
        }
        this._cachedValues.sourceRect = sourceRect ? sourceRect.clone() : null;

        // default source rect
        if (!sourceRect) { sourceRect = new Rectangle(0, 0, texture.width, texture.height); }

        // set uv offset
        let uvOffset = this._uniformBinds[Effect.UniformBinds.UvOffset];
        if (uvOffset) {
            this.uniforms[uvOffset](sourceRect.x / texture.width, sourceRect.y / texture.height);
        }
        
        // set uv scale
        let uvScale = this._uniformBinds[Effect.UniformBinds.UvScale];
        if (uvScale) {
            this.uniforms[uvScale](sourceRect.width / texture.width, sourceRect.height / texture.height);
        }
    }

    /**
     * Set the projection matrix uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setProjectionMatrix(matrix)
    {
        let uniform = this._uniformBinds[Effect.UniformBinds.Projection];
        if (uniform) {
            if (matrix.equals(this._cachedValues.projection)) { return; }
            this._cachedValues.projection = matrix.clone();
            this.uniforms[uniform](matrix.values);
        }
    }

    /**
     * Set the world matrix uniform.
     * @param {Matrix} matrix Matrix to set.
     */
    setWorldMatrix(matrix)
    {
        let uniform = this._uniformBinds[Effect.UniformBinds.World];
        if (uniform) {
            this.uniforms[uniform](matrix.values);
        }
    }
     
    /**
     * Set the vertices position buffer.
     * Only works if there's an attribute type bound to 'Position'.
     * @param {WebGLBuffer} buffer Vertices position buffer.
     * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
     */
    setPositionsAttribute(buffer, forceSetBuffer)
    {
        let attr = this._attributeBinds[Effect.AttributeBinds.Position];
        if (attr) {
            if (!forceSetBuffer && buffer === this._cachedValues.positions) { return; }
            this._cachedValues.positions = buffer;
            this.attributes[attr](buffer);
        }
    }
     
    /**
     * Set the vertices texture coords buffer.
     * Only works if there's an attribute type bound to 'TextureCoords'.
     * @param {WebGLBuffer} buffer Vertices texture coords buffer.
     * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
     */
    setTextureCoordsAttribute(buffer, forceSetBuffer)
    {
        let attr = this._attributeBinds[Effect.AttributeBinds.TextureCoords];
        if (attr) {
            if (!forceSetBuffer && buffer === this._cachedValues.coords) { return; }
            this._cachedValues.coords = buffer;
            this.attributes[attr](buffer);
        }
    }
         
    /**
     * Set the vertices colors buffer.
     * Only works if there's an attribute type bound to 'Colors'.
     * @param {WebGLBuffer} buffer Vertices colors buffer.
     * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
     */
     setColorsAttribute(buffer, forceSetBuffer)
     {
         let attr = this._attributeBinds[Effect.AttributeBinds.Colors];
         if (attr) {
            if (!forceSetBuffer && buffer === this._cachedValues.colors) { return; }
            this._cachedValues.colors = buffer;
            this.attributes[attr](buffer);
         }
     }
}

/**
 * Build a shader.
 */
function compileShader(gl, code, type) 
{
    let shader = gl.createShader(type);

    gl.shaderSource(shader, code);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        _logger.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
        _logger.error(gl.getShaderInfoLog(shader));
        throw new Error("Failed to compile a shader.");
    }

    return shader;
}

/** @typedef {String} UniformType */

/**
 * Uniform types enum.
 * @readonly
 * @enum {UniformType}
 */
const UniformTypes = 
{
    Texture: 'texture',
    Matrix: 'uniformMatrix4fv',
    Color: 'uniform4fv',

    Float: 'uniform1f',
    FloatArray: 'uniform1fv',

    Int: 'uniform1i',
    IntArray: 'uniform1iv',

    Float2: 'uniform2f',
    Float2Array: 'uniform2fv',

    Int2: 'uniform2i',
    Int2Array: 'uniform2iv',
    
    Float3: 'uniform3f',
    Float3Array: 'uniform3fv',

    Int3: 'uniform3i',
    Int3Array: 'uniform3iv',
    
    Float4: 'uniform4f',
    Float4Array: 'uniform4fv',

    Int4: 'uniform4i',
    Int4Array: 'uniform4iv',
}
Object.defineProperty(UniformTypes, '_values', {
    value: new Set(Object.values(UniformTypes)),
    writable: false,
});
Object.freeze(UniformTypes);

// attach uniform types to effect
Effect.UniformTypes = UniformTypes;

// define uniform binds - connect uniform name to special usage, like key texture, etc.
Effect.UniformBinds = {
    MainTexture: 'texture',     // bind uniform to be used as the main texture.
    Color: 'color',             // bind uniform to be used as a main color.
    Projection: 'projection',   // bind uniform to be used as the projection matrix.
    World: 'world',             // bind uniform to be used as the world matrix.
    UvOffset: 'uvOffset',       // bind uniform to be used as UV offset.
    UvScale: 'uvScale',         // bind uniform to be used as UV scale.
};
Object.freeze(Effect.UniformBinds);

// define attribute value types.
Effect.AttributeTypes = {
    Byte: 'BYTE',
    Short: 'SHORT',
    UByte: 'UNSIGNED_BYTE',
    UShort: 'UNSIGNED_SHORT',
    Float: 'FLOAT',
    HalfFloat: 'HALF_FLOAT',
};
Object.freeze(Effect.AttributeTypes);

// define attribute binds - connect attribute name to special usage, like position, uvs, etc.
Effect.AttributeBinds = {
    Position: 'position',   // bind attribute to be used for vertices position array.
    TextureCoords: 'uvs',   // bind attribute to be used for texture coords array.
    Colors: 'colors',       // bind attribute to be used for vertices colors array.
}
Object.freeze(Effect.AttributeBinds);


/**
 * Set texture mag and min filters.
 * @private
 * @param {TextureFilterModes} filter Texture filter to set.
 */
function _setTextureFilter(gl, filter)
{
    if (!TextureFilterModes._values.has(filter)) { throw new Error("Invalid texture filter mode! Please pick a value from 'TextureFilterModes'."); }
    let glMode = gl[filter];
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, glMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, glMode);
}

/**
 * Set texture wrap mode on X and Y axis.
 * @private
 * @param {TextureWrapMode} wrapX Wrap mode on X axis.
 * @param {TextureWrapMode} wrapY Wrap mode on Y axis.
 */
 function _setTextureWrapMode(gl, wrapX, wrapY)
{
    if (wrapY === undefined) { wrapY = wrapX; }
    if (!TextureWrapModes._values.has(wrapX)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
    if (!TextureWrapModes._values.has(wrapY)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapX]);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapY]);
}


// export the effect class.
module.exports = Effect;
},{"../../assets/texture_asset.js":9,"../../logger.js":45,"../../utils/color.js":54,"../../utils/rectangle.js":61,"../matrix.js":30,"../texture_filter_modes":37,"../texture_wrap_modes":38}],26:[function(require,module,exports){
/**
 * Include all built-in effects.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

 module.exports = {
    Effect: require('./effect'),
    BasicEffect: require('./basic'),
    MsdfFontEffect: require('./msdf_font'),
 }
},{"./basic":24,"./effect":25,"./msdf_font":27}],27:[function(require,module,exports){
/**
 * Implement an effect to draw MSDF font textures.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\effects\msdf_font.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Effect = require("./effect");

// vertex shader code
const vertexShader = `#version 300 es
in vec3 a_position;
in vec2 a_coord;
in vec4 a_color;

uniform mat4 u_projection;
uniform mat4 u_world;

out vec2 v_texCoord;
out vec4 v_color;

void main(void) {
    gl_Position = u_projection * u_world * vec4(a_position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = a_coord;
    v_color = a_color;
}`;

// fragment shader code
const fragmentShader = `#version 300 es
precision highp float;

uniform sampler2D u_texture;

in vec2 v_texCoord;
in vec4 v_color;

out vec4 FragColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main(void) {
  vec3 _sample = texture(u_texture, v_texCoord).rgb;
  float sigDist = median(_sample.r, _sample.g, _sample.b) - 0.5;
  float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
  // float alpha = clamp((sigDist / (fwidth(sigDist) * 1.5)) + 0.5, 0.0, 1.0);

  vec3 color = v_color.rgb * alpha;
  FragColor = vec4(color, alpha) * v_color.a;
}`;

/**
 * Default effect to draw MSDF font textures.
 */
class MsdfFontEffect extends Effect
{
    /** @inheritdoc */
    get vertexCode() 
    { 
        return vertexShader; 
    }

    /** @inheritdoc */
    get fragmentCode()
    { 
        return fragmentShader;
    }

    /** @inheritdoc */
    get uniformTypes()
    {
        return {
            "u_texture": { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
            "u_projection": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
            "u_world": { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
        };
    }

    /** @inheritdoc */
    get attributeTypes()
    {
        return {
            "a_position": { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
            "a_coord": { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
            "a_color": { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
        };
    }
}


// export the basic shader
module.exports = MsdfFontEffect;
},{"./effect":25}],28:[function(require,module,exports){
/**
 * Implement the gfx manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\gfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const IManager = require('../manager.js');
const Color = require('../utils/color.js');
const { BlendMode, BlendModes } = require('./blend_modes.js');
const Rectangle = require('../utils/rectangle.js');
const { Effect, BasicEffect, MsdfFontEffect } = require('./effects');
const TextureAsset = require('../assets/texture_asset.js');
const { TextureFilterMode, TextureFilterModes } = require('./texture_filter_modes.js');
const { TextureWrapMode, TextureWrapModes } = require('./texture_wrap_modes.js');
const MeshGenerator = require('./mesh_generator.js');
const Matrix = require('./matrix.js');
const Camera = require('./camera.js');
const Sprite = require('./sprite.js');
const SpritesGroup = require('./sprites_group.js');
const Vector2 = require('../utils/vector2.js');
const FontTextureAsset = require('../assets/font_texture_asset.js');
const MsdfFontTextureAsset = require('../assets/msdf_font_texture_asset.js');
const { TextAlignment, TextAlignments } = require('./text_alignments.js');
const Mesh = require('./mesh.js');
const Circle = require('../utils/circle.js');
const SpriteBatch = require('./sprite_batch.js');
const Vector3 = require('../utils/vector3.js');
const Vertex = require('./vertex');
const _whiteColor = Color.white;
const _logger = require('../logger.js').getLogger('gfx');


/**
 * Gfx is the graphics manager. 
 * Everything related to rendering and managing your game canvas goes here.
 * 
 * To access the Graphics manager you use `Shaku.gfx`. 
 */
class Gfx extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();
        this._gl = null;
        this._initSettings = { antialias: true, alpha: true, depth: false, premultipliedAlpha: true, desynchronized: false };
        this._canvas = null;
        this._lastBlendMode = null;
        this._activeEffect = null;
        this._camera = null;
        this._projection = null;
        this._currIndices = null;
        this._dynamicBuffers = null;
        this._fb = null;
        this.builtinEffects = {};
        this.meshes = {};
        this.defaultTextureFilter = TextureFilterModes.Nearest;
        this.defaultTextureWrapMode = TextureWrapModes.Clamp;
        this.whiteTexture = null;
        this._renderTarget = null;
        this._viewport = null;
        this._drawCallsCount = 0;
        this._drawQuadsCount = 0;
        this.spritesBatch = null;
        this._cachedRenderingRegion = {};
        this._webglVersion = 0;
    }

    /**
     * Get the init WebGL version.
     * @returns {Number} WebGL version number.
     */
    get webglVersion()
    {
        return this._webglVersion;
    }

    /**
     * Get how many sprites we can draw in a single batch.
     * @returns {Number} batch max sprites count.
     */
    get batchSpritesCount()
    {
        return 2048;
    }

    /**
     * Maximum number of vertices we allow when drawing lines.
     * @returns {Number} max vertices per lines strip.
     */
    get maxLineSegments()
    {
        return 512;
    }

    /**
     * Set WebGL init flags (passed as additional params to the getContext() call). 
     * You must call this *before* initializing *Shaku*.
     * 
     * By default, *Shaku* will init WebGL context with the following flags:
     * - antialias: true.
     * - alpha: true.
     * - depth: false.
     * - premultipliedAlpha: true.
     * - desynchronized: false.
     * @example
     * Shaku.gfx.setContextAttributes({ antialias: true, alpha: false });
     * @param {Dictionary} flags WebGL init flags to set.
     */
    setContextAttributes(flags)
    {
        if (this._gl) { throw new Error("Can't call setContextAttributes() after gfx was initialized!"); }
        this._initSettings = flags;
    }

    /**
     * Set the canvas element to initialize on.
     * You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.
     * @example
     * Shaku.gfx.setCanvas(document.getElementById('my-canvas')); 
     * @param {HTMLCanvasElement} element Canvas element to initialize on.
     */
    setCanvas(element)
    {
        if (this._gl) { throw new Error("Can't call setCanvas() after gfx was initialized!"); }
        this._canvas = element;
    }

    /**
     * Get the canvas element controlled by the gfx manager.
     * If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.
     * @example
     * document.body.appendChild(Shaku.gfx.canvas);
     * @returns {HTMLCanvasElement} Canvas we use for rendering.
     */
    get canvas()
    {
        return this._canvas;
    }

    /**
     * Get the Effect base class, which is required to implement custom effects.
     * @see Effect
     */
    get Effect()
    {
        return Effect;
    }

    /**
     * Get the default Effect class, which is required to implement custom effects that inherit and reuse parts from the default effect.
     * @see BasicEffect
     */
    get BasicEffect()
    {
        return BasicEffect;
    }
    
    /**
     * Get the Effect for rendering fonts with an MSDF texture.
     * @see MsdfFontEffect
     */
    get MsdfFontEffect()
    {
        return MsdfFontEffect;
    }    

    /**
     * Get the sprite class.
     * @see Sprite
     */
    get Sprite()
    {
        return Sprite;
    }

    /**
     * Get the sprites group object.
     * @see SpritesGroup
     */
    get SpritesGroup()
    {
        return SpritesGroup;
    }

    /**
     * Get the matrix object.
     * @see Matrix
     */
    get Matrix()
    {
        return Matrix;
    }

    /**
     * Get the vertex object.
     * @see Vertex
     */
    get Vertex()
    {
        return Vertex;
    }

    /**
     * Get the text alignments options.
     * * Left: align text to the left.
     * * Right: align text to the right.
     * * Center: align text to center.
     * @see TextAlignments
     */
    get TextAlignments()
    {
        return TextAlignments;
    }

    /**
     * Get the text alignments options.
     * This getter is deprecated, please use `TextAlignments` instead.
     * * Left: align text to the left.
     * * Right: align text to the right.
     * * Center: align text to center.
     * @deprecated
     * @see TextAlignments
     */
    get TextAlignment()
    {
        if (!this._TextAlignment_dep) {
            console.warn(`'gfx.TextAlignment' is deprecated and will be removed in future versions. Please use 'gfx.TextAlignments' instead.`);
            this._TextAlignment_dep = true;
        }
        return TextAlignments;
    }

    /**
     * Create and return a new camera instance.
     * @param {Boolean} withViewport If true, will create camera with viewport value equal to canvas' size.
     * @returns {Camera} New camera object.
     */
    createCamera(withViewport)
    {
        let ret = new Camera(this);
        if (withViewport) {
            ret.viewport = this.getRenderingRegion();
        }
        return ret;
    }

    /**
     * Set default orthographic camera from offset.
     * @param {Vector2} offset Camera top-left corner.
     * @returns {Camera} Camera instance.
     */
    setCameraOrthographic(offset)
    {
        let camera = this.createCamera();
        camera.orthographicOffset(offset);
        this.applyCamera(camera);
        return camera;
    }
    
    /**
     * Create and return an effect instance.
     * @see Effect
     * @param {Class} type Effect class type. Must inherit from Effect base class.
     * @returns {Effect} Effect instance.
     */
    createEffect(type)
    {
        if (!(type.prototype instanceof Effect)) { throw new Error("'type' must be a class type that inherits from 'Effect'."); }
        let effect = new type();
        effect._build(this._gl);
        return effect;
    }

    /**
     * Set resolution and canvas to the max size of its parent element or screen.
     * If the canvas is directly under document body, it will take the max size of the page.
     * @param {Boolean} limitToParent if true, will use parent element size. If false, will stretch on entire document.
     * @param {Boolean} allowOddNumbers if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers.
     */
    maximizeCanvasSize(limitToParent, allowOddNumbers)
    {
        // new width and height
        let width = 0;
        let height = 0;

        // parent
        if (limitToParent) {
            let parent = this._canvas.parentElement;
            width = parent.clientWidth - this._canvas.offsetLeft;
            height = parent.clientHeight - this._canvas.offsetTop;
        }
        // entire screen
        else {
            width = window.innerWidth;
            height = window.innerHeight;
            this._canvas.style.left = '0px';
            this._canvas.style.top = '0px';
        }

        // make sure even numbers
        if (!allowOddNumbers) {
            if (width % 2 !== 0) { width++; }
            if (height % 2 !== 0) { height++; }
        }

        // if changed, set resolution
        if ((this._canvas.width !== width) || (this._canvas.height !== height)) {
            this.setResolution(width, height, true);
        }
    }

    /**
     * Set a render target (texture) to render on.
     * @example
     * // create render target
     * let renderTarget = await Shaku.assets.createRenderTarget('_my_render_target', 800, 600);
     * 
     * // use render target
     * Shaku.gfx.setRenderTarget(renderTarget);
     * // .. draw some stuff here
     * 
     * // reset render target and present it on screen
     * // note the negative height - render targets end up with flipped Y axis
     * Shaku.gfx.setRenderTarget(null);
     * Shaku.gfx.draw(renderTarget, new Shaku.utils.Vector2(screenX / 2, screenY / 2), new Shaku.utils.Vector2(screenX, -screenY));
     * @param {TextureAsset|Array<TextureAsset>|null} texture Render target texture to set as render target, or null to reset and render back on canvas. Can also be array for multiple targets, which will take layouts 0-15 by their order.
     * @param {Boolean=} keepCamera If true, will keep current camera settings. If false (default) will reset camera.
     */
    setRenderTarget(texture, keepCamera)
    {
        // present buffered data
        this.presentBufferedData();

        // if texture is null, remove any render target
        if (texture === null) {
            this._renderTarget = null;
            //this._gl.drawBuffers([this._gl.BACK]);
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
            this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, false);
            if (!keepCamera) {
                this.resetCamera();
            }
            return;
        }

        // convert texture to array
        if (!(texture instanceof Array)) {
            texture = [texture];
        }

        // bind the framebuffer
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, this._fb);
        this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, false);
        
        // set render targets
        var drawBuffers = [];
        for (let index = 0; index < texture.length; ++index) {
            
            // attach the texture as the first color attachment
            const attachmentPoint = this._gl['COLOR_ATTACHMENT' + index];
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachmentPoint, this._gl.TEXTURE_2D, texture[index].texture, 0);

            // index 0 is the "main" render target
            if (index === 0) {
                this._renderTarget = texture[index];
            }

            // to set drawBuffers in the end
            drawBuffers.push(attachmentPoint);
        }

        // set draw buffers
        this._gl.drawBuffers(drawBuffers);

        // unbind frame buffer
        //this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

        // reset camera
        if (!keepCamera) {
            this.resetCamera();
        }
    }

    /**
     * Set effect to use for future draw calls.
     * @example
     * let effect = Shaku.gfx.createEffect(MyEffectType);
     * Shaku.gfx.useEffect(effect);
     * @param {Effect | null} effect Effect to use or null to use the basic builtin effect.
     */
    useEffect(effect)
    {
        // present buffered data
        this.presentBufferedData();

        // if null, use default
        if (effect === null) {
            this.useEffect(this.builtinEffects.Basic);
            return;
        }

        // same effect? skip
        if (this._activeEffect === effect) {
            return;
        }

        // set effect
        effect.setAsActive();
        this._activeEffect = effect;
        if (this._projection) { this._activeEffect.setProjectionMatrix(this._projection); }
    }

    /**
     * Set resolution and canvas size.
     * @example
     * // set resolution and size of 800x600.
     * Shaku.gfx.setResolution(800, 600, true);
     * @param {Number} width Resolution width.
     * @param {Number} height Resolution height.
     * @param {Boolean} updateCanvasStyle If true, will also update the canvas *css* size in pixels.
     */
    setResolution(width, height, updateCanvasStyle)
    {
        this.presentBufferedData();

        this._canvas.width = width;
        this._canvas.height = height;

        if (width % 2 !== 0 || height % 2 !== 0) {
            _logger.warn("Resolution to set is not even numbers; This might cause minor artefacts when using texture atlases. Consider using even numbers instead.");
        }
        
        if (updateCanvasStyle) {
            this._canvas.style.width = width + 'px';
            this._canvas.style.height = height + 'px';
        }

        this._gl.viewport(0, 0, width, height);
        this.resetCamera();
    }

    /**
     * Reset camera properties to default camera.
     */
    resetCamera()
    {
        this._camera = this.createCamera();
        let size = this.getRenderingSize();
        this._camera.orthographic(new Rectangle(0, 0, size.x, size.y));
        this.applyCamera(this._camera);
    }

    /**
     * Set viewport, projection and other properties from a camera instance.
     * Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.
     * @param {Camera} camera Camera to apply.
     */
    applyCamera(camera)
    {
        // render what we got in back buffer
        this.presentBufferedData();

        // set viewport and projection
        this._viewport = camera.viewport;
        let viewport = this.__getRenderingRegionInternal(true);
        this._gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
        this._projection = camera.projection.clone();

        // update effect
        if (this._activeEffect) { 
            this._activeEffect.setProjectionMatrix(this._projection); 
        }

        // reset cached rendering region
        this.__resetCachedRenderingRegion();
    }

    /**
     * Get current rendering region.
     * @private
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    __getRenderingRegionInternal(includeOffset)
    {
        // cached with offset
        if (includeOffset && this._cachedRenderingRegion.withOffset) {
            return this._cachedRenderingRegion.withOffset;
        }

        // cached without offset
        if (!includeOffset && this._cachedRenderingRegion.withoutOffset) {
            return this._cachedRenderingRegion.withoutOffset;
        }

        // if we got viewport..
        if (this._viewport) {

            // get region from viewport
            let ret = this._viewport.clone();

            // if without offset, remove it
            if (includeOffset === false) {
                ret.x = ret.y = 0;
                this._cachedRenderingRegion.withoutOffset = ret;
                return ret;
            }
            // else, include offset
            else {
                this._cachedRenderingRegion.withOffset = ret;
                return ret;
            }
        }

        // if we don't have viewport..
        let ret = new Rectangle(0, 0, (this._renderTarget || this._canvas).width, (this._renderTarget || this._canvas).height);
        this._cachedRenderingRegion.withoutOffset = this._cachedRenderingRegion.withOffset = ret;
        return ret;
    }

    /**
     * Reset cached rendering region values.
     * @private
     */
    __resetCachedRenderingRegion()
    {
        this._cachedRenderingRegion.withoutOffset = this._cachedRenderingRegion.withOffset = null;
    }

    /**
     * Get current rendering region.
     * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
     * @returns {Rectangle} Rectangle with rendering region.
     */
    getRenderingRegion(includeOffset)
    {
        return this.__getRenderingRegionInternal(includeOffset).clone();
    }

    /**
     * Get current rendering size.
     * Unlike 'canvasSize', this takes viewport and render target into consideration.
     * @returns {Vector2} rendering size.
     */
    getRenderingSize()
    {
        let region = this.__getRenderingRegionInternal();
        return region.getSize();
    }
    
    /**
     * Get canvas size as vector.
     * @returns {Vector2} Canvas size.
     */
    getCanvasSize()
    {
        return new Vector2(this._canvas.width, this._canvas.height);
    }

    /** 
     * @inheritdoc
     * @private
     */
    setup()
    {        
        return new Promise(async (resolve, reject) => {  

            _logger.info("Setup gfx manager..");

            // if no canvas is set, create one
            if (!this._canvas) {
                this._canvas = document.createElement('canvas');
            }

            // get webgl context
            this._gl = this._canvas.getContext('webgl2', this._initSettings); 
            this._webglVersion = 2;
            
            // no webgl2? try webgl1
            if (!this._gl) {
                _logger.warn("Failed to init WebGL2, attempt fallback to WebGL1.");
                this._gl = this._canvas.getContext('webgl', this._initSettings);
                this._webglVersion = 1;
            }

            // no webgl at all??
            if (!this._gl) {
                this._webglVersion = 0;
                _logger.error("Can't get WebGL context!");
                return reject("Failed to get WebGL context from canvas!");
            }

            // create default effects
            this.builtinEffects.Basic = this.createEffect(BasicEffect);
            this.builtinEffects.MsdfFont = this.createEffect(MsdfFontEffect);

            // setup textures assets gl context
            TextureAsset._setWebGl(this._gl);

            // create framebuffer (used for render targets)
            this._fb = this._gl.createFramebuffer();

            // create base meshes
            let _meshGenerator = new MeshGenerator(this._gl);
            this.meshes = {
                quad: _meshGenerator.quad()
            }
            Object.freeze(this.meshes);

            // create a useful single white pixel texture
            let whitePixelImage = new Image();
            whitePixelImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
            await new Promise((resolve, reject) => { whitePixelImage.onload = resolve; });
            this.whiteTexture = new TextureAsset('__runtime_white_pixel__');
            this.whiteTexture.fromImage(whitePixelImage);

            // dynamic buffers, used for batch rendering
            this._dynamicBuffers = {
                
                positionBuffer: this._gl.createBuffer(),
                positionArray: new Float32Array(3 * 4 * this.batchSpritesCount),

                textureCoordBuffer: this._gl.createBuffer(),
                textureArray: new Float32Array(2 * 4 * this.batchSpritesCount),

                colorsBuffer: this._gl.createBuffer(),
                colorsArray: new Float32Array(4 * 4 * this.batchSpritesCount),

                indexBuffer: this._gl.createBuffer(),

                linesIndexBuffer: this._gl.createBuffer(),
            }

            // create the indices buffer for batching
            let indices = new Uint16Array(this.batchSpritesCount * 6); // 6 = number of indices per sprite
            let inc = 0;
            for(let i = 0; i < indices.length; i += 6) {
                
                indices[i] = inc;
                indices[i+1] = inc + 1;
                indices[i+2] = inc + 2;

                indices[i+3] = inc + 1;
                indices[i+4] = inc + 3;
                indices[i+5] = inc + 2;

                inc += 4;
            }
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.indexBuffer);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, indices, this._gl.STATIC_DRAW);

            // create the indices buffer for drawing lines
            let lineIndices = new Uint16Array(this.maxLineSegments);
            for (let i = 0; i < lineIndices.length; i += 6) {          
                lineIndices[i] = i;
            }
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.linesIndexBuffer);
            this._gl.bufferData(this._gl.ELEMENT_ARRAY_BUFFER, lineIndices, this._gl.STATIC_DRAW);
            
            // create sprites batch
            this.spritesBatch = new SpriteBatch(this);

            // use default effect
            this.useEffect(null);

            // create default camera
            this._camera = this.createCamera();
            this.applyCamera(this._camera);

            // success!
            resolve();
        });
    }

    /**
     * Generate a sprites group to render a string using a font texture.
     * Take the result of this method and use with gfx.drawGroup() to render the text.
     * This is what you use when you want to draw texts with `Shaku`.
     * Note: its best to always draw texts with *batching* enabled.
     * @example
     * // load font texture
     * let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});
     * 
     * // generate 'hello world!' text (note: you don't have to regenerate every frame if text didn't change)
     * let text1 = Shaku.gfx.buildText(fontTexture, "Hello World!");
     * text1.position.set(40, 40);
     * 
     * // draw text
     * Shaku.gfx.drawGroup(text1, true);
     * @param {FontTextureAsset} fontTexture Font texture asset to use.
     * @param {String} text Text to generate sprites for.
     * @param {Number=} fontSize Font size, or undefined to use font texture base size.
     * @param {Color|Array<Color>=} color Text sprites color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {TextAlignment=} alignment Text alignment.
     * @param {Vector2=} offset Optional starting offset.
     * @param {Vector2=} marginFactor Optional factor for characters and line spacing. For example value of 2,1 will make double horizontal spacing. 
     * @returns {SpritesGroup} Sprites group containing the needed sprites to draw the given text with its properties.
     */
    buildText(fontTexture, text, fontSize, color, alignment, offset, marginFactor)
    {
        // make sure text is a string
        if (typeof text !== 'string') {
            text = '' + text;
        }

        // sanity
        if (!fontTexture || !fontTexture.valid) {
            throw new Error("Font texture is invalid!");
        }

        // default alignment
        alignment = alignment || TextAlignments.Left;

        // default color
        color = color || Color.black;

        // default font size
        fontSize = fontSize || fontTexture.fontSize;

        // default margin factor
        marginFactor = marginFactor || Vector2.one;

        // get character scale factor
        let scale = fontSize / fontTexture.fontSize;

        // current character offset
        let position = new Vector2(0, 0);

        // current line characters and width
        let currentLineSprites = [];
        let lineWidth = 0;

        // go line down
        function breakLine()
        {
            // add offset to update based on alignment
            let offsetX = 0;
            switch (alignment) {

                case TextAlignments.Right:
                    offsetX = -lineWidth;
                    break;

                case TextAlignments.Center:
                    offsetX = -lineWidth / 2;
                    break;

            }

            // if we need to shift characters for alignment, do it
            if (offsetX != 0) {
                for (let i = 0; i < currentLineSprites.length; ++i) {
                    currentLineSprites[i].position.x += offsetX;
                }
            }

            // update offset
            position.x = 0;
            position.y += fontTexture.lineHeight * scale * marginFactor.y;

            // reset line width and sprites
            currentLineSprites = [];
            lineWidth = 0;
        }

        // create group to return and build sprites
        let ret = new SpritesGroup();
        for (let i = 0; i < text.length; ++i) 
        {
            // get character and source rect
            let character = text[i];
            let sourceRect = fontTexture.getSourceRect(character);

            // special case - break line
            if (character === '\n') {
                breakLine();
                continue;
            }

            // calculate character size
            let size = new Vector2(sourceRect.width * scale, sourceRect.height * scale);

            // create sprite (unless its space)
            if (character !== ' ') {

                // create sprite and add to group
                let sprite = new Sprite(fontTexture.texture, sourceRect);
                sprite.size = size;
                if (fontTexture instanceof MsdfFontTextureAsset) {
                    sprite.origin.set(0, 0);
                }
                else {
                    sprite.origin.set(0.5, 0.5);
                }
                sprite.position.copy(position).addSelf(fontTexture.getPositionOffset(character).mul(scale));
                if (color instanceof Color) {
                    sprite.color.copy(color);
                }
                else {
                    sprite.color = [];
                    for (let col of color) {
                        sprite.color.push(col.clone());
                    }
                }
                sprite.origin.x = 0;
                ret.add(sprite);

                // add to current line sprites
                currentLineSprites.push(sprite);
            }

            let moveCursorAmount = fontTexture.getXAdvance(character) * scale * marginFactor.x;

            // update current line width
            lineWidth += moveCursorAmount;

            // set position for next character
            position.x += moveCursorAmount;
        }

        // call break line on last line, to adjust alignment for last line
        breakLine();

        // set position
        if (offset) {
            ret.position.set(offset.x, offset.y);
        }

        // return group
        return ret;
    }

    /**
     * Draw a SpritesGroup object. 
     * A SpritesGroup is a collection of sprites we can draw in bulks with transformations to apply on the entire group.
     * @example
     * // load texture
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     * 
     * // create group and set entire group's position and scale
     * let group = new Shaku.gfx.SpritesGroup();
     * group.position.set(125, 300);
     * group.scale.set(2, 2);
     *
     * // create 5 sprites and add to group
     * for (let i = 0; i < 5; ++i) {
     *   let sprite = new Shaku.gfx.Sprite(texture);
     *   sprite.position.set(100 * i, 150);
     *   sprite.size.set(50, 50);
     *   group.add(sprite)
     * }
     * 
     * // draw the group with automatic culling of invisible sprites
     * Shaku.gfx.drawGroup(group, true);
     * @param {SpritesGroup} group Sprites group to draw.
     * @param {Boolean} cullOutOfScreen If true and in batching mode, will cull automatically any quad that is completely out of screen.
     */
    drawGroup(group, cullOutOfScreen)
    {
        this._drawBatch(group, Boolean(cullOutOfScreen));
    }

    /**
     * Draw a single sprite object.
     * Sprites are optional objects that store all the parameters for a `draw()` call. They are also used for batch rendering.
     * @example
     * // load texture and create sprite
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     * let sprite = new Shaku.gfx.Sprite(texture);
     * 
     * // set position and size
     * sprite.position.set(100, 150);
     * sprite.size.set(50, 50);
     * 
     * // draw sprite
     * Shaku.gfx.drawSprite(sprite);
     * @param {Sprite} sprite Sprite object to draw.
     */
    drawSprite(sprite)
    {
        if (!sprite.texture || !sprite.texture.valid) { return; }
        this.__startDrawingSprites(this._activeEffect, null);
        this.spritesBatch.draw(sprite);
    }

    /**
     * Draw a texture to cover a given destination rectangle.
     * @example
     * // cover the entire screen with an image
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     * Shaku.gfx.cover(texture, Shaku.gfx.getRenderingRegion());
     * @example
     * // draw with additional params
     * let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
     * let color = Shaku.utils.Color.blue;
     * let blendMode = Shaku.gfx.BlendModes.Multiply;
     * let rotation = Math.PI / 4;
     * let origin = new Shaku.utils.Vector2(0.5, 0.5);
     * Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
     * @param {TextureAsset} texture Texture to draw.
     * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
     * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {BlendMode=} blendMode Blend mode, or undefined to use alpha blend.
     */
    cover(texture, destRect, sourceRect, color, blendMode)
    {
        if ((destRect instanceof Vector2) || (destRect instanceof Vector3)) {
            destRect = new Rectangle(0, 0, destRect.x, destRect.y);
        }
        return this.draw(texture, destRect.getCenter(), destRect.getSize(), sourceRect, color, blendMode);
    }

    /**
     * Draw a texture.
     * @example
     * // a simple draw with position and size
     * let texture = await Shaku.assets.loadTexture('assets/sprite.png');
     * let position = new Shaku.utils.Vector2(100, 100);
     * let size = new Shaku.utils.Vector2(75, 125); // if width == height, you can pass as a number instead of vector
     * Shaku.gfx.draw(texture, position, size);
     * @example
     * // draw with additional params
     * let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
     * let color = Shaku.utils.Color.blue;
     * let blendMode = Shaku.gfx.BlendModes.Multiply;
     * let rotation = Math.PI / 4;
     * let origin = new Shaku.utils.Vector2(0.5, 0.5);
     * Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
     * @param {TextureAsset} texture Texture to draw.
     * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
     * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
     * @param {Rectangle} sourceRect Source rectangle, or undefined to use the entire texture.
     * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {BlendMode=} blendMode Blend mode, or undefined to use alpha blend.
     * @param {Number=} rotation Rotate sprite.
     * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
     * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
     */
    draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, skew)
    {
        let sprite = new Sprite(texture, sourceRect);
        sprite.position = position;
        sprite.size = (typeof size === 'number') ? new Vector2(size, size) : size;
        if (color) { sprite.color = color; }
        if (blendMode) { sprite.blendMode = blendMode; }
        if (rotation !== undefined) { sprite.rotation = rotation; }
        if (origin) { sprite.origin = origin; }
        if (skew) { sprite.skew = skew; }
        this.drawSprite(sprite);
    }

    /**
     * Draw a textured quad from vertices.
     * @param {TextureAsset} texture Texture to draw.
     * @param {Array<Vertex>} vertices Quad vertices to draw (should be: top-left, top-right, bottom-left, bottom-right).
     * @param {BlendMode=} blendMode Blend mode to set.
     */
    drawQuadFromVertices(texture, vertices, blendMode)
    {
        if (!texture || !texture.valid) { return; }
        this.__startDrawingSprites(this._activeEffect, null);
        this._setBlendMode(blendMode || BlendModes.AlphaBlend);
        this.spritesBatch.setTexture(texture);
        this.spritesBatch.pushVertices(vertices);
    }

    /**
     * Draw a filled colored rectangle.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.fillRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Rectangle} destRect Rectangle to fill.
     * @param {Color|Array<Color>} color Rectangle fill color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} rotation Rotate the rectangle around its center.
     */
    fillRect(destRect, color, blend, rotation)
    {
        this.draw(this.whiteTexture, 
            new Vector2(destRect.x + destRect.width / 2, destRect.y + destRect.height / 2),
            new Vector2(destRect.width, destRect.height), null, color, blend || BlendModes.Opaque, rotation, null, null);
    }

    /**
     * Draw a list of filled colored rectangles as a batch.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.fillRects([new Shaku.utils.Rectangle(100, 100, 50, 50), new Shaku.utils.Rectangle(150, 150, 25, 25)], Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Array<Rectangle>} destRects Rectangles to fill.
     * @param {Array<Color>|Color} colors Rectangles fill color. If array is set, will assign each color to different vertex, starting from top-left.
     * @param {BlendMode=} blend Blend mode.
     * @param {(Array<Number>|Number)=} rotation Rotate the rectangles around its center.
     */
    fillRects(destRects, colors, blend, rotation)
    {
        // build group
        if (rotation === undefined) { rotation = 0; }
        let group = new SpritesGroup();
        for (let i = 0; i < destRects.length; ++i) {
            let sprite = new Sprite(this.whiteTexture);
            sprite.color = colors[i] || colors;
            sprite.rotation = rotation.length ? rotation[i] : rotation;
            sprite.blendMode = blend || BlendModes.Opaque;
            let destRect = destRects[i];
            sprite.size.set(destRect.width, destRect.height);
            sprite.position.set(destRect.x + destRect.width / 2, destRect.y + destRect.width / 2);
            sprite.origin.set(0.5, 0.5);
            group.add(sprite);
        }

        // draw group
        this.drawGroup(group);
    }

    /**
     * Draw an outline colored rectangle.
     * @example
     * // draw a 50x50 red rectangle at position 100x100, that will rotate over time
     * Shaku.gfx.outlineRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
     * @param {Rectangle} destRect Rectangle to draw outline for.
     * @param {Color} color Rectangle outline color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} rotation Rotate the rectangle around its center.
     */
    outlineRect(destRect, color, blend, rotation)
    {
        // get corners
        let topLeft = destRect.getTopLeft();
        let topRight = destRect.getTopRight();
        let bottomRight = destRect.getBottomRight();
        let bottomLeft = destRect.getBottomLeft();

        // rotate vertices
        if (rotation) {

            // center rect
            let center = destRect.getCenter();
            topLeft.subSelf(center);
            topRight.subSelf(center);
            bottomLeft.subSelf(center);
            bottomRight.subSelf(center);

            // do rotation
            let cos = Math.cos(rotation);
            let sin = Math.sin(rotation);
            function rotateVec(vector)
            {
                let x = (vector.x * cos - vector.y * sin);
                let y = (vector.x * sin + vector.y * cos);
                vector.set(x, y);
            }
            rotateVec(topLeft);
            rotateVec(topRight);
            rotateVec(bottomLeft);
            rotateVec(bottomRight);

            // return to original position
            topLeft.addSelf(center);
            topRight.addSelf(center);
            bottomLeft.addSelf(center);
            bottomRight.addSelf(center);
        }
        
        // draw rectangle with lines strip
        this.drawLinesStrip([topLeft, topRight, bottomRight, bottomLeft], color, blend, true);
    }

    /**
     * Draw an outline colored circle.
     * @example
     * // draw a circle at 50x50 with radius of 85
     * Shaku.gfx.outlineCircle(new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), Shaku.utils.Color.red);
     * @param {Circle} circle Circle to draw.
     * @param {Color} color Circle outline color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
     */
    outlineCircle(circle, color, blend, lineAmount)
    {
        // defaults
        if (lineAmount === undefined) { lineAmount = 32; }

        // generate list of lines to draw circle
        let lines = [];
        const twicePi = 2 * Math.PI;
        for (let i = 0; i <= lineAmount; i++) {
            let point = new Vector2(
                circle.center.x + (circle.radius * Math.cos(i * twicePi / lineAmount)), 
                circle.center.y + (circle.radius * Math.sin(i * twicePi / lineAmount))
            );
            lines.push(point);
        }

        // draw lines
        this.drawLinesStrip(lines, color, blend);
    }

    /**
     * Draw a filled colored circle.
     * @example
     * // draw a filled circle at 50x50 with radius of 85
     * Shaku.gfx.fillCircle(new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), Shaku.utils.Color.red);
     * @param {Circle} circle Circle to draw.
     * @param {Color} color Circle fill color.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
     */
    fillCircle(circle, color, blend, lineAmount)
    {
        // defaults
        if (lineAmount === undefined) { lineAmount = 32; }

        // generate list of lines to draw circle
        let lines = [circle.center];
        const twicePi = 2 * Math.PI;
        for (let i = 0; i <= lineAmount; i++) {
            let point = new Vector2(
                circle.center.x + (circle.radius * Math.cos(i * twicePi / lineAmount)), 
                circle.center.y + (circle.radius * Math.sin(i * twicePi / lineAmount))
            );
            lines.push(point);
        }

        // prepare effect and buffers
        let gl = this._gl;
        this._fillShapesBuffer(lines, color, blend, (verts) => {
            gl.drawArrays(gl.TRIANGLE_FAN, 0, verts.length);
            this._drawCallsCount++;
        }, true, 1);
    }

    /**
     * Draw a list of filled colored circles using batches.
     * @example
     * // draw a filled circle at 50x50 with radius of 85
     * Shaku.gfx.fillCircles([new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), new Shaku.utils.Circle(new Shaku.utils.Vector2(150, 125), 35)], Shaku.utils.Color.red);
     * @param {Array<Circle>} circles Circles list to draw.
     * @param {Color|Array<Color>} colors Circles fill color or a single color for all circles.
     * @param {BlendMode=} blend Blend mode.
     * @param {Number=} lineAmount How many lines to compose the circle from (bigger number = smoother circle).
     */
    fillCircles(circles, colors, blend, lineAmount)
    {
        // defaults
        if (lineAmount === undefined) { lineAmount = 32; }

        // build vertices and colors arrays
        let vertsArr = [];
        let colorsArr = colors.length ? [] : null;

        // generate vertices and colors
        for (let i = 0; i < circles.length; ++i) {

            let circle = circles[i];
            let color = colors[i] || colors;

            const twicePi = 2 * Math.PI;
            for (let i = 0; i <= lineAmount; i++) {

                // set vertices
                vertsArr.push(new Vector2(
                    circle.center.x + (circle.radius * Math.cos(i * twicePi / lineAmount)), 
                    circle.center.y + (circle.radius * Math.sin(i * twicePi / lineAmount))
                ));
                vertsArr.push(new Vector2(
                    circle.center.x + (circle.radius * Math.cos((i+1) * twicePi / lineAmount)), 
                    circle.center.y + (circle.radius * Math.sin((i+1) * twicePi / lineAmount))
                ));
                vertsArr.push(circle.center);

                // set colors
                if (colorsArr) {
                    colorsArr.push(color);
                    colorsArr.push(color);
                    colorsArr.push(color);
                }
            }
        }

        // prepare effect and buffers
        let gl = this._gl;
        this._fillShapesBuffer(vertsArr, colorsArr || colors, blend, (verts) => {
            gl.drawArrays(gl.TRIANGLES, 0, verts.length);
            this._drawCallsCount++;
        }, false, 3);
    }

    /**
     * Draw a single line between two points.
     * @example
     * Shaku.gfx.drawLine(new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), Shaku.utils.Color.red);
     * @param {Vector2} startPoint Line start point.
     * @param {Vector2} endPoint Line end point.
     * @param {Color} color Line color.
     * @param {BlendMode=} blendMode Blend mode to draw lines with (default to Opaque).
     */
    drawLine(startPoint, endPoint, color, blendMode)
    {
        return this.drawLines([startPoint, endPoint], color, blendMode, false);
    }

    /**
     * Draw a strip of lines between an array of points.
     * @example
     * let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
     * let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
     * Shaku.gfx.drawLinesStrip(lines, colors);
     * @param {Array<Vector2>} points Points to draw line between.
     * @param {Color|Array<Color>} colors Single lines color if you want one color for all lines, or an array of colors per segment.
     * @param {BlendMode=} blendMode Blend mode to draw lines with (default to Opaque).
     * @param {Boolean=} looped If true, will also draw a line from last point back to first point.
     */
    drawLinesStrip(points, colors, blendMode, looped)
    {
        // prepare effect and buffers
        let gl = this._gl;

        // do loop - note: we can't use gl.LINE_LOOPED in case we need multiple buffers inside '_fillShapesBuffer' which will invoke more than one draw
        if (looped) {
            points = points.slice(0);
            points.push(points[0]);
            if (colors && colors.length) {
                colors = colors.slice(0);
                colors.push(colors[0]);
            }
        }

        // draw lines
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
            gl.drawArrays(gl.LINE_STRIP, 0, verts.length);
            this._drawCallsCount++;
        }, true, 2);
    }

    /**
     * Draw a list of lines from an array of points.
     * @example
     * let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
     * let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
     * Shaku.gfx.drawLines(lines, colors);
     * @param {Array<Vector2>} points Points to draw line between.
     * @param {Color|Array<Color>} colors Single lines color if you want one color for all lines, or an array of colors per segment.
     * @param {BlendMode=} blendMode Blend mode to draw lines with (default to Opaque).
     */
    drawLines(points, colors, blendMode)
    {
        // prepare effect and buffers
        let gl = this._gl;
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
            gl.drawArrays(gl.LINES, 0, verts.length);
            this._drawCallsCount++;
        }, true, 2);
    }

    /**
     * Draw a single point from vector.
     * @example
     * Shaku.gfx.drawPoint(new Shaku.utils.Vector2(50,50), Shaku.utils.Color.random());
     * @param {Vector2} point Point to draw.
     * @param {Color} color Point color.
     * @param {BlendMode=} blendMode Blend mode to draw point with (default to Opaque).
     */
    drawPoint(point, color, blendMode)
    {
        return this.drawPoints([point], [color], blendMode);
    }

    /**
     * Draw a list of points from an array of vectors.
     * @example
     * let points = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
     * let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
     * Shaku.gfx.drawPoints(points, colors);
     * @param {Array<Vector2>} points Points to draw.
     * @param {Color|Array<Color>} colors Single color if you want one color for all points, or an array of colors per point.
     * @param {BlendMode=} blendMode Blend mode to draw points with (default to Opaque).
     */
    drawPoints(points, colors, blendMode)
    {
        let gl = this._gl;
        this._fillShapesBuffer(points, colors, blendMode, (verts) => {
            gl.drawArrays(gl.POINTS, 0, verts.length);
            this._drawCallsCount++;
        }, false, 1);
    }

    /**
     * Make the renderer canvas centered.
     */
    centerCanvas()
    {
        let canvas = this._canvas;
        let parent = canvas.parentElement;
        let pwidth = Math.min(parent.clientWidth, window.innerWidth);
        let pheight = Math.min(parent.clientHeight, window.innerHeight);
        canvas.style.left = Math.round(pwidth / 2 - canvas.clientWidth / 2) + 'px';
        canvas.style.top = Math.round(pheight / 2 - canvas.clientHeight / 2) + 'px';
        canvas.style.display = 'block';
        canvas.style.position = 'relative';
    }
        
    /**
     * Check if a given shape is currently in screen bounds, not taking camera into consideration.
     * @param {Circle|Vector|Rectangle|Line} shape Shape to check.
     * @returns {Boolean} True if given shape is in visible region.
     */
    inScreen(shape)
    {
        let region = this.__getRenderingRegionInternal();

        if (shape instanceof Circle) {
            return region.collideCircle(shape);
        }
        else if (shape instanceof Vector2) {
            return region.containsVector(shape);
        }
        else if (shape instanceof Rectangle) {
            return region.collideRect(shape);
        }
        else if (shape instanceof Line) {
            return region.collideLine(shape);
        }
        else {
            throw new Error("Unknown shape type to check!");
        }
    }

    /**
     * Make a given vector the center of the camera.
     * @param {Vector2} position Camera position.
     * @param {Boolean} useCanvasSize If true, will always use cancas size when calculating center. If false and render target is set, will use render target's size.
     */
    centerCamera(position, useCanvasSize)
    {
        let renderSize = useCanvasSize ? this.getCanvasSize() : this.getRenderingSize();
        let halfScreenSize = renderSize.mul(0.5);
        let centeredPos = position.sub(halfScreenSize);
        this.setCameraOrthographic(centeredPos);
    }
        
    /**
     * Prepare buffers, effect and blend mode for shape rendering.
     * @private
     */
    _fillShapesBuffer(points, colors, blendMode, onReady, isStrip, groupsSize)
    {
        // finish whatever we were drawing before
        this.presentBufferedData();

        // some defaults
        colors = colors || _whiteColor;
        blendMode = blendMode || BlendModes.Opaque;

        // sanity - make sure colors and vertices match
        if (colors.length !== undefined && colors.length !== points.length) {
            _logger.error("When drawing shapes with colors array, the colors array and points array must have the same length!");
            return;
        }

        // calculate actual max buffer size
        let maxWithMargin = isStrip ? (this.maxLineSegments-1) : this.maxLineSegments;
        if (groupsSize != 1) {
            while (maxWithMargin % groupsSize !== 0) { maxWithMargin--; }
        }

        // if we have too many vertices, break to multiple calls
        if (points.length > maxWithMargin) {
            let sliceI = 0;
            while (true) {
                let start = sliceI * maxWithMargin;
                let end = start + maxWithMargin;
                if (isStrip && sliceI > 0) { start--; }
                let subpoints = points.slice(start, end);
                if (subpoints.length === 0) { break; }
                let subcolors = (colors && colors.length) ? colors.slice(start, end) : colors;
                this._fillShapesBuffer(subpoints, subcolors, blendMode, onReady, isStrip, groupsSize);
                sliceI++;
            }
            return;
        }

       // basic params
       let gl = this._gl;
       let positionsBuff = this._dynamicBuffers.positionArray;
       let colorsBuff = this._dynamicBuffers.colorsArray;

       for (let i = 0; i < points.length; ++i) {

           // set positions
           positionsBuff[i*3 + 0] = points[i].x;
           positionsBuff[i*3 + 1] = points[i].y;
           positionsBuff[i*3 + 2] = points[i].z || 0;
           
           // set colors
           let color = colors[i] || colors;
           colorsBuff[i*4 + 0] = color.r;
           colorsBuff[i*4 + 1] = color.g;
           colorsBuff[i*4 + 2] = color.b;
           colorsBuff[i*4 + 3] = color.a;
       }

       // set blend mode if needed
       this._setBlendMode(blendMode);

       // prepare effect and texture
       let mesh = new Mesh(this._dynamicBuffers.positionBuffer, null, this._dynamicBuffers.colorsBuffer, this._dynamicBuffers.indexBuffer, points.length);
       this._activeEffect.prepareToDrawBatch(mesh, Matrix.identity);
       this._setActiveTexture(this.whiteTexture);

       // should we slice the arrays to more optimal size?
       let shouldSliceArrays = points.length <= 8;

       // copy position buffer
       this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.positionBuffer);
       this._gl.bufferData(this._gl.ARRAY_BUFFER, 
           shouldSliceArrays ? this._dynamicBuffers.positionArray.slice(0, points.length * 3) : this._dynamicBuffers.positionArray, 
           this._gl.DYNAMIC_DRAW);

       // copy color buffer
       this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._dynamicBuffers.colorsBuffer);
       this._gl.bufferData(this._gl.ARRAY_BUFFER, 
           shouldSliceArrays ? this._dynamicBuffers.colorsArray.slice(0, points.length * 4) : this._dynamicBuffers.colorsArray, 
           this._gl.DYNAMIC_DRAW);

       // set indices
       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._dynamicBuffers.linesIndexBuffer);
       this._currIndices = null;

       // invoke the on-ready callback
       onReady(points);
    }

    /**
     * Draw sprites group as a batch.
     * @private
     * @param {SpritesGroup} group Group to draw.
     * @param {Boolean} cullOutOfScreen If true will cull quads that are out of screen.
     */
    _drawBatch(group, cullOutOfScreen)
    {
        // skip if empty
        if (group._sprites.length === 0) { return; }

        // finish previous drawings
        this.presentBufferedData();

        // get transform
        let transform = group.getTransform();

        // draw batch
        this.spritesBatch.begin(this._activeEffect, transform);
        this.spritesBatch.draw(group._sprites, cullOutOfScreen);
        this.spritesBatch.end();
    }

    /**
     * Set the currently active texture.
     * @private
     * @param {TextureAsset} texture Texture to set.
     */
    _setActiveTexture(texture)
    {
        if (this._activeEffect.setTexture(texture)) {
            this._setTextureFilter(texture.filter || this.defaultTextureFilter);
            this._setTextureWrapMode(texture.wrapMode || this.defaultTextureWrapMode);
        }
    }

    /**
     * Get the blend modes enum.
     * * AlphaBlend
     * * Opaque
     * * Additive
     * * Multiply
     * * Subtract
     * * Screen
     * * Overlay
     * * Invert
     * * DestIn
     * * DestOut
     * 
     * ![Blend Modes](resources/blend-modes.png)
     * @see BlendModes
     */
    get BlendModes()
    {
        return BlendModes;
    }
 
    /**
     * Get the wrap modes enum.
     * * Clamp: when uv position exceed texture boundaries it will be clamped to the nearest border, ie repeat the edge pixels.
     * * Repeat: when uv position exceed texture boundaries it will wrap back to the other side.
     * * RepeatMirrored: when uv position exceed texture boundaries it will wrap back to the other side but also mirror the texture.
     * 
     * ![Wrap Modes](resources/wrap-modes.png)
     * @see TextureWrapModes
     */
    get TextureWrapModes()
    {
        return TextureWrapModes;
    }

    /**
     * Get texture filter modes.
     * * Nearest: no filtering, no mipmaps (pixelated).
     * * Linear: simple filtering, no mipmaps (smooth).
     * * NearestMipmapNearest: no filtering, sharp switching between mipmaps,
     * * LinearMipmapNearest: filtering, sharp switching between mipmaps.
     * * NearestMipmapLinear: no filtering, smooth transition between mipmaps.
     * * LinearMipmapLinear: filtering, smooth transition between mipmaps.
     * 
     * ![Filter Modes](resources/filter-modes.png)
     * @see TextureFilterModes
     */
    get TextureFilterModes()
    {
        return TextureFilterModes;
    }

    /**
     * Get number of actual WebGL draw calls we performed since the beginning of the frame.
     * @returns {Number} Number of WebGL draw calls this frame.
     */
    get drawCallsCount()
    {
        return this._drawCallsCount;
    }

    /**
     * Get number of textured / colored quads we drawn since the beginning of the frame.
     * @returns {Number} Number of quads drawn in this frame..
     */
    get quadsDrawCount()
    {
        return this._drawQuadsCount;
    }

    /**
     * Clear screen to a given color.
     * @example
     * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
     * @param {Color=} color Color to clear screen to, or black if not set.
     */
    clear(color)
    {
        this.presentBufferedData();
        color = color || Color.black;
        this._gl.clearColor(color.r, color.g, color.b, color.a);
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    }
    
    /**
     * Set texture mag and min filters.
     * @private
     * @param {TextureFilterMode} filter Texture filter to set.
     */
    _setTextureFilter(filter)
    {
        if (!TextureFilterModes._values.has(filter)) { throw new Error("Invalid texture filter mode! Please pick a value from 'TextureFilterModes'."); }
        let glMode = this._gl[filter];
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, glMode);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, glMode);
    }

    /**
     * Set texture wrap mode on X and Y axis.
     * @private
     * @param {TextureWrapMode} wrapX Wrap mode on X axis.
     * @param {TextureWrapMode} wrapY Wrap mode on Y axis.
     */
    _setTextureWrapMode(wrapX, wrapY)
    {
        if (wrapY === undefined) { wrapY = wrapX; }
        if (!TextureWrapModes._values.has(wrapX)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
        if (!TextureWrapModes._values.has(wrapY)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl[wrapX]);
        this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl[wrapY]);
    }

    /**
     * Set blend mode before drawing.
     * @private
     * @param {BlendMode} blendMode New blend mode to set.
     */
    _setBlendMode(blendMode)
    {
        if (this._lastBlendMode !== blendMode) {

            // get gl context and set defaults
            var gl = this._gl;
            switch (blendMode) 
            {
                case BlendModes.AlphaBlend:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Opaque:
                    gl.disable(gl.BLEND);
                    break;

                case BlendModes.Additive:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE, gl.ONE);
                    break;
                    
                case BlendModes.Multiply:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Screen:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Subtract:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                    gl.blendEquationSeparate(gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD);
                    break;

                case BlendModes.Invert:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ZERO);
                    gl.blendFuncSeparate(gl.ONE_MINUS_DST_COLOR, gl.ZERO, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.Overlay:
                    gl.enable(gl.BLEND);
                    if (gl.MAX) {
                        gl.blendEquation(gl.MAX);
                        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    } else {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.ONE, gl.ONE);
                    }
                    break;

                case BlendModes.Darken:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.MIN);
                    gl.blendFuncSeparate(gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    break;

                case BlendModes.DestIn:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
                    break;

                case BlendModes.DestOut:
                    gl.enable(gl.BLEND);
                    gl.blendEquation(gl.FUNC_ADD);
                    gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA);
                    // can also use: gl.blendFunc(gl.ONE_MINUS_DST_COLOR, gl.ONE_MINUS_SRC_COLOR);
                    break;

                default:
                    throw new Error(`Unknown blend mode '${blendMode}'!`);
            }

            // store last blend mode
            this._lastBlendMode = blendMode;
        }
    }
    
    /**
     * Present all currently buffered data.
     */
    presentBufferedData()
    {
        this.__finishDrawingSprites();
    }

    /**
     * Called internally before drawing a sprite to prepare some internal stuff.
     * @private
     */
    __startDrawingSprites(activeEffect, transform)
    {
        // check if should break due to effect or transform change
        if (this.spritesBatch.drawing) {
            if (this.spritesBatch._effect !== activeEffect || this.spritesBatch._transform !== transform) {
                this.spritesBatch.end();
            }
        }

        // start sprites batch
        if (!this.spritesBatch.drawing) {
            this.spritesBatch.begin(activeEffect, transform);
        }
    }
    
    /**
     * Called internally to present sprites batch, if currently drawing sprites.
     * @private
     */
    __finishDrawingSprites()
    {
        if (this.spritesBatch.drawing) {
            this.spritesBatch.end();
        }
    }
    
    /** 
     * @inheritdoc
     * @private
     */
    startFrame()
    {
        // reset some states
        this._lastBlendMode = null;
        this._drawCallsCount = 0;
        this._drawQuadsCount = 0;
        
        // reset cached rendering region
        this.__resetCachedRenderingRegion();
    }

    /** 
     * @inheritdoc
     * @private
     */
    endFrame()
    {
        this.presentBufferedData();
    }

    /** 
     * @inheritdoc
     * @private
     */
    destroy()
    {
        _logger.warn("Cleaning up WebGL is not supported yet!");
    }
}

// export main object
module.exports = new Gfx();
},{"../assets/font_texture_asset.js":4,"../assets/msdf_font_texture_asset.js":7,"../assets/texture_asset.js":9,"../logger.js":45,"../manager.js":46,"../utils/circle.js":53,"../utils/color.js":54,"../utils/rectangle.js":61,"../utils/vector2.js":67,"../utils/vector3.js":68,"./blend_modes.js":22,"./camera.js":23,"./effects":26,"./matrix.js":30,"./mesh.js":31,"./mesh_generator.js":32,"./sprite.js":33,"./sprite_batch.js":34,"./sprites_group.js":35,"./text_alignments.js":36,"./texture_filter_modes.js":37,"./texture_wrap_modes.js":38,"./vertex":39}],29:[function(require,module,exports){
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
 module.exports = require('./gfx');
},{"./gfx":28}],30:[function(require,module,exports){
/**
 * Matrix class.
 * Based on code from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\matrix.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require("../utils/vector2");
const Vertex = require("./vertex");

/**
 * Implements a matrix.
 */
class Matrix
{
    /**
     * Create the matrix.
     * @param values matrix values array.
     * @param cloneValues if true or undefined, will clone values instead of just holding a reference to them.
     */
    constructor(values, cloneValues)
    {
        // if no values are set, use identity
        if (!values) {
            values = Matrix.identity.values;
        }

        // clone values
        if (cloneValues || cloneValues === undefined) {
            this.values = values.slice(0);
        }
        // copy values reference
        else {
            this.values = values;
        }
    }

    /**
     * Set the matrix values.
     */
    set(v11, v12, v13, v14, v21, v22, v23, v24, v31, v32, v33, v34, v41, v42, v43, v44)
    {
        this.values = new Float32Array([ v11, v12, v13, v14,
                        v21, v22, v23, v24,
                        v31, v32, v33, v34,
                        v41, v42, v43, v44
                    ]);
    }

    /**
     * Clone the matrix.
     * @returns {Matrix} Cloned matrix.
     */
    clone()
    {
        let ret = new Matrix(this.values, true);
        return ret;
    }
    
    /**
     * Compare this matrix to another matrix.
     * @param {Matrix} other Matrix to compare to.
     * @returns {Boolean} If matrices are the same.
     */
    equals(other)
    {
        if (other === this) { return true; }
        if (!other) { return false; }
        for (let i = 0; i < this.values.length; ++i) {
            if (this.values[i] !== other.values[i]) { return false; }
        }
        return true;
    }

    /**
     * Create an orthographic projection matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static orthographic(left, right, bottom, top, near, far) 
    {
        return new Matrix([
          2 / (right - left), 0, 0, 0,
          0, 2 / (top - bottom), 0, 0,
          0, 0, 2 / (near - far), 0,
     
          (left + right) / (left - right),
          (bottom + top) / (bottom - top),
          (near + far) / (near - far),
          1,
        ], false);
    }

    /**
     * Create a perspective projection matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static perspective(fieldOfViewInRadians, aspectRatio, near, far) 
    {
        var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
        var rangeInv = 1 / (near - far);
      
        return new Matrix([
          f / aspectRatio, 0,                          0,   0,
          0,               f,                          0,   0,
          0,               0,    (near + far) * rangeInv,  -1,
          0,               0,  near * far * rangeInv * 2,   0
        ], false);
    }

    /**
     * Create a translation matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static translate(x, y, z)
    {
        return new Matrix([
            1,          0,          0,          0,
            0,          1,          0,          0,
            0,          0,          1,          0,
            x || 0,     y || 0,     z || 0,     1
        ], false);
    }

    /**
     * Create a scale matrix.
     * @returns {Matrix} a new matrix with result.
     */
    static scale(x, y, z)
    {
        return new Matrix([
            x || 1,         0,              0,              0,
            0,              y || 1,         0,              0,
            0,              0,              z || 1,         0,
            0,              0,              0,              1
        ], false);
    }
    
    /**
     * Create a rotation matrix around X axis.
     * @returns {Matrix} a new matrix with result.
     */
    static rotateX(a)
    {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
            1,       0,        0,     0,
            0,  cos(a),  -sin(a),     0,
            0,  sin(a),   cos(a),     0,
            0,       0,        0,     1
        ], false);
    }
        
    /**
     * Create a rotation matrix around Y axis.
     * @returns {Matrix} a new matrix with result.
     */
    static rotateY(a)
    {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
             cos(a),   0, sin(a),   0,
                  0,   1,      0,   0,
            -sin(a),   0, cos(a),   0,
                  0,   0,      0,   1
        ], false);
    }
        
    /**
     * Create a rotation matrix around Z axis.
     * @returns {Matrix} a new matrix with result.
     */
    static rotateZ(a)
    {
        let sin = Math.sin;
        let cos = Math.cos;
        return new Matrix([
            cos(a), -sin(a),    0,    0,
            sin(a),  cos(a),    0,    0,
                0,       0,    1,    0,
                0,       0,    0,    1
        ], false);
    }
    
    /**
     * Multiply two matrices. 
     * @returns {Matrix} a new matrix with result.
     */
    static multiply(matrixA, matrixB) 
    {
        // Slice the second matrix up into rows
        let row0 = [matrixB.values[ 0], matrixB.values[ 1], matrixB.values[ 2], matrixB.values[ 3]];
        let row1 = [matrixB.values[ 4], matrixB.values[ 5], matrixB.values[ 6], matrixB.values[ 7]];
        let row2 = [matrixB.values[ 8], matrixB.values[ 9], matrixB.values[10], matrixB.values[11]];
        let row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];
      
        // Multiply each row by matrixA
        let result0 = multiplyMatrixAndPoint(matrixA.values, row0);
        let result1 = multiplyMatrixAndPoint(matrixA.values, row1);
        let result2 = multiplyMatrixAndPoint(matrixA.values, row2);
        let result3 = multiplyMatrixAndPoint(matrixA.values, row3);
      
        // Turn the result rows back into a single matrix
        return new Matrix([
          result0[0], result0[1], result0[2], result0[3],
          result1[0], result1[1], result1[2], result1[3],
          result2[0], result2[1], result2[2], result2[3],
          result3[0], result3[1], result3[2], result3[3]
        ], false);
    }

    /**
     * Multiply an array of matrices.
     * @param {Array<Matrix>} matrices Matrices to multiply.
     * @returns {Matrix} new matrix with multiply result.
     */
    static multiplyMany(matrices)
    {
        let ret = matrices[0];
        for(let i = 1; i < matrices.length; i++) {
            ret = Matrix.multiply(ret, matrices[i]);
        }        
        return ret;
    }
        
    /**
     * Multiply two matrices and put result in first matrix. 
     * @returns {Matrix} matrixA, after it was modified.
     */
    static multiplyIntoFirst(matrixA, matrixB) 
    {
        // Slice the second matrix up into rows
        let row0 = [matrixB.values[ 0], matrixB.values[ 1], matrixB.values[ 2], matrixB.values[ 3]];
        let row1 = [matrixB.values[ 4], matrixB.values[ 5], matrixB.values[ 6], matrixB.values[ 7]];
        let row2 = [matrixB.values[ 8], matrixB.values[ 9], matrixB.values[10], matrixB.values[11]];
        let row3 = [matrixB.values[12], matrixB.values[13], matrixB.values[14], matrixB.values[15]];
    
        // Multiply each row by matrixA
        let result0 = multiplyMatrixAndPoint(matrixA.values, row0);
        let result1 = multiplyMatrixAndPoint(matrixA.values, row1);
        let result2 = multiplyMatrixAndPoint(matrixA.values, row2);
        let result3 = multiplyMatrixAndPoint(matrixA.values, row3);
    
        // Turn the result rows back into a single matrix
        matrixA.set(
            result0[0], result0[1], result0[2], result0[3],
            result1[0], result1[1], result1[2], result1[3],
            result2[0], result2[1], result2[2], result2[3],
            result3[0], result3[1], result3[2], result3[3]
        );

        // return the first matrix after it was modified
        return matrixA;
    }

    /**
     * Multiply an array of matrices into the first matrix in the array.
     * @param {Array<Matrix>} matrices Matrices to multiply.
     * @returns {Matrix} first matrix in array, after it was modified.
     */
    static multiplyManyIntoFirst(matrices)
    {
        let ret = matrices[0];
        for(let i = 1; i < matrices.length; i++) {
            ret = Matrix.multiplyIntoFirst(ret, matrices[i]);
        }        
        return ret;
    }

    /**
     * Transform a 2d vertex.
     * @param {Matrix} matrix Matrix to use to transform vector.
     * @param {Vertex} vertex Vertex to transform.
     * @returns {Vertex} A transformed vertex (cloned, not the original).
     */
    static transformVertex(matrix, vertex)
    {
        return new Vertex(Matrix.transformVector2(matrix, vertex.position), vertex.textureCoord, vertex.color);
    }

    /**
     * Transform a 2d vector.
     * @param {Matrix} matrix Matrix to use to transform vector.
     * @param {Vector2} vector Vector to transform.
     * @returns {Vector2} Transformed vector.
     */
    static transformVector2(matrix, vector)
    {
        const x = vector.x, y = vector.y, z = vector.z || 0;
		const e = matrix.values;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		const resx = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		const resy = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;

        return new Vector2(resx, resy);
    }

    /**
     * Transform a 3d vector.
     * @param {Matrix} matrix Matrix to use to transform vector.
     * @param {Vector3} vector Vector to transform.
     * @returns {Vector3} Transformed vector.
     */
    static transformVector3(matrix, vector)
    {
        const x = vector.x, y = vector.y, z = vector.z || 0;
        const e = matrix.values;

        const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

        const resx = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
        const resy = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
        const resz = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

        return new Vector3(resx, resy, resz);
    }
}


/**
 * Multiply matrix and vector.
 * @private
 */
function multiplyMatrixAndPoint(matrix, point) 
{
    // Give a simple variable name to each part of the matrix, a column and row number
    let c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
    let c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
    let c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
    let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

    // Now set some simple names for the point
    let x = point[0];
    let y = point[1];
    let z = point[2];
    let w = point[3];

    // Multiply the point against each part of the 1st column, then add together
    let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

    // Multiply the point against each part of the 2nd column, then add together
    let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

    // Multiply the point against each part of the 3rd column, then add together
    let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

    // Multiply the point against each part of the 4th column, then add together
    let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

    return [resultX, resultY, resultZ, resultW];
}


/**
 * An identity matrix.
 */
Matrix.identity = new Matrix([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
], false);
Object.freeze(Matrix.identity);

// export the matrix object
module.exports = Matrix;
},{"../utils/vector2":67,"./vertex":39}],31:[function(require,module,exports){
/**
 * Define a mesh object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\mesh.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

const { Color } = require("../utils");

 /**
  * Class to hold a mesh.
  */
 class Mesh
 {
    /**
     * Create the mesh object.
     * @param {WebGLBuffer} positions vertices positions buffer. 
     * @param {WebGLBuffer} textureCoords vertices texture coords buffer.
     * @param {WebGLBuffer} colorss vertices colors buffer.
     * @param {WebGLBuffer} indices indices buffer.
     * @param {Number} indicesCount how many indices we have.
     */
    constructor(positions, textureCoords, colorsBuffer, indices, indicesCount)
    {
        this.positions = positions;
        this.textureCoords = textureCoords;
        this.colors = colorsBuffer;
        this.indices = indices;
        this.indicesCount = indicesCount;
        this.__color = new Color(-1, -1, -1, -1);
        Object.freeze(this);
    }

    /**
     * Override the colors buffer, if possible.
     * @param {WebGl} gl WebGL context.
     * @param {Color} color Color to set.
     */
    overrideColors(gl, color)
    {
        if (color.equals(this.__color)) { return; }
        this.__color.copy(color);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colors);
        const colors = [];
        for (let i = 0; i < this.indicesCount; ++i) {
            colors.push(color.r);
            colors.push(color.g);
            colors.push(color.b);
            colors.push(color.a);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    }
 }
 
 // export the mesh class.
 module.exports = Mesh;
},{"../utils":56}],32:[function(require,module,exports){
/**
 * Define utility to generate meshes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\mesh_generator.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const Mesh = require("./mesh");

/**
 * Utility class to generate meshes.
 * @private
 */
class MeshGenerator
{
    /**
     * Create the mesh generator.
     */
    constructor(gl)
    {
        this._gl = gl;
    }

    /**
     * Generate and return a textured quad.
     * @returns {Mesh} Quad mesh.
     */
    quad()
    {
        const gl = this._gl;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        let x = 0.5; // <- 0.5 so total size would be 1x1
        const positions = [
            -x, -x,  0,
             x, -x,  0,
            -x,  x,  0,
            x,  x,  0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        const textureCoordinates = [
            0.0,  0.0,
            1.0,  0.0,
            0.0,  1.0,
            1.0,  1.0,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

        const colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        const colors = [
            1,1,1,1,
            1,1,1,1,
            1,1,1,1,
            1,1,1,1,
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
    
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        const indices = [
            0, 1, 3, 2
        ];
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    
        return new Mesh(positionBuffer, textureCoordBuffer, colorsBuffer, indexBuffer, indices.length);
    }
}

// export the meshes generator.
module.exports = MeshGenerator;
},{"./mesh":31}],33:[function(require,module,exports){
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
const {BlendMode, BlendModes} = require("./blend_modes");

/**
 * Sprite class.
 * This object is a helper class to hold all the properties of a texture to render.
 */
class Sprite
{
    /**
     * Create the texture object.
     * @param {TextureAsset} texture Texture asset.
     * @param {Rectangle=} sourceRect Optional source rect.
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
        if (sourceRect) {
            this.size = new Vector2(sourceRect.width, sourceRect.height);
        } else if (texture && texture.valid) {
            this.size = texture.size.clone();
        }
        else {
            this.size = new Vector2(100, 100);
        }

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
         * @type {BlendMode}
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
     * Set the source Rectangle automatically from spritesheet.
     * This method get sprite index in sheet and how many sprites there are in total, and calculate the desired
     * offset and size in source Rectangle based on it + source image size.
     * @param {Vector2} index Sprite index in spritesheet.
     * @param {Vector2} spritesCount How many sprites there are in spritesheet in total.
     * @param {Number=} margin How many pixels to trim from the tile (default is 0).
     * @param {Boolean=} setSize If true will also set width and height based on source rectangle (default is true).
     */
    setSourceFromSpritesheet(index, spritesCount, margin, setSize) {
        margin = margin || 0;
        let w = this.texture.width / spritesCount.x;
        let h = this.texture.height / spritesCount.y;
        let x = w * index.x + margin;
        let y = h * index.y + margin;
        w -= 2*margin;
        h -= 2*margin;
        if (setSize || setSize === undefined) {
            this.size.set(w, h)
        }
        if (this.sourceRect) {
            this.sourceRect.set(x, y, w, h);
        } else {
            this.sourceRect = new Rectangle(x, y, w, h);
        }
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
},{"../assets/texture_asset":9,"../utils/color":54,"../utils/rectangle":61,"../utils/vector2":67,"../utils/vector3":68,"./blend_modes":22}],34:[function(require,module,exports){
/**
 * Implement the gfx sprite batch renderer.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprite_batch.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const { Rectangle, Color } = require('../utils');
const Vector2 = require('../utils/vector2');
const Vertex = require('./vertex');
const { BlendModes } = require('./blend_modes');
const Matrix = require('./matrix');
const Mesh = require('./mesh');
const _logger = require('../logger.js').getLogger('gfx');


/**
 * Sprite batch renderer, responsible on drawing a batch of sprites with as little draw calls as possible.
 */
class SpriteBatch
{
    /**
     * Create the spritebatch.
     * @param {Gfx} gfx Gfx manager.
     */
    constructor(gfx)
    {
        this._gfx = gfx;
        this._gl = gfx._gl;
        this._positions = gfx._dynamicBuffers.positionArray;
        this._uvs = gfx._dynamicBuffers.textureArray;
        this._colors = gfx._dynamicBuffers.colorsArray;
        this._positionsBuff = gfx._dynamicBuffers.positionBuffer;
        this._uvsBuff = gfx._dynamicBuffers.textureCoordBuffer;
        this._colorsBuff = gfx._dynamicBuffers.colorsBuffer;
        this._indexBuff = gfx._dynamicBuffers.indexBuffer;

        /** 
         * If true, will floor vertices positions before pushing them to batch.
         */
        this.snapPixels = true;

        /**
         * If true, will slightly offset texture uv when rotating sprites, to prevent bleeding while using texture atlas.
         */
        this.applyAntiBleeding = true;
    }

    /**
     * Create and return a new vertex.
     * @param {Vector2} position Vertex position.
     * @param {Vector2} textureCoord Vertex texture coord.
     * @param {Color} color Vertex color.
     * @returns {Vertex} new vertex object.
     */
    vertex(position, textureCoord, color)
    {
        return new Vertex(position, textureCoord, color);
    }

    /**
     * Get if batch is currently drawing.
     * @returns {Boolean} True if batch is drawing.
     */
    get drawing()
    {
        return this._drawing;
    }

    /**
     * Start drawing a batch.
     * @param {Effect} effect Effect to use.
     * @param {Matrix} transform Optional transformations to apply on all sprites.
     */
    begin(effect, transform)
    {
        if (this._drawing) {
            _logger.error("Start drawing a batch while already drawing a batch!");
        }

        if (effect) {
            this._gfx.useEffect(effect);
        }
        this._effect = this._gfx._activeEffect;

        this._currBlend = BlendModes.AlphaBlend;
        this._currTexture = null;
        this._currBatchCount = 0;

        this._transform = transform;

        this._drawing = true;
    }

    /**
     * Finish drawing batch (and render whatever left in buffers).
     */
    end()
    {
        if (!this._drawing) {
            _logger.error("Stop drawing a batch without starting it first!");
        }

        if (this._currBatchCount) {
            this._drawCurrentBatch();
        }
        this._drawing = false;
    }

    /**
     * Set the currently active texture.
     * @param {Texture} texture Texture to set.
     */
    setTexture(texture)
    {
        if (texture !== this._currTexture) {
            if (this._currBatchCount) {
                this._drawCurrentBatch();
            }
            this._currTexture = texture;
        }
    }

    /**
     * Add sprite to batch.
     * Note: changing texture or blend mode may trigger a draw call.
     * @param {Sprite|Array<Sprite>} sprites Sprite or multiple sprites to draw.
     * @param {Boolean} cullOutOfScreen If true, will cull sprites that are not visible.
     */
    draw(sprites, cullOutOfScreen)
    {
        // if single sprite, turn to array
        if (sprites.length === undefined) { 
            sprites = [sprites]; 
        }

        // get visible region
        let region = cullOutOfScreen ? this._gfx.__getRenderingRegionInternal() : null;

        // get buffers
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;
        
        for (let sprite of sprites) {

            // if texture changed, blend mode changed, or we have too many indices - draw current batch
            if (this._currBatchCount) {
                if ((this._currBatchCount >= this.batchSpritesCount) || 
                    (sprite.blendMode !== this._currBlend) || 
                    (sprite.texture !== this._currTexture)) {
                    this._drawCurrentBatch();
                }
            }

            // set texture and blend (used internally when drawing batch)
            this._currTexture = sprite.texture;
            this._currBlend = sprite.blendMode;

            // set colors batch
            let ci = this._currBatchCount * 4 * 4;

            // array of colors
            if (sprite.color instanceof Array) {
                let lastColor = sprite.color[0];
                for (let x = 0; x < 4; ++x) {
                    let curr = (sprite.color[x] || lastColor);
                    colors[ci + x*4 + 0] = curr.r;
                    colors[ci + x*4 + 1] = curr.g;
                    colors[ci + x*4 + 2] = curr.b;
                    colors[ci + x*4 + 3] = curr.a;
                    lastColor = curr;
                }
            }
            // single color
            else {
                for (let x = 0; x < 4; ++x) {
                    colors[ci + x*4 + 0] = sprite.color.r;
                    colors[ci + x*4 + 1] = sprite.color.g;
                    colors[ci + x*4 + 2] = sprite.color.b;
                    colors[ci + x*4 + 3] = sprite.color.a;
                }
            }

            // check if its a static sprite with cached properties. if so, we'll use it.
            if (sprite.static && sprite._cachedVertices) {

                // get vertices from cache
                let cTopLeft = sprite._cachedVertices[0];
                let cTopRight = sprite._cachedVertices[1];
                let cBottomLeft = sprite._cachedVertices[2];
                let cBottomRight = sprite._cachedVertices[3];

                // set positions
                let pi = this._currBatchCount * 4 * 3;
                positions[pi+0] = cTopLeft.position.x;             positions[pi+1] = cTopLeft.position.y;             positions[pi+2] = cTopLeft.position.z || 0;
                positions[pi+3] = cTopRight.position.x;            positions[pi+4] = cTopRight.position.y;            positions[pi+5] = cTopRight.position.z || 0;
                positions[pi+6] = cBottomLeft.position.x;          positions[pi+7] = cBottomLeft.position.y;          positions[pi+8] = cBottomLeft.position.z || 0;
                positions[pi+9] = cBottomRight.position.x;         positions[pi+10] = cBottomRight.position.y;        positions[pi+11] = cBottomRight.position.z || 0;
        
                // set uvs
                let uvi = this._currBatchCount * 4 * 2;
                uvs[uvi+0] = cTopLeft.uv.x;          uvs[uvi+1] = cTopLeft.uv.y;
                uvs[uvi+2] = cBottomRight.uv.x;      uvs[uvi+3] = cTopLeft.uv.y;
                uvs[uvi+4] = cTopLeft.uv.x;          uvs[uvi+5] = cBottomRight.uv.y;
                uvs[uvi+6] = cBottomRight.uv.x;      uvs[uvi+7] = cBottomRight.uv.y;

                // increase sprites count and continue
                this._currBatchCount++;
                continue;
            }

            // calculate vertices positions
            let sizeX = sprite.size.x;
            let sizeY = sprite.size.y;
            let left = -sizeX * sprite.origin.x;
            let top = -sizeY * sprite.origin.y;

            // calculate corners
            topLeft.set(left, top);
            topRight.set(left + sizeX, top);
            bottomLeft.set(left, top + sizeY);
            bottomRight.set(left + sizeX, top + sizeY);

            // are vertices axis aligned?
            let axisAlined = true;

            // apply skew
            if (sprite.skew) {
                if (sprite.skew.x) {
                    topLeft.x += sprite.skew.x * sprite.origin.y;
                    topRight.x += sprite.skew.x * sprite.origin.y;
                    bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
                    bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
                    axisAlined = false;
                }
                if (sprite.skew.y) {
                    topLeft.y += sprite.skew.y * sprite.origin.x;
                    bottomLeft.y += sprite.skew.y * sprite.origin.x;
                    topRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                    bottomRight.y -= sprite.skew.y * (1 - sprite.origin.x);
                    axisAlined = false;
                }
            }

            // apply rotation
            if (sprite.rotation) {
                let cos = Math.cos(sprite.rotation);
                let sin = Math.sin(sprite.rotation);
                function rotateVec(vector)
                {
                    let x = (vector.x * cos - vector.y * sin);
                    let y = (vector.x * sin + vector.y * cos);
                    vector.set(x, y);
                }
                rotateVec(topLeft);
                rotateVec(topRight);
                rotateVec(bottomLeft);
                rotateVec(bottomRight);
                axisAlined = false;
            }

            // add sprite position
            topLeft.addSelf(sprite.position);
            topRight.addSelf(sprite.position);
            bottomLeft.addSelf(sprite.position);
            bottomRight.addSelf(sprite.position);

            // snap pixels
            if (this.snapPixels)
            {
                topLeft.floorSelf();
                topRight.floorSelf();
                bottomLeft.floorSelf();
                bottomRight.floorSelf();
            }

            // optional z position
            let z = sprite.position.z || 0;
            let zDepth = sprite.size.z || 0;

            // cull out-of-screen sprites
            if (cullOutOfScreen)
            {
                let destRect = axisAlined ? new Rectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y) : 
                                            Rectangle.fromPoints([topLeft, topRight, bottomLeft, bottomRight]);
                if (!region.collideRect(destRect)) {
                    continue;
                }
            }

            // update positions buffer
            let pi = this._currBatchCount * 4 * 3;
            positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = z;
            positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = z;
            positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = z + zDepth;
            positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = z + zDepth;

            // set uvs buffer
            let uvi = this._currBatchCount * 4 * 2;
            var uvTl;
            var uvBr;

            // got source rect, apply uvs
            if (sprite.sourceRect) {
                uvTl = {x: sprite.sourceRect.x / this._currTexture.width, y: sprite.sourceRect.y / this._currTexture.height};
                uvBr = {x: uvTl.x + (sprite.sourceRect.width / this._currTexture.width), y: uvTl.y + (sprite.sourceRect.height / this._currTexture.height)};
                if (sprite.rotation && this.applyAntiBleeding) {
                    let marginX = 0.015 / this._currTexture.width;
                    let marginY = 0.015 / this._currTexture.height;
                    uvTl.x += marginX;
                    uvBr.x -= marginX * 2;
                    uvTl.y += marginY;
                    uvBr.y -= marginY * 2;
                }
                uvs[uvi+0] = uvTl.x;  uvs[uvi+1] = uvTl.y;
                uvs[uvi+2] = uvBr.x;  uvs[uvi+3] = uvTl.y;
                uvs[uvi+4] = uvTl.x;  uvs[uvi+5] = uvBr.y;
                uvs[uvi+6] = uvBr.x;  uvs[uvi+7] = uvBr.y;
            }
            // no source rect, take entire texture
            else {
                uvs[uvi+0] = 0;  uvs[uvi+1] = 0;
                uvs[uvi+2] = 1;  uvs[uvi+3] = 0;
                uvs[uvi+4] = 0;  uvs[uvi+5] = 1;
                uvs[uvi+6] = 1;  uvs[uvi+7] = 1;
            }

            // set cached vertices
            if (sprite.static) {
                sprite._cachedVertices = [
                    {position: topLeft.clone(), uv: uvTl || {x:0, y:0}},
                    {position: topRight.clone()},
                    {position: bottomLeft.clone()},
                    {position: bottomRight.clone(), uv: uvBr || {x:1, y:1}},
                ];
            }
                    
            // increase sprites count
            this._currBatchCount++;
        }
    }

    /**
     * Push vertices directly to batch.
     * @param {Array<Vertex>} vertices Vertices to push.
     */
    pushVertices(vertices)
    {
        // sanity
        if (!vertices || vertices.length !== 4) {
            throw new Error("Vertices must be array of 4 values!");
        }

        // get buffers and offset
        let positions = this._positions;
        let uvs = this._uvs;
        let colors = this._colors;

        // push colors
        for (let i = 0; i < vertices.length; ++i) 
        {
            let vertex = vertices[i];
            let ci = (this._currBatchCount * (4 * 4)) + (i * 4);
            colors[ci + 0] = vertex.color.r;
            colors[ci + 1] = vertex.color.g;
            colors[ci + 2] = vertex.color.b;
            colors[ci + 3] = vertex.color.a;
        }

        // push positions
        let topLeft = vertices[0].position;
        let topRight = vertices[1].position;
        let bottomLeft = vertices[2].position;
        let bottomRight = vertices[3].position;
        let pi = this._currBatchCount * 4 * 3;
        positions[pi+0] = topLeft.x;             positions[pi+1] = topLeft.y;             positions[pi+2] = topLeft.z || 0;
        positions[pi+3] = topRight.x;            positions[pi+4] = topRight.y;            positions[pi+5] = topRight.z || 0;
        positions[pi+6] = bottomLeft.x;          positions[pi+7] = bottomLeft.y;          positions[pi+8] = bottomLeft.z || 0;
        positions[pi+9] = bottomRight.x;         positions[pi+10] = bottomRight.y;        positions[pi+11] = bottomRight.z || 0;

        // set texture coords
        let uvi = (this._currBatchCount * (4 * 2));
        uvs[uvi++] = vertices[0].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[0].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[1].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[1].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[2].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[2].textureCoord.y / this._currTexture.height;
        uvs[uvi++] = vertices[3].textureCoord.x / this._currTexture.width; 
        uvs[uvi++] = vertices[3].textureCoord.y / this._currTexture.height;

        // increase batch count
        this._currBatchCount++;
    }

    /**
     * How many sprites we can have in batch, in total.
     */
    get batchSpritesCount()
    {
        return this._gfx.batchSpritesCount;
    }

    /**
     * Draw current batch.
     * @private
     */
    _drawCurrentBatch()
    {
        // get some members
        let gl = this._gl;
        let transform = this._transform;
        let positionArray = this._positions;
        let textureArray = this._uvs;
        let colorsArray = this._colors;
        let positionBuffer = this._positionsBuff;
        let textureCoordBuffer = this._uvsBuff;
        let colorsBuffer = this._colorsBuff;
        let indexBuffer = this._indexBuff;

        // some sanity checks
        if (this._effect !== this._gfx._activeEffect) {
            _logger.error("Effect changed while drawing batch!");
        }

        // set blend mode if needed
        this._gfx._setBlendMode(this._currBlend);

        // should we slice the arrays?
        let shouldSliceArrays = (this._gfx.webglVersion < 2) && (this._currBatchCount < this.batchSpritesCount / 2);

        // set world matrix
        this._gfx._activeEffect.setWorldMatrix(transform || Matrix.identity);

        // copy position buffer
        this._gfx._activeEffect.setPositionsAttribute(positionBuffer, true);
        gl.bufferData(gl.ARRAY_BUFFER, 
            shouldSliceArrays ? positionArray.slice(0, this._currBatchCount * 4 * 3) : positionArray, 
            gl.DYNAMIC_DRAW, 0, this._currBatchCount * 4 * 3);

        // copy texture buffer
        
        this._gfx._activeEffect.setTextureCoordsAttribute(textureCoordBuffer, true);
        gl.bufferData(gl.ARRAY_BUFFER, 
            shouldSliceArrays ? textureArray.slice(0, this._currBatchCount * 4 * 2) : textureArray, 
            gl.DYNAMIC_DRAW, 0, this._currBatchCount * 4 * 2);

        // copy color buffer
        this._gfx._activeEffect.setColorsAttribute(colorsBuffer, true);
        gl.bufferData(gl.ARRAY_BUFFER, 
            shouldSliceArrays ? colorsArray.slice(0, this._currBatchCount * 4 * 4) : colorsArray, 
            gl.DYNAMIC_DRAW, 0, this._currBatchCount * 4 * 4);

        // set indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this._currIndices = null;
        
        // set active texture
        this._gfx._activeEffect._cachedValues = {};
        this._gfx._setActiveTexture(this._currTexture);

        // draw elements
        gl.drawElements(gl.TRIANGLES, this._currBatchCount * 6, gl.UNSIGNED_SHORT, 0);
        this._gfx._drawCallsCount++;
        this._gfx._drawQuadsCount += this._currBatchCount;

        // reset current counter
        this._currBatchCount = 0;
    }
}

// used for vertices calculations
const topLeft = new Vector2(0, 0);
const topRight = new Vector2(0, 0);
const bottomLeft = new Vector2(0, 0);
const bottomRight = new Vector2(0, 0);


// export the sprite batch class
module.exports = SpriteBatch;
},{"../logger.js":45,"../utils":56,"../utils/vector2":67,"./blend_modes":22,"./matrix":30,"./mesh":31,"./vertex":39}],35:[function(require,module,exports){
/**
 * Define a sprites group.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\sprites_group.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Color = require("../utils/color");
const Vector2 = require("../utils/vector2");
const Matrix = require("./matrix");
const Sprite = require("./sprite");


/**
 * Sprites group class.
 * This object is a container to hold sprites collection + parent transformations.
 * You need SpritesGroup to use batched rendering.
 */
class SpritesGroup
{
    /**
     * Create the group object.
     */
    constructor()
    {
        this._sprites = [];
        this.rotation = 0;
        this.position = new Vector2(0, 0);
        this.scale = new Vector2(1, 1);
    }

    /**
     * Iterate all sprites.
     * @param {Function} callback Callback to run on all sprites in group.
     */
    forEach(callback)
    {
        this._sprites.forEach(callback);
    }

    /**
     * Set color for all sprites in group.
     * @param {Color} color Color to set.
     */
    setColor(color)
    {
        for (let i = 0; i < this._sprites.length; ++i) {
            this._sprites[i].color.copy(color);
        }
    }

    /**
     * Get group's transformations.
     * @returns {Matrix} Transformations matrix, or null if there's nothing to apply.
     */
    getTransform()
    {
        let matrices = [];

        if ((this.position.x !== 0) || (this.position.y !== 0)) 
        { 
            matrices.push(Matrix.translate(this.position.x, this.position.y, 0));
        }
        
        if (this.rotation) 
        { 
            matrices.push(Matrix.rotateZ(-this.rotation));
        }
        
        if ((this.scale.x !== 1) || (this.scale.y !== 1)) 
        { 
            matrices.push(Matrix.scale(this.scale.x, this.scale.y));
        }

        if (matrices.length === 0) { return null };
        if (matrices.length === 1) { return matrices[0]; }
        return Matrix.multiplyMany(matrices);
    }
    
    /**
     * Adds a sprite to group.
     * @param {Sprite} sprite Sprite to add.
     * @returns {Sprite} The newly added sprite.
     */
    add(sprite)
    {
        this._sprites.push(sprite);
        return sprite;
    }
        
    /**
     * Remove a sprite from group.
     * @param {Sprite} sprite Sprite to remove.
     */
    remove(sprite)
    {
        for (let i = 0; i < this._sprites.length; ++i) {
            if (this._sprites[i] === sprite) {
                this._sprites.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Shift first sprite element.
     * @returns {Sprite} The removed sprite.
     */
    shift()
    {
        return this._sprites.shift();
    }

    /**
     * Sort sprites.
     * @param {Function} compare Comparer method.
     */
    sort(compare)
    {
        this._sprites.sort(compare);
    }

    /**
     * Sort by texture and blend mode for maximum efficiency in batching.
     * This will change sprites order.
     */
    sortForBatching()
    {
        this._sprites.sort((a,b) => {
            let at = a.texture.url + a.blendMode;
            let bt = b.texture.url + b.blendMode;
            return (at > bt) ? 1 : ((bt > at) ? -1 : 0);
        });
    }

    /**
     * Sprites count in group.
     * @returns {Number} Number of sprites in group.
     */
    get count()
    {
        return this._sprites.length;
    }
}


// export the sprites group class.
module.exports = SpritesGroup;
},{"../utils/color":54,"../utils/vector2":67,"./matrix":30,"./sprite":33}],36:[function(require,module,exports){
/**
 * Define possible text alignments.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\text_alignments.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {String} TextAlignment */

/**
 * Possible text alignments.
 * @readonly
 * @enum {TextAlignment}
 */
const TextAlignments = {

    /**
     * Align text left-to-right.
     */
    Left: "left",

    /**
     * Align text right-to-left.
     */
    Right: "right",

    /**
     * Align text to center.
     */
    Center: "center",
};

Object.freeze(TextAlignments);
module.exports = {TextAlignments: TextAlignments};
},{}],37:[function(require,module,exports){
/**
 * Define possible texture filter modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\texture_filter_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict'; 

/** @typedef {String} TextureFilterMode */

/**
 * Texture filter modes, determine how to scale textures.
 * @readonly
 * @enum {TextureFilterMode}
 */
const TextureFilterModes = {
    Nearest: "NEAREST",
    Linear: "LINEAR",
    NearestMipmapNearest: "NEAREST_MIPMAP_NEAREST",
    LinearMipmapNearest: "LINEAR_MIPMAP_NEAREST",
    NearestMipmapLinear: "NEAREST_MIPMAP_LINEAR",
    LinearMipmapLinear: "LINEAR_MIPMAP_LINEAR",
};

Object.defineProperty(TextureFilterModes, '_values', {
    value: new Set(Object.values(TextureFilterModes)),
    writable: false,
});

Object.freeze(TextureFilterModes);
module.exports = {TextureFilterModes: TextureFilterModes};

},{}],38:[function(require,module,exports){
/**
 * Define possible texture wrap modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\texture_wrap_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {String} TextureWrapMode */

/**
 * Texture wrap modes, determine what to do when texture coordinates are outside texture boundaries.
 * @readonly
 * @enum {TextureWrapMode}
 */
const TextureWrapModes = {
    Clamp: "CLAMP_TO_EDGE",
    Repeat: "REPEAT",
    RepeatMirrored: "MIRRORED_REPEAT",
};

Object.defineProperty(TextureWrapModes, '_values', {
    value: new Set(Object.values(TextureWrapModes)),
    writable: false,
});

Object.freeze(TextureWrapModes);
module.exports = {TextureWrapModes: TextureWrapModes};
},{}],39:[function(require,module,exports){
/**
 * Implement the gfx vertex container.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\gfx\vertex.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const { Vector2, Color } = require("../utils");
const Matrix = require("./matrix");

/**
 * A vertex we can push to sprite batch.
 */
class Vertex
{
    /**
     * Create the vertex data.
     * @param {Vector2|Vector3} position Vertex position.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @param {Color} color Vertex color (undefined will default to white).
     */
    constructor(position, textureCoord, color)
    {
        this.position = position || Vector2.zero;
        this.textureCoord = textureCoord || Vector2.zero;
        this.color = color || Color.white;
    }

    /**
     * Transform this vertex position from a matrix.
     * @param {Matrix} matrix Transformation matrix.
     * @returns {Vertex} this.
     */
    transform(matrix)
    {
        return this;
    }

    /**
     * Set position.
     * @param {Vector2|Vector3} position Vertex position.
     * @returns {Vertex} this.
     */
    setPosition(position)
    {
        this.position = position.clone();
        return this;
    }

    /**
     * Set texture coordinates.
     * @param {Vector2} textureCoord Vertex texture coord (in pixels).
     * @returns {Vertex} this.
     */
    setTextureCoords(textureCoord)
    {
        this.textureCoord = textureCoord.clone();
        return this;
    }

    /**
     * Set vertex color.
     * @param {Color} color Vertex color.
     * @returns {Vertex} this.
     */
    setColor(color)
    {
        this.color = color.clone();
        return this;
    }
}

// export the vertex class
module.exports = Vertex;
},{"../utils":56,"./matrix":30}],40:[function(require,module,exports){
/**
 * Entry point for the Shaku module.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
module.exports = require('./shaku');
},{"./shaku":51}],41:[function(require,module,exports){
/**
 * Define a gamepad object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\gamepad.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const Vector2 = require("../utils/vector2");


/**
 * Gamepad data object.
 * This object represents a snapshot of a gamepad state, it does not update automatically.
 */
class Gamepad
{
    /**
     * Create gamepad state object.
     * @param {*} gp Browser gamepad state object.
     */
    constructor(gp)
    {
        /**
         * Gamepad Id.
         * @name Gamepad#id
         * @type {String}
         */
        this.id = gp.id;

        // set buttons down state
        this._buttonsDown = [];
        for (let i = 0; i < gp.buttons.length; ++i) {
            this._buttonsDown[i] = _gamepadButtonPressed(gp.buttons[i]);
        }

        /**
         * Gamepad first axis value.
         * @name Gamepad#axis1
         * @type {Vector2}
         */
        this.axis1 = new Vector2(gp.axes[0], gp.axes[1]);

        /**
         * Gamepad second axis value.
         * @name Gamepad#axis2
         * @type {Vector2}
         */
        this.axis2 = new Vector2(gp.axes[2] || 0, gp.axes[3] || 0);

        /**
         * Mapping type.
         * @name Gamepad#mapping
         * @type {String}
         */
        this.mapping = gp.mapping;

        /**
         * True if the gamepad is of a known type and we have extra mapped attributes.
         * False if unknown / not supported.
         * @name Gamepad#isMapped
         * @type {Boolean}
         */
        this.isMapped = false;

        // standard mapping
        if (this.mapping === "standard") {

            /**
             * Gamepad left stick.
             * Only available with "standard" mapping.
             * @name Gamepad#leftStick
             * @type {Vector2}
             */
            this.leftStick = this.axis1;

            /**
             * Gamepad right stick.
             * Only available with "standard" mapping.
             * @name Gamepad#rightStick
             * @type {Vector2}
             */
            this.rightStick = this.axis2;

            /**
             * Gamepad left stick is pressed.
             * Only available with "standard" mapping.
             * @name Gamepad#leftStickPressed
             * @type {Boolean}
             */
            this.leftStickPressed = this._buttonsDown[10];

            /**
             * Gamepad right stick is pressed.
             * Only available with "standard" mapping.
             * @name Gamepad#leftStickPressed
             * @type {Boolean}
             */
            this.rightStickPressed = this._buttonsDown[11];

            /**
             * Right cluster button states.
             * @name Gamepad#rightButtons
             * @type {FourButtonsCluster}
             */
            this.rightButtons = new FourButtonsCluster(this._buttonsDown[0], this._buttonsDown[1], this._buttonsDown[2], this._buttonsDown[3]);

            /**
             * Left cluster button states.
             * @name Gamepad#leftButtons
             * @type {FourButtonsCluster}
             */
            this.leftButtons = new FourButtonsCluster(this._buttonsDown[13], this._buttonsDown[15], this._buttonsDown[14], this._buttonsDown[12]);

            /**
             * Center cluster button states.
             * @name Gamepad#leftButtons
             * @type {FourButtonsCluster}
             */
            this.centerButtons = new ThreeButtonsCluster(this._buttonsDown[8], this._buttonsDown[9], this._buttonsDown[16]);

            /**
             * Front buttons states.
             * @name Gamepad#frontButtons
             * @type {FrontButtons}
             */            
            this.frontButtons = new FrontButtons(this._buttonsDown[4], this._buttonsDown[5], this._buttonsDown[6], this._buttonsDown[7]);

            /**
             * True if the gamepad is of a known type and we have extra mapped attributes.
             * False if unknown.
             * @name Gamepad#isMapped
             * @type {Boolean}
             */
            this.isMapped = true;
        }

        // freeze self
        Object.freeze(this);
    }

    /**
     * Get button state (if pressed down) by index.
     * @param {Number} index Button index to check.
     * @returns {Boolean} True if pressed, false otherwise.
     */
    button(index)
    {
        return this._buttonsDown[index];
    }

    /**
     * Get buttons count.
     * @returns {Number} Buttons count.
     */
    get buttonsCount()
    {
        return this._buttonsDown.length;
    }
}


/**
 * Buttons cluster container - 4 buttons.
 */
class FourButtonsCluster
{
    /**
     * Create the cluster states.
     * @param {Boolean} bottom Bottom button state.
     * @param {Boolean} right Right button state.
     * @param {Boolean} left Left button state.
     * @param {Boolean} top Top button state.
     */
    constructor(bottom, right, left, top)
    {
        this.bottom = Boolean(bottom);
        this.right = Boolean(right);
        this.left = Boolean(left);
        this.top = Boolean(top);
    }
}


/**
 * Buttons cluster container - 3 buttons.
 */
class ThreeButtonsCluster
{
    /**
     * Create the cluster states.
     * @param {Boolean} left Left button state.
     * @param {Boolean} right Right button state.
     * @param {Boolean} center Center button state.
     */
    constructor(left, right, center)
    {
        this.left = Boolean(left);
        this.right = Boolean(right);
        this.center = Boolean(center);
    }
}


/**
 * Front buttons.
 */
class FrontButtons
{
    /**
     * Create the cluster states.
     */
    constructor(topLeft, topRight, bottomLeft, bottomRight)
    {
        this.topLeft = Boolean(topLeft);
        this.topRight = Boolean(topRight);
        this.bottomLeft = Boolean(bottomLeft);
        this.bottomRight = Boolean(bottomRight);
    }
}


/**
 * Get if a gamepad button is currently pressed.
 * @prviate
 */
function _gamepadButtonPressed(b) 
{
    if (typeof b === "object") {
    return b.pressed;
    }
    return b === 1.0;
}


// export the gamepad data
module.exports = Gamepad;
},{"../utils/vector2":67}],42:[function(require,module,exports){
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
 module.exports = require('./input');
},{"./input":43}],43:[function(require,module,exports){
/**
 * Implement the input manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\input.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const IManager = require('../manager.js');
const Vector2 = require('../utils/vector2.js');
const { MouseButton, MouseButtons, KeyboardKey, KeyboardKeys } = require('./key_codes.js');
const Gamepad = require('./gamepad');
const _logger = require('../logger.js').getLogger('input');


// get timestamp
function timestamp()
{
    return (new Date()).getTime();
}

// touch key code
const _touchKeyCode = "touch";


/**
 * Input manager. 
 * Used to recieve input from keyboard and mouse.
 * 
 * To access the Input manager use `Shaku.input`. 
 */
class Input extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();
        
        // callbacks and target we listen to input on
        this._callbacks = null;
        this._targetElement = window;

        /**
         * If true, will prevent default input events by calling preventDefault().
         * @name Input#preventDefaults
         * @type {Boolean}
         */
        this.preventDefaults = false;

        /**
         * By default, when holding wheel button down browsers will turn into special page scroll mode and will not emit mouse move events.
         * if this property is set to true (default), the Input manager will prevent this behavior, so we could still get mouse delta while mouse wheel is held down.
         * @name Input#enableMouseDeltaWhileMouseWheelDown
         * @type {Boolean}
         */
        this.enableMouseDeltaWhileMouseWheelDown = true;

        /**
         * If true (default), will disable the context menu (what typically opens when you right click the page).
         * @name Input#disableContextMenu
         * @type {Boolean}
         */
        this.disableContextMenu = true;

        /**
         * If true (default), will treat touch events (touch start / touch end / touch move) as if the user clicked and moved a mouse.
         * @name Input#delegateTouchInputToMouse
         * @type {Boolean}
         */
        this.delegateTouchInputToMouse = true;

        /**
         * If true (default), will delegate events from mapped gamepads to custom keys. 
         * This will add the following codes to all basic query methods (down, pressed, released, doublePressed, doubleReleased):
         * - gamepadX_top: state of arrow keys top key (left buttons).
         * - gamepadX_bottom: state of arrow keys bottom key (left buttons).
         * - gamepadX_left: state of arrow keys left key (left buttons).
         * - gamepadX_right: state of arrow keys right key (left buttons).
         * - gamepadX_leftStickUp: true if left stick points directly up.
         * - gamepadX_leftStickDown: true if left stick points directly down.
         * - gamepadX_leftStickLeft: true if left stick points directly left.
         * - gamepadX_leftStickRight: true if left stick points directly right.
         * - gamepadX_rightStickUp: true if right stick points directly up.
         * - gamepadX_rightStickDown: true if right stick points directly down.
         * - gamepadX_rightStickLeft: true if right stick points directly left.
         * - gamepadX_rightStickRight: true if right stick points directly right.
         * - gamepadX_a: state of A key (from right buttons).
         * - gamepadX_b: state of B key (from right buttons).
         * - gamepadX_x: state of X key (from right buttons).
         * - gamepadX_y: state of Y key (from right buttons).
         * - gamepadX_frontTopLeft: state of the front top-left button.
         * - gamepadX_frontTopRight: state of the front top-right button.
         * - gamepadX_frontBottomLeft: state of the front bottom-left button.
         * - gamepadX_frontBottomRight: state of the front bottom-right button.
         * Where X in `gamepad` is the gamepad index: gamepad0, gamepad1, gamepad2..
         * @name Input#delegateGamepadInputToKeys
         * @type {Boolean}
         */
        this.delegateGamepadInputToKeys = true;

        /**
         * If true (default), will reset all states if the window loses focus.
         * @name Input#resetOnFocusLoss
         * @type {Boolean}
         */
        this.resetOnFocusLoss = true;

        /**
         * Default time, in milliseconds, to consider two consecutive key presses as a double-press.
         * @name Input#defaultDoublePressInterval
         * @type {Number}
         */
        this.defaultDoublePressInterval = 250;

        // set base state members
        this._resetAll();
    }

    /**
     * Get the Mouse Buttons enum.
     * @see MouseButtons
     */
    get MouseButtons()
    {
        return MouseButtons;
    }
 
    /**
     * Get the Keyboard Buttons enum.
     * @see KeyboardKeys
     */
    get KeyboardKeys()
    {
        return KeyboardKeys;
    }

    /**
     * Return the string code to use in order to get touch events.
     * @returns {String} Key code to use for touch events.
     */
    get TouchKeyCode()
    {
        return _touchKeyCode;
    }
    
    /**
     * @inheritdoc
     * @private
     **/
    setup()
    {        
        return new Promise((resolve, reject) => {

            _logger.info("Setup input manager..");

            // if target element is a method, invoke it
            if (typeof this._targetElement === 'function') {
                this._targetElement = this._targetElement();
                if (!this._targetElement) {
                    throw new Error("Input target element was set to be a method, but the returned value was invalid!");
                }
            }

            // get element to attach to
            let element = this._targetElement;

            // to make sure keyboard input would work if provided with canvas entity
            if (element.tabIndex === -1 || element.tabIndex === undefined) {
                element.tabIndex = 1000;
            }

            // focus on target element
            window.setTimeout(() => element.focus(), 0);

            // set all the events to listen to
            var _this = this;
            this._callbacks = {
                'mousedown': function(event) {_this._onMouseDown(event); if (this.preventDefaults) event.preventDefault(); },
                'mouseup': function(event) {_this._onMouseUp(event); if (this.preventDefaults) event.preventDefault(); },
                'mousemove': function(event) {_this._onMouseMove(event); if (this.preventDefaults) event.preventDefault(); },
                'keydown': function(event) {_this._onKeyDown(event); if (this.preventDefaults) event.preventDefault(); },
                'keyup': function(event) {_this._onKeyUp(event); if (this.preventDefaults) event.preventDefault(); },
                'blur': function(event) {_this._onBlur(event); if (this.preventDefaults) event.preventDefault(); },
                'wheel': function(event) {_this._onMouseWheel(event); if (this.preventDefaults) event.preventDefault(); },
                'touchstart': function(event) {_this._onTouchStart(event); if (this.preventDefaults) event.preventDefault(); },
                'touchend': function(event) {_this._onTouchEnd(event); if (this.preventDefaults) event.preventDefault(); },
                'touchmove': function(event) {_this._onTouchMove(event); if (this.preventDefaults) event.preventDefault(); },
                'contextmenu': function(event) { if (_this.disableContextMenu) { event.preventDefault(); } },
            };

            // reset all data to init initial state
            this._resetAll();
                    
            // register all callbacks
            for (var event in this._callbacks) {
                element.addEventListener(event, this._callbacks[event], false);
            }

            // if we have a specific element, still capture mouse release outside of it
            if (element !== window) {
                window.addEventListener('mouseup', this._callbacks['mouseup'], false);
                window.addEventListener('touchend', this._callbacks['touchend'], false);
            }
            
            // custom keys set
            this._customKeys = new Set();

            // ready!
            resolve();
        });
    }

    /**
     * @inheritdoc
     * @private
     **/
    startFrame()
    {
        // query gamepads
        this._gamepadsData = navigator.getGamepads();

        // get default gamepad
        this._defaultGamepad = null;
        var i = 0;
        for (let gp of this._gamepadsData) 
        {
            if (gp) {
                this._defaultGamepad = gp;
                this._defaultGamepadIndex = i;
                break;
            }
            i++;
        }

        // reset queried gamepad states
        this._queriedGamepadStates = {};

        // delegate gamepad keys
        if (this.delegateGamepadInputToKeys) {
            for (let i = 0; i < 4; ++i) {

                // get current gamepad
                const gp = this.gamepad(i);

                // not set or not mapped? reset all values to false and continue
                if (!gp || !gp.isMapped) { 
                    this.setCustomState(`gamepad${i}_top`, false);
                    this.setCustomState(`gamepad${i}_bottom`, false);
                    this.setCustomState(`gamepad${i}_left`, false);
                    this.setCustomState(`gamepad${i}_right`, false);
                    this.setCustomState(`gamepad${i}_y`, false);
                    this.setCustomState(`gamepad${i}_a`, false);
                    this.setCustomState(`gamepad${i}_x`, false);
                    this.setCustomState(`gamepad${i}_b`, false);
                    this.setCustomState(`gamepad${i}_frontTopLeft`, false);
                    this.setCustomState(`gamepad${i}_frontTopRight`, false);
                    this.setCustomState(`gamepad${i}_frontBottomLeft`, false);
                    this.setCustomState(`gamepad${i}_frontBottomRight`, false);
                    this.setCustomState(`gamepad${i}_leftStickUp`, false);
                    this.setCustomState(`gamepad${i}_leftStickDown`, false);
                    this.setCustomState(`gamepad${i}_leftStickLeft`, false);
                    this.setCustomState(`gamepad${i}_leftStickRight`, false);
                    this.setCustomState(`gamepad${i}_rightStickUp`, false);
                    this.setCustomState(`gamepad${i}_rightStickDown`, false);
                    this.setCustomState(`gamepad${i}_rightStickLeft`, false);
                    this.setCustomState(`gamepad${i}_rightStickRight`, false);
                    continue; 
                }

                // set actual values

                this.setCustomState(`gamepad${i}_top`, gp.leftButtons.top);
                this.setCustomState(`gamepad${i}_bottom`, gp.leftButtons.bottom);
                this.setCustomState(`gamepad${i}_left`, gp.leftButtons.left);
                this.setCustomState(`gamepad${i}_right`, gp.leftButtons.right);

                this.setCustomState(`gamepad${i}_y`, gp.rightButtons.top);
                this.setCustomState(`gamepad${i}_a`, gp.rightButtons.bottom);
                this.setCustomState(`gamepad${i}_x`, gp.rightButtons.left);
                this.setCustomState(`gamepad${i}_b`, gp.rightButtons.right);
                
                this.setCustomState(`gamepad${i}_frontTopLeft`, gp.frontButtons.topLeft);
                this.setCustomState(`gamepad${i}_frontTopRight`, gp.frontButtons.topRight);
                this.setCustomState(`gamepad${i}_frontBottomLeft`, gp.frontButtons.bottomLeft);
                this.setCustomState(`gamepad${i}_frontBottomRight`, gp.frontButtons.bottomRight);

                this.setCustomState(`gamepad${i}_leftStickUp`, gp.leftStick.y < -0.8);
                this.setCustomState(`gamepad${i}_leftStickDown`, gp.leftStick.y > 0.8);
                this.setCustomState(`gamepad${i}_leftStickLeft`, gp.leftStick.x < -0.8);
                this.setCustomState(`gamepad${i}_leftStickRight`, gp.leftStick.x > 0.8);

                this.setCustomState(`gamepad${i}_rightStickUp`, gp.rightStick.y < -0.8);
                this.setCustomState(`gamepad${i}_rightStickDown`, gp.rightStick.y > 0.8);
                this.setCustomState(`gamepad${i}_rightStickLeft`, gp.rightStick.x < -0.8);
                this.setCustomState(`gamepad${i}_rightStickRight`, gp.rightStick.x > 0.8);
            }
        }
    }

    /**
     * @inheritdoc
     * @private
     **/
    destroy()
    {
        // unregister all callbacks
        if (this._callbacks)
        {
            let element = this._targetElement;

            for (var event in this._callbacks) {
                element.removeEventListener(event, this._callbacks[event]);
            }

            if (element !== window) {
                window.removeEventListener('mouseup', this._callbacks['mouseup'], false);
                window.removeEventListener('touchend', this._callbacks['touchend'], false);
            }
            
            this._callbacks = null;
        }
    }

    /**
     * Set the target element to attach input to. If not called, will just use the entire document.
     * Must be called *before* initializing Shaku. This can also be a method to invoke while initializing.
     * @example
     * // the following will use whatever canvas the gfx manager uses as input element.
     * // this means mouse offset will also be relative to this element.
     * Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
     * @param {Element | elementCallback} element Element to attach input to.
     */
    setTargetElement(element)
    {
        if (this._callbacks) { throw new Error("'setTargetElement() must be called before initializing the input manager!"); }
        this._targetElement = element;
    }

    /**
     * Reset all internal data and states.
     * @private
     */
    _resetAll()
    {
        // mouse states
        this._mousePos = new Vector2();
        this._mousePrevPos = new Vector2();
        this._mouseState = {};
        this._mouseWheel = 0;

        // touching states
        this._touchPosition = new Vector2();
        this._isTouching = false;
        this._touchStarted = false;
        this._touchEnded = false;

        // keyboard keys
        this._keyboardState = {};
        this._keyboardPrevState = {};

        // reset pressed / release events
        this._keyboardPressed = {};
        this._keyboardReleased = {};
        this._mousePressed = {};
        this._mouseReleased = {};

        // for custom states
        this._customStates = {};
        this._customPressed = {};
        this._customReleased = {};
        this._lastCustomReleasedTime = {};
        this._lastCustomPressedTime = {};
        this._prevLastCustomReleasedTime = {};
        this._prevLastCustomPressedTime = {};

        // for last release time and to count double click / double pressed events
        this._lastMouseReleasedTime = {};
        this._lastKeyReleasedTime = {};
        this._lastTouchReleasedTime = 0;
        this._lastMousePressedTime = {};
        this._lastKeyPressedTime = {};
        this._lastTouchPressedTime = 0;
        this._prevLastMouseReleasedTime = {};
        this._prevLastKeyReleasedTime = {};
        this._prevLastTouchReleasedTime = 0;
        this._prevLastMousePressedTime = {};
        this._prevLastKeyPressedTime = {};
        this._prevLastTouchPressedTime = 0;

        // currently connected gamepads data
        this._defaultGamepad = null;
        this._gamepadsData = [];
        this._queriedGamepadStates = {};
    }

    /**
     * Get Gamepad current states, or null if not connected.
     * Note: this object does not update itself, you'll need to query it again every frame.
     * @param {Number=} index Gamepad index or undefined for first connected device.
     * @returns {Gamepad} Gamepad current state.
     */
    gamepad(index)
    {
        // default index
        if (index === null || index === undefined) {
            index = this._defaultGamepadIndex;
        }

        // try to get cached value
        let cached = this._queriedGamepadStates[index];

        // not found? create
        if (!cached) {
            const gp = this._gamepadsData[index];
            if (!gp) { return null; }
            this._queriedGamepadStates[index] = cached = new Gamepad(gp);
        }

        // return gamepad state
        return cached;
    }

    /**
     * Get gamepad id, or null if not connected to this slot.
     * @param {Number=} index Gamepad index or undefined for first connected device.
     * @returns Gamepad id or null.
     */
    gamepadId(index)
    {
        return this.gamepadIds()[index || 0] || null;
    }

    /**
     * Return a list with connected devices ids.
     * @returns {Array<String>} List of connected devices ids.
     */
    gamepadIds()
    {
        let ret = [];
        for (let gp of this._gamepadsData) {
            if (gp) { ret.push(gp.id); }
        }
        return ret;
    }

    /**
     * Get touch screen touching position.
     * Note: if not currently touching, will return last known position.
     * @returns {Vector2} Touch position.
     */
    get touchPosition()
    {
        return this._touchPosition.clone();
    }

    /**
     * Get if currently touching a touch screen.
     * @returns {Boolean} True if currently touching the screen.
     */
    get touching()
    {
        return this._isTouching;
    }

    /**
     * Get if started touching a touch screen in current frame.
     * @returns {Boolean} True if started touching the screen now.
     */
    get touchStarted()
    {
        return this._touchStarted;
    }
    
    /**
     * Get if stopped touching a touch screen in current frame.
     * @returns {Boolean} True if stopped touching the screen now.
     */
    get touchEnded()
    {
        return this._touchEnded;
    }

    /**
     * Set a custom key code state you can later use with all the built in methods (down / pressed / released / doublePressed, etc.)
     * For example, lets say you want to implement a simulated keyboard and use it alongside the real keyboard. 
     * When your simulated keyboard space key is pressed, you can call `setCustomState('sim_space', true)`. When released, call `setCustomState('sim_space', false)`.
     * Now you can use `Shaku.input.down(['space', 'sim_space'])` to check if either a real space or simulated space is pressed down.
     * @param {String} code Code to set state for.
     * @param {Boolean|null} value Current value to set, or null to remove custom key.
     */
    setCustomState(code, value)
    {
        // remove custom value
        if (value === null) {
            this._customKeys.delete(code);
            delete this._customPressed[code];
            delete this._customReleased[code];
            delete this._customStates[code];
            return;
        }
        // update custom codes
        else {
            this._customKeys.add(code);
        }

        // set state
        value = Boolean(value);
        const prev = Boolean(this._customStates[code]);
        this._customStates[code] = value;

        // set defaults
        if (this._customPressed[code] === undefined) {
            this._customPressed[code] = false; 
        }
        if (this._customReleased[code] === undefined) {
            this._customReleased[code] = false; 
        }

        // pressed now?
        if (!prev && value) {
            this._customPressed[code] = true;
            this._prevLastCustomPressedTime[code] = this._lastCustomPressedTime[code];
            this._lastCustomPressedTime[code] = timestamp();
        }

        // released now?
        if (prev && !value) {
            this._customReleased[code] = true;
            this._prevLastCustomReleasedTime[code] = this._lastCustomReleasedTime[code];
            this._lastCustomReleasedTime[code] = timestamp();
        }
    }

    /**
     * Get mouse position.
     * @returns {Vector2} Mouse position.
     */
    get mousePosition()
    {
        return this._mousePos.clone();
    }
        
    /**
     * Get mouse previous position (before the last endFrame() call).
     * @returns {Vector2} Mouse position in previous frame.
     */
    get prevMousePosition()
    {
        return (this._mousePrevPos || this._mousePos).clone();
    }

    /**
     * Get mouse movement since last endFrame() call.
     * @returns {Vector2} Mouse change since last frame.
     */
    get mouseDelta()
    {
        // no previous position? return 0,0.
        if (!this._mousePrevPos) {
            return Vector2.zero;
        }

        // return mouse delta
        return new Vector2(this._mousePos.x - this._mousePrevPos.x, this._mousePos.y - this._mousePrevPos.y);
    }

    /**
     * Get if mouse is currently moving.
     * @returns {Boolean} True if mouse moved since last frame, false otherwise.
     */
    get mouseMoving()
    {
        return (this._mousePrevPos && !this._mousePrevPos.equals(this._mousePos));
    }

    /**
     * Get if mouse button was pressed this frame.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} True if mouse button is currently down, but was up in previous frame.
     */
    mousePressed(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(this._mousePressed[button]);
    }

    /**
     * Get if mouse button is currently pressed.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).  
     * @returns {Boolean} true if mouse button is currently down, false otherwise.
     */
    mouseDown(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(this._mouseState[button]);
    }

    /**
     * Get if mouse button is currently not down.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} true if mouse button is currently up, false otherwise.
     */
    mouseUp(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(!this.mouseDown(button));
    }
    
    /**
     * Get if mouse button was released in current frame.
     * @param {MouseButton} button Button code (defults to MouseButtons.left).
     * @returns {Boolean} True if mouse was down last frame, but released in current frame.
     */
    mouseReleased(button = 0)
    {
        if (button === undefined) throw new Error("Invalid button code!");
        return Boolean(this._mouseReleased[button]);
    }

    /**
     * Get if keyboard key is currently pressed down.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {boolean} True if keyboard key is currently down, false otherwise.
     */
    keyDown(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(this._keyboardState[key]);
    }

    /**
     * Get if keyboard key is currently not down.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {Boolean} True if keyboard key is currently up, false otherwise.
     */
    keyUp(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(!this.keyDown(key));
    }

    /**
     * Get if a keyboard button was released in current frame.
     * @param {KeyboardKey} button Keyboard key code.
     * @returns {Boolean} True if key was down last frame, but released in current frame.
     */
    keyReleased(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(this._keyboardReleased[key]);
    }
    
    /**
     * Get if keyboard key was pressed this frame.
     * @param {KeyboardKey} key Keyboard key code.
     * @returns {Boolean} True if key is currently down, but was up in previous frame.
     */
    keyPressed(key)
    {
        if (key === undefined) throw new Error("Invalid key code!");
        return Boolean(this._keyboardPressed[key]);
    }

    /**
     * Get if any of the shift keys are currently down.
     * @returns {Boolean} True if there's a shift key pressed down.
     */
    get shiftDown()
    {
        return Boolean(this.keyDown(this.KeyboardKeys.shift));
    }

    /**
     * Get if any of the Ctrl keys are currently down.
     * @returns {Boolean} True if there's a Ctrl key pressed down.
     */
    get ctrlDown()
    {
        return Boolean(this.keyDown(this.KeyboardKeys.ctrl));
    }

    /**
     * Get if any of the Alt keys are currently down.
     * @returns {Boolean} True if there's an Alt key pressed down.
     */
    get altDown()
    {
        return Boolean(this.keyDown(this.KeyboardKeys.alt));
    }

    /**
     * Get if any keyboard key was pressed this frame.
     * @returns {Boolean} True if any key was pressed down this frame.
     */
    get anyKeyPressed()
    {
        return Object.keys(this._keyboardPressed).length !== 0;
    }

    /**
     * Get if any keyboard key is currently down.
     * @returns {Boolean} True if there's a key pressed down.
     */
    get anyKeyDown()
    {
        for (var key in this._keyboardState) {
            if (this._keyboardState[key]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get if any mouse button was pressed this frame.
     * @returns {Boolean} True if any of the mouse buttons were pressed this frame.
     */
     get anyMouseButtonPressed()
     {
        return Object.keys(this._mousePressed).length !== 0;
     }

    /**
     * Get if any mouse button is down.
     * @returns {Boolean} True if any of the mouse buttons are pressed.
     */
    get anyMouseButtonDown()
    {
        for (var key in this._mouseState) {
            if (this._mouseState[key]) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard state in a generic way. Used internally.
     * @private
     * @param {string} code Keyboard, mouse or touch code. 
     *                          For mouse buttons: mouse_left, mouse_right or mouse_middle.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch: just use 'touch' as code.
     *                          For numbers (0-9): you can use the number.
     * @param {Function} mouseCheck Callback to use to return value if its a mouse button code.
     * @param {Function} keyboardCheck Callback to use to return value if its a keyboard key code.
     * @param {*} touchValue Value to use to return value if its a touch code.
     * @param {*} customValues Dictionary to check for custom values injected via setCustomState().
     */
    _getValueWithCode(code, mouseCheck, keyboardCheck, touchValue, customValues)
    {
        // make sure code is string
        code = String(code);

        // check for custom values
        const customVal = customValues[code];
        if (customVal !== undefined) {
            return customVal;
        }
        if (this._customKeys.has(code)) {
            return false;
        }

        // if its 'touch' its for touch events
        if (code === _touchKeyCode) {
            return touchValue;
        }

        // if starts with 'mouse' its for mouse button events
        if (code.indexOf('mouse_') === 0) {

            // get mouse code name
            const codename = code.split('_')[1];
            const mouseKey = this.MouseButtons[codename];
            if (mouseKey === undefined) { 
                throw new Error("Unknown mouse button: " + code);
            }

            // return if mouse down
            return mouseCheck.call(this, mouseKey);
        }

        // if its just a number, add the 'n' prefix
        if (!isNaN(parseInt(code)) && code.length === 1) {
            code = 'n' + code;
        }

        // if not start with 'mouse', treat it as a keyboard key
        const keyboardKey = this.KeyboardKeys[code];
        if (keyboardKey === undefined) { 
            throw new Error("Unknown keyboard key: " + code);
        }
        return keyboardCheck.call(this, this.KeyboardKeys[code]);
    }

    /**
     * Return if a mouse or keyboard button is currently down.
     * @example
     * if (Shaku.input.down(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space are pressed!'); }
     * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button are down.
     */
    down(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mouseDown, this.keyDown, this.touching, this._customStates))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard button was released in this frame.
     * @example
     * if (Shaku.input.released(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were released!'); }
     * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button were down in previous frame, and released this frame.
     */
    released(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mouseReleased, this.keyReleased, this.touchEnded, this._customReleased))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return if a mouse or keyboard button was pressed in this frame.
     * @example
     * if (Shaku.input.pressed(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were pressed!'); }
     * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Boolean} True if key or mouse button where up in previous frame, and pressed this frame.
     */
    pressed(code)
    {
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (Boolean(this._getValueWithCode(c, this.mousePressed, this.keyPressed, this.touchStarted, this._customPressed))) {
                return true;
            }
        }
        return false;
    }

    /**
     * Return timestamp, in milliseconds, of the last time this key code was released.
     * @example
     * let lastReleaseTime = Shaku.input.lastReleaseTime('mouse_left');
     * @param {string} code Keyboard, touch or mouse code.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Number} Timestamp of last key release, or 0 if was never released.
     */
    lastReleaseTime(code)
    {
        if (code instanceof Array) { throw new Error("Array not supported in 'lastReleaseTime'!"); }
        return this._getValueWithCode(code, (c) => this._lastMouseReleasedTime[c], (c) => this._lastKeyReleasedTime[c], this._lastTouchReleasedTime, this._prevLastCustomReleasedTime) || 0;
    }

    /**
     * Return timestamp, in milliseconds, of the last time this key code was pressed.
     * @example
     * let lastPressTime = Shaku.input.lastPressTime('mouse_left');
     * @param {string} code Keyboard, touch or mouse code.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @returns {Number} Timestamp of last key press, or 0 if was never pressed.
     */
    lastPressTime(code)
    {
        if (code instanceof Array) { throw new Error("Array not supported in 'lastPressTime'!"); }
        return this._getValueWithCode(code, (c) => this._lastMousePressedTime[c], (c) => this._lastKeyPressedTime[c], this._lastTouchPressedTime, this._prevLastCustomPressedTime) || 0;
    }
    
    /**
     * Return if a key was double-pressed.
     * @example
     * let doublePressed = Shaku.input.doublePressed(['mouse_left', 'touch', 'space']);
     * @param {string} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is double-pressed.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-press. Defaults to `defaultDoublePressInterval`.
     * @returns {Boolean} True if one or more key codes double-pressed, false otherwise.
     */ 
    doublePressed(code, maxInterval)
    {
        // default interval
        maxInterval = maxInterval || this.defaultDoublePressInterval;

        // current timestamp
        let currTime = timestamp();

        // check all keys
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (this.pressed(c)) {
                let currKeyTime = this._getValueWithCode(c, (c) => this._prevLastMousePressedTime[c], (c) => this._prevLastKeyPressedTime[c], this._prevLastTouchPressedTime, this._prevLastCustomPressedTime);
                if (currTime - currKeyTime <= maxInterval) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Return if a key was double-released.
     * @example
     * let doubleReleased = Shaku.input.doubleReleased(['mouse_left', 'touch', 'space']);
     * @param {string} code Keyboard, touch or mouse code. Can be array of codes to test if any of them is double-released.
     *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
     *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
     *                          For touch screen: set code to 'touch'.
     *                          For numbers (0-9): you can use the number itself.
     *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
     * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-release. Defaults to `defaultDoublePressInterval`.
     * @returns {Boolean} True if one or more key codes double-released, false otherwise.
     */ 
    doubleReleased(code, maxInterval)
    {
        // default interval
        maxInterval = maxInterval || this.defaultDoublePressInterval;

        // current timestamp
        let currTime = timestamp();

        // check all keys
        if (!(code instanceof Array)) { code = [code]; }
        for (let c of code) {
            if (this.released(c)) {
                let currKeyTime = this._getValueWithCode(c, (c) => this._prevLastMousePressedTime[c], (c) => this._prevLastKeyPressedTime[c], this._prevLastTouchPressedTime, this._prevLastCustomPressedTime);
                if (currTime - currKeyTime <= maxInterval) {
                    return true;
                }
            }
        }
        return false;
    }
    
    /**
     * Get mouse wheel sign.
     * @returns {Number} Mouse wheel sign (-1 or 1) for wheel scrolling that happened during this frame.
     * Will return 0 if mouse wheel is not currently being used.
     */
    get mouseWheelSign()
    {
        return Math.sign(this._mouseWheel);
    }

    /**
     * Get mouse wheel value.
     * @returns {Number} Mouse wheel value.
     */
    get mouseWheel()
    {
        return this._mouseWheel;
    }

    /**
     * @inheritdoc
     * @private
     **/
    endFrame()
    {
        // set mouse previous position and clear mouse move cache
        this._mousePrevPos = this._mousePos.clone();

        // reset pressed / release events
        this._keyboardPressed = {};
        this._keyboardReleased = {};
        this._mousePressed = {};
        this._mouseReleased = {};
        this._customPressed = {};
        this._customReleased = {};

        // reset touch start / end states
        this._touchStarted = false;
        this._touchEnded = false;

        // reset mouse wheel
        this._mouseWheel = 0;
    }

    /**
     * Get keyboard key code from event.
     * @private
     */
    _getKeyboardKeyCode(event)
    {
        event = this._getEvent(event);
        return event.keyCode !== undefined ? event.keyCode : event.key.charCodeAt(0);
    }

    /**
     * Called when window loses focus - clear all input states to prevent keys getting stuck.
     * @private
     */
    _onBlur(event)
    {
        if (this.resetOnFocusLoss) {
            this._resetAll();
        }
    }

    /**
     * Handle mouse wheel events.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseWheel(event)
    {
        this._mouseWheel = event.deltaY;
    }

    /**
     * Handle keyboard down event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onKeyDown(event)
    {
        var keycode = this._getKeyboardKeyCode(event);
        if (!this._keyboardState[keycode]) {
            this._keyboardPressed[keycode] = true;
            this._prevLastKeyPressedTime[keycode] = this._lastKeyPressedTime[keycode];
            this._lastKeyPressedTime[keycode] = timestamp();
        }
        this._keyboardState[keycode] = true;
    }

    /**
     * Handle keyboard up event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onKeyUp(event)
    {
        var keycode = this._getKeyboardKeyCode(event) || 0;
        this._keyboardState[keycode] = false;
        this._keyboardReleased[keycode] = true;
        this._prevLastKeyReleasedTime[keycode] = this._lastKeyReleasedTime[keycode];
        this._lastKeyReleasedTime[keycode] = timestamp();
    }

    /**
     * Extract position from touch event.
     * @private
     * @param {*} event Event data from browser.
     * @returns {Vector2} Position x,y or null if couldn't extract touch position.
     */
    _getTouchEventPosition(event)
    {
        var touches = event.changedTouches || event.touches;
        if (touches && touches.length) {
            var touch = touches[0];
            var x = touch.pageX || touch.offsetX || touch.clientX;
            var y = touch.pageY || touch.offsetY || touch.clientY;
            return new Vector2(x, y);
        }
        return null;
    }

    /**
     * Handle touch start event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onTouchStart(event)
    {
        // update position
        let position = this._getTouchEventPosition(event);
        if (position) {
            if (this.delegateTouchInputToMouse) {
                this._mousePos.x = position.x;
                this._mousePos.y = position.y;
                this._normalizeMousePos();
            }
        }

        // set touching flag
        this._isTouching = true;
        this._touchStarted = true;

        // update time
        this._prevLastTouchPressedTime = this._lastTouchPressedTime;
        this._lastTouchPressedTime = timestamp();

        // mark that touch started
        if (this.delegateTouchInputToMouse) {
            this._mouseButtonDown(this.MouseButtons.left);
        }
    }

    /**
     * Handle touch end event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onTouchEnd(event)
    {
        // update position
        let position = this._getTouchEventPosition(event);
        if (position) {
            this._touchPosition.copy(position);
            if (this.delegateTouchInputToMouse) {
                this._mousePos.x = position.x;
                this._mousePos.y = position.y;
                this._normalizeMousePos();
            }
        }

        // clear touching flag
        this._isTouching = false;
        this._touchEnded = true;

        // update touch end time
        this._prevLastTouchReleasedTime = this._lastTouchReleasedTime;
        this._lastTouchReleasedTime = timestamp();

        // mark that touch ended
        if (this.delegateTouchInputToMouse) {
            this._mouseButtonUp(this.MouseButtons.left);
        }
    }
    
    /**
     * Handle touch move event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onTouchMove(event)
    {
        // update position
        let position = this._getTouchEventPosition(event);
        if (position) {
            this._touchPosition.copy(position);
            if (this.delegateTouchInputToMouse) {
                this._mousePos.x = position.x;
                this._mousePos.y = position.y;
                this._normalizeMousePos();
            }
        }

        // set touching flag
        this._isTouching = true;
    }
    
    /**
     * Handle mouse down event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseDown(event)
    {
        event = this._getEvent(event);
        if (this.enableMouseDeltaWhileMouseWheelDown && (event.button === this.MouseButtons.middle))
        { 
            event.preventDefault(); 
        }
        this._mouseButtonDown(event.button);
    }

    /**
     * Handle mouse up event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseUp(event)
    {
        event = this._getEvent(event);
        this._mouseButtonUp(event.button);
    }

    /**
     * Mouse button pressed logic.
     * @private
     * @param {*} button Button pressed.
     */
    _mouseButtonDown(button)
    {
        this._mouseState[button] = true;
        this._mousePressed[button] = true;
        this._prevLastMousePressedTime[button] = this._lastMousePressedTime[button];
        this._lastMousePressedTime[button] = timestamp();
    }

    /**
     * Mouse button released logic.
     * @private
     * @param {*} button Button released.
     */
    _mouseButtonUp(button)
    {
        this._mouseState[button] = false;
        this._mouseReleased[button] = true;
        this._prevLastMouseReleasedTime[button] = this._lastMouseReleasedTime[button];
        this._lastMouseReleasedTime[button] = timestamp();
    }
    
    /**
     * Handle mouse move event.
     * @private
     * @param {*} event Event data from browser.
     */
    _onMouseMove(event)
    {
        // get event in a cross-browser way
        event = this._getEvent(event);

        // try to get position from event with some fallbacks
        var pageX = event.clientX; 
        if (pageX === undefined) { pageX = event.x; } 
        if (pageX === undefined) { pageX = event.offsetX; } 
        if (pageX === undefined) { pageX = event.pageX; }

        var pageY = event.clientY; 
        if (pageY === undefined) { pageY = event.y; } 
        if (pageY === undefined) { pageY = event.offsetY; } 
        if (pageY === undefined) { pageY = event.pageY; }

        // if pageX and pageY are not supported, use clientX and clientY instead
        if (pageX === undefined) {
            pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            pageY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        // set current mouse position
        this._mousePos.x = pageX;
        this._mousePos.y = pageY;
        this._normalizeMousePos();
    }

    /**
     * Normalize current _mousePos value to be relative to target element.
     * @private
     */
    _normalizeMousePos()
    {
        if (this._targetElement && this._targetElement.getBoundingClientRect) {
            var rect = this._targetElement.getBoundingClientRect();
            this._mousePos.x -= rect.left;
            this._mousePos.y -= rect.top;
        }
        this._mousePos.roundSelf();
    }

    /**
     * Get event either from event param or from window.event. 
     * This is for older browsers support.
     * @private
     */
    _getEvent(event)
    {
        return event || window.event;
    }
}


// export main object
module.exports = new Input();
},{"../logger.js":45,"../manager.js":46,"../utils/vector2.js":67,"./gamepad":41,"./key_codes.js":44}],44:[function(require,module,exports){
/**
 * Define keyboard and mouse key codes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\input\key_codes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/** @typedef {Number} MouseButton */

/**
 * Define mouse button codes.
 * @readonly
 * @enum {MouseButton}
 */
const MouseButtons = {
    left: 0,
    middle: 1,
    right: 2,
};

/** @typedef {Number} KeyboardKey */

/**
 * Define all keyboard key codes.
 * @readonly
 * @enum {KeyboardKey}
 */
const KeyboardKeys = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    break: 19,
    caps_lock: 20,
    escape: 27,
    page_up: 33,
    page_down: 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    space: 32,
    n0: 48,
    n1: 49,
    n2: 50,
    n3: 51,
    n4: 52,
    n5: 53,
    n6: 54,
    n7: 55,
    n8: 56,
    n9: 57,
    a: 65,
    b: 66,
    c: 67,
    d: 68,
    e: 69,
    f: 70,
    g: 71,
    h: 72,
    i: 73,
    j: 74,
    k: 75,
    l: 76,
    m: 77,
    n: 78,
    o: 79,
    p: 80,
    q: 81,
    r: 82,
    s: 83,
    t: 84,
    u: 85,
    v: 86,
    w: 87,
    x: 88,
    y: 89,
    z: 90,
    left_window_key: 91,
    right_window_key: 92,
    select_key: 93,
    numpad_0: 96,
    numpad_1: 97,
    numpad_2: 98,
    numpad_3: 99,
    numpad_4: 100,
    numpad_5: 101,
    numpad_6: 102,
    numpad_7: 103,
    numpad_8: 104,
    numpad_9: 105,
    multiply: 106,
    add: 107,
    subtract: 109,
    decimal_point: 110,
    divide: 111,
    f1: 112,
    f2: 113,
    f3: 114,
    f4: 115,
    f5: 116,
    f6: 117,
    f7: 118,
    f8: 119,
    f9: 120,
    f10: 121,
    f11: 122,
    f12: 123,
    numlock: 144,
    scroll_lock: 145,
    semicolon: 186,
    equal_sign: 187,
    plus: 187,
    comma: 188,
    dash: 189,
    minus: 189,
    period: 190,
    forward_slash: 191,
    grave_accent: 192,
    open_bracket: 219,
    back_slash: 220,
    close_braket: 221,
    single_quote: 222,
};

// export keyboard keys and mouse buttons
module.exports = { KeyboardKeys: KeyboardKeys, MouseButtons: MouseButtons };
},{}],45:[function(require,module,exports){
/**
 * Implement basic logger.
 * By default, uses console for logging, but it can be replaced with setDrivers().
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\logger.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

// default logger drivers.
var _drivers = console;

// application name
var _application = "Shaku";

/**
 * A logger manager.
 * By default writes logs to console.
 */
class Logger
{
    constructor(name)
    {
        this._nameHeader = '[' + _application + '][' + name + ']';
        this._throwErrors = false;
    }

    /**
     * Write a trace level log message.
     * @param {String} msg Message to write.
     */
    trace(msg)
    {
        _drivers.trace(this._nameHeader, msg);
    }

    /**
     * Write a debug level log message.
     * @param {String} msg Message to write.
     */
    debug(msg)
    {
        _drivers.debug(this._nameHeader, msg);
    }

    /**
     * Write an info level log message.
     * @param {String} msg Message to write.
     */
    info(msg)
    {
        _drivers.info(this._nameHeader, msg);
    }

    /**
     * Write a warning level log message.
     * @param {String} msg Message to write.
     */
    warn(msg)
    {
        _drivers.warn(this._nameHeader, msg);
        if (this._throwErrors) {
            throw new Error(msg);
        }
    }

    /**
     * Write an error level log message.
     * @param {String} msg Message to write.
     */
    error(msg)
    {
        _drivers.error(this._nameHeader, msg);
        if (this._throwErrors) {
            throw new Error(msg);
        }
    }

    /**
     * Set logger to throw an error every time a log message with severity higher than warning is written.
     * @param {Boolean} enable Set to true to throw error on warnings.
     */
    throwErrorOnWarnings(enable)
    {
        this._throwErrors = Boolean(enable);
    }
}


/**
 * Null logger drivers to silent logs.
 * @private
 */
class NullDrivers
{
    /**
     * @private
     */
    constructor()
    {
    }
    trace(msg)
    {
    }
    debug(msg)
    {
    }
    info(msg)
    {
    }
    warn(msg)
    {
    }
    error(msg)
    {
    }
}

// export the seeded random class.
module.exports = {

    /**
     * Get a logger object.
     * @param {String} name Logger name.
     */
    getLogger: function(name) {
        return new Logger(name);
    },

    /**
     * Silent the logger.
     */
    silent: function() {
        _drivers = new NullDrivers();
    },

    /**
     * Set log drivers that implement trace, debug, info, warn and error that all loggers will use.
     */
    setDrivers: function(drivers)
    {
        _drivers = drivers;
    },

    /**
     * Set logger application name.
     * @param {String} name Set application name to replace the 'Shaku' in the headers.
     */
    setApplicationName: function(name)
    {
        _application = name;
        return this;
    }
};
},{}],46:[function(require,module,exports){
/**
 * Define the managers interface.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\manager.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';


/**
 * Interface for any manager.
 * Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.
 */
class IManager
{
    /**
     * Initialize the manager.
     * @returns {Promise} Promise to resolve when initialization is done.
     */
    setup()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Called every update at the begining of the frame.
     */
    startFrame()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Called every update at the end of the frame.
     */
    endFrame()
    {
        throw new Error("Not Implemented!");
    }

    /**
     * Destroy the manager.
     */
    destroy()
    {
        throw new Error("Not Implemented!");
    }
}

// export the manager interface.
module.exports = IManager
},{}],47:[function(require,module,exports){
/**
 * Just an alias to main manager so we can require() this folder as a package.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
 module.exports = require('./sfx');
},{"./sfx":48}],48:[function(require,module,exports){
/**
 * Implement the sfx manager.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sfx.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const SoundAsset = require('../assets/sound_asset.js');
const IManager = require('../manager.js');
const _logger = require('../logger.js').getLogger('sfx');
const SoundInstance = require('./sound_instance.js');
const SoundMixer = require('./sound_mixer.js');
 

/**
 * Sfx manager. 
 * Used to play sound effects and music.
 * 
 * To access the Sfx manager use `Shaku.sfx`. 
 */
class Sfx extends IManager
{
    /**
     * Create the manager.
     */
    constructor()
    {
        super();
        this._playingSounds = null;
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    setup()
    {        
        return new Promise((resolve, reject) => {    
            _logger.info("Setup sfx manager..");
            this._playingSounds = new Set();
            resolve();
        });
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    startFrame()
    {
        var playingSounds = Array.from(this._playingSounds);
        for (var i = 0; i < playingSounds.length; ++i) {
            var sound = playingSounds[i];
            if (!sound.isPlaying) {
                this._playingSounds.delete(sound);
            }
        }
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    endFrame()
    {
        var playingSounds = Array.from(this._playingSounds);
        for (var i = 0; i < playingSounds.length; ++i) {
            var sound = playingSounds[i];
            if (!sound.isPlaying) {
                this._playingSounds.delete(sound);
            }
        }
    }

    /** 
     * @inheritdoc 
     * @private
     **/
    destroy()
    {
        this.stopAll();
        this._playingSounds = new Set();
    }

    /**
     * Get the SoundMixer class.
     * @see SoundMixer
     */
    get SoundMixer()
    {
        return SoundMixer;
    }

    /**
     * Play a sound once without any special properties and without returning a sound instance.
     * Its a more convinient method to play sounds, but less efficient than 'createSound()' if you want to play multiple times.
     * @example
     * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
     * Shaku.sfx.play(sound, 0.75);
     * @param {SoundAsset} sound Sound asset to play.
     * @param {Number} volume Volume to play sound (default to max).
     * @param {Number} playbackRate Optional playback rate factor.
     * @param {Boolean} preservesPitch Optional preserve pitch when changing rate factor.
     * @returns {Promise} Promise to resolve when sound starts playing.
     */
    play(sound, volume, playbackRate, preservesPitch)
    {
        var sound = this.createSound(sound);
        sound.volume = volume !== undefined ? volume : 1;
        if (playbackRate !== undefined) { sound.playbackRate = playbackRate; }
        if (preservesPitch !== undefined) { sound.preservesPitch = preservesPitch; }
        let ret = sound.play();
        sound.disposeWhenDone();
        return ret;
    }

    /**
     * Stop all playing sounds.
     * @example
     * Shaku.sfx.stopAll();
     */
    stopAll()
    {
        var playingSounds = Array.from(this._playingSounds);
        for (var i = 0; i < playingSounds.length; ++i) {
            var sound = playingSounds[i];
            sound.stop();
        }
        this._playingSounds = new Set();
    }

    /**
     * Get currently playing sounds count.
     * @returns {Number} Number of sounds currently playing.
     */
    get playingSoundsCount()
    {
        return this._playingSounds.size;
    }

    /**
     * Create and return a sound instance you can use to play multiple times.
     * @example
     * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
     * let soundInstance = Shaku.sfx.createSound(sound);
     * soundInstance.play();
     * @param {SoundAsset} sound Sound asset to play.
     * @returns {SoundInstance} Newly created sound instance.
     */
    createSound(sound)
    {
        if (!(sound instanceof SoundAsset)) { throw new Error("Sound type must be an instance of SoundAsset!"); }
        var ret = new SoundInstance(this, sound.url);
        return ret;
    }

    /**
     * Get master volume.
     * This affect all sound effects volumes.
     * @returns {Number} Current master volume value.
     */
    get masterVolume()
    {
        return SoundInstance._masterVolume;
    }
    
    /**
     * Set master volume.
     * This affect all sound effects volumes.
     * @param {Number} value Master volume to set.
     */
    set masterVolume(value)
    {
        SoundInstance._masterVolume = value;
        return value;
    }
}

// export main object
module.exports = new Sfx();
},{"../assets/sound_asset.js":8,"../logger.js":45,"../manager.js":46,"./sound_instance.js":49,"./sound_mixer.js":50}],49:[function(require,module,exports){
/**
 * Implement a sound effect instance.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sound_instance.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const _logger = require('../logger.js').getLogger('sfx');


/**
 * A sound effect instance you can play and stop.
 */
class SoundInstance
{
    /**
    * Create a sound instance.
    * @param {Sfx} sfxManager Sfx manager instance.
    * @param {String} url Sound URL or source.
    */
    constructor(sfxManager, url)
    {
        if (!url) {
            _logger.error("Sound type can't be null or invalid!");
            throw new Error("Invalid sound type to play in SoundInstance!");
        }
        this._sfx = sfxManager;
        this._audio = new Audio(url);
        this._volume = 1;
    }

    /**
     * Dispose the audio object when done playing the sound.
     * This will call dispose() automatically when audio ends.
     */
    disposeWhenDone()
    {
        this._audio.onended = () => {
            this.dispose();
        }
    }

    /**
     * Dispose the audio object and clear its resources.
     * When playing lots of sounds its important to call dispose on sounds you no longer use, to avoid getting hit by
     * "Blocked attempt to create a WebMediaPlayer" exception.
     */
    dispose()
    {
        this._audio.src = "";
        this._audio.srcObject = null;
        this._audio.remove();
        this._audio = null;
    }

    /**
    * Play sound.
    * @returns {Promise} Promise to return when sound start playing.
    */
    play()
    {
        if (this.playing) { return; }
        let promise = this._audio.play();
        this._sfx._playingSounds.add(this);
        return promise;
    }

    /**
    * Get sound effect playback rate.
    * @returns {Number} Playback rate.
    */
    get playbackRate()
    {
        return this._audio.playbackRate;
    }

    /**
    * Set playback rate.
    * @param {Number} val Playback value to set.
    */
    set playbackRate(val)
    {
        if (val < 0.1) { _logger.error("playbackRate value set is too low, value was capped to 0.1."); }
        if (val > 10) { _logger.error("playbackRate value set is too high, value was capped to 10."); }
        this._audio.playbackRate = val;
    }
    
    /**
    * Get if to preserve pitch while changing playback rate.
    * @returns {Boolean} Preserve pitch state of the sound instance.
    */
    get preservesPitch()
    {
        return Boolean(this._audio.preservesPitch || this._audio.mozPreservesPitch);
    }

    /**
    * Set if to preserve pitch while changing playback rate.
    * @param {Boolean} val New preserve pitch value to set.
    */
    set preservesPitch(val)
    {
        return this._audio.preservesPitch = this._audio.mozPreservesPitch = Boolean(val);
    }

    /**
    * Pause the sound.
    */
    pause()
    {
        this._audio.pause();
    }

    /**
    * Replay sound from start.
    * @returns {Promise} Promise to return when sound start playing.
    */
    replay()
    {
        this.stop();
        return this.play();
    }

    /**
    * Stop the sound and go back to start.
    * @returns {Boolean} True if successfully stopped sound, false otherwise.
    */
    stop()
    {
        try {
            this.pause();
            this.currentTime = 0;
            return true;
        }
        catch(e) {
            return false;
        }
    }

    /**
    * Get if playing in loop.
    * @returns {Boolean} If this sound should play in loop.
    */
    get loop()
    {
        return this._audio.loop;
    }

    /**
    * Set if playing in loop.
    * @param {Boolean} value If this sound should play in loop.
    */
    set loop(value)
    {
        this._audio.loop = value;
        return this._audio.loop;
    }

    /**
    * Get volume.
    * @returns {Number} Sound effect volume.
    */
    get volume()
    {
        return this._volume;
    }

    /**
    * Set volume.
    * @param {Number} value Sound effect volume to set.
    */
    set volume(value)
    {
        this._volume = value;
        var volume = (value * SoundInstance._masterVolume);
        if (volume < 0) { volume = 0; }
        if (volume > 1) { volume = 1; }
        this._audio.volume = volume;
        return this._volume;
    }

    /**
    * Get current time in track.
    * @returns {Number} Current time in playing sound.
    */
    get currentTime()
    {
        return this._audio.currentTime;
    }

    /**
    * Set current time in track.
    * @param {Number} value Set current playing time in sound track.
    */
    set currentTime(value)
    {
        return this._audio.currentTime = value;
    }

    /**
    * Get track duration.
    * @returns {Number} Sound duration in seconds.
    */
    get duration()
    {
        return this._audio.duration;
    }

    /**
    * Get if sound is currently paused.
    * @returns {Boolean} True if sound is currently paused.
    */
    get paused()
    {
        return this._audio.paused;
    }

    /**
    * Get if sound is currently playing.
    * @returns {Boolean} True if sound is currently playing.
    */
    get playing()
    {
        return !this.paused && !this.finished;
    }

    /**
    * Get if finished playing.
    * @returns {Boolean} True if sound reached the end and didn't loop.
    */
    get finished()
    {
        return this._audio.ended;
    }
}


// master volume
SoundInstance._masterVolume = 1;


// export main object
module.exports = SoundInstance;
},{"../logger.js":45}],50:[function(require,module,exports){
/**
 * Implement a sound mixer class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\sfx\sound_mixer.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const SoundInstance = require("./sound_instance.js");


/**
 * A utility class to mix between two sounds.
 */
class SoundMixer
{
    /**
     * Create the sound mixer.
     * @param {SoundInstance} sound1 Sound to mix from. Can be null to just fade in.
     * @param {SoundInstance} sound2 Sound to mix to. Can be null to just fade out.
     * @param {Boolean} allowOverlapping If true (default), will mix while overlapping sounds. 
     *                                   If false, will first finish first sound before begining next.
     */
    constructor(sound1, sound2, allowOverlapping)
    {
        this._sound1 = sound1;
        this._sound2 = sound2;
        this.fromSoundVolume = this._sound1 ? this._sound1.volume : 0;
        this.toSoundVolume = this._sound2 ? this._sound2.volume : 0;
        this.allowOverlapping = allowOverlapping;
        this.update(0);
    }

    /**
     * Stop both sounds.
     */
    stop()
    {
        if (this._sound1) { this._sound1.stop(); }
        if (this._sound2) { this._sound2.stop(); }
    }

    /**
     * Get first sound.
     * @returns {SoundInstance} First sound instance.
     */
    get fromSound()
    {
        return this._sound1;
    }

    /**
     * Get second sound.
     * @returns {SoundInstance} Second sound instance.
     */
    get toSound()
    {
        return this._sound2;
    }

    /**
     * Return current progress.
     * @returns {Number} Mix progress from 0 to 1.
     */
    get progress()
    {
        return this._progress;
    }

    /**
     * Update the mixer progress with time delta instead of absolute value.
     * @param {Number} delta Progress delta, in seconds.
     */
    updateDelta(delta)
    {
        this.update(this._progress + delta);
    }

    /**
     * Update the mixer progress.
     * @param {Number} progress Transition progress from sound1 to sound2. Values must be between 0.0 to 1.0.
     */
    update(progress)
    {
        // special case - start
        if (progress <= 0) {
            if (this._sound1) { 
                this._sound1.volume = this.fromSoundVolume;
            }
            if (this._sound2) {
                this._sound2.volume = 0;
                this._sound2.stop();
            }
            this._progress = 0;
        }
        // special case - finish
        if (progress >= 1) {
            if (this._sound2) {
                this._sound2.volume = this.toSoundVolume;
            }
            if (this._sound1) { 
                this._sound1.volume = 0;
                this._sound1.stop();
            }
            this._progress = 1;
        }
        // transition
        else
        {
            this._progress = progress;
            if (this._sound1) { this._sound1.play(); }
            if (this._sound2) { this._sound2.play(); }

            if (this.allowOverlapping) {
                if (this._sound1) { this._sound1.volume =  this.fromSoundVolume * (1 - progress); }  
                if (this._sound2) { this._sound2.volume =  this.toSoundVolume * progress; }
            }
            else {
                progress *= 2;
                if (this._sound1) { this._sound1.volume =  Math.max(this.fromSoundVolume * (1 - progress), 0); }
                if (this._sound2) { this._sound2.volume =  Math.max(this.toSoundVolume * (progress - 1), 0); }
            }
        }
    }
}

// export the sound mixer
module.exports = SoundMixer;
},{"./sound_instance.js":49}],51:[function(require,module,exports){
/**
 * Shaku Main.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\shaku.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const isBrowser = typeof window !== 'undefined';
const IManager = require("./manager");
const logger = require('./logger');
const sfx = isBrowser ? require('./sfx') : null;
const gfx = isBrowser ? require('./gfx') : null;
const input = isBrowser ? require('./input') : null;
const assets = require('./assets');
const collision = require('./collision');
const utils = require('./utils');
const GameTime = require("./utils/game_time");
const _logger = logger.getLogger('shaku');

// manager state and gametime
let _usedManagers = null;
let _prevUpdateTime = null;

// to measure fps
let _currFpsCounter = 0;
let _countSecond = 0;
let _currFps = 0;

// to measure time it takes for frames to finish
let _startFrameTime = 0;
let _frameTimeMeasuresCount = 0;
let _totalFrameTimes = 0;


// current version
const version = "1.6.4";


/**
 * Shaku's main object.
 * This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.
*/
class Shaku 
{
    /**
     * Create the Shaku main object.
     */
    constructor()
    {
        /**
         * Different utilities and framework objects, like vectors, rectangles, colors, etc.
         */
        this.utils = utils;

        /**
         * Sound effects and music manager.
         */
        this.sfx = sfx;

        /**
         * Graphics manager.
         */
        this.gfx = gfx;

        /**
         * Input manager.
         */
        this.input = input;

        /**
         * Assets manager.
         */
        this.assets = assets;

        /**
         * Collision detection manager.
         */
        this.collision = collision;

        /**
         * If true, will pause the updates and drawing calls when window is not focused.
         * Will also not update elapsed time.
         */
        this.pauseWhenNotFocused = false;

        /**
         * Set to true to completely pause Shaku (will skip updates, drawing, and time counting).
         */
        this.paused = false;

        /**
         * Set to true to pause just the game time.
         * This will not pause real-life time. If you need real-life time stop please use the Python package.
         */
        this.pauseTime = false;

        // are managers currently in 'started' mode?
        this._managersStarted = false;

        // were we previously paused?
        this._wasPaused = false;
    }

    /**
     * Method to select managers to use + initialize them.
     * @param {Array<IManager>=} managers Array with list of managers to use or null to use all.
     * @returns {Promise} promise to resolve when finish initialization.
     */
    async init(managers)
    {
        return new Promise(async (resolve, reject) => {

            // sanity & log
            if (_usedManagers) { throw new Error("Already initialized!"); }
            _logger.info(`Initialize Shaku v${version}.`);
            
            // reset game start time
            GameTime.reset();

            // setup used managers
            _usedManagers = managers || (isBrowser ? [assets, sfx, gfx, input, collision] : [assets, collision]);

            // init all managers
            for (let i = 0; i < _usedManagers.length; ++i) {
                await _usedManagers[i].setup();
            }

            // set starting time
            _prevUpdateTime = new GameTime();

            // done!
            resolve();
        });
    }

    /**
     * Destroy all managers
     */
    destroy()
    {
        // sanity
        if (!_usedManagers) { throw new Error("Not initialized!"); }
        
        // destroy all managers
        for (let i = 0; i < _usedManagers.length; ++i) {
            _usedManagers[i].destroy();
        }
    }

    /**
     * Get if the Shaku is currently paused.
     */
    get isPaused()
    {
        return this.paused || (this.pauseWhenNotFocused && !document.hasFocus());
    }

    /**
     * Start frame (update all managers).
     */
    startFrame()
    {
        // if paused, skip
        if (this.isPaused) { 
            this._wasPaused = true;
            return; 
        }

        // returning from pause
        if (this._wasPaused) {
            this._wasPaused = false;
            GameTime.resetDelta();
        }

        // update times
        if (this.pauseTime) {
            GameTime.resetDelta();
        }
        else {
            GameTime.update();
        }

        // get frame start time
        _startFrameTime = GameTime.rawTimestamp();

        // create new gameTime object
        this._gameTime = new GameTime();

        // update animators
        utils.Animator.updateAutos(this._gameTime.delta);

        // update managers
        for (let i = 0; i < _usedManagers.length; ++i) {
            _usedManagers[i].startFrame();
        }
        this._managersStarted = true;
    }

    /**
     * End frame (update all managers).
     */
    endFrame()
    {
        // update managers
        if (this._managersStarted) {
            for (let i = 0; i < _usedManagers.length; ++i) {
                _usedManagers[i].endFrame();
            }
            this._managersStarted = false;
        }

        // if paused, skip
        if (this.isPaused) { return; }

        // store previous gameTime object
        _prevUpdateTime = this._gameTime;

        // count fps and time stats
        if (this._gameTime) {
            this._updateFpsAndTimeStats();
        }
    }

    /**
     * Measure FPS and averege update times.
     * @private
     */
    _updateFpsAndTimeStats()
    {
        // update fps count and second counter
        _currFpsCounter++;
        _countSecond += this._gameTime.delta;

        // a second passed:
        if (_countSecond >= 1) {

            // reset second count and set current fps value
            _countSecond = 0;
            _currFps = _currFpsCounter;
            _currFpsCounter = 0;

            // trim the frames avg time, so we won't drag peaks for too long
            _totalFrameTimes = this.getAverageFrameTime();
            _frameTimeMeasuresCount = 1;
        }

        // get frame end time and update average frames time
        let _endFrameTime = GameTime.rawTimestamp();
        _frameTimeMeasuresCount++;
        _totalFrameTimes += (_endFrameTime - _startFrameTime);
    }

    /**
     * Make Shaku run in silent mode, without logs.
     * You can call this before init.
     */
    silent()
    {
        logger.silent();
    }

    /**
     * Set logger to throw an error every time a log message with severity higher than warning is written.
     * You can call this before init.
     * @param {Boolean} enable Set to true to throw error on warnings.
     */
    throwErrorOnWarnings(enable)
    {
        if (enable === undefined) { throw Error("Must provide a value!"); }
        logger.throwErrorOnWarnings(enable);
    }

    /**
     * Get current frame game time.
     * Only valid between startFrame() and endFrame().
     * @returns {GameTime} Current frame's gametime.
     */
    get gameTime()
    {
        return this._gameTime;
    }

    /**
     * Get Shaku's version.
     * @returns {String} Shaku's version.
     */
    get version() { return version; }

    /**
     * Return current FPS count.
     * Note: will return 0 until at least one second have passed.
     * @returns {Number} FPS count.
     */
    getFpsCount()
    {
        return _currFps;
    }

    /**
     * Get how long on average it takes to complete a game frame.
     * @returns {Number} Average time, in milliseconds, it takes to complete a game frame.
     */
    getAverageFrameTime()
    {
        if (_frameTimeMeasuresCount === 0) { return 0; }
        return _totalFrameTimes / _frameTimeMeasuresCount;
    }

    /**
     * Request animation frame with fallbacks.
     * @param {Function} callback Method to invoke in next animation frame.
     * @returns {Number} Handle for cancellation.
     */
    requestAnimationFrame(callback) 
    { 
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.msRequestAnimationFrame) return window.msRequestAnimationFrame(callback);
        else return setTimeout(callback, 1000/60);
    }
 
    /**
     * Cancel animation frame with fallbacks.
     * @param {Number} id Request handle.
     */
    cancelAnimationFrame(id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else clearTimeout(id);
    }

    /**
     * Set the logger writer class (will replace the default console output).
     * @param {*} loggerHandler New logger handler (must implement trace, debug, info, warn, error methods).
     */
    setLogger(loggerHandler)
    {
        logger.setDrivers(loggerHandler);
    }

    /**
     * Get / create a custom logger.
     */
    getLogger(name)
    {
        return logger.getLogger(name);
    }
};


// return the main Shaku object.
module.exports = new Shaku();
},{"./assets":5,"./collision":12,"./gfx":29,"./input":42,"./logger":45,"./manager":46,"./sfx":47,"./utils":56,"./utils/game_time":55}],52:[function(require,module,exports){
/**
 * Implement an animator helper class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\animator.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const _autoAnimators = [];


/**
 * Implement an animator object that change values over time using Linear Interpolation.
 * Usage example:
 * (new Animator(sprite)).from({'position.x': 0}).to({'position.x': 100}).duration(1).play();
 */
class Animator
{
    /**
     * Create the animator.
     * @param {*} target Any object you want to animate.
     */
    constructor(target)
    {
        this._target = target;
        this._fromValues = {};
        this._toValues = {};
        this._progress = 0;
        this._onFinish = null;
        this._smoothDamp = false;
        this._repeats = false;
        this._repeatsWithReverseAnimation = false;
        this._isInAutoUpdate = false;
        this._originalFrom = null;
        this._originalTo = null;
        this._originalRepeats = null;

        /**
         * Speed factor to multiply with delta every time this animator updates.
         */
        this.speedFactor = 1;
    }

    /**
     * Update this animator with a given delta time.
     * @param {Number} delta Delta time to progress this animator by.
     */
    update(delta)
    {
        // if already done, skip
        if (this._progress >= 1) {
            return;
        }

        // apply speed factor and update progress
        delta *= this.speedFactor;
        this._progress += delta;

        // did finish?
        if (this._progress >= 1) { 

            // make sure don't overflow
            this._progress = 1; 

            // trigger finish method
            if (this._onFinish) {
                this._onFinish();
            }
        }

        // update values
        for (let key in this._toValues) {

            // get key as parts and to-value
            let keyParts = this._toValues[key].keyParts;
            let toValue = this._toValues[key].value;

            // get from value
            let fromValue = this._fromValues[key];

            // if from not set, get default
            if (fromValue === undefined) {
                this._fromValues[key] = fromValue = this._getValueFromTarget(keyParts);
                if (fromValue === undefined) {
                    throw new Error(`Animator issue: missing origin value for key '${key}' and property not found in target object.`);
                }
            }

            // if to-value is a method, call it
            if (typeof toValue === 'function') {
                toValue = toValue();
            }
            
            // if from-value is a method, call it
            if (typeof fromValue === 'function') {
                fromValue = toValue();
            }

            // get lerp factor
            let a = (this._smoothDamp && this._progress < 1) ? (this._progress * (1 + 1 - this._progress)) : this._progress;

            // calculate new value
            let newValue = null;
            if (typeof fromValue === 'number') {
                newValue = lerp(fromValue, toValue, a);
            }
            else if (fromValue.constructor.lerp) {
                newValue = fromValue.constructor.lerp(fromValue, toValue, a);
            }
            else {
                throw new Error(`Animator issue: from-value for key '${key}' is not a number, and its class type don't implement a 'lerp()' method!`);
            }

            // set new value
            this._setValueToTarget(keyParts, newValue);
        }

        // if repeating, reset progress
        if (this._repeats && this._progress >= 1) {
            if (typeof this._repeats === 'number') { this._repeats--; }
            this._progress = 0;
            if (this._repeatsWithReverseAnimation ) {
                this.flipFromAndTo();
            }
        }
    }

    /**
     * Get value from target object.
     * @private
     * @param {Array<String>} keyParts Key parts broken by dots.
     */
    _getValueFromTarget(keyParts)
    {
        // easy case - get value when key parts is just one component
        if (keyParts.length === 1) {
            return this._target[keyParts[0]];
        }

        // get value for path with parts
        function index(obj,i) {return obj[i]}
        return keyParts.reduce(index, this._target);
    }

    /**
     * Set value in target object.
     * @private
     * @param {Array<String>} keyParts Key parts broken by dots.
     */
     _setValueToTarget(keyParts, value)
     {
        // easy case - set value when key parts is just one component
        if (keyParts.length === 1) {
            this._target[keyParts[0]] = value;
            return;
        }

        // set value for path with parts
        function index(obj,i) {return obj[i]}
        let parent = keyParts.slice(0, keyParts.length - 1).reduce(index, this._target);
        parent[keyParts[keyParts.length - 1]] = value;
     }

    /**
     * Make sure a given value is legal for the animator.
     * @private
     */
    _validateValueType(value)
    {
        return (typeof value === 'number') || (typeof value === 'function') || (value && value.constructor && value.constructor.lerp);
    }

    /**
     * Set a method to run when animation ends.
     * @param {Function} callback Callback to invoke when done.
     * @returns {Animator} this.
     */
    then(callback)
    {
        this._onFinish = callback;
        return this;
    }
    
    /**
     * Set smooth damp.
     * If true, lerping will go slower as the animation reach its ending.
     * @param {Boolean} enable set smooth damp mode.
     * @returns {Animator} this.
     */
    smoothDamp(enable)
    {
        this._smoothDamp = enable;
        return this;
    }
        
    /**
     * Set if the animator should repeat itself.
     * @param {Boolean|Number} enable false to disable repeating, true for endless repeats, or a number for limited number of repeats.
     * @param {Boolean} reverseAnimation if true, it will reverse animation to repeat it instead of just "jumping" back to starting state.
     * @returns {Animator} this.
     */
    repeats(enable, reverseAnimation)
    {
        this._originalRepeats = this._repeats = enable;
        this._repeatsWithReverseAnimation = Boolean(reverseAnimation);
        return this;
    }

    /**
     * Set 'from' values.
     * You don't have to provide 'from' values, when a value is not set the animator will just take whatever was set in target when first update is called.
     * @param {*} values Values to set as 'from' values. 
     * Key = property name in target (can contain dots for nested), value = value to start animation from.
     * @returns {Animator} this.
     */
    from(values)
    {
        for (let key in values) {
            if (!this._validateValueType(values[key])) {
                throw new Error("Illegal value type to use with Animator! All values must be either numbers, methods, or a class instance that has a static lerp() method.");
            }
            this._fromValues[key] = values[key];
        }
        this._originalFrom = null;
        return this;
    }

    /**
     * Set 'to' values, ie the result when animation ends.
     * @param {*} values Values to set as 'to' values. 
     * Key = property name in target (can contain dots for nested), value = value to start animation from.
     * @returns {Animator} this.
     */
    to(values)
    {
        for (let key in values) {
            if (!this._validateValueType(values[key])) {
                throw new Error("Illegal value type to use with Animator! All values must be either numbers, methods, or a class instance that has a static lerp() method.");
            }
            this._toValues[key] = {keyParts: key.split('.'), value: values[key]};
        }
        this._originalTo = null;
        return this;
    }

    /**
     * Flip between the 'from' and the 'to' states.
     */
    flipFromAndTo()
    {
        let newFrom = {};
        let newTo = {};

        if (!this._originalFrom) { this._originalFrom = this._fromValues; }
        if (!this._originalTo) { this._originalTo = this._toValues; }

        for (let key in this._toValues) {
            newFrom[key] = this._toValues[key].value;
            newTo[key] = {keyParts: key.split('.'), value: this._fromValues[key]};
        }

        this._fromValues = newFrom;
        this._toValues = newTo;
    }

    /**
     * Make this Animator update automatically with the gameTime delta time.
     * Note: this will change the speedFactor property.
     * @param {Number} seconds Animator duration time in seconds.
     * @returns {Animator} this.
     */
    duration(seconds)
    {
        this.speedFactor = 1 / seconds;
        return this;
    }

    /**
     * Reset animator progress.
     * @returns {Animator} this.
     */
    reset()
    {
        if (this._originalFrom) { this._fromValues = this._originalFrom; }
        if (this._originalTo) { this._toValues = this._originalTo; }
        if (this._originalRepeats !== null) { this._repeats = this._originalRepeats; }
        this._progress = 0;
        return this;
    }

    /**
     * Make this Animator update automatically with the gameTime delta time, until its done.
     * @returns {Animator} this.
     */
    play()
    {
        if (this._isInAutoUpdate) {
            return;
        }

        _autoAnimators.push(this);
        this._isInAutoUpdate = true;
        return this;
    }

    /**
     * Get if this animator finished.
     * @returns {Boolean} True if animator finished.
     */
    get ended()
    {
        return this._progress >= 1;
    }

    /**
     * Update all auto animators.
     * @private
     * @param {Number} delta Delta time in seconds.
     */
    static updateAutos(delta)
    {
        for (let i = _autoAnimators.length - 1; i >= 0; --i) {

            _autoAnimators[i].update(delta);

            if (_autoAnimators[i].ended) {
                _autoAnimators[i]._isInAutoUpdate = false;
                _autoAnimators.splice(i, 1);
            }

        }
    }
}


// a simple lerp method
function lerp(start, end, amt) {
    return (1-amt)*start + amt*end;
}


// export the animator class.
module.exports = Animator;
},{}],53:[function(require,module,exports){
/**
 * Implement a simple 2d circle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\circle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const MathHelper = require('./math_helper');
const Vector2 = require('./vector2');


/**
 * Implement a simple 2d Circle.
 */
class Circle
{
    /**
     * Create the Circle.
     * @param {Vector2} center Circle center position.
     * @param {Number} radius Circle radius.
     */
    constructor(center, radius)
    {
        this.center = center.clone();
        this.radius = radius;
    }

    /**
     * Return a clone of this circle.
     * @returns {Circle} Cloned circle.
     */
    clone()
    {
        return new Circle(this.center, this.radius);
    }

    /**
     * Check if this circle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @returns {Boolean} if point is contained within the circle.
     */
    containsVector(p) 
    {
        return this.center.distanceTo(p) <= this.radius;
    }

    /**
     * Check if equal to another circle.
     * @param {Circle} other Other circle to compare to.
     * @returns {Boolean} True if circles are equal, false otherwise.
     */
    equals(other)
    {
        return (other === this) || 
                (other && (other.constructor === this.constructor) && this.center.equals(other.center) && this.radius == other.radius);
    }

    /**
     * Create circle from a dictionary.
     * @param {*} data Dictionary with {center, radius}.
     * @returns {Circle} Newly created circle.
     */
    static fromDict(data)
    {
        return new Circle(Vector2.fromDict(data.center || {}), data.radius || 0);
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {center, radius}.
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.radius) { ret.radius = this.radius; }
            if (this.center.x || this.center.y) { ret.center = this.center.toDict(true); }
            return ret;
        }
        return {center: this.center.toDict(), radius: this.radius};
    }
     
    /**
     * Lerp between two circle.
     * @param {Circle} p1 First circle.
     * @param {Circle} p2 Second circle.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Circle} result circle.
     */
    static lerp(p1, p2, a)
    {
        let lerpScalar = MathHelper.lerp;
        return new Circle(Vector2.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
    }
}


// export the circle class
module.exports = Circle;
},{"./math_helper":58,"./vector2":67}],54:[function(require,module,exports){
/**
 * Define a color object.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\color.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const MathHelper = require("./math_helper");


/**
 * Implement a color.
 * All color components are expected to be in 0.0 - 1.0 range (and not 0-255).
 */
class Color
{
    /**
     * Create the color.
     * @param {Number} r Color red component (value range: 0-1).
     * @param {Number} g Color green component (value range: 0-1).
     * @param {Number} b Color blue component (value range: 0-1).
     * @param {Number=} a Color alpha component (value range: 0-1).
     */
    constructor(r, g, b, a)
    {
        this.set(r, g, b, a);
    }

    /**
     * Set the color components.
     * @param {Number} r Color red component (value range: 0-1).
     * @param {Number} g Color green component (value range: 0-1).
     * @param {Number} b Color blue component (value range: 0-1).
     * @param {Number} a Color alpha component (value range: 0-1).
     * @returns {Color} this.
     */
    set(r, g, b, a)
    {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = (a === undefined) ? 1 : a;
        this._asHex = null;
        return this;
    }

    /**
     * Set the color components from byte values (0-255).
     * @param {Number} r Color red component (value range: 0-255).
     * @param {Number} g Color green component (value range: 0-255).
     * @param {Number} b Color blue component (value range: 0-255).
     * @param {Number} a Color alpha component (value range: 0-255).
     * @returns {Color} this.
     */
    setByte(r, g, b, a)
    {
        this._r = r / 255.0;
        this._g = g / 255.0;
        this._b = b / 255.0;
        this._a = (a === undefined) ? 1 : (a / 255.0);
        this._asHex = null;
        return this;
    }

    /**
     * Copy all component values from another color.
     * @param {Color} other Color to copy values from.
     * @returns {Color} this.
     */
    copy(other)
    {
        this.set(other.r, other.g, other.b, other.a);
        return this;
    }

    /**
     * Get r component.
     * @returns {Number} Red component.
     */
    get r()
    {
        return this._r;
    }

    /**
     * Get g component.
     * @returns {Number} Green component.
     */
    get g()
    {
        return this._g;
    }

    /**
     * Get b component.
     * @returns {Number} Blue component.
     */
    get b()
    {
        return this._b;
    }
    
    /**
     * Get a component.
     * @returns {Number} Alpha component.
     */
    get a()
    {
        return this._a;
    }

    /**
     * Set r component.
     * @returns {Number} Red component after change.
     */
    set r(val)
    {
        this._r = val;
        this._asHex = null;
        return this._r;
    }

    /**
     * Set g component.
     * @returns {Number} Green component after change.
     */
    set g(val)
    {
        this._g = val;
        this._asHex = null;
        return this._g;
    }

    /**
     * Set b component.
     * @returns {Number} Blue component after change.
     */
    set b(val)
    {
        this._b = val;
        this._asHex = null;
        return this._b;
    }
    
    /**
     * Set a component.
     * @returns {Number} Alpha component after change.
     */
    set a(val)
    {
        this._a = val;
        this._asHex = null;
        return this._a;
    }

    /**
     * Convert a single component to hex value.
     * @param {Number} c Value to convert to hex.
     * @returns {String} Component as hex value.
     */
    static componentToHex(c) 
    {
        var hex = Math.round(c).toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
     
    /**
     * Convert this color to hex string (starting with '#').
     * @returns {String} Color as hex.
     */
    get asHex() 
    {
        if (!this._asHex) {
            this._asHex = "#" + Color.componentToHex(this.r * 255) + Color.componentToHex(this.g * 255) + Color.componentToHex(this.b * 255) + Color.componentToHex(this.a * 255);
        }
        return this._asHex;
    }

    /**
     * Create color from hex value.
     * @param {String} val Number value (hex), as #rrggbbaa.
     * @returns {Color} New color value.
     */
    static fromHex(val)
    {
        if (typeof val !== 'string' && val[0] != '#') {
            throw new PintarJS.Error("Invalid color format!");
        }
        var parsed = hexToColor(val);
        if (!parsed) { throw new Error("Invalid hex value to parse!"); }
        return new Color(parsed.r, parsed.g, parsed.b, 1);
    }

    /**
     * Create color from decimal value.
     * @param {Number} val Number value (int).
     * @param {Number} includeAlpha If true, will include alpha value.
     * @returns {Color} New color value.
     */
    static fromDecimal(val, includeAlpha)
    {
        let ret = new Color(1, 1, 1, 1);
        if (includeAlpha) { ret.a = (val & 0xff) / 255.0; val = val >> 8; }
        ret.b = (val & 0xff) / 255.0; val = val >> 8;
        ret.g = (val & 0xff) / 255.0; val = val >> 8;
        ret.r = (val & 0xff) / 255.0;
    }

    /**
     * Create color from a dictionary.
     * @param {*} data Dictionary with {r,g,b,a}.
     * @returns {Color} Newly created color.
     */
    static fromDict(data)
    {
        return new Color(
            (data.r !== undefined) ? data.r : 1, 
            (data.g !== undefined) ? data.g : 1, 
            (data.b !== undefined) ? data.b : 1, 
            (data.a !== undefined) ? data.a : 1
        );
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 1. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {r,g,b,a}
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.r !== 1) { ret.r = this.r; }
            if (this.g !== 1) { ret.g = this.g; }
            if (this.b !== 1) { ret.b = this.b; }
            if (this.a !== 1) { ret.a = this.a; }
            return ret;
        }
        return {r: this.r, g: this.g, b: this.b, a: this.a};
    }

    /**
     * Convert this color to decimal number.
     * @returns {Number} Color as decimal RGBA.
     */
    get asDecimalRGBA()
    {
      return ((Math.round(this.r * 255) << (8 * 3)) | (Math.round(this.g * 255) << (8 * 2)) | (Math.round(this.b * 255) << (8 * 1)) | (Math.round(this.a * 255)))>>>0;
    }

    /**
     * Convert this color to decimal number.
     * @returns {Number} Color as decimal ARGB.
     */
    get asDecimalABGR()
    {
      return ((Math.round(this.a * 255) << (8 * 3)) | (Math.round(this.b * 255) << (8 * 2)) | (Math.round(this.g * 255) << (8 * 1)) | (Math.round(this.r * 255)))>>>0;
    }

    /**
     * Convert this color to a float array.
     */
    get floatArray()
    {
        return [this.r, this.g, this.b, this.a];
    }

    /**
     * Return a clone of this color.
     * @returns {Number} Cloned color.
     */
    clone()
    {
        return new Color(this.r, this.g, this.b, this.a);
    }

    /**
     * Convert to string.
     */
    string() 
    {
        return this.r + ',' + this.g + ',' + this.b + ',' + this.a;
    }

    /**
     * Get if this color is pure black (ignoring alpha).
     */
    get isBlack()
    {
        return this.r == 0 && this.g == 0 && this.b == 0;
    }

    /**
     * Return a random color.
     * @param {Boolean} includeAlpha If true, will also randomize alpha.
     * @returns {Color} Randomized color.
     */
    static random(includeAlpha)
    {
        return new Color(Math.random(), Math.random(), Math.random(), includeAlpha ? Math.random() : 1);
    }

    /**
     * Build and return new color from bytes array.
     * @param {Array<Number>} bytes Bytes array to build color from.
     * @returns {Color} Newly created color.
     */
    static fromBytesArray(bytes)
    {
        return new Color(bytes[0] / 255, bytes[1] / 255, bytes[2] / 255, bytes[3] !== undefined ? (bytes[3] / 255) : 1);
    }

    /**
     * Get if this color is transparent black.
     */
    get isTransparentBlack()
    {
        return this._r == this._g && this._g == this._b && this._b == this._a && this._a == 0;
    }

    /**
     * Get array with all built-in web color names.
     * @returns {Array<String>} Array with color names.
     */
    static get webColorNames()
    {
        return colorKeys;
    }

    /**
     * Check if equal to another color.
     * @param {Color} other Other color to compare to.
     */
    equals(other)
    {
        return (this === other) ||
                (other && (other.constructor === this.constructor) && this._r == other._r && this._g == other._g && this._b == other._b && this._a == other._a);
    }

    /**
     * Lerp between two colors.
     * @param {Color} p1 First color.
     * @param {Color} p2 Second color.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Color} result color.
     */
    static lerp(p1, p2, a)
    {
        let lerpScalar = MathHelper.lerp;
        return new Color(  lerpScalar(p1.r, p2.r, a), 
                        lerpScalar(p1.g, p2.g, a), 
                        lerpScalar(p1.b, p2.b, a), 
                        lerpScalar(p1.a, p2.a, a)
                    );
    }
}

// table to convert common color names to hex
const colorNameToHex = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

// create getter function for all named color
for (var key in colorNameToHex) {
    if (colorNameToHex.hasOwnProperty(key)) {
        var colorValue = hexToColor(colorNameToHex[key]);
        (function(_colValue) {

            Object.defineProperty (Color, key, {
                get: function () { 
                    return _colValue.clone();
                }
            });

        })(colorValue);
    }
}

// built-in color keys
const colorKeys = Object.keys(colorNameToHex);
Object.freeze(colorKeys);

// add transparent getter
Object.defineProperty (Color, 'transparent', {
    get: function () { 
        return new Color(0, 0, 0, 0);
    }
});

// add transparent white getter
Object.defineProperty (Color, 'transwhite', {
    get: function () { 
        return new Color(1, 1, 1, 0);
    }
});


/**
 * Convert Hex value to Color instance.
 * @param {String} hex Hex value to parse.
 */
function hexToColor(hex) 
{
    // expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var components = result ? {
        r: parseInt(result[1], 16) / 255.0,
        g: parseInt(result[2], 16) / 255.0,
        b: parseInt(result[3], 16) / 255.0
    } : null;

    // create Color instance
    if (!components) { throw new Error("Invalid hex value to parse!"); }
    return new Color(components.r, components.g, components.b, 1);
}


// export Color object
module.exports = Color;
},{"./math_helper":58}],55:[function(require,module,exports){
/**
 * A utility to hold gametime.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\game_time.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

 
/**
 * Class to hold current game time (elapse and deltatime).
 */
class GameTime
{
    /**
     * create the gametime object with current time.
     */
    constructor()
    {
        /**
         * Current timestamp
         */
        this.timestamp = _currElapsed;

        /**
         * Delta time struct.
         * Contains: milliseconds, seconds.
         */
        this.deltaTime = {
            milliseconds: _currDelta,
            seconds: _currDelta / 1000.0,
        };

        /**
         * Elapsed time struct.
         * Contains: milliseconds, seconds.
         */
        this.elapsedTime = {
            milliseconds: _currElapsed,
            seconds: _currElapsed / 1000.0
        };

        /**
         * Delta time, in seconds, since last frame.
         */
        this.delta = this.deltaTime ? this.deltaTime.seconds : null;

        /**
         * Total time, in seconds, since Shaku was initialized.
         */
        this.elapsed = this.elapsedTime.seconds;

        // freeze object
        Object.freeze(this);
    }

    /**
     * Update game time.
     */
    static update()
    {
        // get current time
        let curr = getAccurateTimestampMs();

        // calculate delta time
        let delta = 0;
        if (_prevTime) {
            delta = curr - _prevTime;
        }

        // update previous time
        _prevTime = curr;

        // update delta and elapsed
        _currDelta = delta;
        _currElapsed += delta;
    }

    /**
     * Get raw timestamp in milliseconds.
     * @returns {Number} raw timestamp in milliseconds.
     */
    static rawTimestamp()
    {
        return getAccurateTimestampMs();
    }

    /**
     * Reset elapsed and delta time.
     */
    static reset()
    {
        _prevTime = null;
        _currDelta = 0;
        _currElapsed = 0;
    }

    /**
     * Reset current frame's delta time.
     */ 
    static resetDelta()
    {
        _prevTime = null;
        _currDelta = 0;
    }
}

// do we have the performance.now method?
const gotPerformance = (typeof performance !== 'undefined') && performance.now;

// get most accurate timestamp in milliseconds.
function getAccurateTimestampMs() {
    if (gotPerformance) {
        return performance.now();
    }
    return Date.now();
}

// previous time (to calculate delta).
var _prevTime = null;

// current delta and elapsed
var _currDelta = 0;
var _currElapsed = 0;

// export the GameTime class.
module.exports = GameTime;
},{}],56:[function(require,module,exports){
/**
 * Include all util classes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\index.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

 module.exports = {
    Vector2: require('./vector2'),
    Vector3: require('./vector3'),
    Rectangle: require('./rectangle'),
    Circle: require('./circle'),
    Line: require('./line'),
    Color: require('./color'),
    Animator: require('./animator'),
    GameTime: require('./game_time'),
    MathHelper: require('./math_helper'),
    SeededRandom: require('./seeded_random'),
    Perlin: require('./perlin'),
    Storage: require('./storage'),
    StorageAdapter: require('./storage_adapter'),
    PathFinder: require('./path_finder'),
    Transformation: require('./transformation'),
    TransformationModes: require('./transform_modes')
 };
},{"./animator":52,"./circle":53,"./color":54,"./game_time":55,"./line":57,"./math_helper":58,"./path_finder":59,"./perlin":60,"./rectangle":61,"./seeded_random":62,"./storage":63,"./storage_adapter":64,"./transform_modes":65,"./transformation":66,"./vector2":67,"./vector3":68}],57:[function(require,module,exports){
/**
 * Implement a simple 2d line.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\line.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';
const Vector2 = require('./vector2');


/**
 * Implement a simple 2d Line.
 */
class Line
{
    /**
     * Create the Line.
     * @param {Vector2} from Line start position.
     * @param {Vector2} to Line end position.
     */
    constructor(from, to)
    {
        this.from = from.clone();
        this.to = to.clone();
    }

    /**
     * Return a clone of this line.
     * @returns {Line} Cloned line.
     */
    clone()
    {
        return new Line(this.from, this.to);
    }

    /**
     * Create Line from a dictionary.
     * @param {*} data Dictionary with {from, to}.
     * @returns {Line} Newly created line.
     */
    static fromDict(data)
    {
        return new Line(Vector2.fromDict(data.from || {}), Vector2.fromDict(data.to || {}));
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {from, to}.
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.from.x || this.from.y) { ret.from = this.from.toDict(true); }
            if (this.to.x || this.to.y) { ret.to = this.to.toDict(true); }
            return ret;
        }
        return {from: this.from.toDict(), to: this.to.toDict()};
    }

    /**
     * Check if this circle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @param {Number} threshold Distance between point and line to consider as intersecting. Default is 0.5, meaning it will treat point and line as round integers (sort-of).
     * @returns {Boolean} if point is contained within the circle.
     */
    containsVector(p, threshold)
    {
        let A = this.from;
        let B = this.to;
        let distance = Vector2.distance;
        if (threshold === undefined) { threshold = 0.5; }
        return Math.abs((distance(A, p) + distance(B, p)) - distance(A, B)) <= threshold;
    }

    /**
     * Check if this line collides with another line.
     * @param {Line} other Other line to test collision with.
     * @returns {Boolean} True if lines collide, false otherwise.
     */
    collideLine(other)
    {
        let p0 = this.from;
        let p1 = this.to;
        let p2 = other.from;
        let p3 = other.to;

        if (p0.equals(p2) || p0.equals(p3) || p1.equals(p2) || p1.equals(p3)) {
            return true;
        }

        let s1_x, s1_y, s2_x, s2_y;
        s1_x = p1.x - p0.x;
        s1_y = p1.y - p0.y;
        s2_x = p3.x - p2.x;
        s2_y = p3.y - p2.y;
    
        let s, t;
        s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
        t = (s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);
    
        return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
    }

    /**
     * Get the shortest distance between this line segment and a vector.
     * @param {Vector2} v Vector to get distance to.
     * @returns {Number} Shortest distance between line and vector.
     */
    distanceToVector(v)
    {
        let x1 = this.from.x;
        let x2 = this.to.x;
        let y1 = this.from.y;
        let y2 = this.to.y;

        var A = v.x - x1;
        var B = v.y - y1;
        var C = x2 - x1;
        var D = y2 - y1;
      
        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = -1;
        if (len_sq != 0) //in case of 0 length line
            param = dot / len_sq;
      
        var xx, yy;
      
        if (param < 0) {
          xx = x1;
          yy = y1;
        }
        else if (param > 1) {
          xx = x2;
          yy = y2;
        }
        else {
          xx = x1 + param * C;
          yy = y1 + param * D;
        }
      
        var dx = v.x - xx;
        var dy = v.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if equal to another circle.
     * @param {Circle} other Other circle to compare to.
     * @returns {Boolean} True if circles are equal, false otherwise.
     */
    equals(other)
    {
        return (this === other) || 
                (other && (other.constructor === this.constructor) && this.from.equals(other.from) && this.to.equals(other.to));
    }

    /**
     * Lerp between two lines.
     * @param {Line} l1 First lines.
     * @param {Line} l2 Second lines.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Line} result lines.
     */
    static lerp(l1, l2, a)
    {
        return new Line(Vector2.lerp(l1.from, l2.from, a), Vector2.lerp(l1.to, l2.to, a));
    }
}


// export the line class
module.exports = Line;
},{"./vector2":67}],58:[function(require,module,exports){
/**
 * Implement a math utilities class.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\math_helper.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

// for radians / degrees conversion
const _toRadsFactor = (Math.PI / 180);
const _toDegreesFactor = (180 / Math.PI);


/**
 * Implement some math utilities functions.
 */
class MathHelper
{
    /**
     * Perform linear interpolation between start and end values.
     * @param {Number} start Starting value.
     * @param {Number} end Ending value.
     * @param {Number} amount How much to interpolate from start to end.
     * @returns {Number} interpolated value between start and end.
     */
    static lerp(start, end, amount)
    {
        // to prevent shaking on same values
        if (start === end) { return end; }

        // do lerping
        return ((1-amount) * start) + (amount * end);
    }

    /**
     * Calculate 2d dot product.
     * @param {Number} x1 First vector x.
     * @param {Number} y1 First vector y.
     * @param {Number} x2 Second vector x.
     * @param {Number} y2 Second vector y.
     * @returns {Number} dot product result.
     */
    static dot(x1, y1, x2, y2) 
    {
        return x1 * x2 + y1 * y2;
    }

    /**
     * Convert degrees to radians.
     * @param {Number} degrees Degrees value to convert to radians.
     * @returns {Number} Value as radians.
     */
    static toRadians(degrees) 
    {
        return degrees * _toRadsFactor;
    }

    /**
     * Convert radians to degrees.
     * @param {Number} radians Radians value to convert to degrees.
     * @returns {Number} Value as degrees.
     */
    static toDegrees(radians) 
    {
        return radians * _toDegreesFactor;
    }

    /**
    * Find shortest distance between two radians, with sign (ie distance can be negative).
    * @param {Number} a1 First radian.
    * @param {Number} a2 Second radian.
    * @returns {Number} Shortest distance between radians.
    */
    static radiansDistanceSigned(a1, a2)
    {
        var max = Math.PI * 2;
        var da = (a2 - a1) % max;
        return 2 * da % max - da;
    }

    /**
    * Find shortest distance between two radians.
    * @param {Number} a1 First radian.
    * @param {Number} a2 Second radian.
    * @returns {Number} Shortest distance between radians.
    */
    static radiansDistance(a1, a2)
    {
        return Math.abs(this.radiansDistanceSigned(a1, a2));
    }


    /**
    * Find shortest distance between two angles in degrees, with sign (ie distance can be negative).
    * @param {Number} a1 First angle.
    * @param {Number} a2 Second angle.
    * @returns {Number} Shortest distance between angles.
    */
    static degreesDistanceSigned(a1, a2)
    {
        let a1r = a1 * _toRadsFactor;
        let a2r = a2 * _toRadsFactor;
        let ret = this.radiansDistanceSigned(a1r, a2r);
        return ret * _toDegreesFactor;
    }

    /**
    * Find shortest distance between two angles in degrees.
    * @param {Number} a1 First angle.
    * @param {Number} a2 Second angle.
    * @returns {Number} Shortest distance between angles.
    */
    static degreesDistance(a1, a2)
    {
        let a1r = a1 * _toRadsFactor;
        let a2r = a2 * _toRadsFactor;
        let ret = this.radiansDistance(a1r, a2r);
        return ret * _toDegreesFactor;
    }

    /**
     * Perform linear interpolation between radian values.
     * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
     * @param {Number} a1 Starting value.
     * @param {Number} a2 Ending value.
     * @param {Number} alpha How much to interpolate from start to end.
     * @returns {Number} interpolated radians between start and end.
     */
    static lerpRadians(a1, a2, alpha)
    {
        // to prevent shaking on same values
        if (a1 === a2) { return a2; }

        // do lerping
        return a1 + this.radiansDistanceSigned(a1, a2) * alpha;
    }

    /**
     * Perform linear interpolation between degrees.
     * Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.
     * @param {Number} a1 Starting value.
     * @param {Number} a2 Ending value.
     * @param {Number} alpha How much to interpolate from start to end.
     * @returns {Number} interpolated degrees between start and end.
     */
    static lerpDegrees(a1, a2, alpha)
    {
        // to prevent shaking on same values
        if (a1 === a2) { return a2; }

        // convert to radians
        a1 = this.toRadians(a1);
        a2 = this.toRadians(a2);

        // lerp
        var ret = this.lerpRadians(a1, a2, alpha);

        // convert back to degrees and return
        return this.toDegrees(ret);
    }

    /**
    * Round numbers from 10'th digit.
    * This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.
    * @param {Number} num Number to round.
    * @returns {Number} Rounded number.
    */
    static round10(num)
    {
        return Math.round(num * 100000000.0) / 100000000.0;
    }

    /**
     * Wrap degrees value to be between 0 to 360.
     * @param {Number} degrees Degrees to wrap.
     * @returns {Number} degrees wrapped to be 0-360 values.
     */
    static wrapDegrees(degrees)
    {
        degrees = degrees % 360;
        if (degrees < 0) { degrees += 360; }
        return degrees;
    }
}

/**
 * PI * 2 value.
 */
MathHelper.PI2 = Math.PI * 2;


// export the math helper
module.exports = MathHelper;
},{}],59:[function(require,module,exports){
/**
 * Provide a pathfinding algorithm.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\path_finder.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
*/
'use strict';
const Vector2 = require("./vector2");


/**
 * Interface for a supported grid.
 */
class IGrid
{
    /**
     * Check if a given tile is blocked from a given neihbor.
     * @param {Vector2|Vector3} _from Source tile index.
     * @param {Vector2|Vector3} _to Target tile index. Must be a neighbor of _from.
     * @returns {Boolean} Can we travel from _from to _to?
     */
    isBlocked(_from, _to) { throw new Error("Not Implemented"); }

    /**
     * Get the price to travel on a given tile.
     * Should return 1 for "normal" traveling price, > 1 for expensive tile, and < 1 for a cheap tile to pass on.
     * @param {Vector2|Vector3} _index Tile index.
     * @returns {Number} Price factor to walk on.
     */
    getPrice(_index) { throw new Error("Not Implemented"); }
}


/**
 * A path node.
 */
class Node
{
    constructor(position)
    {
        this.position = position;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
        this.price = 1;
    }

    get fCost()
    {
        return this.gCost + this.hCost;
    }
}


/**
 * Find a path between start to target.
 * @param {IGrid} grid Grid provider to check if tiles are blocked.
 * @param {Vector2|Vector3} startPos Starting tile index.
 * @param {Vector2|Vector3} targetPos Target tile index.
 * @param {*} options Additional options: { maxIterations, ignorePrices, allowDiagonal }
 * @returns {Array<Vector2>} List of tiles to traverse.
 */
function findPath(grid, startPos, targetPos, options)
{
    let ret = _ImpFindPath(grid, startPos, targetPos, options || {});
    return ret;
}


/**
 * Internal function that implements the path-finding algorithm.
 * @private
 */
function _ImpFindPath(grid, startPos, targetPos, options)
{
    // do we allow diagonal tiles?
    const allowDiagonal = options.allowDiagonal;

    // get / create node
    let nodesCache = {};
    function getOrCreateNode(position) {

        // get from cache
        let key = (position.x + ',' + position.y);
        if (nodesCache[key]) {
            return nodesCache[key];
        }

        // create new
        let ret = new Node(position);
        nodesCache[key] = ret;
        return ret;
    }
    
    // create start and target node
    let startNode = getOrCreateNode(startPos);
    let targetNode = getOrCreateNode(targetPos);

    // tiles we may still travel to
    let openSet = [];
    openSet.push(startNode);

    // tiles we were blocked at
    let closedSet = new Set();

    // remove from array by value
    function removeFromArray(arr, val) {
        let index = arr.indexOf(val);
        if (index !== -1) {
            arr.splice(index, 1);
        }
    }

    // while we got open way to go...
    let iterationsCount = -1;
    while (openSet.length > 0)
    {
        // check iterations count
        if (options.maxIterations) {
            if (iterationsCount++ > options.maxIterations) {
                break;
            }
        }

        // find optimal node to start from
        let currentNode = openSet[0];
        for (let i = 1; i < openSet.length; i++)
        {
            if ((openSet[i].fCost <= currentNode.fCost) && (openSet[i].hCost < currentNode.hCost))
            {
                currentNode = openSet[i];
            }
        }

        // add current node to close set
        removeFromArray(openSet, currentNode);
        closedSet.add(currentNode);

        // did we reach target? :D
        if (currentNode == targetNode)
        {
            let finalPath = retracePath(startNode, targetNode);
            return finalPath;
        }

        // get neighbor tiles
        let neighbors = [];
        for (let nx = -1; nx <= 1; nx++)
        {
            for (let ny = -1; ny <= 1; ny++)
            {
                if (nx === 0 && ny === 0) { continue; }
                if (!allowDiagonal && (nx !== 0 && ny !== 0)) { continue; }
                neighbors.push(getOrCreateNode({x: currentNode.position.x + nx, y: currentNode.position.y + ny, z: currentNode.position.z}));
            }
        }

        // iterate neighbors
        for (let neighbor of neighbors)
        {
            // skip if already passed or can't walk there
            if (closedSet.has(neighbor) || grid.isBlocked(currentNode.position, neighbor.position)) {
                continue;
            }

            // calc const and price to walk there
            let price = (options.ignorePrices) ? 1 : grid.getPrice(neighbor.position);
            let currStepCost = currentNode.gCost + getDistance(currentNode, neighbor) * price;

            // update node price and add to open set
            let isInOpenSet = (openSet.indexOf(neighbor) !== -1);
            if (!isInOpenSet || (currStepCost < neighbor.gCost))
            {
                // update node price and parent
                neighbor.gCost = currStepCost;
                neighbor.hCost = getDistance(neighbor, targetNode);
                neighbor.parent = currentNode;

                // add to open set
                if (!isInOpenSet) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    // didn't find path
    return null;
}

/**
 * Convert nodes structure with parents into a list of tile indices.
 * Go from end to start (for shortest path) and build list reversed.
 * @private
 */
function retracePath(startNode, endNode)
{
    let path = [];
    let currentNode = endNode;

    while (currentNode !== startNode)
    {
        path.unshift(currentNode.position);
        currentNode = currentNode.parent;
    }

    return path;
}

/**
 * Get distance between two points on grid.
 * This method is quick and dirty and takes diagonal into consideration.
 */
function getDistance(pa, pb)
{
    let dx = (pa.position.x - pb.position.x);
    let dy = (pa.position.y - pb.position.y);
    return Math.sqrt(dx*dx + dy*dy);
}


// export main method and grid interface.
const PathFinder = {
    findPath: findPath,
    IGrid: IGrid
};
module.exports = PathFinder;
},{"./vector2":67}],60:[function(require,module,exports){
/**
 * Implements 2d perlin noise generator.
 * Based on code from noisejs by Stefan Gustavson.
 * https://github.com/josephg/noisejs/blob/master/perlin.js
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\perlin.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

// import some utilities
const MathHelper = require("./math_helper");
const lerp = MathHelper.lerp;

// do fade
function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
}

// store gradient value
function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
}
Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
};

// const premutations
const p = [151,160,137,91,90,15,
131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];


/**
 * Generate 2d perlin noise.
 * Based on code from noisejs by Stefan Gustavson.
 * https://github.com/josephg/noisejs/blob/master/perlin.js
 */
class Perlin
{
    /**
     * Create the perlin noise generator.
     * @param {Number} seed Seed for perlin noise, or undefined for random.
     */
    constructor(seed)
    {
        if (seed === undefined) { seed = Math.random(); }
        this.seed(seed);
    }

    /**
     * Set the perlin noise seed.
     * @param {Number} seed New seed value. May be either a decimal between 0 to 1, or an unsigned short between 0 to 65536.
     */
    seed(seed)
    {
        // scale the seed out
        if(seed > 0 && seed < 1) {
            seed *= 65536;
        }
    
        // make sure round and current number of bits
        seed = Math.floor(seed);
        if (seed < 256) {
            seed |= seed << 8;
        }

        // create perm, gradP and grad3 arrays
        var perm = new Array(512);
        var gradP = new Array(512);
        var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
            new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
            new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];
    
        // apply seed
        for(var i = 0; i < 256; i++) 
        {
            var v;
            if (i & 1) {
                v = p[i] ^ (seed & 255);
            } else {
                v = p[i] ^ ((seed>>8) & 255);
            }
    
            perm[i] = perm[i + 256] = v;
            gradP[i] = gradP[i + 256] = grad3[v % 12];
        }

        // store new params
        this._perm = perm;
        this._gradP = gradP;
    }

    /**
     * Generate a perlin noise value for x,y coordinates.
     * @param {Number} x X coordinate to generate perlin noise for.
     * @param {Number} y Y coordinate to generate perlin noise for. 
     * @param {Number} blurDistance Distance to take neighbors to blur returned value with. Defaults to 0.25.
     * @param {Number} contrast Optional contrast factor.
     * @returns {Number} Perlin noise value for given point.
     */
    generateSmooth(x, y, blurDistance, contrast) 
    {
        if (blurDistance === undefined) { 
            blurDistance = 0.25;
        }
        let a = this.generate(x-blurDistance, y-blurDistance, contrast);
        let b = this.generate(x+blurDistance, y+blurDistance, contrast);
        let c = this.generate(x-blurDistance, y+blurDistance, contrast);
        let d = this.generate(x+blurDistance, y-blurDistance, contrast);
        return (a + b + c + d) / 4;
    }

    /**
     * Generate a perlin noise value for x,y coordinates.
     * @param {Number} x X coordinate to generate perlin noise for.
     * @param {Number} y Y coordinate to generate perlin noise for. 
     * @param {Number} contrast Optional contrast factor.
     * @returns {Number} Perlin noise value for given point, ranged from 0 to 1.
     */
    generate(x, y, contrast) 
    {
        // default contrast
        if (contrast === undefined) {
            contrast = 1;
        }

        // store new params
        let perm = this._perm;
        let gradP = this._gradP;

        // find unit grid cell containing point
        var X = Math.floor(x), Y = Math.floor(y);

        // get relative xy coordinates of point within that cell
        x = x - X; y = y - Y;

        // wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255; Y = Y & 255;
    
        // calculate noise contributions from each of the four corners
        var n00 = gradP[X+perm[Y]].dot2(x, y) * contrast;
        var n01 = gradP[X+perm[Y+1]].dot2(x, y-1) * contrast;
        var n10 = gradP[X+1+perm[Y]].dot2(x-1, y) * contrast;
        var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1) * contrast;
    
        // compute the fade curve value for x
        var u = fade(x);
    
        // interpolate the four results
        return Math.min(lerp(
            lerp(n00, n10, u),
            lerp(n01, n11, u),
            fade(y)) + 0.5, 1);
    };
}

// export the perlin generator
module.exports = Perlin;
},{"./math_helper":58}],61:[function(require,module,exports){
/**
 * Implement a simple 2d rectangle.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\rectangle.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
 'use strict';

const Circle = require('./circle');
const Line = require('./line');
const MathHelper = require('./math_helper');
const Vector2 = require('./vector2');


/**
 * Implement a simple 2d Rectangle.
 */
class Rectangle
{
    /**
     * Create the Rect.
     * @param {Number} x Rect position X (top left corner).
     * @param {Number} y Rect position Y (top left corner).
     * @param {Number} width Rect width.
     * @param {Number} height Rect height.
     */
    constructor(x, y, width, height)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width;
        this.height = height;
    }

    /**
     * Set rectangle values.
     * @param {Number} x Rectangle x position.
     * @param {Number} y Rectangle y position.
     * @param {Number} width Rectangle width.
     * @param {Number} height Rectangle height.
     * @returns {Rectangle} this.
     */
    set(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    }

    /**
     * Copy another rectangle.
     * @param {other} other Rectangle to copy.
     * @returns {Rectangle} this.
     */
    copy(other)
    {
        this.x = other.x;
        this.y = other.y;
        this.width = other.width;
        this.height = other.height;
        return this;
    }

    /**
     * Get position as Vector2.
     * @returns {Vector2} Position vector.
     */
    getPosition()
    {
        return new Vector2(this.x, this.y);
    }
    
    /**
     * Get size as Vector2.
     * @returns {Vector2} Size vector.
     */
    getSize()
    {
        return new Vector2(this.width, this.height);
    }
	
	/**
     * Get center position.
     * @returns {Vector2} Position vector.
     */
    getCenter()
    {
        return new Vector2(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
    }

    /**
     * Get left value.
     * @returns {Number} rectangle left.
     */
    get left()
    {
        return this.x;
    }

    /**
     * Get right value.
     * @returns {Number} rectangle right.
     */
    get right()
    {
        return this.x + this.width;
    }

    /**
     * Get top value.
     * @returns {Number} rectangle top.
     */
    get top()
    {
        return this.y;
    }

    /**
     * Get bottom value.
     * @returns {Number} rectangle bottom.
     */
    get bottom()
    {
        return this.y + this.height;
    }

    /**
     * Return a clone of this rectangle.
     * @returns {Rectangle} Cloned rectangle.
     */
    clone()
    {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * Get top-left corner.
     * @returns {Vector2} Corner position vector.
     */
    getTopLeft()
    {
        return new Vector2(this.x, this.y);
    }

    /**
     * Get top-right corner.
     * @returns {Vector2} Corner position vector.
     */
    getTopRight()
    {
        return new Vector2(this.x + this.width, this.y);
    }
        
    /**
     * Get bottom-left corner.
     * @returns {Vector2} Corner position vector.
     */
    getBottomLeft()
    {
        return new Vector2(this.x, this.y + this.height);
    }

    /**
     * Get bottom-right corner.
     * @returns {Vector2} Corner position vector.
     */
    getBottomRight()
    {
        return new Vector2(this.x + this.width, this.y + this.height);
    }

    /**
     * Convert to string.
     */
    string() 
    {
        return this.x + ',' + this.y + ',' + this.width + ',' + this.height;
    }

    /**
     * Check if this rectangle contains a Vector2.
     * @param {Vector2} p Point to check.
     * @returns {Boolean} if point is contained within the rectangle.
     */
    containsVector(p) 
    {
        return p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height;
    }

    /**
     * Check if this rectangle collides with another rectangle.
     * @param {Rectangle} other Rectangle to check collision with.
     * @return {Boolean} if rectangles collide.
     */
    collideRect(other)
    {
        let r1 = this;
        let r2 = other;
        return !(r2.left >= r1.right ||
                r2.right <= r1.left ||
                r2.top >= r1.bottom ||
                r2.bottom <= r1.top);
    }
  
    /**
     * Check if this rectangle collides with a line.
     * @param {Line} line Line to check collision with.
     * @return {Boolean} if rectangle collides with line.
     */
    collideLine(line)
    {
        // first check if rectangle contains any of the line points
        if (this.containsVector(line.from) || this.containsVector(line.to)) {
            return true;
        }

        // now check intersection with the rectangle lines
        let topLeft = this.getTopLeft();
        let topRight = this.getTopRight();
        let bottomLeft = this.getBottomLeft();
        let bottomRight = this.getBottomRight();
        if (line.collideLine(new Line(topLeft, topRight))) {
            return true;
        }
        if (line.collideLine(new Line(topLeft, bottomLeft))) {
            return true;
        }
        if (line.collideLine(new Line(topRight, bottomRight))) {
            return true;
        }
        if (line.collideLine(new Line(bottomLeft, bottomRight))) {
            return true;
        }

        // no collision
        return false;
    }

    /**
     * Checks if this rectangle collides with a circle.
     * @param {Circle} circle Circle to check collision with.
     * @return {Boolean} if rectangle collides with circle.
     */
    collideCircle(circle) 
    {
        // get center and radius
        let center = circle.center;
        let radius = circle.radius;

        // first check if circle center is inside the rectangle - easy case
        let rect = this;
        if (rect.containsVector(center)) {
            return true;
        }

        // get rectangle center
        let rectCenter = rect.getCenter();

        // get corners
        let topLeft = rect.getTopLeft();
        let topRight = rect.getTopRight();
        let bottomRight = rect.getBottomRight();
        let bottomLeft = rect.getBottomLeft();

        // create a list of lines to check (in the rectangle) based on circle position to rect center
        let lines = [];
        if (rectCenter.x > center.x) {
            lines.push([topLeft, bottomLeft]);
        } else {
            lines.push([topRight, bottomRight]);
        }
        if (rectCenter.y > center.y) {
            lines.push([topLeft, topRight]);
        } else {
            lines.push([bottomLeft, bottomRight]);
        }

        // now check intersection between circle and each of the rectangle lines
        for (let i = 0; i < lines.length; ++i) {
            let disToLine = pointLineDistance(center, lines[i][0], lines[i][1]);
            if (disToLine <= radius) {
                return true;
            }
        }

        // no collision..
        return false;
    }

    /**
     * Get the smallest circle containing this rectangle.
     * @returns {Circle} Bounding circle.
     */
    getBoundingCircle()
    {
        let center = this.getCenter();
        let radius = center.distanceTo(this.getTopLeft());
        return new Circle(center, radius);
    }
    
    /**
     * Build and return a rectangle from points.
     * @param {Array<Vector2>} points Points to build rectangle from.
     * @returns {Rectangle} new rectangle from points.
     */
    static fromPoints(points)
    {
        let min_x = points[0].x;
        let min_y = points[0].y;
        let max_x = min_x;
        let max_y = min_y;

        for (let i = 1; i < points.length; ++i) {
            min_x = Math.min(min_x, points[i].x);
            min_y = Math.min(min_y, points[i].y);
            max_x = Math.max(max_x, points[i].x);
            max_y = Math.max(max_y, points[i].y);
        }

        return new Rectangle(min_x, min_y, max_x - min_x, max_y - min_y);
    }

    /**
     * Return a resized rectangle with the same center point.
     * @param {Number|Vector2} amount Amount to resize.
     * @returns {Rectangle} resized rectangle.
     */
    resize(amount)
    {
        if (typeof amount === 'number') {
            amount = new Vector2(amount, amount);
        }
        return new Rectangle(this.x - amount.x / 2, this.y - amount.y / 2, this.width + amount.x, this.height + amount.y);
    }

    /**
     * Check if equal to another rectangle.
     * @param {Rectangle} other Other rectangle to compare to.
     */
    equals(other)
    {
        return (this === other) || 
                (other && (other.constructor === this.constructor) && this.x == other.x && this.y == other.y && this.width == other.width && this.height == other.height);
    }

    /**
     * Lerp between two rectangles.
     * @param {Rectangle} p1 First rectangles.
     * @param {Rectangle} p2 Second rectangles.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Rectangle} result rectangle.
     */
    static lerp(p1, p2, a)
    {
        let lerpScalar = MathHelper.lerp;
        return new Rectangle(  lerpScalar(p1.x, p2.x, a), 
                            lerpScalar(p1.y, p2.y, a), 
                            lerpScalar(p1.width, p2.width, a), 
                            lerpScalar(p1.height, p2.height, a)
                        );
    }

    /**
     * Create rectangle from a dictionary.
     * @param {*} data Dictionary with {x,y,width,height}.
     * @returns {Rectangle} Newly created rectangle.
     */
    static fromDict(data)
    {
        return new Rectangle(data.x || 0, data.y || 0, data.width || 0, data.height || 0);
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {x,y,width,height}
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.x) { ret.x = this.x; }
            if (this.y) { ret.y = this.y; }
            if (this.width) { ret.width = this.width; }
            if (this.height) { ret.height = this.height; }
            return ret;
        }
        return {x: this.x, y: this.y, width: this.width, height: this.height};
    }
}

/**
 * Get distance between a point and a line.
 * @private
 */
function pointLineDistance(p1, l1, l2) {

    let x = p1.x;
    let y = p1.y;
    let x1 = l1.x;
    let y1 = l1.y;
    let x2 = l2.x;
    let y2 = l2.y;

    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;
  
    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;
  
    var xx, yy;
  
    if (param < 0) {
      xx = x1;
      yy = y1;
    }
    else if (param > 1) {
      xx = x2;
      yy = y2;
    }
    else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
  
    var dx = x - xx;
    var dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }


// export the rectangle class
module.exports = Rectangle;
},{"./circle":53,"./line":57,"./math_helper":58,"./vector2":67}],62:[function(require,module,exports){
/**
 * Implement a seeded random generator.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\seeded_random.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/**
 * Class to generate random numbers with seed.
 */
class SeededRandom
{
    /**
     * Create the seeded random object.
     * @param {Number} seed Seed to start from. If not provided, will use 0.
     */
    constructor(seed)
    {
        if (seed === undefined) { seed = 0; }
        this.seed = seed;
    }

    /**
     * Get next random value.
     * @param {Number} min Optional min value. If max is not provided, this will be used as max.
     * @param {Number} max Optional max value.
     * @returns {Number} A randomly generated value.
     */
    random(min, max)
    {
        // generate next value
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let rnd = this.seed / 233280;

        // got min and max?
        if (min && max) {
            return min + rnd * (max - min);
        }
        // got only min (used as max)?
        else if (min) {
            return rnd * min;
        }
        // no min nor max provided
        return rnd;
    }
    
    /**
     * Pick a random value from array.
     * @param {Array} options Options to pick random value from.
     * @returns {*} Random value from options array.
     */
    pick(options)
    {
        return options[Math.floor(this.random(options.length))];
    }
}

// export the seeded random class.
module.exports = SeededRandom;
},{}],63:[function(require,module,exports){
/**
 * Implement a storage wrapper.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\storage.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const StorageAdapter = require("./storage_adapter");


/**
 * A thin wrapper layer around storage utility.
 */
class Storage
{
    /**
     * Create the storage.
     * @param {Array<StorageAdapter>} adapters List of storage adapters to pick from. Will use the first option returning 'isValid()' = true.
     * @param {String} prefix Optional prefix to add to all keys under this storage instance.
     * @param {Boolean} valuesAsBase64 If true, will encode and decode data as base64.
     * @param {Boolean} keysAsBase64 If true, will encode and decode keys as base64.
     */
    constructor(adapters, prefix, valuesAsBase64, keysAsBase64)
    {
        // default adapters
        adapters = adapters || Storage.defaultAdapters;

        // default to array
        if (!(adapters instanceof Array)) {
            adapters = [adapters];
        }

        // choose adapter
        this._adapter = null;
        for (let adapter of adapters) {
            if (adapter.isValid()) {
                this._adapter = adapter;
                break;
            }
        }

        // set if should use base64
        this.valuesAsBase64 = Boolean(valuesAsBase64);
        this.keysAsBase64 = Boolean(keysAsBase64);

        // set prefix
        this._keysPrefix = 'shaku_storage_' + (prefix || '') + '_';
    }

    /**
     * Return if this storage adapter is persistent storage or not.
     * @returns {Boolean} True if this storage type is persistent.
     */
    get persistent()
    {
        return this.isValid && this._adapter.persistent;
    }

    /**
     * Check if this storage instance has a valid adapter.
     * @returns {Boolean} True if found a valid adapter to use, false otherwise.
     */
    get isValid()
    {
        return Boolean(this._adapter);
    }

    /**
     * Convert key to string and add prefix if needed.
     * @private
     * @param {String} key Key to normalize.
     * @returns {String} Normalized key.
     */
    normalizeKey(key)
    {
        key = this._keysPrefix + key.toString();
        if (this.keysAsBase64) {
            key = btoa(key);
        }
        return key;
    }

    /**
     * Check if a key exists.
     * @param {String} key Key to check.
     * @returns {Boolean} True if key exists in storage.
     */
    exists(key)
    {
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        key = this.normalizeKey(key);
        return this._adapter.exists(key);
    }

    /**
     * Set value.
     * @private
     */
    _set(key, value)
    {
        // json stringify
        value = JSON.stringify({
            data: value,
            timestamp: (new Date()).getTime(),
            src: "Shaku",
            sver: 1.0
        });

        // convert to base64
        if (this.valuesAsBase64) {
            value = btoa(value);
        }

        // store value
        this._adapter.setItem(key, value);
    }

    /**
     * Get value.
     * @private
     */
    _get(key)
    {
        // get value
        var value = this._adapter.getItem(key);

        // not found? return null
        if (value === null) {
            return null;
        }

        // convert from base64
        if (this.valuesAsBase64) {
            try {
                value = atob(value);
            }
            catch (e) {
                throw new Error("Failed to parse Base64 string while reading data. Did you try to read a value as Base64 that wasn't encoded as Base64 when written to storage?");
            }
        }

        // parse json
        try {
            value = JSON.parse(value);
        }
        catch (e) {
            throw new Error("Failed to JSON-parse data from storage. Did you try to read something that wasn't written with the Storage utility?");
        }

        // return value
        return value.data;
    }
    
    /**
     * Set value.
     * @param {String} key Key to set.
     * @param {String} value Value to set.
     */
    setItem(key, value)
    {
        // sanity and normalize key
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        key = this.normalizeKey(key);

        // write value with metadata
        this._set(key, value);
    }

    /**
     * Get value.
     * @param {String} key Key to get.
     * @returns {String} Value or null if not set.
     */
    getItem(key)
    {
        // sanity and normalize key
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        key = this.normalizeKey(key);

        // read value from metadata
        return this._get(key);
    }

    /**
     * Get value and JSON parse it.
     * @param {String} key Key to get.
     * @returns {*} Value as a dictionary object or null if not set.
     */
    getJson(key)
    {
        return this.getItem(key) || null;
    }

    /**
     * Set value as JSON.
     * @param {String} key Key to set.
     * @param {*} value Value to set as a dictionary.
     */
    setJson(key, value)
    {
        key = this.normalizeKey(key);
        this._set(key, value);
    }

    /**
     * Delete value.
     * @param {String} key Key to delete.
     */
    deleteItem(key)
    {
        if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
        key = this.normalizeKey(key);
        this._adapter.deleteItem(key);
    }
    
    /**
     * Clear all values from this storage instance, based on prefix + adapter type.
     */
    clear()
    {
        this._adapter.clear(this._keysPrefix);
    }
}


/**
 * Default adapters to use when no adapters list is provided.
 */
Storage.defaultAdapters = [new StorageAdapter.localStorage(), new StorageAdapter.sessionStorage(), new StorageAdapter.memory()];


// export the storage class
module.exports = Storage;
},{"./storage_adapter":64}],64:[function(require,module,exports){
/**
 * Implement a storage adapter.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\storage_adapter.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';


/**
 * Storage adapter class that implement access to a storage device.
 * Used by the Storage utilitiy.
 */
class StorageAdapter
{
    /**
     * Return if this storage adapter is persistent storage or not.
     * @returns {Boolean} True if this storage type is persistent.
     */
    get persistent()
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Check if this adapter is OK to be used.
     * For example, an adapter for localStorage will make sure it exists and not null.
     * @returns {Boolean} True if storage adapter is valid to be used.
     */
    isValid()
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Check if a key exists.
     * @param {String} key Key to check.
     * @returns {Boolean} True if key exists in storage.
     */
    exists(key)
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Set value.
     * @param {String} key Key to set.
     * @param {String} value Value to set.
     */
    setItem(key, value)
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Get value.
     * @param {String} key Key to get.
     * @returns {String} Value or null if not set.
     */
    getItem(key)
    {
        throw new Error("Not Implemented.");
    }

    /**
     * Delete value.
     * @param {String} key Key to delete.
     */
    deleteItem(key)
    {
        throw new Error("Not Implemented.");
    }
    
    /**
     * Clear all values from this storage device.
     * @param {String} prefix Storage keys prefix.
     */
    clear(prefix)
    {
        throw new Error("Not Implemented.");
    }
}


/**
 * Implement simple memory storage adapter.
 */
class StorageAdapterMemory
{
    /**
     * Create the memory storage adapter.
     */
    constructor()
    {
        this._data = {};
    }

    /**
     * @inheritdoc
     */
    get persistent()
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    isValid()
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    exists(key)
    {
        return Boolean(this._data[key]);
    }

    /**
     * @inheritdoc
     */
    setItem(key, value)
    {
        this._data[key] = value;
    }

    /**
     * @inheritdoc
     */
    getItem(key)
    {
        return this._data[key];
    }

    /**
     * @inheritdoc
     */
    deleteItem(key)
    {
        delete this._data[key];
    }
    
    /**
     * @inheritdoc
     */
    clear(prefix)
    {
        for (let key in this._data) {
            if (key.indexOf(prefix) === 0) {
                delete this._data[key];
            }
        }
    }
}
StorageAdapter.memory = StorageAdapterMemory;


/**
 * Implement simple localstorage storage adapter.
 */
class StorageAdapterLocalStorage
{
    /**
     * @inheritdoc
     */
    get persistent()
    {
        return true;
    }

    /**
     * @inheritdoc
     */
    isValid()
    {
        try {
            return (typeof localStorage !== "undefined") && (localStorage !== null);
        }
        catch (e) {
            return false;
        }
    }

    /**
     * @inheritdoc
     */
    exists(key)
    {
        return localStorage.getItem(key) !== null;
    }

    /**
     * @inheritdoc
     */
    setItem(key, value)
    {
        localStorage.setItem(key, value);
    }

    /**
     * @inheritdoc
     */
    getItem(key)
    {
        return localStorage.getItem(key);
    }

    /**
     * @inheritdoc
     */
    deleteItem(key)
    {
        localStorage.deleteItem(key);
    }
    
    /**
     * @inheritdoc
     */
    clear(prefix)
    {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.indexOf(prefix) === 0) {
                delete localStorage.deleteItem(key);
            }
        }
    }
}
StorageAdapter.localStorage = StorageAdapterLocalStorage;


/**
 * Implement simple sessionStorage storage adapter.
 */
class StorageAdapterSessionStorage
{
    /**
     * @inheritdoc
     */
    get persistent()
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    isValid()
    {
        try {
            return (typeof sessionStorage !== "undefined") && (sessionStorage !== null);
        }
        catch (e) {
            return false;
        }
    }

    /**
     * @inheritdoc
     */
    exists(key)
    {
        return sessionStorage.getItem(key) !== null;
    }

    /**
     * @inheritdoc
     */
    setItem(key, value)
    {
        sessionStorage.setItem(key, value);
    }

    /**
     * @inheritdoc
     */
    getItem(key)
    {
        return sessionStorage.getItem(key);
    }

    /**
     * @inheritdoc
     */
    deleteItem(key)
    {
        sessionStorage.deleteItem(key);
    }
    
    /**
     * @inheritdoc
     */
    clear(prefix)
    {
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key.indexOf(prefix) === 0) {
                delete sessionStorage.deleteItem(key);
            }
        }
    }
}
StorageAdapter.sessionStorage = StorageAdapterSessionStorage;


// export the storage adapter class
module.exports = StorageAdapter;
},{}],65:[function(require,module,exports){
/**
 * Transformation modes.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\transform_modes.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

/**
 * Different ways we can combine local transformations with parent transformations.
 */
const TransformModes = {
    
    /**
     * The vector or scalar will be relative to the entity's parent transformations, and the local axis will be rotated by the parent's rotation.
     * For example, if we have an entity that renders a blue ball and a child entity that renders a red ball with offset of {100,0}, when we rotate the parent blue ball, the red ball will rotate around it, keeping a distance of 100 pixels. 
     */
    Relative: 'relative',

    /**
     * The vector or scalar will be relative to the entity's parent transformations, but local axis will be constant.
     * For example, if we have an entity that renders a blue ball and a child entity that renders a red ball with offset of {100,0}, no matter how we rotate the parent blue ball, the red ball will always keep offset of {100,0} from it, ie be rendered on its right. 
     */
    AxisAligned: 'axis-aligned',

    /**
     * The vector or scalar will ignore any parent transformations.
     * This means that the local transformations of the entity will always be its world transformations as well, no matter what it parent does.
     */
    Absolute: 'absolute'
}


// export the transform modes.
module.exports = TransformModes;
},{}],66:[function(require,module,exports){
/**
 * Transformations object to store position, rotation and scale, that also support transformations inheritance.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\transformation.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';
const MathHelper = require("./math_helper");
const TransformModes = require("./transform_modes");
const Matrix = require("../gfx/matrix");
const Vector2 = require("./vector2");

// some default values
const _defaults = {};
_defaults.position = Vector2.zero;
_defaults.positionMode = TransformModes.Relative;
_defaults.scale = Vector2.one;
_defaults.scaleMode = TransformModes.AxisAligned;
_defaults.rotation = 0;
_defaults.rotationMode = TransformModes.Relative;


/**
 * Transformations helper class to store 2d position, rotation and scale.
 * Can also perform transformations inheritance, where we combine local with parent transformations.
 * 
 * @example
 * // create local and world transformations
 * const transform = new Shaku.utils.Transformation();
 * const worldTransform = new Shaku.utils.Transformation();
 * // set offset to world transofm and rotation to local transform
 * worldTransform.setPosition({x: 100, y:50});
 * transform.setRotation(5);
 * // combine transformations and convert to a matrix
 * const combined = Shaku.utils.Transformation.combine(transform, worldTransform);
 * const matrix = combined.asMatrix();
 */
class Transformation
{
    /**
     * Create the transformations.
     * @param {Vector2} position Optional position value.
     * @param {Number} rotation Optional rotation value.
     * @param {Vector2} scale Optional sscale value.
     */
    constructor(position, rotation, scale)
    {
        /**
         * @private
         * Transformation local position.
         * @name Transformation#position
         * @type {Vector2}
         */
        this._position = position || _defaults.position.clone();
        
        /**
         * @private
         * Position transformation mode.
         * @name Transformation#positionMode
         * @type {TransformModes}
         */
        this._positionMode = _defaults.positionMode;

        /**
         * @private
         * Transformation local scale.
         * @name Transformation#scale
         * @type {Vector2}
         */
        this._scale = scale || _defaults.scale.clone();

        /**
         * @private
         * Scale transformation mode.
         * @name Transformation#scaleMode
         * @type {TransformModes}
         */
        this._scaleMode = _defaults.scaleMode;

        /**
         * @private
         * Transformation local rotation.
         * @name Transformation#rotation
         * @type {Number}
         */
        this._rotation = rotation || _defaults.rotation;

        /**
         * @private
         * Rotation transformation mode.
         * @name Transformation#rotationMode
         * @type {TransformModes}
         */
        this._rotationMode = _defaults.rotationMode;

        /**
         * Method to call when this transformation change.
         * Function params: transformation instance (this), properties changed (boolean), transform modes changed (boolean).
         * @name Transformation#onChange
         * @type {Function}
         */
        this.onChange = null;
    }

    /**
     * Get position.
     * @returns {Vector2} Position.
     */
    getPosition()
    {
        return this._position.clone();
    }

    /**
     * Get position transformations mode.
     * @returns {TransformModes} Position transformation mode.
     */
    getPositionMode()
    {
        return this._positionMode;
    }

    /**
     * Set position.
     * @param {Vector2} value New position.
     * @returns {Transformation} this.
     */
    setPosition(value)
    {
        if (this._position.equals(value)) { return; }
        this._position.copy(value);
        this._markDirty(true, false);
        return this;
    }

    /**
     * Set position X value.
     * @param {Number} value New position.x value.
     * @returns {Transformation} this.
     */
    setPositionX(value)
    {
        if (this._position.x === value) { return; }
        this._position.x = value;
        this._markDirty(true, false);
        return this;
    }

    /**
     * Set position Y value.
     * @param {Number} value New position.y value.
     * @returns {Transformation} this.
     */
    setPositionY(value)
    {
        if (this._position.y === value) { return; }
        this._position.y = value;
        this._markDirty(true, false);
        return this;
    }

    /**
     * Move position by a given vector.
     * @param {Vector2} value Vector to move position by.
     * @returns {Transformation} this.
     */
    move(value)
    {
        this._position.addSelf(value);
        this._markDirty(true, false);
        return this;
    }
    
    /**
     * Set position transformations mode.
     * @param {TransformModes} value Position transformation mode.
     * @returns {Transformation} this.
     */
    setPositionMode(value)
    {
        if (this._positionMode === value) { return; }
        this._positionMode = value;
        this._markDirty(false, true);
        return this;
    }

    /**
     * Get scale.
     * @returns {Vector2} Scale.
     */
    getScale()
    {
        return this._scale.clone();
    }

    /**
     * Get scale transformations mode.
     * @returns {TransformModes} Scale transformation mode.
     */
    getScaleMode()
    {
        return this._scaleMode;
    }

    /**
     * Set scale.
     * @param {Vector2} value New scale.
     * @returns {Transformation} this.
     */
    setScale(value)
    {
        if (this._scale.equals(value)) { return; }
        this._scale.copy(value);
        this._markDirty(true, false);
        return this;
    }

    /**
     * Set scale X value.
     * @param {Number} value New scale.x value.
     * @returns {Transformation} this.
     */
    setScaleX(value)
    {
        if (this._scale.x === value) { return; }
        this._scale.x = value;
        this._markDirty(true, false);
        return this;
    }
    
    /**
     * Set scale Y value.
     * @param {Number} value New scale.y value.
     * @returns {Transformation} this.
     */
    setScaleY(value)
    {
        if (this._scale.y === value) { return; }
        this._scale.y = value;
        this._markDirty(true, false);
        return this;
    }

    /**
     * Scale by a given vector.
     * @param {Vector2} value Vector to scale by.
     * @returns {Transformation} this.
     */
    scale(value)
    {
        this._scale.mulSelf(value);
        this._markDirty(true, false);
        return this;
    }

    /**
     * Set scale transformations mode.
     * @param {TransformModes} value Scale transformation mode.
     * @returns {Transformation} this.
     */
    setScaleMode(value)
    {
        if (this._scaleMode === value) { return; }
        this._scaleMode = value;
        this._markDirty(false, true);
        return this;
    }

    /**
     * Get rotation.
     * @returns {Number} rotation.
     */
    getRotation()
    {
        return this._rotation;
    }
    
    /**
     * Get rotation as degrees.
     * @returns {Number} rotation.
     */
    getRotationDegrees()
    {
        return MathHelper.toDegrees(this._rotation);
    }

    /**
     * Get rotation as degrees, wrapped between 0 to 360.
     * @returns {Number} rotation.
     */
    getRotationDegreesWrapped()
    {
        let ret = this.getRotationDegrees();
        return MathHelper.wrapDegrees(ret);
    }

    /**
     * Get rotation transformations mode.
     * @returns {TransformModes} Rotation transformations mode.
     */
    getRotationMode()
    {
        return this._rotationMode;
    }

    /**
     * Set rotation.
     * @param {Number} value New rotation.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    setRotation(value, wrap)
    {
        if (this._rotation === value) { return; }
        this._rotation = value;
        if (wrap && ((this._rotation < 0) || (this._rotation > (Math.PI * 2)))) {
            this._rotation = Math.atan2(Math.sin(this._rotation), Math.cos(this._rotation));
        }
        this._markDirty(true, false);
        return this;
    }

    /**
     * Rotate transformation by given radians.
     * @param {Number} value Rotate value in radians.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    rotate(value, wrap)
    {
        this.setRotation(this._rotation + value, wrap);
        return this;
    }

    /**
     * Set rotation as degrees.
     * @param {Number} value New rotation.
     * @param {Boolean} wrap If true, will wrap value if out of possible range.
     * @returns {Transformation} this.
     */
    setRotationDegrees(value, wrap)
    {
        const rads = MathHelper.toRadians(value, wrap);
        return this.setRotation(rads);
    }

    /**
     * Rotate transformation by given degrees.
     * @param {Number} value Rotate value in degrees.
     * @returns {Transformation} this.
     */
    rotateDegrees(value)
    {
        this._rotation += MathHelper.toRadians(value);
        this._markDirty(true, false);
        return this;
    }
        
    /**
     * Set rotation transformations mode.
     * @param {TransformModes} value Rotation transformation mode.
     * @returns {Transformation} this.
     */
    setRotationMode(value)
    {
        if (this._rotationMode === value) { return; }
        this._rotationMode = value;
        this._markDirty(false, true);
        return this;
    }

    /**
     * Notify about changes in values.
     * @param {Boolean} localTransform Local transformations changed. 
     * @param {Boolean} transformationModes Transformation modes changed.
     */
    _markDirty(localTransform, transformationModes)
    {
        this._matrix = null;
        if (this.onChange) {
            this.onChange(this, localTransform, transformationModes);
        }
    }
    
    /**
     * Check if this transformation equals another.
     * @param {Transformation} other Other transform to compare to.
     * @returns {Boolean} True if equal, false otherwise.
     */
    equals(other)
    {
        return  (this._rotation === other._rotation) && 
                (this._position.equals(other._position)) && 
                (this._scale.equals(other._scale));
    }

    /**
     * Return a clone of this transformations.
     * @returns {Transformation} Cloned transformations.
     */
    clone()
    {
        // create cloned transformation
        const ret = new Transformation(this._position.clone(), this._rotation, this._scale.clone());

        // copy transformation modes
        ret._rotationMode = this._rotationMode;
        ret._positionMode = this._positionMode;
        ret._scaleMode = this._scaleMode;
        
        // clone matrix
        ret._matrix = this._matrix;

        // return clone
        return ret;
    }

    /**
     * Serialize this transformation into a dictionary.
     */
    serialize()
    {
        const ret = {};

        // position + mode
        if (!this._position.equals(_defaults.position)) {
            ret.pos = this._position;
        }
        if (this._positionMode !== _defaults.positionMode) {
            ret.posm = this._positionMode;
        }

        // scale + mode
        if (!this._scale.equals(_defaults.scale)) {
            ret.scl = this._scale;
        }
        if (this._scaleMode !== _defaults.scaleMode) {
            ret.sclm = this._scaleMode;
        }

        // rotation + mode
        if (this._rotation !== _defaults.rotation) {
            ret.rot = Math.floor(MathHelper.toDegrees(this._rotation));
        }
        if (this._rotationMode !== _defaults.rotationMode) {
            ret.rotm = this._rotationMode;
        }

        return ret;
    }

    /**
     * Deserialize this transformation from a dictionary.
     * @param {*} data Data to set.
     */
    deserialize(data)
    {
        this._position.copy(data.pos || _defaults.position);
        this._scale.copy(data.scl || _defaults.scale);
        this._rotation = MathHelper.toRadians(data.rot || _defaults.rotation);
        this._positionMode = data.posm || _defaults.positionMode;
        this._scaleMode = data.sclm || _defaults.scaleMode;
        this._rotationMode = data.rotm || _defaults.rotationMode;
        this._markDirty(true, true);
    }
    
    /**
     * Create and return a transformation matrix.
     * @returns {Matrix} New transformation matrix.
     */
    asMatrix()
    {
        // return cached
        if (this._matrix) {
            return this._matrix;
        }

        // get matrix type and create list of matrices to combine
        let matrices = [];

        // apply position
        if ((this._position.x !== 0) || (this._position.y !== 0)) 
        { 
            matrices.push(Matrix.translate(this._position.x, this._position.y, 0));
        }
        
        // apply rotation
        if (this._rotation) 
        { 
            matrices.push(Matrix.rotateZ(-this._rotation));
        }
        
        // apply scale
        if ((this._scale.x !== 1) || (this._scale.y !== 1)) 
        { 
            matrices.push(Matrix.scale(this._scale.x, this._scale.y));
        }

        // no transformations? identity matrix
        if (matrices.length === 0) { 
            this._matrix = Matrix.identity; 
        }
        // only one transformation? return it
        else if (matrices.length === 1) { 
            this._matrix = matrices[0]; 
        }
        // more than one transformation? combine matrices
        else { 
            this._matrix = Matrix.multiplyMany(matrices); 
        }

        // return matrix
        return this._matrix;
    }

    /**
     * Combine child transformations with parent transformations.
     * @param {Transformation} child Child transformations.
     * @param {Transformation} parent Parent transformations.
     * @returns {Transformation} Combined transformations.
     */
    static combine(child, parent)
    {
        var position = combineVector(child._position, parent._position, parent, child._positionMode);
        var scale = combineVectorMul(child._scale, parent._scale, parent, child._scaleMode);
        var rotation = combineScalar(child._rotation, parent._rotation, parent, child._rotationMode);
        return new Transformation(position, rotation, scale);
    }
}


/**
 * Combine child scalar value with parent using a transformation mode.
 * @param {Number} childValue Child value. 
 * @param {Number} parentValue Parent value.
 * @param {Transformation} parent Parent transformations.
 * @param {TransformModes} mode Transformation mode. 
 * @returns {Number} Combined value.
 */
function combineScalar(childValue, parentValue, parent, mode)
{
    switch (mode)
    {
        case TransformModes.Absolute:
            return childValue;

        case TransformModes.AxisAligned:
        case TransformModes.Relative:
            return parentValue + childValue;

        default:
            throw new Error("Unknown transform mode!");
    }
}


/**
 * Combine child vector value with parent using a transformation mode.
 * @param {Vector2} childValue Child value. 
 * @param {Vector2} parentValue Parent value.
 * @param {Transformation} parent Parent transformations.
 * @param {TransformModes} mode Transformation mode.
 * @returns {Vector2} Combined value.
 */
function combineVector(childValue, parentValue, parent, mode)
{
    switch (mode)
    {
        case TransformModes.Absolute:
            return childValue.clone();

        case TransformModes.AxisAligned:
            return parentValue.add(childValue);

        case TransformModes.Relative:
            return parentValue.add(childValue.rotatedRadians(parent._rotation));

        default:
            throw new Error("Unknown transform mode!");
    }
}


/**
 * Combine child vector value with parent using a transformation mode and multiplication.
 * @param {Vector2} childValue Child value. 
 * @param {Vector2} parentValue Parent value.
 * @param {Transformation} parent Parent transformations.
 * @param {TransformModes} mode Transformation mode.
 * @returns {Vector2} Combined value.
 */
function combineVectorMul(childValue, parentValue, parent, mode)
{
    switch (mode)
    {
        case TransformModes.Absolute:
            return childValue.clone();

        case TransformModes.AxisAligned:
            return parentValue.mul(childValue);

        case TransformModes.Relative:
            return parentValue.mul(childValue.rotatedRadians(parent._rotation));

        default:
            throw new Error("Unknown transform mode!");
    }
}


// export the transformation object
module.exports = Transformation;
},{"../gfx/matrix":30,"./math_helper":58,"./transform_modes":65,"./vector2":67}],67:[function(require,module,exports){
/**
 * Implement a simple 2d vector.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\vector2.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const MathHelper = require("./math_helper");

/**
 * A simple Vector object for 2d positions.
 */
class Vector2
{
    /**
     * Create the Vector object.
     * @param {number} x Vector X.
     * @param {number} y Vector Y.
     */
    constructor(x = 0, y = 0)
    {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Clone the vector.
     * @returns {Vector2} cloned vector.
     */
    clone()
    {
        return new Vector2(this.x, this.y);
    }
    
    /**
     * Set vector value.
     * @param {Number} x X component.
     * @param {Number} y Y component.
     * @returns {Vector2} this.
     */
    set(x, y)
    {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Copy values from other vector into self.
     * @returns {Vector2} this.
     */
    copy(other) 
    {
        this.x = other.x;
        this.y = other.y;
        return this;
    }
    
    /**
     * Return a new vector of this + other.
     * @param {Number|Vector2} Other Vector or number to add.
     * @returns {Vector2} result vector.
     */
    add(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x + other, this.y + (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x + other.x, this.y + other.y);
    }
    
    /**
     * Return a new vector of this - other.
     * @param {Number|Vector2} Other Vector or number to sub.
     * @returns {Vector2} result vector.
     */
    sub(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x - other, this.y - (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x - other.x, this.y - other.y);
    }
    
    /**
     * Return a new vector of this / other.
     * @param {Number|Vector2} Other Vector or number to divide.
     * @returns {Vector2} result vector.
     */
    div(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x / other, this.y / (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x / other.x, this.y / other.y);
    }
    
    /**
     * Return a new vector of this * other.
     * @param {Number|Vector2} Other Vector or number to multiply.
     * @returns {Vector2} result vector.
     */
    mul(other) 
    {
        if (typeof other === 'number') {
            return new Vector2(this.x * other, this.y * (arguments[1] === undefined ? other : arguments[1]));
        }
        return new Vector2(this.x * other.x, this.y * other.y);
    }
    
    /**
     * Return a round copy of this vector.
     * @returns {Vector2} result vector.
     */
    round() 
    {
        return new Vector2(Math.round(this.x), Math.round(this.y));
    }
    
    /**
     * Return a floored copy of this vector.
     * @returns {Vector2} result vector.
     */
    floor() 
    {
        return new Vector2(Math.floor(this.x), Math.floor(this.y));
    }
        
    /**
     * Return a ceiled copy of this vector.
     * @returns {Vector2} result vector.
     */
    ceil() 
    {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
    }
    
    /**
     * Return a normalized copy of this vector.
     * @returns {Vector2} result vector.
     */
    normalized()
    {
        if (this.x == 0 && this.y == 0) { return Vector2.zero; }
        let mag = this.length;
        return new Vector2(this.x / mag, this.y / mag);
    }

    /**
     * Get a copy of this vector rotated by radians.
     * @param {Number} radians Radians to rotate by. 
     * @returns {Vector2} New vector with the length of this vector and direction rotated by given radians.
     */
    rotatedRadians(radians)
    {
        return Vector2.fromRadians(this.getRadians() + radians).mulSelf(this.length);
    }

    /**
     * Get a copy of this vector rotated by degrees.
     * @param {Number} degrees Degrees to rotate by. 
     * @returns {Vector2} New vector with the length of this vector and direction rotated by given degrees.
     */
    rotatedDegrees(degrees)
    {
        return Vector2.fromDegree(this.getDegrees() + degrees).mulSelf(this.length);
    }
    
    /**
     * Add other vector values to self.
     * @param {Number|Vector2} Other Vector or number to add.
     * @returns {Vector2} this.
     */
    addSelf(other) 
    {
        if (typeof other === 'number') {
            this.x += other;
            this.y += (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x += other.x;
            this.y += other.y;
        }
        return this;
    }

    /**
     * Sub other vector values from self.
     * @param {Number|Vector2} Other Vector or number to substract.
     * @returns {Vector2} this.
     */
    subSelf(other) 
    {
        if (typeof other === 'number') {
            this.x -= other;
            this.y -= (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x -= other.x;
            this.y -= other.y;
        }
        return this;
    }
    
    /**
     * Divide this vector by other vector values.
     * @param {Number|Vector2} Other Vector or number to divide by.
     * @returns {Vector2} this.
     */
    divSelf(other) 
    {
        if (typeof other === 'number') {
            this.x /= other;
            this.y /= (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x /= other.x;
            this.y /= other.y;
        }
        return this;
    }

    /**
     * Multiply this vector by other vector values.
     * @param {Number|Vector2} Other Vector or number to multiply by.
     * @returns {Vector2} this.
     */
    mulSelf(other) 
    {
        if (typeof other === 'number') {
            this.x *= other;
            this.y *= (arguments[1] === undefined ? other : arguments[1]);
        }
        else {
            this.x *= other.x;
            this.y *= other.y;
        }
        return this;
    }
    
    /**
     * Round self.
     * @returns {Vector2} this.
     */
    roundSelf() 
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }
    
    /**
     * Floor self.
     * @returns {Vector2} this.
     */
    floorSelf() 
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
     
    /**
     * Ceil self.
     * @returns {Vector2} this.
     */
    ceilSelf() 
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    /**
     * Return a normalized copy of this vector.
     * @returns {Vector2} this.
     */
    normalizeSelf()
    {
        if (this.x == 0 && this.y == 0) { return this; }
        let mag = this.length;
        this.x /= mag;
        this.y /= mag;
        return this;
    }
    
    /**
     * Return if vector equals another vector.
     * @param {Vector2} other Other vector to compare to.
     * @returns {Boolean} if vectors are equal.
     */
    equals(other)
    {
        return ((this === other) || ((other.constructor === this.constructor) && this.x === other.x && this.y === other.y));
    }
    
    /**
     * Return if vector approximately equals another vector.
     * @param {Vector2} other Other vector to compare to.
     * @param {Number} threshold Distance threshold to consider as equal. Defaults to 1.
     * @returns {Boolean} if vectors are equal.
     */
    approximate(other, threshold)
    {
        threshold = threshold || 1;
        return ((this === other) || 
                (
                 (Math.abs(this.x - other.x) <= threshold) && 
                 (Math.abs(this.y - other.y) <= threshold))
                );
    }

    /**
     * Return vector length (aka magnitude).
     * @returns {Number} Vector length.
     */
    get length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    /**
     * Return a copy of this vector multiplied by a factor.
     * @returns {Vector2} result vector.
     */
    scaled(fac) 
    {
        return new Vector2(this.x * fac, this.y * fac);
    }

    /**
     * Get vector (0,0).
     * @returns {Vector2} result vector.
     */
    static get zero()
    {
        return new Vector2();
    }

    /**
     * Get vector with 1,1 values.
     * @returns {Vector2} result vector.
     */
    static get one()
    {
        return new Vector2(1, 1);
    }

    /**
     * Get vector with 0.5,0.5 values.
     * @returns {Vector2} result vector.
     */
    static get half()
    {
        return new Vector2(0.5, 0.5);
    }

    /**
     * Get vector with -1,0 values.
     * @returns {Vector2} result vector.
     */
    static get left()
    {
        return new Vector2(-1, 0);
    }

    /**
     * Get vector with 1,0 values.
     * @returns {Vector2} result vector.
     */
    static get right()
    {
        return new Vector2(1, 0);
    }

    /**
     * Get vector with 0,-1 values.
     * @returns {Vector2} result vector.
     */
    static get up()
    {
        return new Vector2(0, -1);
    }

    /**
     * Get vector with 0,1 values.
     * @returns {Vector2} result vector.
     */
    static get down()
    {
        return new Vector2(0, 1);
    }

    /**
     * Get a random vector with length of 1.
     * @returns {Vector2} result vector.
     */
    static get random()
    {
        return Vector2.fromDegree(Math.random() * 360);
    }

    /**
     * Get degrees between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    degreesTo(other) 
    {
        return Vector2.degreesBetween(this, other);
    };

    /**
     * Get radians between this vector and another vector.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in radians.
     */
    radiansTo(other) 
    {
        return Vector2.radiansBetween(this, other);
    };
    
    /**
     * Get degrees between this vector and another vector.
     * Return values between 0 to 360.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    degreesToFull(other) 
    {
        return Vector2.degreesBetweenFull(this, other);
    };

    /**
     * Get radians between this vector and another vector.
     * Return values between 0 to PI2.
     * @param {Vector2} other Other vector.
     * @returns {Number} Angle between vectors in radians.
     */
    radiansToFull(other) 
    {
        return Vector2.radiansBetweenFull(this, other);
    };
    
    /**
     * Calculate distance between this vector and another vectors.
     * @param {Vector2} other Other vector.
     * @returns {Number} Distance between vectors.
     */
    distanceTo(other)
    {
        return Vector2.distance(this, other);
    }
    
    /**
     * Get vector from degrees.
     * @param {Number} degrees Angle to create vector from (0 = vector pointing right).
     * @returns {Vector2} result vector.
     */
    static fromDegree(degrees)
    {
        let rads = degrees * (Math.PI / 180);
        return new Vector2(Math.cos(rads), Math.sin(rads));
    }

    /**
     * Get vector from radians.
     * @param {Number} radians Angle to create vector from (0 = vector pointing right).
     * @returns {Vector2} result vector.
     */
    static fromRadians(radians)
    {
        return new Vector2(Math.cos(radians), Math.sin(radians));
    }
    
    /**
     * Lerp between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Vector2} result vector.
     */
    static lerp(p1, p2, a)
    {
        let lerpScalar = MathHelper.lerp;
        return new Vector2(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a));
    }

    /**
     * Get degrees between two vectors.
     * Return values between -180 to 180.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    static degreesBetween(P1, P2) 
    {
        let deltaY = P2.y - P1.y,
        deltaX = P2.x - P1.x;
        return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    };

    /**
     * Get radians between two vectors.
     * Return values between -PI to PI.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in radians.
     */
    static radiansBetween(P1, P2) 
    {
        return MathHelper.toRadians(Vector2.degreesBetween(P1, P2));
    };
    
    /**
     * Get degrees between two vectors.
     * Return values between 0 to 360.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in degrees.
     */
    static degreesBetweenFull(P1, P2) 
    {
        let temp = P2.sub(P1);
        return temp.getDegrees();
    };

    /**
     * Get vector's angle in degrees.
     * @returns {Number} Vector angle in degrees.
     */
    getDegrees()
    {
        var angle = Math.atan2(this.y, this.x);
        var degrees = 180 * angle / Math.PI;
        return (360+Math.round(degrees)) % 360;
    }

    /**
     * Get vector's angle in radians.
     * @returns {Number} Vector angle in degrees.
     */
    getRadians()
    {
        var angle = Math.atan2(this.y, this.x);
        return angle;
    }
    
    /**
     * Get radians between two vectors.
     * Return values between 0 to PI2.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Angle between vectors in radians.
     */
    static radiansBetweenFull(P1, P2) 
    {
        return MathHelper.toRadians(Vector2.degreesBetweenFull(P1, P2));
    };

    /**
     * Calculate distance between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Distance between vectors.
     */
    static distance(p1, p2)
    {
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        return Math.sqrt(a*a + b*b);
    }

    /**
     * Return cross product between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Cross between vectors.
     */
    static cross(p1, p2)
    {
        return p1.x * p2.y - p1.y * p2.x;
    }
     
    /**
     * Return dot product between two vectors.
     * @param {Vector2} p1 First vector.
     * @param {Vector2} p2 Second vector.
     * @returns {Number} Dot between vectors.
     */
    static dot(p1, p2)
    {
        return p1.x * p2.x + p1.y * p2.y;
    }

    /**
     * Convert to string.
     */
    string()
    {
        return this.x + ',' + this.y;
    }

    /**
     * Parse and return a vector object from string in the form of "x,y".
     * @param {String} str String to parse.
     * @returns {Vector2} Parsed vector.
     */
    static parse(str)
    {
        let parts = str.split(',');
        return new Vector2(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()));
    }

    /**
     * Convert to array of numbers.
     * @returns {Array<Number>} Vector components as array.
     */
    toArray()
    {
        return [this.x, this.y];
    }

    /**
     * Create vector from array of numbers.
     * @param {Array<Number>} arr Array of numbers to create vector from.
     * @returns {Vector2} Vector instance.
     */
    static fromArray(arr)
    {
        return new Vector2(arr[0], arr[1]);
    }

    /**
     * Create vector from a dictionary.
     * @param {*} data Dictionary with {x,y}.
     * @returns {Vector2} Newly created vector.
     */
    static fromDict(data)
    {
        return new Vector2(data.x || 0, data.y || 0);
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {x,y}
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.x) { ret.x = this.x; }
            if (this.y) { ret.y = this.y; }
            return ret;
        }
        return {x: this.x, y: this.y};
    }
}

// export vector object
module.exports = Vector2;
},{"./math_helper":58}],68:[function(require,module,exports){
/**
 * Implement a 3d vector.
 * 
 * |-- copyright and license --|
 * @package    Shaku
 * @file       shaku\lib\utils\vector3.js
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
 * |-- end copyright and license --|
 * 
 */
'use strict';

const MathHelper = require("./math_helper");

/**
 * A Vector object for 3d positions.
 */
class Vector3
{
    /**
     * Create the Vector object.
     * @param {number} x Vector X.
     * @param {number} y Vector Y.
     * @param {number} z Vector Z.
     */
    constructor(x = 0, y = 0, z = 0)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    /**
     * Clone the vector.
     * @returns {Vector3} cloned vector.
     */
    clone()
    {
        return new Vector3(this.x, this.y, this.z);
    }
    
    /**
     * Set vector value.
     * @param {Number} x X component.
     * @param {Number} y Y component.
     * @param {Number} z Z component.
     * @returns {Vector3} this.
     */
    set(x, y)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    /**
     * Copy values from other vector into self.
     * @returns {Vector3} this.
     */
    copy(other) 
    {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
    }
    
    /**
     * Return a new vector of this + other.
     * @param {Number|Vector3} Other Vector or number to add.
     * @returns {Vector3} result vector.
     */
    add(other) 
    {
        if (typeof other === 'number') {
            return new Vector3(
                this.x + other, 
                this.y + (arguments[1] === undefined ? other : arguments[1]),
                this.z + (arguments[2] === undefined ? other : arguments[2])
            );
        }
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }
    
    /**
     * Return a new vector of this - other.
     * @param {Number|Vector3} Other Vector or number to sub.
     * @returns {Vector3} result vector.
     */
    sub(other) 
    {
        if (typeof other === 'number') {
            return new Vector3(
                this.x - other, 
                this.y - (arguments[1] === undefined ? other : arguments[1]),
                this.z - (arguments[2] === undefined ? other : arguments[2])
            );
        }
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }
    
    /**
     * Return a new vector of this / other.
     * @param {Number|Vector3} Other Vector or number to divide.
     * @returns {Vector3} result vector.
     */
    div(other) 
    {
        if (typeof other === 'number') {
            return new Vector3(
                this.x / other, 
                this.y / (arguments[1] === undefined ? other : arguments[1]),
                this.z / (arguments[2] === undefined ? other : arguments[2])
            );
        }
        return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
    }
    
    /**
     * Return a new vector of this * other.
     * @param {Number|Vector3} Other Vector or number to multiply.
     * @returns {Vector3} result vector.
     */
    mul(other) 
    {
        if (typeof other === 'number') {
            return new Vector3(
                this.x * other, 
                this.y * (arguments[1] === undefined ? other : arguments[1]),
                this.z * (arguments[2] === undefined ? other : arguments[2])
            );
        }
        return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    }
    
    /**
     * Return a round copy of this vector.
     * @returns {Vector3} result vector.
     */
    round() 
    {
        return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    }
    
    /**
     * Return a floored copy of this vector.
     * @returns {Vector3} result vector.
     */
    floor() 
    {
        return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
    }
        
    /**
     * Return a ceiled copy of this vector.
     * @returns {Vector3} result vector.
     */
    ceil() 
    {
        return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
    }
    
    /**
     * Return a normalized copy of this vector.
     * @returns {Vector3} result vector.
     */
    normalized()
    {
        if (this.x == 0 && this.y == 0 && this.z == 0) { return Vector3.zero; }
        let mag = this.length;
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    }

    /**
     * Add other vector values to self.
     * @param {Number|Vector3} Other Vector or number to add.
     * @returns {Vector3} this.
     */
    addSelf(other) 
    {
        if (typeof other === 'number') {
            this.x += other;
            this.y += (arguments[1] === undefined ? other : arguments[1]);
            this.z += (arguments[2] === undefined ? other : arguments[2]);
        }
        else {
            this.x += other.x;
            this.y += other.y;
            this.z += other.z;
        }
        return this;
    }

    /**
     * Sub other vector values from self.
     * @param {Number|Vector3} Other Vector or number to substract.
     * @returns {Vector3} this.
     */
    subSelf(other) 
    {
        if (typeof other === 'number') {
            this.x -= other;
            this.y -= (arguments[1] === undefined ? other : arguments[1]);
            this.z -= (arguments[2] === undefined ? other : arguments[2]);
        }
        else {
            this.x -= other.x;
            this.y -= other.y;
            this.z -= other.z;
        }
        return this;
    }
    
    /**
     * Divide this vector by other vector values.
     * @param {Number|Vector3} Other Vector or number to divide by.
     * @returns {Vector3} this.
     */
    divSelf(other) 
    {
        if (typeof other === 'number') {
            this.x /= other;
            this.y /= (arguments[1] === undefined ? other : arguments[1]);
            this.z /= (arguments[2] === undefined ? other : arguments[2]);
        }
        else {
            this.x /= other.x;
            this.y /= other.y;
            this.z /= other.z;
        }
        return this;
    }

    /**
     * Multiply this vector by other vector values.
     * @param {Number|Vector3} Other Vector or number to multiply by.
     * @returns {Vector3} this.
     */
    mulSelf(other) 
    {
        if (typeof other === 'number') {
            this.x *= other;
            this.y *= (arguments[1] === undefined ? other : arguments[1]);
            this.z *= (arguments[2] === undefined ? other : arguments[2]);
        }
        else {
            this.x *= other.x;
            this.y *= other.y;
            this.z *= other.z;
        }
        return this;
    }
    
    /**
     * Round self.
     * @returns {Vector3} this.
     */
    roundSelf() 
    {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
    }
    
    /**
     * Floor self.
     * @returns {Vector3} this.
     */
    floorSelf() 
    {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
    }
     
    /**
     * Ceil self.
     * @returns {Vector3} this.
     */
    ceilSelf() 
    {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
    }

    /**
     * Return a normalized copy of this vector.
     * @returns {Vector3} this.
     */
    normalizeSelf()
    {
        if (this.x == 0 && this.y == 0 && this.z == 0) { return this; }
        let mag = this.length;
        this.x /= mag;
        this.y /= mag;
        this.z /= mag;
        return this;
    }
    
    /**
     * Return if vector equals another vector.
     * @param {Vector3} other Other vector to compare to.
     * @returns {Boolean} if vectors are equal.
     */
    equals(other)
    {
        return ((this === other) || 
                ((other.constructor === this.constructor) && 
                this.x === other.x && this.y === other.y && this.z === other.z)
            );
    }
    
    /**
     * Return if vector approximately equals another vector.
     * @param {Vector3} other Other vector to compare to.
     * @param {Number} threshold Distance threshold to consider as equal. Defaults to 1.
     * @returns {Boolean} if vectors are equal.
     */
    approximate(other, threshold)
    {
        threshold = threshold || 1;
        return (
            (this === other) || 
                ((Math.abs(this.x - other.x) <= threshold) && 
                (Math.abs(this.y - other.y) <= threshold) && 
                (Math.abs(this.z - other.z) <= threshold))
            );
    }

    /**
     * Return vector length (aka magnitude).
     * @returns {Number} Vector length.
     */
    get length()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }

    /**
     * Return a copy of this vector multiplied by a factor.
     * @returns {Vector3} result vector.
     */
    scaled(fac) 
    {
        return new Vector3(this.x * fac, this.y * fac, this.z * fac);
    }

    /**
     * Get vector (0,0).
     * @returns {Vector3} result vector.
     */
    static get zero()
    {
        return new Vector3();
    }

    /**
     * Get vector with 1,1 values.
     * @returns {Vector3} result vector.
     */
    static get one()
    {
        return new Vector3(1, 1, 1);
    }

    /**
     * Get vector with 0.5,0.5 values.
     * @returns {Vector3} result vector.
     */
    static get half()
    {
        return new Vector3(0.5, 0.5, 0.5);
    }

    /**
     * Get vector with -1,0 values.
     * @returns {Vector3} result vector.
     */
    static get left()
    {
        return new Vector3(-1, 0, 0);
    }

    /**
     * Get vector with 1,0 values.
     * @returns {Vector3} result vector.
     */
    static get right()
    {
        return new Vector3(1, 0, 0);
    }

    /**
     * Get vector with 0,-1 values.
     * @returns {Vector3} result vector.
     */
    static get up()
    {
        return new Vector3(0, -1, 0);
    }

    /**
     * Get vector with 0,1 values.
     * @returns {Vector3} result vector.
     */
    static get down()
    {
        return new Vector3(0, 1, 0);
    }

    /**
     * Get vector with 0,0,-1 values.
     * @returns {Vector3} result vector.
     */
    static get front()
    {
        return new Vector3(0, 0, -1);
    }

    /**
     * Get vector with 0,0,1 values.
     * @returns {Vector3} result vector.
     */
    static get back()
    {
        return new Vector3(0, 0, 1);
    }
    
    /**
     * Calculate distance between this vector and another vectors.
     * @param {Vector3} other Other vector.
     * @returns {Number} Distance between vectors.
     */
    distanceTo(other)
    {
        return Vector3.distance(this, other);
    }
    
    /**
     * Lerp between two vectors.
     * @param {Vector3} p1 First vector.
     * @param {Vector3} p2 Second vector.
     * @param {Number} a Lerp factor (0.0 - 1.0).
     * @returns {Vector3} result vector.
     */
    static lerp(p1, p2, a)
    {
        let lerpScalar = MathHelper.lerp;
        return new Vector3(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a), lerpScalar(p1.z, p2.z, a));
    }

    /**
     * Calculate distance between two vectors.
     * @param {Vector3} p1 First vector.
     * @param {Vector3} p2 Second vector.
     * @returns {Number} Distance between vectors.
     */
    static distance(p1, p2)
    {
        let a = p1.x - p2.x;
        let b = p1.y - p2.y;
        let c = p1.z - p2.z;
        return Math.sqrt(a*a + b*b + c*c);
    }

    /**
     * Return cross product between two vectors.
     * @param {Vector3} p1 First vector.
     * @param {Vector3} p2 Second vector.
     * @returns {Vector3} Crossed vector.
     */
    static crossVector(p1, p2)
    {
        const ax = p1.x, ay = p1.y, az = p1.z;
		const bx = p2.x, by = p2.y, bz = p2.z;

		let x = ay * bz - az * by;
		let y = az * bx - ax * bz;
		let z = ax * by - ay * bx;

		return new Vector3(x, y, z);
    }

    /**
     * Convert to string.
     */
    string()
    {
        return this.x + ',' + this.y + ',' + this.z;
    }

    /**
     * Parse and return a vector object from string in the form of "x,y".
     * @param {String} str String to parse.
     * @returns {Vector3} Parsed vector.
     */
    static parse(str)
    {
        let parts = str.split(',');
        return new Vector3(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()), parseFloat(parts[2].trim()));
    }

    /**
     * Convert to array of numbers.
     * @returns {Array<Number>} Vector components as array.
     */
    toArray()
    {
        return [this.x, this.y, this.z];
    }

    /**
     * Create vector from array of numbers.
     * @param {Array<Number>} arr Array of numbers to create vector from.
     * @returns {Vector3} Vector instance.
     */
    static fromArray(arr)
    {
        return new Vector3(arr[0], arr[1], arr[2]);
    }

    /**
     * Create vector from a dictionary.
     * @param {*} data Dictionary with {x,y,z}.
     * @returns {Vector3} Newly created vector.
     */
    static fromDict(data)
    {
        return new Vector3(data.x || 0, data.y || 0, data.z || 0);
    }

    /**
     * Convert to dictionary.
     * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
     * @returns {*} Dictionary with {x,y,z}
     */
    toDict(minimized)
    {
        if (minimized) {
            const ret = {};
            if (this.x) { ret.x = this.x; }
            if (this.y) { ret.y = this.y; }
            if (this.z) { ret.z = this.z; }
            return ret;
        }
        return {x: this.x, y: this.y, z: this.z};
    }
}

// export vector object
module.exports = Vector3;
},{"./math_helper":58}]},{},[40])(40)
});

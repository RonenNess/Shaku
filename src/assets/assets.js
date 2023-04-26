/**
 * Implement the assets manager.
 * 
 * |-- copyright and license --|
 * @module     Shaku
 * @file       shaku\src\assets\assets.js
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
const TextureAtlas = require('./texture_atlas_asset.js');
const TextureAtlasAsset = require('./texture_atlas_asset.js');
const Vector2 = require('../utils/vector2.js');
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
    #_wrapUrl(url)
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
    #_getFromCache(url, type)
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
    async #_loadAndCacheAsset(newAsset, params)
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
        url = this.#_wrapUrl(url);
        return this._loaded[url] || null;
    }

    /**
     * Get / load asset of given type, and return a promise to be resolved when ready.
     * @private
     */
    #_loadAssetType(url, typeClass, params)
    {
        // normalize URL
        url = this.#_wrapUrl(url);

        // try to get from cache
        let _asset = this.#_getFromCache(url, typeClass);
        
        // check if need to create new and load
        var needLoad = false;
        if (!_asset) {
            _asset = new typeClass(url);
            needLoad = true;
        }
        
        // create promise to load asset
        let promise = new Promise(async (resolve, reject) => {
            if (needLoad) {
                await this.#_loadAndCacheAsset(_asset, params);
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
    #_createAsset(name, classType, initMethod, needWait)
    {
        // create asset
        name = this.#_wrapUrl(name);
        var _asset = new classType(name || generateRandomAssetName());

        // if this asset need waiting
        if (needWait) {
            this._waitingAssets.add(name);
        }

        // generate render target in async
        let promise = new Promise(async (resolve, reject) => {

            // make sure not in cache
            if (name && this._loaded[name]) { return reject(`Asset of type '${classType.name}' to create with URL '${name}' already exist in cache!`); }

            // create and return
            await initMethod(_asset);
            if (name) { 
                this._loaded[name] = _asset; 
            }
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
        return this.#_loadAssetType(url, SoundAsset, undefined);
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
        return this.#_loadAssetType(url, TextureAsset, params);
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
        return this.#_createAsset(name, TextureAsset, (asset) => {
            asset.createRenderTarget(width, height, channels);
        });
    }
    
    /**
     * Create a texture atlas asset.
     * @param {String | null} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Array<String>} sources List of URLs to load textures from. 
     * @param {Number=} maxWidth Optional atlas textures max width.
     * @param {Number=} maxHeight Optional atlas textures max height.
     * @param {Vector2=} extraMargins Optional extra empty pixels to add between textures in atlas.
     * @returns {Promise<TextureAtlas>} Promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    createTextureAtlas(name, sources, maxWidth, maxHeight, extraMargins)
    {
        // make sure we have valid size
        if (!sources || !sources.length) {
            throw new Error("Missing or invalid sources!");
        }

        // create asset and return promise
        return this.#_createAsset(name, TextureAtlasAsset, async (asset) => {
            try {
                await asset._build(sources, maxWidth, maxHeight, extraMargins);
                this._waitingAssets.delete(name);
                this._successfulLoadedAssetsCount++;
            }
            catch (e) {
                _logger.warn(`Failed to create texture atlas: '${e}'.`);
                this._failedAssets.add(url);
            }
        }, true);
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
        return this.#_loadAssetType(url, FontTextureAsset, params);
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
        return this.#_loadAssetType(url, MsdfFontTextureAsset, params);
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
        return this.#_loadAssetType(url, JsonAsset);
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
        return this.#_createAsset(name, JsonAsset, (asset) => {
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
        return this.#_loadAssetType(url, BinaryAsset);
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
        return this.#_createAsset(name, BinaryAsset, (asset) => {
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
        url = this.#_wrapUrl(url);
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
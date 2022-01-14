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
                    _logger.warn("Dont waiting for assets: had errors.");
                    return reject(this.failedAssets);
                }

                // all done?
				if (this._waitingAssets.size === 0) {
                    _logger.debug("Dont waiting for assets: everything loaded successfully.");
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
     * @param {String} url Asset URL.
     * @param {type} type Asset type to load.
     * @param {*} params Optional loading params.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when loaded.
     */
    _loadAndCacheAsset(url, type, params)
    {
        return new Promise(async (resolve, reject) => {

            // update waiting assets count
            this._waitingAssets.add(url);

            _logger.debug(`Load asset [${type.name}] from URL '${url}'.`);

            // load asset
            let newAsset = new type(url);
            try {
                await newAsset.load(params);
            }
            catch (e) {
                _logger.warn(`Failed to load asset [${type.name}] from URL '${url}'.`);
                this._failedAssets.add(url);
                return reject(e);
            }
            this._loaded[url] = newAsset;

            // update waiting assets count
            this._waitingAssets.delete(url);

            // make sure valid
            if (!newAsset.valid) {
                _logger.warn(`Failed to load asset [${type.name}] from URL '${url}'.`);
                this._failedAssets.add(url);
                return reject("Loaded asset is not valid!");
            }

            _logger.debug(`Successfully loaded asset [${type.name}] from URL '${url}'.`);

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
        return this._loaded[url] || null;
    }

    /**
     * Load a sound asset. If already loaded, will use cache.
     * @example
     * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
     * @param {String} url Asset URL.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadSound(url)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // try to get from cache
            _asset = this._getFromCache(url, SoundAsset);
            if (_asset) { return resolve(_asset); }

            // load and return asset
            _asset = await this._loadAndCacheAsset(url, SoundAsset);
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }

    /**
     * Load a texture asset. If already loaded, will use cache.
     * @example
     * let texture = await Shaku.assets.loadTexture("assets/my_texture.png", {generateMipMaps: false});
     * @param {String} url Asset URL.
     * @param {*} params Optional params dictionary. See TextureAsset.load() for more details.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadTexture(url, params)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // try to get from cache
            _asset = this._getFromCache(url, TextureAsset);
            if (_asset) { return resolve(_asset); }

            // load and return asset
            _asset = await this._loadAndCacheAsset(url, TextureAsset, params);
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }

    /**
     * Create a render target texture asset. If already loaded, will use cache.
     * @example
     * let width = 512;
     * let height = 512;
     * let renderTarget = await Shaku.assets.createRenderTarget("optional_render_target_asset_id", width, height);
     * @param {String} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Number} width Texture width.
     * @param {Number} height Texture height.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    createRenderTarget(name, width, height)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // make sure we have valid size
            if (!width || !height) {
                return reject("Missing or invalid size!");
            }

            // make sure not in cache
            if (name && this._loaded[name]) { return reject(`Asset with URL or name '${name}' already exist!`); }

            // create and return
            _asset = new TextureAsset(name || generateRandomAssetName());
            _asset.createRenderTarget(width, height);
            if (name) { this._loaded[name] = _asset; }
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }
    
    /**
     * Load a font texture asset. If already loaded, will use cache.
     * @example
     * let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});
     * @param {String} url Asset URL.
     * @param {*} params Optional params dictionary. See FontTextureAsset.load() for more details.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadFontTexture(url, params)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // try to get from cache
            _asset = this._getFromCache(url, FontTextureAsset);
            if (_asset) { return resolve(_asset); }

            // load and return asset
            _asset = await this._loadAndCacheAsset(url, FontTextureAsset, params);
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }
    
    /**
     * Load a json asset. If already loaded, will use cache.
     * @example
     * let jsonData = await Shaku.assets.loadJson('assets/my_json_data.json');
     * console.log(jsonData.data);
     * @param {String} url Asset URL.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadJson(url)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // try to get from cache
            _asset = this._getFromCache(url, JsonAsset);
            if (_asset) { return resolve(_asset); }

            // load and return asset
            _asset = await this._loadAndCacheAsset(url, JsonAsset);
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }
 
    /**
     * Create a new json asset. If already exist, will reject promise.
     * @example
     * let jsonData = await Shaku.assets.createJson('optional_json_data_id', {"foo": "bar"});
     * // you can now load this asset from anywhere in your code using 'optional_json_data_id' as url
     * @param {String} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Object|String} data Optional starting data.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
     */
    createJson(name, data)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // make sure not in cache
            if (name && this._loaded[name]) { return reject(`Asset with URL or name '${name}' already exist!`); }

            // create and return the new json asset
            _asset = new JsonAsset(name || generateRandomAssetName());
            _asset.create(data);
            if (name) { this._loaded[name] = _asset; }
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }

    /**
     * Load a binary data asset. If already loaded, will use cache.
     * @example
     * let binData = await Shaku.assets.loadBinary('assets/my_bin_data.dat');
     * console.log(binData.data);
     * @param {String} url Asset URL.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadBinary(url)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // try to get from cache
            _asset = this._getFromCache(url, BinaryAsset);
            if (_asset) { return resolve(_asset); }

            // load and return asset
            _asset = await this._loadAndCacheAsset(url, BinaryAsset);
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }

    /**
     * Create a new binary asset. If already exist, will reject promise.
     * @example
     * let binData = await Shaku.assets.createBinary('optional_bin_data_id', [1,2,3,4]);
     * // you can now load this asset from anywhere in your code using 'optional_bin_data_id' as url
     * @param {String} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Array<Number>|Uint8Array} data Binary data to set.
     * @returns {Promise<Asset>} promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
     */
    createBinary(name, data)
    {
        var _asset;
        let promise = new Promise(async (resolve, reject) => {

            // make sure not in cache
            if (name && this._loaded[name]) { return reject(`Asset with URL or name '${name}' already exist!`); }

            // create and return the new binary asset
            _asset = new BinaryAsset(name || generateRandomAssetName());
            await _asset.create(data);
            if (name) { this._loaded[name] = _asset; }
            resolve(_asset);
        });
        promise.asset = _asset;
        return promise;
    }

    /**
     * Destroy and free asset from cache.
     * @example
     * Shaku.assets.free("my_asset_url");
     * @param {String} url Asset URL to free.
     */
    free(url)
    {
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
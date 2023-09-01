import { IManager, LoggerFactory, Vector2 } from "../utils";
import { Asset } from "./asset";
import { BinaryAsset } from "./binary_asset";
import { FontTextureAsset } from "./font_texture_asset";
import { JsonAsset } from "./json_asset";
import { MsdfFontTextureAsset } from "./msdf_font_texture_asset";
import { SoundAsset } from "./sound_asset";
import { TextureAsset } from "./texture_asset";
import { TextureAtlasAsset } from "./texture_atlas_asset";

const _logger = LoggerFactory.getLogger("gfx"); // TODO

/**
 * Assets manager class.
 * Used to create, load and cache game assets, which includes textures, audio files, JSON objects, etc.
 * As a rule of thumb, all methods to load or create assets are async and return a promise.
 *
 * To access the Assets manager you use `Shaku.assets`.
 */
export class Assets implements IManager {
	private _loaded: Record<string, Asset> | null;
	private _waitingAssets: Set<string>;
	private _failedAssets: Set<string>;
	private _successfulLoadedAssetsCount: number;

	public root: string;
	public suffix: string;

	/**
	 * Create the manager.
	 */
	public constructor() {
		this._loaded = null;
		this._waitingAssets = new Set();
		this._failedAssets = new Set();
		this._successfulLoadedAssetsCount = 0;

		/**
		 * Optional URL root to prepend to all loaded assets URLs.
		 * For example, if all your assets are under "/static/assets/", you can set this url as root and omit it when loading assets later.
		 */
		this.root = "";

		/**
		 * Optional suffix to add to all loaded assets URLs.
		 * You can use this for anti-cache mechanism if you want to reload all assets. For example, you can set this value to ""?dt=" + Date.now()".
		 */
		this.suffix = "";
	}

	/**
	 * Wrap a URL with "root" and "suffix".
	 * @param url Url to wrap.
	 * @returns Wrapped URL.
	 */
	#_wrapUrl(url: string) {
		if(!url) { return url; }
		return this.root + url + this.suffix;
	}

	/**
	 * Get list of assets waiting to be loaded.
	 * This list will be reset if you call clearCache().
	 * @returns URLs of assets waiting to be loaded.
	 */
	public get pendingAssets() {
		return Array.from(this._waitingAssets);
	}

	/**
	 * Get list of assets that failed to load.
	 * This list will be reset if you call clearCache().
	 * @returns URLs of assets that had error loading.
	 */
	public get failedAssets() {
		return Array.from(this._failedAssets);
	}

	/**
	 * Return a promise that will be resolved only when all pending assets are loaded.
	 * If an asset fails, will reject.
	 * @example
	 * await Shaku.assets.waitForAll();
	 * console.log("All assets are loaded!");
	 * @returns Promise to resolve when all assets are loaded, or reject if there are failed assets.
	 */
	public waitForAll() {
		return new Promise((resolve, reject) => {

			_logger.debug("Waiting for all assets..");

			// check if all assets are loaded or if there are errors
			let checkAssets = () => {

				// got errors?
				if(this._failedAssets.size !== 0) {
					_logger.warn("Done waiting for assets: had errors.");
					return reject(this.failedAssets);
				}

				// all done?
				if(this._waitingAssets.size === 0) {
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
	public setup(): Promise<void> {
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
	public startFrame() {
	}

	/**
	 * @inheritdoc
	 * @private
	 */
	public endFrame() {
	}

	/**
	 * Get already-loaded asset from cache.
	 * @private
	 * @param url Asset URL.
	 * @param type If provided will make sure asset is of this type. If asset found but have wrong type, will throw exception.
	 * @returns Loaded asset or null if not found.
	 */
	#_getFromCache(url: string, type: unknown) {
		let cached = this._loaded[url] || null;
		if(cached && type) {
			if(!(cached instanceof type)) {
				throw new Error(`Asset with URL "${url}" is already loaded, but has unexpected type (expecting ${type})!`);
			}
		}
		return cached;
	}

	/**
	 * Load an asset of a given type and add to cache when done.
	 * @private
	 * @param newAsset Asset instance to load.
	 * @param params Optional loading params.
	 */
	async #_loadAndCacheAsset(newAsset: Asset, params: unknown) {
		// extract url and typename, and add to cache
		let url = newAsset.url;
		let typeName = newAsset.constructor.name;
		this._loaded[url] = newAsset;
		this._waitingAssets.add(url);

		// initiate loading
		return new Promise(async (resolve, reject) => {

			// load asset
			_logger.debug(`Load asset [${typeName}] from URL "${url}".`);
			try {
				await newAsset.load(params);
			}
			catch(e) {
				_logger.warn(`Failed to load asset [${typeName}] from URL "${url}".`);
				this._failedAssets.add(url);
				return reject(e);
			}

			// update waiting assets count
			this._waitingAssets.delete(url);

			// make sure valid
			if(!newAsset.valid) {
				_logger.warn(`Failed to load asset [${typeName}] from URL "${url}".`);
				this._failedAssets.add(url);
				return reject("Loaded asset is not valid!");
			}

			_logger.debug(`Successfully loaded asset [${typeName}] from URL "${url}".`);

			// resolve
			this._successfulLoadedAssetsCount++;
			resolve(newAsset);
		});
	}

	/**
	 * Get asset directly from cache, synchronous and without a Promise.
	 * @param url Asset URL or name.
	 * @returns Asset or null if not loaded.
	 */
	public getCached(url: string) {
		url = this.#_wrapUrl(url);
		return this._loaded[url] || null;
	}

	/**
	 * Get / load asset of given type, and return a promise to be resolved when ready.
	 * @private
	 */
	#_loadAssetType<T extends Asset>(url: string, typeClass: { new(url: string): T; }, params?: unknown): Promise<T> {
		// normalize URL
		url = this.#_wrapUrl(url);

		// try to get from cache
		let _asset = this.#_getFromCache(url, typeClass);

		// check if need to create new and load
		var needLoad = false;
		if(!_asset) {
			_asset = new typeClass(url);
			needLoad = true;
		}

		// create promise to load asset
		let promise = new Promise(async (resolve, reject) => {
			if(needLoad) {
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
	#_createAsset<T>(name: string, classType: { new(...args: unknown[]): T; }, initMethod: (clazz: T) => Promise<void>, needWait?: boolean): Promise<T> {
		// create asset
		name = this.#_wrapUrl(name);
		var _asset = new classType(name || generateRandomAssetName());

		// if this asset need waiting
		if(needWait) {
			this._waitingAssets.add(name);
		}

		// generate render target in async
		let promise = new Promise(async (resolve, reject) => {

			// make sure not in cache
			if(name && this._loaded[name]) { return reject(`Asset of type "${classType.name}" to create with URL "${name}" already exist in cache!`); }

			// create and return
			await initMethod(_asset);
			if(name) {
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
	 * @param url Asset URL.
	 * @returns promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public loadSound(url: string): Promise<SoundAsset> {
		return this.#_loadAssetType(url, SoundAsset, undefined);
	}

	/**
	 * Load a texture asset. If already loaded, will use cache.
	 * @example
	 * let texture = await Shaku.assets.loadTexture("assets/my_texture.png", {generateMipMaps: false});
	 * @param url Asset URL.
	 * @param params Optional params dictionary. See TextureAsset.load() for more details.
	 * @returns promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public loadTexture(url: string, params?: unknown): Promise<TextureAsset> {
		return this.#_loadAssetType(url, TextureAsset, params);
	}

	/**
	 * Create a render target texture asset. If already loaded, will use cache.
	 * @example
	 * let width = 512;
	 * let height = 512;
	 * let renderTarget = await Shaku.assets.createRenderTarget("optional_render_target_asset_id", width, height);
	 * @param name Asset name (matched to URLs when using cache). If null, will not add to cache.
	 * @param width Texture width.
	 * @param height Texture height.
	 * @param channels Texture channels count. Defaults to 4 (RGBA).
	 * @returns promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public createRenderTarget(name: string | null, width: number, height: number, channels?: number): Promise<TextureAsset> {
		// make sure we have valid size
		if(!width || !height) {
			throw new Error("Missing or invalid size!");
		}

		// create asset and return promise
		return this.#_createAsset(name, TextureAsset, (asset) => {
			asset.createRenderTarget(width, height, channels);
		});
	}

	/**
	 * Create a texture atlas asset.
	 * @param name Asset name (matched to URLs when using cache). If null, will not add to cache.
	 * @param sources List of URLs to load textures from.
	 * @param maxWidth Optional atlas textures max width.
	 * @param maxHeight Optional atlas textures max height.
	 * @param extraMargins Optional extra empty pixels to add between textures in atlas.
	 * @returns Promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public createTextureAtlas(name: string | null, sources: [string, ...string[]], maxWidth?: number, maxHeight?: number, extraMargins?: Vector2) {
		// make sure we have valid size
		if(!sources || !sources.length) {
			throw new Error("Missing or invalid sources!");
		}

		// create asset and return promise
		return this.#_createAsset(name, TextureAtlasAsset, async (asset) => {
			try {
				await asset._build(sources, maxWidth, maxHeight, extraMargins);
				this._waitingAssets.delete(name);
				this._successfulLoadedAssetsCount++;
			}
			catch(e) {
				_logger.warn(`Failed to create texture atlas: "${e}".`);
				this._failedAssets.add(url);
			}
		}, true);
	}

	/**
	 * Load a font texture asset. If already loaded, will use cache.
	 * @example
	 * let fontTexture = await Shaku.assets.loadFontTexture("assets/DejaVuSansMono.ttf", {fontName: "DejaVuSansMono"});
	 * @param url Asset URL.
	 * @param params Optional params dictionary. See FontTextureAsset.load() for more details.
	 * @returns promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public loadFontTexture(url: string, params?: unknown): Promise<FontTextureAsset> {
		return this.#_loadAssetType(url, FontTextureAsset, params);
	}

	/**
	 * Load a MSDF font texture asset. If already loaded, will use cache.
	 * @example
	 * let fontTexture = await Shaku.assets.loadMsdfFontTexture("DejaVuSansMono.font", {jsonUrl: "assets/DejaVuSansMono.json", textureUrl: "assets/DejaVuSansMono.png"});
	 * @param url Asset URL.
	 * @param params Optional params dictionary. See MsdfFontTextureAsset.load() for more details.
	 * @returns promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public loadMsdfFontTexture(url: string, params?: unknown): Promise<MsdfFontTextureAsset> {
		return this.#_loadAssetType(url, MsdfFontTextureAsset, params);
	}

	/**
	 * Load a json asset. If already loaded, will use cache.
	 * @example
	 * let jsonData = await Shaku.assets.loadJson("assets/my_json_data.json");
	 * console.log(jsonData.data);
	 * @param url Asset URL.
	 * @returns promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public loadJson(url: string): Promise<JsonAsset> {
		return this.#_loadAssetType(url, JsonAsset);
	}

	/**
	 * Create a new json asset. If already exist, will reject promise.
	 * @example
	 * let jsonData = await Shaku.assets.createJson("optional_json_data_id", {"foo": "bar"});
	 * // you can now load this asset from anywhere in your code using "optional_json_data_id" as url
	 * @param name Asset name (matched to URLs when using cache). If null, will not add to cache.
	 * @param data Optional starting data.
	 * @returns promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
	 */
	public createJson(name: string, data?: object | string): Promise<JsonAsset> {
		// make sure we have valid data
		if(!data) {
			throw new Error("Missing or invalid data!");
		}

		// create asset and return promise
		return this.#_createAsset(name, JsonAsset, (asset) => {
			asset.create(data);
		});
	}

	/**
	 * Load a binary data asset. If already loaded, will use cache.
	 * @example
	 * let binData = await Shaku.assets.loadBinary("assets/my_bin_data.dat");
	 * console.log(binData.data);
	 * @param url Asset URL.
	 * @returns promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
	 */
	public loadBinary(url: string): Promise<BinaryAsset> {
		return this.#_loadAssetType(url, BinaryAsset);
	}

	/**
	 * Create a new binary asset. If already exist, will reject promise.
	 * @example
	 * let binData = await Shaku.assets.createBinary("optional_bin_data_id", [1,2,3,4]);
	 * // you can now load this asset from anywhere in your code using "optional_bin_data_id" as url
	 * @param name Asset name (matched to URLs when using cache). If null, will not add to cache.
	 * @param data Binary data to set.
	 * @returns promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
	 */
	public createBinary(name: string | null, data: number[] | Uint8Array): Promise<BinaryAsset> {
		// make sure we have valid data
		if(!data) {
			throw new Error("Missing or invalid data!");
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
	public free(url: string): void {
		url = this.#_wrapUrl(url);
		let asset = this._loaded[url];
		if(asset) {
			asset.destroy();
			delete this._loaded[url];
		}
	}

	/**
	 * Free all loaded assets from cache.
	 * @example
	 * Shaku.assets.clearCache();
	 */
	public clearCache(): void {
		for(const key in this._loaded) {
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
	public destroy(): void {
		this.clearCache();
	}
}

// generate a random asset URL, for when creating assets that are outside of cache.
var _nextRandomAssetId: number = 0;
function generateRandomAssetName(): string {
	return "_runtime_asset_" + (_nextRandomAssetId++) + "_";
}

export const assets = new Assets();

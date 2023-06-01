declare const _exports: Assets;
export = _exports;
/**
 * Assets manager class.
 * Used to create, load and cache game assets, which includes textures, audio files, JSON objects, etc.
 * As a rule of thumb, all methods to load or create assets are async and return a promise.
 *
 * To access the Assets manager you use `Shaku.assets`.
 */
declare class Assets extends IManager {
    _loaded: {};
    _waitingAssets: any;
    _failedAssets: any;
    _successfulLoadedAssetsCount: number;
    /**
     * Optional URL root to prepend to all loaded assets URLs.
     * For example, if all your assets are under '/static/assets/', you can set this url as root and omit it when loading assets later.
     */
    root: string;
    /**
     * Optional suffix to add to all loaded assets URLs.
     * You can use this for anti-cache mechanism if you want to reload all assets. For example, you can set this value to "'?dt=' + Date.now()".
     */
    suffix: string;
    /**
     * Get list of assets waiting to be loaded.
     * This list will be reset if you call clearCache().
     * @returns {Array<string>} URLs of assets waiting to be loaded.
     */
    get pendingAssets(): string[];
    /**
     * Get list of assets that failed to load.
     * This list will be reset if you call clearCache().
     * @returns {Array<string>} URLs of assets that had error loading.
     */
    get failedAssets(): string[];
    /**
     * Return a promise that will be resolved only when all pending assets are loaded.
     * If an asset fails, will reject.
     * @example
     * await Shaku.assets.waitForAll();
     * console.log("All assets are loaded!");
     * @returns {Promise} Promise to resolve when all assets are loaded, or reject if there are failed assets.
     */
    waitForAll(): Promise<any>;
    /**
     * @inheritdoc
     * @private
     */
    private setup;
    /**
     * Get asset directly from cache, synchronous and without a Promise.
     * @param {String} url Asset URL or name.
     * @returns {Asset} Asset or null if not loaded.
     */
    getCached(url: string): Asset;
    /**
     * Load a sound asset. If already loaded, will use cache.
     * @example
     * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
     * @param {String} url Asset URL.
     * @returns {Promise<SoundAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadSound(url: string): Promise<SoundAsset>;
    /**
     * Load a texture asset. If already loaded, will use cache.
     * @example
     * let texture = await Shaku.assets.loadTexture("assets/my_texture.png", {generateMipMaps: false});
     * @param {String} url Asset URL.
     * @param {*=} params Optional params dictionary. See TextureAsset.load() for more details.
     * @returns {Promise<TextureAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadTexture(url: string, params?: any | undefined): Promise<TextureAsset>;
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
    createRenderTarget(name: string | null, width: number, height: number, channels?: number | undefined): Promise<TextureAsset>;
    /**
     * Create a texture atlas asset.
     * @param {String | null} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Array<String>} sources List of URLs to load textures from.
     * @param {Number=} maxWidth Optional atlas textures max width.
     * @param {Number=} maxHeight Optional atlas textures max height.
     * @param {Vector2=} extraMargins Optional extra empty pixels to add between textures in atlas.
     * @returns {Promise<TextureAtlas>} Promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    createTextureAtlas(name: string | null, sources: Array<string>, maxWidth?: number | undefined, maxHeight?: number | undefined, extraMargins?: Vector2 | undefined): Promise<TextureAtlas>;
    /**
     * Load a font texture asset. If already loaded, will use cache.
     * @example
     * let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});
     * @param {String} url Asset URL.
     * @param {*} params Optional params dictionary. See FontTextureAsset.load() for more details.
     * @returns {Promise<FontTextureAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadFontTexture(url: string, params: any): Promise<FontTextureAsset>;
    /**
     * Load a MSDF font texture asset. If already loaded, will use cache.
     * @example
     * let fontTexture = await Shaku.assets.loadMsdfFontTexture('DejaVuSansMono.font', {jsonUrl: 'assets/DejaVuSansMono.json', textureUrl: 'assets/DejaVuSansMono.png'});
     * @param {String} url Asset URL.
     * @param {*=} params Optional params dictionary. See MsdfFontTextureAsset.load() for more details.
     * @returns {Promise<MsdfFontTextureAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadMsdfFontTexture(url: string, params?: any | undefined): Promise<MsdfFontTextureAsset>;
    /**
     * Load a json asset. If already loaded, will use cache.
     * @example
     * let jsonData = await Shaku.assets.loadJson('assets/my_json_data.json');
     * console.log(jsonData.data);
     * @param {String} url Asset URL.
     * @returns {Promise<JsonAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadJson(url: string): Promise<JsonAsset>;
    /**
     * Create a new json asset. If already exist, will reject promise.
     * @example
     * let jsonData = await Shaku.assets.createJson('optional_json_data_id', {"foo": "bar"});
     * // you can now load this asset from anywhere in your code using 'optional_json_data_id' as url
     * @param {String} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Object|String} data Optional starting data.
     * @returns {Promise<JsonAsset>} promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
     */
    createJson(name: string, data: any | string): Promise<JsonAsset>;
    /**
     * Load a binary data asset. If already loaded, will use cache.
     * @example
     * let binData = await Shaku.assets.loadBinary('assets/my_bin_data.dat');
     * console.log(binData.data);
     * @param {String} url Asset URL.
     * @returns {Promise<BinaryAsset>} promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.
     */
    loadBinary(url: string): Promise<BinaryAsset>;
    /**
     * Create a new binary asset. If already exist, will reject promise.
     * @example
     * let binData = await Shaku.assets.createBinary('optional_bin_data_id', [1,2,3,4]);
     * // you can now load this asset from anywhere in your code using 'optional_bin_data_id' as url
     * @param {String} name Asset name (matched to URLs when using cache). If null, will not add to cache.
     * @param {Array<Number>|Uint8Array} data Binary data to set.
     * @returns {Promise<BinaryAsset>} promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.
     */
    createBinary(name: string, data: Array<number> | Uint8Array): Promise<BinaryAsset>;
    /**
     * Destroy and free asset from cache.
     * @example
     * Shaku.assets.free("my_asset_url");
     * @param {String} url Asset URL to free.
     */
    free(url: string): void;
    /**
     * Free all loaded assets from cache.
     * @example
     * Shaku.assets.clearCache();
     */
    clearCache(): void;
    #private;
}
import IManager = require("../manager.js");
import Asset = require("./asset.js");
import SoundAsset = require("../assets/sound_asset.js");
import TextureAsset = require("./texture_asset.js");
import Vector2 = require("../utils/vector2.js");
import TextureAtlas = require("./texture_atlas_asset.js");
import FontTextureAsset = require("./font_texture_asset");
import MsdfFontTextureAsset = require("./msdf_font_texture_asset.js");
import JsonAsset = require("./json_asset.js");
import BinaryAsset = require("./binary_asset.js");
//# sourceMappingURL=assets.d.ts.map
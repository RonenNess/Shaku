/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 3155:
/***/ ((module) => {

				/**
				 * Assets base class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\asset.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */



				/**
				 * A loadable asset base class.
				 * All asset types inherit from this.
				 */
				class Asset {
					/**
					 * Create the new asset.
					 * @param {String} url Asset URL / identifier.
					 */
					constructor(url) {
						this._url = url;
						this._waitingCallbacks = [];
					}

					/**
					 * Get if this asset is ready, ie loaded or created.
					 * @returns {Boolean} True if asset finished loading / creating. This doesn't mean its necessarily valid, only that its done loading.
					 */
					get ready() {
						return this._waitingCallbacks === null;
					}

					/**
					 * Register a method to be called when asset is ready.
					 * If asset is already in ready state, will invoke immediately.
					 * @param {Function} callback Callback to invoke when asset is ready.
					 */
					onReady(callback) {
						// already ready
						if (this.valid || this.ready) {
							callback(this);
							return;
						}

						// add to callbacks list
						this._waitingCallbacks.push(callback);
					}

					/**
					 * Return a promise to resolve when ready.
					 * @returns {Promise} Promise to resolve when ready.
					 */
					waitForReady() {
						return new Promise((resolve, reject) => {
							this.onReady(resolve);
						});
					}

					/**
					 * Notify all waiting callbacks that this asset is ready.
					 * @private
					 */
					_notifyReady() {
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
					get url() {
						return this._url;
					}

					/**
					 * Get if this asset is loaded and valid.
					 * @returns {Boolean} True if asset is loaded and valid, false otherwise.
					 */
					get valid() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Load the asset from it's URL.
					 * @param {*} params Optional additional params.
					 * @returns {Promise} Promise to resolve when fully loaded.
					 */
					load(params) {
						throw new Error("Not Implemented!");
					}

					/**
					 * Create the asset from data source.
					 * @param {*} source Data to create asset from.
					 * @param {*} params Optional additional params.
					 * @returns {Promise} Promise to resolve when asset is ready.
					 */
					create(source, params) {
						throw new Error("Not Supported for this asset type.");
					}

					/**
					 * Destroy the asset, freeing any allocated resources in the process.
					 */
					destroy() {
						throw new Error("Not Implemented!");
					}
				}


				// export the asset base class.
				module.exports = Asset;

				/***/
			}),

/***/ 7148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

				const SoundAsset = __webpack_require__(499);
				const IManager = __webpack_require__(9563);
				const BinaryAsset = __webpack_require__(3603);
				const JsonAsset = __webpack_require__(7058);
				const TextureAsset = __webpack_require__(2262);
				const FontTextureAsset = __webpack_require__(167);
				const MsdfFontTextureAsset = __webpack_require__(1252);
				const Asset = __webpack_require__(3155);
				const TextureAtlas = __webpack_require__(2493);
				const TextureAtlasAsset = __webpack_require__(2493);
				const Vector2 = __webpack_require__(2544);
				const _logger = (__webpack_require__(5259).getLogger)('assets');


				// add a 'isXXX' property to all util objects, for faster alternative to 'instanceof' checks.
				// for example this will generate a 'isVector3' that will be true for all Vector3 instances.
				SoundAsset.prototype.isSoundAsset = true;
				BinaryAsset.prototype.isBinaryAsset = true;
				JsonAsset.prototype.isJsonAsset = true;
				TextureAsset.prototype.isTextureAsset = true;
				FontTextureAsset.prototype.isFontTextureAsset = true;
				MsdfFontTextureAsset.prototype.isMsdfFontTextureAsset = true;
				TextureAtlasAsset.prototype.isTextureAtlasAsset = true;

				/**
				 * Assets manager class.
				 * Used to create, load and cache game assets, which includes textures, audio files, JSON objects, etc.
				 * As a rule of thumb, all methods to load or create assets are async and return a promise.
				 *
				 * To access the Assets manager you use `Shaku.assets`.
				 */
				class Assets extends IManager {
					/**
					 * Create the manager.
					 */
					constructor() {
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
					#_wrapUrl(url) {
						if (!url) { return url; }
						return this.root + url + this.suffix;
					}

					/**
					 * Get list of assets waiting to be loaded.
					 * This list will be reset if you call clearCache().
					 * @returns {Array<string>} URLs of assets waiting to be loaded.
					 */
					get pendingAssets() {
						return Array.from(this._waitingAssets);
					}

					/**
					 * Get list of assets that failed to load.
					 * This list will be reset if you call clearCache().
					 * @returns {Array<string>} URLs of assets that had error loading.
					 */
					get failedAssets() {
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
					waitForAll() {
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
					setup() {
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
					startFrame() {
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					endFrame() {
					}

					/**
					 * Get already-loaded asset from cache.
					 * @private
					 * @param {String} url Asset URL.
					 * @param {type} type If provided will make sure asset is of this type. If asset found but have wrong type, will throw exception.
					 * @returns Loaded asset or null if not found.
					 */
					#_getFromCache(url, type) {
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
					async #_loadAndCacheAsset(newAsset, params) {
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
					getCached(url) {
						url = this.#_wrapUrl(url);
						return this._loaded[url] || null;
					}

					/**
					 * Get / load asset of given type, and return a promise to be resolved when ready.
					 * @private
					 */
					#_loadAssetType(url, typeClass, params) {
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
					#_createAsset(name, classType, initMethod, needWait) {
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
					loadSound(url) {
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
					loadTexture(url, params) {
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
					createRenderTarget(name, width, height, channels) {
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
					createTextureAtlas(name, sources, maxWidth, maxHeight, extraMargins) {
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
					loadFontTexture(url, params) {
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
					loadMsdfFontTexture(url, params) {
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
					loadJson(url) {
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
					createJson(name, data) {
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
					loadBinary(url) {
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
					createBinary(name, data) {
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
					free(url) {
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
					clearCache() {
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
					destroy() {
						this.clearCache();
					}
				}

				// generate a random asset URL, for when creating assets that are outside of cache.
				var _nextRandomAssetId = 0;
				function generateRandomAssetName() {
					return "_runtime_asset_" + (_nextRandomAssetId++) + "_";
				}

				// export assets manager
				module.exports = new Assets();

				/***/
			}),

/***/ 3603:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement binary data asset type.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\binary_asset.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Asset = __webpack_require__(3155);


				/**
				 * A loadable binary data asset.
				 * This asset type loads array of bytes from a remote file.
				 */
				class BinaryAsset extends Asset {
					/** @inheritdoc */
					constructor(url) {
						super(url);
						this._data = null;
					}

					/**
					 * Load the binary data from the asset URL.
					 * @returns {Promise} Promise to resolve when fully loaded.
					 */
					load() {
						return new Promise((resolve, reject) => {

							var request = new XMLHttpRequest();
							request.open('GET', this.url, true);
							request.responseType = 'arraybuffer';

							// on load, validate audio content
							request.onload = () => {
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
							};

							// on load error, reject
							request.onerror = (e) => {
								reject(e);
							};

							// initiate request
							request.send();
						});
					}

					/**
					 * Create the binary data asset from array or Uint8Array.
					 * @param {Array<Number>|Uint8Array} source Data to create asset from.
					 * @returns {Promise} Promise to resolve when asset is ready.
					 */
					create(source) {
						return new Promise((resolve, reject) => {
							if (Array.isArray(source)) { source = new Uint8Array(source); }
							if (!(source instanceof Uint8Array)) { return reject("Binary asset source must be of type 'Uint8Array'!"); }
							this._data = source;
							this._notifyReady();
							resolve();
						});
					}

					/** @inheritdoc */
					get valid() {
						return Boolean(this._data);
					}

					/** @inheritdoc */
					destroy() {
						this._data = null;
					}

					/**
					 * Get binary data.
					 * @returns {Uint8Array} Data as bytes array.
					 */
					get data() {
						return this._data;
					}

					/**
					 * Convert and return data as string.
					 * @returns {String} Data converted to string.
					 */
					string() {
						return (new TextDecoder()).decode(this._data);
					}
				}


				// export the asset type.
				module.exports = BinaryAsset;

				/***/
			}),

/***/ 167:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a font texture asset type.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\font_texture_asset.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Asset = __webpack_require__(3155);
				const Vector2 = __webpack_require__(2544);
				const Rectangle = __webpack_require__(4731);
				const TextureAsset = __webpack_require__(2262);


				/**
				 * A font texture asset, dynamically generated from loaded font and canvas.
				 * This asset type creates an atlas of all the font's characters as textures, so we can later render them as sprites.
				 */
				class FontTextureAsset extends Asset {
					/** @inheritdoc */
					constructor(url) {
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
					get lineHeight() {
						return this._lineHeight;
					}

					/**
					 * Get font name.
					 */
					get fontName() {
						return this._fontName;
					}

					/**
					 * Get font size.
					 */
					get fontSize() {
						return this._fontSize;
					}

					/**
					 * Get placeholder character.
					 */
					get placeholderCharacter() {
						return this._placeholderChar;
					}

					/**
					 * Get the texture.
					 */
					get texture() {
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
					load(params) {
						return new Promise(async (resolve, reject) => {

							if (!params || !params.fontName) {
								return reject("When loading font texture you must provide params with a 'fontName' value!");
							}

							// set default missing char placeholder + store it
							this._placeholderChar = (params.missingCharPlaceholder || '?')[0];

							// set smoothing mode
							let smooth = params.smoothFont === undefined ? true : params.smoothFont;

							// set extra margins
							let extraPadding = params.extraPadding || { x: 0, y: 0 };

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
							let margin = { x: 10, y: 5 };

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
							ctx.textBaseline = "bottom";

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
								const offsetAdjustment = params.sourceRectOffsetAdjustment || { x: 0, y: 0 };
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
									if (data[i + 3] > 0 && (data[i + 3] < 255 || data[i] < 255 || data[i + 1] < 255 || data[i + 2] < 255)) {
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

					/**
					 * Get texture width.
					 * @returns {Number} Texture width.
					 */
					get width() {
						return this._texture._width;
					}

					/**
					 * Get texture height.
					 * @returns {Number} Texture height.
					 */
					get height() {
						return this._texture._height;
					}

					/**
					 * Get texture size as a vector.
					 * @returns {Vector2} Texture size.
					 */
					getSize() {
						return this._texture.getSize();
					}

					/** @inheritdoc */
					get valid() {
						return Boolean(this._texture);
					}

					/**
					 * Get the source rectangle for a given character in texture.
					 * @param {Character} character Character to get source rect for.
					 * @returns {Rectangle} Source rectangle for character.
					 */
					getSourceRect(character) {
						return this._sourceRects[character] || this._sourceRects[this.placeholderCharacter];
					}

					/**
					 * When drawing the character, get the offset to add to the cursor.
					 * @param {Character} character Character to get the offset for.
					 * @returns {Vector2} Offset to add to the cursor before drawing the character.
					 */
					getPositionOffset(character) {
						return Vector2.zero();
					}

					/**
					 * Get how much to advance the cursor when drawing this character.
					 * @param {Character} character Character to get the advance for.
					 * @returns {Number} Distance to move the cursor after drawing the character.
					 */
					getXAdvance(character) {
						return this.getSourceRect(character).width;
					}

					/** @inheritdoc */
					destroy() {
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
				function makePowerTwo(val) {
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
				function measureTextHeight(fontFamily, fontSize, char, extraHeight) {
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
				function measureTextWidth(fontFamily, fontSize, char, extraWidth) {
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

				/***/
			}),

/***/ 7817:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Just an alias to main manager so we can require() this folder as a package.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				module.exports = __webpack_require__(7148);

				/***/
			}),

/***/ 7058:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement json asset type.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\json_asset.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Asset = __webpack_require__(3155);


				/**
				 * A loadable json asset.
				 * This asset type loads JSON from a remote file.
				 */
				class JsonAsset extends Asset {
					/** @inheritdoc */
					constructor(url) {
						super(url);
						this._data = null;
					}

					/**
					 * Load the JSON data from the asset URL.
					 * @returns {Promise} Promise to resolve when fully loaded.
					 */
					load() {
						return new Promise((resolve, reject) => {

							var request = new XMLHttpRequest();
							request.open('GET', this.url, true);
							request.responseType = 'json';

							// on load, validate audio content
							request.onload = () => {
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
							};

							// on load error, reject
							request.onerror = (e) => {
								reject(e);
							};

							// initiate request
							request.send();
						});
					}

					/**
					 * Create the JSON data asset from object or string.
					 * @param {Object|String} source Data to create asset from.
					 * @returns {Promise} Promise to resolve when asset is ready.
					 */
					create(source) {
						return new Promise((resolve, reject) => {

							// make sure data is a valid json + clone it
							try {
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
							catch (e) {
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
					get data() {
						return this._data;
					}

					/** @inheritdoc */
					get valid() {
						return Boolean(this._data);
					}

					/** @inheritdoc */
					destroy() {
						this._data = null;
					}
				}


				// export the asset type.
				module.exports = JsonAsset;

				/***/
			}),

/***/ 1252:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

				const Vector2 = __webpack_require__(2544);
				const Rectangle = __webpack_require__(4731);
				const TextureAsset = __webpack_require__(2262);
				const FontTextureAsset = __webpack_require__(167);
				const JsonAsset = __webpack_require__(7058);
				const TextureFilterModes = __webpack_require__(5387);


				/**
				 * A MSDF font texture asset, from a pregenerated msdf texture atlas (from msdf-bmfont-xml, for example).
				 * This asset uses a signed distance field atlas to render characters as sprites at high res.
				 */
				class MsdfFontTextureAsset extends FontTextureAsset {
					/** @inheritdoc */
					constructor(url) {
						super(url);
						this._positionOffsets = null;
						this._xAdvances = null;
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
					load(params) {
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

								let sourceRect = new Rectangle(charData.x, charData.y, charData.width, charData.height);
								this._sourceRects[currChar] = sourceRect;
								this._positionOffsets[currChar] = new Vector2(
									charData.xoffset,
									charData.yoffset
								);
								this._xAdvances[currChar] = charData.xadvance;
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
					get width() {
						return this._texture._width;
					}

					/**
					 * Get texture height.
					 * @returns {Number} Texture height.
					 */
					get height() {
						return this._texture._height;
					}

					/**
					 * Get texture size as a vector.
					 * @returns {Vector2} Texture size.
					 */
					getSize() {
						return this._texture.getSize();
					}

					/** @inheritdoc */
					getPositionOffset(character) {
						return this._positionOffsets[character] || this._positionOffsets[this.placeholderCharacter];
					}

					/** @inheritdoc */
					getXAdvance(character) {
						return this._xAdvances[character] || this._xAdvances[this.placeholderCharacter];
					}

					/** @inheritdoc */
					destroy() {
						super.destroy();
						this._positionOffsets = null;
						this._xAdvances = null;
						this._kernings = null;
					}
				}

				// export the asset type.
				module.exports = MsdfFontTextureAsset;

				/***/
			}),

/***/ 499:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement sound asset type.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\sound_asset.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Asset = __webpack_require__(3155);


				/**
				 * A loadable sound asset.
				 * This is the asset type you use to play sounds.
				 */
				class SoundAsset extends Asset {
					/** @inheritdoc */
					constructor(url) {
						super(url);
						this._valid = false;
					}


					/**
					 * Load the sound asset from its URL.
					 * Note that loading sounds isn't actually necessary to play sounds, this method merely pre-load the asset (so first time we play
					 * the sound would be immediate and not delayed) and validate the data is valid.
					 * @returns {Promise} Promise to resolve when fully loaded.
					 */
					load() {
						// for audio files we force preload and validation of the audio file.
						// note: we can't use the Audio object as it won't work without page interaction.
						return new Promise((resolve, reject) => {

							// create request to load audio file
							var request = new XMLHttpRequest();
							request.open('GET', this.url, true);
							request.responseType = 'arraybuffer';

							// on load, validate audio content
							request.onload = () => {
								this._valid = true;
								this._notifyReady();
								resolve();
							};

							// on load error, reject
							request.onerror = (e) => {
								reject(e);
							};

							// initiate request
							request.send();
						});
					}

					/** @inheritdoc */
					get valid() {
						return this._valid;
					}

					/** @inheritdoc */
					destroy() {
						this._valid = false;
					}
				}


				// export the asset type.
				module.exports = SoundAsset;

				/***/
			}),

/***/ 2262:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement texture asset type.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\texture_asset.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Color = __webpack_require__(9327);
				const TextureAssetBase = __webpack_require__(4397);
				const _logger = (__webpack_require__(5259).getLogger)('assets');

				// the webgl context to use
				var gl = null;


				/**
				 * A loadable texture asset.
				 * This asset type loads an image from URL or source, and turn it into a texture.
				 */
				class TextureAsset extends TextureAssetBase {
					/** @inheritdoc */
					constructor(url) {
						super(url);
						this._image = null;
						this._width = 0;
						this._height = 0;
						this._texture = null;
						this._ctxForPixelData = null;
					}

					/**
					 * Set the WebGL context.
					 * @private
					 */
					static _setWebGl(_gl) {
						gl = _gl;
					}

					/**
					 * Load the texture from it's image URL.
					 * @param {*} params Optional additional params. Possible values are:
					 *                      - generateMipMaps (default=false): if true, will generate mipmaps for this texture.
					 *                      - crossOrigin (default=undefined): if set, will set the crossOrigin property with this value.
					 *                      - flipY (default=false): if true, will flip texture on Y axis.
					 *                      - premultiplyAlpha (default=false): if true, will load texture with premultiply alpha flag set.
					 * @returns {Promise} Promise to resolve when fully loaded.
					 */
					load(params) {
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
							image.onload = async () => {
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
							};

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
					createRenderTarget(width, height, channels) {
						// reset flags
						gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
						gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

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
					fromImage(image, params) {
						if (image.width === 0) {
							throw new Error("Image to build texture from must be loaded and have valid size!");
						}

						if (this.valid) {
							throw new Error("Texture asset is already initialized!");
						}

						// default params
						params = params || {};

						// set flip Y argument
						gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, Boolean(params.flipY));

						// set premultiply alpha params
						gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, Boolean(params.premultiplyAlpha));

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
					create(source, params) {
						return new Promise(async (resolve, reject) => {

							if (typeof source === "string") {
								let img = new Image();
								img.onload = () => {
									this.fromImage(source, params);
									this._notifyReady();
									resolve();
								};
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

					/** @inheritdoc */
					get image() {
						return this._image;
					}

					/** @inheritdoc */
					get width() {
						return this._width;
					}

					/** @inheritdoc */
					get height() {
						return this._height;
					}

					/** @inheritdoc */
					get _glTexture() {
						return this._texture;
					}

					/**
					 * Get pixel color from image.
					 * Note: this method is quite slow, if you need to perform multiple queries consider using `getPixelsData()` once to get all pixels data instead.
					 * @param {Number} x Pixel X value.
					 * @param {Number} y Pixel Y value.
					 * @returns {Color} Pixel color.
					 */
					getPixel(x, y) {
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

					/**
					 * Get a 2D array with pixel colors.
					 * @param {Number=} x Offset X in texture to get. Defaults to 0.
					 * @param {Number=} y Offset Y in texture to get. Defaults to 0.
					 * @param {Number=} width How many pixels to get on X axis. Defaults to texture width - x.
					 * @param {Number=} height How many pixels to get on Y axis. Defaults to texture height - y.
					 * @returns {Array<Array<Color>>} A 2D array with all texture pixel colors.
					 */
					getPixelsData(x, y, width, height) {
						if (!this._image) {
							throw new Error("'getPixel()' only works on textures loaded from image!");
						}

						// default x, y
						x = x || 0;
						y = y || 0;

						// default width / height
						width = width || (this.width - x);
						height = height || (this.height - y);

						// build internal canvas and context to get pixel data
						if (!this._ctxForPixelData) {
							let canvas = document.createElement('canvas');
							canvas.width = width;
							canvas.height = height;
							this._ctxForPixelData = canvas.getContext('2d');
						}

						// get pixel data
						let ctx = this._ctxForPixelData;
						ctx.drawImage(this._image, x, y, width, height, 0, 0, width, height);
						let pixelData = ctx.getImageData(x, y, width, height).data;

						//  convert to colors
						let ret = [];
						for (let i = 0; i < width; ++i) {
							let currRow = [];
							ret.push(currRow);
							for (let j = 0; j < height; ++j) {
								currRow.push(Color.fromBytesArray(pixelData, i * 4 + (j * 4 * width)));
							}
						}
						return ret;
					}

					/** @inheritdoc */
					get valid() {
						return Boolean(this._texture);
					}

					/** @inheritdoc */
					destroy() {
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

				/***/
			}),

/***/ 4397:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

				const Asset = __webpack_require__(3155);
				const { TextureFilterMode } = __webpack_require__(5387);
				const { TextureWrapMode } = __webpack_require__(2464);
				const Vector2 = __webpack_require__(2544);


				/**
				 * Base type for all texture asset types.
				 */
				class TextureAssetBase extends Asset {
					/** @inheritdoc */
					constructor(url) {
						super(url);
						this._filter = null;
						this._wrapMode = null;
					}

					/**
					 * Get texture magnifying filter, or null to use default.
					 * @see Shaku.gfx.TextureFilterModes
					 */
					get filter() {
						return this._filter;
					}

					/**
					 * Set texture magnifying filter.
					 * @see Shaku.gfx.TextureFilterModes
					 * @param {TextureFilterMode} value Filter mode to use or null to use default.
					 */
					set filter(value) {
						this._filter = value;
					}

					/**
					 * Get texture wrapping mode, or null to use default.
					 * @see Shaku.gfx.TextureWrapModes
					 */
					get wrapMode() {
						return this._wrapMode;
					}

					/**
					 * Set texture wrapping mode.
					 * @see Shaku.gfx.TextureWrapModes
					 * @param {TextureWrapMode} value Wrapping mode to use or null to use default.
					 */
					set wrapMode(value) {
						this._wrapMode = value;
					}

					/**
					 * Get raw image.
					 * @returns {Image} Image instance.
					 */
					get image() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Get texture width.
					 * @returns {Number} Texture width.
					 */
					get width() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Get texture height.
					 * @returns {Number} Texture height.
					 */
					get height() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Get texture size as a vector.
					 * @returns {Vector2} Texture size.
					 */
					getSize() {
						return new Vector2(this.width, this.height);
					}

					/**
					 * Get texture instance for WebGL.
					 */
					get _glTexture() {
						throw new Error("Not Implemented!");
					}
				}


				// export the asset type.
				module.exports = TextureAssetBase;

				/***/
			}),

/***/ 2493:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

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

				const Utils = __webpack_require__(3624);
				const { Rectangle } = __webpack_require__(3624);
				const Vector2 = __webpack_require__(2544);
				const Asset = __webpack_require__(3155);
				const TextureAsset = __webpack_require__(2262);
				const TextureInAtlasAsset = __webpack_require__(8609);
				const _logger = (__webpack_require__(5259).getLogger)('assets');

				// the webgl context to use
				var gl = null;


				/**
				 * A texture atlas we can build at runtime to combine together multiple textures.
				 */
				class TextureAtlasAsset extends Asset {
					/** @inheritdoc */
					constructor(url) {
						super(url);
						this.__textures = [];
						this.__sources = {};
					}

					/**
					 * Set the WebGL context.
					 * @private
					 */
					static _setWebGl(_gl) {
						gl = _gl;
					}

					/**
					 * Build the texture atlas.
					 * @private
					 * @param {Array<string>|Array<Image>} sources Source URLs or images to load into texture. If array of Images, should also contain an '__origin_url' property under them for asset key.
					 * @param {Number=} maxWidth Optional texture atlas width limit.
					 * @param {Number=} maxHeight Optional texture atlas height limit.
					 * @param {Vector2=} extraMargins Extra pixels to add between textures.
					 * @returns {Promise} Promise to resolve when done.
					 */
					async _build(sources, maxWidth, maxHeight, extraMargins) {
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
									let originUrl = imageData.source.__origin_url;
									let relativeUrl = url.substr(location.origin.length);
									let internalUrl = atlasTexture.url + '_' + (textureInAtlasIndex++).toString() + '_' + url.replaceAll('/', '_').replaceAll(':', '');
									let sourceRectangle = new Rectangle(imageData.x, imageData.y, imageData.width, imageData.height);
									let textureInAtlas = new TextureInAtlasAsset(internalUrl, atlasTexture, sourceRectangle, this);
									this.__sources[url] = this.__sources[relativeUrl] = this.__sources[relativeUrl.substr(1)] = textureInAtlas;
									if (originUrl) {
										this.__sources[originUrl] = this.__sources[url];
									}
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
					get textures() {
						return this.__textures.slice(0);
					}

					/**
					 * Get texture asset and source rectangle for a desired image URL.
					 * @param {String} url URL to fetch texture and source from. Can be full URL, relative URL, or absolute URL starting from /.
					 * @returns {TextureInAtlasAsset} Texture in atlas asset, or null if not found.
					 */
					getTexture(url) {
						return this.__sources[url] || null;
					}

					/** @inheritdoc */
					get valid() {
						return Boolean(this.__textures.length);
					}

					/** @inheritdoc */
					destroy() {
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
				function arrangeTextures(sourceImages, maxAtlasWidth, maxAtlasHeight, extraMargins) {
					// default max width and height
					maxAtlasWidth = maxAtlasWidth || gl.MAX_TEXTURE_SIZE;
					maxAtlasHeight = maxAtlasHeight || gl.MAX_TEXTURE_SIZE;

					// use the sorter algorithm
					let result = Utils.ItemsSorter.arrangeRectangles(sourceImages, (width) => {

						// make width a power of 2
						let power = 1;
						while (power < width) {
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
				function loadImage(path) {
					return new Promise((resolve, reject) => {
						const img = new Image();
						img.crossOrigin = 'Anonymous'; // to avoid CORS if used with Canvas
						img.src = path;
						img.__origin_url = path;
						img.onload = () => {
							resolve(img);
						};
						img.onerror = e => {
							reject(e);
						};
					});
				}


				/**
				 * Convert list of sources that are either Image instances or URL strings to fully loaded Image instances.
				 * Wait for image loading if needed.
				 */
				async function loadAllSources(sources) {
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

				/***/
			}),

/***/ 8609:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement texture asset type.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\assets\texture_in_atlas_asset.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const TextureAssetBase = __webpack_require__(4397);
				const Rectangle = __webpack_require__(4731);


				/**
				 * A texture that is part of a texture atlas.
				 * Stores a texture that was generated by the texture atlas + the source rectangle in texture for this segment.
				 */
				class TextureInAtlasAsset extends TextureAssetBase {
					/** @inheritdoc */
					constructor(url, texture, sourceRect, atlas) {
						super(url);
						this._texture = texture;
						this._sourceRect = sourceRect;
						this._atlas = atlas;
					}

					/**
					 * Return the source rectangle in texture atlas.
					 * @returns {Rectangle} Source rectangle.
					 */
					get sourceRectangle() {
						return this._sourceRect;
					}

					/**
					 * Return the source rectangle in texture atlas, in normalized 0.0-1.0 values.
					 * @returns {Rectangle} Source rectangle.
					 */
					get sourceRectangleNormalized() {
						if (!this._sourceRectNormalized) {
							this._sourceRectNormalized = new Rectangle(
								this._sourceRect.x / this.width,
								this._sourceRect.y / this.height,
								this._sourceRect.width / this.width,
								this._sourceRect.height / this.height
							);
						}
						return this._sourceRectNormalized;
					}

					/**
					 * Return the texture asset of this atlas texture.
					 * @returns {TextureAsset} Texture asset.
					 */
					get texture() {
						return this._texture;
					}

					/**
					 * Return the texture atlas class.
					 * @returns {TextureAtlasAsset} Parent atlas.
					 */
					get atlas() {
						return this._atlas;
					}

					/** @inheritdoc */
					get image() {
						return this.texture.image;
					}

					/** @inheritdoc */
					get width() {
						return this.texture.width;
					}

					/** @inheritdoc */
					get height() {
						return this.texture.height;
					}

					/** @inheritdoc */
					get _glTexture() {
						return this.texture._glTexture;
					}

					/** @inheritdoc */
					get valid() {
						return Boolean(this.texture.valid);
					}

					/** @inheritdoc */
					destroy() {
					}
				}


				// export the asset type.
				module.exports = TextureInAtlasAsset;

				/***/
			}),

/***/ 4843:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the collision manager.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\collision.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const IManager = __webpack_require__(9563);
				const Vector2 = __webpack_require__(2544);
				const CollisionWorld = __webpack_require__(2433);
				const CollisionResolver = __webpack_require__(5528);
				const CircleShape = __webpack_require__(9481);
				const PointShape = __webpack_require__(1282);
				const RectangleShape = __webpack_require__(4153);
				const ResolverImp = __webpack_require__(1596);
				const LinesShape = __webpack_require__(6527);
				const TilemapShape = __webpack_require__(6601);
				const _logger = (__webpack_require__(5259).getLogger)('collision');


				/**
				 * Collision is the collision manager.
				 * It provides basic 2d collision detection functionality.
				 * Note: this is *not* a physics engine, its only for detection and objects picking.
				 *
				 * To access the Collision manager you use `Shaku.collision`.
				 */
				class Collision extends IManager {
					/**
					 * Create the manager.
					 */
					constructor() {
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
					setup() {
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
					createWorld(gridCellSize) {
						return new CollisionWorld(this.resolver, gridCellSize);
					}

					/**
					 * Get the collision reactanle shape class.
					 */
					get RectangleShape() {
						return RectangleShape;
					}

					/**
					 * Get the collision point shape class.
					 */
					get PointShape() {
						return PointShape;
					}

					/**
					 * Get the collision circle shape class.
					 */
					get CircleShape() {
						return CircleShape;
					}

					/**
					 * Get the collision lines shape class.
					 */
					get LinesShape() {
						return LinesShape;
					}

					/**
					 * Get the tilemap collision shape class.
					 */
					get TilemapShape() {
						return TilemapShape;
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					startFrame() {
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					endFrame() {
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					destroy() {
					}
				}

				// export main object
				module.exports = new Collision();

				/***/
			}),

/***/ 2433:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the collision manager.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\collision_world.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Color = __webpack_require__(9327);
				const Vector2 = __webpack_require__(2544);
				const Circle = __webpack_require__(9668);
				const CollisionTestResult = __webpack_require__(6323);
				const CollisionShape = __webpack_require__(9135);
				const gfx = __webpack_require__(7565);
				const Rectangle = __webpack_require__(4731);
				const CollisionResolver = __webpack_require__(5528);
				const PointShape = __webpack_require__(1282);
				const CircleShape = __webpack_require__(9481);
				const ShapesBatch = __webpack_require__(1772);
				const _logger = (__webpack_require__(5259).getLogger)('collision');


				/**
				 * A collision world is a set of collision shapes that interact with each other.
				 * You can use different collision worlds to represent different levels or different parts of your game world.
				 */
				class CollisionWorld {
					/**
					 * Create the collision world.
					 * @param {CollisionResolver} resolver Collision resolver to use for this world.
					 * @param {Number|Vector2} gridCellSize For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size.
					 */
					constructor(resolver, gridCellSize) {
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
					resetStats() {
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
						};
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
					get stats() {
						return this._stats;
					}

					/**
					 * Do collision world updates, if we have any.
					 * @private
					 */
					#_performUpdates() {
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
								this.#_updateShape(shape);
							}
							this._shapesToUpdate.clear();
						}
					}

					/**
					 * Get or create cell.
					 * @private
					 */
					#_getCell(i, j) {
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
					#_updateShape(shape) {
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
						if (shape._worldRange) {
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
									let currSet = this.#_getCell(i, j);
									currSet.add(shape);
								}
							}
						}
						// first-time adding to grid
						else {
							this._stats.addedShapes++;
							for (let i = minx; i < maxx; ++i) {
								for (let j = miny; j < maxy; ++j) {
									let currSet = this.#_getCell(i, j);
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
					_queueUpdate(shape) {
						this._shapesToUpdate.add(shape);
					}

					/**
					 * Iterate all shapes in world.
					 * @param {Function} callback Callback to invoke on all shapes. Return false to break iteration.
					 */
					iterateShapes(callback) {
						for (let key in this._grid) {
							let cell = this._grid[key];
							if (cell) {
								for (let shape of cell) {
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
					addShape(shape) {
						// add shape
						shape._setParent(this);

						// add shape to grid
						this.#_updateShape(shape);

						// do general updates
						this.#_performUpdates();
					}

					/**
					 * Remove a collision shape from this world.
					 * @param {CollisionShape} shape Shape to remove.
					 */
					removeShape(shape) {
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
						this.#_performUpdates();
					}

					/**
					 * Iterate shapes that match broad phase test.
					 * @private
					 * @param {CollisionShape} shape Shape to test.
					 * @param {Function} handler Method to run on all shapes in phase. Return true to continue iteration, false to break.
					 * @param {Number} mask Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit.
					 * @param {Function} predicate Optional filter to run on any shape we're about to test collision with.
					 */
					#_iterateBroadPhase(shape, handler, mask, predicate) {
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
					testCollision(sourceShape, sortByDistance, mask, predicate) {
						// do updates before check
						this.#_performUpdates();

						// result to return
						var result = null;

						// hard case - single result, sorted by distance
						if (sortByDistance) {
							// build options array
							var options = [];
							this.#_iterateBroadPhase(sourceShape, (other) => {
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
						else {
							// iterate possible shapes and test collision
							var handlers = this.resolver.getHandlers(sourceShape);
							this.#_iterateBroadPhase(sourceShape, (other) => {

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
					testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor) {
						// do updates before check
						this.#_performUpdates();

						// get collisions
						var ret = [];
						var handlers = this.resolver.getHandlers(sourceShape);
						this.#_iterateBroadPhase(sourceShape, (other) => {
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
					pick(position, radius, sortByDistance, mask, predicate) {
						let shape = ((radius || 0) <= 1) ? new PointShape(position) : new CircleShape(new Circle(position, radius));
						let ret = this.testCollisionMany(shape, sortByDistance, mask, predicate);
						return ret.map(x => x.second);
					}

					/**
					 * Set the shapes batch to use for debug-drawing this collision world.
					 * @param {ShapesBatch} batch Batch to use for debug draw.
					 */
					setDebugDrawBatch(batch) {
						this.__debugDrawBatch = batch;
					}

					/**
					 * Return the currently set debug draw batch, or create a new one if needed.
					 * @returns {ShapesBatch} Shapes batch instance used to debug-draw collision world.
					 */
					getOrCreateDebugDrawBatch() {
						if (!this.__debugDrawBatch) {
							this.setDebugDrawBatch(new gfx.ShapesBatch());
						}
						return this.__debugDrawBatch;
					}

					/**
					 * Debug-draw the current collision world.
					 * @param {Color} gridColor Optional grid color (default to black).
					 * @param {Color} gridHighlitColor Optional grid color for cells with shapes in them (default to red).
					 * @param {Number} opacity Optional opacity factor (default to 0.5).
					 * @param {Camera} camera Optional camera for offset and viewport.
					 */
					debugDraw(gridColor, gridHighlitColor, opacity, camera) {
						// if we don't have a debug-draw batch, create it
						let shapesBatch = this.getOrCreateDebugDrawBatch();

						// begin drawing
						shapesBatch.begin();

						// do updates before check
						this.#_performUpdates();

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
						gridColor.a *= opacity * 0.75;
						gridHighlitColor.a *= opacity * 0.75;

						// all shapes we rendered
						let renderedShapes = new Set();

						// get visible grid cells
						let bb = camera ? camera.getRegion() : gfx._internal.getRenderingRegionInternal(false);
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
								let cellRect1 = new Rectangle(i * this._gridCellSize.x, j * this._gridCellSize.y, this._gridCellSize.x, 2);
								let cellRect2 = new Rectangle(i * this._gridCellSize.x, j * this._gridCellSize.y, 2, this._gridCellSize.y);
								shapesBatch.drawRectangle(cellRect1, color);
								shapesBatch.drawRectangle(cellRect2, color);

								// draw shapes in grid
								if (cell) {
									for (let shape of cell) {
										if (renderedShapes.has(shape)) {
											continue;
										}
										renderedShapes.add(shape);
										shape.debugDraw(opacity, shapesBatch);
									}
								}
							}
						}

						// finish drawing
						shapesBatch.end();
					}
				}

				/**
				 * Sort array by distance from source shape.
				 * @private
				 */
				function sortByDistanceShapes(sourceShape, options) {
					let sourceCenter = sourceShape.getCenter();
					options.sort((a, b) =>
						(a.getCenter().distanceTo(sourceCenter) - a._getRadius()) -
						(b.getCenter().distanceTo(sourceCenter) - b._getRadius()));
				}

				/**
				 * Sort array by distance from source shape.
				 * @private
				 */
				function sortByDistanceResults(sourceShape, options) {
					let sourceCenter = sourceShape.getCenter();
					options.sort((a, b) =>
						(a.second.getCenter().distanceTo(sourceCenter) - a.second._getRadius()) -
						(b.second.getCenter().distanceTo(sourceCenter) - b.second._getRadius()));
				}

				// export collision world
				module.exports = CollisionWorld;

				/***/
			}),

/***/ 6740:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Just an alias to main manager so we can require() this folder as a package.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				module.exports = __webpack_require__(4843);

				/***/
			}),

/***/ 5528:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the collision resolver class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\resolver.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vector2 = __webpack_require__(2544);
				const CollisionTestResult = __webpack_require__(6323);
				const CollisionShape = __webpack_require__(9135);
				const _logger = (__webpack_require__(5259).getLogger)('collision');


				/**
				 * The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.
				 */
				class CollisionResolver {
					/**
					 * Create the resolver.
					 */
					constructor() {
						this._handlers = {};
					}

					/**
					 * Initialize the resolver.
					 * @private
					 */
					_init() {

					}

					/**
					 * Set the method used to test collision between two shapes.
					 * Note: you don't need to register the same handler twice for reverse order, its done automatically inside.
					 * @param {String} firstShapeId The shape identifier the handler recieves as first argument.
					 * @param {String} secondShapeId The shape identifier the handler recieves as second argument.
					 * @param {Function} handler Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision.
					 */
					setHandler(firstShapeId, secondShapeId, handler) {
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
					test(first, second) {
						let handler = this.#_getCollisionMethod(first, second);
						return this.testWithHandler(first, second, handler);
					}

					/**
					 * Check a collision between two shapes.
					 * @param {CollisionShape} first First collision shape to test.
					 * @param {CollisionShape} second Second collision shape to test.
					 * @param {Function} handler Method to test collision between the shapes.
					 * @returns {CollisionTestResult} collision detection result or null if they don't collide.
					 */
					testWithHandler(first, second, handler) {
						// missing handler?
						if (!handler) {
							_logger.warn(`Missing collision handler for shapes '${first.shapeId}' and '${second.shapeId}'.`);
							return null;
						}

						// test collision
						let result = handler(first, second);

						// collision
						if (result) {
							let position = (result.isVector2) ? result : null;
							return new CollisionTestResult(position, first, second);
						}

						// no collision
						return null;
					}

					/**
					 * Get handlers dictionary for a given shape.
					 */
					getHandlers(shape) {
						return this._handlers[shape.shapeId];
					}

					/**
					 * Get the collision detection method for two given shapes.
					 * @private
					 * @param {CollisionShape} first First collision shape to test.
					 * @param {CollisionShape} second Second collision shape to test.
					 * @returns {Function} collision detection method or null if not found.
					 */
					#_getCollisionMethod(first, second) {
						let handlersFrom = this._handlers[first.shapeId];
						if (handlersFrom) {
							return handlersFrom[second.shapeId] || null;
						}
						return null;
					}
				}

				// export the collision resolver
				module.exports = CollisionResolver;

				/***/
			}),

/***/ 1596:
/***/ ((module) => {

				/**
				 * All default collision detection implementations.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\resolvers_imp.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */



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
				};


				// export the collisions implementation
				module.exports = CollisionsImp;

				/***/
			}),

/***/ 6323:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * An object to store collision detection result.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\result.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vector2 = __webpack_require__(2544);
				const CollisionShape = __webpack_require__(9135);


				/**
				 * Collision detection result.
				 */
				class CollisionTestResult {
					/**
					 * Create the collision result.
					 * @param {Vector2} position Optional collision position.
					 * @param {CollisionShape} first First shape in the collision check.
					 * @param {CollisionShape} second Second shape in the collision check.
					 */
					constructor(position, first, second) {
						/**
						 * Collision position, only relevant when there's a single touching point.
						 * For shapes with multiple touching points, this will be null.
						 * @name CollisionTestResult#position
						 * @type {Vector2}
						 */
						this.position = position;

						/**
						 * First collided shape.
						 * @name CollisionTestResult#first
						 * @type {CollisionShape}
						 */
						this.first = first;

						/**
						 * Second collided shape.
						 * @name CollisionTestResult#second
						 * @type {CollisionShape}
						 */
						this.second = second;
					}
				}

				// export collision shape class
				module.exports = CollisionTestResult;

				/***/
			}),

/***/ 9481:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement collision circle.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\shapes\circle.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const CollisionShape = __webpack_require__(9135);
				const gfx = __webpack_require__(7565);
				const Circle = __webpack_require__(9668);
				const Rectangle = __webpack_require__(4731);


				/**
				 * Collision circle class.
				 */
				class CircleShape extends CollisionShape {
					/**
					 * Create the collision shape.
					 * @param {Circle} circle the circle shape.
					 */
					constructor(circle) {
						super();
						this.setShape(circle);
					}

					/**
					 * @inheritdoc
					 */
					get shapeId() {
						return "circle";
					}

					/**
					 * Set this collision shape from circle.
					 * @param {Circle} circle Circle shape.
					 */
					setShape(circle) {
						this._circle = circle;
						this._position = circle.center;
						this._boundingBox = new Rectangle(circle.center.x - circle.radius, circle.center.y - circle.radius, circle.radius * 2, circle.radius * 2);
						this._shapeChanged();
					}

					/**
					 * @inheritdoc
					 */
					_getRadius() {
						return this._circle.radius;
					}

					/**
					 * @inheritdoc
					 */
					getCenter() {
						return this._position.clone();
					}

					/**
					 * @inheritdoc
					 */
					_getBoundingBox() {
						return this._boundingBox;
					}

					/**
					 * @inheritdoc
					 */
					debugDraw(opacity, shapesBatch) {
						if (opacity === undefined) { opacity = 1; }
						let color = this._getDebugColor();
						color.a *= opacity;
						shapesBatch = this._getDebugDrawBatch(shapesBatch);
						let needToBegin = !shapesBatch.isDrawing;
						if (needToBegin) { shapesBatch.begin(); }
						shapesBatch.drawCircle(this._circle, color, 14);
						if (needToBegin) { shapesBatch.end(); }
					}
				}

				// export collision shape class
				module.exports = CircleShape;

				/***/
			}),

/***/ 6527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement collision lines.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\shapes\lines.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const CollisionShape = __webpack_require__(9135);
				const gfx = __webpack_require__(7565);
				const Line = __webpack_require__(1708);
				const Rectangle = __webpack_require__(4731);
				const Circle = __webpack_require__(9668);


				/**
				 * Collision lines class.
				 * This shape is made of one line or more.
				 */
				class LinesShape extends CollisionShape {
					/**
					 * Create the collision shape.
					 * @param {Array<Line>|Line} lines Starting line / lines.
					 */
					constructor(lines) {
						super();
						this._lines = [];
						this.addLines(lines);
					}

					/**
					 * @inheritdoc
					 */
					get shapeId() {
						return "lines";
					}

					/**
					 * Add line or lines to this collision shape.
					 * @param {Array<Line>|Line} lines Line / lines to add.
					 */
					addLines(lines) {
						// convert to array
						if (!Array.isArray(lines)) {
							lines = [lines];
						}

						// add lines
						for (let i = 0; i < lines.length; ++i) {
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
					setLines(lines) {
						this._lines = [];
						this.addLines(lines);
					}

					/**
					 * @inheritdoc
					 */
					_getRadius() {
						return this._circle.radius;
					}

					/**
					 * @inheritdoc
					 */
					getCenter() {
						return this._circle.center.clone();
					}

					/**
					 * @inheritdoc
					 */
					_getBoundingBox() {
						return this._boundingBox;
					}

					/**
					 * @inheritdoc
					 */
					debugDraw(opacity, shapesBatch) {
						if (opacity === undefined) { opacity = 1; }
						let color = this._getDebugColor();
						color.a *= opacity;

						shapesBatch = this._getDebugDrawBatch(shapesBatch);
						let needToBegin = !shapesBatch.isDrawing;
						if (needToBegin) { shapesBatch.begin(); }
						for (let i = 0; i < this._lines.length; ++i) {
							shapesBatch.drawLine(this._lines[i].from, this._lines[i].to, color);
						}
						if (needToBegin) { shapesBatch.end(); }
					}
				}

				// export collision lines class
				module.exports = LinesShape;

				/***/
			}),

/***/ 1282:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement collision point.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\shapes\point.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const CollisionShape = __webpack_require__(9135);
				const gfx = __webpack_require__(7565);
				const Vector2 = __webpack_require__(2544);
				const Rectangle = __webpack_require__(4731);
				const Circle = __webpack_require__(9668);


				/**
				 * Collision point class.
				 */
				class PointShape extends CollisionShape {
					/**
					 * Create the collision shape.
					 * @param {Vector2} position Point position.
					 */
					constructor(position) {
						super();
						this.setPosition(position);
					}

					/**
					 * @inheritdoc
					 */
					get shapeId() {
						return "point";
					}

					/**
					 * Set this collision shape from vector2.
					 * @param {Vector2} position Point position.
					 */
					setPosition(position) {
						this._position = position.clone();
						this._boundingBox = new Rectangle(position.x, position.y, 1, 1);
						this._shapeChanged();
					}

					/**
					 * Get point position.
					 * @returns {Vector2} Point position.
					 */
					getPosition() {
						return this._position.clone();
					}

					/**
					 * @inheritdoc
					 */
					getCenter() {
						return this._position.clone();
					}

					/**
					 * @inheritdoc
					 */
					_getRadius() {
						return 1;
					}

					/**
					 * @inheritdoc
					 */
					_getBoundingBox() {
						return this._boundingBox;
					}

					/**
					 * Debug draw this shape.
					 * @param {Number} opacity Shape opacity factor.
					 */
					debugDraw(opacity, shapesBatch) {
						if (opacity === undefined) { opacity = 1; }
						let color = this._getDebugColor();
						color.a *= opacity;
						shapesBatch = this._getDebugDrawBatch(shapesBatch);
						let needToBegin = !shapesBatch.isDrawing;
						if (needToBegin) { shapesBatch.begin(); }
						shapesBatch.drawCircle(new Circle(this.getPosition(), 3), color, 4);
						if (needToBegin) { shapesBatch.end(); }
					}
				}

				// export collision shape class
				module.exports = PointShape;

				/***/
			}),

/***/ 4153:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement collision rectangle.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\shapes\rectangle.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Rectangle = __webpack_require__(4731);
				const CollisionShape = __webpack_require__(9135);
				const gfx = __webpack_require__(7565);


				/**
				 * Collision rectangle class.
				 */
				class RectangleShape extends CollisionShape {
					/**
					 * Create the collision shape.
					 * @param {Rectangle} rectangle the rectangle shape.
					 */
					constructor(rectangle) {
						super();
						this.setShape(rectangle);
					}

					/**
					 * @inheritdoc
					 */
					get shapeId() {
						return "rect";
					}

					/**
					 * Set this collision shape from rectangle.
					 * @param {Rectangle} rectangle Rectangle shape.
					 */
					setShape(rectangle) {
						this._rect = rectangle;
						this._center = rectangle.getCenter();
						this._radius = this._rect.getBoundingCircle().radius;
						this._shapeChanged();
					}

					/**
					 * @inheritdoc
					 */
					_getRadius() {
						return this._radius;
					}

					/**
					 * @inheritdoc
					 */
					_getBoundingBox() {
						return this._rect;
					}

					/**
					 * @inheritdoc
					 */
					getCenter() {
						return this._center.clone();
					}

					/**
					 * @inheritdoc
					 */
					debugDraw(opacity, shapesBatch) {
						if (opacity === undefined) { opacity = 1; }
						let color = this._getDebugColor();
						color.a *= opacity;
						shapesBatch = this._getDebugDrawBatch(shapesBatch);
						let needToBegin = !shapesBatch.isDrawing;
						if (needToBegin) { shapesBatch.begin(); }
						shapesBatch.drawRectangle(this._rect, color);
						if (needToBegin) { shapesBatch.end(); }
					}
				}

				// export collision shape class
				module.exports = RectangleShape;

				/***/
			}),

/***/ 9135:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement collision shape base class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\shapes\shape.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const ShapesBatch = __webpack_require__(1772);
				const Color = __webpack_require__(9327);
				const Rectangle = __webpack_require__(4731);
				const Vector2 = __webpack_require__(2544);
				const CollisionWorld = __webpack_require__(2433);


				/**
				 * Collision shape base class.
				 */
				class CollisionShape {
					/**
					 * Create the collision shape.
					 */
					constructor() {
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
					get shapeId() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Get collision flags (matched against collision mask when checking collision).
					 */
					get collisionFlags() {
						return this._collisionFlags;
					}

					/**
					 * Set collision flags (matched against collision mask when checking collision).
					 */
					set collisionFlags(value) {
						this._debugColor = null;
						this._collisionFlags = value;
						return this._collisionFlags;
					}

					/**
					 * Get Shapes beatch to draw this shape with, either given or default from world.
					 * If not provided and have no world, will throw exception.
					 * @private
					 */
					_getDebugDrawBatch(shapesBatch) {
						if (!shapesBatch && !this._world) {
							throw new Error("Can't debug-draw a collision shape that is not under any collision world without providing a shapes batch to use!");
						}
						return (shapesBatch || this._world.getOrCreateDebugDrawBatch());
					}

					/**
					 * Set the debug color to use to draw this shape.
					 * @param {Color} color Color to set or null to use default.
					 */
					setDebugColor(color) {
						this._forceDebugColor = color;
					}

					/**
					 * Debug draw this shape.
					 * @param {Number} opacity Shape opacity factor.
					 * @param {ShapesBatch} shapesBatch Optional shapes batch to use to debug draw the shape. By default will use the collision world.
					 */
					debugDraw(opacity, shapesBatch) {
						throw new Error("Not Implemented!");
					}

					/**
					 * Get shape center position.
					 * @returns {Vector2} Center position.
					 */
					getCenter() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Remove self from parent world object.
					 */
					remove() {
						if (this._world) {
							this._world.removeShape(this);
						}
					}

					/**
					 * Get debug drawing color.
					 * @private
					 */
					_getDebugColor() {
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
					_getDefaultDebugColorFor(flags) {
						return defaultDebugColors[flags % defaultDebugColors.length];
					}

					/**
					 * Get collision shape's estimated radius box.
					 * @private
					 * @returns {Number} Shape's radius
					 */
					_getRadius() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Get collision shape's bounding box.
					 * @private
					 * @returns {Rectangle} Shape's bounding box.
					 */
					_getBoundingBox() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Set the parent collision world this shape is currently in.
					 * @private
					 * @param {CollisionWorld} world New parent collision world or null to remove.
					 */
					_setParent(world) {
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
					_shapeChanged() {
						if (this._world) {
							this._world._queueUpdate(this);
						}
					}
				}

				// default debug colors to use
				const defaultDebugColors = [Color.red, Color.blue, Color.green, Color.yellow, Color.purple, Color.teal, Color.brown, Color.orange, Color.khaki, Color.darkcyan, Color.cornflowerblue, Color.darkgray, Color.chocolate, Color.aquamarine, Color.cadetblue, Color.magenta, Color.seagreen, Color.pink, Color.olive, Color.violet];

				// export collision shape class
				module.exports = CollisionShape;

				/***/
			}),

/***/ 6601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement collision tilemap.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\collision\shapes\tilemap.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const CollisionShape = __webpack_require__(9135);
				const Rectangle = __webpack_require__(4731);
				const Vector2 = __webpack_require__(2544);
				const gfx = __webpack_require__(7565);
				const RectangleShape = __webpack_require__(4153);


				/**
				 * Collision tilemap class.
				 * A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
				 * Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.
				 */
				class TilemapShape extends CollisionShape {
					/**
					 * Create the collision tilemap.
					 * @param {Vector2} offset Tilemap top-left corner.
					 * @param {Vector2} gridSize Number of tiles on X and Y axis.
					 * @param {Vector2} tileSize The size of a single tile.
					 * @param {Number} borderThickness Set a border collider with this thickness.
					 */
					constructor(offset, gridSize, tileSize, borderThickness) {
						super();
						borderThickness = borderThickness || 0;
						this._offset = offset.clone();
						this._intBoundingRect = new Rectangle(offset.x, offset.y, gridSize.x * tileSize.x, gridSize.y * tileSize.y);
						this._boundingRect = this._intBoundingRect.resize(borderThickness * 2);
						this._center = this._boundingRect.getCenter();
						this._radius = this._boundingRect.getBoundingCircle().radius;
						this._borderThickness = borderThickness;
						this._gridSize = gridSize.clone();
						this._tileSize = tileSize.clone();
						this._tiles = {};
					}

					/**
					 * @inheritdoc
					 */
					get shapeId() {
						return "tilemap";
					}

					/**
					 * Get tile key from vector index.
					 * Also validate range.
					 * @private
					 * @param {Vector2} index Index to get key for.
					 * @returns {String} tile key.
					 */
					_indexToKey(index) {
						if (index.x < 0 || index.y < 0 || index.x >= this._gridSize.x || index.y >= this._gridSize.y) {
							throw new Error(`Collision tile with index ${index.x},${index.y} is out of bounds!`);
						}
						return index.x + ',' + index.y;
					}

					/**
					 * Set the state of a tile.
					 * @param {Vector2} index Tile index.
					 * @param {Boolean} haveCollision Does this tile have collision?
					 * @param {Number} collisionFlags Optional collision flag to set for this tile.
					 */
					setTile(index, haveCollision, collisionFlags) {
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
					getTileAt(position) {
						let index = new Vector2(Math.floor(position.x / this._tileSize.x), Math.floor(position.y / this._tileSize.y));
						let key = index.x + ',' + index.y;
						return this._tiles[key] || null;
					}

					/**
					 * Iterate all tiles in given region, represented by a rectangle.
					 * @param {Rectangle} region Rectangle to get tiles for.
					 * @param {Function} callback Method to invoke for every tile. Return false to break iteration.
					 */
					iterateTilesAtRegion(region, callback) {
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
					getTilesAtRegion(region) {
						let ret = [];
						this.iterateTilesAtRegion(region, (tile) => { ret.push(tile); });
						return ret;
					}

					/**
					 * @inheritdoc
					 */
					_getRadius() {
						return this._radius;
					}

					/**
					 * @inheritdoc
					 */
					_getBoundingBox() {
						return this._boundingRect;
					}

					/**
					 * @inheritdoc
					 */
					getCenter() {
						return this._center.clone();
					}

					/**
					 * @inheritdoc
					 */
					debugDraw(opacity, shapesBatch) {
						if (opacity === undefined) { opacity = 1; }
						for (let key in this._tiles) {
							let tile = this._tiles[key];
							tile.setDebugColor(this._forceDebugColor);
							tile.debugDraw(opacity, shapesBatch);
						}
					}
				}

				// export collision shape class
				module.exports = TilemapShape;

				/***/
			}),

/***/ 3223:
/***/ ((module) => {

				/**
				 * Define supported blend modes.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\blend_modes.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


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

				module.exports = { BlendModes: BlendModes };

				/***/
			}),

/***/ 2726:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Camera class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\camera.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				const Rectangle = __webpack_require__(4731);
				const Vector2 = __webpack_require__(2544);
				const Matrix = __webpack_require__(5529);
				const Vector3 = __webpack_require__(8329);
				const Frustum = __webpack_require__(4353);

				/**
				 * Implements a Camera object.
				 */
				class Camera {
					/**
					 * Create the camera.
					 * @param {Gfx} gfx The gfx manager instance.
					 */
					constructor(gfx) {
						this.__region = null;
						this.__gfx = gfx;
						this.__viewport = null;
						this.orthographic();
					}

					/**
					 * Get camera's viewport (drawing region to set when using this camera).
					 * @returns {Rectangle} Camera's viewport as rectangle.
					 */
					get viewport() {
						return this.__viewport;
					}

					/**
					 * Set camera's viewport.
					 * @param {Rectangle} viewport New viewport to set or null to not use any viewport when using this camera.
					 */
					set viewport(viewport) {
						this.__viewport = viewport;
						return viewport;
					}

					/**
					 * Get the region this camera covers.
					 * @returns {Rectangle} region this camera covers.
					 */
					getRegion() {
						return this.__region.clone();
					}

					/**
					 * Make this camera an orthographic camera with offset.
					 * @param {Vector2} offset Camera offset (top-left corner).
					 * @param {Boolean} ignoreViewportSize If true, will take the entire canvas size for calculation and ignore the viewport size, if set.
					 * @param {Number} near Near clipping plane.
					 * @param {Number} far Far clipping plane.
					 */
					orthographicOffset(offset, ignoreViewportSize, near, far) {
						let renderingSize = (ignoreViewportSize || !this.viewport) ? this.__gfx.getCanvasSize() : this.viewport.getSize();
						let region = new Rectangle(offset.x, offset.y, renderingSize.x, renderingSize.y);
						this.orthographic(region, near, far);
					}

					/**
					 * Make this camera an orthographic camera.
					 * @param {Rectangle} region Camera left, top, bottom and right. If not set, will take entire canvas.
					 * @param {Number} near Near clipping plane.
					 * @param {Number} far Far clipping plane.
					 */
					orthographic(region, near, far) {
						if (region === undefined) {
							region = this.__gfx._internal.getRenderingRegionInternal();
						}
						this.__region = region;
						this.projection = Matrix.createOrthographic(region.left, region.right, region.bottom, region.top, near || -1, far || 400);
					}
				}

				// export the camera object
				module.exports = Camera;

				/***/
			}),

/***/ 8871:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Camera class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\camera3d.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Matrix = __webpack_require__(5529);
				const Vector3 = __webpack_require__(8329);
				const Frustum = __webpack_require__(4353);
				const Camera = __webpack_require__(2726);
				const Vector2 = __webpack_require__(2544);

				/**
				 * Implements a 3d Camera object.
				 */
				class Camera3D extends Camera {
					/**
					 * Create the camera.
					 * @param {Gfx} gfx The gfx manager instance.
					 */
					constructor(gfx) {
						super(gfx);

						/**
						 * Camera projection matrix.
						 * You can set it manually, or use 'orthographicOffset' / 'orthographic' / 'perspective' helper functions.
						 */
						this.projection = null;

						/**
						 * Camera view matrix.
						 * You can set it manually, or use 'setViewLookat' helper function.
						 */
						this.view = null;

						// build perspective camera by default
						this.perspective();
						this.setViewLookat(new Vector3(0, 5, -10), Vector3.zero());
					}

					/**
					 * Calc and return the currently-visible view frustum, based on active camera.
					 * @returns {Frustum} Visible frustum.
					 */
					calcVisibleFrustum() {
						if (!this.projection || !this.view) { throw new Error("You must set both projection and view matrices to calculate visible frustum!"); }
						const frustum = new Frustum();
						frustum.setFromProjectionMatrix(Matrix.multiply(this.projection, this.view));
						return frustum;
					}

					/**
					 * Set camera view matrix from source position and lookat.
					 * @param {Vector3=} eyePosition Camera source position.
					 * @param {Vector3=} lookAt Camera look-at target.
					 */
					setViewLookat(eyePosition, lookAt) {
						this.view = Matrix.createLookAt(eyePosition || new Vector3(0, 0, -500), lookAt || Vector3.zeroReadonly, Vector3.upReadonly);
					}

					/**
					 * Get 3d direction vector of this camera.
					 * @returns {Vector3} 3D direction vector.
					 */
					getDirection() {
						const e = this.view.values;
						return new Vector3(- e[8], - e[9], - e[10]).normalizeSelf();
					}

					/**
					 * Get view projection matrix.
					 * @returns {Matrix} View-projection matrix.
					 */
					getViewProjection() {
						return Matrix.multiply(this.view, this.projection);
					}

					/**
					 * Get projection view matrix.
					 * @returns {Matrix} Projection-view matrix.
					 */
					getProjectionView() {
						return Matrix.multiply(this.projection, this.view);
					}

					/**
					 * Make this camera a perspective camera.
					 * @param {*} fieldOfView Field of view angle in radians.
					 * @param {*} aspectRatio Aspect ratio.
					 * @param {*} near Near clipping plane.
					 * @param {*} far Far clipping plane.
					 */
					perspective(fieldOfView, aspectRatio, near, far) {
						this.projection = Matrix.createPerspective(fieldOfView || (Math.PI / 2), aspectRatio || 1, near || 0.1, far || 1000);
					}

					/**
					 * Unproject a 2d vector into 3D space.
					 * You can use this method to get the 3D direction the user points on with the mouse.
					 * @param {Vector2} point Vector to unproject.
					 * @param {Number} zDistance Distance from camera to locate the 3D point at (0 = near plane, 1 = far plane).
					 * @returns {Vector3} Unprojected point in 3D space.
					 */
					unproject(point, zDistance = 0) {
						function project(out, vec, m) {
							var x = vec[0],
								y = vec[1],
								z = vec[2],
								a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3],
								a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7],
								a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11],
								a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

							var lw = 1 / (x * a03 + y * a13 + z * a23 + a33);

							out[0] = (x * a00 + y * a10 + z * a20 + a30) * lw;
							out[1] = (x * a01 + y * a11 + z * a21 + a31) * lw;
							out[2] = (x * a02 + y * a12 + z * a22 + a32) * lw;
							return out;
						}

						function unproject(out, vec, viewport, invProjectionView) {
							var viewX = viewport[0],
								viewY = viewport[1],
								viewWidth = viewport[2],
								viewHeight = viewport[3];

							var x = vec[0],
								y = vec[1],
								z = vec[2];

							x = x - viewX;
							y = viewHeight - y - 1;
							y = y - viewY;

							out[0] = (2 * x) / viewWidth - 1;
							out[1] = (2 * y) / viewHeight - 1;
							out[2] = 2 * z - 1;
							return project(out, out, invProjectionView.values);
						}

						const out = [];
						const projInverted = this.getProjectionView().inverted();
						const viewport = this.viewport || Shaku.gfx.getRenderingRegion();
						unproject(out, [point.x, point.y, zDistance], [viewport.x, viewport.y, viewport.width, viewport.height], projInverted);
						return new Vector3(out[0], out[1], out[2]);
					}
				}

				// export the camera object
				module.exports = Camera3D;

				/***/
			}),

/***/ 8117:
/***/ ((module) => {

				/**
				 * Define supported usage modes.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\buffers_usage.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				/** @typedef {String} BuffersUsage */

				/**
				 * Buffers usage we can use for drawing batches.
				 * This determine how WebGL will treat the buffers we pass to the GPU.
				 * @readonly
				 * @enum {BuffersUsage}
				 */
				const BuffersUsage = {
					StaticDraw: 'static',
					DynamicDraw: 'dynamic',
					StreamDraw: 'stream',
				};

				Object.defineProperty(BuffersUsage, '_values', {
					value: new Set(Object.values(BuffersUsage)),
					writable: false,
				});
				Object.freeze(BuffersUsage);

				module.exports = { BuffersUsage: BuffersUsage };

				/***/
			}),

/***/ 2069:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * An interface for a batch renderer.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\draw_batch.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const { BlendModes } = __webpack_require__(3223);
				const { BuffersUsage } = __webpack_require__(8117);
				const Matrix = __webpack_require__(5529);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-draw-batch');

				/**
				 * Base class for a drawing batch, used to draw a collection of sprites or shapes.
				 */
				class DrawBatch {
					/**
					 * Create the draw batch.
					 */
					constructor() {
						// set default usage mode
						this.setBuffersUsage(BuffersUsage.StreamDraw);

						// will have values after calling 'begin()'
						this.__currDrawingParams = null;

						// if true, it means the buffers have been frozen and can't be changed
						this.__staticBuffers = false;

						// are we currently between 'begin()' and 'end()' calls
						this.__drawing = false;
					}

					/**
					 * Make the batch buffers static.
					 * This means you won't be able to change the drawings in this batch once end() is called, but you'll be able to redraw
					 * the batch with different effects and transformations without copying any data, and much faster.
					 * This also free up some internal arrays, thus reducing the memory used for this batch.
					 * Note: must be called after 'begin()' and right before the 'end()' call.
					 */
					makeStatic() {
						this.__validateBatch();
						if (!this.isDrawing) { throw new Error("Must call 'makeStatic()' between 'begin()' and 'end()'."); }
						this.setBuffersUsage(this.BuffersUsage.StaticDraw);
						this.__staticBuffers = true;
					}

					/**
					 * Get the default effect to use for this drawing batch type.
					 * @returns {Effect} Default effect to use for this drawing batch.
					 */
					get defaultEffect() {
						return null;
					}

					/**
					 * Get the BuffersUsage enum.
					 * @see BuffersUsage
					 */
					get BuffersUsage() {
						return BuffersUsage;
					}

					/**
					 * Destroy the batch and free any resources assigned to it.
					 */
					destroy() {
					}

					/**
					 * Return if the batch was destroyed.
					 * @returns {Boolean} True if batch was destoryed.
					 */
					get isDestroyed() {
						return false;
					}

					/**
					 * Throw exception if batch was destoryed.
					 * @private
					 */
					__validateBatch() {
						if (this.isDestroyed) {
							throw new Error("Can't perform this action after the batch was destroyed!");
						}
					}

					/**
					 * Set the way we mark the buffers we pass to the GPU based on expected behavior.
					 * Use StreamDraw if you want to set buffers once, and use them in GPU few times.
					 * Use DynamicDraw if you want to set buffers many times, and use them in GPU many times.
					 * Use StaticDraw if you want to set buffers once, and use them in GPU many times.
					 * @param {BuffersUsage} usage Buffers usage.
					 */
					setBuffersUsage(usage) {
						switch (usage) {
							case BuffersUsage.DynamicDraw:
								this.__buffersUsage = DrawBatch._gfx._internal.gl.DYNAMIC_DRAW;
								break;

							case BuffersUsage.StreamDraw:
								this.__buffersUsage = DrawBatch._gfx._internal.gl.STREAM_DRAW;
								break;

							case BuffersUsage.StaticDraw:
								this.__buffersUsage = DrawBatch._gfx._internal.gl.STATIC_DRAW;
								break;

							default:
								this.__buffersUsage = DrawBatch._gfx._internal.gl.DYNAMIC_DRAW;
								_logger.warn("Illegal buffers usage value: " + usage);
								break;
						}

					}

					/**
					 * Return if the batch is currently drawing.
					 * @returns {Boolean} If the batch began drawing.
					 */
					get isDrawing() {
						return this.__drawing;
					}

					/**
					 * Throw exception if batch is not currently drawing.
					 * @private
					 */
					__validateDrawing(validateNotStatic) {
						if (!this.isDrawing) {
							throw new Error("Can't perform this action without calling 'begin()' first!");
						}
						if (validateNotStatic && this.__staticBuffers) {
							throw new Error("Can't perform this action after batch has turned static!");
						}
					}

					/**
					 * Start drawing this batch.
					 * You must call this before doing any draw calls.
					 * @param {BlendModes=} blendMode Blend mode to draw this batch in.
					 * @param {Effect=} effect Effect to use. If not defined will use this batch type default effect.
					 * @param {Matrix=} transform Optional transformations to apply on all sprites.
					 * @param {*=} overrideEffectFlags Optional flags to override effect's defaults. Possible keys: {enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering}.
					 */
					begin(blendMode, effect, transform, overrideEffectFlags) {
						// sanity - not already drawing
						if (this.isDrawing) {
							throw new Error("Can't call Drawing Batch 'begin' twice without calling 'end()' first!");
						}

						// sanity - batch is not destoryed
						this.__validateBatch();

						// we might still have values in this.__currDrawingParams if 'preserve buffers' is true.
						// if so, we extract last texture from it
						let lastTexture = this.__currDrawingParams ? (this.__currDrawingParams.texture || null) : null;

						// set new drawing params
						effect = effect || this.defaultEffect;
						blendMode = blendMode || this.defaultBlendMode;
						this.__currDrawingParams = {
							blendMode: blendMode,
							effect: effect,
							transform: transform || Matrix.identity,
							overrideEffectFlags: overrideEffectFlags,
							hasVertexColor: effect.hasVertexColor,
							texture: lastTexture
						};

						// we are now drawing
						this.__drawing = true;
					}

					/**
					 * Finish drawing without presenting on screen.
					 */
					endWithoutDraw() {
						// sanity
						this.__validateBatch();
						this.__validateDrawing(false);

						// clear buffers and drawing params
						if (!this.__staticBuffers) {
							this.clear();
							this.__currDrawingParams = null;
						}

						// no longer drawing
						this.__drawing = false;
					}

					/**
					 * End drawing and present whatever left in buffers on screen.
					 */
					end() {
						// sanity
						this.__validateBatch();
						this.__validateDrawing(false);

						// draw current batch data
						this._drawBatch();

						// clear buffers and drawing params
						if (!this.__staticBuffers) {
							this.clear();
							this.__currDrawingParams = null;
						}

						// no longer drawing
						this.__drawing = false;
					}

					/**
					 * Draw whatever is currently in buffers without ending the draw batch.
					 */
					present() {
						this._drawBatch();
					}

					/**
					 * Clear this buffer from any drawings in it.
					 * Called internally if 'preserveBuffers' is not true.
					 */
					clear() {
						if (this.__staticBuffers) {
							throw new Error("Can't clear batch after it was turned static. You can only destroy it.");
						}
					}

					/**
					 * Return if this batch was turned static.
					 * @returns {Boolean} True if its a static batch you can no longer change.
					 */
					get isStatic() {
						return this.__staticBuffers;
					}

					/**
					 * Get the default blend mode to use for this drawing batch.
					 */
					get defaultBlendMode() {
						return BlendModes.AlphaBlend;
					}

					/**
					 * Draw current batch with set drawing params.
					 * @private
					 */
					_drawBatch() {
						// sanity
						this.__validateBatch();
						this.__validateDrawing(false);

						// get default effect
						let effect = this.__currDrawingParams.effect;

						// get the gfx manager
						let gfx = DrawBatch._gfx;

						// set effect
						gfx._internal.useEffect(effect, this.__currDrawingParams.overrideEffectFlags);

						// set blend mode if needed
						gfx._internal.setBlendMode(this.__currDrawingParams.blendMode);

						// set world matrix
						effect.setWorldMatrix(this.__currDrawingParams.transform);

						// set active texture
						gfx._internal.setActiveTexture(this.__currDrawingParams.texture);

						// trigger on set effect
						this._onSetEffect(effect, this.__currDrawingParams.texture);
					}

					/**
					 * Called internally after we set the effect and texture and before we start rendering batch.
					 * @private
					 */
					_onSetEffect(effect, texture) {
					}
				}

				// will be set by the Gfx manager during init
				DrawBatch._gfx = null;

				// export the draw batch class
				module.exports = DrawBatch;

				/***/
			}),

/***/ 8333:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx lines batch renderer.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\lines_batch.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const { Rectangle } = __webpack_require__(3624);
				const Vector2 = __webpack_require__(2544);
				const Vector3 = __webpack_require__(8329);
				const Matrix = __webpack_require__(5529);
				const Vertex = __webpack_require__(4288);
				const DrawBatch = __webpack_require__(2069);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-sprite-batch');


				/**
				 * Colored lines renderer.
				 * Responsible to drawing a batch of line segments or strips.
				 */
				class LinesBatch extends DrawBatch {
					/**
					 * Create the sprites batch.
					 * @param {Number=} lineSegmentsCount Internal buffers size, in line segments count (line segment = 3 vertices). Bigger value = faster rendering but more RAM.
					 */
					constructor(lineSegmentsCount) {
						// init draw batch
						super();

						// create buffers for drawing shapes
						this.#_createBuffers(lineSegmentsCount || 500);

						/**
						 * How many line segments this batch can hold.
						 * @private
						 */
						this.__maxLinesCount = Math.floor((this._buffers.positionArray.length / 6));

						/**
						 * How many line segments we currently have.
						 * @private
						 */
						this.__linesCount = 0;

						/**
						 * Indicate there were changes in buffers.
						 * @private
						 */
						this.__dirty = false;

						/**
						 * Optional method to trigger when shapes batch overflows and can't contain any more polygons.
						 * @type {Function}
						 * @name ShapesBatch#onOverflow
						 */
						this.onOverflow = null;

						/**
						 * If true, will floor vertices positions before pushing them to batch.
						 * @type {Boolean}
						 * @name ShapesBatch#snapPixels
						 */
						this.snapPixels = false;

						/**
						 * If true, will draw lines as a single lines strip.
						 * @type {Boolean}
						 * @name ShapesBatch#linesStrip
						 */
						this.linesStrip = false;
					}

					/**
					 * Get the gfx manager.
					 * @private
					 */
					get #_gfx() {
						return DrawBatch._gfx;
					}

					/**
					 * Get the web gl instance.
					 * @private
					 */
					get #_gl() {
						return DrawBatch._gfx._internal.gl;
					}

					/**
					 * Build the dynamic buffers.
					 * @private
					 */
					#_createBuffers(batchPolygonsCount) {
						let gl = this.#_gl;

						// dynamic buffers, used for batch rendering
						this._buffers = {

							positionBuffer: gl.createBuffer(),
							positionArray: new Float32Array(3 * 2 * batchPolygonsCount),

							colorsBuffer: gl.createBuffer(),
							colorsArray: new Float32Array(4 * 2 * batchPolygonsCount),

							indexBuffer: gl.createBuffer(),
						};

						// create the indices buffer
						let maxIndex = (batchPolygonsCount * 3);
						let indicesArrayType;
						if (maxIndex <= 256) {
							indicesArrayType = Uint8Array;
							this.__indicesType = gl.UNSIGNED_BYTE;
						}
						if (maxIndex <= 65535) {
							indicesArrayType = Uint16Array;
							this.__indicesType = gl.UNSIGNED_SHORT;
						}
						else {
							indicesArrayType = Uint32Array;
							this.__indicesType = gl.UNSIGNED_INT;
						}
						let indices = new indicesArrayType(batchPolygonsCount * 3); // 3 = number of indices per sprite
						for (let i = 0; i < indices.length; i++) {

							indices[i] = i;
						}
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffer);
						gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

						// extand buffers functionality
						function extendBuffer(buff) {
							if (buff) { buff._index = 0; }
						}
						extendBuffer(this._buffers.positionArray);
						extendBuffer(this._buffers.colorsArray);
					}

					/**
					 * @inheritdoc
					 */
					clear() {
						super.clear();
						this._buffers.positionArray._index = 0;
						this._buffers.colorsArray._index = 0;
						this.__linesCount = 0;
						this.__dirty = false;
					}

					/**
					 * @inheritdoc
					 */
					destroy() {
						let gl = this.#_gl;
						if (this._buffers) {
							if (this._buffers.positionBuffer) gl.deleteBuffer(this._buffers.positionBuffer);
							if (this._buffers.colorsBuffer) gl.deleteBuffer(this._buffers.colorsBuffer);
						}
						this._buffers = null;
					}

					/**
					 * @inheritdoc
					 */
					get isDestroyed() {
						return Boolean(this._buffers) === false;
					}

					/**
					 * @inheritdoc
					 */
					get defaultEffect() {
						return this.#_gfx.builtinEffects.Shapes;
					}

					/**
					 * Push vertices to drawing batch.
					 * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons.
					 */
					drawVertices(vertices) {
						// sanity
						this.__validateDrawing(true);

						// sanity check
						if (!this.linesStrip && ((vertices.length % 2) !== 0)) {
							_logger.warn("Tried to push vertices that are not multiplication of 2!");
							return;
						}

						// push vertices
						let i = 0;
						let colors = this._buffers.colorsArray;
						let positions = this._buffers.positionArray;
						for (let vertex of vertices) {
							// push color
							if (this.__currDrawingParams.hasVertexColor) {
								colors[colors._index++] = (vertex.color.r || 0);
								colors[colors._index++] = (vertex.color.g || 0);
								colors[colors._index++] = (vertex.color.b || 0);
								colors[colors._index++] = (vertex.color.a || 0);
							}

							// push position
							positions[positions._index++] = (vertex.position.x || 0);
							positions[positions._index++] = (vertex.position.y || 0);
							positions[positions._index++] = (vertex.position.z || 0);

							// every 2 vertices..
							if ((i++ === 1) || this.linesStrip) {
								// update quads count
								this.__linesCount++;

								// check if full
								if (this.__linesCount >= this.__maxLinesCount) {
									this._handleFullBuffer();
								}

								// reset count
								i = 0;
							}
						}

						// mark as dirty
						this.__dirty = true;
					}

					/**
					 * Add a rectangle to draw.
					 * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
					 * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
					 * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
					 * @param {Number=} rotation Rotate rectangle.
					 * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
					 * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
					 */
					drawQuad(position, size, color, rotation, origin, skew) {
						let sprite = this.#_gfx.Sprite.build(null, position, size, undefined, color, rotation, origin, skew);
						this.#_addRect(sprite);
					}

					/**
					 * Add a rectangle that covers a given destination rectangle.
					 * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
					 * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
					 * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
					 * @param {Number=} rotation Rotate rectangle.
					 * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
					 */
					drawRectangle(destRect, sourceRect, color, rotation, origin) {
						if ((destRect.isVector2) || (destRect.isVector3)) {
							destRect = new Rectangle(0, 0, destRect.x, destRect.y);
						}
						this.drawQuad(destRect.getCenter(), destRect.getSize(), sourceRect, color, rotation, origin);
					}

					/**
					 * Draw a colored circle.
					 * @param {Circle} circle Circle to draw.
					 * @param {Color} color Circle fill color.
					 * @param {Number=} segmentsCount How many segments to build the circle from (more segments = smoother circle).
					 * @param {Number|Vector2=} ratio If procided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis.
					 * @param {Number=} rotation If provided will rotate the oval / circle.
					 */
					drawCircle(circle, color, segmentsCount, ratio, rotation) {
						// sanity
						this.__validateDrawing(true);

						// defaults segments count
						if (segmentsCount === undefined) {
							segmentsCount = 24;
						}
						else if (segmentsCount < 2) {
							return;
						}

						// default ratio
						if (!ratio) {
							ratio = Vector2.oneReadonly;
						}
						else if (typeof ratio === 'number') {
							ratio = new Vector2(1, ratio);
						}

						// for rotation
						let rotateVec;
						if (rotation) {
							let cos = Math.cos(rotation);
							let sin = Math.sin(rotation);
							rotateVec = function(vector) {
								let x = (vector.x * cos - vector.y * sin);
								let y = (vector.x * sin + vector.y * cos);
								vector.x = x;
								vector.y = y;
								return vector;
							};
						}

						// build first position that is not center
						const segmentStep = (2 * Math.PI) / segmentsCount;
						let prevPoint = new Vector2(
							(circle.radius * Math.cos(0)) * ratio.x,
							(circle.radius * Math.sin(0)) * ratio.y
						);
						if (rotateVec) { rotateVec(prevPoint); }

						// generate list of vertices to draw the circle
						for (let i = 1; i <= segmentsCount; i++) {
							// calculate new point
							let newPoint = new Vector2(
								(circle.radius * Math.cos(i * segmentStep)) * ratio.x,
								(circle.radius * Math.sin(i * segmentStep)) * ratio.y
							);
							if (rotateVec) { rotateVec(newPoint); }

							// add for line strip
							if (this.linesStrip) {
								if (i === 1) {
									this.drawVertices([
										new Vertex(prevPoint.add(circle.center), null, color)
									]);
								}
								this.drawVertices([
									new Vertex(newPoint.add(circle.center), null, color)
								]);
							}
							// add for line segments
							else {
								this.drawVertices([
									new Vertex(prevPoint.add(circle.center), null, color),
									new Vertex(newPoint.add(circle.center), null, color),
								]);
							}
							prevPoint = newPoint;
						}
					}

					/**
					 * Add a rectangle from sprite data.
					 * @private
					 */
					#_addRect(sprite, transform) {
						// sanity
						this.__validateDrawing(true);

						// mark as dirty
						this.__dirty = true;

						// add rectangle from sprite data
						{
							// calculate vertices positions
							let sizeX = sprite.size.x;
							let sizeY = sprite.size.y;
							let left = -sizeX * sprite.origin.x;
							let top = -sizeY * sprite.origin.y;

							// calculate corners
							topLeft.x = left; topLeft.y = top;
							topRight.x = left + sizeX; topRight.y = top;
							bottomLeft.x = left; bottomLeft.y = top + sizeY;
							bottomRight.x = left + sizeX; bottomRight.y = top + sizeY;

							// are vertices axis aligned?
							let axisAlined = true;

							// apply skew
							if (sprite.skew) {
								// skew on x axis
								if (sprite.skew.x) {
									topLeft.x += sprite.skew.x * sprite.origin.y;
									topRight.x += sprite.skew.x * sprite.origin.y;
									bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
									bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
									axisAlined = false;
								}
								// skew on y axis
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
								function rotateVec(vector) {
									let x = (vector.x * cos - vector.y * sin);
									let y = (vector.x * sin + vector.y * cos);
									vector.x = x;
									vector.y = y;
								}
								rotateVec(topLeft);
								rotateVec(topRight);
								rotateVec(bottomLeft);
								rotateVec(bottomRight);
								axisAlined = false;
							}

							// add sprite position
							topLeft.x += sprite.position.x;
							topLeft.y += sprite.position.y;
							topRight.x += sprite.position.x;
							topRight.y += sprite.position.y;
							bottomLeft.x += sprite.position.x;
							bottomLeft.y += sprite.position.y;
							bottomRight.x += sprite.position.x;
							bottomRight.y += sprite.position.y;

							// apply transform
							if (transform && !transform.isIdentity) {
								topLeft.copy((topLeft.z !== undefined) ? Matrix.transformVector3(transform, topLeft) : Matrix.transformVector2(transform, topLeft));
								topRight.copy((topRight.z !== undefined) ? Matrix.transformVector3(transform, topRight) : Matrix.transformVector2(transform, topRight));
								bottomLeft.copy((bottomLeft.z !== undefined) ? Matrix.transformVector3(transform, bottomLeft) : Matrix.transformVector2(transform, bottomLeft));
								bottomRight.copy((bottomRight.z !== undefined) ? Matrix.transformVector3(transform, bottomRight) : Matrix.transformVector2(transform, bottomRight));
							}

							// snap pixels
							if (this.snapPixels) {
								topLeft.floorSelf();
								topRight.floorSelf();
								bottomLeft.floorSelf();
								bottomRight.floorSelf();
							}

							// add rectangle vertices
							if (this.linesStrip) {
								this.drawVertices([
									new Vertex(topLeft, null, sprite.color),
									new Vertex(topRight, null, sprite.color),
									new Vertex(bottomRight, null, sprite.color),
									new Vertex(bottomLeft, null, sprite.color),
									new Vertex(topLeft, null, sprite.color),
								]);
							}
							else {
								this.drawVertices([
									new Vertex(topLeft, null, sprite.color),
									new Vertex(topRight, null, sprite.color),

									new Vertex(topRight, null, sprite.color),
									new Vertex(bottomRight, null, sprite.color),

									new Vertex(bottomRight, null, sprite.color),
									new Vertex(bottomLeft, null, sprite.color),

									new Vertex(bottomLeft, null, sprite.color),
									new Vertex(topLeft, null, sprite.color),
								]);
							}
						}
					}

					/**
					 * Get how many line segments are currently in batch.
					 * @returns {Number} Line segments in batch count.
					 */
					get linesInBatch() {
						return this.__linesCount;
					}

					/**
					 * Get how many line segments this batch can contain.
					 * @returns {Number} Max line segments count.
					 */
					get maxLinesCount() {
						return this.__maxLinesCount;
					}

					/**
					 * Check if this batch is full.
					 * @returns {Boolean} True if batch is full.
					 */
					get isFull() {
						return this.__linesCount >= this.__maxLinesCount;
					}

					/**
					 * Called when the batch becomes full while drawing and there's no handler.
					 * @private
					 */
					_handleFullBuffer() {
						// invoke on-overflow callback
						if (this.onOverflow) {
							this.onOverflow();
						}

						// draw current batch and clear
						this._drawBatch();
						this.clear();
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					_drawBatch() {
						// get default effect
						let effect = this.__currDrawingParams.effect;

						// get some members
						let gl = this.#_gl;
						let gfx = this.#_gfx;
						let positionArray = this._buffers.positionArray;
						let colorsArray = this.__currDrawingParams.hasVertexColor ? this._buffers.colorsArray : null;
						let positionBuffer = this._buffers.positionBuffer;
						let colorsBuffer = this._buffers.colorsBuffer;
						let indexBuffer = this._buffers.indexBuffer;

						// should copy buffers
						let needBuffersCopy = this.__dirty;

						// nothing to draw? skip
						if (positionArray._index <= 1) {
							return;
						}

						// get default effect
						effect = effect || this.defaultEffect;

						// call base method to set effect and draw params
						super._drawBatch();

						// vertices count
						const verticesCount = positionArray._index / 3;

						// copy position buffer
						effect.setPositionsAttribute(positionBuffer, true);
						if (needBuffersCopy) {
							gl.bufferData(gl.ARRAY_BUFFER,
								positionArray,
								this.__buffersUsage, 0, positionArray._index);
						}

						// copy color buffer
						if (this.__currDrawingParams.hasVertexColor && colorsBuffer) {
							effect.setColorsAttribute(colorsBuffer, true);
							if (needBuffersCopy && colorsArray) {
								gl.bufferData(gl.ARRAY_BUFFER,
									colorsArray,
									this.__buffersUsage, 0, colorsArray._index);
							}
						}

						// set indices
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

						// draw elements
						gl.drawElements((this.linesStrip ? gl.LINE_STRIP : gl.LINES), verticesCount, this.__indicesType, 0);
						gfx._internal.drawCallsCount++;
						gfx._internal.drawShapePolygonsCount += verticesCount / 2;

						// mark as not dirty
						this.__dirty = false;

						// if static, free arrays we no longer need them
						if (this.__staticBuffers) {
							this._buffers.positionArray = this._buffers.colorsArray = null;
						}
					}
				}

				// used for vertices calculations
				const topLeft = new Vector2(0, 0);
				const topRight = new Vector2(0, 0);
				const bottomLeft = new Vector2(0, 0);
				const bottomRight = new Vector2(0, 0);

				// export the shapes batch class
				module.exports = LinesBatch;

				/***/
			}),

/***/ 1772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx shapes batch renderer.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\shapes_batch.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const { Rectangle } = __webpack_require__(3624);
				const Vector2 = __webpack_require__(2544);
				const Vector3 = __webpack_require__(8329);
				const Matrix = __webpack_require__(5529);
				const Vertex = __webpack_require__(4288);
				const DrawBatch = __webpack_require__(2069);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-sprite-batch');


				/**
				 * Colored shapes renderer.
				 * Responsible to drawing a batch of basic geometric shapes with as little draw calls as possible.
				 */
				class ShapesBatch extends DrawBatch {
					/**
					 * Create the sprites batch.
					 * @param {Number=} batchPolygonsCount Internal buffers size, in polygons count (polygon = 3 vertices). Bigger value = faster rendering but more RAM.
					 */
					constructor(batchPolygonsCount) {
						// init draw batch
						super();

						// create buffers for drawing shapes
						this.#_createBuffers(batchPolygonsCount || 500);

						/**
						 * How many polygons this batch can hold.
						 * @private
						 */
						this.__maxPolyCount = Math.floor((this._buffers.positionArray.length / 9));

						/**
						 * How many polygons we currently have.
						 * @private
						 */
						this.__polyCount = 0;

						/**
						 * Indicate there were changes in buffers.
						 * @private
						 */
						this.__dirty = false;

						/**
						 * Optional method to trigger when shapes batch overflows and can't contain any more polygons.
						 * @type {Function}
						 * @name ShapesBatch#onOverflow
						 */
						this.onOverflow = null;

						/**
						 * If true, will floor vertices positions before pushing them to batch.
						 * @type {Boolean}
						 * @name ShapesBatch#snapPixels
						 */
						this.snapPixels = false;
					}

					/**
					 * Get the gfx manager.
					 * @private
					 */
					get #_gfx() {
						return DrawBatch._gfx;
					}

					/**
					 * Get the web gl instance.
					 * @private
					 */
					get #_gl() {
						return DrawBatch._gfx._internal.gl;
					}

					/**
					 * Build the dynamic buffers.
					 * @private
					 */
					#_createBuffers(batchPolygonsCount) {
						let gl = this.#_gl;

						// dynamic buffers, used for batch rendering
						this._buffers = {

							positionBuffer: gl.createBuffer(),
							positionArray: new Float32Array(3 * 3 * batchPolygonsCount),

							colorsBuffer: gl.createBuffer(),
							colorsArray: new Float32Array(4 * 3 * batchPolygonsCount),

							indexBuffer: gl.createBuffer(),
						};

						// create the indices buffer
						let maxIndex = (batchPolygonsCount * 3);
						let indicesArrayType;
						if (maxIndex <= 256) {
							indicesArrayType = Uint8Array;
							this.__indicesType = gl.UNSIGNED_BYTE;
						}
						if (maxIndex <= 65535) {
							indicesArrayType = Uint16Array;
							this.__indicesType = gl.UNSIGNED_SHORT;
						}
						else {
							indicesArrayType = Uint32Array;
							this.__indicesType = gl.UNSIGNED_INT;
						}
						let indices = new indicesArrayType(batchPolygonsCount * 3); // 3 = number of indices per sprite
						for (let i = 0; i < indices.length; i++) {

							indices[i] = i;
						}
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffer);
						gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

						// extand buffers functionality
						function extendBuffer(buff) {
							if (buff) { buff._index = 0; }
						}
						extendBuffer(this._buffers.positionArray);
						extendBuffer(this._buffers.colorsArray);
					}

					/**
					 * @inheritdoc
					 */
					clear() {
						super.clear();
						this._buffers.positionArray._index = 0;
						this._buffers.colorsArray._index = 0;
						this.__polyCount = 0;
						this.__dirty = false;
					}

					/**
					 * @inheritdoc
					 */
					destroy() {
						let gl = this.#_gl;
						if (this._buffers) {
							if (this._buffers.positionBuffer) gl.deleteBuffer(this._buffers.positionBuffer);
							if (this._buffers.colorsBuffer) gl.deleteBuffer(this._buffers.colorsBuffer);
						}
						this._buffers = null;
					}

					/**
					 * @inheritdoc
					 */
					get isDestroyed() {
						return Boolean(this._buffers) === false;
					}

					/**
					 * @inheritdoc
					 */
					get defaultEffect() {
						return this.#_gfx.builtinEffects.Shapes;
					}

					/**
					 * Draw a line between two points.
					 * This method actually uses a rectangle internally, which is less efficient than using a proper LinesBatch, but have the advantage of supporting width.
					 * @param {Vector2} fromPoint Starting position.
					 * @param {Vector2} toPoint Ending position.
					 * @param {Color} color Line color.
					 * @param {Number=} width Line width.
					 */
					drawLine(fromPoint, toPoint, color, width) {
						width = width || 1;
						length = fromPoint.distanceTo(toPoint);
						let rotation = Vector2.radiansBetween(fromPoint, toPoint);
						let position = (width > 1) ? (new Vector2(fromPoint.x, fromPoint.y - width / 2)) : fromPoint;
						let size = new Vector2(length, width);
						this.drawQuad(position, size, color, rotation, new Vector2(0, 0.5));
					}

					/**
					 * Push vertices to drawing batch.
					 * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 3 to keep the batch consistent of polygons.
					 */
					drawVertices(vertices) {
						// sanity
						this.__validateDrawing(true);

						// sanity check
						if ((vertices.length % 3) !== 0) {
							_logger.warn("Tried to push vertices that are not multiplication of 3!");
							return;
						}

						// push vertices
						let i = 0;
						let colors = this._buffers.colorsArray;
						let positions = this._buffers.positionArray;
						for (let vertex of vertices) {
							// push color
							if (this.__currDrawingParams.hasVertexColor) {
								colors[colors._index++] = (vertex.color.r || 0);
								colors[colors._index++] = (vertex.color.g || 0);
								colors[colors._index++] = (vertex.color.b || 0);
								colors[colors._index++] = (vertex.color.a || 0);
							}

							// push position
							positions[positions._index++] = (vertex.position.x || 0);
							positions[positions._index++] = (vertex.position.y || 0);
							positions[positions._index++] = (vertex.position.z || 0);

							// every 3 vertices..
							if (i++ === 2) {
								// update quads count
								this.__polyCount++;

								// check if full
								if (this.__polyCount >= this.__maxPolyCount) {
									this._handleFullBuffer();
								}

								// reset count
								i = 0;
							}
						}

						// mark as dirty
						this.__dirty = true;
					}

					/**
					 * Add a rectangle to draw.
					 * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
					 * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
					 * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
					 * @param {Number=} rotation Rotate rectangle.
					 * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
					 * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
					 */
					drawQuad(position, size, color, rotation, origin, skew) {
						let sprite = this.#_gfx.Sprite.build(null, position, size, undefined, color, rotation, origin, skew);
						this.#_addRect(sprite);
					}

					/**
					 * Adds a 1x1 point.
					 * @param {Vector2|Vector3} position Point position.
					 * @param {Color} color Point color.
					 */
					addPoint(position, color) {
						this.drawVertices([new Vertex(position, null, color), new Vertex(position.add(2, 0), null, color), new Vertex(position.add(0, 2), null, color)]);
					}

					/**
					 * Add a rectangle that covers a given destination rectangle.
					 * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
					 * @param {Color|Array<Color>|undefined=} color Rectangle color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
					 * @param {Number=} rotation Rotate rectangle.
					 * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
					 */
					drawRectangle(destRect, color, rotation, origin) {
						if ((destRect.isVector2) || (destRect.isVector3)) {
							destRect = new Rectangle(0, 0, destRect.x, destRect.y);
						}
						let position = origin ? destRect.getPosition().addSelf(size.mul(origin)) : destRect.getCenter();
						origin = origin || Vector2.halfReadonly;
						let size = destRect.getSize();
						this.drawQuad(position, size, color, rotation, origin);
					}

					/**
					 * Draw a colored circle.
					 * @param {Circle} circle Circle to draw.
					 * @param {Color} color Circle fill color.
					 * @param {Number=} segmentsCount How many segments to build the circle from (more segments = smoother circle).
					 * @param {Color=} outsideColor If provided, will create a gradient-colored circle and this value will be the outter side color.
					 * @param {Number|Vector2=} ratio If procided, will scale the circle on X and Y axis to turn it into an oval. If a number is provided, will use this number to scale Y axis.
					 * @param {Number=} rotation If provided will rotate the oval / circle.
					 */
					drawCircle(circle, color, segmentsCount, outsideColor, ratio, rotation) {
						// sanity
						this.__validateDrawing(true);

						// defaults segments count
						if (segmentsCount === undefined) {
							segmentsCount = 24;
						}
						else if (segmentsCount < 2) {
							return;
						}

						// default outside color
						if (!outsideColor) {
							outsideColor = color;
						}

						// default ratio
						if (!ratio) {
							ratio = Vector2.oneReadonly;
						}
						else if (typeof ratio === 'number') {
							ratio = new Vector2(1, ratio);
						}

						// for rotation
						let rotateVec;
						if (rotation) {
							let cos = Math.cos(rotation);
							let sin = Math.sin(rotation);
							rotateVec = function(vector) {
								let x = (vector.x * cos - vector.y * sin);
								let y = (vector.x * sin + vector.y * cos);
								vector.x = x;
								vector.y = y;
								return vector;
							};
						}

						// build first position that is not center
						const segmentStep = (2 * Math.PI) / segmentsCount;
						let prevPoint = new Vector2(
							(circle.radius * Math.cos(0)) * ratio.x,
							(circle.radius * Math.sin(0)) * ratio.y
						);
						if (rotateVec) { rotateVec(prevPoint); }

						// generate list of vertices to draw the circle
						for (let i = 1; i <= segmentsCount; i++) {
							let newPoint = new Vector2(
								(circle.radius * Math.cos(i * segmentStep)) * ratio.x,
								(circle.radius * Math.sin(i * segmentStep)) * ratio.y
							);
							if (rotateVec) { rotateVec(newPoint); }
							this.drawVertices([
								new Vertex(circle.center, null, color),
								new Vertex(prevPoint.add(circle.center), null, outsideColor),
								new Vertex(newPoint.add(circle.center), null, outsideColor),
							]);
							prevPoint = newPoint;
						}
					}

					/**
					 * Add a rectangle from sprite data.
					 * @private
					 */
					#_addRect(sprite, transform) {
						// sanity
						this.__validateDrawing(true);

						// mark as dirty
						this.__dirty = true;

						// add rectangle from sprite data
						{
							// calculate vertices positions
							let sizeX = sprite.size.x;
							let sizeY = sprite.size.y;
							let left = -sizeX * sprite.origin.x;
							let top = -sizeY * sprite.origin.y;

							// calculate corners
							topLeft.x = left; topLeft.y = top;
							topRight.x = left + sizeX; topRight.y = top;
							bottomLeft.x = left; bottomLeft.y = top + sizeY;
							bottomRight.x = left + sizeX; bottomRight.y = top + sizeY;

							// are vertices axis aligned?
							let axisAlined = true;

							// apply skew
							if (sprite.skew) {
								// skew on x axis
								if (sprite.skew.x) {
									topLeft.x += sprite.skew.x * sprite.origin.y;
									topRight.x += sprite.skew.x * sprite.origin.y;
									bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
									bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
									axisAlined = false;
								}
								// skew on y axis
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
								function rotateVec(vector) {
									let x = (vector.x * cos - vector.y * sin);
									let y = (vector.x * sin + vector.y * cos);
									vector.x = x;
									vector.y = y;
								}
								rotateVec(topLeft);
								rotateVec(topRight);
								rotateVec(bottomLeft);
								rotateVec(bottomRight);
								axisAlined = false;
							}

							// add sprite position
							topLeft.x += sprite.position.x;
							topLeft.y += sprite.position.y;
							topRight.x += sprite.position.x;
							topRight.y += sprite.position.y;
							bottomLeft.x += sprite.position.x;
							bottomLeft.y += sprite.position.y;
							bottomRight.x += sprite.position.x;
							bottomRight.y += sprite.position.y;

							// apply transform
							if (transform && !transform.isIdentity) {
								topLeft.copy((topLeft.z !== undefined) ? Matrix.transformVector3(transform, topLeft) : Matrix.transformVector2(transform, topLeft));
								topRight.copy((topRight.z !== undefined) ? Matrix.transformVector3(transform, topRight) : Matrix.transformVector2(transform, topRight));
								bottomLeft.copy((bottomLeft.z !== undefined) ? Matrix.transformVector3(transform, bottomLeft) : Matrix.transformVector2(transform, bottomLeft));
								bottomRight.copy((bottomRight.z !== undefined) ? Matrix.transformVector3(transform, bottomRight) : Matrix.transformVector2(transform, bottomRight));
							}

							// snap pixels
							if (this.snapPixels) {
								topLeft.floorSelf();
								topRight.floorSelf();
								bottomLeft.floorSelf();
								bottomRight.floorSelf();
							}

							// add rectangle vertices
							this.drawVertices([
								new Vertex(topLeft, null, sprite.color),
								new Vertex(topRight, null, sprite.color),
								new Vertex(bottomLeft, null, sprite.color),

								new Vertex(topRight, null, sprite.color),
								new Vertex(bottomLeft, null, sprite.color),
								new Vertex(bottomRight, null, sprite.color),
							]);
						}
					}

					/**
					 * Get how many polygons are currently in batch.
					 * @returns {Number} Polygons in batch count.
					 */
					get polygonsInBatch() {
						return this.__polyCount;
					}

					/**
					 * Get how many polygons this sprite batch can contain.
					 * @returns {Number} Max polygons count.
					 */
					get maxPolygonsCount() {
						return this.__maxPolyCount;
					}

					/**
					 * Check if this batch is full.
					 * @returns {Boolean} True if batch is full.
					 */
					get isFull() {
						return this.__polyCount >= this.__maxPolyCount;
					}

					/**
					 * Called when the batch becomes full while drawing and there's no handler.
					 * @private
					 */
					_handleFullBuffer() {
						// invoke on-overflow callback
						if (this.onOverflow) {
							this.onOverflow();
						}

						// draw current batch and clear
						this._drawBatch();
						this.clear();
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					_drawBatch() {
						// get default effect
						let effect = this.__currDrawingParams.effect;

						// get some members
						let gl = this.#_gl;
						let gfx = this.#_gfx;
						let positionArray = this._buffers.positionArray;
						let colorsArray = this.__currDrawingParams.hasVertexColor ? this._buffers.colorsArray : null;
						let positionBuffer = this._buffers.positionBuffer;
						let colorsBuffer = this._buffers.colorsBuffer;
						let indexBuffer = this._buffers.indexBuffer;

						// should copy buffers
						let needBuffersCopy = this.__dirty;

						// calculate current batch quads count
						let _currPolyCount = this.polygonsInBatch;

						// nothing to draw? skip
						if (_currPolyCount === 0) {
							return;
						}

						// call base method to set effect and draw params
						super._drawBatch();

						// copy position buffer
						effect.setPositionsAttribute(positionBuffer, true);
						if (needBuffersCopy) {
							gl.bufferData(gl.ARRAY_BUFFER,
								positionArray,
								this.__buffersUsage, 0, _currPolyCount * 3 * 3);
						}

						// copy color buffer
						if (this.__currDrawingParams.hasVertexColor && colorsBuffer) {
							effect.setColorsAttribute(colorsBuffer, true);
							if (needBuffersCopy && colorsArray) {
								gl.bufferData(gl.ARRAY_BUFFER,
									colorsArray,
									this.__buffersUsage, 0, _currPolyCount * 3 * 4);
							}
						}

						// set indices
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

						// draw elements
						gl.drawElements(gl.TRIANGLES, _currPolyCount * 3, this.__indicesType, 0);
						gfx._internal.drawCallsCount++;
						gfx._internal.drawShapePolygonsCount += _currPolyCount;

						// mark as not dirty
						this.__dirty = false;

						// if static, free arrays we no longer need them
						if (this.__staticBuffers) {
							this._buffers.positionArray = this._buffers.colorsArray = null;
						}
					}
				}

				// used for vertices calculations
				const topLeft = new Vector2(0, 0);
				const topRight = new Vector2(0, 0);
				const bottomLeft = new Vector2(0, 0);
				const bottomRight = new Vector2(0, 0);

				// export the shapes batch class
				module.exports = ShapesBatch;

				/***/
			}),

/***/ 962:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx sprite batch renderer.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\sprite_batch.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const TextureAssetBase = __webpack_require__(4397);
				const { Rectangle } = __webpack_require__(3624);
				const Vector2 = __webpack_require__(2544);
				const Vector3 = __webpack_require__(8329);
				const DrawBatch = __webpack_require__(2069);
				const SpriteBatchBase = __webpack_require__(6195);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-sprite-batch');


				/**
				 * Sprite batch renderer.
				 * Responsible to drawing a batch of sprites with as little draw calls as possible.
				 */
				class SpriteBatch extends SpriteBatchBase {
					/**
					 * Create the sprites batch.
					 * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
					 * @param {Boolean=} enableVertexColor If true (default) will support vertex color.
					 * @param {Boolean=} enableNormals If true (not default) will support vertex normals.
					 * @param {Boolean=} enableBinormals If true (not default) will support vertex binormals.
					 * @param {Boolean=} enableTangents If true (not default) will support vertex tangents.
					 */
					constructor(batchSpritesCount, enableVertexColor, enableNormals, enableBinormals, enableTangents) {
						// init draw batch
						super(batchSpritesCount, enableVertexColor, enableNormals, enableBinormals, enableTangents);
					}

					/**
					 * Get the gfx manager.
					 * @private
					 */
					get #_gfx() {
						return DrawBatch._gfx;
					}

					/**
					 * Get the web gl instance.
					 * @private
					 */
					get #_gl() {
						return DrawBatch._gfx._internal.gl;
					}

					/**
					 * @inheritdoc
					 */
					get defaultEffect() {
						return this.supportVertexColor ? this.#_gfx.builtinEffects.Sprites : this.#_gfx.builtinEffects.SpritesNoVertexColor;
					}

					/**
					 * Push vertices to drawing batch.
					 * @param {TextureAssetBase} texture Texture to draw.
					 * @param {Array<Vertex>} vertices Vertices to push. Vertices count must be dividable by 4 to keep the batch consistent of quads.
					 */
					drawVertices(texture, vertices) {
						// sanity
						this.__validateDrawing(true);

						// update texture
						this._updateTexture(texture);

						// sanity check
						if ((vertices.length % 4) !== 0) {
							_logger.warn("Tried to push vertices that are not multiplication of 4!");
							return;
						}

						// push vertices
						let i = 0;
						let colors = this._buffers.colorsArray;
						let uvs = this._buffers.textureArray;
						let positions = this._buffers.positionArray;
						let normals = this._buffers.normalsArray;
						let binormals = this._buffers.binormalsArray;
						let tangents = this._buffers.tangentsArray;
						for (let vertex of vertices) {
							// push color
							if (this.__currDrawingParams.hasVertexColor) {
								colors[colors._index++] = (vertex.color.r || 0);
								colors[colors._index++] = (vertex.color.g || 0);
								colors[colors._index++] = (vertex.color.b || 0);
								colors[colors._index++] = (vertex.color.a || 0);
							}

							// push normals
							if (normals) {
								if (vertex.normal) {
									normals[normals._index++] = vertex.normal.x;
									normals[normals._index++] = vertex.normal.y;
									normals[normals._index++] = vertex.normal.z;
								}
								else {
									normals[normals._index++] = normals[normals._index++] = normals[normals._index++] = 0;
								}
							}

							// push binormals
							if (binormals) {
								if (vertex.binormal) {
									binormals[binormals._index++] = vertex.binormal.x;
									binormals[binormals._index++] = vertex.binormal.y;
									binormals[binormals._index++] = vertex.binormal.z;
								}
								else {
									binormals[binormals._index++] = binormals[binormals._index++] = binormals[binormals._index++] = 0;
								}
							}

							// push tangents
							if (tangents) {
								if (vertex.tangent) {
									tangents[tangents._index++] = vertex.tangent.x;
									tangents[tangents._index++] = vertex.tangent.y;
									tangents[tangents._index++] = vertex.tangent.z;
								}
								else {
									tangents[tangents._index++] = tangents[tangents._index++] = tangents[tangents._index++] = 0;
								}
							}

							// push texture coords
							uvs[uvs._index++] = (vertex.textureCoord.x || 0);
							uvs[uvs._index++] = (vertex.textureCoord.y || 0);

							// push position
							positions[positions._index++] = (vertex.position.x || 0);
							positions[positions._index++] = (vertex.position.y || 0);
							positions[positions._index++] = (vertex.position.z || 0);

							// every 4 vertices..
							if (i++ === 3) {
								// update quads count
								this.__quadsCount++;

								// check if full
								if (this.__quadsCount >= this.__maxQuadsCount) {
									this._handleFullBuffer();
								}

								// reset count
								i = 0;
							}
						}

						// mark as dirty
						this.__dirty = true;
					}

					/**
					 * Add a quad to draw.
					 * @param {TextureAssetBase} texture Texture to draw.
					 * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
					 * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
					 * @param {Rectangle} sourceRectangle Source rectangle, or undefined to use the entire texture.
					 * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
					 * @param {Number=} rotation Rotate sprite.
					 * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
					 * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
					 */
					drawQuad(texture, position, size, sourceRectangle, color, rotation, origin, skew) {
						let sprite = this.#_gfx.Sprite.build(texture, position, size, sourceRectangle, color, rotation, origin, skew);
						this.drawSprite(sprite);
					}

					/**
					 * Add sprites group to this batch.
					 * @param {SpritesGroup} group Sprite group to draw.
					 * @param {Boolean=} cullOutOfScreen If true, will cull sprites that are not visible in currently set rendering region.
					 */
					drawSpriteGroup(group, cullOutOfScreen) {
						let transform = group.getTransform();
						this.drawSprite(group._sprites, transform, cullOutOfScreen);
					}

					/**
					 * Add a quad that covers a given destination rectangle.
					 * @param {TextureAssetBase} texture Texture to draw.
					 * @param {Rectangle|Vector2} destRect Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size.
					 * @param {Rectangle=} sourceRect Source rectangle, or undefined to use the entire texture.
					 * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
					 * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
					 */
					drawRectangle(texture, destRect, sourceRect, color, origin) {
						if ((destRect.isVector2) || (destRect.isVector3)) {
							destRect = new Rectangle(0, 0, destRect.x, destRect.y);
						}
						let position = origin ? destRect.getPosition().addSelf(size.mul(origin)) : destRect.getCenter();
						origin = origin || Vector2.halfReadonly;
						let size = destRect.getSize();
						this.drawQuad(texture, position, size, sourceRect, color);
					}
				}


				// export the sprite batch class
				module.exports = SpriteBatch;

				/***/
			}),

/***/ 7561:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx sprite batch renderer.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\sprite_batch_3d.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const DrawBatch = __webpack_require__(2069);
				const SpriteBatch = __webpack_require__(962);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-sprite-batch');


				/**
				 * 3D Sprites batch renderer.
				 * Responsible to drawing 3D quads with textures on them.
				 */
				class SpriteBatch3D extends SpriteBatch {
					/**
					 * Create the 3d sprites batch.
					 * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
					 * @param {Boolean=} enableNormals If true (not default) will support vertex normals.
					 * @param {Boolean=} enableBinormals If true (not default) will support vertex binormals.
					 * @param {Boolean=} enableTangents If true (not default) will support vertex tangents.
					 */
					constructor(batchSpritesCount, enableNormals, enableBinormals, enableTangents) {
						super(batchSpritesCount, true, enableNormals, enableBinormals, enableTangents);
						this.__camera = this.#_gfx.createCamera3D();
						this.setPerspectiveCamera();
						this.camera.setViewLookat();
					}

					/**
					 * Get camera instance.
					 * @returns {Camera} Camera instance.
					 */
					get camera() {
						return this.__camera;
					}

					/**
					 * Set perspective camera.
					 * @param {Number=} fieldOfView Camera field of view.
					 * @param {Number=} aspectRatio Camera aspect ratio
					 * @param {Number=} zNear Z near plane.
					 * @param {Number=} zFar Z far plane.
					 */
					setPerspectiveCamera(fieldOfView, aspectRatio, zNear, zFar) {
						let camera = this.__camera;
						fieldOfView = fieldOfView || ((45 * Math.PI) / 180);
						aspectRatio = aspectRatio || (this.#_gfx.getRenderingSize().x / this.#_gfx.getRenderingSize().y);
						zNear = zNear || 0.1;
						zFar = zFar || 10000.0;
						camera.perspective(fieldOfView, aspectRatio, zNear, zFar);
					}

					/**
					 * Get the gfx manager.
					 * @private
					 */
					get #_gfx() {
						return DrawBatch._gfx;
					}

					/**
					 * Get the web gl instance.
					 * @private
					 */
					get #_gl() {
						return DrawBatch._gfx._internal.gl;
					}

					/**
					 * @inheritdoc
					 */
					get supportVertexColor() {
						return true;
					}

					/**
					 * @inheritdoc
					 */
					get defaultEffect() {
						return this.#_gfx.builtinEffects.Sprites3d;
					}

					/**
					 * Set the camera for this batch.
					 * @param {Camera} camera Camera object to apply when drawing, or null if you want to set the camera manually.
					 */
					setCamera(camera) {
						this.__camera = camera;
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					_onSetEffect(effect, texture) {
						if (this.__camera.view) { effect.setViewMatrix(this.__camera.view); }
						if (this.__camera) { this.#_gfx.applyCamera(this.__camera); }
					}
				}


				// export the sprite batch class
				module.exports = SpriteBatch3D;

				/***/
			}),

/***/ 6195:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx sprite batch renderer base class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\sprite_batch_base.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const { Rectangle } = __webpack_require__(3624);
				const Vector2 = __webpack_require__(2544);
				const Matrix = __webpack_require__(5529);
				const DrawBatch = __webpack_require__(2069);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-sprite-batch');


				/**
				 * Base class for sprite-based rendering, ie vertices with textures.
				 */
				class SpriteBatchBase extends DrawBatch {
					/**
					 * Create the sprites batch.
					 * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
					 * @param {Boolean=} enableVertexColor If true (default) will support vertex color.
					 * @param {Boolean=} enableNormals If true (not default) will support vertex normals.
					 * @param {Boolean=} enableBinormals If true (not default) will support vertex binormals.
					 * @param {Boolean=} enableTangents If true (not default) will support vertex tangents.
					 */
					constructor(batchSpritesCount, enableVertexColor, enableNormals, enableBinormals, enableTangents) {
						// init draw batch
						super();

						// create buffers for drawing sprites
						this.#_createBuffers(batchSpritesCount || 500, enableVertexColor, Boolean(enableNormals), Boolean(enableBinormals), Boolean(enableTangents));

						/**
						 * How many quads this batch can hold.
						 * @private
						 */
						this.__maxQuadsCount = Math.floor((this._buffers.positionArray.length / 12));

						/**
						 * How many quads we currently have.
						 * @private
						 */
						this.__quadsCount = 0;

						/**
						 * Indicate there were changes in buffers.
						 * @private
						 */
						this.__dirty = false;

						/**
						 * Optional method to trigger when sprite batch overflows and can't contain any more quads.
						 * @type {Function}
						 * @name SpriteBatch#onOverflow
						 */
						this.onOverflow = null;

						/**
						 * Optional method to trigger right before drawing this batch.
						 * Receive params: effect, texture.
						 * @type {Function}
						 * @name SpriteBatch#beforeDraw
						 */
						this.beforeDraw = null;

						/**
						 * If true, will floor vertices positions before pushing them to batch.
						 * @type {Boolean}
						 * @name SpriteBatch#snapPixels
						 */
						this.snapPixels = false;

						/**
						 * If true, will cull quads that are not visible in screen when adding them by default.
						 * Note: will cull based on screen region during the time of adding sprite, not the time of actually rendering it.
						 * @type {Boolean}
						 * @name SpriteBatch#cullOutOfScreen
						 */
						this.cullOutOfScreen = false;
					}

					/**
					 * Get the gfx manager.
					 * @private
					 */
					get #_gfx() {
						return DrawBatch._gfx;
					}

					/**
					 * Get the web gl instance.
					 * @private
					 */
					get #_gl() {
						return DrawBatch._gfx._internal.gl;
					}

					/**
					 * @inheritdoc
					 */
					destroy() {
						let gl = this.#_gl;
						if (this._buffers) {
							if (this._buffers.positionBuffer) gl.deleteBuffer(this._buffers.positionBuffer);
							if (this._buffers.colorsBuffer) gl.deleteBuffer(this._buffers.colorsBuffer);
							if (this._buffers.textureCoordBuffer) gl.deleteBuffer(this._buffers.textureCoordBuffer);
							if (this._buffers.normalsBuffer) gl.deleteBuffer(this._buffers.normalsBuffer);
							if (this._buffers.binormalsBuffer) gl.deleteBuffer(this._buffers.binormalsBuffer);
							if (this._buffers.tangentsBuffer) gl.deleteBuffer(this._buffers.tangentsBuffer);
						}
						this._buffers = null;
					}

					/**
					 * @inheritdoc
					 */
					get isDestroyed() {
						return Boolean(this._buffers) === false;
					}

					/**
					 * Build the dynamic buffers.
					 * @private
					 */
					#_createBuffers(batchSpritesCount, enableVertexColor, enableNormals, enableBinormals, enableTangents) {
						let gl = this.#_gl;

						// default enable vertex color
						if (enableVertexColor === undefined) { enableVertexColor = true; }

						// dynamic buffers, used for batch rendering
						this._buffers = {

							positionBuffer: gl.createBuffer(),
							positionArray: new Float32Array(3 * 4 * batchSpritesCount),

							textureCoordBuffer: gl.createBuffer(),
							textureArray: new Float32Array(2 * 4 * batchSpritesCount),

							colorsBuffer: enableVertexColor ? gl.createBuffer() : null,
							colorsArray: enableVertexColor ? (new Float32Array(4 * 4 * batchSpritesCount)) : null,

							normalsBuffer: enableNormals ? gl.createBuffer() : null,
							normalsArray: enableNormals ? (new Float32Array(3 * 4 * batchSpritesCount)) : null,

							binormalsBuffer: enableBinormals ? gl.createBuffer() : null,
							binormalsArray: enableBinormals ? (new Float32Array(3 * 4 * batchSpritesCount)) : null,

							tangentsBuffer: enableTangents ? gl.createBuffer() : null,
							tangentsArray: enableTangents ? (new Float32Array(3 * 4 * batchSpritesCount)) : null,

							indexBuffer: gl.createBuffer(),
						};

						// create the indices buffer
						let maxIndex = (batchSpritesCount * 4);
						let indicesArrayType;
						if (maxIndex <= 256) {
							indicesArrayType = Uint8Array;
							this.__indicesType = gl.UNSIGNED_BYTE;
						}
						if (maxIndex <= 65535) {
							indicesArrayType = Uint16Array;
							this.__indicesType = gl.UNSIGNED_SHORT;
						}
						else {
							indicesArrayType = Uint32Array;
							this.__indicesType = gl.UNSIGNED_INT;
						}
						let indices = new indicesArrayType(batchSpritesCount * 6); // 6 = number of indices per sprite
						let inc = 0;
						for (let i = 0; i < indices.length; i += 6) {

							indices[i] = inc;
							indices[i + 1] = inc + 1;
							indices[i + 2] = inc + 2;

							indices[i + 3] = inc + 1;
							indices[i + 4] = inc + 3;
							indices[i + 5] = inc + 2;

							inc += 4;
						}
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffers.indexBuffer);
						gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

						// extand buffers functionality
						function extendBuffer(buff) {
							if (buff) { buff._index = 0; }
						}
						extendBuffer(this._buffers.positionArray);
						extendBuffer(this._buffers.textureArray);
						extendBuffer(this._buffers.colorsArray);
						extendBuffer(this._buffers.normalsArray);
						extendBuffer(this._buffers.binormalsArray);
						extendBuffer(this._buffers.tangentsArray);
					}

					/**
					 * @inheritdoc
					 */
					clear() {
						super.clear();
						if (this._buffers.positionArray) { this._buffers.positionArray._index = 0; }
						if (this._buffers.textureArray) { this._buffers.textureArray._index = 0; }
						if (this._buffers.normalsArray) { this._buffers.normalsArray._index = 0; }
						if (this._buffers.binormalsArray) { this._buffers.binormalsArray._index = 0; }
						if (this._buffers.tangentsArray) { this._buffers.tangentsArray._index = 0; }
						if (this._buffers.colorsArray && this.supportVertexColor) { this._buffers.colorsArray._index = 0; }
						this.__quadsCount = 0;
						this.__dirty = false;
					}

					/**
					 * Set a new active texture and draw batch if needed.
					 * @private
					 */
					_updateTexture(texture) {
						// if texture changed, draw current batch first
						if (this.__currDrawingParams.texture && (this.__currDrawingParams.texture != texture)) {
							this._drawBatch();
							this.clear();
							this.__dirty = true;
						}

						// set active texture
						this.__currDrawingParams.texture = texture;
					}

					/**
					 * Get if this sprite batch support vertex color.
					 * @returns {Boolean} True if support vertex color.
					 */
					get supportVertexColor() {
						return Boolean(this._buffers.colorsBuffer);
					}

					/**
					 * @inheritdoc
					 */
					get defaultEffect() {
						return this.supportVertexColor ? this.#_gfx.builtinEffects.Sprites : this.#_gfx.builtinEffects.SpritesNoVertexColor;
					}

					/**
					 * Add sprite or sprites to batch.
					 * @param {Sprite|Array<Sprite>} sprites Sprite or multiple sprites to draw.
					 * @param {Matrix=} transform Optional transformations to apply on sprite vertices. Won't apply on static sprites.
					 * @param {Boolean=} cullOutOfScreen If true, will cull sprites that are not visible in currently set rendering region.
					 */
					drawSprite(sprites, transform, cullOutOfScreen) {
						// sanity
						this.__validateDrawing(true);

						// make sure array
						if (!Array.isArray(sprites)) {
							sprites = [sprites];
						}

						// mark as dirty
						this.__dirty = true;

						// get colors and uvs array
						let colors = this._buffers.colorsArray;
						let uvs = this._buffers.textureArray;

						// get screen region for culling
						const screenRegion = (cullOutOfScreen || (this.cullOutOfScreen && (cullOutOfScreen === undefined))) ? this.#_gfx._internal.getRenderingRegionInternal() : null;

						// add all sprites
						for (let sprite of sprites) {

							// update texture
							this._updateTexture(sprite.texture);

							// update quads count
							this.__quadsCount++;

							// set colors
							if (colors && this.__currDrawingParams.hasVertexColor) {

								// array of colors
								if (Array.isArray(sprite.color)) {
									let lastColor = sprite.color[0];
									for (let x = 0; x < 4; ++x) {
										let curr = (sprite.color[x] || lastColor);
										colors[colors._index++] = curr.r;
										colors[colors._index++] = curr.g;
										colors[colors._index++] = curr.b;
										colors[colors._index++] = curr.a;
										lastColor = curr;
									}
								}
								// single color
								else {
									let curr = sprite.color;
									for (let x = 0; x < 4; ++x) {
										colors[colors._index++] = curr.r;
										colors[colors._index++] = curr.g;
										colors[colors._index++] = curr.b;
										colors[colors._index++] = curr.a;
									}
								}

							}

							// get source rectangle
							let sourceRect = sprite.sourceRectangle;
							let textureSourceRect = sprite.texture.sourceRectangle;

							// if got source rectangle, set it
							if (sourceRect) {
								textureSourceRect = textureSourceRect || { x: 0, y: 0, width: 0, height: 0 };
								let twidth = sprite.texture.width;
								let theight = sprite.texture.height;
								let left = (sourceRect.left + textureSourceRect.x) / twidth;
								let right = (sourceRect.right + textureSourceRect.x) / twidth;
								let top = (sourceRect.top + textureSourceRect.y) / theight;
								let bottom = (sourceRect.bottom + textureSourceRect.y) / theight;
								uvs[uvs._index++] = (left); uvs[uvs._index++] = (top);
								uvs[uvs._index++] = (right); uvs[uvs._index++] = (top);
								uvs[uvs._index++] = (left); uvs[uvs._index++] = (bottom);
								uvs[uvs._index++] = (right); uvs[uvs._index++] = (bottom);
							}
							// if got source rectangle from texture (texture atlas without source rect), set it
							else if (textureSourceRect) {
								let normalized = sprite.texture.sourceRectangleNormalized;
								let twidth = sprite.texture.width;
								let theight = sprite.texture.height;
								let left = normalized.left || (textureSourceRect.left) / twidth;
								let right = normalized.right || (textureSourceRect.right) / twidth;
								let top = normalized.top || (textureSourceRect.top) / theight;
								let bottom = normalized.bottom || (textureSourceRect.bottom) / theight;
								uvs[uvs._index++] = (left); uvs[uvs._index++] = (top);
								uvs[uvs._index++] = (right); uvs[uvs._index++] = (top);
								uvs[uvs._index++] = (left); uvs[uvs._index++] = (bottom);
								uvs[uvs._index++] = (right); uvs[uvs._index++] = (bottom);
							}
							// if got no source rectangle, take entire texture
							else {
								uvs[uvs._index++] = 0; uvs[uvs._index++] = 0;
								uvs[uvs._index++] = 1; uvs[uvs._index++] = 0;
								uvs[uvs._index++] = 0; uvs[uvs._index++] = 1;
								uvs[uvs._index++] = 1; uvs[uvs._index++] = 1;
							}

							// calculate vertices positions
							let sizeX = sprite.size.x;
							let sizeY = sprite.size.y;
							let left = -sizeX * sprite.origin.x;
							let top = -sizeY * sprite.origin.y;

							// calculate corners
							topLeft.x = left; topLeft.y = top;
							topRight.x = left + sizeX; topRight.y = top;
							bottomLeft.x = left; bottomLeft.y = top + sizeY;
							bottomRight.x = left + sizeX; bottomRight.y = top + sizeY;

							// are vertices axis aligned?
							let axisAlined = true;

							// apply skew
							if (sprite.skew) {
								// skew on x axis
								if (sprite.skew.x) {
									topLeft.x += sprite.skew.x * sprite.origin.y;
									topRight.x += sprite.skew.x * sprite.origin.y;
									bottomLeft.x -= sprite.skew.x * (1 - sprite.origin.y);
									bottomRight.x -= sprite.skew.x * (1 - sprite.origin.y);
									axisAlined = false;
								}
								// skew on y axis
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
								function rotateVec(vector) {
									let x = (vector.x * cos - vector.y * sin);
									let y = (vector.x * sin + vector.y * cos);
									vector.x = x;
									vector.y = y;
								}
								rotateVec(topLeft);
								rotateVec(topRight);
								rotateVec(bottomLeft);
								rotateVec(bottomRight);
								axisAlined = false;
							}

							// add sprite position
							topLeft.x += sprite.position.x;
							topLeft.y += sprite.position.y;
							topRight.x += sprite.position.x;
							topRight.y += sprite.position.y;
							bottomLeft.x += sprite.position.x;
							bottomLeft.y += sprite.position.y;
							bottomRight.x += sprite.position.x;
							bottomRight.y += sprite.position.y;

							// apply transform
							if (transform && !transform.isIdentity) {
								topLeft.copy((topLeft.z !== undefined) ? Matrix.transformVector3(transform, topLeft) : Matrix.transformVector2(transform, topLeft));
								topRight.copy((topRight.z !== undefined) ? Matrix.transformVector3(transform, topRight) : Matrix.transformVector2(transform, topRight));
								bottomLeft.copy((bottomLeft.z !== undefined) ? Matrix.transformVector3(transform, bottomLeft) : Matrix.transformVector2(transform, bottomLeft));
								bottomRight.copy((bottomRight.z !== undefined) ? Matrix.transformVector3(transform, bottomRight) : Matrix.transformVector2(transform, bottomRight));
							}

							// cull out-of-screen sprites
							if (screenRegion) {
								let destRect = axisAlined ?
									new Rectangle(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y) :
									Rectangle.fromPoints([topLeft, topRight, bottomLeft, bottomRight]);

								if (!screenRegion.collideRect(destRect)) {
									return;
								}
							}

							// snap pixels
							if (this.snapPixels) {
								topLeft.floorSelf();
								topRight.floorSelf();
								bottomLeft.floorSelf();
								bottomRight.floorSelf();
							}

							// optional z position
							let z = sprite.position.z || 0;
							let zDepth = z + sprite.size.z || 0;

							// update positions buffer
							let positions = this._buffers.positionArray;
							positions[positions._index++] = topLeft.x; positions[positions._index++] = topLeft.y; positions[positions._index++] = z;
							positions[positions._index++] = topRight.x; positions[positions._index++] = topRight.y; positions[positions._index++] = z;
							positions[positions._index++] = bottomLeft.x; positions[positions._index++] = bottomLeft.y; positions[positions._index++] = zDepth;
							positions[positions._index++] = bottomRight.x; positions[positions._index++] = bottomRight.y; positions[positions._index++] = zDepth;

							// update normals buffer
							let normals = this._buffers.normalsArray;
							if (normals) {
								normals[normals._index++] = 0;
								normals[normals._index++] = 0;
								normals[normals._index++] = 1;
							}

							// update default binormals buffer
							let binormals = this._buffers.binormalsArray;
							if (binormals) {
								binormals[binormals._index++] = 1;
								binormals[binormals._index++] = 0;
								binormals[binormals._index++] = 0;
							}

							// update default tangents buffer
							let tangents = this._buffers.tangentsArray;
							if (tangents) {
								tangents[tangents._index++] = 0;
								tangents[tangents._index++] = 1;
								tangents[tangents._index++] = 0;
							}

							// check if full
							if (this.__quadsCount >= this.__maxQuadsCount) {
								this._handleFullBuffer();
							}
						}
					}

					/**
					 * Get how many quads are currently in batch.
					 * @returns {Number} Quads in batch count.
					 */
					get quadsInBatch() {
						return this.__quadsCount;
					}

					/**
					 * Get how many quads this sprite batch can contain.
					 * @returns {Number} Max quads count.
					 */
					get maxQuadsCount() {
						return this.__maxQuadsCount;
					}

					/**
					 * Check if this batch is full.
					 * @returns {Boolean} True if batch is full.
					 */
					get isFull() {
						return this.__quadsCount >= this.__maxQuadsCount;
					}

					/**
					 * Called when the batch becomes full while drawing and there's no handler.
					 * @private
					 */
					_handleFullBuffer() {
						// invoke on-overflow callback
						if (this.onOverflow) {
							this.onOverflow();
						}

						// draw current batch and clear
						this._drawBatch();
						this.clear();
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					_drawBatch() {
						// get texture and effect
						let texture = this.__currDrawingParams.texture;
						let effect = this.__currDrawingParams.effect;

						// texture not loaded yet? skip
						if (!texture || !texture.valid) {
							return;
						}

						// should copy buffers
						let needBuffersCopy = this.__dirty;

						// calculate current batch quads count
						let _currBatchCount = this.quadsInBatch;

						// nothing to draw? skip
						if (_currBatchCount === 0) {
							return;
						}

						// call the before-draw callback
						if (this.beforeDraw) {
							this.beforeDraw(effect, texture);
						}

						// get some fields we'll need
						let gl = this.#_gl;
						let gfx = this.#_gfx;
						let positionArray = this._buffers.positionArray;
						let textureArray = this._buffers.textureArray;
						let colorsArray = this.__currDrawingParams.hasVertexColor ? this._buffers.colorsArray : null;
						let normalsArray = this._buffers.normalsArray;
						let binormalsArray = this._buffers.binormalsArray;
						let tangentsArray = this._buffers.tangentsArray;
						let positionBuffer = this._buffers.positionBuffer;
						let textureCoordBuffer = this._buffers.textureCoordBuffer;
						let colorsBuffer = this._buffers.colorsBuffer;
						let normalsBuffer = this._buffers.normalsBuffer;
						let binormalsBuffer = this._buffers.binormalsBuffer;
						let tangentsBuffer = this._buffers.tangentsBuffer;
						let indexBuffer = this._buffers.indexBuffer;

						// call base method to set effect and draw params
						super._drawBatch();

						// copy position buffer
						effect.setPositionsAttribute(positionBuffer, true);
						if (needBuffersCopy) {
							gl.bufferData(gl.ARRAY_BUFFER,
								positionArray,
								this.__buffersUsage, 0, _currBatchCount * 4 * 3);
						}

						// copy texture buffer
						effect.setTextureCoordsAttribute(textureCoordBuffer, true);
						if (needBuffersCopy) {
							gl.bufferData(gl.ARRAY_BUFFER,
								textureArray,
								this.__buffersUsage, 0, _currBatchCount * 4 * 2);
						}

						// copy color buffer
						if (this.__currDrawingParams.hasVertexColor && colorsBuffer) {
							effect.setColorsAttribute(colorsBuffer, true);
							if (needBuffersCopy && colorsArray) {
								gl.bufferData(gl.ARRAY_BUFFER,
									colorsArray,
									this.__buffersUsage, 0, _currBatchCount * 4 * 4);
							}
						}

						// copy normals buffer
						if (normalsBuffer) {
							effect.setNormalsAttribute(normalsBuffer, true);
							if (needBuffersCopy && normalsArray) {
								gl.bufferData(gl.ARRAY_BUFFER,
									normalsArray,
									this.__buffersUsage, 0, _currBatchCount * 4 * 3);
							}
						}

						// copy binormals buffer
						if (binormalsBuffer) {
							effect.setBinormalsAttribute(binormalsBuffer, true);
							if (needBuffersCopy && binormalsArray) {
								gl.bufferData(gl.ARRAY_BUFFER,
									binormalsArray,
									this.__buffersUsage, 0, _currBatchCount * 4 * 3);
							}
						}

						// copy tangents buffer
						if (tangentsBuffer) {
							effect.setTangentsAttribute(tangentsBuffer, true);
							if (needBuffersCopy && tangentsArray) {
								gl.bufferData(gl.ARRAY_BUFFER,
									tangentsArray,
									this.__buffersUsage, 0, _currBatchCount * 4 * 3);
							}
						}

						// set indices
						gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

						// draw elements
						gl.drawElements(gl.TRIANGLES, _currBatchCount * 6, this.__indicesType, 0);
						gfx._internal.drawCallsCount++;
						gfx._internal.drawQuadsCount += _currBatchCount;

						// mark as not dirty
						this.__dirty = false;

						// if static, free arrays we no longer need them
						if (this.__staticBuffers) {
							this._buffers.positionArray = this._buffers.textureArray = this._buffers.colorsArray = null;
						}
					}
				}

				// used for vertices calculations
				const topLeft = new Vector2(0, 0);
				const topRight = new Vector2(0, 0);
				const bottomLeft = new Vector2(0, 0);
				const bottomRight = new Vector2(0, 0);

				// export the sprite batch base class
				module.exports = SpriteBatchBase;

				/***/
			}),

/***/ 985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx text sprite batch renderer.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\draw_batches\text_batch.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const FontTextureAsset = __webpack_require__(167);
				const MsdfFontTextureAsset = __webpack_require__(1252);
				const { Color } = __webpack_require__(3624);
				const SpritesGroup = __webpack_require__(1036);
				const DrawBatch = __webpack_require__(2069);
				const SpriteBatch = __webpack_require__(962);
				const SpriteBatchBase = __webpack_require__(6195);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-effect');


				/**
				 * Text sprite batch renderer.
				 * Responsible to drawing a batch of characters sprites.
				 */
				class TextSpriteBatch extends SpriteBatchBase {
					/**
					 * Create the text sprites batch.
					 * @param {Number=} batchSpritesCount Internal buffers size, in sprites count (sprite = 4 vertices). Bigger value = faster rendering but more RAM.
					 */
					constructor(batchSpritesCount) {
						super(batchSpritesCount, true);

						/**
						 * If true, will render as Msdf Fonts.
						 * @type {Boolean}
						 * @name TextSpriteBatch#msdfFont
						 */
						this.msdfFont = false;

						/**
						 * If bigger than 0, will draw outline.
						 * Currently not supported with msdf fonts.
						 * Must be set before begin() is called.
						 * @type {Number}
						 * @name TextSpriteBatch#outlineWeight
						 */
						this.outlineWeight = 0;

						/**
						 * Outline color, when outlineWeight is set.
						 * Must be set before begin() is called.
						 * @type {Color}
						 * @name TextSpriteBatch#outlineColor
						 */
						this.outlineColor = Color.black;
					}

					/**
					 * Get the gfx manager.
					 * @private
					 */
					get #_gfx() {
						return DrawBatch._gfx;
					}

					/**
					 * Get the web gl instance.
					 * @private
					 */
					get #_gl() {
						return DrawBatch._gfx._internal.gl;
					}

					/**
					 * @inheritdoc
					 */
					get defaultEffect() {
						return this.msdfFont ?
							this.#_gfx.builtinEffects.MsdfFont :
							(this.outlineWeight ? this.#_gfx.builtinEffects.SpritesWithOutline : this.#_gfx.builtinEffects.Sprites);
					}

					/**
					 * Add text sprites group to batch.
					 * @param {SpritesGroup} textGroup Text sprite group to draw.
					 * @param {Boolean} cullOutOfScreen If true, will cull out sprites that are not visible in screen.
					 */
					drawText(textGroup, cullOutOfScreen) {
						let transform = textGroup.getTransform();
						this.drawSprite(textGroup._sprites, transform, cullOutOfScreen);
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					_drawBatch() {
						// extract texture
						let texture = this.__currDrawingParams.texture;

						// sanity for msdf font
						if (this.msdfFont && !(texture.isMsdfFontTextureAsset)) {
							_logger.warn("Trying to render an MSDF font but using an asset that isn't an instance of 'MsdfFontTextureAsset'!");
						}

						// sanity for none msdf font
						if (!this.msdfFont && !(texture.isFontTextureAsset)) {
							_logger.warn("Trying to render text sprites but using an asset that isn't an instance of 'FontTextureAsset'!");
						}

						// set default effect and blend mode
						let effect = this.__currDrawingParams.effect || this.defaultEffect;

						// setup outline
						if (this.outlineWeight) {
							effect.setOutline(this.outlineWeight, this.outlineColor);
						}

						// extract font texture and set in sprite batch before calling internal draw
						let prevFontTexture = this.__currDrawingParams.texture;
						this.__currDrawingParams.texture = texture.texture;
						super._drawBatch();
						this.__currDrawingParams.texture = prevFontTexture;
					}
				}


				// export the text sprite batch class
				module.exports = TextSpriteBatch;

				/***/
			}),

/***/ 8986:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Effect base class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\effect.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Color = __webpack_require__(9327);
				const { TextureFilterModes } = __webpack_require__(5387);
				const { TextureWrapMode, TextureWrapModes } = __webpack_require__(2464);
				const Matrix = __webpack_require__(5529);
				const Vector2 = __webpack_require__(2544);
				const TextureAssetBase = __webpack_require__(4397);
				const _logger = (__webpack_require__(5259).getLogger)('gfx-effect');

				// currently applied effect
				let _currEffect = null;

				// will store all supported depth funcs
				let _depthFuncs = null;


				/**
				 * Effect base class.
				 * An effect = vertex shader + fragment shader + uniforms & attributes + setup code.
				 */
				class Effect {
					/**
					 * Create the effect.
					 */
					constructor() {
						this.#_build(Effect._gfx._internal.gl);
					}

					/**
					 * Build the effect.
					 * Called from gfx manager.
					 * @private
					 * @param {WebGl} gl WebGL context.
					 */
					#_build(gl) {
						// create program
						let program = gl.createProgram();

						// build vertex shader
						{
							let shader = compileShader(this.constructor, gl, this.vertexCode, gl.VERTEX_SHADER);
							gl.attachShader(program, shader);
						}

						// build fragment shader
						{
							let shader = compileShader(this.constructor, gl, this.fragmentCode, gl.FRAGMENT_SHADER);
							gl.attachShader(program, shader);
						}

						// link program
						gl.linkProgram(program);

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

						// values waiting to set as soon as the effect turns active
						this._pendingUniformValues = {};
						this._pendingAttributeValues = {};

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
										if (_currEffect !== _this) {
											_this._pendingUniformValues[name] = [mat];
											return;
										}
										_this._gl[method](location, false, mat);
									};
								})(this, uniform, uniformLocation, uniformData.type);
							}
							// build setter method for textures
							else if (uniformData.type === UniformTypes.Texture) {
								(function(_this, name, location, method) {
									_this.uniforms[name] = (texture, index) => {
										if (_currEffect !== _this) {
											_this._pendingUniformValues[name] = [texture, index];
											return;
										}
										index = index || 0;
										const glTexture = texture._glTexture || texture;
										const textureCode = _this._gl['TEXTURE' + (index || 0)];
										_this._gl.activeTexture(textureCode);
										_this._gl.bindTexture(_this._gl.TEXTURE_2D, glTexture);
										_this._gl.uniform1i(location, (index || 0));
										if (texture.filter) { _setTextureFilter(_this._gl, texture.filter); }
										if (texture.wrapMode) { _setTextureWrapMode(_this._gl, texture.wrapMode); }
									};
								})(this, uniform, uniformLocation, uniformData.type);
							}
							// build setter method for colors
							else if (uniformData.type === UniformTypes.Color) {
								(function(_this, name, location, method) {
									_this.uniforms[name] = (v1, v2, v3, v4) => {
										if (_currEffect !== _this) {
											_this._pendingUniformValues[name] = [v1, v2, v3, v4];
											return;
										}
										if (v1.isColor) {
											_this._gl[method](location, v1.floatArray);
										}
										else {
											_this._gl[method](location, v1, v2, v3, v4);
										}
									};
								})(this, uniform, uniformLocation, uniformData.type);
							}
							// build setter method for other types
							else {
								(function(_this, name, location, method) {
									_this.uniforms[name] = (v1, v2, v3, v4) => {
										if (_currEffect !== _this) {
											_this._pendingUniformValues[name] = [v1, v2, v3, v4];
											return;
										}
										_this._gl[method](location, v1, v2, v3, v4);
									};
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

									if (_currEffect !== _this) {
										_this._pendingAttributeValues[name] = [buffer];
										return;
									}

									if (buffer) {
										_this._gl.bindBuffer(_this._gl.ARRAY_BUFFER, buffer);
										_this._gl.vertexAttribPointer(location, data.size, _this._gl[data.type] || _this._gl.FLOAT, data.normalize || false, data.stride || 0, data.offset || 0);
										_this._gl.enableVertexAttribArray(location);
									}
									else {
										_this._gl.disableVertexAttribArray(location);
									}
								};
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
					get uniformTypes() {
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
					get attributeTypes() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Make this effect active.
					 * @param {*} overrideFlags Optional flags to override in effect.
					 * May include the following: enableDepthTest, enableFaceCulling, enableStencilTest, enableDithering.
					 */
					setAsActive(overrideFlags) {
						// use effect program
						this._gl.useProgram(this._program);

						// enable / disable some features
						overrideFlags = overrideFlags || {};
						if ((overrideFlags.enableDepthTest !== undefined) ? overrideFlags.enableDepthTest : this.enableDepthTest) { this._gl.enable(this._gl.DEPTH_TEST); } else { this._gl.disable(this._gl.DEPTH_TEST); }
						if ((overrideFlags.enableFaceCulling !== undefined) ? overrideFlags.enableFaceCulling : this.enableFaceCulling) { this._gl.enable(this._gl.CULL_FACE); } else { this._gl.disable(this._gl.CULL_FACE); }
						if ((overrideFlags.enableStencilTest !== undefined) ? overrideFlags.enableStencilTest : this.enableStencilTest) { this._gl.enable(this._gl.STENCIL_TEST); } else { this._gl.disable(this._gl.STENCIL_TEST); }
						if ((overrideFlags.enableDithering !== undefined) ? overrideFlags.enableDithering : this.enableDithering) { this._gl.enable(this._gl.DITHER); } else { this._gl.disable(this._gl.DITHER); }

						// set polygon offset
						const polygonOffset = (overrideFlags.polygonOffset !== undefined) ? overrideFlags.polygonOffset : this.polygonOffset;
						if (polygonOffset) {
							this._gl.enable(this._gl.POLYGON_OFFSET_FILL);
							this._gl.polygonOffset(polygonOffset.factor || 0, polygonOffset.units || 0);
						}
						else {
							this._gl.disable(this._gl.POLYGON_OFFSET_FILL);
							this._gl.polygonOffset(0, 0);
						}

						// default depth func
						this._gl.depthFunc(overrideFlags.depthFunc || this.depthFunc);

						// set as active
						_currEffect = this;

						// set pending uniforms that were set while this effect was not active
						for (let key in this._pendingUniformValues) {
							this.uniforms[key](...this._pendingUniformValues[key]);
						}
						this._pendingUniformValues = {};

						// set pending attributes that were set while this effect was not active
						for (let key in this._pendingAttributeValues) {
							this.attributes[key](...this._pendingAttributeValues[key]);
						}
						this._pendingAttributeValues = {};

						// reset cached values
						this._cachedValues = {};
					}

					/**
					 * Get a uniform method from a bind key.
					 * @param {UniformBinds} bindKey Uniform bind key.
					 * @returns Uniform set method, or null if not set.
					 */
					getBoundUniform(bindKey) {
						let key = this._uniformBinds[bindKey];
						if (key) {
							return this.uniforms[key] || null;
						}
						return null;
					}

					/**
					 * Get this effect's vertex shader code, as string.
					 * @returns {String} Vertex shader code.
					 */
					get vertexCode() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Get this effect's fragment shader code, as string.
					 * @returns {String} Fragment shader code.
					 */
					get fragmentCode() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Should this effect enable depth test?
					 */
					get enableDepthTest() {
						return false;
					}

					/**
					 * Should this effect enable face culling?
					 */
					get enableFaceCulling() {
						return false;
					}

					/**
					 * Get depth func to use when rendering using this effect.
					 * Use 'DepthFuncs' to get options.
					 */
					get depthFunc() {
						return Effect.DepthFuncs.LessEqual;
					}

					/**
					 * Should this effect enable stencil test?
					 */
					get enableStencilTest() {
						return false;
					}

					/**
					 * Should this effect enable dithering?
					 */
					get enableDithering() {
						return false;
					}

					/**
					 * Get polygon offset factor, to apply on depth value before checking.
					 * @returns {Boolean|*} Return false to disable polygon offset, or {factor, unit} to apply polygon offset.
					 */
					get polygonOffset() {
						return false;
					}

					/**
					 * Get all supported depth funcs we can set.
					 * @returns {*} Depth func options: {Never, Less, Equal, LessEqual, Greater, GreaterEqual, Always, NotEqual}.
					 */
					static get DepthFuncs() {
						if (!_depthFuncs) {
							const gl = Effect._gfx._internal.gl;
							_depthFuncs = {
								Never: gl.NEVER,
								Less: gl.LESS,
								Equal: gl.EQUAL,
								LessEqual: gl.LEQUAL,
								Greater: gl.GREATER,
								GreaterEqual: gl.GEQUAL,
								Always: gl.ALWAYS,
								NotEqual: gl.NOTEQUAL,
							};
							Object.freeze(_depthFuncs);
						}
						return _depthFuncs;
					}

					/**
					 * Set the main texture.
					 * Note: this will only work for effects that utilize the 'MainTexture' uniform.
					 * @param {TextureAssetBase} texture Texture to set.
					 * @returns {Boolean} True if texture was changed, false if there was no need to change the texture.
					 */
					setTexture(texture) {
						// already using this texture? skip
						if (texture === this._cachedValues.texture) {
							return false;
						}

						// get texture uniform
						let uniform = this.getBoundUniform(Effect.UniformBinds.MainTexture);

						// set texture
						if (uniform) {

							// set texture value
							this._cachedValues.texture = texture;
							let glTexture = texture._glTexture || texture;
							this._gl.activeTexture(this._gl.TEXTURE0);
							this._gl.bindTexture(this._gl.TEXTURE_2D, glTexture);
							uniform(texture, 0);

							// set texture size
							let textWidth = this.getBoundUniform(Effect.UniformBinds.TextureWidth);
							if (textWidth) { textWidth(texture.width); }
							let textHeight = this.getBoundUniform(Effect.UniformBinds.TextureHeight);
							if (textHeight) { textHeight(texture.height); }

							// success
							return true;
						}

						// didn't set..
						return false;
					}

					/**
					 * Set the main tint color.
					 * Note: this will only work for effects that utilize the 'Color' uniform.
					 * @param {Color} color Color to set.
					 */
					setColor(color) {
						let uniform = this.getBoundUniform(Effect.UniformBinds.Color);
						if (uniform) {
							if (color.equals(this._cachedValues.color)) { return; }
							this._cachedValues.color = color.clone();
							uniform(color.floatArray);
						}
					}

					/**
					 * Set the projection matrix uniform.
					 * Note: this will only work for effects that utilize the 'Projection' uniform.
					 * @param {Matrix} matrix Matrix to set.
					 */
					setProjectionMatrix(matrix) {
						let uniform = this.getBoundUniform(Effect.UniformBinds.Projection);
						if (uniform) {
							if (matrix.equals(this._cachedValues.projection)) { return; }
							this._cachedValues.projection = matrix.clone();
							uniform(matrix.values);
						}
					}

					/**
					 * Set the world matrix uniform.
					 * Note: this will only work for effects that utilize the 'World' uniform.
					 * @param {Matrix} matrix Matrix to set.
					 */
					setWorldMatrix(matrix) {
						let uniform = this.getBoundUniform(Effect.UniformBinds.World);
						if (uniform) {
							uniform(matrix.values);
						}
					}

					/**
					 * Set the view matrix uniform.
					 * Note: this will only work for effects that utilize the 'View' uniform.
					 * @param {Matrix} matrix Matrix to set.
					 */
					setViewMatrix(matrix) {
						let uniform = this.getBoundUniform(Effect.UniformBinds.View);
						if (uniform) {
							uniform(matrix.values);
						}
					}

					/**
					 * Set outline params.
					 * Note: this will only work for effects that utilize the 'OutlineWeight' and 'OutlineColor' uniforms.
					 * @param {Number} weight Outline weight, range from 0.0 to 1.0.
					 * @param {Color} color Outline color.
					 */
					setOutline(weight, color) {
						let weightUniform = this.getBoundUniform(Effect.UniformBinds.OutlineWeight);
						if (weightUniform) { weightUniform(weight); }

						let colorUniform = this.getBoundUniform(Effect.UniformBinds.OutlineColor);
						if (colorUniform) { colorUniform(color); }
					}

					/**
					 * Set a factor to normalize UV values to be 0-1.
					 * Note: this will only work for effects that utilize the 'UvNormalizationFactor' uniform.
					 * @param {Vector2} factor Normalize UVs factor.
					 */
					setUvNormalizationFactor(factor) {
						uniform = this.getBoundUniform(Effect.UniformBinds.UvNormalizationFactor);
						if (uniform) {
							uniform(factor.x, factor.y);
						}
					}

					/**
					 * Set the vertices position buffer.
					 * Only works if there's an attribute type bound to 'Position'.
					 * @param {WebGLBuffer} buffer Vertices position buffer.
					 * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
					 */
					setPositionsAttribute(buffer, forceSetBuffer) {
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
					setTextureCoordsAttribute(buffer, forceSetBuffer) {
						let attr = this._attributeBinds[Effect.AttributeBinds.TextureCoords];
						if (attr) {
							if (!forceSetBuffer && buffer === this._cachedValues.coords) { return; }
							this._cachedValues.coords = buffer;
							this.attributes[attr](buffer);
						}
					}

					/**
					 * Return if this effect have colors attribute on vertices.
					 * @returns {Boolean} True if got vertices color attribute.
					 */
					get hasVertexColor() {
						return Boolean(this._attributeBinds[Effect.AttributeBinds.Colors]);
					}

					/**
					 * Set the vertices colors buffer.
					 * Only works if there's an attribute type bound to 'Colors'.
					 * @param {WebGLBuffer} buffer Vertices colors buffer.
					 * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
					 */
					setColorsAttribute(buffer, forceSetBuffer) {
						let attr = this._attributeBinds[Effect.AttributeBinds.Colors];
						if (attr) {
							if (!forceSetBuffer && buffer === this._cachedValues.colors) { return; }
							this._cachedValues.colors = buffer;
							this.attributes[attr](buffer);
						}
					}

					/**
					 * Set the vertices normals buffer.
					 * Only works if there's an attribute type bound to 'Normals'.
					 * @param {WebGLBuffer} buffer Vertices normals buffer.
					 * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
					 */
					setNormalsAttribute(buffer, forceSetBuffer) {
						let attr = this._attributeBinds[Effect.AttributeBinds.Normals];
						if (attr) {
							if (!forceSetBuffer && buffer === this._cachedValues.normals) { return; }
							this._cachedValues.normals = buffer;
							this.attributes[attr](buffer);
						}
					}

					/**
					 * Set the vertices binormals buffer.
					 * Only works if there's an attribute type bound to 'Binormals'.
					 * @param {WebGLBuffer} buffer Vertices binormals buffer.
					 * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
					 */
					setBinormalsAttribute(buffer, forceSetBuffer) {
						let attr = this._attributeBinds[Effect.AttributeBinds.Binormals];
						if (attr) {
							if (!forceSetBuffer && buffer === this._cachedValues.binormals) { return; }
							this._cachedValues.binormals = buffer;
							this.attributes[attr](buffer);
						}
					}

					/**
					 * Set the vertices tangents buffer.
					 * Only works if there's an attribute type bound to 'Tangents'.
					 * @param {WebGLBuffer} buffer Vertices tangents buffer.
					 * @param {Boolean} forceSetBuffer If true, will always set buffer even if buffer is currently set.
					 */
					setTangentsAttribute(buffer, forceSetBuffer) {
						let attr = this._attributeBinds[Effect.AttributeBinds.Tangents];
						if (attr) {
							if (!forceSetBuffer && buffer === this._cachedValues.tangents) { return; }
							this._cachedValues.tangents = buffer;
							this.attributes[attr](buffer);
						}
					}

				}

				/**
				 * Build a shader.
				 */
				function compileShader(effectClass, gl, code, type) {
					let shader = gl.createShader(type);

					gl.shaderSource(shader, code);
					gl.compileShader(shader);

					if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
						_logger.error(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader for effect '${effectClass.name}':`);
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
				};
				Object.defineProperty(UniformTypes, '_values', {
					value: new Set(Object.values(UniformTypes)),
					writable: false,
				});
				Object.freeze(UniformTypes);

				// attach uniform types to effect
				Effect.UniformTypes = UniformTypes;

				/**
				 * Default uniform binds.
				 * This is a set of commonly used uniforms and their names inside the shader code.
				 *
				 * Every bind here comes with a built-in method to set and is used internally by Shaku.
				 * For example, if you want to include outline properties in your effect, you can use the 'OutlineWeight' and 'OutlineColor' binds (with matching name in the shader code).
				 * When you use the built-in binds, Shaku will know how to set them itself when relevant, for example in text rendering Shaku will use the outline binds if they exist.
				 *
				 * If you don't use the built-in binds you can just call your uniforms however you like, but you'll need to set them all manually.
				 * Shaku will not know how to set them.
				 */
				Effect.UniformBinds = {
					MainTexture: 'mainTexture',                         // bind uniform to be used as the main texture.
					Color: 'color',                                     // bind uniform to be used as a main color.
					Projection: 'projection',                           // bind uniform to be used as the projection matrix.
					World: 'world',                                     // bind uniform to be used as the world matrix.
					View: 'view',                                       // bind uniform to be used as the view matrix.
					UvOffset: 'uvOffset',                               // bind uniform to be used as UV offset.
					UvScale: 'uvScale',                                 // bind uniform to be used as UV scale.
					OutlineWeight: 'outlineWeight',                     // bind uniform to be used as outline weight.
					OutlineColor: 'outlineColor',                       // bind uniform to be used as outline color.
					UvNormalizationFactor: 'uvNormalizationFactor',     // bind uniform to be used as factor to normalize uv values to be 0-1.
					TextureWidth: 'textureWidth',                       // bind uniform to be used as texture width in pixels.
					TextureHeight: 'textureHeight'                      // bind uniform to be used as texture height in pixels.
				};
				Object.freeze(Effect.UniformBinds);

				/**
				 * Define attribute types.
				 */
				Effect.AttributeTypes = {
					Byte: 'BYTE',
					Short: 'SHORT',
					UByte: 'UNSIGNED_BYTE',
					UShort: 'UNSIGNED_SHORT',
					Float: 'FLOAT',
					HalfFloat: 'HALF_FLOAT',
				};
				Object.freeze(Effect.AttributeTypes);

				/**
				 * Define built-in attribute binds to connect attribute names for specific use cases like position, uvs, colors, etc.
				 * If an effect support one or more of these attributes, Shaku will know how to fill them automatically.
				 */
				Effect.AttributeBinds = {
					Position: 'position',  // bind attribute to be used for vertices position array.
					TextureCoords: 'uv',   // bind attribute to be used for texture coords array.
					Colors: 'color',       // bind attribute to be used for vertices colors array.
					Normals: 'normal',     // bind attribute to be used for vertices normals array.
					Binormals: 'binormal', // bind attribute to be used for vertices binormals array.
					Tangents: 'tangent',   // bind attribute to be used for vertices tangents array.
				};
				Object.freeze(Effect.AttributeBinds);


				/**
				 * Set texture mag and min filters.
				 * @private
				 * @param {TextureFilterModes} filter Texture filter to set.
				 */
				function _setTextureFilter(gl, filter) {
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
				function _setTextureWrapMode(gl, wrapX, wrapY) {
					if (wrapY === undefined) { wrapY = wrapX; }
					if (!TextureWrapModes._values.has(wrapX)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
					if (!TextureWrapModes._values.has(wrapY)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[wrapX]);
					gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[wrapY]);
				}


				// will be set by the gfx manager
				Effect._gfx = null;


				// export the effect class.
				module.exports = Effect;

				/***/
			}),

/***/ 3020:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Include all built-in effects.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				module.exports = {
					Effect: __webpack_require__(8986),
					SpritesEffect: __webpack_require__(1414),
					SpritesEffectNoVertexColor: __webpack_require__(4481),
					SpritesWithOutlineEffect: __webpack_require__(1484),
					ShapesEffect: __webpack_require__(1205),
					MsdfFontEffect: __webpack_require__(9069),
				};

				/***/
			}),

/***/ 9069:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement an effect to draw MSDF font textures.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\msdf_font.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Effect = __webpack_require__(8986);

				// vertex shader code
				const vertexShader = `#version 300 es
in vec3 position;
in vec2 uv;
in vec4 color;

uniform mat4 projection;
uniform mat4 world;

out vec2 v_texCoord;
out vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
    v_color = color;
}`;

				// fragment shader code
				const fragmentShader = `#version 300 es
precision highp float;

uniform sampler2D mainTexture;

in vec2 v_texCoord;
in vec4 v_color;

out vec4 FragColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main(void) {
  vec3 _sample = texture(mainTexture, v_texCoord).rgb;
  float sigDist = median(_sample.r, _sample.g, _sample.b) - 0.5;
  float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
  // float alpha = clamp((sigDist / (fwidth(sigDist) * 1.5)) + 0.5, 0.0, 1.0);

  vec3 color = v_color.rgb * alpha;
  FragColor = vec4(color, alpha) * v_color.a;
}`;

				/**
				 * Default effect to draw MSDF font textures.
				 */
				class MsdfFontEffect extends Effect {
					/** @inheritdoc */
					get vertexCode() {
						return vertexShader;
					}

					/** @inheritdoc */
					get fragmentCode() {
						return fragmentShader;
					}

					/** @inheritdoc */
					get uniformTypes() {
						return {
							[Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
							[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
							[Effect.UniformBinds.World]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
						};
					}

					/** @inheritdoc */
					get attributeTypes() {
						return {
							[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
							[Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
							[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
						};
					}
				}


				// export the basic shader
				module.exports = MsdfFontEffect;

				/***/
			}),

/***/ 1205:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a basic effect to draw sprites.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\shapes.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Effect = __webpack_require__(8986);

				// vertex shader code
				const vertexShader = `
attribute vec3 position;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 world;

varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_color = color;
}
    `;

				// fragment shader code
				const fragmentShader = `
#ifdef GL_ES
    precision highp float;
#endif

varying vec4 v_color;

void main(void) {
    gl_FragColor = v_color;
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

				/**
				 * Default basic effect to draw 2d shapes.
				 */
				class ShapesEffect extends Effect {
					/** @inheritdoc */
					get vertexCode() {
						return vertexShader;
					}

					/** @inheritdoc */
					get fragmentCode() {
						return fragmentShader;
					}

					/** @inheritdoc */
					get uniformTypes() {
						return {
							[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
							[Effect.UniformBinds.World]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
							[Effect.UniformBinds.View]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.View },
						};
					}

					/** @inheritdoc */
					get attributeTypes() {
						return {
							[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
							[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
						};
					}
				}


				// export the basic shader
				module.exports = ShapesEffect;

				/***/
			}),

/***/ 1414:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a basic effect to draw sprites.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\sprites.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Effect = __webpack_require__(8986);

				// vertex shader code
				const vertexShader = `
attribute vec3 position;
attribute vec2 uv;
attribute vec4 color;

uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
    v_color = color;
}
    `;

				// fragment shader code
				const fragmentShader = `
#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D mainTexture;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_FragColor = texture2D(mainTexture, v_texCoord) * v_color;
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

				/**
				 * Default basic effect to draw 2d sprites.
				 */
				class SpritesEffect extends Effect {
					/** @inheritdoc */
					get vertexCode() {
						return vertexShader;
					}

					/** @inheritdoc */
					get fragmentCode() {
						return fragmentShader;
					}

					/** @inheritdoc */
					get uniformTypes() {
						return {
							[Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
							[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
							[Effect.UniformBinds.World]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
							[Effect.UniformBinds.View]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.View }
						};
					}

					/** @inheritdoc */
					get attributeTypes() {
						return {
							[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
							[Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
							[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
						};
					}
				}


				// export the basic shader
				module.exports = SpritesEffect;

				/***/
			}),

/***/ 7090:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a basic effect to draw 3d sprites.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\sprites_3d.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const SpritesEffect = __webpack_require__(1414);


				/**
				 * Default basic effect to draw 2d sprites.
				 */
				class Sprites3dEffect extends SpritesEffect {
					/**
					 * @inheritdoc
					 */
					get enableDepthTest() { return true; }

					/**
					 * @inheritdoc
					 */
					get enableFaceCulling() { return false; }

					/**
					 * @inheritdoc
					 */
					get vertexCode() {
						const vertexShader = `
          attribute vec3 position;
          attribute vec2 uv;
          attribute vec4 color;

          uniform mat4 projection;
          uniform mat4 view;
          uniform mat4 world;

          varying vec2 v_texCoord;
          varying vec4 v_color;

          void main(void) {
              gl_Position = projection * view * world * vec4(position, 1.0);
              gl_PointSize = 1.0;
              v_texCoord = uv;
              v_color = color;
          }
        `;
						return vertexShader;
					}

					/**
					 * @inheritdoc
					 */
					get fragmentCode() {
						const fragmentShader = `
          #ifdef GL_ES
              precision highp float;
          #endif

          uniform sampler2D mainTexture;

          varying vec2 v_texCoord;
          varying vec4 v_color;

          void main(void) {
              gl_FragColor = texture2D(mainTexture, v_texCoord) * v_color;
              if (gl_FragColor.a <= 0.0) { discard; }
              gl_FragColor.rgb *= gl_FragColor.a;
          }
        `;
						return fragmentShader;
					}
				}


				// export the basic shader
				module.exports = Sprites3dEffect;

				/***/
			}),

/***/ 4481:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a basic effect to draw sprites without vertex color.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\sprites_no_vertex_color.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Effect = __webpack_require__(8986);

				// vertex shader code
				const vertexShader = `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
}
    `;

				// fragment shader code
				const fragmentShader = `
#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D mainTexture;
varying vec2 v_texCoord;

void main(void) {
    gl_FragColor = texture2D(mainTexture, v_texCoord);
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

				/**
				 * Default basic effect to draw 2d sprites without vertex color.
				 */
				class SpritesEffectNoVertexColor extends Effect {
					/** @inheritdoc */
					get vertexCode() {
						return vertexShader;
					}

					/** @inheritdoc */
					get fragmentCode() {
						return fragmentShader;
					}

					/** @inheritdoc */
					get uniformTypes() {
						return {
							[Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
							[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
							[Effect.UniformBinds.World]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
							[Effect.UniformBinds.View]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.View },
						};
					}

					/** @inheritdoc */
					get attributeTypes() {
						return {
							[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
							[Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
						};
					}
				}


				// export the basic shader
				module.exports = SpritesEffectNoVertexColor;

				/***/
			}),

/***/ 1484:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a basic effect to draw sprites with outline.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\effects\sprites_with_outline.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Effect = __webpack_require__(8986);

				// vertex shader code
				const vertexShader = `
attribute vec3 position;
attribute vec2 uv;
attribute vec4 color;

uniform vec4 outlineColor;
uniform mat4 projection;
uniform mat4 world;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    gl_Position = projection * world * vec4(position, 1.0);
    gl_PointSize = 1.0;
    v_texCoord = uv;
    v_color = color;
}
    `;

				// fragment shader code
				const fragmentShader = `
#ifdef GL_ES
    precision highp float;
#endif

uniform sampler2D mainTexture;
uniform float textureWidth;
uniform float textureHeight;
uniform vec4 outlineColor;
uniform float outlineWeight;

varying vec2 v_texCoord;
varying vec4 v_color;

void main(void) {
    float total = 0.0;
    float grabPixel;

    float facX = (1.0 / textureWidth) * 2.0;
    float facY = (1.0 / textureHeight) * 2.0;
    total +=        texture2D(mainTexture, v_texCoord + vec2(-facX, -facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(facX, -facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(facX, facY)).a;
    total +=        texture2D(mainTexture, v_texCoord + vec2(-facX, facY)).a;

    total += texture2D(mainTexture, v_texCoord + vec2(0.0, -facY)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(0.0, facY)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(-facX, 0.0)).a * 2.0;
    total += texture2D(mainTexture, v_texCoord + vec2(facX, 0.0)).a * 2.0;

    total *= outlineWeight;
    vec4 currColor = texture2D(mainTexture, v_texCoord);

    gl_FragColor = (currColor.a >= 0.9) ? currColor : (outlineColor * vec4(1,1,1,total));
    gl_FragColor.rgb *= gl_FragColor.a;
}
    `;

				/**
				 * Default basic effect to draw 2d sprites with outline.
				 */
				class SpritesWithOutlineEffect extends Effect {
					/** @inheritdoc */
					get vertexCode() {
						return vertexShader;
					}

					/** @inheritdoc */
					get fragmentCode() {
						return fragmentShader;
					}

					/** @inheritdoc */
					get uniformTypes() {
						return {
							[Effect.UniformBinds.MainTexture]: { type: Effect.UniformTypes.Texture, bind: Effect.UniformBinds.MainTexture },
							[Effect.UniformBinds.Projection]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.Projection },
							[Effect.UniformBinds.World]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.World },
							[Effect.UniformBinds.View]: { type: Effect.UniformTypes.Matrix, bind: Effect.UniformBinds.View },
							[Effect.UniformBinds.OutlineColor]: { type: Effect.UniformTypes.Color, bind: Effect.UniformBinds.OutlineColor },
							[Effect.UniformBinds.TextureWidth]: { type: Effect.UniformTypes.Float, bind: Effect.UniformBinds.TextureWidth },
							[Effect.UniformBinds.TextureHeight]: { type: Effect.UniformTypes.Float, bind: Effect.UniformBinds.TextureHeight },
							[Effect.UniformBinds.OutlineWeight]: { type: Effect.UniformTypes.Float, bind: Effect.UniformBinds.OutlineWeight },
						};
					}

					/** @inheritdoc */
					get attributeTypes() {
						return {
							[Effect.AttributeBinds.Position]: { size: 3, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Position },
							[Effect.AttributeBinds.TextureCoords]: { size: 2, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.TextureCoords },
							[Effect.AttributeBinds.Colors]: { size: 4, type: Effect.AttributeTypes.Float, normalize: false, bind: Effect.AttributeBinds.Colors },
						};
					}
				}


				// export the basic shader
				module.exports = SpritesWithOutlineEffect;

				/***/
			}),

/***/ 4672:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx manager.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\gfx.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const IManager = __webpack_require__(9563);
				const Color = __webpack_require__(9327);
				const { BlendModes } = __webpack_require__(3223);
				const Rectangle = __webpack_require__(4731);
				const { Effect, SpritesEffect, SpritesEffectNoVertexColor, MsdfFontEffect, ShapesEffect, SpritesWithOutlineEffect } = __webpack_require__(3020);
				const TextureAsset = __webpack_require__(2262);
				const { TextureFilterModes } = __webpack_require__(5387);
				const { TextureWrapModes } = __webpack_require__(2464);
				const Matrix = __webpack_require__(5529);
				const Camera = __webpack_require__(2726);
				const Sprite = __webpack_require__(6565);
				const SpritesGroup = __webpack_require__(1036);
				const Vector2 = __webpack_require__(2544);
				const FontTextureAsset = __webpack_require__(167);
				const { TextAlignment, TextAlignments } = __webpack_require__(8684);
				const Circle = __webpack_require__(9668);
				const SpriteBatch = __webpack_require__(962);
				const TextSpriteBatch = __webpack_require__(985);
				const Vertex = __webpack_require__(4288);
				const DrawBatch = __webpack_require__(2069);
				const ShapesBatch = __webpack_require__(1772);
				const LinesBatch = __webpack_require__(8333);
				const Sprites3dEffect = __webpack_require__(7090);
				const SpriteBatch3D = __webpack_require__(7561);
				const TextureAtlasAsset = __webpack_require__(2493);
				const Camera3D = __webpack_require__(8871);
				const _logger = (__webpack_require__(5259).getLogger)('gfx');

				let _gl = null;
				let _initSettings = { antialias: true, alpha: true, depth: false, premultipliedAlpha: true, desynchronized: false };
				let _canvas = null;
				let _lastBlendMode = null;
				let _activeEffect = null;
				let _activeEffectFlags = null;
				let _camera = null;
				let _projection = null;
				let _fb = null;
				let _renderTarget = null;
				let _drawCallsCount = 0;
				let _drawQuadsCount = 0;
				let _drawShapePolygonsCount = 0;
				let _cachedRenderingRegion = {};
				let _webglVersion = 0;


				/**
				 * Gfx is the graphics manager.
				 * Everything related to rendering and managing your game canvas goes here.
				 *
				 * To access the Graphics manager you use `Shaku.gfx`.
				 */
				class Gfx extends IManager {
					/**
					 * Create the manager.
					 */
					constructor() {
						super();

						/**
						 * A dictionary containing all built-in effect instances.
						 * @type {Dictionary}
						 * @name Gfx#builtinEffects
						 */
						this.builtinEffects = {};

						/**
						 * Default texture filter to use when no texture filter is set.
						 * @type {TextureFilterModes}
						 * @name Gfx#defaultTextureFilter
						 */
						this.defaultTextureFilter = TextureFilterModes.Nearest;

						/**
						 * Default wrap modes to use when no wrap mode is set.
						 * @type {TextureWrapModes}
						 * @name Gfx#TextureWrapModes
						 */
						this.defaultTextureWrapMode = TextureWrapModes.Clamp;

						/**
						 * A 1x1 white texture.
						 * @type {TextureAsset}
						 * @name Gfx#whiteTexture
						 */
						this.whiteTexture = null;

						/**
						 * Provide access to Gfx internal stuff.
						 * @private
						 */
						this._internal = new GfxInternal(this);

						// set self for effect and draw batch
						DrawBatch._gfx = this;
						Effect._gfx = this;
					}

					/**
					 * Get the init WebGL version.
					 * @returns {Number} WebGL version number.
					 */
					get webglVersion() {
						return _webglVersion;
					}

					/**
					 * Maximum number of vertices we allow when drawing lines.
					 * @returns {Number} max vertices per lines strip.
					 */
					get maxLineSegments() {
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
					setContextAttributes(flags) {
						if (_gl) { throw new Error("Can't call setContextAttributes() after gfx was initialized!"); }
						for (let key in flags) {
							_initSettings[key] = flags[key];
						}
					}

					/**
					 * Set the canvas element to initialize on.
					 * You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.
					 * @example
					 * Shaku.gfx.setCanvas(document.getElementById('my-canvas'));
					 * @param {HTMLCanvasElement} element Canvas element to initialize on.
					 */
					setCanvas(element) {
						if (_gl) { throw new Error("Can't call setCanvas() after gfx was initialized!"); }
						_canvas = element;
					}

					/**
					 * Get the canvas element controlled by the gfx manager.
					 * If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.
					 * @example
					 * document.body.appendChild(Shaku.gfx.canvas);
					 * @returns {HTMLCanvasElement} Canvas we use for rendering.
					 */
					get canvas() {
						return _canvas;
					}

					/**
					 * Get the draw batch base class.
					 * @see DrawBatch
					 */
					get DrawBatch() {
						return DrawBatch;
					}

					/**
					 * Get the sprites batch class.
					 * @see SpriteBatch
					 */
					get SpriteBatch() {
						return SpriteBatch;
					}

					/**
					 * Get the 3d sprites batch class.
					 * @see SpriteBatch3D
					 */
					get SpriteBatch3D() {
						return SpriteBatch3D;
					}

					/**
					 * Get the text sprites batch class.
					 * @see TextSpriteBatch
					 */
					get TextSpriteBatch() {
						return TextSpriteBatch;
					}

					/**
					 * Get the shapes batch class.
					 * @see ShapesBatch
					 */
					get ShapesBatch() {
						return ShapesBatch;
					}

					/**
					 * Get the lines batch class.
					 * @see LinesBatch
					 */
					get LinesBatch() {
						return LinesBatch;
					}

					/**
					 * Get the Effect base class, which is required to implement custom effects.
					 * @see Effect
					 */
					get Effect() {
						return Effect;
					}

					/**
					 * Get the default sprites effect class.
					 * @see SpritesEffect
					 */
					get SpritesEffect() {
						return SpritesEffect;
					}

					/**
					 * Get the default sprites effect class that is used when vertex colors is disabled.
					 * @see SpritesEffectNoVertexColor
					 */
					get SpritesEffectNoVertexColor() {
						return SpritesEffectNoVertexColor;
					}

					/**
					 * Get the default shapes effect class that is used to draw 2d shapes.
					 * @see ShapesEffect
					 */
					get ShapesEffect() {
						return ShapesEffect;
					}

					/**
					 * Get the default 3d sprites effect class that is used to draw 3d textured quads.
					 * @see Sprites3dEffect
					 */
					get Sprites3dEffect() {
						return Sprites3dEffect;
					}

					/**
					 * Get the Effect for rendering fonts with an MSDF texture.
					 * @see MsdfFontEffect
					 */
					get MsdfFontEffect() {
						return MsdfFontEffect;
					}

					/**
					 * Get the sprite class.
					 * @see Sprite
					 */
					get Sprite() {
						return Sprite;
					}

					/**
					 * Get the sprites group object.
					 * @see SpritesGroup
					 */
					get SpritesGroup() {
						return SpritesGroup;
					}

					/**
					 * Get the matrix object.
					 * @see Matrix
					 */
					get Matrix() {
						return Matrix;
					}

					/**
					 * Get the vertex object.
					 * @see Vertex
					 */
					get Vertex() {
						return Vertex;
					}

					/**
					 * Get the text alignments options.
					 * * Left: align text to the left.
					 * * Right: align text to the right.
					 * * Center: align text to center.
					 * @see TextAlignments
					 */
					get TextAlignments() {
						return TextAlignments;
					}

					/**
					 * Create and return a new camera instance.
					 * @param {Boolean} withViewport If true, will create camera with viewport value equal to canvas' size.
					 * @returns {Camera} New camera object.
					 */
					createCamera(withViewport) {
						let ret = new Camera(this);
						if (withViewport) {
							ret.viewport = this.getRenderingRegion();
						}
						return ret;
					}

					/**
					 * Create and return a new 3D camera instance.
					 * @param {Boolean} withViewport If true, will create camera with viewport value equal to canvas' size.
					 * @returns {Camera3D} New camera object.
					 */
					createCamera3D(withViewport) {
						let ret = new Camera3D(this);
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
					setCameraOrthographic(offset) {
						let camera = this.createCamera();
						camera.orthographicOffset(offset);
						this.applyCamera(camera);
						return camera;
					}

					/**
					 * Set resolution and canvas to the max size of its parent element or screen.
					 * If the canvas is directly under document body, it will take the max size of the page.
					 * @param {Boolean=} limitToParent if true, will use parent element size. If false, will stretch on entire document.
					 * @param {Boolean=} allowOddNumbers if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers.
					 */
					maximizeCanvasSize(limitToParent, allowOddNumbers) {
						// new width and height
						let width = 0;
						let height = 0;

						// parent
						if (limitToParent) {
							let parent = _canvas.parentElement;
							width = parent.clientWidth - _canvas.offsetLeft;
							height = parent.clientHeight - _canvas.offsetTop;
						}
						// entire screen
						else {
							width = window.innerWidth;
							height = window.innerHeight;
							_canvas.style.left = '0px';
							_canvas.style.top = '0px';
						}

						// make sure even numbers
						if (!allowOddNumbers) {
							if (width % 2 !== 0) { width++; }
							if (height % 2 !== 0) { height++; }
						}

						// if changed, set resolution
						if ((_canvas.width !== width) || (_canvas.height !== height)) {
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
					setRenderTarget(texture, keepCamera) {
						// reset cached rendering size
						this.#_resetCachedRenderingRegion();

						// if texture is null, remove any render target
						if (texture === null) {
							_renderTarget = null;
							_gl.bindFramebuffer(_gl.FRAMEBUFFER, null);
							if (!keepCamera) {
								this.resetCamera();
							}
							return;
						}

						// convert texture to array
						if (!Array.isArray(texture)) {
							texture = [texture];
						}

						// bind the framebuffer
						_gl.bindFramebuffer(_gl.FRAMEBUFFER, _fb);

						// set render targets
						var drawBuffers = [];
						for (let index = 0; index < texture.length; ++index) {

							// attach the texture as the first color attachment
							const attachmentPoint = _gl['COLOR_ATTACHMENT' + index];
							_gl.framebufferTexture2D(_gl.FRAMEBUFFER, attachmentPoint, _gl.TEXTURE_2D, texture[index]._glTexture, 0);

							// index 0 is the "main" render target
							if (index === 0) {
								_renderTarget = texture[index];
							}

							// to set drawBuffers in the end
							drawBuffers.push(attachmentPoint);
						}

						// set draw buffers
						_gl.drawBuffers(drawBuffers);

						// unbind frame buffer
						//_gl.bindFramebuffer(_gl.FRAMEBUFFER, null);

						// reset camera
						if (!keepCamera) {
							this.resetCamera();
						}
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
					setResolution(width, height, updateCanvasStyle) {
						_canvas.width = width;
						_canvas.height = height;

						if (width % 2 !== 0 || height % 2 !== 0) {
							_logger.warn("Resolution to set is not even numbers; This might cause minor artefacts when using texture atlases. Consider using even numbers instead.");
						}

						if (updateCanvasStyle) {
							_canvas.style.width = width + 'px';
							_canvas.style.height = height + 'px';
						}

						_gl.viewport(0, 0, width, height);
						this.resetCamera();
					}

					/**
					 * Reset camera properties to default camera.
					 */
					resetCamera() {
						_camera = this.createCamera();
						let size = this.getRenderingSize();
						_camera.orthographic(new Rectangle(0, 0, size.x, size.y));
						this.applyCamera(_camera);
					}

					/**
					 * Set viewport, projection and other properties from a camera instance.
					 * Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.
					 * @param {Camera} camera Camera to apply.
					 */
					applyCamera(camera) {
						// set viewport and projection
						this._viewport = camera.viewport;
						let viewport = this.#_getRenderingRegionInternal(true);
						_gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
						_projection = camera.projection.clone();

						// update effect
						if (_activeEffect) {
							_activeEffect.setProjectionMatrix(_projection);
						}

						// reset cached rendering region
						this.#_resetCachedRenderingRegion();
					}

					/**
					 * Get current rendering region.
					 * @private
					 * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
					 * @returns {Rectangle} Rectangle with rendering region.
					 */
					#_getRenderingRegionInternal(includeOffset) {
						return this._internal.getRenderingRegionInternal(includeOffset);
					}

					/**
					 * Reset cached rendering region values.
					 * @private
					 */
					#_resetCachedRenderingRegion() {
						_cachedRenderingRegion.withoutOffset = _cachedRenderingRegion.withOffset = null;
					}

					/**
					 * Get current rendering region.
					 * @param {Boolean} includeOffset If true (default) will include viewport offset, if exists.
					 * @returns {Rectangle} Rectangle with rendering region.
					 */
					getRenderingRegion(includeOffset) {
						return this.#_getRenderingRegionInternal(includeOffset).clone();
					}

					/**
					 * Get current rendering size.
					 * Unlike 'canvasSize', this takes viewport and render target into consideration.
					 * @returns {Vector2} rendering size.
					 */
					getRenderingSize() {
						let region = this.#_getRenderingRegionInternal();
						return region.getSize();
					}

					/**
					 * Get canvas size as vector.
					 * @returns {Vector2} Canvas size.
					 */
					getCanvasSize() {
						return new Vector2(_canvas.width, _canvas.height);
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					setup() {
						return new Promise(async (resolve, reject) => {

							_logger.info("Setup gfx manager..");

							// if no canvas is set, create one
							if (!_canvas) {
								_canvas = document.createElement('canvas');
							}

							// get webgl context
							_gl = _canvas.getContext('webgl2', _initSettings);
							_webglVersion = 2;

							// no webgl2? try webgl1
							if (!_gl) {
								_logger.warn("Failed to init WebGL2, attempt fallback to WebGL1.");
								_gl = _canvas.getContext('webgl', _initSettings);
								_webglVersion = 1;
							}

							// no webgl at all??
							if (!_gl) {
								_webglVersion = 0;
								_logger.error("Can't get WebGL context!");
								return reject("Failed to get WebGL context from canvas!");
							}

							// create default effects
							this.builtinEffects.Sprites = new SpritesEffect();
							this.builtinEffects.SpritesWithOutline = new SpritesWithOutlineEffect();
							this.builtinEffects.SpritesNoVertexColor = new SpritesEffectNoVertexColor();
							this.builtinEffects.MsdfFont = new MsdfFontEffect();
							this.builtinEffects.Shapes = new ShapesEffect();
							this.builtinEffects.Sprites3d = new Sprites3dEffect();

							// setup textures assets gl context
							TextureAsset._setWebGl(_gl);
							TextureAtlasAsset._setWebGl(_gl);

							// create framebuffer (used for render targets)
							_fb = _gl.createFramebuffer();

							// create a useful single white pixel texture
							let whitePixelImage = new Image();
							whitePixelImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
							await new Promise((resolve, reject) => { whitePixelImage.onload = resolve; });
							this.whiteTexture = new TextureAsset('__runtime_white_pixel__');
							this.whiteTexture.fromImage(whitePixelImage);

							// create default camera
							_camera = this.createCamera();
							this.applyCamera(_camera);

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
					buildText(fontTexture, text, fontSize, color, alignment, offset, marginFactor) {
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
						marginFactor = marginFactor || Vector2.one();

						// get character scale factor
						let scale = fontSize / fontTexture.fontSize;

						// current character offset
						let position = new Vector2(0, 0);

						// current line characters and width
						let currentLineSprites = [];
						let lineWidth = 0;

						// go line down
						function breakLine() {
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
						for (let i = 0; i < text.length; ++i) {
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
								let sprite = new Sprite(fontTexture);
								sprite.sourceRectangle = sourceRect;
								sprite.size = size;
								let positionOffset = fontTexture.getPositionOffset(character);
								if (fontTexture.isMsdfFontTextureAsset) {
									sprite.position.copy(position).addSelf(positionOffset.mul(scale * 0.5));
								}
								else {
									sprite.position.copy(position).addSelf(positionOffset.mul(scale));
								}
								sprite.origin.set(0.5, 0.5);
								if (color.isColor) {
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
					 * Make the renderer canvas centered.
					 */
					centerCanvas() {
						let canvas = _canvas;
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
					inScreen(shape) {
						let region = this.#_getRenderingRegionInternal();

						if (shape.isCircle) {
							return region.collideCircle(shape);
						}
						else if (shape.isVector2) {
							return region.containsVector(shape);
						}
						else if (shape.isRectangle) {
							return region.collideRect(shape);
						}
						else if (shape.isLine) {
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
					centerCamera(position, useCanvasSize) {
						let renderSize = useCanvasSize ? this.getCanvasSize() : this.getRenderingSize();
						let halfScreenSize = renderSize.mul(0.5);
						let centeredPos = position.sub(halfScreenSize);
						this.setCameraOrthographic(centeredPos);
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
					get BlendModes() {
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
					get TextureWrapModes() {
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
					 * ![Filter Modes](resources/demo/filter-modes.png)
					 * @see TextureFilterModes
					 */
					get TextureFilterModes() {
						return TextureFilterModes;
					}

					/**
					 * Get number of actual WebGL draw calls we performed since the beginning of the frame.
					 * @returns {Number} Number of WebGL draw calls this frame.
					 */
					get drawCallsCount() {
						return _drawCallsCount;
					}

					/**
					 * Get number of textured / colored quads we drawn since the beginning of the frame.
					 * @returns {Number} Number of quads drawn in this frame.
					 */
					get quadsDrawCount() {
						return _drawQuadsCount;
					}

					/**
					 * Get number of shape polygons we drawn since the beginning of the frame.
					 * @returns {Number} Number of shape polygons drawn in this frame.
					 */
					get shapePolygonsDrawCount() {
						return _drawShapePolygonsCount;
					}

					/**
					 * Clear screen to a given color.
					 * @example
					 * Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
					 * @param {Color=} color Color to clear screen to, or black if not set.
					 */
					clear(color) {
						color = color || Color.black;
						_gl.clearColor(color.r, color.g, color.b, color.a);
						_gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
					}

					/**
					 * Clear depth buffer.
					 * Only relevant when depth is used.
					 * @param {Number=} value Value to clear depth buffer to.
					 */
					clearDepth(value) {
						_gl.clearDepth((value !== undefined) ? value : 1.0);
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					startFrame() {
						// reset some states
						_lastBlendMode = null;
						_drawCallsCount = 0;
						_drawQuadsCount = 0;
						_drawShapePolygonsCount = 0;

						// reset cached rendering region
						this.#_resetCachedRenderingRegion();
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					endFrame() {
					}

					/**
					 * @inheritdoc
					 * @private
					 */
					destroy() {
						_logger.warn("Cleaning up WebGL is not supported yet!");
					}
				}

				/**
				 * Internal Gfx stuff that should not be used or exposed externally.
				 * @private
				 */
				class GfxInternal {
					constructor(gfx) {
						this._gfx = gfx;
					}

					get gl() {
						return _gl;
					}

					get drawQuadsCount() {
						return _drawQuadsCount;
					}

					set drawQuadsCount(value) {
						_drawQuadsCount = value;
					}

					get drawCallsCount() {
						return _drawCallsCount;
					}

					set drawCallsCount(value) {
						_drawCallsCount = value;
					}

					get drawShapePolygonsCount() {
						return _drawShapePolygonsCount;
					}

					set drawShapePolygonsCount(value) {
						_drawShapePolygonsCount = value;
					}

					useEffect(effect, overrideFlags) {
						// if null, use default
						if (effect === null) {
							effect = this._gfx.builtinEffects.Sprites;
						}

						// same effect? skip
						if ((_activeEffect === effect) && (_activeEffectFlags === overrideFlags)) {
							return;
						}

						// set effect
						effect.setAsActive(overrideFlags);
						_activeEffect = effect;
						_activeEffectFlags = overrideFlags;

						// set projection matrix
						if (_projection) {
							_activeEffect.setProjectionMatrix(_projection);
						}
					}

					getRenderingRegionInternal(includeOffset) {
						// cached with offset
						if (includeOffset && _cachedRenderingRegion.withOffset) {
							return _cachedRenderingRegion.withOffset;
						}

						// cached without offset
						if (!includeOffset && _cachedRenderingRegion.withoutOffset) {
							return _cachedRenderingRegion.withoutOffset;
						}

						// if we got viewport..
						if (this._gfx._viewport) {

							// get region from viewport
							let ret = this._gfx._viewport.clone();

							// if without offset, remove it
							if (includeOffset === false) {
								ret.x = ret.y = 0;
								_cachedRenderingRegion.withoutOffset = ret;
								return ret;
							}
							// else, include offset
							else {
								_cachedRenderingRegion.withOffset = ret;
								return ret;
							}
						}

						// if we don't have viewport..
						let ret = new Rectangle(0, 0, (_renderTarget || _canvas).width, (_renderTarget || _canvas).height);
						_cachedRenderingRegion.withoutOffset = _cachedRenderingRegion.withOffset = ret;
						return ret;
					}

					setTextureFilter(filter) {
						if (!TextureFilterModes._values.has(filter)) { throw new Error("Invalid texture filter mode! Please pick a value from 'TextureFilterModes'."); }
						let glMode = _gl[filter];
						_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, glMode);
						_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, glMode);
					}

					setTextureWrapMode(wrapX, wrapY) {
						if (wrapY === undefined) { wrapY = wrapX; }
						if (!TextureWrapModes._values.has(wrapX)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
						if (!TextureWrapModes._values.has(wrapY)) { throw new Error("Invalid texture wrap mode! Please pick a value from 'TextureWrapModes'."); }
						_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl[wrapX]);
						_gl.texParameteri(_gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl[wrapY]);
					}

					setActiveTexture(texture) {
						if (_activeEffect.setTexture(texture)) {
							this.setTextureFilter(texture.filter || this._gfx.defaultTextureFilter);
							this.setTextureWrapMode(texture.wrapMode || this._gfx.defaultTextureWrapMode);
						}
					}

					setBlendMode(blendMode) {
						if (_lastBlendMode !== blendMode) {

							// get gl context and set defaults
							var gl = _gl;
							switch (blendMode) {
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
							_lastBlendMode = blendMode;
						}
					}
				}

				// export main object
				module.exports = new Gfx();

				/***/
			}),

/***/ 7565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Just an alias to main manager so we can require() this folder as a package.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				module.exports = __webpack_require__(4672);

				/***/
			}),

/***/ 6565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Define a sprite object we can draw using sprite batches.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\sprite.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const TextureAsset = __webpack_require__(2262);
				const TextureAssetBase = __webpack_require__(4397);
				const Color = __webpack_require__(9327);
				const Rectangle = __webpack_require__(4731);
				const Vector2 = __webpack_require__(2544);
				const Vector3 = __webpack_require__(8329);


				/**
				 * Sprite class.
				 */
				class Sprite {
					/**
					 * Create the sprite object.
					 * @param {TextureAssetBase} texture Sprite texture.
					 * @param {Rectangle=} sourceRectangle Optional source rectangle.
					 */
					constructor(texture, sourceRectangle) {
						/**
						 * Sprite's texture.
						 * @name Sprite#texture
						 * @type {TextureAssetBase}
						 */
						this.texture = texture;

						/**
						 * Sprite position.
						 * If Vector3 is provided, the z value will be passed to vertices position in shader code.
						 * @name Sprite#position
						 * @type {Vector2|Vector3}
						 */
						this.position = Vector2.zero();

						/**
						 * Sprite size.
						 * If Vector3 is provided, the z value will be passed to the bottom vertices position in shader code, as position.z + size.z.
						 * @name Sprite#size
						 * @type {Vector2|Vector3}
						 */
						this.size = new Vector2(100, 100);

						/**
						 * Sprite source rectangle in texture.
						 * Null will take entire texture.
						 * @name Sprite#sourceRectangle
						 * @type {Rectangle}
						 */
						this.sourceRectangle = sourceRectangle || null;

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
						 * Skew the sprite corners on X and Y axis, around the origin point.
						 * @name Sprite#skew
						 * @type {Vector2}
						 */
						this.skew = null;

						/**
						 * Sprite color.
						 * If array is set, will assign each color to different vertex, starting from top-left.
						 * @name Sprite#color
						 * @type {Color|Array<Color>}
						 */
						this.color = Color.white;
					}

					/**
					 * Set size to source rectangle size.
					 * @returns {Sprite} this.
					 */
					setToSourceRectangleSize() {
						this.size.copy(this.sourceRectangle.getSize());
						return this;
					}

					/**
					 * Set size to texture size.
					 * @returns {Sprite} this.
					 */
					setToTextureSize() {
						this.size.copy(this.texture.getSize());
						return this;
					}

					/**
					 * Build a sprite from params.
					 * @param {TextureAssetBase} texture Sprite texture.
					 * @param {Vector2|Vector3} position Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute.
					 * @param {Vector2|Vector3|Number} size Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z.
					 * @param {Rectangle} sourceRectangle Source rectangle, or undefined to use the entire texture.
					 * @param {Color|Array<Color>|undefined} color Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left.
					 * @param {Number=} rotation Rotate sprite.
					 * @param {Vector2=} origin Drawing origin. This will be the point at 'position' and rotation origin.
					 * @param {Vector2=} skew Skew the drawing corners on X and Y axis, around the origin point.
					 * @returns {Sprite} New sprite instance.
					 */
					static build(texture, position, size, sourceRectangle, color, rotation, origin, skew) {
						let sprite = new Sprite(texture, sourceRectangle);
						sprite.position = position;
						sprite.size = (typeof size === 'number') ? new Vector2(size, size) : size;
						if (color) { sprite.color = color; }
						if (rotation) { sprite.rotation = rotation; }
						if (origin) { sprite.origin = origin; }
						if (skew) { sprite.skew = skew; }
						return sprite;
					}

					/**
					 * Set the source Rectangle automatically from spritesheet.
					 * This method get sprite index in sheet and how many sprites there are in total, and calculate the desired
					 * offset and size in source Rectangle based on it + source image size.
					 * @param {TextureAssetBase} texture Texture to set source rectangle from.
					 * @param {Vector2} index Sprite index in spritesheet.
					 * @param {Vector2} spritesCount How many sprites there are in spritesheet in total.
					 * @param {Number=} margin How many pixels to trim from the tile (default is 0).
					 * @param {Boolean=} setSize If true will also set width and height based on source rectangle (default is true).
					 */
					setSourceFromSpritesheet(texture, index, spritesCount, margin, setSize) {
						if (texture.width === 0 || texture.height === 0) {
							throw new Error("Texture has illegal size or is not fully loaded yet!");
						}

						margin = margin || 0;
						let w = texture.width / spritesCount.x;
						let h = texture.height / spritesCount.y;
						let x = w * index.x + margin;
						let y = h * index.y + margin;
						w -= 2 * margin;
						h -= 2 * margin;
						if (setSize || setSize === undefined) {
							this.size.set(w, h);
						}
						if (this.sourceRectangle) {
							this.sourceRectangle.set(x, y, w, h);
						} else {
							this.sourceRectangle = new Rectangle(x, y, w, h);
						}
					}

					/**
					 * Clone this sprite.
					 * @returns {Sprite} cloned sprite.
					 */
					clone() {
						let sourceRect = this.sourceRectangle ? this.sourceRectangle.clone() : undefined;
						let ret = new Sprite(this.texture, sourceRect);
						ret.position = this.position.clone();
						ret.size = this.size.clone();
						ret.rotation = this.rotation || 0;
						ret.origin = this.origin ? this.origin.clone() : null;
						ret.color = this.color ? this.color.clone() : null;
						ret.skew = this.skew ? this.skew.clone() : null;
						return ret;
					}

					/**
					 * Check if this sprite is flipped around X axis.
					 * This is just a sugarcoat that returns if size.x < 0.
					 * @returns {Boolean} If sprite is flipped on X axis.
					 */
					get flipX() {
						return this.size.x < 0;
					}

					/**
					 * Flip sprite around X axis.
					 * This is just a sugarcoat that set size.x to negative or positive value, without changing its scale.
					 * @param {Boolean} flip Should we flip the sprite around X axis. If undefined, will take the negative of flipX current value, ie will toggle flipping.
					 */
					set flipX(flip) {
						if (flip === undefined) flip = !this.flipX;
						this.size.x = Math.abs(this.size.x) * (flip ? -1 : 1);
						return flip;
					}

					/**
					 * Check if this sprite is flipped around y axis.
					 * This is just a sugarcoat that returns if size.y < 0.
					 * @returns {Boolean} If sprite is flipped on Y axis.
					 */
					get flipY() {
						return this.size.y < 0;
					}

					/**
					 * Flip sprite around Y axis.
					 * This is just a sugarcoat that set size.y to negative or positive value, without changing its scale.
					 * @param {Boolean} flip Should we flip the sprite around Y axis. If undefined, will take the negative of flipY current value, ie will toggle flipping.
					 */
					set flipY(flip) {
						if (flip === undefined) flip = !this.flipY;
						this.size.y = Math.abs(this.size.y) * (flip ? -1 : 1);
						return flip;
					}
				}

				// export the sprite class.
				module.exports = Sprite;

				/***/
			}),

/***/ 1036:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Define a sprites group.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\sprites_group.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Color = __webpack_require__(9327);
				const Vector2 = __webpack_require__(2544);
				const Matrix = __webpack_require__(5529);
				const Sprite = __webpack_require__(6565);


				/**
				 * Sprites group class.
				 * This object is a container to hold sprites collection + parent transformations.
				 * You need SpritesGroup to use batched rendering.
				 */
				class SpritesGroup {
					/**
					 * Create the group object.
					 */
					constructor() {
						this._sprites = [];
						this.rotation = 0;
						this.position = new Vector2(0, 0);
						this.scale = new Vector2(1, 1);
					}

					/**
					 * Iterate all sprites.
					 * @param {Function} callback Callback to run on all sprites in group.
					 */
					forEach(callback) {
						this._sprites.forEach(callback);
					}

					/**
					 * Set color for all sprites in group.
					 * @param {Color} color Color to set.
					 */
					setColor(color) {
						for (let i = 0; i < this._sprites.length; ++i) {
							this._sprites[i].color.copy(color);
						}
					}

					/**
					 * Get group's transformations.
					 * @returns {Matrix} Transformations matrix, or null if there's nothing to apply.
					 */
					getTransform() {

						let matrices = [];

						// add position
						if ((this.position.x !== 0) || (this.position.y !== 0)) {
							matrices.push(Matrix.createTranslation(this.position.x, this.position.y, 0));
						}

						// add rotation
						if (this.rotation) {
							matrices.push(Matrix.createRotationZ(-this.rotation));
						}

						// add scale
						if ((this.scale.x !== 1) || (this.scale.y !== 1)) {
							matrices.push(Matrix.createScale(this.scale.x, this.scale.y));
						}

						// calculate matrix (or null if there are no transformations)
						if (matrices.length === 0) { return null; };
						if (matrices.length === 1) { return matrices[0]; }
						return Matrix.multiplyMany(matrices);
					}

					/**
					 * Adds a sprite to group.
					 * @param {Sprite} sprite Sprite to add.
					 * @returns {Sprite} The newly added sprite.
					 */
					add(sprite) {
						this._sprites.push(sprite);
						return sprite;
					}

					/**
					 * Remove a sprite from group.
					 * @param {Sprite} sprite Sprite to remove.
					 */
					remove(sprite) {
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
					shift() {
						return this._sprites.shift();
					}

					/**
					 * Sort sprites.
					 * @param {Function} compare Comparer method.
					 */
					sort(compare) {
						this._sprites.sort(compare);
					}

					/**
					 * Sprites count in group.
					 * @returns {Number} Number of sprites in group.
					 */
					get count() {
						return this._sprites.length;
					}
				}


				// export the sprites group class.
				module.exports = SpritesGroup;

				/***/
			}),

/***/ 8684:
/***/ ((module) => {

				/**
				 * Define possible text alignments.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\text_alignments.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


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
				module.exports = { TextAlignments: TextAlignments };

				/***/
			}),

/***/ 5387:
/***/ ((module) => {

				/**
				 * Define possible texture filter modes.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\texture_filter_modes.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


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
				module.exports = { TextureFilterModes: TextureFilterModes };


				/***/
			}),

/***/ 2464:
/***/ ((module) => {

				/**
				 * Define possible texture wrap modes.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\texture_wrap_modes.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


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
				module.exports = { TextureWrapModes: TextureWrapModes };

				/***/
			}),

/***/ 4288:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the gfx vertex container.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\gfx\vertex.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vector2 = __webpack_require__(2544);
				const Vector3 = __webpack_require__(8329);
				const Color = __webpack_require__(9327);


				/**
				 * A vertex we can push to sprite batch.
				 */
				class Vertex {
					/**
					 * Create the vertex data.
					 * @param {Vector2|Vector3} position Vertex position.
					 * @param {Vector2} textureCoord Vertex texture coord (in pixels).
					 * @param {Color} color Vertex color (undefined will default to white).
					 * @param {Vector3} normal Vertex normal.
					 */
					constructor(position, textureCoord, color, normal) {
						this.position = position || Vector2.zero();
						this.textureCoord = textureCoord || Vector2.zero();
						this.color = color || Color.white;
						this.normal = normal;
					}

					/**
					 * Set position.
					 * @param {Vector2|Vector3} position Vertex position.
					 * @param {Boolean} useRef If true, will not clone the given position vector and use its reference instead.
					 * @returns {Vertex} this.
					 */
					setPosition(position, useRef) {
						this.position = useRef ? position : position.clone();
						return this;
					}

					/**
					 * Set texture coordinates.
					 * @param {Vector2} textureCoord Vertex texture coord (in pixels).
					 * @param {Boolean} useRef If true, will not clone the given coords vector and use its reference instead.
					 * @returns {Vertex} this.
					 */
					setTextureCoords(textureCoord, useRef) {
						this.textureCoord = useRef ? textureCoord : textureCoord.clone();
						return this;
					}

					/**
					 * Set vertex color.
					 * @param {Color} color Vertex color.
					 * @param {Boolean} useRef If true, will not clone the given color and use its reference instead.
					 * @returns {Vertex} this.
					 */
					setColor(color, useRef) {
						this.color = useRef ? color : color.clone();
						return this;
					}

					/**
					 * Set vertex normal.
					 * @param {Vector3} normal Vertex normal.
					 * @param {Boolean} useRef If true, will not clone the given normal and use its reference instead.
					 * @returns {Vertex} this.
					 */
					setNormal(normal, useRef) {
						this.normal = useRef ? normal : normal.clone();
						return this;
					}

					/**
					 * Set vertex binormal.
					 * @param {Vector3} binormal Vertex binormal.
					 * @param {Boolean} useRef If true, will not clone the given binormal and use its reference instead.
					 * @returns {Vertex} this.
					 */
					setBinormal(binormal, useRef) {
						this.binormal = useRef ? binormal : binormal.clone();
						return this;
					}

					/**
					 * Set vertex tangent.
					 * @param {Vector3} tangent Vertex tangent.
					 * @param {Boolean} useRef If true, will not clone the given tangent and use its reference instead.
					 * @returns {Vertex} this.
					 */
					setTangent(tangent, useRef) {
						this.tangent = useRef ? tangent : tangent.clone();
						return this;
					}
				}

				// export the vertex class
				module.exports = Vertex;

				/***/
			}),

/***/ 8138:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Entry point for the Shaku module.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				__webpack_require__.g.Shaku = __webpack_require__(6954);
				module.exports = __webpack_require__.g.Shaku;

				/***/
			}),

/***/ 791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Define a gamepad object.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\input\gamepad.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vector2 = __webpack_require__(2544);


				/**
				 * Gamepad data object.
				 * This object represents a snapshot of a gamepad state, it does not update automatically.
				 */
				class Gamepad {
					/**
					 * Create gamepad state object.
					 * @param {*} gp Browser gamepad state object.
					 */
					constructor(gp) {
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
					button(index) {
						return this._buttonsDown[index];
					}

					/**
					 * Get buttons count.
					 * @returns {Number} Buttons count.
					 */
					get buttonsCount() {
						return this._buttonsDown.length;
					}
				}


				/**
				 * Buttons cluster container - 4 buttons.
				 */
				class FourButtonsCluster {
					/**
					 * Create the cluster states.
					 * @param {Boolean} bottom Bottom button state.
					 * @param {Boolean} right Right button state.
					 * @param {Boolean} left Left button state.
					 * @param {Boolean} top Top button state.
					 */
					constructor(bottom, right, left, top) {
						this.bottom = Boolean(bottom);
						this.right = Boolean(right);
						this.left = Boolean(left);
						this.top = Boolean(top);
					}
				}


				/**
				 * Buttons cluster container - 3 buttons.
				 */
				class ThreeButtonsCluster {
					/**
					 * Create the cluster states.
					 * @param {Boolean} left Left button state.
					 * @param {Boolean} right Right button state.
					 * @param {Boolean} center Center button state.
					 */
					constructor(left, right, center) {
						this.left = Boolean(left);
						this.right = Boolean(right);
						this.center = Boolean(center);
					}
				}


				/**
				 * Front buttons.
				 */
				class FrontButtons {
					/**
					 * Create the cluster states.
					 */
					constructor(topLeft, topRight, bottomLeft, bottomRight) {
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
				function _gamepadButtonPressed(b) {
					if (typeof b === "object") {
						return b.pressed;
					}
					return b === 1.0;
				}


				// export the gamepad data
				module.exports = Gamepad;

				/***/
			}),

/***/ 8734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Just an alias to main manager so we can require() this folder as a package.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\input\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				module.exports = __webpack_require__(9896);

				/***/
			}),

/***/ 9896:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the input manager.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\input\input.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const IManager = __webpack_require__(9563);
				const Vector2 = __webpack_require__(2544);
				const { MouseButton, MouseButtons, KeyboardKey, KeyboardKeys } = __webpack_require__(4871);
				const Gamepad = __webpack_require__(791);
				const _logger = (__webpack_require__(5259).getLogger)('input');


				// get timestamp
				function timestamp() {
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
				class Input extends IManager {
					/**
					 * Create the manager.
					 */
					constructor() {
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
						 * @name Input#disableMouseWheelAutomaticScrolling
						 * @type {Boolean}
						 */
						this.disableMouseWheelAutomaticScrolling = true;

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
						this.#_resetAll();
					}

					/**
					 * Get the Mouse Buttons enum.
					 * @see MouseButtons
					 */
					get MouseButtons() {
						return MouseButtons;
					}

					/**
					 * Get the Keyboard Buttons enum.
					 * @see KeyboardKeys
					 */
					get KeyboardKeys() {
						return KeyboardKeys;
					}

					/**
					 * Return the string code to use in order to get touch events.
					 * @returns {String} Key code to use for touch events.
					 */
					get TouchKeyCode() {
						return _touchKeyCode;
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					setup() {
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
								'mousedown': function(event) { _this._onMouseDown(event); if (this.preventDefaults) event.preventDefault(); },
								'mouseup': function(event) { _this._onMouseUp(event); if (this.preventDefaults) event.preventDefault(); },
								'mousemove': function(event) { _this._onMouseMove(event); if (this.preventDefaults) event.preventDefault(); },
								'keydown': function(event) { _this._onKeyDown(event); if (this.preventDefaults) event.preventDefault(); },
								'keyup': function(event) { _this._onKeyUp(event); if (this.preventDefaults) event.preventDefault(); },
								'blur': function(event) { _this._onBlur(event); if (this.preventDefaults) event.preventDefault(); },
								'wheel': function(event) { _this._onMouseWheel(event); if (this.preventDefaults) event.preventDefault(); },
								'touchstart': function(event) { _this._onTouchStart(event); if (this.preventDefaults) event.preventDefault(); },
								'touchend': function(event) { _this._onTouchEnd(event); if (this.preventDefaults) event.preventDefault(); },
								'touchmove': function(event) { _this._onTouchMove(event); if (this.preventDefaults) event.preventDefault(); },
								'contextmenu': function(event) { if (_this.disableContextMenu) { event.preventDefault(); } },
							};

							// reset all data to init initial state
							this.#_resetAll();

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
					startFrame() {
						// query gamepads
						const prevGamepadData = this._gamepadsData || [];
						const prevDefaultGamepadId = (this._defaultGamepad || { id: 'null' }).id;
						this._gamepadsData = navigator.getGamepads();

						// get default gamepad and check for changes
						this._defaultGamepad = null;
						let i = 0;
						for (let gp of this._gamepadsData) {
							let newId = (gp || { id: 'null' }).id;
							let prevId = (prevGamepadData[i] || { id: 'null' }).id;
							if (newId !== prevId) {
								if (newId !== 'null') {
									_logger.info(`Gamepad ${i} connected: ${newId}.`);
								}
								else if (newId === 'null') {
									_logger.info(`Gamepad ${i} disconnected: ${prevId}.`);
								}
							}
							if (gp && !this._defaultGamepad) {
								this._defaultGamepad = gp;
								this._defaultGamepadIndex = i;
							}
							i++;
						}

						// changed default gamepad?
						const newDefaultGamepadId = (this._defaultGamepad || { id: 'null' }).id;
						if (newDefaultGamepadId !== prevDefaultGamepadId) {
							_logger.info(`Default gamepad changed from '${prevDefaultGamepadId}' to '${newDefaultGamepadId}'.`);
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
					destroy() {
						// unregister all callbacks
						if (this._callbacks) {
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
					setTargetElement(element) {
						if (this._callbacks) { throw new Error("'setTargetElement() must be called before initializing the input manager!"); }
						this._targetElement = element;
					}

					/**
					 * Reset all internal data and states.
					 * @param {Boolean=} keepMousePosition If true, will not reset mouse position.
					 * @private
					 */
					#_resetAll(keepMousePosition) {
						// mouse states
						if (!keepMousePosition) {
							this._mousePos = new Vector2();
							this._mousePrevPos = new Vector2();
						}
						this._mouseState = {};
						this._mouseWheel = 0;

						// touching states
						if (!keepMousePosition) {
							this._touchPosition = new Vector2();
						}
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
					gamepad(index) {
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
					gamepadId(index) {
						return this.gamepadIds()[index || 0] || null;
					}

					/**
					 * Return a list with connected devices ids.
					 * @returns {Array<String>} List of connected devices ids.
					 */
					gamepadIds() {
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
					get touchPosition() {
						return this._touchPosition.clone();
					}

					/**
					 * Get if currently touching a touch screen.
					 * @returns {Boolean} True if currently touching the screen.
					 */
					get touching() {
						return this._isTouching;
					}

					/**
					 * Get if started touching a touch screen in current frame.
					 * @returns {Boolean} True if started touching the screen now.
					 */
					get touchStarted() {
						return this._touchStarted;
					}

					/**
					 * Get if stopped touching a touch screen in current frame.
					 * @returns {Boolean} True if stopped touching the screen now.
					 */
					get touchEnded() {
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
					setCustomState(code, value) {
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
					get mousePosition() {
						return this._mousePos.clone();
					}

					/**
					 * Get mouse previous position (before the last endFrame() call).
					 * @returns {Vector2} Mouse position in previous frame.
					 */
					get prevMousePosition() {
						return (this._mousePrevPos || this._mousePos).clone();
					}

					/**
					 * Get mouse movement since last endFrame() call.
					 * @returns {Vector2} Mouse change since last frame.
					 */
					get mouseDelta() {
						// no previous position? return 0,0.
						if (!this._mousePrevPos) {
							return Vector2.zero();
						}

						// return mouse delta
						return new Vector2(this._mousePos.x - this._mousePrevPos.x, this._mousePos.y - this._mousePrevPos.y);
					}

					/**
					 * Get if mouse is currently moving.
					 * @returns {Boolean} True if mouse moved since last frame, false otherwise.
					 */
					get mouseMoving() {
						return (this._mousePrevPos && !this._mousePrevPos.equals(this._mousePos));
					}

					/**
					 * Get if mouse button was pressed this frame.
					 * @param {MouseButton} button Button code (defults to MouseButtons.left).
					 * @returns {Boolean} True if mouse button is currently down, but was up in previous frame.
					 */
					mousePressed(button = 0) {
						if (button === undefined) throw new Error("Invalid button code!");
						return Boolean(this._mousePressed[button]);
					}

					/**
					 * Get if mouse button is currently pressed.
					 * @param {MouseButton} button Button code (defults to MouseButtons.left).
					 * @returns {Boolean} true if mouse button is currently down, false otherwise.
					 */
					mouseDown(button = 0) {
						if (button === undefined) throw new Error("Invalid button code!");
						return Boolean(this._mouseState[button]);
					}

					/**
					 * Get if mouse button is currently not down.
					 * @param {MouseButton} button Button code (defults to MouseButtons.left).
					 * @returns {Boolean} true if mouse button is currently up, false otherwise.
					 */
					mouseUp(button = 0) {
						if (button === undefined) throw new Error("Invalid button code!");
						return Boolean(!this.mouseDown(button));
					}

					/**
					 * Get if mouse button was released in current frame.
					 * @param {MouseButton} button Button code (defults to MouseButtons.left).
					 * @returns {Boolean} True if mouse was down last frame, but released in current frame.
					 */
					mouseReleased(button = 0) {
						if (button === undefined) throw new Error("Invalid button code!");
						return Boolean(this._mouseReleased[button]);
					}

					/**
					 * Get if keyboard key is currently pressed down.
					 * @param {KeyboardKey} key Keyboard key code.
					 * @returns {boolean} True if keyboard key is currently down, false otherwise.
					 */
					keyDown(key) {
						if (key === undefined) throw new Error("Invalid key code!");
						return Boolean(this._keyboardState[key]);
					}

					/**
					 * Get if keyboard key is currently not down.
					 * @param {KeyboardKey} key Keyboard key code.
					 * @returns {Boolean} True if keyboard key is currently up, false otherwise.
					 */
					keyUp(key) {
						if (key === undefined) throw new Error("Invalid key code!");
						return Boolean(!this.keyDown(key));
					}

					/**
					 * Get if a keyboard button was released in current frame.
					 * @param {KeyboardKey} button Keyboard key code.
					 * @returns {Boolean} True if key was down last frame, but released in current frame.
					 */
					keyReleased(key) {
						if (key === undefined) throw new Error("Invalid key code!");
						return Boolean(this._keyboardReleased[key]);
					}

					/**
					 * Get if keyboard key was pressed this frame.
					 * @param {KeyboardKey} key Keyboard key code.
					 * @returns {Boolean} True if key is currently down, but was up in previous frame.
					 */
					keyPressed(key) {
						if (key === undefined) throw new Error("Invalid key code!");
						return Boolean(this._keyboardPressed[key]);
					}

					/**
					 * Get if any of the shift keys are currently down.
					 * @returns {Boolean} True if there's a shift key pressed down.
					 */
					get shiftDown() {
						return Boolean(this.keyDown(this.KeyboardKeys.shift));
					}

					/**
					 * Get if any of the Ctrl keys are currently down.
					 * @returns {Boolean} True if there's a Ctrl key pressed down.
					 */
					get ctrlDown() {
						return Boolean(this.keyDown(this.KeyboardKeys.ctrl));
					}

					/**
					 * Get if any of the Alt keys are currently down.
					 * @returns {Boolean} True if there's an Alt key pressed down.
					 */
					get altDown() {
						return Boolean(this.keyDown(this.KeyboardKeys.alt));
					}

					/**
					 * Get if any keyboard key was pressed this frame.
					 * @returns {Boolean} True if any key was pressed down this frame.
					 */
					get anyKeyPressed() {
						return Object.keys(this._keyboardPressed).length !== 0;
					}

					/**
					 * Get if any keyboard key is currently down.
					 * @returns {Boolean} True if there's a key pressed down.
					 */
					get anyKeyDown() {
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
					get anyMouseButtonPressed() {
						return Object.keys(this._mousePressed).length !== 0;
					}

					/**
					 * Get if any mouse button is down.
					 * @returns {Boolean} True if any of the mouse buttons are pressed.
					 */
					get anyMouseButtonDown() {
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
					#_getValueWithCode(code, mouseCheck, keyboardCheck, touchValue, customValues) {
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
					 * @param {string|Array<String>} code Keyboard, touch or mouse code. Can be array of codes to test any of them.
					 *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
					 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
					 *                          For touch screen: set code to 'touch'.
					 *                          For numbers (0-9): you can use the number itself.
					 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
					 * @returns {Boolean} True if key or mouse button are down.
					 */
					down(code) {
						if (!Array.isArray(code)) { code = [code]; }
						for (let c of code) {
							if (Boolean(this.#_getValueWithCode(c, this.mouseDown, this.keyDown, this.touching, this._customStates))) {
								return true;
							}
						}
						return false;
					}

					/**
					 * Return if a mouse or keyboard button was released in this frame.
					 * @example
					 * if (Shaku.input.released(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were released!'); }
					 * @param {string|Array<String>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
					 *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
					 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
					 *                          For touch screen: set code to 'touch'.
					 *                          For numbers (0-9): you can use the number itself.
					 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
					 * @returns {Boolean} True if key or mouse button were down in previous frame, and released this frame.
					 */
					released(code) {
						if (!Array.isArray(code)) { code = [code]; }
						for (let c of code) {
							if (Boolean(this.#_getValueWithCode(c, this.mouseReleased, this.keyReleased, this.touchEnded, this._customReleased))) {
								return true;
							}
						}
						return false;
					}

					/**
					 * Return if a mouse or keyboard button was pressed in this frame.
					 * @example
					 * if (Shaku.input.pressed(['mouse_left', 'touch', 'space'])) { alert('mouse, touch screen or space were pressed!'); }
					 * @param {string|Array<String>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
					 *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
					 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
					 *                          For touch screen: set code to 'touch'.
					 *                          For numbers (0-9): you can use the number itself.
					 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
					 * @returns {Boolean} True if key or mouse button where up in previous frame, and pressed this frame.
					 */
					pressed(code) {
						if (!Array.isArray(code)) { code = [code]; }
						for (let c of code) {
							if (Boolean(this.#_getValueWithCode(c, this.mousePressed, this.keyPressed, this.touchStarted, this._customPressed))) {
								return true;
							}
						}
						return false;
					}

					/**
					 * Return timestamp, in milliseconds, of the last time this key code was released.
					 * @example
					 * let lastReleaseTime = Shaku.input.lastReleaseTime('mouse_left');
					 * @param {string} code Keyboard, touch, gamepad or mouse button code.
					 *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
					 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
					 *                          For touch screen: set code to 'touch'.
					 *                          For numbers (0-9): you can use the number itself.
					 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
					 * @returns {Number} Timestamp of last key release, or 0 if was never released.
					 */
					lastReleaseTime(code) {
						if (Array.isArray(code)) { throw new Error("Array not supported in 'lastReleaseTime'!"); }
						return this.#_getValueWithCode(code, (c) => this._lastMouseReleasedTime[c], (c) => this._lastKeyReleasedTime[c], this._lastTouchReleasedTime, this._prevLastCustomReleasedTime) || 0;
					}

					/**
					 * Return timestamp, in milliseconds, of the last time this key code was pressed.
					 * @example
					 * let lastPressTime = Shaku.input.lastPressTime('mouse_left');
					 * @param {string} code Keyboard, touch, gamepad or mouse button code.
					 *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
					 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
					 *                          For touch screen: set code to 'touch'.
					 *                          For numbers (0-9): you can use the number itself.
					 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
					 * @returns {Number} Timestamp of last key press, or 0 if was never pressed.
					 */
					lastPressTime(code) {
						if (Array.isArray(code)) { throw new Error("Array not supported in 'lastPressTime'!"); }
						return this.#_getValueWithCode(code, (c) => this._lastMousePressedTime[c], (c) => this._lastKeyPressedTime[c], this._lastTouchPressedTime, this._prevLastCustomPressedTime) || 0;
					}

					/**
					 * Return if a key was double-pressed.
					 * @example
					 * let doublePressed = Shaku.input.doublePressed(['mouse_left', 'touch', 'space']);
					 * @param {string|Array<string>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
					 *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
					 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
					 *                          For touch screen: set code to 'touch'.
					 *                          For numbers (0-9): you can use the number itself.
					 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
					 * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-press. Defaults to `defaultDoublePressInterval`.
					 * @returns {Boolean} True if one or more key codes double-pressed, false otherwise.
					 */
					doublePressed(code, maxInterval) {
						// default interval
						maxInterval = maxInterval || this.defaultDoublePressInterval;

						// current timestamp
						let currTime = timestamp();

						// check all keys
						if (!Array.isArray(code)) { code = [code]; }
						for (let c of code) {
							if (this.pressed(c)) {
								let currKeyTime = this.#_getValueWithCode(c, (c) => this._prevLastMousePressedTime[c], (c) => this._prevLastKeyPressedTime[c], this._prevLastTouchPressedTime, this._prevLastCustomPressedTime);
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
					 * @param {string|Array<string>} code Keyboard, touch, gamepad or mouse button code. Can be array of codes to test any of them.
					 *                          For mouse buttons: set code to 'mouse_left', 'mouse_right' or 'mouse_middle'.
					 *                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..).
					 *                          For touch screen: set code to 'touch'.
					 *                          For numbers (0-9): you can use the number itself.
					 *                          Note: if you inject any custom state via `setCustomState()`, you can use its code here too.
					 * @param {Number} maxInterval Max interval time, in milliseconds, to consider it a double-release. Defaults to `defaultDoublePressInterval`.
					 * @returns {Boolean} True if one or more key codes double-released, false otherwise.
					 */
					doubleReleased(code, maxInterval) {
						// default interval
						maxInterval = maxInterval || this.defaultDoublePressInterval;

						// current timestamp
						let currTime = timestamp();

						// check all keys
						if (!Array.isArray(code)) { code = [code]; }
						for (let c of code) {
							if (this.released(c)) {
								let currKeyTime = this.#_getValueWithCode(c, (c) => this._prevLastMousePressedTime[c], (c) => this._prevLastKeyPressedTime[c], this._prevLastTouchPressedTime, this._prevLastCustomPressedTime);
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
					get mouseWheelSign() {
						return Math.sign(this._mouseWheel);
					}

					/**
					 * Get mouse wheel value.
					 * @returns {Number} Mouse wheel value.
					 */
					get mouseWheel() {
						return this._mouseWheel;
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					endFrame() {
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
					#_getKeyboardKeyCode(event) {
						event = this._getEvent(event);
						return event.keyCode !== undefined ? event.keyCode : event.key.charCodeAt(0);
					}

					/**
					 * Called when window loses focus - clear all input states to prevent keys getting stuck.
					 * @private
					 */
					_onBlur(event) {
						if (this.resetOnFocusLoss) {
							this.#_resetAll(true);
						}
					}

					/**
					 * Handle mouse wheel events.
					 * @private
					 * @param {*} event Event data from browser.
					 */
					_onMouseWheel(event) {
						this._mouseWheel = event.deltaY;
					}

					/**
					 * Handle keyboard down event.
					 * @private
					 * @param {*} event Event data from browser.
					 */
					_onKeyDown(event) {
						var keycode = this.#_getKeyboardKeyCode(event);
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
					_onKeyUp(event) {
						var keycode = this.#_getKeyboardKeyCode(event) || 0;
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
					_getTouchEventPosition(event) {
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
					_onTouchStart(event) {
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
					_onTouchEnd(event) {
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
					_onTouchMove(event) {
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
					_onMouseDown(event) {
						event = this._getEvent(event);
						if (this.disableMouseWheelAutomaticScrolling && (event.button === this.MouseButtons.middle)) {
							event.preventDefault();
						}
						this._mouseButtonDown(event.button);
					}

					/**
					 * Handle mouse up event.
					 * @private
					 * @param {*} event Event data from browser.
					 */
					_onMouseUp(event) {
						event = this._getEvent(event);
						this._mouseButtonUp(event.button);
					}

					/**
					 * Mouse button pressed logic.
					 * @private
					 * @param {*} button Button pressed.
					 */
					_mouseButtonDown(button) {
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
					_mouseButtonUp(button) {
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
					_onMouseMove(event) {
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
					_normalizeMousePos() {
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
					_getEvent(event) {
						return event || window.event;
					}
				}


				// export main object
				module.exports = new Input();

				/***/
			}),

/***/ 4871:
/***/ ((module) => {

				/**
				 * Define keyboard and mouse key codes.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\input\key_codes.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


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

				/***/
			}),

/***/ 5259:
/***/ ((module) => {

				/**
				 * Implement basic logger.
				 * By default, uses console for logging, but it can be replaced with setDrivers().
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\logger.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				// default logger drivers.
				var _drivers = console;

				// application name
				var _application = "Shaku";

				/**
				 * A logger manager.
				 * By default writes logs to console.
				 */
				class Logger {
					constructor(name) {
						this._nameHeader = ('[' + _application + '][' + name + ']').padEnd(25, ' ');
						this._throwErrors = false;
					}

					/**
					 * Write a trace level log message.
					 * @param {String} msg Message to write.
					 */
					trace(msg) {
						_drivers.trace(this._nameHeader, msg);
					}

					/**
					 * Write a debug level log message.
					 * @param {String} msg Message to write.
					 */
					debug(msg) {
						_drivers.debug(this._nameHeader, msg);
					}

					/**
					 * Write an info level log message.
					 * @param {String} msg Message to write.
					 */
					info(msg) {
						_drivers.info(this._nameHeader, msg);
					}

					/**
					 * Write a warning level log message.
					 * @param {String} msg Message to write.
					 */
					warn(msg) {
						_drivers.warn(this._nameHeader, msg);
						if (this._throwErrors) {
							throw new Error(msg);
						}
					}

					/**
					 * Write an error level log message.
					 * @param {String} msg Message to write.
					 */
					error(msg) {
						_drivers.error(this._nameHeader, msg);
						if (this._throwErrors) {
							throw new Error(msg);
						}
					}

					/**
					 * Set logger to throw an error every time a log message with severity higher than warning is written.
					 * @param {Boolean} enable Set to true to throw error on warnings.
					 */
					throwErrorOnWarnings(enable) {
						this._throwErrors = Boolean(enable);
					}
				}


				/**
				 * Null logger drivers to silent logs.
				 * @private
				 */
				class NullDrivers {
					/**
					 * @private
					 */
					constructor() {
					}
					trace(msg) {
					}
					debug(msg) {
					}
					info(msg) {
					}
					warn(msg) {
					}
					error(msg) {
					}
				}


				// cached loggers
				const _cachedLoggers = {};


				/**
				 * The Logger module is a small object to get loggers and control the underlying logger drivers.
				 */
				const LoggerModule = {

					/**
					 * Get a logger object for a given logger name.
					 * @param {String} name Logger name.
					 * @returns {Logger} Logger to use.
					 */
					getLogger: function(name) {
						if (!_cachedLoggers[name]) {
							_cachedLoggers[name] = new Logger(name);
						}
						return _cachedLoggers[name];
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
					setDrivers: function(drivers) {
						_drivers = drivers;
					},

					/**
					 * Set logger application name.
					 * @param {String} name Set application name to replace the 'Shaku' in the headers.
					 */
					setApplicationName: function(name) {
						_application = name;
						return this;
					}
				};

				// export the logger module object.
				module.exports = LoggerModule;

				/***/
			}),

/***/ 9563:
/***/ ((module) => {

				/**
				 * Define the managers interface.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\manager.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */



				/**
				 * Interface for any manager.
				 * Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.
				 */
				class IManager {
					/**
					 * Initialize the manager.
					 * @returns {Promise} Promise to resolve when initialization is done.
					 */
					setup() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Called every update at the begining of the frame.
					 */
					startFrame() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Called every update at the end of the frame.
					 */
					endFrame() {
						throw new Error("Not Implemented!");
					}

					/**
					 * Destroy the manager.
					 */
					destroy() {
						throw new Error("Not Implemented!");
					}
				}

				// export the manager interface.
				module.exports = IManager;

				/***/
			}),

/***/ 6871:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Just an alias to main manager so we can require() this folder as a package.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\sfx\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				module.exports = __webpack_require__(4939);

				/***/
			}),

/***/ 4939:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement the sfx manager.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\sfx\sfx.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const SoundAsset = __webpack_require__(499);
				const IManager = __webpack_require__(9563);
				const _logger = (__webpack_require__(5259).getLogger)('sfx');
				const SoundInstance = __webpack_require__(7244);
				const SoundMixer = __webpack_require__(8383);


				/**
				 * Sfx manager.
				 * Used to play sound effects and music.
				 *
				 * To access the Sfx manager use `Shaku.sfx`.
				 */
				class Sfx extends IManager {
					/**
					 * Create the manager.
					 */
					constructor() {
						super();
						this._playingSounds = null;
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					setup() {
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
					startFrame() {
						// remove any sound no longer playing
						let playingSounds = Array.from(this._playingSounds);
						for (let sound of playingSounds) {
							if (!sound.isPlaying) {
								this._playingSounds.delete(sound);
							}
						}
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					endFrame() {
					}

					/**
					 * @inheritdoc
					 * @private
					 **/
					destroy() {
						this.stopAll();
						this.cleanup();
					}

					/**
					 * Get the SoundMixer class.
					 * @see SoundMixer
					 */
					get SoundMixer() {
						return SoundMixer;
					}

					/**
					 * Play a sound once without any special properties and without returning a sound instance.
					 * Its a more convinient method to play sounds, but less efficient than 'createSound()' if you want to play multiple times.
					 * @example
					 * let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
					 * Shaku.sfx.play(sound, 0.75);
					 * @param {SoundAsset} soundAsset Sound asset to play.
					 * @param {Number} volume Volume to play sound (default to max).
					 * @param {Number} playbackRate Optional playback rate factor.
					 * @param {Boolean} preservesPitch Optional preserve pitch when changing rate factor.
					 * @returns {Promise} Promise to resolve when sound starts playing.
					 */
					play(soundAsset, volume, playbackRate, preservesPitch) {
						let sound = this.createSound(soundAsset);
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
					stopAll() {
						let playingSounds = Array.from(this._playingSounds);
						for (let sound of playingSounds) {
							sound.stop();
						}
						this._playingSounds = new Set();
					}

					/**
					 * Get currently playing sounds count.
					 * @returns {Number} Number of sounds currently playing.
					 */
					get playingSoundsCount() {
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
					createSound(sound) {
						if (!(sound.isSoundAsset)) { throw new Error("Sound type must be an instance of SoundAsset!"); }
						var ret = new SoundInstance(this, sound.url);
						return ret;
					}

					/**
					 * Get master volume.
					 * This affect all sound effects volumes.
					 * @returns {Number} Current master volume value.
					 */
					get masterVolume() {
						return SoundInstance._masterVolume;
					}

					/**
					 * Set master volume.
					 * This affect all sound effects volumes.
					 * @param {Number} value Master volume to set.
					 */
					set masterVolume(value) {
						SoundInstance._masterVolume = value;
						return value;
					}
				}

				// export main object
				module.exports = new Sfx();

				/***/
			}),

/***/ 7244:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a sound effect instance.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\sfx\sound_instance.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const _logger = (__webpack_require__(5259).getLogger)('sfx');


				/**
				 * A sound effect instance you can play and stop.
				 */
				class SoundInstance {
					/**
					* Create a sound instance.
					* @param {Sfx} sfxManager Sfx manager instance.
					* @param {String} url Sound URL or source.
					*/
					constructor(sfxManager, url) {
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
					disposeWhenDone() {
						this._audio.onended = () => {
							this.dispose();
						};
					}

					/**
					 * Dispose the audio object and clear its resources.
					 * When playing lots of sounds its important to call dispose on sounds you no longer use, to avoid getting hit by
					 * "Blocked attempt to create a WebMediaPlayer" exception.
					 */
					dispose() {
						if (this._audio) {
							try {
								this._audio.pause();
								this._audio.remove();
							} catch (e) { _logger.warn(`Error while disposing sound instance: ${e}.`); }
							this._audio.src = "";
							this._audio.srcObject = null;
						}
						this._audio = null;
					}

					/**
					* Play sound.
					* @returns {Promise} Promise to return when sound start playing.
					*/
					play() {
						if (!this._audio) { throw new Error("Sound instance was already disposed!"); }
						if (this.playing) { return; }
						let promise = this._audio.play();
						this._sfx._playingSounds.add(this);
						return promise;
					}

					/**
					* Get sound effect playback rate.
					* @returns {Number} Playback rate.
					*/
					get playbackRate() {
						if (!this._audio) { return 0; }
						return this._audio.playbackRate;
					}

					/**
					* Set playback rate.
					* @param {Number} val Playback value to set.
					*/
					set playbackRate(val) {
						if (!this._audio) { return 0; }
						if (val < 0.1) { _logger.error("playbackRate value set is too low, value was capped to 0.1."); }
						if (val > 10) { _logger.error("playbackRate value set is too high, value was capped to 10."); }
						this._audio.playbackRate = val;
						return val;
					}

					/**
					* Get if to preserve pitch while changing playback rate.
					* @returns {Boolean} Preserve pitch state of the sound instance.
					*/
					get preservesPitch() {
						if (!this._audio) { return false; }
						return Boolean(this._audio.preservesPitch || this._audio.mozPreservesPitch);
					}

					/**
					* Set if to preserve pitch while changing playback rate.
					* @param {Boolean} val New preserve pitch value to set.
					*/
					set preservesPitch(val) {
						if (!this._audio) { return false; }
						return this._audio.preservesPitch = this._audio.mozPreservesPitch = Boolean(val);
					}

					/**
					* Pause the sound.
					*/
					pause() {
						if (!this._audio) { throw new Error("Sound instance was already disposed!"); }
						this._audio.pause();
					}

					/**
					* Replay sound from start.
					* @returns {Promise} Promise to return when sound start playing.
					*/
					replay() {
						if (!this._audio) { throw new Error("Sound instance was already disposed!"); }
						this.stop();
						return this.play();
					}

					/**
					* Stop the sound and go back to start.
					* @returns {Boolean} True if successfully stopped sound, false otherwise.
					*/
					stop() {
						if (!this._audio) { throw new Error("Sound instance was already disposed!"); }
						try {
							this.pause();
							this.currentTime = 0;
							return true;
						}
						catch (e) {
							return false;
						}
					}

					/**
					* Get if playing in loop.
					* @returns {Boolean} If this sound should play in loop.
					*/
					get loop() {
						if (!this._audio) { return false; }
						return this._audio.loop;
					}

					/**
					* Set if playing in loop.
					* @param {Boolean} value If this sound should play in loop.
					*/
					set loop(value) {
						if (!this._audio) { return false; }
						this._audio.loop = value;
						return this._audio.loop;
					}

					/**
					* Get volume.
					* @returns {Number} Sound effect volume.
					*/
					get volume() {
						if (!this._audio) { return 0; }
						return this._volume;
					}

					/**
					* Set volume.
					* @param {Number} value Sound effect volume to set.
					*/
					set volume(value) {
						if (!this._audio) { return 0; }
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
					get currentTime() {
						if (!this._audio) { return 0; }
						return this._audio.currentTime;
					}

					/**
					* Set current time in track.
					* @param {Number} value Set current playing time in sound track.
					*/
					set currentTime(value) {
						if (!this._audio) { return 0; }
						return this._audio.currentTime = value;
					}

					/**
					* Get track duration.
					* @returns {Number} Sound duration in seconds.
					*/
					get duration() {
						if (!this._audio) { return 0; }
						return this._audio.duration;
					}

					/**
					* Get if sound is currently paused.
					* @returns {Boolean} True if sound is currently paused.
					*/
					get paused() {
						if (!this._audio) { return false; }
						return this._audio.paused;
					}

					/**
					* Get if sound is currently playing.
					* @returns {Boolean} True if sound is currently playing.
					*/
					get playing() {
						if (!this._audio) { return false; }
						return !this.paused && !this.finished;
					}

					/**
					* Get if finished playing.
					* @returns {Boolean} True if sound reached the end and didn't loop.
					*/
					get finished() {
						if (!this._audio) { return false; }
						return this._audio.ended;
					}
				}


				// master volume
				SoundInstance._masterVolume = 1;


				// export main object
				module.exports = SoundInstance;

				/***/
			}),

/***/ 8383:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a sound mixer class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\sfx\sound_mixer.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const SoundInstance = __webpack_require__(7244);


				/**
				 * A utility class to mix between two sounds.
				 */
				class SoundMixer {
					/**
					 * Create the sound mixer.
					 * @param {SoundInstance} sound1 Sound to mix from. Can be null to just fade in.
					 * @param {SoundInstance} sound2 Sound to mix to. Can be null to just fade out.
					 * @param {Boolean} allowOverlapping If true (default), will mix while overlapping sounds.
					 *                                   If false, will first finish first sound before begining next.
					 */
					constructor(sound1, sound2, allowOverlapping) {
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
					stop() {
						if (this._sound1) { this._sound1.stop(); }
						if (this._sound2) { this._sound2.stop(); }
					}

					/**
					 * Get first sound.
					 * @returns {SoundInstance} First sound instance.
					 */
					get fromSound() {
						return this._sound1;
					}

					/**
					 * Get second sound.
					 * @returns {SoundInstance} Second sound instance.
					 */
					get toSound() {
						return this._sound2;
					}

					/**
					 * Return current progress.
					 * @returns {Number} Mix progress from 0 to 1.
					 */
					get progress() {
						return this._progress;
					}

					/**
					 * Update the mixer progress with time delta instead of absolute value.
					 * @param {Number} delta Progress delta, in seconds.
					 */
					updateDelta(delta) {
						this.update(this._progress + delta);
					}

					/**
					 * Update the mixer progress.
					 * @param {Number} progress Transition progress from sound1 to sound2. Values must be between 0.0 to 1.0.
					 */
					update(progress) {
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
						else {
							this._progress = progress;
							if (this._sound1) { this._sound1.play(); }
							if (this._sound2) { this._sound2.play(); }

							if (this.allowOverlapping) {
								if (this._sound1) { this._sound1.volume = this.fromSoundVolume * (1 - progress); }
								if (this._sound2) { this._sound2.volume = this.toSoundVolume * progress; }
							}
							else {
								progress *= 2;
								if (this._sound1) { this._sound1.volume = Math.max(this.fromSoundVolume * (1 - progress), 0); }
								if (this._sound2) { this._sound2.volume = Math.max(this.toSoundVolume * (progress - 1), 0); }
							}
						}
					}
				}

				// export the sound mixer
				module.exports = SoundMixer;

				/***/
			}),

/***/ 6954:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Shaku Main.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\shaku.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const isBrowser = typeof window !== 'undefined';
				const IManager = __webpack_require__(9563);
				const logger = __webpack_require__(5259);
				const sfx = isBrowser ? __webpack_require__(6871) : null;
				const gfx = isBrowser ? __webpack_require__(7565) : null;
				const input = isBrowser ? __webpack_require__(8734) : null;
				const assets = __webpack_require__(7817);
				const collision = __webpack_require__(6740);
				const utils = __webpack_require__(3624);
				const GameTime = __webpack_require__(4742);
				const _logger = logger.getLogger('shaku');

				// is shaku in silent mode
				var _isSilent = false;

				// manager state and gametime
				let _usedManagers = null;
				let _prevUpdateTime = null;

				// current game time
				let _gameTime = null;

				// to measure fps
				let _currFpsCounter = 0;
				let _countSecond = 0;
				let _currFps = 0;

				// to measure time it takes for frames to finish
				let _startFrameTime = 0;
				let _frameTimeMeasuresCount = 0;
				let _totalFrameTimes = 0;

				// are managers currently in 'started' mode?
				let _managersStarted = false;

				// were we previously paused?
				let _wasPaused = false;

				// current version
				const version = "2.2.5";


				/**
				 * Shaku's main object.
				 * This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.
				*/
				class Shaku {
					/**
					 * Create the Shaku main object.
					 */
					constructor() {
						/**
						 * Different utilities and framework objects, like vectors, rectangles, colors, etc.
						 * @name Shaku#utils
						 * @type {Utils}
						 */
						this.utils = utils;

						/**
						 * Sound effects and music manager.
						 * @name Shaku#sfx
						 * @type {Sfx}
						 */
						this.sfx = sfx;

						/**
						 * Graphics manager.
						 * @name Shaku#gfx
						 * @type {Gfx}
						 */
						this.gfx = gfx;

						/**
						 * Input manager.
						 * @name Shaku#input
						 * @type {Input}
						 */
						this.input = input;

						/**
						 * Assets manager.
						 * @name Shaku#assets
						 * @type {Assets}
						 */
						this.assets = assets;

						/**
						 * Collision detection manager.
						 * @name Shaku#collision
						 * @type {Collision}
						 */
						this.collision = collision;

						/**
						 * If true, will pause the updates and drawing calls when window is not focused.
						 * Will also not update elapsed time.
						 * @name Shaku#pauseWhenNotFocused
						 * @type {Boolean}
						 */
						this.pauseWhenNotFocused = false;

						/**
						 * Set to true to completely pause Shaku (will skip updates, drawing, and time counting).
						 * @name Shaku#pause
						 * @type {Boolean}
						 */
						this.pause = false;

						/**
						 * Set to true to pause just the game time.
						 * This will not pause real-life time. If you need real-life time stop please use the Python package.
						 * @name Shaku#pauseGameTime
						 * @type {Boolean}
						 */
						this.pauseGameTime = false;
					}

					/**
					 * Method to select managers to use + initialize them.
					 * @param {Array<IManager>=} managers Array with list of managers to use or null to use all.
					 * @returns {Promise} promise to resolve when finish initialization.
					 */
					async init(managers) {
						return new Promise(async (resolve, reject) => {

							// welcome message
							if (!_isSilent) {
								console.log(`%c\u{1F9D9} Shaku ${version}\n%c Game dev lib by Ronen Ness`, "color:orange; font-size: 18pt", "color:grey; font-size: 8pt");
							}

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
							_logger.info(`Shaku ${version} was initialized successfully!`);
							_logger.info(`------------------------------------------------`);
							resolve();
						});
					}

					/**
					 * Destroy all managers
					 */
					destroy() {
						// sanity
						if (!_usedManagers) {
							throw new Error("Not initialized!");
						}

						// destroy all managers
						for (let i = 0; i < _usedManagers.length; ++i) {
							_usedManagers[i].destroy();
						}
					}

					/**
					 * Get if the Shaku is currently paused, either because the 'paused' property is set, or because the document is not focused.
					 * @returns {Boolean} True if currently paused for any reason.
					 */
					isCurrentlyPaused() {
						return this.pause || (this.pauseWhenNotFocused && !document.hasFocus());
					}

					/**
					 * Start frame (update all managers).
					 */
					startFrame() {
						// if paused, skip
						if (this.isCurrentlyPaused()) {
							if (this.input) {
								this.input.startFrame();
							}
							GameTime.updateRawData();
							_gameTime = new GameTime();
							_wasPaused = true;
							return;
						}

						// returning from pause
						if (_wasPaused) {
							_wasPaused = false;
							GameTime.resetDelta();
						}

						// reset delta if paused
						if (this.pauseGameTime) {
							GameTime.resetDelta();
						}
						// update game time
						else {
							GameTime.update();
						}

						// get frame start time
						_startFrameTime = GameTime.rawTimestamp();

						// create new gameTime object to freeze values
						_gameTime = new GameTime();

						// update animators
						utils.Animator.updatePlayingAnimations(_gameTime.delta);

						// update managers
						for (let i = 0; i < _usedManagers.length; ++i) {
							_usedManagers[i].startFrame();
						}
						_managersStarted = true;
					}

					/**
					 * End frame (update all managers).
					 */
					endFrame() {
						// update managers
						if (_managersStarted) {
							for (let i = 0; i < _usedManagers.length; ++i) {
								_usedManagers[i].endFrame();
							}
							_managersStarted = false;
						}

						// if paused, skip
						if (this.isCurrentlyPaused()) {
							if (this.input) {
								this.input.endFrame();
							}
							return;
						}

						// store previous gameTime object
						_prevUpdateTime = _gameTime;

						// count fps and time stats
						if (_gameTime) {
							this.#_updateFpsAndTimeStats();
						}
					}

					/**
					 * Measure FPS and averege update times.
					 * @private
					 */
					#_updateFpsAndTimeStats() {
						// update fps count and second counter
						_currFpsCounter++;
						_countSecond += _gameTime.delta;

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
						GameTime.updateRawData();
						let _endFrameTime = GameTime.rawTimestamp();
						_frameTimeMeasuresCount++;
						_totalFrameTimes += (_endFrameTime - _startFrameTime);
					}

					/**
					 * Make Shaku run in silent mode, without logs.
					 * You can call this before init.
					 */
					silent() {
						_isSilent = true;
						logger.silent();
					}

					/**
					 * Set logger to throw an error every time a log message with severity higher than warning is written.
					 * You can call this before init.
					 * @param {Boolean} enable Set to true to throw error on warnings.
					 */
					throwErrorOnWarnings(enable) {
						if (enable === undefined) { throw Error("Must provide a value!"); }
						logger.throwErrorOnWarnings(enable);
					}

					/**
					 * Get current frame game time.
					 * Only valid between startFrame() and endFrame().
					 * @returns {GameTime} Current frame's gametime.
					 */
					get gameTime() {
						return _gameTime;
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
					getFpsCount() {
						return _currFps;
					}

					/**
					 * Get how long on average it takes to complete a game frame.
					 * @returns {Number} Average time, in milliseconds, it takes to complete a game frame.
					 */
					getAverageFrameTime() {
						if (_frameTimeMeasuresCount === 0) { return 0; }
						return _totalFrameTimes / _frameTimeMeasuresCount;
					}

					/**
					 * Request animation frame with fallbacks.
					 * @param {Function} callback Method to invoke in next animation frame.
					 * @returns {Number} Handle for cancellation.
					 */
					requestAnimationFrame(callback) {
						if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
						else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
						else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
						else if (window.msRequestAnimationFrame) return window.msRequestAnimationFrame(callback);
						else return setTimeout(callback, 1000 / 60);
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
					setLogger(loggerHandler) {
						logger.setDrivers(loggerHandler);
					}

					/**
					 * Get / create a custom logger.
					 * @returns {Logger} Logger instance.
					 */
					getLogger(name) {
						return logger.getLogger(name);
					}
				};


				// return the main Shaku object.
				module.exports = new Shaku();

				/***/
			}),

/***/ 4882:
/***/ ((module) => {

				/**
				 * Implement an animator helper class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\animator.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const _autoAnimators = [];


				/**
				 * Implement an animator object that change values over time using Linear Interpolation.
				 * Usage example:
				 * (new Animator(sprite)).from({'position.x': 0}).to({'position.x': 100}).duration(1).play();
				 */
				class Animator {
					/**
					 * Create the animator.
					 * @param {*} target Any object you want to animate.
					 */
					constructor(target) {
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
					update(delta) {
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
								this._onFinish(this._target, this);
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
								this._fromValues[key] = fromValue = this.#_getValueFromTarget(keyParts);
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
							this.#_setValueToTarget(keyParts, newValue);
						}

						// if repeating, reset progress
						if (this._repeats && this._progress >= 1) {
							if (typeof this._repeats === 'number') { this._repeats--; }
							this._progress = 0;
							if (this._repeatsWithReverseAnimation) {
								this.flipFromAndTo();
							}
						}
					}

					/**
					 * Get value from target object.
					 * @private
					 * @param {Array<String>} keyParts Key parts broken by dots.
					 */
					#_getValueFromTarget(keyParts) {
						// easy case - get value when key parts is just one component
						if (keyParts.length === 1) {
							return this._target[keyParts[0]];
						}

						// get value for path with parts
						function index(obj, i) { return obj[i]; }
						return keyParts.reduce(index, this._target);
					}

					/**
					 * Set value in target object.
					 * @private
					 * @param {Array<String>} keyParts Key parts broken by dots.
					 */
					#_setValueToTarget(keyParts, value) {
						// easy case - set value when key parts is just one component
						if (keyParts.length === 1) {
							this._target[keyParts[0]] = value;
							return;
						}

						// set value for path with parts
						function index(obj, i) { return obj[i]; }
						let parent = keyParts.slice(0, keyParts.length - 1).reduce(index, this._target);
						parent[keyParts[keyParts.length - 1]] = value;
					}

					/**
					 * Make sure a given value is legal for the animator.
					 * @private
					 */
					#_validateValueType(value) {
						return (typeof value === 'number') || (typeof value === 'function') || (value && value.constructor && value.constructor.lerp);
					}

					/**
					 * Set a method to run when animation ends.
					 * @param {Function} callback Callback to invoke when done.
					 * @returns {Animator} this.
					 */
					then(callback) {
						this._onFinish = callback;
						return this;
					}

					/**
					 * Set smooth damp.
					 * If true, lerping will go slower as the animation reach its ending.
					 * @param {Boolean} enable set smooth damp mode.
					 * @returns {Animator} this.
					 */
					smoothDamp(enable) {
						this._smoothDamp = enable;
						return this;
					}

					/**
					 * Set if the animator should repeat itself.
					 * @param {Boolean|Number} enable false to disable repeating, true for endless repeats, or a number for limited number of repeats.
					 * @param {Boolean} reverseAnimation if true, it will reverse animation to repeat it instead of just "jumping" back to starting state.
					 * @returns {Animator} this.
					 */
					repeats(enable, reverseAnimation) {
						this._originalRepeats = this._repeats = enable;
						this._repeatsWithReverseAnimation = Boolean(reverseAnimation);
						return this;
					}

					/**
					 * If true, will reverse animation back to start values after done.
					 * This is equivalent to calling `repeats(1, true)`.
					 * @returns {Animator} this.
					 */
					reverseBackToStart() {
						return this.repeats(1, true);
					}

					/**
					 * Set 'from' values.
					 * You don't have to provide 'from' values, when a value is not set the animator will just take whatever was set in target when first update is called.
					 * @param {*} values Values to set as 'from' values.
					 * Key = property name in target (can contain dots for nested), value = value to start animation from.
					 * @returns {Animator} this.
					 */
					from(values) {
						for (let key in values) {
							if (!this.#_validateValueType(values[key])) {
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
					to(values) {
						for (let key in values) {
							if (!this.#_validateValueType(values[key])) {
								throw new Error("Illegal value type to use with Animator! All values must be either numbers, methods, or a class instance that has a static lerp() method.");
							}
							this._toValues[key] = { keyParts: key.split('.'), value: values[key] };
						}
						this._originalTo = null;
						return this;
					}

					/**
					 * Flip between the 'from' and the 'to' states.
					 */
					flipFromAndTo() {
						let newFrom = {};
						let newTo = {};

						if (!this._originalFrom) { this._originalFrom = this._fromValues; }
						if (!this._originalTo) { this._originalTo = this._toValues; }

						for (let key in this._toValues) {
							newFrom[key] = this._toValues[key].value;
							newTo[key] = { keyParts: key.split('.'), value: this._fromValues[key] };
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
					duration(seconds) {
						this.speedFactor = 1 / seconds;
						return this;
					}

					/**
					 * Reset animator progress.
					 * @returns {Animator} this.
					 */
					reset() {
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
					play() {
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
					get ended() {
						return this._progress >= 1;
					}

					/**
					 * Update all auto animators.
					 * @private
					 * @param {Number} delta Delta time in seconds.
					 */
					static updatePlayingAnimations(delta) {
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
					return (1 - amt) * start + amt * end;
				}


				// export the animator class.
				module.exports = Animator;

				/***/
			}),

/***/ 5891:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * A 3d box shape.
				 * Based on code from THREE.js.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\box.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vector3 = __webpack_require__(8329);


				/**
				 * A 3D box shape.
				 */
				class Box {
					/**
					 * Create the 3d box.
					 * @param {Vector3} min Box min vector.
					 * @param {Vector3} max Box max vector.
					 */
					constructor(min = new Vector3(+ Infinity, + Infinity, + Infinity), max = new Vector3(- Infinity, - Infinity, - Infinity)) {
						this.min = min;
						this.max = max;
					}

					/**
					 * Set the box min and max corners.
					 * @param {Vector3} min Box min vector.
					 * @param {Vector3} max Box max vector.
					 * @returns {Box} Self.
					 */
					set(min, max) {
						this.min.copy(min);
						this.max.copy(max);
						return this;
					}

					/**
					 * Set box values from array.
					 * @param {Array<Number>} array Array of values to load from.
					 * @returns {Box} Self.
					 */
					setFromArray(array) {
						this.makeEmpty();
						for (let i = 0, il = array.length; i < il; i += 3) {
							this.expandByPoint(_vector.fromArray(array, i));
						}
						return this;
					}

					/**
					 * Set box from array of points.
					 * @param {Array<Vector3>} points Points to set box from.
					 * @returns {Box} Self.
					 */
					setFromPoints(points) {
						this.makeEmpty();
						for (let i = 0, il = points.length; i < il; i++) {
							this.expandByPoint(points[i]);
						}
						return this;
					}

					/**
					 * Set box from center and size.
					 * @param {Vector3} center Center position.
					 * @param {Vector3} size Box size.
					 * @returns {Box} Self.
					 */
					setFromCenterAndSize(center, size) {
						const halfSize = size.mul(0.5);
						this.min.copy(center.sub(halfSize));
						this.max.copy(center.add(halfSize));
						return this;
					}

					/**
					 * Clone this box.
					 * @returns {Box} Cloned box.
					 */
					clone() {
						return new this.constructor().copy(this);
					}

					/**
					 * Copy values from another box.
					 * @param {Box} box Box to copy.
					 * @returns {Box} Self.
					 */
					copy(box) {
						this.min.copy(box.min);
						this.max.copy(box.max);
						return this;
					}

					/**
					 * Turn this box into empty state.
					 * @returns {Box} Self.
					 */
					makeEmpty() {
						this.min.x = this.min.y = this.min.z = + Infinity;
						this.max.x = this.max.y = this.max.z = - Infinity;
						return this;
					}

					/**
					 * Check if this box is empty.
					 * @returns {Boolean} True if empty.
					 */
					isEmpty() {
						// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
						return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);

					}

					/**
					 * Get center position.
					 * @returns {Vector3} Center position.
					 */
					getCenter() {
						return this.isEmpty() ? Vector3.zero() : this.min.add(this.max).mulSelf(0.5);
					}

					/**
					 * Get box size.
					 * @returns {Vector3} Box size.
					 */
					getSize(target) {

						return this.isEmpty() ? Vector3.zero() : this.max.sub(this.min);

					}

					/**
					 * Expand this box by a point.
					 * This will adjust the box boundaries to contain the point.
					 * @param {Vector3} point Point to extend box by.
					 * @returns {Box} Self.
					 */
					expandByPoint(point) {
						this.min.minSelf(point);
						this.max.maxSelf(point);
						return this;
					}

					/**
					 * Expand this box by pushing its boundaries by a vector.
					 * This will adjust the box boundaries by pushing them away from the center by the value of the given vector.
					 * @param {Vector3} vector Vector to expand by.
					 * @returns {Box} Self.
					 */
					expandByVector(vector) {
						this.min.subSelf(vector);
						this.max.addSelf(vector);
						return this;
					}

					/**
					 * Expand this box by pushing its boundaries by a given scalar.
					 * This will adjust the box boundaries by pushing them away from the center by the value of the given scalar.
					 * @param {Number} scalar Value to expand by.
					 * @returns {Box} Self.
					 */
					expandByScalar(scalar) {
						this.min.subSelf(scalar);
						this.max.addSelf(scalar);
						return this;
					}

					/**
					 * Check if this box contains a point.
					 * @param {Vector3} point Point to check.
					 * @returns {Boolean} True if box containing the point.
					 */
					containsPoint(point) {
						return point.x < this.min.x || point.x > this.max.x ||
							point.y < this.min.y || point.y > this.max.y ||
							point.z < this.min.z || point.z > this.max.z ? false : true;
					}

					/**
					 * Check if this box contains another box.
					 * @param {Box} box Box to check.
					 * @returns {Boolean} True if box containing the box.
					 */
					containsBox(box) {
						return this.min.x <= box.min.x && box.max.x <= this.max.x &&
							this.min.y <= box.min.y && box.max.y <= this.max.y &&
							this.min.z <= box.min.z && box.max.z <= this.max.z;
					}

					/**
					 * Check if this box collides with another box.
					 * @param {Box} box Box to test collidion with.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collideBox(box) {
						// using 6 splitting planes to rule out intersections.
						return box.max.x < this.min.x || box.min.x > this.max.x ||
							box.max.y < this.min.y || box.min.y > this.max.y ||
							box.max.z < this.min.z || box.min.z > this.max.z ? false : true;
					}

					/**
					 * Check if this box collides with a sphere.
					 * @param {Sphere} sphere Sphere to test collidion with.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collideSphere(sphere) {
						// find the point on the AABB closest to the sphere center.
						const clamped = this.clampPoint(sphere.center);

						// if that point is inside the sphere, the AABB and sphere intersect.
						return clamped.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);

					}

					/**
					 * Check if this box collides with a plane.
					 * @param {Plane} plane Plane to test collidion with.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collidePlane(plane) {
						// We compute the minimum and maximum dot product values. If those values
						// are on the same side (back or front) of the plane, then there is no intersection.

						let min, max;

						if (plane.normal.x > 0) {

							min = plane.normal.x * this.min.x;
							max = plane.normal.x * this.max.x;

						} else {

							min = plane.normal.x * this.max.x;
							max = plane.normal.x * this.min.x;

						}

						if (plane.normal.y > 0) {

							min += plane.normal.y * this.min.y;
							max += plane.normal.y * this.max.y;

						} else {

							min += plane.normal.y * this.max.y;
							max += plane.normal.y * this.min.y;

						}

						if (plane.normal.z > 0) {

							min += plane.normal.z * this.min.z;
							max += plane.normal.z * this.max.z;

						} else {

							min += plane.normal.z * this.max.z;
							max += plane.normal.z * this.min.z;

						}

						return (min <= - plane.constant && max >= - plane.constant);
					}

					/**
					 * Clamp a given vector inside this box.
					 * @param {Vector3} point Vector to clamp.
					 * @returns {Vector3} Vector clammped.
					 */
					clampPoint(point) {
						return point.clampSelf(this.min, this.max);
					}

					/**
					 * Get distance between this box and a given point.
					 * @param {Vector3} point Point to get distance to.
					 * @returns {Number} Distance to point.
					 */
					distanceToPoint(point) {
						return point.clamp(this.min, this.max).distanceTo(point);
					}

					/**
					 * Computes the intersection of this box with another box.
					 * This will set the upper bound of this box to the lesser of the two boxes' upper bounds and the lower bound of this box to the greater of the two boxes' lower bounds.
					 * If there's no overlap, makes this box empty.
					 * @param {Box} box Box to intersect with.
					 * @returns {Box} Self.
					 */
					intersectWith(box) {

						this.min.max(box.min);
						this.max.min(box.max);

						// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
						if (this.isEmpty()) this.makeEmpty();

						return this;
					}

					/**
					 * Computes the union of this box and box.
					 * This will set the upper bound of this box to the greater of the two boxes' upper bounds and the lower bound of this box to the lesser of the two boxes' lower bounds.
					 * @param {Box} box Box to union with.
					 * @returns {Box} Self.
					 */
					unionWith(box) {
						this.min.min(box.min);
						this.max.max(box.max);
						return this;
					}


					/**
					 * Move this box.
					 * @param {Vector3} offset Offset to move box by.
					 * @returns {Box} Self.
					 */
					translate(offset) {
						this.min.add(offset);
						this.max.add(offset);
						return this;
					}

					/**
					 * Check if equal to another box.
					 * @param {Box} other Other box to compare to.
					 * @returns {Boolean} True if boxes are equal, false otherwise.
					 */
					equals(box) {
						return box.min.equals(this.min) && box.max.equals(this.max);
					}
				}

				const _vector = /*@__PURE__*/ new Vector3();


				// export the box object
				module.exports = Box;

				/***/
			}),

/***/ 9668:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a simple 2d circle.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\circle.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const MathHelper = __webpack_require__(9646);
				const Vector2 = __webpack_require__(2544);


				/**
				 * Implement a simple 2d Circle.
				 */
				class Circle {
					/**
					 * Create the Circle.
					 * @param {Vector2} center Circle center position.
					 * @param {Number} radius Circle radius.
					 */
					constructor(center, radius) {
						this.center = center.clone();
						this.radius = radius;
					}

					/**
					 * Return a clone of this circle.
					 * @returns {Circle} Cloned circle.
					 */
					clone() {
						return new Circle(this.center, this.radius);
					}

					/**
					 * Check if this circle contains a Vector2.
					 * @param {Vector2} p Point to check.
					 * @returns {Boolean} if point is contained within the circle.
					 */
					containsVector(p) {
						return this.center.distanceTo(p) <= this.radius;
					}

					/**
					 * Check if equal to another circle.
					 * @param {Circle} other Other circle to compare to.
					 * @returns {Boolean} True if circles are equal, false otherwise.
					 */
					equals(other) {
						return (other === this) ||
							(other && (other.constructor === this.constructor) &&
								this.center.equals(other.center) && (this.radius == other.radius));
					}

					/**
					 * Create circle from a dictionary.
					 * @param {*} data Dictionary with {center, radius}.
					 * @returns {Circle} Newly created circle.
					 */
					static fromDict(data) {
						return new Circle(Vector2.fromDict(data.center || {}), data.radius || 0);
					}

					/**
					 * Convert to dictionary.
					 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
					 * @returns {*} Dictionary with {center, radius}.
					 */
					toDict(minimized) {
						if (minimized) {
							const ret = {};
							if (this.radius) { ret.radius = this.radius; }
							if (this.center.x || this.center.y) { ret.center = this.center.toDict(true); }
							return ret;
						}
						return { center: this.center.toDict(), radius: this.radius };
					}

					/**
					 * Lerp between two circle.
					 * @param {Circle} p1 First circle.
					 * @param {Circle} p2 Second circle.
					 * @param {Number} a Lerp factor (0.0 - 1.0).
					 * @returns {Circle} result circle.
					 */
					static lerp(p1, p2, a) {
						let lerpScalar = MathHelper.lerp;
						return new Circle(Vector2.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
					}
				}


				// export the circle class
				module.exports = Circle;

				/***/
			}),

/***/ 9327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Define a color object.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\color.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				const MathHelper = __webpack_require__(9646);


				/**
				 * Implement a color.
				 * All color components are expected to be in 0.0 - 1.0 range (and not 0-255).
				 */
				class Color {
					/**
					 * Create the color.
					 * @param {Number} r Color red component (value range: 0-1).
					 * @param {Number} g Color green component (value range: 0-1).
					 * @param {Number} b Color blue component (value range: 0-1).
					 * @param {Number=} a Color alpha component (value range: 0-1).
					 */
					constructor(r, g, b, a) {
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
					set(r, g, b, a) {
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
					setByte(r, g, b, a) {
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
					copy(other) {
						this.set(other.r, other.g, other.b, other.a);
						return this;
					}

					/**
					 * Get r component.
					 * @returns {Number} Red component.
					 */
					get r() {
						return this._r;
					}

					/**
					 * Get g component.
					 * @returns {Number} Green component.
					 */
					get g() {
						return this._g;
					}

					/**
					 * Get b component.
					 * @returns {Number} Blue component.
					 */
					get b() {
						return this._b;
					}

					/**
					 * Get a component.
					 * @returns {Number} Alpha component.
					 */
					get a() {
						return this._a;
					}

					/**
					 * Set r component.
					 * @returns {Number} Red component after change.
					 */
					set r(val) {
						this._r = val;
						this._asHex = null;
						return this._r;
					}

					/**
					 * Set g component.
					 * @returns {Number} Green component after change.
					 */
					set g(val) {
						this._g = val;
						this._asHex = null;
						return this._g;
					}

					/**
					 * Set b component.
					 * @returns {Number} Blue component after change.
					 */
					set b(val) {
						this._b = val;
						this._asHex = null;
						return this._b;
					}

					/**
					 * Set a component.
					 * @returns {Number} Alpha component after change.
					 */
					set a(val) {
						this._a = val;
						this._asHex = null;
						return this._a;
					}

					/**
					 * Convert a single component to hex value.
					 * @param {Number} c Value to convert to hex.
					 * @returns {String} Component as hex value.
					 */
					static componentToHex(c) {
						var hex = Math.round(c).toString(16);
						return hex.length == 1 ? "0" + hex : hex;
					}

					/**
					 * Convert this color to hex string (starting with '#').
					 * @returns {String} Color as hex.
					 */
					get asHex() {
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
					static fromHex(val) {
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
					static fromDecimal(val, includeAlpha) {
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
					static fromDict(data) {
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
					toDict(minimized) {
						if (minimized) {
							const ret = {};
							if (this.r !== 1) { ret.r = this.r; }
							if (this.g !== 1) { ret.g = this.g; }
							if (this.b !== 1) { ret.b = this.b; }
							if (this.a !== 1) { ret.a = this.a; }
							return ret;
						}
						return { r: this.r, g: this.g, b: this.b, a: this.a };
					}

					/**
					 * Convert this color to decimal number.
					 * @returns {Number} Color as decimal RGBA.
					 */
					get asDecimalRGBA() {
						return ((Math.round(this.r * 255) << (8 * 3)) | (Math.round(this.g * 255) << (8 * 2)) | (Math.round(this.b * 255) << (8 * 1)) | (Math.round(this.a * 255))) >>> 0;
					}

					/**
					 * Convert this color to decimal number.
					 * @returns {Number} Color as decimal ARGB.
					 */
					get asDecimalABGR() {
						return ((Math.round(this.a * 255) << (8 * 3)) | (Math.round(this.b * 255) << (8 * 2)) | (Math.round(this.g * 255) << (8 * 1)) | (Math.round(this.r * 255))) >>> 0;
					}

					/**
					 * Convert this color to a float array.
					 */
					get floatArray() {
						return [this.r, this.g, this.b, this.a];
					}

					/**
					 * Return a clone of this color.
					 * @returns {Number} Cloned color.
					 */
					clone() {
						return new Color(this.r, this.g, this.b, this.a);
					}

					/**
					 * Convert to string.
					 */
					string() {
						return this.r + ',' + this.g + ',' + this.b + ',' + this.a;
					}

					/**
					 * Get if this color is pure black (ignoring alpha).
					 */
					get isBlack() {
						return this.r == 0 && this.g == 0 && this.b == 0;
					}

					/**
					 * Return a random color.
					 * @param {Boolean} includeAlpha If true, will also randomize alpha.
					 * @returns {Color} Randomized color.
					 */
					static random(includeAlpha) {
						return new Color(Math.random(), Math.random(), Math.random(), includeAlpha ? Math.random() : 1);
					}

					/**
					 * Build and return new color from bytes array.
					 * @param {Array<Number>} bytes Bytes array to build color from.
					 * @param {Number=} offset Optional offset to read bytes from.
					 * @returns {Color} Newly created color.
					 */
					static fromBytesArray(bytes, offset) {
						offset = offset || 0;
						return new Color(bytes[offset] / 255, bytes[offset + 1] / 255, bytes[offset + 2] / 255, (bytes[offset + 3] !== undefined) ? (bytes[offset + 3] / 255) : 1);
					}

					/**
					 * Get if this color is transparent black.
					 */
					get isTransparentBlack() {
						return this._r == this._g && this._g == this._b && this._b == this._a && this._a == 0;
					}

					/**
					 * Get array with all built-in web color names.
					 * @returns {Array<String>} Array with color names.
					 */
					static get webColorNames() {
						return colorKeys;
					}

					/**
					 * Check if equal to another color.
					 * @param {Color} other Other color to compare to.
					 */
					equals(other) {
						return (this === other) ||
							(other && (other.constructor === this.constructor) &&
								(this._r == other._r) && (this._g == other._g) && (this._b == other._b) && (this._a == other._a));
					}

					/**
					 * Lerp between two colors.
					 * @param {Color} p1 First color.
					 * @param {Color} p2 Second color.
					 * @param {Number} a Lerp factor (0.0 - 1.0).
					 * @returns {Color} result color.
					 */
					static lerp(p1, p2, a) {
						let lerpScalar = MathHelper.lerp;
						return new Color(lerpScalar(p1.r, p2.r, a),
							lerpScalar(p1.g, p2.g, a),
							lerpScalar(p1.b, p2.b, a),
							lerpScalar(p1.a, p2.a, a)
						);
					}
				}

				// table to convert common color names to hex
				const colorNameToHex = {
					"aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
					"beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
					"cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
					"darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
					"darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
					"darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
					"firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
					"gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
					"honeydew": "#f0fff0", "hotpink": "#ff69b4",
					"indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
					"lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
					"lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
					"lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
					"magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
					"mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
					"navajowhite": "#ffdead", "navy": "#000080",
					"oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
					"palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
					"rebeccapurple": "#663399", "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
					"saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
					"tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
					"violet": "#ee82ee",
					"wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
					"yellow": "#ffff00", "yellowgreen": "#9acd32"
				};

				// create getter function for all named color
				for (var key in colorNameToHex) {
					if (colorNameToHex.hasOwnProperty(key)) {
						var colorValue = hexToColor(colorNameToHex[key]);
						(function(_colValue) {

							Object.defineProperty(Color, key, {
								get: function() {
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
				Object.defineProperty(Color, 'transparent', {
					get: function() {
						return new Color(0, 0, 0, 0);
					}
				});

				// add transparent white getter
				Object.defineProperty(Color, 'transwhite', {
					get: function() {
						return new Color(1, 1, 1, 0);
					}
				});


				/**
				 * Convert Hex value to Color instance.
				 * @param {String} hex Hex value to parse.
				 */
				function hexToColor(hex) {
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

				/***/
			}),

/***/ 4353:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * A 3d frustum shape.
				 * Based on code from THREE.js.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\frustum.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Plane = __webpack_require__(5597);
				const Matrix = __webpack_require__(5529);
				const Vector3 = __webpack_require__(8329);
				const Box = __webpack_require__(5891);


				/**
				 * Implement a 3D Frustum shape.
				 */
				class Frustum {
					/**
					 * Create the frustum.
					 * @param {Plane} p0 Frustum plane.
					 * @param {Plane} p1 Frustum plane.
					 * @param {Plane} p2 Frustum plane.
					 * @param {Plane} p3 Frustum plane.
					 * @param {Plane} p4 Frustum plane.
					 * @param {Plane} p5 Frustum plane.
					 */
					constructor(p0 = new Plane(), p1 = new Plane(), p2 = new Plane(), p3 = new Plane(), p4 = new Plane(), p5 = new Plane()) {
						this.planes = [p0, p1, p2, p3, p4, p5];
					}

					/**
					 * Set the Frustum values.
					 * @param {Plane} p0 Frustum plane.
					 * @param {Plane} p1 Frustum plane.
					 * @param {Plane} p2 Frustum plane.
					 * @param {Plane} p3 Frustum plane.
					 * @param {Plane} p4 Frustum plane.
					 * @param {Plane} p5 Frustum plane.
					 * @returns {Frustum} Self.
					 */
					set(p0, p1, p2, p3, p4, p5) {
						const planes = this.planes;
						planes[0].copy(p0);
						planes[1].copy(p1);
						planes[2].copy(p2);
						planes[3].copy(p3);
						planes[4].copy(p4);
						planes[5].copy(p5);
						return this;
					}

					/**
					 * Copy values from another frustum.
					 * @param {Frustum} frustum Frustum to copy.
					 * @returns {Frustum} Self.
					 */
					copy(frustum) {
						const planes = this.planes;
						for (let i = 0; i < 6; i++) {
							planes[i].copy(frustum.planes[i]);
						}
						return this;
					}

					/**
					 * Set frustum from projection matrix.
					 * @param {Matrix} m Matrix to build frustum from.
					 * @returns {Frustum} Self.
					 */
					setFromProjectionMatrix(m) {
						const planes = this.planes;
						const me = m.values;
						const me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
						const me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
						const me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
						const me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

						planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12).normalizeSelf();
						planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12).normalizeSelf();
						planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13).normalizeSelf();
						planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13).normalizeSelf();
						planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14).normalizeSelf();
						planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14).normalizeSelf();

						return this;
					}

					/**
					 * Check if the frustum collides with a sphere.
					 * @param {Sphere} sphere Sphere to check.
					 * @returns {Boolean} True if point is in frustum, false otherwise.
					 */
					collideSphere(sphere) {
						const planes = this.planes;
						const center = sphere.center;
						const negRadius = - sphere.radius;
						for (let i = 0; i < 6; i++) {
							const distance = planes[i].distanceToPoint(center);
							if (distance < negRadius) {
								return false;
							}
						}
						return true;
					}

					/**
					 * Check if collide with a box.
					 * @param {Box} box Box to check.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collideBox(box) {
						const planes = this.planes;
						for (let i = 0; i < 6; i++) {
							const plane = planes[i];

							// corner at max distance
							_vector.x = plane.normal.x > 0 ? box.max.x : box.min.x;
							_vector.y = plane.normal.y > 0 ? box.max.y : box.min.y;
							_vector.z = plane.normal.z > 0 ? box.max.z : box.min.z;

							if (plane.distanceToPoint(_vector) < 0) {
								return false;
							}
						}
						return true;
					}

					/**
					 * Check if the frustum contains a point.
					 * @param {Vector3} point Vector to check.
					 * @returns {Boolean} True if point is in frustum, false otherwise.
					 */
					containsPoint(point) {
						const planes = this.planes;
						for (let i = 0; i < 6; i++) {
							if (planes[i].distanceToPoint(point) < 0) {
								return false;
							}
						}
						return true;
					}

					/**
					 * Clone this frustum.
					 * @returns {Frustum} Cloned frustum.
					 */
					clone() {
						return new this.constructor().copy(this);
					}
				}

				const _vector = /*@__PURE__*/ new Vector3();

				// export the frustum class
				module.exports = Frustum;

				/***/
			}),

/***/ 4742:
/***/ ((module) => {

				/**
				 * A utility to provide gametime and delta between frames.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\game_time.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */



				/**
				 * Class to hold current game time, both elapse and delta from last frame.
				 */
				class GameTime {
					/**
					 * create the gametime object with current time.
					 */
					constructor() {
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

						/**
						 * Raw timestamp in milliseconds.
						 * This value updates only as long as you run Shaku frames, and continue to update even if game is paused.
						 */
						this.rawTimestamp = _rawTimestampMs;

						// freeze object
						Object.freeze(this);
					}

					/**
					 * Update raw time-related data.
					 * Called automatically from 'update'.
					 * @private
					 */
					static updateRawData() {
						_rawTimestampMs = getAccurateTimestampMs();
					}

					/**
					 * Update game time.
					 * @private
					 */
					static update() {
						// update raw data
						GameTime.updateRawData();

						// calculate delta time
						let delta = 0;
						if (_prevTime) {
							delta = _rawTimestampMs - _prevTime;
						}

						// update previous time
						_prevTime = _rawTimestampMs;

						// update delta and elapsed
						_currDelta = delta;
						_currElapsed += delta;
					}

					/**
					 * Get raw timestamp in milliseconds.
					 * This value updates only as long as you run Shaku frames, and continue to update even if game is paused.
					 * @returns {Number} raw timestamp in milliseconds.
					 */
					static rawTimestamp() {
						return _rawTimestampMs;
					}

					/**
					 * Reset elapsed and delta time.
					 */
					static reset() {
						_prevTime = null;
						_currDelta = 0;
						_currElapsed = 0;
					}

					/**
					 * Reset current frame's delta time.
					 */
					static resetDelta() {
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
				var _rawTimestampMs = getAccurateTimestampMs();

				// export the GameTime class.
				module.exports = GameTime;

				/***/
			}),

/***/ 3624:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Include all util classes.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\index.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				/**
				 * Shaku Utils module.
				 * Contains general stuff, utilities and core objects that Shaku uses.
				 */
				const Utils = {
					Vector2: __webpack_require__(2544),
					Vector3: __webpack_require__(8329),
					Rectangle: __webpack_require__(4731),
					Circle: __webpack_require__(9668),
					Line: __webpack_require__(1708),
					Color: __webpack_require__(9327),
					Animator: __webpack_require__(4882),
					GameTime: __webpack_require__(4742),
					MathHelper: __webpack_require__(9646),
					SeededRandom: __webpack_require__(7212),
					Perlin: __webpack_require__(4476),
					Storage: __webpack_require__(7274),
					StorageAdapter: __webpack_require__(6553),
					PathFinder: __webpack_require__(2791),
					Transformation: __webpack_require__(1910),
					TransformationModes: __webpack_require__(6347),
					ItemsSorter: __webpack_require__(321),
					Frustum: __webpack_require__(4353),
					Plane: __webpack_require__(5597),
					Sphere: __webpack_require__(7517),
					Matrix: __webpack_require__(5529),
					Box: __webpack_require__(5891),
					Ray: __webpack_require__(4493)
				};

				// add a 'isXXX' property to all util objects, for faster alternative to 'instanceof' checks.
				// for example this will generate a 'isVector3' that will be true for all Vector3 instances.
				for (let key in Utils) {
					if (Utils[key].prototype) {
						Utils[key].prototype['is' + key] = true;
					}
				}

				// export the Utils module.
				module.exports = Utils;

				/***/
			}),

/***/ 321:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implements an algorithm to sort as many rectangles as possible in the smallest possible region.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\items_sorter.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Rectangle = __webpack_require__(4731);
				const Vector2 = __webpack_require__(2544);


				/**
				 * Utility class to arrange rectangles in minimal region.
				 */
				class ItemsSorter {
					/**
					 * Efficiently arrange rectangles into a minimal size area.
					 * Based on code from here:
					 * https://github.com/mapbox/potpack
					 * @example
					 * // 'id' will be used to identify the items after the sort.
					 * let boxes = [{x: 100, y: 50, id: 1}, {x: 50, y: 70, id: 2}, {x: 125, y: 85, id: 3}, ... more boxes here ];
					 * let result = RectanglesSorter.arrangeRectangles(boxes);
					 * // show result
					 * console.log(`Output region size is: ${result.width},${result.height}, and it utilizes ${result.utilized} of the area.`);
					 * for (let res of result.rectangles) {
					 *   console.log(`Rectangle ${res.source.id} is at position: ${res.x},${res.y}.`);
					 * }
					 * @param {Array<Rectangle|Vector2|*>} rectangles Array of vectors or rectangles to sort.
					 * If the object have 'width' and 'height' properties, these properties will be used to define the rectangle size.
					 * If not but the object have 'x' and 'y' properties, x and y will be taken instead.
					 * The source object will be included in the result objects.
					 * @param {Function=} processRegionWidthMethod If provided, will run this method when trying to decide on the result region width.
					 * Method receive desired width as argument, and return a new width to override the decision. You can use this method to limit max width or round it to multiplies of 2 for textures.
					 * Note: by default, the algorithm will try to create a square region.
					 * @param {Vector2=} extraMargins Optional extra empty pixels to add between textures in atlas.
					 * @returns {*} Result object with the following keys: {width, height, rectangles, utilized}.
					 *  width = required container width.
					 *  height = required container width.
					 *  rectangles = list of sorted rectangles. every entry has {x, y, width, height, source} where x and y are the offset in container and source is the source input object.
					 *  utilized = how much of the output space was utilized.
					 */
					static arrangeRectangles(rectangles, processRegionWidthMethod, extraMargins) {
						// default margins
						extraMargins = extraMargins || Vector2.zeroReadonly;

						// normalize rectangles / vectors
						let normalizedRects = [];
						for (let rect of rectangles) {
							normalizedRects.push({
								width: ((rect.width !== undefined) ? rect.width : rect.x) + extraMargins.x,
								height: ((rect.height !== undefined) ? rect.height : rect.y) + extraMargins.y,
								source: rect
							});
						}
						rectangles = normalizedRects;

						// calculate result area and maximum rectangle width
						let area = 0;
						let maxRectWidth = 0;
						for (const rect of rectangles) {
							area += rect.width * rect.height;
							maxRectWidth = Math.max(maxRectWidth, rect.width);
						}

						// sort textures by height descending
						rectangles.sort((a, b) => b.height - a.height);

						// aim for a squarish resulting container
						let startWidth = Math.max(Math.ceil(Math.sqrt(area / 0.95)), maxRectWidth);

						// if we got a method to process width, apply it
						if (processRegionWidthMethod) {
							startWidth = processRegionWidthMethod(startWidth);
						}

						// start with a single empty space, unbounded at the bottom
						const spaces = [{ x: 0, y: 0, w: startWidth, h: Infinity }];

						// arrange texture rects
						let width = 0;
						let height = 0;
						for (const rect of rectangles) {
							// look through spaces backwards so that we check smaller spaces first
							for (let i = spaces.length - 1; i >= 0; i--) {

								// get current space
								const space = spaces[i];

								// look for empty spaces that can accommodate the current box
								if (rect.width > space.w || rect.height > space.h) continue;

								// found the space; add the box to its top-left corner
								// |-------|-------|
								// |  box  |       |
								// |_______|       |
								// |         space |
								// |_______________|
								rect.x = space.x;
								rect.y = space.y;

								height = Math.max(height, rect.y + rect.height);
								width = Math.max(width, rect.x + rect.width);

								if (rect.width === space.w && rect.height === space.h) {
									// space matches the box exactly; remove it
									const last = spaces.pop();
									if (i < spaces.length) spaces[i] = last;

								} else if (rect.height === space.h) {
									// space matches the box height; update it accordingly
									// |-------|---------------|
									// |  box  | updated space |
									// |_______|_______________|
									space.x += rect.width;
									space.w -= rect.width;

								} else if (rect.width === space.w) {
									// space matches the box width; update it accordingly
									// |---------------|
									// |      box      |
									// |_______________|
									// | updated space |
									// |_______________|
									space.y += rect.height;
									space.h -= rect.height;

								} else {
									// otherwise the box splits the space into two spaces
									// |-------|-----------|
									// |  box  | new space |
									// |_______|___________|
									// | updated space     |
									// |___________________|
									spaces.push({
										x: space.x + rect.width,
										y: space.y,
										w: space.w - rect.width,
										h: rect.height
									});
									space.y += rect.height;
									space.h -= rect.height;
								}
								break;
							}
						}

						// return result
						return {
							width: width,                               // container width.
							height: height,                             // container height.
							rectangles: rectangles,                     // rectangles and where to place them.
							utilized: (area / (width * height)) || 0    // space utilization.
						};
					}
				}


				// export the main method
				module.exports = ItemsSorter;

				/***/
			}),

/***/ 1708:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a simple 2d line.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\line.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vector2 = __webpack_require__(2544);


				/**
				 * Implement a simple 2d Line.
				 */
				class Line {
					/**
					 * Create the Line.
					 * @param {Vector2} from Line start position.
					 * @param {Vector2} to Line end position.
					 */
					constructor(from, to) {
						this.from = from.clone();
						this.to = to.clone();
					}

					/**
					 * Return a clone of this line.
					 * @returns {Line} Cloned line.
					 */
					clone() {
						return new Line(this.from, this.to);
					}

					/**
					 * Create Line from a dictionary.
					 * @param {*} data Dictionary with {from, to}.
					 * @returns {Line} Newly created line.
					 */
					static fromDict(data) {
						return new Line(Vector2.fromDict(data.from || {}), Vector2.fromDict(data.to || {}));
					}

					/**
					 * Convert to dictionary.
					 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
					 * @returns {*} Dictionary with {from, to}.
					 */
					toDict(minimized) {
						if (minimized) {
							const ret = {};
							if (this.from.x || this.from.y) { ret.from = this.from.toDict(true); }
							if (this.to.x || this.to.y) { ret.to = this.to.toDict(true); }
							return ret;
						}
						return { from: this.from.toDict(), to: this.to.toDict() };
					}

					/**
					 * Check if this circle contains a Vector2.
					 * @param {Vector2} p Point to check.
					 * @param {Number} threshold Distance between point and line to consider as intersecting. Default is 0.5, meaning it will treat point and line as round integers (sort-of).
					 * @returns {Boolean} if point is contained within the circle.
					 */
					containsVector(p, threshold) {
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
					collideLine(other) {
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
					distanceToVector(v) {
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
					equals(other) {
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
					static lerp(l1, l2, a) {
						return new Line(Vector2.lerp(l1.from, l2.from, a), Vector2.lerp(l1.to, l2.to, a));
					}
				}


				// export the line class
				module.exports = Line;

				/***/
			}),

/***/ 9646:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a math utilities class.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\math_helper.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				// for radians / degrees conversion
				const _toRadsFactor = (Math.PI / 180);
				const _toDegreesFactor = (180 / Math.PI);


				/**
				 * Implement some math utilities functions.
				 */
				class MathHelper {
					/**
					 * Perform linear interpolation between start and end values.
					 * @param {Number} start Starting value.
					 * @param {Number} end Ending value.
					 * @param {Number} amount How much to interpolate from start to end.
					 * @returns {Number} interpolated value between start and end.
					 */
					static lerp(start, end, amount) {
						// to prevent shaking on same values
						if (start === end) { return end; }

						// do lerping
						return ((1 - amount) * start) + (amount * end);
					}

					/**
					 * Calculate 2d dot product.
					 * @param {Number} x1 First vector x.
					 * @param {Number} y1 First vector y.
					 * @param {Number} x2 Second vector x.
					 * @param {Number} y2 Second vector y.
					 * @returns {Number} dot product result.
					 */
					static dot(x1, y1, x2, y2) {
						return x1 * x2 + y1 * y2;
					}

					/**
					 * Make a number a multiply of another number by rounding it up.
					 * @param {Number} numToRound Number to round up.
					 * @param {Number} multiple Number to make 'numToRound' a multiply of.
					 * @returns {Number} Result number.
					 */
					static roundToMultiple(numToRound, multiple) {
						let isPositive = (numToRound >= 0);
						return ((numToRound + isPositive * (multiple - 1)) / multiple) * multiple;
					}

					/**
					 * Convert degrees to radians.
					 * @param {Number} degrees Degrees value to convert to radians.
					 * @returns {Number} Value as radians.
					 */
					static toRadians(degrees) {
						return degrees * _toRadsFactor;
					}

					/**
					 * Convert radians to degrees.
					 * @param {Number} radians Radians value to convert to degrees.
					 * @returns {Number} Value as degrees.
					 */
					static toDegrees(radians) {
						return radians * _toDegreesFactor;
					}

					/**
					* Find shortest distance between two radians, with sign (ie distance can be negative).
					* @param {Number} a1 First radian.
					* @param {Number} a2 Second radian.
					* @returns {Number} Shortest distance between radians.
					*/
					static radiansDistanceSigned(a1, a2) {
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
					static radiansDistance(a1, a2) {
						return Math.abs(this.radiansDistanceSigned(a1, a2));
					}


					/**
					* Find shortest distance between two angles in degrees, with sign (ie distance can be negative).
					* @param {Number} a1 First angle.
					* @param {Number} a2 Second angle.
					* @returns {Number} Shortest distance between angles.
					*/
					static degreesDistanceSigned(a1, a2) {
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
					static degreesDistance(a1, a2) {
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
					static lerpRadians(a1, a2, alpha) {
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
					static lerpDegrees(a1, a2, alpha) {
						// to prevent shaking on same values
						if (a1 === a2) { return a2; }

						// convert to radians
						a1 = this.toRadians(a1);
						a2 = this.toRadians(a2);

						// lerp
						var ret = this.lerpRadians(a1, a2, alpha);

						// convert back to degrees and return
						return this.wrapDegrees(this.toDegrees(ret));
					}

					/**
					* Round numbers from 10'th digit.
					* This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.
					* @param {Number} num Number to round.
					* @returns {Number} Rounded number.
					*/
					static round10(num) {
						return Math.round(num * 100000000.0) / 100000000.0;
					}

					/**
					 * Wrap degrees value to be between 0 to 360.
					 * @param {Number} degrees Degrees to wrap.
					 * @returns {Number} degrees wrapped to be 0-360 values.
					 */
					static wrapDegrees(degrees) {
						degrees = degrees % 360;
						if (degrees < 0) { degrees += 360; }
						return degrees;
					}

					/**
					 * Calculate the normal vector of a polygon using 3 points on it.
					 * @param {Vector3} v1 Vector on the polygon.
					 * @param {Vector3} v2 Vector on the polygon.
					 * @param {Vector3} v3 Vector on the polygon.
					 * @returns {Vector3} Normal vector, normalized.
					 */
					static calculateNormal(v1, v2, v3) {
						const { Vector3 } = __webpack_require__(3624);

						// create vectors between the points
						var _a = v2.sub(v1);
						var _b = v3.sub(v1);

						// calculate normal
						var surfaceNormal = new Vector3(0, 0, 0);
						surfaceNormal.x = (_a.y * _b.z) - (_a.z - _b.y);
						surfaceNormal.y = - ((_b.z * _a.x) - (_b.x * _a.z));
						surfaceNormal.z = (_a.x * _b.y) - (_a.y * _b.x);
						surfaceNormal.normalizeSelf();

						// return result
						return surfaceNormal;
					}
				}

				/**
				 * PI * 2 value.
				 */
				MathHelper.PI2 = Math.PI * 2;


				// export the math helper
				module.exports = MathHelper;

				/***/
			}),

/***/ 5529:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Matrix class.
				 * Based on code from https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\matrix.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vertex = __webpack_require__(4288);
				const Vector2 = __webpack_require__(2544);
				const Vector3 = __webpack_require__(8329);
				const EPSILON = Number.EPSILON;


				/**
				 * Implements a matrix.
				 */
				class Matrix {
					/**
					 * Create the matrix.
					 * @param values matrix values array.
					 * @param cloneValues if true or undefined, will clone values instead of just holding a reference to them.
					 */
					constructor(values, cloneValues) {
						// if no values are set, use identity
						if (!values) {
							values = Matrix.identity.values;
							cloneValues = true;
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
					set(v11, v12, v13, v14, v21, v22, v23, v24, v31, v32, v33, v34, v41, v42, v43, v44) {
						this.values = new Float32Array([
							v11, v12, v13, v14,
							v21, v22, v23, v24,
							v31, v32, v33, v34,
							v41, v42, v43, v44
						]);
					}

					/**
					 * Clone the matrix.
					 * @returns {Matrix} Cloned matrix.
					 */
					clone() {
						let ret = new Matrix(this.values, true);
						return ret;
					}

					/**
					 * Compare this matrix to another matrix.
					 * @param {Matrix} other Matrix to compare to.
					 * @returns {Boolean} If matrices are the same.
					 */
					equals(other) {
						if (other === this) { return true; }
						if (!other) { return false; }
						for (let i = 0; i < this.values.length; ++i) {
							if (this.values[i] !== other.values[i]) { return false; }
						}
						return true;
					}

					/**
					 * Clone and invert the matrix.
					 * @returns {Matrix} Clonsed inverted matrix.
					 */
					inverted() {
						return this.clone().invertSelf();
					}

					/**
					 * Invert this matrix.
					 * @returns {Matrix} Self.
					 */
					invertSelf() {
						// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
						const te = this.values,

							n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3],
							n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7],
							n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11],
							n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15],

							t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
							t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
							t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
							t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

						const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

						if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

						const detInv = 1 / det;

						te[0] = t11 * detInv;
						te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
						te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
						te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

						te[4] = t12 * detInv;
						te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
						te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
						te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

						te[8] = t13 * detInv;
						te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
						te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
						te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

						te[12] = t14 * detInv;
						te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
						te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
						te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

						return this;
					}

					/**
					 * Transform a target.
					 * @param {Vector2|Vector3|Vertex} target Transforms a target, that can be vector2, vector3, or vertex.
					 * @returns {Vector2|Vector3|Vector3} Transformed result.
					 */
					transform(target) {
						if (target.isVector2) { return Matrix.transformVector2(this, target); }
						if (target.isVector3) { return Matrix.transformVector3(this, target); }
						if (target.Vertex) { return Matrix.transformVertex(this, target); }
						throw new Error("Unknown type to transform!");
					}

					/**
					 * Multiply this matrix with another matrix, putting results in self.
					 * @param {Matrix} other Matrix to multiply with.
					 * @returns {Matrix} This.
					 */
					multiplySelfWith(other) {
						return Matrix.multiplyIntoFirst(this, other);
					}

					/**
					 * Multiply this matrix with another matrix and return a new result matrix.
					 * @param {Matrix} other Matrix to multiply with.
					 * @returns {Matrix} New result matrix.
					 */
					multiplyWith(other) {
						return Matrix.multiply(this, other);
					}

					/**
					 * Create an orthographic projection matrix.
					 * @returns {Matrix} a new matrix with result.
					 */
					static createOrthographic(left, right, bottom, top, near, far) {
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
					static createPerspective(fieldOfViewInRadians, aspectRatio, near, far) {
						var f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
						var rangeInv = 1 / (near - far);

						return new Matrix([
							f / aspectRatio, 0, 0, 0,
							0, f, 0, 0,
							0, 0, (near + far) * rangeInv, -1,
							0, 0, near * far * rangeInv * 2, 0
						], false);
					}

					/**
					 * Create a translation matrix.
					 * @returns {Matrix} a new matrix with result.
					 */
					static createTranslation(x, y, z) {
						return new Matrix([
							1, 0, 0, 0,
							0, 1, 0, 0,
							0, 0, 1, 0,
							x || 0, y || 0, z || 0, 1
						], false);
					}

					/**
					 * Create a scale matrix.
					 * @returns {Matrix} a new matrix with result.
					 */
					static createScale(x, y, z) {
						return new Matrix([
							x || 1, 0, 0, 0,
							0, y || 1, 0, 0,
							0, 0, z || 1, 0,
							0, 0, 0, 1
						], false);
					}

					/**
					 * Create a rotation matrix around X axis.
					 * @returns {Matrix} a new matrix with result.
					 */
					static createRotationX(a) {
						let sin = Math.sin;
						let cos = Math.cos;
						return new Matrix([
							1, 0, 0, 0,
							0, cos(a), -sin(a), 0,
							0, sin(a), cos(a), 0,
							0, 0, 0, 1
						], false);
					}

					/**
					 * Create a rotation matrix around Y axis.
					 * @returns {Matrix} a new matrix with result.
					 */
					static createRotationY(a) {
						let sin = Math.sin;
						let cos = Math.cos;
						return new Matrix([
							cos(a), 0, sin(a), 0,
							0, 1, 0, 0,
							-sin(a), 0, cos(a), 0,
							0, 0, 0, 1
						], false);
					}

					/**
					 * Create a rotation matrix around Z axis.
					 * @returns {Matrix} a new matrix with result.
					 */
					static createRotationZ(a) {
						let sin = Math.sin;
						let cos = Math.cos;
						return new Matrix([
							cos(a), -sin(a), 0, 0,
							sin(a), cos(a), 0, 0,
							0, 0, 1, 0,
							0, 0, 0, 1
						], false);
					}

					/**
					 * Multiply two matrices.
					 * @returns {Matrix} a new matrix with result.
					 */
					static multiply(matrixA, matrixB) {
						// Slice the second matrix up into rows
						let row0 = [matrixB.values[0], matrixB.values[1], matrixB.values[2], matrixB.values[3]];
						let row1 = [matrixB.values[4], matrixB.values[5], matrixB.values[6], matrixB.values[7]];
						let row2 = [matrixB.values[8], matrixB.values[9], matrixB.values[10], matrixB.values[11]];
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
					 * Creates a look-at matrix - a matrix rotated to look at a given position.
					 * @param {Vector3} eyePosition Eye position.
					 * @param {Vector3} targetPosition Position the matrix should look at.
					 * @param {Vector3=} upVector Optional vector representing 'up' direction.
					 * @returns {Matrix} a new matrix with result.
					 */
					static createLookAt(eyePosition, targetPosition, upVector) {
						const eye = eyePosition;
						const center = targetPosition;
						const up = upVector || Vector3.upReadonly;
						let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
						if (
							Math.abs(eye.x - center.x) < EPSILON &&
							Math.abs(eye.y - center.y) < EPSILON &&
							Math.abs(eye.z - center.z) < EPSILON
						) {
							return Matrix.identity.clone();
						}
						z0 = eye.x - center.x;
						z1 = eye.y - center.y;
						z2 = eye.z - center.z;
						len = 1 / Math.hypot(z0, z1, z2);
						z0 *= len;
						z1 *= len;
						z2 *= len;
						x0 = up.y * z2 - up.z * z1;
						x1 = up.z * z0 - up.x * z2;
						x2 = up.x * z1 - up.y * z0;
						len = Math.hypot(x0, x1, x2);
						if (!len) {
							x0 = 0;
							x1 = 0;
							x2 = 0;
						} else {
							len = 1 / len;
							x0 *= len;
							x1 *= len;
							x2 *= len;
						}
						y0 = z1 * x2 - z2 * x1;
						y1 = z2 * x0 - z0 * x2;
						y2 = z0 * x1 - z1 * x0;
						len = Math.hypot(y0, y1, y2);
						if (!len) {
							y0 = 0;
							y1 = 0;
							y2 = 0;
						} else {
							len = 1 / len;
							y0 *= len;
							y1 *= len;
							y2 *= len;
						}
						const out = [];
						out[0] = x0;
						out[1] = y0;
						out[2] = z0;
						out[3] = 0;
						out[4] = x1;
						out[5] = y1;
						out[6] = z1;
						out[7] = 0;
						out[8] = x2;
						out[9] = y2;
						out[10] = z2;
						out[11] = 0;
						out[12] = -(x0 * eye.x + x1 * eye.y + x2 * eye.z);
						out[13] = -(y0 * eye.x + y1 * eye.y + y2 * eye.z);
						out[14] = -(z0 * eye.x + z1 * eye.y + z2 * eye.z);
						out[15] = 1;
						return new Matrix(out, false);
					}

					/**
					 * Multiply an array of matrices.
					 * @param {Array<Matrix>} matrices Matrices to multiply.
					 * @returns {Matrix} new matrix with multiply result.
					 */
					static multiplyMany(matrices) {
						let ret = matrices[0];
						for (let i = 1; i < matrices.length; i++) {
							ret = Matrix.multiply(ret, matrices[i]);
						}
						return ret;
					}

					/**
					 * Multiply two matrices and put result in first matrix.
					 * @returns {Matrix} matrixA, after it was modified.
					 */
					static multiplyIntoFirst(matrixA, matrixB) {
						// Slice the second matrix up into rows
						let row0 = [matrixB.values[0], matrixB.values[1], matrixB.values[2], matrixB.values[3]];
						let row1 = [matrixB.values[4], matrixB.values[5], matrixB.values[6], matrixB.values[7]];
						let row2 = [matrixB.values[8], matrixB.values[9], matrixB.values[10], matrixB.values[11]];
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
					static multiplyManyIntoFirst(matrices) {
						let ret = matrices[0];
						for (let i = 1; i < matrices.length; i++) {
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
					static transformVertex(matrix, vertex) {
						return new Vertex(
							(vertex.position.isVector2) ? Matrix.transformVector2(matrix, vertex.position) : Matrix.transformVector3(matrix, vertex.position),
							vertex.textureCoord,
							vertex.color);
					}

					/**
					 * Transform a 2d vector.
					 * @param {Matrix} matrix Matrix to use to transform vector.
					 * @param {Vector2} vector Vector to transform.
					 * @returns {Vector2} Transformed vector.
					 */
					static transformVector2(matrix, vector) {
						const x = vector.x, y = vector.y, z = vector.z || 0;
						const e = matrix.values;

						const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

						const resx = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
						const resy = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;

						return new Vector2(resx, resy);
					}

					/**
					 * Transform a 3d vector.
					 * @param {Matrix} matrix Matrix to use to transform vector.
					 * @param {Vector3} vector Vector to transform.
					 * @returns {Vector3} Transformed vector.
					 */
					static transformVector3(matrix, vector) {
						const x = vector.x, y = vector.y, z = vector.z || 0;
						const e = matrix.values;

						const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

						const resx = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
						const resy = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
						const resz = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

						return new Vector3(resx, resy, resz);
					}
				}


				/**
				 * Multiply matrix and vector.
				 * @private
				 */
				function multiplyMatrixAndPoint(matrix, point) {
					// Give a simple variable name to each part of the matrix, a column and row number
					let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
					let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
					let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
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
				Matrix.identity.isIdentity = true;
				Object.freeze(Matrix.identity);

				// export the matrix object
				module.exports = Matrix;

				/***/
			}),

/***/ 2791:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Provide a pathfinding algorithm.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\path_finder.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				*/

				const Vector2 = __webpack_require__(2544);


				/**
				 * Interface for a supported grid.
				 */
				class IGrid {
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
				class Node {
					/**
					 * Create the node from a position.
					 * @param {Vector2|Vector3} position Node position.
					 */
					constructor(position) {
						this.position = position;
						this.gCost = 0;
						this.hCost = 0;
						this.parent = null;
						this.price = 1;
					}

					/**
					 * Get the node fCost factor.
					 */
					get fCost() {
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
				function findPath(grid, startPos, targetPos, options) {
					let ret = _ImpFindPath(grid, startPos, targetPos, options || {});
					return ret;
				}


				/**
				 * Internal function that implements the path-finding algorithm.
				 * @private
				 */
				function _ImpFindPath(grid, startPos, targetPos, options) {
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
					while (openSet.length > 0) {
						// check iterations count
						if (options.maxIterations) {
							if (iterationsCount++ > options.maxIterations) {
								break;
							}
						}

						// find optimal node to start from
						let currentNode = openSet[0];
						for (let i = 1; i < openSet.length; i++) {
							if ((openSet[i].fCost <= currentNode.fCost) && (openSet[i].hCost < currentNode.hCost)) {
								currentNode = openSet[i];
							}
						}

						// add current node to close set
						removeFromArray(openSet, currentNode);
						closedSet.add(currentNode);

						// did we reach target? :D
						if (currentNode == targetNode) {
							let finalPath = retracePath(startNode, targetNode);
							return finalPath;
						}

						// get neighbor tiles
						let neighbors = [];
						for (let nx = -1; nx <= 1; nx++) {
							for (let ny = -1; ny <= 1; ny++) {
								if (nx === 0 && ny === 0) { continue; }
								if (!allowDiagonal && (nx !== 0 && ny !== 0)) { continue; }
								neighbors.push(getOrCreateNode({ x: currentNode.position.x + nx, y: currentNode.position.y + ny, z: currentNode.position.z }));
							}
						}

						// iterate neighbors
						for (let neighbor of neighbors) {
							// skip if already passed or can't walk there
							if (closedSet.has(neighbor) || grid.isBlocked(currentNode.position, neighbor.position)) {
								continue;
							}

							// calc const and price to walk there
							let price = (options.ignorePrices) ? 1 : grid.getPrice(neighbor.position);
							let currStepCost = currentNode.gCost + getDistance(currentNode, neighbor) * price;

							// update node price and add to open set
							let isInOpenSet = (openSet.indexOf(neighbor) !== -1);
							if (!isInOpenSet || (currStepCost < neighbor.gCost)) {
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
				function retracePath(startNode, endNode) {
					let path = [];
					let currentNode = endNode;

					while (currentNode !== startNode) {
						path.unshift(currentNode.position);
						currentNode = currentNode.parent;
					}

					return path;
				}

				/**
				 * Get distance between two points on grid.
				 * This method is quick and dirty and takes diagonal into consideration.
				 */
				function getDistance(pa, pb) {
					let dx = (pa.position.x - pb.position.x);
					let dy = (pa.position.y - pb.position.y);
					return Math.sqrt(dx * dx + dy * dy);
				}


				/**
				 * Path finder utilitiy.
				 * To use it:
				 *  1. Implement a `IGrid` instance that returns if a grid node is blocking and what's the price to cross it.
				 *  2. Call findPath() with your grid to find a path between start and end points.
				 */
				const PathFinder = {
					findPath: findPath,
					IGrid: IGrid
				};

				// export the path finder object
				module.exports = PathFinder;

				/***/
			}),

/***/ 4476:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implements 2d perlin noise generator.
				 * Based on code from noisejs by Stefan Gustavson.
				 * https://github.com/josephg/noisejs/blob/master/perlin.js
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\perlin.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				// import some utilities
				const MathHelper = __webpack_require__(9646);
				const lerp = MathHelper.lerp;

				// do fade
				function fade(t) {
					return t * t * t * (t * (t * 6 - 15) + 10);
				}

				// store gradient value
				function Grad(x, y, z) {
					this.x = x; this.y = y; this.z = z;
				}
				Grad.prototype.dot2 = function(x, y) {
					return this.x * x + this.y * y;
				};

				// const premutations
				const p = [151, 160, 137, 91, 90, 15,
					131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
					190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
					88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
					77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
					102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
					135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
					5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
					223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
					129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
					251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
					49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
					138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];


				/**
				 * Generate 2d perlin noise.
				 * Based on code from noisejs by Stefan Gustavson.
				 * https://github.com/josephg/noisejs/blob/master/perlin.js
				 */
				class Perlin {
					/**
					 * Create the perlin noise generator.
					 * @param {Number} seed Seed for perlin noise, or undefined for random.
					 */
					constructor(seed) {
						if (seed === undefined) { seed = Math.random(); }
						this.seed(seed);
					}

					/**
					 * Set the perlin noise seed.
					 * @param {Number} seed New seed value. May be either a decimal between 0 to 1, or an unsigned short between 0 to 65536.
					 */
					seed(seed) {
						// scale the seed out
						if (seed > 0 && seed < 1) {
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
						var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
						new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
						new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)];

						// apply seed
						for (var i = 0; i < 256; i++) {
							var v;
							if (i & 1) {
								v = p[i] ^ (seed & 255);
							} else {
								v = p[i] ^ ((seed >> 8) & 255);
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
					generateSmooth(x, y, blurDistance, contrast) {
						if (blurDistance === undefined) {
							blurDistance = 0.25;
						}
						let a = this.generate(x - blurDistance, y - blurDistance, contrast);
						let b = this.generate(x + blurDistance, y + blurDistance, contrast);
						let c = this.generate(x - blurDistance, y + blurDistance, contrast);
						let d = this.generate(x + blurDistance, y - blurDistance, contrast);
						return (a + b + c + d) / 4;
					}

					/**
					 * Generate a perlin noise value for x,y coordinates.
					 * @param {Number} x X coordinate to generate perlin noise for.
					 * @param {Number} y Y coordinate to generate perlin noise for.
					 * @param {Number} contrast Optional contrast factor.
					 * @returns {Number} Perlin noise value for given point, ranged from 0 to 1.
					 */
					generate(x, y, contrast) {
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
						var n00 = gradP[X + perm[Y]].dot2(x, y) * contrast;
						var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1) * contrast;
						var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y) * contrast;
						var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1) * contrast;

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

				/***/
			}),

/***/ 5597:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * A plane in 3D space.
				 * Based on code from THREE.js.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\plane.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Line = __webpack_require__(1708);
				const Sphere = __webpack_require__(7517);
				const Vector3 = __webpack_require__(8329);


				/**
				 * A plane in 3D space.
				 */
				class Plane {
					/**
					 * Create the plane.
					 * @param {Vector3} normal Plane normal vector.
					 * @param {Number} constant Plane constant.
					 */
					constructor(normal = new Vector3(1, 0, 0), constant = 0) {
						this.normal = normal;
						this.constant = constant;
					}

					/**
					 * Set the plane components.
					 * @param {Vector3} normal Plane normal.
					 * @param {Number} constant Plane constant.
					 * @returns {Plane} Self.
					 */
					set(normal, constant) {
						this.normal.copy(normal);
						this.constant = constant;
						return this;
					}

					/**
					 * Set the plane components.
					 * @param {Number} x Plane normal X.
					 * @param {Number} y Plane normal Y.
					 * @param {Number} z Plane normal Z.
					 * @param {Number} w Plane constant.
					 * @returns {Plane} Self.
					 */
					setComponents(x, y, z, w) {
						this.normal.set(x, y, z);
						this.constant = w;
						return this;
					}

					/**
					 * Set plane from normal and coplanar point vectors.
					 * @param {Vector3} normal Plane normal.
					 * @param {Vector3} point Coplanar point.
					 * @returns {Plane} Self.
					 */
					setFromNormalAndCoplanarPoint(normal, point) {
						this.normal.copy(normal);
						this.constant = -(point.dot(this.normal));
						return this;
					}

					/**
					 * Copy values from another plane.
					 * @param {Plane} plane Plane to copy.
					 * @returns {Plane} Self.
					 */
					copy(plane) {
						this.normal.copy(plane.normal);
						this.constant = plane.constant;
						return this;
					}

					/**
					 * Normalize the plane.
					 * @returns {Plane} self.
					 */
					normalizeSelf() {
						// Note: will lead to a divide by zero if the plane is invalid.
						const inverseNormalLength = 1.0 / this.normal.length();
						this.normal.mulSelf(inverseNormalLength);
						this.constant *= inverseNormalLength;
						return this;
					}

					/**
					 * Normalize a clone of this plane.
					 * @returns {Plane} Normalized clone.
					 */
					normalized() {
						return this.clone().normalizeSelf();
					}

					/**
					 * Negate this plane.
					 * @returns {Plane} Self.
					 */
					negateSelf() {
						this.constant *= -1;
						this.normal.mulSelf(-1);
						return this;
					}

					/**
					 * Calculate distance to point.
					 * @param {Vector3} point Point to calculate distance to.
					 * @returns {Number} Distance to point.
					 */
					distanceToPoint(point) {
						return this.normal.dot(point) + this.constant;
					}

					/**
					 * Calculate distance to sphere.
					 * @param {Sphere} sphere Sphere to calculate distance to.
					 * @returns {Number} Distance to sphere.
					 */
					distanceToSphere(sphere) {
						return this.distanceToPoint(sphere.center) - sphere.radius;
					}

					/**
					 * Check if this plane collide with a line.
					 * @param {Line} line Line to check.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collideLine(line) {
						// Note: this tests if a line collide the plane, not whether it (or its end-points) are coplanar with it.
						const startSign = this.distanceToPoint(line.start);
						const endSign = this.distanceToPoint(line.end);
						return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
					}

					/**
					 * Check if this plane collide with a sphere.
					 * @param {Sphere} sphere Sphere to check.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collideSphere(sphere) {
						return sphere.collidePlane(this);
					}

					/**
					 * Coplanar a point.
					 * @returns {Vector3} Coplanar point as a new vector.
					 */
					coplanarPoint() {
						return this.normal.mul(-this.constant);
					}

					/**
					 * Translate this plane.
					 * @param {Vector3} offset Offset to translate to.
					 * @returns {Plane} Self.
					 */
					translateSelf(offset) {
						this.constant -= offset.dot(this.normal);
						return this;
					}

					/**
					 * Check if this plane equals another plane.
					 * @param {Plane} plane Other plane to compare to.
					 * @returns {Boolean} True if equal, false otherwise.
					 */
					equals(plane) {
						return plane.normal.equals(this.normal) && (plane.constant === this.constant);
					}

					/**
					 * Clone this plane.
					 * @returns {Plane} Cloned plane.
					 */
					clone() {
						return new this.constructor().copy(this);
					}
				}


				// export the plane object
				module.exports = Plane;

				/***/
			}),

/***/ 4493:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * A ray in 3D space.
				 * Based on code from THREE.js.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\ray.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const Vector3 = __webpack_require__(8329);


				/**
				 * A 3D ray.
				 */
				class Ray {
					/**
					 * Create the Ray.
					 * @param {Vector3} origin Ray origin point.
					 * @param {Vector3} direction Ray 3d direction.
					 */
					constructor(origin, direction) {
						this.origin = origin.clone();
						this.direction = direction.clone();
					}

					/**
					 * Set the ray components.
					 * @param {Vector3} origin Ray origin point.
					 * @param {Vector3} direction Ray 3d direction.
					 * @returns {Plane} Self.
					 */
					set(origin, direction) {
						this.origin.copy(origin);
						this.direction.copy(direction);
						return this;
					}

					/**
					 * Copy values from another ray.
					 * @param {Ray} ray Ray to copy.
					 * @returns {Ray} Self.
					 */
					copy(ray) {
						this.set(ray.origin, ray.direction);
						return this;
					}

					/**
					 * Check if this ray equals another ray.
					 * @param {Ray} ray Other ray to compare to.
					 * @returns {Boolean} True if equal, false otherwise.
					 */
					equals(ray) {
						return ray.origin.equals(this.origin) && ray.direction.equals(this.direction);
					}

					/**
					 * Get the 3d point on the ray by distance from origin.
					 * @param {Number} distance Distance from origin to travel.
					 * @returns {Vector3} Point on ray from origin.
					 */
					at(distance) {
						return this.origin.add(this.direction.mul(distance));
					}

					/**
					 * Calculate distance to a 3d point.
					 * @param {Vector3} point Point to calculate distance to.
					 * @returns {Number} Distance to point.
					 */
					distanceToPoint(point) {
						return Math.sqrt(this.distanceToPointSquared(point));
					}

					/**
					 * Calculate squared distance to a 3d point.
					 * @param {Vector3} point Point to calculate distance to.
					 * @returns {Number} Squared distance to point.
					 */
					distanceToPointSquared(point) {
						const directionDistance = point.sub(this.origin).dot(this.direction);

						// point behind the ray
						if (directionDistance < 0) {
							return this.origin.distanceToSquared(point);
						}

						const v = this.origin.add(this.direction.mul(directionDistance));
						return v.distanceToSquared(point);
					}

					/**
					 * Check if this ray collides with a sphere.
					 * @param {Sphere} sphere Sphere to test collision with.
					 * @returns {Boolean} True if collide with sphere, false otherwise.
					 */
					collideSphere(sphere) {
						return this.distanceToPointSquared(sphere.center) <= (sphere.radius * sphere.radius);
					}

					/**
					 * Check if this ray collides with a box.
					 * @param {Box} box Box to test collision with.
					 * @returns {Boolean} True if collide with box, false otherwise.
					 */
					collideBox(box) {
						return Boolean(this.findColliionPointWithBox(box));
					}

					/**
					 * Return the collision point between the ray and a box, or null if they don't collide.
					 * @param {Box} box Box to get collision with.
					 * @returns {Vector3|null} Collision point or null.
					 */
					findColliionPointWithBox(box) {

						let tmin, tmax, tymin, tymax, tzmin, tzmax;

						const invdirx = 1 / this.direction.x,
							invdiry = 1 / this.direction.y,
							invdirz = 1 / this.direction.z;

						const origin = this.origin;

						if (invdirx >= 0) {

							tmin = (box.min.x - origin.x) * invdirx;
							tmax = (box.max.x - origin.x) * invdirx;

						} else {

							tmin = (box.max.x - origin.x) * invdirx;
							tmax = (box.min.x - origin.x) * invdirx;

						}

						if (invdiry >= 0) {

							tymin = (box.min.y - origin.y) * invdiry;
							tymax = (box.max.y - origin.y) * invdiry;

						} else {

							tymin = (box.max.y - origin.y) * invdiry;
							tymax = (box.min.y - origin.y) * invdiry;

						}

						if ((tmin > tymax) || (tymin > tmax)) return null;

						if (tymin > tmin || isNaN(tmin)) tmin = tymin;

						if (tymax < tmax || isNaN(tmax)) tmax = tymax;

						if (invdirz >= 0) {

							tzmin = (box.min.z - origin.z) * invdirz;
							tzmax = (box.max.z - origin.z) * invdirz;

						} else {

							tzmin = (box.max.z - origin.z) * invdirz;
							tzmax = (box.min.z - origin.z) * invdirz;

						}

						if ((tmin > tzmax) || (tzmin > tmax)) return null;

						if (tzmin > tmin || tmin !== tmin) tmin = tzmin;

						if (tzmax < tmax || tmax !== tmax) tmax = tzmax;

						//return point closest to the ray (positive side)

						if (tmax < 0) {
							return null;
						}

						// return position
						return this.at(tmin >= 0 ? tmin : tmax);
					}

					/**
					 * Clone this ray.
					 * @returns {Ray} Cloned ray.
					 */
					clone() {
						return new Ray(this.origin, this.direction);
					}
				}


				// export the ray object
				module.exports = Ray;

				/***/
			}),

/***/ 4731:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a simple 2d rectangle.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\rectangle.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				const Circle = __webpack_require__(9668);
				const Line = __webpack_require__(1708);
				const MathHelper = __webpack_require__(9646);
				const Vector2 = __webpack_require__(2544);


				/**
				 * Implement a simple 2d Rectangle.
				 */
				class Rectangle {
					/**
					 * Create the Rect.
					 * @param {Number} x Rect position X (top left corner).
					 * @param {Number} y Rect position Y (top left corner).
					 * @param {Number} width Rect width.
					 * @param {Number} height Rect height.
					 */
					constructor(x, y, width, height) {
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
					set(x, y, width, height) {
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
					copy(other) {
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
					getPosition() {
						return new Vector2(this.x, this.y);
					}

					/**
					 * Get size as Vector2.
					 * @returns {Vector2} Size vector.
					 */
					getSize() {
						return new Vector2(this.width, this.height);
					}

					/**
					 * Get center position.
					 * @returns {Vector2} Position vector.
					 */
					getCenter() {
						return new Vector2(Math.round(this.x + this.width / 2), Math.round(this.y + this.height / 2));
					}

					/**
					 * Get left value.
					 * @returns {Number} rectangle left.
					 */
					get left() {
						return this.x;
					}

					/**
					 * Get right value.
					 * @returns {Number} rectangle right.
					 */
					get right() {
						return this.x + this.width;
					}

					/**
					 * Get top value.
					 * @returns {Number} rectangle top.
					 */
					get top() {
						return this.y;
					}

					/**
					 * Get bottom value.
					 * @returns {Number} rectangle bottom.
					 */
					get bottom() {
						return this.y + this.height;
					}

					/**
					 * Return a clone of this rectangle.
					 * @returns {Rectangle} Cloned rectangle.
					 */
					clone() {
						return new Rectangle(this.x, this.y, this.width, this.height);
					}

					/**
					 * Get top-left corner.
					 * @returns {Vector2} Corner position vector.
					 */
					getTopLeft() {
						return new Vector2(this.x, this.y);
					}

					/**
					 * Get top-right corner.
					 * @returns {Vector2} Corner position vector.
					 */
					getTopRight() {
						return new Vector2(this.x + this.width, this.y);
					}

					/**
					 * Get bottom-left corner.
					 * @returns {Vector2} Corner position vector.
					 */
					getBottomLeft() {
						return new Vector2(this.x, this.y + this.height);
					}

					/**
					 * Get bottom-right corner.
					 * @returns {Vector2} Corner position vector.
					 */
					getBottomRight() {
						return new Vector2(this.x + this.width, this.y + this.height);
					}

					/**
					 * Convert to string.
					 */
					string() {
						return this.x + ',' + this.y + ',' + this.width + ',' + this.height;
					}

					/**
					 * Check if this rectangle contains a Vector2.
					 * @param {Vector2} p Point to check.
					 * @returns {Boolean} if point is contained within the rectangle.
					 */
					containsVector(p) {
						return (p.x >= this.x) && (p.x <= this.x + this.width) && (p.y >= this.y) && (p.y <= this.y + this.height);
					}

					/**
					 * Check if this rectangle collides with another rectangle.
					 * @param {Rectangle} other Rectangle to check collision with.
					 * @return {Boolean} if rectangles collide.
					 */
					collideRect(other) {
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
					collideLine(line) {
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
					collideCircle(circle) {
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
					getBoundingCircle() {
						let center = this.getCenter();
						let radius = center.distanceTo(this.getTopLeft());
						return new Circle(center, radius);
					}

					/**
					 * Build and return a rectangle from points.
					 * @param {Array<Vector2>} points Points to build rectangle from.
					 * @returns {Rectangle} new rectangle from points.
					 */
					static fromPoints(points) {
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
					resize(amount) {
						if (typeof amount === 'number') {
							amount = new Vector2(amount, amount);
						}
						return new Rectangle(this.x - amount.x / 2, this.y - amount.y / 2, this.width + amount.x, this.height + amount.y);
					}

					/**
					 * Check if equal to another rectangle.
					 * @param {Rectangle} other Other rectangle to compare to.
					 */
					equals(other) {
						return (this === other) ||
							(other && (other.constructor === this.constructor) &&
								(this.x == other.x) && (this.y == other.y) && (this.width == other.width) && (this.height == other.height));
					}

					/**
					 * Lerp between two rectangles.
					 * @param {Rectangle} p1 First rectangles.
					 * @param {Rectangle} p2 Second rectangles.
					 * @param {Number} a Lerp factor (0.0 - 1.0).
					 * @returns {Rectangle} result rectangle.
					 */
					static lerp(p1, p2, a) {
						let lerpScalar = MathHelper.lerp;
						return new Rectangle(lerpScalar(p1.x, p2.x, a),
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
					static fromDict(data) {
						return new Rectangle(data.x || 0, data.y || 0, data.width || 0, data.height || 0);
					}

					/**
					 * Convert to dictionary.
					 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
					 * @returns {*} Dictionary with {x,y,width,height}
					 */
					toDict(minimized) {
						if (minimized) {
							const ret = {};
							if (this.x) { ret.x = this.x; }
							if (this.y) { ret.y = this.y; }
							if (this.width) { ret.width = this.width; }
							if (this.height) { ret.height = this.height; }
							return ret;
						}
						return { x: this.x, y: this.y, width: this.width, height: this.height };
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

				/***/
			}),

/***/ 7212:
/***/ ((module) => {

				/**
				 * Implement a seeded random generator.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\seeded_random.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				/**
				 * Class to generate random numbers with seed.
				 */
				class SeededRandom {
					/**
					 * Create the seeded random object.
					 * @param {Number} seed Seed to start from. If not provided, will use 0.
					 */
					constructor(seed) {
						if (seed === undefined) { seed = 0; }
						this.seed = seed;
					}

					/**
					 * Get next random value.
					 * @param {Number} min Optional min value. If max is not provided, this will be used as max.
					 * @param {Number} max Optional max value.
					 * @returns {Number} A randomly generated value.
					 */
					random(min, max) {
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
					pick(options) {
						return options[Math.floor(this.random(options.length))];
					}
				}

				// export the seeded random class.
				module.exports = SeededRandom;

				/***/
			}),

/***/ 7517:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a simple 3d sphere.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\sphere.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const MathHelper = __webpack_require__(9646);
				const Vector3 = __webpack_require__(8329);


				/**
				 * A 3D sphere.
				 */
				class Sphere {
					/**
					 * Create the Sphere.
					 * @param {Vector3} center Sphere center position.
					 * @param {Number} radius Sphere radius.
					 */
					constructor(center, radius) {
						this.center = center.clone();
						this.radius = radius;
					}

					/**
					 * Return a clone of this sphere.
					 * @returns {Sphere} Cloned sphere.
					 */
					clone() {
						return new Sphere(this.center, this.radius);
					}

					/**
					 * Check if this sphere contains a Vector3.
					 * @param {Vector3} p Point to check.
					 * @returns {Boolean} if point is contained within the sphere.
					 */
					containsVector(p) {
						return this.center.distanceTo(p) <= this.radius;
					}

					/**
					 * Check if equal to another sphere.
					 * @param {Sphere} other Other sphere to compare to.
					 * @returns {Boolean} True if spheres are equal, false otherwise.
					 */
					equals(other) {
						return (other === this) ||
							(other && (other.constructor === this.constructor) &&
								this.center.equals(other.center) && (this.radius == other.radius));
					}

					/**
					 * Create sphere from a dictionary.
					 * @param {*} data Dictionary with {center, radius}.
					 * @returns {Sphere} Newly created sphere.
					 */
					static fromDict(data) {
						return new Sphere(Vector3.fromDict(data.center || {}), data.radius || 0);
					}

					/**
					 * Convert to dictionary.
					 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
					 * @returns {*} Dictionary with {center, radius}.
					 */
					toDict(minimized) {
						if (minimized) {
							const ret = {};
							if (this.radius) { ret.radius = this.radius; }
							if (this.center.x || this.center.y) { ret.center = this.center.toDict(true); }
							return ret;
						}
						return { center: this.center.toDict(), radius: this.radius };
					}

					/**
					 * Check if collide with a box.
					 * @param {Box} box Box to check.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collideBox(box) {
						return box.collideSphere(this);
					}

					/**
					 * Check if collide with a plane.
					 * @param {Plane} plane Plane to test.
					 * @returns {Boolean} True if collide, false otherwise.
					 */
					collidePlane(plane) {
						return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
					}

					/**
					 * Lerp between two sphere.
					 * @param {Sphere} p1 First sphere.
					 * @param {Sphere} p2 Second sphere.
					 * @param {Number} a Lerp factor (0.0 - 1.0).
					 * @returns {Sphere} result sphere.
					 */
					static lerp(p1, p2, a) {
						let lerpScalar = MathHelper.lerp;
						return new Sphere(Vector3.lerp(p1.center, p2.center, a), lerpScalar(p1.radius, p2.radius, a));
					}
				}


				// export the sphere class
				module.exports = Sphere;

				/***/
			}),

/***/ 7274:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a storage wrapper.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\storage.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const StorageAdapter = __webpack_require__(6553);


				/**
				 * A thin wrapper layer around storage utility.
				 */
				class Storage {
					/**
					 * Create the storage.
					 * @param {Array<StorageAdapter>} adapters List of storage adapters to pick from. Will use the first option returning 'isValid()' = true.
					 * @param {String} prefix Optional prefix to add to all keys under this storage instance.
					 * @param {Boolean} valuesAsBase64 If true, will encode and decode data as base64.
					 * @param {Boolean} keysAsBase64 If true, will encode and decode keys as base64.
					 */
					constructor(adapters, prefix, valuesAsBase64, keysAsBase64) {
						// default adapters
						adapters = adapters || Storage.defaultAdapters;

						// default to array
						if (!Array.isArray(adapters)) {
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
					get persistent() {
						return this.isValid && this._adapter.persistent;
					}

					/**
					 * Check if this storage instance has a valid adapter.
					 * @returns {Boolean} True if found a valid adapter to use, false otherwise.
					 */
					get isValid() {
						return Boolean(this._adapter);
					}

					/**
					 * Convert key to string and add prefix if needed.
					 * @private
					 * @param {String} key Key to normalize.
					 * @returns {String} Normalized key.
					 */
					normalizeKey(key) {
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
					exists(key) {
						if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
						key = this.normalizeKey(key);
						return this._adapter.exists(key);
					}

					/**
					 * Set value.
					 * @private
					 */
					#_set(key, value) {
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
					#_get(key) {
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
					setItem(key, value) {
						// sanity and normalize key
						if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
						key = this.normalizeKey(key);

						// write value with metadata
						this.#_set(key, value);
					}

					/**
					 * Get value.
					 * @param {String} key Key to get.
					 * @returns {String} Value or null if not set.
					 */
					getItem(key) {
						// sanity and normalize key
						if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
						key = this.normalizeKey(key);

						// read value from metadata
						return this.#_get(key);
					}

					/**
					 * Get value and JSON parse it.
					 * @param {String} key Key to get.
					 * @returns {*} Value as a dictionary object or null if not set.
					 */
					getJson(key) {
						return this.getItem(key) || null;
					}

					/**
					 * Set value as JSON.
					 * @param {String} key Key to set.
					 * @param {*} value Value to set as a dictionary.
					 */
					setJson(key, value) {
						key = this.normalizeKey(key);
						this.#_set(key, value);
					}

					/**
					 * Delete value.
					 * @param {String} key Key to delete.
					 */
					deleteItem(key) {
						if (typeof key !== 'string') { throw new Error("Key must be a string!"); }
						key = this.normalizeKey(key);
						this._adapter.deleteItem(key);
					}

					/**
					 * Clear all values from this storage instance, based on prefix + adapter type.
					 */
					clear() {
						this._adapter.clear(this._keysPrefix);
					}
				}


				/**
				 * Default adapters to use when no adapters list is provided.
				 */
				Storage.defaultAdapters = [new StorageAdapter.localStorage(), new StorageAdapter.sessionStorage(), new StorageAdapter.memory()];


				// export the storage class
				module.exports = Storage;

				/***/
			}),

/***/ 6553:
/***/ ((module) => {

				/**
				 * Implement a storage adapter.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\storage_adapter.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */



				/**
				 * Storage adapter class that implement access to a storage device.
				 * Used by the Storage utilitiy.
				 */
				class StorageAdapter {
					/**
					 * Return if this storage adapter is persistent storage or not.
					 * @returns {Boolean} True if this storage type is persistent.
					 */
					get persistent() {
						throw new Error("Not Implemented.");
					}

					/**
					 * Check if this adapter is OK to be used.
					 * For example, an adapter for localStorage will make sure it exists and not null.
					 * @returns {Boolean} True if storage adapter is valid to be used.
					 */
					isValid() {
						throw new Error("Not Implemented.");
					}

					/**
					 * Check if a key exists.
					 * @param {String} key Key to check.
					 * @returns {Boolean} True if key exists in storage.
					 */
					exists(key) {
						throw new Error("Not Implemented.");
					}

					/**
					 * Set value.
					 * @param {String} key Key to set.
					 * @param {String} value Value to set.
					 */
					setItem(key, value) {
						throw new Error("Not Implemented.");
					}

					/**
					 * Get value.
					 * @param {String} key Key to get.
					 * @returns {String} Value or null if not set.
					 */
					getItem(key) {
						throw new Error("Not Implemented.");
					}

					/**
					 * Delete value.
					 * @param {String} key Key to delete.
					 */
					deleteItem(key) {
						throw new Error("Not Implemented.");
					}

					/**
					 * Clear all values from this storage device.
					 * @param {String} prefix Storage keys prefix.
					 */
					clear(prefix) {
						throw new Error("Not Implemented.");
					}
				}


				/**
				 * Implement simple memory storage adapter.
				 */
				class StorageAdapterMemory {
					/**
					 * Create the memory storage adapter.
					 */
					constructor() {
						this._data = {};
					}

					/**
					 * @inheritdoc
					 */
					get persistent() {
						return false;
					}

					/**
					 * @inheritdoc
					 */
					isValid() {
						return true;
					}

					/**
					 * @inheritdoc
					 */
					exists(key) {
						return Boolean(this._data[key]);
					}

					/**
					 * @inheritdoc
					 */
					setItem(key, value) {
						this._data[key] = value;
					}

					/**
					 * @inheritdoc
					 */
					getItem(key) {
						return this._data[key];
					}

					/**
					 * @inheritdoc
					 */
					deleteItem(key) {
						delete this._data[key];
					}

					/**
					 * @inheritdoc
					 */
					clear(prefix) {
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
				class StorageAdapterLocalStorage {
					/**
					 * @inheritdoc
					 */
					get persistent() {
						return true;
					}

					/**
					 * @inheritdoc
					 */
					isValid() {
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
					exists(key) {
						return localStorage.getItem(key) !== null;
					}

					/**
					 * @inheritdoc
					 */
					setItem(key, value) {
						localStorage.setItem(key, value);
					}

					/**
					 * @inheritdoc
					 */
					getItem(key) {
						return localStorage.getItem(key);
					}

					/**
					 * @inheritdoc
					 */
					deleteItem(key) {
						localStorage.deleteItem(key);
					}

					/**
					 * @inheritdoc
					 */
					clear(prefix) {
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
				class StorageAdapterSessionStorage {
					/**
					 * @inheritdoc
					 */
					get persistent() {
						return false;
					}

					/**
					 * @inheritdoc
					 */
					isValid() {
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
					exists(key) {
						return sessionStorage.getItem(key) !== null;
					}

					/**
					 * @inheritdoc
					 */
					setItem(key, value) {
						sessionStorage.setItem(key, value);
					}

					/**
					 * @inheritdoc
					 */
					getItem(key) {
						return sessionStorage.getItem(key);
					}

					/**
					 * @inheritdoc
					 */
					deleteItem(key) {
						sessionStorage.deleteItem(key);
					}

					/**
					 * @inheritdoc
					 */
					clear(prefix) {
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

				/***/
			}),

/***/ 6347:
/***/ ((module) => {

				/**
				 * Transformation modes.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\transform_modes.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


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
				};


				// export the transform modes.
				module.exports = TransformModes;

				/***/
			}),

/***/ 1910:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Transformations object to store position, rotation and scale, that also support transformations inheritance.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\transformation.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */

				const MathHelper = __webpack_require__(9646);
				const TransformModes = __webpack_require__(6347);
				const Matrix = __webpack_require__(5529);
				const Vector2 = __webpack_require__(2544);

				// some default values
				const _defaults = {};
				_defaults.position = Vector2.zero();
				_defaults.positionMode = TransformModes.Relative;
				_defaults.scale = Vector2.one();
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
				class Transformation {
					/**
					 * Create the transformations.
					 * @param {Vector2} position Optional position value.
					 * @param {Number} rotation Optional rotation value.
					 * @param {Vector2} scale Optional sscale value.
					 */
					constructor(position, rotation, scale) {
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
					getPosition() {
						return this._position.clone();
					}

					/**
					 * Get position transformations mode.
					 * @returns {TransformModes} Position transformation mode.
					 */
					getPositionMode() {
						return this._positionMode;
					}

					/**
					 * Set position.
					 * @param {Vector2} value New position.
					 * @returns {Transformation} this.
					 */
					setPosition(value) {
						if (this._position.equals(value)) { return; }
						this._position.copy(value);
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Set position X value.
					 * @param {Number} value New position.x value.
					 * @returns {Transformation} this.
					 */
					setPositionX(value) {
						if (this._position.x === value) { return; }
						this._position.x = value;
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Set position Y value.
					 * @param {Number} value New position.y value.
					 * @returns {Transformation} this.
					 */
					setPositionY(value) {
						if (this._position.y === value) { return; }
						this._position.y = value;
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Move position by a given vector.
					 * @param {Vector2} value Vector to move position by.
					 * @returns {Transformation} this.
					 */
					move(value) {
						this._position.addSelf(value);
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Set position transformations mode.
					 * @param {TransformModes} value Position transformation mode.
					 * @returns {Transformation} this.
					 */
					setPositionMode(value) {
						if (this._positionMode === value) { return; }
						this._positionMode = value;
						this.#_markDirty(false, true);
						return this;
					}

					/**
					 * Get scale.
					 * @returns {Vector2} Scale.
					 */
					getScale() {
						return this._scale.clone();
					}

					/**
					 * Get scale transformations mode.
					 * @returns {TransformModes} Scale transformation mode.
					 */
					getScaleMode() {
						return this._scaleMode;
					}

					/**
					 * Set scale.
					 * @param {Vector2} value New scale.
					 * @returns {Transformation} this.
					 */
					setScale(value) {
						if (this._scale.equals(value)) { return; }
						this._scale.copy(value);
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Set scale X value.
					 * @param {Number} value New scale.x value.
					 * @returns {Transformation} this.
					 */
					setScaleX(value) {
						if (this._scale.x === value) { return; }
						this._scale.x = value;
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Set scale Y value.
					 * @param {Number} value New scale.y value.
					 * @returns {Transformation} this.
					 */
					setScaleY(value) {
						if (this._scale.y === value) { return; }
						this._scale.y = value;
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Scale by a given vector.
					 * @param {Vector2} value Vector to scale by.
					 * @returns {Transformation} this.
					 */
					scale(value) {
						this._scale.mulSelf(value);
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Set scale transformations mode.
					 * @param {TransformModes} value Scale transformation mode.
					 * @returns {Transformation} this.
					 */
					setScaleMode(value) {
						if (this._scaleMode === value) { return; }
						this._scaleMode = value;
						this.#_markDirty(false, true);
						return this;
					}

					/**
					 * Get rotation.
					 * @returns {Number} rotation.
					 */
					getRotation() {
						return this._rotation;
					}

					/**
					 * Get rotation as degrees.
					 * @returns {Number} rotation.
					 */
					getRotationDegrees() {
						return MathHelper.toDegrees(this._rotation);
					}

					/**
					 * Get rotation as degrees, wrapped between 0 to 360.
					 * @returns {Number} rotation.
					 */
					getRotationDegreesWrapped() {
						let ret = this.getRotationDegrees();
						return MathHelper.wrapDegrees(ret);
					}

					/**
					 * Get rotation transformations mode.
					 * @returns {TransformModes} Rotation transformations mode.
					 */
					getRotationMode() {
						return this._rotationMode;
					}

					/**
					 * Set rotation.
					 * @param {Number} value New rotation.
					 * @param {Boolean} wrap If true, will wrap value if out of possible range.
					 * @returns {Transformation} this.
					 */
					setRotation(value, wrap) {
						if (this._rotation === value) { return; }
						this._rotation = value;
						if (wrap && ((this._rotation < 0) || (this._rotation > (Math.PI * 2)))) {
							this._rotation = Math.atan2(Math.sin(this._rotation), Math.cos(this._rotation));
						}
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Rotate transformation by given radians.
					 * @param {Number} value Rotate value in radians.
					 * @param {Boolean} wrap If true, will wrap value if out of possible range.
					 * @returns {Transformation} this.
					 */
					rotate(value, wrap) {
						this.setRotation(this._rotation + value, wrap);
						return this;
					}

					/**
					 * Set rotation as degrees.
					 * @param {Number} value New rotation.
					 * @param {Boolean} wrap If true, will wrap value if out of possible range.
					 * @returns {Transformation} this.
					 */
					setRotationDegrees(value, wrap) {
						const rads = MathHelper.toRadians(value, wrap);
						return this.setRotation(rads);
					}

					/**
					 * Rotate transformation by given degrees.
					 * @param {Number} value Rotate value in degrees.
					 * @returns {Transformation} this.
					 */
					rotateDegrees(value) {
						this._rotation += MathHelper.toRadians(value);
						this.#_markDirty(true, false);
						return this;
					}

					/**
					 * Set rotation transformations mode.
					 * @param {TransformModes} value Rotation transformation mode.
					 * @returns {Transformation} this.
					 */
					setRotationMode(value) {
						if (this._rotationMode === value) { return; }
						this._rotationMode = value;
						this.#_markDirty(false, true);
						return this;
					}

					/**
					 * Notify about changes in values.
					 * @param {Boolean} localTransform Local transformations changed.
					 * @param {Boolean} transformationModes Transformation modes changed.
					 */
					#_markDirty(localTransform, transformationModes) {
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
					equals(other) {
						return (this._rotation === other._rotation) &&
							(this._position.equals(other._position)) &&
							(this._scale.equals(other._scale));
					}

					/**
					 * Return a clone of this transformations.
					 * @returns {Transformation} Cloned transformations.
					 */
					clone() {
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
					serialize() {
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
					deserialize(data) {
						this._position.copy(data.pos || _defaults.position);
						this._scale.copy(data.scl || _defaults.scale);
						this._rotation = MathHelper.toRadians(data.rot || _defaults.rotation);
						this._positionMode = data.posm || _defaults.positionMode;
						this._scaleMode = data.sclm || _defaults.scaleMode;
						this._rotationMode = data.rotm || _defaults.rotationMode;
						this.#_markDirty(true, true);
					}

					/**
					 * Create and return a transformation matrix.
					 * @returns {Matrix} New transformation matrix.
					 */
					asMatrix() {
						// return cached
						if (this._matrix) {
							return this._matrix;
						}

						// get matrix type and create list of matrices to combine
						let matrices = [];

						// apply position
						if ((this._position.x !== 0) || (this._position.y !== 0)) {
							matrices.push(Matrix.createTranslation(this._position.x, this._position.y, 0));
						}

						// apply rotation
						if (this._rotation) {
							matrices.push(Matrix.createRotationZ(-this._rotation));
						}

						// apply scale
						if ((this._scale.x !== 1) || (this._scale.y !== 1)) {
							matrices.push(Matrix.createScale(this._scale.x, this._scale.y));
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
					static combine(child, parent) {
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
				function combineScalar(childValue, parentValue, parent, mode) {
					switch (mode) {
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
				function combineVector(childValue, parentValue, parent, mode) {
					switch (mode) {
						case TransformModes.Absolute:
							return childValue.clone();

						case TransformModes.AxisAligned:
							return parentValue.add(childValue);

						case TransformModes.Relative:
							return parentValue.add(childValue.rotatedByRadians(parent._rotation));

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
				function combineVectorMul(childValue, parentValue, parent, mode) {
					switch (mode) {
						case TransformModes.Absolute:
							return childValue.clone();

						case TransformModes.AxisAligned:
							return parentValue.mul(childValue);

						case TransformModes.Relative:
							return parentValue.mul(childValue.rotatedByRadians(parent._rotation));

						default:
							throw new Error("Unknown transform mode!");
					}
				}


				// export the transformation object
				module.exports = Transformation;

				/***/
			}),

/***/ 2544:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a simple 2d vector.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\vector2.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				const MathHelper = __webpack_require__(9646);

				/**
				 * A simple Vector object for 2d positions.
				 */
				class Vector2 {
					/**
					 * Create the Vector object.
					 * @param {number} x Vector X.
					 * @param {number} y Vector Y.
					 */
					constructor(x = 0, y = 0) {
						this.x = x;
						this.y = y;
					}

					/**
					 * Clone the vector.
					 * @returns {Vector2} cloned vector.
					 */
					clone() {
						return new Vector2(this.x, this.y);
					}

					/**
					 * Set vector value.
					 * @param {Number} x X component.
					 * @param {Number} y Y component.
					 * @returns {Vector2} this.
					 */
					set(x, y) {
						this.x = x;
						this.y = y;
						return this;
					}

					/**
					 * Copy values from other vector into self.
					 * @returns {Vector2} this.
					 */
					copy(other) {
						this.x = other.x;
						this.y = other.y;
						return this;
					}

					/**
					 * Return a new vector of this + other.
					 * @param {Number|Vector2} Other Vector3 or number to add to all components.
					 * @returns {Vector2} result vector.
					 */
					add(other) {
						if (typeof other === 'number') {
							return new Vector2(this.x + other, this.y + (arguments[1] === undefined ? other : arguments[1]));
						}
						return new Vector2(this.x + other.x, this.y + other.y);
					}

					/**
					 * Return a new vector of this - other.
					 * @param {Number|Vector2} Other Vector3 or number to sub from all components.
					 * @returns {Vector2} result vector.
					 */
					sub(other) {
						if (typeof other === 'number') {
							return new Vector2(this.x - other, this.y - (arguments[1] === undefined ? other : arguments[1]));
						}
						return new Vector2(this.x - other.x, this.y - other.y);
					}

					/**
					 * Return a new vector of this / other.
					 * @param {Number|Vector2} Other Vector3 or number to divide by all components.
					 * @returns {Vector2} result vector.
					 */
					div(other) {
						if (typeof other === 'number') {
							return new Vector2(this.x / other, this.y / (arguments[1] === undefined ? other : arguments[1]));
						}
						return new Vector2(this.x / other.x, this.y / other.y);
					}

					/**
					 * Return a new vector of this * other.
					 * @param {Number|Vector2} Other Vector2 or number to multiply with all components.
					 * @returns {Vector2} result vector.
					 */
					mul(other) {
						if (typeof other === 'number') {
							return new Vector2(this.x * other, this.y * (arguments[1] === undefined ? other : arguments[1]));
						}
						return new Vector2(this.x * other.x, this.y * other.y);
					}

					/**
					 * Return a round copy of this vector.
					 * @returns {Vector2} result vector.
					 */
					round() {
						return new Vector2(Math.round(this.x), Math.round(this.y));
					}

					/**
					 * Return a floored copy of this vector.
					 * @returns {Vector2} result vector.
					 */
					floor() {
						return new Vector2(Math.floor(this.x), Math.floor(this.y));
					}

					/**
					 * Return a ceiled copy of this vector.
					 * @returns {Vector2} result vector.
					 */
					ceil() {
						return new Vector2(Math.ceil(this.x), Math.ceil(this.y));
					}

					/**
					 * Set self values to be min values between self and a given vector.
					 * @param {Vector2} v Vector to min with.
					 * @returns {Vector2} Self.
					 */
					minSelf(v) {
						this.x = Math.min(this.x, v.x);
						this.y = Math.min(this.y, v.y);
						return this;
					}

					/**
					 * Set self values to be max values between self and a given vector.
					 * @param {Vector2} v Vector to max with.
					 * @returns {Vector2} Self.
					 */
					maxSelf(v) {
						this.x = Math.max(this.x, v.x);
						this.y = Math.max(this.y, v.y);
						return this;
					}

					/**
					 * Create a clone vector that is the min result between self and a given vector.
					 * @param {Vector2} v Vector to min with.
					 * @returns {Vector2} Result vector.
					 */
					min(v) {
						this.clone().minSelf(v);
					}

					/**
					 * Create a clone vector that is the max result between self and a given vector.
					 * @param {Vector2} v Vector to max with.
					 * @returns {Vector2} Result vector.
					 */
					max(v) {
						this.clone().maxSelf(v);
					}

					/**
					 * Return a normalized copy of this vector.
					 * @returns {Vector2} result vector.
					 */
					normalized() {
						if (this.x == 0 && this.y == 0) { return Vector2.zero(); }
						let mag = this.length();
						return new Vector2(this.x / mag, this.y / mag);
					}

					/**
					 * Get a copy of this vector rotated by radians.
					 * @param {Number} radians Radians to rotate by.
					 * @returns {Vector2} New vector with the length of this vector and direction rotated by given radians.
					 */
					rotatedByRadians(radians) {
						return Vector2.fromRadians(this.getRadians() + radians).mulSelf(this.length());
					}

					/**
					 * Get a copy of this vector rotated by degrees.
					 * @param {Number} degrees Degrees to rotate by.
					 * @returns {Vector2} New vector with the length of this vector and direction rotated by given degrees.
					 */
					rotatedByDegrees(degrees) {
						return Vector2.fromDegrees(this.getDegrees() + degrees).mulSelf(this.length());
					}

					/**
					 * Add other vector values to self.
					 * @param {Number|Vector2} Other Vector or number to add.
					 * @returns {Vector2} this.
					 */
					addSelf(other) {
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
					 * @param {Number|Vector2} Other Vector or number to subtract.
					 * @returns {Vector2} this.
					 */
					subSelf(other) {
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
					divSelf(other) {
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
					mulSelf(other) {
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
					roundSelf() {
						this.x = Math.round(this.x);
						this.y = Math.round(this.y);
						return this;
					}

					/**
					 * Floor self.
					 * @returns {Vector2} this.
					 */
					floorSelf() {
						this.x = Math.floor(this.x);
						this.y = Math.floor(this.y);
						return this;
					}

					/**
					 * Ceil self.
					 * @returns {Vector2} this.
					 */
					ceilSelf() {
						this.x = Math.ceil(this.x);
						this.y = Math.ceil(this.y);
						return this;
					}

					/**
					 * Return a normalized copy of this vector.
					 * @returns {Vector2} this.
					 */
					normalizeSelf() {
						if (this.x == 0 && this.y == 0) { return this; }
						let mag = this.length();
						this.x /= mag;
						this.y /= mag;
						return this;
					}

					/**
					 * Return if vector equals another vector.
					 * @param {Vector2} other Other vector to compare to.
					 * @returns {Boolean} if vectors are equal.
					 */
					equals(other) {
						return ((this === other) || ((other.constructor === this.constructor) && this.x === other.x && this.y === other.y));
					}

					/**
					 * Return if vector approximately equals another vector.
					 * @param {Vector2} other Other vector to compare to.
					 * @param {Number} threshold Distance threshold to consider as equal. Defaults to 1.
					 * @returns {Boolean} if vectors are equal.
					 */
					approximate(other, threshold) {
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
					length() {
						return Math.sqrt((this.x * this.x) + (this.y * this.y));
					}

					/**
					 * Return a copy of this vector multiplied by a factor.
					 * @returns {Vector2} result vector.
					 */
					scaled(fac) {
						return new Vector2(this.x * fac, this.y * fac);
					}

					/**
					 * Get vector (0,0).
					 * @returns {Vector2} result vector.
					 */
					static zero() {
						return new Vector2(0, 0);
					}

					/**
					 * Get vector with 1,1 values.
					 * @returns {Vector2} result vector.
					 */
					static one() {
						return new Vector2(1, 1);
					}

					/**
					 * Get vector with 0.5,0.5 values.
					 * @returns {Vector2} result vector.
					 */
					static half() {
						return new Vector2(0.5, 0.5);
					}

					/**
					 * Get vector with -1,0 values.
					 * @returns {Vector2} result vector.
					 */
					static left() {
						return new Vector2(-1, 0);
					}

					/**
					 * Get vector with 1,0 values.
					 * @returns {Vector2} result vector.
					 */
					static right() {
						return new Vector2(1, 0);
					}

					/**
					 * Get vector with 0,-1 values.
					 * @returns {Vector2} result vector.
					 */
					static up() {
						return new Vector2(0, -1);
					}

					/**
					 * Get vector with 0,1 values.
					 * @returns {Vector2} result vector.
					 */
					static down() {
						return new Vector2(0, 1);
					}

					/**
					 * Get a random vector with length of 1.
					 * @returns {Vector2} result vector.
					 */
					static random() {
						return Vector2.fromDegrees(Math.random() * 360);
					}

					/**
					 * Get degrees between this vector and another vector.
					 * @param {Vector2} other Other vector.
					 * @returns {Number} Angle between vectors in degrees.
					 */
					degreesTo(other) {
						return Vector2.degreesBetween(this, other);
					};

					/**
					 * Get radians between this vector and another vector.
					 * @param {Vector2} other Other vector.
					 * @returns {Number} Angle between vectors in radians.
					 */
					radiansTo(other) {
						return Vector2.radiansBetween(this, other);
					};

					/**
					 * Get degrees between this vector and another vector.
					 * Return values between 0 to 360.
					 * @param {Vector2} other Other vector.
					 * @returns {Number} Angle between vectors in degrees.
					 */
					wrappedDegreesTo(other) {
						return Vector2.wrappedDegreesBetween(this, other);
					};

					/**
					 * Get radians between this vector and another vector.
					 * Return values between 0 to PI2.
					 * @param {Vector2} other Other vector.
					 * @returns {Number} Angle between vectors in radians.
					 */
					wrappedRadiansTo(other) {
						return Vector2.wrappedRadiansBetween(this, other);
					};

					/**
					 * Calculate distance between this vector and another vectors.
					 * @param {Vector2} other Other vector.
					 * @returns {Number} Distance between vectors.
					 */
					distanceTo(other) {
						return Vector2.distance(this, other);
					}

					/**
					 * Calculate squared distance between this vector and another vector.
					 * @param {Vector2} other Other vector.
					 * @returns {Number} Distance between vectors.
					 */
					distanceToSquared(other) {
						const dx = this.x - other.x, dy = this.y - other.y;
						return dx * dx + dy * dy;
					}

					/**
					 * Return a clone and clamp its values to be between min and max.
					 * @param {Vector2} min Min vector.
					 * @param {Vector2} max Max vector.
					 * @returns {Vector2} Clamped vector.
					 */
					clamp(min, max) {
						return this.clone().clampSelf(min, max);
					}

					/**
					 * Clamp this vector values to be between min and max.
					 * @param {Vector2} min Min vector.
					 * @param {Vector2} max Max vector.
					 * @returns {Vector2} Self.
					 */
					clampSelf(min, max) {
						this.x = Math.max(min.x, Math.min(max.x, this.x));
						this.y = Math.max(min.y, Math.min(max.y, this.y));
						return this;
					}

					/**
					 * Calculate the dot product with another vector.
					 * @param {Vector2} other Vector to calculate dot with.
					 * @returns {Number} Dot product value.
					 */
					dot(other) {
						return this.x * other.x + this.y * other.y;
					}

					/**
					 * Get vector from degrees.
					 * @param {Number} degrees Angle to create vector from (0 = vector pointing right).
					 * @returns {Vector2} result vector.
					 */
					static fromDegrees(degrees) {
						let rads = degrees * (Math.PI / 180);
						return new Vector2(Math.cos(rads), Math.sin(rads));
					}

					/**
					 * Get vector from radians.
					 * @param {Number} radians Angle to create vector from (0 = vector pointing right).
					 * @returns {Vector2} result vector.
					 */
					static fromRadians(radians) {
						return new Vector2(Math.cos(radians), Math.sin(radians));
					}

					/**
					 * Lerp between two vectors.
					 * @param {Vector2} p1 First vector.
					 * @param {Vector2} p2 Second vector.
					 * @param {Number} a Lerp factor (0.0 - 1.0).
					 * @returns {Vector2} result vector.
					 */
					static lerp(p1, p2, a) {
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
					static degreesBetween(P1, P2) {
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
					static radiansBetween(P1, P2) {
						return MathHelper.toRadians(Vector2.degreesBetween(P1, P2));
					};

					/**
					 * Get degrees between two vectors.
					 * Return values between 0 to 360.
					 * @param {Vector2} p1 First vector.
					 * @param {Vector2} p2 Second vector.
					 * @returns {Number} Angle between vectors in degrees.
					 */
					static wrappedDegreesBetween(P1, P2) {
						let temp = P2.sub(P1);
						return temp.getDegrees();
					};

					/**
					 * Get vector's angle in degrees.
					 * @returns {Number} Vector angle in degrees.
					 */
					getDegrees() {
						var angle = Math.atan2(this.y, this.x);
						var degrees = 180 * angle / Math.PI;
						return (360 + Math.round(degrees)) % 360;
					}

					/**
					 * Get vector's angle in radians.
					 * @returns {Number} Vector angle in degrees.
					 */
					getRadians() {
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
					static wrappedRadiansBetween(P1, P2) {
						return MathHelper.toRadians(Vector2.wrappedDegreesBetween(P1, P2));
					};

					/**
					 * Calculate distance between two vectors.
					 * @param {Vector2} p1 First vector.
					 * @param {Vector2} p2 Second vector.
					 * @returns {Number} Distance between vectors.
					 */
					static distance(p1, p2) {
						let a = p1.x - p2.x;
						let b = p1.y - p2.y;
						return Math.sqrt(a * a + b * b);
					}

					/**
					 * Return cross product between two vectors.
					 * @param {Vector2} p1 First vector.
					 * @param {Vector2} p2 Second vector.
					 * @returns {Number} Cross between vectors.
					 */
					static cross(p1, p2) {
						return p1.x * p2.y - p1.y * p2.x;
					}

					/**
					 * Return dot product between two vectors.
					 * @param {Vector2} p1 First vector.
					 * @param {Vector2} p2 Second vector.
					 * @returns {Number} Dot between vectors.
					 */
					static dot(p1, p2) {
						return p1.x * p2.x + p1.y * p2.y;
					}

					/**
					 * Convert to string.
					 */
					string() {
						return this.x + ',' + this.y;
					}

					/**
					 * Parse and return a vector object from string in the form of "x,y".
					 * @param {String} str String to parse.
					 * @returns {Vector2} Parsed vector.
					 */
					static parse(str) {
						let parts = str.split(',');
						return new Vector2(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()));
					}

					/**
					 * Convert to array of numbers.
					 * @returns {Array<Number>} Vector components as array.
					 */
					toArray() {
						return [this.x, this.y];
					}

					/**
					 * Create vector from array of numbers.
					 * @param {Array<Number>} arr Array of numbers to create vector from.
					 * @returns {Vector2} Vector instance.
					 */
					static fromArray(arr) {
						return new Vector2(arr[0], arr[1]);
					}

					/**
					 * Create vector from a dictionary.
					 * @param {*} data Dictionary with {x,y}.
					 * @returns {Vector2} Newly created vector.
					 */
					static fromDict(data) {
						return new Vector2(data.x || 0, data.y || 0);
					}

					/**
					 * Convert to dictionary.
					 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
					 * @returns {*} Dictionary with {x,y}
					 */
					toDict(minimized) {
						if (minimized) {
							const ret = {};
							if (this.x) { ret.x = this.x; }
							if (this.y) { ret.y = this.y; }
							return ret;
						}
						return { x: this.x, y: this.y };
					}
				}

				/**
				 * Vector with 0,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector2.zeroReadonly = new Vector2(0, 0);
				Object.freeze(Vector2.zeroReadonly);

				/**
				 * Vector with 1,1 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector2.oneReadonly = new Vector2(1, 1);
				Object.freeze(Vector2.oneReadonly);

				/**
				 * Vector with 0.5,0.5 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector2.halfReadonly = new Vector2(0.5, 0.5);
				Object.freeze(Vector2.halfReadonly);

				/**
				 * Vector with -1,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector2.leftReadonly = new Vector2(-1, 0);
				Object.freeze(Vector2.leftReadonly);

				/**
				 * Vector with 1,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector2.rightReadonly = new Vector2(1, 0);
				Object.freeze(Vector2.rightReadonly);

				/**
				 * Vector with 0,1 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector2.upReadonly = new Vector2(0, -1);
				Object.freeze(Vector2.upReadonly);

				/**
				 * Vector with 0,-1 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector2.downReadonly = new Vector2(0, 1);
				Object.freeze(Vector2.downReadonly);


				// export vector object
				module.exports = Vector2;

				/***/
			}),

/***/ 8329:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

				/**
				 * Implement a 3d vector.
				 *
				 * |-- copyright and license --|
				 * @module     Shaku
				 * @file       shaku\src\utils\vector3.js
				 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
				 * @copyright  (c) 2021 Ronen Ness
				 * @license    MIT
				 * |-- end copyright and license --|
				 *
				 */


				const MathHelper = __webpack_require__(9646);

				/**
				 * A Vector object for 3d positions.
				 */
				class Vector3 {
					/**
					 * Create the Vector object.
					 * @param {number} x Vector X.
					 * @param {number} y Vector Y.
					 * @param {number} z Vector Z.
					 */
					constructor(x = 0, y = 0, z = 0) {
						this.x = x;
						this.y = y;
						this.z = z;
					}

					/**
					 * Clone the vector.
					 * @returns {Vector3} cloned vector.
					 */
					clone() {
						return new Vector3(this.x, this.y, this.z);
					}

					/**
					 * Set vector value.
					 * @param {Number} x X component.
					 * @param {Number} y Y component.
					 * @param {Number} z Z component.
					 * @returns {Vector3} this.
					 */
					set(x, y, z) {
						this.x = x;
						this.y = y;
						this.z = z;
						return this;
					}

					/**
					 * Copy values from other vector into self.
					 * @returns {Vector3} this.
					 */
					copy(other) {
						this.x = other.x;
						this.y = other.y;
						this.z = other.z;
						return this;
					}

					/**
					 * Return a new vector of this + other.
					 * @param {Number|Vector3} Other Vector3 or number to add to all components.
					 * @returns {Vector3} result vector.
					 */
					add(other) {
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
					 * @param {Number|Vector3} Other Vector3 or number to sub from all components.
					 * @returns {Vector3} result vector.
					 */
					sub(other) {
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
					 * @param {Number|Vector3} Other Vector3 or number to divide by all components.
					 * @returns {Vector3} result vector.
					 */
					div(other) {
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
					 * @param {Number|Vector3} Other Vector3 or number to multiply with all components.
					 * @returns {Vector3} result vector.
					 */
					mul(other) {
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
					round() {
						return new Vector3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
					}

					/**
					 * Return a floored copy of this vector.
					 * @returns {Vector3} result vector.
					 */
					floor() {
						return new Vector3(Math.floor(this.x), Math.floor(this.y), Math.floor(this.z));
					}

					/**
					 * Return a ceiled copy of this vector.
					 * @returns {Vector3} result vector.
					 */
					ceil() {
						return new Vector3(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
					}

					/**
					 * Return a normalized copy of this vector.
					 * @returns {Vector3} result vector.
					 */
					normalized() {
						if ((this.x == 0) && (this.y == 0) && (this.z == 0)) { return Vector3.zero; }
						let mag = this.length();
						return new Vector3(this.x / mag, this.y / mag, this.z / mag);
					}

					/**
					 * Add other vector values to self.
					 * @param {Number|Vector3} Other Vector or number to add.
					 * @returns {Vector3} this.
					 */
					addSelf(other) {
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
					 * @param {Number|Vector3} Other Vector or number to subtract.
					 * @returns {Vector3} this.
					 */
					subSelf(other) {
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
					divSelf(other) {
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
					mulSelf(other) {
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
					roundSelf() {
						this.x = Math.round(this.x);
						this.y = Math.round(this.y);
						this.z = Math.round(this.z);
						return this;
					}

					/**
					 * Floor self.
					 * @returns {Vector3} this.
					 */
					floorSelf() {
						this.x = Math.floor(this.x);
						this.y = Math.floor(this.y);
						this.z = Math.floor(this.z);
						return this;
					}

					/**
					 * Ceil self.
					 * @returns {Vector3} this.
					 */
					ceilSelf() {
						this.x = Math.ceil(this.x);
						this.y = Math.ceil(this.y);
						this.z = Math.ceil(this.z);
						return this;
					}

					/**
					 * Return a normalized copy of this vector.
					 * @returns {Vector3} this.
					 */
					normalizeSelf() {
						if (this.x == 0 && this.y == 0 && this.z == 0) { return this; }
						let mag = this.length();
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
					equals(other) {
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
					approximate(other, threshold) {
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
					length() {
						return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
					}

					/**
					 * Return a copy of this vector multiplied by a factor.
					 * @returns {Vector3} result vector.
					 */
					scaled(fac) {
						return new Vector3(this.x * fac, this.y * fac, this.z * fac);
					}

					/**
					 * Get vector with 0,0,0 values.
					 * @returns {Vector3} result vector.
					 */
					static zero() {
						return new Vector3(0, 0, 0);
					}

					/**
					 * Get vector with 1,1,1 values.
					 * @returns {Vector3} result vector.
					 */
					static one() {
						return new Vector3(1, 1, 1);
					}

					/**
					 * Get vector with 0.5,0.5 values.
					 * @returns {Vector3} result vector.
					 */
					static half() {
						return new Vector3(0.5, 0.5, 0.5);
					}

					/**
					 * Get vector with -1,0,0 values.
					 * @returns {Vector3} result vector.
					 */
					static left() {
						return new Vector3(-1, 0, 0);
					}

					/**
					 * Get vector with 1,0,0 values.
					 * @returns {Vector3} result vector.
					 */
					static right() {
						return new Vector3(1, 0, 0);
					}

					/**
					 * Get vector with 0,-1,0 values.
					 * @returns {Vector3} result vector.
					 */
					static up() {
						return new Vector3(0, 1, 0);
					}

					/**
					 * Get vector with 0,1,0 values.
					 * @returns {Vector3} result vector.
					 */
					static down() {
						return new Vector3(0, -1, 0);
					}

					/**
					 * Get vector with 0,0,1 values.
					 * @returns {Vector3} result vector.
					 */
					static front() {
						return new Vector3(0, 0, 1);
					}

					/**
					 * Get vector with 0,0,-1 values.
					 * @returns {Vector3} result vector.
					 */
					static back() {
						return new Vector3(0, 0, -1);
					}

					/**
					 * Calculate distance between this vector and another vector.
					 * @param {Vector3} other Other vector.
					 * @returns {Number} Distance between vectors.
					 */
					distanceTo(other) {
						return Vector3.distance(this, other);
					}

					/**
					 * Calculate squared distance between this vector and another vector.
					 * @param {Vector3} other Other vector.
					 * @returns {Number} Distance between vectors.
					 */
					distanceToSquared(other) {
						const dx = this.x - other.x, dy = this.y - other.y, dz = this.z - other.z;
						return dx * dx + dy * dy + dz * dz;
					}

					/**
					 * Return a clone and clamp its values to be between min and max.
					 * @param {Vector3} min Min vector.
					 * @param {Vector3} max Max vector.
					 * @returns {Vector3} Clamped vector.
					 */
					clamp(min, max) {
						return this.clone().clampSelf(min, max);
					}

					/**
					 * Clamp this vector values to be between min and max.
					 * @param {Vector3} min Min vector.
					 * @param {Vector3} max Max vector.
					 * @returns {Vector3} Self.
					 */
					clampSelf(min, max) {
						this.x = Math.max(min.x, Math.min(max.x, this.x));
						this.y = Math.max(min.y, Math.min(max.y, this.y));
						this.z = Math.max(min.z, Math.min(max.z, this.z));
						return this;
					}

					/**
					 * Calculate the dot product with another vector.
					 * @param {Vector3} other Vector to calculate dot with.
					 * @returns {Number} Dot product value.
					 */
					dot(other) {
						return this.x * other.x + this.y * other.y + this.z * other.z;
					}

					/**
					 * Lerp between two vectors.
					 * @param {Vector3} p1 First vector.
					 * @param {Vector3} p2 Second vector.
					 * @param {Number} a Lerp factor (0.0 - 1.0).
					 * @returns {Vector3} result vector.
					 */
					static lerp(p1, p2, a) {
						let lerpScalar = MathHelper.lerp;
						return new Vector3(lerpScalar(p1.x, p2.x, a), lerpScalar(p1.y, p2.y, a), lerpScalar(p1.z, p2.z, a));
					}

					/**
					 * Calculate distance between two vectors.
					 * @param {Vector3} p1 First vector.
					 * @param {Vector3} p2 Second vector.
					 * @returns {Number} Distance between vectors.
					 */
					static distance(p1, p2) {
						let a = p1.x - p2.x;
						let b = p1.y - p2.y;
						let c = p1.z - p2.z;
						return Math.sqrt(a * a + b * b + c * c);
					}

					/**
					 * Return cross product between two vectors.
					 * @param {Vector3} p1 First vector.
					 * @param {Vector3} p2 Second vector.
					 * @returns {Vector3} Crossed vector.
					 */
					static crossVector(p1, p2) {
						const ax = p1.x, ay = p1.y, az = p1.z;
						const bx = p2.x, by = p2.y, bz = p2.z;

						let x = ay * bz - az * by;
						let y = az * bx - ax * bz;
						let z = ax * by - ay * bx;

						return new Vector3(x, y, z);
					}

					/**
					 * Set self values to be min values between self and a given vector.
					 * @param {Vector3} v Vector to min with.
					 * @returns {Vector3} Self.
					 */
					minSelf(v) {
						this.x = Math.min(this.x, v.x);
						this.y = Math.min(this.y, v.y);
						this.z = Math.min(this.z, v.z);
						return this;
					}

					/**
					 * Set self values to be max values between self and a given vector.
					 * @param {Vector3} v Vector to max with.
					 * @returns {Vector3} Self.
					 */
					maxSelf(v) {
						this.x = Math.max(this.x, v.x);
						this.y = Math.max(this.y, v.y);
						this.z = Math.max(this.z, v.z);
						return this;
					}

					/**
					 * Create a clone vector that is the min result between self and a given vector.
					 * @param {Vector3} v Vector to min with.
					 * @returns {Vector3} Result vector.
					 */
					min(v) {
						this.clone().minSelf(v);
					}

					/**
					 * Create a clone vector that is the max result between self and a given vector.
					 * @param {Vector3} v Vector to max with.
					 * @returns {Vector3} Result vector.
					 */
					max(v) {
						this.clone().maxSelf(v);
					}

					/**
					 * Convert to string.
					 */
					string() {
						return this.x + ',' + this.y + ',' + this.z;
					}

					/**
					 * Parse and return a vector object from string in the form of "x,y".
					 * @param {String} str String to parse.
					 * @returns {Vector3} Parsed vector.
					 */
					static parse(str) {
						let parts = str.split(',');
						return new Vector3(parseFloat(parts[0].trim()), parseFloat(parts[1].trim()), parseFloat(parts[2].trim()));
					}

					/**
					 * Convert to array of numbers.
					 * @returns {Array<Number>} Vector components as array.
					 */
					toArray() {
						return [this.x, this.y, this.z];
					}

					/**
					 * Create vector from array of numbers.
					 * @param {Array<Number>} arr Array of numbers to create vector from.
					 * @returns {Vector3} Vector instance.
					 */
					static fromArray(arr) {
						return new Vector3(arr[0], arr[1], arr[2]);
					}

					/**
					 * Create vector from a dictionary.
					 * @param {*} data Dictionary with {x,y,z}.
					 * @returns {Vector3} Newly created vector.
					 */
					static fromDict(data) {
						return new Vector3(data.x || 0, data.y || 0, data.z || 0);
					}

					/**
					 * Convert to dictionary.
					 * @param {Boolean} minimized If true, will not include keys that their values are 0. You can use fromDict on minimized dicts.
					 * @returns {*} Dictionary with {x,y,z}
					 */
					toDict(minimized) {
						if (minimized) {
							const ret = {};
							if (this.x) { ret.x = this.x; }
							if (this.y) { ret.y = this.y; }
							if (this.z) { ret.z = this.z; }
							return ret;
						}
						return { x: this.x, y: this.y, z: this.z };
					}
				}

				/**
				 * Vector with 0,0,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.zeroReadonly = new Vector3(0, 0, 0);
				Object.freeze(Vector3.zeroReadonly);

				/**
				 * Vector with 1,1,1 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.oneReadonly = new Vector3(1, 1, 1);
				Object.freeze(Vector3.oneReadonly);

				/**
				 * Vector with 0.5,0.5,0.5 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.halfReadonly = new Vector3(0.5, 0.5, 0.5);
				Object.freeze(Vector3.halfReadonly);

				/**
				 * Vector with -1,0,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.leftReadonly = new Vector3(-1, 0, 0);
				Object.freeze(Vector3.leftReadonly);

				/**
				 * Vector with 1,0,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.rightReadonly = new Vector3(1, 0, 0);
				Object.freeze(Vector3.rightReadonly);

				/**
				 * Vector with 0,-1,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.upReadonly = new Vector3(0, 1, 0);
				Object.freeze(Vector3.upReadonly);

				/**
				 * Vector with 0,1,0 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.downReadonly = new Vector3(0, -1, 0);
				Object.freeze(Vector3.downReadonly);

				/**
				 * Vector with 0,0,1 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.frontReadonly = new Vector3(0, 0, 1);
				Object.freeze(Vector3.frontReadonly);

				/**
				 * Vector with 0,0,-1 values as a frozen shared object.
				 * Be careful not to try and change it.
				 */
				Vector3.backReadonly = new Vector3(0, 0, -1);
				Object.freeze(Vector3.backReadonly);

				// export vector object
				module.exports = Vector3;

				/***/
			})

		/******/
	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
			/******/
		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
			/******/
		};
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
		/******/
	}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
				/******/
			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
				/******/
			}
			/******/
		})();
		/******/
	})();
/******/
/************************************************************************/
/******/
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(8138);
	/******/
	/******/
})()
	;

![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Assets

<a name="Assets"></a>

## Assets
Assets manager class.
Used to create, load and cache game assets, which includes textures, audio files, JSON objects, etc.
As a rule of thumb, all methods to load or create assets are async and return a promise.

To access the Assets manager you use `Shaku.assets`.

**Kind**: global class  

* [Assets](#Assets)
    * [new Assets()](#new_Assets_new)
    * [.root](#Assets+root)
    * [.suffix](#Assets+suffix)
    * [.pendingAssets](#Assets+pendingAssets) ⇒ <code>Array.&lt;string&gt;</code>
    * [.failedAssets](#Assets+failedAssets) ⇒ <code>Array.&lt;string&gt;</code>
    * [._wrapUrl(url)](#Assets+_wrapUrl) ⇒ <code>String</code>
    * [.waitForAll()](#Assets+waitForAll) ⇒ <code>Promise</code>
    * [.getCached(url)](#Assets+getCached) ⇒ <code>Asset</code>
    * [.loadSound(url)](#Assets+loadSound) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.loadTexture(url, params)](#Assets+loadTexture) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.createRenderTarget(name, width, height)](#Assets+createRenderTarget) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.loadFontTexture(url, params)](#Assets+loadFontTexture) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.loadJson(url)](#Assets+loadJson) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.createJson(name, data)](#Assets+createJson) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.loadBinary(url)](#Assets+loadBinary) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.createBinary(name, data)](#Assets+createBinary) ⇒ <code>Promise.&lt;Asset&gt;</code>
    * [.free(url)](#Assets+free)
    * [.clearCache()](#Assets+clearCache)

<a name="new_Assets_new"></a>

### new Assets()
Create the manager.

<a name="Assets+root"></a>

### assets.root
Optional URL root to prepend to all loaded assets URLs.
For example, if all your assets are under '/static/assets/', you can set this url as root and omit it when loading assets later.

**Kind**: instance property of [<code>Assets</code>](#Assets)  
<a name="Assets+suffix"></a>

### assets.suffix
Optional suffix to add to all loaded assets URLs.
You can use this for anti-cache mechanism if you want to reload all assets. For example, you can set this value to "'?dt=' + Date.now()".

**Kind**: instance property of [<code>Assets</code>](#Assets)  
<a name="Assets+pendingAssets"></a>

### assets.pendingAssets ⇒ <code>Array.&lt;string&gt;</code>
Get list of assets waiting to be loaded.
This list will be reset if you call clearCache().

**Kind**: instance property of [<code>Assets</code>](#Assets)  
**Returns**: <code>Array.&lt;string&gt;</code> - URLs of assets waiting to be loaded.  
<a name="Assets+failedAssets"></a>

### assets.failedAssets ⇒ <code>Array.&lt;string&gt;</code>
Get list of assets that failed to load.
This list will be reset if you call clearCache().

**Kind**: instance property of [<code>Assets</code>](#Assets)  
**Returns**: <code>Array.&lt;string&gt;</code> - URLs of assets that had error loading.  
<a name="Assets+_wrapUrl"></a>

### assets.\_wrapUrl(url) ⇒ <code>String</code>
Wrap a URL with 'root' and 'suffix'.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>String</code> - Wrapped URL.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Url to wrap. |

<a name="Assets+waitForAll"></a>

### assets.waitForAll() ⇒ <code>Promise</code>
Return a promise that will be resolved only when all pending assets are loaded.
If an asset fails, will reject.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise</code> - Promise to resolve when all assets are loaded, or reject if there are failed assets.  
**Example**  
```js
await Shaku.assets.waitForAll();
console.log("All assets are loaded!");
```
<a name="Assets+getCached"></a>

### assets.getCached(url) ⇒ <code>Asset</code>
Get asset directly from cache, synchronous and without a Promise.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Asset</code> - Asset or null if not loaded.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL or name. |

<a name="Assets+loadSound"></a>

### assets.loadSound(url) ⇒ <code>Promise.&lt;Asset&gt;</code>
Load a sound asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |

**Example**  
```js
let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
```
<a name="Assets+loadTexture"></a>

### assets.loadTexture(url, params) ⇒ <code>Promise.&lt;Asset&gt;</code>
Load a texture asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |
| params | <code>\*</code> | Optional params dictionary. See TextureAsset.load() for more details. |

**Example**  
```js
let texture = await Shaku.assets.loadTexture("assets/my_texture.png", {generateMipMaps: false});
```
<a name="Assets+createRenderTarget"></a>

### assets.createRenderTarget(name, width, height) ⇒ <code>Promise.&lt;Asset&gt;</code>
Create a render target texture asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Asset name (matched to URLs when using cache). If null, will not add to cache. |
| width | <code>Number</code> | Texture width. |
| height | <code>Number</code> | Texture height. |

**Example**  
```js
let width = 512;
let height = 512;
let renderTarget = await Shaku.assets.createRenderTarget("optional_render_target_asset_id", width, height);
```
<a name="Assets+loadFontTexture"></a>

### assets.loadFontTexture(url, params) ⇒ <code>Promise.&lt;Asset&gt;</code>
Load a font texture asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |
| params | <code>\*</code> | Optional params dictionary. See FontTextureAsset.load() for more details. |

**Example**  
```js
let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});
```
<a name="Assets+loadJson"></a>

### assets.loadJson(url) ⇒ <code>Promise.&lt;Asset&gt;</code>
Load a json asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |

**Example**  
```js
let jsonData = await Shaku.assets.loadJson('assets/my_json_data.json');
console.log(jsonData.data);
```
<a name="Assets+createJson"></a>

### assets.createJson(name, data) ⇒ <code>Promise.&lt;Asset&gt;</code>
Create a new json asset. If already exist, will reject promise.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Asset name (matched to URLs when using cache). If null, will not add to cache. |
| data | <code>Object</code> \| <code>String</code> | Optional starting data. |

**Example**  
```js
let jsonData = await Shaku.assets.createJson('optional_json_data_id', {"foo": "bar"});
// you can now load this asset from anywhere in your code using 'optional_json_data_id' as url
```
<a name="Assets+loadBinary"></a>

### assets.loadBinary(url) ⇒ <code>Promise.&lt;Asset&gt;</code>
Load a binary data asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |

**Example**  
```js
let binData = await Shaku.assets.loadBinary('assets/my_bin_data.dat');
console.log(binData.data);
```
<a name="Assets+createBinary"></a>

### assets.createBinary(name, data) ⇒ <code>Promise.&lt;Asset&gt;</code>
Create a new binary asset. If already exist, will reject promise.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: <code>Promise.&lt;Asset&gt;</code> - promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Asset name (matched to URLs when using cache). If null, will not add to cache. |
| data | <code>Array.&lt;Number&gt;</code> \| <code>Uint8Array</code> | Binary data to set. |

**Example**  
```js
let binData = await Shaku.assets.createBinary('optional_bin_data_id', [1,2,3,4]);
// you can now load this asset from anywhere in your code using 'optional_bin_data_id' as url
```
<a name="Assets+free"></a>

### assets.free(url)
Destroy and free asset from cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL to free. |

**Example**  
```js
Shaku.assets.free("my_asset_url");
```
<a name="Assets+clearCache"></a>

### assets.clearCache()
Free all loaded assets from cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Example**  
```js
Shaku.assets.clearCache();
```

![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Shaku

## Classes

<dl>
<dt><a href="#Asset">Asset</a></dt>
<dd><p>A loadable asset base class.
All asset types inherit from this.</p>
</dd>
<dt><a href="#Assets">Assets</a></dt>
<dd><p>Assets manager class.
Used to create, load and cache game assets, which includes textures, audio files, JSON objects, etc.
As a rule of thumb, all methods to load or create assets are async and return a promise.</p>
<p>To access the Assets manager you use <code>Shaku.assets</code>.</p>
</dd>
<dt><a href="#BinaryAsset">BinaryAsset</a></dt>
<dd><p>A loadable binary data asset.
This asset type loads array of bytes from a remote file.</p>
</dd>
<dt><a href="#FontTextureAsset">FontTextureAsset</a></dt>
<dd><p>A font texture asset, dynamically generated from loaded font and canvas.
This asset type creates an atlas of all the font&#39;s characters as textures, so we can later render them as sprites.</p>
</dd>
<dt><a href="#JsonAsset">JsonAsset</a></dt>
<dd><p>A loadable json asset.
This asset type loads JSON from a remote file.</p>
</dd>
<dt><a href="#MsdfFontTextureAsset">MsdfFontTextureAsset</a></dt>
<dd><p>A MSDF font texture asset, from a pregenerated msdf texture atlas (from msdf-bmfont-xml, for example).
This asset uses a signed distance field atlas to render characters as sprites at high res.</p>
</dd>
<dt><a href="#SoundAsset">SoundAsset</a></dt>
<dd><p>A loadable sound asset.
This is the asset type you use to play sounds.</p>
</dd>
<dt><a href="#TextureAsset">TextureAsset</a></dt>
<dd><p>A loadable texture asset.
This asset type loads an image from URL or source, and turn it into a texture.</p>
</dd>
<dt><a href="#Collision">Collision</a></dt>
<dd><p>Collision is the collision manager. 
It provides basic 2d collision detection functionality.
Note: this is <em>not</em> a physics engine, its only for detection and objects picking.</p>
<p>To access the Collision manager you use <code>Shaku.collision</code>.</p>
</dd>
<dt><a href="#CollisionWorld">CollisionWorld</a></dt>
<dd><p>A collision world is a set of collision shapes that interact with each other.
You can use different collision worlds to represent different levels or different parts of your game world.</p>
</dd>
<dt><a href="#CollisionResolver">CollisionResolver</a></dt>
<dd><p>The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.</p>
</dd>
<dt><a href="#CollisionTestResult">CollisionTestResult</a></dt>
<dd><p>Collision detection result.</p>
</dd>
<dt><a href="#CircleShape">CircleShape</a></dt>
<dd><p>Collision circle class.</p>
</dd>
<dt><a href="#LinesShape">LinesShape</a></dt>
<dd><p>Collision lines class.
This shape is made of one line or more.</p>
</dd>
<dt><a href="#PointShape">PointShape</a></dt>
<dd><p>Collision point class.</p>
</dd>
<dt><a href="#RectangleShape">RectangleShape</a></dt>
<dd><p>Collision rectangle class.</p>
</dd>
<dt><a href="#CollisionShape">CollisionShape</a></dt>
<dd><p>Collision shape base class.</p>
</dd>
<dt><a href="#TilemapShape">TilemapShape</a></dt>
<dd><p>Collision tilemap class.
A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.</p>
</dd>
<dt><a href="#Camera">Camera</a></dt>
<dd><p>Implements a Camera object.</p>
</dd>
<dt><a href="#BasicEffect">BasicEffect</a></dt>
<dd><p>Default basic effect to draw 2d sprites.</p>
</dd>
<dt><a href="#Effect">Effect</a></dt>
<dd><p>Effect base class.
An effect = vertex shader + fragment shader + uniforms &amp; attributes + setup code.</p>
</dd>
<dt><a href="#MsdfFontEffect">MsdfFontEffect</a></dt>
<dd><p>Default effect to draw MSDF font textures.</p>
</dd>
<dt><a href="#Gfx">Gfx</a></dt>
<dd><p>Gfx is the graphics manager. 
Everything related to rendering and managing your game canvas goes here.</p>
<p>To access the Graphics manager you use <code>Shaku.gfx</code>.</p>
</dd>
<dt><a href="#Matrix">Matrix</a></dt>
<dd><p>Implements a matrix.</p>
</dd>
<dt><a href="#Mesh">Mesh</a></dt>
<dd><p>Class to hold a mesh.</p>
</dd>
<dt><a href="#Sprite">Sprite</a></dt>
<dd><p>Sprite class.
This object is a helper class to hold all the properties of a texture to render.</p>
</dd>
<dt><a href="#SpriteBatch">SpriteBatch</a></dt>
<dd><p>Sprite batch renderer, responsible on drawing a batch of sprites with as little draw calls as possible.</p>
</dd>
<dt><a href="#SpritesGroup">SpritesGroup</a></dt>
<dd><p>Sprites group class.
This object is a container to hold sprites collection + parent transformations.
You need SpritesGroup to use batched rendering.</p>
</dd>
<dt><a href="#Vertex">Vertex</a></dt>
<dd><p>A vertex we can push to sprite batch.</p>
</dd>
<dt><a href="#Input">Input</a></dt>
<dd><p>Input manager. 
Used to recieve input from keyboard and mouse.</p>
<p>To access the Input manager use <code>Shaku.input</code>.</p>
</dd>
<dt><a href="#Logger">Logger</a></dt>
<dd><p>A logger manager.
By default writes logs to console.</p>
</dd>
<dt><a href="#IManager">IManager</a></dt>
<dd><p>Interface for any manager.
Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.</p>
</dd>
<dt><a href="#Sfx">Sfx</a></dt>
<dd><p>Sfx manager. 
Used to play sound effects and music.</p>
<p>To access the Sfx manager use <code>Shaku.sfx</code>.</p>
</dd>
<dt><a href="#SoundInstance">SoundInstance</a></dt>
<dd><p>A sound effect instance you can play and stop.</p>
</dd>
<dt><a href="#SoundMixer">SoundMixer</a></dt>
<dd><p>A utility class to mix between two sounds.</p>
</dd>
<dt><a href="#Shaku">Shaku</a></dt>
<dd><p>Shaku&#39;s main object.
This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.</p>
</dd>
<dt><a href="#Animator">Animator</a></dt>
<dd><p>Implement an animator object that change values over time using Linear Interpolation.
Usage example:
(new Animator(sprite)).from({&#39;position.x&#39;: 0}).to({&#39;position.x&#39;: 100}).duration(1).play();</p>
</dd>
<dt><a href="#Circle">Circle</a></dt>
<dd><p>Implement a simple 2d Circle.</p>
</dd>
<dt><a href="#Color">Color</a></dt>
<dd><p>Implement a color.
All color components are expected to be in 0.0 - 1.0 range (and not 0-255).</p>
</dd>
<dt><a href="#GameTime">GameTime</a></dt>
<dd><p>Class to hold current game time (elapse and deltatime).</p>
</dd>
<dt><a href="#Line">Line</a></dt>
<dd><p>Implement a simple 2d Line.</p>
</dd>
<dt><a href="#MathHelper">MathHelper</a></dt>
<dd><p>Implement some math utilities functions.</p>
</dd>
<dt><a href="#IGrid">IGrid</a></dt>
<dd><p>Interface for a supported grid.</p>
</dd>
<dt><a href="#Node">Node</a></dt>
<dd><p>A path node.</p>
</dd>
<dt><a href="#Perlin">Perlin</a></dt>
<dd><p>Generate 2d perlin noise.
Based on code from noisejs by Stefan Gustavson.
<a href="https://github.com/josephg/noisejs/blob/master/perlin.js">https://github.com/josephg/noisejs/blob/master/perlin.js</a></p>
</dd>
<dt><a href="#Rectangle">Rectangle</a></dt>
<dd><p>Implement a simple 2d Rectangle.</p>
</dd>
<dt><a href="#SeededRandom">SeededRandom</a></dt>
<dd><p>Class to generate random numbers with seed.</p>
</dd>
<dt><a href="#Storage">Storage</a></dt>
<dd><p>A thin wrapper layer around storage utility.</p>
</dd>
<dt><a href="#StorageAdapter">StorageAdapter</a></dt>
<dd><p>Storage adapter class that implement access to a storage device.
Used by the Storage utilitiy.</p>
</dd>
<dt><a href="#StorageAdapterMemory">StorageAdapterMemory</a></dt>
<dd><p>Implement simple memory storage adapter.</p>
</dd>
<dt><a href="#StorageAdapterLocalStorage">StorageAdapterLocalStorage</a></dt>
<dd><p>Implement simple localstorage storage adapter.</p>
</dd>
<dt><a href="#StorageAdapterSessionStorage">StorageAdapterSessionStorage</a></dt>
<dd><p>Implement simple sessionStorage storage adapter.</p>
</dd>
<dt><a href="#Transformation">Transformation</a></dt>
<dd><p>Transformations helper class to store 2d position, rotation and scale.
Can also perform transformations inheritance, where we combine local with parent transformations.</p>
</dd>
<dt><a href="#Vector2">Vector2</a></dt>
<dd><p>A simple Vector object for 2d positions.</p>
</dd>
<dt><a href="#Vector3">Vector3</a></dt>
<dd><p>A Vector object for 3d positions.</p>
</dd>
</dl>

<a name="Asset"></a>

## Asset
A loadable asset base class.
All asset types inherit from this.

**Kind**: global class  

* [Asset](#Asset)
    * [new Asset(url)](#new_Asset_new)
    * [.url](#Asset+url) ⇒ <code>String</code>
    * [.valid](#Asset+valid) ⇒ <code>Boolean</code>
    * [.onReady(callback)](#Asset+onReady)
    * [.waitForReady()](#Asset+waitForReady) ⇒ <code>Promise</code>
    * [.load(params)](#Asset+load) ⇒ <code>Promise</code>
    * [.create(source, params)](#Asset+create) ⇒ <code>Promise</code>
    * [.destroy()](#Asset+destroy)

<a name="new_Asset_new"></a>

### new Asset(url)
Create the new asset.


| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL / identifier. |

<a name="Asset+url"></a>

### asset.url ⇒ <code>String</code>
Get asset's URL.

**Kind**: instance property of [<code>Asset</code>](#Asset)  
**Returns**: <code>String</code> - Asset URL.  
<a name="Asset+valid"></a>

### asset.valid ⇒ <code>Boolean</code>
Get if this asset is loaded and valid.

**Kind**: instance property of [<code>Asset</code>](#Asset)  
**Returns**: <code>Boolean</code> - True if asset is loaded and valid, false otherwise.  
<a name="Asset+onReady"></a>

### asset.onReady(callback)
Register a method to be called when asset is ready.
If asset is already in ready state, will invoke immediately.

**Kind**: instance method of [<code>Asset</code>](#Asset)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback to invoke when asset is ready. |

<a name="Asset+waitForReady"></a>

### asset.waitForReady() ⇒ <code>Promise</code>
Return a promise to resolve when ready.

**Kind**: instance method of [<code>Asset</code>](#Asset)  
**Returns**: <code>Promise</code> - Promise to resolve when ready.  
<a name="Asset+load"></a>

### asset.load(params) ⇒ <code>Promise</code>
Load the asset from it's URL.

**Kind**: instance method of [<code>Asset</code>](#Asset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>\*</code> | Optional additional params. |

<a name="Asset+create"></a>

### asset.create(source, params) ⇒ <code>Promise</code>
Create the asset from data source.

**Kind**: instance method of [<code>Asset</code>](#Asset)  
**Returns**: <code>Promise</code> - Promise to resolve when asset is ready.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>\*</code> | Data to create asset from. |
| params | <code>\*</code> | Optional additional params. |

<a name="Asset+destroy"></a>

### asset.destroy()
Destroy the asset, freeing any allocated resources in the process.

**Kind**: instance method of [<code>Asset</code>](#Asset)  
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
    * [.getCached(url)](#Assets+getCached) ⇒ [<code>Asset</code>](#Asset)
    * [.loadSound(url)](#Assets+loadSound) ⇒ [<code>Promise.&lt;SoundAsset&gt;</code>](#SoundAsset)
    * [.loadTexture(url, [params])](#Assets+loadTexture) ⇒ [<code>Promise.&lt;TextureAsset&gt;</code>](#TextureAsset)
    * [.createRenderTarget(name, width, height, channels)](#Assets+createRenderTarget) ⇒ [<code>Promise.&lt;TextureAsset&gt;</code>](#TextureAsset)
    * [.loadFontTexture(url, params)](#Assets+loadFontTexture) ⇒ [<code>Promise.&lt;FontTextureAsset&gt;</code>](#FontTextureAsset)
    * [.loadMsdfFontTexture(url, [params])](#Assets+loadMsdfFontTexture) ⇒ [<code>Promise.&lt;MsdfFontTextureAsset&gt;</code>](#MsdfFontTextureAsset)
    * [.loadJson(url)](#Assets+loadJson) ⇒ [<code>Promise.&lt;JsonAsset&gt;</code>](#JsonAsset)
    * [.createJson(name, data)](#Assets+createJson) ⇒ [<code>Promise.&lt;JsonAsset&gt;</code>](#JsonAsset)
    * [.loadBinary(url)](#Assets+loadBinary) ⇒ [<code>Promise.&lt;BinaryAsset&gt;</code>](#BinaryAsset)
    * [.createBinary(name, data)](#Assets+createBinary) ⇒ [<code>Promise.&lt;BinaryAsset&gt;</code>](#BinaryAsset)
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

### assets.getCached(url) ⇒ [<code>Asset</code>](#Asset)
Get asset directly from cache, synchronous and without a Promise.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Asset</code>](#Asset) - Asset or null if not loaded.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL or name. |

<a name="Assets+loadSound"></a>

### assets.loadSound(url) ⇒ [<code>Promise.&lt;SoundAsset&gt;</code>](#SoundAsset)
Load a sound asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;SoundAsset&gt;</code>](#SoundAsset) - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |

**Example**  
```js
let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
```
<a name="Assets+loadTexture"></a>

### assets.loadTexture(url, [params]) ⇒ [<code>Promise.&lt;TextureAsset&gt;</code>](#TextureAsset)
Load a texture asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;TextureAsset&gt;</code>](#TextureAsset) - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |
| [params] | <code>\*</code> | Optional params dictionary. See TextureAsset.load() for more details. |

**Example**  
```js
let texture = await Shaku.assets.loadTexture("assets/my_texture.png", {generateMipMaps: false});
```
<a name="Assets+createRenderTarget"></a>

### assets.createRenderTarget(name, width, height, channels) ⇒ [<code>Promise.&lt;TextureAsset&gt;</code>](#TextureAsset)
Create a render target texture asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;TextureAsset&gt;</code>](#TextureAsset) - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Asset name (matched to URLs when using cache). If null, will not add to cache. |
| width | <code>Number</code> | Texture width. |
| height | <code>Number</code> | Texture height. |
| channels | <code>Number</code> | Texture channels count. Defaults to 4 (RGBA). |

**Example**  
```js
let width = 512;
let height = 512;
let renderTarget = await Shaku.assets.createRenderTarget("optional_render_target_asset_id", width, height);
```
<a name="Assets+loadFontTexture"></a>

### assets.loadFontTexture(url, params) ⇒ [<code>Promise.&lt;FontTextureAsset&gt;</code>](#FontTextureAsset)
Load a font texture asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;FontTextureAsset&gt;</code>](#FontTextureAsset) - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |
| params | <code>\*</code> | Optional params dictionary. See FontTextureAsset.load() for more details. |

**Example**  
```js
let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});
```
<a name="Assets+loadMsdfFontTexture"></a>

### assets.loadMsdfFontTexture(url, [params]) ⇒ [<code>Promise.&lt;MsdfFontTextureAsset&gt;</code>](#MsdfFontTextureAsset)
Load a MSDF font texture asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;MsdfFontTextureAsset&gt;</code>](#MsdfFontTextureAsset) - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |
| [params] | <code>\*</code> | Optional params dictionary. See MsdfFontTextureAsset.load() for more details. |

**Example**  
```js
let fontTexture = await Shaku.assets.loadMsdfFontTexture('DejaVuSansMono.font', {jsonUrl: 'assets/DejaVuSansMono.json', textureUrl: 'assets/DejaVuSansMono.png'});
```
<a name="Assets+loadJson"></a>

### assets.loadJson(url) ⇒ [<code>Promise.&lt;JsonAsset&gt;</code>](#JsonAsset)
Load a json asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;JsonAsset&gt;</code>](#JsonAsset) - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |

**Example**  
```js
let jsonData = await Shaku.assets.loadJson('assets/my_json_data.json');
console.log(jsonData.data);
```
<a name="Assets+createJson"></a>

### assets.createJson(name, data) ⇒ [<code>Promise.&lt;JsonAsset&gt;</code>](#JsonAsset)
Create a new json asset. If already exist, will reject promise.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;JsonAsset&gt;</code>](#JsonAsset) - promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.  

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

### assets.loadBinary(url) ⇒ [<code>Promise.&lt;BinaryAsset&gt;</code>](#BinaryAsset)
Load a binary data asset. If already loaded, will use cache.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;BinaryAsset&gt;</code>](#BinaryAsset) - promise to resolve with asset instance, when loaded. You can access the loading asset with `.asset` on the promise.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | Asset URL. |

**Example**  
```js
let binData = await Shaku.assets.loadBinary('assets/my_bin_data.dat');
console.log(binData.data);
```
<a name="Assets+createBinary"></a>

### assets.createBinary(name, data) ⇒ [<code>Promise.&lt;BinaryAsset&gt;</code>](#BinaryAsset)
Create a new binary asset. If already exist, will reject promise.

**Kind**: instance method of [<code>Assets</code>](#Assets)  
**Returns**: [<code>Promise.&lt;BinaryAsset&gt;</code>](#BinaryAsset) - promise to resolve with asset instance, when ready. You can access the loading asset with `.asset` on the promise.  

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
<a name="BinaryAsset"></a>

## BinaryAsset
A loadable binary data asset.
This asset type loads array of bytes from a remote file.

**Kind**: global class  

* [BinaryAsset](#BinaryAsset)
    * [.valid](#BinaryAsset+valid)
    * [.data](#BinaryAsset+data) ⇒ <code>Uint8Array</code>
    * [.load()](#BinaryAsset+load) ⇒ <code>Promise</code>
    * [.create(source)](#BinaryAsset+create) ⇒ <code>Promise</code>
    * [.destroy()](#BinaryAsset+destroy)
    * [.string()](#BinaryAsset+string) ⇒ <code>String</code>

<a name="BinaryAsset+valid"></a>

### binaryAsset.valid
**Kind**: instance property of [<code>BinaryAsset</code>](#BinaryAsset)  
<a name="BinaryAsset+data"></a>

### binaryAsset.data ⇒ <code>Uint8Array</code>
Get binary data.

**Kind**: instance property of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>Uint8Array</code> - Data as bytes array.  
<a name="BinaryAsset+load"></a>

### binaryAsset.load() ⇒ <code>Promise</code>
Load the binary data from the asset URL.

**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  
<a name="BinaryAsset+create"></a>

### binaryAsset.create(source) ⇒ <code>Promise</code>
Create the binary data asset from array or Uint8Array.

**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when asset is ready.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Array.&lt;Number&gt;</code> \| <code>Uint8Array</code> | Data to create asset from. |

<a name="BinaryAsset+destroy"></a>

### binaryAsset.destroy()
**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
<a name="BinaryAsset+string"></a>

### binaryAsset.string() ⇒ <code>String</code>
Convert and return data as string.

**Kind**: instance method of [<code>BinaryAsset</code>](#BinaryAsset)  
**Returns**: <code>String</code> - Data converted to string.  
<a name="FontTextureAsset"></a>

## FontTextureAsset
A font texture asset, dynamically generated from loaded font and canvas.
This asset type creates an atlas of all the font's characters as textures, so we can later render them as sprites.

**Kind**: global class  

* [FontTextureAsset](#FontTextureAsset)
    * [.lineHeight](#FontTextureAsset+lineHeight)
    * [.fontName](#FontTextureAsset+fontName)
    * [.fontSize](#FontTextureAsset+fontSize)
    * [.placeholderCharacter](#FontTextureAsset+placeholderCharacter)
    * [.texture](#FontTextureAsset+texture)
    * [.valid](#FontTextureAsset+valid)
    * [.load(params)](#FontTextureAsset+load) ⇒ <code>Promise</code>
    * [.getSourceRect(character)](#FontTextureAsset+getSourceRect) ⇒ [<code>Rectangle</code>](#Rectangle)
    * [.getPositionOffset(character)](#FontTextureAsset+getPositionOffset) ⇒ [<code>Vector2</code>](#Vector2)
    * [.getXAdvance(character)](#FontTextureAsset+getXAdvance) ⇒ <code>Number</code>
    * [.destroy()](#FontTextureAsset+destroy)

<a name="FontTextureAsset+lineHeight"></a>

### fontTextureAsset.lineHeight
Get line height.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+fontName"></a>

### fontTextureAsset.fontName
Get font name.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+fontSize"></a>

### fontTextureAsset.fontSize
Get font size.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+placeholderCharacter"></a>

### fontTextureAsset.placeholderCharacter
Get placeholder character.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+texture"></a>

### fontTextureAsset.texture
Get the texture.

**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+valid"></a>

### fontTextureAsset.valid
**Kind**: instance property of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="FontTextureAsset+load"></a>

### fontTextureAsset.load(params) ⇒ <code>Promise</code>
Generate the font texture from a font found in given URL.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>\*</code> | Additional params. Possible values are:                      - fontName: mandatory font name. on some browsers if the font name does not match the font you actually load via the URL, it will not be loaded properly.                      - missingCharPlaceholder (default='?'): character to use for missing characters.                      - smoothFont (default=true): if true, will set font to smooth mode.                      - fontSize (default=52): font size in texture. larget font size will take more memory, but allow for sharper text rendering in larger scales.                      - enforceTexturePowerOfTwo (default=true): if true, will force texture size to be power of two.                      - maxTextureWidth (default=1024): max texture width.                      - charactersSet (default=FontTextureAsset.defaultCharactersSet): which characters to set in the texture.                      - extraPadding (default=0,0): Optional extra padding to add around characters in texture. |

<a name="FontTextureAsset+getSourceRect"></a>

### fontTextureAsset.getSourceRect(character) ⇒ [<code>Rectangle</code>](#Rectangle)
Get the source rectangle for a given character in texture.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - Source rectangle for character.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>Character</code> | Character to get source rect for. |

<a name="FontTextureAsset+getPositionOffset"></a>

### fontTextureAsset.getPositionOffset(character) ⇒ [<code>Vector2</code>](#Vector2)
When drawing the character, get the offset to add to the cursor.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: [<code>Vector2</code>](#Vector2) - Offset to add to the cursor before drawing the character.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>Character</code> | Character to get the offset for. |

<a name="FontTextureAsset+getXAdvance"></a>

### fontTextureAsset.getXAdvance(character) ⇒ <code>Number</code>
Get how much to advance the cursor when drawing this character.

**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
**Returns**: <code>Number</code> - Distance to move the cursor after drawing the character.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>Character</code> | Character to get the advance for. |

<a name="FontTextureAsset+destroy"></a>

### fontTextureAsset.destroy()
**Kind**: instance method of [<code>FontTextureAsset</code>](#FontTextureAsset)  
<a name="JsonAsset"></a>

## JsonAsset
A loadable json asset.
This asset type loads JSON from a remote file.

**Kind**: global class  

* [JsonAsset](#JsonAsset)
    * [.data](#JsonAsset+data) ⇒ <code>\*</code>
    * [.valid](#JsonAsset+valid)
    * [.load()](#JsonAsset+load) ⇒ <code>Promise</code>
    * [.create(source)](#JsonAsset+create) ⇒ <code>Promise</code>
    * [.destroy()](#JsonAsset+destroy)

<a name="JsonAsset+data"></a>

### jsonAsset.data ⇒ <code>\*</code>
Get json data.

**Kind**: instance property of [<code>JsonAsset</code>](#JsonAsset)  
**Returns**: <code>\*</code> - Data as dictionary.  
<a name="JsonAsset+valid"></a>

### jsonAsset.valid
**Kind**: instance property of [<code>JsonAsset</code>](#JsonAsset)  
<a name="JsonAsset+load"></a>

### jsonAsset.load() ⇒ <code>Promise</code>
Load the JSON data from the asset URL.

**Kind**: instance method of [<code>JsonAsset</code>](#JsonAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  
<a name="JsonAsset+create"></a>

### jsonAsset.create(source) ⇒ <code>Promise</code>
Create the JSON data asset from object or string.

**Kind**: instance method of [<code>JsonAsset</code>](#JsonAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when asset is ready.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Object</code> \| <code>String</code> | Data to create asset from. |

<a name="JsonAsset+destroy"></a>

### jsonAsset.destroy()
**Kind**: instance method of [<code>JsonAsset</code>](#JsonAsset)  
<a name="MsdfFontTextureAsset"></a>

## MsdfFontTextureAsset
A MSDF font texture asset, from a pregenerated msdf texture atlas (from msdf-bmfont-xml, for example).
This asset uses a signed distance field atlas to render characters as sprites at high res.

**Kind**: global class  

* [MsdfFontTextureAsset](#MsdfFontTextureAsset)
    * [.load(params)](#MsdfFontTextureAsset+load) ⇒ <code>Promise</code>
    * [.getPositionOffset()](#MsdfFontTextureAsset+getPositionOffset)
    * [.getXAdvance()](#MsdfFontTextureAsset+getXAdvance)
    * [.destroy()](#MsdfFontTextureAsset+destroy)

<a name="MsdfFontTextureAsset+load"></a>

### msdfFontTextureAsset.load(params) ⇒ <code>Promise</code>
Generate the font metadata and texture from the given URL.

**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>\*</code> | Additional params. Possible values are:                      - jsonUrl: mandatory url for the font's json metadata (generated via msdf-bmfont-xml, for example)                      - textureUrl: mandatory url for the font's texture atlas (generated via msdf-bmfont-xml, for example)                      - missingCharPlaceholder (default='?'): character to use for missing characters. |

<a name="MsdfFontTextureAsset+getPositionOffset"></a>

### msdfFontTextureAsset.getPositionOffset()
**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
<a name="MsdfFontTextureAsset+getXAdvance"></a>

### msdfFontTextureAsset.getXAdvance()
**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
<a name="MsdfFontTextureAsset+destroy"></a>

### msdfFontTextureAsset.destroy()
**Kind**: instance method of [<code>MsdfFontTextureAsset</code>](#MsdfFontTextureAsset)  
<a name="SoundAsset"></a>

## SoundAsset
A loadable sound asset.
This is the asset type you use to play sounds.

**Kind**: global class  

* [SoundAsset](#SoundAsset)
    * [.valid](#SoundAsset+valid)
    * [.load()](#SoundAsset+load) ⇒ <code>Promise</code>
    * [.destroy()](#SoundAsset+destroy)

<a name="SoundAsset+valid"></a>

### soundAsset.valid
**Kind**: instance property of [<code>SoundAsset</code>](#SoundAsset)  
<a name="SoundAsset+load"></a>

### soundAsset.load() ⇒ <code>Promise</code>
Load the sound asset from its URL.
Note that loading sounds isn't actually necessary to play sounds, this method merely pre-load the asset (so first time we play
the sound would be immediate and not delayed) and validate the data is valid.

**Kind**: instance method of [<code>SoundAsset</code>](#SoundAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  
<a name="SoundAsset+destroy"></a>

### soundAsset.destroy()
**Kind**: instance method of [<code>SoundAsset</code>](#SoundAsset)  
<a name="TextureAsset"></a>

## TextureAsset
A loadable texture asset.
This asset type loads an image from URL or source, and turn it into a texture.

**Kind**: global class  

* [TextureAsset](#TextureAsset)
    * [.filter](#TextureAsset+filter)
    * [.filter](#TextureAsset+filter)
    * [.wrapMode](#TextureAsset+wrapMode)
    * [.wrapMode](#TextureAsset+wrapMode)
    * [.image](#TextureAsset+image) ⇒ <code>Image</code>
    * [.width](#TextureAsset+width) ⇒ <code>Number</code>
    * [.height](#TextureAsset+height) ⇒ <code>Number</code>
    * [.size](#TextureAsset+size) ⇒ [<code>Vector2</code>](#Vector2)
    * [.texture](#TextureAsset+texture)
    * [.valid](#TextureAsset+valid)
    * [.load(params)](#TextureAsset+load) ⇒ <code>Promise</code>
    * [.createRenderTarget(width, height, channels)](#TextureAsset+createRenderTarget)
    * [.fromImage(image, params)](#TextureAsset+fromImage)
    * [.create(source, params)](#TextureAsset+create) ⇒ <code>Promise</code>
    * [.getPixel(x, y)](#TextureAsset+getPixel) ⇒ [<code>Color</code>](#Color)
    * [.destroy()](#TextureAsset+destroy)

<a name="TextureAsset+filter"></a>

### textureAsset.filter
Get texture magnifying filter, or null to use default.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**See**: Shaku.gfx.TextureFilterModes  
<a name="TextureAsset+filter"></a>

### textureAsset.filter
Set texture magnifying filter.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**See**: Shaku.gfx.TextureFilterModes  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TextureFilterModes</code> | Filter mode to use or null to use default. |

<a name="TextureAsset+wrapMode"></a>

### textureAsset.wrapMode
Get texture wrapping mode, or null to use default.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**See**: Shaku.gfx.TextureWrapModes  
<a name="TextureAsset+wrapMode"></a>

### textureAsset.wrapMode
Set texture wrapping mode.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**See**: Shaku.gfx.TextureWrapModes  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TextureWrapModes</code> | Wrapping mode to use or null to use default. |

<a name="TextureAsset+image"></a>

### textureAsset.image ⇒ <code>Image</code>
Get raw image.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Image</code> - Image instance.  
<a name="TextureAsset+width"></a>

### textureAsset.width ⇒ <code>Number</code>
Get texture width.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Number</code> - Texture width.  
<a name="TextureAsset+height"></a>

### textureAsset.height ⇒ <code>Number</code>
Get texture height.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Number</code> - Texture height.  
<a name="TextureAsset+size"></a>

### textureAsset.size ⇒ [<code>Vector2</code>](#Vector2)
Get texture size as a vector.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: [<code>Vector2</code>](#Vector2) - Texture size.  
<a name="TextureAsset+texture"></a>

### textureAsset.texture
Get texture instance for WebGL.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
<a name="TextureAsset+valid"></a>

### textureAsset.valid
**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
<a name="TextureAsset+load"></a>

### textureAsset.load(params) ⇒ <code>Promise</code>
Load the texture from it's image URL.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when fully loaded.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>\*</code> | Optional additional params. Possible values are:                      - generateMipMaps (default=false): should we generate mipmaps for this texture?                      - crossOrigin (default=undefined): if set, will set the crossOrigin property with this value. |

<a name="TextureAsset+createRenderTarget"></a>

### textureAsset.createRenderTarget(width, height, channels)
Create this texture as an empty render target.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | Texture width. |
| height | <code>Number</code> | Texture height. |
| channels | <code>Number</code> | Texture channels count. Defaults to 4 (RGBA). |

<a name="TextureAsset+fromImage"></a>

### textureAsset.fromImage(image, params)
Create texture from loaded image instance.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
**See**: TextureAsset.load for params.  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> | Image to create texture from. Image must be loaded! |
| params | <code>\*</code> | Optional additional params. See load() for details. |

<a name="TextureAsset+create"></a>

### textureAsset.create(source, params) ⇒ <code>Promise</code>
Create the texture from an image.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Promise</code> - Promise to resolve when asset is ready.  
**See**: TextureAsset.load for params.  

| Param | Type | Description |
| --- | --- | --- |
| source | <code>Image</code> \| <code>String</code> | Image or Image source URL to create texture from. |
| params | <code>\*</code> | Optional additional params. See load() for details. |

<a name="TextureAsset+getPixel"></a>

### textureAsset.getPixel(x, y) ⇒ [<code>Color</code>](#Color)
Get pixel color from image.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: [<code>Color</code>](#Color) - Pixel color.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Pixel X value. |
| y | <code>Number</code> | Pixel Y value. |

<a name="TextureAsset+destroy"></a>

### textureAsset.destroy()
**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
<a name="Collision"></a>

## Collision
Collision is the collision manager. 
It provides basic 2d collision detection functionality.
Note: this is *not* a physics engine, its only for detection and objects picking.

To access the Collision manager you use `Shaku.collision`.

**Kind**: global class  

* [Collision](#Collision)
    * [new Collision()](#new_Collision_new)
    * [.resolver](#Collision+resolver)
    * [.RectangleShape](#Collision+RectangleShape)
    * [.PointShape](#Collision+PointShape)
    * [.CircleShape](#Collision+CircleShape)
    * [.LinesShape](#Collision+LinesShape)
    * [.TilemapShape](#Collision+TilemapShape)
    * [.createWorld(gridCellSize)](#Collision+createWorld) ⇒ [<code>CollisionWorld</code>](#CollisionWorld)

<a name="new_Collision_new"></a>

### new Collision()
Create the manager.

<a name="Collision+resolver"></a>

### collision.resolver
The collision resolver we use to detect collision between different shapes. 
You can use this object directly without creating a collision world, if you just need to test collision between shapes.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+RectangleShape"></a>

### collision.RectangleShape
Get the collision reactanle shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+PointShape"></a>

### collision.PointShape
Get the collision point shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+CircleShape"></a>

### collision.CircleShape
Get the collision circle shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+LinesShape"></a>

### collision.LinesShape
Get the collision lines shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+TilemapShape"></a>

### collision.TilemapShape
Get the tilemap collision shape class.

**Kind**: instance property of [<code>Collision</code>](#Collision)  
<a name="Collision+createWorld"></a>

### collision.createWorld(gridCellSize) ⇒ [<code>CollisionWorld</code>](#CollisionWorld)
Create a new collision world object.

**Kind**: instance method of [<code>Collision</code>](#Collision)  
**Returns**: [<code>CollisionWorld</code>](#CollisionWorld) - Newly created collision world.  

| Param | Type | Description |
| --- | --- | --- |
| gridCellSize | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Collision world grid cell size. |

<a name="CollisionWorld"></a>

## CollisionWorld
A collision world is a set of collision shapes that interact with each other.
You can use different collision worlds to represent different levels or different parts of your game world.

**Kind**: global class  

* [CollisionWorld](#CollisionWorld)
    * [new CollisionWorld(resolver, gridCellSize)](#new_CollisionWorld_new)
    * [.resolver](#CollisionWorld+resolver)
    * [.iterateShapes(callback)](#CollisionWorld+iterateShapes)
    * [.addShape(shape)](#CollisionWorld+addShape)
    * [.removeShape(shape)](#CollisionWorld+removeShape)
    * [.testCollision(sourceShape, sortByDistance, mask, predicate)](#CollisionWorld+testCollision) ⇒ [<code>CollisionTestResult</code>](#CollisionTestResult)
    * [.testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor)](#CollisionWorld+testCollisionMany) ⇒ [<code>Array.&lt;CollisionTestResult&gt;</code>](#CollisionTestResult)
    * [.pick(position, radius, sortByDistance, mask, predicate)](#CollisionWorld+pick) ⇒ [<code>Array.&lt;CollisionShape&gt;</code>](#CollisionShape)
    * [.debugDraw(gridColor, gridHighlitColor, opacity, camera)](#CollisionWorld+debugDraw)

<a name="new_CollisionWorld_new"></a>

### new CollisionWorld(resolver, gridCellSize)
Create the collision world.


| Param | Type | Description |
| --- | --- | --- |
| resolver | [<code>CollisionResolver</code>](#CollisionResolver) | Collision resolver to use for this world. |
| gridCellSize | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | For optimize collision testing, the collision world is divided into a collision grid. This param determine the grid cell size. |

<a name="CollisionWorld+resolver"></a>

### collisionWorld.resolver
Collision resolver used in this collision world.
By default, will inherit the collision manager default resolver.

**Kind**: instance property of [<code>CollisionWorld</code>](#CollisionWorld)  
<a name="CollisionWorld+iterateShapes"></a>

### collisionWorld.iterateShapes(callback)
Iterate all shapes in world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback to invoke on all shapes. Return false to break iteration. |

<a name="CollisionWorld+addShape"></a>

### collisionWorld.addShape(shape)
Add a collision shape to this world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| shape | [<code>CollisionShape</code>](#CollisionShape) | Shape to add. |

<a name="CollisionWorld+removeShape"></a>

### collisionWorld.removeShape(shape)
Remove a collision shape from this world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| shape | [<code>CollisionShape</code>](#CollisionShape) | Shape to remove. |

<a name="CollisionWorld+testCollision"></a>

### collisionWorld.testCollision(sourceShape, sortByDistance, mask, predicate) ⇒ [<code>CollisionTestResult</code>](#CollisionTestResult)
Test collision with shapes in world, and return just the first result found.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: [<code>CollisionTestResult</code>](#CollisionTestResult) - A collision test result, or null if not found.  

| Param | Type | Description |
| --- | --- | --- |
| sourceShape | [<code>CollisionShape</code>](#CollisionShape) | Source shape to check collision for. If shape is in world, it will not collide with itself. |
| sortByDistance | <code>Boolean</code> | If true will return the nearest collision found (based on center of shapes). |
| mask | <code>Number</code> | Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit. |
| predicate | <code>function</code> | Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape. |

<a name="CollisionWorld+testCollisionMany"></a>

### collisionWorld.testCollisionMany(sourceShape, sortByDistance, mask, predicate, intermediateProcessor) ⇒ [<code>Array.&lt;CollisionTestResult&gt;</code>](#CollisionTestResult)
Test collision with shapes in world, and return all results found.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: [<code>Array.&lt;CollisionTestResult&gt;</code>](#CollisionTestResult) - An array of collision test results, or empty array if none found.  

| Param | Type | Description |
| --- | --- | --- |
| sourceShape | [<code>CollisionShape</code>](#CollisionShape) | Source shape to check collision for. If shape is in world, it will not collide with itself. |
| sortByDistance | <code>Boolean</code> | If true will sort results by distance. |
| mask | <code>Number</code> | Optional mask of bits to match against shapes collisionFlags. Will only return shapes that have at least one common bit. |
| predicate | <code>function</code> | Optional filter to run on any shape we're about to test collision with. If the predicate returns false, we will skip this shape. |
| intermediateProcessor | <code>function</code> | Optional method to run after each positive result with the collision result as param. Return false to stop and return results. |

<a name="CollisionWorld+pick"></a>

### collisionWorld.pick(position, radius, sortByDistance, mask, predicate) ⇒ [<code>Array.&lt;CollisionShape&gt;</code>](#CollisionShape)
Return array of shapes that touch a given position, with optional radius.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  
**Returns**: [<code>Array.&lt;CollisionShape&gt;</code>](#CollisionShape) - Array with collision shapes we picked.  

| Param | Type | Description |
| --- | --- | --- |
| position | <code>\*</code> | Position to pick. |
| radius | <code>\*</code> | Optional picking radius to use a circle instead of a point. |
| sortByDistance | <code>\*</code> | If true, will sort results by distance from point. |
| mask | <code>\*</code> | Collision mask to filter by. |
| predicate | <code>\*</code> | Optional predicate method to filter by. |

**Example**  
```js
let shapes = world.pick(Shaku.input.mousePosition);
```
<a name="CollisionWorld+debugDraw"></a>

### collisionWorld.debugDraw(gridColor, gridHighlitColor, opacity, camera)
Debug-draw the current collision world.

**Kind**: instance method of [<code>CollisionWorld</code>](#CollisionWorld)  

| Param | Type | Description |
| --- | --- | --- |
| gridColor | [<code>Color</code>](#Color) | Optional grid color (default to black). |
| gridHighlitColor | [<code>Color</code>](#Color) | Optional grid color for cells with shapes in them (default to red). |
| opacity | <code>Number</code> | Optional opacity factor (default to 0.5). |
| camera | [<code>Camera</code>](#Camera) | Optional camera for offset and viewport. |

<a name="CollisionResolver"></a>

## CollisionResolver
The collision resolver is responsible to implement collision detection between pair of shapes of same or different types.

**Kind**: global class  

* [CollisionResolver](#CollisionResolver)
    * [new CollisionResolver()](#new_CollisionResolver_new)
    * [.setHandler(firstShapeId, secondShapeId, handler)](#CollisionResolver+setHandler)
    * [.test(first, second)](#CollisionResolver+test) ⇒ [<code>CollisionTestResult</code>](#CollisionTestResult)
    * [.testWithHandler(first, second, handler)](#CollisionResolver+testWithHandler) ⇒ [<code>CollisionTestResult</code>](#CollisionTestResult)
    * [.getHandlers()](#CollisionResolver+getHandlers)

<a name="new_CollisionResolver_new"></a>

### new CollisionResolver()
Create the resolver.

<a name="CollisionResolver+setHandler"></a>

### collisionResolver.setHandler(firstShapeId, secondShapeId, handler)
Set the method used to test collision between two shapes.
Note: you don't need to register the same handler twice for reverse order, its done automatically inside.

**Kind**: instance method of [<code>CollisionResolver</code>](#CollisionResolver)  

| Param | Type | Description |
| --- | --- | --- |
| firstShapeId | <code>String</code> | The shape identifier the handler recieves as first argument. |
| secondShapeId | <code>String</code> | The shape identifier the handler recieves as second argument. |
| handler | <code>function</code> | Method to test collision between the shapes. Return false if don't collide, return either Vector2 with collision position or 'true' for collision. |

<a name="CollisionResolver+test"></a>

### collisionResolver.test(first, second) ⇒ [<code>CollisionTestResult</code>](#CollisionTestResult)
Check a collision between two shapes.

**Kind**: instance method of [<code>CollisionResolver</code>](#CollisionResolver)  
**Returns**: [<code>CollisionTestResult</code>](#CollisionTestResult) - collision detection result or null if they don't collide.  

| Param | Type | Description |
| --- | --- | --- |
| first | [<code>CollisionShape</code>](#CollisionShape) | First collision shape to test. |
| second | [<code>CollisionShape</code>](#CollisionShape) | Second collision shape to test. |

<a name="CollisionResolver+testWithHandler"></a>

### collisionResolver.testWithHandler(first, second, handler) ⇒ [<code>CollisionTestResult</code>](#CollisionTestResult)
Check a collision between two shapes.

**Kind**: instance method of [<code>CollisionResolver</code>](#CollisionResolver)  
**Returns**: [<code>CollisionTestResult</code>](#CollisionTestResult) - collision detection result or null if they don't collide.  

| Param | Type | Description |
| --- | --- | --- |
| first | [<code>CollisionShape</code>](#CollisionShape) | First collision shape to test. |
| second | [<code>CollisionShape</code>](#CollisionShape) | Second collision shape to test. |
| handler | <code>function</code> | Method to test collision between the shapes. |

<a name="CollisionResolver+getHandlers"></a>

### collisionResolver.getHandlers()
Get handlers dictionary for a given shape.

**Kind**: instance method of [<code>CollisionResolver</code>](#CollisionResolver)  
<a name="CollisionTestResult"></a>

## CollisionTestResult
Collision detection result.

**Kind**: global class  

* [CollisionTestResult](#CollisionTestResult)
    * [new CollisionTestResult(position, first, second)](#new_CollisionTestResult_new)
    * [.position](#CollisionTestResult+position)
    * [.first](#CollisionTestResult+first)
    * [.second](#CollisionTestResult+second)

<a name="new_CollisionTestResult_new"></a>

### new CollisionTestResult(position, first, second)
Create the collision result.


| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) | Optional collision position. |
| first | [<code>CollisionShape</code>](#CollisionShape) | First shape in the collision check. |
| second | [<code>CollisionShape</code>](#CollisionShape) | Second shape in the collision check. |

<a name="CollisionTestResult+position"></a>

### collisionTestResult.position
Collision position, only relevant when there's a single touching point.
For shapes with multiple touching points, this will be null.

**Kind**: instance property of [<code>CollisionTestResult</code>](#CollisionTestResult)  
<a name="CollisionTestResult+first"></a>

### collisionTestResult.first
First collided shape.

**Kind**: instance property of [<code>CollisionTestResult</code>](#CollisionTestResult)  
<a name="CollisionTestResult+second"></a>

### collisionTestResult.second
Second collided shape.

**Kind**: instance property of [<code>CollisionTestResult</code>](#CollisionTestResult)  
<a name="CircleShape"></a>

## CircleShape
Collision circle class.

**Kind**: global class  

* [CircleShape](#CircleShape)
    * [new CircleShape(circle)](#new_CircleShape_new)
    * [.shapeId](#CircleShape+shapeId)
    * [.setShape(circle)](#CircleShape+setShape)
    * [._getRadius()](#CircleShape+_getRadius)
    * [.getCenter()](#CircleShape+getCenter)
    * [._getBoundingBox()](#CircleShape+_getBoundingBox)
    * [.debugDraw(opacity)](#CircleShape+debugDraw)

<a name="new_CircleShape_new"></a>

### new CircleShape(circle)
Create the collision shape.


| Param | Type | Description |
| --- | --- | --- |
| circle | [<code>Circle</code>](#Circle) | the circle shape. |

<a name="CircleShape+shapeId"></a>

### circleShape.shapeId
**Kind**: instance property of [<code>CircleShape</code>](#CircleShape)  
<a name="CircleShape+setShape"></a>

### circleShape.setShape(circle)
Set this collision shape from circle.

**Kind**: instance method of [<code>CircleShape</code>](#CircleShape)  

| Param | Type | Description |
| --- | --- | --- |
| circle | [<code>Circle</code>](#Circle) | Circle shape. |

<a name="CircleShape+_getRadius"></a>

### circleShape.\_getRadius()
**Kind**: instance method of [<code>CircleShape</code>](#CircleShape)  
<a name="CircleShape+getCenter"></a>

### circleShape.getCenter()
**Kind**: instance method of [<code>CircleShape</code>](#CircleShape)  
<a name="CircleShape+_getBoundingBox"></a>

### circleShape.\_getBoundingBox()
**Kind**: instance method of [<code>CircleShape</code>](#CircleShape)  
<a name="CircleShape+debugDraw"></a>

### circleShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>CircleShape</code>](#CircleShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

<a name="LinesShape"></a>

## LinesShape
Collision lines class.
This shape is made of one line or more.

**Kind**: global class  

* [LinesShape](#LinesShape)
    * [new LinesShape(lines)](#new_LinesShape_new)
    * [.shapeId](#LinesShape+shapeId)
    * [.addLines(lines)](#LinesShape+addLines)
    * [.setLines(lines)](#LinesShape+setLines)
    * [._getRadius()](#LinesShape+_getRadius)
    * [.getCenter()](#LinesShape+getCenter)
    * [._getBoundingBox()](#LinesShape+_getBoundingBox)
    * [.debugDraw(opacity)](#LinesShape+debugDraw)

<a name="new_LinesShape_new"></a>

### new LinesShape(lines)
Create the collision shape.


| Param | Type | Description |
| --- | --- | --- |
| lines | [<code>Array.&lt;Line&gt;</code>](#Line) \| [<code>Line</code>](#Line) | Starting line / lines. |

<a name="LinesShape+shapeId"></a>

### linesShape.shapeId
**Kind**: instance property of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+addLines"></a>

### linesShape.addLines(lines)
Add line or lines to this collision shape.

**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  

| Param | Type | Description |
| --- | --- | --- |
| lines | [<code>Array.&lt;Line&gt;</code>](#Line) \| [<code>Line</code>](#Line) | Line / lines to add. |

<a name="LinesShape+setLines"></a>

### linesShape.setLines(lines)
Set this shape from line or lines array.

**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  

| Param | Type | Description |
| --- | --- | --- |
| lines | [<code>Array.&lt;Line&gt;</code>](#Line) \| [<code>Line</code>](#Line) | Line / lines to set. |

<a name="LinesShape+_getRadius"></a>

### linesShape.\_getRadius()
**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+getCenter"></a>

### linesShape.getCenter()
**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+_getBoundingBox"></a>

### linesShape.\_getBoundingBox()
**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  
<a name="LinesShape+debugDraw"></a>

### linesShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>LinesShape</code>](#LinesShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

<a name="PointShape"></a>

## PointShape
Collision point class.

**Kind**: global class  

* [PointShape](#PointShape)
    * [new PointShape(position)](#new_PointShape_new)
    * [.shapeId](#PointShape+shapeId)
    * [.setPosition(position)](#PointShape+setPosition)
    * [.getPosition()](#PointShape+getPosition) ⇒ [<code>Vector2</code>](#Vector2)
    * [.getCenter()](#PointShape+getCenter)
    * [._getRadius()](#PointShape+_getRadius)
    * [._getBoundingBox()](#PointShape+_getBoundingBox)
    * [.debugDraw(opacity)](#PointShape+debugDraw)

<a name="new_PointShape_new"></a>

### new PointShape(position)
Create the collision shape.


| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) | Point position. |

<a name="PointShape+shapeId"></a>

### pointShape.shapeId
**Kind**: instance property of [<code>PointShape</code>](#PointShape)  
<a name="PointShape+setPosition"></a>

### pointShape.setPosition(position)
Set this collision shape from vector2.

**Kind**: instance method of [<code>PointShape</code>](#PointShape)  

| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) | Point position. |

<a name="PointShape+getPosition"></a>

### pointShape.getPosition() ⇒ [<code>Vector2</code>](#Vector2)
Get point position.

**Kind**: instance method of [<code>PointShape</code>](#PointShape)  
**Returns**: [<code>Vector2</code>](#Vector2) - Point position.  
<a name="PointShape+getCenter"></a>

### pointShape.getCenter()
**Kind**: instance method of [<code>PointShape</code>](#PointShape)  
<a name="PointShape+_getRadius"></a>

### pointShape.\_getRadius()
**Kind**: instance method of [<code>PointShape</code>](#PointShape)  
<a name="PointShape+_getBoundingBox"></a>

### pointShape.\_getBoundingBox()
**Kind**: instance method of [<code>PointShape</code>](#PointShape)  
<a name="PointShape+debugDraw"></a>

### pointShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>PointShape</code>](#PointShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

<a name="RectangleShape"></a>

## RectangleShape
Collision rectangle class.

**Kind**: global class  

* [RectangleShape](#RectangleShape)
    * [new RectangleShape(rectangle)](#new_RectangleShape_new)
    * [.shapeId](#RectangleShape+shapeId)
    * [.setShape(rectangle)](#RectangleShape+setShape)
    * [._getRadius()](#RectangleShape+_getRadius)
    * [._getBoundingBox()](#RectangleShape+_getBoundingBox)
    * [.getCenter()](#RectangleShape+getCenter)
    * [.debugDraw(opacity)](#RectangleShape+debugDraw)

<a name="new_RectangleShape_new"></a>

### new RectangleShape(rectangle)
Create the collision shape.


| Param | Type | Description |
| --- | --- | --- |
| rectangle | [<code>Rectangle</code>](#Rectangle) | the rectangle shape. |

<a name="RectangleShape+shapeId"></a>

### rectangleShape.shapeId
**Kind**: instance property of [<code>RectangleShape</code>](#RectangleShape)  
<a name="RectangleShape+setShape"></a>

### rectangleShape.setShape(rectangle)
Set this collision shape from rectangle.

**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  

| Param | Type | Description |
| --- | --- | --- |
| rectangle | [<code>Rectangle</code>](#Rectangle) | Rectangle shape. |

<a name="RectangleShape+_getRadius"></a>

### rectangleShape.\_getRadius()
**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  
<a name="RectangleShape+_getBoundingBox"></a>

### rectangleShape.\_getBoundingBox()
**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  
<a name="RectangleShape+getCenter"></a>

### rectangleShape.getCenter()
**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  
<a name="RectangleShape+debugDraw"></a>

### rectangleShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>RectangleShape</code>](#RectangleShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

<a name="CollisionShape"></a>

## CollisionShape
Collision shape base class.

**Kind**: global class  

* [CollisionShape](#CollisionShape)
    * [new CollisionShape()](#new_CollisionShape_new)
    * [.shapeId](#CollisionShape+shapeId) ⇒ <code>String</code>
    * [.collisionFlags](#CollisionShape+collisionFlags)
    * [.collisionFlags](#CollisionShape+collisionFlags)
    * [.setDebugColor(color)](#CollisionShape+setDebugColor)
    * [.debugDraw(opacity)](#CollisionShape+debugDraw)
    * [.getCenter()](#CollisionShape+getCenter) ⇒ [<code>Vector2</code>](#Vector2)
    * [.remove()](#CollisionShape+remove)

<a name="new_CollisionShape_new"></a>

### new CollisionShape()
Create the collision shape.

<a name="CollisionShape+shapeId"></a>

### collisionShape.shapeId ⇒ <code>String</code>
Get the collision shape's unique identifier.

**Kind**: instance property of [<code>CollisionShape</code>](#CollisionShape)  
**Returns**: <code>String</code> - Shape's unique identifier  
<a name="CollisionShape+collisionFlags"></a>

### collisionShape.collisionFlags
Get collision flags (matched against collision mask when checking collision).

**Kind**: instance property of [<code>CollisionShape</code>](#CollisionShape)  
<a name="CollisionShape+collisionFlags"></a>

### collisionShape.collisionFlags
Set collision flags (matched against collision mask when checking collision).

**Kind**: instance property of [<code>CollisionShape</code>](#CollisionShape)  
<a name="CollisionShape+setDebugColor"></a>

### collisionShape.setDebugColor(color)
Set the debug color to use to draw this shape.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  

| Param | Type | Description |
| --- | --- | --- |
| color | [<code>Color</code>](#Color) | Color to set or null to use default. |

<a name="CollisionShape+debugDraw"></a>

### collisionShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

<a name="CollisionShape+getCenter"></a>

### collisionShape.getCenter() ⇒ [<code>Vector2</code>](#Vector2)
Get shape center position.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  
**Returns**: [<code>Vector2</code>](#Vector2) - Center position.  
<a name="CollisionShape+remove"></a>

### collisionShape.remove()
Remove self from parent world object.

**Kind**: instance method of [<code>CollisionShape</code>](#CollisionShape)  
<a name="TilemapShape"></a>

## TilemapShape
Collision tilemap class.
A collision tilemap shape is a grid of equal-sized cells that can either block or not (+ have collision flags).
Its the most efficient (both memory and CPU) way to implement grid based / tilemap collision.

**Kind**: global class  

* [TilemapShape](#TilemapShape)
    * [new TilemapShape(offset, gridSize, tileSize, borderThickness)](#new_TilemapShape_new)
    * [.shapeId](#TilemapShape+shapeId)
    * [.setTile(index, haveCollision, collisionFlags)](#TilemapShape+setTile)
    * [.getTileAt(position)](#TilemapShape+getTileAt) ⇒ [<code>RectangleShape</code>](#RectangleShape)
    * [.iterateTilesAtRegion(region, callback)](#TilemapShape+iterateTilesAtRegion)
    * [.getTilesAtRegion(region)](#TilemapShape+getTilesAtRegion) ⇒ [<code>Array.&lt;RectangleShape&gt;</code>](#RectangleShape)
    * [._getRadius()](#TilemapShape+_getRadius)
    * [._getBoundingBox()](#TilemapShape+_getBoundingBox)
    * [.getCenter()](#TilemapShape+getCenter)
    * [.debugDraw(opacity)](#TilemapShape+debugDraw)

<a name="new_TilemapShape_new"></a>

### new TilemapShape(offset, gridSize, tileSize, borderThickness)
Create the collision tilemap.


| Param | Type | Description |
| --- | --- | --- |
| offset | [<code>Vector2</code>](#Vector2) | Tilemap top-left corner. |
| gridSize | [<code>Vector2</code>](#Vector2) | Number of tiles on X and Y axis. |
| tileSize | [<code>Vector2</code>](#Vector2) | The size of a single tile. |
| borderThickness | <code>Number</code> | Set a border collider with this thickness. |

<a name="TilemapShape+shapeId"></a>

### tilemapShape.shapeId
**Kind**: instance property of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+setTile"></a>

### tilemapShape.setTile(index, haveCollision, collisionFlags)
Set the state of a tile.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  

| Param | Type | Description |
| --- | --- | --- |
| index | [<code>Vector2</code>](#Vector2) | Tile index. |
| haveCollision | <code>Boolean</code> | Does this tile have collision? |
| collisionFlags | <code>Number</code> | Optional collision flag to set for this tile. |

<a name="TilemapShape+getTileAt"></a>

### tilemapShape.getTileAt(position) ⇒ [<code>RectangleShape</code>](#RectangleShape)
Get the collision shape of a tile at a given position.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
**Returns**: [<code>RectangleShape</code>](#RectangleShape) - Collision shape at this position, or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) | Position to get tile at. |

<a name="TilemapShape+iterateTilesAtRegion"></a>

### tilemapShape.iterateTilesAtRegion(region, callback)
Iterate all tiles in given region, represented by a rectangle.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  

| Param | Type | Description |
| --- | --- | --- |
| region | [<code>Rectangle</code>](#Rectangle) | Rectangle to get tiles for. |
| callback | <code>function</code> | Method to invoke for every tile. Return false to break iteration. |

<a name="TilemapShape+getTilesAtRegion"></a>

### tilemapShape.getTilesAtRegion(region) ⇒ [<code>Array.&lt;RectangleShape&gt;</code>](#RectangleShape)
Get all tiles in given region, represented by a rectangle.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
**Returns**: [<code>Array.&lt;RectangleShape&gt;</code>](#RectangleShape) - Array with rectangle shapes or empty if none found.  

| Param | Type | Description |
| --- | --- | --- |
| region | [<code>Rectangle</code>](#Rectangle) | Rectangle to get tiles for. |

<a name="TilemapShape+_getRadius"></a>

### tilemapShape.\_getRadius()
**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+_getBoundingBox"></a>

### tilemapShape.\_getBoundingBox()
**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+getCenter"></a>

### tilemapShape.getCenter()
**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  
<a name="TilemapShape+debugDraw"></a>

### tilemapShape.debugDraw(opacity)
Debug draw this shape.

**Kind**: instance method of [<code>TilemapShape</code>](#TilemapShape)  

| Param | Type | Description |
| --- | --- | --- |
| opacity | <code>Number</code> | Shape opacity factor. |

<a name="Camera"></a>

## Camera
Implements a Camera object.

**Kind**: global class  

* [Camera](#Camera)
    * [new Camera(gfx)](#new_Camera_new)
    * [.projection](#Camera+projection)
    * [.viewport](#Camera+viewport) ⇒ [<code>Rectangle</code>](#Rectangle)
    * [.viewport](#Camera+viewport)
    * [.getRegion()](#Camera+getRegion) ⇒ [<code>Rectangle</code>](#Rectangle)
    * [.orthographicOffset(offset, ignoreViewportSize, near, far)](#Camera+orthographicOffset)
    * [.orthographic(region, near, far)](#Camera+orthographic)

<a name="new_Camera_new"></a>

### new Camera(gfx)
Create the camera.


| Param | Type | Description |
| --- | --- | --- |
| gfx | [<code>Gfx</code>](#Gfx) | The gfx manager instance. |

<a name="Camera+projection"></a>

### camera.projection
Camera projection matrix.
You can set it manually, or use 'orthographicOffset' / 'orthographic' / 'perspective' helper functions.

**Kind**: instance property of [<code>Camera</code>](#Camera)  
<a name="Camera+viewport"></a>

### camera.viewport ⇒ [<code>Rectangle</code>](#Rectangle)
Get camera's viewport (drawing region to set when using this camera).

**Kind**: instance property of [<code>Camera</code>](#Camera)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - Camera's viewport as rectangle.  
<a name="Camera+viewport"></a>

### camera.viewport
Set camera's viewport.

**Kind**: instance property of [<code>Camera</code>](#Camera)  

| Param | Type | Description |
| --- | --- | --- |
| viewport | [<code>Rectangle</code>](#Rectangle) | New viewport to set or null to not use any viewport when using this camera. |

<a name="Camera+getRegion"></a>

### camera.getRegion() ⇒ [<code>Rectangle</code>](#Rectangle)
Get the region this camera covers.

**Kind**: instance method of [<code>Camera</code>](#Camera)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - region this camera covers.  
<a name="Camera+orthographicOffset"></a>

### camera.orthographicOffset(offset, ignoreViewportSize, near, far)
Make this camera an orthographic camera with offset.

**Kind**: instance method of [<code>Camera</code>](#Camera)  

| Param | Type | Description |
| --- | --- | --- |
| offset | [<code>Vector2</code>](#Vector2) | Camera offset (top-left corner). |
| ignoreViewportSize | <code>Boolean</code> | If true, will take the entire canvas size for calculation and ignore the viewport size, if set. |
| near | <code>Number</code> | Near clipping plane. |
| far | <code>Number</code> | Far clipping plane. |

<a name="Camera+orthographic"></a>

### camera.orthographic(region, near, far)
Make this camera an orthographic camera.

**Kind**: instance method of [<code>Camera</code>](#Camera)  

| Param | Type | Description |
| --- | --- | --- |
| region | [<code>Rectangle</code>](#Rectangle) | Camera left, top, bottom and right. If not set, will take entire canvas. |
| near | <code>Number</code> | Near clipping plane. |
| far | <code>Number</code> | Far clipping plane. |

<a name="BasicEffect"></a>

## BasicEffect
Default basic effect to draw 2d sprites.

**Kind**: global class  

* [BasicEffect](#BasicEffect)
    * [.vertexCode](#BasicEffect+vertexCode)
    * [.fragmentCode](#BasicEffect+fragmentCode)
    * [.uniformTypes](#BasicEffect+uniformTypes)
    * [.attributeTypes](#BasicEffect+attributeTypes)

<a name="BasicEffect+vertexCode"></a>

### basicEffect.vertexCode
**Kind**: instance property of [<code>BasicEffect</code>](#BasicEffect)  
<a name="BasicEffect+fragmentCode"></a>

### basicEffect.fragmentCode
**Kind**: instance property of [<code>BasicEffect</code>](#BasicEffect)  
<a name="BasicEffect+uniformTypes"></a>

### basicEffect.uniformTypes
**Kind**: instance property of [<code>BasicEffect</code>](#BasicEffect)  
<a name="BasicEffect+attributeTypes"></a>

### basicEffect.attributeTypes
**Kind**: instance property of [<code>BasicEffect</code>](#BasicEffect)  
<a name="Effect"></a>

## Effect
Effect base class.
An effect = vertex shader + fragment shader + uniforms & attributes + setup code.

**Kind**: global class  

* [Effect](#Effect)
    * [.uniformTypes](#Effect+uniformTypes) ⇒ <code>\*</code>
    * [.attributeTypes](#Effect+attributeTypes) ⇒ <code>\*</code>
    * [.vertexCode](#Effect+vertexCode) ⇒ <code>String</code>
    * [.fragmentCode](#Effect+fragmentCode) ⇒ <code>String</code>
    * [.enableDepthTest](#Effect+enableDepthTest)
    * [.enableFaceCulling](#Effect+enableFaceCulling)
    * [.enableStencilTest](#Effect+enableStencilTest)
    * [.enableDithering](#Effect+enableDithering)
    * [.setAsActive()](#Effect+setAsActive)
    * [.prepareToDrawBatch(mesh, world)](#Effect+prepareToDrawBatch)
    * [.setTexture(texture)](#Effect+setTexture) ⇒ <code>Boolean</code>
    * [.setColor(color)](#Effect+setColor)
    * [.setUvOffsetAndScale(sourceRect, texture)](#Effect+setUvOffsetAndScale)
    * [.setProjectionMatrix(matrix)](#Effect+setProjectionMatrix)
    * [.setWorldMatrix(matrix)](#Effect+setWorldMatrix)
    * [.setPositionsAttribute(buffer)](#Effect+setPositionsAttribute)
    * [.setTextureCoordsAttribute(buffer)](#Effect+setTextureCoordsAttribute)
    * [.setColorsAttribute(buffer)](#Effect+setColorsAttribute)

<a name="Effect+uniformTypes"></a>

### effect.uniformTypes ⇒ <code>\*</code>
Get a dictionary with all shaders uniforms.
Key = uniform name, as appears in shader code.
Value = {
             type: UniformTypes to represent uniform type,
             bind: Optional bind to one of the built-in uniforms. See Effect.UniformBinds for details.
        }

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>\*</code> - Dictionary with uniforms descriptions.  
<a name="Effect+attributeTypes"></a>

### effect.attributeTypes ⇒ <code>\*</code>
Get a dictionary with all shader attributes.
Key = attribute name, as appears in shader code.
Value = {
            size: size of every value in this attribute.
            type: attribute type. See Effect.AttributeTypes for details.
            normalize: if true, will normalize values.
            stride: optional stride. 
            offset: optional offset.
            bind: Optional bind to one of the built-in attributes. See Effect.AttributeBinds for details.
        }

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>\*</code> - Dictionary with attributes descriptions.  
<a name="Effect+vertexCode"></a>

### effect.vertexCode ⇒ <code>String</code>
Get this effect's vertex shader code, as string.

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>String</code> - Vertex shader code.  
<a name="Effect+fragmentCode"></a>

### effect.fragmentCode ⇒ <code>String</code>
Get this effect's fragment shader code, as string.

**Kind**: instance property of [<code>Effect</code>](#Effect)  
**Returns**: <code>String</code> - Fragment shader code.  
<a name="Effect+enableDepthTest"></a>

### effect.enableDepthTest
Should this effect enable depth test?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+enableFaceCulling"></a>

### effect.enableFaceCulling
Should this effect enable face culling?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+enableStencilTest"></a>

### effect.enableStencilTest
Should this effect enable stencil test?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+enableDithering"></a>

### effect.enableDithering
Should this effect enable dithering?

**Kind**: instance property of [<code>Effect</code>](#Effect)  
<a name="Effect+setAsActive"></a>

### effect.setAsActive()
Make this effect active.

**Kind**: instance method of [<code>Effect</code>](#Effect)  
<a name="Effect+prepareToDrawBatch"></a>

### effect.prepareToDrawBatch(mesh, world)
Prepare effect before drawing it with batching.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| mesh | [<code>Mesh</code>](#Mesh) | Mesh we're about to draw. |
| world | [<code>Matrix</code>](#Matrix) | World matrix. |

<a name="Effect+setTexture"></a>

### effect.setTexture(texture) ⇒ <code>Boolean</code>
Set the main texture.
Only works if there's a uniform type bound to 'MainTexture'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  
**Returns**: <code>Boolean</code> - True if texture was changed, false if there was no need to change the texture.  

| Param | Type | Description |
| --- | --- | --- |
| texture | [<code>TextureAsset</code>](#TextureAsset) | Texture to set. |

<a name="Effect+setColor"></a>

### effect.setColor(color)
Set the main tint color.
Only works if there's a uniform type bound to 'Color'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| color | [<code>Color</code>](#Color) | Color to set. |

<a name="Effect+setUvOffsetAndScale"></a>

### effect.setUvOffsetAndScale(sourceRect, texture)
Set uvOffset and uvScale params from source rectangle and texture.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| sourceRect | [<code>Rectangle</code>](#Rectangle) | Source rectangle to set, or null to take entire texture. |
| texture | [<code>TextureAsset</code>](#TextureAsset) | Texture asset to set source rect for. |

<a name="Effect+setProjectionMatrix"></a>

### effect.setProjectionMatrix(matrix)
Set the projection matrix uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to set. |

<a name="Effect+setWorldMatrix"></a>

### effect.setWorldMatrix(matrix)
Set the world matrix uniform.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to set. |

<a name="Effect+setPositionsAttribute"></a>

### effect.setPositionsAttribute(buffer)
Set the vertices position buffer.
Only works if there's an attribute type bound to 'Position'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices position buffer. |

<a name="Effect+setTextureCoordsAttribute"></a>

### effect.setTextureCoordsAttribute(buffer)
Set the vertices texture coords buffer.
Only works if there's an attribute type bound to 'TextureCoords'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices texture coords buffer. |

<a name="Effect+setColorsAttribute"></a>

### effect.setColorsAttribute(buffer)
Set the vertices colors buffer.
Only works if there's an attribute type bound to 'Colors'.

**Kind**: instance method of [<code>Effect</code>](#Effect)  

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>WebGLBuffer</code> | Vertices colors buffer. |

<a name="MsdfFontEffect"></a>

## MsdfFontEffect
Default effect to draw MSDF font textures.

**Kind**: global class  

* [MsdfFontEffect](#MsdfFontEffect)
    * [.vertexCode](#MsdfFontEffect+vertexCode)
    * [.fragmentCode](#MsdfFontEffect+fragmentCode)
    * [.uniformTypes](#MsdfFontEffect+uniformTypes)
    * [.attributeTypes](#MsdfFontEffect+attributeTypes)

<a name="MsdfFontEffect+vertexCode"></a>

### msdfFontEffect.vertexCode
**Kind**: instance property of [<code>MsdfFontEffect</code>](#MsdfFontEffect)  
<a name="MsdfFontEffect+fragmentCode"></a>

### msdfFontEffect.fragmentCode
**Kind**: instance property of [<code>MsdfFontEffect</code>](#MsdfFontEffect)  
<a name="MsdfFontEffect+uniformTypes"></a>

### msdfFontEffect.uniformTypes
**Kind**: instance property of [<code>MsdfFontEffect</code>](#MsdfFontEffect)  
<a name="MsdfFontEffect+attributeTypes"></a>

### msdfFontEffect.attributeTypes
**Kind**: instance property of [<code>MsdfFontEffect</code>](#MsdfFontEffect)  
<a name="Gfx"></a>

## Gfx
Gfx is the graphics manager. 
Everything related to rendering and managing your game canvas goes here.

To access the Graphics manager you use `Shaku.gfx`.

**Kind**: global class  

* [Gfx](#Gfx)
    * [new Gfx()](#new_Gfx_new)
    * [.canvas](#Gfx+canvas) ⇒ <code>HTMLCanvasElement</code>
    * [.Effect](#Gfx+Effect)
    * [.BasicEffect](#Gfx+BasicEffect)
    * [.MsdfFontEffect](#Gfx+MsdfFontEffect)
    * [.Sprite](#Gfx+Sprite)
    * [.SpritesGroup](#Gfx+SpritesGroup)
    * [.Matrix](#Gfx+Matrix)
    * [.Vertex](#Gfx+Vertex)
    * [.TextAlignment](#Gfx+TextAlignment)
    * [.BlendModes](#Gfx+BlendModes)
    * [.TextureWrapModes](#Gfx+TextureWrapModes)
    * [.TextureFilterModes](#Gfx+TextureFilterModes)
    * [.drawCallsCount](#Gfx+drawCallsCount) ⇒ <code>Number</code>
    * [.quadsDrawCount](#Gfx+quadsDrawCount) ⇒ <code>Number</code>
    * [.setContextAttributes(flags)](#Gfx+setContextAttributes)
    * [.setCanvas(element)](#Gfx+setCanvas)
    * [.createCamera(withViewport)](#Gfx+createCamera) ⇒ [<code>Camera</code>](#Camera)
    * [.setCameraOrthographic(offset)](#Gfx+setCameraOrthographic) ⇒ [<code>Camera</code>](#Camera)
    * [.createEffect(type)](#Gfx+createEffect) ⇒ [<code>Effect</code>](#Effect)
    * [.maximizeCanvasSize(limitToParent, allowOddNumbers)](#Gfx+maximizeCanvasSize)
    * [.setRenderTarget(texture, keepCamera)](#Gfx+setRenderTarget)
    * [.useEffect(effect)](#Gfx+useEffect)
    * [.setResolution(width, height, updateCanvasStyle)](#Gfx+setResolution)
    * [.resetCamera()](#Gfx+resetCamera)
    * [.applyCamera(camera)](#Gfx+applyCamera)
    * [.getRenderingRegion(includeOffset)](#Gfx+getRenderingRegion) ⇒ [<code>Rectangle</code>](#Rectangle)
    * [.getRenderingSize()](#Gfx+getRenderingSize) ⇒ [<code>Vector2</code>](#Vector2)
    * [.getCanvasSize()](#Gfx+getCanvasSize) ⇒ [<code>Vector2</code>](#Vector2)
    * [.buildText(fontTexture, text, [fontSize], color, [alignment], [offset], [marginFactor])](#Gfx+buildText) ⇒ [<code>SpritesGroup</code>](#SpritesGroup)
    * [.drawGroup(group, cullOutOfScreen)](#Gfx+drawGroup)
    * [.drawSprite(sprite)](#Gfx+drawSprite)
    * [.cover(texture, destRect, sourceRect, color, blendMode)](#Gfx+cover)
    * [.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, skew)](#Gfx+draw)
    * [.drawQuadFromVertices(texture, vertices, blendMode)](#Gfx+drawQuadFromVertices)
    * [.fillRect(destRect, color, blend, rotation)](#Gfx+fillRect)
    * [.fillRects(destRects, colors, blend, rotation)](#Gfx+fillRects)
    * [.outlineRect(destRect, color, [blend], [rotation])](#Gfx+outlineRect)
    * [.outlineCircle(circle, color, blend, lineAmount)](#Gfx+outlineCircle)
    * [.fillCircle(circle, color, blend, lineAmount)](#Gfx+fillCircle)
    * [.fillCircles(circles, colors, blend, lineAmount)](#Gfx+fillCircles)
    * [.drawLine(startPoint, endPoint, color, blendMode)](#Gfx+drawLine)
    * [.drawLinesStrip(points, colors, blendMode, looped)](#Gfx+drawLinesStrip)
    * [.drawLines(points, colors, blendMode)](#Gfx+drawLines)
    * [.drawPoint(point, color, blendMode)](#Gfx+drawPoint)
    * [.drawPoints(points, colors, blendMode)](#Gfx+drawPoints)
    * [.centerCanvas()](#Gfx+centerCanvas)
    * [.inScreen(shape)](#Gfx+inScreen) ⇒ <code>Boolean</code>
    * [.centerCamera(position, useCanvasSize)](#Gfx+centerCamera)
    * [.clear(color)](#Gfx+clear)
    * [.presentBufferedData()](#Gfx+presentBufferedData)

<a name="new_Gfx_new"></a>

### new Gfx()
Create the manager.

<a name="Gfx+canvas"></a>

### gfx.canvas ⇒ <code>HTMLCanvasElement</code>
Get the canvas element controlled by the gfx manager.
If you didn't provide your own canvas before initialization, you must add this canvas to your document after initializing `Shaku`.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>HTMLCanvasElement</code> - Canvas we use for rendering.  
**Example**  
```js
document.body.appendChild(Shaku.gfx.canvas);
```
<a name="Gfx+Effect"></a>

### gfx.Effect
Get the Effect base class, which is required to implement custom effects.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Effect  
<a name="Gfx+BasicEffect"></a>

### gfx.BasicEffect
Get the default Effect class, which is required to implement custom effects that inherit and reuse parts from the default effect.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: BasicEffect  
<a name="Gfx+MsdfFontEffect"></a>

### gfx.MsdfFontEffect
Get the Effect for rendering fonts with an MSDF texture.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: MsdfFontEffect  
<a name="Gfx+Sprite"></a>

### gfx.Sprite
Get the sprite class.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Sprite  
<a name="Gfx+SpritesGroup"></a>

### gfx.SpritesGroup
Get the sprites group object.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: SpritesGroup  
<a name="Gfx+Matrix"></a>

### gfx.Matrix
Get the matrix object.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Matrix  
<a name="Gfx+Vertex"></a>

### gfx.Vertex
Get the vertex object.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: Vertex  
<a name="Gfx+TextAlignment"></a>

### gfx.TextAlignment
Get the text alignments options.
* Left: align text to the left.
* Right: align text to the right.
* Center: align text to center.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextAlignment  
<a name="Gfx+BlendModes"></a>

### gfx.BlendModes
Get the blend modes enum.
* AlphaBlend
* Opaque
* Additive
* Multiply
* Subtract
* Screen
* Overlay
* Invert
* DestIn
* DestOut

![Blend Modes](resources/blend-modes.png)

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: BlendModes  
<a name="Gfx+TextureWrapModes"></a>

### gfx.TextureWrapModes
Get the wrap modes enum.
* Clamp: when uv position exceed texture boundaries it will be clamped to the nearest border, ie repeat the edge pixels.
* Repeat: when uv position exceed texture boundaries it will wrap back to the other side.
* RepeatMirrored: when uv position exceed texture boundaries it will wrap back to the other side but also mirror the texture.

![Wrap Modes](resources/wrap-modes.png)

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextureWrapModes  
<a name="Gfx+TextureFilterModes"></a>

### gfx.TextureFilterModes
Get texture filter modes.
* Nearest: no filtering, no mipmaps (pixelated).
* Linear: simple filtering, no mipmaps (smooth).
* NearestMipmapNearest: no filtering, sharp switching between mipmaps,
* LinearMipmapNearest: filtering, sharp switching between mipmaps.
* NearestMipmapLinear: no filtering, smooth transition between mipmaps.
* LinearMipmapLinear: filtering, smooth transition between mipmaps.

![Filter Modes](resources/filter-modes.png)

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**See**: TextureFilterModes  
<a name="Gfx+drawCallsCount"></a>

### gfx.drawCallsCount ⇒ <code>Number</code>
Get number of actual WebGL draw calls we performed since the beginning of the frame.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Number</code> - Number of WebGL draw calls this frame.  
<a name="Gfx+quadsDrawCount"></a>

### gfx.quadsDrawCount ⇒ <code>Number</code>
Get number of textured / colored quads we drawn since the beginning of the frame.

**Kind**: instance property of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Number</code> - Number of quads drawn in this frame..  
<a name="Gfx+setContextAttributes"></a>

### gfx.setContextAttributes(flags)
Set WebGL init flags (passed as additional params to the getContext() call). 
You must call this *before* initializing *Shaku*.

By default, *Shaku* will init WebGL context with the following flags:
- antialias: true.
- alpha: true.
- depth: false.
- premultipliedAlpha: true.
- desynchronized: false.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| flags | <code>Dictionary</code> | WebGL init flags to set. |

**Example**  
```js
Shaku.gfx.setContextAttributes({ antialias: true, alpha: false });
```
<a name="Gfx+setCanvas"></a>

### gfx.setCanvas(element)
Set the canvas element to initialize on.
You must call this *before* initializing Shaku. Calling this will prevent Shaku from creating its own canvas.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>HTMLCanvasElement</code> | Canvas element to initialize on. |

**Example**  
```js
Shaku.gfx.setCanvas(document.getElementById('my-canvas')); 
```
<a name="Gfx+createCamera"></a>

### gfx.createCamera(withViewport) ⇒ [<code>Camera</code>](#Camera)
Create and return a new camera instance.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: [<code>Camera</code>](#Camera) - New camera object.  

| Param | Type | Description |
| --- | --- | --- |
| withViewport | <code>Boolean</code> | If true, will create camera with viewport value equal to canvas' size. |

<a name="Gfx+setCameraOrthographic"></a>

### gfx.setCameraOrthographic(offset) ⇒ [<code>Camera</code>](#Camera)
Set default orthographic camera from offset.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: [<code>Camera</code>](#Camera) - Camera instance.  

| Param | Type | Description |
| --- | --- | --- |
| offset | [<code>Vector2</code>](#Vector2) | Camera top-left corner. |

<a name="Gfx+createEffect"></a>

### gfx.createEffect(type) ⇒ [<code>Effect</code>](#Effect)
Create and return an effect instance.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: [<code>Effect</code>](#Effect) - Effect instance.  
**See**: Effect  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>Class</code> | Effect class type. Must inherit from Effect base class. |

<a name="Gfx+maximizeCanvasSize"></a>

### gfx.maximizeCanvasSize(limitToParent, allowOddNumbers)
Set resolution and canvas to the max size of its parent element or screen.
If the canvas is directly under document body, it will take the max size of the page.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| limitToParent | <code>Boolean</code> | if true, will use parent element size. If false, will stretch on entire document. |
| allowOddNumbers | <code>Boolean</code> | if true, will permit odd numbers, which could lead to small artefacts when drawing pixel art. If false (default) will round to even numbers. |

<a name="Gfx+setRenderTarget"></a>

### gfx.setRenderTarget(texture, keepCamera)
Set a render target (texture) to render on.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | [<code>TextureAsset</code>](#TextureAsset) \| [<code>Array.&lt;TextureAsset&gt;</code>](#TextureAsset) | Render target texture to set as render target, or null to reset and render back on canvas. Can also be array for multiple targets, which will take layouts 0-15 by their order. |
| keepCamera | <code>Boolean</code> | If true, will keep current camera settings. If false (default) will reset camera. |

**Example**  
```js
// create render target
let renderTarget = await Shaku.assets.createRenderTarget('_my_render_target', 800, 600);

// use render target
Shaku.gfx.setRenderTarget(renderTarget);
// .. draw some stuff here

// reset render target and present it on screen
// note the negative height - render targets end up with flipped Y axis
Shaku.gfx.setRenderTarget(null);
Shaku.gfx.draw(renderTarget, new Shaku.utils.Vector2(screenX / 2, screenY / 2), new Shaku.utils.Vector2(screenX, -screenY));
```
<a name="Gfx+useEffect"></a>

### gfx.useEffect(effect)
Set effect to use for future draw calls.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| effect | [<code>Effect</code>](#Effect) \| <code>null</code> | Effect to use or null to use the basic builtin effect. |

**Example**  
```js
let effect = Shaku.gfx.createEffect(MyEffectType);
Shaku.gfx.useEffect(effect);
```
<a name="Gfx+setResolution"></a>

### gfx.setResolution(width, height, updateCanvasStyle)
Set resolution and canvas size.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | Resolution width. |
| height | <code>Number</code> | Resolution height. |
| updateCanvasStyle | <code>Boolean</code> | If true, will also update the canvas *css* size in pixels. |

**Example**  
```js
// set resolution and size of 800x600.
Shaku.gfx.setResolution(800, 600, true);
```
<a name="Gfx+resetCamera"></a>

### gfx.resetCamera()
Reset camera properties to default camera.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+applyCamera"></a>

### gfx.applyCamera(camera)
Set viewport, projection and other properties from a camera instance.
Changing the camera properties after calling this method will *not* update the renderer, until you call applyCamera again.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| camera | [<code>Camera</code>](#Camera) | Camera to apply. |

<a name="Gfx+getRenderingRegion"></a>

### gfx.getRenderingRegion(includeOffset) ⇒ [<code>Rectangle</code>](#Rectangle)
Get current rendering region.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - Rectangle with rendering region.  

| Param | Type | Description |
| --- | --- | --- |
| includeOffset | <code>Boolean</code> | If true (default) will include viewport offset, if exists. |

<a name="Gfx+getRenderingSize"></a>

### gfx.getRenderingSize() ⇒ [<code>Vector2</code>](#Vector2)
Get current rendering size.
Unlike 'canvasSize', this takes viewport and render target into consideration.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: [<code>Vector2</code>](#Vector2) - rendering size.  
<a name="Gfx+getCanvasSize"></a>

### gfx.getCanvasSize() ⇒ [<code>Vector2</code>](#Vector2)
Get canvas size as vector.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: [<code>Vector2</code>](#Vector2) - Canvas size.  
<a name="Gfx+buildText"></a>

### gfx.buildText(fontTexture, text, [fontSize], color, [alignment], [offset], [marginFactor]) ⇒ [<code>SpritesGroup</code>](#SpritesGroup)
Generate a sprites group to render a string using a font texture.
Take the result of this method and use with gfx.drawGroup() to render the text.
This is what you use when you want to draw texts with `Shaku`.
Note: its best to always draw texts with *batching* enabled.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: [<code>SpritesGroup</code>](#SpritesGroup) - Sprites group containing the needed sprites to draw the given text with its properties.  

| Param | Type | Description |
| --- | --- | --- |
| fontTexture | [<code>FontTextureAsset</code>](#FontTextureAsset) | Font texture asset to use. |
| text | <code>String</code> | Text to generate sprites for. |
| [fontSize] | <code>Number</code> | Font size, or undefined to use font texture base size. |
| color | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;&#x3D;</code>](#Color) | Text sprites color. If array is set, will assign each color to different vertex, starting from top-left. |
| [alignment] | <code>TextAlignment</code> | Text alignment. |
| [offset] | [<code>Vector2</code>](#Vector2) | Optional starting offset. |
| [marginFactor] | [<code>Vector2</code>](#Vector2) | Optional factor for characters and line spacing. For example value of 2,1 will make double horizontal spacing. |

**Example**  
```js
// load font texture
let fontTexture = await Shaku.assets.loadFontTexture('assets/DejaVuSansMono.ttf', {fontName: 'DejaVuSansMono'});

// generate 'hello world!' text (note: you don't have to regenerate every frame if text didn't change)
let text1 = Shaku.gfx.buildText(fontTexture, "Hello World!");
text1.position.set(40, 40);

// draw text
Shaku.gfx.drawGroup(text1, true);
```
<a name="Gfx+drawGroup"></a>

### gfx.drawGroup(group, cullOutOfScreen)
Draw a SpritesGroup object. 
A SpritesGroup is a collection of sprites we can draw in bulks with transformations to apply on the entire group.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| group | [<code>SpritesGroup</code>](#SpritesGroup) | Sprites group to draw. |
| cullOutOfScreen | <code>Boolean</code> | If true and in batching mode, will cull automatically any quad that is completely out of screen. |

**Example**  
```js
// load texture
let texture = await Shaku.assets.loadTexture('assets/sprite.png');

// create group and set entire group's position and scale
let group = new Shaku.gfx.SpritesGroup();
group.position.set(125, 300);
group.scale.set(2, 2);

// create 5 sprites and add to group
for (let i = 0; i < 5; ++i) {
  let sprite = new Shaku.gfx.Sprite(texture);
  sprite.position.set(100 * i, 150);
  sprite.size.set(50, 50);
  group.add(sprite)
}

// draw the group with automatic culling of invisible sprites
Shaku.gfx.drawGroup(group, true);
```
<a name="Gfx+drawSprite"></a>

### gfx.drawSprite(sprite)
Draw a single sprite object.
Sprites are optional objects that store all the parameters for a `draw()` call. They are also used for batch rendering.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| sprite | [<code>Sprite</code>](#Sprite) | Sprite object to draw. |

**Example**  
```js
// load texture and create sprite
let texture = await Shaku.assets.loadTexture('assets/sprite.png');
let sprite = new Shaku.gfx.Sprite(texture);

// set position and size
sprite.position.set(100, 150);
sprite.size.set(50, 50);

// draw sprite
Shaku.gfx.drawSprite(sprite);
```
<a name="Gfx+cover"></a>

### gfx.cover(texture, destRect, sourceRect, color, blendMode)
Draw a texture to cover a given destination rectangle.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | [<code>TextureAsset</code>](#TextureAsset) | Texture to draw. |
| destRect | [<code>Rectangle</code>](#Rectangle) \| [<code>Vector2</code>](#Vector2) | Destination rectangle to draw on. If vector is provided, will draw from 0,0 with vector as size. |
| sourceRect | [<code>Rectangle</code>](#Rectangle) | Source rectangle, or undefined to use the entire texture. |
| color | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color) | Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| blendMode | <code>BlendModes</code> | Blend mode, or undefined to use alpha blend. |

**Example**  
```js
// cover the entire screen with an image
let texture = await Shaku.assets.loadTexture('assets/sprite.png');
Shaku.gfx.cover(texture, Shaku.gfx.getRenderingRegion());
```
**Example**  
```js
// draw with additional params
let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
let color = Shaku.utils.Color.blue;
let blendMode = Shaku.gfx.BlendModes.Multiply;
let rotation = Math.PI / 4;
let origin = new Shaku.utils.Vector2(0.5, 0.5);
Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
```
<a name="Gfx+draw"></a>

### gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin, skew)
Draw a texture.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | [<code>TextureAsset</code>](#TextureAsset) | Texture to draw. |
| position | [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3) | Drawing position (at origin). If vector3 is provided, will pass z value to the shader code position attribute. |
| size | [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3) \| <code>Number</code> | Drawing size. If vector3 is provided, will pass z value to the shader code position attribute for the bottom vertices, as position.z + size.z. |
| sourceRect | [<code>Rectangle</code>](#Rectangle) | Source rectangle, or undefined to use the entire texture. |
| color | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color) | Tint color, or undefined to not change color. If array is set, will assign each color to different vertex, starting from top-left. |
| blendMode | <code>BlendModes</code> | Blend mode, or undefined to use alpha blend. |
| rotation | <code>Number</code> | Rotate sprite. |
| origin | [<code>Vector2</code>](#Vector2) | Drawing origin. This will be the point at 'position' and rotation origin. |
| skew | [<code>Vector2</code>](#Vector2) | Skew the drawing corners on X and Y axis, around the origin point. |

**Example**  
```js
// a simple draw with position and size
let texture = await Shaku.assets.loadTexture('assets/sprite.png');
let position = new Shaku.utils.Vector2(100, 100);
let size = new Shaku.utils.Vector2(75, 125); // if width == height, you can pass as a number instead of vector
Shaku.gfx.draw(texture, position, size);
```
**Example**  
```js
// draw with additional params
let sourceRect = new Shaku.utils.Rectangle(0, 0, 64, 64);
let color = Shaku.utils.Color.blue;
let blendMode = Shaku.gfx.BlendModes.Multiply;
let rotation = Math.PI / 4;
let origin = new Shaku.utils.Vector2(0.5, 0.5);
Shaku.gfx.draw(texture, position, size, sourceRect, color, blendMode, rotation, origin);
```
<a name="Gfx+drawQuadFromVertices"></a>

### gfx.drawQuadFromVertices(texture, vertices, blendMode)
Draw a textured quad from vertices.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| texture | [<code>TextureAsset</code>](#TextureAsset) | Texture to draw. |
| vertices | [<code>Array.&lt;Vertex&gt;</code>](#Vertex) | Quad vertices to draw (should be: top-left, top-right, bottom-left, bottom-right). |
| blendMode | <code>BlendModes</code> | Blend mode to set. |

<a name="Gfx+fillRect"></a>

### gfx.fillRect(destRect, color, blend, rotation)
Draw a filled colored rectangle.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| destRect | [<code>Rectangle</code>](#Rectangle) | Rectangle to fill. |
| color | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color) | Rectangle fill color. |
| blend | <code>BlendModes</code> | Blend mode. |
| rotation | <code>Number</code> | Rotate the rectangle around its center. |

**Example**  
```js
// draw a 50x50 red rectangle at position 100x100, that will rotate over time
Shaku.gfx.fillRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
```
<a name="Gfx+fillRects"></a>

### gfx.fillRects(destRects, colors, blend, rotation)
Draw a list of filled colored rectangles as a batch.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| destRects | [<code>Array.&lt;Rectangle&gt;</code>](#Rectangle) | Rectangles to fill. |
| colors | [<code>Array.&lt;Color&gt;</code>](#Color) \| [<code>Color</code>](#Color) | Rectangles fill color. If array is set, will assign each color to different vertex, starting from top-left. |
| blend | <code>BlendModes</code> | Blend mode. |
| rotation | <code>Array.&lt;Number&gt;</code> \| <code>Number</code> | Rotate the rectangles around its center. |

**Example**  
```js
// draw a 50x50 red rectangle at position 100x100, that will rotate over time
Shaku.gfx.fillRects([new Shaku.utils.Rectangle(100, 100, 50, 50), new Shaku.utils.Rectangle(150, 150, 25, 25)], Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
```
<a name="Gfx+outlineRect"></a>

### gfx.outlineRect(destRect, color, [blend], [rotation])
Draw an outline colored rectangle.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| destRect | [<code>Rectangle</code>](#Rectangle) | Rectangle to draw outline for. |
| color | [<code>Color</code>](#Color) | Rectangle outline color. |
| [blend] | <code>BlendModes</code> | Blend mode. |
| [rotation] | <code>Number</code> | Rotate the rectangle around its center. |

**Example**  
```js
// draw a 50x50 red rectangle at position 100x100, that will rotate over time
Shaku.gfx.outlineRect(new Shaku.utils.Rectangle(100, 100, 50, 50), Shaku.utils.Color.red, null, Shaku.gameTime.elapsed);
```
<a name="Gfx+outlineCircle"></a>

### gfx.outlineCircle(circle, color, blend, lineAmount)
Draw an outline colored circle.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| circle | [<code>Circle</code>](#Circle) | Circle to draw. |
| color | [<code>Color</code>](#Color) | Circle outline color. |
| blend | <code>BlendModes</code> | Blend mode. |
| lineAmount | <code>Number</code> | How many lines to compose the circle from (bigger number = smoother circle). |

**Example**  
```js
// draw a circle at 50x50 with radius of 85
Shaku.gfx.outlineCircle(new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), Shaku.utils.Color.red);
```
<a name="Gfx+fillCircle"></a>

### gfx.fillCircle(circle, color, blend, lineAmount)
Draw a filled colored circle.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| circle | [<code>Circle</code>](#Circle) | Circle to draw. |
| color | [<code>Color</code>](#Color) | Circle fill color. |
| blend | <code>BlendModes</code> | Blend mode. |
| lineAmount | <code>Number</code> | How many lines to compose the circle from (bigger number = smoother circle). |

**Example**  
```js
// draw a filled circle at 50x50 with radius of 85
Shaku.gfx.fillCircle(new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), Shaku.utils.Color.red);
```
<a name="Gfx+fillCircles"></a>

### gfx.fillCircles(circles, colors, blend, lineAmount)
Draw a list of filled colored circles using batches.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| circles | [<code>Array.&lt;Circle&gt;</code>](#Circle) | Circles list to draw. |
| colors | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color) | Circles fill color or a single color for all circles. |
| blend | <code>BlendModes</code> | Blend mode. |
| lineAmount | <code>Number</code> | How many lines to compose the circle from (bigger number = smoother circle). |

**Example**  
```js
// draw a filled circle at 50x50 with radius of 85
Shaku.gfx.fillCircles([new Shaku.utils.Circle(new Shaku.utils.Vector2(50, 50), 85), new Shaku.utils.Circle(new Shaku.utils.Vector2(150, 125), 35)], Shaku.utils.Color.red);
```
<a name="Gfx+drawLine"></a>

### gfx.drawLine(startPoint, endPoint, color, blendMode)
Draw a single line between two points.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| startPoint | [<code>Vector2</code>](#Vector2) | Line start point. |
| endPoint | [<code>Vector2</code>](#Vector2) | Line end point. |
| color | [<code>Color</code>](#Color) | Line color. |
| blendMode | <code>BlendModes</code> | Blend mode to draw lines with (default to Opaque). |

**Example**  
```js
Shaku.gfx.drawLine(new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), Shaku.utils.Color.red);
```
<a name="Gfx+drawLinesStrip"></a>

### gfx.drawLinesStrip(points, colors, blendMode, looped)
Draw a strip of lines between an array of points.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| points | [<code>Array.&lt;Vector2&gt;</code>](#Vector2) | Points to draw line between. |
| colors | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color) | Single lines color if you want one color for all lines, or an array of colors per segment. |
| blendMode | <code>BlendModes</code> | Blend mode to draw lines with (default to Opaque). |
| looped | <code>Boolean</code> | If true, will also draw a line from last point back to first point. |

**Example**  
```js
let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
Shaku.gfx.drawLinesStrip(lines, colors);
```
<a name="Gfx+drawLines"></a>

### gfx.drawLines(points, colors, blendMode)
Draw a list of lines from an array of points.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| points | [<code>Array.&lt;Vector2&gt;</code>](#Vector2) | Points to draw line between. |
| colors | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color) | Single lines color if you want one color for all lines, or an array of colors per segment. |
| blendMode | <code>BlendModes</code> | Blend mode to draw lines with (default to Opaque). |

**Example**  
```js
let lines = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
Shaku.gfx.drawLines(lines, colors);
```
<a name="Gfx+drawPoint"></a>

### gfx.drawPoint(point, color, blendMode)
Draw a single point from vector.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| point | [<code>Vector2</code>](#Vector2) | Point to draw. |
| color | [<code>Color</code>](#Color) | Point color. |
| blendMode | <code>BlendModes</code> | Blend mode to draw point with (default to Opaque). |

**Example**  
```js
Shaku.gfx.drawPoint(new Shaku.utils.Vector2(50,50), Shaku.utils.Color.random());
```
<a name="Gfx+drawPoints"></a>

### gfx.drawPoints(points, colors, blendMode)
Draw a list of points from an array of vectors.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| points | [<code>Array.&lt;Vector2&gt;</code>](#Vector2) | Points to draw. |
| colors | [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color) | Single color if you want one color for all points, or an array of colors per point. |
| blendMode | <code>BlendModes</code> | Blend mode to draw points with (default to Opaque). |

**Example**  
```js
let points = [new Shaku.utils.Vector2(50,50), new Shaku.utils.Vector2(150,50), new Shaku.utils.Vector2(150,150)];
let colors = [Shaku.utils.Color.random(), Shaku.utils.Color.random(), Shaku.utils.Color.random()];
Shaku.gfx.drawPoints(points, colors);
```
<a name="Gfx+centerCanvas"></a>

### gfx.centerCanvas()
Make the renderer canvas centered.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
<a name="Gfx+inScreen"></a>

### gfx.inScreen(shape) ⇒ <code>Boolean</code>
Check if a given shape is currently in screen bounds, not taking camera into consideration.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
**Returns**: <code>Boolean</code> - True if given shape is in visible region.  

| Param | Type | Description |
| --- | --- | --- |
| shape | [<code>Circle</code>](#Circle) \| <code>Vector</code> \| [<code>Rectangle</code>](#Rectangle) \| [<code>Line</code>](#Line) | Shape to check. |

<a name="Gfx+centerCamera"></a>

### gfx.centerCamera(position, useCanvasSize)
Make a given vector the center of the camera.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) | Camera position. |
| useCanvasSize | <code>Boolean</code> | If true, will always use cancas size when calculating center. If false and render target is set, will use render target's size. |

<a name="Gfx+clear"></a>

### gfx.clear(color)
Clear screen to a given color.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  

| Param | Type | Description |
| --- | --- | --- |
| color | [<code>Color</code>](#Color) | Color to clear screen to, or black if not set. |

**Example**  
```js
Shaku.gfx.clear(Shaku.utils.Color.cornflowerblue);
```
<a name="Gfx+presentBufferedData"></a>

### gfx.presentBufferedData()
Present all currently buffered data.

**Kind**: instance method of [<code>Gfx</code>](#Gfx)  
<a name="Matrix"></a>

## Matrix
Implements a matrix.

**Kind**: global class  

* [Matrix](#Matrix)
    * [new Matrix(values, cloneValues)](#new_Matrix_new)
    * _instance_
        * [.set()](#Matrix+set)
        * [.clone()](#Matrix+clone) ⇒ [<code>Matrix</code>](#Matrix)
        * [.equals(other)](#Matrix+equals) ⇒ <code>Boolean</code>
    * _static_
        * [.orthographic()](#Matrix.orthographic) ⇒ [<code>Matrix</code>](#Matrix)
        * [.perspective()](#Matrix.perspective) ⇒ [<code>Matrix</code>](#Matrix)
        * [.translate()](#Matrix.translate) ⇒ [<code>Matrix</code>](#Matrix)
        * [.scale()](#Matrix.scale) ⇒ [<code>Matrix</code>](#Matrix)
        * [.rotateX()](#Matrix.rotateX) ⇒ [<code>Matrix</code>](#Matrix)
        * [.rotateY()](#Matrix.rotateY) ⇒ [<code>Matrix</code>](#Matrix)
        * [.rotateZ()](#Matrix.rotateZ) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiply()](#Matrix.multiply) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiplyMany(matrices)](#Matrix.multiplyMany) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiplyIntoFirst()](#Matrix.multiplyIntoFirst) ⇒ [<code>Matrix</code>](#Matrix)
        * [.multiplyManyIntoFirst(matrices)](#Matrix.multiplyManyIntoFirst) ⇒ [<code>Matrix</code>](#Matrix)
        * [.transformVertex(matrix, vertex)](#Matrix.transformVertex) ⇒ [<code>Vertex</code>](#Vertex)
        * [.transformVector2(matrix, vector)](#Matrix.transformVector2) ⇒ [<code>Vector2</code>](#Vector2)
        * [.transformVector3(matrix, vector)](#Matrix.transformVector3) ⇒ [<code>Vector3</code>](#Vector3)

<a name="new_Matrix_new"></a>

### new Matrix(values, cloneValues)
Create the matrix.


| Param | Description |
| --- | --- |
| values | matrix values array. |
| cloneValues | if true or undefined, will clone values instead of just holding a reference to them. |

<a name="Matrix+set"></a>

### matrix.set()
Set the matrix values.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
<a name="Matrix+clone"></a>

### matrix.clone() ⇒ [<code>Matrix</code>](#Matrix)
Clone the matrix.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - Cloned matrix.  
<a name="Matrix+equals"></a>

### matrix.equals(other) ⇒ <code>Boolean</code>
Compare this matrix to another matrix.

**Kind**: instance method of [<code>Matrix</code>](#Matrix)  
**Returns**: <code>Boolean</code> - If matrices are the same.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Matrix</code>](#Matrix) | Matrix to compare to. |

<a name="Matrix.orthographic"></a>

### Matrix.orthographic() ⇒ [<code>Matrix</code>](#Matrix)
Create an orthographic projection matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.perspective"></a>

### Matrix.perspective() ⇒ [<code>Matrix</code>](#Matrix)
Create a perspective projection matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.translate"></a>

### Matrix.translate() ⇒ [<code>Matrix</code>](#Matrix)
Create a translation matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.scale"></a>

### Matrix.scale() ⇒ [<code>Matrix</code>](#Matrix)
Create a scale matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.rotateX"></a>

### Matrix.rotateX() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around X axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.rotateY"></a>

### Matrix.rotateY() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around Y axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.rotateZ"></a>

### Matrix.rotateZ() ⇒ [<code>Matrix</code>](#Matrix)
Create a rotation matrix around Z axis.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.multiply"></a>

### Matrix.multiply() ⇒ [<code>Matrix</code>](#Matrix)
Multiply two matrices.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - a new matrix with result.  
<a name="Matrix.multiplyMany"></a>

### Matrix.multiplyMany(matrices) ⇒ [<code>Matrix</code>](#Matrix)
Multiply an array of matrices.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - new matrix with multiply result.  

| Param | Type | Description |
| --- | --- | --- |
| matrices | [<code>Array.&lt;Matrix&gt;</code>](#Matrix) | Matrices to multiply. |

<a name="Matrix.multiplyIntoFirst"></a>

### Matrix.multiplyIntoFirst() ⇒ [<code>Matrix</code>](#Matrix)
Multiply two matrices and put result in first matrix.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - matrixA, after it was modified.  
<a name="Matrix.multiplyManyIntoFirst"></a>

### Matrix.multiplyManyIntoFirst(matrices) ⇒ [<code>Matrix</code>](#Matrix)
Multiply an array of matrices into the first matrix in the array.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Matrix</code>](#Matrix) - first matrix in array, after it was modified.  

| Param | Type | Description |
| --- | --- | --- |
| matrices | [<code>Array.&lt;Matrix&gt;</code>](#Matrix) | Matrices to multiply. |

<a name="Matrix.transformVertex"></a>

### Matrix.transformVertex(matrix, vertex) ⇒ [<code>Vertex</code>](#Vertex)
Transform a 2d vertex.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Vertex</code>](#Vertex) - A transformed vertex (cloned, not the original).  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to use to transform vector. |
| vertex | [<code>Vertex</code>](#Vertex) | Vertex to transform. |

<a name="Matrix.transformVector2"></a>

### Matrix.transformVector2(matrix, vector) ⇒ [<code>Vector2</code>](#Vector2)
Transform a 2d vector.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Vector2</code>](#Vector2) - Transformed vector.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to use to transform vector. |
| vector | [<code>Vector2</code>](#Vector2) | Vector to transform. |

<a name="Matrix.transformVector3"></a>

### Matrix.transformVector3(matrix, vector) ⇒ [<code>Vector3</code>](#Vector3)
Transform a 3d vector.

**Kind**: static method of [<code>Matrix</code>](#Matrix)  
**Returns**: [<code>Vector3</code>](#Vector3) - Transformed vector.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Matrix to use to transform vector. |
| vector | [<code>Vector3</code>](#Vector3) | Vector to transform. |

<a name="Mesh"></a>

## Mesh
Class to hold a mesh.

**Kind**: global class  

* [Mesh](#Mesh)
    * [new Mesh(positions, textureCoords, colorss, indices, indicesCount)](#new_Mesh_new)
    * [.overrideColors(gl, color)](#Mesh+overrideColors)

<a name="new_Mesh_new"></a>

### new Mesh(positions, textureCoords, colorss, indices, indicesCount)
Create the mesh object.


| Param | Type | Description |
| --- | --- | --- |
| positions | <code>WebGLBuffer</code> | vertices positions buffer. |
| textureCoords | <code>WebGLBuffer</code> | vertices texture coords buffer. |
| colorss | <code>WebGLBuffer</code> | vertices colors buffer. |
| indices | <code>WebGLBuffer</code> | indices buffer. |
| indicesCount | <code>Number</code> | how many indices we have. |

<a name="Mesh+overrideColors"></a>

### mesh.overrideColors(gl, color)
Override the colors buffer, if possible.

**Kind**: instance method of [<code>Mesh</code>](#Mesh)  

| Param | Type | Description |
| --- | --- | --- |
| gl | <code>WebGl</code> | WebGL context. |
| color | [<code>Color</code>](#Color) | Color to set. |

<a name="Sprite"></a>

## Sprite
Sprite class.
This object is a helper class to hold all the properties of a texture to render.

**Kind**: global class  

* [Sprite](#Sprite)
    * [new Sprite(texture, [sourceRect])](#new_Sprite_new)
    * [.texture](#Sprite+texture) : [<code>TextureAsset</code>](#TextureAsset)
    * [.position](#Sprite+position) : [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3)
    * [.size](#Sprite+size) : [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3)
    * [.sourceRect](#Sprite+sourceRect) : [<code>Rectangle</code>](#Rectangle)
    * [.blendMode](#Sprite+blendMode) : <code>BlendModes</code>
    * [.rotation](#Sprite+rotation) : <code>Number</code>
    * [.origin](#Sprite+origin) : [<code>Vector2</code>](#Vector2)
    * [.skew](#Sprite+skew) : [<code>Vector2</code>](#Vector2)
    * [.color](#Sprite+color) : [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color)
    * [.static](#Sprite+static) : <code>Boolean</code>
    * [.flipX](#Sprite+flipX) ⇒ <code>Boolean</code>
    * [.flipX](#Sprite+flipX)
    * [.flipY](#Sprite+flipY) ⇒ <code>Boolean</code>
    * [.flipY](#Sprite+flipY)
    * [.setSourceFromSpritesheet(index, spritesCount, [margin], [setSize])](#Sprite+setSourceFromSpritesheet)
    * [.clone()](#Sprite+clone) ⇒ [<code>Sprite</code>](#Sprite)
    * [.updateStaticProperties()](#Sprite+updateStaticProperties)

<a name="new_Sprite_new"></a>

### new Sprite(texture, [sourceRect])
Create the texture object.


| Param | Type | Description |
| --- | --- | --- |
| texture | [<code>TextureAsset</code>](#TextureAsset) | Texture asset. |
| [sourceRect] | [<code>Rectangle</code>](#Rectangle) | Optional source rect. |

<a name="Sprite+texture"></a>

### sprite.texture : [<code>TextureAsset</code>](#TextureAsset)
Texture to use for this sprite.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+position"></a>

### sprite.position : [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3)
Sprite position.
If Vector3 is provided, the z value will be passed to vertices position in shader code.
This property is locked when static=true.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+size"></a>

### sprite.size : [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3)
Sprite size.
If Vector3 is provided, the z value will be passed to the bottom vertices position in shader code, as position.z + size.z.
This property is locked when static=true.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+sourceRect"></a>

### sprite.sourceRect : [<code>Rectangle</code>](#Rectangle)
Sprite source rectangle in texture.
Null will take entire texture.
This property is locked when static=true.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+blendMode"></a>

### sprite.blendMode : <code>BlendModes</code>
Sprite blend mode.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+rotation"></a>

### sprite.rotation : <code>Number</code>
Sprite rotation in radians.
This property is locked when static=true.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+origin"></a>

### sprite.origin : [<code>Vector2</code>](#Vector2)
Sprite origin point.
This property is locked when static=true.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+skew"></a>

### sprite.skew : [<code>Vector2</code>](#Vector2)
Skew the sprite corners on X and Y axis, around the origin point.
This property is locked when static=true.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+color"></a>

### sprite.color : [<code>Color</code>](#Color) \| [<code>Array.&lt;Color&gt;</code>](#Color)
Sprite color.
If array is set, will assign each color to different vertex, starting from top-left.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+static"></a>

### sprite.static : <code>Boolean</code>
Is this a static sprite.
Static sprites will only calculate vertices properties once, and reuse them in following render calls.
This will improve performance, but also means that once the sprite is rendered once, changing things like position, size, rotation, etc.
won't affect the output. To refresh the properties of a static sprite, you need to call updateStaticProperties() manually.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
<a name="Sprite+flipX"></a>

### sprite.flipX ⇒ <code>Boolean</code>
Check if this sprite is flipped around X axis.
This is just a sugarcoat that returns if size.x < 0.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
**Returns**: <code>Boolean</code> - If sprite is flipped on X axis.  
<a name="Sprite+flipX"></a>

### sprite.flipX
Flip sprite around X axis.
This is just a sugarcoat that set size.x to negative or positive value, without changing its scale.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  

| Param | Type | Description |
| --- | --- | --- |
| flip | <code>Boolean</code> | Should we flip the sprite around X axis. If undefined, will take the negative of flipX current value, ie will toggle flipping. |

<a name="Sprite+flipY"></a>

### sprite.flipY ⇒ <code>Boolean</code>
Check if this sprite is flipped around y axis.
This is just a sugarcoat that returns if size.y < 0.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  
**Returns**: <code>Boolean</code> - If sprite is flipped on Y axis.  
<a name="Sprite+flipY"></a>

### sprite.flipY
Flip sprite around Y axis.
This is just a sugarcoat that set size.y to negative or positive value, without changing its scale.

**Kind**: instance property of [<code>Sprite</code>](#Sprite)  

| Param | Type | Description |
| --- | --- | --- |
| flip | <code>Boolean</code> | Should we flip the sprite around Y axis. If undefined, will take the negative of flipY current value, ie will toggle flipping. |

<a name="Sprite+setSourceFromSpritesheet"></a>

### sprite.setSourceFromSpritesheet(index, spritesCount, [margin], [setSize])
Set the source Rectangle automatically from spritesheet.
This method get sprite index in sheet and how many sprites there are in total, and calculate the desired
offset and size in source Rectangle based on it + source image size.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  

| Param | Type | Description |
| --- | --- | --- |
| index | [<code>Vector2</code>](#Vector2) | Sprite index in spritesheet. |
| spritesCount | [<code>Vector2</code>](#Vector2) | How many sprites there are in spritesheet in total. |
| [margin] | <code>Number</code> | How many pixels to trim from the tile (default is 0). |
| [setSize] | <code>Boolean</code> | If true will also set width and height based on source rectangle (default is true). |

<a name="Sprite+clone"></a>

### sprite.clone() ⇒ [<code>Sprite</code>](#Sprite)
Clone this sprite.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  
**Returns**: [<code>Sprite</code>](#Sprite) - cloned sprite.  
<a name="Sprite+updateStaticProperties"></a>

### sprite.updateStaticProperties()
Manually update the static properties (position, size, rotation, origin, source rectangle, etc.) of a static sprite.

**Kind**: instance method of [<code>Sprite</code>](#Sprite)  
<a name="SpriteBatch"></a>

## SpriteBatch
Sprite batch renderer, responsible on drawing a batch of sprites with as little draw calls as possible.

**Kind**: global class  

* [SpriteBatch](#SpriteBatch)
    * [new SpriteBatch(gfx)](#new_SpriteBatch_new)
    * [.snapPixels](#SpriteBatch+snapPixels)
    * [.applyAntiBleeding](#SpriteBatch+applyAntiBleeding)
    * [.drawing](#SpriteBatch+drawing) ⇒ <code>Boolean</code>
    * [.batchSpritesCount](#SpriteBatch+batchSpritesCount)
    * [.vertex(position, textureCoord, color)](#SpriteBatch+vertex) ⇒ [<code>Vertex</code>](#Vertex)
    * [.begin(effect, transform)](#SpriteBatch+begin)
    * [.end()](#SpriteBatch+end)
    * [.setTexture(texture)](#SpriteBatch+setTexture)
    * [.draw(sprites, cullOutOfScreen)](#SpriteBatch+draw)
    * [.pushVertices(vertices)](#SpriteBatch+pushVertices)

<a name="new_SpriteBatch_new"></a>

### new SpriteBatch(gfx)
Create the spritebatch.


| Param | Type | Description |
| --- | --- | --- |
| gfx | [<code>Gfx</code>](#Gfx) | Gfx manager. |

<a name="SpriteBatch+snapPixels"></a>

### spriteBatch.snapPixels
If true, will floor vertices positions before pushing them to batch.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+applyAntiBleeding"></a>

### spriteBatch.applyAntiBleeding
If true, will slightly offset texture uv when rotating sprites, to prevent bleeding while using texture atlas.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+drawing"></a>

### spriteBatch.drawing ⇒ <code>Boolean</code>
Get if batch is currently drawing.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
**Returns**: <code>Boolean</code> - True if batch is drawing.  
<a name="SpriteBatch+batchSpritesCount"></a>

### spriteBatch.batchSpritesCount
How many sprites we can have in batch, in total.

**Kind**: instance property of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+vertex"></a>

### spriteBatch.vertex(position, textureCoord, color) ⇒ [<code>Vertex</code>](#Vertex)
Create and return a new vertex.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  
**Returns**: [<code>Vertex</code>](#Vertex) - new vertex object.  

| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) | Vertex position. |
| textureCoord | [<code>Vector2</code>](#Vector2) | Vertex texture coord. |
| color | [<code>Color</code>](#Color) | Vertex color. |

<a name="SpriteBatch+begin"></a>

### spriteBatch.begin(effect, transform)
Start drawing a batch.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| effect | [<code>Effect</code>](#Effect) | Effect to use. |
| transform | [<code>Matrix</code>](#Matrix) | Optional transformations to apply on all sprites. |

<a name="SpriteBatch+end"></a>

### spriteBatch.end()
Finish drawing batch (and render whatever left in buffers).

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  
<a name="SpriteBatch+setTexture"></a>

### spriteBatch.setTexture(texture)
Set the currently active texture.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| texture | <code>Texture</code> | Texture to set. |

<a name="SpriteBatch+draw"></a>

### spriteBatch.draw(sprites, cullOutOfScreen)
Add sprite to batch.
Note: changing texture or blend mode may trigger a draw call.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| sprites | [<code>Sprite</code>](#Sprite) \| [<code>Array.&lt;Sprite&gt;</code>](#Sprite) | Sprite or multiple sprites to draw. |
| cullOutOfScreen | <code>Boolean</code> | If true, will cull sprites that are not visible. |

<a name="SpriteBatch+pushVertices"></a>

### spriteBatch.pushVertices(vertices)
Push vertices directly to batch.

**Kind**: instance method of [<code>SpriteBatch</code>](#SpriteBatch)  

| Param | Type | Description |
| --- | --- | --- |
| vertices | [<code>Array.&lt;Vertex&gt;</code>](#Vertex) | Vertices to push. |

<a name="SpritesGroup"></a>

## SpritesGroup
Sprites group class.
This object is a container to hold sprites collection + parent transformations.
You need SpritesGroup to use batched rendering.

**Kind**: global class  

* [SpritesGroup](#SpritesGroup)
    * [new SpritesGroup()](#new_SpritesGroup_new)
    * [.count](#SpritesGroup+count) ⇒ <code>Number</code>
    * [.forEach(callback)](#SpritesGroup+forEach)
    * [.setColor(color)](#SpritesGroup+setColor)
    * [.getTransform()](#SpritesGroup+getTransform) ⇒ [<code>Matrix</code>](#Matrix)
    * [.add(sprite)](#SpritesGroup+add) ⇒ [<code>Sprite</code>](#Sprite)
    * [.remove(sprite)](#SpritesGroup+remove)
    * [.shift()](#SpritesGroup+shift) ⇒ [<code>Sprite</code>](#Sprite)
    * [.sort(compare)](#SpritesGroup+sort)
    * [.sortForBatching()](#SpritesGroup+sortForBatching)

<a name="new_SpritesGroup_new"></a>

### new SpritesGroup()
Create the group object.

<a name="SpritesGroup+count"></a>

### spritesGroup.count ⇒ <code>Number</code>
Sprites count in group.

**Kind**: instance property of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: <code>Number</code> - Number of sprites in group.  
<a name="SpritesGroup+forEach"></a>

### spritesGroup.forEach(callback)
Iterate all sprites.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback to run on all sprites in group. |

<a name="SpritesGroup+setColor"></a>

### spritesGroup.setColor(color)
Set color for all sprites in group.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| color | [<code>Color</code>](#Color) | Color to set. |

<a name="SpritesGroup+getTransform"></a>

### spritesGroup.getTransform() ⇒ [<code>Matrix</code>](#Matrix)
Get group's transformations.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: [<code>Matrix</code>](#Matrix) - Transformations matrix, or null if there's nothing to apply.  
<a name="SpritesGroup+add"></a>

### spritesGroup.add(sprite) ⇒ [<code>Sprite</code>](#Sprite)
Adds a sprite to group.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: [<code>Sprite</code>](#Sprite) - The newly added sprite.  

| Param | Type | Description |
| --- | --- | --- |
| sprite | [<code>Sprite</code>](#Sprite) | Sprite to add. |

<a name="SpritesGroup+remove"></a>

### spritesGroup.remove(sprite)
Remove a sprite from group.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| sprite | [<code>Sprite</code>](#Sprite) | Sprite to remove. |

<a name="SpritesGroup+shift"></a>

### spritesGroup.shift() ⇒ [<code>Sprite</code>](#Sprite)
Shift first sprite element.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  
**Returns**: [<code>Sprite</code>](#Sprite) - The removed sprite.  
<a name="SpritesGroup+sort"></a>

### spritesGroup.sort(compare)
Sort sprites.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  

| Param | Type | Description |
| --- | --- | --- |
| compare | <code>function</code> | Comparer method. |

<a name="SpritesGroup+sortForBatching"></a>

### spritesGroup.sortForBatching()
Sort by texture and blend mode for maximum efficiency in batching.
This will change sprites order.

**Kind**: instance method of [<code>SpritesGroup</code>](#SpritesGroup)  
<a name="Vertex"></a>

## Vertex
A vertex we can push to sprite batch.

**Kind**: global class  

* [Vertex](#Vertex)
    * [new Vertex(position, textureCoord, color)](#new_Vertex_new)
    * [.transform(matrix)](#Vertex+transform) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setPosition(position)](#Vertex+setPosition) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setTextureCoords(textureCoord)](#Vertex+setTextureCoords) ⇒ [<code>Vertex</code>](#Vertex)
    * [.setColor(color)](#Vertex+setColor) ⇒ [<code>Vertex</code>](#Vertex)

<a name="new_Vertex_new"></a>

### new Vertex(position, textureCoord, color)
Create the vertex data.


| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3) | Vertex position. |
| textureCoord | [<code>Vector2</code>](#Vector2) | Vertex texture coord (in pixels). |
| color | [<code>Color</code>](#Color) | Vertex color (undefined will default to white). |

<a name="Vertex+transform"></a>

### vertex.transform(matrix) ⇒ [<code>Vertex</code>](#Vertex)
Transform this vertex position from a matrix.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| matrix | [<code>Matrix</code>](#Matrix) | Transformation matrix. |

<a name="Vertex+setPosition"></a>

### vertex.setPosition(position) ⇒ [<code>Vertex</code>](#Vertex)
Set position.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3) | Vertex position. |

<a name="Vertex+setTextureCoords"></a>

### vertex.setTextureCoords(textureCoord) ⇒ [<code>Vertex</code>](#Vertex)
Set texture coordinates.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| textureCoord | [<code>Vector2</code>](#Vector2) | Vertex texture coord (in pixels). |

<a name="Vertex+setColor"></a>

### vertex.setColor(color) ⇒ [<code>Vertex</code>](#Vertex)
Set vertex color.

**Kind**: instance method of [<code>Vertex</code>](#Vertex)  
**Returns**: [<code>Vertex</code>](#Vertex) - this.  

| Param | Type | Description |
| --- | --- | --- |
| color | [<code>Color</code>](#Color) | Vertex color. |

<a name="Input"></a>

## Input
Input manager. 
Used to recieve input from keyboard and mouse.

To access the Input manager use `Shaku.input`.

**Kind**: global class  

* [Input](#Input)
    * [new Input()](#new_Input_new)
    * [.mousePosition](#Input+mousePosition) ⇒ [<code>Vector2</code>](#Vector2)
    * [.prevMousePosition](#Input+prevMousePosition) ⇒ [<code>Vector2</code>](#Vector2)
    * [.mouseDelta](#Input+mouseDelta) ⇒ [<code>Vector2</code>](#Vector2)
    * [.mouseMoving](#Input+mouseMoving) ⇒ <code>Boolean</code>
    * [.shiftDown](#Input+shiftDown) ⇒ <code>Boolean</code>
    * [.ctrlDown](#Input+ctrlDown) ⇒ <code>Boolean</code>
    * [.altDown](#Input+altDown) ⇒ <code>Boolean</code>
    * [.anyKeyPressed](#Input+anyKeyPressed) ⇒ <code>Boolean</code>
    * [.anyKeyDown](#Input+anyKeyDown) ⇒ <code>Boolean</code>
    * [.anyMouseButtonPressed](#Input+anyMouseButtonPressed) ⇒ <code>Boolean</code>
    * [.anyMouseButtonDown](#Input+anyMouseButtonDown) ⇒ <code>Boolean</code>
    * [.mouseWheelSign](#Input+mouseWheelSign) ⇒ <code>Number</code>
    * [.mouseWheel](#Input+mouseWheel) ⇒ <code>Number</code>
    * [.setTargetElement(element)](#Input+setTargetElement)
    * [.mousePressed(button)](#Input+mousePressed) ⇒ <code>Boolean</code>
    * [.mouseDown(button)](#Input+mouseDown) ⇒ <code>Boolean</code>
    * [.mouseUp(button)](#Input+mouseUp) ⇒ <code>Boolean</code>
    * [.mouseReleased(button)](#Input+mouseReleased) ⇒ <code>Boolean</code>
    * [.keyDown(key)](#Input+keyDown) ⇒ <code>boolean</code>
    * [.keyUp(key)](#Input+keyUp) ⇒ <code>Boolean</code>
    * [.keyReleased(button)](#Input+keyReleased) ⇒ <code>Boolean</code>
    * [.keyPressed(key)](#Input+keyPressed) ⇒ <code>Boolean</code>
    * [.down(code)](#Input+down) ⇒ <code>Boolean</code>
    * [.released(code)](#Input+released) ⇒ <code>Boolean</code>
    * [.pressed(code)](#Input+pressed) ⇒ <code>Boolean</code>

<a name="new_Input_new"></a>

### new Input()
Create the manager.

<a name="Input+mousePosition"></a>

### input.mousePosition ⇒ [<code>Vector2</code>](#Vector2)
Get mouse position.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: [<code>Vector2</code>](#Vector2) - Mouse position.  
<a name="Input+prevMousePosition"></a>

### input.prevMousePosition ⇒ [<code>Vector2</code>](#Vector2)
Get mouse previous position (before the last endFrame() call).

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: [<code>Vector2</code>](#Vector2) - Mouse position in previous frame.  
<a name="Input+mouseDelta"></a>

### input.mouseDelta ⇒ [<code>Vector2</code>](#Vector2)
Get mouse movement since last endFrame() call.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: [<code>Vector2</code>](#Vector2) - Mouse change since last frame.  
<a name="Input+mouseMoving"></a>

### input.mouseMoving ⇒ <code>Boolean</code>
Get if mouse is currently moving.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse moved since last frame, false otherwise.  
<a name="Input+shiftDown"></a>

### input.shiftDown ⇒ <code>Boolean</code>
Get if any of the shift keys are currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's a shift key pressed down.  
<a name="Input+ctrlDown"></a>

### input.ctrlDown ⇒ <code>Boolean</code>
Get if any of the Ctrl keys are currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's a Ctrl key pressed down.  
<a name="Input+altDown"></a>

### input.altDown ⇒ <code>Boolean</code>
Get if any of the Alt keys are currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's an Alt key pressed down.  
<a name="Input+anyKeyPressed"></a>

### input.anyKeyPressed ⇒ <code>Boolean</code>
Get if any keyboard key was pressed this frame.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if any key was pressed down this frame.  
<a name="Input+anyKeyDown"></a>

### input.anyKeyDown ⇒ <code>Boolean</code>
Get if any keyboard key is currently down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if there's a key pressed down.  
<a name="Input+anyMouseButtonPressed"></a>

### input.anyMouseButtonPressed ⇒ <code>Boolean</code>
Get if any mouse button was pressed this frame.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if any of the mouse buttons were pressed this frame.  
<a name="Input+anyMouseButtonDown"></a>

### input.anyMouseButtonDown ⇒ <code>Boolean</code>
Get if any mouse button is down.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if any of the mouse buttons are pressed.  
<a name="Input+mouseWheelSign"></a>

### input.mouseWheelSign ⇒ <code>Number</code>
Get mouse wheel sign.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Number</code> - Mouse wheel sign (-1 or 1) for wheel scrolling that happened during this frame.
Will return 0 if mouse wheel is not currently being used.  
<a name="Input+mouseWheel"></a>

### input.mouseWheel ⇒ <code>Number</code>
Get mouse wheel value.

**Kind**: instance property of [<code>Input</code>](#Input)  
**Returns**: <code>Number</code> - Mouse wheel value.  
<a name="Input+setTargetElement"></a>

### input.setTargetElement(element)
Set the target element to attach input to. If not called, will just use the entire document.
Must be called *before* initializing Shaku. This can also be a method to invoke while initializing.

**Kind**: instance method of [<code>Input</code>](#Input)  

| Param | Type | Description |
| --- | --- | --- |
| element | <code>Element</code> | Element to attach input to. |

**Example**  
```js
// the following will use whatever canvas the gfx manager uses as input element.
// this means mouse offset will also be relative to this element.
Shaku.input.setTargetElement(() => Shaku.gfx.canvas);
```
<a name="Input+mousePressed"></a>

### input.mousePressed(button) ⇒ <code>Boolean</code>
Get if mouse button was pressed this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse button is currently down, but was up in previous frame.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseDown"></a>

### input.mouseDown(button) ⇒ <code>Boolean</code>
Get if mouse button is currently pressed.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - true if mouse button is currently down, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseUp"></a>

### input.mouseUp(button) ⇒ <code>Boolean</code>
Get if mouse button is currently not down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - true if mouse button is currently up, false otherwise.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+mouseReleased"></a>

### input.mouseReleased(button) ⇒ <code>Boolean</code>
Get if mouse button was released in current frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if mouse was down last frame, but released in current frame.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| button | <code>MouseButtons</code> | <code>0</code> | Button code (defults to MouseButtons.left). |

<a name="Input+keyDown"></a>

### input.keyDown(key) ⇒ <code>boolean</code>
Get if keyboard key is currently pressed down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>boolean</code> - True if keyboard key is currently down, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+keyUp"></a>

### input.keyUp(key) ⇒ <code>Boolean</code>
Get if keyboard key is currently not down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if keyboard key is currently up, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+keyReleased"></a>

### input.keyReleased(button) ⇒ <code>Boolean</code>
Get if a keyboard button was released in current frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key was down last frame, but released in current frame.  

| Param | Type | Description |
| --- | --- | --- |
| button | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+keyPressed"></a>

### input.keyPressed(key) ⇒ <code>Boolean</code>
Get if keyboard key was pressed this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key is currently down, but was up in previous frame.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>KeyboardKeys</code> | Keyboard key code. |

<a name="Input+down"></a>

### input.down(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button is currently down.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button are down.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard or mouse code. Can be array of codes to test if any of them is down.                          For mouse buttons: mouse_left, mouse_right or mouse_middle.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)                          For numbers (0-9): you can use the number. |

<a name="Input+released"></a>

### input.released(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button was released in this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button were down in previous frame, and released this frame.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard or mouse code. Can be array of codes to test if any of them is released.                          For mouse buttons: mouse_left, mouse_right or mouse_middle.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)                          For numbers (0-9): you can use the number. |

<a name="Input+pressed"></a>

### input.pressed(code) ⇒ <code>Boolean</code>
Return if a mouse or keyboard button was pressed in this frame.

**Kind**: instance method of [<code>Input</code>](#Input)  
**Returns**: <code>Boolean</code> - True if key or mouse button where up in previous frame, and pressed this frame.  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> \| <code>Array.&lt;String&gt;</code> | Keyboard or mouse code. Can be array of codes to test if any of them is pressed.                          For mouse buttons: mouse_left, mouse_right or mouse_middle.                          For keyboard buttons: use one of the keys of KeyboardKeys (for example 'a', 'alt', 'up_arrow', etc..)                          For numbers (0-9): you can use the number. |

<a name="Logger"></a>

## Logger
A logger manager.
By default writes logs to console.

**Kind**: global class  

* [Logger](#Logger)
    * [.trace(msg)](#Logger+trace)
    * [.debug(msg)](#Logger+debug)
    * [.info(msg)](#Logger+info)
    * [.warn(msg)](#Logger+warn)
    * [.error(msg)](#Logger+error)
    * [.throwErrorOnWarnings(enable)](#Logger+throwErrorOnWarnings)

<a name="Logger+trace"></a>

### logger.trace(msg)
Write a trace level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+debug"></a>

### logger.debug(msg)
Write a debug level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+info"></a>

### logger.info(msg)
Write an info level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+warn"></a>

### logger.warn(msg)
Write a warning level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+error"></a>

### logger.error(msg)
Write an error level log message.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| msg | <code>String</code> | Message to write. |

<a name="Logger+throwErrorOnWarnings"></a>

### logger.throwErrorOnWarnings(enable)
Set logger to throw an error every time a log message with severity higher than warning is written.

**Kind**: instance method of [<code>Logger</code>](#Logger)  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>Boolean</code> | Set to true to throw error on warnings. |

<a name="IManager"></a>

## IManager
Interface for any manager.
Manager = manages a domain in Shaku, such as gfx (graphics), sfx (sounds), input, etc.

**Kind**: global class  

* [IManager](#IManager)
    * [.setup()](#IManager+setup) ⇒ <code>Promise</code>
    * [.startFrame()](#IManager+startFrame)
    * [.endFrame()](#IManager+endFrame)
    * [.destroy()](#IManager+destroy)

<a name="IManager+setup"></a>

### iManager.setup() ⇒ <code>Promise</code>
Initialize the manager.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
**Returns**: <code>Promise</code> - Promise to resolve when initialization is done.  
<a name="IManager+startFrame"></a>

### iManager.startFrame()
Called every update at the begining of the frame.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
<a name="IManager+endFrame"></a>

### iManager.endFrame()
Called every update at the end of the frame.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
<a name="IManager+destroy"></a>

### iManager.destroy()
Destroy the manager.

**Kind**: instance method of [<code>IManager</code>](#IManager)  
<a name="Sfx"></a>

## Sfx
Sfx manager. 
Used to play sound effects and music.

To access the Sfx manager use `Shaku.sfx`.

**Kind**: global class  

* [Sfx](#Sfx)
    * [new Sfx()](#new_Sfx_new)
    * [.SoundMixer](#Sfx+SoundMixer)
    * [.playingSoundsCount](#Sfx+playingSoundsCount) ⇒ <code>Number</code>
    * [.masterVolume](#Sfx+masterVolume) ⇒ <code>Number</code>
    * [.masterVolume](#Sfx+masterVolume)
    * [.play(sound, volume, playbackRate, preservesPitch)](#Sfx+play)
    * [.stopAll()](#Sfx+stopAll)
    * [.createSound(sound)](#Sfx+createSound) ⇒ [<code>SoundInstance</code>](#SoundInstance)

<a name="new_Sfx_new"></a>

### new Sfx()
Create the manager.

<a name="Sfx+SoundMixer"></a>

### sfx.SoundMixer
Get the SoundMixer class.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  
**See**: SoundMixer  
<a name="Sfx+playingSoundsCount"></a>

### sfx.playingSoundsCount ⇒ <code>Number</code>
Get currently playing sounds count.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  
**Returns**: <code>Number</code> - Number of sounds currently playing.  
<a name="Sfx+masterVolume"></a>

### sfx.masterVolume ⇒ <code>Number</code>
Get master volume.
This affect all sound effects volumes.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  
**Returns**: <code>Number</code> - Current master volume value.  
<a name="Sfx+masterVolume"></a>

### sfx.masterVolume
Set master volume.
This affect all sound effects volumes.

**Kind**: instance property of [<code>Sfx</code>](#Sfx)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Master volume to set. |

<a name="Sfx+play"></a>

### sfx.play(sound, volume, playbackRate, preservesPitch)
Play a sound once without any special properties and without returning a sound instance.
Its a more convinient method to play sounds, but less efficient than 'createSound()' if you want to play multiple times.

**Kind**: instance method of [<code>Sfx</code>](#Sfx)  

| Param | Type | Description |
| --- | --- | --- |
| sound | [<code>SoundAsset</code>](#SoundAsset) | Sound asset to play. |
| volume | <code>Number</code> | Volume to play sound (default to max). |
| playbackRate | <code>Number</code> | Optional playback rate factor. |
| preservesPitch | <code>Boolean</code> | Optional preserve pitch when changing rate factor. |

**Example**  
```js
let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
Shaku.sfx.play(sound, 0.75);
```
<a name="Sfx+stopAll"></a>

### sfx.stopAll()
Stop all playing sounds.

**Kind**: instance method of [<code>Sfx</code>](#Sfx)  
**Example**  
```js
Shaku.sfx.stopAll();
```
<a name="Sfx+createSound"></a>

### sfx.createSound(sound) ⇒ [<code>SoundInstance</code>](#SoundInstance)
Create and return a sound instance you can use to play multiple times.

**Kind**: instance method of [<code>Sfx</code>](#Sfx)  
**Returns**: [<code>SoundInstance</code>](#SoundInstance) - Newly created sound instance.  

| Param | Type | Description |
| --- | --- | --- |
| sound | [<code>SoundAsset</code>](#SoundAsset) | Sound asset to play. |

**Example**  
```js
let sound = await Shaku.assets.loadSound("assets/my_sound.ogg");
let soundInstance = Shaku.sfx.createSound(sound);
soundInstance.play();
```
<a name="SoundInstance"></a>

## SoundInstance
A sound effect instance you can play and stop.

**Kind**: global class  

* [SoundInstance](#SoundInstance)
    * [new SoundInstance(sfxManager, url)](#new_SoundInstance_new)
    * [.playbackRate](#SoundInstance+playbackRate) ⇒ <code>Number</code>
    * [.playbackRate](#SoundInstance+playbackRate)
    * [.preservesPitch](#SoundInstance+preservesPitch) ⇒ <code>Boolean</code>
    * [.preservesPitch](#SoundInstance+preservesPitch)
    * [.loop](#SoundInstance+loop) ⇒ <code>Boolean</code>
    * [.loop](#SoundInstance+loop)
    * [.volume](#SoundInstance+volume) ⇒ <code>Number</code>
    * [.volume](#SoundInstance+volume)
    * [.currentTime](#SoundInstance+currentTime) ⇒ <code>Number</code>
    * [.currentTime](#SoundInstance+currentTime)
    * [.duration](#SoundInstance+duration) ⇒ <code>Number</code>
    * [.paused](#SoundInstance+paused) ⇒ <code>Boolean</code>
    * [.playing](#SoundInstance+playing) ⇒ <code>Boolean</code>
    * [.finished](#SoundInstance+finished) ⇒ <code>Boolean</code>
    * [.disposeWhenDone()](#SoundInstance+disposeWhenDone)
    * [.dispose()](#SoundInstance+dispose)
    * [.play()](#SoundInstance+play)
    * [.pause()](#SoundInstance+pause)
    * [.replay()](#SoundInstance+replay)
    * [.stop()](#SoundInstance+stop)

<a name="new_SoundInstance_new"></a>

### new SoundInstance(sfxManager, url)
Create a sound instance.


| Param | Type | Description |
| --- | --- | --- |
| sfxManager | [<code>Sfx</code>](#Sfx) | Sfx manager instance. |
| url | <code>String</code> | Sound URL or source. |

<a name="SoundInstance+playbackRate"></a>

### soundInstance.playbackRate ⇒ <code>Number</code>
Get sound effect playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Playback rate.  
<a name="SoundInstance+playbackRate"></a>

### soundInstance.playbackRate
Set playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | Playback value to set. |

<a name="SoundInstance+preservesPitch"></a>

### soundInstance.preservesPitch ⇒ <code>Boolean</code>
Get if to preserve pitch while changing playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - Preserve pitch state of the sound instance.  
<a name="SoundInstance+preservesPitch"></a>

### soundInstance.preservesPitch
Set if to preserve pitch while changing playback rate.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Boolean</code> | New preserve pitch value to set. |

<a name="SoundInstance+loop"></a>

### soundInstance.loop ⇒ <code>Boolean</code>
Get if playing in loop.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - If this sound should play in loop.  
<a name="SoundInstance+loop"></a>

### soundInstance.loop
Set if playing in loop.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Boolean</code> | If this sound should play in loop. |

<a name="SoundInstance+volume"></a>

### soundInstance.volume ⇒ <code>Number</code>
Get volume.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Sound effect volume.  
<a name="SoundInstance+volume"></a>

### soundInstance.volume
Set volume.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Sound effect volume to set. |

<a name="SoundInstance+currentTime"></a>

### soundInstance.currentTime ⇒ <code>Number</code>
Get current time in track.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Current time in playing sound.  
<a name="SoundInstance+currentTime"></a>

### soundInstance.currentTime
Set current time in track.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Set current playing time in sound track. |

<a name="SoundInstance+duration"></a>

### soundInstance.duration ⇒ <code>Number</code>
Get track duration.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Number</code> - Sound duration in seconds.  
<a name="SoundInstance+paused"></a>

### soundInstance.paused ⇒ <code>Boolean</code>
Get if sound is currently paused.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - True if sound is currently paused.  
<a name="SoundInstance+playing"></a>

### soundInstance.playing ⇒ <code>Boolean</code>
Get if sound is currently playing.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - True if sound is currently playing.  
<a name="SoundInstance+finished"></a>

### soundInstance.finished ⇒ <code>Boolean</code>
Get if finished playing.

**Kind**: instance property of [<code>SoundInstance</code>](#SoundInstance)  
**Returns**: <code>Boolean</code> - True if sound reached the end and didn't loop.  
<a name="SoundInstance+disposeWhenDone"></a>

### soundInstance.disposeWhenDone()
Dispose the audio object when done playing the sound.
This will call dispose() automatically when audio ends.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+dispose"></a>

### soundInstance.dispose()
Dispose the audio object and clear its resources.
When playing lots of sounds its important to call dispose on sounds you no longer use, to avoid getting hit by
"Blocked attempt to create a WebMediaPlayer" exception.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+play"></a>

### soundInstance.play()
Play sound.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+pause"></a>

### soundInstance.pause()
Pause the sound.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+replay"></a>

### soundInstance.replay()
Replay sound from start.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundInstance+stop"></a>

### soundInstance.stop()
Stop the sound and go back to start.

**Kind**: instance method of [<code>SoundInstance</code>](#SoundInstance)  
<a name="SoundMixer"></a>

## SoundMixer
A utility class to mix between two sounds.

**Kind**: global class  

* [SoundMixer](#SoundMixer)
    * [new SoundMixer(sound1, sound2, allowOverlapping)](#new_SoundMixer_new)
    * [.fromSound](#SoundMixer+fromSound) ⇒ [<code>SoundInstance</code>](#SoundInstance)
    * [.toSound](#SoundMixer+toSound) ⇒ [<code>SoundInstance</code>](#SoundInstance)
    * [.progress](#SoundMixer+progress) ⇒ <code>Number</code>
    * [.stop()](#SoundMixer+stop)
    * [.updateDelta(delta)](#SoundMixer+updateDelta)
    * [.update(progress)](#SoundMixer+update)

<a name="new_SoundMixer_new"></a>

### new SoundMixer(sound1, sound2, allowOverlapping)
Create the sound mixer.


| Param | Type | Description |
| --- | --- | --- |
| sound1 | [<code>SoundInstance</code>](#SoundInstance) | Sound to mix from. Can be null to just fade in. |
| sound2 | [<code>SoundInstance</code>](#SoundInstance) | Sound to mix to. Can be null to just fade out. |
| allowOverlapping | <code>Boolean</code> | If true (default), will mix while overlapping sounds.                                    If false, will first finish first sound before begining next. |

<a name="SoundMixer+fromSound"></a>

### soundMixer.fromSound ⇒ [<code>SoundInstance</code>](#SoundInstance)
Get first sound.

**Kind**: instance property of [<code>SoundMixer</code>](#SoundMixer)  
**Returns**: [<code>SoundInstance</code>](#SoundInstance) - First sound instance.  
<a name="SoundMixer+toSound"></a>

### soundMixer.toSound ⇒ [<code>SoundInstance</code>](#SoundInstance)
Get second sound.

**Kind**: instance property of [<code>SoundMixer</code>](#SoundMixer)  
**Returns**: [<code>SoundInstance</code>](#SoundInstance) - Second sound instance.  
<a name="SoundMixer+progress"></a>

### soundMixer.progress ⇒ <code>Number</code>
Return current progress.

**Kind**: instance property of [<code>SoundMixer</code>](#SoundMixer)  
**Returns**: <code>Number</code> - Mix progress from 0 to 1.  
<a name="SoundMixer+stop"></a>

### soundMixer.stop()
Stop both sounds.

**Kind**: instance method of [<code>SoundMixer</code>](#SoundMixer)  
<a name="SoundMixer+updateDelta"></a>

### soundMixer.updateDelta(delta)
Update the mixer progress with time delta instead of absolute value.

**Kind**: instance method of [<code>SoundMixer</code>](#SoundMixer)  

| Param | Type | Description |
| --- | --- | --- |
| delta | <code>Number</code> | Progress delta, in seconds. |

<a name="SoundMixer+update"></a>

### soundMixer.update(progress)
Update the mixer progress.

**Kind**: instance method of [<code>SoundMixer</code>](#SoundMixer)  

| Param | Type | Description |
| --- | --- | --- |
| progress | <code>Number</code> | Transition progress from sound1 to sound2. Values must be between 0.0 to 1.0. |

<a name="Shaku"></a>

## Shaku
Shaku's main object.
This object wraps the entire lib namespace, and this is what you use to access all managers and manage your main loop.

**Kind**: global class  

* [Shaku](#Shaku)
    * [new Shaku()](#new_Shaku_new)
    * [.utils](#Shaku+utils)
    * [.sfx](#Shaku+sfx)
    * [.gfx](#Shaku+gfx)
    * [.input](#Shaku+input)
    * [.assets](#Shaku+assets)
    * [.collision](#Shaku+collision)
    * [.pauseWhenNotFocused](#Shaku+pauseWhenNotFocused)
    * [.paused](#Shaku+paused)
    * [.pauseTime](#Shaku+pauseTime)
    * [.isPaused](#Shaku+isPaused)
    * [.gameTime](#Shaku+gameTime) ⇒ [<code>GameTime</code>](#GameTime)
    * [.version](#Shaku+version) ⇒ <code>String</code>
    * [.init(managers)](#Shaku+init) ⇒ <code>Promise</code>
    * [.destroy()](#Shaku+destroy)
    * [.startFrame()](#Shaku+startFrame)
    * [.endFrame()](#Shaku+endFrame)
    * [.silent()](#Shaku+silent)
    * [.throwErrorOnWarnings(enable)](#Shaku+throwErrorOnWarnings)
    * [.getFpsCount()](#Shaku+getFpsCount) ⇒ <code>Number</code>
    * [.getAverageFrameTime()](#Shaku+getAverageFrameTime) ⇒ <code>Number</code>
    * [.requestAnimationFrame(callback)](#Shaku+requestAnimationFrame) ⇒ <code>Number</code>
    * [.cancelAnimationFrame(id)](#Shaku+cancelAnimationFrame)
    * [.setLogger(loggerHandler)](#Shaku+setLogger)
    * [.getLogger()](#Shaku+getLogger)

<a name="new_Shaku_new"></a>

### new Shaku()
Create the Shaku main object.

<a name="Shaku+utils"></a>

### shaku.utils
Different utilities and framework objects, like vectors, rectangles, colors, etc.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+sfx"></a>

### shaku.sfx
Sound effects and music manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+gfx"></a>

### shaku.gfx
Graphics manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+input"></a>

### shaku.input
Input manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+assets"></a>

### shaku.assets
Assets manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+collision"></a>

### shaku.collision
Collision detection manager.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+pauseWhenNotFocused"></a>

### shaku.pauseWhenNotFocused
If true, will pause the updates and drawing calls when window is not focused.
Will also not update elapsed time.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+paused"></a>

### shaku.paused
Set to true to completely pause Shaku (will skip updates, drawing, and time counting).

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+pauseTime"></a>

### shaku.pauseTime
Set to true to pause just the game time.
This will not pause real-life time. If you need real-life time stop please use the Python package.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+isPaused"></a>

### shaku.isPaused
Get if the Shaku is currently paused.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+gameTime"></a>

### shaku.gameTime ⇒ [<code>GameTime</code>](#GameTime)
Get current frame game time.
Only valid between startFrame() and endFrame().

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
**Returns**: [<code>GameTime</code>](#GameTime) - Current frame's gametime.  
<a name="Shaku+version"></a>

### shaku.version ⇒ <code>String</code>
Get Shaku's version.

**Kind**: instance property of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>String</code> - Shaku's version.  
<a name="Shaku+init"></a>

### shaku.init(managers) ⇒ <code>Promise</code>
Method to select managers to use + initialize them.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Promise</code> - promise to resolve when finish initialization.  

| Param | Type | Description |
| --- | --- | --- |
| managers | [<code>Array.&lt;IManager&gt;</code>](#IManager) \| <code>null</code> | Array with list of managers to use or null to use all. |

<a name="Shaku+destroy"></a>

### shaku.destroy()
Destroy all managers

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+startFrame"></a>

### shaku.startFrame()
Start frame (update all managers).

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+endFrame"></a>

### shaku.endFrame()
End frame (update all managers).

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+silent"></a>

### shaku.silent()
Make Shaku run in silent mode, without logs.
You can call this before init.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Shaku+throwErrorOnWarnings"></a>

### shaku.throwErrorOnWarnings(enable)
Set logger to throw an error every time a log message with severity higher than warning is written.
You can call this before init.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>Boolean</code> | Set to true to throw error on warnings. |

<a name="Shaku+getFpsCount"></a>

### shaku.getFpsCount() ⇒ <code>Number</code>
Return current FPS count.
Note: will return 0 until at least one second have passed.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Number</code> - FPS count.  
<a name="Shaku+getAverageFrameTime"></a>

### shaku.getAverageFrameTime() ⇒ <code>Number</code>
Get how long on average it takes to complete a game frame.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Number</code> - Average time, in milliseconds, it takes to complete a game frame.  
<a name="Shaku+requestAnimationFrame"></a>

### shaku.requestAnimationFrame(callback) ⇒ <code>Number</code>
Request animation frame with fallbacks.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
**Returns**: <code>Number</code> - Handle for cancellation.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Method to invoke in next animation frame. |

<a name="Shaku+cancelAnimationFrame"></a>

### shaku.cancelAnimationFrame(id)
Cancel animation frame with fallbacks.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>Number</code> | Request handle. |

<a name="Shaku+setLogger"></a>

### shaku.setLogger(loggerHandler)
Set the logger writer class (will replace the default console output).

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  

| Param | Type | Description |
| --- | --- | --- |
| loggerHandler | <code>\*</code> | New logger handler (must implement trace, debug, info, warn, error methods). |

<a name="Shaku+getLogger"></a>

### shaku.getLogger()
Get / create a custom logger.

**Kind**: instance method of [<code>Shaku</code>](#Shaku)  
<a name="Animator"></a>

## Animator
Implement an animator object that change values over time using Linear Interpolation.
Usage example:
(new Animator(sprite)).from({'position.x': 0}).to({'position.x': 100}).duration(1).play();

**Kind**: global class  

* [Animator](#Animator)
    * [new Animator(target)](#new_Animator_new)
    * [.speedFactor](#Animator+speedFactor)
    * [.ended](#Animator+ended) ⇒ <code>Boolean</code>
    * [.update(delta)](#Animator+update)
    * [.then(callback)](#Animator+then) ⇒ [<code>Animator</code>](#Animator)
    * [.smoothDamp(enable)](#Animator+smoothDamp) ⇒ [<code>Animator</code>](#Animator)
    * [.repeats(enable, reverseAnimation)](#Animator+repeats) ⇒ [<code>Animator</code>](#Animator)
    * [.from(values)](#Animator+from) ⇒ [<code>Animator</code>](#Animator)
    * [.to(values)](#Animator+to) ⇒ [<code>Animator</code>](#Animator)
    * [.flipFromAndTo()](#Animator+flipFromAndTo)
    * [.duration(seconds)](#Animator+duration) ⇒ [<code>Animator</code>](#Animator)
    * [.reset()](#Animator+reset) ⇒ [<code>Animator</code>](#Animator)
    * [.play()](#Animator+play) ⇒ [<code>Animator</code>](#Animator)

<a name="new_Animator_new"></a>

### new Animator(target)
Create the animator.


| Param | Type | Description |
| --- | --- | --- |
| target | <code>\*</code> | Any object you want to animate. |

<a name="Animator+speedFactor"></a>

### animator.speedFactor
Speed factor to multiply with delta every time this animator updates.

**Kind**: instance property of [<code>Animator</code>](#Animator)  
<a name="Animator+ended"></a>

### animator.ended ⇒ <code>Boolean</code>
Get if this animator finished.

**Kind**: instance property of [<code>Animator</code>](#Animator)  
**Returns**: <code>Boolean</code> - True if animator finished.  
<a name="Animator+update"></a>

### animator.update(delta)
Update this animator with a given delta time.

**Kind**: instance method of [<code>Animator</code>](#Animator)  

| Param | Type | Description |
| --- | --- | --- |
| delta | <code>Number</code> | Delta time to progress this animator by. |

<a name="Animator+then"></a>

### animator.then(callback) ⇒ [<code>Animator</code>](#Animator)
Set a method to run when animation ends.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback to invoke when done. |

<a name="Animator+smoothDamp"></a>

### animator.smoothDamp(enable) ⇒ [<code>Animator</code>](#Animator)
Set smooth damp.
If true, lerping will go slower as the animation reach its ending.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>Boolean</code> | set smooth damp mode. |

<a name="Animator+repeats"></a>

### animator.repeats(enable, reverseAnimation) ⇒ [<code>Animator</code>](#Animator)
Set if the animator should repeat itself.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  

| Param | Type | Description |
| --- | --- | --- |
| enable | <code>Boolean</code> \| <code>Number</code> | false to disable repeating, true for endless repeats, or a number for limited number of repeats. |
| reverseAnimation | <code>Boolean</code> | if true, it will reverse animation to repeat it instead of just "jumping" back to starting state. |

<a name="Animator+from"></a>

### animator.from(values) ⇒ [<code>Animator</code>](#Animator)
Set 'from' values.
You don't have to provide 'from' values, when a value is not set the animator will just take whatever was set in target when first update is called.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>\*</code> | Values to set as 'from' values.  Key = property name in target (can contain dots for nested), value = value to start animation from. |

<a name="Animator+to"></a>

### animator.to(values) ⇒ [<code>Animator</code>](#Animator)
Set 'to' values, ie the result when animation ends.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  

| Param | Type | Description |
| --- | --- | --- |
| values | <code>\*</code> | Values to set as 'to' values.  Key = property name in target (can contain dots for nested), value = value to start animation from. |

<a name="Animator+flipFromAndTo"></a>

### animator.flipFromAndTo()
Flip between the 'from' and the 'to' states.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
<a name="Animator+duration"></a>

### animator.duration(seconds) ⇒ [<code>Animator</code>](#Animator)
Make this Animator update automatically with the gameTime delta time.
Note: this will change the speedFactor property.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  

| Param | Type | Description |
| --- | --- | --- |
| seconds | <code>Number</code> | Animator duration time in seconds. |

<a name="Animator+reset"></a>

### animator.reset() ⇒ [<code>Animator</code>](#Animator)
Reset animator progress.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  
<a name="Animator+play"></a>

### animator.play() ⇒ [<code>Animator</code>](#Animator)
Make this Animator update automatically with the gameTime delta time, until its done.

**Kind**: instance method of [<code>Animator</code>](#Animator)  
**Returns**: [<code>Animator</code>](#Animator) - this.  
<a name="Circle"></a>

## Circle
Implement a simple 2d Circle.

**Kind**: global class  

* [Circle](#Circle)
    * [new Circle(center, radius)](#new_Circle_new)
    * _instance_
        * [.clone()](#Circle+clone) ⇒ [<code>Circle</code>](#Circle)
        * [.containsVector(p)](#Circle+containsVector) ⇒ <code>Boolean</code>
        * [.equals(other)](#Circle+equals) ⇒ <code>Boolean</code>
        * [.toDict(minimized)](#Circle+toDict) ⇒ <code>\*</code>
    * _static_
        * [.fromDict(data)](#Circle.fromDict) ⇒ [<code>Circle</code>](#Circle)
        * [.lerp(p1, p2, a)](#Circle.lerp) ⇒ [<code>Circle</code>](#Circle)

<a name="new_Circle_new"></a>

### new Circle(center, radius)
Create the Circle.


| Param | Type | Description |
| --- | --- | --- |
| center | [<code>Vector2</code>](#Vector2) | Circle center position. |
| radius | <code>Number</code> | Circle radius. |

<a name="Circle+clone"></a>

### circle.clone() ⇒ [<code>Circle</code>](#Circle)
Return a clone of this circle.

**Kind**: instance method of [<code>Circle</code>](#Circle)  
**Returns**: [<code>Circle</code>](#Circle) - Cloned circle.  
<a name="Circle+containsVector"></a>

### circle.containsVector(p) ⇒ <code>Boolean</code>
Check if this circle contains a Vector2.

**Kind**: instance method of [<code>Circle</code>](#Circle)  
**Returns**: <code>Boolean</code> - if point is contained within the circle.  

| Param | Type | Description |
| --- | --- | --- |
| p | [<code>Vector2</code>](#Vector2) | Point to check. |

<a name="Circle+equals"></a>

### circle.equals(other) ⇒ <code>Boolean</code>
Check if equal to another circle.

**Kind**: instance method of [<code>Circle</code>](#Circle)  
**Returns**: <code>Boolean</code> - True if circles are equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Circle</code>](#Circle) | Other circle to compare to. |

<a name="Circle+toDict"></a>

### circle.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Circle</code>](#Circle)  
**Returns**: <code>\*</code> - Dictionary with {center, radius}.  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Circle.fromDict"></a>

### Circle.fromDict(data) ⇒ [<code>Circle</code>](#Circle)
Create circle from a dictionary.

**Kind**: static method of [<code>Circle</code>](#Circle)  
**Returns**: [<code>Circle</code>](#Circle) - Newly created circle.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {center, radius}. |

<a name="Circle.lerp"></a>

### Circle.lerp(p1, p2, a) ⇒ [<code>Circle</code>](#Circle)
Lerp between two circle.

**Kind**: static method of [<code>Circle</code>](#Circle)  
**Returns**: [<code>Circle</code>](#Circle) - result circle.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Circle</code>](#Circle) | First circle. |
| p2 | [<code>Circle</code>](#Circle) | Second circle. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="Color"></a>

## Color
Implement a color.
All color components are expected to be in 0.0 - 1.0 range (and not 0-255).

**Kind**: global class  

* [Color](#Color)
    * [new Color(r, g, b, [a])](#new_Color_new)
    * _instance_
        * [.r](#Color+r) ⇒ <code>Number</code>
        * [.g](#Color+g) ⇒ <code>Number</code>
        * [.b](#Color+b) ⇒ <code>Number</code>
        * [.a](#Color+a) ⇒ <code>Number</code>
        * [.r](#Color+r) ⇒ <code>Number</code>
        * [.g](#Color+g) ⇒ <code>Number</code>
        * [.b](#Color+b) ⇒ <code>Number</code>
        * [.a](#Color+a) ⇒ <code>Number</code>
        * [.asHex](#Color+asHex) ⇒ <code>String</code>
        * [.asDecimalRGBA](#Color+asDecimalRGBA) ⇒ <code>Number</code>
        * [.asDecimalABGR](#Color+asDecimalABGR) ⇒ <code>Number</code>
        * [.floatArray](#Color+floatArray)
        * [.isBlack](#Color+isBlack)
        * [.isTransparentBlack](#Color+isTransparentBlack)
        * [.set(r, g, b, a)](#Color+set) ⇒ [<code>Color</code>](#Color)
        * [.setByte(r, g, b, a)](#Color+setByte) ⇒ [<code>Color</code>](#Color)
        * [.copy(other)](#Color+copy) ⇒ [<code>Color</code>](#Color)
        * [.toDict(minimized)](#Color+toDict) ⇒ <code>\*</code>
        * [.clone()](#Color+clone) ⇒ <code>Number</code>
        * [.string()](#Color+string)
        * [.equals(other)](#Color+equals)
    * _static_
        * [.webColorNames](#Color.webColorNames) ⇒ <code>Array.&lt;String&gt;</code>
        * [.componentToHex(c)](#Color.componentToHex) ⇒ <code>String</code>
        * [.fromHex(val)](#Color.fromHex) ⇒ [<code>Color</code>](#Color)
        * [.fromDecimal(val, includeAlpha)](#Color.fromDecimal) ⇒ [<code>Color</code>](#Color)
        * [.fromDict(data)](#Color.fromDict) ⇒ [<code>Color</code>](#Color)
        * [.random(includeAlpha)](#Color.random) ⇒ [<code>Color</code>](#Color)
        * [.fromBytesArray(bytes)](#Color.fromBytesArray) ⇒ [<code>Color</code>](#Color)
        * [.lerp(p1, p2, a)](#Color.lerp) ⇒ [<code>Color</code>](#Color)

<a name="new_Color_new"></a>

### new Color(r, g, b, [a])
Create the color.


| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | Color red component (value range: 0-1). |
| g | <code>Number</code> | Color green component (value range: 0-1). |
| b | <code>Number</code> | Color blue component (value range: 0-1). |
| [a] | <code>Number</code> | Color alpha component (value range: 0-1). |

<a name="Color+r"></a>

### color.r ⇒ <code>Number</code>
Get r component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Red component.  
<a name="Color+g"></a>

### color.g ⇒ <code>Number</code>
Get g component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Green component.  
<a name="Color+b"></a>

### color.b ⇒ <code>Number</code>
Get b component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Blue component.  
<a name="Color+a"></a>

### color.a ⇒ <code>Number</code>
Get a component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Alpha component.  
<a name="Color+r"></a>

### color.r ⇒ <code>Number</code>
Set r component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Red component after change.  
<a name="Color+g"></a>

### color.g ⇒ <code>Number</code>
Set g component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Green component after change.  
<a name="Color+b"></a>

### color.b ⇒ <code>Number</code>
Set b component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Blue component after change.  
<a name="Color+a"></a>

### color.a ⇒ <code>Number</code>
Set a component.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Alpha component after change.  
<a name="Color+asHex"></a>

### color.asHex ⇒ <code>String</code>
Convert this color to hex string (starting with '#').

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>String</code> - Color as hex.  
<a name="Color+asDecimalRGBA"></a>

### color.asDecimalRGBA ⇒ <code>Number</code>
Convert this color to decimal number.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Color as decimal RGBA.  
<a name="Color+asDecimalABGR"></a>

### color.asDecimalABGR ⇒ <code>Number</code>
Convert this color to decimal number.

**Kind**: instance property of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Color as decimal ARGB.  
<a name="Color+floatArray"></a>

### color.floatArray
Convert this color to a float array.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+isBlack"></a>

### color.isBlack
Get if this color is pure black (ignoring alpha).

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+isTransparentBlack"></a>

### color.isTransparentBlack
Get if this color is transparent black.

**Kind**: instance property of [<code>Color</code>](#Color)  
<a name="Color+set"></a>

### color.set(r, g, b, a) ⇒ [<code>Color</code>](#Color)
Set the color components.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - this.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | Color red component (value range: 0-1). |
| g | <code>Number</code> | Color green component (value range: 0-1). |
| b | <code>Number</code> | Color blue component (value range: 0-1). |
| a | <code>Number</code> | Color alpha component (value range: 0-1). |

<a name="Color+setByte"></a>

### color.setByte(r, g, b, a) ⇒ [<code>Color</code>](#Color)
Set the color components from byte values (0-255).

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - this.  

| Param | Type | Description |
| --- | --- | --- |
| r | <code>Number</code> | Color red component (value range: 0-255). |
| g | <code>Number</code> | Color green component (value range: 0-255). |
| b | <code>Number</code> | Color blue component (value range: 0-255). |
| a | <code>Number</code> | Color alpha component (value range: 0-255). |

<a name="Color+copy"></a>

### color.copy(other) ⇒ [<code>Color</code>](#Color)
Copy all component values from another color.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - this.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Color</code>](#Color) | Color to copy values from. |

<a name="Color+toDict"></a>

### color.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: <code>\*</code> - Dictionary with {r,g,b,a}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 1. You can use fromDict on minimized dicts. |

<a name="Color+clone"></a>

### color.clone() ⇒ <code>Number</code>
Return a clone of this color.

**Kind**: instance method of [<code>Color</code>](#Color)  
**Returns**: <code>Number</code> - Cloned color.  
<a name="Color+string"></a>

### color.string()
Convert to string.

**Kind**: instance method of [<code>Color</code>](#Color)  
<a name="Color+equals"></a>

### color.equals(other)
Check if equal to another color.

**Kind**: instance method of [<code>Color</code>](#Color)  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>PintarJS.Color</code> | Other color to compare to. |

<a name="Color.webColorNames"></a>

### Color.webColorNames ⇒ <code>Array.&lt;String&gt;</code>
Get array with all built-in web color names.

**Kind**: static property of [<code>Color</code>](#Color)  
**Returns**: <code>Array.&lt;String&gt;</code> - Array with color names.  
<a name="Color.componentToHex"></a>

### Color.componentToHex(c) ⇒ <code>String</code>
Convert a single component to hex value.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: <code>String</code> - Component as hex value.  

| Param | Type | Description |
| --- | --- | --- |
| c | <code>Number</code> | Value to convert to hex. |

<a name="Color.fromHex"></a>

### Color.fromHex(val) ⇒ [<code>Color</code>](#Color)
Create color from hex value.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - New color value.  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>String</code> | Number value (hex), as #rrggbbaa. |

<a name="Color.fromDecimal"></a>

### Color.fromDecimal(val, includeAlpha) ⇒ [<code>Color</code>](#Color)
Create color from decimal value.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - New color value.  

| Param | Type | Description |
| --- | --- | --- |
| val | <code>Number</code> | Number value (int). |
| includeAlpha | <code>Number</code> | If true, will include alpha value. |

<a name="Color.fromDict"></a>

### Color.fromDict(data) ⇒ [<code>Color</code>](#Color)
Create color from a dictionary.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - Newly created color.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {r,g,b,a}. |

<a name="Color.random"></a>

### Color.random(includeAlpha) ⇒ [<code>Color</code>](#Color)
Return a random color.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - Randomized color.  

| Param | Type | Description |
| --- | --- | --- |
| includeAlpha | <code>Boolean</code> | If true, will also randomize alpha. |

<a name="Color.fromBytesArray"></a>

### Color.fromBytesArray(bytes) ⇒ [<code>Color</code>](#Color)
Build and return new color from bytes array.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - Newly created color.  

| Param | Type | Description |
| --- | --- | --- |
| bytes | <code>Array.&lt;Number&gt;</code> | Bytes array to build color from. |

<a name="Color.lerp"></a>

### Color.lerp(p1, p2, a) ⇒ [<code>Color</code>](#Color)
Lerp between two colors.

**Kind**: static method of [<code>Color</code>](#Color)  
**Returns**: [<code>Color</code>](#Color) - result color.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Color</code>](#Color) | First color. |
| p2 | [<code>Color</code>](#Color) | Second color. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="GameTime"></a>

## GameTime
Class to hold current game time (elapse and deltatime).

**Kind**: global class  

* [GameTime](#GameTime)
    * [new GameTime()](#new_GameTime_new)
    * _instance_
        * [.timestamp](#GameTime+timestamp)
        * [.deltaTime](#GameTime+deltaTime)
        * [.elapsedTime](#GameTime+elapsedTime)
        * [.delta](#GameTime+delta)
        * [.elapsed](#GameTime+elapsed)
    * _static_
        * [.update()](#GameTime.update)
        * [.rawTimestamp()](#GameTime.rawTimestamp) ⇒ <code>Number</code>
        * [.reset()](#GameTime.reset)
        * [.resetDelta()](#GameTime.resetDelta)

<a name="new_GameTime_new"></a>

### new GameTime()
create the gametime object with current time.

<a name="GameTime+timestamp"></a>

### gameTime.timestamp
Current timestamp

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+deltaTime"></a>

### gameTime.deltaTime
Delta time struct.
Contains: milliseconds, seconds.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+elapsedTime"></a>

### gameTime.elapsedTime
Elapsed time struct.
Contains: milliseconds, seconds.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+delta"></a>

### gameTime.delta
Delta time, in seconds, since last frame.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime+elapsed"></a>

### gameTime.elapsed
Total time, in seconds, since Shaku was initialized.

**Kind**: instance property of [<code>GameTime</code>](#GameTime)  
<a name="GameTime.update"></a>

### GameTime.update()
Update game time.

**Kind**: static method of [<code>GameTime</code>](#GameTime)  
<a name="GameTime.rawTimestamp"></a>

### GameTime.rawTimestamp() ⇒ <code>Number</code>
Get raw timestamp in milliseconds.

**Kind**: static method of [<code>GameTime</code>](#GameTime)  
**Returns**: <code>Number</code> - raw timestamp in milliseconds.  
<a name="GameTime.reset"></a>

### GameTime.reset()
Reset elapsed and delta time.

**Kind**: static method of [<code>GameTime</code>](#GameTime)  
<a name="GameTime.resetDelta"></a>

### GameTime.resetDelta()
Reset current frame's delta time.

**Kind**: static method of [<code>GameTime</code>](#GameTime)  
<a name="Line"></a>

## Line
Implement a simple 2d Line.

**Kind**: global class  

* [Line](#Line)
    * [new Line(from, to)](#new_Line_new)
    * _instance_
        * [.clone()](#Line+clone) ⇒ [<code>Line</code>](#Line)
        * [.toDict(minimized)](#Line+toDict) ⇒ <code>\*</code>
        * [.containsVector(p, threshold)](#Line+containsVector) ⇒ <code>Boolean</code>
        * [.collideLine(other)](#Line+collideLine) ⇒ <code>Boolean</code>
        * [.distanceToVector(v)](#Line+distanceToVector) ⇒ <code>Number</code>
        * [.equals(other)](#Line+equals) ⇒ <code>Boolean</code>
    * _static_
        * [.fromDict(data)](#Line.fromDict) ⇒ [<code>Line</code>](#Line)
        * [.lerp(l1, l2, a)](#Line.lerp) ⇒ [<code>Line</code>](#Line)

<a name="new_Line_new"></a>

### new Line(from, to)
Create the Line.


| Param | Type | Description |
| --- | --- | --- |
| from | [<code>Vector2</code>](#Vector2) | Line start position. |
| to | [<code>Vector2</code>](#Vector2) | Line end position. |

<a name="Line+clone"></a>

### line.clone() ⇒ [<code>Line</code>](#Line)
Return a clone of this line.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: [<code>Line</code>](#Line) - Cloned line.  
<a name="Line+toDict"></a>

### line.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>\*</code> - Dictionary with {from, to}.  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Line+containsVector"></a>

### line.containsVector(p, threshold) ⇒ <code>Boolean</code>
Check if this circle contains a Vector2.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Boolean</code> - if point is contained within the circle.  

| Param | Type | Description |
| --- | --- | --- |
| p | [<code>Vector2</code>](#Vector2) | Point to check. |
| threshold | <code>Number</code> | Distance between point and line to consider as intersecting. Default is 0.5, meaning it will treat point and line as round integers (sort-of). |

<a name="Line+collideLine"></a>

### line.collideLine(other) ⇒ <code>Boolean</code>
Check if this line collides with another line.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Boolean</code> - True if lines collide, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Line</code>](#Line) | Other line to test collision with. |

<a name="Line+distanceToVector"></a>

### line.distanceToVector(v) ⇒ <code>Number</code>
Get the shortest distance between this line segment and a vector.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Number</code> - Shortest distance between line and vector.  

| Param | Type | Description |
| --- | --- | --- |
| v | [<code>Vector2</code>](#Vector2) | Vector to get distance to. |

<a name="Line+equals"></a>

### line.equals(other) ⇒ <code>Boolean</code>
Check if equal to another circle.

**Kind**: instance method of [<code>Line</code>](#Line)  
**Returns**: <code>Boolean</code> - True if circles are equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Circle</code>](#Circle) | Other circle to compare to. |

<a name="Line.fromDict"></a>

### Line.fromDict(data) ⇒ [<code>Line</code>](#Line)
Create Line from a dictionary.

**Kind**: static method of [<code>Line</code>](#Line)  
**Returns**: [<code>Line</code>](#Line) - Newly created line.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {from, to}. |

<a name="Line.lerp"></a>

### Line.lerp(l1, l2, a) ⇒ [<code>Line</code>](#Line)
Lerp between two lines.

**Kind**: static method of [<code>Line</code>](#Line)  
**Returns**: [<code>Line</code>](#Line) - result lines.  

| Param | Type | Description |
| --- | --- | --- |
| l1 | [<code>Line</code>](#Line) | First lines. |
| l2 | [<code>Line</code>](#Line) | Second lines. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="MathHelper"></a>

## MathHelper
Implement some math utilities functions.

**Kind**: global class  

* [MathHelper](#MathHelper)
    * [.lerp(start, end, amount)](#MathHelper.lerp) ⇒ <code>Number</code>
    * [.dot(x1, y1, x2, y2)](#MathHelper.dot) ⇒ <code>Number</code>
    * [.toRadians(degrees)](#MathHelper.toRadians) ⇒ <code>Number</code>
    * [.toDegrees(radians)](#MathHelper.toDegrees) ⇒ <code>Number</code>
    * [.radiansDistanceSigned(a1, a2)](#MathHelper.radiansDistanceSigned) ⇒ <code>Number</code>
    * [.radiansDistance(a1, a2)](#MathHelper.radiansDistance) ⇒ <code>Number</code>
    * [.degreesDistanceSigned(a1, a2)](#MathHelper.degreesDistanceSigned) ⇒ <code>Number</code>
    * [.degreesDistance(a1, a2)](#MathHelper.degreesDistance) ⇒ <code>Number</code>
    * [.lerpRadians(a1, a2, alpha)](#MathHelper.lerpRadians) ⇒ <code>Number</code>
    * [.lerpDegrees(a1, a2, alpha)](#MathHelper.lerpDegrees) ⇒ <code>Number</code>
    * [.round10(num)](#MathHelper.round10) ⇒ <code>Number</code>
    * [.wrapDegrees(degrees)](#MathHelper.wrapDegrees) ⇒ <code>Number</code>

<a name="MathHelper.lerp"></a>

### MathHelper.lerp(start, end, amount) ⇒ <code>Number</code>
Perform linear interpolation between start and end values.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - interpolated value between start and end.  

| Param | Type | Description |
| --- | --- | --- |
| start | <code>Number</code> | Starting value. |
| end | <code>Number</code> | Ending value. |
| amount | <code>Number</code> | How much to interpolate from start to end. |

<a name="MathHelper.dot"></a>

### MathHelper.dot(x1, y1, x2, y2) ⇒ <code>Number</code>
Calculate 2d dot product.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - dot product result.  

| Param | Type | Description |
| --- | --- | --- |
| x1 | <code>Number</code> | First vector x. |
| y1 | <code>Number</code> | First vector y. |
| x2 | <code>Number</code> | Second vector x. |
| y2 | <code>Number</code> | Second vector y. |

<a name="MathHelper.toRadians"></a>

### MathHelper.toRadians(degrees) ⇒ <code>Number</code>
Convert degrees to radians.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Value as radians.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Degrees value to convert to radians. |

<a name="MathHelper.toDegrees"></a>

### MathHelper.toDegrees(radians) ⇒ <code>Number</code>
Convert radians to degrees.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Value as degrees.  

| Param | Type | Description |
| --- | --- | --- |
| radians | <code>Number</code> | Radians value to convert to degrees. |

<a name="MathHelper.radiansDistanceSigned"></a>

### MathHelper.radiansDistanceSigned(a1, a2) ⇒ <code>Number</code>
Find shortest distance between two radians, with sign (ie distance can be negative).

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Shortest distance between radians.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | First radian. |
| a2 | <code>Number</code> | Second radian. |

<a name="MathHelper.radiansDistance"></a>

### MathHelper.radiansDistance(a1, a2) ⇒ <code>Number</code>
Find shortest distance between two radians.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Shortest distance between radians.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | First radian. |
| a2 | <code>Number</code> | Second radian. |

<a name="MathHelper.degreesDistanceSigned"></a>

### MathHelper.degreesDistanceSigned(a1, a2) ⇒ <code>Number</code>
Find shortest distance between two angles in degrees, with sign (ie distance can be negative).

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Shortest distance between angles.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | First angle. |
| a2 | <code>Number</code> | Second angle. |

<a name="MathHelper.degreesDistance"></a>

### MathHelper.degreesDistance(a1, a2) ⇒ <code>Number</code>
Find shortest distance between two angles in degrees.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Shortest distance between angles.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | First angle. |
| a2 | <code>Number</code> | Second angle. |

<a name="MathHelper.lerpRadians"></a>

### MathHelper.lerpRadians(a1, a2, alpha) ⇒ <code>Number</code>
Perform linear interpolation between radian values.
Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - interpolated radians between start and end.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | Starting value. |
| a2 | <code>Number</code> | Ending value. |
| alpha | <code>Number</code> | How much to interpolate from start to end. |

<a name="MathHelper.lerpDegrees"></a>

### MathHelper.lerpDegrees(a1, a2, alpha) ⇒ <code>Number</code>
Perform linear interpolation between degrees.
Unlike the regular lerp method, this method will take wrapping into consideration, and will always lerp via the shortest distance.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - interpolated degrees between start and end.  

| Param | Type | Description |
| --- | --- | --- |
| a1 | <code>Number</code> | Starting value. |
| a2 | <code>Number</code> | Ending value. |
| alpha | <code>Number</code> | How much to interpolate from start to end. |

<a name="MathHelper.round10"></a>

### MathHelper.round10(num) ⇒ <code>Number</code>
Round numbers from 10'th digit.
This is useful for calculations that should return round or almost round numbers, but have a long tail of 0's and 1 due to floating points accuracy.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - Rounded number.  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>Number</code> | Number to round. |

<a name="MathHelper.wrapDegrees"></a>

### MathHelper.wrapDegrees(degrees) ⇒ <code>Number</code>
Wrap degrees value to be between 0 to 360.

**Kind**: static method of [<code>MathHelper</code>](#MathHelper)  
**Returns**: <code>Number</code> - degrees wrapped to be 0-360 values.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Degrees to wrap. |

<a name="IGrid"></a>

## IGrid
Interface for a supported grid.

**Kind**: global class  

* [IGrid](#IGrid)
    * [.isBlocked(_from, _to)](#IGrid+isBlocked) ⇒ <code>Boolean</code>
    * [.getPrice(_index)](#IGrid+getPrice) ⇒ <code>Number</code>

<a name="IGrid+isBlocked"></a>

### iGrid.isBlocked(_from, _to) ⇒ <code>Boolean</code>
Check if a given tile is blocked from a given neihbor.

**Kind**: instance method of [<code>IGrid</code>](#IGrid)  
**Returns**: <code>Boolean</code> - Can we travel from _from to _to?  

| Param | Type | Description |
| --- | --- | --- |
| _from | [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3) | Source tile index. |
| _to | [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3) | Target tile index. Must be a neighbor of _from. |

<a name="IGrid+getPrice"></a>

### iGrid.getPrice(_index) ⇒ <code>Number</code>
Get the price to travel on a given tile.
Should return 1 for "normal" traveling price, > 1 for expensive tile, and < 1 for a cheap tile to pass on.

**Kind**: instance method of [<code>IGrid</code>](#IGrid)  
**Returns**: <code>Number</code> - Price factor to walk on.  

| Param | Type | Description |
| --- | --- | --- |
| _index | [<code>Vector2</code>](#Vector2) \| [<code>Vector3</code>](#Vector3) | Tile index. |

<a name="Node"></a>

## Node
A path node.

**Kind**: global class  
<a name="Perlin"></a>

## Perlin
Generate 2d perlin noise.
Based on code from noisejs by Stefan Gustavson.
https://github.com/josephg/noisejs/blob/master/perlin.js

**Kind**: global class  

* [Perlin](#Perlin)
    * [new Perlin(seed)](#new_Perlin_new)
    * [.seed(seed)](#Perlin+seed)
    * [.generateSmooth(x, y, blurDistance, contrast)](#Perlin+generateSmooth) ⇒ <code>Number</code>
    * [.generate(x, y, contrast)](#Perlin+generate) ⇒ <code>Number</code>

<a name="new_Perlin_new"></a>

### new Perlin(seed)
Create the perlin noise generator.


| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Number</code> | Seed for perlin noise, or undefined for random. |

<a name="Perlin+seed"></a>

### perlin.seed(seed)
Set the perlin noise seed.

**Kind**: instance method of [<code>Perlin</code>](#Perlin)  

| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Number</code> | New seed value. May be either a decimal between 0 to 1, or an unsigned short between 0 to 65536. |

<a name="Perlin+generateSmooth"></a>

### perlin.generateSmooth(x, y, blurDistance, contrast) ⇒ <code>Number</code>
Generate a perlin noise value for x,y coordinates.

**Kind**: instance method of [<code>Perlin</code>](#Perlin)  
**Returns**: <code>Number</code> - Perlin noise value for given point.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X coordinate to generate perlin noise for. |
| y | <code>Number</code> | Y coordinate to generate perlin noise for. |
| blurDistance | <code>Number</code> | Distance to take neighbors to blur returned value with. Defaults to 0.25. |
| contrast | <code>Number</code> | Optional contrast factor. |

<a name="Perlin+generate"></a>

### perlin.generate(x, y, contrast) ⇒ <code>Number</code>
Generate a perlin noise value for x,y coordinates.

**Kind**: instance method of [<code>Perlin</code>](#Perlin)  
**Returns**: <code>Number</code> - Perlin noise value for given point, ranged from 0 to 1.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X coordinate to generate perlin noise for. |
| y | <code>Number</code> | Y coordinate to generate perlin noise for. |
| contrast | <code>Number</code> | Optional contrast factor. |

<a name="Rectangle"></a>

## Rectangle
Implement a simple 2d Rectangle.

**Kind**: global class  

* [Rectangle](#Rectangle)
    * [new Rectangle(x, y, width, height)](#new_Rectangle_new)
    * _instance_
        * [.left](#Rectangle+left) ⇒ <code>Number</code>
        * [.right](#Rectangle+right) ⇒ <code>Number</code>
        * [.top](#Rectangle+top) ⇒ <code>Number</code>
        * [.bottom](#Rectangle+bottom) ⇒ <code>Number</code>
        * [.set(x, y, width, height)](#Rectangle+set) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.copy(other)](#Rectangle+copy) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.getPosition()](#Rectangle+getPosition) ⇒ [<code>Vector2</code>](#Vector2)
        * [.getSize()](#Rectangle+getSize) ⇒ [<code>Vector2</code>](#Vector2)
        * [.getCenter()](#Rectangle+getCenter) ⇒ [<code>Vector2</code>](#Vector2)
        * [.clone()](#Rectangle+clone) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.getTopLeft()](#Rectangle+getTopLeft) ⇒ [<code>Vector2</code>](#Vector2)
        * [.getTopRight()](#Rectangle+getTopRight) ⇒ [<code>Vector2</code>](#Vector2)
        * [.getBottomLeft()](#Rectangle+getBottomLeft) ⇒ [<code>Vector2</code>](#Vector2)
        * [.getBottomRight()](#Rectangle+getBottomRight) ⇒ [<code>Vector2</code>](#Vector2)
        * [.string()](#Rectangle+string)
        * [.containsVector(p)](#Rectangle+containsVector) ⇒ <code>Boolean</code>
        * [.collideRect(other)](#Rectangle+collideRect) ⇒ <code>Boolean</code>
        * [.collideLine(line)](#Rectangle+collideLine) ⇒ <code>Boolean</code>
        * [.collideCircle(circle)](#Rectangle+collideCircle) ⇒ <code>Boolean</code>
        * [.getBoundingCircle()](#Rectangle+getBoundingCircle) ⇒ [<code>Circle</code>](#Circle)
        * [.resize(amount)](#Rectangle+resize) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.equals(other)](#Rectangle+equals)
        * [.toDict(minimized)](#Rectangle+toDict) ⇒ <code>\*</code>
    * _static_
        * [.fromPoints(points)](#Rectangle.fromPoints) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.lerp(p1, p2, a)](#Rectangle.lerp) ⇒ [<code>Rectangle</code>](#Rectangle)
        * [.fromDict(data)](#Rectangle.fromDict) ⇒ [<code>Rectangle</code>](#Rectangle)

<a name="new_Rectangle_new"></a>

### new Rectangle(x, y, width, height)
Create the Rect.


| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Rect position X (top left corner). |
| y | <code>Number</code> | Rect position Y (top left corner). |
| width | <code>Number</code> | Rect width. |
| height | <code>Number</code> | Rect height. |

<a name="Rectangle+left"></a>

### rectangle.left ⇒ <code>Number</code>
Get left value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle left.  
<a name="Rectangle+right"></a>

### rectangle.right ⇒ <code>Number</code>
Get right value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle right.  
<a name="Rectangle+top"></a>

### rectangle.top ⇒ <code>Number</code>
Get top value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle top.  
<a name="Rectangle+bottom"></a>

### rectangle.bottom ⇒ <code>Number</code>
Get bottom value.

**Kind**: instance property of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Number</code> - rectangle bottom.  
<a name="Rectangle+set"></a>

### rectangle.set(x, y, width, height) ⇒ [<code>Rectangle</code>](#Rectangle)
Set rectangle values.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - this.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Rectangle x position. |
| y | <code>Number</code> | Rectangle y position. |
| width | <code>Number</code> | Rectangle width. |
| height | <code>Number</code> | Rectangle height. |

<a name="Rectangle+copy"></a>

### rectangle.copy(other) ⇒ [<code>Rectangle</code>](#Rectangle)
Copy another rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - this.  

| Param | Type | Description |
| --- | --- | --- |
| other | <code>other</code> | Rectangle to copy. |

<a name="Rectangle+getPosition"></a>

### rectangle.getPosition() ⇒ [<code>Vector2</code>](#Vector2)
Get position as Vector2.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Vector2</code>](#Vector2) - Position vector.  
<a name="Rectangle+getSize"></a>

### rectangle.getSize() ⇒ [<code>Vector2</code>](#Vector2)
Get size as Vector2.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Vector2</code>](#Vector2) - Size vector.  
<a name="Rectangle+getCenter"></a>

### rectangle.getCenter() ⇒ [<code>Vector2</code>](#Vector2)
Get center position.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Vector2</code>](#Vector2) - Position vector.  
<a name="Rectangle+clone"></a>

### rectangle.clone() ⇒ [<code>Rectangle</code>](#Rectangle)
Return a clone of this rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - Cloned rectangle.  
<a name="Rectangle+getTopLeft"></a>

### rectangle.getTopLeft() ⇒ [<code>Vector2</code>](#Vector2)
Get top-left corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Vector2</code>](#Vector2) - Corner position vector.  
<a name="Rectangle+getTopRight"></a>

### rectangle.getTopRight() ⇒ [<code>Vector2</code>](#Vector2)
Get top-right corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Vector2</code>](#Vector2) - Corner position vector.  
<a name="Rectangle+getBottomLeft"></a>

### rectangle.getBottomLeft() ⇒ [<code>Vector2</code>](#Vector2)
Get bottom-left corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Vector2</code>](#Vector2) - Corner position vector.  
<a name="Rectangle+getBottomRight"></a>

### rectangle.getBottomRight() ⇒ [<code>Vector2</code>](#Vector2)
Get bottom-right corner.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Vector2</code>](#Vector2) - Corner position vector.  
<a name="Rectangle+string"></a>

### rectangle.string()
Convert to string.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
<a name="Rectangle+containsVector"></a>

### rectangle.containsVector(p) ⇒ <code>Boolean</code>
Check if this rectangle contains a Vector2.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if point is contained within the rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| p | [<code>Vector2</code>](#Vector2) | Point to check. |

<a name="Rectangle+collideRect"></a>

### rectangle.collideRect(other) ⇒ <code>Boolean</code>
Check if this rectangle collides with another rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if rectangles collide.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Rectangle</code>](#Rectangle) | Rectangle to check collision with. |

<a name="Rectangle+collideLine"></a>

### rectangle.collideLine(line) ⇒ <code>Boolean</code>
Check if this rectangle collides with a line.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if rectangle collides with line.  

| Param | Type | Description |
| --- | --- | --- |
| line | [<code>Line</code>](#Line) | Line to check collision with. |

<a name="Rectangle+collideCircle"></a>

### rectangle.collideCircle(circle) ⇒ <code>Boolean</code>
Checks if this rectangle collides with a circle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>Boolean</code> - if rectangle collides with circle.  

| Param | Type | Description |
| --- | --- | --- |
| circle | [<code>Circle</code>](#Circle) | Circle to check collision with. |

<a name="Rectangle+getBoundingCircle"></a>

### rectangle.getBoundingCircle() ⇒ [<code>Circle</code>](#Circle)
Get the smallest circle containing this rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Circle</code>](#Circle) - Bounding circle.  
<a name="Rectangle+resize"></a>

### rectangle.resize(amount) ⇒ [<code>Rectangle</code>](#Rectangle)
Return a resized rectangle with the same center point.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - resized rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| amount | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Amount to resize. |

<a name="Rectangle+equals"></a>

### rectangle.equals(other)
Check if equal to another rectangle.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Rectangle</code>](#Rectangle) | Other rectangle to compare to. |

<a name="Rectangle+toDict"></a>

### rectangle.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: <code>\*</code> - Dictionary with {x,y,width,height}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Rectangle.fromPoints"></a>

### Rectangle.fromPoints(points) ⇒ [<code>Rectangle</code>](#Rectangle)
Build and return a rectangle from points.

**Kind**: static method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - new rectangle from points.  

| Param | Type | Description |
| --- | --- | --- |
| points | [<code>Array.&lt;Vector2&gt;</code>](#Vector2) | Points to build rectangle from. |

<a name="Rectangle.lerp"></a>

### Rectangle.lerp(p1, p2, a) ⇒ [<code>Rectangle</code>](#Rectangle)
Lerp between two rectangles.

**Kind**: static method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - result rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Rectangle</code>](#Rectangle) | First rectangles. |
| p2 | [<code>Rectangle</code>](#Rectangle) | Second rectangles. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="Rectangle.fromDict"></a>

### Rectangle.fromDict(data) ⇒ [<code>Rectangle</code>](#Rectangle)
Create rectangle from a dictionary.

**Kind**: static method of [<code>Rectangle</code>](#Rectangle)  
**Returns**: [<code>Rectangle</code>](#Rectangle) - Newly created rectangle.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {x,y,width,height}. |

<a name="SeededRandom"></a>

## SeededRandom
Class to generate random numbers with seed.

**Kind**: global class  

* [SeededRandom](#SeededRandom)
    * [new SeededRandom(seed)](#new_SeededRandom_new)
    * [.random(min, max)](#SeededRandom+random) ⇒ <code>Number</code>
    * [.pick(options)](#SeededRandom+pick) ⇒ <code>\*</code>

<a name="new_SeededRandom_new"></a>

### new SeededRandom(seed)
Create the seeded random object.


| Param | Type | Description |
| --- | --- | --- |
| seed | <code>Number</code> | Seed to start from. If not provided, will use 0. |

<a name="SeededRandom+random"></a>

### seededRandom.random(min, max) ⇒ <code>Number</code>
Get next random value.

**Kind**: instance method of [<code>SeededRandom</code>](#SeededRandom)  
**Returns**: <code>Number</code> - A randomly generated value.  

| Param | Type | Description |
| --- | --- | --- |
| min | <code>Number</code> | Optional min value. If max is not provided, this will be used as max. |
| max | <code>Number</code> | Optional max value. |

<a name="SeededRandom+pick"></a>

### seededRandom.pick(options) ⇒ <code>\*</code>
Pick a random value from array.

**Kind**: instance method of [<code>SeededRandom</code>](#SeededRandom)  
**Returns**: <code>\*</code> - Random value from options array.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Array</code> | Options to pick random value from. |

<a name="Storage"></a>

## Storage
A thin wrapper layer around storage utility.

**Kind**: global class  

* [Storage](#Storage)
    * [new Storage(adapters, prefix, valuesAsBase64, keysAsBase64)](#new_Storage_new)
    * [.persistent](#Storage+persistent) ⇒ <code>Boolean</code>
    * [.isValid](#Storage+isValid) ⇒ <code>Boolean</code>
    * [.exists(key)](#Storage+exists) ⇒ <code>Boolean</code>
    * [.setItem(key, value)](#Storage+setItem)
    * [.getItem(key)](#Storage+getItem) ⇒ <code>String</code>
    * [.getJson(key)](#Storage+getJson) ⇒ <code>\*</code>
    * [.setJson(key, value)](#Storage+setJson)
    * [.deleteItem(key)](#Storage+deleteItem)
    * [.clear()](#Storage+clear)

<a name="new_Storage_new"></a>

### new Storage(adapters, prefix, valuesAsBase64, keysAsBase64)
Create the storage.


| Param | Type | Description |
| --- | --- | --- |
| adapters | [<code>Array.&lt;StorageAdapter&gt;</code>](#StorageAdapter) | List of storage adapters to pick from. Will use the first option returning 'isValid()' = true. |
| prefix | <code>String</code> | Optional prefix to add to all keys under this storage instance. |
| valuesAsBase64 | <code>Boolean</code> | If true, will encode and decode data as base64. |
| keysAsBase64 | <code>Boolean</code> | If true, will encode and decode keys as base64. |

<a name="Storage+persistent"></a>

### storage.persistent ⇒ <code>Boolean</code>
Return if this storage adapter is persistent storage or not.

**Kind**: instance property of [<code>Storage</code>](#Storage)  
**Returns**: <code>Boolean</code> - True if this storage type is persistent.  
<a name="Storage+isValid"></a>

### storage.isValid ⇒ <code>Boolean</code>
Check if this storage instance has a valid adapter.

**Kind**: instance property of [<code>Storage</code>](#Storage)  
**Returns**: <code>Boolean</code> - True if found a valid adapter to use, false otherwise.  
<a name="Storage+exists"></a>

### storage.exists(key) ⇒ <code>Boolean</code>
Check if a key exists.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>Boolean</code> - True if key exists in storage.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to check. |

<a name="Storage+setItem"></a>

### storage.setItem(key, value)
Set value.

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to set. |
| value | <code>String</code> | Value to set. |

<a name="Storage+getItem"></a>

### storage.getItem(key) ⇒ <code>String</code>
Get value.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>String</code> - Value or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to get. |

<a name="Storage+getJson"></a>

### storage.getJson(key) ⇒ <code>\*</code>
Get value and JSON parse it.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
**Returns**: <code>\*</code> - Value as a dictionary object or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to get. |

<a name="Storage+setJson"></a>

### storage.setJson(key, value)
Set value as JSON.

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to set. |
| value | <code>\*</code> | Value to set as a dictionary. |

<a name="Storage+deleteItem"></a>

### storage.deleteItem(key)
Delete value.

**Kind**: instance method of [<code>Storage</code>](#Storage)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to delete. |

<a name="Storage+clear"></a>

### storage.clear()
Clear all values from this storage instance, based on prefix + adapter type.

**Kind**: instance method of [<code>Storage</code>](#Storage)  
<a name="StorageAdapter"></a>

## StorageAdapter
Storage adapter class that implement access to a storage device.
Used by the Storage utilitiy.

**Kind**: global class  

* [StorageAdapter](#StorageAdapter)
    * [.persistent](#StorageAdapter+persistent) ⇒ <code>Boolean</code>
    * [.isValid()](#StorageAdapter+isValid) ⇒ <code>Boolean</code>
    * [.exists(key)](#StorageAdapter+exists) ⇒ <code>Boolean</code>
    * [.setItem(key, value)](#StorageAdapter+setItem)
    * [.getItem(key)](#StorageAdapter+getItem) ⇒ <code>String</code>
    * [.deleteItem(key)](#StorageAdapter+deleteItem)
    * [.clear(prefix)](#StorageAdapter+clear)

<a name="StorageAdapter+persistent"></a>

### storageAdapter.persistent ⇒ <code>Boolean</code>
Return if this storage adapter is persistent storage or not.

**Kind**: instance property of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>Boolean</code> - True if this storage type is persistent.  
<a name="StorageAdapter+isValid"></a>

### storageAdapter.isValid() ⇒ <code>Boolean</code>
Check if this adapter is OK to be used.
For example, an adapter for localStorage will make sure it exists and not null.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>Boolean</code> - True if storage adapter is valid to be used.  
<a name="StorageAdapter+exists"></a>

### storageAdapter.exists(key) ⇒ <code>Boolean</code>
Check if a key exists.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>Boolean</code> - True if key exists in storage.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to check. |

<a name="StorageAdapter+setItem"></a>

### storageAdapter.setItem(key, value)
Set value.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to set. |
| value | <code>String</code> | Value to set. |

<a name="StorageAdapter+getItem"></a>

### storageAdapter.getItem(key) ⇒ <code>String</code>
Get value.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  
**Returns**: <code>String</code> - Value or null if not set.  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to get. |

<a name="StorageAdapter+deleteItem"></a>

### storageAdapter.deleteItem(key)
Delete value.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | Key to delete. |

<a name="StorageAdapter+clear"></a>

### storageAdapter.clear(prefix)
Clear all values from this storage device.

**Kind**: instance method of [<code>StorageAdapter</code>](#StorageAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| prefix | <code>String</code> | Storage keys prefix. |

<a name="StorageAdapterMemory"></a>

## StorageAdapterMemory
Implement simple memory storage adapter.

**Kind**: global class  

* [StorageAdapterMemory](#StorageAdapterMemory)
    * [new StorageAdapterMemory()](#new_StorageAdapterMemory_new)
    * [.persistent](#StorageAdapterMemory+persistent)
    * [.isValid()](#StorageAdapterMemory+isValid)
    * [.exists()](#StorageAdapterMemory+exists)
    * [.setItem()](#StorageAdapterMemory+setItem)
    * [.getItem()](#StorageAdapterMemory+getItem)
    * [.deleteItem()](#StorageAdapterMemory+deleteItem)
    * [.clear()](#StorageAdapterMemory+clear)

<a name="new_StorageAdapterMemory_new"></a>

### new StorageAdapterMemory()
Create the memory storage adapter.

<a name="StorageAdapterMemory+persistent"></a>

### storageAdapterMemory.persistent
**Kind**: instance property of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+isValid"></a>

### storageAdapterMemory.isValid()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+exists"></a>

### storageAdapterMemory.exists()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+setItem"></a>

### storageAdapterMemory.setItem()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+getItem"></a>

### storageAdapterMemory.getItem()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+deleteItem"></a>

### storageAdapterMemory.deleteItem()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterMemory+clear"></a>

### storageAdapterMemory.clear()
**Kind**: instance method of [<code>StorageAdapterMemory</code>](#StorageAdapterMemory)  
<a name="StorageAdapterLocalStorage"></a>

## StorageAdapterLocalStorage
Implement simple localstorage storage adapter.

**Kind**: global class  

* [StorageAdapterLocalStorage](#StorageAdapterLocalStorage)
    * [.persistent](#StorageAdapterLocalStorage+persistent)
    * [.isValid()](#StorageAdapterLocalStorage+isValid)
    * [.exists()](#StorageAdapterLocalStorage+exists)
    * [.setItem()](#StorageAdapterLocalStorage+setItem)
    * [.getItem()](#StorageAdapterLocalStorage+getItem)
    * [.deleteItem()](#StorageAdapterLocalStorage+deleteItem)
    * [.clear()](#StorageAdapterLocalStorage+clear)

<a name="StorageAdapterLocalStorage+persistent"></a>

### storageAdapterLocalStorage.persistent
**Kind**: instance property of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+isValid"></a>

### storageAdapterLocalStorage.isValid()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+exists"></a>

### storageAdapterLocalStorage.exists()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+setItem"></a>

### storageAdapterLocalStorage.setItem()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+getItem"></a>

### storageAdapterLocalStorage.getItem()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+deleteItem"></a>

### storageAdapterLocalStorage.deleteItem()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterLocalStorage+clear"></a>

### storageAdapterLocalStorage.clear()
**Kind**: instance method of [<code>StorageAdapterLocalStorage</code>](#StorageAdapterLocalStorage)  
<a name="StorageAdapterSessionStorage"></a>

## StorageAdapterSessionStorage
Implement simple sessionStorage storage adapter.

**Kind**: global class  

* [StorageAdapterSessionStorage](#StorageAdapterSessionStorage)
    * [.persistent](#StorageAdapterSessionStorage+persistent)
    * [.isValid()](#StorageAdapterSessionStorage+isValid)
    * [.exists()](#StorageAdapterSessionStorage+exists)
    * [.setItem()](#StorageAdapterSessionStorage+setItem)
    * [.getItem()](#StorageAdapterSessionStorage+getItem)
    * [.deleteItem()](#StorageAdapterSessionStorage+deleteItem)
    * [.clear()](#StorageAdapterSessionStorage+clear)

<a name="StorageAdapterSessionStorage+persistent"></a>

### storageAdapterSessionStorage.persistent
**Kind**: instance property of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+isValid"></a>

### storageAdapterSessionStorage.isValid()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+exists"></a>

### storageAdapterSessionStorage.exists()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+setItem"></a>

### storageAdapterSessionStorage.setItem()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+getItem"></a>

### storageAdapterSessionStorage.getItem()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+deleteItem"></a>

### storageAdapterSessionStorage.deleteItem()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="StorageAdapterSessionStorage+clear"></a>

### storageAdapterSessionStorage.clear()
**Kind**: instance method of [<code>StorageAdapterSessionStorage</code>](#StorageAdapterSessionStorage)  
<a name="Transformation"></a>

## Transformation
Transformations helper class to store 2d position, rotation and scale.
Can also perform transformations inheritance, where we combine local with parent transformations.

**Kind**: global class  

* [Transformation](#Transformation)
    * [new Transformation(position, rotation, scale)](#new_Transformation_new)
    * _instance_
        * [.onChange](#Transformation+onChange) : <code>function</code>
        * [.getPosition()](#Transformation+getPosition) ⇒ [<code>Vector2</code>](#Vector2)
        * [.getPositionMode()](#Transformation+getPositionMode) ⇒ <code>TransformModes</code>
        * [.setPosition(value)](#Transformation+setPosition) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setPositionX(value)](#Transformation+setPositionX) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setPositionY(value)](#Transformation+setPositionY) ⇒ [<code>Transformation</code>](#Transformation)
        * [.move(value)](#Transformation+move) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setPositionMode(value)](#Transformation+setPositionMode) ⇒ [<code>Transformation</code>](#Transformation)
        * [.getScale()](#Transformation+getScale) ⇒ [<code>Vector2</code>](#Vector2)
        * [.getScaleMode()](#Transformation+getScaleMode) ⇒ <code>TransformModes</code>
        * [.setScale(value)](#Transformation+setScale) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setScaleX(value)](#Transformation+setScaleX) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setScaleY(value)](#Transformation+setScaleY) ⇒ [<code>Transformation</code>](#Transformation)
        * [.scale(value)](#Transformation+scale) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setScaleMode(value)](#Transformation+setScaleMode) ⇒ [<code>Transformation</code>](#Transformation)
        * [.getRotation()](#Transformation+getRotation) ⇒ <code>Number</code>
        * [.getRotationDegrees()](#Transformation+getRotationDegrees) ⇒ <code>Number</code>
        * [.getRotationDegreesWrapped()](#Transformation+getRotationDegreesWrapped) ⇒ <code>Number</code>
        * [.getRotationMode()](#Transformation+getRotationMode) ⇒ <code>TransformModes</code>
        * [.setRotation(value, wrap)](#Transformation+setRotation) ⇒ [<code>Transformation</code>](#Transformation)
        * [.rotate(value, wrap)](#Transformation+rotate) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setRotationDegrees(value, wrap)](#Transformation+setRotationDegrees) ⇒ [<code>Transformation</code>](#Transformation)
        * [.rotateDegrees(value)](#Transformation+rotateDegrees) ⇒ [<code>Transformation</code>](#Transformation)
        * [.setRotationMode(value)](#Transformation+setRotationMode) ⇒ [<code>Transformation</code>](#Transformation)
        * [._markDirty(localTransform, transformationModes)](#Transformation+_markDirty)
        * [.equals(other)](#Transformation+equals) ⇒ <code>Boolean</code>
        * [.clone()](#Transformation+clone) ⇒ [<code>Transformation</code>](#Transformation)
        * [.serialize()](#Transformation+serialize)
        * [.deserialize(data)](#Transformation+deserialize)
        * [.asMatrix()](#Transformation+asMatrix) ⇒ [<code>Matrix</code>](#Matrix)
    * _static_
        * [.combine(child, parent)](#Transformation.combine) ⇒ [<code>Transformation</code>](#Transformation)

<a name="new_Transformation_new"></a>

### new Transformation(position, rotation, scale)
Create the transformations.


| Param | Type | Description |
| --- | --- | --- |
| position | [<code>Vector2</code>](#Vector2) | Optional position value. |
| rotation | <code>Number</code> | Optional rotation value. |
| scale | [<code>Vector2</code>](#Vector2) | Optional sscale value. |

**Example**  
```js
// create local and world transformations
const transform = new Shaku.utils.Transformation();
const worldTransform = new Shaku.utils.Transformation();
// set offset to world transofm and rotation to local transform
worldTransform.setPosition({x: 100, y:50});
transform.setRotation(5);
// combine transformations and convert to a matrix
const combined = Shaku.utils.Transformation.combine(transform, worldTransform);
const matrix = combined.asMatrix();
```
<a name="Transformation+onChange"></a>

### transformation.onChange : <code>function</code>
Method to call when this transformation change.
Function params: transformation instance (this), properties changed (boolean), transform modes changed (boolean).

**Kind**: instance property of [<code>Transformation</code>](#Transformation)  
<a name="Transformation+getPosition"></a>

### transformation.getPosition() ⇒ [<code>Vector2</code>](#Vector2)
Get position.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Vector2</code>](#Vector2) - Position.  
<a name="Transformation+getPositionMode"></a>

### transformation.getPositionMode() ⇒ <code>TransformModes</code>
Get position transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>TransformModes</code> - Position transformation mode.  
<a name="Transformation+setPosition"></a>

### transformation.setPosition(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>Vector2</code>](#Vector2) | New position. |

<a name="Transformation+setPositionX"></a>

### transformation.setPositionX(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position X value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New position.x value. |

<a name="Transformation+setPositionY"></a>

### transformation.setPositionY(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position Y value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New position.y value. |

<a name="Transformation+move"></a>

### transformation.move(value) ⇒ [<code>Transformation</code>](#Transformation)
Move position by a given vector.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>Vector2</code>](#Vector2) | Vector to move position by. |

<a name="Transformation+setPositionMode"></a>

### transformation.setPositionMode(value) ⇒ [<code>Transformation</code>](#Transformation)
Set position transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TransformModes</code> | Position transformation mode. |

<a name="Transformation+getScale"></a>

### transformation.getScale() ⇒ [<code>Vector2</code>](#Vector2)
Get scale.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Vector2</code>](#Vector2) - Scale.  
<a name="Transformation+getScaleMode"></a>

### transformation.getScaleMode() ⇒ <code>TransformModes</code>
Get scale transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>TransformModes</code> - Scale transformation mode.  
<a name="Transformation+setScale"></a>

### transformation.setScale(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>Vector2</code>](#Vector2) | New scale. |

<a name="Transformation+setScaleX"></a>

### transformation.setScaleX(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale X value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New scale.x value. |

<a name="Transformation+setScaleY"></a>

### transformation.setScaleY(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale Y value.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New scale.y value. |

<a name="Transformation+scale"></a>

### transformation.scale(value) ⇒ [<code>Transformation</code>](#Transformation)
Scale by a given vector.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | [<code>Vector2</code>](#Vector2) | Vector to scale by. |

<a name="Transformation+setScaleMode"></a>

### transformation.setScaleMode(value) ⇒ [<code>Transformation</code>](#Transformation)
Set scale transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TransformModes</code> | Scale transformation mode. |

<a name="Transformation+getRotation"></a>

### transformation.getRotation() ⇒ <code>Number</code>
Get rotation.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Number</code> - rotation.  
<a name="Transformation+getRotationDegrees"></a>

### transformation.getRotationDegrees() ⇒ <code>Number</code>
Get rotation as degrees.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Number</code> - rotation.  
<a name="Transformation+getRotationDegreesWrapped"></a>

### transformation.getRotationDegreesWrapped() ⇒ <code>Number</code>
Get rotation as degrees, wrapped between 0 to 360.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Number</code> - rotation.  
<a name="Transformation+getRotationMode"></a>

### transformation.getRotationMode() ⇒ <code>TransformModes</code>
Get rotation transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>TransformModes</code> - Rotation transformations mode.  
<a name="Transformation+setRotation"></a>

### transformation.setRotation(value, wrap) ⇒ [<code>Transformation</code>](#Transformation)
Set rotation.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New rotation. |
| wrap | <code>Boolean</code> | If true, will wrap value if out of possible range. |

<a name="Transformation+rotate"></a>

### transformation.rotate(value, wrap) ⇒ [<code>Transformation</code>](#Transformation)
Rotate transformation by given radians.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Rotate value in radians. |
| wrap | <code>Boolean</code> | If true, will wrap value if out of possible range. |

<a name="Transformation+setRotationDegrees"></a>

### transformation.setRotationDegrees(value, wrap) ⇒ [<code>Transformation</code>](#Transformation)
Set rotation as degrees.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | New rotation. |
| wrap | <code>Boolean</code> | If true, will wrap value if out of possible range. |

<a name="Transformation+rotateDegrees"></a>

### transformation.rotateDegrees(value) ⇒ [<code>Transformation</code>](#Transformation)
Rotate transformation by given degrees.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>Number</code> | Rotate value in degrees. |

<a name="Transformation+setRotationMode"></a>

### transformation.setRotationMode(value) ⇒ [<code>Transformation</code>](#Transformation)
Set rotation transformations mode.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - this.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TransformModes</code> | Rotation transformation mode. |

<a name="Transformation+_markDirty"></a>

### transformation.\_markDirty(localTransform, transformationModes)
Notify about changes in values.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  

| Param | Type | Description |
| --- | --- | --- |
| localTransform | <code>Boolean</code> | Local transformations changed. |
| transformationModes | <code>Boolean</code> | Transformation modes changed. |

<a name="Transformation+equals"></a>

### transformation.equals(other) ⇒ <code>Boolean</code>
Check if this transformation equals another.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: <code>Boolean</code> - True if equal, false otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Transformation</code>](#Transformation) | Other transform to compare to. |

<a name="Transformation+clone"></a>

### transformation.clone() ⇒ [<code>Transformation</code>](#Transformation)
Return a clone of this transformations.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - Cloned transformations.  
<a name="Transformation+serialize"></a>

### transformation.serialize()
Serialize this transformation into a dictionary.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
<a name="Transformation+deserialize"></a>

### transformation.deserialize(data)
Deserialize this transformation from a dictionary.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Data to set. |

<a name="Transformation+asMatrix"></a>

### transformation.asMatrix() ⇒ [<code>Matrix</code>](#Matrix)
Create and return a transformation matrix.

**Kind**: instance method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Matrix</code>](#Matrix) - New transformation matrix.  
<a name="Transformation.combine"></a>

### Transformation.combine(child, parent) ⇒ [<code>Transformation</code>](#Transformation)
Combine child transformations with parent transformations.

**Kind**: static method of [<code>Transformation</code>](#Transformation)  
**Returns**: [<code>Transformation</code>](#Transformation) - Combined transformations.  

| Param | Type | Description |
| --- | --- | --- |
| child | [<code>Transformation</code>](#Transformation) | Child transformations. |
| parent | [<code>Transformation</code>](#Transformation) | Parent transformations. |

<a name="Vector2"></a>

## Vector2
A simple Vector object for 2d positions.

**Kind**: global class  

* [Vector2](#Vector2)
    * [new Vector2(x, y)](#new_Vector2_new)
    * _instance_
        * [.length](#Vector2+length) ⇒ <code>Number</code>
        * [.clone()](#Vector2+clone) ⇒ [<code>Vector2</code>](#Vector2)
        * [.set(x, y)](#Vector2+set) ⇒ [<code>Vector2</code>](#Vector2)
        * [.copy()](#Vector2+copy) ⇒ [<code>Vector2</code>](#Vector2)
        * [.add(Other)](#Vector2+add) ⇒ [<code>Vector2</code>](#Vector2)
        * [.sub(Other)](#Vector2+sub) ⇒ [<code>Vector2</code>](#Vector2)
        * [.div(Other)](#Vector2+div) ⇒ [<code>Vector2</code>](#Vector2)
        * [.mul(Other)](#Vector2+mul) ⇒ [<code>Vector2</code>](#Vector2)
        * [.round()](#Vector2+round) ⇒ [<code>Vector2</code>](#Vector2)
        * [.floor()](#Vector2+floor) ⇒ [<code>Vector2</code>](#Vector2)
        * [.ceil()](#Vector2+ceil) ⇒ [<code>Vector2</code>](#Vector2)
        * [.normalized()](#Vector2+normalized) ⇒ [<code>Vector2</code>](#Vector2)
        * [.rotatedRadians(radians)](#Vector2+rotatedRadians) ⇒ [<code>Vector2</code>](#Vector2)
        * [.rotatedDegrees(degrees)](#Vector2+rotatedDegrees) ⇒ [<code>Vector2</code>](#Vector2)
        * [.addSelf(Other)](#Vector2+addSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.subSelf(Other)](#Vector2+subSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.divSelf(Other)](#Vector2+divSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.mulSelf(Other)](#Vector2+mulSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.roundSelf()](#Vector2+roundSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.floorSelf()](#Vector2+floorSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.ceilSelf()](#Vector2+ceilSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.normalizeSelf()](#Vector2+normalizeSelf) ⇒ [<code>Vector2</code>](#Vector2)
        * [.equals(other)](#Vector2+equals) ⇒ <code>Boolean</code>
        * [.approximate(other, threshold)](#Vector2+approximate) ⇒ <code>Boolean</code>
        * [.scaled()](#Vector2+scaled) ⇒ [<code>Vector2</code>](#Vector2)
        * [.degreesTo(other)](#Vector2+degreesTo) ⇒ <code>Number</code>
        * [.radiansTo(other)](#Vector2+radiansTo) ⇒ <code>Number</code>
        * [.degreesToFull(other)](#Vector2+degreesToFull) ⇒ <code>Number</code>
        * [.radiansToFull(other)](#Vector2+radiansToFull) ⇒ <code>Number</code>
        * [.distanceTo(other)](#Vector2+distanceTo) ⇒ <code>Number</code>
        * [.getDegrees()](#Vector2+getDegrees) ⇒ <code>Number</code>
        * [.getRadians()](#Vector2+getRadians) ⇒ <code>Number</code>
        * [.string()](#Vector2+string)
        * [.toArray()](#Vector2+toArray) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.toDict(minimized)](#Vector2+toDict) ⇒ <code>\*</code>
    * _static_
        * [.zero](#Vector2.zero) ⇒ [<code>Vector2</code>](#Vector2)
        * [.one](#Vector2.one) ⇒ [<code>Vector2</code>](#Vector2)
        * [.half](#Vector2.half) ⇒ [<code>Vector2</code>](#Vector2)
        * [.left](#Vector2.left) ⇒ [<code>Vector2</code>](#Vector2)
        * [.right](#Vector2.right) ⇒ [<code>Vector2</code>](#Vector2)
        * [.up](#Vector2.up) ⇒ [<code>Vector2</code>](#Vector2)
        * [.down](#Vector2.down) ⇒ [<code>Vector2</code>](#Vector2)
        * [.random](#Vector2.random) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromDegree(degrees)](#Vector2.fromDegree) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromRadians(radians)](#Vector2.fromRadians) ⇒ [<code>Vector2</code>](#Vector2)
        * [.lerp(p1, p2, a)](#Vector2.lerp) ⇒ [<code>Vector2</code>](#Vector2)
        * [.degreesBetween(p1, p2)](#Vector2.degreesBetween) ⇒ <code>Number</code>
        * [.radiansBetween(p1, p2)](#Vector2.radiansBetween) ⇒ <code>Number</code>
        * [.degreesBetweenFull(p1, p2)](#Vector2.degreesBetweenFull) ⇒ <code>Number</code>
        * [.radiansBetweenFull(p1, p2)](#Vector2.radiansBetweenFull) ⇒ <code>Number</code>
        * [.distance(p1, p2)](#Vector2.distance) ⇒ <code>Number</code>
        * [.cross(p1, p2)](#Vector2.cross) ⇒ <code>Number</code>
        * [.dot(p1, p2)](#Vector2.dot) ⇒ <code>Number</code>
        * [.parse(str)](#Vector2.parse) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromArray(arr)](#Vector2.fromArray) ⇒ [<code>Vector2</code>](#Vector2)
        * [.fromDict(data)](#Vector2.fromDict) ⇒ [<code>Vector2</code>](#Vector2)

<a name="new_Vector2_new"></a>

### new Vector2(x, y)
Create the Vector object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> | <code>0</code> | Vector X. |
| y | <code>number</code> | <code>0</code> | Vector Y. |

<a name="Vector2+length"></a>

### vector2.length ⇒ <code>Number</code>
Return vector length (aka magnitude).

**Kind**: instance property of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Vector length.  
<a name="Vector2+clone"></a>

### vector2.clone() ⇒ [<code>Vector2</code>](#Vector2)
Clone the vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - cloned vector.  
<a name="Vector2+set"></a>

### vector2.set(x, y) ⇒ [<code>Vector2</code>](#Vector2)
Set vector value.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X component. |
| y | <code>Number</code> | Y component. |

<a name="Vector2+copy"></a>

### vector2.copy() ⇒ [<code>Vector2</code>](#Vector2)
Copy values from other vector into self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+add"></a>

### vector2.add(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this + other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to add. |

<a name="Vector2+sub"></a>

### vector2.sub(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this - other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to sub. |

<a name="Vector2+div"></a>

### vector2.div(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this / other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to divide. |

<a name="Vector2+mul"></a>

### vector2.mul(Other) ⇒ [<code>Vector2</code>](#Vector2)
Return a new vector of this * other.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to multiply. |

<a name="Vector2+round"></a>

### vector2.round() ⇒ [<code>Vector2</code>](#Vector2)
Return a round copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+floor"></a>

### vector2.floor() ⇒ [<code>Vector2</code>](#Vector2)
Return a floored copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+ceil"></a>

### vector2.ceil() ⇒ [<code>Vector2</code>](#Vector2)
Return a ceiled copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+normalized"></a>

### vector2.normalized() ⇒ [<code>Vector2</code>](#Vector2)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+rotatedRadians"></a>

### vector2.rotatedRadians(radians) ⇒ [<code>Vector2</code>](#Vector2)
Get a copy of this vector rotated by radians.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - New vector with the length of this vector and direction rotated by given radians.  

| Param | Type | Description |
| --- | --- | --- |
| radians | <code>Number</code> | Radians to rotate by. |

<a name="Vector2+rotatedDegrees"></a>

### vector2.rotatedDegrees(degrees) ⇒ [<code>Vector2</code>](#Vector2)
Get a copy of this vector rotated by degrees.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - New vector with the length of this vector and direction rotated by given degrees.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Degrees to rotate by. |

<a name="Vector2+addSelf"></a>

### vector2.addSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Add other vector values to self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to add. |

<a name="Vector2+subSelf"></a>

### vector2.subSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Sub other vector values from self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to substract. |

<a name="Vector2+divSelf"></a>

### vector2.divSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Divide this vector by other vector values.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to divide by. |

<a name="Vector2+mulSelf"></a>

### vector2.mulSelf(Other) ⇒ [<code>Vector2</code>](#Vector2)
Multiply this vector by other vector values.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector2</code>](#Vector2) | Vector or number to multiply by. |

<a name="Vector2+roundSelf"></a>

### vector2.roundSelf() ⇒ [<code>Vector2</code>](#Vector2)
Round self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+floorSelf"></a>

### vector2.floorSelf() ⇒ [<code>Vector2</code>](#Vector2)
Floor self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+ceilSelf"></a>

### vector2.ceilSelf() ⇒ [<code>Vector2</code>](#Vector2)
Ceil self.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+normalizeSelf"></a>

### vector2.normalizeSelf() ⇒ [<code>Vector2</code>](#Vector2)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - this.  
<a name="Vector2+equals"></a>

### vector2.equals(other) ⇒ <code>Boolean</code>
Return if vector equals another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector to compare to. |

<a name="Vector2+approximate"></a>

### vector2.approximate(other, threshold) ⇒ <code>Boolean</code>
Return if vector approximately equals another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector to compare to. |
| threshold | <code>Number</code> | Distance threshold to consider as equal. Defaults to 1. |

<a name="Vector2+scaled"></a>

### vector2.scaled() ⇒ [<code>Vector2</code>](#Vector2)
Return a copy of this vector multiplied by a factor.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2+degreesTo"></a>

### vector2.degreesTo(other) ⇒ <code>Number</code>
Get degrees between this vector and another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+radiansTo"></a>

### vector2.radiansTo(other) ⇒ <code>Number</code>
Get radians between this vector and another vector.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+degreesToFull"></a>

### vector2.degreesToFull(other) ⇒ <code>Number</code>
Get degrees between this vector and another vector.
Return values between 0 to 360.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+radiansToFull"></a>

### vector2.radiansToFull(other) ⇒ <code>Number</code>
Get radians between this vector and another vector.
Return values between 0 to PI2.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+distanceTo"></a>

### vector2.distanceTo(other) ⇒ <code>Number</code>
Calculate distance between this vector and another vectors.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector2</code>](#Vector2) | Other vector. |

<a name="Vector2+getDegrees"></a>

### vector2.getDegrees() ⇒ <code>Number</code>
Get vector's angle in degrees.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Vector angle in degrees.  
<a name="Vector2+getRadians"></a>

### vector2.getRadians() ⇒ <code>Number</code>
Get vector's angle in radians.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Vector angle in degrees.  
<a name="Vector2+string"></a>

### vector2.string()
Convert to string.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
<a name="Vector2+toArray"></a>

### vector2.toArray() ⇒ <code>Array.&lt;Number&gt;</code>
Convert to array of numbers.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Array.&lt;Number&gt;</code> - Vector components as array.  
<a name="Vector2+toDict"></a>

### vector2.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>\*</code> - Dictionary with {x,y}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Vector2.zero"></a>

### Vector2.zero ⇒ [<code>Vector2</code>](#Vector2)
Get vector (0,0).

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.one"></a>

### Vector2.one ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 1,1 values.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.half"></a>

### Vector2.half ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 0.5,0.5 values.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.left"></a>

### Vector2.left ⇒ [<code>Vector2</code>](#Vector2)
Get vector with -1,0 values.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.right"></a>

### Vector2.right ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 1,0 values.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.up"></a>

### Vector2.up ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 0,-1 values.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.down"></a>

### Vector2.down ⇒ [<code>Vector2</code>](#Vector2)
Get vector with 0,1 values.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.random"></a>

### Vector2.random ⇒ [<code>Vector2</code>](#Vector2)
Get a random vector with length of 1.

**Kind**: static property of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  
<a name="Vector2.fromDegree"></a>

### Vector2.fromDegree(degrees) ⇒ [<code>Vector2</code>](#Vector2)
Get vector from degrees.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| degrees | <code>Number</code> | Angle to create vector from (0 = vector pointing right). |

<a name="Vector2.fromRadians"></a>

### Vector2.fromRadians(radians) ⇒ [<code>Vector2</code>](#Vector2)
Get vector from radians.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| radians | <code>Number</code> | Angle to create vector from (0 = vector pointing right). |

<a name="Vector2.lerp"></a>

### Vector2.lerp(p1, p2, a) ⇒ [<code>Vector2</code>](#Vector2)
Lerp between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="Vector2.degreesBetween"></a>

### Vector2.degreesBetween(p1, p2) ⇒ <code>Number</code>
Get degrees between two vectors.
Return values between -180 to 180.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.radiansBetween"></a>

### Vector2.radiansBetween(p1, p2) ⇒ <code>Number</code>
Get radians between two vectors.
Return values between -PI to PI.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.degreesBetweenFull"></a>

### Vector2.degreesBetweenFull(p1, p2) ⇒ <code>Number</code>
Get degrees between two vectors.
Return values between 0 to 360.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in degrees.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.radiansBetweenFull"></a>

### Vector2.radiansBetweenFull(p1, p2) ⇒ <code>Number</code>
Get radians between two vectors.
Return values between 0 to PI2.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Angle between vectors in radians.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.distance"></a>

### Vector2.distance(p1, p2) ⇒ <code>Number</code>
Calculate distance between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.cross"></a>

### Vector2.cross(p1, p2) ⇒ <code>Number</code>
Return cross product between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Cross between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.dot"></a>

### Vector2.dot(p1, p2) ⇒ <code>Number</code>
Return dot product between two vectors.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: <code>Number</code> - Dot between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector2</code>](#Vector2) | First vector. |
| p2 | [<code>Vector2</code>](#Vector2) | Second vector. |

<a name="Vector2.parse"></a>

### Vector2.parse(str) ⇒ [<code>Vector2</code>](#Vector2)
Parse and return a vector object from string in the form of "x,y".

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Parsed vector.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String to parse. |

<a name="Vector2.fromArray"></a>

### Vector2.fromArray(arr) ⇒ [<code>Vector2</code>](#Vector2)
Create vector from array of numbers.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Vector instance.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Number&gt;</code> | Array of numbers to create vector from. |

<a name="Vector2.fromDict"></a>

### Vector2.fromDict(data) ⇒ [<code>Vector2</code>](#Vector2)
Create vector from a dictionary.

**Kind**: static method of [<code>Vector2</code>](#Vector2)  
**Returns**: [<code>Vector2</code>](#Vector2) - Newly created vector.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {x,y}. |

<a name="Vector3"></a>

## Vector3
A Vector object for 3d positions.

**Kind**: global class  

* [Vector3](#Vector3)
    * [new Vector3(x, y, z)](#new_Vector3_new)
    * _instance_
        * [.length](#Vector3+length) ⇒ <code>Number</code>
        * [.clone()](#Vector3+clone) ⇒ [<code>Vector3</code>](#Vector3)
        * [.set(x, y, z)](#Vector3+set) ⇒ [<code>Vector3</code>](#Vector3)
        * [.copy()](#Vector3+copy) ⇒ [<code>Vector3</code>](#Vector3)
        * [.add(Other)](#Vector3+add) ⇒ [<code>Vector3</code>](#Vector3)
        * [.sub(Other)](#Vector3+sub) ⇒ [<code>Vector3</code>](#Vector3)
        * [.div(Other)](#Vector3+div) ⇒ [<code>Vector3</code>](#Vector3)
        * [.mul(Other)](#Vector3+mul) ⇒ [<code>Vector3</code>](#Vector3)
        * [.round()](#Vector3+round) ⇒ [<code>Vector3</code>](#Vector3)
        * [.floor()](#Vector3+floor) ⇒ [<code>Vector3</code>](#Vector3)
        * [.ceil()](#Vector3+ceil) ⇒ [<code>Vector3</code>](#Vector3)
        * [.normalized()](#Vector3+normalized) ⇒ [<code>Vector3</code>](#Vector3)
        * [.addSelf(Other)](#Vector3+addSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.subSelf(Other)](#Vector3+subSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.divSelf(Other)](#Vector3+divSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.mulSelf(Other)](#Vector3+mulSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.roundSelf()](#Vector3+roundSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.floorSelf()](#Vector3+floorSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.ceilSelf()](#Vector3+ceilSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.normalizeSelf()](#Vector3+normalizeSelf) ⇒ [<code>Vector3</code>](#Vector3)
        * [.equals(other)](#Vector3+equals) ⇒ <code>Boolean</code>
        * [.approximate(other, threshold)](#Vector3+approximate) ⇒ <code>Boolean</code>
        * [.scaled()](#Vector3+scaled) ⇒ [<code>Vector3</code>](#Vector3)
        * [.distanceTo(other)](#Vector3+distanceTo) ⇒ <code>Number</code>
        * [.string()](#Vector3+string)
        * [.toArray()](#Vector3+toArray) ⇒ <code>Array.&lt;Number&gt;</code>
        * [.toDict(minimized)](#Vector3+toDict) ⇒ <code>\*</code>
    * _static_
        * [.zero](#Vector3.zero) ⇒ [<code>Vector3</code>](#Vector3)
        * [.one](#Vector3.one) ⇒ [<code>Vector3</code>](#Vector3)
        * [.half](#Vector3.half) ⇒ [<code>Vector3</code>](#Vector3)
        * [.left](#Vector3.left) ⇒ [<code>Vector3</code>](#Vector3)
        * [.right](#Vector3.right) ⇒ [<code>Vector3</code>](#Vector3)
        * [.up](#Vector3.up) ⇒ [<code>Vector3</code>](#Vector3)
        * [.down](#Vector3.down) ⇒ [<code>Vector3</code>](#Vector3)
        * [.front](#Vector3.front) ⇒ [<code>Vector3</code>](#Vector3)
        * [.back](#Vector3.back) ⇒ [<code>Vector3</code>](#Vector3)
        * [.lerp(p1, p2, a)](#Vector3.lerp) ⇒ [<code>Vector3</code>](#Vector3)
        * [.distance(p1, p2)](#Vector3.distance) ⇒ <code>Number</code>
        * [.crossVector(p1, p2)](#Vector3.crossVector) ⇒ [<code>Vector3</code>](#Vector3)
        * [.parse(str)](#Vector3.parse) ⇒ [<code>Vector3</code>](#Vector3)
        * [.fromArray(arr)](#Vector3.fromArray) ⇒ [<code>Vector3</code>](#Vector3)
        * [.fromDict(data)](#Vector3.fromDict) ⇒ [<code>Vector3</code>](#Vector3)

<a name="new_Vector3_new"></a>

### new Vector3(x, y, z)
Create the Vector object.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| x | <code>number</code> | <code>0</code> | Vector X. |
| y | <code>number</code> | <code>0</code> | Vector Y. |
| z | <code>number</code> | <code>0</code> | Vector Z. |

<a name="Vector3+length"></a>

### vector3.length ⇒ <code>Number</code>
Return vector length (aka magnitude).

**Kind**: instance property of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Number</code> - Vector length.  
<a name="Vector3+clone"></a>

### vector3.clone() ⇒ [<code>Vector3</code>](#Vector3)
Clone the vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - cloned vector.  
<a name="Vector3+set"></a>

### vector3.set(x, y, z) ⇒ [<code>Vector3</code>](#Vector3)
Set vector value.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | X component. |
| y | <code>Number</code> | Y component. |
| z | <code>Number</code> | Z component. |

<a name="Vector3+copy"></a>

### vector3.copy() ⇒ [<code>Vector3</code>](#Vector3)
Copy values from other vector into self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+add"></a>

### vector3.add(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this + other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to add. |

<a name="Vector3+sub"></a>

### vector3.sub(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this - other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to sub. |

<a name="Vector3+div"></a>

### vector3.div(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this / other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to divide. |

<a name="Vector3+mul"></a>

### vector3.mul(Other) ⇒ [<code>Vector3</code>](#Vector3)
Return a new vector of this * other.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to multiply. |

<a name="Vector3+round"></a>

### vector3.round() ⇒ [<code>Vector3</code>](#Vector3)
Return a round copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+floor"></a>

### vector3.floor() ⇒ [<code>Vector3</code>](#Vector3)
Return a floored copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+ceil"></a>

### vector3.ceil() ⇒ [<code>Vector3</code>](#Vector3)
Return a ceiled copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+normalized"></a>

### vector3.normalized() ⇒ [<code>Vector3</code>](#Vector3)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+addSelf"></a>

### vector3.addSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Add other vector values to self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to add. |

<a name="Vector3+subSelf"></a>

### vector3.subSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Sub other vector values from self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to substract. |

<a name="Vector3+divSelf"></a>

### vector3.divSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Divide this vector by other vector values.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to divide by. |

<a name="Vector3+mulSelf"></a>

### vector3.mulSelf(Other) ⇒ [<code>Vector3</code>](#Vector3)
Multiply this vector by other vector values.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  

| Param | Type | Description |
| --- | --- | --- |
| Other | <code>Number</code> \| [<code>Vector3</code>](#Vector3) | Vector or number to multiply by. |

<a name="Vector3+roundSelf"></a>

### vector3.roundSelf() ⇒ [<code>Vector3</code>](#Vector3)
Round self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+floorSelf"></a>

### vector3.floorSelf() ⇒ [<code>Vector3</code>](#Vector3)
Floor self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+ceilSelf"></a>

### vector3.ceilSelf() ⇒ [<code>Vector3</code>](#Vector3)
Ceil self.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+normalizeSelf"></a>

### vector3.normalizeSelf() ⇒ [<code>Vector3</code>](#Vector3)
Return a normalized copy of this vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - this.  
<a name="Vector3+equals"></a>

### vector3.equals(other) ⇒ <code>Boolean</code>
Return if vector equals another vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector3</code>](#Vector3) | Other vector to compare to. |

<a name="Vector3+approximate"></a>

### vector3.approximate(other, threshold) ⇒ <code>Boolean</code>
Return if vector approximately equals another vector.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Boolean</code> - if vectors are equal.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector3</code>](#Vector3) | Other vector to compare to. |
| threshold | <code>Number</code> | Distance threshold to consider as equal. Defaults to 1. |

<a name="Vector3+scaled"></a>

### vector3.scaled() ⇒ [<code>Vector3</code>](#Vector3)
Return a copy of this vector multiplied by a factor.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3+distanceTo"></a>

### vector3.distanceTo(other) ⇒ <code>Number</code>
Calculate distance between this vector and another vectors.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| other | [<code>Vector3</code>](#Vector3) | Other vector. |

<a name="Vector3+string"></a>

### vector3.string()
Convert to string.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
<a name="Vector3+toArray"></a>

### vector3.toArray() ⇒ <code>Array.&lt;Number&gt;</code>
Convert to array of numbers.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Array.&lt;Number&gt;</code> - Vector components as array.  
<a name="Vector3+toDict"></a>

### vector3.toDict(minimized) ⇒ <code>\*</code>
Convert to dictionary.

**Kind**: instance method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>\*</code> - Dictionary with {x,y,z}  

| Param | Type | Description |
| --- | --- | --- |
| minimized | <code>Boolean</code> | If true, will not include keys that their values are 0. You can use fromDict on minimized dicts. |

<a name="Vector3.zero"></a>

### Vector3.zero ⇒ [<code>Vector3</code>](#Vector3)
Get vector (0,0).

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.one"></a>

### Vector3.one ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 1,1 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.half"></a>

### Vector3.half ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0.5,0.5 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.left"></a>

### Vector3.left ⇒ [<code>Vector3</code>](#Vector3)
Get vector with -1,0 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.right"></a>

### Vector3.right ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 1,0 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.up"></a>

### Vector3.up ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,-1 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.down"></a>

### Vector3.down ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,1 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.front"></a>

### Vector3.front ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,0,-1 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.back"></a>

### Vector3.back ⇒ [<code>Vector3</code>](#Vector3)
Get vector with 0,0,1 values.

**Kind**: static property of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  
<a name="Vector3.lerp"></a>

### Vector3.lerp(p1, p2, a) ⇒ [<code>Vector3</code>](#Vector3)
Lerp between two vectors.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - result vector.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector3</code>](#Vector3) | First vector. |
| p2 | [<code>Vector3</code>](#Vector3) | Second vector. |
| a | <code>Number</code> | Lerp factor (0.0 - 1.0). |

<a name="Vector3.distance"></a>

### Vector3.distance(p1, p2) ⇒ <code>Number</code>
Calculate distance between two vectors.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: <code>Number</code> - Distance between vectors.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector3</code>](#Vector3) | First vector. |
| p2 | [<code>Vector3</code>](#Vector3) | Second vector. |

<a name="Vector3.crossVector"></a>

### Vector3.crossVector(p1, p2) ⇒ [<code>Vector3</code>](#Vector3)
Return cross product between two vectors.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Crossed vector.  

| Param | Type | Description |
| --- | --- | --- |
| p1 | [<code>Vector3</code>](#Vector3) | First vector. |
| p2 | [<code>Vector3</code>](#Vector3) | Second vector. |

<a name="Vector3.parse"></a>

### Vector3.parse(str) ⇒ [<code>Vector3</code>](#Vector3)
Parse and return a vector object from string in the form of "x,y".

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Parsed vector.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>String</code> | String to parse. |

<a name="Vector3.fromArray"></a>

### Vector3.fromArray(arr) ⇒ [<code>Vector3</code>](#Vector3)
Create vector from array of numbers.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Vector instance.  

| Param | Type | Description |
| --- | --- | --- |
| arr | <code>Array.&lt;Number&gt;</code> | Array of numbers to create vector from. |

<a name="Vector3.fromDict"></a>

### Vector3.fromDict(data) ⇒ [<code>Vector3</code>](#Vector3)
Create vector from a dictionary.

**Kind**: static method of [<code>Vector3</code>](#Vector3)  
**Returns**: [<code>Vector3</code>](#Vector3) - Newly created vector.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Dictionary with {x,y,z}. |


![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Texture Asset

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
    * [.size](#TextureAsset+size) ⇒ <code>Vector2</code>
    * [.texture](#TextureAsset+texture)
    * [.valid](#TextureAsset+valid)
    * [.load(params)](#TextureAsset+load) ⇒ <code>Promise</code>
    * [.createRenderTarget(width, height)](#TextureAsset+createRenderTarget)
    * [.fromImage(image, params)](#TextureAsset+fromImage)
    * [.create(source, params)](#TextureAsset+create) ⇒ <code>Promise</code>
    * [.getPixel(x, y)](#TextureAsset+getPixel) ⇒ <code>Color</code>
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

### textureAsset.size ⇒ <code>Vector2</code>
Get texture size as a vector.

**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Vector2</code> - Texture size.  
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
| params | <code>\*</code> | Optional additional params. Possible values are:                      - generateMipMaps (default=false): should we generate mipmaps for this texture? |

<a name="TextureAsset+createRenderTarget"></a>

### textureAsset.createRenderTarget(width, height)
Create this texture as an empty render target.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  

| Param | Type | Description |
| --- | --- | --- |
| width | <code>Number</code> | Texture width. |
| height | <code>Number</code> | Texture height. |

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

### textureAsset.getPixel(x, y) ⇒ <code>Color</code>
Get pixel color from image.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Color</code> - Pixel color.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Pixel X value. |
| y | <code>Number</code> | Pixel Y value. |

<a name="TextureAsset+destroy"></a>

### textureAsset.destroy()
**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  

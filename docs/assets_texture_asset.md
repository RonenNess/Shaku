![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Texture Asset

<a name="TextureAsset"></a>

## TextureAsset
A loadable texture asset.
This asset type loads an image from URL or source, and turn it into a texture.

**Kind**: global class  

* [TextureAsset](#TextureAsset)
    * [.image](#TextureAsset+image)
    * [.width](#TextureAsset+width)
    * [.height](#TextureAsset+height)
    * [._glTexture](#TextureAsset+_glTexture)
    * [.valid](#TextureAsset+valid)
    * [.load(params)](#TextureAsset+load) ⇒ <code>Promise</code>
    * [.createRenderTarget(width, height, channels)](#TextureAsset+createRenderTarget)
    * [.fromImage(image, params)](#TextureAsset+fromImage)
    * [.create(source, params)](#TextureAsset+create) ⇒ <code>Promise</code>
    * [.getPixel(x, y)](#TextureAsset+getPixel) ⇒ <code>Color</code>
    * [.getPixelsData([x], [y], [width], [height])](#TextureAsset+getPixelsData) ⇒ <code>Array.&lt;Array.&lt;Color&gt;&gt;</code>
    * [.destroy()](#TextureAsset+destroy)

<a name="TextureAsset+image"></a>

### textureAsset.image
**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
<a name="TextureAsset+width"></a>

### textureAsset.width
**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
<a name="TextureAsset+height"></a>

### textureAsset.height
**Kind**: instance property of [<code>TextureAsset</code>](#TextureAsset)  
<a name="TextureAsset+_glTexture"></a>

### textureAsset.\_glTexture
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
| params | <code>\*</code> | Optional additional params. Possible values are:                      - generateMipMaps (default=false): if true, will generate mipmaps for this texture.                      - crossOrigin (default=undefined): if set, will set the crossOrigin property with this value.                      - flipY (default=false): if true, will flip texture on Y axis.                      - premultiplyAlpha (default=false): if true, will load texture with premultiply alpha flag set. |

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

### textureAsset.getPixel(x, y) ⇒ <code>Color</code>
Get pixel color from image.
Note: this method is quite slow, if you need to perform multiple queries consider using `getPixelsData()` once to get all pixels data instead.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Color</code> - Pixel color.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>Number</code> | Pixel X value. |
| y | <code>Number</code> | Pixel Y value. |

<a name="TextureAsset+getPixelsData"></a>

### textureAsset.getPixelsData([x], [y], [width], [height]) ⇒ <code>Array.&lt;Array.&lt;Color&gt;&gt;</code>
Get a 2D array with pixel colors.

**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  
**Returns**: <code>Array.&lt;Array.&lt;Color&gt;&gt;</code> - A 2D array with all texture pixel colors.  

| Param | Type | Description |
| --- | --- | --- |
| [x] | <code>Number</code> | Offset X in texture to get. Defaults to 0. |
| [y] | <code>Number</code> | Offset Y in texture to get. Defaults to 0. |
| [width] | <code>Number</code> | How many pixels to get on X axis. Defaults to texture width - x. |
| [height] | <code>Number</code> | How many pixels to get on Y axis. Defaults to texture height - y. |

<a name="TextureAsset+destroy"></a>

### textureAsset.destroy()
**Kind**: instance method of [<code>TextureAsset</code>](#TextureAsset)  

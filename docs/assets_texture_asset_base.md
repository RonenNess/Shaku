![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Texture Asset Base

<a name="TextureAssetBase"></a>

## TextureAssetBase
Base type for all texture asset types.

**Kind**: global class  

* [TextureAssetBase](#TextureAssetBase)
    * [.filter](#TextureAssetBase+filter)
    * [.filter](#TextureAssetBase+filter)
    * [.wrapMode](#TextureAssetBase+wrapMode)
    * [.wrapMode](#TextureAssetBase+wrapMode)
    * [.image](#TextureAssetBase+image) ⇒ <code>Image</code>
    * [.width](#TextureAssetBase+width) ⇒ <code>Number</code>
    * [.height](#TextureAssetBase+height) ⇒ <code>Number</code>
    * [._glTexture](#TextureAssetBase+_glTexture)
    * [.getSize()](#TextureAssetBase+getSize) ⇒ <code>Vector2</code>

<a name="TextureAssetBase+filter"></a>

### textureAssetBase.filter
Get texture magnifying filter, or null to use default.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**See**: Shaku.gfx.TextureFilterModes  
<a name="TextureAssetBase+filter"></a>

### textureAssetBase.filter
Set texture magnifying filter.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**See**: Shaku.gfx.TextureFilterModes  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TextureFilterMode</code> | Filter mode to use or null to use default. |

<a name="TextureAssetBase+wrapMode"></a>

### textureAssetBase.wrapMode
Get texture wrapping mode, or null to use default.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**See**: Shaku.gfx.TextureWrapModes  
<a name="TextureAssetBase+wrapMode"></a>

### textureAssetBase.wrapMode
Set texture wrapping mode.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**See**: Shaku.gfx.TextureWrapModes  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>TextureWrapMode</code> | Wrapping mode to use or null to use default. |

<a name="TextureAssetBase+image"></a>

### textureAssetBase.image ⇒ <code>Image</code>
Get raw image.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**Returns**: <code>Image</code> - Image instance.  
<a name="TextureAssetBase+width"></a>

### textureAssetBase.width ⇒ <code>Number</code>
Get texture width.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**Returns**: <code>Number</code> - Texture width.  
<a name="TextureAssetBase+height"></a>

### textureAssetBase.height ⇒ <code>Number</code>
Get texture height.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**Returns**: <code>Number</code> - Texture height.  
<a name="TextureAssetBase+_glTexture"></a>

### textureAssetBase.\_glTexture
Get texture instance for WebGL.

**Kind**: instance property of [<code>TextureAssetBase</code>](#TextureAssetBase)  
<a name="TextureAssetBase+getSize"></a>

### textureAssetBase.getSize() ⇒ <code>Vector2</code>
Get texture size as a vector.

**Kind**: instance method of [<code>TextureAssetBase</code>](#TextureAssetBase)  
**Returns**: <code>Vector2</code> - Texture size.  

![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Texture In Atlas Asset

<a name="TextureInAtlasAsset"></a>

## TextureInAtlasAsset
A texture that is part of a texture atlas.
Stores a texture that was generated by the texture atlas + the source rectangle in texture for this segment.

**Kind**: global class  

* [TextureInAtlasAsset](#TextureInAtlasAsset)
    * [.sourceRectangle](#TextureInAtlasAsset+sourceRectangle) ⇒ <code>Rectangle</code>
    * [.sourceRectangleNormalized](#TextureInAtlasAsset+sourceRectangleNormalized) ⇒ <code>Rectangle</code>
    * [.texture](#TextureInAtlasAsset+texture) ⇒ <code>TextureAsset</code>
    * [.atlas](#TextureInAtlasAsset+atlas) ⇒ <code>TextureAtlasAsset</code>
    * [.image](#TextureInAtlasAsset+image)
    * [.width](#TextureInAtlasAsset+width)
    * [.height](#TextureInAtlasAsset+height)
    * [._glTexture](#TextureInAtlasAsset+_glTexture)
    * [.valid](#TextureInAtlasAsset+valid)
    * [.destroy()](#TextureInAtlasAsset+destroy)

<a name="TextureInAtlasAsset+sourceRectangle"></a>

### textureInAtlasAsset.sourceRectangle ⇒ <code>Rectangle</code>
Return the source rectangle in texture atlas.

**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
**Returns**: <code>Rectangle</code> - Source rectangle.  
<a name="TextureInAtlasAsset+sourceRectangleNormalized"></a>

### textureInAtlasAsset.sourceRectangleNormalized ⇒ <code>Rectangle</code>
Return the source rectangle in texture atlas, in normalized 0.0-1.0 values.

**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
**Returns**: <code>Rectangle</code> - Source rectangle.  
<a name="TextureInAtlasAsset+texture"></a>

### textureInAtlasAsset.texture ⇒ <code>TextureAsset</code>
Return the texture asset of this atlas texture.

**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
**Returns**: <code>TextureAsset</code> - Texture asset.  
<a name="TextureInAtlasAsset+atlas"></a>

### textureInAtlasAsset.atlas ⇒ <code>TextureAtlasAsset</code>
Return the texture atlas class.

**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
**Returns**: <code>TextureAtlasAsset</code> - Parent atlas.  
<a name="TextureInAtlasAsset+image"></a>

### textureInAtlasAsset.image
**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
<a name="TextureInAtlasAsset+width"></a>

### textureInAtlasAsset.width
**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
<a name="TextureInAtlasAsset+height"></a>

### textureInAtlasAsset.height
**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
<a name="TextureInAtlasAsset+_glTexture"></a>

### textureInAtlasAsset.\_glTexture
**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
<a name="TextureInAtlasAsset+valid"></a>

### textureInAtlasAsset.valid
**Kind**: instance property of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
<a name="TextureInAtlasAsset+destroy"></a>

### textureInAtlasAsset.destroy()
**Kind**: instance method of [<code>TextureInAtlasAsset</code>](#TextureInAtlasAsset)  
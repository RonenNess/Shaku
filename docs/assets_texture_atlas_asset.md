![Shaku JS](resources/logo-sm.png)

[Back To Table of Content](index.md)

# Texture Atlas Asset

## Classes

<dl>
<dt><a href="#TextureAtlasAsset">TextureAtlasAsset</a></dt>
<dd><p>A texture atlas we can build at runtime to combine together multiple textures.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#loadAllSources">loadAllSources()</a></dt>
<dd><p>Convert list of sources that are either Image instances or URL strings to fully loaded Image instances.
Wait for image loading if needed.</p>
</dd>
</dl>

<a name="TextureAtlasAsset"></a>

## TextureAtlasAsset
A texture atlas we can build at runtime to combine together multiple textures.

**Kind**: global class  

* [TextureAtlasAsset](#TextureAtlasAsset)
    * [.textures](#TextureAtlasAsset+textures) ⇒ <code>Array.&lt;TextureAsset&gt;</code>
    * [.valid](#TextureAtlasAsset+valid)
    * [.getTexture(url)](#TextureAtlasAsset+getTexture) ⇒ <code>TextureInAtlasAsset</code>
    * [.destroy()](#TextureAtlasAsset+destroy)

<a name="TextureAtlasAsset+textures"></a>

### textureAtlasAsset.textures ⇒ <code>Array.&lt;TextureAsset&gt;</code>
Get a list with all textures in atlas.

**Kind**: instance property of [<code>TextureAtlasAsset</code>](#TextureAtlasAsset)  
**Returns**: <code>Array.&lt;TextureAsset&gt;</code> - Textures in atlas.  
<a name="TextureAtlasAsset+valid"></a>

### textureAtlasAsset.valid
**Kind**: instance property of [<code>TextureAtlasAsset</code>](#TextureAtlasAsset)  
<a name="TextureAtlasAsset+getTexture"></a>

### textureAtlasAsset.getTexture(url) ⇒ <code>TextureInAtlasAsset</code>
Get texture asset and source rectangle for a desired image URL.

**Kind**: instance method of [<code>TextureAtlasAsset</code>](#TextureAtlasAsset)  
**Returns**: <code>TextureInAtlasAsset</code> - Texture in atlas asset, or null if not found.  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>String</code> | URL to fetch texture and source from. Can be full URL, relative URL, or absolute URL starting from /. |

<a name="TextureAtlasAsset+destroy"></a>

### textureAtlasAsset.destroy()
**Kind**: instance method of [<code>TextureAtlasAsset</code>](#TextureAtlasAsset)  
<a name="loadAllSources"></a>

## loadAllSources()
Convert list of sources that are either Image instances or URL strings to fully loaded Image instances.
Wait for image loading if needed.

**Kind**: global function  
